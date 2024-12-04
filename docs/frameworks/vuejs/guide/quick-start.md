---
title: Hızlı Başlangıç
seoTitle: Vue Hızlı Başlangıç Kılavuzu
sidebar_position: 1
description: Bu kılavuz, Vue ile hızlı bir şekilde başlamanızı sağlamak için temel adımları açıklamaktadır. Vue uygulamanızı kurmak ve çalıştırmak için gerekli adımları takip edin.
tags: 
  - Vue
  - Hızlı Başlangıç
  - Tek Sayfa Uygulaması
  - Vite
keywords: 
  - Vue
  - Hızlı Başlangıç
  - Tek Sayfa Uygulaması
  - Vite
---



## Hızlı Başlangıç {#quick-start}

## Vue'yu Çevrimiçi Deneyin {#try-vue-online}

- Vue'yi hızlı bir şekilde denemek için [Playground](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==) sayfasında doğrudan deneyebilirsiniz.

- Eğer herhangi bir yapı adımına ihtiyaç duymadan düz bir HTML kurulumu tercih ediyorsanız, başlangıç noktası olarak bu [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) sayfasını kullanabilirsiniz.

- Node.js ve yapı araçları kavramlarına aşina iseniz, tarayıcınızda [StackBlitz](https://vite.new/vue) üzerinden tam bir yapı kurulumu deneyebilirsiniz.

## Vue Uygulaması Oluşturma {#creating-a-vue-application}

:::tip Ön Koşullar

- Komut satırına aşina olun
- [Node.js](https://nodejs.org/) sürüm 18.3 veya üstünü yükleyin
:::

Bu bölümde, yerel makinenizde Vue `Tek Sayfa Uygulaması` oluşturmayı tanıtacağız. Oluşturulan proje, [Vite](https://vitejs.dev) temel alınarak bir yapı kurulumu kullanacak ve bize Vue `Tek Dosya Bileşenlerini` (SFC'ler) kullanma olanağı tanıyacak.

Güncel bir [Node.js](https://nodejs.org/) sürümünün yüklü olduğundan ve mevcut çalışma dizininizin bir proje oluşturmayı planladığınız dizin olduğundan emin olun. Komut satırında aşağıdaki komutu çalıştırın ( `$` işareti olmadan):


  

  ```sh
  $ npm create vue@latest
  ```

  
  

  ```sh
  $ pnpm create vue@latest
  ```

  
  

  ```sh
  # Yarn için (v1+)
  $ yarn create vue

  # Modern Yarn için (v2+)
  $ yarn create vue@latest
  
  # Yarn ^v4.11 için
  $ yarn dlx create-vue@latest
  ```

  
  

  ```sh
  $ bun create vue@latest
  ```

  


Bu komut, resmi Vue proje yapılandırma aracı olan [create-vue](https://github.com/vuejs/create-vue) aracını yükleyip çalıştıracaktır. Size, TypeScript ve test desteği gibi birkaç isteğe bağlı özellik için yönlendirmeler sunulacaktır:

✔ Proje adı: … &lt;your-project-name&gt;
✔ TypeScript ekleyelim mi? … Hayır / Evet
✔ JSX desteği ekleyelim mi? … Hayır / Evet
✔ Tek Sayfa Uygulaması geliştirmek için Vue Router ekleyelim mi? … Hayır / Evet
✔ Durum yönetimi için Pinia ekleyelim mi? … Hayır / Evet
✔ Birim testi için Vitest ekleyelim mi? … Hayır / Evet
✔ Uçtan Uca Test Çözümü ekleyelim mi? … Hayır / Cypress / Nightwatch / Playwright
✔ Kod kalitesi için ESLint ekleyelim mi? … Hayır / Evet
✔ Kod biçimlendirmesi için Prettier ekleyelim mi? … Hayır / Evet
✔ Hata ayıklama için Vue DevTools 7 uzantısını ekleyelim mi? (deneysel) … Hayır / Evet


Bir seçenek hakkında emin değilseniz, şu anda sadece `Hayır` seçeneğini vurgulayarak enter tuşuna basabilirsiniz. Proje oluşturulduktan sonra, bağımlılıkları yüklemek ve geliştirme sunucusunu başlatmak için talimatları izleyin:


  

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ npm install
  $ npm run dev
  ```

  
  

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ pnpm install
  $ pnpm run dev
  ```

  
  

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ yarn
  $ yarn dev
  ```

  
  

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ bun install
  $ bun run dev
  ```

  


Artık ilk Vue projenizin çalışır durumda olduğunu görmelisiniz! Oluşturulan projedeki örnek bileşenlerin `Composition API` ve `` kullanılarak yazıldığını unutmayın; `Options API` yerine. İşte bazı ek ipuçları:

- Önerilen IDE kurulumu [Visual Studio Code](https://code.visualstudio.com/) + [Vue - Resmi uzantı](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Diğer editörleri kullanıyorsanız, `IDE destek bölümü` ile göz atın.
- Araçlar hakkında daha fazla detay, arka uç çerçeveleriyle entegrasyon gibi konular, `Araçlar Kılavuzu` kısmında ele alınmıştır.
- Temel yapı aracı Vite hakkında daha fazla bilgi için [Vite dökümantasyonu](https://vitejs.dev) sayfasını ziyaret edin.
- TypeScript kullanmayı seçerseniz, `TypeScript Kullanım Kılavuzu` sayfasına göz atın.

Uygulamanızı üretime göndermeye hazır olduğunuzda, aşağıdaki komutu çalıştırın:


  

  ```sh
  $ npm run build
  ```

  
  

  ```sh
  $ pnpm run build
  ```

  
  

  ```sh
  $ yarn build
  ```

  
  

  ```sh
  $ bun run build
  ```

  


Bu, uygulamanızın proje içindeki `./dist` dizininde üretime hazır bir derlemesini oluşturacaktır. Uygulamanızı üretime göndermeye daha fazla bilgi edinmek için `Üretim Dağıtım Kılavuzu` sayfasına göz atın.

`Sonraki Adımlar >`

## Vue'yu CDN'den Kullanma {#using-vue-from-cdn}

Vue'yu doğrudan bir CDN'den bir script etiketi aracılığıyla kullanabilirsiniz:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Burada [unpkg](https://unpkg.com/) kullanıyoruz, fakat ayrıca npm paketlerini sunan herhangi bir CDN'yi kullanabilirsiniz, örneğin [jsdelivr](https://www.jsdelivr.com/package/npm/vue) veya [cdnjs](https://cdnjs.com/libraries/vue). Elbette, bu dosyayı indirip kendiniz de sunabilirsiniz.

Vue'yu bir CDN üzerinden kullanırken, herhangi bir "yapı adımı" içermez. Bu, kurulumu çok daha basit hale getirir ve statik HTML'yi geliştirmek veya bir arka uç çerçevesiyle entegre etmek için uygundur. Ancak, Tek Dosya Bileşeni (SFC) sözdizimini kullanamayacaksınız.

### Küresel Yapıyı Kullanma {#using-the-global-build}

Yukarıdaki bağlantı, Vue'nin _küresel yapısını_ yükler; burada tüm üst seviye API'ler küresel `Vue` nesnesi üzerinde özellikler olarak açık hale gelir. İşte küresel yapı kullanarak tam bir örnek:



```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Merhaba Vue!'
      }
    }
  }).mount('#app')
</script>
```

[CodePen Demo >](https://codepen.io/vuejs-examples/pen/QWJwJLp)





```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Merhaba vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[CodePen Demo >](https://codepen.io/vuejs-examples/pen/eYQpQEG)



:::tip
Kılavuzun birçok yerinde Composition API örnekleri `` sözdizimini kullanacaktır; bu, yapı araçları gerektirir. Eğer yapı adımı olmadan Composition API kullanmayı planlıyorsanız, `setup()` seçeneği` kullanımına göz atın.
:::



### ES Modül Yapısını Kullanma {#using-the-es-module-build}

Kılavuz boyunca, genellikle [ES modüllerini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) kullanacağız. Çoğu modern tarayıcı artık ES modüllerini yerel olarak desteklediğinden, Vue'yu CDN üzerinden yerel ES modülleriyle şu şekilde kullanabiliriz:



```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Merhaba Vue!'
      }
    }
  }).mount('#app')
</script>
```





```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Merhaba Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```



Görünüşe göre, `` kullanıyoruz ve içe aktarılan CDN URL'si Vue'nin **ES modüller yapısına** işaret ediyor.



[CodePen Demo >](https://codepen.io/vuejs-examples/pen/VwVYVZO)




[CodePen Demo >](https://codepen.io/vuejs-examples/pen/MWzazEv)



### İçe Aktarma Haritalarını Etkinleştirme {#enabling-import-maps}

Yukarıdaki örnekte, tam CDN URL'sinden içe aktarıyoruz, ancak belgelerin geri kalanında aşağıdaki gibi kod göreceksiniz:

```js
import { createApp } from 'vue'
```

Tarayıcıya `vue` içe aktarımlarını nasıl bulması gerektiğini öğretmek için [İçe Aktarma Haritalarını](https://caniuse.com/import-maps) kullanabiliriz:



```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Merhaba Vue!'
      }
    }
  }).mount('#app')
</script>
```

[CodePen Demo >](https://codepen.io/vuejs-examples/pen/wvQKQyM)





```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Merhaba Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[CodePen Demo >](https://codepen.io/vuejs-examples/pen/YzRyRYM)



Diğer bağımlılıklar için de bir başlangıç haritasına girişler ekleyebilirsiniz; ancak bunların kullandığınız kütüphanenin ES modüller sürümüne işaret ettiğinden emin olun.

:::tip İçe Aktarma Haritaları Tarayıcı Desteği
İçe aktarma haritaları, nispeten yeni bir tarayıcı özelliğidir. Lütfen bir tarayıcının [destek aralığında](https://caniuse.com/import-maps) olup olmadığını kontrol edin. Özellikle, sadece Safari 16.4+ sürümünde desteklenmektedir.
:::

:::warning Üretim Kullanımı için Notlar
Şu ana kadar kullandığımız örnekler, Vue'nun geliştirme sürümünü kullanıyor - eğer Vue'yu bir CDN üzerinden üretimde kullanmayı planlıyorsanız, `Üretim Dağıtım Kılavuzu` sayfasını kontrol ettiğinizden emin olun.

Vue'yu bir yapı sistemi olmadan kullanmak mümkün olsa da, [`vuejs/petite-vue`](https://github.com/vuejs/petite-vue) kullanmak, [`jquery/jquery`](https://github.com/jquery/jquery) (geçmişte) veya [`alpinejs/alpine`](https://github.com/alpinejs/alpine) (şu anda) kullanılıyor olabileceği bağlamda daha uygun bir yaklaşım olabilir.
:::

### Modülleri Bölme {#splitting-up-the-modules}

Kılavuzda daha derinlemesine ilerledikçe, kodumuzu yönetimi daha kolay olacak şekilde ayrı JavaScript dosyalarına bölebiliriz. Örnek olarak:

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```



```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>Count: {{ count }}</div>`
}
```




```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>Count: {{ count }}</div>`
}
```



Yukarıdaki `index.html` dosyasını doğrudan tarayıcınızda açarsanız, `file://` protokolü üzerinden ES modüllerinin çalışmadığına dair bir hata alırsınız; bu, tarayıcının yerel bir dosya açtığında kullandığı protokoldür.

Güvenlik nedenleriyle, ES modülleri yalnızca `http://` protokolü üzerinden çalışabilir; bu, tarayıcıların web üzerindeki sayfaları açarken kullandığı protokoldür. ES modüllerinin yerel makinemizde çalışabilmesi için, `index.html` dosyasını internet üzerinden sunmamız gerekiyor; bu, yerel bir HTTP sunucusu ile gerçekleştirilebilir.

Yerel bir HTTP sunucusunu başlatmak için, öncelikle [Node.js](https://nodejs.org/en/) yüklü olduğundan emin olun, ardından komut satırında HTML dosyanızın bulunduğu dizinde `npx serve` komutunu çalıştırın. Statik dosyaları doğru MIME türleri ile sunabilen başka herhangi bir HTTP sunucusunu da kullanabilirsiniz.

İçe aktarılan bileşenin şablonunun JavaScript dizesi olarak satır içi olduğunu fark etmiş olabilirsiniz. Eğer VS Code kullanıyorsanız, [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) uzantısını yükleyebilir ve dizeleri `/*html*/` yorumu ile ön ekleyerek sözdizimi renklendirmesi elde edebilirsiniz.

## Sonraki Adımlar {#next-steps}

Eğer `Giriş` bölümünü atladıysanız, diğer belgelere geçmeden önce onu okumanızı şiddetle tavsiye ederiz.


  
    Rehberle Devam Et
    Bu rehber, çerçevenin her yönünü detaylı bir şekilde anlatmaktadır.
  
  
    Eğitimi Deneyin
    Herhangi bir şeyleri pratik olarak öğrenmeyi tercih edenler için.
  
  
    Örnekleri Kontrol Edin
    Temel özelliklerin ve yaygın kullanıcı arayüzü görevlerinin örneklerine göz atın.