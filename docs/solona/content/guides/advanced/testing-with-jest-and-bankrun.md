---
featured: false
date: 2024-08-08T00:00:00Z
difficulty: intermediate
title: "Jest ve Bankrun ile Solana program testlerini hızlandırın"
description:
  "Programları test etmek önemlidir. Bankrun, Solana programlarını test etmek için
  yerel doğrulayıcıya hafif bir alternatif sunar ve özel hesap verileri ile zaman
  yolculuğu gibi özellikleri etkinleştirir. Bankrun kullanarak testler 10 kat
  daha hızlı olabilir."
tags:
  - typescript
  - testing
keywords:
  - tutorial
  - testing
  - bankrun
  - jest
  - solana geliştirme başlangıcı
  - blockchain geliştirici
  - blockchain eğitimi
  - web3 geliştirici
---

Solana programlarınızı test etmek, programınızın beklenildiği gibi çalıştığından emin
olmak ve geliştirme sürecinizi hızlandırmak açısından kritik bir adımdır. Bu kılavuz,
Solana programlarınızı test etmenin yollarını gösterir [Bankrun](https://kevinheavey.github.io/solana-bankrun/) kullanarak, Solana programları için süper hızlı bir test koşucusu.

Çoğu Solana testi, test yazmak için [Mocha framework'ünü](https://mochajs.org/) ve
beyazlatmalar için [Chai'i](https://www.chaijs.com/) kullanır. Ancak, kendinize
rahat hissettiğiniz herhangi bir test çerçevesini kullanabilirsiniz. Bu kılavuzda
[Jest](https://jestjs.io/) ve [Bankrun](https://kevinheavey.github.io/solana-bankrun/) üzerinde duracağız. Bankrun ile, testlerinizi nerdeyse **10 kat hızlandırabilir**, program zamanını değiştirme yeteneği kazanabilir ve özel hesap verileri yazabilirsiniz.

## Hazır Ayarlar

Solana programlarınız için temel bir test ortamı oluşturacak birkaç hazır ayar vardır.
Bu hazır ayarlar örneğin:

```bash
npx create-solana-dapp my-dapp
```

`create-solana-dapp`, bir Next.js veya React istemcisi, Tailwind UI Kütüphanesi ve
basit bir Anchor programı içeren bir Solana web projesi oluşturur. Testler Jest ile
yazılmıştır ve `anchor test` komutu ile çalıştırılabilir.

```bash
npx create-solana-game my-game
```

`create-solana-game`, [Jest](https://jestjs.io/), [Mocha](https://mochajs.org/)
ve [Bankrun](https://kevinheavey.github.io/solana-bankrun/) testlerini içeren bir
Solana oyun projesi oluşturur ve Solana Cüzdan adaptörü kullanarak bir NextJS uygulaması
ve ek bir Unity Oyun motoru istemcisi içerir. Mocha ve Bankrun testleri, `anchor test`
komutu ile çalıştırılabilir.

[Solana Program Örnekleri](https://github.com/solana-developers/program-examples) içinde
birçok test örneği de bulabilirsiniz.

---

## Anchor testi

Anchor çerçevesini kullanarak, `anchor.toml` dosyası içindeki önceden yapılandırılmış
`test` komutunu çalıştırmak için `anchor test` komutunu kullanabilirsiniz.

```toml filename="Anchor.toml"
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

Bu, `ts-mocha` komutunu 1.000.000 milisaniye zaman aşımı ile tests dizinindeki testleri çalıştırır.

Anchor burada, yerel bir doğrulayıcıyı başlatır, programınızı anchor çalışma alanınızdan dağıtır ve `Anchor.toml` dosyasındaki tanımlı ağa karşı testleri çalıştırır.

:::tip
Testler tamamlandıktan sonra doğrulayıcının çalışmaya devam etmesini sağlamak için `anchor test --detach` komutunu da çalıştırabilirsiniz; bu, [Solana Explorer](https://explorer.solana.com/?cluster=custom) üzerindeki işlemlerinizi gözlemlemenizi sağlar.
:::

`anchor.toml` dosyasında kendi test komutunuzu da tanımlayabilirsiniz. Örneğin, önce
yerel doğrulayıcıya karşı mocha testlerini çalıştırabilir ve daha sonra bunları `&&`
kullanarak bankrun ile jest testlerini çalıştırabilirsiniz:

```toml filename="Anchor.toml"
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts && yarn run jest"
```

Bu, önce mocha testlerini çalıştırır ve sonra jest testlerini çalıştırır.

Kendi test komutunuzu da tanımlayabilirsiniz. Örneğin:

```toml filename="Anchor.toml"
super_test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 only_super_test.ts"
jest_tests = "yarn test"
```

Bunları şu şekilde çalıştırabilirsiniz:

```bash
anchor run super_test
anchor run jest_tests
```

:::warning
Ancak bu durumda, anchor sizin için yerel bir doğrulayıcı başlatmaz. Programınızı
yerel kümenize dağıtmanız veya bunları bir genel test ağında çalıştırmanız gerekecek. Ayrıca Anchor ortam değişkenleri, örneğin `yarn test` ile testleri çalıştırırken değil, yalnızca `anchor test` komutları aracılığıyla çalıştırıldığında mevcut olacaktır.
:::

---

## Mocha'dan Jest'e Geçiş

Bu bölümde [Mocha'dan](https://mochajs.org/) [Jest'e](https://jestjs.io/) geçmeyi
öğreneceğiz. Jest, Mocha ile benzer bir JavaScript test çerçevesidir. Artık Chai kullanmanıza
gerek yok, çünkü entegre bir test koşucusu ve test çalıştırıcısı vardır.

Öncelikle Jest'i kurmalısınız:

```bash
yarn add --dev jest
```

Sonra `package.json` dosyanıza yeni bir komut eklemelisiniz:

```json filename="package.json"
{
  "scripts": {
    "test": "jest"
  }
}
```

Sonra testleri şu şekilde çalıştırabilirsiniz:

```bash
yarn test
```

Testlerimizi TypeScript ile çalıştırmak istediğimiz için `ts-jest` paketini kurmamız ve
bir Jest yapılandırma dosyası oluşturmamız gerekiyor:

```bash
yarn add --dev ts-jest @jest/globals @types/jest
yarn ts-jest config:init
```

Bu, projenizde bir `jest.config.js` dosyası oluşturacak. Şimdi `Anchor.toml` dosyanızı
Jest testlerini çalıştıracak şekilde güncelleyebilirsiniz:

```toml filename="Anchor.toml"
test = "yarn test"
```

### Jest Hata Giderme

1. `SyntaxError: Cannot use import statement outside a module`  
   hatası alıyorsanız, ya jest yapılandırmasını oluşturmadınız ya da
   `jest.config.js` dosyanıza aşağıdakileri eklemeniz gerekiyor:

```js filename="jest.config.js"
module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
```

2. Yerel doğrulayıcıya karşı test çalıştırmak biraz zaman alabileceğinden,
   test tamamlandıktan sonra kayıt yapmayı başaramadığınız bir hata
   alıyorsanız, test süresi dolmuş olabilir. Mocha'dan farklı olarak, Jest'in
   varsayılan bir zaman aşımı yoktur. `jest.config.js` dosyanızda bir zaman aşımı
   ayarlayabilirsiniz:

```js filename="jest.config.js"
module.exports = {
  testTimeout: 10000,
};
```

Herhangi bir test için bir zaman aşımı da ayarlayabilirsiniz:

```js filename="your.test.js"
test("test adı", async () => {
  // test kodunuz
}, 10000);
```

3. Eğer "Anchor ortam değişkenleri eksik" hatası alıyorsanız, muhtemelen
   testleri `anchor test` ya da `anchor run test` ile çalıştırmadan
   AnchorProvider'ı kullanmaya çalışıyorsunuz. Anchor.toml dosyanızı güncelleyerek
   Jest testlerini `yarn test` ile çalıştırarak tüm ortam değişkenlerinin ayarlandığı
   anchor ortamında çalıştırın.

---

## Bankrun

`solana-test-validator` kullanmak yerine,
[Solana Bankrun](https://kevinheavey.github.io/solana-bankrun/) kullanabilirsiniz.
Bu, yerel doğrulayıcıya benzer şekilde çalışır ancak daha hafif ve daha hızlıdır. Özel
hesap verileri yazma ve zaman yolculuğu gibi bazı çok faydalı özellikler sunar,
bu da zaman tabanlı programları ve belirli hesap verilerine dayalı programları test
etmeyi oldukça kolaylaştırır.

Bankrun ve Bankrun Anchor kullanmak için `package.json` dosyanıza eklemeniz gerekir:

```bash
yarn add solana-bankrun anchor-bankrun
```

Mocha Anchor testinden [Bankrun Anchor](https://github.com/kevinheavey/anchor-bankrun) testine geçmek için, yalnızca sağlayıcıyı
[`BankrunProvider`](https://kevinheavey.github.io/solana-bankrun/tutorial/#anchor-integration) olarak değiştirmeniz ve
her bir test dosyanızda `startAnchor` kullanarak bir bağlam oluşturmanız gerekir:

```js filename="my-test.test.ts" /startAnchor/
// ... buraya ithalat ekleyin
describe('Testim', () => {
  test('Sayacı ayır ve tx\'i artır', async () => {
    const context = await startAnchor(".", [], []);
    const client = context.banksClient;

    const provider = new BankrunProvider(context);
    anchor.setProvider(provider);

    // ... test mantığı
  });
});
```

`startAnchor`, programınızı Anchor çalışma alanınızdan Bankrun bankasına otomatik olarak ekleyecektir. Ayrıca `startAnchor` işlevine geçerek ek hesaplar ve
programlar [ekleyebilirsiniz](https://kevinheavey.github.io/solana-bankrun/tutorial/#writing-arbitrary-accounts). Ancak yerel doğrulayıcıya karşı testleri çalıştırmaktan farklı olan birkaç durum vardır; bunları bir sonraki bölümde ele alacağız.

### Bankrun'ın Yerel Doğrulayıcıya Göre Farklılıkları

Bankrun, işlemleri işlemek ve hesapları yönetmek için bir BanksServer (daha basitleştirilmiş bir [Solana birçoklar](https://github.com/solana-labs/solana/blob/master/runtime/src/bank.rs)
ve bir BanksClient kullanarak Solana ağını simüle eder; zaman manipülasyonu ve
dinamik hesap verisi ayarlama gibi gelişmiş test özelliklerini etkinleştirir. 
`solana-test-validator`'dan farklı olarak, bankrun, ağ durumu yerel bir örneğine
karşı çalışarak verimli test etmeyi sağlar. İşlemler için davranış oldukça benzer, ancak yerel doğrulayıcı ile bazı farklılıklar vardır:

#### Airdrop

- Bankrun, Airdrop'ları desteklemez. BankrunProvider'da kullanılan standart imzalayıcı
  otomatik olarak bazı Sol ile fonlandırılacaktır. Eğer başka bir fonlanmış hesaba
  ihtiyacınız varsa, `startAnchor` işlevine ek bir hesap geçerek bir tane oluşturabilirsiniz.

```js
let secondKeypair: Keypair = new anchor.web3.Keypair();

context = await startAnchor(
    "",[],
    [
    {
        address: secondKeypair.publicKey,
        info: {
        lamports: 1_000_000_000, // 1 SOL eşdeğeri
        data: Buffer.alloc(0),
        owner: SYSTEM_PROGRAM_ID,
        executable: false,
        },
    },
    ]
);
provider = new BankrunProvider(context);
```

#### İşlemleri Onaylama

Bankrun doğrudan bank üzerinde çalıştığı için işlemlerinizi onaylamanız
gerekmez. Yani `connection.confirmTransaction()` işlevi mevcut olmayacaktır.
Bunu geçebilirsiniz.

#### Hesap Verilerini Alma

`connection.getAccount` kullanarak hesap verilerine erişmeye devam edebilirsiniz,
ancak bankrun çerçevesinde tercih edilen yöntem `client.getAccount` kullanarak dönen
bir `Promise` almanızdır. Bu yöntem, test çerçevesinin tasarımına daha iyi
uyan bir yöntemi yansıtır. Ancak, Solana kod tabanınızdaki hesapların nasıl alındığı konusunda tutarlılık istiyorsanız, `connection.getAccount` kullanmaya devam edebilirsiniz. 
Belirli durumunuza en iyi şekilde uyan yöntemi seçin.

```js
await client.getAccount(playerPDA).then(info => {
  const decoded = program.coder.accounts.decode(
    "playerData",
    Buffer.from(info.data),
  );
  console.log("Oyuncu hesap bilgisi", JSON.stringify(decoded));
  expect(decoded).toBeDefined();
  expect(parseInt(decoded.energy)).toEqual(99);
});
```

#### Başka Bir Anahtar Çifti ile İşlemleri İmzalama

Varsayılan olarak `program.function.rpc()` kullanıldığında, işlem otomatik olarak
`provider.wallet` anahtar çifti ile imzalanır. İşlemi başka bir anahtar çiftiyle
imzalamak istiyorsanız, ikinci bir sağlayıcı oluşturabilir ve ardından başka
bir anahtar çifti ile imzalamak için bunu kullanabilirsiniz.

```js
let secondKeypair: Keypair = new anchor.web3.Keypair();

let context = await startAnchor(
  "",[],
  [
    {
        address: secondKeypair.publicKey,
        info: {
        lamports: 1_000_000_000,
        data: Buffer.alloc(0),
        owner: SYSTEM_PROGRAM_ID,
        executable: false,
        },
    },
  ]
);
beneficiaryProvider = new BankrunProvider(context);
beneficiaryProvider.wallet = new NodeWallet(secondKeypair);

secondProgram = new Program<Vesting>(IDL as Vesting, beneficiaryProvider);
```

### Yerel Programlar için Bankrun Kullanma

Ayrıca Bankrun'ı `yerel programlar` için de
kullanabilirsiniz. Ana fark, Bankrun bankasını başlatmak için `startAnchor` yerine
`start` kullanmanızdır. Daha sonra bankayla etkileşimde bulunmak için `client`'i
kullanabilirsiniz.

```js
const context = await start(
  [{ name: "counter_solana_native", programId: PROGRAM_ID }],
  [],
);
const client = context.banksClient;
```

`program.instruction().rpc()` yerine `await client.processTransaction(tx)` kullanabilirsiniz.

Solana program örneklerinde bir [tam yerel Bankrun örneği](https://github.com/solana-developers/program-examples/blob/main/basics/counter/native/tests/counter.test.ts) bulabilirsiniz.

---

### Bankrun Hata Giderme

1. Bankrun kullanarak bir işlem gönderirken `Unknown action 'undefined'` hatası
   alıyorsanız, muhtemelen aynı blok hash'ine sahip iki kimliksiz işlem göndermeye
   çalışıyorsunuz. İkinci işlemi göndermeden önce yeni bir güncel blok hash alın veya
   talimatlarınıza farklı işlem hash'lerine neden olacak bir tohum ya da parametre ekleyin.

2. `Clock handle timeout` hatası alırsanız, sadece terminalinizi yeniden başlatın ve
   testleri tekrar çalıştırın.