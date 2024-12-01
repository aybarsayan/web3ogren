---
title: "Deno Stil Kılavuzu"
description: Bu, Deno çalışma zamanındaki iç çalışma zamanı kodu için stil kılavuzudur ve Deno Standart Kütüphanesi için geçerlidir. Kullanıcılar için genel bir stil kılavuzu olarak düşünülmemiştir. 
keywords: [Deno, stil rehberi, kod standartları, TypeScript, JavaScript, yazılım geliştirme, programlama] 
oldUrl:
- /runtime/manual/contributing/style_guide/
- /runtime/manual/references/contributing/style_guide/
---

:::note

Bu, Deno çalışma zamanındaki **iç çalışma zamanı kodu** için stil kılavuzudur ve Deno Standart Kütüphanesi için geçerlidir. Bu, Deno kullanıcıları için genel bir stil kılavuzu olarak düşünülmemiştir.

:::

### Telif Hakkı Başlıkları

Depodaki çoğu modül aşağıdaki telif hakkı başlığına sahip olmalıdır:

```ts
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
```

Kod başka bir yerden türetilmişse, dosyanın uygun telif hakkı başlıklarına sahip olduğundan emin olun. Sadece MIT, BSD ve Apache lisanslı kodlara izin veriyoruz.

### Dosya İsimlerinde Alt Çizgi Kullanın, Tire Kullanmayın

Örnek: `file_server.ts` yerine `file-server.ts` kullanın.

### Yeni Özellikler için Testler Ekleyin

Her modül, kamuya açık işlevselliği için testler içermeli veya bu testlerle birlikte gelmelidir.

### TODO Yorumları

TODO yorumları genellikle bir sorun veya yazarın GitHub kullanıcı adını içermelidir. Örnek:

```ts
// TODO(ry): Test ekle.
// TODO(#123): Windows'u destekle.
// FIXME(#349): Bazen panik yaratıyor.
```

### Meta-programming Tavsiye Edilmez. Proxy Kullanımını İçerir

Açık olun, bu daha fazla kod anlamına gelse bile.

Böyle tekniklerin kullanılmasının mantıklı olduğu bazı durumlar vardır, ancak çoğu durumda değildir.

### Kapsayıcı Kod

Lütfen [kapsayıcı kod](https://chromium.googlesource.com/chromium/src/+/HEAD/styleguide/inclusive_code.md) için belirtilen kurallara uyun.

### Rust

Rust kurallarına uyun ve mevcut kod ile tutarlı olun.

### TypeScript

Kod tabanının TypeScript kısmı standart kütüphane `std`dir.

#### JavaScript Yerine TypeScript Kullanın

#### `index.ts`/`index.js` Dosya Adını Kullanmaktan Kaçının

Deno, "index.js" veya "index.ts" dosyalarını özel bir şekilde ele almaz. Bu dosya adlarını kullanarak, modül belirleyicisinden çıkarılabileceğini önermek, bu da kafa karıştırıcıdır.

Bir kod dizininin varsayılan bir giriş noktasına ihtiyacı varsa, `mod.ts` dosya adını kullanın. `mod.ts` dosya adı Rust'ın kuralını takip eder, `index.ts`'den daha kısadır ve nasıl çalışabileceği konusunda önceden belirlenmiş kavramlar taşımamaktadır.

#### İhracat İşlevleri: Maks. 2 argüman, geri kalanını bir seçenek nesnesine koyun

Fonksiyon arayüzleri tasarlarken aşağıdaki kurallara uyun.

1. Kamu API'sinin bir parçası olan bir fonksiyon 0-2 zorunlu argüman alır, artı (gerekirse) bir seçenek nesnesi (yani toplamda en fazla 3).

2. İsteğe bağlı parametreler genel olarak seçenek nesnesine gitmelidir.

   Seçenek nesnesinde olmayan bir isteğe bağlı parametre, yalnızca bir tane varsa kabul edilebilir, ve gelecekte daha fazla isteğe bağlı parametre eklenebileceği düşünülmüyorsa.

3. 'Seçenek' argümanı, normal bir 'Nesne' olan tek argümandır.

   Diğer argümanlar nesne olabilir, ancak bir 'sade' Nesne çalışma zamanından ayırt edilebilir olmalıdır:

   - ayırt edici bir prototipe sahip olmalıdır (örneğin `Array`, `Map`, `Date`, `class MyThing`).
   - iyi bilinen bir sembol özelliği (örneğin `Symbol.iterator`'a sahip bir iterable).

   Bu, API'nin geriye dönük uyumlu bir şekilde evrimleşmesine izin verir, seçenek nesnesinin konumu değişse bile.

```ts
// KÖTÜ: seçenek nesnesinin bir parçası olmayan isteğe bağlı parametreler. (#2)
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number,
): IPAddress[] {}
```

```ts
// İYİ.
export interface ResolveOptions {
  family?: "ipv4" | "ipv6";
  timeout?: number;
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {},
): IPAddress[] {}
```

```ts
export interface Environment {
  [key: string]: string;
}

// KÖTÜ: `env` standart bir Nesne olabilir ve dolayısıyla bir seçenek nesnesinden ayırt edilemez. (#3)
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// İYİ.
export interface RunShellOptions {
  env: Environment;
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions,
): string {}
```

```ts
// KÖTÜ: 3'ten fazla argüman. (#1), birden fazla isteğe bağlı parametre. (#2).
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean,
) {}
```

```ts
// İYİ.
interface RenameOptions {
  replaceExisting?: boolean;
  followLinks?: boolean;
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {},
) {}
```

```ts
// KÖTÜ: çok fazla argüman. (#1)
export function pwrite(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
  position: number,
) {}
```

```ts
// DAHA İYİ.
export interface PWrite {
  fd: number;
  buffer: ArrayBuffer;
  offset: number;
  length: number;
  position: number;
}
export function pwrite(options: PWrite) {}
```

Not: Bir argüman bir fonksiyon olduğunda, sıralamayı esnek bir şekilde ayarlayabilirsiniz. [Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve), [Deno.test](https://docs.deno.com/api/deno/~/Deno.test), [Deno.addSignalListener](https://docs.deno.com/api/deno/~/Deno.addSignalListener) gibi örnekleri inceleyin. Ayrıca [bu gönderi](https://twitter.com/jaffathecake/status/1646798390355697664) için de bakın.

#### İhracat Üyesi Olarak Kullanılan Tüm Arayüzleri İhraç Edin

Bir ihracat üyesinin parametreleri veya dönüş türünde bulunan arayüzleri kullanıyorsanız, kullanılan arayüzü ihraç etmelisiniz. İşte bir örnek:

```ts
// my_file.ts
export interface Person {
  name: string;
  age: number;
}

export function createPerson(name: string, age: number): Person {
  return { name, age };
}

// mod.ts
export { createPerson } from "./my_file.ts";
export type { Person } from "./my_file.ts";
```

#### Bağımlılıkları En Azda Tutun; Dönme İthalatlarına Yol Açmayın

`std` dış bağımlılıklara sahip olmamasına rağmen, iç bağımlılıkları basit ve yönetilebilir tutmaya dikkat etmemiz gerekir. Özellikle döngüsel ithalatları tanıtmamaya dikkat edin.

#### Bir dosya adı bir alt çizgi ile başlıyorsa: `_foo.ts`, ona bağlantı vermeyin

Bir iç modül gerekli olsa bile, API'sinin kararlı veya bağlantıya açık olmadığını belirtmek için bir alt çizgi ile başlatın. Geleneksel olarak, yalnızca kendi dizinindeki dosyaların onu içe aktarabileceğini unutmayın.

#### İhracat Simgeleri için JSDoc Kullanın

Tam bir belgelenmeye çalışıyoruz. İdeali olarak, her ihracat simgesinin bir belgelenme satırı olmalıdır.

Mümkünse, JSDoc için tek bir satır kullanın. Örnek:

```ts
/** foo bar yapar. */
export function foo() {
  // ...
}
```

Belgelerin kolayca insan tarafından okunabilir olması önemlidir, ancak ayrıca üretilen belgelerin daha zengin metin olması için ek stil bilgisi sağlamak da gereklidir. Bu nedenle JSDoc genellikle metni zenginleştirmek için markdown işaretlemesini takip etmelidir.

Markdown HTML etiketlerini desteklese de, JSDoc bloklarında yasaktır.

Kod dize literalleri, tırnaklar yerine ters tırnak (\`) ile çevrelenmelidir. Örneğin:

```ts
/** `deno` modülünden bir şey içe aktarın. */
```

Fonksiyon argümanlarını dokümante etmeyin, eğer niyetleri belirgin değilse (bunlar belirgin değilse, API dikkate alınmalıdır). Bu nedenle `@param` genelde kullanılmamalıdır. Eğer kullanılıyorsa, türü dahil etmemeli, çünkü TypeScript zaten güçlü bir şekilde türlenmiştir.

```ts
/**
 * Belirsiz parametreye sahip fonksiyon.
 * @param foo Belirsiz parametre açıklaması.
 */
```

Dikey boşluklar mümkün olduğunca en azda tutulmalıdır. Bu nedenle, tek satırlık yorumlar şu şekilde yazılmalıdır:

```ts
/** Bu iyi bir tek satırlık JSDoc'dur. */
```

Ve şöyle olmamalıdır:

```ts
/**
 * Bu kötü bir tek satırlık JSDoc'dur.
 */
```

Kod örnekleri markdown formatını kullanmalı, şöyle olmalıdır:

````ts
/** Açık bir yorum ve bir örnek:
 * ```ts
 * import { foo } from "deno";
 * foo("bar");
 * ```
 */
````

Kod örnekleri ek yorumlar içermemeli ve girintili olmamalıdır. Zaten bir yorumun içindeler. Daha fazla yoruma ihtiyaç varsa, bu iyi bir örnek değildir.

#### Linting Sorunlarını Yönergelerle Çözün

Mevcut kodun linting problemlerini doğrulamak için `dlint` kullanılmaktadır. Görev, linter ile uyumsuz olan kod gerektiriyorsa, `deno-lint-ignore ` yönergesini kullanarak uyarıyı bastırın.

```typescript
// deno-lint-ignore no-explicit-any
let x: any;
```

Bu, sürekli entegrasyon sürecinin linting problemleri nedeniyle başarısız olmamasını sağlar, ancak nadir kullanılmalıdır.

#### Her Modül Bir Test Modülü ile Gelmelidir

Kamu fonksiyonalitesi içeren her modül `foo.ts`, bir test modülü `foo_test.ts` ile gelmelidir. `std` modülü için bir test `std/tests` içinde yer almalıdır, çünkü farklı bağlamlara sahiptir; aksi takdirde, test edilen modülün bir kardeşi olmalıdır.

#### Birim Testleri Açık Olmalıdır

Testlerin daha iyi anlaşılması için fonksiyon doğru bir şekilde isimlendirilmelidir. Test komutu ile belirtilen isimde olmalıdır. Örnek:

```console
foo() bar nesnesini döner ... tamam
```

Test örneği:

```ts
import { assertEquals } from "@std/assert";
import { foo } from "./mod.ts";

Deno.test("foo() bar nesnesini döner", function () {
  assertEquals(foo(), { bar: "bar" });
});
```

Not: Daha fazla bilgi için [takip sorunu](https://github.com/denoland/deno_std/issues/3754) sayfasına bakın.

#### En Üst Düzey Fonksiyonlar Ok Türetme Söz Dizimini Kullanamamalıdır

En üst düzey fonksiyonlar `function` anahtar kelimesini kullanmalıdır. Ok sözdizimi, yalnızca kapanışlar için sınırlı olmalıdır.

Kötü:

```ts
export const foo = (): string => {
  return "bar";
};
```

İyi:

```ts
export function foo(): string {
  return "bar";
}
```

#### Hata Mesajları

Kullanıcıya açık hata mesajları JavaScript / TypeScript'ten alındığında net, özlü ve tutarlı olmalıdır. Hata mesajları cümle baş harfi büyük olmalıdır ancak bir nokta ile bitmemelidir. Hata mesajları dilbilgisi hatalarından ve yazım hatalarından arındırılmış olmalı ve Amerikan İngilizcesinde yazılmalıdır.

:::note

Hata mesajı stil kılavuzunun bir çalışma aşaması olduğunu ve tüm hata mesajlarının mevcut stillere uyacak şekilde güncellenmediğini unutmayın.

:::

Uygulanması gereken hata mesajı stilleri:

1. Mesajlar büyük harfle başlamalıdır:

```sh
Kötü: girdi ayrıştırılamıyor
İyi: Girdi ayrıştırılamıyor
```

2. Mesajlar bir noktayla bitmemelidir:

```sh
Kötü: Girdi ayrıştırılamıyor.
İyi: Girdi ayrıştırılamıyor
```

3. Değerler için mesajlar tırnak kullanmalıdır:

```sh
Kötü: Girdi ayrıştırılamıyor hello, world
İyi: Girdi ayrıştırılamıyor "hello, world"
```

4. Mesaj, hataya neden olan eylemi belirtmelidir:

```sh
Kötü: Geçersiz girdi x
İyi: Girdi x ayrıştırılamıyor
```

5. Etken ses kullanılmalıdır:

```sh
Kötü: Girdi x ayrıştırılamadı
İyi: Girdi x ayrıştırılamıyor
```

6. Mesajlar kısaltmalar kullanmamalıdır:

```sh
Kötü: Girdi x'i ayrıştırılamadı
İyi: Girdi x ayrıştırılamıyor
```

7. Mesajlar ek bilgi sağladığında iki nokta kullanılmalıdır. Nokta asla kullanılmamalıdır. Gerekirse başka noktalama işaretleri kullanılabilir:

```sh
Kötü: Girdi x ayrıştırılamıyor. değer boştur
İyi: Girdi x ayrıştırılamıyor: değer boştur
```

8. Ek bilgi, geçerli durumu tanımlamalıdır, eğer mümkünse, olumlu bir dille istenen durumu da tanımlamalıdır:

```sh
Kötü: x için karekök hesaplanamıyor: değer negatif olmamalı
İyi: x için karekök hesaplanamıyor: mevcut değer ${x}
Daha İyi: x için karekök hesaplanamıyor çünkü x >= 0 olmalıdır: mevcut değer ${x}
```

### std

#### Dış Koda Bağlı Olmayın.

`https://jsr.io/@std` tüm Deno programlarının güvenle dayanabileceği temel işlevsellik içindir. Kullanıcılara bu kodun potansiyel olarak gözden geçirilmemiş üçüncü taraf kodları içermediğini garanti etmek istiyoruz.

#### Tarayıcı Uyumluluğunu Belgeleyin ve Sürdürün.

Bir modül tarayıcı uyumluysa, modülün en üstünde JSDoc'ta aşağıdakileri ekleyin:

```ts
// Bu modül tarayıcı uyumlu.
```

Bu tür bir modül için tarayıcı uyumluluğunu sürdürmek için ya global `Deno` ad alanını kullanmamaktan ya da onun için özellik testi yapmaktan kaçının. Yeni bağımlılıkların da tarayıcı uyumlu olduğundan emin olun.

#### Özel Anahtar Kelimesi Üzerine # Kullanımını Tercih Edin

Standart modül kod tabanında özel alanlar (`#`) söz dizimini `private` anahtar kelimesi yerine tercih ediyoruz. Özel alanlar özellikleri ve yöntemleri çalışma zamanı süresince özel hale getirir. Öte yandan, TypeScript'in `private` anahtar kelimesi yalnızca derleme zamanında özel garanti eder ve alanlar çalışma zamanında halka açıktır.

İyi:

```ts
class MyClass {
  #foo = 1;
  #bar() {}
}
```

Kötü:

```ts
class MyClass {
  private foo = 1;
  private bar() {}
}
```

#### İsimlendirme Kuralı

Fonksiyonlar, yöntemler, alanlar ve yerel değişkenler için `camelCase` kullanın. Sınıflar, türler, arayüzler ve enumlar için `PascalCase` kullanın. Statik üst düzey öğeler için `UPPER_SNAKE_CASE` kullanın; örneğin `string`, `number`, `bigint`, `boolean`, `RegExp`, statik öğelerin dizileri, statik anahtarlar ve değerlerin kayıtları vb.

İyi:

```ts
function generateKey() {}

let currentValue = 0;

class KeyObject {}

type SharedKey = {};

enum KeyType {
  PublicKey,
  PrivateKey,
}

const KEY_VERSION = "1.0.0";

const KEY_MAX_LENGTH = 4294967295;

const KEY_PATTERN = /^[0-9a-f]+$/;
```

Kötü:

```ts
function generate_key() {}

let current_value = 0;

function GenerateKey() {}

class keyObject {}

type sharedKey = {};

enum keyType {
  publicKey,
  privateKey,
}

const key_version = "1.0.0";

const key_maxLength = 4294967295;

const KeyPattern = /^[0-9a-f]+$/;
```

İsimler `camelCase` veya `PascalCase` olduğunda, her zaman bu kurallara uyulmalıdır, hatta bunlar kısaltmaların parçaları bile olsa.

Not: Web API'leri büyük harfle yazılan kısaltmalar kullanır (`JSON`, `URL`, `URL.createObjectURL()` vb.). Deno Standart Kütüphanesi bu tür bir geleneği takip etmez.

İyi:

```ts
class HttpObject {
}
```

Kötü:

```ts
class HTTPObject {
}
```

İyi:

```ts
function convertUrl(url: URL) {
  return url.href;
}
```

Kötü:

```ts
function convertURL(url: URL) {
  return url.href;
}