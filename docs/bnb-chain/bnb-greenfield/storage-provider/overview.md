---
title: Genel Bakış - BNB Greenfield SP
description: Bu makale, BNB Greenfield Depolama Sağlayıcısı'nın işleyişini, mimarisini ve kullanıcılar için sağladığı avantajları detaylı bir şekilde açıklamaktadır. Ayrıca, özelleştirilmiş gereksinimlerin nasıl uygulanacağına dair bilgiler sunmaktadır.
keywords: [BNB, Greenfield, Depolama Sağlayıcısı, API, Mimari, Özelleştirme, Blok Zinciri]
---

# Genel Bakış

## Greenfield Depolama Sağlayıcısı Nedir

Depolama Sağlayıcısı (SP), depolama hizmetleri için bir altyapı sağlayıcısıdır. Greenfield doğrulayıcıları ile birlikte çalışarak tam bir depolama hizmeti sunarlar. **Doğrulayıcılar**, konsensüs ile meta verileri ve finansal defterleri depolarken, SP'ler gerçek verileri (yük verileri) Greenfield zincirini defter ve tek gerçek kaynak olarak kullanarak depolar. SP'ler, kullanıcıların ve dApp'lerin Greenfield'de verilerini yönetmeleri için bir dizi kullanışlı hizmet sunar.

## Greenfield Depolama Sağlayıcıları Nasıl Çalışır

SP'ler öncelikle kendi `Hizmet Payı`nı Greenfield blok zincirine yatırarak kayıt olmalıdır. Greenfield doğrulayıcıları daha sonra SP'leri seçmek için bir yönetişim prosedürü uygulayarak oy kullanacaklardır. Ağa katıldıklarında veya çıktıklarında, SP'lerin kullanıcılar için veri yedekliliğini sağlamak amacıyla belirli eylemleri takip etmesi gerekmektedir; aksi takdirde `Hizmet Payı` üzerinde ceza ile karşılaşacaklardır.

:::tip
**Öneri:** SP'ler, kullanıcıların veri yüklemesine, indirmesine ve yönetmesine olanak tanıyan halka açık API'ler sunarlar.
:::

Bu API'ler, mevcut geliştiricilerin onlar için kod yazmasını kolaylaştırmak amacıyla **Amazon S3 API'lerine** benzer şekilde tasarlanmıştır. SP'ler, kullanıcı taleplerini yazma (yükleme) ve okuma (indirme) sürecine yanıt vermekten, ayrıca kullanıcı izinlerini ve kimlik doğrulamalarıyla ilgilenmekten sorumludur.

Her SP kendi yerel tam düğümünü sürdürür; bu, Greenfield ağı ile güçlü bir bağlantı sağlar. Bu, SP'nin durumsal değişiklikleri doğrudan izleyebilmesini, verileri doğru bir biçimde dizine alabilmesini, zamanında işlem talepleri gönderebilmesini ve yerel verileri doğru bir şekilde yönetebilmesini sağlar.

SP'leri yeteneklerini sergilemeye teşvik etmek ve yüksek kaliteli SLA ile profesyonel bir depolama sistemi sunmaları önerilmektedir; bu nedenle bilgilerini duyurmaları ve topluluğa kendilerini kanıtlamaları tavsiye edilir.

## Mimari

![sp-arch-flow](../../images/bnb-chain/bnb-greenfield/static/asset/05-SP-Arch.jpg)

Depolama Sağlayıcı Mimarisi

SP, aşağıda gösterilen on beş çekirdek modül içerir:

- **Gater**: SP için bir geçit işlevi görür, HTTP hizmetleri sağlar ve S3 protokolüne uyar. Kullanıcı taleplerine karşılık gelen görevleri oluşturur ve bunları SP içindeki diğer modüllere iletir. Gater, özelleştirmeye izin vermediği için, modüler dosyada tanımlanan bir arayüz yoktur.

- **Authenticator**: Kimlik doğrulaması doğrulama işlemlerinden sorumludur.

- **Approver**: Onay taleplerini işlemekten sorumludur, özellikle `MigrateBucketApproval` gibi.

- **Uploader**: Kullanıcı hesaplarından `PutObject` taleplerini yönetir ve yük verilerini ana SP'nin parça deposuna kaydeder.

- **Downloader**: Kullanıcı hesaplarından `GetObject` taleplerini ve Greenfield sistemindeki diğer bileşenlerden `GetChallengeInfo` taleplerini yönetmekten sorumludur.

:::warning
**Dikkat:** Her modülün işlevselliğini tam anlayabilmek için ilgili dökümantasyona başvurmanız önerilir.
:::

- **Executor**: Arka planda çalışan görevleri yönetir. Bu modül, `Manager` modülünden görevler talep edebilir, bunları yerine getirebilir ve sonuçları veya durumu `Manager`'a geri bildirebilir.

- **Manager**: SP'nin görev planlamasını yönetmekten ve diğer yönetim işlevlerinden, örneğin bucket göçü ve sp çıkış prosedürü gibi sorumludur.

- **P2P**: SP'ler arasında kontrol bilgisi etkileşimini yönetmekten sorumludur.

- **Receiver**: Ana SP'den veri alır, yük veri bütünlük hash'ini hesaplar, imzalar ve bunu Greenfield blok zincirinde mühürlenmek üzere ana SP'ye geri döner.

- **Signer**: Greenfield blok zincirindeki SP verilerini imzalamaktan sorumlu olup, tüm SP'nin özel anahtarlarını tutar. SP hesabının sıra numarası nedeniyle, tekil olmalıdır.

- **Metadata**: SP'deki meta bilgi için etkili sorgu arayüzleri sağlar. Bu modül, düşük gecikme ve yüksek performanslı SP gereksinimlerini karşılar.

- **BlockSyncer**: Greenfield blok zincirindeki blok bilgilerini kaydeder.

- **PieceStore**: Temel depolama sağlayıcılarıyla etkileşimi yönetir; örneğin, AWS S3, MinIO, OSS vb.

- **SPDB**: Arka planda çalışan işlerin tüm bağlamlarını ve SP'nin meta verilerini saklar.

- **BSDB**: Greenfield blok zincirinden gelen tüm olay verilerini saklar ve bunları SP'nin `Metadata` hizmetine sunar.

## Greenfield SP'de özelleştirilmiş gereksinimleri nasıl uygulayabilirsiniz

Kod seviyesinden, SP yalnızca bir uygulama katmanı değil, aynı zamanda kullanıcıların kendi ihtiyaçlarına göre kendi mantıklarını uygulamalarına olanak tanıyan `GfSp` adlı bir çerçeveye genişletilmiştir. Kullanıcılar belirli işlevleri uygulamak isterlerse, soyut arayüzlerde tanımlanan bu yöntemleri geçersiz kılabilirler. Kullanıcıların özelleştirilmiş gereksinimleri uygulamalarına gerek yoksa, `GfSp` varsayılan uygulamaları kullanacaktır. 

:::note
SP'lerin sağladığı avantajlar arasında **esneklik** ve **uyum sağlamadaki yetenek** bulunmaktadır.
:::

Dokuz önemli soyutlama katmanı vardır:

- [lifecycle](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/lifecycle): Hizmetleri yönetmek için iki soyut arayüz sağlar: `Service` ve `Lifecycle`, SP'de hizmetleri kontrol etmek ve yönetmek için.
- [module](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/module): GfSp'deki farklı modüllerle etkileşim kurmak için birden fazla soyut arayüz sağlar. Bu nedenle, kullanıcılar kendi gereksinimlerini karşılamak için ilgili yöntemleri uygulayabilirler.
- [consensus](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/consensus): Greenfield blok zincirinde veri sorgulamak için soyut arayüzler sağlar.
- [piecestore](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/piecestore): Temel depolama sistemleriyle etkileşim kurmak için kullanılır.
- [spdb](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/spdb): Arka plan görevlerini ve SP'nin meta verilerini saklamak için soyut arayüzler sağlar.
- [bsdb](https://github.com/bnb-chain/greenfield-storage-provider/blob/master/core/bsdb): SP'deki meta verileri sorgulamak için soyut arayüzler sağlar.
- [rcmgr](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/rcmgr): SP'deki CPU ve bellek kaynaklarını yönetmek için soyut arayüzler sağlar.
- [task](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/task): SP arka plan hizmetleriyle etkileşim kurmak için en küçük uint hakkında soyut arayüzler sağlar.
- [taskqueue](https://github.com/bnb-chain/greenfield-storage-provider/tree/master/core/taskqueue): Görev planlaması ve yürütülmesi hakkında soyut arayüzler sağlar.