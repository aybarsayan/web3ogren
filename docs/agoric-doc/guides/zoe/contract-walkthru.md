# Tamamlayıcı Sözleşme İncelemesi

Temel DApp'imizin  daha detaylı bakalım.

## Sözleşmeyi Paketleme

 işleminde, ilk adım tüm modüllerini tek bir öğe halinde _paketlemekti_. Bu durumda  komutunu kullandık. `agoric run` komutunun temel mekanizması, `bundleSource()` çağrısını içerir.

DApp’in `contract` dizininde, `ava` kurallarına uygun olarak `test-bundle-source.js` dosyasını çalıştırın:

```sh
cd contract
yarn ava test/test-bundle-source.js
```

Sonuçlar aşağıdakine benzer görünebilir...

```console
  ✔ bundleSource() sözleşmeyi zoe ile kullanıma hazır hale getirdi (2.7s)
    ℹ 1e1aeca9d3ebc0bd39130fe5ef6fbb077177753563db522d6623886da9b43515816df825f7ebcb009cbe86dcaf70f93b9b8595d1a87c2ab9951ee7a32ad8e572
    ℹ Object @Alleged: BundleInstallation {}
  ─

  1 test başarıyla geçti
```

::: details Test Kurulumu

Test, ana modül belirtimini çözmek için `module` API'sinden `createRequire` kullanır:

xyz.zip
```

Daha sonra, örneğin içeriğine bakabilirsiniz:

```sh
unzip -l xyz.zip
```

:::

## Sözleşme Kurulumu

Tarafların katılmak için onayladığı sözleşme kodlarını tanımlamak için Zoe, _Kurulum_ nesnelerini kullanır.

Bunu  bulunan sözleşme ile deneyelim:

```sh
yarn ava test/test-contract.js -m 'Sözleşmeyi Kur'
```

```
  ✔ Sözleşmeyi Kur
    ℹ Object @Alleged: BundleInstallation {}
```

::: details Test Kurulumu

Test, `makeZoeKitForTest` kullanarak Zoe'yi test için kurarak başlar:

>} */
const installation = E(zoe).install(bundle);
const { instance } = await E(zoe).startInstance(installation, issuers, terms);
t.log(instance);
t.is(typeof instance, 'object');
```

_`makeIssuerKit` ve `AmountMath.make`  bölümünde, `makeEmptyPurse`, `mintPayment` ve `getAmountOf` ile birlikte ele alınmıştır._

_Ayrıca  başvurun._

Sözleşme başladığında ne olduğunu gözlemleyelim. Zoe'nin bir _faceti_, _Zoe Sözleşme Faceti_, sözleşmeye `start` fonksiyonu olarak geçilir. Sözleşme bu `zcf`'yi şartlarını almak için kullanır. Aynı zamanda, ticarette aldığı varlıkları depolamak için bir `proceeds` koltuğu ve nesnelerin gruplarından oluşan varlıklar oluşturmak için bir `mint` oluşturmakta kullanır:

<<< @/../snippets/zoe/src/offer-up.contract.js#start

Bir `proposalShape` ve `tradeHandler` tanımlar ancak henüz bunlarla bir işlem yapmaz. Sonrasında devreye girecekler. Ayrıca bir  `publicFacet` nesnesi tanımlayıp döndürür ve bekler.

<<< @/../snippets/zoe/src/offer-up.contract.js#started

## Teklif Güvenliği ile Ticaret

 ticareti test eden bir kısım içerir:

```sh
yarn ava test/test-contract.js -m 'Alice ticaret yapar*'
```

```
  ✔ Alice ticaret yapar: biraz oyun parası verir, maddeler ister (309ms)
    ℹ Object @Alleged: InstanceHandle {}
    ℹ Alice, {
        Price: {
          brand: Object @Alleged: PlayMoney brand {},
          value: 5n,
        },
      } verir.
    ℹ Alice'ın ödemesi brand Object @Alleged: Item brand {}
    ℹ Alice'ın ödemesi değer Object @copyBag {
        payload: [
          [
            'scroll',
            1n,
          ],
          [
            'map',
            1n,
          ],
        ],
      }
```

Öncelikle Alice için bir çantaya para koyuyoruz:

```js{4}
const alicePurse = money.issuer.makeEmptyPurse();
const amountOfMoney = AmountMath.make(money.brand, 10n);
const moneyPayment = money.mint.mintPayment(amountOfMoney);
alicePurse.deposit(moneyPayment);
```

Daha sonra sözleşme örneğini ve çantayı `alice` için kodumuza geçiriyoruz:

```js
await alice(t, zoe, instance, alicePurse);
```

Alice, `instance`'ı kullanarak sözleşmenin `publicFacet` ve `terms` bilgilerini Zoe'den alır:



<<< @/../snippets/zoe/contracts/alice-trade.js#queryInstance

Daha sonra, oyunun `Item` markasında 1 harita ve 1 parşömen karşılığında `tradePrice` vermek için bir _teklif_ hazırlar; ve çantasından bir ödeme çekerek:

<<< @/../snippets/zoe/contracts/alice-trade.js#makeProposal

Sonrasında oyuna katılma _davetiyesi_ isteyip, bu davetiye ile birlikte teklife ve ödemesine ilişkin bir _teklif_ yapar; ve **Maddeleri** için ödemesini bekler:



<<< @/../snippets/zoe/contracts/alice-trade.js#trade

::: details Tekliflerde eksik markalar için sorun giderme

Eğer şu hatayı görürseniz...

```
Error#1: key Object [Alleged: IST brand] {} not found in collection brandToIssuerRecord
```

Bu, teklifinizin sözleşmeye bilinmeyen markalar kullanıyor olabileceği anlamına gelir. Sözleşmeye hangi ihraççıların tanındığını öğrenmek için  komutunu kullanın.

Eğer sözleşmeyi yazıyor veya oluşturuyorsanız, sözleşmeye ihraççıları anlatmak için  veya  kullanarak bunu yapabilirsiniz.

:::

Sözleşme, Alice'ın `E(publicFacet).makeTradeInvitation()` çağrısını alır ve `zcf` kullanarak bir davetiye oluşturur. Bu davetiye, ilişkili bir işleyici, açıklama ve teklif şekli içerir. Zoe, Alice'ın `E(zoe).offer(...)` çağrısını alır, teklifi teklif şekli ile karşılaştırır, ödemenin teminatını alır ve işleyiciyi çağırır.



<<< @/../snippets/zoe/src/offer-up.contract.js#makeInvitation

Teklif işleyicisi, teklifi yapan tarafı temsil eden bir _koltuk_ ile çağrılır. Bu durum, tarafın aracılığı ile verilen `give` ve `want` değerlerini çeker ve verilenin en az `tradePrice` kadar olduğunu ve yanıt olarak fazladan madde istemediğini kontrol eder.

Tüm bu ön koşullar sağlandığında, işleyici `zcf`'ye istenen **Item** varlıklarını basması, oyuncunun sunduğu varlıkları kendi `proceeds` koltuğuna tahsis etmesi ve basılan maddeleri oyuncuya vermesi için talimat verir. Son olarak, işlemlerini oyuncu ile kapatır.



<<< @/../snippets/zoe/src/offer-up.contract.js#handler

Zoe, sözleşmenin talimatlarının teklif ile ve varlıkların korunmasına uygun olduğunu kontrol eder. Ardından, teminata alınan ödemeyi sözleşmenin gelir koltuğuna tahsis eder ve daha önceki `getPayout(...)` çağrısına yanıt olarak NFT'leri Alice'a öder.

Alice, `Item` ihraççısına ödemesinin ne kadar değerli olduğunu sorar ve istediği kadar olduğunu kontrol eder.



<<< @/../snippets/zoe/contracts/alice-trade.js#payouts