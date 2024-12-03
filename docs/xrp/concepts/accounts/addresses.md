---
title: Adresler
seoTitle: XRP Ledger Adresleri
sidebar_position: 4
description: Adresler, XRP Ledger hesaplarını tanımlamak için base58 formatı kullanarak oluşturulmaktadır. Bu makale, adreslerin oluşturulması ve özel adresler hakkında bilgi verir.
tags: 
  - XRP Ledger
  - adresler
  - base58
  - hesap kimliği
  - özel adresler
  - anahtar çifti
keywords: 
  - XRP Ledger
  - adresler
  - base58
  - hesap kimliği
  - özel adresler
  - anahtar çifti
---

# Adresler


Herhangi bir geçerli adres, `XRP Ledger'de bir hesaba dönüşebilir` ve fonlanması gerekir. Ayrıca, bir `normal anahtar` veya bir `imzacı listesi` üyesini temsil etmek için fonlanmamış bir adres de kullanabilirsiniz. Yalnızca fonlanmış bir hesap, bir işlemin göndericisi olabilir.

Geçerli bir adres oluşturmak, bir anahtar çifti ile başlayan tamamen matematiksel bir iştir. Öneri olmadığını doğrulamanız yeterlidir. **XRP Ledger** veya diğer herhangi bir tarafla iletişim kurmadan tamamen çevrimdışı bir anahtar çifti üretebilir ve adresini hesaplayabilirsiniz.

> **Önemli:** Bir genel anahtardan bir adrese dönüşüm, tek yönlü bir hash fonksiyonu gerektirir. Bu nedenle, "bir genel anahtarın bir adresle eşleştiğini doğrulamak mümkün, ancak yalnızca adresten genel anahtarı çıkarmak mümkün değildir." — Bu, imzalı işlemlerin, göndericinin genel anahtarını _ve_ adresini içermesinin nedenlerinden biridir.

---

## Özel Adresler

Bazı adreslerin, XRP Ledger'de özel anlamı veya tarihi kullanımları vardır. Birçok durumda, bunlar "kara delik" adresleridir, yani adres bilinen bir gizli anahtardan türetilmemiştir. Yalnızca bir adresi bilerek gizli anahtarı tahmin etmek etkili bir şekilde imkansız olduğu için, kara delik adreslerinde tutulan herhangi bir XRP sonsuza dek kaybolur.

| Adres                         | İsim               | Anlamı  | Kara Delik? |
|-------------------------------|--------------------|---------|-------------|
| `rrrrrrrrrrrrrrrrrrrrrhoLvTp` | HESAP\_SIFIR       | Bir adres, XRP Ledger'ın [base58][] kodlaması ile `0` değeridir. Peer-to-peer iletişimde, `rippled` bu adresi XRP için verici olarak kullanır. | Evet |
| `rrrrrrrrrrrrrrrrrrrrBZbvji`  | HESAP\_BİR         | Bir adres, XRP Ledger'ın [base58][] kodlaması ile `1` değeridir. Defterde, `RippleState girdileri` bu adresi bir güven hattı bakiyesi vericisinin yer tutucusu olarak kullanır. | Evet |
| `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` | Başlangıç Hesabı  | `rippled` yeni bir başlangıç defteri sıfırdan başlaması durumunda (örneğin, bağımsız modda), bu hesap tüm XRP'leri tutar. Bu adres, [hard-coded](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184) `masterpassphrase` tohum değerinden üretilmiştir. | Hayır |
| `rrrrrrrrrrrrrrrrrNAMEtxvNvQ` | Ripple İsim rezervasyonu kara delik | Geçmişte, Ripple kullanıcılarından XRP'yi bu hesaba göndermelerini istemiştir. | Evet |
| `rrrrrrrrrrrrrrrrrrrn5RM1rHd` | NaN Adresi        | Önceki [ripple-lib](https://github.com/XRPLF/xrpl.js) sürümleri, XRP Ledger'ın [base58][] string kodlama formatını kullanarak [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) değerini kodladığında bu adresi oluşturmuştur. | Evet |

---

## Adres Kodlaması

:::tip Bu teknik detaylar yalnızca XRP Ledger uyumluluğu için düşük seviyeli kütüphane yazılımları geliştiren kişiler için geçerlidir!:::

[[Kaynak]](https://github.com/XRPLF/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "Kaynak")

XRP Ledger adresleri, [base58][] ile _sözlük_ `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz` kullanılarak kodlanmıştır. XRP Ledger, birkaç tür anahtarı base58 ile kodladığı için, kodlanan verinin başına tek baytlık bir "tip öneki" (aynı zamanda "versiyon öneki" olarak da adlandırılır) ekler. Tip öneki, adreslerin genellikle base58 formatında farklı harflerle başlamasını sağlamaktadır.

Aşağıdaki diyagram, anahtarlar ve adresler arasındaki ilişkiyi göstermektedir:

Bir XRP Ledger adresini bir genel anahtardan hesaplamak için formül aşağıdaki gibidir. Tam örnek kodu için [`encode_address.js`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/_code-samples/address_encoding/js/encode_address.js) dosyasına bakabilirsiniz. Bir şifreleme anahtarından ya da tohum değerinden genel bir anahtar türetme süreci için `Anahtar Türetimi` kısmına bakınız.

1. Gerekli algoritmaları içe aktarın: SHA-256, RIPEMD160 ve base58. Base58 için sözlüğü ayarlayın.

    ```javascript
    'use strict';
    const assert = require('assert');
    const crypto = require('crypto');
    const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
    const base58 = require('base-x')(R_B58_DICT);

    assert(crypto.getHashes().includes('sha256'));
    assert(crypto.getHashes().includes('ripemd160'));
    ```

2. 33 baytlık ECDSA secp256k1 genel anahtarı veya 32 baytlık Ed25519 genel anahtarı ile başlayın. Ed25519 anahtarları için, anahtarı `0xED` baytı ile öneklendirin.

    ```javascript
    const pubkey_hex =
      'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32';
    const pubkey = Buffer.from(pubkey_hex, 'hex');
    assert(pubkey.length == 33);
    ```

3. Genel anahtarın SHA-256 hash'inin [RIPEMD160](https://en.wikipedia.org/wiki/RIPEMD) hash'ini hesaplayın. Bu değer "Hesap Kimliği"dir.

    ```javascript
    const pubkey_inner_hash = crypto.createHash('sha256').update(pubkey);
    const pubkey_outer_hash = crypto.createHash('ripemd160');
    pubkey_outer_hash.update(pubkey_inner_hash.digest());
    const account_id = pubkey_outer_hash.digest();
    ```

4. Hesap Kimliği'nin SHA-256 hash'inin SHA-256 hash'ini hesaplayın; ilk 4 baytı alın. Bu değer "kontrol toplamı"dır.

    ```javascript
    const address_type_prefix = Buffer.from([0x00]);
    const payload = Buffer.concat([address_type_prefix, account_id]);
    const chksum_hash1 = crypto.createHash('sha256').update(payload).digest();
    const chksum_hash2 = crypto.createHash('sha256').update(chksum_hash1).digest();
    const checksum =  chksum_hash2.slice(0,4);
    ```

5. Yükü ve kontrol toplamını birleştirin. Birleştirilen tamponun base58 değerini hesaplayın. Sonuç, adrestir.

    ```javascript
    const dataToEncode = Buffer.concat([payload, checksum]);
    const address = base58.encode(dataToEncode);
    console.log(address);
    // rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN
    ```

