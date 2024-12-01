---
title: Seçenek kodlaması
description: Girdi ve çıktı kodlamalarını ayarlamak için 'kodlama' seçeneği. Bu seçenek, kullanıcıların farklı kodlama türlerini belirlemelerine ve yönetmelerine olanak tanır. Detaylar için seçeneklerin nasıl kullanılacağını keşfedin.
keywords: [csv, serbest bırak, seçenekler, kodlama, bom, girdi, çıktı, utf8, utf16, ascii, base64, hex]
---

# Seçenek `kodlama`

`kodlama` seçeneği, girdi ve çıktı kodlamalarını tanımlar.

Varsayılan kodlama değeri `utf8`dir. `true` değeri kullanıldığında da varsayılan 'utf8' kodlaması kullanılır. `null` ve `false` değerleri, dize serileştirmesini devre dışı bırakır ve dizgelerin yerine tamponlar döndürülür.

* Tür: `string|null`
* Opsiyonel
* Varsayılan: `utf8`
* Eşya: 4.13.0'dan beri
* İlişkili: `bom` &mdash; `Mevcut Seçenekler` bölümüne bakın

---

## Varsayılan davranış

Node.js içindeki [mevcut desteklenen kodlama listesi](https://github.com/nodejs/node/blob/master/lib/buffer.js) kaynak kodunda mevcuttur. Bu yazının yazıldığı dönemde 'utf8', 'ucs2', 'utf16le', 'latin1', 'ascii', 'base64', 'hex' kodlamalarını içermektedir.

Node.js'deki varsayılan kodlama **UTF-8**'dir. UTF-8 kullanırken, hiçbir şey belirtmenize gerek yoktur.

Alternatif bir kodlama kullanıldığında, giriş verilerinin başında bulunan `BOM` (bayt sırası işareti) ile keşfedilebilir veya bu seçenek ile tanımlanabilir.

:::tip
Alternatif kodlamaları kullanırken dikkatli olun, çünkü giriş verilerinin doğru bir şekilde tanımlandığından emin olmalısınız.
:::

---

## Seçeneklerle çalışma

Seçenekler sağlarken, değerler içsel olarak veri kaynağının kodlamasını yansıtmalıdır. Değer bir dize ise, ayrıştırıcı değerini seçilen girdi kodlama değeri kullanarak bir tampon temsilimine dönüştürecektir.

Ancak, değer bir tampon ise, tamponun doğru kodlama ile oluşturulduğundan emin olmalısınız. İşte bir örnek: [bir seçeneği tampon olarak kodlamak](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.encoding.options.js), bu durumda `delimiter` seçeneği:

`embed:packages/csv-parse/samples/option.encoding.options.js`

---

## BOM otomatik tespiti

BOM, bir metin akışının başındaki özel bir Unicode karakter dizisidir ve kodlamayı belirtir.

BOM sadece Unicode'a özgü olduğundan, yalnızca UTF-8 ve UTF-16LE kodlamaları ayrıştırıcı tarafından doğal olarak tespit edilir. İşte bir örnek: [kodlamayı tespit etmek](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.encoding.detection.js), bu durumda **UTF-16LE**:

`embed:packages/csv-parse/samples/option.encoding.detection.js`

BOM'un `\uFEFF` olarak tanımlandığını fark edin. `node -e 'console.info(Buffer.from("\ufeff", "utf16le"))'` komutuyla `FF EE` hexadecimal gösterimine nasıl dönüştürüldüğünü görebilirsiniz. Daha fazla araştırma için [Vikipedi bayt sırası işareti kodlama tablosuna](https://en.wikipedia.org/wiki/Byte_order_mark) başvurabilirsiniz.

---

## Tampon çıktısı

`null` veya `false` değeri, çıktı kodlamasını devre dışı bırakır ve [ham tamponu döndürür](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.encoding.buffer.js).

`embed:packages/csv-parse/samples/option.encoding.buffer.js`