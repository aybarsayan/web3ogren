---
title: Hata API'si
description: Bu dokümantasyon, Grunt'taki hata API'si hakkında bilgiler sunar ve görevler içindeki hataların etkili bir şekilde nasıl yönetileceğini açıklar. Grunt yapılandırmalarınızda uyarıları ve önemli hataları bildirmek için mevcut yöntemleri öğrenin.
keywords: [Grunt, hata API'si, uyarılar, önemli hatalar, hata yönetimi, çıkış kodları, görev yönetimi]
---

Bir şeyler korkunç derecede yanlış gittiğinde kullanılır.

Daha fazla bilgi için [hata kütüphanesi kaynağını](https://github.com/gruntjs/grunt/blob/master/lib/grunt/fail.js) inceleyin.

## Hata API'si

Eğer bir görev içinde bir şey patlak verirse (veya vermek üzereyse), Grunt'ı sonlandırmaya zorlayabilir. Tüm yerleşik Grunt çıkış kodlarının listesi için `çıkış kodları dokümantasyonuna` bakın.

:::info
☃ (unicode kardan adam) ile işaretlenmiş herhangi bir yöntemin doğrudan `grunt` nesnesi üzerinde de mevcut olduğunu unutmayın. Bilmeniz için söylüyoruz. Daha fazla kullanım bilgisi için `API ana sayfasına` bakın.
:::

### grunt.fail.warn ☃
Bir uyarı gösterir ve Grunt'ı hemen durdurur. Eğer `--force` komut satırı seçeneği belirtilmişse, Grunt görev işlemeye devam edecektir. `error` argümanı bir metin mesajı veya bir hata nesnesi olabilir.

```js
grunt.fail.warn(error [, errorcode])
```

Eğer komut satırında `--stack` belirtilmişse ve bir hata nesnesi sağlanmışsa, bir yığın izi kaydedilecektir.

> _Bu yöntem aynı zamanda `grunt.warn` olarak da mevcuttur._
> — Grunt Dokümantasyonu

### grunt.fail.fatal ☃
Bir uyarı gösterir ve Grunt'ı hemen durdurur. `error` argümanı bir metin mesajı veya bir hata nesnesi olabilir.

```js
grunt.fail.fatal(error [, errorcode])
```

Eğer komut satırında `--stack` belirtilmişse ve bir hata nesnesi sağlanmışsa, bir yığın izi kaydedilecektir.

Kritik bir durumda bir bip sesi çıkarılır, aksi takdirde `--no-color` seçeneği belirtilmemişse.

> _Bu yöntem aynı zamanda `grunt.fatal` olarak da mevcuttur._
> — Grunt Dokümantasyonu

:::warning
`grunt.fail.fatal` kullanırken dikkatli olun, çünkü görev yürütmeyi anında durduracaktır.
:::