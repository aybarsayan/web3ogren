---
title: Motivasyon ve hızlı başlangıç
description: Angular testlerinde ng-mocks yardımıyla mock işlemlerini nasıl basit hale getirebileceğinizi hızlıca açıklamak. Bu belge, mock bileşenleri oluşturma ve bağımlılık sorunlarından nasıl kaçınabileceğinizi gösterir.
keywords: [Angular, ng-mocks, mock bileşenler, bağımlılıklar, TestBed]
sidebar_label: Hızlı başlangıç
---

Angular testi eğlenceli ve kolaydır, ta ki karmaşık bağımlılıklarla karşılaşana kadar,  
ve `TestBed`'i ayarlamak gerçekten can sıkıcı ve zaman alıcı hale gelir.

`ng-mocks`, geliştiricilerin  
**`mock çocuk bileşenleri`**  
oluşturup ve bağımlılıkları birkaç satır kod ile  
`MockService`,  
`MockComponent`,  
`MockDirective`,  
`MockPipe`,  
`MockProvider`,  
`MockModule`,  
ya da `MockBuilder` gibi profesyonel araçlarla  
`MockRender` ile birlikte kolayca yeniden ortaya çıkararak eğlence ve kolaylığı geri kazandırmasına yardımcı olur.

Diyelim ki Angular uygulamanızda `AppBaseComponent` adında bir bileşeniniz var  
ve şablonu şöyle görünüyor:

```html
<app-header [menu]="items">
  <app-search (search)="search($event)" [results]="search$ | async">
    <ng-template #item let-item>
      <strong>{{ item }}</strong>
    </ng-template>
  </app-search>
  {{ title | translate }}
</app-header>
<app-body appDark>
  <router-outlet></router-outlet>
</app-body>
<app-footer></app-footer>
```

Bu, bileşenin aşağıdaki çocuk bileşenlerine, servislere ve bildirimlere bağımlı olduğu anlamına gelir:

- `AppHeaderComponent`
- `AppSearchComponent`
- `AppBodyComponent`
- `AppFooterComponent`
- `SearchService`
- `TranslatePipe`

:::warning
Bunu kolayca `schemas: [NO_ERRORS_SCHEMA]` ile test edebilirsiniz  
`Template parse errors:  is not a known element` hatalarından kaçınmak için,  
ve bu çalışır, ancak bu durumda bağımlılığın bir arayüzü değişirse ve  
kod güncellemeleri gerektirirse, testlerimizin başarısız olmayacağına dair hiçbir garanti yok.  
Bu yüzden `NO_ERRORS_SCHEMA`'dan kaçınmalısınız.
:::

Ancak, bu durum, tüm bağımlılıkları `TestBed`'e bu şekilde koymak zorunda kalmamıza neden olur:

```ts
TestBed.configureTestingModule({
  declarations: [
    // Önemli bildirim.
    AppBaseComponent,

    // Bağımlılıklar.
    AppHeaderComponent,
    AppDarkDirective,
    TranslatePipe,
    // ...
  ],
  imports: [
    CommonModule,
    AppSearchModule,
    // ...
  ],
  providers: [
    SearchService,
    // ...
  ],
});
```

Ve evet, hiç kimse bağımlılıkların hangi bağımlılıklara sahip olduğunu bilmez,  
ama kesinlikle onlarla endişelenmek istemediğinizi biliyoruz.

İşte burada `ng-mocks` imdada yetişir. Tüm bağımlılıkları  
**mock sürümlerini almak için yardımcı fonksiyonlara geçirin**  
ve bağımlılık sorunlarından kaçının.

```ts
TestBed.configureTestingModule({
  declarations: [
    // Önemli bildirim.
    AppBaseComponent,

    // Bağımlılıkları mocklamak.
    MockComponent(AppHeaderComponent),
    MockDirective(AppDarkDirective),
    
    MockPipe(TranslatePipe),
    // ...
  ],
  imports: [
    MockModule(CommonModule),
    MockModule(AppSearchModule),
    // ...
  ],
  providers: [
    MockProvider(SearchService),
    // ...
  ],
});
```

Şablondaki `search$ | async`'ı fark ettiyseniz doğru bir çıkarsamada bulundunuz:  
başarısızlıkları önlemek için sahte bir observable akışına ihtiyacınız var  
`Cannot read property 'pipe' of undefined` hatası,  
bileşen `ngOnInit`'de `this.search$ = this.searchService.result$.pipe(...)` ifadesini çalıştırmaya çalışırken meydana geldiğinde.

Örneğin, bunu `MockInstance` ile uygulayabilirsiniz:

```ts
beforeEach(() =>
  MockInstance(SearchService, () => ({
    result$: EMPTY,
  })),
);
```

:::note
ya da tüm testler için varsayılan mock davranışı olarak ayarlamak isterseniz,  
bunu `src/test.ts` içinde `ngMocks.defaultMock` kullanarak yapabilirsiniz.
:::

```ts title="src/test.ts"
ngMocks.defaultMock(SearchService, () => ({
  result$: EMPTY,
}));
```

Kâr. Artık çocuk bağımlılıklarının gürültüsünü unutabilirsiniz.

Yine de, mock bildirimlerinin satırlarını sayarsak,  
birçok bildirim olduğunu görüyoruz  
ve birçok bağımlılığa sahip bileşenler için burada daha fazlasının olabileceği görünmektedir. Ayrıca, biri `AppSearchModule`'ü `AppBaseModule`'den sildiğinde ne olur? Testin kaybolan bir bağımlılık nedeniyle başarısız olacağını düşünmüyorum.

Doğru, bir aracın, `AppBaseComponent`'a ait bildirimin bildirimlerini dışa aktarması ve  
yukarıdaki kod gibi bunlardan mock oluşturması gerekiyor.  
O zaman, biri `AppSearchModule`'ü silerse test de başarısız olur.

:::info
`ngMocks.guts` ve `MockBuilder` bunun için bir araçtır.
:::

## ngMocks.guts 

`ngMocks.guts` şu şekilde çalışır: 3 parametre kabul eder, her biri isteğe bağlıdır.

- 1. parametre, oldukları gibi test etmek istediğimiz şeyleri kabul eder, bunlar mock yapılmayacak.
- 2. parametre, şeylerin bağımlılıklarını kabul eder. Bu bağımlılıklar mock yapılacaktır. Modüller durumunda,  
  ithalatları, bildirimleri ve sağlayıcıları (guts) mocklanacaktır.  
- 3. parametre, daha sonra karmaşık mocklar sağlamak için bağımlılıklardan hariç tutulması gereken şeyleri kabul eder.

Herhangi bir parametreyi `null` yaparak yoksayabiliriz veya birden fazla şeyi geçmek istiyorsak dizi olarak iletebiliriz.

Şimdi, `ngMocks.guts` fonksiyonunu `AppBaseComponent` ve bu makalenin başındaki `AppBaseModule`'a uygulayalım.

Amaç, `AppBaseModule`'un içini mocklamak, ancak `AppBaseComponent`'i test etmek için olduğu gibi saklamaktır  
ve `SearchService`'i karmaşık bir mock ile değiştirmektir.

Dolayısıyla,  
`AppBaseComponent` ilk parametre olarak,  
`AppBaseModule` ikinci parametre olarak,  
ve `SearchService` üçüncü parametre olarak geçilmelidir.

```ts
const testModuleDeclaration = ngMocks.guts(
  AppBaseComponent, // sakla
  AppBaseModule, // mockla
  [SearchService], // hariç tut
);
```

`ngMocks.guts` `AppBaseModule`'un bir modül olduğunu tespit eder ve  
1. ve 3. parametreye saygıyla, hangi şeylerin mocklanacağını ve hariç tutulacağını dışarı çıkarır.

`ngMocks.guts` sonucunun baş aşağı olacağıdır: 

```ts
const testModuleDeclaration = {
  declarations: [
    AppBaseComponent, // sakla
    MockComponent(AppHeaderComponent),
    MockDirective(AppDarkDirective),
    MockPipe(TranslatePipe),
  ],
  imports: [
    MockModule(CommonModule),
    MockModule(AppSearchModule),
  ],
  providers: [
    // SearchService, // hariç tut
  ],
};
```

Şimdi, `SearchService` için karmaşık bir mock ekleyelim.

```ts
testModuleDeclaration.providers.push({
  provide: SearchService,
  useValue: SophisticatedMockSearchService,
});
```

Kâr. `TestBed` artık yapılandırılabilir.

```
TestBed.configureTestingModule(testModuleDeclaration);
```

Ve hepsi birlikte:

```ts
beforeEach(() => {
  const testModuleDeclaration = ngMocks.guts(
    AppBaseComponent, // sakla
    AppBaseModule, // mockla
    [SearchService], // hariç tut
  );
  testModuleDeclaration.providers.push({
    provide: SearchService,
    useValue: SophisticatedMockSearchService,
  });
  
  return TestBed.configureTestingModule(testModuleDeclaration);
});
```

### Tembel yüklemeli modüller

Peki ya tembel yüklemeli modüller?

Eğer bir tembel modülünüz varsa, o sadece yeterli olmayabilir ve  
ona üst modülünü de eklemeniz gerekebilir, örneğin `AppModule`.  
Böyle bir durumda, sadece ikinci parametre olarak bir modüller dizisi geçirin.

```ts
TestBed.configureTestingModule(
  ngMocks.guts(
    AppBaseComponent, // sakla
    [AppBaseModule, AppModule], // mockla
  ),
);
```

Kâr. Başlamak için bu yeterli olmalı.

## MockBuilder

Yukarıdaki fonksiyonlar kolay bir başlangıç yapmaya yardımcı olur, ancak  
tüm olası durumları kapsamaz ve davranışı özelleştirmek için araçlar sağlamaz.  
``MockBuilder`` ve `MockRender` okumayı düşünebilirsiniz  
**Angular testlerinde çocuk bağımlılıkları için mock oluşturmak için**.

Örneğin, `TranslatePipe`'ın stringlerini çevirmek yerine önek eklemesi gerektiğinde ve  
bir hata oluşmaması için boş bir sonucu olan bir `SearchService` stub'ı oluşturduğunuzda,  
kod şöyle görünür:

```ts
beforeEach(() => {
  return MockBuilder(AppBaseComponent, AppBaseModule)
    // TranslatePipe, AppBaseModule içinde bildirilmiştir / ithal edilmiştir
    .mock(TranslatePipe, v => `translated:${v}`)
    // SearchService, AppBaseModule içinde sağlanmıştır / ithal edilmiştir
    .mock(SearchService, {
      result$: EMPTY,
    });
});
```

Kâr.

Hala sorularınız mı var? Bize `ulaşmaktan çekinmeyin`.