---
title: Başlıklar & Trailers
seoTitle: Başlıklar ve Trailers RPC ile HTTP Başlıkları Yönetimi
sidebar_position: 11
description: Bu belge, RPC ile başlıklar ve trailersın nasıl çalıştığını özetler. HTTP başlıklarının ve trailersın kullanımını ve özelliklerini detaylı bir şekilde incelemektedir.
tags: 
  - RPC
  - HTTP
  - Başlıklar
  - Trailers
  - gRPC
keywords: 
  - RPC
  - HTTP
  - Başlıklar
  - Trailers
  - gRPC
---
Diğer sistemlerle entegrasyon sağlamak için, RPC'lerinizde özel HTTP başlıklarını okumak veya yazmak gerekebilir. Örneğin, dağıtılmış izleme, kimlik doğrulama, yetkilendirme ve hız sınırlama genellikle başlıklarla çalışmayı gerektirir. Connect ayrıca yanıt gövdesinden _sonra_ yazılabilen benzer bir amaç için hizmet eden trailers'i de destekler. Bu belge, tekil (istek-yanıt) RPC'ler için başlıklar ve trailers ile nasıl çalışılacağını özetlemektedir. `Akış belgeleri` akış RPC'leri için başlıklar ve trailers'ı kapsamaktadır.

## Başlıklar

Connect başlıkları, tanıdık `Header` tipini kullanan HTTP başlıklarıdır ve `net/http` ile modellenmiştir. Connect'in `Request` ve `Response` yapıları başlıklara açık erişime sahiptir ve API'ler, kullanılan RPC protokolünden bağımsız olarak aynı şekilde çalışır. İşleyicilerde:

```go
func (s *greetServer) Greet(
  ctx context.Context,
  req *connect.Request[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
  fmt.Println(req.Header().Get("Acme-Tenant-Id"))
  res := connect.NewResponse(&greetv1.GreetResponse{})
  res.Header().Set("Greet-Version", "v1")
  return res, nil
}
```

**Başlıkları bağlamaya göre daha basit buluyoruz.** Başlıklar, istemci perspektifinden benzer görünür:

```go
func call() {
  client := greetv1connect.NewGreetServiceClient(
    http.DefaultClient,
    "https://api.acme.com",
  )
  req := connect.NewRequest(&greetv1.GreetRequest{})
  req.Header().Set("Acme-Tenant-Id", "1234")
  res, err := client.Greet(context.Background(), req)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(res.Header().Get("Greet-Version"))
}
```

:::tip
Hataları gönderirken veya alırken, işleyiciler ve istemciler `Error.Meta()` kullanarak başlıklara erişebilir.
:::

```go
func (s *greetServer) Greet(
  ctx context.Context,
  req *connect.Request[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
  err := connect.NewError(
    connect.CodeUnknown,
    errors.New("ah hayır!"),
  )
  err.Meta().Set("Greet-Version", "v1")
  return nil, err
}

func call() {
  _, err := greetv1connect.NewGreetServiceClient(
    http.DefaultClient,
    "https://api.acme.com",
  ).Greet(
    context.Background(),
    connect.NewRequest(&greetv1.GreetRequest{}),
  )
  if connectErr := new(connect.Error); errors.As(err, &connectErr) {
    fmt.Println(connectErr.Meta().Get("Greet-Version"))
  }
}
```

Connect başlıklarının yalnızca HTTP başlıkları olduğunu unutmayın, bu nedenle bunları `net/http` ara katmanlarında kullanmak tamamen kabul edilebilir!

Hem **gRPC** hem de **Connect protokolleri** `gerektirir` ki başlık anahtarları yalnızca ASCII harfleri, rakamları, alt çizgileri, tireleri ve noktaları içerebilir ve protokoller "Connect-" veya "Grpc-" ile başlayan tüm anahtarları rezerve eder. Benzer şekilde, başlık değerleri yalnızca yazdırılabilir ASCII ve boşluklar içerebilir. Deneyimlerimize göre, ayrılmış veya ASCII dışı başlıklar yazan uygulama kodu nadirdir; `net/http.Header`'ı şişman bir doğrulama katmanı ile sarmaktan ziyade, iyi yargınıza güveniyoruz.

## İkili başlıklar

Başlıklarda ASCII dışı değer göndermek için, gRPC ve Connect protokolleri base64 kodlaması gerektirir. Anahtarınızı "-Bin" ile sonlandırın ve Connect'in `EncodeBinaryHeader` ve `DecodeBinaryHeader` fonksiyonlarını kullanın:

```go
func (s *greetServer) Greet(
  ctx context.Context,
  req *connect.Request[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
  fmt.Println(req.Header().Get("Acme-Tenant-Id"))
  res := connect.NewResponse(&greetv1.GreetResponse{})
  res.Header().Set(
    "Greet-Emoji-Bin",
    connect.EncodeBinaryHeader([]byte("👋")),
  )
  return res, nil
}

func call() {
  res, err := greetv1connect.NewGreetServiceClient(
    http.DefaultClient,
    "https://api.acme.com",
  ).Greet(
    context.Background(),
    connect.NewRequest(&greetv1.GreetRequest{}),
  )
  if err != nil {
    fmt.Println(err)
    return
  }
  encoded := res.Header().Get("Greet-Emoji-Bin")
  if emoji, err := connect.DecodeBinaryHeader(encoded); err == nil {
    fmt.Println(string(emoji))
  }
}
```

:::warning
Bu mekanizmayı ihtiyatla kullanın ve hata ayrıntılarının kullanım durumunuz için daha iyi bir uyum olup olmadığını düşünün.
:::

## Trailers

Connect'in yanıt trailer'larını manipüle etmek için Go API'leri, her üç protokolde de aynı şekilde çalışır; gRPC, gRPC-Web ve Connect, her biri trailer'ları farklı şekilde kodlasa da. Trailers, istemciye birkaç mesaj gönderdikten sonra bazı meta verileri iletmek zorunda kalabilecek akış işleyicilerinde en yararlıdır. Tekil işleyiciler genellikle bunun yerine başlıkları kullanmalıdır.

Eğer trailers'a ihtiyacınız varsa, tekil işleyiciler ve istemciler bunlara başlıklar gibi erişebilir:

```go
func (s *greetServer) Greet(
  ctx context.Context,
  req *connect.Request[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
  res := connect.NewResponse(&greetv1.GreetResponse{})
  // HTTP başlığı Trailer-Greet-Version olarak gönderildi.
  res.Trailer().Set("Greet-Version", "v1")
  return res, nil
}

func call() {
  res, err := greetv1connect.NewGreetServiceClient(
    http.DefaultClient,
    "https://api.acme.com",
  ).Greet(
    context.Background(),
    connect.NewRequest(&greetv1.GreetRequest{}),
  )
  if err != nil {
    fmt.Println(err)
    return
  }
  // Boş, çünkü Trailer- ile başlayan herhangi bir HTTP başlığı
  // trailer olarak değerlendirilir.
  fmt.Println(res.Header())
  // Ön ekler otomatik olarak çıkarılır.
  fmt.Println(res.Trailer().Get("Greet-Version"))
}