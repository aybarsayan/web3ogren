---
title: Hızlı Çalışma
seoTitle: Fastify Hızlı Çalışma Kılavuzu
sidebar_position: 4
description: Bu bölüm, Fastify ile JSON Schema kullanarak doğrulama ve serileştirme konularını ele almaktadır. Fastifynın yüksek performanslı sistem özelliklerini keşfedin.
tags: 
  - fastify
  - json schema
  - validation
  - serialization
keywords: 
  - fastify
  - json schema
  - validation
  - serialization
---
## Hızlı Çalışma
Fastify, şemaya dayalı bir yaklaşım kullanır ve zorunlu olmamakla birlikte, rotalarınızı doğrulamak ve çıktılarınızı serileştirmek için [JSON Schema](https://json-schema.org/) kullanmanızı öneririz. İçerisinde, Fastify şemayı yüksek performanslı bir işlev haline getirir.

Doğrulama, içerik türü `application-json` olduğu müddetçe yapılacaktır; bu, `içerik türü ayrıştırıcı` belgesinde tanımlanmıştır.

Bu bölümdeki tüm örnekler, [JSON Schema Taslak 7](https://json-schema.org/specification-links.html#draft-7) spesifikasyonunu kullanmaktadır.

> ## ⚠  Güvenlik Uyarısı
> Şema tanımını uygulama kodu olarak ele alın. Doğrulama ve serileştirme özellikleri dinamik olarak `new Function()` ile kod değerlendirir ki bu, kullanıcıdan sağlanan şemalarla kullanmak için güvenli değildir. Daha fazla bilgi için [Ajv](https://npm.im/ajv) ve [fast-json-stringify](https://npm.im/fast-json-stringify) belgelerine bakın.
>
> Fastify tarafından desteklenen [`$async` Ajv özelliği](https://ajv.js.org/guide/async-validation.html) ilk doğrulama stratejisinin bir parçası olarak kullanılmamalıdır. Bu seçenek, Veritabanlarına erişmek için kullanılır ve doğrulama süreci sırasında bunları okumak, uygulamanıza Hizmet Reddi Saldırılarına yol açabilir. `async` görevlerini çalıştırmanız gerekiyorsa, doğrulama tamamlandıktan sonra `Fastify'nin kancalarını` kullanın; örneğin `preHandler`.

### Temel Kavramlar
Doğrulama ve serileştirme görevleri, iki farklı ve özelleştirilebilir aktör tarafından işlenir:
- Bir istek için doğrulama [Ajv v8](https://www.npmjs.com/package/ajv)
- Bir yanıtın gövdesinin serileştirilmesi için [fast-json-stringify](https://www.npmjs.com/package/fast-json-stringify)

Bu iki ayrı varlık yalnızca Fastify'nin örneğine `.addSchema(schema)` ile eklenen JSON şemalarını paylaşır.

#### Paylaşılan Bir Şemanın Eklenmesi



Paylaşılan şemalarla ilgili daha fazla bilgi

`addSchema` API'si sayesinde, Fastify örneğine birden fazla şema ekleyebilir ve ardından bunları uygulamanızın farklı bölümlerinde yeniden kullanabilirsiniz. Her zamanki gibi, bu API kapsüllenmiştir.

Paylaşılan şemalar, JSON Şeması **`$ref`** anahtar kelimesi aracılığıyla yeniden kullanılabilir. Referansların _nasıl_ çalıştığına dair bir genel bakış:

+ `myField: { $ref: '#foo' }` mevcut şemada `$id: '#foo'` ile alan arar
+ `myField: { $ref: '#/definitions/foo' }` mevcut şemada `definitions.foo` alanını arar
+ `myField: { $ref: 'http://url.com/sh.json#' }` `$id: 'http://url.com/sh.json'` ile eklenen bir paylaşılan şemayı arar
+ `myField: { $ref: 'http://url.com/sh.json#/definitions/foo' }` `$id: 'http://url.com/sh.json'` ile eklenen bir paylaşılan şemayı arar ve `definitions.foo` alanını kullanır
+ `myField: { $ref: 'http://url.com/sh.json#foo' }` `$id: 'http://url.com/sh.json'` ile eklenen bir paylaşılan şemayı arar ve içindeki `$id: '#foo'` olan objeyi arar



**Basit kullanım:**

```js
fastify.addSchema({
  $id: 'http://example.com/',
  type: 'object',
  properties: {
    hello: { type: 'string' }
  }
})

fastify.post('/', {
  handler () {},
  schema: {
    body: {
      type: 'array',
      items: { $ref: 'http://example.com#/properties/hello' }
    }
  }
})
```

**Kök referansı olarak `$ref`:**

```js
fastify.addSchema({
  $id: 'commonSchema',
  type: 'object',
  properties: {
    hello: { type: 'string' }
  }
})

fastify.post('/', {
  handler () {},
  schema: {
    body: { $ref: 'commonSchema#' },
    headers: { $ref: 'commonSchema#' }
  }
})
```

#### Paylaşılan Şemaların Alınması


Eğer doğrulayıcı ve serileştirici özelleştirilirse, `.addSchema` metodu artık kullanışlı olmayacaktır çünkü aktörler artık Fastify tarafından kontrol edilmemektedir. Fastify örneğine eklenen şemalara erişmek için, basitçe `.getSchemas()` metodunu kullanabilirsiniz:

```js
fastify.addSchema({
  $id: 'schemaId',
  type: 'object',
  properties: {
    hello: { type: 'string' }
  }
})

const mySchemas = fastify.getSchemas()
const mySchema = fastify.getSchema('schemaId')
```

Her zamanki gibi, `getSchemas` fonksiyonu kapsüllenmiş olup, seçilen kapsamda mevcut paylaşılan şemaları döndürür:

```js
fastify.addSchema({ $id: 'one', my: 'hello' })
// sadece `one` şemasını döndürecektir
fastify.get('/', (request, reply) => { reply.send(fastify.getSchemas()) })

fastify.register((instance, opts, done) => {
  instance.addSchema({ $id: 'two', my: 'ciao' })
  // `one` ve `two` şemalarını döndürecektir
  instance.get('/sub', (request, reply) => { reply.send(instance.getSchemas()) })

  instance.register((subinstance, opts, done) => {
    subinstance.addSchema({ $id: 'three', my: 'hola' })
    // `one`, `two` ve `three` döndürecektir
    subinstance.get('/deep', (request, reply) => { reply.send(subinstance.getSchemas()) })
    done()
  })
  done()
})
```

### Doğrulama
Rota doğrulaması, dahili olarak [Ajv v8](https://www.npmjs.com/package/ajv) üzerine dayanmaktadır ve bu, yüksek performanslı bir JSON Şeması doğrulayıcısıdır. Girdiyi doğrulamak oldukça kolaydır: Tek yapmanız gereken rota şemasında ihtiyacınız olan alanları eklemektir.

Desteklenen doğrulamalar:
- `body`: POST, PUT veya PATCH yöntemi ile gelen isteğin gövdesini doğrular.
- `querystring` veya `query`: sorgu dizesini doğrular.
- `params`: rota parametrelerini doğrular.
- `headers`: istek başlıklarını doğrular.

Tüm doğrulamalar, bir `type` özelliği `'object'` olan tam bir JSON Şeması nesnesi (ve `'properties'` nesnesi içeren parametreler) veya `type` ve `properties` özniteliklerinin atlandığı ve parametrelerin üst seviyede listelendiği daha basit bir varyasyon olabilir (aşağıdaki örneğe bakın).

> ℹ Eğer en son Ajv sürümünü (v8) kullanmanız gerekiyorsa, `schemaController` bölümünde nasıl yapılacağını okuyun.

Örnek:
```js
const bodyJsonSchema = {
  type: 'object',
  required: ['requiredKey'],
  properties: {
    someKey: { type: 'string' },
    someOtherKey: { type: 'number' },
    requiredKey: {
      type: 'array',
      maxItems: 3,
      items: { type: 'integer' }
    },
    nullableKey: { type: ['number', 'null'] }, // veya { type: 'number', nullable: true }
    multipleTypesKey: { type: ['boolean', 'number'] },
    multipleRestrictedTypesKey: {
      oneOf: [
        { type: 'string', maxLength: 5 },
        { type: 'number', minimum: 10 }
      ]
    },
    enumKey: {
      type: 'string',
      enum: ['John', 'Foo']
    },
    notTypeKey: {
      not: { type: 'array' }
    }
  }
}

const queryStringJsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    excitement: { type: 'integer' }
  }
}

const paramsJsonSchema = {
  type: 'object',
  properties: {
    par1: { type: 'string' },
    par2: { type: 'number' }
  }
}

const headersJsonSchema = {
  type: 'object',
  properties: {
    'x-foo': { type: 'string' }
  },
  required: ['x-foo']
}

const schema = {
  body: bodyJsonSchema,
  querystring: queryStringJsonSchema,
  params: paramsJsonSchema,
  headers: headersJsonSchema
}

fastify.post('/the/url', { schema }, handler)
```

`body` şeması için, içerik türüne göre şemayı ayırt etmek mümkündür; bunları `content` özniteliği içinde iç içe yerleştirerek gerçekleştirebilirsiniz. Şema doğrulaması, istekteki `Content-Type` başlığına göre uygulanır.

```js
fastify.post('/the/url', {
  schema: {
    body: {
      content: {
        'application/json': {
          schema: { type: 'object' }
        },
        'text/plain': {
          schema: { type: 'string' }
        }
        // Diğer içerik türleri doğrulanmayacaktır
      }
    }
  }
}, handler)
```

*Ajv, şema `type` anahtar kelimelerini belirtildiği gibi değerleri [coerce](https://ajv.js.org/coercion.html) etmeye çalışacaktır; bu, doğrulamayı geçmek ve sonraki uygun türde verilere erişmek içindir.*

Fastify'da Ajv'nin varsayılan yapılandırması, `querystring` içindeki dizi parametrelerini zorlamayı destekler. Örnek:

```js
const opts = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          default: []
        },
      },
    }
  }
}

fastify.get('/', opts, (request, reply) => {
  reply.send({ params: request.query }) // sorgu dizisini yankılar
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
```

```sh
curl -X GET "http://localhost:3000/?ids=1

{"params":{"ids":["1"]}}
```

Her parametre türü (body, querystring, params, headers) için özel bir şema doğrulayıcı belirtebilirsiniz.

Örneğin, aşağıdaki kod yalnızca `body` parametreleri için tür zorlamasını devre dışı bırakır, Ajv'nin varsayılan seçeneklerini değiştirir:

```js
const schemaCompilers = {
  body: new Ajv({
    removeAdditional: false,
    coerceTypes: false,
    allErrors: true
  }),
  params: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true
  }),
  querystring: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true
  }),
  headers: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true
  })
}

server.setValidatorCompiler(req => {
    if (!req.httpPart) {
      throw new Error('Missing httpPart')
    }
    const compiler = schemaCompilers[req.httpPart]
    if (!compiler) {
      throw new Error(`Missing compiler for ${req.httpPart}`)
    }
    return compiler.compile(req.schema)
})
```

Daha fazla bilgi için [buraya](https://ajv.js.org/coercion.html) bakın.

#### Ajv Eklentileri


Varsayılan `ajv` örneğinizle kullanmak istediğiniz bir eklentiler listesi sağlayabilirsiniz. Not edin ki eklentinin **Fastify ile gönderilen Ajv sürümü ile uyumlu olması gerekir**.

> Eklentiler formatını kontrol etmek için `ajv options` kısmına bakın.

```js
const fastify = require('fastify')({
  ajv: {
    plugins: [
      require('ajv-merge-patch')
    ]
  }
})

fastify.post('/', {
  handler (req, reply) { reply.send({ ok: 1 }) },
  schema: {
    body: {
      $patch: {
        source: {
          type: 'object',
          properties: {
            q: {
              type: 'string'
            }
          }
        },
        with: [
          {
            op: 'add',
            path: '/properties/q',
            value: { type: 'number' }
          }
        ]
      }
    }
  }
})

fastify.post('/foo', {
  handler (req, reply) { reply.send({ ok: 1 }) },
  schema: {
    body: {
      $merge: {
        source: {
          type: 'object',
          properties: {
            q: {
              type: 'string'
            }
          }
        },
        with: {
          required: ['q']
        }
      }
    }
  }
})
```

#### Doğrulayıcı Derleyici


`validatorCompiler`, bir işlev döndüren bir işlevdir ve body, URL parametreleri, başlıklar ve sorgu dizesini doğrular. Varsayılan `validatorCompiler`, [ajv](https://ajv.js.org/) doğrulama arayüzünü uygulayan bir işlev döndürür. Fastify, doğrulamayı hızlandırmak için dahili olarak bunu kullanır.

Fastify'nın [temel ajv yapılandırması](https://github.com/fastify/ajv-compiler#ajv-configuration) şu şekildedir:

```js
{
  coerceTypes: 'array', // verinin türünü, tür anahtar kelimesiyle eşleşecek şekilde değiştir
  useDefaults: true, // eksik özellikleri ve öğeleri karşılık gelen varsayılan anahtardan değerler ile değiştir
  removeAdditional: true, // additionalProperties false olarak ayarlandığında, ek özellikleri kaldır
  uriResolver: require('fast-uri'),
  addUsedSchema: false,
  // AllErrors'u kesin olarak `false` olarak ayarlayın.
  // `true` olarak ayarlandığında, DoS saldırısı mümkün olabilir.
  allErrors: false
}
```

Bu temel yapılandırma, Fastify fabrikasına `ajv.customOptions` vererek değiştirilebilir.

Ek yapılandırma seçeneklerini değiştirmek veya ayarlamak istiyorsanız, kendi örneğinizi oluşturmanız ve mevcut olanı geçersiz kılmanız gerekecektir:

```js
const fastify = require('fastify')()
const Ajv = require('ajv')
const ajv = new Ajv({
  removeAdditional: 'all',
  useDefaults: true,
  coerceTypes: 'array',
  // diğer seçenekler
  // ...
})
fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
  return ajv.compile(schema)
})
```
_**Not:** Kendi doğrulayıcı örneğinizi (Ajv dahil) kullanıyorsanız, şemaları doğrulayıcıya eklemeniz gerekir; çünkü Fastify'nın varsayılan doğrulayıcı artık kullanılmıyor ve Fastify'nın `addSchema` metodu hangi doğrulayıcıyı kullandığınızı bilmez._

##### Diğer doğrulama kütüphanelerinin kullanılması


`setValidatorCompiler` işlevi, `ajv`'yi neredeyse her JavaScript doğrulama kütüphanesiyle ([joi](https://github.com/hapijs/joi/), [yup](https://github.com/jquense/yup/), ...) veya özel bir kütüphane ile değiştirmeyi kolaylaştırır:

```js
const Joi = require('joi')

fastify.post('/the/url', {
  schema: {
    body: Joi.object().keys({
      hello: Joi.string().required()
    }).required()
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => {
    return data => schema.validate(data)
  }
}, handler)
```

```js
const yup = require('yup')
// Ajv’nin Fastify'da kullanılan temel seçenekleri ile uyumlu doğrulama seçenekleri
const yupOptions = {
  strict: false,
  abortEarly: false, // tüm hataları döndür
  stripUnknown: true, // ek özellikleri kaldır
  recursive: true
}

fastify.post('/the/url', {
  schema: {
    body: yup.object({
      age: yup.number().integer().required(),
      sub: yup.object().shape({
        name: yup.string().required()
      }).required()
    })
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => {
    return function (data) {
      // seçenek strict = false olduğunda, yup `validateSync` fonksiyonu
      // doğrulama başarılıysa zorlanmış değeri döndürür, ya da doğrulama başarısız olursa atar
      try {
        const result = schema.validateSync(data, yupOptions)
        return { value: result }
      } catch (e) {
        return { error: e }
      }
    }
  }
}, handler)
```

##### .statusCode özelliği

Tüm doğrulama hatalarına `.statusCode` özelliği eklenir ve değeri `400` olarak ayarlanır. Bu, varsayılan hata işleyicisinin yanıtın durum kodunu `400` olarak ayarlamasını garanti eder.

```js
fastify.setErrorHandler(function (error, request, reply) {
  request.log.error(error, `Bu hatanın durum kodu ${error.statusCode}`)
  reply.status(error.statusCode).send(error)
})
```

##### Diğer doğrulama kütüphaneleri ile doğrulama mesajları

Fastify'nın doğrulama hata mesajları varsayılan doğrulama motoruyla sıkı bir şekilde ilişkilidir: `ajv` tarafından döndürülen hatalar nihayet `schemaErrorFormatter` işlevinden geçirilerek insan dostu hata mesajları oluşturulmaktadır. Ancak, `schemaErrorFormatter` işlevi `ajv` göz önünde bulundurularak yazılmıştır. Sonuç olarak, diğer doğrulama kütüphanelerini kullanırken garip veya eksik hata mesajlarıyla karşılaşabilirsiniz.

Bu sorunu aşmanız için, iki ana seçeneğiniz vardır:

1. doğrulama işlemini (özel `schemaCompiler`'ınız tarafından döndürülen) `ajv` ile aynı yapı ve biçimde hata döndürecek şekilde yazın (ancak bu, farklı doğrulama motorları arasında farklar nedeniyle zor ve karmaşık olabilir)
2. ya da özel doğrulama hatalarınızı kesmek ve biçimlendirmek için özel bir `errorHandler` kullanın

Özel bir `errorHandler` yazmanıza yardımcı olmak için, Fastify tüm doğrulama hatalarına iki özellik ekler:

* `validation`: doğrulama işlevinin döndürdüğü nesnenin `error` özelliğinin içeriği (özel `schemaCompiler`'ınızdan döndürülür)
* `validationContext`: doğrulama hatasının meydana geldiği 'bağlam' (body, params, query, headers)

Aşağıda, doğrulama hatalarını işleyen bir özel `errorHandler`ın çok basit bir örneği gösterilmektedir:

```js
const errorHandler = (error, request, reply) => {
  const statusCode = error.statusCode
  let response

  const { validation, validationContext } = error

  // doğrulama hatası olup olmadığını kontrol et
  if (validation) {
    response = {
      // validationContext 'body' veya 'params' veya 'headers' veya 'query' olacaktır
      message: `Doğrulama hatası ${validationContext} doğrularken oluştu...`,
      // bu, doğrulama kütüphanenizin sonucu...
      errors: validation
    }
  } else {
    response = {
      message: 'Bir hata oluştu...'
    }
  }

  // burada ek çalışma, örn. hatayı kaydetme
  // ...

  reply.status(statusCode).send(response)
}
```

### Serileştirme


Genellikle, verilerinizi istemcilere JSON olarak gönderirsiniz ve Fastify, bir yanıt şeması sağladığınızda kullanılan güçlü bir araca sahiptir, [fast-json-stringify](https://www.npmjs.com/package/fast-json-stringify). Bir çıktı şeması kullanmanızı teşvik ederiz, çünkü bu, verimliliği önemli ölçüde artırabilir ve hassas bilgilerin yanlışlıkla ifşasını engellemeye yardımcı olabilir.

Örnek:
```js
const schema = {
  response: {
    200: {
      type: 'object',
      properties: {
        value: { type: 'string' },
        otherValue: { type: 'boolean' }
      }
    }
  }
}

fastify.post('/the/url', { schema }, handler)
```

Gördüğünüz gibi, yanıt şeması durum koduna dayanır. Aynı şemayı birden fazla durum kodu için kullanmak istiyorsanız, `'2xx'` veya `default` gibi kullanabilirsiniz, örneğin:
```js
const schema = {
  response: {
    default: {
      type: 'object',
      properties: {
        error: {
          type: 'boolean',
          default: true
        }
      }
    },
    '2xx': {
      type: 'object',
      properties: {
        value: { type: 'string' },
        otherValue: { type: 'boolean' }
      }
    },
    201: {
      // sözleşme sözdizimi
      value: { type: 'string' }
    }
  }
}

fastify.post('/the/url', { schema }, handler)
```
Farklı içerik türleri için belirli bir yanıt şemasına da sahip olabilirsiniz. Örneğin:
```js
const schema = {
  response: {
    200: {
      description: 'Farklı içerik türlerini destekleyen yanıt şeması',
      content: {
        'application/json': {
          schema: {
            name: { type: 'string' },
            image: { type: 'string' },
            address: { type: 'string' }
          }
        },
        'application/vnd.v1+json': {
          schema: {
            type: 'array',
            items: { $ref: 'test' }
          }
        }
      }
    },
    '3xx': {
      content: {
        'application/vnd.v2+json': {
          schema: {
            fullName: { type: 'string' },
            phone: { type: 'string' }
          }
        }
      }
    },
    default: {
      content: {
        // */* tüm içerik türlerini karşılıyor
        '*/*': {
          schema: {
            desc: { type: 'string' }
          }
        }
      }
    }
  }
}

fastify.post('/url', { schema }, handler)
```

#### Serileştirici Derleyici


`serializerCompiler`, bir işlev döndüren bir işlevdir ve bir girdi nesnesinden bir dize döndürmelidir. Bir yanıt JSON Şeması tanımladığınızda, her rota için varsayılan serileştirme yöntemini değiştirmek için bir işlev sağlayarak bunu gerçekleştirebilirsiniz.

```js
fastify.setSerializerCompiler(({ schema, method, url, httpStatus, contentType }) => {
  return data => JSON.stringify(data)
})

fastify.get('/user', {
  handler (req, reply) {
    reply.send({ id: 1, name: 'Foo', image: 'BÜYÜK GÖRÜNTÜ' })
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      }
    }
  }
})
```

*Belirli bir kodunuzun çok özel bir parçasında bir özel serileştiriciye ihtiyacınız varsa, bunu `reply.serializer(...)` ile ayarlayabilirsiniz.*