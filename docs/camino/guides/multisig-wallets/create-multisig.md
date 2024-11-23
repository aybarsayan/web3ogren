---
sidebar_position: 6
title: Çok İmzalı Cüzdan Oluşturma & Düzenleme
description: Bu kılavuz, çok imzalı cüzdanların nasıl oluşturulup düzenleneceğini anlatmaktadır.
---

# Çok İmzalı Cüzdan Oluşturma & Düzenleme

Çok imzalı bir cüzdan, bir takma ad, üye adresleri ve bir eşik değerinden oluşur. Çok imzalı bir takma ad, normal bir Camino Cüzdan adresi gibi çalışır, ancak özel bir anahtara sahip değildir. Bu nedenle, bu adres için işlemleri imzalamak, üye adreslerinin imzalarını gerektirir. Gerekli imza sayısı, cüzdanın eşik değerine göre belirlenir. Cüzdandaki fonlara, gerekli sayıda üye adresinin imzası sağlanmadıkça erişilemez.

Çok imzalı bir cüzdan oluşturma ve düzenleme sürecine adım adım bakalım.

:::info DAHA FAZLA BİLGİ

Çok imzalı cüzdanlar hakkında daha fazla bilgi için lütfen  sayfasına bakın.

:::

:::caution AĞA ÖZEL ÇOK İMZALI TAKMA ADLAR

Çok imzalı takma adların kendi ağlarına özgü olduğunu unutmayın. Bu, ana ağda oluşturulan bir takma adın doğrudan test ağında kullanılamayacağı anlamına gelir ve tam tersi de geçerlidir. Farklı bir ağda çok imzalı bir takma ad kullanmak istiyorsanız, o ağda ayrı bir çok imzalı cüzdan kurmanız gerekecek.

:::

## Çok İmzalı Bir Takma Ad Oluşturma

### 1. Üye Cüzdanı ile Giriş Yapın

Çok imzalı cüzdana eklemeyi düşündüğünüz üye hesaplarından biriyle Camino Cüzdan'a giriş yapın.



Şekil.1: Sağ üst köşedeki menüye tıklayın


### 2. Ayarlara Gidin

- Sağ üst köşede "Ayarlar" seçeneğini bulup seçin.



Şekil.2: "Ayarlar" seçin


### 3. Çok İmzalı Cüzdan Sekmesine Erişin

- "Ayarlar" içinde "Çok İmzalı Cüzdan" sekmesini bulun ve tıklayın.



Şekil.3: "Çok İmzalı Cüzdan" sekmesine geçin


### 4. Girdi Alanlarını Anlayın

- **Çok İmzalı Cüzdan Adı**: Bu, çok imzalı cüzdanınızı isimlendirir ve blockchain üzerinde kaydedilir. Herhangi bir özel ya da hassas bilgi içerdiğinden emin olun.
- **Çok İmzalı Ortaklar**: Çok imzalı cüzdanın üyelerini listeler. İlk üye, giriş yaptığınız hesaptır. Yeşil '+' ikonuna tıklayarak daha fazla üye ekleyebilirsiniz. Not: Bu bölümdeki isimler tarayıcınızın yerel önbelleğinde saklanır ve blockchain girdileri değildir.

:::caution ORTAK ADRESLERİ İÇİN ÇOK İMZALI TAKMA ADLARI KULLANMAYIN

Çok imzalı takma adların burada üye adresleri olarak girilmemesi gerektiğini anlamak önemlidir. İç içe geçmiş çok imzalı cüzdanlar desteklenmez. Çok İmzalı Takma Adların uygulanışı, yalnızca tek imza hesaplarıyla imzalanabilmeleridir. Dolayısıyla, bir Çok İmzalı Takma Adın bekleyen bir talebini başka bir Çok İmzalı Takma Ad ile üye olarak imzalamak mümkün değildir.

:::

- **Çok İmzalı Eşik**: İşlem onayı için gereken minimum imza sayısını belirler. 1 ile toplam üye sayısı arasında herhangi bir sayı seçebilirsiniz.



Şekil.4: Girdi Alanlarını Anlayın


### 5. Formu Tamamlayın

- Çok imzalı cüzdan için seçilen bir adı yazın.
- Üye adreslerini ekleyin, çok imzalı cüzdanlar için P-Chain adreslerini kullandığınızdan emin olun.
- İstediğiniz eşik değerini belirleyin (örneğin, bu örnek için 2 olarak ayarlayın).
- Tüm ayrıntılar doldurulduğunda "Çok İmzalı Cüzdan Oluştur" butonuna tıklayın.

:::tip P-Chain'de Fonlar Olmasına Dikkat Edin!

Unutmayın, çok imzalı işlemler P-Chain işlemleri olarak gerçekleştirilir. İşlem maliyetlerini karşılamak için P-Chain bakiyenizde yeterli CAM token bulunduğundan emin olun.

:::



Şekil.5: Formu Tamamlayın


### 6. Çok İmzalı Cüzdanı Aktif Hale Getirin

- Oluşturduktan sonra, sağ üst köşeden "Cüzdanı Değiştir" seçeneğini bulun ve tıklayın.



Şekil.6: "Cüzdanı Değiştir" butonuna tıklayın


- Ardından, yeni çok imzalı cüzdanınızı aktifleştirmek için küçük ok butonuna tıklayın.



Şekil.7: Aktive et butonuna tıklayın


- Kontrol panelinde "Aktif Anahtar" bölümünün artık çok imzalı cüzdanınızın adını yansıtması gerekir.



Şekil.8: Artık aktif cüzdan yeni çok imzalı cüzdan


- İsterseniz, Camino Cüzdan'ın "Anahtarları Yönet" bölümünde aktif cüzdanınızı gözden geçirin.

:::tip ADRESİ GÖRÜN

Camino Cüzdan, çok imzalı cüzdanlar için yalnızca P-Chain adresini gösterir. Şu anda çok imzalı işlevsellik yalnızca **P-Chain** ile sınırlıdır; bu özelliğin gelecekte diğer ağlara genişletilmesi planlanmaktadır.

:::



Şekil.9: "Anahtarları Yönet" sekmesinden gözden geçirin


## Çok İmzalı Cüzdanı Düzenleme

### 1. Çok İmzalı Cüzdan Ayarlarını Açın

- Sağ üst köşeden "Ayarlar" bölümüne geri dönün.
- "Ayarlar" içinde "Çok İmzalı Cüzdan" sekmesine tıklayın.
- Düzenlemeleri başlatmak için "Çok İmzalı Cüzdanı Düzenle" butonunu bulun ve seçin.



Şekil.10: "Çok İmzalı Cüzdanı Düzenle" butonuna tıklayın


### 2. Ayrıntıları Değiştirin

- Gerekli alanları ayarlayın. Örneğin, eşik değerini 2'den 1'e değiştirebilirsiniz.
- Diğer istenen değişiklikleri gerçekleştirin, tüm değişikliklerin doğru şekilde doldurulduğundan emin olun.
- Düzenlemelerinizi yaptıktan sonra, cüzdan ayarlarını güncellemek için "Çok İmzalı Cüzdanı Kaydet" butonuna tıklayın.



Şekil.11: Değişiklikleri yapın ve "Çok İmzalı Cüzdanı Kaydet" butonuna tıklayın


### 3. Çok İmzalı Cüzdanınızın Yeterli Fonları Olduğundan Emin Olun

- Yetersiz fonlar olduğunu belirten bir hata mesajı alırsanız (bu, kılavuzu izleyip çok imzalı cüzdanınıza fon aktarmadıysanız olacaktır), işlem ücretlerini karşılamak için çok imzalı cüzdanınıza biraz CAM aktarmanız gerekecek.
- Bunu yapmak için, çok imzalı cüzdanınızın P-Chain adresini kopyalayın. (Yukarıdaki "ADRESİ GÖRÜN" ipucuna bakın)
- Ana (veya tek imza) cüzdanınıza gidin, kopyalanan çok imzalı adresine fon transferi başlatın ve işlemi onaylayın.



Şekil.12: Çok imzalı cüzdanınızda fonların olduğundan emin olun


### 4. Değişiklikleri Uygulayın

- Çok imzalı cüzdanınızın yeterli fonlara sahip olduğunu kontrol ettikten sonra, "Çok İmzalı Cüzdan" ayarlarına geri dönün.
- Cüzdanı tekrar kaydetmeyi deneyin. Yeşil bir başarı mesajı görüntülenmeli, güncellemelerin kaydedildiğini belirten bir bildirim alacaksınız.
- Buton "Gerekli 2 imzadan 1 imzalı" olarak güncellenecektir. Ardından, imza işlemini gerçekleştirmek için diğer üye hesabıyla giriş yapın.



Şekil.13: İşlemi imzalayın


### 5. Diğer Üye Hesabı ile Giriş Yapın

- Ayrı bir tarayıcı sekmesinde, işlemi co-imzalamak için gereken diğer üye hesabının kimlik bilgileriyle giriş yapın.
- "Ayarlar" altında "Çok İmzalı Cüzdan" sekmesine gidin.
- Değişiklikleri gözden geçirin ve onaylıyorsanız, daha önce yapılan değişiklikleri onaylayın.



Şekil.14: Diğer üye ile imzalayın


### 6. İşlemi Tamamlayın

- Tüm gerekli üye hesapları değişiklikleri onayladıktan sonra, işlemi gerçekleştirin.



Şekil.15: İşlemi gerçekleştirin


### 7. İşlemi Onaylayın

- İşlemin başarısını doğrulayan bir onay mesajı görünmelidir.



Şekil.16: İşlem gerçekleştirilmiştir ve değişiklikler blockchain'e kaydedilmiştir


### 8. İlk Üye ile Doğrulayın

- İsterseniz, değişiklikleri doğrulamak için ilk üye hesabıyla tekrar giriş yapabilirsiniz.
- "Çok İmzalı Cüzdan" sekmesine gidin ve görüntülenen ayarların, güncellenmiş eşik değeri gibi son yapılan değişikliklerle eşleştiğini kontrol edin.



Şekil.17: İlk üye cüzdanı ile kontrol edin
