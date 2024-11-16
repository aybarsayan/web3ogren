---
title: WalletBridge API Komutları
---

# WalletBridge API Komutları

Bu yöntemler, cüzdanın bütünlüğünü ihlal etmeden güvensiz bir Dapp tarafından kullanılabilir. Ayrıca, Dapp UI'nın bir Cüzdana erişmek için kullanabileceği iframe/WebSocket köprüsü aracılığıyla da erişime açıktır.

### `addOffer(offer)`

- `offer` `{OfferState}`
- Döner: `{Promise}`

Cüzdana bir teklif ekler ve teklifin cüzdandaki benzersiz özel kimliğini döner. Bu kimlik, Board'da saklanmaz.

### `addOfferInvitation(offer, invitation)`

- `offer` `{OfferState}`
- `invitation` `{ERef}`
- Döner: `{Promise}`

Belirtilen teklife belirtilen davetiye ekler ve teklifin cüzdandaki özel kimliğini döner.  
Bu kimlik, Board'da saklanmaz.

### `getDepositFacetId(brandBoardId)`

- `brandBoardId` `{string}`
- Döner: `{Promise}`

Belirtilen markaya ait ödemeleri almak için kullanılacak Board Kimliğini döner.

### `getPursesNotifier()`

- Döner: `{Promise>>}`

Cüzdandaki çantaların değişikliklerini takip eden bir bildirimci döner.

### `getOffersNotifier()`

- Döner: `{Promise>>}`

Cüzdana gelen tekliflerdeki değişiklikleri takip eden bir bildirimci döner.

### `suggestIssuer(petname, issuerBoardId)`

- `petname` `{Petname}`
- `issuerBoardId` `{string}`
- Döner: `void`

Cüzdana önerilen bir petname ile bir ERTP sağlayıcısı önerir.

### `suggestInstallation(petname, installationBoardID)`

- `petname` `{Petname}`
- `installationBoardId` `{string}`
- Döner: `void`

Cüzdana önerilen bir petname ile bir Zoe sözleşme kurulumu önerir.

### `suggestInstance(petname, instanceBoardId)`

- `petname` `{Petname}`
- `instanceBoardId` `{string}`
- Döner: `void`

Cüzdana önerilen bir petname ile bir Zoe sözleşme örneği önerir.