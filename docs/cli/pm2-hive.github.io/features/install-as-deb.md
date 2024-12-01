---
description: Bu belge, Ubuntu LTS üzerinde apt-get aracılığıyla PM2'nin .deb paketi olarak nasıl kurulduğunu ayrıntılı olarak açıklar. Adım adım yönergelerle, PM2'nin kurulum sürecini kolayca takip edebilirsiniz.
keywords: [PM2, Ubuntu, .deb, kurulum, apt-get, Paket Yönetimi, Node.js]
---

# Deb Olarak Yükleme

Node.Js ayarlamadan PM2'yi taze bir kurulum yapmak isterseniz, **pm2** `.deb` paketi olarak mevcuttur!

En son Uzun Süreli Destek sürümüyle çalışacak şekilde oluşturulmuştur.

## Kurulum

:::info
PM2'yi kurmadan önce, sisteminizde Node.js'in yüklü olmasını kontrol edin.
:::

```bash
# 1. PM2 depo imza anahtarını ekleyin
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv D1EA2D4C

# 2. PM2 deposunu ekleyin
echo "deb http://apt.pm2.io/ubuntu stable main" | sudo tee /etc/apt/sources.list.d/pm2.list

# 3. Mevcut paketlerin listesini güncelleyin
sudo apt-get update

# 4. PM2'yi kurun
sudo apt-get install pm2
```

:::tip
Kurulumdan sonra, PM2'yi başlatmak için `pm2 start ` komutunu kullanabilirsiniz. 
:::

PM2 ile ilgli daha fazla bilgi için resmi [PM2 belgelerini](https://pm2.keymetrics.io/docs/usage/process-management/) inceleyebilirsiniz.

## Önemli Notlar

> **PM2'nin düzgün bir şekilde çalışabilmesi için, sisteminize uygun Node.js sürümünü kurduğunuzdan emin olun.** 
> — PM2 Kurulum Kılavuzu


Detaylı Bilgi
PM2, Node.js uygulamalarınızı yönetmek için kullanılan bir işlem yöneticisidir. Yüksek performans gerektiren uygulamalar için ideal bir çözümdür.
