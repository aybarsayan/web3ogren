---
description: Vue CLI için unit-jest eklentisi ile Jest kullanarak birim testleri çalıştırmayı öğrenin. Test işlemlerini yapılandırma ve hata ayıklama yöntemleri hakkında bilgiler içerir.
keywords: [vue-cli, jest, unit tests, configuration, debugging]
---

# @vue/cli-plugin-unit-jest

> vue-cli için unit-jest eklentisi

## Enjekte Edilen Komutlar

- **`vue-cli-service test:unit`**

  Jest ile birim testlerini çalıştırın. Varsayılan `testMatch` `/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))` şeklindedir ve şunları eşleştirir:

  - `.spec.(js|jsx|ts|tsx)` ile biten `tests/unit` dizinindeki herhangi bir dosya;
  - `__tests__` dizinlerinin içindeki herhangi bir js(x)/ts(x) dosyası.

  Kullanım: `vue-cli-service test:unit [options] `

  Tüm [Jest komut satırı seçenekleri](https://facebook.github.io/jest/docs/en/cli.html) de desteklenmektedir.

## Testleri Hata Ayıklama

:::warning
Doğrudan `jest` çalıştırmanın başarısız olacağına dikkat edin çünkü Babel preset'i kodunuzun Node.js'te çalışması için ipuçlarına ihtiyaç duyar; bu nedenle testlerinizi `vue-cli-service test:unit` ile çalıştırmalısınız.
:::

Testlerinizi Node denetleyicisi aracılığıyla hata ayıklamak isterseniz, aşağıdakileri çalıştırabilirsiniz:

```bash
# macOS veya linux
node --inspect-brk ./node_modules/.bin/vue-cli-service test:unit --runInBand

# Windows
node --inspect-brk ./node_modules/@vue/cli-service/bin/vue-cli-service.js test:unit --runInBand
```

## Yapılandırma

Jest, projenizin kökündeki `jest.config.js` dosyası veya `package.json` içindeki `jest` alanı aracılığıyla yapılandırılabilir.

:::tip
Configuration files like `jest.config.js` allow you to customize Jest's behavior to suit your project's needs.
:::

## Zaten Oluşturulmuş Bir Projeye Kurulum

```bash
vue add unit-jest
```

## `/node_modules` içindeki bağımlılıkları dönüştürme

Varsayılan olarak, jest `/node_modules`'den hiçbir şeyi dönüştürmez.

Jest, node'da çalıştığı için modern ECMAScript özelliklerini kullanan hiçbir şeyi dönüştürmemiz gerekmez çünkü Node >=8 bu özellikleri zaten destekler, bu nedenle makul bir varsayılandır. cli-plugin-jest de aynı nedenle `vue.config.js` içindeki `transpileDependencies` seçeneğine saygı göstermez.

Ancak, jest'te `/node_modules`'den kod dönüştürmemiz gereken (en az) üç durum vardır:

1. **ES6 `import`/`export` ifadelerinin, commonjs `module.exports`'a derlenmesi gerekir.**
2. **Tek Dosya Bileşenleri (`.vue` dosyaları) `vue-jest` ile çalıştırılmalıdır.**
3. **Typescript kodu.**

Bunu yapmak için, jest'in `transformIgnorePatterns` seçeneğine bir istisna eklememiz gerekir. Varsayılan değeri şudur:

```javascript
transformIgnorePatterns: ['/node_modules/']
```

Bu desene bir RegExp negatif lookahead ile istisnalar eklememiz gerekecek:

```javascript
transformIgnorePatterns: ['/node_modules/(?!name-of-lib-o-transform)']
```

Birden fazla kütüphaneyi dışlamak için:

```javascript
transformIgnorePatterns: ['/node_modules/(?!lib-to-transform|other-lib)']
```