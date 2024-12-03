---
title: Konsensüs Bilgisi
seoTitle: Konsensüs Sürecine Dair Bilgiler
sidebar_position: 4
description: consensus_info komutunun yapılandırılması ve yanıtlarının nasıl yorumlanacağı hakkında bilgi sunan bir belge.
tags: 
  - konsensüs
  - hata ayıklama
  - API
  - JSON
  - RPC
  - Blockchain
  - Ripple
keywords: 
  - konsensüs
  - hata ayıklama
  - API
  - JSON
  - RPC
  - Blockchain
  - Ripple
---

## consensus_info
[[Source]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/ConsensusInfo.cpp "Source")

`consensus_info` komutu, hata ayıklama amaçları için `konsensüs süreci` hakkında bilgi sağlar.

:::note
_`consensus_info` metodu, ayrıcalıksız kullanıcılar tarafından çalıştırılamayan bir `yönetici metodu` dur._
:::

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": 99,
    "command": "consensus_info"
}
```


JSON-RPC
```json
{
    "method": "consensus_info",
    "params": [
        {}
    ]
}
```


Commandline
```sh
# Syntax: consensus_info
rippled consensus_info
```




İstek herhangi bir parametre içermez.

### Yanıt Formatı

Başarılı bir yanıtın örneği:



JSON-RPC
```json
{
   "result" : {
      "info" : {
         "acquired" : {
            "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
         },
         "close_granularity" : 10,
         "close_percent" : 50,
         "close_resolution" : 10,
         "close_times" : {
            "486082972" : 1,
            "486082973" : 4
         },
         "current_ms" : 1003,
         "have_time_consensus" : false,
         "ledger_seq" : 13701086,
         "our_position" : {
            "close_time" : 486082973,
            "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
            "propose_seq" : 0,
            "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
         },
         "peer_positions" : {
            "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
               "close_time" : 486082972,
               "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
               "close_time" : 486082973,
               "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
               "close_time" : 486082973,
               "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
               "close_time" : 486082973,
               "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "EFC49EB648E557CC50A72D715249B80E071F7705" : {
               "close_time" : 486082973,
               "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            }
         },
         "previous_mseconds" : 2005,
         "previous_proposers" : 5,
         "proposers" : 5,
         "proposing" : false,
         "state" : "consensus",
         "synched" : true,
         "validating" : false
      },
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
      "info" : {
         "acquired" : {
            "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
         },
         "close_granularity" : 10,
         "close_percent" : 50,
         "close_resolution" : 10,
         "close_times" : {
            "486082972" : 1,
            "486082973" : 4
         },
         "current_ms" : 1003,
         "have_time_consensus" : false,
         "ledger_seq" : 13701086,
         "our_position" : {
            "close_time" : 486082973,
            "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
            "propose_seq" : 0,
            "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
         },
         "peer_positions" : {
            "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
               "close_time" : 486082972,
               "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
               "close_time" : 486082973,
               "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
               "close_time" : 486082973,
               "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
               "close_time" : 486082973,
               "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "EFC49EB648E557CC50A72D715249B80E071F7705" : {
               "close_time" : 486082973,
               "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            }
         },
         "previous_mseconds" : 2005,
         "previous_proposers" : 5,
         "proposers" : 5,
         "proposing" : false,
         "state" : "consensus",
         "synched" : true,
         "validating" : false
      },
      "status" : "success"
   }
}
```




Yanıt, [standart formata](https://github.com/XRPLF/rippled/blob/main/docs/standard_response_format.md) uygun olup, başarılı bir sonuç aşağıdaki alanları içermektedir:

| `Field` | Tür    | Açıklama                                               |
|:--------|:-------|:------------------------------------------------------|
| `info`  | Nesne  | Konsensüsü hata ayıklamak için yararlı olabilecek bilgiler. Bu çıktı, önceden haber verilmeden değişebilir. |

:::info
`info` nesnesinde bulunabilecek alanların tamamlanmamış bir özeti aşağıdaki gibidir:
:::

| `Field`          | Tür      | Açıklama                                          |
|:-----------------|:--------|:-------------------------------------------------|
| `ledger_seq`     | Sayı    | Şu anda konsensüs sürecinde olan `defter` 'in [defter indeksidir](https://github.com/XRPLF/rippled/blob/main/docs/ledger_index.md) |
| `our_position`   | Nesne   | Bu sunucunun konsensüs sürecindeki defter için beklentisi. |
| `peer_positions` | Nesne   | Konsensüs sürecindeki akranların ve önerilen defter sürümlerinin haritası. |
| `proposers`      | Sayı    | Bu konsensüs sürecine katılan güvenilir doğrulayıcıların sayısı. Hangi doğrulayıcıların güvenilir olduğu, bu sunucunun yapılandırmasına bağlıdır. |
| `synched`        | Boolean | Bu sunucunun ağıyla senkronize olup olmadığını gösterir. |
| `state`          | String  | Şu an hangi konsensüs sürecinin devam etmekte olduğunu belirtir: `açık`, `konsensüs`, `tamamlanmış`, veya `kabul edildi`. |

:::tip
`info` içindeki tek alanın `"consensus": "none"` olduğu bir minimum sonuç almak da normaldir. Bu, sunucunun konsensüs turları arasında olduğunu gösterir.
:::

:::warning
`consensus_info` komutu birkaç kez çalıştırıldığında sonuçlar ciddi şekilde değişiklik gösterebilir, hatta kısa aralıklarla bile.
:::

### Olası Hatalar

- Herhangi bir [evrensel hata türü](https://github.com/XRPLF/rippled/blob/main/docs/error_types.md).
- `reportingUnsupported` - ([Raporlama Modu](https://github.com/XRPLF/rippled/blob/main/docs/reporting_mode.md) sunucuları için) Bu yöntem Raporlama Modu'nda mevcut değildir.

