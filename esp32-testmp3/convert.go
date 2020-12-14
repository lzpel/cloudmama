package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
)

func main(){
	// cat ../effect0.mp3 | go run convert.go > effect0.c
	fmt.Print("const char data[]={")
	in := bufio.NewReader(os.Stdin)
	for {
		c, err := in.ReadByte()
		if err == io.EOF {
			break
		}
		fmt.Printf("0x%02X,",c)
	}
	fmt.Print("};")
}