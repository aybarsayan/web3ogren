---
title: Angular testlerinde herhangi bir sınıfın sahte örneğini nasıl alırsınız
description: Angular testlerinde sınıfları ve nesneleri ng-mocks yardımıyla nasıl sahte hale getireceğiniz hakkında bilgiler. Bu kılavuzda, MockService ile sahte nesneler oluşturmanın yollarını keşfedin ve özelleştirilmiş davranışları uygulayın.
keywords: [Angular, test, sahte nesne, MockService, ng-mocks, HTMLInputElement, özelleştirme]
---

:::warning
Eğer burada **bir servisi** veya **bir token’ı** sahte hale getirmek için bulunuyorsanız, lütfen `MockProvider ile ilgili bölümü` okuyun.

Eğer varsayılan sahte davranışını değiştirmek istiyorsanız, lütfen `sahte nesneleri nasıl özelleştirirsiniz` bölümünü okuyun.
:::

Eğer **Angular bildirilerine ait olmayan bir sınıfın** sahte nesnesine ihtiyacınız varsa, örneğin `HTMLInputElement`, lütfen **devam edin**.

**Angular testlerinde bir sınıfın sahte örneği**, `MockService` fonksiyonu ile oluşturulabilir. Sahte örnek, orijinal sınıfla aynı yöntemlere sahiptir, fakat bunların hepsi boş metodlardır. Ayrıca, `MockService`, istenen örneğin şekliyle birlikte, özelliklerini ve yöntemlerini özelleştirmek için kabul edilir.

> **Not:** Bu durum, bir sınıfın onlarca yöntemi olduğunda ve biz bunlardan birkaçının davranışını değiştirmek istediğimizde faydalıdır. 

```ts
const i1 = MockService(MyClass);
// i1.method() undefined döner

const i2 = MockService(MyClass, {
  method: () => 'Kendi Özel Davranışım',
});
// i2.method() 'Kendi Özel Davranışım' döner
```

## Basit örnek

Bir servisin `HTMLInputElement` döndüren bir yöntemi olduğunu varsayalım, ancak servisi `HTMLInputElement` ile beraber sahte hale getirmek istiyoruz, çünkü `TargetComponent` `ngOnInit` içinde `this.htmlService.input.focus()` gibi `focus()` yöntemini çağırıyor.

```ts
TestBed.configureTestingModule({
  declarations: [TargetComponent],
  providers: [
    // kazanç
    MockProvider(HtmlService, {
      input: MockService(HTMLInputElement),
    }),
  ],
});
```

:::tip
Sahte nesneleri oluştururken, mevcut metotları ve özellikleri kolayca özelleştirmeyi unutmayın. Bu, testlerinizin daha efektif olmasını sağlar.
:::