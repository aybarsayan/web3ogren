---
sidebar_position: 30
title: Cüzdan ile Bir Doğrulayıcı Düğümu Eklemek
description: Camino Cüzdan ile Doğrulayıcı Düğümü nasıl ekleneceği
---

# Cüzdan Kullanarak Bir Doğrulayıcı Düğümü Eklemek

Bu kılavuz, Camino Cüzdanı ile konsorsiyum üyesi adresinizi kullanarak bir doğrulayıcı düğümü ekleme sürecinde size rehberlik edecektir.

:::info ÇOKLU İMZA CÜZDANLAR

Çoğu konsorsiyum üyesinin cüzdanlarının çoklu imza (multi-sig) cüzdanlar olduğunu lütfen unutmayın. Eğer cüzdanınız da bir çoklu imza cüzdanıysa, lütfen  belgelerini inceleyin.

:::

:::tip CÜZDAN ADRESİ

Lütfen bu kılavuz için doğru cüzdan adresini kullandığınızdan emin olun: https://suite.camino.network/

:::

:::caution CÜZDAN ADRESİNİ DOĞRULA

Cüzdanı kullanırken her zaman alan adının **camino.network** olduğundan emin olun.



:::

## Genel Bakış

Camino Cüzdanı ile bir doğrulayıcı düğümü eklemek için aşağıdaki adımları takip etmeniz gerekmektedir:

1. Gereksinimleri kontrol edin ve doğrulayın
2. Düğümünüzün özel anahtarını alın
3. Düğümünüzü cüzdanınızla kaydedin
4. Düğümünüzü bir doğrulayıcı olarak ekleyin
5. Doğrulayıcının çevrimiçi olduğunu doğrulayın

## 1. Gereksinimler

Doğrulayıcı düğümü ekleme sürecine başlamadan önce karşılamanız gereken birkaç gereksinim bulunmaktadır. Aşağıda, ana ağ (`camino`) ve test ağ (`columbus`) için bu gereksinimlerin bir listesi verilmiştir.

### **Camino Ana Ağı** ve **Columbus Test Ağı**

- **NodeID**: Bu, bir cüzdan adresine benzer şekilde düğümünüzün adresidir.
- **Düğümün Özel Anahtarı**: Bu, **NodeID** mülkiyetinizi kanıtlamak için gereklidir.
  Güvende ve güvende tutun!
- Cüzdanınızda **100,000 bağlı olmayan CAM** olmalıdır. Ayrıca işlem ücretlerini ödemek için birkaç CAM daha gerekmektedir.
- **Konsorsiyum Üyesi**: Cüzdan adresiniz bir konsorsiyum üyesi olmalıdır.
  Bunu bilmediğiniz takdirde, lütfen açıklama almak için  üzerinden bizimle iletişime geçin. Ön satışa katıldıysanız, zaten bir Konsorsiyum Üyesisiniz.
- **KYC/KYB Doğrulanmış**: Müşteri Tanıma (KYC) veya İşletme Tanıma (KYB) doğrulamasına sahip olmalısınız.

### Gereksinimleri Camino Cüzdanı ile Kontrol Etme

Bu gereksinimleri karşılayıp karşılamadığınızı, cüzdanınıza giriş yaptıktan sonra cüzdanınızdaki Doğrulayıcı sekmesine erişerek doğrulayabilirsiniz.

Eğer bazı gereksinimler karşılanmazsa, aşağıda benzer bir sayfa göreceksiniz:



Şekil.1: KYC Doğrulanmış ancak Konsorsiyum Üyesi Olmayan Adres Örneği




Şekil.2: Konsorsiyum Üyesi adresi örneği


## 2. Düğümünüzün Özel Anahtarını Almak

Düğümünüzü konsorsiyum adresinize kaydetmek için, düğümün mülkiyetini kanıtlamanız gerekmektedir. Bu nedenle, cüzdanın düğümün özel anahtarı ile düğüm kaydetme işlemini imzalaması gerekecektir. Bu sebeple cüzdanınıza düğümünüzün özel anahtarını sağlamanız gerekiyor.

Düğümünüzün özel anahtarını nasıl alacağınız hakkında daha fazla bilgi için lütfen  kılavuzuna başvurun.

## 3. Düğümünüzü Kaydedin

Yukarıda belirtilen gereksinimleri karşıladıysanız, düğümünüzü kaydetmeye devam edebilirsiniz. Şekil.2 ekran görüntüsündeki gibi bir sayfa görmelisiniz.
Düğümünüzün özel anahtarını belirtilen alana girin ve `DOĞRULAYICI DÜĞÜMÜ KAYDET` butonuna tıklayın.



Şekil.3: Düğümünüzün Özel Anahtarını Girin


## 4. Düğümünüzü Bir Doğrulayıcı Olarak Ekleyin

Düğümünüzü başarıyla kaydettikten sonra, doğrulayıcı sayfası güncellenecek ve aşağıdaki gibi görünecektir:



Şekil.4: Doğrulayıcı Düğümü Kurma


### Gerekli Bilgileri Girin

- **Node ID**: Düğümünüzün ID'si, adresinizin kayıtlı düğümünden otomatik olarak alınacaktır.
- **Doğrulama Bitiş Tarihi**: Doğrulama süresinin sona ermesini istediğiniz tarihi girin. Minimum değer iki haftadır ve maksimum bir yıldır. Maksimum değer için `MAX` butonuna tıklayabilirsiniz.
- **Bağlı Miktar**: Camino için bu değer, 100,000 CAM'dır. Alan bu değerle önceden ayarlanmış olarak gelecektir.

:::info

Yukarıdaki ekran görüntüsünde gösterilen değerin 2000 CAM olduğunu lütfen unutmayın. Bu, yalnızca dokümantasyon amacıyla, gelişim ağı kullanıldığı için belirlenmiştir.

:::

### Onayla & Gönder

Gerekli bilgileri doldurduktan sonra, sayfanın sağ tarafında yer alan Onayla butonuna tıklayın. Girdiğiniz bilgiler size sunulacaktır.

Bilgileri dikkatlice kontrol edin ve memnun kaldıysanız, Gönder butonuna tıklayın.

:::caution

Lütfen unutmamanız gereken bir diğer husus, bir doğrulayıcı ekledikten sonra bu işlemi geri alamayacağınız veya doğrulama süresinin son tarihini değiştiremeyeceğinizdir.
Bu nedenle, gönderimden önce girilen bilgileri bir kez daha kontrol etmek önemlidir.

:::



Şekil.5: Bilgileri Doğrulayın ve İşlemi Gönderin


## 5. Doğrulayıcınızı Kontrol Edin

İşleminizi gönderdikten sonra, durumu onaylı olarak yeşil bir tik ile görmelisiniz:



Şekil.5-b: Başarılı İşlem


### 5.1 Camino Explorer'ı Kontrol Etme

Birkaç dakika içinde, doğrulayıcınız  çevrimiçi olmalıdır.

:::tip Doğrulayıcılar Listesi

**Doğrulayıcılar Listesine** erişmek için Camino Explorer'da "Doğrulayıcı Sayısı"na tıklayın:



:::

### Doğrulayıcı Eklenmeden Önce



Şekil.6: Doğrulayıcı Eklenmeden Önce: P-Chain Son İşlemler




Şekil.6-b: Doğrulayıcı Eklenmeden Önce: Doğrulayıcılar Listesi


### Doğrulayıcı Eklendikten Sonra



Şekil.7: Doğrulayıcı Eklendikten Sonra: P-Chain Son İşlemler




Şekil.7-b: Doğrulayıcı Eklendikten Sonra: Doğrulayıcılar Listesi


## Her Şey Tamam!

Tebrikler! Başarıyla bir doğrulayıcı düğüm eklediniz.



Şekil.8: Doğrulayıcı Düğümmü Bilgisi


Ayrıca Camino Cüzdanı'nda Doğrulayıcı sekmesindeki Ödüller bölümünden Doğrulayıcı Ödüllerini kontrol edebilirsiniz:



Şekil.9: Doğrulayıcı Ödülleri
