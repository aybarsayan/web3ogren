---
title: Yaygın Hatalar
seoTitle: Yaygın Hatalar - Hata Düzeltme Rehberi
sidebar_position: 11
description: Bu sayfa, connect-go ile çalışırken yaygın hataların nasıl düzeltileceğini açıklar. Hataların belirlenmesi ve çözümlerine yönelik bilgiler sunar.
tags: 
  - connect-go
  - grpc-go
  - hata düzeltme
  - istemci seçenekleri
keywords: 
  - yaygın hatalar
  - connect çalışma zamanı
  - grpc sunucusu
  - istemci yapılandırması
---
Bu sayfa, `connect-go` ile çalışırken yaygın hataların nasıl düzeltileceğini açıklar. Mümkün olduğunca, Connect çalışma zamanı bu sorunları tanır ve hata mesajında bu sayfaya bir bağlantı içerir.

## Client eksik WithGRPC

Eğer bir Connect istemcisi kullanarak bir `grpc-go` sunucusunu arar ancak `WithGRPC` seçeneğini unutursanız, aşağıdaki gibi uzun bir hata mesajı göreceksiniz:

> unavailable: possible missing connect.WithGRPC() client option when talking to
> gRPC server, see https://connectrpc.com/docs/go/common-errors: Post
> "http://0.0.0.0:3000/buf.ping.v1alpha1.PingService/Ping": http2: Transport:
> cannot retry err [stream error: stream ID 3; PROTOCOL_ERROR; received from
> peer] after Request.Body was written; define Request.GetBody to avoid this
> error
> — Connect Documentation

Bu hatayı, istemcinizi oluştururken `WithGRPC` istemci seçeneğini kullanarak düzeltebilirsiniz.

```go
client := greetv1connect.NewGreetServiceClient(
  http.DefaultClient, // ancak aşağıda da h2c'ye ihtiyacınız olabilir
  "https://api.acme.com",
  connect.WithGRPC(),
)
```

## Client eksik h2c yapılandırması

Eğer TLS desteklemeyen bir `grpc-go` sunucusunu aramak için bir Connect istemcisi kullanıyorsanız, muhtemelen bu hatayı göreceksiniz:

> unavailable: possible h2c configuration issue when talking to gRPC server, see
> https://connectrpc.com/docs/go/common-errors: Post
> "http://0.0.0.0:3000/buf.ping.v1alpha1.PingService/Ping": net/http: HTTP/1.x
> transport connection broken: malformed HTTP response
> "\x00\x00\x06\x04\x00\x00\x00\x00\x00\x00\x05\x00\x00@\x00"
> — Connect Documentation

Bazı durumlarda, bunun yerine daha genel bir hata göreceksiniz:

> unavailable: possible h2c configuration issue when talking to gRPC server, see
> https://connectrpc.com/docs/go/common-errors: Post
> "http://0.0.0.0:3000/buf.ping.v1alpha1.PingService/Ping": write tcp
> 127.0.0.1:64657->127.0.0.1:3000: write: broken pipe
> — Connect Documentation

Her iki durumda da, sunucunun istemcilerin TLS olmadan HTTP/2 kullanmasını bekleyip beklemediğini kontrol edin. Eğer öyleyse, HTTP istemcinizin `h2c'yi etkinleştirdiğinden` emin olun:

```go
client := greetv1connect.NewGreetServiceClient(
  &http.Client{
    Transport: &http2.Transport{
      AllowHTTP: true,
      DialTLS: func(network, addr string, _ *tls.Config) (net.Conn, error) {
        // Eğer bu istemciyi h2c trafiği dışındaki trafiği de kullanıyorsanız,
        // ağ TCP değilse veya addr bir izin listesinde değilse
        // tls.Dial'e devretmek isteyebilirsiniz.
        return net.Dial(network, addr)
      },
    },
  },
  "http://api.acme.com",
  connect.WithGRPC(),
)
```