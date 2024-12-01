---
description: Bu belge, PM2 ile uygulamaların başlatılması, yönetilmesi ve yapılandırılması hakkında bilgi sağlar.
keywords: [PM2, Node.js, server, deployment, process management]
---

# Özellikler

## Root olmadan 80 numaralı portta dinleme

Node'un root olarak çalıştırılmaması gereken genel bir kuraldır. Ancak yalnızca root, 1024'ten küçük portlara bağlı kalabilir. Burada authbind devreye girer. Authbind, root olmayan kullanıcıların 1024'ten küçük portlara bağlanmasına izin verir. `%user%` kısmını `pm2`'yi çalıştıracak kullanıcı ile değiştirin.

```bash
sudo apt-get install authbind
sudo touch /etc/authbind/byport/80
sudo chown %user% /etc/authbind/byport/80
sudo chmod 755 /etc/authbind/byport/80
```

:::tip
`pm2` profilini çalıştıran kullanıcıya bir alias eklemelisiniz, örn. `~/.bashrc` veya `~/.zshrc` (not: hemen ardından `source ~/.bashrc` veya `source ~/.zshrc` komutunu çalıştırmalısınız):
:::

```diff
+alias pm2='authbind --deep pm2'
```

Son olarak, `pm2`'nin `authbind` ile güncellendiğinden emin olun:

```sh
authbind --deep pm2 update
```

Ya da alias'i kullanıcı profilinize eklediyseniz sadece `pm2 update` komutunu kullanabilirsiniz.

**Artık root olmadan port 80'e bağlanabilen uygulamaları PM2 ile başlatabilirsiniz!**

---

## Aynı sunucuda birden fazla PM2

İstemci ve daemon, $HOME/.pm2/pub.sock ve $HOME/.pm2/rpc.sock dosyaları aracılığıyla iletişim kurar.

:::info
`PM2_HOME` ortam değişkenini değiştirerek birden fazla PM2 örneği başlatabilirsiniz.
:::

```bash
PM2_HOME='.pm2' pm2 start echo.js --name="echo-node-1"
PM2_HOME='.pm3' pm2 start echo.js --name="echo-node-2"
```

Bu, iki farklı PM2 örneğini başlatır. Her bir farklı örneği yöneten süreçleri listelemek için:

```bash
PM2_HOME='.pm2' pm2 list
PM2_HOME='.pm3' pm2 list
```

---

## PM2'yi daemon olmadan başlatma

PM2'yi daemon olmadan başlatmadan önce herhangi bir PM2 örneğini öldürdüğünüzden emin olun (`pm2 kill`).

**Daemonlaştırmadan PM2'yi başlatma:**

```bash
pm2 start app.js --no-daemon
```

Ayrıca, PM2 kurulumu sırasında varsayılan olarak yüklenen CLI `pm2-runtime`, Node.js ikili dosyasının bir alternatifidir.

---

## Durumsuz uygulamalar

Üretim uygulamanızın durumsuz olması gerektiği genel bir kuraldır. Her veri, durum, websocket oturumu, oturum verisi, her türlü veritabanı veya PUB/SUB sistemi aracılığıyla paylaşılmalıdır.

Aksi takdirde, uygulamanız aynı sunucuda ve birden fazla sunucu arasında ölçeklendirilmesi zor olacaktır.

**Örneğin, oturumları paylaşmak için** [connect-redis](https://github.com/visionmedia/connect-redis) kullanabilirsiniz.

:::note
Ayrıca 12 faktör kuralını takip etmenizi öneririz: [http://12factor.net/](http://12factor.net/)
:::

---

## Sunucuda pm2 kurma

[Ubuntu VPS'de Node.js Üretim Ortamı Kurmak İçin pm2 Nasıl Kullanılır](https://www.digitalocean.com/community/articles/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps).

---

## Log ve PID dosyaları

Varsayılan olarak, loglar (hata ve çıktı), pid dosyaları, dökümler ve PM2 logları `~/.pm2/` dizininde bulunur:

```
.pm2/
├── dump.pm2
├── custom_options.sh
├── pm2.log
├── pm2.pid
├── logs
└── pids
```

---

## Harmony ES6'yı etkinleştirme

`--node-args` seçeneği, node yorumlayıcısına argüman eklemenizi sağlar. **Bir süreç için harmoniyi etkinleştirmek için** şu komutu yazın:

```bash
pm2 start my_app.js --node-args="--harmony"
```

Ve bir JSON tanımında:

```json
[{
  "name" : "ES6",
  "script" : "es6.js",
  "node_args" : "--harmony"
}]
```

---

## CoffeeScript

### CoffeeScript v1

```bash
pm2 install coffee-script 
pm2 start app.coffee
```

### CoffeeScript v2
```bash
pm2 install coffeescript
pm2 start app.coffee
```

**Hepsi bu!**

---

## JSON Yönlendirme

Pull-requests:
- [#273](https://github.com/Unitech/pm2/pull/273)
- [#279](https://github.com/Unitech/pm2/pull/279)

```bash
#!/bin/bash

read -d '' my_json <<_EOF_
[{
    "name"       : "app1",
    "script"     : "/home/projects/pm2_nodetest/app.js",
    "instances"  : "4",
    "error_file" : "./logz/child-err.log",
    "out_file"   : "./logz/child-out.log",
    "pid_file"   : "./logz/child.pid",
    "exec_mode"  : "cluster_mode",
    "port"       : 4200
}]
_EOF_

echo $my_json | pm2 start -
```

---

## Süreç başlığı

PM2 ile bir uygulama başlatırken `PROCESS_TITLE` ortam değişkenini belirtebilirsiniz, bu durum bir süreç başlığı ayarlayacaktır. **Örneğin, süreçten belirli verileri almak için** `ps -fC name` komutunu kullanabilirsiniz.

---

## Transpilerler

[PM2 ile transpiler kullanma](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2) kılavuzuna başvurun.

---

## Sorunlardan kullanıcı ipuçları

- [Vagrant ve pm2 #289](https://github.com/Unitech/pm2/issues/289#issuecomment-42900019)
- [Aynı uygulamayı farklı portlarda başlatma #322](https://github.com/Unitech/pm2/issues/322#issuecomment-46792733)
- [PM2 ile ansible kullanma](https://github.com/Unitech/pm2/issues/88#issuecomment-49106686)
- [Cron dizesi argüman olarak](https://github.com/Unitech/pm2/issues/496#issuecomment-49323861)
- [Belirli bir bellek miktarına ulaştığında yeniden başlatma](https://github.com/Unitech/pm2/issues/141)
- [Sticky oturumlar ve socket.io tartışması](https://github.com/Unitech/PM2/issues/637)
- [EACCESS - pm2 kullanıcı/root haklarını anlama](https://github.com/Unitech/PM2/issues/837)

---

## Dış kaynaklar ve makaleler

- [PM2 — Araç genel bakış ve kurulum](https://futurestud.io/tutorials/pm2-utility-overview-installation)
- [Ubuntu 16.04'te Üretim İçin Node.js Uygulamasını Kurma](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
- [Eğitim: AWS üzerinde bir Node.js sunucusu oluşturma ve yönetme, bölüm 2](https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-2-5fbdea95f8a1)
- [Goodbye node-forever, hello pm2](http://devo.ps/blog/goodbye-node-forever-hello-pm2/)
- [https://www.howtoforge.com/tutorial/how-to-deploy-nodejs-applications-with-pm2-and-nginx-on-ubuntu/](https://www.howtoforge.com/tutorial/how-to-deploy-nodejs-applications-with-pm2-and-nginx-on-ubuntu/)
- [https://serversforhackers.com/editions/2014/11/04/pm2/](https://serversforhackers.com/editions/2014/11/04/pm2/)
- [http://www.allaboutghost.com/keep-ghost-running-with-pm2/](http://www.allaboutghost.com/keep-ghost-running-with-pm2/)
- http://blog.ponyfoo.com/2013/09/19/deploying-node-apps-to-aws-using-grunt
- http://www.allaboutghost.com/keep-ghost-running-with-pm2/
- http://bioselemental.com/keeping-ghost-alive-with-pm2/
- http://blog.chyld.net/installing-ghost-on-ubuntu-13-10-aws-ec2-instance-with-pm2/
- http://blog.marvinroger.fr/gerer-ses-applications-node-en-production-pm2/
- https://www.codersgrid.com/2013/06/29/pm2-process-manager-for-node-js/
- http://www.z-car.com/blog/programming/how-to-rotate-logs-using-pm2-process-manager-for-node-js
- http://yosoftware.com/blog/7-tips-for-a-node-js/
- https://www.exponential.io/blog/nodeday-2014-moving-a-large-developer-workforce-to-nodejs
- http://blog.rapsli.ch/posts/2013/2013-10-17-node-monitor-pm2.html
- https://coderwall.com/p/igdqyw
- http://revdancatt.com/2013/09/17/node-day-1-getting-the-server-installing-node-and-pm2/
- https://medium.com/tech-talk/e7c0b0e5ce3c