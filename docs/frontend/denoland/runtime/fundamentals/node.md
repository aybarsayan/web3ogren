---
title: "Node ve npm desteği"
description: Deno, Node.js projelerini çalıştırmak için yerel destek sunarken, bazı farklılıklar ve dikkat edilmesi gereken noktalar bulunmaktadır. Bu belge, Deno'da Node.js'in yerleşik API'lerinin kullanımı, npm paketleri ile entegrasyonu ve CommonJS desteği hakkında kapsamlı bilgiler sunmaktadır.
keywords: [Deno, Node.js, npm, CommonJS, API, import]
---

Modern Node.js projeleri, fazla bir değişiklik gerektirmeksizin Deno'da çalışacaktır. Ancak, Node.js projelerinizi Deno'ya taşırken kodunuzu daha basit ve daha küçük hale getirmenize yardımcı olabilecek bazı temel farklılıklar bulunmaktadır.

Yerleşik Node API'lerini keşfedin

## Node'un yerleşik modüllerini kullanma

Deno, Deno programları içinde Node.js yerleşik API'lerini kullanmanıza olanak tanıyan bir uyumluluk katmanı sağlar. Ancak, bunları kullanabilmek için kullanmanız gereken `node:` belirtecini import ifadelerinize eklemeniz gerekecektir:

```js title=main.mjs
import * as os from "node:os";
console.log(os.cpus());
```

> **Not:** `deno run main.mjs` komutuyla çalıştırdığınızda, Node.js içinde çalıştırdığınızda aldığınız aynı çıktıyı aldığınızı fark edeceksiniz. — Deno belgeleri

Uygulamanızda herhangi bir importu `node:` belirtecini kullanacak şekilde güncellemek, Node yerleşik API'lerini kullanan kodların Node.js'de olduğu gibi çalışmasını sağlamalıdır.

Mevcut kodu güncellemeyi kolaylaştırmak için Deno, `node:` ön eki kullanmayan importlar için yararlı ipuçları sağlayacaktır:

```js title="main.mjs"
import * as os from "os";
console.log(os.cpus());
```

```sh
$ deno run main.mjs
error: Relative import path "os" not prefixed with / or ./ or ../
  hint: If you want to use a built-in Node module, add a "node:" prefix (ex. "node:os").
    at file:///main.mjs:1:21
```

Deno LSP, editörünüzde aynı ipuçları ve ek hızlı düzeltmeler sağlar.

---

## npm paketlerini kullanma

Deno, `npm:` belirteçlerini kullanarak npm paketlerini doğrudan import etmek için yerel destek sunmaktadır. Örneğin:

```ts title="main.js"
import * as emoji from "npm:node-emoji";

console.log(emoji.emojify(`:sauropod: :heart:  npm`));
```

Aşağıdaki gibi çalıştırılabilir:

```sh
$ deno run main.js
🦕 ❤️ npm
```

`deno run` komutundan önce `npm install` gerekmemektedir ve hiçbir `node_modules` klasörü oluşturulmamaktadır. Bu paketler, Deno'daki diğer kodlarla aynı `izinlere` tabidir.

npm belirteçlerinin şu formatı vardır:

```console
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

**Popüler kütüphanelerle ilgili örnekler için lütfen `öğretici bölümüne` bakın.**

---

## CommonJS desteği

CommonJS, [ES modüllerinden](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) önce var olan bir modül sistemidir. ES modüllerinin JavaScript'in geleceği olduğuna kesinlikle inanıyoruz, ancak CommonJS'de yazılmış milyonlarca npm kütüphanesi bulunmaktadır ve Deno bunlar için tam destek sunmaktadır. Deno, bir paketin CommonJS kullanıp kullanmadığını otomatik olarak belirleyecek ve import edildiğinde sorunsuz çalışmasını sağlayacaktır:

```js title="main.js"
import react from "npm:react";
console.log(react);
```

```shell
$ deno run -E main.js
18.3.1
```

> _`npm:react`, CommonJS paketi. Deno'ya bunu ES modülüymüş gibi import etme imkanı verir._

Deno, kodunuzda ES modüllerinin kullanılmasını kuvvetle teşvik eder ama CommonJS desteği aşağıdaki kısıtlamalarla gelmektedir:

**CommonJS modüllerini kullanırken Deno'nun izin sistemi hala geçerlidir.** Deno, CommonJS modüllerini doğru bir şekilde çözmek için dosya sistemini `package.json` dosyalarını ve `node_modules` dizinini kontrol edeceğinden en az `--allow-read` izni vermeniz gerekebilir.

### .cjs uzantısını kullanma

Eğer dosya uzantısı `.cjs` ise, Deno bu modülü CommonJS olarak ele alacaktır.

```js title="main.cjs"
const express = require("express");
```

Deno, dosyanın CommonJS mi yoksa ESM mi olduğunu belirlemek için `package.json` dosyalarını ve `type` seçeneğini aramaz.

CommonJS kullanıyorsanız, Deno'nun bağımlılıkların manuel olarak yüklenmesini beklemesi ve bir `node_modules` dizininin mevcut olmasını beklemesi gerekir. Bunu sağlamak için `deno.json` dosyanızda `"nodeModulesDir": "auto"` ayarını yapmak en iyisidir.

```shell
$ cat deno.json
{
  "nodeModulesDir": "auto"
}

$ deno install npm:express
Add npm:express@5.0.0

$ deno run -R -E main.cjs
[Function: createApplication] {
  application: {
    init: [Function: init],
    defaultConfiguration: [Function: defaultConfiguration],
    ...
  }
}
```

`-R` ve `-E` bayrakları dosyaları okunması ve çevre değişkenleri için izin vermek üzere kullanılır.

### package.json type seçeneği

Deno, bir `package.json` dosyası ile birlikte `"type": "commonjs"` seçeneğine sahip `.js`, `.jsx`, `.ts`, ve `.tsx` dosyalarını CommonJS olarak yüklemeye çalışacaktır.

```json title="package.json"
{
  "type": "commonjs"
}
```

```js title="main.js"
const express = require("express");
```

Next.js'nin derleyicisi gibi araçlar otomatik olarak böyle bir `package.json` dosyası üretir.

CommonJS modüllerini kullanan mevcut bir projeye sahipseniz, `package.json` dosyasına `"type": "commonjs"` seçeneğini ekleyerek hem Node.js hem de Deno ile çalışmasını sağlayabilirsiniz.

### Bir dosyanın CommonJS olup olmadığını her zaman tespit etme

Deno'ya modülleri muhtemel CommonJS olarak analiz etmesini söylemek, Deno >= 2.1.2 ile `--unstable-detect-cjs` bayrağı ile çalıştırmak mümkündür. Bu, bir _package.json_ dosyası `{ "type": "module" }` içeriyorsa geçerli olmayacaktır.

Dosya sisteminde package.json dosyalarını aramak ve bir modülü analiz ederek CommonJS olup olmadığını tespit etmek, bunu yapmaktan daha uzun sürer. Bu nedenle ve CommonJS kullanımını caydırmak için Deno, varsayılan olarak bu davranışı yapmaz.

### require() fonksiyonunu manuel oluşturma

Alternatif bir seçenek, `require()` fonksiyonunun bir örneğini manuel olarak oluştırmaktır:

```js title="main.js"
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
```

Bu senaryoda, `.cjs` dosyalarındaki gibi aynı gereksinimler geçerlidir - bağımlılıkların manuel olarak yüklenmesi ve uygun iznlerin verilmesi gerekir.

---

### require(ESM)

Deno'nun `require()` uygulaması, ES modüllerini gerektirme desteği sunmaktadır.

Bu, Node.js'le aynı şekilde çalışır ve yalnızca üst düzey bekleme (Top-Level Await) içermeyen ES modüllerini `require()` yapabilirsiniz - diğer bir deyişle, yalnızca "senkron" olan ES modüllerini `require()` yapabilirsiniz.

```js title="greet.js"
export function greet(name) {
  return `Hello ${name}`;
}
```

```js title="esm.js"
import { greet } from "./greet.js";

export { greet };
```

```js title="main.cjs"
const esm = require("./esm");
console.log(esm);
console.log(esm.greet("Deno"));
```

```shell
$ deno run -R main.cjs
[Module: null prototype] { greet: [Function: greet] }
Hello Deno
```

### CommonJS modüllerini içe aktarma

ES modüllerinde CommonJS dosyalarını da içe aktarabilirsiniz.

```js title="greet.cjs"
module.exports = {
  hello: "world",
};
```

```js title="main.js"
import greet from "./greet.js";
console.log(greet);
```

```shell
$ deno run main.js
{
  "hello": "world"
}
```

---

**İpuçları ve öneriler**

Deno, CommonJS modülleri ile çalışırken sizi yönlendirmek için yararlı ipuçları ve öneriler sağlayacaktır.

Örneğin, `.cjs` uzantısına sahip olmayan veya `{ "type": "commonjs" }` ile birlikte bir `package.json` dosyasına sahip olmayan bir CommonJS modülünü çalıştırmaya çalışırsanız aşağıdaki gibi bir hata görebilirsiniz:

```js title="main.js"
module.exports = {
  hello: "world",
};
```

```shell
$ deno run main.js
error: Uncaught (in promise) ReferenceError: module is not defined
module.exports = {
^
    at file:///main.js:1:1

    info: Deno supports CommonJS modules in .cjs files, or when the closest
          package.json has a "type": "commonjs" option.
    hint: Rewrite this module to ESM,
          or change the file extension to .cjs,
          or add package.json next to the file with "type": "commonjs" option,
          or pass --unstable-detect-cjs flag to detect CommonJS when loading.
    docs: https://docs.deno.com/go/commonjs
```

---

## Türleri içe aktarma

Birçok npm paketi türlerle birlikte gelir; bunları içe aktarabilir ve bunları doğrudan türlerle kullanabilirsiniz:

```ts
import chalk from "npm:chalk@5";
```

Bazı paketler türlerle birlikte gelmez; ancak bunların türlerini `@deno-types` yönergesiyle belirtebilirsiniz. Örneğin, bir [`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types) paketini kullanarak:

```ts
// @deno-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

---

**Modül çözümlemesi**

Resmi TypeScript derleyicisi `tsc`, çeşitli [moduleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution) ayarlarını destekler. Deno yalnızca modern `node16` çözümlemesini destekler. Ne yazık ki birçok npm paketi, node16 modül çözümlemesi altında doğru bir şekilde tür sağlamaz; bu da `deno check` komutunun, `tsc`'nin raporlamadığı tür hataları bildirmesine neden olabilir.

Eğer bir `npm:` importundan bir varsayılan ihracatın yanlış bir türde olduğunu düşünüyorsanız (doğru türün `.default` özelliği altında görünüyorsa), bu muhtemelen paketin ESM'den gelen Imports altında node16 modül çözümlemesi için yanlış türler sağladığına işaret eder. Bu durumu kontrol etmek için hatanın `tsc --module node16` ile de oluşup oluşmadığına ve `package.json` dosyasının `"type": "module"` içerip içermediğini kontrol edebilirsiniz ya da [Türler yanlış mı?](https://arethetypeswrong.github.io/) web sitesine danışabilirsiniz (özellikle "node16 from ESM" satırı).

Bir paket kullanmak istiyorsanız ve bu paket TypeScript'in node16 modül çözümlemesini desteklemiyorsa, şunları yapabilirsiniz:

1. Paketle ilgili sorunları bir hata izleyicisine açın. (Ve belki de bir düzeltme katkısında bulunun :) (Ancak, ne yazık ki, HBM ve CJS'yi destekleyen paketler için araç eksikliği bulunmaktadır, çünkü varsayılan ihracatlar farklı sözdizimleri gerektirir. Ayrıca [microsoft/TypeScript#54593](https://github.com/microsoft/TypeScript/issues/54593) ile ilgili bilgilere de bakmayı unutmayın)
2. Bunun yerine `npm:` kimliğinden bir paketi Deno desteği sağlamak için yeniden derleyen bir `CDN` kullanın.
3. Kod tabanınızdaki tür hatalarını `// @ts-expect-error` veya `// @ts-ignore` ile göz ardı edin.

---

## Node türlerini dahil etme

Node, bir npm paketinin türlerinde referans alabileceğiniz birçok yerleşik tür ile birlikte gelir, örneğin `Buffer`. Bunları yüklemek için `@types/node` paketine bir tür referans direkifi eklemelisiniz:

```ts
/// <reference types="npm:@types/node" />
```

Çoğu durumda bunun için bir sürüm belirtmesinin sorun olmayacağını unutmayın çünkü Deno bunu dahili Node koduyla senkronize tutmaya çalışır, ancak gerektiğinde kullandığınız sürümü her zaman geçersiz kılabilirsiniz.

---

## Çalıştırılabilir npm betikleri

`bin` girişine sahip npm paketleri aşağıdaki formatta bir belirteç kullanarak komut satırından `npm install` yapmadan çalıştırılabilir:

```console
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

Örneğin:

```sh
$ deno run --allow-read npm:cowsay@1.5.0 "Merhaba!"
 ______________
< Merhaba! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

$ deno run --allow-read npm:cowsay@1.5.0/cowthink "Ne yeneceğiz?"
 ______________
( Ne yeneceğiz? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

---

## node_modules

`npm install` çalıştırdığınızda, npm projenizdeki bağımlılıkları `package.json` dosyasına göre yerleştiren bir `node_modules` dizini oluşturur.

Deno, npm paketlerini bir `node_modules` klasörü kullanmak yerine merkeze alınmış bir genel npm önbelleğine çözmek için `npm belirteçleri` kullanır. Bu, daha az alan kullanır ve proje dizininizi temiz tutar, bu nedenle idealdir.

Ancak, Deno projenizde yerel bir `node_modules` dizinine ihtiyacınız olabileceği durumlar olabilir; bu, `package.json` dosyanız olmasa bile (örneğin, Next.js veya Svelte gibi çerçeveleri kullanıyorsanız veya Node-API'yi kullanan npm paketlerine bağımlıysanız).

### Varsayılan Deno bağımlılık davranışı

Varsayılan olarak, `deno run` komutunu kullandığınızda Deno bir `node_modules` dizini oluşturmaz; bağımlılıklar global önbelleğe yüklenir. Bu, yeni Deno projeleri için önerilen bir ayardır.

### Otomatik node_modules oluşturma

Projenizde bir `node_modules` dizinine ihtiyacınız varsa, Deno'ya geçerli çalışma dizininde bir `node_modules` dizini oluşturması için `--node-modules-dir` bayrağını veya `nodeModulesDir: auto` seçeneğini kullanabilirsiniz:

```sh
deno run --node-modules-dir=auto main.ts
```

veya bir yapılandırma dosyası ile:

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

Otomatik mod, bağımlılıkları global önbelleğe yükler ve proje kökünde yerel bir node_modules dizini oluşturur. Bu, node_modules dizinine bağımlı npm bağımlılıklarına sahip projeler için önerilmektedir - çoğunlukla paketleyici kullanan veya npm bağımlılıklarıyla birlikte postinstall betiklerine sahip projeler.

### Manuel node_modules oluşturma

Projenizde bir `package.json` dosyası varsa, `node_modules` dizininizi oluşturmak için bir kurulum adımı gerektiren manuel modunu kullanabilirsiniz:

```sh
deno install
deno run --node-modules-dir=manual main.ts
```

veya bir yapılandırma dosyası ile:

```json title="deno.json"
{ "nodeModulesDir": "manual" }
```

Sonra `deno install/npm install/pnpm install` veya herhangi bir paket yöneticisi kullanarak `node_modules` dizininizi oluşturursunuz.

Manuel mod, bir `package.json` kullanan projeler için varsayılan moddur. Bu iş akışını Node.js projelerinden tanıyor olabilirsiniz. Next.js, Remix, Svelte, Qwik vb. çerçeveleri veya Vite, Parcel veya Rollup gibi araçları kullanan projeler için önerilir.

:::note

Önerimiz, varsayılan `none` modunu kullanmanız ve `node_modules` dizininde kaybolan paketlerle ilgili hatalar aldığınızda `auto` veya `manual` moduna geçiş yapmanızdır.

:::

### Deno 1.X ile node_modules

`--node-modules-dir` bayrağını kullanın.

Örneğin, `main.ts` dosyasına sahip iseniz:

```ts
import chalk from "npm:chalk@5";

console.log(chalk.green("Merhaba"));
```

```sh
deno run --node-modules-dir main.ts
```

Yukarıdaki komutu, `--node-modules-dir` bayrağı ile çalıştırdığınızda, mevcut dizinde npm ile benzer bir klasör yapısıyla `node_modules` klasörü oluşturacaktır.

---

## Node.js küresel nesneleri

Node.js'de, tüm programların kapsamına özgü birçok [küresel nesne](https://nodejs.org/api/globals.html) vardır; örneğin `process` nesnesi.

İşte doğal olarak karşılaşabileceğiniz birkaç küresel ve Deno'da nasıl kullanacağınız:

- `process` - Deno, popüler npm paketlerinde en çok kullanılan küresel olan `process` küreselini sağlar. Tüm koda açıktır. Ancak, Deno size `node:process` modülünden açıkça import etmenizi önerir; bunu lint uyarıları ve hızlı düzeltmelerle yapar:

```js title="process.js"
console.log(process.versions.deno);
```

```shell
$ deno run process.js
2.0.0
$ deno lint process.js
error[no-process-globals]: NodeJS process global is discouraged in Deno
 --> /process.js:1:13
  |
1 | console.log(process.versions.deno);
  |             ^^^^^^^
  = hint: Add `import process from "node:process";`

  docs: https://lint.deno.land/rules/no-process-globals


Found 1 problem (1 fixable via --fix)
Checked 1 file
```

- `require()` - `CommonJS desteği` için bakın

- `Buffer` - `Buffer` API'sini kullanmak için, `node:buffer` modülünden açıkça import edilmesi gerekir:

```js title="buffer.js"
import { Buffer } from "node:buffer";

const buf = new Buffer(5, "0");
```

Tercihiniz [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) veya diğer [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) alt sınıflarını kullanmaktır.

- `__filename` - bunun yerine `import.meta.filename` kullanın.

- `__dirname` - bunun yerine `import.meta.dirname` kullanın.

---

## Node-API eklentileri

Deno, popüler npm paketleri gibi [Node-API eklentilerini](https://nodejs.org/api/n-api.html) desteklemektedir [`esbuild`](https://www.npmjs.com/package/esbuild), [`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) veya [`npm:duckdb`](https://www.npmjs.com/package/duckdb).

Kamuya açık ve belgelenmiş Node-API'lerini kullanan tüm paketlerin çalışmasını bekleyebilirsiniz.

:::info

Node-API eklentilerini kullanan çoğu paket, `postinstall` gibi npm "yaşam döngüsü betikleri"ne dayanır.

Deno bunları desteklese de, güvenlik nedenleriyle varsayılan olarak çalıştırılmazlar. Daha fazla bilgi için `deno install` belgelerine` bakın.

:::

Deno 2.0 itibarıyla, Node-API eklentilerini kullanan npm paketleri **yalnızca bir `node_modules/` dizini mevcut olduğunda desteklenmektedir**. Bu paketlerin düzgün çalıştığından emin olmak için `deno.json` dosyanızda `"nodeModulesDir": "auto"` veya `"nodeModulesDir": "manual"` ayarını yapın veya `--node-modules-dir=auto|manual` bayrağı ile çalıştırın. Yanlış yapılandırma durumunda Deno, durumun nasıl düzeltileceği konusunda ipuçları verecektir.

---

## Node'dan Deno'ya geçiş

Node.js projenizi Deno ile çalıştırmak basit bir süreçtir. Çoğu durumda, proje ES modülleri kullanılarak yazılmışsa çok az ya da hiç değişiklik yapılması gerekecektir.

Farkında olunması gereken ana noktalar:

1. Node.js yerleşik modüllerini içe aktarmak için `node:` belirteci gereklidir:

```js
// ❌
import * as fs from "fs";
import * as http from "http";

// ✅
import * as fs from "node:fs";
import * as http from "node:http";
```

:::tip

Mevcut projenizde bu import belirteçlerini değiştirmeniz önerilir. Bu, aynı zamanda Node.js'de de bunları import etmenin önerilen yoludur.

:::

2. Bazı `Node.js'de mevcut olan küreseller` açıkça içe aktarılmalıdır, örneğin `Buffer`:

```js
import { Buffer } from "node:buffer";
```

3. `require()`, yalnızca `.cjs` uzantılı dosyalarda kullanılabilir; diğer dosyalarda bir `require()` örneği `manuel olarak oluşturulmalıdır`. npm bağımlılıkları dosya uzantısından bağımsız olarak `require()` kullanabilir.

---

### Betikleri çalıştırma

Deno, npm betiklerini yerel olarak `deno task` alt komutuyla çalıştırmayı destekler (Node.js'den geçiyorsanız, bu `npm run script` komutuna benzer). İçinde bir `start` betiği bulunan bir Node.js projesini düşünün:

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "start": "eslint"
  }
}
```

Bu betiği Deno ile çalıştırmak için:

```sh
deno task start
```

---
title: Opsiyonel iyileştirmeler
description: Deno'nun sunduğu araç zinciri ile birlikte gelen gelişmiş özelliklerden yararlanarak projenizi nasıl optimize edebileceğinizi keşfedin. Bu içerik, Deno ile linting, biçimlendirme ve test süreçlerini açıklamaktadır.
keywords: [Deno, TypeScript, linting, biçimlendirme, test, özel kayıt defterleri, geliştirme araçları]
---

### Opsiyonel iyileştirmeler

Deno'nun temel güçlü yanlarından biri, kutudan çıktığı gibi TypeScript desteği ile birlikte gelen birleştirilmiş bir araç zinciridir ve linter, formatlayıcı ve test çalıştırıcı gibi araçları içerir. Deno'ya geçmek, **araç zincirinizi** basitleştirmenizi sağlar ve projenizdeki hareketli bileşen sayısını azaltır.

**Yapılandırma**

Deno'nun kendi yapılandırma dosyası vardır, `deno.json` veya `deno.jsonc`, bu dosya
`projenizi yapılandırmak için` kullanılabilir.

`imports` seçeneğini kullanarak `package.json` içindeki bağımlılıkları tek tek taşıyabilir veya yapılandırma dosyasında tanımlamayı tercih etmeyip kodunuzda `npm:` belirtilerini kullanabilirsiniz.

:::tip
Bağımlılıkları belirtmenin yanı sıra `deno.json` dosyasını görevleri, lint ve format seçeneklerini, yol eşlemelerini ve diğer çalışma zamanı yapılandırmalarını tanımlamak için kullanabilirsiniz.
:::

**Linting**

Deno, performans düşünülerek yazılmış yerleşik bir linter ile birlikte gelir. ESLint'e benzer, ancak sınırlı sayıda kural içerir. ESLint eklentilerine güvenmiyorsanız, `package.json` içindeki `devDependencies` bölümünden `eslint` bağımlılığını kaldırabilir ve bunun yerine `deno lint` kullanabilirsiniz.

Deno, büyük projeleri yalnızca birkaç milisaniyede lint edebilir. Bunu kendi projenizde denemek için aşağıdaki komutu çalıştırabilirsiniz:

```sh
deno lint
```

Bu, projenizdeki tüm dosyaları lint edecektir. Linter bir sorun tespit ettiğinde, bunu editörünüzdeki satırda ve terminal çıktısında gösterecektir. Bunun nasıl görünebileceğine dair bir örnek:

```sh
error[no-constant-condition]: Kullanımda olan sabit ifadeler koşul olarak kullanılamaz.
 --> /my-project/bar.ts:1:5
  | 
1 | if (true) {
  |     ^^^^
  = ipucu: Sabit ifadeyi kaldırın

  belgeler: https://lint.deno.land/rules/no-constant-condition


1 sorun bulundu
4 dosya kontrol edildi
```

Birçok linting sorunu, `--fix` bayrağını geçirerek otomatik olarak düzeltilebilir:

```sh
deno lint --fix
```

:::info
Desteklenen tüm linting kurallarının tam listesini 
[https://lint.deno.land/](https://lint.deno.land/) adresinde bulabilirsiniz. Linter'ı nasıl yapılandıracağınızı öğrenmek için 
`deno lint` alt komutuna` göz atın.
:::

**Biçimlendirme**

Deno, isteğe bağlı olarak kodunuzu Deno stil kılavuzuna göre biçimlendirebilecek `yerleşik bir formatlayıcıya` sahiptir. `devDependencies` kısmına `prettier` eklemek yerine Deno'nun yerleşik sıfır yapılandırmalı kod biçimlendiricisi `deno fmt`'yi kullanabilirsiniz.

Formatlayıcıyı projenizde çalıştırmak için:

```sh
deno fmt
```

Eğer `deno fmt`'yi CI'da kullanıyorsanız, formatlayıcının yanlış biçimlendirilmiş kod tespit ettiğinde hata ile çıkması için `--check` argümanını geçebilirsiniz.

```sh
deno fmt --check
```

:::note
Biçimlendirme kuralları, `deno.json` dosyanızda yapılandırılabilir. Formatlayıcıyı nasıl yapılandıracağınızı öğrenmek için 
`deno fmt` alt komutuna` göz atın.
:::

**Test**

Deno, kodunuz için test yazmayı teşvik eder ve test yazmayı ve çalıştırmayı kolaylaştırmak için yerleşik bir test çalıştırıcısı sağlar. Test çalıştırıcısı Deno ile sıkı bir şekilde entegre edilmiştir, böylece TypeScript veya diğer özelliklerin çalışması için ek bir yapılandırma yapmanıza gerek kalmaz.

```ts title="my_test.ts"
Deno.test("benim testim", () => {
  // Test kodunuz buraya
});
```

```sh
deno test
```

`--watch` bayrağını geçirirken, test çalıştırıcısı, getirilen modüllerden herhangi biri değiştiğinde otomatik olarak yeniden yüklenir.

:::warning
Test çalıştırıcısı hakkında daha fazla bilgi edinmek ve nasıl yapılandırılacağını öğrenmek için 
`deno test` alt komutuna` göz atın.
:::

## Özel kayıt defterleri

:::caution
`özel depolar ve modüller` ile karıştırılmamalıdır.
:::

Deno, özel modüllerinizi barındırmanıza ve paylaşmanıza olanak tanıyan özel kayıt defterlerini destekler. Bu, kodlarını gizli tutmak isteyen organizasyonlar veya kodlarını belirli bir grup insanla paylaşmak isteyen bireyler için faydalıdır.

### Özel kayıt defterleri nedir?

Büyük organizasyonlar genellikle dahili paketleri güvenli bir şekilde yönetmek için kendi özel npm kayıt defterlerini barındırırlar. Bu özel kayıt defterleri, organizasyonların kendi özel veya özel paketlerini yayımlayıp saklayabilecekleri depolar olarak hizmet verir. Kamuya açık npm kayıt defterlerinin aksine, özel kayıt defterleri yalnızca organizasyon içindeki yetkili kullanıcılara açıktır.

### Deno ile özel kayıt defterleri nasıl kullanılır

Öncelikle, özel kayıt defterinize yönlendirmek için [`.npmrc`](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc) dosyanızı yapılandırın. `.npmrc` dosyası, projenin kökünde veya `$HOME` dizininde bulunmalıdır. `.npmrc` dosyanıza aşağıdakileri ekleyin:

```sh
@mycompany:registry=http://mycompany.com:8111/
//mycompany.com:8111/:_auth=secretToken
```

`http://mycompany.com:8111/` adresini özel kayıt defterinizin gerçek URL'si ile ve `secretToken` değerini kimlik doğrulama belirteciniz ile değiştirin.

Ardından `deno.json` veya `package.json` dosyanızı güncelleyerek özel paketinizin import yolunu belirtin. Örneğin:

```json title="deno.json"
{
  "imports": {
    "@mycompany/package": "npm:@mycompany/package@1.0.0"
  }
}
```

veya bir `package.json` kullanıyorsanız:

```json title="package.json"
{
  "dependencies": {
    "@mycompany/package": "1.0.0"
  }
}
```

Artık Deno kodunuzda özel paketlerinizi içe aktarabilirsiniz:

```typescript title="main.ts"
import { hello } from "@mycompany/package";

console.log(hello());
```

ve bunu `deno run` komutunu kullanarak çalıştırabilirsiniz:

```sh
deno run main.ts
```

## Node'dan Deno'ya Hızlı Kılavuz

| Node.js                                | Deno                          |
| -------------------------------------- | ----------------------------- |
| `node file.js`                         | `deno file.js`                |
| `ts-node file.ts`                      | `deno file.ts`                |
| `nodemon`                              | `deno run --watch`            |
| `node -e`                              | `deno eval`                   |
| `npm i` / `npm install`                | `deno install`                |
| `npm install -g`                       | `deno install -g`             |
| `npm run`                              | `deno task`                   |
| `eslint`                               | `deno lint`                   |
| `prettier`                             | `deno fmt`                    |
| `package.json`                         | `deno.json` veya `package.json` |
| `tsc`                                  | `deno check` ¹                |
| `typedoc`                              | `deno doc`                    |
| `jest` / `ava` / `mocha` / `tap` / vb. | `deno test`                   |
| `nexe` / `pkg`                         | `deno compile`                |
| `npm explain`                          | `deno info`                   |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                |
| `tsserver`                             | `deno lsp`                    |
| `nyc` / `c8` / `istanbul`              | `deno coverage`               |
| benchmarking                             | `deno bench`                  |

¹ Tür kontrolü otomatik olarak gerçekleşir, TypeScript derleyicisi `deno` ikili dosyasına gömülüdür.