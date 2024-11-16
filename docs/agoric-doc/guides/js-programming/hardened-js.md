# Sertleştirilmiş JavaScript

::: tip İzleme: Güvenli Javascript'te Nesne-yetenekli Programlama (Ağustos 2019)

_İlk 15 dakika aşağıdaki içeriğin çoğunu kapsar. Son 10 dakika Soru&Cevap'dır._




:::

## Örnek Sertleştirilmiş JavaScript Kodu

Aşağıdaki örnek, Sertleştirilmiş JavaScript’in birkaç özelliğini göstermektedir.






:::

## Araç Desteği: eslint yapılandırması

::: tip Jessie için eslint yapılandırması
Bu bölümdeki örnekler, JavaScript akıllı sözleşmeleri yazmak için önerilen stilimiz olan _Jessie_ kullanılarak yazılmıştır. Bu `eslint` yapılandırması, araç desteği sağlar.
:::

1. Boş bir dizinden çalışıyorsanız, önce `yarn init` veya `yarn init -y` komutunu çalıştırarak bir package.json dosyası oluşturmalısınız.
2. Buradan sonra, projeye `yarn add eslint @jessie.js/eslint-plugin` komutunu kullanarak eslint'i yükleyebiliriz.
3. Son adım, projemizin eslint yapılandırmasını package.json dosyasına eklemektir; aşağıdaki kod bloğunu ekleyin.

```json
"eslintConfig" : {
  "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 6
  },
  "extends": [
    "plugin:@jessie.js/recommended"
  ]
}
```

Artık package.json dosyasının içeriği aşağıdaki örneğe benzer görünmelidir.

```json
{
  "name": "eslint-config-test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "type": "module",
  "devDependencies": {
    "@jessie.js/eslint-plugin": "^0.1.3",
    "eslint": "^8.6.0"
  },
  "eslintConfig": {
    "parserOptions": { "sourceType": "module", "ecmaVersion": 6 },
    "extends": ["plugin:@jessie.js/recommended"]
  }
}
```

### jessie.js Kodunun Linting'i

1. `.js` kaynak dosyanızın başına `// @jessie-check` yazın.
2. `yarn eslint --fix path/to/your-source.js` komutunu çalıştırın.
3. Eğer eslint kodunuzda sorunlar bulursa, linter'ın tavsiyelerine göre dosyanızı düzenleyin ve ardından yukarıdaki adımı tekrarlayın.

Jessie detayları, deneyimle birlikte gelişti. Sonuç olarak, burada `(count += 1)` kullanıyoruz, oysa video `{ return count++; }` gösteriyor.

## Nesneler ve _maker_ Deseni

Şimdi `makeCounter` örneğini biraz inceleyelim.

JavaScript, nesnelerin herhangi bir sınıfa ait olmasının gerekmemesi açısından biraz yenilikçidir; nesneler sadece kendi başlarına durabilirler:

 fn())` yeterli olabilir
    - Ayrıca  için de bakın.
  - `require` (Bunun yerine `import` modül sözdizimini kullanın.)
  - `localStorage`
    -  dikey süreklilik, durumların olağan değişkenler ve veri yapılarında sonsuz süre yaşamasını sağlar ve özel olarak depolamaya yazılması gerekmez.
    - Yüksek kartinaliteli veriler için  bakın.
  - `global` (Bunun yerine `globalThis` kullanın.)
- yetkisiz, ancak ev sahibi tanımlı:
  - `Buffer`
  - `URL` ve `URLSearchParams`
  - `TextEncoder`, `TextDecoder`
  - `WebAssembly`

Agoric akıllı sözleşmelerini yüklemek için kullanılan bölmelere, `globalThis` sertleşmiş olup OCap disiplinini takip eder.
Bu bölmeler,  içindeki `console` ve `assert` globals’ını içerir. Ancak yazdırma için `console.log` kullanmayın; yalnızca hata ayıklama içindir ve blockchain mutabakat bağlamında hiçbir şey yapmayabilir.

Yeni bir `Compartment` nesnesi oluşturabilirsiniz. Bunu yaptığınızda, OCap disiplinini uygulayıp uygulamayacağınıza karar verebilir ve `harden(compartment.globalThis)` çağrısı yapabilirsiniz. Eğer yapmazsanız, compartment içindeki tüm nesnelerin globalThis'in özellikleri aracılığıyla diğer nesnelerle iletişim kurma yetkisine sahip olduğunu unutmayın.

## Türler: Danışmanlık


bazı kodlama hatalarının önlenmesine yardımcı olabilir. Bu stili, tür açıklamalarının yalnızca lint araçları için olduğunu ve çalışma zamanında hiçbir etkisi olmadığını hatırlamak için TypeScript sözdizimi yazmak yerine öneriyoruz:

```js
// @ts-check

/** @param {number} init */
const makeCounter = init => {
  let value = init;
  return {
    incr: () => {
      value += 1;
      return value;
    }
  };
};
```

Eğer dikkatli olmazsak, müşterilerimiz yanlış davranışlar sergileyebilir:

```
> const evil = makeCounter('poison')
> evil2.incr()
'poison1'
```

veya daha kötüsü:

```
> const evil2 = makeCounter({ valueOf: () => { console.log('füzeleri ateşle!'); return 1; } });
> evil2.incr()
füzeleri ateşle!
2
```

## Türler: Savunmacı

Defansif olarak doğru olmak için güven sınırlarını aşan herhangi bir girdi için çalışma zamanı doğrulaması yapmamız gerekmektedir:

```js
import Nat from `@endo/nat`;

/** @param {number | bignum} init */
const makeCounter = init => {
  let value = Nat(init);
  return harden({
    increment: () => {
      value += 1n;
      return value;
    },
  });
};
```

```
> makeCounter('poison')
Uncaught TypeError: poison is a string but must be a bigint or a number
```

## OCaps'tan Elektronik Haklara: Mint ve Purse

Yukarıdaki Sertleştirilmiş JavaScript teknikleri, ERTP'nin özünü ve güvenlik özelliklerini yalnızca 30 satırda ifade edecek kadar güçlüdür.
Bu 8 dakikalık video sunumunun dikkatli incelenmesi, Zoe ile akıllı sözleşmeler yazmak için sağlam bir temel sağlar.

::: tip İzleme: Mint Deseni
8 dakika ,



:::

```js
const makeMint = () => {
  const ledger = makeWeakMap();

  const issuer = harden({
    makeEmptyPurse: () => mint.makePurse(0)
  });

  const mint = harden({
    makePurse: initialBalance => {
      const purse = harden({
        getIssuer: () => issuer,
        getBalance: () => ledger.get(purse),

        deposit: (amount, src) => {
          Nat(ledger.get(purse) + Nat(amount));
          ledger.set(src, Nat(ledger.get(src) - amount));
          ledger.set(purse, ledger.get(purse) + amount);
        },
        withdraw: amount => {
          const newPurse = issuer.makeEmptyPurse();
          newPurse.deposit(amount, purse);
          return newPurse;
        }
      });
      ledger.set(purse, initialBalance);
      return purse;
    }
  });

  return mint;
};