---
title: ngMocks.input
description: ngMocks.input hakkında ng-mocks kütüphanesinden dökümantasyon. Bu metod, bir elemanın `input` değerini döndürerek bileşen ve direktif isimlerini bilme sorununu ortadan kaldırır.
keywords: [ngMocks, input, bileşen, direktif, test, kütüphane]
---

`ngMocks.input`, bir elemanın `input` değerini döndürür. Bu metod, **girişin ait olduğu bileşenin veya direktifin adını bilme sorununu** ortadan kaldırır.

:::tip
**Kullanım Önerisi:** Eğer bileşenin veya direktifin adını tam olarak bilmiyorsanız, `ngMocks.find` ile desteklenen seçimcileri kullanabilirsiniz.
:::

## Kullanım

`ngMocks.input` iki farklı şekilde kullanılabilir:

- `ngMocks.input(debugElement, input, notFoundValue?)`
  
  veya 

- `ngMocks.input(cssSelector, input, notFoundValue?)`

### Örnekler

```ts
const inputValue = ngMocks.input(debugElement, 'param1');
```

```ts
const inputValue = ngMocks.input('app-component', 'param1');
```

> "NgMocks, test süreçlerinizi çok daha yönetilebilir hale getirir."  
> — ng-mocks Kütüphanesi

---