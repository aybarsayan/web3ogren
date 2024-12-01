---
title: 'Başlangıç Seçeneği'
description: 'Başlangıç "from" seçeneği, istenen kayıt sayısından itibaren kayıtları işler. Bu seçenek kullanılarak, belirli bir başlangıç noktasından itibaren nihai verilerin analizi yapılabilir.'
keywords: ['csv', 'parse', 'seçenekler', 'from', 'count', 'kayıtlar', 'bilgi']
---

# Seçenek `from`

`from` seçeneği, istenen kayıt sayısından itibaren kayıtları işler. Sayım **1**'den başlar; örneğin, ilk kaydı iletmek için **1** (ve 0 değil) sağlar.

* Tür: `number`
* Dönüştürme: `string`'den `number`'a
* Opsiyonel
* Varsayılan: `1`
* Doğrulama: pozitif tam sayı
* Sürüm: 4.0.0
* İlgili: `info`  
`from_line`, `to` &mdash; `Mevcut Seçenekler` sayfasına bakınız.

:::tip
Dikkat edilmesi gereken önemli bir nokta, **from** seçeneğini kullanmadan önce verinin doğru bir şekilde analiz edilmesidir.
:::

## Çıkarsanan sütun adları

`column` seçeneği aktif olduğunda, ilk kayıt başlık olarak kabul edilir. Bir kayıt olarak sayılmaz; bu nedenle, ilk kayıt özellik adlarını almak için kullanılır ve sayım bir sonraki kayıttan başlar.

> Bu [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.from.js), sütun adlarını belirlemek için ilk `a,b` kaydını okur, sonraki kaydı atlar ve sonrasında kayıtları döndürür.  
> — Örnek Kodu Hakkında


Daha Fazla Bilgi

```javascript
// Örnek kod
const parse = require('csv-parse');
const fs = require('fs');

fs.createReadStream('input.csv')
  .pipe(parse({ from_line: 2 }))
  .on('data', function (row) {
    console.log(row);
  });
```

Bu kod parçası, `input.csv` dosyasını 2. satırdan itibaren okumaya başlar.


`embed:packages/csv-parse/samples/option.from.js`