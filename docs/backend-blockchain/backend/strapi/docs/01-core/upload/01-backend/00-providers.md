---
title: Sağlayıcılar
description: Bu belge, yükleme eklentisi üzerinden farklı harici hizmetlerle bağlantı kurarak sağlayıcıların nasıl kullanılacağını ve geliştirileceğini açıklamaktadır. Sağlayıcılar, uzaktaki sunuculara dosya yükleme ve silme yetenekleri ile önemli bir işlevsellik sağlar.
keywords: [yükleme, sağlamalar, S3, Cloudinary, dış hizmetler]
slug: /upload
tags:
  - yükleme
---

# Sağlayıcı

Yükleme eklentisini genişleterek, Amazon S3 havuzları, Cloudinary gibi farklı harici hizmetlere veya uygulamalara bağlanır.

**Yükleme eklentisi durumunda, sağlayıcının dosyaları uzaktaki bir sunucuya yükleyebilmesi ve silebilmesi gerekir.**

:::tip
**Dikkat:** Sağlayıcak uygulamaların gerekli izinleri alınmalıdır. 
:::

# Sağlayıcı kullanımı

Bir sağlayıcıyı kullanmak için, onu yüklemeniz ve `./config/plugins.js` dosyasında yapılandırmanız gerekir.

Sağlayıcıları yükleme hakkında daha fazla bilgi için [strapi belgeleri](https://docs.strapi.io/developer-docs/latest/development/providers.html#installing-providers) bağlantısına bakabilirsiniz.

:::info
**Not:** Sağlayıcı kurulumu işlemine başlamadan önce uygulamanızın gereksinimlerini inceleyin.
:::

# Sağlayıcı geliştirme

Bir sağlayıcı oluşturmak için, aşağıdaki yöntemleri döndüren bir işlevi dışa aktaran bir paket oluşturmanız gerekir:

- `isPrivate()` (isteğe bağlı) - Sağlayıcının özel olup olmadığını belirten bir boolean değeri döner. Özel ise, `getSignedUrl` yöntemi dosyanın URL'sini almak için kullanılacaktır. (varsayılan: `false`)
- `getSignedUrl(file)` (isteğe bağlı) - Dosya kimlik doğrulaması gerektiriyorsa, ona erişmek için imzalı bir URL döner.
- `upload(file)` - Dosyayı sağlayıcıya yükler.
- `uploadStream(stream)` (isteğe bağlı) - Bir akışı sağlayıcıya yükler.
- `delete(file)` - Sağlayıcıdan bir dosyayı siler.

> **Not:** Sağlayıcı geliştirme sürecinde, her bir özelliğin kullanım amacını dikkate almak önemlidir. 
> — Strapi Geliştirici Ekibi


Geliştirme Detayları

Sağlayıcıların geliştirilmesi sırasında dikkat edilmesi gereken bazı hususlar vardır:

- Sağlayıcının izinlerini doğru bir şekilde yapılandırın.
- Hatalı yapılandırmalar, dosya yükleme veya silme işlemlerinde sorunlara yol açabilir.

