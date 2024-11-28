---
title: Showcase - Merkezi Olmayan Kimlik
description: Merkezi olmayan kimlik, bireylerin ve varlıkların dijital dünyada tanımlanmasını ve doğrulanmasını sağlayan bir sistemdir. Bu içerik, merkezi olmayan kimliğin avantajlarını ve kullanım durumlarını kapsamlı bir şekilde ele almaktadır.
keywords: [merkezi olmayan kimlik, dijital kimlik, DID, kriptografi, blok zinciri, kimlik doğrulama, veri güvenliği]
---

# Merkezi Olmayan Kimlik

## Merkezi Olmayan Kimlik Nedir?

Kimlik, dijital ve fiziksel dünyalarda bireyleri ve varlıkları ayırt etme ve doğrulama aracı olarak hizmet eder.

**Dijital Kimlik**:

* Çevrimiçi kişilikleri, hesapları ve dijital sertifikaları içerir.
* Kullanıcı adları, parolalar ve diğer kimlik doğrulama yöntemleriyle doğrulanır.
* Kimlik ve güvenlik için elektronik veriler ve kriptografik yöntemlere dayanır.

**Merkezi Olmayan Tanımlayıcı (DID)**:

* Bireyler, şirketler, nesneler vb. için yarı-anonim bir tanımlayıcıdır.
* Sadece anahtar sahibinin sahipliği doğrulayabildiği bir özel anahtarla korunur.
* Farklı aktiviteler arasında takip edilmemeyi sağlamak için birden fazla DID'ye izin verir.
	* Örnek: Oyun için bir DID, kredi raporlaması için bir başka DID.

### Merkezi olmayan kimlikler nasıl güvence altına alınır?

Merkezi olmayan kimlikleri güvence altına almanın önemli bir boyutu **kriptografidir**. Kriptografide, özel anahtarlar yalnızca sahipleri tarafından bilinirken, genel anahtarlar geniş bir şekilde dağıtılmaktadır. Bu eşleme iki ana amaca hizmet eder. İlk olarak, kimlik doğrulamasını sağlar; bu, genel anahtarın, bir mesajın karşılık gelen özel anahtarın sahibi tarafından gönderildiğini doğrulamasını sağlar. İkinci olarak, şifrelemeye olanak tanır ve yalnızca eşlenen özel anahtarın sahibinin, genel anahtar ile şifrelenmiş bir mesajı deşifre edebilmesini garanti eder.

:::note
**Önemli Not**: Kriptografi, merkezi olmayan kimliklerin güvenliğini sağlamak için kritik bir bileşendir.
:::

## Merkezi olmayan kimliğin faydaları

* **Artan Bireysel Kontrol**: Kullanıcılar, merkezi otoriteler veya üçüncü taraf hizmetlere güvenmeden kimlik bilgileri üzerinde daha fazla kontrol sahibi olurlar.
* **Güven Dışı Doğrulama**: Kullanıcı kimliğini doğrulama ve yönetme sürecini güven dışı, kesintisiz ve gizliliği koruyan bir yöntemle kolaylaştırır.
* **Blok Zinciri Teknolojisi**: Taraflar arasında güven oluşturmak için blok zincirini kullanır ve onayların geçerliliği için kriptografik garantiler sağlar.
* **Kimlik Verilerinin Taşınabilirliği**: Kimlik verileri taşınabilir; kullanıcılar onayları ve tanımlayıcıları bir mobil cüzdanda saklayabilir ve istedikleri herhangi bir tarafla paylaşabilirler; bu, ihraç eden kuruluşun veritabanından bağımsızdır.
* **Sıfır Bilgi Teknolojileri ile Uyumluluk**: Bireylerin detayları açıklamadan sahipliği veya eylemleri kanıtlamasına olanak tanıyan sıfır bilgi kanıtlarını destekler; bu, oylama gibi uygulamalar için güven ve gizliliği artırır.

:::tip
**İpuçları**: Merkezi olmayan kimliklerin hızlı entegrasyonu için, kullanıcıları bilgilendiren eğitim programları oluşturulmalıdır.
:::

## Merkezi Olmayan Kimlik Kullanım Durumları

| Sektör       | Geleneksel Süreç                                          | Problemler/Riskler                                           | Doğrulanabilir Kimlik Çözümü                                 |
| ------------ | ---------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| Tedarik zinciri | Uygunluğu kanıtlamak için fiziksel kimlikler ve belgeler kullanır, bu da verimsizliklere neden olur. | Belgeler kolayca sahte olabilir ve doğrulaması zordur. Manuel doğrulama süreci yavaş ve hata payı yüksektir. Onaylanmamış ve uygun olmayan tıbbi malzemeler piyasaya girebilir, kamu sağlığını tehlikeye atabilir. | Doğrulanabilir Kimlikler, değiştirilemez ve ihraç edene ulaşmadan anında doğrulanabilir; zaman ve maliyetleri büyük ölçüde azaltır. |
| Finans       | Finansal hizmetlere erişmek için bireylerin kişisel bilgileri fiziksel olarak sunarak uygunluk taramasından geçmesi gereklidir; bu bilgiler büyük veritabanlarında saklanır ve KYC ve kredi kontrolleri için birden fazla üçüncü tarafla paylaşılır. | Bireylerin verilerinin güvenliği, paylaşımı ve üçüncü taraflarca erişimi üzerinde kontrolleri yoktur. | Kimlik bilgileri kriptografik olarak güvence altına alınmıştır, değiştirilmesi mümkün değildir ve doğrulanabilir; veri bütünlüğü ve güvenliği sağlar. |
| Sağlık hizmetleri | İşverenler, sağlık hizmeti sağlayıcıları için kağıt tabanlı lisansları ve sertifikaları manuel olarak doğrularlar. | Geleneksel doğrulama süreçleri haftalar veya aylar sürer, bu da kritik sağlık hizmeti pozisyonlarının doldurulmasını geciktirir. | Tıbbi lisanslar düzenleyici kuruluşlar tarafından dijital kimlikler olarak verilebilir ve sağlık hizmeti sağlayıcılarının bu lisansları kolayca paylaşmalarına olanak tanır; böylece hastaneler, klinikler veya çalışacakları tıbbi bölümler tarafından anında doğrulanabilir. |