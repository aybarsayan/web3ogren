---
title: Durum
description: Akış Dönüştürme - dahili durum özellikleri. Bu içerikte, dönüşüm örnekleri ve durum bilgisi alma yöntemleri hakkında bilgi verilmektedir. Ayrıca, işlev bağlamlandırmasının nasıl gerçekleştiği de ele alınmaktadır.
keywords: [akış, dönüştür, durum, çalışıyor, başladı, bitti, geri çağırma]
sort: 6
---

# Akış Dönüştürme durum özellikleri

Dönüştürme örneği, kullanıcı geri çağırma işlevinden de erişilebilen birkaç özellik dışa aktarır:

* `transform.state.finished`  
  İcra edilen dönüşüm geri çağırmalarının sayısı; sürüm 2'den önce `transform.finished` idi.
* `transform.state.running`  
  Belirli bir zaman diliminde çalışan dönüşüm geri çağırmalarının sayısı; sürüm 2'den önce `transform.finished` idi.
* `transform.state.started`  
  Başlatılan dönüşüm geri çağırmalarının sayısı; sürüm 2'den önce `transform.finished` idi.

## Durum bilgisi alma

:::info
Aşağıda yer alan [durum örneği](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/state.instance.js), çalışan bir örnekten duruma nasıl erişileceğini göstermektedir.
:::

`embed:packages/stream-transform/samples/state.instance.js`

## İşlev bağlamlandırması

İşleyici ve olay işlevleri dönüştürücünün bağlamı ile bağlanmıştır. Bu nedenle, işlevlerin içinden durum özelliklerine erişmek mümkündür. 

> Ayrıca, Node.js akış API’si olaylarla ilişkilendirilmiş işlevleri akış örneğinin bağlamı ile çağıracaktır. Tabii ki, bu durum kalın ok işlevleriyle çalışmaz.  
> — Akış Dönüştürme Kılavuzu

:::warning
Aşağıdaki [durum işleyici örneği](https://github.com/adaltas/node-csv/blob/master/packages/stream-transform/samples/state.handler.js), kullanıcı işlevinin içinden durum özelliklerine başvurur ve değerlerini kontrol eder. Dikkat edilmesi gereken hususlar vardır.
:::

`embed:packages/stream-transform/samples/state.handler.js`