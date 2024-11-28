---
title: Crosschain Redelgation
description: Crosschain redelgation enables the transfer of delegation from the BNB Beacon chain to the new BNB smart chain local staking. This process involves sending a specific message that facilitates the migration of stakes.
keywords: [crosschain, redelgation, BNB, Beacon chain, staking, blockchain migration]
---

# Crosschain Redelgation

Mevcut delegasyonu BNB Beacon zincirinden (eski BSC staking) yeni BNB akıllı zincir yerel staking'e taşımak için, **crosschain redelgation** kullanılabilir. Bir kullanıcı, Beacon zincirine `MsgSideChainStakeMigration` adında bir mesaj gönderebilir. 

:::info
Bu mesaj, delegasyonu hemen BC üzerinde serbest bırakacak (serbest bırakma süresini beklemeden) ve BSC'ye bir cross-chain işlemi göndererek yerel bir BSC doğrulayıcısına delegasyon yapacaktır.
:::

**`MsgSideChainStakeMigration` tanımı aşağıdaki gibidir:**

```go
type MsgSideChainStakeMigration struct {
    ValidatorSrcAddr sdk.ValAddress        `json:"validator_src_addr"`
    ValidatorDstAddr sdk.SmartChainAddress `json:"validator_dst_addr"`
    DelegatorAddr    sdk.SmartChainAddress `json:"delegator_addr"`
    RefundAddr       sdk.AccAddress        `json:"refund_addr"`
    Amount           sdk.Coin              `json:"amount"`
}
```

- **`ValidatorSrcAddr`**: BC üzerindeki doğrulayıcı adresi (bech32 formatı)
- **`ValidatorDstAddr`**: BSC üzerindeki yeni doğrulayıcı operatör adresi (eth formatı)
- **`DelegatorAddr`**: BSC üzerindeki delegasyon yararlanıcısı adresi (eth formatı)
- **`RefundAddr`**: delegatör (mesaj gönderen) adresi BC üzerinde (bech32 formatı)
- **`Amount`**: redelgasyon için gereken BNB miktarı (ondalık 8)

> **Not edilmelidir:** lütfen `DelegatorAddr`'ı doğru girdiğinizden emin olun, aksi takdirde fonlarınızı kalıcı olarak kaybedebilirsiniz.  
> — BNB Staking Uzmanı

:::tip
Daha fazla ayrıntı için lütfen kodlara başvurun:

Kod Referansı
[GitHub - stake_migration.go](https://github.com/bnb-chain/bnc-cosmos-sdk/blob/bc-fusion/x/stake/types/stake_migration.go#L29)

:::