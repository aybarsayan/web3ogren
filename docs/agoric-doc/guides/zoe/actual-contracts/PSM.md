---
title: PSM Sözleşmesi
---



#####  (Son güncelleme: 15 Ağu 2022)

Parity Stability Module (PSM) sözleşmesi, kullanıcıların belirli bir sabit oranla Inter Stable Tokens (IST'ler) ile dış stabil tokenler arasında dönüşüm yapmalarına olanak tanır ve tersine de çalışır.

IST, Agoric zincirindeki interchain ekosistemi için evrilen, tamamen teminatlı, kripto para destekli merkeziyetsiz bir stabil token'dır. IST, geniş erişilebilirlik sağlamak amacıyla ABD doları (USD) ile pariteyi koruyacak şekilde tasarlanmış ve Agoric ile interchain ekosistemi kullanıcılarına minimum fiyat dalgalanması olan bir varlık sunmaktadır. Ayrıca, IST, Agoric platformunun yerel ücret token'ıdır ve Agoric kripto ekonomisi için bazı temel işlevsellik ve istikrar sağlamaktadır. Şu anda PSM, IST'nin tek üreticisidir.

Hangi dış stabil tokenlerin destekleneceği, ekonomik komitenin oylama şeklinde yönetişim kararıyla belirlenir. Yönetişim, yalnızca bir dış stabil token'ı desteklemeyi seçebilir, bu durumda yalnızca bir PSM oluşturulacaktır.

## PSM'yi Oluşturma

Her PSM örneği, IST'yi başka bir token ile eşleştirir. Birden fazla token ile IST ticareti yapabilmek için, PSM sözleşmesini her biri için bir kez oluşturun.

## Teklif Oluşturma

PSM sözleşmesi, dış stabil tokenleri IST tokenleri ile değiştirme ve IST tokenlerini dış stabil tokenlere değiştirme gibi 2 farklı teklif türünü destekler. Her iki teklif türü için başarılı bir teklif için yalnızca bir kullanıcı gereklidir; her iki durumda da PSM kendisi diğer ticaret ortağı olarak hareket eder.

### Dış Stabil Tokenleri IST Tokenleri ile Değiştirme

Dış stabil tokenleri IST tokenleri ile değiştirmek için bir teklif oluşturmak için aşağıdakileri yapın:

1.  makeWantMintedInvitation yöntemini kullanarak bir davetiye oluşturun.
    ```js
    const myInvitation = E(publicFacet).makeWantMintedInvitation();
    ```
2.  Ticaret yapmak istediğiniz dış stabil tokenler için ve almak istediğiniz IST tokenleri için Miktarlar oluşturun.

    ```js
    const giveAnchorAmount = AmountMath.make(anchorBrand, 200_000_000n);
    const wantMintedAmount = AmountMath.make(istBrand, 200_000_000n);
    ```

3.  Bir teklif oluşturun. **In** ve **Out** anahtar kelimelerini kullanın; burada **In**, teklif ettiğiniz dış stabil tokenlerin miktarını, **Out** ise beklediğiniz IST tokenlerinin miktarını temsil eder. PSM'nin her zaman diğer ticaret ortağı olarak hareket edebileceğini dikkate alarak, bu teklifin çıkış koşulu yoktur (veya ihtiyaç duymaz).

    ```js
    const myProposal = {
      give: { In: giveAnchorAmount },
      want: { Out: wantMintedAmount }
    };
    ```

4.  PSM'ye ticaret yaptığınız dış stabil tokenleri içeren bir ödeme kaydı oluşturun.

    ```js
    const myPaymentRecord = { In: anchorPayment };
    ```

5.  Teklifi oluşturun ve teklif ile ödeme kaydını sağlamlaştırmayı unutmayın.

    ```js
    const seat = E(zoe).offer(
      myInvitation,
      harden(myProposal),
      harden(myPaymentRecord)
    );
    ```

### IST Tokenlerini Dış Stabil Tokenler ile Değiştirme

IST tokenlerini dış stabil tokenleri ile değiştirmek için bir teklif oluşturmak için aşağıdakileri yapın:

1.  makeGiveMintedInvitation yöntemini kullanarak bir davetiye oluşturun.

   ```js
   const myInvitation = E(publicFacet).makeGiveMintedInvitation();
   ```

2.  Ticaret yapmak istediğiniz IST tokenleri için ve almak istediğiniz dış stabil tokenler için Miktarlar oluşturun.
   ```js
   const giveMintedAmount = AmountMath.make(istBrand, 200_000_000n);
   const wantAnchorAmount = AmountMath.make(anchorBrand, 200_000_000n);
   ```

3.  Teklif oluşturun ve bunu sağlamlaştırın. **In** ve **Out** anahtar kelimelerini kullanın; burada **In**, teklif ettiğiniz IST tokenlerinin miktarını, **Out** ise beklediğiniz dış stabil tokenlerin miktarını temsil eder. PSM'nin her zaman diğer ticaret ortağı olarak hareket edebileceğini dikkate alarak, bu teklifin çıkış koşulu yoktur (veya ihtiyaç duymaz).
   ```js
   const myProposal = harden({ 
     give: { In: giveMintedAmount },
     want: { Out: wantAnchorAmount },
   });
   ```

4.  PSM'ye ticaret yaptığınız IST tokenlerini içeren bir ödeme kaydı oluşturun ve bunu sağlamlaştırın.
   ```js
   const myPaymentRecord = harden({ In: mintedPayment });
   ```

5.  Teklifi oluşturun.
   ```js
   const seat = E(zoe).offer(myInvitation, myProposal, myPaymentRecord);
   ```