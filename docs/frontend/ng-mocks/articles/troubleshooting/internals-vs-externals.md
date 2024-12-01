---
title: Mock Modüllerindeki İç ve Dış Yapılar
description: MockModule kullanarak iç ve dış yapılar arasındaki fark hakkında bilgi edinmek için bu içerik önemli bilgiler sunmaktadır. Modüllerin test edilmesi sürecinde karşılaşılabilecek zorluklar ve çözümler ele alınmaktadır.
keywords: [MockModule, InternalModule, ExternalModule, Angular, test, bağımlılıklar, MockBuilder]
---

Modülün nasıl sahte (mock) edilmesi gerektiğini anlamanın **önemli bir noktası** vardır.

Hayal edelim ki, bir modülümüz var ve tanımı şöyle görünüyor:

```ts
@NgModule({
  imports: [ExternalModule],
  declarations: [
    MyComponent,
    InternalDirective,
  ],
  exports: [MyComponent],
})
class InternalModule {}
```

## Açıklama

Modülde **iki tanım** vardır: `MyComponent` ve `InternalDirective`.  
Bunlar **birbirlerini kullanabilir**, çünkü aynı modülde tanımlanmışlardır.

:::tip
İhracatları kontrol ettiğimizde, yalnızca `MyComponent`'in dışarı aktarıldığını görüyoruz.  
Bu, bir modül `InternalModule`'ü içe aktardığında, `InternalDirective`'e doğrudan **erişimin** olmadığı anlamına gelir.
:::

Bu, bir Angular uygulaması inşa ediyorsak sorun değil. `InternalDirective` **içsel** bir şeydir ve `InternalModule` dışında uygulamamızda kullanılmasına **gerek yoktur**.  
Ancak, testlerde farklı bir durum söz konusu.

## İçlerin Testi

Şimdi, `InternalDirective`'i test etmek istediğimizi hayal edelim ve `ExternalModule` ile `MyComponent` bunun bağımlılıklarıdır ve bunları sahte (mock) olanlarla değiştirmek istiyoruz.

`InternalModule` tüm bağımlılıklara sahip olduğu için, ilk bakışta, onu sahtelemek mantıklıdır:

```ts
TestBed.configureTestingModule({
  imports: [
    MockModule(InternalModule),
  ],
  declarations: [
    InternalDirective,
  ],
});
```

Ancak, bu **beklediğimiz gibi** olmayacak, çünkü `InternalModule` yalnızca `MyComponent`'i dışa aktarıyor ve dolayısıyla, test modülünde `ExternalModule`'e erişim yok.

Test modülündeki `imports` kısmına `MockModule(ExternalModule)` ekleyebiliriz, ancak, kod kötü hissettirmeye başlıyor çünkü `ExternalModule` zaten `InternalDirective`'nin ait olduğu modülde içe aktarılmış durumda olup, ekstra bir `MockModule(ExternalModule)` içe aktarımının yapılması yanlıştır.

Görünüşe göre, `MockModule` içe aktarımlarını ve tanımlarını dışa aktarıyorsa, bu durumu çözebilir.

> Evet... bu, 9'dan önceki versiyonlarda böyleydi, ama o zaman başka bir sorun ortaya çıktı ve bu da dış yapılar (ihracatlar) ile ilgiliydi.  
> — Açıklayıcı Not

## Dışların Testi

Şimdi, `MyComponent`'i test etmek istediğimizi hayal edelim.  
Hikaye aynı, `ExternalModule` ve `InternalDirective` bunun bağımlılıklarıdır ve bunları sahte (mock) olanlarla değiştirmek istiyoruz.

`InternalModule` tüm bağımlılıklara sahip olduğu için, ilk bakışta, onu sahtelemek mantıklıdır:

```ts
TestBed.configureTestingModule({
  imports: [
    MockModule(InternalModule),
  ],
  declarations: [
    MyComponent,
  ],
});
```

Ayrıca, dışa aktarımları yapılmamış olan `InternalDirective` sorunu dışında başka bir sorun daha var.

Çünkü `MockModule(InternalModule)` `MockComponent(MyComponent)`'i dışa aktarıyor, bu nedenle artık test modülünde `MyComponent`'in iki tanımı var.  
Sonunda, `2 modülün tanımlarıyla ilgili` hata alacağız.

Bu, `MyComponent` için bağımlılıkları sahtelemek istediğimiz testlerde, `InternalModule`'ü kullanamayacağımız anlamına geliyor.

## Çözüm

Eğer `hızlı başlangıç` dökümanını okuduysanız, bunu biliyorsunuzdur.  
Bu, `MockBuilder` ya da `ngMocks.guts` kullanılarak başarılabilir.

Her ikisi de sorunu çözüyor, ancak farklı yollarla.

### MockBuilder

`MockBuilder(InternalDirective, InternalModule)`, `InternalModule` için yeni bir tanım oluşturur, burada `InternalDirective` dışa aktarılmıştır, böylece `InternalDirective` tekrar tüm bağımlılıklarına erişebilir ve testte `InternalDirective`'e erişimimiz olur:

```ts
@NgModule({
  imports: [
    MockModule(ExternalModule),
  ],
  declarations: [
    MockComponent(MyComponent),
    InternalDirective,
  ],
  exports: [
    MockComponent(MyComponent),
    InternalDirective,
  ],
})
class MockInternalModule {}

TestBed.configureTestingModule({
  imports: [
    MockInternalModule,
  ],
});
```

:::info
`MockBuilder` ile, ihtiyaç duyduğumuzda dışa aktarma davranışını değiştirebiliriz, bu, `export` ve `exportAll` bayraklarıyla gerçekleştirilebilir.
:::

### ngMocks.guts

`ngMocks.guts(InternalDirective, InternalModule)`, `InternalModule`'ün iç yapısını basitçe sahteleyerek, test modülünün tanımı şöyle görünür: 

```ts
TestBed.configureTestingModule({
  imports: [
    MockModule(ExternalModule),
  ],
  declarations: [
    MockComponent(MyComponent),
    InternalDirective,
  ],
});
```