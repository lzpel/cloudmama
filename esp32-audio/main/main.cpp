/*
 * SPDX-FileCopyrightText: 2010-2022 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: CC0-1.0
 */

#include <stdio.h>
#include <inttypes.h>
#include "sdkconfig.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_chip_info.h"
#include "esp_flash.h"
// https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/i2s.html
// ドライバーと出力に必要
#include "esp_log.h"
#include "I2SOutput.h"
#include <math.h>

/* Allocate a new tx channel and get the handle of this channel */
#define sampling_rate 48000
#define wave_hz 400
#define length 1024
const char *TAG = "LZP32-SPEAKER";
unsigned phase = 0;
extern "C"
{
void app_main(void);
}

signed read_waves(int16_t *data, int size) {
    double sin_float;
    for (int i = 0; i < size; i++) {
        sin_float = sin(2 * 3.14159 * phase * wave_hz / sampling_rate);
        data[i] = (0 + sin_float * 0.5) * (double) (65536 / 2);
        phase++;
    }
    return size;
}

void app_main(void) {
    //https://github.com/atomic14/esp32_sdcard_audio/blob/main/idf-wav-sdcard/src/config.cpp
    i2s_pin_config_t i2s_speaker_pins = {
            .bck_io_num = GPIO_NUM_14,
            .ws_io_num = GPIO_NUM_16,
            .data_out_num = GPIO_NUM_15,
            .data_in_num = I2S_PIN_NO_CHANGE};
    I2SOutput *output = new I2SOutput(I2S_NUM_0, i2s_speaker_pins);

    output->start(sampling_rate);
    int16_t *samples = (int16_t *) malloc(sizeof(int16_t) * 1024);
    for (int i = 0; true; i++) {
        int samples_read = read_waves(samples, 1024);
        if (samples_read == 0) {
            break;
        }
        ESP_LOGI(TAG, "Read %d samples", samples_read);
        output->write(samples, samples_read);
        ESP_LOGI(TAG, "Played samples");
        if (i % 100 == 0)vTaskDelay(1);//avoid Task watchdog got triggered
    }
    // stop the input
    output->stop();
    //fclose(fp);
    //delete reader;
    free(samples);
    ESP_LOGI(TAG, "Finished playing");

    printf("Hello world!\n");

    /* Print chip information */
    esp_chip_info_t chip_info;
    uint32_t flash_size;
    esp_chip_info(&chip_info);
    printf("This is %s chip with %d CPU core(s), WiFi%s%s%s, ",
           CONFIG_IDF_TARGET,
           chip_info.cores,
           (chip_info.features & CHIP_FEATURE_BT) ? "/BT" : "",
           (chip_info.features & CHIP_FEATURE_BLE) ? "/BLE" : "",
           (chip_info.features & CHIP_FEATURE_IEEE802154) ? ", 802.15.4 (Zigbee/Thread)" : "");

    unsigned major_rev = chip_info.revision / 100;
    unsigned minor_rev = chip_info.revision % 100;
    printf("silicon revision v%d.%d, ", major_rev, minor_rev);
    if (esp_flash_get_size(NULL, &flash_size) != ESP_OK) {
        printf("Get flash size failed");
        return;
    }

    printf("%"
    PRIu32
    "MB %s flash\n", flash_size / (uint32_t)(1024 * 1024),
            (chip_info.features & CHIP_FEATURE_EMB_FLASH) ? "embedded" : "external");

    printf("Minimum free heap size: %"
    PRIu32
    " bytes\n", esp_get_minimum_free_heap_size());

    for (int i = 10; i >= 0; i--) {
        printf("Restarting in %d seconds...\n", i);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
    printf("Restarting now.\n");
    //排出
    fflush(stdout);
    //再起動
    esp_restart();