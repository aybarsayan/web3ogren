---
description: İzleme modu, bağımlılıklar değiştiğinde scriptinizi otomatik olarak yeniden çalıştırır. Bu mod ile çalışırken bazı önemli ipuçlarına dikkat etmelisiniz.
keywords: [izleme modu, tsx, script, yeniden çalıştırma, glob desenleri, exclude, include]
---

# İzleme modu

::: warning
Node'un İzleme modu ile karıştırılmamalıdır [Node's Watch mode](https://nodejs.org/docs/latest/api/cli.html#--watch). _tsx_, Node.js `--watch` bayrağını [v18.11.0](https://github.com/nodejs/node/releases/tag/v18.11.0) sürümünde yayımlamadan önce _İzleme modunu_ tanıttı. İşlevsellik açısından benzer olmasına rağmen, hala _tsx_'nin İzleme modunun sağlamlığına ulaşmamıştır.
:::

## Genel Bakış

İzleme modu, bağımlılıklarınızdan herhangi biri değiştiğinde, scriptinizi otomatik olarak yeniden çalıştırır.

```sh
tsx watch ./file.ts
```

## İzleme Davranışı

Varsayılan olarak, _tsx_ aşağıdaki dizinler dışındaki tüm içe aktarılan dosyaları izler:

- `node_modules`
- `bower_components`
- `vendor`
- `dist`
- Gizli dizinler (`.*`)

## İzlenen Dosyaları Özelleştirme

### İzlenecek Dosyaları Dahil Etme

Belirli dosya veya dizinleri izlemek için `--include` bayrağını kullanın:

```sh
tsx watch --include ./other-dep.txt --include "./other-deps/*" ./file.ts
```

### İzlemeden Çıkarma

Belirli dosyaların izlenmemesi için `--exclude` bayrağını kullanın:

```sh
tsx watch --exclude ./ignore-me.js --exclude ./ignore-me-too.js ./file.ts
```

### Glob Desenlerini Kullanma

Glob desenleri, göz ardı edilecek bir dosya veya dizin seti tanımlamanıza olanak tanır. Shell'inizin glob desenlerini genişletmesini önlemek için bunları tırnak içine alın:

```sh
tsx watch --exclude "./data/**/*" ./file.ts
```

## İpuçları

::: tip
- Scripti manuel olarak yeniden çalıştırmak için Return tuşuna basın.
- Yeniden çalıştırma sırasında ekranın silinmesini önlemek için `--clear-screen=false` kullanın.
:::