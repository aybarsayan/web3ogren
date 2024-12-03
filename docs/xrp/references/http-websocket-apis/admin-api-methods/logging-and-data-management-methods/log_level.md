````markdown
---
title: Log Level
seoTitle: Understanding Log Level Command in Ripple
sidebar_position: 4
description: Bu belge, `log_level` komutunun kullanımını ve ayarlarını açıklamaktadır. Kullanıcıların günlük ayrıntı düzeylerini yönetmeleri için gerekli bilgileri sunar.
tags:
  - logging
  - ripple
  - server commands
  - data management
keywords:
  - log level
  - ripple
  - logging
  - server commands
  - data management
---

## log_level
[[Kaynak]](https://github.com/XRPLF/rippled/blob/155fcdbcd0b4927152892c8c8be01d9cf62bed68/src/ripple/rpc/handlers/LogLevel.cpp "Kaynak")

`log_level` komutu, `rippled` sunucusunun günlük ayrıntı düzeyini değiştirir veya her bir kategori (bir _partisyon_ olarak adlandırılır) için mevcut günlük düzeyini döndürür.

> _`log_level` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `admin yöntemi`'dir._ 

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": "ll1",
    "command": "log_level",
    "severity": "debug",
    "partition": "PathRequest"
}
```


Komut Satırı
```sh
# Sözdizimi: log_level [[partition] severity]
rippled log_level PathRequest debug
```




İsteğin aşağıdaki parametreleri içerir:

| `Alan`      | Tür    | Açıklama                                           |
|:------------|:-------|:---------------------------------------------------|
| `severity`  | String | _(İsteğe Bağlı)_ Günlüğü hangi ayrıntı düzeyinde ayarlamak istediğiniz. Geçerli değerler, en az ayrıntılıdan en çok ayrıntılıya doğru: `fatal`, `error`, `warn`, `info`, `debug` ve `trace`. Atlandığında, tüm kategoriler için mevcut günlük ayrıntı düzeyini döndürür. |
| `partition` | String | _(İsteğe Bağlı)_ `severity` sağlanmadıkça dikkate alınmaz. Hangi günlük kategorisinin değiştirileceği. Atlandığında veya `base` değeri ile sağlandığında, tüm kategoriler için günlük düzeyini ayarlar. |

### Yanıt Formatı

Başarılı yanıtların örnekleri:



Komut Satırı (günlük düzeyini ayarlama)
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success"
   }
}
```


Komut Satırı (günlük düzeylerini kontrol etme)
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "levels" : {
         "AmendmentTable" : "Error",
         "Application" : "Error",
         "CancelOffer" : "Error",
         "Collector" : "Error",
         "CreateOffer" : "Error",
         "DeferredCredits" : "Error",
         "FeeVote" : "Error",
         "InboundLedger" : "Error",
         "JobQueue" : "Error",
         "Ledger" : "Error",
         "LedgerCleaner" : "Error",
         "LedgerConsensus" : "Error",
         "LedgerEntrySet" : "Error",
         "LedgerMaster" : "Error",
         "LedgerTiming" : "Error",
         "LoadManager" : "Error",
         "LoadMonitor" : "Error",
         "NetworkOPs" : "Error",
         "NodeObject" : "Error",
         "OrderBookDB" : "Error",
         "Overlay" : "Error",
         "PathRequest" : "Debug",
         "Payment" : "Error",
         "Peer" : "Error",
         "PeerFinder" : "Error",
         "Protocol" : "Error",
         "RPC" : "Error",
         "RPCErr" : "Error",
         "RPCHandler" : "Error",
         "RPCManager" : "Error",
         "Resolver" : "Error",
         "Resource" : "Error",
         "RippleCalc" : "Error",
         "SHAMap" : "Error",
         "SHAMapStore" : "Error",
         "SNTPClient" : "Error",
         "STAmount" : "Error",
         "SerializedLedger" : "Error",
         "Server" : "Error",
         "SetAccount" : "Error",
         "SetTrust" : "Error",
         "TaggedCache" : "Error",
         "TransactionAcquire" : "Error",
         "TransactionEngine" : "Error",
         "UVL" : "Error",
         "UniqueNodeList" : "Error",
         "Validations" : "Error",
         "WALCheckpointer" : "Error",
         "WebSocket" : "Trace",
         "base" : "Error"
      },
      "status" : "success"
   }
}
```




Yanıt, `standart formata` uymaktadır. Yanıt formatı, isteğin bir `severity` belirleyip belirlemediğine bağlıdır. Belirtilmişse, günlük düzeyi değiştirilir ve başarılı bir sonuç ek alan içermez.

Aksi takdirde, yanıt aşağıdaki alanı içerir:

| `Alan` | Tür    | Açıklama                                               |
|:--------|:-------|:-------------------------------------------------------|
| `level` | Object | Her kategorinin mevcut günlük düzeylerini içermektedir. Bu kategori listesi, gelecekteki sürümlerde haber vermeksizin değişebilir. Bu komuta yapılacak isteklerde `partition` için değer olarak alan adlarını kullanabilirsiniz. |

### Olası Hatalar

* Herhangi bir [evrensel hata türü][].
* `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiş veya bir veya daha fazla zorunlu alan eksik. 

:::tip
Günlük düzeyini değiştirirken dikkatli olun. Yanlış ayarlar, sistemin davranışını etkileyebilir.
:::


````