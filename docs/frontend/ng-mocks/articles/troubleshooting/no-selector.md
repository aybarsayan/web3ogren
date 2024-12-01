---
title: 'Hatayı Düzeltme: Yönergenin Seçiciği Yok, Lütfen Ekleyin!'
description: Seçicileri olmayan bileşenleri ve yönergeleri Angularda nasıl test edeceğinize dair bir çözüm. Bu içerik, doğru yöntemlerle hata giderimine yardımcı olurken, gerekli adımları ve test yazımını da açıklar.
keywords: [Angular, hata düzeltme, test etme, MockBuilder, bileşen, yönlendirme]
---

Bu sorun, bir modülün bir seçiciye sahip olmayan bir bildirim (genellikle bir üst sınıf) ithal ettiği anlamına gelir. Böyle yönergeler ve bileşenler, üst sınıflar henüz süslenmemişse bir [göç](https://angular.io/guide/migration-undecorated-classes) sırasında oluşturulmaktadır.

:::info
**Doğru çözüm**, bu bildirimleri modüllerden kaldırmaktır, yalnızca nihai sınıflar burada belirtilmelidir.
:::

Onları bir nedenle kaldıramıyorsanız, örneğin, bu bir üçüncü taraf kütüphaneyse, 
`MockBuilder` ve onun `.exclude` özelliğinin kullanımını içeren testler yazmanız gerekmektedir.

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, MyModule)
    .exclude(ParentDirective);
});
```

> Bu, modülün bildirimlerini düzeltir ve hatayı çözer, bir seçiciye sahip olmayan bir yönerge modül tanımından kaldırılmıştır.  
> — **Test Yazımında Dikkat Edilmesi Gerekenler**

## Ekstra Bilgiler


Üçüncü Taraf Kütüphaneler İçin Öneriler

- Üçüncü taraf kütüphanelerini kullanırken, hangi bileşenlerin ve yönlendirmelerin eklendiğini dikkatlice izleyin.
- Bileşenlerin güncellemeleri için kütüphane belgelerini inceleyin.

 

--- 

**Dikkat Edilmesi Gerekenler:**
- Bu hatalar, geliştirme sürecinde sıkça karşılaşılabilir, ve doğru bir yaklaşımla hızlıca düzeltilebilir.  
- Test süreçlerini entegre etmek, projenin kaliteli ilerlemesini sağlar.