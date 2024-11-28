---
title: Atomik Takas Yönetimi
description: HTLC tabanlı atomik takasların yönetimi hakkında bilgi verilmektedir. Kullanıcılar, atomik takasları sorgulamak, yönetmek ve projelerinde devre dışı bırakma işlemleri gerçekleştirmek için gerekli adımları öğrenebilirler.
keywords: [atomik takas, HTLC, blockchain, BEP3, kullanıcı, yatırım]
---

# Atomik Takas Yönetimi

HTLC tabanlı atomik takaslar, farklı blockchainler arasında ödeme ve varlık değişimlerini kolaylaştırmak için [BEP3](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP3.md) içinde tanıtılmıştır. BC birleşimi için, [ilk gün batımı sert çatalında](https://github.com/bnb-chain/bEPs/pull/333), atomik takasların oluşturulması ve yatırılması devre dışı bırakılacak, proje sahipleri (örneğin, çapraz zincir borsa, köprüler) ve kullanıcılar bunun farkında olmalı ve proaktif adımlar atmalıdır.

## Atomik Takasları Sorgulama

Atomik takasları sorgulamak için bir API sağlanmaktadır. Genellikle, kullanıcı, ilgili atomik takasları sorgulamak için bir adres sağlayabilir, örneğin:

[https://dex.bnbchain.org/api/v1/atomic-swaps?fromAddress=bnb1xz3xqf4p2ygrw9lhp5g5df4ep4nd20vsywnmpr](https://dex.bnbchain.org/api/v1/atomic-swaps?fromAddress=bnb1xz3xqf4p2ygrw9lhp5g5df4ep4nd20vsywnmpr)

![img](../../images/bnb-chain/assets/bcfusion/user-atomic-swap1.png)

Yanıt, takasın kimliği, takasın varlığı ve diğer bilgileri içeren çok sayıda yararlı bilgi içerecektir.

:::info
Atomik takasları sorgularken, doğru adresi sağladığınızdan emin olun. Yanlış bir adres, beklenmedik sonuçlara yol açabilir.
:::

## Atomik Takasları Yönetme

### BC Birleşimi Öncesi

Bir kullanıcı, atomik takaslarını **HTLC İadesi** işlemleri göndererek proaktif bir şekilde geri alabilir. Bu tür bir işlemi göndermek için komut şöyle görünmektedir:

```shell
./bnbcli token refund --swap-id <swapID> --from <from-key> --chain-id Binance-Chain-Tigris --trust-node --node http://dataseed1.bnbchain.org:80
```

:::warning
Proaktif iadeler sunulmazsa, [ikinci gün batımı sert çatalında](https://github.com/bnb-chain/bEPs/pull/333), mevcut tüm atomik takaslar otomatik olarak Yıldız Zincir üzerindeki yaratıcıların hesaplarına iade edilecektir. 
:::

İade, blockchain üzerinde hala mevcut olan atomik takas sayısına bağlı olarak birçok Yıldız Zincir bloğunda gerçekleşecektir. 

> "İade sonrası, kullanıcıların varlıkları hesaplarında bulmaları gerekir."  
> — Atomik Takas Yönetimi

Daha sonra kullanıcılar, varlıkları diğer BEP2/BEP8 tokenları gibi yönetebilirler. BNB Akıllı Zincir’e nasıl aktarılacağı hakkında lütfen `bu eğitici materyale` bakın.

### BC Birleşimi Sonrası

İade edilen varlıklar, [son gün batımı çatalından](https://github.com/bnb-chain/bEPs/pull/333) önce BSC’ye aktarılmamışsa, kullanıcıların bağlanmış BEP2/BEP8 varlıklarını almak için token kurtarma aracını kullanmaları gerekecektir. Daha fazla bilgi için lütfen [bu eğitici materyale](https://docs.google.com/document/d/1rMWwYGt-s6FXcRiUrBSN8dtOU96HDz0T3GaZyzbo7VQ/edit?pli=1#heading=h.df0svx3bznak) başvurun.

## Atomik Takas Proje Sahipleri İçin

:::tip
[İlk gün batımı sert çatalında](https://github.com/bnb-chain/bEPs/pull/333), atomik takasların oluşturulması ve yatırılması devre dışı bırakılacağından, proje sahiplerinin ilgili işlevleri projelerinde ÖNCE devre dışı bırakmaları ve kullanıcılarını tokenlarını iade almak için proaktif adımlar atmaya haberdar etmeleri gerekmektedir.
:::