//
// Created by smith on 2023/01/09.
//

#include "AudioOutput.h"

void AudioOutput::start(int sampling_rate) {
    // Setting the configurations, the slot configuration and clock configuration can be generated by the macros
    // These two helper macros is defined in 'i2s_std.h' which can only be used in STD mode.
    // They can help to specify the slot and clock configurations for initialization or updating
    i2s_std_config_t std_cfg = {
            .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(sampling_rate),
            .slot_cfg = I2S_STD_MSB_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO),
            .gpio_cfg = {
                    .mclk = I2S_GPIO_UNUSED,
                    //基盤に合わせて変更
                    .bclk = GPIO_NUM_14,
                    .ws = GPIO_NUM_16,
                    .dout = GPIO_NUM_15,
                    .din = I2S_GPIO_UNUSED,
                    .invert_flags = {
                            .mclk_inv = false,
                            .bclk_inv = false,
                            .ws_inv = false,
                    },
            },
    };
    i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_AUTO, I2S_ROLE_MASTER);
    //chan_cfg.dma_desc_num = 3;
    //chan_cfg.dma_frame_num = sample_per_cycle;//dma_buffer_size = dma_frame_num * slot_num * slot_bit_width / 8
    printf("%d, %d, %d \n",
           (int) chan_cfg.dma_frame_num, (int) chan_cfg.dma_desc_num, (int) std_cfg.slot_cfg.slot_bit_width);
    i2s_new_channel(&chan_cfg, &this.tx_handle, NULL);
    i2s_channel_init_std_mode(this.tx_handle, &std_cfg);
    //i2s_event_callbacks_t callbacks={};
    //i2s_channel_register_event_callback(tx_handle, &callbacks, NULL);
    i2s_channel_enable(this.tx_handle);
}
void AudioOutput::play(void(*callback)(int16_t *p, signed size)) {
    int16_t samples[256];
    for (unsigned i = 0; true; i++) {
        size_t tmp, ret, size;
        size = sizeof(samples) / sizeof(int16_t);
        size = callback(samples, size);
        ret = i2s_channel_write(tx_handle, samples, sizeof(int16_t) * size, &tmp, portMAX_DELAY);
        printf("%d %d %d %d\n", ret, tmp, ESP_OK, ESP_ERR_TIMEOUT);
        if (i % 100 == 0)vTaskDelay(1);
    }
}
void AudioOutput::end() {
    i2s_channel_disable(this.tx_handle)
    i2s_del_channel(this.tx_handle)
}