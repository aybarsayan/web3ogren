---
description: RPC yöntemlerini açığa çıkararak gerçek zamanlı olarak süreçlerle etkileşimde bulunmanızı sağlar. Kullanım örnekleri ve temel bilgiler içerir.
keywords: [RPC, tx2, işlem eylemleri, PM2, uygulama geliştirme]
---

# RPC Yöntemlerini Açığa Çıkar: İşlem Eylemleri

RPC Yöntemlerini açığa çıkarmak, çalışan bir süreçle gerçek zamanlı olarak etkileşimde bulunmanızı sağlar.

Bu, aşağıdaki durumlar için faydalıdır:
- Davranışı değiştirmek (örn. günlüğü hata ayıklamaya geçirmek)
- Veri yapısını almak
- Eylemleri tetiklemek

### Hızlı Başlangıç

Öncelikle [tx2](https://github.com/pm2/tx2) modülünü yükleyin:

```bash
$ npm install tx2
```

Ardından `rpc.js` adında bir uygulama oluşturun:

```javascript
const tx2 = require('tx2')

tx2.action('hello', (reply) => {
  reply({ answer : 'world' })
})

setInterval(function() {
  // Uygulamayı çevrimiçi tut
}, 100)
```

Ve PM2 ile başlatın:

```bash
$ pm2 start rpc.js
```

Şimdi işlem eylemlerini tetiklemek için şu komutu kullanın:

```bash
$ pm2 trigger <uygulama-adı> <eylem-adı>
# pm2 trigger rpc hello
```

### Mevcut RPC yöntemlerini listeleme

Tüm mevcut RPC yöntemlerini listelemek için:

```bash
pm2 show <uygulama-adı>
# pm2 show rpc
```

### Bir parametre geçme

Uzak fonksiyona bir parametre geçmek için yalnızca geri çağırmaya `param` niteliğini ekleyin:

```javascript
var tx2 = require('tx2')

tx2.action('world', function(param, reply) {
  console.log(param)
  reply({success : param})
})
```

Uygulamanızı yeniden başlatın ve bu işlem fonksiyonunu PM2 ile çağırın:

```bash
pm2 trigger <uygulama-adı> <eylem-adı> [parametre]
# pm2 trigger rpc world somedata
```

:::tip
Uygulamanızdaki hataları azaltmak için, her RPC yöntemini dikkatlice test edin.
:::

### Web Kontrol Panelinden Tetikleme

Uygulamanızdan açığa çıkarılan tüm RPC yöntemleri, [pm2.io](https://app.pm2.io) ile bağlandığınızda bir web arayüzünden görüntülenecek ve işlem yapılabilir hale gelecektir.

## TX2 API Belgeleri

[https://github.com/pm2/tx2/blob/main/API.md](https://github.com/pm2/tx2/blob/main/API.md)