---
title: Hatalar
seoTitle: Hata Kodları ve Yönetimi
sidebar_position: 40
description: Bu bölümde, Connect ile birlikte gelen hata kodları ve bunların nasıl yönetileceği hakkında bilgi edinin. Hatalarla çalışırken dikkat edilmesi gereken noktaları öğrenin.
tags: 
  - hata kodları
  - connect
  - gRPC
  - hata yönetimi
keywords: 
  - 404
  - 500
  - gRPC
  - connect-go
  - hata iletişimi
---
HTTP'de gördüğünüz tanıdık "404 Bulunamadı" ve "500 İç Sunucu Hatası" durum kodlarına benzer şekilde, Connect şu set ile birlikte gelir `16 hata kodu`. Hataları oluşturma ve inceleme için kullanılan Go API'leri, desteklenen üç protokol: gRPC, gRPC-Web ve Connect protokolü için aynı şekilde çalışır.

## Hatalarla Çalışmak

En basit haliyle, `connect-go` hataları standart bir Go hatası ile bir `hata kodu` ilişkilendirir. Hata kodu ve altta yatan hatanın `Error()` dizesi, istemciye ağ üzerinden gönderilir; istemci farklı kodları farklı yeniden deneme veya yedekleme mantığı ile işleyebilir. gRPC durum kodlarına aşina iseniz, Connect'in hata kodları aynı isimleri kullanır ve aynı anlamsal yapıya sahiptir.

:::tip
Yöneticilerin hataları kodlamak için `NewError` fonksiyonunu kullanmaları önerilir.
:::

Connect yöneticileri, hatalara durum kodları eklemek için `NewError` fonksiyonunu kullanır. Yöneticiler kodlanmış hatalar döndürmelidir; eğer döndürmezlerse, Connect `context.DeadlineExceeded` için `deadline_exceeded`, `context.Canceled` için `canceled` ve diğer tüm hatalar için `unknown` kodunu kullanır. Örneğin:

```go
func (s *greetServer) Greet(
  ctx context.Context,
  req *connect.Request[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
  if err := ctx.Err(); err != nil {
    return nil, err // otomatik olarak doğru şekilde kodlandı
  }
  if err := validateGreetRequest(req.Msg); err != nil {
    return nil, connect.NewError(connect.CodeInvalidArgument, err)
  }
  greeting, err := doGreetWork(ctx, req.Msg)
  if err != nil {
    return nil, connect.NewError(connect.CodeUnknown, err)
  }
  return connect.NewResponse(&greetv1.GreetResponse{
    Greeting: greeting,
  }), nil
}
```

Kullanılan protokolden bağımsız olarak, Connect istemcileri yanıt verilerini otomatik olarak standart bir Go hatasına yerleştirir. Hataları incelemek için Connect'in `CodeOf` fonksiyonunu ve standart kütüphanenin `errors.As` fonksiyonunu kullanın:

```go
client := greetv1connect.NewGreetServiceClient(
  http.DefaultClient,
  "https://api.acme.com",
)
_, err := client.Greet(
  context.Background(),
  connect.NewRequest(&greetv1.GreetRequest{}),
)
if err != nil {
  fmt.Println(connect.CodeOf(err))
  if connectErr := new(connect.Error); errors.As(err, &connectErr) {
    fmt.Println(connectErr.Message())
    fmt.Println(connectErr.Details())
  }
}
```

Bu API'ler, sunucu Connect ile inşa edilmemiş olsa bile, desteklenen üç protokol için çalışır.

## Hata Ayrıntıları

`grpc-go`'da olduğu gibi, `connect-go` sunucuların hataları daha fazla veri ile zenginleştirmesine izin verir. Connect, şemaya öncelikli API'lere odaklandığı için, bu ek veri – hata ayrıntıları olarak adlandırılır – `ErrorDetail` türü içinde sarılı Protobuf mesajlarının bir dilimidir. Ayrıntılar, geçici hatalar için geri çekilme parametrelerini, yerelleştirilmiş hata mesajlarını veya diğer yapılandırılmış verileri göndermek için yaygın olarak kullanılır. `google.golang.org/genproto/googleapis/rpc/errdetails` paketi, genellikle hata ayrıntıları olarak kullanılan çeşitli Protobuf mesajlarını içerir. Kullanılan RPC protokolünden bağımsız olarak, sunucular `*Error` eklentilerine ayrıntılar ekleyebilir:

```go
package example

import (
  "errors"

  "connectrpc.com/connect"
  "google.golang.org/genproto/googleapis/rpc/errdetails"
  "google.golang.org/protobuf/types/known/durationpb"
)

func newTransientError() error {
  err := connect.NewError(
    connect.CodeUnavailable,
    errors.New("yoğun: geri çekilin ve yeniden deneyin"),
  )
  retryInfo := &errdetails.RetryInfo{
    RetryDelay: durationpb.New(10*time.Second),
  }
  if detail, detailErr := connect.NewErrorDetail(retryInfo); detailErr == nil {
    err.AddDetail(detail)
  }
  return err
}
```

İstemciler, hata ayrıntılarını incelemek için `*ErrorDetail` dilimi alır:

```go
package example

import (
  "errors"

  "connectrpc.com/connect"
  "google.golang.org/genproto/googleapis/rpc/errdetails"
  "google.golang.org/protobuf/types/known/durationpb"
)

func extractRetryInfo(err error) (*errdetails.RetryInfo, bool) {
  var connectErr *connect.Error
  if !errors.As(err, &connectErr) {
    return nil, false
  }
  for _, detail := range connectErr.Details() {
    msg, valueErr := detail.Value()
    if valueErr != nil {
      // Buradaki hatalar genellikle bu Protobuf mesajı için şemanın olmadığını gösterir.
      continue
    }
    if retryInfo, ok := msg.(*errdetails.RetryInfo); ok {
      return retryInfo, true
    }
  }
  return nil, false
}
```

Hata ayrıntıları, tüm API'leriniz içinde kullanılan küçük bir stabil tür kümesine sınırlı olduğunda en iyi şekilde çalışır. Azami şekilde kullanıldığında, daha güvenli, daha genişletilebilir ve daha verimli olurlar.

Yine de, hata ayrıntılarıyla çalışma API'leri gRPC, gRPC-Web ve Connect protokolü için aynı şekilde çalışır.

## HTTP Temsili

Hatalarla çalışma için Go API'leri protokol bağımsızdır, ancak her protokol farklı şekillerde HTTP yanıtları üretir. [gRPC HTTP/2 protokolu][grpc-protocol], [gRPC-Web protokolu][grpcweb-protocol] ve `Connect protokolü` detayları için başvurabilirsiniz, ancak her protokolün genel yaklaşımını anlamak faydalıdır.

gRPC yanıtları çoğunlukla sunucu bir hata döndürse bile, HTTP durum kodu olarak 200 OK'e sahiptir. Hatanın kodu ve mesajı ayrı HTTP trailer'ları olarak gönderilir. Kod, mesaj ve hata ayrıntıları ayrıca Protobuf ile serileştirilir, base64 ile kodlanır ve üçüncü bir HTTP trailer'da yer alır. Bu yaklaşım, tekil ve akış RPC'leri için aynı olup, trailer'lar HTTP standardının bir parçası olduğundan, teorik olarak herhangi bir HTTP kütüphanesinin hata kodu ve mesajı ile çalışması mümkündür. Ne yazık ki, trailer desteği düzensizdir - hatta web tarayıcıları onları desteklemez.

gRPC-Web yanıtları neredeyse aynı yaklaşımı kullanır, ancak tüm trailer'ları yanıt gövdesinin son bölümüne kodlar. Bu, istemcilerin HTTP trailer'larını desteklemediği durumlarda bile çalışır, ancak yine de başarısız yanıtları HTTP 200 durum kodu ile bırakır.

Tekil (istek-yanıt) RPC'leri için, Connect protokolü hata kodlarını, mesajlarını ve ayrıntılarını insan tarafından okunabilir JSON olarak yanıt gövdesine koyar. Yanıtın HTTP durum kodu Connect kodundan çıkarılır ve RPC başarısız olursa her zaman 4xx veya 5xx aralığındadır. Tekil bir Connect hatası için yanıt gövdesi şu şekilde görünebilir:

```json
{
  "code": "invalid_argument",
  "message": "veri boş olamaz"
}
```

Akış RPC'leri için Connect protokolü, hataları gRPC-Web'e benzer bir şekilde işler. Bu iki yönlü yaklaşım, akış ve tekil RPC'ler arasında tutarlılığı feda eder, ancak standart HTTP anlamlarına mümkün olduğunca yakın durur ve en geniş HTTP kütüphaneleri ve araçları ile çalışır.

[grpc-protocol]: https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md
[grpcweb-protocol]: https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md