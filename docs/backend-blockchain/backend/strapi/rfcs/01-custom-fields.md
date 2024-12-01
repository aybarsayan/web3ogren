---
title: Özel alanlar
description: Özel alanlar, mevcut Strapi türlerinin girdilerini değiştirmek için bir yol sağlar ve içerik düzenleme deneyimini iyileştirir. Bu sayfada özel alanların tasarımı, paketlenmesi ve kullanımına dair detaylar yer almaktadır.
keywords: [özel alanlar, Strapi, içerik yönetimi, eklentiler, veri tipleri, admin panel]
---

# Özel alanlar

## Özet

Özel alanlar, mevcut Strapi türlerinin girdilerini değiştirmek için bir yol sağlar ve içerik düzenleme deneyimini iyileştirir.

## Ayrıntılı tasarım

Bir özel alanın hem admin panelinde hem de sunucuda kaydedilmesi gerekir.

### Sunucu

Bir özel alanı sunucuda kaydetmek için [belgelere](https://docs.strapi.io/developer-docs/latest/development/custom-fields.html#registering-a-custom-field-on-the-server) bakın.

:::info
Özel alan, sunucu [kaydetme yaşam döngüsü](https://docs.strapi.io/developer-docs/latest/developer-resources/plugin-api-reference/server.html#register) sırasında Strapi'ye eklenecektir.
:::

`type: customField`, bir içerik tipi veya bileşeni için schema.json'da kaydedildiğinde, uygulama başlatıldığında ve tüm özel alanlar yüklendikten hemen sonra [convertCustomFieldType fonksiyonu](https://github.com/strapi/strapi/blob/a8f807d27ebc9c8b9b335e885154a06c60a896ae/packages/core/strapi/lib/Strapi.js#L395) çağrılarak altında yatan Strapi veri tipine dönüştürülür.

### Admin

Bir özel alanı admin paneline kaydetmek için [belgelere](https://docs.strapi.io/developer-docs/latest/development/custom-fields.html#registering-a-custom-field-in-the-admin-panel) bakın.

:::tip
Bir içerik tipi veya bileşen üzerinde kaydedilen özel alan, [formatAttributes fonksiyonu](https://github.com/strapi/strapi/blob/33debd57010667a3fc5dfa343a673206cfb956e1/packages/core/content-type-builder/admin/src/components/DataManagerProvider/utils/cleanData.js#L97-L100) aracılığıyla kaydetmeden hemen önce, altında yatan veri tipinden `type: customField` tipine dönüştürülecektir.
:::

### Paketleme

Bir özel alan, ya bir Strapi uygulamasında ya da bir Strapi eklentisinde kaydedilebilir. Ancak yalnızca npm üzerinde paket yayınlayarak eklentiler aracılığıyla paylaşılabilirler.

### Örnekler

- [Renk Seçici](https://github.com/strapi/strapi/blob/main/packages/plugins/color-picker/)
- [Shopify eklentisi](https://github.com/WalkingPizza/strapi-plugin-shopify-fields/)

---

## Dezavantajlar

- Strapi'de özel bir veritabanı türü oluşturma yeteneği henüz sunulmamaktadır.
- İçerik Tipi Yapıcı'da bir özel alanın temel ve gelişmiş formlarını genişletirken, özel giriş bileşenlerini içe aktarmak henüz mümkün değildir.
- Özel alanların ilişki, bileşen, dinamik alan ve medya türlerini kullanmalarına izin verilmiyor.

## Alternatifler

Özel alanlar için özel paketler yapmayı düşünüyoruz ancak:

- Özel alanların eklenti API'sinden diğer özelliklere erişim sağlama yeteneği olmayacak. Bu her zaman gerekli olmasa da, özel alanların ihtiyacı olduğunda daha gelişmiş davranışlar uygulamasını sağlar. **Örneğin,** bir özel alan gerektiğinde enjekte alanlarını da kullanabilir.
- Yeni bir özel alan türü paketi tanıtmak, Strapi'de yeni bir yükleyici ve pazar yerinde yeni bir bölüm ile inceleme süreçleri gerektirecekti, bu da özelliği göndermeyi daha karmaşık hale getirecekti.
- Bir özel alan için basit bir eklenti API'sinin gereksiz karmaşıklığını azaltmak, yalnızca bir özel alan için gerekli dosyaları oluşturan yeni bir eklenti jeneratörü ekleyerek sağlanabilirdi.

---

## Kaynaklar

- [Özel Alanlar Sayfası](https://strapi.io/custom-fields)
- [Belgeler](https://docs.strapi.io/developer-docs/latest/development/custom-fields.html)
- [teknik olmayan RFC](https://github.com/strapi/rfcs/pull/40)
- [teknik RFC](https://github.com/strapi/rfcs/pull/42)