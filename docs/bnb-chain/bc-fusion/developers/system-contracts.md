---
title: Yerleşik Sistem Sözleşmeleri
description: Bu belge, BNB Akıllı Zincir üzerindeki yerleşik sistem sözleşmelerini tanıtır. Stake Hub, Stake Credit, Governor ve diğer önemli sözleşmeler hakkında bilgiler içerir.
keywords: [BNB Akıllı Zincir, yerleşik sözleşmeler, staking, yönetişim, token kurtarma]
---

# Yerleşik Sistem Sözleşmeleri

GitHub Uygulama bağlantısı: [https://github.com/bnb-chain/bsc-genesis-contract](https://github.com/bnb-chain/bsc-genesis-contract)

| Sözleşme Adı                 | Sözleşme Adresi                           | ABI Dosyası                                                                                                     |
|-------------------------------|-------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Stake Hub Sözleşmesi         | 0x0000000000000000000000000000000000002002 | [stakehub](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/stakehub.abi)                    |
| Stake Credit Sözleşmesi      | 0x0000000000000000000000000000000000002003 | [stakecredit](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/stakecredit.abi)              |
| Governor Sözleşmesi          | 0x0000000000000000000000000000000000002004 | [bscgovernor](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/bscgovernor.abi)              |
| Gov Token Sözleşmesi         | 0x0000000000000000000000000000000000002005 | [govtoken](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/govtoken.abi)                    |
| Timelock Sözleşmesi          | 0x0000000000000000000000000000000000002006 | [bsctimelock](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/bsctimelock.abi)              |
| Token Recover Portal Sözleşmesi | 0x0000000000000000000000000000000000003000 | [tokenrecoverportal](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/tokenrecoverportal.abi) |

---

### Derlenmiş Sözleşmeler

### Secp256k1 İmza Kurtarma

Derlenmiş sözleşme, secp256k1 eliptik eğri şifreleme algoritması kullanılarak imzalanmış bir mesajın imzasını doğrulamak için kullanılır. Aynı zamanda imzacıya ait Tendermint adresini de döndürür.

---

### Çift İmza Kanıtını Doğrulama

Derlenmiş sözleşme, farklı zamanlarda aynı doğrulayıcı tarafından imzalanmış iki blok başlığını içeren sunulmuş çift imza kanıtlarını doğrulamak için kullanılır.

---

## Yerleşik Sistem Sözleşmeleri

### Stake Hub Sözleşmesi

Stake Hub sözleşmesi, **delegasyon**, **geri delegasyon**, **yeniden delegasyon** ve **ödül talep etme** dahil olmak üzere staking sürecini yöneten bir sözleşmedir.

:::tip
**Stake Hub**: Bu sözleşme, staking işlemleri için merkezi bir rol oynar.
:::

### Stake Credit Sözleşmesi

Stake Credit sözleşmesi, bir şablon proxy sözleşmesidir. Bir doğrulayıcı oluşturulduğunda, staking kredilerini yönetmek ve kredi ile BNB arasında değişimi kolaylaştırmak için **yeni bir stake credit sözleşmesi dağıtılır.**

### Governor Sözleşmesi

Governor sözleşmesi, **BNB Akıllı Zincir** yönetim sürecini yöneten bir sözleşmedir. Kullanıcıların protokoldeki değişiklikleri önermesine ve oylamasına olanak tanır.

:::info
**Yönetim Süreci**: Kullanıcılar, değişiklik önerileri ile yönetim süreçlerinde etkili olabilirler.
:::

### Gov Token Sözleşmesi

Gov Token sözleşmesi, yönetim token'ını, yani `govBNB`yi yöneten bir sözleşmedir.

### Timelock Sözleşmesi

Timelock sözleşmesi, belirli işlemler üzerinde **bir zaman kilidi** uygulamaya izin veren bir sözleşmedir (örn. token kurtarma). Zaman kilidi süresi sona erdikten sonra, kilitli token'lar talep edilebilir veya serbest bırakılabilir.

:::warning
**Zaman Kilidi**: Zaman kilidi süresi dolmadan token'lara erişim mümkün olmayabilir.
:::

### Token Recover Portal Sözleşmesi

Token Recover Portal sözleşmesi, kullanıcıların **BEP2/BEP8 token'larını** kurtarmalarını sağlayan bir sözleşmedir; bu token'lar BEP20 token'larına bağlanmış olmalıdır. Bu, BNB Akıllı Zincir ile BNB Beacon Zincir arasındaki çapraz zincir transferinin kapatılmasından sonra gerçekleşir.