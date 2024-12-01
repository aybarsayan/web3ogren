---
title: Giriş
description: Bu bölüm, Strapi'de yapılandırma dosyalarının nasıl yüklendiği ve kullanılmaları gerektiğine dair genel bir bakış sunmaktadır. Yapılandırma yüklemesi ve temel yapılandırma adları hakkında önemli bilgiler içermektedir.
keywords: [Strapi, yapılandırma, yükleme, temel ayarlar, eklentiler]
---

# Yapılandırma

Bu bölüm, Strapi'de yapılandırma dosyalarının nasıl yüklendiğine ve nasıl kullanılmaları gerektiğine dair bir genel bakış sunmaktadır.

## Yapılandırma Yükleme

Yapılandırma yükleme, Strapi'nin başlangıç aşamasında (sinyal işleyicileri ayarlandıktan sonra) yaptığı ilk işlem olup, çünkü Strapi'nin başlangıç sürecinin çoğu yapılandırmadan gelen değerlere bağlıdır.

> **Önemli Not**: Bu, yapılandırma yüklemesinin Strapi bir günlük oluşturulmadan önce gerçekleştiği anlamına gelir. Bu nedenle, yapılandırmadan kaynaklanan herhangi bir hata veya uyarı maalesef `console`'a yazdırılmalıdır.  
> — Strapi Belgeleri

:::tip
Şu anda, teorik olarak, `strapi` nesnesine bağlı olmayan bazı yapılandırma dosyalarını tanımlayabiliriz ve burada günlük ayarları sağlayabiliriz.
:::

Şu anda, Strapi, bir projenin `./config` dizinindeki her `.js` ve `.json` dosyasını doğrudan Strapi yapılandırma nesnesine yüklemektedir. Yani, `./config/myconfig.js` adında bir dosya varsa, bu otomatik olarak yüklenecek ve `strapi.config.get('myconfig')`'den erişilebilir olacaktır.

(HENÜZ UYGULANMADI) Strapi v5'ten itibaren, `STRAPI_` ortam alan adından tanımlı her değeri yapılandırmaya yükleyecektir; alt çizgi (_) nesne ayırıcı olarak kullanılacaktır. Örneğin, `STRAPI_ADMIN_APP_KEYS=abcd,efg` tanımlarsanız, `strapi.config.get('admin.app.keys')` üzerinden `['abcd', 'efg']` olarak erişilebilir olacaktır.

Bu özellik ile beraber, tüm yapılandırma değerleri **büyük/küçük harf duyarsız** hale gelecektir. Yani, `strapi.config.get('admin.App.Keys')` ifadesi `strapi.config.get('admin.app.keys')` ile aynı değeri döndürecektir.

## Temel Strapi Yapılandırmaları

Aşağıdakiler 'temel' Strapi yapılandırmaları olarak kabul edilmektedir ve her dosyanın ne içerdiğine dair bir tanım verilmiştir, böylece yeni ayarlar uygun yere yerleştirilebilir.

Bir Strapi yapılandırma dosyası ya bir nesne ya da bir nesne döndüren bir işlevi dışa aktarmalıdır.

> **UYARI**: Bazı yapılandırma dosyalarında, örneğin ara katmanlar gibi, bir dizi dönebilir ve bazı dosyalar bir işlev dışa aktaramayabilir. Kullanımdan önce lütfen bu durumu kontrol edin ve istisnalar bulunduğunda bu belgeleri güncelleyin.

(HENÜZ UYGULANMADI) Strapi v5'ten itibaren, temel yapılandırmaların içeriği sıkı bir şekilde tanımlanacak ve Strapi tarafından oluşturulmayan değerlere izin verilmeyecektir; yani, tanınmayan değerlere bir hata fırlatılacaktır. Kullanıcı katkıları ayrı yapılandırma alan adlarına gitmelidir.

### Temel Yapılandırma İsimleri

#### admin

Strapi yönetim paneli ile ilgili ayarları tanımlar; örneğin, `yarn develop` için 'oto açılma' seçeneği.

#### server

Strapi arka uç sunucusuyla ilgili ayarları tanımlar; örneğin 'host' ve 'port'.

#### database

Veritabanı yapılandırma seçeneklerini tanımlar.

> **NOT**: Bunun çoğu Knex tarafından tanımlanmıştır, bu nedenle eklediğiniz seçeneklerin uyumlu olduğundan veya uygun konuma yerleştirildiğinden emin olun.

#### api

İçerik API yapılandırması; örneğin, sorgulamada mevcut `limit` değerini ayarlamak için 'rest.maxLimit' seçeneği.

#### features

Gelecek özellikleri etkinleştirmek ve yapılandırmak için geçerli olan özellik bayrakları; bu özellikler, varsayılan olarak etkinleştirilemeyecek şekilde veya kamuya açık kararlı sürüm için hazır olmaması durumunda deneysel özelliklerdir.

#### plugins

Her kök düzey değerin bir eklentinin kimliği olduğu eklenti yapılandırmalarını içerir; örneğin, 'users-permissions'.

> **ÖNEMLİ**: Eklentiler, `plugins.` alanına diğer Strapi yapılandırmaları gibi yüklenmez, çünkü modül yükleme sırasında yüklenirler. Bu, aşağıdaki örnek `plugins.js` dosyasında, değerlerin örneğin `strapi.config.get('plugin::graphql.endpoint')` üzerinden erişilebileceği anlamına gelir.

```javascript
module.exports = () => ({
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',

      defaultLimit: 25,
      maxLimit: 100,

      apolloServer: {
        tracing: true,
      },
    },
  },
});
```

> **NOT**: Bu yapılandırma, kullanıcı ve eklenti anahtarlarını içerdiğinden ve Strapi henüz tanımları uzatma yöntemini sağlamadığından, bu yapılandırma kesin bir şekilde tiplenmemiştir ve ortam değişkenlerinden yüklenmeyecektir.

#### middlewares

Ara katmanların yapılandırması.

> **NOT**: Şu anda dizi olarak tanımlanan tek yapılandırmadır, dolayısıyla çok gevşek bir şekilde tiplenmiştir. Gelecek iyileştirmeler, tüm yerleşik Strapi ara katmanlarını güçlü bir şekilde tiplemek için planlanmaktadır.

### Tipler

Çoğu temel yapılandırma için tipler belirlenmiştir; ancak bunlar şu anda kamuya açık değildir. `packages/core/types/src/types/core/config` içinde bulunabilirler.

Bir yapılandırma seçeneği Strapi'ye eklendiğinde, aynı zamanda ilgili yapılandırma dosyası için tiplere de eklenmelidir (ve ortam değişkeni yükleme özelliği kullanılabilir olduğunda, bunun için string, integer, stringArray gibi bir ayrıştırıcı tanımlanmalıdır).

Strapi v5'te, bunlar şu amaçlar için kullanılacaktır:

- Proje yapılandırmasını tiplendirmeyi destekleyen kullanıcıya yönelik yapılandırma fabrikaları
- Ortam değişkeni yapılandırma yükleme yapısının doğruluğunu doğrulamak için temel yapılandırma dosyası ayrıştırıcılarının yapılandırmasını doğrulamak.

### Yapılandırma dosyası sınırlamaları

Strapi v5'te, `STRAPI_` öneki ile başlayan ortam değişkenleri otomatik olarak Strapi yapılandırmasına yüklenecektir. Bu nedenle, çakışmaları önlemek amacıyla bazı adlandırma sınırlamaları eklenmiştir.

- Uzantısı olmayan dosya adları büyük/küçük harf duyarsız benzersiz olmalıdır (yani, `ADMIN.js` ve `admin.js` veya `admin.js` ve `admin.json` arasında sadece bir dosya olmalıdır)
- Tüm temel Strapi yapılandırmaları ve `packages/core/core/src/configuration/config-loader.ts` içinde bulunan sınırlı adlar kullanılmamalıdır **önyükleme olarak bile**.

> **ÖNEMLİ**: Herhangi bir yeni temel Strapi yapılandırmasının da `a-z0-9` ile sınırlı olması gerekir, özel karakter kullanılmamalıdır! Bu, ortam değişkeni yüklenmesine izin vermek için gereklidir. Aynı kısıtlama kullanıcı yapılandırma dosyalarına uygulanmaz, ancak takip edilmezse bu dosya ortam değişkeni otomatik yüklemesini desteklemeyecektir.

### Temel nitelik adı sınırlamaları

Strapi yapılandırması için tanımlanan yapılandırma seçenekleri yalnızca `a-zA-Z0-9` içermelidir! Eğer bir anahtar özel bir karakter, alt çizgi veya tire ile kullanılırsa, bu ortam değişkenlerinden yapılandırılabilir olmayacak ve insanlar bunun kötü tasarlandığı için kızacaktır. Lütfen tüm mevcut Strapi yapılandırma anahtarları gibi **camelCase** kullanın. Şu anda Strapi yapılandırmalarında tanımlanan herhangi bir özel karakter yoktur, sadece `plugins.js`'deki 'users-permissions' istisnasıdır; lütfen bunu bu şekilde tutun.