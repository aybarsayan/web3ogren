---
description: PM2, uygulama geliştirme sürecini kolaylaştıran bir araçtır. Bu doküman, PM2 ile uygulama başlatma ve dosya değişikliklerinde yeniden başlatma süreçlerini açıklamaktadır.
keywords: [PM2, uygulama geliştirme, dosya değişikliği, pm2-dev, geliştirme aracı]
---

# PM2'de Geliştirme Yapımı

PM2, bir uygulamayı başlatmanıza ve dosya değişikliğinde yeniden başlatmanıza olanak tanıyan kullanışlı bir geliştirme aracı ile birlikte gelir:

:::tip
**İpucu:** Uygulamanızı geliştirme modunda başlatmak için PM2 kullanarak daha verimli bir çalışma ortamı oluşturabilirsiniz.
:::

```bash
# Uygulamanızı geliştirme modunda başlatın
# günlükleri yazdırır ve dosya değişikliğinde yeniden başlatır

# Uygulamanızı çalıştırmanın iki yolu:
pm2-dev start my-app.js

# veya

pm2-dev my-app.js
```

:::info
**Not:** `pm2-dev` komutu, değişiklikleri algılayarak uygulamanızı otomatik olarak yeniden başlatacak şekilde tasarlanmıştır.
:::

Uygulama geliştirme sürecinizi hızlandırmak için aşağıdaki öneriler geçerli olabilir:

- **Uygulamanızı mümkün olan en kısa sürede test edin.**
- **Geliştirme sırasında sık sık kayıt tutun.**
  
--- 

Bu araç ile geliştirme sürecinizde daha fazla verim elde edebilirsiniz.