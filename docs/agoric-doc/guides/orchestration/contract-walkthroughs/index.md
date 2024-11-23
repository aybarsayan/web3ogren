---
title: Sözleşme İncelemeleri
---

# Sözleşme İncelemeleri

Bu bölüm, örnek Orkestrasyon akıllı sözleşmeleri hakkında ayrıntılı açıklamalar ve bilgiler sağlamak için tasarlanmıştır.

Bu bölümde, iki ana sözleşmeyi kapsayacağız:

1. **Varlık Transfer Sözleşmesi**: Basit ama sağlam ve güvenli bir şekilde çapraz zincir varlık transferini gösteren `send-anywhere` sözleşmesi için bir rehber.
2. **Unbond Sözleşmesi**: Unbonding ve likit stake sürecinin ayrıntılı bir incelemesi olup, çapraz zincir işlemlerini yönetme adımlarına ışık tutmaktadır.

Her inceleme, sözleşme kodunun ayrıntılı açıklamalarını içerecek ve Agoric platformunda akıllı sözleşme geliştirme mekanikleri ile en iyi uygulamalara dair bilgiler sağlayacaktır. Bu incelemelerin sonunda, Agoric’in araçlarını ve kütüphanelerini kullanarak sağlam ve verimli çapraz zincir akıllı sözleşmeleri oluşturma konusunda sağlam bir anlayışa sahip olmalısınız.

## Varlık Transfer Sözleşmesi

"Her Yere Gönder" sözleşmesi, blok zincirleri arasında varlıkların transferi için sağlam ve güvenli bir çözümdür. Bu sözleşme, aşağıdakileri garanti eder:

- Varlıklar, transfer edilmeden önce güvenli bir şekilde yerel bir hesapta tutulur.
- Şeffaflık ve hata izleme için detaylı kayıtlar tutulur.
- Sözleşme, başarısızlıklara karşı dayanıklıdır ve yerleşik geri alma mekanizmalarına sahiptir.
- Agoric’in Orkestrasyon araçlarını kullanarak, bu sözleşme çapraz zincir varlık transferlerini kolaylaştırmanın güvenli bir yolunu sunar.



## Unbond Sözleşmesi

Unbond Sözleşmesi, stake edilmiş varlıkların unbonding işlemi ve likit staking gerçekleştirme sürecine odaklanır. Ana konular şunlardır:

- Orkestratör kullanarak birden fazla zincir ile etkileşimde bulunma.
- Delegasyon ve undelegasyon mantığını uygulama.
- Asenkron işlemleri yönetme ve uzun süreli süreçlerin tamamlanmasını sağlama.

