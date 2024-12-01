---
description: CSS ve JavaScript kullanarak CSS3 için animasyonlar ve yerel title saklama için data-coreui-attributes ile özel Bootstrap araç ipuçları ekleme belgeleri ve örnekleri.
keywords: [Bootstrap, Tooltip, CSS, JavaScript, Animation, Customization, User Interface]
---

## Genel Bakış

Araç ipucu eklentisini kullanırken bilinmesi gerekenler:

- Araç ipuçları, konumlandırma için 3. taraf kütüphane [Popper](https://popper.js.org/) üzerine bağımlıdır. Araç ipuçlarının çalışabilmesi için coreui.js'den önce `popper.min.js` dahil etmelisiniz veya içinde Popper bulunan `coreui.bundle.min.js` / `coreui.bundle.js` kullanmalısınız!
- Performans nedenleriyle, araç ipuçları opt-in'dir, bu yüzden **kendiniz başlatmalısınız**.
- Uzunluğu sıfır olan başlıklar içeren araç ipuçları asla görüntülenmez.
- Daha karmaşık bileşenlerde (girdi gruplarımız, buton grupları vb. gibi) render sorunlarını önlemek için `container: 'body'` belirtin.
- Gizli öğelerde araç ipuçları tetiklenmeyecektir.
- `.disabled` veya `disabled` öğeleri için araç ipuçları, bir sarmalayıcı öğe üzerinde tetiklenmelidir.
- Birden fazla satıra yayılan hyperlinklerden tetiklendiğinde, araç ipuçları ortalanacaktır. Bu davranışı önlemek için `` öğelerinizde `white-space: nowrap;` kullanın.
- Araç ipuçları, karşılık gelen öğeleri DOM'dan kaldırılmadan önce gizlenmelidir.
- Araç ipuçları, bir gölge DOM içindeki bir öğe sayesinde tetiklenebilir.

:::info
Araç ipuçları ile ilgili ileride bilgi verilmesi gereken durumlar hakkında dikkat edilmesi gerekenler bulunmaktadır.
:::

:::tip
Unutmayın, araç ipuçlarının kullanımını özelleştirmek için birçok CSS değişkeni ve JavaScript seçenekleri mevcuttur.
:::

Hepsini anladınız mı? Harika, şimdi onların nasıl çalıştığını bazı örneklerle görelim.

## Örnekler

### Araç ipuçlarını etkinleştirin

Bir sayfadaki tüm araç ipuçlarını başlatmanın bir yolu, `data-coreui-toggle` niteliğine göre seçmektir:

```js
const tooltipTriggerList = document.querySelectorAll('[data-coreui-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new coreui.Tooltip(tooltipTriggerEl))
```

### Bağlantılardaki araç ipuçları

Aşağıdaki bağlantılara üzerine gelerek araç ipuçlarını görebilirsiniz:


  Araç ipuçları ile bazı satır içi bağlantılar göstermek için yer tutucu metin. Bu artık sadece dolgu, etkileyici değil. Buraya yerleştirilen içerik sadece gerçek metnin varlığını taklit etmek için. Ve tüm bunlar, araç ipuçlarının gerçek dünya durumlarında nasıl görüneceğine dair bir fikir vermek içindi. Umarım artık bu araç ipuçlarının bağlantılarda pratikte nasıl çalıştığını görmüşsünüzdür, kendi web siteniz veya projeniz üzerinde kullandığınızda.
  


:::warning
Araç ipuçlarının çalışabilmesi için dikkatli olmalısınız; `data-bs-title` ve `title` arasında çelişkili durumlar oluşmamalıdır.
:::

### Özel araç ipuçları

Araç ipuçlarının görünümünü `CSS değişkenleri` kullanarak özelleştirebilirsiniz. Özel görünümümüzü kapsamlamak için `data-coreui-custom-class="custom-tooltip"` ile özel bir sınıf ayarladı ve bunu yerel bir CSS değişkenini geçersiz kılmak için kullandık.

  Özel araç ipucu

### Yönler

Aşağıdaki butonlara üzerine gelerek dört araç ipucu yönünü görebilirsiniz: üst, sağ, alt ve sol. CoreUI kullanırken yönler ayna şeklinde yansıtılır.


  
    Üstteki araç ipucu
    Sağdaki araç ipucu
    Alttaki araç ipucu
    Soldaki araç ipucu
    Araç ipucu için HTML">HTML ile araç ipucu
  


```html
<button type="button" class="btn btn-secondary" data-coreui-toggle="tooltip" data-coreui-placement="top" title="Üstteki araç ipucu">
  Üstteki araç ipucu
</button>
<button type="button" class="btn btn-secondary" data-coreui-toggle="tooltip" data-coreui-placement="right" title="Sağdaki araç ipucu">
  Sağdaki araç ipucu
</button>
<button type="button" class="btn btn-secondary" data-coreui-toggle="tooltip" data-coreui-placement="bottom" title="Alttaki araç ipucu">
  Alttaki araç ipucu
</button>
<button type="button" class="btn btn-secondary" data-coreui-toggle="tooltip" data-coreui-placement="left" title="Soldaki araç ipucu">
  Soldaki araç ipucu
</button>
```

Ve eklenmiş özel HTML ile:

```html
<button type="button" class="btn btn-secondary" data-coreui-toggle="tooltip" data-coreui-html="true" title="<em>Araç ipucu</em> <u>için</u> <b>HTML</b>">
  HTML ile araç ipucu
</button>
```

Bir SVG ile:


  
    
      
      
    
  


## Kullanım

Araç ipucu eklentisi içerik ve işaretleme oluşturur ve varsayılan olarak araç ipuçlarını tetikleyici öğelerinin arkasına yerleştirir.

JavaScript ile araç ipucunu tetikleyin:

```js
const exampleEl = document.getElementById('example')
const tooltip = new coreui.Tooltip(exampleEl, options)
```

:::warning
##### Overflow `auto` ve `scroll`

Araç ipucu konumu, bir **üst öğe** `overflow: auto` veya `overflow: scroll` gibi olduğunda otomatik olarak değişmeyi dener, ancak yine de orijinal yerleştirmenin konumlandırmasını korur. Bunun çözümü için, varsayılan değeri, `'clippingParents'` olan [`boundary` seçeneği](https://popper.js.org/docs/v2/modifiers/flip/#boundary) için herhangi bir HTMLElement ayarlayın:

```js
const tooltip = new coreui.Tooltip('#example', {
  boundary: document.body // veya document.querySelector('#boundary')
})
```
:::

### İşaretleme

Bir araç ipucu için gerekli işaretleme, araç ipucunun olmasını istediğiniz HTML öğesinde yalnızca bir `data` niteliği ve `title` içermektedir. Bir araç ipucunun oluşturulan işaretlemesi oldukça basittir, ancak konumlandırma gerektirir (varsayılan olarak, eklenti tarafından `top` olarak ayarlanmıştır).

:::warning
##### Araç ipuçlarının klavye ve yardımcı teknoloji kullanıcıları için çalışır hâle getirilmesi

Araç ipuçlarını yalnızca geleneksel olarak klavye ile odaklanabilir ve etkileşimli olan HTML öğelerine eklemelisiniz (örneğin bağlantılar veya form kontrolleri). Arbitary HTML öğeleri (örneğin ``ler), `tabindex="0"` özelliğini ekleyerek odaklanabilir hâle getirilebilir, ancak bu kullanıcıların non-interaktif öğelerde potansiyel olarak rahatsız edici ve kafa karıştırıcı sekme durakları eklemesi anlamına gelir ve şu anda çoğu yardımcı teknoloji bu durumda araç ipucunu duyurmaz. Ayrıca, araç ipucunuza yalnızca `hover` ile tetiklenmesine güvenmeyin, çünkü bu klavye kullanıcıları için araç ipuçlarınızı tetiklemek imkânsız hale getirir.
:::

```html
<!-- Yazılması gereken HTML -->
<a href="#" data-coreui-toggle="tooltip" title="Bazı araç ipucu metni!">Üzerine gelin bana</a>

<!-- Eklenti tarafından üretilen işaretleme -->
<div class="tooltip bs-tooltip-auto" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Bazı araç ipucu metni!
  </div>
</div>
```

### Devre dışı öğeler

`disabled` niteliğine sahip öğeler etkileşimli değildir, bu da kullanıcıların bunlara odaklanamayacağı, üzerine gelemeyeceği veya tıklayamayacağı anlamına gelir. Bir çözüm olarak, aracı ipucunu bir sarmalayıcı `` veya `` üzerinden tetiklemek isteyeceksiniz, tercihen `tabindex="0"` kullanarak klavye ile odaklanabilir hâle getirilmelidir.


  Devre dışı buton


### Seçenekler



:::warning
Güvenlik nedenleriyle `sanitize`, `sanitizeFn` ve `allowList` seçenekleri veri niteleri ile sağlanamaz.
:::


| İsim | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `animation` | boolean | `true` | Araç ipucuna CSS geçişi uygulayın |
| `container` | string, element, false | `false` | Araç ipucunu belirli bir öğeye ekler. Örnek: `container: 'body'`. Bu seçenek, aracın ipucunu tetikleyici öğeye yakın bir belgenin akışında konumlandırmanıza olanak tanır - bu, araç ipucunun pencere yeniden boyutlandırma sırasında tetikleyici öğeden uzakta hareket etmesini önler. |
| `delay` | number, object | `0` | Araç ipucunun gösterilmesi ve gizlenmesi için gecikme (ms) - manuel tetikleme türüne uygulanmaz. Bir sayı sağlanırsa, gecikme hem gizle/göster için uygulanır. Obje yapısı: `delay: { "show": 500, "hide": 100 }`. |
| `html` | boolean | `false` | Araç ipucunda HTML'e izin ver. Eğer true ise, araç ipucunun `title` içindeki HTML etiketleri araç ipucunda işlenecektir. Eğer false ise, `innerText` özelliği DOM'a içerik eklemek için kullanılacaktır. Eğer XSS saldırıları konusunda endişeniz varsa metin kullanın. |
| `placement` | string, function | `'top'` | Araç ipucunun konumlandırma yöntemi: auto, top, bottom, left, right. `auto` belirtildiğinde, araç ipucu dinamik olarak yeniden yönlendirilecektir. Bir fonksiyon kullanıldığında, konumu belirlemek için, araç ipucu DOM düğümünü ilk argüman olarak ve tetikleyici öğe DOM düğümünü ikinci argüman olarak geçirilen fonksiyon olarak çağrılır. `this` bağlamı araç ipucu örneğine ayarlanır. |
| `selector` | string, false | `false` | Eğer bir seçimci sağlanırsa, araç ipucu nesneleri belirtilen hedeflere devredilecektir. Uygulamada, bu aynı zamanda dinamik olarak eklenen DOM öğelerine araç ipuçlarını uygulamak için kullanılır (`jQuery.on` desteği). [Bu sorun](https://github.com/coreui/coreui/issues/4215) ve [bilgilendirici bir örnek](https://codepen.io/Johann-S/pen/djJYPb) için bakın. **Not**: `title` niteliği bir seçimci olarak kullanılmamalıdır. |
| `template` | string | `''` | Araç ipucunu oluştururken kullanılacak temel HTML. Araç ipucunun `title`'ı `.tooltip-inner` içine enjekte edilecektir. `.tooltip-arrow`, araç ipucunun oku olacaktır. En dıştaki sarmalayıcı öğenin `.tooltip` sınıfına ve `role="tooltip"` niteliğine sahip olması gerekir. |
| `title` | string, element, function | `''` | `title` niteliği yoksa varsayılan başlık değeri. Eğer bir fonksiyon verilirse, bu araç ipucunun bağlanmış olduğu öğeye `this` referansı ile çağrılır. |
| `customClass` | string, function | `''` | Araç ipucu gösterildiğinde sınıflar ekler. Bu sınıfların, şablonde belirtilen sınıflara ek olarak ekleneceğini unutmayın. Birden fazla sınıf eklemek için boşlukla ayırabilirsiniz: `'class-1 class-2'`. Ayrıca, ek sınıf adlarını içeren tek bir dize döndürmesi gereken bir fonksiyon da geçebilirsiniz. |
| `trigger` | string | `'hover focus'` | Araç ipucunun nasıl tetikleneceği: click, hover, focus, manual. Birden fazla tetikleyici geçebilirsiniz; bunları boşlukla ayırın. `'manual'`, araç ipucunun `.tooltip('show')`, `.tooltip('hide')` ve `.tooltip('toggle')` yöntemleri aracılığıyla programlı olarak tetiklendiğini belirtir; bu değer başka bir tetikleyici ile birleştirilemez. `'hover'` kendi başına klavyeyle tetiklenemeyen araç ipuçlarıyla sonuçlanabilir ve bunun için klavye kullanıcıları için aynı bilgilendirmeyi ileten alternatif yöntemlerin mevcut olduğundan emin olunmalıdır. |
| `offset` | array, string, function | `[0, 6]` | Araç ipucunun hedefine göre ofseti. Veri niteliklerinde virgülle ayrılmış değer içeren bir dize (örn: `data-coreui-offset="10,20"`) geçebilirsiniz. Bir fonksiyon kullanıldığında, ofseti belirlemek için, popper yerleştirmenin, referansın ve popper dikdörtgenlerinin içerdiği bir nesne ile ilk argüman olarak çağrılır. İkinci argüman olarak tetikleyici öğe DOM düğümü geçilir. Fonksiyon, iki sayıdan oluşan bir dizi döndürmelidir: [skidding](https://popper.js.org/docs/v2/modifiers/offset/#skidding-1), [distance](https://popper.js.org/docs/v2/modifiers/offset/#distance-1). Daha fazla bilgi için Popper'ın [ofset belgelerine](https://popper.js.org/docs/v2/modifiers/offset/#options) bakın. |
| `fallbackPlacements` | string, array | `['top', 'right', 'bottom', 'left']` | Tercih sırasına göre bir dizi içinde yedek yerleştirmeleri tanımlayın. Daha fazla bilgi için Popper'ın [davranış belgelerine](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) bakın. |
| `boundary` | string, element | `'clippingParents'` | Araç ipucunun overflow sınırlama sınırı (yalnızca Popper'ın preventOverflow modifikasyonuna uygulanır). Varsayılan olarak, `'clippingParents'`'dır ve bir HTMLElement referansı alabilir (sadece JavaScript aracılığıyla). Daha fazla bilgi için Popper'ın [detectOverflow belgelerine](https://popper.js.org/docs/v2/utils/detect-overflow/#boundary) bakın. |
| `sanitize` | boolean | `true` | Sanitizasyonun etkinleştirilip etkinleştirilmeyeceğini belirleyin. Eğer etkinleştirilirse `'template'`, `'content'` ve `'title'` seçenekleri sanitize edilecektir. |
| `allowList` | object | `Varsayılan değer` | İzin verilen nitelikler ve etiketleri içeren nesne. |
| `sanitizeFn` | null, function | `null` | Burada kendi sanitize fonksiyonunuzu verebilirsiniz. Bu, sanitizasyonu gerçekleştirmek için özel bir kütüphane kullanmayı tercih ediyorsanız yararlı olabilir. |
| `popperConfig` | null, object, function | `null` | CoreUI için Bootstrap'ın varsayılan Popper yapılandırmasını değiştirmek için, [Popper yapılandırmasına](https://popper.js.org/docs/v2/constructors/#options) bakın. Bir fonksiyon kullanıldığında, bu Popper yapılandırmasını oluşturmak için, CoreUI için Bootstrap'ın varsayılan Popper yapılandırmasını içeren bir nesne ile çağrılır. Varsayılanı kendi yapılandırmanızla birleştirip kullanmanızı yardımcı olur. Fonksiyon, Popper için bir yapılandırma nesnesi döndürmelidir.|
:::info
#### Bireysel araç ipuçları için veri nitelikleri

Bireysel araç ipuçları için seçenekler, yukarıda açıklandığı gibi veri nitelikleri aracılığıyla da belirtilebilir.
:::

#### `popperConfig` ile fonksiyonu kullanma

```js
const tooltip = new coreui.Tooltip(element, {
  popperConfig(defaultBsPopperConfig) {
    // const newPopperConfig = {...}
    // gerekirse defaultBsPopperConfig'i kullanın...
    // yeniPopperConfig'i döndürün
  }
})
```

### Yöntemler

:::danger

:::


| Yöntem | Açıklama |
| --- | --- |
| `show` | Bir öğenin araç ipucunu açar. **Araç ipucu gerçekten gösterilmeden önce çağrı yaparcı döner** (yani `shown.coreui.tooltip` olayı gerçekleşmeden önce). Bu "manuel" bir araç ipucu tetiklenmesidir. Uzunluğu sıfır olan araç ipuçları asla görüntülenmez. |
| `hide` | Bir öğenin araç ipucunu gizler. **Araç ipucu gerçekten gizlenmeden önce çağrı yaparcı döner** (yani `hidden.coreui.tooltip` olayı gerçekleşmeden önce). Bu "manuel" bir araç ipucu tetiklenmesidir. |
| `toggle` | Bir öğenin araç ipucunu açıp kapatır. **Araç ipucu gerçekten gösterilmeden veya gizlenmeden önce çağrı yaparcı döner** (yani `shown.coreui.tooltip` veya `hidden.coreui.tooltip` olayı gerçekleşmeden önce). Bu "manuel" bir araç ipucu tetiklenmesidir. |
| `dispose` | Bir öğenin araç ipucunu gizler ve yok eder (DOM öğesinde depolanan verileri kaldırır). Delegasyon kullanan araç ipuçları (seçimci seçeneği kullanılarak oluşturulan) alt öğe tetikleyicileri üzerinde bireysel olarak yok edilemez. |
| `enable` | Bir öğenin araç ipucunun gösterilme yeteneğini sağlar. **Araç ipuçları varsayılan olarak etkindir.** |
| `disable` | Bir öğenin araç ipucunun gösterilme yeteneğini ortadan kaldırır. Araç ipucu yalnızca yeniden etkinleştirilirse gösterilebilir. |
| `setContent` | Araç ipucunun içeriğini başlatıldıktan sonra değiştirme yolu sağlar. |
| `toggleEnabled` | Bir öğenin araç ipucunun gösterilip gizlenme yeteneğini açıp kapatır. |
| `update` | Bir öğenin araç ipucunun konumunu günceller. |
| `getInstance` | *Statik* yöntem, bir DOM öğesine bağlı araç ipucu örneğini almanızı veya başlatılmamışsa yeni bir tane oluşturmanızı sağlar. |
| `getOrCreateInstance` | *Statik* yöntem, bir DOM öğesine bağlı araç ipucu örneğini almanızı veya başlatılmamışsa yeni bir tane oluşturmanızı sağlar. |
```js
const tooltip = coreui.Tooltip.getInstance('#example') // Bir Bootstrap araç ipucu örneğini döndürür

// setContent örneği
tooltip.setContent({ '.tooltip-inner': 'başka bir başlık' })
```

:::info
`setContent` yöntemi, her özellik anahtarının geçerli bir `string` seçici olduğu, her ilgili özellik değerinin `string` | `element` | `function` | `null` olduğu bir `object` argümanı kabul eder.
:::

### Olaylar


| Olay | Açıklama |
| --- | --- |
| `show.coreui.tooltip` | Bu olay, `show` örnek yöntemine çağrıldığında hemen ateşlenir. |
| `shown.coreui.tooltip` | Bu olay, araç ipucunun kullanıcıya görünür hale geldiğinde (CSS geçişlerinin tamamlanmasını bekleyecek) ateşlenir. |
| `hide.coreui.tooltip` | Bu olay, `hide` örnek yöntemi çağrıldığında hemen ateşlenir. |
| `hidden.coreui.tooltip` | Bu olay, araç ipucunun kullanıcıdan gizlendikten sonra (CSS geçişlerinin tamamlanmasını bekleyecek) ateşlenir. |
| `inserted.coreui.tooltip` | Bu olay, araç ipucu şablonunun DOM'a eklendikten sonra `show.coreui.tooltip` olayından sonra ateşlenir. |
```js
const myTooltipEl = document.getElementById('myTooltip')
const tooltip = coreui.Tooltip.getOrCreateInstance(myTooltipEl)

myTooltipEl.addEventListener('hidden.coreui.tooltip', () => {
  // bir şey yap...
})

tooltip.hide()
```

## Özelleştirme

### CSS değişkenleri

Araç ipuçları, gerçek zamanlı özelleştirmeyi artırmak için `.tooltip` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass aracılığıyla ayarlanır, böylece Sass özelleştirmesi de desteklenir.

### SASS Değişkenleri

