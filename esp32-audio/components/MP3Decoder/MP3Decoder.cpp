//
// Created by smith on 2023/01/09.
//

#define MINIMP3_IMPLEMENTATION

#include "MP3Decoder.h"

void MP3Decoder::init() {
    mp3dec_init(&mp3d);
}

signed MP3Decoder::decode(const uint8_t *input_buf, size_t input_buf_size) {
    return mp3dec_decode_frame(&mp3d, input_buf, input_buf_size, pcm, &info);
}