---
description: Bu kılavuzda, Greenfield'da BNB transferi nasıl yapılır ve çapraz zincir transferleri hakkında bilgi bulacaksınız. BNB'yi BSC ile Greenfield arasında nasıl transfer edebileceğinizi öğrenin.
keywords: [BNB Transferi, Greenfield, BSC, Çapraz Zincir, DCellar, TokenHub, Cüzdan]
---

# Köprü ve BNB Transferi

Greenfield ve BSC'nin adres formatları tamamen uyumludur. Kullanıcılar, Greenfield ve BSC arasında serbestçe BNB transfer edebilirler. Ancak, Greenfield şu anda yalnızca BNB'yi desteklemekte ve BEP20 token'larını desteklememektedir.

Bu, Greenfield Blockchain ile BSC arasında BNB transfer etme sürecini detaylandıran kapsamlı bir kılavuzdur.

## BSC'den Greenfield'a Transfer

BNB Akıllı Zinciri'nden (BSC) Greenfield'a çapraz zincir transferi gerçekleştirmek için bu adımları izleyin:

1. [Greenfield Köprüsü](https://greenfield.bnbchain.org/en/bridge?type=transfer-in) adresini ziyaret edin.

2. Cüzdanınızı bağlayın ve BSC ağına geçiş yapın.
![Greenfield-Bridge-Transfer-In](../../images/bnb-chain/bnb-greenfield/static/asset/207-Bridge-Transfer-In.png)

3. İstenilen miktarı belirtin ve `Transfer In` butonuna tıklayın.

4. İşlemi onaylayın ve BSC'deki transferin işlenmesini bekleyin.

5. İşlem onaylandığında, fonlar BSC'den Greenfield'a transfer edilecektir. Transfer edilen fonlar, birkaç saniye içinde Greenfield'daki aynı hesaba yansıyacaktır.

Ayrıca, [DCellar](https://dcellar.io/) kullanabilir ve [Transfer In Nasıl Yapılır](https://docs.nodereal.io/docs/dcellar-get-started#transfer-in) kılavuzunu takip edebilirsiniz.

---

## Greenfield'dan BSC'ye Transfer

Greenfield'dan BNB Akıllı Zinciri'ne (BSC) çapraz zincir transferi gerçekleştirmek için şunları yapmalısınız:

1. [Greenfield Köprüsü](https://greenfield.bnbchain.org/en/bridge?type=transfer-out) adresini ziyaret edin.

2. Cüzdanınızı bağlayın ve Greenfield ağına geçiş yapın.
![Greenfield-Bridge-Transfer-Out](../../images/bnb-chain/bnb-greenfield/static/asset/208-Bridge-Transfer-Out.png)

3. İstenilen miktarı belirtin ve `Transfer Out` butonuna tıklayın.

4. İşlemi onaylayın ve Greenfield'deki transferin işlenmesini bekleyin.

5. İşlem onaylandığında, fonlar Greenfield'dan BSC'ye transfer edilecektir. Transfer edilen fonlar, birkaç saniye içinde BSC'deki aynı hesaba yansıyacaktır.

Ayrıca, [DCellar](https://dcellar.io/) kullanabilir ve [Transfer Out Nasıl Yapılır](https://docs.nodereal.io/docs/dcellar-get-started#transfer-out) kılavuzunu takip edebilirsiniz.

:::note
Dikkat edilmesi gereken bir şey, çapraz zincir transferinin değeri 1000 BNB'yi geçerse, fonların `TokenHub`'da 12 saat boyunca kilitleneceğidir. Genellikle, bir üçüncü taraf sunucu, kilidi açılmış token'ın alıcıya çekilmesine yardımcı olacaktır ve kullanıcılar, [kilidi açma belgesini](https://github.com/bnb-chain/greenfield-contracts#large-transfer-unlock) izleyerek alıcıya da kendileri çekebilirler.
:::

---

## Greenfield'daki BNB Transferleri

Greenfield, farklı hesaplar arasında kolay ve güvenli transferler sağlar. Bununla birlikte, işlem formatının özelliğinden dolayı, şu anda MetaMask gibi cüzdanlardaki yerleşik Gönder işlevi aracılığıyla token transferi gerçekleştirmek mümkün değildir. Greenfield içinde iç transfer yapmak için lütfen şu adımları izleyin:

1. [DCellar](https://dcellar.io/) adresini ziyaret edin.

2. Sağ üst köşedeki `Başlayın` butonuna tıklayın.
![Greenfield-Transfer-DCellar-Anasayfa](../../images/bnb-chain/bnb-greenfield/static/asset/209-Greenfield-Transfer-DCellar.png)

3. Cüzdanınızı bağlayın ve oturum açın.

4. Sol kenar çubuğundaki `Cüzdan` sayfasına gidin, ardından `Gönder` sayfasına geçin.
![Greenfield-Transfer-DCellar-Cüzdan](../../images/bnb-chain/bnb-greenfield/static/asset/210-Greenfield-Transfer-Wallet.png)

5. Transfer yapmak istediğiniz hedef adresi doldurun, miktarı belirtin ve `Gönder` butonuna tıklayın.

6. Transferi onaylayın ve işlemin işlenmesini bekleyin.

7. Transfer onaylandığında, fonlar Greenfield içinde kaynak hesaptan hedef hesaba aktarılacaktır.