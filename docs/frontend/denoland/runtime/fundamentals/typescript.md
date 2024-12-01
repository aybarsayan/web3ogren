---
title: "TypeScript Desteği"
description: TypeScript, Deno'da JavaScript ve WebAssembly gibi birinci sınıf bir dil olarak tanıtılır. Bu makalede, TypeScript'in Deno ile entegrasyonu, tür kontrolü ve JavaScript ile kullanımına dair bilgiler sunulmaktadır.
keywords: [TypeScript, Deno, JavaScript, tür kontrolü, modüller, kütüphane dosyaları]
---

TypeScript, Deno'da JavaScript veya WebAssembly gibi birinci sınıf bir dildir. Deno CLI'den başka bir şey yüklemeden TypeScript kodunuzu çalıştırabilir veya içe aktarabilirsiniz. Deno, yerleşik TypeScript derleyicisi ile TypeScript kodunuzu JavaScript'e hiçbir ek yapılandırma gerektirmeden derleyecektir. Deno ayrıca TypeScript kodunuzu `tsc` gibi ayrı bir tip denetleme aracı gerektirmeden tür kontrolü yapabilir.

## Tür Kontrolü

TypeScript'in en büyük avantajlarından biri, kodunuzu tür güvenli hale getirmesi ve hataları geliştirme sırasında, çalışma zamanında değil, yakalamasıdır. TypeScript, sözdizimsel olarak geçerli JavaScript'in "güvenli değil" uyarılarıyla birlikte TypeScript haline geldiği anlamına gelen bir JavaScript üst kümesidir.

:::note
**Deno, varsayılan olarak `katı modda` TypeScript tür denetimi yapar.** TypeScript çekirdek ekibi [katı modun mantıklı bir varsayılan olduğunu tavsiye ediyor](https://www.typescriptlang.org/play/?#example/new-compiler-defaults).
:::

Deno, kodunuzu (`deno check`](/runtime/reference/cli/check/) alt komutu ile:

```shell
deno check module.ts
# veya uzaktan modülleri ve npm paketlerini de tür kontrol edin
deno check --all module.ts
# JSDoc'da yazılmış kod parçacıkları da tür kontrolünden geçirilebilir
deno check --doc module.ts
# veya markdown dosyalarındaki kod parçacıklarını tür kontrolünden geçirin
deno check --doc-only markdown.md
```

:::note
Tür kontrolü, özellikle çok fazla değişiklik yaptığınız bir kod tabanında çalışıyorsanız önemli ölçüde zaman alabilir. Deno tür kontrolünü optimize eder, ancak yine de bir maliyeti vardır. Bu nedenle, **varsayılan olarak, TypeScript modülleri yürütülmeden önce tür kontrol edilmez**.
:::

`deno run` komutunu kullanırken, Deno tür kontrolünü atlayacak ve kodu doğrudan çalıştıracaktır. Yürütmeden önce modülün tür kontrolünü gerçekleştirmek için, `deno run` ile `--check` bayrağını kullanabilirsiniz:

```shell
deno run --check module.ts
# veya uzaktan modülleri ve npm paketlerini de tür kontrol edin
deno run --check=all module.ts
```

Deno, bu bayrağı kullanırken bir tür hatasıyla karşılaştığında, işlemi kodu yürütmeden önce sonlandıracaktır.

Bunu önlemek için, ya şunu yapmanız gerekecektir:

- sorunu çözmek
- hatayı yok saymak için `// @ts-ignore` veya `// @ts-expect-error` pragmalarını kullanmak
- veya tür kontrolünü tamamen atlamak.

Kodunuzu test ettiğinizde, varsayılan olarak tür kontrolü etkindir. İsterseniz tür kontrolünü atlamak için `--no-check` bayrağını kullanabilirsiniz:

```shell
deno test --no-check
```

## JavaScript ile Kullanma

Deno, JavaScript ve TypeScript kodunu çalıştırır. Ancak tür kontrolü sırasında Deno yalnızca varsayılan olarak TypeScript dosyalarını tür kontrol eder. JavaScript dosyalarını da tür kontrol etmek istiyorsanız, dosyanın en üstüne `// @ts-check` pragmasını ekleyebilir veya `deno.json` dosyanıza `compilerOptions.checkJs` ekleyebilirsiniz.

```ts title="main.js"
// @ts-check

let x = "hello";
x = 42; // Tür 'number' tür 'string' ile atanamaz.
```

```json title="deno.json"
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

JavaScript dosyalarında, tür açıklamaları veya türleri içe aktarma gibi TypeScript sözdizimini kullanamazsınız. Ancak [TSDoc](https://tsdoc.org/) yorumlarını kullanarak TypeScript derleyicisine tür bilgisi sağlayabilirsiniz.

```ts title="main.js"
// @ts-check

/**
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

## Deklarasyon Dosyaları Sağlama

TypeScript kodundan türsüz JavaScript modüllerini içe aktarırken, JavaScript modülü için tür bilgisi sağlamanız gerekebilir. Eğer JavaScript, TSDoc yorumlarıyla belgelenmişse bu gerekli değildir. Bu ek tür bilgisi olmadan (bir `.d.ts` deklarasyon dosyası şeklinde), TypeScript, JavaScript modülünden ihraç edilen her şeyin `any` türünde olduğunu varsayacaktır.

`tsc`, bir `js` dosyası ile aynı isim tabanına sahip olan `d.ts` dosyalarını otomatik olarak alır. **Deno bunu yapmaz.** `.js` dosyasında (kaynak) veya `.ts` dosyasında (ithalatçı) `.d.ts` dosyasının nerede bulunacağını açıkça belirtmeniz gerekir.

### Kaynaktaki Türleri Sağlama

Bir `.d.ts` dosyasını `.js` dosyasında belirtmek tercih edilmelidir; bu, JavaScript modülünü birden fazla TypeScript modülünden kullanmayı kolaylaştırır: JavaScript modülünü içe aktaran her TypeScript modülünde `.d.ts` dosyasını belirtmek zorunda kalmazsınız.

```ts title="add.js"
// @ts-self-types="./add.d.ts"

export function add(a, b) {
  return a + b;
}
```

```ts title="add.d.ts"
export function add(a: number, b: number): number;
```

### İthalatçıda Tür Sağlama

JavaScript kaynağını değiştiremiyorsanız, JavaScript modülünü içe aktaran TypeScript modülünde `.d.ts` dosyasını belirtebilirsiniz.

```ts title="main.ts"
// @ts-types="./add.d.ts"
import { add } from "./add.js";
```

Bu, tür bilgisi sağlamayan NPM paketleri için de kullanışlıdır:

```ts title="main.ts"
// @ts-types="npm:@types/lodash"
import * as _ from "npm:lodash";
```

### HTTP Modülleri için Tür Sağlama

HTTP üzerinden JavaScript modüllerini barındıran sunucular, bu modüller için tür bilgisi sağlayabilir. Deno, modülü tür kontrol ederken bu bilgiyi kullanacaktır.

```http
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./add.d.ts
```

`X-TypeScript-Types` başlığı, JavaScript modülüne tür bilgisi sağlayan `.d.ts` dosyasının konumunu belirtir. Bu, JavaScript modülünün URL'sine göre göreli olarak çözülür, tıpkı `Location` başlıkları gibi.

## Tarayıcılar ve Web Çalışanları için Tür Kontrolü

Varsayılan olarak, Deno TypeScript modüllerini Deno çalışma zamanının ana iş parçacığında çalışıyormuş gibi tür kontrol eder. Ancak Deno, tarayıcılar için tür kontrolü, web çalışanları için tür kontrolü ve Deno ile SSR (Sunucu Tarafı Render) gibi kombinasyon tarayıcı-Deno ortamları için tür kontrolü destekler.

Bu ortamlar, kendilerine özgü farklı küresel nesneler ve API'ler ile gelmektedir. Deno, bu ortamlar için tür bilgisi sağlamak amacıyla kütüphane dosyaları sağlar. Bu kütüphane dosyaları, bu ortamlarla mevcut olan küresel nesne ve API'ler için tür bilgisi sağlamak üzere TypeScript derleyicisi tarafından kullanılır.

Yüklenmiş kütüphane dosyaları, bir `deno.json` yapılandırma dosyasında `compilerOptions.lib` seçeneği veya TypeScript dosyalarınızda `/// ` yorumları aracılığıyla değiştirilebilir. Kullanılacak kütüphane dosyalarını belirtmek için `deno.json` yapılandırma dosyasında `compilerOptions.lib` seçeneğini kullanmanız önerilir.

**Tarayıcı ortamı** için tür kontrolünü etkinleştirmek istiyorsanız, bir `deno.json` yapılandırma dosyasında `compilerOptions.lib` seçeneğinde `dom` kütüphane dosyasını belirtebilirsiniz:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom"]
  }
}
```

Bu, tarayıcı ortamında tür kontrolünü etkinleştirir, `document` gibi küresel nesneler için tür bilgisi sağlar. Ancak bu, Deno'ya özgü API'ler için tür bilgisini devre dışı bırakacaktır, örneğin `Deno.readFile`.

**Tarayıcı ve Deno ortamlarının birleşimi** için, Deno ile SSR kullanarak `dom` ve `deno.ns` (Deno ad alanı) kütüphane dosyalarını `deno.json` yapılandırma dosyasında `compilerOptions.lib` seçeneğinde belirtebilirsiniz:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "deno.ns"]
  }
}
```

Bu, hem tarayıcı hem de Deno ortamlarında tür kontrolünü etkinleştirir ve `document` gibi küresel nesneler için ve Deno'ya özgü API'ler için `Deno.readFile` gibi tür bilgisi sağlar.

**Deno'daki bir web çalışanı ortamı** için tür kontrolü etkinleştirmek (yani `new Worker` ile çalıştırılan kod), `deno.json` dosyasındaki `compilerOptions.lib` seçeneğinde `deno.worker` kütüphane dosyasını belirtebilirsiniz:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["deno.worker"]
  }
}
```

TypeScript dosyasında kullanılacak kütüphane dosyalarını belirtmek için `/// ` yorumlarını kullanabilirsiniz:

```ts
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
```

## Küresel Türleri Genişletme

Deno, TypeScript'te ortam veya küresel türleri destekler. Bu, küresel nesneleri polifill yapmak veya küresel kapsamı ek özelliklerle genişletmek için yararlıdır. **Mümkün olduğunca ortam veya küresel türleri kullanmaktan kaçınmalısınız**, çünkü bu isim çakışmalarına yol açabilir ve kodunuz hakkında düşünmeyi zorlaştırabilir. Ayrıca, JSR'ye yayımlarken desteklenmezler.

Deno'da ortam veya küresel türleri kullanmak için, projede içe aktarılan herhangi bir TypeScript dosyasında `declare global` sözdizimini veya küresel kapsamı genişleten bir `.d.ts` dosyasını yükleyebilirsiniz.

### Küresel Kapsamı Genişletmek için `declare global` Kullanma

Küresel kapsamı ek özelliklerle genişletmek için projenizde içe aktarılan herhangi bir TypeScript dosyasında `declare global` sözdizimini kullanabilirsiniz. Örneğin:

```ts
declare global {
  interface Window {
    polyfilledAPI(): string;
  }
}
```

Bu, tür tanımı içe aktarıldığında `polyfilledAPI` fonksiyonunu küresel olarak kullanılabilir hale getirir.

### Küresel Kapsamı Genişletmek için `.d.ts` Dosyalarını Kullanma

Ayrıca, küresel kapsamı genişletmek için `.d.ts` dosyalarını da kullanabilirsiniz. Örneğin, aşağıdaki içeriğe sahip bir `global.d.ts` dosyası oluşturabilirsiniz:

```ts
interface Window {
  polyfilledAPI(): string;
}
```

Daha sonra, bu `.d.ts` dosyasını TypeScript'inizde `/// ` ile yükleyebilirsiniz. Bu, `polyfilledAPI` fonksiyonu ile küresel kapsamı genişletecektir.

Alternatif olarak, `.d.ts` dosyasını `deno.json` yapılandırma dosyasında `compilerOptions.types` dizisinde belirtebilirsiniz:

```json
{
  "compilerOptions": {
    "types": ["./global.d.ts"]
  }
}
```

Bu, `polyfilledAPI` fonksiyonu ile küresel kapsamı da genişletecektir.