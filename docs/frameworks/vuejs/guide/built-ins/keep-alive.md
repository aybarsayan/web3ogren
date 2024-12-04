---
title: KeepAlive
seoTitle: Understanding KeepAlive in Vue
sidebar_position: 4
description: The  component conditionally caches component instances while dynamically transitioning between them, preserving the component state. Learn how to use it effectively in your Vue applications.
tags: 
  - Vue
  - KeepAlive
  - Component Caching
keywords: 
  - Vue
  - KeepAlive
  - Dynamic Components
---


## KeepAlive {#keepalive}

> `` bileşeni, birden çok bileşen arasında dinamik geçiş yaparken bileşen örneklerini koşullu olarak önbelleklememizi sağlar. — Vue Documentation

## Temel Kullanım {#basic-usage}

Bileşen Temelleri bölümünde, ` özel elemanını kullanarak `Dinamik Bileşenler için sözdizimini tanıttık:

```vue-html
<component :is="activeComponent" />
```

Varsayılan olarak, bir aktif bileşen örneği, ona geçiş yapıldığında kaldırılır. Bu durum, içerdiği değiştirilen durumun kaybolmasına neden olur. Bu bileşen tekrar görüntülendiğinde, yalnızca başlangıç durumu ile yeni bir örnek oluşturulacaktır.

Aşağıdaki örnekte, birini güncellemeyi deneyin, dışarıya geçin ve ardından tekrar geri dönün:



Geri dönüldüğünde, önceki değiştirilen durumun sıfırlandığını fark edeceksiniz.

Geçiş sırasında taze bileşen örneği oluşturmak genellikle yararlıdır, ancak bu durumda, her iki bileşen örneğinin de inaktif olduklarında bile korunmasını istiyoruz. Bu sorunu çözmek için dinamik bileşenimizi yerleşik bileşeni ile sarmalayabiliriz:

```vue-html
<!-- İnatçı bileşenler önbelleğe alınacaktır! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Artık durum, bileşen geçişleri arasında kalıcı hale gelecektir:




[Playground'da deneyin](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)



[Playground'da deneyin](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)


:::tip
`in-DOM şablonları kullanıldığında, ` olarak referans verilmelidir.
:::

## Dahil Et / Hariç Tut {#include-exclude}

Varsayılan olarak, `` içindeki herhangi bir bileşen örneğini önbelleğe alır. Davranışı `include` ve `exclude` prop'ları ile özelleştirebiliriz. Her iki prop da virgülle ayrılmış bir dize, bir `RegExp` veya bu iki türü içeren bir dizi olabilir:

```vue-html
<!-- virgülle ayrılmış dize -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (v-bind kullanın) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Dizi (v-bind kullanın) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

Eşleşme, bileşenin `name` seçeneği ile kontrol edildiği için, `KeepAlive` tarafından koşullu olarak önbelleklenmesi gereken bileşenler açık bir `name` seçeneği beyan etmelidir.

:::tip
3.2.34 sürümünden itibaren, `` kullanan tek dosya bileşeni, dosya adına bağlı olarak `name` seçeneğini otomatik olarak çıkarır, bu nedenle adı manuel olarak beyan etme ihtiyacı ortadan kalkar.
:::

## Maksimum Önbelleklenmiş Örnekler {#max-cached-instances}

`max` prop'u ile önbelleğe alınabilecek bileşen örneklerinin maksimum sayısını sınırlayabiliriz. `max` belirtildiğinde, `` bir `LRU önbelleği`>) gibi davranır: önbelleğe alınan örneklerin sayısı belirtilen maksimum sayıyı aşmak üzereyse, en az erişilen önbelleklenmiş örnek, yeni örnekler için yer açmak amacıyla yok edilir.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Önbelleklenmiş Örneklerin Yaşam Döngüsü {#lifecycle-of-cached-instance}

Bir bileşen örneği DOM'dan kaldırıldığında ancak `` tarafından önbelleklenmiş bir bileşen ağacının parçası olduğunda, **deactivate** durumuna geçer. Bir bileşen örneği, önbellekteki ağaç parçası olarak DOM'a eklendiğinde, **active** olur.


Bir kept-alive bileşeni, bu iki durum için yaşam döngüsü kancaları kaydedebilir, `onActivated()` ve `onDeactivated()`:

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // ilk montajda çağrılır
  // ve önbellekten her yeniden yerleştirildiğinde
})

onDeactivated(() => {
  // DOM'dan önbelleğe kaldırıldığında ve
  // ayrıca monte edilmediğinde çağrılır
})
</script>
```



Bir kept-alive bileşeni, bu iki durum için yaşam döngüsü kancaları kaydedebilir, `activated` ve `deactivated` kancaları:

```js
export default {
  activated() {
    // ilk montajda çağrılır
    // ve önbellekten her yeniden yerleştirildiğinde
  },
  deactivated() {
    // DOM'dan önbelleğe kaldırıldığında
    // ve ayrıca monte edilmediğinde çağrılır
  }
}
```


Not edin ki:

- `onActivated``activated` ayrıca montajda çağrılır ve `onDeactivated``deactivated` monte edilmediğinde çağrılır.

- Her iki kanca da yalnızca `` tarafından önbelleklenen kök bileşen için değil, aynı zamanda önbellekli ağaçtaki alt bileşenler için de çalışır.