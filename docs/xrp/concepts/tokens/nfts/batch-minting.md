---
title: Toplu Basım
seoTitle: NFTlerde Toplu Basım Yöntemleri
sidebar_position: 4
description: NFTlerin toplu basım yöntemleri arasında talep üzerine basım ve betik tabanlı basım bulunmaktadır. Her iki yaklaşımın avantajları ve dezavantajları ele alınmıştır.
tags: 
  - NFT
  - toplu basım
  - talep üzerine basım
  - betik tabanlı basım
  - XRP Ledger
keywords: 
  - NFT
  - toplu basım
  - talep üzerine basım
  - betik tabanlı basım
  - XRP Ledger
---

## Toplu Basım

NFT'leri toplu olarak basmanın iki yaygın yaklaşımı vardır: **talep üzerine basım** ve **betik tabanlı basım**.

## Talep Üzerine Basım (Tembel Basım)

:::tip
Talep üzerine basım modeli, müşterilere NFT'nin ilk satışları için alım veya satım teklifleri verme imkanı tanır.
:::

Talep üzerine basım modeli kullanıldığında, siz ve potansiyel müşteriler NFT'nin ilk satışları için alım veya satım teklifleri verirsiniz. İlk satışa hazır olduğunuzda, token'ı basarsınız, bir satım teklifi oluşturur veya bir alım teklifini kabul edersiniz ve ardından işlemi tamamlarsınız.

### Avantajlar

* Satılmamış NFT'leri tutmak için *rezerv gereksinimi* yoktur.
* Satılacağını bildiğiniz zaman NFT'leri **gerçek zamanlı** olarak basarsınız.

### Dezavantaj

NFT'nin ilk satışından önceki piyasa etkinliği XRP Ledger üzerinde kaydedilmez. Bazı uygulamalar için bu bir sorun olmayabilir.

---

## Betik Tabanlı Basım

Bir program veya betik kullanarak bir kerede birçok token basın. `Biletler` işlemleri paralel olarak göndermenize yardımcı olabilir ve şu anki sınırda bir grupta 200 işleme kadar izin verir.

Pratik bir örnek için `JavaScript Kullanarak NFT'leri Toplu Basma` eğitimine bakın.

### Avantajlar

* NFT'ler *önceden* basılır.
* NFT'nin ilk satışına ilişkin piyasa etkinliği defterde kaydedilir.

### Dezavantaj

Basılan tüm NFT'ler için `rezerv gereksinimini` karşılamanız gerekir. Kural olarak, bu, mevcut rezerv oranına göre her NFT başına yaklaşık *1/12 XRP*'dir. Yeterince XRP rezerviniz yoksa, mintleme işlemleriniz başarısız olur ve daha fazla XRP alana kadar devam etmez.