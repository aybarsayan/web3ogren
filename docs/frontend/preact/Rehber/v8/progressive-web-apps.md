---
title: Progresif Web Uygulamaları
description: Bu makale, Preact kullanarak Progresif Web Uygulamaları oluşturmanın avantajlarını ve performans ipuçlarını incelemektedir. Preact CLI ile geliştirme sürecini hızlandırabilir ve kullanıcı deneyimini iyileştirebilirsiniz.
keywords: [Preact, Progresif Web Uygulamaları, PWA, Lighthouse, performans, Service Worker, önbellekleme]
---

# Progresif Web Uygulamaları

Preact, hızlı bir şekilde yüklenmek ve etkileşimli hale gelmek isteyen [Progresif Web Uygulamaları](https://web.dev/learn/pwa/) için mükemmel bir tercihtir. [Preact CLI](https://github.com/preactjs/preact-cli/) bunu anlık bir yapı aracı haline getirir ve size kutudan çıkar çıkmaz 100 [Lighthouse][LH] puanına sahip bir PWA sunar.

[LH]: https://developers.google.com/web/tools/lighthouse/


    
        
          
        
        
          
            Daha az script yükler
          
          Preact'ın küçük boyutu, sıkı bir yükleme performansı bütçeniz olduğunda değerlidir. Ortalama mobil donanımda, büyük JS paketlerinin yüklenmesi daha uzun yükleme, ayrıştırma ve değerlendirme sürelerine yol açar. Bu, kullanıcıların uygulamanızla etkileşimde bulunabilmesi için uzun süre beklemesine neden olabilir. Paketlerinizdeki kütüphane kodunu azaltarak, kullanıcılarınıza daha az kod gönderip daha hızlı yüklenirsiniz.
        
    
    
        
          
        
        
          
            Daha hızlı etkileşim süresi
          
          Eğer 5 saniye içinde etkileşimli olmayı hedefliyorsanız, her KB önemlidir. Projelerinize Preact'a geçiş yapmak, birden fazla KB tasarrufu sağlar ve sizi bir RTT içinde etkileşimli hale getirir. Bu, mümkün olan her rotada kodu azaltmaya çalışan Progresif Web Uygulamaları için harika bir uyum sağlar.
        
    
    
        
          
        
        
          
            React ekosistemi ile harika çalışan bir yapı taşı
          
          Ekranda pikselleri hızlıca elde etmek için React'ın sunucu tarafı render'ını mı kullanmanız gerekiyor yoksa React Router ile navigasyon mu yapmanız gerekiyor, Preact ekosistemdeki birçok kütüphane ile uyumlu çalışmaktadır.
        
    


## Bu site bir PWA'dır

Aslında, şu anda bulunduğunuz site bir Progresif Web Uygulamasıdır! İşte bu site, Nexus 5X üzerinden 3G ile 5 saniyeden kısa sürede etkileşimli hale geliyor:



Statik site içeriği, (Service Worker) Cache Storage API'sinde saklanarak tekrar ziyaretlerde anlık yükleme sağlar.

---

## Performans ipuçları

:::info
Preact, PWA'nız için iyi çalışması gereken bir drop-in olmasına rağmen, birçok başka araç ve teknikle de kullanılabilir.
:::

Bu ipuçları şunları içermektedir:


    
        
          
        
        
          Kod bölme, kodunuzu parçalayarak kullanıcının bir sayfa için ihtiyaç duyduğu her şeyi göndermenizi sağlar. Gerekli olan diğerlerinin tembel yüklenmesi sayfa yükleme sürelerini iyileştirir. Webpack üzerinden desteklenir.
        
    
    
        
          
        
        
          Service Worker önbellekleme, uygulamanızda statik ve dinamik kaynakları çevrimdışı önbelleğe almanıza olanak tanır, tekrar ziyaretlerde anlık yükleme ve daha hızlı etkileşim sağlar. Bunu sw-precache veya offline-plugin ile gerçekleştirin.
        
    
    
        
          
        
        
          PRPL, varlıkları tarayıcıya önceden itme veya ön yükleme yapmayı teşvik eder, böylece sonraki sayfaların yüklenmesini hızlandırır. Kod bölme ve SW önbellekleme üzerine inşa edilmiştir.
        
    
    
        
          
        
        
          Lighthouse, Progresif Web Uygulamanızın performansını ve en iyi uygulamalarını denetlemenizi sağlar, böylece uygulamanızın ne kadar iyi çalıştığını öğrenebilirsiniz.
        
    


---

## Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/) Preact projeleri için resmi yapı aracıdır. Preact kodunuzu yüksek verimli bir Progresif Web Uygulamasına paketleyen tek bağımlılık komut satırı aracıdır. Yukarıdaki tüm önerileri otomatikleştirmeyi hedefler, böylece harika Bileşenler yazmaya odaklanabilirsiniz.

:::tip
Preact CLI'nin içine dahil ettiği birkaç şey şunlardır:
:::

- URL rotalarınız için otomatik, kesintisiz kod bölme
- Otomatik olarak bir ServiceWorker oluşturur ve kurar
- URL'ye dayalı HTTP2/Push başlıkları (veya ön yükleme meta etiketleri) oluşturur
- Hızlı Birinci Boyama Süresi için ön render
- Gerekirse polyfill'leri koşullu olarak yükler

[Preact CLI](https://github.com/preactjs/preact-cli/) içsel olarak [Webpack](https://webpack.js.org) tarafından desteklenmektedir, böylece bir `preact.config.js` tanımlayarak yapı sürecini ihtiyaçlarınıza göre özelleştirebilirsiniz. Özelleştirmeler yapsanız bile, muhteşem varsayılan ayarlardan faydalanmaya devam eder ve `preact-cli`'nin yeni sürümleri çıktıkça güncelleyebilirsiniz.