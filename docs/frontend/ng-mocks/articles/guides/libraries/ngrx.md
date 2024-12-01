---
title: Ngrx'in Angular uygulamalarında kullanımını test etme
sidebar_label: NGRX
description: Bu belge, Angular uygulamalarında NGRX kullanımını test etme yöntemlerine dair kapsamlı bir rehber sunmaktadır. Test ortamında NGRX modüllerini nasıl etkili bir şekilde taklit edeceğinizi ve mock yapıların nasıl kullanılacağını öğreneceksiniz.
keywords: [NGRX, Angular, test, ng-mocks, mockStore]
---

`ng-mocks`, `NGRX` modüllerini mükemmel bir şekilde taklit eder. Ancak, bazı modüllerin korunması gerekiyorsa sorunlar ortaya çıkabilir.

`StoreModule` ve `EffectsModule`, azaltıcıları ve etkileri yapılandırmak için giriş noktası fabrika modülleridir.  
Arka planda, `NGRX` dört modül kullanır ve bu modüller `MockBuilder` içerisinde yapılandırılmalıdır:

- `StoreRootModule` için `StoreModule.forRoot`
- `StoreFeatureModule` için `StoreModule.forFeature`
- `EffectsRootModule` için `EffectsModule.forRoot`
- `EffectsFeatureModule` için `EffectsModule.forFeature`

Bir testte `ngrx`'in korunmasını istediğimizi düşünelim. Bu durumda, modülleri `.keep` ile geçmemiz gerekir:

```ts
beforeEach(() =>
   MockBuilder(TargetComponent, TargetModule)
     .keep(StoreRootModule) // tüm StoreModule.forRoot'u korur
     .keep(StoreFeatureModule) // tüm StoreModule.forFeature'i korur
     .keep(EffectsRootModule) // tüm EffectsModule.forRoot'u korur
     .keep(EffectsFeatureModule) // tüm EffectsModule.forFeature'i korur
 );
```

## `.forFeature()` ile tembel yüklenen modüller

`StoreModule.forRoot()` veya `EffectsModule.forRoot()`'u ithal etmeyen,  
sadece `StoreModule.forFeature` veya `EffectsModule.forFeature` içeren bir tembel yüklenen modülü test etmek istediğinizde,  
`.forRoot()`'u manuel olarak eklemeniz gerekir:

```ts
beforeEach(() =>
  MockBuilder(
    // koru ve dağıt
    [
      SomeComponent,
      // kök araçlarını sağlama
      StoreModule.forRoot({}),
      EffectsModule.forRoot(),     
    ],
    // mock
    LazyLoadedModule,
  )

  // tembel yüklenen modül ithalatlarını koruma
  .keep(StoreFeatureModule) // tüm StoreModule.forFeature'i korur
  .keep(EffectsFeatureModule) // tüm EffectsModule.forFeature'i korur
);
```

## provideMockStore

`ngrx` modülleri ile entegrasyonu test etmek istediğinizde, `MockBuilder` ile `provideMockStore` kullanabilirsiniz:

```ts
beforeEach(() =>
  MockBuilder(TargetComponent, TargetModule).provide(
    provideMockStore({
      initialState: {
        // ...
      },
    }),
  ),
);
```

Bir `Store` örneğini render olmadan önce almak gerekiyorsa `MockRenderFactory` kullanmanız gerekebilir:

```ts
describe('provideMockStore:MockBuilder', () => {
  beforeEach(() =>
    MockBuilder(TargetComponent, TargetModule).provide(
      provideMockStore({
        initialState: {
          [myReducer.featureKey]: 'mock',
        },
      }),
    ),
  );

  // render için bir fabrika oluşturma
  const factory = MockRenderFactory(TargetComponent);
  beforeEach(() => factory.configureTestBed());

  it('değeri seçer', () => {
    // Store'u enjekte etme
    const store = TestBed.inject(Store);
    const dispatchSpy = spyOn(store, 'dispatch');

    // render'lama
    const fixture = factory();

    // doğrulama
    expect(ngMocks.formatText(fixture)).toEqual('mock');
    expect(dispatchSpy).toHaveBeenCalledWith(
      setValue({ value: 'target' }),
    );
  });
});
```

## Meta azaltıcılar

:::warning
Bir mock meta azaltıcı, mağazadaki tüm azaltıcıları durdurur.
:::

### StoreDevtoolsModule

Eğer bir meta azaltıcıya sahip olan bir modülünüz varsa, örneğin `StoreDevtoolsModule`,  
o zaman **test için mağaza modüllerini korumayı planlıyorsanız bunu unutmayın**.  
Aksi takdirde, hiçbir eylem azaltılmayacak ve mağaza her zaman boş kalacaktır.

Bir seçenek olarak, herhangi bir yan etkiden kaçınmak için böyle bir **modül dışlanabilir**: `.exclude(StoreDevtoolsModule)`.

### USER_PROVIDED_META_REDUCERS

Bunun yanı sıra, `StoreRootModule`'u korumanız ve tüm manuel olarak enjekte edilen meta azaltıcıları bastırmanız gerekebilir.  
Bunu yapmak için, `USER_PROVIDED_META_REDUCERS` jetonunu boş bir dizi ile sahte oluşturun:  
`.mock(USER_PROVIDED_META_REDUCERS, [])`.

Böylece, mevcut test paketlerinde **sıfır meta azaltıcı** sağlanmış olacaktır.