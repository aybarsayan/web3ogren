---
title: can_delete
seoTitle: Online Deletion Method for ledgers
sidebar_position: 4
description: can_delete provides online deletion capabilities for specific ledgers. It communicates the latest ledger version eligible for deletion if advisor deletion is enabled.
tags: 
  - online deletion
  - ledger
  - can_delete
  - management method
keywords: 
  - online deletion
  - ledger
  - can_delete
  - data retention
  - management
---

## can_delete
[[Kaynak]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/CanDelete.cpp "Kaynak")

`can_delete` yöntemi, çevrimiçi silme işlemi `danışman silme etkinleştirildiğinde` silinebilmesi olasılığı olan en son defter versiyonunu `rippled` sunucusuna bildirir. Danışman silme etkin değilse, bu yöntem hiçbir şey yapmaz.

:::note
_`can_delete` yöntemi, yetkisiz kullanıcılar tarafından çalıştırılamayan bir `yönetici yöntemi`dir._

### İstek Formatı

İstek formatının bir örneği:



WebSocket
```json
{
  "id": 2,
  "command": "can_delete",
  "can_delete": 11320417
}
```


JSON-RPC
```json
{
    "method": "can_delete",
    "params": [
        {
            "can_delete": 11320417
        }
    ]
}
```


Komut Satırı
```sh
# Söz Dizimi: can_delete [<ledger_index>|<ledger_hash>|now|always|never]
rippled can_delete 11320417
```




İstek aşağıdaki parametreyi kabul eder:

| `Alan`      | Tür              | Açıklama                               |
|:-------------|:------------------|:------------------------------------------|
| `can_delete` | String veya Tam Sayı | _(Opsiyonel)_ Silinmeye izin verilen maksimum defter versiyonunun [Defter İndeksi][] . `never` özel durumu çevrimiçi silmeyi devre dışı bırakır. `always` özel durumu danışman silme kapalıymış gibi otomatik çevrimiçi silmeyi etkinleştirir. `now` özel durumu, yapılandırılmış `online_delete` değerini karşılayan veya onu aşan bir sonraki onaylanmış defterde çevrimiçi silmeye izin verir. Atlanırsa, sunucu değişiklik yapmaz (ancak yine de mevcut `can_delete` değerini yanıtlar). |

### Yanıt Formatı

Yanıt, [standart format][] 'ı takip eder ve başarılı bir sonuç aşağıdaki alanları içerir:

| `Alan`      | Tür    | Açıklama                                         |
|:-------------|:--------|:----------------------------------------------------|
| `can_delete` | Tam Sayı | Çevrimiçi silme rutini tarafından silinebilir maksimum defter indeksidir. |

:::tip
Mevcut `can_delete` ayarını sorgulamak için bu komutu parametre olmadan kullanın.

### Olası Hatalar

- Herhangi bir [evrensel hata türü][].
- `invalidParams` - Bir veya daha fazla alan yanlış belirtildiyse veya bir veya daha fazla gerekli alan eksikse.
- `lgrNotFound` - İstek üzerindeki `can_delete` alanı tarafından belirtilen defter mevcut değilse veya mevcut olsa bile sunucu onu bulamıyorsa.
- `notEnabled` - Eğer çevrimiçi silme veya danışman silme sunucunun yapılandırmasında etkin değilse.
- `notReady` - Sunucu, çevrimiçi silmeyi o anda çalıştırmaya hazır değil. Bu genellikle sunucunun yeni açıldığı ve henüz onaylanmış bir defter almadığı anlamına gelir.
- `reportingUnsupported` - ([Raporlama Modu][] sunucuları sadece) Bu yöntem Raporlama Modunda mevcut değil.

## Ayrıca Bakınız

- `Çevrimiçi Silme`
- `Danışman Silmeyi Yapılandır`

