---
sidebar_position: 5
---

# Camino Uygulama Seti Sürümleri

## v1.3.0


  Son 


### Mevduat Teklifleri

Camino Uygulama Seti'nin 1.3.0 sürümü "Mevduat Teklifleri" ile birlikte önemli geliştirmeler, güncellemeler ve hataları düzeltmeler içeren bir sürüm duyurmaktan mutluluk duyuyoruz. Bu yenilikler, genel işlevselliği ve kullanıcı deneyimini artırmaktadır.

- **Ana Güncelleme: Mevduat Teklifleri**

  - **Yeni Üst Düzey Navigasyon "Temel"**: Mevduat teklif yöneticileri için yönetimi kolaylaştırmak amacıyla özel bir navigasyon alanı tanıtıldı 🧭.
  - **Adres Spesifik Mevduat Teklifi Oluşturma**: Seçilen adresler artık mevduat teklifler oluşturma yeteneğine sahip, bu da güvenliği ve yönetimi artırmaktadır 🔑.
  - **Mevduat Teklifleri Oluşturma**: Yöneticiler, mevduat yönetimini esnek hale getiren yeni işlevselliklerle donatıldı.
  - **Testnet'te Tasarruf Havuzları Kaydetme**: Cüzdanın Kazan bölgesinde yeni tasarruf havuzu özelliğini test edin ve testnet üzerinde ödül kazanmaya başlayın 🏦.

- **Küçük Güncellemeler:**

  - **Tüm Ön Yüzlerde Yeni Yazı Tipi**: Tüm arayüzlerde okunabilirliği ve görsel konforu artırmak için yeni bir yazı tipi uygulandı.
  - **Cüzdan İşlemleri Altbilgi Metni Güncellemeleri**: Cüzdan işlemleri altbilgi metninde net iletişim için iyileştirmeler yapıldı.
  - **Geliştirilmiş Navigasyon Çubuğu**: Cüzdan ve hesap bilgilerinin daha iyi görüntülenmesi için navigasyon çubuğu güncellendi.
  - **Multisig Sahiplerinin İsimleri**: Multisig sahiplerinin isimlerinin artık cüzdan içerisinde güvenilir bir şekilde saklanması sağlandı.

- **Hata Düzeltmeleri:**
  - **Ağ Değişikliği Sonrası Tasarruf Havuzu Görünürlüğü**: Tasarruf havuzunun yalnızca bir ağ değişikliği sonrasında göründüğü sorunu ele alındı.
  - **P Bakiyesi Görüntüleme Doğruluğu**: Token etkileşimleri sırasında yanlış P bakiyesi görüntülenmesine neden olan bir hata düzeltildi.
  - **Doğrulayıcı Sayfası Uptime Doğruluğu**: Doğrulayıcı sayfasındaki uptime görüntülemesi 10000%'den gerçek %100'e düzeltildi.
  - **Doğrulayıcı Sekmesi Otomatik Yenileme**: Doğrulayıcı sekmesi, artık ağlar veya multisig düzenlemeleri arasında geçiş yapıldığında otomatik olarak yenilenecektir 🔄.
  - **Mevduat Teklifi Oluşturma Düzeltmeleri**: Mevduat teklifi oluşturma sürecini iyileştirmek için birden fazla düzeltme uygulandı.

Her zaman geri bildirimlerinizi bekliyoruz, Camino Uygulama Seti'nin sürekli iyileştirilmesine kendimizi adadık.

## v1.2.1


  Hata Düzeltme


### Kullanıcı Deneyimi ve Arayüz Geliştirmeleri

Camino Uygulama Seti `v1.2.1` ile deneyiminizi iyileştirmeye odaklanıyoruz.

**🛠️ Öne Çıkanlar:**

- **Geliştirilmiş Etkileşim**: Çekmece davranışı iyileştirildi ve HTML yapı sorunları düzeltildi.
- **URL Açıklığı**: Multisig yönetim yolu `/manage-multisig` olarak güncellendi. 
- **Geliştirilmiş Güvenlik**: `fetchMultiSigAliases` fonksiyonu yalnızca giriş yapan kullanıcılarla kısıtlandı.
- **Arayüz Güncellemeleri**:
  - "Ağ" artık ayarlarda net bir şekilde görüntüleniyor.
  - Daha iyi açıklık için cüzdan simgeleri yenilendi.
  - Multi-sig cüzdan adres görüntülemeleri ayarlandı.
- **Performans ve Hata Düzeltmeleri**:
  - `fetchMultiSigAliases` çağrıları optimize edildi.
  - Koleksiyonların basım bölümünde görüntüleme düzeltildi.
  - Caminojs kullanılabilirlik oluşturma sorunları çözüldü. 
- **Yeni MultiSig Yönetimi**: Her sayfa erişiminde veriler güncellenir.

Camino Suite ile daha pürüzsüz bir deneyim için güncel kalın ve her zaman geri bildirimleriniz geliştirmelerimizi yönlendirir!

## v1.2.0

### Multisig Takma Adı Oluşturma ve Düzenleme

Camino Uygulama Seti'nin en son sürümünde önemli bir yeni özelliği tanıtmaktan heyecan duyuyoruz.

**Ayarlar İçinde Multisig Takma Adı Oluşturma ve Düzenleme İşlevselliği Tanıtımı**:

- **Ayarlar** sayfamıza girin ve yeni **multisig takma adları oluştuma ve düzenleme** kabiliyetini keşfedin. Bu geliştirme, kullanıcılara multisig cüzdanlarını yönetmek için daha sorunsuz ve sezgisel bir yöntem sunmayı amaçlamaktadır.
  - Multisig takma adları oluşturmak için özel bir bileşen gösterir. 
  - Sorunsuz bir kullanıcı deneyimi sağlayarak multisig takma adları oluşturun. 

:::info DAHA FAZLA BİLGİ

Multisig cüzdanların oluşturulması ve düzenlenmesi hakkında daha fazla bilgi için  doküman sayfasına bakınız.

:::

---

**Diğer Dikkate Değer Güncellemeler**:

- KYB butonuna şimdi daha net bir ayrım için beta etiketi eklendi. 
- Daha iyi bir kullanıcı deneyimi için ayarlar alanı yenilendi. 
- Kullanıcılar için sürüm etiketinin görünürlüğü artırıldı. 
- Rota değişiklikleri sırasında aktif sekme geçişlerinde sorunsuz bir gezinme için düzeltildi. 
- Multisig, artık ağ değişikliklerinde hızla güncelleniyor. 
- Birçok küçük hata düzeltmesi!

v1.1.0 ile v1.2.0 arasındaki tüm değişiklikler hakkında daha ayrıntılı bir bakış için  sayfasını ziyaret edin.

Seyahatin bir parçası olduğunuz için teşekkür ederiz. Yeni multisig takma adı özelliğini keşfetmenizi sabırsızlıkla bekliyoruz!