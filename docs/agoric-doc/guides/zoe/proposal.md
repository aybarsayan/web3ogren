---
title: Tekliflerin Yapısı
---



## Teklif Yapma

Bir teklif yapmak için,  kullandığınızda, bu dört argümanı alabilir:

- Bu sözleşme örneğine katılma için bir **davetiye**.
- Teklif koşullarınızı belirten bir **teklif**.
- Teklif için güvence altına alınmış **ödemeler**, her biri **teklif** içindeki bir **verme**  ile ilişkilendirilmiştir.
- **offerArgs** ise  ile ilişkilendirilmiş davetiyeye bağlı **offerHandler** için ek argümanlar ifade eder.

## Davetiyeler

Bir , ERTP  için özel bir durumdur. Her biri belirli bir sözleşme  ile bağlantılıdır ve bir davetiyeye sahip olmak, o sözleşme örneğine katılma hakkı verir; bu davetiyeyi `E(zoe).offer(...)`'a ilk argüman olarak kullanarak katılabilirsiniz.

Sözleşme kullanıcılarının bir davetiye almasının iki yolu vardır:

- Eğer sözleşme örneğini siz oluşturuyorsanız, sözleşme özel bir oluşturucu davetiyesi sağlayabilir.
- Hak sahibi olan biri (belki siz) bir sözleşme örneği için bir davetiye oluşturmuş ve bunu size bir şekilde iletmiştir. Bu, size göndermek, kamuya açık bir çevrimiçi alanda yayımlamak vb. şeklinde olabilir. Nasıl veya neden size ulaştığı önemli değildir (Zoe'nin bunu belirtmesi veya gerektirmesi gerekmez); önemli olan onun sizde olmasıdır.

## Teklifler

Teklifler, **verme**, **isteme** ve/veya **çıkış** anahtarlarına sahip kayıtlardır.

```js
const myProposal = harden({
  give: { Asset: AmountMath.make(quatloosBrand, 4n) },
  want: { Price: AmountMath.make(moolaBrand, 15n) },
  exit: { onDemand: null }
});
```

**verme** ve **isteme**, sözleşme tarafından tanımlanan  kullanır. Anahtar kelimeler, teklifler, güvence altına alınacak ödemeler ve kullanıcılara yapılacak ödemeleri bir araya getiren sözleşmeye özgü benzersiz tanımlayıcılardır. Yukarıdaki örnekte "Asset" ve "Price" anahtar kelimeleri bulunmaktadır. Ancak, bir açık artırma sözleşmesinde anahtar kelimeler "Asset" ve "Bid" olabilir.

Yukarıdaki her `AmountMath.make` çağrısı, bir ERTP  veya dijital varlıkların tanımını yapmaktadır. Bu durumda, `AmountMath.make(quatloosBrand, 4n)` hayali Quatloos para birimimizin 4 biriminin tanımını oluşturur ve `AmountMath.make(moolaBrand, 15n)` ise hayali Moola para birimimizin 15 biriminin tanımını oluşturur. (Her sayının sonundaki "n", bunun  olarak değil, bir  olarak temsil edildiğini gösterir.)

::: warning Not
Miktarlar yalnızca varlıkların _tanımlarıdır_ ve kendi başlarına hiçbir içsel değere sahip değildir. Buna karşın,  gerçek dijital varlıkları tutar.
:::

**çıkış**, teklifin nasıl iptal edilebileceğini belirtir. Üç şekilden birine uymalıdır:

- `{ onDemand: null }`: (Varsayılan) Teklif veren taraf, talep üzerine iptal edebilir.
- `{ waived: null }`: Teklif veren taraf iptal edemez ve tamamen akıllı sözleşmeye güvenmek zorundadır (tekliflerini tamamlama veya başarısız olma).
- `{ afterDeadline: deadlineDetails }`: Teklif, `timer` ve `deadline` özellikleri ile belirlenen bir son tarihten sonra otomatik olarak iptal edilir.

Daha fazla ayrıntı için  sayfasına bakınız.

## Güvence Altında Ödemeler

**teklifinizdeki** **verme** nesnesi ile aynı Anahtar Kelimeleri kullanarak, karşılık gelen dijital varlıkların  içeren bir  belirtmelisiniz. Zoe, bu ödemeleri teklifiniz tamamlanana, reddedilene veya varlıklar başka bir teklife devredilene kadar güvence altına alır.

```js
const payments = {
  Asset: quatloosPayment,
  Price: moolaPayment
};
```

## Teklif Argümanları

Davetiyeye bağlı **offerHandler** sözleşme koduna ek argümanlar geçirmek için, bunları bir **offerArgs**  içinde gönderin. Her sözleşme, desteklediği ve gereksinim duyduğu özellikleri tanımlayabilir ve beklenmedik veya eksik argümanları işlemekten sorumlu olacaktır.

::: danger Dikkat
Sözleşme kodu, **offerArgs** ile etkileşimde dikkatli olmalıdır. Bu değerlerin, arayan tarafından doğrudan geldiği için kullanılmadan önce girdi doğrulamasına ihtiyaçları vardır ve kötü niyetli davranışlar içerebilir.
:::

## Döndürülen Değer

`E(zoe).offer(...)`, bir `UserSeat` nesnesi için bir söz verir. İsmi, sözleşme yürütmesinde "masada bir yeri olma" kavramından gelmektedir.