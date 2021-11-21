#!/bin/sh

env MSYS_NO_PATHCONV=1 docker run --rm -v `pwd -W`:/project -v kconfig:/opt/esp/idf/tools/kconfig -w /project espressif/idf make defconfig all -j4

