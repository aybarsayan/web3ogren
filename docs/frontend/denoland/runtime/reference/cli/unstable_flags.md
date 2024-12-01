---
title: "Kararsız özellik bayrakları"
description: Deno çalışma zamanında mevcut olan kararsız özellik bayraklarını ve bunların kullanımını açıklar. Bu bayraklar, kullanıcıların yeni API'leri ve özellikleri denemelerine olanak tanır.
keywords: [Deno, özellik bayrakları, kararsız, API, komut satırı]
oldUrl:
 - /runtime/tools/unstable_flags/
 - /runtime/manual/tools/unstable_flags/
---

Deno çalışma zamanının yeni özellikleri genellikle kullanıcıların yeni API'leri ve özellikleri kesinleşmeden denemesi için **özellik bayrakları** arkasında yayınlanır. Mevcut kararsız özellik bayrakları bu sayfada listelenmiştir ve CLI yardım metninde de bulunabilir:

```sh
deno --help
```

## Komut satırında bayrakların kullanımı

Bir Deno programını komut satırından çalıştırırken, bayrağı CLI'ye bir seçenek olarak geçerek bir özellik bayrağını etkinleştirebilirsiniz. İşte `--unstable-byonm` bayrağı etkinleştirilmiş bir program çalıştırma örneği:

```sh
deno run --unstable-byonm main.ts
```

## `deno.json` dosyasında bayrakları yapılandırma

Projeniz için etkinleştirmek istediğiniz kararsız özellikleri, 
`deno.json` dosyasında yapılandırma seçeneği` kullanarak belirtebilirsiniz.

```json title="deno.json"
{
  "unstable": ["bare-node-builtins", "webgpu"]
}
```

`unstable` dizisindeki mümkün değerler, dokunaç bayrağı isimleridir ve `--unstable-` ön eki kaldırılmıştır.

## Ortam değişkenleri ile yapılandırma

Bazı bayraklar, bir bayrak veya `deno.json` yapılandırma seçeneği olarak iletilmek yerine, belirli bir adın ortam değişkenine bir değer (herhangi bir değer) ayarlayarak etkinleştirilebilir. Aşağıda, ortam değişkeni ile ayarlanabilebilecek bayraklar belirtilecektir.

:::info Ortam değişkeni ayarlama

Aşağıda, `--unstable-bare-node-builtins` bayrağını ortam değişkeni ile ayarlama örneği bulunmaktadır:

```sh
export DENO_UNSTABLE_BARE_NODE_BUILTINS=true
```
:::

## `--unstable-bare-node-builtins`

**Ortam değişkeni:** `DENO_UNSTABLE_BARE_NODE_BUILTINS`

Bu bayrak, 
`Node.js yerleşik modüllerini`
`node:` belirticisi olmadan içe aktarmanızı sağlar; aşağıda bir örnek bulunmaktadır. Eğer Node.js bağımlılıklarını manuel olarak yönetiyorsanız, `npm:` belirticisi olmadan npm paketlerini etkinleştirmek için de bu bayrağı kullanabilirsiniz (`bkz. `byonm` bayrağı`).

```ts title="example.ts"
import { readFileSync } from "fs";

console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

## `--unstable-byonm`

**Ortam değişkeni:** `DENO_UNSTABLE_BYONM`

Bu özellik bayrağı, yerel `node_modules` klasöründen modüllerin çözülmesini destekler; bu klasörü Deno dışında yönetirsiniz ve 
[npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/) ya da 
[yarn](https://yarnpkg.com/) kullanabilirsiniz. Bu, npm istemcilerinin yükleme davranışına veya bir `node_modules` klasörünün varlığına zorunlu olarak sahip olan Node.js modülleriyle uyumu artırabilir.

Deno proje klasörünüzde, bağımlılıklarını bildiren bir `package.json` dosyası ekleyin ve bunları normalde olduğu gibi bir npm istemcisi aracılığıyla yönetin. Aşağıdaki bağımlılıklara sahip bir `package.json` düşünün:

```json title="package.json"
{
  ...
  "dependencies": {
    "cowsay": "^1.5.0"
  }
  ...
}
```

Onları her zamanki gibi şöyle yükleyebilirsiniz:

```sh
npm install
```

Sonrasında, bir Deno programında şöyle bir kod yazabilirsiniz:

```ts title="example.ts"
import cowsay from "cowsay";

console.log(cowsay.say({
  text: "Deno'dan BYONM kullanan selamlar!",
}));
```

## `--unstable-detect-cjs`

**Ortam değişkeni:** `DENO_UNSTABLE_DETECT_CJS`

`.js`, `.jsx`, `.ts`, ve `.tsx` modüllerini aşağıdaki ek senaryolarla muhtemel CommonJS'ymiş gibi yükler:

1. _package.json_ `"type"` alanına sahip değildir.
2. _package.json_ mevcut değildir.

> Dikkat: Varsayılan olarak, Deno bu modülleri ancak bir _package.json_ içerisindeyseniz ve en yakın _package.json_ `{ "type": "commonjs" }` içeriyorsa muhtemel CommonJS olarak yükler.

Deno >= 2.1.2 gerektirir.

## `--unstable-sloppy-imports`

**Ortam değişkeni:** `DENO_UNSTABLE_SLOPPY_IMPORTS`

Bu bayrak, uzantısını içermeyen ithalatlardan dosya uzantılarını çıkarım yapma davranışını etkinleştirir. Normalde, aşağıdaki ithalat ifadesi bir hata üretir:

```ts title="foo.ts"
import { Example } from "./bar";
console.log(Example);
```

```ts title="bar.ts"
export const Example = "Example";
```

İçinde serbest ithalatlar etkinleştirilmiş bir betiği çalıştırmak, hatayı kaldırır ancak daha performanslı bir sözdizimi kullanılması gerektiği konusunda rehberlik sağlar.

Serbest ithalatlar, aşağıdakileri yapmanıza olanak tanır (ancak uyarılar bastırır):

- İthalatlardan dosya uzantılarını atlamak
- Yanlış dosya uzantılarını kullanmak (örneğin, gerçek dosya `.ts` iken `.js` uzantısıyla ithalat yapmak)
- Bir dizin yolunu ithal etmek ve otomatik olarak o dizinin ithalatı olarak `index.js` veya `index.ts` kullanmak

`deno compile` serbest ithalatları desteklemez.

## `--unstable-unsafe-proto`

Deno, güvenlik nedenleriyle `Object.prototype.__proto__`'yu desteklememeye karar vermiştir. Ancak, bu özellik düzgün çalışmak için hala birçok npm paketi gerekmektedir.

Bu bayrak, bu özelliği etkinleştirir. ***Bunun kullanılması önerilmez***, ancak bu özelliğe bağımlı bir paketi gerçekten kullanmanız gerekiyorsa, kaçış noktası artık mevcuttur.

## `--unstable-webgpu`

[`WebGPU` API'sini](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) global alanda, tarayıcıdaki gibi etkinleştirir. Aşağıda bu API'yi kullanarak GPU ile ilgili temel bilgileri elde etme örneği bulunmaktadır:

```ts
// Kullanıcı aracından bir adaptör almaya çalışın.
const adapter = await navigator.gpu.requestAdapter();
if (adapter) {
  // Adaptörle ilgili temel bilgileri yazdırın.
  const adapterInfo = await adapter.requestAdapterInfo();

  // Bazı sistemlerde bu boş olabilir...
  console.log(`Bulunan adaptör: ${adapterInfo.device}`);

  // GPU özellik listesini yazdırın
  const features = [...adapter.features.values()];
  console.log(`Desteklenen özellikler: ${features.join(", ")}`);
} else {
  console.error("Adaptör bulunamadı");
}
```

WebGPU kullanan daha fazla örnek için [bu depoya](https://github.com/denoland/webgpu-examples) bakın.

## `--unstable-broadcast-channel`

Bu bayrağı etkinleştirmek, global alanda, tarayıcıdaki gibi, [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) web API'sının kullanılabilir olmasını sağlar.

## `--unstable-worker-options`

Kararsız
[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
API seçeneklerini etkinleştirir. Özellikle, işçilere sunulabilen izinleri belirtmenizi sağlar:

```ts
new Worker(`data:application/javascript;base64,${btoa(`postMessage("ok");`)}`, {
  type: "module",
  deno: {
    permissions: {
      read: true,
    },
  },
}).onmessage = ({ data }) => {
  console.log(data);
};
```

## `--unstable-cron`

Bu bayrağı etkinleştirmek, `Deno.cron` API'sını `Deno` alanında kullanılabilir hale getirir.

## `--unstable-kv`

Bu bayrağı etkinleştirmek, `Deno KV` API'larının `Deno` alanında kullanılabilir hale gelmesini sağlar.

## `--unstable-net`

Deno alanında kararsız ağ API'lerini etkinleştirir. Bu API'ler şunları içerir:

- [`Deno.DatagramConn`](https://docs.deno.com/api/deno/~/Deno.DatagramConn)

## `--unstable`

:::caution --unstable kullanım dışıdır - bunun yerine ayrıntılı bayraklar kullanın

`--unstable` bayrağı artık yeni özellikler için kullanılmamaktadır ve gelecekteki bir sürümde kaldırılacaktır. Bu bayrakla kullanılabilen tüm kararsız özellikler artık belirli kararsız bayraklar olarak mevcuttur, özellikle:

- `--unstable-kv`
- `--unstable-cron`

Lütfen ilerleyen dönemlerde bu özellik bayraklarını kullanın.
:::

Daha güncel Deno sürümlerinden önce (1.38+), kararsız API'ler hepsi birden `--unstable` bayrağı kullanılarak sunulmuştur. Özellikle, `Deno KV` ve diğer bulut ilkel API'ler bu bayrak ardında mevcuttur. Bu kararsız özelliklere erişim sağlayan bir program çalıştırmak için, betiğinizi aşağıdaki gibi çalıştırmalısınız:

```sh
deno run --unstable your_script.ts
```

***Bunun yerine ayrıntılı kararsız bayrakları kullanmanız önerilir çünkü `--unstable` bayrağı artık kullanım dışıdır ve Deno 2'de kaldırılacaktır.***