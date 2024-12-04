---
title: Yerleşik Bileşenler
seoTitle: Yerleşik Bileşenler - Vue
sidebar_position: 4
description: Yerleşik bileşenler, şablonlarda doğrudan kullanılabilir. Animasyon geçişleri ve diğer özellikleri hakkında daha fazla bilgi için okuyun.
tags: 
  - Vue
  - Bileşenler
  - Animasyon
  - Geliştiriciler
keywords: 
  - yerleşik bileşenler
---
## Yerleşik Bileşenler {#built-in-components}

:::info Kayıt ve Kullanım
Yerleşik bileşenler, kaydetmeye gerek kalmadan şablonlarda doğrudan kullanılabilir. Ayrıca ağaç sarsıcıdır: yalnızca kullanıldıklarında yapıma dahil edilurlar.

Onları `render fonksiyonları` içinde kullanırken, açıkça içe aktarılmaları gerekir. Örneğin:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `` {#transition}

**Tekil** bir öğe veya bileşen için animasyonlu geçiş efektleri sağlar.

- **Props**

  ```ts
  interface TransitionProps {
    /**
     * Geçiş CSS sınıf adlarını otomatik olarak oluşturmak için kullanılır.
     * örn. `name: 'fade'`, `.fade-enter`, `.fade-enter-active` gibi otomatik genişler.
     */
    name?: string
    /**
     * CSS geçiş sınıflarını uygulayıp uygulamamak.
     * Varsayılan: true
     */
    css?: boolean
    /**
     * Geçişin son zamanlamasını belirlemek için beklemek gereken geçiş olaylarının türünü belirtir.
     * Varsayılan davranış, en uzun süreye sahip olan türü otomatik olarak algılamaktır.
     */
    type?: 'transition' | 'animation'
    /**
     * Geçişin açık sürelerini belirtir.
     * Varsayılan davranış, kök geçiş öğesindeki ilk `transitionend` veya `animationend` olayını beklemektir.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Ayrılma/giriş geçişlerinin zamanlamasını kontrol eder.
     * Varsayılan davranış eşzamanlıdır.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * İlk render'da geçiş uygulatıp uygulatmamak.
     * Varsayılan: false
     */
    appear?: boolean

    /**
     * Geçiş sınıflarını özelleştirmek için props.
     * Şablonlarda kebab-case kullanın, örn. enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Olaylar**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (`v-show` yalnızca)
  - `@appear-cancelled`

- **Örnek**

  Basit öğe:

  ```vue-html
  <Transition>
    <div v-if="ok">değiştirilmiş içerik</div>
  </Transition>
  ```

  `key` niteliğini değiştirerek geçişi zorlamak:

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Dinamik bileşen, geçiş modu ile + görünümde animasyon:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Geçiş olaylarını dinlemek:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">değiştirilmiş içerik</div>
  </Transition>
  ```

- **Ayrıca bakınız** `Kılavuz - Geçiş`

## `` {#transitiongroup}

Listede **birden fazla** öğe veya bileşen için geçiş efektleri sağlar.

- **Props**

  ``, `` ile aynı props'ları alır, ancak `mode` dışında iki ek prop' kabul eder:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * Belirtilmemişse, bir fragment olarak render eder.
     */
    tag?: string
    /**
     * Hareket geçişleri sırasında uygulanan CSS sınıfını özelleştirmek için.
     * Şablonlarda kebab-case kullanın, örn. move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Olaylar**

  ``, `` ile aynı olayları yayar.

- **Ayrıntılar**

  Varsayılan olarak, `` bir sarmalayıcı DOM öğesi render etmez, ancak `tag` prop'u aracılığıyla bir tanımlanabilir.

  `` içindeki her çocuğun `**eşsiz anahtarlarla**` tanımlanması gerekmektedir, böylece animasyonlar düzgün çalışır.

  ``, CSS dönüşümü aracılığıyla hareket geçişlerini destekler. Bir çocuğun ekrandaki konumu güncellemeden sonra değişirse, `name` niteliği veya `move-class` prop'u ile yapılandırılan bir hareket CSS sınıfı uygulanır. CSS `transform` özelliği hareketli sınıf uygulandığında "geçiş edilebilir" ise, öğe [FLIP tekniği](https://aerotwist.com/blog/flip-your-animations/) ile varış noktasına düzgün bir şekilde animasyonlu hale gelecektir.

- **Örnek**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **Ayrıca bakınız** `Kılavuz - TransitionGroup`

## `` {#keepalive}

Dinamik olarak değiştirilmiş bileşenleri içinde saklar.

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * Belirtilirse, yalnızca `include` ile eşleşen adlara sahip bileşenler önbelleğe alınır.
     */
    include?: MatchPattern
    /**
     * `exclude` ile eşleşen herhangi bir bileşen önbelleğe alınmayacaktır.
     */
    exclude?: MatchPattern
    /**
     * Önbelleğe alınacak maksimum bileşen örneği sayısı.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Ayrıntılar**

  Dinamik bir bileşenin etrafında sarıldığında, ``, inaktif bileşen örneklerini yok etmeden önbelleğe alır.

  ``'in doğrudan çocuğu olarak yalnızca bir aktif bileşen örneği olabilir.

  Bir bileşen `` içinde değiştiğinde, `activated` ve `deactivated` yaşam döngüsü kancaları sırasıyla çağrılacaktır; bu, `mounted` ve `unmounted`'dan alternatif sağlar, çünkü bunlar çağrılmaz. Bu, ``'in doğrudan çocuğu için ve tüm alt öğeleri için geçerlidir.

- **Örnek**

  Temel kullanım:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  `v-if` / `v-else` dalları ile kullanıldığında, yalnızca bir bileşenin aynı anda render edilmesi gerekir:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  `` ile birlikte kullanıldığında:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  `include` / `exclude` ile kullanım:

  ```vue-html
  <!-- virgülle ayrılmış dize -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (v-bind kullanın) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- Dizi (v-bind kullanın) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  `max` ile kullanım:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **Ayrıca bakınız** `Kılavuz - KeepAlive`

## `` {#teleport}

Slot içeriğini DOM'un başka bir bölümüne render eder.

- **Props**

  ```ts
  interface TeleportProps {
    /**
     * Gerekli. Hedef konteyneri belirtin.
     * Ya bir seçimci ya da gerçek bir öğe olabilir.
     */
    to: string | HTMLElement
    /**
     * `true` olduğunda, içerik orijinal konumunda kalır,
     * hedef konteynere taşınmaz.
     * Dinamik olarak değiştirilebilir.
     */
    disabled?: boolean
    /**
     * `true` olduğunda, Teleport, diğer
     * uygulama parçaları monte edildikten sonra
     * hedefini çözümlemeyi erteleyebilir. (3.5+)
     */
    defer?: boolean
  }
  ```

- **Örnek**

  Hedef konteyner belirtme:

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  Koşullu olarak devre dışı bırakma:

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

  Hedef çözümlemesini erteleme :

  ```vue-html
  <Teleport defer to="#late-div">...</Teleport>

  <!-- şablonun ilerleyen kısımlarında -->
  <div id="late-div"></div>
  ```

- **Ayrıca bakınız** `Kılavuz - Teleport`

## ``  {#suspense}

Bileşen ağacındaki iç içe geçmiş asenkron bağımlılıkları düzenlemek için kullanılır.

- **Props**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
    suspensible?: boolean
  }
  ```

- **Olaylar**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Ayrıntılar**

  ``, `#default` slot'u ve `#fallback` slot'u kabul eder. Varsayılan slot' u render ederken geri dönüş slot'unun içeriğini görüntüler.

  Varsayılan slot'u render ederken asenkron bağımlılıklar (`Asenkron Bileşenler` ve `async setup()`) ile karşılaşırsa, varsayılan slot'u görüntülemeden önce hepsinin çözülmesini bekler.

  `Suspense`'ı `suspensible` olarak ayarlarsanız, tüm asenkron bağımlılık işlemleri üstteki `Suspense` tarafından yönetilir. [uygulama ayrıntılarına](https://github.com/vuejs/core/pull/6736) bakın.

- **Ayrıca bakınız** `Kılavuz - Suspense`