---
title: Angular testlerinde direktifleri sahtelemek
description: Angular testlerinde ng-mocks yardımıyla öznitelik ve yapısal direktifleri sahteleme bilgileri. Bu içerikte sahte direktiflerin nasıl oluşturulacağı ve kullanılacağına dair örnekler ve açıklamalar bulunmaktadır.
keywords: [Angular, sahte direktif, ng-mocks, test, yapılandırma, MockDirective]
---

**Angular testlerinde sahte bir direktif** `MockDirective` fonksiyonu ile oluşturulabilir. Sahte direktif, orijinal direktifin aynı arayüzüne sahiptir, ancak tüm yöntemleri yalanlamadır.

Bir sahte direktif oluşturmak için, orijinal direktifi `MockDirective` fonksiyonuna geçirin.

```ts
TestBed.configureTestingModule({
  declarations: [
    // tek bir direktif için
    MockDirective(Directive),

    // bir dizi direktif için
    ...MockDirectives(Directive1, Directive2),
  ],
});
```

Bir sahte direktif şunlara sahiptir:

- öznitelik ve yapısal direktifler için destek
- aynı `selector`
- alias desteği ile aynı `Inputs` ve `Outputs`
- `@ContentChild` ve `@ContentChildren` desteği
- `ControlValueAccessor`, `Validator` ve `AsyncValidator` desteği
- `exportAs` desteği
- `ayrı bağımsız direktifler` desteği

:::tip
FormControl, ControlValueAccessor, Validator ve AsyncValidator'ı sahteleme hakkında bilgiler `başka bir bölümde` bulunmaktadır.
:::

## Basit örnek

Diyelim ki bir Angular uygulamasında `TargetComponent`'in `DependencyDirective` direktifine bağımlı olduğunu varsayıyoruz, ve birim testlerini kolaylaştırmak için sahte nesnesini kullanmak istiyoruz.

Genellikle bir test aşağıdaki gibidir:

```ts
describe('Test', () => {
  let component: TargetComponent;
  let fixture: ComponentFixture<TargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        // test için bileşenimiz
        TargetComponent,

        // rahatsız edici bağımlılık
        DependencyDirective,
      ],
    });

    fixture = TestBed.createComponent(TargetComponent);
    component = fixture.componentInstance;
  });
});
```

Bir direktifi **bir sahte direktife** dönüştürmek için, yalnızca orijinal sınıfı `MockDirective` içine geçirin:

```ts
TestBed.configureTestingModule({
  declarations: [
    TargetComponent,

    // kar elde et
    MockDirective(DependencyDirective),
  ],
});
```

Ya da bir profesyonel gibi olun ve `MockBuilder`, `.mock` yöntemini ve `MockRender` kullanın:

```ts
describe('Test', () => {
  beforeEach(() => {
    // DependencyDirective, ItsModule'de bir açıklama veya yurt dışından içe aktarıldı.
    return MockBuilder(TargetComponent, ItsModule);
  });

  it('oluşturulmalı', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });
});
```

## Bağımsız direktifler

Angular 14, bağımsız direktifler için desteği tanıttı. `ng-mocks` bunları tanır ve uygun şekilde sahteleme işlemini gerçekleştirir. Bir bağımsız direktifi sahtelemek için, `imports` içinde `MockDirective` çağrısı yapmalısınız:

```ts
TestBed.configureTestingModule({
  imports: [
    // tek bir direktif için
    MockDirective(StandaloneDirective),

    // bir dizi direktif için
    ...MockDirectives(Standalone1Directive, Standalone2Directive),
  ],
  declarations: [
    // test için bileşenimiz
    TargetComponent,
  ],
});
```

`MockBuilder` bağımsız direktifleri tanır ve yönetir. Ayrıca, yalnızca yüzeysel testler için bunların içe aktarımlarını sahtelemenizi sağlar.

## Öznitelik direktifleri ile gelişmiş örnek

**Öznitelik direktiflerini sahteleme** hakkında gelişmiş bir örnek. Lütfen koddaki yorumlara dikkat edin.

- [KodSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockDirective-Attribute/test.spec.ts&initialpath=%3Fspec%3DMockDirective%3AAttribute)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockDirective-Attribute/test.spec.ts&initialpath=%3Fspec%3DMockDirective%3AAttribute)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockDirective-Attribute/test.spec.ts"
describe('MockDirective:Attribute', () => {
  beforeEach(() => {
    // DependencyDirective, ItsModule'de bir açıklamadır.
    return MockBuilder(TargetComponent, ItsModule);
  });

  it('girişi doğru değeri iletmekte', () => {
    const fixture = MockRender(TargetComponent);
    const component = fixture.point.componentInstance;

    // Aynı
    // fixture.debugElement.query(
    //   By.css('span')
    // ).injector.get(DependencyDirective)
    // ancak daha kolay ve daha hassas.
    const mockDirective = ngMocks.get(
      ngMocks.find('span'),
      DependencyDirective,
    );

    // Diyelim ki DependencyDirective'in 'someInput' adında bir girişi var.
    // MyComponent bu değeri
    // `[someInput]="value"` ile ayarlar. Girişin değeri, sahte direktife geçirilecektir,
    // böylece üzerinde kontrol sağlayabiliriz.
    component.value = 'foo';
    fixture.detectChanges();

    // ng-mocks sayesinde, bu tür güvenlidir.
    expect(mockDirective.someInput).toEqual('foo');
  });

  it('çocuk direktifin emit edilmesi durumunda bir şeyler yapıyor', () => {
    const fixture = MockRender(TargetComponent);
    const component = fixture.point.componentInstance;

    // Aynı
    // fixture.debugElement.query(
    //   By.css('span')
    // ).injector.get(DependencyDirective)
    // ancak daha kolay ve daha hassas.
    const mockDirective = ngMocks.get(
      ngMocks.find('span'),
      DependencyDirective,
    );

    // Tekrar, diyelim ki DependencyDirective 'someOutput' adında bir çıkışa sahiptir.
    // MyComponent bu çıktıyı
    // `(someOutput)="trigger()"` ile dinler.
    // Bir casus kuralım ve çıktıyı tetikleyelim.
    ngMocks.stubMember(
      component,
      'trigger',
      jasmine.createSpy(), // veya jest.fn()
    );
    mockDirective.someOutput.emit();

    // Etkiyi kontrol edelim.
    expect(component.trigger).toHaveBeenCalled();
  });
});
```

## Yapısal direktifler ile gelişmiş örnek

Angular testlerinde **yapısal direktifleri sahteleme** hakkında gelişmiş bir örnek. Lütfen koddaki yorumlara dikkat edin.

:::important
Yapısal bir direktifi doğru bağlamla render etmek önemlidir, eğer iç içe olan unsurlar üzerinde kontrol sağlamak istiyorsak.
:::

- [KodSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockDirective-Structural/test.spec.ts&initialpath=%3Fspec%3DMockDirective%3AStructural)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockDirective-Structural/test.spec.ts&initialpath=%3Fspec%3DMockDirective%3AStructural)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockDirective-Structural/test.spec.ts"
describe('MockDirective:Structural', () => {
  // ÖNEMLİ: varsayılan olarak yapısal direktifler render edilmez.
  // Çünkü bir bağlama ihtiyacı duyabilirler ve bu bağlam sağlanmalıdır.
  // Genellikle bir geliştirici bağlamı bilir ve
  // doğru yapılandırma ile manuel olarak render edebilir.
  beforeEach(() => {
    // DependencyDirective, ItsModule'de bir açıklamadır.
    return MockBuilder(TargetComponent, ItsModule).mock(
      DependencyDirective,
      {
        // render: true, // <-- varsayılan olarak direktifi render etmek için bir bayrak
      },
    );
  });

  it('çocuk yapısal direktifin içeriğini render ediyor', () => {
    const fixture = MockRender(TargetComponent);

    // Yapısal direktifin içinde varsayılan olarak hiçbir şey render edilmediğini kontrol edelim.
    expect(fixture.nativeElement.innerHTML).not.toContain('>content<');

    // Ve şimdi manuel olarak render edelim.
    const mockDirective = ngMocks.findInstance(DependencyDirective);
    ngMocks.render(mockDirective, mockDirective);

    // Yapısal direktifin içeriği render edilmelidir.
    expect(fixture.nativeElement.innerHTML).toContain('>content<');
  });
});