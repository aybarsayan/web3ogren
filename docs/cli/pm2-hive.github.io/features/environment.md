---
description: Uygulamalarınızın ortam değişkenlerini yönetmek için PM2'nin sağladığı özellikleri keşfedin. Ortam değişkenlerini tanımlama, kullanma ve yönetme konusunda adım adım rehberlik.
keywords: [PM2, ortam değişkenleri, NODE_APP_INSTANCE, exec_mode, uygulama yapılandırması]
---

# Yeni bir işlem başlatırken

PM2, yeni bir işlem **başlatırken** ortamı bu sırayla enjekte edecektir:

- Önce PM2 CLI, kendi ortamını kullanarak mevcut shell ortamınızı enjekte eder.
- PM2 daha sonra ekosistem dosyasıyla yapılandırabileceğiniz ortamı enjekte eder:

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
          "NODE_ENV": "development",
        }
      }
  ]
}
```

Burada PM2'nin mevcut ortamı `NODE_ENV=development` eklemek için geçersiz kıldığını görebilirsiniz. Ancak farklı ortamları şu şekilde tanımlamak da mümkündür:

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 80,
            "NODE_ENV": "production",
        }
      }
  ]
}
```

Burada varsayılan ortam `env` içerisindedir, ancak `pm2 start ecosystem.config.js --env production` kullanarak `env_production`'ı da tercih edebilirsiniz.

:::tip
İstediğiniz kadar ortam tanımlayabilirsiniz. Sadece kullanmak istediğiniz ortamın ( `env_` sonrasındaki) adını `--env` ile geçmeyi unutmamalısınız.
:::

## Özel ortam değişkenleri

### NODE_APP_INSTANCE (PM2 2.5 minimum)

`NODE_APP_INSTANCE` ortam değişkeni, işlemler arasında ayırım yapmak için kullanılır. Örneğin, bir cronjob'u sadece bir işlemde çalıştırmak istiyorsanız, `process.env.NODE_APP_INSTANCE === '0'` ifadesini kontrol edebilirsiniz. 

> İki işlem asla aynı numaraya sahip olamaz, bu durum `pm2 restart` ve `pm2 scale` komutlarından sonra da geçerlidir.  
> — PM2 Dokümantasyonu

`NODE_APP_INSTANCE` ismi ile [node-config](https://github.com/Unitech/pm2/issues/2045) ile sorun yaşayabilirsiniz, bu nedenle `instance_var` seçenekleri ile yeniden adlandırabilirsiniz:

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        instance_var: 'INSTANCE_ID',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

Bu durumda değişken aynı davranışı sergileyecek ancak `process.env.INSTANCE_ID` içerisinde olacaktır.

#### increment_var (PM2 2.5 minimum)

PM2'ye her kurulan örnek için bir ortam değişkenini artırmasını istemek için bir seçenek vardır. Örneğin:

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        instances: 2,
        exec_mode: "cluster",
        watch: true,
        increment_var: 'PORT',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

Bu örnekte, `pm2 start ecosystem.config.js` komutunu çalıştırdığımda:
 - PM2'nın her örnek için `PORT` değişkenini artırmak istediğimi görecektir.
 - Varsayılanın `3000` olarak tanımlandığını görür.
 - İlk örnek `process.env.PORT = 3000` alacak ve ikinci örnek `process.env.PORT = 3001` alacaktır.

:::note
Ayrıca, `pm2 scale myapp 4` kullanırken de artırır, yeni örneklerin her biri `3002` ve `3003` olarak `PORT` değişkenine sahip olacaktır.
:::