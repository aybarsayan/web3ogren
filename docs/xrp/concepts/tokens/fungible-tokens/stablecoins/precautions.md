---
title: Stabilcoin Önlemleri
seoTitle: Stabilcoin Güvenlik Önlemleri için Rehber
sidebar_position: 4
description: XRP Ledgerde sabit paraların transferi sırasında dikkate alınması gereken önemli güvenlik önlemleri ve en iyi uygulamalar.
tags: 
  - stabilcoin
  - XRP Ledger
  - güvenlik
  - ödemeler
  - yapılandırma
  - izleme
  - dolandırıcılık
keywords: 
  - stabilcoin
  - XRP Ledger
  - güvenlik
  - ödemeler
  - yapılandırma
  - izleme
  - dolandırıcılık
---

# Stabilcoin Önlemleri

> XRP Ledger'a yapılan ve alınan ödemelerin işlenmesi doğal olarak bazı risklerle birlikte gelir. — XRPL Güvenlik Kılavuzu

XRP Ledger'a yapılan ve alınan ödemelerin işlenmesi doğal olarak bazı **risklerle** birlikte gelir, bu nedenle bir ihraççının bu süreçleri uygularken dikkatli olması gerekir. Bir stabilcoin ihraççısı olarak, aşağıdaki önlemleri göz önünde bulundurmalısınız.

## Altyapı

:::tip
Her XRP Ledger işletmesi kendi XRP Ledger sunucularını çalıştırmalıdır.
:::

Kendi güvenliğiniz ve ağın kararlılığı için, her XRP Ledger işletmesi `kendi XRP Ledger sunucularını` çalıştırmalıdır, bunlar arasında bir `doğrulayıcı` da bulunmalıdır.

## Araç Güvenliği

XRP Ledger'da bir işlem gönderdiğinizde, bu işlem **gizli anahtar**ınızla imzalanmalıdır. Gizli anahtar, XRP Ledger adresiniz üzerinde tam kontrol sağlar. Gizli anahtarınızı başka birinin çalıştırdığı bir sunucuya asla göndermeyin. Ya kendi sunucunuzu kullanın ya da işlemleri **yerel olarak** bir istemci kütüphanesi kullanarak imzalayın. Güvenli yapılandırmalar için talimatlar ve örnekler için `Güvenli İmzalama Yapılandırması` sayfasına bakın.

XRP Ledger'a bağlanmak için ihtiyaçlarınıza ve mevcut yazılımınıza bağlı olarak kullanabileceğiniz birkaç arayüz vardır:

- `HTTP / WebSocket API'leri`, tüm ana XRP Ledger işlevselliğine düşük seviyeli bir arayüz olarak kullanılabilir.
- `İstemci Kütüphaneleri`, XRP Ledger'a erişim için kullanışlı araçlar sağlayan birkaç programlama dilinde mevcuttur.
- [xApps](https://xumm.readme.io/docs/xapps) gibi diğer araçlar da mevcuttur.
- Üçüncü taraf cüzdan uygulamaları da, özellikle bekleme adreslerinden sorumlu insanlar için faydalı olabilir.

> **Dikkat:** Yalnızca resmi dağıtım kanallarından saygın araçlar kullanmaya dikkat edin. Kötü niyetli sunucular, kütüphaneler veya uygulamalar, gizli anahtarları bir saldırgana sızdırmak için yapılandırılabilir.

## XRP Ledger'dan Ödemeler

XRP Ledger'dan ödeme alırken, *bir ödemenin kesin olup olmadığını tanımak ve müşteriyi doğru miktarla kredi vermek önemlidir*; böylece süreçleriniz ve entegrasyon yazılımınız kötüye kullanılamaz. Detaylar ve yaygın tuzaklar için `Ödemeleri Güvenli Bir Şekilde İzleme` sayfasına bakın.

Beklenmeyen veya istenmeyen bir ödeme alırsanız, standart uygulama onu gönderen kişiye iade etmektir. Ek maliyetlere yol açmadan bunu nasıl yapacağıyla ilgili detaylar için `Ödemeleri İade Etme` sayfasına bakın.

XRP Ledger'dan bir ödeme işlemeye başlamadan önce, müşterinin kimliğini bildiğinizden emin olun. Bu, kimliği belirsiz saldırganların sizi dolandırmasını zorlaştırır. Birçok **kara para aklama** karşıtı düzenleme bunun gereğini zaten zorunlu kılar. Bu özellikle önemlidir çünkü XRP Ledger'dan para gönderen kullanıcılar, ilk olarak XRP Ledger'daki parayı alanlardan farklı olabilir. Daha fazla bağlam için `Stabilcoin Uyum Rehberleri` sayfasına bakın.

---

## XRP Ledger'a Ödemeler

XRP Ledger'a ödeme gönderirken, fazla ücret ödememek ve dolambaçlı yolları önlemek için en iyi uygulamaları izleyin. Detaylar için `Müşterilere Ödemeleri Gönderme` sayfasına bakın.

Dış sistemlerden, örneğin banka havaleleri veya kredi/banka kartı ödemeleri gibi ödemeleri kabul ediyorsanız, geri alınabilir yatırımlara karşı kendinizi koruduğunuzdan emin olun. XRP Ledger ödemeleri geri alınamaz, ancak birçok diğer dijital ödeme geri alınabilir. Dolandırıcılar, siz XRP Ledger ödemesi gönderdikten sonra XRPL dışı bir işlemi iptal ederek fiat paralarını geri almak için bunu kötüye kullanabilirler.

Ayrıca, güç kesintileri veya ağ arızaları gibi nadir durumlarda bile XRP Ledger işlemlerinizin nihai sonucunu bildiğinizden emin olmak için `Güvenilir İşlem Gönderimi yönergelerini` takip edin.

---

## Diğer Önlemler

- XRP Ledger içindeki yükümlülüklerinizi ve bakiyelerinizi takip edin ve bunları teminat hesabınızdaki varlıklarla karşılaştırın. Eğer uyumsuzluk varsa, çekim ve yatırımları işlemenizi durdurun.
- **Belirsiz durumlardan kaçının.** Tüm adreslerinizde uygun ayarları yapılandırmak, yanlış adresden tokenler ihraç etme veya kullanıcıların paralarını yanlış yere gönderme gibi durumlardan kaçınmanıza yardımcı olur. Öneriler için `Stabilcoin Yapılandırması` sayfasına bakın.
- Şüpheli veya kötüye kullanımlara karşı izleme yapın. Örneğin, bir kullanıcı, bir hizmet reddi saldırısı olarak XRP Ledger'dan sürekli olarak para gönderip alabilir ve bu, bir operasyonel adresin bakiyesini etkili bir şekilde boşaltabilir. Şüpheli davranışa karışan müşteri adreslerini, XRP Ledger ödemelerini işlemeyerek askıya alın.