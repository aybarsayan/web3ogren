---
title: Fastify
seoTitle: Fastify Documentation
sidebar_position: 1
description: Tür Sağlayıcıları, Fastifyın JSON Şemasından tür bilgilerini çıkarmasını sağlayan TypeScripte özgü bir özelliktir. Bu, şemalar için türleri koruma gereksinimini azaltır.
tags: 
  - Fastify
  - TypeScript
  - JSON Schema
  - Type Provider
keywords: 
  - Fastify
  - TypeScript
  - JSON Schema
  - Type Provider
---
## Tür Sağlayıcıları

Tür Sağlayıcıları, Fastify'ın doğrudan iç içe geçmiş JSON Şeması'ndan tür bilgilerini istatiksel olarak çıkarmasını sağlayan yalnızca TypeScript'e özgü bir özelliktir. Belirli yollar üzerinde genel argümanları belirtmenin alternatifidir; ve projenizde tanımlanan her şema için ilişkili türleri koruma gereksinimini büyük ölçüde azaltabilir.

### Sağlayıcılar

Tür Sağlayıcıları, projenize kurmanız gereken ek paketler olarak sunulmaktadır. Her sağlayıcı, arka planda farklı bir çıkarım kütüphanesi kullanarak; ihtiyaçlarınıza en uygun kütüphaneyi seçmenizi sağlar. Resmi Tür Sağlayıcı paketleri `@fastify/type-provider-{sağlayıcı-ismi}` isimlendirme kuralına uymaktadır ve birkaç topluluk paketi de bulunmaktadır.

Aşağıdaki çıkarım paketleri desteklenmektedir:

- [`json-schema-to-ts`](https://github.com/ThomasAribart/json-schema-to-ts)
- [`typebox`](https://github.com/sinclairzx81/typebox)
- [`zod`](https://github.com/colinhacks/zod)

Ayrıca, ilgili her bir paket için Tür Sağlayıcı sarmalayıcı paketlerine de bakınız:

- [`@fastify/type-provider-json-schema-to-ts`](https://github.com/fastify/fastify-type-provider-json-schema-to-ts)
- [`@fastify/type-provider-typebox`](https://github.com/fastify/fastify-type-provider-typebox)
- [`fastify-type-provider-zod`](https://github.com/turkerdev/fastify-type-provider-zod) (3. parti)

### Json Şeması'ndan Ts'ye

Aşağıdaki kod bir `json-schema-to-ts` Tür Sağlayıcısı ayarlamaktadır.

```bash
$ npm i @fastify/type-provider-json-schema-to-ts
```

```typescript
import fastify from 'fastify'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()

server.get('/route', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        foo: { type: 'number' },
        bar: { type: 'string' },
      },
      required: ['foo', 'bar']
    }
  }
}, (request, reply) => {
  
  // type Query = { foo: number, bar: string }
  const { foo, bar } = request.query // tür güvenli!
})
```

### TypeBox

Aşağıdaki kod bir TypeBox Tür Sağlayıcısı ayarlamaktadır.

```bash
$ npm i @fastify/type-provider-typebox
```

```typescript
import fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

const server = fastify().withTypeProvider<TypeBoxTypeProvider>()

server.get('/route', {
  schema: {
    querystring: Type.Object({
      foo: Type.Number(),
      bar: Type.String()
    })
  }
}, (request, reply) => {
  
  // type Query = { foo: number, bar: string }
  const { foo, bar } = request.query // tür güvenli!
})
```

TypeBox ile çalışmak için AJV'yi nasıl ayarlayacağınıza dair [TypeBox belgelerine](https://github.com/sinclairzx81/typebox#validation) de göz atın.

### Zod

Zod tür sağlayıcı talimatları için [resmi belgeyi](https://github.com/turkerdev/fastify-type-provider-zod) inceleyin.

### Kapsamlı Tür Sağlayıcı

Sağlayıcı türleri küresel olarak yayılmamaktadır. Kapsamlı kullanımlarda, bir veya daha fazla sağlayıcıyı (örneğin, `typebox` ve `json-schema-to-ts` aynı uygulamada kullanılabilir) kullanmak için bağlamı yeniden eşleştirebilirsiniz.

Örnek:

```ts
import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import { Type } from '@sinclair/typebox'

const fastify = Fastify()

function pluginWithTypebox(fastify: FastifyInstance, _opts, done): void {
  fastify.withTypeProvider<TypeBoxTypeProvider>()
    .get('/', {
      schema: {
        body: Type.Object({
          x: Type.String(),
          y: Type.Number(),
          z: Type.Boolean()
        })
      }
    }, (req) => {
        const { x, y, z } = req.body // tür güvenli
    });
  done()
}

function pluginWithJsonSchema(fastify: FastifyInstance, _opts, done): void {
  fastify.withTypeProvider<JsonSchemaToTsProvider>()
    .get('/', {
      schema: {
        body: {
          type: 'object',
          properties: {
            x: { type: 'string' },
            y: { type: 'number' },
            z: { type: 'boolean' }
          },
        }
      }
    }, (req) => {
      const { x, y, z } = req.body // tür güvenli
    });
  done()
}

fastify.register(pluginWithJsonSchema)
fastify.register(pluginWithTypebox)
```

Ayrıca türlerin küresel olarak yayılmadığını belirtmek de önemlidir; _şu anda_ birden fazla kapsamla çalışırken yollar üzerinde birden fazla kaydın önlenmesi mümkün değildir. Aşağıda daha fazla bilgi bulunmaktadır:

```ts
import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>()

server.register(plugin1) // yanlış
server.register(plugin2) // doğru

function plugin1(fastify: FastifyInstance, _opts, done): void {
  fastify.get('/', {
    schema: {
      body: Type.Object({
        x: Type.String(),
        y: Type.Number(),
        z: Type.Boolean()
      })
    }
  }, (req) => {
    // çalışmıyor! yeni bir kapsamda `withTypeProvider`'ı yeniden çağırmak gerekiyor
    const { x, y, z } = req.body
  });
  done()
}

function plugin2(fastify: FastifyInstance, _opts, done): void {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

  server.get('/', {
    schema: {
      body: Type.Object({
        x: Type.String(),
        y: Type.Number(),
        z: Type.Boolean()
      })
    }
  }, (req) => {
    // çalışıyor
    const { x, y, z } = req.body
  });
  done()
}
```

#Instance + Tür Sağlayıcı Tanımı

Modüllerle çalışırken `FastifyInstance`'ı Tür Sağlayıcı generikleri ile kullanmanız gerekir. Aşağıdaki örneği görebilirsiniz:

```ts
// index.ts
import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { registerRoutes } from './routes'

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>()

registerRoutes(server)

server.listen({ port: 3000 })
```

```ts
// routes.ts
import { Type } from '@sinclair/typebox'
import {
  FastifyInstance,
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault
} from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

export function registerRoutes(fastify: FastifyTypebox): void {
  fastify.get('/', {
    schema: {
      body: Type.Object({
        x: Type.String(),
        y: Type.Number(),
        z: Type.Boolean()
      })
    }
  }, (req) => {
    // çalışıyor
    const { x, y, z } = req.body
  });
}