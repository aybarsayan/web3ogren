---
layout: docs
title: Görünüm özelliği
description: Bileşenlerin görünüm değerini değiştirirken, hızlı ve yanıt verebilir görünüm yardımcıları altında çeşitli teknikler kullanabilirsiniz. Bu içerik, görünüm değerleri ve bunların nasıl uygulanacağı hakkında detaylı bilgi sunmaktadır.
keywords: [görünüm, display, responsive, sınıflar, CSS, SCSS, yanıt verebilir]
---

## Nasıl çalışır

[`display` özelliğinin](https://developer.mozilla.org/en-US/docs/Web/CSS/display) değerini yanıt verebilir görünüm yardımcı sınıflarımız ile değiştirin. **Sınıflar**, ihtiyaç duyduğunuz çeşitli etkileri elde etmek için birleştirilebilir. Bu, esnek ve etkili bir tasarım sağlar.

## Notasyon

:::info
Tüm `kırılmalar` için uygulanan görünüm yardımcı sınıflarının `xs`'den `xxl`'ye kadar hiçbir kırılma kısaltması yoktur. Sınıflar, `min-width: 0;`'dan itibaren uygulanır.
:::

Bununla birlikte, geri kalan kırılmalar bir kırılma kısaltması içerir. 

Bu nedenle, sınıflar şu formatta adlandırılır:

- `.d-{value}` `xs` için
- `.d-{breakpoint}-{value}` `sm`, `md`, `lg`, `xl` ve `xxl` için.

Değer *value* olarak şunlardan biri:

- `none`
- `inline`
- `inline-block`
- `block`
- `grid`
- `inline-grid`
- `table`
- `table-cell`
- `table-row`
- `flex`
- `inline-flex`

Görünüm değerleri, `$displays` değişkenini değiştirerek ve SCSS'i yeniden derleyerek **değiştirilebilir**.

---

## Örnekler


d-inline
d-inline

d-block
d-block
## Elemanları gizleme

:::tip
Hızlı ve mobil dostu geliştirme için cihaz tarafından elemanları göstermek ve gizlemek için yanıt verebilir görünüm sınıflarını kullanın. Tüm ekran boyutları için elemanları yanıt verebilir şekilde gizlemek daha etkilidir.
:::

Elemanları gizlemek için basitçe `.d-none` sınıfını veya herhangi bir yanıt verebilir ekran varyasyonu için `.d-{sm,md,lg,xl,xxl}-none` sınıflarından birini kullanın.

#### Ekranı Gizleme Sınıfları:

| Ekran boyutu | Sınıf |
| --- | --- |
| Tümünde Gizli | `.d-none` |
| Sadece xs'de Gizli | `.d-none .d-sm-block` |
| Sadece sm'de Gizli | `.d-sm-none .d-md-block` |
| Sadece md'de Gizli | `.d-md-none .d-lg-block` |
| Sadece lg'de Gizli | `.d-lg-none .d-xl-block` |
| Sadece xl'de Gizli | `.d-xl-none .d-xxl-block` |
| Sadece xxl'de Gizli | `.d-xxl-none` |
| Tümünde Görünür | `.d-block` |
| Sadece xs'de Görünür | `.d-block .d-sm-none` |
| Sadece sm'de Görünür | `.d-none .d-sm-block .d-md-none` |
| Sadece md'de Görünür | `.d-none .d-md-block .d-lg-none` |
| Sadece lg'de Görünür | `.d-none .d-lg-block .d-xl-none` |
| Sadece xl'de Görünür | `.d-none .d-xl-block .d-xxl-none` |
| Sadece xxl'de Görünür | `.d-none .d-xxl-block` |


lg ve daha geniş ekranlarda gizle
lg'den daha küçük ekranlarda gizle
## Yazdırmada Görünüm

Yazdırırken elemanların `display` değerini değiştirmek için yazdırma görünüm yardımcı sınıflarımızı kullanın. Yazdırma için `.d-*` yardımcılarımızla aynı `display` değerlerini destekler.

**Yazdırma için Kullanılabilir Sınıflar:**

- `.d-print-none`
- `.d-print-inline`
- `.d-print-inline-block`
- `.d-print-block`
- `.d-print-grid`
- `.d-print-inline-grid`
- `.d-print-table`
- `.d-print-table-row`
- `.d-print-table-cell`
- `.d-print-flex`
- `.d-print-inline-flex`

Yazdırma ve görünüm sınıfları birleştirilebilir.


Ekran Yalnızca (Yazdırma sırasında gizle)
Yalnızca Yazdır (Ekranda yalnızca gizle)
Ekranda büyük olana kadar gizle, ama her zaman yazdırma sırasında göster
## Sass

### Yardımcı API

Görünüm yardımcıları, `scss/_utilities.scss` içinde yardımcı API'mizde belirtilmiştir. :::note
`Yardımcı API'yi nasıl kullanacağınızı öğrenin.`
:::

