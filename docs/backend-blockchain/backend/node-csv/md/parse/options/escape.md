---
title: Seçenek kaçışı
description: Alıntı ve kaçış karakterlerini alıntılı alanlar içinde kaçırmak için "kaçış" seçeneği. Bu seçenek, kullanıcılara CSV verilerini işlemede esneklik sağlar.
keywords: ['csv', 'parsing', 'seçenekler', 'kaçış', 'alıntı', 'karakter', 'özelleştirme']
---

# Seçenek `kaçış`

`kaçış` seçeneği, **kaçış karakterini** yalnızca bir karakter/byte olarak belirler. Bu, yalnızca alıntılı alanlar içindeki alıntı ve kaçış karakterlerine uygulanır.

Varsayılan değer `"` (çift tırnak) olarak ayarlanmıştır; hiçbir seçenek sağlanmadığında ve değer `undefined` veya `true` olduğunda. `null` ve `false` değerleri, kaçışı devre dışı bırakır.

* Tür: `Buffer|string|null|boolean`
* İsteğe bağlı
* Varsayılan: `"`
* Sürüm: 0.0.1

## Varsayılan davranış

:::tip
Varsayılan davranışları anlamak, seçeneklerin nasıl kullanılacağını daha iyi kavramanızı sağlar.
:::

[varsayılan örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.escape.default.js), `kaçış` seçeneğini beyan etmez. Bu, varsayılan olarak `"` karakteri ile etkinleşir. Bunun yalnızca bir alıntılı alanda uygulandığını unutmayın.

`embed:packages/csv-parse/samples/option.escape.default.js`

## Özel davranış

:::info
Kaçış karakterinin özelleştirilmesi, belirli verilerle çalışırken önemli avantajlar sunabilir.
:::

[özel örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.escape.custom.js), varsayılan davranışı değiştirerek kaçış karakterini `\` (ters eğik çizgi) olarak ayarlamaktadır.

`embed:packages/csv-parse/samples/option.escape.custom.js`

:::warning
Dikkat: Özelleştirilen kaçış karakterinin, verilerinizde mevcut olup olmadığını kontrol etmek önemlidir. Aksi takdirde, beklenmeyen sonuçlar ortaya çıkabilir.
:::