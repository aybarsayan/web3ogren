---
description: Vue CLI projelerinde CSS ile çalışma, varlık referansı, ön işleyiciler, PostCSS ve CSS Modülleri gibi konuları kapsamaktadır.
keywords: [Vue CLI, CSS, PostCSS, ön işleyiciler, CSS Modülleri, webpack, stil yönetimi]
---

# CSS ile Çalışma

Vue CLI projeleri [PostCSS](http://postcss.org/), [CSS Modülleri](https://github.com/css-modules/css-modules) ve [Sass](https://sass-lang.com/), [Less](http://lesscss.org/) ve [Stylus](http://stylus-lang.com/) gibi ön işleyicilerle desteklenmektedir.

## Varlıkları Referans Alma

Tüm derlenmiş CSS'ler [css-loader](https://github.com/webpack-contrib/css-loader) tarafından işlenir; bu, `url()`'ları ayrıştırır ve bunları modül istekleri olarak çözümler. Bu, yerel dosya yapısına dayanan görece yolları kullanarak varlıklara referans verebileceğiniz anlamına gelir. 

:::info
npm bağımlılığı içinde bir dosyaya veya webpack alias'ı aracılığıyla referans vermek istiyorsanız, yolun `~` ile başlaması gerekir, aksi takdirde belirsizlik yaşanabilir. 
:::

Daha fazla detay için `Statik Varlık Yönetimi` bölümüne bakın.

## Ön İşleyiciler

Projeyi oluştururken ön işleyicileri (Sass/Less/Stylus) seçebilirsiniz. Eğer yapmadıysanız, dahili webpack yapılandırması yine de bunların hepsini yönetmek için önceden yapılandırılmıştır. Sadece ilgili webpack yükleyicilerini manuel olarak yüklemeniz gerekir:

```bash
# Sass
npm install -D sass-loader sass

# Less
npm install -D less-loader less

# Stylus
npm install -D stylus-loader stylus
```

::: tip webpack 4 Hakkında Not
`webpack` sürüm 4 kullanıyorsanız, Vue CLI 4'te varsayılan olarak, yükleyicilerinizin bununla uyumlu olduğundan emin olmalısınız. Aksi takdirde, çelişen eş bağımlılıklar hakkında hatalar alırsınız. Bu durumda, hala `webpack` 4 ile uyumlu olan daha eski bir yükleyici sürümünü kullanabilirsiniz.
```bash
# Sass
npm install -D sass-loader@^10 sass
```
:::

Sonra, ilgili dosya türlerini içe aktarabilir veya `*.vue` dosyalarında şunları kullanabilirsiniz:

```vue
<style lang="scss">
$color: red;
</style>
```

::: tip Sass Performansı Hakkında Bir İpucu
Dart Sass kullanırken, **senkron derleme varsayılan olarak asenkron derlemeden iki kat daha hızlıdır**, asenkron geri çağırmaların yükü nedeniyle. Bu yükten kaçınmak için, senkron kod yolundan asenkron içeri alıcıları çağırmak için [fibers](https://www.npmjs.com/package/fibers) paketini kullanabilirsiniz. Bunu etkinleştirmek için, basitçe `fibers`'ı bir proje bağımlılığı olarak yükleyin:
```
npm install -D fibers
```
Ayrıca, bu bir yerel modül olduğu için, işletim sistemi ve derleme ortamında uyumluluk sorunları olabileceğini de unutmayın. Bu durumda, problemi çözmek için `npm uninstall -D fibers` komutunu çalıştırabilirsiniz.
:::

### Otomatik İçe Aktarımlar

Renkler, değişkenler, karışımlar vb. için dosyaları otomatik olarak içe aktarmak istiyorsanız, [style-resources-loader](https://github.com/yenshih/style-resources-loader) kullanabilirsiniz. İşte `./src/styles/imports.styl` dosyasını her SFC veya her stylus dosyasında içe aktaran bir stilus örneği:

```js
// vue.config.js
const path = require('path')

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/imports.styl'),
      ],
    })
}
```

Ayrıca [vue-cli-plugin-style-resources-loader](https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader) kullanabilirsiniz.

## PostCSS

Vue CLI, PostCSS'i dahili olarak kullanır.

PostCSS'i `.postcssrc` üzerinden veya [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config) tarafından desteklenen herhangi bir yapılandırma kaynağı aracılığıyla yapılandırabilirsiniz ve [postcss-loader](https://github.com/postcss/postcss-loader) yapılandırmasını `vue.config.js`'de `css.loaderOptions.postcss` aracılığıyla ayarlayabilirsiniz.

[autoprefixer](https://github.com/postcss/autoprefixer) eklentisi varsayılan olarak etkinleştirilmiştir. Tarayıcı hedeflerini yapılandırmak için `package.json` dosyasındaki `browserslist` alanını kullanın.

::: tip Vendor-tabanlı CSS Kuralları Hakkında Not
Üretim oluşturmasında, Vue CLI CSS'inizi optimize eder ve tarayıcı hedeflerinize göre gereksiz vendor-tabanlı CSS kurallarını kaldırır. Varsayılan olarak `autoprefixer` etkinleştirildiği için, her zaman yalnızca vendor'sız CSS kurallarını kullanmalısınız.
:::

## CSS Modülleri

`*.vue` dosyalarında [CSS Modüllerini kullanabilirsiniz](https://vue-loader.vuejs.org/en/features/css-modules.html) ve `` ile kutudan çıkar.

JavaScript'te CSS veya diğer ön işleyici dosyalarını CSS Modülleri olarak içe aktarmak için dosya adının `.module(s).(css|less|sass|scss|styl)` ile bitmesi gerekir:

```js
import styles from './foo.module.css'
// tüm desteklenen ön işleyiciler için de çalışır
import sassStyles from './foo.module.scss'
```

Dosya adlarında `.module`'ı düşürmek ve tüm stil dosyalarını CSS Modülleri olarak değerlendirmek istiyorsanız, `css-loader` seçeneğini şu şekilde yapılandırmalısınız:

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      css: {
        modules: {
          auto: () => true
        }
      }
    }
  }
}
```

Oluşturulan CSS Modülleri sınıf adlarını özelleştirmek isterseniz, bunu da `vue.config.js`'de `css.loaderOptions.css` aracılığıyla yapabilirsiniz. Tüm `css-loader` seçenekleri burada desteklenmektedir:

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      css: {
        // Not: aşağıdaki yapılandırma formatı farklı Vue CLI sürümleri arasında farklıdır
        // Daha fazla bilgi için ilgili css-loader dökümantasyonuna bakın.
        // Vue CLI v3 css-loader v1 kullanır: https://www.npmjs.com/package/css-loader/v/1.0.1
        // Vue CLI v4 css-loader v3 kullanır: https://www.npmjs.com/package/css-loader/v/3.6.0
        // Vue CLI v5 css-loader v5 kullanır: https://github.com/webpack-contrib/css-loader#readme
        modules: {
          localIdentName: '[name]-[hash]',
          exportLocalsConvention: 'camelCaseOnly'
        }
      }
    }
  }
}
```

## Ön İşleyici Yükleyicilere Seçenek Geçişi

Bazen ön işleyicinin webpack yükleyicisine seçenekler geçmek isteyebilirsiniz. Bunu `vue.config.js`'deki `css.loaderOptions` seçeneğini kullanarak yapabilirsiniz. Örneğin, tüm Sass/Less stillerinize bazı paylaşılan genel değişkenler geçmek için:

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // sass-loader'a seçenek geçin
      // @/ src/'ye bir alias'dır
      // bu, 'src/variables.sass' adlı bir dosyanız olduğu varsayımındadır
      // Not: bu seçenek sass-loader v8'de "prependData" olarak adlandırılır
      sass: {
        additionalData: `@import "~@/variables.sass"`
      },
      // varsayılan olarak `sass` seçeneği her iki sözdizimini de kapsar
      // çünkü `scss` sözdizimi de altta yatan sass-loader tarafından işlenir
      // ancak `prependData` seçeneğini yapılandırırken
      // `scss` sözdizimi bir ifadenin sonuna noktalı virgül gerektirirken, `sass` sözdizimi gerektirmez
      // bu durumda, `scss` sözdizimini `scss` seçeneğini kullanarak ayrı hedefleyebiliriz
      scss: {
        additionalData: `@import "~@/variables.scss";`
      },
      // less-loader'a Less.js Seçeneklerini geçin
      less: {
        // http://lesscss.org/usage/#less-options-strict-units `Küresel Değişkenler`
        // `primary` küresel değişken alan adı
        globalVars: {
          primary: '#fff'
        }
      }
    }
  }
}
```

`loaderOptions` aracılığıyla yapılandırılabilen yükleyiciler şunlardır:

- [css-loader](https://github.com/webpack-contrib/css-loader)
- [postcss-loader](https://github.com/postcss/postcss-loader)
- [sass-loader](https://github.com/webpack-contrib/sass-loader)
- [less-loader](https://github.com/webpack-contrib/less-loader)
- [stylus-loader](https://github.com/shama/stylus-loader)

::: tip
Bu, belirli yükleyicilere `chainWebpack` kullanarak manuel olarak erişmekten tercih edilir, çünkü bu seçeneklerin kullanıldığı birden fazla yerde uygulanması gerekir.
:::