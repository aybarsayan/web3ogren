---
description: Bu belge, PM2 ile bellek sınırına dayalı uygulama yeniden yükleme işlemlerini nasıl gerçekleştireceğinizi açıklar. Ayrıca, yapılandırma seçenekleri ve komut satırı kullanımı hakkında bilgiler sunar.
keywords: [PM2, bellek sınırı, uygulama yeniden yükleme, otomatik yeniden başlatma, yapılandırma dosyası]
---

# Bellek Sınırlama

## Maks Bellek Eşiği Otomatik Yeniden Yükleme

:::info
PM2, bir bellek sınırına dayalı olarak bir uygulamayı yeniden yüklemeye olanak tanır. Kümelenme yoksa otomatik olarak yeniden başlatmaya geri dönebilir.
:::

PM2, bir uygulamanın belirli bir bellek eşiğine ulaştığında otomatik olarak yeniden yüklenmesini sağlayarak kaynak yönetimini kolaylaştırır. Lütfen **PM2'nin bellek kontrol eden dahili iş aracının** her 30 saniyede bir başladığını unutmayın; bu nedenle bellek eşiğine ulaştıktan sonra sürecinizin otomatik olarak yeniden başlatılmasını beklemeniz gerekebilir.

#### CLI Kullanımı

```bash
pm2 start api.js --max-memory-restart 300M
```

#### Konfigürasyon dosyası (ecosystem.config.js)

```bash
module.exports = {
  apps: [{
    name: 'api',
    script: 'api.js',
    max_memory_restart: '300M'
  }]
}
```

Not: Birimler K(ilobayt), M(egabayt), G(igabayt) olabilir.