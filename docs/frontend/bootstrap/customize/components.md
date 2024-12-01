---
layout: docs
title: Bileşenler
description: Tüm bileşenlerimizi neden ve nasıl responsive olarak temel ve modifikatör sınıflarla oluşturduğumuzu öğrenin. Bu kılavuz, CoreUI for Bootstrap bileşenlerinin özelleştirilmesi ve responsive tasarım için önemli bilgiler sunmaktadır.
keywords: [Bileşenler, CoreUI, Bootstrap, responsive tasarım, modifikatör sınıflar]
---

## Temel sınıflar

CoreUI for Bootstrap bileşenleri büyük ölçüde **temel-modifikatör** nomenklatürü ile inşa edilmiştir. Bir `.btn` gibi mümkün olduğunca çok paylaşılan özelliği bir temel sınıfa toplarız ve ardından her varyant için bireysel stilleri modifikatör sınıflarında toplarız, örneğin `.btn-primary` veya `.btn-success`.

:::info
Modifikatör sınıflarımızı oluşturmak için, Sass'ın `@each` döngülerini bir Sass haritasında yinelemek için kullanırız. 
:::

Bu, bir bileşenin varyantlarını `$theme-colors` ile oluştururken ve her kıvrım noktası için responsive varyantlar oluştururken özellikle yardımcıdır. Bu Sass haritalarını özelleştirdiğinizde ve yeniden derlediğinizde, değişikliklerinizi otomatik olarak bu döngülerde göreceksiniz.

Bu döngüleri özelleştirip CoreUI for Bootstrap'tan kendi kodunuza temel-modifikatör yaklaşımını genişletmek için `Sass haritalarımız ve döngüler belgelerimize` göz atın.

## Modifikatörler

CoreUI for Bootstrap'ın birçoğu bileşeni temel-modifikatör sınıf yaklaşımı ile inşa edilmiştir. Bu, stilin çoğunun bir temel sınıfta (örn. `.btn`) yer aldığı, stil varyasyonlarının ise modifikatör sınıflarına (örn. `.btn-danger`) sıkıştırıldığı anlamına gelir. Bu modifikatör sınıfları, modifikatör sınıflarımızın sayısını ve adını özelleştirmek için `$theme-colors` haritasından oluşturulmaktadır.

:::tip
Aşağıda, `.alert` ve `.list-group` bileşenlerine modifikatörler oluşturmak için `$theme-colors` haritasında nasıl döngü kurduğumuza dair iki örnek bulunmaktadır.
:::

## Responsive

Bu Sass döngüleri, renk haritalarıyla sınırlı değildir. Bileşenlerinizin responsive varyasyonlarını da oluşturabilirsiniz. Örneğin, dropdown'ların responsive hizalamasında `$grid-breakpoints` Sass haritası ile bir medya sorgusu içermekte olan `@each` döngüsünü birleştiririz.

Eğer `$grid-breakpoints`'inizi değiştirirseniz, değişiklikleriniz o haritada yinelemekte olan tüm döngülere uygulanacaktır.

Sass haritalarımızı ve değişkenlerimizi nasıl değiştirebileceğiniz hakkında daha fazla bilgi ve örnekler için `Grid belgelendirmesinin Sass bölümüne` başvurun.

## Kendi bileşenlerinizi oluşturma

CoreUI for Bootstrap ile bileşenlerinizi oluştururken bu kılavuzları benimsemenizi öneririz. Bu yaklaşımı, belgelerimizde ve örneklerimizde özel bileşenler için kendimiz de genişlettik. **Çağrılar gibi bileşenler**, sağlanan bileşenler gibi temel ve modifikatör sınıfları ile inşa edilmiştir.


  
    Burası bir çağrı alanı. Belgelerimiz için özel olarak oluşturduk, böylece size ilettiğimiz mesajlar öne çıksın. Modifikatör sınıfları aracılığıyla üç varyanta sahiptir.
  


```html
<div class="callout">...</div>
```

CSS'inizde, stilin çoğunun `.callout` aracılığıyla yapıldığı aşağıdaki gibi bir duruma sahip olursunuz. Ardından, her varyant arasındaki benzersiz stiller modifikatör sınıfı aracılığıyla kontrol edilir.

```scss
// Temel sınıf
.callout {}

// Modifikatör sınıfları
.callout-info {}
.callout-warning {}
.callout-danger {}
```

> "Çağrılar için, o benzersiz stil sadece bir `border-left-color` dir."  
> — Belgelerdeki örnek açıklaması

Bu temel sınıfı bu modifikatör sınıflarından biriyle birleştirdiğinizde, tam bileşen ailenizi elde edersiniz:


**Bu bir bilgi çağrısıdır.** Uygulamada göstermek için örnek metin.

**Bu bir uyarı çağrısıdır.** Uygulamada göstermek için örnek metin.

**Bu bir tehlike çağrısıdır.** Uygulamada göstermek için örnek metin.
