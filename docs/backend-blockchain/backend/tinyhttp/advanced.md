---
description: Gelişmiş veritabanı entegrasyonları ve tinyhttp için dağıtım yöntemleri hakkında bilgi edinin. MongoDB ve sunucusuz platformlar gibi popüler örnekler ile tanışın.
keywords: [tinyhttp, veritabanı, dağıtım, MongoDB, sunucusuz, CI/CD, Docker]
---

# Gelişmiş

## Veritabanı entegrasyonu

Herhangi bir web framework'ü gibi, tinyhttp de veritabanlarıyla iyi çalışır. MongoDB, Fauna, Postgres ve diğerleri dahil olmak üzere veritabanı entegrasyonu için birçok [örnek](https://github.com/tinyhttp/tinyhttp/tree/master/examples) bulunmaktadır.

### Örnek

Öncelikle veritabanınız için bir istemci başlatmalısınız. Daha sonra bunu middleware içinde sorguları yürütmek için kullanabilirsiniz.

MongoDB ile basit bir [örnek](https://github.com/tinyhttp/tinyhttp/tree/master/examples/mongodb):

```js
import { App } from '@tinyhttp/app'
import * as dotenv from '@tinyhttp/dotenv'
import { urlencoded as parser } from 'milliparsec'
import mongodb from 'mongodb'
import assert from 'assert'

dotenv.config()

const app = new App()

let db
let coll

// Mongo istemcisi oluştur
const client = new mongodb.MongoClient(process.env.DB_URI, {
  useUnifiedTopology: true,
})

// MongoDB'ye bağlan
client.connect(async (err) => {
  assert.notStrictEqual(null, err)
  console.log('MongoDB\'ye başarıyla bağlandınız')
  db = client.db('notes')
  coll = db.collection('notes')
})

app
  .get('/notes', async (_, res, next) => {
    const r = await coll.find({}).toArray()
    res.send(r)
    next()
  })
  .use('/notes', parser())
  .post('/notes', async (req, res, next) => {
    const { title, desc } = req.body
    const r = await coll.insertOne({ title, desc })
    assert.strictEqual(1, r.insertedCount)
    res.send(`Başlık olarak "${title}" olan not eklendi`)
  })
  .listen(3000)
```

## Dağıtım

tinyhttp'yi dağıtmanın birçok yolu vardır. Sunucusuz bir platform, bir VPS veya Node.js çalışma zamanı olan başka herhangi bir şeyi kullanabilirsiniz. En yaygın yolları inceleyecek ve bunları detaylandıracağız.

### Sunucusuz

Sunucusuz için, herhangi bir sunucusuz platform seçebilirsiniz. İşte bazı popüler platformların bir tablosu:

| **Platform**                          | **Ücretsiz**       |
| ------------------------------------- | -------------- |
| [Heroku](https://heroku.com)          | Hayır             |
| [Vercel (Lambda)](https://vercel.com) | Evet            |
| [AWS](https://aws.amazon.com)         | Evet (bir yıl) |
| [Render](https://render.com)          | Evet            |
| [Deta](https://deta.space)            | Evet            |

:::tip
tinyhttp deposunda [Vercel](https://github.com/tinyhttp/tinyhttp/tree/master/examples/vercel) ve [AWS](https://github.com/tinyhttp/tinyhttp/tree/master/examples/aws) örneklerine göz atabilirsiniz.
:::

tinyhttp'yi dağıtmak için başka iyi sunucusuz platformlar biliyorsanız, dökümana PR yapmaktan çekinmeyin.

### Kendinize Ait Sunucu

Kendinize ait sunucu kullanarak yükleyebileceğiniz bir dizi sunucusuz dağıtım aracı bulunmaktadır:

| **Araç**                                           |
| -------------------------------------------------- |
| [Exoframe](https://github.com/exoframejs/exoframe) |

### Özel

Özelleştirilmiş dağıtımları tercih ediyorsanız, bir CI/CD hizmeti, işlem yöneticisi ve bir web sunucusunun (veya sadece birinin) kombinasyonunu kullanmayı deneyebilirsiniz.

#### CI/CD

| CI/CD                                                 | Ücretsiz |
| ----------------------------------------------------- | ---- |
| [Github Actions](https://github.com/features/actions) | Evet  |
| [Travis](https://travis-ci.org)                       | Evet  |

Herhangi bir CI, tinyhttp için işe yarar çünkü herhangi bir limit koymaz.

#### İşlem yöneticileri / birim sistemleri

| PM / Birim sistemi                                | Çapraz platform | Yük dengeleyici dahili |
| ----------------------------------------------- | -------------- | ---------------------- |
| [PM2](https://pm2.io)                           | Evet            | Evet                    |
| [systemd](https://systemd.io)                   | Hayır           | Hayır                   |
| [z1](https://github.com/robojones/z1)           | Evet            | Evet                    |
| [Forever](https://github.com/foreversd/forever) | Evet            | Evet                    |

:::warning
Kural olarak, hedef sunucu Linux üzerinde çalışır. Tüm ana dağıtımlar [systemd](https://systemd.io) içerir. tinyhttp uygulamanız için bir hizmet oluşturmak için bunu kullanabilirsiniz.
:::

Node.js için en popüler işlem yöneticisi [PM2](https://pm2.io/). İçinde dahili bir kümeleme özelliği ile bu yüzden uygulamanızı çoklu işlem yapmak çok kolaydır. Ancak, clustering için pm2 kullanmak zorunlu değildir. Bunu dahili [`cluster`](https://nodejs.org/api/cluster.html) modülünü kullanarak da yapabilirsiniz. Daha fazla bilgi için cluster [örneğine](https://github.com/tinyhttp/tinyhttp/tree/master/examples/cluster) göz atın.

#### Web sunucuları

Bir web sunucusu, 3000 (veya herhangi başka bir) porttan 80 HTTP portuna ters proxy olarak kullanılması yaygındır. Bir web sunucusu ayrıca yük dengeleme için kullanılabilir.

| Web sunucusu                       | Yük dengeleyici dahili | Dokümanlar                                                                                                                                      |
| -------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [nginx](https://nginx.com)       | Evet                    | [NGINX ile Node.js Uygulama Sunucularını Yük Dengeleme](https://docs.nginx.com/nginx/deployment-guides/load-balance-third-party/node-js/) |
| [Caddy](https://caddyserver.com) | Evet                    | [Caddy Ters Proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)                                                    |

**Docker**

Docker, bir Node.js uygulamasını bir konteynerde çalıştırmak için birçok görüntü sunar. En popüler görüntülerden biri [node](https://hub.docker.com/_/node/)dir.

Docker ile bir Express / Node.js uygulaması dağıtma konusunda makaleler bulunmaktadır. tinyhttp'yi dağıtmak için bu eğitici kaynakları kullanabilirsiniz.

- [Express'i Docker'da Çalıştır](https://dev.to/tirthaguha/run-express-in-docker-2o44)
- [Node.js web uygulaması için Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)