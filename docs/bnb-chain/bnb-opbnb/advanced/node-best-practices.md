---
title: En İyi Uygulamalar - opBNB Düğüm Konfigürasyonu
description: opBNB düğüm konfigürasyonu için en iyi uygulamalar hakkında bilgi alacaksınız. Bu kılavuz, düğüm modları ve depolama şemaları arasındaki farkları, performans optimizasyonlarını ve güvenlik önlemlerini içermektedir.
keywords: [opBNB, düğüm konfigürasyonu, Merkle Patricia Trie, performans optimizasyonu, güvenlik, depolama, en iyi uygulamalar]
---

# opBNB Düğüm Konfigürasyonu için En İyi Uygulamalar
## Uygun Mod ve Depolama Şemasını Seçme

opBNB, Full, Fast ve Archive olmak üzere çeşitli düğüm modlarını destekler. 
İki depolama şeması mevcuttur: HBSS (Hash Tabanlı Şema Depolama) ve PBSS (Path Tabanlı Şema Depolama).

Aralarındaki temel farklar, tarih trie verilerini koruma yöntemlerindedir.

> Merkle Patricia Trie (MPT), anahtar-değer çiftlerini verimli bir şekilde saklamak ve almak için geliştirilmiş bir veri yapısıdır. Ethereum Sanal Makinesi'nde (EVM) verilerin güvenli ve değişmez bir temsilini oluşturmak için Patricia trie ve Merkle ağacının ilkelerini birleştirir. — MPT Tanımı

MPT, aşağıdaki yetenekleri sunar:

- Tarih verilerine erişim: Belirli bir blok yüksekliğindeki bir hesabın bakiyesinin alınmasını, çağrı simülasyonlarını ve belirli blok yüksekliklerindeki izlerin hata ayıklanmasını sağlar.
- Dahil Etme ve Hariç Tutma Doğrulaması: MPT, anahtar-değer çiftlerinin hem dahil edilme hem de hariç tutulma kanıtlarını kolaylaştırır; bu, işlem doğrulaması ve blok zinciri bütünlüğünün korunması açısından kritik bir özelliktir.

Bununla birlikte, tüm tarih trie verilerini diskte korumak **önemli ölçüde kaynak talep edebilir** ve bazı uygulamalar için gereksiz olabilir. opBNB, çeşitli gereksinimleri karşılamak için farklı düğüm modları ve depolama şemaları tanıtır.

---

Modlar ve depolama şemaları arasındaki farklılıklar şu şekilde özetlenmiştir:

- Archive düğüm modu, tüm tarih trie verilerini saklar. Full düğüm modu, son 128 bloğun trie verilerini arşivlerken; fast düğüm modu yalnızca mevcut durumu saklar, trie verilerini hariç tutar.
    - Blok, işlem, makbuz ve günlük alma gibi işlevler, tüm düğüm modları arasında desteklenir. Blok verileri blok veritabanında saklandığından, trie veri saklama şemasından etkilenmez.
    - Geçmiş durum verilerine erişim, düğüm moduna göre değişir. Archive düğümleri kapsamlı geçmiş durum verisi alımını desteklerken, full ve fast düğümleri yalnızca son 128 bloğun durum verilerine erişim sağlar.
    - Trie verilerine bağlı işlevler, örneğin `eth_getProof`, `eth_getStorageAt` vb., Archive düğümleri tarafından tamamen desteklenir. Full düğümleri son 128 bloğun sorgularını sunar, fast düğümleri ise bu desteği sunmaz.
    - Özellikle, Layer 2'den Layer 1'e geçişin, en son kök hash yüksekliğine karşılık gelen `eth_getProof` verisini gerektirmesi nedeniyle, **full düğüm konfigürasyonunda belirli iyileştirmeler yapılmıştır**.

:::tip
Kendi düğümünüzü geri çekim kanıtının düzenlenmesinde kullanmanız gerekiyorsa, full düğüm modu hizmetinizdedir.
:::

- PBSS, düğüm yolunu diskte, kodlanmış yollar ve belirli anahtar öneklerini anahtarlar olarak kullanarak arşivler. Bu yöntem, PBSS'nin Merkle Patricia Trie (MPT) ile eski verileri geçersiz kılmasına olanak tanır; bu, hesap ve depolama trie arasındaki ortak anahtar sayesinde **çevrimiçi budama** sağlar ve veri tekrarını önemli ölçüde **azaltır**.
    - Archive düğüm modu yalnızca HBSS ile uyumludur, oysa Full ve Fast düğüm modları hem HBSS hem de PBSS'yi destekler.
    - Daha fazla ayrıntı için lütfen `PBSS belgesine` başvurun.

Düğüm Modlarının ve Depolama Şemalarının Karşılaştırmalı Analizi:

| **Mod**                       | **Full Düğüm (PBSS)** | **Full Düğüm (HBSS)** | **Fast Düğüm**                                            | **Archive Düğüm** |
|-------------------------------|-----------------------|-----------------------|----------------------------------------------------------|-------------------|
| **Trie Düğümlerini Koruma**  | Son 128 blok          | Son 128 blok          | Yok                                                      | Hepsi             |
| **Disk Tüketimi**            | Orta-Düşük            | Orta-Yüksek           | En Düşük                                               | En Yüksek         |
| **Otomatik Budama**          | Evet                  | Hayır                 | Uygulanamaz                                             | Uygulanamaz       |
| **Performans**                | Orta-Yüksek           | Orta-Düşük            | En Yüksek                                              | En Düşük          |
| **Güvenlik**                  | Yüksek                | Yüksek                | Diğerlerine göre daha düşük, çünkü durum kökünü doğrulamaz| Yüksek            |

### Fast Düğüm

Çoğu uygulama için, **hızlı bir düğüm işletmek önerilir**. Bu mod yalnızca mevcut durumu tutmakta olup, trie verisi taşımadığından, mevcut durumu sorgulama ve işlemleri işleme gibi görevler için uygundur.

Hızlı düğümü etkinleştirmek için, `op-geth` başlangıç komutuna `--allow-insecure-no-tries` ekleyin.

```
 ./geth --config ./config.toml --datadir ./node --syncmode full  --allow-insecure-no-tries
```

MPT durumunu budamak için (örneğin, tam düğümden hızlı düğüme geçiş yaparken), düğümü şu şekilde budayın:

```
./geth snapshot insecure-prune-all --datadir ./datadir ./genesis.json
```

> *Hızlı Düğüm, senkronizasyon sırasında Trie Verisi üretmez.*
> *Hızlı Düğüm çalışmaya başladıktan sonra, geri dönmek için tam düğüme geçiş yapmanın bir yolu yoktur.*
> *Tam Düğümü geri yüklemek için kesit verilerini yeniden indirmek gerekmektedir.*

Uygulama detayları ve daha fazla bilgi için [PR'ye](https://github.com/bnb-chain/op-geth/pull/75) başvurun.

### Full Düğüm

Tam bir düğüm işletmek, aşağıdaki durumlarda önerilir:

- Güvenlik ve güvenilirlik artırımı talepleri. Tam düğüm, tüm blokları titizlikle yürütür ve yerel olarak doğrular.
- En son 128 bloğun trie verilerini sorgulama imkanı, bir hesabın belirli bir blok yüksekliğindeki bakiyesini alma, çağrı simülasyonları ve izlerin hata ayıklanması gibi.

Tam düğümü etkinleştirmek için, `geth` komutunda `--syncmode full` bayrağını ayarlayın.

Veri tekrarını en aza indirmek ve performansı artırmak için tam düğümün PBSS ve pebble ile çalıştırılması **özellikle önerilmektedir**.

```
--state.scheme path --db.engine pebble
```

Kapsamlı bilgiler için `PBSS belgesine` başvurun.

### Archive Düğüm (op-reth ile)

Archive düğüm modu, tüm tarih trie verilerini arşivler. Bu mod, blok gezginleri ve analizler gibi tam tarih trie verilerine erişim gerektiren durumlar için uygundur.

Mevcut tarih trie verisi hacmi yaklaşık olarak **3TB**'dir (2024 yılı Nisan ayının son itibarıyla). Büyük tarih trie verileri yönetirken op-geth uygulamasında önemli performans sorunları yaşanabilir. Bu sebeple, archive düğümünün op-reth ile çalıştırılması **önerilmektedir**.

Daha fazla ayrıntı için `Reth Düğümü opBNB için` başvurabilirsiniz.

## Kesitler

En son kesit verileri [opbnb-snapshot](https://github.com/bnb-chain/opbnb-snapshot) deposu aracılığıyla erişilebilir.

Kesit verilerini kullanmak, düğüm senkronizasyonu için gereken süreyi **önemli ölçüde azaltabilir**.

## Performans Optimizasyonu

`op-geth` performansını artırmak için, önbellek ayarlarını uygun bir şekilde yapılandırmak önemlidir. Fiziksel belleğin yaklaşık üçte biri kadar bir alanı önbelleğe ayırmak tavsiye edilmektedir. Örneğin, sistemin fiziksel belleği 64GB ise, önbellek ayarı şu şekilde ayarlanabilir:

```
--cache 20000
```

Bu tahsis, önbelleğin sistem kaynaklarının verimli kullanımı için optimize edilmesini sağlar ve nihayetinde `op-geth` performansının artmasına yol açar.

## Sunucuyu Daemon Olarak Çalıştırma

Kesintisiz bir çalışma sağlamak için, `op-node` ve `op-geth`'nin sürekli çalışır durumda tutulması önemlidir. En basit ve önerilen çözümlerden biri, bunları systemd hizmeti olarak kaydetmektir. Böylece sistem yeniden başlatıldığında ve diğer ilgili olaylar meydana geldiğinde otomatik olarak başlatılacak ve manuel müdahale gerektirmeden kesintisiz bir çalışma sağlanacaktır.

## Güvenlik

### Tam Düğüm RPC'nizi Hackerlardan Koruma

Tam Düğüm RPC uç noktalarınızı yetkisiz erişimden korumak çok önemlidir. RPC uç noktalarının kamu ağına açılması güvenlik riskleri oluşturabilir, bu nedenle erişimi sınırlamak ve yetkisiz girişleri önlemek için uygun güvenlik önlemleri almak önemlidir.

### Yazılım Güvenlik Açıkları

Düğümünüzün ve varlıklarınızın güvenliğini sağlamak için yazılımları yalnızca **resmi kaynaklardan indirmek** çok önemlidir. Ayrıca, yazılımı en son, en güvenli sürümüne düzenli olarak güncellemek de önemlidir. Bu uygulamalara uyarak, olası güvenlik açığı risklerini azaltabilir ve düğümünüzü ve varlıklarınızı güvenlik tehditlerinden koruyabilirsiniz.

## SSS

### Neden düğümüm, ani bir kapanıştan sonra çevrimdışı durumu veya blok yüksekliği gecikmesi yaşıyor?

Uzun bir süre senkronize edilmiş düğümü çalıştırdıktan sonra, düğümü (op-geth süreci) ani bir şekilde kapatmak, yeniden başlatıldığında bir çevrimdışı durumu dönemiyle sonuçlanabilir. Özellikle yalnızca arşiv düğümlerinin bu tür bir olaydan sonra hızla yeniden senkronize olması beklenir.

Bu davranışın nedeni Geth'in işleyiş doğasındadır. Geth çökerse veya düzgün bir şekilde kapatılmazsa, bellekte tutulan son durum kaybolur ve yeniden üretilmesi gerekir. Bu nedenle, Geth'in bu durumları geri yüklemesi için **önemli bir süre alabilir**.

Bu uzun geri yükleme işleminin temel nedeni, Geth'in durum trie'yi periyodik olarak temizlemesidir. Bu temizleme sıklığı, yapılandırma dosyasındaki (config.toml) trieTimeout parametresi ile tanımlanır. Bu periyodik temizleme, düğümün durumundaki tutarlılığı ve bütünlüğü korumak amacıyla yapılır, ancak ani bir kapanış durumunda durumların yeniden üretilmesi için gerekli süreye de katkıda bulunur.