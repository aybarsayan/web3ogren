---
title: Alt Yapı Hakkında
description: Deno Alt Yapı, SaaS sağlayıcılarının güvenli bir şekilde yazılım kodunu çalıştırmalarını mümkün kılan bir platformdur. Bu içerik, Deno Alt Yapı'nın temel özelliklerini, sunduğu çözümleri ve REST API'sini detaylandırmaktadır.
keywords: [Deno, Alt Yapı, SaaS, API, güvenli dağıtım, yazılım, JavaScript]
---

Deno Alt Yapı, Yazılım olarak Hizmet (SaaS) sağlayıcılarının müşterileri tarafından yazılan kodu güvenli bir şekilde çalıştırmalarını sağlamak için tasarlanmış güçlü bir platformdur. Alt Yapı API'si, güvensiz kodu programatik olarak ve ölçekli bir şekilde dağıtmanıza olanak tanır.

## Temel Özellikler

- **Kullanım Kolaylığı:** Geliştiriciler, Deno hakkında özel bir bilgiye ihtiyaç duymadan genel JavaScript veya TypeScript'te kod yazabilir.
- **Standartlara Uyum:** Deno, standart JavaScript ve TypeScript'i destekler ve `fetch` ve `web cache` gibi yaygın olarak kullanılan web API'leri ile entegre olur.
- **Deno'ya Özgü Gelişmiş Özellikler:** Tipik tarayıcı yeteneklerinin ötesine geçen `KV` (Anahtar-Değer deposu) gibi gelişmiş özellikler sunar.
- **Hızlı Dağıtım:** Deno’nun bulut ürünleri, basit uygulamalar için bir saniyeden daha kısa, çok sayıda bağımlılığı olan karmaşık web siteleri için yaklaşık on saniye gibi son derece kısa dağıtım sürelerini destekleyecek şekilde tasarlanmıştır.
- **Geliştirici Deneyiminin Geliştirilmesi:** Alt Yapı, güvensiz kodu kamu bulutunda çalıştırmak için güvenli bir altyapı kurma çabasını sizin için yönetir.

---

## Deno Bulut Sunumlarının Genel Görünümü - Deno Deploy ve Deno Alt Yapı

Deno, belirli kullanım senaryolarını desteklemek için tasarlanmış iki ayrı bulut sunumu sunar: Deno Deploy ve Deno Alt Yapı. Her iki ürün de aynı altyapıyı kullanır.

### Deno Deploy

Deno Deploy, sınırlı birinci taraf projeleri geliştirmeye ve üzerinde iterasyona odaklanmış bireysel geliştiriciler ve küçük takımlar için optimize edilmiştir. Bu çözüm, web siteleri veya uygulamalar barındırmak için idealdir ve dağıtım süreçleri genellikle GitHub entegrasyonları aracılığıyla yönetilir.

- Hedef Kitle: Bireysel geliştiriciler ve küçük geliştirme ekipleri.
- Dağıtım Entegrasyonu: Sürekli entegrasyon ve teslimat için öncelikle GitHub aracılığıyla.
- Kullanım Senaryoları: Web siteleri ve uygulamaları barındırma.

### Deno Alt Yapı

Buna karşın, Deno Alt Yapı, daha büyük bir proje ve dağıtım hacmini güvenli bir şekilde yönetmek için tasarlanmıştır. Güvensiz kod veya işlevlerin bir API aracılığıyla dağıtımını destekler ve birden çok son kullanıcının kod katkısından oluşan senaryolar için uygundur.

- Hedef Kitle: Müşteri tarafından oluşturulan güvensiz kodu güvenli bir şekilde barındırma yeteneğine ihtiyaç duyan SaaS platformları.
- Dağıtım Mekanizması: Ölçeklenebilirlik ve güvenlik için tasarlanmış sağlam bir API aracılığıyla.
- Kullanım Senaryoları: Son kullanıcıların kod katkısında bulunduğu büyük ölçekli proje barındırma.

:::tip
Alt yapıyı uygulamak için adımlar kabaca şu şekildedir:
1. `Bir organizasyon oluşturun` ve REST API için bir erişim belirteci alın.
2. `Bir proje oluşturun` ve ardından o proje için ilk dağıtımınızı gerçekleştirin.
:::

Bu teknikleri kullanarak, kullanıcı kodunu "dağıtımlar" olarak paketleyebilir ve bu kodu Deno tarafından sağlanan bir URL veya kendinizin yapılandırabileceği bir `özel URL` üzerinde çalıştırabilirsiniz.

---

## REST API Referansı ve OpenAPI Spesifikasyonu

Alt yapıyı uygulamak için kullanılan REST API'sinin tam referansı için [belgelere buradan göz atabilirsiniz](https://apidocs.deno.com). Deno Deploy REST API'si ayrıca [OpenAPI spesifikasyonu](https://api.deno.com/v1/openapi.json) sunmaktadır ve bu, [bir dizi OpenAPI uyumlu araçla](https://openapi.tools/) kullanılabilir.

Ayrıca [JavaScript](https://www.npmjs.com/package/subhosting), [Python](https://pypi.org/project/subhosting/0.0.1a0/) ve [Go](https://github.com/denoland/subhosting-go) dillerinde SDK'lar sunmaktayız.