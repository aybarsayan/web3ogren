---
description: Bootstrap düğme grubu, bir dizi düğmeyi gruplamak ve JavaScript ile güçlendirmek için olanak tanır. Kullanıcı dostu bir arayüz sağlar ve erişilebilirlik standartlarına uygundur. 
keywords: [Bootstrap, düğme grubu, JavaScript, erişilebilirlik, kullanıcı arayüzü, düğme stilleri, form elemanları]
---

## Temel örnek

Bir dizi düğmeyi `.btn` ile `.btn-group` içine sarın. `Düğmeler eklentimiz` ile isteğe bağlı JavaScript radyo ve onay kutusu tarzı davranış ekleyin.

  Sol
  Orta
  Sağ

:::tip
Doğru `role` değerini sağlayın ve bir etiket ekleyin
:::

Yardımcı teknolojilerin (ör. ekran okuyucular) bir dizi düğmenin gruplandığını iletebilmesi için uygun bir `role` niteliği sağlanmalıdır. Düğme grupları için bu `role="group"` olmalı, araç çubukları için ise `role="toolbar"` olmalıdır.

Ayrıca, grupların ve araç çubuklarının anlaşılır bir etikete sahip olması gerekir; aksi takdirde çoğu yardımcı teknoloji bunları açıklamayacaktır, özel rol niteliği görünmesine rağmen. Burada sağlanan örneklerde `aria-label` uyguluyoruz, ancak `aria-labelledby` gibi seçenekler de kullanılabilir.

Bu sınıflar, `.nav` navigasyon bileşenleri` alternatif olarak bağlantı gruplarına da eklenebilir.

  Aktif bağlantı
  Bağlantı
  Bağlantı

## Karışık stiller

  Sol
  Orta
  Sağ

## Çerçeveli stiller

  Sol
  Orta
  Sağ

## Onay kutusu ve radyo düğmesi grupları

Düğme benzeri onay kutusu ve radyo düğmelerini `açılır düğmeler` ile birleştirerek kesintisiz bir düğme grubu oluşturun.

  
  Onay Kutusu 1

  
  Onay Kutusu 2

  
  Onay Kutusu 3

  
  Radyo 1

  
  Radyo 2

  
  Radyo 3

## Düğme araç çubuğu

Düğme gruplarını daha karmaşık bileşenler için düğme araç çubuklarına birleştirin. Grupları, düğmeleri ve daha fazlasını yerleştirmek için ihtiyaç duyduğunuz yardımcı sınıfları kullanın.

  
    1
    2
    3
    4
  
  
    5
    6
    7
  
  
    8
  

Giriş gruplarını düğme grupları ile araç çubuklarınıza birleştirmekten çekinmeyin. Yukarıdaki örneğe benzer şekilde, nesneleri doğru bir şekilde yerleştirmek için bazı yardımcı bileşenlere ihtiyacınız olacaktır.

  
    1
    2
    3
    4
  
  
    @
    
  



  
    1
    2
    3
    4
  
  
    @
    
  

## Boyutlandırma

Bir grup içindeki her düğmeye düğme boyutlandırma sınıfları uygulamak yerine, tüm `.btn-group`'lara `.btn-group-*` ekleyin, birden fazla grubu iç içe yerleştirirken de.

  Sol
  Orta
  Sağ



  Sol
  Orta
  Sağ



  Sol
  Orta
  Sağ

## İç içe yerleştirme

Açılır menüleri bir dizi düğme ile birleştirmeniz gerektiğinde, bir `.btn-group`'ı başka bir `.btn-group` içine yerleştirin.

  1
  2

  
    
      Açılır Menü
    
    
      Açılır menü bağlantısı
      Açılır menü bağlantısı
    
  

## Dikey varyasyon

Dikey olarak yığılan düğmeler oluşturun. **Bölünmüş düğme açılır menüleri burada desteklenmez.**

  
    Düğme
    Düğme
    Düğme
    Düğme
  

  
    
      
        Açılır Menü
      
      
        Açılır menü bağlantısı
        Açılır menü bağlantısı
      
    
    Düğme
    Düğme
    
      
        Açılır Menü
      
      
        Açılır menü bağlantısı
        Açılır menü bağlantısı
      
    
    
      
        Açılır Menü
      
      
        Açılır menü bağlantısı
        Açılır menü bağlantısı
      
    
    
      
        Açılır Menü
      
      
        Açılır menü bağlantısı
        Açılır menü bağlantısı
      
    
  



  
    
    Radyo 1
    
    Radyo 2
    
    Radyo 3
  

  
  Radyo 1
  
  Radyo 2
  
  Radyo 3

