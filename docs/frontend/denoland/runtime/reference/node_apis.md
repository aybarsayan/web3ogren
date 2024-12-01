---
title: Node API'leri
description: Deno, Node.js ile uyumlu birçok global özellik ve modül sunar. Bu kılavuz, Deno'nun desteklediği Node global değişkenlerinin listesini ve ilişkili durumlarını içerir.
keywords: [Deno, Node.js, global değişkenler, API, uyumluluk]
---

Deno, bir dizi yerleşik Node.js modülü ve global için polyfill sağlar.

Yerleşik Node API'lerini keşfedin

Node uyumluluğu devam eden bir projedir - boşlukları belirlememize yardımcı olun ve hangi modüllere ihtiyacınız olduğunu [GitHub'da bir sorun açarak](https://github.com/denoland/deno) bize bildirin.

{{ await generateNodeCompatability() }}

## Global Değişkenler

:::info
Bu, Deno'nun desteklediği Node global değişkenlerinin listesidir. Bu global değişkenler yalnızca `npm` paket alanında mevcuttur. Kendi kodunuzda, bunları ilgili `node:` modülünden içe aktararak kullanabilirsiniz.
:::

| Global adı                                                                                                      | Durum                             |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [`AbortController`](https://nodejs.org/api/globals.html#class-abortcontroller)                                   | ✅                                 |
| [`AbortSignal`](https://nodejs.org/api/globals.html#class-abortsignal)                                           | ✅                                 |
| [`Blob`](https://nodejs.org/api/globals.html#class-blob)                                                         | ✅                                 |
| [`Buffer`](https://nodejs.org/api/globals.html#class-buffer)                                                     | ✅                                 |
| [`ByteLengthQueuingStrategy`](https://nodejs.org/api/globals.html#class-bytelengthqueuingstrategy)               | ✅                                 |
| [`__dirname`](https://nodejs.org/api/globals.html#__dirname)                                                     | ⚠️ `Bilgi` |
| [`__filename`](https://nodejs.org/api/globals.html#__filename)                                                   | ⚠️ `Bilgi`  |
| [`atob`](https://nodejs.org/api/globals.html#atobdata)                                                           | ✅                                 |
| [`BroadcastChannel`](https://nodejs.org/api/globals.html#broadcastchannel)                                       | ✅                                 |
| [`btoa`](https://nodejs.org/api/globals.html#btoadata)                                                           | ✅                                 |
| [`clearImmediate`](https://nodejs.org/api/globals.html#clearimmediateimmediateobject)                            | ✅                                 |
| [`clearInterval`](https://nodejs.org/api/globals.html#clearintervalintervalobject)                               | ✅                                 |
| [`clearTimeout`](https://nodejs.org/api/globals.html#cleartimeouttimeoutobject)                                  | ✅                                 |
| [`CompressionStream`](https://nodejs.org/api/globals.html#class-compressionstream)                               | ✅                                 |
| [`console`](https://nodejs.org/api/globals.html#console)                                                         | ✅                                 |
| [`CountQueuingStrategy`](https://nodejs.org/api/globals.html#class-countqueuingstrategy)                         | ✅                                 |
| [`Crypto`](https://nodejs.org/api/globals.html#crypto)                                                           | ✅                                 |
| [`CryptoKey`](https://nodejs.org/api/globals.html#cryptokey)                                                     | ✅                                 |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅                                 |
| [`DecompressionStream`](https://nodejs.org/api/globals.html#class-decompressionstream)                           | ✅                                 |
| [`Event`](https://nodejs.org/api/globals.html#event)                                                             | ✅                                 |
| [`EventTarget`](https://nodejs.org/api/globals.html#eventtarget)                                                 | ✅                                 |
| [`exports`](https://nodejs.org/api/globals.html#exports)                                                         | ✅                                 |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅                                 |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅                                 |
| [`FormData`](https://nodejs.org/api/globals.html#class-formdata)                                                 | ✅                                 |
| [`global`](https://nodejs.org/api/globals.html#global)                                                           | ✅                                 |
| [`Headers`](https://nodejs.org/api/globals.html#class-headers)                                                   | ✅                                 |
| [`MessageChannel`](https://nodejs.org/api/globals.html#messagechannel)                                           | ✅                                 |
| [`MessageEvent`](https://nodejs.org/api/globals.html#messageevent)                                               | ✅                                 |
| [`MessagePort`](https://nodejs.org/api/globals.html#messageport)                                                 | ✅                                 |
| [`module`](https://nodejs.org/api/globals.html#module)                                                           | ✅                                 |
| [`PerformanceEntry`](https://nodejs.org/api/globals.html#performanceentry)                                       | ✅                                 |
| [`PerformanceMark`](https://nodejs.org/api/globals.html#performancemark)                                         | ✅                                 |
| [`PerformanceMeasure`](https://nodejs.org/api/globals.html#performancemeasure)                                   | ✅                                 |
| [`PerformanceObserver`](https://nodejs.org/api/globals.html#performanceobserver)                                 | ✅                                 |
| [`PerformanceObserverEntryList`](https://nodejs.org/api/globals.html#performanceobserverentrylist)               | ❌                                 |
| [`PerformanceResourceTiming`](https://nodejs.org/api/globals.html#performanceresourcetiming)                     | ❌                                 |
| [`performance`](https://nodejs.org/api/globals.html#performance)                                                 | ✅                                 |
| [`process`](https://nodejs.org/api/globals.html#process)                                                         | ✅                                 |
| [`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback)                                   | ✅                                 |
| [`ReadableByteStreamController`](https://nodejs.org/api/globals.html#class-readablebytestreamcontroller)         | ✅                                 |
| [`ReadableStream`](https://nodejs.org/api/globals.html#class-readablestream)                                     | ✅                                 |
| [`ReadableStreamBYOBReader`](https://nodejs.org/api/globals.html#class-readablestreambyobreader)                 | ✅                                 |
| [`ReadableStreamBYOBRequest`](https://nodejs.org/api/globals.html#class-readablestreambyobrequest)               | ✅                                 |
| [`ReadableStreamDefaultController`](https://nodejs.org/api/globals.html#class-readablestreamdefaultcontroller)   | ✅                                 |
| [`ReadableStreamDefaultReader`](https://nodejs.org/api/globals.html#class-readablestreamdefaultreader)           | ✅                                 |
| [`require`](https://nodejs.org/api/globals.html#require)                                                         | ✅                                 |
| [`Response`](https://nodejs.org/api/globals.html#response)                                                       | ✅                                 |
| [`Request`](https://nodejs.org/api/globals.html#request)                                                         | ✅                                 |
| [`setImmediate`](https://nodejs.org/api/globals.html#setimmediatecallback-args)                                  | ✅                                 |
| [`setInterval`](https://nodejs.org/api/globals.html#setintervalcallback-delay-args)                              | ✅                                 |
| [`setTimeout`](https://nodejs.org/api/globals.html#settimeoutcallback-delay-args)                                | ✅                                 |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅                                 |
| [`SubtleCrypto`](https://nodejs.org/api/globals.html#subtlecrypto)                                               | ✅                                 |
| [`DOMException`](https://nodejs.org/api/globals.html#domexception)                                               | ✅                                 |
| [`TextDecoder`](https://nodejs.org/api/globals.html#textdecoder)                                                 | ✅                                 |
| [`TextDecoderStream`](https://nodejs.org/api/globals.html#class-textdecoderstream)                               | ✅                                 |
| [`TextEncoder`](https://nodejs.org/api/globals.html#textencoder)                                                 | ✅                                 |
| [`TextEncoderStream`](https://nodejs.org/api/globals.html#class-textencoderstream)                               | ✅                                 |
| [`TransformStream`](https://nodejs.org/api/globals.html#class-transformstream)                                   | ✅                                 |
| [`TransformStreamDefaultController`](https://nodejs.org/api/globals.html#class-transformstreamdefaultcontroller) | ✅                                 |
| [`URL`](https://nodejs.org/api/globals.html#url)                                                                 | ✅                                 |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅                                 |
| [`WebAssembly`](https://nodejs.org/api/globals.html#webassembly)                                                 | ✅                                 |
| [`WritableStream`](https://nodejs.org/api/globals.html#class-writablestream)                                     | ✅                                 |
| [`WritableStreamDefaultController`](https://nodejs.org/api/globals.html#class-writablestreamdefaultcontroller)   | ✅                                 |
| [`WritableStreamDefaultWriter`](https://nodejs.org/api/globals.html#class-writablestreamdefaultwriter)           | ✅                                 |

:::tip
Bu global değişkenlerden bazıları, geliştirme sürecinize önemli katkılarda bulunabilir. Her birinin işlevini anlamak, projenizin genel verimliliğini artıracaktır.
:::