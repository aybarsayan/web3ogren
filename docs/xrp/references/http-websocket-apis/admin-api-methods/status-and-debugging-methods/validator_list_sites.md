---
title: Validator List Sites
seoTitle: Comprehensive Guide to Validator List Sites
sidebar_position: 4
description: Bu içerik, validator_list_sites komutunun istemci yanıtlarına ve durum bilgilerine odaklanmaktadır. Validator listeleri sunan siteler hakkında önemli bilgiler sağlar.
tags: 
  - validator
  - list
  - sites
  - command
  - response
  - status
  - blockchain
keywords: 
  - validator
  - list
  - sites
  - command
  - response
  - status
  - blockchain
---

## validator_list_sites
[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/ValidatorListSites.cpp "Kaynak")

> `validator_list_sites` komutu, validator listeleri sunan sitelerin durum bilgilerini döndürür.  
> — İçerik Geliştirme Ekibi

:::warning
`validator_list_sites` metodu, ayrıcalıksız kullanıcılar tarafından çalıştırılamayan bir `yönetici metodu`!
:::

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": 1,
    "command": "validator_list_sites"
}
```


JSON-RPC
```json
{
    "method": "validator_list_sites",
    "params": [
        {}
    ]
}
```


Komut Satırı
```sh
#Syntax: validator_list_sites
rippled validator_list_sites
```




:::note
İstek herhangi bir parametre içermez.
:::

### Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket
```json
{
    "id":5,
    "status":"success",
    "type":"response",
    "result": {
        "validator_sites": [
            {
                "last_refresh_status": "accepted",
                "last_refresh_time": "2017-Oct-13 21:26:37",
                "refresh_interval_min": 5,
                "uri": "http://127.0.0.1:51447/validators"
            }
        ]
    }
}
```


JSON-RPC
```json
200 OK

{
    "result": {
        "status": "success",
        "validator_sites": [
            {
                "last_refresh_status": "accepted",
                "last_refresh_time": "2017-Oct-13 21:26:37",
                "refresh_interval_min": 5,
                "uri": "http://127.0.0.1:51447/validators"
            }
        ]
    }
}
```


Komut Satırı
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
    "result": {
        "status": "success",
        "validator_sites": [
            {
                "last_refresh_status": "accepted",
                "last_refresh_time": "2017-Oct-13 21:26:37",
                "refresh_interval_min": 5,
                "uri": "http://127.0.0.1:51447/validators"
            }
        ]
    }
}
```




:::info
Yanıt aşağıdaki [standart formata][] uymaktadır ve başarılı sonuç şu alanı içermektedir:
:::

| `Alan`             | Tür   | Açıklama                              |
|:-------------------|:------|----------------------------------------|
| `validator_sites`  | Dizi  | Validator site nesnelerinin dizisi. |

`validator_sites` alan dizisinin her bir üyesi, aşağıdaki alanlara sahip bir nesnedir:

| `Alan`                  | Tür               | Açıklama                        |
|:------------------------|:------------------|:--------------------------------|
| `last_refresh_status`   | Dize              | Varsa, sitenin en son güncelleme durumunu gösterir. Yoksa, site henüz başarılı bir şekilde sorgulanmamıştır. Aşağıdaki **Site Durum Değerlerine** bakın. |
| `last_refresh_time`     | Dize              | Sitelerin son sorgulandığı zaman (insan tarafından okunabilir). Yoksa, site henüz başarılı bir şekilde sorgulanmamıştır. |
| `refresh_interval_min`  | İşaretsiz Tam Sayı | Yenileme denemeleri arasındaki dakika sayısı. |
| `uri`                   | Dize              | Sitelerin URI'si. |

#### Site Durum Değerleri

`last_refresh_status` alanı aşağıdaki değerlere sahip olabilir:

| Değer                 | Anlam                                  |
|:----------------------|:----------------------------------------|
| `accepted`            | Site geçerli bir liste sağladı ve sunucunuz şu anda bunu kullanıyor. |
| `same_sequence`       | Site, mevcut listenizle aynı sıralama numarasına sahip bir liste sağladı, bu nedenle sunucunuz mevcut listesini kullanmaya devam etti. |
| `unsupported_version` | Site, bir liste sağladı, ancak sunucunuz bu liste formatı sürüm numarasını desteklemiyor. Daha yeni bir yazılım sürümüne `rippled'i güncellemeniz` gerekebilir. |
| `untrusted`           | Site, sunucunuzun güvenmesini sağladığı bir kriptografik anahtar çiftini imzalamış bir liste sağladı. `validators.txt` dosyanızda yazım hataları olup olmadığını kontrol etmek isteyebilir ve liste yayımlayıcısının kriptografik anahtarlarını değiştirip değiştirmediğini kontrol edebilirsiniz. |
| `stale`               | Site, sunucunuzun zaten kullandığı listeden daha düşük bir sıralama numarasına sahip bir liste sağladı. |
| `invalid`             | Site geçerli bir şekilde oluşturulmamış bir liste veya imza sağladı. |

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları yalnızca) Bu yöntem Raporlama Modunda mevcut değildir.

