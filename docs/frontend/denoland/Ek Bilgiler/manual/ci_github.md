---
title: "CI ve GitHub Actions"
description: Deno Deploy'in Git entegrasyonu ile kod değişikliklerinin dağıtım süreçlerini keşfedin. Bu kılavuz, otomatik ve GitHub Actions modlarında nasıl yapılandırma yapılacağını açıklar.
keywords: [Deno, GitHub Actions, otomatik dağıtım, yapı aşaması, kod dağıtımı]
---

Deno Deploy'in Git entegrasyonu, kod değişikliklerinin bir GitHub deposuna itildiğinde dağıtılmasını sağlar. Üretim dalındaki commitler, üretim dağıtımı olarak dağıtılacaktır. Diğer dallardaki commitler ise önizleme dağıtımı olarak dağıtılacaktır.

Git entegrasyonu için iki çalışma modu vardır:

- **Otomatik**: Deno Deploy, her itişinizde kod ve varlıkları deposu kaynağınızdan otomatik olarak alacak ve dağıtım yapacaktır. Bu mod çok hızlıdır, ancak bir yapı aşamasına izin vermez. _Bu, çoğu kullanıcı için önerilen moddur._
- **GitHub Actions**: Bu modda, kod ve varlıklarınızı Deno Deploy'a bir GitHub Actions iş akışından itersiniz. Bu, dağıtımdan önce bir yapı adımı gerçekleştirmenize olanak tanır.

:::info
Deno Deploy, özel dağıtım yapılandırmanıza göre uygun bir mod seçecektir. Aşağıda, **Otomatik** ve **GitHub Actions** modları için farklı yapılandırmalar hakkında daha fazla ayrıntıya gidiyoruz.
:::

## Otomatik

Projeniz ek yapı aşamaları gerektirmiyorsa, sistem **Otomatik** modunu seçecektir. Giriş noktası dosyası, Deno Deploy'un çalıştıracağı dosyadır.

## GitHub Actions

**Proje Yapılandırması**'nda **Kurulum Aşaması** ve/veya **Yapı Aşaması**'nda bir komut girerseniz, Deno Deploy gerekli bir GitHub Actions iş akışı dosyası oluşturacak ve bunu deponuza itecektir. Bu iş akışı dosyasında, projenizi dağıtmak için `deployctl` [Github action][deploy-action]'ını kullanıyoruz. Dağıtım yapılmadan önce, yapı komutunu çalıştırmak gibi gereken her şeyi yapabilirsiniz.

Daha fazla bilgi için [Fresh belgesine][Deploy to production] bakın.

Daha fazla detay için [deployctl README](https://github.com/denoland/deployctl/blob/main/action/README.md)'ye bakın.

:::tip
Çalıştırmak istediğiniz ön işleme komutlarını yapılandırmak için, git deponuzu seçtikten sonra görünen **Gelişmiş seçenekleri göster** butonuna tıklayın. Ardından, gerekli değerleri giriş kutularına girin.
:::

Örneğin, bir Fresh projesi için [önceden derlemeleri] etkinleştirmek istiyorsanız, **Yapı Aşaması** kutusuna `deno task build` yazacaksınız.

Deno Deploy'in oluşturup deponuza ittiği GitHub Actions iş akışı dosyası aşağıdaki gibi görünmektedir.

```yml title=".github/workflows/deploy.yml"
name: Deploy
on:
  push:
    branches: main
  pull_request:
    branches: main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    permissions:
      id-token: write # Deno Deploy ile kimlik doğrulama için gereklidir
      contents: read # Deponun klonlanması için gereklidir

    steps:
      - name: Depoyu klonla
        uses: actions/checkout@v4

      - name: Deno'yu kur
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: Yapı aşaması
        run: "deno task build"

      - name: Deno Deploy'a yükle
        uses: denoland/deployctl@v1
        with:
          project: "<proje-adınız>"
          entrypoint: "main.ts"
          root: "."
```