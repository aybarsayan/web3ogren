---
title: ngMocks.reset
description: ng-mocks kütüphanesinden `ngMocks.reset` ile ilgili dokümantasyon. Bu fonksiyon, `ng-mocks` kütüphanesinin önbelleğini sıfırlamak için kullanılır ve testlerde temiz bir başlangıç sağlar. Kullanımı, testlerinizi daha öngörülebilir hale getirmek için önemlidir.
keywords: [ngMocks, ng-mocks, önbellek sıfırlama, test, fonksiyon]
---

`ngMocks.reset`, `ng-mocks` kütüphanesinin önbelleğini sıfırlar.

:::tip
Bu fonksiyonu testlerinizi daha öngörülebilir hale getirmek için kullanabilirsiniz.
:::

> **Önemli Not:** `ngMocks.reset`, test sürecinde herhangi bir yan etkiyi önlemek amacıyla kullanılmalıdır.  
> — `ng-mocks` Ekibi

Aşağıdaki durumlarda `ngMocks.reset` kullanılması önerilir:

- Test alt yapınızı yeni bir duruma hazırlamak için.
- Daha önceki testlerin etkilerini temizlemek için.
- Testler arasında tutarlılığı sağlamak için.

---

### Kullanım Örneği

```javascript
describe('My Test Suite', () => {
  beforeEach(() => {
    ngMocks.reset();
  });

  it('should reset the mocks', () => {
    // Test kodu burada
  });
});
```


Ek Bilgiler

`ngMocks.reset` fonksiyonu, yalnızca `ng-mocks` kütüphanesi ile oluşturulmuş mock bileşenlerini etkiler. Gerçek bileşenler veya uygulama durumu üzerinde herhangi bir etkisi yoktur.

