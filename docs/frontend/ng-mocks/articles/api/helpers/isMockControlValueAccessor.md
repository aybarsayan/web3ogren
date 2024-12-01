---
title: isMockControlValueAccessor
description: ng-mocks kütüphanesindeki isMockControlValueAccessor hakkında belge. Bu içerikte, mock nesnelerde geri çağrılara erişimi ve simülasyon işlemleri üzerine bilgiler verilmektedir.
keywords: [ng-mocks, ControlValueAccessor, MockControlValueAccessor, simulateChange, simulateTouch]
---

`isMockControlValueAccessor`, `ControlValueAccessor`'ı uygulayan bir mock nesnesinde `registerOnChange` ve `registerOnTouched` ile ayarlanan geri çağrılara erişmemiz gerektiğinde yardımcı olur ve bunları tetiklemek için `__simulateChange`, `__simulateTouch` çağırmayı sağlar. 

:::info
Bir örneğin `MockControlValueAccessor` arayüzünü uyup uymadığını doğrular.
:::

Bir hata aldığımızda ihtiyaç duyarız:

> Property '\_\_simulateChange' does not exist on type &lt;class&gt;  
> Property '\_\_simulateTouch' does not exist on type &lt;class&gt;  
>
  
```ts
const instance = ngMocks.findInstance(MyCustomFormControl);
// instance.__simulateChange('foo'); // çalışmıyor.
if (isMockControlValueAccessor(instance)) {
  // şimdi çalışıyor
  instance.__simulateChange('foo');
  instance.__simulateTouch();
}
```

:::tip
MockControlValueAccessor yöntemi ile çalışırken doğru arayüzü doğruladığınızdan emin olun.
:::