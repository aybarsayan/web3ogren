---
description: Bootstrap çöküş bileşeni, projeniz boyunca içerik görünürlüğünü birkaç sınıf ve bazı betikler ile değiştirmeyi sağlar. Büyük miktardaki içerik için faydalıdır.
keywords: [Bootstrap, çöküş, JavaScript, erişilebilirlik, CSS, kullanıcı arayüzü, bileşenler]
layout: docs
title: Çöküş
group: components
aliases:
  - "/components/bootstrap/collapse/"
toc: true
bootstrap: true
other_frameworks: collapse
---

## Nasıl çalışır

Çöküş JavaScript eklentisi, içeriği göstermek ve gizlemek için kullanılır. Düğmeler veya bağlantılar, belirli unsurları tetiklemek için kullanılır. Bir öğeyi çökertmek, `yükseklik` değerini mevcut değerinden `0`'a animasyonla geçirecektir. **CSS'nin animasyonları nasıl işlediği göz önüne alındığında,** `.collapse` öğesi üzerinde `padding` kullanamazsınız. Bunun yerine, sınıfı bağımsız bir sarmalayıcı öğe olarak kullanın.

:::info
Bu bileşen, kullanıcılara içerik gösteriminde büyük esneklik sağlar.
:::

## Örnek

Aşağıdaki düğmelere tıklayarak başka bir öğeyi sınıf değişiklikleri ile gösterip gizleyebilirsiniz:

- `.collapse` içeriği gizler
- `.collapsing` geçiş sırasında uygulanır
- `.collapse.show` içeriği gösterir

`href` özniteliği olan bir bağlantı veya `data-coreui-target` özniteliği olan bir düğme kullanabilirsiniz. Her iki örnekte de `data-coreui-toggle="collapse"` gereklidir.

  
    Bağlantı ile href
  
  
    data-coreui-target ile buton
  


  
    Çöküş bileşeni için bazı yer tutucu içerikler. Bu panel varsayılan olarak gizlidir ancak kullanıcı ilgili tetikleyiciyi aktifleştirdiğinde açılır.
  

## Yatay

Çöküş eklentisi aynı zamanda yatay çöküşü destekler. `width` için geçiş yapmak üzere `.collapse-horizontal` değiştirme sınıfını ekleyin ve doğrudan çocuk öğeye bir `width` ayarlayın. Kendi özel Sass'ınızı yazabilir, satır içi stiller kullanabilir veya `genişlik yardımcılarımızı` kullanabilirsiniz.

:::info
Lütfen aşağıdaki örnekte, belgelerimizde aşırı yeniden boyama önlemek için `min-height` ayarlandığına dikkat edin. **Bu kesinlikle gerekli değildir.** **Sadece çocuk öğedeki `width` gereklidir.**
:::

  
    Genişlik çöküşünü değiştir
  


  
    
      Bu yatay çöküş için bazı yer tutucu içeriklerdir. Varsayılan olarak gizlidir ve tetiklendiğinde gösterilir.
    
  

## Birden fazla hedef

Bir `` veya ``, `href` veya `data-coreui-target` özniteliği ile bir seçici ile referans göstererek birden fazla öğeyi gösterebilir ve gizleyebilir. Birden fazla `` veya ``, her biri `href` veya `data-coreui-target` özniteliği ile referans gösteriyorsa bir öğeyi gösterebilir ve gizleyebilir.

  İlk öğeyi değiştir
  İkinci öğeyi değiştir
  Her iki öğeyi değiştir


  
    
      
        Bu çoklu çöküş örneğinin ilk çöküş bileşeni için bazı yer tutucu içerikler. Bu panel varsayılan olarak gizlidir ancak kullanıcı ilgili tetikleyiciyi aktifleştirdiğinde açılır.
      
    
  
  
    
      
        Bu çoklu çöküş örneğinin ikinci çöküş bileşeni için bazı yer tutucu içerikler. Bu panel varsayılan olarak gizlidir ancak kullanıcı ilgili tetikleyiciyi aktifleştirdiğinde açılır.
      
    
  

## Erişilebilirlik

Kontrol bileşenine `aria-expanded` eklediğinizden emin olun. Bu öznitelik, ekran okuyuculara ve ilgili yardımcı teknolojilere kontrol ile bağlantılı çökertilebilir öğenin mevcut durumunu açıkça gönderir. Eğer çökertilebilir kısım varsayılan olarak kapalıysa, kontrol öğesindeki öznitelik `aria-expanded="false"` değerine sahip olmalıdır. Eğer çökertilebilir öğeyi varsayılan olarak açık yapmak için `show` sınıfını kullanıyorsanız, kontrol kısmına `aria-expanded="true"` ayarlamalısınız. **Eklenti, çökertilebilir öğenin açılıp açılmadığına bağlı olarak bu özniteliği otomatik olarak kontrol üzerinde değiştirecektir.** (JavaScript aracılığıyla veya kullanıcı başka bir kontrol elemanını aktifleştirdiğinde de olsa). Kontrol öğesinin HTML elemanı bir buton değilse (örneğin, bir `` veya ``), özniteliğe `role="button"` eklenmelidir.

Eğer kontrol öğeniz tek bir çökertilebilir öğeyi hedefliyorsa - yani, `data-coreui-target` özniteliği bir `id` seçicisine işaret ediyorsa - `aria-controls` özniteliğini kontrol kısmına eklemelisiniz. Modern ekran okuyucuları ve ilgili yardımcı teknolojiler, kullanıcılara çökertilebilir öğeye doğrudan gitmek için ekstra kısayollar sağlamak amacıyla bu özniteliği kullanır.

> **CoreUI'nin Bootstrap için mevcut uygulaması,** [WAI-ARIA Yazar Pratikleri 1.1 akordiyon modeli](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion) ile tanımlanan çeşitli *isteğe bağlı* klavye etkileşimlerini kapsamaz - bunları özel JavaScript ile kendiniz dahil etmeniz gerekecektir.

## Kullanım

Çöküş eklentisi, ağır işleri halletmek için birkaç sınıf kullanır:

- `.collapse` içeriği gizler
- `.collapse.show` içeriği gösterir
- `.collapsing` geçiş başladığında eklenir ve tamamlandığında kaldırılır

Bu sınıflar `_transitions.scss`'te bulunabilir.

### Veri öznitelikleri aracılığıyla

Otomatik olarak bir veya daha fazla çökertilebilir öğenin kontrolünü atamak için sadece `data-coreui-toggle="collapse"` ve bir `data-coreui-target` ekleyin. `data-coreui-target` özniteliği, çökertmeyi uygulamak için bir CSS seçici alır. Çökertilebilir öğeye `collapse` sınıfını eklemeyi unutmayın. Varsayılan olarak açık olmasını istiyorsanız, ek olarak `show` sınıfını ekleyin.

Bir çökertilebilir alanda akordiyon benzeri grup yönetimi eklemek için `data-coreui-parent="#selektör"` veri özniteliğini ekleyin. Bunu eylemde görmek için demoya bakabilirsiniz.

### JavaScript aracılığıyla

Manuel olarak etkinleştirmek için:

```js
const collapseElementList = document.querySelectorAll('.collapse')
const collapseList = [...collapseElementList].map(collapseEl => new coreui.Collapse(collapseEl))
```

### Seçenekler




| İsim | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `parent` | seçici, jQuery nesnesi, DOM öğesi | `null` | Ana öğe sağlanırsa, belirtilen ana altında tüm çökertilebilir öğelerin gösterildiğinde kapatılacağı anlamına gelir. (geleneksel akordiyon davranışına benzer - bu `card` sınıfına bağlıdır). Öznitelik hedef çökertilebilir alanda ayarlanmalıdır. |
| `toggle` | boolean | `true` | Çağırıldığında çökertilebilir öğeyi değiştirir |
### Yöntemler

:::danger

:::

İçeriğinizi çökertilebilir bir öğe olarak etkinleştirir. Opsiyonel bir seçenek `object` alır.

Kullanıcı kendi çöküş örneğinizi oluşturabilirsiniz:

```js
const bsCollapse = new coreui.Collapse('#myCollapse', {
  toggle: false
})
```


| Yöntem | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin çöküşünü yok eder. (DOM öğesindeki saklanan verileri kaldırır) |
| `getInstance` | Bir DOM öğesine bağlı çöküş örneğini almanızı sağlayan statik yöntem, şöyle kullanılabilir: `coreui.Collapse.getInstance(element)` |
| `getOrCreateInstance` | Bir DOM öğesine bağlı çöküş örneğini döndüren veya önceden başlatılmamışsa yeni bir tane oluşturan statik yöntem. Şöyle kullanılabilir: `coreui.Collapse.getOrCreateInstance(element)` |
| `hide` | Çökertilebilir bir öğeyi gizler. **Gerçekten çökertilebilir öğe gizlenmeden önce çağırana döner** (örneğin, `hidden.coreui.collapse` olayı gerçekleşmeden önce). |
| `show` | Çökertilebilir bir öğeyi gösterir. **Gerçekten çökertilebilir öğe gösterilmeden önce çağırana döner** (örneğin, `shown.coreui.collapse` olayı gerçekleşmeden önce). |
| `toggle` | Gösterilen veya gizlenmiş bir çökertilebilir öğeyi değiştirir. **Gerçekten çökertilebilir öğe gösterilir veya gizlenmeden önce çağırana döner** (yani `shown.coreui.collapse` veya `hidden.coreui.collapse` olayı gerçekleşmeden önce). |
### Olaylar

CoreUI'nin Bootstrap için çöküş sınıfı, çöküş işlevselliğine bağlanmak için birkaç olayı açığa çıkarır.


| Olay türü | Açıklama |
| --- | --- |
| `hide.coreui.collapse` | Bu olay, `hide` yöntemi çağrıldığında hemen ateşlenir. |
| `hidden.coreui.collapse` | Bu olay, bir çökertme öğesi kullanıcılara gizlendiğinde ateşlenir (CSS geçişlerinin tamamlanmasını bekler). |
| `show.coreui.collapse` | Bu olay, `show` örnek yöntemi çağrıldığında hemen ateşlenir. |
| `shown.coreui.collapse` | Bu olay, bir çökertme öğesi kullanıcılara görünür hale getirildiğinde ateşlenir (CSS geçişlerinin tamamlanmasını bekler). |
```js
const myCollapsible = document.getElementById('myCollapsible')
myCollapsible.addEventListener('hidden.coreui.collapse', event => {
  // bir şey yap...
})
```

## Özelleştirme

### SASS değişkenleri

### Sınıflar

Çöküş geçiş sınıfları, birden fazla bileşen (çöküş ve akordiyon) arasında paylaşıldığı için `scss/_transitions.scss` içinde bulunabilir.

