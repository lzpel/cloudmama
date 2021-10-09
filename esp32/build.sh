#!/bin/sh

env MSYS_NO_PATHCONV=1 docker run --rm -v `pwd -W`:/project -w /project espressif/idf idf.py build

