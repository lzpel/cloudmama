//class WiFiClassとextern WiFiClass Wifiを宣言している。
#include <WiFi.h>

//https://github.com/espressif/arduino-esp32/tree/master/libraries/WebServer
//内部でWifi.hが提供するextern WiFiClass Wifiを利用している
#include <WebServer.h>
WebServer webserver;

//https://github.com/espressif/arduino-esp32/tree/master/libraries/HTTPClient
//HTTPクライアント
#include <HTTPClient.h>

//https://github.com/espressif/arduino-esp32/tree/master/libraries/WiFi
//class MDNSResponderとextern MDNSResponder MDNSを宣言している
//extern WiFiClass Wifiを使用
#include <ESPmDNS.h>

//https://github.com/horihiro/esp8266-google-home-notifier
#include <esp8266-google-home-notifier.h>

#include "camera.h"
#include "urlencode.h"

const int interval_seconds=60;

bool AutoConnect(const char* wifi, const char* pass) {
  // 10秒毎に接続していなければ再接続を試みる。秒数の根拠は以下。
  // https://github.com/espressif/arduino-esp32/blob/91b9fae111b8e601d8bdbcddf2dd430e0170706a/libraries/WiFi/src/WiFiSTA.cpp#L391
  static unsigned long time = 0;
  unsigned long now = millis(), status = WiFi.status();
  if ((time == 0 || (now - time) > 10000) && (time = now)) {
    if (status != WL_CONNECTED)WiFi.begin(wifi, pass);
  }
  return status == WL_CONNECTED;
}

String Request(const char* httpurl = "http://example.com/index.html", const char*postbuf = 0, const int postlen = 0) {
  String payload;
  int code;
  HTTPClient http;
  http.begin(httpurl); // start http connection and send HTTP header
  // http.begin("https://www.howsmyssl.com/a/check", ca); //HTTPS
  // ライブラリの方針でbegin系関数は設定だけ行いブロックしないのかも
  if (postbuf) {
    code = http.POST((uint8_t*)postbuf, postlen);
  } else {
    code = http.GET();
  }
  // httpCode will be negative on error
  if (code > 0) {
    // HTTP header has been send and Server response header has been handled
    // file found at server
    if (code == HTTP_CODE_OK) {
      payload = http.getString();
      Serial.printf("HTTP %d\n%s", code, payload.c_str());
    }
  }
  http.end();
  return payload;
}

void Speech(const char* deviceName, const char* url) {
  GoogleHomeNotifier ghn;
  Serial.println("connecting to Google Home...");
  if (ghn.device(deviceName, "jp")) {
    Serial.printf("found Google Home %s:%d\n", ghn.getIPAddress().toString(), ghn.getPort());
    if (ghn.play(url)) {
      Serial.printf("play %s\n", url);
      Serial.println(ghn.getLastError());
      return;
    }
  }
  Serial.println(ghn.getLastError());
}

void setup() {
  //シリアルモニタの同期周波数。PC側に以下の値を設定しないと文字化けする。
  Serial.begin(115200);
  //wifi等の状態を出力してくれるらしい。
  Serial.setDebugOutput(true);
  //シリアルモニタに出力
  Serial.println("HelloWorld");
  //Wifiの親機（アクセスポイント）かつ子機（ステーション）として振る舞うモードに設定。この処理が無くても動作するが明示的に書いた。
  WiFi.mode(WIFI_AP_STA);
  //アクセスポイントのパスワードは8文字以上に設定しないと失敗する
  WiFi.softAP("camerawifi", "camerapass");
  //ipアドレスにmdnsを設定。Wifi.modeに関わらない。
  if (MDNS.begin("cloudmama"))Serial.println("http://cloudmama.local/");
  //カメラ設定
  CameraInit();
  //ウェブサーバーを始める。Wifi.modeに関わらない。
  webserver.begin(80);
  //無名関数でレスポンスを作る
  webserver.on("/", []() {
    webserver.send(200, "text/html",
                   "<html>"
                   "<head></head>"
                   "<body>"
                   "<h1>Hello World</h1>"
                   "</body>"
                   "</html>"
                  );
  });
  webserver.on("/redirect", []() {
    webserver.sendHeader("Location", "/");
    webserver.sendHeader("Cache-Control", "no-cache");
    webserver.send(301);
  });
  webserver.on("/httpget", []() {
    //HTTPで取得した内容を直接表示
    //最後に/をつけないと404になった。
    webserver.send(200, "text/html", Request("http://lzpel.net/"));
  });
}
void loop() {
  static unsigned long time = 0;
  unsigned long now = millis();
  if (AutoConnect("SPWN_H37_4E72EE", "eq80a0j60r6ngj2")) {
    if ((time == 0 || (now - time) > 1000 * interval_seconds) && (time = now)) {
      CameraOpen();
      String ret = Request("http://cloudmama.appspot.com/image", CameraBuf(), CameraLen());
      CameraClose();
      //String url("http://cloudmama.appspot.com/speech?i=");
      //url.concat(urlEncode(ret.c_str()));
      //Speech("303", url.c_str());
      Speech("303", "http://cloudmama.appspot.com/effect0.mp3");
    }
  }
  webserver.handleClient();
}
