---
title: TODO_method_name
seoTitle: Admin API Method {{currentpage.name}}
sidebar_position: 4
description: {{currentpage.name}} yöntemi, belirli bir işlevselliği sağlamak için kullanılan bir admin API yöntemidir. Yetkisiz kullanıcılar tarafından çalıştırılamaz, bu nedenle uygun yetkilere sahip olmak önemlidir.
tags: 
  - admin API
  - WebSocket
  - JSON-RPC
  - istek formatı
  - yanıt formatı
  - hata yönetimi
keywords: 
  - admin API
  - WebSocket
  - JSON-RPC
  - istek formatı
  - yanıt formatı
  - hata yönetimi
---

## TODO_method_name
[[Source]](TODO_URL "Source")

`{{currentpage.name}}` yöntemi TODO_description.

_`{{currentpage.name}}` yöntemi, `admin yöntemi` olup, yetkisiz kullanıcılar tarafından çalıştırılamaz._

:::info
Bu yöntem yalnızca belirli yetkilere sahip kullanıcılar tarafından erişilebilir. Yetkisiz erişimler başarısız olacaktır.
:::

### İstek Formatı

İstek formatına bir örnek:

*WebSocket*

```json
{
    TODO
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
        TODO
    }]
}
```

*Komut satırı*

```sh
# Söz Dizimi: {{currentpage.name}} TODO
rippled {{currentpage.name}}
```

İstek aşağıdaki parametreleri içerir:

| `Field`     | Tür                       | Açıklama                          |
|:------------|:-------------------------|:-----------------------------------|
| TODO_request_params |

:::tip
İsteklerinizi doğru formatta göndermek, yanıt sürecinde size yardımcı olacaktır. Doğru JSON yapısını korumaya dikkat edin.
:::

### Yanıt Formatı

Başarılı bir yanıt örneği:

*WebSocket*

```json
{
    TODO
}
```

*JSON-RPC*

```json
{
  TODO
}
```

*Komut satırı*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  TODO
}
```

Yanıt, [standart format][] ile uyumludur ve başarılı bir sonuç aşağıdaki alanları içerir:

| `Field` | Tür   | Açıklama                                               |
|:--------|:-------|:-------------------------------------------------------|
| TODO_response_params |

:::warning
Yanıtın beklenmedik bir formatta olması, işlem sırasında sorunlara yol açabilir. Lütfen çıktıyı dikkatle değerlendirin.
:::

### Olası Hatalar

- [evrensel hata türlerinden][] herhangi biri.
- TODO_errors
- `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiş veya bir veya daha fazla zorunlu alan eksiktir.

include '_snippets/rippled-api-links.md' %}
include '_snippets/tx-type-links.md' %}
include '_snippets/rippled_versions.md' %}