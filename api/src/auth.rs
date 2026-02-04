use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct OAuth {
	pub client_id: String,
	pub client_secret: String,
	pub token_uri: String,
	pub auth_uri: String,
}

impl OAuth {
	const SEPRATOR: &str = ">>>";
	//JSONファイル内の特定のフィールド（またはトップレベル）をターゲットとしてOAuthにパース
	pub fn load(path: &str, field: Option<&str>) -> Result<Self, String> {
		// 1. ファイルを読み込む
		let data =
			std::fs::read_to_string(path).map_err(|e| format!("ファイル読み込みエラー: {}", e))?;
		// 2. JSON全体をserde_json::Valueとしてパースする
		let value: serde_json::Value =
			serde_json::from_str(&data).map_err(|e| format!("JSONパースエラー: {}", e))?;
		let target_value = if let Some(field_name) = field {
			value.get(field_name).ok_or_else(|| {
				format!(
					"指定されたフィールド '{}' がJSONに見つかりません",
					field_name
				)
			})?
		} else {
			&value
		};
		let oauth: Self = serde_json::from_value(target_value.clone())
			.map_err(|e| format!("OAuth構造体へのデシリアライズエラー: {}", e))?;
		Ok(oauth)
	}
	pub fn redirect_uri(&self, redirect_uri: &str) -> String {
		let start_time = timestamp();
		format!(
			"{auth_uri}?client_id={client_id}&redirect_uri={redir}&response_type=code&scope=openid%20email%20profile&state={state}",
			auth_uri = self.auth_uri,
			client_id = self.client_id,
			redir = encode::url_encode(&redirect_uri),
			state = encode::url_encode(&format!("{redirect_uri}{}{start_time}", Self::SEPRATOR)),
		)
	}
	pub async fn callback(&self, state: &str, code: &str) -> Result<TokenResponse, String> {
		let state_decoded = encode::url_decode(state).map_err(|e| e.to_string())?;
		let redirect_uri = state_decoded
			.split(Self::SEPRATOR)
			.next()
			.ok_or(format!("Invalid oauth state:{state}"))?;
		let form = [
			("code", code),
			("client_id", &self.client_id),
			("client_secret", &self.client_secret),
			("redirect_uri", &redirect_uri),
			("grant_type", "authorization_code"),
		];
		let client = reqwest::Client::new();
		let request = client
			.post(&self.token_uri)
			.form(&form)
			.build()
			.map_err(|e| format!("Invalid request: {e}"))?;
		let response = client
			.execute(request)
			.await
			.map_err(|e| format!("HTTP request failed: {e}"))?;
		if response.status().is_success() {
			let tokens = response
				.json::<TokenResponse>()
				.await
				.map_err(|e| format!("Failed to parse JSON: {e}"))?;
			return Ok(tokens);
		} else {
			let status = response.status();
			let text = response
				.text()
				.await
				.unwrap_or_else(|_| "<body read error>".into());
			return Err(format!("token endpoint returned error {status}: {text}"));
		}
	}
}

#[derive(Deserialize, Debug)]
pub struct TokenResponse {
	access_token: String,
	expires_in: u64,
	refresh_token: Option<String>,
	scope: String,
	token_type: String,
	id_token: Option<String>, // OIDC の場合これがメイン
}

impl TokenResponse {
	//jsonwebtoken::でsubを取り出して
	pub fn jwt(&self) -> Result<TokenJwt, String> {
		// 1. id_token が存在するか確認
		let token_str = self.id_token.as_ref().ok_or("no id_token")?;

		// 2. 検証設定を作成 (署名検証を無効化)
		let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
		validation.insecure_disable_signature_validation();
		validation.validate_exp = false; // 有効期限切れでもIDだけ取りたい場合はfalse、厳密にするならtrue
		validation.validate_aud = false; // Audienceチェックもスキップ

		// 3. デコード実行
		// 署名検証しないので Key はダミーでOK
		let dummy_key = jsonwebtoken::DecodingKey::from_secret(&[]);

		let token_data = jsonwebtoken::decode::<TokenJwt>(token_str, &dummy_key, &validation)
			.map_err(|e| e.to_string())?; // デコード失敗時は None を返す

		// 4. sub を返す
		Ok(token_data.claims)
	}
}

// Jwtの情報を詰めた構造体// JWTのペイロードとして使用する構造体
#[derive(Default, Debug, Deserialize, Serialize)]
pub struct TokenJwt {
	// 必須となる標準クレーム
	pub exp: Option<usize>, // Expiration time (有効期限)
	pub iat: Option<usize>, // Issued At (発行時刻)
	pub sub: String,
	pub email: String,
	pub name: String,
	pub picture: Option<String>,
}
impl TokenJwt {
	pub fn age(&self) -> Option<usize> {
		match (self.exp, self.iat) {
			(Some(a), Some(b)) => Some(a - b),
			_ => None,
		}
	}
}
// フロントエンドで使える検証可能なJwt文字列を出力するtrait
pub trait TokenJwtGenerator {
	fn jwt(&self) -> TokenJwt;
	fn secret() -> &'static [u8];
	//署名
	fn signed_jwt(&self) -> String {
		// 1. クレームの取得
		let claims = TokenJwt {
			iat: Some(timestamp()),
			exp: Some(timestamp() + 60 * 60),
			..self.jwt()
		};
		// 2. エンコード
		let header = jsonwebtoken::Header::default();
		let encoding_key = jsonwebtoken::EncodingKey::from_secret(&Self::secret());
		jsonwebtoken::encode(&header, &claims, &encoding_key).unwrap()
	}
	// 検証
	fn validate_jwt(signed_jwt: &str) -> Result<TokenJwt, jsonwebtoken::errors::Error> {
		let decoding_key = jsonwebtoken::DecodingKey::from_secret(&Self::secret());
		// Validation::default() は exp, iat, sub の存在などを標準的に検証します
		let token_data = jsonwebtoken::decode::<TokenJwt>(
			signed_jwt,
			&decoding_key,
			&jsonwebtoken::Validation::default(),
		)?;
		//有効期限チェック  jsonwebtoken::decodeでもやっていると聞くが念のため
		if let Some(v) = token_data.claims.exp {
			if v < timestamp() {
				return Err(jsonwebtoken::errors::Error::from(
					jsonwebtoken::errors::ErrorKind::ExpiredSignature,
				));
			}
		}
		// 検証が成功した場合、デコードされたクレームを返す
		Ok(token_data.claims)
	}
}

// 現在時刻をUnix時間に変換する
pub fn timestamp() -> usize {
	let now = std::time::SystemTime::now();
	let duration_since_epoch = now
		.duration_since(std::time::SystemTime::UNIX_EPOCH)
		.expect("SystemTime is before UNIX_EPOCH");
	// Durationをミリ秒数 (u128) に変換
	duration_since_epoch.as_secs() as usize
}

pub mod email {
	use crate::auth::TokenJwtGenerator;
	struct Email {
		email: String,
	}
	impl TokenJwtGenerator for Email {
		fn jwt(&self) -> super::TokenJwt {
			super::TokenJwt {
				sub: self.email.clone(),
				exp: Some(super::timestamp() + 60 * 60),
				..Default::default()
			}
		}
		fn secret() -> &'static [u8] {
			b"email_secret"
		}
	}
	pub fn jwt_from_email(email: &str) -> String {
		let jwt = Email {
			email: email.to_string(),
		};
		jwt.signed_jwt()
	}

	pub fn jwt_into_email(jwt: &str) -> String {
		Email::validate_jwt(jwt).unwrap().sub
	}

	pub fn validate_email(
		service_name: &str,
		language: &str,
		url_origin: &str,
		url_verification: &str,
		expiration_time: &str,
		support_email: &str,
	) -> (String, String) {
		let is_ja = language.contains("ja");
		let subject = if is_ja {
			format!("ユーザー登録のご案内")
		} else {
			format!("User registration confirmation")
		};
		let body = if is_ja {
			format!(
				"{service_name} をご利用いただきありがとうございます。

以下のリンクをクリックすると、ユーザー登録画面に遷移します。

▼ メールアドレスを確認する
{url_verification}

※ このリンクの有効期限は {expiration_time} です。

もしこのメールに心当たりがない場合は、
どなたかが誤ってこのメールアドレスを入力した可能性があります。
その場合は、このメールを破棄してください。操作は不要です。

ご不明な点がありましたら、以下のメールアドレスにお問い合わせください。
{support_email}

今後とも {service_name} をよろしくお願いいたします。

――――――――――
{service_name}
{url_origin}
――――――――――"
			)
		} else {
			format!(
				"Thank you for your interest in {service_name}.

Please click the link below to verify your email address and sign up.

▼ Verify your email address
{url_verification}

This link will expire in {expiration_time}.

If you did not request to create an account,
it is possible that someone entered your email address by mistake.
In that case, you can safely ignore this email—no action is required.

If you have any questions, please contact us via the following email:
{support_email}

Thank you,
and we hope you enjoy using {service_name}.

――――――――――
{service_name}
{url_origin}
――――――――――"
			)
		};
		return (subject, body);
	}
}

pub mod encode {
	pub fn url_encode(input: &str) -> String {
		let mut out = String::new();
		for b in input.bytes() {
			let c = b as char;
			// RFC 3986 unreserved: ALPHA / DIGIT / "-" / "." / "_" / "~"
			if c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.' || c == '~' {
				out.push(c);
			} else {
				out.push('%');
				out.push(hex_digit(b >> 4));
				out.push(hex_digit(b & 0x0F));
			}
		}
		out
	}

	pub fn url_decode(input: &str) -> Result<String, &'static str> {
		let mut out = String::new();
		let bytes = input.as_bytes();
		let mut i = 0;

		while i < bytes.len() {
			match bytes[i] {
				b'%' => {
					if i + 2 >= bytes.len() {
						return Err("incomplete percent-encoding");
					}

					let hi = from_hex_digit(bytes[i + 1]).ok_or("invalid hex")?;
					let lo = from_hex_digit(bytes[i + 2]).ok_or("invalid hex")?;

					out.push(((hi << 4) | lo) as char);
					i += 3;
				}
				_ => {
					out.push(bytes[i] as char);
					i += 1;
				}
			}
		}

		Ok(out)
	}

	fn hex_digit(n: u8) -> char {
		match n {
			0..=9 => (b'0' + n) as char,
			10..=15 => (b'A' + (n - 10)) as char,
			_ => unreachable!(),
		}
	}
	fn from_hex_digit(c: u8) -> Option<u8> {
		match c {
			b'0'..=b'9' => Some(c - b'0'),
			b'a'..=b'f' => Some(c - b'a' + 10),
			b'A'..=b'F' => Some(c - b'A' + 10),
			_ => None,
		}
	}
}

//test
#[cfg(test)]
mod tests {
	use super::*;
	// トレイトを実装するためのダミー構造体
	#[derive(Debug)]
	pub struct TestUserRecord {
		pub id: String,
		pub user_email: String,
		pub full_name: String,
	}

	impl TokenJwtGenerator for TestUserRecord {
		fn secret() -> &'static [u8] {
			b"TEST_SECRET_KEY_FOR_JWT"
		}

		fn jwt(&self) -> TokenJwt {
			TokenJwt {
				exp: None, // signed_jwt() で設定するため None
				iat: None, // signed_jwt() で設定するため None
				sub: self.id.clone(),
				email: self.user_email.clone(),
				name: self.full_name.clone(),
				picture: None,
			}
		}
	}
	#[test]
	fn test_jwt_sign_and_validate_success() {
		// 1. データ準備
		let user_data = TestUserRecord {
			id: "u_456abc".to_string(),
			user_email: "test@example.com".to_string(),
			full_name: "Test User".to_string(),
		};

		// 2. 署名 (エンコード)
		let signed_token = user_data.signed_jwt();

		// 3. 検証 (デコード)
		let claims = TestUserRecord::validate_jwt(&signed_token).expect("JWT検証に失敗しました");

		// 4. 結果の検証
		// sub, email, name が元のデータと一致するか
		assert_eq!(claims.sub, user_data.id);
		assert_eq!(claims.email, user_data.user_email);
		assert_eq!(claims.name, user_data.full_name);

		// iat と exp が設定され、有効であるか
		assert!(claims.iat.is_some());
		assert!(claims.exp.is_some());
		println!("Test successful: Token valid for sub: {}", claims.sub);
	}

	#[test]
	fn test_jwt_validation_failure_bad_secret() {
		// 1. データ準備と署名 (正しい秘密鍵を使用)
		let user_data = TestUserRecord {
			id: "u_fail".to_string(),
			user_email: "fail@example.com".to_string(),
			full_name: "Fail User".to_string(),
		};
		let signed_token = user_data.signed_jwt();

		// 2. 異なる秘密鍵を使ってデコードを試みる
		// TokenJwtGenerator を直接使わず、外部から偽の検証を実行するケースを想定
		let wrong_key = jsonwebtoken::DecodingKey::from_secret(b"WRONG_SECRET_KEY_FOR_JWT");

		let result = jsonwebtoken::decode::<TokenJwt>(
			&signed_token,
			&wrong_key,
			&jsonwebtoken::Validation::default(),
		);

		// 3. 結果の検証: 署名検証エラー (InvalidSignature) が返ることを確認
		assert!(result.is_err());
		assert_eq!(
			result.unwrap_err().kind(),
			&jsonwebtoken::errors::ErrorKind::InvalidSignature
		);
		println!("Test successful: Validation failed with wrong key.");
	}
}
