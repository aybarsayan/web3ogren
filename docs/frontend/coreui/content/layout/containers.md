---
layout: docs
title: Konteynerler
description: Konteynerler, içeriğinizi belirli bir cihaz veya görünüm alanında tutan, yastıklayan ve hizalayan CoreUI for Bootstrap'ın temel yapı taşlarıdır. Bu belgede, konteynerlerin nasıl çalıştığını ve çeşitli türlerini keşfedeceksiniz.
keywords: [konteyner, CoreUI, Bootstrap, responsive, yerleşim, CSS]
---

## Nasıl çalışır

Konteynerler, CoreUI for Bootstrap'taki en temel yerleşim elemanlarıdır ve **varsayılan ızgara sistemimizi kullanırken gereklidir**. Konteynerler, içeriği tutmak, yastıklamak ve (bazen) ortalamak için kullanılır. Konteynerler *iç içe* olabilse de, çoğu yerleşim iç içe geçmiş bir konteyner gerektirmez.

CoreUI for Bootstrap, üç farklı konteynerle birlikte gelir:

- `.container`, her bir yanıt veren kesmede bir `max-width` ayarlar
- `.container-{breakpoint}`, belirtilen kesme noktasına kadar `width: 100%`'dir
- `.container-fluid`, tüm kesme noktalarında `width: 100%`'dir

Aşağıdaki tablo, her bir konteynerin `max-width` değerinin orijinal `.container` ve `.container-fluid` ile her bir kesme noktasındaki karşılaştırmasını göstermektedir.


|  | Ekstra küçük&lt;576px | Küçük&ge;576px | Orta&ge;768px | Büyük&ge;992px | X-Büyük&ge;1200px | XX-Büyük&ge;1400px |
| --- | --- | --- | --- | --- | --- | --- |
| `.container` | 100% | 540px | 720px | 960px | 1140px | 1320px |
| `.container-sm` | 100% | 540px | 720px | 960px | 1140px | 1320px |
| `.container-md` | 100% | 100% | 720px | 960px | 1140px | 1320px |
| `.container-lg` | 100% | 100% | 100% | 960px | 1140px | 1320px |
| `.container-xl` | 100% | 100% | 100% | 100% | 1140px | 1320px |
| `.container-xxl` | 100% | 100% | 100% | 100% | 100% | 1320px |
| `.container-fluid` | 100% | 100% | 100% | 100% | 100% | 100% |
## Varsayılan konteyner

Varsayılan `.container` sınıfımız, her kırılma noktasında `max-width`'ı değişen responsive (duyarlı) bir sabit genişlik konteyneridir.

```html
<div class="container">
  <!-- İçerik buraya -->
</div>
```

:::tip
**İpucu:** Varsayılan konteyner sınıfı, içerik düzeninizi düzenli tutmak için temel bir yapı sağlar.
:::

## Duyarlı konteynerler

Duyarlı konteynerler, belirli bir kırılma noktasına ulaşılana kadar %100 genişlikte bir sınıf belirtmenize olanak tanır; bu noktadan sonra daha yüksek kırılma noktaları için `max-width` değerleri uygulanır. Örneğin, `.container-sm` başlangıçta %100 genişliğindedir ve `sm` kırılma noktasına ulaşıldığında `md`, `lg`, `xl` ve `xxl` ile ölçeklenir.

```html
<div class="container-sm">Küçük kırılma noktasına kadar %100 genişlik</div>
<div class="container-md">Orta kırılma noktasına kadar %100 genişlik</div>
<div class="container-lg">Büyük kırılma noktasına kadar %100 genişlik</div>
<div class="container-xl">Ekstra büyük kırılma noktasına kadar %100 genişlik</div>
<div class="container-xxl">Ekstra ekstra büyük kırılma noktasına kadar %100 genişlik</div>
```

:::info
Duyarlı konteynerlerin kullanılması, cihaz boyutlarına göre içerik düzeninizi optimize etmenize olanak tanır.
:::

## Sıvı konteynerler

Tam genişlikte bir konteyner için `.container-fluid` kullanın, görünüm alanının tamamını kaplar.

```html
<div class="container-fluid">
  ...
</div>
```

## Sass

Yukarıda gösterildiği gibi, CoreUI for Bootstrap bir dizi önceden tanımlanmış konteyner sınıfı üretir ve bu, istediğiniz yerleşimleri oluşturmanıza yardımcı olur. Bu önceden tanımlanmış konteyner sınıflarını, onları yönlendiren Sass haritasını ( `_variables.scss` içinde bulunur) değiştirerek özelleştirebilirsiniz:

:::note
Bu işlemler, başından itibaren daha iyi kontrol sağlamakla kalmaz, aynı zamanda özelleştirilmiş stil ile daha esnek yerleşim olanakları sunar.
:::

Sass'ı özelleştirmenin yanı sıra, kendi konteynerlerinizi oluşturmak için Sass mixin'imizi de kullanabilirsiniz.

```scss
// Kaynak mixin
@mixin make-container($padding-x: $container-padding-x) {
  width: 100%;
  padding-right: $padding-x;
  padding-left: $padding-x;
  margin-right: auto;
  margin-left: auto;
}

// Kullanım
.custom-container {
  @include make-container();
}
```

:::warning
Sass değişiklikleri uygularken, mevcut yapıların bozulmaması için dikkatli olunmalıdır.
:::

Sass haritalarımızı ve değişkenlerimizi nasıl değiştireceğiniz hakkında daha fazla bilgi ve örnekler için lütfen `Grid dökümantasyonunun Sass bölümüne` bakın.