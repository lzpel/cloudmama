//
// Created by smith on 2023/01/09.
//

#define MINIMP3_IMPLEMENTATION
#include "MP3Decoder.h"

void MP3Decoder::init(){
    mp3dec_init(&mp3d);
}
void MP3Decoder::decode(const uint8_t* input_buf,size_t input_buf_size){
    short pcm[MINIMP3_MAX_SAMPLES_PER_FRAME];
    size_t samples;
    /*unsigned char *input_buf; - input byte stream*/
    samples = mp3dec_decode_frame(&mp3d, input_buf, input_buf_size, pcm, &info);
}