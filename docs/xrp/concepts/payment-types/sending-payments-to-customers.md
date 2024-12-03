---
title: Müşterilere Ödeme Gönderme
seoTitle: XRP Ledgerda Müşterilere Ödeme Gönderme
sidebar_position: 4
description: Ödemeleri dikkatlice oluşturun ve kötü niyetli aktörleri bertaraf edin. Bu kılavuz, XRP Ledger üzerinden müşterilere ödeme gönderme sürecinde dikkat edilmesi gereken önemli noktaları vurgulamaktadır.
tags: 
  - XRP Ledger
  - ödeme gönderme
  - stabilcoin
  - güvenlik
  - transfer ücreti
keywords: 
  - XRP Ledger
  - ödeme gönderme
  - stabilcoin
  - güvenlik
  - transfer ücreti
---

## Müşterilere Ödeme Gönderme

Müşterilerinize XRP Ledger'a ödeme göndermek için otomatik bir sistem oluşturduğunuzda, ödemeleri dikkatlice oluşturduğunuzdan emin olmalısınız. Kötü niyetli aktörler, bir sistemi **daha fazla para ödemeye** kandırmanın yollarını sürekli olarak bulmaya çalışıyorlar.

Genellikle, stabilcoin gönderirken bir [Ödeme işlemi][] kullanırsınız. Bazı detaylar, tokenları ilk kez ihraç edip etmediğinize veya bir sıcak cüzdandan bir müşteriye transfer edip etmediğinize bağlı olarak farklılık gösterir. Dikkat edilmesi gereken noktalar şunlardır:

- Tokenın vericisi olarak ihraç adresinizi her zaman belirtin. Aksi takdirde, diğer adresler tarafından ihraç edilen aynı para birimini teslim eden yolları yanlışlıkla kullanabilirsiniz.
  
:::tip
**Ödeme risklerini azaltmak için her zaman ihraç adresinizin doğruluğunu kontrol edin.**
:::

- XRP Ledger'a ödeme göndermeden önce, ödemenin maliyetini bir kez daha kontrol edin. Operasyonel adresinizden bir müşteriye yapılan bir ödeme, hedef tutar artı belirlediğiniz herhangi bir transfer ücreti kadar maliyetli olmamalıdır.
  
- İhraç adresinizden yeni tokenlar ihraç ederken, `SendMax` alanını atlamalısınız. Aksi halde, kötü niyetli kullanıcılar ayarlarını düzenleyerek, sadece hedef `Amount` yerine tam `SendMax` miktarını ihraç etmenizi sağlayabilirler.

> **Önemli Nokta:** Tokenları _bir sıcak cüzdandan_ gönderirken, sıfırdan farklı bir transfer ücretiniz varsa `SendMax` belirtmelisiniz. 
> — XRP Güvenlik Kılavuzu

Bu durumda, `SendMax` alanını `Amount` alanında belirtilen miktar artı transfer ücreti kadar ayarlayın. (Hesaplamalarınızın hassasiyeti XRP Ledger'ınkilerle tam olarak uyuşmuyorsa, miktarı biraz yukarıda yuvarlamak isteyebilirsiniz.) Örneğin, `Amount` alanında 99.47 USD belirten bir işlem gönderdiğinizde ve transfer ücretiniz %0.25 ise, `SendMax` alanını 124.3375 veya 124.34 USD olarak yukarı yuvarlayarak ayarlamalısınız.

- `Paths` alanını atlayın. Bu alan, doğrudan ihraç eden birinden ya da gönderilen tokenlar ile alınan tokenların aynı para birimi kodu ve ihraç ediciye sahip olduğu sürece bir sıcak cüzdandan gönderirken gereksizdir; yani, aynı stabilcoin'dirler. 

:::info
**`Paths` alanı, `Çapraz Para Ödemeleri` ve daha uzun çok aşamalı (rippling) ödemeler için tasarlanmıştır.**
:::

Eğer yetersiz bir yol bulma işlemi gerçekleştirir ve yolları işleminize eklerseniz, ödemeniz doğrudan yol mevcut değilse başarısız olmak yerine daha pahalı dolaylı bir yoldan gidebilir; kötü niyetli kullanıcılar bunu da ayarlayabilirler.

- `tecPATH_DRY` sonuç kodunu alırsanız, bu genellikle ya müşterinin gerekli güven hattını henüz kurmadığını ya da ihraç edicinizin rippling ayarlarının doğru yapılandırılmadığını gösterir.

---

XRP Ledger üzerinde token ihraç etme konusunda detaylı bir eğitim için, stabilcoin ya da başka bir türde, `İlgili Token İhraç Etme` bağlantısına göz atın.

