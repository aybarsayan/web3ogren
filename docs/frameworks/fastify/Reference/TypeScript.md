---
title: Fastify
seoTitle: Fastify - Hızlı Web Uygulamaları İçin Minimalist Çatı
sidebar_position: 4
description: Fastify, yüksek performanslı Node.js uygulamaları geliştirmek için tasarlanmış popüler bir frameworktür. Bu belgede, Fastifyın TypeScript desteği ve tür sisteminin nasıl kullanılacağı ele alınmaktadır.
tags: 
  - Fastify
  - TypeScript
  - Node.js
  - Web Geliştirme
keywords: 
  - fastify
  - typescript
  - nodejs
  - web framework
  - hızı
---
## TypeScript

Fastify çatısı saf JavaScript ile yazılmıştır ve bu nedenle tür tanımları
kolayca sürdürülmez; ancak, 2 ve sonrasındaki versiyonlarda,
bakımcılar ve katkıda bulunanlar türleri geliştirmek için büyük bir çaba sarf etmiştir.

Fastify 3. versiyonunda tür sistemi değiştirildi. Yeni tür sistemi, 
genel kısıtlama ve varsayılan değerler ile birlikte, bir istek gövdesi, sorgu dizgesi ve daha fazlası gibi şema türlerini tanımlamanın yeni bir yolunu tanıtıyor! Ekip, çerçeve ve tür tanım senkronizasyonunu geliştirmeye çalışırken, bazen API'nın bazı bölümleri tanımlanmamış veya yanlış tanımlanmış olabilir. Eksiklikleri gidermek için **katkıda bulunmanızı** teşvik ediyoruz. Her şeyin sorunsuz gitmesini sağlamak için başlamadan önce 
[`KATKIDA BULUNMA.md`](https://github.com/fastify/fastify/blob/main/CONTRIBUTING.md) dosyamızı okumayı unutmayın!

> Bu bölümdeki belgeler Fastify 3.x türlerini kapsamaktadır.

> Eklentiler türleri içerebilir veya içermeyebilir. Daha fazla bilgi için `Eklentiler` bölümüne bakın. Kullanıcıların tür desteğini geliştirmek için çekme istekleri göndermelerini teşvik ediyoruz.

:::warning 
`@types/node` paketini yüklemeyi unutmayın
:::

## Örnekle Öğrenin

Fastify tür sistemini öğrenmenin en iyi yolu örneklerden geçmektir! Aşağıdaki dört
örnek, en yaygın Fastify geliştirme durumlarını kapsamalıdır. Örneklerden sonra
tür sistemi ile ilgili daha ayrıntılı belgeler mevcuttur.

### Başlarken

Bu örnek, sizi Fastify ve TypeScript ile çalıştıracak. Sonuç, boş bir http Fastify sunucusu olacaktır.

1. Yeni bir npm projesi oluşturun, Fastify'ı yükleyin ve TypeScript & Node.js
   türlerini eş bağımlılıklar olarak yükleyin:
   ```bash
   npm init -y
   npm i fastify
   npm i -D typescript @types/node
   ```
2. Aşağıdaki satırları `package.json` dosyasının `"scripts"` bölümüne ekleyin:
   ```json
   {
     "scripts": {
       "build": "tsc -p tsconfig.json",
       "start": "node index.js"
     }
   }
   ```

3. TypeScript yapılandırma dosyasını başlatın:
   ```bash
   npx tsc --init
   ```
   veya [önerilenlerden](https://github.com/tsconfig/bases#node-14-tsconfigjson) birini kullanın.

*Not: `tsconfig.json` dosyasında `target` özelliğini `es2017` veya daha büyük 
bir değere ayarlayın ki [FastifyDeprecation](https://github.com/fastify/fastify/issues/3284) uyarısından kaçının.*

4. Bir `index.ts` dosyası oluşturun - burası sunucu kodunu içerecek.
5. Aşağıdaki kod bloğunu dosyanıza ekleyin:
   ```typescript
   import fastify from 'fastify'

   const server = fastify()

   server.get('/ping', async (request, reply) => {
     return 'pong\n'
   })

   server.listen({ port: 8080 }, (err, address) => {
     if (err) {
       console.error(err)
       process.exit(1)
     }
     console.log(`Sunucu dinliyor: ${address}`)
   })
   ```
6. `npm run build` komutunu çalıştırın - bu, `index.ts` dosyasını `index.js` 
   olarak derleyecek ve Node.js ile çalıştırılabilir hale getirecektir. Herhangi
   bir hata ile karşılaşırsanız lütfen [fastify/help](https://github.com/fastify/help/) 
   bölümünde bir sorun açın.
7. Fastify sunucusunu çalıştırmak için `npm run start` komutunu çalıştırın.
8. Konsolunuzda `Sunucu dinliyor: http://127.0.0.1:8080` mesajını görmelisiniz.
9. Sunucunuzu `curl localhost:8080/ping` komutuyla test edin, bu `pong` döndürecektir.
   🏓

🎉 Artık çalışan bir Typescript Fastify sunucunuz var! Bu örnek,
3.x sürüm tür sisteminin basitliğini gösteriyor. Varsayılan olarak, tür sistemi 
bir `http` sunucusu kullandığınızı varsayıyor. Sonraki örnekler daha karmaşık sunucular 
oluşturma, `https` ve `http2` gibi, yol şemalarını belirleme ve daha fazlasını gösteriyor!

> Fastify'ı TypeScript ile başlatma hakkında daha fazla örnek için (HTTP2'yi
> etkinleştirme gibi) ayrıntılı API bölümünü [buradan][Fastify] kontrol edin.

### Generic Kullanımı

Tür sistemi, en doğru geliştirme deneyimini sağlamak için genel özelliklere dayanmaktadır. Bazıları, yükün biraz fazla olduğunu düşünebilir; ancak, değişim buna değer! Bu örnek, yönlendirme şemaları için genel türleri uygulamaya girecek ve yol düzeyindeki `request` nesnesindeki dinamik özelliklere bakacaktır.

1. Önceki örneği tamamlamadıysanız, 1-4 adımlarını takip ederek kurulum yapın.
2. `index.ts` dosyasının içinde üç arayüzü `IQuerystring`, `IHeaders` ve `IReply` tanımlayın:
   ```typescript
   interface IQuerystring {
     username: string;
     password: string;
   }

   interface IHeaders {
     'h-Custom': string;
   }

   interface IReply {
     200: { success: boolean };
     302: { url: string };
     '4xx': { error: string };
   }
   ```
3. Bu üç arayüzü kullanarak yeni bir API rotası tanımlayın ve bunları genel türler olarak geçirin. Kısa yol rotası yöntemleri (yani `.get`) bir genel nesne olan `RouteGenericInterface` döngüsünü kabul eder ve bu, beş adlandırılmış özellik içerir: `Body`, `Querystring`, `Params`, `Headers` ve `Reply`. `Body`, `Querystring`, `Params` ve `Headers` arayüzleri, yol yöntemi işleyicisindeki `request` örneğine ve `Reply` arayüzü de `reply` örneğine geçilecektir.
   ```typescript
   server.get<{
     Querystring: IQuerystring,
     Headers: IHeaders,
     Reply: IReply
   }>('/auth', async (request, reply) => {
     const { username, password } = request.query
     const customerHeader = request.headers['h-Custom']
     // istek verileriyle bir şey yap

     // .statusCode/.code çağrılarına .send ile zincirleme, tür daraltmasına izin verir. Örneğin:
     // bu çalışır
     reply.code(200).send({ success: true });
     // ama bu bir tür hatası verir
     reply.code(200).send('uh-oh');
     // wildcards için bile çalışır
     reply.code(404).send({ error: 'Bulunamadı' });
     return `giriş yapıldı!`
   })
   ```

4. Sunucu kodunu `npm run build` ve `npm run start` komutlarıyla oluşturun ve çalıştırın.
5. API'yi sorgulayın
   ```bash
   curl localhost:8080/auth?username=admin&password=Password123!
   ```
   Ve `giriş yapıldı!` mesajını döndürmelidir.
6. Ama bekleyin, daha fazlası var! Genel arayüzler yönlendirme düzeyindeki kancalarda da mevcuttur. Önceki rotayı `preValidation` kancası ekleyerek değiştirin:
   ```typescript
   server.get<{
     Querystring: IQuerystring,
     Headers: IHeaders,
     Reply: IReply
   }>('/auth', {
     preValidation: (request, reply, done) => {
       const { username, password } = request.query
       done(username !== 'admin' ? new Error('Admin olmalı') : undefined) // sadece `admin` hesabını doğrula
     }
   }, async (request, reply) => {
     const customerHeader = request.headers['h-Custom']
     // istek verileriyle bir şey yap
     return `giriş yapıldı!`
   })
   ```
7. Oluşturun ve çalıştırın; `username` sorgu dizesi seçeneğini `admin` dışında bir şey olarak ayarlayın. API şimdi HTTP 500 hatasını `{"statusCode":500,"error":"İç Sunucu Hatası","message":"Admin olmalı"}` döndürmelidir.

🎉 İyi iş, şimdi her rota için arayüzler tanımlayabilir ve kesin türlü istek ve cevap örneklerine sahip olabilirsiniz. Fastify tür sisteminin diğer bölümleri genel özelliklere dayanır. Daha fazlasını öğrenmek için aşağıdaki ayrıntılı tür sistemi belgelerine başvurmayı unutmayın.

### JSON Şeması

İsteklerinizi ve yanıtlarınızı doğrulamak için JSON Şeması dosyalarını kullanabilirsiniz. Daha önce duymadıysanız, Fastify rotalarınız için şemalar tanımlamak, bunların verimliliğini artırabilir! Daha fazla bilgi için `Doğrulama ve
Serileştirme` belgelerine göz atın.

Ayrıca, tanımlı türü işleyicilerinizde (ön doğrulama dahil) kullanma avantajına sahiptir.

Bunu başarmanın bazı yolları aşağıda verilmiştir.

## Tür Sağlayıcıları

Fastify, `json-schema-to-ts` ve `typebox`'ı saran iki paket sunar:

- [`@fastify/type-provider-json-schema-to-ts`](https://github.com/fastify/fastify-type-provider-json-schema-to-ts)
- [`@fastify/type-provider-typebox`](https://github.com/fastify/fastify-type-provider-typebox)

Ve üçüncü taraf bir `zod` sarmalayıcı: [`fastify-type-provider-zod`](https://github.com/turkerdev/fastify-type-provider-zod)

Bu paketler, şema doğrulama kurulumunu basitleştirir ve bunlar hakkında daha fazla bilgiyi `Tür Sağlayıcıları` sayfasında okuyabilirsiniz.

Aşağıda, `typebox`, `json-schema-to-typescript` ve `json-schema-to-ts` paketlerini kullanarak tür sağlayıcıları olmadan şema doğrulama ayarlamanın yolu açıklanmaktadır.

#### TypeBox

Tür ve şemayı aynı anda oluşturmak için yararlı bir kütüphane olan [TypeBox](https://www.npmjs.com/package/@sinclair/typebox) ile başlarsınız. TypeBox ile şemanızı kod içinde tanımlarsınız ve ihtiyacınıza göre doğrudan türler veya şemalar olarak kullanırsınız.

Bir Fastify rotasında bazı yüklerin doğrulaması için kullanmak istiyorsanız, bunu şu şekilde yapabilirsiniz:

1. Projenize `typebox` yükleyin.

    ```bash
    npm i @sinclair/typebox
    ```

2. Gerekli şemayı `Type` ile tanımlayın ve ilişkili türü `Static` ile oluşturun.

    ```typescript
    import { Static, Type } from '@sinclair/typebox'

    export const User = Type.Object({
      name: Type.String(),
      mail: Type.Optional(Type.String({ format: 'email' })),
    })

    export type UserType = Static<typeof User>
    ```

3. Rotanızın tanımında tanımlı türü ve şemayı kullanın.

    ```typescript
    import Fastify from 'fastify'
    // ...

    const fastify = Fastify()

    fastify.post<{ Body: UserType, Reply: UserType }>(
      '/',
      {
        schema: {
          body: User,
          response: {
            200: User
          },
        },
      },
      (request, reply) => {
        // `name` ve `mail` türleri otomatik olarak çıkarılır
        const { name, mail } = request.body;
        reply.status(200).send({ name, mail });
      }
    )
    ```

#### json-schema-to-typescript

Son örnekte, rotamız için türleri ve şemaları tanımlamak için TypeBox kullandık. Birçok kullanıcı, bu özellikleri tanımlamak için zaten JSON Şemaları kullanıyor ve şanslıyız ki mevcut JSON Şemalarını TypeScript arayüzlerine dönüştürmenin bir yolu var!

1. 'Başlarken' örneğini tamamlamadıysanız, önce 1-4 adımlarını takip edin.
2. `json-schema-to-typescript` modülünü yükleyin:

   ```bash
   npm i -D json-schema-to-typescript
   ```

3. `schemas` adında yeni bir klasör oluşturun ve `headers.json` ve 
   `querystring.json` adında iki dosya ekleyin. Aşağıdaki şema tanımlarını 
   ilgili dosyalara kopyalayın ve yapıştırın:

   ```json
   {
     "title": "Başlık Şeması",
     "type": "object",
     "properties": {
       "h-Custom": { "type": "string" }
     },
     "additionalProperties": false,
     "required": ["h-Custom"]
   }
   ```

   ```json
   {
     "title": "Sorgu Dizgesi Şeması",
     "type": "object",
     "properties": {
       "username": { "type": "string" },
       "password": { "type": "string" }
     },
     "additionalProperties": false,
     "required": ["username", "password"]
   }
   ```

4. `package.json` dosyasına bir `compile-schemas` betiği ekleyin:

   ```json
   {
     "scripts": {
       "compile-schemas": "json2ts -i schemas -o types"
     }
   }
   ```

   `json2ts`, `json-schema-to-typescript` paketinde dahil olan bir CLI aracıdır. `schemas` girdi yolu ve `types` çıkış yoludur.
5. `npm run compile-schemas` komutunu çalıştırın. `types` klasöründe iki yeni dosya oluşturulmuş olmalı.
6. Aşağıdaki koda sahip `index.ts` dosyasını güncelleyin:

   ```typescript
   import fastify from 'fastify'

   // şemaları normal olarak içe aktarın
   import QuerystringSchema from './schemas/querystring.json'
   import HeadersSchema from './schemas/headers.json'

   // oluşturulan arayüzleri içe aktarın
   import { QuerystringSchema as QuerystringSchemaInterface } from './types/querystring'
   import { HeadersSchema as HeadersSchemaInterface } from './types/headers'

   const server = fastify()

   server.get<{
     Querystring: QuerystringSchemaInterface,
     Headers: HeadersSchemaInterface
   }>('/auth', {
     schema: {
       querystring: QuerystringSchema,
       headers: HeadersSchema
     },
     preValidation: (request, reply, done) => {
       const { username, password } = request.query
       done(username !== 'admin' ? new Error('Admin olmalı') : undefined)
     }
     //  veya asenkron kullanıyorsanız
     //  preValidation: async (request, reply) => {
     //    const { username, password } = request.query
     //    if (username !== "admin") throw new Error("Admin olmalı");
     //  }
   }, async (request, reply) => {
     const customerHeader = request.headers['h-Custom']
     // istek verileriyle bir şey yap
     return `giriş yapıldı!`
   })

   server.route<{
     Querystring: QuerystringSchemaInterface,
     Headers: HeadersSchemaInterface
   }>({
     method: 'GET',
     url: '/auth2',
     schema: {
       querystring: QuerystringSchema,
       headers: HeadersSchema
     },
     preHandler: (request, reply, done) => {
       const { username, password } = request.query
       const customerHeader = request.headers['h-Custom']
       done()
     },
     handler: (request, reply) => {
       const { username, password } = request.query
       const customerHeader = request.headers['h-Custom']
       reply.status(200).send({username});
     }
   })

   server.listen({ port: 8080 }, (err, address) => {
     if (err) {
       console.error(err)
       process.exit(0)
     }
     console.log(`Sunucu dinliyor: ${address}`)
   })
   ```
   Bu dosyanın başındaki ithalatlara özel dikkat edin. Gereksiz görünebilir, 
   ancak hem şema dosyalarını hem de oluşturulan arayüzleri içe aktarmanız gerekiyor.

Harika iş! Artık hem JSON Şemaları hem de TypeScript tanımlarından yararlanabilirsiniz.

#### json-schema-to-ts

Eğer şemalarınızdan türler oluşturmak istemiyorsanız, ancak bunları doğrudan kodunuzdan kullanmak istiyorsanız, [json-schema-to-ts](https://www.npmjs.com/package/json-schema-to-ts) paketini kullanabilirsiniz.

Bunu geliştirme bağımlılığı olarak yükleyebilirsiniz.

```bash
npm i -D json-schema-to-ts
```

Kodunuzda, şemanızı normal bir nesne gibi tanımlayabilirsiniz. Ancak, bu modülün belgelerinde açıklandığı gibi `const` yapmayı unutmayın.

```typescript
const todo = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    done: { type: 'boolean' },
  },
  required: ['name'],
} as const; // const kullanmayı unutmayın!
```

Verilen `FromSchema` tipi ile, şemanızdan bir tür oluşturabilir ve bunu işleyicinizde kullanabilirsiniz.

```typescript
import { FromSchema } from "json-schema-to-ts";
fastify.post<{ Body: FromSchema<typeof todo> }>(
  '/todo',
  {
    schema: {
      body: todo,
      response: {
        201: {
          type: 'string',
        },
      },
    }
  },
  async (request, reply): Promise<void> => {

    /*
    request.body tipi
    {
      [x: string]: unknown;
      description?: string;
      done?: boolean;
      name: string;
    }
    */

    request.body.name // tür hatası yok
    request.body.notthere // tür hatası verir

    reply.status(201).send();
  },
);
```

### Eklentiler

Fastify'ın en belirgin özelliklerinden biri, kapsamlı eklenti ekosistemidir. Eklenti türleri tamamen desteklenir ve [declaration
merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
deseninden faydalanır. Bu örnek, bir TypeScript Fastify Eklentisi oluşturma, bir Fastify Eklentisi için tür tanımları oluşturma ve bir TypeScript Projesinde Fastify Eklentisi kullanma gibi üç parçaya bölünmüştür.

#### TypeScript Fastify Eklentisi Oluşturma

1. Yeni bir npm projesi başlatın ve gerekli bağımlılıkları yükleyin.
   ```bash
   npm init -y
   npm i fastify fastify-plugin
   npm i -D typescript @types/node
   ```
2. `package.json` dosyasının `"scripts"` bölümüne bir `build` betiği ve `"types"` bölümüne `'index.d.ts'` ekleyin:
   ```json
   {
     "types": "index.d.ts",
     "scripts": {
       "build": "tsc -p tsconfig.json"
     }
   }
   ```
3. TypeScript yapılandırma dosyasını başlatın:
   ```bash
   npx typescript --init
   ```
   Dosya oluşturulduktan sonra, `compilerOptions` nesnesinde `"declaration"` seçeneğini etkinleştirin.
   ```json
   {
     "compilerOptions": {
       "declaration": true
     }
   }
   ```
4. Bir `index.ts` dosyası oluşturun - burası eklenti kodunu içerecek.
5. `index.ts` dosyasına aşağıdaki kodu ekleyin:
   ```typescript
   import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
   import fp from 'fastify-plugin'

   // declaration merging kullanarak, eklenti özelliklerinizi uygun fastify arayüzlerine ekleyin
   // burada prop tipi tanımlanmışsa, değeri decorate{,Request,Reply} çağrıldığında tür kontrolüne tabi tutulacaktır
   declare module 'fastify' {
     interface FastifyRequest {
       myPluginProp: string
     }
     interface FastifyReply {
       myPluginProp: number
     }
   }

   // seçenekleri tanımlayın
   export interface MyPluginOptions {
     myPluginOption: string
   }

   // geribildirim yöntemleri kullanarak eklentiyi tanımlayın
   const myPluginCallback: FastifyPluginCallback<MyPluginOptions> = (fastify, options, done) => {
     fastify.decorateRequest('myPluginProp', 'super_secret_value')
     fastify.decorateReply('myPluginProp', options.myPluginOption)

     done()
   }

   // promes kullanarak eklentiyi tanımlayın
   const myPluginAsync: FastifyPluginAsync<MyPluginOptions> = async (fastify, options) => {
     fastify.decorateRequest('myPluginProp', 'super_secret_value')
     fastify.decorateReply('myPluginProp', options.myPluginOption)
   }

   // fastify-plugin kullanarak eklentiyi dışa aktarın
   export default fp(myPluginCallback, '3.x')
   // veya
   // export default fp(myPluginAsync, '3.x')
   ```
6. Eklenti kodunu derleyip hem bir JavaScript kaynak dosyası hem de bir tür tanım dosyası üretmek için `npm run build` komutunu çalıştırın.
7. Eklenti tamamlandığında, [npm'ye yayınlayabilirsiniz] veya yerel olarak kullanabilirsiniz.
   > Eklentinizi npm'ye yayınlamanız gerekmez. Bunu bir Fastify projesine dahil 
   > edebilir ve kodunuzun herhangi bir parçası olarak referans verebilirsiniz! 
   > TypeScript kullanıcısı olarak, tür tanımını işlemesi için TypeScript yorumlayıcısının 
   > projede derlenmesinde bir yerde bulunmasını sağlamak önemlidir.