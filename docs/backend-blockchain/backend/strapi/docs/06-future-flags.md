---
title: Gelecek Bayrakları
description: Strapi'deki gelecek bayrakları ile henüz tüm kullanıcılara sunulmaya hazır olmayan özellikleri nasıl etkinleştirebileceğinizi ve kullanabileceğinizi öğreneceksiniz. Bu bayraklar, kullanıcıların potansiyel olarak kararsız özellikleri denemesi için bir fırsat sunar.
keywords: [Gelecek Bayrakları, Strapi, kararsız özellikler, yapılandırma, API]
---

Strapi'de, henüz tüm kullanıcılara sunulmaya hazır olmayan gelen özelliklerimiz var, ancak bunları kod tabanımızla güncel tutmayı amaçlıyoruz. Ek olarak, topluluk kullanıcılarına bu yeni özellikler veya değişiklikler hakkında erken geri bildirim sağlama fırsatı sunmak istiyoruz.

:::tip
Bunu başarmak için, kararlı olmayan özellikleri **kendi riskinizle** etkinleştirmek için bir yol sağlayan gelecek bayraklarını kullanıyoruz.
:::

Lütfen bu bayrakların değişime, kaldırmaya tabi olabileceğini ve bazı durumlarda kırıcı değişiklikler içerebileceğini dikkate alın.

> **Gelecek bayrakları**, henüz gönderilmemiş kararsız özellikler için kullanılabilir. Dolayısıyla, kararsız bir özelliği etkinleştirmeye karar verirseniz (başında `unstable` ile), bu özelliğin muhtemelen değiştirilmesi veya hatta kaldırılması olasılığı olduğunu unutmayın. 

Ayrıca, bu kararsız özelliğin tam olarak kullanıma hazır olmadığını; bazı bölümlerinin hala geliştirilmekte veya şu anda sahte veriler kullanıyor olabileceğini de göz önünde bulundurmalısınız.

:::warning
Ayrıca, gelecek bayrakları, bir kırıcı değişikliği etkinleştirmek için de kullanılabilir (eğer `vX` ile başlıyorsa, 'X' hedef sürümü temsil eder). Bu senaryoda, bir kırıcı değişiklik için gelecek bir bayrağı etkinleştirmeye karar verirseniz, uygulamanızı bu kırıcı değişikliğe uyum sağlamanız gerektiğini dikkate alın.
:::

## Gelecek bayraklarını nasıl etkinleştirebilirsiniz.

Bir gelecek bayrağını etkinleştirmek için, bunu Strapi uygulamanızdaki config/features.(js|ts) dosyanıza eklemelisiniz. Bu dosyaya sahip değilseniz, bir tane oluşturun.

```ts
// config/features.ts

export default {
  future: {
    unstableFeatureName: true,
    v5breakingChange: env('STRAPI_FEATURES_FUTURE_V5BREAKINGCHANGE', false),
  },
};
```

## Gelecek bir bayrağı nasıl ekleyip kullanmaya başlayabilirsiniz.

Geliştiriciler, Strapi kod tabanına yeni bir kararsız özellik eklemeyi planlıyorlarsa, yeni gelecek bayraklarını eklemekten sorumludurlar. Özellikler yapılandırması, yapılandırma nesnesinin bir parçasıdır ve `strapi.config.get('features')` ile kolayca erişilebilir.

:::info
Ayrıca, bir gelecek bayrağının etkin olup olmadığını kontrol etmenizi sağlayan Strapi nesnesinde bir API sunuyoruz. Bunu şu yöntemle yapabilirsiniz: `strapi.future.isEnabled('featureName')`.
:::