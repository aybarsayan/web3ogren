---
sidebar_position: 32
title: Çoklu İmza Cüzdanı ile Bir Doğrulayıcı Düğümü Eklemek
description: Çoklu İmza Cüzdanı ile Bir Doğrulayıcı Düğümü Nasıl Eklenir
---

# Çoklu İmza Cüzdanı ile Bir Doğrulayıcı Düğümü Eklemek

Bu kılavuz, Camino Cüzdanı ile konsorsiyum üyesi adresinizi kullanarak bir doğrulayıcı düğümü ekleme sürecini adım adım anlatacaktır.

:::tip CÜZDAN ADRESİ

Lütfen bu kılavuz için doğru cüzdan adresini kullandığınızdan emin olun: https://suite.camino.network/

:::

:::caution CÜZDAN ADRESİNİ DOĞRULAYIN

Cüzdanı kullanırken alan adının **camino.network** olduğundan her zaman emin olun.



:::

## Genel Bakış

Camino Cüzdanı ve çoklu imza cüzdanı kullanarak bir doğrulayıcı düğüm eklemek için aşağıdaki adımları takip etmelisiniz:

1. Çoklu İmza Cüzdanınızı Aktifleştirin
2. Gereksinimleri kontrol edin ve doğrulayın
3. Düğümünüzün özel anahtarını alın
4. Düğümünüzü cüzdanınızla kaydedin
   - Düğüm Kaydı işlemine başlayın
   - Cüzdanın diğer üyelerinden imzaları toplayın
   - İşlemi gerçekleştirin
5. Düğümünüzü doğrulayıcı olarak ekleyin
   - Bitiş tarihlerini ayarlayın
   - Doğrulayıcı Ekleme işlemine başlayın
   - Cüzdanın diğer üyelerinden imzaları toplayın
   - İşlemi gerçekleştirin
6. Doğrulayıcının çevrimiçi olduğunu doğrulayın

:::danger HIZLI GELİŞİM

Camino Cüzdanı'nın Çoklu İmza özellikleri şu anda hızlı bir gelişim aşamasındadır. Bu nedenle, bu özelliklerin güncellemeler, değişiklikler veya düzeltmelere tabi olduğunu unutmayın.

:::

## 1. Çoklu İmza Cüzdanınızı Aktifleştirin

Öncelikle,  gerekmektedir. Bunu yapmak için, anahtar ifadenizle cüzdanınıza giriş yapın ve Anahtarları Yönet bölümüne gidin (veya sağ üstteki anahtar simgesine tıklayın).

Eğer bir çoklu imza cüzdanı üyesiyseniz, bir cüzdanları içe aktarma iletişim kutusu görünecektir. Çoklu imza cüzdanlarını içe aktarmak için İçe Aktar Cüzdanlar butonuna tıklayın.

Ardından, çoklu imza adresinin sağ tarafındaki küçük yıldız simgesine tıklayarak bunu aktifleştirin.

Daha ayrıntılı bilgi için lütfen  belgelerine bakın.

## 2. Gereksinimler

Bir doğrulayıcı düğümü ekleme sürecine başlamadan önce, karşılamanız gereken bazı gereksinimler vardır. Aşağıda, ana ağ (`camino`) ve test ağ (`columbus`) için bu gereksinimlerin listesi bulunmaktadır.

### Camino Ana Ağı & Columbus Test Ağı

- **NodeID**: Bu, düğümünüzün adresidir, normal bir cüzdan adresine benzer.
- **Düğümün Özel Anahtarı**: **NodeID** sahipliğinizi ispatlamak için buna ihtiyacınız olacak.
  Bunu güvenli bir şekilde saklayın!
- P-Chain cüzdanınızda **100.000'den fazla kamulaştırılmamış CAM** bulunmalıdır. Ayrıca işlem ücretlerini ödemek için birkaç CAM'a da ihtiyacınız var.
- **Konsorsiyum Üyesi**: Cüzdan adresiniz bir konsorsiyum üyesi olmalıdır.
  Bunun hakkında emin değilseniz, lütfen netlik için  üzerinden bizimle iletişime geçin. Eğer ön satışa katıldıysanız, bir cüzdan adresi sağladıysanız ve seyahatle ilgili bir şirket iseniz, zaten bir Konsorsiyum Üyesi oluyorsunuz.
- **KYC/KYB Doğrulaması**: Know-Your-Customer (KYC) veya Know-Your-Business (KYB) doğrulamasına sahip olmalısınız.

### Gereksinimleri Camino Cüzdanı ile Kontrol Etme

Gereksinimleri karşılayıp karşılamadığınızı kontrol edebilirsiniz; cüzdanınıza giriş yapıp çoklu imza cüzdanını aktifleştirdikten sonra Doğrulayıcı sekmesine erişerek kontrol edebilirsiniz.

Sizde aşağıdaki sayfaya benzer bir ekran görünecektir:



Şekil 1: Gereksinimler


## 3. Düğümünüzün Özel Anahtarını Alma

Düğümünüzü konsorsiyum adresinize kaydetmek için, düğümün sahibine ait olduğunu ispatlamanız gerekecek. Bu nedenle, cüzdan öncelikle düğümün özel anahtarını kullanarak düğüm kayıt işlemine imza atmalıdır. İşte bu nedenle cüzdanın düğüm özel anahtarını vermeniz gerekiyor.

Düğümünüzün özel anahtarını nasıl alabileceğiniz hakkında daha fazla bilgi için lütfen  kılavuzuna bakın.

## 4. Düğümünüzü Çoklu İmza Cüzdanınıza Kaydedin

Yukarıda belirtilen gereksinimleri karşıladıktan sonra, düğümünüzü kaydetmeye devam edebilirsiniz. Şekil 3 ekran görüntüsüne benzer bir sayfa görmelisiniz.

Düğümünüzün özel anahtarını belirtilen alana girin ve `DOĞRULAYICI DÜĞÜMÜ KAYDET` butonuna tıklayın.



Şekil 2: Düğümünüzün Özel Anahtarını Girin


### Düğüm Kaydı İşlemine Başlama

Özel anahtarınızı verdikten sonra, işlem başlatma iletişim kutusunu göreceksiniz. Burada, sağlanan özel anahtarın doğru olduğundan emin olmak için görüntülenen NodeID'yi düğümünüzün kimliği ile doğrulayabilirsiniz.

:::caution GERİ ALINAMAZ

İletişim kutusunda görüntülenen uyarılara dikkat edin. İşlem başlatıldığında geri alınamaz. Diğer cüzdan üyeleri tarafından imzalanması ve gerçekleştirilmesi ya da süresinin dolmasına bırakılması gerekir.

Bu, yeni işlemler başlatmanızı ve çoklu imza cüzdanını kullanmanızı etkili bir şekilde engeller.

Şu an için, bekleyen işlemlerinin süresinin dolması iki haftadır ve iptal edilemez veya değiştirilemez. Ancak, yakında imza bekleyen işlemleri iptal etme olanağı olacak.

:::



Şekil 3: Düğüm Kaydı İşlemine Başlatma


### Çoklu İmza Onayları Bekleniyor

İşlemi başlattıktan sonra, işlem off-chain olarak saklanacaktır. Çoklu imza cüzdanının diğer üyeleri, cüzdana giriş yapıp Doğrulayıcı bölümüne giderek işlemi imzalayabilirler.

:::tip SINIR

"İşlemi gerçekleştir" butonunun üstünde, eşik ve toplanan imza sayısını görüntüleyebilirsiniz.

:::



Şekil 4: Bekleyen Onaylar


### Bekleyen İşlemleri İmzalama

Eğer bir çoklu imza cüzdanının üyesiyseniz ve bekleyen bir işlem varsa, Doğrulayıcı bölümüne giderek benzer bir sayfaya erişebilirsiniz. Bu sayfada işlemi imzalayıp gerçekleştirme seçeneğiniz bulunmaktadır. Alternatif olarak, işlemin gerçekleştirilmesini cüzdanın diğer üyelerine bırakmayı da seçebilirsiniz.



Şekil 5: Bekleyen İşlemi İmzalayın


Ve imzalandıktan sonra:



Şekil 6: Bir Üye Tarafından İmzalanmasından Sonra


### Düğüm Kaydı İşlemini Gerçekleştirme

Eşik karşılandığında "işlemi gerçekleştir" butonuna tıklayın. İşlem blok zincirine dahil edildikten sonra, doğrulayıcı düğüm ekleme işlemini gerçekleştirebilirsiniz.

## 5. Düğümünüzü Doğrulayıcı Olarak Ekleyin

Düğümünüzü çoklu imza cüzdanınıza kaydettikten sonra, "Bir Doğrulayıcı Düğümü Ayarlama" bölümüne yönlendirilirsiniz.



Şekil 7: Doğrulayıcıyı Ayarlama


### Doğrulama & İşlem Bitiş Tarihlerini Ayarlama

Lütfen süre altında bulunan "**Onayla**" butonunun şu anda devre dışı olduğunu unutmayın. Çünkü doğrulama bitiş tarihi en az 6 ay ileri bir tarihe ayarlanmalıdır. Dolayısıyla, bu tarihi buna göre güncellemeniz gerekmektedir.

Ayrıca, "**İşlem Bitiş Tarihi**" alanını güncellemeyi unutmayın. Bu alanın tanımı yanıltıcı olabilir; çünkü bu aslında işlemin gerçekleştirileceği tarih ve saattir. Bu sebeple, işlem için makul bir tarih ve saat seçin, çünkü çoklu imza cüzdanının diğer üyelerinin de işlemi imzalaması gerekecektir.

:::caution BİTİŞ TARİHLERİ HAKKINDA NOT

Doğrulama ve işlem bitiş tarihlerinin uygun değerlere ayarlandığını kontrol etmek önemlidir.

| **Doğrulama Bitiş Tarihi** |    En az 6 ay (183 gün) ileri bir tarihe ayarlanmalıdır.    |
| :----------------------: | :------------------------------------------------------------------------------------: |
| **İşlem Bitiş Tarihi** | Göreceli olarak kısa bir süre (30 veya 60 dakika gibi) ileri bir tarihe ayarlanmalıdır. |

:::

Uygun tarihleri belirledikten sonra, sayfa aşağıdaki gibi görünecektir. **Onayla** butonuna tıklayarak devam edin.



Şekil 8: Doğrulayıcıyı Ayarlama


### Doğrulayıcı Ekleme İşlemine Başlama

Ardından, işlemin bir özetini ve işlemin geri alınamaz olduğunu belirten bir uyarıyı göreceksiniz. Ayrıntıları dikkatlice gözden geçirin ve memnun iseniz, işlemi başlatmak için **Gönder** butonuna tıklayın.



Şekil 9: İşlemi başlatmak için Gönder butonuna tıklayın


### İmzaları Toplama

İşlemi başlattıktan sonra, aşağıdaki gibi bir ekran görüntüsüyle karşılaşacaksınız. Düğüm Kaydı işleminde olduğu gibi, işlemi gerçekleştirmek için yeterli imzayı toplamanız gerekecektir.



Şekil 10: İmzaları Toplama


### Bekleyen İşlemi İmzalama

Daha sonra, çoklu imza cüzdanının diğer üyelerinin cüzdana giriş yapıp işlemi imzalaması gerekmektedir. Aşağıdaki ekran, bir üyenin göreceği görüntüdür:



Şekil 11: İşlemi İmzalayın


Ve imzalandıktan sonra:



Şekil 12: İmzalanmış İşlem


### İşlemi Gerçekleştirme

Bu noktada, çoklu imza cüzdanının herhangi bir üyesi işlemi gerçekleştirebilir. "İşlemi gerçekleştir" butonuna tıkladığınızda ve işlemi gerçekleştirmek için gönderdiğinizde, işlemin ne zaman gerçekleştirileceğini bildiren aşağıdaki gibi bir ekran göreceksiniz. Bu, daha önce seçtiğiniz tarih olacaktır.



Şekil 13: Bekleyen Gerçekleşme


## 6. Doğrulayıcınızın Çevrimiçi Olduğunu Doğrulayın

İşlemin gerçekleştirilmesi için belirlenen zaman geldiğinde ve işlem gerçekleştirildiğinde, aşağıdaki gibi bir ekran görmelisiniz:



Şekil 14: Doğrulayıcı Düğümünüz Çalışıyor.


Camino Explorer kullanarak doğrulayıcı düğümünüzün durumunu nasıl kontrol edeceğinize dair daha fazla bilgi için lütfen  referans alın.