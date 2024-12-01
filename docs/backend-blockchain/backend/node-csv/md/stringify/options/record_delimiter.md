---
title: Seçenek kayıt_ayırıcı
description: Çıktı akışına byte order mark (BOM) ekleme. Bu seçenek, her kaydı birbirinden ayırmak için kullanılan karakterleri tanımlar. Kullanıcılar, ihtiyaçlarına uygun karakterler belirleyerek çıktı formatını özelleştirebilirler.
keywords: [csv, stringify, options, bom, utf8, unicode, utf16]
---

# Seçenek `kayıt_ayırıcı`

`kayıt_ayırıcı` seçeneği, her kaydı birbirinden ayırmak için kullanılan karakterleri tanımlar.

* Tür: `Buffer`, `string`
* Opsiyonel
* Varsayılan: `\n`
* Sürüm: 0.0.1
* İlgili: `ayırıcı`, `eof` &mdash; `Mevcut Seçenekler` bölümüne bakın.

En az bir karakter uzunluğunda bir dize veya Buffer şeklinde herhangi bir değer gönderebilirsiniz. Özel değerler şunlardır:

- `unix`: `\n` eşdeğeri
- `mac`: `\r` eşdeğeri
- `windows`: `\r\n` eşdeğeri
- `ascii`: `\u001e` eşdeğeri
- `unicode`: `\u2028` eşdeğeri

:::tip
Özel değerler, çıktığın farklı platformlarda nasıl görüneceğini etkileyebilir. Projelerinizde hangi platformu kullandığınıza dikkat edin.
:::

## Geçmiş

Bu seçenek, 4.3.1 sürümüne kadar `rowDelimiter` olarak adlandırılıyordu.

## Örnek

Varsayılan değer, yeni satır ASCII karakteri `\n`'dir. [örnek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.record_delimiter.js) özel boru karakterini tanımlar:

`embed:packages/csv-stringify/samples/option.record_delimiter.js`

:::info
Dikkat edilmesi gereken bir nokta, `kayıt_ayırıcı` seçeneğinin doğru ayarlanmasıdır; aksi takdirde, veriniz beklenmeyen şekillerde ayrılabilir.
:::