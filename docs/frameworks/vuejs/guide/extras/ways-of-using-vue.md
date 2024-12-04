---
title: Vue Kullanım Yöntemleri
seoTitle: Vue Usage Methods
sidebar_position: 4
description: Vue, web uygulamaları oluşturmak için esnek bir çerçevedir. Bu makale, Vuenun çeşitli kullanım yöntemlerini ele almaktadır.
tags: 
  - Vue
  - Web Development
  - JavaScript
keywords: 
  - Vue
  - Frontend
  - SPA
  - SSG
  - SSR
---
## Vue Kullanım Yöntemleri {#ways-of-using-vue}

Her web için "tek tip" bir hikaye olmadığına inanıyoruz. Bu nedenle Vue, esnek ve kademeli olarak benimsenebilir şekilde tasarlanmıştır. Kullanım durumunuza bağlı olarak, Vue'yu yığın karmaşıklığı, geliştirici deneyimi ve son performans arasında optimal dengeyi sağlamak için farklı şekillerde kullanabilirsiniz.

## Bağımsız Script {#standalone-script}

Vue, bağımsız bir script dosyası olarak kullanılabilir - herhangi bir derleme adımı gerektirmez! Eğer arka uç çerçeveniz zaten çoğu HTML'yi render ediyorsa veya ön uç mantığınız, bir derleme adımı gerektirmeyecek kadar karmaşık değilse, Vue'yu yığınıza entegre etmenin en kolay yolu budur. Bu durumda, Vue'yu jQuery'nin daha açıklayıcı bir alternatifi olarak düşünebilirsiniz.

:::note
Vue, mevcut HTML'yi kademeli olarak zenginleştirmek için özel olarak optimize edilmiş [petite-vue](https://github.com/vuejs/petite-vue) adlı alternatif bir dağıtım da sağlar.
:::

Daha küçük bir özellik setine sahip olmasına rağmen, son derece hafif olup, derleme adımı gerektirmeyen senaryolarda daha verimli bir uygulama kullanır.

## Gömülü Web Bileşenleri {#embedded-web-components}

Vue'yu, herhangi bir HTML sayfasına gömülebilecek `standart Web Bileşenleri` oluşturmak için kullanabilirsiniz, bu bileşenlerin nasıl render edildiğinden bağımsızdır. Bu seçenek, Vue'yu tam anlamıyla tüketiciye bağımlı olmayan bir şekilde kullanmanıza olanak tanır: Ortaya çıkan web bileşenleri, eski uygulamalara, statik HTML'ye veya diğer çerçevelerle yapılan uygulamalara gömülebilir.

## Tek Sayfa Uygulaması (SPA) {#single-page-application-spa}

Bazı uygulamalar, ön uçta zengin etkileşim, derin oturum derinliği ve karmaşık durumsal mantık gerektirir. Bu tür uygulamaların en iyi yolu, Vue'nun yalnızca tüm sayfayı kontrol etmekle kalmayıp, sayfayı yeniden yüklemeden veri güncellemeleri ve navigasyon işlemleri gerçekleştirdiği bir mimari kullanmaktır. Bu tür uygulamalar genellikle Tek Sayfa Uygulaması (SPA) olarak adlandırılır.

:::info
Vue, modern SPAlar oluşturmak için harika geliştirici deneyimi sunan temel kütüphaneler ve `kapsamlı araç desteği` sağlamaktadır.
:::

Bu araçlar arasında:
- İstemci tarafı yönlendirici
- Hızlı bir derleme araç zinciri
- IDE desteği
- Tarayıcı geliştirici araçları
- TypeScript entegrasyonları
- Test araçları

SPAlar genellikle arka ucun API uç noktalarını açmasını gerektirir - ancak Vue'yu, SPA avantajlarını elde etmek için [Inertia.js](https://inertiajs.com) gibi çözümlerle de eşleştirebilirsiniz, böylece sunucu merkezli bir geliştirme modeli koruyabilirsiniz.

## Fullstack / SSR {#fullstack-ssr}

Tamamen istemci tarafı SPAlar, uygulamanız SEO'ya ve içerik zamanına duyarlı olduğunda sorunludur. Bunun nedeni, tarayıcının büyük ölçüde boş bir HTML sayfası alması ve herhangi bir şey render edilmeden önce JavaScript'in yüklenmesini beklemesidir.

Vue, bir Vue uygulamasını sunucuda HTML dizelerine "render" etmek için birinci sınıf API'ler sağlar. Bu, sunucunun önceden render edilmiş HTML'i geri göndermesine olanak tanıyarak, son kullanıcıların JavaScript indirilirken içeriği hemen görmesini sağlar. Vue daha sonra uygulamayı istemci tarafında etkileşimli hale getirmek için "hydrate" eder. 

:::warning
Bu, `Sunucu Tarafı Renderlama (SSR)` olarak adlandırılır ve [En Büyük İçerik Boyutu (LCP)](https://web.dev/lcp/) gibi Core Web Vital metriklerini büyük ölçüde iyileştirir.
:::

Bu paradigma üzerine inşa edilmiş daha yüksek düzeyde Vue tabanlı çerçeveler bulunmaktadır; bunlardan biri [Nuxt](https://nuxt.com/)'dır ve Vue ile JavaScript kullanarak tam yığın bir uygulama geliştirmenize olanak tanır.

## JAMStack / SSG {#jamstack-ssg}

Gerekli veriler statikse, sunucu tarafı renderlama önceden yapılabilir. Bu, tüm uygulamayı HTML'ye önceden renderlayabileceğimiz ve statik dosyalar olarak sunabileceğimiz anlamına gelir. Bu, site performansını iyileştirir ve her istekte sayfaların dinamik olarak renderlanması gerekmeyeceği için dağıtımı çok daha basit hale getirir. Vue, istemci tarafında zengin etkileşim sağlamak için bu tür uygulamaları hala "hydrate" edebilir.

:::tip
Bu teknik, Statik Site Üretimi (SSG) olarak bilinir ve [JAMStack](https://jamstack.org/what-is-jamstack/) olarak da anılır.
:::

SSG'nin iki çeşidi vardır: tek sayfalık ve çok sayfalık. Her iki çeşitte de site, statik HTML'ye önceden renderlanır; fark şudur:
- Başlangıç sayfa yüklemesinden sonra, tek sayfalık bir SSG sayfayı bir SPA'ya "hydrate" eder. Bu, daha fazla ön yükleme JS yükü ve "hydrate" maliyeti gerektirir ama sonraki navigasyonlar daha hızlı olacaktır, çünkü yalnızca sayfa içeriğini kısmen güncellemesi yeterlidir; tüm sayfayı yeniden yüklemesine gerek yoktur.

- Çok sayfalık bir SSG her navigasyonda yeni bir sayfa yükler. Avantajı, minimum JS gönderebilmesi veya hiç JS göndermemesi, eğer sayfa etkileşim gerektirmiyorsa!

:::note
[Astro](https://astro.build/) gibi bazı çok sayfalık SSG çerçeveleri, statik HTML içinde etkileşimli "adalar" oluşturmak için Vue bileşenlerini kullanmanıza olanak tanıyan "kısmi hidratasyon" desteği de sunar.
:::

Eğer karmaşık etkileşim, derin oturum süreleri veya navigasyonlar arasında kalıcı öğeler / durum bekliyorsanız, tek sayfalık SSG'ler daha uygundur. Aksi takdirde, çok sayfalık SSG daha iyi bir seçenek olacaktır.

Vue ekibi, şu anda okuduğunuz web sitesini çalıştıran bir statik site oluşturucu olan [VitePress](https://vitepress.dev/) üzerinde de çalışmaktadır! VitePress, SSG'nin her iki çeşidini de destekler. [Nuxt](https://nuxt.com/) da SSG'yi destekler. Aynı Nuxt uygulamasındaki farklı yollar için SSR ve SSG'yi birleştirebilirsiniz.

## Web'in Ötesinde {#beyond-the-web}

Vue, esasen web uygulamaları oluşturmak için tasarlanmış olsa da, sadece tarayıcı ile sınırlı değildir. Şunları yapabilirsiniz:

- [Electron](https://www.electronjs.org/) ile masaüstü uygulamaları oluşturun
- [Ionic Vue](https://ionicframework.com/docs/vue/overview) ile mobil uygulamalar oluşturun
- [Quasar](https://quasar.dev/) veya [Tauri](https://tauri.app) ile aynı kod tabanından hem masaüstü hem de mobil uygulamalar oluşturun
- [TresJS](https://tresjs.org/) ile 3D WebGL deneyimleri oluşturun
- Vue'nun `Özel Render Sağlayıcı API'sini` kullanarak, [terminal](https://github.com/vue-terminal/vue-termui) gibi özel sağlayıcılar oluşturun!