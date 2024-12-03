---
title: XRP Ledger ve rippled Sunucusu
seoTitle: XRP Ledgerı Yöneten Temel Eşler Arası Sunucu
sidebar_position: 2
description: XRP Ledgerı yöneten temel eşler arası sunucu olan rippled hakkında bilgi. Kullanıcılar için sunucu kurmanın gerekliliği ve riskleri ele alınıyor.
tags: 
  - XRP Ledger
  - rippled
  - sunucu
  - Clio
  - ağ güvenliği
keywords: 
  - XRP Ledger
  - rippled
  - sunucu
  - Clio
  - ağ güvenliği
---

## Ağlar ve Sunucular

XRP Ledger'ı güçlendiren iki ana sunucu yazılımı türü vardır:

- Temel sunucu, `rippled`, işlemleri işleyen ve sonuçları üzerinde uzlaşan eşler arası ağı çalıştırır.
- API sunucusu, `Clio`, defterden veri almak veya sorgulamak için güçlü bir arayüz sağlar.

:::tip
Kendi sunucunuzu çalıştırmak, sistem üzerinde daha fazla kontrol ve güvenlik sağlar.
:::

İhtiyaçlarınıza bağlı olarak bu sunuculardan birinin veya her ikisinin örneklerini çalıştırabilirsiniz.

## Kendi Sunucunuzu Çalıştırma Nedenleri

Daha hafif kullanım senaryoları ve bireysel sunucular için genellikle ücretsiz [ortak sunucular][]a güvenebilirsiniz. Ancak, XRP Ledger'ı daha ciddi kullanmaya başladıkça, **kendi altyapınıza** sahip olmanın önemi artar.

> **Kendi sunucu sahibi olmanın avantajları:**
> — Güvenilirlik, iş yükü kontrolü ve bağımsızlık.

Kendi sunucularınızı çalıştırmak istemeniz için birçok neden var, ancak çoğu şu şekilde özetlenebilir: **kendi sunucunuza güvenebilirsiniz**, iş yükü üzerinde kontrol sahibisiniz ve ona erişiminizin ne zaman ve nasıl olacağına karar vermek için başkalarına bağımlı değilsiniz. Elbette, sunucunuzu kötü niyetli korsanlardan korumak için iyi bir ağ güvenliği uygulamanız gerekir.

Kullandığınız sunucuya güvenmeniz gerekir. Kötü niyetli bir sunucuya bağlanırsanız, birçok şekilde sizi istismar edebilir veya para kaybetmenize neden olabilir. Örneğin:

* Kötü niyetli bir sunucu, ödeme yapılmadığı halde sizin ödendiğinizi bildirebilir.
* Kendi karını garanti altına alırken en iyi teklifi sunmamak için ödeme yollarını ve döviz değişim tekliflerini seçici bir şekilde gösterebilir veya gizleyebilir.
* Eğer ona adresinizin gizli anahtarını gönderdiyseniz, sizin adınıza keyfi işlemler yapabilir ve hatta adresinizdeki tüm parayı transfer edip yok edebilir.

:::warning
Kötü niyetli sunuculara bağlanma riskine karşı dikkatli olmalısınız. 
:::

Ayrıca, kendi sunucunuzu çalıştırmak, önemli yönetici yalnızca ve yüksek yük gerektiren komutları çalıştırmanıza olanak tanıyan `yönetici erişimi` sağlar. Paylaşılan bir sunucu kullanıyorsanız, aynı sunucunun diğer kullanıcılarının sunucunun hesaplama gücü ile rekabet etmesi konusunda endişelenmeniz gerekir. WebSocket API'deki birçok komut sunucuya büyük bir yük getirebilir, bu nedenle sunucu, gerektiğinde yanıtlarını azaltma seçeneğine sahiptir. Başkalarıyla sunucu paylaşıyorsanız, her zaman en iyi sonuçları almayabilirsiniz.

Son olarak, bir doğrulayıcı sunucusu çalıştırıyorsanız, kamu ağına proxy olarak stok bir sunucu kullanabilirken, doğrulayıcı sunucunuzu yalnızca dış dünyaya stok sunucu aracılığıyla erişilebilen özel bir ağda tutabilirsiniz. Bu, doğrulayıcı sunucunuzun bütünlüğünü tehlikeye atmayı daha zor hale getirir.

## Sunucu Özellikleri ve Konuları


Daha Fazla Bilgi

İlgilendiğiniz konular hakkında daha fazla bilgi edinebilirsiniz.





