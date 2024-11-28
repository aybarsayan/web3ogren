---
title: Token Kurtarma dApp
description: Beacon Chain kapandığında token göçünü kolaylaştırmak için geliştirilmiş olan Token Kurtarma dApp, kullanıcıların varlıklarını kolayca kurtarmalarına yardımcı olur. Bu belge, adım adım rehberlik sunarak kurtarma sürecini açıklar.
keywords: [token kurtarma, Beacon Chain, BSC, BEP2, BEP8, dApp, varlık göçü]
---

# Token Kurtarma dApp

Beacon Chain kapandığında token göçünü kolaylaştırmak için, 
[BEP299](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP-299.md) önerilmektedir
BEP2/BEP8 varlıklarının Beacon Chain'den BSC zincirine geri kazanılması için. Bu belge, token kurtarma sürecinde size rehberlik edecektir.

:::warning
**Dikkat edilmesi gerekenler:**
* Token kurtarma dApp'i yalnızca füzyondan sonra (Beacon Chain kapatıldığında) mevcut olacaktır.
* Yalnızca `çapraz zincir bağlı/yansıtılan varlıklar` kurtarılabilir.
:::

URL:

- **Testnet**: [https://testnet-bnb-beacon-chain-token-recovery.bnbchain.org/en](https://testnet-bnb-beacon-chain-token-recovery.bnbchain.org/en)

- **Mainnet**: Güncellenecek.

---

## Adımlar

### Adım 1: BC cüzdanınıza bağlanın.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-1.png){:style="width:800px"}

Token kurtarma dApp'ini açtığınızda, cüzdanınıza bağlanmanız istenecek.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-2.png){:style="width:800px"}

**Desteklenen cüzdanlar:**
- [BNB Chain Wallet](https://chromewebstore.google.com/detail/bnb-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp)
- [Trust Wallet](https://trustwallet.com/) (Trust wallet desteği yakında gelecek).

### Adım 2: Kurtarılacak BEP2/BEP8 varlıklarını seçin.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-3.png){:style="width:800px"}

Kurtarma işlemini başlatmak için "Şimdi Kurtar" butonuna tıklayın.

### Adım 3: Alıcı adresini girin.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-4.png){:style="width:800px"}

BSC'deki alıcı adresi, BEP2/BEP8 varlıklarının kurtarılacağı adrestir. 
Token kurtarma dApp'i, cüzdanınızdan BSC adresini otomatik olarak almaya çalışacaktır.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-5.png){:style="width:800px"}

Adres önceden doldurulmadıysa veya farklı bir adres kullanmak istiyorsanız, kullanmak istediğiniz adresi de girebilirsiniz.

:::warning
* **Dikkat edilmesi gerekenler:**
    * Adres, BSC'deki BEP2/BEP8 varlıklarını alacaktır. Lütfen bunu doğru girin, aksi halde herhangi bir fon kaybı yaşanabilir.
    * Hesap, daha sonraki adımlarda BSC'ye bir işlem göndermek için kullanılacaktır. Bu nedenle, işlem ücreti için BSC'de bazı BNB'lere sahip olmalıdır.
:::

### Adım 4: Alıcı adresini ve imzayı onaylayın.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-6.png){:style="width:800px"}

Token kurtarma isteğini onaylayarak, cüzdanınız aracılığıyla bir mesaj imzalamanız istenecek.

### Adım 5: Token kurtarma işlemini BSC'ye gönderin.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-7.png){:style="width:800px"}

![](../../images/bnb-chain/assets/bcfusion/token-recovery-8.png){:style="width:800px"}

Cüzdanınızda BSC ağına geçmenizin istenecektir.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-mismatch-address.png){:style="width:800px"}

Bağlı adres, önceki adımda girilen alıcı adresi olmalıdır. Eğer değilse, token kurtarma dApp'i bunu tespit edecek ve cüzdanınızdaki doğru hesaba geçmenizi isteyecektir.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-9.png){:style="width:800px"}

Ardından, token kurtarma işlemini BSC'ye göndermek için "Onayla" butonuna tıklayın.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-10.png){:style="width:800px"}

İşlemi göndermek için imzalamanız ve onaylamanız istenecek; bu işlem BSC'ye gönderilecektir.

### Adım 6: Kurtarma için bekleyin.

![](../../images/bnb-chain/assets/bcfusion/token-recovery-11.png){:style="width:800px"}

İşlem gönderildikten sonra, token kurtarma dApp'i token kurtarma isteğinin başarıyla gönderildiğini belirten bir pencere açacaktır.

:::info
**Son olarak, BEP2/BEP8 varlıklarının BSC'de kurtarılması ve cüzdanınıza ulaşması için 7 gün beklemeniz gerekecektir.**
:::