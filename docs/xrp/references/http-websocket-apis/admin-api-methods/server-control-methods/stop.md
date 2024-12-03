---
title: Sunucuyu Durdurma
seoTitle: Rippled Sunucusunu Durdurma
sidebar_position: 4
description: Rippled sunucusunu kapatmayı açıklayan bu belge, istek ve yanıt formatlarını detaylandırır.
tags: 
  - rippled
  - sunucu
  - JSON-RPC
  - API
  - yönetici
keywords: 
  - stop
  - rippled
  - server
  - JSON-RPC
  - command
  - API
  - admin
---

# stop
[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Stop.cpp "Kaynak")

Sunucuyu nazikçe kapatır.

> *`stop` yöntemi, `admin yöntemi` olup, yetkisiz kullanıcılar tarafından çalıştırılamaz!*  
> — Ripple Documentation

### İstek Formatı

İstek formatının bir örneği:



WebSocket
```json
{
    "id": 0,
    "command": "stop"
}
```


JSON-RPC
```json
{
    "method": "stop",
    "params": [
        {}
    ]
}
```


Komut Satırı
```sh
# Sintaks: stop
rippled stop
```




İstek, hiçbir parametre içermez.

### Yanıt Formatı

Başarılı bir yanıtın örneği:



JSON-RPC
```json
{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```


Komut Satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005'e Bağlanıyor

{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```




Yanıt, [standart format][] ile birlikte gelir ve başarılı bir sonuç, aşağıdaki alanları içerir:

| `Alan`   | Tür   | Açıklama                          |
|:---------|:------|:-----------------------------------|
| `message` | String | Başarı durumunda `ripple server stopping`. |

### Olası Hatalar

* Herhangi bir [evrensel hata türü][].

:::info
**Not:** Bu komut yalnızca uygun izinlere sahip kullanıcılar tarafından çalıştırılmalıdır.
:::

