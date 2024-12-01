---
title: Option max_record_size
description: Option "max_record_size" kayıtların maksimum karakter sayısını sınırlayan bir ayardır. Bu özellik, veri güvenliğini artırmak ve bellek yönetimini optimize etmek amacıyla kullanılmaktadır.
keywords: ['csv', 'parse', 'options', 'max_record_size', 'buffer', 'overflow', 'security']
---

# Option `max_record_size`

`max_record_size` seçeneği, bir istisna oluşmadan önce alanda ve satırda bulunması gereken maksimum karakter sayısına bir sınır koyar.

* **Tip:** `number`
* **İsteğe bağlı**
* **Varsayılan:** `0` (sınırsız)
* **Versiyon:** 4.0.0'dan itibaren

:::info
Bir dönüştürülebilir dize bir tamsayıya dönüştürülecek ve varsayılan olarak etkin değildir. 4.0.0 versiyonundan beri mevcuttur ve daha önce "max_limit_on_data_read" olarak adlandırılmıştır.
:::

## Kullanım Durumları

Bu özellik, yanlış bir `delimiter` veya `record_delimiter` karşısında koruma sağlar. Ayrıca, kontrolsüz bir kaynaktan gelen bir CSV veri kümesinin iç bellek alanını doldurmasını önler.

> **Key Takeaway:** Bu özellik, veri okuma işlemleri sırasında ortaya çıkabilecek sorunları önlemek için oldukça önemlidir.
> — Duyu Bilgisi

## Örnek

Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.max_record_size.js), "Max Record Size: record exceed the maximum number of tolerated bytes of 10 on line 2" mesajıyla bir hata oluşturacaktır çünkü ikinci kayıt 10 karakterden daha uzundur.


Örnek Kodu Görüntüle

```javascript
// embed:packages/csv-parse/samples/option.max_record_size.js
```

