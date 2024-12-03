---
title: validation_create
seoTitle: Create Cryptographic Keys for Network Identity in Rippled
sidebar_position: 4
description: Bu sayfa, bir rippled sunucusunun ağa kimliğini tanıtmak için kriptografik anahtarlar oluşturma sürecini açıklamaktadır.
tags: 
  - Validation Create
  - XRP Ledger
  - Cryptographic Keys
  - Rippled
  - Key Generation
keywords: 
  - validation_create
  - cryptographic keys
  - XRP Ledger
  - network identity
  - key generation
---

# validation_create
[[Source]](https://github.com/XRPLF/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/ValidationCreate.cpp "Source")

`validation_create` komutunu kullanarak, `bir rippled` sunucusunun ağa kimliğini tanıtmak için kullanabileceği kriptografik anahtarlar oluşturun. [wallet_propose yöntemi][] gibi, bu yöntem yalnızca uygun formatta bir anahtar seti oluşturur. XRP Ledger verileri veya sunucu yapılandırmasında herhangi bir değişiklik yapmaz.

> _`validation_create` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemidir`._

Sunucunuzu oluşturulan anahtar çiftini doğrulamaları imzalamak (doğrulama anahtar çifti) veya normal eşler arası iletişim için (`düğüm anahtar çifti`) kullanacak şekilde yapılandırabilirsiniz.

:::tip 
Sağlam bir doğrulayıcı yapılandırmak için, `rippled` RPM'sinde bulunan `validator-keys` aracını kullanarak çevrimdışı bir anahtar ile döndürülebilir doğrulayıcı jetonları oluşturmalısınız. Daha fazla bilgi için `Doğrulayıcı Kurulumu` başlığına bakın.
::: 

### İstek Formatı
İstek formatının bir örneği:



WebSocket
```json
{
    "id": 0,
    "command": "validation_create",
    "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
}
```


JSON-RPC
```json
{
    "method": "validation_create",
    "params": [
        {
            "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
        }
    ]
}
```


Komut Satırı
```sh
# Sözdizimi: validation_create [secret]
rippled validation_create "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
```




İstek aşağıdaki parametreleri içerir:

| `Alan`  | Tür   | Açıklama                                              |
|:---------|:-------|:---------------------------------------------------------|
| `secret` | Dize | _(İsteğe bağlı)_ Bu değeri kimlik bilgilerini oluşturmak için bir tohum olarak kullanın. Aynı gizli değer her zaman aynı kimlik bilgilerini oluşturur. Tohumu [RFC-1751](https://tools.ietf.org/html/rfc1751) formatında veya XRP Ledger'in [base58][] formatında sağlayabilirsiniz. Atlandığında, rastgele bir tohum oluşturulur. |

:::info 
Doğrulayıcınızın güvenliği, tohumunuzun entropisine bağlıdır. Güçlü bir rastgelelik kaynağı ile üretilmediği sürece gerçek ticari amaçlar için gizli bir değer kullanmayın. Ripple, yeni kimlik bilgileri oluştururken `secret` değerinin atlanmasını önerir.
:::

### Yanıt Formatı

Başarılı bir yanıtın örneği:



JSON-RPC
```json
{
   "result" : {
      "status" : "success",
      "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
      "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
      "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
   }
}
```


Komut Satırı
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success",
      "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
      "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
      "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
   }
}
```




Yanıt, [standart formata][] uygun olup, başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`                 | Tür   | Açıklama                               |
|:------------------------|:-------|:------------------------------------------|
| `validation_key`        | Dize | Bu doğrulama kimlik bilgileri için gizli anahtar, [RFC-1751](https://tools.ietf.org/html/rfc1751) formatındadır. |
| `validation_public_key` | Dize | Bu doğrulama kimlik bilgileri için genel anahtar, XRP Ledger'in [base58][] kodlu dize formatındadır. |
| `validation_seed`       | Dize | Bu doğrulama kimlik bilgileri için gizli anahtar, XRP Ledger'in [base58][] kodlu dize formatındadır. |

### Olası Hatalar

* Herhangi bir [evrensel hata türü][].
* `badSeed` - İstek geçersiz bir tohum değeri sağladı. Bu genellikle tohum değerinin, bir hesap adresi veya doğrulama genel anahtarı gibi farklı bir formatta geçerli bir dize gibi göründüğü anlamına gelir.

