---
layout: docs
title: Capistrano benzeri dağıtımlar
description: PM2, symlinks ve doğru çalışma dizini ile dağıtım yapmanın yollarını keşfedin. Bu kılavuz, olası hataları önlemek ve dağıtım süreçlerinizi optimize etmek için önemli ipuçları sunmaktadır.
keywords: [Capistrano, PM2, dağıtım, symlink, yapılandırma, hata yönetimi, proje yönetimi]
---

## Capistrano benzeri dağıtımlar

## Ana sorun

İster kodunuzu dağıtmak için hangi araçları kullanırsanız kullanın, bir **Capistrano** benzeri yapıyla karşılaşabilirsiniz. Genel olarak, yöntem şu şekilde bir dizin ağaç yapısına sahip olacaktır:

```
project_root
├── current -> releases/20150301100000 # bu, mevcut sürüme işaret eden bir symlink
└── releases
    ├── 20150301100000
    ├── 20150228100000
    └── 20150226100000
```

:::tip
Bu tür dağıtımlarda, eski ve artık kullanılmayan sürümler silinir. Gerçekten de, yeni bir sürümün şu sonuçları olacaktır:
1. Proje yeni bir yola, burada `releases/YYYYMMDDHHMMSS` dağıtılır
2. `current` symlink yeni yola değişir
3. Eski sürümler silinir.
:::

PM2 ile, her zamanki gibi her şeyi çalıştırmaya teşvik olabilirsiniz, örneğin:

1. Dağıtımı yapın
2. Yeni dağıtılmış dizinden PM2 betiğini yeniden başlatın

Ama bekleyin, bu yöntemde bir sorun var. İlk 11 dağıtım ile bunu örnekleyelim. Örneğimizde, 1. sürüm silinecekken 10 sürümü saklamak istiyoruz:

1. İlk dağıtımı yapın
2. `current` yolundan projemizi başlatın `pm2 startOrRestart index.js`, mevcut çalışma dizini `releases/20150301100000`
3. Günler geçiyor
4. 11. dağıtım 
5. 1. dağıtım artık kullanılmıyor, bu nedenle siliniyor
6. `pm2 startOrRestart index.js` (veya herhangi bir PM2 komutu) `Error: ENOENT, no such file or directory for process.cwd()` hatasıyla başarısız olacaktır.

> O halde ne yanlış gitti? Gerçekten basit: 10 gün önce, PM2 `releases/20150301100000` içinde başlatıldı ama bu dizin şimdi silindi! Bu yüzden `process.cwd()` artık mevcut değil. İki kabukta aynı dizinde çalıştırmak gibi, bir kabuktan silmek ve diğer kabukta herhangi bir komut çalıştırmaya çalışmak gibidir. 
> — Önemli bir gözlem

Başarısız olacak ve bu tür bir hata üretecektir:

```
fatal: Unable to read current working directory: No such file or directory.
```

## Çözüm

Bana göre, Capistrano yapıları harika. Symlink değişikliği ile geri dönmeyi sağlar. 
Bu sorunu çözmek için PM2'yi asla silinmeyecek bir dizinde başlatmamız gerekiyor.
Buradaki önerim, mutlak bir `project_root` tanımlamaktır. Uygulamamızın doğru bir şekilde çalışması için gerekli olan yapılandırma dosyaları, günlükler, veriler (yani sqlite) vb. gibi tüm gerekli araçları burada depolayacaktır.

Yapı şimdi şöyle görünmelidir:

```
project_root # bu örnekte mutlak yol /home/www/project_root
├── current -> releases/20150301100000 # bu, mevcut sürüme işaret eden bir symlink
├── releases
|   ├── 20150301100000
|   ├── 20150228100000
|   └── 20150226100000
├── logs # PM2 günlüklerimizi burada tutmak, dağıtımlar arasında sabit kalması açısından iyi bir fikirdir
└── configuration # Veritabanı ortamlarınızı taahhüt ediyor musunuz?
```

:::info
Ve, bundan daha önemlisi, PM2 ekosistemini bu yapıya uyacak şekilde tanımlamaktır:
:::

```js
# ecosystem.json
{
  "apps": [{
    "name": "my-app",
    "script": "./index.js",
    "cwd": "/home/www/project_root/current", 
    "error_file": "/home/www/project_root/logs/app.err.log",
    "out_file": "../logs/app.out.log", # bu, mutlak error_file yoluyla aynıdır
    "exec_mode": "fork_mode"
  }]
}
```

*Bu yapılandırmada mutlak yolları sevmiyor musunuz? Bunun yerine `PWD` ortam değişkenini kullanın!*

Şimdi, `ecosystem.json` genellikle projenizde veya depo içerisinde yer alır. Onu doğru bir şekilde başlatmak için PM2'yi `project_root` dizininden başlatmalısınız:

```bash
# dağıtım betiğinizin bir yerinde
cd /home/www/project_root
pm2 startOrRestart current/ecosystem.json
```

## Günlükler ve veri ipucu

Sürekli entegrasyon dünyasında çalışırken, güncel ve veri dizinlerini genellikle depolarınızın içine almak isteyeceksiniz. Bu, uygulamanızın test edilebilirliğini ve taşınabilirliğini kolaylaştırır. Bir Capistrano yapısına atıfta bulunurken, önerim veri dizinlerini üst düzeye symlink etmektir.

Bu durumda, `ecosystem.json` şöyle olabilir:

```js
# ecosystem.json
{
  "apps": [{
    "name": "my-app",
    "script": "./index.js",
    "cwd": "/home/www/project_root/current",
    "error_file": "./logs/app.err.log",
    "out_file": "./logs/app.out.log", 
    "exec_mode": "fork_mode"
  }]
}
```

Ve statik proje dizini şöyle olacaktır:

```
project_root 
├── logs 
├── configuration 
|   └── development.yml 
└── data 
    ├── staging.sqlite 
    └── development.sqlite 
```

:::tip
Dağıtım yapıldığında, tek yapmanız gereken `logs`, `configuration`, `data` dizinlerini üst dizine bağlamaktır! 
Bu şekilde, aynı projenin dağıtım ortamında şöyle görünmeli:
```
project_root 
├── logs -> ../logs
├── configuration  -> ../configuration
└── data -> /home/www/project_root/data # örnek için mutlak yol
```
:::

Daha fazla bilgi için, [orijinal soruna](https://github.com/Unitech/pm2/issues/1623) bakabilirsiniz.

## Shipit PM2 örneği

Bu, [shipit](https://github.com/shipitjs/shipit) ile kullandığım görevdir. Aynı komutun çoğu dağıtım aracına uygulanabileceğini unutmayın.

```javascript
function pm2Task(gruntOrShipit) {
  let shipit = utils.getShipit(gruntOrShipit)

  utils.registerTask(shipit, 'pm2', task)

  function task() {
    shipit.log('PM2 başlatılıyor') 

    let schema = shipit.config.pm2 && shipit.config.pm2.script ? shipit.config.pm2.script : 'ecosystem.json'

    let cmd = `SOME_APP_ENV="${shipit.environment}" cd ${shipit.config.deployTo} && pm2 startOrRestart --env ${shipit.environment} current/${schema}`

    return shipit.remote(cmd)
  }

  shipit.on('cleaned', function() {
    return shipit.start('pm2') 
  })
}
```

Örneğimizde, yürütülen komut şu sonucu verecektir:

```bash
SOME_APP_ENV="production" cd /home/www/project_root && pm2 startOrRestart --env production current/ecosystem.json`
```

PM2'nin ortam yeteneğini kullandığımı unutmayın (http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments) ve kendi ortam değişkenimi (`SOME_APP_ENV`) tanımlıyorum.