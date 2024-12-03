---
title: peer_reservations_list
seoTitle: Peer Reservations List - API Reference
sidebar_position: 4
description: Belirli eş peer sunucuları için ayrılmış slotların listesi. Bu doküman, peer rezervasyonlarının nasıl listeleneceği hakkında bilgi sağlar.
tags: 
  - eş rezervasyonları
  - peer sunucuları
  - JSON-RPC
  - WebSocket
  - API yanıtı
keywords: 
  - eş rezervasyonları
  - peer sunucuları
  - JSON-RPC
  - WebSocket
  - API yanıtı
---

## peer_reservations_list
[[Kaynak]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L116 "Kaynak")

yöntemi [eş rezervasyonları][] listelemektedir.

_{code-page-name /%}} yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `admin yöntemi`dir._

### İstek Formatı

İstek formatına bir örnek:



WebSocket
```json
{
  "id": "peer_reservations_list_example_1",
  "command": "$frontmatter.seo.title %}"
}
```


JSON-RPC
```json
{
    "method": "$frontmatter.seo.title %}"
}
```


Komut Satırı
```sh
#Sentaks: $frontmatter.seo.title %}
rippled $frontmatter.seo.title %}
```




:::info
Bu istek herhangi bir parametre almaz.
:::

### Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket
```json
{
  "id": "peer_reservations_list_example_1",
  "result": {
    "reservations": [
      {
        "description": "Ripple s1 sunucusu 'WOOL'",
        "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      {
        "node": "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
      }
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
    "reservations" : [
       {
          "description" : "Ripple s1 sunucusu 'WOOL'",
          "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
       },
       {
          "node" : "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
       }
    ],
    "status" : "success"
  }
}
```


Komut Satırı
```json
Loading: "/etc/rippled.cfg"
2019-Dec-27 21:56:07.253260422 HTTPClient:NFO 127.0.0.1:5005'e bağlanıyor

{
  "result" : {
    "reservations" : [
       {
          "description" : "Ripple s1 sunucusu 'WOOL'",
          "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
       },
       {
          "node" : "n9MZRo92mzYjjsa5XcqnPC7GFYAnENo9VfJzKmpcS9EFZvw5fgwz"
       }
    ],
    "status" : "success"
  }
}
```




Yanıt, [standart formata][] uymakta olup, başarılı bir sonuç aşağıdaki alanları içermektedir:

| `Alan`        | Tür  | Açıklama                                         |
|:---------------|:------|:----------------------------------------------------|
| `reservations` | Dizi | Mevcut [eş rezervasyonların][] listesi. Her bir üye bir eş rezervasyon nesnesidir, aşağıda açıklanmıştır. |

#### Eş Rezervasyon Nesnesi

`reservations` dizisinin her bir üyesi, bir [eş rezervasyonu][] tanımlayan bir JSON nesnesidir. Bu nesne aşağıdaki alanlara sahiptir:

partial file="/docs/_snippets/peer_reservation_object.md" /%}

:::tip
Olası hata türlerini dikkate alarak, uygulamanızda doğru hata yönetimi uygulamayı unutmayın.
:::

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları yalnızca) Bu yöntem Raporlama Modu'nda mevcut değildir.

