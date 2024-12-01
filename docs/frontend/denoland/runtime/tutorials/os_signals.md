---
title: "OS sinyallerini yönetme"
description: Bu doküman, Deno ile OS sinyallerini yakalama ve yönetme yöntemlerini açıklamaktadır. Detaylar, sinyal dinleyicislerinin kurulumu ve kullanımı ile ilgili örnekler içermektedir.
keywords: [Deno, OS sinyalleri, sinyal dinleyicisi, addSignalListener, removeSignalListener]
---

> ⚠️ Windows, Deno v1.23 itibarıyla yalnızca SIGINT ve SIGBREAK sinyallerini dinlemeyi desteklemektedir.

## Kavramlar

- [Deno.addSignalListener()](https://docs.deno.com/api/deno/~/Deno.addSignalListener)  
  OS sinyallerini yakalamak ve izlemek için kullanılabilir.
- [Deno.removeSignalListener()](https://docs.deno.com/api/deno/~/Deno.removeSignalListener)  
  sinyali izlemeyi durdurmak için kullanılabilir.

## OS Sinyali Dinleyicisi Kurma

OS sinyallerini işlemek için API'ler, zaten aşina olduğumuz  
[`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)  
ve  
[`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)  
API'lerine benzeyen bir şekilde modellemiştir.

> ⚠️ OS sinyallerini dinlemenin, olay döngüsünün tamamlanmasını engellemediğini unutmayın; yani, daha fazla bekleyen asenkron işlem yoksa süreç sona erecektir.

OS sinyallerini işlemek için `Deno.addSignalListener()` fonksiyonunu kullanabilirsiniz:

```ts title="add_signal_listener.ts"
console.log("SIGINT sinyalini tetiklemek için Ctrl-C tuşuna basın");

Deno.addSignalListener("SIGINT", () => {
  console.log("kesildi!");
  Deno.exit();
});

// Sürecin hemen çıkmasını önlemek için bir zaman aşımı ekleyin.
setTimeout(() => {}, 5000);
```

Şu şekilde çalıştırın:

```shell
deno run add_signal_listener.ts
```

Daha önce eklenen sinyal işleyicisini kaydetmek için `Deno.removeSignalListener()` fonksiyonunu kullanabilirsiniz.

```ts title="signal_listeners.ts"
console.log("SIGINT sinyalini tetiklemek için Ctrl-C tuşuna basın");

const sigIntHandler = () => {
  console.log("kesildi!");
  Deno.exit();
};
Deno.addSignalListener("SIGINT", sigIntHandler);

// Sürecin hemen çıkmasını önlemek için bir zaman aşımı ekleyin.
setTimeout(() => {}, 5000);

// 1 saniye sonra bir sinyali dinlemeyi durdurun.
setTimeout(() => {
  Deno.removeSignalListener("SIGINT", sigIntHandler);
}, 1000);
```

Şu şekilde çalıştırın:

```shell
deno run signal_listeners.ts
```