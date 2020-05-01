package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"
	"text/template"
	"time"
)

type Response = http.ResponseWriter
type Request = *http.Request
type Dict = map[string]interface{}

func Handle(pattern string, handler func(w Response, r Request)) {
	http.HandleFunc(pattern, handler)
}

func ServeFile(w Response, r Request, prefix string) bool {
	Path := prefix + r.URL.Path
	if filepath.Ext(Path) == "" {
		return false
	}
	http.ServeFile(w, r, Path)
	return true
}

func HandleSample() {
	// {{ .datetime }} {{ .datetime | length }} {{ length .datetime}}
	Handle(`/sample`, func(w Response, r Request) {
		WriteTemplate(w, Dict{
			"datetime": time.Now().Format("2006-01-02 15:04:05"),
			"length": func(s string) int {
				return len(s)
			},
		}, "server.go")
	})
}

func Credentialize(credential_json_path string) {
	var e error
	var bytes []byte
	if bytes, e = ioutil.ReadFile(credential_json_path); e == nil {
		var fc map[string]string
		if e = json.Unmarshal(bytes, &fc); e == nil {
			for k, v := range fc {
				os.Setenv(strings.ToUpper(k), v)
			}
			os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", credential_json_path)
		}
	}
	if e != nil {
		log.Fatalln(e)
	}
}
func Listen() {
	var e error
	var port int
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)
	if port, e = strconv.Atoi(os.Getenv("PORT")); e != nil {
		port, e = 8080, nil
	}
	log.Printf("http://localhost:%d", port)
	e = http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if e != nil {
		log.Fatalln(e)
	}
}

func WriteTemplate(w io.Writer, value Dict, filename ...string, ) {
	functions := template.FuncMap{}
	for k, v := range value {
		if reflect.ValueOf(v).Kind() == reflect.Func {
			functions[k] = v
			delete(value, k)
		}
	}
	t, e := template.New(filename[0]).Funcs(functions).ParseFiles(filename...)
	if e == nil {
		e = t.Execute(w, value)
	}
	if e != nil {
		log.Println(e)
	}
}

func Redirect(w Response, r Request, url string) {
	http.Redirect(w, r, url, 301)
}

func GetMultipartFileHeaders(r Request) map[string][]*multipart.FileHeader {
	e := r.ParseMultipartForm(200000)
	if e == nil {
		return r.MultipartForm.File
	}
	log.Println(e)
	return nil
}

func CookieSet(w Response, k, v string, days int) {
	http.SetCookie(w, &http.Cookie{
		Path:   "/",
		Name:   k,
		Value:  v,
		MaxAge: 86400 * days,
	})
}

func CookieGet(r Request, k string) string {
	cookie, err := r.Cookie(k)
	if err == nil {
		return cookie.Value
	}
	return ""
}
