---
title: logrotate
seoTitle: Logrotate Command for Log File Management
sidebar_position: 4
description: Detaylar, yapılandırma örnekleri ve logrotate komutunun yanıtta sunulan formatlarının incelenmesi.
tags: 
  - logrotate
  - Linux
  - yapılandırma
  - yönetici yöntemi
  - JSON-RPC
  - Ripple
keywords: 
  - logrotate
  - log döndürme
  - Linux
  - yapılandırma
  - yönetici yöntemi
  - JSON-RPC
  - Ripple
---

## logrotate
[[Kaynak]](https://github.com/XRPLF/rippled/blob/743bd6c9175c472814448ea889413be79dfd1c07/src/ripple/rpc/handlers/LogRotate.cpp "Kaynak")

`logrotate` komutu log dosyasını kapatır ve yeniden açar. Bu, Linux dosya sistemlerinde log döndürme işlemlerine yardımcı olmak içindir.

Çoğu Linux sistemi, bu komuttan ayrı olarak önceden yüklenmiş bir [`logrotate`](https://linux.die.net/man/8/logrotate) programıyla gelir. Uygulamaya özgü log döndürme betikleri `/etc/logrotate.d` dizinine yerleştirilir.

Aşağıdaki betik `/etc/logrotate.d/rippled` olarak oluşturulabilecek bir örnektir.

```logrotate
/var/log/rippled/*.log {
  günlük
  minsize 200M
  döndür 7
  nocreate
  missingok
  notifempty
  compress
  compresscmd /usr/bin/nice
  compressoptions -n19 ionice -c3 gzip
  compressext .gz
  postrotate
    /opt/ripple/bin/rippled --conf /opt/ripple/etc/rippled.cfg logrotate
  endscript
}
```

Ne kadar log saklayacağınıza bağlı olarak `minsize` ve `rotate` gibi parametreleri yapılandırabilirsiniz. Sunucunuzun loglarının ne kadar ayrıntılı olacağını yapılandırmak için `rippled.cfg` dosyanızdaki `log_level` ayarını kullanın. Bu örnek betik, standart `log_level` kullanılarak oluşturulmuştur ve yaklaşık 2 haftalık logu sıkıştırılmış formatta saklar.

`CentOS/Red Hat` ve `Ubuntu veya Debian` için resmi paketler, varsayılan olarak `/etc/logrotate.d/rippled` betiğini sağlar. Gerekirse bu betikte değişiklikler yapabilirsiniz. Modifikasyonlarınız paket yükseltmeleri sırasında üzerine yazılmayacaktır. 

:::info
Her uygulama için yalnızca bir sistem log döndürme betiğiniz olmalıdır. Aynı dizini yöneten başka bir log döndürme işleminiz olmadığından emin olun.
:::

`logrotate` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemi`dir.

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": "lr1",
    "command": "logrotate"
}
```


Komut Satırı
```sh
# Sözdizimi: logrotate
rippled logrotate
```




İstek herhangi bir parametre içermez.

### Yanıt Formatı

Başarılı bir yanıta bir örnek:



JSON-RPC
```json
200 OK

{
   "result" : {
      "message" : "Log dosyası kapatıldı ve yeniden açıldı.",
      "status" : "başarılı"
   }
}
```


Komut Satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005 adresine bağlanılıyor

{
   "result" : {
      "message" : "Log dosyası kapatıldı ve yeniden açıldı.",
      "status" : "başarılı"
   }
}
```




Yanıt, [standart formata][] uygun olup, başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`   | Tür   | Açıklama                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | Dize | Başarılı olduğunda, `Log dosyası kapatıldı ve yeniden açıldı.` mesajını içerir. |

### Olası Hatalar

* [evrensel hata türlerinden][] herhangi biri.