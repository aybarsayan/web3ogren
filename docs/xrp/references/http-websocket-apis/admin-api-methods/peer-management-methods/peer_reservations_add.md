---
title: Add Peer Reservations
seoTitle: Add Peer Reservations to XRP Ledger
sidebar_position: 4
description: Belirli bir eş sunucusu için rezerve edilmiş bir slot ekleyin ve yönetin.
tags: 
  - peer reservations
  - XRP Ledger
  - yönetici metodu
  - rezerve slot
  - eş sunucusu
keywords: 
  - peer reservations
  - XRP Ledger
  - yönetici metodu
  - rezerve slot
  - eş sunucusu
---

# peer_reservations_add
[[Kaynak]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L36 "Kaynak")

metodu, XRP Ledger `eşler arası ağda` belirli bir eş sunucusu için rezerve edilmiş bir slot ekler veya günceller.

:::info
_%{ code-page-name /%} metodu, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici metodu`'dur._
:::

### İstek Formatı

İstek formatına bir örnek:



WebSocket
```json
{
    "id": "peer_reservations_add_example_1",
    "command": "$frontmatter.seo.title %}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99",
    "description": "Ripple s1 sunucusu 'WOOL'"
}
```


JSON-RPC
```json
{
    "method": "$frontmatter.seo.title %}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99",
      "description": "Ripple s1 sunucusu 'WOOL'"
    }]
}
```


Komut Satırı
```sh
#Sözdizimi: $frontmatter.seo.title %} <public_key> [<description>]
rippled $frontmatter.seo.title %} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99 "Ripple s1 sunucusu 'WOOL'"
```




İstek aşağıdaki parametreleri içerir:

| `Alan`       | Tür    | Açıklama                                         |
|:-------------|:-------|:---------------------------------------------------|
| `public_key` | String | Rezervasyon eklemek için kullanılan eşin `düğüm public key` değeri, `base58` formatında. |
| `description`| String | _(Opsiyonel)_ Eş rezervasyonu için özel bir açıklama. Sunucu, 64 karakterden uzun açıklamaları yeniden başlatırken keser. |

---

### Cevap Formatı

Başarılı bir yanıta bir örnek:



WebSocket
```json
{
  "id": "peer_reservations_add_example_1",
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }
  },
  "status": "success",
  "type": "response"
}
```


JSON-RPC
```json
{
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    },
    "status": "success"
  }
}
```


Komut Satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005 ile bağlanılıyor.

{
  "result": {
    "previous": {
      "description": "Maecenas atavis edite regibus, O et praesidium et dulce decus meum, Sunt quos curriculo pulverem Olympicum Collegisse iuvat metaque fervidis Evitata rotis palmaque nobilis Terrarum dominos evehit ad deos; Hunc, si mobilium turba Quiritium Certat tergeminis tollere honoribus; Illum, si proprio condidit horreo, Quidquid de Libycis verritur areis.",
      "node": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    },
    "status": "success"
  }
}
```




Cevap, başarılı bir sonuç içeren `standart formata` uyar ve aşağıdaki alanları içerir:

| `Alan`     | Tür    | Açıklama                                            |
|:-----------|:-------|:-----------------------------------------------------|
| `previous` | Nesne  | _(Atlanabilir)_ Daha önceki kayıt, aynı `düğüm public key` için, eğer zaten aynı düğüm public key ile bir rezervasyon varsa. Bu nesne, aşağıda tanımlanan **Eş Rezervasyon Nesnesi** formatında biçimlendirilmiştir. |

Eğer aynı `düğüm public key` için daha önceki bir kayıt yoksa, `result` nesnesi boştur.

#### Eş Rezervasyon Nesnesi

`previous` alanı sağlanmışsa, bu eş rezervasyonunun önceki durumunu gösterir ve şu alanları içerir:

partial file="/docs/_snippets/peer_reservation_object.md" /%}

---

### Olası Hatalar

:::warning
- `Evrensel hata türleri` herhangi biri.
- `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiş veya bir veya daha fazla zorunlu alan eksik.
- `publicMalformed` - İsteğin `public_key` alanı geçerli değil. Geçerli bir düğüm public key değeri olmalıdır ve `base58` formatında olmalıdır.
- `reportingUnsupported` - (`Raporlama Modu` sunucuları yalnızca) Bu metod Raporlama Modunda mevcut değildir.
:::

