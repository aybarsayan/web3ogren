---
title: V4 Göç Rehberi
seoTitle: Fastify v4 Migration Guide
sidebar_position: 1
description: Bu kılavuz, Fastify v3ten v4e geçişte yardım amaçlı hazırlanmıştır. Fastify v4e geçiş için gerekli adımları ve önemli değişiklikleri içermektedir.
tags: 
  - Fastify
  - Migration
  - API
  - Development
keywords: 
  - Fastify
  - v4 Migration
  - API Changes
  - Development Guide
---
## V4 Göç Rehberi

Bu kılavuz, Fastify v3'ten v4'e geçişte yardımcı olmak amacıyla hazırlanmıştır.

V4'e geçmeden önce, lütfen v3'ten kaynaklanan tüm kullanımdan kaldırma uyarılarını düzelttiğinizden emin olun. Tüm v3 kullanımdan kaldırmalar kaldırılmıştır ve güncellemeden sonra artık çalışmayacaklardır.

## Kod Değişiklikleri
# v4 Kod Değişiklikleri

Yükseliş sürecine yardımcı olmak için, [Codemod](https://github.com/codemod-com/codemod) ekibiyle birlikte çalışarak Fastify v4'teki birçok yeni API ve deseni otomatik olarak güncelleyecek kod değişikliklerini yayınladık.

Aşağıdaki
[migasyon tarifini](https://go.codemod.com/fastify-4-migration-recipe) çalıştırarak kodunuzu otomatik olarak Fastify v4'e güncelleyebilirsiniz:

```
npx codemod@latest fastify/4/migration-recipe
```

Bu, aşağıdaki kod değişikliklerini çalıştıracaktır:

- [`fastify/4/remove-app-use`](https://go.codemod.com/fastify-4-remove-app-use)
- [`fastify/4/reply-raw-access`](https://go.codemod.com/fastify-4-reply-raw-access)
- [`fastify/4/wrap-routes-plugin`](https://go.codemod.com/fastify-4-wrap-routes-plugin)
- [`fastify/4/await-register-calls`](https://go.codemod.com/fastify-4-await-register-calls)

Bu kod değişikliklerinin her biri, v4 göç rehberinde belirtilen değişiklikleri otomatikleştirir. Mevcut Fastify kod değişikliklerinin tam listesi ve daha fazla detay için, [Codemod Kaydı](https://go.codemod.com/fastify) sayfasını ziyaret edin.