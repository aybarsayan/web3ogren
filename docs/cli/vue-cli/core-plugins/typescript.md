---
description: Vue CLI için TypeScript eklentisinin yapılandırması ve kullanımı hakkında bilgi. Bu içerik, TypeScript'in Vue projelerinde nasıl kullanılacağını ve yapılandırılacağını açıklar.
keywords: [Vue, TypeScript, ts-loader, web pack, önbellekleme]
---

# @vue/cli-plugin-typescript

> Vue CLI için TypeScript eklentisi

TypeScript + `ts-loader` + [fork-ts-checker-webpack-plugin](https://github.com/Realytics/fork-ts-checker-webpack-plugin) kullanarak daha hızlı arka planda tür kontrolü sağlar.

## Yapılandırma

TypeScript, `tsconfig.json` üzerinden yapılandırılabilir.

:::info
`3.0.0-rc.6` sürümünden itibaren, `typescript` artık bu paketin bir eş bağımlılığıdır, bu nedenle projenizin `package.json` dosyasını güncelleyerek belirli bir TypeScript sürümünü kullanabilirsiniz.
:::

Bu eklenti, `@vue/cli-plugin-babel` ile birlikte kullanılabilir. Babel ile kullanıldığında, bu eklenti ES2015 çıktısı verir ve geri kalanını tarayıcı hedeflerine göre otomatik polyfill için Babel'e devreder.

## Önbellekleme

[cache-loader](https://github.com/webpack-contrib/cache-loader) varsayılan olarak etkindir ve önbellek `/node_modules/.cache/ts-loader` içerisinde saklanır.

## Paralelleştirme

[thread-loader](https://github.com/webpack-contrib/thread-loader) varsayılan olarak bir makinenin 1'den fazla CPU çekirdeğine sahip olması durumunda etkindir. Bu, `vue.config.js` içerisinde `parallel: false` ayarlanarak kapatılabilir.

:::warning
`parallel`, regexler, tarihler ve fonksiyonlar gibi seri hale getirilemeyen yükleyici seçenekleri ile TypeScript kullanıldığında `false` olarak ayarlanmalıdır. Bu seçenekler, `ts-loader`'a doğru bir şekilde iletilmeyecek ve beklenmedik hatalara yol açabilecektir.
:::

## Zaten Oluşturulmuş Bir Projeye Kurulum

```bash
vue add typescript
```

## Enjekte Edilmiş webpack-zincir Kuralları

- `config.rule('ts')`
- `config.rule('ts').use('ts-loader')`
- `config.rule('ts').use('babel-loader')` ( `@vue/cli-plugin-babel` ile birlikte kullanıldığında)
- `config.rule('ts').use('cache-loader')`
- `config.plugin('fork-ts-checker')`