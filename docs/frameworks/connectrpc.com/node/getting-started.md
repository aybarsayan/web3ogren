---
title: Başlarken
seoTitle: Connect ile Başlarken Node.js ile gRPC ve gRPC-Web Uyumlu APIler
sidebar_position: 1
description: Bu kılavuzda, Node.js ile nasıl bir Connect servisi oluşturulacağını öğreneceksiniz. Connect protokolü sayesinde gRPC ve gRPC-Web ile uyumlu bir API geliştireceğiz.
tags: 
  - Connect
  - Node.js
  - gRPC
  - TypeScript
  - API
keywords: 
  - Connect
  - Node.js
  - gRPC
  - TypeScript
  - API
---
Connect-Node, Connect, gRPC ve gRPC-Web uyumlu HTTP API'leri sunan bir Node.js kütüphanesidir. Node'a Connect Protokolü'nü getirir, tam TypeScript uyumluluğu ile birlikte dört tür uzak prosedür çağrısını destekler: unary ve üç çeşit akış.

:::tip
Bu on dakikalık geçiş, Node.js'de küçük bir Connect servisi oluşturmanıza yardımcı olur.
:::

Ne yazacağınızı, Connect'in sizin için neler ürettiğini ve yeni API'nizi nasıl çağıracağınızı gösterir.

## Ön koşullar

Sıfırdan bir proje oluşturacağız ve ardından yeni bir uç nokta sunmak için bunu artıracağız.

- [Node.js](https://nodejs.dev/en/download) kurulu olmalıdır - en son uzun vadeli destek sürümünü (LTS) öneriyoruz.
- Paket yöneticisi olarak `npm` kullanacağız, ancak `yarn` ve `pnpm` ile de uyumluyuz.
- Ayrıca [cURL](https://curl.se/) kullanacağız. Homebrew ve çoğu Linux paket yöneticisinden temin edilebilir.

## Proje kurulumu

TypeScript ile bir projeyi başlatalım ve bazı kod üretim araçlarını kuralım:

```bash
$ mkdir connect-example
$ cd connect-example
$ npm init -y
$ npm install typescript tsx
$ npx tsc --init
$ npm install @bufbuild/buf @bufbuild/protobuf @bufbuild/protoc-gen-es @connectrpc/connect
```

## Bir hizmet tanımlama

Öncelikle, hizmet tanımımızı içeren bir Protobuf dosyası eklememiz gerekiyor. Bu öğretici için, ünlü doğal dil işleme programı ELIZA'nın sade bir uygulaması için bir unary uç noktası oluşturacağız.

```bash
$ mkdir -p proto && touch proto/eliza.proto
```

Yukarıdaki dosyayı açın ve aşağıdaki hizmet tanımını ekleyin:

```proto
syntax = "proto3";

package connectrpc.eliza.v1;

message SayRequest {
  string sentence = 1;
}

message SayResponse {
  string sentence = 1;
}

service ElizaService {
  rpc Say(SayRequest) returns (SayResponse) {}
}
```

## Kod üretme

Kodumuzu [Buf](https://www.npmjs.com/package/@bufbuild/buf) kullanarak üreteceğiz, bu Google'ın protobuf derleyicisinin modern bir alternatifi. Buf'u daha önce kurduk, ancak işe başlamak için bir yapılandırma dosyasına da ihtiyacımız var. (İsterseniz, bu bölümü atlayabilir ve `protoc` kullanabilirsiniz — `protoc-gen-es` diğer eklentiler gibi çalışır.)

Öncelikle, depo kökünüze basit bir [`buf.yaml`][buf.yaml] dosyası oluşturun:

```bash
$ npx buf config init
```

Ardından, `buf.yaml` dosyasını `proto` dizinimizi kullanacak şekilde düzenleyin:

```yaml title=buf.yaml
version: v2
// highlight-next-line
modules:
// highlight-next-line
  - path: proto
lint:
  use:
    - DEFAULT
breaking:
  use:
    - FILE
```

Sonraki adımda, kodun nasıl üretileceğini Buf'a belirtmek için bunu [`buf.gen.yaml`][buf.gen.yaml] dosyasına yerleştirin:

```yaml
version: v2
plugins:
  - local: protoc-gen-es
    out: gen
    opt: target=ts
```

Bu yapılandırma dosyaları yerinde olduğunda, şemanızı denetleyebilir ve kod üretebilirsiniz:

```bash
$ npx buf lint
$ npx buf generate
```

Artık oluşturulmuş bir TypeScript dosyası görmelisiniz:

```diff
.
├── buf.gen.yaml
├── buf.yaml
// highlight-next-line
├── gen
// highlight-next-line
│   └── eliza_pb.ts
├── node_modules
├── package-lock.json
├── package.json
├── proto
│   └── eliza.proto
└── tsconfig.json
```

Sonraki aşamada, bu dosyaları kullanarak hizmetimizi uygulayacağız.

## Hizmeti uygulama

`ElizaService`'i tanımladık - şimdi onu uygulama zamanı ve `ConnectRouter` ile kaydetme zamanı. Öncelikle, uygulama için bir dosya oluşturalım:

Yeni bir `connect.ts` dosyası oluşturun ve aşağıdaki içeriği ekleyin:

```ts
import type { ConnectRouter } from "@connectrpc/connect";
import { ElizaService } from "./gen/eliza_pb";

export default (router: ConnectRouter) =>
  // connectrpc.eliza.v1.ElizaService'i kaydeder
  router.service(ElizaService, {
    // rpc Say'i uygular
    async say(req) {
      return {
        sentence: `Söylediniz: ${req.sentence}`
      }
    },
  });
```

Hepsi bu! Bir hizmeti uygulamanın birçok farklı alternatifi var ve başlıklar ve dosya parçaları için bir bağlam nesnesine erişiminiz var, ancak şimdilik basit tutalım.

## Bir sunucu başlatma

Connect hizmetleri, vanilla Node.js sunucularına, [Next.js](https://nextjs.org), [Express](https://expressjs.com/) veya [Fastify](https://www.fastify.io/) ile entegre edilebilir. Burada Fastify kullanacağız. Hızlı bir değişiklik yapalım ve Fastify için eklentimizi yükleyelim:

```bash
$ npm install fastify @connectrpc/connect-node @connectrpc/connect-fastify
```

Yeni bir `server.ts` dosyası oluşturun ve aşağıdaki içeriği ekleyin:

```ts
import { fastify } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import routes from "./connect";

async function main() {
  const server = fastify();
  await server.register(fastifyConnectPlugin, {
    routes,
  });
  server.get("/", (_, reply) => {
    reply.type("text/plain");
    reply.send("Merhaba Dünya!");
  });
  await server.listen({ host: "localhost", port: 8080 });
  console.log("sunucu,", server.addresses(), "adresinde dinliyor.");
}
// Eğer package.json dosyanızda type: module ayarlarsanız,
// main() sarıcıyı kaldırabilir ve tsconfig.json'unuzu target: es2017 ve module: es2022 ile güncelleyebilirsiniz.
void main();
```

Tebrikler. Uç noktanız hazır! Sunucunuzu başlatmak için:

```bash
$ npx tsx server.ts
```

## İstek gönderme

Yeni API'nizi tüketmenin en basit yolu, JSON yükü ile bir HTTP/1.1 POST'tur. En son sürüm cURL yükü kuruluysa, bu bir tek satırlık komut:

```terminal
$ curl \
  --header 'Content-Type: application/json' \
  --data '{"sentence": "Mutlu hissediyorum."}' \
   http://localhost:8080/connectrpc.eliza.v1.ElizaService/Say