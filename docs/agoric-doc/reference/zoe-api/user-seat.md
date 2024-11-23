# UserSeat Objesi

Zoe içerisinde, **koltuklar** sözleşmeler ve kullanıcılar tarafından tekliflere erişmek veya bunları manipüle etmek için kullanılmaktadır. Zoe'de iki tür koltuk bulunmaktadır. ****, sözleşmeler içinde ve **zcf** yöntemleriyle kullanılmaktadır. **UserSeats**, Zoe ve sözleşmenin dışındaki teklifleri temsil etmektedir. **** işlemini gerçekleştiren ve Zoe'ye **offer()** mesajını gönderen taraf, ödemelerin durumunu kontrol edebileceği veya sözleşmedeki teklifin işleme sonucunu alabileceği bir **UserSeat** elde eder. Bu farklılık gösterse de, örnekler arasında bir **String** ve başka bir koltuk için bir **Davet** bulunmaktadır.

Ayrıca, bir **UserSeat**, Zoe ve sözleşmenin dışındaki bir ajansa devredilebilir, bu da onların mevcut durumu sorgulamasına veya izlemesine, ödemelere ve sonuca erişmesine olanak tanır. Eğer bu koltuk için izin veriliyorsa, **tryExit()** çağrısı yapabilirler.

Bir **UserSeat** paylaşırken dikkatli olun, çünkü bu durum koltuğun dışına çıkma yetkisini içerir.

Bu yöntemlerin tümü, her zaman uzaktan çağrıldıkları için Promise döndürecek şekilde belgelenmiştir; ancak bu, onların farklı zamanlarda çözümlenmesini beklediklerini gizler. Bazıları hemen bir değer döndürebilirken, diğerleri koltuk çıkana kadar yerine getirilmemiş bir promise döndürür. **getOfferResult()**, sözleşmenin takdirine bağlı olarak çözümlenir. Aşağıdaki açıklamalar, değerin zamanında çözümlenmediği durumları açıkça belirtecektir.

**UserSeat**, ilişkili teklifin mevcut durumuna dair sorgular ve teklifin çıkmasını talep etmek için bir işlem içermektedir:

## E(UserSeat).getProposal()

- Döndürür: **Promise&lt;ProposalRecord>**

Bir **Teklif**, bir **ProposalRecord** ile temsil edilmektedir. Bu, kullanıcının Zoe'den geri almak beklediği şeyleri belirten **** ile birlikte bulunan kurallardır. **give**, **want** ve **exit** anahtarlarına sahiptir. **give** ve **want**, anahtar olarak **** ve değer olarak **** içeren kayıtlardır. Eğer sözleşme ile uyumluysa, sözleşme bunu karşılmaya çalışır. Uyumsuzsa, sözleşme **koltuğu** dışarı atar.

Teklif güvenliği her zaman sağlanır; eğer dışarı atılırsa, kullanıcı koyduğu şeyi geri alır. Eğer sözleşme bunu karşılamaya çalışıyorsa, ya istediklerini alırlar ya da Zoe, depozitolarını geri alacaklarından emin olur.

Örnek:

```js
const { want, give, exit } = sellerSeat.getProposal();
```

## E(UserSeat).getPayouts()

- Döndürür: **Promise&lt;>**

**Koltuk** ile ilişkili tüm **Ödemelere** ait **Promises** içeren bir  için bir **Promise** döndürür. Bir **Ödeme**, başarılı bir işlemde bir tarafa giden bir **** olup, işlemin sonucuna göre temin edilen varlıkları yönlendirmektedir.

Promise, koltuk çıkıldığında hızla çözümlenecektir.

## E(UserSeat).getPayout(keyword)

- **keyword**: ****
- Döndürür: **Promise&lt;>**

_Girdinin_ **anahtar kelimesiyle** ilişkili **Ödeme** için bir **Promise** döndürür. Bir **Ödeme**, başarılı bir işlemde bir tarafa giden bir **** olup, işlemin sonucuna göre temin edilen varlıkları yönlendirmektedir.

Promise, koltuk çıkıldığında hızla çözümlenecektir.

## E(UserSeat).getOfferResult()

- Döndürür: **Promise&lt;OfferResult>**

Bir **OfferResult** için bir **Promise** döndürür. **OfferResult**, herhangi bir **** olabilir. Örneğin,  örneğinde, "Teklif kabul edildi" dizesidir.  örneğinde ise, temel varlığı satın almak için bir **** olan bir çağrı opsiyonu bulunmaktadır. Dize ve davetler en yaygın geri dönen şeylerdir. Değer,  çağrısında ilk argüman olarak geçirilen **offerHandler** işlevi tarafından döndürülen sonuçtur.

Sözleşme, istediği her şeyi bir teklif sonucu olarak döndürebileceğinden, promise'in hızla çözümleneceğine dair bir garanti yoktur.

## E(UserSeat).hasExited()

- Döndürür: **Promise&lt;Boolean>**

Koltuk dışarı çıkmışsa **true** döndürür, hala aktifse **false** döndürür. Değer hemen geri döndürülür.

Koltuk dışarı çıktığında bir eylem gerçekleştirmek istiyorsanız, **getExitSubscriber()** yöntemini kullanabilir ve

```
const subscriber = E(seat).getExitSubscriber();
E.when(E(subscriber).getUpdateSince(), () => takeAction());
```

şeklinde çağırabilirsiniz.

Aboneye gönderilecek son bilgi, sözleşmenin yükseltilmesi durumunda devam edecektir. Herhangi bir promise’in beklenmesi, sözleşmenin yükseltilmesi durumunda bozulacaktır.

## E(UserSeat).tryExit()

- Döndürür: Yok.

Not: Sadece **koltuk**'un **önerisi** **OnDemand** **çıkış** maddesine sahipse çalışmaktadır. Zoe'nin teklif güvenliği garantisi, bir **koltuğun** sözleşme ile etkileşimi nasıl sona erse de geçerlidir. Normal durumlarda, katılımcı **tryExit()** çağrısı yapabilir veya sözleşme açıkça bir şey yapabilir. Dışarı çıkıldığında, koltuk sahibi mevcut **** alır ve **koltuk**, artık sözleşme ile etkileşimde bulunamaz.

## E(UserSeat).numWantsSatisfied()

- Döndürür: **Promise&lt;Number>**

Çıkış yapılan **Teklif**'in sonucunu belirten bir sayı için bir **Promise** döndürür, aşağıda belirtildiği gibi:

| Dönen Sayı | Açıklama                                                                                  |
|------------|-------------------------------------------------------------------------------------------|
| 0          | Kullanıcı, **Teklif**'ten istediklerini alamadı, bu nedenle teklifi geri alındı.        |
| 1          | Kullanıcı, **Teklif**'ten istediklerini aldı, bu nedenle teklifi harcandı ve gitti.    |

Bu promise, koltuk dışarı çıktığında hızla çözümlenecektir.

## E(UserSeat).getExitSubscriber()

- Döndürür: **Promise&lt;Abone>**

Koltuk için bir **Abone** için bir **Promise** döndürür.

## E(UserSeat).getFinalAllocation()

- Döndürür: **Promise&lt;>**

**UserSeat** çıkış yaptığında **Tahsisat** için bir **Promise** döndürür. Bu promise, koltuk dışarı çıktığında hızla çözümlenecektir.