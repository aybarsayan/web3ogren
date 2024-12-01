---
title: Özel İstekler
description: Enquirer 2.0 ile özel isteklerin oluşturulması sürecini keşfedin. Özel isteklerin nasıl oluşturulacağını ve mevcut seçenekleri öğrenin.
keywords: [Enquirer, özel istekler, JavaScript, Prompt sınıfı, kullanıcı girişi, kod örneği]
---

# Özel Promptlar

Enquirer 2.0 ile özel istekler yaratmak her zamankinden daha kolay. 

**Özel isteği nasıl oluşturabilirim?**

Özel istekler, ya:
- Enquirer'ın `Prompt` sınıfını genişleterek
- Yerleşik `isteklerden` birini kullanarak
- ya da düşük seviyeli `tiplerden` birini kullanarak oluşturulur.

:::tip 
Herhangi bir özel isteği oluştururken, mevcut seçeneklerden yararlanarak başlayabilirsiniz.
:::



```js
const { Prompt } = require('enquirer');

class HaiKarate extends Prompt {
  constructor(options = {}) {
    super(options);
    this.value = options.initial || 0;
    this.cursorHide();
  }
  up() {
    this.value++;
    this.render();
  }
  down() {
    this.value--;
    this.render();
  }
  render() {
    this.clear(); // terminalden daha önce render edilmiş isteği temizle
    this.write(`${this.state.message}: ${this.value}`);
  }
}

// Özel istek sınıfınızın bir örneğini oluşturarak isteği kullanın.
const prompt = new HaiKarate({
  message: 'Kaç sprey istiyorsunuz?',
  initial: 10
});

prompt.run()
  .then(answer => console.log('Spreyler:', answer))
  .catch(console.error);
```

İsteğinizi `tip` ile belirlemek istiyorsanız ve diğer isteklerle birlikte kullanılabilmesi için, önce bir `Enquirer` örneği oluşturmanız gerekir.

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
```

Sonra özel isteğinizi eklemek için `.register()` yöntemini kullanın.

```js
enquirer.register('haikarate', HaiKarate);
```

Artık "sorular" tanımlarken aşağıdakileri yapabilirsiniz.

```js
const spritzer = require('cologne-drone');
const answers = await enquirer.prompt([
  {
    type: 'haikarate',
    name: 'cologne',
    message: 'Kaç sprey gerekiyor?',
    initial: 10,
    async onSubmit(name, value) {
      await spritzer.activate(value); //<= drone'u etkinleştir
      return value;
    }
  }
]);
```

:::info 
Bu işlem sırasında, `onSubmit` fonksiyonuna dikkat edin; kullanıcıdan alınan değerleri çeşitli işlevlerde kullanabilirsiniz.
:::

:::warning 
Unutmayın ki, özel isteği kaydetmeden önce onu tanımlamak için gerekli tüm yöntemleri belirlemiş olmalısınız.
:::