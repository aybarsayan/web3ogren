---
description: PM2'nin bulut ortamında nasıl kullanılacağını keşfedin. CLI erişimi olmadan Node.js uygulamalarınızı hızla başlatmak için adım adım rehber.
keywords: [PM2, Bulut Sağlayıcıları, Node.js, Uygulama Yayınlama, Ecosystem.config.js]
---

# PM2'yi Bulut Sağlayıcılarında Kullanma

Node.js uygulamalarınızı başlatmak için CLI'ye erişiminiz olmadığı bir durumla karşılaşabilirsiniz. 

:::info
Böyle bir durumda, pm2 bir bağımlılık olarak eklenmeli ve başlatma betiği ile çağrılmalıdır.
:::

## Uygulamanızı Hazırlayın

### Ekosistem dosyanızı ayarlayın

Aşağıdaki komut ile bir `ecosystem.config.js` şablonu oluşturun:

```bash
pm2 init
```

Ekosistem dosyasını ihtiyaçlarınıza göre değiştirebilirsiniz:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

Ekosistem dosyası hakkında daha fazla bilgi edinin `buradan`.
{: .tip}

### PM2'yi bir modül olarak ekleyin

PM2'yi projenize bağımlılık olarak ekleyin.

npm ile:

```bash
npm install pm2
```

yarn ile:

```bash
yarn add pm2
```

### package.json'da start betiği

`package.json` dosyanızda `start` betiğinizi aşağıdaki gibi değiştirin:

```json
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js --env production"
  }
}
```

## Uygulamanızı Yayınlayın

Artık bulut sağlayıcılarınızda, normal bir Node.js uygulaması gibi uygulamanızı yayınlayabilirsiniz.

:::warning
Unutmayın, bu adımları takip ederken doğru ortam değişkenlerini ayarladığınızdan emin olun.
:::

---

**Önemli:** Uygulamanızın sorunsuz bir şekilde çalışabilmesi için tüm bağımlılıkların kurulu olduğundan emin olun. 

> “PM2, uygulamanızı yönetmenin güçlü ve etkili bir yolunu sunar.”  
> — PM2 Kullanım Kılavuzu