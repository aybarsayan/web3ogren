---
layout: docs
title: Docker Entegrasyonu
description: Docker içinde kesintisiz PM2 entegrasyonu. Bu belge, Node.js uygulamalarının Docker konteynerlerinde nasıl etkin bir şekilde yönetileceğini ve PM2'nin sağladığı avantajları ele almaktadır.
keywords: [Docker, PM2, Node.js, konteyner, uygulama yönetimi, üretim ortamı]
---


# Docker Entegrasyonu

Konteyner mi kullanıyorsunuz? Sizi destekliyoruz. Bugün **pm2-runtime** kullanmaya başlayın; bu, Node.js'i üretim ortamında en iyi şekilde kullanmanız için mükemmel bir ortaktır.

pm2-runtime'ın amacı, uygulamalarınızı uygun bir Node.js üretim ortamına sarmaktır. Bu, bir konteyner içinde Node.js uygulamaları çalıştırırken yaşanan önemli sorunları çözer:

- Yüksek Uygulama Güvenirliği için İkinci Süreç Yedekliliği
- Süreç Akış Kontrolü
- Daima sağlıklı ve yüksek performanslı kalmasını sağlamak için Otomatik Uygulama İzleme
- Otomatik Kaynak Haritası Keşfi ve Çözümleme Desteği

:::tip
**Not:** PM2'yi konteyner ile uygulama arasında bir katman olarak kullanmak, PM2'nin güçlü özelliklerini getirir, örneğin uygulama deklarasyon dosyası, özelleştirilebilir günlük sistemi ve diğer harika özellikler, Node.js uygulamanızı üretim ortamında yönetmenize yardımcı olur.
:::

## Konteynerler İçinde PM2 Kullanma

Dockerfile'ınıza PM2'yi kurmak için bu satırı ekleyin:

```
RUN npm install pm2 -g
```

Ardından `node` ikilisini `pm2-runtime` ile değiştirebilirsiniz.

```
CMD ["node", "app.js"]
```

şu şekilde:

```
CMD ["pm2-runtime", "app.js"]
```

**Artık her şey hazır!** Node.js uygulamanız uygun bir Node.js üretim ortamına sarmalanmış durumda.

### Konfigürasyon Dosyası Başlatma

PM2 ile ham Node.js uygulamanızı çalıştırmak yerine, bunu bir konfigürasyon dosyasında (veya süreç dosyasında) tanımlayabilir ve küme modunu etkinleştirmek gibi bazı konfigürasyon değişkenleri ayarlayabilirsiniz.

Aşağıdaki içeriğe sahip bir ecosystem.config.js dosyası oluşturalım:

```javascript
module.exports = [{
  script: 'app.js',
  name: 'app',
  exec_mode: 'cluster',
  instances: 2
}, {
  script: 'worker.js',
  name: 'worker'
}]
```

Tüm mevcut seçenekler `burada listelenmiştir`.

Daha sonra **CMD** direktifini şu şekilde değiştirebilirsiniz:

```
CMD ["pm2-runtime", "process.yml"]
```

Her bir süreci kendi Docker'ında ayırmak için `--only [app-name]` seçeneğini kullanabilirsiniz:

```
CMD ["pm2-runtime", "process.yml", "--only", "APP"]
```

### exec_mode kümesi ile nuxtjs kullanma

pm2'yi küme modunda çalıştırdığınızda, `ecosystem.config.js` cwd yolunuza eklenecektir; çünkü nuxtjs kök dizinini böyle çözümler. Bunu düzeltmek için args bölümünde konfigürasyon yolunu belirtmeniz gerekir:

```javascript
module.exports = {
  apps: [
    {
      name: 'my-nuxtjs-app',
      exec_mode: 'cluster',
      instances: 2,
      cwd: '/var/www',
      script: './node_modules/nuxt-start/bin/nuxt-start.js',
      args: '-c /var/www/nuxt.config.js'
    }
  ]
}
```

### Günlük Format Seçeneği

Günlük çıktı formatını değiştirmek isterseniz bu seçeneklerden birini seçebilirsiniz:

- **--json**: günlüklere JSON formatında (logstash) çıktı verecektir
- **--format**: günlüklere = stil formatında çıktı verecektir
- **--raw**: günlüklere olduğu gibi çıktı verecektir

Bu bayraklardan birini kullanmak için, sadece pm2-runtime'a iletmeniz yeterlidir:

```
CMD ["pm2-runtime", "--json", "process.yml"]
```

### Nazik Kapatmayı Etkinleştirme

Konteyner bir kapanma sinyali aldığında, PM2 bu sinyali uygulamanıza ileterek tüm veritabanı bağlantılarını kapatmanıza, tüm sorguların işlenmesini beklemenize veya başarılı bir nazik kapanmadan önce tamamlanması gereken diğer işlemler için zamanı tanımasına olanak tanır.

Kapanma sinyalini yakalamak basit bir işlemdir. Node.js uygulamalarınızda bir dinleyici eklemeniz ve uygulamayı durdurmadan önce gerekli olan her şeyi yürütmeniz gerekir:

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

Varsayılan olarak PM2, son bir SIGKILL sinyali göndermeden önce 1600 ms bekleyecektir. Bu gecikmeyi, uygulama konfigürasyon dosyanız içindeki `kill_timeout` seçeneğini ayarlayarak değiştirebilirsiniz.

Uygulama durumu yönetimi hakkında daha fazla bilgi edinmek için `buraya` göz atın.

### Geliştirme Ortamı

Geliştiricilere, geliştirme, test ve üretim arasındaki tutarlılığı sağlamak için bir konteyner içinde program yapmalarını söylemek isteyebilirsiniz.

**pm2-runtime**'yi **pm2-dev** ile değiştirmek, izleme ve yeniden başlatma özelliklerini etkinleştirecektir. Bu, ana makine dosyalarının konteynere VOLUME olarak açıldığı bir geliştirme konteynerinde oldukça ilginçtir.

### PM2.io Kullanımı

[Keymetrics.io](https://keymetrics.io/) , uygulamaların kolayca izlenmesi ve yönetilmesi için PM2'nin üzerine inşa edilmiş bir izleme hizmetidir (günlükler, yeniden başlatmalar, istisna izleme...). Keymetrics'te bir Bucket oluşturduktan sonra, bir genel anahtar ve bir gizli anahtar alacaksınız.

Keymetrics izlemeyi **pm2-runtime** ile etkinleştirmek için, ya CLI seçeneği **--public XXX** ve **--secret YYY**'yi kullanabilir veya ortam değişkenleri **KEYMETRICS_PUBLIC** ve **KEYMETRICS_SECRET**'i iletebilirsiniz.

Dockerfile aracılığıyla CLI seçenekleriyle örnek:

```
CMD ["pm2-runtime", "--public", "XXX", "--secret", "YYY", "process.yml"]
```

Veya ortam değişkenleri aracılığıyla:

```
ENV PM2_PUBLIC_KEY=XXX
ENV PM2_SECRET_KEY=YYY
```

Veya Docker çalıştırma komutuyla:

```
docker run --net host -e "PM2_PUBLIC_KEY=XXX" -e "PM2_SECRET_KEY=XXX" <...>
```

## pm2-runtime Yardımcı Programı

İşte pm2-runtime yardımcı programı:

```
>>> pm2-runtime -h

  Kullanım: pm2-runtime app.js

  pm2-runtime, bazı ilginç üretim özelliklerine sahip bir drop-in node.js ikilisidir

  Seçenekler:

    -V, --version              sürüm numarasını görüntüler
    -i --instances <sayı>      otomatik olarak yük dengelemeli [sayı] süreç başlatır. Genel performansı ve performans istikrarını artırır.
    --secret [anahtar]         [İZLEME] keymetrics gizli anahtarı
    --public [anahtar]         [İZLEME] keymetrics genel anahtarı
    --machine-name [isim]      [İZLEME] keymetrics makine adı
    --raw                      ham günlük çıktısı
    --json                     günlüklere json formatında çıktı verir
    --format                   günlüklere key=val benzeri formatta çıktı verir
    --delay <saniye>          konfigürasyon dosyasını <saniye> geciktir
    --web [port]               işlem web API'sini [port] üzerinde başlatır (varsayılan 9615'tir)
    --only <uygulama adı>     konfigürasyonun yalnızca bir uygulamasında işlem yapar
    --no-auto-exit             tüm süreçlerin hatalı/durdurulmuş veya 0 uygulama başlatıldığında çıkılmaz
    --env [isim]               süreç konfigürasyon dosyasına env_[isim] çevresel değişkenleri enjekte eder
    --watch                    dosya değiştiğinde uygulamayı izler ve yeniden başlatır
    --error <yol>             hata günlük dosyasının hedefi (varsayılan devre dışı bırakılmış)
    --output <yol>            çıktı günlük dosyasının hedefi (varsayılan devre dışı bırakılmış)
    -h, --help                 kullanım bilgilerini görüntüler


  Komutlar:

    *
    start <app.js|json_file>  bir uygulamayı veya json ekosistem dosyasını başlat