---
title: Kaynak Sağlayıcılar
description: Bu sayfa, kaynak sağlayıcıların nasıl yapılandığını ve ISourceProvider arayüzünün uygulama gereksinimlerini özetlemektedir. Ayrıca, veri aktarımında kullanılan önemli metodlar hakkında bilgi vermektedir.
keywords: [kaynak sağlayıcılar, veri aktarımı, ISourceProvider, createReadStream, akış]
---

# Kaynak Sağlayıcılar

## Kaynak sağlayıcı yapısı

Bir kaynak sağlayıcı, `packages/core/data-transfer/types/providers.d.ts` dosyasında bulunan ISourceProvider arayüzünü uygulamak zorundadır.

:::info
Kısacası, her aşama için Readable bir akış sağlayan bir dizi `create{_stage_}ReadStream()` metodu sunar.
:::

Bu metodlar, verisini alacak (ideal olarak kendi akışından) ve ardından her bir varlık, bağlantı (ilişki), varlık (dosya), yapılandırma varlığı veya aşamaya bağlı içerik türü şemasına göre `stream.write(entity)` işlemini gerçekleştirecektir.

:::tip
Her aşamanın akışı tüm verileri göndermeyi bitirdiğinde, aktarım motoru bir sonraki aşamaya geçmeden önce akış kapatılmalıdır.
:::