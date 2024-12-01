---
title: Angular testlerinde mock'ları nasıl özelleştirirsiniz
description: Angular testlerinde ng-mocks tarafından üretilen mock'ların davranışını özelleştirme bilgileri. Bu makalede, farklı yöntemlerin kullanımına dair kapsamlı bilgiler sunulmaktadır.
keywords: [Angular, test, ng-mocks, özelleştirme, MockProvider]
---

`ng-mocks`, deklarasyonları, sağlayıcıları ve klasik sınıfları taklit etmenin birçok yolunu sunar. Bu makalenin amacı, her yolun amacını açıklamak ve bunu detaylı bir şekilde tanımlamaya çalışmaktır.

## ngMocks.defaultMock

`ngMocks.defaultMock` - **tüm test takımları** için deklarasyonlar, hizmetler ve token'lar için **varsayılan mock davranışı** sağlamak için faydalıdır. Örneğin, bir özelliği observable akış olan bir hizmetimiz var. Testlerde, hizmeti taklit ederken `Cannot read property 'subscribe' of undefined` gibi hatalardan kaçınmak istiyoruz.

Bunu şu şekilde yapabiliriz:

```ts title="src/test.ts"
ngMocks.defaultMock(MyService, () => ({
  stream$: EMPTY,
}));
```

Artık `MyService` mock'ları, `stream$` özelliğinde `EMPTY` akışına sahip olacak ve tüm abonelikleri artık hata vermeyecek. Daha fazla bilgi için `ngMocks.defaultMock` ile ilgili bölüme göz atabilirsiniz.

---

## MockProvider

`MockProvider` - `TestBed.configureTestingModule` yapılandırırken bir hizmeti veya token'ı taklit etmek istediğimizde faydalıdır.

```ts
TestBed.configureTestingModule({
  providers: [MockProvider(MyService)],
});
```

Ayrıca, ekstra özelleştirme için ikinci parametre olarak özel bir dilim geçebiliriz. Bu, `ngMocks.defaultMock` içerisinde tanımlanan tüm özelleştirmelerden sonra etkisini gösterir.

:::tip
`MockProvider` ile tanımlanan mock nesneleri, testlerinizde doğru ve etkili sonuçlar almak için oldukça faydalıdır.
:::

```ts
TestBed.configureTestingModule({
  providers: [
    MockProvider(MyService, {
      stream$: throwError(new Error('bozuk akış')),
    }),
  ],
});
```

Bu, `stream$` özelliğini geçersiz kılacak ve şimdi, ilgili testlerde tüm abonelikler bir hata alacaktır. Daha fazla bilgi için `MockProvider` ile ilgili bölüme göz atabilirsiniz.

---

## MockInstance

`MockInstance` - belirli bir testte bir deklarasyon veya sağlayıcının davranışını özelleştirmemiz gerektiğinde faydalıdır. Örneğin, `stream$` 'ın bir şey yayımlamasını istiyoruz.

:::note
`MockProvider` çağrısı `MockRender` veya `TestBed.createComponent`'ten önce yapılmalıdır.
:::

```ts
it('test', () => {
  const stream$ = new Subject();
  MockInstance(MyService, () => ({
    stream$,
  }));
  const fixture = MockRender(MyComponent);

  stream$.next(true); // bir mock yayılımı.
  fixture.detectChanges();
});
```

`MockInstance` davranışı özelleştirmenin sırasındaki en sonuncusudur ve `MockProvider`, `MockBuilder.mock` ve `ngMocks.defaultMock` sonrasında uygulanacaktır.

Daha fazla bilgi için `MockInstance` ile ilgili bölüme gözatabilirsiniz.

---

## MockService

`MockService` - bir sınıfın mock örneğini oluşturmak gerektiğinde faydalıdır ve bu sınıf deklarasyonlara veya sağlayıcılara ait değildir.

**Bir mock nesne** `MockService` tarafından üretilmiş olan, orijinal sınıfına dayanmaktadır ve şunları sağlar:

- tüm yöntemler boş (dummy)
- tüm özellikler getter ve setter'lar aracılığıyla bağlanmıştır (bazı durumlarda çalışmayabilir, bu durumda `ngMocks.stub` kullanın)
- `otomatik casus` ortamını dikkate alır

Örneğin, gerçek kopyasında `inputElement` özelliğine sahip olan bir mock bileşenimiz var ve bu özellik bir örneği [`HTMLInputElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) içeriyor. Diğer bir bileşen, `this.viewChildRef.inputElement.focus()` gibi onu `focus` yapmaya çalışıyor ve bir diğeri `blur` yapmak istiyor vb. Ancak, testlerimizde bu aramalar sadece **yan etkiler**, bunları bastırmak istiyoruz.

`MockService` bu durumda parlıyor. Çünkü bu özelleştirme diğer testlerde de faydalı olabilir, bunu `ngMocks.defaultMock` aracılığıyla tanımlayalım. Ayrıca, isteğe bağlı ikinci parametresi, ekstra özelleştirme için örneğin bir dilim alır.

```ts title="src/test.ts"
ngMocks.defaultMock(MyComponent, () => ({
  inputElement: MockService(HTMLInputElement, {
    tagName: 'DIV',
  }),
}));
```

Artık, `MyComponent` mock nesnesi her gerektiğinde, `inputElement` HTMLInputElement mock nesnesi olacak ve tüketicileri güvenle `.focus()`, `.blur()` ve diğer yöntemleri çağırabilir.

---

## Özet

Bölümü özetlemek gerekirse:

- `ngMocks.defaultMock` - deklarasyonların ve sağlayıcıların mock'larını **küresel** olarak özelleştirir.
- `MockProvider` - deklarasyonların ve sağlayıcıların mock'larını **süreçlerde** özelleştirir.
- `MockInstance` - deklarasyonların ve sağlayıcıların mock'larını **testlerde** özelleştirir.
- `MockService` - her türlü sınıftan **mock nesneleri oluşturur**.

Özelleştirmenin önceliği:

- İlk çağrılar `ngMocks.defaultMock` için gider.
- İkinci çağrılar `MockProvider` ve `MockBuilder.mock` için gider.
- Son çağrı ise `MockInstance` için gider.