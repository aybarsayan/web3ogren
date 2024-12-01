---
description: Projelerinizi hafif, duyarlı ve sürdürülebilir tutarak en iyi deneyimi sunabilir ve daha önemli işlere odaklanabilirsiniz.
keywords: [CoreUI, Sass, JavaScript, Optimizasyon, Web Geliştirme]
---

## Hafif Sass içe aktarımları

Varlık boru hattınızda Sass kullanırken, **ihtiyacınız olan bileşenleri yalnızca `@import` yaparak CoreUI'yi Bootstrap için optimize ettiğinizden emin olun.** En büyük optimizasyonlarınız muhtemelen `coreui.scss` dosyamızdaki `Layout & Components` bölümünden gelecektir.

Eğer bir bileşeni kullanmıyorsanız, onu **yorum satırı haline** getirin veya tamamen silin. Örneğin, carousel kullanmıyorsanız, derlenmiş CSS dosyanızda dosya boyutunu azaltmak için o içe aktarmayı kaldırın. Bazı Sass içe aktarımları arasında dosyayı hariç tutmayı zorlaştıran bağımlılıkların olduğunu aklınızda bulundurun.

---

## Hafif JavaScript

CoreUI for Bootstrap'ın JavaScript'i, ana dağıtım dosyalarımızda (`coreui.js` ve `coreui.min.js`) ve yan dosyalarımızda (Popper ile birlikte) (`coreui.bundle.js` ve `coreui.bundle.min.js`) her bileşeni içerir. Sass aracılığıyla özelleştirirken, **ilgili JavaScript'i kaldırdığınızdan emin olun.**

**Örneğin**, Webpack, Parcel veya Vite gibi kendi JavaScript paketleyicinizi kullanıyorsanız, yalnızca kullanmayı planladığınız JavaScript'i içe aktarabilirsiniz. Aşağıdaki örnekte, yalnızca modal JavaScript'imizi nasıl ekleyebileceğimizi gösteriyoruz:


```js
// Gereksinim duyduğumuz şeyleri içe aktarın

// import '@coreui/coreui/js/dist/alert';
// import '@coreui/coreui/js/dist/button';
// import '@coreui/coreui/js/dist/carousel';
// import '@coreui/coreui/js/dist/collapse';
// import '@coreui/coreui/js/dist/dropdown';
import '@coreui/coreui/js/dist/modal';
// import '@coreui/coreui/js/dist/popover';
// import '@coreui/coreui/js/dist/scrollspy';
// import '@coreui/coreui/js/dist/tab';
// import '@coreui/coreui/js/dist/toast';
// import '@coreui/coreui/js/dist/tooltip';
```

Bu şekilde, butonlar, carouseller ve tooltipler gibi bileşenler için kullanmayı düşünmediğiniz hiçbir JavaScript'i dahil etmiyorsunuz. Eğer dropdown, tooltip veya popoverları içe aktaracaksanız, **`package.json` dosyanızda Popper bağımlılığını belirtmeye dikkat edin.**


### Varsayılan İçe Aktarımlar

`@coreui/coreui/js/dist` içindeki dosyalar **varsayılan içe aktarma** kullanır, bu nedenle bunlardan birini kullanmak istiyorsanız aşağıdakileri yapmalısınız:


```js
import Modal from '@coreui/coreui/js/dist/modal'

const modal = new Modal(document.getElementById('myModal'))
```
---

## Autoprefixer .browserslistrc

CoreUI for Bootstrap, belirli CSS özelliklerine tarayıcı önekleri otomatik olarak eklemek için Autoprefixer'a bağımlıdır. Önekler, CoreUI for Bootstrap deposunun kökünde bulunan **`.browserslistrc`** dosyamızla belirlenir. Bu tarayıcılar listesini özelleştirip Sass'ı yeniden derleyerek, o tarayıcıya veya sürüme özel satıcı öneklerinin olması durumunda derlenmiş CSS'inizden bazı CSS'leri otomatik olarak kaldırabilirsiniz.

---

## Kullanılmayan CSS

:::tip
_Bu bölümde yardım isteniyor, lütfen bir PR açmayı düşünün. Teşekkürler!_
:::

Bootstrap ile [PurgeCSS](https://github.com/FullHuman/purgecss) kullanımı için önceden oluşturulmuş bir örneğimiz yok, ama topluluğun yazdığı bazı yararlı makaleler ve kılavuzlar mevcut. İşte bazı seçenekler:

- 
- 

Son olarak, bu [CSS Tricks kullanmayan CSS makalesi](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/) PurgeCSS ve diğer benzer araçların nasıl kullanılacağını göstermektedir.

---

## Küçültme ve gzip

Olabildiğince, ziyaretçilerinize sunduğunuz tüm kodları sıkıştırmaya dikkat edin. Bootstrap dağıtım dosyalarını kullanıyorsanız, **küçültülmüş versiyonları** (`.min.css` ve `.min.js` uzantılarıyla belirtilen) kullanmaya çalışın. Bootstrap'i kendi yapılandırma sisteminizle kaynaktan oluşturuyorsanız, **HTML, CSS ve JS için kendi küçültücülerini uyguladığınızdan emin olun.**

---

## Engellemeyen dosyalar

Küçültme ve sıkıştırma kullanmak yeterliymiş gibi görünse de, dosyalarınızı **engellemeyen hale getirmek**, sitenizi iyi optimize etmek ve yeterince hızlı hale getirmek için büyük bir adım olacaktır.

Eğer Google Chrome'da [Lighthouse](https://developers.google.com/web/tools/lighthouse/) eklentisini kullanıyorsanız, FCP ile karşılaşmış olabilirsiniz. [First Contentful Paint](https://web.dev/fcp/) metriği, “sayfanın yüklenmeye başladığı zamandan, sayfanın içeriğinin herhangi bir kısmının ekranda görüntülenmeye başladığı ana kadar geçen süreyi” ölçer.

FCP'yi, dikkate alınmayan JavaScript veya CSS'i erteleyerek iyileştirebilirsiniz. Bu ne anlama geliyor? Basitçe, sayfanızın ilk çiziminde mevcut olmayan JavaScript veya stiller, **`async` veya `defer`** nitelikleriyle işaretlenmelidir.

Bu, önemsiz kaynakların daha sonra yüklenmesini ve ilk çizimi engellemeyeceğini garanti eder. **Diğer yandan**, kritik kaynaklar satır içi betikler veya stiller olarak dahil edilebilir.

Bununla ilgili daha fazla bilgi edinmek isterseniz, çok sayıda harika makale zaten mevcut:

- 
- 

---

## Her Zaman HTTPS Kullanın

Web siteniz yalnızca üretimde HTTPS bağlantıları üzerinden erişilebilir olmalıdır. HTTPS, **tüm sitelerin güvenliğini, gizliliğini ve erişilebilirliğini artırır** ve [duyarlı web trafiği yoktur](https://https.cio.gov/everything/). Web sitenizi yalnızca HTTPS üzerinden sunacak şekilde yapılandırmak için gereken adımlar, mimarinize ve web barındırma sağlayıcınıza bağlı olarak geniş bir yelpazeye yayıldığından, bu belgelerin kapsamının dışındadır.

HTTPS üzerinden sunulan siteler, **tüm stilleri, betikleri ve diğer varlıkları** da HTTPS bağlantıları üzerinden erişmelidir. Aksi takdirde, kullanıcılara **[karışık etkin içerik](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)** gönderiyorsunuz ve bu, bir bağımlılığı değiştirerek bir sitenin ele geçirilmesiyle potansiyel güvenlik açıklarına yol açabilir. Bu, güvenlik sorunlarına ve kullanıcılara gösterilen tarayıcı içi uyarılara yol açabilir. Bootstrap'i bir CDN'den alıyor ya da kendiniz sunuyorsanız, yalnızca HTTPS bağlantıları üzerinden erişim sağladığınızdan emin olun.