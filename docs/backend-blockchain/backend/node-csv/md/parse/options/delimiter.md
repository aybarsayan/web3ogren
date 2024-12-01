---
title: Seçenek sınırlayıcı
description: Seçenek "sınırlayıcı", bir kaydı birden fazla alana nasıl ayıracağını belirtir. Bu, veri ayrıştırma sürecinin temel bir parçasıdır. Kullanıcıların doğru sınırlayıcıları seçmeleri, verilerin doğru bir şekilde işlenmesi açısından kritik öneme sahiptir.
keywords: ['csv', 'ayrıştırmak', 'seçenekler', 'sınırlayıcı', 'ayırıcı', 'tsv', 'alanlar', 'kayıtlar']
---

# Seçenek `sınırlayıcı`

Bir kayıttaki alanları ayırmak için kullanılan karakter(ler)i tanımlar. Tek bir değer veya bir dizi değer kabul edilir. **Bir değer bir dize veya bir Buffer** olabilir. Boş olamaz ve **birden fazla karakter** içerebilir. Tanımlanmadığında, varsayılan değer bir **virgüldür**.

* Tür: `string|Buffer|[string|Buffer]`
* Opsiyonel
* Varsayılan: `","` (bir karakterlik virgül)
* Sürüm: 0.0.1
* İlgili: `record_delimiter`, `quote`, `escape` &mdash; `Mevcut Seçenekler` bölümüne bakın.

:::info
Bir sınırlayıcıyı kaçışlamak mümkün değildir. Bir alan, bir sınırlayıcı içeriyorsa ve bunun böyle yorumlanmaması gerekiyorsa, **tırnak içine alınmalıdır**.
:::

## Tek değer sınırlayıcı

[ sınırlayıcı örneğinde](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.delimiter.js), alanlar iki karakterden oluşan bir sınırlayıcı değeri ile ayrılmaktadır.

`embed:packages/csv-parse/samples/option.delimiter.js`

## Sınırlayıcı değerlerinin dizi

Sınırlayıcı, bir dizi olarak tanımlandığında [birden fazla değerden](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/option.delimiter.array.js) oluşabilir:

`embed:packages/csv-parse/samples/option.delimiter.array.js`