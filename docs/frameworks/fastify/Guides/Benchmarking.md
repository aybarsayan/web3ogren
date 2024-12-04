---
title: Fastify Performance Benchmarking
seoTitle: Fastify Performance Benchmarking
sidebar_position: 4
description: Bu içerik, Fastify uygulamanızın performansını ölçmek için benchmark araçlarının kullanımını ele alıyor. Hangi araçların kullanılacağını ve çeşitli test senaryolarının nasıl uygulanacağını detaylandırıyor.
tags: 
  - Fastify
  - Benchmarking
  - Node.js
  - Autocannon
  - Git
keywords: 
  - Fastify
  - Benchmarking
  - Node.js
  - autocommand
  - git
---

## Benchmarking

:::info
Benchmarking, bir değişikliğin uygulamanızın performansını nasıl etkileyebileceğini ölçmek istiyorsanız önemlidir.
:::

Kullanıcı ve katkıda bulunan perspektifinden uygulamanızı benchmarklamak için basit bir yol sunuyoruz. Kurulum, farklı dallarda ve farklı Node.js sürümlerinde benchmarkları otomatikleştirmenizi sağlar.

### Kullanacağımız modüller:
- [Autocannon](https://github.com/mcollina/autocannon): Node'da yazılmış bir HTTP/1.1 benchmarking aracı.
- [Branch-comparer](https://github.com/StarpTech/branch-comparer): Birden fazla git dalını kontrol edin, komut dosyalarını çalıştırın ve sonuçları kaydedin.
- [Concurrently](https://github.com/kimmobrunfeldt/concurrently): Komutları eşzamanlı olarak çalıştırın.
- [Npx](https://github.com/npm/npx): Farklı Node.js Sürümlerine karşı komut dosyalarını çalıştırmak ve yerel ikili dosyaları çalıştırmak için kullanılan NPM paket koşucusu. npm@5.2.0 ile birlikte gönderilir.