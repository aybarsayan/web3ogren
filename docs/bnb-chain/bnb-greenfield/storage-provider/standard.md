---
title: Veri Servisi Kalite Standardı - BNB Greenfield SP
description: BNB Greenfield, merkeziyetsiz bir depolama ağı olan blok zinciri ve depolama sağlayıcılarını tanıtan bir standart sunmaktadır. Bu standart, kullanıcılara güvenilir ve yüksek kaliteli hizmet sağlamayı amaçlamaktadır. Detaylı açıklamalar ve minimum hizmet kalitesi standartları da dahil olmak üzere bilgi içermektedir.
keywords: [BNB Greenfield, blok zinciri, depolama sağlayıcıları, hizmet kalitesi, API standartları, veri dayanıklılığı, açık kaynak]
---

# Veri Servisi Kalite Standardı

## Öz

BNB Greenfield, blok zinciri ve depolama sağlayıcıları (SP'ler) olmak üzere iki katmandan oluşan merkeziyetsiz bir depolama ağını kapsamaktadır. BNB Greenfield blok zinciri, kullanıcılar için defterler tutar ve depolama meta verilerini ortak blok zinciri durum verisi olarak kaydeder. SP'ler, kuruluşlar veya bireyler tarafından sağlanan depolama hizmeti altyapılarına atıfta bulunur.

:::info
Bu standart, Greenfield üzerindeki SP'lerin kullanıcılar için **kurumsal düzeyde**, **güvenli**, **güvenilir** ve **yüksek kaliteli** depolama altyapısı ve hizmetleri sağlayabilmesini sağlamayı amaçlamaktadır.
:::

Standartları karşılayamayan SP'lerin ağdan uygunluk ve erişim hakları iptal edilebilir.

Standartlar iki bölümden oluşmaktadır:

* Minimum hizmet kalitesi standartları: Ana ağda SP'ler için çeşitli metriklerde minimum hizmet kalitesi ve tercih edilen gereksinimleri.
* Depolama sağlayıcı protokolleri: SP'lerin uygulaması gereken API ve P2P protokol ara birimleri.

Bu standartların yanı sıra, bu belge SP protokollerinin resmi bir uygulamasını tanıtacaktır. Topluluk geliştiricileri, resmi uygulamayı kullanarak:

* mevcut olarak Kubernetes dağıtımı ve AWS S3, OSS, MinIO, B2, Ali Lindorm gibi temel depolama çözümlerini destekleyen resmi uygulamayı doğrudan kullanabilir.
* resmi uygulamayı genişletebilir. Resmi çözüm başlangıçta modülerlik elde etmiştir. SP geliştiricileri, ihtiyaç duydukları modülleri değiştirebilir.
* kendi çözümlerini özelleştirmek için SP protokol belgelendirmesine atıfta bulunabilir.

## Minimum Hizmet Kalitesi Standartları

### Kapasite

* `2M/s uplink bant genişliği`: Bu, dosyaları yükleyen SP düğümleri için minimum bant genişliği gereksinimidir. SP düğümleri, dosyaları en az 2 megabit/saniye hızında istikrarlı bir şekilde yükleyebilmelidir.
* `20M/s downlink bant genişliği`: Bu, dosyaları sorgulayan SP düğümleri için minimum bant genişliği gereksinimidir. SP düğümleri, 20M/s indirme bant genişliği sağlayabilmelidir.
* 2 dosya/s: Bu, dosya yükleme kapasitesinde SP düğümleri için minimum gereksinimdir. SP düğümleri, her bir test dosyasının boyutunun 1M olabileceği şekilde en az 2 dosyayı saniyede istikrarlı bir şekilde yükleyebilmelidir.
* `1PB depolama kapasitesi`: SP'nin birkaç mikro hizmeti çalıştırması gerektiğinden, bu hesaplama kaynakları kaçınılmaz sabit maliyetler üretecektir. **SP yalnızca çok az bir depolama kapasitesi sağlarsa, karşılık gelen kârların bu sabit maliyetleri karşılaması zordur.** SP'nin depolama kapasitesinin sınırsız olmasını umuyoruz.

### Erişilebilirlik

* `99.9% SLA`: SLA burada SP API'sinin çalışma süresini ifade eder.
* `99.99% veri dayanıklılığı`: Veri dayanıklılığı, verilerin zamanla korunma ve sürdürülme yeteneğini ifade eder. **Verilerin kayba veya değişmeye karşı ne kadar kalıcı ve savunmasız olduğunu ölçen bir metrik.** Her SP'nin veri dayanıklılığı bu standardı karşılayabilirse, erasure coding kullanılarak ve farklı SP'ler arasında dağıtılan verilerin daha yüksek veri dayanıklılığı garantileri olacaktır.

Greenfield, erişilemez veya düşük kaliteli SP'leri meydan okuma mekanizmaları aracılığıyla cezalandıracaktır. SLA'sı %99.9'un altında veya veri dayanıklılığı %99.99'un altında olan SP'ler muhtemelen aşamalı olarak kaldırılacaktır.

:::warning
Greenfield'ın erken aşamalarında, daha az deneyimli SP'leri katılmaya teşvik etmek için, Greenfield, SP'leri bir saat içinde 1 BNB'den fazla kesintiye uğratmaktan korumak için nispeten gevşek bir kesinti mekanizması uygulayacaktır.
:::

### Ölçeklenebilirlik (olması daha iyi)

SP'leri, hizmet sağlayamama riskinden kaçınmak için minimum kapasitelerini sağladıkları temele dayalı olarak dinamik olarak kapasiteyi artırmaya teşvik ediyoruz. Ölçeklenme stratejisi, SP tarafından seçilen hesaplama kaynakları platformu ile ilgilidir. Bu konuda spesifik gereksinimler getirmiyoruz.

## Depolama Sağlayıcı Protokolleri

### HTTP RESTful API Spesifikasyonu

Greenfield Ağı API'sini desteklemek, depolama sağlayıcıları için gereklidir. Bu, kullanıcıların ve geliştiricilerin her SP düğümü ile birleştirilmiş bir arayüz üzerinden etkileşimde bulunmalarına ve entegrasyon yapmalarına olanak tanır, böylece farklı SP düğümlerinden gelen **özel arayüzlere uyum sağlama zorunluluğunu ortadan kaldırır** ve kullanıcı deneyimini ve geliştirme zorluğunu büyük ölçüde basitleştirir. API, depolama alanı bilgilerini alma, dosya yükleme ve indirme ile izinleri yönetme işlevlerini içerir.

> SP düğümleri, kendi teknolojilerine dayanarak ağ API'si ile uyum sağlama yeteneğine sahip olabilirler. Geliştiriciler, arayüz geliştirme için Greenfield Ağı'nın açık API belgelerine atıfta bulunabilirler. — Greenfield Ağı Belgeleri

### Evrensel Uç Nokta

Greenfield Ağı'ndaki tüm depolama nesneleri, evrensel bir kaynak tanımlayıcısı (URI) aracılığıyla tanımlanabilir ve erişilebilir. **Bir depolama nesnesi oluştururken, SP düğümü ağ kurallarına göre ona benzersiz bir URI atamak zorundadır ve bu URI kullanılarak nesneyi geri almak için destek sağlar.**

Ayrıntılı spesifikasyon [burada](https://github.com/bnb-chain/greenfield-whitepaper/blob/main/part3.md#231-universal-endpoint) tanımlanmıştır.

### Yetki Yöntemleri

İzin yönetimi ve kimlik doğrulama mekanizmaları, yalnızca yetkilendirilmiş kullanıcıların belirli depolama nesnelerine erişimini sağladığından merkeziyetsiz bir depolama ağı için gereklidir. Greenfield Ağı, standart izin bölümlerini ve yetkilendirme süreçlerini tanımlar ve SP düğümlerinin buna göre ayrıntılı izin kontrolü ve kullanıcı kimlik doğrulaması implementasyonunu gerektiren bir yapı sunar. SP en azından aşağıdaki üç kimlik doğrulama yöntemine ulaşmalıdır:

* `GNFD1-ECDSA`: Kullanıcıların kimlik doğrulama için bir özel anahtar kullanarak imza atmasını gerektirir.
* `GNFD2-EDDSA`: Web tabanlı uygulamalar ve kullanıcıların SP'lerde “off chain auth” EdDSA hesap anahtarını saklamaları için kullanılır. Kullanıcılar, çoğu etkileşim için açık bir imza olmadan SP ile iletişim kurabilir.
* `GNFD1-ETH-PERSONAL_SIGN`: Bu, bir web uygulamasından SP'de EdDSA hesap anahtarını kaydederken cüzdan kişisel imzasını doğrulamak için yalnızca kullanılır (örneğin, [https://dcellar.io](https://dcellar.io)).

## Açık Kaynak Uygulama

Açık kaynak depolama sağlayıcı çerçevesi, Greenfield depolama sağlayıcı API ve protokol spesifikasyonlarını uygular. **Bu, SP düğümü geliştiricileri için standartlaştırılmış arayüzler ve soyutlamalar sağlar ve bir depolama sağlayıcısı kurmanın zorluklarını büyük ölçüde azaltır.** Geliştiriciler, bu çerçeveye dayanarak SP'yi hızlı bir şekilde inşa edebilir ve iş ihtiyaçlarına göre ikincil geliştirme yapabilir. Bu, Greenfield Ağı'nın geliştirici ekosistemini beslemeye yardımcı olur ve daha fazla teknik ekibin Greenfield Ağı'nın inşasına katılmasını teşvik eder. Daha fazla ayrıntı için [GitHub repo](https://github.com/bnb-chain/greenfield-storage-provider) adresine başvurun.

### Arayüzler

* [Consensus](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/consensus/consensus.go): Greenfield uzlaşma verilerini sorgulamak için bir arayüzdür. Uzlaşma verileri doğrulayıcı, tam düğüm veya diğer off-chain veri hizmetlerinden gelebilir.
* [ResourManager](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/rcmgr/README.md): ResourceManager, kaynak yönetim alt sistemine yönelik bir arayüzdür. **ResourceManager, yığın içindeki kaynak kullanımını takip eder ve hesaplar ve uygulama ile iç kısımlar arasında kullanıcı yapılandırılabilir politikaya göre kaynak kullanımını sınırlamak için bir mekanizma sağlar.**
* [PieceStore](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/piecestore/piecestore.go): PieceStore, nesne yükü verilerini depolayan parça deposuna yönelik arayüzleri tanımlar.
* [PieceOp](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/piecestore/piecestore.go): PieceOp, parça anahtarı operatörü ve parça boyutu hesaplaması için bir yardımcı arayüzdür.
* [SPDB](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/spdb/spdb.go): SPDB, SP meta verisini kaydetmek için bir arayüzdür.
* [BSDB](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/store/bsdb/database.go): BSDB, Greenfield zincir meta verisini kaydetmek için bir arayüzdür.
* [TaskQueue](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/taskqueue/README.md): Task, SP arka plan hizmeti etkileşiminin en küçük birimi için bir arayüzdür. Görev zamanlaması ve yürütme, görev varış sırasıyla doğrudan ilişkilidir, bu nedenle görev kuyruğu, SP içindeki tüm modüllerin kullandığı **nispeten önemli bir temel arayüzdür.**

### Modüller

* [Approver](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): Approver, MigrateBucketApproval gibi onay taleplerini işlemek için bir modüldür.
* [Authorizer](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): Authorizer, yetki doğrulaması için bir modüldür.
* [Downloader](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): Downloader, kullanıcıların indirme taleplerini işlemeden ve sistemdeki diğer bileşenlerden meydan okuma bilgisi taleplerini almaktan sorumlu bir modüldür.
* [TaskExecutor](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): TaskExecutor, arka plan görevlerini işleyecek bir modüldür; Yönetici modülerinden görev alacak, görevleri işleyecek ve sonuçları veya durumu yöneticisine iletecektir, bunlar arasında: `ReplicatePieceTask`, `SealObjectTask`, `ReceivePieceTask`, `GCObjectTask`, `GCZombiePieceTask`, `GCMetaTask`.
* [Manager](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): Manager, görev zamanlaması ve SP'nin diğer yönetimi için sorumlu bir modüldür.
* [P2P](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): P2P, SP'ler arasındaki kontrol bilgisi etkileşimlerine dair bir modüldür; çoğaltılan parça onayını işler, onayları diğer SP'lere gönderir, yanıtları bekler ve en az onaylı sayı veya en fazla onaylı sayı tam zamanında geri döner.
* [Receiver](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): Receiver, ana SP'den parça verisi almak için bir modüldür, parça verisinin bütünlük hash'ini hesaplar ve imzalar, sonucu ana SP'ye geri döner.
* [Signer](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): Signer, SP'nin imza işlemlerini ve Greenfield zinciri operatörlerini işleyecek bir modüldür. SP'nin tüm özel anahtarlarını tutar. SP hesabının sıra numarasını dikkate alarak, bir singleton olmalıdır.
* [Uploader](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/module/README.md): Uploader, kullanıcıların yükleme taleplerini işlemek için bir modüldür ve bunu ana SP'nin parça deposuna kaydeder.

### Minimum Donanım Gereksinimi

* Kubernetes veya Kubernetes uyumlu platformlar önerilir.
* 10'dan fazla sanal makine, 4 çekirdek 8G özellik.
* 50GB+ SQL veritabanı.
* 1 Gbps ağ bağlantısı.

### İkincil Geliştirme Örnekleri

#### Arayüzü Özelleştirme

```go
// PieceStore arayüzünü uygulayan kendi ÖzelleştirilmişPieceStore örneğinizi oluşturun
pieceStore := NewCustomizedPieceStore(...)

// GfSp çerçeve uygulaması oluştur
gfsp, err := NewGfSpBaseApp(GfSpConfig, CustomizePieceStore(pieceStore))
if err != nil {
    return err
}

gfsp.Start(ctx)

// GfSp çerçevesi, varsayılan PieceStore'u ÖzelleştirilmişPieceStore ile değiştirecek
```

#### Modülü Özelleştirme

```go
// Approver arayüzünü uygulayan kendi ÖzelleştirilmişApprover örneğinizi oluşturun
// NewCustomizedApprover fonksiyon türünde olmalıdır: 
// func(app *GfSpBaseApp, cfg *gfspconfig.GfSpConfig) (coremodule.Modular, error)
approver := NewCustomizedApprover(GfSpBaseApp, GfSpConfig)

// Özel Modüler adı Önceden Tanımlı
gfspapp.RegisterModularInfo(model.ApprovalModularName, model.ApprovalModularDescription, approver)

// GfSp çerçeve uygulaması oluştur
gfsp, err := NewGfSpBaseApp(GfSpConfig, CustomizeApprover(approver))
if err != nil {
    return err
}

gfsp.Start(ctx)
// GfSp çerçevesi, varsayılan Approver'ı Özelleştirilmiş Approver ile değiştirecek
```

## Belgeler

* [Greenfield Beyaz Kitabı](https://github.com/bnb-chain/greenfield-whitepaper): Resmi Greenfield Beyaz Kitabı.
* `Greenfield`: Greenfield belgeleri.
* [Greenfield'deki Depolama Modülü](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/storage-module.md): Greenfield Zinciri'ndeki depolama modülü.
* [Greenfield'deki Depolama Sağlayıcı](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/storage-provider.md): Greenfield Zinciri'ndeki depolama sağlayıcı.
* [Veri Erişilebilirliği Mücadelesi](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/data-availability-challenge.md): SP'de saklanacak yükün doğruluğu.
* `Depolama Sağlayıcı Tanıtımı`: Greenfield Depolama Sağlayıcı belgeleri.
* `Depolama Sağlayıcı Derleme ve Bağımlılıklar`: SP derlemesi ve bağımlılıklarına dair ayrıntılı tanıtım.
* `Yerel Depolama Sağlayıcı Ağı Çalıştırma`: Test için yerel SP ortamını çalıştırma tanıtımı.
* `SP Ağına Katılma`: Test ağı veya ana ağda SP ağına katılma tanıtımı.