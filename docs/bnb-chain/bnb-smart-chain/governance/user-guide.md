---
title: Kullanıcı Kılavuzu - BSC Yönetişimi
description: Bu belge, Tally kullanarak BNB Akıllı Zinciri'nde yönetişime nasıl katılacağınızı ve uygulamalı süreçleri detaylandırır. Oylama gücünü devretme, öneri oluşturma ve oy verme süreçlerine dair adım adım rehberlik sağlar.
keywords: [Tally, BNB, BSC, yönetişim, öneri oluşturma, oylama, DAO]
---

# Tally dApp ile Yönetişimi Yönetme

Bu belge, Tally kullanarak BNB Akıllı Zinciri'nde (BSC) yönetişime nasıl katılacağınız hakkında bir kılavuz sunar. 
Oylama gücünü devretme, öneri oluşturma, önerilere oy verme ve önerileri yürütme süreçlerini kapsar.

BNB Zinciri DAO'ları, hem ana ağda hem de test ağında Tally üzerinde oluşturulmaktadır.

* Test Ağı: [https://www.tally.xyz/gov/bnb-chain-testnet](https://www.tally.xyz/gov/bnb-chain-testnet)
* Ana Ağ: [https://www.tally.xyz/gov/bnb-chain](https://www.tally.xyz/gov/bnb-chain)

## Parametreler

BSC üzerinde yönetişim sürecini etkileyen birkaç parametre bulunmaktadır.

| Parametre               | Açıklama                                                                          | Ana Ağ Değeri | Test Ağı Değeri |
|-------------------------|----------------------------------------------------------------------------------|---------------|-----------------|
| oylamaGecikmesi        | Kullanıcıların bir öneriye oy verebileceği sabit bir süre                        | 0 saat        | 0 saat          |
| oylamaDönemi           | sayım öncesi oylama dönemi                                                       | 7 gün         | 1 gün           |
| öneriEşi               | Bir öneri için gereken sabit gov BNB miktarı                                      | 200 govBNB    | 100 govBNB      |
| quorumOranı            | Nihai oylama sonucu üretmek için gereken toplam oylama gücünün yüzdesi          | %10           | %10             |
| başlatGovEşi           | gov işlevini etkinleştirmek için toplam gov token arzı                           | 10M BNB       | 10M BNB         |
| quorumSonrasıMinSüre    | Bir öneri quorum'a ulaştığında oylama için eklenmesi gereken süre               | 1 gün         | 1 saat          |
| zamanKilidiGecikmesi   | Bir öneriyi yürütmek için zaman kilidi süresi                                    | 1 gün         | 6 saat          |

## Yönetişim Süreci Kılavuzu

Aşağıdaki işlemler için Web3 cüzdanınıza (örneğin, TrustWallet, BEW, Metamask) bağlanmanız gerekmektedir.

### Oylama Gücünü Devretme

> BNB'nizi bir BSC doğrulayıcısına devrettikten sonra, BSC yönetişimine katılmaya başlayabilirsiniz. 
> BSC yönetişimine katılmak için öncelikle oylama gücünüzü bir doğrulayıcıya veya doğrudan oy vermek istiyorsanız kendinize devretmeniz gerekir.  
> — Tally Kullanıcı Kılavuzu

Oylama gücünüzü devretmek için ekranın sağ üst köşesindeki `Oylama gücüm` düğmesine tıklayabilirsiniz.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally1.png){:style="width:800px"}

Doğrudan oy vermek/öneri oluşturmak istiyorsanız oylama gücünüzü kendinize devredebilir, başkaları için oy vermesini/öneri oluşturmasını isteyebilirsiniz.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally2.png){:style="width:800px"}

Oylama gücünü kendinize devrederseniz, yönetişime katılmak için mevcut oylama gücünüzün sayısını görebilirsiniz.

### Öneri Oluşturma

:::info
Yeterli oylama gücüne (yani, `öneriEşi` değerinden fazla) sahipseniz, BSC ağında öneriler oluşturabilirsiniz. 
Bir kullanıcının yalnızca bir önerisi aktif/ bekleyen durumda bir anda olabileceğini unutmayın, bu da spam yapmayı engeller.
:::

Bir öneri oluşturmak için ekranın sağ üst köşesindeki "Yeni öneri oluştur" düğmesine tıklayın.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally11.png){:style="width:800px"}

Bir öneri oluşturduktan sonra, öneri için bir başlık, açıklama ve bir eylem listesi ekleyebilirsiniz.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally4.png){:style="width:800px"}

Yalnızca bir başlık ve açıklama gerektiren bir metin önerisi vardır ve hiçbir eylem içermediği için ağ tarafından yürütülmeyecektir.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally5.png){:style="width:800px"}

Bir eylem eklemek için "Eylem ekle" düğmesine tıklayın ve eylemin ayrıntılarını doldurun.

- `Hedef Sözleşme Adresi`: Öneri tarafından çağrılacak sözleşme adresi.
- `ABI Dosyası`: Sözleşmenin ABI dosyası. ABI dosyası doğru algılanmadıysa, ABI dosyasını manuel olarak yükleyebilirsiniz.
- `Sözleşme Metodu`: Çağrılacak sözleşme metodu.
- `Calldata`: Sözleşme metoduna girdi verisi. Bu isteğe bağlıdır.

Tüm ayrıntıları girdikten sonra, önerinizi yayınlamak için "Yayınla"ya tıklayın.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally6.png){:style="width:800px"}

Ayrıca bir öneriyi "Öneriyi iptal et" düğmesine tıklayarak iptal edebilirsiniz.

### Önerilere Oy Verme

Bir öneri aktif hale geldiğinde (yani, `oylamaGecikmesi` süresi dolduktan sonra ve `oylamaDönemi` süresi başlamadan önce) öneriyi desteklemek veya karşı çıkmak için oy verebilirsiniz. 
Bir öneriye oy vermek için "Zincirle oy ver" düğmesine tıklayın.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally7.png){:style="width:800px"}

Öneriye `Lehte`, `Aleyhte` veya `Çekimser` oy verebilirsiniz.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally8.png){:style="width:800px"}

### Önerileri Yürütme

:::warning
Eğer bir öneri quorum'a ulaşırsa (yani, toplam oylama gücünün `quorumOranı’na ulaşması) ve geçerse (yani, oy kullanan oylama gücünün %50'sinden fazlası öneriyi destekliyorsa), ağ tarafından yürütülebilir.
:::

Bir öneriyi yürütmek için öncelikle önerinin sıraya alınması gerekir, bunun için `Sıra` düğmesine tıklayın.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally9.png){:style="width:800px"}

Öneri sıraya alındıktan ve zaman kilidi süresinin sonuna ulaşıldıktan sonra (yani, `zamanKilidiGecikmesi` süresi), 
herhangi biri `Yürüt` düğmesine tıklayarak öneriyi yürütebilir.

![](../../images/bnb-chain/bnb-smart-chain/img/gov/tally10.png){:style="width:800px"}

### Diğer Referanslar

- [Tally'de Delegasyonlar](https://docs.tally.xyz/knowledge-base/delegations-on-tally)
- [Tally'de Öneriler](https://docs.tally.xyz/knowledge-base/proposals)