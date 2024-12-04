---
title: Olay Yönetimi
seoTitle: Olay Yönetimi - Vue.js ile Etkileşim
sidebar_position: 4
description: Olay yönetimi, Vue.jste DOM olaylarını dinlemek ve işlemek için kritik bir öneme sahiptir. Bu içerikte inline ve method handlerların nasıl kullanılacağına ilişkin bilgiler sunulmaktadır.
tags: 
  - olay yönetimi
  - Vue.js
  - JavaScript
  - front-end
  - etkileşim
keywords: 
  - olay yönetimi
  - Vue.js
  - handler
  - JavaScript
  - etkileşim
---
## Olay Yönetimi {#event-handling}


  



  


## Olayları Dinlemek {#listening-to-events}

DOM olaylarını dinlemek ve tetiklendiğinde bazı JavaScript kodları çalıştırmak için genellikle `@` sembolü ile kısalttığımız `v-on` yönergesini kullanabiliriz. Kullanımı `v-on:click="handler"` veya kısayolu ile `@click="handler"` şeklindedir.

Handler değerlerinden biri aşağıdakilerden biri olabilir:

1. **Satır içi handler'lar:** Olay tetiklendiğinde çalıştırılacak satır içi JavaScript (yerel `onclick` niteliğine benzer).
  
2. **Metot handler'lar:** Bileşende tanımlı bir metoda işaret eden bir özellik adı veya yolu.

## Satır İçi Handler'lar {#inline-handlers}

Satır içi handler'lar genellikle basit durumlarda kullanılır, örneğin:



```js
const count = ref(0)
```




```js
data() {
  return {
    count: 0
  }
}
```



```vue-html
<button @click="count++">1 Ekle</button>
<p>Sayım: {{ count }}</p>
```



[Playground'da Deneyin](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)




[Playground'da Deneyin](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)



## Metot Handler'lar {#method-handlers}

Birçok olay handler'ının mantığı daha karmaşık olacaktır ve bu nedenle satır içi handler'lar ile uygulanması mümkün olmayabilir. Bu yüzden `v-on`, çağrılacak bir bileşen metodunun adını veya yolunu kabul edebilir.

Örneğin:



```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Merhaba ${name.value}!`)
  // `event` yerel DOM olay
  if (event) {
    alert(event.target.tagName)
  }
}
```




```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` metodların içinde mevcut aktif örneğe işaret eder
    alert(`Merhaba ${this.name}!`)
    // `event` yerel DOM olay
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```



```vue-html
<!-- `greet` yukarıda tanımlanan metodun adıdır -->
<button @click="greet">Selamla</button>
```



[Playground'da Deneyin](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)




[Playground'da Deneyin](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)



Bir metot handler'ı otomatik olarak tetikleyen yerel DOM Event nesnesini alır - yukarıdaki örnekte, `event.target` aracılığıyla olayı tetikleyen öğeye erişim sağlayabiliriz.



Ayrıca bakınız: `Olay Handler’larını Tip Belirleme` 




Ayrıca bakınız: `Olay Handler’larını Tip Belirleme` 



### Metot ve Satır İçi Tespiti {#method-vs-inline-detection}

Şablon derleyici, `v-on` değer dizesinin geçerli bir JavaScript belirleyicisi veya özellik erişim yolu olup olmadığını kontrol ederek metot handler'larını tespit eder. Örneğin, `foo`, `foo.bar` ve `foo['bar']` metot handler'ı olarak kabul edilirken, `foo()` ve `count++` satır içi handler'lar olarak kabul edilir.

## Satır İçi Handler'larda Metot Çağırma {#calling-methods-in-inline-handlers}

Bir metot adına doğrudan bağlanmak yerine, satır içi bir handler'da metotları çağırabiliriz. Bu, yerel olaya ek olarak metot argümanlarını özel olarak geçirmemizi sağlar:



```js
function say(message) {
  alert(message)
}
```




```js
methods: {
  say(message) {
    alert(message)
  }
}
```



```vue-html
<button @click="say('merhaba')">Merhaba de</button>
<button @click="say('hoşça kal')">Hoşça kal de</button>
```



[Playground'da Deneyin](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)




[Playground'da Deneyin](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)



## Satır İçi Handler'larda Olay Argümanına Erişim {#accessing-event-argument-in-inline-handlers}

Bazen bir satır içi handler'da orijinal DOM olayına erişmemiz gerekebilir. Bunu özel `$event` değişkenini kullanarak bir metoda geçirebilir veya satır içi bir ok fonksiyonu kullanabilirsiniz:

```vue-html
<!-- $event özel değişkenini kullanarak -->
<button @click="warn('Form gönderilemez.', $event)">
  Gönder
</button>

<!-- satır içi ok fonksiyonu kullanarak -->
<button @click="(event) => warn('Form gönderilemez.', event)">
  Gönder
</button>
```



```js
function warn(message, event) {
  // artık yerel olaya erişimimiz var
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```




```js
methods: {
  warn(message, event) {
    // artık yerel olaya erişimimiz var
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```



## Olay Modifikatörleri {#event-modifiers}

`event.preventDefault()` veya `event.stopPropagation()` çağırma ihtiyacı oldukça yaygındır. Bunu metodlar içinde kolaylıkla yapabilsek de, metodların DOM olay detayları ile ilgilenmek yerine tamamen veri mantığına odaklanması daha iyi olacaktır.

Bu sorunu çözmek için Vue, `v-on` için **olay modifikatörleri** sağlar. Modifikatörlerin, nokta ile gösterilen yönerge posta ekleri olduğunu hatırlayın.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- tıklama olayının yayılımı durdurulacak -->
<a @click.stop="doThis"></a>

<!-- gönderim olayı artık sayfayı yenilemeyecek -->
<form @submit.prevent="onSubmit"></form>

<!-- modifikatörler birleştirilebilir -->
<a @click.stop.prevent="doThat"></a>

<!-- sadece modifikatör -->
<form @submit.prevent></form>

<!-- sadece olay.target öğenin kendisi ise handler'ı tetikle -->
<!-- yani bir alt öğeden değil -->
<div @click.self="doThat">...</div>
```

::: tip
Modifikatörler kullanırken sıralama önemlidir çünkü ilgili kod aynı sırada üretilir. Bu nedenle `@click.prevent.self` kullanmak, **tıklamanın varsayılan işlemini öğenin kendisinde ve alt öğelerinde** önleyecekken, `@click.self.prevent` yalnızca tıklamanın varsayılan işlemini öğenin kendisinde önleyecektir.
:::

`.capture`, `.once` ve `.passive` modifikatörleri, [yerel `addEventListener` metodunun seçenekleriyle](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options) benzerlik gösterir:

```vue-html
<!-- olay dinleyicisini eklerken yakalama modunu kullanın -->
<!-- yani iç öğeyi hedefleyen bir olay, o öğe tarafından işlenmeden -->
<!-- önce burada işlenir -->
<div @click.capture="doThis">...</div>

<!-- tıklama olayı en fazla bir kez tetiklenecek -->
<a @click.once="doThis"></a>

<!-- kaydırma olayının varsayılan davranışı (kaydırma) hemen olacaktır -->
<!-- `onScroll` tamamlanmayı beklemeden               -->
<!-- içeriğinde `event.preventDefault()` varsa       -->
<div @scroll.passive="onScroll">...</div>
```

`.passive` modifikatörü genellikle [mobil cihazlarda performansı artırmak için](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_using_passive_listeners) dokunmatik olay dinleyicileri ile kullanılır.

::: tip
`.passive` ve `.prevent` birlikte kullanılmamalıdır çünkü `.passive` zaten tarayıcıya olayın varsayılan davranışını engellemeyi düşündüğünüzü belirtir ve bunu yaparsanız büyük olasılıkla tarayıcıdan bir uyarı alırsınız.
:::

## Tuş Modifikatörleri {#key-modifiers}

Klavye olaylarını dinlerken, genellikle belirli tuşları kontrol etmemiz gerekir. Vue, tuş olaylarını dinlerken `v-on` veya `@` için tuş modifikatörleri eklemeye izin verir:

```vue-html
<!-- sadece `key` Enter olduğunda `submit` çağrılır -->
<input @keyup.enter="submit" />
```

Herhangi bir geçerli tuş adını, [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) aracılığıyla modifikatörler olarak doğrudan kullanarak kebab-kasa dönüştürebilirsiniz.

```vue-html
<input @keyup.page-down="onPageDown" />
```

Yukarıdaki örnekte, handler yalnızca `$event.key` 'PageDown' eşitse çağrılacaktır.

### Tuş Takma Adları {#key-aliases}

Vue, en yaygın olarak kullanılan tuşlar için takma adlar sağlar:

- `.enter`
- `.tab`
- `.delete` (hem "Delete" hem de "Backspace" tuşlarını yakalar)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### Sistem Modifikatör Tuşları {#system-modifier-keys}

Aşağıdaki modifikatörleri yalnızca ilgili modifikatör tuşuna basıldığında fare veya klavye olay dinleyicilerini tetiklemek için kullanabilirsiniz:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Not
Macintosh klavyelerinde meta, komut tuşudur (⌘). Windows klavyelerinde meta, Windows tuşudur (⊞). Sun Microsystems klavyelerinde meta, katı bir elmas (◆) olarak işaretlenir. Bazı klavyelerde, özellikle MIT ve Lisp makine klavyeleri ve bunların halefleri, Knight klavyesi gibi, meta "META" olarak etiketlenmiştir. Symbolics klavyelerinde meta "META" veya "Meta" olarak etiketlenmiştir.
:::

Örneğin:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Tıklama -->
<div @click.ctrl="doSomething">Bir şey yap</div>
```

::: tip
Modifikatör tuşlarının normal tuşlardan farklı olduğunu ve `keyup` olayları ile kullanıldığında, olay yayımlanırken basılmaları gerektiğini unutmayın. Diğer bir deyişle, `keyup.ctrl` yalnızca ctrl tuşunu basılı tutarken bir tuşu bıraktığınızda tetiklenir. Sadece ctrl tuşunu bıraktığınızda tetiklenmez.
:::

### `.exact` Modifikatörü {#exact-modifier}

`.exact` modifikatörü, bir olayı tetiklemek için gereken sistem modifikatörlerinin tam kombinasyonunu kontrol etmenizi sağlar.

```vue-html
<!-- bu, Alt veya Shift de basılı olduğunda tetiklenecektir -->
<button @click.ctrl="onClick">A</button>

<!-- bu yalnızca Ctrl ve başka hiçbir tuş basılı olmadığında tetiklenecektir -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- bu yalnızca hiçbir sistem modifikatörü basılı değilken tetiklenecektir -->
<button @click.exact="onClick">A</button>
```

## Fare Butonu Modifikatörleri {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

Bu modifikatörler, handler'ı belirli bir fare düğmesi tarafından tetiklenen olaylarla kısıtlar.

Ancak, `.left`, `.right` ve `.middle` modifikatör adları tipik sağ el düzenine dayanmaktadır, ancak aslında "ana", "ikincil" ve "yardımcı" işaretleme cihazı olayı tetikleme tetikleyicilerini temsil eder ve fiziksel düğmelere karşılık gelmez. Yani sol eliyle fare düzeninde "ana" düğme fiziksel olarak sağ düğme olabilir ancak `.left` modifikatör handler'ını tetikler. Veya bir dokunmatik yüzey bir parmakla dokunarak `.left` handler'ını, iki parmakla dokunarak `.right` handler'ını ve üç parmakla dokunarak `.middle` handler'ını tetikleyebilir. Benzer şekilde, diğer cihazlar ve "fare" olaylarını üreten olay kaynakları, "sol" ve "sağ" ile hiç alakası olmayan tetikleme modlarına sahip olabilir.