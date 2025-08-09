#!/bin/bash

set -eux
cd `dirname $0`
env MSYS_NO_PATHCONV=1 docker run --rm -v `pwd -W`:/project -w /project -it espressif/idf:release-v4.0

