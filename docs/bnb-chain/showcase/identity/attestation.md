---
title: Vitrin - BNB Onay Servisi
description: BNB Onay Servisi (BAS), BNB ekosisteminde bilgileri doğrulamak için oluşturulan bir altyapıdır. Kullanıcılar, onayları zincir üzerinde veya dışında bütünleştirerek veri gizliliğini ve erişim kontrolünü sağlar. Bu belge, BAS'ın temel bileşenlerini, onay türlerini ve kullanım alanlarını detaylandırmaktadır.
keywords: [BNB, onay servisi, veri doğrulama, Greenfield, blockchain]
---

# BNB Onay Servisi

## Onay nedir?
Onaylar, zincir üzerinde daha fazla güven oluşturmak için kullanılan yapılandırılmış veriler üzerindeki dijital imzalardır.

## BNB Onay Servisi (BAS)
[BNB Onay Servisi (BAS)](https://bascan.io/attestation), bilgileri doğrulamak için onay üretmek amacıyla BNB ekosisteminde kurulan bir altyapıdır. BAS, kullanıcıların zincir üzerinde veya dışında doğrulama yapmalarına yardımcı olurken, onayları Greenfield'da depolayarak sahipliklerini iddia etmelerine olanak tanır. Bu yaklaşım, veri gizliliğini ve erişim kontrolünü garanti eder.

:::info
BAS, rastgele onaylar oluşturmak için bir standart ve altyapı olarak hizmet vermektedir. Herkes, BAS'ta herhangi bir onayı ve onun çözücüsünü tanımlayabilir.
:::

BAS, zincir üzerinde/dışında onayların üretilmesini destekler ve off-chain onayları Greenfield'da depolayarak, kullanıcılar sahiplik kazanır, onay gizliliğini sağlar ve erişim kontrolünü uygular.

### BAS'ın Temel Bileşenleri
* [Şemalar](https://doc.bascan.io/core_concept/schema): Şema, veri formatını ve attest işlevi ile çözücüyü tanımlayan yapılandırılmış bir çerçevedir. Şemalar, hangi tür verilerin onaylanabileceğini ve bu verilerin nasıl sunulması gerektiğini belirler.

* [Onay](https://doc.bascan.io/core_concept/attestation): Onay, kullanıcının herhangi bir veriyi web3 ortamına aktarması için bir standart sağlar. BAS içerisinde, onaylar zincir üzerinde ve dışında oluşturulabilir.

* [Çözücü](https://doc.bascan.io/core_concept/resolver): Kullanıcı, onaylarına herhangi bir mantık eklemek için çözücüyü kullanabilir.

:::tip
Akıllı sözleşmeleri [buradan](https://github.com/bnb-attestation-service/bas-contract) kontrol edin.
:::

## Onay Türleri
Onaylar, ya zincir üzerinde ya da dışarıda yapılabilir. Zincir üzerindeki onaylar doğrudan BNBChain üzerinde depolanırken, dışarıdaki onaylar genellikle Greenfield gibi merkeziyetsiz depolama çözümlerinde bulunur. Her iki yöntem de kendine özgü avantajlara sahiptir ve seçim, büyük ölçüde kullanım durumunun özel gereksinimlerine bağlıdır.

:::note
Zincir üzerinde ve dışarıdaki onaylar arasındaki farkı [buradan](https://doc.bascan.io/core_concept/onchain_vs_offchain) öğrenin.
:::

### Zincir Üstü Onay Kaydı
Kullanıcılar, zincir üstü bir onayın yapısını [BASCAN](https://bascan.io/attestation) üzerinde açıkça görebilirler.

![Zincir Üstü](../../images/bnb-chain/showcase/img/onchain-attestation.png)

### Dışarıdaki Onay Kaydı
İşte dışarıda bir onay kaydı. Zincir üzerindeki kayıttan farklı olarak, bu onay kamuya açıktır ve sunucu bunun farkında değildir. Kullanıcılar onay URL'sini başkalarıyla paylaşarak verileri çözümlenebilir veya GreenField'a yayınlayabilir. Yayınlandığında veya GreenField'a sabitlendiğinde, durum simgesi "kamu"ya geçecektir.

![Dışarıdaki](../../images/bnb-chain/showcase/img/offchain-attestation.png)

## Onayın Kullanım Alanları

### KYC
Sıfır bilgi kanıtlarıyla birleştirilen BAS, [zkPass](https://bas.zkpass.org/) üçlü TLS ve sıfır bilgi (ZK) teknolojisini kullanarak kullanıcının gerçek dünya varlıkları veya eylemleri hakkında sıfır bilgi kanıtları oluşturur. Bu, verilerinizi aşırı paylaşmamanızı ve API yetkilendirmeleri gerektirmeden gizliliği sağlar. ZKPass, uygun maliyetli sıfır bilgi teknolojisini kullanan özel bir veri protokolüdür. Kullanım durumu hakkında daha fazla bilgi için bu [blogdan](https://medium.com/zkpass/zkpass-commits-4-million-zkp-tokens-for-bnb-chain-airdrop-alliance-rewards-87e5f32a9ee4) öğrenebilirsiniz.

### Geliştirici zincir üstü itibarı
[Aspecta ID](https://aspecta.id/) BAS ile entegre olarak geliştiricilerin başarıları ve faaliyetleri hakkında zincir üstü onaylar oluşturup doğrulamakta, dijital kimlik yönetiminde şeffaflık, güvenlik ve güven sağlayarak geliştirme yapmaktadır. 

> Bu ortaklık, Aspecta'nın geliştiricilerin beceri ve katkılarının değiştirilemez ve doğrulanabilir bir kaydını sunmasına olanak tanır ve AI ve blok zinciri ekosistemleri içinde birlikte çalışabilirliği ve güveni artırır. — Bu metin, kullanıcıların BAS'ı kullanarak kimliklerini doğrulamalarına olanak tanıdığını ifade etmektedir.

Kullanım durumu hakkında daha fazla bilgi için bu [blogdan](https://medium.com/@aspecta_id/bnb-chain-builder-economy-a-builder-community-consensus-to-boost-innovation-with-productivity-ba4d71af6021) öğrenebilirsiniz.