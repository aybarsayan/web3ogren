---
title: Seçenekler Çeşitli
seoTitle: Bileşen Seçenekleri ve Özellikleri
sidebar_position: 4
description: Bu belge, bileşen seçeneklerini ve özelliklerini özetlemektedir. Bileşen adı, geçerli nitelikler ve bileşen kaydı hakkında bilgiler sunulmaktadır.
tags: 
  - bileşen
  - Vue
  - JavaScript
  - web geliştirme
keywords: 
  - bileşen seçenekleri
  - Vue bileşeni
  - teknik terimler
  - frontend geliştirici
---
## name {#name}

Bileşen için bir görüntü adı açıkça belirtin.

- **Tip**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Ayrıntılar**

  Bir bileşenin adı, aşağıdakiler için kullanılır:

  - Bileşenin kendi şablonunda yinelemeli kendine referans
  - Vue DevTools'un bileşen inceleme ağacında görüntülenme
  - Uyarı bileşeni izinde görüntülenme

  Tek Dosya Bileşenleri kullandığınızda, bileşen ismi dosya adından otomatik olarak çıkar. Örneğin, `MyComponent.vue` adı verilen bir dosya, "MyComponent" olarak çıkarılan görüntü adına sahip olacaktır.

  Başka bir durum ise, bir bileşen `app.component` ile küresel olarak kaydedildiğinde, küresel ID otomatik olarak adı olarak ayarlanır.

  `name` seçeneği, çıkarılan ismi geçersiz kılmanıza veya çıkarılan isim elde edilemediğinde (örneğin, derleme araçları kullanılmadığında veya bir satır içi SFC dışındaki bir bileşen için) açıkça bir isim belirtmenize olanak tanır.

  `name`'in açıkça gerekli olduğu bir durum vardır: `` içinde `include / exclude` özelliklerine karşı önbelleğe alınabilir bileşenlerle eşleşirken.

  :::tip
  3.2.34 sürümünden itibaren, `` kullanan bir tek dosya bileşeni, dosya adına dayalı olarak otomatik olarak `name` seçeneğini çıkarır; bu nedenle, adı manuel olarak belirtme gerekliliğini ortadan kaldırır, hatta `` ile kullanıldığında bile.
  :::

## inheritAttrs {#inheritattrs}

Varsayılan bileşen niteliği geçirimi davranışının etkin olup olmayacağını kontrol eder.

- **Tip**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // varsayılan: true
  }
  ```

- **Ayrıntılar**

  Varsayılan olarak, tanınmayan üst kapsam niteliği bağlamaları "geçer". Bu, tek kök bileşene sahip olduğumuzda, bu bağlamaların çocuk bileşenin kök elemanına normal HTML niteliği olarak uygulanacağı anlamına gelir. Hedef bir öğeyi veya başka bir bileşeni saran bir bileşen oluştururken, bu her zaman istenen bir davranış olmayabilir. `inheritAttrs`'i `false` olarak ayarlayarak, bu varsayılan davranışı devre dışı bırakabilirsiniz. Nitelikler, `$attrs` örnek özelliği aracılığıyla erişilebilir ve `v-bind` kullanılarak kök olmayan bir öğeye açıkça bağlanabilir.

- **Örnek**

  

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  
  

  Bu seçeneği `` kullanan bir bileşende belirlediğinizde, `defineOptions` makrosunu kullanabilirsiniz:

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  

- **Ayrıca bakınız**

  - `Geçen Nitelikler`
  

  - `Normal `` içinde `inheritAttrs` kullanma`
  

## components {#components}

Bileşen örneğine sunulabilecek bileşenleri kaydeden bir nesne.

- **Tip**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Örnek**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // kısayol
      Foo,
      // farklı bir ad altında kaydet
      RenamedBar: Bar
    }
  }
  ```

- **Ayrıca bakınız** `Bileşen Kaydı`

## directives {#directives}

Bileşen örneğine sunulabilecek direktifleri kaydeden bir nesne.

- **Tip**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Örnek**

  ```js
  export default {
    directives: {
      // şablonda v-focus'u etkinleştirir
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

- **Ayrıca bakınız** `Özel Direktifler`