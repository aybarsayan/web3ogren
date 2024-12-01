---
description: CoreUI'yi Bootstrap ile hayatınıza geçirin; opsiyonel JavaScript eklentilerimizle tanışın. Her bir eklentiyi, veri ve programatik API seçeneklerimizi öğrenin ve daha fazlası.
keywords: [CoreUI, JavaScript, Bootstrap, eklentiler, programatik API, kullanıcı deneyimi, modülerlik]
---

# JavaScript

## Bireysel veya derlenmiş

Eklentiler, CoreUI'nin bireysel `js/dist/*.js` dosyalarını kullanarak bireysel olarak dahil edilebilir veya hepsini bir arada kullanarak `coreui.js` veya sıkıştırılmış `coreui.min.js` ile dahil edilebilir (ikisini birden dahil etmeyin).

:::tip
Eğer bir paketleyici (Webpack, Rollup...) kullanıyorsanız, UMD hazır olan `/js/dist/*.js` dosyalarını kullanabilirsiniz.
:::

## JavaScript çerçeveleri ile kullanım

- Angular: [CoreUI for Angular](https://coreui.io/angular/docs/getting-started/introduction)
- React: [CoreUI for React](https://coreui.io/react/docs/getting-started/introduction/)
- Vue: [CoreUI for Vue](https://coreui.io/vue/docs/getting-started/introduction.html)

## CoreUI for Bootstrap'ı modül olarak kullanma

Tarayıcınızdaki CoreUI for Bootstrap'ı bir modül olarak kullanmanıza olanak tanıyan `ESM` (`coreui.esm.js` ve `coreui.esm.min.js`) olarak inşa edilmiş bir sürüm sağlıyoruz; bu, eğer [hedeflediğiniz tarayıcılar destekliyorsa](https://caniuse.com/es6-module).


```html
<script type="module">
  import { Toast } from 'coreui.esm.min.js'

  Array.from(document.querySelectorAll('.toast'))
    .forEach(toastNode => new Toast(toastNode))
</script>
```

JavaScript paketleyicilerine kıyasla, tarayıcıda ESM kullanmak, modül adının yerine tam yol ve dosya adını kullanmanızı gerektirir. [Tarayıcıda JS modülleri hakkında daha fazla bilgi edinin.](https://v8.dev/features/modules#specifiers) Bu yüzden yukarıda `'coreui.esm.min.js'` kullanıyoruz, çünkü Popper bağımlılığımız daha da karmaşık bir yapıdadır; JavaScript'imize Popper'ı şu şekilde alıyoruz:


```js
import * as Popper from "@popperjs/core"
```

Eğer bu şekilde denersek, konsolda aşağıdaki gibi bir hata göreceksiniz:

```text
Uncaught TypeError: Failed to resolve module specifier "@popperjs/core". Relative references must start with either "/", "./", or "../".
```

Bunu düzeltmek için, keyfi modül isimlerini tam yollarla eşleştirmek için bir `importmap` kullanabilirsiniz. Eğer [hedeflediğiniz tarayıcılar](https://caniuse.com/?search=importmap) `importmap` desteklemiyorsa, [es-module-shims](https://github.com/guybedford/es-module-shims) projesini kullanmanız gerekecektir. İşte Bootstrap ve Popper için nasıl çalıştığı:


```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{< param "cdn.css" >}}" rel="stylesheet" integrity="{{< param "cdn.css_hash" >}}" crossorigin="anonymous">
    <title>Merhaba, modülerlik!</title>
  </head>
  <body>
    <h1>Merhaba, modülerlik!</h1>
    <button id="popoverButton" type="button" class="btn btn-primary btn-lg" data-coreui-toggle="popover" title="Tarayıcıda ESM" data-coreui-content="Bang!">Özel popover</button>

    <script async src="https://cdn.jsdelivr.net/npm/es-module-shims@1/dist/es-module-shims.min.js" crossorigin="anonymous"></script>
    <script type="importmap">
    {
      "imports": {
        "@popperjs/core": "{{< param "cdn.popper_esm" >}}",
        "coreui": "https://cdn.jsdelivr.net/npm/coreui@{{< param "current_version" >}}/dist/js/coreui.esm.min.js"
      }
    }
    </script>
    <script type="module">
      import * as coreui from '@coreui/coreui'

      new coreui.Popover(document.getElementById('popoverButton'))
    </script>
  </body>
</html>
```

## Bağımlılıklar

Bazı eklentiler ve CSS bileşenleri diğer eklentilere bağlıdır. Eğer eklentileri bireysel olarak dahil ediyorsanız, dokümanlarda bu bağımlılıkları kontrol ettiğinizden emin olun.

:::info
Açılır kutularımız, popoverler ve ipuçlarımız [Popper](https://popper.js.org/) üzerine bağımlıdır.
:::

## Veri nitelikleri

Neredeyse tüm CoreUI for Bootstrap eklentileri, yalnızca HTML üzerinden veri nitelikleriyle etkinleştirilebilir ve yapılandırılabilir (JavaScript işlevselliğini kullanmanın tercih ettiğimiz yolu). Tek bir öğe üzerinde **sadece bir set veri niteliği kullanmaya dikkat edin** (örneğin, aynı düğmeden hem ipucu hem de modal tetikleyemezsiniz).

## Seçiciler

Şu anda DOM öğelerini sorgulamak için performans nedenleriyle yerel `querySelector` ve `querySelectorAll` yöntemlerini kullanıyoruz; bu nedenle [geçerli seçiciler](https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier) kullanmalısınız. Özel seçiciler kullanıyorsanız, örneğin: `collapse:Example` bunları kaçırmamalısınız.

## Olaylar

CoreUI for Bootstrap, çoğu eklentinin benzersiz eylemleri için özel olaylar sağlar. Genel olarak, bunlar bir devinim ve geçmiş katılımcı formunda gelir - burada devinim (örn. `show`), bir olayın başlangıcında tetiklenir ve geçmiş katılımcı formu (örn. `shown`), bir eylemin tamamlandığında tetiklenir.

:::note
Tüm devinim olayları [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) işlevselliği sağlar. Bu, bir eylemin başlamadan önce yürütülmesini durdurma yeteneği sağlar. Bir olay işleyicisinden false döndürmek, `preventDefault()`'ı da otomatik olarak çağıracaktır.
:::


```js
const myModal = document.getElementById('myModal')

myModal.addEventListener('show.coreui.modal', event => {
  return event.preventDefault() // modali göstermeyi durdurur
})
```

## Programatik API

Tüm yapıcılar, isteğe bağlı bir seçenek nesnesini veya hiçbir şeyi kabul eder (bu, varsayılan davranış ile bir eklentiyi başlatır):

```js
const myModalEl = document.querySelector('#myModal')
const modal = new coreui.Modal(myModalEl) // varsayılanlarla başlatıldı

const configObject = { keyboard: false }
const modal1 = new coreui.Modal(myModalEl, configObject) // klavye yok olarak başlatıldı
```

Belirli bir eklenti örneğini almak istiyorsanız, her eklenti bir `getInstance` yöntemini açığa çıkartır. Örneğin, bir öğeden örneği doğrudan almak için:

```js
coreui.Popover.getInstance(myPopoverEl)
```

Bu yöntem, istenen öğe üzerinde bir örnek başlatılmadıysa `null` döndürecektir.

Alternatif olarak, `getOrCreateInstance`, bir DOM öğesi ile ilişkili örneği almak veya başlatılmadıysa yeni bir tane oluşturmak için kullanılabilir.

```js
coreui.Popover.getOrCreateInstance(myPopoverEl, configObject)
```

Bir örnek başlatılmadıysa, ikinci argüman olarak isteğe bağlı bir yapılandırma nesnesini kabul edebilir ve kullanabilir.

### Yapıcılarda CSS seçicileri

`getInstance` ve `getOrCreateInstance` yöntemlerinin yanı sıra, tüm eklenti yapıcıları ilk argüman olarak bir DOM öğesi veya geçerli bir `CSS seçicisi` alabilir. Eklenti öğeleri, eklentilerimizin yalnızca tek bir öğeyi desteklemesi nedeniyle `querySelector` yöntemi ile bulunur.

```js
const modal = new coreui.Modal('#myModal')
const dropdown = new coreui.Dropdown('[data-coreui-toggle="dropdown"]')
const offcanvas = coreui.Offcanvas.getInstance('#myOffcanvas')
const alert = coreui.Alert.getOrCreateInstance('#myAlert')
```

### Asenkron işlevler ve geçişler

Tüm programatik API yöntemleri **asenkron** olup, geçiş başladığında ama **bitmeden** çağırana geri döner.

Geçiş tamamlandığında bir eylemi yürütmek için, ilgili olaya dinleme yapabilirsiniz.

```js
const myCollapseEl = document.getElementById('myCollapse')

myCollapseEl.addEventListener('shown.coreui.collapse', event => {
  // Çözülebilir alan genişletildiğinde yürütülecek eylem
})
```

Buna ek olarak, **geçişteki bir bileşene yapılacak bir yöntem çağrısı yok sayılacaktır**.

```js
const myCarouselEl = document.getElementById('myCarousel')
const carousel = coreui.Carousel.getInstance(myCarouselEl) // Bir Carousel örneğini al

myCarouselEl.addEventListener('slid.coreui.carousel', event => {
  carousel.to('2') // Geçiş slide 1 tamamlandığında slide 2'ye kaydıracak
})

carousel.to('1') // Slide 1'e kaydırmaya başlayacak ve çağırana dönecek
carousel.to('2') // !! Yok sayılacak, çünkü slide 1'e geçiş tamamlanmamıştır !!
```

#### `dispose` yöntemi

`hide()` yönteminden hemen sonra `dispose` yöntemini kullanmak doğru görünse de, yanlış sonuçlara yol açabilir. İşte problemli kullanıma bir örnek:

```js
const myModal = document.querySelector('#myModal')
myModal.hide() // asenkron

myModal.addEventListener('shown.coreui.hidden', event => {
  myModal.dispose()
})
```

### Varsayılan ayarlar

Bir eklentinin varsayılan ayarlarını değiştirmek için eklentinin `Constructor.Default` nesnesini değiştirebilirsiniz:

```js
// modal eklentisinin `keyboard` seçeneği için varsayılana göre false yapar
coreui.Modal.Default.keyboard = false
```

## Yöntemler ve özellikler

Her CoreUI for Bootstrap eklentisi aşağıdaki yöntemleri ve statik özellikleri açığa çıkarır.


| Yöntem | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin modalını yok eder. (DOM öğesi üzerindeki saklanan verileri kaldırır) |
| `getInstance` | *Statik* yöntem, bir DOM öğesi ile ilişkili modal örneğini almanızı sağlar. |
| `getOrCreateInstance` | *Statik* yöntem, bir DOM öğesi ile ilişkili modal örneğini almanızı veya başlatılmadıysa yeni bir tane oluşturmanızı sağlar. |

| Statik özellik | Açıklama |
| --- | --- |
| `NAME` | Eklenti adını döndürür. (Örnek: `coreui.Tooltip.NAME`) |
| `VERSION` | Her CoreUI for Bootstrap eklentisinin sürümü, eklentinin yapıcısının `VERSION` özelliği aracılığıyla erişilebilir (Örnek: `coreui.Tooltip.VERSION`) |
## Sanitizer

İpucu ve Popover'lar, HTML kabul eden seçenekleri temizlemek için yerleşik sanitiser'imizi kullanır.

Varsayılan `allowList` değeri aşağıdaki gibidir:

Bu varsayılan `allowList`'e yeni değerler eklemek isterseniz, aşağıdakileri yapabilirsiniz:

```js
const myDefaultAllowList = coreui.Tooltip.Default.allowList

// Tablo öğelerini izin vermek için
myDefaultAllowList.table = []

// td öğelerine ve td öğeleri üzerindeki data-coreui-option niteliklerine izin vermek için
myDefaultAllowList.td = ['data-coreui-option']

// Niteliklerinizi doğrulamak için özel regex'inizi ekleyebilirsiniz.
// Regüler ifadenizin fazla gevşek olmasına dikkat edin
const myCustomRegex = /^data-my-app-[\w-]+/
myDefaultAllowList['*'].push(myCustomRegex)
```

Kendi sanitiser'ınızı kullanmak istiyorsanız, örneğin [DOMPurify](https://www.npmjs.com/package/dompurify) kullanmak istiyorsanız, aşağıdakileri yapmalısınız:

```js
const yourTooltipEl = document.querySelector('#yourTooltip')
const tooltip = new coreui.Tooltip(yourTooltipEl, {
  sanitizeFn(content) {
    return DOMPurify.sanitize(content)
  }
})
```

## Opsiyonel olarak jQuery kullanma

**CoreUI for Bootstrap içinde jQuery'ye ihtiyacınız yok**, ancak bileşenlerimizi jQuery ile kullanmak da mümkündür. CoreUI for Bootstrap, `window` nesnesinde `jQuery` tespit ederse, tüm bileşenlerimizi jQuery'nin eklenti sistemine ekler. Bu, aşağıdakileri yapmanızı sağlar:

```js
// varsayılan yapılandırma ile ipuçlarını etkinleştirmek için
$('[data-coreui-toggle="tooltip"]').tooltip()

// belirli bir yapılandırma ile ipuçlarını başlatmak için
$('[data-coreui-toggle="tooltip"]').tooltip({
  boundary: 'clippingParents',
  customClass: 'myClass'
})

// `show` yöntemini tetiklemek için
$('#myTooltip').tooltip('show')
```

Diğer bileşenlerimiz için de aynı şey geçerlidir.

### Çatışma yok

Bazen, CoreUI for Bootstrap eklentilerini diğer UI çerçeveleri ile kullanmak gerekli olabilir. Bu durumlarda, ad alanı çakışmaları bazen gerçekleşebilir. Eğer bu olursa, geri dönüş yapmak istediğiniz eklenti üzerinde `.noConflict` çağrısı yapabilirsiniz.

```js
const coreuiButton = $.fn.button.noConflict() // $.fn.button'ı önceki atanan değere döndürür
$.fn.coreuiBtn = coreuiButton // $().coreuiBtn'ye CoreUI for Bootstrap işlevselliğini verir
```

CoreUI for Bootstrap, Prototype veya jQuery UI gibi üçüncü taraf JavaScript kütüphanelerini resmi olarak desteklemez. `.noConflict` ve ad alanı olaylarına rağmen, düzeltmeniz gereken uyumluluk sorunları olabilir.

### jQuery olayları

Eğer `jQuery` `window` nesnesinde mevcutsa ve `` üzerinde `data-coreui-no-jquery` niteliği ayarlanmamışsa, CoreUI for Bootstrap jQuery'yi tespit edecektir. Eğer jQuery bulunursa, CoreUI for Bootstrap, jQuery'nin olay sistemi sayesinde olayları yayar. Bu nedenle, CoreUI for Bootstrap olaylarını dinlemek için, jQuery yöntemlerini (`.on`, `.one`) kullanmalısınız; `addEventListener` yerine.

```js
$('#myTab a').on('shown.coreui.tab', () => {
  // bir şey yap...
})
```

## Devre dışı bırakılmış JavaScript

CoreUI for Bootstrap eklentilerinin, JavaScript devre dışı bırakıldığında özel bir geri dönüşü yoktur. Bu durumda kullanıcı deneyimini önemsiyorsanız, [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript) kullanarak durumu (ve JavaScript'in nasıl yeniden etkinleştirileceği) kullanıcılarınıza açıklayabilir ve/veya kendi özel geri dönüşlerinizi ekleyebilirsiniz.