---
title: Özel Props Uyarısı
seoTitle: Özel Props Uyarısı - React Bileşenlerinde Dikkat Edilmesi Gerekenler
sidebar_position: 6
description: React bileşenlerine iletilen propslar ile özel propslar arasındaki önemli farkları anlatarak uygulama mantığını ayırmayı hedefliyoruz. Bu yazıda ref ve key propslarını inceleyeceğiz.
tags: 
  - React
  - Bileşen
  - Props
  - JavaScript
keywords: 
  - React
  - Props
  - Bileşen
  - JavaScript
---
JSX elemanındaki çoğu props, bileşene iletilir; ancak, React tarafından kullanılan iki özel prop (`ref` ve `key`) vardır ve dolayısıyla bileşene iletilmezler.

:::info
Özel props olan `ref` ve `key`, bileşenler arasında geçiş yaparken önemlidir ve bileşenin davranışını etkileyebilir.
:::

Örneğin, bir bileşenden `props.key`'i okuyamazsınız. Eğer aynı değere alt bileşende erişmeniz gerekiyorsa, bunu farklı bir prop olarak iletmelisiniz (örneğin: `` ve `props.id`'yi okuyun).

:::warning
Bu yaklaşım, görünüşte gereksiz olabilir; ancak, uygulama mantığını React'a yönelik ipuçlarından ayırmak önemlidir.
:::

Bu yapıyı anlamak, daha sağlıklı ve temiz bir kod yazmanızı sağlayacaktır.

> **Anahtar Nokta:** `key` ve `ref` gibi özel props'lar, doğrudan bileşen üzerinden okunamaz; bu nedenle, alternatif olarak başka bir prop kullanmak gereklidir.  
> — React Geliştirici


Detaylar
Kullanım örneği:
```javascript
<ListItemWrapper key={result.id} id={result.id} />
```
Bu örnekte, `key` değeri alt bileşene herhangi bir props ile iletilmeden kullanılıyor.