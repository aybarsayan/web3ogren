---
description: Vue CLI için Babel eklentisinin yapılandırılması, önbellekleme, paralelleştirme ve projeye kurulumu hakkında detaylı bilgiler sunulur. Bu içerik, geliştiricilere Babel'i etkili kullanmaları için gerekli ipuçlarını verir.
keywords: [Vue CLI, Babel, babel-loader, web development, JavaScript, configuration, plugins]
---

# @vue/cli-plugin-babel

> vue-cli için babel eklentisi

## Yapılandırma

Varsayılan olarak **Babel 7**, `babel-loader` ve [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app) kullanır, ancak `babel.config.js` üzerinden başka Babel ön ayarları veya eklentileri kullanacak şekilde yapılandırılabilir.

:::tip
Eğer bir bağımlılık modülünü açıkça dönüştürmek istiyorsanız, bunu `vue.config.js` içindeki `transpileDependencies` seçeneğine eklemeniz gerekecek.
:::

Varsayılan olarak, `babel-loader` `node_modules` bağımlılıkları içindeki dosyaları hariç tutar. Aşağıdaki gibi yapılandırabilirsiniz:

``` js
module.exports = {
  transpileDependencies: [
    // string veya regex olabilir
    'my-dep',
    /other-dep/
  ]
}
```

## Önbellekleme

[betal-loader](https://github.com/babel/babel-loader#options) önbellek seçenekleri varsayılan olarak etkinleştirilmiştir ve önbellek `/node_modules/.cache/babel-loader` içinde saklanır.

---

## Paralelleştirme

[thread-loader](https://github.com/webpack-contrib/thread-loader) varsayılan olarak 1'den fazla CPU çekirdeği olduğunda etkinleştirilmiştir. Bu ayar, `vue.config.js` içinde `parallel: false` ayarlayarak kapatılabilir.

:::warning
`parallel`, regexler, tarihler ve fonksiyonlar gibi seri hale getirilemeyen yükleyici seçenekleri ile birlikte Babel kullanıldığında `false` olarak ayarlanmalıdır. Bu seçenekler `babel-loader`'a doğru bir şekilde iletilmeyecek ve beklenmedik hatalara yol açabilir.
:::

## Zaten Oluşturulmuş Bir Projeye Kurulum

```bash
vue add babel
```

## Enjekte Edilmiş webpack-chain Kuralları

- `config.rule('js')`
- `config.rule('js').use('babel-loader')`