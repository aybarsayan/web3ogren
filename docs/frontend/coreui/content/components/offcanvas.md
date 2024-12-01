---
description: Offcanvas bileşeni, projelerinize gezinme, alışveriş sepetleri ve daha fazlası için gizli yan çubuklar eklemek amacıyla kullanılır. Birçok özelleştirme seçeneği sunarak, farklı durumlara uygun hale getirmenizi sağlar.
keywords: [offcanvas, bileşen, JavaScript, CSS, Bootstrap, kullanıcı arayüzü, gizli yan çubuk]
layout: docs
title: Offcanvas
group: components
toc: true
bootstrap: true
other_frameworks: offcanvas
---

## Nasıl çalışır

Offcanvas, JavaScript ile görüntü alanının sol, sağ, üst veya alt kenarından görünen bir yan çubuk bileşenidir. Belirli öğelere eklediğiniz tetikleyiciler olarak butonlar veya bağlantılar kullanılır ve JavaScript'imizi çağırmak için `data` öznitelikleri kullanılır.

- Offcanvas, modallar ile bazı ortak JavaScript kodlarını paylaşır. Kavramsal olarak oldukça benzerler, ancak ayrı eklentilerdir.
- Benzer şekilde, offcanvas'ın stilleri ve boyutları için bazı `kaynak Sass` değişkenleri modalın değişkenlerinden miras alınmıştır.
- Gösterildiğinde, offcanvas'ı gizlemek için tıklanabilen varsayılan bir arka plan içerir.
- Modallar gibi, aynı anda yalnızca bir offcanvas gösterilebilir.

:::warning
**Dikkat!** CSS'in animasyonları nasıl yönettiğine bağlı olarak, `.offcanvas` öğesinde `margin` veya `translate` kullanamazsınız. Bunun yerine, sınıfı bağımsız bir sarmalayıcı öğe olarak kullanın.
:::



## Örnekler

### Offcanvas bileşenleri

Aşağıda varsayılan olarak gösterilen (`.offcanvas` üzerinde `.show` aracılığıyla) bir offcanvas örneği bulunmaktadır. Offcanvas, bir kapama düğmesine sahip bir başlık ve bazı başlangıç `padding`'i için isteğe bağlı bir gövde sınıfı desteği içerir. Mümkün olduğunca kapatma eylemleri içeren offcanvas başlıkları eklemenizi veya açık bir kapatma eylemi sağlamanızı öneririz.

  
    Offcanvas
    
  
  
    Offcanvas için içerik buraya gelir. Buraya hemen hemen her Bootstrap bileşenini veya özel öğeleri yerleştirebilirsiniz.
  

### Canlı demo

Aşağıdaki butonları kullanarak, `.offcanvas` sınıfına sahip bir öğede `.show` sınıfını değiştiren bir offcanvas öğesini JavaScript aracılığıyla gösterin ve gizleyin.

- `.offcanvas` içeriği gizler (varsayılan)
- `.offcanvas.show` içeriği gösterir

`href` özniteliğine sahip bir bağlantı veya `data-coreui-target` özniteliğine sahip bir buton kullanabilirsiniz. Her iki durumda da `data-coreui-toggle="offcanvas"` gerekli.

  href ile bağlantı


  data-coreui-target ile buton



  
    Offcanvas
    
  
  
    
      Yer tutucu olarak bazı metin. Gerçek hayatta seçtiğiniz öğeler ile içerik yer alabilir. Metin, resimler, listeler vb. gibi.
    
    
      
        Açılır buton
      
      
        Eylem
        Başka bir eylem
        Başka bir şey buraya
      
    
  

### Gövde kaydırma

Offcanvas ve arka planı görünürken `` öğesinin kaydırılması devre dışı bırakılır. `` kaydırmasını etkinleştirmek için `data-coreui-scroll` özniteliğini kullanın.


Gövde kaydırmayı etkinleştir


  
    Gövde kaydırmalı offcanvas
    
  
  
    Bu seçeneği aktif olarak görmek için sayfanın geri kalanını kaydırmayı deneyin.
  

### Gövde kaydırma ve arka plan

Görünür bir arka plan ile `` kaydırmasını da etkinleştirebilirsiniz.


Hem kaydırmayı hem de arka planı etkinleştir


  
    Kaydırma ile arka plan
    
  
  
    Bu seçeneği aktif olarak görmek için sayfanın geri kalanını kaydırmayı deneyin.
  

### Statik arka plan

Arka planı statik olarak ayarlandığında, dışarı tıkladığınızda offcanvas kapanmaz.

  Statik offcanvas'ı aç



  
    Offcanvas
    
  
  
    
      Dışarı tıkladığınızda kapanmayacak.
    
  

## Karanlık offcanvas

 Offcanvas'ın görünümünü, farklı bağlamlara daha iyi uyum sağlaması için yardımcı programlarla değiştirin, örneğin karanlık navigasyon çubukları için. Burada, bir karanlık offcanvas ile uygun stil için `.offcanvas`'a `.text-bg-dark` ve `.btn-close-white`'a ekliyoruz. İçinde açılır menüler varsa, `.dropdown-menu-dark`'ı da eklemeyi düşünün.


Dikkat! Karanlık bileşen varyantları, renk modlarının tanıtılması ile v5.3.0'da kullanım dışı bırakıldı. Yukarıda belirtilen sınıfları manuel olarak eklemek yerine, kök öğeye, bir üst sarmalayıcıya veya bileşenin kendisine `data-coreui-theme="dark"` ayarlayın.
  
    Offcanvas
    
  
  
    Offcanvas içeriğini buraya yerleştirin.
  

## Duyarlı

Duyarlı offcanvas sınıfları, belirtilen bir kırılma noktasının dışındaki içeriği gizler. O kırılma noktasının üzerinde, içerikler normal şekilde davranmaya devam eder. Örneğin, `.offcanvas-lg` içeriği `lg` kırılma noktasının altında bir offcanvas'da gizler, ancak `lg` kırılma noktasının üzerinde içeriği gösterir.

:::tip
Duyarlı offcanvas sınıfları, her kırılma noktasında mevcuttur.

- `.offcanvas`
- `.offcanvas-sm`
- `.offcanvas-md`
- `.offcanvas-lg`
- `.offcanvas-xl`
- `.offcanvas-xxl`
:::

## Yerleşim

Offcanvas bileşenleri için varsayılan bir yerleşim yoktur, bu nedenle aşağıdaki kitaplık sınıflarından birini eklemelisiniz.

- `.offcanvas-start` offcanvas'ı görüntü alanının soluna yerleştirir (yukarıda gösterilmiştir)
- `.offcanvas-end` offcanvas'ı görüntü alanının sağına yerleştirir
- `.offcanvas-top` offcanvas'ı görüntü alanının üstüne yerleştirir
- `.offcanvas-bottom` offcanvas'ı görüntü alanının altına yerleştirir

Aşağıdaki örneklerde üst, sağ ve altı deneyin.


Üst offcanvas'ı aç


  
    Üst offcanvas
    
  
  
    ...
  


Sağ offcanvas'ı aç


  
    Sağ offcanvas
    
  
  
    ...
  


Alt offcanvas'ı aç


  
    Alt offcanvas
    
  
  
    ...
  

## Erişilebilirlik

Offcanvas paneli kavramsal olarak bir modal diyalog olduğundan, `.offcanvas` öğesine `aria-labelledby="..."` eklemeyi unutmayın – offcanvas başlığını referans alarak. `role="dialog"` eklemenize gerek yoktur çünkü bunu zaten JavaScript ile ekliyoruz.

## Kullanım

Offcanvas eklentisi, işlemleri gerçekleştirmek için birkaç sınıf ve öznitelik kullanır:

- `.offcanvas` içeriği gizler
- `.offcanvas.show` içeriği gösterir
- `.offcanvas-start` offcanvas'ı solda gizler
- `.offcanvas-end` offcanvas'ı sağda gizler
- `.offcanvas-top` offcanvas'ı üstte gizler
- `.offcanvas-bottom` offcanvas'ı altta gizler

JavaScript işlevselliğini tetikleyen `data-coreui-dismiss="offcanvas"` özniteliğine sahip bir kapatma düğmesi ekleyin. Tüm cihazlarda doğru davranış için bunu `` öğesi ile birlikte kullanmayı unutmayın.

### Veri öznitelikleri aracılığıyla

Bir öğeye `data-coreui-toggle="offcanvas"` ve bir `data-coreui-target` veya `href` ekleyerek bir offcanvas öğesinin kontrolünü otomatik olarak atayın. `data-coreui-target` özniteliği, offcanvas'ı uygulamak için bir CSS seçicisini kabul eder. Offcanvas öğesine `offcanvas` sınıfını eklemeyi unutmayın. Varsayılan olarak açık olmasını isterseniz, ek `show` sınıfını ekleyin.

#### Kapatma

{{% js-dismiss "offcanvas" %}}

:::warning
Bir offcanvas'ı kapatmanın iki yolunun da desteklendiğini unutmayın, ancak dışarıdan kapatmanın [ARIA Yazım Uygulamaları Rehberi diyalog (modal) kalıbı](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/) ile eşleşmediğini aklınızda bulundurun. Bunu kendi riskinizde yapın.
:::

### JavaScript aracılığıyla

Manuel olarak etkinleştirmek için:

```js
const offcanvasElementList = document.querySelectorAll('.offcanvas')
const offcanvasList = [...offcanvasElementList].map(offcanvasEl => new coreui.Offcanvas(offcanvasEl))
```

### Seçenekler




| İsim | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `backdrop` | boolean veya `static` dizesi | `true` | Offcanvas açıkken gövde üzerinde bir arka plan uygular. Alternatif olarak, tıklandığında offcanvas'ı kapatmayan bir arka plan için `static` belirtebilirsiniz. |
| `keyboard` | boolean | `true` | Escape tuşuna basıldığında offcanvas'ı kapatır |
| `scroll` | boolean | `false` | Offcanvas açıkken gövde kaydırmasına izin verir |
### Yöntemler



İçeriğinizi bir offcanvas öğesi olarak etkinleştirir. Opsiyonel bir seçenek `object` kabul eder.

Aşağıdaki örnekte constructor ile bir offcanvas örneği oluşturabilirsiniz:

```js
const bsOffcanvas = new coreui.Offcanvas('#myOffcanvas')
```


| Yöntem | Açıklama |
| --- | --- |
| `getInstance` | Bir DOM öğesiyle ilişkili offcanvas örneğini almanızı sağlayan *Statik* yöntem |
| `getOrCreateInstance` | Bir DOM öğesiyle ilişkili offcanvas örneğini almanızı veya başlatılmamışsa yeni bir tane oluşturmanızı sağlayan *Statik* yöntem |
| `hide` | Bir offcanvas öğesini gizler. **Offcanvas öğesi aslında gizlenmeden önce çağrıcıya döner** (yani `hidden.coreui.offcanvas` olayı gerçekleşmeden önce).|
| `show` | Bir offcanvas öğesini gösterir. **Offcanvas öğesi aslında gösterilmeden önce çağrıcıya döner** (yani `shown.coreui.offcanvas` olayı gerçekleşmeden önce).|
| `toggle` | Bir offcanvas öğesini gösterilen veya gizlenen olarak değiştirir. **Offcanvas öğesi aslında gösterilmeden veya gizlenmeden önce çağrıcıya döner** (yani `shown.coreui.offcanvas` veya `hidden.coreui.offcanvas` olayı gerçekleşmeden önce). |
### Olaylar

Bootstrap için CoreUI offcanvas sınıfı, offcanvas işlevselliğine bağlanma için birkaç olay açığa çıkarır.


| Olay türü | Açıklama |
| --- | --- |
| `hide.coreui.offcanvas` | `hide` yöntemi çağrıldığında hemen ateşlenir. |
| `hidden.coreui.offcanvas` | Offcanvas öğesi kullanıcıdan gizlendiğinde (CSS geçişlerinin tamamlanmasını bekleyecektir) ateşlenir. |
| `hidePrevented.coreui.offcanvas` | Offcanvas gösterilirken, arka plan `static` olduğunda ve offcanvas'ın dışında tıklandığında ateşlenir. Escape tuşuna basıldığında `keyboard` seçeneği `false` olarak ayarlandığında da ateşlenir. |
| `show.coreui.offcanvas` | `show` örnek yöntem çağrıldığında hemen ateşlenir. |
| `shown.coreui.offcanvas` | Offcanvas öğesi kullanıcıya görünür hale getirildiğinde (CSS geçişlerinin tamamlanmasını bekleyecektir) ateşlenir. |
```js
const myOffcanvas = document.getElementById('myOffcanvas')
myOffcanvas.addEventListener('hidden.coreui.offcanvas', event => {
  // bir şey yap...
})
```

## Özelleştirme

### CSS değişkenleri

Offcanvas, gelişmiş gerçek zamanlı özelleştirme için `.offcanvas` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass üzerinden ayarlanır, bu nedenle Sass özelleştirmeniz hala desteklenmektedir.

### SASS değişkenleri

