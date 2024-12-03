---
title: Fiyat Oracleları
seoTitle: Fiyat Oracleları - XRP Ledger Kılavuzu
sidebar_position: 4
description: Fiyat oracleları, blok zincirlerinin dışındaki verileri toplamak ve iletmek için kullanılan önemli bir teknolojidir. Bu yazıda, XRP Ledgerdaki fiyat oraclelarının nasıl çalıştığını ve ne gibi faydalar sağladığını keşfedeceksiniz.
tags: 
  - fiyat oracle'ları
  - blok zinciri
  - merkeziyetsiz finans
  - XRP Ledger
  - veri akışı
keywords: 
  - fiyat oracle'ları
  - blok zinciri
  - merkeziyetsiz finans
  - XRP Ledger
  - veri akışı
---

# Fiyat Oracle'ları

_(Requires the [PriceOracle amendment][])_

Blok zincirleri doğası gereği ağın dışındaki olaylarla etkileşimde bulunamaz ve "ne olduğunu" bilemezler, ancak merkeziyetsiz finansın birçok kullanım durumu bu bilgiye ihtiyaç duyar.

Fiyat oracle'ları bu sorunu çözer. Bir oracle, piyasa fiyatları, döviz kurları veya faiz oranları gibi gerçek dünya bilgilerini toplayan ve bunu blok zincirine ileten bir hizmet veya teknolojidir. Blok zincirleri gibi, çoğu oracle da merkeziyetsizdir ve verileri birden fazla düğüm aracılığıyla doğrular.

:::info
Genel olarak, oracle'lar yalnızca finansal bilgileri sağlamakla sınırlı değildir. Bir spor takımının bir maçı kazanıp kazanmadığı veya havanın durumu gibi her türlü bilgi sağlayabilirler. Ancak, XRP Ledger'ın Fiyat Oracleı özelliği, varlıkların fiyatlarını rapor etmek için özel olarak tasarlanmıştır.
:::

## Oracle'ların Çalışma Şekli

Çoğu oracle blok zincir etkileşimi bunun gibi çalışır:

1. **Veri**, merkeziyetsiz bir oracle ağı tarafından offchain (büyük ağ dışında) doğrulanır.
2. **Veri**, blok zincirine gönderilir.
3. Blok zinciri, bu bilgiyi **akıllı bir sözleşmeyi** yürütmek için kullanır; örneğin bir emanet hesabından fonları serbest bırakmak.

Bu işlem ters yönde de çalışabilir, işlem bilgilerini dış sistemlere iletebilir.

## XRP Ledger'da Fiyat Oracle'ları

XRPL fiyat oracle'ları, XRP Ledger'ın yerel DeFi işlevselliğini artıran yerel, zincir üstü bir oracle'dır. Off-chain fiyat oracle'ları verilerini XRPL oracle'larına gönderir; bu oracle'lar bilgiyi zincir üzerinde depolar. Merkeziyetsiz uygulamalar daha sonra **fiyat verileri** için XRPL oracle'larını sorgulayabilir; birden fazla XRPL oracle'ı sorgulanarak risk ve hatalar minimize edilebilir.

> "Bu şekilde fiyat veri akışlarını standartlaştırarak, tüm XRPL uygulamaları güvenilir ve ortak bir veri kaynağına erişebilir."  
> — XRP Ledger Dokümantasyonu

---

## Ayrıca Bakınız

- **Referanslar:**
    - [get_aggregate_price method][]
    - [Oracle entry][]
    - [OracleDelete transaction][]
    - [OracleSet transaction][]

raw-partial file="/docs/_snippets/common-links.md