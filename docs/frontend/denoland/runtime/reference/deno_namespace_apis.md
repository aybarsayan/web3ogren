---
title: "Deno Namespace API'leri"
description: Deno'nun küresel Namespace'i, dosyalardan okuma, TCP soketlerini açma, HTTP sunma ve alt süreçler gibi çeşitli API'leri içerir. Bu döküman, önemli Deno API'lerinin kullanımını açıklamaktadır.
keywords: [Deno, API, dosya sistemi, ağ, alt süreç, izinler, FFI]
---

Küresel `Deno` Namespace'i, web standartı olmayan API'leri içerir; dosyalardan okuma, TCP soketlerini açma, HTTP sunma ve alt süreçleri çalıştırma gibi API'leri içerir.

Tüm Deno API'lerini Keşfedin

Aşağıda bilmeniz gereken bazı Deno API'lerinin en önemlilerini vurguluyoruz.

## Dosya Sistemi

Deno çalışma zamanı, `dosyalar ve dizinlerle çalışmak için çeşitli işlevler` ile birlikte gelir. **Dosya sistemine erişmek için** `--allow-read` ve `--allow-write` izinlerini kullanmanız gerekecek.

:::tip
Dosya sistemi işlevlerini nasıl kullanacağınıza dair kod örnekleri için aşağıdaki bağlantılara başvurun.
:::

- `Birçok farklı yolla dosya okuma`
- `Akışlarda dosya okuma`
- `Bir metin dosyasını okuma (`Deno.readTextFile`)`
- `Bir metin dosyasını yazma (`Deno.writeTextFile`)`

## Ağ

Deno çalışma zamanı, `ağ bağlantılarıyla başa çıkmak için yerleşik işlevler` ile birlikte gelir.

:::info
Yaygın işlevler için kod örnekleri için aşağıdaki bağlantılara başvurun.
:::

- `Ana bilgisayar adı ve bağlantı noktasına bağlanma (`Deno.connect`)`
- `Yerel taşıma adresinde ilan verme (`Deno.listen`)`

## Alt Süreçler

Deno çalışma zamanı, `alt süreçleri başlatmak için yerleşik işlevler` ile birlikte gelir.

:::note
Bir alt süreç oluşturma konusundaki kod örnekleri için aşağıdaki bağlantılara başvurun.
:::

- `Bir alt süreç oluşturma (`Deno.Command`)`

## Hatalar

Deno çalışma zamanı, `bir dizi koşula karşılık olarak artırılabilen 20 hata sınıfı` içerir.

Bazı örnekler:

> ```sh
> Deno.errors.NotFound;
> Deno.errors.WriteZero;
> ```

Aşağıdaki gibi kullanılabilirler:

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("dosya bulunamadı");
  } else {
    // Aksi takdirde hatayı yeniden fırlat
    throw error;
  }
}
```

## HTTP Sunucusu

Deno'nun iki HTTP Sunucu API'si vardır:

- `Deno.serve`: yerel, _daha yüksek seviyede_, HTTP/1.1 ve HTTP2'yi destekler; bu, Deno'da HTTP sunucuları yazmak için tercih edilen API'dir.
- `Deno.serveHttp`: yerel, _düşük seviyede_, HTTP/1.1 ve HTTP2'yi destekler.

Belirli bir bağlantı noktasında HTTP sunucusu başlatmak için `Deno.serve` işlevini kullanın. Bu işlev, her gelen istek için çağrılacak bir işleyici işlevi alır ve bir yanıt (veya bir yanıtı çözümleyen bir promise) döndürmesi beklenir. **Örneğin:**

```ts
Deno.serve((_req) => {
  return new Response("Merhaba, Dünya!");
});
```

Varsayılan olarak `Deno.serve`, `8000` bağlantı noktasında dinleyecektir, ancak bu ilk veya ikinci argüman olarak bir bağlantı numarası geçerek değiştirilebilir.

`HTTP sunucusu API'lerini nasıl kullanacağınızı daha fazla okuyabilirsiniz`.

## İzinler

İzinler, **`deno` komutu çalıştırıldığında** CLI'dan verilir. Kullanıcı kodları genellikle kendi gerekli izin setini varsayar, ancak yürütme sırasında **verilen** izin setinin bununla uyumlu olacağına dair bir garanti yoktur.

:::warning
Bazı durumlarda, arıza toleranslı bir program sağlamak, çalışma zamanında izin sistemiyle etkileşim kurma yolunu gerektirir.
:::

### İzin tanımlayıcıları

CLI'da, `/foo/bar` için okuma izni `--allow-read=/foo/bar` olarak temsil edilir. Çalışma zamanı JS'de aşağıdaki gibi temsil edilir:

```ts
const desc = { name: "read", path: "/foo/bar" } as const;
```

Diğer örnekler:

```ts
// Küresel yazma izni.
const desc1 = { name: "write" } as const;

// `$PWD/foo/bar` için yazma izni.
const desc2 = { name: "write", path: "foo/bar" } as const;

// Küresel ağ izni.
const desc3 = { name: "net" } as const;

// 127.0.0.1:8000 için ağ izni.
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;

// Yüksek çözünürlüklü zaman izni.
const desc5 = { name: "hrtime" } as const;
```

API referansında daha fazla ayrıntı için `PermissionDescriptor`'a bakın. Aşağıda açıklanan tüm API'ler için senkron API karşılıkları (örneğin `Deno.permissions.querySync`) vardır.

### İzinleri Sorgulama

Bir izin tanımlayıcısına göre, bir izin verilip verilmediğini kontrol edin.

```ts
// deno run --allow-read=/foo main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "granted", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

Eğer `--deny-read` bayrağı bazı dosya yollarını kısıtlamak için kullanıldıysa, sonuç `partial: true` içerecek ve bu, tüm alt yolların izinlerinin verilmediğini tanımlayacaktır:

```ts
// deno run --allow-read=/foo --deny-read=/foo/bar main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: true }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "denied", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

### İzin durumları

Bir izin durumu ya "granted" ya da "prompt" ya da "denied" olabilir. CLI'dan verilen izinler `{ state: "granted" }` olarak sorgulanacaktır. Verilmeyenler varsayılan olarak `{ state: "prompt" }` olarak sorgulanırken, `{ state: "denied" }` açıkça reddedilenler için ayrılmıştır. Bu, `İzin istemleri` bölümünde ortaya çıkacaktır.

:::danger
İzin gücü `İzinleri sorgulama` bölümündeki ikinci sorgunun sonucuna dair sezgisel anlayış, `/foo`'ya okuma erişiminin verildiği ve `/foo/bar`'ın `/foo` içinde olduğu için `/foo/bar`'ın okunmasına izin verildiğidir.
:::

Bu, CLI tarafından verilen izin, sorgulanan izinler ile _kısmi_ ise geçerlidir (örneğin, bir `--deny-*` bayrağı kullanımı sonucunda).

Ayrıca `desc1`'in
_[daha güçlü olduğu](https://www.w3.org/TR/permissions/#ref-for-permissiondescriptor-stronger-than)_
söylenebilir. Bu, herhangi bir CLI tarafından verilen izin seti için geçerlidir:

1. Eğer `desc1`, `{ state: "granted", partial: false }` ile sorgulanıyorsa, o zaman `desc2` de öyle olmalıdır.
2. Eğer `desc2`, `{ state: "denied", partial: false }` ile sorgulanıyorsa, o zaman `desc1` de öyle olmalıdır.

Daha fazla örnek:

```ts
const desc1 = { name: "write" } as const;
// şu ile daha güçlüdür
const desc2 = { name: "write", path: "/foo" } as const;

const desc3 = { name: "net", host: "127.0.0.1" } as const;
// şu ile daha güçlüdür
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;
```

### İzin istemleri

Kullanıcıdan CLI istemi üzerinden verilmemiş bir izin talep etme.

```ts
// deno run main.ts

const desc1 = { name: "read", path: "/foo" } as const;
const status1 = await Deno.permissions.request(desc1);
// ⚠️ Deno "/foo" için okuma erişimi talep ediyor. İzin verilsin mi? [y/n (y = evet, n = hayır)] y
console.log(status1);
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/bar" } as const;
const status2 = await Deno.permissions.request(desc2);
// ⚠️ Deno "/bar" için okuma erişimi talep ediyor. İzin verilsin mi? [y/n (y = evet, n = hayır)] n
console.log(status2);
// PermissionStatus { state: "denied", partial: false }
```

Eğer mevcut izin durumu "prompt" ise, kullanıcının terminalinde talebi onaylamak isteyip istemediğine dair bir istem belirecektir. `desc1` için talep verildiği için yeni durumu döndürülür ve yürütme `--allow-read=/foo` CLI üzerinde belirtilmiş gibi devam edecektir. `desc2` için talep reddedildiği için izin durumu "prompt" tan "denied" a düşecektir.

Mevcut izin durumu zaten "granted" ya da "denied" ise, istek bir sorgu gibi davranır ve sadece mevcut durumu döndürür. Bu zaten verilen izinler ve daha önce reddedilen talepler için istem önler.

### İzinleri İptal Etme

Bir izni "granted" durumundan "prompt" durumuna düşürme.

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
```

CLI'dan verilen bir izni iptal etmeye çalıştığınızda ne olur, bu _kısmi_ olan bir izinse:

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
const cliDesc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(cliDesc));
// PermissionStatus { state: "prompt", partial: false }
```

CLI'dan verilen izin, iptal edilen izni içeriyorsa, o da iptal edilmiş oldu.

Bu davranışı anlamak için, Deno'nun _açıkça verilen izin tanımlayıcılarından_ oluşan bir iç küme sakladığını hayal edin. CLI üzerinde `--allow-read=/foo,/bar` belirtmek bu kümenin başlangıçtan oluşturulmasını sağlar:

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
];
```

`{ name: "write", path: "/foo" }` için çalışma zamanı isteği verildiğinde küme güncellenir:

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
  { name: "write", path: "/foo" },
];
```

Deno'nun izin iptal algoritması, argüman izin tanımlayıcılarından daha güçlü olan her elemanı bu kümeden kaldırarak çalışır.

Deno, bazı güçlü izinlerin verildiği ve buna bağlı zayıf izinlerin hariç tutulduğu "parçalı" izin durumlarına izin vermez. Böyle bir sistem, daha geniş bir kullanım durumu ve `"denied"` durumu dahilinde giderek daha karmaşık ve tahmin edilemez hale gelecektir. Bu, güvenlik için granülerlik meselesidir.

## import.meta

Deno, [`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta) API'sinde bir dizi özellik ve yöntem destekler. Modülün URL'si gibi modül hakkında bilgi almak için kullanılabilir.

### import.meta.url

**Geçerli modülün URL'sini döndürür.**

```ts title="main.ts"
console.log(import.meta.url);
```

```sh
$ deno run main.ts
file:///dev/main.ts

$ deno run https:/example.com/main.ts
https://example.com/main.ts
```

### import.meta.main

**Geçerli modülün programınızın giriş noktası olup olmadığını döndürür.**

```ts title="main.ts"
import "./other.ts";

console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```ts title="other.ts"
console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```sh
$ deno run main.ts
Is file:///dev/other.ts the main module? false
Is file:///dev/main.ts the main module? true
```

### import.meta.filename

**_Bu özellik yalnızca yerel modüller için (şu modül `file:///...` belirteciyle) mevcuttur ve uzaktan modüller için `undefined` döner._**

**Geçerli modülün tam olarak çözülmüş yolunu döndürür.** Değer, işletim sistemi bağımsız yol ayırıcılarını içerir.

```ts title="main.ts"
console.log(import.meta.filename);
```

Unix üzerinde:

```sh
$ deno run main.ts
/dev/main.ts

$ deno run https://example.com/main.ts
undefined
```

Windows üzerinde:

```sh
$ deno run main.ts
C:\dev\main.ts

$ deno run https://example.com/main.ts
undefined
```

### import.meta.dirname

**_Bu özellik yalnızca yerel modüller için (şu modül `file:///...` belirteciyle) mevcuttur ve uzaktan modüller için `undefined` döner._**

**Geçerli modülü içeren dizinin tam olarak çözülmüş yolunu döndürür.** Değer, işletim sistemi bağımsız yol ayırıcılarını içerir.

```ts title="main.ts"
console.log(import.meta.dirname);
```

Unix üzerinde:

```sh
$ deno run main.ts
/dev/

$ deno run https://example.com/main.ts
undefined
```

Windows üzerinde:

```sh
$ deno run main.ts
C:\dev\

$ deno run https://example.com/main.ts
undefined
```

### import.meta.resolve

**Belirtileri geçerli modüle göre çözümleyin.**

```ts
const worker = new Worker(import.meta.resolve("./worker.ts"));
```

`import.meta.resolve` API'si, geçerli uygulanan ithalat haritasını dikkate alır. Bu da "bare" belirtileri çözümlemenizi sağlar.

Bu ithalat haritası yüklüyken...

```json
{
  "imports": {
    "fresh": "https://deno.land/x/fresh@1.0.1/dev.ts"
  }
}
```

...şimdi çözebilirsiniz:

```js title="resolve.js"
console.log(import.meta.resolve("fresh"));
```

```sh
$ deno run resolve.js
https://deno.land/x/fresh@1.0.1/dev.ts
```

## FFI

**FFI (yabancı işlev arabirimi) API'si**, kullanıcıların C ABI'leri (C/C++, Rust, Zig, V, vb.) ile desteklenen yerel dillerde yazılmış kütüphaneleri `Deno.dlopen` kullanarak çağırmasına olanak tanır.

**İşte Deno'dan bir Rust işlevini çağırma örneği:**

```rust
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

Bunu bir C dinamik kütüphanesine (`libadd.so` Linux üzerinde) derleyin:

```sh
rustc --crate-type cdylib add.rs
```

C dilinde bunu şöyle yazabilirsiniz:

```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

Ve derleyin:

```sh
// unix
cc -c -o add.o add.c
cc -shared -W -o libadd.so add.o
// Windows
cl /LD add.c /link /EXPORT:add
```

Deno'dan kütüphaneyi çağırma:

```typescript
// ffi.ts

// Kütüphane uzantısını belirleyin
// işletim sisteminize göre.
let libSuffix = "";
switch (Deno.build.os) {
  case "windows":
    libSuffix = "dll";
    break;
  case "darwin":
    libSuffix = "dylib";
    break;
  default:
    libSuffix = "so";
    break;
}

const libName = `./libadd.${libSuffix}`;
// Kütüphaneyi açın ve dışa aktarılan sembolleri tanımlayın
const dylib = Deno.dlopen(
  libName,
  {
    "add": { parameters: ["isize", "isize"], result: "isize" },
  } as const,
);

// `add` sembolünü çağır
const result = dylib.symbols.add(35, 34); // 69

console.log(`35 ve 34'ün dışsal toplama sonucu: ${result}`);
```

**`--allow-ffi` ve `--unstable` bayrağı ile çalıştırın:**

```sh
deno run --allow-ffi --unstable ffi.ts
```

### Engellemeyen FFI

Kullanıcıların ana iş parçacığındaki diğer görevleri engellemeden arka planda CPU bağlı FFI işlevlerini çalıştırmak istedikleri birçok kullanım durumu vardır.

Deno 1.15 itibarıyla, semboller `Deno.dlopen`'da `nonblocking` olarak işaretlenebilir. **Bu işlev çağrıları, ayrılmış bir engelleyici iş parçacığında çalışacak ve istenen `sonuç` değerine ulaşan bir `Promise` döndürecektir.**

Deno ile pahalı FFI çağrılarının yürütülmesi örneği:

```c
// sleep.c
#ifdef _WIN32
#include <Windows.h>
#else
#include <time.h>
#endif

int sleep(unsigned int ms) {
  #ifdef _WIN32
  Sleep(ms);
  #else
  struct timespec ts;
  ts.tv_sec = ms / 1000;
  ts.tv_nsec = (ms % 1000) * 1000000;
  nanosleep(&ts, NULL);
  #endif
}
```

Deno'dan çağırma:

```typescript
// nonblocking_ffi.ts
const library = Deno.dlopen(
  "./sleep.so",
  {
    sleep: {
      parameters: ["usize"],
      result: "void",
      nonblocking: true,
    },
  } as const,
);

library.symbols.sleep(500).then(() => console.log("Sonra"));
console.log("Önce");
```

Sonuç:

```sh
$ deno run --allow-ffi --unstable unblocking_ffi.ts
Önce
Sonra
```

### Geri Aramalar

Deno FFI API'si, **JavaScript işlevlerinden C geri aramaları oluşturarak dinamik kütüphanelerden Deno'ya geri çağrılmasını destekler.** Geri aramaların nasıl oluşturulup kullanıldığına dair bir örnek aşağıdakiler gibidir:

```typescript
// callback_ffi.ts
const library = Deno.dlopen(
  "./callback.so",
  {
    set_status_callback: {
      parameters: ["function"],
      result: "void",
    },
    start_long_operation: {
      parameters: [],
      result: "void",
    },
    check_status: {
      parameters: [],
      result: "void",
    },
  } as const,
);

const callback = new Deno.UnsafeCallback(
  {
    parameters: ["u8"],
    result: "void",
  } as const,
  (success: number) => {},
);

// Geri arama gösterisini dinamik kütüphaneye geçirin
library.symbols.set_status_callback(callback.pointer);
// Thread'ı engellemeyen uzun bir işlemi başlatın
library.symbols.start_long_operation();

// Daha sonra, kütüphaneyi işlemin tamamlanıp tamamlanmadığını kontrol etmesi için tetikleyin.
// Eğer tamamlandıysa, bu çağrı geri aramayı tetikleyecektir.
library.symbols.check_status();
```

Eğer bir `UnsafeCallback`'ın geri arama işlevi bir hata fırlatırsa, **hata geri aramanın çağrıldığı işleve kadar yayılacaktır** (yukarıda, bu `check_status()` olacaktır) ve orada yakalanabilir. Eğer bir geri aramanın değer döndürmesi sırasında hata fırlatılırsa, Deno sonuç olarak 0 (pointerlar için null pointer) döndürecektir.

**`UnsafeCallback` varsayılan olarak serbest bırakılmadığı için kullanımdan sonra bırakılması gereklidir; bunun için `close()` metodu çağrılmalıdır.**

```typescript
const callback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" } as const,
  () => {},
);

// Geri arama artık gerekmediyse
callback.close();
// Geri aramayı bir parametre olarak geçmek artık güvenli değildir.
```

Ayrıca, **yerel kütüphanelerin kesme yöneticilerini ayarlaması ve bunların doğrudan geri aramayı tetiklemesi mümkündür.** Ancak bu önerilmemektedir ve beklenmedik yan etkilere ve tanımsız davranışlara neden olabilir. Tercihen, herhangi bir kesme yöneticisi, yukarıda `check_status()`'ın nasıl kullanıldığına benzer bir şekilde daha sonra sorgulanabilecek bir bayrak ayarlamalıdır.

---
title: Desteklenen Türler
description: Deno FFI API'sı tarafından desteklenen türlerin detaylı açıklamaları ve kullanım örnekleri. Bu içerik, programcılar için Deno ve Rust ile çalışırken karşılaşabilecekleri türler hakkında bilgiler sunar.
keywords: [Deno, FFI, Rust, TypedArray, unhandledrejection, beforeunload, program yaşam döngüsü]
---

### Desteklenen Türler

Deno FFI API'sı tarafından şu anda desteklenen türlerin bir listesi.

| FFI Türü              | Deno                 | C                        | Rust                      |
| --------------------- | -------------------- | ------------------------ | ------------------------- |
| `i8`                  | `number`             | `char` / `signed char`   | `i8`                      |
| `u8`                  | `number`             | `unsigned char`          | `u8`                      |
| `i16`                 | `number`             | `short int`              | `i16`                     |
| `u16`                 | `number`             | `unsigned short int`     | `u16`                     |
| `i32`                 | `number`             | `int` / `signed int`     | `i32`                     |
| `u32`                 | `number`             | `unsigned int`           | `u32`                     |
| `i64`                 | `number \| bigint`   | `long long int`          | `i64`                     |
| `u64`                 | `number \| bigint`   | `unsigned long long int` | `u64`                     |
| `usize`               | `number \| bigint`   | `size_t`                 | `usize`                   |
| `isize`               | `number \| bigint`   | `size_t`                 | `isize`                   |
| `f32`                 | `number \| bigint`   | `float`                  | `f32`                     |
| `f64`                 | `number \| bigint`   | `double`                 | `f64`                     |
| `void`[1]             | `undefined`          | `void`                   | `()`                      |
| `pointer`             | `{} \| null`         | `void *`                 | `*mut c_void`             |
| `buffer`[2]           | `TypedArray \| null` | `uint8_t *`              | `*mut u8`                 |
| `function`[3]         | `{} \| null`         | `void (*fun)()`          | `Option` |
| `{ struct: [...] }`[4]| `TypedArray`         | `struct MyStruct`        | `MyStruct`                |

:::info
Deno 1.25 itibarıyla `pointer` türü, kullanıcıların Typed Arrays için optimizasyonlardan yararlanmasını sağlamak amacıyla `pointer` ve `buffer` türlerine ayrılmıştır. Deno 1.31 itibarıyla `pointer`'ın JavaScript temsili, opak bir gösterim nesnesi veya null gösterimler için `null` olmuştur.
:::

- [1] `void` türü yalnızca sonuç türü olarak kullanılabilir.
- [2] `buffer` türü, parametre olarak TypedArrays'ı kabul eder, ancak her zaman bir gösterim nesnesi veya `null` döndürür; tıpkı `pointer` türü gibi.
- [3] `function` türü, parametre ve sonuç türü olarak `pointer` türüyle tam olarak aynı şekilde çalışır.
- [4] `struct` türü, C struct'larını değer olarak (kopyalama) iletmek ve döndürmek için kullanılır. `struct` dizisi, her bir struct'ın alan türlerini sırasıyla belirtmelidir. Struct'lar otomatik olarak doldurulur: Paketlenmiş struct'lar, doldurmayı önlemek için uygun miktarda `u8` alanları kullanılarak tanımlanabilir. Yalnızca TypedArrays struct olarak desteklenir ve struct'lar her zaman `Uint8Array` olarak döndürülür.

---

### deno_bindgen

[`deno_bindgen`](https://github.com/denoland/deno_bindgen) Rust dilinde yazılmış Deno FFI kütüphanelerinin yapıştırma kodu oluşturmalarını basitleştirmek için resmi aracıdır.

Rust Wasm ekosistemindeki [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) ile benzerdir.

Kullanımını gösteren bir örnek:

```rust
// mul.rs
use deno_bindgen::deno_bindgen;

#[deno_bindgen]
struct Input {
  a: i32,
  b: i32,
}

#[deno_bindgen]
fn mul(input: Input) -> i32 {
  input.a * input.b
}
```

Bağlantıları oluşturmak için `deno_bindgen` komutunu çalıştırın. Artık bunları doğrudan Deno'ya içe aktarabilirsiniz:

```ts
// mul.ts
import { mul } from "./bindings/bindings.ts";
mul({ a: 10, b: 2 }); // 20
```

`deno_bindgen` ile ilgili her türlü sorun [burada](https://github.com/denoland/deno_bindgen/issues) bildirilmelidir.

---

## Program Yaşam Döngüsü

Deno, tarayıcıyla uyumlu yaşam döngüsü olaylarını destekler:

- [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#:~:text=The%20load%20event%20is%20fired,for%20resources%20to%20finish%20loading.): tüm sayfanın, stiller ve görüntüler gibi tüm bağımlı kaynaklar dahil yüklendiği zaman tetiklenir.
- [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#:~:text=The%20beforeunload%20event%20is%20fired,want%20to%20leave%20the%20page.): olay döngüsünde yapılacak daha fazla iş kalmadığında ve çıkmak üzereyken tetiklenir. Daha fazla asenkron iş zamanlamak (zamanlayıcılar veya ağ istekleri gibi) programın devam etmesine neden olacaktır.
- [`unload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event): belge veya bir alt kaynağın yüklemesi sona erdiğinde tetiklenir.
- [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event): reddedici bir işleyiciye sahip olmayan bir promise reddedildiğinde tetiklenir, yani bir `.catch()` işleyicisi veya `.then()`'e bir ikinci argüman yoktur.
- [`rejectionhandled`](https://developer.mozilla.org/en-US/docs/Web/API/Window/rejectionhandled_event): zaten reddedilmiş bir promise'e `.catch()` işleyicisi eklendiğinde tetiklenir. Bu olay yalnızca, olayın yayılmasını önleyen bir `unhandledrejection` dinleyicisi varsa tetiklenir (bu durum programın bir hata ile sonlanmasına neden olur).

:::tip
Bu olayları programınıza setup ve cleanup kodu sağlamak için kullanabilirsiniz. `load` olayları için dinleyiciler asenkron olabilir ve beklenebilir; bu olay iptal edilemez. `beforeunload` için dinleyicilerin senkron olması gerekir ve programın çalışmasını sürdürmek için iptal edilebilirler. `unload` olayları için dinleyiciler senkron olmalı ve iptal edilemez.
:::

**main.ts**

```ts title="main.ts"
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (main)`);
};

globalThis.addEventListener("load", handler);

globalThis.addEventListener("beforeunload", handler);

globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (main)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (main)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (main)`);
};

console.log("log from main script");
```

```ts title="imported.ts"
const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (imported)`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (imported)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (imported)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (imported)`);
};

console.log("log from imported script");
```

Bu örnekte birkaç not:

- `addEventListener` ve `onload`/`onunload` `globalThis` ile ön eklenmiş, ancak `self` veya hiç ön ek olmadan da kullanılabilir. 
  [`window` kullanımı önerilmez](https://lint.deno.land/#no-window-prefix).
- Olaylar için işleyici tanımlamak için `addEventListener` ve/veya `onload`/`onunload` kullanabilirsiniz. Aralarında büyük bir fark vardır, örneği çalıştıralım:

```shell
$ deno run main.ts
log from imported script
log from main script
got load event in event handler (imported)
got load event in event handler (main)
got load event in onload function (main)
got onbeforeunload event in event handler (imported)
got onbeforeunload event in event handler (main)
got onbeforeunload event in onbeforeunload function (main)
got unload event in event handler (imported)
got unload event in event handler (main)
got unload event in onunload function (main)
```

`addEventListener` ile eklenen tüm dinleyiciler çalıştırılır, ancak `main.ts`'de tanımlanan `onload`, `onbeforeunload` ve `onunload` işleyicileri, `imported.ts`'de tanımlananları geçersiz kılar.

Diğer bir deyişle, birden fazla `"load"` veya `"unload"` olay işleyicisi kaydetmek için `addEventListener` kullanabilirsiniz, ancak yalnızca en son tanımlanan `onload`, `onbeforeunload`, `onunload` olay işleyicileri çalıştırılacaktır. Bu nedenle, mümkünse `addEventListener` kullanmak tercih edilen yöntemdir.

---

### beforeunload

```js
// beforeunload.js
let count = 0;

console.log(count);

globalThis.addEventListener("beforeunload", (e) => {
  console.log("About to exit...");
  if (count < 4) {
    e.preventDefault();
    console.log("Scheduling more work...");
    setTimeout(() => {
      console.log(count);
    }, 100);
  }

  count++;
});

globalThis.addEventListener("unload", (e) => {
  console.log("Exiting");
});

count++;
console.log(count);

setTimeout(() => {
  count++;
  console.log(count);
}, 100);
```

Bu programı çalıştırmak şu çıktıyı verecektir:

```sh
$ deno run beforeunload.js
0
1
2
About to exit...
Scheduling more work...
3
About to exit...
Scheduling more work...
4
About to exit...
Exiting
```

---

### unhandledrejection olayı

Bu olay, reddedici bir işleyiciye sahip olmayan bir promise reddedildiğinde tetiklenir, yani bir `.catch()` işleyici veya `.then()`'e ikinci bir argüman yoktur.

```js
// unhandledrejection.js
globalThis.addEventListener("unhandledrejection", (e) => {
  console.log("unhandled rejection at:", e.promise, "reason:", e.reason);
  e.preventDefault();
});

function Foo() {
  this.bar = Promise.reject(new Error("bar not available"));
}

new Foo();
Promise.reject();
```

Bu programı çalıştırmak şu çıktıyı verecektir:

```sh
$ deno run unhandledrejection.js
unhandled rejection at: Promise {
  <rejected> Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
} reason: Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
unhandled rejection at: Promise { <rejected> undefined } reason: undefined
```