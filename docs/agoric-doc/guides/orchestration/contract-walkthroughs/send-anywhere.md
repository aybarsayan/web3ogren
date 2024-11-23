---
title: Send Anywhere Sözleşme Kılavuzu
---

# "Send Anywhere" Sözleşme Kılavuzu

"Send Anywhere" sözleşmesi, Agoric'in  kütüphanesini kullanarak varlıkların bir zincirden diğerine transferini kolaylaştırmak amacıyla tasarlanmıştır. Bu sözleşme, bir kullanıcının belirli bir markaya sahip varlıkları desteklenen herhangi bir blok zincirinde bir varış adresine göndermesine olanak tanır.

Sözleşmenin yüksek seviyeli akışı şöyle tanımlanabilir:

- Kaynak zincirde varlık markasını doğrular.
- Geçici tutma işlemleri için, (sözleşme tarafından tutulan) yerel bir hesabın varlığını oluşturur veya kontrol eder.
- Varlığı kaynak adresinden yerel hesaba transfer eder.
- Varış adresine, uzak blok zincirinde bulunabilecek bir transfer başlatır.
- Hataları nazikçe yönetir.

Sözleşme iki ayrı dosyada uygulanmıştır:

1. `send-anywhere.contract.js`, sözleşmenin başlatılması için `start` fonksiyonunu uygular ve `publicFacet`'i açığa çıkarır.
2. `send-anywhere.flows.js`, bir kullanıcı teklif yaptığında varlıkların gerçek transferini gerçekleştiren `sendIt` fonksiyonunu uygular.

Bu dosyaları birer birer gözden geçirelim.

## 1. `send-anywhere.contract.js`

Sözleşme, işlevselliği için gerekli olan çeşitli modüller ve yardımcı programları içe aktararak başlar. Bunlar arasında:

- **Durum Yönetimi**: `makeSharedStateRecord`, sözleşme durumunun farklı türevleri arasında oluşturulması ve yönetilmesi için içe aktarılmıştır.
- **Tip Doğrulama**: `AmountShape` ve `InvitationShape`, sözleşmenin doğru veri tipleri (miktarlar ve davetler) ile çalışmasını garanti eder.
- **Orkestration Araçları**: Orkestration işlevleri ile etkileşimleri kolaylaştırmak için `withOrchestration` içe aktarılmıştır.
- **Akışlar**: Transferleri işlemek için Orkestration akışları `send-anywhere.flows.js` dosyasından içe aktarılır ve Zoe'ye sunulur.

Bu içe aktarmalar, sözleşmenin transferlerin doğrulanması, yönetimi ve yürütülmesi için gerekli altyapıyı sağlar.

### Tekil Miktar Kaydı Doğrulaması

Her işlemde yalnızca tek bir varlığın (veya `marka`) transfer edileceğini sağlamak için bir `SingleNatAmountRecord` tanımlanmıştır:

```js
export const SingleNatAmountRecord = M.and(
  M.recordOf(M.string(), AnyNatAmountShape, {
    numPropertiesLimit: 1
  }),
  M.not(harden({}))
);
harden(SingleNatAmountRecord);
```

Bu doğrulama, kullanıcılar tarafından gönderilen teklif şeklinin tam olarak bir varlık içerdiğini ve başka hiçbir gereksiz özelliği bulunmadığını garanti eder.

### Sözleşme Durumu Kurulumu

Sözleşme, aşağıda tanımlanan bir ortak durum kaydı oluşturur:

```js
const contractState = makeSharedStateRecord(
  /** @type {{ account: OrchestrationAccount | undefined }} */ {
    localAccount: undefined
  }
);
```

Bu durum, transfer edilen varlıkların geçici olarak tutulacağı yerel hesabı izler. Durum, `localAccount`'ın tanımsız olduğu şeklinde başlar. Bu hesap, teklif işleme sürecinde gerektiğinde oluşturulacaktır.

### Günlükleme Kurulumu

Sözleşme, sözleşmenin içsel eylemlerini ve durum değişikliklerini yakalamak için bir günlükleme mekanizması (`logNode`) başlatır. Günlükler, hata ayıklamayı ve denetimi kolaylaştırmak amacıyla yeni oluşturulan bir `log` çocuğa VStorage'a yazılır.

```js
const logNode = E(privateArgs.storageNode).makeChildNode('log');

const log = msg => vowTools.watch(E(logNode).setValue(msg));
```

### Orkestration İşlevleri

Bu işlevler, `send-anywhere.flows.js` dosyasından içe aktarılmıştır ve varlık transferlerini yönetmek için ana davranışları tanımlar. Sözleşme, bu işlevleri gerekli bağlam (sözleşme durumu, günlükleme ve Zoe araçları gibi) ile sarmalar.

```js
const orchFns = orchestrateAll(flows, {
  contractState,
  log,
  zoeTools
});
```

### Kamu Yüzeyi ve Davet Oluşturma

Sözleşme, dış kullanıcıların bununla etkileşimde bulunmasını sağlayan bir kamu-odaklı API (`publicFacet`) sunar:

```js
const publicFacet = zone.exo(
  'Send PF',
  M.interface('Send PF', {
    makeSendInvitation: M.callWhen().returns(InvitationShape)
  }),
  {
    makeSendInvitation() {
      return zcf.makeInvitation(
        orchFns.sendIt,
        'send',
        undefined,
        M.splitRecord({ give: SingleNatAmountRecord })
      );
    }
  }
);
```

`makeSendInvitation` yöntemi, kullanıcıların bir teklifle transfer başlatmasını sağlayan bir davet oluşturur. Teklifin, yalnızca bir varlığın transfer edildiğini garanti etmek için `SingleNatAmountRecord` tarafından tanımlanan yapıyı eşleştirmesi gerekmektedir. Davet, varlık transferini gerçekleştiren `sendIt` fonksiyonuna (daha sonra açıklanacaktır) bağlıdır.

## 2. `send-anywhere.flows.js`

Bu akış dosyası, sözleşmeye yapılan teklifleri yöneten tek bir `sendIt` fonksiyonu tanımlar. `sendIt` fonksiyonu, transfer sürecinin merkezidir. Yerel ve uzak zincirler arasında varlıkların gerçek hareketliliğini sağlar. Bu fonksiyona geçen parametreler şunlardır:

- `orch`: Zincir/hesap etkileşimlerini yönetmek için orkestra nesnesi.
- `ctx`: Sözleşme durumu ve yardımcı işlevler, bunlar arasında:
  - `contractState`: Geçici depolama için yerel hesabı tutar.
  - `localTransfer`: Yerel hesaplar arasında varlıkları hareket ettiren transfer fonksiyonu.
- `seat`: Transfer edilecek varlıkları temsil eden Zoe koltuğu.
- `offerArgs`: Varış zinciri ve adresi hakkında detayları içerir.

`sendIt` fonksiyonu aşağıdaki önemli adımları gerçekleştirir:

### Teklif Doğrulama ve Kurulum

Bir teklifi aldığında, `sendIt` fonksiyonu:

- Doğru yapının sunulduğundan emin olmak için  kullanarak teklif argümanlarını doğrular.
- Koltuktan teklifi alır, transfer edilen varlık (`marka` ve `miktar`) bilgilerini çıkarır.
- Sözleşme, yerel zincirdeki varlık markasının kaydedildiğinden emin olmak için zincirin varlık kayıt defterini (`vbank`) sorgular. Eğer kaydedilmemişse, sözleşme bir hata fırlatır ve işlemi sonlandırır.
- Eğer sözleşme için yerel bir hesap yoksa, bir hesap oluşturur.

```js
mustMatch(offerArgs, harden({ chainName: M.scalar(), destAddr: M.string() }));
const { chainName, destAddr } = offerArgs;

const { give } = seat.getProposal();
const [[_kw, amt]] = entries(give);
void log(`sending {${amt.value}} from ${chainName} to ${destAddr}`);
const agoric = await orch.getChain('agoric');
const assets = await agoric.getVBankAssetInfo();
void log(`got info for denoms: ${assets.map(a => a.denom).join(', ')}`);
const { denom } = NonNullish(
  assets.find(a => a.brand === amt.brand),
  `${amt.brand} not registered in vbank`
);

if (!contractState.localAccount) {
  contractState.localAccount = await agoric.makeAccount();
}
```

Bu kurulum aşaması, işlemin geçerli olduğunu ve sözleşmenin bunu yönetecek şekilde hazır olduğunu garantiler.

### Varlık Transferi

Her şey doğrulandıktan sonra, sözleşme aşağıdaki adımları gerçekleştirir:

- **Yerel transfer**: Varlıklar, `localTransfer` API'sı kullanılarak, öncelikle Zoe koltuğundan sözleşmenin yerel hesabına transfer edilir.

```js
await localTransfer(seat, contractState.localAccount, give);
```

- **Uzak transfer**: Sözleşme, uzaktaki zincirde varış adresine transferi başlatır. Bu transfer, varış zinciri kimliği ve adresi gibi detayları içerir.

```js
await contractState.localAccount.transfer(
  {
    value: destAddr,
    encoding: 'bech32',
    chainId
  },
  { denom, value: amt.value }
);
```

- **Hata yönetimi**: Eğer transfer başarısız olursa, sözleşme yerel hesaptan Zoe koltuğuna varlıkları geri çekerek işlemi tersine çevirir. Ayrıntılı bir hata mesajı kaydedilir ve koltuk hata ile çıkar. Bu süreç, varlıkların güvenli bir şekilde transfer edilmesini sağlarken, başarısızlık durumunda net geri alma mekanizmaları sunar.

```js
await withdrawToSeat(contractState.localAccount, seat, give);
const errorMsg = `IBC Transfer failed ${q(e)}`;
void log(`ERROR: ${errorMsg}`);
seat.exit(errorMsg);
throw makeError(errorMsg);
```

## Sonuç

"Send Anywhere" sözleşmesi, blok zincirleri arasında varlık transferi için sağlam ve esnek bir çözümdür. Bu sözleşme, aşağıdaki unsurları garanti eder:

- Varlıklar, transfer edilmeden önce yerel bir hesapta güvenli bir şekilde tutulur.
- Şeffaflık ve hata izleme için ayrıntılı günlükler tutulur.
- Sözleşme, başarısızlıklara karşı dayanıklıdır ve yerleşik geri alma mekanizmalarına sahiptir.
- Agoric’in Orkestration araçlarını kullanarak, bu sözleşme çapraz zincir varlık transferlerini kolaylaştırmak için güvenli bir yöntem sunar.