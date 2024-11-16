---
title: Zoe Teklif Güvenliği Uygulaması
---



## Zoe Nedir?

**Kullanıcılar için**: Zoe, bir akıllı sözleşmenin kullanıcısı olarak istediğiniz şeyi alacağınızı veya tam bir geri ödeme alacağınızı garanti eder; bu, akıllı sözleşmenin hatalı veya kötü niyetli olması durumunda bile geçerlidir. (Aslında, akıllı sözleşme dijital varlıklarınıza erişim sağlamaz.)

**Geliştiriciler için**: Zoe, akıllı sözleşmenizin en iyi ne yaptığını odaklanmanızı sağlamak için bir güvenlik ağı sunar. Böylece kullanıcılarınızın, yazdığınız koddaki bir hata nedeniyle varlıklarını kaybetme kaygısı yaşamadan çalışabilirsiniz. Zoe üzerinde bir akıllı sözleşme yazmak kolaydır: tüm Zoe akıllı sözleşmeleri, tanıdık JavaScript diliyle yazılmıştır.

## Büyülü Gibi Görünüyor. Gerçekte Nasıl Çalışıyor?

Zoe'yi kullanmak için her şeyi "teklifler" terimiyle ifade ediyoruz. Bir teklif önerisi, ne istediğinize ve neyi önerdiğinize dair bir ifadedir. Görüyoruz ki, birçok akıllı sözleşme (hediyeler ve tek yönlü ödemeler dışında) dijital varlıkların alışverişini içerir ve bu durum teklif önerileri şeklinde ifade edilebilir. "Sana ." gibi şeyler söyleyebiliriz. .

Teklifler, kullanıcı niyetini tanımlamanın yapılandırılmış bir yoludur. Belirli bir ölçüde, bir teklifin kuralları (bir _öneri_ olarak adlandırılır) kullanıcının girdiği anlaşmanın _sözleşmeye dayalı anlayışı_ demektir.

Teklifin değişim mekanizmasını belirtmediğini fark etmiş olabilirsiniz. Teklif, istediğiniz ürünün açık artırmaya, bir değişim içine veya özel bir ticaretin parçası olup olmadığını belirtmez. Teklifin belirli bir mekanizmayı anmamış olmasının nedeni, Zoe tasarımının önemli bir parçasının **endişelerin ayrımı** olmasıdır.

Zoe, "teklif güvenliği" adını verdiğimiz şeyin uygulanmasından sorumludur; Zoe'nin üzerinde çalışan akıllı sözleşme ise kaynakların önerilen yeniden tahsisini belirlemekten sorumludur. Açık artırmayı örnek alırsak, akıllı sözleşme açık artırmayı kimin kazandığını ve ne kadar ödeyeceğini belirlemekten sorumludur, ancak Zoe teklifler ve ödemelerin güvenliğini sağlamakla ilgilenmektedir. Bunu, e-ticaret web sitelerinin kendi kredi kartlarını yönetmek zorunda kalmamaları için ayrı bir ödeme işleyici kullanmalarına benzetebilirsiniz.

### "Teklif Güvenliği" Nedir?

Zoe, teklif güvenliğini garanti eder; bu, bir kullanıcı bir teklif yaptığında ve bu teklif Zoe tarafından güvence altına alındığında, Zoe'nin kullanıcının ya istediklerini geri alacağını ya da başlangıçta teklif ettiği ve güvence altına aldığı tutarı geri alacağını garanti ettiği anlamına gelir.

Bir kullanıcı Zoe ile güvence altına aldığında, gelecekte bir ödemeyle ilgili bir JavaScript vaadi alır. Nasıl çalıştığını görmek için belirli bir örneğe bakalım.

## Bir Örnek: Değiş-Tokuş

Üç tuğlamı beş yün karşılığında takas etmek istiyorum. Senin beş yünün olduğunu fark ediyorsun ve anlaşmayı kabul ediyorsun. Zoe olmadan, bana beş yünü gönderebilir ve ben de üç tuğlayı asla vermeden kaybolabilirim. Zoe ile, birbirimize güvenmeden bile güvenli bir şekilde ticaret yapabiliriz. En kötü senaryoda, eğer takas sözleşmesi kötü davranırsa, ikimiz de geri ödeme alırız; en iyi senaryoda ise birbirimizin istediği şeyi alırız.

Temel  bakalım. (Bağlantı,  içerir.)

İşte ne olduğuna dair yüksek düzeyde bir genel bakış:

1. Takas sözleşmesinin bir örneğini oluşturuyorum ve sözleşmeye katılmak için bir davetiye alıyorum.
2. Zoe üzerinden, üç tuğla karşılığında beş yün önerisiyle davetiyemi sunarak bir teklif yapıyorum ve üç tuğlayla bir ödeme yapıyorum. Zoe, tuğlaları güvence altına alır ve bana sözleşmede teklifimin, ödemelerin vb. sonuçlarını alabileceğim bir yer (araç `UserSeat` olarak tanımlanmıştır) döner.
3. Teklifimin işlenmesinin sonucu, karşı tarafım için bir davetiye olacaktır. Bu sözleşme örneğine katılmak için sana o davetiyeyi gönderiyorum.
4. Davetiyeyi inceliyorsun ve `atomicSwap` sözleşme kodu tarafından oluşturulduğunu doğruluyorsun.
5. Davetiyeni, Zoe ile eşleşen teklifini yapmak için kullanıyorsun (beş yün üç tuğla için). Kendi davetiyeni alıyorsun; bu seni ödemen ile teklif sonuçlarına erişmen için kullanabileceğin bir yerle donatıyor.
6. Sözleşme, tekliflerimizin eşleştiğini doğruluyor ve tuğlalarımızı ve yünlerimizi yeniden tahsis edip tekliflerimizden çıkıyor. Bu, benim istediğim beş yünün ve senin istediğin üç tuğlanın karşılık gelen ödeme vaatlerini yerine getirecek. Başarı!

## Akıllı Sözleşmeler Nasıl Yazılır

Zoe üzerinde çalışan akıllı sözleşmeler yazmak kolaydır.  gibi basit bir sözleşmeye bakalım. (Bağlantı,  içerir.) Bu sadece tek bir iş yapar ve oldukça işe yaramaz – koyduğun şeyi geri verir.

```js
const start = zcf => {
  const refund = seat => {
    seat.exit();
    return `Teklif kabul edildi`;
  };
  const makeRefundInvitation = () => zcf.makeInvitation(refund, 'getRefund');

  const publicFacet = Far('publicFacet', {
    makeInvitation: makeRefundInvitation
  });

  const creatorInvitation = makeRefundInvitation();

  return harden({ creatorInvitation, publicFacet });
};

harden(start);
export { start };
```

Yeni bir nesne veya dizi yarattığımızda, onu `harden` ile birbirine bağlı olarak donduruyoruz. `Harden` hakkında daha fazla bilgi edinebilirsiniz .

`automaticRefund` sözleşme davranışı `refund` içinde uygulanmaktadır. Bu, kullanıcının Zoe aracılığıyla ödemesini alması için teklifi çıkarmasını belirtir.

Zoe üzerinde bir akıllı sözleşme, tek bir parametre alan `start` adında bir fonksiyonu dışa aktarmalıdır: `zcf`, Zoe'nin sözleşme içi API'sidir. `start` fonksiyonu, birkaç isteğe bağlı özellikten herhangi biriyle bir nesne döndürmelidir:

- **creatorInvitation**: Sözleşme örneğinin yalnızca yaratıcısına sunulan bir davetiye.
- **creatorFacet**: Yalnızca yaratıcının erişimini sağladığı işlemleri içeren bir nesne.
- **publicFacet**: Örneğe erişimi olan herhangi bir istemciye sunulan işlemleri içeren bir nesne.

## Daha Derine İnmek

 yeniden dönelim. (Bağlantı,  içerir.)

Sözleşme önce, `Asset` ve `Price` anahtar kelimeleri için `issuers` ayarlarının yapıldığını onaylar. Bunlar takas edilecek iki maddelik bir çift.

Aşağıdaki kod, sözleşmenin çalıştığı örneğin şartlarının özelliklerini kontrol eden  kullanır.

```js
const start = zcf => {
  assertIssuerKeywords(zcf, harden(['Asset', 'Price']));
```

`makeMatchingInvitation()` yöneticisi, sözleşme örneğinin yaratıcısına aittir ve diğer tarafın kullanması için `davetye` oluşturur. Bu bölümün sonunda, bunun sözleşmeye nasıl eklendiğini göreceğiz. İlgili `creatorInvitation` kullanıldığında, bir teklif yapmak için `makeMatchingInvitation()` kullanılır ve bu `teklif` için `seat` ile birlikte atanır.

Bu sözleşme, sözleşmenin hangi tür ticareti kabul ettiğini kontrol etmek için  kullanır. Bu durumda, teklifler aşağıdaki şeklin bir önerisine sahip olmalıdır:

```js
{
  give: { Asset: amount1 },
  want: { Price: amount2 },
}
```

`amount1` ve `amount2`, anahtar kelimeler için doğru verenlerle birlikte miktarlardır. Sözleşme, daha sonra uygun eşleştirme için önerinin özelliklerini çıkarmak üzere `getProposal()` kullanır.

```js
  const makeMatchingInvitation = firstSeat => {
    assertProposalShape(firstSeat, {
      give: { Asset: null },
      want: { Price: null },
    });
    const { want, give } = firstSeat.getProposal();
```

`makeMatchingInvitation()` ardından, ikinci teklif için bir `matchingSeatOfferHandler()` yöneticisi oluşturur ve birincil teklifin `want` ve `give` özelliklerini içerir. Bu ikinci yönetici son adım için sorumludur. Bu, yukarıda tanımlanan ve varlıkların iki koltuk arasında yeniden tahsisini sağlamaya çalışan  kullanır; ardından iki koltuğu da kapatır ve her iki taraf için ödemeleri kullanılabilir hale getirir. Son olarak, `matchingSeatOfferHandler()` sözleşmeyi kapatır.

```js
const matchingSeatOfferHandler = matchingSeat => {
  const swapResult = swap(zcf, firstSeat, matchingSeat);
  zcf.shutdown();
  return swapResult;
};
```

Şimdi bunu bir araya getirelim. `makeMatchingInvitation()` fonksiyonunun son adımı, çağrılan davetiyeyi oluşturmak ve `matchingSeatOfferHandler()` fonksiyonu ile birlikte davet edilen teklifin önerisi için özel özellikler eklemektir.

```js
    const matchingSeatInvitation = zcf.makeInvitation(
      matchingSeatOfferHandler,
      'matchOffer',
      {
        asset: give.Asset,
        price: want.Price,
      },
    );
    return matchingSeatInvitation;
  };
```

Son olarak, `start` fonksiyonu örneğin yaratıcısı için bir davetiye oluşturur ve bunu `creatorInvitation` olarak döndürür.

```js
  const creatorInvitation = zcf.makeInvitation(
    makeMatchingInvitation,
    'firstOffer',
  );
  return { creatorInvitation };
};
```

`creatorInvitation`, yalnızca sözleşme örneğinin yaratıcısına sunulur (bkz. ). Yaratıcı, bunu kendi teklifini yapmak için kullanabilir ya da başka bir tarafa gönderebilir.