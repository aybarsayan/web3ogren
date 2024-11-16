# ZCFSeat Objesi

Zoe, **koltuklar** kullanarak teklifler üzerinde işlem yapar veya oluşturur. Koltuklar, aktif teklifler temsil eder ve bu teklifler aracılığıyla sözleşmelerle kullanıcıların etkileşimde bulunmasına imkan tanır. Tek bir pozisyonu temsil etmek için iki tür koltuk kullanılır. **ZCFSeats**, sözleşmeler içinde ve **zcf** yöntemleri ile kullanılırken, **UserSeats** sözleşme dışındaki teklifleri temsil eder. Bu iki yön, aynı tahsise erişim sağlar ve her iki taraftan yapılan değişikliklerin ikisini de etkilemesini sağlar.

Bir **ZCFSeat**, ilişkili teklifin mevcut durumu için senkron sorgular içerir; örneğin, şu anda **ZCFSeat** nesnesine atanan varlıkların miktarları. Ayrıca, teklifi manipüle etmek için senkron işlemler içerir. Sorgular ve işlemler aşağıdaki gibidir:

## aZCFSeat.getSubscriber()

- Dönüş Değeri: **Subscriber**

Koltuk için **Subscriber**'ı döndürür.

## aZCFSeat.getProposal()

- Dönüş Değeri: **ProposalRecord**

Bir **Teklif**, **ProposalRecord** aracılığıyla temsil edilir. Bu, kullanıcıların Zoe'den geri almayı bekledikleri **ödemelerin** emanetine eşlik eden kurallardır. **give**, **want** ve **exit** anahtarlarına sahiptir. **give** ve **want** ise anahtarlar olarak **** ve değerler olarak **** içeren kayıtlardır. **teklif**, kullanıcının yapmış olduğu bir teklifle girdiği sözleşmenin genel anlayışıdır. Detaylar için  konusuna bakın.

- Örnek:

```js
const { want, give, exit } = sellerSeat.getProposal();
```

## aZCFSeat.exit(completion)

- **completion**: **Object**
- Dönüş Değeri: Yok.

**koltuk**'un çıkış yapmasını sağlar, bu da tahsisatında daha fazla değişiklik yapılmasını engeller. Herhangi bir **ödeme** varsa, gerçekleştirilir ve **koltuk** nesnesi sözleşme ile etkileşimde bulunamaz. **completion** argümanı genellikle bir dize olur, fakat bu zorunlu değildir. Tek kullanımı, karşılık gelen **UserSeat**'in **** gönderdiği bildirim içindir. Açık durumda olan diğer koltuklar veya alacaklar sözleşme örneğini etkilemeye devam eder.

**Not**: Hata ile çıkarken **aZCFSeat.exit()** yöntemini kullanmamalısınız. Bunun yerine **** yöntemini kullanın.

## aZCFSeat.fail(msg)

- **msg**: **String**
- Dönüş Değeri: Yok.

**koltuk** çıkar, ve var ise konsolda opsiyonel **msg** dizesini görüntüler. Bu, çıkış yapmakla eşdeğerdir, bununla birlikte **exit** başarılıdır, ve **ZCFSeat.fail()** teklifi işlem sırasında bir hata olduğunu belirtir. Sözleşme, mevcut **tahsisi** alırken, **koltuk** artık sözleşme ile etkileşimde bulunamaz. Açık durumda olan diğer koltuklar veya alacaklar sözleşme örneğini etkilemeye devam eder.

Agoric, bir koltuğu hata ile çıkış yaparken aşağıdaki gibi olmasını önerir:

```js
throw seat.fail(Error('yanlış yaptın'));
```

## aZCFSeat.hasExited()

- Dönüş Değeri: **Boolean**

**ZCFSeat** çıkış yaptıysa **true**, hala aktifse **false** döndürür.

## aZCFSeat.getAmountAllocated(keyword, brand)

- **keyword**: ****
- **brand**: ****
- Dönüş Değeri: ****

**** içindeki _keyword_ ve _brand_ ile eşleşen kısmından **Miktar** döndürür. Eğer _keyword_, **Tahsisatta** yoksa, _brand_ argümanının boş bir **Miktar**'ını döndürür. (**aZCFSeat.exit()** çağrıldıktan sonra, son tahsisat bakiyesini raporlamaya devam eder; bu bakiye ödemeye aktarılmıştır.)

Bu, bir sonraki yöntem olan **getCurrentAllocation()** ile benzerdir. **getAmountAllocated()**, her seferinde bir **Anahtar**'ın **Tahsisini** alırken, **getCurrentAllocation()** mevcut tüm **Tahsisleri** bir kerede döndürür.

## aZCFSeat.getCurrentAllocation()

- Dönüş Değeri: ****

**Tahsisat**, sözleşmeye uygulanabilir **** olan anahtar-değer çiftlerinin bir **AmountKeywordRecord**’udur. Değer, **değeri** ve **markası** ile bir ****tır.

**Tahsisatlar**, çıkış sırasında her **koltuğa** ödenecek **Miktarları** temsil eder. (**exit()** çağrıldıktan sonra, ödemeye aktarılmış olan son tahsisat bakiyeleri rapor edilmeye devam eder.) Kullanıcının çıkış talep etmesi veya sözleşmenin **koltuğu** kapatmayı seçmesi, çıkış için normal nedenlerdir. Sözleşme bir hata veya kötü bir davranışla karşılaşırsa, garantiler de geçerlidir. Mevcut bir **tahsisatın** ne kadar **miktar** içerdiğini bulmak için birkaç yöntem vardır.

Bu, önceki yöntemle **getAmountAllocated()** arasında benzerlik gösterir. **getAmountAllocated()**, her seferinde bir anahtarın **tahsisatını** alırken, **getCurrentAllocation()** mevcut tüm **tahsisatları** bir kerede döndürür.

Bir **Tahsisat** örneği:

```js
{
  Asset: AmountMath.make(quatloosBrand, 5n),
  Price: AmountMath.make(quatloosBrand, 9n)
}
```

## aZCFSeat.isOfferSafe(newAllocation)

- **newAllocation**: ****
- Dönüş Değeri: **Boolean**

Bir **tahsisat**'ı argüman olarak alır ve eğer bu **tahsisat** teklif güvenliğini sağlıyorsa **true**, sağlamıyorsa **false** döndürür. Esasen, **newAllocation**'un teklif güvenliğini, **koltuk**'un **teklifi** ile karşılaştırarak kontrol eder. **newAllocation**'un, **proposal.give**'i tam olarak karşılayıp karşılamadığını (geri ödeme verip vermediğini) ya da **proposal.want**'ı tam olarak karşılayıp karşılamadığını kontrol eder. İkisi de tamamen karşılanabilir. Daha fazla ayrıntı için ZoeHelper  yöntemine bakın.

::: warning KULLANIMDAN KALDIRILDI

## aZCFSeat.getStagedAllocation()

- Dönüş Değeri: ****

**koltuk** yeniden tahsis edilirse ve teklif güvenliği sağlanırsa, ve haklar korunuyorsa, **tahsisat**'ı alır ve döndürür.

**Not**: Bu yöntem kullanımdan kaldırılmıştır. Bunun yerine **** yöntemini kullanın.
:::

::: warning KULLANIMDAN KALDIRILDI

## aZCFSeat.hasStagedAllocation()

- Dönüş Değeri: **Boolean**

Bir sahnelenmiş tahsisat varsa **true** döndürür, yani **ZCFSeat.incrementBy()** veya **ZCFSeat.decrementBy()** çağrılmış ve **ZCFSeat.clear()** ve **reallocate()** çağrılmamışsa. Aksi takdirde **false** döndürür.

**Not**: Bu yöntem kullanımdan kaldırılmıştır. Bunun yerine **** yöntemini kullanın.
:::

::: warning KULLANIMDAN KALDIRILDI

## aZCFSeat.incrementBy(amountKeywordRecord)

- **amountKeywordRecord**: ****
- Dönüş Değeri: **AmountKeyRecord**

**amountKeywordRecord** argümanını **ZCFseat**'in sahnelenmiş tahsisine ekler ve aynı **amountKeywordRecord**'ı geri döndürür, böylece başka bir çağrıda reuse edilebilir. Unutmayın ki bu, **zcfSeat1.incrementBy(zcfSeat2.decrementBy(amountKeywordRecord))** kullanım deseninin çalışmasına olanak tanır.

Ayrıca, belirtilen **** için miktarı olmayan orijinal veya sahnelenmiş tahsislere miktar ekleme işlemi gerçekleştirir. Sonuç, **Anahtarın** ve miktarın tahsise dahil edilmesidir. Örneğin, başlayıp boş bir tahsise sahipsek:

```js
// Boş bir koltuk yap.
const { zcfSeat: zcfSeat1 } = zcf.makeEmptySeatKit();
// Tahsisat şu anda boş, yani `{}`
const stagedAllocation = zcfSeat1.getStagedAllocation();
const empty = AmountMath.makeEmpty(brand, AssetKind.NAT);
// Boş olanı artırmayı deniyoruz. Bu başarılıdır ve anahtar boş miktar ile eklenir.
zcfSeat1.incrementBy({ IST: empty });
t.deepEqual(zcfSeat1.getStagedAllocation(), { IST: empty });
```

Boş bir miktar ekleseniz bile, her miktar aynı şekilde tahsise eklenir.

**Not**: Bu yöntem kullanımdan kaldırılmıştır. Bunun yerine **** yöntemini kullanın.
:::

::: warning KULLANIMDAN KALDIRILDI

## aZCFSeat.decrementBy(amountKeywordRecord)

- **amountKeywordRecord**: ****
- Dönüş Değeri: **AmountKeywordRecord**

**amountKeywordRecord** argümanını **ZCFseat**'in sahnelenmiş tahsisinden çıkarır ve aynı **amountKeywordRecord**'ı geri döndürür, böylece başka bir çağrıda reuse edilebilir. Unutmayın ki bu, **zcfSeat1.incrementBy(zcfSeat2.decrementBy(amountKeywordRecord))** kullanım deseninin çalışmasına olanak tanır.

Çıkarılacak miktarlar sahnelenmiş tahsisten büyük olamaz (yani, negatif sonuçlar izin verilmez).

**decrementBy()**, orijinal veya sahnelenmiş tahsiste **amountKeywordRecord** argümanında belirtilen **** için miktar yoksa **incrementBy()** ile farklı bir davranış sergiler. Dikkate alınması gereken iki durum vardır; çıkarılacak karşılık gelen miktar boş olduğunda ve dolu olduğunda.

```js
// Boş bir koltuk yap.
const { zcfSeat: zcfSeat1 } = zcf.makeEmptySeatKit();
// Tahsisat şu anda {}
const stagedAllocation = zcfSeat1.getStagedAllocation();
const empty = AmountMath.makeEmpty(brand, AssetKind.NAT);
// boş olanı azaltmak hata vermez ve bir anahtar eklemez.
zcfSeat1.decrementBy({ IST: empty });
t.deepEqual(zcfSeat1.getStagedAllocation(), {});
```

Burada sonuç, **Anahtarın** tahsise eklenmemesidir. Başlangıçta orada yoktu ve işlem, tahsisten çıkarmayı denemektir. Orada olmayan bir şeyi çıkarmak, orijinal değeri etkilemez. Örneğin, sizden Mona Lisa’yı alacağımı söylediğimde ve eğer Louvre değilseniz ve onu elinde bulundurmuyorsanız, siz hala elinizde bulundurmazsınız. Yukarıdaki örnekte, boş bir tahsisten boş bir miktarı çıkarmaya çalışmak etkili bir şekilde bir boş işlem olur; tahsis hala boştur, yeni **Anahtar** eklenmemiştir ve hata verilmez.

Ancak, boş bir tahsisten dolu bir miktarı çıkarmak farklı bir sonuç verir. Örneğin:

```js
// Boş bir koltuk yap.
const { zcfSeat: zcfSeat1 } = zcf.makeEmptySeatKit();
// Tahsisat şu anda {}
const stagedAllocation = zcfSeat1.getStagedAllocation();
// bir anahtarın olmadığında ve dolu bir miktar ile decrementBy çağırılabilirler.
zcfSeat1.decrementBy({ IST: runFee });
```

Bir hata verir çünkü bir şeyden bir şey çıkaramazsınız. Yani, boş bir tahsisi dolu bir miktar ile çıkarmak bir hatadır, oysa boş bir tahsisi boş bir miktar ile çıkarmak etkili bir şekilde bir null işlemi olarak kabul edilir ve hiçbir etkisi yoktur.

**Not**: Bu yöntem kullanımdan kaldırılmıştır. Bunun yerine **** yöntemini kullanın.
:::

::: warning KULLANIMDAN KALDIRILDI

## aZCFSeat.clear()

- Dönüş Değeri: Yok.

**ZCFSeat**'in mevcut sahnelenmiş tahsisatını siler, eğer varsa.

**Not**: Bu yöntem kullanımdan kaldırılmıştır. Bunun yerine **** yöntemini kullanın.
:::