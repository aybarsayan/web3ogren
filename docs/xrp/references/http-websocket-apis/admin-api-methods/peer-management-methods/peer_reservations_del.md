---
title: peer_reservations_del
seoTitle: Remove Peer Reservation Slot
sidebar_position: 4
description: Belirli bir peer sunucusu için rezerve edilmiş bir slotu kaldırma işlemi hakkında bilgi sağlar. Komut yapılandırması ve yanıt formatı ile olası hataları içerir.
tags: 
  - peer yönetimi
  - rezervasyonlar
  - sunucu yönetimi
  - komut yanıtı
  - hata yönetimi
keywords: 
  - peer yönetimi
  - rezervasyonlar
  - sunucu yönetimi
  - komut yanıtı
  - hata yönetimi
---

# peer_reservations_del
[[Source]](https://github.com/XRPLF/rippled/blob/4a1148eb2849513dd1e7ae080288fd47ab57a376/src/ripple/rpc/handlers/Reservations.cpp#L89 "Source")

metodu, belirli bir [peer rezervasyonunu][], mevcutsa kaldırır.

_ metodu, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemi`'dir._

:::info Bir peer rezervasyonu kaldırmak, o peer bağlıysa, otomatik olarak ilgili peer'i devre dışı bırakmaz.:::

### İstek Formatı

İstek formatına bir örnek:



WebSocket
```json
{
    "id": "peer_reservations_del_example_1",
    "command": "$frontmatter.seo.title %}",
    "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
}
```


JSON-RPC
```json
{
    "method": "$frontmatter.seo.title %}",
    "params": [{
      "public_key": "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
    }]
}
```


Commandline
```sh
#Sentaks: $frontmatter.seo.title %} <public_key>
rippled $frontmatter.seo.title %} n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99
```




İstek aşağıdaki parametreyi içerir:

| `Field`     | Type                      | Açıklama                        |
|:------------|:--------------------------|:-----------------------------------|
| `public_key` | String | Kaldırılacak olan [peer rezervasyonunun][] [düğüm genel anahtarı][] , [base58][] formatında. |

---

### Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket
```json
{
  "id": "peer_reservations_del_example_1",
  "result": {
    "previous": {
      "description": "Ripple s1 sunucusu 'WOOL'",
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
   "result" : {
      "previous" : {
         "description" : "Ripple s1 sunucusu 'WOOL'",
         "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      "status" : "success"
   }
}
```


Commandline
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005'ye bağlanılıyor

{
   "result" : {
      "previous" : {
         "description" : "Ripple s1 sunucusu 'WOOL'",
         "node" : "n9Jt8awsPzWLjBCNKVEEDQnw4bQEPjezfcQ4gttD1UzbLT1FoG99"
      },
      "status" : "success"
   }
}
```




Yanıt, [standart format][]{}, başarılı bir sonuç olarak aşağıdaki alanları içerir:

| `Field` | Type   | Açıklama                                               |
|:--------|:-------|:----------------------------------------------------------|
| `previous` | Object | _(Atlanabilir)_ Bir **peer rezervasyon nesnesi**, rezervasyon silinmeden önceki son durumu gösterir. Bu alan, bir peer rezervasyonu başarıyla silinmişse her zaman sağlanır. |

:::info Belirtilen rezervasyon yoksa, bu komut boş bir sonuç nesnesi ile başarılı olarak döner. Bu durumda, `previous` alanı atlanır.:::

#### Peer Rezervasyon Nesnesi

`previous` alanı sağlanmışsa, bu peer rezervasyonunun önceki durumunu gösterir ve aşağıdaki alanları içerir:

partial file="/docs/_snippets/peer_reservation_object.md" /%}

---

### Olası Hatalar

- Herhangi bir [evrensel hata türleri][].
- `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiştir veya bir veya daha fazla gerekli alan eksiktir.
- `publicMalformed` - İsteğin `public_key` alanı geçerli değildir. Geçerli bir düğüm genel anahtarı [base58][] formatında olmalıdır.
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları için) Bu yöntem Raporlama Modu'nda mevcut değildir.

