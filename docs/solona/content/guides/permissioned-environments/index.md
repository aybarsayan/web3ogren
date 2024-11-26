---
date: 2024-03-25T00:00:00Z
difficulty: intermediate
title: "Solana İzinli Ortamlar Rehberi"
seoTitle: "Solana İzinli Ortamlar"
description:
  "Solana İzinli Ortamlar, Solana'nın hızını ve ölçeklenebilirliğini
  özel bir blok zincirinin düzenleyici ve uyumlu kontrolü ile bir araya getiriyor. 
  Kuruluşunuz için Solana İzinli Ortamları nasıl dağıtacağınızı ve entegre edeceğinizi öğrenin."
tags:
  - izinli ortamlar
  - SPE
keywords:
  - öğretici
  - blok zinciri geliştirici
  - blok zinciri öğreticisi
  - web3 geliştirici
---

Solana, ölçeklenmek üzere tasarlanmış yüksek performanslı bir blok zinciridir. 
Genellikle Solana ana ağı ile tanınmasına rağmen, temel olarak ana ağ, 
esnek Solana yazılım yığının yalnızca bir dağıtımı ve yapılandırmasıdır. Mevcut
Solana yazılımı, Kurumsal kullanım durumlarına uygun, amaç odaklı mantık ile
daha kontrol edilebilir ve izinli bir biçimde parametrize edilebilir. 
Burada Solana İzinli Ortamları (SPE'ler) devreye giriyor.

## Neden Solana İzinli Ortamlarla Geliştirme Yapmalısınız?

:::info
Solana'nın yüksek hızlı ağı olağanüstü performans sunarken, belirli sektörler ve
kullanım durumları, Solana ana ağının sağlayabileceğinden daha fazlasını 
gerektirebilir.
:::

Solana İzinli Ortamlar, kuruluşların özel veya yarı özel 
Solana tabanlı ağlar kurmasına olanak tanıyarak bir çözüm sunar.

> **SPE'ler aşağıdaki farklılıkları sunar:**
> 
> - **Tam Kontrol**: Ana ağın aksine, SPE'lerin operatörleri, ağın katılımcıları,
  altyapısı ve konsensüs mekanizmaları üzerinde tam kontrol sahibidir. 
  Ağın katılımcılarının bilinir ve gerekli uyum standartlarını karşıladığını
  sağlamak için ağın doğrulayıcı kümesini tanımlayabilirler. 
> - **Altyapı Egemenliği**: SPE'lerin operatörleri, doğrudan kontrol için kendi düğümlerini
  barındırabilir veya düğüm yönetim sorumluluklarını stratejik olarak belirli 
  ortaklara atayabilir. Bu, ağın fiziksel altyapısını şekillendirmede yüksek 
  derecede bir esneklik sağlar.
> - **Uyarlanabilir Konsensüs**: Belirli bir kullanım durumunun ihtiyaçlarına uyacak
  şekilde, SPE'ler çeşitli konsensüs mekanizmaları ile yapılandırılabilir veya
  alternatif bir konsensüs algoritması seçebilir. Bu uyarlanabilirlik, 
  katı düzenleyici kısıtlamalar veya belirli iş mantığı ile çalışırken idealdir.

Solana İzinli Ortamları ile kuruluşlar, kendi benzersiz iş, güvenlik ve
regülatif gereksinimlerine özel olarak tasarlanmış bir çerçeve içinde Solana 
blok zincirinin temel hız ve ölçeklenebilirliğinden yararlanma yeteneğine sahip olur. 
Bu, katılımcılar, altyapı ve hatta konsensüs mekanizmaları üzerinde olağanüstü
kontrol sunan bir çözümdür.

Aradığınız çözümün karmaşıklığına bağlı olarak, entegrasyonları genellikle 
düşük teknolojili tokenizasyon kullanım durumlarından karmaşık akıllı sözleşme
projelerine kadar uzanan "Entegrasyon Seviyeleri" içinde sınıflandırıyoruz.

## Solana İzinli Ortamlarla Entegrasyon Seviyeleri Nedir?

Solana İzinli Ortamlar, kullanım durumu ve gereksinimlerine bağlı olarak çeşitli 
karmaşıklık seviyelerinde entegre edilebilir. Benimsemeyi basitleştirmek ve 
esnekliği en üst düzeye çıkarmak için, SPE uygulamasına ilerleyici entegrasyon 
sebepleri ile yaklaşmayı düşünün.

:::note
Bu seviyeleri, bir kuruluşun hedefleri ve düzenleyici kısıtlamaları ile hizalamak, 
hangi seviyenin kullanım durumunuz için en uygun olduğunu belirlemenize yardımcı olabilir. 
Her seviye, yani alt seviyelerden başlayarak ihtiyaçlarınız geliştikçe 
daha yüksek seviyelere geçiş yapabilirsiniz.
:::

### Seviye 1: Yerel Tokenizasyon

Entegrasyonun ilk seviyesi, blok zincirinde varlıkları veya dijital hakları
temsil eden özel tokenların ihraç edilmesi ve yönetilmesini içerir. Bu seviye,
tokenizasyon kullanım durumları için Solana'nın hızını ve ölçeklenebilirliğini
kullanmayı hedefleyen kuruluşlar için uygundur. Bu seviyeye erişim için
gerekli olan gereksinimler minimaldir; çünkü mevcut
[Solana Program Library token araçlarını](https://spl.solana.com/token) kullanarak
token oluşturmayı içerir.

### Seviye 2: Mevcut Solana Programlarını Kullanma

İkinci entegrasyon seviyesi, mevcut Solana programlarını kullanarak 
kendi Solana İzinli Ortamınızın üzerine özel çözümler inşa etmeyi içerir. 
Bu mevcut programlar, tokenlarınızla birlikte escrows, vesting veya 
merkeziyetsiz borsa gibi karmaşık işlevsellikler ekleyebilir. 
Bu entegrasyonlar, ilk seviyede bulunan tokenizasyonu daha da geliştirebilir,
ancak mevcut ekosistem ve mevcut programlar hakkında bir aşinalık gerektirir. 
Bu seviyede kullanılabilecek birçok programı [Solana Program Library'de](https://spl.solana.com/) 
bulabilirsiniz.

### Seviye 3: Özel Programlar

Üçüncü entegrasyon seviyesi, SPE'niz için en yüksek özelleştirme seviyesini sunar: 
Özel Programlar. Özel programlarla, çok özel iş gereksinimlerini veya
düzenleyici kısıtlamaları ele almak için özel olarak tasarlanmış 
on-chain mekanikleri uygulayabilirsiniz. Özel programlar, gizlilik özelliklerinden,
karmaşık uygulamalardan yararlanmanıza ve benzersiz konsensüs mekanizmaları
tasarlamanıza yardımcı olabilir. Bu seviye için gereksinimler yüksektir; çünkü
Solana geliştirme ve kaynaklar hakkında derin bir anlayış gerektirir.

## Solana İzinli Ortamı Nasıl Dağıtabilirim?

Solana İzinli Ortamı, kuruluşunuzun ihtiyaçlarına ve kaynaklarına bağlı olarak
çeşitli yollarla dağıtılabilir. SPE'ler, test ve geliştirme için yerel olarak
dağıtılabilir veya özel altyapıda barındırılabilir. SPE'nizi dağıtmak için
[Helius](https://www.helius.dev/), [Triton](https://triton.one/) veya
[Edgevana](https://www.edgevana.com/) gibi bazı SPE sağlayıcılarını da kullanabilirsiniz.

### SPE'yi Yerel Olarak Dağıtma

#### Ön Koşullar

Devam etmeden önce, sisteminizde Docker'ın yüklü olduğundan emin olun.
Docker, SPE'niz için kapalı ve kontrol altında bir ortam oluşturmak için
gereklidir; bu da dağıtım ve yönetimi kolaylaştırır. Docker'ı henüz yüklemediyseniz,
lütfen ilgili işletim sisteminiz için [resmi Docker belgelerindeki](https://docs.docker.com/get-docker/) 
kurulum kılavuzunu takip edin.

#### SPE'nizi Kurma

Bir Solana İzinli Ortamı kurma süreci, depoyu klonlamayı, yapısını anlamayı 
ve SPE'nizi çalışır hale getirmek için gerekli komutları çalıştırmayı içerir. 
Tüm gerekli bileşenler ve talimatlar depoyu içeren GitHub'da `monogon` tarafından
yönetilmektedir. Depoyu [burada](https://github.com/monogon-dev/solana-spe) bulabilirsiniz.

#### Adım 1: Depoyu Klonlayın

Terminalinizi açın ve aşağıdaki Git komutunu kullanarak `solana-spe` deposunu klonlayın:

```sh
git clone https://github.com/monogon-dev/solana-spe.git
```

Klonladığınız deponun dizinine gidin:

```sh
cd solana-spe
```

#### Adım 2: Depo Yapısını Anlama

Dağıtıma devam etmeden önce, README dosyasını gözden geçirerek deponun
yapısıyla tanışın. Bu belge, projenin amacı, yapılandırma seçenekleri ve
SPE'nizi ayarlamak için ayrıntılı talimatlar dahil olmak üzere bir genel bakış
sunmaktadır.

#### Adım 3: Docker ile Dağıtım

Docker yüklü ve depo klonlanmış olduğuna göre, SPE'nizi dağıtmaya hazırsınız. 
Depo, SPE'nin ortamını tanımlayan bir Dockerfile ve docker-compose dosyaları
içermektedir ve sorunsuz bir kurulum süreci sağlanmaktadır.

Aşağıdaki komutu çalıştırarak Docker kullanarak SPE'nizi oluşturmaya ve başlatmaya
hazırlanın:

```sh
docker-compose up --build
```

Bu komut, sağlanan Dockerfile'a dayalı Docker görüntüsünü oluşturma sürecini
başlatır ve inşaat tamamlandıktan sonra SPE'yi başlatır. `--build` seçeneği,
Docker'ın yapılandırma veya Dockerfile'da yaptığınız değişiklikleri
kapsayarak resmi yeniden inşa etmesini garanti eder.

#### Adım 4: Dağıtımı Doğrulama

Docker konteynerleri çalışır durumda olduğunda, SPE'nizin başarılı bir şekilde 
dağıtıldığını doğrulamak için Solana CLI'ye veya SPE ile etkileşim için sağlanmış 
herhangi bir web arayüzüne erişebilirsiniz. Depodaki README dosyası, temel
işlemleri gerçekleştirmek ve ağın işlevselliğini doğrulamak için rehberlik
sunmalıdır.

#### SPE'nizi Özelleştirme

SPE'nin yapılandırması belirli gereksinimleri karşılayacak şekilde özelleştirilebilir.
Portlar, solana sürümü, konsensüs mekanizması, ağ izinleri ve işlem işleme limitleri
gibi parametreleri ayarlamak için deponun içindeki `.env` dosyasını keşfedin.

Daha ayrıntılı özelleştime için, [Solana belgelerine](https://solana.com/docs) ve 
deponun README dosyasına başvurun; bu, kurumsal uygulamalar için uygun olan
gelişmiş yapılandırma ve optimizasyon teknikleri hakkında bilgiler sunabilir.

## Sonuç

SPE'ler, Solana'nın yüksek performanslı blok zincirini kontrol edilen ve izinli
bir ortamda kullanmak isteyen kuruluşlar için çok yönlü bir çözüm sunar. 
Bir SPE dağıtarak, kuruluşlar, katılımcılar, altyapı ve konsensüs mekanizmaları 
üzerinde tam kontrol sağlarken, Solana'nın hızını ve ölçeklenebilirliğinden yararlanabilirler. 

:::tip
SPE'ler, kuruluşunuzun benzersiz iş gereksinimlerini ve düzenleyici kısıtlamalarını
karşılamalarına yardımcı olabilecek çeşitli uygulama seviyelerinde gelir.
:::