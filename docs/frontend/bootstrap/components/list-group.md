---
description: Bootstrap Liste Grupları, bir dizi içeriği görüntülemeyi sağlar. Web sitenizde karmaşık liste yapısı oluşturmak için Bootstrap liste grubunu nasıl kullanacağınızı öğrenin.
keywords: [Bootstrap, liste grupları, CSS, web geliştirme, UI bileşenleri]
---

## Temel örnek

Varsayılan liste grubu, uygun CSS sınıflarına sahip bir sıralanmamış listedir. Aşağıdaki seçeneklerle veya gerektiği gibi CSS'inizle bunu genişletebilirsiniz.

  Bir öğe
  İkinci bir öğe
  Üçüncü bir öğe
  Dördüncü bir öğe
  Ve beşinci bir öğe

## Aktif öğeler

Geçerli aktif seçimi göstermek için bir `.list-group-item` öğesine `.active` ekleyin.

  Aktif bir öğe
  İkinci bir öğe
  Üçüncü bir öğe
  Dördüncü bir öğe
  Ve beşinci bir öğe

## Devre dışı öğeler

Bir `.list-group-item` öğesine `.disabled` ekleyerek devre dışı görünmesini sağlayın. `.disabled` olan bazı öğelerin tıklama olaylarını devre dışı bırakmak için özel JavaScript gerektirebileceğini unutmayın (örneğin, bağlantılar).

  Devre dışı bir öğe
  İkinci bir öğe
  Üçüncü bir öğe
  Dördüncü bir öğe
  Ve beşinci bir öğe

## Bağlantılar ve düğmeler

Hover, devre dışı ve aktif durumlarla _etkileşimli_ liste grup öğeleri oluşturmak için `` veya `` kullanın ve `.list-group-item-action` ekleyin. Liste gruplarının, tıklama veya dokunma hissi sağlamaması için bu sahte sınıfları ayırıyoruz.

:::tip
Burada standart `.btn` sınıflarını kullanmamaya dikkat edin.
:::

  
    Geçerli bağlantı öğesi
  
  İkinci bağlantı öğesi
  Üçüncü bağlantı öğesi
  Dördüncü bağlantı öğesi
  Devre dışı bağlantı öğesi

`` ile de `.disabled` sınıfı yerine `disabled` niteliğini kullanabilirsiniz. Ne yazık ki, `` etiketleri devre dışı niteliği desteklemez.

  
    Geçerli düğme
  
  İkinci düğme öğesi
  Üçüncü düğme öğesi
  Dördüncü düğme öğesi
  Devre dışı düğme öğesi

## Flush

Liste grup öğelerini bir üst konteynerde (örneğin, kartlar) kenar-to-kenar şekilde görüntülemek için bazı kenarlıkları ve yuvarlak köşeleri kaldırmak için `.list-group-flush` ekleyin.

  Bir öğe
  İkinci bir öğe
  Üçüncü bir öğe
  Dördüncü bir öğe
  Ve beşinci bir öğe

## Numaralı

Numaralı liste grup öğelerine geçmek için `.list-group-numbered` modifikasyon sınıfını ekleyin (ve isteğe bağlı olarak bir `` öğesi kullanın). Numaralar, listedeki grup öğeleri içindeki daha iyi yerleştirme ve daha iyi özelleştirme sağlar.

Numaralar `` üzerindeki `counter-reset` ile oluşturulur ve ardından `` üzerindeki `::before` sahte element ile `counter-increment` ve `content` ile stil verilir ve yerleştirilir.

  Bir liste öğesi
  Bir liste öğesi
  Bir liste öğesi

Özel içerikle de harika çalışır.

  
    
      Alt başlık
      Liste öğesi için içerik
    
    14
  
  
    
      Alt başlık
      Liste öğesi için içerik
    
    14
  
  
    
      Alt başlık
      Liste öğesi için içerik
    
    14
  

## Yatay

Liste grup öğelerinin düzenini tüm kırılma noktalarında dikeyden yataya değiştirmek için `.list-group-horizontal` ekleyin. Alternatif olarak, yatay bir liste grubunu, o kırılma noktasının `min-width`'inden başlayarak yapmak için `list-group-horizontal-{sm|md|lg|xl|xxl}` yanıt verecek bir varyantı seçin. Şu anda **yatay liste grupları, flush liste grupları ile birleştirilemez.**

:::note
ProTip: Yatayken eşit genişliğe sahip liste grup öğeleri ister misiniz? Her liste grup öğesine `.flex-fill` ekleyin.
:::



{{- range $.Site.Data.breakpoints }}

  Bir öğe
  İkinci bir öğe
  Üçüncü bir öğe

{{- end -}}

## Bağlam sınıfları

Durumlu bir arka plan ve renkle liste öğelerini stil ile süslemek için bağlam sınıflarını kullanın.

  Basit bir varsayılan liste grup öğesi

{{- range (index $.Site.Data "theme-colors") }}
  Basit bir {{ .name }} liste grup öğesi
{{- end -}}
Bağlam sınıfları ayrıca `.list-group-item-action` ile de çalışır. Önceki örnekte mevcut olmayan hover stillerinin eklenmesi ile dikkat edin. Ayrıca `active` durumu da desteklenir; bağlamlı liste grup öğesinde aktif bir seçimi belirtmek için uygulanabilir.

  Basit bir varsayılan liste grup öğesi

{{- range (index $.Site.Data "theme-colors") }}
  Basit bir {{ .name }} liste grup öğesi
{{- end -}}


## Rozetlerle

Okunmamış sayım, aktivite ve daha fazlasını göstermek için herhangi bir liste grup öğesine rozetler ekleyin, bazı `yardımcı programlar` yardımıyla.

  
    Bir liste öğesi
    14
  
  
    İkinci bir liste öğesi
    2
  
  
    Üçüncü bir liste öğesi
    1
  

## Özelleştirilmiş içerik

Bağlantılı liste grubu gibi, neredeyse her HTML içeriğini ekleyebilirsiniz. Bunu `flexbox yardımcı programları` yardımıyla yapabilirsiniz.

  
    
      Liste grup öğesi başlığı
      3 gün önce
    
    Bir paragraftaki bazı yer tutucu içerikler.
    Ve bazı küçük yazılar.
  
  
    
      Liste grup öğesi başlığı
      3 gün önce
    
    Bir paragraftaki bazı yer tutucu içerikler.
    Ve bazı soluk küçük yazılar.
  
  
    
      Liste grup öğesi başlığı
      3 gün önce
    
    Bir paragraftaki bazı yer tutucu içerikler.
    Ve bazı soluk küçük yazılar.
  

## Checkbox ve radyo düğmeleri

CoreUI for Bootstrap'ın checkbox ve radyo düğmelerini liste grup öğeleri içinde yerleştirebilir ve gerektiği gibi özelleştirebilirsiniz. Onları `` olmadan kullanabilirsiniz, ancak lütfen erişilebilirlik için bir `aria-label` niteliği ve değeri eklemeyi unutmayın.

  
    
    İlk onay kutusu
  
  
    
    İkinci onay kutusu
  
  
    
    Üçüncü onay kutusu
  
  
    
    Dördüncü onay kutusu
  
  
    
    Beşinci onay kutusu
  

Ve geniş tıklama alanları için ``'leri `.list-group-item` olarak kullanmak isterseniz, bunu da yapabilirsiniz.

  
    
    İlk onay kutusu
  
  
    
    İkinci onay kutusu
  
  
    
    Üçüncü onay kutusu
  
  
    
    Dördüncü onay kutusu
  
  
    
    Beşinci onay kutusu
  

## JavaScript davranışı

Liste grubumuzu, yerel içeriklerin sekme panellerini oluşturmak için tab JavaScript eklentisini kullanabilirsiniz—bunu bireysel olarak veya derlenmiş `coreui.js` dosyası aracılığıyla ekleyin.


  
    
      
        Ana Sayfa
        Profil
        Mesajlar
        Ayarlar
      
    
    
      
        
          "Ana Sayfa" ile ilgili bir paragrafta bazı yer tutucu içerikler. Burada dolgu ve bu sekme panelini doldurmak için daha fazla içerik kullanılır. Üretimde, burada elbette daha gerçek içerikleriniz olacaktı. Ve sadece metin değil, gerçekten her şey olabilir. Metin, görseller, formlar.
        
        
          "Profil" ile ilgili bir paragrafta bazı yer tutucu içerikler. Burada dolgu ve bu sekme panelini doldurmak için daha fazla içerik kullanılır. Üretimde, burada elbette daha gerçek içerikleriniz olacaktı. Ve sadece metin değil, gerçekten her şey olabilir. Metin, görseller, formlar.
        
        
          "Mesajlar" ile ilgili bir paragrafta bazı yer tutucu içerikler. Burada dolgu ve bu sekme panelini doldurmak için daha fazla içerik kullanılır. Üretimde, burada elbette daha gerçek içerikleriniz olacaktı. Ve sadece metin değil, gerçekten her şey olabilir. Metin, görseller, formlar.
        
        
          "Ayarlar" ile ilgili bir paragrafta bazı yer tutucu içerikler. Burada dolgu ve bu sekme panelini doldurmak için daha fazla içerik kullanılır. Üretimde, burada elbette daha gerçek içerikleriniz olacaktı. Ve sadece metin değil, gerçekten her şey olabilir. Metin, görseller, formlar.
        
      
    
  


```html
<div class="row">
  <div class="col-4">
    <div class="list-group" id="list-tab" role="tablist">
      <a class="list-group-item list-group-item-action active" id="list-home-list" data-coreui-toggle="list" href="#list-home" role="tab" aria-controls="list-home">Ana Sayfa</a>
      <a class="list-group-item list-group-item-action" id="list-profile-list" data-coreui-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">Profil</a>
      <a class="list-group-item list-group-item-action" id="list-messages-list" data-coreui-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages">Mesajlar</a>
      <a class="list-group-item list-group-item-action" id="list-settings-list" data-coreui-toggle="list" href="#list-settings" role="tab" aria-controls="list-settings">Ayarlar</a>
    </div>
  </div>
  <div class="col-8">
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="list-home" role="tabpanel" aria-labelledby="list-home-list">...</div>
      <div class="tab-pane fade" id="list-profile" role="tabpanel">...</div>
      <div class="tab-pane fade" id="list-messages" role="tabpanel">...</div>
      <div class="tab-pane fade" id="list-settings" role="tabpanel">...</div>
    </div>
  </div>
</div>
```

### Veri niteliklerini kullanma

Herhangi bir JavaScript yazmadan bir liste grubu navigasyonunu etkinleştirebilirsiniz; bunu sadece `data-coreui-toggle="list"` belirterek yapabilirsiniz. Bu veri niteliklerini `.list-group-item` üzerine kullanın.

```html
<div role="tabpanel">
  <!-- Liste grubu -->
  <div class="list-group" id="myList" role="tablist">
    <a class="list-group-item list-group-item-action active" data-coreui-toggle="list" href="#home" role="tab">Ana Sayfa</a>
    <a class="list-group-item list-group-item-action" data-coreui-toggle="list" href="#profile" role="tab">Profil</a>
    <a class="list-group-item list-group-item-action" data-coreui-toggle="list" href="#messages" role="tab">Mesajlar</a>
    <a class="list-group-item list-group-item-action" data-coreui-toggle="list" href="#settings" role="tab">Ayarlar</a>
  </div>

  <!-- Sekme panelleri -->
  <div class="tab-content">
    <div class="tab-pane active" id="home" role="tabpanel">...</div>
    <div class="tab-pane" id="profile" role="tabpanel">...</div>
    <div class="tab-pane" id="messages" role="tabpanel">...</div>
    <div class="tab-pane" id="settings" role="tabpanel">...</div>
  </div>
</div>
```

### JavaScript ile

Bir liste öğesini JavaScript aracılığıyla (her liste öğesi tekil olarak etkinleştirilmeli) etkinleştirin:

```js
const triggerTabList = document.querySelectorAll('#myTab a')
triggerTabList.forEach(triggerEl => {
  const tabTrigger = new coreui.Tab(triggerEl)

  triggerEl.addEventListener('click', event => {
    event.preventDefault()
    tabTrigger.show()
  })
})
```

Bireysel liste öğelerini birkaç şekilde etkinleştirebilirsiniz:

```js
const triggerEl = document.querySelector('#myTab a[href="#profile"]')
coreui.Tab.getInstance(triggerEl).show() // İsimle sekmeyi seç

const triggerFirstTabEl = document.querySelector('#myTab li:first-child a')
coreui.Tab.getInstance(triggerFirstTabEl).show() // İlk sekmeyi seç
```

### Fade efekti

Sekme panellerinin fade efektine sahip olması için, her `.tab-pane`'ye `.fade` ekleyin. İlk sekme panelinin de başlangıç içeriğini görünür kılmak için `.show` olması gerekir.

```html
<div class="tab-content">
  <div class="tab-pane fade show active" id="home" role="tabpanel">...</div>
  <div class="tab-pane fade" id="profile" role="tabpanel">...</div>
  <div class="tab-pane fade" id="messages" role="tabpanel">...</div>
  <div class="tab-pane fade" id="settings" role="tabpanel">...</div>
</div>
```

### Yöntemler

#### constructor



İçeriğinizi bir sekme elementi olarak etkinleştirir.

Örneğin, constructor ile bir sekme örneği oluşturabilirsiniz:

```js
const cuiTab = new coreui.Tab('#myTab')
```


| Yöntem | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin sekmesini yok eder. |
| `getInstance` | *Statik* yöntemdir; bir DOM öğesine bağlı sekme örneğini almanızı sağlar, bunu şöyle kullanabilirsiniz: `coreui.Tab.getInstance(element)`. |
| `getOrCreateInstance` | *Statik* metoddur; DOM öğesine bağlı sekme örneğini almanızı veya başlatılmadıysa yenisini oluşturmanızı sağlar, bunu şöyle kullanabilirsiniz: `coreui.Tab.getOrCreateInstance(element)`. |
| `show` | Verilen liste öğesini seçer ve ilgili panelini gösterir. Daha önce seçilmiş diğer liste öğesi unselected olur ve ilgili paneli gizlenir. **Sekme paneli gösterilmeden çağıran tarafa döner** (örneğin, `shown.coreui.tab` olayı gerçekleşmeden). |
---
description: Bu belge, CoreUI sekme olaylarının tetikleme sırasını ve özelleştirme seçeneklerini açıklamaktadır. CSS ve SASS değişkenleri ile miksinlerinin kullanımı hakkında bilgiler içermektedir.
keywords: [CoreUI, sekme olayları, özelleştirme, CSS değişkenleri, SASS, miksinler, list group]
---

### Etkinlikler

Yeni bir sekme gösterildiğinde, olaylar şu sırayla tetiklenir:

1. `hide.coreui.tab` (mevcut aktif sekmede)
2. `show.coreui.tab` (gösterilecek sekmede)
3. `hidden.coreui.tab` (önceki aktif sekmede, `hide.coreui.tab` olayı ile aynı olan)
4. `shown.coreui.tab` (yeni aktif olan ve gösterilen sekmede, `show.coreui.tab` olayı ile aynı olan)

:::info
Eğer daha önce aktif bir sekme yoksa, `hide.coreui.tab` ve `hidden.coreui.tab` olayları tetiklenmeyecektir.
:::


| Olay türü | Açıklama |
| --- | --- |
| `hide.coreui.tab` | Bu olay, yeni bir sekmenin gösterilmesi gerektiğinde tetiklenir (ve böylece önceki aktif sekme gizlenir). Mevcut aktif sekmeyi ve yeni aktif olacak sekmeyi hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
| `hidden.coreui.tab` | Bu olay, yeni bir sekme gösterildikten sonra tetiklenir (ve böylece önceki aktif sekme gizlenir). Önceki aktif sekmeyi ve yeni aktif sekmeyi hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
| `show.coreui.tab` | Bu olay sekme gösterme sırasında tetiklenir, ancak yeni sekme henüz gösterilmeden önce. Aktif sekmeyi ve önceki aktif sekmeyi (varsa) hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
| `shown.coreui.tab` | Bu olay sekme gösterme sırasında, bir sekme gösterildikten sonra tetiklenir. Aktif sekmeyi ve önceki aktif sekmeyi (varsa) hedeflemek için `event.target` ve `event.relatedTarget` kullanın. |
> *Önemli Not:* `event.target`, yeni aktif sekmeyi; `event.relatedTarget`, önceki aktif sekmeyi temsil eder.  
> — CoreUI Olayları

```js
const tabElms = document.querySelectorAll('a[data-coreui-toggle="list"]')
tabElms.forEach(tabElm => {
  tabElm.addEventListener('shown.coreui.tab', event => {
    event.target // yeni aktif sekme
    event.relatedTarget // önceki aktif sekme
  })
})
```

---

## Özelleştirme

### CSS değişkenleri

Liste grupları, gerçek zamanlı özelleştirme için `.list-group` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenlerinin değerleri Sass aracılığıyla ayarlanır, dolayısıyla Sass özelleştirmesi de desteklenir.

### SASS değişkenleri

### SASS miksinleri

`.list-group-item`lar için `bağlamsal varyant sınıflarını` oluşturmak üzere `$theme-colors` ile birlikte kullanılır.

### SASS döngüsü

`list-group-item-variant()` miksinini kullanarak modifiyer sınıflarını oluşturan döngü.

