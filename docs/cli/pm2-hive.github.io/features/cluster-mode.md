---
description: Node.js için Küme Modu, mevcut CPU'lar üzerinde ölçeklendirme sağlar. Uygulamalarınızın performansını artırırken, kod değişikliğine gerek olmadan, güvenilirliğini de artırır.
keywords: [Node.js, küme modu, uygulama ölçeklendirme, PM2, üretim ortamı]
---

# Küme Modu

**Küme modu**, ağa bağlı Node.js uygulamalarının (http(s)/tcp/udp sunucu) mevcut tüm CPU'lar üzerinde ölçeklendirilmesini sağlar, herhangi bir kod değişikliği yapmadan. Bu, mevcut CPU sayısına bağlı olarak uygulamalarınızın performansını ve güvenilirliğini büyük ölçüde artırır. Altyapıda, bu, Node.js [küme modülünü](https://nodejs.org/api/cluster.html) kullanarak ölçeklendirilmiş uygulamanın çocuk süreçlerinin otomatik olarak sunucu portlarını paylaşmasına olanak tanır. Daha fazla bilgi için resmi Node.js belgelerinde [Nasıl Çalışır](https://nodejs.org/api/cluster.html#cluster_how_it_works) bölümüne bakın.

![http://i.imgur.com/kTAowsL.png](http://i.imgur.com/kTAowsL.png)

## Kullanım

**Küme modunu** etkinleştirmek için, -i  seçeneğini geçirin:

```bash
pm2 start app.js -i max
```

`max` ifadesi, PM2'nin mevcut CPU sayısını otomatik olarak algılayacağı ve mümkün olan en fazla süreci çalıştıracağı anlamına gelir.

Ya da bir [js/yaml/json dosyası](http://pm2.keymetrics.io/docs/usage/application-declaration/) aracılığıyla:

```javascript
module.exports = {
  apps : [{
    script    : "api.js",
    instances : "max",
    exec_mode : "cluster"
  }]
}
```

:::warning
**NOT**: exec_mode'u `cluster` olarak ayarlamanız gerekir, böylece PM2'nin her örnek arasında yük dengelemesi yapmak istediğinizi bilmesi sağlanır; aksi halde, varsayılan olarak bunu yapmayacaktır.
:::

Ardından İşlem Dosyasını başlatmak için:

```bash
pm2 start processes.json
```

*-i* veya *instances* seçeneği şu şekilde olabilir:
- **0/max** uygulamayı tüm CPU'lar arasında dağıtmak için
- **-1** uygulamayı tüm CPU'lar - 1 arasında dağıtmak için
- **number** uygulamayı **number** CPU arasında dağıtmak için

## Yeniden Yükleme

`restart` işlemi, süreci öldürüp yeniden başlatırken, `reload` **0 saniye kesinti** ile yeniden yükleme sağlar.

Bir uygulamayı yeniden yüklemek için:

```bash
pm2 reload <app_name>
```

Veya:

```bash
pm2 reload process.json
pm2 reload process.json --only api
```

Yeniden yükleme sistemi uygulamanızı yeniden yüklemeyi başaramazsa, bir zaman aşımı klasik yeniden başlatmaya geri döner.

## Nazik Kapatma

Üretim ortamında, kalan sorguların işlenmesini beklemeniz veya uygulamadan çıkmadan önce tüm bağlantıları kapatmanız gerekebilir. *PM2 yeniden yükleme bağlamında* bu, çok uzun bir yeniden yükleme veya çalışmayan bir yeniden yükleme (yeniden başlatmaya geri dönme) anlamına gelebilir; bu, uygulamanızın çıkışta hala açık bağlantıları olduğu anlamına gelir. Alternatif olarak, tüm veritabanı bağlantılarını kapatmanız, veri kuyruklarını temizlemeniz veya başka şeyler yapmanız gerekebilir.

Bir uygulamayı nazikçe kapatmak için **SIGINT** sinyalini yakalayabilir (PM2 tarafından çıkışta gönderilen ilk sinyal) ve bu durumları beklemek/temizlemek için eylemler gerçekleştirebilirsiniz:

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

:::tip
[Nazik Kapatma](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/) özelliği hakkında daha fazla bilgi okuyun.
:::

## Uygulamanızı Durumsuz Hale Getirin

Uygulamanızın [**durumsuz**](http://pm2.keymetrics.io/docs/usage/specifics/#stateless-apps) olduğundan emin olun; bu, süreçte yerel veri saklanmadığı anlamına gelir, örneğin oturumlar/websocket bağlantıları, oturum belleği ve ilgili veriler. Süreçler arasında durumları paylaşmak için Redis, Mongo veya diğer veritabanlarını kullanın.

Verimli, üretime hazır durumsuz bir uygulama yazma hakkında başka bir kaynak [On İki Faktör Uygulaması manifestosu](https://12factor.net/)dır.