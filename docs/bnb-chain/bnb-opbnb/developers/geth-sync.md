---
title: Geth P2P Senkronizasyonu - opBNB Geliştirme
description: Bu makalede Geth P2P Senkronizasyon Özelliği tanıtılmakta ve yapılandırmaları hakkında bilgi verilmektedir. Özellik, blok verilerinin senkronizasyon hızını artırarak kaynak tasarrufu sağlar.
keywords: [Geth, P2P, senkronizasyon, blok verileri, opBNB]
---

# Geth P2P Senkronizasyon Özelliği

Bu sürümde yeni bir özellik tanıtmaktan heyecan duyuyoruz: **Geth P2P Senkronizasyon Özelliği**. Bu özellik, geth düğümleri arasında **eşler arası senkronizasyonu** kullanarak blok verilerinin senkronizasyon hızını önemli ölçüde artırır; önceki yöntem olan her bir senkronizasyon için L1'den işlem türetme yöntemine kıyasla.

## Geth P2P Senkronizasyon Özelliğinin Faydaları

Geth P2P Senkronizasyon Özelliği, blok verileri senkronizasyonunu büyük ölçüde hızlandırır. Testnet'teki testlerimiz etkileyici sonuçlar göstermiştir:

*   `full` modunda, senkronizasyon süresi önceki 7 günden yaklaşık 15 saate düşürülmüştür.
*   `snap` modunda, senkronizasyon yaklaşık 1 saat içinde tamamlanabilir.

:::tip
Bu iyileştirmeler, değerli zaman ve kaynak tasarrufu sağlayarak işlemlerinizin genel performansını artırabilir.
:::

## Geth P2P Senkronizasyon Özelliği için Yapılandırmalar

### Yeni Yapılandırmalar (op-node)

*   `l2.engine-sync=true`
*   `l2.skip-sync-start-check = true`

Yukarıdaki ayarlar, Geth P2P Senkronizasyon Özelliğini etkinleştirmek için kritik öneme sahiptir. Lütfen bu ayarların op-node’unuzda doğru bir şekilde yapılandırıldığından emin olun.

### Mevcut Yapılandırmalar (op-geth)

*   `syncmode=snap/full`
*   `bootnodes=${bootnode_addr}`

`syncmode` için iki seçeneği de kullanabilirsiniz:

1. **`full` (Önerilen):** Bu mod, tam bir senkronizasyon gerçekleştirilir ve her bir bloğu işler. Yeni Geth P2P Senkronizasyon Özelliği ile senkronizasyon süresi testnet'te yaklaşık 15 saate düşürülmüştür (son yükseklik: 10 milyon).
2. **`snap`:** Bu mod, işlemleri yürütmeyen bir anlık görüntü senkronizasyonu gerçekleştirir ancak yine de veri bütünlüğünü korur. Bu mod, P2P eş düğümlerinizin güvenilir olduğu durumlarda önerilmektedir. Senkronizasyon süresi testnet'te yaklaşık 1 saattir.

:::info
`bootnodes` yapılandırması için, aşağıdaki geth bootnode düğümlerini kullanabilirsiniz:
:::

* Testnet
    *   `enr:-KO4QKFOBDW--pF4pFwv3Al_jiLOITj_Y5mr1Ajyy2yxHpFtNcBfkZEkvWUxAKXQjWALZEFxYHooU88JClyzA00e8YeGAYtBOOZig2V0aMfGhE0ZYGqAgmlkgnY0gmlwhDREiqaJc2VjcDI1NmsxoQM8pC_6wwTr5N2Q-yXQ1KGKsgz9i9EPLk8Ata65pUyYG4RzbmFwwIN0Y3CCdl-DdWRwgnZf`
    *   `enr:-KO4QFJc0KR09ye818GT2kyN9y6BAGjhz77sYimxn85jJf2hOrNqg4X0b0EsS-_ssdkzVpavqh6oMX7W5Y81xMRuEayGAYtBSiK9g2V0aMfGhE0ZYGqAgmlkgnY0gmlwhANzx96Jc2VjcDI1NmsxoQPwA1XHfWGd4umIt7j3Fc7hKq_35izIWT_9yiN_tX8lR4RzbmFwwIN0Y3CCdl-DdWRwgnZf`
* Mainnet
    * `enr:-KO4QHs5qh_kPFcjMgqkuN9dbxXT4C5Cjad4SAheaUxveCbJQ3XdeMMDHeHilHyqisyYQAByfdhzyKAdUp2SvyzWeBqGAYvRDf80g2V0aMfGhHFtSjqAgmlkgnY0gmlwhDaykUmJc2VjcDI1NmsxoQJUevTL3hJwj21IT2GC6VaNqVQEsJFPtNtO-ld5QTNCfIRzbmFwwIN0Y3CCdl-DdWRwgnZf`
    * `enr:-KO4QKIByq-YMjs6IL2YCNZEmlo3dKWNOy4B6sdqE3gjOrXeKdNbwZZGK_JzT1epqCFs3mujjg2vO1lrZLzLy4Rl7PyGAYvRA8bEg2V0aMfGhHFtSjqAgmlkgnY0gmlwhDbjSM6Jc2VjcDI1NmsxoQNQhJ5pqCPnTbK92gEc2F98y-u1OgZVAI1Msx-UiHezY4RzbmFwwIN0Y3CCdl-DdWRwgnZf`
  
:::warning
Yukarıdaki yapılandırmaların, bu sürümde Geth P2P Senkronizasyon Özelliğinden tam anlamıyla yararlanmak için doğru bir şekilde ayarlandığından emin olun. 
:::

Bu özelliği faydalı bulmanızı umuyoruz. Geri bildiriminiz her zaman değerlidir.