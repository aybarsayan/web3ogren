---
title: MockInstance - Angular testlerinde mocks'un esnekliği
description: ng-mocks yardımıyla Angular testlerinde mock bileşenlerini, direktifleri, hizmetleri ve token'ları nasıl özelleştireceğinizi anlatan bilgiler. Bu doküman, `MockInstance` kullanarak testlerinizi nasıl daha verimli hale getirebileceğinizi göstermektedir.
keywords: [Angular, ng-mocks, MockInstance, Test, özelleştirme]
---

**MockInstance**, istenen örnek oluşturulmadan önce test paketlerinde **mock beyanları için özelleştirmeleri** ve mock sağlayıcıları tanımlamanıza yardımcı olur.

:::info
Bu, casusları kullanmadan önce yapılandırmak istediğimizde yararlıdır. Modülleri, bileşenleri, direktifleri, pipe'ları, hizmetleri ve token'ları destekler.
:::

Mokları oluşturmak için:
- `MockBuilder`
- `MockModule`
- `MockComponent`
- `MockDirective`
- `MockProvider`

## Özelleştirmeleri Tanımlama

Bir mock örneğini özelleştirmenin **üç yolu** vardır:

- İstenen değerleri ayarlamak
- Örneği manipüle etmek (enjektöre erişim ile)
- İstenen şekli döndürmek (enjektöre erişim ile)

### İstenen Değerleri Ayarlama

Önceden tanımlanmış bir değer veya sahte uygulama sağlamaya yardımcı olur.

```ts
// Service.methodName() için özel uygulama ayarlama.
MockInstance(Service, 'methodName', () => 'fake');

// Component.propName için özel değer ayarlama.
MockInstance(Component, 'propName', 'fake');

// Directive.propName için getter ayarlama.
MockInstance(Directive, 'propName', () => 'fake', 'get');

// Pipe.propName için setter ayarlama.
MockInstance(Pipe, 'propName', () => undefined, 'set');
```

:::note
Ayrıca, `MockInstance` sağlanan değeri döndürür, bu da casusları özelleştirmeye olanak tanır.
:::

```ts
MockInstance(Service, 'methodName', jasmine.createSpy())
  .and.returnValue('fake');
MockInstance(Service, 'propName', jest.fn(), 'get')
  .mockReturnValue('fake');
```

### Örneği Manipüle Etme

**MockInstance**'a ikinci parametre olarak bir geri çağırma verirsek, o zaman örneğe ve ilgili enjektöre erişimimiz olur.

```ts
MockInstance(Service, (instance, injector) => {
  instance.prop1 = injector.get(SOME_TOKEN);
  instance.method1 = jasmine.createSpy().and.returnValue(5);
  instance.method2 = value => (instance.prop2 = value);
});
```

### İstenen Şekli Döndürme

**MockInstance**'ın ikinci parametre geri çağırması bir şey dönerse, o zaman döndürülen değer örneğe uygulanır.

```ts
// enjektör ve casuslarla
MockInstance(Service, (instance, injector) => ({
  prop1: injector.get(SOME_TOKEN),
  method1: jasmine.createSpy().and.returnValue(5),
  method2: value => (instance.prop2 = value),
}));

// basit bir şekil
MockInstance(Service, () => ({
  prop1: 1,
  method1: jasmine.createSpy(),
  method2: jasmine.createSpy(),
}));
```

### Token'ları Özelleştirme

Token'lar durumunda, bir geri çağırmanın token değerini döndürmesi gerekir.

```ts
MockInstance(TOKEN, (instance, injector) => {
  return injector.get(SOME_OTHER_TOKEN);
});
MockInstance(TOKEN, () => true);
```

Birden fazla değerli bir token'ı moklamak istiyorsanız, basitçe bir dizi döndürün:

```ts
MockInstance(TOKEN, () => [multiValue1, multiValue2, multiValue3]);
```

## Özelleştirme Kapsamları

Zaman zaman, bir paket veya test için bir dizi özelleştirme uygulamamız gerekebilir. :::warning
Her özelleştirmenin atlamak, özellikle çok sayıda özelleştirmemiz varsa, sıkıcı sıfırlamalar yazmayı gerektirebilir.
:::

Böyle bir durumda, `MockInstance.remember()` ve `MockInstance.restore()` yardımınıza gelir.

### Hatırlama

`MockInstance.remember()` bir kontrol noktası oluşturur. Kontroll noktası sonrası `MockInstance` aracılığıyla yapılan her mock özelleştirmesi ayrı olarak kaydedilir.

### Geri Yükleme

`MockInstance.restore()` son bilinen kontrol noktasından itibaren mock özelleştirmelerini atar. İşlem, bir kontrol noktası olduğu sürece tekrarlanabilir.

### Örnek

Örneğin, `beforeAll` veya `beforeEach`'te kontrol noktaları oluşturabiliriz ve bunların mock özelleştirmelerini `afterAll` veya `afterEach`'te atabiliriz.

```ts
describe('paket', () => {
  beforeAll(MockInstance.remember);
  afterAll(MockInstance.restore);

  // Sadece bu ve tüm alt paketlerde mevcut.
  beforeAll(() => MockInstance(SomeService, 'login$', EMPTY));
  beforeAll(() => MockInstance(SomeService, 'logout$', EMPTY));

  describe('alt paket', () => {
    beforeEach(MockInstance.remember);
    afterEach(MockInstance.restore);

    // Sadece bu alt paket süresince mevcut.
    // Alt paketten sonra, üst
    // özelleştirme mevcut olacaktır.
    beforeEach(() => MockInstance(SomeService, 'login$', throwError('wrong')));
    beforeEach(() => MockInstance(SomeService, 'logout$', throwError('wrong')));
  });
});
```

### Kapsam

Kodu tek bir satıra indirmek için `MockInstance.scope()` vardır:

```ts
describe('paket', () => {
  // beforeAll ve afterAll kullanır.
  MockInstance.scope('paket');

  describe('alt paket #1', () => {
    // beforeEach ve afterEach kullanır.
    MockInstance.scope();
    // aynı
    // MockInstance.scope('case');
  });

  describe('alt paket #2', () => {
    // beforeAll, afterAll,
    // beforeEach ve afterEach kullanır.
    MockInstance.scope('hepsi');
    // aynı
    // MockInstance.scope('paket');
    // MockInstance.scope('case');
  });
});
```

## Zorla Sıfırlama Özelleştirmesi

Sağlanan geri çağırmayı sıfırlamak için, `MockInstance` onu olmadan çağırmalısınız. Genellikle, `afterEach` veya `afterAll`'de kullanılır, ancak `kapsamları` kullanmak daha iyidir.

```ts
afterEach(() => MockInstance(Service)); // Service'in özelleştirmelerini sıfırlar
afterEach(() => MockInstance(TOKEN)); // TOKEN'ın özelleştirmelerini sıfırlar

// Ya da sadece bir çağrı.
// Tüm beyanlar için tüm özelleştirmeleri sıfırlar.
afterEach(() => MockReset());
```

## Özelleştirme Üzerine Yazma

Her `MockInstance` çağrısı önceki geri çağırmayı geçersiz kılar. `MockInstance` her yerde çağrılabilir, ancak **önerilen kullanım** `MockInstance.scope` kullanmak ve `beforeEach` veya `it` içinde `MockInstance` çağrısı yapmaktır; bu durumda geri çağırma, yalnızca mevcut örnekte geçerli olur.

```ts
// Bu paket için kapsam tanımlama.
MockInstance.scope();

// Bir token için varsayılan özelleştirme tanımlama.
beforeAll(() => MockInstance(TOKEN, () => true));

// ItsModule, TargetComponent'te kullanılan TOKEN'ı sağlar.
beforEach(() => MockBuilder(TargetComponent, ItsModule));

it('test 1', () => {
  // token doğru
  expect(TestBed.get(TOKEN)).toEqual(true);
});

it('test 2', () => {
  // token yanlış
  MockInstance(TOKEN, () => false);
  expect(TestBed.get(TOKEN)).toEqual(false);
});

it('test 3', () => {
  // token tekrar doğru
  expect(TestBed.get(TOKEN)).toEqual(true);
});
```

## Ne Zaman Kullanmalı

Aşağıdaki gibi bir test hatası aldığınızda kesinlikle zamanıdır:

- `TypeError: Cannot read property 'subscribe' of undefined`
- `TypeError: Cannot read property 'pipe' of undefined`
- ya da `undefined` ile özellikleri okuma veya yöntemleri çağırma gibi herhangi bir başka sorun

Ya da `@ViewChild`, `@ViewChildren`, `@ContentChild`, `@ContentChildren` ile erişilen bir mock beyanını özelleştirmek istiyorsak.

Bileşenimizin `ViewChild` kullanarak bir çocuk bileşen örneğine eriştiği bir durumu hayal edelim.

```ts
class RealComponent implements AfterViewInit {
  @ViewChild(ChildComponent) public readonly child: ChildComponent;

  ngAfterViewInit() {
    this.child.update$.subscribe();
  }
}
```

`RealComponent`'i test ettiğimizde bir mock `ChildComponent` almak isteriz, ve bu, onu bir mock `ChildComponent` ile değiştirdiğimizde `update$`'sinin `undefined` döneceği anlamına gelir; dolayısıyla testimiz `ngAfterViewInit` içinde `TypeError: Cannot read property 'subscribe' of undefined` hatası verecektir.

Bizim durumumuzda, Angular tarafından oluşturulan bir bileşen örneği var ve `TestBed`'in burada bir çözüm sunduğu görünmüyor. İşte burada `ng-mocks`, `MockInstance` yardımcı işlevi ile yeniden yardım ediyor. İlk parametre olarak bir sınıf alır ve ikinci olarak onun örneklerini nasıl özelleştireceğinizi tanımlayan küçük bir geri çağırma alır.

```ts
// Artık bir mock nesnesini özelleştirebiliriz.
// Nesnenin update$ özelliği
// ctor çağrısında EMPTY olarak ayarlanacaktır.
MockInstance.scope();
beforeEach(() => MockInstance(ChildComponent, 'update$', EMPTY));
```

Fayda. Angular, `ChildComponent` örneğini oluşturduğunda, kural ctor'unda uygulanır ve örneğin `update$` özelliği `undefined` değil, bir `Observable` olur.

## MockBuilder ile Bir Örnek

Angular testlerinde **bir mock bileşeni başlatılmadan önce özelleştirme** yapmak için gelişmiş bir örnek.
Lütfen kod içindeki yorumlara dikkat edin.

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockInstance/test.spec.ts&initialpath=%3Fspec%3DMockInstance)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockInstance/test.spec.ts&initialpath=%3Fspec%3DMockInstance)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockInstance/test.spec.ts"
describe('MockInstance', () => {
  // Bu testten sonra özelleştirmeleri otomatik olarak sıfırlamak için bir kapsam oluşturur.
  MockInstance.scope();

  // TestBed'ın normal kurulumu, ChildComponent mock nesnesi ile değiştirilecektir.
  // MockBuilder'ın vaadini unutmamalısınız.
  beforeEach(() => MockBuilder(TargetComponent, ItsModule));

  beforeEach(() => {
    // ChildComponent, mock nesnesi ile değiştirildiği için,
    // update$'i undefined'dır ve üst bileşenin
    // ngAfterViewInit'i .subscribe() ile başarısız olacaktır.
    // Mock nesnesi için özelleştirme tanımlayarak bunu düzeltebiliriz.
    MockInstance(ChildComponent, () => ({
      // başarısızlığı kontrol etmek için bir sonraki satırı yorumlayın.
      update$: EMPTY,
    }));
  });

  it('şu şekilde render edilmelidir', () => {
    // Özel başlatma olmadan render işlemi burada başarısız olacaktır
    // "Cannot read property 'subscribe' of undefined" hatası ile.
    expect(() => MockRender(TargetComponent)).not.toThrow();
  });
});
```

## TestBed ve MockComponent ile Bir Örnek

Angular testlerinde **bir mock bileşeni başlatılmadan önce özelleştirme** yapmak için gelişmiş bir örnek.
Lütfen kod içindeki yorumlara dikkat edin.

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockInstance/component.spec.ts&initialpath=%3Fspec%3DMockInstance%3Acomponent)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockInstance/component.spec.ts&initialpath=%3Fspec%3DMockInstance%3Acomponent)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockInstance/component.spec.ts"
describe('MockInstance:component', () => {
  // Bu testten sonra özelleştirmeleri otomatik olarak sıfırlamak için bir kapsam oluşturur.
  MockInstance.scope();

  // ChildComponent için bir mock ile TestBed'ı yapılandırma.
  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TargetComponent, MockComponent(ChildComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    // ChildComponent mock nesnesi ile değiştirildiği için,
    // update$'i undefined'dır ve üst bileşenin
    // ngAfterViewInit'i .subscribe() ile başarısız olacaktır.
    // Mock nesnesi için özelleştirme tanımlayarak bunu düzeltebiliriz.
    MockInstance(ChildComponent, () => ({
      // başarısızlığı kontrol etmek için bir sonraki satırı yorumlayın.
      update$: EMPTY,
    }));
  });

  it('şu şekilde render edilmelidir', () => {
    // Özel başlatma olmadan render işlemi burada başarısız olacaktır
    // "Cannot read property 'subscribe' of undefined" hatası ile.
    expect(() => TestBed.createComponent(TargetComponent).detectChanges()).not.toThrow();
  });
});
```