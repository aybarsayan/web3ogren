---
title: "Node.js yerleşik API'leri"
description: "Bu belge, Deno Deploy üzerinde Node.js'nin yerleşik modüllerini nasıl kullanabileceğinizi açıklamaktadır. Ayrıca, Deno Deploy'da bu modüller ile çalışan bir örnek HTTP sunucusu sunulmaktadır."
keywords: [Deno, Node.js, API, modüller, HTTP sunucusu, yerleşik, ESM]
---

Deno Deploy, `fs`, `path` ve `http` gibi yerleşik Node.js modüllerini `node:` spesifikasyonları aracılığıyla içe aktarmayı yerel olarak destekler. Bu, Deno Deploy'da değişiklik yapmadan orijinal olarak Node.js için yazılmış kodların çalıştırılmasını sağlar.

:::info
Deno Deploy, Node.js modüllerini kullanırken tüm diğer özelliklerini de desteklemektedir.
:::

İşte Deno Deploy üzerinde çalışan bir Node.js HTTP sunucusunun bir örneği:

```js
import { createServer } from "node:http";
import process from "node:process";

const server = createServer((req, res) => {
  const message = `Hello from ${process.env.DENO_REGION} at ${new Date()}`;
  res.end(message);
});

server.listen(8080);
```

_Bu örneği burada canlı olarak görebilirsiniz:  
https://dash.deno.com/playground/node-specifiers_

`node:` spesifikasyonlarını kullanırken, Deno Deploy'un tüm diğer özellikleri hala mevcuttur. Örneğin, Node.js modüllerini kullanırken ortam değişkenlerine erişmek için `Deno.env`'i kullanabilirsiniz. Ayrıca, dış URL'lerden diğer ESM modüllerini de her zamanki gibi içe aktarabilirsiniz.

Aşağıdaki Node.js modülleri mevcuttur:

- `assert`
- `assert/strict`
- `async_hooks`
- `buffer`
- `child_process`
- `cluster`
- `console`
- `constants`
- `crypto`
- `dgram`
- `diagnostics_channel`
- `dns`
- `dns/promises`
- `domain`
- `events`
- `fs`
- `fs/promises`
- `http`
- `http2`
- `https`
- `module`
- `net`
- `os`
- `path`
- `path/posix`
- `path/win32`
- `perf_hooks`
- `process`
- `punycode`
- `querystring`
- `readline`
- `stream`
- `stream/consumers`
- `stream/promises`
- `stream/web`
- `string_decoder`
- `sys`
- `timers`
- `timers/promises`
- `tls`
- `tty`
- `url`
- `util`
- `util/types`
- `v8`
- `vm`
- `worker_threads`
- `zlib`

Bu modüllerin davranışı çoğu durumda Node.js ile aynı olmalıdır. Ancak, Deno Deploy'un kumelendirme davranışı nedeniyle bazı özellikler mevcut değildir:

- `child_process` ile ikili dosyaların çalıştırılması
- `worker_threads` kullanarak işçi süreçlerin başlatılması
- `vm` ile bağlamlar oluşturma ve kod değerlendirme

> Not: Node.js modüllerinin emülasyonu çoğu kullanım durumu için yeterlidir, ancak henüz mükemmel değildir. Herhangi bir sorunla karşılaşırsanız, lütfen  
> — [bir sorun açın](https://github.com/denoland/deno).