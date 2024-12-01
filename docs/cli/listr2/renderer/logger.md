---
title: Logger
description: ListrLogger, renderların belirli bir çıktı formatına sahip olmasını sağlamak için kullanılan bir arayüzdür. Bu doküman, ListrLogger'ın işlevselliği, kayıt seviyeleri, stil özelleştirmeleri ve preset mekanizmaları hakkında kapsamlı bilgiler sunmaktadır.
keywords: [ListrLogger, kayıt, stil, preset, özelleştirme, render]
order: 100
tag:
  - gelişmiş
  - çıktı
category:
  - kayıt
---



`ListrLogger` renderların belirli bir çıktı formatına sahip olmasını sağlayan ortak bir arayüzdür.



_ListrLogger_, her render için belirli bir ölçüde kullanılır. _ListrLogger_, renderların konsol çıktıları ile bir ara katman görevi görür ve çıkış akışlarını `stdout` ve `stderr` üzerinden _ProcessOutput_ aracılığıyla yönetir. Bu süreçte, "render işlemi esnasında bu akışların tam kontrolünü elinde tutabilir." — ListrLogger

### Kayıt Seviyeleri

_ListrLogger_ için kayıt seviyeleri, _ListrLogger_ örneği oluşturulurken dinamik olarak eklenir ve örneğin stil bölümünü etkiler.

Varsayılan olarak, `ListrLogLevels` metin tabanlı renderlar için kullanılır. _DefaultRenderer_ gibi renderlar, metin tabanlı renderlara kıyasla daha fazla durum gerektiren stillere ihtiyaç duyar; bu nedenle özel kayıt seviyeleri `ListrDefaultRendererListrLogLevels` eklenir.

---

## Stil

_ListrLogger_'ın _stili_, `ListrLoggerOptions` aracılığıyla özelleştirilebilir. Her render bir şekilde _ListrLogger_'ı kullandığı için, bu işlevsellik renderları doğrudan özelleştirmek için kullanılabilir.

### Simge ve Renkler



_ListrLogger_, _ListrLogger_'ı kullanan ilgili render seçenekleri içindeki açıklanan alanlar aracılığıyla her render için özelleştirilebilir.

#### Desteklenen Renderlar

Desteklenen renderların `icon` ve `color` bölümü, `ListrLoggerStyleMap` biçimindedir. _ListrLogger_'a yeni stil seçenekleri ekleyerek, her mümkün olan görevin simgelerini ve renklerini değiştirebilirsiniz.

::: details  Kod Örneği



_ListrLogger_, her giriş için ön ekler ve son ekler biçiminde alanlara sahip olabilir.

Renderlar ile nasıl kullanılacağına dair _presets_ bölümüne bakınız.

---

## Presetler



Preset mekanizması, `zaman damgaları` veya `zamanlayıcılar` gibi ek verileri göstermek için kullanılır. Bu, alanların koşullu gösterimi veya koşullu stillendirme ile dinamik hale getirilmesine esneklik sağlar.

Farklı renderlar, seçilen renderın stiline uyduğu ölçüde farklı presetleri destekler. Presetler, _ListrLogger_ ile doğrudan bağlanmamış olsa da, genellikle günlüğe girme girişi açısından ön ekler ve son ekler formunda alanlar elde etmek için mekanizmayı kullanmaktadır.

Belirli bir alana önceden tanımlanmış preset geçirebilir veya presetin alanlarını geçersiz kılmak suretiyle presetin davranışını değiştirebilirsiniz, çünkü preset nesne olarak tasarlanmıştır.

### Preset Zamanlayıcı



Bu preset, verilen bir olayın ne kadar süre önce gerçekleştiğini göstermek için kullanılabilir.

_Bu preset, _DefaultRenderer_, _VerboseRenderer_ ve _SimpleRenderer_ üzerinde hem _Listr_ hem de _Task_ düzeyi seçeneklerinde mevcuttur._

::: details  Kod Örneği

 Kod Örneği

 Kod Örneği

  ile birkaç denemeden sonra, bu, çok sayıda farklı render uygulaması ile paylaşılan ve bunların aynı şekilde kullanmadığı logger'ı değiştirmek için en esnek çözüm oldu. 

::: warning

_ListrLogger_ için bazı seçenekler, seçilen render aracılığıyla zorla eklenir. Bu, `timestamp` veya `icon` ve `style` gibi global alan seçenekleri gibi seçeneklerdir. Bu seçenekleri özel bir logger oluşturmadan sergilemek istememden kaynaklanmaktadır; çünkü bu daha ileri düzey kullanım senaryolarına girer.