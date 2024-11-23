---
id: kontrat-yönetimi
title: Kontrat Yönetimi
---

# Kontrat Yönetimi

Agoric platformu, Cosmos SDK platformundaki zincir genel yönetime ek olarak, kontratlar üzerinde üç ana kontrol biçimini destekleyen esnek bir mimari ile `@agoric/governance` paketini içermektedir. Bu, iyi bir merkeziyetsizlik ve yürütme kontrolü dengesine sahip sistemler oluşturmayı amaçlamaktadır:

- **Parametre Yönetimi**: Parametre değerlerinin kontrolü
- **API Yönetimi**: Kontrat yazarları tarafından belirtilen belirli yöntemlerin çağrılabilme yeteneği
- **Teklif filtreleri**: Acil durumlar için bazı teklifler/davetiye kullanımlarını devre dışı bırakma yeteneği

::: tip Yönetim Paketi Hedefleri

Yönetim paketinin tasarımı, bir kontratın müşterilerinin değişiklik yapma yetkisine sahip olanları, hangi değişiklikleri yapabileceklerini ve kontrol altındaki değerlerin mevcut durumunu görebilmelerini sağlamaya odaklanmaktadır.

 yönetim paketinin desteklemeyi amaçladığı garantileri açıklamaktadır.

:::

## Parametre Yönetimi

 bölümünde, kontratların _şartlar_ ile parametrelenmiş olduğunu gördük. Parametre yönetimi, bir yetkilendirilmiş tarafın, _Seçmen_ olarak adlandırılan, kontrat çalışırken böyle parametreleri değiştirmesine olanak tanır.

 projesinde, swaparoo kontratı yönetilen bir `Fee` parametresi içerir:

```js
const paramTypes = harden(
  /** @type {const} */ ({
    Fee: ParamTypes.AMOUNT
  })
);
```

## Seçmen, Seçim Yöneticisi için Kontratların Yeniden Kullanılması

Bu dapp, `@agoric/governance` kütüphanesindeki `committee.js` kontratını seçmen olarak kullanmaktadır. Temel değerlendirme dağıtım scripti, swaparoo komitesini başlatır, davetiyeleri alır ve bunları seçmenlerin akıllı cüzdanlarına gönderir. `test-vote-by-committee.js` dosyasında komite sadece 1 seçmenden oluşmaktadır.



## Bir Kontrata Parametre Yönetimi Eklemek

Bir kontrata parametre yönetimi eklemek esasen `handleParamGovernance(...)` fonksiyonunu kullanmayı içerir. İlk parametre değerleri için `getTerms()` alabilmesi amacıyla `zcf` parametresini geçiririz ve yönetilen parametreleri ve türlerini belirlemek için `paramTypes` aralıklarını geçiririz. `initialPoserInvitation`, seçimi değiştirmek için gereklidir. `storageNode` ve `marshaller`,  kullanılmaktadır.

```js
import { handleParamGovernance } from '@agoric/governance/src/contractHelper.js';

export const start = async (zcf, privateArgs, baggage) => {
  // ...
  const { publicMixin, makeDurableGovernorFacet, params } =
    await handleParamGovernance(
      zcf,
      privateArgs.initialPoserInvitation,
      paramTypes,
      privateArgs.storageNode,
      privateArgs.marshaller
    );
  // ...
};
```

Geri dönüş alırız:

- `params`: sadece okunabilir parametre erişimi. `params.getFee().value` ile, örneğin, `Fee` parametresinin mevcut değerini her an elde edebiliriz.
- `publicMixin`: parametre değerlerini kontratın `publicFacet` aracılığıyla erişilebilir hale getirmek için
- `makeDurableGovernorFacet`: kontratın mevcut yaratıcı facet yöntemlerini (bilinen `limitedCreatorFacet`) _parametre değerlerini değiştirme_ yöntemleri ile birleştirmek için.

```js
export const start = async (zcf, privateArgs, baggage) => {
  // ...
  const publicFacet = Far('Public', {
    makeFirstInvitation,
    ...publicMixin
  });
  const limitedCreatorFacet = Far('Creator', {
    makeCollectFeesInvitation() {
      return makeCollectFeesInvitation(zcf, feeSeat, feeBrand, 'Fee');
    }
  });
  const { governorFacet } = makeDurableGovernorFacet(
    baggage,
    limitedCreatorFacet
  );
  return harden({ publicFacet, creatorFacet: governorFacet });
};
```

## Bir Yönetilen Kontratı Yöneticisi Aracılığıyla Başlatma

Parametre değerlerini değiştirme yetkisi yalnızca seçmende bulunmaktadır. Bunu sağlamak amacıyla, yönetilen bir kontrat bir _kontrat yöneticisi_ tarafından başlatılır. Kontrat yöneticisi, parametreleri değiştirme yeteneğine sahip tam işlevli yaratıcı facet'i tutar. Yöneticiyi başlatan çağrıcı yalnızca `limitedCreatorFacet` alır.



_Açıklık sağlamak için, bu resimde bazı Zoe API detayları hariç tutulmuştur._

## Bir Seçim Yöneticisi Aracılığıyla Soru Sorma

_Bir Seçim Yöneticisi_, uygun bir tarafın `addQuestion()` çağrısı yapmasını sağlar. `@agoric/inter-protocol` kütüphanesindeki `econCommitteeCharter.js` kontratı, çoğu parametre yönetimi biçimini yeterince genel bir şekilde işleyebilir, bu yüzden burada tekrar kullanıyoruz. Swaparoo temel değerlendirme dağıtımı benzer şekilde bu kontratı başlatır, davetiyeleri ister ve bunları seçmenlere gönderir.



_Açıklık sağlamak için, bu resimde bazı Zoe API detayları hariç tutulmuştur._

Komite katılımcısı, charter davetiyesini kullanarak bir soru sorma yetkisini elde etmek amacıyla akıllı cüzdanını yönlendirir; bunun için `v0-accept-charter` teklifini referans alır:

```js
test.serial('Voter0 accepts charter, committee invitations', async t => {
  // ...
  await victor.acceptCharterInvitation('v0-accept-charter');
  // ...
});
```



Değişiklik teklifinde bulunmak için `VoteOnParamChange` yetkisini kullanan komite katılımcısı, `v0-accept-charter`ı `charterAcceptOfferId` olarak referans alarak bir  hazırlar:

```js
const makeVoter = (t, wallet, wellKnown) => {
  // ...
  const putQuestion = async (offerId, params, deadline) => {
    const instance = await wellKnown.instance[contractName]; // swaparoo instance handle
    const path = { paramPath: { key: 'governedParams' } };

    /** @type {import('@agoric/inter-protocol/src/econCommitteeCharter.js').ParamChangesOfferArgs} */
    const offerArgs = harden({ deadline, params, instance, path });

    /** @type {import('@agoric/smart-wallet/src/offers.js').OfferSpec} */
    const offer = {
      id: offerId,
      invitationSpec: {
        source: 'continuing',
        previousOffer: NonNullish(charterAcceptOfferId),
        invitationMakerName: 'VoteOnParamChange'
      },
      offerArgs,
      proposal: {}
    };
    return doOffer(offer);
  };
};
```

`offerArgs`, değiştirmek için bir son tarih ve parametreler ile ilgili detayları içerir:

```js
test.serial('vote to change swap fee', async t => {
  // ...
  const targetFee = IST(50n, 100n); // 50 / 100 = 0.5 IST
  const changes = { Fee: targetFee };
  // ...
  const deadline = BigInt(new Date(2024, 6, 1, 9, 10).valueOf() / 1000);
  const result = await victor.putQuestion('proposeToSetFee', changes, deadline);
  t.log('soru soruldu', result);
  // ...
});
```

## Bir Soru Üzerine Oy Kullanma

Seçmen de komiteye katılmak için davetiyesini kabul etmek amacıyla bir teklif yapar; bu teklifi `v0-join-committee` ile tanımlar:

```js
test.serial('Voter0 accepts charter, committee invitations', async t => {
  // ...
  await victor.acceptCommitteeInvitation('v0-join-committee', 0);
  // ...
});
```

Oy kullanma yeteneğini kullanmak amacıyla, `committeeOfferId` olarak `v0-join-committee`'yi referans alarak bir devam eden davetiye hazırlar:

```js
const makeVoter = (t, wallet, wellKnown) => {
  // ...
  const vote = async (offerId, details, position) => {
    const chosenPositions = [details.positions[position]];

    /** @type {import('./wallet-tools.js').OfferSpec} */
    const offer = {
      id: offerId,
      invitationSpec: {
        source: 'continuing',
        previousOffer: NonNullish(committeeOfferId),
        invitationMakerName: 'makeVoteInvitation',
        invitationArgs: harden([chosenPositions, details.questionHandle])
      },
      proposal: {}
    };
    return doOffer(offer);
  };
  // ...
};
```

Her soru, `details` içinde yayımlanan benzersiz bir `questionHandle` nesnesine sahiptir.

```js
test.serial('vote to change swap fee', async t => {
  // ...
  const details = await vstorage.get(
    `published.committee.swaparoo.latestQuestion`
  );
  t.is(details.electionType, 'param_change');
  const voteResult = await victor.vote('voteToSetFee', details, 0);
  t.log('victor oy kullandı:', voteResult);
  // ...
});
```

Son tarih geldiğinde, kontrat yöneticisi, sorunun kabul edildiğine dair bilgilendirilir. Komut, swaparoo kontratına ücreti değiştirmesi için talimat verir.

```js
test.serial('vote to change swap fee', async t => {
  // ...
  const swapPub = E(zoe).getPublicFacet(
    swapPowers.instance.consume[contractName]
  );
  // ...
  const after = await E(swapPub).getAmount('Fee');
  t.deepEqual(after, targetFee);
});
```

Swaparoo kontratı ayrıca güncellenmiş parametrelerini vstorage üzerine yayımlar.

## API Yönetimi

Parametre yönetimi, bir seçmenin yönetimindeki kontratların parametrelerini değiştirmesine olanak tanırken, API yönetimi de seçmenin kontrat API'lerini kullanabilmesine imkan tanır; özellikle yönetilen bir kontrattaki yaratıcı facet yöntemlerini.

Örneğin, Inter Protocol'de, Ekonomik Komite oracle operatörlerini ekleyip kaldırabilir:



Detaylar için:

- 
- `@agoric/inter-protocol` kütüphanesindeki `vaultFactory` kontratı

## Teklif Filtreleri

Bir seçmen, bir kontratın Zoe'nin sözleşme ile ileteceği teklifleri filtrelemesini yönlendirebilir. Ayrıntılar için:

- .
- 