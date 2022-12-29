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
#include "driver/i2s_std.h"
#include "driver/gpio.h"

i2s_chan_handle_t tx_handle;
/* Get the default channel configuration by helper macro.
 * This helper macro is defined in 'i2s_common.h' and shared by all the i2s communication mode.
 * It can help to specify the I2S role, and port id */
i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_AUTO, I2S_ROLE_MASTER);
/* Allocate a new tx channel and get the handle of this channel */

void app_main(void){

    //ここで設定した方が良いのではないか、↑はコード外だぞ
    i2s_new_channel(&chan_cfg, &tx_handle, NULL);
    // Setting the configurations, the slot configuration and clock configuration can be generated by the macros
    // These two helper macros is defined in 'i2s_std.h' which can only be used in STD mode.
    // They can help to specify the slot and clock configurations for initialization or updating
    i2s_std_config_t std_cfg = {
            .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(48000),
            .slot_cfg = I2S_STD_MSB_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_32BIT, I2S_SLOT_MODE_STEREO),
            .gpio_cfg = {
                    .mclk = I2S_GPIO_UNUSED,
                    .bclk = GPIO_NUM_4,
                    .ws = GPIO_NUM_5,
                    .dout = GPIO_NUM_18,
                    .din = I2S_GPIO_UNUSED,
                    .invert_flags = {
                            .mclk_inv = false,
                            .bclk_inv = false,
                            .ws_inv = false,
                    },
            },
    };

    /* Initialize the channel */
    i2s_channel_init_std_mode(tx_handle, &std_cfg);

    /* Before write data, start the tx channel first */
    i2s_channel_enable(tx_handle);
    i2s_channel_write(tx_handle, src_buf, bytes_to_write, bytes_written, ticks_to_wait);

    /* If the configurations of slot or clock need to be updated,
    * stop the channel first and then update it */
    // i2s_channel_disable(tx_handle);
    // std_cfg.slot_cfg.slot_mode = I2S_SLOT_MODE_MONO; // Default is stereo
    // i2s_channel_reconfig_std_slot(tx_handle, &std_cfg.slot_cfg);
    // std_cfg.clk_cfg.sample_rate_hz = 96000;
    // i2s_channel_reconfig_std_clock(tx_handle, &std_cfg.clk_cfg);

    /* Have to stop the channel before deleting it */
    i2s_channel_disable(tx_handle);
    /* If the handle is not needed any more, delete it to release the channel resources */
    i2s_del_channel(tx_handle);

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
    if(esp_flash_get_size(NULL, &flash_size) != ESP_OK) {
        printf("Get flash size failed");
        return;
    }

    printf("%" PRIu32 "MB %s flash\n", flash_size / (uint32_t)(1024 * 1024),
           (chip_info.features & CHIP_FEATURE_EMB_FLASH) ? "embedded" : "external");

    printf("Minimum free heap size: %" PRIu32 " bytes\n", esp_get_minimum_free_heap_size());

    for (int i = 10; i >= 0; i--) {
        printf("Restarting in %d seconds...\n", i);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
    printf("Restarting now.\n");
    //排出
    fflush(stdout);
    //再起動
    esp_restart();
}
