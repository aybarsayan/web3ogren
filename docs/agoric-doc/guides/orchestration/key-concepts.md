---
title: Orkestrasyon Ana Kavramlar ve API'leri
---

# Orkestrasyon Ana Kavramlar ve API'leri

Bu belge, Orkestrasyon akıllı sözleşmeleri oluşturma sürecinde yer alan temel kavramların bir özetini sağlar; 
Odak noktası Orkestratör Arayüzü, Orkestrasyon Hesapları ve ChainHub'dur.

## Orkestratör Arayüzü

 arayüzü, yerel ve uzak zincirlerle etkileşim
ve yönetim için bir dizi yüksek seviyeli yöntem sunar. Aşağıda ana yöntemler verilmiştir:

### Zincir Nesnesine Erişim

- `getChain`, verilen `chainName` için bir zincir nesnesi alır ve zincire özgü yöntemlere erişim sağlar.  bölümüne bakın.

```js
const chain = await orchestrator.getChain('chainName');
```

### Marka Yardımcı Fonksiyonları

- `getBrandInfo`, bir `denom` hakkında, denomun tutulduğu zincir, ilgili yerel Marka ve ilgili varlığı çıkaran zincir de dahil olmak üzere bilgi döndürür.  bölümüne bakın.

```js
const brandInfo = orchestrator.getBrandInfo('denom');
```

- `asAmount`, bir denom miktarını bir marka ile `Amount` şeklinde dönüştürür.  bölümüne bakın.

```js
const amount = orchestrator.asAmount({ denom: 'uatom', value: 1000n });
```

## Orkestrasyon Hesabı

Orkestrasyon hesapları Agoric Orkestrasyon API'sindeki temel bir kavramdır ve  arayüzüyle temsil edilir. Bu hesaplar, uzaktaki zincirlerde hesap yönetimi için yüksek seviyeli işlemler sağlar ve zincirler arası hesapların sorunsuz bir şekilde etkileşim ve yönetimini mümkün kılar. Orkestrasyon hesapları, zincirler arası etkileşimlerin karmaşıklığını soyutlayarak geliştiricilerin kullanması için tutarlı ve basitleştirilmiş bir arayüz sunar.

### Hesap Oluşturma

- `makeAccount` (bir zincir nesnesi için) aşağıdaki gibi yerel ve/veya uzak zincirde yeni bir hesap oluşturur.

```js
const [agoric, remoteChain] = await Promise.all([
  orch.getChain('agoric'),
  orch.getChain(chainName)
]);
const [localAccount, remoteAccount] = await Promise.all([
  agoric.makeAccount(),
  remoteChain.makeAccount()
]);
```

### Adres Yönetimi

- `getAddress`, uzaktaki zincirdeki hesabın adresini alır.

```js
const address = await orchestrationAccount.getAddress();
```

### Bakiyeleri Yönetme

- `getBalances`, hesapta bulunan her bir bakiye için bir miktar dizisi döndürür.
- `getBalance`, hesap için belirli bir denomun bakiyesini alır.

```js
const balances = await orchestrationAccount.getBalances();
const balance = await orchestrationAccount.getBalance('uatom');
```

### Fon Transferi

- `send`, aynı zincirdeki başka bir hesaba bir miktar gönderir.
- `transfer`, diğer bir hesap, genellikle başka bir zincirde bulunan bir hesaba bir miktar gönderir.
- `transferSteps`, karmaşık transfer yollarını yöneterek bir miktarı birden fazla adımda transfer eder.
- `deposit`, Zoe'den hesaba ödeme yatırır. Uzak hesaplar için burada fonları aktarmak amacıyla bir IBC Transferi gerçekleştirilir.

```js
await orchestrationAccount.send(receiverAddress, amount);
await orchestrationAccount.transfer(amount, destinationAddress);
await orchestrationAccount.transferSteps(amount, transferMsg);
await orchestrationAccount.deposit(payment);
```

## ChainHub

ChainHub, zincirleri, bağlantıları ve denomları merkezi olarak kaydeden bir sistemdir; böylece birden fazla zincirle etkileşimde bulunmayı kolaylaştırır ve Orkestrasyon mantığının çapraz zincir operasyonlarını yönetmesini sağlamak için birleştirilmiş bir arayüz sunar. `makeChainHub` çağrısıyla oluşturulan bir chainHub örneği, yeni bir ChainHub oluşturur (veya bir  sağlanmadıysa yığın üzerinde). Ortaya çıkan nesne, bir  singleton'ıdır. Hiçbir değerli durumu yoktur. Tek durumu `agoricNames`'e ve kayıt çağrılarında sağlanan bilgilere yönelik sorguların önbelleğidir. Daha yeni bir versiyona ihtiyaç duyduğunuzda, basitçe bir hub oluşturabilir ve kayıtları tekrarlayabilirsiniz. ChainHub, zincir ve bağlantı bilgilerini dinamik kaydetme ve kullanma yeteneği sağlar:

### Kayıt API'leri

- `registerChain`, `chainHub` ile yeni bir zincir kaydeder. İsim, iyi bilinen zincir isimlerindeki bir adı geçersiz kılacaktır.
- `registerConnection`, iki belirli zincir kimliği arasında bir bağlantı kaydeder.
- `registerAsset`, çıkaran zincir dışındaki bir zincirde tutulabilecek bir varlığı kaydeder. Bu çağrıdan önce her iki karşılık gelen zincirin de kaydedilmiş olması gerekmektedir.

### Bilgi Alma

- `getChainInfo`, zincir bilgilerini almak için bir zincir adı alır.
- `getConnectionInfo`, iki belirli zincir kimliği için `Vow` döndürür.
- `getChainsAndConnection`, ana ve karşı zincir adları verildiğinde zincir ve bağlantı bilgilerini almak için kullanılır.
- `getAsset`, bir denom için tutulan, çıkaran zincir adlarını vb. alır.
- `getDenom`, bir `Brand` için denom (string) alır.

Aşağıdaki örnekte, `chainHub` yeni bir zinciri kaydetmek ve Agoric zinciri ile yeni kaydedilen zincir arasında bir bağlantı kurmak için kullanılır.

```js
const chainHub = makeChainHub(privateArgs.agoricNames, vowTools);

// Yeni bir zinciri bilgileriyle kaydet
chainHub.registerChain(chainKey, chainInfo);

// Agoric zinciri ile yeni zincir arasında bir bağlantı kaydet
chainHub.registerConnection(
  agoricChainInfo.chainId,
  chainInfo.chainId,
  connectionInfo
);