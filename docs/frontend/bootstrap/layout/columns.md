---
layout: docs
title: Sütunlar
description: Flexbox ızgara sistemimizin sunduğu bir dizi seçenekle sütunları nasıl değiştireceğinizi öğrenin. Ayrıca, ızgara olmayan elemanların genişliklerini yönetmek için sütun sınıflarını nasıl kullanacağınızı görün.
keywords: [flexbox, sütun, izgara, Bootstrap, hizalama, düzen, responsive]
---


**Dikkat!** `Izgara sayfasını` okumadan önce sütunları nasıl değiştireceğinizi ve özelleştireceğinizi öğrenmeyin.
## Çalışma Prensibi

- **Sütunlar, ızgaranın flexbox mimarisine dayanır.** Flexbox, bireysel sütunları ve `satır düzeyindeki sütun gruplarını değiştirme` seçeneğimiz olduğu anlamına gelir. Sütunların nasıl büyüyeceğini, küçüleceğini veya başka şekilde değişeceğini seçersiniz.

- **Izgara düzenleri oluştururken tüm içerik sütunlara yerleştirilir.** CoreUI için Bootstrap'ın ızgara hiyerarşisi, `konteynerden` başlayarak satıra, sütuna ve içeriğe kadar uzanır. Nadir durumlarda içeriği ve sütunları birleştirebilirsiniz, fakat bunun beklenmedik sonuçları olabileceğini unutmayın.

- **CoreUI için Bootstrap, hızlı ve duyarlı düzenler oluşturmak için önceden tanımlanmış sınıflar içerir.** `Altı kırılma noktası` ve her ızgara katmanında on iki sütun ile, istediğiniz düzenleri oluşturmak için önceden yapılandırılmış onlarca sınıfımız var. Dilerseniz bunu Sass üzerinden devre dışı bırakabilirsiniz.

---

## Hizalama

Sütunları dikey ve yatay olarak hizalamak için flexbox hizalama yardımcılarını kullanın.

### Dikey hizalama

  
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
  
  
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
  
  
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
  

  
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
    
      Üç sütundan biri
    
  

### Yatay hizalama

  
    
      İki sütundan biri
    
    
      İki sütandan biri
    
  
  
    
      İki sütandan biri
    
    
      İki sütandan biri
    
  
  
    
      İki sütandan biri
    
    
      İki sütandan biri
    
  
  
    
      İki sütandan biri
    
    
      İki sütandan biri
    
  
  
    
      İki sütandan biri
    
    
      İki sütandan biri
    
  
  
    
      İki sütandan biri
    
    
      İki sütandan biri
    
  

### Sütun sarma

Eğer bir satıra 12'den fazla sütun yerleştirirseniz, bu ekstra sütun grubu bir bütün olarak yeni bir satıra sarılır.

  
    .col-9
    .col-49 + 4 = 13 &gt; 12 olduğu için bu 4 sütun genişliğindeki div bir bütün olarak yeni bir satıra sarılır.
    .col-6Sonraki sütunlar yeni satırda devam eder.
  

### Sütun kesmeleri

Flexbox'ta sütunları yeni bir satıra kesmek için küçük bir hile gereklidir: sütunlarınızı yeni bir satıra sarılacağı yeri belirlemek için `width: 100%` olan bir öğe ekleyin. Normalde bu, birden fazla `.row` ile gerçekleştirilir, ancak her uygulama yöntemi bunu hesaba katamaz.

  
    .col-6 .col-sm-3
    .col-6 .col-sm-3

    
    

    .col-6 .col-sm-3
    .col-6 .col-sm-3
  

Bu kesmeyi belirli kırılma noktalarında uygulamak için `duyarlı görüntüleme yardımcılarını` kullanabilirsiniz.

  
    .col-6 .col-sm-4
    .col-6 .col-sm-4

    
    

    .col-6 .col-sm-4
    .col-6 .col-sm-4
  

## Yeniden sıralama

### Sıra sınıfları

İçeriğinizin **görsel sırasını** kontrol etmek için `.order-` sınıflarını kullanın. Bu sınıflar duyarlıdır, böylece sıralamayı kırılma noktasına göre ayarlayabilirsiniz (örn. `.order-1.order-md-2`). Tüm altı ızgara katmanında `1` ile `5` arasında destek sağlar.

  
    
      DOM'da ilk, sıralama uygulanmadı
    
    
      DOM'da ikinci, daha büyük bir sıra ile
    
    
      DOM'da üçüncü, sıralaması 1
    
  

Ayrıca, bir öğenin `order: -1` ve `order: 6` uygulayarak sırasını değiştiren duyarlı `.order-first` ve `.order-last` sınıfları da bulunmaktadır. Bu sınıflar gerektiğinde numaralı `.order-*` sınıfları ile bir arada kullanılabilir.

  
    
      DOM'da ilk, en sona sıralandı
    
    
      DOM'da ikinci, sıralanmamış
    
    
      DOM'da üçüncü, en önde sıralandı
    
  

### Sütunları kaydırma

Izgara sütunlarını iki şekilde kaydırabilirsiniz: duyarlı `.offset-` ızgara sınıflarımız ve `kenar boşluk yardımcılarımız`. Izgara sınıfları, sütunlarla eşleşecek şekilde boyutlandırılırken, kenar boşlukları kaydırmanın genişliğinin değişken olduğu hızlı düzenler için daha kullanışlıdır.

#### Kaydırma sınıfları

Sütunları sağa kaydırmak için `.offset-md-*` sınıflarını kullanın. Bu sınıflar, bir sütunun sol kenar boşluğunu `*` sütun kadar artırır. Örneğin, `.offset-md-4`, `.col-md-4`'ü dört sütun kadar kaydırır.

  
    .col-md-4
    .col-md-4 .offset-md-4
  
  
    .col-md-3 .offset-md-3
    .col-md-3 .offset-md-3
  
  
    .col-md-6 .offset-md-3
  

  
    .col-sm-5 .col-md-6
    .col-sm-5 .offset-sm-2 .col-md-6 .offset-md-0
  
  
    .col-sm-6 .col-md-5 .col-lg-6
    .col-sm-6 .col-md-5 .offset-md-2 .col-lg-6 .offset-lg-0
  

#### Kenar boşluğu yardımcıları

v4'te flexbox'a geçişle birlikte, `.me-auto` gibi kenar boşluğu yardımcılarını kullanarak kardeş sütunları birbiriyle ayırabilirsiniz.

  
    .col-md-4
    .col-md-4 .ms-auto
  
  
    .col-md-3 .ms-md-auto
    .col-md-3 .ms-md-auto
  
  
    .col-auto .me-auto
    .col-auto
  

## Bağımsız sütun sınıfları

`.col-*` sınıfları, bir `.row` dışında bir öğeye belirli bir genişlik vermek için de kullanılabilir. Sütun sınıfları bir satırın doğrudan çocukları olmadan kullanıldığında, iç kenar boşlukları atlanır.

  .col-3: %25 genişlik


  .col-sm-9: sm kırılmasından itibaren %75 genişlik

Sınıflar, duyarlı yüzer görüntüler oluşturmak için yardımcılarla bir arada kullanılabilir. İçeriği `.clearfix` sarmalayıcı içine almayı unutmayın; böylece metin daha kısa olduğunda yüzen öğeleri temizleyebilirsiniz.

    
    Bir yer tutucu metni paragrafı. Burada, clearfix sınıfının kullanılmasını göstermek için kullanıyoruz. Sütunların yüzen görüntüyle olan etkileşimlerini göstermek için burada pek çok anlamsız ifade ekliyoruz.
  

  
    Gördüğünüz gibi, paragraflar yüzen görüntünün etrafında zarif bir şekilde sarılıyor. Şimdi, burası sadece bu sıkıcı yer tutucu metin ile değil, aynı zamanda burada gerçek içerikle nasıl görüneceğini hayal edin; bu, aslında hiçbir somut bilgi iletmez. Sadece yer kaplar ve gerçekten okunmamalıdır.
  

  
    Ve yine de, burada hala bu yer tutucu metni okuyarak devam ediyorsunuz; daha fazla bilgi ya da içerik gizli bir yumurta bekliyorsunuz. Belki bir şaka. Ne yazık ki, burada buna dair hiçbir şey yok.
  

