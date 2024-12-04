---
title: Bileşim Seçenekleri
seoTitle: Bileşim Seçenekleri - Reaktif Bileşenler için Bir Kılavuz
sidebar_position: 4
description: Bileşim seçenekleri ile bileşenlerin nasıl sağlandığı ve enjekte edildiği hakkında bilgi. Bileşen mimarisi ve reaktiviteleri anlamak için gerekli detaylar.
tags: 
  - bileşim
  - reaktivite
  - Vue
keywords: 
  - bileşim
  - reaktif bileşenler
  - Vue 3
  - component options
---
## Options: Composition {#options-composition}

## provide {#provide}

Akran bileşenler tarafından enjekte edilebilecek değerleri sağlayın.

- **Type**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Details**

  `provide` ve `inject` birlikte kullanılır; bu, bir üst bileşenin tüm alt bileşenler için bir bağımlılık enjektörü olarak hizmet vermesine olanak tanır; bileşen hiyerarşisi ne kadar derin olursa olsun, aynı üst zincirde oldukları sürece.

  `provide` seçeneği ya bir nesne ya da bir nesne döndüren bir işlev olmalıdır. Bu nesne, alt bileşenlerine enjekte edilebilecek özellikleri içerir. Bu nesnede Anahtar olarak semboller kullanılabilir.

- **Example**

  Temel kullanım:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Her bileşen durumu sağlamak için bir işlev kullanma:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Yukarıdaki örnekte, sağlanan `msg` REAKTİF OLMAYACAKTIR. Daha fazla ayrıntı için `Reaktivite ile Çalışma` bölümüne bakın.

- **See also** `Provide / Inject`

## inject {#inject}

Şu anki bileşene, üst bileşen sağlayıcılardan yerleştirilmek üzere enjekte edilecek özellikleri tanımlayın.

- **Type**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Details**

  `inject` seçeneği şunlardan biri olmalıdır:

  - Bir dizi dize veya
  - Anahtarların yerel bağlama adı ve değerinin şu olduğu bir nesne:
    - Yerine geçilen maddelerde aranacak anahtar (string veya sembol) veya
    - Aşağıdaki şekillerde bir nesne:
      - `from` özelliği, yerine geçilecek maddelerde aranacak anahtar (string veya sembol) ve
      - `default` özelliği, varsayılan değer olarak kullanılır. Props varsayılan değerleri ile benzer şekilde, nesne türleri için değer paylaşımını önlemek için bir fabrika işlevi gereklidir.

  Bir enjekte edilmiş özellik, eşleşen bir özellik veya varsayılan değer sağlanmadıysa `undefined` olacaktır.

  Enjekte edilmiş bağlamaların REAKTİF OLMADIĞINI unutmayın. Bu kasıtlıdır. Ancak enjekte edilmiş değer reaktif bir nesne ise, o nesnedeki özellikler reaktif kalır. Daha fazla ayrıntı için `Reaktivite ile Çalışma` bölümüne bakın.

- **Example**

  Temel kullanım:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Enjekte edilmiş bir değeri prop varsayılan değeri olarak kullanma:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Enjekte edilmiş bir değeri veri girişi olarak kullanma:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Enjekte edilenler varsayılan değer ile isteğe bağlı olabilir:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Farklı bir adla enjekte edilmesi gerekiyorsa, kaynak özelliği belirtmek için `from` kullanın:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Nesne türleri için, yerel değerler ile gerekirse bir fabrika işlevi kullanmalısınız:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **See also** `Provide / Inject`

## mixins {#mixins}

Şu anki bileşene karıştırılacak seçenek nesnelerinin bir dizisi.

- **Type**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Details**

  `mixins` seçeneği, bir dizi mixin nesnesi alır. Bu mixin nesneleri, normal örnek nesneleri gibi örnek seçenekleri içerebilir ve belirli bir seçenek birleştirme mantığı kullanılarak nihai seçeneklerle birleştirilecektir. Örneğin, mixin belirli bir `created` kancası içeriyorsa ve bileşen de bir tane içeriyorsa, her iki işlev de çağrılacaktır.

  Mixin kancaları sağlandıkları sırayla çağrılır ve bileşenin kendi kancalarından önce çağrılır.

  :::warning
  Artık Tavsiye Edilmemektedir
  Vue 2'de mixin'ler, yeniden kullanılabilir bileşen mantıkları oluşturmanın birincil mekanizmasıydı. Vue 3'te mixin'ler desteklenmeye devam etse de, `Bileşim API'sini kullanarak Kompozit Fonksiyonlar` artık bileşenler arasında kod yeniden kullanımı için tercih edilen yaklaşımdır.
  :::

- **Example**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

Bir "temel sınıf" bileşeni genişletmek için.

- **Type**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Details**

  Bir bileşenin, bir diğerini genişletmesine olanak tanır ve onun bileşen seçeneklerini miras alır.

  Uygulama açısından, `extends`, `mixins` ile neredeyse özdeştir. `extends` ile belirtilen bileşen, birinci mixin olarak muamele görecektir.

  Ancak, `extends` ve `mixins` farklı niyetler ifade eder. `mixins` seçeneği öncelikle işlevselliğin parçalarını kompoze etmek için kullanılırken, `extends` öncelikle miras alma ile ilgilidir.

  `mixins` ile olduğu gibi, ilgili birleştirme stratejisi kullanılarak herhangi bir seçenek (setup() hariç) birleştirilecektir.

- **Example**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning
  Bileşim API'si için Tavsiye Edilmez
  `extends`, Seçenek API'si için tasarlanmıştır ve `setup()` kancasının birleştirilmesini işlemez.

  Bileşim API'sinde, mantık yeniden kullanımı için tercih edilen mental model "bileş"tir, "miras" değil. Eğer bir bileşenden başka bir bileşende yeniden kullanmanız gereken bir mantık varsa, ilgili mantığı `Kompozit` haline getirmenizi öneririz.

  Bileşim API'sini kullanarak bir bileşeni "genişletmek" istiyorsanız, temel bileşenin `setup()` işlevini genişletme bileşeninin `setup()` içinde çağırabilirsiniz:

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // yerel bağlamalar
      }
    }
  }
  ```
  :::