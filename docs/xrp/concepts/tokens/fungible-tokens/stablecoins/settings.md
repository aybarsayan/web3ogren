---
title: Stabilcoin Ayarları
seoTitle: Stabilcoin Ayarları - İhraç Öncesi Rehber
sidebar_position: 1
description: Stabilcoininizi ihraç etmeden önce gerekli ayarlamaları yapmalısınız. Bu makale, ihraç ve dağıtım hesaplarının kurulumu, transfer ücretlerinin belirlenmesi ve varlık kontrol özellikleri hakkında kapsamlı bilgiler sunmaktadır.
tags: 
  - stabilcoin
  - ihraç
  - dağıtım
  - transfer ücreti
  - KYC
  - geri alma
  - dondurma
keywords: 
  - stabilcoin
  - ihraç
  - dağıtım
  - transfer ücreti
  - KYC
  - geri alma
  - dondurma
---

# Stabilcoin Ayarları

Yeni stabilcoin'inizi ihraç etmeden önce ayarlamaları yapılandırmanız gerekmektedir; bazıları, ilk coin'i ihraç ettikten sonra değiştirilemez.

## İhraç ve Dağıtım Hesaplarınızı Oluşturun

_Ihraççı_ olarak adlandırdığınız yeni bir hesap oluşturun, bazen buna "soğuk" cüzdan da denir. Hesabın kendisinde farklı veya özel bir şey yoktur, sadece **nasıl kullandığınızdır**. Bu hesabı stabilcoin'inizi ihraç etmek için kullanın.

Birçok uygulama, _yedek_ bir hesabı "sıcak" cüzdan olarak kullanır. Güvenilir insan operatörleri, yedek hesabı kullanarak stabilcoin’leri _operasyonel_ hesaplara dağıtır.


Operasyonel hesaplar veya "sıcak" cüzdanlar, XRPL üzerinde diğer hesaplarla ticaret yapar. İnternet bağlantılı otomatik sistemler, günlük işlerini yürütmek için bu adreslere ait gizli anahtarları kullanarak, müşteri ve ortaklara transferler gibi işlemler gerçekleştirir.

:::tip
Yedek ve operasyonel hesapları kullanmak, ihraç hesaplarını hackleme saldırılarından izole etmeye yardımcı olur.
:::

---

## Transfer Ücretinizi Belirleyin

Transfer ücreti ayarı, kullanıcıların hesaplar arasında token transferi yaparken yüzde bazında bir **ücret alır**.

Kullanıcılar bir token'ı transfer ücreti ile gönderdiğinde, transfer ücreti, gönderim tarafından hedef tutara ek olarak gönderim tarafından düşülür, ancak yalnızca hedef tutar alıcıya kredilendirilir. Ücret tutarı "yok olur" ve XRP Genel Kitap'tan kaybolur. 

> Bu, kaynaklarınızda, XRP Genel Kitap'tan bağımsız olarak, o kadar çok hisse kazanmanız anlamına gelir. — Stabilcoin Satış Kılavuzu

Daha fazla bilgi için `Transfer Ücretleri` sayfasına bakın.

---

## Tick Boyutunuzu Belirleyin

Tick Boyutu ayarı, `Merkeziyetsiz Takas` içindeki döviz kurlarını hesaplamak için kullanılan ondalık basamak sayısını kontrol eder. Daha yüksek bir Tick Boyutu (daha fazla ondalık basamak) daha fazla hassasiyet ve çeşitli ticaret miktarlarında daha az yuvarlama anlamına gelir.

Tick Boyutu, hesap düzeyinde bir ayardır ve aynı adres tarafından ihraç edilen tüm token'lara uygulanır.

`Tick Boyutu` sayfasına bakın.

---

## Varsayılan Ripple Bayrağını Ayarlayın

Varsayılan Ripple bayrağı, bir güven çizgisindeki bakiyelerin varsayılan olarak _ripple_ olmasına izin verilip verilmediğini kontrol eder. Ripple, müşterilerin token'ları birbirlerine göndermelerini ve ticaret yapmalarını sağlar. 

Müşterilerden, ihraç adresinize güven çizgileri oluşturmasını istemeden önce, o adreste Varsayılan Ripple bayrağını etkinleştirin. Aksi takdirde, diğer adreslerin oluşturduğu her güven çizgisi için No Ripple bayrağını bireysel olarak devre dışı bırakmalısınız.

`Rippling` sayfasına bakın.

---

## Hedef Etiketlerini Etkinleştir

Eğer stabilcoin uygulamanız, birkaç müşteri adına işlemleri yönetiyorsa, hangi hesaba kredi vermeniz gerektiği hemen belli olmayabilir. **Hedef etiketleri**, göndericinin bir ödemenin faydalanıcısını veya hedefini belirtmesini isteyerek bu durumu önlemeye yardımcı olur. 

`RequireDest` bayrağını etkinleştirmek için, `AccountSet` işlemindeki `SetFlag` alanında `asfRequireDest` değerini (1) ayarlayın.

`Kaynak ve Hedef Etiketleri` sayfasına bakın.

---

## Varlık Kontrol Özellikleri

Stabilcoin'lerinizin yaratımını ve dağıtımını kontrol etmek için birkaç seçeneğiniz vardır.

### Yetkili Güven Çizgileri

Müşteri Tanıma (KYC) ve Kara Para Aklama (AML) gibi uyum kurallarına uymanız gerektiğinde, stabilcoin'inizin dağıtımı için izinli havuzlar oluşturmak üzere güven çizgilerini kullanabilirsiniz. Bu, fonların kime aktarıldığından emin olmanızı sağlar.

`Yetkili Güven Çizgileri` sayfasına bakın.

### Dondurma Bayrakları

Stabilcoin'lerinizi tutucu hesaplarınızda dondurma yeteneğine sahipsiniz. Bunu dolandırıcılık faaliyetinden şüphelendiğinizde veya bekletmeler uygulamak için yapabilirsiniz. 

Aksine, Dondurma özelliğini devre dışı bırakabilir ve token'leri dondurma yeteneğini kalıcı olarak tamamen bırakabilirsiniz. 

`Token'leri Dondurma` sayfasına bakın.

### Geri Alma Bayrakları

_( `Geri Alma değişikliği` gerektirir)_

Geri alma, belirli koşullar altında bir güven çizgisinden stabilcoin'leri geri almak veya _geri almak_ için izin verir. Bu, kaybolan hesap erişimi veya kötü niyetli faaliyet gibi zorluklara yanıt verme yeteneğinizi artırır.

`Geri Alma` sayfasına bakın.

### Sabit Arz

Stabilcoin'lerinizi sabit bir sayıya kısıtlamak, gelecekte daha fazla token ihraç etmeye karar verseniz bile stabilcoin değerinin aşınmasını garanti eder.

Sabit arz oluşturmak için:

1. İhraç cüzdanınıza benzer ayarlara sahip bir dağıtım cüzdanı oluşturun.
2. İhraç cüzdanı ile dağıtım cüzdanı arasında bir güven çizgisi ayarlayın.
3. İhraç cüzdanından tüm token'leri dağıtım cüzdanına gönderin.
4. İhraç hesabınızı kapatın.