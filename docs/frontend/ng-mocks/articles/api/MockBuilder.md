---
title: MockBuilder - Angular testlerinde mock oluşturmaya en basit yol
description: MockBuilder, Angular testlerinde mock oluşturmaya yönelik en pratik ve etkili yöntemdir. Bu içerik, MockBuilder kullanarak bağımlılıkları testlerinize nasıl entegre edebileceğinizi ayrıntılı olarak açıklar.
keywords: [MockBuilder, Angular, test, bağımlılıklar, mock]
sidebar_label: MockBuilder
---

`MockBuilder` **mock oluşturmanın en basit yoludur**.  
Testlerin gerektirdiği şekilde mock'ları manipüle etmek için zengin bir fonksiyon seti sunar, ancak minimum overhead ile.

Genellikle test edilmesi gereken basit bir şeyimiz vardır, ama zaman zaman, basitlik korkunç bağımlılıklar tarafından ortadan kaldırılır.  
Burada iyi olan şey, genellikle bağımlılıkların test ettiğimiz şeyin bulunduğu modülde beyan edilmiş veya içe aktarılmış olmasıdır.  
Bu nedenle, `MockBuilder` yardımıyla, test modülünü oldukça kolay bir şekilde tanımlayabiliriz.  
Burada **modüldeki her şey mock'larıyla değiştirilir**, test edilen şey hariç:

```ts
beforeEach(() => {
  return MockBuilder(TheThing, ItsModule);
});

// Bir bileşeni test etmek için
beforeEach(() => {
  return MockBuilder(TheComponent, ItsModule);
});

// Bir direktifi test etmek için
beforeEach(() => {
  return MockBuilder(TheDirective, ItsModule);
});

// Bir pipe'ı test etmek için
beforeEach(() => {
  return MockBuilder(ThePipe, ItsModule);
});

// Bağımsız deklarasyonları test etmek için
beforeEach(() => {
  return MockBuilder(TheStandaloneDeclaration).mock(OneOfItsImports);
});
```

`MockBuilder`, **Angular bağımlılıklarını mock'larına dönüştürmek için basit bir araç sağlar**, bunu izole alanlarda yapar, ve şu alanları destekleyen zengin bir araç setine sahiptir:

- kök sağlayıcılar için mock'ların tespiti ve oluşturulması
- her derinlikte modüllerin ve deklarasyonların değiştirilmesi
- her derinlikte modüllerin, deklarasyonların ve sağlayıcıların hariç tutulması
- `bağımsız deklarasyonların` yüzeysel test edilmesi

## Basit örnek

`MockBuilder` yardımıyla Angular testlerinde mock oluşturmanın kolaylığını gösteren bir kod örneği.  
Lütfen, kodun içindeki yorumlara dikkat edin.

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockBuilder/test.simple.spec.ts&initialpath=%3Fspec%3DMockBuilder%3Asimple)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockBuilder/test.simple.spec.ts&initialpath=%3Fspec%3DMockBuilder%3Asimple)

```ts
describe('MockBuilder:simple', () => {
  // MockBuilder'ın promisesini döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(MyComponent, MyModule));
  // Bununla aynı
  // beforeEach(() => TestBed.configureTestingModule({{
  //   imports: [MockModule(MyModule)],
  // }).compileComponents());
  // ama MyComponent, test amaçları için mock nesnesi ile değiştirilmemiştir.

  it('bütün bağımlılıkları göz ardı ederek içeriği render etmelidir', () => {
    const fixture = MockRender(MyComponent);
    expect(fixture).toBeDefined();
    expect(fixture.nativeElement.innerHTML).toContain(
      '<div>My Content</div>',
    );
  });
});
```

## Esnek mod

:::tip
TestBed'i istediğiniz şekilde oluşturmak için esnek modu kullanabilirsiniz.
:::

Diyelim ki `TargetComponent`'i test etmek istiyorsunuz ve 3 bağımlılığı var:

- `CurrencyPipe` bir mock olmalı
- `TimeService` bir mock olmalı
- `ReactiveFormModule` olduğu gibi kalmalı

Bu durumda, `MockBuilder` şu şekilde çağrılabilir:

```ts
beforeEach(() => {
  return MockBuilder()
    // TestBed'de olduğu gibi tanımlanır.
    .keep(TargetComponent)
    
    // TestBed'de bir mock olarak tanımlanır.
    .mock(CurrencyPipe)

    // TestBed'de bir mock olarak sağlanır.
    .mock(TimeService)

    // TestBed'de olduğu gibi içe aktarılır.
    .keep(ReactiveFormModule);
});
```

Bu yaklaşım iyi, ancak sorun, bağımlılıkların açıkça sağlanmış olmasıdır.  
Eğer birisi `TargetComponent`'in tanımlandığı modülden `ReactiveFormModule`'u kaldırmışsa, test başarısız olmayacak, oysa uygulama olacak.

:::warning
İşte burada `katı mod` öne çıkar.
:::

## Katı mod

Katı mod, `MockBuilder`'a 2 parametre geçerseniz etkinleştirilir:

- ilk parametre, test için sağlanması ve olduğu gibi korunması gereken şeydir
- ikinci parametre, test için sağlanması ve sahte olması gereken şeydir
- zincir çağrıları yalnızca bu deklarasyonları özelleştirir

`Esnek mod` örneğini dikkate alırsak, katı modu etkinleştirmek için kod şöyle görünmelidir:

```ts
beforeEach(() => {
  // TargetComponent, TargetModule'dan olduğu gibi dışarı aktarılır
  // TargetModule'ın tüm içe aktarımlarının ve deklarasyonlarının mock'lanması gerekir
  return MockBuilder(TargetComponent, TargetModule)
    
    // ReactiveFormModule'un, TargetModule'da olduğu gibi kalmasını işaretler
    // ve TargetModule veya içe aktarımlarının bunu içermemesi durumunda bir hata fırlatır.
    .keep(ReactiveFormModule);
});
```

`TargetComponent`'in tüm bağımlılıkları `TargetModule`'dadır ve bunlardan herhangi biri silinirse, testler başarısız olacaktır.

Ayrıca, eğer birisi `TargetModule`'dan `ReactiveFormModule`'u silerse, testler de başarısız olacaktır, çünkü `MockBuilder`, korunması gereken `ReactiveFormModule`'un eksik olduğuna dair bir hata fırlatacaktır.

Peki, birden fazla modül gerekiyorsa? Örneğin, tembel modüller için.  
Tembel olarak yüklenen modüller durumunda, TestBed'de birden fazla modül içe aktarmanız gerekir.  
Genellikle, kök deklarasyonları sağlayan bir `AppModule` ve belirli bir yola ait olan bir `LazyModule` vardır.  
Bunu yapmak için, `MockBuilder`'ın parametreleri olarak dizileri geçin:

```ts
beforeEach(() => {
  return MockBuilder(
    // Birden fazla şeyi korumak ve dışa aktarmak istiyorsanız bir dizi de olabilir
    TargetComponent,

    [
      // TargetModule'u TestBed'de mock'layacak ve içe aktaracak
      TargetModule,
      // AppModule'ü TestBed'de mock'layacak ve içe aktaracak  
      AppModule,
    ],
  )
    
  // CurrencyPipe'ı olduğu gibi tutacak,
  // ve ne TargetModule ne de AppModule'un bunu tanımlayıp içe aktarmaması durumunda hata verecek.
  .keep(CurrencyPipe);
});
```

**Katı mod önerilen yaklaşımdır**.

## Zincir fonksiyonları

### .keep()

Bir modülü, bileşeni, direktifi, pipe'ı veya sağlayıcıyı olduğu gibi tutmak istiyorsak `.keep` kullanmalıyız.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent)
    .keep(SomeModule)
    .keep(SomeModule.forSome())
    .keep(SomeModule.forAnother())
    .keep(SomeComponent)
    .keep(SomeDirective)
    .keep(SomePipe)
    .keep(SomeService)
    .keep(SomeInjectionToken);
});
```

### .mock()

Herhangi bir şeyi (hatta bir korunmuş modülün bir parçasını) bir mock nesnesine dönüştürmek istiyorsak `.mock` kullanmalıyız.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent)
    .mock(SomeModule)
    .mock(SomeModule.forSome())
    .mock(SomeModule.forAnother())
    .mock(SomeComponent)
    .mock(SomeDirective)
    .mock(SomePipe)
    .mock(SomeService)
    .mock(SomeInjectionToken);
});
```

Pipe'lar için, 2. parametre olarak handler'larını belirtebiliriz.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent)
    .mock(SomePipe, value => 'My Custom Content');
});
```

Hizmetler ve token'lar için isteğe bağlı olarak stub'larını sağlayabiliriz.  
Lütfen unutmayın ki hizmetin mock nesnesi sağlanan değer ile genişletilecektir.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent)
    .mock(SomeService3, anything1)
    .mock(SOME_TOKEN, anything2);
});
```

### .exclude()

Bir şeyi (hatta bir korunmuş modülün bir parçasını) hariç tutmak istiyorsak `.exclude` kullanmalıyız.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .exclude(SomeModule)
    .exclude(SomeComponent)
    .exclude(SomeDirective)
    .exclude(SomePipe)
    .exclude(SomeDependency)
    .exclude(SomeInjectionToken);
});
```

### .replace()

Bir şeyi başka bir şeyle değiştirmek istiyorsak `.replace` kullanmalıyız.  
Değiştirilen şey, kaynak ile aynı dekoratör ile işaretlenmelidir.  
Bir sağlayıcı/hizmeti değiştirmek imkansız değildir, bunun için `.provide` veya `.mock` kullanmalıyız.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .replace(SomeModule, SomeOtherModule)
    .replace(SomeComponent, SomeOtherComponent)
    .replace(SomeDirective, SomeOtherDirective)
    .replace(SomePipe, SomeOtherPipe);
});
```

`HttpClientTestingModule` durumunda, `.replace` kullanabiliriz.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .replace(HttpClientModule, HttpClientTestingModule);
});
```

`RouterTestingModule` durumunda, her iki modül için de `.keep` ve `NG_MOCKS_ROOT_PROVIDERS` kullanmamız ve `.withRoutes` içine boş bir dizi geçmemiz gerekiyor.  
`NG_MOCKS_ROOT_PROVIDERS` gerekli, çünkü `RouterModule`'un da korunması gereken birçok kök bağımlılığı vardır. 

```ts
beforeEach(() => {
  return MockBuilder(MyComponent)
    .keep(RouterModule)
    .keep(RouterTestingModule.withRoutes([]))
    .keep(NG_MOCKS_ROOT_PROVIDERS);
});
```

### .provide()

Sağlayıcıları/hizmetleri eklemek veya değiştirmek istiyorsak `.provide` kullanmalıyız.  
Aynı arayüze sahiptir.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .provide(MyService)
    .provide([SomeService1, SomeService2])
    .provide({ provide: SomeComponent3, useValue: anything1 })
    .provide({ provide: SOME_TOKEN, useFactory: () => anything2 });
});
```

## Config

Mock nesnelerinin varsayılan davranışını özelleştirebilirsiniz.  
Ayrıca, tekrarları önlemek için `ngMocks.defaultConfig()` aracılığıyla global olarak da yapılabilir.

### `precise` bayrağı

Varsayılan olarak, `.mock(Service, mock)` kullanıldığında, `MockService(Service, mock)` aracılığıyla bir mock nesnesi oluşturur.  
Bazı durumlarda, uzantı yerine tam olarak iletilen mock nesnesini kullanmak isteyebiliriz.  
Bu davranış için `precise` bayrağını `true` yapmamız gerekmektedir. Token'lar her zaman kesindir.

```ts
declare class MyService {
  p1: boolean;
  getP1(): boolean;
}
const mock = {
  p1: true,
};

beforeEach(() => {
  return (
    MockBuilder(MyComponent, MyModule)
      // instance !== mock ama instance.p1 === mock.p1
      // instance.getP1() undefined döner
      .mock(MyService, mock)
      // instance === mock, bu yüzden instance.p1 === mock.p1
      // ve instance.getP1 mevcut değildir.
      .mock(MyService, mock, {
        precise: true,
      })
  );
});
```

### `export` bayrağı

Eğer test etmek istediğimiz bir bileşen, direktif veya pipe maalesef dışa aktarılmadıysa, onu `export` bayrağı ile işaretlememiz gerekir.  
Ne kadar derin olursa olsun. `MyModule` düzeyine dışa aktarılacaktır.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .keep(SomeDeclaration1, {
      export: true,
    })
    .mock(SomeDeclaration2, {
      export: true,
    });
});
```

### `exportAll` bayrağı

Eğer dışa aktarılmamış bir modülün tüm deklarasyonlarını kullanmak istiyorsak, modülü `exportAll` bayrağı ile işaretlememiz gerekir.  
O zaman tüm ithalatları ve deklarasyonları dışa aktarılacaktır.  
Modül iç içe geçmişse, `exportAll` dışında `export` bayrağını da ekleyin.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent)
    .keep(MyModule, {
      exportAll: true,
    })
    .mock(MyNestedModule, {
      exportAll: true,
      export: true,
    });
});
```

### `dependency` bayrağı

Varsayılan olarak, tüm tanımlar, başka bir tanımın bağımlılığı değilse `MyModule`'a eklenir.  
Modüller `MyModule`'a ithalat olarak eklenir.  
Bileşenler, Direktifler, Pipe'lar `MyModule`'a deklarasyon olarak eklenir.  
Token'lar ve Hizmetler `MyModule`'a sağlayıcılar olarak eklenir.  
Eğer bir şeyin `MyModule`'a eklenmesini istemiyorsak, onu `dependency` bayrağı ile işaretlemeliyiz.

```ts
beforeEach(() => {
  return (
    MockBuilder(MyComponent)
      .mock(MyModule)
      .keep(SomeModuleComponentDirectivePipeProvider1, {
        dependency: true,
      })
      .mock(SomeModuleComponentDirectivePipe, {
        dependency: true,
      })
      // Sadece yapılandırmayı belirtmek istiyorsak,
      // aynı tanımı bir mock örneği olarak geçin.
      .mock(SomeProvider, SomeProvider, {
        dependency: true,
      })
      // Veya yapılandırma ile birlikte bir mock örneği sağlayın.
      .mock(SomeProvider, mockInstance, {
        dependency: true,
      })
      .replace(SomeModuleComponentDirectivePipeProvider1, anything1, {
        dependency: true,
      })
  );
});
```

### `shallow` bayrağı

`Shallow` bayrağı, korunan bağımsız deklarasyonlarla çalışır.  
`MockBuilder`'a deklarasyonun tüm ithalatlarını mock'lamasını belirtir, oysa deklarasyon kendisi mock'lanmayacaktır.

```ts
beforeEach(() => {
  return MockBuilder()
    .keep(StandaloneComponent, {
      shallow: true, // StandaloneComponent'in tüm ithalatları mock'lar.
    });
});
```

Eğer bir bağımsız deklarasyon, `MockBuilder`'ın ilk parametresi olarak geçirilmişse, o zaman `shallow` bayrağı otomatik olarak ayarlanacaktır.  
Bu, onların yüzeysel test edilmesini sağlar.

```ts
beforeEach(() => {
  // StandaloneComponent'in OneOfItsDependenciesPipe dışında tüm ithalatları mock'lar.
  return MockBuilder(StandaloneComponent).keep(OneOfItsDependenciesPipe);
});
```

### `render` bayrağı

Bir yapısal direktifi varsayılan olarak render etmek istediğimizde, bunu, yapılandırmasında `render` bayrağını ekleyerek yapabiliriz.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule).mock(MyDirective, {
    render: true,
  });
});
```

Direktifin kendine ait bir bağlamı ve değişkenleri varsa.  
Bu durumda `render`'ı true yapmak yerine bağlamı ayarlayabiliriz.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule).mock(MyDirective, {
    render: {
      $implicit: something1,
      variables: { something2: something3 },
    },
  });
});
```

Bir bileşende `ContentChild` kullanıyorsak ve varsayılan olarak render etmek istiyorsak, bunun için id'sini kullanmalıyız, mock direktifine benzer şekilde.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule).mock(MyComponent, {
    render: {
      blockId: true,
      blockWithContext: {
        $implicit: something1,
        variables: { something2: something3 },
      },
    },
  });
});
```

### `onRoot` bayrağı

Bu, dahili bir bayraktır ve açıkça kullanılmamalıdır.  
Bir modül veya deklarasyonun `TestBedModule`'da doğrudan tanımlanıp tanımlanmayacağını belirtir, bu, içe aktarıldığı veya iç içe geçmiş modüllerde tanımlandığı durumlarda bile.

## Tokenlar

### `NG_MOCKS_GUARDS` tokenı

`NG_MOCKS_GUARDS`, testte **tüm rotalardan koruyucuları kaldırmak** için kullanılır.  
Belirli bir koruyucuyu test etmek istiyorsanız yararlıdır.  
Bunu yapmak için, `NG_MOCKS_GUARDS`'ı `.exclude` etmeli ve koruyucuyu `.keep` etmelisiniz.

```ts
beforeEach(() => {
  return MockBuilder(
      [RouterModule, RouterTestingModule.withRoutes([])],
      ModuleWithRoutes,
    )
    .exclude(NG_MOCKS_GUARDS) // <- tüm koruyucuları kaldırır
    .keep(GuardUnderTest) // <- ama GuardUnderTest'ı korur
  ;
});
```

### `NG_MOCKS_RESOLVERS` tokenı

`NG_MOCKS_RESOLVERS`, testte **tüm rotalardan tüm resolver'ları kaldırmak** için kullanılır.  
Belirli bir resolver'ı test etmek istiyorsanız yararlıdır.  
Bunu yapmak için, `NG_MOCKS_RESOLVERS`'ı `.exclude` etmeli ve resolver'ı `.keep` etmelisiniz.

```ts
beforeEach(() => {
  return MockBuilder(
      [RouterModule, RouterTestingModule.withRoutes([])],
      ModuleWithRoutes,
    )
    .exclude(NG_MOCKS_RESOLVERS) // <- tüm resolver'ları kaldırır
    .keep(ResolverUnderTest) // <- ama ResolverUnderTest'ı korur
  ;
});
```

### `NG_MOCKS_INTERCEPTORS` tokenı

Genellikle bir interceptörü test etmek istediğimizde, diğer interceptor'ların etkilerinden kaçınmak isteriz.  
**Angular testinde tüm interceptor'ları kaldırmak** için, `NG_MOCKS_INTERCEPTORS` tokenını hariç tutmalıyız, ondan sonra tüm interceptor'lar hariç tutulacaktır, aksi takdirde açıklanmış olanlar hariç.

```ts
beforeEach(() => {
  return MockBuilder(MyInterceptor, MyModule)
    .exclude(NG_MOCKS_INTERCEPTORS);
});
```

### `NG_MOCKS_ROOT_PROVIDERS` tokenı

Angular uygulamalarında sağlananların dışında kök hizmetler ve tokenlar vardır.  
Bir testte bu sağlayıcıların sahte olmalarını veya korunmalarını istemek mümkün olabilir.

Angular testinde tüm kök sağlayıcıları sahte ile değiştirmek istiyorsak, `NG_MOCKS_ROOT_PROVIDERS` tokenını `.mock` içine geçmeliyiz.

```ts
beforeEach(() => {
  return MockBuilder(MyComponentWithRootServices, MyModuleWithRootTokens)
    .mock(NG_MOCKS_ROOT_PROVIDERS);
});
```

Buna karşılık, tüm kök sağlayıcıları mock deklarasyonları için korumak isteyebiliriz.  
Bunun için `NG_MOCKS_ROOT_PROVIDERS` tokenını korumalıyız.

```ts
beforeEach(() => {
  return MockBuilder(MyComponentWithRootServices, MyModuleWithRootTokens)
    .keep(NG_MOCKS_ROOT_PROVIDERS);
});
```

Eğer `NG_MOCKS_ROOT_PROVIDERS`'ı hiçbir yere geçmezsek, o zaman yalnızca korunan modüllerin kök sağlayıcıları olduğu gibi kalacak.  
Diğer tüm kök sağlayıcılar, mock modüllerin korunmayan deklarasyonları için bile kendilerine sahte ile değiştirilir.

## Fabrika fonksiyonu

Başka `angular için test çerçeveleri` kullanıyor olabilirsiniz,  
örneğin [`@ngneat/spectator`](https://www.npmjs.com/package/@ngneat/spectator) veya [`@testing-library/angular`](https://www.npmjs.com/package/@testing-library/angular).

Bu, fabrika fonksiyonu için bir kullanım durumudur.

Fabrika fonksiyonu, başka bir yerde geçirilebilecek önceden yapılandırılmış bir `TestBed` deklarasyonu almanızı sağlar.

```ts
const ngModule = MockBuilder(MyComponent, MyModule)
  .build();
```

Yukarıdaki kod `MyModule`'daki her şey için (ithalatlar, deklarasyonlar, sağlayıcılar ve dışa aktarımlar) mock'lar oluşturur, ancak `MyComponent`'i, test amaçları için olduğu gibi tutar.  
Aslında, şu şekilde yapar:

```ts
const ngModule = MockBuilder()
  .keep(MyComponent, { export: true })
  .mock(MyModule, { exportAll: true })
  .build();
```

Ayrıca, tüm deklarasyonlar için mock'lar oluşturmak istiyorsak ilk parametreyi `null` veya `undefined` ile bastırabiliriz.

```ts
const ngModule = MockBuilder(null, MyModule)
  .build();
```

Bu da şu anlama gelir:

```ts
const ngModule = MockBuilder()
  .mock(MyModule, { exportAll: true })
  .build();
```

Eğer daha fazla özelleştirme planlamıyorsanız, `ngModule`'ın sonucunu `.build()` çağırmadan direkt olarak dönebilirsiniz.

```ts
// MockBuilder'ın promisesini döndürmeyi unutmayın.
beforeEach(() => MockBuilder(MyComponent, MyModule));
```

Bu da şunları yapar:

```ts
beforeEach(() => {
  const ngModule = MockBuilder()
    .keep(MyComponent, { export: true })
    .mock(MyModule, { exportAll: true })
    .build();
  TestBed.configureTestingModule(ngModule);
  return TestBed.compileComponents();
});
```  

---
description: Bu içerik, `MockBuilder`'a özelleştirilmiş yöntemler eklemek ve bu yöntemleri nasıl kullanacağınız hakkında rehberlik sağlar. Ayrıca `MockBuilder` ile şemalar ekleme ve bilinmesi gerekenler üzerinde durur.
keywords: [MockBuilder, özelleştirilmiş yöntem, Angular, test uyarlama, testBed]
---

## `MockBuilder` Genişletme

`MockBuilder`'a kendi yöntemlerinizi eklemek istiyorsanız, bunu `MockBuilder.extend(method, callback)` ile yapabilirsiniz.

Varsayalım ki, bir dize kabul eden `customMock` adında bir yöntem eklemek istiyoruz ve dize bir serviste döndürme değeri olarak kullanılacak.

Sonuçta bu şekilde kullanılmalıdır:

```ts
MockBuilder(/* ... */)
  .mock(/* ... */)
  .customMock('değer') // <-- MockBuilder'a eklenti
  .keep(/* ... */);
```

İlk adım, `customMock`'u `MockBuilder` türünün bir parçası olarak tanımlamaktır:

```ts
declare module 'ng-mocks' {
  interface IMockBuilderExtended {
    // parametreler istediğiniz gibi olabilir
    customMock(value: string): this; // bu değeri döndürmesi gerekir
  }
}
```

`customMock`'un parametreleri, özel geri çağırma işlevinize iletmek istediğiniz herhangi bir şey olabilir, bizim durumumuzda bir dizedir. Ancak, döndürme türünün `this` olması gerektiğini lütfen unutmayın.

:::tip Doğru parametreler türü
Doğru bir tür demeti almak için `Parameters` adlı yerleşik bir türü kullanabilirsiniz: 
`Parameters<IMockBuilderExtended['customMock']>`,
basitçe `customMock`'u özel yönteminizin adıyla değiştirin.
::: 

```ts
// Yerleşik `Parameters` türü, tür güvenliği için kullanılabilir. 
MockBuilder.extend(
  'customMock', // <-- özel yöntemimizin adı
  
  (builder, parameters: Parameters<IMockBuilderExtended['customMock']>) => {    // Değeri çıkarma.
    const value = parameters[0];
    
    // Oluşturucu üzerinde özel mantığı çağırma.
    // Bu durumda, TargetService.echo() değeri döndürmelidir.  
    builder.mock(TargetService, {
      echo: () => value,
    });
  },
);
```

Kar, şimdi `MockBuilder().customMock('mock')` çağırırsanız, 
testinde `TargetService.echo()` çağrısı `'mock'` döndürecektir.

:::warning Özel bir yöntemi silerken
Özel bir yöntemi silmek isterseniz, ikinci parametre olmadan `MockBuilder.extend()`'i çağırmanız yeterlidir:
:::

```ts
MockBuilder.extend('customMock');
MockBulder().customMock(''); // artık bir hata fırlatır
```

## Şemalar Eklemek

`MockBuilder`, oluşturulan `testBed`'i özelleştirmeye olanak tanıyan `beforeCompileComponents` adında bir yöntem sağlar. 
Örneğin, `schemas`: `CUSTOM_ELEMENTS_SCHEMA`, `NO_ERRORS_SCHEMA` eklemek için.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .beforeCompileComponents(testBed => {
      testBed.configureTestingModule({
        schemas: [
          NO_ERRORS_SCHEMA,
        ],
      });
    });
});
```

## Bilinmesi Gerekenler

Her zaman kararımızı değiştirebiliriz. Aynı nesnedeki son işlem kazanan olur. 
`SomeModule` kendi sahte nesnesi ile değiştirilecektir.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .keep(SomeModule)
    .mock(SomeModule)
    .keep(SomeModule)
    .mock(SomeModule);
});