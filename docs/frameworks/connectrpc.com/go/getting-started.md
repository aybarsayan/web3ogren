---
title: Başlarken
seoTitle: Başlarken - Connect ile Goda HTTP APIleri Oluşturma
sidebar_position: 4
description: Bu kılavuz, Goda küçük bir Connect servisi oluşturmayı öğretir ve Connect ile gRPC uyumlu HTTP APIleri geliştirmek için gereken adımları açıklar.
tags: 
  - Connect
  - Go
  - HTTP API
  - Protokol Buffer
  - gRPC
keywords: 
  - Connect
  - Go
  - HTTP API
  - Protokol Buffer
  - gRPC
---
Connect, tarayıcı ve gRPC uyumlu HTTP API'leri oluşturmak için hafif bir kütüphanedir. Servisinizi bir Protokol Buffer şeması ile tanımlarsınız ve Connect, tür güvenli sunucu ve istemci kodu üretir. Sunucunuzun iş mantığını doldurun ve işiniz bitti — elle yazılmış marşallama, yönlendirme veya istemci kodu gerekmez!

:::tip
Bu on beş dakikalık yürüyüş, size Go'da küçük bir Connect servisi oluşturmayı öğretir. El ile ne yazacağınızı, Connect'in sizin için ne ürettiğini ve yeni API'nizi nasıl çağıracağınızı gösterir.
:::

## Ön Koşullar

* Go'nun [son iki büyük sürümünden][go-releases] birine ihtiyacınız olacak. Kurulum talimatları için Go'nun [Başlarken][install-go] kılavuzuna bakın.
* Ayrıca [cURL][]. Homebrew ve çoğu Linux paket yöneticisinden edinilebilir.

## Araçları Yükle

Öncelikle yeni bir Go modülü oluşturup bazı kod üretim araçlarını yüklememiz gerekiyor:

```bash
$ mkdir connect-go-example
$ cd connect-go-example
$ go mod init example
$ go install github.com/bufbuild/buf/cmd/buf@latest
$ go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
$ go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
```

`buf`, `protoc-gen-go` ve `protoc-gen-connect-go`'yu `PATH`'inize eklemeniz gerekecek. `which buf grpcurl protoc-gen-go protoc-gen-connect-go` başarılı olmazsa, Go'nun kurulum dizinlerini yolunuza ekleyin:

```bash
$ [ -n "$(go env GOBIN)" ] && export PATH="$(go env GOBIN):${PATH}"
$ [ -n "$(go env GOPATH)" ] && export PATH="$(go env GOPATH)/bin:${PATH}"
```

## Bir Servis Tanımlayın

Artık servisimizi tanımlayan Protokol Buffer şemasını yazmaya hazırız. Terminalinizde,

```bash
$ mkdir -p greet/v1
$ touch greet/v1/greet.proto
```

`greet/v1/greet.proto` dosyasını düzenleyicinizde açın ve şu ekleyin:

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
  rpc Greet(GreetRequest) returns (GreetResponse) {}
}
```

Bu dosya, `greet.v1` Protobuf paketini, `GreetService` adlı bir servisi ve `Greet` adlı bir yöntem ile onun istek ve yanıt yapılarını tanımlar. Bu paket, servis ve yöntem isimleri, HTTP API'mizin URL'lerinde yakında tekrar görünecek.

## Kod Üretin

Kodumuzu [Buf][buf] kullanarak üreteceğiz, bu, Google'ın protobuf derleyicisi için modern bir alternatif. Önce Buf'ı yükledik, ama başlamamız için birkaç yapılandırma dosyasına daha ihtiyacımız var. (Dilerseniz, bu bölümü atlayabilir ve onun yerine `protoc` kullanabilirsiniz — `protoc-gen-connect-go` diğer eklentiler gibi davranır.)

Öncelikle temel bir [`buf.yaml`][buf.yaml] dosyasını `buf config init` komutunu çalıştırarak oluşturun. Sonra, Buf'a kod üretme şekli hakkında bilgi verin; bunu [`buf.gen.yaml`][buf.gen.yaml] dosyasına ekleyin:

```yaml
version: v2
plugins:
  - local: protoc-gen-go
    out: gen
    opt: paths=source_relative
  - local: protoc-gen-connect-go
    out: gen
    opt: paths=source_relative
```

Bu yapılandırma dosyaları hazır olduğunda, şemanızı kontrol edebilir ve kod üretebilirsiniz:

```bash
$ buf lint
$ buf generate
```

`gen` dizininizde artık bazı üretilmiş Go dosyalarını görmelisiniz:

```
gen
└── greet
    └── v1
        ├── greet.pb.go
        └── greetv1connect
            └── greet.connect.go
```

`gen/greet/v1` paketi, Google'ın `protoc-gen-go`'su tarafından üretilen `greet.pb.go`'yu içerir ve bu, `GreetRequest` ve `GreetResponse` yapılarını ve ilgili marşallama kodunu içerir. `gen/greet/v1/greetv1connect` paketi, `protoc-gen-connect-go` tarafından üretilen `greet.connect.go`'yu içerir ve bu, HTTP işlemleri ve istemci arayüzleri ile yapıcılarını içerir. İlgileniyorsanız göz atabilirsiniz — `greet.connect.go` yorumlar dahil 100 satırdan daha kısa.

:::warning
Ürettiğimiz kod, sıkıcı şablonları üstleniyor, ama yine de selamlaşma mantığımızı uygulamamız gerekiyor.
:::

## İşleyici Uygulayın

`GreetServiceHandler` arayüzü ile temsil edilen bu iş mantığını Code'da uygulamak için `mkdir -p cmd/server` oluşturun ve ardından `cmd/server/main.go` dosyasını ekleyin:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	greetv1 "example/gen/greet/v1" // protoc-gen-go tarafından üretilmiştir
	"example/gen/greet/v1/greetv1connect" // protoc-gen-connect-go tarafından üretilmiştir
)

type GreetServer struct{}

func (s *GreetServer) Greet(
	ctx context.Context,
	req *connect.Request[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
	log.Println("İstek başlıkları: ", req.Header())
	res := connect.NewResponse(&greetv1.GreetResponse{
		Greeting: fmt.Sprintf("Merhaba, %s!", req.Msg.Name),
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

Muhtemelen fark etmişsinizdir, `Greet` yöntemi genel türleri kullanıyor: `connect.Request` ve `connect.Response` türleri, başlıklara ve son verilere doğrudan erişim sağlarken, aynı zamanda üretilen `greetv1.GreetRequest` ve `greetv1.GreetResponse` yapılarına güçlü tip güvenliği ile erişim sunar. Genel türler, Connect'in birçok bölümünü basitleştirir ve hatta ileri düzey kullanıcıların `protoc-gen-connect-go` kullanmamasını sağlar.

Ayrı bir terminal penceresinde, artık `go.mod` dosyanızı güncelleyip sunucunuzu başlatabilirsiniz:

```bash
$ go get golang.org/x/net/http2
$ go get connectrpc.com/connect
$ go run ./cmd/server/main.go
```

## İstekler Yapın

Yeni API'nizi tüketmenin en basit yolu, JSON yükü ile bir HTTP/1.1 POST yapmaktır. Eğer güncel bir cURL sürümüne sahipseniz, bu tek satırla yapılabilir:

```bash
$ curl \
    --header "Content-Type: application/json" \
    --data '{"name": "Jane"}' \
    http://localhost:8080/greet.v1.GreetService/Greet
```

Bu şu yanıtı verir:

```bash
{"greeting": "Merhaba, Jane!"}
```

Yeni işleyiciniz otomatik olarak gRPC isteklerini de destekler:

```bash
$ grpcurl \
    -protoset <(buf build -o -) -plaintext \
    -d '{"name": "Jane"}' \
    localhost:8080 greet.v1.GreetService/Greet
```

Bu şu yanıtı verir:

```bash
{
  "greeting": "Merhaba, Jane!"
}
```

Ayrıca, Connect'in ürettiği istemciyi kullanarak da istekler yapabiliriz. `mkdir -p cmd/client` oluşturun ve `cmd/client/main.go` dosyasını şunlarla doldurun:

```go
package main

import (
	"context"
	"log"
	"net/http"

	greetv1 "example/gen/greet/v1"
	"example/gen/greet/v1/greetv1connect"

	"connectrpc.com/connect"
)

func main() {
	client := greetv1connect.NewGreetServiceClient(
		http.DefaultClient,
		"http://localhost:8080",
	)
	res, err := client.Greet(
		context.Background(),
		connect.NewRequest(&greetv1.GreetRequest{Name: "Jane"}),
	)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println(res.Msg.Greeting)
}
```

Sunucunuz hala ayrı bir terminal penceresinde çalışırken, istemcinizi şimdi çalıştırabilirsiniz:

```bash
$ go run ./cmd/client/main.go
```

Tebrikler — ilk Connect servisinizi oluşturdunuz! 🎉

## Connect protokolü yerine gRPC protokolünü kullanın

`connect-go` üç protokolü destekler:

- gRPC protokolü; gRPC ekosisteminde kullanılan, `connect-go`'nun `uyumlu` olduğu diğer gRPC uygulamaları ile sorunsuz bir şekilde çalışmasını sağlar. `grpc-go` istemcileri, `connect-go` sunucuları ile ve tersine sorun yaşamadan çalışacaktır - aslında, `connect-go`'nun halka açık sürümünden önce, [Buf CLI][buf-cli] işte bunu yapıyordu.
- [grpc/grpc-web][grpc-web] tarafından kullanılan gRPC-Web protokolü, `connect-go` sunucularının `grpc-web` ön uçları ile aracısız birlikte çalışmasını sağlar (örneğin Envoy gibi).
- Yeni `Connect protokolü`, HTTP/1.1 veya HTTP/2 üzerinden çalışan basit, HTTP tabanlı bir protokoldür. gRPC ve gRPC-Web'in en iyi yönlerini, akış dahil, alır ve bunları tarayıcılar, monolitler ve mikro hizmetlerde eşit derecede iyi çalışan bir protokole ambalajlar. Connect protokolü, gRPC protokolünün olması gerektiğini düşündüğümüz şeydir. Varsayılan olarak, JSON ve ikili Protobuf kodlaması desteklenmektedir.

Varsayılan olarak, `connect-go` sunucuları hiçbir yapılandırma gerektirmeden bu üç protokolden gelen istemcileri destekler. `connect-go` istemcileri varsayılan olarak Connect protokolünü kullanır, ancak `WithGRPC` veya `WithGRPCWeb` istemci seçeneklerini ayarlayarak gRPC veya gRPC-Web protokollerini kullanabilir.

Yukarıdaki `cmd/client/main.go` dosyasını düzenleyerek `GreetServiceClient`'i `WithGRPC` seçeneğini kullanarak oluşturun:

```go
client := greetv1connect.NewGreetServiceClient(
  http.DefaultClient,
  "http://localhost:8080",
  //highlight-next-line
  connect.WithGRPC(),
)
```

Sunucunuz hala ayrı bir terminal penceresinde çalışıyorken, istemciyi bir kez daha çalıştırın:

```bash
$ go run ./cmd/client/main.go
```

Çıktınız aynı kalmalı, ancak `connect-go` artık iletişim için gRPC protokolünü kullanıyor.

## Peki ne olacak?

Sadece birkaç satır yazılmış kodla, hem gRPC hem de Connect protokollerini destekleyen gerçek bir API sunucusu oluşturdunuz. Elle yazılmış bir REST servisine kıyasla, URL hiyerarjisi tasarlamak, istek ve yanıt yapılarını elle yazmak, kendi marşallamanızı yönetmek veya sorgu parametrelerinden yazılı değerler ayrıştırmak zorunda kalmadınız. Daha da önemlisi, kullanıcılarınıza tür güvenli bir istemci sağladınız, bu sizin tarafınızdan *hiçbir* ekstra çalışma gerektirmedi.

[buf]: https://buf.build/
[buf.gen.yaml]: https://buf.build/docs/configuration/v2/buf-gen-yaml
[buf.yaml]: https://buf.build/docs/configuration/v2/buf-yaml
[buf-cli]: https://github.com/bufbuild/buf
[cURL]: https://curl.se/
[godoc]: https://pkg.go.dev/connectrpc.com/connect
[go-releases]: https://golang.org/doc/devel/release
[grpc-web]: https://github.com/grpc/grpc-web
[install-go]: https://golang.org/doc/install
[protobuf]: https://developers.google.com/protocol-buffers