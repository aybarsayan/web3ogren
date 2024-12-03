---
title: Rezervler
seoTitle: XRP Ledger Rezerv Gereksinimleri
sidebar_position: 4
description: XRP Ledger hesaplarının veri tabanını korumak için gereken rezerv gereksinimleri hakkında detaylı bilgi. Rezerv türleri ve hesap yönetimi ile ilgili bilgilere ulaşabilirsiniz.
tags: 
  - XRP Ledger
  - rezerv gereksinimleri
  - işlem ücretleri
  - hesap yönetimi
  - spam önleme
keywords: 
  - XRP Ledger
  - rezerv gereksinimleri
  - işlem ücretleri
  - hesap yönetimi
  - spam önleme
---

# Rezervler

XRP Ledger, _rezerv gereksinimlerini_ XRP cinsinden uygulayarak paylaşılan global defteri spam veya kötü amaçlı kullanım sonucu aşırı büyümeden korur. Amaç, defterin büyümesini teknoloji gelişimleriyle sınırlamaktır; böylece mevcut bir malzeme seviyesindeki makine her zaman mevcut defteri RAM'de tutabilir.

Bir hesaba sahip olmak için, bir adresin paylaşılan global defterde minimum bir miktar XRP tutması gerekir. Yeni bir adresi finanse etmek için, o adreste rezerv gereksinimini karşılayacak kadar XRP almanız gerekir. Rezervde tutulan XRP'yi başkalarına göndermenin mümkün değildir, ancak hesabı `silerek` bazı XRP'lerinizi geri alabilirsiniz.

:::info
**Not:** XRP rezervi pasif değildir. İşlem ücretlerini ödemek için rezervlerinizi kullanabilirsiniz. Rezervlerinizi başka bir açıdan görmek gerekirse, işlem ücretlerinizi karşılamak için hesabınızı önceden finanse ediyorsunuz demektir.
:::

Rezerv gereksinimi, `Ücret Oylama` süreci nedeniyle zaman zaman değişir; burada doğrulayıcılar yeni rezerv ayarları üzerinde anlaşabilirler.

---

## Temel Rezerv ve Sahip Rezervi

Rezerv gereksinimi iki bölümden oluşur:

* **Temel Rezerv**, defterdeki her adres için gereken minimum XRP miktarıdır.
* **Sahip Rezervi**, adresin defterde sahip olduğu her nesne için rezerv gereksiniminde bir artıştır. Her bir öğenin maliyeti de _artı rezerv_ olarak adlandırılır.

Mainnet üzerindeki mevcut rezerv gereksinimleri:

- Temel rezerv: **10 XRP**
- Sahip rezervi: **2 XRP** her bir öğe için

Diğer ağlardaki rezervler değişebilir.

Sahip rezervinin bir istisnası, XRPL üzerinde ilk iki güven hattınızı gereken 2 XRP rezerv olmadan oluşturabilmenizdir. **10 XRP temel rezerv ile yeni hesabınızı oluşturun, ardından 2 güven hattınızı oluşturun; rezerv gerekmez.** Hesabınıza 10 XRP'den fazla para eklerseniz, ilk iki güven hattınız için normal rezerv ücretleri uygulanır.

---

## Sahip Rezervleri

Defterdeki birçok nesne (defter girdileri) belirli bir hesap tarafından sahibidir. Genellikle, nesneyi oluşturan hesap sahibidir. Her nesne, sahibin toplam rezerv gereksinimini sahip rezervi kadar artırır. Nesneler defterden kaldırıldığında, artık rezerv gereksinimine karşı sayılmazlar.

Sahibin rezerv gereksinimine dahil olan nesneler: `Çekler`, `Para Yatırma Yetkilendirmeleri`, `Emanetler`, `NFT Teklifleri`, `NFT Sayfaları`, `Teklifler`, `Oracle'lar`, `Ödeme Kanalları`, `İmza Listeleri`, `Biletler` ve `Güven Hatları`dır.

**Bazı özel durumlar:**

- Fungible Olmayan Token'lar (NFT'ler), her biri 32 NFT içeren sayfalar halinde gruplanır ve sahip rezervi, NFT başına değil, sayfa başına uygulanır. Daha fazla bilgi için tıklayın Sayfaların bölünme ve birleştirme mekanizması nedeniyle, sayfa başına gerçekten depolanan NFT sayısı değişir. Ayrıca bkz: `NFTokenPage nesneleri için rezerv`.
- Güven hatları (RippleState girdileri), iki hesap arasında paylaşıldığı için, sahip rezervi bir veya her ikisine uygulanabilir. Genellikle, token sahibi bir rezerv borçludur ve ihraç eden değildir. Ayrıca bkz: `RippleState: Sahip Rezervine Katkıda Bulunma`.
- [MultiSignReserve değişikliği][] Nisan 2019'da aktif olduktan sonra oluşturulan imza listeleri birden fazla nesne olarak sayılır. Ayrıca bkz: `İmza Listeleri ve Rezervler`.
- Bir `Sahip Dizin`, bir hesaba ilişkin tüm nesneleri listeleyen bir defter girdisidir; ancak sahip dizini kendisi rezerv için sayılmaz.
- Oracle'lar, bir ila beş `PriceData` nesnesi içermesi durumunda sahip rezervi için bir öğe, altı ila on `PriceData` nesnesi içermesi durumunda ise iki öğe olarak sayılır.

---

### Rezervleri Sorgulama

Uygulamalar, [server_info yöntemi][] veya [server_state yöntemi][] kullanarak mevcut temel ve artı rezerv değerlerini sorgulayabilir:

| Yöntem                  | Birimler                | Temel Rezerv Alanı                  | Artı Rezerv Alanı                  |
|-------------------------|-------------------------|-------------------------------------|-------------------------------------|
| [server_info yöntemi][] | Ondalık XRP             | `validated_ledger.reserve_base_xrp` | `validated_ledger.reserve_inc_xrp` |
| [server_state yöntemi][] | XRP'nin tam sayı damlaları | `validated_ledger.reserve_base`     | `validated_ledger.reserve_inc`     |

Bir hesabın sahip rezervini belirlemek için, artı rezervi, hesabın sahip olduğu nesne sayısıyla çarpın. Bir hesabın sahip olduğu nesne sayısını sorgulamak için [account_info yöntemini][] çağırın ve `account_data.OwnerCount` değerini alın.

Bir adresin toplam rezerv gereksinimini hesaplamak için `OwnerCount` değerini `reserve_inc_xrp` ile çarpın, ardından `reserve_base_xrp` değerini ekleyin. `İşte bu hesaplamanın` Python'daki bir göstergesi.

---

## Rezerv Gereksiniminin Altına İnme

İşlem işlenmesi sırasında, `işlem maliyeti` gönderen adresin XRP bakiyesinin bir kısmını yok eder. Bu, bir adresin XRP'sinin rezerv gereksiniminin altına düşmesine neden olabilir. Bu şekilde _tüm_ XRP'nizi yok etmeniz bile mümkündür.

Hesabınız mevcut rezerv gereksiniminden daha az XRP tutuyorsa, diğerlerine XRP gönderemez veya hesap rezerv gereksinimini artırabilecek yeni nesneler oluşturamazsınız. Ancak hesabın, defterde varlığı devam eder ve işlem maliyetini ödemek için yeterli XRP'niz olduğu sürece bu tür şeyleri yapmayan işlemleri göndermeye devam edebilirsiniz. Rezerv gereksiniminin üstüne çıkmak için yeterli XRP almak ya da rezerv gereksiniminin sahip olduğunuz miktardan daha az bir seviyeye düşmesi gerekir.

:::tip
Eğer adresiniz rezerv gereksiniminin altındaysa, rezerv gereksiniminin üstüne çıkmak için daha fazla XRP edinmek amacıyla bir [OfferCreate işlemi][] gönderebilirsiniz. Ancak, rezervin altında iken defterde bir `Teklif girişi oluşturamayacağınız` için bu işlem sadece zaten mevcut olan Teklifleri tüketebilir.
:::

---

## Rezerv Gereksinimlerini Değiştirme

XRP Ledger'ın rezerv gereksinimlerini ayarlamak için bir mekanizması vardır. Böyle ayarlamalar, örneğin, XRP'nin değerindeki uzun vadeli değişiklikler, malzeme seviyesindeki makine donanımının kapasitesindeki iyileşmeler veya sunucu yazılımı uygulamasında artan verimlilik gibi durumları dikkate alabilir. Herhangi bir değişiklik, konsensüs süreci tarafından onaylanmalıdır. Daha fazla bilgi için `Ücret Oylama` bölümüne bakın.

---

## Ayrıca Bakınız

- [account_objects yöntemi][]
- [AccountRoot Objesi][]
- `Ücret Oylama`
- [SetFee sahte işlemi][]
- `Eğitim: Rezerv gereksinimini hesapla ve göster (Python)`

