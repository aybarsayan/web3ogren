---
title: Azure Service Bus adaptörü
seoTitle: Azure Service Bus Adapter Documentation
sidebar_position: 9
description: Bu doküman, Azure Service Bus adaptörünün nasıl çalıştığını ve desteklenen özellikleri açıklar.
tags: 
  - Azure Service Bus
  - Socket.IO
  - Adapter
  - Messaging
  - JavaScript
keywords: 
  - Azure Service Bus Adapter
  - Socket.IO
  - Messaging
  - Pub/Sub
  - Node.js
---
## Nasıl çalışır {#how-it-works}

Bu adaptör, Socket.IO kümesindeki düğümler arasında mesaj iletmek için [Azure Service Bus hizmeti](https://learn.microsoft.com/en-us/azure/service-bus-messaging) kullanır.

Bu adaptörün kaynak koduna [buradan](https://github.com/socketio/socket.io-azure-service-bus-adapter) ulaşabilirsiniz.

## Desteklenen özellikler {#supported-features}

| Özellik                          | `socket.io` versiyonu                | Destek                                       |
|----------------------------------|--------------------------------------|-----------------------------------------------|
| Socket yönetimi                  | `4.0.0`                              | :white_check_mark: EVET (versiyon `0.1.0` itibarıyla) |
| Sunucular arası iletişim         | `4.1.0`                              | :white_check_mark: EVET (versiyon `0.1.0` itibarıyla) |
| Onaylı yayınlama                 | `4.5.0` | :white_check_mark: EVET (versiyon `0.1.0` itibarıyla) |
| Bağlantı durumu kurtarma         | `4.6.0` | :x: HAYIR                                      |

## Kurulum {#installation}

```
npm install @socket.io/azure-service-bus-adapter
```

## Kullanım {#usage}

```js
import { ServiceBusClient, ServiceBusAdministrationClient } from "@azure/service-bus";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/azure-service-bus-adapter";

const connectionString = "Endpoint=...";

const serviceBusClient = new ServiceBusClient(connectionString);
const serviceBusAdminClient = new ServiceBusAdministrationClient(connectionString);

const io = new Server({
  adapter: createAdapter(serviceBusClient, serviceBusAdminClient)
});

// abonelik oluşturma işlemini bekleyin
await io.of("/").adapter.init();

io.listen(3000);
```

## Seçenekler {#options}

| Ad                       | Açıklama                                                                                       | Varsayılan değer |
|--------------------------|------------------------------------------------------------------------------------------------|-------------------|
| `topicName`              | Konunun adı.                                                                                   | `socket.io`       |
| `topicOptions`           | Konuyu oluşturmak için kullanılan seçenekler.                                                  | `-`               |
| `subscriptionPrefix`     | Aboneliğin ön eki (kümedeki her Socket.IO sunucusu için bir abonelik oluşturulacaktır).       | `socket.io`       |
| `receiverOptions`        | Aboneliği oluşturmak için kullanılan seçenekler.                                              | `-`               |
| `topicOptions`           | Alıcıyı oluşturmak için kullanılan seçenekler.                                                | `-`               |
| `heartbeatInterval`      | İki kalp atışı arasındaki ms sayısı.                                                          | `5_000`           |
| `heartbeatTimeout`       | Bir düğümün kapalı olduğunu düşünmeden önce kalp atışı olmadan geçen ms sayısı.                | `10_000`          |

## Son sürümler {#latest-releases}

| Versiyon | Yayın tarihi | Yayın notları                                                                             | Fark |
|----------|--------------|-------------------------------------------------------------------------------------------|------|
| `0.1.0`  | Mart 2024    | [link](https://github.com/socketio/socket.io-azure-service-bus-adapter/releases/tag/0.1.0) | `-`  |

[Tam değişiklik günlüğü](https://github.com/socketio/socket.io-azure-service-bus-adapter/blob/main/CHANGELOG.md)