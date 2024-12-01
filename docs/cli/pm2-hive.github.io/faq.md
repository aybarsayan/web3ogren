---
layout: docs
title: SSS (Sıkça Sorulan Sorular)
description: Bu belge, PM2 ile ilgili sıkça sorulan soruları ve yanıtlarını içermektedir. Özellikle PM2'nin paneline bağlanma sorunları ve versiyonlama butonlarıyla ilgili sık karşılaşılan durumları ele almaktadır.
keywords: [PM2, sıkça sorulan sorular, bağlantı sorunları, versiyonlama, Node.js, yönetici yetkileri]
---

## 1. Yerel PM2'mi PM2.io paneline bağlayamıyorum

Bu durumda olmanızın birkaç nedeni olabilir:

- Bir şirket proxy'si veya güvenlik duvarının arkasındasınız.

:::tip
443 portunun açık olduğundan emin olun ve/veya proxy ayarını yapın:
`PM2_PROXY= pm2 link  `
:::

- Eski bir PM2 sürümü kullanıyorsunuz. PM2'yi en son sürüme güncelleyin: `npm install pm2@latest -g`

- Aynı sunucu adıyla aynı kovaya veri gönderen birden fazla PM2 örneğiniz var. Sadece bir PM2 örneğinizin çalıştığından emin olun:
`ps -aux | grep PM2`

- Keymetrics ile bağlantınızı yenileyin. `pm2 link stop` ardından `pm2 link start`. Ayrıca, panoyu yenilemeyi de unutmayın, bazen bu da yardımcı olabilir.

---

## 2. Versiyonlama butonları (Geri Al/Çek/Upgrade) çalışmıyor

- Butonlar devre dışıysa, `Yerel değişiklikler` ve `Yerel taahhüt` göstergelerinin yeşil olduğundan emin olun.

- Böyle işlemler yapmaya çalıştığınızda `Yetkilendirilmedi` uyarısı alıyorsanız, bu, bu kovada yönetici yetkilerinizin olmadığı anlamına gelir.

:::warning
Yukarıdakilerin hiçbiri olmuyorsa, ancak işlem duraklı kalıyorsa, güncel bir Node.js sürümüne ve en son PM2 sürümüne sahip olduğunuzdan emin olun.
:::

- Ayrıca, deposunun şifre girişi istememesi gerekir (bu, onu ssh üzerinden klonlamanız gerektiği anlamına gelir). Klasörde `git remote update` yazarak el ile deneyin ve bir şifre isteyip istemediğine bakın.