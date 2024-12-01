---
description: Vue CLI için ESLint eklentisi ile projelerde kod kalitesini artırabilirsiniz. Olası hata ve uyarıları projeniz derlenmeden önce kontrol etme imkanı sunar.
keywords: [Vue CLI, ESLint, lint, yapılandırma, hata kontrol, uyarılar, geliştirici araçları]
---

# @vue/cli-plugin-eslint

> vue-cli için eslint eklentisi

## Enjekte Edilmiş Komutlar

- **`vue-cli-service lint`**

  ```
  Kullanım: vue-cli-service lint [seçenekler] [...dosyalar]

  Seçenekler:

    --format [formatter] biçimlendirici belirt (varsayılan: stylish)
    --no-fix             hataları düzeltme
    --max-errors         derleme hatalı olması için hata sayısını belirt (varsayılan: 0)
    --max-warnings       derleme hatalı olması için uyarı sayısını belirt (varsayılan: Sonsuz)
    --output-file        raporu yazacak dosyayı belirt
  ```

Dosyaları kontrol eder ve düzeltir. Spesifik dosyalar verilmediyse, `src` ve `tests`'teki tüm dosyaları ve kök dizindeki tüm JavaScript dosyalarını kontrol eder (bunlar genellikle `babel.config.js` veya `.eslintrc.js` gibi yapılandırma dosyalarıdır).

> Diğer [ESLint CLI seçenekleri](https://eslint.org/docs/user-guide/command-line-interface#options) desteklenmemektedir.

::: tip
`vue-cli-service lint`, varsayılan olarak nokta dosyalarını `.*.js` kontrol edecektir. Eğer ESLint'in varsayılan davranışını takip etmek istiyorsanız, projenizde bir `.eslintignore` dosyası eklemeyi düşünün.
:::

## Yapılandırma

ESLint, `.eslintrc` dosyası veya `package.json` içindeki `eslintConfig` alanı aracılığıyla yapılandırılabilir. Daha fazla detay için [ESLint yapılandırma belgelerine](https://eslint.org/docs/user-guide/configuring) bakabilirsiniz.

::: tip
Aşağıdaki seçenek, [`vue.config.js`](https://cli.vuejs.org/config/#vue-config-js) bölümünde yer almaktadır. Sadece `@vue/cli-plugin-eslint` yüklendiğinde dikkate alınır.
:::

Geliştirme sırasında `eslint-loader` ile kaydedildiğinde kontrol etme varsayılan olarak etkinleştirilmiştir. `vue.config.js` içindeki `lintOnSave` seçeneği ile devre dışı bırakılabilir:

``` js
module.exports = {
  lintOnSave: false
}
```

`true` olarak ayarlandığında, `eslint-loader` uyarıları hata olarak yayar. Varsayılan olarak, uyarılar sadece terminale kaydedilir ve derleme hatasına sebep olmaz.

::: note
Hata kontrol hatalarının tarayıcı üst katmanında görünmesini istiyorsanız, `lintOnSave: 'error'` kullanabilirsiniz. Bu, `eslint-loader`'ın her zaman hataları yaymasını zorunlu kılar. Bu ayrıca, hata kontrol hatalarının artık derlemenin başarısız olmasına neden olacağı anlamına gelir.
:::

Alternatif olarak, hem uyarıları hem de hataları gösterecek şekilde üst katmanı yapılandırabilirsiniz:

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

`lintOnSave` bir doğru değer olduğunda, `eslint-loader` hem geliştirme hem de üretim aşamasında uygulanacaktır. Üretim derlemesi sırasında `eslint-loader`'ı devre dışı bırakmak istiyorsanız, aşağıdaki yapılandırmayı kullanabilirsiniz:

``` js
// vue.config.js
module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production'
}
```

## Zaten Oluşturulmuş Bir Projeye Kurulum

```bash
vue add eslint
```

## Enjekte Edilmiş webpack-chain Kuralları

- `config.module.rule('eslint')`
- `config.module.rule('eslint').use('eslint-loader')`