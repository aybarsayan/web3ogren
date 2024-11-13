---
sidebar_position: 33
title: Doğrulama Süresini Yenileme
description: Süre dolduktan sonra doğrulama süresinin nasıl yenileneceğine dair bir rehber.
---

# Doğrulama Süresini Yenileme

Bir doğrulayıcı için doğrulama süresi sona erdiğinde, o doğrulayıcı mevcut doğrulayıcılardan kaldırılır ve ilgili düğüm bir API düğümüne dönüşür. Doğrulayıcının sahibi, yeni bir doğrulama süresi başlatmalı ve doğrulayıcıyı yeniden entegre ederek doğrulama faaliyetlerine devam etmelidir.

Konsorsiyum üyesi adres zaten doğrulayıcı olarak kaydedildiğinden, sahip sadece doğrulayıcıyı ağa eklemelidir; düğümü yeniden kaydetmek gerekmez.

Aşağıda bu süreci nasıl yürüteceğinize dair adım adım bir kılavuz bulunmaktadır.

## 1. Çoklu İmza Cüzdanınızı Aktif Hale Getirin

:::info TEKİL CÜZDANLAR

Eğer çoklu imza olmayan bir cüzdan kullanıyorsanız, lütfen bir sonraki bölüme geçin. Tekil cüzdanlar için çoklu imza takma adlarını içe aktarmanıza gerek yoktur.

:::

Öncelikle, . Bunu yapmak için, anahtar ifadenizle cüzdanınıza giriş yapın ve Anahtarları Yönet bölümüne gidin (veya sağ üst köşedeki değişim düğmesine tıklayın).

Eğer bir çoklu imza cüzdanının üyesiyseniz, bir cüzdanları içe aktarma iletişim kutusu görünecektir. Çoklu imza cüzdanlarınızı içe aktarmak için "Cüzdanları İçe Aktar" butonuna tıklayın.

Sonrasında, çoklu imza adresinin sağındaki küçük yıldız simgesine tıklayarak etkinleştirin.

Daha ayrıntılı bilgi için lütfen  belgesine başvurun.



Şekil 1: Cüzdanları İçe Aktarma İletişim Kutusu




Şekil 2: Cüzdan Değiştirici İletişim Kutusu


## 2. Düğümünüzü Doğrulayıcı Olarak Ekleme

Camino Cüzdanı'ndaki 'Doğrulayıcı' bölümüne gidin ve "Bir Doğrulayıcı Düğümü Kurma" kısmını bulun.



Şekil 3: Doğrulayıcı Kurma


### Doğrulama ve İşlem Bitiş Tarihlerini Ayarlama

Lütfen süre bölümündeki "**Onayla**" butonunun şu anda devre dışı olduğunu unutmayın. Bunun nedeni, doğrulama bitiş tarihinin en az 6 ay ileride olması gerektiğidir. Bu nedenle, bu tarihi uygun bir şekilde güncellemelisiniz.

Ayrıca, "**İşlem Bitiş Tarihi**" alanını da güncellemeyi unutmayın. Bu alanın açıklaması yanıltıcı olabilir, çünkü aslında işlemin gerçekleştirileceği tarih ve saattir. Bu nedenle, çoklu imza cüzdanının diğer üyelerinin de işlemi imzalaması gerektiğini dikkate alarak mantıklı bir tarih ve saat seçmelisiniz.

:::caution BİTİŞ TARİHLERİ HAKKINDA NOT

Lütfen doğrulama ve işlem bitiş tarihlerini uygun değerlere ayarlamanın önemli olduğunu unutmayın.

| **Doğrulama Bitiş Tarihi**  |    Bu, en az 6 ay (183 gün) ileride bir tarihe ayarlanmalıdır.            |
| :-------------------------: | :-----------------------------------------------------------------------------: |
| **İşlem Bitiş Tarihi**     | Bu, gelecekte oldukça kısa bir zaman dilimine, örneğin 30 veya 60 dakikaya ayarlanmalıdır. |

:::

Uygun tarihler belirlendikten sonra sayfa aşağıdaki gibi görünecektir. İşleme devam etmek için **Onayla** butonuna tıklayın.



Şekil 4: Doğrulayıcı Kurma


### Doğrulayıcı Ekleme İşleminin Başlatılması

Sonrasında, işlemin bir özetini içeren ve bu işlemin geri alınamayacağına dair bir uyarı içeren bir ekran görünecektir. Detayları dikkatlice gözden geçirin ve memnun iseniz, işlemi başlatmak için **Gönder** butonuna tıklayın.



Şekil 5: İşlemi başlatmak için Gönder butonuna tıklayın


:::info TEKİL CÜZDANLAR

Aşağıdaki bölümler çoklu imza cüzdanları için tasarlanmıştır. Eğer bir tekil cüzdanınız varsa, işlemi doğrudan gerçekleştirebilirsiniz.

:::

### İmzaları Toplama

İşlemi başlattıktan sonra, aşağıda tasvir edilen bir ekrana benzer bir ekran görünecektir. Bu, bir çoklu imza cüzdanı olduğundan, işlemi gerçekleştirmek için yeterli sayıda imzanın toplanması gerekmektedir.



Şekil 6: İmzaları Toplama


### Bekleyen İşlemi İmzalama

Sonrasında, çoklu imza cüzdanının diğer üyeleri cüzdana giriş yaparak işlemi imzalamalıdır. Aşağıdaki ekran, bir üyenin göreceği ekranı göstermektedir:



Şekil 7: İşlemi İmzala


İmzalandıktan sonra:



Şekil 8: İmzalı İşlem


### İşlemi Gerçekleştirme

Bu noktada, çoklu imza cüzdanının herhangi bir üyesi işlemi gerçekleştirebilir. "İşlemi Gerçekleştir" butonuna tıkladıktan ve işlemi gerçekleştirmek için gönderdiğinizde, aşağıda gösterilen bir ekran göreceksiniz; bu ekran işlemin ne zaman gerçekleştirileceğini belirtir. Not edin ki bu, daha önce seçtiğiniz tarihtir.



Şekil 9: Gerçekleşmeyi Bekliyor


## 3. Doğrulayıcınızın çevrimiçi olduğunu doğrulayın

İşlemin gerçekleştirilme zamanı geldiğinde ve işlem gerçekleştirilmiş olduğunda, aşağıdaki gibi bir ekran görmelisiniz:



Şekil 10: Doğrulayıcı Düğümünüz çalışıyor.


Doğrulayıcı düğümünüzün durumunu kontrol etmek için Camino Explorer kullanarak nasıl kontrol edeceğinize dair daha fazla bilgi için lütfen  başvurun.