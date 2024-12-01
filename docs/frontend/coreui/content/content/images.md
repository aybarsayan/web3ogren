---
description: Bu belge, görsellerin responsive davranışına uygun hale getirilmesi ve stil eklenmesi ile ilgili bilgiler sunmaktadır. Görsel hizalama ve özelleştirme konularında örneklerle birlikte temel prensipler açıklanmaktadır.
keywords: [responsive görseller, görsel küçük resimleri, Bootstrap, görsel hizalama, özelleştirme]
---

# Resimler

## Responsive görseller

CoreUI'daki Bootstrap görselleri, `.img-fluid` ile responsive hale getirilmiştir. Bu, görsele `max-width: 100%;` ve `height: auto;` uygulayarak, ebeveyn öğesi ile ölçeklenmesini sağlar.



## Görsel küçük resimleri

:::tip
Bir görsele yuvarlak 1 piksel kenar görünümü vermek için `.img-thumbnail` sınıfını kullanabilirsiniz.
:::

`border-radius yardımcı programları` ek olarak, `.img-thumbnail` sınıfını kullanarak görselinizin kenarlarını yuvarlayabilirsiniz.



## Görselleri hizalama

Görselleri `yardımcı akış sınıfları` veya `metin hizalama sınıfları` ile hizalayın. `block` düzeyindeki görseller, `.mx-auto` marj yardımcı sınıfını` kullanarak ortalanabilir.






  ## Resim

Bir `` öğesi kullanarak belirli bir `` için birden fazla `` öğesi belirliyorsanız, `.img-*` sınıflarını `` etiketine eklediğinizden emin olun ve `` etiketine eklemeyin.

```html
<picture>
  <source srcset="..." type="image/svg+xml">
  <img src="..." class="img-fluid img-thumbnail" alt="...">
</picture>
```

> Görsel sınıflarını doğru yerde kullanmak **görsel uyumluluğu** artırır.  
> — Bootstrap Belgeleri

## Özelleştirme

### SASS değişkenleri

Görsel küçük resimleri için değişkenler mevcuttur.

