---
title: Yerel Validator Nasıl Başlatılır
sidebarSortOrder: 1
description: "Yerel bir solana validator nasıl başlatılır öğrenin."
---

Program kodunuzu yerel olarak test etmek, devnet üzerinde test etmekten çok daha güvenilir olabilir ve devnet üzerinde denemeden önce test etmenize yardımcı olabilir.

:::info
Yerel test validatorünüzü kurmak için `Solana CLI araç setini` yükleyebilir ve aşağıdaki komutu çalıştırabilirsiniz:
:::

```shell
solana-test-validator
```

Yerel test-validator kullanmanın avantajları şunlardır:

- RPC veri hızı sınırlaması yok
- Airdrop sınırlaması yok
- Doğrudan on-chain program dağıtımı (`--bpf-program ...`)
- Programlar da dahil olmak üzere kamu kümesinden hesapları klonlama (`--clone ...`)
- Yapılandırılabilir işlem geçmişi saklama (`--limit-ledger-size ...`)
- Yapılandırılabilir dönem uzunluğu (`--slots-per-epoch ...`)
- İstediğiniz bir slot'a atlama (`--warp-slot ...`)

:::tip
Bu avantajlar, geliştirme sürecinizi önemli ölçüde hızlandırabilir ve daha az hata ile sonuçlanabilir.
:::

:::note
Unutmayın ki, yerel test-validator kullanırken, diğer test ağlarıyla senkronize olmanız gerekmez ve yerel ağın durumu tamamen sizin kontrolünüz altındadır.
:::

Yerel test-validator’ün kurulumu sonrası kullanıma hazır hale gelmiştir. Artık programlarınızı test etmeye başlayabilirsiniz. 

> Bu süreç, özellikle büyük projelerde hata ayıklama için kritik öneme sahiptir.  
> — Solana Dokümantasyonu

:::warning
Herhangi bir sorunla karşılaşmanız durumunda, `Solana topluluğu forumlarını` ziyaret etmenizi öneririz.
:::


Detaylı Bilgi

Yerel validator kullanımı sırasında dikkat edilmesi gereken önemli noktalar şunlardır:

1. **Performans**: Yerel ağın performansı, donanımınıza bağlıdır.
2. **Dağıtım ve güncellemeler**: On-chain programlarınızı güncel tutmak önemlidir.
3. **Güvenlik**: Yerel ağdaki testler güvenilir olsa da, gerçek ağ ile test etmeden uygulamalarınızı dağıtmamanız tavsiye edilir.

