---
title: connect
seoTitle: Connect Command in Rippled
sidebar_position: 1
description: connect komutu, rippled sunucusunu belirli bir eş rippled sunucusuna bağlamaya zorlar. Bu belge, istek ve yanıt formatlarını, parametreleri ve olası hataları açıklamaktadır.
tags: 
  - rippled
  - connect
  - istekformatı
  - yanıtformatı
  - hata
keywords: 
  - connect
  - rippled
  - sunucu
  - istekformatı
  - yanıtformatı
  - hata
  - ağ
---

# connect
[[Kaynak]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/Connect.cpp "Kaynak")

`connect` komutu `rippled` sunucusunu belirli bir eş `rippled` sunucusuna bağlamayı zorlar.

***`connect` metodu, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemidir`!***

### İstek Formatı
İstek formatının bir örneği:



WebSocket
```json
{
    "command": "connect",
    "ip": "192.170.145.88",
    "port": 51235
}
```


JSON-RPC
```json
{
    "method": "connect",
    "params": [
        {
            "ip": "192.170.145.88",
            "port": 51235
        }
    ]
}
```


Commandline
```sh
#Syntax: connect ip [port]
rippled connect 192.170.145.88 51235
```




İstek aşağıdaki parametreleri içerir:

| `Alan` | Tür    | Açıklama                                               |
|:-------|:-------|:-------------------------------------------------------|
| `ip`   | Dize   | Bağlanılacak sunucunun IP adresi                       |
| `port` | Sayı   | _(Opsiyonel)_ Bağlantı kurarken kullanılacak port numarası. Varsayılan **2459**'dur. badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0Güncellendi: rippled 1.6.0/badge %} |

### Yanıt Formatı

Başarılı bir yanıtın örneği:



JSON-RPC
```json
{
   "result" : {
      "message" : "connecting",
      "status" : "success"
   }
}
```


Commandline
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "message" : "connecting",
      "status" : "success"
   }
}
```




Yanıt, başarılı bir sonuç içeren [standart formata][] uygun olarak aşağıdaki alanları içerir:

| `Alan`    | Tür    | Açıklama                                            |
|:----------|:-------|:-----------------------------------------------------|
| `message` | Dize   | Komut başarılıysa `connecting` değeri.              |

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiş veya bir veya daha fazla zorunlu alan eksik.
- Tek başına modda bağlanılamıyor - Ağla ilgili komutlar tek başına modda devre dışı bırakılmıştır.
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları yalnızca) Bu yöntem Raporlama Modu'nda mevcut değildir.

:::warning
Bağlantı kurarken `port` parametresini belirtmezseniz, varsayılan port **2459** olarak ayarlanacaktır.
:::


Ek Bilgiler

Daha fazla bilgi ve öneriler için `dökümantasyonun ilgili bölümüne` göz atabilirsiniz.



> **Not**: `connect` metodunun kullanımı ile ilgili sorunlarınız varsa, [destek forumuna](https:// XRPLF/rippled/support) başvurabilirsiniz.  
> — Rippled Support Team

