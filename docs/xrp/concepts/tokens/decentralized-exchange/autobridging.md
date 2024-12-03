---
title: Otomatik Köprüleme
seoTitle: XRP Otomatik Köprüleme Sistemi
sidebar_position: 4
description: Otomatik köprüleme, maliyetleri düşürdüğünde XRPyi aracılık olarak kullanarak emir defterlerini otomatik olarak bağlar. Bu sistem sayesinde, varlık çiftleri arasındaki likidite artırılabilir ve daha iyi döviz kurları elde edilebilir.
tags: 
  - XRP
  - merkeziyetsiz takas
  - otomatik köprüleme
  - piyasa
  - likidite
keywords: 
  - XRP
  - merkeziyetsiz takas
  - otomatik köprüleme
  - piyasa
  - likidite
---

## Otomatik Köprüleme

XRP Ledger'in `merkeziyetsiz takas` sisteminde iki token değiştirmek için yapılabilecek herhangi bir `Teklif`, potansiyel olarak XRP'yi sentetik bir emir defterinde aracılık para birimi olarak kullanabilir. **Bunun nedeni**, doğrudan ticaret yapmaktan daha ucuz olduğunda XRP kullanarak tüm varlık çiftleri arasındaki likiditeyi artırmayı amaçlayan _otomatik köprüleme_ sistemidir. Bu, XRP'nin XRP Ledger'a ait bir yerel kripto para birimi olmasından kaynaklanmaktadır. Teklifin gerçekleştirilmesi, en iyi toplam döviz kuru elde etmek için doğrudan ve otomatik köprülenmiş teklifler kombinasyonunu kullanabilir.

> **Örnek:** _Anita, GBP satıp BRL almaya yönelik bir teklif veriyor. Bu alışılmadık piyasada çok az teklif bulabileceğini görebilir. İyi bir oranla bir teklif var, ancak Anita'nın ticaretini tatmin edecek yetersiz bir miktara sahip. Ancak, hem GBP hem de BRL, XRP'ye aktif ve rekabetçi piyasalara sahiptir. XRP Ledger'in otomatik köprüleme sistemi, Anita'nın teklifini tamamlamak için bir tüccardan GBP ile XRP satın almayı, ardından XRP'yi başka bir tüccara satarak BRL almayı bulur. Anita, doğrudan GBP:BRL pazarındaki küçük teklifi, GBP:XRP ve XRP:BRL tekliflerini eşleştirerek oluşturulan daha iyi bileşik oranlarla birleştirerek otomatik olarak mümkün olan en iyi oranı alır._  
— Örnek Anlatımı

Otomatik köprüleme, herhangi bir [Teklif Oluşturma işlemi][] otomatik olarak gerçekleşir. :::info  
`Ödeme işlemleri` _varsayılan olarak_ otomatik köprüleme kullanmaz, ancak yol bulma `yolları` aynı etkiye sahip yollar bulabilir. :::info



## Ayrıca Bakınız

- [Geliştirici Blogu: Otomatik Köprülemenin Tanıtımı](https://xrpl.org/blog/2014/introducing-offer-autobridging.html) 
- `Teklif Tercihi`
- `Ödeme Yolları`

