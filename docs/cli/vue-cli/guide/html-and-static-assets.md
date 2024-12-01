---
title: HTML ve Statik Varlıklar
description: Bu belgede, HTML ve statik varlık yönetimi konuları ele alınmaktadır. HTML şablonları ile Vue uygulamalarında ön yükleme ve önceden yükleme ipuçları kullanımı açıklanmaktadır.
keywords: [HTML, Vue, statik varlıklar, ön yükleme, webpack, prefetch, preload]
---

# HTML ve Statik Varlıklar

## HTML

### İndeks Dosyası

`public/index.html` dosyası, [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) ile işlenecek bir şablondur. Derleme sırasında, varlık bağlantıları otomatik olarak enjekte edilecektir. Ayrıca, Vue CLI, kaynak ipuçlarını (`preload/prefetch`), manifest/ikon bağlantılarını (PWA eklentisi kullanıldığında) ve derleme sırasında üretilen JavaScript ve CSS dosyalarına ait varlık bağlantılarını da otomatik olarak enjekte eder.

### İnterpolasyon

İndeks dosyası şablon olarak kullanıldığından, içerisine değerleri interpolasyon yapmak için [lodash şablonu](https://lodash.com/docs/4.17.10#template) sözdizimini kullanabilirsiniz:

- `` kaçışsız interpolasyon için;
- `` HTML kaçışlı interpolasyon için;
- `` JavaScript kontrol akışları için.

Ayrıca [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates) tarafından ortaya konan `varsayılan değerlerin` yanı sıra, tüm `istemci tarafı env değişkenleri` de doğrudan kullanılabilir. Örneğin, `BASE_URL` değerini kullanmak için:

```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

::: info Dikkat Edilmesi Gerekenler
Her zaman doğru `BASE_URL` değerini kullanmaya özen gösterin. Yanlış bir değer, uygulamanızın kaynaklarını yükleyememesine yol açabilir.
:::

Ayrıca bakınız:
- `publicPath`

### Ön Yükleme

[``](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) sayfalarınızın yüklenmesinden hemen sonra ihtiyaç duyacağı kaynakları belirlemek için kullanılan bir kaynak ipucu türüdür. Bu nedenle, sayfa yüklemesi sırasında erken ön yüklemeye başlamak istersiniz.

> Varsayılan olarak, bir Vue CLI uygulaması, uygulamanızın başlangıç render işlemi için gereken tüm dosyalar için otomatik olarak ön yükleme ipuçları oluşturur.  
> — Vue CLI Dokümantasyonu

İpuçları, [@vue/preload-webpack-plugin](https://github.com/vuejs/preload-webpack-plugin) kullanılarak enjekte edilir ve `chainWebpack` yoluyla `config.plugin('preload')` olarak değiştirilip silinebilir.

### Önceden Yükleme

[``](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ) kullanıcının yakın gelecekte ziyaret edebileceği içeriğin tarayıcıda önceden yüklenmesini söyleyen bir kaynak ipucu türüdür. Sayfa yüklendikten sonra tarayıcının boş zamanında devreye girer.

Varsayılan olarak, bir Vue CLI uygulaması, asenkron parçalar için üretilen tüm JavaScript dosyaları için otomatik olarak önceden yükleme ipuçları oluşturur (bu, [isteğe bağlı kod ayırma yoluyla dinamik `import()`](https://webpack.js.org/guides/code-splitting/#dynamic-imports) ile sonuçlanır).

İpuçları, [@vue/preload-webpack-plugin](https://github.com/vuejs/preload-webpack-plugin) kullanılarak enjekte edilir ve `chainWebpack` yoluyla `config.plugin('prefetch')` olarak değiştirilip silinebilir.

::: tip Çoklu sayfa ayarları için not
Çoklu sayfa ayarı kullanırken, yukarıdaki eklenti adı 'prefetch-{sayfa adı}' yapısına uygun hale getirilmelidir; örneğin 'prefetch-app'.
:::

Örnek:

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // ön yükleme eklentisini kaldır
    config.plugins.delete('prefetch')

    // veya:
    // ayarlarını değiştir:
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
      return options
    })
  }
}
```

Ön yükleme eklentisi devre dışı bırakıldığında, belirli parçaları önceden yüklemek için webpack'in iç yorumlarını manuel olarak seçebilirsiniz:

```js
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```

webpack'in çalışma zamanı, üst parça yüklendiğinde ön yükleme bağlantılarını enjekte edecektir.

::: tip
Ön yükleme bağlantıları bant genişliği tüketecektir. Eğer büyük bir uygulamanız varsa ve birçok asenkron parça içeriyorsa ve kullanıcılarınızın çoğunluğu mobil kullanıcıysa, ön yükleme bağlantılarını devre dışı bırakmayı ve ön yükleme için parçaları manuel olarak seçmeyi düşünebilirsiniz.
:::

### İndeks Üretimini Devre Dışı Bırakma

Mevcut bir arka uç ile Vue CLI kullanıyorsanız, oluşturulan varlıkların bir sunucu tarafından render edilen bir sayfada kullanılabilmesi için `index.html` üretimini devre dışı bırakmanız gerekebilir. Bunu yapmak için, aşağıdakiler `vue.config.js` dosyasına eklenebilir:

```js
// vue.config.js
module.exports = {
  // dosya adlarında hash'leri devre dışı bırak
  filenameHashing: false,
  // HTML ile ilgili webpack eklentilerini sil
  chainWebpack: config => {
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  }
}
```

Ancak, bu gerçekten önerilmez çünkü:

- Sabit kodlu dosya adları, etkili önbellek kontrolünü uygulamayı daha zor hale getirir.
- Sabit kodlu dosya adları ayrıca, değişken dosya adları ile ek JavaScript dosyaları üreten kod ayırma ile iyi çalışmaz.
- Sabit kodlu dosya adları `Modern Mod` ile çalışmaz.

Bunun yerine, sunucu tarafı çerçevenizde üretilen HTML'i görünüm şablonu olarak kullanmak için `indexPath` seçeneğini kullanmayı düşünmelisiniz.

### Çok Sayfalı Uygulama Oluşturma

Her uygulama bir SPA olmak zorunda değildir. Vue CLI, `vue.config.js` içindeki `pages` seçeneğini kullanarak çok sayfalı bir uygulama oluşturmayı destekler. Oluşturulan uygulama, optimal yükleme performansı için birden fazla giriş arasında ortak parçaları verimli bir şekilde paylaşır.

---

## Statik Varlıkların Yönetimi

Statik varlıklar iki farklı şekilde yönetilebilir:

- JavaScript içinde veya şablonlar/CSS aracılığıyla göreceli yollarla referans alınarak içe aktarılır. Bu tür referanslar webpack tarafından işlenecektir.

- `public` dizinine yerleştirilerek, mutlak yollarla referans alınır. Bu varlıklar yalnızca kopyalanacak ve webpack'ten geçmeyecektir.

### Göreceli Yol İçe Aktarımları

JavaScript, CSS veya `*.vue` dosyaları içinde göreceli bir yol kullanarak bir statik varlığı referans aldığınızda (mutlaka `.` ile başlamalıdır), varlık webpack'in bağımlılık grafiğine dahil edilecektir. Bu derleme sürecinde, `<img src="...">`, `background: url(...)` ve CSS `@import` gibi tüm varlık URL'leri **modül bağımlılıkları olarak çözülür**.

> Örneğin, `url(./image.png)` ifadesi `require('./image.png')` şeklinde çevrilecektir ve  
> `<img src="./image.png">`  şu şekilde derlenecektir:  
> — Vue CLI Dokümantasyonu

```html
<img src="./image.png">
```

```js
h('img', { attrs: { src: require('./image.png') }})
```

Dahili olarak, webpack'i [Varlık Modülleri](https://webpack.js.org/guides/asset-modules/) ile yapılandırarak nihai dosya konumunu versiyon hash'leri ve doğru kamu taban yolları ile belirliyoruz ve 8KiB'den küçük varlıkları koşullu olarak içe alıyoruz; bu da HTTP isteklerinin miktarını azaltır.

İçine alım dosyası boyut sınırını `chainWebpack` aracılığıyla ayarlayabilirsiniz. Örneğin, içe alınan resimler için sınırı 4KiB olarak ayarlamak için:

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('images')
        .set('parser', {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4KiB
          }
        })
  }
}
```

### URL Dönüşüm Kuralları

- Eğer URL mutlak bir yol ise (örn. `/images/foo.png`), olduğu gibi korunur.

- Eğer URL `.` ile başlıyorsa, bu, göreceli bir modül talebi olarak yorumlanır ve dosya sisteminizdeki klasör yapısına göre çözülür.

- Eğer URL `~` ile başlıyorsa, sonraki her şey bir modül talebi olarak yorumlanır. Bu, node modülleri içindeki varlıkları bile referans alabileceğiniz anlamına gelir:

```html
<img src="~some-npm-package/foo.png">
```

- Eğer URL `@` ile başlıyorsa, bu da bir modül talebi olarak yorumlanır. Bu, Vue CLI'nin varsayılan olarak `@` simgesini `/src` olarak tahsis etmesi nedeniyle faydalıdır. **(sadece şablonlar için)**

### `public` Klasörü

`public` klasörüne yerleştirilen herhangi bir statik varlık yalnızca kopyalanacak ve webpack'ten geçmeyecektir. Bunu mutlak yollarla referans almanız gerekmektedir.

Varlıkları modül bağımlılık grafiğinizin bir parçası olarak içe aktarımınızı öneriyoruz, böylece webpack'ten geçerek aşağıdaki avantajları elde edersiniz:

- Betikler ve stiller bir araya toplanır ve extra ağ isteklerini önlemek için birleştirilir.
- Eksik dosyalar, kullanıcılarınız için 404 hataları yerine derleme hatalarına neden olur.
- Sonuç dosyası adları içerik hash'lerini içerir, böylece tarayıcıların eski sürümlerini önbelleğe alması konusunda endişelenmeniz gerekmez.

`public` dizini bir **kaçış yolu** olarak sağlanmıştır ve bunu mutlak yol ile referans aldığınızda uygulamanızın nerede dağıtılacağını göz önünde bulundurmalısınız. Uygulamanız bir alanın kökünde dağıtılmamışsa, URL'lerinizi `publicPath` ile öneklemek zorunda kalacaksınız:

- `public/index.html` veya `html-webpack-plugin` tarafından şablon olarak kullanılan diğer HTML dosyalarında, bağlantıyı `` ile öneklemelisiniz:

```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```

- Şablonlarda, öncelikle bileşeninize temel URL'yi geçmeniz gerekecektir:

```js
data () {
  return {
    publicPath: process.env.BASE_URL
  }
}
```

Sonrasında:

```html
<img :src="`${publicPath}my-image.png`">
```

### `public` klasörünü ne zaman kullanmalısınız

- Bir dosyanın yapı çıktısında belirli bir isimle bulunmasına ihtiyacınız var.
- Binlerce resminiz var ve bunların yollarını dinamik olarak referans almanız gerekiyor.
- Bazı kütüphaneler Webpack ile uyumsuz olabilir ve başka seçeneğiniz yoksa onları `` etiketi olarak dahil etmeniz gerekir.