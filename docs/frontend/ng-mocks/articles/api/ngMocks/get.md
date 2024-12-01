---
title: ngMocks.get
description: ngMocks.get hakkında ng-mocks kütüphanesinden belgeler. Bu fonksiyon, mevcut öğeye ait olan bileşenleri, direktifleri, servisleri veya token'ları döndürmek için kullanılır.
keywords: [ngMocks, Angular, bileşen, direktif, servis, token]
---

Mevcut öğeye ait olan bir bileşeni, direktifi, servisi veya token'ı döndürür, bu bileşen ya da yapısal direktifler olabilir.

:::tip
`ngMocks.get` fonksiyonunu kullanırken doğru türleri belirtmek, elde edeceğiniz sonuçların doğruluğu açısından önemlidir.
:::

- `ngMocks.get( debugElement, Component, notFoundValue? )`

```ts
const component = ngMocks.get(fixture.debugElement, MyComponentType);
```

- `ngMocks.get( debugElement, Directive, notFoundValue? )`

```ts
const directive = ngMocks.get(fixture.debugElement, MyDirectiveType);
```

- `ngMocks.get( Service )`

```ts
const service = ngMocks.get(MyServiceType);
```

ya da `ngMocks.find` tarafından desteklenen seçimciler ile basitçe.

- `ngMocks.get( cssSelector, Directive, notFoundValue? )`
```ts
const directive = ngMocks.get('app-component', MyDirectiveType);
```

- `ngMocks.get( cssSelector, Component, notFoundValue? )`

```ts
const component = ngMocks.get('app-component', AppComponentType);
```

## Kök sağlayıcılar

Bir kök sağlayıcıya ulaşmanız gerekiyorsa, `ngMocks.get` ilk parametre olmadan çağrılmalıdır:

```ts
const appId = ngMocks.get(APP_ID);
```

:::info
İlk parametre olarak `debugElement` veya `cssSelector` kullanılmadığı durumlarda, `ngMocks.get` doğrudan token'ı kullanarak erişim sağlar.
:::