---
description: Bir dizi ilişkili içeriğin birden fazla sayfada mevcut olduğunu göstermek için sayfalama ile ilgili belgeler ve örnekler.
keywords: [sayfalama, navigasyon, erişilebilirlik, CSS, arayüz]
--- 

## Genel Bakış

Sayfalama için büyük bir bağlantı bloğu kullanıyoruz, bu da bağlantıların gözden kaçmasını zorlaştırır ve kolayca ölçeklenebilir—büyük tıklama alanları sağlar. Sayfalama, ekran okuyucuların mevcut bağlantı sayısını bildirebilmesi için liste HTML öğeleri ile oluşturulmuştur. Ekran okuyucular ve diğer yardımcı teknolojilere bunu bir navigasyon bölümü olarak tanımlamak için saran bir `` öğesi kullanın.

:::tip
Ayrıca, sayfaların muhtemelen birden fazla bu tür navigasyon bölümüne sahip olması nedeniyle, `` için amacını yansıtan açıklayıcı bir `aria-label` sağlamanız önerilir.
:::

Örneğin, sayfalama bileşeni bir dizi arama sonuçları arasında gezinmek için kullanılıyorsa, uygun bir etiket `aria-label="Arama sonuçları sayfaları"` olabilir.

  
    Önceki
    1
    2
    3
    Sonraki
  

## Simge ile Çalışma

Bazı sayfalama bağlantıları için metin yerine bir simge veya sembol kullanmak mı istiyorsunuz? Ekran okuyucu desteğini `aria` özellikleri ile sağlamayı unutmayın.

:::info
Simge kullanımı, görsel yanıta sahip olmayan kullanıcılar için açıklayıcı metinlerle desteklenmelidir.
:::

  
    
      
      
      
    
    1
    2
    3
    
      
        
      
    
  

## Devre Dışı ve Aktif Durumlar

Sayfalama bağlantıları farklı durumlar için özelleştirilebilir. Tıklanamaz görünen bağlantılar için `.disabled` ve mevcut sayfayı belirtmek için `.active` kullanın.

:::warning
`.disabled` sınıfı, `` öğelerinin bağlantı işlevselliğini devre dışı bırakmak için `pointer-events: none` kullanır; ancak bu CSS özelliği henüz standartlaştırılmamıştır ve klavye navigasyonunu hesaba katmamaktadır.
:::

Bu nedenle, devre dışı bağlantılara her zaman `tabindex="-1"` eklemeli ve işlevselliğini tamamen devre dışı bırakmak için özel JavaScript kullanmalısınız.

  
    
      Önceki
    
    1
    
      2
    
    3
    
      Sonraki
    
  

Aktif veya devre dışı bağlantıları `` ile değiştirebilir veya önceki/sonraki oklar durumunda bağlantıyı atlayarak tıklama işlevselliğini kaldırabilir ve klavye odaklanmasını engelleyebilirsiniz.

  
    
      Önceki
    
    1
    
      2
    
    3
    
      Sonraki
    
  

## Boyutlandırma

Büyüleyici daha büyük veya daha küçük sayfalama mı istiyorsunuz? Ek boyutlar için `.pagination-lg` veya `.pagination-sm` ekleyin.

  
    
      1
    
    2
    3
  

  
    
      1
    
    2
    3
  

## Hizalama

Sayfalama bileşenlerinin hizalamasını `flexbox yardımcıları` ile değiştirin. Örneğin, `.justify-content-center` ile:

  
    
      Önceki
    
    1
    2
    3
    
      Sonraki
    
  

Ya da `.justify-content-end` ile:

  
    
      Önceki
    
    1
    2
    3
    
      Sonraki
    
  

## Özelleştirme

### CSS değişkenleri

Sayfalama artık gerçek zamanlı özelleştirme için `.pagination` üzerinde yerel CSS değişkenleri kullanmaktadır. CSS değişkenleri için değerler Sass üzerinden belirlenir, dolayısıyla Sass özelleştirmesi de hala desteklenmektedir.

### SASS değişkenleri

### SASS mixin'leri

