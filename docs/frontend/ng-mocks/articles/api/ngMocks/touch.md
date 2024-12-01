---
title: ngMocks.touch
description: ngMocks.touch, ng-mocks kütüphanesindeki form kontrolleri için dokunuş simülasyonu hakkında bilgi verir. Bu belge, mock ve gerçek örnekler arasında geçiş yaparak test işlemlerini kolaylaştırmayı amaçlar.
keywords: [ngMocks, touch, form control, testing, Angular]
---

`ngMocks.touch`, **bir form kontrolünün dış dokunuşlarını simüle etmeye yardımcı olur**. Form kontrolünün bir **mock** örneği mi yoksa **gerçek** bir örnek mi olduğu önemli değildir.

:::tip
Form kontrollerinin test edilmesinde `ngMocks.touch` kullanımı, test sürecini büyük ölçüde hızlandırır ve kolaylaştırır.
:::

Bir dokunuş simüle etmek için, form kontrolünün ait olduğu bir **debug elementi** gereklidir.

Aşağıdaki şablona sahip olduğumuzu varsayalım:

```html
<input data-testid="inputControl" [formControl]="myControl" />
```

Ve, input'un **dokunuşunu simüle etmek** istiyoruz.

O zaman çözüm şöyle görünebilir:

```ts
// input'un debug elementini arama
const el = ngMocks.find(['data-testid', 'inputControl']);

// dokunuşu simüle etme
ngMocks.touch(valueAccessorEl);

// doğrulama
expect(component.myControl.touched).toEqual(true);
```

:::info
Alternatif olarak, `ngMocks.find` tarafından desteklenen seçicilerle daha basit bir şekilde de dokunuş simüle edilebilir:
:::

```ts
ngMocks.touch(['data-testid', 'inputControl']);
ngMocks.touch('input');
ngMocks.touch('[data-testid="inputControl"]');
```

> Kazanç!  
— ngMocks kütüphanesi ile form kontrol testlerinde kolaylık sağlar.