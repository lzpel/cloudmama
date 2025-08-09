package main

import (
	"bytes"
	"fmt"
	"image"
	_ "image/jpeg"
	"io"
	"io/ioutil"
	"os"
	"strings"
	"time"
)

func Script(image string) string {
	now := time.Now().In(time.Local)
	day := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC).Unix() / 86400
	txt := []string{
		image,
		fmt.Sprintf("時刻は%d時%d分、残りは%d%%。", now.Hour(), now.Minute(), 100-100*(now.Hour()*60+now.Minute())/1440),
		"手帳を持ち，ベッドを畳み，スマホは捨てましょう。",
	}
	_ = map[int]string{
		04: fmt.Sprintf("起床は「失敗、手帳」、支度は「歯、髭、眉、薬%d個目、湯%d個目」、準備は「財布、鍵、携帯、筆箱、手帳、眼鏡」", (day+1)%10+1, (day+5)%10+1),
		20: "連絡と手帳",
		21: "睡眠",
	}
	if now.Hour() == 20 {
		txt = append(txt)
	}
	if now.Hour() == 4 {
		txt = append(txt,
			fmt.Sprintf("%d日の計画を手帳に書きましょう。", now.Day()),
			fmt.Sprintf("身支度は「歯磨き、髭剃り，錠剤%d個目、石鹸%d個目、洗濯」。", (day+1)%10+1, (day+5)%10+1),
			"持ち物は「財布、鍵、携帯、筆箱、手帳、眼鏡」です。",
		)
	}
	if 21 <= now.Hour() || now.Hour() <= 3 {
		txt = append(txt, "寝ましょう。")
	}
	return strings.Join(txt, "")
}
func SpeechSave(script string, path string) {
	file, err := os.Create(path)
	if err != nil {
		fmt.Println(err)
	}
	defer file.Close()
	file.Write(Speech(script))
}
func preHandle(w Response, r Request) {
	timezone := r.FormValue("tz")
	if len(timezone) == 0 {
		timezone = "Asia/Tokyo"
	}
	time.Local, _ = time.LoadLocation(timezone)
}
func main() {
	Handle("/speech", func(w Response, r Request) {
		preHandle(w, r)
		w.Write(Speech(Script(r.FormValue("i"))))
	})
	Handle("/image", func(w Response, r Request) {
		preHandle(w, r)
		// curl --data-binary @path2file.jpg http://localhost:8080/script
		if buf, err := ioutil.ReadAll(r.Body); err != nil {
			panic(err)
		} else {
			br := bytes.NewReader(buf)
			if _, _, err := image.Decode(br); err != nil {
				panic(err)
			} else {
				br.Seek(0, 0)
				now := time.Now().In(time.Local)
				ow := NewObjectWriter("cloudmama-camera", fmt.Sprintf("trunk/%04d%02d%02d%02d%02d%s.jpg", now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), "default"))
				io.Copy(ow, br)
				if err := ow.Close(); err != nil {
					panic(err)
				} else {
					fmt.Fprintln(w, ow.Name)
				}
			}
		}
	})
	Handle("/download", func(w Response, r Request) {
		//MicroSDに音声の断片を保存し、ESP32でつなぎ合わせて出力する
		for i := 0; i < 24; i++ {
			SpeechSave(fmt.Sprintf("%d時", i), fmt.Sprintf("../microsd/hour_%02d.mp3", i))
		}
		for i := 0; i < 60; i++ {
			SpeechSave(fmt.Sprintf("%d分", i), fmt.Sprintf("../microsd/minute_%02d.mp3", i))
		}
		SpeechSave("夜更かしを検知しました。寝ましょう", "../microsd/advice_sleep.mp3")
		SpeechSave("寝坊を検知しました。起きましょう", "../microsd/advice_wakeup.mp3")
		SpeechSave("1時50分、夜更かしを検知しました、寝ましょう", "../microsd/advice_demo.mp3")
	})
	Handle("/", func(w Response, r Request) {
		preHandle(w, r)
		WriteTemplate(w, nil, nil, "home.html")
	})
	//GCSに設置した
	Credentialize("cloudmama.user.json")
	Listen()
}
