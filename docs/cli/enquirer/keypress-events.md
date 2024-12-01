---
title: Tuş Vuruşu Olayları
description: Bu sayfa, kullanıcı girişleri sırasında tuş vuruşu olaylarını nasıl kaydedeceğinizi ve bunları nasıl görüntüleyeceğinizi gösterir. Örnek kod parçacıkları içermektedir.
keywords: [tuş vuruşu, olay kaydetme, kullanıcı girişi, enquirer, JavaScript]
---

## Tuş Vuruşu Olayları

Tarif, herhangi bir istemle tuş vuruşu olaylarını nasıl kaydedeceğinizi gösterir.

:::tip
Tuş vuruşlarını kaydetmek için uygun bir kütüphane kullanmak, kodunuzun okunabilirliğini artırır.
:::

### **Tuş vuruşlarını girilirken görün**

```js
const { Input } = require('enquirer');
const prompt = new Input({ name: 'username', message: 'Kullanıcı adınız nedir?' });

prompt.on('keypress', (s, key) => console.log([s, key]));

prompt.run()
  .then(answer => console.log(answer))
  .catch(console.log);
```

:::info
Yukarıdaki örnek, kullanıcı adı istenildiğinde tuş vuruşlarını gösterir. Her tuş vuruşunda mevcut durumu konsola yazdırır.
:::

### **Tuş vuruşlarını gönderimden sonra görün**

```js
const { Input } = require('enquirer');
const prompt = new Input({ name: 'username', message: 'Kullanıcı adınız nedir?' });
const keypresses = [];

prompt.on('keypress', (s, key) => keypresses.push(key));

prompt.run()
  .then(() => console.log(keypresses))
  .catch(console.log);
```

:::warning
Herhangi bir tuş vuruşunu kaydederken güvenli veri yönetimi önemlidir. Kullanıcı girişi ve verileri koruma yollarını araştırın.
:::

### Önemli Nokta
> "Kullanıcı etkileşimlerini yakalamak, uygulamanızın daha etkileşimli olmasını sağlar."  
— Belirtilen bilgi  


Ek Bilgiler
Bu tuş vuruşu kaydetme yöntemleri, kullanıcı etkileşimlerini analiz etmek ve uygulama deneyimini geliştirmek için faydalıdır.
