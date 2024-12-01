---
title: Tarayıcı Uyumluluğu
description: Bu belge, projenizin desteklediği tarayıcılar ve polyfill kullanımı hakkında önemli bilgiler sunmaktadır. Ayrıca, modern mod ile ilgili detaylar ve en iyi uygulamalar da yer almaktadır.
keywords: [tarayıcı uyumluluğu, polyfill, modern mod, Vue CLI, browserslist]
---

# Tarayıcı Uyumluluğu

## browserslist

Projenin hedeflediği tarayıcı aralığını belirten bir `browserslist` alanı göreceksiniz `package.json` dosyasında (veya ayrı bir `.browserslistrc` dosyasında). Bu değer, projede kullanılan JavaScript özelliklerinin hangi tarayıcılarda çalışması gerektiğini belirlemek için [@babel/preset-env][babel-preset-env] ve [autoprefixer][autoprefixer] tarafından otomatik olarak kullanılacaktır.

Tarayıcı aralıklarını nasıl belirteceğinizi görmek için [buraya][browserslist] bakın.

## Polyfill'ler

Varsayılan bir Vue CLI projesi, projeniz için gereken polyfill'leri belirlemek için `@babel/preset-env` ve `browserslist` ayarını kullanan [@vue/babel-preset-app][babel-preset-app] kullanır.

### useBuiltIns: 'usage'

Varsayılan olarak, [`useBuiltIns: 'usage'`](https://new.babeljs.io/docs/en/next/babel-preset-env.html#usebuiltins-usage) değerini `@babel/preset-env`'ye iletir, bu da kaynak kodunuzda kullanılan dil özelliklerine dayalı olarak gereken polyfill'leri otomatik olarak algılar. Bu, nihai paketinize yalnızca minimum miktarda polyfill eklenmesini sağlar. Ancak, bu aynı zamanda **bir bağımlılığınızın polyfill'ler konusunda özel gereksinimleri varsa, varsayılan olarak Babel bunun farkına varamaz.**

::: warning
Eğer bağımlılığınız polyfill gerektiriyorsa, birkaç seçeneğiniz var:
:::

1. **Eğer bağımlılık, hedef ortamlarınızın desteklemediği bir ES sürümünde yazılmışsa:** Bu bağımlılığı `vue.config.js` dosyasındaki `transpileDependencies` seçeneğine ekleyin. Bu, o bağımlılık için hem sözdizimi dönüşümlerini hem de kullanım tabanlı polyfill algılamayı etkinleştirir.

2. **Eğer bağımlılık ES5 kodu gönderiyor ve gerekli polyfill'leri açıkça listeliyorsa:** Gerekli polyfill'leri [polyfills](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app#polyfills) seçeneğini kullanarak `@vue/babel-preset-app`'de önceden ekleyebilirsiniz. **`es.promise`'nin varsayılan olarak dahil olduğunu unutmayın çünkü kütüphanelerin Promis'lere bağımlı olması oldukça yaygındır.**

    ``` js
    // babel.config.js
    module.exports = {
      presets: [
        ['@vue/app', {
          polyfills: [
            'es.promise',
            'es.symbol'
          ]
        }]
      ]
    }
    ```

    ::: tip
    Polyfill'leri burada listelemek yerine kaynak kodunuzda doğrudan içe aktarmanız önerilir, çünkü burada listelenen polyfill'ler, `browserslist` hedefleriniz bunlara ihtiyaç duymuyorsa otomatik olarak hariç tutulabilir.
    :::

3. **Eğer bağımlılık ES5 kodu gönderiyorsa ancak polyfill gereksinimlerini açıkça listelemiyorsa (ör. Vuetify):** `useBuiltIns: 'entry'` kullanın ve ardından giriş dosyanıza `import 'core-js/stable'; import 'regenerator-runtime/runtime';` ekleyin. Bu, `browserslist` hedeflerinize göre **TÜM** polyfill'leri içe aktaracak, böylece bağımlılık polyfill'leriniz hakkında endişelenmenize gerek kalmayacak ancak kullanılmayan bazı polyfill'lerle nihai paket boyutunuzun artmasına neden olabilir.

Daha fazla bilgi için [@babel/preset-env belgelerine](https://new.babeljs.io/docs/en/next/babel-preset-env.html#usebuiltins-usage) bakın.

### Kütüphane veya Web Bileşenleri Olarak Derleme Sırasında Polyfill'ler

Vue CLI kullanarak `bir kütüphane veya Web Bileşenleri oluşturduğunuzda`, otomatik polyfill eklemeyi devre dışı bırakmak için `@vue/babel-preset-app`'ye `useBuiltIns: false` geçmeniz önerilir. Bu, gereksiz polyfill'leri kodunuza eklememenizi sağlar çünkü polyfill'leri eklemek tüketen uygulamanın sorumluluğundadır.

## Modern Mod

Babel ile ES2015+ dilinin en yeni özelliklerinden yararlanabiliyoruz, ancak bu aynı zamanda eski tarayıcıları desteklemek için dönüştürülmüş ve polyfilled paketler göndermemiz gerektiği anlamına geliyor. Bu dönüştürülmüş paketler genellikle orijinal yerel ES2015+ kodundan daha ayrıntılıdır ve ayrıca daha yavaş analiz edilir ve çalıştırılır. 

> Günümüzde modern tarayıcıların büyük çoğunluğunun yerel ES2015 desteği sunduğu göz önüne alındığında, eski tarayıcıları desteklemek için bu tarayıcılara daha ağır ve verimsiz kod göndermenin gereksiz olduğu söylenebilir. — Vue CLI Belgeleri

Vue CLI, bu sorunu çözmenize yardımcı olmak için "Modern Mod" sunar. Üretim için aşağıdaki komut ile derleme yaparken:

```bash
vue-cli-service build --modern
```

Vue CLI, uygulamanızın iki sürümünü üretir: biri [ES modüllerini](https://jakearchibald.com/2017/es-modules-in-browsers/) destekleyen modern tarayıcıları hedef alan modern paket ve diğeri eski tarayıcıları hedef alan eski paket.

Ancak hoş olan kısım, özel dağıtım gereksinimlerinin olmamasıdır. Üretilen HTML dosyası, [Phillip Walton'ın mükemmel gönderisinde](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) tartışılan teknikleri otomatik olarak uygular:

- Modern paket, bunu destekleyen tarayıcılarda `` ile yüklenir; ayrıca `` ile önceden yüklenir.
  
- Eski paket, ES modüllerini destekleyen tarayıcılar tarafından yok sayılan `` ile yüklenir.

- Safari 10'daki `` için bir düzeltme de otomatik olarak eklenir.

Bir "Merhaba Dünya" uygulaması için modern paket zaten %16 daha küçüktür. Üretimde, modern paket genellikle çok daha hızlı analiz ve değerlendirme sonucunda uygulamanızın yüklenme performansının artmasını sağlar.

::: tip
``, [her zaman CORS etkin](https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors) olarak yüklenir. Bu, sunucunuzun `Access-Control-Allow-Origin: *` gibi geçerli CORS başlıkları döndürmesi gerektiği anlamına gelir. Eğer betikleri kimlik bilgileriyle almak istiyorsanız, `crossorigin` seçeneğini `use-credentials` olarak ayarlayın.
:::

::: tip Geçerli Modu Yapılandırmada Tespit Etmek
Bazen yalnızca eski derleme için veya yalnızca modern derleme için webpack yapılandırmasını değiştirmeniz gerekebilir.

Vue CLI, bunu iletmek için iki ortam değişkeni kullanır:

* `VUE_CLI_MODERN_MODE`: Derleme `--modern` bayrağı ile başlatıldı
* `VUE_CLI_MODERN_BUILD`: doğruysa, mevcut yapılandırma modern derleme içindir. Aksi takdirde, eski derleme içindir.

**Önemli:** Bu değişkenler yalnızca `chainWebpack()` ve `configureWebpack()` fonksiyonları değerlendirildikten sonra erişilebilir. (Yani doğrudan `vue.config.js` modülünün kök alanında değildir.) Bu, aynı zamanda postcss yapılandırma dosyasında da mevcut olduğu anlamına gelir.
:::

::: warning Dikkat: Webpack eklentilerini Ayarlama
Bazı eklentiler, örneğin `html-webpack-plugin`, `preload-plugin` vb. yalnızca modern mod için yapılandırmaya dahil edilmiştir. Eski yapılandırmada bu eklentilerin seçeneklerine erişmeye çalışmak, eklentilerin mevcut olmaması nedeniyle hata almanıza neden olabilir.

Yukarıdaki *Geçerli Modu Tespit Etme* hakkında olan ipucunu kullanarak yalnızca doğru modda eklentileri manipüle edin ve/veya eklentinin mevcut modun yapılandırmasında gerçekten var olup olmadığını kontrol edin, ardından seçeneklerine erişmeye çalışın.
:::

[autoprefixer]: https://github.com/postcss/autoprefixer
[babel-preset-env]: https://new.babeljs.io/docs/en/next/babel-preset-env.html
[babel-preset-app]: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app
[browserslist]: https://github.com/ai/browserslist