---
title: Düğüm Bakımı - BSC Geliştir
description: Bu belge, BSC geliştiricilerine yönelik düğüm bakımı ve veri kesme yöntemlerini ele almaktadır. Performansı artırmak için güncel sürümlerin önemi, depolama boyutu yönetimi ve eski verilerin kesilmesi hakkında bilgiler sunulmaktadır.
keywords: [BSC, düğüm bakımı, veri kesme, SSD, performans, eski veriler, upgrade]
---

# Düğüm Bakımı
### İkili
Tüm kullanıcıların en son sürüme yükseltmeleri önerilmektedir. [en son sürüm](https://github.com/bnb-chain/bsc/releases/latest) daha stabil olduğu ve daha iyi performans sağladığı söylenmektedir.

### Depolama

#### Durumu Kısma

Testlere göre, bir tam düğümün performansı depolama boyutu yüksek bir hacme ulaştığında kötüleşecektir (önceki değer 1.5TB idi, bu deneysel bir değerdir, en son sayı güncellenmelidir). **Tam düğümün depolamayı kısarak her zaman hafif depolama sağlamasını öneriyoruz.**

:::tip
Depolama alanını verimli kullanmak için düzenli olarak veri kesme işlemi yapmayı ihmal etmeyin.
:::

#### Kısma Nasıl Yapılır 

1. BSC düğümünü durdurun.
2. `nohup geth snapshot prune-state --datadir {bsc düğümünüzün veri dizini} &` komutunu çalıştırın. Tamamlanması 3-5 saat sürecektir.
3. İşlem tamamlandığında düğümü başlatın.

**Yönetimcilerin, düğümlerden biri kesildiğinde yedek düğümlere sahip olmaları önemlidir.** Donanım da önemlidir, **SSD’nin şunları karşıladığından emin olun: 3 TB boş disk alanı, katı hal sürücüsü (SSD), gp3, 8k IOPS, 500 MB/S aktarım hızı, okuma gecikmesi <1ms (eğer düğüm snap sync ile başlatılmışsa, NVMe SSD gereklidir)**.

#### Gerçek Zamanlı Eski Verileri Kısma

Eski veriler, zaten değiştirilemez olarak kabul edilen blok verileridir. Bu, 90000 olarak ayarlanan bir eşik ile belirlenir. **Bu, 90000’den daha eski blokların eski veri olarak kabul edildiği anlamına gelir.** Eski verilere önem vermeyen kullanıcılar için `--prunceancient` bayrağını öneriyoruz. Bu ayrıca, sadece en son 90000 blok için veri tutmak isteyen kullanıcılar için tavsiye edilmektedir. Bu bayrak etkinleştirildiğinde, eski verilerin geri alınamayacağını ve başlatma komutunda bu bayrak olmadan düğümünüzü çalıştırmaya geri dönemeyeceğinizi unutmayın.

#### Bayrağı Nasıl Kullanılır

```
./geth --tries-verify-mode none --config /server/config.toml --datadir /server/node --cache 8000 --rpc.allow-unprotected-txs --history.transactions 0 --pruneancient=true --syncmode=full
```

#### Blok Kısma Araçları

İstenmeyen eski blok verilerini kesmek için [v1.1.8](https://github.com/bnb-chain/bsc/releases/tag/v1.1.8) sürümünde tanıtılan yeni bir çevrimdışı özelliktir. **Bu, alan kazanmak için eski veritabanındaki blok, makbuz ve başlıkların dışlanmasını sağlar.**

##### Kısma Nasıl Yapılır

1. BSC Düğümünü durdurun.
2. Çalıştırın 
    ```
    ./geth snapshot prune-block --datadir /server/node --datadir.ancient ./chaindata/ancient --block-amount-reserved 1024
    ```
    
    `block-amount-reserved`, kısma işleminden sonra tutmak istediğiniz eski veri bloğu sayısını belirtir.

### Hafif Depolama
Düğüm çöktüğünde veya zorla kapatıldığında, düğüm birkaç dakika veya birkaç saat önceki bir bloktan senkronize olacaktır. **Bunun nedeni, hafızadaki durumun veritabanına gerçek zamanlı olarak aktarılmaması ve düğümün başlatıldığında son kontrol noktasından blokları yeniden oynaması gerektiğidir.** Yeniden oynatma süresi, config.toml'daki `TrieTimeout` yapılandırmasına bağlıdır. **Uzun yeniden oynatma süresine tolerans gösterebiliyorsanız, bunu artırmanızı öneririz, böylece düğüm hafif depolama sağlayabilir.**

## Geth'i Yükseltme

:::info
Lütfen `bu kılavuzu` okuyun.
:::