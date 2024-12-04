---
title: Fastify
seoTitle: Fastify Request Documentation
sidebar_position: 1
description: Fastifys Request object is essential for processing incoming requests. This document details its structure and properties.
tags: 
  - Fastify
  - Request
  - Web Development
  - Node.js
keywords: 
  - Fastify
  - Request
  - API
  - Web Server
  - Middleware
---
## Request
İşleyici fonksiyonunun ilk parametresi `Request`'tir.

Request, aşağıdaki alanlara sahip temel bir Fastify nesnesidir:

- `query` - ayrıştırılmış sorgu dizesi, formatı `querystringParser` ile belirtilmiştir
- `body` - istek yükü, Fastify'ın yerel olarak ayrıştırdığı isteğin yükleri ve diğer içerik türlerini destekleme hakkında ayrıntılar için `İçerik Türü Parser` bölümüne bakın
- `params` - URL ile eşleşen parametreler
- `headers` - başlık getter ve setter
- `raw` - Node çekirdekten gelen HTTP isteği
- `server` - Mevcut `kapsama bağlamı` için alanı tanımlayan Fastify sunucu örneği
- `id` - istek ID'si
- `log` - gelen isteğin logger örneği
- `ip` - gelen isteğin IP adresi
- `ips` - gelen isteğin `X-Forwarded-For` başlığında en yakın olandan en uzak olana doğru sıralanmış IP adreslerine sahip bir dizi (yalnızca `trustProxy` seçeneği etkinleştirildiğinde)
- `host` - gelen isteğin host'u ( `trustProxy` seçeneği etkinleştirildiğinde `X-Forwarded-Host` başlığından türetilmiştir). HTTP/2 uyumluluğu için host başlığı mevcut değilse `:authority` döndürülür. Sunucu ayarlarında `requireHostHeader = false` kullanırsanız, host başlığı eksik olduğunda boş olarak geri döner.
- `hostname` - gelen isteğin port olmadan host'u
- `port` - sunucunun dinlediği port
- `protocol` - gelen isteğin protokolü (`https` veya `http`)
- `method` - gelen isteğin yöntemi
- `url` - gelen isteğin URL'si
- `originalUrl` - `url`'ye benzer, dahili yeniden yönlendirme durumunda orijinal `url`'ye erişmenizi sağlar
- `is404` - istek 404 işleyicisi tarafından işleniyorsa true, işlenmiyorsa false
- `socket` - gelen isteğin altındaki bağlantı
- `context` - Kullanımdan kaldırılmıştır, bunun yerine `request.routeOptions.config` kullanın.

  Fastify iç nesnesidir. Doğrudan kullanmamalı veya değiştirmemelisiniz. Tek bir özel anahtara erişmek için kullanışlıdır:
  
  - `context.config` - Rota `config` nesnesi.
  
- `routeOptions` - Rota `option` nesnesi
  
  - `bodyLimit` - ya sunucu sınırı ya da rota sınırı
  - `config` - bu rota için `config` nesnesi
  - `method` - rota için http yöntemi
  - `url` - bu rotayı eşleşecek URL'nin yolu
  - `handler` - bu rota için işleyici
  - `attachValidation` - istek üzerine `validationError` eklemek (şayet bir şema tanımlanmışsa)
  - `logLevel` - bu rota için tanımlanan log seviyesi
  - `schema` - bu rota için JSON şemaları tanımı
  - `version` - uç noktanın sürümünü tanımlayan bir semver uyumlu dize
  - `exposeHeadRoute` - herhangi bir GET rotası için bir kardeş HEAD rotası oluşturur
  - `prefixTrailingSlash` - bir rota ile geçişi nasıl ele alacağınızı belirlemek için kullanılan dize.

- `.getValidationFunction(schema | httpPart)` - Belirtilen şemaya veya http parçasına göre, varsa bir doğrulama fonksiyonu döndürür.
- [.compileValidationSchema(schema, [httpPart])](#compilevalidationschema) - Belirtilen şemayı derler ve varsayılan (ya da özelleştirilmiş) `ValidationCompiler` kullanarak bir doğrulama fonksiyonu döndürür. Opsiyonel `httpPart` sağlanmışsa `ValidationCompiler`'a iletilir, varsayılan olarak `null`'dır.
- [.validateInput(data, schema | httpPart, [httpPart])](#validate) - Belirtilen şemayı kullanarak belirtilen girişi doğrular ve seri hale getirilmiş yükü döndürür. Opsiyonel `httpPart` sağlanırsa, fonksiyon o HTTP Durum Kodu için verilen seri hale getirme fonksiyonunu kullanacaktır. Varsayılan olarak `null`'dır.

:::tip
Geliştiriciler için faydalı ipuçları ve en iyi uygulamalar.
:::