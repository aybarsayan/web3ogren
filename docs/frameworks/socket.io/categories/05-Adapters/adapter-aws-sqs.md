---
title: AWS SQS adaptörü
seoTitle: AWS SQS Adapter for Socket.IO
sidebar_position: 8
description: Bu belge, AWS SQS adaptörünün kullanımını ve desteklenen özelliklerini açıklamaktadır. Socket.IO projelerinde nasıl entegre edileceğine dair bilgiler sunar.
tags: 
  - AWS
  - Socket.IO
  - mesajlaşma adaptörü
  - SQS
keywords: 
  - AWS
  - SQS
  - Socket.IO
  - adaptör
---
## Nasıl çalışır

Bu adaptör, [AWS Simple Queue Service](https://aws.amazon.com/sqs/) kullanarak bir Socket.IO kümesinin düğümleri arasında mesaj iletmektedir.

Mevcut [`socket.io-sqs`](https://github.com/thinkalpha/socket.io-sqs) paketinin aksine, bu paket ikili yükleri ve dinamik ad alanlarını desteklemektedir.

Bu adaptörün kaynak kodu [burada](https://github.com/socketio/socket.io-aws-sqs-adapter) bulunabilir.

## Desteklenen özellikler

| Özellik                         | `socket.io` sürümü                  | Destek                                        |
|---------------------------------|-------------------------------------|-----------------------------------------------|
| Socket yönetimi                 | `4.0.0`                             | :white_check_mark: EVET (sürüm `0.1.0`'dan beri) |
| Sunucular arası iletişim        | `4.1.0`                             | :white_check_mark: EVET (sürüm `0.1.0`'dan beri) |
| Onaylı yayın                    | `4.5.0` | :white_check_mark: EVET (sürüm `0.1.0`'dan beri) |
| Bağlantı durumu kurtarma       | `4.6.0` | :x: HAYIR                                     |

## Kurulum

```
npm install @socket.io/aws-sqs-adapter
```

## Kullanım

```js
import { SNS } from "@aws-sdk/client-sns";
import { SQS } from "@aws-sdk/client-sqs";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/aws-sqs-adapter";

const snsClient = new SNS();
const sqsClient = new SQS();

const io = new Server({
  adapter: createAdapter(snsClient, sqsClient)
});

// SQS kuyruğunun oluşturulmasını bekleyin
await io.of("/").adapter.init();

io.listen(3000);
```

## Seçenekler

| İsim                | Açıklama                                                          | Varsayılan değer |
|---------------------|-------------------------------------------------------------------|------------------|
| `topicName`         | SNS konusunun adı.                                               | `socket.io`      |
| `topicTags`         | Yeni SNS konusuna uygulanacak etiketler.                        | `-`              |
| `queuePrefix`       | SQS kuyruğunun öneki.                                           | `socket.io`      |
| `queueTags`         | Yeni SQS kuyruğuna uygulanacak etiketler.                        | `-`              |
| `heartbeatInterval` | İki kalp atışı arasındaki ms sayısı.                             | `5_000`          |
| `heartbeatTimeout`  | Bir düğümün kapalı olduğu değerlendirilmeden önce kalp atışı olmadan geçen ms sayısı. | `10_000`         |

## Son sürümler

| Sürüm   | Çıkış tarihi   | Sürüm notları                                                                  | Fark                                                                                            |
|---------|----------------|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `0.1.1` | Haziran 2024   | [link](https://github.com/socketio/socket.io-aws-sqs-adapter/releases/tag/0.1.1) | [`0.1.0...0.1.1`](https://github.com/socketio/socket.io-aws-sqs-adapter/compare/0.1.0...0.1.1) |
| `0.1.0` | Mart 2024      | [link](https://github.com/socketio/socket.io-aws-sqs-adapter/releases/tag/0.1.0) | `-`                                                                                             |

[Tam değişiklik günlüğü](https://github.com/socketio/socket.io-aws-sqs-adapter/blob/main/CHANGELOG.md)

:::tip
Bu adaptörü kullanırken AWS kimlik bilgilerinizi doğru bir şekilde yapılandırdığınızdan emin olun.
:::

:::info
Adaptör, Socket.IO uygulamanızın ölçeklenebilirliğini artırabilir ve mesajlaşma işlevselliğini geliştirebilir.
:::