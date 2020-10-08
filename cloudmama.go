package main

import (
	texttospeech "cloud.google.com/go/texttospeech/apiv1"
	"context"
	"fmt"
	texttospeechpb "google.golang.org/genproto/googleapis/cloud/texttospeech/v1"
	"log"
	"strings"
	"time"
)

func FetchSpeech(text string) []byte {
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
func GetLocalTimes(timezone string) (time.Time, int) {
	if timezone == "" {
		timezone = "Asia/Tokyo"
	}
	l, _ := time.LoadLocation(timezone)
	base := time.Date(2020, time.October, 1, 0, 0, 0, 0, l)
	now := time.Now().In(l)
	return now, int(now.Sub(base).Nanoseconds() / (86400 * 1000 * 1000 * 1000))
}
func GetScript(isAll bool,timezone string) string {
	now, day := GetLocalTimes(timezone)
	txt := []string{
		fmt.Sprintf("%d時%d分%d%%。", now.Hour(), now.Minute(), 100-100*(now.Hour()*60+now.Minute())/1440),
		"手帳を持ち，ベッドを畳み，スマホは投函しましょう。",
	}
	if isAll || now.Hour() == 20 {
		txt = append(txt, "寝る前は「連絡、充電、手帳」です。")
	}
	if isAll || now.Hour() == 4{
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
	Handle("/speech", func(w Response, r Request) {
		w.Write(FetchSpeech(GetScript(r.FormValue("all")!="", r.FormValue("tz"))))
	})
	Handle("/speak", func(w Response, r Request) {
		w.Write(FetchSpeech(r.FormValue("q")))
	})
	Handle("/", func(w Response, r Request) {
		w.Write([]byte(GetScript(r.FormValue("all")!="",r.FormValue("tz"))))
	})
	Credentialize("cloudmama.user.json")
	Listen()
}
