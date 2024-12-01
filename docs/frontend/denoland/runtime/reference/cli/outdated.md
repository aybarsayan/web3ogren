---
title: "deno outdated"
description: "Bu belge, `deno outdated` alt komutunun nasıl kullanılacağını, bağımlılık güncellemelerini ve çalışma alanı yönetimini detaylandırır. Kullanıcılar, güncel olmayan bağımlılıkları kontrol edebilir ve güncelleyebilirler."
keywords: [deno, outdated, bağımlılıklar, güncelleme, çalışma alanı]
---

## Güncel Olmayan Bağımlılıkları Kontrol Etme

`outdated` alt komutu, `deno.json` veya `package.json` dosyalarında listelenen NPM ve JSR bağımlılıklarının yeni sürümlerini kontrol eder ve güncellenebilecek bağımlılıkları görüntüler. Çalışma alanları tamamen desteklenmektedir; bazı üyelerin `package.json` kullandığı ve diğerlerinin `deno.json` kullandığı çalışma alanları dahil.

Örneğin, bir `deno.json` dosyasına sahip bir proje düşünelim:

```json
{
  "imports": {
    "@std/fmt": "jsr:@std/fmt@^1.0.0",
    "@std/async": "jsr:@std/async@1.0.1",
    "chalk": "npm:chalk@4"
  }
}
```

ve `@std/fmt` sürümünün `1.0.0` olduğu bir kilit dosyası.

```bash
$ deno outdated
┌────────────────┬─────────┬────────┬────────┐
│ Paket          │ Mevcut  │ Güncelle│ Son Sürüm │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/fmt   │ 1.0.0   │ 1.0.3  │ 1.0.3  │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/async │ 1.0.1   │ 1.0.1  │ 1.0.8  │
├────────────────┼─────────┼────────┼────────┤
│ npm:chalk      │ 4.1.2   │ 4.1.2  │ 5.3.0  │
└────────────────┴─────────┴────────┴────────┘
```

**`Güncelle`** sütunu en yeni semver-uyumlu sürümü, **`Son Sürüm`** sütunu ise en son sürümü listeler.

:::info
`jsr:@std/async`'ın listelendiğini, mevcut bir semver-uyumlu sürüm olmadığı halde, fark edin. Yalnızca yeni uyumlu sürümleri gösteren paketleri görüntülemek isterseniz `--compatible` bayrağını geçebilirsiniz.
:::

```bash
$ deno outdated --compatible
┌────────────────┬─────────┬────────┬────────┐
│ Paket          │ Mevcut  │ Güncelle│ Son Sürüm │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/fmt   │ 1.0.0   │ 1.0.3  │ 1.0.3  │
└────────────────┴─────────┴────────┴────────┘
```

`jsr:@std/fmt` hala listeleniyor, çünkü `1.0.3` sürümüne uyumlu olarak güncellenebilirken, `jsr:@std/async` artık gösterilmiyor.

## Bağımlılıkları Güncelleme

`outdated` alt komutu ayrıca `--update` bayrağı ile bağımlılıkları güncelleyebilir. Varsayılan olarak, yalnızca bağımlılıkları semver-uyumlu sürümlere günceller (yani kırıcı bir sürüme güncellemez).

```bash
$ deno outdated --update
1 bağımlılık güncellendi:
 - jsr:@std/fmt 1.0.0 -> 1.0.3
```

En son sürümlere güncellemek için (semver uyumlu olup olmadığına bakılmaksızın), `--latest` bayrağını geçebilirsiniz.

```bash
$ deno outdated --update --latest
3 bağımlılık güncellendi:
 - jsr:@std/async 1.0.1 -> 1.0.8
 - jsr:@std/fmt   1.0.0 -> 1.0.3
 - npm:chalk      4.1.2 -> 5.3.0
```

## Paket Seçimi

`outdated` alt komutu ayrıca hangi paketler üzerinde işlem yapacağınızı seçmenizi de destekler. Bu, `--update` bayrağı ile veya olmadan çalışır.

```bash
$ deno outdated --update --latest chalk
1 bağımlılık güncellendi:
 - npm:chalk 4.1.2 -> 5.3.0
```

Birden fazla seçici geçilebilir ve joker karakterler (`*`) veya hariç tutmalar (`!`) da desteklenir.

Örneğin, `@std` kapsamındaki tüm paketleri güncellemek için, `@std/fmt` hariç:

```bash
$ deno outdated --update --latest "@std/*" "!@std/fmt"
1 bağımlılık güncellendi:
 - jsr:@std/async 1.0.1 -> 1.0.8
```

Eğer joker karakterler kullanıyorsanız, muhtemelen argümanı tırnak içinde çevrelemeniz gerekecek, bu da Shell'in bunları genişletmeye çalışmasını önler.

### Belirli Sürümlere Güncelleme

Paketleri güncellemeyi seçmenin yanı sıra, `--update` bayrağı ayrıca yeni _sürümü_ seçmeyi de destekler; sürümü `@` işaretinden sonra belirtin.

```bash
❯ deno outdated --update chalk@5.2 @std/async@1.0.6
2 bağımlılık güncellendi:
 - jsr:@std/async 1.0.1 -> 1.0.6
 - npm:chalk      4.1.2 -> 5.2.0
```

## Çalışma Alanları

Bir çalışma alanı ortamında, varsayılan olarak `outdated` yalnızca _şu anki_ çalışma alanı üyesi üzerinde çalışır.

Örneğin, verilen bir çalışma alanı:

```json
{
  "workspace": ["./member-a", "./member-b"]
}
```

`./member-a` dizininde

```bash
deno outdated
```

komutunu çalıştırmak, yalnızca `./member-a/deno.json` veya `./member-a/package.json` dosyasında listelenen güncel olmayan bağımlılıkları kontrol edecektir.

:::tip
Tüm çalışma alanı üyelerini dahil etmek için, `--recursive` bayrağını geçin (kısayol olarak `-r` da kabul edilir).
:::

```bash
deno outdated --recursive
deno outdated --update --latest -r
``` 