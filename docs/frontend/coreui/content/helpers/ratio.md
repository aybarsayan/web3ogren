---
description: Bu kılavuzda, dış içeriklerin en-boy oranlarını yönetmek için oluşturulan sahte öğeleri kullanmayı öğrenin. Video veya slayt gösterisi yerleştirmeleri için ideal bir çözümdür.
keywords: [en-boy oranları, Sass, iframe, video, responsive tasarım, CSS değişkenleri, Bootstrap]
layout: docs
title: Oranlar
group: helpers
toc: true
bootstrap: true
---

## Hakkında

Dış içeriklerin (örneğin ``ler, ``ler, ``lar ve ``ler) en-boy oranlarını yönetmek için oran yardımcı bileşenini kullanın. **Bu yardımcı bileşenler**, standart HTML alt öğeleri üzerinde de kullanılabilir (örneğin, bir `` veya ``). Stil, üstteki `.ratio` sınıfından doğrudan alt öğeye uygulanır.

En-boy oranları, bir Sass haritasında tanımlanır ve her sınıfın içinde CSS değişkeni ile dahil edilir. Bu aynı zamanda `özel en-boy oranlarına` olanak tanır.

:::tip
**Pro İpucu!** ``lerinizde `frameborder="0"` kullanmanıza gerek yoktur, çünkü bunu sizin için `Reboot` içinde aşıyoruz.
:::

## Örnek

Herhangi bir yerleştirmeyi, örneğin bir ``i, `.ratio` sınıfı ve bir en-boy oranı sınıfı ile bir üst öğeye sarın. **Hemen alt öğe**, evrensel seçicimiz `.ratio > *` sayesinde otomatik olarak boyutlandırılır.

  

## En-boy oranları

En-boy oranları, değiştirme sınıfları ile özelleştirilebilir. **Varsayılan olarak** aşağıdaki oran sınıfları sağlanır:

  1x1


  4x3


  16x9


  21x9

## Özel oranlar

Her `.ratio-*` sınıfı, seçici içinde bir CSS özel özelliği (veya CSS değişkeni) içerir. **Bu CSS değişkenini** hızlı bir matematik ile özelleştirilmiş en-boy oranları oluşturmak için geçersiz kılabilirsiniz.

Örneğin, 2x1 en-boy oranı oluşturmak için, `.ratio` üzerinde `aspect-ratio: 50%` ayarını yapın.

  2x1

Bu CSS değişkeni, en-boy oranını kesirler arasında değiştirmeyi kolaylaştırır. Aşağıdaki kod 4x3 ile başlar, ancak orta kesirde özel 2x1'e değişir.

```scss
.ratio-4x3 {
  @include media-breakpoint-up(md) {
    aspect-ratio: 50%; // 2x1
  }
}
```

  4x3, sonra 2x1

## Sass haritası

`_variables.scss` içinde, kullanmak istediğiniz en-boy oranlarını değiştirebilirsiniz. **İşte varsayılan** `$ratio-aspect-ratios` haritamız. Haritayı istediğiniz gibi değiştirebilir ve Sass'ınızı yeniden derleyerek bunları kullanabilirsiniz.

