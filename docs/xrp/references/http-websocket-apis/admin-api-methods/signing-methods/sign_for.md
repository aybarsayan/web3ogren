---
title: sign_for
seoTitle: Çok İmzalı İşlem İmza Komutu
sidebar_position: 4
description: Çok imzalı bir işlemi imzalamak için kullanılan sign_for komutunun detaylarını ve kullanım örneklerini içermektedir.
tags: 
  - çok imzalı işlem
  - sign_for
  - XRP Ledger
  - işlem imzalama
  - API komutları
keywords: 
  - çok imzalı işlem
  - sign_for
  - XRP Ledger
  - işlem imzalama
  - API komutları
---

# sign_for
[[Source]](https://github.com/XRPLF/rippled/blob/release/src/ripple/rpc/handlers/SignFor.cpp "Source")

`sign_for` komutu, bir `çok imzalı işlem` için bir imza sağlar.

partial file="/docs/_snippets/public-signing-note.md" /%}

:::info
Bu komutun [MultiSign değişikliği][] etkinleştirilmiş olmalıdır.
:::

## İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "id": "sign_for_example",
    "command": "sign_for",
    "account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
    "seed": "s████████████████████████████",
    "key_type": "ed25519",
    "tx_json": {
        "TransactionType": "TrustSet",
        "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
        "Flags": 262144,
        "LimitAmount": {
            "currency": "USD",
            "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value": "100"
        },
        "Sequence": 2,
        "SigningPubKey": "",
        "Fee": "30000"
    }
}
```


JSON-RPC
```json
{
    "method": "sign_for",
    "params": [{
        "account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
        "seed": "s████████████████████████████",
        "key_type": "ed25519",
        "tx_json": {
            "TransactionType": "TrustSet",
            "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
            "Flags": 262144,
            "LimitAmount": {
                "currency": "USD",
                "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                "value": "100"
            },
            "Sequence": 2,
            "SigningPubKey": "",
            "Fee": "30000"
        }
    }]
}
```


Commandline
```sh
#Syntax: rippled sign_for <imzalayan_adresi> <imzalayan_gizli> [çevrimdışı]
rippled sign_for rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW s████████████████████████████ '{
    "TransactionType": "TrustSet",
    "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    "Flags": 262144,
    "LimitAmount": {
        "currency": "USD",
        "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        "value": "100"
    },
    "Sequence": 2,
    "SigningPubKey": "",
    "Fee": "30000"
}'
```




İstek, aşağıdaki parametreleri içerir:

| `Alan`      | Tür                  | Açıklama                             |
|:-------------|:---------------------|:---------------------------------------|
| `account`    | String - [Adres][]   | İmza sağlayan adres.                  |
| `tx_json`    | Nesne                | İmzalanacak `İşlem`. **Dikkat:** imzalama yöntemi kullanılırken, işlemin tüm alanları sağlanmalıdır, bu alanlar arasında `Fee` ve `Sequence` de bulunmaktadır. İşlem, değeri boş bir dize olan `SigningPubKey` alanını içermelidir. Nesne isteğe bağlı olarak daha önceden toplanmış imzaları içeren bir `Signers` dizisini içerebilir. |
| `secret`       | String  | _(İsteğe Bağlı)_ İşlemi sağlayan hesabın gizli anahtarı, imzalamak için kullanılır. Gizlinizi güvensiz sunuculara veya güvensiz ağ bağlantıları üzerinden göndermeyin. `key_type`, `seed`, `seed_hex` veya `passphrase` ile kullanılamaz. |
| `seed`         | String  | _(İsteğe Bağlı)_ İşlemi sağlayan hesabın gizli anahtarı, imzalamak için kullanılır. XRP Ledger'ın [base58][] formatında olmalıdır. Sağlandığında `key_type` belirtmeniz gerekir. `secret`, `seed_hex` veya `passphrase` ile kullanılamaz. |
| `seed_hex`     | String  | _(İsteğe Bağlı)_ İşlemi sağlayan hesabın gizli anahtarı, imzalamak için kullanılır. Onaltılı formatta olmalıdır. Sağlandığında `key_type` belirtmeniz gerekir. `secret`, `seed` veya `passphrase` ile kullanılamaz. |
| `passphrase`   | String  | _(İsteğe Bağlı)_ İşlemi sağlayan hesabın gizli anahtarı, imzalamak için kullanılan bir dize parolası olarak. Sağlandığında `key_type` belirtmeniz gerekir. `secret`, `seed` veya `seed_hex` ile kullanılamaz. |
| `key_type`     | String  | _(İsteğe Bağlı)_ Bu istekte sağlanan kriptografik anahtar türü. Geçerli türler `secp256k1` veya `ed25519`'dir. Varsayılan olarak `secp256k1`dır. **Dikkat:** Ed25519 desteği deneyseldir. |

:::warning
Gizli anahtar alanından **tam olarak 1 alan** sağlamanız gerekmektedir, bu alanlardan biri aşağıdakilerden biri olabilir:
* Bir `secret` değeri sağlayın ve `key_type` alanını hariç tutun. Bu değer XRP Ledger [base58][] tohum, RFC-1751, onaltılı veya bir dize parolası olarak biçimlendirilebilir. (sadece secp256k1 anahtarları için)
* Bir `key_type` değeri sağlayın ve tam olarak bir `seed`, `seed_hex` veya `passphrase` belirtin. `secret` alanını hariç tutun. (Komut satırı sözdizimi tarafından desteklenmiyor.)
:::

## Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket
```json
{
  "id": "sign_for_example",
  "status": "success",
  "type": "response",
  "result": {
    "tx_blob": "1200142200040000240000000263D5038D7EA4C680000000000000000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E0107321EDDF4ECB8F34A168143B928D48EFE625501FB8552403BBBD3FC038A5788951D7707440C3DCA3FEDE6D785398EEAB10A46B44047FF1B0863FC4313051FB292C991D1E3A9878FABB301128FE4F86F3D8BE4706D53FA97F5536DBD31AF14CD83A5ACDEB068114D96CB910955AB40A0E987EEE82BB3CEDD4441AAAE1F1",
    "tx_json": {
      "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
      "Fee": "30000",
      "Flags": 262144,
      "LimitAmount": {
        "currency": "USD",
        "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        "value": "100"
      },
      "Sequence": 2,
      "Signers": [
        {
          "Signer": {
            "Account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
            "SigningPubKey": "EDDF4ECB8F34A168143B928D48EFE625501FB8552403BBBD3FC038A5788951D770",
            "TxnSignature": "C3DCA3FEDE6D785398EEAB10A46B44047FF1B0863FC4313051FB292C991D1E3A9878FABB301128FE4F86F3D8BE4706D53FA97F5536DBD31AF14CD83A5ACDEB06"
          }
        }
      ],
      "SigningPubKey": "",
      "TransactionType": "TrustSet",
      "hash": "5216A13A3E3CF662352F0B430C7D82B7450415B6883DD428B5EC1DF1DE45DD8C"
    }
  }
}
```


JSON-RPC
```json
200 OK

{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200142200040000240000000263D5038D7EA4C680000000000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
      "tx_json" : {
         "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
         "Fee" : "30000",
         "Flags" : 262144,
         "LimitAmount" : {
            "currency" : "USD",
            "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value" : "100"
         },
         "Sequence" : 2,
         "Signers" : [
            {
               "Signer" : {
                  "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                  "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                  "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
               }
            }
         ],
         "SigningPubKey" : "",
         "TransactionType" : "TrustSet",
         "hash" : "A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
      }
   }
}
```


Commandline
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200142200040000240000000263D5038D7EA4C680000000000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
      "tx_json" : {
         "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
         "Fee" : "30000",
         "Flags" : 262144,
         "LimitAmount" : {
            "currency" : "USD",
            "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value" : "100"
         },
         "Sequence" : 2,
         "Signers" : [
            {
               "Signer" : {
                  "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                  "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                  "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
               }
            }
         ],
         "SigningPubKey" : "",
         "TransactionType" : "TrustSet",
         "hash" : "A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
      }
   }
}
```




Yanıt, [standart format][] izler, başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`   | Tür   | Açıklama                                             |
|:----------|:-------|:--------------------------------------------------------|
| `tx_blob` | String | İmzalanmış işlemin onaltılı temsilidir, yeni eklenen imza dahil. Yeterli imzaya sahipse, bu dizeyi `submit yöntemiyle gönderebilirsiniz`. |
| `tx_json` | Nesne | `işlem spesifikasyonu` JSON formatında, `Signers` dizisine eklenen yeni imza ile. Yeterli imzaya sahipse, bu nesneyi [submit_multisigned yöntemiyle][] gönderebilirsiniz. |

## Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiş veya bir veya daha fazla gerekli alan eksik.
- `srcActNotFound` - İşlemdeki `Account`, defterde finanse edilmiş bir adres değilse.
- `srcActMalformed` - İmza adresi (`account` alanı) istekte geçerli biçimde değilse.
- `badSeed` - Sağlanan tohum değeri geçersiz formatta.
- `badSecret` - Sağlanan gizli değer geçersiz formatta.

