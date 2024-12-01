---
title: Giriş
description: Bu belge, içerik sürümlerini yönetmek için gerekli bilgileri ve lisans sınırlarını açıklar. Kullanıcıların erişim gereksinimleri ve ilgili uç noktalar hakkında bilgi sağlar.
keywords: [içerik sürümleri, teknik tasarım, Strapi, Redux, Formik, Chargebee, uç noktalar]
---

## Özet

İki sayfa vardır: **ReleasesPage** ve **ReleaseDetailsPage**. Kullanıcının geçerli bir Strapi lisansına sahip olması, özelliklerin etkinleştirilmesi ve en az `plugin::content-releases.read` izinlerine sahip olması gerekir.

:::tip
Unutmayın, içerik sürümleri verilerini yönetmek için **Redux toolkit** kullanılmaktadır. Bu araç, veri alma, sürüm oluşturma ve düzenleme gibi önemli işlevleri destekler.
:::

**Formik**, bir sürümü oluşturmak ve düzenlemek için kullanılır. Tüm girdi bileşenleri **kontrol edilen** bileşenlerdir.

### Lisans Sınırları

Çoğu lisans, **Chargebee** aracılığıyla yapılandırılan özellik tabanlı kullanım sınırlarına sahiptir. Bu sınırlar, `useLicenseLimits` ile ön yüz kısmında gösterilmektedir. 

> Eğer lisans, en fazla bekleyen sürüm sayısını belirtmiyorsa, 3 bekleyen sürüm olarak kodlanmış bir sınır kullanılmaktadır.  
> — Giriş bölümünden

### Uç Noktalar

Tüm mevcut uç noktaların listesi için lütfen `ayrıntılı arka uç tasarım belgelerine` bakın. 


Uç nokta detayları

Uç noktalar, içerik sürümleri yönetimi için kritik öneme sahiptir. Geliştiricilerin erişim ihtiyacı olduğunda, bu uç noktaları etkili bir şekilde kullanmaları önemlidir.

