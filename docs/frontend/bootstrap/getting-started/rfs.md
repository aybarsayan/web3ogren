---
description: CoreUI'nin boyutlandırma motoru, yaygın CSS özelliklerini, görünüm alanları ve cihazlar arasında mevcut alanı daha iyi kullanmak için responsive olarak ölçeklendirir. RFS, görsel tasarım süreçlerine esneklik katmak amacıyla tasarlanmıştır.
keywords: [RFS, Responsive Font Sizes, CoreUI, CSS, boyutlandırma motoru, responsive tasarım, proje]
---

## RFS Nedir?

Bootstrap'ın yan projesi [RFS](https://github.com/twbs/rfs/tree/), başlangıçta yazı tipi boyutlarını yeniden boyutlandırmak için geliştirilmiş bir birim boyutlandırma motorudur (bu nedenle Responsive Font Sizes için kısaltmasıdır). Günümüzde RFS, `margin`, `padding`, `border-radius` veya hatta `box-shadow` gibi birim değerine sahip çoğu CSS özelliğini yeniden ölçeklendirme yeteneğine sahiptir.

:::info
Mekanik, tarayıcı görünüm alanının boyutlarına dayalı olarak uygun değerleri otomatik olarak hesaplar. Responsive ölçeklendirme davranışını sağlamak için `rem` ve görünüm alanı birimlerinin bir karışımını içeren `calc()` fonksiyonlarına derlenecektir.
:::

## RFS Kullanımı

Mixin'ler CoreUI'de yer almaktadır ve CoreUI'nin `scss`'si eklendikten sonra kullanılabilir hale gelir. RFS, gerektiğinde [bağımsız olarak kurulabilir](https://github.com/twbs/rfs/tree/v#installation).

### Mixin'leri Kullanma

`rfs()` mixin'i `font-size`, `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`, `padding`, `padding-top`, `padding-right`, `padding-bottom` ve `padding-left` için kısayollar sunar. Aşağıdaki örnekte kaynak Sass ve derlenmiş CSS örneğini görebilirsiniz.

> **Önemli Not:** RFS, responsive tasarım alanında büyük avantajlar sunar. 
> — RFS Kullanımı

```scss
.title {
  @include font-size(4rem);
}
```

```css
.title {
  font-size: calc(1.525rem + 3.3vw);
}

@media (min-width: 1200px) {
  .title {
    font-size: 4rem;
  }
}
```

Başka herhangi bir özellik `rfs()` mixin'ine bu şekilde geçilebilir:

```scss
.selector {
  @include rfs(4rem, border-radius);
}
```

`!important` değerini istediğiniz her şeye ekleyebilirsiniz:

```scss
.selector {
  @include padding(2.5rem !important);
}
```

### Fonksiyonları Kullanma

Includes kullanmak istemediğinizde, ayrıca iki fonksiyon da vardır:

- `rfs-value()` bir değeri, bir `px` değeri geçirilirse `rem` değerine dönüştürür, diğer durumlarda aynı sonucu döndürür.
- `rfs-fluid-value()` bir değerin sıvı versiyonunu, özellik yeniden ölçeklendirmeye ihtiyaç duyuyorsa döndürür.

:::tip
Bu örnekte, sadece `lg` kırılma noktasının altındaki stilleri uygulamak için CoreUI'nin Bootstrap için oluşturulmuş `responsive breakpoint mixins` karışımlarından birini kullanıyoruz.
:::

```scss
.selector {
  @include media-breakpoint-down(lg) {
    padding: rfs-fluid-value(2rem);
    font-size: rfs-fluid-value(1.125rem);
  }
}
```

```css
@media (max-width: 991.98px) {
  .selector {
    padding: calc(1.325rem + 0.9vw);
    font-size: 1.125rem; /* 1.125rem yeterince küçük, bu yüzden RFS bunu yeniden ölçeklendirmeyecek */
  }
}
```

## Genişletilmiş belge

RFS, Bootstrap organizasyonunun altında ayrı bir projedir. RFS ve konfigürasyonu hakkında daha fazla bilgi [GitHub deposu](https://github.com/twbs/rfs/tree/) üzerinde bulunabilir.