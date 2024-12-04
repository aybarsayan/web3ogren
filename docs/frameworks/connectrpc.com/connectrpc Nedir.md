---
title: Connect RPC Nedir?
seoTitle: Connect RPC - Modern, Hafif RPC Framework'ü
sidebar_position: 1
description: Connect RPC, gRPC ekosistemine dayalı, hafif ve modern bir RPC framework'üdür. HTTP API'lerini gRPC ile birlikte kullanmanıza olanak tanır.
tags:
  - Connect RPC
  - gRPC
  - API
  - Microservices
keywords:
  - Connect RPC
  - gRPC-Web
  - Protocol Buffers
  - HTTP API
  - Microservices
---


Connect RPC, Buf tarafından geliştirilen, gRPC ekosistemine dayalı modern bir RPC (Remote Procedure Call) framework'üdür. HTTP API'leri ile gRPC'yi sorunsuz bir şekilde bir araya getirerek, geliştiricilere esnek ve güçlü bir iletişim katmanı sunar.

:::tip Neden Connect RPC?
Connect RPC, gRPC'nin tüm avantajlarını sunarken, daha basit bir HTTP tabanlı protokol kullanır ve modern web tarayıcılarıyla tam uyumludur.
:::

## Temel Özellikler {#core-features}

### Protocol Buffers Tanımı {#protobuf-definition}

```protobuf
syntax = "proto3";

package greet.v1;

service GreetService {
  rpc Greet (GreetRequest) returns (GreetResponse) {}
  rpc GreetStream (GreetRequest) returns (stream GreetResponse) {}
}

message GreetRequest {
  string name = 1;
}

message GreetResponse {
  string greeting = 1;
}
```

### Server Implementasyonu {#server-implementation}

```typescript
import { ConnectRouter } from '@connectrpc/connect';
import { GreetService } from './gen/greet/v1/greet_connect';

export default function(router: ConnectRouter) {
  router.service(GreetService, {
    async greet(req) {
      return {
        greeting: `Merhaba, ${req.name}!`
      };
    },
    
    async *greetStream(req) {
      for (let i = 0; i < 3; i++) {
        yield {
          greeting: `Merhaba ${req.name} #${i + 1}!`
        };
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  });
}
```

### Client Kullanımı {#client-usage}

```typescript
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { GreetService } from "./gen/greet/v1/greet_connect";

const transport = createGrpcWebTransport({
  baseUrl: "https://api.example.com"
});

const client = createPromiseClient(GreetService, transport);

// Unary çağrı
const response = await client.greet({ name: "Dünya" });
console.log(response.greeting);

// Streaming çağrı
for await (const res of client.greetStream({ name: "Dünya" })) {
  console.log(res.greeting);
}
```

## Özellikler ve Avantajlar {#features-and-advantages}

### 1. Çoklu Protokol Desteği {#multi-protocol}

```typescript
import { fastify } from "fastify";
import { connectRouter } from "@connectrpc/connect-fastify";

const server = fastify();

server.register(connectRouter, {
  routes: routes,
  protocols: ['connect', 'grpc', 'grpc-web']
});
```

### 2. İnterceptor Kullanımı {#interceptors}

```typescript
import { Interceptor } from "@connectrpc/connect";

const authInterceptor: Interceptor = (next) => async (req) => {
  req.header.set("authorization", "Bearer " + getToken());
  return await next(req);
};

const client = createPromiseClient(GreetService, transport, {
  interceptors: [authInterceptor]
});
```

### 3. Error Handling {#error-handling}

```typescript
import { Code, ConnectError } from "@connectrpc/connect";

try {
  await client.greet({ name: "" });
} catch (err) {
  if (err instanceof ConnectError) {
    switch (err.code) {
      case Code.InvalidArgument:
        console.error("Geçersiz argüman");
        break;
      case Code.Unauthenticated:
        console.error("Kimlik doğrulama gerekli");
        break;
      default:
        console.error("Beklenmeyen hata:", err);
    }
  }
}
```

## İleri Düzey Özellikler {#advanced-features}

### Middleware Entegrasyonu {#middleware-integration}

```typescript
import { connectMiddleware } from "@connectrpc/connect-express";
import express from "express";

const app = express();

app.use(
  connectMiddleware({
    routes: routes,
    middleware: [
      async (req, res, next) => {
        console.log("İstek başladı:", req.url);
        await next();
        console.log("İstek tamamlandı");
      }
    ]
  })
);
```

### Şifreleme ve Güvenlik {#encryption-security}

```typescript
import { createGrpcWebTransport } from "@connectrpc/connect-web";

const transport = createGrpcWebTransport({
  baseUrl: "https://api.example.com",
  useTls: true,
  credentials: "include",
  headers: async () => ({
    "x-api-key": await getApiKey()
  })
});
```

## En İyi Pratikler {#best-practices}

1. **Schema-First Geliştirme**
   - Protocol Buffers şemalarını önce tanımlayın
   - Kod üretimi için buf generate kullanın
   - Şema versiyonlamasını doğru yapın

2. **Hata Yönetimi**
   - Uygun hata kodları kullanın
   - Detaylı hata mesajları ekleyin
   - Hatalarınızı kategorize edin

3. **Performans Optimizasyonu**
   - Streaming'i doğru kullanın
   - Batch işlemleri için uygun metodlar tasarlayın
   - Caching stratejileri belirleyin

:::warning
Production ortamında TLS kullanmak ve güvenlik önlemlerini almak önemlidir.
:::

## Kullanım Senaryoları {#use-cases}

1. Mikroservis Mimarileri
2. Gerçek Zamanlı Uygulamalar
3. Mobil Backend Servisleri
4. IoT Sistemleri
5. Yüksek Performanslı API'ler

## Örnek Proje Yapısı {#project-structure}

```
├── proto/
│   └── greet/
│       └── v1/
│           └── greet.proto
├── src/
│   ├── generated/
│   │   └── greet/
│   │       └── v1/
│   ├── services/
│   │   └── greet.ts
│   ├── interceptors/
│   │   └── auth.ts
│   └── server.ts
└── buf.gen.yaml
```

## Sonuç {#conclusion}

Connect RPC, modern web uygulamaları için güçlü ve esnek bir RPC çözümüdür. gRPC'nin avantajlarını HTTP API'lerin kullanım kolaylığıyla birleştirerek, geliştiricilere optimal bir geliştirme deneyimi sunar.

:::tip Başlarken
Daha detaylı bilgi için [resmi Connect RPC dokümantasyonunu](https://connectrpc.com/) inceleyebilirsiniz.
:::