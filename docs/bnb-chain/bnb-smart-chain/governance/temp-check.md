---
title: Sıcaklık Kontrolü - BSC Yönetimi
description: Bu belge, BNB Zinciri yönetimi sürecinin sıcaklık kontrolü ve nihai karar oylaması aşamalarını ayrıntılı olarak açıklamaktadır. Ayrıca, teklif gönderme ve oylama süreçlerini de kapsamaktadır.
keywords: [BNB Zinciri, sıcaklık kontrolü, oylama, teklif, BSC, yönetim]
---

# BSC Yönetimi Sıcaklık Kontrolü

## Genel Bakış

BNB Zinciri yönetimi, iki aşamalı bir süreç içerir: sıcaklık kontrolü ve nihai karar oylaması. Genellikle Snapshot platformu aracılığıyla gerçekleştirilen sıcaklık kontrolü, herhangi bir BNB sahibinin **bir teklif üzerindeki topluluk hissiyatını ölçmesine** olanak tanır. Eğer teklif yeterli destek alırsa, nihai karar oylama aşamasına geçilir. Bu aşama genellikle doğrulayıcılar veya stake edilmiş BNB'si olanlar tarafından zincir üzerinde oylama yapılmasını içerir ve sonuç, teklifin uygulanıp uygulanmayacağını belirler.

## Teklif Gönderme

:::info
1 BNB'den fazla stake eden herkes teklif oluşturabilir.
:::

Adım 1: Teklifinizi oluşturmak istediğiniz alana gidin.

Cüzdan sağlayıcınıza bağlanın - bağlı cüzdanın BNB'nizi devrettiğiniz yer olduğundan emin olun.

![](../../images/bnb-chain/bnb-smart-chain/img/submit-proposal.png)

Adım 2: Alan yan çubuğundaki **Yeni teklif** butonuna tıklayın.

Aşağıdaki alanları doldurun:
- Başlık
- Açıklama
- Tartışma bağlantısı

Adım 3: İstenilen oylama sistemini seçin, olası oylama seçeneklerini belirtin ve teklifinizin süresini tanımlayın. Kullanıcıların oylama yapması için yeterli zaman tanıdığınızdan emin olun.

Adım 4: `Yayınla` butonuna tıklayın - ve teklifinizi alan sayfasındaki teklifler listesinde görebilirsiniz.

---

## Oylama

### Bir Teklif Üzerinde Oylama

:::info
Tüm BNBChain delege edenleri teklifler üzerinde oy kullanabilir.
:::

Adım 1: Oylama alanına giriş yapın  
URL: [https://snapshot.org/#/bnbchain-dao.eth](https://snapshot.org/#/bnbchain-dao.eth)

Adım 2: Teklifin snapshot bağlantısına gidin. Örneğin, bu durumda bir topluluk üyesi BEP-341 için bir oylama teklifi oluşturdu.

[https://snapshot.org/#/bnbchain-dao.eth/proposal/0xd2ad975fbe1abd4bf71a5032239650741a64af0133feec83f43b98bc42fa7efe](https://snapshot.org/#/bnbchain-dao.eth/proposal/0xd2ad975fbe1abd4bf71a5032239650741a64af0133feec83f43b98bc42fa7efe)

![](../../images/bnb-chain/bnb-smart-chain/img/snapshot.png)

Adım 3: Cüzdanınızı bağlayın ve oy verin.

Cüzdanınızı bağladıktan sonra, aynı BNB Staking adresini kullandığınızdan emin olun. Ve oylama seçeneğini seçin.

![](../../images/bnb-chain/bnb-smart-chain/img/vote.png)

### Oylama Gücünü Delege Etme

![](../../images/bnb-chain/bnb-smart-chain/img/delegate.png)

Adım 1: [https://snapshot.org/#/delegate/bnbchain-dao.eth](https://snapshot.org/#/delegate/bnbchain-dao.eth) adresine gidin.

Adım 2: Devretmek istediğiniz adresi girin.

Adım 3: Delegasyonunuzu kaydetmek için **Onayla** butonuna tıklayın.

### Oylama Gücünü İptal Etme

Adım 1: [https://snapshot.org/#/delegate/bnbchain-dao.eth](https://snapshot.org/#/delegate/bnbchain-dao.eth) adresine gidin.

Adım 2: En üst delegelerde mevcut delege listesini bulun.

Adım 3: Bir delegeyi iptal etmek için **'x'** butonuna tıklayın, cüzdan kullanıcının imza atmasını ve işlemi BSC'ye göndermesini isteyecektir.

---

### Sıcaklık Yönetim Gücünü Etkileyen Faktörler:
- **BNB Tutma Bakiyesi**: Sahip olduğunuz BNB miktarı, oylama gücünüzü artırır.
- **Stake Edilen BNB**: BNB'nizi bir doğrulayıcıya devretmek, yönetim gücünüze katkıda bulunur. Bu, ağın güvenliğinde aktif olarak yer alanların söz sahibi olmasını sağlar. [https://www.bnbchain.org/en/bnb-staking](https://www.bnbchain.org/en/bnb-staking)
- **ListDAO Stake Edilen BNB**: Stake edilmiş listDAO BNB'niz (slisBNB) [https://docs.bsc.lista.org/user-guide/liquid-staking-slisbnb](https://docs.bsc.lista.org/user-guide/liquid-staking-slisbnb)