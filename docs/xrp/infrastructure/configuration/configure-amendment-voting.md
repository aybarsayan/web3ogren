---
title: Değişiklik Oylamasını Yapılandır
seoTitle: XRP Ledger Değişiklik Oylaması Yapılandırma
sidebar_position: 4
description: Doğrulayıcı sunucuların XRP Ledger protokolünde değişiklikler için oy kullanma süreci hakkında bilgi. SHAMapV2 değişikliği için oy verme yöntemleri.
tags: 
  - XRP Ledger
  - değişiklik oylaması
  - SHAMapV2
  - protokol değişiklikleri
  - Core Server
keywords: 
  - XRP Ledger
  - değişiklik oylaması
  - SHAMapV2
  - protokol değişiklikleri
  - Core Server
---

# Değişiklik Oylamasını Yapılandır

Doğrulayıcı olarak yapılandırılmış sunucular, XRP Ledger protokolüne yapılacak `değişiklikler` konusunda oy kullanabilirler. Bu, [özellik yöntemi][] gerektirir. (Bu yöntem `yönetici erişimi` gerektirir.)

:::tip
Örneğin, "SHAMapV2" değişikliğine karşı oy vermek için aşağıdaki komutu çalıştırın:
:::



WebSocket
```json
{
  "id": "herhangi_bir_id_burada",
  "command": "feature",
  "feature": "SHAMapV2",
  "vetoed": true
}
```


JSON-RPC
```json
{
    "method": "feature",
    "params": [
        {
            "feature": "SHAMapV2",
            "vetoed": true
        }
    ]
}
```


Komut Satırı
```sh
rippled feature SHAMapV2 reject
```




:::info
Değişikliğin kısa adı büyük/küçük harfe duyarlıdır. Ayrıca, bir değişikliğin ID'sini onaltılık olarak da kullanabilirsiniz, bu durum büyük/küçük harfe duyarlı değildir.
:::

## Konfigürasyon Dosyasını Kullanma

Eğer değişiklik oylamasını yapılandırmak için konfigürasyon dosyasını kullanmayı tercih ediyorsanız, her açık oy için başlatıldığında komutu otomatik olarak çalıştırmak üzere `[rpc_startup]` bölümüne bir satır ekleyebilirsiniz. Örneğin:

```
[rpc_startup]
{ "command": "feature", "feature": "SHAMapV2", "vetoed": true }
```

Değişikliklerin etkili olması için sunucunuzu yeniden başlatmayı unutmayın.

:::warning
`[rpc_startup]` bölümündeki komutlar her sunucu başlatıldığında çalışır, bu da sunucu çalışırken yapılandırdığınız oy kullanma ayarlarını geçersiz kılabilir.
:::

## Ayrıca Bakınız

- `Değişiklikler`
    - `Bilinen Değişiklikler`
- [özellik yöntemi][]

