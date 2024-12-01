---
title: Denetim Kayıtları
description: Denetim Kayıtları, Admin API seviyesindeki tüm kullanıcı eylemleri geçmişini görüntüleme yolu sağlar. Bu kılavuz, denetim kayıtlarının nasıl çalıştığını ve yapılandırılabileceğini açıklamaktadır.
keywords: [denetim kayıtları, admin API, olay yönetimi, yapılandırma, etkinlik günlüğü]
---

# Denetim Kayıtları

## Özet

Denetim Kayıtları, Admin API seviyesindeki tüm kullanıcı eylemleri geçmişini görüntüleme yolu sağlar. Bu, girişler (yayın eylemleri dahil), medya (kategorileri dahil), kullanıcılar, admin kullanıcılarının giriş ve çıkışları, bileşenler, roller ve izinler ile ilgili eylemleri içerir; **tüm varsayılan olayların listesini** [buradan](https://github.com/strapi/strapi/blob/main/packages/core/admin/ee/server/services/audit-logs.js#L9) görebilirsiniz.

---

## Arka Uç Tasarımı

Denetim Kayıtları özelliği, **eventHub'dan yararlanmak** için oluşturulmuştur. Servisi ve temel kodunu `packages/core/admin/ee/server/services` yolunda bulabilirsiniz.

### Denetim Kayıtları Yerel Sağlayıcı

Denetim kayıt verilerini kaydetmek için, veritabanı ile etkileşimde bulunan bir Denetim Kayıtları yerel sağlayıcısını kullanıyoruz. Bu sağlayıcı, `register` fonksiyonu döndürmelidir ve bu fonksiyon, `saveEvent`, `findMany`, `findOne` ve `deleteExpiredEvents` işlemlerini yöneten fonksiyonların bulunduğu bir nesne döndürmelidir.

### İçerik Türleri

#### strapi_audit_logs

Bu içerik türü, tüm denetim kayıtlarını saklar. İzin verilen her olay için, denetim kayıtları içerik türünde bir giriş kaydediyoruz.

:::tip
Her olay için denetim kayıtlarını düzgün saklamak, sistem güvenliği açısından çok önemlidir.
:::

### Tüm Olaylara Abone Olma

Denetim Kayıtları özelliği, **uygulamadaki tüm olayları dinlemek için** `EventHub` üzerinde bir abone ekler. Ancak, her olayı denetim kayıtlarında saklamıyoruz; yalnızca varsayılan olanları saklıyoruz (servis dosyasındaki defaultEvents dizisine bakın).

### Saklama Günleri

Denetim Kayıtlarımızdaki olay sayısı önemli ölçüde artabileceğinden, her gece yarısı, saklama süresinden daha eski logları silmek için bir günlük iş çalıştırıyoruz.

Varsayılan olarak, saklama süreleri 90 gün olarak ayarlanmıştır, ancak bu değer değiştirilebilir. Kurumsal kendi barındırılan projeler için kullanıcılar, bir yapılandırma değişkeni (admin.auditLogs.retentionDays) ayarlayabilirler ve bu değeri kullanabilirler.

Bulut projeleri için saklama günleri lisans tarafından belirlenir. Bir bulut projesinde kullanıcılar, yapılandırmada özel saklama günleri ayarlayabilirler, ancak bu değer lisans tarafından tanımlanan saklama günlerini aşamaz.

:::info
Her iki durumda da, özel saklama günleri ayarlamak istiyorsak, Admin Paneli API yapılandırma dosyasını (`./config/admin.js`) değiştirebiliriz. Admin Paneli için tüm olası seçenekler ve diğer yapılandırmaları [belgelendirme sayfasında](https://docs.strapi.io/dev-docs/configurations/admin-panel#available-options) bulabilirsiniz.
:::

### Denetim Kayıtları Formatı

Her Denetim Kaydı aşağıdaki formata sahiptir:

```typescript
type Event {
  action: string, // Olayın adı
  date: Date, // Olayın gerçekleştiği zaman
  userId: number, // Olayı tetikleyen kullanıcının ID'si
  payload?: Object, // Olayla ilgili ek bilgi
};
```

> Bu bilgileri nasıl elde ettiğimizi anlamak için, bir olayı Event Hub ile nasıl yayımladığımızı bilmemiz gerekiyor.  
> — Denetim Kaydı Eğitimi

Bir olayı yayımlamak için aşağıdaki fonksiyonu kullanıyoruz: (EventHub hakkında daha fazla bilgi için [buraya](https://docs/core/strapi/event-hub) tıklayın)

```typescript
strapi.eventHub.emit(name: Pick<Event, 'name'>, payload: Pick<Event, 'payload'>);
```

Öncelikle, olayın admin isteklerinden geldiğini ve [varsayılan olaylar](https://github.com/strapi/strapi/blob/main/packages/core/admin/ee/server/services/audit-logs.js#L9) listemizde olduğunu kontrol ediyoruz; ardından, Denetim Kaydımızı oluştururken, yayımlanan bu olaydan eylem ve yükü alıyoruz. Burada ilk argüman eylem veya olay adı, ikinci argüman ise yük. Kullanıcıyı requestContext üzerinden elde ediyoruz.