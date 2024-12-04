---
title: Özelleşmiş Eleman API
seoTitle: Özelleşmiş Eleman API - Vue Dokümantasyonu
sidebar_position: 4
description: Özelleşmiş elemanlar için defineCustomElement yönteminin nasıl kullanılacağına dair bilgi verilmektedir. Ayrıca useHost, useShadowRoot ve this.$host gibi yardımcı işlevler de ele alınmaktadır.
tags: 
  - özelleşmiş eleman
  - vue
  - web bileşenleri
  - javascript
keywords: 
  - özelleşmiş eleman
  - vue
  - web bileşenleri
  - defineCustomElement
  - useHost
  - useShadowRoot
---
## Özelleşmiş Eleman API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Bu yöntem, `defineComponent` ile aynı argümanı kabul eder, ancak bunun yerine yerel [Özelleşmiş Eleman](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) sınıf yapıcısını döndürür.

- **Tür**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // aşağıdaki seçenekler 3.5+ içindir
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > Tür, okunabilirlik için basitleştirilmiştir.

- **Ayrıntılar**

  Normal bileşen seçeneklerine ek olarak, `defineCustomElement()` ayrıca özelleşmiş elemanlara özgü bazı seçenekleri destekler:

  :::info
  - **`styles`**: elemanın gölge köküne enjekte edilmesi gereken CSS sağlayan iç içe geçmiş CSS dizelerinin bir dizisi.
  
  - **`configureApp`** : özelleşmiş eleman için Vue uygulama örneğini yapılandırmak için kullanılabilecek bir fonksiyon.
  
  - **`shadowRoot`** : `boolean`, varsayılan olarak `true`'dur. Özelleşmiş elemanı gölge kök olmadan render etmek için `false` olarak ayarlayın. Bu, özelleşmiş eleman SFC'lerinde `` etiketinin artık kapsüllenmeyeceği anlamına gelir.
  
  - **`nonce`** : `string`, sağlanırsa gölge köküne enjekte edilen stil etiketlerinde `nonce` niteliği olarak ayarlanır.
  :::

  Bu seçeneklerin bileşenin kendisinin bir parçası olarak iletilmek yerine, ikinci bir argüman olarak da iletilebileceğini unutmayın:

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  Dönüş değeri, [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) kullanılarak kaydedilebilen bir özelleşmiş eleman yapıcısıdır.

- **Örnek**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* bileşen seçenekleri */
  })

  // Özelleşmiş elemanı kaydet.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Ayrıca bakınız**

  - `Kılavuz - Vue ile Özelleşmiş Elemanlar Oluşturma`

  - Ayrıca `defineCustomElement()` kullanılırken `özel yapılandırma` gerektiğini unutmayın.

## useHost()  {#usehost}

Geçerli Vue özelleşmiş elemanının ana elemanını döndüren bir Composition API yardımcı işlevi.

## useShadowRoot()  {#useshadowroot}

Geçerli Vue özelleşmiş elemanının gölge kökünü döndüren bir Composition API yardımcı işlevi.

## this.$host  {#this-host}

Geçerli Vue özelleşmiş elemanının ana elemanını sağlayan bir Options API özelliği.