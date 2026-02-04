generate:
	cargo install rebab
run:
	echo $${REBAB_CONFIG} > out.json
	rebab --input ./out.json
%:
	@echo "no target $*"
define REBAB_CONFIG
{
	"frontend": "0.0.0.0:8080",
	"comment": "Routing follows the first matching rule.",
	"rules":[
		{
			"frontend_prefix": "/api/",
			"backend_host": "localhost",
			"backend_port": 8000,
			"comment": "Requests whose path starts with 'api' are routed to localhost:8000."
		},
		{
			"backend_host": "localhost",
			"backend_port": 3000,
			"comment": "All other requests are routed to localhost:3000."
		}
	]
}
endef
export