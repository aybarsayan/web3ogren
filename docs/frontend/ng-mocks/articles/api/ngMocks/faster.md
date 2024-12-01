---
title: ngMocks.faster
description: ngMocks.faster özelliği, Angular testlerindeki modül kurulumunu optimize ederek yürütme sürelerini azaltır. Bu belge, `ngMocks.faster` kullanımı hakkında bilgi sağlamaktadır.
keywords: [ngMocks, Angular, test optimizasyonu, performans, MockBuilder, MockRender, test modülleri]
---

`ngMocks.faster` özelliği, testler arasında benzer test modüllerinin kurulumunu optimize eder
ve yürütme sürelerini azaltır.

:::tip
Bir durum düşünün ki `beforeEach` birden fazla `it` tarafından kullanılan aynı kurulumu yaratıyor.
Bu durumda `ngMocks.faster` faydalı olabilir.
:::

Bu durumda, **`beforeEach` yerine `beforeAll` kullanın**, 
`beforeAll`'dan önce `ngMocks.faster` çağrısını yapın ve 
**Angular testleri daha hızlı çalışacaktır**.

```ts
describe('performans:doğru', () => {
  ngMocks.faster(); // <-- öncesinde ekleyin

  // TestBed, testler arasında değiştirilmeyecek.
  beforeAll(() => {
    return MockBuilder(TargetComponent, TargetModule).keep(TargetService);
  });

  it('...', () => {
    // ...
  });

  it('...', () => {
    // ...
  });

  // ...
});
```

Eğer bir test `beforeEach` içinde casus (spy) yaratıyorsa, bu ayarlanmalıdır,
çünkü `ngMocks.faster` bu farkı tespit edecek ve bir bildirim gösterecektir.

:::warning
Olası bir çözüm, manuel bildirim yerine `MockInstance` kullanılmasıdır,
ya da casusların yaratılmasını `beforeEach` dışına taşımaktır.
:::

## MockInstance Örneği

```ts
describe('beforeEach:mock-instance', () => {
  ngMocks.faster(); // <-- öncesinde ekleyin

  // TestBed'in normal kurulumu, TargetService onun mock nesnesi ile değiştirilecektir.
  // MockBuilder'ın promise'ini döndürmeyi unutmayın.
  // TargetService, ItsModule içinde bir sağlayıcıdır.
  beforeEach(() => MockBuilder(TargetComponent, ItsModule));

  // Mock TargetService'ın davranışını yapılandırma.
  beforeAll(() => {
    MockInstance(TargetService, {
      init: instance => {
        instance.method = jasmine.createSpy().and.returnValue(5);
        // jest durumunda
        // instance.method = jest.fn().mockReturnValue(5);
        instance.prop = 123;
      },
    });
  });

  // Koşular arasında casusu sıfırlamayı unutmayın.
  afterAll(MockReset);
});
```

## beforeEach İçinde Casusları Optimize Etme Örneği

```ts
describe('beforeEach:manuel-casus', () => {
  ngMocks.faster(); // <-- öncesinde ekleyin

  // `beforeEach` dışında bir casus yaratmak, onun referansının
  // testler arasında aynı olmasına olanak tanır ve bu, ngMocks.faster'ın işini yapmasına olanak tanır.
  const mock = {
    method: jasmine.createSpy().and.returnValue(5),
    // jest durumunda
    // method: jest.fn().mockReturnValue(5),
    prop: 123,
  };

  // Koşular arasında casusu sıfırlamayı unutmayın.
  beforeEach(() => {
    mock.method.calls.reset();
    // jest durumunda
    // mock.method = jest.fn().mockReturnValue(5);
    mock.prop = 123;
  });

  // TestBed'in normal kurulumu, TargetService onun mock nesnesi ile değiştirilecektir.
  beforeEach(() => {
    return MockBuilder(TargetComponent, ItsModule)
      // TargetService, ItsModule içinde bir sağlayıcıdır.
      .mock(TargetService, mock);
  });
});
```

## MockRender

`ngMocks.faster()` kullanımı `MockRender` için de geçerlidir.

:::info
Bu sayede, `MockRender`, `beforeEach` veya `beforeAll` içinde çağrılabilir.
`beforeAll`, bir testten sonra fixtures'i sıfırlamaz ve fixture, bir sonraki testte kullanılabilir.
Buna dikkat edin ki bileşenlerin durumu da aynı kalır.
:::

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/tests/issue-488/faster.spec.ts"
describe('issue-488:hızlı', () => {
  let fixture: MockedComponentFixture<TargetComponent>;

  ngMocks.faster();

  beforeAll(() => MockBuilder(TargetComponent, ItsModule));
  beforeAll(() => (fixture = MockRender(TargetComponent)));

  it('ilk test ilk render ile başlar', () => {
    expect(ngMocks.formatText(fixture)).toEqual('1');

    fixture.point.componentInstance.value += 1;
    fixture.detectChanges();
    expect(ngMocks.formatText(fixture)).toEqual('2');

    fixture.point.componentInstance.reset();
    fixture.detectChanges();
    expect(ngMocks.formatText(fixture)).toEqual('0');
  });

  it('ikinci test önceki duruma devam eder', () => {
    expect(ngMocks.formatText(fixture)).toEqual('0');

    fixture.point.componentInstance.value += 1;
    fixture.detectChanges();
    expect(ngMocks.formatText(fixture)).toEqual('1');

    fixture.point.componentInstance.reset();
    fixture.detectChanges();
    expect(ngMocks.formatText(fixture)).toEqual('0');
  });
});
```