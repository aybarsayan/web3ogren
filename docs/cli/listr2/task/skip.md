---
title: Koşullu Atla
description: Koşullu atlama, belirli bir bağlama bağlı olarak bir Görev'in etkinleştirilmesi için bir yöntemdir. Bu özellik, atlanması gereken görevlerin yönetilmesinde önemli bir rol oynar ve asenkron işlemlerle etkileşimde bulunur.
keywords: [koşullu atlama, görev yönetimi, asenkron işlemler, render, mesaj]
order: 50
tag:
  - temel
  - akış
category:
  - görev
---



Koşullu atlama, belirli bir bağlama bağlı olarak bir _Görev_'in etkinleştirilmesinin bir yoludur. Ancak `enable` ve `skip` arasındaki ana fark, `skip`'in her zaman verilen görevi render etmesidir. **İcra zamanı geldiğinde** ve atlanması gerektiği ortaya çıktığında, bunu atlanmış olarak render eder veya işaretler.



::: warning

Bağlam etkin bir görev listesi tasarlarken **asenkron işlemlere dikkat edin**, çünkü bağlamda herhangi bir değişken için beklemez.

:::

::: info Örnek

İlgili örnekleri [burada](https://github.com/listr2/listr2/tree/master/examples/task-skip.example.ts) bulabilirsiniz.

:::

## Kullanım

Atlama çağrısının bir mesajı olabilir veya olmayabilir, bu nedenle isteğe bağlıdır. Bir mesajın, seçilen renderleyici ve ayarlarıyla birleştirilmesi, atlama mesajının doğrudan gösterilebileceği **farklı bir çıktı oluşturur.**

## Bir _Görev_ içinde Atla



:::