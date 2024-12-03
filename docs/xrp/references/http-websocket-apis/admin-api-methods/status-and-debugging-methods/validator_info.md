---
title: Validator Information
seoTitle: Comprehensive Guide to Validator Information
sidebar_position: 10
description: Sunucunun doğrulayıcı olarak yapılandırılmışsa, doğrulama ayarlarını almak için kullanılan yöntemleri açıklar. Bu belge, sunucu üzerinden doğrulayıcı bilgilerine nasıl erişileceğini ve yanıt formatını açıklamaktadır.
tags: 
  - doğrulayıcı bilgileri
  - sunucu ayarları
  - WebSocket
  - JSON-RPC
  - geliştirme
keywords: 
  - doğrulayıcı bilgileri
  - sunucu ayarları
  - doğrulayıcı ayarları
  - WebSocket
  - JSON-RPC
---
# validator_info
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/ValidatorInfo.cpp "Source")

metodu, sunucu doğrulayıcı olarak yapılandırılmışsa, mevcut doğrulayıcı ayarlarını döndürür.

:::info
metodu, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici metodu`'dır.
:::

### İstek Formatı

İstek formatının bir örneği:



WebSocket
```json
{
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
# Sözdizimi: $frontmatter.seo.title %}
rippled $frontmatter.seo.title %}
```




İstek herhangi bir parametre kabul etmez.

---

### Yanıt Formatı

Başarılı bir yanıtın örneği:



WebSocket
```json
{
  "result": {
    "domain": "mduo13.com",
    "ephemeral_key": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
    "manifest": "JAAAAAFxIe002KClGBUlRA7h5J2Y5B7Xdlxn1Z5OxY7ZC2UmqUIikHMhAkVIeB7McBf4NFsBceQQlScTVUWMdpYzwmvs115SUGDKdkcwRQIhAJnKfYWnPsBsATIIRfgkAAK+HE4zp8G8AmOPrHmLZpZAAiANiNECVQTKktoD7BEoEmS8jaFBNMgRdcG0dttPurCAGXcKbWR1bzEzLmNvbXASQPjO6wxOfhtWsJ6oMWBg8Rs5STAGvQV2ArI5MG3KbpFrNSMxbx630Ars9d9j1ORsUS5v1biZRShZfg9180JuZAo=",
    "master_key": "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
    "seq": 1
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
    "domain": "mduo13.com",
    "ephemeral_key": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
    "manifest": "JAAAAAFxIe002KClGBUlRA7h5J2Y5B7Xdlxn1Z5OxY7ZC2UmqUIikHMhAkVIeB7McBf4NFsBceQQlScTVUWMdpYzwmvs115SUGDKdkcwRQIhAJnKfYWnPsBsATIIRfgkAAK+HE4zp8G8AmOPrHmLZpZAAiANiNECVQTKktoD7BEoEmS8jaFBNMgRdcG0dttPurCAGXcKbWR1bzEzLmNvbXASQPjO6wxOfhtWsJ6oMWBg8Rs5STAGvQV2ArI5MG3KbpFrNSMxbx630Ars9d9j1ORsUS5v1biZRShZfg9180JuZAo=",
    "master_key": "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
    "seq": 1,
    "status": "success"
  }
}
```


Komut Satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005 adresine bağlanılıyor

{
   "result" : {
      "domain" : "mduo13.com",
      "ephemeral_key" : "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
      "manifest" : "JAAAAAFxIe002KClGBUlRA7h5J2Y5B7Xdlxn1Z5OxY7ZC2UmqUIikHMhAkVIeB7McBf4NFsBceQQlScTVUWMdpYzwmvs115SUGDKdkcwRQIhAJnKfYWnPsBsATIIRfgkAAK+HE4zp8G8AmOPrHmLZpZAAiANiNECVQTKktoD7BEoEmS8jaFBNMgRdcG0dttPurCAGXcKbWR1bzEzLmNvbXASQPjO6wxOfhtWsJ6oMWBg8Rs5STAGvQV2ArI5MG3KbpFrNSMxbx630Ars9d9j1ORsUS5v1biZRShZfg9180JuZAo=",
      "master_key" : "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "seq" : 1,
      "status" : "success"
   }
}
```




Yanıt, [standart format][] ile birlikte, başarılı bir sonuç içeren aşağıdaki alanları içerir:

| `Alan` | Tür   | Açıklama                                               |
|:--------|:-------|:----------------------------------------------------------|
| `domain` | String | _(Atlanabilir)_ Bu doğrulayıcı ile ilişkilendirilmiş alan adı, eğer yapılandırılmışsa. |
| `ephemeral_key` | String | _(Atlanabilir)_ Bu sunucunun doğrulama mesajlarını imzalamak için kullandığı geçici anahtar çiftinin genel anahtarı, [base58][]. Bu anahtar, doğrulayıcı yapılandırılmış token'ı değiştirirse değişir. |
| `manifest` | String | _(Atlanabilir)_ Bu doğrulayıcının yapılandırılmış token'ına karşılık gelen genel "manifesto", `ikili olarak serileştirilmiştir` ve ardından base64 kodlanmıştır. Bu alan, herhangi bir özel bilgi içermez. |
| `master_key` | String | Bu doğrulayıcının anahtar çiftinin genel anahtarı, [base58][]. Bu anahtar, doğrulayıcıyı benzersiz bir şekilde tanımlar ve doğrulayıcı geçici anahtarları döndürse bile aynı kalır. Sunucu, `[validation_seed]` yerine `[validator_token]` kullanarak yapılandırılmışsa, bu yanıtın tek alanıdır. |
| `seq` | Number | _(Atlanabilir)_ Bu doğrulayıcının yapılandırılmış doğrulama token'ı ve ayarları için bir sıra numarası. Bu numara, doğrulayıcı operatörü doğrulayıcı token'ını güncellediğinde artar ve geçici anahtarları döndürür veya ayarları değiştirir. |

:::tip
Doğrulayıcı token'ları ve anahtar rotasyonu hakkında daha fazla bilgi için [validator-keys-tool Kılavuzu](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)'na bakın.
:::

---

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `invalidParams` - Sunucu, "error_message" : "not a validator" hatasını döndürürse, sunucu `doğrulayıcı olarak yapılandırılmamıştır`.