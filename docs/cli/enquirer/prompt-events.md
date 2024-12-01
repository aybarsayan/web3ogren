---
description: Bu belge, istem olayları kullanarak etkileşim kurmanın ve alternatif yöntemlerin nasıl uygulanacağını detaylandırmaktadır.
keywords: [istem olayları, kullanma tarifleri, JavaScript, kullanıcı etkileşimleri, programlama örnekleri]
---

# Enquirer İstem Olayları


Bu tarif, istemlerle olayların nasıl kullanılacağını göstermektedir.

:::tip
Kullanıcı etkileşimlerini daha etkili bir şekilde yönetmek için, istem olaylarını kullanmak genellikle daha esnek bir yol sunar.
:::

**Sözleşmelere alternatif olarak olayları kullanma**

```js
const { Input } = require('enquirer');
const prompt = new Input({ name: 'username', message: 'Kullanıcı adınız nedir?' })
  .on('keypress', (s, key) => console.log([s, key]))
  .on('submit', answer => console.log(answer))
  .on('cancel', error => console.log(error))
  .run();
```

:::info
Yukarıdaki örnek, kullanıcının ismini almak için bir istem oluşturur. Bu, kullanıcı etkileşimlerini optimize etmenin güzel bir yoludur.
:::

> "İstemler, kullanıcı ile uygulama arasında sürükleyici bir deneyim yaratma fırsatı sunar."  
> — Dökümantasyon Ekibi

---


Daha Fazla Bilgi

İstem olayları, genellikle çeşitli kullanıcı etkileşimlerinin izlenmesi ve yönetimi için kullanılmaktadır. Bu, kullanıcının ne zaman ve nasıl aksiyon alacağını anlamanızı sağlar.

