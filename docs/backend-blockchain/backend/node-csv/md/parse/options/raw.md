---
title: Opsiyon raw
description: "\"Raw\" opsiyonu, ek bağlam bilgileri sağlamak için iki varlık olan info ve record'u oluşturur. Bu belge, `raw` opsiyonunun ayrıntılarını ve kullanımını açıklar."
keywords: ['csv', 'ayrıştır', 'opsiyonlar', 'raw', 'hata ayıklama', 'buffer']
---

# Opsiyon `raw`

`raw` opsiyonu, yalnızca kayıttan ziyade `raw` ve `record` adlı iki varlık oluşturur. `raw` varlığı, orijinal CSV içeriğini ifade eder ve `record` varlığı, ayrıştırılmış dizi veya nesne literali olarak tanımlanır.

**Tür:** `boolean`  
**İsteğe bağlı**  
**Varsayılan:** `false`  
**Sürüm:** 1.1.6  
**İlgili:** `cast`, `info`, `on_record` &mdash; `Mevcut Opsiyonlar` bölümüne bakınız.

Tüm opsiyonlar uyumlu olsa da, üretilen kayıtlar farklı yapılandırmalara sahip olabilir. 

:::tip
Davranışı, `info` opsiyonunun davranışına benzerdir. Her iki opsiyon birlikte kullanılabilir.
:::

## Çıktı

:::info
[`raw` opsiyonu etkinleştirildiğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.raw.js) `true` değeriyle, sonuçlanan kayıtlar `raw` ve `record` varlıklarından oluşur.
:::

> `embed:packages/csv-parse/samples/option.raw.js`  
— Örnek kod

---  
```  
```  
```  
```  
```  
```  