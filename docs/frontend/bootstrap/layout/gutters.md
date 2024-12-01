---
description: Kenarlar, CoreUI for Bootstrap ızgara sisteminde içeriği duyarlı bir şekilde boşluklandırmak ve hizalamak için kullanılan sütunlar arasındaki boşluktur. Bu kılavuz, kenar sınıflarının nasıl kullanılacağını ve ayarlanacağını ayrıntılı bir şekilde açıklar.
keywords: [CoreUI, Bootstrap, ızgara sistemi, kenar, boşluk, duyarlı tasarım, sütun hizalaması]
layout: docs
title: Kenarlar
group: layout
toc: true
bootstrap: true
---

## Nasıl çalışır

- **Kenarlar, sütun içeriği arasındaki boşluklardır ve bu boşluk yatay `padding` ile oluşturulur.** Her sütunda `padding-right` ve `padding-left` ayarlıyoruz ve içeriği hizalamak için her satırın başlangıcında ve sonunda bunu karşılamak için negatif `margin` kullanıyoruz.

:::tip
Kenar genişliklerinin doğru ayarlanması, tasarımınızın geneli üzerinde büyük bir etkiye sahip olabilir.
:::

- **Kenarlar `1.5rem` (`24px`) genişliğinde başlar.** Bu, ızgaramızın `padding ve margin aralıkları` ölçeği ile eşleşmesini sağlar.

- **Kenarlar duyarlı bir şekilde ayarlanabilir.** Yatay kenarları, dikey kenarları ve tüm kenarları değiştirmek için kesim noktalarına özgü kenar sınıflarını kullanın.

## Yatay kenarlar

`.gx-*` sınıfları yatay kenar genişliklerini kontrol etmek için kullanılabilir. Daha büyük kenar kullanıldığında, `.container` veya `.container-fluid` ebeveyninin de ayarlanması gerekebilir; bu, istenmeyen taşmayı önlemek için eşleşen bir padding aracı kullanılarak yapılmalıdır. Örneğin, aşağıdaki örnekte `.px-4` ile padding'i artırdık:

  
    
     Özel sütun padding'i
    
    
      Özel sütun padding'i
    
  

Alternatif bir çözüm, `.row` etrafına `.overflow-hidden` sınıfını eklemek olabilir:

  
    
     Özel sütun padding'i
    
    
      Özel sütun padding'i
    
  

## Dikey kenarlar

`.gy-*` sınıfları dikey kenar genişliklerini kontrol etmek için kullanılabilir. Yatay kenarlar gibi, dikey kenarlar, bir sayfanın sonunda `.row` altında bazı taşmalara neden olabilir. Bu gerçekleşirse, `.row` etrafına `.overflow-hidden` sınıfı ekleyerek çözebilirsiniz:

  
    
      Özel sütun padding'i
    
    
      Özel sütun padding'i
    
    
      Özel sütun padding'i
    
    
      Özel sütun padding'i
    
  

## Yatay ve dikey kenarlar

`.g-*` sınıfları hem yatay hem de dikey kenar genişliklerini kontrol etmek için kullanılabilir. Aşağıdaki örnekte daha küçük bir kenar genişliği kullanıyoruz, bu nedenle `.overflow-hidden` sarmalayıcı sınıfını eklemeye gerek yoktur.

  
    
      Özel sütun padding'i
    
    
      Özel sütun padding'i
    
    
      Özel sütun padding'i
    
    
      Özel sütun padding'i
    
  

## Satır sütun kenarları

Kenar sınıfları `satır sütunlarına` da eklenebilir. Aşağıdaki örnekte duyarlı satır sütunları ve duyarlı kenar sınıfları kullanıyoruz.

  
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
    
      Satır sütunu
    
  

## Kenarsız

Önceden tanımlanmış ızgara sınıflarımızdaki sütunlar arasındaki kenarlar `.g-0` ile kaldırılabilir. Bu, `.row`'dan negatif `margin`'leri ve tüm doğrudan çocuk sütunlardan yatay `padding`'leri kaldırır.

**Kenar-kere tasarımı mı gerekiyor?** Ebeveyn `.container` veya `.container-fluid`'ı çıkarın ve taşmayı önlemek için `.row`'a `.mx-0` ekleyin.

:::info
Pratikte, bu şekilde görünüyor. Bütün diğer önceden tanımlanmış ızgara sınıflarıyla (sütun genişlikleri, duyarlı katmanlar, yeniden sıralamalar ve daha fazlası dahil) kullanmaya devam edebilirsiniz.
:::

  .col-sm-6 .col-md-8
  .col-6 .col-md-4

## Kenarları değiştirme

Sınıflar, `$spacers` Sass haritasından miras alınan `$gutters` Sass haritasından oluşturulmuştur.

```scss
$grid-gutter-width: 1.5rem;
$gutters: (
  0: 0,
  1: $spacer * .25,
  2: $spacer * .5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3,
);
```