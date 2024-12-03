---
title: ledger_cleaner
seoTitle: Ledger Cleaner Command
sidebar_position: 4
description: Defter temizleyici hizmetini bozulmuş verileri kontrol edecek şekilde yapılandırın. Bu sayfa, ledger_cleaner komutunun nasıl kullanılacağını ve yapılandırılacağını açıklamaktadır.
tags: 
  - ledger_cleaner
  - defter temizleyici
  - veri yönetimi
  - asenkron bakım
keywords: 
  - ledger_cleaner
  - defter temizleyici
  - bozulma
  - veri yönetimi
  - asenkron bakım
---

## ledger_cleaner
[[Kaynak]](https://github.com/XRPLF/rippled/blob/df54b47cd0957a31837493cd69e4d9aade0b5055/src/ripple/rpc/handlers/LedgerCleaner.cpp "Kaynak")

> `ledger_cleaner` komutu, `rippled`'in defter veritabanında bozulmaları bulup onaran asenkron bir bakım süreci olan [Defter Temizleyici](https://github.com/XRPLF/rippled/blob/f313caaa73b0ac89e793195dcc2a5001786f916f/src/ripple/app/ledger/README.md#the-ledger-cleaner)'yi kontrol eder.
> — Kaynak

_`ledger_cleaner` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemidir`._

### İstek Formatı
İstek formatına bir örnek:



WebSocket
```json
{
    "command": "ledger_cleaner",
    "max_ledger": 13818756,
    "min_ledger": 13818000,
    "stop": false
}
```




İstek aşağıdaki parametreleri içerir:

| `Alan`       | Tür                      | Açıklama                      |
|:-------------|:------------------------|:------------------------------|
| `ledger`     | Numara - [Defter İndeksi][] | _(Opsiyonel)_ Sağlanırsa, sadece belirtilen defteri kontrol et ve düzelt. |
| `max_ledger` | Numara - [Defter İndeksi][] | _(Opsiyonel)_ Defter temizleyicisini, bu değere eşit veya daha düşük defter indeksleri olan defterleri kontrol etmek için yapılandır. |
| `min_ledger` | Numara - [Defter İndeksi][] | _(Opsiyonel)_ Defter temizleyicisini, bu değere eşit veya daha yüksek defter indeksleri olan defterleri kontrol etmek için yapılandır. |
| `full`       | Boolean                 | _(Opsiyonel)_ Doğruysa, belirtilen defter(ler)de defter durumu nesnelerini ve işlemleri düzelt. Varsayılan olarak yanlıştır. `ledger` sağlanırsa otomatik olarak `true` olarak ayarlanır. |
| `fix_txns`   | Boolean                 | _(Opsiyonel)_ Doğruysa, belirtilen defter(ler)deki işlemleri düzelt. Sağlanırsa `full`'ı geçersiz kılar. |
| `check_nodes`| Boolean                 | _(Opsiyonel)_ Doğruysa, belirtilen defter(ler)deki defter durumu nesnelerini düzelt. Sağlanırsa `full`'ı geçersiz kılar. |
| `stop`       | Boolean                 | _(Opsiyonel)_ Doğruysa, defter temizleyicisini devre dışı bırak. |

### Yanıt Formatı

Başarılı bir yanıt örneği:



JSON-RPC
```json
200 OK

{
   "result" : {
      "message" : "Temizleyici yapılandırıldı",
      "status" : "başarılı"
   }
}
```




Yanıt, [standart format][]'ı takip eder ve başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`    | Tür    | Açıklama                      |
|:----------|:-------|:------------------------------|
| `message` | String | Başarılı olduğunda `Temizleyici yapılandırıldı`. |

### Olası Hatalar

:::warning
* Herhangi bir [evrensel hata türü][].
* Bir parametre yanlış belirtildiğinde `internal`. (Bu bir hata; beklenen hata kodu `invalidParams`.) 
:::

