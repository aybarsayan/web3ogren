---
title: Tally ile Yönetişim
description: Bu belge, Tally kullanarak BNB Akıllı Zinciri (BSC) üzerinde yönetişime nasıl katılacağınızı anlatan bir rehber sunmaktadır. Oylama gücünün devredilmesi, teklifler oluşturma, teklifler üzerinde oy kullanma ve teklifleri yürütme süreçlerini kapsar.
keywords: [Tally, BNB, BSC, yönetişim, oylama, teklif]
---

# Tally ile Yönetişim

Bu belge, Tally kullanarak BNB Akıllı Zinciri (BSC) üzerinde yönetişime nasıl katılacağınızı anlatan bir rehber sunmaktadır. Oylama gücünün devredilmesi, teklifler oluşturma, teklifler üzerinde oy kullanma ve teklifleri yürütme süreçlerini kapsar.

BNB Zinciri DAO'ları, hem ana ağ hem de test ağ için Tally üzerinde oluşturulmuştur.

* Testnet: [https://www.tally.xyz/gov/bnb-chain-testnet](https://www.tally.xyz/gov/bnb-chain-testnet)
* Mainnet: [https://www.tally.xyz/gov/bnb-chain](https://www.tally.xyz/gov/bnb-chain)

---

## Parametreler

BSC üzerindeki yönetişim sürecini etkileyecek birkaç parametre bulunmaktadır. Özellikle, BSC üzerindeki yönetişim süreci, Beacon Chain'den yeterli oylama gücünün taşınmasından sonra etkinleştirilmektedir (yani, `startGovThreshold` parametresi).

| Parametre               | Açıklama                                                                          | Ana Ağ Değeri | Test Ağ Değeri |
|-------------------------|----------------------------------------------------------------------------------|---------------|-----------------|
| oylamaGecikmesi        | Kullanıcıların bir teklife oy verebileceği belirli bir süre                     | 0 saat        | 0 saat          |
| oylamaDönemi           | Oylama sonuçlarının sayılmasından önceki oylama süresi                         | 7 gün         | 1 gün           |
| teklifEşiği            | Bir teklif için gerekli olan belirli bir miktar yönetim BNB                       | 200 govBNB    | 100 govBNB      |
| yeterlilikOranı         | Nihai oylama sonucunu üretmek için gereken toplam oylama gücünün yüzdesi        | %10           | %10             |
| başlangıçYönetimEşiği  | Yönetişim fonksiyonunu etkinleştirmek için gerekli olan toplam yönetim tokenı   | 10M BNB       | 10M BNB         |
| yeterlilikSonrasıMinPeriyot | Bir teklif yeterliliğe ulaştığında oylama için eklenmesi gereken süre      | 1 gün         | 1 saat          |
| zamanKilidiGecikmesi    | Bir teklifin yürütülmesi için zaman kilidi süresi                               | 1 gün         | 6 saat          |

---

## Yönetişim Süreci Rehberi

Aşağıdaki işlemler için Web3 cüzdanınıza (örneğin, TrustWallet, BEW, Metamask) bağlanmanız gerekmektedir.

### Oylama Gücünü Devretme

BNB'nizi bir BSC doğrulayıcısına devrettikten sonra, BSC yönetişimine katılmaya başlayabilirsiniz. BSC yönetişimine katılmak için önce **oy verme gücünüzü** birine ya da doğrudan oy vermek isterseniz **kendinize** devretmeniz gerekmektedir.

![](../../images/bnb-chain/assets/bcfusion/tally1.png){:style="width:800px"}

Oylama gücünüzü devretmek için ekranın sağ üst köşesindeki `Oy gücüm` butonuna tıklayabilirsiniz.

![](../../images/bnb-chain/assets/bcfusion/tally2.png){:style="width:800px"}

Doğrudan oy vermek/teklifte bulunmak istiyorsanız oy gücünüzü kendinize, başkalarına devretmek istiyorsanız başkasına devredebilirsiniz.

![](../../images/bnb-chain/assets/bcfusion/tally3.png){:style="width:800px"}

Oylama gücünü kendinize devrettiğinizde, yönetişime katılmak için mevcut oy gücünüzü göreceksiniz.

### Teklif Oluşturma

Yeterli oylama gücüne sahipseniz (yani, `teklifEşiği` değerinden büyükse), BSC ağı üzerinde teklifler oluşturabilirsiniz. 

:::tip
Bir kullanıcının aynı anda yalnızca bir aktif/beklemede olan teklifi olması gerektiğini unutmayın, bu nedenle spam yapmamak için dikkatli olun.
:::

Bir teklif oluşturmak için ekranın sağ üst köşesindeki "Yeni teklif oluştur" butonuna tıklayın.

![](../../images/bnb-chain/assets/bcfusion/tally11.png){:style="width:800px"}

Bir teklif oluşturduktan sonra, başlık, açıklama ve teklif için bir eylem listesi ekleyebilirsiniz.

![](../../images/bnb-chain/assets/bcfusion/tally4.png){:style="width:800px"}

Metin teklifi yalnızca bir başlık ve bir açıklama gerektirir; çünkü eylem yoksa ağ tarafından yürütülmeyecektir.

![](../../images/bnb-chain/assets/bcfusion/tally5.png){:style="width:800px"}

Bir eylem eklemek için "Eylem ekle" butonuna tıklayın ve eylemin ayrıntılarını doldurun.

- `Hedef Sözleşme Adresi`: Teklif tarafından çağrılacak sözleşme adresi.
- `ABI Dosyası`: Sözleşmenin ABI dosyası. ABI dosyası doğru tespit edilmediğinde manuel olarak ABI dosyasını yükleyebilirsiniz.
- `Sözleşme Metodu`: Çağrılacak sözleşme yöntemidir.
- `Calldata`: Sözleşme yöntemine yönelik giriş verisi. Bu isteğe bağlıdır.

Tüm ayrıntıları girdikten sonra, teklifinizi yayınlamak için "Yayınla" butonuna tıklayın.

![](../../images/bnb-chain/assets/bcfusion/tally6.png){:style="width:800px"}

Ayrıca "Teklifi iptal et" butonuna tıklayarak bir teklifi iptal edebilirsiniz.

### Tekliflere Oy Verme

Bir teklif aktif olduğunda (yani, `oylamaGecikmesi` süresi sona erdikten sonra ve `oylamaDönemi` süresinden önce) teklifi desteklemek veya karşı çıkmak için oy verebilirsiniz. Bir teklife oy vermek için "Zincir üzerinde oy ver" butonuna tıklayın.

![](../../images/bnb-chain/assets/bcfusion/tally7.png){:style="width:800px"}

Teklife `Lehte`, `Aleyhte` veya `Çekimser` oyları verebilirsiniz.

![](../../images/bnb-chain/assets/bcfusion/tally8.png){:style="width:800px"}

### Teklifleri Yürütme

Bir teklif yeterliliğe ulaştığında (yani, toplam oylama gücünün `yeterlilikOranı`na ulaştığında) ve geçerse (yani, oylanan oylama gücünün %50'sinden fazlası teklifi destekliyorsa) ağ tarafından yürütülebilir.

Bir teklifi yürütmek için öncelikle teklifin sıraya alınması gerekir. Bunun için `Sıralama` butonuna tıklayarak yapılmalıdır.

![](../../images/bnb-chain/assets/bcfusion/tally9.png){:style="width:800px"}

Teklif sıraya alındıktan ve zaman kilidi süresi (yani, `zamankilidiGecikmesi` süresi) aşıldıktan sonra, herhangi bir kişi tarafından `Yürüt` butonuna tıklanarak yürütülebilir.

![](../../images/bnb-chain/assets/bcfusion/tally10.png){:style="width:800px"}

### Daha Fazla Referans

- [Tally'de Delegasyonlar](https://docs.tally.xyz/knowledge-base/delegations-on-tally)
- [Tally'de Teklifler](https://docs.tally.xyz/knowledge-base/proposals)