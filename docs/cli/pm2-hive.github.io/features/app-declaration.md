---
description: PM2 ile uygulama yönetimi için gerekli yapılandırma dosyalarını ve özelliklerini detaylı bir şekilde inceleyin. Bu kılavuz, uygulama davranışı ve çevresel değişkenler ile ilgili önemli bilgileri içermektedir.
keywords: [PM2, yapılandırma dosyası, uygulama yönetimi, ortam değişkenleri, JSON, log dosyaları, restart]
---

# Yapılandırma Dosyası

Birden çok uygulamayı PM2 ile yönetirken, bunları düzenlemek için bir JS yapılandırma dosyası kullanın.

### Yapılandırmayı oluşturma

Bir örnek yapılandırma dosyası oluşturmak için bu komutu yazabilirsiniz:

```bash
$ pm2 init simple
```

Bu, bir örnek `ecosystem.config.js` oluşturacaktır:

```javascript
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js"
  }]
}
```

Kendi yapılandırma dosyanızı oluşturuyorsanız, **PM2'nin bunu bir yapılandırma dosyası olarak tanıyabilmesi için `.config.js` ile bitmesi gerektiğini unutmayın.**

### Yapılandırma Dosyası Üzerinde İşlem Yapmak

Uygulama üzerinde işlem yapmak yerine, bir yapılandırma dosyasında bulunan tüm uygulamaları başlat/durdur/yeniden başlat/sil işlemini kesintisiz bir şekilde yapabilirsiniz:

```bash
# Tüm uygulamaları başlat
pm2 start ecosystem.config.js

# Hepsini durdur
pm2 stop ecosystem.config.js

# Hepsini yeniden başlat
pm2 restart ecosystem.config.js

# Hepsini yeniden yükle
pm2 reload ecosystem.config.js

# Hepsini sil
pm2 delete ecosystem.config.js
```

:::tip
Belirli bir uygulama üzerinde işlem yapmak için adını ve `--only ` seçeneğini kullanabilirsiniz.
:::

```bash
pm2 start ecosystem.config.js --only api-app
```

*Not*: `--only` seçeneği başlatma/yeniden başlatma/durdurma/silme için de çalışır.

Her bir uygulama adını virgülle ayırarak birden fazla uygulama üzerinde işlem yapmayı da belirtebilirsiniz:

```bash
pm2 start ecosystem.config.js --only "api-app,worker-app"
```

### Ortamları Değiştirme

Farklı ortam değişkenleri kümesi belirtmek için `env_*` seçeneğini kullanabilirsiniz.

Örnek:

```javascript
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
```

Şimdi farklı ortamlar arasındaki değişkenleri değiştirmek için, `--env [env name]` seçeneğini belirtin:

```bash
pm2 start process.json --env production
pm2 restart process.json --env development
```

## Mevcut Nitelikler

Uygulama davranışı ve yapılandırması, aşağıdaki nitelikler ile ince ayar yapılabilir:

### Genel

|    Alan |   Tür  |  Örnek |  Açıklama|
|:----------|:-------:|:------------------------------:|:-------------------------|
|name   | (string)   | "my-api" | uygulama adı (varsayılan olarak uzantısı olmayan dosya adı)|
|script| (string)    | "./api/app.js" | pm2 start'a göre ilişkili script yolu|
|cwd| (string)       | "/var/www/" | uygulamanızın başlatılacağı dizin|
|args| (string)      | "-a 13 -b 12" | CLI üzerinden script'e geçirilen tüm argümanları içeren dize|
|interpreter| (string) | "/usr/bin/python" | yorumlayıcı mutlak yolu (varsayılan olarak node)|
|interpreter_args| (string) | "--harmony" | yorumlayıcıya geçirilecek seçenek|
|node_args| (string) |   | yorumlayıcı_args için takma ad |

### Gelişmiş özellikler

|    Alan |   Tür  |  Örnek |  Açıklama|
|:----------|:-------:|:------------------------------:|:-------------------------|
|instances | number | -1 | başlatılacak uygulama örneği sayısı |
|exec_mode | string | "cluster" | uygulamanızı başlatma modu, "cluster" veya "fork" olabilir, varsayılan fork|
| watch   | boolean or [] |  true |  izleme & yeniden başlatma özelliğini etkinleştirir, dizinde veya alt dizinde dosya değiştiğinde, uygulamanız yeniden yüklenir |
|    ignore_watch    |   liste  |     ["[\\/\\\\]\\./", "node_modules"]     | izleme özelliğinden bazı dosya veya klasör adlarını yok saymak için regex listesi|
| max_memory_restart |  string |  "150M" |  uygulamanız belirtilen bellek miktarını aşarsa yeniden başlatılır. kullanıcı dostu format: "10M", "100K", "2G" vb. olabilir. |
| env |  nesne |   {"NODE_ENV": "development", "ID": "42"}  | uygulamanızda görünecek çevre değişkenleri |
| env_ |  nesne |   {"NODE_ENV": "production", "ID": "89"}  | pm2 restart app.yml --env  yaptığınızda  enjekte edin |
| appendEnvToName | boolean | true | varsayılan olarak false. Tek bir sunucuda birden fazla ortam dağıtmak için kullanılır. Her ortama isme eklenecektir. örn: my-api-production |
| source_map_support | boolean |  true | varsayılan olarak true, [source map dosyasını etkinleştir/devre dışı bırak] |
| instance_var | string | "NODE_APP_INSTANCE" | [belgelere bakın](http://pm2.keymetrics.io/docs/usage/environment/#specific-environment-variables) |
| filter_env | dizi türünde string | [ "REACT_" ] | "REACT_" ile başlayan global değişkenleri hariç tutar ve kümenin içine girmelerine izin vermez. |

### Kayıt dosyaları

|    Alan |   Tür  |  Örnek |  Açıklama|
|:----------|:-------:|:------------------------------:|:-------------------------|
|log_date_format| (string) | "YYYY-MM-DD HH:mm Z" | günlük tarih formatı (kayıt bölümü için bakınız)|
|error_file| (string)| | hata dosyası yolu (varsayılan olarak $HOME/.pm2/logs/&lt;uygulama adı&gt;-error-&lt;pid&gt;.log)|
|out_file| (string) | | çıktı dosyası yolu (varsayılan olarak $HOME/.pm2/logs/&lt;uygulama adı&gt;-out-&lt;pid&gt;.log)|
|log_file| (string) | | her iki çıktı ve hata kaydı için dosya yolu (varsayılan olarak devre dışı)|
|combine_logs| boolean | true | true olarak ayarlandığında, kayıt dosyalarını işlem kimliği ile sonlandırmayı önler |
|merge_logs| boolean | true | combine_logs için takma ad |
|time| boolean | false | varsayılan olarak false. Eğer true olursa, günlükleri Tarih ile otomatik olarak ön ekle |
|pid_file| (string) | | pid dosyası yolu (varsayılan olarak $HOME/.pm2/pids/&lt;uygulama adı&gt;-&lt;pid&gt;.pid)|

### Kontrol akışı

|    Alan |   Tür  |  Örnek |  Açıklama|
|:----------|:-------:|:------------------------------:|:-------------------------|
|min_uptime| (number) | | uygulamanın başlatıldığı kabul edilmesi için minimum çalışma süresi |
| listen_timeout | number | 8000 | uygulama dinlemediği sürede yeniden yüklemeyi zorlamak için ms cinsinden süre |
| kill_timeout | number | 1600 | [son bir SIGKILL](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#cleaning-states-and-jobs) göndermeden önce geçen süre |
| shutdown_with_message | boolean | false | bir uygulamayı process.send('shutdown') ile kapatmak yerine process.kill(pid, SIGINT) kullanarak kapatın |
| wait_ready | boolean | false | yeniden yükleme işlemi için dinleme olayı beklemek yerine process.send('ready') bekleyin |
| max_restarts| number | 10 | uygulamanın hatalı olduğu kabul edilmeden önce (1 saniye aralığında veya min_uptime ile özelleştirilmiş süre) üst üste verilen hatalı yeniden başlatma sayısı |
| restart_delay    | number |                    4000                   |                             çökme durumunda yeniden başlatmadan önce beklenmesi gereken süre (milisaniye cinsinden). varsayılan 0.|
| autorestart | boolean |  false  |  varsayılan olarak true. false ise, PM2 uygulamanız çökerse veya sonlandığında yeniden başlatmayacaktır |
| cron_restart    |  string |                "1 0 * * *"                |                                      uygulamanızı yeniden başlatmak için bir cron deseni. Uygulama çalışıyor olmalıdır ki cron özelliği çalışsın |
| vizion       | boolean |                   false                   |  varsayılan olarak true. false olursa, PM2 vizyon özellikleri olmadan başlatılır (sürüm kontrolü meta verisi) |
| post_update    |   liste  | ["npm install", "echo launching the app"] |                                        bir Pull/Güncelleme işleminden sonra gerçekleştirilecek komutlar listesi |
| force       | boolean |                    true                   |                                          varsayılan olarak false. true ise, aynı script'i birkaç kez başlatabilirsiniz ki bu genellikle PM2 tarafından izin verilmez |

### Dağıtım

Giriş adı|Açıklama|Tür|Varsayılan
---|---|---|---
key|SSH anahtar yolu|String|$HOME/.ssh
user|SSH kullanıcısı|String|
host|SSH ana bilgisayarı|[String]|
ssh_options|Komut satırı bayrağı olmadan SSH seçenekleri, 'man ssh'ye bakın|String veya [String]|
ref|GIT uzak/şube|String|
repo|GIT uzak|String|
path|sunucudaki yol|String|
pre-setup| Ön kurulum komutu veya yerel makinenizdeki bir script yolu|String|
post-setup|Ana bilgisayardaki post-kurulum komutları veya script yolu|String
pre-deploy-local|ön dağıtım işlemi|String|
post-deploy|son dağıtım işlemi|String|

### Dikkate Alınması Gerekenler

JSON uygulama beyanı kullanıldığında geçen tüm komut satırı seçenekleri atılacaktır, yani.

#### CWD

**cwd:** JSON beyanınız, script'inizle aynı yerde bulunmak zorunda değildir. JSON'ları script'inizle aynı yerde tutmak istiyorsanız (örneğin, `/etc/pm2/conf.d/node-app.json`), `cwd` özelliğini kullanmanız gerekecektir (Bu, symlink'ler kullanan capistrano tarzı dizin yapıları için gerçekten yararlı olabilir). Dosyalar ya `cwd` dizinine göre göreli ya da mutlak olabilir (aşağıdaki örneğe bakın).

### CLI/JSON seçenekleri

Tüm anahtarlar JSON yapılandırılmış bir dosyada kullanılabilir, ancak komut satırında hemen hemen aynı kalır örneğin:

```
exec_mode         -> --execute-command
max_restarts      -> --max-restarts
force             -> --force
```

Bir ESC oluşturmak için alıntı işaretlerini kullanarak, örneğin:

```bash
$pm2 start test.js --node-args "port=3001 sitename='first pm2 app'"
```

`nodeArgs` argümanı şu şekilde ayrıştırılacaktır:

```json
[
  "port=3001",
  "sitename=first pm2 app"
]
```

Ancak şu şekilde ayrıştırılmayacak:

```json
[
  "port=3001",
  "sitename='first",
  "pm2",
  "app'"
]
```

### Günlükleri devre dışı bırakma

Günlük kaydını devre dışı bırakmak için `error_file` veya `out_file` için `/dev/null` geçebilirsiniz.
Not: PM2 `2.4.0`'dan itibaren, `/dev/null` veya `NULL` günlükleri, platformdan bağımsız olarak devre dışı bırakır.

### Günlük Eklentileri

Günlüklerde otomatik kimlik eklerini (örneğin `app-name-ID.log`) devre dışı bırakmak için `merge_logs: true` seçeneğini etkinleştirebilirsiniz.

### Ortam tanımı

Belirli bir ortam dosyası içinde tanımlanan özel bir ortamı kullanması için pm2'ye belirtmek için `--env ` kullanmalısınız:

```json
{
  "apps" : [{
    "name"        : "worker-app",
    "script"      : "./worker.js",
    "watch"       : true,
    "env": {
      "NODE_ENV": "development"
    },
    "env_production" : {
       "NODE_ENV": "production"
    }
  },{
    "name"       : "api-app",
    "script"     : "./api.js",
    "instances"  : 4,
    "exec_mode"  : "cluster"
  }]
}
```

Bu örnekte, `pm2 start ecosystem.json` yazacağınızda uygulamanızı varsayılan ortamda çalıştıracaktır (geliştirme ortamında).
Daha sonra `pm2 start ecosystem.json --env production` yazarsanız, burada isim `production` olduğu için `env_` niteliğini kullanacaktır, böylece uygulamanızı `NODE_ENV=production` ile başlatacaktır.

### Özel `ext_type`

- min_uptime
  `min_uptime` değeri şu şekillerde olabilir:
    - **Sayı**
      örn. `"min_uptime": 3000` 3000 milisaniye anlamına gelir.
    - **Dize**
      Bu nedenle, kısa ve yapılandırması kolay hale getiriyoruz: `h`, `m` ve `s`, örn.: `"min_uptime": "1h"` bir saat anlamına gelir, `"min_uptime": "5m"` beş dakika anlamına gelir ve `"min_uptime": "10s"` on saniye anlamına gelir (bunlar milisaniyeye dönüştürülecektir).

- max_memory_restart
  `max_memory_restart` değeri şu şekillerde olabilir:
    - **Sayı**
        örn. `"max_memory_restart": 1024` 1024 byte anlamına gelir (**BİT DEĞİL**).
    - **Dize**
        Bu nedenle, kısa ve yapılandırması kolay hale getiriyoruz: `G`, `M` ve `K`, örn.: `"max_memory_restart": "1G"` bir gigabayt anlamına gelir, `"max_memory_restart": "5M"` beş megabayt anlamına gelir ve `"max_memory_restart": "10K"` on kilobayt anlamına gelir (bunlar byte'a dönüştürülecektir).

- Opsiyonel değerler
  Örneğin, `exec_mode` `cluster` (`cluster_mode`) veya `fork` (`fork_mode`) değerlerini alabilir.

- Bilinmesi gerekenler
  - `"instances": 0` PM2'nin CPU sayısına göre maksimum işlem başlatacağı anlamına gelir (küme modu)
  - dizi
  `args`, `node_args` ve `ignore_watch` türünde `Array` (örn: `"args": ["--toto=heya coco", "-d", "1"]`) veya `string` (örn: `"args": "--to='heya coco' -d 1"`) olabilir.