---
title: Hizmetlerin Uygulanması
seoTitle: Hizmet Uygulama Kılavuzu
sidebar_position: 2
description: Bu bölümde, Connect kullanarak nasıl hizmet uygulayacağınızı ve temel iş mantığını nasıl yöneteceğinizi keşfedeceksiniz.
tags: 
  - hizmetler
  - Connect
  - Protobuf
  - TypeScript
keywords: 
  - hizmet uygulama
  - Connect
  - RPC
  - TypeScript
  - Protobuf
---
Connect, HTTP yollarını ve çoğu temel işlemleri sizin için halleder, ancak gerçek iş mantığını uygulamak yine size kalmıştır.

Her zaman uygulamanızı `ConnectRouter` üzerinde kaydedersiniz. Projenizde bir kayıt fonksiyonu ile `connect.ts` adında bir dosya oluşturmanızı öneririz:

```ts
import { ConnectRouter } from "@connectrpc/connect";

export default (router: ConnectRouter) => {}
```

## Bir hizmet kaydedin

Diyelim ki basit bir hizmet tanımladınız Protobuf'ta:

```protobuf
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

Bu hizmeti kaydetmek için `router.service()` çağrısını yapın:

```ts
import { ConnectRouter, HandlerContext } from "@connectrpc/connect";
import { ElizaService, SayRequest } from "./gen/eliza_pb";
import { create } from "@bufbuild/protobuf";

export default (router: ConnectRouter) =>
  router.service(ElizaService, {
    async say(req: SayRequest, context: HandlerContext) {
      return {
        sentence: `Siz dediniz ki: ${req.sentence}`,
      };
    }
  });
```

`say()` metodunuz, istek mesajını ve bir bağlam nesnesini alır ve bir yanıt mesajı döner. Bu basit bir fonksiyondur!

## Basit fonksiyonlar

Fonksiyonunuz bir yanıt mesajı dönebilir, veya bir yanıt mesajı için bir vaatte bulunabilir, ya da sadece bir yanıt mesajının başlatıcısını dönebilir:

```ts
function say(req: SayRequest) {
  return create(SayResponseSchema, { sentence: `Siz dediniz ki: ${req.sentence}` });
}
```

```ts
async function say(req: SayRequest) {
  return { sentence: `Siz dediniz ki: ${req.sentence}` };
}
```

```ts
const say = (req: SayRequest) => ({ sentence: `Siz dediniz ki: ${req.sentence}` });
```

Bu fonksiyonlardan herhangi birini ElizaService için kaydedebilirsiniz.

## Bağlam

Bağlam argümanı, başlıklar ve hizmet meta verilerine erişim sağlar:

```ts
import { HandlerContext } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { SayRequest } from "./gen/eliza_pb";

function say(req: SayRequest, context: HandlerContext) {
  context.service.typeName; // protobuf tür adı "ElizaService"
  context.method.name; // protobuf rpc adı "Say"
  context.requestHeader.get("Foo");
  context.responseHeader.set("Foo", "Bar");
  return { sentence: `Siz dediniz ki: ${req.sentence}` };
}
```

Bu ayrıca sunucu eklentileri veya kesicilerden geçen keyfi değerlere erişmek için de kullanılabilir. Lütfen daha fazla bilgi için `kesicilere` başvurun.

## Hatalar

Yanıt döndürmek yerine, metodunuz bir hata da fırlatabilir:

```ts
import { Code, ConnectError } from "@connectrpc/connect";

function say() {
  throw new ConnectError("Artık kelimem yok.", Code.ResourceExhausted);
}
```

`Code`, Connect'in `hata kodlarından biridir`. Hata kodu ve bir mesajın yanı sıra, hatalar ayrıca bir meta veri içerebilir (Headers nesnesi) ve hata detayları.

## Hata detayları

Hata detayları güçlü bir özelliktir. Herhangi bir protobuf mesajı hata detayı olarak iletilebilir. Hata mesajımızı yerelleştirmek için [`google.rpc.LocalizedMessage`](https://buf.build/googleapis/googleapis/file/main:google/rpc/error_details.proto#L241) kullanalım:

```bash
$ npx buf generate buf.build/googleapis/googleapis
```

```ts
import { Code, ConnectError } from "@connectrpc/connect";
import { ElizaService } from "./gen/eliza_pb";
import { LocalizedMessageSchema } from "./gen/google/rpc/error_details_pb";

function say() {
  const details = [
    {
      desc: LocalizedMessageSchema,
      value: {
        locale: "fr-CH",
        message: "Artık kelimem yok.",
      }
    },
    {
      desc: LocalizedMessageSchema,
      value: {
        locale: "ja-JP",
        message: "もう言葉がありません。",
      }
    },    
  ];
  const metadata = new Headers({
    "words-left": "none"
  });
  throw new ConnectError(
    "Artık kelimem yok.",
    Code.ResourceExhausted,
    metadata,
    details
  );
}
```

## Akış

Akış uç noktaları için çeşitli işleyicileri göstermeden önce, Connect-Go'dan `Akış` sayfasına atıfta bulunmak istiyoruz. Çünkü Connect, Node.js için üç çeşit akış uç noktasını desteklese de, daldırmadan önce göz önünde bulundurulması gereken bazı trade-off'lar vardır.

Akış, doğru koşullarda API'ler için çok güçlü bir yaklaşım olabilir, ancak büyük bir özen gerektirir. Unutmayın, büyük güç büyük sorumluluk getirir.

**_İstemci akışı_** içinde, istemci birden fazla mesaj gönderir. Sunucu tüm mesajları aldıktan sonra, tek bir mesaj ile yanıt verir. Protobuf şemalarında, istemci akış yöntemleri şöyle görünür:

```protobuf
service ElizaService {
  rpc Vent(stream VentRequest) returns (VentResponse) {}
}
```

TypeScript'te, istemci akış yöntemleri istek mesajlarının asenkron bir yinelemeli kümesini alır (bunları bir for [await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) döngüsü ile yineleyebilirsiniz):

```typescript
async function vent(reqs: AsyncIterable<VentRequest>): Promise<VentResponse> {}
```

**_Sunucu akışı_** içinde, istemci tek bir mesaj gönderir ve sunucu birden fazla mesaj ile yanıt verir. Protobuf şemalarında, sunucu akış yöntemleri şöyle görünür:

```protobuf
service ElizaService {
  rpc Introduce(IntroduceRequest) returns (stream IntroduceResponse) {}
}
```

TypeScript'te, sunucu akış yöntemleri bir istek mesajı alır ve genellikle bir [üretici fonksiyonu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) ile yanıt mesajlarının asenkron bir yinelemeli kümesini döndürür:

```ts
async function *introduce(req: IntroduceRequest) {
  yield { sentence: `Merhaba ${req.name}, ben Eliza` };
  yield { sentence: `Bugün kendinizi nasıl hissediyorsunuz?` };
}
```

**_İki yönlü akış_** (sıklıkla bidi olarak adlandırılır) içinde, istemci ve sunucu her ikisi de birden fazla mesaj gönderebilir. Genellikle, alışveriş bir konuşma yapısına sahiptir: istemci bir mesaj gönderir, sunucu yanıt verir, istemci başka bir mesaj gönderir, ve bu şekilde devam eder. Unutmayın ki bu her durumda uçtan uca HTTP/2 desteği gerektirir (RPC protokolünden bağımsız olarak)!

## Yardımcı Türler

Hizmet uygulamaları tür güvenlidir. `ConnectRouter`'ın `service()` metodu `ServiceImpl` kabul eder; burada `T` bir hizmet türüdür. Bir `ServiceImpl`, `MethodImp` olarak tanımlanan her RPC için bir metoda sahiptir; burada `M`, bir metod bilgisi nesnesidir.

Bu türleri kullanarak hizmetinizi hemen kaydetmeden ozaman yaratabilirsiniz:

```typescript
import type { MethodImpl, ServiceImpl } from "@connectrpc/connect";

export const say: MethodImpl<typeof ElizaService.method.say> = ...

export const eliza: ServiceImpl<typeof ElizaService> = {
  // ...
};

export class Eliza implements ServiceImpl<typeof ElizaService> {
  say(req: SayRequest) {
    return {
      sentence: `Siz dediniz ki: ${req.sentence}`,
    };
  }
}
```

Yukarıdaki örnekleri kaydederken:

```typescript
import { ConnectRouter } from "@connectrpc/connect";
import { ElizaService } from "./gen/eliza_pb";
import { say, eliza, Eliza } from "./other-file";

export default (router: ConnectRouter) => {
  // const say kullanarak
  router.service(ElizaService, { say });

  // const say kullanarak alternatif
  router.rpc(
    ElizaService.method.say,
    say
  );

  // const eliza kullanarak
  router.service(ElizaService, eliza);

  // class Eliza kullanarak
  router.service(ElizaService, new Eliza());
}
```

`ConnectRouter.service`'in metodları atlamanıza izin verdiğini unutmayın. Router, otomatik olarak bir hata kodu `uygulanmamış` ile yanıt veren bir metod ekleyecektir.