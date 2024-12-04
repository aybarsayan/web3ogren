---
title: Sözlük
seoTitle: Socket.IO Terimleri Sözlüğü
sidebar_position: 2
description: Socket.IO ekosistemine dair önemli terimleri açıklayan bir sözlük. Her terim için detaylı bilgiye ulaşabilirsiniz.
tags: 
  - Socket.IO
  - terimler
  - adapter
  - transport
  - namespace
keywords: 
  - Socket.IO
  - adapter
  - transport
  - namespace
  - engine.io
---
Socket.IO ekosistemi ile ilgili terimleri burada listeleyeceğiz:

- `Adapter`
- `Engine.IO`
- `Namespace`
- `Room`
- `Transport`

## Adapter

Adapter, aşağıdakilerden sorumlu olan bir sunucu tarafı bileşenidir:

- Socket örnekleri ile `odalar` arasındaki ilişkileri saklamak
- `Tüm` (veya bir alt küme) istemcilere olayları yayınlamak

Socket.IO sunucusu ile varsayılan olarak dahil edilen [hafıza içi adapter](https://github.com/socketio/socket.io-adapter/) dışında, şu anda 5 resmi adapter bulunmaktadır:

- `Redis adapter`
- `Redis Streams adapter`
- `MongoDB adapter`
- `Postgres adapter`
- `Cluster adapter`

Hafıza içi adapter, RabbitMQ veya Google Pub/Sub gibi diğer mesajlaşma sistemlerini desteklemek için genişletilebilir.

Dokümantasyona `buradan` ulaşabilirsiniz.

:::info
**Not:** Adapterler, Socket.IO performansını artırmak için kritik öneme sahiptir.
:::

## Engine.IO

Engine.IO, sunucu ile istemci arasındaki düşük seviyeli bağlantıyı kurmaktan sorumlu olan Socket.IO'nun bir iç bileşenidir.

Daha fazla bilgiyi `buradan` bulabilirsiniz.

:::tip
Engine.IO hakkında daha fazla bilgi edinmek için resmi dökümantasyonu inceleyin.
:::

## Namespace

Namespace, sunucu tarafında uygulama mantığını ayırmaya olanak tanıyan bir kavramdır.

Dokümantasyona `buradan` ulaşabilirsiniz.

:::note
Namespace kullanarak uygulamanızın yapılandırmasını daha esnek hale getirebilirsiniz.
:::

## Room

Room, belirli bir istemci alt kümesine veri yayınlamayı sağlayan sunucu tarafında bir kavramdır.

Dokümantasyona `buradan` ulaşabilirsiniz.

:::warning
Room'lar doğru yönetilmezse istemci performansını olumsuz etkileyebilir.
:::

## Transport

Transport, sunucu ile istemci arasında bir bağlantı kurmanın düşük seviyeli yolunu temsil eder.

Şu anda uygulanmış iki transport bulunmaktadır:

- HTTP uzun-polling
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebTransport](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API)

Dokümantasyona `buradan` ulaşabilirsiniz.

:::danger
Transport yöntemlerini seçerken, uygulamanızın gereksinimlerini göz önünde bulundurun.
:::