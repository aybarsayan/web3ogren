---
description: Deno, geliştiricilere standart Web Platform API'lerini kullanarak basit ve etkili bir platform sunar. Bu sayfada Web API'lerinin uygulanışı ve kullanımı hakkında bilgi verilmektedir.
keywords: [Deno, Web Platform API, fetch, Web Storage, Web Workers, EventTarget, CustomEvent]
---

Deno, web ve bulut geliştirmeyi standart Web Platform API'leri (örneğin, `fetch`, WebSockets ve daha fazlası) kullanarak özel API'ler yerine basitleştirir. Bu, eğer daha önce tarayıcı için bir şeyler geliştirdiyseniz, muhtemelen Deno'yu zaten tanıdığınız anlamına gelir ve eğer Deno öğreniyorsanız, web bilgilerinize de yatırım yapıyorsunuz demektir.

Desteklenen Web API'lerini keşfedin

Aşağıda Deno'nun desteklediği bazı standart Web API'leri vurgulanacaktır.

Deno'da bir Web Platform API'sinin mevcut olup olmadığını kontrol etmek için [MDN'deki arabirime](https://developer.mozilla.org/en-US/docs/Web/API#interfaces) tıklayabilir ve [Tarayıcı Uyumluluğu tablosuna](https://developer.mozilla.org/en-US/docs/Web/API/AbortController#browser_compatibility) bakabilirsiniz.

## fetch

`fetch` API'si HTTP istekleri yapmak için kullanılabilir. Bu, [WHATWG `fetch` spesifikasyonuna](https://fetch.spec.whatwg.org/) uygun şekilde uygulanmıştır.

### Spec sapmaları

:::warning
Deno'da bazı önemli sapmalar mevcuttur. Bunlara dikkat edilmesi önerilmektedir.
:::

- Deno kullanıcı aracında bir çerez kavanozu bulunmamaktadır. Bu nedenle, bir yanıt üzerindeki `set-cookie` başlığı işlenmez veya görünür yanıt başlıklarından filtrelenmez.
- Deno aynı köken politikasını takip etmez, çünkü Deno kullanıcı aracı şu anda köken kavramına sahip değildir ve bir çerez kavanozu yoktur. Bu, Deno'nun kimlik doğrulama verilerini kökenler arası sızdırmalara karşı koruması gerekmediği anlamına gelir. Bu nedenle Deno, WHATWG `fetch` spesifikasyonunun aşağıdaki bölümlerini uygulamamaktadır:
  - Bölüm `3.1. 'Origin' başlığı`.
  - Bölüm `3.2. CORS protokolü`.
  - Bölüm `3.5. CORB`.
  - Bölüm `3.6. 'Cross-Origin-Resource-Policy' başlığı`.
  - `Atomic HTTP yönlendirme işlemleri`.
  - `opaqueredirect` yanıt türü.
- `redirect` modu `manual` olan bir `fetch`, `opaqueredirect` yanıtı yerine `basic` yanıtı döndürecektir.
- Spesifikasyon, [`file:` URL'lerinin nasıl işleneceği konusunda](https://fetch.spec.whatwg.org/#scheme-fetch) belirsizdir. Firefox, `file:` URL'lerini alabilen tek ana akım tarayıcıdır ve bu durumda bile varsayılan olarak çalışmaz. Deno 1.16 itibarıyla, Deno yerel dosyaları almayı desteklemektedir. Detaylar için bir sonraki bölüme bakın.
- `request` ve `response` başlık korumaları uygulanmıştır, ancak tarayıcılara kıyasla hangi başlık adlarının izin verildiği konusunda herhangi bir kısıtlama yoktur.
  
### Yerel dosyaların alınması

Deno, `file:` URL'lerini almayı destekler. Bu, sunucuda ve yerelde aynı kod yolunu kullanan kod yazmayı kolaylaştırır ve hem Deno CLI hem de Deno Deploy ile çalışan kod yazmayı da kolaylaştırır.

:::tip
Yerel dosyaların alınması işlemi için özen gösterilmelidir.
:::

Deno yalnızca mutlak dosya URL'lerini destekler, yani `fetch("./some.json")` çalışmayacaktır. Ancak, `--location` belirtilirse, göreceli URL'ler `--location`'ı temel alır, ancak bir `file:` URL'si `--location` olarak geçilemez.

Mevcut modüle referansla bir kaynağı almak için, hangi modül yerel veya uzaktıysa, `import.meta.url`'yi temel alarak kullanmalısınız. Örneğin:

```js
const response = await fetch(new URL("./config.json", import.meta.url));
const config = await response.json();
```

Yerel dosyaların alınmasıyla ilgili notlar:

- Kaynakları okumaya izin verilir, bu nedenle uygun bir `--allow-read` izni gereklidir.
- Yerel alımlar yalnızca `GET` yöntemini destekler ve başka bir yöntem kullanıldığında sözleşmeyi reddeder.
- Mevcut olmayan bir dosya, belirsiz bir `TypeError` ile sözleşmeyi reddeder. Bu, parmak izi saldırılarını önlemek içindir.

---

## CustomEvent ve EventTarget

`DOM Etkinlik API'si`, bir uygulamada meydana gelen olayları iletmek ve dinlemek için kullanılabilir. Bu, [WHATWG DOM spesifikasyonuna](https://dom.spec.whatwg.org/#events) uygun şekilde uygulanmıştır.

### Spec sapmaları

:::info
Deno'daki EventTarget uygulaması bazı farklılıklar barındırmaktadır.
:::

- Olaylar kabarmaz, çünkü Deno'nun bir DOM hiyerarşisi yoktur, yani olayların kabarması/yakalaması için bir ağaç yoktur.
- `timeStamp` özelliği her zaman `0` olarak ayarlıdır.

## Yazım

Uygulanan web API'leri için TypeScript tanımları [`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/tsc/dts/lib.deno.shared_globals.d.ts) ve [`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/tsc/dts/lib.deno.window.d.ts) dosyalarında bulunabilir.

İşçilere özgü tanımlar [`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/tsc/dts/lib.deno.worker.d.ts) dosyasında bulunabilir.

## Location

Deno, webden `location` globalini destekler.

### Konum bayrağı

Deno sürecinde kullanılacak bir konum için URL'sini kullanabileceğimiz bir "web sayfası" yoktur. Bunun yerine, kullanıcıların CLI üzerinde `--location` bayrağını kullanarak bir belge konumunu taklit etmelerine izin verilir. Bu, bir `http` veya `https` URL'si olabilir.

```ts
// deno run --location https://example.com/path main.ts

console.log(location.href);
// "https://example.com/path"
```

:::danger
Eğer `--location ` geçmezseniz, `location` globaline her erişim hatası verecektir.
:::

```ts
// deno run main.ts

console.log(location.href);
// hata: Uncaught ReferenceError: Access to "location", run again with --location <href>.
```

`location` veya herhangi bir alanını ayarlamak, normalde tarayıcılarda yönlendirmelere neden olur. Bu Deno'da geçerli değildir; bu nedenle, bu durumda hata verecektir.

```ts
// deno run --location https://example.com/path main.ts

location.pathname = "./foo";
// hata: Uncaught NotSupportedError: Cannot set "location.pathname".
```

### Genişletilmiş kullanım

Web'de, kaynak çözümü (modüller hariç) genellikle `location.href` değerini kullanarak herhangi bir göreceli URL'yi temel alır. Bu, Deno'nun benimsemiş olduğu bazı web API'lerini etkiler.

#### Fetch API

```ts
// deno run --location https://api.github.com/ --allow-net main.ts

const response = await fetch("./orgs/denoland");
// "https://api.github.com/orgs/denoland" adresine alım yapar.
```

Yukarıdaki `fetch()` çağrısı, `--location` bayrağı geçirilmediyse hata verir, çünkü temel alacak bir web-analogu konumu yoktur.

---

## Web Storage

`Web Storage API'si`, dize anahtar ve değerlerini depolamak için bir API sağlar. Verilerin saklanması bir tarayıcıya benzer şekilde çalışır ve 10MB depolama limiti vardır. Global `sessionStorage` nesnesi yalnızca mevcut yürütme bağlamı için veriyi saklarken, `localStorage` verileri yürütmeden yürütmeye saklar.

:::note
Deno'da veri saklama alanları ile ilgili yeni kurallar mevcut.
:::

Bir tarayıcıda `localStorage`, verileri kök başına özgü saklar (etkili biçimde protokol artı ana makine adı artı port). Deno 1.16 itibarıyla, Deno'nun veri saklamak için benzersiz bir saklama alanı belirleme kuralları vardır:

- `--location` bayrağını kullanırken, konumun kökeni veriyi benzersiz bir şekilde saklamak için kullanılır. Bu, `http://example.com/a.ts`, `http://example.com/b.ts` ve `http://example.com:80/` konumlarının aynı depolamayı paylaşacağı, ancak `https://example.com/`'un farklı olacağı anlamına gelir.
- Eğer bir konum belirleyici yoksa, ancak bir `--config` yapılandırma dosyası belirtilmişse, o yapılandırma dosyasının mutlak yolu kullanılır. Yani `deno run --config deno.jsonc a.ts` ve `deno run --config deno.jsonc b.ts` aynı depolamayı paylaşırken, `deno run --config tsconfig.json a.ts` farklı olacaktır.

`localStorage`'dan öğeleri ayarlamak, almak ve kaldırmak için aşağıdakileri kullanabilirsiniz:

```ts
// localStorage'da bir öğe ayarlamak
localStorage.setItem("myDemo", "Deno Uygulaması");

// localStorage'dan bir öğe okumak
const cat = localStorage.getItem("myDemo");

// localStorage'dan bir öğeyi kaldırmak
localStorage.removeItem("myDemo");

// localStorage'daki tüm öğeleri kaldırmak
localStorage.clear();
```

---

## Web Workers

Deno, `Web Worker API'sini` destekler.

İşçiler, kodu birden fazla iş parçacığında çalıştırmak için kullanılabilir. Her `Worker` örneği ayrı bir iş parçacığında çalıştırılır ve yalnızca o işçi için ayrılmıştır.

:::tip
Yeni bir işçi oluştururken `type: "module"` seçeneğini vermek önemlidir.
:::

Ana işçi içerisindeki göreceli modül belirtimleri yalnızca CLI'de `--location ` geçildiğinde desteklenmektedir. Bu taşınabilirlik için önerilmez. Bunun yerine, bir belirteç oluşturmak için `URL` yapıcısını ve `import.meta.url`'yi kullanarak kolayca bir belirtici oluşturabilirsiniz. Ancak, özel işçilerin bir konumu vardır ve bu yetenek varsayılan olarak mevcuttur.

```ts
// İyi
new Worker(import.meta.resolve("./worker.js"), { type: "module" });

// Kötü
new Worker(import.meta.resolve("./worker.js"));
new Worker(import.meta.resolve("./worker.js"), { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

Normal modüllerde olduğu gibi, işçi modüllerinde de üst düzey `await` kullanabilirsiniz. Ancak, mesajların kaybolabileceği için, ilk `await` işleminden önce mesaj işleyicisini kaydetmeyi unutmayın. Bu, Deno'da bir hata değildir, sadece özelliklerin talihsiz bir etkileşimidir ve bu durum modül işçilerini destekleyen tüm tarayıcılarda da gerçekleşir.

```ts
import { delay } from "jsr:@std/async@1/delay";

// İlk await: bir saniye bekler, ardından modülü çalıştırmaya devam eder.
await delay(1000);

// Mesaj işleyici, o 1 saniyeden sonra ayarlanır, böylece o süre içinde işçiye ulaşan bazı mesajlar kaydedilmemiş olabilir.
self.onmessage = (evt) => {
  console.log(evt.data);
};
```

### Oluşturma izinleri

Yeni bir `Worker` örneği oluşturmak, dinamik bir import ile benzerdir; bu nedenle Deno, bu eylem için uygun izin gerektirir.

Yerel modülleri kullanan işçiler için; `--allow-read` izni gereklidir:

```ts title="main.ts"
new Worker(import.meta.resolve("./worker.ts"), { type: "module" });
```

```ts title="worker.ts"
console.log("merhaba dünya");
self.close();
```

```shell
$ deno run main.ts
hata: Uncaught PermissionDenied: read access to "./worker.ts", run again with the --allow-read flag

$ deno run --allow-read main.ts
merhaba dünya
```

Uzak modülleri kullanan işçiler için; `--allow-net` izni gereklidir:

```ts title="main.ts"
new Worker("https://example.com/worker.ts", { type: "module" });
```

```ts title="worker.ts"
// Bu dosya https://example.com/worker.ts adresinde barındırılmaktadır
console.log("merhaba dünya");
self.close();
```

```shell
$ deno run main.ts
hata: Uncaught PermissionDenied: net access to "https://example.com/worker.ts", run again with the --allow-net flag

$ deno run --allow-net main.ts
merhaba dünya
```

### Deno'yu bir işçide kullanma

```js title="main.js"
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});

worker.postMessage({ filename: "./log.txt" });
```

```js title="worker.js"
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};
```

```text title="log.txt"
merhaba dünya
```

```shell
$ deno run --allow-read main.js
merhaba dünya
```

### İşçi izinlerini belirtme

:::caution
Bu istikrarsız bir Deno özelliğidir. Daha fazla bilgi için [istikrarsız özellikler](https://runtime/fundamentals/stability_and_releases/#unstable-apis) sayfasına göz atın.
:::

İşçi için mevcut olan izinler, CLI izin bayraklarına benzer; bu, orada etkinleştirilen her izin düzeyinin İşçi API'si düzeyinde devre dışı bırakılabileceği anlamına gelir. Her bir izin seçeneği ile ilgili daha ayrıntılı bir açıklama [burada](https://runtime/fundamentals/security/) bulunabilir.

Varsayılan olarak bir işçi, oluşturulduğu iş parçacığından izinlerini devralır. Ancak, kullanıcıların bu işçinin erişimini sınırlamasına olanak tanımak için işçi API'sinde `deno.permissions` seçeneğini sağlıyoruz.

Ayrıntılı erişim destekleyen izinler için, işçinin erişebileceği kaynakların bir listesini geçebilir ve yalnızca açma/kapama seçeneği olanlar için sırasıyla `true/false` geçebilirsiniz:

```ts
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: [
        "deno.land",
      ],
      read: [
        new URL("./file_1.txt", import.meta.url),
        new URL("./file_2.txt", import.meta.url),
      ],
      write: false,
    },
  },
});
```

Detaylı erişim izinleri, hem mutlak hem de göreceli yolları argüman olarak alır, ancak göreceli yolların işçi örneğinin oluşturulduğu dosyaya göre çözüldüğünü göz önünde bulundurun, işçi dosyasının bulunduğu yere göre değil:

```ts
const worker = new Worker(
  new URL("./worker/worker.js", import.meta.url).href,
  {
    type: "module",
    deno: {
      permissions: {
        read: [
          "/home/user/Documents/deno/worker/file_1.txt",
          "./worker/file_2.txt",
        ],
      },
    },
  },
);
```

---

## Diğer API'lerin spesifikasyondan sapmaları

### Cache API

Yalnızca aşağıdaki API'ler uygulanmıştır:

- [CacheStorage::open()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open)
- [CacheStorage::has()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/has)
- [CacheStorage::delete()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete)
- [Cache::match()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
- [Cache::put()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)
- [Cache::delete()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete)

Tarayıcılara kıyasla birkaç farklılık vardır:

1. API'lere göreceli yollar geçemezsiniz. İstek, bir Request veya URL örneği ya da bir URL dizesi olabilir.
2. `match()` & `delete()` henüz sorgu seçeneklerini desteklememektedir.