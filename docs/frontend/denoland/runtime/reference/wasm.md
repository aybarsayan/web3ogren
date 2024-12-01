---
title: "WebAssembly"
description: WebAssembly (Wasm), JavaScript ile birlikte kullanılmak üzere tasarlanmış, yüksek yürütme hızına sahip bir teknolojidir. Deno'nun Wasm modülü ve kullanım rehberini burada bulabilirsiniz.
keywords: [WebAssembly, Deno, Wasm modülü, JavaScript, tür kontrolü, optimizasyon]
oldUrl:
  - /runtime/manual/getting_started/webassembly/
  - /runtime/manual/runtime/webassembly/
  - /runtime/manual/runtime/webassembly/using_wasm/
  - /runtime/manual/runtime/webassembly/using_streaming_wasm/
  - /runtime/manual/runtime/webassembly/wasm_resources/
---

JavaScript ile birlikte kullanılmak üzere tasarlanan
[WebAssembly](https://webassembly.org/) (Wasm), JavaScript'ten çok daha yüksek ve daha
tutarlı bir yürütme hızına sahip olabilir - C, C++ veya Rust'a benzer. Deno
WebAssembly modüllerini, [tarayıcıların sağladığı](https://developer.mozilla.org/en-US/docs/WebAssembly) aynı arayüzlerle çalıştırabilir ve bunları modül olarak içe aktarabilir.

## Wasm modülleri

Deno 2.1 ile birlikte, WebAssembly modülleri içe aktarılabilir ve kullanımının türü
kontrol edilir.

:::info
Deno, Wasm modüllerinin dışa aktarımlarını anlayıp tür kontrolünden geçirebiliyor. Bu, daha güvenli bir geliştirme deneyimi sağlar.
:::

Diyelim ki iki sayıyı toplayan ve sonucu döndüren bir `add` fonksiyonu içeren
[WebAssembly metin formatı](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format) dosyamız var:

```wat title="add.wat"
(module
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
)
```

Bunu `add.wasm`'a derlemek için
[wat2wasm](https://github.com/webassembly/wabt) aracını kullanabiliriz:

```sh
wat2wasm add.wat
```

Sonra bu WebAssembly modülünü bir içe aktarma ifadesiyle kullanabiliriz:

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, 2));
```

```shellsession
> deno run main.ts
3
```

### Tür Kontrolü

Deno, Wasm modüllerinin dışa aktarımlarını anlayabilmekte ve bunların kullanımını tür kontrolünden geçirmektedir. Önceki örnekte `add` fonksiyonunu yanlış çağırırsak bir tür kontrol hatası göreceğiz.

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, ""));
```

```shellsession
> deno check main.ts   
Check file:///.../main.ts
error: TS2345 [ERROR]: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(add(1, ""));
                   ~~
    at file:///.../main.ts:3:20
```

### İçe Aktarmalar

JavaScript gibi, Wasm modülleri de başka modülleri içe aktarabilir.

Örneğin, `"./values.js"` belirtisini içe aktaran ve `getValue` dışa aktarmasını çağıran bir Wasm modülü yaratabiliriz:

```wat title="toolkit.wat"
(module
  (import "./time.ts" "getTimeInSeconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="time.ts"
export function getTimeInSeconds() {
  return Date.now() / 1000;
}
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

Şimdi çalıştırdığımızda:

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
1732147633
V:\scratch
> deno run main.ts
1732147637
```

#### İçe Aktarma belirticilerini geçersiz kılma

Sıklıkla Wasm modülleri, başka bir JavaScript modülünü içe aktarmayı kolaylaştırmak için göreli bir belirtici kullanmazlar. Diyelim ki önceki benzer kurulumda, ancak Wasm modülü "env" belirticisi aracılığıyla içe aktarım yapıyor.

```wat title="toolkit.wat"
(module
  (import "env" "get_time_in_seconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="env.ts"
function getTimeInSeconds() {
  return Date.now() / 1000;
}

export { getTimeInSeconds as get_time_in_seconds };
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
error: Relative import path "env" not prefixed with / or ./ or ../
    at file:///.../toolkit.wasm
```

:::warning
Bu hata, göreli bir içe aktarma belirticisi kullanılmadığında meydana gelir. Belirticiyi _deno.json_ dosyası üzerinden bir [içe aktarma haritası](https://github.com/WICG/import-maps) ile eşleştirmek gereklidir.
:::

Neyse ki, bunu çalışır hale getirmek oldukça basit; belirticiyi _deno.json_ dosyası üzerinden bir [içe aktarma haritası](https://github.com/WICG/import-maps) ile eşleştirebiliriz:

```json title="deno.json"
{
  "imports": {
    "env": "./env.ts"
  }
}
```

Artık çalışıyor:

```shellsession
> deno run main.ts
1732148355
```

## WebAssembly API aracılığıyla WebAssembly kullanma

Deno'da WebAssembly'i çalıştırmak için tek gereken, çalıştırılacak bir Wasm modülüdür. Aşağıdaki modül, çağrıldığında sadece `42` döndüren bir `main` fonksiyonu Dışa Aktarmaktadır:

```ts
// deno-fmt-ignore
const wasmCode = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127,
  3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0,
  5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145,
  128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97,
  105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0,
  65, 42, 11
]);

const wasmModule = new WebAssembly.Module(wasmCode);

const wasmInstance = new WebAssembly.Instance(wasmModule);

const main = wasmInstance.exports.main as CallableFunction;
console.log(main().toString());
```

WebAssembly'i WebAssembly API aracılığıyla yüklemek için aşağıdaki adımların gerçekleştirilmesi gerekir:

1. İkili veriyi almak (genellikle `.wasm` dosyası biçiminde, ancak şu anda basit bir byte dizisi kullanıyoruz)
2. İkili veriyi `WebAssembly.Module` nesnesine derlemek
3. WebAssembly modülünü başlatmak

WebAssembly, insan tarafından okunabilecek veya elle yazılabilecek bir format değildir; ikili veridir. `.wasm` dosyalarınız, [Rust](https://www.rust-lang.org/), [Go](https://golang.org/) veya [AssemblyScript](https://www.assemblyscript.org/) gibi bir dil için bir derleyici tarafından üretilmelidir.

:::note
Örneğin, yukarıda bahsedilen baytlara derlenen bir Rust programı aşağıdaki gibi görünür:
```rust
#[no_mangle]
pub fn main() -> u32 { // u32, 32 bit hafıza kullanan bir işaretsiz tamsayıyı temsil eder.
  42
}
```
:::

## Streaming WebAssembly API'lerini Kullanma

WebAssembly modülünü almak, derlemek ve başlatmanın `en verimli` yolu, WebAssembly API'sinin streaming varyantlarını kullanmaktır. Örneğin, `instantiateStreaming`'i `fetch` ile birleştirerek tüm üç adımı tek seferde gerçekleştirebilirsiniz:

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

`.wasm` dosyasının `application/wasm` MIME türü ile sunulması gerektiğini unutmayın. Modül oluşturulmadan önce modül üzerinde ek çalışma yapmak isterseniz bunun yerine `compileStreaming` yöntemini kullanabilirsiniz:

```ts
const module = await WebAssembly.compileStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

/* biraz daha iş yapın */

const instance = await WebAssembly.instantiate(module);
instance.exports.increment as (input: number) => number;
```

Herhangi bir nedenle streaming yöntemlerini kullanma şansınız yoksa daha az verimli `compile` ve `instantiate` yöntemlerine geçiş yapabilirsiniz.

:::tip
Streaming yöntemlerinin daha verimli hale gelmesini sağlayan derinlemesine araştırma için [bu gönderiye](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/) göz atabilirsiniz.
:::

## WebAssembly API

WebAssembly API'sinin tüm parçaları hakkında daha fazla bilgi `Deno Referans Kılavuzu` ve [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly) üzerinde bulunabilir.

## Sayısal Olmayan Türlerle Çalışma

Bu belgedeki kod örnekleri yalnızca sayısal türler kullanılmıştır. Daha karmaşık türlerle (örneğin, dizeler veya sınıflar) WebAssembly çalıştırmak için JavaScript ile WebAssembly'ye derlenen diller arasında tür bağlamaları oluşturan araçlar kullanmanız gerekecektir.

JavaScript ve Rust arasında tür bağlamaları oluşturmayı, bunu bir ikili dosyaya derlemeyi ve bir JavaScript programından çağırmayı gösteren bir örnek [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm) üzerinde bulabilirsiniz.

Rust+WebAssembly ile Web API'leriyle çok fazla çalışma yapmayı planlıyorsanız, [web_sys](https://rustwasm.github.io/wasm-bindgen/web-sys/index.html) ve [js_sys](https://rustwasm.github.io/wasm-bindgen/contributing/js-sys/index.html) Rust kütüphanelerini yararlı bulabilirsiniz. `web_sys`, Deno'da mevcut olan çoğu Web API'sine bağlamaları içerirken, `js_sys` JavaScript'in standart ve yerleşik nesnelerine bağlamalar sağlar.

## Optimize Etme

Üretim yapımları için WebAssembly ikili dosyaları üzerinde optimizasyonlar gerçekleştirebilirsiniz. Eğer ikili dosyaları bir ağ üzerinden sunuyorsanız, boyut için optimize etme gerçekten fark yaratabilir. Eğer esas olarak WebAssembly'yi bir sunucuda hesaplama açısından yoğun görevleri yürütmek için çalıştırıyorsanız, hız için optimize etme faydalı olabilir. Üretim oluşturma işlemlerini optimize etme konusunda iyi bir kılavuzu [buradan](https://rustwasm.github.io/docs/book/reference/code-size.html) bulabilirsiniz. Ayrıca, [rust-wasm grubu](https://rustwasm.github.io/docs/book/reference/tools.html) WebAssembly ikili dosyalarını optimize etmek ve manipüle etmek için kullanılabilecek araçların bir listesini sağlamaktadır.