#include "../components/MP3Decoder/MP3Decoder.h"
#include <stdio.h>

int main() {
    MP3Decoder mp3;
    mp3.init();

    printf("hello world");

    FILE * fp = NULL;
    unsigned char buf[4096];

    fopen_s(&fp, "effect0.mp3", "rb");
    while(fread(buf, sizeof(unsigned char), sizeof(buf), fp)){
        int n=mp3.decode(buf, sizeof(buf));
        printf("frames= %d\n",n);
        for(int i=0;i<sizeof(mp3.pcm)/2;i++){
            printf("%d, %d\n",i, mp3.pcm[i]);
        }
    }
    fclose(fp);

    return 0;
    return 0;
}