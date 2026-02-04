MAKE_RECURSIVE_DIRS := openapi frontend api proxy awscdk
OUT_FRONTEND_DIR := api/out
SECRET_DIR_AGE := secret secret.age
define MAKE_RECURSIVE
if [ -n "$${MAKE_RECURSIVE_PARALLEL}" ]; then
	trap 'kill 0' EXIT INT TERM
	time printf '%s\n' $(MAKE_RECURSIVE_DIRS) | xargs -P0 -IX sh -c '$(MAKE) -C X $@ || exit 255'
	wait
else
	time printf '%s\n' $(MAKE_RECURSIVE_DIRS) | xargs -IX sh -c '$(MAKE) -C X $@ || exit 255'
fi
endef
export
generate: # 前処理を行います。開発・本番問わず実行前に叩いてください
	bash -c "$${MAKE_RECURSIVE}"
run: # 開発用のサーバー起動コマンド フォアグラウンド実行されます Ctrl+Cで止まります
	MAKE_RECURSIVE_PARALLEL=1 bash -c "$${MAKE_RECURSIVE}"
deploy: # 本番用のサーバー起動コマンド バックグラウンド実行されます
	bash -c "$${MAKE_RECURSIVE}"