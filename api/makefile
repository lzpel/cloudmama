generate: secret
	( mandolin -h || cargo install mandolin ) && mandolin -i ../out/openapi.json -o src/out.rs
	cargo fmt
	find .. . -maxdepth 1 -name .gitignore | xargs -IX sed '/^#\s*EOF_DOCKERIGNORE.*/q' X > .dockerignore
run:
	PORT=8000 cargo run
test:
	# cargo build --release --features frontend
	# target/release/lambda
	docker build -t api .
	docker run --rm -it -p 8080:8080 api
build:
	MSYS_NO_PATHCONV=1 docker run --rm -it -v .:/w -w /w lzpel/home cargo build
secret:
	T=$(firstword $(SECRET_DIR_AGE)) ; rm -rf $$T ; cp -r ../$$T $$T
%:
	@echo "no target $*"