FROM docker.io/lzpel/home
RUN cargo install cargo-espflash --locked && cargo install espup --locked && \
espup install --targets=esp32,esp32s2,esp32s3
# https://github.com/esp-rs/espup/issues/455#issuecomment-2487851689
ENTRYPOINT ["rustup", "run", "esp"]
