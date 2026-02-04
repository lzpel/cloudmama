generate:
	npm install
	echo 'module.exports = {default: {input: "../out/openapi.json",output: {target: "./src/out.ts", baseUrl: "/api"}}};' > out.orval.config.js
	npx orval --project default --config out.orval.config.js
run:
	npm run dev
deploy:
	npm run build
	rm -rf ../$(OUT_FRONTEND_DIR) && mkdir -p ../$(OUT_FRONTEND_DIR) && cp -r ./out/. ../$(OUT_FRONTEND_DIR)