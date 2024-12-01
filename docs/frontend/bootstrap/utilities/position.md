---
description: Bu döküman, öğelerin pozisyonunu hızla yapılandırmak için çeşitli kısayollar ve yöntemler sunar. Farklı pozisyon değerleri ve nasıl kullanılacağına dair örnekler içerir.
keywords: [pozisyon, CSS, Bootstrap, yardımcı sınıflar, öğe düzenleme, Sass, UI]
---

# Pozisyon

## Pozisyon değerleri

Hızlı pozisyon sınıfları mevcuttur, ancak bunlar duyarlı değildir.

```html
<div class="position-static">...</div>
<div class="position-relative">...</div>
<div class="position-absolute">...</div>
<div class="position-fixed">...</div>
<div class="position-sticky">...</div>
```

## Öğeleri düzenle

:::tip
Kenar pozisyonlama yardımcılarıyla öğeleri kolayca düzenleyin. Format `{property}-{position}` şeklindedir.
:::

*property* bir tanesi:

- `top` - dikey `üst` pozisyon için
- `start` - yatay `sol` pozisyon için (LTR'de)
- `bottom` - dikey `alt` pozisyon için
- `end` - yatay `sağ` pozisyon için (LTR'de)

*position* bir tanesi:

- `0` - `0` kenar pozisyonu için
- `50` - `50%` kenar pozisyonu için
- `100` - `100%` kenar pozisyonu için

(Daha fazla pozisyon değeri eklemek için `$position-values` Sass haritası değişkenine girişler ekleyebilirsiniz.)

  
  
  
  
  
  

## Öğeleri ortala

Ayrıca, öğeleri `.translate-middle` dönüşüm yardımcı sınıfı ile de ortalayabilirsiniz.

:::info
Bu sınıf, öğeye `translateX(-50%)` ve `translateY(-50%)` dönüşümlerini uygular ve kenar pozisyonlama yardımcılarıyla birleştiğinde, bir öğeyi mutlak olarak ortalamanızı sağlar.
:::

  
  
  
  
  
  
  
  
  

`.translate-middle-x` veya `.translate-middle-y` sınıflarını ekleyerek, öğeleri yalnızca yatay veya dikey yönde konumlandırabilirsiniz.

  
  
  
  
  
  
  
  
  

## Örnekler

İşte bu sınıfların bazı gerçek yaşam örnekleri:

  Mailler +99 okunmamış mesaj



  İşaretçi 



  Uyarılar okunmamış mesaj

Bu sınıfları mevcut bileşenlerle kullanarak yeni bileşenler oluşturabilirsiniz. `$position-values` değişkenine girişler ekleyerek işlevselliğini genişletmeyi unutmayın.

  
    
  
  1
  2
  3

## Sass

### Haritalar

Varsayılan pozisyon yardımcı değerleri bir Sass haritasında tanımlanır ve daha sonra yardımcılarımızı oluşturmak için kullanılır.

### Yardımcı API'si

Pozisyon yardımcıları, `scss/_utilities.scss` dosyasında yardımcı API'mizde tanımlanır. `Yardımcı API'sini nasıl kullanacağınızı öğrenin.`

