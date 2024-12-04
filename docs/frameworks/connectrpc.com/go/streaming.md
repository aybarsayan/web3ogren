---
title: Akış
seoTitle: Akış - Detaylı Bilgi
sidebar_position: 7
description: Bu sayfa, akış RPC türleri ve bunların avantajları ile dezavantajlarına dair bilgiler içermektedir. Akışların nasıl çalıştığını ve nasıl uygulandığını keşfedin.
tags: 
  - akış
  - RPC
  - gRPC
  - http
keywords: 
  - akış
  - RPC
  - geliştirme
  - gRPC
  - HTTP
---
Connect, çeşitli akış RPC türlerini destekler. Akış heyecan vericidir &mdash;
webin tipik isteğe-yanıt modelinden temelde farklıdır ve doğru koşullarda çok verimli olabilir. Aynı sayfalama veya anket kodunu yıllardır yazıyorsanız, akış tüm sorunlarınızın cevabı gibi görünebilir.

:::tip
Akış, doğru kullanıldığında çok faydalı olabilir, ancak bazı zorlukları da beraberinde getirir.
:::

Heyecanınızı dindirin. Akış aynı zamanda birçok dezavantajı da beraberinde getirir:

- Mükemmel HTTP kütüphaneleri gerektirir. En azından, istemci ve
  sunucunun HTTP/1.1 istek ve yanıt gövdesini akış halinde iletebilmesi gerekir. İki yönlü akış için, her iki tarafın da HTTP/2'yi desteklemesi gerekir. Uzun süreli akışlar, HTTP/2 akış kontrolünde daha fazla hata ve kenar durumu ile karşılaşma olasılığı taşır.
- Mükemmel proxy'ler gerektirir. Sunucu ile istemci arasındaki her proxy &mdash; bulut sağlayıcıları tarafından işletilenler de dahil &mdash; HTTP/2'yi desteklemelidir.
- Tekil işleyicilerinizin sunduğu korumaları zayıflatır, çünkü akış genellikle proxy'lerin çok daha uzun zaman aşımı ile yapılandırılmasını gerektirir.
- Karmaşık araçlar gerektirir. Akış RPC protokolleri, tekil protokollerden çok daha karmaşıktır, bu nedenle cURL ve tarayıcınızın ağ denetleyicisi işe yaramaz.

Genel olarak, akış uygulamanızı ağ altyapınıza daha yakın hale getirir ve uygulamanızı daha az karmaşık istemcilere erişilemez hale getirir. Bu dezavantajları, akışların kısa ömürlü tutulmasıyla minimize edebilirsiniz.

Ayrıca, [http.Server](https://pkg.go.dev/net/http#Server) `ReadTimeout` veya `WriteTimeout` alanı yapılandırılmışsa, bu durum tüm işlem süresine uygulanır, akış çağrıları için bile. Daha fazla bilgi için `SSS` sayfasına bakın.

Tüm bunları göz önünde bulundurursak, `connect-go`, üç akış türünün tamamını tam olarak desteklemektedir. Tüm akış alt türleri gRPC, gRPC-Web ve Connect protokolleri ile çalışır.

## Akış çeşitleri

_İstemci akışı_ ile istemci, birden fazla mesaj gönderir. Sunucu tüm mesajları aldıktan sonra, tek bir mesajla yanıt verir. Protobuf şemalarında, istemci akış yöntemleri şu şekildedir:

```protobuf
service GreetService {
  rpc Greet(stream GreetRequest) returns (GreetResponse) {}
}
```

Go'da, istemci akış RPC'leri `ClientStream` ve `ClientStreamForClient` türlerini kullanır.

_Sunucu akışı_ ile istemci, tek bir mesaj gönderir ve sunucu birden fazla mesajla yanıt verir. Protobuf şemalarında, sunucu akış yöntemleri şu şekildedir:

```protobuf
service GreetService {
  rpc Greet(GreetRequest) returns (stream GreetResponse) {}
}
```

Go'da, sunucu akış RPC'leri `ServerStream` ve `ServerStreamForClient` türlerini kullanır.

_İki yönlü akış_ (genellikle bidi olarak adlandırılır) ile istemci ve sunucu her ikisi de birden fazla mesaj gönderebilir. Genellikle, değişim bir sohbet gibi yapılandırılmıştır: istemci bir mesaj gönderir, sunucu yanıtlar, istemci başka bir mesaj gönderir ve bu böyle devam eder. Bunun her zaman uçtan uca HTTP/2 desteği gerektirdiğini unutmayın (RPC protokolünden bağımsızdır)! `net/http` istemcileri ve sunucuları, TLS kullanıyorsanız varsayılan olarak HTTP/2'yi destekler, ancak TLS olmadan HTTP/2'yi desteklemek için bazı `özel yapılandırmalar` gerektirir. Protobuf şemalarında, bidi akış yöntemleri şu şekildedir:

```protobuf
service GreetService {
  rpc Greet(stream GreetRequest) returns (stream GreetResponse) {}
}
```

Go'da, bidi akış RPC'leri `BidiStream` ve `BidiStreamForClient` türlerini kullanır.

## HTTP temsili

Üç protokolda da akış yanıtlarının her zaman HTTP durumu 200 OK'dir. Bu alışılmadık görünebilir, ancak kaçınılmazdır: sunucu birkaç mesaj gönderdikten sonra bir hata ile karşılaşabilir, bu durumda HTTP durumu zaten istemciye gönderilmiştir. HTTP durumuna güvenmek yerine, akış işleyicileri herhangi bir hatayı HTTP araçları veya yanıt gövdesinin sonunda kodlar (protokole bağlı olarak).

Akış istekleri ve yanıtları, şemanızla tanımlanan mesajlarınızı birkaç baytlık protokol-spesifik ikili çerçeve verisiyle sarar. Araya giren çerçeve verisi nedeniyle yükler artık geçerli Protobuf veya JSON değildir: bunun yerine protokol-spesifik İçerik Türleri kullanır:

`application/connect+proto`, `application/grpc+json` veya `application/grpc-web+proto` gibi.

## Başlıklar ve araçlar

`Tekil RPC'deki gibi`, başlıklar düz HTTP başlıklarıdır, aynı ASCII kısıtlamaları ve ikili başlık desteği ile.

Her protokol, yanıt araçlarını farklı yollarla gönderir: bunlar HTTP araçları olarak, yanıt gövdesinin sonunda HTTP formatında veri bloğu veya gövdenin sonunda bir JSON bloğu olarak gönderilebilir. İletim kodlamasından bağımsız olarak, üç protokol de araçlara başlıklarla aynı anlam ve kısıtlamaları verir.

`connect-go`'nun her akış türü, ya `Request` veya `Response` üzerinde başlıklar ve araçlar açar (tekil RPC'lerde olduğu gibi), ya da akışın kendisinde meta verilere erişim sağlayan yöntemler vardır. Bu API'ler, kullanılan protokolden bağımsız olarak birbirleriyle aynı şekilde çalışır.

## Ara katmanlar

Akış ara katmanları doğal olarak tekil ara katmanlardan daha karmaşıktır. `UnaryInterceptorFunc` kullanmak yerine, akış ara katmanları tam `Interceptor` arayüzünü uygulamalıdır. Bu, bir `StreamingClientConn` veya `StreamingHandlerConn` sarmalayıcı uygulamayı gerektirebilir.

## Bir örnek

`Başlarken` tanımladığımız `GreetService`'yi, `Greet` yönteminin istemci akışını kullanacak şekilde değiştirmeye başlayalım:

```protobuf
syntax = "proto3";

package greet.v1;

option go_package = "example/gen/greet/v1;greetv1";

message GreetRequest {
  string name = 1;
}

message GreetResponse {
  string greeting = 1;
}

service GreetService {
  rpc Greet(stream GreetRequest) returns (GreetResponse) {}
}
```

Oluşturulan kodumuzu güncellemek için `buf generate` çalıştırdıktan sonra, `cmd/server/main.go` dosyasında işleyici uygulamamızı güncelleyebiliriz:

```go
package main

import (
  "context"
  "errors"
  "fmt"
  "log"
  "net/http"
  "strings"

  greetv1 "example/gen/greet/v1"
  "example/gen/greet/v1/greetv1connect"

  "connectrpc.com/connect"
  "golang.org/x/net/http2"
  "golang.org/x/net/http2/h2c"
)

type GreetServer struct{}

func (s *GreetServer) Greet(
  ctx context.Context,
  stream *connect.ClientStream[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
  log.Println("İstek başlıkları: ", stream.RequestHeader())
  var greeting strings.Builder
  for stream.Receive() {
    g := fmt.Sprintf("Merhaba, %s!\n", stream.Msg().Name)
    if _, err := greeting.WriteString(g); err != nil {
      return nil, connect.NewError(connect.CodeInternal, err)
    }
  }
  if err := stream.Err(); err != nil {
    return nil, connect.NewError(connect.CodeUnknown, err)
  }
  res := connect.NewResponse(&greetv1.GreetResponse{
    Greeting: greeting.String(),
  })
  res.Header().Set("Greet-Version", "v1")
  return res, nil
}

func main() {
  greeter := &GreetServer{}
  mux := http.NewServeMux()
  path, handler := greetv1connect.NewGreetServiceHandler(greeter)
  mux.Handle(path, handler)
  http.ListenAndServe(
   "localhost:8080",
   // TLS olmadan HTTP/2 sunabilmemiz için h2c kullanıyoruz.
    h2c.NewHandler(mux, &http2.Server{}),
  )
}
```

Artık yeni istemci akış RPC'mizi uyguladığımıza göre, `basit kimlik doğrulama ara katmanımızı` da güncellememiz gerekecektir. Akışı desteklemek için tam `Interceptor` arayüzünü uygulamamız gerekir:

```go
const tokenHeader = "Acme-Token"

var errNoToken = errors.New("token sağlanmadı")

type authInterceptor struct {}

func NewAuthInterceptor() *authInterceptor {
  return &authInterceptor{}
}

func (i *authInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
  // Önceki UnaryInterceptorFunc ile aynı.
  return connect.UnaryFunc(func(
    ctx context.Context,
    req connect.AnyRequest,
  ) (connect.AnyResponse, error) {
    if req.Spec().IsClient {
      // İstemci istekleriyle bir token gönderin.
      req.Header().Set(tokenHeader, "örnek")
    } else if req.Header().Get(tokenHeader) == "" {
      // İşleyicilerde token kontrolü.
      return nil, connect.NewError(connect.CodeUnauthenticated, errNoToken)
    }
    return next(ctx, req)
  })
}

func (*authInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
  return connect.StreamingClientFunc(func(
    ctx context.Context,
    spec connect.Spec,
  ) connect.StreamingClientConn {
    conn := next(ctx, spec)
    conn.RequestHeader().Set(tokenHeader, "örnek")
    return conn
  })
}

func (i *authInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
  return connect.StreamingHandlerFunc(func(
    ctx context.Context,
    conn connect.StreamingHandlerConn,
  ) error {
    if conn.RequestHeader().Get(tokenHeader) == "" {
      return connect.NewError(connect.CodeUnauthenticated, errNoToken)
    }
    return next(ctx, conn)
  })
}
```

Ara katmanımızı yine `WithInterceptors` kullanarak uygularız.