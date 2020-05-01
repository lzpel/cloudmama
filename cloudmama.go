package main

import (
	texttospeech "cloud.google.com/go/texttospeech/apiv1"
	"context"
	"fmt"
	texttospeechpb "google.golang.org/genproto/googleapis/cloud/texttospeech/v1"
	"log"
	"time"
)
func Speech(text string) []byte{
	// Instantiates a client.
	ctx := context.Background()

	client, err := texttospeech.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// Perform the text-to-speech request on the text input with the selected
	// voice parameters and audio file type.
	req := texttospeechpb.SynthesizeSpeechRequest{
		// Set the text input to be synthesized.
		Input: &texttospeechpb.SynthesisInput{
			InputSource: &texttospeechpb.SynthesisInput_Text{Text: text},
		},
		// Build the voice request, select the language code ("en-US") and the SSML
		// voice gender ("neutral").
		Voice: &texttospeechpb.VoiceSelectionParams{
			LanguageCode: "ja-JP-Standard-A",
			SsmlGender:   texttospeechpb.SsmlVoiceGender_FEMALE,
		},
		// Select the type of audio file you want returned.
		AudioConfig: &texttospeechpb.AudioConfig{
			AudioEncoding: texttospeechpb.AudioEncoding_OGG_OPUS,
		},
	}

	resp, err := client.SynthesizeSpeech(ctx, &req)
	if err != nil {
		log.Fatal(err)
	}

	return resp.AudioContent
}
func Now(timezone string) time.Time{
	now:=time.Now()
	if timezone==""{
		timezone="Asia/Tokyo"
	}
	if l,e:=time.LoadLocation(timezone);e==nil{
		now=now.In(l)
	}
	return now
}
func main() {
	Handle("/speech", func(w Response, r Request) {
		now:=Now(r.FormValue("tz"))
		report :=fmt.Sprintf("%d時%d分、今日は残り%d%%です。",now.Hour(),now.Minute(),100-100*(now.Hour()*60+now.Minute())/1440)
		advice :="手帳を持っていますか？ベッドを畳んでいますか？スマートフォンを遠ざけていますか？"
		if 20==now.Hour(){
			advice ="明日に備えてやるべきことは「連絡、充電、着替え、風呂と洗濯、掃除、日記」です。"
		}else if now.Hour()==3{
			advice =fmt.Sprintf("ベッドを畳み、日記を読み、%d日の計画を立てましょう。",now.Day())
			advice +="身支度の手順は「歯磨き、洗顔、薬を飲む、肌、毛を剃る」です。"
			advice +="持ち物は「財布、鍵、携帯、筆箱、手帳、眼鏡」です。"
		}else if 21<=now.Hour() || now.Hour()<3{
			advice ="寝ましょう。睡眠に最適な時間帯は午後10時から午前2時です。"
		}
		w.Write(Speech(report + advice))
	})
	Handle("/text", func(w Response, r Request) {
		w.Write(Speech(r.FormValue("q")))
	})
	Handle("/", func(w Response, r Request) {
		now:=Now(r.FormValue("tz"))
		w.Write(Speech(fmt.Sprintf("%d月%d日は残り%d%%です。",now.Month(),now.Day(),100-100*(now.Hour()*60+now.Minute())/1440)))
	})
	Credentialize("cloudmama.user.json")
	Listen()
}