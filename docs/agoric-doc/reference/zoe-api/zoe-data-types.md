# Zoe Veri Türleri

Zoe, birkaç veri türü tanıtır ve kullanır.

## Tahsisat

**Tahsisatlar**, her bir koltuk için **** olarak
ödenmesi gereken miktarları temsil eder. Bu miktar, bir **Teklif**ten çıkarken ödenecektir.

Örneğin, bir koltuğun başarılı bir şekilde bir **Teklif**ten çıkarken 5 _Quatloos_ ve 3 _Widgets_
alması bekleniyorsa, **Tahsisat** şu şekilde görünecektir:

```js
{
  Quatloos: 5n;
  Widgets: 3n;
}
```

## İşlem

**İşlemler**, yalnızca özellikleri benzersiz kimlikleri olan **Far** nesneleridir. Genellikle başka bir
nesneyi belirlemek için oluşturulurlar ve bu **İşlemler**, belirlenen nesnelere erişim vermeden
güvenilir belirleyiciler olarak dolaştırılabilirler.

## Örnek

Bir **Örnek**, bir sözleşmenin bir örneğini temsil eden bir değerdir.
Sözleşme örneği hakkında bilgi almak için şu yöntemler kullanılabilir:

- ****
- ****
- ****
- ****

## Davet

Bir **Davet**, **** tarafından oluşturulan bir
değiştirilemez varlıktır. Bir **Davet Ödemesi**, bir **** olup bir
**Davet** tutar.

## DavetYayıcısı

**DavetYayıcısı**, Zoe boyunca özel bir rol oynayan bir ****dır.
Zoe'nin tüm ömrü boyunca tek bir **DavetYayıcısı** vardır. Tüm **Davetler**, Zoe örneğinin
**DavetYayıcısı** ile ilişkili ****'inden gelir.

Yayıcı,  aracılığıyla
halkın kullanımına açıktır; bu nedenle davetlerin doğrulanma yeteneği geniş bir şekilde mevcuttur.

**DavetYayıcısı**, normal **Yayıcılar**ın tüm yöntemlerine sahiptir, ancak en çok kullanılan iki
yöntem **** ve
**** dir.

Bir **anInvitationIssuer.claim()** çağrısının başarılı olması, metoda geçirilen **Davet**’in
**DavetYayıcısı** tarafından geçerli olarak tanındığı anlamına gelir. Ayrıca, **Davet**’in
tamamen sizin olduğu ve başkalarının buna erişim yetkisi olmadığına da güvence verilmiştir.

## Anahtar Kelime

Bir **Anahtar Kelime**, bir sözleşme içinde **yayıcıları** bağlamak için kullanılan benzersiz bir
kimlik dizesidir. Bunun bir ASCII 
olması ve çakışmaları önlemek için büyük harfle başlaması gerekir; aksi takdirde `toString` gibi
JavaScript özellikleri için sorun oluşturabilir. 
(Daha fazla bilgi için  inceleyebilirsiniz.)
`NaN` ve `Infinity` anahtar kelime olarak kullanılamaz.



## Anahtar Kelime Kaydı

Bir **Anahtar Kelime Kaydı**, her bir özellik adının bir **** olduğu
bir  dır; bu türden bir örneği `harden({ Varlık: moolaIssuer, Teklif: simoleanIssuer })`.
Alt türleri, özellik değerlerini daha fazla kısıtlayabilir (örneğin, bir **AmountKeywordRecord**,
her bir değerin bir **** olduğu bir
**Anahtar Kelime Kaydı** ve **PaymentPKeywordRecord**, her bir değerin ya bir 
**** ya da bir Ödeme için bir Vaad olduğu bir 
**Anahtar Kelime Kaydı** dır).

Kullanıcılar **ödemelerini** **Anahtar Kelime Kayıtları** olarak gönderir:

```js
const aFistfulOfQuatloos = AmountMath.make(quatloosBrand, 1000n);
const paymentKeywordRecord = {
  Asset: quatloosPurse.withdraw(aFistfulOfQuatloos)
};
```

## Parçalayıcı Sayı

Bir **Parçalayıcı Sayı**, **bigint**, **number**, veya **string** olarak tanımlanır.

## Oran

**Oranlar**, bir _payda_ ve bir _payda_ içeren, değer ile geçiş kaydeden kayıtlardır. Bu ikisi de
bir **** ve bir **** içerir;
tam olarak **** gibi. Bir **Oran**’ın payda değeri
0 olamaz.

En yaygın **Oran** türü, belirli bir **Marka**'nın bir **Tutarı** üzerinde uygulanır ve sonuçların
aynı **Marka**da üretilmesini sağlar.

**Oranlar**, aynı zamanda iki farklı **Marka**ya sahip olabilir; bu da onları
mil/saat veya ABD doları/İsviçre frangı gibi türlü hale getirebilir (yani bir döviz kuru oranı).

## Transfer Parçaları

**Transfer Parçaları**, **** fonksiyonuna 
gönderilen _transfer_ dizisinin bireysel elemanlarıdır. Her bir **Transfer Parçası**, mevcut
**** arasında bir veya iki **** değişikliğini temsil eder.
Her bir **Transfer Parçası** 4 elemana sahip olup, bazı durumlarda bu elemanlardan bazıları
atlayabilir.

- **fromSeat**?: **ZCFSeat** - **miktarların** alındığı koltuk.
- **toSeat**?: **ZCFSeat** - **miktarların** verildiği koltuk.
- **fromAmounts**?: **** - _fromSeat_’ten alınacak **miktar**lar.
- **toAmounts**?: **AnahtarKelimeKaydı** - _toSeat_’e verilecek **miktar**lar.

Eğer bir _fromSeat_ belirtilirse, bir _fromAmounts_ gereklidir. _toSeat_ belirtilmeden
bir _toAmounts_ belirttiğinizde, _fromAmount_’ın _fromSeat_’ten alınarak _toSeat_’e
verileceği anlamına gelir.

Bir transferin bir tarafını temsil eden **Transfer Parçaları**, yardımcı işlevler kullanılarak
oluşturulabilir:
**** veya
****. 
Elbette, herhangi bir JavaScript veri türü gibi, **Transfer Parçaları** de manuel olarak
oluşturulabilir. Bir **Transfer Parçası** manuel olarak oluşturulursa ve _fromSeat_, 
_toSeat_ ve/veya _fromAmounts_ alanlarını eklemiyorsanız, eksik alanları **undefined** olarak
ayar yapmanız gerekecek. (_toAmounts_ alanını eklemediyseniz, bunu **undefined** olarak ayarlamanız
gerekmez; bunun yerine yalnızca onu atlayabilirsiniz.)