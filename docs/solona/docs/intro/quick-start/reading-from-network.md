---
sidebarLabel: Ağdan Okuma
title: Ağdan Okuma
sidebarSortOrder: 1
description:
  Solana blockchain ağından veri okuma yöntemlerini öğrenin. Bu kılavuz, JavaScript/TypeScript kullanarak cüzdan hesaplarının, program hesaplarının ve token mint hesaplarının çekilmesini kapsar ve Solana web3.js kütüphanesi ile pratik örnekler sunar.
---

Şimdi Solana ağından veri okuma yöntemlerini keşfedelim. Solana hesabının yapısını anlamak için birkaç farklı hesabı çekeceğiz.

Solana'da tüm veriler "hesaplar" olarak adlandırdığımız yapılar içinde bulunur. Solana'daki verileri, her girişin ayrı bir hesap olduğu tek bir "Hesaplar" tablosuna sahip bir kamu veritabanı olarak düşünebilirsiniz.

Solana hesapları "durum" veya "çalıştırılabilir" programlar saklayabilir, tüm bunlar da aynı "Hesaplar" tablosundaki girişler olarak düşünülebilir. Her hesabın, zincir üzerindeki verilerini bulmak için kullanılan benzersiz bir kimlik olan bir "adres" (açık anahtar) vardır.

Solana hesapları aşağıdakilerden birini içerebilir:

- **Durum:** Okunmak ve kalıcı hale getirilmek amaçlı veridir. Tokenlarla, kullanıcı verileriyle veya program içerisinde tanımlanan başka tür verilerle ilgili bilgi olabilir.
- **Çalıştırılabilir Programlar:** Gerçek Solana programlarının kodunu içeren hesapların yeridir. Ağ üzerinde çalıştırılabilir talimatları içerir.

:::note
Program kodu ile program durumunun ayrılması, Solana'nın Hesap Modeli'nin ana özelliklerinden biridir. Daha fazla bilgi için `Solana Hesap Modeli` sayfasına bakabilirsiniz.
:::

## Playground Cüzdanı Çekme

Aşina olduğunuz bir hesaba bakalım - kendi Playground Cüzdanınız! Bu hesabı çekecek ve temel bir Solana hesabının nasıl göründüğünü anlamak için yapısını inceleyeceğiz.



### Örnek 1'i Aç

Bu [bağlantıya](https://beta.solpg.io/6671c5e5cffcf4b13384d198) tıklayarak Solana Playground'daki örneği açın. Bu kodu göreceksiniz:

```ts filename="client.ts"
const address = pg.wallet.publicKey;
const accountInfo = await pg.connection.getAccountInfo(address);

console.log(JSON.stringify(accountInfo, null, 2));
```




Bu kod üç basit işlem yapar:

- Playground cüzdanınızın adresini alır

  ```ts
  const address = pg.wallet.publicKey;
  ```

- O adresteki hesabın `AccountInfo`'sunu çeker

  ```ts
  const accountInfo = await pg.connection.getAccountInfo(address);
  ```

- `AccountInfo`'yu Playground terminaline yazdırır

  ```ts
  console.log(JSON.stringify(accountInfo, null, 2));
  ```




### Örnek 1'i Çalıştır

Playground terminalinde `run` komutunu yazarak enter'a basın:

```shell filename="Terminal"
run
```

Cüzdan hesabınızla ilgili lamports cinsinden bakiyesi dahil olmak üzere detayları görmelisiniz, çıktı aşağıdaki gibidir:




```shell filename="Terminal"
$ run
Running client...
  client.ts:
    {
  "data": {
    "type": "Buffer",
    "data": []
  },
  "executable": false,
  "lamports": 5000000000,
  "owner": "11111111111111111111111111111111",
  "rentEpoch": 18446744073709552000,
  "space": 0
}
```




Cüzdanınız, esasen ana amacı sizin SOL bakiyenizi (lamports alanındaki miktar) saklamak olan Sistem Programı tarafından sahip olunan bir hesap.

---

Temel olarak, tüm Solana hesapları `AccountInfo` adı verilen standart bir formatta temsil edilir. 
[AccountInfo](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/account_info.rs#L19-L36) veri türü, tüm Solana Hesapları için temel veri yapısıdır.

Çıktıdaki alanları inceleyelim:

- **`data`** - Bu alan, genellikle hesabın "verisi" olarak adlandırdığımız şeyi içerir. Bir cüzdan için, bu boş (0 byte) iken, diğer hesaplar bu alanı herhangi bir keyfiyet veriyi serileştirilmiş bir bayt tamponu olarak saklamak için kullanır.
- **`executable`** - Hesabın çalıştırılabilir bir program olup olmadığını belirten bir bayrak. Cüzdanlar ve durum saklayan herhangi bir hesap için bu `false` olacaktır.
- **`owner`** - Bu alan, hesabı kontrol eden programı gösterir. Cüzdanlar için, bu her zaman Sistem Programı'dır, adresi `11111111111111111111111111111111` olarak kalır.
- **`lamports`** - Hesabın lamports cinsinden bakiyesi (1 SOL = 1,000,000,000 lamports).
- **`rentEpoch`** - Solana'nın kullanımdan kaldırılan kira toplama mekanizmasına ilişkin eski bir alan (şu anda kullanılmamaktadır).
- **`space`** - `data` alanının byte kapasitesini (uzunluğunu) gösterir, ancak `AccountInfo` türünde bir alan değildir.






## Token Programı Çekme

Sonraki adımda, Solana'daki tokenlarla etkileşim kurmak için bir çalıştırılabilir program olan Token Extensions programını inceleyeceğiz.



### Örnek 2'yi Aç

Bu [bağlantıya](https://beta.solpg.io/6671c6e7cffcf4b13384d199) tıklayarak Solana Playground'daki örneği açın. Bu kodu göreceksiniz:

```ts filename="client.ts" {3}
import { PublicKey } from "@solana/web3.js";

const address = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const accountInfo = await pg.connection.getAccountInfo(address);

console.log(JSON.stringify(accountInfo, null, 2));
```

Burada Playground cüzdanınız yerine Token Extensions Programı hesabının adresini çekiyoruz.

### Örnek 2'yi Çalıştır

Terminalde `run` komutunu kullanarak kodu çalıştırın.

```shell filename="Terminal"
run
```

Çıktıyı inceleyin ve bu program hesabının cüzdan hesabınızdan nasıl farklılaştığını görün.




```shell filename="Terminal" {15, 17}
$ run
Running client...
  client.ts:
    {
  "data": {
    "type": "Buffer",
    "data": [
      2,
      0,
      //... ek baytlar
      86,
      51
    ]
  },
  "executable": true,
  "lamports": 1141440,
  "owner": "BPFLoaderUpgradeab1e11111111111111111111111",
  "rentEpoch": 18446744073709552000,
  "space": 36
}
```




Token Extensions programı bir çalıştırılabilir program hesabıdır, ancak `AccountInfo` yapısının aynı olduğunu unutmayın.

`AccountInfo` içindeki önemli farklılıklar:

- **`executable`** - `true` olarak ayarlanmıştır; bu hesabın bir çalıştırılabilir programı temsil ettiğini gösterir.
- **`data`** - Serileştirilmiş verileri içerir (cüzdan hesabındaki boş verinin aksine). Bir program hesabı için veriler, programın byte kodunu içeren başka bir hesabın adresini saklar (Program Çalıştırılabilir Veri Hesabı).
- **`owner`** - Hesap, çalıştırılabilir hesapları yöneten özel bir program olan Yükseltilebilir BPF Loader (`BPFLoaderUpgradeab1e11111111111111111111111`) tarafından sahiptir.

:::info
Solana Explorer'de [Token Extensions Program Hesabı](https://explorer.solana.com/address/TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb) ve karşılık gelen [Program Çalıştırılabilir Veri Hesabı](https://explorer.solana.com/address/DoU57AYuPFu2QU514RktNPG22QhApEjnKxnBcu4BHDTY) için inceleme yapabilirsiniz.

Program Çalıştırılabilir Veri Hesabı, Token Extensions Programı'nın derlenmiş byte kodunu içerir. [Kaynak kodu](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program-2022/src).
:::






## Mint Hesabı Çekme

Bu adımda, Solana ağındaki tekil bir tokenı temsil eden bir Mint hesabını inceleyeceğiz.



### Örnek 3'ü Aç

Bu [bağlantıya](https://beta.solpg.io/6671c9aecffcf4b13384d19a) tıklayarak Solana Playground'daki örneği açın. Bu kodu göreceksiniz:

```ts filename="client.ts" {3}
import { PublicKey } from "@solana/web3.js";

const address = new PublicKey("C33qt1dZGZSsqTrHdtLKXPZNoxs6U1ZBfyDkzmj6mXeR");
const accountInfo = await pg.connection.getAccountInfo(address);

console.log(JSON.stringify(accountInfo, null, 2));
```

Bu örnekte, devnet üzerindeki mevcut bir Mint hesabının adresini çekeceğiz.

### Örnek 3'ü Çalıştır

Kodu çalıştırmak için `run` komutunu kullanın.

```shell filename="Terminal"
run
```




```shell filename="Terminal" {17}
$ run
Running client...
  client.ts:
    {
  "data": {
    "type": "Buffer",
    "data": [
      1,
      0,
      //... ek baytlar
      0,
      0
    ]
  },
  "executable": false,
  "lamports": 4176000,
  "owner": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  "rentEpoch": 18446744073709552000,
  "space": 430
}
```




`AccountInfo` içindeki önemli farklılıklar:

- **`owner`** - Mint hesabı, Token Extensions programı (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) tarafından sahiptir.
- **`executable`** - `false` olarak ayarlanmıştır, çünkü bu hesap çalıştırılabilir kod yerine durum saklar.
- **`data`** - Token hakkında serileştirilmiş verileri içerir (mint yetkisi, arz, ondalık sayılar vb.).




### Mint Hesabı Verilerini Deserialize Etme

Herhangi bir hesaptan `data` alanını okumak için, veri tamponunu beklenen veri türüne deserialize etmeniz gerekir. Bu genellikle belirli bir program için istemci kütüphanelerinden yardımcı işlevler kullanılarak yapılır.

**Deserialize etme**, verileri depolanmış bir format (ham baytlar veya JSON gibi) içinden, bir programda kullanılabilir, yapılandırılmış bir formata geri dönüştürme işlemidir. Blockchain'de, ağdan alınan ham, kodlanmış verilerin nesnelere, sınıflara veya okunabilir yapılara dönüştürülmesini içerir, böylece geliştiricilerin bir program içinde belirli bilgilere erişip manipüle etmesine olanak tanır. Deserialize etme, ağdan alınan hesap veya işlem verilerini programın işleyebileceği ve anlamlı bir şekilde görüntüleyebileceği bir forma yorumlamak için esastır.

Bu sonraki [örneği](https://beta.solpg.io/6671cd8acffcf4b13384d19b) Solana Playground'da açın. Bu kodu göreceksiniz:

```ts filename="client.ts"
import { PublicKey } from "@solana/web3.js";
import { getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const address = new PublicKey("C33qt1dZGZSsqTrHdtLKXPZNoxs6U1ZBfyDkzmj6mXeR");
const mintData = await getMint(
  pg.connection,
  address,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

console.log(mintData);
```

Bu örnek, Mint hesabının veri alanını otomatik olarak deserialize etmek için `getMint` yardımcı işlevini kullanır.

Kodu çalıştırmak için `run` komutunu kullanın.

```shell filename="Terminal"
run
```

Aşağıdaki deserialize edilmiş Mint hesabı verilerini görmelisiniz.




```shell filename="Terminal"
Running client...
  client.ts:
  { address: { _bn: { negative: 0, words: [Object], length: 10, red: null } },
  mintAuthority: { _bn: { negative: 0, words: [Object], length: 10, red: null } },
  supply: {},
  decimals: 2,
  isInitialized: true,
  freezeAuthority: null,
  tlvData: <Buffer 12 00 40 00 2c 5b 90 b2 42 0c 89 a8 fc 3b 2f d6 15 a8 9d 1e 54 4f 59 49 e8 9e 35 8f ab 88 64 9f 5b db 9c 74 a3 f6 ee 9f 21 a9 76 43 8a ee c4 46 43 3d ... > }
```




`getMint` fonksiyonu, hesap verilerini Token Extensions programı kaynak kodunda tanımlanan 
[Mint](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/state.rs#L18-L32) veri türüne serialize eder.

- **`address`** - Mint hesabının adresi
- **`mintAuthority`** - Yeni tokenları basmak için yetkili olan otorite
- **`supply`** - Tokenların toplam arzı
- **`decimals`** - Token için ondalık basamak sayısı
- **`isInitialized`** - Mint verisinin init edilip edilmediği
- **`freezeAuthority`** - Token hesaplarını dondurabilecek otorite
- **`tlvData`** - Token Extensions için ek veriler (daha fazla deserialize etme gerektirir)

:::tip
Tam olarak deserialize edilmiş [Mint Hesabı](https://explorer.solana.com/address/C33qt1dZGZSsqTrHdtLKXPZNoxs6U1ZBfyDkzmj6mXeR?cluster=devnet) verilerini, etkinleştirilmiş Token Extensions dahil olmak üzere Solana Explorer'da görüntüleyebilirsiniz.
:::




