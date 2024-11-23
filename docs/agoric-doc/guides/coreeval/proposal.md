---
id: contract-deploy-core-eval-script
title: Bir Kontratı Yayınlamak için Temel Değerlendirme Scripti Yazma
---

# Bir Kontratı Yayınlamak için Temel Değerlendirme Scripti Yazma

Bir temel değerlendirme scripti değerlendirildiğinde, tamamlanma değeri bir fonksiyon olması beklenir. Bu fonksiyon, sözleşmeleri yaymak için yararlı çeşitli yeteneklere sahip bir _BootstrapPowers_ nesnesi ile çağrılır.

Örneğin,  projesinde, konser biletlerini satmak için bir kontrat bulunmaktadır. Bu kontratı yaymak için:

- Kontrat paketini Zoe kurulum olarak yükleyin
- Kontrat örneğini başlatın ve şartlar için fiyat miktarları oluşturmak üzere **IST** markasını kullanın
- Kurulumu ve örneği **sellConcertTickets** adı altında  isim servisinde yayımlayın
- **Ticket** vericisini ve markasını **agoricNames** **verici** ve **marka** bölümlerinde yayımlayın.

Bazı ön koşullardan sonra...

::: details imports, makeTerms vb.

```js
// @ts-check
import { allValues } from './objectTools.js';
import {
  AmountMath,
  installContract,
  startContract
} from './platform-goals/start-contract.js';

const { Fail } = assert;
const IST_UNIT = 1_000_000n;

export const makeInventory = (brand, baseUnit) => {
  return {
    frontRow: {
      tradePrice: AmountMath.make(brand, baseUnit * 3n),
      maxTickets: 3n
    },
    middleRow: {
      tradePrice: AmountMath.make(brand, baseUnit * 2n),
      maxTickets: 3n
    },
    lastRow: {
      tradePrice: AmountMath.make(brand, baseUnit * 1n),
      maxTickets: 3n
    }
  };
};

export const makeTerms = (brand, baseUnit) => {
  return {
    inventory: makeInventory(brand, baseUnit)
  };
};

/**
 * @typedef {{
 *   brand: PromiseSpaceOf;
 *   issuer: PromiseSpaceOf;
 *   instance: PromiseSpaceOf
 * }} SellTicketsSpace
 */
```

:::

... kontratın yayılmasını sağlayan fonksiyon `startSellConcertTicketsContract`:

```js
const contractName = 'sellConcertTickets';

/**
 * Kontratı başlatmak için temel değerlendirme scripti
 *
 * @param {BootstrapPowers} permittedPowers
 * @param {*} config
 */
export const startSellConcertTicketsContract = async (powers, config) => {
  console.log('core eval for', contractName);
  const {
    // çağıran tarafından tedarik edilmeli veya şablon ile değiştirilmiş olmalı
    bundleID = Fail`no bundleID`
  } = config?.options?.[contractName] ?? {};

  const installation = await installContract(powers, {
    name: contractName,
    bundleID
  });

  const ist = await allValues({
    brand: powers.brand.consume.IST,
    issuer: powers.issuer.consume.IST
  });

  const terms = makeTerms(ist.brand, 1n * IST_UNIT);

  await startContract(powers, {
    name: contractName,
    startArgs: {
      installation,
      issuerKeywordRecord: { Price: ist.issuer },
      terms
    },
    issuerNames: ['Ticket']
  });

  console.log(contractName, '(re)started');
};
```

Bir `BootstrapPowers` nesnesi, bir dizi _promise alanı_ içerir. Bir promise alanı `{ produce, consume }` çiftinden oluşur ve

- `consume[name]`, belirli bir isimle ilişkili bir vaadi temsil eder.
- `produce[name].resolve(value)`, aynı isimle ilişkili olan vaadi, bir değer sağlayarak çözümleyen bir işlevdir.

En üstte bir tane alan bulunmaktadır, böylece `powers.consume.zoe`, Zoe Servisi için bir vaattir. _Bu vaat, sanal makinenin çalıştırılmasının erken aşamalarında çözümlenmiştir._

Bir seviye daha aşağıda birçok ek promise alanı bulunmaktadır, bunlar arasinda:

- `powers.installation`
- `powers.instance`
- `powers.issuer`
- `powers.brand`

`installContract` yardımcı işlevi, `E(zoe).installBundleID(bundleID)` çağrısı yaparak `Installation` oluşturur; bu, daha önceki  tartışmamıza benzer. Ayrıca, `powers.installation[name].resolve(installation)` çağrısını da yapar.

```js
/**
 * Belirtilen bir bundleID ve izin verilen bir isim ile, bir paketi yükleyin ve "üretin"
 * yüklemeyi, ayrıca bunu agoricNames üzerinden yayımlayın.
 *
 * @param {BootstrapPowers} powers - zoe, installation.produce[name]
 * @param {{ name: string, bundleID: string }} opts
 */
export const installContract = async (
  { consume: { zoe }, installation: { produce: produceInstallation } },
  { name, bundleID }
) => {
  const installation = await E(zoe).installBundleID(bundleID);
  produceInstallation[name].reset();
  produceInstallation[name].resolve(installation);
  console.log(name, 'installed as', bundleID.slice(0, 8));
  return installation;
};
```

Bu `installation` vaadi alanı, `E(agoricNames).lookup('installation')` NameHub ile bağlantılıdır: `produce[name].resolve(value)` işlemini yaptığınızda, bu NameHub'da bir güncelleme tetikler. Güncelleme sağlanan ismi sağlanan değerle ilişkilendirerek `E(agoricNames).lookup('installation', name)`'in bir vaadi olmasını sağlar.

Benzer şekilde, `startContract()` yardımcı işlevi, `E(zoe).startInstance(...)` çağrısı yaparak, daha önceki  tartışmamıza dayanır. Aynı zamanda, `issuerNames` argümanını kullanarak `Ticket` vericisini ve markasını `E(agoricNames).lookup('issuer', 'Ticket')` ve `E(agoricNames).lookup('brand', 'Ticket')` olarak "üretir" ve böylece erişilebilir hale getirir.