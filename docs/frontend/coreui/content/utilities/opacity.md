---
description: Opaklık özelliği ile elemanların görünürlük seviyesini kontrol edin. Opaklık değerleri ile kullanıcı arayüzünüze farklı şeffaflık düzeyleri ekleyin.
keywords: [opacity, şeffaflık, kullanıcı arayüzü, yardımcı sınıflar, CSS özellikleri]
---

# Opaklık

`opacity` özelliği, bir elemanın opaklık seviyesini ayarlar. Opaklık seviyesi, `1` hiç şeffaf olmamak üzere, `.5` %50 görünürlükte ve `0` tamamen şeffaf olacak şekilde şeffaflık seviyesini tanımlar.

:::tip
**İpucu:** Opaklık değerlerini, uygulamanızda daha iyi kullanıcı deneyimi sağlamak için dikkatli bir şekilde seçin.
:::

Bir elemanın `opacity` değerini `.opacity-{value}` yardımcı sınıflarını kullanarak ayarlayın.


  %100
  %75
  %50
  %25
  %0


```html
<div class="opacity-100">...</div>
<div class="opacity-75">...</div>
<div class="opacity-50">...</div>
<div class="opacity-25">...</div>
<div class="opacity-0">...</div>
```

:::info
Opaklık sınıflarının kullanımı, CSS ile stilize etmiş olduğunuz bileşenlere kolaylıkla entegrasyon sağlar.
:::

### Utilities API

Opaklık yardımcı sınıfları, `scss/_utilities.scss` dosyasındaki yardımcı sınıf API'mizde tanımlanmıştır. `Yardımcı sınıf API'sini nasıl kullanacağınızı öğrenin.`

> "Opaklık, kullanıcı arayüzünüzde derinlik ve katman yaratmanın harika bir yoludur."  
> — Dokümantasyon Ekibi

