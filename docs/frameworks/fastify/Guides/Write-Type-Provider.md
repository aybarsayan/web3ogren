---
title: Fastify
seoTitle: Fastify Documentation
sidebar_position: 4
description: Fastify provides a comprehensive guide on writing custom type providers. This section covers type contravariance and its implications for TypeScript.
tags: 
  - Fastify
  - type provider
  - TypeScript
  - development
keywords: 
  - Fastify
  - type provider
  - TypeScript
  - development
---


## Kendi tür sağlayıcınızı nasıl yazarsınız

Özelleştirilmiş `tür sağlayıcı` uygularken aklınızda bulundurmanız gereken şeyler:

:::tip
Tür sağlayıcınızı yazarken, type constraining kurallarına dikkat edin. Bu, kodunuzun daha iyi çalışmasını sağlar.
:::

### Tür Kontravaransı

Tam tür daraltma kontrolleri genellikle ulaşılmaz bir durumu temsil etmek için `never` kullanırken, tür sağlayıcı arayüzlerindeki daraltma yalnızca `unknown` seviyesine kadar yapılmalıdır.

Bunun sebebi, `FastifyInstance`'in belirli yöntemlerinin `TypeProvider` üzerinde kontravariant olmasıdır. Bu durum özel tür sağlayıcı arayüzü `FastifyTypeProviderDefault` ile değiştirilebilir olmadıkça TypeScript'in atama sorunlarını önüne çıkarabilir.

> Örneğin, `FastifyTypeProviderDefault` aşağıdakine atanamaz:
> ```ts
> export interface NotSubstitutableTypeProvider extends FastifyTypeProvider {
>    // kötü, `never`'e atanabilecek hiçbir şey yok (kendisi dışında)
>   validator: this['schema'] extends /** custom check here**/ ? /** narrowed type here **/ : never;
>   serializer: this['schema'] extends /** custom check here**/ ? /** narrowed type here **/ : never;
> }
> ```
> — Fastify TypeProvider Dökümantasyonu

Aksi takdirde şu şekilde değiştirilmelidir:
```ts
export interface SubstitutableTypeProvider extends FastifyTypeProvider {
  // iyi, `unknown`'a herhangi bir şey atanabilir
  validator: this['schema'] extends /** custom check here**/ ? /** narrowed type here **/ : unknown;
  serializer: this['schema'] extends /** custom check here**/ ? /** narrowed type here **/ : unknown;
}
```