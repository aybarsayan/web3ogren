---
description: Web sitenizdeki her öğeye, iOS'da bulunan popoverlar gibi Bootstrap popoverları ekleme ile ilgili dokümantasyon ve örnekler.
keywords: [popover, Bootstrap, web, kullanıcı etkileşimi, CSS]
---

## Genel Bakış

Popover eklentisini kullanırken bilinmesi gerekenler:

- **Popoverlar**, konumlandırma için 3. parti [Popper](https://popper.js.org/) kütüphanesine dayanır. Popoverların çalışması için `popper.min.js` dosyasını coreui.js’den önce eklemelisiniz ya da Popper'ı içeren `coreui.bundle.min.js` / `coreui.bundle.js` dosyasını kullanmalısınız!
- Popoverlar, bir bağımlılık olarak `tooltip eklentisi` gerektirir.
- **Performans nedenleriyle popoverlar isteğe bağlıdır, bu nedenle kendi başınıza başlatmalısınız.**
- Sıfır uzunluğunda `title` ve `content` değerleri asla bir popover göstermez.

:::tip
Daha karmaşık bileşenlerde (giriş grupları, buton grupları vb.) görüntüleme sorunlarını önlemek için `container: 'body'` belirtin.
:::

- Gizli öğelerde popover tetiklemek işe yaramayacaktır.
- `.disabled` veya `disabled` öğeleri için popover, bir sarmalayıcı öğede tetiklenmelidir.
  
:::note
Birden çok satır boyunca sarılmış bağlantılardan tetiklendiğinde popoverlar, toplam genişlikleri arasında ortalanacaktır. Bu davranışı önlemek için `` etiketlerinize `.text-nowrap` sınıfını kullanın.
:::

- Popoverlar, karşılık gelen öğeleri DOM'dan kaldırılmadan önce gizlenmelidir.
- Popoverlar, gölge DOM içindeki bir öğeye bağlı olarak tetiklenebilir.





**Popoverların nasıl çalıştığını görmek için okumaya devam edin.**

## Örnekler

### Her yerde popover'ı etkinleştirin

Bir sayfadaki tüm popoverları başlatmanın bir yolu, `data-coreui-toggle` niteliğine göre seçmektir:

```js
const popoverTriggerList = document.querySelectorAll('[data-coreui-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new coreui.Popover(popoverTriggerEl))
```

### Canlı demo

Aşağıdaki canlı popover'ı görüntülemek için yukarıdaki iş parçacığına benzer bir JavaScript kullanıyoruz. Başlıklar `data-coreui-title` ile ve içerik `data-coreui-content` ile ayarlanır.




Popover'ı açmak için tıklayın
### Dört yön

Dört seçenek mevcuttur: üst, sağ, alt ve sola hizalı. CoreUI RTL kullanıldığında yönler ters çevrilecektir.

  Üstte Popover


  Sağda Popover


  Altta Popover


  Solda Popover

### `container` seçeneğini kullanma

Ebeveyn bir öğedeki bazı stiller, bir popover ile çakışıyorsa, popover'ın HTML'sinin o öğenin içinde görünmesi için özel bir `container` belirtmelisiniz.

```js
const popover = new coreui.Popover(document.querySelector('.example-popover'), {
  container: 'body'
})
```

### Özel popoverlar

Popoverların görünümünü `CSS değişkenleri` kullanarak özelleştirebilirsiniz. Özel görünümümüz için `data-coreui-custom-class="custom-popover"` ile özel bir sınıf ayarladık ve bazı yerel CSS değişkenlerini geçersiz kılmak için bunu kullandık.

  Özel popover

### Sonraki tıklamada kapatma

Kullanıcının, tetikleyici elemana tıklamaktan farklı bir öğeye tıkladığında popoverları kapatmak için `focus` tetikleyicisini kullanın.

:::danger
#### Sonraki tıklamada kapatma için belirli işaretleme gereklidir

Doğru tarayıcılar arası ve platformlar arası davranış için, `` etiketi yerine `` etiketini kullanmalısınız ve ayrıca bir [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) niteliği eklemelisiniz.
:::


Kapatılabilir popover
```js
const popover = new coreui.Popover(document.querySelector('.popover-dismiss'), {
  trigger: 'focus'
})
```

### Devre dışı öğeler

`disabled` niteliğine sahip öğeler etkileşimli değildir, bu da kullanıcıların bunlara tıklayarak popover (veya tooltip) tetikleyemeyeceği anlamına gelir. 

:::note
Bir çözüm olarak, popover'ı bir sarmalayıcı `` veya `` üzerinden tetiklemek isteyebilirsiniz; tercihen `tabindex="0"` kullanarak klavye ile odaklanabilir hale getirilecektir.
:::

Devre dışı popover tetikleyicileri için, kullanıcıların devre dışı bir öğeye tıkladıklarında hemen görsel geri bildirim alması için `data-coreui-trigger="hover focus"` tercih edebilirsiniz.

  Devre dışı buton

## Kullanım

JavaScript aracılığıyla popover'ları etkinleştirin:

```js
const exampleEl = document.getElementById('example')
const popover = new coreui.Popover(exampleEl, options)
```

:::warning
### Klavye ve yardımcı teknoloji kullanıcıları için popover'ların çalışmasını sağlama

Klavye kullanıcılarının popover'larınızı etkinleştirmesine izin vermek için, yalnızca geleneksel olarak klavye ile odaklanabilen ve etkileşimli HTML öğelerine (bağlantılar veya form kontrolleri gibi) eklemelisiniz. 

Her ne kadar rastgele HTML öğeleri (`` gibi) `tabindex="0"` niteliği eklenerek odaklanabilir hale getirilebilirse de, bu durum klavye kullanıcıları için etkileşimsiz öğelerde rahatsız edici ve kafa karıştırıcı sekme durakları ekleyebilir ve çoğu yardımcı teknoloji, bu durumda popover'ın içeriğini duyurmaz. Ayrıca, yalnızca `hover`'a güvenmek, popover'ları klavye kullanıcıları için tetiklenemez hale getirecektir.
:::

**Seçenekler**

Seçenekler, veri nitelikleri veya JavaScript aracılığıyla geçirilebilir. Veri nitelikleri için, seçenek adını `data-coreui-` ön ekine ekleyin, örneğin `data-coreui-animation=""`. Seçenek adının yazım biçimini, veri nitelikleri aracılığıyla geçerken camelCase'den kebab-case'e değiştirin. Örneğin: `data-coreui-customClass="beautifier"` yerine `data-coreui-custom-class="beautifier"` kullanın.

:::warning
Güvenlik nedenleriyle `sanitize`, `sanitizeFn` ve `allowList` seçeneklerinin veri nitelikleri kullanılarak sağlanamayacağını unutmayın.
:::


| İsim | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `allowList` | object | `Varsayılan değer` | İzin verilen nitelikler ve etiketleri içeren nesne. |
| `animation` | boolean | `true` | Popover'a bir CSS fade geçişi uygular. |
| `boundary` | string, element | `'clippingParents'` | Popover'ın taşma kısıtlama sınırı (sadece Popper'ın preventOverflow modifikatörü için geçerlidir). Varsayılan olarak, `'clippingParents'`'dır ve yalnızca bir HTMLElement referansı alabilir (yalnızca JavaScript ile). Daha fazla bilgi için Popper'ın [detectOverflow belgelerine](https://popper.js.org/docs/v2/utils/detect-overflow/#boundary) bakın. |
| `container` | string, element, false | `false` | Popover'ı belirli bir elemana ekler. Örnek: `container: 'body'`. Bu seçenek, popover'ı tetikleyici öğenin yakınında dökümanın akışı içinde konumlandırmanıza olanak tanır - bu, pencere boyutu değiştiğinde popover'ın tetikleyici öğeden uzaklaşmasını önler. |
| `content` | string, element, function | `''` | Varsayılan içerik değeri, `data-coreui-content` niteliği mevcut değilse kullanılır. Eğer bir işlev sağlanırsa, popover'ın bağlı olduğu öğeye `this` referansını ayarlayarak çağrılır. |
| `customClass` | string, function | `''` | Popover gösterildiğinde popover'a sınıflar ekler. Bu sınıfların, şablonda belirtilen sınıflara ek olarak ekleneceğini unutmayın. Birden fazla sınıf eklemek için, bunları boşlukla ayırın: `'class-1 class-2'`. Ek sınıf adlarını içeren tek bir dize döndürmesi gereken bir işlev de geçirebilirsiniz. |
| `delay` | number, object | `0` | Popover'ı gösterme ve gizleme gecikmesi (ms) - manuel tetikleyici türüne uygulanmaz. Bir sayı sağlanırsa, gizleme/gösterme işlemi için gecikme uygulanır. Nesne biçimi: `delay: { "show": 500, "hide": 100 }`. |
| `fallbackPlacements` | string, array | `['top', 'right', 'bottom', 'left']` | Tercih sırasına göre bir yerleştirme listesi sağlayarak yedek yerleştirmeleri tanımlayın. Daha fazla bilgi için Popper'ın [behavior belgelerine](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) bakın. |
| `html` | boolean | `false` | Popover'da HTML'ye izin verir. Eğer true ise, popover'ın `title` içinde HTML etiketleri render edilir. Eğer false ise, içeriği DOM'a eklerken `innerText` özelliği kullanılır. XSS saldırıları konusunda endişeleriniz varsa metin kullanın. |
| `offset` | number, string, function | `[0, 8]` | Hedefine göre popover'ın ofseti. Veriyken, veri nitelikleri ile `data-coreui-offset="10,20"` gibi virgülle ayrılmış değerler şeklinde bir dize geçirebilirsiniz. Ofseti belirlemek için bir işlev kullanıldığında, bu işlev popper yerleşimini, referansı ve popper dikdörtgenlerini ilk argüman olarak içeren bir nesne ile çağrılır. Tetikleyici öğe DOM düğümü ikinci argüman olarak geçilir. İşlev, iki sayıyla bir dizi döndürmelidir: [skidding](https://popper.js.org/docs/v2/modifiers/offset/#skidding-1), [distance](https://popper.js.org/docs/v2/modifiers/offset/#distance-1). Daha fazla bilgi için Popper'ın [offset belgelerine](https://popper.js.org/docs/v2/modifiers/offset/#options) bakın. |
| `placement` | string, function | `'right'` | Popover'ın nasıl konumlandırılacağı: auto, top, bottom, left, right. `auto` belirtildiğinde, popover dinamik olarak yeniden yönlendirilecektir. Yerleşimi belirlemek için bir işlev kullanıldığında, bu işlev popover DOM düğümünü ilk argüman olarak ve tetikleyici öğe DOM düğümünü ikinci argüman olarak alır. `this` bağlamı popover örneğine ayarlanır. |
| `popperConfig` | null, object, function | `null` | CoreUI'yi Bootstrap'ın varsayılan Popper yapılandırmasını değiştirmek için kullanın, [Popper'ın yapılandırmasını](https://popper.js.org/docs/v2/constructors/#options) görün. Bir işlev, Popper yapılandırmasını yaratmak için kullanıldığında, CoreUI için Bootstrap'ın varsayılan Popper yapılandırmasını içeren bir nesne ile çağrılır. Bu, varsayılan yapılandırma ile kendi yapılandırmanızı kullanmanıza ve birleştirmenize yardımcı olur. İşlev, Popper için bir yapılandırma nesnesi döndürmelidir. |
| `sanitize` | boolean | `true` | Sanitizasyonu etkinleştirir veya devre dışı bırakır. Eğer etkinleştirilirse, `'template'`, `'content'` ve `'title'` seçenekleri sanitizasyona tabi tutulacaktır. |
| `sanitizeFn` | null, function | `null` | Kendi sanitizasyon işlevinizi sağlayabilirsiniz. Bu, sanitizasyon işlemlerini gerçekleştirmek için özel bir kütüphane kullanmayı tercih ediyorsanız yararlı olabilir. |
| `selector` | string, false | `false` | Bir seçici sağlanırsa, popover nesneleri belirtilen hedeflere devredilir. Uygulamada, bu, dinamik olarak eklenen DOM öğelerine popover uygulanmasını sağlamak için kullanılır (`jQuery.on` desteği). `Bu konuya` ve [bilgilendirici bir örneğe](https://codepen.io/Johann-S/pen/djJYPb) bakın. **Not**: `title` niteliği bir seçici olarak kullanılmamalıdır. |
| `template` | string | `''` | Popover oluştururken kullanılacak temel HTML. Popover'ın `title`'ı `.popover-body`'ye enjekte edilecektir. `.popover-arrow`, popover'ın oku haline gelecektir. En dıştaki sarmalayıcı öğe `.popover` sınıfına ve `role="popover"` niteliğine sahip olmalıdır. |
| `title` | string, element, function | `''` | Varsayılan başlık değeri, `title` niteliği mevcut değilse kullanılır. Eğer bir işlev sağlanırsa, popover'ın bağlı olduğu öğeye `this` referansını ayarlayarak çağrılır. |
| `trigger` | string | `'click'` | Popover'ın nasıl tetiklendiği: click, hover, focus, manual. Birden fazla tetikleyici geçebilirsiniz; boşlukla ayırın. `'manual'` değeri, popover'ın `.popover('show')`, `.popover('hide')` ve `.popover('toggle')` yöntemleri aracılığıyla programlı olarak tetikleneceği anlamına gelir; bu değer, başka herhangi bir tetikleyici ile birleştirilemez. Yalnızca `'hover'`, klavye ile tetiklenemeyen popover'lar oluşturarak kullanılmalıdır ve klavye kullanıcıları için aynı bilgiyi iletmek için alternatif yöntemler sağlanmadığı sürece kullanılmamalıdır. |
:::info
#### Bireysel popoverlar için veri nitelikleri

Bireysel popoverlar için seçenekler, yukarıda açıklandığı gibi veri nitelikleri kullanılarak alternatif olarak belirtilebilir.
:::

#### `popperConfig` ile işlev kullanma

```js
const popover = new coreui.Popover(element, {
  popperConfig(defaultBsPopperConfig) {
    // const newPopperConfig = {...}
    // gerekirse defaultBsPopperConfig kullanın...
    // yeniPopperConfig'i döndür
  }
})
```

### Yöntemler

:::danger

:::


| Yöntem | Açıklama |
| --- | --- |
| `disable` | Bir öğenin popover'ının gösterilme yeteneğini kaldırır. Popover yalnızca yeniden etkinleştirildiğinde gösterilebilir. |
| `dispose` | Bir öğenin popover'ını gizler ve yok eder (DOM öğesi üzerindeki depolanan verileri kaldırır). Delegasyon kullanan popoverlar (`selector` seçeneğini` kullanarak oluşturulan) alt öğe tetikleyicilerinde bireysel olarak yok edilemez. |
| `enable` | Bir öğenin popover'ının gösterilme yeteneğini verir. **Popoverlar varsayılan olarak etkindir.** |
| `getInstance` | Bir DOM öğesi ile ilişkili popover örneğini almanızı sağlayan _statik_ bir yöntem. |
| `getOrCreateInstance` | *Statik* yöntem, bir DOM öğesi ile ilişkili popover örneğini almanızı veya bir tane oluşturmanızı sağlar. |
| `hide` | Bir öğenin popover'ını gizler. **Popover gerçekten gizlenmeden önce çağırana döner** (yani, `hidden.coreui.popover` olayı gerçekleşmeden önce). Bu, popover'ın "manuel" olarak tetiklenmesidir. |
| `setContent` | Popover'ın içeriklerini başlatıldıktan sonra değiştirme yolu sağlar. |
| `show` | Bir öğenin popover'ını ortaya çıkarır. **Popover gerçekten gösterilmeden önce çağırana döner** (yani, `shown.coreui.popover` olayı gerçekleşmeden önce). Bu, popover'ın "manuel" olarak tetiklenmesidir. Başlık ve içerik sıfır uzunluğunda olan popoverlar asla gösterilmez. |
| `toggle` | Bir öğenin popover'ını açar veya kapatır. **Popover gerçekten gösterilmese veya gizlenmeden önce çağırana döner** (yani, `shown.coreui.popover` veya `hidden.coreui.popover` olayı gerçekleşmeden önce). Bu, popover'ın "manuel" olarak tetiklenmesidir. |
| `toggleEnabled` | Bir öğenin popover'ının gösterilmesini veya gizlenmesini açar veya kapatır. |
| `update` | Bir öğenin popover'ının konumunu günceller. |
```js
// getOrCreateInstance örneği
const popover = coreui.Popover.getOrCreateInstance('#example') // Bootstrap popover örneğini döndürür

// setContent örneği
myPopover.setContent({
  '.popover-header': 'başka bir başlık',
  '.popover-body': 'başka bir içerik'
})
```

:::info
`setContent` yöntemi, her bir property-key'in popover şablonundaki geçerli `string` seçici olduğu ve her ilgili property-value'nun `string` | `element` | `function` | `null` olabileceği bir `object` argümanı kabul eder.
:::

### Olaylar


| Olay | Açıklama |
| --- | --- |
| `show.coreui.popover` | Bu olay, `show` örnek yöntem çağrıldığında hemen ateşlenir. |
| `shown.coreui.popover` | Bu olay, popover kullanıcıya görünür hale geldiğinde (CSS geçişlerinin tamamlanmasını bekleyecektir) ateşlenir. |
| `hide.coreui.popover` | Bu olay, `hide` örnek yöntemi çağrıldığında hemen ateşlenir. |
| `hidden.coreui.popover` | Bu olay, popover kullanıcıdan gizlendiğinde (CSS geçişlerinin tamamlanmasını bekleyecektir) ateşlenir. |
| `inserted.coreui.popover` | Bu olay, popover şablonunun DOM'a eklendikten sonra `show.coreui.popover` olayından sonra ateşlenir. |
```js
const myPopoverTrigger = document.getElementById('myPopover')
myPopoverTrigger.addEventListener('hidden.coreui.popover', () => {
  // bir şey yap...
})
```

## Özelleştirme

### CSS değişkenleri

Popoverlar, zamanında özelleştirme için `.popover` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlanır, bu nedenle Sass özelleştirmeleri hala desteklenmektedir.

### SASS değişkenleri

