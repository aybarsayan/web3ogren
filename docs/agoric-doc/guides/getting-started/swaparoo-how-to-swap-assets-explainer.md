---
title: Swaparoo Sözleşmesi
---

# Swaparoo Sözleşmesi

Bu akıllı sözleşme, iki tarafın karşılıklı olarak varlıklarını değiştirmesine olanak tanır ve bu süreçte bir tarafın belirlenen bir ücret ödemesi gerekmektedir. Sözleşme, `feeAmount` ve `namesByAddressAdmin` nesnesi ile başlatılır ve bu nesne, ikinci taraf için bir depozito yöneticisi almak amacıyla kullanılır.

**NOT:** _`namesByAddressAdmin`, bu senaryoda aslında gereksiz bir yetki sunmaktadır. Normalde yalnızca okunabilir erişim `namesByAddress` üzerinden sağlanabilir. Bu örnekte `namesByAddressAdmin` kullanımının sebebi, yaklaşan bir güncellemeyle giderilecek olan bir hatadır._

Sözleşmenin nasıl çalıştığına bir göz atalım:

## Ücret Yönetimini Ayarlama

Sözleşme, ücretler için kullanılan stabilize tokenin vericisidir ve bunu Zoe hizmetinden `feeIssuer` olarak alır. Sözleşme şartlarında belirtilen `feeAmount` temel alınarak bir `feeSeat` ve `feeShape` oluşturur.

```js
const stableIssuer = await E(zcf.getZoeService()).getFeeIssuer();
const feeBrand = await E(stableIssuer).getBrand();
const { zcfSeat: feeSeat } = zcf.makeEmptySeatKit();
const feeShape = makeNatAmountShape(feeBrand, feeAmount.value);
```

## İlk Davetiye Oluşturma

`makeFirstInvitation` fonksiyonu, bir dizi verici ile çağrılır. Bu vericilerin sözleşme şartlarının bir parçası olduğunu doğrular ve yeni vericileri sözleşmeye kaydeder. Ardından, `feeShape`'i içeren bir teklif şekli ile davetiye oluşturur.

```js
const makeFirstInvitation = issuers => {
  mustMatch(issuers, M.arrayOf(IssuerShape));
  for (const i of issuers) {
    if (!Object.values(zcf.getTerms().issuers).includes(i)) {
      zcf.saveIssuer(i, `Issuer${(issuerNumber += 1)}`);
    }
  }
  const proposalShape = M.splitRecord({
    give: M.splitRecord({ Fee: feeShape })
  });

  const firstInvitation = zcf.makeInvitation(
    makeSecondInvitation,
    'swap oluştur',
    undefined,
    proposalShape
  );
  return firstInvitation;
};
```

## İkinci Davetiye Oluşturma

Birinci taraf davetiyeyi kabul ettiğinde, `makeSecondInvitation` fonksiyonu çağrılır. Bu fonksiyon, `namesByAddressAdmin` nesnesini ve sağlanan adresi kullanarak ikinci taraf için depozito yöneticisini alır.

```js
const makeSecondInvitation = async (firstSeat, offerArgs) => {
  mustMatch(offerArgs, harden({ addr: M.string() }));
  const { addr: secondPartyAddress } = offerArgs;

  const secondDepositFacet = await E(depositFacetFromAddr).lookup(
    secondPartyAddress,
    'depositFacet'
  );
  // ...
};
```

Buradan itibaren, ikinci bir davetiye, ikinci tarafın teklifi birinci tarafın talepleriyle eşleşip eşleşmediğini kontrol eden bir teklif yöneticisi ile oluşturulur. Eğer eşleşiyorsa, `swapWithFee` fonksiyonu çağrılarak varlık takası gerçekleştirilir ve ücret toplanır.

```js
const secondSeatOfferHandler = secondSeat => {
  if (!matches(secondSeat.getProposal(), makeSecondProposalShape(want1))) {
    // Uyuşmayan teklifler için işlem yap
    return;
  }

  return swapWithFee(zcf, firstSeat, secondSeat, feeSeat, feeAmount);
};

const secondSeatInvitation = await zcf.makeInvitation(
  secondSeatOfferHandler,
  'teklifi eşleştir',
  { give: give1, want: want1 }
);
```

## Takasın Gerçekleştirilmesi

`swapWithFee` fonksiyonu, varlık takası gerçekleştirmek ve ücreti toplamak için Zoe'den `atomicRearrange` fonksiyonunu kullanır. Varlıkları birinci koltuk, ikinci koltuk ve feeSeat arasında yeniden düzenler.

```js
export const swapWithFee = (zcf, firstSeat, secondSeat, feeSeat, feeAmount) => {
  const { Fee: _, ...firstGive } = firstSeat.getProposal().give;

  atomicRearrange(
    zcf,
    harden([
      [firstSeat, secondSeat, firstGive],
      [secondSeat, firstSeat, secondSeat.getProposal().give],
      [firstSeat, feeSeat, { Fee: feeAmount }]
    ])
  );

  firstSeat.exit();
  secondSeat.exit();
  return 'başarılı';
};
```

## Ücretlerin Toplanması

Sözleşme ayrıca, feeSeat'de biriken ücretleri toplamak için bir `makeCollectFeesInvitation` yöntemi olan bir `creatorFacet` sağlar.

```js
const creatorFacet = Far('Yaratıcı', {
  makeCollectFeesInvitation() {
    return makeCollectFeesInvitation(zcf, feeSeat, feeBrand, 'Ücret');
  }
});
```

## Video Geçişi

Herhangi iki tarafın dijital varlıkları minimum riskle takas etmesine olanak tanıyan tam Swaparoo Akıllı Sözleşmesi'nin kısa video geçişini izleyin.



