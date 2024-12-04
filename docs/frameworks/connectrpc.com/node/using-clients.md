---
title: Müşteri Kullanımı
seoTitle: Müşteri Kullanımı - Docusaurus Guide
sidebar_position: 5
description: Bu makale, Node.jsde Connect for Web kullanarak istemci oluşturmaya yönelik adımları açıklamaktadır.
tags: 
  - Connect
  - Node.js
  - gRPC
  - Transport
keywords: 
  - Connect
  - Node.js
  - gRPC
  - Transport
---
Node.js'de, Connect for Web ile kullandığınız aynı istemcileri kullanıyorsunuz, ancak  
[@connectrpc/connect-node](https://www.npmjs.com/package/@connectrpc/connect-node) üzerinden  
bir taşıma ile, [@connectrpc/connect-web](https://www.npmjs.com/package/@connectrpc/connect-web) yerine:

```typescript
import { createClient } from "@connectrpc/connect";
// highlight-next-line
import { createConnectTransport } from "@connectrpc/connect-node";

// highlight-next-line
const transport = createConnectTransport({
// highlight-next-line
  httpVersion: "1.1",
// highlight-next-line
  baseUrl: "http://demo.connectrpc.com",
// highlight-next-line
});

async function main() {
  const client = createClient(ElizaService, transport);
  const res = await client.say({
    sentence: "Mutlu hissediyorum.",
  });
  console.log(res.sentence);
}
void main();
```

:::tip
İstemciler hakkında (hata işleme, kesiciler ve başlıklar ile ek bilgileri erişim dahil) daha fazla bilgi için lütfen `Web` dokümantasyonuna bakın.
:::

İçten içe, [@connectrpc/connect-node](https://www.npmjs.com/package/@connectrpc/connect-node) taşıma fonksiyonları,  
fetch API yerine, yerleşik Node modülleri `http`, `https` ve `http2` kullanır. HTTP/2 ile, istemciler  
Connect, gRPC veya gRPC-Web protokolünü kullanabilir ve tüm RPC türlerini çağırabilir. HTTP 1.1 ile, gRPC  
protokolü ve iki yönlü akış desteklenmez.

## Connect

`createConnectTransport()` fonksiyonu, `Connect protokolü` için bir taşıma oluşturur.  
Connect taşıması için en önemli seçenekler aşağıdaki gibidir:

```ts
import { createConnectTransport } from "@connectrpc/connect-node";

const transport = createConnectTransport({
  // İstekler <baseUrl>/<package>.<service>/method şeklinde yapılacaktır
  baseUrl: "https://demo.connectrpc.com",

  // Node.js http API'sine hangi HTTP sürümünü kullanacağını söylemelisiniz.
  httpVersion: "2",

  // Kesiciler bu taşıma üzerinden çalışan tüm çağrılara uygulanır.
  interceptors: [],
});
```

## gRPC

`createGrpcTransport()` fonksiyonu, gRPC protokolü için bir taşıma oluşturur.  
gRPC taşıması için en önemli seçenekler aşağıdaki gibidir:

```ts
import { createGrpcTransport } from "@connectrpc/connect-node";

const transport = createGrpcTransport({
  // İstekler <baseUrl>/<package>.<service>/method şeklinde yapılacaktır
  baseUrl: "https://demo.connectrpc.com",

  // Kesiciler bu taşıma üzerinden çalışan tüm çağrılara uygulanır.
  interceptors: [],
});
```

:::note
gRPC taşıması HTTP/2'yi gerektirir.
:::

## gRPC-web

`createGrpcWebTransport()` fonksiyonu, gRPC-web protokolü için bir Taşıma oluşturur.  
Herhangi bir gRPC servisi, [Envoy Proxy](https://www.envoyproxy.io/) ile gRPC-web'e  
sunulabilir. ASP.NET Core, gRPC-web'i bir [middleware](https://docs.microsoft.com/en-us/aspnet/core/grpc/browser?view=aspnetcore-6.0) ile destekler.  
Connect for Node ve `connect-go` gRPC-web'i kutudan çıkar çıkmaz destekler.

```ts
import { createGrpcWebTransport } from "@connectrpc/connect-node";

const transport = createGrpcWebTransport({
  // İstekler <baseUrl>/<package>.<service>/method şeklinde yapılacaktır
  baseUrl: "https://demo.connectrpc.com",

  // Node.js http API'sine hangi HTTP sürümünü kullanacağını söylemelisiniz.
  httpVersion: "2",

  // Kesiciler bu taşıma üzerinden çalışan tüm çağrılara uygulanır.
  interceptors: [],
});
```