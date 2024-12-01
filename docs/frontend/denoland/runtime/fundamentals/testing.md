---
title: "Test Etme"
description: Deno's built-in test runner streamlines writing and executing tests for JavaScript and TypeScript, offering developers robust tools without the need for external dependencies. This guide explores how to define tests, execute them, and leverage various test features effectively.
keywords: [Deno, test, JavaScript, TypeScript, testing tools, test runner, assertions]
---

Deno, hem JavaScript hem de TypeScript için test yazma ve çalıştırma amacıyla yerleşik bir test çalıştırıcısı sağlar. Bu, kodunuzun güvenilir olduğunu ve ek bağımlılık veya araçlar yüklemeden beklenildiği gibi çalıştığını sağlamayı kolaylaştırır. `deno test` çalıştırıcısı, her test için izinler üzerinde hassas kontrol sağlar ve kodun beklenmedik bir şey yapmadığından emin olur.

:::info 
Yerleşik test çalıştırıcısına ek olarak, Deno ile JS ekosisteminden Jest, Mocha veya AVA gibi diğer test çalıştırıcılarını da kullanabilirsiniz. Ancak bu belgede bunları ele almayacağız.
:::

## Test Yazma

Deno'da bir testi tanımlamak için `Deno.test()` fonksiyonunu kullanırsınız. İşte bazı örnekler:

```ts title="my_test.ts"
import { assertEquals } from "jsr:@std/assert";

Deno.test("basit test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

import { delay } from "jsr:@std/async";

Deno.test("asenkron test", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

Deno.test({
  name: "dosya okuma testi",
  permissions: { read: true },
  fn: () => {
    const data = Deno.readTextFileSync("./somefile.txt");
    assertEquals(data, "beklenen içerik");
  },
});
```

Eğer "jest benzeri" `expect` stilinde doğrulamalar tercih ediyorsanız, Deno standart kütüphanesi [`expect`](https://jsr.io/@std/expect) fonksiyonunu `assertEquals` yerine kullanabileceğiniz bir alternatif sunar:

```ts title="my_test.ts"
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

Deno.test("toplama fonksiyonu iki sayıyı doğru toplar", () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});
```

## Testleri Çalıştırma

Testlerinizi çalıştırmak için `deno test` alt komutunu kullanın.

Dosya adı veya dizin adı olmadan çalıştırıldığında, bu alt komut mevcut dizindeki (özellikle) tüm testleri otomatik olarak bulur ve çalıştırır. `{*_,*.,}test.{ts, tsx, mts, js, mjs, jsx}` glob desenine uyan.

```sh
# Mevcut dizindeki ve tüm alt dizinlerdeki tüm testleri çalıştır
deno test

# util dizinindeki tüm testleri çalıştır
deno test util/

# sadece my_test.ts'yi çalıştır
deno test my_test.ts

# Test modüllerini paralel olarak çalıştır
deno test --parallel

# Deno.args'ta görünür olan test dosyasına ek argümanlar geç
deno test my_test.ts -- -e --foo --bar

# Deno'nun dosya sisteminden okuma yapmasına izin ver, bu yukarıdaki son testin geçmesi için gereklidir
deno test --allow-read my_test.ts
```

## Test Aşamaları

Deno, testleri daha küçük, yönetilebilir parçalara ayırmanıza olanak tanıyan test aşamalarını destekler. Bu, bir test içerisindeki kuruluma ve temizlemeye yönelik işlemler için faydalıdır:

```ts
Deno.test("veritabanı işlemleri", async (t) => {
  using db = await openDatabase();
  await t.step("kullanıcı ekle", async () => {
    // Kullanıcı ekleme mantığı
  });
  await t.step("kitap ekle", async () => {
    // Kitap ekleme mantığı
  });
});
```

## Komut satırı filtreleme

Deno, `--filter` seçeneğini kullanarak belirli testleri veya test gruplarını çalıştırmanıza olanak tanır. Bu seçenek, test adlarıyla eşleşmek üzere bir dize veya bir desen kabul eder. Filtreleme, adımlar üzerinde etkili olmaz; eğer bir test adı filtreyle eşleşiyorsa, tüm adımları çalıştırılır.

Aşağıdaki testlere göz atın:

```ts
Deno.test("my-test", () => {});
Deno.test("test-1", () => {});
Deno.test("test-2", () => {});
```

### Dize ile filtreleme

Adında "my" kelimesini içeren tüm testleri çalıştırmak için:

```sh
deno test --filter "my" tests/
```

Bu komut, "my" kelimesini içerdiği için `my-test`'i çalıştırır.

### Desen ile filtreleme

Belirli bir desene uyan testleri çalıştırmak için:

```sh
deno test --filter "/test-*\d/" tests/
```

Bu komut, `test-1` ve `test-2` testlerini çalıştırır çünkü `test-*` deseni ile bir rakamı takip eder.

Desen (regüler ifade) kullandığınızı belirtmek için filtre değerini kesme işaretleri `/` içinde sarın, JavaScript’in regüler ifadeleri için olan sözdiziminde olduğu gibi.

### Yapılandırma dosyasında test dosyalarını dahil etme ve hariç tutma

Ayrıca, `Deno yapılandırma dosyasında` dahil edilecek veya hariç tutulacak yolları belirterek testleri filtreleyebilirsiniz.

Örneğin, sadece `src/fetch_test.ts` ve `src/signal_test.ts`’yi test etmek ve `out/` içinde her şeyi hariç tutmak isterseniz:

```json
{
  "test": {
    "include": [
      "src/fetch_test.ts",
      "src/signal_test.ts"
    ]
  }
}
```

Ya da daha muhtemel bir şekilde:

```json
{
  "test": {
    "exclude": ["out/"]
  }
}
```

## Test tanımı seçimi

Deno, test tanımlarının içinde testleri seçmek için iki seçenek sunar: testleri göz ardı etme ve belirli testlere odaklanma.

### Testleri Göz Ardı Etme/Atlama

Belirli koşullara göre bazı testleri göz ardı edebilirsiniz. Test tanımındaki `ignore` boolean'ını kullanarak. `ignore` `true` olarak ayarlandığında, test atlanır. Bu, örneğin bir testin yalnızca belirli bir işletim sisteminde çalışmasını istiyorsanız kullanışlıdır.

```ts
Deno.test({
  name: "macOS özelliğini yap",
  ignore: Deno.build.os !== "darwin", // Bu test, macOS'ta çalışmıyorsa göz ardı edilecektir
  fn() {
    // Burada MacOS özelliğini yap
  },
});
```

Koşul geçmeden bir test atlamak isterseniz, `Deno.test` nesnesinden `ignore()` fonksiyonunu kullanabilirsiniz:

```ts
Deno.test.ignore("benim testim", () => {
  // test kodunuz
});
```

### Sadece Belirli Testleri Çalıştırma

Belirli bir teste odaklanmak ve diğerlerini göz ardı etmek istiyorsanız, `only` seçeneğini kullanabilirsiniz. Bu, test çalıştırıcısına yalnızca `only` ayarları `true` olan testleri çalıştırmasını söyler. Birden fazla test bu seçenekle ayarlanabilir. Ancak, herhangi bir test sadece `only` ile işaretlenmişse, genel test çalıştırması her zaman başarısız olur, çünkü bu yalnızca hata ayıklamak için geçici bir önlemdir.

```ts
Deno.test.only("benim testim", () => {
  // bazı test kodu
});
```

veya

```ts
Deno.test({
  name: "Yalnızca bu testi çalıştır",
  only: true, // Yalnızca bu test çalıştırılacak
  fn() {
    // karmaşık şeyler burada test edilecek
  },
});
```

## Hızlı Hata Başlatma

Uzun süren bir test süitiniz varsa ve ilk hata da durmasını istiyorsanız, test süitini çalıştırırken `--fail-fast` bayrağını belirtebilirsiniz.

```shell
deno test --fail-fast
```

Bu, test çalıştırıcısının ilk test hatasından sonra çalıştırmayı durdurmasını sağlar.

## Raporlayıcılar

Deno, test çıktısını biçimlendirmek için üç yerleşik raporlayıcı içerir:

- `pretty` (varsayılan): Ayrıntılı ve okunabilir bir çıktı sağlar.
- `dot`: Test sonuçlarını hızlı bir şekilde görmek için yaralı, kısa bir çıktı sunar.
- `junit`: CI/CD araçlarıyla entegrasyon için yararlı olan JUnit XML formatında çıktı üretir.

Hangi raporlayıcının kullanılacağını `--reporter` bayrağı ile belirtebilirsiniz:

```sh
# Varsayılan güzel raporlayıcıyı kullan
deno test

# Kısa çıktı için nokta raporlayıcısını kullan
deno test --reporter=dot

# JUnit raporlayıcısını kullan
deno test --reporter=junit
```

Ayrıca, `--junit-path` bayrağını kullanarak JUnit raporunu bir dosyaya yazdırırken terminalde okunabilir bir çıktı alabilirsiniz:

```sh
deno test --junit-path=./report.xml
```

## Casusluk, sahteleme (test ikizleri), kesme ve zamanı taklit etme

`Deno Standart Kütüphanesi` casusluk, sahteleme ve kesme ile ilgili test yazmanıza yardımcı olacak bir dizi fonksiyon sağlar. Bu utiliteler hakkında daha fazla bilgi için [@std/testing belgesine](https://jsr.io/@std/testing) göz atabilirsiniz.

## Kapsam

Deno, `deno test` başlatırken `--coverage` bayrağını belirttiğinizde kodunuz için test kapsamını bir dizinde toplar. Bu kapsam bilgisi, yüksek doğruluk sağlamak için doğrudan V8 JavaScript motorundan alınır.

Bu, ardından iç formattan `lcov` gibi iyi bilinen formatlara dönüştürülebilir. Bunun için `deno coverage` aracını kullanabilirsiniz.

## Davranışa Dayalı Geliştirme

[@std/testing/bdd](https://jsr.io/@std/testing/doc/bdd/~) modülüyle testlerinizi, Jasmine, Jest ve Mocha gibi diğer JavaScript test çatıları tarafından kullanılan testleri gruplandırma ve kurulum/temizleme kancaları ekleme konusunda tanıdık bir biçimde yazabilirsiniz.

`describe` fonksiyonu, birden fazla ilgili testi gruplandıran bir blok oluşturur. `it` fonksiyonu bir bireysel test durumunu kaydeder. Örneğin:

```ts
import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

describe("toplama fonksiyonu", () => {
  it("iki sayıyı doğru toplar", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  it("negatif sayıları işler", () => {
    const result = add(-2, -3);
    expect(result).toBe(-5);
  });
});
```

Bu fonksiyonlar ve kancalar hakkında daha fazla bilgi için [JSR belgesine](https://jsr.io/@std/testing/doc/bdd/~) göz atın.

## Belge Testleri

Deno, JSDoc veya markdown dosyalarında yazılmış kod parçacıklarını değerlendirmenize olanak tanır. Bu, belgelerinizdeki örneklerin güncel ve işlevsel olmasını sağlar.

### Örnek kod blokları

````ts title="example.ts"
/**
 * # Örnekler
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(1, 2);
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
````

Üçlü ters tırnaklar, kod bloklarının başlangıcını ve sonunu işaretler; dil, kaynak belgesinin medya türüne göre tahmin edilir.

```sh
deno test --doc example.ts
```

Yukarıdaki komut, bu örneği çıkartacak, örnek görünümü aşağıdaki gibi görünmesini sağlayan bir test durumuna dönüştürecektir:

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add } from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(1, 2);
  assertEquals(sum, 3);
});
```

ve ardından belge modülüyle aynı dizinde yaşayan bağımsız bir modül olarak çalıştırılacaktır.

:::tip Sadece tür kontrolü yapmak ister misiniz?
JSDoc ve markdown dosyalarını çalıştırmadan daha önce tür kontrolü yapmak isterseniz, `deno check` komutunu `--doc` seçeneği ile (JSDoc için) veya `--doc-only` seçeneği ile (markdown için) kullanabilirsiniz.
:::

### Dışa Aktarılan öğeler otomatik olarak içe aktarılır

Yukarıda üretilen test koduna bakıldığında, orijinal kod bloğunda bulunmasa bile `add` işlevini içe aktaran `import` ifadesini içerdiğini göreceksiniz. Bir modülü belgelendirirken, modülden dışa aktarılan herhangi bir öğe, aynı isimle üretilen test koduna otomatik olarak dahil edilir.

Diyelim ki elimizde şu modül var:

````ts title="example.ts"
/**
 * # Örnekler
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(ONE, getTwo());
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}

export const ONE = 1;
export default function getTwo() {
  return 2;
}
````

Bu, aşağıdaki test durumuna dönüştürülecektir:

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add, ONE }, getTwo from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(ONE, getTwo());
  assertEquals(sum, 3);
});
```

### Kod bloklarını atlama

Kod bloklarının değerlendirilmesini, `ignore` niteliğini ekleyerek atlayabilirsiniz.

````ts
/**
 * Bu kod bloğu çalıştırılmayacaktır.
 *
 * ```ts ignore
 * await sendEmail("deno@example.com");
 * ```
 */
export async function sendEmail(to: string) {
  // verilen adrese e-posta gönder...
}
````

## Sanitizer'lar

Test çalıştırıcısı, testlerin makul ve beklenen bir şekilde davranmasını sağlamak için çeşitli sanitizer'lar sunar.

### Kaynak sanitizer'ı

Kaynak sanitizer'ı, bir test sırasında oluşturulan tüm I/O kaynaklarının kapatıldığından emin olur, bu da sızıntıları önler.

I/O kaynakları, `Deno.FsFile` tutacakları, ağ bağlantıları, `fetch` gövdesi, zamanlayıcılar ve otomatik olarak çöp toplayıcı tarafından alınmayan diğer kaynaklardır.

İşiniz bittiğinde her zaman kaynakları kapatmalısınız. Örneğin, bir dosyayı kapatmak için:

```ts
const file = await Deno.open("hello.txt");
// Dosyayla bir şeyler yap
file.close(); // <- Done geldiğinizde her zaman dosyayı kapatın
```

Bir ağ bağlantısını kapatmak için:

```ts
const conn = await Deno.connect({ hostname: "example.com", port: 80 });
// Bağlantıyla bir şeyler yap
conn.close(); // <- İşiniz bittiğinde her zaman bağlantıyı kapatın
```

Bir `fetch` gövdesini kapatmak için:

```ts
const response = await fetch("https://example.com");
// Yanıtla bir şeyler yap
await response.body?.cancel(); // <- Eğer başka bir şekilde tüketmediyseniz, her zaman vücudu teslim etmeden önce iptal edin
```

Bu sanitizer varsayılan olarak etkindir, ancak bu test içinde `sanitizeResources: false` ile devre dışı bırakılabilir:

```ts
Deno.test({
  name: "sızıntı kaynak testi",
  async fn() {
    await Deno.open("hello.txt");
  },
  sanitizeResources: false,
});
```

### Asenkron işlem sanitizer'ı

Asenkron işlem sanitizer'ı, bir testte başlatılan tüm asenkron işlemlerin, test bitmeden tamamlandığından emin olur. Bu önemlidir çünkü bir asenkron işlem beklenmiyorsa, test, işlem tamamlanmadan önce sona erer ve test, işlemin aslında başarısız olmasına rağmen başarılı olarak işaretlenir.

Her zaman testlerinizde tüm asenkron işlemleri beklemelisiniz. Örneğin:

```ts
Deno.test({
  name: "asenkron işlem testi",
  async fn() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});
```

Bu sanitizer varsayılan olarak etkindir, ancak `sanitizeOps: false` ile devre dışı bırakılabilir:

```ts
Deno.test({
  name: "sızıntı işlem testi",
  fn() {
    crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("a".repeat(100000000)),
    );
  },
  sanitizeOps: false,
});
```

### Çıkış sanitizer'ı

Çıkış sanitizer'ı, test edilen kodun `Deno.exit()` çağrısı yapmadığından emin olur, bu da yanlış bir test başarısını işaret edebilir.

Bu sanitizer varsayılan olarak etkindir, ancak `sanitizeExit: false` ile devre dışı bırakılabilir.

```ts
Deno.test({
  name: "yanlış başarı",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// Bu test asla çalışmaz, çünkü süreç "yanlış başarı" testinin sırasında çıkar
Deno.test({
  name: "başarısız test",
  fn() {
    throw new Error("bu test başarısız olur");
  },
});
```

## Snapshot testi

`Deno Standart Kütüphanesi` , geliştiricilerin değerleri referans anlık görüntüleriyle karşılaştırarak test yazmasına olanak tanıyan bir [anlık görüntü modülü](https://jsr.io/@std/testing/doc/snapshot/~) içerir. Bu anlık görüntüler, orijinal değerlerin serileştirilmiş temsilleridir ve test dosyalarıyla birlikte saklanır.

Anlık görüntü testi, çok az kodla geniş bir hata yelpazesini yakalamayı mümkün kılar. Özellikle, neyin teyit edilmesi gerektiğini tam olarak ifade etmenin zor olduğu, aşırı miktarda kod gerektirmeden veya bir testin yaptığı doğrulamaların sık sık değişmesi bekleniyorsa yararlıdır.