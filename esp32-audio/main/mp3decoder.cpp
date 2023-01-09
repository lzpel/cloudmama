//
// Created by smith on 2023/01/09.
//

#include "mp3decoder.h"

#define MINIMP3_ONLY_MP3
//#define MINIMP3_ONLY_SIMD
//#define MINIMP3_NO_SIMD
//#define MINIMP3_NONSTANDARD_BUT_LOGICAL
//#define MINIMP3_FLOAT_OUTPUT
#define MINIMP3_IMPLEMENTATION
#include "minimp3.h"

static mp3dec_t mp3d;
void MP3Decoder::init(){
    mp3dec_init(&mp3d);
}
void MP3Decoder::init(){
    mp3dec_init(&mp3d);
}