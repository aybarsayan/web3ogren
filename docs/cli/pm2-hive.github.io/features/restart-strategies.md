---
description: Uygulamayı doğru bir şekilde yeniden başlatmak için farklı stratejiler ve yöntemler hakkında bilgi.
keywords: [PM2, yeniden başlatma stratejileri, cron, bellek tabanlı, otomatik yeniden başlatma]
---

# Yeniden Başlatma Stratejileri

PM2 ile uygulama başlatıldığında, uygulamalar otomatik olarak otomatik çıkış, olay döngüsü boş (node.js) veya uygulama çökmesi durumunda yeniden başlatılır. Ancak, ek yeniden başlatma stratejileri de yapılandırabilirsiniz, örneğin:

- Belirli bir CRON zamanında uygulamayı yeniden başlatma
- Dosyalar değiştiğinde uygulamayı yeniden başlatma
- Uygulama bir bellek eşiğine ulaştığında yeniden başlatma
- Başlama gecikmesi ve otomatik yeniden başlatma
- Otomatik yeniden başlatmayı devre dışı bırakma (uygulamalar varsayılan olarak çökme veya çıkma durumunda her zaman PM2 ile yeniden başlatılır)
- Uygulamayı belirli bir üstel artış süresinde otomatik olarak yeniden başlatma

---

## Cron Zamanında Yeniden Başlatma

:::tip
Cron zamanında yeniden başlatmalar, belirli zaman dilimlerinde uygulamanızı güncellemek için faydalıdır.
:::

CLI vasıtasıyla:

```bash
$ pm2 start app.js --cron-restart="0 0 * * *"
# Veya bir uygulamayı yeniden başlatırken
$ pm2 restart app --cron-restart="0 0 * * *"
```

Yapılandırma dosyası aracılığıyla `cron_restart` özelliğini kullanın:

```bash
module.exports = {
  apps : [{
    name: 'Business News Watcher',
    script: 'app.js',
    instances: 1,
    cron_restart: '0 0 * * *',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
```

Cron yeniden başlatmayı devre dışı bırakmak için:

```bash
pm2 restart app --cron-restart 0
```

---

## Dosya Değiştiğinde Yeniden Başlatma

PM2, mevcut dizinde veya alt dizinlerinde bir dosya değiştirildiğinde uygulamanızı otomatik olarak yeniden başlatabilir:

CLI vasıtasıyla:

```bash
$ pm2 start app.js --watch
```

:::note
`--watch` seçeneği ile başlatılan bir uygulama durdurulduğunda, dosya değiştiğinde yeniden başlatılmayacaktır.
:::

Yapılandırma dosyası aracılığıyla `watch: true` özelliğini kullanın:

```javascript
module.exports = {
  script: "app.js",
  watch: true
}
```

Değişiklik izlemek için hangi klasörün izleneceğini, hangi klasörün yoksayılacağını ve izleme dosyalarının aralığını bu seçeneklerle belirtebilirsiniz:

```javascript
module.exports = {
  script: "app.js",
  // Hangi klasörün izleneceğini belirtin
  watch: ["server", "client"],
  // İzleme aralığı arasındaki gecikmeyi belirtin
  watch_delay: 1000,
  // Hangi klasörün yoksayılacağını belirtin 
  ignore_watch : ["node_modules", "client/img"],
}
```

---

## Bellek Tabanlı Yeniden Başlatma Stratejisi

PM2, bir bellek sınırına dayalı olarak (kümelenme yoksa otomatik olarak yeniden başlatmaya geri dönüş) bir uygulamayı yeniden yüklemeye olanak tanır. 

:::warning
PM2 iç işleyicisinin (belleği kontrol eden) her 30 saniyede bir başladığını unutmayın, bu nedenle bellek eşiğine ulaştıktan sonra işleminizin otomatik olarak yeniden başlatılmasını beklemeniz gerekebilir.
:::

CLI:

```bash
$ pm2 start api.js --max-memory-restart 300M
```

Yapılandırma dosyası aracılığıyla `max_memory_restart` özelliğini kullanın:

```javascript
module.exports = {
  script: 'api.js',
  max_memory_restart: '300M'
}
```

Not: Birimler K(ilobyte) (örn. `512K`), M(egabyte) (örn. `128M`), G(igabyte) (örn. `1G`) olabilir.

---

## Yeniden Başlatma Gecikmesi

Yeniden Başlatma Gecikmesi stratejisi ile otomatik yeniden başlatma arasında bir gecikme ayarlayın:

CLI:

```bash
$ pm2 start app.js --restart-delay=3000
```

Yapılandırma dosyası aracılığıyla `restart_delay` özelliğini kullanın:

```javascript
module.exports = {
  script: 'app.js',
  restart_delay: 3000
}
```

---

## Otomatik Yeniden Başlatma Yok

Bu, 1 kez çalıştırılacak komut dosyalarını çalıştırmak istediğimiz ve işlem yöneticisinin komut dosyamızı tamamladıktan sonra yeniden başlatmasını istemediğimiz durumlar için yararlıdır.

CLI:

```bash
$ pm2 start app.js --no-autorestart
```

Yapılandırma dosyası aracılığıyla `autorestart` özelliğini kullanın:

```javascript
module.exports = {
  script: 'app.js',
  autorestart: false
}
```

---

## Belirli Çıkış Kodları İçin Otomatik Yeniden Başlatmayı Atlama

Bazen uygulamanın başarısızlık durumunda otomatik olarak yeniden başlamasını (yani, sıfırdan farklı çıkış kodu) istediğinizde, işlem yöneticisinin uygulamayı düzgün kapandığında yeniden başlatmasını istemeyebilirsiniz.

Bu durumda PM2'yi `stop_exit_codes` seçeneği ile otomatik yeniden başlatmayı atlamak için çıkış kodları ile kullanabilirsiniz:

CLI:

```bash
$ pm2 start app.js --stop-exit-codes 0
```

Yapılandırma dosyası aracılığıyla `stop_exit_codes` özelliğini kullanın:

```javascript
module.exports = [{
  script: 'app.js',
  stop_exit_codes: [0]
}]
```

---

## Üstel Geri Başlatma Gecikmesi

PM2 Runtime'da yeni bir yeniden başlatma modu uygulanmıştır ve bu, uygulamanızın yeniden başlatılmasını daha akıllıca hale getirir. Hatalar meydana geldiğinde uygulamanızı deli gibi yeniden başlatmak yerine, *üstel geri başlatma* art arda yeniden başlatmalar arasındaki süreyi artırır. Kullanımı oldukça kolay:

CLI:

```bash
$ pm2 start app.js --exp-backoff-restart-delay=100
```

Yapılandırma dosyası aracılığıyla `exp_backoff_restart_delay` özelliğini kullanın:

```javascript
module.exports = {
  script: 'app.js',
  exp_backoff_restart_delay: 100
}
```

Bir uygulama beklenmedik şekilde çökerse ve `--exp-backoff-restart-delay` seçeneği etkinleştirilmişse, yeni bir uygulama durumu **yeniden başlamak için bekliyor** göreceksiniz.

:::info
`pm2 logs` komutunu çalıştırarak, yeniden başlatma gecikmesinin artırıldığını da göreceksiniz.
:::
```
