---
title: Angular testlerinde gözlemlenebilir akışları nasıl sahteleyebiliriz
description: Angular testlerinde gözlemlenebilirleri sahteleme ile ilgili bilgiler. Bu içerik, Angular'da testler yaparken gözlemlenebilirlerin nasıl sahte nesnelerle değiştirilerek test süreçlerinin nasıl iyileştirileceğini ele alır. Adım adım çözümler ve örnekler ile zenginleştirilmiştir.
keywords: [Angular, test, gözlemlenebilir, sahteleme, MockProvider, MockService, Subject]
---

**Angular testlerinde sahte bir gözlemlenebilir** oluşturulabilir
`MockProvider`,
`MockInstance` veya
`ngMocks.defaultMock` kullanılarak.

## Problem

Örneğin, `TodoService.list$()` varsa,
bu `Observable>` türünde bir değer döndürüyorsa,
ve bir bileşen varsa,
bu bileşen `OnInit` içinde `subscribe` metodu ile listeyi alıyorsa:

```ts
class TodoComponent implements OnInit {
  public list: Observable<Array<Todo>>;

  constructor(protected service: TodoService) {}

  ngOnInit(): void {
    // :::warning Asla böyle yapmayın.
    // Bu yalnızca gösterim amaçları için.
    this.service.list$().subscribe(list => (this.list = list));
  }
}
```

Bileşeni test etmek istiyorsak, bağımlılıklarını sahte nesneleri ile değiştirmek isteriz.
Bizim durumumuzda bu `TodoService`dir.

```ts
TestBed.configureTestingModule({
  declarations: [TodoComponent],
  providers: [MockProvider(TodoService)],
});
```

Eğer bir fixture oluşturursak, `undefined`'in özelliklerini okuma hatası ile karşılaşırız. Bu, `TodoService.list$`'nin sahte nesnesinin bir spy döndürmesinden kaynaklanır. Eğer `otomatik spy` yapılandırılmışsa veya `undefined` ise, her ikisinin de `subscribe` özelliği yoktur.

## Çözüm

Bunu çözmek için, yöntemin bir gözlemlenebilir akış döndürmesini sağlamalıyız.
Bunun için, sahte nesneyi `MockProvider` içine ikinci parametre olarak geçerek genişletebiliriz.

```ts
TestBed.configureTestingModule({
  declarations: [TodoComponent],
  providers: [
    MockProvider(TodoService, {
      list$: () => EMPTY,
    }),
  ],
});
```

:::tip 
Artık bileşenin başlangıcı hata vermiyor.
:::

## Kalıcı düzeltme

Eğer bunu tüm testler için global olarak yapmak istiyorsak, `ngMocks.defaultMock` kullanabiliriz.

```ts
ngMocks.defaultMock(TodoService, () => ({
  list$: () => EMPTY,
}));
```

Böylece her seferinde testlerin bir `TodoService` sahte nesnesine ihtiyacı olduğunda, `list$()` `EMPTY` döndürür.

## `Subject`'i sahteleme

`EMPTY` gözlemlenebilirleri düzgün bir şekilde bastırmak için çok temel bir sahte nesnedir.
Ancak, `Subject` ve onun özel türlerini, yani `BehaviorSubject`, `ReplaySubject` ve `AsyncSubject`'u sahtelemek istiyorsanız,
o zaman `EMPTY`, gerekli yöntemlerin eksikliği nedeniyle bunu karşılayamaz:
`.next()`, `.error()` ve `.complete()`.

Örnek olarak, şöyle bir servise sahip olalım:

```ts
class TodoService {
  subject: Subject<boolean>;
  behavior: BehaviorSubject<boolean>;
  replay: ReplaySubject<boolean>;
  async: AsyncSubject<boolean>;
}
```

Ve tüm bu özelliklerin testlerimizde `EMPTY` olmasını istiyoruz:

```ts
ngMocks.defaultMock(TodoService, () => ({
  subject: EMPTY,
  behavior: EMPTY,
  replay: EMPTY,
  async: EMPTY,
}));
```

:::warning 
Ancak bu, kutudan çıktığı gibi çalışmaz ve bir tür hatası verir.
```text
TS2769: No overload matches this call.
  The last overload gave the following error.
  Argument of type 'typeof TodoService' is not assignable to parameter of type
    'AnyDeclaration<{
      subject: Observable<never>;
      behavior: Observable<never>;
      replay: Observable<never>;
      async: Observable<never>;
    }>[]'.
```
:::

Bu mantıklıdır, çünkü `Observable` gerçekte `Subject` vb. değildir.

Bunu düzeltmek için, `Subject`, `BehaviorSubject`, `ReplaySubject` ve `AsyncSubject`'un bir sahte nesnesine sahip olmamız gerekir,
ancak bu, `EMPTY` gibi davranmalıdır: yalnızca abone olunduğunda tamamlanmalıdır.

`ng-mocks` içinde `MockService` bulunmaktadır; bu, bir sınıf alabilir ve onun sahte bir örneğini sağlar.
Daha da önemlisi, ikinci parametresi, sahte nesneyi özelleştirmenizi sağlar.
Böylece, `Subject`'ı sahteleyebilir ve `EMPTY` mantığını şu şekilde uygulayabiliriz:

```ts
ngMocks.defaultMock(TodoService, () => ({
  subject: MockService(Subject, EMPTY),
  behavior: MockService(BehaviorSubject, EMPTY),
  replay: MockService(ReplaySubject, EMPTY),
  async: MockService(AsyncSubject, EMPTY),
}));
```

Artık, tüm özellikler abone olunduğunda tamamlanır ve gerekli türleri karşılar.

## `BehaviorSubject`'ın ilk yayılımını sahteleme

Yukarıda belirtilenlerin devamında, gözlemlenebilirleri bastırmanın yanı sıra,
`BehaviorSubject`'ın ilk yayılımını da sahteleme ihtiyacı olabilir.

Bu durumda, `EMPTY` yerine istenen değeri ile birlikte `of()` kullanılmalıdır:

```ts
ngMocks.defaultMock(TodoService, () => ({
  behavior: MockService(BehaviorSubject, of(false)),
}));
```

:::note 
Kazandık! Artık `TodoService.behavior` abone olduğunda `false` yayıyor ve aboneliği tamamlıyor.
:::

## Gözlemlenebilir akışları özelleştirme

Yine de, genellikle yalnızca `EMPTY` gözlemlenebilir akışı döndürmek istemeyiz,
aynı zamanda aramalarını simüle edecek sahte bir konuyu da sağlamamız gerekir.

Olası bir çözüm, `it` bağlamında `MockInstance` kullanmaktır:

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    declarations: [TodoComponent],
    providers: [MockProvider(TodoService)],
  });
});

it('test', () => {
  const fakeList$ = new Subject(); // <- konu oluştur.
  const list$ = jasmine.createSpy().and.returnValue(fakeList$);
  MockInstance(TodoService, () => ({
    list$,
  }));

  const fixture = TestBed.createComponent(TodoComponent);
  fixture.detectChanges();

  // Burada bazı doğrulamalar yapabiliriz.
  expect(list$).toHaveBeenCalledTimes(1);

  // Yayılımları simüle edelim.
  fakeList$.next([]);
});
```

`MockBuilder` için bir çözüm de oldukça benzer.

```ts
let todoServiceList$: Subject<any>; // <- bir bağlam değişkeni.

beforeEach(() => {
  todoServiceList$ = new Subject(); // <- konu oluştur.

  return MockBuilder(TodoComponent, ItsModule)
    // TodoService, ItsModule içindeki modülde sağlanıyor
    .mock(TodoService, {
      list$: () => todoServiceList$,
    });
});

it('test', () => {
  const fixture = MockRender(TodoComponent);
  todoServiceList$.next([]);
  // bazı doğrulamalar.
});
```

Bunların hepsi `MockInstance` ile de uygulanabilir,
ancak bu konu dışına çıkmaktadır.

## Gelişmiş örnek

Angular testlerinde **gözlemlenebilirleri sahteleme** üzerine gelişmiş bir örnek.
Lütfen koddaki yorumlara dikkat edin.

- [CodeSandbox'ta deneyin](https://codesandbox.io/p/sandbox/github/help-me-mom/ng-mocks-sandbox/tree/tests/?file=/src/examples/MockObservable/test.spec.ts&initialpath=%3Fspec%3DMockObservable)
- [StackBlitz'te deneyin](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockObservable/test.spec.ts&initialpath=%3Fspec%3DMockObservable)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockObservable/test.spec.ts"
describe('MockObservable', () => {
  // Bileşeni test etmek için, onu ilk parametre olarak veriyoruz
  // MockBuilder'a. Sahte bağımlılıklarını oluşturmak için
  // modülünü ikinci parametre olarak veriyoruz.
  // MockBuilder'ın promise'ını döndürmeyi unutmayın.
  beforeEach(() => MockBuilder(TargetComponent, TargetModule));

  // Şimdi, servisin sahte nesnesini özelleştirmemiz gerekiyor.
  // value$ akışa erişim noktamızdır.
  const value$: Subject<number[]> = new Subject();
  beforeAll(() => {
    // MockInstance, sahte nesne örneklerini geçersiz kılmamıza yardımcı olur.
    MockInstance(TargetService, instance =>
      ngMocks.stub(instance, {
        value$, // bu bir salt okunur özellik olsa bile geçersiz kılabiliriz.
      }),
    );
  });

  // Testlerden sonra temizleme.
  afterAll(() => {
    value$.complete();
    MockInstance(TargetService);
  });

  it('içerilen bir konunun yayılımına dinler', () => {
    // Bileşeni render edelim.
    const fixture = MockRender(TargetComponent);

    // Henüz hiçbir şey yaymadık, şablonu kontrol edelim.
    expect(fixture.nativeElement.innerHTML).not.toContain('1');
    expect(fixture.nativeElement.innerHTML).not.toContain('2');
    expect(fixture.nativeElement.innerHTML).not.toContain('3');

    // Bir yayılım simüle edelim.
    value$.next([1, 2, 3]);
    fixture.detectChanges();

    // Şablon, yayılmış sayıları içermelidir.
    expect(fixture.nativeElement.innerHTML).toContain('1');
    expect(fixture.nativeElement.innerHTML).toContain('2');
    expect(fixture.nativeElement.innerHTML).toContain('3');

    // Bir yayılım daha simüle edelim.
    value$.next([]);
    fixture.detectChanges();

    // Sayılar kaybolmalıdır.
    expect(fixture.nativeElement.innerHTML).not.toContain('1');
    expect(fixture.nativeElement.innerHTML).not.toContain('2');
    expect(fixture.nativeElement.innerHTML).not.toContain('3');

    // Kardeş yöntemin de bir sahte nesne ile değiştirildiğini kontrol ediyoruz.
    expect(
      fixture.point.injector.get(TargetService).getValue$,
    ).toBeDefined();
    expect(
      fixture.point.injector.get(TargetService).getValue$(),
    ).toBeUndefined();
  });
});
```