mod api;
mod auth;
mod collection;
#[allow(dead_code, unused_variables, unused_imports, non_snake_case)]
mod out;
#[tokio::main]
async fn main() {
	let server = api::Api::new().await.expect("cannot connect database");
	let port: u16 = std::env::var("PORT")
		.unwrap_or("8080".to_string())
		.parse()
		.expect("PORT should be integer");
	out::print_axum_router(port);
	let app = out::axum_router(server).fallback(frontend);
	let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
		.await
		.unwrap();
	println!("serve on http://localhost:{port}/");
	axum::serve(listener, app.clone())
		.with_graceful_shutdown(async move {
			tokio::signal::ctrl_c().await.unwrap();
		})
		.await
		.unwrap();
}

#[cfg(not(feature = "frontend"))]
async fn frontend(_uri: axum::http::Uri) -> axum::response::Response<axum::body::Body> {
	return axum::response::Response::builder()
		.status(axum::http::status::StatusCode::NOT_FOUND)
		.body(axum::body::Body::from("not found"))
		.unwrap();
}
#[cfg(feature = "frontend")]
async fn frontend(uri: axum::http::Uri) -> axum::response::Response<axum::body::Body> {
	#[derive(rust_embed::Embed)]
	#[folder = "out"] // ← このフォルダ配下をバイナリに埋め込む
	struct Assets;
	// /foo/bar → "foo/bar"
	let mut path = std::path::PathBuf::from(uri.path().trim_start_matches("/"));
	// ディレクトリっぽいアクセスは index.html
	if path.file_name().is_none() {
		path.push("index.html");
	} else if path.extension().is_none() {
		path.set_extension("html");
	}
	// MIME type 推論
	let mime = mime_guess::from_path(&path)
		.first()
		.map(|m| m.essence_str().to_string())
		.unwrap_or_else(|| "application/octet-stream".into());
	// 埋め込み検索
	match Assets::get(&path.to_string_lossy().to_string()) {
		Some(file) => axum::response::Response::builder()
			.status(axum::http::StatusCode::OK)
			.header(axum::http::header::CONTENT_TYPE, mime)
			.body(axum::body::Body::from(file.data))
			.unwrap(),
		None => axum::response::Response::builder()
			.status(axum::http::status::StatusCode::NOT_FOUND)
			.body(axum::body::Body::from("not found in frontend"))
			.unwrap(),
	}
}
