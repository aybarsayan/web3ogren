---
title: ngMocks.globalExclude
description: ng-mocks kütüphanesinden ngMocks.globalExclude hakkında dokümantasyon. Bu içerik, sahte modüller oluştururken hariç tutulması gereken beyanlar, servisler ve token'lar hakkında bilgi sağlar.
keywords: [ngMocks, globalExclude, sahte modüller, TestBed, Angular testleri]
---

`ngMocks.globalExclude`, **sahte modüller** oluştururken **hariç tutulması gereken beyanları**, servisleri ve token'ları işaretler.

Bunu yapmak için en iyi yer `jasmine` için `src/test.ts` veya `jest` için `src/setup-jest.ts` / `src/test-setup.ts` dosyasıdır.

:::tip
Bazılarını `TestBed.initTestEnvironment` içinde sağladığımızda faydalıdır; bu nedenle, orijinal olanları beyan eden veya içe aktaran bir şey olsa bile, bu sürümleri testlerde almak isteriz.
:::

Bir `TranslationModule`'a sahip olduğumuzu ve bunu testlerde kullandığımız gibi, ancak bir sahte arka uçla kullanmak istediğimizi hayal edelim. Aynı zamanda, bunu yeniden oluşturmak için **her testte ayarları tekrarlamaktan** kaçınmak istiyoruz.

Bu nedenle, bunu `initTestEnvironment` ile yapılandırabiliriz, ancak bir sorun var. Testlerde `TranslationModule`'ı içe aktaran bir modül getirirsek, o zaman `initTestEnvironment` etkisi aşırı yüklenir.

Etkisini korumak için, sahte işlem sırasında `TranslationModule`'ı hariç tutmamız gerekir. İşte bu noktada `ngMocks.globalExclude` devreye giriyor.

```ts title="src/test.ts"
@NgModule({
  imports: [TranslationModule.forRoot(mockBackend)],
  exports: [BrowserDynamicTestingModule, TranslationModule],
})
class TestEnvModule {}

getTestBed().initTestEnvironment(
  TestEnvModule,
  platformBrowserDynamicTesting(),
);

ngMocks.globalExclude(TranslationModule);
```

> Artık `MockModule(ModuleWithTranslationModule)` çağrısı yaptığımızda, `TranslationModule` nihai sahte modülden hariç tutulacak ve dolayısıyla `initTestEnvironment`'dan gelen sürüm kullanılacaktır.  
> — ngMocks Dokümantasyonu