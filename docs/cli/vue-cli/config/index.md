---
description: Vue CLI yapılandırma referansı, global ayarlamalar ve projeniz için önemli seçenekler hakkında bilgi sunar.
keywords: [Vue CLI, yapılandırma, publicPath, eslint, TypeScript, Jest, Cypress]
---

# Yapılandırma Referansı

## Küresel CLI Yapılandırması

Küresel `@vue/cli` yapılandırmalarından bazıları, tercih ettiğiniz paket yöneticisi ve yerel olarak kaydedilmiş ön ayarların yer aldığı `.vuerc` adlı bir JSON dosyasında ev dizininizde saklanır. Bu dosyayı, kayıtlı seçenekleri değiştirmek için tercih ettiğiniz düzenleyici ile doğrudan düzenleyebilirsiniz.

Ayrıca, küresel CLI yapılandırmasını incelemek veya değiştirmek için `vue config` komutunu da kullanabilirsiniz.

## Hedef Tarayıcılar

`Tarayıcı Uyumluluğu` bölümüne bakın.

## vue.config.js

`vue.config.js`, projenizin kök dizininde (yani `package.json` ile birlikte) bulunduğunda `@vue/cli-service` tarafından otomatik olarak yüklenecek isteğe bağlı bir yapılandırma dosyasıdır. Ayrıca `package.json` içindeki `vue` alanını da kullanabilirsiniz, ancak bu durumda sadece JSON uyumlu değerlerle sınırlı olacağınızı unutmayın.

Dosya, seçenekleri içeren bir nesneyi dışa aktarmalıdır:

``` js
// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // seçenekler...
}
```

Alternatif olarak, `@vue/cli-service`'den `defineConfig` yardımcısını kullanabilirsiniz; bu, daha iyi intellisense desteği sağlayabilir:

```js
// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // seçenekler...
})
```

### baseUrl

Vue CLI 3.3'ten beri kullanılmayan bu alanı `publicPath` ile değiştirin.

### publicPath

- Tür: `string`
- Varsayılan: `'/'`

  Uygulamanızın dağıtılacağı temel URL (Vue CLI 3.3'ten önce `baseUrl` olarak biliniyordu). Bu, webpack'in `output.publicPath`'ının karşılığıdır, ancak Vue CLI'nin bu değeri başka amaçlar için de gerektiği için **her zaman `publicPath` kullanmalısınız**. webpack `output.publicPath`'ını değiştirmek yerine.

  Varsayılan olarak, Vue CLI uygulamanızın bir alanın kökünde dağıtılacağını varsayar; örneğin, `https://www.my-app.com/`. Uygulamanız bir alt yol altında dağıtılıyorsa, bu alt yolu bu seçenekle belirtmeniz gerekir. Örneğin, uygulamanız `https://www.foobar.com/my-app/` adresinde dağıtılıyorsa, `publicPath`'ı `'/my-app/'` olarak ayarlayın.

  Değer, ayrıca bir boş dize (`''`) veya bir göreli yol (`./`) olarak da ayarlanabilir, böylece tüm varlıklar göreli yollar kullanılarak bağlanır. Bu, oluşturulan paketlerin herhangi bir genel yol altında dağıtılmasına veya bir dosya sistemi tabanlı ortamda, örneğin bir Cordova hibrit uygulamasında kullanılmasına olanak tanır.

  ::: warning
  Göreli `publicPath`'ın bazı sınırlamaları vardır ve kullanılmamalıdır:

  - HTML5 `history.pushState` yönlendirmeleri kullanıyorsanız;
  
  - Çok sayfalı bir uygulama oluşturmak için `pages` seçeneğini kullanıyorsanız.
  :::

  Bu değer geliştirme sırasında da dikkate alınır. Geliştirme sunucunuzun kök altında sunulmasını istiyorsanız, bir koşullu değer kullanabilirsiniz:

  ``` js
  module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/production-sub-path/'
      : '/'
  }
  ```

### outputDir

- Tür: `string`
- Varsayılan: `'dist'`

  `vue-cli-service build` çalıştırıldığında üretim yapı dosyalarının oluşturulacağı dizin. Hedef dizin içeriğinin, inşa etmeden önce silineceğini unutmayın (bu davranış, inşa sırasında `--no-clean` parametresini geçerek devre dışı bırakılabilir).

  ::: tip
  Her zaman `outputDir` kullanın, webpack `output.path`'ını değiştirmek yerine.
  :::

### assetsDir

- Tür: `string`
- Varsayılan: `''`

  Üretilen statik varlıkları (js, css, img, fonts) iç içe yerleştirmek için `outputDir`'e göreli bir dizin.

  ::: tip
  `assetsDir`, üretilen varlıklardan dosya adını veya chunkFilename'ı geçersiz kıldığınızda göz ardı edilir.
  :::

### indexPath

- Tür: `string`
- Varsayılan: `'index.html'`

  Üretilen `index.html` için çıkış yolunu belirtin (outputDir'e göreli olarak). Ayrıca mutlak bir yol da olabilir.

### filenameHashing

- Tür: `boolean`
- Varsayılan: `true`

  Varsayılan olarak, üretilen statik varlıkların dosya adında daha iyi önbellekleme kontrolü için hash'ler içerir. Ancak, bu, oluşturulan HTML'nin Vue CLI tarafından otomatik olarak oluşturulmasını gerektirir. Eğer Vue CLI tarafından üretilen index HTML'yi kullanamadıysanız, bu seçeneği `false` olarak ayarlayarak dosya adı hashing'ini devre dışı bırakabilirsiniz.

### pages

- Tür: `Object`
- Varsayılan: `undefined`

  Uygulamayı çok sayfalı modda oluşturun. Her "sayfanın" karşılık gelen bir JavaScript giriş dosyası olmalıdır. Değer, anahtarın giriş adı olduğu ve değerin ya:

  - `entry`, `template`, `filename`, `title` ve `chunks`'ı (giriş dışında olmak üzere hepsi isteğe bağlıdır) belirten bir nesne. Bunların dışındaki diğer özellikler de `html-webpack-plugin`'e doğrudan iletilebilir ve kullanıcının söz konusu eklentiyi özelleştirmesine olanak tanır;
  - Ya da girişini belirten bir dize.

  ``` js
  module.exports = {
    pages: {
      index: {
        // sayfa için giriş
        entry: 'src/index/main.js',
        // kaynak şablon
        template: 'public/index.html',
        // dist/index.html olarak çıktı
        filename: 'index.html',
        // başlık seçeneği kullanıldığında,
        // şablon başlık etiketi <title><%= htmlWebpackPlugin.options.title %></title> olmalıdır
        title: 'Ana Sayfa',
        // bu sayfada dahil edilecek chunk'lar; varsayılan olarak
        // çıkarılan ortak chunk'lar ve satıcı chunk'ları dahil edilir.
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      // sadece giriş dizesi formatında kullanıldığında,
      // şablon `public/subpage.html` olarak varsayılır
      // ve bulunamazsa `public/index.html` geri döner.
      // Çıkış dosya adı `subpage.html` olarak varsayılır.
      subpage: 'src/subpage/main.js'
    }
  }
  ```

  ::: tip
  Çok sayfalı modda oluştururken, webpack yapılandırması farklı eklentiler içerecektir (birden fazla `html-webpack-plugin` ve `preload-webpack-plugin` örneği olacaktır). Bu eklentilerin seçeneklerini değiştirmeye çalışıyorsanız `vue inspect` komutunu kullanmayı unutmayın.
  :::

### lintOnSave

- Tür: `boolean | 'warning' | 'default' | 'error'`
- Varsayılan: `'default'`

  Geliştirme sırasında [eslint-loader](https://github.com/webpack-contrib/eslint-loader) kullanarak kaydetme sırasında lint yapılıp yapılmayacağını gösterir. Bu değer yalnızca [`@vue/cli-plugin-eslint`](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint) yüklüyse dikkate alınır.

  `true` veya `'warning'` olarak ayarlandığında, `eslint-loader` lint hatalarını uyarı olarak iletecektir. Varsayılan olarak, uyarılar yalnızca terminale kaydedilir ve derlemeyi başarısız etmez; bu nedenle bu, geliştirme için iyi bir varsayılandır.

  Tarayıcı üst örtüsünde lint hatalarının görünmesini sağlamak için `lintOnSave: 'default'` kullanabilirsiniz. Bu, `eslint-loader`'ın gerçekten hataları iletmesini zorunlu kılacaktır. Bu aynı zamanda lint hatalarının artık derlemeyi başarısız hale getireceği anlamına gelir.

  `'error'` olarak ayarlandığında, `eslint-loader`'ı uyarıları hatalar olarak gösterme zorunluluğu getirir; bu da uyarıların da üst örtüde görüneceği anlamına gelir.

  Alternatif olarak, uyarıların ve hataların her ikisini de görüntülemek için üst örtüyü yapılandırabilirsiniz:

  ``` js
  // vue.config.js
  module.exports = {
    devServer: {
      overlay: {
        warnings: true,
        errors: true
      }
    }
  }
  ```

  `lintOnSave` bir doğru değer olduğunda, `eslint-loader` hem geliştirme hem de üretimde uygulanacaktır. Üretim yapısında `eslint-loader`'ı devre dışı bırakmak istiyorsanız, aşağıdaki yapılandırmayı kullanabilirsiniz:

  ``` js
  // vue.config.js
  module.exports = {
    lintOnSave: process.env.NODE_ENV !== 'production'
  }
  ```

### runtimeCompiler

- Tür: `boolean`
- Varsayılan: `false`

  İçinde çalışma zamanı derleyicisini içeren Vue çekirdek yapısını kullanıp kullanmayacağınızı belirtir. Bu değeri `true` olarak ayarlamak, Vue bileşenlerinde `template` seçeneğini kullanmanıza izin verir, ancak uygulamanız için yaklaşık 10kb ek yük getirecektir.

  Ayrıca bkz: [Runtime + Compiler vs. Runtime only](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).

### transpileDependencies

- Tür: `boolean | Array`
- Varsayılan: `false`

  Varsayılan olarak `babel-loader`, `node_modules` içindeki tüm dosyaları yok sayar. Üçüncü taraf bağımlılıklarından beklenmeyen dönüştürülmemiş kodları önlemek için bu seçeneği etkinleştirebilirsiniz.

  Tüm bağımlılıkların dönüştürülmesi, derleme sürecini yavaşlatabilir. Eğer derleme performansı bir endişe kaynağıysa, yalnızca bazı bağımlılıkları açıkça dönüştürmek için, bu seçeneğe paket adlarını veya ad desenlerini bir dizi olarak geçirebilirsiniz.

  ::: warning
  Jest yapılandırması
  Bu seçenek `cli-unit-jest eklentisi` tarafından dikkate alınmaz, çünkü jest'te, `/node_modules` içindeki kodları dönüştürmemiz gerekmez, eğer standart dışı özellikler kullanmıyorsa - Node >8.11, en son ECMAScript özelliklerini zaten destekler.

  Ancak, jest bazen `import`/`export` söz dizimini kullanan içerikleri `node_modules`'dan dönüştürmek zorunda kalır. Bu durumda, `jest.config.js` içindeki `transformIgnorePatterns` seçeneğini kullanın.

  Daha fazla bilgi için [eklenti README'sini](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-unit-jest/README.md) inceleyin.
  :::

### productionSourceMap

- Tür: `boolean`
- Varsayılan: `true`

  Bunu `false` olarak ayarlamak, üretim için kaynak haritalarına ihtiyacınız yoksa üretim yapılarını hızlandırabilir.

### crossorigin

- Tür: `string`
- Varsayılan: `undefined`

  Üretilen HTML'deki `` ve `` etiketlerinde `crossorigin` niteliğini yapılandırın.

  Bunun yalnızca `html-webpack-plugin` tarafından enjekte edilen etiketleri etkilediğini unutmayın - kaynak şablon (public/index.html) içine doğrudan eklenen etiketlerden etkilenmez.

  Ayrıca bkz: [CORS ayarları özellikleri](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)

### integrity

- Tür: `boolean`
- Varsayılan: `false`

  Üretilen HTML'deki `` ve `` etiketlerinde [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (SRI) etkinleştirmek için `true` olarak ayarlayın. Üretilen dosyalarınızı bir CDN'de barındırıyorsanız, ek güvenlik için bunu etkinleştirmek iyi bir fikirdir.

  Bunun yalnızca `html-webpack-plugin` tarafından enjekte edilen etiketleri etkilediğini unutmayın - kaynak şablon (public/index.html) içine doğrudan eklenen etiketlerden etkilenmez.

  Ayrıca, SRI etkinleştirildiğinde, yükleme kaynak ipuçları, Chrome'daki bir [hata](https://bugs.chromium.org/p/chromium/issues/detail?id=677022) nedeniyle devre dışı bırakılır; bu, kaynakların iki kez indirilmesine neden olabilir.

### configureWebpack

- Tür: `Object | Function`

  Değer bir nesne ise, bu [webpack-merge](https://github.com/survivejs/webpack-merge) kullanılarak son yapılandırmaya birleştirilecektir.

  Değer bir işlev ise, çözümlenen yapılandırmayı argüman olarak alır. İşlev, yapıyı değiştirebilir ve hiçbir şey döndürmeyebilir veya yapılandırmanın kopyalanmış veya birleştirilmiş bir versiyonunu döndürebilir.

  Ayrıca bkz: `Webpack ile Çalışma > Basit Yapılandırma`

### chainWebpack

- Tür: `Function`

  [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) tarafından güçlendirilen `ChainableConfig` örneğini alacak bir işlev. İç yapılandırmasında daha ince ayar yapmak için olanak tanır.

  Ayrıca bkz: `Webpack ile Çalışma > Zincirleme`

### css.modules

### css.requireModuleExtension

V5'te kaldırıldı, tüm stil içe aktarımlarını CSS Modülleri olarak ele almak için `CSS ile Çalışma` bölümüne bakın.

### css.extract

- Tür: `boolean | Object`
- Varsayılan: `true` üretimde, `false` geliştirmede

  Bileşenlerinizdeki CSS'yi bağımsız bir CSS dosyasına (JavaScript'e yerleştirilmek yerine ve dinamik olarak enjekte edilmek yerine) çıkartma olup olmadığını belirtir.

  Web bileşeni olarak oluşturulurken bu her zaman devre dışıdır (stilller yerleştirilir ve shadowRoot içine enjekte edilir).

  Bir kütüphane olarak oluştururken, kullanıcıların CSS'yi kendilerinin içe aktarması zorunluluğunu ortadan kaldırmak için bunu `false` olarak ayarlayabilirsiniz.

  CSS çıkartmak, geliştirme modunda varsayılan olarak devre dışıdır; çünkü bu, CSS canlı yenileyebilmesi ile uyumsuzdur. Ancak, değeri `true` olarak açıkça ayarlayarak her durumda çıkartmayı zorlayabilirsiniz.

  `true` yerine, [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) için seçenekler nesnesi de geçilebilir; bu şekilde bu eklentinin tam olarak ne yaptığını daha ayrıntılı bir şekilde yapılandırabilirsiniz.

### css.sourceMap

- Tür: `boolean`
- Varsayılan: `false`

  CSS için kaynak haritalarının etkinleştirilip etkinleştirilmeyeceğini belirtir. Bunu `true` olarak ayarlamak, derleme performansını etkileyebilir.

### css.loaderOptions

- Tür: `Object`
- Varsayılan: `{}`

  CSS ile ilgili yükleyicilere seçenekler geçin. Örneğin:

  ``` js
  module.exports = {
    css: {
      loaderOptions: {
        css: {
          // seçenekler burada css-loader'a geçirilecektir
        },
        postcss: {
          // seçenekler burada postcss-loader'a geçirilecektir
        }
      }
    }
  }
  ```

  Desteklenen yükleyiciler:

  - [css-loader](https://github.com/webpack-contrib/css-loader)
  - [postcss-loader](https://github.com/postcss/postcss-loader)
  - [sass-loader](https://github.com/webpack-contrib/sass-loader)
  - [less-loader](https://github.com/webpack-contrib/less-loader)
  - [stylus-loader](https://github.com/shama/stylus-loader)

  `scss` sözdizimini `sass`'dan ayrı olarak hedeflemek de mümkündür; `scss` seçeneği ile.

  Ayrıca bkz: `Önişlemci Yükleyicilere Seçenekler Geçirme`

  ::: tip
  Bu, `chainWebpack` kullanarak belirli yükleyicilere el ile müdahale etmekten tercih edilmektedir; çünkü bu seçeneklerin, ilgili yükleyicinin kullanıldığı birçok yere uygulanması gerekir.
  :::

### devServer

- Tür: `Object`

  [webpack-dev-server için tüm seçenekler](https://webpack.js.org/configuration/dev-server/) desteklenmektedir. Şunları unutmayın:

  - `host`, `port` ve `https` gibi bazı değerler komut satırı bayrakları tarafından geçersiz kılınabilir.

  - `publicPath` ve `historyApiFallback` gibi bazı değerlerin değiştirilmemesi gerekir; çünkü bu, geliştirme sunucusunun düzgün çalışması için `publicPath` ile senkronize edilmesi gerekir.

### devServer.proxy

- Tür: `string | Object`

  Ön uç uygulamanız ve arka uç API sunucunuz aynı host üzerinde çalışmıyorsa, geliştirme sırasında API isteklerini API sunucusuna yönlendirmeniz gerekecektir. Bu, `vue.config.js` içindeki `devServer.proxy` seçeneği ile yapılandırılabilir.

  `devServer.proxy`, geliştirme API sunucusuna işaret eden bir dize olabilir:

  ``` js
  module.exports = {
    devServer: {
      proxy: 'http://localhost:4000'
    }
  }
  ```

  Bu, geliştirme sunucusuna, bilinmeyen istekleri (bir statik dosya ile eşleşmeyen istekler) `http://localhost:4000` adresine yönlendirmesini söyler.

  ::: warning
  `devServer.proxy` bir dize olarak ayarlandığında, yalnızca XHR istekleri yönlendirilecektir. Bir API URL'sini test etmek istiyorsanız, bunu tarayıcıda açmayın, onun yerine Postman gibi bir API aracını kullanın.
  :::

  Proxy davranışını daha iyi kontrol etmek istiyorsanız, `path: options` çiftleri ile bir nesne de kullanabilirsiniz. Tüm seçenekler için [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#proxycontext-config) belgesine danışın:

  ``` js
  module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: '<url>',
          ws: true,
          changeOrigin: true
        },
        '^/foo': {
          target: '<other_url>'
        }
      }
    }
  }
  ```

### devServer.inline

- Tür: `boolean`
- Varsayılan: `true`

  Geliştirme sunucusunun iki farklı mod arasında geçiş yapma. Daha fazla ayrıntı için [devServer.inline](https://webpack.js.org/configuration/dev-server/#devserverinline) bölümüne bakın. Şunları unutmayın:

  - `iframe modu`nu kullanmak için ek bir yapılandırmaya ihtiyaç yoktur. Sadece tarayıcıyı `http://:/webpack-dev-server/` adresine yönlendirin ve uygulamanızı hata ayıklamak için bu modda kullanın. Uygulamanızın üst kısmında mesajlarla bir bildirim çubuğu görünecektir.
  - `inline modu`nu kullanmak için yalnızca tarayıcıyı `http://:/` adresine yönlendirin. Derleme mesajları tarayıcı konsolunda görünecektir.

### parallel

- Tür: `boolean | number`
- Varsayılan: `require('os').cpus().length > 1`

  Babel veya TypeScript dönüştürme için `thread-loader` kullanıp kullanmayacağınızı belirtir. Bu, sistemin 1'den fazla CPU çekirdekine sahip olması durumunda üretim yapılandırmaları için etkinleştirilmiştir. Bir sayı geçmek, kullanılan işçi sayısını belirleyecektir.

  ::: warning
  `parallel`'ı seri olmayan yükleyici seçenekleriyle (örneğin, regex, tarih ve işlevler gibi) bir arada kullanmayın. Bu seçenekler, ilgili yükleyicilere doğru bir şekilde iletilmeyecek ve beklenmeyen hatalara yol açabilecektir.
  :::

### pwa

- Tür: `Object`

  [PWA Eklentisi](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa) için seçenekler geçin.

### pluginOptions

- Tür: `Object`

  Bu, herhangi bir şemaya doğrulama yapılmayan bir nesnedir; bu yüzden üçüncü taraf eklentilerine rastgele seçenekler geçmek için kullanılabilir. Örneğin:

  ``` js
  module.exports = {
    pluginOptions: {
      foo: {
        // eklentiler, bu seçeneklere
        // `options.pluginOptions.foo` olarak erişebilir.
      }
    }
  }
  ```

## Babel

Babel, `babel.config.js` aracılığıyla yapılandırılabilir.

::: tip
Vue CLI, Babel 7'de yeni bir yapılandırma formatı olan `babel.config.js`'yi kullanır. `.babelrc` veya `package.json` içindeki `babel` alanının aksine, bu yapılandırma dosyası dosya konumuna dayalı bir çözümleme kullanmaz ve proje kökü altındaki herhangi bir dosyaya, `node_modules` içindeki bağımlılıklar da dahil, tutarlı bir şekilde uygulanır. Vue CLI projelerinde diğer formatlar yerine her zaman `babel.config.js` kullanılması önerilir.
:::

Tüm Vue CLI uygulamaları, `babel-preset-env`, JSX desteği ve minimal paket boyutu üzerinden optimize edilmiş yapılandırmayı içeren `@vue/babel-preset-app` kullanır. Detaylar ve preset seçenekleri için [belgelerine](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app) bakın.

Ayrıca `Polyfill'ler` bölümünü inceleyin.

## ESLint

ESLint, `.eslintrc` dosyası veya `package.json` içindeki `eslintConfig` alanı aracılığıyla yapılandırılabilir.

Daha fazla ayrıntı için [@vue/cli-plugin-eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint) bölümüne bakın.

## TypeScript

TypeScript, `tsconfig.json` ile yapılandırılabilir.

Daha fazla ayrıntı için [@vue/cli-plugin-typescript](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript) bölümüne bakın.

## Birim Testi

### Jest

Daha fazla ayrıntı için [@vue/cli-plugin-unit-jest](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest) bölümüne bakın.

### Mocha (üzerinden `mocha-webpack`)

Daha fazla ayrıntı için [@vue/cli-plugin-unit-mocha](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-mocha) bölümüne bakın.

## E2E Testi

### Cypress

Daha fazla ayrıntı için [@vue/cli-plugin-e2e-cypress](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-cypress) bölümüne bakın.

### Nightwatch

Daha fazla ayrıntı için [@vue/cli-plugin-e2e-nightwatch](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-nightwatch) bölümüne bakın.

### WebdriverIO

Daha fazla ayrıntı için [@vue/cli-plugin-e2e-webdriverio](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-webdriverio) bölümüne bakın.