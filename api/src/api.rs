use crate::auth::TokenJwtGenerator;
use crate::auth::{self, OAuth};
use crate::collection::{Collection, OrderBy};
use crate::out::{self, Page};
use firestore;
use uuid::Uuid;

pub struct Api {
	google: auth::OAuth,
	db: firestore::FirestoreDb,
	s3_temp: ngoni::s3::S3Storage,
	s3_main: ngoni::s3::S3Storage,
	stripe: ngoni::stripe::Stripe,
}
impl Api {
	pub async fn new() -> Result<Self, String> {
		dotenvy::from_filename("secret/.env").ok();
		Ok(Self {
			google: OAuth::load(
				"secret/sarod_oauth_google_676186616609-tvidvbklos7q5poilss55ookecj6vr14.apps.googleusercontent.com.json",
				Some("web"),
			)?,
			db: firestore::FirestoreDb::with_options_service_account_key_file(
				firestore::FirestoreDbOptions::new("lzpel-net".into())
					.with_database_id("sarod".into()),
				"secret/sarod_firestore.json".into(),
			)
			.await
			.map_err(|v| v.to_string())?,
			s3_temp: ngoni::s3::S3Storage::new(
				&std::env::var("S3_TEMP")
					.unwrap_or("sarodstack-temp3a4f7567-qbdbrpfmwtb6".to_string()),
			)
			.await,
			s3_main: ngoni::s3::S3Storage::new(
				&std::env::var("S3_MAIN")
					.unwrap_or("sarodstack-main7ad10839-yb9blus9myx7".to_string()),
			)
			.await,
			stripe: ngoni::stripe::Stripe::new(
				std::env::var("STRIPE_SECRET_KEY").unwrap_or_default(),
			),
		})
	}
	pub fn jwt_get(
		req: impl AsRef<axum::http::Request<axum::body::Body>>,
	) -> Option<auth::TokenJwt> {
		// AuthorizationヘッダではなくCookieのtokenで認証する：取得関数

		// Cookie ヘッダを文字列として取得
		let cookie_header = req
			.as_ref()
			.headers()
			.get(axum::http::header::COOKIE)
			.and_then(|v| v.to_str().ok())?;

		// "a=b; token=xxx.yyy.zzz; c=d" みたいな文字列から token の値だけ抜き出す
		let token = cookie_header
			.split(';')
			.map(|s| s.trim())
			.find_map(|pair| {
				let mut parts = pair.splitn(2, '=');
				let name = parts.next()?.trim();
				let value = parts.next()?.trim();
				(name == "token").then(|| value)
			})?;
		out::User::validate_jwt(token).ok()
	}
	pub fn jwt_set(v: Option<impl TokenJwtGenerator>) -> axum::http::Response<axum::body::Body> {
		// AuthorizationヘッダではなくCookieのtokenで認証する：設定関数
		let jwt = v
			.map(|v| (v.signed_jwt(), v.jwt().age().unwrap_or(86400)))
			.unwrap_or_default();
		axum::response::Response::builder()
			.status(axum::http::StatusCode::TEMPORARY_REDIRECT)
			.header(
				"Set-Cookie",
				format!("token={}; Path=/; Max-Age={}", jwt.0, jwt.1),
			)
			.header(axum::http::header::LOCATION, "/")
			.body(axum::body::Body::from(jwt.0))
			.unwrap()
	}
}
impl out::ApiInterface for Api {
	async fn authorize(
		&self,
		req: axum::http::Request<axum::body::Body>,
	) -> Result<out::AuthContext, String> {
		// まだどのタイプの認証方式が指定されているのか見分けていない
		// Cookie ヘッダを文字列として取得
		let cookie_header = req
			.headers()
			.get(axum::http::header::COOKIE)
			.and_then(|v| v.to_str().ok())
			.unwrap_or_default();
		// "a=b; token=xxx.yyy.zzz; c=d" みたいな文字列から token の値だけ抜き出す
		let token = cookie_header
			.split(';')
			.map(|s| s.trim())
			.find_map(|pair| {
				let mut parts = pair.splitn(2, '=');
				let name = parts.next()?.trim();
				let value = parts.next()?.trim();
				(name == "token").then(|| value)
			})
			.unwrap_or_default();
		out::User::validate_jwt(token)
			.map(|v| out::AuthContext {
				subject: v.sub.to_string(),
				subject_id: uuid::Uuid::parse_str(&v.sub).unwrap().as_u128(),
				..Default::default()
			})
			.map_err(|v| v.to_string())
	}
	async fn authapi_email(&self, req: out::AuthapiEmailRequest) -> out::AuthapiEmailResponse {
		let origin = out::origin_from_request(&req.request).unwrap_or_default();
		let language = language_from_headers(&req.request.headers()).unwrap_or_default();
		let (subject, body) = auth::email::validate_email(
			"Plant Mimamori",
			&language,
			&origin,
			&format!(
				"{origin}/register?token={}",
				auth::email::jwt_from_email(&req.body.email)
			),
			"2025-12-20",
			"support@surfic.com",
		);
		match ngoni::ses::send_email("info@surfic.com", &req.body.email, &subject, &body).await {
			Ok(_) => return out::AuthapiEmailResponse::Status204,
			Err(e) => return out::AuthapiEmailResponse::Status400(e.to_string()),
		}
	}
	async fn authapi_google(&self, req: out::AuthapiGoogleRequest) -> out::AuthapiGoogleResponse {
		let base_redirect_url = out::origin_from_request(&req.request).unwrap_or_default();
		let redirect_uri = self
			.google
			.redirect_uri(&format!("{base_redirect_url}/api/auth/callback_oauth"));
		//?state=019ae005-152c-7971-b81f-a60c749498b1&code=4%2F0Ab32j91qKnhNiU2ELrr4xE2579NVRRrVlZGMcaeJRIib8U_WDIeXt1axRTc2rdppI9XGEA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent
		out::AuthapiGoogleResponse::Raw(
			axum::response::Response::builder()
				.status(axum::http::StatusCode::TEMPORARY_REDIRECT)
				.header(axum::http::header::LOCATION, redirect_uri) // リダイレクト先のURLを Location ヘッダーに設定
				.body(axum::body::Body::empty()) //				// ボディがないため、空のボディを設定してビルド
				.unwrap(),
		)
	}
	async fn authapi_callback_oauth(
		&self,
		req: out::AuthapiCallbackOauthRequest,
	) -> out::AuthapiCallbackOauthResponse {
		let inner = async || -> Result<_, String> {
			let a = self.google.callback(&req.state, &req.code).await?;
			let b = a.jwt()?;
			let c = out::User::query(
				&self.db,
				|q: crate::collection::FilterBuilder| q.field("auth_google").eq(&b.sub),
				None,
				None,
				None,
			)
			.await?;
			let w = if let Some(d) = c.first() {
				d.clone()
			} else {
				let r = out::User {
					id: Uuid::now_v7(),
					name: b.name,
					path_profile: b.picture.unwrap(),
					auth_email: b.email,
					auth_google: b.sub,
					is_active: true,
					..Default::default()
				};
				r.push(&self.db).await.map(|_| r)?
			};
			Ok(w)
		};
		match inner().await {
			Err(e) => out::AuthapiCallbackOauthResponse::Status400(e),
			Ok(v) => {
				let jwt = v.jwt();
				let jwt_str = v.signed_jwt();
				out::AuthapiCallbackOauthResponse::Raw(
					axum::response::Response::builder()
						.status(axum::http::StatusCode::TEMPORARY_REDIRECT)
						.header(
							"Set-Cookie",
							format!(
								"token={jwt_str}; Path=/; Max-Age={age}",
								age = jwt.age().unwrap_or(86400)
							),
						)
						.header(axum::http::header::LOCATION, "/")
						.body(axum::body::Body::from(jwt_str))
						.unwrap(),
				)
			}
		}
	}
	async fn authapi_out(&self, _req: out::AuthapiOutRequest) -> out::AuthapiOutResponse {
		out::AuthapiOutResponse::Raw(Self::jwt_set(None::<out::User>))
	}
	async fn authapi_s3get(&self, req: out::AuthapiS3getRequest) -> out::AuthapiS3getResponse {
		match self.s3_main.read(&req.path_file).await {
			Ok((meta, data)) => out::AuthapiS3getResponse::Raw(
				axum::response::Response::builder()
					.status(axum::http::StatusCode::OK)
					.header(
						"content-type",
						meta.content_type
							.unwrap_or("application/octet-stream".to_string()),
					)
					.body(axum::body::Body::from(data))
					.unwrap(),
			),
			Err(_e) => out::AuthapiS3getResponse::Status404,
		}
	}
	async fn authapi_s3url(&self, req: out::AuthapiS3urlRequest) -> out::AuthapiS3urlResponse {
		// 指定されたファイル名と有効期限で署名付きURLを生成します
		// s3のcors設定でallowed originに送信元を入れないとエラーになります
		let expires = std::time::Duration::from_secs(req.expiresIn.unwrap_or(3600) as u64);
		//拡張子を維持したまま名前をuuidに
		let path = std::path::PathBuf::from(uuid::Uuid::now_v7().to_string());
		let path = std::path::Path::new(&req.fileName)
			.extension()
			.map(|v| path.with_extension(v))
			.unwrap_or(path);
		match self
			.s3_temp
			.presign_write_url(&path.to_string_lossy(), expires)
			.await
		{
			Ok(url) => out::AuthapiS3urlResponse::Status200(
				[path.to_string_lossy().to_string(), url].to_vec(),
			),
			Err(e) => out::AuthapiS3urlResponse::Status400(e.to_string()),
		}
	}
	async fn userapi_user_pop(
		&self,
		req: out::UserapiUserPopRequest,
	) -> out::UserapiUserPopResponse {
		let Some(v) = Self::jwt_get(req) else {
			return out::UserapiUserPopResponse::Status403;
		};
		match out::User::pop(&self.db, &v.sub).await {
			Ok(_) => out::UserapiUserPopResponse::Status204,
			Err(e) => out::UserapiUserPopResponse::Status400(e),
		}
	}
	async fn userapi_user_get(
		&self,
		req: out::UserapiUserGetRequest,
	) -> out::UserapiUserGetResponse {
		let Some(v) = Self::jwt_get(req) else {
			return out::UserapiUserGetResponse::Status403;
		};
		match out::User::get(&self.db, &v.sub).await {
			Ok(u) => out::UserapiUserGetResponse::Status200(u),
			Err(e) => out::UserapiUserGetResponse::Status400(e),
		}
	}
	async fn pageapi_get(&self, req: out::PageapiGetRequest) -> out::PageapiGetResponse {
		// q.field("progress").lessthan0を指定するならOrderByにprogressを設定するしかないという制約があるので0か否かに限定した。
		// どちらにせよインデックスの作成が必要
		match Page::query(
			&self.db,
			|q: crate::collection::FilterBuilder| {
				q.field("id_root")
					.equal(uuid::Uuid::from_u128(req.security.subject_id).to_string())
			},
			Some(OrderBy::Desc("id")),
			None,
			Some(100),
		)
		.await
		{
			Ok(v) => out::PageapiGetResponse::Status200(v),
			Err(e) => out::PageapiGetResponse::Status400(format!("{:?}", e)),
		}
	}
	async fn pageapi_push(&self, req: out::PageapiPushRequest) -> out::PageapiPushResponse {
		let err = |msg: &str| out::PageapiPushResponse::Status400(msg.to_string());
		// view_imageとpath_imageのサイズが等しいこと
		if req.body.path_image.len() != req.body.view_image.len() {
			return err("path_image and view_image size is not equal");
		}
		for (i, j) in req.body.path_image.iter().zip(req.body.view_image.iter()) {
			let v = self.s3_temp.head(i).await;
			if let Ok(v) = v {
				if v.content_length < 1024 * 1024 * 10
					&& ["front", "back", "left", "right", "top", "bottom", "side"]
						.iter()
						.any(|v| v == j)
				{
					continue;
				}
			}
			return err("more than 10MB or invalid view_image");
		}
		let uuid = Uuid::now_v7();
		let path_image_new: Vec<String> = req
			.body
			.view_image
			.iter()
			.map(|v| format!("{}/{}", uuid, v))
			.collect();
		// コピー
		for (i, j) in req.body.path_image.iter().zip(path_image_new.iter()) {
			if let Ok(_) = self.s3_main.copy(Some(&self.s3_temp.bucket), i, j).await {
				continue;
			}
			return err(&format!(
				"failed to copy image: {} {} {}",
				self.s3_temp.bucket, i, j
			));
		}
		let page = Page {
			id: uuid,
			id_root: uuid::Uuid::from_u128(req.security.subject_id),
			view_image: req.body.view_image.clone(),
			path_image: path_image_new,
			progress: 0,
			..Default::default()
		};
		return match page.push(&self.db).await {
			Ok(_) => out::PageapiPushResponse::Status200(Default::default()),
			Err(e) => err(&format!("{:?}", e)),
		};
	}
	async fn pageapi_delete(&self, req: out::PageapiDeleteRequest) -> out::PageapiDeleteResponse {
		// Firestoreから該当するPageドキュメントを取得
		let page = match out::Page::get(&self.db, &req.id.to_string()).await {
			Ok(v) => v,
			Err(e) => {
				return out::PageapiDeleteResponse::Status400(format!("page not found: {}", e));
			}
		};

		// id_rootとreq.security.subject_idが一致するか確認（所有権の確認）
		if page.id_root != uuid::Uuid::from_u128(req.security.subject_id) {
			return out::PageapiDeleteResponse::Status403;
		}

		// 削除実行
		match out::Page::pop(&self.db, &req.id.to_string()).await {
			Ok(_) => out::PageapiDeleteResponse::Status204,
			Err(e) => {
				out::PageapiDeleteResponse::Status400(format!("failed to delete page: {}", e))
			}
		}
	}
	async fn taskapi_get(&self, _req: out::TaskapiGetRequest) -> out::TaskapiGetResponse {
		// q.field("progress").lessthan0を指定するならOrderByにprogressを設定するしかないという制約があるので0か否かに限定した。
		// どちらにせよインデックスの作成が必要
		match Page::query(
			&self.db,
			|q: crate::collection::FilterBuilder| q.field("progress").equal(0),
			Some(OrderBy::Asc("id")),
			None,
			Some(10),
		)
		.await
		{
			Ok(v) => out::TaskapiGetResponse::Status200(v),
			Err(e) => out::TaskapiGetResponse::Status400(format!("{:?}", e)),
		}
	}
	async fn taskapi_push(&self, req: out::TaskapiPushRequest) -> out::TaskapiPushResponse {
		// リクエストIDをUUIDとしてパース
		let id = match Uuid::parse_str(&req.id) {
			Ok(v) => v,
			Err(e) => return out::TaskapiPushResponse::Status400(format!("invalid id: {}", e)),
		};

		// Firestoreから該当するPageドキュメントを取得
		let mut page = match out::Page::get(&self.db, &id.to_string()).await {
			Ok(v) => v,
			Err(e) => return out::TaskapiPushResponse::Status400(format!("page not found: {}", e)),
		};

		// モデルファイルのコピー（s3_temp -> s3_main）
		// コピー先のパスを決定（例: {page_id}/model.glb）
		let path_model_new = format!("{}/model.glb", id);
		match self
			.s3_main
			.copy(Some(&self.s3_temp.bucket), &req.object, &path_model_new)
			.await
		{
			Ok(_) => {}
			Err(e) => {
				return out::TaskapiPushResponse::Status400(format!("failed to move model: {}", e));
			}
		};

		// Pageドキュメントの更新
		page.path_model = path_model_new;
		page.progress = 100;

		// 更新内容をFirestoreに保存
		match page.update(&self.db).await {
			Ok(_) => out::TaskapiPushResponse::Status200(page),
			Err(e) => {
				out::TaskapiPushResponse::Status400(format!("failed to update page: {:?}", e))
			}
		}
	}
	async fn userapi_user_pay_plan(
		&self,
		req: out::UserapiUserPayPlanRequest,
	) -> out::UserapiUserPayPlanResponse {
		let Some(_v) = Self::jwt_get(&req) else {
			return out::UserapiUserPayPlanResponse::Status400("invalid jwt".to_string());
		};
		let mut user = match out::User::get(&self.db, &req.security.subject.to_string()).await {
			Ok(v) => v,
			Err(e) => {
				return out::UserapiUserPayPlanResponse::Status400(format!(
					"user not found: {}",
					e
				));
			}
		};

		// 顧客IDがない場合は作成する
		if user.pay_customer.is_empty() {
			match self
				.stripe
				.create_customer(&user.name, &user.auth_email, &user.id.to_string())
				.await
			{
				Ok(w) => {
					user.pay_customer = w.id.as_str().to_string();
					if let Err(e) = user.update(&self.db).await {
						return out::UserapiUserPayPlanResponse::Status400(format!(
							"failed to update user with customer id: {}",
							e
						));
					}
				}
				Err(e) => {
					return out::UserapiUserPayPlanResponse::Status400(format!(
						"failed to create stripe customer: {}",
						e
					));
				}
			}
		}

		let origin = out::origin_from_request(&req.request).unwrap_or_default();
		// ngoniを使ってサブスクリプションセッションを作成
		let session = self
			.stripe
			.create_subscription_session(
				&user.pay_customer,
				Some(&user.id.to_string()),
				ngoni::stripe::StripeOrder {
					name: "sushi3d unlimited plan".to_string(),
					id: "1".to_string(),
					currency: ngoni::stripe::Currency::USD,
					price: 600, // $6.00 (仮)
					quantity: 1,
				},
				ngoni::stripe::Interval::Month,
				&format!("{origin}/success"),
				&format!("{origin}/cancel"),
			)
			.await;

		match session {
			Ok(s) => {
				if let Some(url) = s.url {
					out::UserapiUserPayPlanResponse::Status200(url)
				} else {
					out::UserapiUserPayPlanResponse::Status400(
						"failed to generate stripe checkout url".to_string(),
					)
				}
			}
			Err(e) => out::UserapiUserPayPlanResponse::Status400(e.to_string()),
		}
	}
	async fn userapi_user_pay_session(
		&self,
		req: out::UserapiUserPaySessionRequest,
	) -> out::UserapiUserPaySessionResponse {
		let session = match self
			.stripe
			.get_checkout_session(&req.session, &["subscription"])
			.await
		{
			Ok(v) => v,
			Err(e) => {
				return out::UserapiUserPaySessionResponse::Status400(format!(
					"failed to retrieve checkout session: {}",
					e
				));
			}
		};
		let metadata = match session.metadata {
			Some(v) => v,
			None => {
				return out::UserapiUserPaySessionResponse::Status400(
					"no metadata found in session".to_string(),
				);
			}
		};
		let subscription = match session.subscription {
			Some(v) => v,
			None => {
				return out::UserapiUserPaySessionResponse::Status400(
					"no subscription found in session".to_string(),
				);
			}
		};
		let id_root = match metadata.get("id_root") {
			Some(v) => v.to_string(),
			None => {
				return out::UserapiUserPaySessionResponse::Status400(
					"no user_id found in metadata".to_string(),
				);
			}
		};
		let mut user = match out::User::get(&self.db, &id_root).await {
			Ok(v) => v,
			Err(e) => {
				return out::UserapiUserPaySessionResponse::Status400(format!(
					"user not found: {}",
					e
				));
			}
		};
		user.pay_subscription = subscription.id().to_string();
		match user.update(&self.db).await {
			Ok(_) => Default::default(),
			Err(e) => out::UserapiUserPaySessionResponse::Status400(e.to_string()),
		}
	}
}

pub fn language_from_headers(
	headers: &axum::http::HeaderMap<axum::http::HeaderValue>,
) -> Option<String> {
	headers
		.get(axum::http::header::ACCEPT_LANGUAGE)
		.and_then(|v| v.to_str().ok())
		.map(str::trim)
		.filter(|s| !s.is_empty())
		.map(str::to_string)
}

impl Collection for out::User {
	fn collection_name() -> &'static str {
		"user"
	}
	fn document_id(&self) -> String {
		self.id.to_string()
	}
}
impl Collection for out::Page {
	fn collection_name() -> &'static str {
		"page"
	}
	fn document_id(&self) -> String {
		self.id.to_string()
	}
}

impl TokenJwtGenerator for out::User {
	fn secret() -> &'static [u8] {
		b"abc"
	}
	fn jwt(&self) -> auth::TokenJwt {
		let o = auth::TokenJwt {
			sub: self.id.to_string(),
			email: self.auth_email.clone(),
			name: self.name.clone(),
			picture: Some(self.path_profile.clone()),
			..Default::default()
		};
		println!("{:?}", o);
		o
	}
}
