---
sidebar_position: 8
description: Bu API, düğüm sağlığını ölçmek için kullanılabilir. Düğüm sağlığını test ederken Camino belgelerini referans olarak kullanın. Yardımcı örnekler sağlanmıştır.
---

# Sağlık API'si

Bu API, düğüm sağlığını ölçmek için kullanılabilir.

Düğümün sağlığını belirten bir HTTP durum kodu yanıtı almak için `/ext/health` adresine bir `GET` isteği gönderin. Eğer düğüm sağlıklıysa, `200` durum kodu döndürülür. Eğer bir düğümün sağlığı hakkında daha fazla bilgi almak istiyorsanız, aşağıdaki yöntemleri kullanabilirsiniz.

## Format

Bu API, `json 2.0` RPC formatını kullanır. JSON RPC çağrıları hakkında daha fazla bilgi için  bakın.

## Uç Nokta

```text
/ext/health
```

## Yöntemler

### health&#46;health

Düğüm, her 30 saniyede bir sağlık kontrolleri gerçekleştirmektedir; bu kontroller arasında her zincirin sağlık kontrolü de bulunmaktadır. Bu yöntem, son sağlık kontrolü sonuçlarının bir setini döndürmektedir.

**İmza**

```sh
health.health() -> {
    checks: []{
        checkName: {
            message: JSON,
            error: JSON,
            timestamp: string,
            duration: int,
            contiguousFailures: int,
            timeOfFirstFailure: int
        }
    },
    healthy: bool
}
```

`healthy`, tüm sağlık kontrolleri başarılıysa true olarak döner.

`checks`, sağlık kontrolü yanıtlarının bir listesidir.

- Bir kontrol yanıtı, ek bağlam içeren bir `message` içerebilir.
- Bir kontrol yanıtı, kontrolün neden başarısız olduğunu açıklayan bir `error` içerebilir.
- `timestamp`, son sağlık kontrolünün zaman damgasıdır.
- `duration`, son sağlık kontrolünün yürütme süresi, nanosecond cinsindendir.
- `contiguousFailures`, bu kontrolün peş peşe kaç kez başarısız olduğunu gösterir.
- `timeOfFirstFailure`, bu kontrolün ilk kez başarısız olduğu zamandır.

Bu ölçümler hakkında daha fazla bilgi,  kütüphanesinin belgelerinde bulunabilir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"health.health"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/health
```

**Örnek Yanıt**

Bu örnek yanıtında, C-Zincir’in sağlık kontrolü başarısız olmaktadır.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "checks": {
      "C": {
        "message": null,
        "error": {
          "message": "örnek hata mesajı"
        },
        "timestamp": "2020-10-14T14:04:20.57759662Z",
        "duration": 465253,
        "contiguousFailures": 50,
        "timeOfFirstFailure": "2020-10-14T13:16:10.576435413Z"
      },
      "P": {
        "message": {
          "percentConnected": 0.9967694992864075
        },
        "timestamp": "2020-10-14T14:04:08.668743851Z",
        "duration": 433363830,
        "contiguousFailures": 0,
        "timeOfFirstFailure": null
      },
      "X": {
        "timestamp": "2020-10-14T14:04:20.3962705Z",
        "duration": 1853,
        "contiguousFailures": 0,
        "timeOfFirstFailure": null
      },
      "chains.default.bootstrapped": {
        "timestamp": "2020-10-14T14:04:04.238623814Z",
        "duration": 8075,
        "contiguousFailures": 0,
        "timeOfFirstFailure": null
      },
      "network.validators.heartbeat": {
        "message": {
          "heartbeat": 1602684245
        },
        "timestamp": "2020-10-14T14:04:05.610007874Z",
        "duration": 6124,
        "contiguousFailures": 0,
        "timeOfFirstFailure": null
      }
    },
    "healthy": false
  },
  "id": 1
}