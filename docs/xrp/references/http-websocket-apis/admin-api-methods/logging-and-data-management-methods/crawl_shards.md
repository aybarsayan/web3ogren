---
title: crawl_shards
seoTitle: An Overview of the crawl_shards RPC Method
sidebar_position: 4
description: Bu belge, eş sunuculardan tarih parçalarını almak için kullanılan crawl_shards yöntemini açıklar. İlgili talep ve yanıt formatlarını içermektedir.
tags: 
  - crawl_shards
  - veri saklama
  - yönetici yöntem
  - peer-to-peer iletişimi
keywords: 
  - crawl_shards
  - veri saklama
  - tarih parçaları
  - yönetici yöntem
  - peer-to-peer iletişimi
---

# crawl_shards
[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/CrawlShards.cpp "Kaynak")

Eş sunuculardan hangi `tarihsel defter veri parçalarının` mevcut olduğunu öğrenmek için bilgi talep eder.

_`crawl_shards` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemidir`._

### Talep Formatı

Talep formatına bir örnek:



WebSocket
```json
{
  "command": "crawl_shards",
  "public_key": true,
  "limit": 0
}
```


JSON-RPC
```json
{
  "method": "crawl_shards",
  "params": [
    {
      "public_key": true,
      "limit": 0
    }
  ]
}
```




:::info
Bu yöntem için komut satırı sözdizimi yoktur. Komut satırından erişmek için [json yöntemini][] kullanın.
:::

Talep aşağıdaki alanları içerir:

| `Alan`  | Tür    | Açıklama                                             |
|:---------|:--------|:--------------------------------------------------------|
| `public_key` | Boolean | _(Opsiyonel)_ Eğer `true` ise, yanıt, taranan sunucuların peer-to-peer iletişimleri için olan node genel anahtarlarını içerir. Varsayılan `false`'dur. |
| `limit`  | Sayı  | _(Opsiyonel)_ Kaç derinlikte aranacağını belirtir. Varsayılan 0’dır, bu sadece doğrudan eşleri arar. `1` limiti ile eşlerin eşlerini de arar. Maksimum değer `3`'tür. |

:::warning
Aranan eşlerin sayısı `limit` arttıkça üstel olarak büyür. 2 veya 3 limiti ile sunucunun API talebine yanıt vermesi birkaç saniye sürebilir.
:::

### Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket
```json
{
  "result": {
    "complete_shards": "1-2,5,8-9,584,1973,2358",
    "peers": [
      {
        "complete_shards": "1-2,8,47,371,464,554,653,857,1076,1402,1555,1708,1813,1867",
        "public_key": "n9LxFZiySnfDSvfh23N94UxsFkCjWyrchTeKHcYE6tJJQL5iejb2"
      },
      {
        "complete_shards": "8-9,584",
        "ip": "192.168.1.132",
        "public_key": "n9MN5xwYqbrj64rtfZAXQy7Y3sNxXZJeLt7Lj61a9DYEZ4SE2tQQ"
      }
    ]
  },
  "status": "success",
  "type": "response"
}
```


JSON-RPC
```json
200 OK

{
  "result": {
    "complete_shards": "1-2,5,8-9,584,1973,2358",
    "peers": [
      {
        "complete_shards": "1-2,8,47,371,464,554,653,857,1076,1402,1555,1708,1813,1867",
        "public_key": "n9LxFZiySnfDSvfh23N94UxsFkCjWyrchTeKHcYE6tJJQL5iejb2"
      },
      {
        "complete_shards": "8-9,584",
        "ip": "192.168.1.132",
        "public_key": "n9MN5xwYqbrj64rtfZAXQy7Y3sNxXZJeLt7Lj61a9DYEZ4SE2tQQ"
      }
    ],
    "status": "success"
  }
}
```




Yanıt, [standart formata][] uyar; başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`           | Tür   | Açıklama                                     |
|:------------------|:-------|:------------------------------------------------|
| `complete_shards` | String | _(Atlanabilir)_ Yerel sunucuda mevcut olan `tarih parçalarının` aralığı. Bu boş bir dize veya parçaları kapsayan ayrı bir aralık olabilir. Örneğin, `1-2,5,7-9`, parçaların 1, 2, 5, 7, 8 ve 9'un mevcut olduğunu gösterir. Bu sunucu tarih parçalamayı etkinleştirmemişse atlanır. |
| `peers`           | Dizi  | _(Atlanabilir)_ Her eşin mevcut tarih parçalarını tanımlayan **Eş Parça Nesneleri** listesidir (aşağıya bakınız). Yanıt, limit tarafından belirlenen adımda hiçbir parçanın mevcut olmadığı eşler varsa bu alanı atlar. |

#### Eş Parça Nesneleri

Yanıtın `peers` dizisinin her bir üyesi, eşler-arası ağda bir sunucuyu tanımlayan bir nesnedir. Liste, en az bir tam `tarih parçasına` sahip olan eşleri içerir. Dizideki her nesne aşağıdaki alanlara sahiptir:

| `Alan`   | Tür   | Açıklama                                             |
|:----------|:-------|:--------------------------------------------------------|
| `complete_shards` | String | Bu eşin mevcut olan tam tarih parçalarının aralığı. Bu ayrı bir aralık olabilir. Örneğin, `1-2,5,7-9`, parçaların 1, 2, 5, 7, 8 ve 9'un mevcut olduğunu gösterir. |
| `incomplete_shards` | String | _(Atlanabilir)_ Bu eşin kısmen indirilmiş tarih parçalarının ve her biri için yüzde tamamlanma durumunun virgülle ayrılmış listesi. Örneğin, `1:50,2:25`, parça 1'in %50, parça 2'nin %25 oranında indirildiğini gösterir. badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1 Yeni: rippled 1.8.1/badge %} |
| `public_key` | String | _(Ancak talep `"public_key": true` olarak belirtilmişse verilmez)_ Bu eşin peer-to-peer iletişimi için kullandığı genel anahtar, XRP Ledger'ın `base58 formatında`. |

`ip` alanı artık sağlanmamaktadır. badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1 Kaldırıldı: rippled 1.8.1/badge %}

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `invalidParams` - Talep edilen bir veya daha fazla zorunlu alan atlandı veya sağlanan bir alan yanlış veri türü olarak belirtildi.
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları sadece) Bu yöntem Raporlama Modu'nda mevcut değildir.

