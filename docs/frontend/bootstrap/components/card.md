---
description: Bootstrap kart bileşeni içerik görüntülemek için esnek ve genişletilebilir bir konteyner sağlar. Bootstrap kart birçok varyant ve seçeneğiyle birlikte sunulmaktadır.
keywords: [Bootstrap, kart, bileşen, responsive, içerik, özelleştirme, tasarım]
---

## Hakkında

Bir Bootstrap kart bileşeni bir içerik konteyneridir. Resimler, başlıklar ve altbaşlıklar, geniş bir içerik yelpazesi, bağlamsal arka plan renkleri ve mükemmel görüntüleme seçenekleri için seçenekler içerir. Bootstrap kartları eski Bootstrap panellerinin, Bootstrap kuyu sisteminin ve Bootstrap küçük resimlerinin yerini alır.

---

## Örnek

:::tip
Kartlar mümkün olduğunca az işaretleme ve stil ile oluşturulmuş olup, birçok kontrol ve özelleştirme sunmayı başarmıştır.
:::

Kartların varsayılan olarak üst, sol ve sağ kenar boşlukları yoktur, bu yüzden ihtiyaç duyulduğunda `boşluk yardımcılarını` kullanın. Başlangıçta sabit bir genişliğe sahip değildirler, bu yüzden bulundukları üst öğenin tam genişliğini dolduracaklardır.

Aşağıda karışık içerik ve sabit bir genişliğe sahip temel bir kart örneği verilmiştir:

  
  
    Kart başlığı
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
    Bir yere git
  

---

## İçerik türleri

Bootstrap kart çeşitli içerik türlerini destekler; resimler, metinler, liste grupları, bağlantılar ve daha fazlası. Aşağıda bu öğelerin örnekleri bulunmaktadır.

### Gövde

Bir kartın ana bloğu `.card-body`'dir. Bir kart içinde yastıklı bir bölüm gerektiğinde kullanılabilir.

  
    Bu bir kart gövdesi içindeki bazı metinlerdir.
  

### Başlıklar, metinler ve bağlantılar

Kart başlıkları `` etiketine `.card-title` eklenerek kontrol edilir. Benzer şekilde, bağlantılar birbirine bağlanıp toplanarak `` etiketine `.card-link` eklenerek kullanılır. 

Alt başlıklar, bir `` etiketine `.card-subtitle` eklenerek yönetilir. Eğer `.card-title` içerisinde de bulunuyorsa, `.card-subtitle` öğeleri bir `.card-body` öğesinde depolanır, kart başlığı ve alt başlığı düzgün bir şekilde düzenlenir.

  
    Kart başlığı
    Kart alt başlığı
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
    Kart bağlantısı
    Başka bir bağlantı
  

### Resimler

**Kart içindeki resimlerin stilizasyona dikkat etmek önemlidir.** `.card-img-top` ve `.card-img-bottom`, kartın kenarlarıyla uyumlu olarak üst ve alt köşeleri dairesel hale getirir. `.card-text` içindeki metin ek olarak normal HTML etiketleri ile stilize edilebilir.

  
  
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
  

### Liste grupları

Bir kartta içeriğin listelerini, düzgün bir liste grubu ile oluşturun.

  
    Bir öğe
    İkinci bir öğe
    Üçüncü bir öğe
  

  
    Öne Çıkan
  
  
    Bir öğe
    İkinci bir öğe
    Üçüncü bir öğe
  

  
    Bir öğe
    İkinci bir öğe
    Üçüncü bir öğe
  
  
    Kart alt kısmı
  

### Mutfak lavabosu

Gerekli olan kartı oluşturmak için birçok içerik türünü birleştirin veya hepsini bir araya getirin. Aşağıda çeşitli stilize edilmiş resimler, bloklar, metin stilleri ve bir liste grubu - hepsi sabit genişlikte bir kartta gösterilmektedir.

  
  
    Kart başlığı
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
  
  
    Bir öğe
    İkinci bir öğe
    Üçüncü bir öğe
  
  
    Kart bağlantısı
    Başka bir bağlantı
  

### Başlık ve alt kısım

Bir kart içinde isteğe bağlı başlık ve/veya alt kısım ekleyin.

  
    Öne Çıkan
  
  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  

Kart başlıkları `` öğelerine `.card-header` eklenerek stilize edilebilir.

  Öne Çıkan
  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  

---

## Boyutlandırma

Kartlar başlangıçta belirli bir `genişlik` varsayılamaz; bu yüzden aksi belirtilmediği sürece %100 geniş olacaktır. Bunun için özel CSS, ızgara sınıfları, ızgara Sass karışımları veya hizmetler vasıtasıyla ayarlayabilirsiniz.

### Izgara işaretlemesi kullanma

Izgara kullanarak, kartları gerekli olduğunda sütunlar ve satırlar içine yerleştirin.

  
    
      
        Özel başlık uygulaması
        Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
        Bir yere git
      
    
  
  
    
      
        Özel başlık uygulaması
        Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
        Bir yere git
      
    
  

### Araçları kullanma

Bir kartın genişliğini hızlı bir şekilde ayarlamak için `mevcut boyutlandırma araçlarını` kullanın.

  
    Kart başlığı
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Buton
  



  
    Kart başlığı
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Buton
  

### Özel CSS Kullanma

Genişliği ayarlamak için stil dosyalarınızda veya satır içi stiller olarak özel CSS kullanın.

  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  

## Metin hizalaması

Bir kartın metin düzenini anında değiştirebilirsiniz - tamamında veya belirli kısımlarında - `metin hizalama sınıfları` kullanarak.

  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  



  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  



  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  

---

## Navigasyon

Bir kartın başlığına (veya bloğuna) CoreUI için Bootstrap’ın `nav bileşenleri` ile bazı navigasyonlar ekleyin.

  
    
      
        Aktif
      
      
        Bağlantı
      
      
        Devre Dışı
      
    
  
  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  

  
    
      
        Aktif
      
      
        Bağlantı
      
      
        Devre Dışı
      
    
  
  
    Özel başlık uygulaması
    Ekstra içerik ile doğal bir geçiş sağlayacak şekilde alttaki destekleyici metinle birlikte.
    Bir yere git
  

## Resimler

Kartlar, resimlerle etkileşim için çeşitli seçenekler sunar. Bir kartın her iki ucuna "resim başları" eklemek, içerikle resimleri kaplamak veya kart içine yalnızca resim eklemek için seçim yapın.

### Resim başları

Başlıklar ve alt kısımlar gibi, kartlar üst veya alt kısımda "resim başları" - bir kartın üstünde veya altında resimler - içerebilir.

  
  
    Kart başlığı
    Bu, aşağıda ek destekleyici metin olan daha geniş bir karttır. Bu içerik biraz daha uzundur.
    Son güncelleme 3 dakika önce
  


  
    Kart başlığı
    Bu, aşağıda ek destekleyici metin olan daha geniş bir karttır. Bu içerik biraz daha uzundur.
    Son güncelleme 3 dakika önce
  
  ### Resim örtüleri

Bir resmi arka plan olarak uyarlayın ve metninizi örtün. Resme bağlı olarak, ek stillere veya araçlara ihtiyacınız olabilir.

  
  
    Kart başlığı
    Bu, aşağıda ek destekleyici metin olan daha geniş bir karttır. Bu içerik biraz daha uzundur.
    Son güncelleme 3 dakika önce
  

:::info
**İçeriğin resmin yüksekliğinden daha büyük olmaması gerektiğini unutmayın.** Eğer içerik resimden daha büyükse, içerik resmin dışında görüntülenecektir.
:::

## Yatay

Izgara ve araç sınıflarının bir kombinasyonunu kullanarak, kartlar mobil dostu ve duyarlı bir şekilde yatay hale getirilebilir. Aşağıdaki örnekte, `.g-0` ile ızgara kenar boşluklarını kaldırıyor ve `md` kırılma noktasında kartı yatay yapmak için `.col-md-*` sınıflarını kullanıyoruz. Kart içeriğine bağlı olarak ek ayarlamalar yapılması gerekebilir.

  
    
      
    
    
      
        Kart başlığı
        Bu, aşağıda ek destekleyici metin olan daha geniş bir karttır. Bu içerik biraz daha uzundur.
        Son güncelleme 3 dakika önce
      
    
  

---

## Kart stilleri

Kartlar, arka planlarını, kenarlarını ve renklerini özelleştirmek için çeşitli seçenekler içerir.

### Arka Plan ve Renk

`Bizim `.text-bg-{color}` yardımcılarımızdan` yararlanarak zıt ön plan `color` ile bir `background-color` ayarlayın. Daha önce stil vermek için seçimini manuel olarak eşleştirmeniz gereken `.text-{color}` ve `.bg-{color}` yardımcılarını kullanmaya devam edebilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}

  Başlık
  
    {{ .name | title }} kart başlığı
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
  

{{- end -}}

:::info

:::

### Kenar

Bir kartın yalnızca `border-color`'sini değiştirmek için `kenar yardımcılarını` kullanın. `.text-{color}` sınıflarını ana `.card` üzerine veya kartın içeriklerinden bir alt kümesine yerleştirebilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}

  Başlık
  
    {{ .name | title }} kart başlığı
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
  

{{- end -}}

### Üst kenar

Bir kartın yalnızca `border-top-color`'sini değiştirmek için `kenar yardımcılarını` kullanın. `.text-{color}` sınıflarını ana `.card` üzerine veya kartın içeriklerinden bir alt kümesine yerleştirebilirsiniz.



{{- range (index $.Site.Data "theme-colors") }}

  Başlık
  
    {{ .name | title }} kart başlığı
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
  

{{- end -}}

### Karışım yardımcıları

Gerekli olduğunda kart öğelerinin kenarlarını ayarlayabilir ve hatta `.bg-transparent` ile arka plan rengini hariç tutabilirsiniz.

  Başlık
  
    Başarı kart başlığı
    Kart başlığını geliştirmek ve kartın içeriğinin ana kısmını oluşturmak için bazı hızlı örnek metinler.
  
  Alt kısım

---

## Kart düzeni

Kartlar içindeki içerikleri stillendirmek dışında, Bootstrap, kart serilerini döşemek için birkaç seçenek sunar. Şu anda, **bu yerleşim seçenekleri duyarlı değildir**.

---
title: Kart Grupları
description: Kart grupları, kartları eşit genişlikte ve yükseklikte sütunlar olarak düzenlemek için kullanılır. Bootstrap ile oluşturulan bu yapılar, responsive tasarım için idealdir.
keywords: [kart grupları, Bootstrap, tasarım, responsive, CSS değişkenleri]
---

### Kart Grupları

Kart gruplarını kartları **eşit genişlikte** ve **yükseklikte** sütunlar olarak bir arada gösterme amacıyla kullanın. Kart grupları başlangıçta üst üste dizilir ve `display: flex;` kullanarak `sm` kırılma noktasından itibaren bir araya gelerek eşit boyutlara sahip olurlar.

  
    
    
      Kart başlığı
      Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha geniş bir karttır. Bu içerik biraz daha uzundur.
      Son güncellenme 3 dakika önce
    
  
  
    
    
      Kart başlığı
      Bu kart, ek içerik için doğal bir geçiş olarak altında destekleyici metin içermektedir.
      Son güncellenme 3 dakika önce
    
  
  
    
    
      Kart başlığı

      Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha geniş bir karttır. Bu kart, eşit yükseklikte hareket sağlamak için ilk karttan daha fazla içeriğe sahiptir.      
      Son güncellenme 3 dakika önce
    
  

:::info
Altbilgili kart gruplarını kullanırken, içerikler otomatik olarak hizalanacaktır.
:::

  
    
    
      Kart başlığı
      Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha geniş bir karttır. Bu içerik biraz daha uzundur.
    
    
      Son güncellenme 3 dakika önce
    
  
  
    
    
      Kart başlığı
      Bu kart, ek içerik için doğal bir geçiş olarak altında destekleyici metin içermektedir.
    
    
      Son güncellenme 3 dakika önce
    
  
  
    
    
      Kart başlığı
      Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha geniş bir karttır. Bu kart, eşit yükseklikte hareket sağlamak için ilk karttan daha fazla içeriğe sahiptir.
    
    
      Son güncellenme 3 dakika önce
    
  

### Izgara Kartları

Bootstrap ızgara sistemini ve `.row-cols` sınıflarını` kullanarak her satırda kaç ızgara sütunu (kartlarınız etrafında sarılmış) gösterileceğini kontrol edin. Örneğin, burada `.row-cols-1` kartları bir sütunda sergilerken, `.row-cols-md-2` dört kartı birden fazla satıra eşit genişlikte yaymaktadır, orta kırılma noktası ve yukarısından itibaren.

  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  
  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  
  
    
      
      
        Kart başlığı
        Bu kart, ek içerik için doğal bir geçiş olarak altında destekleyici metin içermektedir.
      
    
  
  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  

Bunu `.row-cols-3` olarak değiştirirseniz, dördüncü kartın sarıldığını göreceksiniz.

  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  
  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  
  
    
      
      
        Kart başlığı
        Bu kart, ek içerik için doğal bir geçiş olarak altında destekleyici metin içermektedir.
      
    
  
  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  

Eşit yükseklik gerektiğinde, kartlara `.h-100` ekleyin. Eğer varsayılan olarak eşit yükseklik istiyorsanız, Sass'da `$card-height: 100%` ayarını yapabilirsiniz.

  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  
  
    
      
      
        Kart başlığı
        Bu kısa bir karttır.
      
    
  
  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır.
      
    
  
  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha uzun bir karttır. Bu içerik biraz daha uzundur.
      
    
  

:::tip
Kart gruplarında olduğu gibi, kart altbilgileri otomatik olarak hizalanır.
:::

  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha geniş bir karttır. Bu içerik biraz daha uzundur.
      
      
        Son güncellenme 3 dakika önce
      
    
  
  
    
      
      
        Kart başlığı
        Bu kart, ek içerik için doğal bir geçiş olarak altında destekleyici metin içermektedir.
      
      
        Son güncellenme 3 dakika önce
      
    
  
  
    
      
      
        Kart başlığı
        Bu, ek içerik için doğal bir geçiş olarak altında destekleyici metin içeren daha geniş bir karttır. Bu kart, eşit yükseklikte hareket sağlamak için ilk karttan daha fazla içeriğe sahiptir.
      
      
        Son güncellenme 3 dakika önce
      
    
  

## Özelleştirme

### CSS Değişkenleri

Kartlar, gerçek zamanlı özelleştirme için `.card` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlandığından, Sass özelleştirmesi de desteklenmektedir.

### SASS Değişkenleri

