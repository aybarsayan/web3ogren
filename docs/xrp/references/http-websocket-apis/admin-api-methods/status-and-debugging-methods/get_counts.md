````markdown
---
title: get_counts
seoTitle: Comprehensive Guide to get_counts Command
sidebar_position: 4
description: Sunucu içindeki istatistikler ve bellek kullanımını almak için `get_counts` komutunun kullanımı hakkında bilgi sağlar. Bu belge, istek ve yanıt formatlarını ayrıntılı olarak açıklar.
tags:
  - sunucu istatistikleri
  - bellek kullanımı
  - yönetici yöntemi
  - get_counts
keywords:
  - sunucu istatistikleri
  - bellek kullanımı
  - yönetici yöntemi
  - get_counts
---

## get_counts
[[Kaynak]](https://github.com/XRPLF/rippled/blob/c7118a183a660648aa88a3546a6b2c5bce858440/src/ripple/rpc/handlers/GetCounts.cpp "Kaynak")

`get_counts` komutu, sunucunun sağlığı hakkında, özellikle de şu anda bellekte bulunan çeşitli türlerdeki nesne sayılarını sağlamaktadır.

> _`get_counts` yöntemi, kayıtsız kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemi` dir._  
— Kaynak

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": 90,
    "command": "get_counts",
    "min_count": 100
}
```


JSON-RPC
```json
{
    "method": "get_counts",
    "params": [
        {
            "min_count": 100
        }
    ]
}
```


Komut Satırı
```sh
#Syntax: get_counts [min_count]
rippled get_counts 100
```




İstek aşağıdaki parametreleri içermektedir:

| `Alan`      | Tür                       | Açıklama                            |
|:------------|:-------------------------|:------------------------------------|
| `min_count` | Sayı (Tam Sayı)         | Sadece bu değerden en az bu kadar yüksek olan alanları döndür. |

---

### Yanıt Formatı

Başarılı bir yanıta örnek:



JSON-RPC
```json
{
   "result" : {
      "AL_hit_rate" : 48.36725616455078,
      "HashRouterEntry" : 3048,
      "Ledger" : 46,
      "NodeObject" : 10417,
      "SLE_hit_rate" : 64.62035369873047,
      "STArray" : 1299,
      "STLedgerEntry" : 646,
      "STObject" : 6987,
      "STTx" : 4104,
      "STValidation" : 610,
      "Transaction" : 4069,
      "dbKBLedger" : 10733,
      "dbKBTotal" : 39069,
      "dbKBTransaction" : 26982,
      "fullbelow_size" : 0,
      "historical_perminute" : 0,
      "ledger_hit_rate" : 71.0565185546875,
      "node_hit_rate" : 3.808214902877808,
      "node_read_bytes" : 393611911,
      "node_reads_hit" : 1283098,
      "node_reads_total" : 679410,
      "node_writes" : 1744285,
      "node_written_bytes" : 794368909,
      "status" : "success",
      "treenode_cache_size" : 6650,
      "treenode_track_size" : 598631,
      "uptime" : "3 saat, 50 dakika, 27 saniye",
      "write_load" : 0
   }
}
```


Komut Satırı
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "AL_hit_rate" : 48.36725616455078,
      "HashRouterEntry" : 3048,
      "Ledger" : 46,
      "NodeObject" : 10417,
      "SLE_hit_rate" : 64.62035369873047,
      "STArray" : 1299,
      "STLedgerEntry" : 646,
      "STObject" : 6987,
      "STTx" : 4104,
      "STValidation" : 610,
      "Transaction" : 4069,
      "dbKBLedger" : 10733,
      "dbKBTotal" : 39069,
      "dbKBTransaction" : 26982,
      "fullbelow_size" : 0,
      "historical_perminute" : 0,
      "ledger_hit_rate" : 71.0565185546875,
      "node_hit_rate" : 3.808214902877808,
      "node_read_bytes" : 393611911,
      "node_reads_hit" : 1283098,
      "node_reads_total" : 679410,
      "node_writes" : 1744285,
      "node_written_bytes" : 794368909,
      "status" : "success",
      "treenode_cache_size" : 6650,
      "treenode_track_size" : 598631,
      "uptime" : "3 saat, 50 dakika, 27 saniye",
      "write_load" : 0
   }
}
```




Yanıt `standart formata` uymaktadır. Sonuçta yer alan alanların listesi bildirim yapılmaksızın değişebilir, ancak aşağıdakilerden (ve diğerlerinden) herhangi birini içerebilir:

| `Alan`       | Tür    | Açıklama                                         |
|:-------------|:-------|:--------------------------------------------------|
| `Transaction` | Sayı   | Bellekte bulunan `Transaction` nesnelerinin sayısı |
| `Ledger`      | Sayı   | Bellekte bulunan defterlerin sayısı               |
| `uptime`      | Dize   | Bu sunucunun kesintisiz çalışma süresi.           |

:::warning
Diğer çoğu giriş için, değer o türdeki nesnelerin o anda bellekte bulunan sayısını göstermektedir.
:::

### Olası Hatalar

* Herhangi bir [evrensel hata türü][].
* `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiş veya bir veya daha fazla zorunlu alan eksik. 


````