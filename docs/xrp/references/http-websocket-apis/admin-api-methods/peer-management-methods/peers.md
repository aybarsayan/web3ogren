---
title: Peers Command
seoTitle: Understanding the Peers Command in Rippled
sidebar_position: 5
description: Bağlı olan eş sunucular hakkında detaylı bilgi edinin ve istek/yanıt formatlarını keşfedin.
tags: 
  - peers
  - ripple
  - server metrics
  - network
keywords: 
  - equinox
  - peers
  - ripple
  - server metrics
  - network
---

## peers
[[Kaynak]](https://github.com/XRPLF/rippled/blob/52f298f150fc1530d201d3140c80d3eaf781cb5f/src/ripple/rpc/handlers/Peers.cpp "Kaynak")

`peers` komutu, bu sunucuya `Eş Protokolü` üzerinden bağlı olan diğer tüm `rippled` sunucularının listesini döndürür; bağlantı ve senkronizasyon durumu hakkında bilgi içerir.

:::warning
*`peers` metodu, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici metodudur`!*
:::

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": 2,
    "command": "peers"
}
```


Komut Satırı
```
rippled peers
```




İstek üzerine **hiçbir ek parametre** eklenmez.

### Yanıt Formatı

Başarılı bir yanıta örnek:



WebSocket
```json
{
  "id": "peers_example",
  "result": {
    "cluster": {},
    "peers": [
      {
        "address": "5.189.239.203:51235",
        "complete_ledgers": "51813132 - 51815132",
        "ledger": "99A1E29C9F235DCCBB087F85F11756BECA606A756C22AB826AB1F319C470C3E3",
        "load": 157,
        "metrics": {
          "avg_bps_recv": "10255",
          "avg_bps_sent": "2015",
          "total_bytes_recv": "356809",
          "total_bytes_sent": "74208"
        },
        "public_key": "n94ht2A9aBoARRhk1rwypZNVXJDiMN4qzs1Bd5KsQaSnN3WVy8Tw",
        "uptime": 2,
        "version": "rippled-1.4.0"
      },
      ...
    ]
  },
  "status": "success",
  "type": "response"
}
```


JSON-RPC
```json
{
   "result" : {
      "cluster" : {},
      "peers" : [
         {
            "address" : "50.22.123.222:51235",
            "complete_ledgers" : "32570 - 51815097",
            "ledger" : "223DB74FE021AB1A4AA9E1CC588E0DBCC3FC7C080B93C01C30C246D89F951EA2",
            "load" : 7,
            "metrics" : {
               "avg_bps_recv" : "1152",
               "avg_bps_sent" : "332",
               "total_bytes_recv" : "96601",
               "total_bytes_sent" : "45322"
            },
            "public_key" : "n9LbkoB9ReSbaA9SGL317fm6CvjLcFG8hGoierLYfwiCDsEXHcP3",
            "uptime" : 1,
            "version" : "rippled-1.3.1"
         },
         ...
      ],
      "status" : "success"
   }
}
```


Komut Satırı
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "cluster" : {},
      "peers" : [
         ...
      ],
      "status" : "success"
   }
}
```




Yanıt, [standart formata][] uyar; başarılı bir sonuç, aşağıdaki alanları içeren bir JSON nesnesi olarak döner:

| `Alan`   | Tür   | Açıklama                                             |
|:----------|:-------|:--------------------------------------------------------|
| `cluster` | Nesne | Aynı kümedeki diğer `rippled` sunucularının özeti, eğer `küme olarak yapılandırılmışsa`. |
| `peers`   | Dizi  | Eş nesneleri dizisi.                                  |

:::note
`cluster` nesnesinin her alanı, o `rippled` sunucusunun tanımlayıcı anahtar çiftinin genel anahtarıdır. (Bu, o sunucunun [server_info metodunda][] `pubkey_node` olarak döndürdüğü aynı değerdir.)
:::

Bu alanın içeriği, aşağıdaki alanlarla bir nesnedir:

| `Alan` | Tür   | Açıklama                                               |
|:--------|:-------|:----------------------------------------------------------|
| `tag`   | Dizi | Yapılandırma dosyasında tanımlandığı gibi bu küme üyesinin görüntüleme adı. |
| `fee`   | Sayı | _(Atlanabilir)_ Bu küme üyesinin `işlem masrafı` için uyguladığı yük çarpanı. |
| `age`   | Sayı | Bu küme üyesinden alınan son küme raporundan itibaren geçen süre (saniye). |

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları için yalnızca) Bu yöntem Raporlama Modunda mevcut değildir.

