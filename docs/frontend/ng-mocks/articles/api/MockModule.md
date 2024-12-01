---
title: Angular testlerinde modülleri nasıl mock'larım
description: Angular testlerinde ng-mocks yardımıyla modüllerin, importlarının, deklarasyonlarının ve sağlayıcılarının nasıl mock'lanacağı hakkında bilgi. Bu içerik, testlerinizi kolaylaştıracak stratejileri ve araçları kapsamlı bir şekilde ele alıyor.
keywords: [Angular, mock modül, ng-mocks, TestBed, MockBuilder]
---

**Angular testlerinde bir mock modül**, `MockModule` fonksiyonu ile oluşturulabilir. Mock modül, kaynak modülü ile aynı arayüze sahiptir, ancak tüm yöntemleri dummy'dir ve `imports`, `declarations`, `providers` ve `exports` sırasıyla mock'lanmıştır.

> Bir modülü mock modülüne dönüştürmek için, sadece sınıfını `MockModule` fonksiyonuna geçirin.  
> — Angular Test Stratejileri

```ts
TestBed.configureTestingModule({
  imports: [MockModule(Module), MockModule(Module.forRoots())],
});
```

Bir mock modül şunları sağlar:

- tüm bileşenlerin, direktiflerin, pipe'ların ve sağlayıcıların mock'ları
- tüm import ve export'ların mock'ları
- tüm servislerin dummy kopyaları
- `useClass` tanımına sahip servisler için dummy abstract yöntemler
- `useClass` tanımına sahip token'ların mock'ları
- `useExisting` tanımına sahip token'ların saygı gösterilmesi
- `helperUseFactory` tanımına sahip token'lar yerine boş nesneler
- `useValue` tanımına sahip token'lar yerine temel primitive'ler
- `useValue` tanımına sahip token'ların mock'larını `İki modülün deklarasyonlarıyla ilgili nasıl düzeltileceği` başlıklı bölümde okuyabilirsiniz.

:::danger
Test edilen deklarasyonu deklar eden modüllere **`MockModule`** kullanmayın. 
Böyle durumlarda **`MockBuilder`** veya **`ngMocks.guts`** kullanın.
:::

## Basit örnek

`TargetComponent`'in `DependencyModule` modülünden deklarasyonlara bağımlı olduğu bir Angular uygulaması hayal edelim, ve bu mock'ları bir testte kullanmak istiyoruz.

Genellikle `beforeEach` şu şekilde görünür:

```ts
describe('Test', () => {
  let component: TargetComponent;
  let fixture: ComponentFixture<TargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // test için bileşenimiz
      declarations: [TargetComponent],

      // can sıkıcı bağımlılık
      imports: [DependencyModule],
    });

    fixture = TestBed.createComponent(TargetComponent);
    component = fixture.componentInstance;
  });
});
```

**Bir mock modül** oluşturmak için, yalnızca sınıfını `MockModule`'a geçirin:

```ts
TestBed.configureTestingModule({
  declarations: [TargetComponent],

  // fayda
  imports: [MockModule(DependencyModule)],
});
```

Veya profesyonel olun ve `MockBuilder`'ı, `.mock` metodunu ve `MockRender`'ı kullanın:

```ts
describe('Test', () => {
  beforeEach(() => {
    return MockBuilder(TargetComponent).mock(DependencyModule);
  });

  it('oluşturmalı', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });
});
```

> `TargetComponent`'in tüm bağımlılıklarını zincirde belirtmekten kaçınmanın bir hilesi var: sadece modülünü `MockBuilder` metodunun ikinci parametresi olarak geçin. `TargetModule` içindeki her şey mock'larıyla değiştirilecektir, ancak `TargetComponent` olduğu gibi kalacaktır:  
> — Kapsamlı Test Yöntemleri

```ts
// MockBuilder'ın promise'ını döndürmeyi unutmayın.
beforeEach(() => MockBuilder(TargetComponent, TargetModule));
```

## Gelişmiş örnek

**Mock modüllerinin** Angular testlerinde kullanımına dair gelişmiş bir örnek. Lütfen koddaki yorumlara dikkat edin.

- [CodeSandbox’ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockModule/test.spec.ts&initialpath=%3Fspec%3DMockModule)
- [StackBlitz’te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockModule/test.spec.ts&initialpath=%3Fspec%3DMockModule)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockModule/test.spec.ts"
describe('MockModule', () => {
  beforeEach(() => {
    // DependencyModule ItsModule'un bir importudur.
    return MockBuilder(TargetComponent, ItsModule);
  });

  it('MyComponent ve bağımlılıklarını render eder', () => {
    const fixture = MockRender(TargetComponent);
    const component = fixture.point.componentInstance;

    expect(component).toBeTruthy();
  });
});
```  