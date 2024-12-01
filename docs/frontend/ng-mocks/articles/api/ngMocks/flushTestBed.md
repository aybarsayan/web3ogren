---
title: ngMocks.flushTestBed
description: ng-mocks kütüphanesindeki ngMocks.flushTestBed hakkında belgeler. Bu içerik, ngMocks.flushTestBed fonksiyonunun nasıl çalıştığını ve kullanım örneklerini detaylandırmaktadır. Okuyucular için kapsamlı bilgiler sunmaktadır.
keywords: [ngMocks, flushTestBed, TestBed, Angular, test, unit testing, mocking]
---

`ngMocks.flushTestBed`, TestBed'in başlatılmasını temizler.

:::tip
`ngMocks.flushTestBed` metodunu, testlerinizin temiz bir başlangıç yapmasına olanak sağlamak için kullanın. Bu, birden fazla testin ardından TestBed'deki önbelleği temizlemek için faydalıdır.
:::

> "TestBed, Angular uygulamalarında test yapmak için güçlü bir yapı sağlar."  
> — Angular Belgeleri

## Kullanım

`ngMocks.flushTestBed` fonksiyonunu çağırarak TestBed'in durumunu sıfırlayabilirsiniz. Örnek bir kullanım aşağıdaki gibidir:

```javascript
beforeEach(() => {
  ngMocks.flushTestBed();
});
```

:::info
Bu metodu, her testten önce çağırarak tüm bağımlılıkları ve bileşenleri sıfırlayabilirsiniz. Bu, testlerinizin bağımsız çalışmasını sağlar.
:::

## Neden Kullanmalısınız?

- Test izolasyonu sağlar.
- Önceki testlerin etkisini ortadan kaldırır.
- Uygulama bileşenlerinin düzgün bir şekilde yeniden yüklenmesini temin eder.


Detaylı Bilgi

`ngMocks.flushTestBed` kullanımı, özellikle karmaşık uygulamalar için kritik öneme sahiptir. Testlerinizin doğru bir şekilde çalıştığından emin olmak için bu metodu entegre edin.



---