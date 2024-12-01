---
title: Seçenek ignore_last_delimiters
description: ignore_last_delimiters seçeneği, istenen bir satır numarasından başlayan kayıtları yönetir. Bu seçenek, son alandaki ayırıcıları göz ardı ederek CSV verileri ile çalışmayı kolaylaştırır.
keywords: [csv, ayıkla, seçenekler, sütunlar, ssa, ayırıcı, alan]
---

# Seçenek `ignore_last_delimiters`

* Tür: `boolean|integer`
* Opsiyonel
* Varsayılan: `false`
* Sürüm: 4.15.0
* İlgili: `columns`, `delimiter` &mdash; bkz. `Mevcut Seçenekler`

:::info
`ignore_last_delimiters` seçeneği, kaydın son alanında bulunan herhangi bir `ayırıcıyı` dikkate almaz. `true` olarak tanımlandığında, beklenen alan sayısını bilmek için `column` seçeneğinin varlığına ihtiyaç duyar.
:::

CSV formatlarıyla kısmen uyumlu olduğunu iddia eden bazı formatlar, başlık satırı ayrıştırıldığında alan sayısının kaydedildiğini varsaydıkları için son alanda kaçırılmamış virgüllere sahip olmanın sorun olmayacağını kabul eder.

> Örneğin, [Gelişmiş SubStation Alpha (ASS)](https://en.wikipedia.org/wiki/SubStation_Alpha), teknik olarak SSA v4+, bir altyazı dosyası formatıdır. Bu tür bir davranışı spesifikasyonunda görebilirsiniz:
> 
> Format satırı, SSA'nın tüm sonraki Event satırlarını nasıl yorumlayacağını belirtir. Alan adları doğru yazılmalı ve şu şekildedir:
> Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text.
> Son alan her zaman Text alanı olacaktır, böylece virgülleri içerebilir.
> — Belge

ve burada:

> Her satırdaki bilgi alanları virgüllerle ayrılmıştır.
> Bu, karakter adlarında ve stil adlarında virgül kullanımını yasaklar (SSA sizi bunlara virgül koymaktan alıkoyar). Ayrıca, bir SSA betiğinin parçalarını bir CSV dosyası olarak bir elektronik tabloya yüklemek ve başka bir altyazı programı için ihtiyaç duyduğunuz bilgi sütunlarını kesmek oldukça kolaydır.
> — Belge

## Örnek

Bu `örnekte`, CSV verileri `format` ve `description` olmak üzere 2 alandan oluşur. Alanlar, varsayılan `ayırıcı` olan virgüllerle ayrılmıştır. Son alan, `description`, kaydı bozmayacak şekilde herhangi bir sayıda virgül içerebilir.


Örnek Kodu Göster

`embed:packages/csv-parse/samples/option.ignore_last_delimiters.js`

