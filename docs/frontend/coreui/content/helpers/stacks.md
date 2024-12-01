---
description: Stacks, Bootstrap'te düzenleri hızlıca oluşturmayı sağlayan flexbox yardımcıları sunar. Bu kısayollar, kullanıcıların dikey ve yatay yığınlar oluşturmasını kolaylaştırır.
keywords: [Bootstrap, flexbox, yığma, yardımcılar, düzen, css]
---

Stacks, Bootstrap'te hızlı ve kolay bir şekilde düzenler oluşturmak için bir dizi flexbox özelliklerini uygulamanın bir kısayolu sunar. Konsept ve uygulamanın tüm kredi açık kaynak [Pylon projesine](https://almonk.github.io/pylon/) aittir.

:::warning
Dikkat! Flexbox ile boşluk yardımcılarına destek, Safari'ye yeni eklenmiştir, bu nedenle hedeflediğiniz tarayıcı desteğini doğrulamayı düşünün. Ağ dizaynında bir sorun olmamalıdır. [Daha fazla oku](https://caniuse.com/flexbox-gap).
:::

## Dikey

Dikey düzenler oluşturmak için `.vstack` kullanın. Yığılmış öğeler varsayılan olarak tam genişliktedir. Öğeler arasında boşluk eklemek için `.gap-*` yardımcılarını kullanın.

  İlk öğe
  İkinci öğe
  Üçüncü öğe

## Yatay

Yatay düzenler için `.hstack` kullanın. Yığılmış öğeler varsayılan olarak dikey olarak merkezlidir ve yalnızca gerekli genişliği kaplar. Öğeler arasında boşluk eklemek için `.gap-*` yardımcılarını kullanın.

  İlk öğe
  İkinci öğe
  Üçüncü öğe

Yatay boşluk yardımcıları olan `.ms-auto` kullanarak aralar:

  İlk öğe
  İkinci öğe
  Üçüncü öğe

Ve `dikey kurallar` ile:

  İlk öğe
  İkinci öğe
  
  Üçüncü öğe

## Örnekler

Düğmeleri ve diğer öğeleri yığmak için `.vstack` kullanın:

  Değişiklikleri kaydet
  İptal

Inline bir form oluşturmak için `.hstack` kullanın:

  
  Gönder
  
  Sıfırla

## Özelleştirme

## SASS Değişkenleri

