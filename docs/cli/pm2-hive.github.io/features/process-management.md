---
layout: docs
title: Proses Yönetimi
description: Bu belge, PM2 kullanarak uygulamaların arka planda nasıl yönetileceğini ve çeşitli komutlarla nasıl kontrol edileceğini kapsamlı bir şekilde açıklamaktadır. Uygulamaları başlatma, yeniden başlatma, durdurma ve listeleme gibi işlemleri gerçekleştirmek için gerekli adımları içerir.
keywords: [PM2, uygulama yönetimi, arka planda çalıştırma, yeniden başlatma, durdurma, listeleme]
---

# Uygulamaların durumunu yönetme

PM2 ile arka planda uygulamaları kolayca başlatabilir/yeniden başlatabilir/yükleyebilir/durdurabilir/listeleyebilirsiniz.

### Başlat

Bir uygulamayı başlatmak için:

```bash
$ pm2 start api.js
```

![](https://user-images.githubusercontent.com/757747/123512784-b0341900-d689-11eb-93d4-69510ee2be27.png)

Ayrıca bash komutları, scriptler, ikili dosyalar gibi her türlü uygulamayı da başlatabilirsiniz:

```bash
$ pm2 start "npm run start"
$ pm2 start "ls -la"
$ pm2 start app.py
```

#### Uygulamayı başlat ve günlük akışını göster

Bir uygulamayı başlatıp günlük akışını kontrol etmek için `--attach` seçeneğini kullanın:

```bash
$ pm2 start api.js --attach
```

Ctrl-C ile çıkıldığında, uygulama arka planda çalışmaya devam eder.

:::tip
Uygulamaları izlemek için `--attach` seçeneğini kullanarak, günlük akışını anında görüntülemeyi unutmayın.
:::

#### Argüman geçirme

`--` sonrasına geçen tüm seçenekler uygulamaya argüman olarak geçilecektir:

```bash
$ pm2 start api.js -- arg1 arg2
```

#### Yapılandırma Dosyası

Birden fazla uygulamayı aynı anda yönetirken veya birden fazla seçeneği belirtmeniz gerektiğinde, bir yapılandırma dosyası kullanabilirsiniz. Bu ecosystem.config.js dosyası ile bir örnek:

```javascript
module.exports = {
  apps : [{
    name   : "limit worker",
    script : "./worker.js",
    args   : "limit"
  },{
    name   : "rotate worker",
    script : "./worker.js",
    args   : "rotate"
  }]
}
```

Her iki uygulamayı başlatmak için:

```bash
$ pm2 start ecosystem.config.js
```

Daha fazlasını `yapılandırma dosyası hakkında` okuyun.

### Yeniden Başlat

Bir uygulamayı yeniden başlatmak için:

```bash
$ pm2 restart api
```

Tüm uygulamaları yeniden başlatmak için:

```bash
$ pm2 restart all
```

Birden fazla uygulamayı aynı anda yeniden başlatmak için:

```bash
$ pm2 restart app1 app3 app4
```

:::info
Ortam değişkenlerini veya PM2 seçeneklerini güncellemek için `--update-env` CLI seçeneğini kullanmayı düşünün.
:::

#### Ortam değişkenlerini ve seçenekleri güncelleme

Ortam değişkenlerini veya PM2 seçeneklerini güncellemek için `--update-env` CLI seçeneğini belirtin:

```bash
$ NODE_ENV=production pm2 restart web-interface --update-env
```

### Durdur

Belirtilen bir uygulamayı durdurmak için:

```bash
$ pm2 stop api
$ pm2 stop [process_id]
```

Hepsini durdurmak için:

```bash
$ pm2 stop all
```

Birden fazla uygulamayı aynı anda durdurmak için:

```bash
$ pm2 stop app1 app3 app4
```

:::warning
Not: Bu, uygulamayı PM2 uygulama listesinden silmez. Bir uygulamayı silmek için sonraki bölüme bakın.
:::

### Sil

Bir uygulamayı durdurup silmek için:

```bash
$ pm2 delete api
```

Hepsini silmek için:

```bash
$ pm2 delete all
```

## Uygulamaları Listeleme

Çalışan tüm uygulamaları listelemek için:

```bash
$ pm2 list
# Veya
$ pm2 [list|ls|l|status]
```

![](https://user-images.githubusercontent.com/757747/123511260-a3f78e00-d680-11eb-8907-3f1017ef7dc8.png)

Uygulamanın hangi sırada listeleneceğini belirtmek için:

```bash
$ pm2 list --sort name:desc
# Veya
$ pm2 list --sort [name|id|pid|memory|cpu|status|uptime][:asc|desc]
```

### Terminal Gösterimi

PM2, uygulamanızın kaynak kullanımını izlemek için basit bir yol sunar. Belleği ve CPU'yu kolayca izleyebilirsiniz ve doğrudan terminalinizden:

```bash
pm2 monit
```


<img src="../../images/cikti/pm2-hive.github.io/images/pm2-monit.png" title="PM2 Monit"/>


### Uygulama metadata'sını gösterme

Bir uygulama hakkında metadata'yı görüntülemek için:

```bash
$ pm2 show api
```

<img src="https://user-images.githubusercontent.com/757747/123510635-fafb6400-d67c-11eb-8534-0ce6106979b2.png" alt="çizim" width="600"/>

### Yeniden başlatma sayısını sıfırlama

Yeniden başlatma sayacını sıfırlamak için:

```bash
$ pm2 reset all
```