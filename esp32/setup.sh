#!/bin/bash
cd `dirname $0`
set -eux
mkdir -p components
cd components
curl -L https://github.com/espressif/arduino-esp32/archive/refs/tags/2.0.2.tar.gz | tar zx -C ./ && mv arduino* arduino
curl -L https://github.com/espressif/esp32-camera/archive/refs/tags/v2.0.0.tar.gz | tar zx -C ./ && mv esp32-camera* esp32-camera
# https://esp32.com/viewtopic.php?t=22444
# You are looking for the ESP32 Camera Driver. Excellent! Thanks for the help! So I guess this is not part of ESP-IDF but still under Espressif.

cd arduino
git submodule update --init --recursive
cd ../..