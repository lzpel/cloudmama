#include "../components/MP3Decoder/MP3Decoder.h"
#include <stdio.h>

int main() {
    MP3Decoder mp3;
    mp3.init();

    mp3.decode((const uint8_t *)0, 0);
    printf("hello world");

    return 0;
}