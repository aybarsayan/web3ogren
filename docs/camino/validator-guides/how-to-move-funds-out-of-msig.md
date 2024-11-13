---
sidebar_position: 50
title: Çok İmzalı Cüzdanla Fon Nasıl Transfer Edilir?
description: Bu kılavuz, çok imzalı bir cüzdandan fon transfer etme talimatlarını sunmaktadır.
---

# Çok İmzalı Cüzdanla Fon Nasıl Transfer Edilir?

:::info Çok İmzalı Cüzdan Nedir?

Çok imzalı cüzdanlar hakkında daha fazla bilgi edinmek için lütfen  belgesine başvurun.

:::

:::danger UYARI: Çok İmzalı Cüzdanın C-Chain Adresine Fon Göndermeyin

Başka bir cüzdandan çok imzalı cüzdanın C-Chain adresine fon gönderme işlevinin hala geliştirilmekte olduğunu lütfen unutmayın. Bunun yapılmasını kesinlikle tavsiye etmiyoruz, çünkü fonlarınız sıkışabilir ve geri alınamaz hale gelebilir.

:::

## Amaç

Bir çok imzalı cüzdanınız var, bu cüzdan bir veya daha fazla sahip ile bir eşik değerine sahiptir. Bu cüzdandaki fonları C-Chain üzerinde kullanmak istiyorsunuz; C-Chain, Ethereum ile uyumlu bir akıllı sözleşme zinciridir.

Bunu başarmak için, önce çok imzalı cüzdandan sıradan (tek imzalı) bir cüzdana fon transfer etmeniz, ardından da C-Chain'e çapraz zincir transferi gerçekleştirmeniz gerekecek.

Fonlarınız C-Chain üzerinde olduğunda, bunları Metamask ile diğer adreslere fon transferi yapmak, akıllı sözleşmeleri dağıtmak ve etkileşimde bulunmak gibi işlemler için kullanabilirsiniz.

## Ana Hat

1. Çok imzalı cüzdandan P-Chain'den P-Chain'e transfer başlatın.
2. Çok imzalı cüzdanın eşiği birden fazla ise, diğer sahip cüzdanlardan birinin veya daha fazlasının başlatılan işlemi imzalamasını sağlayın.
3. Çok imzalı P > P işlemini gerçekleştirin.
4. Tek imzalı cüzdanda fonları aldığınızı doğrulayın.
5. Tek imzalı cüzdandan çapraz zincir transferi gerçekleştirin.
6. Artık C-Chain'de fonlarınızın olduğunu doğrulayın.

### 1. Transferi Başlatma

#### Tek İmzalı Cüzdanın P-Chain Adresini Alın

Öncelikle, tek imzalı cüzdanınızın P-Chain adresini almanız gerekmektedir. Cüzdana giriş yapın ve P-Chain adresini kopyalayın.



Şekil 1: Tek İmzalı Cüzdanın P-Chain Adresini Alın


#### P > P Transferini Başlatma

Şimdi, çok imzalı cüzdanın sahiplerinden biri olan cüzdanınıza giriş yapın. Ardından cüzdanın "Gönder" bölümüne gidin. Kaynak zincir olarak P'yi seçin ve "Miktar" ve "Alıcı Adresi" alanlarını doldurun. Son olarak, "Onayla" butonuna tıklayın.



Şekil 2: Formu Doldurun ve Onayla'ya Tıklayın


#### İşlemi Gönder

Gerekli bilgileri doldurduktan sonra, "İşlemi Gönder" butonuna tıklayarak işlemi onaylamanız gerekecek.



Şekil 3: Yeniden Onaylamak İçin İşlemi Göndere Tıklayın


Önceki adımı tamamladıktan sonra, aşağıdaki ekranı görmelisiniz. İşlem artık başlatılmıştır ve cüzdanın diğer sahiplerinden imza beklemektedir.



Şekil 4: İşlem Başlatıldı ve İmzalar Bekleniyor


### 2. İşlemi İmzalama

Bu aşamada, çok imzalı cüzdanın diğer bir sahibi cüzdana giriş yapmalı ve cüzdanın "Gönder" bölümüne gitmelidir. İşlem, imzalamak için mevcut olmalıdır.



Şekil 5: Diğer Bir Sahip ile İşlemi İmzala


"İmzala" butonuna tıkladığınızda, aşağıda gösterildiği gibi "İşlemi Gerçekleştir" butonunu göreceksiniz veya çok imzalı cüzdanın eşiği ikiden fazla ise, başka bir cüzdana giriş yapmanız ve eşiği karşılamak için oradan imzalamanız gerekecektir.

### 3. P > P İşlemini Gerçekleştirme

İşlemi göndermek için "Gerçekleştir" butonuna tıklayın.



Şekil 6: İşlemi Gerçekleştir


### 4. Tek İmzalı Cüzdanda Fonların Alındığını Doğrulama

Tek imzalı cüzdanınıza tekrar giriş yaparak P-Chain'de fonları aldığınızı doğrulayın. Bunu yapmak için, "Ayrıntıları Göster" butonuna tıklayın.

:::info Bakiyeyi Yenile

Eğer bakiye güncellenmemişse, toplam bakiyenin sağ üst köşesinde bulunan yenile butonuna tıklayın.

:::



Şekil 7: Bakiyeyi Doğrula


### 5. P-Chain'den C-Chain'e Çapraz Zincir Transferi

Cüzdanın "Çapraz Zincir" bölümüne gidin. Kaynak zincir olarak "P Zinciri" ve varış zinciri olarak "C Zinciri"ni seçin. İstenilen transfer miktarını girin ve "Onayla" butonuna tıklayın.



Şekil 8: Çapraz Zincir Transferini Gerçekleştir P > C


Transfer butonuna tıklayın.



Şekil 9: Transfer Butonuna Tıklayın


Eğer işlem başarılıysa, aşağıdaki ekrana benzer bir ekran ile karşılaşacaksınız.



Şekil 10: İşlem Başarılı


### 6. C-Zincir'nde Fonlarınızın Olduğunu Doğrulama

Çapraz zincir transferini tamamladıktan sonra, fonların C-Zincir'e başarıyla transfer edildiğini doğrulamak için ayrıntılı bakiyeyi kontrol edin. Artık bu fonları akıllı sözleşmelerle etkileşimde bulunmak veya C-Zincir'deki diğer işlemleri gerçekleştirmek için kullanabilirsiniz. Keyfini çıkarın!