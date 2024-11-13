---
sidebar_position: 45
title: C-Chain'de KYC/KYB Durumlarını Sorgulama
description: Bu belge, C-Chain'deki bir adresin KYC/KYB durumlarını sorgulamak için Remix IDE'yi nasıl kullanacağınızı anlatmaktadır.
---

# C-Chain'de KYC/KYB Durumlarını Nasıl Sorgularım

Bu belge, C-Chain'deki bir adresin KYC/KYB durumlarını sorgulamak için  kullanma rehberi sunmaktadır. Aşağıdaki adımları izleyerek bu işlemi gerçekleştirebilirsiniz.

## Ön Koşullar

- MetaMask kurulumunun yapılmış olması ve işlevselliği

## MetaMask'a Camino Ağı Eklemek

Remix IDE'yi kullanarak bir adresin KYC/KYB durumlarını sorgulamak için MetaMask cüzdanını kullanacağız.

Öncelikle, MetaMask'a özel bir ağ eklememiz gerekiyor. Bu belgede, Columbus test ağını kullanacağız.

Özel bir ağ eklemek için  belgesine başvurun.

## MetaMask'i Remix IDE'ye Bağlamak

MetaMask'i IDE'ye bağlamak için aşağıdaki adımları izleyin:

- Remix IDE web sayfasını açın: https://remix.ethereum.org/
- Sağ taraftaki kenar çubuğunda **Deploy and run transaction** seçeneğine tıklayın.
- **Environment** açılır menüsünden **Inject Provider - MetaMask** seçeneğini seçin.



Fig.5: "Deploy and run transactions" sekmesine tıklayın ve "Environment" menüsünden "Inject Provider" seçeneğini seçin.


- MetaMask'in Remix IDE'ye bağlı olduğunu doğrulayın.



Fig.6: Ağın bağlı olduğunu doğrulayın.


## CaminoAdmin.abi Dosyasını İndirme

İsterseniz sözleşmeyi derleyebilir veya önceden derlenmiş ABI dosyasını kullanabilirsiniz. Bu rehberde ABI dosyasını kullanacağız.

ABI dosyasını Chain4Travel'in GitHub deposundan indirebilirsiniz: 


- "Raw" üzerine sağ tıklayın ve "Save as..." seçeneğini seçerek dosyayı yerel bilgisayarınıza kaydedin.



Fig.7: "CaminoAdmin.abi" dosyasını yerel bilgisayarınıza kaydedin.


## ABI Dosyasını Remix IDE'ye Yükleme

ABI dosyasını Remix IDE'ye yüklemek için aşağıdaki adımları izleyin:

- Sağ kenar çubuğunda **File Explorer**'a geçin ve yükleme butonuna tıklayın.
- Yerel bilgisayarınızdan indirdiğiniz dosyayı seçin ve yükleyin.



Fig.8: "File Explorer" sekmesine geçin ve "Yerel bir dosyayı mevcut çalışma alanına yükle" seçeneğine tıklayın.


- `CaminoAdmin.abi` dosyasını seçin.



Fig.9: Yüklenen ABI dosyasını seçin.


## CaminoAdmin Sözleşme Adresini Alma

**Camino Admin Adresi**: `0x010000000000000000000000000000000000000a`

Camino sözleşme adreslerini  sayfasında `Geliştirici` > `Referanslar` altında bulabilirsiniz.



Fig.10: CaminoAdmin sözleşme adresini alın.


## Adresle Etkileşimde Bulunma

- Adresi **At Address** alanına yapıştırın ve butona tıklayın.



Fig.11: Sözleşme adresini "At Address" alanına yapıştırın ve "At Address" butonuna tıklayın.


- Etkileşimi onaylayın.



Fig.12: Açılan iletişim kutusunu onaylayın.


## Sorgulama Yapma

Sorgulama yapmak için aşağıdaki adımları izleyin:

- Sözleşme yöntemleri listesini açmak için oku tıklayın.



Fig.13: Dropdown açmak için oku tıklayın.


- KYC/KYB durumlarını sorgulamak istediğiniz adresi alana yapıştırın ve **`getKycState`** butonuna tıklayın.

:::note

Bu, `0x` ile başlayan bir C-Chain adresidir.

Eğer **P-Chain adresini** sorgulamak isterseniz,

metoduna bakınız.

:::



Fig.14: Sorgulamak istediğiniz adresi yapıştırın ve getKycState butonuna tıklayın.


## Sonuç

- Sorgulamanın sonucu **`getKycState`** butonunun altında görüntülenecektir.

- Yaygın değerler şunlardır:

| Değer |       Durum        | Açıklama                                               |
| :---: | :----------------: | ----------------------------------------------------- |
|  `0`  |  Doğrulama Yok     | Verilen adres KYC doğrulamasından geçmemiştir         |
|  `1`  |    KYC Doğrulandı  | Verilen adres KYC doğrulamasından geçmiştir           |
| `256` |    KYB Doğrulandı  | Verilen adres KYB doğrulamasından geçmiştir           |
| `257` | KYC & KYB Doğrulandı | Verilen adres KYC & KYB doğrulamasından geçmiştir   |

## KYC/KYB Durum Bitleri

KYC/KYB durumları, uint256 değişkenindeki bitler tarafından temsil edilir. Aşağıdaki tablo, her bir bitin karşılık geldiği bilgiyi gösterir:

| Bit | Bilgi         |
| :-: | :-----------: |
| `0` | KYC Doğrulandı |
| `1` | KYC Süresi Dolmuş |
| `8` | KYB Doğrulandı |

### KYC Doğrulandı Adres için Örnek Sonuç



Fig.15: KYC Doğrulandı adres için örnek sonuç.


### Doğrulanmamış Adres için Örnek Sonuç



Fig.16: Doğrulanmamış adres için örnek sonuç.


### KYC & KYB Doğrulandı Adres için Örnek Sonuç



Fig.17: KYC & KYB Doğrulandı adres için örnek sonuç.


:::info Sonuç

C-Chain'deki akıllı sözleşmeler, etkileşimde bulundukları bir adresin KYC/KYB doğrulamasından geçip geçmediğini doğrulamak için CaminoAdmin sözleşmesinden bilgi alabilir.

Bu fonksiyon, geliştiricilerin böyle bir bilginin gerekli olduğu kullanım senaryoları oluşturmasını sağlamakta önemli bir rol oynamaktadır.

:::