---
layout: docs
title: Heroku Entegrasyonu
description: Bu sayfa, PM2'nin Heroku ile entegrasyonunu adım adım açıklamaktadır. Heroku üzerinde uygulama dağıtımı yaparken izlenecek adımları ve en iyi uygulamaları öğrenin.
keywords: [Heroku, PM2, entegrasyon, dağıtım, Node.js]
---

## PM2'yi Heroku ile Kullanma

Bu sayfa, PM2'nin Heroku ile entegrasyonunu adım adım açıklayacaktır.

Git ve Heroku CLI kullanacağız.

## Uygulamanızı Hazırlayın

### Ekosistem dosyanızı ayarlayın

Bir `ecosystem.config.js` şablonu oluşturmak için:

```bash
pm2 init
```

Ekosistem dosyasını ihtiyaçlarınıza göre değiştirin:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

Ekosistem dosyası hakkında daha fazla bilgi için `buraya` bakın.
:::tip
Heroku ile küme modunu kullanmanızı öneririz; çünkü her dyno çok çekirdekli bir CPU'ya sahiptir.
Daha fazla bilgi için `küme modu` hakkında okuyun.
:::

### PM2'yi modül olarak ekleyin

Projenize pm2'yi bağımlılık olarak ekleyin.

npm ile:

```bash
npm install pm2
```

yarn ile:

```bash
yarn add pm2
```

### package.json dosyanızı ayarlayın

`package.json` dosyanızda, `start` komutunu aşağıdaki gibi değiştirin:

```json
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js --env production"
  }
}
```

## Heroku ile Dağıtım

### Heroku'da bir hesap oluşturun

Heroku'da bir hesap için [buradan](https://signup.heroku.com/) kayıt olun.

### CLI'yi yükleyin

Kurulum talimatlarını [buradan](https://devcenter.heroku.com/articles/heroku-cli) takip edin.

Ardından, CLI'yı hesabınıza bağlamak için `heroku login` komutunu çalıştırın.

### Heroku uygulamanızı başlatın

Öncelikle, Heroku'da yeni boş bir uygulama ve ilişkili boş bir Git deposu oluşturacağız.

Uygulamanızın kök klasöründen bu komutu çalıştırın:
```bash
heroku create

Creating app... done, ⬢ guarded-island-32432
https://guarded-island-32432.herokuapp.com/ | https://git.heroku.com/guarded-island-32432.git
```

Artık `heroku` adında yeni bir git uzantınız var. Bu depoya itme yaparsanız, kodunuz otomatik olarak belirtilen URL'de dağıtılır.

### Uygulamanızı Heroku'da dağıtın

Tüm değişikliklerinizi ekleyin ve taahhüt edin, ardından çalıştırın:

```bash
git push heroku master
Initializing repository, done.
updating 'refs/heads/master'
remote: Compressing source files... done.
remote: Building source:
...
remote:
remote: Verifying deploy... done.
To https://git.heroku.com/aqueous-temple-78487.git
```

## Hazırsınız

Hepsi bu kadar! Dağıtımın son satırı, uygulamanızın erişilebilir olduğu URL'yi verecektir.