---
title: wallet_propose
seoTitle: XRP Ledger wallet_propose Method
sidebar_position: 4
description: Yeni bir hesap için anahtarlar oluşturun. Bu dokumentasyon, wallet_propose yönteminin nasıl çalıştığını ve kullanım örneklerini detaylandırmaktadır.
tags: 
  - XRP Ledger
  - wallet_propose
  - anahtar çifti
  - komut
  - rezerv gereksinimi
keywords: 
  - XRP Ledger
  - wallet_propose
  - anahtar çifti
  - komut
  - rezerv gereksinimi
---

## wallet_propose
[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/WalletPropose.cpp "Kaynak")

> `wallet_propose` yöntemini kullanarak bir anahtar çifti ve XRP Ledger adresi oluşturun. Bu komut sadece anahtar ve adres değerlerini üretir ve XRP Ledger'ı hiçbir şekilde etkilemez. Ledger'da saklanan bir fonlu adres olabilmek için, adresin `bir Ödeme işlemi` alması gerekir; bu işlem yeterli XRP sağlamalıdır ki bu, `rezerv gereksinimini` karşılasın.

> *`wallet_propose` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemi`!* (Bu komut, kullanıcıların hesap sırlarını zorlamak için ağ trafiğini dinlemesini önlemek amacıyla kısıtlanmıştır, çünkü yönetici komutları genellikle dış ağ üzerinden iletilmez.)

badge href="https://github.com/XRPLF/rippled/releases/tag/0.31.0Güncellendi: rippled 0.31.0/badge %}

### İstek Formatı

İstek formatına bir örnek:



WebSocket (anahtar tipi ile)
```json
{
    "command": "wallet_propose",
    "seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "key_type": "secp256k1"
}
```


WebSocket (anahtar tipi olmadan)
```json
{
    "command": "wallet_propose",
    "passphrase": "masterpassphrase"
}
```


JSON-RPC (anahtar tipi ile)
```json
{
    "method": "wallet_propose",
    "params": [
        {
            "seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
            "key_type": "secp256k1"
        }
    ]
}
```


JSON-RPC (anahtar tipi olmadan)
```json
{
    "method": "wallet_propose",
    "params": [
        {
            "passphrase": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"
        }
    ]
}
```


Komut Satırı
```sh
# Söz Dizimi: wallet_propose [passphrase]
rippled wallet_propose masterpassphrase
```




#### İstek Parametreleri

İstek aşağıdaki parametreleri içerebilir:

| `Alan`       | Tür    | Açıklama                                          |
|:-------------|:-------|:---------------------------------------------------|
| `key_type`   | String | Bu anahtar çiftini türetmek için hangi `imza algoritması` kullanılacağını belirtir. Geçerli değerler `ed25519` ve `secp256k1`'dir (küçük harfle). Varsayılan `secp256k1`'dir. |
| `passphrase` | String | _(İsteğe Bağlı)_ Bu tohum değerinden bir anahtar çifti ve adres oluşturun. Bu değer, [onaltılık][], XRP Ledger'ın [base58][] formatında, [RFC-1751][] formatında ya da rastgele bir dize olarak biçimlendirilebilir. `seed` veya `seed_hex` ile birlikte kullanılamaz. |
| `seed`       | String | _(İsteğe Bağlı)_ Bu tohum değerinden XRP Ledger'ın [base58][]-kodlu formatında anahtar çifti ve adres oluşturun. `passphrase` veya `seed_hex` ile birlikte kullanılamaz. |
| `seed_hex`   | String | _(İsteğe Bağlı)_ Bu tohum değerinden [onaltılık][] formatında anahtar çifti ve adres oluşturun. `passphrase` veya `seed` ile birlikte kullanılamaz. |

Aşağıdaki alanlardan **en fazla birini** sağlamalısınız: `passphrase`, `seed` veya `seed_hex`. Üçünü de atlarsanız, `rippled` rastgele bir tohum kullanır.

:::info Bu komutun komut satırı versiyonu [Ed25519](https://ed25519.cr.yp.to/) anahtarları üretemez.:::

### Tohum Belirleme

> Çoğu durumda, güçlü bir rastgelelik kaynağından üretilmiş bir tohum değeri kullanmalısınız. Bir adresin tohum değerini bilen herkes, o adres tarafından `imzalanan işlemleri göndermek` için tam yetkiye sahip olur. Genellikle, bu komutu hiçbir parametre olmadan çalıştırmak, rastgele bir tohum oluşturmanın iyi bir yoludur.

Bilinen bir tohum belirtme durumları şunlardır:

* Sadece o adresle ilişkili olan tohum değerini bildiğinizde adresinizi yeniden hesaplamak
* `rippled` işlevselliğini test etmek

Eğer bir tohum belirtirseniz, bunu aşağıdaki formatlardan birinde belirtebilirsiniz:

* XRP Ledger'ın [base58][] formatında bir gizli anahtar dizesi olarak. Örnek: `snoPBrXtMeMyMHUVTgbuqAfg1SUTb`.
* [RFC-1751][] formatında bir dize olarak (sadece secp256k1 anahtar çiftleri için). Örnek: `I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE`.
* 128-bit [onaltılık][] dizesi olarak. Örnek: `DEDCE9CE67B451D852FD4E846FCDE31C`.
* Bir tohum değeri olarak kullanmak için rastgele bir dize. Örneğin: `masterpassphrase`.

[RFC-1751]: https://tools.ietf.org/html/rfc1751
[onaltılık]: https://en.wikipedia.org/wiki/Hexadecimal

### Yanıt Formatı

Başarılı bir yanıt örneği:



WebSocket
```json
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account_id": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "key_type": "secp256k1",
    "master_key": "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
    "master_seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "master_seed_hex": "DEDCE9CE67B451D852FD4E846FCDE31C",
    "public_key": "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
    "public_key_hex": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020"
  }
}
```


JSON-RPC
```json
{
    "result": {
        "account_id": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        "key_type": "secp256k1",
        "master_key": "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
        "master_seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
        "master_seed_hex": "DEDCE9CE67B451D852FD4E846FCDE31C",
        "public_key": "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
        "public_key_hex": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
        "status": "success"
    }
}
```


Komut Satırı
```json
Yükleniyor: "/etc/rippled.cfg"
127.0.0.1:5005'e bağlanıyor

{
   "result" : {
      "account_id" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
      "key_type" : "secp256k1",
      "master_key" : "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
      "master_seed" : "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
      "master_seed_hex" : "DEDCE9CE67B451D852FD4E846FCDE31C",
      "public_key" : "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
      "public_key_hex" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "status" : "success"
   }
}
```




#### Yanıt Parametreleri

Yanıt, [standart formata](https://en.wikipedia.org/wiki/JSON-RPC), başarılı bir sonuç olan çeşitli önemli bilgileri içerir; bu, yeni (potansiyel) hesap hakkında aşağıdaki alanları kapsar:

| `Alan`            | Tür    | Açıklama                                  |
|:------------------|:-------|:-------------------------------------------|
| `key_type`        | String | Bu anahtar çiftini türetmek için hangi `imza algoritması` kullanıldı. Geçerli değerler `ed25519` ve `secp256k1`'dir (küçük harfle). |
| `master_seed`     | String | XRP Ledger'ın [base58][] kodlu dize formatındaki `master seed`. Genellikle, bu formatı kullanarak işlemleri imzalamak için bu anahtarı kullanırsınız. |
| `master_seed_hex` | String | Master seed, onaltılık formatta. |
| `master_key`      | String | **KULLANIMDIŞI** Master seed, [RFC-1751][] formatında. **Not:** `rippled` uygulaması, anahtarı RFC-1751'den kodlamadan sonra ve RFC-1751'e dönüşüm öncesinde bayt sırasını ters çevirir; XRP Ledger ile kullanılmak üzere anahtarları okur veya yazarsanız, uyumlu olmak için `rippled`'in RFC-1751 kodlaması ile aynı işlemi uygulamalısınız. |
| `account_id`      | String | XRP Ledger'ın [base58][] formatındaki hesabın [Adresi][]. Bu, public key değil, bunun bir hash'idir. Bu, XRP Ledger'daki bir hesabın birincil tanımlayıcısıdır. Ücret almak için bu bilgiyi kişilere söylersiniz ve işlemlerde kendinizi ve kime ödeme yaptığınızı belirtmek için kullanırsınız, güvenerek ve benzer şekilde. `Çoklu imza listeleri` de diğer imzacıları tanımlamak için bunları kullanır. |
| `public_key`      | String | Anahtar çiftinin public key'i, XRP Ledger'ın [base58][] kodlu dize formatında. `master_seed`'den türetilmiştir. |
| `public_key_hex`  | String | Bu, anahtar çiftinin public key'idir, onaltılık formatta. `master_seed`'den türetilmiştir. `rippled`, bir işlem üzerindeki imzayı doğrulamak için bu public key'e ihtiyaç duyar. Bu yüzden, imzalanan bir işlemin formatı `SigningPubKey` alanında public key'i içerir. |
| `warning`         | String | (Atlanabilir) İstek bir tohum değeri belirttiyse, bu alan, bunun güvensiz olabileceğine dair bir uyarı sağlar. |

Bu yöntemi kullanarak bir anahtar çifti de oluşturabilirsiniz; bu, hesap için normal bir anahtar çifti olarak kullanılır. Normal bir anahtar çiftini bir hesaba atayarak, mümkün olduğu kadar anahtar çiftinizi offline tutarak çoğu işlemi bununla imzalayabilirsiniz.

Bunu normal bir anahtar çifti olarak kullanmanın yanı sıra, aynı zamanda bir çoklu imza listesi (SignerList) üyesi olarak da kullanabilirsiniz.

**Master ve normal anahtar çiftleri hakkında daha fazla bilgi için `Kriptografik Anahtarlar` kısmına bakın.**

**Çoklu imza ve imzacı listeleri hakkında daha fazla bilgi için `Çoklu İmza` bölümüne göz atın.**

### Olası Hatalar

* Herhangi bir [evrensel hata tipi][].
* `invalidParams` - Bir veya daha fazla alan yanlış belirtilmiştir.
* `badSeed` - İstek, yasaklanan bir tohum değerini belirtti (bu `passphrase`, `seed` veya `seed_hex` alanlarında), boş bir dize gibi veya XRP Ledger adresine benzeyen bir dize.

