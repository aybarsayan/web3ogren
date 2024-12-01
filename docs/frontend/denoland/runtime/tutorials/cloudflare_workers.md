---
title: "Deno'yu Cloudflare Workers'a Dağıtma"
description: Cloudflare Workers üzerinde Deno fonksiyonlarının nasıl dağıtılacağını adım adım keşfedin. Bu kılavuz, Deno'yu Cloudflare'a başarıyla dağıtmak için gereken kurulum ve yapılandırma adımlarını detaylandırmaktadır.
keywords: [Deno, Cloudflare Workers, dağıtım, CLI, denoflare]
---

Cloudflare Workers, Cloudflare'ın kenar ağında JavaScript çalıştırmanıza olanak tanır.

:::info
Bu, bir Deno fonksiyonunu Cloudflare Workers'a dağıtmak için kısa bir Kılavuzdur.
Not: Yalnızca [Modül Workers](https://developers.cloudflare.com/workers/learning/migrating-to-module-workers/) dağıtabilirsiniz, web sunucuları veya uygulamalar yerine.
:::

## `denoflare` Kurulumu

Deno'yu Cloudflare'a dağıtmak için, bu topluluk tarafından oluşturulmuş CLI [`denoflare`](https://denoflare.dev/) kullanacağız.

[Bunu kurun](https://denoflare.dev/cli/#installation):

```shell
deno install --unstable --allow-read --allow-net --allow-env --allow-run --name denoflare --force \
https://raw.githubusercontent.com/skymethod/denoflare/v0.5.11/cli/cli.ts
```

## Fonksiyonunuzu Oluşturun

Yeni bir dizinde, Modül Worker fonksiyonumuzu içerecek bir `main.ts` dosyası oluşturalım:

```ts
export default {
  fetch(request: Request): Response {
    return new Response("Hello, world!");
  },
};
```

En azından, bir Modül Worker fonksiyonu, `fetch` fonksiyonunu döndüren bir nesneyi `export default` olarak sunmalıdır.

:::tip
Bunu yerel olarak test edebilirsiniz:
```shell
denoflare serve main.ts
```
:::

Tarayıcınızdaki `localhost:8080` adresine giderseniz, yanıtın şöyle olduğunu göreceksiniz:

```console
Hello, world!
```

## `.denoflare`'yi Yapılandırın

Sonraki adım, bir `.denoflare` yapılandırma dosyası oluşturmaktır. İçine şunları ekleyelim:

```json
{
  "$schema": "https://raw.githubusercontent.com/skymethod/denoflare/v0.5.11/common/config.schema.json",
  "scripts": {
    "main": {
      "path": "/absolute/path/to/main.ts",
      "localPort": 8000
    }
  },
  "profiles": {
    "myprofile": {
      "accountId": "abcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "apiToken": "abcxxxxxxxxx_-yyyyyyyyyyyy-11-dddddddd"
    }
  }
}
```

`accountId`'nizi bulmak için [Cloudflare kontrol panelinize](https://dash.cloudflare.com/) gidin, "Workers"ı tıklayın ve sağ tarafta "Hesap ID'si"ni bulun.

:::note
`apiToken`'i [Cloudflare API Token ayarlarından](https://dash.cloudflare.com/profile/api-tokens) oluşturabilirsiniz. Bir API token oluşturduğunuzda, "Edit Cloudflare Workers" şablonunu kullandığınızdan emin olun.
:::

Her ikisini de `.denoflare` yapılandırmanıza ekledikten sonra, Cloudflare'a itmeyi deneyelim:

```console
denoflare push main
```

Sonraki adımda, Cloudflare hesabınızdaki yeni fonksiyonunuzu görüntüleyebilirsiniz:

![Yeni fonksiyon Cloudflare Workers'ta](../../../images/cikti/denoland/runtime/tutorials/images/how-to/cloudflare-workers/main-on-cloudflare.png)

Pat!