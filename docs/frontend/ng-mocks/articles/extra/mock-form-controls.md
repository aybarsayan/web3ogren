---
title: Angular testlerinde form kontrollerini nasıl mock'lanır
description: Angular testlerinde mock form kontrolleri ile etkileşim kurmak için ng-mocks kullanma bilgisi. Bu kılavuz, Angular uygulamaları için testlerde form kontrollerini etkili bir şekilde taklit etmeyi öğretir.
keywords: [Angular, mock, form kontrolü, ng-mocks, test, ReactiveForms]
---

`ng-mocks`, `ControlValueAccessor` arayüzünü `bir direktif` veya `bir bileşen` uygulayıp uygulamadığına göre dikkate alır. Bunun dışında, `ng-mocks`, `değişiklikleri` ve `dokunmaları` yayımlamak için yardımcı işlevler sağlar.

`FormsModule` ve `ReactiveFormsModule`'ı destekler:

- `ngModel`
- `ngModelChange`
- `formControl`
- `formControlName`

* `NG_VALUE_ACCESSOR`
* `ControlValueAccessor`
* `writeValue`
* `registerOnChange`
* `registerOnTouched`

- `NG_VALIDATORS`
- `Validator`
- `NG_ASYNC_VALIDATORS`
- `AsyncValidator`
- `registerOnValidatorChange`
- `validate`

## İlgili araçlar

- `ngMocks.change()`
- `ngMocks.touch()`

* `isMockControlValueAccessor()`
* `isMockValidator()`

## ControlValueAccessor hakkında dikkat

:::warning Özellikler yerine yöntemleri kullanın
ControlValueAccessor'ı yöntemler aracılığıyla uygulamak önemlidir.
:::

Aksi takdirde, bu tür özellikleri JavaScript arayüzleri aracılığıyla tespit etmenin bir yolu yoktur, çünkü özellikler bir yapıcı çağrısı olmadan mevcut değildir ve mock'lar orijinal yapıcıları çağırmaz.

Genellikle, bir testte özellikler kullanıyorsanız, `No value accessor for form control with name ...` hata mesajı alırsınız.

> **Anahtar Bilgi:** Özellikler yerine yöntem kullanmak, testlerinizi daha sağlam hale getirecektir.  
> — Angular Test Kılavuzu

```ts title="Özellikler aracılığıyla yanlış tanım"
export class MyControl implements ControlValueAccessor {
  public writeValue = () => {
    // bazı sihirler
  };
  public registerOnChange = () => {
    // bazı sihirler
  };
  public registerOnTouched = () => {
    // bazı sihirler
  };
}
```

```ts title="Yöntemler aracılığıyla doğru tanım"
export class MyControl implements ControlValueAccessor {
  public writeValue() {
    // bazı sihirler
  }

  public registerOnChange() {
    // bazı sihirler
  }

  public registerOnTouched() {
    // bazı sihirler
  }
}
```

## ngModel hakkında dikkat

`ngModel` değerlerini doğru bir şekilde güncelleyebilmesi için, `FormsModule` bir testte tutulduğunda `fixture.whenStable()`'ın yanında `fixture.detectChanges()` çağrısı yapmak önemlidir.

:::info Ekstra Bilgi
`fixture.whenStable()` bir promise döndüğünden, tüm test `async` olmalıdır.
:::

:::warning fixture stabil olana kadar bekleyin
`fixture.detectChanges()`'ı çağırdıktan sonra, `await fixture.whenStable()` çağırdığınızdan emin olun.
:::

```ts
it('ngModel değerlerini değiştirir', async () => { // <-- `it` async yap
  // MockRender varsayılan olarak detectChanges çağırır.
  const fixture = MockRender(TargetComponent);
  await fixture.whenStable(); // <-- ngModel'in girişleri doğru bir şekilde render etmesine izin ver

  // ... eski değeri doğrula

  ngMocks.change('.input'', 'newValue');
  fixture.detectChanges(); // <-- ngModel'in girişleri doğru bir şekilde render etmesine izin ver
  await fixture.whenStable(); // <-- ngModel'in girişleri doğru bir şekilde render etmesine izin ver

  // ... yeni değeri doğrula
});
```

## Gelişmiş örnek

Angular testlerinde **ReactiveForms ile bir mock FormControl** için gelişmiş bir örnek.
Lütfen, koddaki yorumlara dikkat edin.

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockReactiveForms/test.spec.ts&initialpath=%3Fspec%3DMockReactiveForms)
- [StackBlitz'de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockReactiveForms/test.spec.ts&initialpath=%3Fspec%3DMockReactiveForms)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockReactiveForms/test.spec.ts"
describe('MockReactiveForms', () => {
  // Her testten sonra MockInstance özelleştirmelerini sıfırlamak için yardımcı olur.
  MockInstance.scope();

  beforeEach(() => {
    // DependencyComponent, ItsModule'de bir deklarasyondur.
    return (
      MockBuilder(TargetComponent, ItsModule)
        // ReactiveFormsModule, ItsModule'de bir import'tur.
        .keep(ReactiveFormsModule)
    );
  });

  it('doğru değeri mock form bileşenine gönderir', () => {
    // Bu, writeValue çağrıları üzerindeki casustur.
    // Auto spy ile bu kod gerekli değildir.
    const writeValue = jasmine.createSpy('writeValue'); // veya jest.fn();
    // jest durumunda
    // const writeValue = jest.fn();

    // writeValue'ın erken çağrıları nedeniyle, 
    // render'den önce MockInstance aracılığıyla casusu kurmamız gerekir.
    MockInstance(CvaComponent, 'writeValue', writeValue);

    const fixture = MockRender(TargetComponent);
    const component = fixture.point.componentInstance;

    // Başlatma sırasında, 
    // null ile çağrılması gerekir.
    expect(writeValue).toHaveBeenCalledWith(null);

    // Form kontrol öğesini bulalım
    // ve bir kullanıcının yaptığı gibi değişikliğini simüle edelim.
    const mockControlEl = ngMocks.find(CvaComponent);
    ngMocks.change(mockControlEl, 'foo');
    expect(component.formControl.value).toBe('foo');

    // Mevcut formControl'daki değişikliğin
    // mock bileşenindeki `writeValue` çağrılarını tetiklediğini kontrol edelim.
    component.formControl.setValue('bar');
    expect(writeValue).toHaveBeenCalledWith('bar');
  });
});
```

Mock FormControl'ün ngModel ile Angular testlerinde kullanım örneği

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockForms/test.spec.ts&initialpath=%3Fspec%3DMockForms)
- [StackBlitz'de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockForms/test.spec.ts&initialpath=%3Fspec%3DMockForms)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockForms/test.spec.ts"
describe('MockForms', () => {
  // Her testten sonra özelleştirmeleri sıfırlamak için yardımcı olur.
  // Alternatif olarak, test.ts'de otomatik sıfırlamayı etkinleştirebilirsiniz.
  MockInstance.scope();

  beforeEach(() => {
    // DependencyComponent, ItsModule'de bir deklarasyondur.
    return (
      MockBuilder(TargetComponent, ItsModule)
        // FormsModule, ItsModule'de bir import'tur.
        .keep(FormsModule)
    );
  });

  it('doğru değeri mock form bileşenine gönderir', async () => {
    // Bu, writeValue çağrıları üzerindeki casustur.
    // Auto spy ile bu kod gerekli değildir.
    const writeValue = jasmine.createSpy('writeValue'); // veya jest.fn();
    // jest durumunda
    // const writeValue = jest.fn();

    // writeValue'ın erken çağrıları nedeniyle, 
    // render'den önce MockInstance aracılığıyla casusu kurmamız gerekir.
    MockInstance(CvaComponent, 'writeValue', writeValue);

    const fixture = MockRender(TargetComponent);
    // FormsModule, tüm hook'ları kurmak için
    // MockRender'dan hemen sonra fixture.whenStable() gerektirir.
    await fixture.whenStable();
    const component = fixture.point.componentInstance;

    // Başlatma sırasında, 
    // null ile çağrılması gerekir.
    expect(writeValue).toHaveBeenCalledWith(null);

    // Form kontrol öğesini bulalım
    // ve bir kullanıcının yaptığı gibi değişikliğini simüle edelim.
    const mockControlEl = ngMocks.find(CvaComponent);
    ngMocks.change(mockControlEl, 'foo');
    expect(component.value).toBe('foo');

    // Mevcut değerdeki değişikliğin
    // mock bileşenindeki `writeValue` çağrılarını tetiklediğini kontrol edelim.
    component.value = 'bar';
    // writeValue'ı tetiklemek için aşağıdakilerin her ikisi de gereklidir.
    fixture.detectChanges();
    await fixture.whenStable();
    expect(writeValue).toHaveBeenCalledWith('bar');
  });
});