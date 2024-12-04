---
title: Sıkça Sorulan Sorular
seoTitle: Vue Sıkça Sorulan Sorular
sidebar_position: 1
description: Vue hakkında sıkça sorulan soruları yanıtlayan kapsamlı bir rehber. Bu rehberde Vueun özellikleri, yönetimi, desteklenen tarayıcılar ve daha fazlası hakkında bilgi bulabilirsiniz.
tags: 
  - Vue
  - SSS
  - JavaScript
  - Open Source
  - Framework
keywords: 
  - Vue.js
  - Sıkça Sorulan Sorular
  - JavaScript Framework
  - Web Development
---
## Sıkça Sorulan Sorular {#frequently-asked-questions}

## Vue'u kim yönetiyor? {#who-maintains-vue}

Vue, bağımsız, topluluk destekli bir projedir. 2014 yılında [Evan You](https://twitter.com/youyuxi) tarafından kişisel bir yan proje olarak oluşturulmuştur. Bugün, Vue, `dünyanın dört bir yanından hem tam zamanlı hem de gönüllü üyelerden oluşan bir ekip tarafından aktif olarak yönetilmektedir` ve Evan proje lideri olarak görev yapmaktadır. Vue'un hikayesi hakkında daha fazla bilgi edinebilirsiniz [belgesel](https://www.youtube.com/watch?v=OrxmtDw4pVI).

Vue'un geliştirilmesi, esas olarak sponsorlar aracılığıyla finanse edilmektedir ve 2016'dan bu yana mali olarak sürdürülebilir bir yapıya sahiptir. Eğer siz veya işiniz Vue'dan fayda sağlıyorsanız, Vue'un gelişimini desteklemek için `bize sponsor olmayı` düşünün!

## Vue 2 ile Vue 3 arasındaki fark nedir? {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3, Vue'un mevcut ve en güncel ana sürümüdür. Vue 2'de bulunmayan Teleport, Suspense ve birden fazla kök element gibi yeni özellikler içermektedir. Ayrıca, Vue 2 ile uyumsuz hale getiren bazı yıkıcı değişiklikler de bulunmaktadır. Tam detaylar [Vue 3 Göç Rehberinde](https://v3-migration.vuejs.org/) belgelenmiştir.

:::tip
Farklılıklara rağmen, çoğu Vue API'si iki ana sürüm arasında paylaşılmaktadır, bu nedenle Vue 2 bilgilerinizi Vue 3'te kullanmaya devam edebilirsiniz.
:::

Özellikle, Composition API başlangıçta yalnızca Vue 3'e ait bir özellikti, ancak artık Vue 2'ye geri portlanmış ve [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01) sürümünde mevcut bulunmaktadır.

Genel olarak, Vue 3 daha küçük paket boyutları, daha iyi performans, daha iyi ölçeklenebilirlik ve daha iyi TypeScript / IDE desteği sağlar. Eğer bugün yeni bir proje başlatıyorsanız, Vue 3 önerilen tercihtir. Şu anda Vue 2'yi düşünmenizi gerektiren yalnızca birkaç sebep vardır:

- IE11'i desteklemeniz gerekiyor. Vue 3, modern JavaScript özelliklerini kullanır ve IE11'i desteklemez.

Eğer mevcut bir Vue 2 uygulamasını Vue 3'e taşımayı düşünüyorsanız, [göç rehberine](https://v3-migration.vuejs.org/) başvurun.

## Vue 2 hala destekleniyor mu? {#is-vue-2-still-supported}

Temmuz 2022'de yayınlanan Vue 2.7, Vue 2 sürüm aralığının son küçük sürümüdür. Vue 2 artık bakım moduna girmiştir: yeni özellikler sunmayacak, ancak 2.7 sürüm tarihinden itibaren 18 ay boyunca kritik hata düzeltmeleri ve güvenlik güncellemeleri almaya devam edecektir. Bu durum, **Vue 2'nin 31 Aralık 2023 tarihinde Kullanım Dışı Olacağı** anlamına gelmektedir.

:::warning
Bunun, ekosistemin çoğunun Vue 3'e geçiş yapması için yeterince zaman sağlayacağına inanıyoruz.
:::

Ancak, bu zaman dilimi içinde yükseltme yapamayan ve güvenlik ile uyum gereksinimlerini karşılamak zorunda kalan ekipler veya projeler olabileceğini de anlıyoruz. Bu tür ihtiyaçları olan ekipler için Vue 2'ye uzatılmış destek sağlamak amacıyla sektör uzmanlarıyla iş birliği yapıyoruz - eğer ekibiniz 2023 sonrasında Vue 2'yi kullanmayı bekliyorsa, önceden plan yapmalı ve [Vue 2 Uzatılmış LTS](https://v2.vuejs.org/lts/) hakkında daha fazla bilgi edinmelisiniz.

## Vue hangi lisansı kullanıyor? {#what-license-does-vue-use}

Vue, [MIT Lisansı](https://opensource.org/licenses/MIT) altında yayımlanan ücretsiz ve açık kaynaklı bir projedir.

## Vue hangi tarayıcıları destekliyor? {#what-browsers-does-vue-support}

Vue'un en son sürümü (3.x) yalnızca [yerel ES2016 desteği olan tarayıcıları](https://caniuse.com/es2016) desteklemektedir. Bu, IE11'i dışlar. Vue 3.x, çok eski tarayıcılarda polyfill yapılamayacak ES2016 özelliklerini kullanmaktadır, bu nedenle eğer eski tarayıcıları desteklemeniz gerekiyorsa, Vue 2.x'i kullanmanız gerekecektir.

## Vue güvenilir mi? {#is-vue-reliable}

Vue, olgun ve savaş testinden geçmiş bir çerçevedir. Bugün dünyada en yaygın olarak kullanılan JavaScript çerçevelerinden biridir ve dünya genelinde 1,5 milyondan fazla kullanıcısı vardır ve npm'de ayda yaklaşık 10 milyon kez indirilmiştir.

:::note
Vue, Wikimedia Foundation, NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou ve daha birçok ünlü kuruluş tarafından çeşitli biçimlerde üretimde kullanılmaktadır.
:::

## Vue hızlı mı? {#is-vue-fast}

Vue 3, en performanslı ana akım frontend çerçevelerinden biridir ve manuel optimizasyon gerektirmeden çoğu web uygulaması kullanım durumunu kolayca yönetir.

Stres test senaryolarında, Vue, [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html) testinde React ve Angular'ı belirgin bir farkla geçmektedir. Ayrıca, bazı en hızlı üretim düzeyindeki sanal DOM çerçeveleri ile karşılaştırıldığında boy ölçüşmektedir.

Yukarıdaki gibi sentetik benchmark'lar, özel optimizasyonlarla birlikte ham render performansına odaklanmaktadır ve gerçek dünyadaki performans sonuçlarını tam olarak temsil etmeyebilir. Eğer sayfa yükleme performansına daha fazla önem veriyorsanız, bu web sitesini [WebPageTest](https://www.webpagetest.org/lighthouse) veya [PageSpeed Insights](https://pagespeed.web.dev/) kullanarak denetleyebilirsiniz. Bu web sitesi, tamamıyla Vue ile güçlendirilmiş olarak yer almakta, SSG ön-renderleme, tam sayfa hidratasyonu ve SPA istemci tarafı navigasyonu sunmaktadır. Hız testi, yavaş 4G ağlarında 4x CPU kısıtlaması ile emüle edilmiş bir Moto G4'te 100 puan almaktadır.

Vue'un runtime performansını otomatik olarak nasıl optimize ettiğini `Rendering Mechanism` bölümünde öğrenebilir ve özellikle talepkar durumlarda bir Vue uygulamasını optimize etme konusunda `Performance Optimization Guide` kısmına göz atabilirsiniz.

## Vue hafif mi? {#is-vue-lightweight}

Bir yapı aracı kullandığınızda, Vue'un birçok API'si ["ağaç titreştirilebilir"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) durumdadır. Örneğin, yerleşik `` bileşenini kullanmıyorsanız, bu son üretim paketine dahil edilmeyecektir.

- Sadece en minimal API'leri kullanan bir hello world Vue uygulaması, minifikasyon ve Brotli sıkıştırması ile yalnızca **16kb** civarında bir temel boyuta sahiptir. 
- Uygulamanın gerçek boyutu, çerçeveden kullandığınız isteğe bağlı özelliklerin sayısına bağlı olacaktır.

Eğer bir uygulama Vue'un sunduğu her bir özelliği kullanıyorsa, toplam çalışma boyutu yaklaşık **27kb** olacaktır.

Vue'u bir yapı aracı olmadan kullanıyorsanız, sadece ağaç titreştirme kaybı yaşamakla kalmaz, aynı zamanda şablon derleyicisini tarayıcıya göndermek zorunda kalırsınız. Bu durumda boyut yaklaşık **41kb**'ye yükselmektedir. Bu nedenle, Vue'u öncelikle ilerici gelişim için kullanıyorsanız ve bir yapı aşaması olmadan kullanıyorsanız, [petite-vue](https://github.com/vuejs/petite-vue) (sadece **6kb**) kullanmayı düşünün.

Bazı çerçeveler, Svelte gibi, tek bileşen senaryolarında son derece hafif çıktılar üreten bir derleme stratejisi kullanmaktadır. Ancak, [araştırmamız](https://github.com/yyx990803/vue-svelte-size-analysis) uygulamadaki bileşen sayısına bağlı olarak boyut farkının büyük ölçüde değiştiğini göstermektedir. Vue'un daha ağır bir temel boyutu olmasına rağmen, her bir bileşen için daha az kod üretmektedir. Gerçek dünyada, bir Vue uygulaması daha hafif bir şekilde sonuçlanabilir.

## Vue ölçeklenebilir mi? {#does-vue-scale}

Evet. Vue'un yalnızca basit kullanım durumları için uygun olduğu yönünde yaygın bir yanlış kanıya rağmen, Vue, büyük ölçekli uygulamaları yönetme konusunda mükemmel bir yeteneğe sahiptir:

- `Tek Dosya Bileşenleri`, bir uygulamanın farklı bölümlerinin yalıtılmış olarak geliştirilmesine olanak tanıyan modüler bir geliştirme modeli sunar.

- `Composition API`, birinci sınıf TypeScript entegrasyonu sağlar ve karmaşık mantığı organize etme, çıkarma ve yeniden kullanma için temiz desenler oluşturur.

- `Kapsamlı araç desteği`, uygulama büyüdükçe sorunsuz bir geliştirme deneyimi sağlar.

- Düşük giriş engeli ve mükemmel belgeleme, yeni geliştiriciler için daha düşük yönlendirme ve eğitim maliyetlerine dönüşür.

## Vue'a nasıl katkıda bulunabilirim? {#how-do-i-contribute-to-vue}

İlginiz için teşekkür ederiz! Lütfen `Topluluk Rehberimizi` kontrol edin.

## Options API mi yoksa Composition API mi kullanmalıyım? {#should-i-use-options-api-or-composition-api}

Eğer Vue'a yeni başlıyorsanız, iki stil arasında yüksek seviyeli bir karşılaştırma sağlıyoruz `burada`.

Daha önce Options API kullandıysanız ve Composition API'yi değerlendiriyorsanız, `bu SSS'ye` göz atın.

## Vue ile JavaScript mi yoksa TypeScript mi kullanmalıyım? {#should-i-use-javascript-or-typescript-with-vue}

Vue'un kendisi TypeScript ile implemente edilmiştir ve birinci sınıf TypeScript desteği sunmaktadır, ancak kullanıcı olarak TypeScript kullanmanızı zorunlu kılmaz.

TypeScript desteği, Vue'a yeni özellikler eklendiğinde önemli bir faktördür. TypeScript düşünülerek tasarlanan API'ler, hatta kendiniz TypeScript kullanmıyorsanız bile, IDE'ler ve linters tarafından genellikle daha kolay anlaşılmaktadır. Herkes kazanır. Vue API'leri, mümkün olan en iyi şekilde JavaScript ve TypeScript'te aynı şekilde çalışacak şekilde tasarlanmıştır.

TypeScript benimsemenin, başlangıç karmaşıklığı ile uzun vadeli sürdürülebilirlik kazançları arasında bir denge sağladığını unutmamak önemlidir. Bu tür bir dengenin şartları ekibinizin geçmişine ve proje ölçeğine bağlı olarak değişebilir, ancak Vue bu kararı etkileyecek bir faktör değildir.

## Vue, Web Bileşenleri ile nasıl karşılaştırılır? {#how-does-vue-compare-to-web-components}

Vue, Web Bileşenleri yerel olarak mevcut olmadan önce oluşturulmuştur ve Vue'un tasarımının bazı yönleri (örn. slotlar) Web Bileşenleri modelinden ilham almıştır.

Web Bileşenleri spesifikasyonları, özelleştirilmiş elemanlar tanımlamaya odaklandığı için oldukça düşük seviyelidir. Bir çerçeve olarak Vue, verimli DOM renderleme, reaktif durum yönetimi, araçlar, istemci tarafı yönlendirme ve sunucu tarafı renderleme gibi ek yüksek seviyeli endişeleri ele almaktadır.

Vue ayrıca yerel özel öğeleri tüketmeyi veya bunları dışa aktarmayı tamamen desteklemektedir - daha detaylı bilgi için `Vue ve Web Bileşenleri Rehberi` sayfasını inceleyebilirsiniz.