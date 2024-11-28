---
title: PBSS ve PebbleDB ile op-geth Çalıştırma - opBNB
description: Bu belge, PBSS ve PebbleDB ile op-geth başlatma sürecini detaylı bir şekilde açıklamaktadır. Gerekli parametreler, mimari ve potansiyel sınırlamalar hakkında bilgi sağlamaktadır.
keywords: [op-geth, PBSS, PebbleDB, blockchain, veri tabanı]
---

# PBSS ve PebbleDB ile op-geth Nasıl Çalıştırılır

PBSS ve PebbleDB ile op-geth başlatmak için aşağıdaki bayrakları dahil edin:

```bash
--state.scheme path --db.engine pebble
```

:::info
Bu özelliği aktifleştirmek için v0.3.1-alpha veya daha sonraki bir sürüm kullanmanızı öneririz.
:::

Başarıyla başlatıldığında, günlükler PBSS ve PebbleDB'nin başlatıldığını onaylayacaktır:

```bash
INFO [03-21|07:00:25.684] Using pebble as the backing database
INFO [03-21|07:00:47.039] State scheme set by user                 scheme=path
```

## PBSS (Yol Tabanlı Şema Depolama)

PBSS, trie düğümlerini disk üzerinde kodlanmış yol ve özel bir anahtar öneki kullanarak depolar. Bu yaklaşım, PBSS'nin

> **Merkle Patricia Trie (MPT)** bileşeninin eski verileri, hesap trie ve depolama trie arasındaki paylaşılan anahtar nedeniyle üstte yazmasına olanak tanır. 

Bu özellik sadece **çevrimiçi budama** ile değil, aynı zamanda **veri aşınmasını önemli ölçüde azaltma** ile de ilişkilidir.

PBSS mimarisi 128 diferansiyel katmandan (hafıza içinde) ve bir disk katmanından oluşmaktadır, aşağıda gösterildiği gibi.
Diferansiyel katmanlar sadece durum verisi değişikliklerini depolar.

```plaintext
+-------------------------------------------+
| Block X+128 State                         |
+-------------------------------------------+
| Block X+127 State                         |
+-------------------------------------------+
|              .......                      |
+-------------------------------------------+
| Block X+1 State, Bottom-most diff layer   |
+-------------------------------------------+
| Block X State, Disk layer (singleton trie)|
+-------------------------------------------+
```

**PBSS, üstün okuma performansı** sunar ve daha hızlı trie erişimi ve yineleme sağlar. Disk üzerinde durum trie'nin tek bir versiyonunu tutar ve yeni trie'leri (durum/depolama/hesap trie'de değişiklikler) yalnızca hafızada saklar.

### Sınırlamalar

* **Yalnızca son 129 blokun durum verileri için sorguları destekler**

  Bu aralıktan daha fazla veriye ihtiyaç duyan RPC istekleri bir hata döndürecektir: `missing trie node ${hash} (path ${path})`.
  Sadece trie verisini sorgulamak için ihtiyaç duyan RPC yöntemleri, örneğin `eth_getProof`, bu sınırlamadan etkilenecektir,
  diğerleri etkilenmeyecektir.

* **opBNB'nin çekim işlevi desteklenmeyebilir**

  Bu işlev, bir çekim kanıtı elde etmek için bir saat öncesinin durum verilerini sorgulamayı gerektirebilir ki bu henüz
  desteklenmiyor. Gelecek sürümler bu sınırlamayı giderecektir.

## PebbleDB

PebbleDB, artık topluluk için varsayılan veritabanı olarak go-ethereum'a entegre edilmiştir. Flush ve sıkıştırmalar için bir
kısıtlama mekanizması bulunmayan LevelDB'nin yerini almış ve yoğun okuma ve yazma işlemleri sırasında gecikme zirvelerine yol 
açmıştır.

Tam tersine, PebbleDB flush ve sıkıştırmalar için ayrı hız limitörlerine sahip olup, gerektiği gibi işlemler gerçekleştirir ve
**gereksiz disk bant genişliği tüketimini azaltır**.

## SSS

### Mevcut bir düğüm için `state.scheme` veya `db.engine` değiştirilebilir mi?

Hayır, mevcut bir düğüm için `state.scheme` veya `db.engine` değiştirilemez. İstenilen konfigürasyon ile yeni bir düğüm
başlatmalısınız.