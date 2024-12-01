---
title: Seçenek skip_records_with_error
description: skip_records_with_error seçeneği, bir ayrıştırma hatası meydana geldiğinde bir sonraki satıra geçer. Bu özellik sayesinde hatalı kayıtlar atlanarak işlemlere devam edilebilir.
keywords: ['csv', 'parse', 'options', 'skip_records_with_error', 'columns', 'data processing', 'error handling']
---

# Seçenek `skip_records_with_error`

`skip_records_with_error` seçeneği, ayrıştırma hatalarını tolerans gösterir. İçinde hata bulunan kayıtları atlar ve doğrudan bir sonraki kaydı işlemeye geçer.

* Tür: `boolean`
* Opsiyonel
* Varsayılan: `false`
* Sürümden beri: 1.0.6
* İlgili: `skip_empty_lines`, `skip_records_with_empty_values` &mdash; `Mevcut Seçenekler` bölümüne bakın.

:::warning
Dikkatli olun, bu işlevsellik her veri setine uygun olmayabilir. Bu, veriniz hakkında iyi bir bilgiye sahip olmanızı gerektirir; yani hiçbir alanın kayıt ayırıcıları içermediğinden emin olmalısınız.
:::

Doğası gereği, CSV alanları alıntılandıklarında kayıt ayırıcıları içerebilir. Hata durumunda, ayrıştırıcı, bir kayıt ayırıcısının bir alıntı içinde olup olmadığını anlamak için herhangi bir belirtiye sahip değildir. Bu nedenle, bu seçeneği kullanmak, **alanlarınızın içinde herhangi bir kayıt ayırıcı barındırmadığından emin olmayı gerektirir.**

Bir hata bulunduğunda ve kayıt atlandığında bir `skip` olayı yayımlanır. `error` nesnesi, olay geri çağrısının ilk argümanı olarak aktarılır ve hata türüne bağlı olarak ek bilgileri açığa çıkarabilir. `Hata belgeleri` hata türlerinin bir listesini ve bunların açığa çıkardığı bağlamsal özellikleri içerir.

## `skip` olayını dinlemek

[`option.skip_records_with_error.js` örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.skip_records_with_error.js), geçersiz bir kapanış alıntısı hatasını yakalar ve bir sonraki kayıtları ayrıştırmaya devam eder.


Ek Bilgi

`embed:packages/csv-parse/samples/option.skip_records_with_error.js`
