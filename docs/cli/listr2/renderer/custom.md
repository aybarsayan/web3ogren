---
title: Özel İşlemci
description: Bu sayfada, uygulamanız için özel bir işlemci oluşturma ve mevcut Listr işlemcilerini genişletme yöntemlerini keşfedeceksiniz. Ayrıca, olaylar ve işlemci kancaları kullanımına dair örnekler ve açıklamalar sunulmaktadır.
keywords: [özel işlemci, Listr, renderer, olaylar, işlemci kancaları, kod örnekleri, JavaScript]
order: 50
tag:
  - ileri
  - özelleştirme
category:
  - işlemci
---

Uygulamanız için uygun bir özel işlemci oluşturabilirsiniz.



## Varsayılan _Listr_ İşlemcisini Uygulama veya Genişletme

 Kod Örneği

 Kod Örneği

 Kod Örneği



Olaylara dinleyici olmanın yanı sıra, kök _Listr_'dan gelen başka bir Singleton kancası `events`'dir. Bu, güncelleyici bir işlemci üzerindeki güncellemeyi tetiklemek için kullanılabilecek bazı genel olayları sağlar, örneğin `ListrEventType.SHOULD_REFRESH_RENDER`.

::: tip
Bu `events`, verilen bir işlemcinin üçüncü isteğe bağlı değişkeni olabilirken, kullanımında her zaman isteğe bağlıdır.
:::

```typescript
export class MyAmazingRenderer implements ListrRenderer {
  constructor(
    private readonly tasks: ListrDefaultRendererTasks,
    private readonly options: ListrDefaultRendererOptions,
    private readonly events: ListrEventManager
  ) {}
}
```

Bu olaylar daha sonra bir güncelleme tetiklemek için dinlenebilir.

```typescript
this.events.on(ListrEventType.SHOULD_REFRESH_RENDER, () => {
  this.update()
})
```

## Özel Bir İşlemci Kullanma

Listr'a özel işlemcinizi kullanmasını söyleyebilirsiniz, bunun için _Listr_ içindeki `renderer` seçeneğini özel işlemcinize ayarlamanız gerekir.

<<< @../../examples/docs/renderer/custom/create-renderer.ts#run