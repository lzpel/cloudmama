import "@typespec/http";

using Http;
@service(#{ title: "Sarod" })
@server("/api", "開発用")
namespace DemoService;

model Response<code extends numeric, Body> {
	@statusCode statusCode: code;
	@body body: Body;
}
model NoContentResponse is Response<204, null>;
model BadRequestResponse is Response<400, string>;
model ForbiddenResponse is Response<403, null>;
model NotFoundResponse is Response<404, null>;
@format("uuid")
scalar UUID extends string;

model User {
	id: UUID;//一意
	name: string;//名前
	path_profile: string;//アイコン
	pay_customer: string;//stripe でのユーザーid
	pay_subscription: string;//stripe でのサブスクリプションid
	auth_email: string;
	auth_google: string;
	auth_email_password: string;
	is_active: boolean;
}

model Page {
	id: UUID;//一意
	id_root: UUID;//親
	name: string;//名前
	content: string;//名前
	path_model: string;
	path_image: string[];
	view_image: string[];
	script: string;
	progress: int32;// 0 未開始 1-99 進行中 100 完了 101+ エラー
}

@route("/auth")
interface AuthApi {
	@doc("""
		指定メールアドレスにそのメールアドレスが正しいことを確認するリンクを送ります
		そのリンクを踏んだ人だけがユーザー追加画面にたどり着けます
		uri: コールバック用にドメインをフロントエンドから抽出する
		email: メールアドレス
	""")
	@route("/email") @post email(email: string): NoContentResponse | BadRequestResponse;
	@doc("""
		google ログイン
	""")
	@route("/google") @get google(): string;
	@doc("""
		ユーザーを追加します
		oauth コールバック用
	""")
	@route("/callback_oauth") @get callback_oauth(@query code: string, @query state: string): string|BadRequestResponse;
	@doc("""
		ログアウト
	""")
	@route("/out") @get out(): NoContentResponse;
	@doc("""
		メインストレージ用、返値は名目上stringだが、実際にはストリーミングされたバイナリ
	""")
	@route("/s/{path_file}") @get s3get(@path path_file: string): string | NotFoundResponse;
	@doc("""
		大容量ファイルを一次的な領域にアップロードするためのurlを返します
	""")
	@route("/s") @get s3url(@query fileName: string, @query expiresIn?: int32): string[] | BadRequestResponse;
}

@useAuth(BearerAuth)
@route("/user")
interface UserApi {
	@doc("""
		ユーザーを削除します、認証が必要
	""")
	@delete user_pop(): NoContentResponse | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ユーザー情報を取得します、認証が必要
	""")
	@get user_get(): User | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ユーザーの名前やプロフィールの設定を行う、認証が必要
	""")
	@post user_set(user: User): User | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ユーザーの課金操作はここに飛ぶ
		支払いページへのURLを返す
	""")
	@route("/plan/{plan}")
	@post user_pay_plan(@path plan: int32): string | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ユーザーの課金結果はここで検証され、ユーザーの課金情報が変更される
	""")
	@route("/session")
	@get user_pay_session(@query session: string): User | ForbiddenResponse | BadRequestResponse;
}

// 一個一個の動画を編集する
@useAuth(BearerAuth)
@route("/page")
interface PageApi {
	@doc("""
		動画を追加/更新します、認証が必要
	""")
	@post push(
		path_image: string[],
		view_image: string[],
		script: string,
	): Page | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ホーム画面用の動画一覧を返します、認証が必要
	""")
	@get get(): Page[] | ForbiddenResponse | BadRequestResponse;
	@doc("""
		動画を削除します、認証が必要
	""")
	@route("/{id}")
	@delete delete(@path id: UUID): NoContentResponse | ForbiddenResponse | BadRequestResponse;
}
// 一個一個の動画を編集する
@route("/task")
interface TaskApi {
	@doc("""
		生成物をアップロードします
	""")
	@route("/{id}/{object}")
	@post push(
		@path id: string,
		@path object: string,
	): Page | ForbiddenResponse | BadRequestResponse;
	@doc("""
		未処理の生成タスク一覧を返します
	""")
	@get get(): Page[] | ForbiddenResponse | BadRequestResponse;
}