---
title: Görev Seçenekleri
description: Bu belge, `listr2` kullanarak görev ve alt görev seçeneklerini nasıl yapılandıracağınızı açıklar. Global veya görev bazında ayarlar ile görevlerin davranışını özelleştirmenin yollarını keşfedin.
keywords: [listr2, görev seçenekleri, alt görev, global ayarlar, prototype, veri yapıları]
order: 2
tag:
  - zorunlu
  - temel
category:
  - görev
---



`listr2`, bir görevin veya alt görevlerin tamamen nasıl davranacağını değiştirmek için global veya görev başına seçenekler alabilir.



## _Listr_ Başına

_Listr_ görev listesi, `verilen özellikler` ile prototipin ikinci argümanını kullanarak global olarak nasıl davranacağını yapılandırılabilir.

:::info 
Global ayarlar, tüm görevlerin davranışını etkileyerek tutarlılık sağlar.
:::

## _Alt Görev_ Başına

Bu davranış, alt görevin farklı bir yaklaşım gerektirmesi durumunda daha da genişletilebilir; bu durumda, bu seçenekler mevcut renderere bağlı olarak `verilen özellikler` ile üretilir.

:::tip
Alt görevlere özel ayarlar, genel ayarların uygun yanlarıyla birleştirilerek kullanılmalıdır.
:::

Elbette, alt görev seçenekleri genel seçeneklerin bir alt kümesidir, çünkü bazı seçeneklerin yalnızca bir kez ayarlanması gerekir ve her görev için değiştirmenin mantıklı olmadığı seçeneklerdir.

## _Görev_ Başına

Görev seçeneklerinin bazı özellikleri, görev başına ayarlara da yayılır; bunlar yapılandırma açısından oldukça sınırlıdır ancak davranışı değiştirmek için her şeyi alt görevlere sarmanıza yetecek kadar olmalıdır.

## Görev Seçenekleri Ekleme

Görev seçenekleri aşağıdaki gibi eklenebilir.

<<< @../../examples/docs/task/task-options/task-options.ts{26-28,32-34,40-41}