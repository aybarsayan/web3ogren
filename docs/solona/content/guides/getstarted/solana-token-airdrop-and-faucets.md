---
date: 2023-07-29T00:00:00Z
difficulty: intro
title: "Solana devnet SOL nasıl alınır (airdrop ve musluklar dahil)"
seoTitle: "Musluklar: Solana devnet SOL nasıl alınır"
description:
  "Solana geliştirmesi için devnet ve testnet SOL tokenlerini almanın en yaygın yollarının bir listesidir. Airdrop, web3.js, POW musluğu ve daha fazlasını içerir."
tags:
  - musluk
keywords:
  - musluk
  - blokzincir
  - devnet
  - testnet
---

# Solana devnet SOL nasıl alınır (airdrop ve musluklar dahil)

Bu, geliştiricilerin Solana'nın test ağlarında, Solana devnet ve testnet üzerinde SOL edinme yollarının bir koleksiyonudur.

## 1. Solana Airdrop

_Devnet ve Testnet'te Mevcut_

Bu, SOL edinmenin temel yoludur, ancak airdrop sayısı yüksek olduğunda hız sınırlamalarına tabi olabilir.

Bununla airdrop talep etmenin üç farklı yolu vardır:

### Solana CLI Kullanarak:

```shell
solana airdrop 2
```

### web3.js Kullanarak:

```js
const connection = new Connection("https://api.devnet.solana.com");
connection.requestAirdrop();
```

Daha fazlasını görün:
[`requestAirdrop()`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#requestAirdrop) web3.js içindeki belgeler.

---

## 2. Web Musluğu

_Devnet için Mevcut_

1. [faucet.solana.com](https://faucet.solana.com) - Solana Vakfı tarafından barındırılan halk web musluğu
2. [SolFaucet.com](https://solfaucet.com/) - Kamusal RPC uç noktalarından airdrop için web arayüzü
3. [QuickNode](https://faucet.quicknode.com/solana/devnet) - QuickNode tarafından işletilen bir web musluğu

_Testnet için Mevcut_

1. [faucet.solana.com](https://faucet.solana.com) - Solana Vakfı tarafından barındırılan halk web musluğu
2. [SolFaucet.com](https://solfaucet.com/) - Kamusal RPC uç noktalarından airdrop için web arayüzü
3. [QuickNode](https://faucet.quicknode.com/solana/testnet) - QuickNode tarafından işletilen bir web musluğu
4. [TestnetFaucet.org](https://testnetfaucet.org) - Kamusal RPC uç noktalarından ayrı bir hız sınırı ile işletilen bir web musluğu, [@Ferric](https://twitter.com/ferric) tarafından işletilmektedir.

---

## 3. RPC Sağlayıcı Muslukları

_Devnet için Mevcut_

RPC Sağlayıcıları, devnet SOL dağıtmayı tercih edebilirler.

> Eğer bir RPC Sağlayıcısıysanız ve SOL dağıtmak istiyorsanız lütfen
> [buradan iletişime geçin](https://c852ena8x5c.typeform.com/to/cUj1iRhS).

Şu anda desteklenenler:

1. [Helius](https://www.helius.dev/)
2. [QuickNode](https://faucet.quicknode.com/solana/devnet)
3. [Triton](https://triton.one/)

### Solana CLI Kullanarak

RPC sağlayıcınızın URL'sini belirtmek için `Cluster` ayarınızı yapın:

```shell
solana config set --url <your RPC url>
```

Ardından, bu kılavuzdaki birinci seçenekte olduğu gibi airdrop talep edebilirsiniz:

```shell
solana airdrop 2
```

### Web3.js Kullanarak

```js
const connection = new Connection("your RPC url");
connection.requestAirdrop();
```

---

## 4. İş Kanıtı Musluğu

_Devnet için Mevcut_

Bu, iş kanıtı musluğudur; devnet SOL, işlem gücünüz sayesinde size dağıtılabilir.

**Devnet POW Kütüphanesini Yükleyin:**

```shell
cargo install devnet-pow
```

**Devnet SOL madenciliği başlatın**

```shell
devnet-pow mine
```

_⚠️ [POW Musluğu](https://github.com/jarry-xiao/proof-of-work-faucet) Ellipsis Labs tarafından korunmaktadır._

---

## 5. Discord Muslukları

Farklı Discord toplulukları, devnet SOL Muslukları olarak BOT'lar kurmuştur.

| Topluluk      | Kullanım                                                       | Bağlantı                                         |
| -------------- | ------------------------------------------------------------- | -------------------------------------------- |
| The 76 Devs    | BOT komutları kanalında `!gibsol` yazın.                    | [Sunucuya Katıl](https://discord.gg/RrChGyDeRv) |
| The LamportDAO | BOT komutları kanalında `/drop  ` yazın.   | [Sunucuya Katıl](https://discord.gg/JBVrJgtFkq) |

---

## 6. devnet SOL'u Yeniden Kullanma

SOL'u tasarruf etmenin en sürdürülebilir yolu onu yeniden kullanmaktır. Solana CLI ile daha önceki tampon hesapları gösterebilir ve kapatabilirsiniz:

```shell
solana program show --buffers
```


**Tampon hesabı nedir?**

Tampon hesapları bir program dağıttığınızda otomatik olarak oluşturulur. Programın tüm verileri dağıtım sırasında bu hesaba aktarılır. İşlem tamamlandığında, programınızın verileri yeni verilerle değiştirilir.



Normalde, bu tampon hesapları otomatik olarak kapatılır. Eğer kapanmazlarsa, içindeki SOL'u geri almak için bunları manuel olarak kapatabilirsiniz:

```shell
solana program close <buffer account>
```

Ayrıca, mevcut seçilen kümenize zaten dağıtılmış tüm programları göstermek için `show` alt komutunu kullanabilirsiniz:

```shell
solana program show --programs
```

Sonra `close` alt komutunu kullanarak her programı kapatabilir ve dağıttığınız SOL'u geri alabilirsiniz:

```shell
solana program close <program id>
```

Bu SOL'u yeni programlar dağıtmak için kullanabilirsiniz.



Kapattıktan sonra aynı program kimliğini bir daha kullanamayacaksınız. Bu yüzden doğru programı kapattığınızdan ve o kimliğe artık ihtiyacınız olmadığından emin olun.

Eğer Solana CLI'nizin yapılandırıldığı RPC uç noktası tarafından hız sınırlamasına tabi tutulursanız, bu komutların herhangi birine `-u "urlToYourRpc"` ekleyerek farklı bir RPC uç noktası kullanabilirsiniz.

