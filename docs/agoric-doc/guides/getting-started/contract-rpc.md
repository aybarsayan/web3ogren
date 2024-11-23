---
title: Müşteri Dapps Oluşturma
---

# Müşteri Dapps Oluşturma

 akıllı sözleşmelerden ve bir  VM üzerinde çalışan  gibi hizmetlerden oluşmaktadır. Müşteriler, imzalı işlemlerle sorgular yaparak ve mesajlar göndererek konsensüs katmanıyla etkileşim kurar. Akıllı Cüzdan Mimarisi'nde, dapp'ler şu bileşenlerden oluşmaktadır:

- Hardened JavaScript akıllı sözleşmeleri
- Konsensüs katmanı üzerinden teklifler gönderebilen ve durum sorgulayabilen müşteriler



1. Bir müşteri teklifi biçimlendirir, imzalar ve yayınlar.
2. Teklif, imzalayan adresle ilişkili `smartWallet` nesnesini bulan (veya oluşturan) `walletFactory` sözleşmesine yönlendirilir ve bu nesne teklifi yürütmek için kullanılır.
3. `smartWallet`, `E(zoe).offer(...)` çağrısını yapar ve teklifin durumunu izler, müşterilerin sorgulaması için yayımlar.
4. Zoe ödemeleri güvence altına alır ve teklifte belirtilen sözleşmeye öneriyi iletir.
5. Sözleşme Zoe'ye varlıkların nasıl yeniden tahsis edileceğini söyler.
6. Zoe, yeniden tahsislerin teklif güvenliğini dikkate aldığından emin olur ve sonrasında uygun şekilde ödemeleri sağlar.
7. Müşterinin sorgusu, ödemelerin mevcut olduğunu bildirir.

## Teklifleri İmzalama ve Yayınlama

Teklifleri imzalamanın ve yayınlamanın bir yolu `agd tx ...` komutunu kullanmaktır. Örneğin:

```sh
agd tx swingset wallet-action --allow-spend "$ACTION" \
 --chain-id=agoriclocal --from=acct1
```



Diğer bir yol ise  aracılığıyla Keplr gibi bir cüzdan imzalama kullanıcı arayüzü kullanmaktır.

Yeterli anahtar yönetimi ile,  veya  mesajını teslim edebilen herhangi bir başka istemci de çalışır.

```proto
message MsgWalletSpendAction {
    bytes owner = 1;
    string spend_action = 2;
}
```



## VStorage Sorgulama

 (sanallaştırılmış depolama için) konsensüs katmanının müşterileri için yalnızca okunabilir bir anahtar-değer deposudur. JavaScript VM içinden, her anahtar için yalnızca yazılabilir bir düğüm ile `chainStorage` API'si aracılığıyla erişilir; biraz `console` gibi.



Protobuf tanımı :

```proto
service Query {
  // Rastgele bir vstorage verisi döndür.
  rpc Data(QueryDataRequest) returns (QueryDataResponse) {
    option (google.api.http).get = "/agoric/vstorage/data/{path}";
  }

  // Verilen bir vstorage yolunun çocuklarını döndür.
  rpc Children(QueryChildrenRequest)
    returns (QueryChildrenResponse) {
      option (google.api.http).get = "/agoric/vstorage/children/{path}";
  }
}
```

Sorguları `agd query ...` kullanarak verebiliriz:

```sh
$ agd query vstorage children 'published.agoricNames'

children:
- brand
- installation
- instance
...
```

 `follow` komutu, vstorage sorgularını destekleyerek aşağıda tartışılan bazı durumları yönetir:

```sh
$ agoric follow -lF :published.agoricNames.brand
[
  [
    "BLD",
    slotToVal("board0566","Alleged: BLD brand"),
  ],
  [
    "IST",
    slotToVal("board0257","Alleged: IST brand"),
  ],
...
]
```

::: tip VStorage Görüntüleyici

 genellikle _çok_ kullanışlıdır:



:::

## Teklifleri Belirleme

JavaScript VM içindeki bir kullanıcı için,  bir `Invitation` ve isteğe bağlı olarak `{ give, want, exit }` ile bir `Proposal`, bir `PaymentPKeywordRecord` ve `offerArgs` alır; bir `UserSeat` döndürür ki buradan  alabiliriz.



Akıllı Cüzdan mimarisinde, bir müşteri teklifini yürütmek için `SmartWallet`'ine bir `OfferSpec` ile bilgi verir. Zoe'ye iletmek için hangi davetiyenin geçileceğini belirtmek üzere bir `invitationSpec` içerir. Örneğin:



::: tip Davetiyeler Spesifikasyonu Kullanımı

Varsayalım ki `spec` bir `InvitationSpec`, bunun `.source` alanı aşağıdakilerden biri olabilir:

- `purse` - `smart wallet`'ın Davetiye cüzdanında olan ve `spec` ile `.instance` ve `.description` özelliklerinde uyumlu olan bir davetiye ile teklif yapmak için. Örneğin,  içinde, komite üyeleri komite kurulduğunda kendilerine gönderilen davetiyeleri kullanır.

- `contract` - akıllı cüzdan, belirli bir örneğin genel yüzeyinin üzerinde bir yöntem çağırarak bir davetiye oluşturur: `E(E(zoe).getPublicFacet(spec.instance)`

- `agoricContract` - örneğin,  içinde:

```js
{
   source: 'agoricContract',
   instancePath: ['VaultFactory'],
   callPipe: [
     ['getCollateralManager', [toLock.brand]],
     ['makeVaultInvitation'],
   ],
 }
```

Akıllı cüzdan, `E(agoricNames).lookup('instance', ...spec.instancePath)` ile örneği bulur ve `spec.callPipe`'de belirtilen yöntemler zinciri oluşturur. `callPipe`'deki her bir giriş, önceki sonuca çağrı yapmak için kullanılan `[methodName, args?]` çiftidir. Boru ucunun sonu, bir Davetiye döndürmesi beklenir.

- `continuing` - Örneğin, `dapp-inter` aşağıdaki `InvitationSpec` ile bir cüzdanı ayarlamakta kullanır:

```js
{
  source: 'continuing',
  previousOffer: vaultOfferId,
  invitationMakerName: 'AdjustBalances',
}
```

Bu devam eden teklifte, akıllı cüzdan önceki teklifin sonucunun `.invitationMakers` özelliğini bulmak için `spec.previousOffer` kimliğini kullanır. Davetiye oluşturmak için `E(invitationMakers)` çağrısını yapar.

:::

Müşteri, `SmartWallet`'ın Zoe'ye göndermesi için ilgili ödemeleri çekmesini belirtmek amacıyla teklifi doldurur.

,
   offerToUsedInvitation: Array,
   offerToPublicSubscriberPaths: Array,
   liveOffers: Array,
}
```

Ve  ise:

```ts
     { updated: 'offerStatus', status: import('./offers.js').OfferStatus }
   | { updated: 'balance'; currentAmount: Amount }
   | { updated: 'walletAction'; status: { error: string } }
```

Her iki tür de  ile referans yoluyla ilişkilidir:

```ts
import('./offers.js').OfferSpec & {
 error?: string,
 numWantsSatisfied?: number
 result?: unknown | typeof UNPUBLISHED_RESULT,
 payouts?: AmountKeywordRecord,
}
```

## VBank Varlıkları ve Cosmos Bank Bakiyeleri

**IST** ve **BLD** gibi varlıkların bakiyeleri, Cosmos SDK'nın  aracılığıyla konsensüs katmanı sorguları ile mevcut durumdadır.

```sh
$ agd query bank balances agoric1h4d3mdvyqhy2vnw2shq4pm5duz5u8wa33jy6cl -o json | jq .balances
[
  {
    "denom": "ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA",
    "amount": "100000000"
  },
  {
    "denom": "ubld",
    "amount": "10000000"
  },
  {
    "denom": "uist",
    "amount": "215000"
  }
]
```

Bu bilgilerin vstorage'da yayınlanmadığını ve akıllı cüzdanın da bunlar için `balance` güncellemeleri yapmadığını unutmayın.

Belirli cosmos denomları (yönetim tarafından seçilen) ile onların ERTP markaları, ihraççıları ve `decimalPlaces` gibi gösterim bilgileri arasındaki ilişkiyi görmek için `published.agoricNames.vbankAsset` kullanabilirsiniz:

```sh
agoric follow -lF :published.agoricNames.vbankAsset
[
  [
    "ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA",
    {
      brand: slotToVal("board05557","Alleged: ATOM brand"),
      denom: "ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA",
      displayInfo: {
        assetKind: "nat",
        decimalPlaces: 6,
      },
      issuer: slotToVal("board02656","Alleged: ATOM issuer"),
      issuerName: "ATOM",
      proposedName: "ATOM",
    },
  ],
  [
    "ubld",
    {
      brand: slotToVal("board0566","Alleged: BLD brand"),
      denom: "ubld",
      displayInfo: {
        assetKind: "nat",
        decimalPlaces: 6,
      },
      issuer: slotToVal("board0592","Alleged: BLD issuer"),
      issuerName: "BLD",
      proposedName: "Agoric staking token",
    },
  ],
  [
    "uist",
    {
      brand: slotToVal("board0257","Alleged: IST brand"),
      denom: "uist",
      displayInfo: {
        assetKind: "nat",
        decimalPlaces: 6,
      },
      issuer: slotToVal("board0223","Alleged: IST issuer"),
      issuerName: "IST",
      proposedName: "Agoric stable token",
    },
  ],
...
]