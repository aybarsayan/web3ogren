---
title: 'Şablon ayrıştırma hatalarının nasıl düzeltileceği:  bilinen bir öğe değil'
description: 'Angular testleri "Şablon ayrıştırma hataları  bilinen bir öğe değil" hatası aldığında bir çözüm. Bu içerik, bu hatayı nasıl düzelteceğinizi ve ilgili iddiaların detaylarını sunmaktadır.'
keywords: [Angular, test, hata düzeltme, MockComponent, Template parse errors]
---

Bu hata, bir testte bir test bileşeninin bağımlı olduğu modülün sahte modülü olduğunda meydana gelebilir, ancak bildirimleri dışa aktarılmamıştır.

```ts
@NgModule({
  declarations: [DependencyComponent],
})
class MyModule {}
```

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    declarations: [
      MyComponent, // <- önemli olan tek bildirim.
    ],
    imports: [MockModule(MyModule)],
  });
  return TestBed.compileComponents();
});
```

:::warning
Bu durumda, bir test `Template parse errors: <DependencyComponent> bilinen bir öğe değil` hatası verecektir.
:::

Buradaki sorun, `DependencyComponent`'ın dışa aktarılmamış olmasıdır ve sahte bir `DependencyComponent`'a erişmek için ya `MyComponent`'ın bildirildiği aynı seviyede bildirim yapmamız ya da `DependencyComponent`'ı dışa aktarmamız gerekir.

Bunu yapmanın 3 çözümü vardır:

1. `MockComponent` çağrısını doğrudan `TestBed`'de yaparak 

   ```ts
   beforeEach(() => {
     TestBed.configureTestingModule({
       declarations: [MyComponent, MockComponent(DependencyComponent)],
     });
     return TestBed.compileComponents();
   });
   ```

2. `ngMocks.guts` kullanarak,  
   bu, ilk çözümle aynı şeyleri yapar,  
   ancak `MyModule`'dan tüm ithalatlar ve bildirimler için sahte bileşenler sağlar.

   ```ts
   beforeEach(() => {
     TestBed.configureTestingModule(ngMocks.guts(MyComponent, MyModule));
     return TestBed.compileComponents();
   });
   ```

3. `MockBuilder` kullanarak,  
   davranışı yukarıdaki çözümlerden farklıdır. Bir sahte `MyModule` oluşturur,
   bu da tüm ithalatları ve bildirimleri, sahte bir `DependencyComponent` dahil olmak üzere dışa aktarır.

   ```ts
   // MockBuilder'in vaatini döndürmeyi unutmayın.
   beforeEach(() => MockBuilder(MyComponent, MyModule));
   ```

:::note
Her yaklaşımın artıları ve eksileri hakkında daha fazla detaylı bilgiyi  
`ng-mocks'dan motivasyon ve hızlı başlangıç` bölümünde okuyabilirsiniz.
:::