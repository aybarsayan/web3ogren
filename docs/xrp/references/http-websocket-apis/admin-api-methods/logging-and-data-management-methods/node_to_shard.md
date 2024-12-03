---
title: node_to_shard
seoTitle: Veri Kopyalama Yönetimi
sidebar_position: 4
description: Defter deposundan parça deposuna veri kopyalama. Bu belge, node_to_shard yönetim yönteminin nasıl kullanılacağını açıklar ve istek ile yanıt formatlarını detaylandırır.
tags: 
  - veri kopyalama
  - parça deposu
  - yönetim yöntemi
  - WebSocket
  - JSON-RPC
  - hata yönetimi
  - veri yanıtları
keywords: 
  - veri kopyalama
  - parça deposu
  - yönetim yöntemi
  - WebSocket
  - JSON-RPC
  - hata yönetimi
  - veri yanıtları
---

# node_to_shard
[[Kaynak]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/rpc/handlers/NodeToShard.cpp "Kaynak")

yöntemi, defter deposundan `parça deposuna` veri kopyalamayı yönetir. Veriyi kopyalama işlemini başlatabilir, durdurabilir veya durumunu kontrol edebilir.

::::tip
**Önemli Not**: `code-page-name /%}` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetim yöntemidir`.
::::

### İstek Formatı

İstek formatına bir örnek:



WebSocket
```json
{
    "command": "$frontmatter.seo.title %}",
    "action": "start"
}
```


JSON-RPC
```json
{
    "method": "$frontmatter.seo.title %}",
    "params": [{
        "action": "start"
    }]
}
```


Komut Satırı
```sh
# Söz Dizimi: $frontmatter.seo.title %} start|stop|status
rippled $frontmatter.seo.title %} start
```




İstek aşağıdaki parametreleri içerir:

| `Alan`  | Tür   | Açıklama                                              |
|:---------|:-------|:---------------------------------------------------------|
| `action` | String | Yapılacak eyleme bağlı olarak `start`, `stop` veya `status`. |

### Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket
```json
{
  "result": {
    "message": "Veritabanı içe aktarma başlatıldı..."
  },
  "status": "success",
  "type": "response"
}
```


JSON-RPC
```json
{
   "result" : {
      "message" : "Veritabanı içe aktarma başlatıldı...",
      "status" : "success"
   }
}
```


Komut Satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005 adresine bağlanıyor

{
   "result" : {
      "message" : "Veritabanı içe aktarma başlatıldı...",
      "status" : "success"
   }
}
```




Yanıt, `standart formata` uyum sağlar ve başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`   | Tür   | Açıklama                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | String | Komuta verilen yanıt olarak gerçekleştirilen eylemi belirten insan tarafından okunabilir bir mesaj. |

---

### Olası Hatalar

- Herhangi bir `evrensel hata türü`.
- `internal` - Bir kopyalama işlemi çalışmadığında, durumunu kontrol etmeye çalışırsanız.
- `notEnabled` - Sunucu, `tarih parçalarını` saklayacak şekilde yapılandırılmadıysa.
- `invalidParams` - Bir veya daha fazla alan yanlış belirtilmişse ya da bir veya daha fazla zorunlu alan eksikse.

::::warning
**Dikkat**: Hatalar kontrol edilmezse sistemde beklenmeyen davranışlar ortaya çıkabilir.
::::

