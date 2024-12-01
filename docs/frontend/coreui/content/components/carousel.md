---
description: Bootstrap carousel, resimlerin veya metin slaytlarının döngüsünde geçiş yapmak için bir slayt gösterisi bileşenidir. Bu döküman, Bootstrap carousel'in nasıl çalıştığını, örneklerini ve kullanım yönergelerini ele almaktadır.
keywords: [Bootstrap, carousel, slayt gösterisi, JavaScript, CSS, erişilebilirlik]
---

## Nasıl çalışır

Bootstrap carousel, CSS 3D dönüşümleri ve JavaScript ile oluşturulmuş bir içerik grubunda döngü yapmak için bir slayt gösterisidir. **Bir grup resim, metin veya HTML öğesi ile çalışır.** Ayrıca önceki/sonraki düğmelerine destek de içerir.

:::info
[Page Visibility API](https://www.w3.org/TR/page-visibility/) destekleyen tarayıcılarda, carousel artık web sayfası kullanıcıya görünür olmadığında (örneğin, tarayıcı sekmesi aktif değilse, tarayıcı penceresi küçültülmüşse vb.) kaydırmayı önler.
:::

Lütfen iç içe carousel'lerin desteklenmediğini ve carousel'lerin genellikle erişilebilirlik kurallarına uymadığını unutmayın.

## Örnek

Carousel'ler otomatik olarak slayt boyutlarını normalleştirmez. **Bu nedenle, içeriği uygun bir şekilde boyutlandırmak için ekstra yardımcı programlar veya özel yöntemler kullanmak isteyebilirsiniz.** Carousel'ler önceki/sonraki kontroller ve göstergeleri desteklese de, bunların açıkça beklenmediğini belirtmekte fayda var. İhtiyacınıza göre ekleyip özelleştirin.

**`.active` sınıfı slaytlardan birine eklenmelidir, aksi takdirde carousel görünmeyecektir.** Ayrıca çok sayıda carousel kullanıyorsanız, `.carousel` için farklı bir id ayarlamayı unutmayın. Kontrol ve gösterge ögeleri, `.carousel` öğesinin id'siyle eşleşen bir `data-coreui-target` (veya bağlantılar için `href`) özniteliğine sahip olmalıdır.

### Sadece slaytlar

İşte slaytları olan bir carousel. Tarayıcı varsayılan resim hizalamasını geçersiz kılmak için `.d-block` ve `.w-100` sınıflarının görünümünü not edin.

  
    
      
    
    
      
    
    
      
    
  

### Kontroller ile

Önceki ve sonraki kontrolleri ekleyerek. ** öğelerini kullanmayı öneriyoruz, ancak `role="button"` ile  öğelerini de kullanabilirsiniz.**

  
    
      
    
    
      
    
    
      
    
  
  
    
    Önceki
  
  
    
    Sonraki
  

### Göstergeler ile

Carousel'e göstergeleri, kontrollerle eş zamanlı olarak ekleyebilirsiniz.

  
    
    
    
  
  
    
      
    
    
      
    
    
      
    
  
  
    
    Önceki
  
  
    
    Sonraki
  

### Altyazılar ile

Altyazılar eklemek için `.carousel-caption` öğesini herhangi bir `.carousel-item` içerisinde kullanabilirsiniz. Küçük görünüm alanlarında hemen gizlenebilirler, aşağıda gösterileceği üzere, isteğe bağlı `gösterim yardımcı programları` ile gizlenebiliriz. **.d-none ile gizleriz ve orta boyutlu cihazlarda .d-md-block ile geri çekeriz.**

  
    
    
    
  
  
    
      
      
        İlk slayt etiketi
        İlk slayt için bazı temsili yer tutucu içerikler.
      
    
    
      
      
        İkinci slayt etiketi
        İkinci slayt için bazı temsili yer tutucu içerikler.
      
    
    
      
      
        Üçüncü slayt etiketi
        Üçüncü slayt için bazı temsili yer tutucu içerikler.
      
    
  
  
    
    Önceki
  
  
    
    Sonraki
  

### Geçiş efektli

Slaytları kaydırmak yerine geçiş animasyonu eklemek için carousel'inize `.carousel-fade` ekleyin. **Carousel içeriğiniz (örneğin, sadece metin slaytları) varsa, uygun bir geçiş sağlamak için `.carousel-item`'lara `.bg-body` veya özel CSS eklemek isteyebilirsiniz.**

  
    
      
    
    
      
    
    
      
    
  
  
    
    Önceki
  
  
    
    Sonraki
  

### Bireysel `.carousel-item` aralıkları

Otomatik olarak bir sonraki öğeye geçtikten sonra bekleme süresini değiştirmek için bir `.carousel-item`'a `data-coreui-interval=""` ekleyin.

  
    
      
    
    
      
    
    
      
    
  
  
    
    Önceki
  
  
    
    Sonraki
  

### Dokunmatik kaydırmayı devre dışı bırakma

Carousel'ler, slaytlar arasında geçiş yapmak için dokunmatik cihazlarda sağa/sola kaydırmayı destekler. Bu, `data-coreui-touch` özniteliğini kullanarak devre dışı bırakılabilir. Aşağıdaki örnekte, `data-coreui-ride` özniteliği de bulunmadığından otomatik oynatma yoktur.

  
    
      
    
    
      
    
    
      
    
  
  
    
    Önceki
  
  
    
    Sonraki
  

## Koyu varyant

Daha koyu kontroller, göstergeler ve altyazılar için `.carousel-dark`'ı `.carousel`'a ekleyin. Kontroller varsayılan beyaz dolgu renginden `filter` CSS özelliği ile tersine çevrilmiştir. Altyazılar ve kontroller, `color` ve `background-color`'u özelleştiren ek Sass değişkenlerine sahiptir.

  
    
    
    
  
  
    
      
      
        İlk slayt etiketi
        İlk slayt için bazı temsili yer tutucu içerikler.
      
    
    
      
      
        İkinci slayt etiketi
        İkinci slayt için bazı temsili yer tutucu içerikler.
      
    
    
      
      
        Üçüncü slayt etiketi
        Üçüncü slayt için bazı temsili yer tutucu içerikler.
      
    
  
  
    
    Önceki
  
  
    
    Sonraki
  

## Özel geçiş

`.carousel-item` için geçiş süresi, derlemeden önce `$carousel-transition-duration` Sass değişkeni ile veya derlenmiş CSS kullanıyorsanız özel stillerle değiştirilebilir. **Birden fazla geçiş uygulanırsa, dönüşüm geçişinin ilk olarak tanımlandığından emin olun (örneğin, `transition: transform 2s ease, opacity .5s ease-out`).**

## Kullanım

### Veri öznitelikleri yoluyla

Carousel'ün konumunu kontrol etmek için veri özniteliklerini kullanın. `data-coreui-slide`, mevcut konumuna karşılık gelen `prev` veya `next` anahtar kelimelerini kullanmanıza olanak tanır. Alternatif olarak, `data-coreui-slide-to` kullanarak belirli bir slayt dizinini doğrudan carousel'e iletebilirsiniz `data-coreui-slide-to="2"`, bu, slayt konumunu `0`'dan başlayan belirli bir indise taşır.

`data-coreui-ride="carousel"` özniteliği, bir carousel'in sayfa yüklemesi sırasında animasyona başlayacağını belirtmek için uygulanır. **Bu, aynı carousel'in (gereksiz ve ihtiyacı olmayan) açık JavaScript başlatmasıyla birlikte yapılamaz.**

### JavaScript ile

Carousel'ü manuel olarak çağırmak için:

```js
const carousel = new coreui.Carousel('#myCarousel')
```

### Seçenekler




| İsim | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `interval` | sayı | `5000` | Bir öğe arasında otomatik olarak geçiş yapmak için bekleme süresi. |
| `keyboard` | boolean | `true` | Carousel'ün klavye olaylarına tepki verip vermemesi. |
| `pause` | string, boolean | `"hover"` | `"hover"` olarak ayarlandığında, fare ile üzerine gelindiğinde carousel'ün döngüsünü duraklatır ve fareyle ayrıldığında döngüyü devam ettirir. `false` olarak ayarlandığında, carousel'ün üzerine gelmek duraksatmaz. Dokunmatik özellikli cihazlarda, `"hover"` olarak ayarlandığında, döngü, Kullanıcı carousel ile etkileşimde bulunduktan sonra iki aralık boyunca `touchend` olayında duraklar, ardından otomatik olarak devam eder. Bu, fare davranışına eklenmiştir. |
| `ride` | string, boolean | `false` | `true` olarak ayarlandığında, kullanıcı ilk öğeyi manuel olarak döngüye soktuktan sonra carousel'ü otomatik oynatır. `carousel` olarak ayarlandığında, sayfada yüklenirken carousel'ü otomatik oynatır. |
| `touch` | boolean | `true` | Carousel'ün dokunmatik cihazlarda sağa/sola kaydırma etkileşimlerini destekleyip desteklememesi. |
| `wrap` | boolean | `true` | Carousel'ün sürekli döngü yapıp yapmayacağı veya kesik duraklamalara sahip olup olmayacağı. |
### Yöntemler



Carousel yapıcısı ile bir carousel örneği oluşturabilirsiniz, örneğin, ek seçeneklerle başlatmak ve öğeler arasında döngüye başlamak için:

```js
const myCarouselElement = document.querySelector('#myCarousel')
const carousel = new coreui.Carousel(myCarouselElement, {
  interval: 2000,
  wrap: false
})
```


| Yöntem | Açıklama |
| --- | --- |
| `cycle` | Carousel öğelerini soldan sağa döngüye alır. |
| `dispose` | Bir öğenin carousel'ünü yok eder. (DOM öğesinde saklanan verileri kaldırır) |
| `getInstance` | Statik yöntem, bir DOM öğesi ile ilişkilendirilmiş carousel örneğini almanıza olanak tanır, bunu şöyle kullanabilirsiniz: `coreui.Carousel.getInstance(element)` |
| `getOrCreateInstance` | Statik yöntem, bir DOM öğesi ile ilişkilendirilen carousel örneğini döndürür veya başlatılmamışsa yeni bir tane oluşturur. Bunu şöyle kullanabilirsiniz: `coreui.Carousel.getOrCreateInstance(element)` |
| `next` | Bir sonraki elemana geçer. **Sonraki öğe gösterilmeden önce çağırana geri döner** (örneğin, `slid.coreui.carousel` olayı gerçekleşmeden önce). |
| `nextWhenVisible` | Sayfa görünmediğinde veya carousel veya üst öğesi görünmediğinde carousel'ü bir sonraki öğeye döngülemez. **Hedef öğe gösterilmeden önce çağırana geri döner** |
| `pause` | Carousel'ün öğeleri arasında döngüyü durdurur. |
| `prev` | Önceki öğeye geçer. **Önceki öğe gösterilmeden önce çağırana geri döner** (örneğin, `slid.coreui.carousel` olayı gerçekleşmeden önce). |
| `to` | Carousel'ü belirli bir çerçeveye döngüye alır (0'dan başlayarak, bir dizi gibi). **Hedef öğe gösterilmeden önce çağırana geri döner** (örneğin, `slid.coreui.carousel` olayı gerçekleşmeden önce). |
---
description: Bootstrap için CoreUI'nin karusel sınıfı etkinlikleri ve özelleştirmeleri hakkında bilgi. Karusel işlevselliğine entegre olan iki temel etkinliğin tanımı ve SASS değişkenleri hakkında derinlemesine açıklamalar içerir.
keywords: [Bootstrap, CoreUI, karusel, etkinlikler, SASS, özelleştirme, web geliştirme]
---

### Etkinlikler

Bootstrap için CoreUI'nin karusel sınıfı, karusel işlevselliğine entegre olmak için iki etkinlik sunar. Her iki etkinlik de aşağıdaki ek özelliklere sahiptir:

- **`direction`**: Karusel'in kaydığı yön (ya `"left"` ya da `"right"`).
- **`relatedTarget`**: Aktif öğe olarak yerleştirilen DOM elementi.
- **`from`**: Mevcut öğenin indeksi.
- **`to`**: Bir sonraki öğenin indeksi.

Tüm karusel etkinlikleri, karusel üzerinde tetiklenir (yani `` üzerinde).


| Etkinlik türü | Açıklama |
| --- | --- |
| `slid.coreui.carousel` | Karusel kaydırma geçişini tamamladığında tetiklenir. |
| `slide.coreui.carousel` | `slide` örnek yöntemine çağrıldığında hemen tetiklenir. |
```js
const myCarousel = document.getElementById('myCarousel')

myCarousel.addEventListener('slide.coreui.carousel', event => {
  // bir şey yap...
})
```

## Özelleştirme

### SASS değişkenleri

Tüm karuseller için değişkenler:

:::tip
**Öneri:** Farklı karusel stilleri uygulamak için kullanabileceğiniz bazı değişkenleri kontrol edin.
:::

`Koyu karusel` için değişkenler:

:::info
Daha fazla bilgi için CoreUI belgelerine göz atın.
:::