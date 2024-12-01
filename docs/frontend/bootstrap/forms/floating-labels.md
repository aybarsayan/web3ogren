---
description: Girdi alanlarınızın üzerinde yüzen güzel ve basit form etiketleri oluşturun. Bu kılavuz, Bootstrap için CoreUI ile yüzen etiketlerin nasıl etkinleştirileceğini adım adım anlatmaktadır.
keywords: [yüzen etiketler, Bootstrap, CoreUI, form elemanları, kullanıcı deneyimi]
title: Yüzen Etiketler
---


## Örnek

Bir çift `` ve `` öğesini `.form-floating` içinde sararak, Bootstrap için CoreUI ile yüzen etiketleri etkinleştirin. Her `` için bir `placeholder` gereklidir çünkü CSS yalnızca yüzen etiketler yöntemimiz `:placeholder-shown` pseudo-elementini kullanır. Ayrıca ``'in önce gelmesi gerektiğini unutmayın, böylece bir kardeş seçici (örneğin, `~`) kullanabiliriz.

  
  E-posta adresi


  
  Şifre

:::tip
Zaten tanımlı bir `value` olduğunda, `` otomatik olarak yüzen konumuna ayarlanacaktır.
:::

  
  Değerli giriş

:::info
Form doğrulama stilleri de beklenildiği gibi çalışır.
:::

  
  Geçersiz giriş

## Metin Alanları

Varsayılan olarak, `.form-control` ile birlikteki `` öğeleri, `` öğeleri ile aynı yüksekliğe sahip olacaktır.

  
  Yorumlar

``'nize özel bir yükseklik ayarlamak için `rows` özelliğini kullanmayın. Bunun yerine, açık bir `height` ayarlayın (ister satır içi, ister özel CSS ile).

  
  Yorumlar

## Seçimler

`.form-control` dışındaki, yüzen etiketler yalnızca `.form-select` üzerinde mevcuttur. Aynı şekilde çalışır, ancak ``'lerin aksine, her zaman ``'i yüzen durumda gösterecektir. **Boyut ve çoklu olan seçimler desteklenmez.**

  
    Bu seçim menüsünü aç
    Bir
    İki
    Üç
  
  Seçimlerle çalışır

## Devre Dışı

Bir girdi, bir metin kutusu veya bir seçim öğesine `disabled` boolean niteliğini ekleyerek, gri bir görünüm kazandırabilir, tıklama olaylarını kaldırabilir ve odaklanmayı engelleyebilirsiniz.

  
  E-posta adresi


  
  Yorumlar


  İçinde bazı metin bulunan devre dışı metin alanı
  Yorumlar


  
    Bu seçim menüsünü aç
    Bir
    İki
    Üç
  
  Seçimlerle çalışır

## Salt Okunur Düz Metin

Yüzen etiketler aynı zamanda `.form-control-plaintext`'i de destekler, bu da bir düzenleme yapılabilir ``'ten, sayfa düzenini etkilemeden düz bir değere geçiş yapmak için yararlı olabilir.

  
  Boş giriş


  
  Değerli giriş

## Düzen

CoreUI'nın Bootstrap ızgara sistemi ile çalışırken, form öğelerini sütun sınıfları içine yerleştirdiğinizden emin olun.

  
    
      
      E-posta adresi
    
  
  
    
      
        Bu seçim menüsünü aç
        Bir
        İki
        Üç
      
      Seçimlerle çalışır
    
  

## Özelleştirme

### SASS Değişkenleri

