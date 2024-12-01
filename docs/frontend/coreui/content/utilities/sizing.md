---
description: Boyutlandırma yardımcı programları ile öğelerin genişlik ve yükseklik ayarlarını kolayca yapın. Farklı boyut seçenekleri ve özelleştirme ile kendi ihtiyaçlarınıza uygun hale getirin.
keywords: [boyutlandırma, genişlik, yükseklik, yardımcı programlar, SCSS]
---

# Boyutlama

## Ebeveynle İlişkili

Genişlik ve yükseklik yardımcı programları `_utilities.scss` dosyasındaki yardımcı program API'sinden üretilir. Varsayılan olarak `25%`, `50%`, `75%`, `100%` ve `auto` desteği içerir. Burada farklı yardımcı programlar oluşturmak için bu değerleri ihtiyacınıza göre değiştirebilirsiniz.

:::tip
Genişlik ve yükseklik ayarlarını yaparken, her iki yönü de göz önünde bulundurmanız önerilir.
:::


Genişlik %25
Genişlik %50
Genişlik %75
Genişlik %100
Genişlik otomatik
  Yükseklik %25
  Yükseklik %50
  Yükseklik %75
  Yükseklik %100
  Yükseklik otomatik

Gerekirse `max-width: 100%;` ve `max-height: 100%;` yardımcı programlarını da kullanabilirsiniz.

:::info
`max-width` ve `max-height` özellikleri, öğelerinizin ekran boyutlarına göre daha esnek olmasını sağlar.
:::



  Maksimum yükseklik %100

## Görünüm Penceresine Göre

Genişlik ve yüksekliği görünüm penceresine göre ayarlamak için yardımcı programları da kullanabilirsiniz.

```html
<div class="min-vw-100">Minimum genişlik 100vw</div>
<div class="min-vh-100">Minimum yükseklik 100vh</div>
<div class="vw-100">Genişlik 100vw</div>
<div class="vh-100">Yükseklik 100vh</div>
```

## Sass

### Yardımcı Programlar API'si

Boyutlandırma yardımcı programları `scss/_utilities.scss` dosyasındaki yardımcı program API'sinde tanımlanmıştır. **`Yardımcı program API'sini nasıl kullanacağınızı öğrenin.`**

:::note
Sass ile özelleştirilmiş yardımcı programlar oluşturmak, tasarım sisteminize uyum sağlamak için yararlı bir stratejidir.
:::

