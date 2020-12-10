package main

import (
	"bytes"
	"fmt"
	"image"
	_ "image/jpeg"
	"io"
	"io/ioutil"
	"net/url"
	"strings"
	"time"
)

func Script(isAll bool,timezone string) string {
	now:= time.Now().In(time.Local)
	txt := []string{
		fmt.Sprintf("時刻は%d時%d分、残りは%d%%。", now.Hour(), now.Minute(), 100-100*(now.Hour()*60+now.Minute())/1440),
		"手帳を持ち，ベッドを畳み，スマホは投函しましょう。",
	}
	if isAll || now.Hour() == 20 {
		txt = append(txt, "寝る前は「連絡、充電、手帳」です。")
	}
	if isAll || now.Hour() == 4{
		day:=time.Date(now.Year(),now.Month(),now.Day(),0,0,0,0,time.UTC).Unix()/86400
		txt = append(txt,
			fmt.Sprintf("%d日の計画を手帳に書きましょう。", now.Day()),
			fmt.Sprintf("身支度は「歯磨き、髭剃り，錠剤%d個目、石鹸%d個目、洗濯」。", (day+1)%10+1, (day+5)%10+1),
			"持ち物は「財布、鍵、携帯、筆箱、手帳、眼鏡」です。",
		)
	}
	if isAll || 21 <= now.Hour() || now.Hour() <= 3 {
		txt = append(txt, "寝ましょう。")
	}
	return strings.Join(txt, "")
}
func main() {
	time.Local, _ = time.LoadLocation("Asia/Tokyo")
	Handle("/speech", func(w Response, r Request) {
		w.Write(FetchSpeech(r.FormValue("q")))
	})
	Handle("/script", func(w Response, r Request) {
		var script string
		if buf,err:=ioutil.ReadAll(r.Body);err!=nil{
			panic(err)
		}else{
			// curl --data-binary @path2file.jpg http://localhost:8080/script
			br := bytes.NewReader(buf)
			if _,_,err:=image.Decode(br);err!=nil{
				script=Script(r.FormValue("all")!="", r.FormValue("tz"))
			}else{
				br.Seek(0,0)
				ow:=NewObjectWriter("cloudmama-camera",fmt.Sprintf("trunk/%d-%s.jpg",time.Now().Unix(),"default"))
				defer ow.Close()
				io.Copy(ow,br)
				if err := ow.Close(); err != nil {
					panic(err)
				}else{
					script="画像を保存しました"
				}
			}
		}
		if r.FormValue("e")!=""{
			script=url.QueryEscape(script)
		}
		fmt.Fprintln(w,script)
	})
	Credentialize("cloudmama.user.json")//GCSに設置した
	Listen()
}
