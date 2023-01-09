//
// Created by smith on 2023/01/09.
//

#ifndef CLOUDMAMA_AUDIO_H
#define CLOUDMAMA_AUDIO_H

#include "driver/i2s_std.h"

class AudioOutput {
    i2s_chan_handle_t tx_handle;
    void start(int sampling_rate);
    void play(void(*callback)(int16_t *p, signed size));
    void end();
};


#endif //CLOUDMAMA_AUDIO_H
