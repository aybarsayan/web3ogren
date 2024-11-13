---
sidebar_position: 3
description: Columbus testnet hakkında, nasıl katılacağınız ve neler bekleyeceğiniz.
---

# Columbus Test Ağı

Columbus testneti, hem ağa katılmayı öğrenmek hem de zincir üstü uygulamaları geliştirmek ve test etmek için tam donanımlı bir platformdur.

## Neler Beklemeli

Columbus testneti sürekli bir iyileştirme süreci içerisindedir ve geliştirme ekipleri, her zaman çalışır durumda bir ağ elde etmeye çalışsalar da, testnetin sıfırdan yeniden inşa edilmesi gerekebilir. Bu nedenle, testnet üzerindeki her şeyin herhangi bir zamanda sıfırlanabileceğini unutmayın ve üretim ortamlarının ağın durumuna bağlı olmadığını göz önünde bulundurun.

## Zincir Üstü Geliştirme

Zincir üstü geliştirme için, Solidity tabanlı akıllı sözleşmeleri dağıtmak ve test etmek için tek yapmanız gereken, Columbus ağına bir RPC/HTTP uç noktası sağlamaktır. Ana HTTP/RPC düğümümüz **`https://columbus.camino.network`** adresinden ulaşılabilir. Varsayılan olarak, HTTPS portu `443` ve düğümün varsayılan portu `9650` her ikisi de HTTP Destekli Columbus testnet düğümümüze yönlendirilmiştir, bu nedenle bir port belirtmeniz gerekmemektedir.

## Metamask Yapılandırması

Camino Ağı'nı MetaMask ve RPC Uç Noktaları ile ayarlama hakkında bilgiye  kılavuzundan ulaşabilirsiniz.

:::tip CAMINO ON CHAINLIST.ORG

Camino Ağı ChainList.org üzerindedir. Ana ağ ve test ağını MetaMask'a otomatik olarak ekleyebilirsiniz. Lütfen aşağıdaki bağlantıları ziyaret edin:

- 
- 

:::

## Columbus Üzerindeki Fonlar

Bu ağ yalnızca test amaçlı olduğu için, test için gerekli olan token'lar (CAM) bir köprü veya borsa aracılığıyla satın alınamaz. Aslında token'lar yalnızca `Camino` Discord botumuzla ücretsiz istenebilir.

### Columbus Faucet Discord Botu

Columbus'ta test yapmaya başlamak için token'lara (CAM) ihtiyacınız olacak. Bunları talep etmek için lütfen  sunucumuza katılın ve `/faucet  ` komutunu kullanın.

`Camino` Discord botundan token talep etme miktarı, talep başına ve zaman dilimi başına sınırlı olup mevcut limitler, komutu kullanırken Discord'un otomatik olarak gösterdiği yardım metni ile sağlanmaktadır.

#### Token Almak için X-Adresi

Faucet üzerinden token alabilmek için Columbus ağına ait geçerli bir X-Chain adresine sahip olmanız gerekiyor. Bir X-Adresi oluşturmanın çeşitli yolları vardır; bunlardan en kolay olanı  kullanarak basit bir cüzdan oluşturmaktır. Lütfen sağ üst köşede Columbus ağının seçili olduğundan emin olun.

Yeni bir X-Adresi oluşturmanın bir başka yolu ise doğrudan  kullanmaktır; bu, normal kullanıcılar için önerilen bir yöntemdir ya da herhangi bir kullanıcı etkileşimi olmadan API'yi tamamen kullanmayı planlamıyorsanız.

#### Ama daha fazla token'a ihtiyacım var?

Panik yapmayın!

Token'lar ücretsiz olarak sağlandığı için, talep edilen token sayısını belirli bir zaman diliminde sınırlamak zorunda olduğumuzu anladığınızı umuyoruz. Böylece, birinin faucet'ı boşaltarak büyük miktarlarda token talep etmesini engellemiş oluyoruz. Eğer herhangi bir nedenle daha fazla token'a ihtiyaç duyuyorsanız, lütfen  sunucusundaki destek kanalında bizimle iletişime geçin.

### Ama C-Chain'de token'lar lazım?

Token'lar Discord botu aracılığıyla alındığında, her zaman `/faucet` komutunda sağlanan X-Adresine gönderilecektir. X-Chain ile C-Chain arasında token transferi yapmak için, lütfen  hesabınıza giriş yapın ve `Cross Chain` fonksiyonu ile token transferinizi gerçekleştirin.

## RPC/HTTP Düğümü Çalıştırma

RPC/HTTP düğümü olarak çalışan bir düğüm kurmak için,  kılavuzunu takip etmeniz yeterlidir.

## Bir Validator Düğümü Çalıştırma

Daha fazla ağ güvenliği sağlamak için validator düğümleri çalıştırmak isteyen daha fazla ortak karşılamak bizi mutlu eder. Şu anda, bir validator olma süreci Proof-Of-Stake temellidir; dolayısıyla, düğümünüzü  üzerinden bir validator olarak kaydetmek için P-Chain üzerinde en az `2000 CAM`'a ihtiyacınız var. Lütfen gerekli token'ları almak için  sunucusundaki destek kanalında bizimle iletişime geçin.

Bir validator düğümü çalıştırmak, RPC/HTTP düğümü çalıştırmak kadar basittir. Aslında tüm düğümler validator düğümleri haline gelebilir, ancak validator olarak çalışan bir düğümün herhangi bir API'sini, düğümlerin birbirleriyle iletişim kurmak için kullandığı `9651` portu üzerindeki staking API'si dışındaki API'leri açmamalarını şiddetle öneriyoruz.

## Sonraki Adımlar

Bu kadar, artık Columbus testnetine hakimsiniz ve istediğiniz zaman zincir üstü geliştirme yapmaya veya ağa katılmaya başlayabilirsiniz! Tebrikler! Bunu gerçekleştirdiğinizi bize  veya  üzerinden bildirin!

Herhangi bir sorunuz varsa veya yardıma ihtiyacınız olursa, lütfen  sunucusunda bizimle iletişime geçin.