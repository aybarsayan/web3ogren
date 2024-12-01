---
title: ngMocks.globalWipe
description: ng-mocks kütüphanesinden ngMocks.globalWipe hakkında belgeler. Bu içerik, `ngMocks.globalWipe` fonksiyonunun nasıl çalıştığını ve hangi durumlarda kullanılacağını açıklamaktadır. Ayrıca, uygulamada dikkat edilmesi gereken farklı noktaları vurgulamaktadır.
keywords: [ngMocks, globalWipe, Angular, mocking, testing]
---

`ngMocks.globalWipe`, herhangi bir `ngMocks.default` fonksiyonu ile yapılmış tüm özelleştirmeleri sıfırlar.

:::info
`ngMocks.globalWipe` kullanımı, test projelerinde özelleştirmeleri temizleyerek, testler arasında tutarlılığı sağlamak için önemlidir.
:::

```ts
ngMocks.defaultMock(Service, () => ({
  stream$: EMPTY,
}));
ngMocks.globalExclude(Component);
ngMocks.globalKeep(Directive);
ngMocks.globalReplace(Pipe, FakePipe);

ngMocks.globalWipe(Service);
ngMocks.globalWipe(Component);
ngMocks.globalWipe(Directive);
ngMocks.globalWipe(Pipe);

// Yukarıdaki tüm öğeler her zamanki gibi taklit edilecektir
```

:::tip
Uygulamanızda gerektiğinde `ngMocks.globalWipe` fonksiyonunu çağırarak, belirli bileşenlerin veya hizmetlerin önceki ayarlarını temizlediğinizden emin olun. 
:::

**Anahtar Nokta:**
> `ngMocks.globalWipe`, tüm mocking ayarlarını sıfırlayarak, test senaryolarının temiz bir başlangıç yapmasını sağlar.  
> — ngMocks Belgelendirme Ekibi


Ek Bilgiler
`ngMocks.globalWipe` ile birlikte kullanabileceğiniz diğer `ngMocks` fonksiyonları şunlardır:
- `globalExclude`
- `globalKeep`
- `globalReplace`


---