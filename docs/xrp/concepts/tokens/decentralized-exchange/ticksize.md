---
title: Tick Boyutu
seoTitle: Tick Boyutu - Döviz Kurları ve TickSize
sidebar_position: 4
description: İhraççılar, döviz kurlarındaki önemsiz farklılıklar nedeniyle sipariş defterlerindeki churnu azaltmak için para birimleri için özel tick boyutları ayarlayabilirler.
tags: 
  - Tick Boyutu
  - İhraççı
  - Döviz Kurları
  - XRP Ledger
  - Ticaret
  - Teklif
keywords: 
  - Tick Boyutu
  - İhraççı
  - Döviz Kurları
  - XRP Ledger
  - Ticaret
  - Teklif
---

## Tick Boyutu

Bir Teklif bir sipariş defterine yerleştirildiğinde, döviz kuru, Teklifin ilgili para birimlerinin ihraççılar tarafından ayarlanan `TickSize` değerlerine göre kesilir. XRP ve bir token alım satımı yapıldığında, tokenın ihraççısından gelen `TickSize` uygulanır. İki token alım satımı yapıldığında, Teklif daha küçük `TickSize` değerini (yani, daha az anlamlı basamağa sahip olanı) kullanır. Eğer hiçbir token için `TickSize` ayarlanmamışsa, varsayılan davranış uygulanır.

:::info
`TickSize` değeri, bir teklif sipariş defterine yerleştirildiğinde döviz kurundaki _anlamlı basamakların_ sayısını keser.
:::

İhraççılar, bir [AccountSet transaction][]. kullanarak `TickSize`'ı `3` ile `15` arasında bir tamsayı olarak ayarlayabilirler. Döviz kuru, anlamlı basamaklar ve bir üstel biçiminde temsil edilir; `TickSize`, üssü etkilemez. Bu, XRP Ledger'ın değeri büyük ölçüde farklı olan varlıklar arasındaki döviz kurlarını temsil etmesini sağlar (örneğin, yüksek enflasyona sahip bir para birimi ile nadir bir emtia arasında). **İhraççının ayarladığı `TickSize` ne kadar düşükse**, tüccarların mevcut Tekliflere göre daha yüksek bir döviz kuru olarak kabul edilebilmeleri için sunmaları gereken artış o kadar büyük olmalıdır.

> Eğer `TickSize`, anında gerçekleştirilebilecek bir Teklifin kısmını etkilemez. (Bu nedenle, `tfImmediateOrCancel` ile Teklif Oluşturma işlemleri `TickSize` değerlerinden etkilenmez.)  
> — XRP Ledger Belgeleri

Teklif tamamen gerçekleştirilemiyorsa, işlem motoru döviz kurunu hesaplar ve `TickSize`'a göre keser. Ardından, motor, kesilen döviz kuruna uyması için Teklifin "daha az önemli" tarafındaki kalan miktarı yuvarlar. Varsayılan bir Teklif Oluşturma işlemi (bir "al" Teklifi) için `TakerPays` miktarı (alınan miktar) yuvarlanır. Eğer `tfSell` bayrağı etkinleştirilmişse (bir "sat" Teklifi) `TakerGets` miktarı (satılan miktar) yuvarlanır.

:::warning
Bir ihraççı `TickSize`'ı etkinleştirdiğinde, devre dışı bıraktığında veya değiştirdiğinde, önceki ayarda yerleştirilen Teklifler etkilenmez.
:::

## Ayrıca Bakınız

- [Geliştirici Blogu: TickSize Değişikliğini Tanıtma](https://xrpl.org/blog/2017/ticksize-voting.html#ticksize-amendment-overview)
- **Referanslar:**
    - [AccountSet transaction][]
    - [book_offers method][]
    - [OfferCreate transaction][]


Ek Bilgiler



