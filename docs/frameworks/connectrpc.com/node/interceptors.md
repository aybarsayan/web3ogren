---
title: Kesiciler
seoTitle: Kesiciler - Sunucu/Müşteri Mantığı
sidebar_position: 4
description: Kesiciler, sunucu ve istemci arasında mantık eklemek için kullanılır ve istekleri, yanıtları yöneterek hata işleme ve günlük yayınlama gibi işlevler sunar. Bu belge, kesicilerin nasıl çalıştığını ve bağlam değerlerini nasıl yöneteceğini açıklar.
tags: 
  - kesiciler
  - sunucu
  - istemci
  - middleware
  - decorators
keywords: 
  - kesici
  - istemci
  - sunucu
  - bağlam değerleri
  - interceptor
---
Bir kesici, sunucu/müşterilere mantık ekleyebilir; bu, diğer kütüphanelerde gördüğünüz dekoratörler veya ara yazılımlara benzerdir. Kesiciler, isteği ve yanıtı değiştirebilir, hataları yakalayabilir ve yeniden deneyebilir/iyileştirebilir, günlükler yayımlayabilir veya neredeyse başka her şeyi yapabilir.

:::info
İstemci tarafı kesicileri için, lütfen `Web` belgelere bakın.
:::

Basit bir örnek olarak, bu kesici her RPC'yi kaydeder:

```ts
import * as http from "http";
import routes from "./connect";
import { connectNodeAdapter } from "@connectrpc/connect-node";
import type { Interceptor } from "@connectrpc/connect";

const logger: Interceptor = (next) => async (req) => {
  console.log(`received message on ${req.url}`);
  return await next(req);
};

http
  .createServer(
    connectNodeAdapter({
      routes,
      interceptors: [logger],
    }),
  )
  .listen(8080);
```

Kesicileri katmanlı bir soğan gibi düşünebilirsiniz. Bir sunucu tarafından alınan istek ilk önce en dış katmandan geçer. `next()` çağrısı her seferinde bir sonraki katmana geçer. Ortada istek, kullanıcı tarafından sağlanan bir uygulama tarafından işlenir. Yanıt, then tüm katmanlar üzerinden geri gelir ve istemciye iletilir. Adaptör/yolcuya geçirilen kesiciler dizisinde, dizinin sonunda bulunan kesici ilk olarak uygulanır.

:::tip
Yanıtları kesmek için, yalnızca `next()` işlevinin dönüş değerine bakarız:
:::

```ts
const logger: Interceptor = (next) => async (req) => {
  console.log(`received message on ${req.url}`);
  const res = await next(req);
  if (!res.stream) {
    console.log("message:", res.message);
  }
  return res;
};
```

İstek/yanıtın `stream` özelliği, bu yanıtın akış yanıtı olup olmadığını belirtir. Bir akış isteği/yanıtı, keserken tam olarak ulaşmamıştır — bireysel mesajları görebilmek için bir sarma işlemi yapmalıyız:

```ts
const logger: Interceptor = (next) => async (req) => {
  const res = await next(req);
  if (res.stream) {
    // akış yanıtı mesajlarını kesmek için, 
    // AsynchronousIterable'ı bir jeneratör işlevi ile sararız
    return {
      ...res,
      message: logEach(res.message),
    };
  }
  return res;
};

async function* logEach(stream: AsyncIterable<AnyMessage>) {
  for await (const m of stream) {
    console.log("sending response message", m);
    yield m;
  }
}
```

## Bağlam Değerleri

Bağlam değerleri, sunucu eklentilerinden veya bir kesiciden diğerine, işleyiciye kadar herhangi bir değeri güvenli bir şekilde iletmenin bir yoludur. Yeni bir `ContextValues` oluşturmak için `createContextValues` işlevini kullanabilirsiniz. Her isteğin kendi `ContextValues` örneği olacaktır. `ContextValues` örneği, kesiciler aracılığıyla işleyiciye iletilir ve değerleri almak için kullanılabilir. Sunucu eklentileri, her isteğe bir `ContextValues` örneği sağlamak için `sunucu eklentileri` `contextValues` seçeneğini de kullanabilir.

:::warning
`ContextValues` değerleri ayarlamak, almak ve silmek için yöntemlere sahiptir. Anahtarlar, `ContextKey` nesneleridir:
:::

### Bağlam Anahtarları

`ContextKey`, bağlam değerlerini kullanmanın güvenli ve çakışmasız bir yoludur. Varsayılan bir değeri alıp bir `ContextKey` nesnesi döndüren `createContextKey` işlevi ile tanımlanır. Varsayılan değer, bağlam değeri ayarlanmadığında kullanılır.

```ts
import { createContextKey } from "@connectrpc/connect";

type User = { name: string };

export const kUser = createContextKey<User>(
  { name: "Anonymous" }, // Varsayılan değer
  {
    description: "Current user", // Hata ayıklama için yararlı olan açıklama
  },
);
```

Varsayılan değerin anlamlı bir anlam ifade etmediği durumlar için türü değiştirebilirsiniz:

```ts
import { createContextKey } from "@connectrpc/connect";

type User = { name: string };

export const kUser = createContextKey<User | undefined>(undefined, {
  description: "Authenticated user",
});
```

Bağlam anahtarlarını ayrı bir dosyada tanımlamak ve dışa aktarmak en iyisidir. Bu, kod bölünmesi için daha iyidir ve ayrıca dairesel içe aktarma sorunlarını önler. Bu, sağlayıcının ortama bağlı olarak değiştiği durumlarda da yardımcı olur. Örneğin, bir test ortamında, bir sahte kullanıcı ekleyen bir kesici ayarlayabiliriz ve üretimde gerçek kullanıcıya sahip oluruz.

### Örnek

Kesicilerin yaygın bir kullanım durumu, kimlik doğrulama gibi birçok isteğe ortak olan mantığı işlemek. Böyle bir kimlik doğrulama mantığını ekleyebiliriz:

```ts
// Bu kimlik doğrulama kitaplığından gelir, örneğin passport.js
import { authenticate } from "./authenticate";

const authenticator: Interceptor = (next) => async (req) => {
  // `authenticate`, yetkilendirme başlığı değerini alır
  // ve belirteci temsil eden kullanıcıyı döndürür.
  const user = authenticate(req.header.get("Authorization"));
  if (user === undefined) {
    throw new ConnectError("User not authenticated", Code.Unauthenticated);
  }
  return await next(req);
};
```

Ama ya RPC uygulamalarımızdan birinde kullanıcı bilgisine ihtiyaç duyarsak? Bir yol, başlığı tekrar çözmektir:

```ts
import { ConnectRouter } from "@connectrpc/connect";
import { ElizaService } from "./gen/eliza_pb";
import { authenticate } from "authenticate";

export default (router: ConnectRouter) =>
  // connectrpc.eliza.v1.ElizaService'i kaydeder
  router.service(ElizaService, {
    // rpc Say'i uygular
    async say(req, context) {
      const user = authenticate(context.requestHeader.get("Authorization"))!;
      return {
        sentence: `Hey ${user.name}! You said: ${req.sentence}`,
      };
    },
  });
```

Ama bu, bir kesicide bir kez ve ikinci kez işleyicide kimlik doğrulamanın gerçekleşmesi anlamına gelir. İşte burada bağlam değerleri devreye girer. Kullanıcıyı bir bağlam değeri olarak ekleyebiliriz ve bu, işleyicide alınabilir. Bunu yapmak için bir bağlam anahtarı tanımlamamız gerekir:

```ts title=user-context.ts
import { createContextKey } from "@connectrpc/connect";

type User = { name: string };

const kUser = createContextKey<User>(
  { name: "Anonymous" }, // Varsayılan değer
);

export { kUser };
```

`ContextKey`, bağlam değerlerini kullanmanın güvenli bir yoludur. Ayrıca, sıradan dize anahtarları ile kaçınılmaz olan çakışmaları da önler. Bağlam anahtarları hakkında daha fazla bilgi için `Bağlam Anahtarları` bölümüne bakın.

Kesiciyi, bağlam anahtarını kullanarak kullanıcı bilgilerini geçirecek şekilde değiştirebiliriz:

```ts
import { authenticate } from "./authenticate";
import { kUser } from "./user-context";
import type { Interceptor } from "@connectrpc/connect";
import { ConnectError, Code } from "@connectrpc/connect";

const authenticator: Interceptor = (next) => async (req) => {
  // `authenticate`, yetkilendirme başlığı değerini alır
  // ve belirteci temsil eden kullanıcıyı döndürür.
  const user = authenticate(req.header.get("Authorization"));
  if (user === undefined) {
    throw new ConnectError("User not authenticated", Code.Unauthenticated);
  }
  // Kullanıcıyı istek bağlamına ekle.
  req.contextValues.set(kUser, user);
  return await next(req);
};
```

Ve ardından işleyicimizde bunu kullanabiliriz:

```ts
import { ConnectRouter } from "@connectrpc/connect";
import { ElizaService } from "./gen/eliza_pb";
import { authenticate } from "./authenticate";
import { kUser } from "./user-context";

export default (router: ConnectRouter) =>
  // connectrpc.eliza.v1.ElizaService'i kaydeder
  router.service(ElizaService, {
    // rpc Say'i uygular
    async say(req, context) {
      const user = context.values.get(kUser);
      return {
        sentence: `Hey ${user.name}! You said: ${req.sentence}`,
      };
    },
  });
```

Bağlam değerini sunucu eklentisinden de geçirebilirsiniz:

```ts
import { fastify } from "fastify";
import routes from "./connect";
import { kUser } from "./user-context";
import { authenticate } from "./authenticate";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";

const server = fastify();

await server.register(fastifyConnectPlugin, {
  routes,
  contextValues: (req) =>
    createContextValues().set(kUser, authenticate(req)),
});

await server.listen({
  host: "localhost",
  port: 8080,
});
```

`contextValues` işlevine geçirilen istek, her sunucu eklentisi için farklıdır; lütfen kullandığınız sunucu eklentisi için belgeleri kontrol edin.