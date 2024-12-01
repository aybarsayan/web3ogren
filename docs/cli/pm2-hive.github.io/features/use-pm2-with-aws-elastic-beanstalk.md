---
description: AWS Elastic Beanstalk'ta PM2/Keymetrics entegrasyonunu adım adım öğrenin. Bu rehber, uygulamanızı kolayca dağıtmanıza ve izlemenize yardımcı olacaktır.
keywords: [PM2, Keymetrics, AWS, Elastic Beanstalk, deployment, application monitoring, npm]
---

# AWS Elastic Beanstalk'ta PM2/Keymetrics Kullanma

Bu sayfa, PM2/Keymetrics entegrasyonunu Beanstalk ortamında adım adım geçmenize yardımcı olacaktır. Daha kolay dağıtım için [eb cli](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) kullanılmasını öneririz.

Kolay test için bir depo oluşturduk: [pm2-ebs-demo](https://github.com/keymetrics/pm2-ebs-demo).

---

## Beanstalk'ı Kurma

Uygulama dizininize gidin ve Beanstalk'ı kurmak için `eb init` komutunu kullanın.

:::info
Beanstalk’ın uygulamanızı `npm start` kullanarak başlatmaya çalıştığından emin olmamız gerekiyor.
:::

Bunu yapmak için, kaynak paketinizin kökünde uygulamanızı başlatan komutu belirten Procfile adlı bir dosya ekleyin.

```plaintext
./Procfile

web: npm start
```

---

## PM2'yi Entegre Etme

PM2'yi kullanarak uygulamanızı izlemek için en kolay ve en az müdahale gerektiren yol, onu bir npm modülü olarak gereksinim olarak eklemektir. pm2'nin uygulamayı başlatabilmesi için `package.json` yapısını yalnızca değiştireceğiz. 

#### pm2'yi uygulama bağımlılıklarınıza ekleyin:

```bash
npm install pm2 --save
```

Daha sonra başlangıç betiklerini değiştirmemiz gerekecek. PM2'yi node_modules klasöründen arıyoruz:

```json
"scripts": {
  "start": "./node_modules/pm2/bin/pm2-runtime app.js",
  "poststart":  "node ./node_modules/pm2/bin/pm2 logs"
}
```

* **"start"** betiğini ihtiyaçlarınıza uyacak şekilde özelleştirin.
* **"poststart"** betiği isteğe bağlıdır, ancak AWS kontrol panelinde doğrudan basit günlük kontrolü sağlar.

> *Hepsi bu kadar! Minimum yükleme ile ElasticBeanstalk örneklerinizde PM2 örneği almak için `eb deploy` komutunu çalıştırın.*  
> — AWS Rehberliği

---

## Keymetrics ile PM2'yi Entegre Etme

Keymetrics ile bağlantı kurmak için PM2’ye ortamdan iki değişken geçmemiz gerekiyor: `KEYMETRICS_PUBLIC` ve `KEYMETRICS_SECRET`.

* CLI'den ortam oluştururken:
```bash
eb create --envvars KEYMETRICS_PUBLIC=XXXXX,KEYMETRICS_SECRET=XXXXXX
```
* Bu değişkenleri ayrıca AWS kontrol panelinde Yazılım Yapılandırma seçeneklerinde de ekleyebilirsiniz.

Daha sonra pm2 entegrasyon prosedürünü takip edin ve pm2 uygulamayı başlatıldığında otomatik olarak bağlayacaktır.