---
title: İstemcilerin İptal Edildiğini Tespit Etme
seoTitle: Fastify ile İstemci İptali Tespiti
sidebar_position: 4
description: Bu kılavuz, Fastify kullanarak bir istemcinin isteği ne zaman iptal ettiğini ve nasıl tespit edileceğini ele alır. Sunucu çökmeleri ve olası sorunlarla nasıl başa çıkılacağı üzerinde durulmaktadır.
tags: 
  - Fastify
  - istemci iptali
  - web geliştirme
  - Node.js
keywords: 
  - Fastify
  - istemci iptali
  - web geliştirme
  - HTTP istekleri
---
Fastify

## İstemcilerin İptal Edildiğini Tespit Etme

## Giriş

Fastify, bir isteğin yaşam döngüsündeki belirli noktalarda tetiklenecek istek olayları sağlar. Ancak, istemcinin internet bağlantısının kesilmesi gibi istemcinin istemeden bağlantıyı kesme senaryolarını tespit etmek için yerleşik bir mekanizma yoktur. Bu kılavuz, bir istemcinin isteği kasıtlı olarak ne zaman iptal ettiğini ve bunu nasıl tespit edeceğinizi ele alır.

:::info
Fastify'ın `clientErrorHandler`'ının, bir istemcinin isteği iptal ettiğini tespit etmek için tasarlanmadığını unutmayın. Bu, standart Node HTTP modülü ile aynı şekilde çalışır; bu modül, kötü bir istek veya aşırı büyük başlık verisi olduğunda `clientError` olayını tetikler.
:::

Bir istemci isteği iptal ettiğinde, sokette bir hata yoktur ve `clientErrorHandler` tetiklenmeyecektir.

## Çözüm

### Genel Bakış

Önerilen çözüm, bir istemcinin isteği kasıtlı olarak iptal ederken (örneğin, bir tarayıcının kapatılması ya da HTTP isteğinin sizin istemci uygulamanızdan iptal edilmesi) tespit etmenin olası bir yoludur. Eğer, sunucunun çökmesine neden olan bir hata varsa, yanlış bir iptal tespiti önlemek için ek mantığa ihtiyacınız olabilir.

Buradaki amaç, bir istemcinin bağlantıyı kasıtlı olarak iptal ettiğini tespit etmek ve böylece uygulama mantığının buna göre devam etmesini sağlamaktır. Bu, günlükleme amaçları için veya iş mantığını durdurmak için yararlı olabilir.

### Uygulama

Diyelim ki aşağıdaki temel sunucu ayarına sahibiz:

```js
import Fastify from 'fastify';

const sleep = async (time) => {
  return await new Promise(resolve => setTimeout(resolve, time || 1000));
}

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

app.addHook('onRequest', async (request, reply) => {
  request.raw.on('close', () => {
    if (request.raw.aborted) {
      app.log.info('istek kapandı')
    }
  })
})

app.get('/', async (request, reply) => {
  await sleep(3000)
  reply.code(200).send({ ok: true })
})

const start = async () => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
```

Kodumuz, aşağıdaki işlevselliği içeren bir Fastify sunucusu kurmaktadır:

- **http://localhost:3000** adresinde istekleri kabul etme; `{ ok: true }` dönüşü için 3 saniye bekleme.
- Her istek alındığında tetiklenen bir onRequest kancası.
- İsteğin kapandığı zaman bu kancada tetiklenen bir mantık.
- Kapalı istek özelliği `aborted` true olduğunda günlükleme yapılması.

:::warning
`aborted` özelliği artık kullanılmamaktadır, ancak `destroyed` uygun bir alternatif değildir, çünkü [Node.js belgeleri](https://nodejs.org/api/http.html#requestaborted) bunu önermektedir. Bir istek, sunucu bağlantıyı kapattığında gibi çeşitli nedenlerle `destroyed` hale getirilebilir. `aborted` özelliği, istemcinin isteği kasıtlı olarak iptal ettiğini tespit etmek için hala en güvenilir yoldur.
:::

Bu mantığı, bir kancanın dışında, doğrudan belirli bir rotada da uygulayabilirsiniz.

```js
app.get('/', async (request, reply) => {
  request.raw.on('close', () => {
    if (request.raw.aborted) {
      app.log.info('istek kapandı')
    }
  })
  await sleep(3000)
  reply.code(200).send({ ok: true })
})
```

İş mantığınızın herhangi bir noktasında isteğin iptal edilip edilmediğini kontrol edebilir ve alternatif işlemler yapabilirsiniz.

```js
app.get('/', async (request, reply) => {
  await sleep(3000)
  if (request.raw.aborted) {
    // burada bir şey yap
  }
  await sleep(3000)
  reply.code(200).send({ ok: true })
})
```

Bunu uygulama kodunuza eklemenin bir faydası, `reqId` gibi Fastify detaylarını günlüğe kaydetmenizdir. Bu tür bilgiler, yalnızca ham istek bilgilerine erişimi olan daha düşük düzeydeki kodlarda mevcut olmayabilir.

### Test

Bu işlevselliği test etmek için Postman gibi bir uygulama kullanabilir ve isteğinizi 3 saniye içinde iptal edebilirsiniz. Alternatif olarak, bir istek yapıp isteğe bağlı mantık ile 3 saniyeden önce isteği iptal edecek bir HTTP isteği göndermek için Node kullanabilirsiniz. Örnek:

```js
const controller = new AbortController();
const signal = controller.signal;

(async () => {
   try {
      const response = await fetch('http://localhost:3000', { signal });
      const body = await response.text();
      console.log(body);
   } catch (error) {
      console.error(error);
   }
})();

setTimeout(() => {
   controller.abort()
}, 1000);
```

Her iki yaklaşımda da, isteğin iptal edildiği anda Fastify günlüğü görünmelidir.

## Sonuç

Uygulamanın ayrıntıları bir problemden diğerine değişebilir, ancak bu kılavuzun ana amacı, Fastify ekosisteminde çözülebilecek bir sorunun çok özel bir kullanım durumunu göstermektedir.

İstek kapandı olayını dinleyebilir ve isteğin iptal edilip edilmediğini veya başarılı bir şekilde teslim edilip edilmediğini belirleyebilirsiniz. Bu çözümü, bir onRequest kancasında veya bireysel bir rota içinde doğrudan uygulayabilirsiniz.

:::note
Bu yaklaşım, internet kesintisi durumunda tetiklenmeyecek ve bu tür bir tespit ek iş mantığı gerektirecektir. Eğer arka planda bir uygulama mantığınız varsa ve bu durum sunucunun çökmesine neden oluyorsa, yanlış bir tespit tetikleyebilirsiniz.
:::

`clientErrorHandler`, varsayılan olarak veya özel mantık ile bu senaryoyu ele almak için tasarlanmamıştır ve istemci bir isteği iptal ettiğinde tetiklenmeyecektir.