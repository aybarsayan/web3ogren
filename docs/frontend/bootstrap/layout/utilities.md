---
layout: docs
title: Düzen için Araçlar
description: Bu belge, CoreUI for Bootstrap kullanarak daha hızlı mobil uyumlu ve duyarlı geliştirme için gösterim, gizleme, hizalama ve boşluk bırakma gibi konuları kapsar. Kullanıcıların içerik düzenini iyileştirebilecekleri çeşitli yardımcı sınıflar hakkında bilgi verilmektedir.
keywords: [CoreUI, Bootstrap, düzen, yardımcı sınıflar, flexbox, görünürlük, margin]
---

## `display` Değiştirme

`display` özelliğinin yaygın değerlerini yanıt veren şekilde değiştirmek için `gösterim yardımcı sınıflarımızı` kullanın. Bunu ağ sistemimiz, içerik veya bileşenlerle birleştirerek belirli görünüm noktalarında gösterme veya gizleme yapabilirsiniz.

:::tip
**Not:** `display` sınıflarını kullanarak içeriğinizi farklı görünüm noktalarında kolayca kontrol edebilirsiniz.
:::

## Flexbox Seçenekleri

CoreUI for Bootstrap, flexbox ile inşa edilmiştir, ancak her öğenin `display` durumu `display: flex` olarak değiştirilmemiştir; çünkü bu birçok gereksiz geçersiz kılma ekleyecek ve tarayıcı davranışlarını beklenmedik bir şekilde değiştirecektir. Çoğu `bileşenimiz` flexbox etkin olacak şekilde inşa edilmiştir.

Bir öğeye `display: flex` eklemeniz gerekiyorsa, bunu `.d-flex` veya yanıt veren varyantlardan birini kullanarak yapın (örn., `.d-sm-flex`). Ekstra `flexbox yardımcı sınıflarımızı` boyutlandırma, hizalama, boşluk ve daha fazlası için kullanabilmek için bu sınıfa veya `display` değerine ihtiyacınız olacak.

## Margin ve Padding

Öğelerin ve bileşenlerin boşluk ve boyutlarını kontrol etmek için `margin` ve `padding` `boşluk yardımcı sınıflarını` kullanın. CoreUI for Bootstrap, varsayılan `$spacer` değişkenine dayanan `1rem` değeri için altı düzeyli bir ölçek içerir. Tüm görünüm noktaları için değerler seçin (örn., LTR'de `margin-right: 1rem` için `.me-3`), veya belirli görünüm noktalarına hedef almak için yanıt veren varyantlar seçin (örn., `md` kesme noktasında başlayan LTR'de `margin-right: 1rem` için `.me-md-3`).

:::note
**İlginç Bilgi:** `margin` ve `padding` yardımcı sınıfları, responsive tasarım için oldukça yararlıdır. Onları doğru bir şekilde uygulamak, tüm cihazlarda tutarlı bir görünüm sağlar.
:::

## `visibility` Anahtarını Değiştirme

`display` anahtarını değiştirmek gerekmiyorsa, bir öğenin `visibility`'sini `görünürlük yardımcı sınıflarımızla` değiştirebilirsiniz. Görünmez öğeler hala sayfanın düzenini etkiler, ancak ziyaretçilere görünmez olacaktır.

> **Önemli Nokta:** `visibility: hidden` kullandığınızda, öğe alan kaplar fakat görünmez olur, bu durumda dikkatli olunmalıdır. 
> — CoreUI Belgeleri