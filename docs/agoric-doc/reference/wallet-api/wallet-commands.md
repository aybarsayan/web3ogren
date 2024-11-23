---
title: Cüzdan API Komutları
---

# Cüzdan API Komutları

### `getBridge()`

- **Döndürür:** `{Promise}`

Cüzdan köprüsünü döndürerek Dapp yetkilendirmesini atlar. Bu, `getScopedBridge` çağrısı yapmadan CüzdanBridge API'sini kullanmak isteyen REPL veya dağıtım betikleri içinde kullanılmalıdır. REPL ve dağıtım betikleriniz zaten ag-solo'nun tam yetkisi altında çalıştığı için, daha kısıtlı bir köprü kullanmanın pek bir farkı yoktur.

### `getScopedBridge(suggestedDappPetname, dappOrigin)`

- `suggestedDappPetname` `{Petname}`
- `dappOrigin` `{String}`
- **Döndürür:** `{Promise}`

Cüzdan UI'sinde onaylanması gereken bir kökene karşılık gelen bir cüzdan köprüsü döndürür. Bu, standart wallet-bridge.html üzerinde mevcut olan temel API'yi sağlamak için tamamen sağlanmıştır.

### `addPayment(payment)`

- `payment` `{ERef}`
- **Döndürür:** `void`

Kullanıcı tarafından belirtilen çantaya, ya otomatik depozito ya da manuel onay ile bir ödeme ekler.

### `getDepositFacetId(brandBoardId)`

- `brandBoardId` `{String}`
- **Döndürür:** `{Promise}`

`brandBoardId` parametresi ile belirtilen markanın ödemelerini kabul eden kullanıcının Cüzdanı için depozito yüzünün tahta kimliğini döndürür.

### `getIssuers()`

- **Döndürür:** `{Array}`

Bu Cüzdanla ilişkili olan tüm İhracatçıları ve pet isimlerini içeren bir dizi döndürür.

### `getIssuer(petname)`

- `petname` `{Petname}`
- **Döndürür:** `{Issuer}`

Bu Cüzdanla ilişkili belirtilen pet ismine sahip ihracatçıyı döndürür.

### `getPurses()`

- **Döndürür:** `{Array}`

Bu cüzdanla ilişkili tüm çantaları döndürür.

### `getPurse(pursePetname)`

- `pursePetName` `{String}`
- **Döndürür:** `{Purse}`
- **Hatalar:** Verilen pet ismine sahip bir çanta yoksa hata fırlatır.

Belirtilen pet ismine sahip `purse` nesnesini döndürür.