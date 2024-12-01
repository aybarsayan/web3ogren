---
layout: docs
title: Kırılma Noktaları
description: Kırılma noktaları, Bootstrap için CoreUI'de, düzeninizin cihaz veya görünüm boyutlarına göre nasıl tepki verdiğini belirleyen tetikleyicilerdir. Bu doküman, kırılma noktalarının tanımı, mevcut kırılma noktaları, medya sorguları ve bunların nasıl kullanılacağı hakkında kapsamlı bir rehber sunmaktadır.
keywords: [Bootstrap, CoreUI, kırılma noktaları, medya sorguları, duyarlı tasarım, CSS, web tasarımı]
---

## Temel Kavramlar

- **Kırılma noktaları, duyarlı tasarımın yapı taşlarıdır.** Bunları, düzeninizin belirli bir görünüm veya cihaz boyutunda nasıl uyarlanabileceğini kontrol etmek için kullanın.

- **Kırılma noktasına göre CSS'nizi tasarlamak için medya sorgularını kullanın.** Medya sorguları, bir dizi tarayıcı ve işletim sistemi parametresine bağlı olarak stilleri koşullu olarak uygulamanıza olanak tanıyan CSS özelliğidir. Medya sorgularımızda en yaygın olarak `min-width` kullanıyoruz.

:::tip
Mobil öncelikli tasarım, ziyaretçiler için en iyi deneyimi sağlamak amacıyla CSS'nizi optimize eder, render zamanını iyileştirir.
:::

- **Mobil öncelikli, duyarlı tasarım amaçtır.** Bootstrap için CoreUI'nin CSS'si, en küçük kırılma noktasında bir düzenin çalışması için gerekli en az stilleri uygulamayı ve ardından daha büyük cihazlar için bu tasarımı ayarlamak için stilleri katmanlandırmayı hedefler.

## Mevcut Kırılma Noktaları

Bootstrap için CoreUI, duyarlı bir şekilde inşa etmek için bazen *ızgara katmanları* olarak adlandırılan altı varsayılan kırılma noktası içerir. Bu kırılma noktaları, kaynak Sass dosyalarımızı kullanıyorsanız özelleştirilebilir.


| Kırılma Noktası | Sınıf iç ek | Boyutlar |
| --- | --- | --- |
| Ekstra küçük | Yok  |&lt;576px |
| Küçük | `sm` | &ge;576px |
| Orta | `md` | &ge;768px |
| Büyük | `lg` | &ge;992px |
| Ekstra büyük | `xl` | &ge;1200px |
| Ekstra ekstra büyük | `xxl` | &ge;1400px |
Her bir kırılma noktası, genişlikleri 12'nin katları olan konteynerleri rahatça tutabilecek şekilde seçilmiştir. Kırılma noktaları aynı zamanda yaygın cihaz boyutları ve görünüm boyutlarının bir alt kümesini temsil eder - **spesifik olarak her kullanım durumunu veya cihazı hedeflemezler.** Bunun yerine, aralıklar, neredeyse her cihaz için üzerine inşa edilecek güçlü ve tutarlı bir temel sağlar.

:::note
Bu kırılma noktaları, Sass aracılığıyla özelleştirilebilir - bunları `_variables.scss` stil sayfamızda bir Sass haritasında bulacaksınız.
:::

Sass haritalarımızı ve değişkenlerimizi nasıl değiştireceğiniz hakkında daha fazla bilgi ve örnekler için lütfen `Izgara belgelerinin Sass bölümüne` başvurun.

## Medya Sorguları

Bootstrap için CoreUI, mobil öncelikli olarak geliştirildiği için düzenlerimiz ve arayüzlerimiz için mantıklı kırılma noktaları oluşturmak üzere bir dizi [medya sorgusu](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) kullanıyoruz. Bu kırılma noktaları genellikle minimum görünüm genişliklerine dayanır ve görünüm değiştikçe öğeleri büyütmemizi sağlar.

### Min-width

CoreUI için Bootstrap, düzenimiz, ızgara sistemimiz ve bileşenlerimiz için kaynak Sass dosyalarımızda aşağıdaki medya sorgusu aralıklarını veya kırılma noktalarını esas olarak kullanmaktadır.

```scss
// Kaynak miksinleri

// xs kırılma noktası için medya sorgusu gerekli değil çünkü etkili olarak `@media (min-width: 0) { ... }`
@include media-breakpoint-up(sm) { ... }
@include media-breakpoint-up(md) { ... }
@include media-breakpoint-up(lg) { ... }
@include media-breakpoint-up(xl) { ... }
@include media-breakpoint-up(xxl) { ... }

// Kullanım

// Örnek: `min-width: 0`'dan başlayarak gizle, ardından `sm` kırılma noktasında göster
.custom-class {
  display: none;
}
@include media-breakpoint-up(sm) {
  .custom-class {
    display: block;
  }
}
```

:::info
Bu Sass miksinleri, derlenmiş CSS'mizde Sass değişkenlerimizde belirtilen değerler kullanılarak dönüştürülür.
:::

```scss
// X-Küçük cihazlar (dikey telefonlar, 576px'den daha küçük)
// `xs` için medya sorgusu yok çünkü bu Bootstrap'ta varsayılandır.

// Küçük cihazlar (yatay telefonlar, 576px ve üzeri)
@media (min-width: 576px) { ... }

// Orta cihazlar (tabletler, 768px ve üzeri)
@media (min-width: 768px) { ... }

// Büyük cihazlar (masaüstleri, 992px ve üzeri)
@media (min-width: 992px) { ... }

// X-Büyük cihazlar (büyük masaüstleri, 1200px ve üzeri)
@media (min-width: 1200px) { ... }

// XX-Büyük cihazlar (daha büyük masaüstleri, 1400px ve üzeri)
@media (min-width: 1400px) { ... }
```

### Max-width

Zaman zaman başka bir yönde (verilen ekran boyutu *veya daha küçük*) giden medya sorguları kullanıyoruz:

```scss
// xs kırılma noktası için medya sorgusu gerekli değil çünkü etkili olarak `@media (max-width: 0) { ... }`
@include media-breakpoint-down(sm) { ... }
@include media-breakpoint-down(md) { ... }
@include media-breakpoint-down(lg) { ... }
@include media-breakpoint-down(xl) { ... }
@include media-breakpoint-down(xxl) { ... }

// Örnek: Orta kırılma noktasından aşağıya stil uygulama
@include media-breakpoint-down(md) {
  .custom-class {
    display: block;
  }
}
```

:::warning
Bu miksinler, belirtilen kırılma noktalarından `.02px` çıkarır ve bunları `max-width` değerlerimiz olarak kullanır. 
:::

```scss
// `xs` yalnızca bir kural seti döndürür ve medya sorgusu yoktur
// ... { ... }

// `sm`, x-küçük cihazlara (dikey telefonlar, 576px'den daha küçük) uygulanır
@media (max-width: 575.98px) { ... }

// `md`, küçük cihazlara (yatay telefonlar, 768px'den daha küçük) uygulanır
@media (max-width: 767.98px) { ... }

// `lg`, orta cihazlara (tabletler, 992px'den daha küçük) uygulanır
@media (max-width: 991.98px) { ... }

// `xl`, büyük cihazlara (masaüstleri, 1200px'den daha küçük) uygulanır
@media (max-width: 1199.98px) { ... }

// `xxl`, x-büyük cihazlara (büyük masaüstleri, 1400px'den daha küçük) uygulanır
@media (max-width: 1399.98px) { ... }
```

### Tek Kırılma Noktası

Ayrıca, minimum ve maksimum kırılma noktasını kullanarak bir ekran boyutları segmentini hedeflemek için medya sorguları ve miksinler mevcuttur.

```scss
@include media-breakpoint-only(xs) { ... }
@include media-breakpoint-only(sm) { ... }
@include media-breakpoint-only(md) { ... }
@include media-breakpoint-only(lg) { ... }
@include media-breakpoint-only(xl) { ... }
@include media-breakpoint-only(xxl) { ... }
```

Örneğin `@include media-breakpoint-only(md) { ... }` şu sonucu verir:

```scss
@media (min-width: 768px) and (max-width: 991.98px) { ... }
```

### Kırılma Noktaları Arasında

Benzer şekilde, medya sorguları birden fazla kırılma noktası genişliğini kapsayacak şekilde olabilir:

```scss
@include media-breakpoint-between(md, xl) { ... }
```

Bu, şu sonucu verir:

```scss
// Örnek
// Orta cihazlardan başlayarak ekstra büyük cihazlara kadar stilleri uygulayın
@media (min-width: 768px) and (max-width: 1199.98px) { ... }
```