---
description: Bu belgede, bir Yeoman oluşturucusunun hata ayıklama sürecini öğrenin. Node.js hata ayıklama bayrakları ile kullanarak nasıl işlem yapılacağını keşfedin.
keywords: [hata ayıklama, Yeoman, Node.js, geliştirici araçları, oluşturucular, hata ayıklama modu]
---

# Debuglama

Bir oluşturucuyu hata ayıklamak için, Node.js hata ayıklama bayraklarını şu şekilde çalıştırarak geçirebilirsiniz:

```sh
# OS X / Linux / Windows
npx --node-options="--inspect" yo <generator> [arguments]
```

Oluşturucunuzu Chrome Geliştirici Araçları veya *tercih ettiğiniz IDE*'yi kullanarak hata ayıklayabilirsiniz. Daha fazla bilgi için [Node Hata Ayıklama Kılavuzu](https://nodejs.org/en/docs/inspector/) sayfasına bakın.

:::info
Yeoman oluşturucuları, ilgili yaşam döngüsü bilgilerini günlüğe kaydetmek için bir hata ayıklama modu da sağlar.
:::

Bunu, `DEBUG` ortam değişkenini istenen kapsamda ayarlayarak etkinleştirebilirsiniz (oluşturucu sisteminin kapsamı `yeoman:generator`'dır).

```sh
# OS X / Linux
DEBUG=yeoman:generator

# Windows
set DEBUG=yeoman:generator
```

:::tip
Hata ayıklama sırasında oluşan önemli bilgiler için düzenli olarak günlük kaydı yapmayı unutmayın.
:::