---
title: isMockValidator
description: isMockValidator hakkında ng-mocks kütüphanesinden dökümantasyon. Bu özellik, sahte nesneler üzerinde validator değişikliklerini simüle etmemizi sağlar ve doğrulayıcıların doğru bir şekilde uygulandığını kontrol etmemize yardımcı olur.
keywords: [isMockValidator, ng-mocks, Validator, AsyncValidator, MockValidator]
---

`isMockValidator`, `Validator` veya `AsyncValidator`'ı uygulayan bir sahte nesne üzerinde `registerOnValidatorChange` aracılığıyla ayarlanan geri çağrıya erişmemiz gerektiğinde ve `__simulateValidatorChange`'i tetiklemek için çağırmamız gerektiğinde kullanışlıdır. Bir örneğin `MockValidator` arayüzüne saygı gösterip göstermediğini doğrular.

Aşağıdaki gibi bir hata aldığımızda ihtiyaç duyarız:

> Property '\_\_simulateValidatorChange' does not exist on type &lt;class&gt;

```ts
const instance = ngMocks.findInstance(MyValidatorDirective);
// instance.simulateValidatorChange(); // çalışmıyor.
if (isMockValidator(instance)) {
  // şimdi çalışıyor
  instance.__simulateValidatorChange();
}
```

:::tip
`isMockValidator` fonksiyonu, sadece sahte nesneleri doğrulamakla kalmaz, aynı zamanda doğru kullanım şeklini teşvik eder.
:::

Aşağıdaki kullanım senaryolarında `isMockValidator` özelliğini etkili bir şekilde kullanabilirsiniz:

- Validatör değişikliği kontrol etmek
- Sahte nesneler üzerinde işlem yapmak
- Hata ayıklama amacıyla doğrulayıcı değişikliklerini simüle etmek

:::info
Bu yöntem, özellikle test senaryolarında ve sahte nesne kullanırken önemli bir rol oynamaktadır. 
:::

Farklı kullanımları daha iyi anlamak için aşağıdaki örneği göz önünde bulundurun:

```ts
const myValidator = ngMocks.findInstance(MyValidatorDirective);
if (isMockValidator(myValidator)) {
  myValidator.__simulateValidatorChange();
}
```

Eğer `instance` nesnesi bir sahte nesne değilse, `__simulateValidatorChange` çağrısı hata verecektir. Bunu göz önünde bulundurarak, doğrulayıcıların sağladığı işlevlerin doğru uygulandığından emin olmak önemlidir.

:::warning
Sahte nesnelerin gerçek nesne gibi davranmasını sağlamak için her zaman `isMockValidator` ile doğrulama yapmayı unutmayın!
:::