---
title: "API Referansı"
sidebar_title: "Genel Bakış"
description: Deno Deploy üzerinde mevcut olan çalışma zamanı API'larına bir referans sunulmaktadır. Bu sayfa, API'ların temel işlevselliğini ve kullanımını açıklar.
keywords: [Deno, API, çalışma zamanı, sunucusuz, Web API, Deno Deploy]
---

Bu, Deno Deploy üzerinde mevcut olan çalışma zamanı API'larına bir referanstır. Bu API, standart `çalışma zamanı API'si` ile çok benzerlik göstermektedir, ancak bazı API'lar, Deno Deploy'nin sunucusuz bir ortam olması nedeniyle aynı şekilde mevcut değildir.

Lütfen Deno Deploy üzerindeki mevcut API'ları keşfetmek için bu belge bölümünü kullanın.

### Web API'leri

- [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console)
- [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob)
- [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  - `fetch`
  - `Request`
  - `Response`
  - `URL`
  - `File`
  - `Blob`
- [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream)
- [TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)
- [Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)
  - `randomUUID()`
  - `getRandomValues()`
  - [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Timers](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
  (`setTimeout`, `clearTimeout`, ve `setInterval`)
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
  - `ReadableStream`
  - `WritableStream`
  - `TransformStream`
- [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- [Import Maps](https://docs.deno.com/runtime/manual/basics/import_maps/)
  - :::tip
    `import maps` şu anda sadece [deployctl](https://github.com/denoland/deployctl) veya [deployctl GitHub Action](https://github.com/denoland/deployctl/blob/main/action/README.md) iş akışları aracılığıyla mevcut.
  
### Deno API'leri

> Not: Sadece Deno'nun kararlı API'leri Deploy'da mevcut hale getirilmiştir.

- [`Deno.env`](https://docs.deno.com/api/deno/~/Deno.env) - Çevresel değişkenlerle (şifreler) etkileşim.
  - `get(key: string): string | undefined` - Bir çevresel değişkenin değerini alır.
  - `toObject(): { [key: string]: string }` - Tüm çevresel değişkenleri bir nesne olarak alır.
- [`Deno.connect`](https://docs.deno.com/api/deno/~/Deno.connect) - TCP soketlerine bağlan.
- [`Deno.connectTls`](https://docs.deno.com/api/deno/~/Deno.connectTls) - TLS kullanarak TCP soketlerine bağlan.
- [`Deno.startTls`](https://docs.deno.com/api/deno/~/Deno.startTls) - Mevcut bir TCP bağlantısından TLS el sıkışmasını başlat.
- [`Deno.resolveDns`](https://docs.deno.com/api/deno/~/Deno.resolveDns) - DNS sorguları yap.
- Dosya sistemi API'si
  - [`Deno.cwd`](https://docs.deno.com/api/deno/~/Deno.cwd) - Geçerli çalışma dizinini al.
  - [`Deno.readDir`](https://docs.deno.com/api/deno/~/Deno.readDir) - Dizin listelemelerini al.
  - [`Deno.readFile`](https://docs.deno.com/api/deno/~/Deno.readFile) - Bir dosyayı belleğe oku.
  - [`Deno.readTextFile`](https://docs.deno.com/api/deno/~/Deno.readTextFile) - Bir metin dosyasını belleğe oku.
  - [`Deno.open`](https://docs.deno.com/api/deno/~/Deno.open) - Bir dosyayı akış okuması için aç.
  - [`Deno.stat`](https://docs.deno.com/api/deno/~/Deno.stat) - Dosya sistemi giriş bilgilerini al.
  - [`Deno.lstat`](https://docs.deno.com/api/deno/~/Deno.lstat) - Sembolik bağlantıları takip etmeden dosya sistemi giriş bilgilerini al.
  - [`Deno.realPath`](https://docs.deno.com/api/deno/~/Deno.realPath) - Sembolik bağlantıları çözümledikten sonra bir dosyanın gerçek yolunu al.
  - [`Deno.readLink`](https://docs.deno.com/api/deno/~/Deno.readLink) - Verilen sembolik bağlantı için hedef yolu al.

## Gelecek destek

Gelecekte, bu API'lar da eklenecektir:

- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- UDP API:
  - `Deno.connectDatagram` çıkış UDP soketleri için
- `Deno.createHttpClient` kullanarak özelleştirilebilir `fetch` seçenekleri

## Sınırlamalar

:::warning
Deno CLI gibi, `__proto__` nesne alanını ECMA Script Ek B'de belirtilen şekilde uygulamıyoruz.
:::