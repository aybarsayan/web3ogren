# NFT'leri Mint Et ve Sat



#####  (Son güncelleme: 31 Ocak 2022)

##### 

Bu sözleşme, değiştirilebilir olmayan token'lar (NFT'ler) mint eder ve bu token'ları belirli bir para karşılığında satmak için bir satış sözleşmesi örneği oluşturur.

`startInstance()` metodu, içinde `.sellTokens()` metodu bulunan bir `creatorFacet` döndürür. `.sellTokens()` metodu, satılan ürünlerin tanımını alır; örneğin:

```
{
  customValueProperties: { ...arbitrary },
  count: 3,
  moneyIssuer: moolaIssuer,
  sellItemsInstallationHandle,
  pricePerItem: AmountMath.make(moolaBrand, 20n),
}
```

`offerResult`, satış sözleşmesi için yararlı özellikler içeren bir kayıttır. Örneğin, bu kayıtta bulunan `creatorFacet`, satış sözleşmesi ile ilişkilidir. Bu sözleşmenin `creatorFacet`'ini yeniden kullanarak daha fazla NFT grubu mint edebilirsiniz (örneğin, ayrı bir gösterim için daha fazla bilet).