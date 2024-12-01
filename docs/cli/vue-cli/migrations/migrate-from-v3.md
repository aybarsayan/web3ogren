---
description: Vue CLI v3'ten v4'e geçiş yaparken dikkat edilmesi gereken önemli değişiklikleri ve ipuçlarını keşfedin. Özellikle yeni komutlar, yapılandırmalar ve eklenti dönüşümleri hakkında bilgi edinin.
keywords: [Vue CLI, geçiş, eklenti, sürüm, güncelleme]
---

# v3'ten Geçiş

Öncelikle, en son Vue CLI'yi genel olarak yükleyin:

```bash
npm install -g @vue/cli
# VEYA
yarn global add @vue/cli
```

## Tüm Eklentileri Tek Seferde Güncelle

Mevcut projelerinizde çalıştırın:

```bash
vue upgrade
```

Sonrasında, her pakette tanıtılan ayrıntılı kırılma değişiklikleri için aşağıdaki bölüme bakın.

------

## Tek Tek Manuel Geçiş

Eğer manuel ve kademeli olarak geçmek istiyorsanız, işte bazı ipuçları:

### Küresel `@vue/cli`

#### [Yeniden Tasarlandı](https://github.com/vuejs/vue-cli/pull/4090) `vue upgrade`

- Önceden: `vue upgrade [patch | minor | major]`, sadece Vue CLI eklentilerinin en son sürümlerini yüklemekten başka bir şey yapmıyordu.
- Sonrasında: `vue upgrade [plugin-name]`. Eklentileri güncellemenin yanı sıra, geçiş sürecini otomatikleştirmenize yardımcı olmak için eklentilerden taşıyıcıları çalıştırabilir. Bu komut için daha fazla seçenek görmek için `vue upgrade --help` komutunu çalıştırın.

#### `vue --version` Çıkış Formatı Değişikliği

`vue --version` çalıştırıldığında:

- 3.x: `3.12.0` çıktısını verir
- 4.x: `@vue/cli 4.0.0` çıktısını verir

#### Üzerine Yazmayı Önlemek için Ek Bir Onay Adımı

`vue invoke` / `vue add` / `vue upgrade` çalıştırdığınızda, mevcut depoda onaylanmamış değişiklikleriniz varsa artık bir [ek onay adımı](https://github.com/vuejs/vue-cli/pull/4275) bulunmaktadır.

![image](https://user-images.githubusercontent.com/3277634/65588457-23db5a80-dfba-11e9-9899-9dd72efc111e.png)

#### Vue Router ve Vuex Artık Karşılık Gelen CLI Eklentilerine Sahip

`vue add vuex` veya `vue add router` çalıştırdığınızda:

- v3'te yalnızca `vuex` veya `vue-router` projeye eklenecek;
- v4'te ayrıca `@vue/cli-plugin-vuex` veya `@vue/cli-plugin-router` kurulacaktır.

Bu şu anda son kullanıcılar için gerçek bir değişiklik yaratmıyor, ancak bu tasarım Vuex ve Vue Router kullanıcıları için daha fazla özellik eklememize olanak tanıyor.

**Ön ayar ve eklenti yazarları için**, iki eklentide birkaç dikkate değer değişiklik bulunmaktadır:

- Varsayılan dizin yapısı değiştirildi:
  - `src/store.js` artık `src/store/index.js` olarak taşındı;
  - `src/router.js` `src/router/index.js` olarak yeniden adlandırıldı;
  
- `preset.json` içindeki `router` ve `routerHistoryMode` seçenekleri, uyumluluk nedenleriyle hala desteklenmektedir. Ancak, daha iyi bir tutarlılık için `plugins: { '@vue/cli-plugin-router': { historyMode: true } }` kullanılması önerilmektedir.
  
- `api.hasPlugin('vue-router')` artık desteklenmiyor. Şu anda `api.hasPlugin('router')` olarak güncellendi.

---

### `@vue/cli-service`

#### Şablon bloğundaki Boşluk Yönetimi

Daha küçük bir paket elde etmek için, Vue CLI v3'te varsayılan olarak `vue-template-compiler`'ın `preserveWhitespace` seçeneğini devre dışı bıraktık.

Bu durum bazı dezavantajlarla birlikte geliyor.

Neyse ki, Vue 2.6 sürümünden itibaren, boşluk yönetimi üzerinde daha hassas kontrol elde edebiliriz, [yeni `whitespace` seçeneği](https://github.com/vuejs/vue/issues/9208#issuecomment-450012518) ile. Bu nedenle, Vue CLI v4'te varsayılan olarak bu yeni seçeneği kullanmaya karar verdik.

Aşağıdaki şablonu örnek olarak alın:

```html
<p>
  Vue.js <b>dünyasına</b> <i>hoş geldiniz</i>.
  Eğlenin!
</p>
```

`preserveWhitespace: false` ile, etiketler arasındaki tüm boşluklar kaldırılarak derlenmiştir:

```html
<p> Vue.js <b>dünyasına</b><i>hoş geldiniz</i>. Eğlenin! </p>
```

`whitespace: 'condense'` ile, şimdi şöyle derleniyor:

```html
<p> Vue.js <b>dünyasına</b> <i>hoş geldiniz</i>. Eğlenin! </p>
```

Etiketler arasındaki **satır içi** boşluğun artık korunduğuna dikkat edin.

#### `vue-cli-service build --mode development`

Geçmişte, `development` modunda `build` komutunu çalıştırdığınızda, `dist` klasörü yapısı `production` modundan farklı oluyordu. Şimdi, aşağıdaki iki değişiklikle birlikte, tüm modlar arasındaki dizin yapıları aynı olacak (dosya adları hala farklı - `development` modunda hash yok):

- [#4323](https://github.com/vuejs/vue-cli/pull/4323) tüm modlar için tutarlı dizin yapısını sağlamak
- [#4302](https://github.com/vuejs/vue-cli/pull/4302) geliştirici yapılandırmalarını belirleme komutuna taşıma

#### SASS/SCSS Kullanıcıları İçin

Daha önce Vue CLI v3'te varsayılan olarak `sass-loader@7` ile geldik.

Son zamanlarda `sass-loader@8` çıktı ve yapılandırma formatını oldukça değiştirdi. İşte sürüm notları: 

`@vue/cli-service` v4'te `sass-loader@7` desteğine devam edecektir, ancak v8 sürümüne göz atmanızı ve en son sürüme yükseltmenizi şiddetle öneririz.

::: warning Dikkat
`less-loader` v4, `less` >= v3.10 ile uyumsuzdur; projeniz bunun bağımlısıysa, `less-loader@5`'e geçmeniz önerilir. 
:::

#### CSS Modül Kullanıcıları İçin

- [css.modules'ı `css.requireModuleExtension` lehine kullanımdan kaldır](https://github.com/vuejs/vue-cli/pull/4387). Bunun nedeni, `css-loader` v3'e yükseldiğimiz ve yapılandırma formatının değişmesidir. Daha ayrıntılı bir açıklama için lütfen bağlantıyı takip edin.

#### `vue.config.js` Seçenekleri

Artık kullanım dışı olan [`baseUrl` seçeneği](https://cli.vuejs.org/config/#baseurl) [kaldırıldı](https://github.com/vuejs/vue-cli/pull/4388)

#### `chainWebpack` / `configureWebpack`

##### `chainWebpack` içindeki `minimizer` Yöntemi

İç kuralları `chainWebpack` ile özelleştirdiyseniz, lütfen `webpack-chain`'in v4'ten v6'ya güncellendiğini unutmayın, en dikkat çekici değişiklik `minimizer` konfigürasyonudur.

Örneğin, terser eklentisinde `drop_console` seçeneğini etkinleştirmek istiyorsanız. v3'te bunu `chainWebpack` içinde yapabilirsiniz:

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  chainWebpack: (config) => {
    config.optimization.minimizer([
      new TerserPlugin({ terserOptions: { compress: { drop_console: true } } })
    ])
  }
}
```

v4'te, şu şekilde değişmiştir:

```js
module.exports = {
  chainWebpack: (config) => {
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  }
}
```

##### Diğer Değişiklikler

- [`pug-plain` kuralı `pug-plain-loader` olarak yeniden adlandırıldı](https://github.com/vuejs/vue-cli/pull/4230)

#### Temel Yükleyiciler / Eklentiler

Bu nadiren, kullanıcıları etkileme ihtimali vardır, ancak `chainWebpack` / `configureWebpack` aracılığıyla seçenekleri özelleştirdiyseniz.

`css-loader` v1'den v3'e yükseltildi:

- [v2 değişiklik günlüğü](https://github.com/webpack-contrib/css-loader/releases/tag/v2.0.0)
- [v3 değişiklik günlüğü](https://github.com/webpack-contrib/css-loader/releases/tag/v3.0.0)

Diğer birkaç temel webpack yükleyicisi ve eklentisi de çoğu önemsiz değişikliklerle güncellendi:

- `url-loader` [v1'den v2'ye](https://github.com/webpack-contrib/url-loader/releases/tag/v2.0.0)
- `file-loader` [v3'ten v4'e](https://github.com/webpack-contrib/file-loader/releases/tag/v4.0.0)
- `copy-webpack-plugin` [v4'ten v5'e](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/CHANGELOG.md#500-2019-02-20)
- `terser-webpack-plugin` [v1'den v2'ye](https://github.com/vuejs/vue-cli/pull/4676)

### `@vue/cli-plugin-babel`, `@vue/babel-preset-app`

#### core-js

Babel eklentisi, dönüştürülen kodda kullanılan polyfill'ler için bir eş bağımlılık gerektirir.

Vue CLI v3'te, gereken `core-js` sürümü 2.x'ti, şu anda 3.x'e yükseltildi.

Bu geçiş, `vue upgrade babel` ile yükseltildiğinde otomatik olarak gerçekleştirilir. Ancak, özel polyfill'ler tanıttıysanız, polyfill adlarını manuel olarak güncellemeniz gerekebilir (Daha fazla ayrıntı için lütfen [core-js değişiklik günlüğüne](https://github.com/zloirock/core-js/blob/master/CHANGELOG.md#L279-L297) bakın).

#### Babel Preset

Bu geçiş de `vue upgrade babel` ile yükseltildiğinde otomatik olarak gerçekleştirilir.

- v3'te, varsayılan babel preset'i `babel.config.js` içinde `@vue/app`'dı.
- v4'te, bunu eklentiye taşıdık, bu nedenle şimdi `@vue/cli-plugin-babel/preset` olarak adlandırılıyor.

Bunun nedeni, `@vue/babel-preset-app`'nin aslında projede dolaylı bir bağımlılık olmasıdır. Bu, npm'in paket yığınlama mekanizması sayesinde çalışır. Ancak, projede aynı paketin birden fazla çelişkili dolaylı bağımlılığı varsa veya paket yöneticisi bağımlılık çözümüne daha katı sınırlamalar getirirse (örneğin, yarn plug'n'play veya pnpm), potansiyel sorunlar hala ortaya çıkabilir. Bu nedenle, artık doğrudan projeye bağımlılığı (`@vue/cli-plugin-babel`) taşıdık ve bu, daha standart uyumlu ve daha az hata eğilimli olmasını sağlıyor.

------

### `@vue/cli-plugin-eslint`

Bu eklenti artık [ESLint'i eş bağımlılık olarak gerektiriyor](https://github.com/vuejs/vue-cli/pull/3852).

Bu, Vue CLI 3.1 veya daha sonraki sürümlerle oluşturulan projeleri etkilemeyecektir.

Projeleriniz Vue CLI 3.0.x veya daha önce oluşturduysa, projeniz bağımlılıklarına `eslint@4` eklemeniz gerekebilir (Bu, `vue upgrade eslint` kullanarak eklentiyi yükselttiğinizde otomatik olarak gerçekleştirilir).

Ayrıca, ESLint'inizi v5'e yükseltmeniz ve ESLint yapılandırma sürümlerini en son sürüme güncellemeniz önerilir. (ESLint v6 desteği hala yolda)

------

#### Prettier Preset

Eski prettier preset uygulamamız hatalıydı. Vue CLI v3.10'dan bu yana varsayılan şablonu güncelledik.

Artık `eslint`, `eslint-plugin-prettier` ve `prettier`'ı eş bağımlılık olarak gerektiriyor, bu da [ESLint ekosistemindeki standart uygulamaya](https://github.com/eslint/eslint/issues/3458) uygun olarak yapılmıştır.

Daha eski projelerde, `Cannot find module: eslint-plugin-prettier` gibi sorunlarla karşılaştıysanız, bunu düzeltmek için aşağıdaki komutu çalıştırın:

```bash
npm install --save-dev eslint@5 @vue/eslint-config-prettier@5 eslint-plugin-prettier prettier
```

------

#### `lintOnSave` Seçenekleri

(aşağıdakiler yalnızca geliştirmeyi etkiler)

`lintOnSave` seçeneğinin varsayılan değeri (belirtilmemişse) [`true`'dan `'default'` olarak değiştirildi](https://github.com/vuejs/vue-cli/pull/3975). Ayrıntılı açıklamayı [belge](https://cli.vuejs.org/config/#lintonsave)'de okuyabilirsiniz.

Kısacası:

- v3'te, varsayılan olarak, lint uyarıları, hatalarla birlikte, hata üstünde görüntülenecektir.
- v4'te, varsayılan olarak, yalnızca lint hataları geliştirme sürecinizi kesintiye uğratacaktır. Uyarılar yalnızca terminal konsolunda kaydedilecektir.

### `@vue/cli-plugin-pwa`

Altyapı işbox-webpack-plugin, v3'ten v4'e yükseltildi. [Sürüm notlarını burada](https://github.com/GoogleChrome/workbox/releases/tag/v4.0.0) görebilirsiniz.

Ayrıca bir `pwa.manifestOptions` alanı mevcuttur (bunu `vue.config.js` içinde ayarlayabilirsiniz). Bu yeni seçenek ile, `manifest.json` yapılandırma nesnesinden oluşturulacaktır, doğrudan `public` klasöründen değil. Bu, PWA yapılandırmalarınızı yönetmek için daha tutarlı bir arayüz sağlar. (Not: Bu, isteğe bağlı bir özelliktir. İlgili PR'ler: [#2981](https://github.com/vuejs/vue-cli/pull/2981), [#4664](https://github.com/vuejs/vue-cli/pull/4664))

### `@vue/cli-plugin-e2e-cypress`

Vue CLI v3.0.0-beta.10'dan önce, E2E testleri için varsayılan komut `vue-cli-service e2e` idi. Daha sonra bunu `vue-cli-service test:e2e` olarak değiştirdik. Önceki komut kullanımdan kaldırılmış ancak hala desteklenmiştir. Artık bu eski komutun desteğini tamamen [kaldırdık](https://github.com/vuejs/vue-cli/pull/3774).

### `@vue/cli-plugin-e2e-nightwatch`

Nightwatch.js, 0.9'dan 1.x'e güncellendi. Lütfen önce [Nightwatch geçiş kılavuzlarını](https://github.com/nightwatchjs/nightwatch/wiki/Migrating-to-Nightwatch-1.0) okuyun.

Paketlenmiş yapılandırma ve üretilen testler [tamamen elden geçirilmiştir](https://github.com/vuejs/vue-cli/pull/4541). Daha fazla ayrıntı için lütfen bağlantıyı takip edin. Vue CLI v3'teki çoğu kullanım durumu hala desteklenmektedir. Bunlar sadece yeni özelliklerdir.

ChromeDriver, sürüm 73'ten itibaren sürüm stratejisini değiştirdiğinden, bunu projede bir eş bağımlılık haline getirdik. Eklentide basit bir tarayıcı sürümü kontrolü gerçekleştirilir, bu nedenle uyumsuz bir Chrome sürümüne geçiş yaptıysanız, ihtiyacınız olan ChromeDriver sürümünü yükseltmek için bir uyarı alacaksınız.

------

Cypress eklentisinde olduğu gibi, eski `vue-cli-service e2e` komutunun desteği de kaldırılmıştır.

### `@vue/cli-plugin-typescript`

Uzantı olmadan bir dosya içe aktardığınızda, webpack çözüm seçenekleri artık [`.ts(x)` dosyalarını `.js(x)` ve `.vue` dosyalarına göre tercih etmektedir](https://github.com/vuejs/vue-cli/pull/3909). `.vue` dosyalarını içe aktarırken her zaman dosya uzantısını dahil etmenizi şiddetle öneririz.

### `@vue/cli-plugin-unit-jest`

Paketlenmiş Jest'i v23'ten v24'e yükselttik, bu nedenle lütfen önce [sürüm notlarını](https://jestjs.io/blog/2019/01/25/jest-24-refreshing-polished-typescript-friendly) okuyun. Tam değişiklik günlüğü için [bu bağlantıya](https://github.com/facebook/jest/blob/20ba4be9499d50ed0c9231b86d4a64ec8a6bd303/CHANGELOG.md#user-content-2400) bakın.

`unit-jest` eklentisi artık 4 yapılandırma preset'i ile birlikte gelir:

- `@vue/cli-plugin-unit-jest` En yaygın proje türleri için varsayılan preset
- `@vue/cli-plugin-unit-jest/presets/no-babel` Eğer `@vue/cli-plugin-babel` kurulu değilse ve projede babel dosyalarını görmek istemiyorsanız
- `@vue/cli-plugin-unit-jest/presets/typescript` TypeScript desteği ile preset (ama TSX desteği yok)
- `@vue/cli-plugin-unit-jest/presets/typescript-and-babel` TypeScript (ve TSX) ve babel desteği ile preset.

Varsayılan Jest yapılandırmalarını (ya `jest.config.js` içinde ya da `package.json` içindeki `jest` alanında) proje oluşturulmasından bu yana değiştirmediyseniz, artık büyük yapılandırma nesnesini tek bir alanla değiştirebilirsiniz:

```js
module.exports = {
  // Aşağıdaki preset adını yukarıdaki listeden kullanmak istediğiniz biriyle değiştirin
  preset: '@vue/cli-plugin-unit-jest'
}
```

(`ts-jest`, `babel-jest` bağımlılıkları, yapılandırmayı preset'leri kullanacak şekilde geçirdiğinizde kaldırılabilir)

::: tip Hatırlatma
Yeni presetlerde varsayılan test ortamı jsdom@15'tir; bu varsayılan olarak Jest 24'teki jsdom@11'den farklıdır. Bu, yaklaşan Jest 25 güncellemeleri ile uyumlu hale getirilmiştir. Çoğu kullanıcı bu değişiklikten etkilenmeyecektir. jsdom ile ilgili ayrıntılı bir değişiklik günlüğü için bkz. 
:::

### `@vue/cli-plugin-unit-mocha`

- mocha-webpack yerine mochapack kullanın, değişiklik günlüğüne bakın . Bu değişiklik, gerçek kullanım üzerinde etkili olmaması beklenmektedir.
- mocha 6'ya yükseltildi, daha fazla ayrıntı için [Mocha'nın değişiklik günlüğüne](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#600-0--2019-01-01) bakın.

### `@vue/cli-service-global`

`@vue/cli-service` ve `@vue/cli-plugin-eslint` paketlerindeki kırılma değişikliklerine bakın.