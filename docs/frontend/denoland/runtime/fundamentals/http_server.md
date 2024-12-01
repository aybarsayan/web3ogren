---
description: HTTP sunucuları yazma konusunda kapsamlı bir rehber. Deno'nun yerleşik HTTP sunucu API'si ile sunucu oluşturma, gelen istekleri işleme ve HTTPS desteği gibi konuları kapsar.
keywords: [HTTP sunucusu, Deno, web geliştirimi, REST API, WebSocket, HTTPS, Oak]
title: "HTTP Sunucusu Yazma"
---

HTTP sunucuları web'in belkemiğidir, web sitelerine erişmenizi, dosyaları indirmenizi ve web hizmetleriyle etkileşimde bulunmanızı sağlar. Müşterilerden (web tarayıcıları gibi) gelen istekleri dinler ve yanıtlar gönderir.

Kendi HTTP sunucunuzu oluşturduğunuzda, **davranışını tamamen kontrol edebilir** ve özel ihtiyaçlarınıza göre şekillendirebilirsiniz. Bunu yerel geliştirme için, HTML, CSS ve JS dosyalarınızı sunmak için ya da bir REST API oluşturmak için kullanıyor olabilirsiniz - kendi sunucunuza sahip olmak, uç noktaları tanımlamanıza, istekleri yönetmenize ve verileri yönetmenize olanak tanır.

## Deno'nun yerleşik HTTP sunucusu

Deno, HTTP sunucuları yazmanıza olanak tanıyan yerleşik bir HTTP sunucu API'sine sahiptir. [`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) API'si HTTP/1.1 ve HTTP/2'yi destekler.

### "Merhaba Dünya" sunucusu

`Deno.serve` fonksiyonu, gelen her isteği işlemek için çağrılacak bir işlev alır ve bir yanıt (veya bir yanıtı çözümleyen bir promise) döndürmesi beklenir.

İşte her istek için "Merhaba, Dünya!" yanıtı döndüren bir sunucu örneği:

```ts title="server.ts"
Deno.serve((_req) => {
  return new Response("Merhaba, Dünya!");
});
```

İşleyici aynı zamanda bir `Promise` döndürebilir, bu da `async` bir fonksiyon olabileceği anlamına gelir.

Bu sunucuyu çalıştırmak için `deno run` komutunu kullanabilirsiniz:

```sh
deno run --allow-net server.ts
```

### Belirli bir portta dinleme

Varsayılan olarak `Deno.serve` `8000` numaralı portta dinleyecektir, ancak bu, seçenekler torbasında bir port numarası geçirerek değiştirilebilir:

```js title="server.ts"
// 4242 numaralı portta dinlemek için.
Deno.serve({ port: 4242 }, handler);

// 4242 numaralı portta dinlemek ve 0.0.0.0'a bağlamak için.
Deno.serve({ port: 4242, hostname: "0.0.0.0" }, handler);
```

### Gelen isteği inceleme

Çoğu sunucu, her istek için aynı yanıtı vermez. Bunun yerine, yanıtlarını isteğin çeşitli yönlerine göre değiştirir: HTTP yöntemi, başlıklar, yol veya gövde içeriği.

İstek, işlevin ilk argümanı olarak geçirilir. İşte isteğin çeşitli parçalarını nasıl çıkaracağınızı gösteren bir örnek:

```ts
Deno.serve(async (req) => {
  console.log("Metod:", req.method);

  const url = new URL(req.url);
  console.log("Yol:", url.pathname);
  console.log("Sorgu parametreleri:", url.searchParams);

  console.log("Başlıklar:", req.headers);

  if (req.body) {
    const body = await req.text();
    console.log("Gövde:", body);
  }

  return new Response("Merhaba, Dünya!");
});
```

:::caution
`req.text()` çağrısının, kullanıcı bağlantıyı gövde tamamen alınmadan önce kapatırsa başarısız olabileceğini unutmayın. Bu durumu yönetmek için önlem almayı unutmayın. Bu, `req.json()`, `req.formData()`, `req.arrayBuffer()`, `req.body.getReader().read()`, `req.body.pipeTo()` gibi isteğin gövdesinden okuma yapan tüm yöntemlerde de baş gösterebilir.
:::

### Gerçek verilerle yanıt verme

Çoğu sunucu her isteğe "Merhaba, Dünya!" şeklinde yanıt vermez. Bunun yerine, farklı başlıklar, durum kodları ve gövde içerikleri (hatta gövde akışları) ile yanıt verebilirler.

İşte 404 durum kodu, bir JSON gövdesi ve özel bir başlık içeren bir yanıt döndürmenin örneği:

```ts title="server.ts"
Deno.serve((req) => {
  const body = JSON.stringify({ message: "BULUNAMADI" });
  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
```

### Bir akışla yanıt verme

Yanıt gövdesi de akışlar olabilir. İşte her saniyede bir "Merhaba, Dünya!" döndüren bir yanıt örneği:

```ts title="server.ts"
Deno.serve((req) => {
  let timer: number;
  const body = new ReadableStream({
    async start(controller) {
      timer = setInterval(() => {
        controller.enqueue("Merhaba, Dünya!\n");
      }, 1000);
    },
    cancel() {
      clearInterval(timer);
    },
  });
  return new Response(body.pipeThrough(new TextEncoderStream()), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
```

:::note
Yukarıdaki `cancel` fonksiyonuna dikkat edin. Bu, istemci bağlantıyı kapattığında çağrılır. Bu durumu yönetmek önemlidir, aksi takdirde sunucu mesajları sonsuza dek sıraya alır ve sonuçta hafızası tükenir.
:::

Yanıt gövdesi akışının, istemci bağlantıyı kapattığında "iptal" olduğunu unutmayın. Bu durumu yönetmeyi unutmayın. Bu, yanıt gövdesi `ReadableStream` nesnesine (örneğin bir `TransformStream` aracılığıyla) bağlı bir `WritableStream` nesnesinde bir `write()` çağrısında hata olarak kendini gösterebilir.

### HTTPS desteği

HTTPS kullanmak için, seçeneklerde iki ekstra argümanı birlikte geçirin: `cert` ve `key`. Bunlar, sırasıyla sertifika ve anahtar dosyalarının içerikleridir.

```js
Deno.serve({
  port: 443,
  cert: Deno.readTextFileSync("./cert.pem"),
  key: Deno.readTextFileSync("./key.pem"),
}, handler);
```

:::note
HTTPS kullanmak için geçerli bir TLS sertifikasına ve sunucunuz için özel bir anahtara ihtiyacınız olacak.
:::

### HTTP/2 desteği

HTTP/2 desteği, Deno ile HTTP sunucu API'lerini kullanırken "otomatik" olarak sağlanır. Sunucunuzu oluşturmanız yeterlidir ve HTTP/1 veya HTTP/2 isteklerini sorunsuz bir şekilde işler.

HTTP/2, ön bilgi ile düz metin üzerinden de desteklenmektedir.

### Otomatik gövde sıkıştırması

HTTP sunucusu, yanıt gövdelerinin otomatik sıkıştırmasını sağlar. Bir yanıt bir istemciye gönderildiğinde, Deno bu yanıt gövdesinin güvenle sıkıştırılıp sıkıştırılamayacağını belirler. Bu sıkıştırma, Deno'nun iç işleyişinde gerçekleştiği için hızlı ve verimlidir.

Şu anda Deno, gzip ve brotli sıkıştırmasını desteklemektedir. Bir gövde, aşağıdaki koşullar sağlandığında otomatik olarak sıkıştırılır:

- İstek, `br` (Brotli) veya `gzip` desteğinin olduğunu belirten bir
  [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
  başlığına sahiptir. Deno, başlıktaki
  [kalite değerine](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values)
  saygı gösterir.
- Yanıt, sıkıştırılabilir olarak kabul edilen bir
  [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
  içerir. (Liste, [`jshttp/mime-db`](https://github.com/jshttp/mime-db/blob/master/db.json)'den alınmış olup, gerçekteki liste
  [kodda](https://github.com/denoland/deno/blob/v1.21.0/ext/http/compressible.rs) bulunmaktadır.)
- Yanıt gövdesi 64 bayttan büyüktür.

Yanıt gövdesi sıkıştırıldığında, Deno `Content-Encoding` başlığını sıkıştırma biçimini yansıtacak şekilde ayarlayacak ve yanıtı etkileyen hangi istek başlıklarının olduğunu belirtmek için `Vary` başlığını ayarlayacak veya ekleyecektir.

Yukarıdaki mantığın yanı sıra, bir yanıtın **otomatik olarak** sıkıştırılmayacağı birkaç sebep vardır:

- Yanıt bir `Content-Encoding` başlığı içeriyorsa. Bu, sunucunuzun halihazırda bir tür kodlama yaptığı anlamına gelir.
- Yanıt bir
  [`Content-Range`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
  başlığı içeriyorsa. Bu, sunucunuzun bir aralık isteğine yanıt verdiği ve baytların ile aralıkların Deno'nun iç işleyişi kontrolü dışında müzakere edildiği anlamına gelir.
- Yanıtın bir
  [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
  başlığı varsa ve bu başlık bir
  [`no-transform`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other)
  değerini içeriyorsa. Bu, sunucunuzun Deno veya herhangi bir aşağıdaki proxy'nin yanıtı değiştirmesini istemediği anlamına gelir.

### WebSocket'leri Sunma

Deno, gelen HTTP isteklerini bir WebSocket'e yükseltebilir. Bu, HTTP sunucularınızda WebSocket uç noktalarını yönetmenizi sağlar.

Gelen bir `Request`'i bir WebSocket'e yükseltmek için `Deno.upgradeWebSocket` fonksiyonunu kullanırsınız. Bu, bir `Response` ve bir web standartları `WebSocket` nesnesinden oluşan bir nesne döndürür. Döndürülen yanıt, gelen isteğe yanıt vermek için kullanılmalıdır.

WebSocket protokolü simetrik olduğundan, `WebSocket` nesnesi istemci tarafı iletişimi için kullanılabilecek olanla aynıdır. Bununla ilgili belgeleri
[MDN'de](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) bulabilirsiniz.

```ts title="server.ts"
Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.addEventListener("open", () => {
    console.log("bir istemci bağlandı!");
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
  });

  return response;
});
```

WebSocket'in oluşturulduğu bağlantı, bir WebSocket yükseltmesi yapıldıktan sonra HTTP trafiği için kullanılamaz.

:::note
Şu anda WebSocket'lerin yalnızca HTTP/1.1 üzerinde desteklendiğini unutmayın.
:::

## Varsayılan fetch dışa aktarma

Deno'da bir HTTP sunucusu oluşturmanın bir diğer yolu, varsayılan bir `fetch` fonksiyonu dışa aktarmaktır. `Fetch API'si`, bir ağdan veri almak için bir HTTP isteği başlatır ve Deno çalışma zamanına entegre edilmiştir.

```ts title="server.ts"
export default {
  fetch(request) {
    const userAgent = request.headers.get("user-agent") || "Bilinmiyor";
    return new Response(`Kullanıcı Ajanı: ${userAgent}`);
  },
} satisfies Deno.ServeDefaultExport;
```

Bu dosyayı `deno serve` komutuyla çalıştırabilirsiniz:

```sh
deno serve server.ts
```

Sunucu başlayacak ve konsolda bir mesaj gösterecektir. Tarayıcınızı açın ve kullanıcı ajanı bilgilerini görmek için [http://localhost:8000/](http://localhost:8000/) adresine gidin.

## Bu örnekler üzerine inşa etme

Bu örnekleri daha karmaşık sunucular oluşturmak için genişletmek isteyeceksiniz. Deno, web sunucuları oluşturmak için [Oak](https://jsr.io/@oak/oak) kullanılmasını önermektedir. Oak, Deno'nun HTTP sunucusu için bir ara yazılım çerçevesidir, ifade edici ve kullanımının kolay olması için tasarlanmıştır. Ara yazılım desteği ile web sunucuları oluşturmanın basit bir yolunu sağlar. Rotaları tanımlamak için nasıl yapılacağıyla ilgili örnekler için [Oak belgelerine](https://oakserver.github.io/oak/) göz atın.