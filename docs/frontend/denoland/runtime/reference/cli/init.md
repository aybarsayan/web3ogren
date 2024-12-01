---
title: "`deno init`, yeni bir proje başlat"
description: Deno kullanarak yeni bir proje başlatmanın detaylarını ve örneklerini keşfedin. Proje başlatma komutlarını, JSR paketlerini ve web sunucusu başlatma işlemlerini öğrenin.
keywords: [Deno, proje başlatma, JSR, web sunucusu, kütüphane, ayar dosyası]
---

## Örnekler

```sh
$ deno init
✅ Proje başlatıldı
Başlamak için bu komutları çalıştırın

  // Programı çalıştır
  deno run main.ts

  // Programı çalıştır ve dosya değişikliklerini izleyin
  deno task dev

  // Testleri çalıştır
  deno test

$ deno run main.ts
2 + 3 = 5

$ deno test
Check file:///dev/main_test.ts
main_test.ts dosyasından 1 test çalıştırılıyor
addTest ... ok (6ms)

ok | 1 geçti | 0 başarısız (29ms)
```

`init` alt komutu, `main.ts` ve `main_test.ts` adında iki dosya oluşturacaktır.  
Bu dosyalar, Deno programı yazmanın ve bunun için test yazmanın temel bir örneğini sağlar. 
`main.ts` dosyası iki sayıyı toplayan bir `add` fonksiyonunu dışa aktarır ve `main_test.ts` dosyası bu fonksiyon için bir testi içerir.

Ayrıca, `deno init` komutuna belirli bir dizinde bir proje başlatmak için bir argüman belirtebilirsiniz:

```sh
$ deno init my_deno_project
✅ Proje başlatıldı

Başlamak için bu komutları çalıştırın

  cd my_deno_project

  // Programı çalıştır
  deno run main.ts

  // Programı çalıştır ve dosya değişikliklerini izleyin
  deno task dev

  // Testleri çalıştır
  deno test
```

## Bir JSR paketi başlat

:::info
`deno init --lib` komutunu çalıştırarak, Deno, [JSR](https://jsr.io/) üzerinde yayımlanmaya hazır bir proje başlatır.
:::

```sh
$ deno init --lib
✅ Proje başlatıldı

Başlamak için bu komutları çalıştırın

  # Testleri çalıştır
  deno test

  # Testleri çalıştır ve dosya değişikliklerini izleyin
  deno task dev

  # JSR'ye yayımla (kuru çalışma)
  deno publish --dry-run
```

`deno.json` içinde `name`, `exports` ve `version` için girişlerin önceden doldurulduğunu göreceksiniz.

```json
{
  "name": "my-lib",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "dev": "deno test --watch mod.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```

## Bir web sunucusu başlat

:::warning
`deno init --serve` komutunu çalıştırmak, `deno serve` ile çalışan bir web sunucusunu başlatır.
:::

```sh
$ deno init --serve
✅ Proje başlatıldı

Başlamak için bu komutları çalıştırın

  # Sunucuyu çalıştır
  deno serve -R main.ts

  # Sunucuyu çalıştır ve dosya değişikliklerini izleyin
  deno task dev

  # Testleri çalıştır
  deno -R test
```

Sizin `deno.json` dosyanız şu şekilde görünecek:

```json
{
  "tasks": {
    "dev": "deno serve --watch -R main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "@std/http": "jsr:@std/http@1"
  }
}
```

Artık `deno task dev` komutunu çalıştırarak web sunucunuzu başlatabilir ve
`değişiklikleri izleyebilirsiniz`.

```sh
$ deno task dev
Task dev deno serve --watch -R main.ts
Gözlemci Süreci başlatıldı.
deno serve: http://0.0.0.0:8000/ üzerinde dinliyor.
```

## Bir kütüphane projesi oluştur

:::tip
`deno.json` dosyanıza "name", "version" ve "exports" alanları gibi ekstra parametreler eklemek için `--lib` bayrağını ekleyebilirsiniz.
:::

```sh
$ deno init my_deno_project --lib
✅ Proje başlatıldı
```

Ortaya çıkan `deno.json` şöyle olacaktır:

```jsonc
{
  "name": "my_deno_project",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "dev": "deno test --watch mod.ts"
  },
  "license": "MIT",
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```