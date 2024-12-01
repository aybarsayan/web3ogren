---
layout: docs
title: Pozisyon
description: Bu belgede, farklı pozisyon yardımcı işlevlerinin nasıl kullanılacağını keşfedin. Sabit ve yapışkan pozisyonların nasıl yapılandırılacağı ve duyarlı varyasyonların kullanılacağı hakkında bilgi bulun. 
keywords: [pozisyon, sabit üst, yapışkan, duyarlı, CSS, web tasarımı, kullanıcı deneyimi]
---

## Sabit üst

Bir öğeyi görünüm alanının üst kısmına, kenardan kenara yerleştirin. Projenizde sabit pozisyonun sonuçlarını anladığınızdan emin olun; ek CSS eklemeniz gerekebilir.

```html
<div class="fixed-top">...</div>
```

## Sabit alt

Bir öğeyi görünüm alanının alt kısmına, kenardan kenara yerleştirin. Projenizde sabit pozisyonun sonuçlarını anladığınızdan emin olun; ek CSS eklemeniz gerekebilir.

```html
<div class="fixed-bottom">...</div>
```

## Yapışkan üst

Bir öğeyi görünüm alanının üst kısmına, kenardan kenara yerleştirin, ancak yalnızca onun üzerinden kaydırdığınızda.

```html
<div class="sticky-top">...</div>
```

:::info
**Unutmayın:** Yapışkan üst pozisyon, kullanıcı kaydırdıkça görünür kalmaktadır, bu nedenle kullanımı dikkatli bir şekilde değerlendirilmelidir.
:::

## Duyarlı yapışkan üst

Duyarlı varyasyonlar `.sticky-top` yardımcı işlevi için de mevcuttur.

```html
<div class="sticky-sm-top">SM (küçük) boyutundaki veya daha geniş görünüm alanlarında üstte kalır</div>
<div class="sticky-md-top">MD (orta) boyutundaki veya daha geniş görünüm alanlarında üstte kalır</div>
<div class="sticky-lg-top">LG (büyük) boyutundaki veya daha geniş görünüm alanlarında üstte kalır</div>
<div class="sticky-xl-top">XL (ekstra büyük) boyutundaki veya daha geniş görünüm alanlarında üstte kalır</div>
<div class="sticky-xxl-top">XXL (ekstra ekstra büyük) boyutundaki veya daha geniş görünüm alanlarında üstte kalır</div>
```

## Yapışkan alt

Bir öğeyi görünüm alanının alt kısmına, kenardan kenara yerleştirin, ancak yalnızca onun üzerinden kaydırdığınızda.

```html
<div class="sticky-bottom">...</div>
```

:::tip
**İpucu:** Duyarlı yapışkan alt pozisyonları kullanarak, farklı cihaz boyutları için optimize edilmiş bir kullanıcı deneyimi sunabilirsiniz.
:::

## Duyarlı yapışkan alt

Duyarlı varyasyonlar `.sticky-bottom` yardımcı işlevi için de mevcuttur.

```html
<div class="sticky-sm-bottom">SM (küçük) boyutundaki veya daha geniş görünüm alanlarında altta kalır</div>
<div class="sticky-md-bottom">MD (orta) boyutundaki veya daha geniş görünüm alanlarında altta kalır</div>
<div class="sticky-lg-bottom">LG (büyük) boyutundaki veya daha geniş görünüm alanlarında altta kalır</div>
<div class="sticky-xl-bottom">XL (ekstra büyük) boyutundaki veya daha geniş görünüm alanlarında altta kalır</div>
<div class="sticky-xxl-bottom">XXL (ekstra ekstra büyük) boyutundaki veya daha geniş görünüm alanlarında altta kalır</div>
```