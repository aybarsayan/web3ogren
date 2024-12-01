---
title: Tarayıcı Animasyonu Modülü ile Test Etme
description: Tarayıcı Animasyonu Modülü ile modülleri nasıl test edeceğinize dair bilgiler ve çözümler. Bu makalede Angular'da animasyon modüllerinin test edilmesi için gereken adımlar ve yapılar açıklanmaktadır.
keywords: [Angular, test, BrowserAnimationsModule, NoopAnimationsModule, ngMocks]
---

Varsayılan olarak, Angular birim testlerinde `BrowserAnimationsModule` yerine `NoopAnimationsModule` kullanmanızı önerir.

:::info
Bunu küresel olarak yapmak için `ngMocks.globalReplace` kullanabilirsiniz:
:::

```ts title="src/test.ts"
ngMocks.globalReplace(BrowserAnimationsModule, NoopAnimationsModule);
```

Artık `ng-mocks` her `BrowserAnimationsModule` gördüğünde, bunu `NoopAnimationsModule` ile değiştirecektir.

## MockBuilder

Bu durumda `MockBuilder`'ın nasıl davrandığına bakınız:

```ts
// BrowserAnimationsModule, NoopAnimationsModule ile değiştirilir.
MockBuilder(MyComponent, MyModule);

// BrowserAnimationsModule olduğu gibi kalacaktır.
MockBuilder(MyComponent, MyModule).keep(BrowserAnimationsModule);

// BrowserAnimationsModule taklit edilecektir, değiştirilmez.
MockBuilder(MyComponent, MyModule).mock(BrowserAnimationsModule);

// BrowserAnimationsModule tanımlamalardan hariç tutulacaktır.
MockBuilder(MyComponent, MyModule).exclude(BrowserAnimationsModule);
```

## ngMocks.guts

Bu durumda `ngMocks.guts`'ın nasıl davrandığına bakınız:

```ts
// BrowserAnimationsModule, NoopAnimationsModule ile değiştirilir.
ngMocks.guts(MyComponent, MyModule);

// BrowserAnimationsModule olduğu gibi kalacaktır.
ngMocks.guts([MyComponent, BrowserAnimationsModule], MyModule);

// BrowserAnimationsModule taklit edilecektir, değiştirilmez.
ngMocks.guts([MyComponent, MyModule], BrowserAnimationsModule);

// BrowserAnimationsModule tanımlamalardan hariç tutulacaktır.
ngMocks.guts(MyComponent, MyModule, BrowserAnimationsModule);
```

## fakeAsync

Bir kept / mock `BrowserAnimationsModule`, `fakeAsync` ile sorunlara neden olur.  
Eğer `NoopAnimationsModule`'ün bir çözüm olmadığı bir durumla karşılaşırsanız, lütfen [GitHub](https://github.com/help-me-mom/ng-mocks/issues)'da bir sorun açın.

:::warning
Normal testlerin aksine, `fixture.detectChanges()` sonrasında `fixture.whenStable()`'ı beklemelisiniz noop animasyonları doğru bir şekilde render etmek için.
:::

Çünkü `fixture.whenStable()` bir promise döndürdüğünden, tüm testi `async` yapmak zorundasınız.

```ts
it('should see all elements', async () => { // <-- async
  // ... konfigurasyon
  fixture.detectChanges(); // <-- değişiklikleri algılama
  await fixture.whenStable(); // <-- animasyonları bekleme
  // ... doğrulama
});
```