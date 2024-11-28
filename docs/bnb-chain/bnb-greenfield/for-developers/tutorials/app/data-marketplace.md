---
title: MindPress Veri Pazarı Tanıtımı - BNB Greenfield
description: MindPress Veri Pazarı, BNB Akıllı Zinciri ve BNB Greenfield üzerinde çalışan bir demo platformudur. Geliştiricilere, merkeziyetsiz ticaret ve içerik yönetimi sunarak kullanıcı deneyimini geliştirme imkanı tanır.
keywords: [MindPress, BNB Greenfield, veri pazarı, blok zinciri, merkeziyetsiz ticaret]
---

# MindPress Veri Pazarı Tanıtımı

### 1. Genel Bakış

[MindPress Veri Pazarı](https://testnet-marketplace.mindpress.io), BNB Akıllı Zinciri ve BNB Greenfield depolama zincirleri üzerinde oluşturulmuş bir demo'dur. **BNB Greenfield'in** en son sürümünü (V1.6&V1.7) kullanarak, görüntü ticareti senaryosunu bir örnek olarak kullanarak çapraz zincir programlanabilirlik, delege yükleme ve sponsor tarafından ödenen depolama ücretleri gibi özelliklerini sergilemektedir. Bu özellikler sayesinde, geliştiriciler BNB Zincir ekosistemine dayalı, harika bir kullanıcı deneyimi ve depolama, ticaret ve içerik izin yönetimi gibi kapsamlı işlevler sunan bir web3 merkeziyetsiz ticaret platformu oluşturabilir, bu da proje geliştirmeyi ve pazarlamayı hızlandırır.

### 2. Özellikler

Bir görüntü stoğu olarak, satıcılar fotoğrafları yükleyebilir ve satışa sunabilir, alıcılar ise beğendikleri görselleri arayabilir, satın alabilir ve orijinal dosyaları indirebilir.

_Satıcı_

- **B objeleri (örneğin, görseller) BNB Greenfield'e yükleme:** Satıcılar bir kerede birden fazla görseli BSC ağı altında BNB Greenfield'e yükleyebilir.
- **Objeleri BNB Akıllı Zincirinde listeleme:** Satıcılar yükledikleri görselleri BSC ağı üzerinde satışa sunabilir ve alıcılara indirme/görüntüleme izinleri satmaya başlayarak para kazanabilir.
- **Objeleri listeden kaldırma:** Satıcılar görsellerini pazardan kaldırabilir.

_Alıcı_

- **Objeleri arama:** Alıcılar isim ve kategori kimliği ile objeleri arayabilirler.
- **Objeleri satın alma:** Alıcılar objeleri satın alabilir ve indirme/görüntüleme izni alabilir.
- **Objeleri indirme:** Alıcılar satın aldıkları objeleri indirebilir/görüntüleyebilir.

### 3. Greenfield V1.6&1.7 güncellemeleri sonrası faydalar

|  |  |
| -- | -- |
| # |Önce | Sonra | Kod | İlgili Greenfield Özellikleri |
| Ağ Değişimi | ❌ Kullanıcılar objeleri yüklemek ve ticaret işlemlerini gerçekleştirmek için BNB Greenfield ve BNB Akıllı Zincir arasında geçiş yapmak zorundadır. | ✅Ağ değişikliği yok: Kullanıcılar BSC ağı üzerindeki tüm işlemleri tamamlayabilir. | [https://github.com/bnb-chain/greenfield-cosmos-sdk/pull/417](https://github.com/bnb-chain/greenfield-cosmos-sdk/pull/417) | [BEP-361: Greenfield'da off-chain kimlik doğrulamayı basitleştirme](https://github.com/bnb-chain/BEPs/pull/361)[BEP-363: Greenfield çapraz zincir programlama yeteneğini geliştirme](https://github.com/bnb-chain/BEPs/pull/363) |
| Ödeme Yöntemi | ❌ Kullanıcılar depolama ücreti ve indirme kotası ücretini kendileri ödemek zorundadır. | ✅Esnek ödeme yöntemi: Projeler depolama ve indirme kotası ücretlerini kendileri ödemeyi seçebilir, kullanıcılara bu platformu ücretsiz kullanma imkanı sunar ve kullanıcı eşiğini düşürür, böylece kullanıcı sayısını artırır ve tanıtımını kolaylaştırır. | [https://github.com/bnb-chain/greenfield/pull/582](https://github.com/bnb-chain/greenfield/pull/582) | [BEP-362: Greenfield Depolama Ücreti Ödemesi](https://github.com/bnb-chain/BEPs/pull/362) |
| Objeleri Yükleme | ❌ Kullanıcılar objeleri yüklemeden önce DCellar'a yüklemek zorundadır, çünkü yükleme süreci MindPress'e gömülmesi oldukça karmaşıktır. | ✅Yükleme kolaylığı: Kullanıcılar MindPress'te bir kerede birden fazla büyük objeyi yükleyebilir, çünkü yükleme süreci delege yükleme özelliği ile büyük ölçüde basitleştirilmiştir, imza gerektirmez ve ücret alınmaz. | [https://github.com/bnb-chain/greenfield/pull/581](https://github.com/bnb-chain/greenfield/pull/581) | [BEP-364: Birincil Depolama Sağlayıcısı, Greenfield'de nesne oluşturma ve güncelleme için yükleme ajanı görevi görür](https://github.com/bnb-chain/BEPs/pull/364) |
| Objeleri Listeleme | ❌ Kullanıcılar listeleme işlemine tamamlamak için 2-3 işlem yapmalıdır, bu da ağlar arasında geçiş yapmalarını gerektirir. | ✅Listeleme kolaylığı: Kullanıcılar satışa başlaması için listeleme işlemi tamamlamak için yalnızca 2 işleme ihtiyaç duyar. | [https://github.com/bnb-chain/greenfield-contracts/pull/140](https://github.com/bnb-chain/greenfield-contracts/pull/140) | [BEP-363: Greenfield çapraz zincir programlama yeteneğini geliştirme](https://github.com/bnb-chain/BEPs/pull/363)[Greenfield çapraz zincir uygulaması için çoklu mesaj desteği eklemek](https://github.com/bnb-chain/greenfield-cosmos-sdk/pull/417) |

### 4. Demo Videosu

#### 4.1 Alıcı çalışma akışı

|  |  |
| -- | -- |
| Arama ve filtreleme | ![](../../../../images/bnb-chain/assets/gifs/search.gif) |
| Görselleri satın alma | ![](../../../../images/bnb-chain/assets/gifs/buy.gif) |

#### 4.2 Satıcı Çalışma Akışı

|  |  |
| -- | -- |
| Görselleri Yükleme | ![](../../../../images/bnb-chain/assets/gifs/upload.gif) |
| Görselleri Listeleme | ![](../../../../images/bnb-chain/assets/gifs/list.gif) |
| Görselleri Listeden Kaldırma | ![](../../../../images/bnb-chain/assets/gifs/delist.gif) |

### 5. Çevre Desteği

* BNB Akıllı Zincir Testnet: [https://mindpress.io](https://mindpress.io) (Bazı bölgelerde VPN gerekli)

### 6. Teknik Tasarım

#### 6.1 Genel Bakış

BNB Greenfield, nesne ve grup gibi kaynaklar sunmaktadır ve bu kaynaklar BNB Akıllı Zinciri (BSC) üzerinde ERC-721 standardına uygun olarak değiştirilemeyen token'lar (NFT) olarak yansıtılabilir. **Bucket'lar**, veri ve meta veri ile temel birim olan nesneleri saklar. Gruplar benzer izinlere sahip hesaplardan oluşur. Bu kaynaklar, grup üyelerinin izinlerini ERC-1155 token'ları olarak içerecek şekilde BSC'de yansıtılabilir.

BSC üzerindeki akıllı sözleşmeler, yansıtılan kaynakları doğrudan kontrol edebilir, depolama biçimleri, erişim izinleri ve diğer veri yönlerini etkileyebilir. Bu entegrasyon, hem platformlarda veri yönetimini kolaylaştırarak esneklik ve erişilebilirliği artırır. Yansıtma uygulaması hakkında daha fazla bilgi için [bu belgeye](https://docs.bnbchain.org/bnb-greenfield/core-concept/cross-chain/mirror/) başvurun.

MindPress Veri Pazarı bağlamında, kullanıcıların Greenfield ağında görseller saklama ve bunları BSC'de satabilme imkanı vardır. Örneğin, Alice'in MindPress'te bir havuç fotoğrafı sattığını düşünelim. Havuç görsellerini satmak için Alice'in şu adımları izlemesi gerekmektedir:

![image10](https://github.com/bnb-chain/mindpress-data-marketplace/assets/165376388/970aeb0f-ec7d-4f77-bd7b-d88882c07262)

1. Bir bucket oluşturun ve bu bucket içine havuç görselini yükleyin.
2. Bir grup oluşturun ve bu gruba havuç görseline erişim izni verin.
3. Grupları MindPress Veri Pazarı akıllı sözleşmesinde listeleyin ve BSC ağı üzerinde erişim izinleri satmaya başlayın.

:::tip
Havuç görseli özel olduğundan Bob, varsayılan olarak ona erişim izni alamaz.
:::

![image8](https://github.com/bnb-chain/mindpress-data-marketplace/assets/165376388/801b67b9-5e80-4c24-8907-b0817e88fd35)

Bob'un gruba katılma izni satın alması gerekmektedir. Üye olduktan sonra, havuç görselini görüntüleyebilir/indirebilir.

![image2](https://github.com/bnb-chain/mindpress-data-marketplace/assets/165376388/244c5d92-2ae8-4c06-a6e8-2768b36bcfe1)

#### 6.2 Mimari

##### 6.2.1 Greenfield Çapraz Zincir Tasarımı

Greenfield ekosisteminin gerçek gücü, yalnızca veri depolama değil, aynı zamanda veri varlıklarından değer yaratma ve buna bağlı ekonomi geliştirmek için tasarlanmış yenilikçi platformundadır. Greenfield'deki verileri daha etkili bir şekilde güçlendirmek için, kapsamlı çapraz zincir programlama yetenekleri sağlayan sağlam bir çapraz zincir mekanizması getirilmiştir.

![image4](https://github.com/bnb-chain/mindpress-data-marketplace/assets/165376388/baa94598-4716-407b-9056-5cc0572cc5f1)

İlk katman, BSC ile BNB Greenfield arasındaki iletişim paketlerini işlemek ve doğrulamakla sorumlu olan **Çapraz Zincir İletişim Katmanı**dır.

İkinci katman, BNB Greenfield'de tanımlanan kaynak varlıklarını işleyen ve bunları BSC'ye yansıtan **Kaynak Yansıtma Katmanı**dır.

Çapraz zincir sisteminin en üst katmanı **Uygulama Katmanıdır**. Bu katman, topluluk tarafından BSC üzerinde geliştirilen akıllı sözleşmelerden oluşur ve yansıtılan kaynak varlıklarını Kaynak Yansıtma Katmanı üzerinde işletmelerine olanak tanır.

##### 6.2.2 MindPress İş Akışı

MindPress Veri Pazarı, kullanıcıların Greenfield'de depolanan verileri BSC tarafında esnek bir şekilde manipüle etmelerini sağlayan BNB Greenfield ve BSC'nin çapraz zincir mekanizmasında oluşturulmuştur, böylece veri dolaşımını ve değer yaratımını kolaylaştırmaktadır. Aşağıda, MindPress'teki ana süreçlerin teknik ilkelerine detaylı bir şekilde bakalım.

* Alan Oluşturma

MindPress sözleşmesi aşağıdaki işlemleri gerçekleştirecektir:

1. Kullanıcının yüklediği görselleri saklamak için bir bucket oluşturmasına yardımcı olur ve bucket'ın ödemesi MindPress sözleşmesine ayarlanır.
2. Başlangıçta ücretsiz bir ücret vermek için bucket için akış oranı sınırı ayarlanır.

![](../../../../images/bnb-chain/assets/mindpress/create.png)

* Obje Listeleme

Kullanıcılar bir objeyi listelemek için şu 2 işlemi gerçekleştirmelidir:

1. MindPress sözleşmesine, nesne kimliği, grup adı ve fiyat ile bir listeleme talebi gönderin; MindPress, grubun tüm üyelerinin nesneye erişim iznine sahip olduğu yeni bir grup oluşturacaktır.
2. Nesneyi ve oluşturulan grubu bağlamak için bir çapraz zincir put-policy işlemi gönderin.

![](../../../../images/bnb-chain/assets/mindpress/list.png)

* Obje Satın Alma

Bir nesneyi satın almak için kullanıcı, basitçe bir satın alma isteği gönderir ve uygun ücreti BNB olarak öder. MindPress sözleşmesi, kullanıcıyı erişim grubuna eklemek için bir çapraz zincir paketi gönderir.

![](../../../../images/bnb-chain/assets/mindpress/buy.png)

#### 6.3 Teknik Değerlendirmeler

* **Çapraz Zincir Tasarımı:** Uygulama verileri BSC zincirinde depolanmaktadır. Objeler/bucket'lar ve bunların erişim hakları Greenfield zincirinde kaydedilmektedir. İletişimciler çapraz zincir paketlerini ve onaylarını BSC ile Greenfield arasında otomatik olarak iletir. MindPress sözleşmeleri, Greenfield sözleşmesi geri çağırmaları aracılığıyla uygulamanın durumunu güncelleyebilir.
* **Durumsuz Tasarım:** MindPress Veri Pazarı, durumsuz olarak tasarlanmıştır. Uygulamada yer alan veri sorgulama ve nesne izin kontrolü yalnızca BSC zinciri üzerinden etkileşime girebilir.

### 7. Başlarken

MindPress, üç mühendislik projesinden oluşmaktadır:

- Ön Uç: [https://github.com/bnb-chain/mindpress-data-marketplace](https://github.com/bnb-chain/mindpress-data-marketplace)
- Arka Uç: [https://github.com/bnb-chain/mindpress-data-marketplace-backend](https://github.com/bnb-chain/mindpress-data-marketplace-backend)
- Akıllı Sözleşmeler: [https://github.com/bnb-chain/mindpress-data-marketplace-smart-contract](https://github.com/bnb-chain/mindpress-data-marketplace-smart-contract)

### 8. Katkı Sağlama

MindPress'i kullanmayı ve katkıda bulunmayı düşündüğünüz için teşekkür ederiz! Geliştiricilerin açık kaynak kod tabanımızı kullanmasını bekliyoruz ve işlevselliğini geliştirmek ve genişletmek için iş birliğini teşvik ediyoruz. Herhangi bir sorunuz varsa, yardım için bizimle iletişime geçmekten çekinmeyin. Mutlu kodlamalar!

### 9. Lisans

Kütüphane, [GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html) altında lisanslanmıştır, ayrıca depomuzda [LICENSE](https://github.com/bnb-chain/mindpress-data-marketplace/blob/main/LICENSE) dosyasında bulunmaktadır.

### 10. Feragatname

Yazılım ve ilgili belgeler aktif geliştirme aşamasındadır, bu da gelecekte değişikliğe tabi olmaları mümkündür ve üretim kullanımı için hazır değildir. Kod ve güvenlik denetimi henüz tam olarak tamamlanmamıştır ve herhangi bir hata ödülü için hazırlıklı değildir. Ağda deney yaparken dikkatli olmanızı ve kendi riskinizle hareket etmenizi öneriyoruz. Güvende kalın.