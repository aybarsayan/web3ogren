---
title: Akış ve geri çağırma API'lerini Birleştirme
description: Yazılabilir akışı bir dize veya tampon ile, okunabilir akışı ise bir geri çağırma işlevi ile değiştirin. Bu kılavuz, akış ve geri çağırma API'lerinin nasıl bir araya getirileceğine dair detaylı bilgiler sunmaktadır.
keywords: [akış, dönüştürme, api, geri çağırma, işlev, mixin]
sort: 3.3
---

# Akış ve geri çağırma API'lerini Birleştirme

Akış ve geri çağırma API'leri aynı modül içinde uygulanmıştır ve aynı uygulanımı paylaşmaktadır. Her ikisini birleştirmek mümkündür. **Kayıtlar**, akış yazılabilir API ile yazılabilir ve geri çağırmada elde edilebilir. Ayrıca bir argüman olarak sağlanıp akış okunabilir API ile tüketilebilirler.

## Akış Yazılabilir API'yi Kullanma

:::info
Aşağıdaki örnek, yazılabilir bir akışın kullanımını göstermektedir. 
:::

[Input stream example](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/api.mixed.input.stream.js) içinde, kayıtlar `write` metodu ile yazılır ve elde edilen veri kümesi kullanıcı geri çağırmasında mevcuttur:

`embed:packages/stream-transform/samples/api.mixed.input.stream.js`

## Akış Okunabilir API'yi Kullanma

:::tip
Okunabilir akışın entegrasyonu, veri akışının daha etkin bir şekilde işlenmesine yardımcı olabilir.
:::

[Input stream example](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/api.mixed.output.stream.js) içinde, kayıtlar bir argüman olarak sağlanır ve okunabilir API ile tüketilir:

`embed:packages/stream-transform/samples/api.mixed.output.stream.js`