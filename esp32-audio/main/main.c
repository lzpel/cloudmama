#include "sdkconfig.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include <math.h>
#include <stdio.h>
#include "AudioOutput.h"

/* Allocate a new tx channel and get the handle of this channel */
#define sample_rate 48000
#define wave_hz 400
int phase = 0;

void callback(int16_t *p, signed size) {
    double sin_float;
    for (int i = 0; i < size; i++) {
        sin_float = sin(2 * PI * phase * wave_hz / sample_rate);
        p[i] = (0 + sin_float * 0.5) * (double) (65536 / 2);
        phase++;
    }
}

void app_main(void) {
    AudioOutput audio();
    audio.init(sample_rate);
    audio.play(callback);
    audio.end();
}
