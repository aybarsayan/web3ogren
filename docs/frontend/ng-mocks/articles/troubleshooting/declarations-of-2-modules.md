---
title: 'Hatayı düzeltme: Tür, 2 modülün bildirimlerinin bir parçasıdır'
description: "Modüllerin bildirimi ile ilgili Angular testleri başarısız olduğunda bir çözüm. Bu kılavuz, mock modülleri ve TestBed yapılandırmaları ile ilgili yaygın sorunları ele alır ve çözümler sunar."
keywords: [Angular, TestBed, MockModule, MockBuilder, bileşen testi]
---

Eğer bu sorunla karşılaşırsanız, **büyük ihtimalle**, bir mock bildirimi içeren, genellikle bir mock modül, doğrudan `TestBed` modülünde bildirilmiş bir şeyi içermektedir.

Bir modülün, testimizde ihtiyaç duyduğumuz, örneğin yönlendirmeler gibi bildirimleri dışa aktardığını varsayalım. Aynı zamanda, bileşenimizin bağımlı olduğu, başka bildirimleri olan başka bir modülümüz var; bunu bir mock nesnesine dönüştürmek istiyoruz, ancak aynı zamanda, `TestBed` aracılığıyla olduğu gibi tutmak istediğimiz aynı modülü içermektedir.

```ts
TestBed.configureTestingModule({
  imports: [
    SharedModule,
    MockModule(ModuleWithServicesAndSharedModule),
  ],
  declarations: [
    ComponentToTest,
  ],
});
```

Sorun **açık**: mock modülü oluşturduğumuzda, `MockModule` kendi mock bağımlılıklarını kendi içinde oluşturarak `SharedModule` için bir mock sınıfı yaratır. Artık içe aktarılan ve mock bildirimleri 2 modülün parçasıdır.

:::tip 
Mock modül yüklemeleri sırasında dikkat edilmesi gereken en iyi uygulamalar: 
- Modüllerin doğru ve tutarlı bir şekilde içe aktarıldığından emin olun.
- Gerekirse, `MockBuilder` kullanarak daha karmaşık senaryoları yönetin.
:::

Bunu çözmek için, `MockModule`'a `SharedModule`'un olduğu gibi kalması gerektiğini bildirmemiz gerekiyor.

İyi ve kötü haberler var. Kötü haber, `MockModule`'un bunu desteklememesi, ama iyi haber, `ng-mocks`'ın böyle karmaşık bir durum için `MockBuilder` sunmasıdır. Tek görevimiz, `beforeEach` aşamasını, `MockModule` yerine `MockBuilder` kullanacak şekilde yeniden yazmaktır.

**Olası bir çözüm** şöyle görünebilir:

```ts
beforeEach(() => {
  return MockBuilder(MyComponent, ModuleWithServicesAndSharedModule)
    .keep(SharedModule);
});
```

Yapılandırma, `SharedModule` ve `ModuleWithServicesAndSharedModule`'a bağımlı olan `ComponentToTest`'in test edilmek istendiğini belirtir, ancak `SharedModule` olduğu gibi kalmalıdır.

--- 

Artık inşa sürecinde, `MockBuilder` `SharedModule`'u olduğu gibi tutacaktır, bu yüzden mock modülünün bir bağımlılığı olsa bile, bu 2 modülde aynı şeylerin bildirimlerinin yapılmasını önler.

Bunu nasıl kullanacağınıza dair daha ayrıntılı bilgiye, `MockBuilder` adlı bölümde ulaşabilirsiniz.