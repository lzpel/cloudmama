export ESP_IDF_PATH_ISSUES=warn
export PYTHON=$(shell which python)
DEVICE_EXP:=CH340|C270
create:
	cd ~/Downloads && curl -o https://storage.googleapis.com/lzpeldisk/stat/CH341SER.ZIP
	cargo install cargo-espflash --locked
	cargo install espup --locked
	espup install
attach:
	usbipd list | grep -E '$(DEVICE_EXP)' | perl -pe "s/^([\d-]+).*/\1/g" | xargs -IX sh -c "usbipd bind --busid X && usbipd attach --wsl --busid X"
generate:
	docker build -t lzpel/home_esp .
test:
	rustup run esp bash -c "python --version"
	ls out 2>&1 >/dev/null || git clone https://github.com/esp-rs/esp-idf-hal out
	cd out && rustup run esp cargo espflash flash --target xtensa-esp32-espidf --example ledc_simple --release --monitor
clean:
	rm -rf out
