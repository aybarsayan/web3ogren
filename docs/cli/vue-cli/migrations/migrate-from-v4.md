---
title: v4'ten Taşınma
description: Bu belge, Vue CLI'nin en son sürümüne geçiş yaparken dikkate almanız gereken önemli değişiklikleri ve talimatları içermektedir. Aşağıda, geçişin nasıl yapılacağına dair rehberlik ve karşılaşabileceğiniz yaygın hatalar hakkında bilgiler sunulmaktadır.
keywords: [Vue CLI, geçiş, güncelleme, Webpack 5, CSS Modülleri, TypeScript, PWA]
---

# v4'ten Taşınma

Öncelikle, en son Vue CLI'yi global olarak yükleyin:

```bash
npm install -g @vue/cli
# VEYA
yarn global add @vue/cli
```

## Tüm Eklentileri Aynı Anda Yükseltme

Mevcut projelerinizde şunu çalıştırın:

```bash
vue upgrade
```

Ve ardından komut satırı talimatlarını takip edin.

Göç edici henüz tamamlanmamıştır ve tüm durumları kapsamamaktadır. Lütfen her pakette tanıtılan detaylı kırılma değişiklikleri için aşağıdaki bölümü okuyun.

::: tip Not
Eğer yükseltmeden sonra `setup compilation vue-loader-plugin(node:44156) UnhandledPromiseRejectionWarning: TypeError: The 'compilation' argument must be an instance of Compilation` gibi hatalar görüyorsanız, lütfen proje içindeki lockfile'ı (`yarn.lock` veya `package-lock.json`) ve `node_modules` klasörünü kaldırın ve tüm bağımlılıkları yeniden yükleyin.
:::

------

## Birer Birer Manuel Geçiş

Eğer manuel ve kademeli olarak geçmek istiyorsanız, belirli bir Vue CLI eklentisini yükseltmek için `vue upgrade ` komutunu çalıştırabilirsiniz.

------

## Kırılma Değişiklikleri

### Tüm Paketler İçin

* **Node.js 8-11 ve 13 desteği kaldırıldı**
* **NPM 5 desteği kaldırıldı**

### `vue` Komutu (Global `@vue/cli` Paketi)

[Anlık prototip oluşturma işlevleri](https://v4.cli.vuejs.org/guide/prototyping.html) kaldırılmıştır. Artık `vue serve` / `vue build` komutları, proje `package.json`'ında belirtilen komut dosyalarını yürütmek için `npm run serve` / `npm run build` komutlarının takma adı olmuştur.

> Bağımsız `.vue` bileşenleri geliştirmek için **minimum bir kurulum gerektiğinde**, lütfen  veya  kullanın.

### `@vue/cli-service`

#### Webpack 5

Altyapıdaki webpack sürümünü 5'e yükselttik. Altında birçok kırılma değişikliği bulunmaktadır; bunlar, sürüm duyurusu sayfasında listelenmiştir [Webpack 5 sürümü (2020-10-10)](https://webpack.js.org/blog/2020-10-10-webpack-5-release/).

Sadece özel yapılandırmalar için dikkat çeken içsel değişikliklerin dışında, kullanıcı kodu için de birkaç dikkate değer değişiklik bulunmaktadır:

1. **JSON modüllerinden adlandırılmış ihracatlar artık desteklenmemektedir.** Bunun yerine `import { version } from './package.json'; console.log(version);` yerine `import package from './package.json'; console.log(package.version);` kullanın.
2. **Webpack 5, varsayılan olarak Node.js modülleri için polyfill'leri artık dahil etmemektedir.** Eğer kodunuz bu modüllerden herhangi birine dayanıyorsa, bilgilendirici bir hata mesajı göreceksiniz. Daha önceden polyfill'lenmiş modüllerin detaylı listesi de [burada](https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065) mevcuttur.

#### Geliştirici Sunucusu

`webpack-dev-server`, v3'ten v4'e güncellenmiştir. Bu nedenle `devServer` seçeneği ile ilgili kırılma değişiklikleri vardır. Daha fazla bilgi için [`webpack-dev-server` geçiş kılavuzuna](https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md) göz atın.

::: info Dikkat Edilmesi Gerekenler
En dikkat çekici olanlar:
* `disableHostCheck` seçeneği, `allowedHosts: 'all'` lehine kaldırıldı;
* `public`, `sockHost`, `sockPath`, ve `sockPort` seçenekleri, `client.webSocketURL` seçeneği lehine kaldırıldı.
* Geliştirici sunucusunun IE9 desteği varsayılan olarak etkin değildir. Eğer IE9 altında geliştirme yapmanız gerekiyorsa, lütfen `devServer.webSocketServer` seçeneğini `sockjs` olarak manuel olarak ayarlayın.
:::

#### `build` Komutu ve Modern Mod

v5.0.0-beta.0 ile birlikte `vue-cli-service build` çalıştırıldığında **tarayıcı listesi yapılandırmalarınıza** dayalı olarak otomatik olarak farklı paketler oluşturulacaktır. `--modern` bayrağı artık gereksizdir çünkü varsayılan olarak etkinleştirilmiştir.

Varsayılan kurulumla basit bir tek sayfalık uygulama oluşturduğumuzu farz edelim; işte bazı olası senaryolar:

* Vue 2 projelerinin varsayılan tarayıcı listesi hedefi (`> 1%, son 2 versiyon, ölü değil`), `vue-cli-service build` iki tür paket üretecektir:
  * **`` destekleyen modern hedef tarayıcılar için biri** (`app.[contenthash].js` ve `chunk-vendors.[contenthash].js`). Paket boyutu çok daha küçük olacaktır çünkü bu, eski tarayıcılar için polyfill ve dönüşümleri atar.
  * **Desteklemeyenler için biri** (`app-legacy.[contenthash].js` ve `chunk-vendors-legacy.[contenthash].js`) olup, `` ile yüklenecektir.
* Bu davranıştan vazgeçmek için `--no-module` bayrağını build komutuna ekleyebilirsiniz. `vue-cli-service build --no-module` yalnızca tüm hedef tarayıcıları destekleyen eski paketleri (sade `` ile yüklenecek) üretecektir.
* Vue 3 projelerinin varsayılan tarayıcı listesi hedefi (`> 1%, son 2 versiyon, ölü değil, ie 11 değil`), tüm hedef tarayıcılar `` desteklediğinden, bunları ayırmanın (ve veya yapmanın) bir anlamı yoktur; bu nedenle `vue-cli-service build` yalnızca bir tür paket üretecektir: `app.[contenthash].js` ve `chunk-vendors.[contenthash].js` (sade `` ile yüklenecek).

#### CSS Modülleri

`css.requireModuleExtension` seçeneği kaldırıldı. CSS Modül dosya adlarında `.module` kısmını çıkarmak gerekiyorsa, lütfen `CSS ile Çalışma > CSS Modülleri` bölümüne göz atın.

`css-loader`, v3'ten v6'ya yükseltildi; birkaç CSS Modülü ile ilgili seçenek yeniden adlandırıldı ve diğer değişiklikler yapıldı. Ek detaylar için [tam değişiklik günlüğüne](https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md) bakabilirsiniz.

#### Sass/SCSS

`node-sass` ile proje oluşturmayı desteklemiyor. Bir süredir [deprecate] edilmiştir (https://sass-lang.com/blog/libsass-is-deprecated#how-do-i-migrate). Lütfen bunun yerine `sass` paketini kullanın.

#### Varlık Modülleri

`url-loader` ve `file-loader`, [Asset Modülleri](https://webpack.js.org/guides/asset-modules/) lehine kaldırıldı. Eğer satır içi görüntü varlıklarının boyut sınırını ayarlamak istiyorsanız, artık [`Rule.parser.dataUrlCondition.maxSize`](https://webpack.js.org/configuration/module/#ruleparserdataurlcondition) seçeneğini ayarlamanız gerekmektedir:

``` js
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

#### Altyapı Yükleyicileri ve Eklentileri

* `html-webpack-plugin`, v3'ten v5'e güncellendi. Daha fazla detay [html-webpack-plugin v4](https://dev.to/jantimon/html-webpack-plugin-4-has-been-released-125d) duyurusunda ve [tam değişiklik günlüğünde](https://github.com/jantimon/html-webpack-plugin/blob/master/CHANGELOG.md) mevcuttur.
* `sass-loader` v7 desteği kaldırıldı. v8 kırılma değişikliklerini [değişiklik günlüğünde](https://github.com/webpack-contrib/sass-loader/blob/master/CHANGELOG.md#800-2019-08-29) görebilirsiniz.
* `postcss-loader`, v3'ten v5'e güncellendi. En dikkat çekici olanı, `PostCSS` seçeneklerinin (`plugin` / `syntax` / `parser` / `stringifier`) `postcssOptions` alanına taşınmış olmasıdır. Daha fazla detay [değişiklik günlüğünde](https://github.com/webpack-contrib/postcss-loader/blob/master/CHANGELOG.md#400-2020-09-07) yer almaktadır.
* `copy-webpack-plugin`, v5'ten v8'e güncellendi. Eğer `config.plugin('copy')` aracılığıyla yapılandırmasını hiç özelleştirmediyseniz, kullanıcıya yönelik bir kırılma değişikliği olmamalıdır. Tüm kırılmalar [`copy-webpack-plugin` v6.0.0 değişiklik günlüğünde](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/CHANGELOG.md) bulunmaktadır.
* `terser-webpack-plugin`, v2'den v5'e güncellendi; terser 5 kullanıyor ve seçenek formatında bazı değişiklikler oldu. Tam detaylar [değişiklik günlüğünde](https://github.com/webpack-contrib/terser-webpack-plugin/blob/master/CHANGELOG.md) bulunmaktadır.
* Yeni projeler oluştururken, varsayılan `less-loader` [v5'ten v8'e](https://github.com/webpack-contrib/less-loader/blob/master/CHANGELOG.md); `less`, [v3'ten v4'e](https://github.com/less/less.js/pull/3573); `sass-loader`, [v8'den v11'e](https://github.com/webpack-contrib/sass-loader/blob/master/CHANGELOG.md); `stylus-loader`, [v3'ten v5'e](https://github.com/webpack-contrib/stylus-loader/blob/master/CHANGELOG.md) güncellenmiştir.
* `mini-css-extract-plugin`, [v1'den v2'ye](https://github.com/webpack-contrib/mini-css-extract-plugin/blob/master/CHANGELOG.md) güncellenmiştir.
* `cache-loader` kaldırıldı. Eğer bunu kullanmak istiyorsanız, lütfen manuel olarak yükleyin.

### Babel Eklentisi

`transpileDependencies` seçeneği` artık bir boolean değeri kabul etmektedir. `true` olarak ayarlamak, `node_modules` içindeki tüm bağımlılıkları dönüştürecektir.

### ESLint Eklentisi

* `eslint-loader`, [eslint-webpack-plugin](https://github.com/webpack-contrib/eslint-webpack-plugin) ile değiştirildi, ESLint  adresine bakın.

### PWA Eklentisi

* Altyapı `workbox-webpack-plugin`, v4'ten v6'ya güncellendi. Detaylı geçiş kılavuzları workbox'ın web sitesinde mevcuttur:
  * [Workbox v4'ten v5'e](https://developers.google.com/web/tools/workbox/guides/migrations/migrate-from-v4)
  * [Workbox v5'ten v6'ya](https://developers.google.com/web/tools/workbox/guides/migrations/migrate-from-v5)

### TypeScript Eklentisi

* **TSLint desteği kaldırıldı.** [TSLint deprecated edildi](https://github.com/palantir/tslint/issues/4534), bu sürümde tüm TSLint ile ilgili kodu [kaldırdık](https://github.com/vuejs/vue-cli/pull/5065). Lütfen ESLint'e geçiş yapmayı düşünün. %100 otomatik bir geçiş deneyimi için [`tslint-to-eslint-config`](https://github.com/typescript-eslint/tslint-to-eslint-config) paketine göz atabilirsiniz.
* `ts-loader`, v6'dan v9'a yükseltildi. Artık yalnızca TypeScript >= 3.6'yı desteklemaktadır.
* `fork-ts-checker-webpack-plugin`, v3.x'den v6.x'ye yükseltildi; detaylı kırılma değişikliklerini sürüm notlarında görebilirsiniz:
  * [v4.0.0](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/releases/tag/v4.0.0)
  * [v5.0.0](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/releases/tag/v5.0.0)
  * [v6.0.0](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/releases/tag/v6.0.0)

### E2E-Cypress Eklentisi

* Cypress, bir eş bağımlılık olarak gereklidir.
* Cypress, v3'ten v8'e güncellenmiştir. Geçiş sürecinin detaylı talimatları için [Cypress Geçiş Kılavuzunu](https://docs.cypress.io/guides/references/migration-guide.html) inceleyin.

### E2E-WebDriverIO Eklentisi

* WebDriverIO, v6'dan v7'ye güncellenmiştir. Kullanıcıya yönelik çok fazla kırılma değişikliği yoktur. Daha fazla detay için [yayınla ilgili blog yazısına](https://webdriver.io/blog/2021/02/09/webdriverio-v7-released) bakın.

### E2E-Nightwatch Eklentisi

* Nightwatch, v1'den v2'ye güncellenmiştir. Daha fazla detay için [blog yazısına](https://nightwatchjs.org/guide/getting-started/whats-new-v2.html) göz atın. Ayrıca bir [geçiş kılavuzu](https://github.com/nightwatchjs/nightwatch/wiki/Migrating-to-Nightwatch-2.0) da mevcuttur.

### Unit-Jest Eklentisi

* Vue 2 projeleri için, `@vue/vue2-jest` artık bir eş bağımlılık olarak gereklidir, lütfen `@vue/vue2-jest`'i proje için dev bağımlılık olarak yükleyin.
* TypeScript projeleri için, `ts-jest` artık bir eş bağımlılık olarak gereklidir. Kullanıcılar `ts-jest@27`'yi manuel olarak proje köküne yüklemelidir.
* Altyapı `jest` ile ilgili paketler v24'ten v27'ye yükseltildi. Çoğu kullanıcı için geçiş sorunsuz olacaktır. Daha fazla detay için ilgili değişiklik güncellemelerine bakabilirsiniz:
  * [jest, babel-jest](https://github.com/facebook/jest/blob/v27.1.0/CHANGELOG.md)
  * [ts-jest](https://github.com/kulshekhar/ts-jest/blob/v27.0.0/CHANGELOG.md)

### Unit-Mocha Eklentisi

* `mocha`, v6'dan v8'e güncellendi; lütfen [mocha v7](https://github.com/mochajs/mocha/releases/tag/v7.0.0) ve [mocha v8](https://github.com/mochajs/mocha/releases/tag/v8.0.0) sürüm notlarına bakarak kırılma değişikliklerinin tam listesini inceleyin.
* `jsdom`, v15'ten v18'e yükseltildi; kullanıcıya yönelik kırılma değişiklikleri [`jsdom` v16.0.0 sürüm notlarında](https://github.com/jsdom/jsdom/releases/tag/16.0.0) ve [v18.0.0 sürüm notlarında](https://github.com/jsdom/jsdom/releases/tag/18.0.0) listelenmiştir.

### Dahili Paketler

#### `@vue/cli-shared-utils`

* [chalk](https://github.com/chalk/chalk) v2'den v4'e yükseltildi
* [joi](https://github.com/sideway/joi) v15 (artık `@hapi/joi` olarak biliniyor) v17'ye yükseltildi