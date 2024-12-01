---
description: İçinde bir konteynır olan yüzer içeriği hızlı ve kolay bir şekilde temizlemek için bir clearfix yardımcı aracı ekleyin. Bu, CSS düzeninizi iyileştirmenize yardımcı olacak basit bir araçtır.
keywords: [clearfix, CSS, mixin, Bootstrap, yüzer içerik, düzen]
---

Yüzerleri temizlemek için yalnızca `.clearfix` **ana öğeye** ekleyerek kolayca gerçekleştirebilirsiniz. Ayrıca bir mixin olarak da kullanılabilir.

:::info
Clearfix, yüzer öğelerin etrafında düzeni korumak için kullanılır ve bazı durumlarda gereklidir. 
:::

HTML'de kullanın:

```html
<div class="clearfix">...</div>
```

Mixin kaynak kodu:

SCSS'de mixin kullanmak:

```scss
.element {
  @include clearfix;
}
```

Aşağıdaki örnek clearfix'in nasıl kullanılacağını göstermektedir. Clearfix olmadan sarıcı div butonların etrafında genişlemez ve bu da bozuk bir düzen oluşturur.

:::tip
Clearfix kullanarak, sınıf ekleyerek yüzer öğelerin etrafında düzen bozukluğunu önleyebilirsiniz.
:::

  Örnek Buton sola yüzer
  Örnek Buton sağa yüzer

:::note
Bu örnek, `clearfix` sınıfının kullanımıyla düzenin nasıl düzeltildiğini göstermektedir.
:::