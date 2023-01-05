# cloudmama

日時に合わせて適切なアドバイスをGoogle Homeから再生する私的サービス

## Output

文字列

https://cloudmama.appspot.com/

文字列全パターン

https://cloudmama.appspot.com/?all=true

音声

https://cloudmama.appspot.com/speech

音声全パターン

https://cloudmama.appspot.com/speech?all=true

## ESP32 Client

[C++ Source Code](esp32/cloudmama.ino)

## ESP32 Dev

https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/tools/idf-docker-image.html?highlight=docker
```shell
docker pull espressif/idf

env MSYS_NO_PATHCONV=1 docker run --rm -v $PWD:/project -w /project espressif/idf idf.py build
# interactive mode
cp -r /opt/esp/idf/examples/get-started/hello_world/* ./
env MSYS_NO_PATHCONV=1 docker run --rm -v $PWD:/project -w /project -it espressif/idf
# 20221229 Docker コンテナからホストのUSBにアクセスできないってマジ？ビルドしてもマイコンに書き込めない。
# ttyUSB0という名前にすると-pを指定せずにflashしても推定してくれる
idf.py -b 921600 flash
```

container内でlsusb -vするとCouldn't open device, some information will be missingとなる
のが関係していると思う。デバイスを開けない

https://learn.microsoft.com/ja-jp/windows/wsl/connect-usb

```shell
usbipd wsl list
usbipd wsl attach --busid <busid>
```

```shell
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 002: ID 10c4:ea60 Silicon Labs CP210x UART Bridge
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
$ env MSYS_NO_PATHCONV=1 docker run --rm -v $PWD:/project -w /project --device=/dev/bus/usb/001/002:/dev/ttyUSB0 -it espressif/idf
```

Commands which communicate with the development board, such as idf.py flash and idf.py monitor will not work in the container unless the serial port is passed through into the container. However currently this is not possible with Docker for Windows (https://github.com/docker/for-win/issues/1018) and Docker for Mac (https://github.com/docker/for-mac/issues/900).
esp-idf5.0のwindows版
を入れて解決した

## PCB 設計
- screw terminal
- KF350-3.5-2P
- DB125-3.5-2P-GN-S

## License
MIT Copyright 2020 lzpel