---
title: Arka Uç Tasarımı
description: İçerik Yayınları arka ucu, yayın ve yayın eylemi oluşturma süreçlerini detaylandıran bir rehberdir. Kullanıcılar, yayının durumunu ve etkileşimde bulunma yöntemlerini öğrenebilir.
keywords: [arka uç, içerik yayınları, teknik tasarım, yayın oluşturma, API, Strapi]
---

Tüm arka uç kodları şurada bulunabilir:

```
 packages/core/content-releases/server
```

## İçerik Türleri

İçerik-yayınları eklentisi iki gizli içerik türü oluşturur.

### Yayın

> `Yayın` içerik türü, bir yayına ve onunla ilişkilendirilmiş Yayın Eylemleri hakkında tüm bilgileri saklar. Veritabanında `strapi_releases` olarak kaydedilir. Şeması şurada bulunabilir:

```
packages/core/content-releases/server/src/content-types/release/schema.ts
```

### Yayın Eylemi

> `Yayın Eylemi` içerik türü, taslak ve yayınlamayı etkinleştirilmiş herhangi bir içerik türünden herhangi bir giriş ile ilişkilidir. İlgili bir giriş için gerçekleştirilecek eylemi saklamaktan sorumludur. Veritabanında `strapi_release_actions` olarak kaydedilir.

:::info
v4'te yerleşik çok biçimli ilişkileri kullandık, ancak v5'te `contentType`, `locale` ve `entryDocumentId`’yi Yayın Eylemi şemasında saklayarak eylemler ve girişler arasında "manuel" bir ilişki oluşturduk.
:::

Bu yaklaşım, bir yayın eylemini belirli bir giriş kimliğine değil, bir belge kimliğine bağlamamıza olanak tanır; çünkü giriş kimliği zamanla değişebilir ve güvenilir değildir.

Şeması şurada bulunabilir:

```
packages/core/content-releases/server/src/content-types/release-action/schema.ts
```

---

## Yollar

Yayın ve Yayın Eylemi yolları sadece Yönetici API'sinde erişilebilir.

### Yayın

Yayın yolları şurada bulunabilir:

```
packages/core/content-releases/server/src/routes/release.ts
```

**Tüm yayınları al**:

- yöntem: `GET`
- uç nokta: `/content-releases/`
- parametreler:
  ```ts
  {
    page: number;
    pageSize: number;
  }
  ```

**Bir belge ile/olmaksızın tüm yayınları al**:

- yöntem: `GET`
- uç nokta: `/content-releases/getByDocumentAttached`
- parametreler:
  ```ts
  {
    contentTypeUid: string;
    locale?: string;
    documentId?: string;
    hasEntryAttached?: boolean;
  }
  ```

**Tek bir yayını al**:

- yöntem: `GET`
- uç nokta: `/content-releases/:id`

**Bir yayın oluştur**:

- yöntem: `POST`
- uç nokta: `/content-releases/`
- gövde:
  ```ts
  {
    name: string;
  }
  ```

**Bir yayını güncelle**:

- yöntem: `PUT`
- uç nokta: `/content-releases/:id`
- gövde:
  ```ts
  {
    name: string;
  }
  ```

**Bir yayını sil**:

- yöntem: `DELETE`
- uç nokta: `/content-releases/:id`

**Bir yayını yayımla**:

- yöntem: `POST`
- uç nokta: `/content-releases/:id/publish`

### Yayın Eylemi

**Bir yayın eylemi oluştur**:

- yöntem: `POST`
- uç nokta: `/content-releases/:releaseId/actions`
- gövde:

  ```ts
  {
    type: 'publish' | 'unpublish',
    contentType: string;
    locale?: string;
    entryDocumentId?: string;
  }
  ```

**Bir yayından yayın eylemlerini al**:

- yöntem: `GET`
- uç nokta: `/content-releases/:releaseId/actions`
- gövde:
  ```ts
  {
    page: number;
    pageSize: number;
  }
  ```

**Bir yayın eylemini güncelle**:

- yöntem: `PUT`
- uç nokta: `/content-releases/:releaseId/actions/:actionId`
- gövde:
  ```ts
  {
    type: 'publish' | 'unpublish';
  }
  ```

**Bir yayın eylemini sil**:

- yöntem: `DELETE`
- uç nokta: `/content-releases/:releaseId/actions/:actionId`

---

## Kontrolörler

### Yayın

Yayın içerik türü ile etkileşimde bulunmak için istekleri yönetir.

```
packages/core/content-releases/server/src/controllers/release.ts
```

### Yayın Eylemi

Yayın Eylemi içerik türü ile etkileşimde bulunmak için istekleri yönetir.

## Hizmetler

### Yayın

Yayın CRUD operasyonları için veritabanı ile etkileşimde bulunur.

```
packages/core/content-releases/server/src/services/release.ts
```

### Yayın Eylemleri

Yayın Eylemleri CRUD operasyonları için veritabanı ile etkileşimde bulunur.

```
packages/core/content-releases/server/src/services/release-action.ts
```

### Yayın Doğrulaması

Bir Yayın üzerinde operasyonlar gerçekleştirmeden önce çalıştırılacak doğrulama fonksiyonlarını açığa çıkarır.

```
packages/core/content-releases/server/src/services/validation.ts
```

### Zamanlama

:::warning
Zamanlama hala geliştirilme aşamasındadır, ancak gelecekteki bayraklarla **kendi riskinizle** denemek mümkündür. Zamanlamayı etkinleştirmek için gelecek bayrağı `contentReleasesScheduling`'dir.
:::

Yayınlar için yayın tarihini zamanlamak üzere yöntemleri açığa çıkarır.

```
packages/core/content-releases/server/src/services/scheduling.ts
```

### Yayın durumu güncelleme tetikleyicileri:

Bir yayındaki tüm girişlerin durumunu almak ağır bir işlem olduğundan, her seferinde bir kullanıcının yayına erişmek istediğinde tekrar tekrar çekmiyoruz. Bunun yerine, durumu Yayın İçerik Türü içinde bir alanda saklıyoruz ve sadece durumu değiştiren bir eylem tetiklendiğinde güncelliyoruz. Bu eylemler şunları içerir:

#### Bir yayın oluşturma:

Bir yayın oluşturulduğunda, başlangıçta hiçbir giriş olmadığından durumu otomatik olarak "Boş" olarak ayarlıyoruz.

#### Bir girişi bir yayına ekleme:

Bir giriş bir yayına eklendiğinde, eklenen girişin geçerliliğine bağlı olarak durumu "Hazır" veya "Engellendi" olarak yeniden hesaplıyoruz.

#### Bir yayından bir girişi kaldırma:

Bir yayın içerisinden bir giriş kaldırıldığında, durumu yayının artık "Hazır", "Engellendi" veya "Boş" olup olmadığını belirlemek için yeniden hesaplıyoruz.

#### Bir yayını güncelleme:

Bir yayın güncellendiğinde, güncelleme sırasında gerçekleştirilen eylemlerin geçerliliğine bağlı olarak durumu yeniden hesaplıyoruz.

#### Bir yayını yayımlama:

Yayınlama sürecinde, eğer başarılıysa, durum "Tamamlandı"ya; değilse, "Başarısız" olarak değişir.

#### Girişlerdeki olayları dinleme:

Bir giriş güncellendiğinde veya silindiğinde, o girişi içeren tüm yayınların durumu geçerliliğindeki değişiklikleri yansıtmak üzere yeniden hesaplanır.

---

## Göçler

Her içerik türlerini senkronize ettiğimizde çalıştırdığımız iki göç var.

### `deleteActionsOnDisableDraftAndPublish`

Bir Kullanıcı bir İçerik Türünde Taslak ve Yayını devre dışı bıraktığında, o içerik türüyle ilgili tüm yayın eylemlerini kaldırmak için işlem yaparız.

### `deleteActionsOnDeleteContentType`

Bir İçerik Türü silindiğinde, o İçerik Türünden giriş içeren tüm eylemleri sileriz.

---

## Yaşam Döngüsü Olaylarına Abone Olma

Bir giriş silindiğinde o girişi içeren tüm eylemleri silin.