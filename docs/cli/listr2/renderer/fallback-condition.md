---
title: Fallback Durumu
description: Fallback durumu, `non-TTY` ortamları ve renk yönetimi gibi durumları açıklamakta ve kullanıcılar için önemli bilgiler sunmaktadır. Bu belgede, Listr kullanarak nasıl geçiş yapılacağını öğrenebilirsiniz.
keywords: [fallback, Listr, non-TTY, renk, Unicode, oluşturucu, örnekler]
order: 5
tag:
  - ileri
  - akış
category:
  - oluşturucu
---



Seçilen oluşturucudan bir geri dönüş/gizli oluşturucuya geçmek istediğiniz `non-TTY` ortamları dışında zamanlar vardır.

Bir boolean döndüren bir fonksiyon veya doğrudan bir boolean, koşul karşılandığında otomatik olarak `fallbackRenderer`'a veya doğrudan _SilentRenderer_'a geçmek için _Listr_'a geçirilebilir.



## Davranış

### TTY veya non-TTY Ortamı

`fallbackRenderer`, `non-TTY` ortamında olduğunuzda otomatik olarak kullanılacaktır.

- TTY ortamını zorlamak için _Listr_ seçeneği olan `forceTTY`'yi kullanabilir veya ortam değişkenini `LISTR_FORCE_TTY=1` olarak ayarlayabilirsiniz.

### Renk

[`colorette`](https://www.npmjs.com/package/colorette) temel renk kütüphanesi olarak kullanılır. Desteklenmediği tespit edildiğinde, arka planda kütüphane otomatik olarak renkleri devre dışı bırakır.

- Renkleri zorlamak için ortam değişkenini `FORCE_COLOR=1` olarak ayarlayabilirsiniz.
- Ortamınızın desteklediği durumlarda bile renkleri tamamen devre dışı bırakmak için ortam değişkenini `NO_COLOR=1` olarak ayarlayabilirsiniz. Bu, testler için oldukça faydalıdır.

### Unicode

Unicode karakterler, çıktınızın onları desteklemediği tespit edildiğinde kullanılmaz.

- Unicode karakterlerinin kullanılmasını zorlamak için _Listr_ üzerinde `forceUnicode` seçeneğini kullanabilir veya ortam değişkenini `LISTR_FORCE_UNICODE=1` olarak ayarlayabilirsiniz.

::: warning
Bu kontroller en iyi ihtimalle ilkel düzeydedir, ancak terminalinizin bu UI özelliklerinden herhangi birini destekleyebileceğini aklınızda bulundurun; ancak aradaki uygulama bunlara erişimi soyutlayabilir, bu nedenle başka şekilde tespit edilebilir.
:::

## Kullanım

::: info Örnek
İlgili örnekleri [buradan](https://github.com/listr2/listr2/tree/master/examples/renderer-fallback-condition.example.ts) bulabilirsiniz.
:::

### Oluşturucu Geri Dönüşü

Geri dönüş oluşturucunuza geçiş yapmak için _Listr_ üzerinde `fallbackRendererCondition` koşulunu kullanabilirsiniz.

<<< @../../examples/docs/renderer/fallback-condition/renderer-fallback.ts{15}

### Sessiz Oluşturucu Geri Dönüşü

Geri dönüş oluşturucunuza geçiş yapmak için _Listr_ üzerinde `silentRendererCondition` koşulunu kullanabilirsiniz.

<<< @../../examples/docs/renderer/fallback-condition/renderer-silent.ts{15}