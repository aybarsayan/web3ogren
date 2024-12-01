---
description: Bu doküman, taşma yardımcı programlarını kullanarak içerik öğelerinin taşmasını ve stilini nasıl ayarlayabileceğinizi detaylandırır. Ayrıca, Sass üzerinden özelleştirme seçeneklerini sunar.
keywords: [taşma, yardımcı programlar, CSS, Sass, stil, responsive, örnekler]
title: Taşma
---

`overflow` özelliğini dört varsayılan değer ve sınıf ile anında ayarlayın. Bu sınıflar varsayılan olarak duyarlı değildir.


  
    Bu, belirli genişlik ve yükseklik boyutlarına sahip bir öğe üzerinde .overflow-auto kullanmanın bir örneğidir. Tasarım gereği, bu içerik dikey olarak kaydırılacaktır.
  
  
    Bu, belirli genişlik ve yükseklik boyutlarına sahip bir öğe üzerinde .overflow-hidden kullanmanın bir örneğidir.
  
  
    Bu, belirli genişlik ve yükseklik boyutlarına sahip bir öğe üzerinde .overflow-visible kullanmanın bir örneğidir.
  
  
    Bu, belirli genişlik ve yükseklik boyutlarına sahip bir öğe üzerinde .overflow-scroll kullanmanın bir örneğidir.
  


```html
<div class="overflow-auto">...</div>
<div class="overflow-hidden">...</div>
<div class="overflow-visible">...</div>
<div class="overflow-scroll">...</div>
```

:::info
Taşma yardımcı programları, içeriğin görünümünü optimize etmek için kullanılır. Farklı sınıfların nasıl çalıştığını anlamak, projelerinizde daha iyi düzenlemeler yapmanıza yardımcı olabilir.
:::

Sass değişkenlerini kullanarak, `_variables.scss` dosyasındaki `$overflows` değişkenini değiştirerek taşma yardımcı programlarını özelleştirebilirsiniz.

## Sass

### Araçlar API'si

Taşma yardımcı programları, `scss/_utilities.scss` dosyamızda araçlar API'sinde tanımlanmıştır. `Araçlar API'sini nasıl kullanacağınızı öğrenin.`

:::note
Taşma sınıfları, içerik yönetim sistemleri veya ön uç çerçeveleri ile birlikte kullanıldığında son derece faydalı olabilir. 
:::

