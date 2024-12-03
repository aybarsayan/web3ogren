---
title: Tarih Şardları
seoTitle: Tarih Şardları - XRP Ledger
sidebar_position: 4
description: Tarih şardları, XRP Ledgerın tarih verilerini etkili bir şekilde yönetmek ve sunucular arasında paylaşıp korumak için bir depolama sistemi sunar. Bu yöntem, ağın işlem geçmişini şard adı verilen segmentlere bölerek her sunucunun verileri yönetimini kolaylaştırır.
tags: 
  - XRP Ledger
  - tarih şardları
  - veri saklama
  - sunucu mimarisi
  - defter verileri
  - şard deposu
  - ağ yönetimi
keywords: 
  - XRP Ledger
  - tarih şardları
  - veri saklama
  - sunucu mimarisi
  - defter verileri
  - şard deposu
  - ağ yönetimi
---

## Tarih Şardları

badge href="https://github.com/XRPLF/rippled/releases/tag/0.90.0Tanıtıldı: rippled 0.90.0/badge %}

XRP Ledger sunucuları çalışırken, doğal olarak ağ çalışması sırasında inşa ettikleri veya edindikleri defterler hakkında veri içeren bir veritabanı üretirler. Her sunucu, o defter verisini _defter deposunda_ saklar, ancak `çevrimiçi silme` işlemi zamanla eski defter verilerini otomatik olarak kaldırır. **Tarih şardları**, ağın XRP Ledger'ın (birden fazla terabayt) tarihinin tamamını kaydetme işini bölecek şekilde eski defter tarihleri için ayrı bir depolama sistemi sağlar.

Tarihsel şardlama, XRP Ledger'ın işlem geçmişini sunucular arasında parçalar, şard adı verilen segmentlere böler. Bir şard, defterlerin bir aralığıdır. Bir sunucu, hem defter deposu hem de şard deposu için benzer formatı kullanır, ancak iki depo ayrıdır.


---

## Tarih Şardlarını Edinme ve Paylaşma

:::info
Sunucular, tarih şardlarını yalnızca bunları almak için yapılandırıldıklarında edinir ve depolar.
:::

Şard edinme işlemi, ağ ile senkronize olduktan sonra ve yapılandırılmış son defter sayısına kadar defter tarihlerini geri yükledikten sonra başlar. Daha düşük ağ etkinliği döneminde, bir şard veritabanı tutmak üzere ayarlanmış bir sunucu rastgele bir şard seçer ve bunu şard deposuna ekler. Ağ defter tarihinin eşit dağılımı için olasılığı artırmak amacıyla, şardlar edinilmek üzere rastgele seçilir ve en son şard herhangi bir özel dikkate alınmaz.

Bir şard seçildiğinde, defter edinme süreci şard içindeki son defterin sırasını alarak başlar ve ilk deftere doğru geri çalışır. Alım süreci, sunucunun veriyi yerel olarak kontrol etmesiyle başlar. Mevcut olmayan veriler için sunucu, akranlarından veri talep eder. İstenen dönem için verileri mevcut olan sunucular, tarihlerini yanıtlar. İstenen sunucu, bu yanıtları birleştirerek şard oluşturur. **Şard**, belirli bir aralıkta tüm defterleri içerdiğinde tamamlanmış olur.

Sunucu, depolamak için yapılandırıldığı maksimum şard sayısına ulaşana kadar ek şardları seçer ve indirir. Eğer bir sunucu bir şardı tamamen edinmeden önce alanı kalmazsa, devam etmek için bir alan açılana kadar alım işlemini durdurur.

---

## XRP Ledger Ağı Veri Bütünlüğü

Tüm defterlerin geçmişi, sunucuların belirli tarih aralıklarını tutmak için anlaşmalarıyla paylaşılır. Bu, sunucuların sahip olmaya karar verdikleri tüm verilerin kendilerinde bulunduğunu doğrulamasını sağlar ve her defterin blok zinciri tarihinin önceki duruma işlem uygulamanın sonucu olduğunu gösteren "kanıt ağaçları" veya "defter delta"ları üretmelerine olanak tanır. **Tarih şardlama** yapılandırılmış sunucular, depoladıkları şardları rastgele seçtiği için, tüm kapatılan defterlerin geçmişi normal bir dağılım eğrisi içinde saklanır ve XRP Ledger Ağı'nın tarihi eşit şekilde tutma olasılığını artırır.

Tarih şardları, deterministik bir formatta kaydedilir. Bu, aynı şardı bir araya getiren iki sunucunun, verileri ne sırayla edindiklerinden ve nereden elde ettiklerinden bağımsız olarak aynı ikili veriyi üretmesini sağlar. Bu, şard verisinin bütünlüğünü doğrulamak için kontrol düzenekleri veya kriptografik hash'lerin karşılaştırılmasını mümkün kılar. **Ayrıca**, tarih şardlarının diğer formatlarla paylaşılması ve içe aktarılması mümkündür. (Örneğin, şard verisini Bittorrent kullanarak indirebilir veya önceden yüklenmiş şard verisi ile fiziksel ortam satın alabilir ve bunun, ağdan indirilebilecek verilerle eşleşip eşleşmediğini doğrulayabilirsiniz.) badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1Yeni: rippled 1.8.1/badge %}

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Defterler`
    - `Konsensüs`
- **Eğitimler:**
    - `Kapasite Planlama`
    - `Configure `rippled`
        - `Tarih Şardlamasını Yapılandırın`
- **Referanslar:**
    - [crawl_shards yöntemi][]
    - [download_shard yöntemi][]
    - `Akran Tarayıcı`

