---
description: CoreUI'nin güçlü, duyarlı başlığı için dokümantasyon ve örnekler. Markalaşma, navigasyon ve daha fazlası için destek içerir.
keywords: [CoreUI, başlık, bileşen, navigasyon, duyarlı tasarım, CSS değişkenleri, örnekler]
---


.cd-example .header:not(:last-child) {
  margin-bottom: 20px;
}


## Nasıl çalışır

Başlık bileşeni ile başlamadan önce bilmeniz gerekenler:

- **Başlıklar** ve içerikleri varsayılan olarak akışkandır. Yatay genişliklerini sınırlamak için `isteğe bağlı konteynerler` kullanın.
- Başlıklardaki boşluk ve hizalamayı kontrol etmek için `boşluk` ve `flex` yardımcı sınıflarını kullanın.
- **Başlıklar varsayılan olarak duyarlıdır**, ancak bunu değiştirmek için kolayca değişiklik yapabilirsiniz. Duyarlı davranış, Çökme JavaScript eklentimize bağlıdır.
  
:::info
Yazdırma sırasında başlıklar varsayılan olarak gizlidir. Yazdırılması için `.header` sınıfına `.d-print` ekleyerek zorlayın. `gösterim` yardımcı sınıfını görün.
:::

- Erişilebilirliği sağlamak için bir `` öğesi kullanın veya daha genel bir öğe olan bir `` kullanıyorsanız, yardımcı teknolojilerin kullanıcıları için bir yer belirleyici bölgeyi açıkça tanımlamak adına her başlığa `role="navigation"` ekleyin.

Devam edin ve bir örnek ile desteklenen alt bileşenlerin listesini okuyun.

## Desteklenen içerik

Başlıklar, bir dizi alt bileşen için yerleşik destek ile birlikte gelir. Gerekli gördüğünüzden seçin:

- Şirket, ürün veya proje adınız için `.header-brand`.
- Tam boyutlu ve hafif bir **navigasyon** (açılır menü desteği dahil) için `.header-nav`.
- Çökme eklentimiz ve diğer `navigasyon anahtarları` davranışları ile kullanılmak üzere `.header-toggler`.
- Dikey olarak ortalanmış metin dizileri eklemek için `.header-text`.

İşte bir duyarlı başlıkta tüm alt bileşenlerin bir örneği.

  
    ![](../../../images/cikti/coreui/static/assets/brand/coreui-signet.svg){:width="22" height="24" class="d-inline-block align-top" alt="CoreUI Logo"}
    CoreUI
  
  
    
  
  
    
      Ana Sayfa (mevcut)
    
    
      Bağlantı
    
    
      
        Açılır Menü
      
      
        Eylem
        Başka bir eylem
        
        Burada başka bir şey
      
    
    
      Devre Dışı
    
  
  
    
    Ara
  

Bu örnek, `renk` (`bg-light`) ve `boşluk` (`my-2`, `my-lg-0`, `mr-sm-0`, `my-sm-0`) yardımcı sınıflarını kullanır.

### Marka

`.header-brand` çoğu elemana uygulanabilir, ancak bir bağlantı en iyi sonucu verir, çünkü bazı öğeler yardımcı sınıflar veya özel stiller gerektirebilir.

:::tip
### Örnek
Aşağıdaki yöntemlerle `.header-brand` sınıfını kullanabilirsiniz. 

- **Bir bağlantı olarak**
```html
<header class="header">
  <a class="header-brand" href="#">CoreUI</a>
</header>
```

- **Bir başlık olarak**
```html
<header class="header">
  <span class="header-brand mb-0 h1">Başlık</span>
</header>
```
:::

`.header-brand` içerisine resim eklemek genellikle özel stiller veya yardımcılar gerektirir. İşte bazı örnekler.


  
    ![](../../../images/cikti/coreui/static/assets/brand/coreui-signet.svg){:width="22" height="24" alt="CoreUI Logo"}
  


  
    ![](../../../images/cikti/coreui/static/assets/brand/coreui-signet.svg){:width="22" height="24" class="d-inline-block align-top" alt="CoreUI Logo"}
    CoreUI
  

### Nav

Başlık navigasyon bağlantıları, `.header-nav` ile oluşturulur.

Aktif durumları—`.active`—mevcut sayfayı belirtmek için doğrudan `.nav-link` veya bunların hemen üzerindeki `.nav-item` öğelerine uygulanabilir.

:::note
### Örnek
```html
<header class="header">
  <a class="header-brand" href="#">CoreUI</a>
  <ul class="header-nav">
    <li class="nav-item active">
      <a class="nav-link" href="#">Ana Sayfa <span class="visually-hidden">(mevcut)</span></a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Özellikler</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Fiyatlandırma</a>
    </li>
    <li class="nav-item">
      <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Devre Dışı</a>
    </li>
  </ul>
</header>
```
:::

Ve çünkü biz nav'lar için sınıflar kullanıyoruz, istediğiniz takdirde liste tabanlı yaklaşımı tamamen ortadan kaldırabilirsiniz.

  CoreUI
  
    Ana Sayfa (mevcut)
    Özellikler
    Fiyatlandırma
    Devre Dışı
  

Başlık navigasyonunuzda açılır menüleri de kullanabilirsiniz. Açılır menülerin konumlandırma için bir sarmalayıcı öğeye ihtiyacı vardır, bu nedenle `.nav-item` ve `.nav-link` için ayrı ve iç içe öğeler kullanmaya dikkat edin.

:::danger
Açılır menü bağlantıları doğru çalışması için yukarıda belirtilen yapıda olmalıdır.
:::

  CoreUI
  
    
      Ana Sayfa (mevcut)
    
    
      Özellikler
    
    
      Fiyatlandırma
    
    
      
        Açılır Menü Bağlantısı
      
      
        Eylem
        Başka bir eylem
        Burada başka bir şey
      
    
  

### Formlar

Anahtar kelimeleri ve bileşenleri `.d-flex` ile birlikte bir başlık içinde yerleştirin.

:::tip
### Örnek
```html
<header class="header">
  <form class="d-flex">
    <input class="form-control me-2" type="search" placeholder="Ara" aria-label="Ara">
    <button class="btn btn-outline-success" type="submit">Ara</button>
  </form>
</header>
```
:::

`.header` içindeki doğrudan çocuk öğeler, esnek düzen kullanır ve varsayılan olarak `justify-content: between` ayarını alır. Bu davranışı ayarlamak için gerektiğinde ek `flex yardımcıları` kullanın.

  Başlık
  
    
    Ara
  

Giriş grupları da çalışır:

  
    
      
        @
      
      
    
  

Bu başlık formlarının bir parçası olarak çeşitli düğmeler desteklenir. **Farklı boyutlardaki öğeleri hizalamak için dikey hizalama yardımcılarının da kullanılabileceğini hatırlatır.**

  
    Ana düğme
    Küçük düğme
  

### Metin

Başlıklar, `.header-text` yardımıyla metin parçaları içerebilir. Bu sınıf, metin dizeleri için dikey hizalamayı ve yatay boşluğu ayarlar.

  
    Satır içi bir öğe ile başlık metni
  

## Konteynerler

Gerekli olmamakla birlikte, bir başlığı bir `.container` içine sarmalayarak sayfada merkezi hale getirebilirsiniz veya sabit veya statik üst başlığın içeriklerini yalnızca merkezileştirmek için bir tane ekleyebilirsiniz.

  
    CoreUI
  

Konteyner başlığınızın içinde olduğunda, yatay dolgusu, belirttiğiniz `.header-expand{-sm|-md|-lg|-xl}` sınıfından daha düşük kesim noktalarında kaldırılır. Bu, başlığınız çöktüğünde alt görünümde gereksiz yere dolgu eklemediğimizden emin olmaktır.

  
    CoreUI
  

## Özelleştirme

### CSS değişkenleri

Başlıklar, geliştirilmiş gerçek zamanlı özelleştirme için `.header` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass ile ayarlanır, bu nedenle Sass özelleştirmesi de desteklenir.

### SASS değişkenleri

