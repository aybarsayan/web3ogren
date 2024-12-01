---
title: Seçenek sütunları
description: Kayıtların nesne olarak sağlandığında özellikler listesini belirleyen sütun seçeneği hakkında bilgi. Bu belgede, sütunları adlandırma, sıralama ve filtreleme yöntemleri ele alınmaktadır.
keywords: [csv, stringify, options, columns, kayıtlar, nesne, diziler]
---

# Seçenek `sütunlar`

`sütunlar` seçeneği, kayıtların alan seviyesinde oluşturulmasını kontrol eder. Örneğin, başlıkları adlandırmak, oluşturulan kayıtlardaki sütunları sıralamak ve sütunları filtrelemek için kullanılır. Kayıtlar nesne ve diziler olarak sağlandığında geçerlidir.

[Teslimat örnekleri](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/test/option.columns.coffee) olarak kapsamlı bir ilham kaynağı, örnekler ve desteklenen özellikler için dikkate alınmalıdır. Ayrıca, sütun adlarını ilk satırda nasıl yazdıracağınızı öğrenmek için `"başlık" seçeneğine` başvurun.

* Tür: `dizi` | `nesne`
* İsteğe Bağlı
* Varsayılan: `tanımsız`
* İlk Eklenme: 0.0.1
* İlgili: `header` &mdash; `Mevcut Seçenekler` kısmına bakınız.

## Kullanım

:::info
`sütunlar` seçeneği `{ 'anahtar': string, 'başlık': string }` nesnelerinin bir dizisi veya sütun adlarının (string) bir dizisi olabilir.
:::

Nesne olarak, `sütunlar` özellikleri ile tanımlanır:

* `anahtar` (string)   
  Giriş kayıtlarında bulunan özelliğin adı; zorunludur.
* `başlık` (string)   
  İlk başlık satırında yazdırılacak değer; `başlık` seçeneği ile birlikte kullanılmalıdır; varsayılan olarak `anahtar`dır.

> Burada bir [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.columns_array_with_objects.js):
> 
> `embed:packages/csv-stringify/samples/option.columns_array_with_objects.js`

Daha kısa bir varyasyon, sütun bileşenlerini string olarak tanımlamaktır. Önceki örnek, [bir sütunu basit bir string olarak](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.columns_array_with_strings.js) tanımlayarak basitleştirilir:

`embed:packages/csv-stringify/samples/option.columns_array_with_strings.js`

## Sıra

Sıra tanımı önemlidir. Oluşturulan kayıtların sırasını yansıtır. Yukarıdaki örnekte sütunlar seçeneğinin sırasını `[ { anahtar: 'b' }, { anahtar: 'a' } ]` olarak tersine çevirmek, oluşturulan CSV verilerini tersine çevirir: `2,1\n`.

Nesne biçimindeki kayıtlar alındığında, tüm sütunları yeniden sıralamak mümkündür. Sütun anahtarları ayrıca ilk kayıtta otomatik olarak keşfedilir, tanımlanmadıkça.

Dizi biçimindeki kayıtlar alındığında, sıralama alan pozisyonlarını yansıtır. Sütunları yeniden sıralamak mümkün değildir, sadece son olanları filtrelemek mümkündür.

## İç içe özellikler

Nesne olarak sağlanan kayıtlarla birlikte, sütun `anahtarı` girdi verilerinin iç içe özelliklerine atıfta bulunabilir. Hem dizi hem de nesne referanslarını destekler.

`embed:packages/csv-stringify/samples/option.columns_nested.js`

## Tanımsız özellikler

:::warning
Bir sütun tanımlanmışsa ancak veri kaynağındaki herhangi bir özellik ile eşleşmiyorsa, değer boş bir dize olacaktır. Veri kaynağı, sütun seçeneğinde tanımlanmayan bir özellik belirtiyorsa, bu özellik basitçe dikkate alınmayacaktır.
:::

Bu bir [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.columns_undefined.js):

`embed:packages/csv-stringify/samples/option.columns_undefined.js`