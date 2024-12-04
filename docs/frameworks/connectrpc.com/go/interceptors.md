---
title: Kesiciler
seoTitle: Kesiciler Middleware ve Dekoratörler Hakkında Bilgiler
sidebar_position: 4
description: Kesiciler, middleware ve dekoratörlere benzeyen güçlü yapılar olup, istekleri ve yanıtları değiştirme özelliği taşır. Bu belge, unary kesicilerin temel kavramlarını ve örnek uygulamalarını içermektedir.
tags: 
  - kesiciler
  - middleware
  - dekoratör
  - unary kesici
  - RPC
keywords: 
  - kesiciler
  - middleware
  - dekoratör
  - unary kesici
  - RPC
---
Kesiciler, diğer frameworklerden aşina olabileceğiniz middleware veya dekoratörlere benzerdir: Connect'i genişletmenin birincil yoludur. İçeriği, isteği, yanıtı ve herhangi bir hatayı değiştirebilirler. Kesiciler genellikle günlüğe kaydetme, metrikler, izleme, yeniden denemeler ve diğer işlevsellikleri eklemek için kullanılır. Bu belge, unary kesicileri kapsar - daha karmaşık kullanım durumları `streaming documentation` belgelerinde ele alınmaktadır.

:::warning
Kesici yazarken dikkatli olun! Güçlüdürler, ancak aşırı karmaşık kesiciler hata ayıklamayı zorlaştırabilir.
:::

## Kesiciler işlevlerdir

Unary kesiciler, iki arayüz üzerine inşa edilmiştir: `AnyRequest` ve `AnyResponse`. `Request` ve `Response` ile neredeyse aynıdırlar, ancak istek ve yanıt verilerine yalnızca bir `any` olarak erişim sağlarlar. Bu arayüzlerle, tüm unary RPC'leri şu şekilde modelleyebiliriz:

```go
type UnaryFunc func(context.Context, AnyRequest) (AnyResponse, error)
```

Bir kesici, bir RPC'yi bazı ek mantıklarla sarar, bu nedenle bir `UnaryFunc`'ı başka birine dönüştürür:

```go
type UnaryInterceptorFunc func(UnaryFunc) UnaryFunc
```

Çoğu unary kesici en iyi şekilde bir `UnaryInterceptorFunc` olarak uygulanır.

## Bir örnek

Biraz soyut, bu yüzden bir örneğe bakalım: RPC'lerimize basit bir başlık bazlı kimlik doğrulama şeması uygulamak istiyoruz. Bu mantığı her bir sunucu yöntemimize ekleyebiliriz, ancak bir kesici yazmak daha az hata yapmanıza neden olur.

```go
package example

import (
  "context"
  "errors"

  "connectrpc.com/connect"
)

const tokenHeader = "Acme-Token"

func NewAuthInterceptor() connect.UnaryInterceptorFunc {
  interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
    return connect.UnaryFunc(func(
      ctx context.Context,
      req connect.AnyRequest,
    ) (connect.AnyResponse, error) {
      if req.Spec().IsClient {
        // İstemci istekleriyle bir token gönderin.
        req.Header().Set(tokenHeader, "sample")
      } else if req.Header().Get(tokenHeader) == "" {
        // Biletleri kontrol edin.
        return nil, connect.NewError(
          connect.CodeUnauthenticated,
          errors.New("token sağlanmadı"),
        )
      }
      return next(ctx, req)
    })
  }
  return connect.UnaryInterceptorFunc(interceptor)
}
```

Yeni kesicimizi işleyicilere veya istemcilere uygulamak için `WithInterceptors` kullanabiliriz:

```go
interceptors := connect.WithInterceptors(NewAuthInterceptor())
// İşleyiciler için:
mux := http.NewServeMux()
mux.Handle(greetv1connect.NewGreetServiceHandler(
  &greetServer{},
  interceptors,
))
// İstemciler için:
client := greetv1connect.NewGreetServiceClient(
  http.DefaultClient,
  "https://api.acme.com",
  interceptors,
)
```