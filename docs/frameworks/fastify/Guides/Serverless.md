---
title: Sunucusuz
seoTitle: Sunucusuz Uygulamalar için Fastify Kullanımı
sidebar_position: 1
description: Bu belge, mevcut Fastify uygulamanızı kullanarak sunucusuz uygulamalar ve REST APIlerini nasıl çalıştıracağınızı açıklar. En popüler sunucusuz sağlayıcılarla Fastifyı nasıl kullanacağınızı keşfedin.
tags: 
  - Fastify
  - Sunucusuz
  - REST API
  - AWS
  - Google Cloud
  - Firebase
keywords: 
  - Sunucusuz
  - Fastify
  - REST API
  - AWS
  - Google Cloud
  - Firebase
---
## Sunucusuz

Mevcut Fastify uygulamanızı kullanarak sunucusuz uygulamalar ve REST API'leri çalıştırın. Varsayılan olarak, Fastify sunucusuz platformunuzda çalışmaz; bunu düzeltmek için bazı küçük değişiklikler yapmanız gerekecek. Bu belge, en popüler sunucusuz sağlayıcılar için bir kılavuz ve bunlarla Fastify'ı nasıl kullanacağınızı içermektedir.

:::tip
Hizmet olarak işlevlerin her zaman küçük ve odaklı işlevler kullanması gerektiğini unutmayın.
:::

#### Sunucusuz bir platformda Fastify kullanmalı mısınız?

Bu tamamen size bağlı! Uygulama ne kadar büyükse, başlangıç süresi o kadar yavaş olur. Fastify uygulamalarını sunucusuz ortamlarda çalıştırmanın en iyi yolu, aynı anda birden fazla isteği işleyebilen ve Fastify'ın özelliklerinden tam olarak yararlanan Google Cloud Run, AWS Fargate ve Azure Container Instances gibi platformları kullanmaktır.

Sunucusuz uygulamalarda Fastify kullanmanın en iyi özelliklerinden biri geliştirme kolaylığıdır. Yerel ortamınızda, ek araçlara ihtiyaç duymadan her zaman Fastify uygulamanızı doğrudan çalıştırabilirsiniz; aynı kod, seçtiğiniz sunucusuz platformda ek bir kod parçasıyla çalıştırılacaktır.

### İçindekiler

- `AWS`
- `Google Cloud Functions`
- `Google Firebase Functions`
- `Google Cloud Run`
- `Netlify Lambda`
- `Platformatic Cloud`
- `Vercel`