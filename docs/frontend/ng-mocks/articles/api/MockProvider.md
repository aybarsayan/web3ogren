---
title: Angular testlerinde sağlayıcıları nasıl sahteleyebilirim
description: Angular testlerinde ng-mocks yardımıyla hizmetleri ve token'ları nasıl sahteleyebileceğiniz hakkında bilgi. Bu içerik, farklı sahte sağlayıcı türlerini örnek kodlarla açıklamaktadır.
keywords: [Angular, test, ng-mocks, sahte sağlayıcı, MockProvider]
---

**Angular testlerinde bir sahte sağlayıcı** `MockProvider` fonksiyonu ile oluşturulabilir.  
Fonksiyon hizmetleri ve token'ları destekler.  
Ayrıca, kendi **özelliklerinizi** sağlamak amacıyla hizmetinin bir şekli kabul eder ve token'lar için değerler belirler, aksi takdirde token'ın değeri `undefined` olacaktır.

```ts
TestBed.configureTestingModule({
  providers: [
    // Tüm yöntemler boş dummylardır.
    MockProvider(Service),

    // Tüm yöntemler boş dummylardır,
    // ancak get$() EMPTY döner.
    MockProvider(Service, {
      get$: () => EMPTY,
    }),

    // undefined sağlar
    MockProvider(TOKEN),

    // 'value' sağlar
    MockProvider(TOKEN, 'value'),
  ],
});
```

## useValue

```ts
TestBed.configureTestingModule({
  providers: [
    MockProvider(Service, {name: 'mock'}, 'useValue'),
    // oluşturur
    // {
    //   provide: Service,
    //   useValue: {name: 'mock'},
    // }
    
    MockProvider(TOKEN, 'token', 'useValue', true),
    // oluşturur
    // {
    //   provide: TOKEN,
    //   useValue: 'token',
    //   multi: true,
    // }
  ],
});
```

## useExisting

```ts
TestBed.configureTestingModule({
  providers: [
    MockProvider(Service, MockService, 'useExisting'),
    // oluşturur
    // {
    //   provide: Service,
    //   useExisting: MockService,
    // }
    
    MockProvider(TOKEN, FAKE, 'useExisting', true),
    // oluşturur
    // {
    //   provide: TOKEN,
    //   useExisting: FAKE,
    //   multi: true,
    // }
  ],
});
```

## useClass

```ts
TestBed.configureTestingModule({
  providers: [
    MockProvider(Service, MockService, 'useClass'),
    // oluşturur
    // {
    //   provide: Service,
    //   useClass: MockService,
    // }
    
    MockProvider(Service, MockService, 'useClass', true),
    // oluşturur
    // {
    //   provide: Service,
    //   useClass: MockService,
    //   multi: true,
    // }

    MockProvider(Service, MockService, 'useClass', [DbService]),
    // oluşturur
    // {
    //   provide: Service,
    //   useClass: MockService,
    //   deps: [DbService],
    // }
    
    MockProvider(Service, MockService, 'useClass', {
      multi: true,
      deps: [DbService],
    }),
    // oluşturur
    // {
    //   provide: Service,
    //   useClass: MockService,
    //   deps: [DbService],
    //   multi: true,
    // }
  ],
});
```

## useFactory

```ts
TestBed.configureTestingModule({
  providers: [
    MockProvider(Service, () => new MockService(), 'useFactory'),
    // oluşturur
    // {
    //   provide: Service,
    //   useFactory: () => new MockService(),
    // }
    
    MockProvider(Service, () => new MockService(), 'useFactory', true),
    // oluşturur
    // {
    //   provide: Service,
    //   useFactory: () => new MockService(),
    //   multi: true,
    // }

    MockProvider(Service, () => new MockService(), 'useFactory', [DbService]),
    // oluşturur
    // {
    //   provide: Service,
    //   useFactory: (db) => new MockService(db),
    //   deps: [DbService],
    // }
    
    MockProvider(Service, MockService, 'useFactory', {
      multi: true,
      deps: [DbService],
    }),
    // oluşturur
    // {
    //   provide: Service,
    //   useFactory: (db) => new MockService(db),
    //   deps: [DbService],
    //   multi: true,
    // }
  ],
});
```

## Basit örnek

Bir Angular uygulamasında `TargetComponent` bileşeninin `DependencyService` hizmetine bağımlı olduğunu ve aşırı yükten kaçınmak için sahte nesnesinin kullanılacağını varsayalım.

Genellikle bir test şu şekilde görünür:

```ts
describe('Test', () => {
  let component: TargetComponent;
  let fixture: ComponentFixture<TargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TargetComponent],
      providers: [
        // Can sıkıcı bağımlılıklar.
        DependencyService,
        ObservableService,
      ],
    });

    fixture = TestBed.createComponent(TargetComponent);
    component = fixture.componentInstance;
  });
});
```

Bu hizmetleri **sahte sağlayıcılarıyla** değiştirmek için sınıflarını `MockProvider` içine geçirmeniz yeterlidir:

```ts
TestBed.configureTestingModule({
  declarations: [TargetComponent],
  providers: [
    // kazanç
    MockProvider(DependencyService),
    MockProvider(ObservableService, {
      prop$: EMPTY,
      getStream$: () => EMPTY,
    }),
  ],
});
```

Veya bir profesyonel gibi olmak için `MockBuilder`, `.mock` yöntemini kullanabilir ve `MockRender` çağırabilirsiniz:

```ts
describe('Test', () => {
  beforeEach(() => {
    // DependencyService, ItsModule içinde bir sağlayıcıdır.
    return MockBuilder(TargetComponent, ItsModule)
      // ObservableService, ItsModule içinde bir sağlayıcıdır; özelleştirmemiz gereken
      .mock(ObservableService, {
        prop$: EMPTY,
        getStream$: () => EMPTY,
      });
  });

  it('oluşturmalıdır', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });
});
```

:::warning Lütfen dikkat
Geliştiricilerin sahte hizmetler oluştururken karşılaştığı en yaygın hata "**TypeError: Cannot read property 'subscribe' of undefined**" hatasıdır.

Bunu da karşılıyorsak, lütfen `TypeError: Cannot read property 'subscribe' of undefined nasıl düzeltilir` başlıklı bölümü okuyun.
:::

## Gelişmiş örnek

Angular testlerinde **sahtelere sağlayıcılarının** gelişmiş bir örneği.  
Lütfen kod içindeki yorumlara dikkat edin.

- [CodeSandbox'da deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockProvider/test.spec.ts&initialpath=%3Fspec%3DMockProvider)
- [StackBlitz'de deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockProvider/test.spec.ts&initialpath=%3Fspec%3DMockProvider)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockProvider/test.spec.ts"
describe('MockProvider', () => {
  const mockObj = { value: 123 };

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [TargetComponent],
      imports: [CommonModule],
      providers: [
        MockProvider(Dependency1Service),
        MockProvider(Dependency2Service, { name: 'd2:mock' }),
        MockProvider(UNK_TOKEN, 'mock token'),
        MockProvider(STR_TOKEN, 'mock'),
        MockProvider(OBJ_TOKEN, mockObj),
        MockProvider('pri', 'pri'),
      ],
    }).compileComponents(),
  );

  it('sahte sağlayıcıları kullanır', () => {
    // sağlanan token'ı etkileyen token'ın verilerini geçersiz kılmak.
    mockObj.value = 321;
    const fixture = MockRender(TargetComponent);
    expect(
      fixture.point.injector.get(Dependency1Service).echo(),
    ).toBeUndefined();
    expect(
      fixture.point.injector.get(Dependency2Service).echo(),
    ).toBeUndefined();
    expect(fixture.point.injector.get(OBJ_TOKEN)).toBe(
      mockObj as any,
    );
    expect(fixture.nativeElement.innerHTML).not.toContain('"target"');
    expect(fixture.nativeElement.innerHTML).toContain('"d2:mock"');
    expect(fixture.nativeElement.innerHTML).toContain('"mock token"');
    expect(fixture.nativeElement.innerHTML).toContain('"mock"');
    expect(fixture.nativeElement.innerHTML).toContain('"value": 321');
    expect(fixture.nativeElement.innerHTML).toContain('"pri"');
  });
});