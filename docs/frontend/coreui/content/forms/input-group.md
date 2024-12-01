---
layout: docs
title: Girdi grubu
description: Metin, butonlar veya buton gruplarını metin girdilerinin, özel seçimlerin ve özel dosya girdilerinin her iki tarafına ekleyerek form kontrollerini kolayca uzatın. Bu doküman, girdi gruplarının nasıl oluşturulacağını ve özelleştirileceğini detaylandırmaktadır.
keywords: [girdi grubu, form kontrolleri, buton eklentileri, özel seçimler, bootstrap]
---

## Temel örnek

Bir girdinin her iki tarafına bir eklenti veya buton yerleştirin. Ayrıca bir girdi üzerine her iki tarafta bir tane de yerleştirebilirsiniz. `` etiketlerini girdi grubunun dışında koymayı unutmayın.

  @
  



  
  @example.com


Kişi URL'niz

  https://example.com/users/
  



  $
  
  .00



  
  @
  



  Metin alanı ile
  

## Sarma

:::info
Girdi grupları, bir girdi grubundaki özel form alanı doğrulamasını karşılamak için varsayılan olarak `flex-wrap: wrap` ile sarılıdır. Bunu `.flex-nowrap` ile devre dışı bırakabilirsiniz.
:::

  @
  

## Boyutlandırma

Göreceli form boyutlandırma sınıflarını `.input-group` üzerine ekleyin ve içerikler otomatik olarak yeniden boyutlandırılacaktır—her bir elemana form kontrol boyutlandırma sınıflarını tekrar etmeye gerek yoktur.

**Bireysel girdi grubu elemanlarımızda boyutlandırma desteklenmiyor.**

  Küçük
  



  Varsayılan
  



  Büyük
  

## Onay kutuları ve radyo düğmeleri

Herhangi bir onay kutusu veya radyo seçeneğini, bir girdi grubunun eklentisi içinde metin yerine yerleştirin. Görünür bir metin yoksa `.form-check-input` üzerine `.mt-0` eklemenizi öneririz.

:::tip
Onay kutuları için, daha iyi bir görünüm sağlamak adına *mt-0* sınıfını kullanmayı unutmayın.
:::

  
    
  
  



  
    
  
  

## Birden fazla girdi

Birden fazla `` görsel olarak desteklenirken, doğrulama stilleri yalnızca tek bir `` içeren girdi grupları için mevcuttur.

:::warning
Birden fazla girdi kullanırken, tekil doğrulama stillerinin geçerli olmadığını göz önünde bulundurun.
:::

  Ad ve soyad
  
  

## Birden fazla eklenti

Birden fazla eklenti desteklenir ve onay kutusu ve radyo girişi sürümleriyle karıştırılabilir.

  $
  0.00
  



  
  $
  0.00

## Buton eklentileri

  Buton
  



  
  Buton



  Buton
  Buton
  



  
  Buton
  Buton

## Aşağı açılır butonlar

  Aşağı Açılır
  
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayırıcı link
  
  



  
  Aşağı Açılır
  
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayırıcı link
  



  Aşağı Açılır
  
    Eylem öncesi
    Başka bir eylem öncesi
    Burada başka bir şey
    
    Ayırıcı link
  
  
  Aşağı Açılır
  
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayırıcı link
  

## Segmentli butonlar

  Eylem
  
    Aşağı Açılır'ı Değiştir
  
  
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayırıcı link
  
  



  
  Eylem
  
    Aşağı Açılır'ı Değiştir
  
  
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayırıcı link
  

## Özel formlar

Girdi grupları özel seçimler ve özel dosya girdileri için destek içerir. Bu konuda tarayıcı varsayılan versiyonları desteklenmemektedir.

### Özel seçim

  Seçenekler
  
    Seçin...
    Bir
    İki
    Üç
  



  
    Seçin...
    Bir
    İki
    Üç
  
  Seçenekler



  Buton
  
    Seçin...
    Bir
    İki
    Üç
  



  
    Seçin...
    Bir
    İki
    Üç
  
  Buton

### Özel dosya girişi

  Yükle
  



  
  Yükle



  Buton
  



  
  Buton

## Özelleştirme

### SASS değişkenleri
