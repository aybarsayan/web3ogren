---
title: ledger_accept
seoTitle: Understanding the ledger_accept Command in Rippled
sidebar_position: 4
description: ledger_accept allows the server to close the current ledger and move to the next one. This command is intended for testing purposes only and is available when the rippled server runs in standalone mode.
tags: 
  - ledger
  - rpc
  - ripple
  - server
keywords: 
  - ledger
  - ledger_accept
  - ripple
  - rpc
  - server
---

## ledger_accept
[[Source]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/LedgerAccept.cpp "Kaynak")

> **Not:** `ledger_accept` yöntemi, sunucuyu mevcut işlem defterini kapatmaya ve bir sonraki defter numarasına geçmeye zorlar. Bu yöntem yalnızca test amaçlıdır ve yalnızca `rippled` sunucusu bağımsız modda çalışırken mevcuttur.

*`ledger_accept` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemi`!*

### İstek Formatı

İstek formatına bir örnek:



WebSocket
```json
{
   "id": "Defterimi kabul et!",
   "command": "ledger_accept"
}
```


Komut Satırı
```sh
# Söz dizimi: ledger_accept
rippled ledger_accept
```




> **Uyarı:** İstek hiçbir parametre kabul etmez.

### Cevap Formatı

Başarılı bir cevaba örnek:
```js
{
  "id": "Defterimi kabul et!",
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 6643240
  }
}
```

Cevap, [standart formata][] uyar ve başarılı bir sonuç aşağıdaki alanı içerir:

| `Alan`                | Tür                        | Açıklama                       |
|:----------------------|:--------------------------|:-------------------------------|
| `ledger_current_index`| İşaretsiz Tam Sayı - [Defter İndeksi][] | Yeni oluşturulan 'mevcut' defterin indeksi |

:::info
Bir defteri kapattığınızda, `rippled` bu defterde işlem sırasını belirler ve bunları yeniden oynar. Bu, mevcut deftere geçici olarak uygulanmış olan işlemlerin sonucunu değiştirebilir.
:::

### Olası Hatalar

* Herhangi bir [evrensel hata türü][].
* `notStandAlone` - Eğer `rippled` sunucusu şu anda bağımsız modda çalışmıyorsa.

