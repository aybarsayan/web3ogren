---
title: Saldırılara ve Arıza Modlarına Karşı Konsensüs Koruma
seoTitle: XRP Defteri Konsensüs Protokolü Güvenliği
sidebar_position: 10
description: XRP Defteri Konsensüs Protokolünün saldırılara karşı koruma mekanizmalarını keşfedin; bireysel doğrulayıcıların kötü davranışları, yazılım güvenlik açıkları ve Sybil saldırıları gibi konulara odaklanın.
tags: 
  - XRP Defteri
  - Konsensüs Protokolü
  - Güvenlik
  - Blockchain
  - Yazılım Açıkları
keywords: 
  - XRP Defteri
  - Konsensüs Protokolü
  - Blockchain
  - güvenlik
  - yazılım açıkları
---

# Saldırılara ve Arıza Modlarına Karşı Konsensüs Koruma

XRP Defteri Konsensüs Protokolü, _Bizans hata toleranslı_ bir konsensüs mekanizmasıdır; bu, her türlü şeyin yanlış gidebileceği durumlarda bile çalışacak şekilde tasarlandığı anlamına gelir: katılımcılar, iletişim için güvensiz bir açık ağa bağımlıdır ve kötü niyetli aktörler, sistemin kontrolünü ele geçirmeye veya kesintiye uğratmaya çalışabilir. Üstelik, XRP Defteri Konsensüs Protokolü'nde yer alan katılımcı seti önceden bilinmemekte ve zamanla değişiklik gösterebilmektedir.

:::tip
İstenilen ağ özelliklerini korurken işlemleri hızlı bir şekilde onaylamak karmaşık bir zorluktur. Bu nedenle mükemmel bir sistem oluşturmak imkânsızdır.
:::

XRP Defteri Konsensüs Protokolü, çoğu durumda mümkün olduğunca iyi çalışacak şekilde tasarlanmıştır ve çalışamadığı durumlarda ne kadar zarif bir şekilde başarısız olabileceğine odaklanmaktadır.

Bu sayfa, XRP Defteri Konsensüs Protokolü'nün karşılaştığı bazı zorluk türlerini ve bunları nasıl ele aldığını açıklamaktadır.

## Bireysel Doğrulayıcıların Kötü Davranışı

_Doğrulayıcılar_, her yeni defter versiyonunun belirlenmesi sürecine aktif olarak katkıda bulunan sunuculardır. Doğrulayıcılar, yalnızca kendilerine güvenilen sunucular üzerinde etkiye sahip olabilir (dolaylı olarak da dahil). Bazı doğrulayıcılar kötü davransa bile konsensüs süreci devam edebilir ve bu, aşağıdakiler gibi çeşitli arıza durumlarını içerebilir:

- Ulaşılabilir olmama veya aşırı yüklenme.
- Ağa kısmen bağlı olmama, böylece mesajlarının yalnızca bir katılımcı alt kümesine gecikmeden ulaşması.
- Diğerlerini dolandırma veya ağı durdurma niyetiyle kasıtlı davranma.
- Baskıcı bir hükümetten gelen tehditler gibi dış faktörlerden kaynaklanan baskılar nedeniyle kötü davranma.
- Bir hata veya güncel olmayan yazılım nedeniyle karışık veya hatalı mesajlar gönderme.

:::info
Genel olarak, yalnızca küçük bir yüzdede (yaklaşık %20'den az) güvenilir doğrulayıcılar kötü davrandığında konsensüs sorunsuz devam edebilir. (Kesin yüzdeler ve arka plandaki matematik için, en son `Konsensüs Araştırması` sayfasına bakın.)
:::

Eğer doğrulayıcıların %20’den fazlası ulaşılamaz veya düzgün davranmazsa, ağ bir konsensüs elde edemez. Bu süre zarfında yeni işlemler geçici olarak işlenebilir, ancak yeni defter versiyonları doğrulanamaz, bu nedenle bu işlemlerin kesin sonuçları güvence altına alınamaz. Bu durumda, XRP Defteri'nin sağlıksız olduğu hemen anlaşılır ve insan katılımcıların müdahalesi gerektirir. Bu katılımcılar, beklemeye mi yoksa güvenilir doğrulayıcı setlerini yeniden yapılandırmaya mı karar verebilirler.

Geçersiz bir işlemi onaylamanın tek yolu, en az %80'lik bir güvenilir doğrulayıcılar topluluğunun bu işlemi onaylaması ve kesin sonucuna dair uzlaşmasıdır. (Geçersiz işlemler, daha önce harcanmış parayı harcayan veya ağın kurallarını ihlal eden işlemleri içerir.) Diğer bir deyişle, güvenilir doğrulayıcıların büyük bir çoğunluğu _komplo kurmak_ zorundadır. Dünyanın farklı yerlerinde farklı insanlar ve işletmeler tarafından işletilen onlarca güvenilir doğrulayıcı ile bu, kasıtlı olarak gerçekleştirilmesi oldukça zor bir durumdur.

## Yazılım Güvenlik Açıkları

Her yazılım sisteminde olduğu gibi, XRP Defteri Konsensüs Protokolü'nün uygulanmasında, yaygın olarak kullanılan yazılım paketlerinde veya bunların bağımlılıklarında bulunan hatalar (veya kasıtlı kötü niyetli kod) ciddi bir sorun olarak ele alınmalıdır. Dikkatlice işlenmiş girdileri gördüğünde bir sunucunun çökmesine neden olan hatalar bile, ağın ilerlemesini kesintiye uğratmak için kötüye kullanılabilir. XRP Defteri geliştiricileri, bu tehdidi, XRP Defteri yazılımının referans uygulamalarında ele almak için çeşitli önlemler alır ve bunlar arasında şunları içerir:

- Herkesin gözden geçirebileceği, derleyebileceği ve ilgili yazılımı bağımsız olarak test edebileceği bir [açık kaynak kod tabanı](https://github.com/XRPLF/rippled/).
- Resmi XRP Defteri depolarındaki tüm değişiklikler için kapsamlı ve sağlam bir kod inceleme süreci.
- Tüm sürümlerde ve resmi yazılım paketlerinde iyi bilinen geliştiricilerden dijital imzalar.
- Güvenlik açıkları ve zayıflıkları için düzenli olarak bağımsız denetimler.
- Güvenlik araştırmacılarına sorumlu şekilde güvenlik açıklarını bildirdiklerinde ödül veren bir [hata ödül programı](https://ripple.com/bug-bounty/).

## Sybil Saldırıları

Bir _[Sybil saldırısı](https://en.wikipedia.org/wiki/Sybil_attack)_, bir ağın kontrolünü ele geçirmek için büyük sayıda sahte kimlik kullanma girişimidir. XRP Defteri'nde, bir Sybil saldırısı, büyük sayıda doğrulayıcı çalıştırma ve ardından diğerlerini bu doğrulayıcılara güvenmeye ikna etme biçiminde olur. Bu tür bir saldırı teorik olarak mümkündür, ancak insan müdahalesi gerektiğinden gerçekleştirilmesi son derece zor olacaktır.

:::note
Ne kadar çok doğrulayıcı sunucusu çalıştırılırsa çalıştırılsın, bu sunucular mevcut katılımcıların neyi doğrulayıcı olarak değerlendirdiği üzerinde herhangi bir söz sahibi olamazlar, bu katılımcılar saldırganın doğrulayıcılarına güvenmeyi tercih etmedikçe.
:::

Diğer sunucular yalnızca kendilerine güvenmek için yapılandırıldığı doğrulayıcıları dinler. (Varsayılan doğrulayıcı listesi nasıl çalıştığına dair bir özet için `doğrulayıcı örtüşme gereksinimlerine` bakın.)

Bu güven, otomatik olarak gerçekleşmez, bu nedenle başarılı bir Sybil saldırısı gerçekleştirmenin zorluğu, hedeflenen insanlar ve işletmeler üzerinde saldırganın doğrulayıcılarına güvenmelerini sağlamak için gereken zorlu çalışmayı içerir. Tek bir birey bu güveni kazanmayı başarırsa, bu durum konfigürasyonlarını değiştirmeyen diğerleri üzerinde minimal etkiye sahip olacaktır.

## %51 Saldırısı

"%51 saldırısı", bir tarafın toplam madencilik veya oylama gücünün %50'sinden fazlasına sahip olduğu bir blockchain sistemine yönelik bir saldırıdır. (Teknik olarak, saldırı %50'dan fazla herhangi bir miktarı kapsadığı için biraz yanlış adlandırılmıştır.) XRP Defteri, konsensüs mekanizmasında madencilik kullanmadığı için %51 saldırısına karşı savunmasız değildir. XRP Defteri için bir Sybil saldırısı, en yakın benzeridir ve bu da zordur.

## Doğrulayıcı Örtüşme Gereksinimleri

XRP Defteri'ndeki tüm katılımcıların, neyi doğrulanmış olarak kabul ettiklerinde anlaşabilmeleri için, diğer herkesin seçtiği setlerle oldukça benzer güvenilir doğrulayıcı setlerini seçmeleri gerekir. En kötü durumda, %90'dan az örtüşme bazı katılımcıların birbirlerinden sapmasına neden olabilir. Bu nedenle, endüstri ve topluluk tarafından işletilen güvenilir ve iyi bakımlı sunucuları içermesi amaçlanan, önerilen doğrulayıcıların imzalı listeleri bulunmaktadır.

Varsayılan olarak, XRP Defteri sunucuları XRPL Vakfı ve Ripple tarafından işletilen doğrulayıcı listesi sitelerini kullanacak şekilde yapılandırılmıştır. Bu siteler, düzenli olarak güncellenen önerilen doğrulayıcıların listesini sağlar (önerilen _Benzersiz Düğüm Listesi_, veya UNL olarak da bilinir). Bu şekilde yapılandırılan sunucular, listenin en son sürümündeki tüm doğrulayıcılara güvenmektedir, bu da diğerleriyle %100 örtüşmeyi garanti eder. Varsayılan yapılandırma, sitelerin içeriklerinin doğruluğunu doğrulayan genel anahtarları içerir. XRP Defteri'nin eşler arası ağındaki sunucular, aynı zamanda, listenin imzalı güncellemelerini birbirlerine doğrudan ileterek potansiyel arıza noktalarını azaltırlar.

:::warning
Teknik olarak, bir sunucu çalıştırıyorsanız, kendi liste sitenizi yapılandırabilir veya bireysel olarak güvenmek için doğrulayıcıları açıkça seçebilirsiniz; ancak bu önerilmez. Seçtiğiniz doğrulayıcı seti diğerleriyle yeterince örtüşmüyorsa, sunucunuz ağın geri kalanından sapabilir ve farklı durumuna dayanarak hareket etmeye çalışırken para kaybedebilirsiniz.
:::

Daha heterojen doğrulayıcı listeleri oluşturmayı sağlayan geliştirilmiş bir konsensüs protokolü tasarımı için araştırmalar devam etmektedir. Daha fazla bilgi için `Konsensüs Araştırması` sayfasına bakın.

---

## Ayrıca Bakınız

- Konsensüs protokolünün **detaylı açıklaması** için `Konsensüs` sayfasına bakın.
- Konsensüs protokolünün **tasarım kararları ve geçmişi** hakkında bir açıklama için `Konsensüs İlkeleri ve Kuralları` sayfasına bakın.
- Protokolün özelliklerini ve sınırlamalarını araştıran **akademik araştırmalar** için `Konsensüs Araştırması` sayfasına bakın.