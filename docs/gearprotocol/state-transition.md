---
sidebar_position: 9
sidebar_label: State Transferleri
---

# Durum Geçişi (State Transition)

Her sistem, sistem durumunun nasıl geliştiğine dair kurallara uyar. Ağ yeni giriş verilerini işledikçe, durum durum geçişi kurallarına göre ilerler. Bu giriş verileri, işlemler olarak adlandırılan ayrıntılı bilgi parçacıklarına paketlenir.

Gear düğümleri, tüm bu yeni işlemleri içeren bir işlem havuzunu korur ve senkronize eder. Herhangi bir düğüm (doğrulayıcı veya doğrulayıcı olmayan) bir işlem alırsa, düğüm işlemi tüm bağlı düğümlere iletiyor. İşlem havuzu nasıl çalıştığı hakkında daha fazla bilgi için [Substrate Dokümantasyonu](https://substrate.dev/docs/en/knowledgebase/learn-substrate/tx-pool)'na başvurun.

Bir Gear doğrulayıcı düğümü yeni bir blok üretmeye geldiğinde, havuzdaki bazı (veya tüm) işlemler bir bloğa birleştirilir ve ağ bu blok aracılığıyla bir durum geçişi yaşar. Son bloğa alınmayan işlemler, bir sonraki blok üretildiğindeye kadar havuzda kalır.

Gear Ağı aşağıdaki işlem türlerini destekler:

1. **Bir program yükle** (Upload a Program) - kullanıcı yeni program(lar) - akıllı sözleşmeler yükler
2. **Bir kod yükle** (Upload a Code) - kullanıcı daha sonra programlar oluşturmak için kullanılmak üzere bir kod yükler
3. **Bir program oluştur** (Create a Program) - program veya kullanıcı önceden yüklenmiş kodlardan bir program oluşturur
4. **Bir mesaj gönder** (Send a Message) - program veya kullanıcı mesaj kuyruğunu doldurur
5. **Bir yanıt gönder** (Send a Reply) - mesaja yanıt olarak gönderilebilen bir mesajdır
6. **Posta kutusundaki değeri talep et** (Claim a Value from Mailbox) - kullanıcı, posta kutusundaki mesajla ilişkili değeri talep eder
7. **Mesajları kuyruktan çıkar** (Dequeue Messages) - doğrulayıcılar (blok üreticileri), birden fazla mesajı kuyruktan çıkarır ve ilişkili programları çalıştırır
8. **Bakiye transferleri** (Balance Transfers) - Gear motoru, kullanıcı-program-doğrulayıcı bakiye transferlerini gerçekleştirir

Mesaj işleme, blok inşa/içe aktarma zamanında ayrı

lmış bir alanın içinde gerçekleştirilir. Mesaj işlemenin her blokta gerçekleşeceği ve mevcut örneğin ayarlarına bağlı olarak belirli bir oranda gerçekleşeceği garanti edilir.

### Bir program yükle (Upload a Program)

Gear ağındaki yetkililer (veya halka açık uygulamalarda herhangi bir kullanıcı), duruma kaydedilecek yeni bir program önerir. Halka açık ağlar için bir programla ilişkili bir denge de sağlanır. Bu yeni denge daha sonra başlangıç ​​bakiyesini (Varoluşsal Depozito) oluşturur.

### Bir kod yükle (Upload a Code)

Bir Wasm kodu başlangıç ​​yapılandırması olmadan yüklenebilir. Bu kod bir program olarak yürütülemez, ancak depolamaya kaydedilir ve daha sonra yeni programlar oluşturmak için kullanılabilir. Hem kullanıcılar hem de programlar, yüklenen kodlardan programlar oluşturabilir.

### Bir program oluştur (Create a Program)

Kullanıcılar ve programlar, yüklenen koddan yeni programlar oluşturabilir. Kod birkaç kez kullanılarak birden çok program üretebilir.

### Bir mesaj gönder (Send a Message)

Son kullanıcılar, programlara mesaj göndererek etkileşimde bulunur. Bir Gear Ağı'na gönderilen mesajlar, global mesaj kuyruğunu doldurur. Bu kuyruk, çalışma zamanı tarafından yönlendirilen bir işlem kuyruğu gibi düşünülebilir, ancak kabul edilen herhangi bir mesajın nihayetinde işleme tabi tutulacağı garanti edilir. Bir mesajı kuyruğa koymak ücretsiz değildir ve bu nedenle bir mesajın gönderileceği garanti edilir.

Programlar ayrıca birbirleriyle mesaj alışverişi yapar. Alınan mesajın sonucu, başka bir programa veya kullanıcıya adreslenmiş başka bir mesaj (yanıt) veya sonraki mesaj için kullanılacak bir belirli davranış olabilir. Bir program ayrıca, yürütme sonucunda başka bir programın oluşturulması olan bir mesaj gönderebilir.

### Bir yanıt gönder (Send a Reply)

Yanıt, yukarıda açıklanan mesajla aynıdır, tek fark yanıtın yalnızca alınan mesaja yanıt olarak gönderilebilmesidir. Kullanıcılar, posta kutularındaki mesaja yanıt olarak yanıt gönderebilirler.

### Posta kutusundan bir değeri talep et (Claim a Value from Mailbox)

Kullanıcı, bir mesajla ilişkilendirilen değeri talep etmek için bir talepte bulunmalıdır. Talepte bulunan kullanıcının mesajdan değeri aktarması gerekmektedir. Talep edilmeyen değer

, mesajın posta kutusundan ayrılmasından sonra gönderene iade edilir.

### Mesajları kuyruktan çıkar (Dequeue Messages)

Doğrulayıcılar, bir sonraki bloğu üretme sırası geldiğinde hangi mesajları kuyruktan çıkaracaklarını seçebilirler. Bu, herhangi bir doğrulayıcının tam bellek durumunu koruması gerekliliğini ortadan kaldırır. Kuyruktan çıkarılma yalnızca her bloğun sonunda gerçekleşir. Kuyruktan çıkarma sırasında yeni mesajlar oluşturulabilir. Ayrıca bu aşamada işleme tabi tutulabilirler, ancak bir sonraki blok için kuyrukta kalabilirler (ve başka bir doğrulayıcı).

### Bakiye transferleri (Balance Transfers)

Düzenli bakiye transferleri iki şekilde gerçekleştirilebilir. İlk yol, Substrate `Balances` paletinden ilgili dış işlemleri (`transfer`, `setBalance`, vb.) kullanmaktır. İkinci yol, bir kullanıcıdan diğerine ilişkili değerle bir mesaj göndermektir.

### Mesajlar, bloklar ve olaylar yaşam döngüsü

Aşağıdaki resim, Gear mekanizmasının sonsuz yaşam döngüsünü göstermektedir. İletişim için aktör modelinin dikte ettiği gibi, hiçbir şey paylaşılmaz, sadece mesajlar vardır. "sistem" hedefine sahip mesajlar, kullanıcı alanında incelenmek üzere olay günlüğüne girer.

![alt text](../../static/img/gear/mq.jpg)