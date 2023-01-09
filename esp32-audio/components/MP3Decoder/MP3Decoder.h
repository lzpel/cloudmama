//
// Created by smith on 2023/01/09.
//

#ifndef CLOUDMAMA_MP3DECODER_H
#define CLOUDMAMA_MP3DECODER_H


#define MINIMP3_ONLY_MP3
//#define MINIMP3_ONLY_SIMD
//#define MINIMP3_NO_SIMD
//#define MINIMP3_NONSTANDARD_BUT_LOGICAL
//#define MINIMP3_FLOAT_OUTPUT
#include "minimp3.h"

class MP3Decoder {
    mp3dec_t mp3d;
    mp3dec_frame_info_t info;
public:
    short pcm[MINIMP3_MAX_SAMPLES_PER_FRAME];
    void init();
    signed decode(const uint8_t* input_buf,size_t input_buf_size);
};


#endif //CLOUDMAMA_MP3DECODER_H
