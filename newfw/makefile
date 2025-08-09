export ESP_IDF_PATH_ISSUES=warn
DEVICE_EXP:=CH340|C270
create:
	cd ~/Downloads && curl -o https://storage.googleapis.com/lzpeldisk/stat/CH341SER.ZIP
	cargo install cargo-espflash --locked
	cargo install espup --locked
	cargo install ldproxy # linker
	cargo install cargo-generate # project template
	espup install
run:
	rustup run esp cargo espflash flash -Z build-std=std,panic_abort --target xtensa-esp32-espidf --release --monitor
test:
	ls out 2>&1 >/dev/null || git clone https://github.com/esp-rs/esp-idf-hal out
	cd out && rustup run esp cargo espflash flash -Z build-std=std,panic_abort --target xtensa-esp32-espidf --example ledc_simple --release --monitor
clean:
	rm -rf out
