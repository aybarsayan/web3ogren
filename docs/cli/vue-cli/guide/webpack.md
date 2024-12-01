---
title: Webpack ile Çalışmak
description: Webpack konfigürasyonunun temel ve gelişmiş kullanım yöntemlerini açıklayan kapsamlı bir rehber. Yönetimi ve özelleştirmeyi kolaylaştıracak ipuçları ve teknikler sunmaktadır.
keywords: [Webpack, vue, konfigürasyon, geliştirme, webpack-merge, html-webpack-plugin, vue-cli-service]
---

# Webpack ile Çalışmak

## Basit Konfigürasyon

Webpack konfigürasyonunu ayarlamanın en kolay yolu, `vue.config.js` dosyasındaki `configureWebpack` seçeneğine bir nesne sağlamaktır:

``` js
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
```

Nesne, [webpack-merge](https://github.com/survivejs/webpack-merge) kullanılarak nihai webpack konfigürasyonuna birleştirilecektir.

::: warning
Bazı webpack seçenekleri, `vue.config.js`'deki değerler temel alınarak ayarlanır ve doğrudan değiştirilmemelidir. Örneğin, `output.path`'i değiştirmek yerine, `vue.config.js`'de `outputDir` seçeneğini kullanmalısınız; `output.publicPath`'i değiştirmek yerine, `vue.config.js`'de `publicPath` seçeneğini kullanmalısınız. Bunun nedeni, `vue.config.js`'deki değerlerin, her şeyin doğru bir şekilde çalışmasını sağlamak için konfigürasyon içinde birçok yerde kullanılacak olmasıdır.
:::

Eğer ortam temelinde koşullu davranışa ihtiyaç duyuyorsanız ya da doğrudan konfigürasyonu değiştirmek istiyorsanız, bir fonksiyon kullanmalısınız (bu fonksiyon, env değişkenleri ayarlandıktan sonra tembel bir şekilde değerlendirilecektir). Fonksiyon, çözülmüş konfigürasyonu argüman olarak alır. Fonksiyon içinde, ya konfigürasyonu doğrudan değiştirebilir ya da bir nesne döndürebilir ve bu nesne birleştirilir:

``` js
// vue.config.js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // üretim için konfigürasyonu değiştir...
    } else {
      // geliştirme için değiştir...
    }
  }
}
```

## Zincirleme (Gelişmiş)

Dahili webpack konfigürasyonu, [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) kullanılarak korunmaktadır. Kütüphane, ham webpack konfigürasyonu üzerinde bir soyutlama sağlar ve adlandırılmış yükleyici kuralları ve adlandırılmış eklentiler tanımlama yeteneği sunar ve daha sonra bu kurallara "tap" olup onların seçeneklerini değiştirme fırsatı verir.

Bu, iç konfigürasyon üzerinde daha ayrıntılı kontrol sağlar. Aşağıda, `vue.config.js` dosyasındaki `chainWebpack` seçeneği aracılığıyla yaygın değişikliklerin bazı örneklerini göreceksiniz.

::: tip
`vue inspect` belirli yükleyicilere zincirleme yoluyla erişmeye çalışırken son derece faydalı olacaktır.
:::

### Bir Yükleyicinin Seçeneklerini Değiştirmek

``` js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
        .tap(options => {
          // seçenekleri değiştir...
          return options
        })
  }
}
```

::: tip
CSS ile ilgili yükleyiciler için, yükleyicilere doğrudan zincirleme ile hedeflemek yerine `css.loaderOptions` kullanılması önerilir. Bunun nedeni, her CSS dosya türü için birden fazla kural olması ve `css.loaderOptions`'un tüm kuralları tek bir yerde etkileyebilmenizi sağlamasıdır.
:::

### Yeni Bir Yükleyici Eklemek

``` js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // GraphQL Yükleyici
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
      // başka bir yükleyici ekle
      .use('other-loader')
        .loader('other-loader')
        .end()
  }
}
```

### Bir Kuralın Yükleyicilerini Değiştirmek

Eğer mevcut bir [Temel Yükleyici](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js) örneğin `vue-svg-loader` kullanarak SVG dosyalarını yüklemek yerine inline olarak kullanmak isterseniz:

``` js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    // mevcut tüm yükleyicileri temizle.
    // Bunu yapmazsanız, aşağıdaki yükleyici mevcut
    // kuralların yükleyicilerine eklenecektir.
    svgRule.uses.clear()

    // değiştirici yükleyici(leri) ekle
    svgRule
      .use('vue-svg-loader')
        .loader('vue-svg-loader')
  }
}
```

### Bir Eklentinin Seçeneklerini Değiştirmek

``` js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        return [/* html-webpack-plugin'ın yapıcısına iletilecek yeni argümanlar */]
      })
  }
}
```

Bu seçeneğin tam gücünü nasıl kullanacağınızı anlamak için [webpack-chain API'sini](https://github.com/mozilla-neutrino/webpack-chain#getting-started) tanımanız ve [bazı kaynak kodlarını](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config) okumanız gerekecektir, ancak bu, webpack konfigürasyonunu doğrudan değerleri değiştirmekten daha ifade edici ve güvenli bir şekilde modifiye etmenizi sağlar.

> Örneğin, `index.html`'in varsayılan konumunu `/Users/username/proj/public/index.html`'den `/Users/username/proj/app/templates/index.html`'e değiştirmek istediğinizi varsayın. [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#options) referansını inceleyerek geçirebileceğiniz bir dizi seçeneği görebilirsiniz. Şablon yolumuzu değiştirmek için aşağıdaki konfigürasyonu geçirebiliriz:
>
> ``` js
> // vue.config.js
> module.exports = {
>   chainWebpack: config => {
>     config
>       .plugin('html')
>       .tap(args => {
>         args[0].template = '/Users/username/proj/app/templates/index.html'
>         return args
>       })
>   }
> }
> ```

Bu değişikliğin yapıldığını doğrulamak için `vue inspect` aracıyla vue webpack konfigürasyonunu inceleyebilirsiniz, bu konuyu bir sonraki bölümde ele alacağız.

## Projenin Webpack Konfigürasyonunu İnceleme

`@vue/cli-service`, webpack konfigürasyonunu soyutladığı için, konfigürasyonda nelerin bulunduğunu anlamak, özellikle kendiniz değişiklik yapmaya çalışırken daha zor olabilir.

`vue-cli-service`, çözülmüş webpack konfigürasyonunu incelemek için `inspect` komutunu sunar. Global `vue` ikili dosyası da `inspect` komutunu sağlar ve bu, projenizde `vue-cli-service inspect`'e basitçe proxy yapar.

Komut, çözülmüş webpack konfigürasyonunu stdout'a yazdırır; bu, kurallara ve eklentilere zincirleme yoluyla erişim hakkında ipuçları içerir.

Çıkışı daha kolay incelemek için bir dosyaya yönlendirebilirsiniz:

```bash
vue inspect > output.js
```
Varsayılan olarak, `inspect` komutu geliştirme konfigürasyonu için çıkışı gösterir. Üretim konfigürasyonunu görmek için şu komutu çalıştırmalısınız:

```bash
vue inspect --mode production > output.prod.js
```

::: note
Not: Çıktı geçerli bir webpack konfigürasyon dosyası değildir; sadece inceleme için tasarlanmış seri bir formattır.
:::

Ayrıca, bir yolu belirterek konfigürasyonun bir alt kümesini inceleyebilirsiniz:

```bash
# sadece ilk kuralı incele
vue inspect module.rules.0
```

Ya da, adlandırılmış bir kuralı veya eklentiyi hedefleyin:

```bash
vue inspect --rule vue
vue inspect --plugin html
```

Son olarak, tüm adlandırılmış kuralları ve eklentileri listeleyebilirsiniz:

```bash
vue inspect --rules
vue inspect --plugins
```

## Çözülmüş Konfigürasyonu Dosya Olarak Kullanma

Bazı dış araçların, örneğin IDE'ler veya bir webpack konfigürasyon yolu bekleyen komut satırı araçları, çözülmüş webpack konfigürasyonuna erişmesi gerekebilir. Bu durumda aşağıdaki yolu kullanabilirsiniz:

```
<projectRoot>/node_modules/@vue/cli-service/webpack.config.js
```

Bu dosya, `vue-cli-service` komutlarında, eklentilerden ve hatta özel konfigürasyonlarınızdan kullanılan tam aynı webpack konfigürasyonunu dinamik olarak çözümler ve dışa aktarır.