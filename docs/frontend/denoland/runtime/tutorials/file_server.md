---
title: "Bir dosya sunucusu yazın"
description: Bu doküman, Deno kullanarak bir dosya sunucusunun nasıl oluşturulacağını ve Deno Standart Kütüphanesi'ndeki mevcut dosya sunucu aracını nasıl kullanacağınızı adım adım açıklar. Kendi dosya sunucunuzu yazmanın yanı sıra, kolay bir çözüm olarak standart kütüphaneyi kullanmanın avantajlarını keşfedeceksiniz.
keywords: [Deno, dosya sunucusu, HTTP, ReadableStream, dosya sistemi API, std/http, web geliştirme]
---

Bir dosya sunucusu gelen HTTP isteklerini dinler ve yerel dosya sisteminden dosyalar sunar. Bu eğitim, Deno'nun yerleşik `dosya sistemi API'lerini` kullanarak basit bir dosya sunucusu nasıl oluşturacağınızı gösterir.

## Basit Bir Dosya Sunucusu Yazın

Başlamak için, `file-server.ts` adında yeni bir dosya oluşturun.

Gelen istekleri dinlemek için Deno'nun yerleşik `HTTP sunucusunu` kullanacağız. Yeni `file-server.ts` dosyanıza aşağıdaki kodu ekleyin:

```ts title="file-server.ts"
Deno.serve(
  { hostname: "localhost", port: 8080 },
  (request) => {
    const url = new URL(request.url);
    const filepath = decodeURIComponent(url.pathname);
  },
);
```

> Eğer `URL` nesnesi hakkında daha fazlasını öğrenmek istemiyorsanız, bununla ilgili daha fazla bilgiyi [URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL) belgelerinde bulabilirsiniz.  
> [decodeURIComponent işlevi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent), URL kodlu yolu çözmek için kullanılır; eğer karakterler yüzde ile kodlanmışsa.

### Bir dosyayı açın ve içeriğini akıtın

Bir istek alındığında, istek URL'sinde belirtilen dosyayı `Deno.open` ile açmaya çalışacağız.

:::tip
İstenen dosya mevcutsa, bunu [ReadableStream API](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) ile okunabilir bir veri akışına dönüştüreceğiz ve içeriğini yanıta akıtacağız. İstenen dosyanın ne kadar büyük olabileceğini bilmediğimiz için, akıtma işlemi büyük dosyaları veya birden fazla isteği eş zamanlı olarak sunarken bellek sorunlarını önleyecektir.
:::

Eğer dosya mevcut değilse, "404 Bulunamadı" yanıtı döneceğiz.

İstek işleyicisinin gövdesinde, iki değişkenin altına aşağıdaki kodu ekleyin:

```ts
try {
  const file = await Deno.open("." + filepath, { read: true });
  return new Response(file.readable);
} catch {
  return new Response("404 Not Found", { status: 404 });
}
```

### Dosya sunucusunu çalıştırın

Yeni dosya sunucunuzu `deno run` komutuyla çalıştırın ve okuma ve ağ erişimi izni verin:

```shell
deno run --allow-read=. --allow-net file-server.ts
```

---

## Deno Standart Kütüphanesi tarafından sağlanan dosya sunucusunu kullanma

Sıfırdan bir dosya sunucusu yazmak, Deno'nun HTTP sunucusunun nasıl çalıştığını anlamak için iyi bir egzersizdir. Ancak, sıfırdan üretim hazır bir dosya sunucusu yazmak karmaşık ve hataya açık olabilir. Test edilmiş ve güvenilir bir çözüm kullanmak daha iyidir.

Deno Standart Kütüphanesi, kendinize ait yazmak zorunda kalmamanız için size bir [dosya sunucusu](https://jsr.io/@std/http/doc/file-server/~) sağlar.

Bunu kullanmak için, önce uzak scripti yerel dosya sisteminize kurun:

```shell
# Deno 1.x
deno install --allow-net --allow-read jsr:@std/http@1/file-server
# Deno 2.x
deno install --global --allow-net --allow-read jsr:@std/http@1/file-server
```

> Bu, scripti Deno kurulum kökünün bin dizinine kuracaktır; örneğin `/home/user/.deno/bin/file-server`.

Artık scripti basit script adıyla çalıştırabilirsiniz:

```shell
$ file-server .
Dinleme:
- Yerel: http://0.0.0.0:8000
```

Dosya sunucusuyla birlikte mevcut olan tüm seçeneklerin tam listesini görmek için `file-server --help` komutunu çalıştırın.

Web tarayıcınızda [http://0.0.0.0:8000/](http://0.0.0.0:8000/) adresine giderseniz, yerel dizininizin içeriğini göreceksiniz.

---

### Deno projesinde @std/http dosya sunucusunu kullanma

Bir `Deno projesinde` dosya sunucusunu kullanmak için, `deno.json` dosyanıza şunları ekleyebilirsiniz:

```sh
deno add jsr:@std/http
```

Ve ardından projenizde bunu içe aktarın:

```ts title="file-server.ts"
import { serveDir } from "@std/http/file-server";

Deno.serve((req) => {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "path/to/static/files/dir",
    });
  }
  return new Response();
});
```

:::note
Bu kod, `Deno.serve` ile bir HTTP sunucusu kuracaktır. Bir istek geldiğinde, istenen yolun "static" ile başlayıp başlamadığını kontrol eder. Eğer öyleyse, belirtilen dizinden dosyaları sunar. Aksi takdirde, boş bir yanıt verir.
:::

🦕 Artık kendi basit dosya sunucunuzu nasıl yazacağınızı ve Deno Standart Kütüphanesi tarafından sağlanan dosya sunucu aracını nasıl kullanacağınızı biliyorsunuz. Statik dosyaları serve etme, yüklemeleri yönetme, verileri dönüştürme veya erişim kontrolü sağlama gibi çeşitli görevlerle başa çıkmaya hazırsınız - Deno ile dosyaları sunmaya hazırsınız.