---
title: Değişiklik Engelli rippled Sunucusu
seoTitle: Değişiklik Engelli rippled Sunucusu Çözümleme
sidebar_position: 4
description: Değişiklik engelli bir rippled sunucusunu çözümlemek için gereken adımları öğrenin. Sorunun kök nedenlerini anlayarak etkili bir çözüm geliştirin.
tags: 
  - rippled
  - amendment blocked
  - server troubleshooting
  - JSON-RPC
  - network status
keywords: 
  - rippled
  - amendment blocked
  - server troubleshooting
  - JSON-RPC
  - network status
---

## rippled Sunucusu Değişiklik Engelli

Değişiklik engelli olan sunucular, bir defterin geçerliliğini belirleyemez, işlem gönderebilir veya işleyemez veya konsensüs sürecine katılamazlar.

`rippled` sunucunuzun `değişiklik engelli` olduğunun ilk işaretlerinden biri, işlem gönderdiğinizde dönen `değişiklikEngelli` hatasıdır. İşte bir `değişiklikEngelli` hatasına bir örnek:

```json
{
   "result":{
      "error":"amendmentBlocked",
      "error_code":14,
      "error_message":"Değişiklik engelli, güncelleme gerekli.",
      "request":{
         "command":"submit",
         "tx_blob":"479H0KQ4LUUXIHL48WCVN0C9VD7HWSX0MG1UPYNXK6PI9HLGBU2U10K3HPFJSROFEG5VD749WDPHWSHXXO72BOSY2G8TWUDOJNLRTR9LTT8PSOB9NNZ485EY2RD9D80FLDFRBVMP1RKMELILD7I922D6TBCAZK30CSV6KDEDUMYABE0XB9EH8C4LE98LMU91I9ZV2APETJD4AYFEN0VNMIT1XQ122Y2OOXO45GJ737HHM5XX88RY7CXHVWJ5JJ7NYW6T1EEBW9UE0NLB2497YBP9V1XVAEK8JJYVRVW0L03ZDXFY8BBHP6UBU7ZNR0JU9GJQPNHG0DK86S4LLYDN0BTCF4KWV2J4DEB6DAX4BDLNPT87MM75G70DFE9W0R6HRNWCH0X075WHAXPSH7S3CSNXPPA6PDO6UA1RCCZOVZ99H7968Q37HACMD8EZ8SU81V4KNRXM46N520S4FVZNSJHA"
      },
      "status":"error"
   }
}
```

Aşağıdaki `rippled` günlük mesajı da sunucunuzun değişiklik engelli olduğunu gösterir:

```
2018-Feb-12 19:38:30 LedgerMaster:ERR Bir veya daha fazla desteklenmeyen değişiklik etkinleştirildi: sunucu engelli.
```

`rippled` sunucunuzun değişiklik engelli olduğunu `server_info` komutunu kullanarak doğrulayabilirsiniz. Yanıtta, `result.info.amendment_blocked` değerini kontrol edin. Eğer `amendment_blocked` `true` olarak ayarlandıysa, sunucunuz değişiklik engellidir.

**Örnek JSON-RPC Yanıtı:**

```json
{
    "result": {
        "info": {
            "amendment_blocked": true,
            "build_version": "0.80.1",
            "complete_ledgers": "6658438-6658596",
            "hostid": "ip-10-30-96-212.us-west-2.compute.internal",
            "io_latency_ms": 1,
            "last_close": {
                "converge_time_s": 2,
                "proposers": 10
            },
...
        },
        "status": "success"
    }
}
```

## Sunucuları Engeli Kaldırma

En kolay çözüm, `rippled`'in en son sürümüne güncellemektir, ancak duruma göre, sunucunuzu engelleyen değişiklikle birlikte daha eski bir sürüme güncelleyebilirsiniz.

:::danger
**Uyarı:** En yeni `rippled` sürümü güvenlik veya diğer acil düzeltmeler sağlıyorsa, mümkün olan en kısa sürede en yeni sürüme yükseltmeniz gerekir.
:::

`rippled` sunucunuzu, en yeni sürümden daha eski bir sürüme güncelleyerek engelini kaldırıp kaldıramayacağınızı belirlemek için, sunucunuzu engelleyen hangi özelliklerin olduğunu öğrenin ve ardından engelleme özelliklerini destekleyen `rippled` sürümünü araştırın.

`rippled` sunucunuzu engelleyen hangi özelliklerin bulunduğunu öğrenmek için `feature` yönetici komutunu kullanın. Aşağıdaki değerlere sahip özellikleri arayın:

```
"enabled" : true
"supported" : false
```

Bu değerler, değişikliğin en son defterde gereklidir, ancak sunucunuz desteklemez.

**Örnek JSON-RPC Yanıtı:**

```json
{
    "result": {
        "features": {
            "07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104": {
                "enabled": true,
                "name": "Escrow",
                "supported": true,
                "vetoed": false
            },
            "08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647": {
                "enabled": true,
                "name": "PayChan",
                "supported": true,
                "vetoed": false
            },
            "1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146": {
                "enabled": false,
                "name": "CryptoConditions",
                "supported": true,
                "vetoed": false
            },
            "157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            }
        },
        "status": "success"
    }
}
```

Bu örnekte, aşağıdaki özelliklerle yaşanan çakışmalar `rippled` sunucunuzun değişiklik engelli olmasına neden olmaktadır:

* `157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1`
* `67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172`
* `F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064`

Bu özellikleri destekleyen `rippled` sürümünü öğrenmek için `Bilinen Değişiklikler` sayfasına bakın.