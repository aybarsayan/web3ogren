---
description: Bootstrap Modalları, diyalogları eklemek için hafif, çok amaçlı bir JavaScript açılır pencere sunar. Bootstrap Modallarını kolayca nasıl özelleştireceğinizi öğrenin. Birden fazla örnek ve eğitim.
keywords: [Bootstrap, modal, JavaScript, açılır pencere, diyalog, kullanıcı arayüzü, UI]
---

## Nasıl çalışır

Bootstrap modalları hafif ve çok amaçlı açılır pencerelerdir. Modallar üç ana bölüme ayrılmıştır: başlık, gövde ve alt bilgi. Her birinin bir rolü vardır ve buna göre kullanılmalıdır. CoreUI için Bootstrap'ın modal bileşeniyle başlamadan önce, menü seçeneklerimizin yeni değiştiğini okumayı unutmayın.

- Modallar HTML, CSS ve JavaScript ile oluşturulmuştur. Belgedeki her şeyin üzerinde konumlandırılırlar ve modal içeriğinin kaydırılabilmesi için `` kısmındaki kaydırmayı kaldırırlar.
- Modal "arka planına" tıklamak, modalı otomatik olarak kapatır.
- Bootstrap aynı anda sadece bir modal penceresini destekler. **İç içe geçen modallar desteklenmez**, çünkü kullanıcı deneyimini olumsuz etkilediğine inanıyoruz.
- Modallar `position: fixed` kullanır, bu bazen render konusunda biraz hassas olabilir. Mümkün olduğunca, modal HTML'nizi üst seviyede bir konumda yerleştirin, böylece diğer öğelerin olası müdahalelerinden kaçınmış olursunuz. `.modal`'ı başka bir sabit öğe içinde iç içe yerleştirirken sorunlarla karşılaşacaksınız.
- Yine, `position: fixed` nedeniyle mobil cihazlarda modallar kullanırken bazı kısıtlamalar vardır. Detaylar için `tarayıcı destek belgelerimize bakın`.
- HTML5'in anlamsallığını nasıl tanımladığı nedeniyle, [ `autofocus` HTML niteliği](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autofocus) Bootstrap modallarında herhangi bir etki göstermez. Aynı etkiyi elde etmek için bazı özel JavaScript kullanın:

```js
const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.coreui.modal', () => {
  myInput.focus()
})
```

:::info
% Bu, modal açıldığında otomatik odaklama sağlamak için bir yöntemdir.
:::

Demos ve kullanım kılavuzları için okumaya devam edin.

---

## Örnekler

### Modal bileşenleri

Aşağıda _statik_ bir modal örneği bulunmaktadır (bu, `position` ve `display` değerlerinin geçersiz kılındığı anlamına gelir). Modal başlığı, modal gövdesi ( `padding` için gereklidir) ve modal alt bilgisi (isteğe bağlı) dahildir. Modal başlıklarını her zaman kapatma eylemleriyle birlikte eklemenizi veya alternatif bir açıkça belirtilmiş kapatma eylemi sunmanızı rica ediyoruz.


  
    
      
        
          Modal başlığı
          
        
        
          Modal gövde metni buraya gelir.
        
        
          Kapat
          Değişiklikleri kaydet
        
      
    
  


```html
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal başlığı</h5>
        <button type="button" class="btn-close" data-coreui-dismiss="modal" aria-label="Kapat"></button>
      </div>
      <div class="modal-body">
        <p>Modal gövde metni buraya gelir.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-coreui-dismiss="modal">Kapat</button>
        <button type="button" class="btn btn-primary">Değişiklikleri kaydet</button>
      </div>
    </div>
  </div>
</div>
```

### Canlı demo

Aşağıdaki butona tıklayarak çalışan bir modal demo'sunu açabilirsiniz. Sayfanın tepe noktasından aşağıya kayarak ve solma geçişi ile açılacaktır.


  
    
      
        Modal başlığı
        
      
      
        Woo-hoo, bu metni bir modaldan okuyorsunuz!
      
      
        Kapat
        Değişiklikleri kaydet
      
    
  



  
    Demo modalı başlat
  


```html
<!-- Modalı tetikleyen buton -->
<button type="button" class="btn btn-primary" data-coreui-toggle="modal" data-coreui-target="#exampleModal">
  Demo modalı başlat
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal başlığı</h5>
        <button type="button" class="btn-close" data-coreui-dismiss="modal" aria-label="Kapat"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-coreui-dismiss="modal">Kapat</button>
        <button type="button" class="btn btn-primary">Değişiklikleri kaydet</button>
      </div>
    </div>
  </div>
</div>
```

### Statik arka plan

Arka plan statik ayarlandığında, modal dışına tıklanarak kapanmayacaktır. Aşağıdaki butona tıklayarak deneyin.


  
    
      
        Modal başlığı
        
      
      
        Dışarıya tıklarsanız kapanmayacaktır. Kaçınmaya bile çalışmayın.
      
      
        Kapat
        Anlaşıldı
      
    
  



  
    Statik arka plan modalı başlat
  


```html
<!-- Modalı tetikleyen buton -->
<button type="button" class="btn btn-primary" data-coreui-toggle="modal" data-coreui-target="#staticBackdrop">
  Statik arka plan modalı başlat
</button>

<!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-coreui-backdrop="static" data-coreui-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Modal başlığı</h5>
        <button type="button" class="btn-close" data-coreui-dismiss="modal" aria-label="Kapat"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-coreui-dismiss="modal">Kapat</button>
        <button type="button" class="btn btn-primary">Anlaşıldı</button>
      </div>
    </div>
  </div>
</div>
```

### Uzun içerikte kaydırma

Modallar, kullanıcının görünüm penceresi veya cihazı için çok uzun hale geldiğinde, sayfanın kendisinden bağımsız olarak kaydırılır. Aşağıdaki demoyu deneyerek ne demek istediğimizi görün.


  
    
      
        Modal başlığı
        
      
      
        Bu, modallar için kaydırma davranışını göstermek için bazı yer tutucu içeriklardır. Modalın metnini tekrarlamak yerine, minimum yükseklik ayarlamak için bir satır içi stil kullanıyoruz ve böylece genel modalın uzunluğunu artırarak taşma kaydırmayı gösteriyoruz. İçerik, görünüm penceresinin yüksekliğinden daha uzun hale geldiğinde, kaydırma gerektiği gibi modalı hareket ettirecektir.
      
      
        Kapat
        Değişiklikleri kaydet
      
    
  



  
    Demo modalı başlat
  


Ayrıca, modal gövdesinin kaydırılmasına izin veren bir kaydırılabilir modal oluşturmak için `.modal-dialog-scrollable` sınıfını `.modal-dialog` içine ekleyebilirsiniz.


  
    
      
        Modal başlığı
        
      
      
        Bu, modallar için kaydırma davranışını göstermek için bazı yer tutucu içeriklardır. İçeriğin minimum iç yüksekliğini aşmasını göstermek için tekrarlayan satır sonlarını kullanıyoruz, böylece içerik kaydırılabilir hale geliyor. İçerik, modalın önceden tanımlanmış maksimum yüksekliğinden daha uzun hale geldiğinde, içerik kesilecektir ve modal içinde kaydırılabilir olacaktır.
        
        Bu içerik aşağıda kaydırma yaptıktan sonra görünmelidir.
      
      
        Kapat
        Değişiklikleri kaydet
      
    
  



  
    Demo modalı başlat
  


```html
<!-- Kaydırılabilir modal -->
<div class="modal-dialog modal-dialog-scrollable">
  ...
</div>
```

### Dikey olarak ortalanmış

Modali dikey olarak ortalamak için `.modal-dialog-center` sınıfını `.modal-dialog` sınıfına ekleyin.


  
    
      
        Modal başlığı
        
      
      
        Bu, dikey olarak ortalanmış bir modaldır.
      
      
        Kapat
        Değişiklikleri kaydet
      
    
  



  
    
      
        Modal başlığı
        
      
      
        Bu, dikey olarak ortalanmış bir modal için yer tutucu içeriktir. Dikey olarak ortalama modal, kaydırılabilir modallar ile birleştirildiğinde nasıl çalıştığını göstermek için buraya ekstra metin ekledik. İçerik yüksekliğini hızla artırmak için tekrarlayan satır sonlarını kullanıyoruz, böylece kaydırma tetikleniyor. İçerik, modalın önceden tanımlanmış maksimum yüksekliğinden daha uzun hale geldiğinde, içerik kesilecektir ve modal içinde kaydırılabilir olacaktır.
        
        İşte böyle.
      
      
        Kapat
        Değişiklikleri kaydet
      
    
  



  
    Dikey olarak ortalanmış modal
  
  
    Dikey olarak ortalanmış kaydırılabilir modal
  


```html
<!-- Dikey olarak ortalanmış modal -->
<div class="modal-dialog modal-dialog-centered">
  ...
</div>

<!-- Dikey olarak ortalanmış kaydırılabilir modal -->
<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
  ...
</div>
```

### Araç ipuçları ve popover'lar

` Araç ipuçları` ve `popover'lar` ihtiyaç duyulduğunda modallara yerleştirilebilir. Modallar kapandıktan sonra içlerinde bulunan herhangi bir araç ipucu ve popover da otomatik olarak kapanır.


  
    
      
        Modal başlığı
        
      
      
        Modal içinde popover
        Bu buton tıklamayla bir popover açar.
        
        Modal içinde araç ipuçları
        Bu bağlantı ve şu bağlantı fare üzerinde araç ipuçlarına sahiptir.
      
      
        Kapat
        Değişiklikleri kaydet
      
    
  



  
    Demo modalı başlat
  


```html
<div class="modal-body">
  <h5>Modal içinde popover</h5>
  <p>Bu <button class="btn btn-secondary" data-coreui-toggle="popover" title="Popover başlığı" data-coreui-content="Popover gövde içeriği bu nitelikte ayarlanır.">buton</button> tıklamayla bir popover açar.</p>
  <hr>
  <h5>Modal içinde araç ipuçları</h5>
  <p><a href="#" data-coreui-toggle="tooltip" title="Araç ipucu">Bu bağlantı</a> ve <a href="#" data-coreui-toggle="tooltip" title="Araç ipucu">şu bağlantı</a> fare üzerinde araç ipuçlarına sahiptir.</p>
</div>
```

### Izgara kullanma

Bir modaldan içinde Bootstrap ızgara sistemini kullanmak için, `.modal-body` içinde `.container-fluid`'ı iç içe yerleştirin. Ardından, normal ızgara sistemi sınıflarını, başka herhangi bir yerde olduğu gibi kullanın.


  
    
      
        Modallarda ızgara
        
      
      
        
          
            .col-md-4
            .col-md-4 .ms-auto
          
          
            .col-md-3 .ms-auto
            .col-md-2 .ms-auto
          
          
            .col-md-6 .ms-auto
          
          
            
              Seviye 1: .col-sm-9
              
                
                  Seviye 2: .col-8 .col-sm-6
                
                
                  Seviye 2: .col-4 .col-sm-6
                
              
            
          
        
      
      
        Kapat
        Değişiklikleri kaydet
      
    
  




  Demo modalı başlat



```html
<div class="modal-body">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4">.col-md-4</div>
      <div class="col-md-4 ms-auto">.col-md-4 .ms-auto</div>
    </div>
    <div class="row">
      <div class="col-md-3 ms-auto">.col-md-3 .ms-auto</div>
      <div class="col-md-2 ms-auto">.col-md-2 .ms-auto</div>
    </div>
    <div class="row">
      <div class="col-md-6 ms-auto">.col-md-6 .ms-auto</div>
    </div>
    <div class="row">
      <div class="col-sm-9">
        Seviye 1: .col-sm-9
        <div class="row">
          <div class="col-8 col-sm-6">
            Seviye 2: .col-8 .col-sm-6
          </div>
          <div class="col-4 col-sm-6">
            Seviye 2: .col-4 .col-sm-6
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---
description: Bu belge, farklı modal içeriklerinin nasıl oluşturulacağı ve çeşitli modal geçişleri, animasyonlar ve boyutlar hakkında bilgiler içermektedir.
keywords: [modal, GUI, JavaScript, Bootstrap, erişilebilirlik]
---

### Farklı modal içeriği

Hepsi aynı modalı tetikleyen ancak biraz farklı içeriklere sahip bir sürü düğmeniz mi var? Hangi düğmeye tıklanıldığına göre modalın içeriğini değiştirmek için `event.relatedTarget` ve [HTML `data-coreui-*` nitelikleri](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) kullanın.

Aşağıda canlı bir demo ve örnek HTML ve JavaScript bulunmaktadır. Daha fazla bilgi için, `relatedTarget` ile ilgili ayrıntılar için `modal olayları belgelerini okuyun`.


@mdo için modalı aç

@fat için modalı aç@getbootstrap için modalı aç


  
    
      
        Yeni mesaj
        
      
      
        
          
            Alıcı:
            
          
          
            Mesaj:
            
          
        
      
      
        Kapat
        Mesajı gönderecek
      
    
  

### Modallar arasında geçiş yapma

`data-coreui-target` ve `data-coreui-toggle` niteliklerinin akıllı yerleştirilmesi ile birden fazla modal arasında geçiş yapın. Örneğin, zaten açık olan bir giriş modalından bir şifre sıfırlama modalını açabilirsiniz. **Lütfen aynı anda birden fazla modalın açılamayacağını unutmayın** - bu yöntem sadece iki ayrı modal arasında geçiş yapar.

:::tip
Modal geçişlerinde kullanıcı deneyimini artırmak için animasyonları dikkate alın.
:::

  
    
      
        Modal 1
        
      
      
        Aşağıdaki düğmeyle ikinci bir modal göster ve bu modalı gizle.
      
      
        İkinci modali aç
      
    
  


  
    
      
        Modal 2
        
      
      
        Aşağıdaki düğmeyle bu modalı gizle ve ilk modali göster.
      
      
        İlk moda geri dön
      
    
  

İlk modalı aç
### Animasyonu değiştirme

`$modal-fade-transform` değişkeni, modal fade-in animasyonundan önce `.modal-dialog`'in dönüşüm durumunu belirler. `$modal-show-transform` değişkeni ise modal fade-in animasyonunun sonunda `.modal-dialog`'in dönüşümünü belirler.

Örneğin, yakınlaştırma animasyonu istiyorsanız, `$modal-fade-transform: scale(.8)` olarak ayarlayabilirsiniz.

### Animasyonu kaldırma

Basitçe görünecek ancak görünümde yavaş yavaş kaybolmak istemeyen modallar için, modal işaretlemenizdeki `.fade` sınıfını kaldırın.

```html
<div class="modal" tabindex="-1" aria-labelledby="..." aria-hidden="true">
  ...
</div>
```

### Dinamik yükseklikler

Bir modal açıkken yüksekliği değişirse, bir kaydırma çubuğu görünürse modalın konumunu yeniden ayarlamak için `myModal.handleUpdate()` çağrısını yapmalısınız.

:::info
Dinamik yüksekliklerde kullanıcı deneyimini geliştirerek konumlandırmayı doğru yapın.
:::

### Erişilebilirlik

`.modal`'e modal başlığını referans gösteren `aria-labelledby="..."` eklemeyi unutmayın. Ayrıca, `.modal` üzerinde modal diyalogunuzun tanımını `aria-describedby` ile verebilirsiniz. `role="dialog"` eklemenize gerek yoktur çünkü bunu zaten JavaScript aracılığıyla ekliyoruz.

### YouTube videolarını gömme

YouTube videolarını modallar içinde gömmek, otomatik olarak oynatmaya son vermek ve daha fazlası için Bootstrap dışında ek JavaScript gerektirir. Daha fazla bilgi için şu yardımcı [Stack Overflow gönderisine](https://stackoverflow.com/questions/18622508/bootstrap-3-and-youtube-in-modal) bakın.

## İsteğe bağlı boyutlar

Modallar, bir `.modal-dialog` üzerinde yerleştirilecek değiştirici sınıflar aracılığıyla üç isteğe bağlı boyuta sahiptir. Bu boyutlar, daha dar görüntü alanlarında yatay kaydırma çubuklarını önlemek için belirli kırılma noktalarında devreye girer.


| Boyut | Sınıf | Modal maksimum genişliği
| --- | --- | --- |
| Küçük | `.modal-sm` | `300px` |
| Varsayılan | Yok | `500px` |
| Büyük | `.modal-lg` | `800px` |
| Ekstra büyük | `.modal-xl` | `1140px` |
Varsayılan modalımız değiştirici sınıf olmadan "orta" boyutunda bir modal oluşturur.


  Ekstra büyük modal
  Büyük modal
  Küçük modal


```html
<div class="modal-dialog modal-xl">...</div>
<div class="modal-dialog modal-lg">...</div>
<div class="modal-dialog modal-sm">...</div>
```


  
    
      
        Ekstra büyük modal
        
      
      
        ...
      
    
  



  
    
      
        Büyük modal
        
      
      
        ...
      
    
  



  
    
      
        Küçük modal
        
      
      
        ...
      
    
  


## Tam ekran Modal

Bir başka geçersiz kılma, kullanıcı görüntü alanını tamamen kaplayan bir modal açma seçeneğidir ki bu da bir `.modal-dialog` üzerinde yerleştirilen değiştirici sınıflar aracılığıyla yapılır.


| Sınıf | Mevcudiyet |
| --- | --- |
| `.modal-fullscreen` | Her zaman |
| `.modal-fullscreen-sm-down` | `576px` |
| `.modal-fullscreen-md-down` | `768px` |
| `.modal-fullscreen-lg-down` | `992px` |
| `.modal-fullscreen-xl-down` | `1200px` |
| `.modal-fullscreen-xxl-down` | `1400px` |

  Tam ekran
  sm altında tam ekran
  md altında tam ekran
  lg altında tam ekran
  xl altında tam ekran
  xxl altında tam ekran


```html
<!-- Tam ekran modal -->
<div class="modal-dialog modal-fullscreen-sm-down">
  ...
</div>
```


  
    
      
        Tam ekran modal
        
      
      
        ...
      
      
        Kapat
      
    
  



  
    
      
        sm altında tam ekran
        
      
      
        ...
      
      
        Kapat
      
    
  



  
    
      
        md altında tam ekran
        
      
      
        ...
      
      
        Kapat
      
    
  



  
    
      
        lg altında tam ekran
        
      
      
        ...
      
      
        Kapat
      
    
  



  
    
      
        xl altında tam ekran
        
      
      
        ...
      
      
        Kapat
      
    
  



  
    
      
        xxl altında tam ekran
        
      
      
        ...
      
      
        Kapat
      
    
  


## Kullanım

Modal eklentisi, gizli içeriğinizi talep üzerine veri nitelikleri veya JavaScript aracılığıyla açar. Ayrıca, varsayılan kaydırma davranışını devre dışı bırakır ve gösterilen modalları kapatmak için tıklama alanı sağlamak için bir `.modal-backdrop` oluşturur.

### Veri nitelikleri aracılığıyla

#### Toggle

JavaScript yazmadan bir modali etkinleştirin. Bir kontrol öğesi olan düğmeye `data-coreui-toggle="modal"` ayarlayın, bunun yanı sıra belirli bir modalı açmak için `data-coreui-target="#foo"` veya `href="#foo"` ile hedef belirleyin.

```html
<button type="button" data-coreui-toggle="modal" data-coreui-target="#myModal">Modalı başlat</button>
```

#### Kapat

{{% js-dismiss "modal" %}}


Modalın her iki şekilde kapatılabileceği desteklense de, bir modal dışında kapatmanın [ARIA Yazar Uygulamaları Kılavuzu diyalog (modal) desenine](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/) uymadığını aklınızda bulundurun. Bunu kendi riskinizle yapın.
### JavaScript aracılığıyla

Tek bir JavaScript satırı ile bir modal oluşturun:

```js
const myModal = new coreui.Modal(document.getElementById('myModal'), options)
// veya
const myModalAlternative = new coreui.Modal('#myModal', options)
```

### Seçenekler




| Ad | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `backdrop` | boolean, `'static'` | `true` | Bir modal-arka plan öğesi içerir. Alternatif olarak, tıklandığında modali kapatmayan bir arka plan için `static` olarak belirtin. |
| `focus` | boolean | `true` | Başlatıldığında modala odaklanır. |
| `keyboard` | boolean | `true` | Escape tuşuna basıldığında modali kapatır. |
### Yöntemler



#### Seçenekleri geçme

İçeriğinizi bir modal olarak etkinleştirir. İsteğe bağlı bir seçenek `objesini` kabul eder.

```js
const myModal = new coreui.Modal('#myModal', {
  keyboard: false
})
```


| Yöntem | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin modalını yok eder. (DOM öğesindeki saklanan verileri kaldırır) |
| `getInstance` | DOM öğesi ile ilişkilendirilmiş modal örneğini almanıza olanak tanıyan *Statik* yöntem. |
| `getOrCreateInstance` | DOM öğesi ile ilişkilendirilmiş modal örneğini almanıza veya başlatılmamışsa yeni bir tane oluşturmanıza olanak tanıyan *Statik* yöntem. |
| `handleUpdate` | Açıkken bir modalın yüksekliği değiştiğinde modalın pozisyonunu manuel olarak yeniden ayarlar (örneğin, bir kaydırma çubuğu görünürse). |
| `hide` | Bir modali manuel olarak gizler. **Modal gerçekten gizlenmeden önce çağrıcıya geri döner** (yani `hidden.coreui.modal` olayı gerçekleşmeden önce). |
| `show` | Bir modali manuel olarak açar. **Modal gerçekten gösterilmeden önce çağrıcıya geri döner** (yani `shown.coreui.modal` olayı gerçekleşmeden önce). Ayrıca, modal olaylarında alınabilecek bir DOM öğesini argüman olarak geçebilirsiniz (örneğin `const modalToggle = document.getElementById('toggleMyModal'); myModal.show(modalToggle)` |
| `toggle` | Bir modali manuel olarak açar veya kapatır. **Modal gerçekten açılmadan veya gizlenmeden önce çağrıcıya geri döner** (yani `shown.coreui.modal` veya `hidden.coreui.modal` olayı gerçekleşmeden önce). |
### Olaylar

CoreUI'nin Bootstrap modal sınıfı, modal işlevselliğine müdahale etmek için bir dizi olay sunar. Tüm modal olayları modalın kendisinde tetiklenir (yani `` üzerinde).


| Olay | Açıklama |
| --- | --- |
| `hide.coreui.modal` | `hide` örnek metodunun çağrıldığında hemen bu olay tetiklenir. |
| `hidden.coreui.modal` | Modalın kullanıcıdan gizlenmesi tamamlandığında bu olay tetiklenir (CSS geçişlerinin tamamlanmasını bekleyecek). |
| `hidePrevented.coreui.modal` | Modal gösterildiğinde, arka planı `statik` olduğunda ve modal dışına tıklanması yapıldığında tetiklenen olay. Ayrıca, `keyboard` seçeneği `false` olarak ayarlandığında escape tuşuna basıldığında bu olay tetiklenir. |
| `show.coreui.modal` | `show` örnek metodu çağrıldığında hemen bu olay tetiklenir. Tıklandığında, tıklanan öğe olayın `relatedTarget` niteliği olarak mevcut olacaktır. |
| `shown.coreui.modal` | Modal kullanıcılara görünür hale geldiğinde bu olay tetiklenir (CSS geçişlerinin tamamlanmasını bekleyecek). Tıklandığında, tıklanan öğe olayın `relatedTarget` niteliği olarak mevcut olacaktır. |
```js
const myModalEl = document.getElementById('myModal')
myModalEl.addEventListener('hidden.coreui.modal', event => {
  // bir şey yap...
})
```

## Özelleştirme

### CSS değişkenleri

Modallar, gerçek zamanlı özelleştirme için `.modal` ve `.modal-backdrop` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenlerinin değerleri Sass aracılığıyla ayarlanır, bu yüzden Sass özelleştirmesi hala desteklenir.

### SASS değişkenleri

### SASS Döngüsü

`Responsive tam ekran modallar`, `$breakpoints` haritası ve `scss/_modal.scss` içindeki bir döngü aracılığıyla oluşturulur.

