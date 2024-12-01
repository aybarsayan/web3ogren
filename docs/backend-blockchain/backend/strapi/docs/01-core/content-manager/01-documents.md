---
title: Belgeler
description: İçerik yöneticisindeki belgelere bir giriş. Bu içerik, belgelerin nasıl alındığı ve etkileşimde bulunulacağı hakkında bilgi sunmaktadır. Kullanıcıların belge matrisini anlamalarına yardımcı olmak amaçlanmaktadır.
keywords: [belgeler, içerik yöneticisi, taslak, yayınlama, API]
---

CM'nin en önemli unsuru bir belgedir. Bir belgenin oluşturulmasına yönelik mantık esasen `@strapi/core` paketinde yer alsa da, onlarla etkileşim kurabilmek için ne olduklarını anlamamız gerekiyor. V5 (2024'ün 1. çeyreği) sürümünde tanıtılan yeni taslak ve yayınlama özelliği için belgeler, temelde girdilerin bir matrisidir. Bu matris, belgenizin sahip olduğu boyutların sayısına bağlı olarak karmaşıklığını artırır. Örneğin, Taslak & Yayınlama ve Uluslararasılaştırma (2 yerelleştirme ile) etkin olduğunda, belgede 4 girdi elde edersiniz - her bir yerelleştirme için bir taslak ve her bir yerelleştirme için bir yayınlanmış girdi.

:::note
Taslak & Yayınlama, içerik türlerinde isteğe bağlıdır.
:::

## Belgeleri Alma

Belgeleri `useDocument` kancası aracılığıyla alırız. Bu, hangi "modeli" istememiz gerektiğini anlamamızı gerektirir - model esasen hangi içerik türü olduğu, örneğin `api::article.article`, içerik türünün "nitelikleri", örneğin `single-type` veya `collection-type` ve söz konusu belgenin belirli `id`si. Bu üç parametreyi kullanarak, belirli bir parametre, örneğin `locale` geçmeden herhangi bir belgeyi alabiliriz; bu durumda kullanıcının uygulaması tarafından tanımlanan bir varsayılan versiyon alırız. Ancak, tüm boyutlar sorgulanabilir olmalı, böylece belge matrisindeki noktanızı belirli bir girdiyle daraltabilirsiniz, örneğin `yayınlanmış & 'en-GB'`.

:::info
Belge alırken, her boyutun sorgulanabilir olduğundan emin olun. Bu, daha spesifik ve doğru sonuçlar almanızı sağlar.
:::

## Belgelerle Etkileşim

Belgeler üzerinde gerçekleştirilebilecek evrensel işlemler vardır, bunlar:

- `create` – yeni bir belge oluşturur
- `update` – mevcut bir belgeyi günceller
- `delete` – mevcut bir belgeyi siler

`collection-type` olan belgeler ayrıca klonlanabilir. Eğer bir belgede taslak ve yayınlama etkinse, belgeyi ayrıca yayımlayabilir ve yayından kaldırabilirsiniz. Tüm bu işlevsellik, `useDocumentActions` kancası aracılığıyla sunulmaktadır.

:::tip
Belgelerle etkileşimde bulunurken, her zaman güncel belge versiyonlarını kontrol edin. Böylece güncellemelerinizin geçerliliğini koruyabilirsiniz.
:::