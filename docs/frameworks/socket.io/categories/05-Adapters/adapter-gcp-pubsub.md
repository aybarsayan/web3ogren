---
title: Google Cloud Pub/Sub adaptörü
seoTitle: Google Cloud Pub/Sub Adapter Overview
sidebar_position: 7
description: Google Cloud Pub/Sub adaptörünü kullanarak Socket.IO ile mesaj iletimi sağlamak için gerekli bilgiler. Bu adaptörün desteklediği özellikler ve kullanım örnekleri hakkında detaylar içerir.
tags: 
  - Google Cloud
  - Pub/Sub
  - Socket.IO
  - Adaptör
  - İletişim
keywords: 
  - Google Cloud
  - Pub/Sub
  - Socket.IO
  - adaptör
  - mesaj iletimi
---
## Nasıl çalışır

Bu adaptör, Socket.IO kümesindeki düğümler arasında mesajları iletmek için [Google Cloud Pub/Sub hizmetini](https://cloud.google.com/pubsub/docs/overview) kullanır.

Bu adaptörün kaynak kodu [burada](https://github.com/socketio/socket.io-gcp-pubsub-adapter) bulunmaktadır.

## Desteklenen özellikler

| Özellik                         | `socket.io` versiyonu                 | Destek                                        |
|---------------------------------|--------------------------------------|-----------------------------------------------|
| Socket yönetimi                 | `4.0.0`                              | :white_check_mark: EVET (versiyon `0.1.0`'dan beri) |
| Sunucular arası iletişim        | `4.1.0`                              | :white_check_mark: EVET (versiyon `0.1.0`'dan beri) |
| Onaylı yayım                    | `4.5.0` | :white_check_mark: EVET (versiyon `0.1.0`'dan beri) |
| Bağlantı durumu kurtarma       | `4.6.0` | :x: HAYIR                                      |

## Kurulum

```
npm install @socket.io/gcp-pubsub-adapter
```

## Kullanım

```js
import { PubSub } from "@google-cloud/pubsub";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/gcp-pubsub-adapter";

const pubsub = new PubSub({
  projectId: "your-project-id"
});

const topic = pubsub.topic(topicNameOrId);

const io = new Server({
  adapter: createAdapter(topic)
});

// pub/sub aboneliğinin oluşturulmasını bekleyin
await io.of("/").adapter.init();

io.listen(3000);
```

## Seçenekler

| İsim                   | Açıklama                                                                                                           | Varsayılan değeri  |
|-----------------------|-------------------------------------------------------------------------------------------------------------------|--------------------|
| `subscriptionPrefix`   | Oluşturulacak yeni aboneliğin ön eki.                                                                             | `socket.io`        |
| `subscriptionOptions`  | Aboneliği oluşturmak için kullanılan seçenekler.                                                                   | `-`                |
| `heartbeatInterval`    | İki kalp atışı arasındaki ms sayısı.                                                                              | `5_000`            |
| `heartbeatTimeout`     | Bir düğümün kapalı sayılmadan önceki kalp atışı olmadan geçen ms sayısı.                                          | `10_000`           |

## Son sürümler

| Versiyon | Yayın tarihi | Yayın notları                                                                         | Fark |
|----------|--------------|-------------------------------------------------------------------------------------|------|
| `0.1.0`  | Mart 2024    | [link](https://github.com/socketio/socket.io-gcp-pubsub-adapter/releases/tag/0.1.0) | `-`  |

[Tam değişiklik günlüğü](https://github.com/socketio/socket.io-gcp-pubsub-adapter/blob/main/CHANGELOG.md)

:::tip
Bu adaptörü kullanmadan önce [Google Cloud Pub/Sub hizmetini](https://cloud.google.com/pubsub/docs/overview) anlamanız önerilir.
:::