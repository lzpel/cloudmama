package main

import (
	"cloud.google.com/go/storage"
	"context"
)

func NewStorageClient() (*storage.Client, context.Context) {
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		panic(err)
	}
	return client, ctx
}
func NewBucket(bucketName string) (*storage.BucketHandle,context.Context)  {
	c,x:=NewStorageClient()
	return c.Bucket(bucketName),x
}
func NewObjectWriter(bucketName,FileName string) *storage.Writer {
	b, x := NewBucket(bucketName)
	obj := b.Object(FileName)
	return obj.NewWriter(x)
}
func NewObjectReader(bucketName,FileName string) *storage.Reader{
	b, x := NewBucket(bucketName)
	obj := b.Object(FileName)
	r,err:=obj.NewReader(x)
	if err!=nil{
		panic(err)
		return nil
	}
	return r
}