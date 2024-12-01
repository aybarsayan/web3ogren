---
description: PM2'yi uygulamanıza entegre edin veya etkileşimde bulunun. Bu kılavuz, PM2 API'sini kullanarak süreçlerinizi nasıl yönetebileceğinizi detaylandırmaktadır.
keywords: [PM2, API, süreç yönetimi, Node.js, uygulama kontrolü]
---

# PM2 API

PM2, koddan doğrudan süreçleri yönetmenizi sağlayacak şekilde programlı bir şekilde kullanılabilir.

## Hızlı Başlangıç

:::tip
PM2 ile bağlantıyı kesmek ve uygulamanızın otomatik çıkmasını sağlamak için `pm2.disconnect()` ile PM2'den bağlantıyı kesin.
:::

Öncelikle PM2'yi bir bağımlılık olarak ekleyin:

```bash
npm install pm2 --save
```

Ardından bu içeriği içeren app.js ve pm2-control.js adında bir betik oluşturun:

```javascript
const pm2 = require('pm2')

pm2.connect(function(err) {
  if (err) {
    console.error(err)
    process.exit(2)
  }

  pm2.start({
    script    : 'api.js',
    name      : 'api'
  }, function(err, apps) {
    if (err) {
      console.error(err)
      return pm2.disconnect()
    }

    pm2.list((err, list) => {
      console.log(err, list)

      pm2.restart('api', (err, proc) => {
        // PM2'dan bağlantıyı keser
        pm2.disconnect()
      })
    })
  })
})
```

- Bu, yerel PM2'yi başlatır veya ona bağlanır.
- Ardından app.js'yi **api** adı ile başlatır.
- PM2 ile yönetilen tüm uygulamaları görüntüler.
- Ardından **api** adlı uygulamayı yeniden başlatır.
- Ve PM2'dan bağlantıyı keser.

---

### API Metotları

#### pm2.connect([no_daemon_mode], fn)

Yerel PM2'ye bağlanır veya yeni bir PM2 örneği oluşturur.

|    Param |   Type  | Default |   Açıklama|
|:----------|:-------:|:---------:|:------------------|
|[no_daemon_mode]    | boolean   | false | true ise, bağımsız bir PM2 çalışacaktır ve sonunda otomatik çıkacaktır|
|fn    | function   | | Geri çağırma|

* noDaemonMode: İlk argüman olarak true verilirse, pm2 daemon olarak çalışmayacak ve ilgili betik çıkarken sona erecektir. Varsayılan olarak, pm2 betiğiniz çıkınca hayatta kalır. PM2 zaten çalışıyorsa, betiğiniz mevcut daemona bağlanacaktır ancak süreciniz çıkınca sona erecektir.

* `script` - Çalıştırılacak betiğin yolu.
* `jsonConfigFile` - `options` parametresiyle aynı seçenekleri içerebilecek bir JSON dosyasının yolu.
* `errback(err,proc)` - `script` başlatıldığında çağrılan bir hatalı geri çağırma. `proc` parametresi bir [pm2 process object](https://github.com/soyuka/pm2-notify#templating) olacaktır.

:::info
Aşağıdaki seçeneklerle bir nesne sağlayabilirsiniz. Ek açıklamalar için [buraya](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload) göz atın.
:::

- `name` - Daha sonra diğer komutlarda sürece etkileşim için kullanılabilecek rastgele bir ad. Varsayılan olarak, bu, uzantısı olmadan betik adıyla aynı adı alır (örneğin `"testScript"` için `"testScript.js"`).
- `script` - Çalıştırılacak betiğin yolu.
- `args` - Betiğe iletilmesi gereken argümanlardan oluşan bir dize veya dizi.

### API Metotları Devamı

#### pm2.start(process, fn)

Bir süreci başlat

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|process    | string/object   | betik yolu (göreceli) veya `options` üzerinden nesne |
|fn    | function   | Geri çağırma|

#### pm2.stop(process, fn)

Bir süreci durdur

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|process    | string/number   | hedef süreç ID veya isim |
|fn    | function   | Geri çağırma|

#### pm2.restart(process, [options], fn)

Bir süreci yeniden başlat

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|process    | string/number   | hedef süreç ID veya isim |
|[options]  | object | `options` (güncellemeleri zorlamak için updateEnv: true de ekleyin)|
|fn    | function   | Geri çağırma|

#### pm2.reload(process, fn)

Bir süreci yeniden yükle

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|process    | string/number   | hedef süreç ID veya isim |
|fn    | function   | Geri çağırma|

#### pm2.delete(process, fn)

Bir süreci sil

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|process    | string/number   | hedef süreç ID veya isim |
|fn    | function   | Geri çağırma|

:::warning
pm2 daemon'ı öldürdüğünüzde, tüm süreçleri de öldürülür. Ayrıca, onu öldürdükten sonra açıkça bağlantıyı kesmeniz gerektiğini unutmayın.
:::

#### pm2.describe(process, fn)

Hedef süreçten tüm meta verileri alın

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|process    | string/number   | hedef süreç ID veya isim |
|fn    | function   | Geri çağırma|

#### pm2.list(fn)

PM2 ile yönetilen tüm süreçleri al

---

### Gelişmiş Metotlar

#### pm2.sendDataToProcessId(packet)

Hedef sürece veri gönderin.

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|packet.id    | number   | hedef süreç ID |
|packet.type    | string   | **process:msg** olmalıdır |
|packet.topic  | boolean | **true** olmalıdır |
|packet.data   | object | hedef sürece gönderilecek nesne verisi |

Veri, hedef süreç tarafından aşağıdaki gibi alınacaktır:

```javascript
process.on('message', function(packet) {})
```

#### pm2.launchBus(fn)

Bu, PM2 ile yönetilen süreçten mesaj almanızı sağlar.

```javascript
const pm2 = require('pm2')

pm2.launchBus(function(err, pm2_bus) {
  pm2_bus.on('process:msg', function(packet) {
    console.log(packet)
  })
})
```

PM2 ile yönetilen bir süreçten:

```javascript
process.send({
  type : 'process:msg',
  data : {
    success : true
  }
})
```

#### pm2.sendSignalToProcessName(signal, process, fn)

Hedef süreç adına özel sistem sinyali gönderin

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|signal    | string   | sistem sinyali adı  |
|process    | string   | hedef süreç ismi |
|fn   | function | Geri çağırma(err, process) |

#### pm2.sendSignalToProcessId(signal, process, fn)

Hedef süreç ID'sine özel sistem sinyali gönderin

|    Param |   Type  |    Açıklama |
|----------|---------|----------------|
|signal    | string   | sistem sinyali adı  |
|process    | number   | hedef süreç ID |
|fn   | function | Geri çağırma(err, process) |

### Süreç yapısı

Yukarıdaki yöntemlerden herhangi birini çağırdığınızda, değiştirilmiş bir süreç dizisi döndürülür.

* **processDescription** - Süreç hakkında bilgi içeren nesnelerin bir dizisi. Her nesne şu özellikleri içerir:
  * **name** - Orijinal **start** komutunda verilen ad.
  * **pid** - Sürecin pid'si.
  * **pm_id** - **pm2** God daemon süreçlerinin pid'si.
  * **monit** - Aşağıdakileri içeren bir nesne:
    * **memory** - Sürecin kullandığı byte sayısı.
    * **cpu** - Sürecin o anda kullandığı CPU yüzdesi.
  * **pm2_env** - Sürecin ortamında bulunan yol değişkenleri. Bu değişkenler şunları içerir:
    * **pm_cwd** - Sürecin çalışma dizini.
    * **pm_out_log_path** - stdout günlük dosyası yolu.
    * **pm_err_log_path** - stderr günlük dosyası yolu.
    * **exec_interpreter** - Kullanılan yorumlayıcı.
    * **pm_uptime** - Sürecin çalışma süresi.
    * **unstable_restarts** - Sürecin geçtiği kararsız yeniden başlatma sayısı.
    * **status** - "online", "stopping", "stopped", "launching", "errored" veya "one-launch-status".
    * **instances** - Çalışan örnek sayısı.
    * **pm_exec_path** - Bu süreçte çalıştırılan betiğin yolu.

---

### Örnekler

#### Sürece mesaj gönder

pm2-call.js:

```javascript
const pm2 = require('pm2')

pm2.connect(function() {
  pm2.sendDataToProcessId({
    // "pm2 list" komutundan veya pm2.list(errback) yönteminden süreç id'si
    id   : 1,

    // process:msg hedef sürece 'message' olarak gönderilecektir
    type : 'process:msg',

    // Gönderilecek veri
    data : {
      some : 'data'
    }
  }, function(err, res) {
  })
})

// Uygulamadan gelen mesajları dinleyin
pm2.launchBus(function(err, pm2_bus) {
  pm2_bus.on('process:msg', function(packet) {
    console.log(packet)
  })
})
```

pm2-app.js:

```javascript
process.on('message', function(packet) {
  process.send({
    type : 'process:msg',
    data : {
     success : true
    }
  });
});
``` 