---
description: PM2 ile log yönetimi hakkında kapsamlı bir kılavuz. Logları görüntüleyin, boşaltın ve daha fazlasını öğrenin.
keywords: [PM2, log yönetimi, uygulama logları, log görüntüleme, log boşaltma]
---

# Uygulama Logları

Bir uygulama PM2 ile başlatıldıktan sonra logları kolayca görebilir ve yönetebilirsiniz. Log dosyaları `$HOME/.pm2/logs` klasöründe bulunur.

### Log Görüntüleri

Uygulamanın logunu görüntülemek için `pm2 logs` komutunu kullanabilirsiniz.

```bash
-l --log [path]              hem çıkış hem de hata loglarının çıkacağı dosya yolunu belirtin
-o --output <path>           çıkış log dosyasını belirtin
-e --error <path>            hata log dosyasını belirtin
--time                       logları standart formatlanmış zaman damgasıyla önekleyin
--log-date-format <format>   logları özel formatlanmış zaman damgasıyla önekleyin
--merge-logs                 aynı uygulama adıyla birden fazla işlem çalıştırıldığında dosyayı kimliğe göre ayırmayın
```

Kullanım: logs [seçenekler] [id|isim|isim alanı]

log dosyasını akıtın. Varsayılan olarak tüm logları aktarır.

Seçenekler:
- `--json`                json log çıktısı
- `--format`              formatlı log çıktısı
- `--raw`                 ham çıktı
- `--err`                 yalnızca hata çıktısını gösterir
- `--out`                 yalnızca standart çıktıyı gösterir
- `--lines `           son N satırı çıktılar, varsayılan olarak son 15 yerine
- `--timestamp [format]`  zaman damgalarını ekler (varsayılan format YYYY-MM-DD-HH:mm:ss)
- `--nostream`            log akışı başlatmadan logları yazdırır
- `--highlight [value]`   belirtilen değeri vurgular
- `-h, --help`            kullanım bilgisi çıktısını verir

---

Bazı önemli komutlar:

```bash
# Tüm uygulama loglarını gerçek zamanlı olarak görüntüle
pm2 logs

# Sadece `api` uygulaması loglarını görüntüle
pm2 logs api

# Yeni logları json formatında görüntüle
pm2 logs --json

# api log dosyasının 1000 satırını görüntüle
pm2 logs big-api --lines 1000
```

:::tip
CLI gösterge paneli ile logları da kontrol edebilirsiniz:
```bash
pm2 monit
```
:::

Her uygulama satırı için bu meta veriler yazdırılacaktır:

```json
{
   "message": "echo\n",                     // `console.log` ile yazdırılan gerçek mesaj
   "timestamp": "2017-02-06T14:51:38.896Z", // mesajın zaman damgası, formatlanabilir
   "type": "out",                           // log türü, `err`, `out` veya `PM2` olabilir
   "process_id": 0,                         // PM2 tarafından kullanılan işlem kimliği
   "app_name": "one-echo"                   // uygulama adı
}
```

:::info
[pm2-logrotate](https://github.com/keymetrics/pm2-logrotate) modülü otomatik olarak log dosyalarını döndürür ve sınırlı disk alanı kullanarak tüm log dosyalarını saklar. 
Kurmak için:
```bash
pm2 install pm2-logrotate
```
pm2-logrotate hakkında daha fazla bilgi edinmek için [buraya](https://github.com/pm2-hive/pm2-logrotate#configure) göz atın.
:::

## Logları Boşaltma

Bu, PM2 tarafından yönetilen mevcut uygulama loglarını boşaltır:

```bash
pm2 flush

pm2 flush <api> # <api> ile eşleşen ad/id'ye sahip uygulamanın loglarını temizle
```

## Uygulama log seçenekleri

Bir uygulamayı başlatırken birçok seçeneği belirtebilirsiniz.

### CLI

`pm2 start app.js [SEÇENEKLER]` komutunu çalıştırırken CLI'ye bu seçeneklerden herhangi birini geçebilirsiniz:

```bash
-l --log [path]              hem çıkış hem de hata loglarının çıkacağı dosya yolunu belirtin
-o --output <path>           çıkış log dosyasını belirtin
-e --error <path>            hata log dosyasını belirtin
--time                       logları standart formatlanmış zaman damgasıyla önekleyin
--log-date-format <format>   logları özel formatlanmış zaman damgasıyla önekleyin
--merge-logs                 aynı uygulama adıyla birden fazla işlem çalıştırıldığında dosyayı kimliğe göre ayırmayın
```

#### Logları Tarih ile Otomatik Önekleme

Uygulama loglarını kolayca öneklemek için `--time` seçeneğini geçebilirsiniz:

```bash
$ pm2 start app.js --time
# Veya çalışan bir uygulama için
$ pm2 restart app --time
```

### Konfigürasyon dosyası

Konfigürasyon dosyası aracılığıyla seçenekleri iletebilirsiniz:

|    Alan |   Tür  |  Örnek |  Açıklama|
|:----------|:-------:|:------------------------------:|:-------------------------|
|error_file| (string)| | hata dosyası yolu (varsayılan $HOME/.pm2/logs/&lt;uygulama adı&gt;-error-&lt;pid&gt;.log)|
|out_file| (string) | | çıkış dosyası yolu (varsayılan $HOME/.pm2/logs/&lt;uygulama adı&gt;-out-&lt;pid&gt;.log)|
|log_file| (string) | | hem çıkış hem de hata logları için dosya yolu (varsayılan olarak devre dışı)|
|pid_file| (string) | | pid dosyası yolu (varsayılan $HOME/.pm2/pids/&lt;uygulama adı&gt;-&lt;pid&gt;.pid)|
|merge_logs| boolean | true | true olarak ayarlandığında log dosyalarını işlem kimliği ile ayırmaktan kaçının |
|log_date_format| (string) | "YYYY-MM-DD HH:mm Z" | log tarihi formatı (log bölümüne bakın)|
|log_type| (string) | "json" | log çıktı stilini belirtin, olası değer: 'json' (varsayılan olarak ham loglanır)|

### Log Suffix'ini Devre Dışı Bırakma

Yalnızca küme modundaki uygulamalar (node.js) için; Tüm kümelenmiş işlem örneklerinin loglarını aynı dosyaya yazmasını istiyorsanız `--merge-logs` veya `merge_logs: true` seçeneğini kullanabilirsiniz.

### Log Yazmayı Devre Dışı Bırakma

Tüm logların diske yazılmasını devre dışı bırakmak için `out_file` ve `error_file` seçeneklerini `/dev/null` olarak ayarlayabilirsiniz.

```js
module.exports = {
  apps : [{
    name: 'Business News Watcher',
    script: 'app.js',
    instances: 1,
    out_file: "/dev/null",
    error_file: "/dev/null",
    cron_restart: '0 0 * * *'
    [...]
  }]
}
```

Logların çıktısı olarak `/dev/null` veya `NULL` değerini sağlayabilirsiniz (platformdan bağımsızdır, sabit bir dizedir).

### Yerel bir logrotate Ayarlama

```bash
sudo pm2 logrotate -u user
```

Bu, `/etc/logrotate.d/pm2-user` dosyasına temel bir logrotate yapılandırması yazacaktır:

```
/home/user/.pm2/pm2.log /home/user/.pm2/logs/*.log {
        rotate 12
        weekly
        missingok
        notifempty
        compress
        delaycompress
        create 0640 user user
}
```