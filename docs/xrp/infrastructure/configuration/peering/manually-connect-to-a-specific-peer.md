---
title: Belirli Bir Eşe Manuel Bağlanma
seoTitle: Rippled Sunucunuz için Eşe Manuel Bağlantı
sidebar_position: 4
description: Rippled sunucunuzu XRP Ledger ağındaki belirli bir eşe manuel olarak bağlamak için adım adım kılavuz. Bu kılavuzda ön koşullar, izlenmesi gereken adımlar ve ek bilgiler bulunmaktadır.
tags: 
  - rippled
  - eş bağlantısı
  - XRP Ledger
  - peer protokolü
  - bağlantı yöntemi
keywords: 
  - rippled
  - eş bağlantısı
  - XRP Ledger
  - peer protokolü
  - bağlantı yöntemi
---

## Belirli Bir Eşe Manuel Bağlanma

Rippled sunucunuzu XRP Ledger ağındaki belirli bir `eşe` manuel olarak bağlamak için bu adımları izleyin.

:::tip İpucu
Sunucunuzun bu sunucuya başlangıçta otomatik olarak bağlandığından ve daha sonra bağlı kaldığından emin olmak istiyorsanız, o eş için `eş rezervasyonu` yapılandırmak isteyebilirsiniz.
:::

## Ön Koşullar

- Bağlanmak istediğiniz eşin IP adresini bilmelisiniz.
- Bağlanmak istediğiniz eşin XRP Ledger için hangi portu kullandığını bilmelisiniz `eş protokolü`. Varsayılan yapılandırma dosyası **51235** portunu kullanır.
- Sunucunuzdan eşe bir ağ bağlantınız olmalıdır. Örneğin, eş sunucu `gerekli portu güvenlik duvarı üzerinden aktarmalıdır`.
- Eş sunucuda kullanılabilir eş slotları olmalıdır. Eğer eş zaten maksimum eş sayısındaysa, eş sunucu işletmecisine sunucunuz için bir `eş rezervasyonu` eklemesini isteyebilirsiniz.

## Adımlar

Bağlanmak için [connect method][] yöntemini kullanın. Örneğin:



WebSocket
```
{
    "command": "connect",
    "ip": "169.54.2.151",
    "port": 51235
}
```


JSON-RPC
```
{
    "method": "connect",
    "params": [
        {
            "ip": "169.54.2.151",
            "port": 51235
        }
    ]
}
```


Komut Satırı
```
rippled connect 169.54.2.151 51235
```




## Ayrıca Bakınız

- **Kavramlar:**
    - `Eş Protokolü`
    - `rippled` Sunucusu
- **Eğitimler:**
    - `Kapsite Planlaması`
    - `rippled` Sunucusunda Sorun Giderme
- **Referanslar:**
    - [connect method][]
    - [peers method][]
    - [print method][]
    - [server_info method][]

