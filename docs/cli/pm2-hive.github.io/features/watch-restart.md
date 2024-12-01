---
layout: docs
title: İzleme & Yeniden Başlatma
description: Dosya değişikliğinde uygulamaların otomatik olarak yeniden başlatılmasına dair bilgi ve uygulama örnekleri. PM2 kullanarak izleme seçenekleri ve yapılandırmalar hakkında detaylar yer almaktadır.
keywords: [PM2, otomatik yeniden başlatma, izleme, uygulama yapılandırması, dosya değişikliği]
---

# Dosya değişikliğinde uygulamaları otomatik olarak yeniden başlatma

PM2, mevcut dizinde veya alt dizinlerinde bir dosya değiştirildiğinde uygulamanızı otomatik olarak yeniden başlatabilir:

```bash
pm2 start app.js --watch
```

Veya yapılandırma dosyası aracılığıyla `watch: true` seçeneğini ayarlayın.

:::info
Bir uygulama `--watch` seçeneği ile başlatıldığında, uygulamayı durdurmak, dosya değişikliğinde yeniden başlatılmasını engellemeyecektir. İzleme özelliğini tamamen devre dışı bırakmak için: `pm2 stop app --watch` veya uygulama yeniden başlatılırken izleme seçeneğini değiştirin: `pm2 restart app --watch`.
:::

Belirli yolları izlemek için, lütfen bir `Ekosistem Dosyası` kullanın. `watch` bir dize veya bir dizi yol alabilir. Varsayılan değer `true`'dur:

```javascript
module.exports = {
  apps: [{
    script: "app.js",
    watch: ["server", "client"],
    // Yeniden başlatma arasındaki gecikme
    watch_delay: 1000,
    ignore_watch : ["node_modules", "client/img", "\\.git", "*.log"],
  }]
}
``` 

:::tip
**İpucu:** İzlediğiniz dizinleri dikkatlice seçin ve gereksiz dosyaları `ignore_watch` altında belirtin. Bu durum uygulamanızın performansını olumlu yönde etkileyebilir.
:::

```quote
"PM2 ile izleme, uygulamanızın gelişmiş bir kullanıcı deneyimi sunmasına yardımcı olur."  
— PM2 Dokümantasyonu
```