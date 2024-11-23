# Basit bir ZK Projesi Oluşturma TON'da

## 👋 Giriş

**Sıfır bilgiler** (ZK) kanıtları, bir tarafın (kanıtlayıcı) başka bir tarafa (doğrulayıcı) bir ifadenin doğru olduğunu kanıtlamasını sağlayan temel bir kriptografik primitif olup, bu süreçte ifadenin geçerliliğinden başka bir bilgi ifşa edilmez. Sıfır bilgi kanıtları, gizliliği koruyan sistemler oluşturmak için güçlü bir araçtır ve anonim ödemeler, anonim mesajlaşma sistemleri ve güvenilmez köprüler gibi çeşitli uygulamalarda kullanılmaktadır.

:::tip TVM Güncellemesi 2023.07
Haziran 2023'ten önce TON'da kriptografik kanıtları doğrulamak mümkün değildi. Eşleme algoritmasının arkasındaki karmaşık hesaplama nedeniyle, kanıt doğrulamak için TVM'nin işlevselliğini arttırmak ve TVM op kodlarını eklemek gerekiyordu. Bu işlevsellik [Haziran 2023 güncellemesi](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381) ile eklendi ve bu yazının yazıldığı sırada yalnızca testnet'te mevcut.
:::

## 🦄 Bu eğitimde neler ele alınacak

1. Sıfır bilgi kriptografisinin temelleri ve özellikle zk-SNARK'lar (Sıfır Bilgi Kısa Etkileşimsiz Bilgi Argümanı)
2. Güvenilir bir kurulum töreni başlatmak (Powers of Tau kullanarak)
3. Basit bir ZK devresi yazmak ve derlemek (Circom dilini kullanarak)
4. Örnek bir ZK-kanıtı doğrulamak için bir FunC sözleşmesi oluşturmak, dağıtmak ve test etmek

---

## 🟥🟦 ZK-kanıtlarını renge odaklı bir örnekle açıklama

Sıfır bilgi ayrıntılarına geçmeden önce, basit bir soruyla başlayalım. Renk körü bir kişiye farklı renkleri ayırt edebileceğinizi kanıtlamak istiyorsanız, bu sorunu çözmek için etkileşimli bir çözüm kullanacağız. Renk körü kişinin (doğrulayıcı) bir kırmızı 🟥 ve bir mavi 🟦 olan iki aynı kağıt parçasını bulduğunu varsayalım.

Doğrulayıcı kağıt parçalarından birini size (kanıtlayıcı) gösterir ve sizden rengini hatırlamanızı ister. Daha sonra doğrulayıcı, o belirli kağıt parçasını arkasında tutar ve ya aynı tutar veya değiştirir ve sizden rengin değişip değişmediğini sorar. Farkı söyleyebilirseniz, renkleri görebiliyorsunuz demektir (ya da sadece şanslıydınız çünkü doğru rengi tahmin etme şansınız %50’dir).

Doğrulayıcı bu süreci 10 kez tamamlarsa ve her seferinde farkı belirleyebilirseniz, o zaman doğrulayıcı doğru renklerin kullanıldığı konusunda ~%99.90234 (1 - (1/2)^10) güven duymaktadır. Dolayısıyla, doğrulayıcı bu süreci 30 kez tamamlarsa, doğrulayıcı %99.99999990686774 (1 - (1/2)^30) güven duyacaktır.

Bununla birlikte, bu etkileşimli bir çözüm. Kullanıcılardan belirli verileri kanıtlamak için 30 işlem göndermelerini isteyen bir DApp oluşturmanın verimli bir yol olmadığı için, etkileşimli olmayan bir çözüm gereklidir; işte bu noktada Zk-SNARK'lar ve Zk-STARK'lar devreye giriyor.

Bu eğitim için yalnızca Zk-SNARK'ları ele alacağız. Ancak, Zk-STARK'ların nasıl çalıştığı hakkında daha fazla bilgi için [StarkWare web sitesine](https://starkware.co/stark/) bakabilirsiniz; Zk-SNARK'lar ve Zk-STARK'lar arasındaki farkları karşılaştıran bilgi ise bu [Panther Protokol blog yazısında](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/) bulunmaktadır.

### 🎯 Zk-SNARK: Sıfır Bilgi Kısa Etkileşimsiz Bilgi Argümanı

Zk-SNARK, kanıtlayıcının doğru bir ifadenin varlığını sadece bir kanıt göndererek doğrulayıcıya göstermesini sağlayan etkileşimsiz bir kanıt sistemidir. Ve doğrulayıcı kanıtı çok kısa bir sürede doğrulayabilir. Tipik olarak, bir Zk-SNARK ile ilgili işlem üç ana aşamadan oluşur:

* Kanıt ve doğrulama anahtarları oluşturmak için [çok taraflı hesaplamayı (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation) sağlayan güvenilir bir kurulum gerçekleştirmek (Powers of TAU kullanarak)
* Kanıtı oluşturmak için bir kanıtlayıcı anahtarı, kamusal giriş ve gizli girişi (şahit) kullanmak
* Kanıtı doğrulamak

Hadi geliştirme ortamımızı ayarlayalım ve kodlamaya başlayalım!

---

## ⚙ Geliştirme Ortamı Ayarlama

Süreci, aşağıdaki adımları izleyerek başlatalım:

1. [Blueprint](https://github.com/ton-org/blueprint) ile "simple-zk" adında yeni bir proje oluşturmak için aşağıdaki komutu çalıştırın, ardından sözleşmeniz için bir isim girin (örneğin ZkSimple) ve sonra ilk seçeneği (boş bir sözleşmeye dayalı) seçin.
   ```bash 
   npm create ton@latest simple-zk
   ```

2. Sonra FunC sözleşmelerini destekleyecek şekilde ayarlanmış [snarkjs repo](https://github.com/kroist/snarkjs)'sını klonlayacağız.
   ```bash
   git clone https://github.com/kroist/snarkjs.git
   cd snarkjs
   npm ci
   cd ../simple-zk
   ```

3. Ardından ZkSNARK'lar için gereken kütüphaneleri yükleyeceğiz.
   ```bash
   npm add --save-dev snarkjs ffjavascript
   npm i -g circom
   ```

4. Aşağıdaki bölümü package.json dosyasına ekleyeceğiz (bazı kullanacağımız op kodlarının henüz mainnet sürümünde mevcut olmadığını unutmayın).
   ```json
   "overrides": {
       "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
       "@ton-community/func-js": "0.6.3-tvmbeta.1"
   }
   ```

5. Ayrıca, en son [TVM güncellemelerini](https://t.me/thetontech/56) kullanabilmek için @ton-community/sandbox sürümünü değiştirmemiz gerekecek.
   ```bash
   npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
   ```

Harika! Artık TON'da ilk ZK projemizi yazmaya hazırız!

Şu anda ZK projemizi oluşturan iki ana klasörümüz bulunuyor:

* `simple-zk` klasörü: devrelerimizi ve sözleşmelerimizi ve testlerimizi yazmamızı sağlayacak Blueprint şablonunu içeriyor
* `snarkjs` klasörü: adım 2'de klonladığımız snarkjs repo'sunu içeriyor

---

## Circom Devresi

Öncelikle `simple-zk/circuits` adında bir klasör oluşturalım ve ardından onun içinde bir dosya yaratalım ve aşağıdaki kodu ekleyelim:
```circom
template Multiplier() {
   signal private input a;
   signal private input b;
   //private input means that this input is not public and will not be revealed in the proof

   signal output c;

   c <== a*b;
 }

component main = Multiplier();
```

Yukarıda basit bir çarpan devresi ekledik. Bu devreyi kullanarak, iki sayının birlikte çarpılması sonucunda belirli bir sayıyı (c) bildiğimizi kanıtlayabiliriz; ancak karşılık gelen sayıları (a ve b) ifşa etmeden.

Circom dilini daha fazla okumak için [bu siteye](https://docs.circom.io/) göz atabilirsiniz.

Ardından, derleme dosyalarımız için bir klasör oluşturacağız ve verileri oraya taşımak için aşağıdaki işlemi gerçekleştireceğiz (basit-zk klasöründeyken):
```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

---

### 💪 Powers of TAU ile Güvenilir Bir Kurulum Oluşturma

Şimdi güvenilir bir kurulum oluşturma zamanı. Bu süreci gerçekleştirmek için [Powers of Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) yönteminden yararlanacağız (tamamlanması birkaç dakika sürebilir). Hadi başlayalım:
```bash
echo 'prepare phase1'
node ../../../snarkjs/build/cli.cjs powersoftau new bls12-381 14 pot14_0000.ptau -v
echo 'contribute phase1 first'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="some random text"
echo 'contribute phase1 second'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0001.ptau pot14_0002.ptau --name="Second contribution" -v -e="some random text"
echo 'apply a random beacon'
node ../../../snarkjs/build/cli.cjs powersoftau beacon pot14_0002.ptau pot14_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
echo 'prepare phase2'
node ../../../snarkjs/build/cli.cjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v
echo 'Verify the final ptau'
node ../../../snarkjs/build/cli.cjs powersoftau verify pot14_final.ptau
```

Yukarıdaki işlem tamamlandıktan sonra, ileriye dönük ilişkili devreleri yazmak için kullanılabilecek pot14_final.ptau dosyası `build/circuits` klasöründe oluşturulacaktır.

:::caution Kısıtlama boyutu
Daha fazla kısıtlamaya sahip daha karmaşık bir devre yazılacaksa, PTAU kurulumunuzu daha büyük bir parametre kullanarak oluşturmanız gerekecektir.
:::

Gereksiz dosyaları kaldırabilirsiniz:
```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```

### 📜 Devre Derlemesi

Şimdi devreyi derlemek için `build/circuits` klasöründen aşağıdaki komutu çalıştıralım:
```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

Artık devremiz `build/circuits/circuit.sym`, `build/circuits/circuit.r1cs` ve `build/circuits/circuit.wasm` dosyalarına derlenmiştir.

:::info altbn-128 ve bls12-381 eğrileri
altbn-128 ve bls12-381 eliptik eğrileri şu anda snarkjs tarafından desteklenmektedir. [altbn-128](https://eips.ethereum.org/EIPS/eip-197) eğrisi yalnızca Ethereum'da desteklenmektedir. Ancak, TON'da yalnızca bls12-381 eğrisi desteklenmektedir.
:::

Devremizin kısıtlama boyutunu kontrol etmek için aşağıdaki komutu giriyoruz:
```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

Dolayısıyla, doğru sonuç şöyle olmalıdır:
```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

Şimdi referans zkey oluşturmak için aşağıdaki komutu çalıştırabiliriz:
```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

Sonra zkey'e aşağıdaki katkıyı ekleyeceğiz:
```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

Daha sonra, son zkey'i dışa aktaracağız:
```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

Artık `build/circuits/circuit_final.zkey` dosyasında son zkey'imiz mevcut. Zkey, aşağıdaki komutu girerek doğrulandıktan sonra:
```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

Sonunda, doğrulama anahtarını oluşturma zamanı:
```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

Daha sonra gereksiz dosyaları kaldıracağız:
```bash
rm circuit_0000.zkey circuit_0001.zkey
```

Yukarıdaki süreçleri gerçekleştirdikten sonra, `build/circuits` klasörü aşağıdaki gibi görünmelidir: 
```
build
└── circuits
        ├── circuit_final.zkey
        ├── circuit.r1cs
        ├── circuit.sym
        ├── circuit.wasm
        ├── pot14_final.ptau
        └── verification_key.json
```

---

### ✅ Doğrulayıcı Sözleşmesini Dışa Aktarma

Bu bölümdeki son adım, ZK projemizde kullanacağımız FunC doğrulayıcı sözleşmesini oluşturmaktır.
```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
``` 
Ardından, `contracts` klasöründe `verifier.fc` dosyası oluşturulacaktır.

## 🚢 Doğrulayıcı Sözleşme Dağıtımı​

Şimdi `contracts/verifier.fc` dosyasını adım adım gözden geçirelim çünkü bu dosya ZK-SNARK'ların sihrini içermektedir:

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

Yukarıda, doğrulayıcı sözleşmelerinin kanıt doğrulamasını uygulamak için kullanması gereken sabitler bulunmaktadır. Bu parametreler, `build/circuits/verification_key.json` dosyasında bulunabilir.

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```
Yukarıdaki satırlar, TON Blockchain'inde eşleme kontrollerinin gerçekleştirilmesine olanak tanıyan yeni `TVM op kodları`'dır.

load_data ve save_data fonksiyonları, yalnızca test amaçlı olarak kanıt doğrulama sonuçlarını yüklemek ve kaydetmek için kullanılır.

```func
() load_data() impure {

    var ds = get_data().begin_parse();

    ctx_res = ds~load_uint(32);

    ds.end_parse();
}

() save_data() impure {
    set_data(
            begin_cell()
                    .store_uint(ctx_res, 32)
                    .end_cell()
    );
}
```

Ardından, sözleşmeye gönderilen kanıt verilerini yüklemek için kullanılan birkaç basit yardımcı fonksiyon bulunmaktadır:
```func
(slice, slice) load_p1(slice body) impure {
    ...
}

(slice, slice) load_p2(slice body) impure {
    ...
}

(slice, int) load_newint(slice body) impure {
    ...
}
```

Son kısım ise, sözleşmeye gönderilen kanıtın geçerliliğini kontrol etmek için gerekli olan groth16Verify fonksiyonudur.
```func
() groth16Verify(
        slice pi_a,
        slice pi_b,
        slice pi_c,

        int pubInput0

) impure {

    slice cpub = bls_g1_multiexp(

            IC1, pubInput0,

            1
    );

    cpub = bls_g1_add(cpub, IC0);
    slice pi_a_neg = bls_g1_neg(pi_a);
    int a = bls_pairing(
            cpub, vk_gamma_2,
            pi_a_neg, pi_b,
            pi_c, vk_delta_2,
            vk_alpha_1, vk_beta_2,
            4);
    ;; ctx_res = a;
    if (a == 0) {
        ctx_res = 0;
    } else {
        ctx_res = 1;
    }
    save_data();
}
```

Artık `wrappers` klasöründeki iki dosyayı düzenlememiz gerekiyor. İlk olarak `ZkSimple.compile.ts` dosyasına odaklanacağız (eğer adım 1'de başka bir isim belirlendiyse, adı farklı olacaktır). `verifier.fc` dosyasını derlenmesi gereken sözleşmeler listesine ekleyeceğiz.

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- buraya sözleşme yolunu koyuyoruz
};
```

Diğer dikkat edilmesi gereken dosya `ZkSimple.ts`. `verify` op kodunu `Opcodes` enum'una eklememiz gerekiyor: 

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

Sonra, `ZkSimple` sınıfına `sendVerify` fonksiyonunu eklemek gerekecek. Bu fonksiyon, kanıtı sözleşmeye göndermek ve test etmek için kullanılır ve şu şekilde tanımlanır:
```ts
async sendVerify(
  provider: ContractProvider,
  via: Sender,
  opts: {
  pi_a: Buffer;
  pi_b: Buffer;
  pi_c: Buffer;
  pubInputs: bigint[];
  value: bigint;
  queryID?: number;
}
) {
  await provider.internal(via, {
    value: opts.value,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    body: beginCell()
      .storeUint(Opcodes.verify, 32)
      .storeUint(opts.queryID ?? 0, 64)
      .storeRef(
        beginCell()
          .storeBuffer(opts.pi_a)
          .storeRef(
            beginCell()
              .storeBuffer(opts.pi_b)
              .storeRef(
                beginCell()
                  .storeBuffer(opts.pi_c)
                  .storeRef(
                    this.cellFromInputList(opts.pubInputs)
                  )
              )
          )
      )
      .endCell(),
  });
}
```

Son olarak, `ZkSimple` sınıfına son olarak ekleyeceğimiz fonksiyon, `getRes` fonksiyonudur. Bu fonksiyon, kanıt doğrulama sonucunu almak için kullanılır.
```ts
async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

Artık sözleşmenin dağıtım testini başarılı bir şekilde geçmesi için gereken testleri çalıştırabiliriz. Bunun için, `simple-zk` klasörünün kökünde bu komutu çalıştırın:
```bash
npx blueprint test

## 🧑‍💻 Doğrulayıcı için test yazma

Aşağıdaki adımlarla `tests` klasöründeki `ZkSimple.spec.ts` dosyasını açalım ve `verify` fonksiyonu için bir test yazalım. Test şu şekilde gerçekleştirilir:

```ts
describe('ZkSimple', () => {
  let code: Cell;

  beforeAll(async () => {
    code = await compile('ZkSimple');
  });

  let blockchain: Blockchain;
  let zkSimple: SandboxContract;

  beforeEach(async () => {
    // sözleşmeyi dağıt
  });

  it('dağıtılmalı', async () => {
    // kontrol beforeEach içinde yapılır
    // blockchain ve zkSimple kullanılmak için hazır
  });

  it('doğrulanmalı', async () => {
    // todo test yaz
  });
});
```

Öncelikle, testte kullanacağımız birkaç paketi içe aktarmamız gerekecek:

```ts
import * as snarkjs from "snarkjs";
import path from "path";
import {buildBls12381, utils} from "ffjavascript";
const {unstringifyBigInts} = utils;
```

:::warning
Testi çalıştırırsanız, sonucu bir TypeScript hatası olacaktır, çünkü 'snarkjs' ve ffjavascript modülü için bir bildirim dosyamız yok. Bu, `simple-zk` klasöründeki `tsconfig.json` dosyasını düzenleyerek çözülebilir. O dosyada **_strict_** seçeneğini **_false_** olarak değiştirmemiz gerekecek.
:::

Ayrıca, sözleşmeye göndermek için kullanılacak olan kanıtı üretmek için `circuit.wasm` ve `circuit_final.zkey` dosyalarını da içe aktarmamız gerekecek.

```ts
const wasmPath = path.join(__dirname, "../build/circuits", "circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits", "circuit_final.zkey");
```

`doğrulanmalı` testini dolduralım. Öncelikle kanıtı üretmemiz gerekecek:

```ts
it('doğrulanmalı', async () => {
  // kanıt üretimi
  let input = {
    "a": "123",
    "b": "456",
  }
  let {proof, publicSignals} = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
  let curve = await buildBls12381();
  let proofProc = unstringifyBigInts(proof);
  var pi_aS = g1Compressed(curve, proofProc.pi_a);
  var pi_bS = g2Compressed(curve, proofProc.pi_b);
  var pi_cS = g1Compressed(curve, proofProc.pi_c);
  var pi_a = Buffer.from(pi_aS, "hex");
  var pi_b = Buffer.from(pi_bS, "hex");
  var pi_c = Buffer.from(pi_cS, "hex");
  
  // todo kanıtı sözleşmeye gönder
});
```

Bir sonraki adımı gerçekleştirmek için `g1Compressed`, `g2Compressed` ve `toHexString` fonksiyonlarını tanımlamak gereklidir. Bu fonksiyonlar, kriptografik kanıtı sözleşmenin beklediği formata dönüştürmek için kullanılacaktır.

```ts
function g1Compressed(curve, p1Raw) {
  let p1 = curve.G1.fromObject(p1Raw);

  let buff = new Uint8Array(48);
  curve.G1.toRprCompressed(buff, 0, p1);
  // ffjavascript'ten blst formatına dönüştür
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function g2Compressed(curve, p2Raw) {
  let p2 = curve.G2.fromObject(p2Raw);

  let buff = new Uint8Array(96);
  curve.G2.toRprCompressed(buff, 0, p2);
  // ffjavascript'ten blst formatına dönüştür
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte: any) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join("");
}
```

Artık kriptografik kanıtı sözleşmeye gönderebiliriz. Bunun için `sendVerify` fonksiyonunu kullanacağız. `sendVerify` fonksiyonu 5 parametre bekler: `pi_a`, `pi_b`, `pi_c`, `pubInputs` ve `value`.

```ts
it('doğrulanmalı', async () => {
  // kanıt üretimi
  
  // kanıtı sözleşmeye gönder
  const verifier = await blockchain.treasury('verifier');
  const verifyResult = await zkSimple.sendVerify(verifier.getSender(), {
    pi_a: pi_a,
    pi_b: pi_b,
    pi_c: pi_c,
    pubInputs: publicSignals,
    value: toNano('0.15'), // ücret için 0.15 TON
  });
  expect(verifyResult.transactions).toHaveTransaction({
    from: verifier.address,
    to: zkSimple.address,
    success: true,
  });

  const res = await zkSimple.getRes();

  expect(res).not.toEqual(0); // kanıt sonucunu kontrol et

  return;
});
```

:::tip
TON blockchain üzerinde ilk kanıtınızı doğrulamaya hazır mısınız? Bu süreçte, testleri çalıştırmak için aşağıdaki komutu girin:
```bash
npx blueprint test
```
:::

Sonuç şu şekilde olmalıdır:

```bash
 PASS  tests/ZkSimple.spec.ts
  ZkSimple
    ✓ dağıtılmalı (857 ms)
    ✓ doğrulanmalı (1613 ms)

Test Takımları: 1 geçti, 1 toplam
Testler:       2 geçti, 2 toplam
Anlık Görüntüler:   0 toplam
Zaman:        4.335 s, tahmini 5 s
Tüm test takımları çalıştırıldı.
```

Bu eğitimin içeriğini içeren repo için aşağıdaki bağlantıya tıklayın [buradan](https://github.com/SaberDoTcodeR/zk-ton-doc).

## 🏁 Sonuç 

Bu eğitimde aşağıdaki becerileri öğrendiniz:

* **Sıfır bilgisi** ve özellikle **ZK-SNARK**'ların karmaşıklıkları
* Circom devrelerini yazma ve derleme
* MPC ve Powers of TAU ile daha fazla aşinalık, bu da bir devre için doğrulama anahtarlarının üretilmesinde kullanıldı
* Bir devre için FunC doğrulayıcıyı dışa aktarmak üzere Snarkjs kütüphanesi ile tanıştınız
* Doğrulayıcı dağıtımı ve test yazımı için Blueprint ile tanıştınız

:::note
Yukarıdaki örnekler, basit bir ZK kullanım durumunu inşa etmemizi öğretti. Bununla birlikte, geniş bir yelpazede, birçok karmaşık ZK odaklı kullanım durumu uygulanabilir. Bunlardan bazıları şunlardır:

* özel oylama sistemleri 🗳
* özel piyango sistemleri 🎰
* özel açık artırma sistemleri 🤝
* özel işlemler 💸 (Toncoin veya Jettonlar için)
:::

Bu eğitimde herhangi bir sorunuz varsa ya da herhangi bir hata ile karşılaşırsanız, yazardan iletişime geçmekten çekinmeyin: [@saber_coder](https://t.me/saber_coder)

## 📌 Kaynaklar

- [TVM Haziran 2023 Güncellemesi](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade)
- [SnarkJs](https://github.com/iden3/snarkjs)
- [SnarkJs FunC çatallaması](https://github.com/kroist/snarkjs)
- [TON üzerindeki Örnek ZK](https://github.com/SaberDoTcodeR/ton-zk-verifier)
- [Blueprint](https://github.com/ton-org/blueprint)

## 📖 Ayrıca Bakınız

- [TON Güvenilmez köprü EVM sözleşmeleri](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel Ağı: TON üzerindeki Gizlilik protokolü](http://github.com/saberdotcoder/tonnel-network)
- [TVM Yarışması](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)

## 📬 Yazar Hakkında 

Saber ile [Telegram](https://t.me/saber_coder) veya [GitHub](https://github.com/saberdotcoder) veya [LinkedIn](https://www.linkedin.com/in/szafarpoor/) üzerinden ulaşabilirsiniz.