---
title: Sunucu Tarafı Renderleme (SSR)
seoTitle: Vue.js Sunucu Tarafı Renderleme (SSR) Rehberi
sidebar_position: 1
description: Bu belge, Vue.js kullanarak sunucu tarafı renderleme (SSR) hakkında bilgi verir. Avantajları, dezavantajları ve temel kullanım örneklerini içerir.
tags: 
  - Vue.js
  - SSR
  - web geliştirme
  - JavaScript
keywords: 
  - Sunucu Tarafı Renderleme
  - SSR
  - Vue.js
  - web geliştirme
  - JavaScript
---
## Sunucu Tarafı Renderleme (SSR) {#server-side-rendering-ssr}

## Genel Bakış {#overview}

### SSR Nedir? {#what-is-ssr}

Vue.js, istemci tarafı uygulamaları geliştirmek için bir çerçevedir. Varsayılan olarak, Vue bileşenleri tarayıcıda DOM oluşturur ve buna etki eder. Ancak, aynı bileşenleri sunucuda HTML dizgelerine renderlemek, bunları doğrudan tarayıcıya göndermek ve nihayetinde statik işaretlemeyi istemci üzerinde tamamen etkileşimli bir uygulamaya "hidrate" etmek de mümkündür.

> **Not:** Sunucu tarafından renderlenen bir Vue.js uygulaması aynı zamanda "izomorfik" veya "evrensel" olarak da kabul edilebilir; çünkü uygulamanızın kodunun çoğunluğu hem sunucuda **hem de** istemcide çalışmaktadır.

### Neden SSR? {#why-ssr}

İstemci tarafı Tek Sayfa Uygulamaları (SPA) ile kıyaslandığında, SSR'ın avantajı esas olarak şunlardan kaynaklanır:

- **Daha hızlı içerik erişimi**: bu, yavaş internet veya yavaş cihazlarda daha belirgindir. Sunucu tarafından renderlenmiş işaretleme, görüntülenmeden önce tüm JavaScript'in indirilip çalıştırılmasını beklemeyecektir; bu nedenle kullanıcı, tamamen render edilmiş bir sayfayı daha hızlı görecektir. Ayrıca, ilk ziyaret için veri çekme sunucu tarafında yapılır; bu genellikle istemciden daha hızlı bir bağlantıya sahip olan veritabanınıza daha hızlı bir erişim sağlar. Bu genellikle daha iyi [Core Web Vitals](https://web.dev/vitals/) metrikleri, daha iyi bir kullanıcı deneyimi ile sonuçlanır ve içerik erişiminin dönüşüm oranı ile doğrudan ilişkili olduğu uygulamalar için kritik olabilir.

- **Birleşik zihinsel model**: Uygulamanızın tamamını geliştirirken arka uç şablonlama sistemi ile ön uç çerçevesi arasında gidip gelmek yerine, aynı dil ve aynı deklaratif, bileşen odaklı zihinsel modeli kullanabilirsiniz.

- **Daha iyi SEO**: Arama motoru tarayıcıları, tamamen render edilmiş sayfayı doğrudan görecektir.

  :::tip
  Şu anda, Google ve Bing senkronize JavaScript uygulamalarını oldukça iyi bir şekilde dizine alabilmektedir. Senkronize kelimesi burada kritik bir kelimedir. Uygulamanız bir yükleme döndürücüsü ile başlarsa ve ardından Ajax ile içerik çekerse, tarayıcı işleminizin bitmesini beklemeyecektir. Bu, SEO'nun önemli olduğu sayfalarda asenkron olarak çekilmiş içerik varsa, SSR'nun gerekli olabileceği anlamına gelir.
  :::

SSR kullanmanın bazı dezavantajları da vardır:

- Geliştirme kısıtlamaları. Tarayıcıya özgü kod yalnızca belirli yaşam döngüsü kancaları içinde kullanılabilir; bazı dış kütüphanelerin sunucu tarafından renderlanan bir uygulamada çalışabilmesi için özel muamele gerektirmesi gerekebilir.

- Daha karmaşık derleme ayarları ve dağıtım gereksinimleri. Herhangi bir statik dosya sunucusunda dağıtılabilen tamamen statik bir SPA'nın aksine, sunucu tarafından renderlenen bir uygulamanın çalışabileceği bir ortam gerektirir.

- Daha fazla sunucu yükü. Node.js'de tam bir uygulamayı renderlemek, yalnızca statik dosyaları sunmaktan daha fazla CPU yoğun olacaktır. Bu nedenle, yüksek trafik bekliyorsanız, buna uygun sunucu yükü için hazırlıklı olun ve akıllıca önbellekleme stratejileri kullanın.

Uygulamanız için SSR kullanmadan önce sormanız gereken ilk soru, gerçekten buna ihtiyacınız olup olmadığıdır. Bu, esasen içerik erişiminin önemine bağlıdır. Örneğin, bir ekstra birkaç yüz milisaniye ilk yüklemede çok önemli değilse, bir iç düzeltme ekranı geliştiriyorsanız, SSR fazla cömertlik olacaktır. Ancak, içerik erişiminin kesinlikle kritik olduğu durumlarda, SSR en iyi başlangıç yükleme performansını elde etmenize yardımcı olabilir.

### SSR ile SSG Arasındaki Fark {#ssr-vs-ssg}

**Statik Site Üretimi (SSG)**, ön-renderleme olarak da bilinen, hızlı web siteleri oluşturmak için başka bir popüler tekniktir. Sunucu tarafından bir sayfayı renderlemek için gereken veriler her kullanıcı için aynıysa, o zaman sayfayı her istek geldiğinde render etmek yerine, sadece bir kez, önceden, derleme sürecinde render edebiliriz. Önceden renderlenmiş sayfalar, statik HTML dosyaları olarak üretilir ve sunulur.

SSG, SSR uygulamalarının aynı performans özelliklerini korur: harika bir içerik erişim performansı sağlar. Aynı zamanda, çıktısı statik HTML ve varlıklar olduğu için SSR uygulamalarına göre daha ucuz ve daha kolay dağıtılır. Buradaki anahtar kelime **statik**tir: SSG yalnızca statik veriler sağlayan sayfalara uygulanabilir; yani, derleme zamanında bilinen ve istekler arasında değişmeyen verilere. Veri her değiştiğinde, yeni bir dağıtım gereklidir.

Eğer yalnızca birkaç pazarlama sayfasının SEO'sunu artırmak için SSR'yi araştırıyorsanız (örn. `/`, `/hakkımızda`, `/iletişim`, vb.), o zaman SSG'yi SSR yerine tercih etmek isteyebilirsiniz. SSG, belgeler veya bloglar gibi içerik tabanlı web siteleri için de harika bir seçenektir. Aslında, şu anda okumakta olduğunuz bu web sitesi, Vue ile güçlendirilmiş bir statik site üreticisi olan [VitePress](https://vitepress.dev/) kullanılarak statik olarak oluşturulmuştur.

## Temel Eğitim {#basic-tutorial}

### Bir Uygulamanın Renderlenmesi {#rendering-an-app}

Vue SSR'nın çalışma şekline dair en basit örneğe bakalım.

1. Yeni bir dizin oluşturun ve içine `cd` komutunu kullanın
2. `npm init -y` komutunu çalıştırın
3. Node.js'in [ES modülleri modunda](https://nodejs.org/api/esm.html#modules-ecmascript-modules) çalışması için `package.json` dosyasına `"type": "module"` ekleyin.
4. `npm install vue` komutunu çalıştırın
5. Bir `example.js` dosyası oluşturun:

   ```js
   // Bu, sunucuda Node.js'de çalışır.
   import { createSSRApp } from 'vue'
   // Vue'un sunucu renderlama API'si `vue/server-renderer` altında ortaya çıkar.
   import { renderToString } from 'vue/server-renderer'

   const app = createSSRApp({
     data: () => ({ count: 1 }),
     template: `<button @click="count++">{{ count }}</button>`
   })

   renderToString(app).then((html) => {
     console.log(html)
   })
   ```

Sonra şunu çalıştırın:

   ```sh
   > node example.js
   ```

Aşağıdakileri komut satırına yazdırması gerekir:

   ```
   <button>1</button>
   ```

`renderToString()` bir Vue uygulama örneğini alır ve uygulamanın render edilmiş HTML'sine çözümlenen bir Promise döndürür. [Node.js Akış API'si](https://nodejs.org/api/stream.html) veya [Web Akışları API'si](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) kullanarak akış renderlemesi de mümkündür. Tam ayrıntılar için `SSR API Referansı` kısmına göz atın.

Sonra Vue SSR kodunu bir sunucu istek işleyicisine yerleştirebiliriz; bu, uygulama işaretlemesini tam sayfa HTML ile sarar. Bir sonraki adımlar için [`express`](https://expressjs.com/) kullanacağız:

- `npm install express` komutunu çalıştırın
- Aşağıdaki `server.js` dosyasını oluşturun:

   ```js
   import express from 'express'
   import { createSSRApp } from 'vue'
   import { renderToString } from 'vue/server-renderer'

   const server = express()

   server.get('/', (req, res) => {
     const app = createSSRApp({
       data: () => ({ count: 1 }),
       template: `<button @click="count++">{{ count }}</button>`
     })

     renderToString(app).then((html) => {
       res.send(`
       <!DOCTYPE html>
       <html>
         <head>
           <title>Vue SSR Örneği</title>
         </head>
         <body>
           <div id="app">${html}</div>
         </body>
       </html>
       `)
     })
   })

   server.listen(3000, () => {
     console.log('hazır')
   })
   ```

Son olarak, `node server.js` komutunu çalıştırın ve `http://localhost:3000` adresini ziyaret edin. Butonun çalıştığını göreceksiniz.

[StackBlitz üzerinde deneyin](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### İstemci Hidratasyonu {#client-hydration}

Butona tıklarsanız, sayının değişmediğini fark edeceksiniz. HTML, istemcide tamamen statiktir çünkü tarayıcıda Vue yüklenmiyor.

İstemci tarafı uygulamayı etkileşimli hale getirmek için Vue, **hidratasyon** adımını gerçekleştirmelidir. Hidratasyon sırasında, sunucuda çalıştırılan aynı Vue uygulaması oluşturulur, her bir bileşen kontrol etmesi gereken DOM düğümlerine iliştirilir ve DOM olay dinleyicileri eklenir.

Hidratasyon modunda uygulama monte etmek için, `createApp()` yerine `createSSRApp()` kullanmalıyız:

```js{2}
// Bu, tarayıcıda çalışır.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...sunucudaki aynı uygulama
})

// İstemcide bir SSR uygulamasını monte etmek,
// HTML'nin önceden render edilmiş olduğu varsayılır
// ve yeni DOM düğümlerini monte etmek yerine
// hidratasyon gerçekleştirilir.
app.mount('#app')
```

### Kod Yapısı {#code-structure}

Sunucudakiyle aynı uygulama uygulamasını yeniden kullanmamız gerektiğine dikkat edin. Bu, bir SSR uygulamasında kod yapısını düşünmeye başlamamız gerektiği yer - sunucu ve istemci arasında aynı uygulama kodunu nasıl paylaşabiliriz?

Burada en basit kurulumu göstereceğiz. Öncelikle, uygulama oluşturma mantığını özel bir dosyaya, `app.js` adında bölelim:

```js
// app.js (sunucu ve istemci arasında paylaşılır)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Bu dosya ve bağımlılıkları sunucu ve istemci arasında paylaşılır - buna **üniversal kod** diyoruz. Evrensel kod yazarken dikkat etmeniz gereken birkaç şey var, bunları `aşağıda` tartışacağız.

Müşteri girişi evrensel kodu içe aktarır, uygulamayı oluşturur ve montajı gerçekleştirir:

```js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

Ve sunucu, istek işleyicisinde aynı uygulama oluşturma mantığını kullanır:

```js{2,5}
// server.js (ilgisiz kod hariç)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

Ayrıca, tarayıcıda istemci dosyalarını yüklemek için, şunları da yapmamız gerekir:

1. `server.js`'de `server.use(express.static('.'))` ekleyerek istemci dosyalarını sunmak.
2. HTML şemasına `` ekleyerek istemci girişini yüklemek.
3. Tarayıcıda `import * from 'vue'` gibi kullanımlara destek vermek için HTML şemasına bir [İçe Aktarma Haritası](https://github.com/WICG/import-maps) eklemek.

[StackBlitz'de tamamlanmış örneği deneyin](https://stackblitz.com/fork/vue-ssr-example?file=index.js). Buton artık etkileşimli!

## Daha Yüksek Seviye Çözümler {#higher-level-solutions}

Örnekten üretim hazır bir SSR uygulamasına geçiş yapmak çok daha fazla şey gerektirir. Şunları desteklememiz gerekecek:

- Vue SFC'lerini ve diğer derleme adımı gereksinimlerini desteklemek. Aslında, aynı uygulama için iki derlemeyi koordine etmemiz gerekecek: biri istemci için, diğeri sunucu için.

  :::tip
  Vue bileşenleri SSR için kullanıldığında farklı şekilde derlenir - şablonlar daha verimli renderleme performansı için dize birleştirilmelerine dönüştürülür.
  :::

- Sunucu istek işleyicisinde, HTML'yi doğru istemci tarafı varlık bağlantıları ve optimal kaynak ipuçları ile renderlemek. SSR ve SSG modu arasında geçiş yapmak veya hatta her ikisini aynı uygulamada karıştırmak gerekebilir.

- Yönlendirme, veri çekme ve durum yönetim depolarını evrensel bir yöntemle yönetmek.

Tam bir uygulama gerçekleştirmek oldukça karmaşık olacaktır ve çalışmak için tercih ettiğiniz derleme araçlarına bağlıdır. Bu nedenle, karmaşıklığı sizin için soyutlayan daha yüksek seviyeli, belirlenmiş bir çözüme gitmenizi öneriyoruz. Aşağıda Vue ekosisteminde birkaç önerilen SSR çözümü tanıtacağız.

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) , evrensel Vue uygulamaları yazmak için düzeneği geliştirilmiş bir çerçevedir. Daha da iyisi, aynı zamanda statik site üreticisi olarak da kullanabilirsiniz! Kesinlikle denemenizi öneririz.

### Quasar {#quasar}

[Quasar](https://quasar.dev) , tek bir kod tabanı kullanarak SPA, SSR, PWA, mobil uygulama, masaüstü uygulama ve tarayıcı uzantısı hedeflemenizi sağlayan tam bir Vue tabanlı çözümdür. Hem derleme ayarını yönetir, hem de tam bir Malzeme Tasarımına uygun UI bileşenleri koleksiyonu sağlar.

### Vite SSR {#vite-ssr}

Vite, Vue sunucu tarafı renderlama için yerleşik [destek sağlar](https://vitejs.dev/guide/ssr.html), ancak bilerek düşük seviyelidir. Eğer doğrudan Vite ile gitmek istiyorsanız, birçok zorlu detayı sizin için soyutlayan bir topluluk eklentisi olan [vite-plugin-ssr](https://vite-plugin-ssr.com/) 'ye göz atabilirsiniz.

Ayrıca, manuel kurulum kullanan bir Vue + Vite SSR projesinin örneğini [burada](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue) bulabilirsiniz, bu da üzerine inşa edilecek bir temel olarak hizmet edebilir. Bu, yalnızca SSR / derleme araçlarında deneyimli iseniz ve yüksek seviyeli mimari üzerinde tam kontrol istemiyorsanız önerilir.

## SSR'ye Uygun Kod Yazma {#writing-ssr-friendly-code}

Derleme ayarınız veya daha yüksek seviyeli çerçeve seçiminiz ne olursa olsun, tüm Vue SSR uygulamalarında geçerli bazı ilkeler vardır.

### Sunucudaki Reaktivite {#reactivity-on-the-server}

SSR sırasında, her istek URL'si uygulamamızın istediği bir duruma karşılık gelir. Kullanıcı etkileşimi yoktur ve DOM güncellemeleri yapılmaz, dolayısıyla sunucuda reaktivite gereksizdir. Daha iyi performans için SSR sırasında reaktivite varsayılan olarak devre dışı bırakılır.

### Bileşen Yaşam Döngüsü Kancaları {#component-lifecycle-hooks}

Dinamik güncellemeler olmadığından, yaşam döngüsü kancaları olan `mounted``onMounted` veya `updated``onUpdated` SSR sırasında **ÇAĞRILMAZ** ve yalnızca istemci üzerinde yürütülür. SSR sırasında çağrılan tek kancalar `beforeCreate` ve `created`'dir.

Temizlenmesi gereken yan etkiler üreten kodlardan kaçınmalısınız `beforeCreate` ve `created``setup()` veya ``'in kök kapsamı. Bu tür yan etkilerin bir örneği `setInterval` ile zamanlayıcıların ayarlanmasıdır. Yalnızca istemci tarafında kodda bir zamanlayıcı ayarlayabilir ve ardından `beforeUnmount``onBeforeUnmount` veya `unmounted``onUnmounted` ile kaldırabiliriz. Ancak, kaldırma kancaları SSR sırasında asla çağrılmayacağından, zamanlayıcılar sürekli var kalacaktır. Bunu önlemek için, yan etki kodunuzu `mounted``onMounted` içerisine taşıyın.

### Platforma Özgü API'lere Erişim {#access-to-platform-specific-apis}

Evrensel kod, platforma özgü API'lere erişim varsayamaz, bu nedenle kodunuz doğrudan tarayıcıya özgü global değişkenleri kullanıyorsa (`window` veya `document` gibi), bunlar Node.js'de çalıştırıldığında hatalara yol açar ve tersi de geçerlidir.

Sunucu ve istemci arasında paylaşılan ancak farklı platform API'leriyle farklı uygulamalar için platforma özgü uygulamaları evrensel bir API'ye sarılması önerilir veya sizin için bunu yapan kitaplıklar kullanılır. Örneğin, hem sunucu hem de istemcide aynı fetch API'sını kullanmak için [`node-fetch`](https://github.com/node-fetch/node-fetch) kullanabilirsiniz.

Tarayıcıya özgü API'ler için, yaygın yaklaşım, bunları yalnızca istemci tarafındaki yaşam döngüsü kancaları olan `mounted``onMounted` içinde tembel bir şekilde erişmektir.

Üçüncü taraf bir kitaplık evrensel kullanıma yönelik yazılmamışsa, bunu sunucu tarafından renderlanan bir uygulamaya entegre etmek zor olabilir. Belki bazı global değişkenleri sahtelemek yoluyla çalıştırabilirsiniz, ancak bu zorlu bir süreç olacaktır ve diğer kitaplıkların ortam tespit kodlarıyla çelişebilir.

### İstekler Arası Durum Kirliliği {#cross-request-state-pollution}

Durum Yönetimi bölümünde, `Reaktivite API'lerini kullanarak basit bir durum yönetim modeli` tanıttık. Bir SSR bağlamında, bu modeli bazı ek ayarlamalar gerektirir.

Model, bir JavaScript modülünün kök kapsamındaki paylaşılan durumu açıklar. Bu **singleton** yapar - yani, reaktif nesnenin uygulamamızın tüm yaşam döngüsü boyunca yalnızca bir örneği vardır. Bu, uygulamamızda sayfa ziyaretleri için modüller taze bir şekilde başlatıldığı için saf bir istemci tarafı Vue uygulamasında beklenildiği gibi çalışır.

Ancak, bir SSR bağlamında, uygulama modülleri genellikle yalnızca sunucu başlatıldığında bir kez başlatılır. Aynı modül örnekleri, birden fazla sunucu isteği arasında yeniden kullanılır ve dolayısıyla singleton durum nesnelerimiz de yeniden kullanılır. Paylaşılan singleton durumu bir kullanıcıya özgü verilerle değiştirirsek, istenmeden başka bir kullanıcıdan gelen bir isteğe sızabilir. Buna **istekler arası durum kirliliği** diyoruz.

Teknik olarak, her istek üzerinde tüm JavaScript modüllerini yeniden başlatabiliriz, tıpkı tarayıcılarda yaptığımız gibi. Ancak, JavaScript modüllerini başlatmak maliyetli olabilir, bu da sunucu performansını olumsuz etkileyebilir.

Tavsiyeleri ise, her istek üzerinde yönlendirici ve global depolar dahil olmak üzere tüm uygulamanın yeni bir örneğini yaratmaktır. Sonra, bileşenlerimizde doğrudan içe aktarmak yerine, paylaşılan durumu `uygulama düzeyinde sağlamak` ve bunu ihtiyaç duyan bileşenlere enjekte etmek:

```js
// app.js (sunucu ve istemci arasında paylaşılır)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// her istekte çağrılır
export function createApp() {
  const app = createSSRApp(/* ... */)
  // isteğe göre yeni bir depo örneği oluştur
  const store = createStore(/* ... */)
  // depoyu uygulama düzeyinde sağla
  app.provide('store', store)
  // ayrıca, hidratasyon amaçları için depoyu da sergile
  return { app, store }
}
```

Durum Yönetimi kütüphaneleri, bu durumu göz önünde bulundurarak tasarlanmıştır. Daha fazla detay için [Pinia'nın SSR kılavuzuna](https://pinia.vuejs.org/ssr/) başvurun.

### Hidratasyon Uyuşmazlığı {#hydration-mismatch}

Eğer önceden render edilmiş HTML'nin DOM yapısı, istemci tarafı uygulamasının beklenen çıktısı ile eşleşmiyorsa, bir hidratasyon uyuşmazlığı hatası oluşur. Hidratasyon uyuşmazlığı genellikle aşağıdaki nedenlerden kaynaklanır:

1. Şablonda geçersiz HTML iç içe yapısı vardır ve render edilmiş HTML, tarayıcının yerel HTML ayrıştırma davranışı tarafından "düzeltilmiştir". Örneğin,  [`` öğesinin `` öğesinin içine konumlandırılamayacağı](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it) yaygın bir sorun olarak kabul edilir:

   ```html
   <p><div>merhaba</div></p>
   ```

   Sunucu tarafından render edilmiş HTML'mizde bunu üretirsek, tarayıcı `` ile karşılaştığında ilk ``'yi sonlandırır ve aşağıdaki DOM yapısını parse eder:

   ```html
   <p></p>
   <div>merhaba</div>
   <p></p>
   ```

2. Render sırasında kullanılan veri, rastgele üretilmiş değerlere sahiptir. Aynı uygulama iki kez çalışacağından - bir kez sunucuda ve bir kez istemcide - rastgele değerlerin iki çalıştırma arasında aynı olacağı garanti edilmez. Rastgele değerlerin neden olduğu uyuşmazlıkları önlemenin iki yolu vardır:

   1. `v-if` + `onMounted` kullanarak, rastgele değerlere bağlı kısımları yalnızca istemcide render etmek. Çerçevenizin bunu daha kolay hale getirecek yerleşik özellikleri olabilir; örneğin VitePress'deki `` bileşeni.

   2. Tohumla birlikte üreten bir rastgele sayı üreteci kitaplığı kullanmak ve sunucu çalıştırmasının ve istemci çalıştırmasının aynı tohumu kullandığından emin olmak (örn. tohumun seri hale getirilmiş durumda yer alması ve istemcide geri alınması).

3. Sunucu ve istemci farklı zaman dilimlerinde bulunabiliyor. Bazen, zaman damgasını kullanıcının yerel saatine dönüştürmek isteyebiliriz. Ancak, sunucu çalıştırma zaman dilimi ve istemci çalıştırma zaman dilimi her zaman aynı olmayabilir ve sunucu çalıştırma sırasında kullanıcının zaman dilimini güvenilir bir şekilde bilemeyiz. Bu tür durumlarda yerel saat dönüşümünün de yalnızca bir istemci işlemi olarak gerçekleştirilmesi gerekir.

Vue, hidratasyon uyuşmazlığı ile karşılaştığında, önceden render edilmiş DOM'u istemci tarafı durumu ile eşleştirmek için otomatik olarak kurtulmaya ve ayarlamaya çalışacaktır. Bu, yanlış düğümlerin elenmesi ve yeni düğümlerin monte edilmesi nedeniyle bir miktar renderleme performansı kaybına yol açacaktır, ancak çoğu durumda uygulama beklenildiği gibi çalışmaya devam etmelidir. Yine de, geliştirme sırasında hidratasyon uyuşmazlıklarını ortadan kaldırmak en iyisidir.