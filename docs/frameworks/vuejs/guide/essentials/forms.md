---
title: Form Girdi Bağlantıları
seoTitle: Vue.js Form Girdi Bağlantıları
sidebar_position: 4
description: Bu doküman, Vue.jste form girdi elemanları ile nasıl çalışılacağını ve v-model direktifinin kullanımını ele almaktadır.
tags: 
  - Vue.js
  - form girdi
  - v-model
  - JavaScript
keywords: 
  - Vue.js
  - form girdi
  - v-model
  - kullanıcı girdileri
---


## Form Girdi Bağlantıları {#form-input-bindings}


Ön uçta formlarla çalışırken, genellikle form girdi elemanlarının durumlarını ilgili JavaScript durumlarıyla senkronize etmemiz gerekir. Değer bağlamalarını ve değişiklik olay dinleyicilerini elle bağlamak zahmetli olabilir:

```vue-html
<input
  :value="text"
  @input="event => text = event.target.value">
```

> `v-model` direktifi yukarıdakini basitleştirmemize yardımcı olur:

```vue-html
<input v-model="text">
```

Ayrıca, `v-model` farklı türlerdeki girdilerde, `` ve `` elemanlarında kullanılabilir. Kullanıldığı eleman bazında farklı DOM özellikleri ve olay çiftlerine otomatik olarak genişler:

- Metin türündeki `` ve `` elemanları `value` özelliğini ve `input` olayını kullanır;
- `` ve `` `checked` özelliğini ve `change` olayını kullanır;
- `` `value` özelliğini prop olarak ve `change` olayını kullanır.

::: tip Not
`v-model`, form elemanlarında bulunan başlangıç `value`, `checked` veya `selected` niteliklerini göz ardı edecektir. Her zaman mevcut bağlı JavaScript durumunu doğru kaynak olarak kabul eder. Başlangıç değerini JavaScript tarafında, `data` seçeneğini`reaktivite API'leri` kullanarak belirtmelisiniz.
:::

## Temel Kullanım {#basic-usage}

### Metin {#text}

```vue-html
<p>Mesaj: {{ message }}</p>
<input v-model="message" placeholder="beni düzenle" />
```


  Mesaj: {{ message }}
  



[Playground'da deneyin](https://play.vuejs.org/#eNo9jUEOgyAQRa8yYUO7aNkbNOkBegM2RseWRGACoxvC3TumxuX/+f+9ql5Ez31D1SlbpuyJoSBvNLjoA6XMUCHjAg2WnAJomWoXXZxSLAwBSxk/CP2xuWl9d9GaP0YAEhgDrSOjJABLw/s8+NJBrde/NWsOpWPrI20M+yOkGdfeqXPiFAhowm9aZ8zS4+wPv/RGjtZcJtV+YpNK1g==)



[Playground'da deneyin](https://play.vuejs.org/#eNo9jdEKwjAMRX8l9EV90L2POvAD/IO+lDVqoetCmw6h9N/NmBuEJPeSc1PVg+i2FFS90nlMnngwEb80JwaHL1sCQzURwFm258u2AyTkkuKuACbM2b6xh9Nps9o6pEnp7ggWwThRsIyiADQNz40En3uodQ+C1nRHK8HaRyoMy3WaHYa7Uf8To0CCRvzMwWESH51n4cXvBNTd8Um1H0FuTq0=)



::: tip Not
IME (Girdi Metodu) (Çince, Japonca, Korece vb.) gerektiren dillerde, `v-model`'in IME bileşimi sırasında güncellenmediğini göreceksiniz. Bu güncellemeleri yanıtlamak istiyorsanız, `input` olay dinleyicisini ve `value` bağlamasını kullanarak `v-model` yerine kendi `input` olay dinleyicinizi kullanın.
:::

### Çok Satırlı Metin {#multiline-text}

```vue-html
<span>Çok satırlı mesaj:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="birden fazla satır ekleyin"></textarea>
```


  Çok satırlı mesaj:
  {{ multilineText }}
  



[Playground'da deneyin](https://play.vuejs.org/#eNo9jktuwzAMRK9CaON24XrvKgZ6gN5AG8FmGgH6ECKdJjB891D5LYec9zCb+SH6Oq9oRmN5roEEGGWlyeWQqFSBDSoeYYdjLQk6rXYuuzyXzAIJmf0fwqF1Prru02U7PDQq0CCYKHrBlsQy+Tz9rlFCDBnfdOBRqfa7twhYrhEPzvyfgmCvnxlHoIp9w76dmbbtDe+7HdpaBQUv4it6OPepLBjV8Gw5AzpjxlOJC1a9+2WB1IZQRGhWVqsdXgb1tfDcbvYbJDRqLQ==)


[Playground'da deneyin](https://play.vuejs.org/#eNo9jk2OwyAMha9isenMIpN9hok0B+gN2FjBbZEIscDpj6LcvaZpKiHg2X6f32L+mX+uM5nO2DLkwNK7RHeesoCnE85RYHEJwKPg1/f2B8gkc067AhipFDxTB4fDVlrro5ce237AKoRGjihUldjCmPqjLgkxJNoxEEqnrtp7TTEUeUT6c+Z2CUKNdgbdxZmaavt1pl+Wj3ldbcubUegumAnh2oyTp6iE95QzoDEGukzRU9Y6eg9jDcKRoFKLUm27E5RXxTu7WZ89/G4E)


Not: `` içinde ara belleğe alma çalışmaz. Bunun yerine `v-model` kullanın.

```vue-html
<!-- kötü -->
<textarea>{{ text }}</textarea>

<!-- iyi -->
<textarea v-model="text"></textarea>
```

### Onay Kutusu {#checkbox}

Tek bir onay kutusu, boolean değeri:

```vue-html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```


  
  {{ checked }}



[Playground'da deneyin](https://play.vuejs.org/#eNpVjssKgzAURH/lko3tonVfotD/yEaTKw3Ni3gjLSH/3qhUcDnDnMNk9gzhviRkD8ZnGXUgmJFS6IXTNvhIkCHiBAWm6C00ddoIJ5z0biaQL5RvVNCtmwvFhFfheLuLqqIGQhvMQLgm4tqFREDfgJ1gGz36j2Cg1TkvN+sVmn+JqnbtrjDDiAYmH09En/PxphTebqsK8PY4wMoPslBUxQ==)


[Playground'da deneyin](https://play.vuejs.org/#eNpVjtEKgzAMRX8l9Gl72Po+OmH/0ZdqI5PVNnSpOEr/fVVREEKSc0kuN4sX0X1KKB5Cfbs4EDfa40whMljsTXIMWXsAa9hcrtsOEJFT9DsBdG/sPmgfwDHhJpZl1FZLycO6AuNIzjAuxGrwlBj4R/jUYrVpw6wFDPbM020MFt0uoq2a3CycadFBH+Lpo8l5jwWlKLle1QcljwCi/AH7gFic)


Aynı dizi veya [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) değerine birden fazla onay kutusunu bağlayabiliriz:


```js
const checkedNames = ref([])
```


```js
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}
```


```vue-html
<div>Seçilen isimler: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
```


  Seçilen isimler: {{ checkedNames }}

  
  Jack

  
  John

  
  Mike


Bu durumda, `checkedNames` dizisi her zaman işaretli kutuların değerlerini içerecektir.


[Playground'da deneyin](https://play.vuejs.org/#eNqVkUtqwzAURbfy0CTtoNU8KILSWaHdQNWBIj8T1fohyybBeO+RbOc3i2e+vHvuMWggHyG89x2SLWGtijokaDF1gQunbfAxwQARaxihjt7CJlc3wgmnvGsTqAOqBqsfabGFXSm+/P69CsfovJVXckhog5EJcwJgle7558yBK+AWhuFxaRwZLbVCZ0K70CVIp4A7Qabi3h8FAV3l/C9Vk797abpy/lrim/UVmkt/Gc4HOv+EkXs0UPt4XeCFZHQ6lM4TZn9w9+YlrjFPCC/kKrPVDd6Zv5e4wjwv8ELezIxeX4qMZwHduAs=)


[Playground'da deneyin](https://play.vuejs.org/#eNqVUc1qxCAQfpXBU3tovS9WKL0V2hdoenDjLGtjVNwxbAl592rMpru3DYjO5/cnOLLXEJ6HhGzHxKmNJpBsHJ6DjwQaDypZgrFxAFqRenisM0BEStFdEEB7xLZD/al6PO3g67veT+XIW16Cr+kZEPbBKsKMAIQ2g3yrAeBqwjjeRMI0CV5kxZ0dxoVEQL8BXxo2C/f+3DAwOuMf1XZ5HpRNhX5f4FPvNdqLfgnOBK+PsGqPFg4+rgmyOAWfiaK5o9kf3XXzArc0zxZZnJuae9PhVfPHAjc01wRZnP/Ngq8/xaY/yMW74g==)


### Radyo {#radio}

```vue-html
<div>Seçilen: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">Bir</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">İki</label>
```


  Seçilen: {{ picked }}

  
  Bir

  
  İki



[Playground'da deneyin](https://play.vuejs.org/#eNqFkDFuwzAMRa9CaHE7tNoDxUBP0A4dtTgWDQiRJUKmHQSG7x7KhpMMAbLxk3z/g5zVD9H3NKI6KDO02RPDgDxSbaPvKWWGGTJ2sECXUw+VrFY22timODCQb8/o4FhWPqrfiNWnjUZvRmIhgrGn0DCKAjDOT/XfCh1gnnd+WYwukwJYNj7SyMBXwqNVuXE+WQXeiUgRpZyaMJaR5BX11SeHQfTmJi1dnNiE5oQBupR3shbC6LX9Posvpdyz/jf1OksOe85ayVqIR5bR9z+o5Qbc6oCk)


[Playground'da deneyin](https://play.vuejs.org/#eNqNkEEOAiEMRa/SsFEXyt7gJJ5AFy5ng1ITIgLBMmomc3eLOONSEwJ9Lf//pL3YxrjqMoq1ULdTspGa1uMjhkRg8KyzI+hbD2A06fmi1gAJKSc/EkC0pwuaNcx2Hme1OZSHLz5KTtYMhNfoNGEhUsZ2zf6j7vuPEQyDkmVSBPzJ+pgJ6Blx04qkjQ2tAGsYgkcuO+1yGXF6oeU1GHTM1Y1bsoY5fUQH55BGZcMKJd/t31l0L+WYdaj0V9Zb2bDim6XktAcxvADR+YWb)


### Seçim {#select}

Tekli seçim:

```vue-html
<div>Seçilen: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Lütfen birini seçin</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```


  Seçilen: {{ selected }}
  
    Lütfen birini seçin
    A
    B
    C
  



[Playground'da deneyin](https://play.vuejs.org/#eNp1j7EOgyAQhl/lwmI7tO4Nmti+QJOuLFTPxASBALoQ3r2H2jYOjvff939wkTXWXucJ2Y1x37rBBvAYJlsLPYzWuAARHPaQoHdmhILQQmihW6N9RhW2ATuoMnQqirPQvFw9ZKAh4GiVDEgTAPdW6hpeW+sGMf4VKVEz73Mvs8sC5stoOlSVYF9SsEVGiLFhMBq6wcu3IsUs1YREEvFUKD1udjAaebnS+27dHOT3g/yxy+nHywM08PJ3KksfXwJ2dA==)


[Playground'da deneyin](https://play.vuejs.org/#eNp1j1ELgyAUhf/KxZe2h633cEHbHxjstReXdxCYSt5iEP333XIJPQSinuN3jjqJyvvrOKAohAxN33oqa4tf73oCjR81GIKptgBakTqd4x6gRxp6uymAgAYbQl1AlkVvXhaeeMg8NbMg7LxRhKwAZPDKlvBK8WlKXTDPnFzOI7naMF46p9HcarFxtVgBRpyn1lnQbVBvwwWjMgMyycTToAr47wZnUeaR3mfL6sC/H/iPnc/vXS9gIfP0UTH/ACgWeYE=)


:::tip Not
Eğer `v-model` ifadenizin başlangıç değeri herhangi bir seçenekle eşleşmiyorsa, `` elementi "seçilmemiş" durumda render edilecektir. Bu durumda iOS'ta kullanıcı, ilk öğeyi seçemeyecek çünkü iOS bu durumda değişiklik olayı ateşlemez. Bu nedenle, yukarıdaki örnekte gösterildiği gibi, boş bir değere sahip bir devre dışı seçenek sağlamanız önerilir.
:::

Çoklu seçim (diziye bağlı):

```vue-html
<div>Seçilen: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```


  Seçilen: {{ multiSelected }}

  
    A
    B
    C
  



[Playground'da deneyin](https://play.vuejs.org/#eNp1kL2OwjAQhF9l5Ya74i7QBhMJeARKTIESIyz5Z5VsAsjyu7NOQEBB5xl/M7vaKNaI/0OvRSlkV7cGCTpNPVbKG4ehJYjQ6hMkOLXBwYzRmfLK18F3GbW6Jt3AKkM/+8Ov8rKYeriBBWmH9kiaFYBszFDtHpkSYnwVpCSL/JtDDE4+DH8uNNqulHiCSoDrLRm0UyWzAckEX61l8Xh9+psv/vbD563HCSxk8bY0y45u47AJ2D/HHyDm4MU0dC5hMZ/jdal8Gg8wJkS6A3nRew4=)


[Playground'da deneyin](https://play.vuejs.org/#eNp1UEEOgjAQ/MqmJz0oeMVKgj7BI3AgdI1NCjSwIIbwdxcqRA4mTbsznd2Z7CAia49diyIQsslrbSlMSuxtVRMofGStIRiSEkBllO32rgaokdq6XBBAgwZzQhVAnDpunB6++EhvncyAsLAmI2QEIJXuwvvaPAzrJBhH6U2/UxMLHQ/doagUmksiFmEioOCU2ho3krWVJV2VYSS9b7Xlr3/424bn1LMDA+n9hGbY0Hs2c4J4sU/dPl5a0TOAk+/b/rwsYO4Q4wdtRX7l)


Seçim seçenekleri `v-for` ile dinamik olarak render edilebilir:


```js
const selected = ref('A')

const options = ref([
  { text: 'Bir', value: 'A' },
  { text: 'İki', value: 'B' },
  { text: 'Üç', value: 'C' }
])
```


```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'Bir', value: 'A' },
        { text: 'İki', value: 'B' },
        { text: 'Üç', value: 'C' }
      ]
    }
  }
}
```


```vue-html
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Seçilen: {{ selected }}</div>
```


[Playground'da deneyin](https://play.vuejs.org/#eNplkMFugzAQRH9l5YtbKYU7IpFoP6CH9lb3EMGiWgLbMguthPzvXduEJMqNYUazb7yKxrlimVFUop5arx3BhDS7kzJ6dNYTrOCxhwC9tyNIjkpllGmtmWJ0wJawg2MMPclGPl9N60jzx+Z9KQPcRfhHFch3g/IAy3mYkVUjIRzu/M9fe+O/Pvo/Hm8b3jihzDdfr8s8gwewIBzdcCZkBVBnXFheRtvhcFTiwq9ECnAkQ3Okt54Dm9TmskYJqNLR3SyS3BsYct3CRYSFwGCpusx/M0qZTydKRXWnl9PHBlPFhv1lQ6jL6MZl+xoR/gFjPZTD)


[Playground'da deneyin](https://play.vuejs.org/#eNplkM1uIzAQRH9l5YtbKYU7IpFoP6CH9lb3EMGiWgLbMguthPzvXduEJMqNYUazb7yKxrlimVFUop5arx3BhDS7kzJ6dNYTrOCxhwC9tyNIjkpllGmtmWJ0wJawg2MMPclGPl9N60jzx+Z9KQPcRfhHFch3g/IAy3mYkVUjIRzu/M9fe+O/Pvo/Hm8b3jihzDdfr8s8gwewIBzdcCZkBVBnXFheRtvhcFTiwq9ECnAkQ3Okt54Dm9TmskYJqNLR3SyS3BsYct3CRYSFwGCpusx/M0qZTydKRXWnl9PHBlPFhv1lQ6jL6MZl+xoR/gFjPZTD)


## Değer Bağlantıları {#value-bindings}

Radyo, onay kutusu ve seçim seçenekleri için, `v-model` bağlama değerleri genellikle statik dizgiler (veya onay kutusu için boolean değeri) olur:

```vue-html
<!-- `picked` işaretli olduğunda "a" dizesidir -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` ya true ya da false'dır -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` ilk seçenek seçildiğinde "abc" dizesidir -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Ama bazen değeri aktif örnekteki dinamik bir özelliğe bağlamak isteyebiliriz. Bunu başarmak için `v-bind` kullanabiliriz. Ayrıca, `v-bind` kullanmak, giriş değerini dize olmayan değerlere bağlamamıza da izin verir.

### Onay Kutusu {#checkbox-1}

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  true-value="evet"
  false-value="hayır" />
```

`true-value` ve `false-value`, yalnızca `v-model` ile çalışan Vue'ya özel niteliklerdir. Burada `toggle` özelliğinin değeri onay kutusu işaretlendiğinde `'evet'` olarak ayarlanacak, işaretlenmediğinde ise `'hayır'` olarak ayarlanacaktır. Ayrıca bunları dinamik değerlere `v-bind` kullanarak bağlayabilirsiniz:

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

::: tip İpucu
`true-value` ve `false-value` nitelikleri, girişin `value` niteliğini etkilemez, çünkü tarayıcılar işaretli olmayan kutuları form gönderimlerinde dahil etmez. Formda iki değerden birinin (örneğin "evet" veya "hayır") iletilmesini garanti etmek için radyo girişleri kullanın.
:::

### Radyo {#radio-1}

```vue-html
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

`pick`, birinci radyo giriş kutusu işaretlendiğinde `first` değerine, ikinci radyo giriş kutusu işaretlendiğinde ise `second` değerine ayarlanacaktır.

### Seçim Seçenekleri {#select-options}

```vue-html
<select v-model="selected">
  <!-- satır içi nesne litereali -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model`, dize olmayan değerlerin değer bağlamalarını da destekler! Yukarıdaki örnekte, seçenek seçildiğinde, `selected` `{ number: 123 }` nesne literal değerine ayarlanacaktır.

## Modifikatörler {#modifiers}

### `.lazy` {#lazy}

Varsayılan olarak, `v-model` girişi her `input` olayında veriyi senkronize eder (ve IME bileşimi hariç `yukarıda belirtilmiştir`). Bunun yerine `change` olaylarından sonra senkronize etmek için `lazy` modifikatörünü ekleyebilirsiniz:

```vue-html
<!-- "input" yerine "change" ile senkronize edilir -->
<input v-model.lazy="msg" />
```

### `.number` {#number}

Kullanıcı girişinin otomatik olarak bir sayıya dönüştürülmesini istiyorsanız, `v-model` yönetilen girdilerinize `number` modifikatörünü ekleyebilirsiniz:

```vue-html
<input v-model.number="age" />
```

Değer `parseFloat()` ile ayrıştırılamıyorsa, orijinal (dize) değeri kullanılacaktır. Özellikle, giriş boş olduğunda (örneğin kullanıcı giriş alanını temizlediğinde), boş bir dize döner. Bu davranış, [DOM özelliği `valueAsNumber`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#valueasnumber) ile farklıdır.

`number` modifikatörü, girişin `type="number"` olması durumunda otomatik olarak uygulanır.

### `.trim` {#trim}

Kullanıcı girişinden boşlukların otomatik olarak kesilmesini istiyorsanız, `v-model` yönetilen girdilerinize `trim` modifikatörünü ekleyebilirsiniz:

```vue-html
<input v-model.trim="msg" />
```

## `v-model` Bileşenlerle {#v-model-with-components}

> Eğer Vue bileşenleriyle henüz tanışmadıysanız, şimdilik bunu atlayabilirsiniz.

HTML'nin yerleşik girdi türleri her zaman ihtiyaçlarınızı karşılamayabilir. Neyse ki, Vue bileşenleri tamamen özelleştirilmiş davranışlarla yeniden kullanılabilir girişler oluşturmanıza olanak tanır. Bu girişler, `v-model` ile de çalışır! Daha fazla bilgi için, Bileşenler kılavuzunda `Kullanım için `v-model` bölümüne bakın.