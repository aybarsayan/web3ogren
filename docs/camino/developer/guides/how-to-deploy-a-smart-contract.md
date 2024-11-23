---
sidebar_position: 10
title: Akıllı Sözleşme Nasıl Dağıtılır
description: Bu kılavuz, Remix IDE kullanarak C-Chain üzerinde bir Akıllı Sözleşmenin dağıtım sürecini açıklar.
---

# Akıllı Sözleşme Nasıl Dağıtılır

Bu kılavuz, bir örnek ERC20 akıllı sözleşmesinin Columbus test ağına nasıl dağıtılacağını açıklamaktadır.

## Gereksinimler

- **KYC doğrulamalı cüzdan:** Yalnızca KYC onaylı hesaplar Camino Ağı üzerinde akıllı sözleşmeler dağıtımına izin verilmektedir.
- **C-Chain Adresinde Fonlar:** C-Chain adresinizde CAM token'lerinin bulunduğundan emin olun. Bazı token'leri Discord kanalındaki çeşmeden alabilirsiniz.
- **MetaMask Cüzdanı:** MetaMask cüzdanınızı Columbus ağı ve hesabınızla bağlantı kuracak şekilde yapılandırın.

## Genel Bakış

1. Bir cüzdan oluşturun.
1. KYC doğrulama sürecini tamamlayın.
1. Discord çeşmesinden fon talep edin.
1. X-Chain ile C-Chain arasında çapraz zincir transferini gerçekleştirin.
1. Hesabınızı ve Columbus ağını MetaMask cüzdanınıza ekleyin.
1. Remix IDE'ye erişin & bir örnek ERC20 sözleşmesi içe aktarın.
1. Sözleşmeyi derleyin.
1. Gerekli detayları sağlayın ve sözleşmeyi dağıtın.
1. Yeni oluşturduğunuz token'i MetaMask ve Camino Cüzdanınıza ekleyin.

## 1. Cüzdan Oluşturma

Bir Camino Cüzdanı oluşturmak için lütfen  dökümantasyon sayfasında yer alan talimatları takip edin.

Eğer zaten bir cüzdanınız varsa, bir sonraki adıma geçebilirsiniz.

## 2. KYC Doğrulaması

Hesabınızın KYC onayı olduğundan emin olun. KYC doğrulama sürecini tamamlamak için  dökümantasyon sayfasını inceleyin.

Eğer hesabınız zaten KYC onaylıysa, bu adımı atlayabilirsiniz.

## 3. Discord Çeşmesinden Fon Talep Etme

Discord çeşmesinden fon talep etmek için  gidin ve aşağıdaki talimatları izleyin.

Discord çeşmesinden fon talep etmek için şu adımları izleyin:

1. Camino Discord sunucusuna katılın ve Community > Genel kanalına gidin.
1. Sohbete `/faucet` yazın. Kullanıcı arayüzü, verilen değişiklikleri yansıtacak şekilde güncellenecektir.
1. Camino Cüzdanınızdan X-Adresinizi kopyalayıp yapıştırın.
1. Talep etmek istediğiniz CAM miktarını yazın, komut, X-Adresi ve talep edilen miktarı boşluklarla ayırarak girin.

Lütfen 24 saat içinde talep edilebilecek maksimum miktarın 50 CAM olduğunu unutmayın.



Fig.1: Çeşmeden fon talebi


Yaklaşık bir veya iki dakika içinde, talep ettiğiniz miktarda CAM'ı Camino Cüzdanınıza almanız gerekir. Bunu Camino Cüzdanı arayüzünüzden doğrulayın.



Fig.2: Fon talep edildi!


Fonlar Camino Cüzdanınıza geldiğinde, X-Chain üzerinde olacaktır ve akıllı sözleşme dağıtımı için kullanabilmek için C-Chain'e transfer edilmesi gerekecektir.



Fig.3: Fonlar alındı!


## 4. Çapraz Zincir Transferi Gerçekleştirme

1. Camino Cüzdanının navigasyon çubuğunda "Çapraz Zincir" seçeneğine tıklayın.
1. "X" Kaynak Zincir olarak ve "C" Hedef Zincir olarak seçin.
1. Transfer Miktarı alanına istediğiniz miktarı girin ve "Onayla"ya tıklayın.



Fig.4: Formu doldurun ve onaylayın


Son olarak, çapraz zincir transferini başlatmak için "Transfer" butonuna tıklayın.



Fig.5: Transfer Butonuna Tıklayın


:::tip

Farklı zincirlerdeki bakiyeniz hakkında ayrıntılı bilgi görüntülemek isterseniz, bakiye görüntüleme alanının sağ tarafında bulunan "Ayrıntıları Göster" butonuna tıklayabilirsiniz.

:::

Transfer başarılı.



Fig.6: Transfer başarılı


## 5. Hesabınızı ve Columbus Ağını MetaMask Cüzdanınıza Ekleyin

Hesabınızı ve Columbus ağını MetaMask cüzdanınıza eklemek için lütfen  dökümantasyon sayfasında verilen talimatları izleyin.

## 6. Remix IDE'ye Erişin ve Örnek ERC20 Sözleşmesini İçe Aktarın

Remix IDE URL'sine gidin: https://remix.ethereum.org/

Remix IDE sayfasında, "OXPROJECT ERC20" üzerine tıklayarak örnek ERC20 sözleşmesini içe aktarın.



Fig.7: Remix IDE


## 7. Sözleşmeyi Derleyin

Gerekli dosyaları çalışma alanınıza içe aktardıktan sonra, "SampleERC20.sol" dosyasını seçin.



Fig.8: Dosyaları İçe Aktar


- Sözleşmenizi derlemek için, Remix IDE'deki "Solidity Compiler" sekmesine gidin.
- Uygun derleyici sürümünü seçin. Bu durumda v0.5.17'yi seçin.
- "Gelişmiş Yapılandırmalar" açılır menüsüne tıklayın ve EVM sürümü olarak "paris" seçin.
- "Compile SampleERC20.sol" butonuna tıklayarak derleme işlemine başlayın.



Fig.9: Sözleşme Derlendi


:::caution EVM SÜRÜMÜNÜ "PARIS" OLARAK AYARLAMAYI UNUTMAYIN

Lütfen Gelişmiş Yapılandırmalar bölümünden EVM sürümünü "paris" olarak seçin.



EVM sürümü olarak "paris" seçin


:::

## 8. Gerekli Detayları Sağlayın ve Sözleşmeyi Dağıtın

- Ortam açılır menüsünden "Injected Provider - MetaMask" seçeneğini belirleyin.
- "Dağıt" butonunun sağındaki ok simgesine tıklayarak menüyü genişletin.
- İstenilen değerleri NAME, SYMBOL, DECIMALS ve TOTALSUPPLY için girin. Aşağıda sağlanan örnekte, `9` ondalık ve `1000000000000000` kullanarak 1 milyon token mint ettik.
- Gerekli detayları doldurduktan sonra "transact" butonuna basarak devam edin.



Fig.10: Detayları doldurun ve dağıtın


- Sözleşmeniz dağıtıldıktan sonra, sözleşmeye tıklayarak sol alt köşedeki menüyü genişletin.



Fig.11: Dağıtılan sözleşmeye tıklayın


- Sözleşme adresini kopyalayıp kaydedin. Bunu yapmak için, dağıtılan sözleşmeler bölümünün altında, sözleşmenin sağ tarafında bulunan kopyala butonuna tıklayın. Bu sözleşme adresi, token'inizi cüzdanlara eklerken gereklidir.



Fig.12: Sözleşme adresini kopyalayın


## 9. Yeni Oluşturduğunuz Token'i MetaMask ve Camino Cüzdanına Ekleyin.

Tebrikler, kendi token'inizi oluşturdunuz! Şimdi token'inizi MetaMask ve Camino Cüzdanınıza ekleyelim.

### Token'inizi Camino Cüzdanına Ekleyin

- Cüzdanınızı açın ve Portföy sayfasına gidin.
- Varlıklar bölümünün altında "Token Ekle" butonunu bulun ve tıklayın.
- Sözleşme adresinizi "Token Sözleşme Adresi" alanına yapıştırın.
- Devam etmek için "Token Ekle" butonuna tıklayın.



Fig.13: Token'inizi Camino Cüzdanına ekleyin


- Token'iniz başarıyla cüzdanınıza eklendi. Artık arkadaşlarınıza gönderebilirsiniz. :)



Fig.14: Yeni token'inizin tadını çıkarın!


### Token'inizi MetaMask Cüzdanına Ekleyin

- Pencerenin altında "Token'leri İçe Aktar" seçeneğine tıklayın.



Fig.15: "Token'leri İçe Aktar" butonuna tıklayın


- Sözleşme adresinizi yapıştırın, geri kalan alanlar otomatik olarak doldurulacaktır.



Fig.16: Sözleşme adresini yapıştırın


- "Token'leri İçe Aktar" butonuna tıklayın.



Fig.17: Token'leri İçe Aktar'a tıklayın


- MetaMask'ta yeni token'inizi kullanmanın tadını çıkarın!



Fig.18: Keyfini çıkarın!
