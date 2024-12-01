---
title: Seçenek ayırıcı
description: Bu doküman, bir kaydın alanları arasındaki ayırıcıyı ayarlamak için `delimiter` seçeneğini açıklamaktadır. Delimiter bir veya birden fazla karakter olabilir ve varsayılan olarak bir virgül kullanılır. Daha fazla bilgi için ilgili seçeneklere başvurabilirsiniz.
keywords: [csv, stringify, options, delimiter, ayırıcı]
---

# Seçenek `delimiter`

`delimiter` seçeneği, bir kaydın alanları arasındaki ayırıcıyı belirler. Bu **bir veya birden fazla** karakter olabilir. Varsayılan değer bir **virgül** `,` dir.

* Tür: `string|Buffer`
* Opsiyonel
* Varsayılan: `","` (bir karakterlik virgül)
* Sürüm: 0.0.1
* İlgili: `record_delimiter`, `quote`, `escape` &mdash; `Mevcut Seçenekler` bölümüne bakın

## Varsayılan davranış

Varsayılan olarak oluşturulan CSV veri setinde alanlar [virgüllerle `,` ayrılmıştır](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.delimiter_single.js):

```javascript
embed:packages/csv-stringify/samples/option.delimiter_single.js
```

:::tip
İlk başta, ayırıcıyı ayarlarken varsayılan değeri kullanmayı düşünün. Bu, en çok yaygın olan kullanımlara uygundur.
:::

## Özel davranış

Bir veya birden fazla karakter, [alan ayırıcısını özelleştirmek](https://github.com/adaltas/node-csv/blob/master/packages/csv-stringify/samples/option.delimiter_multiple.js) için tanımlanabilir:

```javascript
embed:packages/csv-stringify/samples/option.delimiter_multiple.js
```

:::info
Ayırıcıyı değiştirdiğinizde, dosya formatınızı ve uygulamada diğer bölümleri dikkatlice düşünün. Yanlış bir ayırıcı kullanmak, veri entegrasyonunu etkileyebilir.
:::