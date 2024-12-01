---
title: "Statik bir site dağıtma"
description: Bu eğitim, Deno Deploy üzerinde JavaScript olmadan bir statik siteyi nasıl dağıtacağınızı kapsar. Adım adım olarak, gerekli dosyaları oluşturacak ve dağıtım sürecini gerçekleştireceksiniz.
keywords: [Deno Deploy, statik site, dağıtım, HTML, file server]
---

Bu eğitim, Deno Deploy üzerinde statik bir siteyi (JavaScript olmadan) nasıl dağıtacağınızı kapsayacaktır.

## Adım 1: Statik siteyi oluşturun

```sh
mkdir static-site
cd static-site
touch index.html
```

`index.html` dosyanızın içine aşağıdaki HTML'yi yapıştırın:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Merhaba</title>
  </head>
  <body>
    <h1>Merhaba</h1>
    <img src="image.png" alt="image" />
  </body>
</html>
```

`static-site` içinde bir `image.png` bulunduğundan emin olun.

Artık "Merhaba" diyen ve bir logoya sahip bir HTML sayfanız var.

## Adım 2: `deployctl` kullanarak statik siteyi dağıtma

:::tip
`deployctl` komutu, Deno Deploy üzerinde statik dosyaları hızlı bir şekilde dağıtmanıza yardımcı olur.
:::

Bu repoyu Deno Deploy üzerinde dağıtmak için, `static-site` reposu içinde şu komutu çalıştırın:

```console
deployctl deploy --project=<tercih ettiğiniz-proje-ismi> https://jsr.io/@std/http/1.0.7/file_server.ts
```

Bu komutların biraz daha açıklamasını vermek gerekirse: Çünkü bu bir statik site, çalıştırılacak hiçbir JavaScript yoktur. Deno Deploy'a giriş noktasını vermek yerine, dış `file_server.ts` programını verirsiniz. Bu program, `static-site` reposundaki tüm statik dosyaları, resim ve HTML sayfası dahil olmak üzere, Deno Deploy'a yükler. Bu statik varlıklar daha sonra sunulmaktadır.

## Adım 3: İşte böyle!

Statik siteniz artık yayında olmalı! URL'si terminalde görüntülenecek veya yeni statik site projenizi [Deno kontrol panelinizde](https://dash.deno.com/projects/) yönetebilirsiniz. 

:::info
Yeni projenize girdiğinizde, siteyi görüntüleyebilir, ismini, ortam değişkenlerini, özel alan adlarını ve daha fazlasını yapılandırabilirsiniz.
:::