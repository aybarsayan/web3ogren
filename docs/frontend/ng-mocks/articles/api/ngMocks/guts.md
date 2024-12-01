---
title: ngMocks.guts
description: ngMocks.guts ile Angular test süreçlerini daha etkili hale getirin. Bu kütüphane, modül meta verilerini oluşturmak ve testlerinizi optimize etmek için kullanılır.
keywords: [ngMocks, TestBed, Angular, mock'lar, bileşen testleri, meta veriler]
---

`TestBed` modülüne ait meta verileri oluşturur ve döndürür.

- `ngMocks.guts( MyDeclaration, ItsModule )`
- `ngMocks.guts( [Thing1, Thing2], [ToMock1, ToMock2], [Skip1, Skip2] )`

İlk parametre, test etmek istediğimiz bir *deklarasyon* veya bunların dizisi olabilir.  
İkinci parametre, *mock'larını* oluşturmak istediğimiz bir *deklarasyon* veya bunların dizisi olabilir.  
Üçüncü parametre, *hariç tutmak* istediğimiz bir *deklarasyon* veya bunların dizisi olabilir.  
Bunlar: Modüller, Bileşenler, Direktifler, Pipe'lar, Servisler ve *token'ları* destekler.

:::tip
**İpuçları:** Eğer bir modül belirttiyseniz, onun iç yapısı ilk parametreden hariç tutulan mock'larla değiştirilir.
:::

Herhangi bir parametre `null` olabilir, eğer bunu atlamak istiyorsak.

> "ngMocks.guts, test süreçlerinizi hızlandırmak ve kolaylaştırmak için güçlü bir araçtır."  
> — ngMocks Belgeleri

```ts
const ngModuleMeta = ngMocks.guts(Component, ItsModule);
```


Ek Bilgi

```ts
const ngModuleMeta = ngMocks.guts(
  [Component1, Component2, Service3],
  [ModuleToMock, DirectiveToMock, WhateverToMock],
  [ServiceToExclude, DirectiveToExclude],
);
```

```ts
const ngModuleMeta = ngMocks.guts(
  null,
  ModuleToMock,
  ComponentToExclude,
);
```


---