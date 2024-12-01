---
title: Option on_record
description: Option "on_record" bir kaydı oluşturmadan önce değiştirme imkanı sunar. Bu seçenek, kayıt düzeyinde çalışarak kayıtların değiştirilmesi ve filtrelenmesi süreçlerini yönetir.
keywords: ['csv', 'parse', 'options', 'transform', 'alter', 'filter', 'field']
---

# Option `on_record`

`on_record` seçeneği, kayıtları **değiştirme** ve **filtreleme** imkanı sunar. Kayıt ve bir bağlamı argüman olarak alan ve yeni değiştirilmiş kaydı veya kayıt filtrelenmesi gerekiyorsa hiçbir şey döndüren bir işlev bekler.

* **Tür**: `function`
* **Opsiyonel**
* **Varsayılan**: `undefined`
* **Versiyon**: 4.7.0
* **İlgili**: `cast`, `info` &mdash; `Mevcut Seçenekler` bölümüne bakınız

Bu seçenek kayıt düzeyinde çalışır. **Alan düzeyindeki** dönüşümler için uyarlanan `cast` seçeneğini tamamlar. Ayrıca, `stream-transform` paketi, asenkron yürütme ve eşzamanlı kontrol ile kayıt ve kayıt akışı üzerinde daha gelişmiş kontrol sağlar.

## Kullanım durumları

Bu seçeneği, kayıtlar üzerinde filtreleme, zenginleştirme ve herhangi bir dönüşüm uygulamak için kullanın.

## Kullanım

Seçenek, iki argümanla çağrılan bir işlev alır: giriş kaydı ve bağlam. Dönüş değeri, yeni kayıt ya da `null` veya `undefined` döndüğünde filtrelenmiş kayıttır.

### Kayıtları Değiştirme

:::tip
Kayıtları değiştirmenin en iyi yolu, belirli alanları hedef alarak ve gerektiğinde yeniden sıralamaktır.
:::

[değiştirme örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.on_record.alter.js) içerisinde, her kayıt için **ikinci alan çıkarılır** ve diğer iki alan yeniden sıralanır.

`embed:packages/csv-parse/samples/option.on_record.alter.js`

### Kayıtları Filtreleme

:::info
Filtreleme işlemleri, istenmeyen kayıtları çıkarmak için kullanılır.
:::

[filtreleme örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.on_record.filter.js) içerisinde, işlev **ikinci kayıt** için `null` döner ve bu kayıt sonucu filtreler.

`embed:packages/csv-parse/samples/option.on_record.filter.js`

## Tutarsız alan sayısı ile başa çıkma

Tutarsız alan sayısına sahip kayıtları işlemek mümkündür. `relax_column_count` seçeneği ile birlikte kullanıldığında, `on_record` seçeneği çağrılır, ancak `skip_records_with_error` etkinleştirilmişse çağrılmaz.

`relax_column_count` dökümantasyonu daha fazla bilgi ve örnekler sunmaktadır.

## Hata davranışı

`on_record` fonksiyonu içerisinde fırlatılan hatalar, diğer hatalar gibi yakalanır ve işlenir. 

> **Not:** `skip_records_with_error` seçeneği tarafından dikkate alınmayacaktır. `skip_records_with_error` içindeki "hata" ifadesi, bir ayrıştırma hatası olarak yorumlanmalıdır ve kullanıcı tarafından fırlatılan bir hata olarak değil.