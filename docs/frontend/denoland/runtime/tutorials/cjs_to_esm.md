---
title: "CommonJS'dan ESM'ye Güncelleme"
description: Bu kılavuz, Node.js projelerinizi CommonJS modüllerinden ECMAScript modüllerine (ESM) güncellemenize yardımcı olacaktır. ESM'nin modern özellikleriyle kodunuzu daha verimli hale getirebilirsiniz.
keywords: [CommonJS, ESM, Node.js, modül, güncelleme]
---

Eğer Node.js projeniz CommonJS modüllerini (örneğin `require` kullanıyorsa) kullanıyorsa, kodunuzu Deno'da çalıştırmak için [ECMAScript modüllerini (ESM)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) kullanacak şekilde güncellemeniz gerekecek. Bu kılavuz, kodunuzu ESM sözdizimini kullanacak şekilde güncellemenize yardımcı olacaktır.

## Modül içe aktarımları ve dışa aktarımlar

Deno yalnızca `ECMAScript modüllerini` destekler. Eğer Node.js kodunuz [`require`](https://nodejs.org/api/modules.html#modules-commonjs-modules) kullanıyorsa, bunu `import` ifadelerini kullanacak şekilde güncellemelisiniz. Eğer dahili kodunuz CommonJS stilinde dışa aktarımlar kullanıyorsa, bunların da güncellenmesi gerekecektir.

Tipik bir CommonJS tarzı proje aşağıdaki gibi görünebilir:

```js title="add_numbers.js"
module.exports = function addNumbers(num1, num2) {
  return num1 + num2;
};
```

```js title="index.js"
const addNumbers = require("./add_numbers");
console.log(addNumbers(2, 2));
```

Bunları `ECMAScript modüllerine` dönüştürmek için birkaç küçük değişiklik yapacağız:

```js title="add_numbers.js"
export function addNumbers(num1, num2) {
  return num1 + num2;
}
```

```js title="index.js"
import { addNumbers } from "./add_numbers.js";
console.log(addNumbers(2, 2));
```

Dışa Aktarımlar:

| CommonJS                             | ECMAScript modülleri            |
| ------------------------------------ | ------------------------------- |
| `module.exports = function add() {}` | `export default function add() {}` |
| `exports.add = function add() {}`    | `export function add() {}`       |

İçe Aktarımlar:

| CommonJS                                   | ECMAScript modülleri                     |
| ------------------------------------------ | ---------------------------------------- |
| `const add = require("./add_numbers");`    | `import add from "./add_numbers.js";`    |
| `const { add } = require("./add_numbers")` | `import { add } from "./add_numbers.js"` |

### VS Code ile Hızlı Düzeltme

Eğer VS Code kullanıyorsanız, CommonJS'yi ES6 modüllerine dönüştürmek için entegre özelliğinden yararlanabilirsiniz. `require` ifadesine veya ampul simgesine sağ tıklayın ve `Hızlı Düzeltme` seçeneğini seçip ardından `ES modülüne dönüştür` seçeneğini seçin.

![Hızlı Düzeltme](../../../images/cikti/denoland/runtime/tutorials/images/quick-fix.png)

### CommonJS ve ECMAScript Çözümü

İki modül sistemi arasındaki önemli bir ayrım, ECMAScript çözümlemesinin **dosya uzantısını içeren tam belirteci** gerektirmesidir. Dosya uzantısının atlanması ve `index.js` için özel işlem, yalnızca CommonJS'e özgü özelliklerdir. ECMAScript çözümlemesinin avantajı, tarayıcılar, Deno ve diğer çalışma zamanları arasında aynı şekilde çalışmasıdır.

| CommonJS             | ECMAScript modülleri            |
| -------------------- | ------------------------------- |
| `"./add_numbers"`    | `"./add_numbers.js"`            |
| `"./some/directory"` | `"./some/directory/index.js"`   |

:::tip
Deno, `deno lint --fix` komutunu çalıştırarak eksik dosya uzantılarını sizin için ekleyebilir. Deno'nun linter'ı, bir içe aktarma yolu dosya uzantısını içermediğinde bir linter hatası gösterecek `no-sloppy-imports` kuralıyla birlikte gelir.
:::

🦕 Artık CJS'den ESM'ye nasıl taşınacağınızı bildiğinize göre, ESM'nin sunduğu modern özelliklerden yararlanabilirsiniz; örneğin asenkron modül yükleme, tarayıcılarla etkileşim, daha iyi okunabilirlik, standartlaşma ve geleceğe yönelik güvence.