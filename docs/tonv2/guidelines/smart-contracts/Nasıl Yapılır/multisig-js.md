---
description: Bu kılavuzun sonunda çok imzalı cüzdanı dağıtacak ve ton kütüphanesini kullanarak bazı işlemler göndereceksiniz
---

# TypeScript kullanarak çok imzalı cüzdanlarla etkileşim

## Giriş
TON'da çok imzalı cüzdanın ne olduğunu bilmiyorsanız, `buradan` kontrol edebilirsiniz.

Bu adımları takip ederek şunları öğrenmiş olacaksınız:

- Çok imzalı cüzdan oluşturma ve dağıtma
- O cüzdan ile işlemler oluşturma, imzalama ve gönderme

:::info
Bir TypeScript projesi oluşturacağız ve öncelikle [ton](https://www.npmjs.com/package/ton) kütüphanesini kullanacağız, bu nedenle önce bunu kurmanız gerekiyor. Ayrıca [ton-access](https://www.orbs.com/ton-access/) kütüphanesini de kullanacağız:
:::

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

Bu kılavuzun tam kodu buradan mevcuttur:
- https://github.com/Gusarich/multisig-ts-example

## Çok imzalı cüzdan oluşturma ve dağıtma
Bir kaynak dosyası oluşturalım, örneğin `main.ts`. Bunu tercih ettiğiniz kod düzenleyicisinde açın ve bu kılavuza uymaya başlayın!

Öncelikle tüm önemli bileşenleri içe aktarmamız gerekiyor:

```js
import { Address, beginCell, MessageRelaxed, toNano, TonClient, WalletContractV4, MultisigWallet, MultisigOrder, MultisigOrderBuilder } from "ton";
import { KeyPair, mnemonicToPrivateKey } from 'ton-crypto';
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

`TonClient` örneğini oluşturun:

```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```

Çalışmak için anahtar çiftlerine ihtiyacımız var:

```js
let keyPairs: KeyPair[] = [];

let mnemonics[] = [
    ['orbit', 'feature', ...], // bu 24 kelimelik tohum ifadesi olmalı
    ['sing', 'pattern', ...],
    ['piece', 'deputy', ...],
    ['toss', 'shadow', ...],
    ['guard', 'nurse', ...]
];

for (let i = 0; i < mnemonics.length; i++) keyPairs[i] = await mnemonicToPrivateKey(mnemonics[i]);
```

`MultisigWallet` nesnesini oluşturmanın iki yolu vardır:

1. Adresten mevcut olanı içe aktarma:

   ```js
   let addr: Address = Address.parse('EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE');
   let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
   ```

2. Yenisini oluşturma:

   ```js
   let mw: MultisigWallet = new MultisigWallet([keyPairs[0].publicKey, keyPairs[1].publicKey], 0, 0, 1, { client });
   ```

Dağıtımın iki yolu da vardır:

- İç mesaj yoluyla:

   ```js
   let wallet: WalletContractV4 = WalletContractV4.create({ workchain: 0, publicKey: keyPairs[4].publicKey });
   // cüzdan etkin olmalı ve biraz bakiyesi olmalı
   await mw.deployInternal(wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey), toNano('0.05'));
   ```

- Dış mesaj yoluyla:

   ```js
   await mw.deployExternal();
   ```

## Bir sipariş oluşturma, imzalama ve gönderme
Yeni bir sipariş oluşturmak için bir `MultisigOrderBuilder` nesnesine ihtiyacımız var:

```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```

Sonra ona bazı mesajlar ekleyebiliriz.

```js
let msg: MessageRelaxed = {
    body: beginCell().storeUint(0, 32).storeBuffer(Buffer.from('Merhaba, dünya!')).endCell(),
    info: {
        bounce: true,
        bounced: false,
        createdAt: 0,
        createdLt: 0n,
        dest: Address.parse('EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx'),
        forwardFee: 0n,
        ihrDisabled: true,
        ihrFee: 0n,
        type: "internal",
        value: { coins: toNano('0.01') }
    }
};

order1.addMessage(msg, 3);
```

Mesajları eklemeyi tamamladıktan sonra, `MultisigOrderBuilder`'ı `MultisigOrder`'a dönüştürmek için `build()` yöntemini çağırın:

```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```

Şimdi başka bir sipariş oluşturalım, ona bir mesaj ekleyelim, başka bir anahtar kümesiyle imzalayalım ve bu siparişlerin imzalarını birleştirelim:

```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); // Şimdi order1b de order2b'den tüm imzalara sahip
```

Ve son olarak, imzalı siparişi gönderelim:

```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

:::tip
Şimdi projeyi derleyin
```bash
yarn tsc
```

Ve derlenmiş dosyayı çalıştırın
```bash
node main.js
```

Eğer herhangi bir hata almazsanız, her şeyi doğru yaptınız! Şimdi işleminizin herhangi bir gözlemci veya cüzdan ile başarılı olup olmadığını kontrol edin.
:::

## Diğer yöntemler ve özellikler
`MultisigOrderBuilder` nesnelerinden mesajları kolayca temizleyebilirsiniz:

```js
order2.clearMessages();
```

Ayrıca `MultisigOrder` nesnelerinden imzaları temizleyebilirsiniz:

```js
order2b.clearSignatures();
```

Ve elbette `MultisigWallet`, `MultisigOrderBuilder` ve `MultisigOrder` nesnelerinden kamuya açık özellikleri alabilirsiniz:

- **MultisigWallet:**
    - `owners` - imzalar için `Dictionary<number, Buffer>` *ownerId => signature*
    - `workchain` - cüzdanın dağıtıldığı iş zinciri
    - `walletId` - cüzdan kimliği
    - `k` - bir işlemi onaylamak için gerekli imza sayısı
    - `address` - cüzdan adresi
    - `provider` - `ContractProvider` örneği

- **MultisigOrderBuilder:**
    - `messages` - sipariş için eklenmesi gereken `MessageWithMode` dizisi
    - `queryId` - siparişin geçerli olduğu global süre

- **MultisigOrder:**
    - `payload` - sipariş yükü ile `Cell`
    - `signatures` - imzalar için `Dictionary` *ownerId => signature*

## Referanslar
- `Düşük seviyeli çok imzalı kılavuz`
- [ton.js Belgeleri](https://ton-community.github.io/ton/)
- [Çok imzalı sözleşme kaynakları](https://github.com/ton-blockchain/multisig-contract)