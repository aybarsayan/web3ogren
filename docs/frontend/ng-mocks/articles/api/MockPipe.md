---
title: Angular testlerinde pipe'ları nasıl mock'lanır
description: ng-mocks yardımı ile Angular testlerinde pipe'ları nasıl mock'layacağınıza dair bilgiler. Bu rehber, mock pipe'ların nasıl oluşturulacağı ve kullanılacağı hakkında örnekler sunar.
keywords: [Angular, ng-mocks, MockPipe, pipe mocklama, test, DependencyPipe, MockBuilder]
---

**Angular testlerinde bir mock pipe** `MockPipe` fonksiyonu ile oluşturulabilir. 
Fonksiyonun ikinci parametresi özel bir transform geri çağırma işlevini kabul eder. 
Mock pipe, kaynak pipe ile aynı arayüze sahiptir, ancak tüm yöntemleri dummy'dir.

:::tip
Bir testte bir mock pipe sağlamak için, bu kaynak pipe'ı `MockPipe` fonksiyonuna geçirin.
:::

```ts
TestBed.configureTestingModule({
  declarations: [
    // tek bir pipe için
    MockPipe(Pipe),

    // sahte transform geri çağırma
    MockPipe(Pipe, value => JSON.stringify(value)),

    // bir pipe kümesi için
    ...MockPipes(Pipe1, Pipe2),
  ],
});
```

**Bir mock pipe’ın** aşağıdaki özelliklere sahip:
- aynı `isim`e sahip
- varsayılan transformu `() => undefined` olup, zincirleme sorunlarını önler
- `bağımsız pipe'ları` destekler

## Basit örnek

Bir Angular uygulamasında `TargetComponent`'ın `DependencyPipe` pipe'ına bağımlı olduğunu ve bunu mock pipe ile değiştirmek istediğimizi düşünelim.

Genellikle bir test şöyle görünür:

```ts
describe('Test', () => {
  let component: TargetComponent;
  let fixture: ComponentFixture<TargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        // test için bileşenimiz
        TargetComponent,

        // can sıkıcı bağımlılık
        DependencyPipe,
      ],
    });

    fixture = TestBed.createComponent(TargetComponent);
    component = fixture.componentInstance;
  });
});
```

**Bir mock pipe** oluşturmak için, yalnızca orijinal pipe'ı `MockPipe`'a geçirin:

```ts
TestBed.configureTestingModule({
  declarations: [
    TargetComponent,

    // kazanç
    MockPipe(DependencyPipe, value => `mock:${value}`),
  ],
});
```

:::info
Ya da eğer profesyonel olmak istiyorsak, `MockBuilder`, onun `.mock` yöntemini kullanabiliriz ve `MockRender` çağrısı yapabiliriz:
:::

```ts
describe('Test', () => {
  beforeEach(() => {
    return MockBuilder(TargetComponent, ItsModule)
      // DependencyPipe, ItsModule'deki bir beyan
      .mock(DependencyPipe, value => `mock:${value}`);
  });

  it('oluşturulmalı', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.point.componentInstance).toBeDefined();
    expect(fixture.nativeElement.innerHTML).toContain('mock:foo');

    // Gerekirse, fixture'dan DependencyPipe örneği.
    const pipe = ngMocks.findInstance(DependencyPipe);
    expect(pipe).toBeDefined();
  });
});
```

## Bağımsız pipe'lar

Angular 14'ten itibaren, pipe'lar bağımsız bir beyan olarak uygulanabilir. 
`ng-mocks` bunları algılar ve doğru bir şekilde mock'lar. 
Bir bağımsız pipe'ı mock'lamak için, `MockPipe`'ı imports içerisinde çağırmalısınız:

```ts
TestBed.configureTestingModule({
  imports: [
    // tek bir pipe için
    MockPipe(StandalonePipe),
  ],
  declarations: [
    // test için bileşenimiz
    TargetComponent,
  ],
});
```

:::note
`MockBuilder` da bağımsız pipe'ları destekler ve onlarla doğru bir şekilde çalışır.
:::

## Gelişmiş örnek

Angular testlerinde **pipe'ları mock'lama** ile ilgili bir gelişmiş örnek. 
Kod içindeki yorumlara dikkat edin.

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockPipe/test.spec.ts&initialpath=%3Fspec%3DMockPipe)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockPipe/test.spec.ts&initialpath=%3Fspec%3DMockPipe)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockPipe/test.spec.ts"
// Sahte bir transform fonksiyonu.
const fakeTransform = (...args: string[]) => JSON.stringify(args);

describe('MockPipe', () => {
  // Pipe'ın nasıl çağrıldığını doğrulamak istersek
  // bir spy.
  const spy = jasmine.createSpy().and.callFake(fakeTransform);
  // jest durumu için
  // const spy = jest.fn().mockImplementation(fakeTransform);

  beforeEach(() => {
    return (
      MockBuilder(TargetComponent, ItsModule)
        // DependencyPipe, ItsModule'deki bir beyan
        .mock(DependencyPipe, spy)
    );
  });

  it('değerleri json\'a dönüştürmeli', () => {
    const fixture = MockRender(TargetComponent);

    expect(fixture.nativeElement.innerHTML).toEqual(
      '<target>["foo"]</target>',
    );

    // Gerektiğinde, fixture'dan pipe örneğini bulabiliriz.
    const pipe = ngMocks.findInstance(DependencyPipe);
    expect(pipe.transform).toHaveBeenCalledWith('foo');
    expect(pipe.transform).toHaveBeenCalledTimes(1);
  });
});