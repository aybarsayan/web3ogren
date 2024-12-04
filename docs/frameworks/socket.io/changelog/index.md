---
title: Değişiklik Günlüğü
seoTitle: Socket.IO Change Log
sidebar_position: 1
description: Socket.IO sürümlerinin değişiklik günlüğünü ve önemli kilometre taşlarını içeren bilgiler. Versiyonlama politikası hakkında detaylar.
tags: 
  - Socket.IO
  - sürümleme
  - değişiklik günlüğü
keywords: 
  - Socket.IO
  - sürümleme
  - değişiklik
---

## Versiyonlama Politikası

Socket.IO sürümleri, [Anlamlı Sürümleme](https://semver.org/) ile yakından takip edilmektedir.

Bu, `x.y.z` sürüm numarası ile:

- kritik hata düzeltmeleri yayınlandığında, `z` numarasını artırarak bir yamanın sürümünü oluşturuyoruz (örneğin: `1.2.3`'ten `1.2.4`'e).
- yeni özellikler veya kritik olmayan düzeltmeler yayınlandığında, `y` numarasını artırarak küçük bir sürüm oluşturuyoruz (örneğin: `1.2.3`'ten `1.3.0`'a).
- kırılma değişiklikleri yayınlandığında, `x` numarasını artırarak büyük bir sürüm oluşturuyoruz (örneğin: `1.2.3`'ten `2.0.0`'a).

## Kırılma Değişiklikleri

Kırılma değişiklikleri herkes için rahatsız edicidir, bu yüzden büyük sürümlerin sayısını minimize etmeye çalışıyoruz.

Yıllar içinde Socket.IO protokolünü etkileyen iki büyük kırılma değişikliği oldu:

- Socket.IO v2 **Mayıs 2017**'de yayınlandı
- Socket.IO v3 **Kasım 2020**'de yayınlandı

:::info

Socket.IO v4 (Mart 2021'de yayınlandı), Socket.IO protokolüne herhangi bir güncelleme içermedi (yalnızca Node.js sunucu API'sinde birkaç kırılma değişikliği), bu yüzden burada sayılmıyor.

Referans: `3.x'den 4.0'a geçiş`

:::

## Önemli Kilometre Taşları

Yukarıda listelenen kırılma değişiklikleri dışında, işte Socket.IO'daki en son önemli değişiklikler:

| Sürüm               | Tarih         | Açıklama                                                                                                |
|---------------------|---------------|--------------------------------------------------------------------------------------------------------|
| `4.7.0` | Haziran 2023  | WebTransport desteği                                                                                    |
| `4.6.0` | Şubat 2023    | `Bağlantı durumu kurtarma` özelliği eklendi |
| `4.4.0`             | Kasım 2021    | `uWebSockets.js` desteği       |
| `4.1.0`             | Mayıs 2021    | `serverSideEmit()` özelliği eklendi       |
| `4.0.0`             | Mart 2021     | [TypeScript](https://www.typescriptlang.org/) ile yeniden yazıldı                                     |

## Sürüm Kullanımı

Haziran 2024 itibarıyla:

`socket.io` paketi



`socket.io-client` paketi