---
title: ngMocks.output
description: ngMocks.output hakkında ng-mocks kütüphanesinden dokümantasyon. Bu fonksiyon, bir elementin output emitter'ını döndürerek bileşen ve direktiflerin daha kolay yönetilmesini sağlar.
keywords: [ngMocks, Angular, output emitter, bileşen yönetimi, direktif]
---

Bir elementin `output` emitterını döndürür.  
Bu, **çıktının ait olduğu bileşenin / direktifin adını bilme sorununu ortadan kaldırır**.

:::tip
Herhangi bir bileşenin `output` değerini almak için bu metod kullanabilirsiniz. Geri dönüş değeriyle, özelleştirilmiş işlemler yapabilirsiniz.
:::

- `ngMocks.output( debugElement, output, notFoundValue? )`

ya da `ngMocks.find` tarafından desteklenen seçiciler ile basit bir şekilde.

- `ngMocks.output( cssSelector, output, notFoundValue? )`

```ts
const outputEmitter = ngMocks.output(debugElement, 'update');
```
```ts
const outputEmitter = ngMocks.output('app-component', 'update');
```

:::info
`notFoundValue` parametresi, belirtilen output bulunamadığında kullanılacak varsayılan değerdir. Eğer bir değer belirtilmezse, `undefined` dönecektir.
:::

```ts
const outputEmitter = ngMocks.output('app-component', 'update', 'default');
```

> `ngMocks.output` fonksiyonu, Angular uygulamalarında bileşenlerin output değerlerini yönetmek için etkili bir çözümdür.  
> — ngMocks Dokümantasyonu

---