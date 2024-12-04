---
title: Uygulama APIsi
seoTitle: Uygulama APIsi - Vue
sidebar_position: 1
description: Vue uygulamaları için API fonksiyonlarının detaylarını içeren bir rehberdir. Bu içerik, uygulama oluşturmaktan, bileşen yönetimine kadar bir dizi temel konuyu kapsamaktadır.
tags: 
  - Vue
  - API
  - Uygulama
  - Bileşen
keywords: 
  - Vue
  - API
  - Uygulama
  - Bileşen
---
## Uygulama API'si {#application-api}

## createApp() {#createapp}

Bir uygulama örneği oluşturur.

- **Tip**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Ayrıntılar**

  İlk argüman, kök bileşendir. İkinci isteğe bağlı argüman, kök bileşene iletilecek özelliklerdir.

- **Örnek**

  Inline kök bileşeni ile:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* kök bileşen seçenekleri */
  })
  ```

  İçe aktarılan bileşen ile:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **Ayrıca bakınız** `Kılavuz - Vue Uygulaması Oluşturma`

## createSSRApp() {#createssrapp}

`SSR Hidratasyonu` modunda bir uygulama örneği oluşturur. Kullanımı tam olarak aynı şekilde `createApp()` ile.

## app.mount() {#app-mount}

Uygulama örneğini bir konteyner elementine monte eder.

- **Tip**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Ayrıntılar**

  Argüman, ya gerçek bir DOM elemanı ya da bir CSS seçici olabilir (ilk eşleşen eleman kullanılacaktır). Kök bileşen örneğini döndürür.

  Eğer bileşenin bir şablonu veya bir render fonksiyonu tanımlanmışsa, konteyner içindeki mevcut DOM düğümlerinin yerini alacaktır. Aksi takdirde, eğer çalışma zamanı derleyicisi mevcutsa, konteynerin `innerHTML`'si şablon olarak kullanılacaktır.

  SSR hidratasyon modunda, konteyner içindeki mevcut DOM düğümlerini hidrante edecektir. Eğer `uyumsuzluklar` varsa, mevcut DOM düğümleri beklenen çıktıya uyması için şekillendirilecektir.

  Her uygulama örneği için, `mount()` yalnızca bir kez çağrılabilir.

- **Örnek**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  Gerçek bir DOM elemanına da monte edilebilir:

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

Monte edilmiş bir uygulama örneğini kaldırır ve uygulamanın bileşen ağacındaki tüm bileşenler için kaldırma yaşam döngüsü kancalarını tetikler.

- **Tip**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.onUnmount()  {#app-onunmount}

Uygulama kaldırıldığında çağrılacak bir geri çağırma kaydeder.

- **Tip**

  ```ts
  interface App {
    onUnmount(callback: () => any): void
  }
  ```

## app.component() {#app-component}

Hem bir ad dizgesi hem de bir bileşen tanımı geçirilirse küresel bir bileşeni kaydeder veya yalnızca ad geçilirse daha önce kaydedilmiş bir bileşeni alır.

- **Tip**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Örnek**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // bir seçenek nesnesi kaydet
  app.component('my-component', {
    /* ... */
  })

  // kaydedilmiş bir bileşeni al
  const MyComponent = app.component('my-component')
  ```

- **Ayrıca bakınız** `Bileşen Kaydı`

## app.directive() {#app-directive}

Hem bir ad dizgesi hem de bir yönerge tanımı geçirilirse küresel bir özel yönerge kaydeder veya yalnızca ad geçilirse daha önce kaydedilmiş bir yönergeyi alır.

- **Tip**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Örnek**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // kaydet (nesne yönergesi)
  app.directive('my-directive', {
    /* özel yönerge kancaları */
  })

  // kaydet (fonksiyon yönerge kısa yolu)
  app.directive('my-directive', () => {
    /* ... */
  })

  // kaydedilmiş bir yönergeyi al
  const myDirective = app.directive('my-directive')
  ```

- **Ayrıca bakınız** `Özel Yönergeler`

## app.use() {#app-use}

Bir `eklenti` yükler.

- **Tip**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Ayrıntılar**

  Eklentiyi ilk argüman olarak ve isteğe bağlı eklenti seçeneklerini ikinci argüman olarak bekler.

  Eklenti, bir `install()` yöntemine sahip bir nesne ya da `install()` yöntemi olarak kullanılacak bir fonksiyon olabilir. `app.use()`'nin ikinci argümanı olan seçenekler, eklentinin `install()` yöntemine iletilecektir.

  Aynı eklenti üzerine `app.use()` birçok kez çağrıldığında, eklenti yalnızca bir kez yüklenir.

- **Örnek**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **Ayrıca bakınız** `Eklentiler`

## app.mixin() {#app-mixin}

Küresel bir karışım (uygulamayla sınırlı) uygular. Küresel bir karışım, içerdiği seçenekleri uygulamadaki her bileşen örneğine uygular.

:::warning Tavsiye Edilmez
Karışımlar Vue 3'te ana olarak geriye dönük uyumluluk için desteklenmektedir, çünkü ekosistem kütüphanelerinde yaygın olarak kullanılmaktadır. Karışımların, özellikle küresel karışımların, uygulama kodunda kullanılmasından kaçınılmalıdır.

Mantık yeniden kullanımı için, bunun yerine `Kompozitler` tercih edilmelidir.
:::

- **Tip**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

Uygulama içindeki tüm alt bileşenlerde enjekte edilebilen bir değeri sağlar.

- **Tip**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Ayrıntılar**

  İlk argüman olarak enjekte anahtarını ve ikinci argüman olarak sağlanan değeri bekler. Uygulama örneğini kendisi döndürür.

- **Örnek**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  Uygulamadaki bir bileşen içinde:

  

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  
  

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  

- **Ayrıca bakınız**
  - `Provide / Inject`
  - `Uygulama Düzeyinde Provide`
  - `app.runWithContext()`

## app.runWithContext() {#app-runwithcontext}

- 3.3+ sürümünde yalnızca desteklenmektedir.

Mevcut uygulamayı enjekte bağlamı olarak kullanarak bir geri çağırmayı çalıştırır.

- **Tip**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Ayrıntılar**

  Bir geri çağırma fonksiyonu bekler ve geri çağırmayı hemen çalıştırır. Geri çağırmanın senkron çağrısı sırasında, `inject()` çağrıları mevcut uygulamanın sağladığı değerlerden enjekte edilenleri arayabilir, mevcut etkin bileşen örneği olmadan bile. Geri çağırmanın döndürdüğü değer de döndürülecektir.

- **Örnek**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

Uygulamanın oluşturulduğu Vue sürümünü sağlar. Bu, `eklenti` içindeki koşullu mantık için kullanışlıdır, farklı Vue sürümlerine dayanan.

- **Tip**

  ```ts
  interface App {
    version: string
  }
  ```

- **Örnek**

  Bir eklenti içinde sürüm kontrolü yapmak:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('Bu eklenti Vue 3 gerektiriyor')
      }
    }
  }
  ```

- **Ayrıca bakınız** `Küresel API - sürüm`

## app.config {#app-config}

Her uygulama örneği, o uygulamanın yapılandırma ayarlarını içeren bir `config` nesnesini sergiler. Uygulamanızı monte etmeden önce özelliklerini (aşağıda belgelenmiştir) değiştirebilirsiniz.

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Uygulama içindeki yakalanmamış hatalar için küresel bir işleyici atayın.

- **Tip**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info`, Vue'ye özgü bir hata bilgisi,
      // örneğin, hatanın hangi yaşam döngüsü kancasında fırlatıldığı
      info: string
    ) => void
  }
  ```

- **Ayrıntılar**

  Hata işleyici, hatayı, hatayı tetikleyen bileşen örneğini ve hata kaynak türünü belirten bir bilgi dizesini içeren üç argümanı alır.

  Aşağıdaki kaynaklardan hataları yakalayabilir:

  - Bileşen render işlemleri
  - Olay işleyicileri
  - Yaşam döngüsü kancaları
  - `setup()` fonksiyonu
  - İzleyiciler
  - Özel yönerge kancaları
  - Geçiş kancaları

  :::tip
  Üretimde, 3. argüman (`info`), tam bilgi dizisi yerine kısaltılmış bir kod olacaktır. Kod ile dize eşleştirmesini `Üretim Hata Kodu Referansı` kısmında bulabilirsiniz.
  :::

- **Örnek**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // hatayı işleme, örneğin bir hizmete raporlama
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Vue'dan gelen çalışma zamanı uyarıları için özel bir işleyici atayın.

- **Tip**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Ayrıntılar**

  Uyarı işleyici, birinci argüman olarak uyarı mesajını, ikinci argüman olarak kaynak bileşen örneğini ve üçüncü argüman olarak bir bileşen izleme dizesini alır.

  Konsol sesliliğini azaltmak için belirli uyarıları filtrelemek için kullanılabilir. Tüm Vue uyarıları geliştirme sırasında ele alınmalıdır, bu nedenle bu yalnızca belirli uyarılara odaklanmak amacıyla hata ayıklama oturumlarında önerilmektedir ve hata ayıklama tamamlandıktan sonra kaldırılmalıdır.

  :::tip
  Uyarılar yalnızca geliştirme sırasında çalışır, bu nedenle bu yapılandırma üretim modunda yok sayılır.
  :::

- **Örnek**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace`, bileşen hiyerarşisi izidir
  }
  ```

## app.config.performance {#app-config-performance}

Bunu `true` olarak ayarlayın, böylece bileşen başlatma, derleme, render ve yamanma performans izleme özellikle tarayıcı geliştirici araçları performans/takvim panosunda etkinleştirilecektir. Yalnızca geliştirme modunda ve [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API'sini destekleyen tarayıcılarda çalışır.

- **Tip:** `boolean`

- **Ayrıca bakınız** `Kılavuz - Performans`

## app.config.compilerOptions {#app-config-compileroptions}

Çalışma zamanı derleyici seçeneklerini yapılandırın. Bu nesnede ayarlanan değerler, tarayıcı içindeki şablon derleyicisine iletilecek ve yapılandırılan uygulamadaki her bileşeni etkileyecektir. Ayrıca bu seçenekleri `compilerOptions` seçeneği` kullanarak her bir bileşen bazında da geçersiz kılabilirsiniz.

::: warning Önemli
Bu yapılandırma seçeneği yalnızca tam derleme kullanıldığında (yani tarayıcıda şablonları derleyebilen bağımsız `vue.js`) geçerlidir. Eğer bir yapılandırma seti ile çalışma zamanı yalnızca derleme kullanıyorsanız, derleyici seçenekleri yapılandırma araçları yardımıyla `@vue/compiler-dom`'a iletilmelidir.

- `vue-loader` için: [derleyici seçeneklerini `compilerOptions` yükleyici seçeneği ile iletin](https://vue-loader.vuejs.org/options.html#compileroptions). Ayrıca [vue-cli'de nasıl yapılandırılacağını](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader) da görebilirsiniz.

- `vite` için: [`@vitejs/plugin-vue` seçenekleri aracılığıyla geçirin](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
:::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Yerel özel elementleri tanımak için bir kontrol yöntemi belirtir.

- **Tip:** `(tag: string) => boolean`

- **Ayrıntılar**

  Etiketin yerel özel bir element olarak ele alınması gerekiyorsa `true` döndürmelidir. Eşleşen bir etiket için, Vue onu yerel bir element olarak render edecek ve bir Vue bileşeni olarak çözmeye çalışmayacaktır.

  Yerel HTML ve SVG etiketlerinin bu fonksiyonda eşleşmesine gerek yoktur - Vue'nin parser'ı bunları otomatik olarak tanır.

- **Örnek**

  ```js
  // 'ion-' ile başlayan tüm etiketleri özel elementler olarak ele al
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **Ayrıca bakınız** `Vue ve Web Bileşenleri`

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Şablon beyaz alanı yönetim davranışını ayarlar.

- **Tip:** `'condense' | 'preserve'`

- **Varsayılan:** `'condense'`

- **Ayrıntılar**

  Vue şablonlardaki boşluk karakterlerini kaldırır/sıkıştırır, böylece daha verimli derlenmiş çıktı üretir. Varsayılan strateji "sıkıştır"dır ve aşağıdaki davranışa sahiptir:

  1. Bir elementin içindeki önde/arkada bulunan boşluk karakterleri tek bir boşluğa sıkıştırılır.
  2. Satır sonları içeren elementler arasındaki boşluk karakterleri kaldırılır.
  3. Metin düğümlerindeki ardışık boşluk karakterleri tek bir boşluğa sıkıştırılır.

  Bu seçeneği `'preserve'` olarak ayarlamak, (2) ve (3)'ü devre dışı bırakır.

- **Örnek**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Şablon içindeki metin interpolasyonu için kullanılan ayırıcıları ayarlar.

- **Tip:** `[string, string]`

- **Varsayılan:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Ayrıntılar**

  Bu genellikle, mustache sözdizimini kullanan sunucu tarafı çerçeveleriyle çakışmayı önlemek için kullanılır.

- **Örnek**

  ```js
  // Ayırıcıları ES6 şablon dizesi stiline değiştirdik
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Şablonlardaki HTML yorumlarının muamelesini ayarlar.

- **Tip:** `boolean`

- **Varsayılan:** `false`

- **Ayrıntılar**

  Varsayılan olarak, Vue üretim aşamasında yorumları kaldırır. Bu seçeneği `true` olarak ayarlamak, Vue'nun üretimde bile yorumları korumasını sağlar. Yorumlar her zaman geliştirme süresince korunur. Bu seçenek genellikle Vue'nun diğer kütüphanelerle beraber kullanıldığı durumlarda kullanılır.

- **Örnek**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

Uygulama içindeki herhangi bir bileşen örneğinde erişilebilen küresel özellikleri kaydetmek için kullanılabilecek bir nesne.

- **Tip**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Ayrıntılar**

  Bu, Vue 2'nin artık mevcut olmayan `Vue.prototype` uygulamasının yerini alır. Küresel olan her şey gibi, bu da ihtiyatlı bir şekilde kullanılmalıdır.

  Eğer bir küresel özellik bir bileşenin kendi özelliği ile çakışırsa, bileşenin kendi özelliği daha yüksek önceliğe sahip olacaktır.

- **Kullanım**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  Bu, uygulamadaki herhangi bir bileşen şablonunda ve aynı zamanda herhangi bir bileşen örneğinin `this` üzerinde `msg`'yi kullanılabilir hale getirir:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

- **Ayrıca bakınız** `Kılavuz - Küresel Özellikleri Genişletme` 

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

Özel bileşen seçenekleri için birleştirme stratejilerini tanımlamak için bir nesne.

- **Tip**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Ayrıntılar**

  Bazı eklentiler/kütüphaneler, özel bileşen seçenekleri için (küresel karışımlar ekleyerek) destek ekler. Bu seçeneklerin birden fazla kaynaktan "birleştirilmesi" gerektiğinde özel bir birleştirme mantığı gerektirebilir (örneğin, karışımlar veya bileşen kalıtımı).

  Özel bir seçenek için bir birleştirme stratejisi işlevi, `app.config.optionMergeStrategies` nesnesine, seçeneğin adını anahtar olarak atayarak kaydedilebilir.

  Birleştirme stratejisi işlevi, o seçeneğin ana bileşen ve çocuk bileşen örneklerinde tanımlanmış değerlerini sırasıyla birinci ve ikinci argümanlar olarak alır.

- **Örnek**

  ```js
  const app = createApp({
    // kendisinden gelen seçenek
    msg: 'Vue',
    // karışımdan gelen seçenek
    mixins: [
      {
        msg: 'Merhaba '
      }
    ],
    mounted() {
      // birleştirilmiş seçenekler bu.$options üzerinde açığa çıkar
      console.log(this.$options.msg)
    }
  })

  // `msg` için özel bir birleştirme stratejisi tanımlayın
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // 'Merhaba Vue' olarak günlüğe kaydeder
  ```

- **Ayrıca bakınız** `Bileşen Örneği - `$options`

## app.config.idPrefix  {#app-config-idprefix}

Bu uygulama içinde `useId()` aracılığıyla oluşturulan tüm kimlikler için bir ön ek yapılandırın.

- **Tip:** `string`

- **Varsayılan:** `undefined`

- **Örnek**

  ```js
  app.config.idPrefix = 'my-app'
  ```

  ```js
  // bir bileşende:
  const id1 = useId() // 'my-app:0'
  const id2 = useId() // 'my-app:1'
  ```

## app.config.throwUnhandledErrorInProduction  {#app-config-throwunhandlederrorinproduction}

Yakalanmamış hataları üretim modunda fırlatmayı zorlayın.

- **Tip:** `boolean`

- **Varsayılan:** `false`

- **Ayrıntılar**

  Varsayılan olarak, bir Vue uygulaması içinde fırlatılan ancak açıkça işlenmeyen hataların geliştirme ve üretim modları arasında farklı davranışları vardır:

  - Geliştirme modunda, hata fırlatılır ve uygulamayı muhtemelen çökertir. Bu durum, hatanın daha belirgin hale gelmesi amacıyla geliştirme sırasında fark edilebilsin ve düzeltilebilsin diye vardır.

  - Üretim modunda, hata yalnızca konsola kaydedilir, böylece son kullanıcılar üzerindeki etkiyi en aza indirmek amaçlanır. Ancak, bu, yalnızca üretimde meydana gelen hataların hata izleme hizmetleri tarafından yakalanmasını engelleyebilir.

  `app.config.throwUnhandledErrorInProduction`'ı `true` olarak ayarlamak, yakalanmamış hataların üretim modunda bile fırlatılmasını sağlar.