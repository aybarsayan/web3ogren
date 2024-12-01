---
title: "Node.js'te KV Kullanımı"
description: Node.js için Deno KV veritabanına bağlanmak ve kullanmakla ilgili adım adım bir rehber. Resmi istemci kütüphanesi ile kurulum ve kullanım detayları.
keywords: [Node.js, Deno, KV, veritabanı, istemci kütüphanesi]
---

Node.js'te bir Deno KV veritabanına bağlanmak, [npm üzerindeki resmi istemci kütüphanemiz](https://www.npmjs.com/package/@deno/kv) aracılığıyla desteklenmektedir. Bu seçenek için kullanım talimatlarını aşağıda bulabilirsiniz.

## Kurulum ve kullanım

Node.js için istemci kütüphanesini aşağıdaki komutlardan biriyle kurmak için tercih ettiğiniz npm istemcisini kullanın.




```sh
npm install @deno/kv
```




```sh
pnpm add @deno/kv
```




```sh
yarn add @deno/kv
```




:::tip
İstemci kütüphanesini yükledikten sonra, kullanıma hazır hale gelecektir. 
:::

Paketi Node projenize ekledikten sonra, `openKv` fonksiyonunu içe aktarabilirsiniz (hem ESM `import` hem de CJS `require` tabanlı kullanım desteklenir):

```js
import { openKv } from "@deno/kv";

// Bir KV örneğine bağlan
const kv = await openKv("<KV Connect URL>");

// Bazı verileri yaz
await kv.set(["users", "alice"], { name: "Alice" });

// Veriyi geri oku
const result = await kv.get(["users", "alice"]);
console.log(result.value); // { name: "Alice" }
```

:::info
Varsayılan olarak, kimlik doğrulama için kullanılan erişim belirteci `DENO_KV_ACCESS_TOKEN` ortam değişkeninden gelir. 
:::

Bunu açıkça da geçebilirsiniz:

```js
import { openKv } from "@deno/kv";

const kv = await openKv("<KV Connect URL>", { accessToken: myToken });
```

Deno KV istemciniz başlatıldığında, Deno'da mevcut olan aynı API'ler Node'da da kullanılabilir.

## KV Bağlantı URL'leri

Deno dışındaki bir KV veritabanına bağlanmak için bir [KV Connect](https://github.com/denoland/denokv/blob/main/proto/kv-connect.md) URL'sine ihtiyaç vardır. Deno Deploy üzerinde barındırılan bir veritabanı için KV Connect URL'si şu formatta olacaktır: `https://api.deno.com/databases//connect`.

Projeniz için `database-id` değerini [Deno Deploy panelinde](https://dash.deno.com/projects), projenizin "KV" sekmesi altında bulabilirsiniz.

![Deploy'deki bağlantı dizesi konumları](../../../../images/cikti/denoland/deploy/kv/manual/images/kv-connect.png)

## Daha fazla bilgi

Node için Deno KV modülünü nasıl kullanacağınıza dair daha fazla bilgi projenin [README sayfasında](https://www.npmjs.com/package/@deno/kv) bulunabilir.