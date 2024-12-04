---
title: Yönlendirme
seoTitle: HTTP Yönlendirmeleri Yönetimi
sidebar_position: 20
description: Bu kılavuz, Connectin yönlendirmeleri nasıl yönettiğini ve yolları nasıl oluşturduğunu açıklar. Hata ayıklama ve yapılandırma için bilgiler içerir.
tags: 
  - yönlendirme
  - Connect
  - gRPC
keywords: 
  - HTTP yönlendirmesi
  - Connect API
  - gRPC hizmetleri
---
Connect genellikle HTTP yönlendirmelerini sizin için yönetir &mdash; her şey
sadece çalışmalıdır. Hata ayıklama veya daha ileri düzey yapılandırma için bu kılavuz,
Connect'in yolları nasıl oluşturduğunu açıklar.

## Yolları oluşturma

Yönlendirme, `Connect` ve gRPC HTTP/2 protokollerini izler ve bunlar
şunları kullanır:

```
:method post
:path /<Package>.<Service>/<Method>
```

Örneğin, Protobuf paketi `greet.v1` içindeki `GreetService` sınıfının `Greet` 
metodu, `/greet.v1.GreetService/Greet` yoluna sahiptir. Paket, hizmet ve metod isimleri
büyük/küçük harf duyarlıdır ve Protobuf şemasında olduğu gibi tam olarak kullanılmalıdır ve
işleyiciler yalnızca GET ve POST fiillerini destekler. (Yönlendirmenin Protobuf paket adlarına
dayandığını, Go import yollarına dayanmadığını unutmayın.)

## Yolları ön ekleme

Özellikle Connect API'nizi diğer HTTP işleyicileriyle birlikte sunuyorsanız,
RPC yollarınızı `/api/`, `/connect/` veya benzeri bir şeyle ön eklemeyi
isteyebilirsiniz. Bunu `net/http` kullanarak yapabilirsiniz:

```go
api := http.NewServeMux()
api.Handle(greetv1connect.NewGreetServiceHandler(&greetServer{}))

mux := http.NewServeMux()
mux.Handle("/", newHTMLHandler())
mux.Handle("/grpc/", http.StripPrefix("/grpc", api))
http.ListenAndServe(":http", mux)
```

Çoğu üçüncü taraf yönlendiricisi benzer şekilde çalışır. Bir ön ek yapılandırırsanız,
bunu Connect istemcilerinize geçeceğiniz temel URL'ye dahil ettiğinizden emin olun (örneğin,
`https://acme.com/api/`). Ne yazık ki, `grpc-go` istemcileri ön ekleri desteklemez: eğer
gRPC istemcilerini desteklemeniz gerekiyorsa, yollarınıza ön ek eklemeyin!

:::tip
Yönlendirme yapılandırmalarınızı test ederken dikkatli olun ve kullanılan yolları kontrol edin.
:::