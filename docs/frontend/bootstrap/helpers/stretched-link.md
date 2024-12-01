---
description: Bu içerik, HTML öğelerini veya CoreUI for Bootstrap bileşenlerini CSS aracılığıyla tıklanabilir hale getirmek için uzatılmış bağlantı sınıfının kullanımını açıklamaktadır.
keywords: [uzatılmış bağlantı, CSS, Bootstrap, stretched-link`, içeren blok]
title: Uzatılmış bağlantı
---

`.stretched-link` sınıfını bir bağlantıya ekleyin, böylece [içeren blok](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) `::after` sahte öğesi aracılığıyla tıklanabilir hale gelir. Çoğu durumda, bu, `.stretched-link` sınıfına sahip bir bağlantıyı içeren `position: relative;` olan bir öğenin tıklanabilir olduğu anlamına gelir. Lütfen [CSS `position`'ın nasıl çalıştığını](https://www.w3.org/TR/CSS21/visuren.html#propdef-position) göz önünde bulundurun, **`.stretched-link`** çoğu tablo öğesiyle birleştirilemez.

:::tip
Kartlar Bootstrap'ta varsayılan olarak `position: relative` değerine sahiptir. Bu nedenle, bu durumda başka bir HTML değişikliği olmadan karttaki bir bağlantıya `.stretched-link` sınıfını güvenle ekleyebilirsiniz.
:::

Uzatılmış bağlantılarla birden fazla bağlantı ve dokunma hedefi önerilmez. Ancak, bu gerekli olursa bazı `position` ve `z-index` stilleri yardımcı olabilir.

  
  
    Uzatılmış bağlantıya sahip kart
    Kart başlığını oluşturmak ve kartın içeriğinin büyük bir kısmını sağlamak için bazı hızlı örnek metin.
    Bir yere git
  

Çoğu özel bileşen varsayılan olarak `position: relative` içermez, bu nedenle bağlantının üst öğeden dışarı uzamasını önlemek için burada **`.position-relative`** eklememiz gerekir.

  
  
    Uzatılmış bağlantıya sahip özel bileşen
    Bu, özel bileşen için bazı yer tutucu içeriklerdir. Bazı gerçek dünya içeriklerinin nasıl görüneceğini taklit etmek için tasarlanmıştır ve bileşene biraz beden ve boyut vermek için buradayız.
    Bir yere git
  

  
    
  
  
    Uzatılmış bağlantıya sahip sütunlar
    Bu diğer özel bileşen için başka bir yer tutucu içeriği örneğidir. Bazı gerçek dünya içeriklerinin nasıl görüneceğini taklit etmek için tasarlanmıştır ve bileşene biraz beden ve boyut vermek için buradayız.
    Bir yere git
  

## İçeren bloğu belirleme

Eğer uzatılmış bağlantı çalışmıyorsa, bu muhtemelen [içeren blok](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#Identifying_the_containing_block) nedeniyle olacaktır. Aşağıdaki CSS özellikleri bir öğeyi içeren blok yapacaktır:

- `static` dışındaki bir `position` değeri
- `none` dışındaki bir `transform` veya `perspective` değeri
- `transform` veya `perspective` için `will-change` değeri
- `none` dışındaki bir `filter` değeri veya `filter` için bir `will-change` değeri (sadece Firefox'ta çalışır)

:::note
Aşağıdaki örnekte, uzatılmış bağlantının neden çalışmadığını gözlemleyebilirsiniz.
:::

  
  
    Uzatılmış bağlantılara sahip kart
    Kart başlığını oluşturmak ve kartın içeriğinin büyük bir kısmını sağlamak için bazı hızlı örnek metin.
    
      <a href="#" class="stretched-link text-danger" style="position: relative;">Uzatılmış bağlantı burada çalışmayacak çünkü position: relative bağlantıya eklendi
    
    
      Bu <a href="#" class="text-warning stretched-link">uzatılmış bağlantı</a> yalnızca p-etiketine yayılacak, çünkü bir dönüşüm uygulanmıştır.
    
  

