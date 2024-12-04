---
title: Zaman Aşımı
seoTitle: Zaman Aşımı - Sunucu ve İstemci Yönetimi
sidebar_position: 8
description: Zaman aşımı, sunucuların yanıtları işlemek için belirlediği süreyi ifade eder. Bu doküman, sunucu ve istemci tarafında zaman aşımının nasıl yönetileceğini açıklamaktadır.
tags: 
  - zaman aşımı
  - sunucu
  - istemci
  - gRPC
keywords: 
  - zaman aşımı
  - sunucu
  - istemci
  - gRPC
---
Zaman aşımı, bir sunucunun bir yanıtı işlemek için alabileceği süreyi sınırlamak için kullanılabilir. Connect-ES'de, zaman aşımı değerleri, istemci tarafından `timeoutMs` seçeneği aracılığıyla talep gönderildiğinde ayarlanır. Yanıtın işlenmesi zaman aşımından daha uzun sürerse, `deadline_exceeded` hata kodu ile yanıt verirler. gRPC'de bu kavram, ayrıca [zaman aşımı](https://grpc.io/docs/guides/deadlines/) olarak bilinir.

## `HandlerContext` Kullanımı

Sunucular, bu zaman aşımını [handler bağlamı](https://connectrpc.com/docs/node/implementing-services#context) aracılığıyla etkileşimde bulunabilir. İhtiyaçlarınıza bağlı olarak, bunu ele almanın birkaç yolu vardır:

:::tip
**İpucu:** Zaman aşımı yönetimi, uygulamanızın performansını artırabilir.
:::

İlk yol, bağlamdaki [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) üzerinden gerçekleşir. Bu sinyali kullanarak, yönlendirme işleyicileri istemcinin belirttiği zaman aşımının aşıldığını belirtebilir ve süreçlerini buna göre durdurabilir. `AbortSignal`, `signal` isimli özellik aracılığıyla bulunabilir.

Sinyal, diğer fonksiyonlara geçirilerek veya zaman aşımı gerçekleştiğinde veya RPC döndüğünde süreçleri nazikçe durdurmak için kullanılabilir. `signal` kullanımı, API destekliyorsa, çağırmak istediğiniz herhangi bir işlem için geçerlidir.

```ts
import type { HandlerContext } from "@bufbuild/connect";

const say = async (req: SayRequest, ctx: HandlerContext) => {

    ctx.signal.aborted; // zaman aşımı gerçekleşirse true
    ctx.signal.reason; // zaman aşımı gerçekleştiyse deadline_exceeded kodlu bir hata

    // zaman aşımı gerçekleşirse deadline_exceeded kodu ile bir hata verir
    ctx.signal.throwIfAborted();

    // AbortSignal diğer fonksiyonlara aktarılabilir
    await longRunning(ctx.signal);

    return {sentence: `Dedin ki: ${req.sentence}`};
};
```

Zaman aşımı değeriyle etkileşime geçmenin ikinci yolu, handler bağlamındaki `timeoutMs()` fonksiyonu aracılığıyladır. Eğer mevcut talepte bir zaman aşımı belirlenmişse, bu fonksiyon kalan süreyi döndürür.

:::info
**Bilgi:** `timeoutMs()` fonksiyonunun kullanılması, yukarı akışta RPC çağrıları yaparken daha verimli ve sağlamdır.
:::

`timeoutMs()` fonksiyonunun kullanılması, yukarı akışta RPC çağrıları yaparken daha verimli ve sağlamdır; çünkü karşı tarafın zaman aşımının farkında olacağını garanti eder, ağ sorunlarından bağımsız olarak. gRPC'de bu kavram, ayrıca [zaman aşımı yayılımı](https://grpc.io/docs/guides/deadlines/#deadline-propagation) olarak bilinir.

```ts
import type { HandlerContext } from "@bufbuild/connect";

const say = async (req: SayRequest, ctx: HandlerContext) => {
  
    // Eğer bu hizmete yapılan çağrıda bir zaman aşımı belirlendiyse, timeoutMs() metodu
    // kalan süreyi milisaniye cinsinden döndürür. 

    // Değerin yukarı akıştaki bir istemci çağrısına geçirilmesi, zaman aşımını yayar.
    await upstreamClient.someCall({}, { timeoutMs: ctx.timeoutMs() });

    return {sentence: `Dedin ki: ${req.sentence}`};
};
```

Ayrıca, zaman aşımına yönelik sunucu tarafı desteğine ek olarak, `ConnectRouter` üzerinde zaman aşımı değerlerini kısıtlamaya yardımcı olan bir seçenek vardır: `maxTimeoutMs`. Bu seçeneğin açıklaması için, `Sunucu Eklentileri` dökümantasyonuna bakın.

Ayrıca, bu sayfanın zaman aşımını bir sunucu bağlamında ele aldığını belirtmek gerekir, Connect-ES istemcileri zaman aşımı değerlerine uyar ve `DeadlineExceeded` kodu ile bir `ConnectError` raise eder. Bir bağlantı yanıtsız kalırsa bile, istemci çağrısı yapılandırılmış zaman aşımında iptal edilir.

```ts
try {
  // Eğer bu çağrı 200 milisaniyeden fazla sürerse, iptal edilir
  await client.say({sentence: "Merhaba"}, { timeoutMs: 200 });
} catch (err) {
  if (err instanceof ConnectError && err.code === Code.DeadlineExceeded) {
    // zaman aşımı hatasını ele al
  }
}
```