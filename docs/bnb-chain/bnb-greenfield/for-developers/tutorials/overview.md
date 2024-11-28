---
title: Genel Bakış - BNB Greenfield Eğitimleri
description: Bu bölüm, BNB Greenfield üzerinde dApp geliştirmek için yöntemler sunmaktadır. BSC üzerindeki akıllı sözleşmelerin yanı sıra SDK ve CLI ile etkileşim yollarını keşfedin. 
keywords: [BNB Greenfield, dApp, SDK, CLI, akıllı sözleşmeler, veri pazarı, merkeziyetsiz uygulamalar]
order: 1
---

# Genel Bakış: BNB Greenfield ile Merkeziyetsiz Uygulamalar (dApp'ler) Oluşturma

Bu bölümde, BNB Greenfield üzerinde dApp geliştirmek için iki ana yöntemi tanıtacağız: **BNB Akıllı Zincir (BSC)** üzerine dağıtılan akıllı sözleşmeleri kullanmak ve **Yazılım Geliştirme Kiti (SDK)** veya **Komut Satırı Arayüzü (CLI)** aracılığıyla BNB Greenfield ile doğrudan etkileşimde bulunmak.

## Veri Pazar Yeri Demo
Veri pazarı, kullanıcıların dijital yayınlar, bilimsel deney verileri ve belirli alan verileri dahil olmak üzere veri varlıklarını özgürce oluşturabileceği, listeleyebileceği, ticaretini yapabileceği ve satabileceği bir veri değişim platformudur.

### Demo Bağlantısı
- Ana Ağ: `https://marketplace.greenfield-sp.bnbchain.org/index.html`
- Test Ağı: `https://marketplace.greenfield-sp.bnbchain.org/bsc-testnet.html`

### Kaynak Kodu
- Ön Uç: `https://github.com/bnb-chain/greenfield-data-marketplace-frontend`
- Akıllı Sözleşmeler: `https://github.com/bnb-chain/greenfield-data-marketplace-contracts`

---

## BSC'de akıllı sözleşmeler ile geliştirme
BNB Greenfield ile dApp oluşturmanın birincil yöntemlerinden biri, akıllı sözleşmeleri BSC'ye dağıtmaktır. **Akıllı sözleşmeler**, aracılara ihtiyaç duymadan anlaşmaların yürütülmesini kolaylaştıran ve uygulayan otomatik programlardır.

:::tip
Akıllı sözleşmeleri kullanarak dApp geliştirmek için detaylı eğitimler ve örnekler `Akıllı Sözleşme dApp'leri Oluşturma` bölümünde bulunmaktadır.
:::

Bu bölümde, en popüler geliştirme çatıları olan **Solidity** ve **Truffle** kullanarak BSC üzerinde akıllı sözleşmeler oluşturma, dağıtma ve etkileşimde bulunma sürecini sizinle paylaşacağız.

---

## BNB Greenfield ile SDK ve CLI aracılığıyla etkileşimde bulunma
BNB Greenfield, akıllı sözleşmeler geliştirilmeden platform ile etkileşimde bulunmak için iki yerel uygulama seçeneği sunmaktadır:

### Yazılım Geliştirme Kiti (SDK)
Yazılım Geliştirme Kiti (SDK), BNB Greenfield'ın merkeziyetsiz depolama sistemi ile sorunsuz entegrasyon sağlayan güçlü bir araç, kütüphane ve API setidir. SDK, yalnızca SDK işlevselliğini kullanarak dApp'ler oluşturmanıza olanak tanır, **akıllı sözleşmeler geliştirme** gerektirmez. SDK ile verileri depolayabilir ve alabilir, erişim kontrollerini yönetebilir ve dApp'inizin verilerinin gizliliğini ve güvenliğini sağlamak için şifrelemeyi yönetebilirsiniz.

### Komut Satırı Arayüzü (CLI)
Komut Satırı Arayüzü (CLI), BNB Greenfield tarafından sağlanan bir diğer yerel uygulamadır ve platform ile doğrudan terminalden etkileşimde bulunmanıza olanak tanır. CLI, dosya yükleme, veri izinlerini yönetme ve depolama kullanımını izleme gibi temel görevleri verimli bir şekilde gerçekleştirmek için çeşitli komutlar sunar. SDK gibi, CLI'yi kullanmak akıllı sözleşme geliştirmeyi gerektirmez.

Aşağıdaki bölümlerde, her bir yerel uygulama hakkında daha fazla bilgi vererek adım adım rehberler, kod parçacıkları ve en iyi uygulamalar sunacağız; böylece **akıllı sözleşme geliştirmeye ihtiyaç duymadan** güçlü ve yenilikçi dApp'ler oluşturmanız için sizi yetkilendireceğiz.

:::note
Daha fazla bilgi ve detaylı talimatlar için `Yerel dApp'ler Oluşturma` bölümüne göz atabilirsiniz.
:::