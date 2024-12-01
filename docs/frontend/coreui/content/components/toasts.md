---
description: Ziyaretçilerinize bir tost ile push bildirimleri gönderin, hafif ve kolayca özelleştirilebilir bir uyarı mesajı.
keywords: [toast, bildirim, push, özelleştirilebilir, Bootstrap, kullanıcı deneyimi, erişilebilirlik]
layout: docs
title: Toastlar
group: components
toc: true
bootstrap: true
other_frameworks: toast
---

Toastlar, mobil ve masaüstü işletim sistemleri tarafından popüler hale getirilen push bildirimlerini taklit etmek için tasarlanmış hafif bildirimlerdir. **Flexbox ile inşa edilmiştir**, bu nedenle hizalamak ve konumlandırmak kolaydır.

## Genel Bakış

Toast eklentisini kullanırken bilinmesi gerekenler:

- **Toastlar**, performans nedenleriyle isteğe bağlıdır, bu nedenle **kendiniz başlatmalısınız**.
- `autohide: false` belirtmezseniz toastlar otomatik olarak gizlenecektir.

:::info
Toastların ekran okuyucular ve diğer yardımcı teknolojilerle uyumlu olması için `aria-live` bölgesi içinde yer alması gerektiğini unutmayın.
:::

## Örnekler

### Temel

Uzun ömürlü ve öngörülebilir toastlar teşvik etmek için bir başlık ve gövde öneriyoruz. Toast başlıkları, içeriklerin kolayca hizalanmasını sağlamak için `display: flex` kullanır.

Toastlar ihtiyaç duyduğunuz kadar esnektir ve çok az gerekli işaretleme gerektirir. En azından, "toasted" içeriğinizi içerecek bir element gereklidir ve bir kapatma butonu olmasını kuvvetle öneriyoruz.

:::note
Toast içeriğinizi belirlemeden önce `autohide` seçeneğini kontrol ettiğinizden emin olun.
:::

  
    
    Bootstrap
    11 dakikada
    
  
  
    Merhaba dünya! Bu bir toast mesajıdır.
  

:::warning
Daha önce, scriptlerimiz bir toast'ı tamamen gizlemek için dinamik olarak `.hide` sınıfını ekliyordu (sadece `opacity:0` ile değil, `display:none` ile). Artık bu gereksiz. Ancak, geriye dönük uyumluluk için scriptimiz bu sınıfı döndürmeye devam edecek (pratik bir gereklilik olmamasına rağmen) bir sonraki büyük sürüme kadar.
:::

### Canlı örnek

Aşağıdaki butona tıklayarak varsayılan olarak gizlenmiş bir toast gösterin (aşağı sağ köşede konumlandırılmış).


  
    
      
      Bootstrap
      11 dakikada
      
    
    
      Merhaba dünya! Bu bir toast mesajıdır.
    
  



  Canlı toast göster


```html
<button type="button" class="btn btn-primary" id="liveToastBtn">Canlı toast göster</button>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <img src="..." class="rounded me-2" alt="...">
      <strong class="me-auto">Bootstrap</strong>
      <small>11 dakikada</small>
      <button type="button" class="btn-close" data-coreui-dismiss="toast" aria-label="Kapat"></button>
    </div>
    <div class="toast-body">
      Merhaba dünya! Bu bir toast mesajıdır.
    </div>
  </div>
</div>
```

Canlı toast demo'muzu tetiklemek için şu JavaScript'i kullanıyoruz:

### Yarı saydam

Toastlar, altındaki unsurlarla karışmak için hafif yarı saydamdır.

  
    
    Bootstrap
    11 dakikada
    
  
  
    Merhaba dünya! Bu bir toast mesajıdır.
  

### Yığma

Toastları, onları dikey olarak eklemek için bir toast konteyneri içine sararak yığabilirsiniz.

  
    
      
      Bootstrap
      şimdi
      
    
    
      Bak! İşte böyle.
    
  

  
    
      
      Bootstrap
      2 saniye önce
      
    
    
      Dikkat! Toastlar otomatik olarak yığılacak
    
  

### Özelleştirilmiş içerik

Tostlarınızı, alt bileşenleri çıkararak, `utiliteler` ile uyarlayarak veya kendi işaretlemenizi ekleyerek özelleştirebilirsiniz. Burada, varsayılan `.toast-header` dahi çıkardık, `Bootstrap Icons` ile özel bir kapatma simgesi ekledik ve düzeni ayarlamak için bazı `flexbox utiliteleri` kullandık.

  
    
    Merhaba dünya! Bu bir toast mesajıdır.
   
    
  

Alternatif olarak, toastlara ek kontrol ve bileşenler de ekleyebilirsiniz.

  
    Merhaba dünya! Bu bir toast mesajıdır.
    
      Eylem al
      Kapat
    
  

### Renk şemaları

Yukarıdaki örneği temel alarak, farklı toast renk şemaları oluşturabilirsiniz, `renk` ve `arka plan` utilitelerini kullanarak. Burada, `.toast`'a `.text-bg-primary` ekledik ve kapatma butonumuza `.btn-close-white` ekledik. Keskin bir kenar elde etmek için varsayılan kenarlığı `.border-0` ile kaldırdık.

  
    
      Merhaba dünya! Bu bir toast mesajıdır.
    
    
  

## Yerleşim

Toastları istediğiniz gibi özel CSS ile yerleştirin. Genellikle bildirimler için sağ üst köşe kullanılır, üst orta da öyle. Eğer her zaman yalnızca bir toast gösterecekseniz, konumlandırma stillerini doğrudan `.toast` üzerine koyun.

  
    Toast yerleşimi
    
      Bir pozisyon seçin...
      Sol üst
      Üst ortada
      Sağ üst
      Orta solda
      Orta merkezde
      Orta sağda
      Sol altta
      Alt ortada
      Sağ altta
    
  


  
    
      
        
        Bootstrap
        11 dakikada
      
      
        Merhaba dünya! Bu bir toast mesajıdır.
      
    
  

Daha fazla bildirim üreten sistemler için, onları kolayca yığabilmeleri için bir sarıcı öğe kullanmayı düşünün.

  
  
  
  
  

    
    
      
        
        Bootstrap
        şimdi
        
      
      
        Bak! İşte böyle.
      
    

    
      
        
        Bootstrap
        2 saniye önce
        
      
      
        Dikkat! Toastlar otomatik olarak yığılacak
      
    
  

Toastları yatay ve/veya dikey hizalamak için flexbox utilidadelerini kullanarak da biraz şatafatlı olabilirsiniz.



  
  
    
      
      Bootstrap
      11 dakikada
      
    
    
      Merhaba dünya! Bu bir toast mesajıdır.
    
  

## Erişilebilirlik

Toastlar, ziyaretçilerinize veya kullanıcılarınıza küçük kesintiler olarak tasarlanmıştır, bu nedenle ekran okuyucular ve benzeri yardımcı teknolojilerle olan kullanıcıların yardımcı olması için, toastlarınızı bir [`aria-live` bölgesi](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) içerisine sarınız. **Canlı bölgelerdeki değişiklikler** (bir toast bileşeni ekleme/güncelleme gibi) ekran okuyucular tarafından, kullanıcının odaklanmasını veya başka türlü kesilmesini gerektirmeden otomatik olarak duyurulur. Ayrıca, tüm toast'ın her zaman tek bir (atomik) birim olarak duyurulmasını sağlamak için `aria-atomic="true"` ekleyin, yalnızca neyin değiştiğini duyurmak yerine (bu, yalnızca toast içeriğinin bir kısmını güncelliyorsanız veya aynı toast içeriğini daha sonra gösteriyorsanız sorunlara yol açabilir). Gerekli bilgiler işlem için önemliyse, örneğin bir formda hata listesiyse, `uyarı bileşenini` kullanın, toast yerine.

Canlı bölgenin, toast oluşturulmadan veya güncellenmeden önce işaretlemede mevcut olması gerektiğini unutmayın. İkisini aynı anda dinamik olarak oluşturursanız ve sayfaya enjekte ederseniz, genellikle yardımcı teknolojiler tarafından duyurulmazlar.

Ayrıca içeriğe bağlı olarak `role` ve `aria-live` seviyesini uyarlamanız gerekir. **Önemli bir mesaj** ise (örneğin bir hata), `role="alert" aria-live="assertive"` kullanın, aksi takdirde `role="status" aria-live="polite"` özniteliklerini kullanın.

Gösterdiğiniz içerik değiştikçe, kullanıcıların toast'ı okumak için yeterli zaman toplayabilmesi için, `delay` zaman aşımını` güncellemeniz gerekmektedir.

```html
<div class="toast" role="alert" aria-live="polite" aria-atomic="true" data-coreui-delay="10000">
  <div role="alert" aria-live="assertive" aria-atomic="true">...</div>
</div>
```

`autohide: false` kullanırken, kullanıcıların toastı kapatabilmesi için bir kapatma butonu eklemelisiniz.

  
    
    Bootstrap
    11 dakikada
    
  
  
    Merhaba dünya! Bu bir toast mesajıdır.
  

Teknik olarak, toastınıza odaklanabilir/işlem yapabilir kontroller (ek butonlar veya bağlantılar gibi) eklemek mümkün olsa da, bu otomatik kapanan toastlar için yapılmaktan kaçınılmalıdır. Uzun bir `delay` zaman aşımı` tanırsanız bile, klavye ve yardımcı teknoloji kullanıcıları, toast etkinleştirildiğinde zamanında eylem almak için toast'a ulaşmada zorluk çekebilirler (çünkü toastlar gösterilirken odak almaz). Eğer kesinlikle daha fazla kontrol eklemek zorundaysanız, `autohide: false` olan bir toast kullanmanızı öneririz.

## Kullanım

Toast'ları JavaScript ile başlatın:

```js
const toastElList = document.querySelectorAll('.toast')
const toastList = [...toastElList].map(toastEl => new coreui.Toast(toastEl, option))
```

### Tetikleyiciler

{{% js-dismiss "toast" %}}

### Seçenekler




| Ad | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `animation` | boolean | `true` | Toast'a bir CSS fade geçişi uygulayın |
| `autohide` | boolean | `true`  | Toast'u otomatik olarak gizle |
| `delay` | number | `5000` | Toast'un gizlenme gecikmesi (ms) |
### Metotlar

:::danger
**Dikkat:** Async metotlar uygulamalarınızda beklenmedik sonuçlara yol açabilir, bu nedenle bu metotları dikkatli kullanın.
:::


| Metot | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin toast'unu gizler. Toast'unuz DOM'da kalır ancak artık gösterilmez. |
| `getInstance` | Bir DOM öğesi ile ilişkili toast örneğini almanızı sağlayan *Statik* metot  Örneğin: `const myToastEl = document.getElementById('myToastEl')` `const myToast = coreui.Toast.getInstance(myToastEl)` Bir Bootstrap toast örneği döner |
| `getOrCreateInstance` | Bir DOM öğesi ile ilişkili toast örneğini almanızı veya başlatılmamışsa yeni bir tane oluşturmanızı sağlayan *Statik* metot  `const myToastEl = document.getElementById('myToastEl')`  `const myToast = coreui.Toast.getOrCreateInstance(myToastEl)` Bir Bootstrap toast örneği döner |
| `hide` | Bir öğenin toast'unu gizler. **Toast gerçekten gizlenmeden önce çağırana döner** (yani `hidden.coreui.toast` olayı gerçekleşmeden önce). `autohide`'ı `false` yaptıysanız bu metodu manuel olarak çağırmanız gerekir. |
| `isShown` | Toast'un görünürlük durumuna bağlı olarak bir boolean döner. |
| `show` | Bir öğenin toast'unu görüntüler. **Toast gerçekten gösterilmeden önce çağırana döner** (yani `shown.coreui.toast` olayı gerçekleşmeden önce). Bu metodu manuel olarak çağırmanız gerekir, aksi takdirde toast'unuz görünmeyecektir. |
### Olaylar


| Olay | Açıklama |
| --- | --- |
| `hide.coreui.toast` | `hide` örnek metodu çağrıldığında bu olay hemen tetiklenir. |
| `hidden.coreui.toast` | Toast kullanıcının gözünden gizlendikten sonra bu olay tetiklenir. |
| `show.coreui.toast` | `show` örnek metodu çağrıldığında bu olay hemen tetiklenir. |
| `shown.coreui.toast` | Toast kullanıcının gözünde görülebilir hale geldiğinde bu olay tetiklenir. |
```js
const myToastEl = document.getElementById('myToast')
myToastEl.addEventListener('hidden.coreui.toast', () => {
  // bir şey yap...
})
```

## Özelleştirme
### CSS değişkenleri

Toastlar, geliştirilmiş gerçek zamanlı özelleştirme için `.toast` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass üzerinden ayarlanır, bu nedenle Sass özelleştirmesi de desteklenir.

### SASS değişkenleri

