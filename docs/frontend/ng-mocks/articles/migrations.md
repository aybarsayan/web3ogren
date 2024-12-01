---
title: ng-mocks'ın en son sürümüne nasıl güncellenir
description: ng-mocks'ın en son sürümüne güncelleme sürecinde dikkate alınması gereken kritik değişiklikler. Bu kılavuz, güncelleme süresi boyunca dikkat etmeniz gereken önemli noktaları ve önerileri sunmaktadır.
keywords: [ng-mocks, Angular, güncelleme, MockBuilder, test, hata, bağımlılıklar]
sidebar_label: En son sürüme güncelleniyor
---

Genellikle, `ng-mocks`'ın en son sürümünü herhangi bir `Angular 5+ uygulaması` ile kullanabilirsiniz.

Aşağıda kritik değişiklikleri bulabilirsiniz. Bunlar büyük sürümlerde gerçekleşir.

Eğer talimatlara rağmen bir sorunla karşılaşırsanız, lütfen bize `ulaşın`.

## 17'den 18'e

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.

## 16'dan 17'ye

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.

## 15'ten 16'ya

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.

## 14'ten 15'e

### `test.ts`

Küresel yapılandırma ve `ngMocks.autoSpy` gibi özellikleri kullanmak istiyorsanız,  
`test.ts` dosyasını projenize geri eklemeniz gerekir: [Ng-mocks'ı taze bir Angular 15 projesine nasıl ekleyebilirim?](https://stackoverflow.com/questions/75320328/how-to-add-ng-mocks-to-a-fresh-angular-15-project/75323651#75323651)

### `RouterOutlet`

Eğer `RouterModule`'ü `MockRender(RouterOutlet)` kullanarak test ettiyseniz, `MockRender`'a boş parametreler eklemeniz gerekir:

```ts
const fixture = MockRender(RouterOutlet, {});
```

## 13'ten 14'e

`MockBuilder` daha katı hale gelir ve yanlış yapılandırmalar için hata vermeye başlar.  
Eğer `MockBuilder` metodunu 2 parametre ile çağırırsanız ve bağımlılıklar için zincir kullanıyorsanız:

```ts
beforeEach(() => {
  return MockBuilder(Declaration, ItsModule)
    .keep(Dep1)
    .mock(Dep2);
});
```

`MockBuilder` hata verir  
eğer `Dep1` veya `Dep2` 'nin `ItsModule` ve onun ithalatlarında bir yerde içe aktarılmadı veya beyan edilmediyse.

:::warning
Bu, bağımlılıklarınızdan birinin kaybolduğuna dair sizi bilgilendirmek için yapıldı.  
Yani, eğer bir geliştirici `Dep2`'yi `ItsModule`'den çıkardıysa, üretim yerine CI sırasında hata alırsınız.
:::

Bu durum önerilmemekle birlikte, bunu `console.warn` yapabilir veya devre dışı bırakabilirsiniz.  
Bunu yapmak için, `ng-mocks` yapılandırmanızı `src/test.ts`, `src/setup-jest.ts` veya `src/test-setup.ts` dosyalarında değiştirin:

```ts
ngMocks.config({
  onMockBuilderMissingDependency: 'warn', // veya 'i-know-but-disable'
});
```

Genellikle, `Dep1` veya `Dep2`'ye ihtiyacınız vardır, bu da `ItsModule` içinde içe aktarılmamıştır,  
bunlar dış bağımlılıklar olduğunda, `MatDialogRef` veya `ActivatedRoute` gibi.  
Bu durumda, bunları `MockBuilder` parametrelerine açıkça ekleyin, zincir yöntemleri yerine:

```ts
beforeEach(() => {
  return MockBuilder(
    // Korunması ve dışa aktarılması gereken şeyler.
    [Declaration, Dep1, MatDialogRef], // MatDialogRef'yi sağlamak ve korumak
    // Taklit edilmesi ve dışa aktarılması gereken şeyler.
    [ItsModule, Dep2, ActivatedRoute], // ActivatedRoute'yi sağlamak ve taklit etmek
  );
});
```

Lütfen dikkat edin, eğer `MockBuilder` metodunu 0 veya 1 parametre ile çağırırsanız, tüm zincirleme bağımlılıklar  
şimdi TestBed'e eklenir ve varsayılan olarak dışa aktarılır:

```ts
// Hata vermez, TestBed'de Declaration, MatDialogRef, Dep2 ve ItsModule'e erişim sağlar.
beforeEach(() => {
  return MockBuilder(Declaration)
    .mock(ItsModule)
    .keep(MatDialogRef)
    .mock(Dep2);
});

// Hata vermez, TestBed'de Declaration, Dep1, ActivatedRoute ve ItsModule'e erişim sağlar.
beforeEach(() => {
  return MockBuilder()
    .keep(Declaration)
    .mock(ItsModule)
    .keep(Dep1)
    .mock(ActivatedRoute);
});
```

## 12'den 13'e

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.

## Herhangi bir eski sürümden 12.4.0'a

:::tip
`jest` için bir düzeltmenin birleştirilmesiyle ilgili sorunlar nedeniyle, `12.4.0` sürümünde bir kırılma değişikliği vardır.  
Eğer `MockInstance` metodunu `beforeAll`, `beforeEach` veya `it` içinde kullanıyorsanız,  
ve otomatik sıfırlamaya güveniyorsanız, o zaman ekstra yapılandırma yapmanız gerekir.
Daha fazla bilgi için `ng-mocks nasıl yüklenir` ve `MockInstance.scope` bölümlerine bakın.
:::

## 11'den 12'ye

**Tek kırılma değişikliği** `auto-spy` dir.

`ngMocks.autoSpy('jasmine')` ve `ngMocks.autoSpy('jest')`  
`import 'ng-mocks/dist/jasmine';` ve `import 'ng-mocks/dist/jest';` yerine kullanılmalıdır.

## 11.10'dan 11.11 ve üstü

Eğer `MockRender` ile "TestBed'i boş bırakmayı unuttunuz?" hatası alıyorsanız,  
onu düzeltmek yerine bastırmak isteyebilirsiniz, oysa ki düzeltmek doğru yoldur.

Hatanın bastırılması için, en az `12.0.1` sürümüne yükselmeniz ve `test.ts` dosyasına eklemeniz gerekir:

```ts
ngMocks.config({
  onTestBedFlushNeed: 'warn',
});
```

Böylece hata vermek yerine, `MockRender` bunları konsolda uyarı olarak kaydedecektir.

## 10'dan 11'e

#### MockModule

Artık tüm taklit içe aktarmaları ve taklit bildirimlerini dışa aktarmıyor,  
ancak modüllerin dışa aktarımlarına saygı gösteriyor.  
Hikaye, `8'den 9'a `MockBuilder.mock` için güncelleme` ile aynıdır.

Eğer onları dışa aktarmanız gerekiyorsa,  
etkilenen testlerin `MockBuilder` veya `ngMocks.guts` ile taşınmasını düşünmelisiniz.

#### MockHelper

`MockHelper`, `ngMocks` olarak yeniden adlandırıldı, lütfen belgelerini kontrol edin.

#### MockComponent

Öncelikle, `meta` parametresini kabul ediyordu, şimdi kaldırıldı.

Eğer bu işlevselliği kullanıyorsanız, lütfen `bize ulaşın`.

#### Tokenlar

- `NG_GUARDS` artık `NG_MOCKS_GUARDS` olarak yeniden adlandırıldı
- `NG_INTERCEPTORS` artık `NG_MOCKS_INTERCEPTORS` olarak yeniden adlandırıldı

## 9'dan 10'a

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.

## 8'den 9'a

#### MockModule'den `MockBuilder.mock`'a

`MockModule` tüm içe aktarmaları ve bildirimleri dışa aktarır,  
ve `MockBuilder.mock` modüllerin dışa aktarımlarına saygı gösterir.

Bu davranış, bir modülün beyanının değişmesi durumunda testlerin başarısız olmasına neden olabilir,  
ve bu, artık bir bağımlılığı dışa aktarmıyorsa. Benzer şekilde, bir Angular uygulaması da başarısız olurdu.

## 7'den 8'e

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.

## 6'dan 7'ye

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.

## 5'ten 6'ya

**Özel bir durum yok.**  
Güncelleme sorunsuz olmalıdır.