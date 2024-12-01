---
title: 'Hata NG0300 Birden Fazla Bileşen, Etiket Adı ile Eşleşiyor Hatasını Nasıl Düzeltiriz'
description: 'Bu kılavuzda, Angular testleri sırasında karşılaşabileceğiniz Hata NG0300: Birden Fazla Bileşen, Etiket Adı ile Eşleşiyor hatasına çözüm yolları sunulmaktadır. Uygun taklit ve modül yapılandırmalarıyla hatayı nasıl gidereceğinizi öğrenin.'
keywords: [Angular, NG0300, bileşen hatası, test hileleri, MockBuilder]
---

Eğer testlerinizde `Hata NG0300: Birden Fazla Bileşen, Etiket Adı ile Eşleşiyor` ile karşılaşıyorsanız,  
bu, aynı bileşenin farklı modüller aracılığıyla bir şekilde içe aktarıldığı veya bildirildiği anlamına gelir.  
Genellikle, bunun **yanlış bir şekilde taklit edilen bir şeyin belirtisi** olduğunu söyleyebiliriz.

Aşağıdaki modülümüz olduğunu varsayalım:

```ts
@NgModule({
  imports: [Module1, Module2, Module3],
  declarations: [Component1, Component2, Component3],
  exports: [Component1, Component2, Component3],
})
exports class MainModule {}
```

Modül 3 bileşeni tanımlar ve 3 modülü içe aktarır.  
Bileşenler birbirlerini ve içe aktarılan modülleri yoğun bir şekilde kullanır.  
Ancak, testimizde yalnızca `Component2`'yi taklit etmek istiyoruz.

:::tip
`TestBed` konfigürasyonunu doğru ayarlamak, testlerin geçerli sonuçlar vermesi için kritik öneme sahiptir.
:::

Bu nedenle, `TestBed` şu şekilde görünebilir:

```ts
TestBed.configureTestingModule({
  imports: [
    MainModule,
  ],
  declarations: [
    MockComponent2, // aynı seçiciye sahip kendi taklidimiz
  ],
});
```

Görünüşte doğru gibi görünse de ve niyetimiz `Component2` yerine `MockComponent2`'yi bir geçersiz kılma olarak kullanmak olsa da,  
testler geçmeyecektir çünkü `MockComponent2` ve `Component2`, `component-2` etiket adını eşleştirir.

:::warning
`MockComponent2` ve `Component2` arasında etiket çakışması, testlerin başarısız olmasına yol açar.  
Bu nedenle modül yapılandırmanızı kontrol etmelisiniz.
:::

Buradaki çözüm, `Component2`'yi `MainModule`'da `MockComponent2` ile değiştirmektir,  
böylece `TestBed` hiç `Component2` ile karşılaşmaz.

Bunu yapmak için `MockBuilder.replace` kullanmalısınız:

```ts
beforeEach(() => {
  return MockBuilder(MainModule)
    .replace(Component2, MockComponent2);
});
```

Yukarıdaki tanım, `MockComponent2`'nin, `Component2`'nin önceden olduğu her yerde sunulduğu şekilde `MainModule`'u `TestBed`'de tanımlar.

Artık test, `Hata NG0300: Birden Fazla Bileşen, Etiket Adı ile Eşleşiyor` hatası vermeyecek.