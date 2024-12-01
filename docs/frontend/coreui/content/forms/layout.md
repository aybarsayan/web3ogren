---
description: Formlarınıza bazı yapı ekleyin—satır içinden yatay ve özel ızgara uygulamalarına kadar—form düzen seçeneklerimizle. Bu makale, CoreUI for Bootstrap ile formları nasıl düzenleyeceğinizi ve yapılandıracağınızı göstermektedir.
keywords: [form düzeni, CoreUI, Bootstrap, form bileşenleri, form ızgarası, form örnekleri, kullanıcı arayüzü]
---

# Düzenler

## Formlar

Her bir form alanı grubu bir `` elementi içinde yer almalıdır. CoreUI for Bootstrap, `` elementi için varsayılan bir stil sağlamaz, ancak varsayılan olarak sunulan bazı güçlü tarayıcı özellikleri vardır.

:::tip
Tarayıcı formlarına yeni misiniz? Mevcut niteliklerin tam listesi ve genel bir bakış için [MDN form belgelerini](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) gözden geçirmeyi düşünün.
:::

- Bir `` içindeki ``ler varsayılan olarak `type="submit"` olarak ayarlanır, bu nedenle spesifik olmaya çalışın ve her zaman bir `type` ekleyin.

CoreUI for Bootstrap, hemen hemen tüm form kontrollerimize `display: block` ve `width: 100%` uygular, bu nedenle formlar varsayılan olarak dikey olarak yığılacaktır. Ek sınıflar, bu düzeni her form için değiştirmenize olanak tanır.

## Araçlar

`Margin utilities`, formlara yapı eklemenin en kolay yoludur. Etiketlerin, kontrollerin, isteğe bağlı form metninin ve form doğrulama mesajlarının temel gruplamasını sağlarlar. 

:::info
Tutarlılık için form boyunca tek bir yön kullanarak `margin-bottom` yardımcı programlarına sadık kalmanızı öneririz.
:::

Formlarınızı ``ler, ``ler veya neredeyse herhangi bir başka öğe ile istediğiniz gibi oluşturabilirsiniz.

  Örnek etiket
  


  Diğer etiket
  

## Form ızgarası

Daha karmaşık formlar, ızgara sınıflarımızı kullanarak oluşturulabilir. Çoklu sütunlar, farklı genişlikler ve ek hizalama seçenekleri gerektiren form düzenleri için bunları kullanın. **`$enable-grid-classes` Sass değişkeninin etkinleştirilmesi gerekir** (varsayılan olarak açıktır).

  
    
  
  
    
  

## Ara

`Ara modifier sınıflarını` ekleyerek, hem yatay hem de dikey yönde ara genişliği üzerinde kontrol sahibi olabilirsiniz. **Ayrıca `$enable-grid-classes` Sass değişkeninin etkinleştirilmesi gerekir** (varsayılan olarak açıktır).

  
    
  
  
    
  

Daha karmaşık düzenler, ızgara sistemi ile de oluşturulabilir.

### Önemli Not

:::warning
Bir formun düzgün görünmesi için doğru CSS sınıflarını eklemek esastır.
:::

  
    E-posta
    
  
  
    Şifre
    
  
  
    Adres
    
  
  
    Adres 2
    
  
  
    Şehir
    
  
  
    Eyalet
    
      Seçin...
      ...
    
  
  
    Posta Kodu
    
  
  
    
      
      
        Beni hatırla
      
    
  
  
    Giriş yap
  

## Yatay form

Gridi kullanarak yatay formlar oluşturun; form gruplarına `.row` sınıfını ekleyin ve etiketlerinizin ve kontrollerinizin genişliğini belirtmek için `.col-*-*` sınıflarını kullanın. Ayrıca, etiketlerinizi dikey olarak ortalamak için mutlaka ``lerinize `.col-form-label` ekleyin.

Bazen, mükemmel hizalamayı sağlamak için margin veya padding yardımcı programlarını kullanmanız gerekebilir. Örneğin, yığın halinde olan radyo giriş etiketlerimizdeki `padding-top`'u kaldırdık, böylece metin tabanı daha iyi hizalansın.

  
    E-posta
    
      
    
  
  
    Şifre
    
      
    
  
  
    Radyo
    
      
        
        
          İlk radyo
        
      
      
        
        
          İkinci radyo
        
      
      
        
        
          Üçüncü devre dışı radyo
        
      
    
  
  
    
      
        
        
          Örnek onay kutusu
        
      
    
  
  Giriş yap

### Yatay form etiket boyutlandırması

`.form-control-lg` ve `.form-control-sm`'nin boyutunu doğru bir şekilde takip etmek için `` veya ``lerinizde `.col-form-label-sm` veya `.col-form-label-lg` kullanmayı unutmayın.

  E-posta
  
    
  


  E-posta
  
    
  


  E-posta
  
    
  

## Sütun Boyutlandırması

Daha önceki örneklerde gösterildiği gibi, ızgara sistemimiz bir `.row` içinde herhangi sayıda `.col` yerleştirmenize olanak tanır. Mevcut genişliği eşit olarak bölerler. Ayrıca, belirli sütun sınıfları kullanarak sütunlarınızdan bir kısmının daha fazla veya daha az alan kaplamasını seçebilirsiniz; kalan `.col`lar, geri kalanını eşit olarak böler. Örneğin, `.col-sm-7`.

  
    
  
  
    
  
  
    
  

## Otomatik Boyutlandırma

Aşağıdaki örnek, içerikleri dikey olarak ortalamak için bir flexbox yardımcı programı kullanır ve sütunlarınızın sadece ihtiyaç duyduğu kadar alan kaplanmasını sağlamak için `.col`u `.col-auto`ya değiştirir. Başka bir deyişle, sütun boyutunu içeriğe göre ayarlar.

  
    İsim
    
  
  
    Kullanıcı adı
    
      @
      
    
  
  
    Tercih
    
      Seçin...
      Bir
      İki
      Üç
    
  
  
    
      
      
        Beni hatırla
      
    
  
  
    Gönder
  

Bunu, boyutlara özel sütun sınıfları ile yeniden karıştırabilirsiniz.

  
    İsim
    
  
  
    Kullanıcı adı
    
      @
      
    
  
  
    Tercih
    
      Seçin...
      Bir
      İki
      Üç
    
  
  
    
      
      
        Beni hatırla
      
    
  
  
    Gönder
  

## Satır içi formlar

Yanıt veren yatay düzenler oluşturmak için `.row-cols-*` sınıflarını kullanın. `Ara modifier sınıflarını` ekleyerek yatay ve dikey yönde ara elde edebiliriz. Dar mobil görünüm noktalarında, `.col-12` form kontrollerini yığmaya yardımcı olur. `.align-items-center` form öğelerini ortalayarak `.form-checkbox`'ın doğru bir şekilde hizalanmasını sağlar.

  
    Kullanıcı adı
    
      @
      
    
  

  
    Tercih
    
      Seçin...
      Bir
      İki
      Üç
    
  

  
    
      
      
        Beni hatırla
      
    
  

  
    Gönder
  

