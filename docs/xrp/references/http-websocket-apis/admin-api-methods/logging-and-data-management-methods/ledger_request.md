---
title: ledger_request
seoTitle: Ledger Request Command in XRPL
sidebar_position: 4
description: ledger_request command allows querying a specific ledger version from peers connected to the server. It may require multiple command executions to retrieve the complete ledger.
tags: 
  - ledger_request
  - ledger
  - eş sunucular
  - RPC
  - sorgulama
keywords: 
  - ledger_request
  - ledger
  - eş sunucular
  - RPC
  - sorgulama
---

## ledger_request
[[Kaynak]](https://github.com/XRPLF/rippled/blob/e980e69eca9ea843d200773eb1f43abe3848f1a0/src/ripple/rpc/handlers/LedgerRequest.cpp "Kaynak")

`ledger_request` komutu, sunucuya bağlı eşlerinden belirli bir defter sürümünü almasını söyler. Bu yalnızca sunucunun doğrudan bağlı olduğu eşlerden biri o deftere sahip olduğunda çalışır. **Bir defteri tamamen almak için komutu birkaç kez çalıştırmanız gerekebilir.**

*`ledger_request` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetim yöntemi`!*

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": 102,
    "command": "ledger_request",
    "ledger_index": 13800000
}
```


Komut Satırı
```
rippled ledger_request 13800000
```




İstek aşağıdaki parametreleri içerir:

| `Alan`          | Tür    | Açıklama                                        |
|:----------------|:-------|:---------------------------------------------------|
| `ledger_index`  | Sayı   | _(Opsiyonel)_ Belirtilen defteri [Defter İndeksi][] ile alır. |
| `ledger_hash`   | Dize   | _(Opsiyonel)_ Belirtilen defteri tanımlayıcı [Hash][] ile alır. |

:::tip
Ya `ledger_index` ya da `ledger_hash` sağlamanız gerektiğini, ancak ikisini birden sağlamamanız gerektiğini unutmayın.
:::

### Cevap Formatı

Cevap [standart format][] ile takip edilir. Ancak, istek belirtilen deftere sahip değilse _bununla birlikte `rippled` sunucusuna defteri almaya başlatmayı başarıyla talimat vermiş olsa bile_ bir hata yanıtı döner.

:::info 
Bir defteri almak için, `rippled` sunucusunun tarihindeki o deftere sahip bir doğrudan eşe sahip olması gerekir. Eğer isteyen defterin hiçbiri yoksa, [bağlanma yöntemi][] veya yapılandırma dosyasının `fixed_ips` bölümünü kullanarak Ripple'ın tam tarih sunucusunu `s2.ripple.com` adresine ekleyebilir ve ardından `ledger_request` isteğini tekrar yapabilirsiniz.
:::

Bir hata yanıtı, defteri almanın durumunu gösterir. Başarılı bir yanıt, defterle ilgili bilgileri benzer bir formatta barındırır [defter yöntemi][].



Komut Satırı (hata)
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "acquiring" : {
         "hash" : "01DDD89B6605E20338B8EEB8EB2B0E0DD2F685A2B164F3790C4D634B5734CC26",
         "have_header" : false,
         "peers" : 2,
         "timeouts" : 0
      },
      "error" : "lgrNotFound",
      "error_code" : 20,
      "error_message" : "istedik defteri alırken",
      "request" : {
         "command" : "ledger_request",
         "ledger_index" : 18851277
      },
      "status" : "error"
   }
}
```


Komut Satırı (devam ediyor)
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "hash" : "EB68B5B4F6F06BF59B6D7532BCB98BB98E2F10C2435D895217AA0AA7E910FBD5",
      "have_header" : true,
      "have_state" : false,
      "have_transactions" : false,
      "needed_state_hashes" : [
         "C46F7B9E795135447AF24BAF999AB8FC1612A997F6EAAF8B784C226FF0BD8E25",
         "E48F528E4FC2A1DC492C6264B27B420E2285B2A3ECF3A253DB480DA5BFB7F858",
         "B62CD0B2E1277F78BC279FA037F3F747587299B60D23A551C3F63DD137DC0CF8",
         "30014C55701FB8426E496A47B297BEC9E8F5BFA47763CC22DBD9024CC81D39DD",
         "7EB59A853913898FCEA7B701637F33B1054BD36C32A0B910B612EFB9CDFF6334",
         "07ECAD3066D62583883979A2FADAADC8F7D89FA07375843C8A47452639AB2421",
         "97A87E5246AF78463485CB27E08D561E22AAF33D5E2F08FE2FACAE0D05CB5478",
         "50A0525E238629B32324C9F59B4ECBEFE3C21DC726DB9AB3B6758BD1838DFF68",
         "8C541B1ED47C9282E2A28F0B7F3DDFADF06644CAB71B15A3E67D04C5FAFE9BF4",
         "2C6CC536C778D8C0F601E35DA7DD9888C288897E4F603E76357CE2F47E8A7A9F",
         "309E78DEC67D5725476A59E114850556CC693FB6D92092997ADE97E3EFF473CC",
         "8EFF61B6A636AF6B4314CAC0C08F4FED0759E1F782178A822EDE98275E5E4B10",
         "9535645E5D249AC0B6126005B79BB981CBA00286E00154D20A3BCF65743EA3CA",
         "69F5D6FCB41D1E6CEA5ADD42CBD194086B45E957D497DF7AEE62ADAD485660CE",
         "07E93A95DBB0B8A00925DE0DF6D27E41CACC77EF75055A89815006109D82EAD3",
         "7FDF25F660235DCAD649676E3E6729DF920A9B0B4B6A3B090A3C64D7BDE2FB20"
      ],
      "needed_transaction_hashes" : [
         "BA914854F2F5EDFCBD6E3E0B168E5D4CD0FC92927BEE408C6BD38D4F52505A34",
         "AE3A2DB537B01EB33BB3A677242DE52C9AE0A64BD9222EE55E52855276E7EA2A",
         "E145F737B255D93769673CBA6DEBA4F6AC7387A309DAACC72EA5B07ECF03C215",
         "073A118552AA60E1D3C6BE6F65E4AFA01C582D9C41CCC2887244C19D9BFA7741",
         "562DB8580CD3FE19AF5CEA61C2858C10091151B924DBF2AEB7CBB8722E683204",
         "437C0D1C2391057079E9539CF028823D29E6437A965284F6E54CEBF1D25C5D56",
         "1F069486AF5533883609E5C8DB907E97273D9A782DF26F5E5811F1C42ED63A3D",
         "CAA6B7DA68EBA71254C218C81A9EA029A179694BDD0D75A49FB03A7D57BCEE49"
      ],
      "peers" : 6,
      "status" : "başarı",
      "timeouts" : 1
   }
}
```


Komut Satırı (başarı)
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "ledger" : {
         "accepted" : true,
         "account_hash" : "84EBB27D9510AD5B9A3A328201921B3FD418D4A349E85D3DC69E33C7B506407F",
         "close_time" : 486691300,
         "close_time_human" : "2015-Haz-04 00:01:40",
         "close_time_resolution" : 10,
         "closed" : true,
         "hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
         "ledger_hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
         "ledger_index" : "13840000",
         "parent_hash" : "8A3F6FBC62C11DE4538D969F9C7966234635FE6CEB1133DDC37220978F8100A9",
         "seqNum" : "13840000",
         "totalCoins" : "99999022883526403",
         "total_coins" : "99999022883526403",
         "transaction_hash" : "3D759EF3AF1AE2F78716A8CCB2460C3030F82687E54206E883703372B9E1770C"
      },
      "ledger_index" : 13840000,
      "status" : "başarı"
   }
}
```




Üç olası yanıt formatı aşağıdaki gibidir:

1. **`lgrNotFound` hatası döndüğünde**, yanıt `acquiring` adlı bir alana sahiptir ve `Defter İsteği Nesnesi` gösterilerek defteri eşler arası ağdan alma sürecinin ilerlemesini belirtir.
2. Yanıt, **sunucunun şu anda defteri almakta olduğunu** gösteriyorsa, sonuç gövdesi `Defter İsteği Nesnesi` gösterilerek defteri eşler arası ağdan alma sürecinin ilerlemesini belirtir.
3. **Defter tamamen mevcut olduğunda yanıt**, `defter başlığının` bir temsilidir.

### Defter İsteği Nesnesi

Sunucu, bir defteri alma sürecindeyken ancak henüz bitmemişse, `rippled` sunucusu bir defter alma isteği nesnesi döner ve bu nesne defter alma sürecinin ilerlemesini gösterir. Bu nesne aşağıdaki alanlara sahiptir:

| `Alan`                     | Tür              | Açıklama                 |
|:---------------------------|:-----------------|:----------------------------|
| `hash`                     | Dize             | (Atlanabilir) Sunucunun bildiği defterin [Hash][] değeri. |
| `have_header`              | Boolean          | Sunucunun istenen defterin başlık bölümüne sahip olup olmadığını. |
| `have_state`               | Boolean          | (Atlanabilir) Sunucunun istenen defterin tam durum verisine sahip olup olmadığını. |
| `have_transactions`        | Boolean          | (Atlanabilir) Sunucunun istenen defterin tam işlem setine sahip olup olmadığını. |
| `needed_state_hashes`      | Dize Dizisi      | (Atlanabilir) Sunucunun hala alması gereken durum verilerindeki nesnelere ait en fazla 16 hash. |
| `needed_transaction_hashes`| Dize Dizisi      | (Atlanabilir) Sunucunun hala alması gereken işlem setindeki nesnelere ait en fazla 16 hash. |
| `peers`                    | Sayı            | Sunucunun bu defteri bulmak için sorguladığı eş sayısı. |
| `timeouts`                 | Sayı             | Şu ana kadar bu defteri alırken zaman aşımına uğramış olduğu sayı. |

### Olası Hatalar

- Herhangi bir [evrensel hata tipi][].
- `invalidParams` - Bir veya birden fazla alan yanlış belirtilmiş veya bir veya birden fazla zorunlu alan eksik. Ayrıca, devam eden defterin geçerli sorgu sayısını eşit veya daha yüksek bir defter indeksi belirtirseniz bu hata da oluşabilir.
- `lgrNotFound` - Eğer defter henüz mevcut değilse. Bu, sunucunun defteri almaya başladığını gösterir, fakat hiçbiri bağlı eşleri o istenen deftere sahip değilse başarısız olabilir. (Daha önce, bu hata `ledgerNotFound` kodunu kullanıyordu.) badge href="https://github.com/XRPLF/rippled/releases/tag/0.30.1Rippled 0.30.1'de güncellenmiştir/badge %}
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları yalnızca) Bu yöntem Raporlama Modu'nda mevcut değildir.

