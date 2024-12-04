---
title: Geçiş Grupları
seoTitle: Transition Groups - Vue.js Documentation
sidebar_position: 4
description:  is a built-in component designed to create animations for items or components added, removed, or reordered within a list. This guide covers its features, differences with , and practical examples.
tags: 
  - Vue.js
  - Transition Groups
  - Animation
  - Web Development
keywords: 
  - transition group
  - animation
  - Vue.js
  - web development
---
## Geçiş Grupları {#transitiongroup}

`` , listede oluşturulan öğelerin veya bileşenlerin eklenmesi, kaldırılması ve sırasının değiştirilmesi için animasyon yapmak üzere tasarlanmış yerleşik bir bileşendir.

## `` ile Farklılıklar {#differences-from-transition}

`` aşağıdaki farklılıklarla birlikte `` ile aynı özellikleri, CSS geçiş sınıflarını ve JavaScript kanca dinleyicilerini destekler:

- Varsayılan olarak, bir sarmalayıcı öğe render etmez. Ancak `tag` özelliği ile render edilmesi gereken bir öğeyi belirtebilirsiniz.
  
- `Geçiş modları` mevcut değildir, çünkü karşılıklı olarak dışlayıcı öğeler arasında geçiş yapmıyoruz.

- İçerideki öğelerin **her zaman** benzersiz bir `key` niteliğine sahip olması gerekir.

- CSS geçiş sınıfları, liste içindeki bireysel öğelere uygulanacak, **grup / konteyner** üzerine değil.

:::tip
`in-DOM şablonlarında` kullanıldığında, `` olarak referans verilmelidir.
:::

## Girme / Çıkma Geçişleri {#enter-leave-transitions}

Aşağıda `` kullanarak bir `v-for` listesine girme / çıkma geçişlerini uygulama örneği verilmiştir:

```vue-html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```



## Taşıma Geçişleri {#move-transitions}

Yukarıdaki demo bazı belirgin hatalara sahiptir: bir öğe eklendiğinde veya kaldırıldığında, çevresindeki öğeler anında "zıplar" yerine düzgün bir şekilde hareket etmez. Bunu, birkaç ek CSS kuralı ekleyerek düzeltebiliriz:

```css{1,13-17}
.list-move, /* hareket eden öğelere geçiş uygula */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* çıkmakta olan öğelerin düzen akışından çıkarılması sağlanır,
   böylece hareket animasyonları doğru şekilde hesaplanabilir. */
.list-leave-active {
  position: absolute;
}
```

Artık çok daha iyi görünüyor - hatta tüm liste karıştırıldığında düzgün bir şekilde animasyon yapılabiliyor:



`Tam Örnek`

### Özel Geçiş Grubu Sınıfları {#custom-transitiongroup-classes}

Hareket eden öğe için `moveClass` özelliğini geçirerek `` üzerine özel geçiş sınıfları da belirtebilirsiniz, tıpkı ` `` üzerindeki özel geçiş sınıflarında olduğu gibi`.

## Liste Geçişlerinin Gecikmesi {#staggering-list-transitions}

JavaScript geçişleri ile veri öznitelikleri aracılığıyla iletişim kurarak, bir listede geçişlerin gecikmesini sağlamak da mümkündür. İlk olarak, bir öğenin indeksini DOM öğesi üzerine bir veri özniteliği olarak render ediyoruz:

```vue-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

Daha sonra, JavaScript kancalarında, veri özniteliğine dayanan bir gecikme ile öğeyi animasyonluyoruz. Bu örnekte [GSAP kütüphanesi](https://gsap.com/) animasyonu gerçekleştirmek için kullanılıyor:

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```





[Tam Örnek Oyun Alanında](https://play.vuejs.org/#eNqlVMuu0zAQ/ZVRNklRm7QLWETtBW4FSFCxYkdYmGSSmjp28KNQVfl3xk7SFyvEponPGc+cOTPNOXrbdenRYZRHa1Nq3lkwaF33VEjedkpbOIPGeg6lajtnsYIeaq1aiOlSfAlqDOtG3L8SUchSSWNBcPrZwNdCAqVqTZND/KxdibBDjKGf3xIfWXngCNs9k4/Udu/KA3xWWnPz1zW0sOOP6CcnG3jv9ImIQn67SvrpUJ9IE/WVxPHsSkw97gbN0zFJZrB5grNPrskcLUNXac2FRZ0k3GIbIvxLSsVTq3bqF+otM5jMUi5L4So0SSicHplwOKOyfShdO1lariQo+Yy10vhO+qwoZkNFFKmxJ4Gp6ljJrRe+vMP3yJu910swNXqXcco1h0pJHDP6CZHEAAcAYMydwypYCDAkJRdX6Sts4xGtUDAKotIVs9Scpd4q/A0vYJmuXo5BSm7JOIEW81DVo77VR207ZEf8F23LB23T+X9VrbNh82nn6UAz7ASzSCeANZe0AnBctIqqbIoojLCIIBvoL5pJw31DH7Ry3VDKsoYinSii4ZyXxhBQM2Fwwt58D7NeoB8QkXfDvwRd2XtceOsCHkwc8KCINAk+vADJppQUFjZ0DsGVGT3uFn1KSjoPeKLoaYtvCO/rIlz3vH9O5FiU/nXny/pDT6YGKZngg0/Zg1GErrMbp6N5NHxJFi3N/4dRkj5IYf5ULxCmiPJpI4rIr4kHimhvbWfyLHOyOzQpNZZ57jXNy4nRGFLTR/0fWBqe7w==)




[Tam Örnek Oyun Alanında](https://play.vuejs.org/#eNqtVE2P0zAQ/SujXNqgNmkPcIjaBbYCJKg4cSMcTDJNTB07+KNsVfW/M3aabNpyQltViT1vPPP8Zian6H3bJgeHURatTKF5ax9yyZtWaQuVYS3stGpg4peTXOayUNJYEJwea/ieS4ATNKbKYPKoXYGwRZzAeTYGPrNizxE2NZO30KZ2xR6+Kq25uTuGFrb81vrFyQo+On0kIJc/PCV8CmxL3DEnLJy8e8ksm8bdGkCjdVr2O4DfDvWRgtGN/JYC0SOkKVTTOotl1jv3hi3d+DngENILkey4sKinU26xiWH9AH6REN/Eqq36g3rDDE7jhMtCuBLN1NbcJIFEHN9RaNDWqjQDAyUfcac0fpA+CYoRCRSJsUeBiWpZwe2RSrK4w2rkVe2rdYG6LD5uH3EGpZI4iuurTdwDNBjpRJclg+UlhP914UnMZfIGm8kIKVEwciYivhoGLQlQ4hO8gkWyfD1yVHJDKgu0mAUmPXLuxRkYb5Ed8H8YL/7BeGx7Oa6hkLmk/yodBoo21BKtYBZpB7DikroKDvNGUeZ1HoVmyCNIO/ibZtJwy5X8pJVru9CWVeTpRB51+6wwhgw7Jgz2tnc/Q6/M0ZeWwKvmGZye0Wu78PIGexC6swdGxEnw/q6HOYUkt9DwMwhKxfS6GpY+KPHc45G8+6EYAV7reTjucf/uwUtSmvvTME1wDuISlVTwTqf0RiiyrtKR0tEs6r5l84b645dRkr5zoT8oXwBMHg2Tlke+jbwhj2prW5OlqZPtvkroYqnH3lK9nLgI46scnf8Cn22kBA==)