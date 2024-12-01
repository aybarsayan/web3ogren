---
description: Bu belge, Clipanion kütüphanesini TypeScript ile kullanan bir komut uygulama örneği sunmaktadır. Bir selamlama yanıtı veren bir komutun nasıl oluşturulacağını göstermektedir.
keywords: [Clipanion, TypeScript, komut, selamlama, programlama]
---

# Vitrin

# Örnek Komut Uygulaması

Aşağıdaki kod parçası, **Clipanion** kütüphanesini kullanarak **TypeScript**'te basit bir komutun nasıl oluşturulacağını göstermektedir.

```ts twoslash
import {Command, Option, runExit} from 'clipanion';

runExit(class MainCommand extends Command {
  name = Option.String();

  async execute() {
    this.context.stdout.write(`Merhaba ${this.name}!\n`);
  }
})
```

---

:::tip
Bu örneği etkili bir şekilde kullanmak için projenizde Clipanion kütüphanesinin kurulu olduğundan emin olun.
:::

Kodda tanımlanan komut, bir ismi girdi olarak alır ve ardından bir selamlama mesajı çıktısı verir.

> **Önemli Nokta:** `execute` metodu, komutun ana mantığının bulunduğu yerdir ve girdi işlendikten sonra temel işlevselliği yönetir.
> — Clipanion komutlarının önemli bir yönü.

---

Clipanion hakkında daha fazla bilgi için tıklayın

Clipanion, komut satırı arayüzleri oluşturmak için güçlü bir kütüphanedir. Komutları, seçenekleri tanımlamak ve bunları sorunsuz bir şekilde yürütmek için basit ve esnek bir yol sağlar, bu da onu CLI uygulamaları için ideal kılar.

:::info
Argüman ayrıştırma ve ara yazılım gibi gelişmiş kullanım ve ek özellikler için Clipanion dokümantasyonunu incelemeyi unutmayın.
:::

Özetle, Clipanion gibi kütüphaneleri kullanmak, komut satırı uygulaması geliştirme deneyiminizi önemli ölçüde geliştirebilir.