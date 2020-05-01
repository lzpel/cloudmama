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

//https://github.com/espressif/arduino-esp32/blob/master/libraries/FS/src/FS.h
#include <FS.h>
#include <FFat.h>

//https://github.com/horihiro/esp8266-google-home-notifier
#include <esp8266-google-home-notifier.h>

void fatinit(){
  //ファイスシステムFATをマウントする関数。
  //最初に一度だけ呼び出す必要がある。
  //フォーマットは不要
  if(false) FFat.format();
  if(!FFat.begin()){
    Serial.println("FFat Mount Failed");
    return;
  }
  Serial.printf("Total space: %10u\nFree space: %10u\n", FFat.totalBytes(), FFat.freeBytes());
  fattree("/");
}
void fattree(const char * path){
  //指定パス以下のファイルを全て列挙する関数
  File root = FFat.open(path);
  if(!root)return;
  Serial.println(root.name());
  if(root.isDirectory()){
    for(File file=root.openNextFile();file;file=root.openNextFile()){
      fattree(file.name());
      file.close();
    }
  }
  root.close();
}
void fatmove(const char * path,const char* newpath){
  
}
int fatprint(const char * path,const char*format,...){
  char buf[256];
  va_list va;
  va_start(va, format);
  int ret=vsprintf(buf, format, va);
  va_end(va); 
  File file = FFat.open(path, FILE_WRITE);
  file.println(buf);
  file.close();
  return ret;
}
int fatscanf(const char * path,const char*format,...){
  char buf[256];
  File file = FFat.open(path, FILE_READ);
  file.read((uint8_t*)buf,sizeof(buf));
  file.close();
  va_list va;
  va_start(va, format);
  int ret=vsscanf(buf, format, va);
  va_end(va);
  return ret;
}

void handleAutoConnect(){
  // 10秒毎に接続していなければ再接続を試みる
  // 10秒の根拠は以下でハードコーディングしているから
  // https://github.com/espressif/arduino-esp32/blob/91b9fae111b8e601d8bdbcddf2dd430e0170706a/libraries/WiFi/src/WiFiSTA.cpp#L391 
  const char* ws="otherwise";
  static unsigned long time=0;
  unsigned long now=millis();
  if((time==0)||(now-time)>10000){
    switch(WiFi.status()){
      case WL_NO_SHIELD:ws="WL_NO_SHIELD";break;
      case WL_IDLE_STATUS:ws="WL_IDLE_STATUS";break;
      case WL_NO_SSID_AVAIL:ws="WL_NO_SSID_AVAIL";break;
      case WL_SCAN_COMPLETED:ws="WL_SCAN_COMPLETED";break;
      case WL_CONNECTED:ws="WL_CONNECTED";break;
      case WL_CONNECT_FAILED:ws="WL_CONNECT_FAILED";break;
      case WL_CONNECTION_LOST:ws="WL_CONNECTION_LOST";break;
      case WL_DISCONNECTED:ws="WL_DISCONNECTED";break;
    }
    Serial.printf("WiFi.status()=%s\n",ws);
    if((time=now)&&WiFi.status()!=WL_CONNECTED)WiFi.begin("wifissid", "wifipass");
  }
}

String HTTPGet(const char* httpurl="http://example.com/index.html"){
  String payload;
  HTTPClient http;
  Serial.print("[HTTP] begin...\n");
  // ライブラリの方針でbegin系関数は設定だけ行いブロックしないのかも
  // configure traged server and url
  //http.begin("https://www.howsmyssl.com/a/check", ca); //HTTPS
  http.begin(httpurl); //HTTP

  Serial.print("[HTTP] GET...\n");
  // start connection and send HTTP header
  int httpCode = http.GET();

  // httpCode will be negative on error
  if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] GET... code: %d\n", httpCode);

      // file found at server
      if(httpCode == HTTP_CODE_OK) {
          payload = http.getString();
          Serial.println(payload);
      }
  } else {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end(); 
  return payload; 
}

void speak(){
  handleAutoConnect();
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  GoogleHomeNotifier ghn;
  Serial.println("connecting to Google Home...");
  if (ghn.device("Google-Home", "en", 20000) != true) {
    Serial.println(ghn.getLastError());
    return;
  }
  Serial.print("found Google Home(");
  Serial.print(ghn.getIPAddress());
  Serial.print(":");
  Serial.print(ghn.getPort());
  Serial.println(")");
  
  if (ghn.notify("Hello, World!") != true) {
    Serial.println(ghn.getLastError());
    return;
  }
  Serial.println("Done.");
}

void setup() {
  
  //シリアルモニタの同期周波数。PC側に以下の値を設定しないと文字化けする。
  Serial.begin(115200);
  
  //wifi等の状態を出力してくれるらしい。
  Serial.setDebugOutput(true);
  
  speak();
  
  //シリアルモニタに出力
  Serial.println("HelloWorld");

  //Wifiの親機（アクセスポイント）かつ子機（ステーション）として振る舞うモードに設定
  //この処理が無くても動作するが明示的に書いた。
  WiFi.mode(WIFI_AP_STA); 
  
  //アクセスポイントのパスワードは8文字以上に設定しないと失敗する
  WiFi.softAP("camerawifi", "camerapass");

  //ipアドレスにmdnsを設定。Wifi.modeに関わらない。
  if (MDNS.begin("cloudmama"))Serial.println("http://cloudmama.local/");

  //ファイルシステムの初期化
  fatinit();

  //ウェブサーバーを始める。Wifi.modeに関わらない。
  webserver.begin(80);

  //無名関数でレスポンスを作る
  webserver.on("/", []() {
    char ssid[64]={0},pass[64]={0};
    fatscanf("/config","%s\n%s",ssid,pass);
    webserver.send(200, "text/html", 
      "<html>"
      "<head></head>"
      "<body>"
      "<h1>Wifi Config</h1>"
      "<form action='/set' method='post'>"
      "<div>ssid</div><input name='ssid' value='"+String(ssid)+"'>"
      "<div>pass</div><input name='pass' value='"+String(pass)+"'>"
      "<button type='submit'>connect</button>"
      "</form>"
      "</body>"
      "</html>"
    );
  });
  
  webserver.on("/set", []() {
    //設定保存
    fatprint("/config","%s\n%s",webserver.arg("ssid"),webserver.arg("pass"));
    //リダイレクト
    webserver.sendHeader("Location", "/");
    webserver.sendHeader("Cache-Control", "no-cache");
    webserver.send(301);
  });

  webserver.on("/httpget", [](){
    //HTTPで取得した内容を直接表示
    //最後に/をつけないと404になった。
    webserver.send(200,"text/html",HTTPGet("http://lzpel.net/"));
  });

}
void loop() {
  handleAutoConnect();
  webserver.handleClient();  
}
