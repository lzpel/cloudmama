
#include "AudioGeneratorMP3.h"
#include "effect0.h"

void setup() {
    static mp3dec_t mp3d;
    mp3dec_init(&mp3d);
  // put your setup code here, to run once:
    mp3dec_frame_info_t info={0};
    info.frame_bytes=2;
    info.channels=1;
    info.hz=8000;
    info.layer=0
    info.
    short pcm[MINIMP3_MAX_SAMPLES_PER_FRAME];
    int samples;
    /*unsigned char *input_buf; - input byte stream*/
    samples = mp3dec_decode_frame(&mp3d, (const uint8_t*)data, sizeof(data), pcm, &info);

}

void loop() {
  // put your main code here, to run repeatedly:

}
