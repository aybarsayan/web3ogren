---
title: Konser Biletleri Satış Akıllı Sözleşmesi
--- 

# Konser Biletleri Satış Akıllı Sözleşmesi

Bu akıllı sözleşme, etkinlik biletlerini yarı fungible bir varlık biçiminde, fungible olmayan tokenler (NFT) olarak basmak ve satmak için tasarlanmıştır. Bu örnekte üç kategori veya bilet sınıfı bulunmaktadır:

- Ön sıra biletleri en pahalı olanlardır.
- Orta sıra biletleri pahalı ve ucuz koltuklar arasında bir fiyat aralığına sahiptir.
- Arka sıra biletleri en düşük fiyatlıdır.

> Not: Bu sözleşme, geleneksel ticareti yani bir satıcı ile bir tüketici arasındaki etkileşimi simüle etmektedir.

## Amaç

Bu eğitimin aşağıdaki hedefleri vardır:

- **Bir akıllı sözleşme kurma** konusunda temel bir rehber.
- Agoric ortamında **varlık ticaretini başlatma** sürecini açıklamak; bu, varlıkların listelenmesi, fiyatlarının belirlenmesi vb. işlemleri içerir.
- Ticaretin arkasındaki iş mantığını yöneten bir **ticaret yöneticisi** geliştirmek.

## Sözleşme Kurulumu

Öncelikle, çeşitli varlık türleri hakkında temel bilgileri tutan bir `inventory` nesnesini göz önünde bulunduralım. Bu durumda, bu nesne bilet kategorilerini temsil eder. Bu nesne, her bilet türü için `tradePrice` ve her kategori için mevcut en fazla miktarı belirten `maxTickets` gibi kritik bilgileri içerir. Örneğin:

```js
const inventory = {
  frontRow: {
    tradePrice: AmountMath.make(istBrand, 3n),
    maxTickets: 3n
  },
  middleRow: {
    tradePrice: AmountMath.make(istBrand, 2n),
    maxTickets: 5n
  },
  backRow: {
    tradePrice: AmountMath.make(istBrand, n),
    maxTickets: n
  }
};
```

Sözleşmemiz, süreci başlatmak için sağlanan `inventory` nesnesini bir parametre olarak alır. Sözleşme başlatıldıktan sonra, "Bilet" varlığı için yeni bir  oluşturulur.


Not: AssetKind varlık türlerini ifade eder

Üç tür  vardır.  belirlemek için sağlanan belgelere başvurabilirsiniz.

Bizim örneğimizde, biletler fungible değil ve kopyaları olabiliyor, yani bir türden birçok bilet olabilir. Bu nedenle `AssetKind.COPY_BAG` kullanıyoruz.



```js
const ticketMint = await zcf.makeZCFMint('Ticket', AssetKind.COPY_BAG);
const { brand: ticketBrand } = ticketMint.getIssuerRecord();
```

Varlığımız tanımlandıktan sonra, akıllı sözleşmemizin başında envanterimizi basacak ve bunu `inventorySeat` nesnesine tahsis edeceğiz. Bu, kullanıcının satın alabileceğinden daha fazlasını alıp almayacağını kontrol etmemizi sağlar. Bu,  kullanarak yapılabilir.


Kodu daha iyi anlamak için:

, ,  ve  hakkında bir göz atın.



```js
const inventoryBag = makeCopyBag(
  Object.entries(inventory).map(([ticket, { maxTickets }], _i) => [
    ticket,
    maxTickets
  ])
);
const toMint = {
  Tickets: {
    brand: ticketBrand,
    value: inventoryBag
  }
};
const inventorySeat = ticketMint.mintGains(toMint);
```

## Bilet Ticareti

Etkinlik biletleri satın almak isteyen müşteriler, `makeTradeInvitation` kullanarak bilet ticareti yapmak için önce .

```js
const makeTradeInvitation = () =>
  zcf.makeInvitation(tradeHandler, 'buy tickets', undefined, proposalShape);
```

Burada iki önemli parametre görebilirsiniz:

- **tradeHandler**: `tradeHandler` fonksiyonu, bir alıcı teklif yaptığında çağrılır. Bu fonksiyon, her ticareti işlerken takip edilecek sözleşmenin mantığını içerir ve doğru prosedürlerin izlendiğinden emin olur.

```js
const tradeHandler = buyerSeat => {
  const { give, want } = buyerSeat.getProposal();
  // ... kontroller ve transferler
};
```

- **proposalShape** (Opsiyonel): Bu nesne, her  gerekli ve izin verilen unsurlarını outline eder. İşte bu sözleşme için teklif şekli:

```js
const proposalShape = harden({
  give: { Price: AmountShape },
  want: { Tickets: { brand: ticketBrand, value: M.bag() } },
  exit: M.any()
});
```

## Ticaret Yöneticisi

`tradeHandler` fonksiyonu, ticareti karşılamak için yeterli bilet olup olmadığını kontrol ederek başlar:

```js
AmountMath.isGTE(inventorySeat.getCurrentAllocation().Tickets, want.Tickets) ||
  Fail`Yeterli envanter yok, ${q(want.Tickets)} istendi`;
```

Sonra, toplam fiyat `bagPrice` kullanılarak hesaplanır:

```js
const totalPrice = bagPrice(want.Tickets.value, inventory);
```

Ardından, teklif edilen fiyatın yeterli olup olmadığını kontrol ederiz:

```js
AmountMath.isGTE(give.Price, totalPrice) ||
  Fail`Toplam fiyat ${q(totalPrice)}, ancak ${q(give.Price)} teklif edildi`;
```

Son olarak, gerekli ödemeyi almak için `atomicRearrange` çağrılabilir:

```js
atomicRearrange(
  zcf,
  harden([
    // alıcıdan gelir
    [buyerSeat, proceeds, { Price: totalPrice }],
    // envanterden alıcıya bilet
    [inventorySeat, buyerSeat, want]
  ])
);
```

Bu örnek kodun tamamını  inceleyebilirsiniz.

Bu eğitimi takip ederken, bu video yürüyüşünü izlemeniz faydalı olabilir:



