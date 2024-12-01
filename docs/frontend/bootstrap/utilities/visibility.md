---
description: Görünümünü değiştirmeden, elementlerin görünürlüğünü kontrol edin, görünürlük yardımcıları ile. Bu rehberde, elementlerin görünürlüğünü etkili bir şekilde nasıl yöneteceğinizi keşfedin.
keywords: [görünürlük, yardımcı sınıflar, .visible, .invisible, Sass, front-end, CSS]
---

# Görünürlük 

Elementlerin `visibility` değerini görünürlük yardımcılarımızla ayarlayın. Bu yardımcı sınıflar `display` değerini hiç değiştirmez ve düzeni etkilemez - `.invisible` sınıfına sahip elementler sayfada hala yer kaplar.

:::warning
`.invisible` sınıfına sahip elementler hem görsel olarak hem de yardımcı teknoloji/ekran okuyucu kullanıcıları için gizlenecektir.
:::

Gerekli olduğunda `.visible` veya `.invisible` uygulayın.

```html
<div class="visible">...</div>
<div class="invisible">...</div>
```

```scss
// Sınıf
.visible {
  visibility: visible !important;
}
.invisible {
  visibility: hidden !important;
}
```

## Sass

### Araçlar API'si

Görünürlük yardımcıları, `scss/_utilities.scss` dosyasında araçlar API'mizde tanımlanmıştır. `Araçlar API'sini nasıl kullanacağınızı öğrenin.`

:::note
Bu yardımcı sınıflar, sayfa düzenini korurken, belirli elementlerin görünürlüğünü yönetmek için mükemmeldir.
:::

