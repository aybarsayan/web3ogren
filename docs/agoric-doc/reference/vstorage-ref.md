# VStorage Referansı

Ayrıca bakınız:

- 
- 
- 

## vstorage: üst düzey anahtarlar

`published` ve `bundles` anahtarları, dapp geliştirme açısından en ilgili olanlardır.

```js
    {
      activityhash: 'historical',
      beansOwing: 'swingset execution fee accounting',
      bundles: 'MsgInstallBundle outcome',
      egress: 'reserved for future use',
      highPrioritySenders: 'a priority mechanism',
      mailbox: 'reserved for future use',
      published: 'for the chainStorage API; see below',
    }
```

## vstorage: published.* anahtarları

Aşağıdaki anahtarlar `published` altında görünmektedir. 
Ayrıca bakınız: .

```js
    {
      agoricNames: 'chain yönetimi tarafından kontrol edilen isim hizmeti',
      auction: 'Inter Protokol'a bakın',
      boardAux: 'markalar vb. için boardId ile anahtarlanan yardımcı veriler ( #49 2023-09-21 itibarıyla)',
      committees: 'Inter Protokol'a bakın',
      crabble: 'chain yönetimi önerisi #64 tarafından rezerve edildi, karar tarih 2023-12-18',
      kread: 'chain yönetimi önerisi #53 tarafından rezerve edildi, karar tarih 2023-10-01',
      priceFeed: 'Inter Protokol\'a bakın',
      provisionPool: 'akıllı cüzdan sağlaması sırasında başlangıç IST sağlıyor',
      psm: 'Inter Protokol\'a bakın',
      reserve: 'Inter Protokol\'a bakın',
      vaultFactory: 'Inter Protokol\'a bakın',
      wallet: 'akıllı cüzdan durumu',
    }
```

## vstorage: agoricNames hub'ları

agoricNames, birkaç başka NameHub içerir. 
Ayrıca bakınız: .

```js
['brand', 'installation', 'instance', 'issuer', 'oracleBrand', 'vbankAsset'];
```

## vstorage: bilinen sözleşmeler

`published.agoricNames.installation`, önemli sözleşmelerin kodunu temsil eden _Kurulumlar_ içerir. Bu anahtardaki veriler, NameHub'un girişleridir. Aşağıda bu girişlerden oluşan nesne gösterilmektedir. 
Ayrıca bakınız:  veri marshalling'ini board ID'leri kullanarak.

```js
    {
      VaultFactory: Object @Alleged: BundleIDInstallation#board05815 {},
      auctioneer: Object @Alleged: BundleIDInstallation#board04016 {},
      binaryVoteCounter: Object @Alleged: BundleIDInstallation#board02314 {},
      centralSupply: Object @Alleged: BundleIDInstallation#board0188 {},
      committee: Object @Alleged: BundleIDInstallation#board00613 {},
      contractGovernor: Object @Alleged: BundleIDInstallation#board02810 {},
      econCommitteeCharter: Object @Alleged: BundleIDInstallation#board01422 {},
      feeDistributor: Object @Alleged: BundleIDInstallation#board00917 {},
      kreadCommitteeCharter: Object @Alleged: BundleIDInstallation#board01679 {},
      kreadKit: Object @Alleged: BundleIDInstallation#board04980 {},
      mintHolder: Object @Alleged: BundleIDInstallation#board02733 {},
      priceAggregator: Object @Alleged: BundleIDInstallation#board02021 {},
      provisionPool: Object @Alleged: BundleIDInstallation#board05311 {},
      psm: Object @Alleged: BundleIDInstallation#board05432 {},
      reserve: Object @Alleged: BundleIDInstallation#board00218 {},
      scaledPriceAuthority: Object @Alleged: BundleIDInstallation#board04719 {},
      walletFactory: Object @Alleged: BundleIDInstallation#board04312 {},
    }
```

`published.agoricNames.instance`, önemli sözleşmelerin _örneklerini_ içerir. Bu anahtardaki veriler, NameHub'un girişleridir. Aşağıda bu girişlerden oluşan nesne gösterilmektedir.

```js
    {
      'ATOM-USD fiyat beslemesi': Object @Alleged: InstanceHandle#board02963 {},
      Crabble: Object @Alleged: InstanceHandle#board04395 {},
      CrabbleCommittee: Object @Alleged: InstanceHandle#board02393 {},
      CrabbleGovernor: Object @Alleged: InstanceHandle#board05396 {},
      VaultFactory: Object @Alleged: InstanceHandle#board00360 {},
      VaultFactoryGovernor: Object @Alleged: InstanceHandle#board03773 {},
      auctioneer: Object @Alleged: InstanceHandle#board01759 {},
      econCommitteeCharter: Object @Alleged: InstanceHandle#board04661 {},
      economicCommittee: Object @Alleged: InstanceHandle#board04149 {},
      feeDistributor: Object @Alleged: InstanceHandle#board05262 {},
      kread: Object @Alleged: InstanceHandle#board04783 {},
      kreadCommittee: Object @Alleged: InstanceHandle#board01985 {},
      kreadCommitteeCharter: Object @Alleged: InstanceHandle#board06284 {},
      provisionPool: Object @Alleged: InstanceHandle#board01664 {},
      'psm-IST-DAI_axl': Object @Alleged: InstanceHandle#board01867 {},
      'psm-IST-DAI_grv': Object @Alleged: InstanceHandle#board02568 {},
      'psm-IST-USDC_axl': Object @Alleged: InstanceHandle#board05669 {},
      'psm-IST-USDC_grv': Object @Alleged: InstanceHandle#board05970 {},
      'psm-IST-USDT_axl': Object @Alleged: InstanceHandle#board02271 {},
      'psm-IST-USDT_grv': Object @Alleged: InstanceHandle#board01272 {},
      reserve: Object @Alleged: InstanceHandle#board06458 {},
      reserveGovernor: Object @Alleged: InstanceHandle#board03365 {},
      'scaledPriceAuthority-stATOM': Object @Alleged: InstanceHandle#board05892 {},
      'stATOM-USD fiyat beslemesi': Object @Alleged: InstanceHandle#board04091 {},
      walletFactory: Object @Alleged: InstanceHandle#board06366 {},
    }
```

## vstorage: bilinen varlıklar

`published.agoricNames.issuer`, bilinen varlıkların İhraççılarını içerir.

```js
    {
      ATOM: Object @Alleged: ATOM issuer#board02656 {},
      BLD: Object @Alleged: BLD issuer#board0592 {},
      DAI_axl: Object @Alleged: DAI_axl issuer#board02437 {},
      DAI_grv: Object @Alleged: DAI_grv issuer#board05039 {},
      IST: Object @Alleged: IST issuer#board0223 {},
      Invitation: Object @Alleged: Zoe Invitation issuer#board0371 {},
      KREAdCHARACTER: Object @Alleged: KREAdCHARACTER issuer#board01386 {},
      KREAdITEM: Object @Alleged: KREAdITEM issuer#board03687 {},
      USDC_axl: Object @Alleged: USDC_axl issuer#board05141 {},
      USDC_grv: Object @Alleged: USDC_grv issuer#board00443 {},
      USDT_axl: Object @Alleged: USDT_axl issuer#board06445 {},
      USDT_grv: Object @Alleged: USDT_grv issuer#board01547 {},
      stATOM: Object @Alleged: stATOM issuer#board00689 {},
    }
```

`published.agoricNames.brand`, bilinen Markaları içerir.

```js
    {
      ATOM: Object @Alleged: ATOM brand#board05557 {},
      BLD: Object @Alleged: BLD brand#board0566 {},
      DAI_axl: Object @Alleged: DAI_axl brand#board05736 {},
      DAI_grv: Object @Alleged: DAI_grv brand#board03138 {},
      IST: Object @Alleged: IST brand#board0257 {},
      Invitation: Object @Alleged: Zoe Invitation brand#board0074 {},
      KREAdCHARACTER: Object @Alleged: KREAdCHARACTER brand#board03281 {},
      KREAdITEM: Object @Alleged: KREAdITEM brand#board00282 {},
      USDC_axl: Object @Alleged: USDC_axl brand#board03040 {},
      USDC_grv: Object @Alleged: USDC_grv brand#board04542 {},
      USDT_axl: Object @Alleged: USDT_axl brand#board01744 {},
      USDT_grv: Object @Alleged: USDT_grv brand#board03446 {},
      stATOM: Object @Alleged: stATOM brand#board00990 {},
      timer: Object @Alleged: timerBrand#board0425 {},
    }
```

`published.agoricNames.oracleBrand`, bilinen oracle markalarını içerir.

```js
    {
      ATOM: Object @Alleged: Brand#board03935 {},
      USD: Object @Alleged: Brand#board01034 {},
      stATOM: Object @Alleged: Brand#board04388 {},
    }
```

`published.agoricNames.vbankAsset`, vbank'da kayıtlı denomi gösterir.

```js
    {
// ...
      'ibc/42225F147137DDEB5FEF0F1D0A92F2AD57557AFA2C4D6F30B21E0D983001C002': {
        brand: Object @Alleged: stATOM brand#board00990 {},
        denom: 'ibc/42225F147137DDEB5FEF0F1D0A92F2AD57557AFA2C4D6F30B21E0D983001C002',
        displayInfo: {
          assetKind: 'nat',
          decimalPlaces: 6,
        },
        issuer: Object @Alleged: stATOM issuer#board00689 {},
        issuerName: 'stATOM',
        proposedName: 'stATOM',
      },
// ...
      'ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA': {
        brand: Object @Alleged: ATOM brand#board05557 {},
        denom: 'ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA',
        displayInfo: {
          assetKind: 'nat',
          decimalPlaces: 6,
        },
        issuer: Object @Alleged: ATOM issuer#board02656 {},
        issuerName: 'ATOM',
        proposedName: 'ATOM',
      },
// ...
      ubld: {
        brand: Object @Alleged: BLD brand#board0566 {},
        denom: 'ubld',
        displayInfo: {
          assetKind: 'nat',
          decimalPlaces: 6,
        },
        issuer: Object @Alleged: BLD issuer#board0592 {},
        issuerName: 'BLD',
        proposedName: 'Agoric staking token',
      },
      uist: {
        brand: Object @Alleged: IST brand#board0257 {},
        denom: 'uist',
        displayInfo: {
          assetKind: 'nat',
          decimalPlaces: 6,
        },
        issuer: Object @Alleged: IST issuer#board0223 {},
        issuerName: 'IST',
        proposedName: 'Agoric stable token',
      },
    }
```

## boardAux

`published.boardAux` altında, board ID'leriyle anahtarlar bulunur. İşte birkaç tane örnek.

```js
['board00282', 'board0074', 'board01744'];
```

Veriler, board'daki nesnelerin yan bilgilerini içerir; örneğin, markalar için displayInfo, varlık türünü içerir.

```js
    {
      board0074: {
        allegedName: 'Zoe Invitation',
        displayInfo: {
          assetKind: 'set',
        },
      },
      board01744: {
        allegedName: 'USDT_axl',
        displayInfo: {
          assetKind: 'nat',
          decimalPlaces: 6,
        },
      },
    }
```

## vstorage: provisionPool

`published.provisionPool.governance`, yönetilen parametrelerin mevcut değerlerini verir. 
Benzer verileri  içinde görebilirsiniz.

```js
    {
      current: {
        Electorate: {
          type: 'invitation',
          value: {
            brand: Object @Alleged: Zoe Invitation brand#board0074 {},
            value: [
              {
                description: 'questionPoser',
                handle: Object @Alleged: InvitationHandle#board00848 {},
                installation: Object @Alleged: BundleIDInstallation#board00613 {},
                instance: Object @Alleged: InstanceHandle#board04149 {},
              },
            ],
          },
        },
        PerAccountInitialAmount: {
          type: 'amount',
          value: {
            brand: Object @Alleged: IST brand#board0257 {},
            value: 250000n,
          },
        },
      },
    }
```

`published.provisionPool.metrics`

```js
    {
      totalMintedConverted: {
        brand: Object @Alleged: IST brand#board0257 {},
        value: 20000000n,
      },
      totalMintedProvided: {
        brand: Object @Alleged: IST brand#board0257 {},
        value: 2750000n,
      },
      walletsProvisioned: 11n,
    }
```

## vstorage: cüzdan

Her sağlanmış akıllı cüzdanın adresi, `published.wallet` altında bir anahtar olarak bulunur. İşte birkaç örnek.
Ayrıca bakınız: 

```js
[
  'agoric1890064p6j3xhzzdf8daknd6kpvhw766ds8flgw',
  'agoric1ee9hr0jyrxhy999y755mp862ljgycmwyp4pl7q',
  'agoric1enwuyn2hzyyvt39x87tk9rhlkpqtyv9haj7mgs'
];
```

`.current` altı, mevcut cüzdan durumunu içerir. Örneğin:

```js
    {
      liveOffers: [],
      offerToPublicSubscriberPaths: [],
      offerToUsedInvitation: [],
      purses: [
        {
          balance: {
            brand: Object @Alleged: Zoe Invitation brand#board0074 {},
            value: [
              {
                description: 'Voter0',
                handle: Object @Alleged: InvitationHandle#null {},
                installation: Object @Alleged: BundleIDInstallation#board00613 {},
                instance: Object @Alleged: InstanceHandle#null {},
              },
              {
                description: 'charter member invitation',
                handle: Object @Alleged: InvitationHandle#null {},
                installation: Object @Alleged: BundleIDInstallation#board01679 {},
                instance: Object @Alleged: InstanceHandle#null {},
              },
            ],
          },
          brand: Object @Alleged: Zoe Invitation brand#board0074 {},
        },
      ],
    }
```

`published.wallet.${address}` anahtarı, cüzdanın son güncellemesini içerir. Örneğin:

```js
    {
      currentAmount: {
        brand: Object @Alleged: Zoe Invitation brand#board0074 {},
        value: [
          {
            description: 'Voter0',
            handle: Object @Alleged: InvitationHandle#null {},
            installation: Object @Alleged: BundleIDInstallation#board00613 {},
            instance: Object @Alleged: InstanceHandle#null {},
          },
          {
            description: 'charter member invitation',
            handle: Object @Alleged: InvitationHandle#null {},
            installation: Object @Alleged: BundleIDInstallation#board01679 {},
            instance: Object @Alleged: InstanceHandle#null {},
          },
        ],
      },
      updated: 'balance',
    }