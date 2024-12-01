---
title: "Dinamik import"
description: Deno Deploy'de dinamik importların kullanımı ve kısıtlamaları hakkında detaylı bilgi içerir. Bu sayfa, dinamik importlarla ilgili belirleyici kurallar ve örnekler sunarak, Deno Deploy kullanıcılarının dikkat etmesi gereken noktaları vurgular.
keywords: [dinamik import, Deno Deploy, modüller, eszip, veri URL'si, JavaScript, TypeScript]
---

Deno Deploy, bazı sınırlamalarla birlikte [dinamik import] desteği sunmaktadır. Bu sayfa bu sınırlamaları özetlemektedir.

### Belirleyiciler statik olarak belirlenmiş string literaller olmalıdır

Normal dinamik importta, belirleyicilerin derleme zamanında belirlenmesi gerekmez. Bu nedenle aşağıdaki tüm şekiller geçerlidir:

```ts title="Deno CLI içinde geçerli dinamik importlar"
// 1. Statik olarak belirlenmiş string literal
await import("jsr:@std/assert");

// 2. Statik olarak belirlenmiş, ancak değişken aracılığıyla
const specifier = "jsr:@std/assert";
await import(specifier);

// 3. Statik olarak belirlenmiş, ancak şablon literal
const stdModuleName = "path";
await import(`jsr:@std/${stdModuleName}`);

// 4. Dinamik olarak belirlenmiş
const rand = Math.random();
const mod = rand < 0.5 ? "npm:cowsay" : "npm:node-emoji";
await import(mod);
```

Ancak Deno Deploy'de, belirleyicilerde string interpolasyonu olmadan string literaller olmalıdır. Bu nedenle yukarıdaki üç örnek arasında, yalnızca birincisi Deno Deploy'de çalışmaktadır.

```ts title="Deno Deploy'de sadece statik string literaller çalışır"
// 1. ✅ Deno Deploy'de sorunsuz çalışır
await import("jsr:@std/assert");

// 2. ❌ Deno Deploy'de çalışmaz
// çünkü `import`'a geçirilen bir değişken
const specifier = "jsr:@std/streams";
await import(specifier);

// 3. ❌ Deno Deploy'de çalışmaz
// çünkü bu bir interpolasyona sahiptir
const stdModuleName = "path";
await import(`jsr:@std/${stdModuleName}`);

// 4. ❌ Deno Deploy'de çalışmaz
// çünkü dinamik
const rand = Math.random();
const mod = rand < 0.5 ? "npm:cowsay" : "npm:node-emoji";
await import(mod);
```

### Bir istisna - dinamik belirleyiciler aynı proje dosyalarında çalışır

Dinamik olarak belirlenmiş belirleyiciler, hedef dosyaların (modüllerin) aynı projeye dahil edilmesi durumunda desteklenmektedir.

```ts title="Dinamik belirleyiciler aynı projedeki dosyalar için çalışır"
// ✅ Deno Deploy'de sorunsuz çalışır
await import("./my_module1.ts");

// ✅ Deno Deploy'de sorunsuz çalışır
const rand = Math.random();
const modPath = rand < 0.5 ? "dir1/moduleA.ts" : "dir2/dir3/moduleB.ts";
await import(`./${modPath}`);
```

`./` ile başlayan şablon literallerinin, hedef modülün aynı projede olduğunu belirttiğini unutmayın. Tersine, bir belirleyici `./` ile başlamıyorsa, olası hedef modüller, dinamik importların çalışma zamanında başarısız olmasına neden olacak şekilde oluşan [eszip]'e dahil edilmez, hatta son değerlendirilen belirleyici `./` ile başlasa bile.

```ts
// ❌ Çalışmaz çünkü analizör bu durumda belirleyicinin
// `./` ile başlayıp başlamadığını statik olarak belirleyemez.
// Önceki örnekle karşılaştırın. Tek fark,
// `./`'yi şablon literale mi yoksa değişkene mi koyduğunuzdur.
const rand = Math.random();
const modPath = rand < 0.5 ? "./dir1/moduleA.ts" : "./dir2/dir3/moduleB.ts";
await import(modPath);
```

Bu kısıtlamayı gelecekte gevşetip gevşetemeyeceğimizi değerlendireceğiz.

:::tip
**Eszip nedir?**  
Deno Deploy'de yeni bir dağıtım yaptığınızda, sistem kodunuzu analiz eder, modül grafiğini geri döngü oluşturarak oluşturur ve tüm bağımlılıkları tek bir dosyada toplar. Bunu [eszip](https://github.com/denoland/eszip) olarak adlandırıyoruz. Oluşturulması tamamen statik olarak yapıldığı için, dinamik import yetenekleri Deno Deploy'de sınırlıdır.
:::

### Veri URL'leri

[Veri URL'si], dinamik importlara geçirilen bir belirleyici olarak kullanılabilir.

```ts title="Statik veri URL'si"
// ✅ Deno Deploy'de sorunsuz çalışır
const { val } = await import(
  "data:text/javascript,export const val = 42;"
);
console.log(val); // -> 42
```

Veri URL'leri için tamamen dinamik veriler desteklenmektedir.

```ts title="Dinamik veri URL'si"
function generateDynamicDataUrl() {
  const moduleStr = `export const val = ${Math.random()};`;
  return `data:text/javascript,${moduleStr}`;
}

// ✅ Deno Deploy'de sorunsuz çalışır
const { val } = await import(generateDynamicDataUrl());
console.log(val); // -> Rastgele değer yazdırılır
```

Bu tekniği web'den alınan JavaScript koduna uygulayarak, gerçek bir dinamik import simüle edebilirsiniz:

```js title="external.js"
export const name = "external.js";
```

```ts title="Alınan kaynaktan dinamik veri URL'si"
import { assert } from "jsr:@std/assert/assert";
const res = await fetch(
  "https://gist.githubusercontent.com/magurotuna/1cacb136f9fd6b786eb8bbad92c8e6d6/raw/56a96fd0d246fd3feabbeecea6ea1155bdf5f50d/external.js",
);
assert(res.ok);
const src = await res.text();
const dataUrl = `data:application/javascript,${src}`;

// ✅ Deno Deploy'de sorunsuz çalışır
const { name } = await import(dataUrl);
console.log(`Hello from ${name}`); // -> "Hello from external.js"
```

Ancak, `import`'a verilen veri URL'sinin JavaScript olması gerektiğini unutmayın; TypeScript geçtiğinde, çalışma zamanında [TypeError] atıyor.

[dinamik import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import  
[eszip]: https://github.com/denoland/eszip  
[Veri URL'si]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs  
[TypeError]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError  