---
description: Bootstrap'ın dahil edilmiş navigasyon bileşenlerini kullanma belgeleri ve örnekleri. Bu belgede, temel navigasyon yapılandırmaları, stiller ve erişilebilirlik hakkında bilgi bulabilirsiniz.
keywords: [Bootstrap, navigasyon, Bootstrap bileşenleri, erişilebilirlik, frontend geliştirme, kullanıcı arayüzü]
---

## Temel navigasyon

Bootstrap'taki navigasyonlar genel işaretleme ve stilleri paylaşır; temel `.nav` sınıfından aktif ve devre dışı durumlara kadar. Her stil arasında geçiş yapmak için modifikatör sınıflarını değiştirin.

Temel `.nav` bileşeni flexbox ile oluşturulmuştur ve her türlü navigasyon bileşeni oluşturmak için güçlü bir temel sağlar. **Liste ile çalışma** için bazı stil geçersiz kılmaları, daha büyük tıklama alanları için bazı bağlantı dolguları ve temel devre dışı stilleri içerir.

:::info
Temel `.nav` bileşeni herhangi bir `.active` durumu içermez. Aşağıdaki örneklerde bu sınıf yer almaktadır; bu, bu özel sınıfın herhangi bir özel stil oluşturmadığını göstermek içindir.

Aktif durumu yardımcı teknolojilere iletmek için `aria-current` niteliğini kullanın — geçerli sayfa için `page` değeri veya bir set içindeki geçerli öğe için `true` değerini kullanın.
:::

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

Sınıflar her yerde kullanılır, böylece işaretlemeniz oldukça esnek olabilir. Yukarıda olduğu gibi `` kullanın ya da dikkatinizle sıralama önemliyse `` kullanın veya kendi `` öğenizle oluşturun. **Çünkü `.nav` `display: flex` kullandığı için**, nav bağlantıları nav öğeleri gibi davranır, ancak ekstra işaretleme olmadan.

  Aktif
  Bağlantı
  Bağlantı
  Devre Dışı

## Mevcut stiller

`.nav` bileşeninin stilini modifikatörler ve yardımcı programlarla değiştirin. İhtiyaç duyduğunuzda karıştırın ve eşleştirin veya kendi stilinizi oluşturun.

### Yatay hizalama

Navigasyonunuzun yatay hizalamasını `flexbox yardımcı programları` ile değiştirin. Varsayılan olarak, navigasyonlar sola hizalıdır, ancak bunları kolayca ortalanmış veya sağa hizalı hale getirebilirsiniz.

`.justify-content-center` ile merkezli:

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

`.justify-content-end` ile sağa hizalı:

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

### Dikey

Navigasyonunuzu `.flex-column` yardımcı programı ile esnek öğe yönünü değiştirerek istifleyin. **Bazı ekran boyutlarında istiflemek, diğerlerinde ise bunu yapmamak mı gerekiyor?** Yanıt olarak yanıt veren sürümleri kullanın (örn., `.flex-sm-column`).

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

Her zaman olduğu gibi, dikey navigasyon `` olmadan da mümkündür.

  Aktif
  Bağlantı
  Bağlantı
  Devre Dışı

### Sekmeler

Yukarıdaki temel navigasyonu alır ve sekmeli bir arayüz oluşturmak için `.nav-tabs` sınıfını ekler. Bunu, `sekme JavaScript eklentimizi` kullanarak sekme bölgeleri oluşturmak için kullanın.

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

### Haplar

Aynı HTML'yi alın, ancak bunun yerine `.nav-pills` kullanın:

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

### Alt çizgi

Aynı HTML'yi alın, ancak bunun yerine `.nav-underline` kullanın:

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

### Alt çizgi kenar

Aynı HTML'yi alın, ancak bunun yerine `.nav-underline-border` kullanın:

  
    Aktif
  
  
    Bağlantı
  
  
    Bağlantı
  
  
    Devre Dışı
  

### Doldurma ve hakem

`.nav` içeriğinizi, iki modifikatör sınıfından birini kullanarak tam mevcut genişliğine yaymaya zorlayın. `.nav-item` larin, mevcut tüm alanın orantılı olarak doldurulması gerektiğinden, `.nav-fill` kullanın. Tüm yatay alanın kaplandığına dikkat edin, ancak her nav öğesi aynı genişliğe sahip değildir.

  
    Aktif
  
  
    Çok daha uzun nav bağlantısı
  
  
    Bağlantı
  
  
    Devre Dışı
  

`` tabanlı bir navigasyon kullanırken, stil vermek için yalnızca `.nav-link` gerektiğinden `.nav-item` kısmını güvenle atlayabilirsiniz.

  Aktif
  Çok daha uzun nav bağlantısı
  Bağlantı
  Devre Dışı

Eşit genişlikteki öğeler için, `.nav-justified` kullanın. Tüm yatay alan, nav bağlantıları tarafından işgal edilecektir, ancak yukarıdaki `.nav-fill` örneğinden farklı olarak, her nav öğesi aynı genişlikte olacaktır.

  
    Aktif
  
  
    Çok daha uzun nav bağlantısı
  
  
    Bağlantı
  
  
    Devre Dışı
  

Aynı şekilde `` tabanlı bir navigasyon kullanan `.nav-fill` örneği.

  Aktif
  Çok daha uzun nav bağlantısı
  Bağlantı
  Devre Dışı

## Flex yardımcı programları ile çalışma

Yanıt veren nav varyasyonlarına ihtiyacınız varsa, `flexbox yardımcı programlarının` bir serisini düşünün. Daha fazla ayrıntı barındırmasına rağmen, bu yardımcı programlar, yanıt veren kırılma noktalarında daha büyük özelleştirme sunar. **Aşağıdaki örnekte**, nav'ımız en düşük kırılma noktasında istiflenecek, daha sonra küçük kırılma noktasından itibaren mevcut genişliği dolduran yatay bir düzene uyum sağlayacaktır.

  Aktif
  Daha uzun nav bağlantısı
  Bağlantı
  Devre Dışı

## Erişilebilirlik hakkında

Navigasyon çubuğu sağlamak için nav'ları kullanıyorsanız, ``ün en mantıklı ana kapsayıcısına `role="navigation"` eklemeyi unutmayın veya tüm navigasyonun etrafına bir `` öğesi sarın. Rolü ``e eklemeyin, çünkü bu, yardımcı teknolojiler tarafından gerçek bir liste olarak tanıtılmasını engeller.

Navigasyon çubuklarının, `.nav-tabs` sınıfı ile görsel olarak sekmelere stil verilse bile `role="tablist"`, `role="tab"` veya `role="tabpanel"` nitelikleri verilmemelidir. Bunlar yalnızca dinamik sekme arayüzleri için uygundur; [ARIA Yazar Pratikleri Kılavuzu sekme deseni](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/) gibi. Bu bölümdeki dinamik sekmeli arayüzler için `JavaScript davranışı` örneğine bakın. **`aria-current` niteliği dinamik sekmeli arayüzlerde gerekli değildir çünkü JavaScript'imiz**, seçili durumu aktif sekmeye `aria-selected="true"` ekleyerek yönetir.

## Aşağı açılır menüler kullanma

Ekstra HTML ve `aşağı açılır menüler JavaScript eklentisi` ile aşağı açılır menüleri ekleyin.

### Aşağı açılır menüler ile sekmeler

  
    Aktif
  
  
    Aşağı Açılır
    
      Eylem
      Başka bir eylem
      Burada bir şey başka
      
      Ayrılmış bağlantı
    
  
  
    Bağlantı
  
  
    Devre Dışı
  

### Aşağı açılır menüler ile haplar

  
    Aktif
  
  
    Aşağı Açılır
    
      Eylem
      Başka bir eylem
      Burada bir şey başka
      
      Ayrılmış bağlantı
    
  
  
    Bağlantı
  
  
    Devre Dışı
  

---
title: JavaScript davranışı
description: JavaScript ile sekme ve haplar kullanarak dinamik kullanıcı arayüzleri oluşturmanın önemini öğrenin. Bu içerik, erişilebilirliği artırmak için WAI-ARIA yönergelerine uygun kullanım yöntemlerini açıklamaktadır.
keywords: [JavaScript, sekme, hap, WAI-ARIA, kullanıcı arayüzü, erişilebilirlik, dinamik içerik]
---

## JavaScript davranışı

Sekme JavaScript eklentisini kullanın—bunu ayrı bir şekilde veya derlenmiş `coreui.js` dosyası aracılığıyla dahil edin—navigasyon sekmelerimizi ve haplarımızı, açılır menüler aracılığıyla bile, yerel içeriklerin sekmeli panellerini oluşturmak için genişletin.

:::info
Dinamik sekmeli arayüzler, [WAI ARIA Yazma Uygulamaları](https://www.w3.org/TR/wai-aria-practices/#tabpanel) bölümünde açıklandığı gibi, yapılarını, işlevselliklerini ve mevcut durumlarını yardımcı teknolojiler (örneğin ekran okuyucular) kullanıcılarına iletmek için `role="tablist"`, `role="tab"`, `role="tabpanel"` ve ek `aria-` nitelikleri gerektirir.
:::

En iyi uygulama olarak, sekmeler için `` öğelerini kullanmanızı öneririz, çünkü bunlar dinamik bir değişimi tetikleyen kontrollerdir, yeni bir sayfaya veya konuma gitmeyen bağlantılar değildir.

:::warning
Dinamik sekmeli arayüzlerin *işlevsel* olarak açılır menüler içermemesi gerektiğini unutmayın, çünkü bu hem kullanılabilirlik hem de erişilebilirlik sorunları yaratır.
:::

Kullanılabilirlik açısından, şu anda görüntülenen sekmenin tetikleyici öğesinin hemen görünür olmaması (kapalı açılır menünün içinde olduğu için) kafa karışıklığına neden olabilir. Erişilebilirlik açısından, bu tür bir yapıyı standart WAI ARIA biçimine bağlamanın şu anda mantıklı bir yolu yoktur, bu da bunun yardımcı teknolojiler kullanıcılarına kolayca anlaşılır bir şekilde sunulamayacağı anlamına gelir.


  
    
      Ana Sayfa
    
    
      Profil
    
    
      İletişim
    
  
  
    
      <p>Bu, <strong>Ana Sayfa sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      <p>Bu, <strong>Profil sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      <p>Bu, <strong>İletişim sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      Bu, Devre dışı sekmeyle ilişkili bazı yer tutucu içeriklerdir.
    
  


:::note
İhtiyaçlarınıza uyacak şekilde, yukarıda gösterildiği gibi `` tabanlı işaretleme ile çalışır veya kendi "yapını kendin oluştur" işaretlemenizi kullanabilirsiniz.
:::

```html
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-coreui-toggle="tab" data-coreui-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Ana Sayfa</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-coreui-toggle="tab" data-coreui-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profil</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="contact-tab" data-coreui-toggle="tab" data-coreui-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">İletişim</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">...</div>
</div>
```


  
    
      Ana Sayfa
      Profil
      İletişim
    
  
  
    
      <p>Bu, <strong>Ana Sayfa sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      <p>Bu, <strong>Profil sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      <p>Bu, <strong>İletişim sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      Bu, Devre dışı sekmeyle ilişkili bazı yer tutucu içeriklerdir.
    
  


```html
<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <button class="nav-link active" id="nav-home-tab" data-coreui-toggle="tab" data-coreui-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Ana Sayfa</button>
    <button class="nav-link" id="nav-profile-tab" data-coreui-toggle="tab" data-coreui-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profil</button>
    <button class="nav-link" id="nav-contact-tab" data-coreui-toggle="tab" data-coreui-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">İletişim</button>
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="nav-disabled" role="tabpanel" aria-labelledby="nav-disabled-tab" tabindex="0">...</div>
</div>
```

Sekme eklentisi haplarla da çalışır.


  
    
      Ana Sayfa
    
    
      Profil
    
    
      İletişim
    
    
      Devre Dışı
    
  
  
    
      <p>Bu, <strong>Ana Sayfa sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      <p>Bu, <strong>Profil sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      <p>Bu, <strong>İletişim sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
    
    
      Bu, Devre dışı sekmeyle ilişkili bazı yer tutucu içeriklerdir.
    
  


```html
<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="pills-home-tab" data-coreui-toggle="pill" data-coreui-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Ana Sayfa</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="pills-profile-tab" data-coreui-toggle="pill" data-coreui-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profil</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="pills-contact-tab" data-coreui-toggle="pill" data-coreui-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">İletişim</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="pills-disabled-tab" data-coreui-toggle="pill" data-coreui-target="#pills-disabled" type="button" role="tab" aria-controls="pills-disabled" aria-selected="false" disabled>Devre Dışı</button>
  </li>
</ul>
<div class="tab-content" id="pills-tabContent">
  <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="pills-disabled" role="tabpanel" aria-labelledby="pills-disabled-tab" tabindex="0">...</div>
</div>
```

Ayrıca dikey haplarla da kullanılabilir. Dikey sekmeler için, sekme listesi kapsayıcısına `aria-orientation="vertical"` eklemeyi de düşünmelisiniz.


  
    
      Ana Sayfa
      Profil
      Mesajlar
      Ayarlar
    
    
      
        <p>Bu, <strong>Ana Sayfa sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
      
      
        <p>Bu, <strong>Profil sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
      
      
        Bu, Devre dışı sekmeyle ilişkili bazı yer tutucu içeriklerdir.
      
      
        <p>Bu, <strong>Mesajlar sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
      
      
        <p>Bu, <strong>Ayarlar sekmesiyle</strong> ilişkili bazı yer tutucu içeriklerdir. Başka bir sekmeye tıklamak, bu sekmenin görünürlüğünü bir sonraki için değiştirir. Sekme JavaScript'i, içerik görünürlüğünü ve stilini kontrol etmek için sınıfları değiştirir. Bunu sekmeler, haplar ve diğer her türlü .nav-güçlü navigasyon ile kullanabilirsiniz.
      
    
  


```html
<div class="d-flex align-items-start">
  <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
    <button class="nav-link active" id="v-pills-home-tab" data-coreui-toggle="pill" data-coreui-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Ana Sayfa</button>
    <button class="nav-link" id="v-pills-profile-tab" data-coreui-toggle="pill" data-coreui-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profil</button>
    <button class="nav-link" id="v-pills-messages-tab" data-coreui-toggle="pill" data-coreui-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Mesajlar</button>
    <button class="nav-link" id="v-pills-settings-tab" data-coreui-toggle="pill" data-coreui-target="#v-pills-settings" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Ayarlar</button>
  </div>
  <div class="tab-content" id="v-pills-tabContent">
    <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabindex="0">...</div>
    <div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabindex="0">...</div>
    <div class="tab-pane fade" id="v-pills-disabled" role="tabpanel" aria-labelledby="v-pills-disabled-tab" tabindex="0">...</div>
    <div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabindex="0">...</div>
    <div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabindex="0">...</div>
  </div>
</div>
```

---
description: Dinamik sekmeli arayüzler için erişim kılavuzu, yapı ve işlevselliği açıklayıcı bir şekilde detaylandırıyor. Bu kılavuz, kullanıcıların sekmelerle etkileşimini geliştirecek en iyi uygulamalar ve JavaScript kullanımı hakkında bilgi sunmaktadır.
keywords: [sekme arayüzü, erişilebilirlik, JavaScript, ARIA, dinamik sekmeler, önizleme, kullanıcı deneyimi]
---

### Erişim

Dinamik sekmeli arayüzler, [ARIA Yazım Uygulamaları Kılavuzu sekme deseni](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/) içerisinde açıklandığı gibi, yapılarını, işlevselliklerini ve mevcut durumlarını yardımcı teknolojileri (örneğin, ekran okuyucuları) kullanan kullanıcılara iletmek için `role="tablist"`, `role="tab"`, `role="tabpanel"` ve ek `aria-` nitelikleri gerektirir. **En iyi uygulama olarak, sekmeler için `` öğelerinin kullanılmasını öneriyoruz;** çünkü bu öğeler dinamik bir değişimi tetikleyen kontrollerdir, yeni bir sayfaya veya konuma yönlendiren bağlantılar yerine.

ARIA Yazım Uygulamaları deseniyle uyumlu olarak, yalnızca mevcut etkin sekme klavye odaklanmasını alır. JavaScript eklentisi başlatıldığında, tüm etkin olmayan sekme kontrollerinde `tabindex="-1"` ayarlanır. Mevcut etkin sekme odaklandığında, ok tuşları bir önceki/sonraki sekmeyi etkinleştirir ve eklenti uygun şekilde [seyirci `tabindex`](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) değiştirir. **Ancak, JavaScript eklentisinin ok tuşu etkileşimleri açısından yatay ve dikey sekme listeleri arasında ayrım yapmadığını unutmayın:** sekme listesinin yönelimine bakılmaksızın, hem yukarı *hem de* sol ok tuşu bir önceki sekmeye giderken, aşağı *ve* sağ ok tuşu bir sonraki sekmeye gider.

:::tip
Genellikle, klavye gezintisini kolaylaştırmak için, sekme panellerinin de odaklanabilir hale getirilmesi önerilir, eğer sekme panelinin içindeki anlamlı içerik barındıran ilk öğe zaten odaklanabilir değilse. JavaScript eklentisi bu yönü yönetmeye çalışmaz—uygun olduğunda, sekme panellerinizi odaklanabilir hale getirmek için işaretlemenizde `tabindex="0"` eklemeniz gerekir.
:::

:::danger
Sekme JavaScript eklentisi **açılır menü içeren** sekmeli arayüzleri desteklememektedir; çünkü bu durum hem kullanılabilirlik hem de erişilebilirlik sorunlarına yol açar. Kullanılabilirlik açısından, mevcut görüntülenen sekmenin tetikleyici öğesinin hemen görünür olmaması (kapalı açılır menü içerisinde) kafa karışıklığına neden olabilir. Erişilebilirlik açısından, bu tür bir yapıyı standart bir WAI ARIA desenine eşleştirmek için mantıklı bir yol mevcut değildir; bu da yardımcı teknolojileri kullanan kullanıcılar için kolayca anlaşılır hale getirilemeyeceği anlamına gelir.
:::

### Veri niteliklerini kullanma

JavaScript yazmadan, bir sekmeyi veya hap navigasyonunu basitçe bir öğeye `data-coreui-toggle="tab"` veya `data-coreui-toggle="pill"` belirterek etkinleştirebilirsiniz. Bu veri niteliklerini `.nav-tabs` veya `.nav-pills` üzerinde kullanın.

```html
<!-- Nav sekmeleri -->
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-coreui-toggle="tab" data-coreui-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Ana Sayfa</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-coreui-toggle="tab" data-coreui-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profil</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="messages-tab" data-coreui-toggle="tab" data-coreui-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">Mesajlar</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="settings-tab" data-coreui-toggle="tab" data-coreui-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Ayarlar</button>
  </li>
</ul>

<!-- Sekme panelleri -->
<div class="tab-content">
  <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab" tabindex="0">...</div>
  <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">...</div>
  <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab" tabindex="0">...</div>
  <div class="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab" tabindex="0">...</div>
</div>
```

### JavaScript ile

JavaScript aracılığıyla sekmeleri etkinleştirin (her sekme ayrı ayrı etkinleştirilmelidir):

```js
const triggerTabList = document.querySelectorAll('#myTab button')
triggerTabList.forEach(triggerEl => {
  const tabTrigger = new coreui.Tab(triggerEl)

  triggerEl.addEventListener('click', event => {
    event.preventDefault()
    tabTrigger.show()
  })
})
```

Tek tek sekmeleri birkaç yolla etkinleştirebilirsiniz:

```js
const triggerEl = document.querySelector('#myTab button[data-coreui-target="#profile"]')
coreui.Tab.getInstance(triggerEl).show() // İsimle sekmeyi seç
const triggerFirstTabEl = document.querySelector('#myTab li:first-child button')
coreui.Tab.getInstance(triggerFirstTabEl).show() // İlk sekmeyi seç
```

### Fade efekti

Sekmelerin soluklaşmasını sağlamak için, her `.tab-pane`'ye `.fade` ekleyin. İlk sekme panelinin de başlangıç içeriğini görünür hale getirmek için `.show` niteliklerine sahip olması gerekir.

```html
<div class="tab-content">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="messages" role="tabpanel" aria-labelledby="messages-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab" tabindex="0">...</div>
</div>
```

---

### Yöntemler

:::danger

:::

#### constructor

Bir sekme örneği oluşturmak için constructor kullanabilirsiniz, örneğin:

```js
const cuiTab = new coreui.Tab('#myTab')
```


| Yöntem | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin sekmesini yok eder. |
| `getInstance` | Bir DOM öğesi ile ilişkili sekme örneğini almanızı sağlayan *statik* yöntemdir; bunu şöyle kullanabilirsiniz: `coreui.Tab.getInstance(element)`. |
| `getOrCreateInstance` | Bir DOM öğesi ile ilişkili sekme örneğini almanızı veya daha önce başlatılmamışsa yeni bir tane oluşturmanızı sağlayan *statik* yöntemdir; bunu şöyle kullanabilirsiniz: `coreui.Tab.getOrCreateInstance(element)`. |
| `show` | Verilen sekmeyi seçer ve ilişkili panelini gösterir. Daha önce seçilen herhangi bir sekme seçimsiz hale gelir ve ilişkili paneli gizlenir. **Sekme panelinin gerçekten gösterilmeden döner** (yani `shown.coreui.tab` olayı gerçekleşmeden önce). |
### Olaylar

Yeni bir sekme gösterilirken olaylar aşağıdaki sırayla tetiklenir:

1. `hide.coreui.tab` (mevcut etkin sekmede)
2. `show.coreui.tab` (gösterilecek sekmede)
3. `hidden.coreui.tab` (önceki etkin sekmede, `hide.coreui.tab` olayıyla aynı olan)
4. `shown.coreui.tab` (yeni etkin gösterilen sekmede, `show.coreui.tab` olayıyla aynı olan)

Eğer zaten etkin bir sekme yoksa, o zaman `hide.coreui.tab` ve `hidden.coreui.tab` olayları tetiklenmez.


| Olay türü | Açıklama |
| --- | --- |
| `hide.coreui.tab` | Bu olay, yeni bir sekmenin gösterilecek olması durumunda tetiklenir (bu nedenle, önceki etkin sekmenin gizleneceği anlamına gelir). Mevcut etkin sekmeyi ve yeni etkin olacak sekmeyi hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
| `hidden.coreui.tab` | Bu olay, yeni bir sekme gösterildikten sonra tetiklenir (bu nedenle, önceki etkin sekme gizlenir). Önceki etkin sekmeyi ve yeni etkin sekmeyi hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
| `show.coreui.tab` | Bu olay, sekme gösterilmeden önce tetiklenir. Aktif sekmeyi ve önceki etkin sekmeyi (varsa) hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
| `shown.coreui.tab` | Bu olay, bir sekme gösterildikten sonra tetiklenir. Aktif sekmeyi ve önceki etkin sekmeyi (varsa) hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
```js
const tabEl = document.querySelector('button[data-coreui-toggle="tab"]')
tabEl.addEventListener('shown.coreui.tab', event => {
  event.target // yeni etkin sekme
  event.relatedTarget // önceki etkin sekme
})
```

---

## Özelleştirme

### CSS değişkenleri

Nav elemanları, gerçek zamanlı özelleştirmede geliştirilmiş olan yerel CSS değişkenlerini `.nav`, `.nav-tabs`, `.nav-pills`, `.nav-underline` ve `.nav-underline-border` üzerinde kullanır. CSS değişkenlerinin değerleri Sass ile ayarlanır; bu nedenle Sass özelleştirmesi de desteklenmektedir.

`.nav` temel sınıfında:

`.nav-tabs` modifiye sınıfında:

`.nav-pills` modifiye sınıfında:

`.nav-underline` modifiye sınıfında:

`.nav-underline-border` modifiye sınıfında:

### SASS değişkenleri

