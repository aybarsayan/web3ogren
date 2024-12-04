---
title: Dağıtım & h2c
seoTitle: Dağıtım ve H2C - Bağlantı APIsi
sidebar_position: 10
description: Bu kılavuz, bağlantı APIsinin üretime nasıl dağıtılacağını, zaman aşımını ve CORSu nasıl yapılandıracağınızı kapsar. RPC konularında bilgiler içerir.
tags: 
  - dağıtım
  - h2c
  - bağlantı API'si
  - zaman aşımı
  - CORS
keywords: 
  - dağıtım
  - h2c
  - bağlantı
  - zaman aşımı
  - CORS
---
Bağlantı API'si oluşturduktan sonra, hala onu üretime dağıtmanız gerekiyor. Bu
kılavuz, zaman aşımını, gözlemlenebilirliği, TLS olmadan HTTP/2'yi ve CORS'u
nasıl yapılandıracağınızı kapsar.

## Zaman Aşımı ve Bağlantı Havuzları

Connect, `net/http`'ye yakın bir şekilde çalışır, bu yüzden sunucularınızı ve
istemcilerinizi normalde yapacağınız gibi yapılandırmalısınız. (Farklı
zaman aşımının ne anlama geldiğinden emin değilseniz, [bu Cloudflare blog
yazısı][cloudflare-timeouts] iyi bir başlangıç noktasıdır.) Ancak bazı RPC
özgü nüanslar vardır:

- RPC istemcileri genellikle çok az sayıda ana makineye birçok istek yapar.
  HTTP istemcinizde, `Transport.MaxIdleConnsPerHost` değerini artırmak
  isteyebilirsiniz.
- Çoğu RPC sunucusu HTTP yönlendirmelerini kullanmaz, bu yüzden
  istemcilerinizi onları takip etmeyecek şekilde yapılandırmak isteyebilirsiniz:
  ```go
  client := &http.Client{
    CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
      return http.ErrUseLastResponse
    }
  }
  ```
- Connect her zaman `Accept-Encoding` HTTP başlığını ayarlar, bu yüzden
  istemcinin `Transport.DisableCompression` ayarı Connect RPC'leri üzerinde
  hiçbir etkiye sahip değildir.
- Akış RPC'leri için zaman aşım süreleri, tüm mesaj alışverişine uygulanır.
  Sunucular, unary RPC'ler için zaman aşım sürelerini makul tutmakla
  birlikte akış RPC'leri için yeterince zaman bırakmayı dengelemelidir.
  İstemciler bir uzlaşma yapılandırması kullanabilir veya akış ve unary
  çağrıları için ayrı HTTP istemcileri kullanabilirler.

:::warning
Özellikle akış RPC'lerini karşılamak için uzun sunucu zaman aşım süreleri
belirliyorsanız, `net/http`'nin zaman aşım sürelerini `net.Conn` üzerindeki
`SetDeadline` çağrısını kullanarak uyguladığını unutmayın.
:::

:::tip
Gerçekten "veri gönderilmiyorsa veya alınmıyorsa N ms içinde bu bağlantıyı kapat" gibi
bir boşta zaman aşımına ihtiyacımız var. Ne yazık ki, bu API mevcut değil 
— ve olmadan, herhangi bir okuma veya yazma, tüm akış zaman aşımı olana kadar
engellenebilir.
:::

Ayrıca, eğer [http.Server](https://pkg.go.dev/net/http#Server) 'ınızda
`ReadTimeout` veya `WriteTimeout` alanı yapılandırılmışsa, bu tüm işlem
süresine uygulanır, akış çağrıları için bile. Daha fazla bilgi için [SSS]
(../faq.md#stream-error) bölümüne bakın.

## Gözlemlenebilirlik

Connect, `net/http`'ye yakın çalıştığı için, bir `http.Handler` veya
`http.Client` ile çalışan tüm günlükleme, izleme veya metrikler Connect ile de
çalışır. Özellikle [`otelhttp`][otelhttp] OpenTelemetry paketi ve
[`ochttp`][ochttp] OpenCensus paketi, Connect sunucuları ve istemcileriyle
sorunsuz bir şekilde çalışır.

## TLS Olmadan HTTP/2 {#h2c}

Birçok ortamda HTTP/2 protokolünü TLS olmadan (_h2c_ olarak bilinir)
kullanmanız gerekebilir. Örneğin, GCP'nin Cloud Run hizmeti yalnızca
sunucunuz h2c'yi destekliyorsa uçtan uca HTTP/2'yi destekler. Benzer şekilde,
h2c kullanarak `grpc-go` sunucuları ve istemcileri ile birlikte
çalışmak isteyebilirsiniz (bu, `insecure` paketi aracılığıyla). `net/http`
doğrudan h2c için yapılandırma düğmeleri sunmadığından, Connect sunucuları ve
istemcileri `golang.org/x/net/http2` kullanmalıdır.

Herhangi bir `http.Handler`'a h2c desteği eklemek için onu
`h2c.NewHandler` ile sarmanız yeterlidir. Bunu genellikle sunucunuzu
oluştururken yaparsınız:

```go
package main

import (
  "net/http"

  "golang.org/x/net/http2"
  "golang.org/x/net/http2/h2c"
)

func main() {
  mux := http.NewServeMux()
  // Burada bazı işleyicileri monte edin.
  server := &http.Server{
    Addr: ":http",
    Handler: h2c.NewHandler(mux, &http2.Server{}),
    // Zaman aşımını unutmamayı unutmayın!
  }
}
```

İstemcilerinizi h2c kullanacak şekilde yapılandırmak sadece biraz daha
karmaşıktır:

```go
package main

import (
  "crypto/tls"
  "net"
  "net/http"

  "golang.org/x/net/http2"
)

func newInsecureClient() *http.Client {
  return &http.Client{
    Transport: &http2.Transport{
      AllowHTTP: true,
      DialTLS: func(network, addr string, _ *tls.Config) (net.Conn, error) {
        // Bu istemciyi h2c dışındaki trafiğinizi de kullanıyorsanız,
        // ağ TCP değilse veya adres bir izinli listede değilse tls.Dial'e
        // devretmeyi düşünebilirsiniz.
        return net.Dial(network, addr)
      },
      // Zaman aşımını unutmamayı unutmayın!
    },
  }
}
```

[cloudflare-timeouts]: https://blog.cloudflare.com/the-complete-guide-to-golang-net-http-timeouts/
[go-deadlines]: https://github.com/golang/go/issues/16100
[otelhttp]: https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
[ochttp]: https://pkg.go.dev/go.opencensus.io/plugin/ochttp

## CORS

Farklı kökenli kaynak paylaşımı (CORS), web istemcilerini sunucunun kendi
dışındaki diğer kökenlerde desteklemek için gereklidir. Go'da sunucular, CORS'u
herhangi bir popüler üçüncü taraf kütüphaneyi kullanarak veya `OPTIONS`
isteklerini işlemek için küçük bir `net/http` ara yazılıması yazarak
yapılandırabilir. Her iki durumda da,
[`connectrpc.com/cors`](https://github.com/connectrpc/cors-go) paketi bazı
yararlı yardımcı işlevler sağlar.

Aşağıdaki örnek, [`github.com/rs/cors`](https://github.com/rs/cors) paketini
kullanarak bir Connect işleyicisine CORS desteği eklemeyi gösterir:

```go
import (
	"net/http"

	connectcors "connectrpc.com/cors"
	"github.com/rs/cors"
)

// withCORS, bir Connect HTTP işleyicisine CORS desteği ekler.
func withCORS(h http.Handler) http.Handler {
	middleware := cors.New(cors.Options{
		AllowedOrigins: []string{"example.com"},
		AllowedMethods: connectcors.AllowedMethods(),
		AllowedHeaders: connectcors.AllowedHeaders(),
		ExposedHeaders: connectcors.ExposedHeaders(),
	})
	return middleware.Handler(h)
}
```

Uygulamanıza özgü istek başlıklarını izin verilen başlıklara dahil ettiğinizden
ve yanıt başlıklarını ortaya çıkan başlıklara eklediğinizden emin olun. Uygulamanız
trailer kullanıyorsa, bunlar unary Connect RPC'leri için `Trailer-` ön ekiyle başlık
alanları olarak gönderilecektir.