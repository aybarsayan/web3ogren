---
title: Seçenekler
description: stream-transform paketine ilişkin seçenekler. Bu doküman, çeşitli akış dönüşüm seçeneklerini ve bunların nasıl kullanılacağını açıklamaktadır. Özellikle `consume`, `parallel` ve `params` gibi parametrelerin işlevselliği üzerine odaklanmaktadır.
keywords: [stream, transform, seçenekler, paralel, tüket, parametreler]
sort: 4
---

# Stream Transform Seçenekleri

Tüm seçenekler isteğe bağlıdır. [Node.js Yazılabilir Akış API'sinden](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options) ve [Node.js Okunabilir Akış API'sinden](https://nodejs.org/api/stream.html#stream_new_stream_readable_options) gelen tüm seçenekler desteklenir ve olduğu gibi geçilir.

## Mevcut Seçenekler

* `consume` (boolean)   
  Bir tüketici olmaması durumunda, bir `stream.Readable` gibi, akışın tüketimini tetikler.
* `parallel` (number)   
  Paralel olarak çalışacak dönüşüm geri çağırma sayısı; yalnızca asenkron işleyicilerle uygulanabilir; varsayılan "100" olarak ayarlanmıştır.
* `params` (herhangi bir şey)   
  Kullanıcı tanımlı parametreleri son argüman olarak kullanıcı işleyicisine geçirin.

## `parallel` Seçeneğinin Kullanımı

:::tip
Bu seçenek, işleyicilerin ardışık mı yoksa eşzamanlı mı çalıştırılacağını kontrol eder. Not: Paralellik yalnızca asenkron kullanıcı işlevlerinde etki eder.
:::

Ardışık modda, belirli bir zaman diliminde yalnızca 1 dönüşüm işlevi çalışmaktadır. 

> [Mod ardışık örneği](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/option.parallel.sequential.js) değeri "1" olarak ayarlayarak ardışık bir yürütme zorlar.  
> — Node.js Dökümantasyonu

```bash
embed:packages/stream-transform/samples/option.parallel.sequential.js
```

Eşzamanlı modda, seçenek değeri maksimum paralel yürütme sayısını tanımlar. 

---

### Detaylar


Paralel İşleyicilerin Ayrıntıları

Eşzamanlı işleyiciler kullanılırken, belirli parametreler üzerinde dikkatli olunmalıdır. Bu modda sistem kaynakları daha efektif kullanılabilir; ancak bu, işleyicilerin doğru şekilde optimize edilmesini gerektirir.



---