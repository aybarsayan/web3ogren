---
layout: docs
title: Navbar
description: Bootstrap için CoreUI'nun güçlü, duyarlı navigasyon başlığı olan navbar'ına ilişkin belgeler ve örnekler. Marka, navigasyon ve daha fazlası için destek içerir; buna çökme eklentimizin desteği de dahildir.
keywords: [CoreUI, Bootstrap, navbar, duyarlı, navigasyon, bileşenler]
group: components
toc: true
bootstrap: true
other_frameworks: navbar
---

## Nasıl Çalışır

:::info
Navbar ile başlamadan önce bilmeniz gerekenler:
:::

- Navbars, duyarlı çökme ve `renk şeması` sınıfları için `.navbar` ile saran bir yapıya ihtiyaç duyar.
- Navbars ve içeriği varsayılan olarak akışkandır. Farklı şekillerde yatay genişliklerini sınırlamak için `konteyner` kullanın.
- Navbars içinde boşluk ve hizalama kontrolü için `boşluk` ve `flex` yardımcı sınıflarını kullanın.
- Navbars varsayılan olarak duyarlıdır, ancak bunu değiştirmek için kolayca özelleştirebilirsiniz. Duyarlı davranış, Çökme JavaScript eklentimize bağlıdır.
- Erişilebilirliği sağlamak için bir `` elementi kullanın veya daha genel bir element olan `` kullanıyorsanız, her navbar'a `role="navigation"` ekleyerek onu yardımcı teknolojiler kullanan kullanıcılar için belirgin bir işaretleyici olarak tanımlayın.
- Mevcut öğeyi belirtmek için mevcut sayfa için `aria-current="page"` veya bir setteki mevcut öğe için `aria-current="true"` kullanın.
- Navbars, `.navbar` temel sınıfına sınırlanan CSS değişkenleri ile temalandırılabilir. `.navbar-light` kullanım dışı bırakılmıştır ve `.navbar-dark`, CSS değişkenlerini geçersiz kılacak şekilde yeniden yazılmıştır.



## Desteklenen içerik

Navbars, birkaç alt bileşen için yerleşik destek ile birlikte gelir. İhtiyacınıza göre aşağıdakilerden birini seçin:

- Şirket, ürün veya proje adınız için `.navbar-brand`.
- Tam boyutlu ve hafif bir navigasyon için `.navbar-nav` (açılır menü desteği de dahil).
- Çökme eklentimizle ve diğer `navigasyon geçişi` davranışlarıyla kullanmak için `.navbar-toggler`.
- Herhangi bir form denetimi ve eylemleri için esnek ve boşluk yardımcıları.
- Dikey ortalanmış metin dizeleri eklemek için `.navbar-text`.
- Ana kırılma noktasına göre navbar içeriğini gruplamak ve gizlemek için `.collapse.navbar-collapse`.
- Genişletilmiş navbar içeriğini `scrolling` ayarlamak için isteğe bağlı `.navbar-scroll` ekleyin.

---

İşte `lg` (büyük) kırılma noktasında otomatik olarak akan, duyarlı ve açık bir temaya sahip navbar içinde bulunan tüm alt bileşenlerin bir örneği.

  
    Navbar
    
      
    
    
      
        
          Ana Sayfa
        
        
          Bağlantı
        
        
          
            Açılır Menü
          
          
            Eylem
            Başka bir eylem
            
            Burada başka bir şey
          
        
        
          Devre Dışı
        
      
      
        
        Ara
      
    
  

Bu örnek, `background` (`bg-body-tertiary`) ve `spacing` (`me-auto`, `mb-2`, `mb-lg-0`, `me-2`) yardımcı sınıflarını kullanır.

### Marka

`.navbar-brand` çoğu öğeye uygulanabilir, ancak bir bağlantı en iyi şekilde çalışır, çünkü bazı öğeler yardımcı sınıflar veya özel stiller gerektirebilir.

#### Metin

Metninizi `.navbar-brand` sınıfına sahip bir öğe içinde ekleyin.


  
    Navbar
  




  
    Navbar
  

#### Görüntü

`.navbar-brand` içindeki metni bir `` ile değiştirebilirsiniz.

  
    
      <img src="../../../images/cikti/coreui/static/assets/brand/coreui-signet.svg" alt="CoreUI İşareti" width="22" height="24">
    
  

#### Görüntü ve metin

Aynı anda bir görüntü ve metin eklemek için bazı ek yardımcıları da kullanabilirsiniz. `` üzerinde `.d-inline-block` ve `.align-text-top` eklemesine dikkat edin.

  
    
      <img src="../../../images/cikti/coreui/static/assets/brand/coreui-signet.svg" alt="CoreUI İşareti" width="22" height="24" class="d-inline-block align-top">
      CoreUI
    
  

### Nav

Navbar navigasyon bağlantıları, kendi modifiye sınıflarına sahip `.nav` seçeneklerimizi temel alır ve doğru duyarlı stil için `toggler sınıflarını` gerektirir. 

> **Navbar içindeki navigasyon, navbar içeriğini güvenli bir şekilde hizalamak için mümkün olduğunca yatay alanı kaplar.**

Mevcut sayfayı belirtmek için `.nav-link` üzerinde `.active` sınıfını ekleyin. Ayrıca, aktif `.nav-link` üzerinde `aria-current` niteliğini de eklemeniz gerektiğini unutmayın.

  
    Navbar
    
      
    
    
      
        
          Ana Sayfa
        
        
          Özellikler
        
        
          Fiyatlandırma
        
        
          Devre Dışı
        
      
    
  

Ayrıca, navlarımız için sınıfları kullandığımızdan, isterseniz tamamen liste tabanlı yaklaşımı atlayabilirsiniz.

  
    Navbar
    
      
    
    
      
        Ana Sayfa
        Özellikler
        Fiyatlandırma
        Devre Dışı
      
    
  

Navbar'ınızda açılır menüler de kullanabilirsiniz. Açılır menülerin düzgün konumlandırılması için saran bir eleman gereklidir, bu yüzden `.nav-item` ve `.nav-link` için ayrı ve iç içe öğeler kullandığınızdan emin olun.

  
    Navbar
    
      
    
    
      
        
          Ana Sayfa
        
        
          Özellikler
        
        
          Fiyatlandırma
        
        
          
            Açılır bağlantı
          
          
            Eylem
            Başka bir eylem
            Burada başka bir şey
          
        
      
    
  

### Formlar

Navbar içinde çeşitli form denetimleri ve bileşenleri yerleştirin:

  
    
      
      Ara
    
  

`.navbar`'ın doğrudan alt öğeleri esnek düzen kullanır ve varsayılan olarak `justify-content: space-between` olacaktır. Bu davranışı ayarlamak için gerektiğinde ek `flex yardımcıları` kullanın.

  
    Navbar
    
      
      Ara
    
  

Giriş grupları da çalışır. Navbar'ınız bir formun tamamı veya çoğunluğunu içeriyorsa, `` elemanını konteyner olarak kullanabilir ve bazı HTML'den tasarruf edebilirsiniz.

  
    
      @
      
    
  

Bu navbar formları kapsamında çeşitli butonlar da desteklenmektedir. Bu, farklı boyutlardaki öğeleri hizalamak için dikey hizalama yardımcılarını da kullanabileceğiniz iyi bir hatırlatıcadır.

  
    Ana buton
    Daha Küçük Buton
  

### Metin

Navbars, `.navbar-text` sınıfı ile metin parçalarını içerebilir. Bu sınıf metin dizeleri için dikey hizalamayı ve yatay boşluğu ayarlar.

  
    
      Satır içi öğe ile navbar metni
    
  

Diğer bileşenlerle ve yardımcılarla karıştırıp eşleştirin.

  
    Navbar w/ metin
    
      
    
    
      
        
          Ana Sayfa
        
        
          Özellikler
        
        
          Fiyatlandırma
        
      
      
        Satır içi öğe ile navbar metni
      
    
  

## Renk şemaları

:::warning
**v5.0.0'da yeni karanlık navbarlar —** `.navbar-dark` yerine yeni `data-coreui-theme="dark"`'ı kullandık. Bileşen özel bir renk modunu etkinleştirmek için `.navbar`'a `data-coreui-theme="dark"` ekleyin. `Renk modlarımız hakkında daha fazla bilgi edinin.`

---

**v4.2.6'da yeni  —** Navbar temalandırması artık CSS değişkenleri ile desteklenmektedir ve `.navbar-light` kullanım dışı bırakılmıştır. CSS değişkenleri `.navbar`'ya uygulanır ve varsayılan olarak "aydınlık" görünüm sunar, ayrıca `.navbar-dark` ile geçersiz kılınabilir.
:::

Navbar temaları CoreUI için Bootstrap'ın Sass ve CSS değişkenlerinin birleşimi sayesinde her zamankinden daha kolaydır. Varsayılan, açık arka plan renkleri için kullanılan "aydınlık navbar"dır, ancak karanlık arka plan renkleri için de `data-coreui-theme="dark"` uygulayabilirsiniz. Ardından, `.bg-*` yardımcıları ile özelleştirin.


  
    
      Navbar
      
        
      
      
        
          
            Ana Sayfa
          
          
            Özellikler
          
          
            Fiyatlandırma
          
          
            Hakkında
          
        
        
          
          Ara
        
      
    
  

  
    
      Navbar
      
        
      
      
        
          
            Ana Sayfa
          
          
            Özellikler
          
          
            Fiyatlandırma
          
          
            Hakkında
          
        
        
          
          Ara
        
      
    
  

  
    
      Navbar
      
        
      
      
        
          
            Ana Sayfa
          
          
            Özellikler
          
          
            Fiyatlandırma
          
          
            Hakkında
          
        
        
          
          Ara
        
      
    
  


```html
<nav class="navbar bg-dark border-bottom border-body" data-coreui-theme="dark">
  <!-- Navbar içeriği -->
</nav>

<nav class="navbar bg-primary" data-coreui-theme="dark">
  <!-- Navbar içeriği -->
</nav>

<nav class="navbar" style="background-color: #e3f2fd;">
  <!-- Navbar içeriği -->
</nav>
```

## Konteynırlar

Gerek olmasa da, bir navbar'ı sayfada ortalamak için `.container` içine sarabilirsiniz - ancak içte de bir konteynerin gerekli olduğunu unutmayın. Veya bir `sabit veya statik üst navbar`'ın içeriklerini yalnızca merkezlemek için `.navbar` içinde bir konteyner ekleyebilirsiniz.

  
    
      Navbar
    
  

Navbarınızdaki içeriğin ne kadar geniş sunulacağını değiştirmek için herhangi bir duyarlı konteyner kullanın.

  
    Navbar
  

---
description: Bu içerikte, statik ve dinamik navigasyon çubuklarının nasıl yerleştirileceği, kaydırma seçenekleri ve offcanvas bileşeni kullanarak özelleştirilebileceği hakkında bilgiler bulunmaktadır.
keywords: [navigasyon çubuğu, kaydırma, offcanvas, CSS, kullanıcı deneyimi, tasarım, duyarlı tasarım]
---

## Yerleştirme

Navigasyon çubuklarını statik olmayan konumlara yerleştirmek için `konum yardımcı araçlarımızı` kullanın. Üstte sabit, altta sabit, yukarı yapışkan (sayfa ile birlikte yukarı kayar, sonra orada kalır) veya aşağı yapışkan (sayfa ile birlikte aşağı kayar, sonra orada kalır) seçeneklerinden birini seçin.

:::info
Sabit navigasyon çubukları `position: fixed` kullanır; bu, DOM'un normal akışından çekildikleri anlamına gelir ve diğer öğelerle örtüşmesini önlemek için özel CSS (örn. `` üzerinde `padding-top`) gerektirebilir.
:::

  
    Varsayılan
  

  
    Sabit üst
  


  
  
    Sabit alt
  

  
    Yapışkan üst
  

  
    Yapışkan alt
  

## Kaydırma

Kısmi kapanabilir navigasyon çubuğunun içindeki içeriklerde dikey kaydırmayı etkinleştirmek için `.navbar-nav-scroll` sınıfını bir `.navbar-nav` (veya diğer navigasyon alt bileşeni) ile ekleyin. Varsayılan olarak, kaydırma `75vh` (veya görünüm yüksekliğinin %75'i) oranında başlar, ancak bunu yerel CSS özel özelliği `navbar-height` ile veya özel stillerle geçersiz kılabilirsiniz. Navigasyon çubuğu genişletildiğinde daha büyük görünüm alanlarında içerik, varsayılan bir navigasyon çubuğundaki gibi görünür.

:::tip
Bu davranışın bir potansiyel dezavantajı `overflow` içermesidir—içeriği kaydırmak için `overflow-y: auto` ayarlandığında burada, `overflow-x` otomatik olur ki bu da bazı yatay içerikleri kesebilir.
:::

İşte optimum boşluk için bazı ekstra kenar boşluğu yardımcı araçları ile `style="scroll-height: 100px;"` kullanan `.navbar-nav-scroll` ile bir örnek navigasyon çubuğu.

  
    Kaydırma navigasyonu
    
      
    
    
      
        
          Anasayfa
        
        
          Bağlantı
        
        
          
            Bağlantı
          
          
            Aksiyon
            Diğer aksiyon
            
            Burada başka bir şey
          
        
        
          Bağlantı
        
      
      
        
        Ara
      
    
  

## Duyarlı Davranışlar

Navigasyon çubukları, içeriklerinin bir buton arkasında çökmesi gerektiğinde `.navbar-toggler`, `.navbar-collapse` ve `.navbar-expand{-sm|-md|-lg|-xl|-xxl}` sınıflarını kullanabilir. Diğer yardımcı araçlarla birlikte, belirli öğeleri gösterme veya gizleme zamanını kolayca seçebilirsiniz.

:::warning
Asla çökmeyen navigasyon çubukları için navigasyon çubuğuna `.navbar-expand` sınıfını ekleyin. Her zaman çöken navigasyon çubukları için herhangi bir `.navbar-expand` sınıfı eklemeyin.
:::

### Anahtar

Navigasyon çubuğu anahtarları varsayılan olarak sola hizalanmıştır, ancak bir `.navbar-brand` gibi bir kardeş öğeyi takip ederse, otomatik olarak en sağa hizalanacaktır. İşaretlemenizi ters çevirmek, anahtarın yerini tersine çevirecektir. Aşağıda farklı anahtar stillerinin örnekleri bulunmaktadır.

En küçük eşik değerinde gösterilmeyen `.navbar-brand` ile:

  
    
      
    
    
      Gizli marka
      
        
          Anasayfa
        
        
          Bağlantı
        
        
          Devre dışı
        
      
      
        
        Ara
      
    
  

Solda marka adı gösterildiğinde ve sağda anahtar:

  
    Navigasyon çubuğu
    
      
    
    
      
        
          Anasayfa
        
        
          Bağlantı
        
        
          Devre dışı
        
      
      
        
        Ara
      
    
  

Solda anahtar ve sağda marka adı:

  
    
      
    
    Navigasyon çubuğu
    
      
        
          Anasayfa
        
        
          Bağlantı
        
        
          Devre dışı
        
      
      
        
        Ara
      
    
  

### Dış içerik

Bazen, çökme eklentisini `.navbar` dışındaki içerik için tetiklemek istersiniz. Eklentimiz `id` ve `data-coreui-target` eşleşmesi üzerinde çalıştığı için bu kolayca yapılabilir!

  
    Çökmüş içerik
    Navigasyon çubuğu markası aracılığıyla açılabilir.
  


  
    
      
    
  

Bunu yaptığınızda, açıldığında programlı olarak kapsayıcıya odaklanmak için ek JavaScript eklemenizi öneririz. Aksi takdirde, klavye kullanıcıları ve yardımcı teknoloji kullanıcıları muhtemelen yeni ortaya çıkan içeriği bulmakta zorluk çekebilir - özellikle açılan kapsayıcı belgenin yapısında *anahtarın* önünde geliyorsa. Ayrıca, anahtarın `aria-controls` özniteliğine sahip olduğundan, içeriğin kapsayıcısının `id`'sine işaret ettiğinden emin olmanızı öneririz. Teorik olarak, bu, yardımcı teknoloji kullanıcılarının doğrudan anahtardan kontrol ettiği kapsayıcıya atlamasına izin verir - ancak bunun desteklenmesi şu anda oldukça yaman.

### Offcanvas

Genişleyen ve çöken navigasyon çubuğunuzu `offcanvas bileşeni` ile bir offcanvas çekmecesine dönüştürün. Hem offcanvas varsayılan stillerini genişletiyoruz hem de dinamik ve esnek bir navigasyon yan çubuğu oluşturmak için `.navbar-expand-*` sınıflarımızı kullanıyoruz.

Aşağıdaki örnekte, tüm eşiklerde her zaman çökme durumunda bir offcanvas navigasyon çubuğu oluşturmak için `.navbar-expand-*` sınıfını tamamen atlayın.

  
    Offcanvas navigasyon çubuğu
    
      
    
    
      
        Offcanvas
        
      
      
        
          
            Anasayfa
          
          
            Bağlantı
          
          
            
              Aşırı
            
            
              Aksiyon
              Diğer aksiyon
              
                
              
              Burada başka bir şey
            
          
        
        
          
          Ara
        
      
    
  

Bir offcanvas navigasyon çubuğunu `lg` gibi belirli bir eşikte normal bir navigasyon çubuğuna genişletmek için `.navbar-expand-lg` kullanın.

```html
<nav class="navbar navbar-expand-lg bg-body-tertiary" fixed-top>
  <a class="navbar-brand" href="#">Offcanvas navigasyon çubuğu</a>
  <button class="navbar-toggler" type="button" data-coreui-toggle="offcanvas" data-coreui-target="#navbarOffcanvasLg" aria-controls="navbarOffcanvasLg">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="navbarOffcanvasLg" aria-labelledby="navbarOffcanvasLgLabel">
    ...
  </div>
</nav>
```

Karanlık bir navigasyon çubuğunda offcanvas kullanırken, metnin okunabilir olmaması için offcanvas içeriğinde karanlık bir arka plana sahip olmanız gerektiğini unutmayın. Aşağıdaki örnekte, karanlık bir offcanvas ile uygun stil sağlamak için `.navbar-dark` ve `.bg-dark`, `.offcanvas` için `.text-bg-dark`, `.dropdown-menu-dark` için `.dropdown-menu` ve `.btn-close-white` için `.btn-close` ekliyoruz.

  
    Karanlık offcanvas navigasyon çubuğu
    
      
    
    
      
        Karanlık offcanvas
        
      
      
        
          
            Anasayfa
          
          
            Bağlantı
          
          
            
              Aşırı
            
            
              Aksiyon
              Diğer aksiyon
              
                
              
              Burada başka bir şey
            
          
        
        
          
          Ara
        
      
    
  

## Özelleştirme

### CSS Değişkenleri

Navigasyon çubukları, geliştirilmiş gerçek zamanlı özelleştirme için `.navbar` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenlerinin değerleri Sass aracılığıyla ayarlanır; bu nedenle Sass özelleştirmesi de desteklenmektedir.

`.navbar-nav` üzerinde bazı ek CSS değişkenleri de mevcuttur:

### SASS Değişkenleri

Tüm navigasyon çubukları için değişkenler:

`Karanlık navigasyon çubuğu` için değişkenler:

### SASS Döngüsü

`Duyarlı navigasyon çubuğu genişletme/çökmek sınıfları` (örn. `.navbar-expand-lg`), `$breakpoints` haritası ile birleştirilir ve `scss/_navbar.scss` içinde bir döngü aracılığıyla oluşturulur.

