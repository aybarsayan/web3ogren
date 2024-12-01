---
title: UI Lokalizasyonu
description: Bu belge, UI'nin yerelleştirilmesi hakkında bilgi sunarak, çeviri süreçlerini ve gerekli adımları açıklamaktadır. Ayrıca, Transifex ve vue-i18n gibi araçların nasıl kullanılacağını da detaylandırmaktadır.
keywords: [UI lokalizasyonu, çeviri, Transifex, vue-i18n, yerelleştirme, diller]
---

# UI Lokalizasyonu

## Standart UI'yi Çevirin

İşbirliği ve senkronizasyonu kolaylaştırmak için, `dev` dalından gelen İngilizce kaynak yerel ayarı otomatik olarak [Transifex](https://www.transifex.com/vuejs/vue-cli/dashboard/) platformuna aktarılmaktadır. Bu platform, işbirliği ile çeviri yapmaya olanak tanır.

Mevcut diller için, [çevirmene kaydolabilirsiniz](https://www.transifex.com/vuejs/vue-cli/dashboard/). Yeni diller için, kaydolduktan sonra [yeni dil talep edebilirsiniz](https://www.transifex.com/vuejs/vue-cli/dashboard/).

::: tip
Her iki durumda da, kaynak yerel ayarda eklenen veya değiştirilen anahtarları çevirebileceksiniz.
:::

## Eklentinizi Çevirin

Uygulamanızın kökünde bir `locales` klasörüne [vue-i18n](https://github.com/kazupon/vue-i18n) ile uyumlu yerel dosyalar koyabilirsiniz. Proje açıldığında, bu dosyalar otomatik olarak istemciye yüklenecektir. Ardından, bileşenlerinizde ve diğer vue-i18n yardımcılarında dizeleri çevirmek için `$t` kullanabilirsiniz. Ayrıca, UI API'sinde (örneğin `describeTask`) kullanılan dizeler de vue-i18n üzerinden geçecek ve böylece bunları yerelleştirebilirsiniz.

**Örnek `locales` klasörü:**

```
vue-cli-plugin/locales/en.json
vue-cli-plugin/locales/fr.json
```

**API'deki örnek kullanım:**

```js
api.describeConfig({
  // vue-i18n yolu
  description: 'com.my-name.my-plugin.config.foo'
})
```

::: danger
Kimliğin doğru bir biçimde isim alanı kullanmasına dikkat edin, çünkü tüm eklentiler arasında benzersiz olması gerekir. [ters alan adı notasyonu](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) kullanmanız önerilir.
:::

**Bileşenlerdeki örnek kullanım:**

```html
<VueButton>{{ $t('com.my-name.my-plugin.actions.bar') }}</VueButton>
```

İsterseniz, `ClientAddonApi` kullanarak bir istemci eklentisinde de yerel dosyaları yükleyebilirsiniz:

```js
// Yerel dosyaları yükle (vue-i18n kullanır)
const locales = require.context('./locales', true, /[a-z0-9]+\.json$/i)
locales.keys().forEach(key => {
  const locale = key.match(/([a-z0-9]+)\./i)[1]
  ClientAddonApi.addLocalization(locale, locales(key))
})
```