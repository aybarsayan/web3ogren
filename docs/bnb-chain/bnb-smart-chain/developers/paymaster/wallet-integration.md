---
title: Paymaster Cüzdan Entegrasyonu - BSC Paymaster
description: Bu kılavuz, cüzdan geliştiricilerinin kullanıcıları için gaz ücreti sponsorluğu sağlayan paymaster hizmetlerini entegre etme adımlarını vurgulamaktadır. Cüzdanlar, çoklu paymaster sağlayıcıları arasında kesintisiz, gazsız işlemler sunmak için gereken standartları ele almaktadır.
keywords: [paymaster, cüzdan entegrasyonu, gaz ücreti, işlemler, güvenli işlemler]
---

# Cüzdan Entegrasyonu

Bu kılavuz, cüzdan geliştiricilerinin kullanıcıları için gaz ücreti sponsorluğu sağlayan paymaster hizmetlerini entegre etme adımlarını vurgulamaktadır. Bu standartlara uyarak, cüzdanlar çoklu paymaster sağlayıcıları arasında kesintisiz, gazsız işlemler sunabilir.

## Etkileşim İş Akışı

![wallet-paymaster](../../../images/bnb-chain/bnb-smart-chain/img/paymaster-wallet.png)

Entegrasyon, paymaster hizmetleri ile etkileşimde bulunmak için işlem oluşturma ve gönderme sürecini değiştirmeyi içerir. Paymaster API arayüzü hakkında daha ayrıntılı bilgi için lütfen bu `belgeye` başvurun.

### Ana adımlar şunlardır:

1. **İşlem Hazırlığı**:
    *   Bir kullanıcı işlem başlattığında, önce `gm_sponsorable` çağrısını yaparak sponsorluğa uygun olup olmadığını kontrol edin.
    *   Eğer sponsorlanabilir ise, işlemin gaz fiyatını sıfıra ayarlayın.
2. **Kullanıcı Bildirimi**:
    *   Kullanıcıya işlemin gazsız olacağını ve API tarafından döndürülen "politika adı" ile sponsorlandığını bildirin.
3. **İşlem İmzalama**:
    *   Kullanıcının sıfır gaz fiyatlı işlemi imzalamasını sağlayın.
4. **Paymaster'a Gönderim**:
    *   İmzalanan işlemi `eth_sendRawTransaction` kullanarak paymaster'a gönderin.
5. **Yanıtın İşlenmesi**:
    *   Paymaster'ın yanıtını işleyin:
        *   Eğer başarılı ise, kullanıcıya işlemin gönderildiğini bildirin.
        *   Eğer başarısız ise, normal işlem işleme yöntemine geri dönmeyi veya kullanıcıya başarısızlık hakkında bilgi vermeyi değerlendirin.
6. **İşlem İzleme**:
    *   İşlem durumunu her zamanki gibi izleyin.

## En İyi Uygulamalar

:::tip
Gaz fiyatını değiştirmeden önce her zaman sponsorlanabilirliği kontrol edin.
:::

:::info
Sponsorluk durumu hakkında kullanıcıya net geri bildirim sağlamak önemlidir.
:::

1. Sponsorluk durumu hakkında kullanıcıya net geri bildirim sağlayın.
2. Sponsorluk başarısız olduğunda uygun hata işlemesi uygulayın.
   
:::warning
Sponsorlanmamış işlemler için geri dönüş mekanizmalarını değerlendirin.
:::