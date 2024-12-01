---
description: Javascript'te önbellekleme yöntemleri ve uygulamaları hakkında bilgi veren bir kaynak. Bu içerik, önbellek mekanizmaları ve Keyv kullanarak önbellek uygulamalarını ele almaktadır.
keywords: [Javascript, önbellekleme, Keyv, Cacheable, veri depolama, performans]
title: Javascript'te Önbellekleme Uygulama Yöntemleri
---

# Javascript'te Önbellekleme Uygulama Yöntemleri

## Önbellek Nedir?
Önbellek, bir veri kümesinin alt kümesini depolayan, yüksek hızlı ve geçici bir veri depolama katmanıdır. Bu, verilerin birincil depolama konumundan daha hızlı bir şekilde alınmasını sağlar. Önbellekleme, **daha önce alınmış verilerin verimli bir şekilde yeniden kullanılmasına olanak tanır**.

:::tip
Önbellekleme, uygulamanızın performansını artırmak için etkili bir yöntemdir. Verilerinizi önbelleklemek, daha hızlı erişim sağlar ve kullanıcı deneyimini geliştirir.
:::

## Keyv'de Önbellek Desteği
Önbellekleme varsayılan olarak bellek içinde çalışır. Ancak, kullanıcılar bir bağlantı dizesi ile başlatılmış veya Map API'sini uygulayan herhangi bir depolama için bir Keyv depolama adaptörü de kurabilir.

## Cacheable Üzerinden Keyv'de Önbellek Desteği

Keyv'i, çoklu depolama arka uçlarını destekleyen ve önbellekleme için basit, tutarlı bir API sağlayan, **Keyv üzerinde inşa edilmiş yüksek performanslı bir katman 1 / katman 2 önbellekleme çerçevesi** olan [Cacheable](https://npmjs.org/package/cacheable) kullanarak önbellek uygulamak için kullanabiliriz.

### Örnek - Bir Modüle Önbellek Desteği Eklemek

1. **Kullanacağınız depolama adaptörünü yükleyin**, bu örnekte `@keyv/redis`:
   ```sh
   npm install --save @keyv/redis cacheable
   ```
2. **Önbelleğin bir Keyv örneği ile kontrol edildiği Modülü tanımlayın**:
   ```js
   import { Cacheable } from 'cacheable';
   import KeyvRedis from '@keyv/redis';

   // varsayılan olarak katman 1 önbelleği bellek içindedir. Katman 2 önbelleği eklemek istiyorsanız, KeyvRedis kullanabilirsiniz
   const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
   const cache = new Cacheable({ secondary, ttl: '4h' }); // varsayılan yaşam süresi 4 saat olarak ayarlandı
   ```
  
:::info
Yukarıdaki kod parçacığında `ttl` (time-to-live) parametresi, önbellekteki verilerin ne kadar süreyle saklanacağını belirler. Bu süre dolduğunda, veriler otomatik olarak silinir.
:::

---

Bu yönergeleri takip ederek JavaScript uygulamanızda etkin bir şekilde önbellekleme mekanizmaları oluşturabilirsiniz. Önbelleklemenin sağladığı avantajları göz önünde bulundurarak, uygulama performansınızı önemli ölçüde artırabilirsiniz.

:::note
Unutmayın ki verilerinizi önbelleğe almak, yalnızca okunabilir veriler için en iyi sonucu verir. Dinamik değişken verilere dikkat etmelisiniz.
:::