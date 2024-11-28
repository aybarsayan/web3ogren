---
title: Basit Depolama Hizmeti - BNB Greenfield Veri Depolama
description: Bu belge, Greenfield Basit Depolama Hizmeti'nin ana özelliklerini, depolama yönetimi, izin yönetimi, kova ve nesne kavramlarını vurgulamaktadır. Geliştiricilere Web2 ile karşılaştırılabilir bir API sunarak veri depolama çözümleri sağlamaktadır.
keywords: [Greenfield, Basit Depolama, Veri Yönetimi, İzin Yönetimi, Kova, Nesne, DApp]
---

# Basit Depolama Hizmeti

Greenfield Basit Depolama Hizmeti, geliştiricilere Web2'de en çok kullanılan AWS S3 bulut depolama ile karşılaştırılabilir API temel bileşenleri ve depolama modelleri sunar.

## Özellikler

### Depolama Yönetimi

Greenfield, kaynaklarınızı (kova, nesneler ve gruplar gibi) yönetmek için kullanabileceğiniz depolama yönetimi özelliklerine sahiptir. Tüm kaynakların meta verileri zincirdedir ve yalnızca greenfield blok zincirine yapılan işlemlerle değiştirilebilir.

- **Temel İşlemler** - Kova, nesne ve gruplar için Oluştur, Sil, Güncelle, Sil, Al ve Listele
- **Kova Göçü**(**WIP**) - Kullanıcılar, tek bir işlemle kovalarını diğer Birincil Depolama Sağlayıcıya (PrimarySP) kolayca taşıyabilir. Daha fazla bilgi için lütfen [Kova Göçü](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/virtual-group.md#bucket-migration-workflow) sayfasını inceleyin.

Daha fazla bilgi için [Depolama Modülü Tasarımı](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/storage-module.md) sayfasına göz atın.

### İzin Yönetimi

Greenfield Sağlayıcıları, kova ve nesneleriniz üzerindeki izinleri yönetmek için özellikler sunar. Varsayılan olarak, Greenfield kovaları ve içindeki nesneler özel olarak ayarlanmıştır. Sadece oluşturduğunuz kaynaklar üzerindeki izinlere sahipsiniz. Kaynaklarınızın özel kullanım durumlarını destekleyen ayrıntılı izinleri vermek için aşağıdaki özellikleri kullanabilirsiniz:

- **Mülkiyet** - Kova sahibi, kendi kovasındaki her nesnenin mülkiyetini alır.
- **Halk Erişimi** - Eğer kova veya nesne halka açık olarak ayarlanmışsa, herkes buna erişebilir ancak değiştiremez.
- **Kaynak Tabanlı Politika** - Sahibi, kovası ve içindeki nesneleri için kaynak tabanlı izinleri yapılandırabilir.

Daha fazla bilgi için [İzin Modülü Tasarımı](https://github.com/bnb-chain/greenfield/blob/doc-refactor/docs/modules/permission.md) sayfasını inceleyin.

## Anahtarlar

### Kova

Greenfield'de, bir kova nesneleri depolamak için sanal bir konteynırdır. Kullanıcılar, her kovaya, DNS adlandırma kurallarına uygun, bir veya daha fazla etiketin nokta ile ayrıldığı benzersiz bir isim vermelidir. **Kova adının, iki kovanın aynı ismi paylaşmaması için Greenfield ad alanında küresel olarak benzersiz olması kritik öneme sahiptir.** İşte Greenfield için kova adı kuralları:

- Kova adı, 3 (minimum) ile 63 (maksimum) karakter uzunluğunda olmalıdır.
- Kova adı yalnızca küçük harfler, rakamlar, noktalar (.) ve tireler (-) içermelidir.
- Kova adı bir harf veya rakamla başlamalı ve bitmelidir.
- Kova adı, iki ardışık nokta içermemelidir.
- Kova adı, bir IP adresi formatında olmamalıdır (örneğin, 192.168.5.4).

Bir kova oluşturulduğunda, nesneler `gnfd` komut satırı veya `SDK'lar` gibi çeşitli yöntemlerle bu kovaya yüklenebilir. Bir kovadaki nesneler, klasörler gibi düzenlenebilir ve yönetilebilir (aynı zamanda "ön ekler" olarak da adlandırılır). Ayrıca, her nesne için diğer nesnelerden ayırt etmek amacıyla benzersiz bir anahtar (bir dize değeri) atamak mümkündür.

Her kullanıcı hesabı, birkaç kova oluşturabilir. Hesap, kovaların "sahibi" olacaktır.

Her kova, kendi Birincil SP'si ile ilişkilendirilmelidir ve Okuma ve Depolama işlevleri için ödeme hesaplarıyla bağlantılı olmalıdır. Sahip olanın adresi varsayılan ödeme hesabı olacaktır.

### Nesne

Bir nesne, Greenfield'deki temel depolama birimidir ve veriden ve onunla ilişkili olan meta verilerden oluşan bir dosyayı temsil eder. **Her nesne, bir kova içinde nesne adı (bir dize değeri) ile benzersiz olarak tanımlanır.** İşte Greenfield için nesne adı kuralları:

- Nesne adı, 1 (minimum) ile 1024 (maksimum) karakter uzunluğunda olmalıdır.
- Nesne adı yalnızca UTF-8 karakterleri içermelidir.
- Nesne adı "./", "../", "//", ".." veya "\\" içermemelidir.
- Nesne adı "/" olmamalıdır.
- Nesne adı, SQL enjeksiyon saldırıları için kullanılabilecek kalıplardan arındırılmalıdır.

Nesneler genellikle dosyaları depolamak için kullanılsa da, metin, resimler, videolar ve program ikili dosyaları gibi her türlü veriyi içerebilir.

Kullanıcılar, Greenfield'e nesneleri çeşitli yöntemlerle, `gnfd` komut satırı ve `SDK'lar` ile yükleyebilir. Ayrıca benzer bir şekilde nesneleri indirebilir, kopyalayabilir veya taşıyabilirler.

Greenfield'deki nesneler aşağıdaki gibi çeşitli önemli özelliklere sahiptir:
- ad ve ID
- sahibi
- barındırıldığı kova
- boyut ve zaman damgaları
- içerik tipi
- depolama parçaları için kontrol toplamları
- depolama durumu
- ilişkili SP bilgileri

Nesne meta verileri, anahtarın ön eki olarak kova adı ile birlikte saklanır. Aynı kova altında tüm nesneleri yinelemek mümkündür, ancak birçok nesneye sahip büyük bir kova için bu zor bir iş olabilir.

### Grup

Grup, aynı izinlere sahip hesapların bir koleksiyonudur. İşte Greenfield için grup adı kuralları:

- Grup adı, 3 (minimum) ile 64 (maksimum) karakter uzunluğunda olmalıdır.
- Grup adı yalnızca UTF-8 karakterleri içermelidir.

Grup adı, aynı kullanıcı altında birden fazla kez kullanılamaz. Ancak bir grup, herhangi bir kaynağı oluşturamaz veya sahip olamaz. Bir grup başka bir grubun üyesi de olamaz.

Bir kaynağın, izinler için sınırlı sayıda grupla ilişkili olmasına izin verilir. **Bu, zincir üzerindeki izin kontrolünün sabit bir süre içinde tamamlanmasını sağlar.**

### Grup Üyesi

Grup Üyesi, bir grupla ilişkilendirilmiş bir hesap anlamına gelir. **Bir grup üyesi birden fazla gruba eklenebilir.** Grup Üyesi'nin bir sona erme süresi vardır ve bu grup sahibi tarafından belirlenir. Süre sona erdikten sonra grup üyesi grupta kalacaktır, ancak izinleri iptal edilecektir.

### Kaynak Tabanlı Politika

Kullanıcı, Kaynak Tabanlı Politika kullanarak diğer hesaplara izin verebilir. Kovalar, nesneler ve gruplar gibi herhangi bir kaynak birden fazla politika ile ilişkilendirilebilir. Ancak yalnızca kaynak sahibi, sahip olduğu bir kaynağa iliştirilen bir politika koyabilir.

- Bir kovaya iliştirilen bir politika, alıcının kova veya belirli nesneler üzerinde işlem yapmasına izin verebilir.
- Bir nesne/grup ile ilişkilendirilen bir politika yalnızca nesne/grup üzerinde işlem yapmasına izin verebilir.

Kaynak tabanlı politikada, kullanıcı yeşil kaynak adlarını (GRNS) ve diğer değerleri kullanarak bir alt küme nesnelere izin verebilir. Örneğin, **kullanıcı yalnızca ortak bir önek ile başlayan veya belirli bir uzantı, örneğin `.html` ile biten nesnelere erişim izni verebilir.**

## Yaşam Döngüsü

Verilerinizi Greenfield'de depolamak için, kullanıcıların kova ve nesneler olarak bilinen kaynaklarla çalışması gerekir. Kova, nesneler için bir konteynırdır ve nesne, dosya ve bu dosyayı tanımlayan herhangi bir meta veridir.

Bir nesneyi Greenfield'de depolamak için, kullanıcı bir kova oluşturur ve ardından nesneyi o kovaya yükler. **Nesne kovada bulunduğunda, açılabilir, indirilebilir ve taşınabilir.** Kullanıcı, bir nesneye veya bir kovaya artık ihtiyaç duymadığında, kaynaklarını temizleyebilir.

### Kova

- Oluştur: Kullanıcılar, `CreateBucket` işlemlerini blok zincirine gönderir ve ilgili meta veriler zincir üzerinde oluşturulur.
- Güncelle: Kullanıcılar, `UpdateBucketInfo` işlemini blok zincirine göndererek, ödeme hesapları ve kontenjan gibi Kova ile ilgili meta verileri değiştirebilir.
- Sil: Kullanıcılar, `DeleteBucket` işlemlerini blok zincirine göndererek kovayı silerler, ancak kovadaki tüm nesnelerin silindiğinden emin olmalıdırlar.
- Göç: Kullanıcılar, kovanın taşınması için `MigrateBucket` işlemlerini blok zincirine gönderir ve ilgili kova hedef SP'ye taşınır.

### Nesne

- Oluştur: Kullanıcılar, `CreateObject` işlemlerini blok zincirine gönderir ve ilgili meta veriler zincir üzerinde oluşturulur. **Nesne Oluşturuldu durumu içindedir.**
- Oluşturma İptali: Kullanıcılar, nesneyi iptal etmek için `CancelCreateObject` işlemlerini blok zincirine gönderir ve ilgili meta veriler zincir üzerinde silinir.
- Güncelle: Kullanıcılar, `UpdateObjectInfo` işlemini blok zincirine göndererek nesne ile ilgili meta verileri, örneğin görünürlük, üzerinde değiştirebilir.
- Yükle: Kullanıcılar, SP ile etkileşimde bulunmak ve birincil SP'ye veri yüklemek için `PutObject RESTful API` kullanabilir.
- Mühürle: Birincil SP ve ikincil SP'ler kullanıcı verilerini depoladıktan sonra, Birincil SP, bir `SealObject` işlemi gönderir ve nesnenin durumu Mühürlü olarak güncellenir; **bu, nesnenin başarıyla yüklendiğini ve harici erişime açıldığını gösterir.**
- Mühürleme Reddet: Birincil SP, `RejectSealObject` işlemlerini blok zincirine göndererek nesnenin mühürlenmesini herhangi bir nedenle reddedebilir ve ilgili meta veriler zincir üzerinde silinir.