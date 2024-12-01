---
layout: docs
title: Açılır Menüler
description: Bootstrap açılır menü bileşeni, liste, bağlantı ve daha fazla HTML öğesi görüntülemek için bağlamsal örtüleri geçiş yaptırmanıza olanak tanır. Bu belgede açılır menülerin kullanımı, erişilebilirlik, örnekler ve stiller hakkında bilgiler bulacaksınız.
keywords: [Bootstrap, açılır menüler, UI bileşenleri, erişilebilirlik, web tasarımı]
---

## Genel Bakış

Açılır menüler, bağlantıların ve daha fazlasının listelerini görüntülemek için geçiş yapılabilen, bağlamsal örtülerdir. **Bootstrap açılır menü JavaScript eklentisi** ile etkileşimli hale getirilmiştir. Tıklama ile açılıp kapatılır, fare ile üzerine gelerek değil.

Açılır menüler, dinamik konumlandırma ve görünüm tespiti sağlayan üçüncü taraf bir kütüphane olan [Popper.js](https://popper.js.org/) üzerine inşa edilmiştir. CoreUI'nin JavaScript'inden önce `popper.min.js` dahil etmeyi unutmayın veya Popper.js içeren `coreui.bundle.min.js` / `coreui.bundle.js` kullanın. Ancak, açılır menülerin dinamik konumlandırmaya ihtiyacı olmadığından, navigasyon çubuklarında Popper.js kullanılmaz.

## Erişilebilirlik

[WAI ARIA](https://www.w3.org/TR/wai-aria/) standardı gerçekte [`role="menu"` widget'ını](https://www.w3.org/TR/wai-aria/#menu) tanımlar, ancak bu, eylemleri veya işlevleri tetikleyen uygulama benzeri menüler için özeldir. ARIA menüleri yalnızca menü öğeleri, onay kutusu menü öğeleri, radyo düğmesi menü öğeleri, radyo düğmesi grupları ve alt menüleri içerebilir.

CoreUI için Bootstrap'ın açılır menüleri ise, çeşitli durumlara ve işaretleme yapılarına uygulanabilir genel olarak tasarlanmıştır. Örneğin, arama alanları veya giriş formları gibi ek girişler ve form kontrolleri içeren açılır menüler oluşturmak mümkündür. Bu nedenle, Bootstrap, gerçek ARIA menüleri için gerekli `role` ve `aria-` özniteliklerini otomatik olarak eklemeyi beklemez. Yazarların bu daha spesifik öznitelikleri kendilerinin eklemesi gerekecektir.

:::tip
Bootstrap çoğu standart klavye menü etkileşimleri için yerleşik destek ekler; böylece kullanıcılar, tek tek `.dropdown-item` öğeleri arasında ok tuşları kullanarak geçiş yapabilir ve menüyü ESC tuşu ile kapatabilirler.
:::

## Örnekler

Açılır menünün geçişini ve açılır menüyü `.dropdown` içinde veya `position: relative;` olarak tanımlanan farklı bir öğe içinde oluşturun. Açılır menüler, olası ihtiyaçlarınıza daha iyi uyum sağlamak için `` veya `` öğelerinden tetiklenebilir.

### Tek buton

Her bir tek `.btn`, küçük değişikliklerle bir açılır menü geçişine dönüştürülebilir. İşte bunları `` öğeleri ile nasıl çalıştıracağınız:

  
    Açılır buton
  
  
    Eylem
    Başka bir eylem
    Burada başka bir şey
  

Ve `` öğeleri ile:

  
    Açılır bağlantı
  

  
    Eylem
    Başka bir eylem
    Burada başka bir şey
  

En güzel kısım ise, bunu her buton çeşidi ile de yapabilmenizdir:


  
    Ana Buton
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    İkincil
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Başarı
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Bilgi
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Uyarı
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Tehlike
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  


```html
<!-- Örnek tek tehlike butonu -->
<div class="btn-group">
  <button type="button" class="btn btn-danger dropdown-toggle" data-coreui-toggle="dropdown" aria-expanded="false">
    Eylem
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Eylem</a></li>
    <li><a class="dropdown-item" href="#">Başka bir eylem</a></li>
    <li><a class="dropdown-item" href="#">Burada başka bir şey</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Ayrılmış bağlantı</a></li>
  </ul>
</div>
```

### Bölümlü buton

Benzer şekilde, yalnızca `.dropdown-toggle-split` ekleyerek açılır menüleri bölümlü butonlarla oluşturun. Bu, açılır ok için etrafında doğru boşluk sağlamak içindir.

Bu ekstra sınıf, açılır okun her iki yanında 25% yatay `padding` azaltılmasını sağlar ve normal buton açılır menüleri için eklenmiş olan `margin-left`i kaldırır. Bu ek değişiklikler, açılır okun bölümlü butonda ortalanmasını ve ana butona bitişik daha düzgün boyutlandırılmış bir vurma alanı sağlamaktadır.


  
    Ana Buton
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    İkincil
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Başarı
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Bilgi
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Uyarı
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Tehlike
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  


```html
<!-- Örnek bölümlü tehlike butonu -->
<div class="btn-group">
  <button type="button" class="btn btn-danger">Eylem</button>
  <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-coreui-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Açılır Menüyü Geçiştirme</span>
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Eylem</a></li>
    <li><a class="dropdown-item" href="#">Başka bir eylem</a></li>
    <li><a class="dropdown-item" href="#">Burada başka bir şey</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Ayrılmış bağlantı</a></li>
  </ul>
</div>
```

## Boyutlandırma

Buton açılır menüleri, varsayılan ve bölümlü açılır menü butonları dahil olmak üzere tüm boyutlardaki butonlarla çalışır.


  
    
      Büyük buton
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Büyük bölümlü buton
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  


```html
<!-- Büyük buton grupları (varsayılan ve bölümlü) -->
<div class="btn-group">
  <button class="btn btn-secondary btn-lg dropdown-toggle" type="button" data-coreui-toggle="dropdown" aria-expanded="false">
    Büyük buton
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>
<div class="btn-group">
  <button class="btn btn-secondary btn-lg" type="button">
    Büyük bölümlü buton
  </button>
  <button type="button" class="btn btn-lg btn-secondary dropdown-toggle dropdown-toggle-split" data-coreui-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Açılır Menüyü Geçiştirme</span>
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>
```


  
    
      Küçük buton
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    Küçük bölümlü buton
    
      Açılır Menüyü Geçiştirme
    
    
      Eylem
      Başka bir eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  


```html
<div class="btn-group">
  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-coreui-toggle="dropdown" aria-expanded="false">
    Küçük buton
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>
<div class="btn-group">
  <button class="btn btn-secondary btn-sm" type="button">
    Küçük bölümlü buton
  </button>
  <button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-coreui-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Açılır Menüyü Geçiştirme</span>
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>
```

## Koyu açılır menüler

Koyu bir navigasyon çubuğuna veya özel bir stile uyum sağlamak için mevcut `.dropdown-menu` üzerine `.dropdown-menu-dark` ekleyerek daha koyu açılır menülere geçiş yapın. Açılır menü öğelerinde değişiklik yapmaya gerek yoktur.

  
    Açılır buton
  
  
    Eylem
    Başka bir eylem
    Burada başka bir şey
    
    Ayrılmış bağlantı
  

Ve bunu bir navigasyon çubuğunda kullanırken:

  
    Navigasyon Çubuğu
    
      
    
    
      
        
          
            Açılır Menü
          
          
            Eylem
            Başka bir eylem
            Burada başka bir şey
          
        
      
    
  

## Yönler


#### RTL
CoreUI'yi RTL kullanırken yönler ters döner, yani `.dropstart` sağ tarafta görünecektir.
### Merkezli

Açılır menüleri, ana öğenin altında merkezlenmiş şekilde görüntülemek için ana öğeye `.dropdown-center` ekleyin.

  
    Merkezli açılır
  
  
    Eylem
    İki eylem
    Üç eylem
  

---
description: Bu içerik, açılır menü bileşenlerinin nasıl kullanılacağını ve çeşitli stillerini açıklamaktadır. Dropup, dropend, dropstart ve diğer hizalama seçenekleri hakkında bilgi sunar.
keywords: [dropdown, dropup, dropend, dropstart, UI components]
---

### Dropup

Öğelerin üzerinde açılır menüleri tetiklemek için, üst öğeye `.dropup` ekleyin.


  
    
      Dropup
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    
      Split dropup
    
    
      Açılır Menüyü Değiştir
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  


```html
<!-- Varsayılan dropup butonu -->
<div class="btn-group dropup">
  <button type="button" class="btn btn-secondary dropdown-toggle" data-coreui-toggle="dropdown" aria-expanded="false">
    Dropup
  </button>
  <ul class="dropdown-menu">
    <!-- Açılır menü bağlantıları -->
  </ul>
</div>

<!-- Split dropup butonu -->
<div class="btn-group dropup">
  <button type="button" class="btn btn-secondary">
    Split dropup
  </button>
  <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-coreui-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Açılır Menüyü Değiştir</span>
  </button>
  <ul class="dropdown-menu">
    <!-- Açılır menü bağlantıları -->
  </ul>
</div>
```

### Ortalanmış Dropup

Toggle'ın üzerinde dropup menüsünü ortalamak için üst öğeye `.dropup-center` ekleyin.

  
    Ortalanmış dropup
  
  
    Eylem
    İki numaralı eylem
    Üç numaralı eylem
  

### Dropend

Elemanların sağında açılır menüleri tetiklemek için, üst öğeye `.dropend` ekleyin.


  
    
      Dropend
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    
      Split dropend
    
    
      Dropend'i Değiştir
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  


```html
<!-- Varsayılan dropend butonu -->
<div class="btn-group dropend">
  <button type="button" class="btn btn-secondary dropdown-toggle" data-coreui-toggle="dropdown" aria-expanded="false">
    Dropend
  </button>
  <ul class="dropdown-menu">
    <!-- Açılır menü bağlantıları -->
  </ul>
</div>

<!-- Split dropend butonu -->
<div class="btn-group dropend">
  <button type="button" class="btn btn-secondary">
    Split dropend
  </button>
  <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-coreui-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Dropend'i Değiştir</span>
  </button>
  <ul class="dropdown-menu">
    <!-- Açılır menü bağlantıları -->
  </ul>
</div>
```

### Dropstart

Elemanların solunda açılır menüleri tetiklemek için, üst öğeye `.dropstart` ekleyin.


  
    
      Dropstart
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  
  
    
      Dropstart'i Değiştir
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
    
      Split dropstart
    
  


```html
<!-- Varsayılan dropstart butonu -->
<div class="btn-group dropstart">
  <button type="button" class="btn btn-secondary dropdown-toggle" data-coreui-toggle="dropdown" aria-expanded="false">
    Dropstart
  </button>
  <ul class="dropdown-menu">
    <!-- Açılır menü bağlantıları -->
  </ul>
</div>

<!-- Split dropstart butonu -->
<div class="btn-group dropstart">
  <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-coreui-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Dropstart'i Değiştir</span>
  </button>
  <ul class="dropdown-menu">
    <!-- Açılır menü bağlantıları -->
  </ul>
  <button type="button" class="btn btn-secondary">
    Split dropstart
  </button>
</div>
```

## Menü öğeleri

Dropdown öğeleri olarak `` veya `` elemanlarını kullanabilirsiniz.

  
    Açılır Menü
  
  
    Eylem
    Diğer eylem
    Burada başka bir şey
  

Ayrıca, `.dropdown-item-text` ile etkileşime girmeyen açılır menü öğeleri oluşturabilirsiniz. İsterseniz özel CSS veya metin yardımcıları ile daha fazla stillendirme yapabilirsiniz.

  Açılır menü öğe metni
  Eylem
  Diğer eylem
  Burada başka bir şey

### Aktif

Dropdown öğelerine `.active` ekleyerek **aktif olarak stilize edin**. Aktif durumu destekleyici teknolojilere iletmek için `aria-current` niteliğini kullanın — mevcut sayfa için `page` değerini veya bir setteki mevcut öğe için `true` değerini kullanarak.

  Normal bağlantı
  Aktif bağlantı
  Diğer bağlantı

### Devre Dışı

Dropdown öğelerine `.disabled` ekleyerek **devre dışı olarak stilize edin**.

  Normal bağlantı
  Devre dışı bağlantı
  Diğer bağlantı

## Menü hizalaması

Varsayılan olarak, açılır menü, üst öğesinin sol tarafından %100 yükseklikte otomatik olarak konumlandırılır. Açılır menüyü sağa hizalamak için `.dropdown-menu-end` ekleyin.


**Dikkat!** Açılır menüler Popper sayesinde konumlandırılır, ancak navbar içinde yer almadıklarında.
  
    Sağdan hizalanmış menü örneği
  
  
    Eylem
    Diğer eylem
    Burada başka bir şey
  

### Duyarlı hizalama

Duyarlı hizalama kullanmak istiyorsanız, dinamik konumlandırmayı devre dışı bırakmak için `data-coreui-display="static"` niteliğini ekleyin ve duyarlı varyasyon sınıflarını kullanın.

**Sağda** açılır menüyü, belirli bir kırılma noktasına veya daha büyüğüne hizalamak için, `.dropdown-menu{-sm|-md|-lg|-xl|-xxl}-end` ekleyin.

  
    Solda hizalı ama büyük ekranda sağa hizalı
  
  
    Eylem
    Diğer eylem
    Burada başka bir şey
  

**Solda** açılır menüyü, belirli bir kırılma noktasına veya daha büyüğüne hizalamak için, `.dropdown-menu-end` ve `.dropdown-menu{-sm|-md|-lg|-xl|-xxl}-start` ekleyin.

  
    Sağdan hizalı ama büyük ekranda solda hizalı
  
  
    Eylem
    Diğer eylem
    Burada başka bir şey
  

Navbar içindeki dropdown butonları için `data-coreui-display="static"` özelliğini eklemeniz gerekmez, çünkü navbar içinde Popper kullanılmaz.

### Hizalama seçenekleri

Yukarıda gösterilen seçeneklerin çoğunu alarak, işte farklı açılır menü hizalama seçeneklerinin bir arada yer aldığı küçük bir örnek.

  
    Açılır Menü
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Sağdan hizalanmış menü
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Soldan hizalı, sağdan hizalı lg
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Sağdan hizalı, soldan hizalı lg
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Dropstart
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Dropend
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Dropup
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  

## Menü içeriği

### Başlıklar

Herhangi bir açılır menüde eylem bölümlerini etiketlemek için bir başlık ekleyin.

  Açılır Menü Başlığı
  Eylem
  Diğer eylem

### Ayırıcılar

İlgili menü öğelerini ayırmak için bir ayırıcı kullanın.

  Eylem
  Diğer eylem
  Burada başka bir şey
  
  Ayrılmış bağlantı

### Metin

Bir açılır menü içinde herhangi bir serbest metin yerleştirin ve `boşluk yardımcıları` kullanın. Menünün genişliğini kısıtlamak için muhtemelen ek boyutlandırma stillerine ihtiyacınız olacaktır.

  
    Açılır menü içinde serbest akan bazı örnek metin.
  
  
    Ve bu daha fazla örnek metin.
  

### Formlar

Bir açılır menü içine bir form koyun veya onu bir açılır menü haline getirin ve gerekli negatif alanı sağlamak için `kenar veya iç boşluk yardımcıları` kullanın.

  
    
      E-posta adresi
      
    
    
      Şifre
      
    
    
      
        
        
          Beni hatırla
        
      
    
    Giriş Yap
  
  
  Burada yeni misin? Kaydol
  Şifremi unuttum?

  
    Açılır form
  
  
    
      E-posta adresi
      
    
    
      Şifre
      
    
    
      
        
        
          Beni hatırla
        
      
    
    Giriş Yap
  

## Açılır menü seçenekleri

Açılır menünün konumunu değiştirmek için `data-coreui-offset` veya `data-coreui-reference` kullanın.

  
    
      Kaydırma
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
    
  
  
    Referans
    
      Açılır Menüyü Değiştir
    
    
      Eylem
      Diğer eylem
      Burada başka bir şey
      
      Ayrılmış bağlantı
    
  

---
title: Otomatik kapama davranışı
description: Bu içerik, açılır menülerin otomatik kapama davranışını ve bu davranışın nasıl yapılandırılacağını açıklar. Otomatik kapama seçenekleri ve JavaScript kullanarak açılır menülerin yönetimi hakkında bilgiler içerir.
keywords: [açılır menü, otomatik kapama, JavaScript, CoreUI, kullanıcı arayüzü]
---

### Otomatik kapama davranışı

Varsayılan olarak, açılır menüye tıklanıldığında açılır menü kapatılır. Bu açılır menünün davranışını değiştirmek için `autoClose` seçeneğini kullanabilirsiniz.

  
    Varsayılan açılır menü
  

  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    İçeride tıklanabilir
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Dışarıda tıklanabilir
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  



  
    Manuel kapama
  
  
    Menü öğesi
    Menü öğesi
    Menü öğesi
  

## Kullanım

Veri özellikleri veya JavaScript aracılığıyla, açılır menü eklentisi gizli içeriği (açılır menüler) ebeveyn `.dropdown-menu` üzerindeki `.show` sınıfını değiştirerek yönetir. Açılır menüleri kapatmak için `data-coreui-toggle="dropdown"` niteliğine güvenilir, bu nedenle bunu her zaman kullanmak iyi bir fikirdir.

:::info
Dokunmatik özellikli cihazlarda, bir açılır menüyü açmak, `` öğesinin doğrudan çocuklarına boş `mouseover` işleyicileri ekler. Bu çirkin hile, [iOS'un olay delegasyonundaki bir sorunu](https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html) aşmak için gereklidir; aksi takdirde açılır menünün dışındaki bir yere tıklamanın kodu tetiklemesini engeller. Açılır menü kapatıldığında, bu ek boş `mouseover` işleyicileri kaldırılır.
::: 

### Veri özellikleri aracılığıyla

Açılır menüyü değiştirmek için bir bağlantıya veya düğmeye `data-coreui-toggle="dropdown"` ekleyin.

```html
<div class="dropdown">
  <button type="button" data-coreui-toggle="dropdown" aria-expanded="false">
    Açılır menü tetikleyici
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>
```

### JavaScript aracılığıyla

JavaScript ile açılır menüleri çağırın:

```js
const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new coreui.Dropdown(dropdownToggleEl))
```

:::info
##### `data-coreui-toggle="dropdown"` hala gerekli

Açılır menünüzü JavaScript ile çağırıp çağırmadığınıza veya veri API'sini kullanıp kullanmadığınıza bakılmaksızın, `data-coreui-toggle="dropdown"` her zaman açılır menünün tetikleyici öğesinde bulunmalıdır.
:::

### Seçenekler




| Ad | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `autoClose` | boolean, string | `true` | Açılır menünün otomatik kapama davranışını yapılandırın: `true` - açılır menü, açılır menünün dışına veya içine tıklanarak kapatılır.`false` - açılır menü, açılır menü tuşuna tıklanarak ve `hide` veya `toggle` yöntemini manuel olarak çağırarak kapatılır. (Ayrıca esc tuşuna basılarak kapatılmaz)`'inside'` - açılır menü yalnızca açılır menünün içine tıklanarak kapatılır.`'outside'` - açılır menü yalnızca açılır menünün dışına tıklanarak kapatılır. Not: Açılır menü her zaman ESC tuşu ile kapatılabilir |
| `boundary` | string, element | `'clippingParents'` | Açılır menünün taşma kısıtlama sınırı (yalnızca Popper'ın preventOverflow modifikatörüne uygulanır). Varsayılan olarak `clippingParents` olup yalnızca bir HTMLElement referansı kabul eder (sadece JavaScript ile). Daha fazla bilgi için Popper'ın [detectOverflow belgelerine](https://popper.js.org/docs/v2/utils/detect-overflow/#boundary) bakın. |
| `display` | string | `'dynamic'` | Varsayılan olarak, dinamik konumlandırma için Popper kullanıyoruz. Bunu `static` ile devre dışı bırakın. |
| `offset` | array, string, function | `[0, 2]` | Açılır menünün hedefine göre ofseti. Veri özelliklerinde `data-coreui-offset="10,20"` gibi virgülle ayrılmış değerler ile bir dize geçirebilirsiniz. Ofseti belirlemek için bir işlev kullanıldığında, bir nesne ile birlikte çağrılır: popper yerleşimi, referans ve popper dikdörtgenleri birinci argüman olarak geçilir. Tetikleyici öğenin DOM düğümü ikinci argüman olarak geçilir. İşlev, iki sayı içeren bir dizi döndürmelidir: [skidding](https://popper.js.org/docs/v2/modifiers/offset/#skidding-1), [distance](https://popper.js.org/docs/v2/modifiers/offset/#distance-1). Daha fazla bilgi için Popper'ın [ofset belgelerine](https://popper.js.org/docs/v2/modifiers/offset/#options) bakın. |
| `popperConfig` | null, object, function | `null` | CoreUI for Bootstrap'ın varsayılan Popper yapılandırmasını değiştirmek için, [Popper'ın yapılandırmasına](https://popper.js.org/docs/v2/constructors/#options) bakın. Popper yapılandırmasını oluşturmak için bir işlev kullanıldığında, bu işlev CoreUI for Bootstrap'ın varsayılan Popper yapılandırmasını içeren bir nesne ile çağrılır. Varsayılanı kendi yapılandırmanızla birleştirmenize yardımcı olur. İşlev, Popper için bir yapılandırma nesnesi döndürmelidir. |
| `reference` | string, element, object | `'toggle'` | Açılır menünün referans öğesi. `'toggle'`, `'parent'`, bir HTMLElement referansı veya `getBoundingClientRect` sağlayan bir nesne gibi değerleri kabul eder. Daha fazla bilgi için Popper'ın [constructor belgelerine](https://popper.js.org/docs/v2/constructors/#createpopper) ve [sanalsal öğe belgelerine](https://popper.js.org/docs/v2/virtual-elements/) bakın. |
#### `popperConfig` ile işlev kullanma

```js
const dropdown = new coreui.Dropdown(element, {
  popperConfig(defaultBsPopperConfig) {
    // const newPopperConfig = {...}
    // ihtiyaç varsa defaultBsPopperConfig kullanın...
    // yeniPopperConfig'i döndür
  }
})
```

### Yöntemler


| Yöntem | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin açılır menüsünü yok eder. (DOM öğesindeki saklanan verileri kaldırır) |
| `getInstance` | Belirli bir DOM öğesi ile ilişkili açılır menü örneğini elde etmenizi sağlayan statik bir yöntemdir, bunu şöyle kullanabilirsiniz: `coreui.Dropdown.getInstance(element)` |
| `getOrCreateInstance` | Bir DOM öğesi ile ilişkili açılır menü örneğini döndüren veya yeni bir tane oluşturacak olan statik bir yöntemdir, eğer başlatılmamışsa. Bunu şöyle kullanabilirsiniz: `coreui.Dropdown.getOrCreateInstance(element)`. |
| `hide` | Belirli bir üst menü veya sekmeli navigasyonun açılır menüsünü gizler. |
| `show` | Belirli bir üst menü veya sekmeli navigasyonun açılır menüsünü gösterir. |
| `toggle` | Belirli bir üst menü veya sekmeli navigasyonun açılır menüsünü değiştirir. |
| `update` | Bir öğenin açılır menüsünün konumunu günceller. |
### Olaylar

Tüm açılır menü olayları `.dropdown-menu`'nin ebeveyn öğesinde tetiklenir ve `relatedTarget` özelliğine sahiptir; bu özelliğin değeri, değiştirilen bağlantı öğesidir.
`hide.coreui.dropdown` ve `hidden.coreui.dropdown` olayları, `click` orijinal Olay türü olduğunda yalnızca bir `clickEvent` özelliğine sahiptir; bu özellik, tıklama olayına ait bir Olay Nesnesini içerir.


| Olay türü | Açıklama |
| --- | --- |
| `hide.coreui.dropdown` | `hide` örnek yönteminin çağrıldığında hemen tetiklenir. |
| `hidden.coreui.dropdown` | Açılır menünün kullanıcıdan gizlenme işlemi tamamlandığında ve CSS geçişleri tamamlandığında tetiklenir. |
| `show.coreui.dropdown` | `show` örnek yöntemi çağrıldığında hemen tetiklenir. |
| `shown.coreui.dropdown` | Açılır menünün kullanıcıya görünür hale geldiğinde ve CSS geçişleri tamamlandığında tetiklenir. |
```js
const myDropdown = document.getElementById('myDropdown')
myDropdown.addEventListener('show.coreui.dropdown', event => {
  // bir şey yap...
})
```

## Özelleştirme

### CSS değişkenleri

Açılır menüler, gerçek zamanlı özelleştirmeyi geliştirmek için `.dropdown-menu` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmesi hala desteklenmektedir.

CSS değişkenleri ile özelleştirme, belirli değerleri çoğaltılmış CSS seçicileri eklemeden geçersiz kıldığımız `.dropdown-menu-dark` sınıfında görülebilir.

### SASS değişkenleri

Tüm açılır menüler için değişkenler:

`Koyu açılır menü` için değişkenler:

Açılır menünün etkileşimini gösteren CSS tabanlı oklar için değişkenler:

### SASS mixinleri

Mixin'ler, CSS tabanlı okları oluşturmak için kullanılır ve `scss/mixins/_caret.scss` dosyasında bulunabilir.

