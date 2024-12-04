---
title: Sunucu Eklentileri
seoTitle: Sunucu Eklentileri - Connect RPC
sidebar_position: 3
description: Bu sayfa, Node.js üzerinde Connect RPClerinizi nasıl sunacağınıza dair bilgiler sunmaktadır. Farklı frameworkler için örnekler bulunmaktadır.
tags: 
  - sunucu eklentileri
  - connect rpc
  - node.js
  - fastify
  - express
keywords: 
  - sunucu eklentileri
  - connect rpc
  - node.js
  - fastify
  - express
---
Sadece bir API sunucusuna ihtiyaç duyuyorsanız, yerleşik bir Node.js sunucusu yeterli olabilir, ancak Connect ayrıca Node.js üzerinde birkaç sunucu çerçevesini de desteklemektedir.

Aşağıdaki kod parçacıkları, Connect RPC'lerinizi içeren `connect.ts` adında bir dosyayı projenize eklediğiniz varsayımına dayanmaktadır. Daha fazla bilgi için `Hizmetleri Uygulama` sayfasına bakın.

## Vanilla Node.js

Connect RPC'lerinizi, [@connectrpc/connect-node](https://www.npmjs.com/package/@connectrpc/connect-node) paketindeki `connectNodeAdapter()` fonksiyonu ile Node.js yerleşik HTTP modüllerinde çalıştırın:

```ts
import * as http from "http";
import routes from "./connect";
import { connectNodeAdapter } from "@connectrpc/connect-node";

http.createServer(
  connectNodeAdapter({ routes }) // diğer istekler için 404 ile yanıt verir
).listen(8080);
```

Fonksiyon, tüm `ortak seçenekleri` ve aşağıdaki ek seçenekleri kabul eder:

- `fallback?: NodeHandlerFn`
  Eğer hiçbir işlemci istek yolu eşleşmezse, bir 404 sunulur. Bu seçenek, bu durum için özelleştirilmiş bir geri dönüş sağlar.
- `requestPathPrefix?: string`
  Tüm işleyicileri bu ön ek altında sunar. Örneğin, "/something" ön eki, RPC foo.FooService/Bar'ı "/something/foo.FooService/Bar" altında sunar. Birçok gRPC istemci uygulamasının ön ekleri desteklemediğini unutmayın.
- `contextValues?: (req: NodeServerRequest) => ContextValues`
  Her istek için bir dizi bağlam değeri döndüren bir fonksiyon. Bağlam değerleri, hizmet uygulamasına iletilir. Daha fazla bilgi için `Bağlam Değerleri` sayfasına bakın.

:::note
HTTP/2 üzerinden, Node.js Connect, gRPC ve gRPC-Web protokollerini tüm türdeki RPC'lerle sunabilir.
HTTP 1.1 üzerinden gRPC protokolü ve çift yönlü akış RPC'leri desteklenmemektedir.
:::



[Fastify](https://www.fastify.io/) hızlı ve düşük yük gibi bir web çerçevesidir, Node.js için. Connect RPC'lerinizi sunmak istiyorsanız, bunu şiddetle öneriyoruz. Fastify ile [@connectrpc/connect-fastify](https://www.npmjs.com/package/@connectrpc/connect-fastify) paketini kullanın:

```bash
$ npm install fastify @connectrpc/connect @connectrpc/connect-node @connectrpc/connect-fastify
```

```ts
import { fastify } from "fastify";
import routes from "./connect";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";

const server = fastify();

await server.register(fastifyConnectPlugin, {
 routes
});

await server.listen({
  host: "localhost",
  port: 8080,
});
```

Eklenti, tüm `ortak seçenekleri` ve aşağıdaki ek seçenekleri kabul eder:
- `shutdownTimeoutMs?: number`
  Ayarlanırsa, sunucu [`fastify.close`](https://fastify.dev/docs/latest/Reference/Server/#close) çağrıldığında, uçuşta olan istekleri iptal etmeden önce belirli bir süre bekleyecektir.
- `shutdownError?: unknown`
  Kapatma gerçekleştiğinde kullanılacak neden. Bu bir `ConnectError` ise, istemciye iletilecektir.
- `contextValues?: (req: FastifyRequest) => ContextValues`
  Her istek için bir dizi bağlam değeri döndüren bir fonksiyon. Bağlam değerleri, hizmet uygulamasına iletilir. Daha fazla bilgi için `Bağlam Değerleri` sayfasına bakın.

:::note
HTTP/2 üzerinden, Fastify Connect, gRPC ve gRPC-Web protokollerini tüm türdeki RPC'lerle sunabilir.
HTTP 1.1 üzerinden gRPC protokolü ve çift yönlü akış desteklenmemektedir.
:::

## Next.js

[Next.js](https://nextjs.org/) Vercel tarafından desteklenen bir çerçevedir ve en son React özelliklerini kullanarak tam yığın web uygulamaları oluşturmayı sağlar. [@connectrpc/connect-next](https://www.npmjs.com/package/@connectrpc/connect-next) ile Connect RPC'lerinizi Next.js API Rotaları aracılığıyla sunabilirsiniz.

```bash
$ npm install next@"^13.0.0" @connectrpc/connect @connectrpc/connect-node @connectrpc/connect-next
```

Sunucu eklentisini etkinleştirmek için projenize `pages/api/[[...connect]].ts` dosyasını oluşturun:

```ts
import { nextJsApiRouter } from "@connectrpc/connect-next";
import routes from "./connect";

const {handler, config} = nextJsApiRouter({ routes });
export {handler as default, config};
```

Bu dosya, Next.js [catch-all API rotası](https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes)dır. Connect RPC'lerinizi `/api` ön eki ile sunacaktır. İstemci taşımanızın `baseUrl` seçeneğinde `/api` ön ekini dahil etmeyi unutmayın.

Orta katman, tüm `ortak seçenekleri` ve aşağıdaki ek seçeneği kabul eder:

- `prefix?: string`
  Tüm işleyicileri bu ön ek altında sunar. Örneğin, "/something" ön eki RPC foo.FooService/Bar'ı "/something/foo.FooService/Bar" altında sunar. Varsayılan olarak, bu Next.js için `/api`dir.
  Birçok gRPC istemci uygulamasının ön ekleri desteklemediğini unutmayın.
- `contextValues?: (req: NextApiRequest) => ContextValues`
  Her istek için bir dizi bağlam değeri döndüren bir fonksiyon. Bağlam değerleri, hizmet uygulamasına iletilir. Daha fazla bilgi için `Bağlam Değerleri` sayfasına bakın.

:::note
Next.js `http2` modülünü desteklemez. Connect protokolünü ve gRPC-Web'i sunabilirsiniz. gRPC protokolü ve çift yönlü akış desteklenmemektedir.
:::

## Express

[Express](https://expressjs.com/) uzun süredir var ve hala basitliği nedeniyle popüler. Connect RPC'lerinizi Express'e eklemek için [@connectrpc/connect-express](https://www.npmjs.com/package/@connectrpc/connect-express) tarafından sağlanan ara yazılımı kullanın:

```bash
$ npm install express @connectrpc/connect @connectrpc/connect-node @connectrpc/connect-express
```

```ts
import http from "http";
import express from "express";
import routes from "./connect";
import { expressConnectMiddleware } from "@connectrpc/connect-express";

const app = express();

app.use(expressConnectMiddleware({
 routes
}));

http.createServer(app).listen(8080);
```

Ara yazılım, tüm `ortak seçenekleri` ve aşağıdaki ek seçeneği kabul eder:

- `requestPathPrefix?: string`
  Tüm işleyicileri bu ön ek altında sunar. Örneğin, "/something" ön eki RPC foo.FooService/Bar'ı "/something/foo.FooService/Bar" altında sunar. Birçok gRPC istemci uygulamasının ön ekleri desteklemediğini unutmayın.
- `contextValues?: (req: express.Request) => ContextValues`
  Her istek için bir dizi bağlam değeri döndüren bir fonksiyon. Bağlam değerleri, hizmet uygulamasına iletilir. Daha fazla bilgi için `Bağlam Değerleri` sayfasına bakın.

:::note
Express `http2` modülünü desteklemez. Connect protokolünü ve gRPC-Web'i sunabilirsiniz. gRPC protokolü ve çift yönlü akış RPC'leri desteklenmemektedir.
:::

## Ortak Seçenekler

Tüm adaptörler bir dizi ortak seçenek alır:

- `routes: (router: ConnectRouter) => void`
  Adaptör bu fonksiyonu çağıracak ve hizmetlerinizi kaydetmenizi sağlayacaktır.
  Bir örnek için `Hizmetleri Uygulama` sayfasına bakın.
- `maxTimeoutMs?: number`
  İstemcilerin belirtebileceği `timeout'lar` için maksimum değer.
  Eğer bir istemci `maxTimeoutMs`'den daha büyük bir timeout talep ederse, sunucu `invalid_argument` hata kodu ile yanıt verir.
- `connect?: boolean`
  Rotalarınız için Connect protokolünü etkinleştirip etkinleştirmeyeceğinizi belirtir. Varsayılan olarak etkin.
- `grpcWeb?: boolean`
  Rotalarınız için gRPC-web protokolünü etkinleştirip etkinleştirmeyeceğinizi belirtir. Varsayılan olarak etkin.
- `grpc?: boolean`
  Rotalarınız için gRPC protokolünü etkinleştirip etkinleştirmeyeceğinizi belirtir. Varsayılan olarak etkin.
- `interceptors?: Interceptor[]`
  Tüm isteklere uygulanacak bir dizi ara katman. Daha fazla bilgi için `Ara Katmanlar` sayfasına bakın.
- `jsonOptions`
  Protobuf [JSON serileştirme seçenekleri](https://github.com/bufbuild/protobuf-es/blob/v2.2.1/MANUAL.md#json-serialization-options).
  Servisiniz `google.protobuf.Any` kullanıyorsa, izin verilen mesaj türleri ile bir `typeRegistry` sağlamanız gerekir.
- `binaryOptions`
  Protobuf [binary serileştirme seçenekleri](https://github.com/bufbuild/protobuf-es/blob/v2.2.1/MANUAL.md#binary-serialization-options).

## HTTP/2, TLS ve gRPC

Yukarıdaki tüm örnekler TLS (Taşıma Katmanı Güvenliği) olmadan HTTP 1.1 kullanmaktadır.

Bu, tarayıcılar ve Connect istemcileri için oldukça iyi çalışır, ancak çoğu gRPC istemcisi HTTP/2 gerektirir. Eğer gRPC istemcileri ve tarayıcılar istiyorsanız, HTTP/2 ve TLS gerekir:

|                  | Web Tarayıcıları | Connect | gRPC-Web | gRPC |
|------------------|------------------|---------|----------|------|
| HTTP/2 + TLS     | ✓                | ✓       | ✓        | ✓    |
| HTTP/2 düz metin |                  | ✓       | ✓        | ✓    |
| HTTP 1.1         | ✓                | ✓       | ✓        |      |

TLS genellikle bir bağlantı için HTTP protokol sürümünü müzakere etmek için kullanılır.
TLS olmadan, istemciye hangi HTTP sürümünü kullanacağınızı söylemelisiniz.
Örneğin, cURL veya `buf curl` kullanarak `--http2-prior-knowledge` bayrağını kullanırsınız.

Ne yazık ki, web tarayıcılarının böyle bir bayrağı yoktur ve düz metin üzerinden HTTP/2'yi kesinlikle reddederler. Eğer yerel geliştirme sırasında hem gRPC istemcileri _hem_ tarayıcı istemcileri kullanmak istiyorsanız, yerel olarak güvenilir geliştirme sertifikaları oluşturmanızı ve TLS ile HTTP/2'yi çalıştırmanızı öneririz. Bunu kurmak için sadece bir dakika alır, `Başlarken` sayfasındaki adımları izlerseniz.

## CORS

Tarayıcı istemciniz farklı bir ana bilgisayara veya porta istek yapıyorsa, tarayıcı önce bir ön kontrol isteği gönderir ve sunucunun gerçek isteği izin verip vermeyeceğine karar vermesine izin verir. Bu mekanizma Çapraz Kaynak Paylaşımı, yani CORS olarak adlandırılır.

Eğer sunucunuz CORS ön kontrol isteklerini işlemek için ayarlanmamışsa, tarayıcıda `Failed to fetch` gibi bir hata göreceksiniz veya sunucunuzdan gönderilen yanıt başlıkları istemcinize görünmez olacaktır.

[`@connectrpc/connect`](https://www.npmjs.com/package/@connectrpc/connect) paketinden `cors` nesnesi, ortak ara yazılım paketlerini yapılandırmaya yardımcı olur. Aşağıdaki örnek, bunu `Fastify` ile nasıl kullanacağınızı göstermektedir:

```ts
import fastifyCors from "@fastify/cors";
import { cors } from "@connectrpc/connect";

await server.register(fastifyCors, {
  origin: "https://demo.connectrpc.com",
  methods: cors.allowedMethods,
  allowedHeaders: [
    ...cors.allowedHeaders,
    "Custom-Request-Header"
  ],
  exposedHeaders: [
    ...cors.exposedHeaders,
    "Custom-Response-Header",
    "Trailer-Response-Id",
  ],
  // Tarayıcıların CORS bilgilerini önbelleğe almasına izin verin 
  // böylece ön kontrol isteklerinin sayısını azaltın. Modern Chrome,
  // değeri 2 saatle sınırlı tutar.
  maxAge: 2 * 60 * 60
});
```

Uygulama özel istek başlıklarını izin verilen başlıklar listesine, yanıt başlıklarını ise görünen başlıklar listesine dahil ettiğinizden emin olun. Uygulamanız eklentileri kullanıyorsa, bunlar Connect tekil RPC'leri için `Trailer-` öneki ile başlık alanları olarak gönderilecektir.

Node.js sunucularının çeşitli türleriyle CORS kullanımı hakkında ek örnekler için [Express](https://github.com/connectrpc/examples-es/tree/main/express) ve [Vanilla Node](https://github.com/connectrpc/examples-es/tree/main/vanilla-node) örneklerine, [examples-es](https://github.com/connectrpc/examples-es) deposuna bakın.