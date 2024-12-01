---
title: Seçenek dönüşümü
description: Bu belge, belirli veri türleri için özel dönüşüm tanımlarını içermektedir. Dönüşüm seçenekleri, değerlerin türlerine göre dönüşümünü sağlamak amacıyla çeşitli fonksiyonlar tanımlar. Aşağıda, desteklenen türler ve varsayılan davranışlar hakkında bilgi bulabilirsiniz.
keywords: ['csv', 'stringify', 'options', 'cast', 'data transformation', 'type conversion']
---

# Seçenek `dönüşüm`

`dönüşüm` seçeneği, değerleri türlerine göre dönüştürmek için birden fazla fonksiyonu tanımlar. Bu, anahtarların **tür** temsil ettiği ve ilişkili değerlerinin dönüşüm fonksiyonları olduğu bir nesnedir.

Aşağıdaki türler desteklenmektedir:

* `bigint`  
  `BigInt` değerlerini dönüştürmek için özel fonksiyon.
* `boolean`  
  `boolean` değerlerini dönüştürmek için özel fonksiyon.
* `date`  
  `Date` değerlerini dönüştürmek için özel fonksiyon.
* `number`  
  `Number` değerlerini dönüştürmek için özel fonksiyon.
* `object`  
  `Object` literallerini dönüştürmek için özel fonksiyon.
* `string`  
  `String` değerlerini dönüştürmek için özel fonksiyon.

Fonksiyonlar 2 argümanla çalıştırılacaktır:

* `değer` (herhangi biri)  
  Dönüştürülen alanın değeri.
* `bağlam` (nesne)  
  Bir bağlam nesnesi.

Kabul edilen dönüş değerleri:
* `null`, `undefined`  
  Alan boş olacaktır.
* `string`  
  Alanın string değeri.
* `object`  
  Alanın `değer` özelliğini içeren bir nesne, ayrıca alan seviyesinde global seçenekleri geçersiz kılma gereği durumunda uygulanan seçenekler.

## Bağlam

:::tip
Bağlam nesnesinin kullanımı, dönüşüm fonksiyonu içinde belirli bilgileri sağlar ve işlem sırasında önemli bir rol oynar.
:::

Bağlam nesnesi kullanıcı tarafından sağlanan fonksiyonun ikinci argümanı olarak geçilir. Aşağıdaki özellikleri içerir:

* `sütun` (sayı|string)  
  Sütun seçenekleri tanımlanmışsa sütun adı veya sütun adı keşfedilmişse ya da alan pozisyonudur.
* `başlık` (boolean)  
  Sağlanan değerin bir başlık parçası olup olmadığını belirten bir boolean.
* `indeks` (sayı)  
  Alan pozisyonu 0'dan başlar.
* `kayıtlar` (sayı)  
  Tamamıyla işlenmiş kayıt sayısı.

## Alan seviyesinde seçenekler

Bir nesne döndürerek `dönüşüm` fonksiyonu, alan seviyesinde varsayılan seçenekleri geçersiz kılabilir. Alanın değeri `değer` özelliğinde sağlanmalıdır. Desteklenen seçenekler: `delimiter`, `escape`, `quote`, `quoted`, `quoted_empty`, `quoted_string`, `quoted_match` ve `record_delimiter`.

Aşağıdaki [`dönüşüm` örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.cast.js) alanın alıntı yapılmasını devre dışı bırakır, bu da `dönüşüm` fonksiyonunun sorumluluğundadır:

`embed:packages/csv-stringify/samples/option.cast.js` 

_Bu örneği `node samples/option.cast.js` komutuyla çalıştırın._

---

## Varsayılan davranış

### boolean

> `true` değeri `1` stringine dönüştürülürken, `false` değeri boş bir stringe dönüştürülür. Varsayılan uygulama:
> 
> ```js
> function(value){
>   return value ? '1': ''
> }
> ```
> — Önemli Not

### date

> Date nesneleri zaman damgalarına dönüştürülür. Varsayılan uygulama:
> 
> ```js
> function(value){
>   return '' + value.getTime()
> }
> ```
> — Önemli Not

### number

> Sayılar string'e dönüştürülür. Varsayılan uygulama:
>
> ```js
> function(value){
>   return '' + value
> }
> ```
> — Önemli Not

### object

> Nesne literalleri JSON stringlerine dönüştürülür. Varsayılan uygulama:
>
> ```js
> function(value){
>   return JSON.stringify(value)
> }
> ```
> — Önemli Not

### string

> String'ler herhangi bir değişiklik olmadan döndürülür. Varsayılan uygulama:
>
> ```js
> function(value){
>   return value
> }
> ```
> — Önemli Not

---

## Tarih dönüştürme

Bu [`dönüşüm` örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.cast.js) tarih nesnelerini ISO 8601 tarihlerine dönüştürür.

`embed:packages/csv-stringify/samples/option.cast.date.js`

_Bu örneği `node samples/option.cast.date.js` komutuyla çalıştırın._