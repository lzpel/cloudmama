FROM public.ecr.aws/lambda/provided:al2023 AS base
# builder
FROM base AS builder
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN dnf install -y gcc g++
COPY . .
RUN sh -c ". $HOME/.cargo/env && cargo build --release --features frontend"
RUN find target/release -maxdepth 1 -type f -executable | xargs -IX install -D X -t target/bin/
# runner
FROM base AS runner
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.3 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=8080
COPY . .
COPY --from=builder /var/task/target/bin/. ./
ENTRYPOINT ./api
# 基本ステージbaseからrunnerとbuilderを派生させる。rust:latest イメージは簡単なテストに便利だがクラウド用バイナリには使用しない(builderには使用しない)。glibcのバージョンがbuilderとrunnerで異なると動かない可能性があるため。
# bash
# docker build . -t api
# docker run --rm -it -p 8080:8080 api
# docker run --rm -it -p 8080:8080 --entrypoint bash api
#
# .dockerignore
# **/target
#
# Cargo.tomlの工夫次第でlinuxの依存ライブラリを減らす余地がある。openssl-develはreqwestから, fontconfig-devel はyolo-rust-ortのraqoteから使用されている