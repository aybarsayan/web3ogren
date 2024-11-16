---
title: ConstantProduct AMM Sözleşmesi
---



#####  (Son güncelleme: 15 Ağustos 2022)

##### 

Constant Product AMM, birden fazla likidite havuzunu destekleyen ve havuzlar arasında doğrudan değişim yapan otomatik piyasa yapıcıdır (AMM). "Constant Product" AMM olarak adlandırılmasının nedeni, piyasa yapıcının fiyatlar değiştikçe ticaret yapmaya devam edebilmesini sağlayan sabit ürün kuralını kullanmasıdır. (Sabit ürün kuralı, iki varlık havuzunun içeriğinin çarpımının sabit kalmasını sağlamak suretiyle ticaretin gerçekleşmesini sağlar.)

Her likidite havuzu, merkezi bir token ile ikincil bir token arasındaki değişimler için bir fiyatı muhafaza eder. İkincil tokenler birbiriyle değiştirilebilir ama yalnızca merkezi token aracılığıyla. Örneğin, BLD ve ATM iki token türü ise ve IST merkezi para birimiyse, ATM verip BLD almak isteyen bir takas, önce (ATM, IST) havuzunu, ardından (BLD, IST) havuzunu kullanacaktır. İki ikincil token arasında doğrudan likidite havuzları bulunmamaktadır.

Bu sözleşmenin yalnızca bir örneği gerekli olmalıdır, böylece likidite mümkün olduğunca paylaşılabilir. Her ikincil para biriminin ayrı bir likidite havuzu vardır.

Sözleşme oluşturulduğunda, şartlar merkezi token'ı belirtir. Likidite ekleme ve çıkarma ile ticaret yapma davetleri, publicFacet üzerinde çağrılar yapılarak elde edilebilir. Diğer publicFacet işlemleri, fiyat sorgulama ve havuz boyutları ile ilgilidir. Yeni havuzlar oluşturmak için `addPool()` kullanılır.

Ticaret yaparken veya fiyat talep ederken, arayan kişi ya girdi fiyatını (swapIn, getInputPrice) ya da çıktı fiyatını (swapOut, getOutputPrice) sabit olarak belirtmek zorundadır. Takaslar için gerekli anahtar kelimeler, tüccarın `ver` miktarı için `In`, tüccarın `istemek` miktarı için `Out`'tır. `getInputPrice()` ve `getOutputPrice()` her biri iki miktar alır. `getInputPrice()` veya `swapIn()` çağrıldığında, `amountOut` parametresi istenen `amountOut`'u gösterir; eğer `amountIn`, bu kadarını sağlamaya yetersizse, sonuç ticaretin gerçekleşmeyeceğini gösterir. (Döndürülen `amountIn` ve `amountOut` her ikisi de boş miktarlar olacaktır.) Benzer şekilde, `swapIn()` veya `getOutputPrice()` çağrıldığında, `amountIn` bir maksimum olarak kabul edilir. Belirlenen `amountOut`'u almak için daha fazla miktar gerekiyorsa, sonuç ticaretin gerçekleşmeyeceğini gösterir.

Likidite eklerken ve çıkarırken, anahtar kelimeler `Central`, `Secondary` ve `Liquidity`’dir. Likidite eklerken `Central` ve `Secondary`, `give` bölümünde kullanılırken, `Liquidity` `want` bölümünde kullanılır. Likidite çıkarırken anahtar kelimeler tersine döner: `Liquidity` `give` bölümünde ve `Central` ile `Secondary` `want` bölümünde bulunur. Teklif, yakın bir tekliften doğrudan alınan miktarları belirtiyorsa ve herhangi bir ticaret araya girdiyse, ticaretin kabul edilmesi olası değildir. Fiyatın ne kadar hareket edebileceği konusunda sınırlar belirtebilir ya da sıfır sınırları belirleyip sözleşmeye adil ticaret yapması için güvenebilirsiniz.

Davet gerektirmeyen işlemler arasında `addPool()` ve sorgular ( `getInputPrice()`, `getOutputPrice()`, `getPoolAllocation()`, `getLiquidityIssuer()`, ve `getLiquiditySupply()`) yer alır.

## ConstantProduct API

Bu örnekler merkezi token olarak IST'yi kullanmaktadır. BLD ve ATM ikincil para birimleridir.

### ConstantProduct AMM ile Ticaret

Ticaret havuzları kurulduktan sonra (aşağıya bakınız), yeni bir tüccar mevcut fiyatı sorarak, davetiye alarak ve teklif vererek pazara etkileşimde bulunabilir. Sara'nın ATM'si var ve müzakere ettiği bir işlem için 275 BLD'ye ihtiyacı varsa, `getOutputPrice()` ile bir teklif almak için bunu kullanabilir. (Boş bir miktar, sonuçta `amountOut` için bir sınır olmadığı anlamına gelir.)

```js
const quote = E(publicFacet).getOutputPrice(
  AmountMath.make(BLDBrand, 275n),
  AmountMath.makeEmpty(ATMBrand)
);
```

Teklif 216 ATM sağlaması gerektiğini söylüyorsa, Sara fiyatın biraz oynak olduğunu düşünüyor ve tekrar tekrar arama yapmak istemediğinden teklifini artırıyor. Uygun havuzlar yoksa, bir hata alacaktır (`brands were not recognized`). Eğer birisi hemen önünde havuzda çok fazla ATM satarsa, fiyat yükselecek ve daha fazla ATM yatırıp yatırmama konusunda karar vermesi gerekecek. Eğer biri hemen önünde çok fazla ATM alırsa, 275 BLD'yi daha az miktarda alacak ve biraz ATM geri alacaktır.

```js
const saraProposal = harden({
  want: { Out: AmountMath.make(BLDBrand, 275n) },
  give: { In: AmountMath.make(atmBrand, 220n) }
});

const swapInvitation = await E(publicFacet).makeSwapOutInvitation();
const atmPayment = harden({
  In: saraAtmPurse.withdraw(AmountMath.make(atmBrand, 220n))
});

const saraSeat = await E(zoe).offer(swapInvitation, saraProposal, atmPayment);
const saraResult = await saraSeat.getOfferResult();
```

Eğer sonuç `Takasa başarıyla tamamlandı.` ise, 220 ATM veya daha az karşılığında BLD almıştır (herhangi bir iade almak isteyecektir). Aksi takdirde piyasa fiyatı aleyhine hareket etmiştir ve fiyatı tekrar kontrol etmek zorunda kalacaktır ve başka bir teklif vermesi gerekecektir.

```js
const BLDProceeds = await E(saraSeat).getPayout('In');
const atmRefund = await E(saraSeat).getPayout('Out');

const BLDProceedsAmount = E(saraBLDPurse).deposit(BLDProceeds);
E(saraAtmPurse).deposit(atmRefund);
```

### Yeni Bir Havuz Oluşturma

Sözleşme ilk oluşturulduğunda, ticaret için herhangi bir havuz hazır olmayacaktır. `addPool()`, ardından fonlanabilecek yeni bir para birimi ekler. (Tüm para birimlerinin fungible olması gerekmektedir.) Bir havuz ilk fonlandığında, ne kadar likidite yaratılacağına karar vermek için başka bir temel olmadığından, likidite miktarı teklif edilen merkezi token'ın miktarına eşit olur.

```js
const BLDLiquidityIssuer = await E(publicFacet).addPool(BLDIssuer, 'BLD');
```

Alice dışarıdaki piyasada mevcut oranların her IST için 2 BLD olduğunu gördüğü için, piyasayı finanse etmek için IST kadar iki katı BLD yatırır.

```js
const aliceProposal = harden({
  want: { Liquidity: BLDLiquidity(50n) },
  give: {
    Secondary: AmountMath.make(BLDBrand, 100n),
    Central: AmountMath.make(ISTBrand, 50n)
  }
});
const alicePayments = {
  Secondary: aliceBLDPayment,
  Central: aliceISTPayment
};

const aliceAddLiquidityInvitation = E(publicFacet).makeAddLiquidityInvitation();
const addLiquiditySeat = await E(zoe).offer(
  aliceAddLiquidityInvitation,
  aliceProposal,
  alicePayments
);
```

### Mevcut Bir Havuzda Likidite Ekleme

Havuzlara likidite eklerken veya çıkartırken, yatırılan miktarlar havuzun mevcut bakiyelerine orantılı olmalıdır. Hesaplama, `Central` varlığın miktarına dayanmaktadır. `Secondary` varlıklar orantılı olarak eklenmelidir. Sağlanan `Secondary` miktarı gereken miktardan azsa, teklif işlemi gerçekleşmeden çıkılır. Gerekenden fazla `Secondary` sağlanırsa, fazla miktar iade edilir.

Bob, `getPoolAllocation()` çağrısını yapaarak göreceli seviyeleri bulur. Diyelim ki cevap, mevcut oranların 1234 BLD ve 1718 IST olduğunu belirtmektedir.

```js
const BLDPoolAlloc = E(publicFacet).getPoolAllocation(BLDBrand);
const ISTValue = BLDPoolAlloc.Central.value;
const BLDValue = BLDPoolAlloc.secondary.value;
```

Artık likidite ekleyebilir. Havuzla ticaret yapıldığında fiyat oranı değişir, bu nedenle teklifinde biraz esneklik bırakmalıdır. Havuz, sağlanan `central` para birimi miktarına dayanarak gereken `secondary` para birimi miktarını hesaplar. Bob, katkıda bulunacağı BLD miktarını biraz artırır. Bu sürecin ne kadar likidite üreteceği konusunda endişelenseydi, bunu hesaplayacak ve yaklaşık bir rakam belirtmek isteyecektir, ancak bu durumda gerek yoktur.

```js
const bobProposal = harden({
  give: {
    Central: AmountMath.make(ISTBrand, 1800n),
    Secondary: AmountMath.make(BLDBrand, 1200n)
  },
  want: { Liquidity: AmountMath.make(liquidityBrand, 0n) },
  exit: { onDemand: null }
});

const bobPayments = {
  Central: bobISTPayment,
  Secondary: bobBLDPayment
};

const seat = await E(zoe).offer(addLiquidityInvite, bobProposal, bobPayments);
```

## Yönetişim

ConstantProduct AMM, `PoolFee` ve `ProtocolFee` olmak üzere iki parametreyi yönetmek için yönetişim kullanır. Parametrelerin mevcut değerleri ve bunları güncellemek için yönetişim oylama geçmişi yönetim API'leri aracılığıyla görülebilir.

ConstantProduct AMM'nin bir örneği, sözleşme parametrelerini değiştirme ve yeni teminat türleri ekleme yetkisini kontrol eden bir `contractGovernor` tarafından yönetilmektedir. `contractGovernor`, sözleşmenin publicFacet'ine bu dört yöntemi ekler:

- `getSubscription()`: oylama çağrıldığında güncellenen bir  alır.
- `getContractGovernor()`: doğrulama için contractGovernor'ı döndürür.
- `getGovernedParamsValues()`: iki parametrenin mevcut değerlerini gösteren bir yapıyı döndürür.
- `getParamValue('PoolFee')`: herhangi bir parametrenin mevcut değerinin açıklamasını alır. İlk büyük harfle dikkat edin.