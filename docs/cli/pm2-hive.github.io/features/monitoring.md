---
description: Bu bölümde, PM2 ile uygulamaların izlenmesi, CPU ve bellek kullanımıyla ilgili bilgiler sunulmaktadır. PM2.io platformunun avantajları ve bellek eşiği ayarları hakkında da bilgiler bulabilirsiniz. 
keywords: [PM2, izleme, CPU, bellek, Node.js, monitoring, uygulama yönetimi]
---

# CPU / Bellek İzleme

PM2, uygulamanızın kaynak kullanımını izlemek için basit bir yol sunar. **Bellek** ve **CPU**'yu kolayca ve doğrudan terminalinizden izleyebilirsiniz:

```bash
pm2 monit
```

## PM2.io

:::tip
Node.js uygulamanızı PM2 ile yönetiyorsanız, PM2.io denemenizi öneririz. Bu, sunucular arasında uygulamaları izlemeyi ve yönetmeyi her zamankinden daha kolay hale getirir.
:::

Denemekte özgürsünüz:
[PM2 için izleme panosunu keşfedin](https://app.pm2.io/#/register)

## Bellek Eşiği

PM2, bir bellek limitine dayalı olarak bir uygulamayı yeniden yüklemeye (otomatik geri dönüş ile yeniden başlatmaya) olanak tanır. 

:::info
PM2'nin dahili işleyicisinin (belleği kontrol eden ve ilgili olan) her 30 saniyede bir başladığını unutmayın, bu nedenle bellek eşiğine ulaştıktan sonra sürecinizin otomatik olarak yeniden başlaması için bir süre beklemeniz gerekebilir.
:::

Node.js uygulamanızı PM2 ile yönetiyorsanız, PM2.io denemenizi öneririz. Bu, sunucular arasında uygulamaları izlemeyi ve yönetmeyi her zamankinden daha kolay hale getirir.

```bash
pm2 monitor
```

Denemekte özgürsünüz:
[PM2 için izleme panosunu keşfedin](https://app.pm2.io/#/register)

--- 