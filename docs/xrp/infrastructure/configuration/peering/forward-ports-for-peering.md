---
title: Eşler için Portları Yönlendirme
seoTitle: Eşler için Portları Yönlendirme - XRP Ledger
sidebar_position: 4
description: Gelen eşleri rippled sunucunuza almak için güvenlik duvarınızı nasıl yapılandıracağınızı keşfedin. Bu kılavuz, eş protokolü portunu açma ve firewalld ile güvenlik duvarı ayarlarını yapma işlemlerini içerir.
tags: 
  - eş protokolü
  - güvenlik duvarı
  - port yönlendirme
  - rippled
  - NAT
keywords: 
  - eş protokolü
  - güvenlik duvarı
  - port yönlendirme
  - rippled
  - NAT
---

# Eşler için Portları Yönlendirme

XRP Ledger eşler arası ağındaki sunucular `eş protokolü` üzerinden iletişim kurar. Ağın geri kalanıyla en iyi güvenlik ve bağlantı kombinasyonu için güvenlik duvarı kullanarak sunucunuzu çoğu porttan korumalısınız, ancak eş protokolü portunu açmalı veya yönlendirmelisiniz.

:::tip
**İpucu:** `rippled` sunucunuz çalışıyorken, server_info yöntemi ile kaç tane eşiniz olduğunu kontrol edebilirsiniz. `info` nesnesinin `peers` alanı, sunucunuza şu anda bağlı olan eş sayısını gösterir.
:::

Bu sayı **tam olarak 10 veya 11 ise**, genellikle güvenlik duvarınız gelen bağlantıları engelliyor demektir. Aşağıda, büyük ihtimalle güvenlik duvarının gelen eş bağlantılarını engellemesinden dolayı yalnızca 10 eş gösteren `server_info` sonucunun bir örneği (kısaltılmış):

```json
$ ./rippled server_info
Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-23 22:15:09.343961928 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "info" : {
         ... (kısaltılmış) ...
         "load_factor" : 1,
         "peer_disconnects" : "0",
         "peer_disconnects_resources" : "0",
         "peers" : 10,
         "pubkey_node" : "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
         "pubkey_validator" : "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
         "published_ledger" : "none",
         "server_state" : "connected",
         ... (kısaltılmış) ...
      },
      "status" : "success"
   }
}
```

Gelen bağlantılara izin vermek için, güvenlik duvarınızı eş protokolü portu üzerinde gelen trafiğe izin verecek şekilde yapılandırmalısınız. Bu, varsayılan yapılandırma dosyasında **port 51235** üzerine sunulmaktadır. Bir portu açma talimatları güvenlik duvarınıza bağlıdır. Sunucunuz, Ağ Adresi Çevirisi (NAT) gerçekleştiren bir yönlendiricinin arkasındaysa, yönlendiricinizin portu sunucunuza yönlendirmesini sağlamalısınız.

:::info
**Not:** Red Hat Enterprise Linux'ta `firewalld` yazılım güvenlik duvarını kullanıyorsanız, [**port 51235**](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-using_zones_to_manage_incoming_traffic_depending_on_source) için tüm gelen trafiğe izin vermek üzere `firewall-cmd` aracını kullanabilirsiniz.
:::

_Güvenlik duvarının kamu [bölgesi](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-working_with_zones#sec-Listing_Zones) olarak `--zone=public` olduğunu varsayıyoruz._

```sh
$ sudo firewall-cmd --zone=public --add-port=51235/tcp
```

Ardından, `rippled` sunucusunu yeniden başlatın:

```sh
$ sudo systemctl restart rippled.service
```

Kalıcı hale getirmek için:

```sh
$ sudo firewall-cmd --zone=public --permanent --add-port=51235/tcp
```

Diğer yazılım ve donanım güvenlik duvarları için üreticinin resmi belgelerine bakın.

:::warning
**Dikkat:** Bir sanal güvenlik duvarı ile bir barındırma hizmeti kullanıyorsanız (örneğin, [AWS Güvenlik Grupları](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)), `firewalld` kullanmanıza gerek yoktur, ancak yine de eş port üzerinde açık internetten gelen trafiğe izin vermeniz gerekir. İlgili kuralları sunucunuza veya sanal makinenize uyguladığınızdan emin olun.
:::

## Ayrıca Bakınız

- **Kavramlar:**
    - `Eş Protokolü`
    - `rippled` Sunucusu
- **Eğitimler:**
    - `Kapacity Planlaması`
    - `rippled` Sunucusunu Hata Ayıklama
- **Referanslar:**
    - [connect yöntemi][]
    - [peers yöntemi][]
    - [print yöntemi][]
    - [server_info yöntemi][]

