---
title: Geçiş
seoTitle: Vue Geçişleri ve Animasyonları
sidebar_position: 4
description: Vue, geçişler ve animasyonlarla çalışmak için yerleşik bileşenler sunar. Bu belgede, geçişlerin nasıl kullanılacağını ve özelleştirileceğini öğreneceksiniz.
tags: 
  - Vue
  - Geçiş
  - Animasyon
  - CSS
  - Bileşenler
keywords: 
  - Vue
  - Transition
  - Animation
  - CSS
  - Component
---



## Geçiş {#transition}

Vue, değişen duruma yanıt olarak geçişler ve animasyonlarla çalışmaya yardımcı olabilecek iki yerleşik bileşen sunar:

- `` DOM'a giren ve çıkan bir öğe veya bileşen için animasyon uygulamak için kullanılır. Bu, bu sayfada ele alınmaktadır.
- `` bir `v-for` listesinden bir öğe veya bileşen eklenirken, kaldırılırken veya taşınırken animasyon uygulamak için kullanılır. Bu, `sonraki bölümde` ele alınmaktadır.

Bu iki bileşenin yanı sıra, CSS sınıflarını değiştirme veya stil bağlamaları aracılığıyla durumdan kaynaklanan animasyonlar gibi diğer teknikler kullanarak Vue'da da animasyonlar uygulayabiliriz. Bu ek teknikler `Animasyon Teknikleri` bölümünde ele alınmaktadır.

## `` Bileşeni {#the-transition-component}

``, yerleşik bir bileşendir: bu, onu herhangi bir bileşenin şablonunda kaydetmeden kullanabileceğiniz anlamına gelir. Bunu, varsayılan slotu aracılığıyla geçiş yapan öğelere veya bileşenlere giriş ve çıkış animasyonları uygulamak için kullanabilirsiniz. Giriş veya çıkış, aşağıdakilerden biriyle tetiklenebilir:

- `v-if` ile koşullu görüntüleme
- `v-show` ile koşullu görüntüleme
- `` özel öğesi aracılığıyla dinamik bileşen geçişleri
- Özel `key` özniteliğini değiştirme

Bu, en temel kullanımının bir örneğidir:

```vue-html
<button @click="show = !show">Aç/Kapat</button>
<Transition>
  <p v-if="show">merhaba</p>
</Transition>
```

```css
/* bu sınıfların ne yaptığını açıklayacağız! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```





[Playground'da Deneyin](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)




[Playground'da Deneyin](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)



:::tip
`` yalnızca bir öğe veya bileşeni slot içeriği olarak destekler. Eğer içerik bir bileşen ise, bileşenin de yalnızca bir adet kök öğesi olmalıdır.
:::

Bir `` bileşenine bir öğe eklendiğinde veya kaldırıldığında olanlar şunlardır:

1. Vue, hedef öğenin CSS geçişleri veya animasyonları olup olmadığını otomatik olarak kontrol eder. Eğer varsa, uygun zamanlarda `CSS geçiş sınıfları` eklenir veya kaldırılır.
   
2. `JavaScript kancaları` için dinleyiciler varsa, bu kancalar uygun zamanlarda çağrılır.

3. Eğer CSS geçişleri/animasyonları tespit edilmezse ve JavaScript kancaları sağlanmamışsa, DOM işlemleri ekleme ve/veya kaldırma için tarayıcının bir sonraki animasyon karesinde gerçekleştirilir.

## CSS Tabanlı Geçişler {#css-based-transitions}

### Geçiş Sınıfları {#transition-classes}

Giriş / çıkış geçişleri için altı sınıf uygulanır.

![Geçiş Diyagramı](../../../images/frameworks/vuejs/guide/built-ins/images/transition-classes.png)

1. `v-enter-from`: Giriş için başlangıç durumu. Öğenin eklenmesinden önce eklenir, öğe eklendikten bir çerçeve sonra kaldırılır.

2. `v-enter-active`: Giriş için aktif durum. Tüm giriş aşaması boyunca uygulanır. Öğenin eklenmesinden önce eklenir, geçiş/animasyon tamamlandığında kaldırılır. Bu sınıf, giriş geçişinin süresini, gecikmesini ve kolaylık eğrisini tanımlamak için kullanılabilir.

3. `v-enter-to`: Giriş için bitiş durumu. Öğenin eklenmesinden bir çerçeve sonra eklenir (aynı zamanda `v-enter-from` kaldırılır), geçiş/animasyon tamamlandığında kaldırılır.

4. `v-leave-from`: Çıkış için başlangıç durumu. Bir çıkış geçişi tetiklendiğinde hemen eklenir, bir çerçeve sonra kaldırılır.

5. `v-leave-active`: Çıkış için aktif durum. Tüm çıkış aşaması boyunca uygulanır. Bir çıkış geçişi tetiklendiğinde hemen eklenir, geçiş/animasyon tamamlandığında kaldırılır. Bu sınıf, çıkış geçişinin süresini, gecikmesini ve kolaylık eğrisini tanımlamak için kullanılabilir.

6. `v-leave-to`: Çıkış için bitiş durumu. Bir çıkış geçişi tetiklendiğinde bir çerçeve sonra eklenir (aynı zamanda `v-leave-from` kaldırılır), geçiş/animasyon tamamlandığında kaldırılır.

`v-enter-active` ve `v-leave-active`, giriş/çıkış geçişleri için farklı kolaylık eğrileri belirlememizi sağlar; bunu sonraki bölümlerde bir örnekte göreceğiz.

### İsimlendirilmiş Geçişler {#named-transitions}

Bir geçiş, `name` özniteliği aracılığıyla isimlendirilebilir:

```vue-html
<Transition name="fade">
  ...
</Transition>
```

İsimlendirilmiş bir geçiş durumunda, geçiş sınıfları `v` yerine ismi ile öneki alır. Örneğin, yukarıdaki geçiş için uygulanan sınıf `fade-enter-active` olacaktır. Fade geçişi için CSS şu şekilde görünmelidir:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### CSS Geçişleri {#css-transitions}

``, yukarıda görüldüğü gibi [yerel CSS geçişleri](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) ile kombinasyon halinde en yaygın şekilde kullanılır. `transition` CSS özelliği, animasyonlanması gereken özellikler, geçiş süresi ve [kolaylık eğrileri](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function) dahil olmak üzere geçişin birden fazla yönünü belirlememize olanak tanıyan bir kısayoldur.

İşte farklı süreler ve giriş ve çıkış için farklı kolaylık eğrileri ile birden fazla özelliği geçiren daha gelişmiş bir örnek:

```vue-html
<Transition name="slide-fade">
  <p v-if="show">merhaba</p>
</Transition>
```

```css
/*
  Giriş ve çıkış animasyonları farklı
  süreler ve zamanlama fonksiyonları kullanabilir.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```





[Playground'da Deneyin](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)




[Playground'da Deneyin](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)



### CSS Animasyonları {#css-animations}

[Yerel CSS animasyonları](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) CSS geçişleri ile aynı şekilde uygulanır, ancak fark, `*-enter-from` öğe eklendikten hemen sonra kaldırılmamaktadır, bunlar `animationend` olayıyla kaldırılır.

Çoğu CSS animasyonu için, bunları basitçe `*-enter-active` ve `*-leave-active` sınıflarının altında tanımlayabiliriz. İşte bir örnek:

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Merhaba burada biraz zıplayan metin var!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```





[Playground'da Deneyin](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)




[Playground'da Deneyin](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)



### Özel Geçiş Sınıfları {#custom-transition-classes}

Ayrıca `` bileşenine aşağıdaki öznitelikleri geçirerek özel geçiş sınıfları belirtebilirsiniz:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Bunlar geleneksel sınıf adlarını geçersiz kılacaktır. Bu, Vue'nun geçiş sistemini, [Animate.css](https://daneden.github.io/animate.css/) gibi mevcut bir CSS animasyon kütüphanesi ile birleştirmek istediğinizde özellikle faydalıdır:

```vue-html
<!-- Animate.css'in sayfada dahil edildiğini varsayıyoruz -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">merhaba</p>
</Transition>
```



[Playground'da Deneyin](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)




[Playground'da Deneyin](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)



### Geçişler ve Animasyonları Birlikte Kullanma {#using-transitions-and-animations-together}

Vue'nun bir geçişin ne zaman sona erdiğini bilmek için olay dinleyicileri eklemesi gerekir. Bu, uygulanan CSS kurallarının türüne bağlı olarak `transitionend` veya `animationend` olabilir. Eğer yalnızca birini kullanıyorsanız, Vue otomatik olarak doğru türü tespit edebilir.

Ancak bazı durumlarda, örneğin bir CSS animasyonunun Vue tarafından tetiklenmesi ve üzerine bir CSS geçiş etkisi olması gibi, her ikisini de aynı öğede bulundurmak isteyebilirsiniz. Bu durumda, Vue'nun dikkat etmesini istediğiniz türü açıkça belirlemeniz gerekir ve `type` özniteliğini, ya `animation` ya da `transition` değerine sahip olacak şekilde geçirmeniz gerekir:

```vue-html
<Transition type="animation">...</Transition>
```

### İç İçe Geçişler ve Açık Geçiş Süreleri {#nested-transitions-and-explicit-transition-durations}

Geçiş sınıfları yalnızca `` bileşenindeki doğrudan çocuk öğeye uygulanır, ancak iç içe CSS seçicileri kullanarak iç içe öğeleri geçiş yapabiliriz:

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Merhaba
    </div>
  </div>
</Transition>
```

```css
/* iç içe öğeleri hedefleyen kurallar */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... gerekli diğer CSS eksik */
```

Girişte içe geçmiş öğeye bir geçiş gecikmesi de ekleyebiliriz, bu da sıralı bir giriş animasyonu dizisi oluşturur:

```css{3}
/* içe geçmiş öğenin girişini sıralı etki için geciktirin */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

Ancak bu küçük bir sorunu beraberinde getirir. Varsayılan olarak, `` bileşeni geçişin ne zaman sona erdiğini otomatik olarak anlamaya çalışır ve bunu kök geçiş öğesindeki **ilk** `transitionend` veya `animationend` olayı dinleyerek yapar. İç içe bir geçişte, istenen davranış, tüm iç öğelerin geçişlerinin sona ermesini beklemektir.

Böyle durumlarda, `` bileşeninde `duration` özniteliğini kullanarak açık bir geçiş süresi (milisaniye cinsinden) belirtebilirsiniz. Toplam süre, iç öğenin gecikmesi ile geçiş süresinin toplamına eşit olmalıdır:

```vue-html
<Transition :duration="550">...</Transition>
```



[Playground'da Deneyin](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

### Performans Dikkatleri {#performance-considerations}

Üstte verilen animasyonların çoğunun `transform` ve `opacity` gibi özellikler kullandığını fark edebilirsiniz. Bu özellikleri animasyon yapmak verimlidir çünkü:

1. Animasyon sırasında belge düzenini etkilemezler, bu nedenle her animasyon karesinde pahalı CSS düzen hesaplamalarını tetiklemezler.
   
2. Çoğu modern tarayıcı, `transform` animasyonu yaparken GPU donanım hızlandırmasından yararlanabilir.

Buna karşın, `height` veya `margin` gibi özellikler CSS düzenini tetikleyecek, bu nedenle animasyon yapmak için daha pahalıdır ve dikkatle kullanılmalıdır.