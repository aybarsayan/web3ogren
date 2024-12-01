---
description: PM2 ile uygulamaları kolayca dağıtmak için gerekli adımları ve yapılandırmaları öğreneceksiniz. Bu kılavuz, uzaktan sunucu kurulumu, uygulama dağıtımı ve sorun giderme yollarını kapsamaktadır.
keywords: [PM2, uygulama dağıtımı, uzaktan sunucu, GIT, dağıtım yapılandırması]
---

# Dağıtım Sistemi

PM2, üretim ortamında uygulamaları sağlama ve güncelleme imkanı sunan basit ama güçlü bir dağıtım sistemine sahiptir. Bu, bir veya birden fazla sunucuda uygulamaları baremetal sunucuya dağıtmak istediğinizde harikadır.

```bash
> pm2 deploy <configuration_file> <environment> <command>

  Komutlar:
    setup                uzaktan kurulum komutlarını çalıştır
    update               en son sürüme güncellemeyi yap
    revert [n]          [n]inci son dağıtıma veya 1'e geri dön
    curr[ent]           mevcut sürüm komitini çıktıla
    prev[ious]          önceki sürüm komitini çıktıla
    exec|run <cmd>      verilen <cmd>yi çalıştır
    list                önceki dağıtım komitlerini listele
    [ref]               [ref]e, "ref" ayarına veya en son etikete dağıt
```

### Dağıtım Yapılandırması

Dağıtım sistemini yapılandırmak için Uygulama Yapılandırma Dosyasına bir `deploy` niteliği ekleyin:

```javascript
module.exports = {
  apps : [{
    script: 'api.js',
  }, {
    script: 'worker.js'
  }],
   
  // Dağıtım Yapılandırması
  deploy : {
    production : {
       "user" : "ubuntu",
       "host" : ["192.168.0.13", "192.168.0.14", "192.168.0.15"],
       "ref"  : "origin/master",
       "repo" : "git@github.com:Username/repository.git",
       "path" : "/var/www/my-repository",
       "post-deploy" : "npm install"
    }
  }
};
```

:::note
Uygulama yapılandırma dosyasının yerel klasörde ya `ecosystem.config.js` ya da `pm2.config.js` olarak adlandırıldığından emin olun, böylece her komut için yapılandırma dosyasının adını yazmanıza gerek kalmaz.
:::

### Uzaktan Sunucu Sağlama

Uzaktan sunucu sağlamadan önce şunları doğrulayın:

- Uzaktan sunucularda PM2 yüklü
- Uzaktan sunucular, hedef depoyu GIT ile klonlamak için izin vermiş

Uzaktan sunucular yapılandırıldıktan sonra onları sağlamaya başlayabilirsiniz:

```bash
$ pm2 deploy production setup
```

:::info
Uygulama yapılandırma dosyası yerel klasörde `ecosystem.config.js` veya `pm2.config.js` olarak adlandırıldığı için, her seferinde dosya adını belirtmenize gerek yoktur.
:::

### Uygulamayı Dağıtma

Uzaktan sunucu sağlandıktan sonra artık uygulamayı dağıtabilirsiniz:

```bash
$ pm2 deploy production
```

**Not**: Eğer GIT yerel değişiklikler olduğu hatasını bildiriyorsa ama hala uzaktaki GIT'teki ne varsa itmek istiyorsanız, dağıtımı zorlamak için `--force` seçeneğini kullanabilirsiniz.

### Önceki Dağıtıma Geri Dönme

Eğer önceki dağıtıma geri dönmeniz gerekiyorsa, `revert` seçeneğini kullanabilirsiniz:

```bash
# -1 dağıtımına geri dön
$ pm2 deploy production revert 1
```

### Her Sunucuda Bir Komut Çalıştırma

Bir defa çalışacak bir komutu çalıştırmak için `exec` seçeneğini kullanabilirsiniz:

```bash
$ pm2 deploy production exec "pm2 reload all"
```

### Özellikler

#### Dağıtım Yaşam Döngüsü

PM2 ile dağıtım yaparken, kurulumdan önce/sonra ve güncellemeden önce/sonra ne yapılacağını belirtebilirsiniz:

```javascript
"pre-setup" : "echo 'kurulum süreci başlamadan önce ana makinada çalıştırılacak komutlar veya yerel bir betik yolu'",
"post-setup": "echo 'depoyu klonladıktan sonra ana makinada çalıştırılacak komutlar veya bir betik yolu'",
"pre-deploy" : "pm2 startOrRestart ecosystem.json --env production",
"post-deploy" : "pm2 startOrRestart ecosystem.json --env production",
"pre-deploy-local" : "echo 'Bu yerel olarak çalıştırılan bir komuttur'"
```

#### Çoklu ana makine dağıtımı

Aynı anda birden fazla ana makineye dağıtım yapmak için, sadece `host` niteliği altında her ana makineyi bir dizi olarak tanımlamanız yeterlidir:

```javascript
"host" : ["212.83.163.1", "212.83.163.2", "212.83.163.3"],
```

#### SSH Anahtarlarını Belirtme

Sadece "key" niteliğini kamu anahtarının yolu ile eklemeniz gerekir, aşağıdaki örneğe bakın:

```javascript
"production" : {
  "key"  : "/path/to/some.pem", // kimlik doğrulamak için kamu anahtarının yolu
  "user" : "node",              // kimlik doğrulamak için kullanılan kullanıcı
  "host" : "212.83.163.1",      // bağlanılacak yer
  "ref"  : "origin/master",
  "repo" : "git@github.com:repo.git",
  "path" : "/var/www/production",
  "post-deploy" : "pm2 startOrRestart ecosystem.json --env production"
},
```

### Sorun Giderme

#### SSH Klonlama Hataları

Çoğu durumda, bu hatalar `pm2`'nin deponuzu klonlamak için doğru anahtarları kullanmamasından kaynaklanacaktır. Her adımda anahtarların mevcut olduğundan emin olmalısınız.

__Adım 1__  
Anahtarlarınızın doğru çalıştığından eminseniz, hedef sunucuda `git clone your_repo.git` komutunu çalıştırmayı deneyin. Başarılı olursa, sonraki adımlara geçin. Başarısız olursa, anahtarlarınızın hem sunucuda hem de git hesabınızda saklandığından emin olun.

__Adım 2__  
Varsayılan olarak `ssh-copy-id`, genellikle `id_rsa` olarak adlandırılan varsayılan kimliği kopyalar. Eğer bu uygun anahtar değilse:

```bash
ssh-copy-id -i path/to/my/key your_username@server.com
```
Bu, kamu anahtarınızı `~/.ssh/authorized_keys` dosyasına ekler.

__Adım 3__  
Aşağıdaki hatayı alırsanız:
```
--> Üretim ortamına dağıtım yapılıyor
--> ana makine mysite.com üzerinde
  ○ hook pre-setup
  ○ kurulum çalıştırılıyor
  ○ git@github.com:user/repo.git klonlama
Klonlama '/var/www/app/source' içine...
İzin reddedildi (publickey).
fatal: Uzak depodan okunamadı.

Lütfen doğru erişim haklarına sahip olduğunuzdan ve deponun mevcut olduğundan emin olun.

**Klonlama başarısız oldu**

Dağıtım başarısız oldu
```
...belirli bir deponun klonlandığında doğru ssh anahtarlarının kullanıldığını garanti etmenin kesin bir yolu olan bir ssh yapılandırma dosyası oluşturmayı düşünebilirsiniz. [Bu örneğe](https://gist.github.com/Protosac/c3fb459b1a942f161f23556f61a67d66) bakın:

```bash
# ~/.ssh/config
Host alias
    HostName myserver.com
    User username
    IdentityFile ~/.ssh/mykey
# Kullanım: `ssh alias`
# Alternatif: `ssh -i ~/.ssh/mykey username@myserver.com`

Host deployment
    HostName github.com
    User username
    IdentityFile ~/.ssh/github_rsa
# Kullanım:
# git@deployment:username/anyrepo.git
# Bu, o IdentityFile'ı kullanan herhangi bir deponun klonlanması içindir. Uzak klonlama komutlarınızın uygun anahtarı kullandığından emin olmak için iyi bir yoldur.
```