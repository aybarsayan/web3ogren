---
title: Renderleme Seçenekleri
seoTitle: Renderleme Seçenekleri - Vue.js
sidebar_position: 4
description: Bu belge, Vue.js bileşenlerinde renderleme seçenekleri hakkında ayrıntılı bilgi sağlar. Şablon, render ve compilerOptions gibi konular ele alınmaktadır.
tags: 
  - Vue.js
  - Bileşen Geliştirme
  - Renderleme
keywords: 
  - renderleme
  - bileşen
  - şablon
  - compilerOptions
  - Vue
---
## Seçenekler: Renderleme {#options-rendering}

## şablon {#template}

Bileşen için bir dize şablonu.

- **Tür**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Ayrıntılar**

  `template` seçeneği aracılığıyla sağlanan bir şablon, çalışma zamanında dinamik olarak derlenecektir. Sadece şablon derleyicisini içeren bir Vue yapısında desteklenmektedir. Şablon derleyicisi, isimlerinde `runtime` kelimesi geçen Vue yapılarında **DAHİL DEĞİLDİR**, örneğin `vue.runtime.esm-bundler.js`. Farklı yapıların detayları için [dist dosya rehberine](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) bakın.

  Dize `#` ile başlıyorsa, `querySelector` olarak kullanılacak ve seçilen öğenin `innerHTML`'si şablon dizesi olarak kullanılacaktır. Bu, kaynak şablonun yerel `` öğeleri kullanılarak yazılmasına olanak tanır.

  Aynı bileşende `render` seçeneği mevcutsa, `template` dikkate alınmayacaktır.

  Uygulamanızın kök bileşeninde bir `template` veya `render` seçeneği belirtilmemişse, Vue, montelenmiş öğenin `innerHTML`'sini şablon olarak kullanmayı deneyecektir.

  :::warning Güvenlik Notu
  Güvenebileceğiniz şablon kaynaklarını kullanın. Kullanıcı tarafından sağlanan içeriği şablonunuz olarak kullanmayın. Daha fazla bilgi için `Güvenlik Rehberi` sayfasına bakın.
  :::

## render {#render}

Bileşenin sanal DOM ağacını programatik olarak döndüren bir işlev.

- **Tür**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Ayrıntılar**

  `render`, bileşenin render çıktısını belirtmek için JavaScript'in tam programatik gücünden yararlanmanıza olanak tanıyan bir dize şablonuna alternatif bir seçenektir.

  Önceden derlenmiş şablonlar, örneğin Tek Dosya Bileşenlerinde, derleme zamanında `render` seçeneğine derlenir. Bir bileşende hem `render` hem de `template` mevcutsa, `render` daha yüksek önceliğe sahiptir.

- **Ayrıca bakınız**
  - `Renderleme Mekanizması`
  - `Render Fonksiyonları`

## compilerOptions {#compileroptions}

Bileşenin şablonuna yönelik çalışma zamanı derleyici seçeneklerini yapılandırın.

- **Tür**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // varsayılan: 'condense'
      delimiters?: [string, string] // varsayılan: ['{{', '}}']
      comments?: boolean // varsayılan: false
    }
  }
  ```

- **Ayrıntılar**

  Bu yapılandırma seçeneği, yalnızca tam yapıyı (yani tarayıcıda şablon derleyebilen bağımsız `vue.js` dosyasını) kullandığınızda dikkate alınır. Aynı işlevsellik, uygulama düzeyi `app.config.compilerOptions` ile desteklenir ve mevcut bileşen için daha yüksek önceliğe sahiptir.

- **Ayrıca bakınız** `app.config.compilerOptions`

## slotlar {#slots}

- Sadece 3.3+ sürümünde desteklenmektedir

Render fonksiyonlarında slotları programatik olarak kullanırken tür çıkarımını destekleyen bir seçenek.

- **Ayrıntılar**

  Bu seçeneğin çalışma zamanı değeri kullanılmaz. Gerçek türler, `SlotsType` tür yardımcısını kullanarak tür aktarımı yoluyla bildirilmelidir:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```