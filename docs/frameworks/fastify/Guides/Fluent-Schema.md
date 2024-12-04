---
title: Fastify
seoTitle: Efficient JSON Schema Handling with Fastify
sidebar_position: 4
description: This section covers efficient JSON schema validation and serialization setup with Fastify. It includes example schemas and usage instructions.
tags: 
  - Fastify
  - JSON Schema
  - Validation
  - Serialization
  - Web Development
keywords: 
  - Fastify
  - JSON Schema
  - Validation
  - Serialization
  - Web Development
---
## Fluent Şema

`Doğrulama ve Serileştirme` belgesi, Fastify'ın girdi doğrulama için JSON Şema Doğrulaması ve çıktı optimizasyonu için JSON Şema Serileştirmesi ayarlamak üzere kabul ettiği tüm parametreleri özetlemektedir.

[`fluent-json-schema`](https://github.com/fastify/fluent-json-schema) bu görevi basit hale getirirken sabitlerin yeniden kullanımına da olanak tanır.

### Temel ayarlar

```js
const S = require('fluent-json-schema')

// Bunu gibi bir nesneye sahip olabilirsiniz veya değerleri almak için bir DB sorgulayabilirsiniz
const MY_KEYS = {
  KEY1: 'BİR',
  KEY2: 'İKİ'
}

const bodyJsonSchema = S.object()
  .prop('someKey', S.string())
  .prop('someOtherKey', S.number())
  .prop('requiredKey', S.array().maxItems(3).items(S.integer()).required())
  .prop('nullableKey', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))
  .prop('multipleTypesKey', S.mixed([S.TYPES.BOOLEAN, S.TYPES.NUMBER]))
  .prop('multipleRestrictedTypesKey', S.oneOf([S.string().maxLength(5), S.number().minimum(10)]))
  .prop('enumKey', S.enum(Object.values(MY_KEYS)))
  .prop('notTypeKey', S.not(S.array()))

const queryStringJsonSchema = S.object()
  .prop('name', S.string())
  .prop('excitement', S.integer())

const paramsJsonSchema = S.object()
  .prop('par1', S.string())
  .prop('par2', S.integer())

const headersJsonSchema = S.object()
  .prop('x-foo', S.string().required())

// `.valueOf()` çağırmaya gerek yoktur!
const schema = {
  body: bodyJsonSchema,
  querystring: queryStringJsonSchema, // (veya) query: queryStringJsonSchema
  params: paramsJsonSchema,
  headers: headersJsonSchema
}

fastify.post('/the/url', { schema }, handler)
```

### Yeniden Kullanım

:::tip
`fluent-json-schema` ile şemalarınızı daha kolay ve programatik olarak manipüle edebilir ve ardından `addSchema()` yöntemi sayesinde yeniden kullanabilirsiniz.
:::

Şemayı iki farklı şekilde referans alabilirsiniz; bunlar `Doğrulama ve Serileştirme` belgesinde ayrıntılı olarak açıklanmıştır.

İşte bazı kullanım örnekleri:

**`$ref-yolu`**: harici bir şemaya atıfta bulunun.

```js
const addressSchema = S.object()
  .id('#address')
  .prop('line1').required()
  .prop('line2')
  .prop('country').required()
  .prop('city').required()
  .prop('zipcode').required()

const commonSchemas = S.object()
  .id('https://fastify/demo')
  .definition('addressSchema', addressSchema)
  .definition('otherSchema', otherSchema) // Gerekli olan her türlü şemayı ekleyebilirsiniz

fastify.addSchema(commonSchemas)

const bodyJsonSchema = S.object()
  .prop('residence', S.ref('https://fastify/demo#address')).required()
  .prop('office', S.ref('https://fastify/demo#/definitions/addressSchema')).required()

const schema = { body: bodyJsonSchema }

fastify.post('/the/url', { schema }, handler)
```

**`değiştir-yolu`**: doğrulama sürecinden önce değiştirilecek bir paylaşılan şemaya atıfta bulunun.

```js
const sharedAddressSchema = {
  $id: 'sharedAddress',
  type: 'object',
  required: ['line1', 'country', 'city', 'zipcode'],
  properties: {
    line1: { type: 'string' },
    line2: { type: 'string' },
    country: { type: 'string' },
    city: { type: 'string' },
    zipcode: { type: 'string' }
  }
}
fastify.addSchema(sharedAddressSchema)

const bodyJsonSchema = {
  type: 'object',
  properties: {
    vacation: 'sharedAddress#'
  }
}

const schema = { body: bodyJsonSchema }

fastify.post('/the/url', { schema }, handler)
```

:::warning
NB `$ref-yolu` ve `değiştir-yolu` kullanırken `fastify.addSchema` ile birleştirebilirsiniz.
:::