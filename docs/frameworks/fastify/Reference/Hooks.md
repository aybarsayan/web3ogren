---
title: Hızlı Başlangıç
seoTitle: Fastify Hızlı Başlangıç Kılavuzu
sidebar_position: 1
description: Fastify ile hızlı bir başlangıç yapmanızı sağlayan bu kılavuz, yaşam döngüsü ve hook kullanımı hakkında kapsamlı bilgiler sunmaktadır.
tags: 
  - Fastify
  - Hook
  - Geliştirme
  - Node.js
  - Web Framework
keywords: 
  - Fastify
  - Hook
  - Node.js
  - Web Development
  - JavaScript
---
Fastify

## Hooks

Hooks, `fastify.addHook` metodu ile kaydedilir ve uygulamadaki ya da istek/cevap yaşam döngüsündeki belirli olayları dinlemenizi sağlar. Bir olay tetiklenmeden önce bir hook kaydetmelisiniz, aksi takdirde olay kaybolacaktır.

:::tip
Hooks kullanarak Fastify'ın yaşam döngüsü ile doğrudan etkileşimde bulunabilirsiniz.
:::

İstek/Cevap hook'ları ve uygulama hook'ları vardır:

- `İstek/Cevap Hooks`
  - `onRequest`
  - `preParsing`
  - `preValidation`
  - `preHandler`
  - `preSerialization`
  - `onError`
  - `onSend`
  - `onResponse`
  - `onTimeout`
  - `onRequestAbort`
  - `Bir hook'tan hataları yönetme`
  - `Bir hook'tan bir isteğe yanıt verme`
- `Uygulama Hooks`
  - `onReady`
  - `onListen`
  - `onClose`
  - `preClose`
  - `onRoute`
  - `onRegister`
- `Kapsam`
- `Route seviyesi hook'lar`
- `Özel Özellikleri Enjekte Etmek İçin Hooks Kullanma`
- `Tanımsal Kanal Hooks`

**Dikkat:** `async`/`await` kullanırken veya bir `Promise` döndürürken `done` geri çağrısı mevcut değildir. Bu durumda `done` geri çağrısını çağırırsanız beklenmedik davranışlar oluşabilir, örneğin, işleyicilerin çoğaltılması.

## İstek/Cevap Hooks

`İstek` ve `Cevap` temel Fastify nesneleridir.

`done`, `yaşam döngüsü` ile devam etmek için kullanılan işlevdir.

Her bir hook'un nerede yürütüleceğini anlamak kolaydır; `yaşam döngüsü sayfasına` bakarak görebilirsiniz.

Hooks, Fastify'ın kapsülleme özelliğinden etkilenir ve bu nedenle seçilen rotalara uygulanabilir. Daha fazla bilgi için `Kapsam` bölümüne bakın.

İstek/Cevap'ta kullanabileceğiniz sekiz farklı hook bulunmaktadır *(yürütme sırasına göre)*:

### onRequest
```js
fastify.addHook('onRequest', (request, reply, done) => {
  // Bazı kodlar
  done()
})
```
Ya da `async/await`:
```js
fastify.addHook('onRequest', async (request, reply) => {
  // Bazı kodlar
  await asyncMethod()
})
```

**Dikkat:** `onRequest` hook'unda, `request.body` her zaman `undefined` olacaktır, çünkü gövde ayrıştırması `preValidation` hook'undan önce gerçekleşir.