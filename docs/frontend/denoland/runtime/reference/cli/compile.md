---
title: "`deno compile`, bağımsız yürütülebilir dosyalar"
description: Bu belge, Deno'nun bağımsız yürütülebilir dosyalarının nasıl oluşturulacağını ve çeşitli bayraklarının nasıl kullanılacağını açıklar. Çapraz derleme, simgeler, dinamik içe aktarımlar ve daha fazlası hakkında bilgi bulabilirsiniz.
keywords: [deno, compile, bağımsız yürütülebilir, çapraz derleme, simge, dinamik içe aktarımlar, işçiler]
---

## Bayraklar

`deno install` ile olduğu gibi, betiğin yürütülmesi için gereken çalışma zamanı bayrakları derleme zamanında belirtilmelidir. Bu, izin bayraklarını içerir.

```sh
deno compile --allow-read --allow-net jsr:@std/http@1.0.0/file-server
```

`Betiğin argümanları` kısmen gömülebilir.

```console
deno compile --allow-read --allow-net jsr:@std/http@1.0.0/file-server -p 8080

./file_server --help
```

---

## Çapraz Derleme

`--target` bayrağını kullanarak diğer platformlar için ikili dosyaları çapraz olarak derleyebilirsiniz.

```
# Apple Silicon için çapraz derleme
deno compile --target aarch64-apple-darwin main.ts

# Bir simge ile Windows için çapraz derleme
deno compile --target x86_64-pc-windows-msvc --icon ./icon.ico main.ts
```

### Desteklenen Hedefler

Deno, ana platformdan bağımsız olarak tüm hedeflere çapraz derlemeyi destekler.

| OS      | Mimari      | Hedef                          |
| ------- | ------------ | ------------------------------ |
| Windows | x86_64       | `x86_64-pc-windows-msvc`      |
| macOS   | x86_64       | `x86_64-apple-darwin`         |
| macOS   | ARM64        | `aarch64-apple-darwin`        |
| Linux   | x86_64       | `x86_64-unknown-linux-gnu`    |
| Linux   | ARM64        | `aarch64-unknown-linux-gnu`   |

---

## Simgeler

:::tip 
Windows hedeflenirken `--icon` bayrağını kullanarak yürütülebilir dosyaya bir simge eklemek mümkündür. Simge `.ico` formatında olmalıdır.
:::

```
deno compile --icon icon.ico main.ts

# Simge ile çapraz derleme
deno compile --target x86_64-pc-windows-msvc --icon ./icon.ico main.ts
```

---

## Dinamik İçe Aktarımlar

Varsayılan olarak, statik olarak analiz edilebilen dinamik içe aktarımlar (içinde `import("...")` çağrı ifadesi olan dize literal içerenler) çıktı dosyasına dahil edilecektir.

```ts
// calculator.ts ve bağımlılıkları ikili dosyaya dahil edilecektir
const calculator = await import("./calculator.ts");
```

Ancak, statik olarak analiz edilemeyen dinamik içe aktarımlar dahil edilmeyecektir:

```ts
const specifier = condition ? "./calc.ts" : "./better_calc.ts";
const calculator = await import(specifier);
```

Statik olarak analiz edilemeyen dinamik içe aktarımları dahil etmek için, `--include ` bayrağını belirtin.

```shell
deno compile --include calc.ts --include better_calc.ts main.ts
```

---

## Veri Dosyalarını veya Dizinlerini Dahil Etme

Deno 2.1 itibarıyla, yürütülebilir dosyaya dosyaları veya dizinleri dahil etmek için `--include ` bayrağını belirtebilirsiniz.

```shell
deno compile --include names.csv --include data main.ts
```

Daha sonra, mevcut modülün dizin yoluna göre dosyayı `import.meta.dirname` ile okuyun:

```ts
// main.ts
const names = Deno.readTextFileSync(import.meta.dirname + "/names.csv");
const dataFiles = Deno.readDirSync(import.meta.dirname + "/data");

// burada names ve dataFiles kullanın
```

Bu şu anda sadece dosya sistemindeki dosyalar için çalışır ve uzaktaki dosyalar için geçerli değildir.

---

## İşçileri

Statik olarak analiz edilemeyen dinamik içe aktarımlar gibi, `işçiler` için kod, derlenmiş yürütülebilir dosyaya varsayılan olarak dahil edilmez. İşçileri dahil etmenin iki yolu vardır:

1. İşçi kodunu dahil etmek için `--include ` bayrağını kullanın.

```shell
deno compile --include worker.ts main.ts
```

2. İşçi modülünü statik olarak analiz edilebilen bir içe aktarma ile içe aktarın.

```ts
// main.ts
import "./worker.ts";
```

```shell
deno compile main.ts
```

---

## Kod İmzalama

### macOS

Varsayılan olarak, macOS'ta, derlenen yürütülebilir dosya, `codesign -s -` komutunu çalıştırmanın eşdeğeridir:

```shell
$ deno compile -o main main.ts
$ codesign --verify -vv ./main

./main: disk üzerinde geçerli
./main: Belirlenmiş Gereksinimini karşılar
```

Yürütülebilir dosyayı kod imzalama sırasında bir imzalama kimliği belirtebilirsiniz.

```shell
codesign -s "Geliştirici Kimliği Uygulaması: Adınız" ./main
```

Kod imzalama ve notarizasyon hakkında daha fazla bilgi için [resmi belgeleri](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution) inceleyin.

### Windows

Windows'ta, derlenen yürütülebilir dosya `SignTool.exe` aracı kullanılarak imzalanabilir.

```shell
$ deno compile -o main.exe main.ts
$ signtool sign /fd SHA256 main.exe
```

---

## Yürütülebilir Dosyalarda Mevcut Değil

- `Web Depolama API'si`