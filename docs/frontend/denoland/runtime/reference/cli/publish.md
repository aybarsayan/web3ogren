---
title: "deno publish"
description: Deno publish komutu, Deno paketlerinizi yayımlamak için kullanılan bir araçtır. Bu kılavuz, gerekli paket yapılandırmalarını ve örnek kullanım senaryolarını içermektedir.
keywords: [deno, publish, paket, jsr, komut, yayınlamak, semver]
---

## Paket Gereksinimleri

Paketinizin `deno.json` veya `jsr.json` dosyasında `name`, `version` ve `exports` alanlarına sahip olması gerekir.

- `name` alanı benzersiz olmalı ve `@/` 
  konvansiyonunu takip etmelidir.
- `version` alanı geçerli bir semver versiyonu olmalıdır.
- `exports` alanı paketin ana giriş noktasına işaret etmelidir.

Örnek:

```json title="deno.json"
{
  "name": "@scope_name/package_name",
  "version": "1.0.0",
  "exports": "./main.ts"
}
```

:::info
Paketinizi yayımlamadan önce, [JSR - Yayınlamak için bir paket oluşturun](https://jsr.io/new) sayfasını ziyaret ederek kayıt etmelisiniz.
:::

## Örnekler

Mevcut çalışma alanınızı yayımlayın.

```bash
deno publish
```

Mevcut çalışma alanınızı belirli bir token ile, etkileşimli kimlik doğrulamayı atlayarak yayımlayın.

```bash
deno publish --token c00921b1-0d4f-4d18-b8c8-ac98227f9275
```

Uzak modüllerde hata kontrolü yaparak yayımlayın.

```bash
deno publish --check=all
```

Yayımlamayı simüle etmek için kuru çalışma yapın.

```bash
deno publish --dry-run
```

:::tip
`--dry-run` seçeneği, gerçek bir yayımlama işlemi yapmadan önce, planlanan işlemi görmenizi sağlar. Bu, potansiyel hataları önlemek için faydalıdır.
:::

Belirli bir yapılandırma dosyasındaki ayarları kullanarak yayımlayın.

```bash
deno publish --config custom-config.json
```