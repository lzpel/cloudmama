generate:
	npm install
	echo "$${tspconfig}" > ./out.yaml
	npm run tsp -- compile main.tsp --config ./out.yaml
install:
	npm install @typespec/compiler @typespec/http @typespec/openapi3
	npm pkg set scripts.tsp="tsp"
%:
	@echo "no target $*"
define tspconfig
emit:
  - "@typespec/openapi3"
options:
  "@typespec/openapi3":
    emitter-output-dir: "{cwd}/../out" # "{output-dir}/schema"
    file-type: "json"
    openapi-versions:
      - 3.1.0
endef
export