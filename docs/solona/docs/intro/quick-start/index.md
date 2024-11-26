---
sidebarLabel: Hızlı Başlangıç  
title: Solana Hızlı Başlangıç Kılavuzu  
sidebarSortOrder: 0  
description:  
  Solana geliştirme temellerini öğrenin. İlk programınızı oluşturun, hesapları  
  anlayın, işlemler gönderin ve Solana Playground kullanarak PDA'ları ve CPI'leri  
  keşfedin - herhangi bir kurulum gerektirmeden.  
---

Solana Hızlı Başlangıç Kılavuzuna hoş geldiniz! Bu uygulamalı kılavuz, Solana üzerinde  
inşa etmenin temel kavramlarını tanıtacaktır, önceki deneyiminiz ne olursa olsun.  
Bu eğitim sonunda, Solana geliştirme ile ilgili temel bir temel bilgisine sahip olacak  
ve daha ileri konuları keşfetmeye hazır olacaksınız.

## Öğrenecekleriniz

Bu eğitimde, şunları öğreneceksiniz:

- **Hesapları Anlamak**: Verilerin Solana ağı üzerinde nasıl depolandığını keşfedin.  
- **İşlem Göndermek**: İşlemler göndererek Solana ağıyla nasıl etkileşimde bulunulacağını öğrenin.  
- **Programlar Oluşturmak ve Dağıtmak**: İlk Solana programınızı oluşturun ve ağına dağıtın.  
- **Program Türevli Adresler (PDA'lar)**: Hesaplar için deterministik adresler oluşturmak üzere PDA'ları nasıl kullanacağınızı öğrenin.  
- **Çapraz Program Çağrıları (CPI'ler)**: Programlarınızı Solana'daki diğer programlarla nasıl etkileşimde bulunacak şekilde tasarlayacağınızı öğrenin.  

En güzel kısım? Hiçbir şey kurmanıza gerek yok! Tüm örneklerimiz için bir tarayıcı tabanlı  
geliştirme ortamı olan Solana Playground'u kullanacağız. Bu, kodları kopyalayabileceğiniz,  
yapıştırabileceğiniz ve hemen sonuçları görebileceğiniz anlamına gelir, hepsi web  
tarayıcınızdan. Temel programlama bilgisi yardımcı olsa da gereklidir.

Haydi başlayalım ve Solana üzerinde inşa edelim!

## Solana Playground

Solana Playground (Solpg), Solana programlarını hızlı bir şekilde geliştirmeye,  
yayınlamaya ve test etmeye olanak tanıyan bir tarayıcı tabanlı geliştirme ortamıdır!

Tarayıcınızda yeni bir sekme açın ve şu adrese gidin: [https://beta.solpg.io/](https://beta.solpg.io/).


  Önemli Notlar
  
  :::info
  Solana Araç Kutunuz her zaman güncel olmalıdır. Geliştirme sürecinizde karşılaşabileceğiniz  
  değişiklikler ve güncellemeler için Solana [belgelerini](https://docs.solana.com/) kontrol edebilirsiniz.
  :::


### Playground Cüzdanı Oluşturma

Solana Playground'a yeniyseniz, ilk adımınız Playground Cüzdanınızı oluşturmaktır.  
Bu cüzdan, tarayıcınızdan Solana ağıyla etkileşimde bulunmanızı sağlayacaktır.

#### Adım 1. Playground'a Bağlanın

Ekranın sol alt köşesindeki "Bağlı Değil" butonuna tıklayın.

![Bağlı Değil](../../../images/solana/public/assets/docs/intro/quickstart/pg-not-connected.png)

#### Adım 2. Cüzdanınızı Oluşturun

Cüzdanınızın anahtar çiftini kaydetme seçeneğini göreceksiniz. İsteğe bağlı olarak,  
cüzdanınızın anahtar çiftini yedeklemek için kaydedin ve ardından "Devam Et"e tıklayın.

![Playground Cüzdanı Oluşturma](../../../images/solana/public/assets/docs/intro/quickstart/pg-create-wallet.png)

Artık cüzdanınızın adresini, SOL bakiyesini ve bağlı küme (varsayılan olarak devnet)  
bilgilerini pencerenin altında göreceksiniz.

![Bağlı](../../../images/solana/public/assets/docs/intro/quickstart/pg-connected.png)


  Playground Cüzdanınız tarayıcınızın yerel depolamasında kaydedilecektir. Tarayıcı  
  önbelleğinizi temizlemek, kaydedilen cüzdanınızı kaldıracaktır.  


:::tip
Yardımcı bulabileceğiniz bazı tanımlar:
:::

- **_Cüzdan adresi_**: Bir dijital cüzdan için benzersiz bir tanımlayıcı, bir blockchain'de  
  kripto varlık gönderme veya alma amacıyla kullanılır. Her cüzdan adresi, ağ üzerinde  
  belirli bir hedefi temsil eden alfasayısal karakterler dizisidir. Bunu bir e-posta adresi  
  veya banka hesap numarası gibi düşünün - birisi size kripto para göndermek isterse,  
  fonları yönlendirmek için cüzdan adresinize ihtiyaç duyar.
  
- **_Bağlı küme_**: Blockchain'in senkronize bir kopyasını korumak için birlikte çalışan  
  bir dizi ağ düğümü. Bu kümeler, merkeziyetsiz, dağıtılmış bir defter sağlamak ve  
  işlemleri doğrulayıp zinciri güvence altına alarak Solana ağını güçlendirmek için  
  gereklidir.

### Devnet SOL Almak

İnşa etmeye başlamadan önce, önce biraz devnet SOL'e ihtiyacımız var.

Bir geliştirici perspektifinden, SOL birçok ana kullanım durumu için gereklidir:

- Veri saklayabileceğimiz veya programları dağıtabileceğimiz hesaplar oluşturmak için  
- Ağla etkileşime geçtiğimizde işlem ücretlerini ödemek için  

Cüzdanınızı devnet SOL ile finanse etmenin iki yöntemi aşağıda verilmiştir:

#### Seçenek 1: Playground Terminal'ını Kullanarak

Cüzdanınızı devnet SOL ile finanse etmek için. Playground terminalinde şu komutu çalıştırın:

```shell filename="Terminal"
solana airdrop 5
```

#### Seçenek 2: Devnet Musluğunu Kullanarak

Eğer airdrop komutu çalışmazsa (oran sınırları veya hataları nedeniyle), [Web Musluğu](https://faucet.solana.com/) kullanabilirsiniz.

- Cüzdan adresinizi (Playground ekranının altında bulabilirsiniz) girin ve bir  
  miktar seçin.
- Devnet SOL almak için "Airdrop'u Onayla" butonuna tıklayın.

![Musluk Airdrop](../../../images/solana/public/assets/docs/intro/quickstart/faucet-airdrop.gif)