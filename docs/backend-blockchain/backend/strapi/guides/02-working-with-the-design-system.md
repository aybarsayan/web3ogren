---
title: Tasarım Sistemi ile Çalışma
description: Bu doküman, Strapi monorepo'su ile yerel bir Strapi tasarım sistemi sürümünün nasıl bağlanacağını ve kullanacağını açıkladı. Adım adım talimatlarla tasarım sisteminizi verimli bir şekilde entegre edebilirsiniz.
keywords: [Strapi, tasarım sistemi, monorepo, yarn, bağlama, geliştirme]
---

## Strapi Tasarım Sistemini Bağlama

:::info
Strapi monorepo'su ile yerel bir Strapi tasarım sistemi sürümünü kullanmak için aşağıdaki adımları gerçekleştirin.
:::

Strapi monorepo'su ile yerel bir Strapi tasarım sistemi sürümünü kullanmak için şu adımları izleyin:

1. Tasarım **sistemi kopyanızda** `yarn build` komutunu çalıştırarak paketi oluşturun.
   
   > **Not:** Eğer bir hata alırsanız, bağımlılıkların güncellenmiş olduğundan emin olun.  
   > — Strapi Ekibi

2. Strapi monorepo'sunda, yerel tasarım sistemi kopyanızı [`yarn link`](https://yarnpkg.com/cli/link#gatsby-focus-wrapper) ile bağlayın:
   ```
   yarn link -r ../<relative-path-to-strapi-design-system>
   ```

3. `examples/getstarted` dizininde `yarn build` komutunu çalıştırmak artık yerel **tasarım sistemi** sürümünüzü kullanmalıdır.

---

:::tip
Yerel tasarım sistemi ile çalışırken, dosya yollarınızı kontrol ettiğinizden emin olun.
:::

Tasarım sisteminin yayımlanan sürümüne geri dönmek için [`yarn unlink`](https://yarnpkg.com/cli/unlink#usage) komutunu kullanın:
```
yarn unlink ../<relative-path-to-strapi-design-system>
```