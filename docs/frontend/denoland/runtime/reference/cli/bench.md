---
title: "`deno bench`, benchmark aracı"
description: "Bu belge, Deno'nun `bench` aracını kullanarak performans ölçümü yapmayı ve benchmark'ları yazmayı anlatmaktadır. Adım adım açıklamalarla benchmark yazım ve yürütme işlemlerini keşfedin."
keywords: [Deno, benchmark, performance measurement, CLI tools, async functions, benchmark writing]
oldUrl:
 - /runtime/manual/tools/benchmarker/
 - /runtime/reference/cli/benchmarker/
command: bench
---

## Hızlı Başlangıç

Öncelikle, bir `url_bench.ts` dosyası oluşturalım ve `Deno.bench()` fonksiyonu ile bir bench kaydedelim.

```ts
// url_bench.ts
Deno.bench("URL ayrıştırma", () => {
  new URL("https://deno.land");
});
```

İkinci olarak, benchmark'ı `deno bench` alt komutu ile çalıştırın.

```sh
deno bench url_bench.ts
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/url_bench.ts
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
URL ayrıştırma   17.29 µs/iter  (16.67 µs … 153.62 µs)  17.25 µs  18.92 µs  22.25 µs
```

---

## Benchmark Yazma

Bir benchmark tanımlamak için, onu `Deno.bench` API'sine bir çağrı ile kaydetmeniz gerekir. Bu API'nin çeşitli overload'ları, en büyük esnekliği sağlamak ve formlar arasında kolay geçiş yapmayı sağlamak için (örneğin, bir hatayı ayıklamak için hızlıca tek bir bench'e odaklanmanız gerektiğinde `only: true` seçeneğini kullanarak):

```ts
// Kompakt form: ad ve fonksiyon
Deno.bench("merhaba dünya #1", () => {
  new URL("https://deno.land");
});

// Kompakt form: adlandırılmış fonksiyon.
Deno.bench(function merhabaDunya3() {
  new URL("https://deno.land");
});

// Daha uzun form: bench tanımı.
Deno.bench({
  name: "merhaba dünya #2",
  fn: () => {
    new URL("https://deno.land");
  },
});

// Kompakt forma benzer, ancak ikinci argüman olarak ek yapılandırma ile.
Deno.bench("merhaba dünya #4", { permissions: { read: true } }, () => {
  new URL("https://deno.land");
});

// Daha uzun forma benzer, ancak bench fonksiyonu ikinci argüman olarak.
Deno.bench(
  { name: "merhaba dünya #5", permissions: { read: true } },
  () => {
    new URL("https://deno.land");
  },
);

// Daha uzun forma benzer, adlandırılmış bir bench fonksiyonu ikinci argüman olarak.
Deno.bench({ permissions: { read: true } }, function merhabaDunya6() {
  new URL("https://deno.land");
});
```

:::info
Asenkron fonksiyonlar için, bir **promise** döndüren bir bench fonksiyonu geçirebilirsiniz. Bunun için bir fonksiyonu tanımlarken **`async`** anahtar kelimesini kullanın.
:::

```ts
Deno.bench("asenkron merhaba dünya", async () => {
  await 1;
});
```

### Kritik Bölümler

Bazen benchmark durumunun, benchmark sonuçlarını kirletebilecek kurulum ve sökme kodunu içermesi gerekir. Örneğin, küçük bir dosyanın okunma süresini ölçmek istiyorsanız, dosyayı açmanız, okumanız ve ardından kapatmanız gerekir. Dosya yeterince küçükse dosyayı açıp kapatmanın süresi, dosyanın kendi okunma süresini aşabilir.

:::warning
Bu tür durumlarla yardımcı olmak için **`Deno.BenchContext.start`** ve **`Deno.BenchContext.end`** kullanarak ölçmek istediğiniz kritik bölümü benchmarking aracına söyleyebilirsiniz. Bu iki çağrı arasındaki bölüm dışındaki her şey ölçümden hariç tutulacaktır.
:::

```ts
Deno.bench("foo", async (b) => {
  // Üzerinde işlem yapacağımız bir dosya açın.
  const file = await Deno.open("a_big_data_file.txt");

  // Benchmark aracına, ölçmek istediğiniz tek bölümün bu olduğunu bildirirsiniz.
  b.start();

  // Şimdi dosyadan tüm verileri okumanın ne kadar sürdüğünü ölçelim.
  await new Response(file.readable).arrayBuffer();

  // Ölçümü burada sonlandırın.
  b.end();

  // Şimdi, benchmark sonuçlarını kirletmeyecek bazı potansiyel olarak zaman alıcı temizleme işlemlerini gerçekleştirebiliriz.
  file.close();
});
```

---

## Gruplama ve Baz Noktaları

Bir bench durumu kaydedilirken, **`Deno.BenchDefinition.group`** seçeneği ile bir gruba atanabilir:

```ts
// url_bench.ts
Deno.bench("url ayrıştırma", { group: "url" }, () => {
  new URL("https://deno.land");
});
```

Birden fazla durumu tek bir gruba atamak ve nasıl performans gösterdiklerini bir "baz noktasına" karşı karşılaştırmak faydalıdır.

Bu örnekte, `Date.now()`'un `performance.now()` ile ne kadar performanslı olduğunu kontrol edeceğiz, bunu yapmak için ilk durumu **`Deno.BenchDefinition.baseline`** seçeneği ile bir "baz noktasına" işaretleyeceğiz:

```ts
// time_bench.ts
Deno.bench("Date.now()", { group: "zamanlama", baseline: true }, () => {
  Date.now();
});

Deno.bench("performance.now()", { group: "zamanlama" }, () => {
  performance.now();
});
```

```shell
$ deno bench time_bench.ts
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/time_bench.ts
benchmark              time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------- -----------------------------
Date.now()         125.24 ns/iter (118.98 ns … 559.95 ns) 123.62 ns 150.69 ns 156.63 ns
performance.now()    2.67 µs/iter     (2.64 µs … 2.82 µs)   2.67 µs   2.82 µs   2.82 µs

özet
  Date.now()
   performance.now()'dan 21.29x daha hızlı
```

Aynı dosyada birden fazla grup belirtilebilir.

---

## Benchmark'ları Çalıştırma

Benchmark'ı çalıştırmak için **`deno bench`** komutunu, bench fonksiyonunuzu içeren dosya ile çağırın. Dosya adını atlayabilir, bu durumda mevcut dizindeki (rekürrsif olarak) tüm benchmark'lar, `{*_,*.,}bench.{ts, tsx, mts, js, mjs, jsx}` globuna uyanları çalıştırılacaktır. Bir dizin geçerseniz, bu glob ile eşleşen dizindeki tüm dosyalar çalıştırılacaktır.

Glob, şunlara genişler:

- `bench.{ts, tsx, mts, js, mjs, jsx}` ile adlandırılan dosyalar,
- veya `.bench.{ts, tsx, mts, js, mjs, jsx}` ile biten dosyalar,
- veya `_bench.{ts, tsx, mts, js, mjs, jsx}` ile biten dosyalar

```shell
# Geçerli dizindeki ve tüm alt dizinlerdeki tüm bench'leri çalıştır
deno bench

# util dizinindeki tüm bench'leri çalıştır
deno bench util/

# sadece my_bench.ts'yi çalıştır
deno bench my_bench.ts
```

> ⚠️ Ek CLI argümanları geçmek isterseniz, `--` kullanarak Deno'ya kalan argümanların betik argümanları olduğunu bildirin.

```shell
# Bench dosyasına ek argümanlar geç
deno bench my_bench.ts -- -e --foo --bar
```

`deno bench`, `deno run` ile aynı izin modelini kullanır ve bu nedenle, benchmark sırasında dosya sistemine yazmak için örneğin `--allow-write` gerektirecektir.

`deno bench` ile tüm çalışma zamanı seçeneklerini görmek için, komut satırı yardımına başvurabilirsiniz:

```shell
deno help bench
```

---

## Filtreleme

Çalıştırdığınız bench'leri filtrelemek için çeşitli seçenekler vardır.

### Komut satırı ile filtreleme

Bench'ler ayrı ayrı veya gruplar halinde, komut satırı **`--filter`** seçeneğini kullanarak çalıştırılabilir.

Filtre bayrakları bir dize veya bir desen alır.

Aşağıdaki bench'leri varsayalım:

```ts
Deno.bench({
  name: "my-bench",
  fn: () => {/* bench fonksiyonu sıfır */},
});
Deno.bench({
  name: "bench-1",
  fn: () => {/* bench fonksiyonu bir */},
});
Deno.bench({
  name: "bench2",
  fn: () => {/* bench fonksiyonu iki */},
});
```

Bu komut, hepsinin "bench" kelimesini içermesi nedeniyle tüm bu bench'leri çalıştıracaktır.

```shell
deno bench --filter "bench" benchmarks/
```

Tersine, aşağıdaki komut bir desen kullanıyor ve ikinci ile üçüncü benchmark'ları çalıştıracaktır.

```shell
deno bench --filter "/bench-*\d/" benchmarks/
```

_Deno'ya bir desen kullanmak istediğinizi bildirmek için, filtrenizi ileri eğik çizgilerle sarın (JavaScript'teki regex için sözdizimi şekli gibi)._ 

### Bench tanımı ile filtreleme

Bench'lerin kendileri içinde, filitreleme için iki seçeneğiniz vardır.

#### Filtreleme (bu bench'leri göz ardı etme)

Bazen belirli bir koşula dayalı olarak bench'leri göz ardı etmek istersiniz (örneğin bir benchmark'un yalnızca Windows'ta çalışmasını istemeniz). Bunun için bench tanımında **`ignore`** boolean'ını kullanabilirsiniz. **`true`** olarak ayarlandığında, bench atlanır.

```ts
Deno.bench({
  name: "bench windows özelliği",
  ignore: Deno.build.os !== "windows",
  fn() {
    // Windows özelliğini yap
  },
});
```

#### Filtreleme (yalnızca bu bench'leri çalıştırma)

Bazen büyük bir bench sınıfı içinde bir performans problemi ile uğraşıyorsanız, sadece o tek bench'e odaklanmak ve diğerlerini şimdilik göz ardı etmek istersiniz. Bunun için **`only`** seçeneğini kullanarak benchmark karnesine yalnızca bu ayara **`true`** olan bench'leri çalıştırmasını söyleyebilirsiniz. Birden fazla bench bu seçeneği ayarlayabilir. Benchmark çalışması, her bench'in başarı veya başarısızlık rapor edecektir, ancak genel benchmark çalışması her zaman **`only`** ile işaretlenmiş herhangi bir bench varsa başarısız olacaktır, çünkü bu yalnızca geçici bir önlem olup neredeyse tüm benchmark'larınızı devre dışı bırakır.

```ts
Deno.bench({
  name: "Sadece bu bench'e odaklan",
  only: true,
  fn() {
    // karmaşık şeyleri bench yap
  },
});
```

---

## JSON Çıktısı

Çıkışı **JSON** formatında almak için **`--json`** bayrağını kullanın:

```shell
$ deno bench --json bench_me.js
{
  "runtime": "Deno/1.31.0 x86_64-apple-darwin",
  "cpu": "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
  "benches": [
    "origin": "file:///dev/bench_me.js",
    "group": null,
    "name": "Deno.UnsafePointerView#getUint32",
    "baseline": false,
    "result": {
      "ok": {
        "n": 49,
        "min": 1251.9348,
        "max": 1441.2696,
        "avg": 1308.7523755102038,
        "p75": 1324.1055,
        "p99": 1441.2696,
        "p995": 1441.2696,
        "p999": 1441.2696
      }
    }
  ]
}
```