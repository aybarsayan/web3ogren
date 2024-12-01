---
description: PM2'yi en son sürüme yükseltme süreci hakkında bilgiler. PM2 güncellemeleri ve Node.js sürüm yükseltmesi için adımlar.
keywords: [PM2, güncelleme, Node.js, sürüm yükseltmesi, yükleme]
---

# PM2 Güncellemeleri

PM2'yi güncellemek son derece hızlıdır (birkaç saniyeden az) ve sorunsuzdur.

### PM2'yi güncelleme süreci

En son PM2 sürümünü yükleyin:

```bash
npm install pm2 -g
```

Artık PM2 daemon'unu bellek üzerinden güncelleyebilirsiniz:

```bash
pm2 update
```

:::tip
PM2'yi güncel tutmak, uygulamalarınızın performansını artırmak için önemlidir. Gereksinimlerinize bağlı olarak düzenli olarak kontrol edin.
:::

### Node.js sürüm yükseltmesi

Node.js kurulumunuzu yükseltirken, PM2'yi başlatan Node.js sürümünü de güncellediğinizden emin olun.

:::info
Node.js sürümünüzü güncellemek, PM2'nin en iyi performansı elde etmesine yardımcı olur. Her iki bileşeni de uyumlu şekilde güncellediğinizden emin olun.
:::

PM2 başlatma betiğini güncellemek için şu komutları çalıştırın:

```bash
$ pm2 unstartup
$ pm2 startup
```

> **Not:** "pm2 unstartup" komutunu çalıştırarak mevcut başlatma betiğini kaldırdıktan sonra "pm2 startup" ile yeni bir betik oluşturulmalıdır.   
> — Kullanıcı Kılavuzu




Ek Bilgi

PM2 ile ilgili güncelleme süreci bazen belirli sürümlerin spesifik özelliklerine bağlı olarak değişiklik gösterebilir. Bu nedenle, en son belgeleri kontrol etmeniz önerilir.

