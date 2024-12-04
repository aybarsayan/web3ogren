---
title: Yeni Bir React Projesi Başlatın
seoTitle: Yeni Bir React Projesi Başlatma Rehberi
sidebar_position: 1
description: Yeni bir React projesi başlatmak için çerçeve seçiminin önemli sebeplerine göz atın. React ile çerçevesiz kullanmanın avantajları ve dezavantajları hakkında bilgi edinin.
tags: 
  - React
  - Çerçeve
  - JavaScript
  - Web Geliştirme
keywords: 
  - React
  - Çerçeve
  - JavaScript
  - Web Geliştirme
---
Yeni bir uygulama veya web sitesi oluşturmak istiyorsanız, toplulukta popüler olan React tabanlı çerçevelerden birini seçmenizi öneririz.



React'i bir çerçeve olmadan kullanabilirsiniz, ancak çoğu uygulama ve site sonunda kod parçalama, yönlendirme, veri alma ve HTML oluşturma gibi ortak sorunlar için çözümler geliştirir. Bu sorunlar yalnızca React'a özgü değildir; tüm UI kütüphanelerinde yaygındır.

Bir çerçeve ile başlamanın avantajı, React ile hızlı bir şekilde başlayabilmenizdir, böylece daha sonra kendi çerçevenizi oluşturmak zorunda kalmazsınız.



#### React'i çerçevesiz kullanabilir miyim? {/*can-i-use-react-without-a-framework*/}

Kesinlikle React'i çerçevesiz kullanabilirsiniz – işte `React'i sayfanızın bir parçası için nasıl kullanırsınız.` **Ancak, yeni bir uygulama veya tamamen React ile bir site oluşturuyorsanız, bir çerçeve kullanmanızı öneririz.**

**İşte nedeni:**

- Başlangıçta yönlendirme veya veri alma ihtiyacınız olmasa bile, muhtemelen onlara yönelik bazı kütüphaneler eklemek isteyeceksiniz.
- Her yeni özellik ekledikçe JavaScript paketiniz büyüdükçe, her bir yol için kodu nasıl böleceğinizi çözmek zorunda kalabilirsiniz.
- Veri alma ihtiyaçlarınız daha karmaşık hale geldikçe, uygulamanızın çok yavaş hissettiren sunucu-müşteri ağ şelaleleriyle karşılaşma olasılığınız yüksektir.
- Hedef kitleniz, zayıf ağ koşullarına sahip daha fazla kullanıcı ve düşük özellikli cihazlar içeriyorsa, bileşenlerinizden içeriği erken göstermek için HTML oluşturmak zorunda kalabilirsiniz - ya sunucuda ya da inşa süresinde.

**Bu sorunlar React'a özgü değildir. Bu nedenle Svelte'in SvelteKit'i, Vue'nun Nuxt'ı vb. vardır.** Kendi başınıza bu sorunları çözmek istiyorsanız, paketleyicinizi yönlendirici ve veri alma kütüphanenizle entegre etmeniz gerekecek. Başlangıçta çalışma yapmak zor değil, ancak zamanla hızla yüklenen bir uygulama yapmak için bir çok detay söz konusudur. Uygulama kodunun en minimal miktarını göndermek isteyeceksiniz, ancak bunu bir tek istemci-sunucu gidiş dönüşünde, sayfa için gereken her hangi veri ile paralel olarak yapmalısınız. Sayfanızın JavaScript kodunuz çalışmadan önce interaktif olmasını isteyebilirsiniz, böylece kademeli iyileştirme desteklenebilir. İleri pazarlama sayfalarınız için, her yerde barındırılabilen ve JavaScript devre dışı bırakıldığında bile çalışabilen tamamen statik HTML dosyaları oluşturmak isteyebilirsiniz. Bu yetenekleri kendiniz oluşturmak gerçek bir çalışma gerektirir.

> **Önemli Not:** Bu sayfadaki React çerçeveleri, varsayılan olarak, bu tür sorunları çözmektedir, sizin tarafınızdan ekstra bir iş gerektirmeden. Çok ince başlayıp sonraya ihtiyaçlarınıza göre uygulamanızı ölçeklendirmenizi sağlarlar. Her React çerçevesinin bir topluluğu vardır, bu nedenle sorulara cevap bulmak ve araçları güncellemek daha kolaydır.

Uygulamanız bu çerçeveler tarafından uygun şekilde sağlanmayan olağandışı kısıtlamalara sahipse veya bu sorunları kendiniz çözmek istiyorsanız, React ile kendi özel ayarınızı oluşturabilirsiniz. `react` ve `react-dom` paketlerini npm'den alın, [Vite](https://vitejs.dev/) veya [Parcel](https://parceljs.org/) gibi bir paketleyici ile özel inşa sürecinizi ayarlayın ve yönlendirme, statik üretim veya sunucu tarafı oluşturma gibi ihtiyaç duyduğunuz diğer araçları ekleyin.