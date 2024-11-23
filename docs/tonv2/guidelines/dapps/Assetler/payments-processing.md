# Ödeme İşleme

Bu sayfa, TON blockchain'inde `dijital varlıkları` nasıl işleneceğini (gönderme ve kabul etme) **açıklamaktadır**. Genellikle `TON coin’leri` ile çalışmayı tanıtmaktadır, ancak yalnızca `jettonlar` ile işlem yapmak isteseniz bile **teorik kısım** **önemlidir**.

:::tip
Bu eğitimi okumadan önce `Varlık İşleme Genel Görünümü` ile tanışmanız önerilir.
:::

## Cüzdan akıllı sözleşmesi

TON Ağı üzerindeki cüzdan akıllı sözleşmeleri, dış aktörlerin blockchain varlıklarıyla etkileşimde bulunmasına olanak tanır.  
* Sahibi doğrular: Sahip olmayanların adına işlem yapma veya ücret ödeme girişimlerini reddeder.  
* Tekrar koruması sağlar: Aynı isteğin tekrar tekrar yürütülmesini önler, örneğin varlıkları başka bir akıllı sözleşmeye göndermek.  
* Diğer akıllı sözleşmelerle rastgele etkileşimleri başlatır.  

İlk zorluk için standart çözüm, açık anahtar kriptografisidir: `cüzdan`, açık anahtarı saklar ve gelen bir isteği, yalnızca sahibi tarafından bilinen ilgili özel anahtar ile imzalanıp imzalanmadığını kontrol eder.

:::note
Üçüncü zorluktaki çözüm de yaygındır; genel olarak, bir istek, `cüzdanın` ağa gönderdiği tamamen oluşturulmuş bir iç mesaj içerir.
:::

### Seqno-tabanlı cüzdanlar

Seqno-tabanlı cüzdanlar, mesajları sıralamanın en basit yaklaşımını kullanır. Her mesajın, `cüzdan` akıllı sözleşmesinde saklanan sayaçla örtüşmesi gereken özel bir `seqno` tam sayısı vardır. `cüzdan`, her istekle birlikte sayaçını günceller, böylece bir isteğin iki kere işlenmemesi garanti edilir. Halk arasında mevcut yöntemlerde farklılık gösteren birkaç `cüzdan` versiyonu bulunmaktadır: isteklere son tarih koyma ve aynı açık anahtara sahip birden çok cüzdan bulundurma yeteneği. Ancak, bu yaklaşımın içsel bir gerekliliği, isteklerin birer birer gönderilmesidir, çünkü `seqno` dizisindeki herhangi bir boşluk, sonraki tüm isteklerin işlenememesine yol açacaktır.

### Yüksek yük cüzdanları

Bu `cüzdan` türü, akıllı sözleşme depolamasında süresi dolmamış işlenmiş isteklerin tanımlayıcısını saklamaya dayalı bir yaklaşımı izler. Bu yaklaşımda, herhangi bir istek, zaten işlenmiş bir isteğin kopyası olup olmadığının kontrol edilir ve eğer tekrar tespit edilirse, reddedilir. Süre sınırlamasından dolayı, sözleşme sonsuza dek tüm istekleri saklayamaz, ancak süresi dolduğu için işlenemeyenleri kaldırır. Bu `cüzdana` paralel olarak istekler gönderilebilir, ancak bu yaklaşım, istek işlemenin daha karmaşık bir izlenmesini gerektirir.

### Cüzdan dağıtımı

Bir cüzdanı TonLib aracılığıyla dağıtmak için aşağıdakiler gereklidir:  
1. [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L244) veya onun sarmalayıcı işlevleri aracılığıyla bir özel/açık anahtar çifti oluşturun (örnek [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key) içinde). Not: Özel anahtar yerel olarak oluşturulur ve ana makineden çıkmaz.  
2. Etkinleştirilen `cüzdanlardan` birine karşılık gelen [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62) yapısını oluşturun. Şu anda `wallet.v3`, `wallet.v4`, `wallet.highload.v1`, `wallet.highload.v2` mevcut.  
3. Yeni bir `cüzdan` akıllı sözleşmesinin adresini [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283) yöntemi aracılığıyla hesaplayın. İşlem ve saklama ücretlerini düşürmek için varsayılan olarak `0` revizyonunu kullanmayı ve cüzdanları esas zincir `workchain=0` içinde dağıtmayı öneriyoruz.  
4. Hesaplanan adrese biraz Toncoin gönderin. Not: Bu adresin henüz kodu olmadığından ve gelen mesajları işleyemediğinden, onlara `non-bounce` modunda göndermeniz gerekmektedir. `non-bounce` bayrağı, işleme başarısız olsa dahi, paranın geri dönmemesi gerektiğini belirtir. Diğer işlem türleri için `non-bounce` bayrağını kullanmanızı önermiyoruz, özellikle büyük miktarlar taşırken, çünkü geri dönüş mekanizması hatalara karşı bir derece koruma sağlar.  
5. İstenilen [aksiyonu](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154) oluşturun, örneğin, sadece dağıtım için `actionNoop`. Ardından, akıllı sözleşme ile etkileşim başlatmak için [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) ve [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) kullanın.  
6. Sözleşmeyi birkaç saniye içinde [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288) yöntemiyle kontrol edin.

:::tip
Daha fazla bilgi için `Cüzdan Eğitimi` sayfasını okuyun.
:::

### Cüzdan adresinin geçerliliğini kontrol etme

Çoğu SDK, adresi doğrulamanızı zorunlu kılar (ç çoğu, cüzdan oluşturma veya işlem hazırlama sürecinde bunu doğrular), bu nedenle genelde, sizden ek karmaşık adımlar gerektirmez.



  

  ```js
    const TonWeb = require("tonweb")
    TonWeb.utils.Address.isValid('...')
  ```

  
  

  ```python
  package main

  import (
    "fmt"
    "github.com/xssnick/tonutils-go/address"
  )

  if _, err := address.ParseAddr("EQCD39VS5j...HUn4bpAOg8xqB2N"); err != nil {
    return errors.New("geçersiz adres")
  }
  ```

  
  

  ```javascript
  try {
    Address.of("...");
  } catch (e) {
    // geçersiz adres
  }
  ```

  
  

  ```javascript
  try {
    AddrStd("...")
  } catch(e: IllegalArgumentException) {
      // geçersiz adres
  }
  ```

  


:::tip
Tam adres açıklaması için `Akıllı Sözleşme Adresleri` sayfasını okuyun.
:::

## Transferlerle çalışma

### Sözleşmenin işlemlerini kontrol etme

Bir sözleşmenin işlemleri [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) kullanılarak elde edilebilir. Bu yöntem, belirli bir `last_transaction_id`'den başlayarak 10 işlemi elde etmenizi sağlar. Gelen tüm işlemleri işlemeniz için aşağıdaki adımlar takip edilmelidir:  
1. En son `last_transaction_id` [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get) kullanılarak elde edilebilir.  
2. 10 işlemlik liste, `getTransactions` yöntemi aracılığıyla yüklenmelidir.  
3. Ek kaynak içeren ve hedefi hesap adresine eşit olan işlemleri işleyin.  
4. Bir sonraki 10 işlem yüklenmeli ve adımlar 2, 3, 4, 5, tüm gelen işlemlerinizi işleyene kadar tekrarlanmalıdır.

### Gelen/Giden İşlemleri Getirme

İşlem işlemesi sırasında mesaj akışını takip etmek mümkündür. Mesaj akışı bir DAG olduğu için, [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) yöntemini kullanarak mevcut işlemi almak ve `out_msg` aracılığıyla gelen işlemi bulmak veya `in_msg` aracılığıyla giden işlemleri bulmak yeterlidir; bunun için [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) veya [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get) kullanılabilir.




```ts
import { TonClient, Transaction } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { CommonMessageInfoInternal } from '@ton/core';

async function findIncomingTransaction(client: TonClient, transaction: Transaction): Promise<Transaction | null> {
  const inMessage = transaction.inMessage?.info;
  if (inMessage?.type !== 'internal') return null;
  return client.tryLocateSourceTx(inMessage.src, inMessage.dest, inMessage.createdLt.toString());
}

async function findOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<Transaction[]> {
  const outMessagesInfos = transaction.outMessages.values()
    .map(message => message.info)
    .filter((info): info is CommonMessageInfoInternal => info.type === 'internal');
  
  return Promise.all(
    outMessagesInfos.map((info) => client.tryLocateResultTx(info.src, info.dest, info.createdLt.toString())),
  );
}

async function traverseIncomingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const inTx = await findIncomingTransaction(client, transaction);
  // şimdi bu işlem grafiğini geriye doğru izleyebilirsiniz
  if (!inTx) return;
  await traverseIncomingTransactions(client, inTx);
}

async function traverseOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const outTxs = await findOutgoingTransactions(client, transaction);
  // giden işlemlerle bir şey yap
  for (const out of outTxs) {
    await traverseOutgoingTransactions(client, out);
  }
}

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({
    endpoint,
    apiKey: '[API-KEY]',
  });
  
  const transaction: Transaction = ...; // Takip etmeye başlamak için ilk işlemi elde edin
  await traverseIncomingTransactions(client, transaction);
  await traverseOutgoingTransactions(client, transaction);
}

main();
```




### Ödemeleri Gönderme

:::tip
Ödeme işlemlerine dair temel bir örneği [TMA USDT Ödemeleri demo](https://github.com/ton-community/tma-usdt-payments-demo) sayfasından öğrenin.
:::

1. Hizmet, bir `cüzdan` dağıtmalı ve sözleşme yok olmasını önlemek için onu finansmanlı tutmalıdır; saklama ücretleri genel olarak yılda 1 Toncoin'den daha azdır.  
2. Hizmet, kullanıcının `destination_address` ve isteğe bağlı `comment` bilgisini almalıdır. Şu anda, aynı (`destination_address`, `value`, `comment`) setine sahip tamamlanmamış giden ödemeleri engellemeyi veya bu ödemelerin düzgün bir şekilde zamanlanmasını öneriyoruz; böylece, bir sonraki ödeme, önceki onaylanmadan yalnızca başlatılır.  
3. `comment` metni ile [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103) oluşturun.  
4. `destination_address`, boş `public_key`, `amount` ve `msg.dataText` içeren [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113) oluşturun.  
5. Giden mesaj setini içeren [Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154) oluşturun.  
6. Giden ödemeleri göndermek için [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) ve [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) sorgularını kullanın.  
7. Hizmet, `cüzdan` sözleşmesi için [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) yöntemine düzenli olarak sorgu gönderimi yapmalıdır. Onaylanmış işlemleri giden ödemelerle (`destination_address`, `value`, `comment`) eşleştirmek, ödemeleri tamamlanmış olarak işaretlemenizi sağlar; ilgili işlem hash'ini ve lt (mantıksal zaman) kullanıcıya gösterebilirsiniz.  
8. `high-load` cüzdanlarının `v3` istekleri varsayılan olarak 60 saniye süre sınırına sahiptir. Bu süre sonunda işlenmeyen istekler güvenli bir şekilde ağa yeniden gönderilebilir (bkz. adımlar 3-6).

:::caution
Bağlı olan `value` çok küçükse işlem `cskip_no_gas` hatası ile abort edilebilir. Bu durumda Toncoin'ler başarıyla transfer edilir ancak diğer tarafta hiçbir mantık yürütülmez (TVM bile başlamaz). Gaz limitleri hakkında daha fazla bilgiye `buradan` ulaşabilirsiniz.
:::

### İşlem kimliğini Alma

Bir kullanıcının işlem hakkında daha fazla bilgi almak için blockchain'i [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) fonksiyonu aracılığıyla taraması gerektiği keskin bir şekilde belirsiz olabilir.  
Bir mesaj gönderildikten hemen sonra işlem kimliğini almak mümkün değildir; çünkü işlem önce blockchain ağı tarafından onaylanmalıdır.  
Gerekli akış için `Ödemeleri Gönderme` bölümünü dikkatlice okuyun, özellikle 7. maddeyi.

## Fatura tabanlı yaklaşım

Ekli yorumlara dayanan ödemeleri kabul etmek için hizmetin aşağıdakileri yapması gerekir:  
1. `cüzdan` sözleşmesini dağıtın.  
2. Her kullanıcı için benzersiz bir `fatura` oluşturun. uuid32'nin dize biçimi yeterli olacaktır.  
3. Kullanıcılara, hizmetin `cüzdan` sözleşmesine, ekli `fatura` yorumunu göndermeleri yönünde talimat verin.  
4. Hizmet, `cüzdan` sözleşmesi için [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) yöntemini düzenli olarak kontrol etmelidir.  
5. Yeni işlemler için, gelen mesaj çıkartılmaz, `comment` veritabanıyla eşleştirilir ve **gelen mesaj değeri** kullanıcının hesabına yatırılır.

Bir mesajın sözleşmeye getirdiği **gelen mesaj değeri** hesaplamak için işlemi çözümlemek gerekir. Bu, mesaj sözleşmeye ulaştığında gerçekleşir. Bir işlem [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L268) kullanılarak elde edilebilir. Gelen bir cüzdan işlemi için doğru veri, bir gelen mesaj ve sıfır giden mesajdan oluşur. Aksi takdirde, ya cüzdana dış bir mesaj gönderilir; bu durumda sahibi Toncoin harcar ya da cüzdan dağıtılmamıştır ve gelen işlem geri döner.

Her durumda, genel olarak, bir mesajın sözleşmeye getirdiği miktarın hesaplanması, gelen mesajın değerinin giden mesajların değerleri toplamı ve ücretin çıkarılması ile mümkündür: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Teknik olarak, işlem temsilinde `fee`, `storage_fee` ve `other_fee` adında üç farklı alan bulunmaktadır; bunlar toplam ücret, saklama masraflarına bağlı olan ücretin bir kısmı ve işlem masraflarına bağlı olan ücretin bir kısmı anlamına gelir. Sadece birincisi kullanılmalıdır.

### TON Connect ile faturalar

Bir oturum içinde birden fazla ödemenin/işlemin imzalanması gereken dApps için en uygun olanıdır veya bir süre boyunca cüzdan bağlantısını sürdürmeleri gerekir.

- ✅ Cüzdanla kalıcı bir iletişim kanalı vardır, kullanıcının adresi hakkında bilgi edinilebilir.  
- ✅ Kullanıcıların yalnızca bir QR kodu taraması yeterlidir.  
- ✅ Kullanıcının cüzdanda işlemi onaylayıp onaylamadığını öğrenmek mümkündür, dönen BOC ile işlemi takip etmek mümkündür.  
- ✅ Farklı platformlar için hazır SDK’lar ve UI kitleri mevcuttur.  

- ❌ Sadece bir ödeme göndermeniz gerekiyorsa, kullanıcı iki eylem yapmalıdır: cüzdanı bağlamak ve işlemi onaylamak.  
- ❌ Entegrasyon, ton:// bağlantısından daha karmaşıktır.  


Daha Fazla Bilgi Edinin


### ton:// bağlantısı ile faturalar

:::warning
Ton bağlantısı kullanımdan kaldırılmıştır, bunun kullanımından kaçının.
:::

Basit bir kullanıcı akışı için kolay bir entegrasyon gerekiyorsa, ton:// bağlantısını kullanmak uygundur. Tek seferlik ödemeler ve faturalar için en uygun olanıdır.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ Kolay entegrasyon  
- ✅ Cüzdan bağlantısına gerek yok.  

- ❌ Kullanıcıların her ödeme için yeni bir QR kodu taraması gerekir.  
- ❌ Kullanıcının işlemi imzalayıp imzalamadığını takip edemezsiniz.  
- ❌ Kullanıcının adresi hakkında bilgi yok.  
- ❌ Bu tür bağlantıların tıklanabilir olmadığı platformlarda (örneğin, Telegram masaüstü istemcileri için botlardan gelen mesajlar) geçici çözümler gerekmektedir.  

[ton bağlantıları hakkında daha fazla bilgi edinin](https://github.com/tonkeeper/wallet-api#payment-urls)

## Keşif Araçları

Blockchain keşif aracı [https://tonscan.org](https://tonscan.org) 'dir.

Bir işlem bağlantısını keşif aracında oluşturmak için hizmetin lt (mantıksal zaman), işlem hash’i ve hesap adresini alması gerekir (lt ve txhash’in [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) yöntemiyle alındığı hesap adresi). Daha sonra [https://tonscan.org](https://tonscan.org) ve [https://explorer.toncoin.org](https://explorer.toncoin.org/) şu formatta bu tx'in sayfasını gösterebilir:

`https://tonviewer.com/transaction/{txhash as base64url}`  
`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`  
`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

Dikkat edin ki tonviewer ve tonscan, keşif aracındaki bağlantı için işlem hash’i yerine dışa mesaj hash’ini destekler. Dışa mesaj oluşturduğunuzda ve anında bağlantı oluşturmak istiyorsanız bu yararlı olabilir. İşlemler ve mesaj hash'leri hakkında daha fazla bilgiyi `buradan` edinebilirsiniz.

## En İyi Uygulamalar

### Cüzdan Oluşturma




- **toncenter:**
  - [Cüzdan oluşturma + cüzdan adresini alma](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [Cüzdan oluşturma + bakiye alma](https://github.com/ton-community/ton#usage)  





- **xssnick/tonutils-go:**
  - [Cüzdan oluşturma + bakiye alma](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)  





- **psylopunk/pythonlib:**
  - [Cüzdan oluşturma + cüzdan adresini alma](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)

- **yungwine/pytoniq:**
```py
import asyncio

from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer

async def main():
    provider = LiteBalancer.from_mainnet_config(2)
    await provider.start_up()

    mnemonics, wallet = await WalletV4R2.create(provider)
    print(f"{wallet.address=} ve {mnemonics=}")

    await provider.close_all()

if __name__ == "__main__":
    asyncio.run(main())
```





### Farklı Shard'lar için Cüzdan Oluşturma

Ağ yoğunluğunun yüksek olduğu durumlarda, TON blok zinciri `shard'lara` ayrılabilir. Web3 dünyasında bir shard için basit bir analoji, bir ağ segmenti olacaktır.

:::tip
Web2 dünyasında hizmet altyapısını son kullanıcıya mümkün olduğunca yakın olacak şekilde dağıttığımız gibi, TON'da, sözleşmeleri kullanıcının cüzdanıyla veya onunla etkileşimde bulunan herhangi bir sözleşmeyle aynı shard'ta dağıtabiliriz.
:::

Örneğin, kullanıcıların gelecekteki havaalanı hizmeti için ücret topladığı bir DApp, yoğun yük günlerinde kullanıcı deneyimini artırmak için her shard için ayrı cüzdanlar hazırlayabilir. **En yüksek işlem hızını sağlamak için her shard için bir toplama cüzdanı dağıtmanız gerekecektir.**

Bir sözleşmenin shard ön eki `SHARD_INDEX`, adres hash'inin ilk 4 bitine göre tanımlanır. Belirli bir shard'a cüzdan dağıtmak için aşağıdaki kod parçacığına dayanan bir mantık kullanılabilir:

```javascript
import { NetworkProvider, sleep } from '@ton/blueprint';
import { Address, toNano } from "@ton/core";
import { mnemonicNew, mnemonicToPrivateKey} from '@ton/crypto';
import { WalletContractV3R2 } from '@ton/ton';

export async function run(provider?: NetworkProvider) {
  if(!process.env.SHARD_INDEX) {
    throw new Error("Shard index is not specified");
  }

    const shardIdx = Number(process.env.SHARD_INDEX);
    let testWallet: WalletContractV3R2;
    let mnemonic:  string[];
    do {
        mnemonic   = await mnemonicNew(24);
        const keyPair = await mnemonicToPrivateKey(mnemonic);
        testWallet = WalletContractV3R2.create({workchain: 0, publicKey: keyPair.publicKey});
    } while(testWallet.address.hash[0] >> 4 !== shardIdx);

    console.log("Mnemonic for shard found:", mnemonic);

    console.log("Wallet address:",testWallet.address.toRawString());}

if(require.main === module) {
run();
}
```

:::info
Cüzdan sözleşmesi durumunda, mnemonic yerine `subwalletId` kullanılabilir, ancak `subwalletId` [cüzdan uygulamaları](https://ton.org/wallets) tarafından desteklenmemektedir.
:::

Dağıtım tamamlandıktan sonra, aşağıdaki algoritma ile işlem yapabilirsiniz:

1. Kullanıcı DApp sayfasına gelir ve işlem talep eder.
2. DApp, kullanıcıya en yakın cüzdanı alır (4 bit önek ile eşleşir).
3. DApp, kullanıcıya seçilen cüzdana ücreti gönderen bir yük sağlar.

Bu şekilde, mevcut ağ yükünden bağımsız olarak mümkün olan en iyi kullanıcı deneyimini sağlayabileceksiniz.

### Toncoin Yatırma (Toncoin Al)




- **toncenter:**
  - [Toncoin yatırma işlemini işleyin](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [Birden fazla cüzdandan Toncoin yatırma işlemini işleyin](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)





- **xssnick/tonutils-go:**


Yatırımları kontrol etme

```go
package main 

import (
	"context"
	"encoding/base64"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

const (
	num = 10
)

func main() {
	client := liteclient.NewConnectionPool()
	err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client, ton.ProofCheckPolicyFast).WithRetry()

	accountAddr := address.MustParseAddr("0QA__NJI1SLHyIaG7lQ6OFpAe9kp85fwPr66YwZwFc0p5wIu")

	// get yöntemlerini çalıştırmak için güncel blok bilgisine ihtiyacımız var
	b, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	// blokun hazır olduğundan emin olmak için WaitForBlock'u kullanıyoruz,
	// isteğe bağlıdır ancak bizi liteserver blok hazır değil hatalarından kurtarır
	res, err := api.WaitForBlock(b.SeqNo).GetAccount(context.Background(), b, accountAddr)
	if err != nil {
		log.Fatal(err)
	}

	lastTransactionId := res.LastTxHash
	lastTransactionLT := res.LastTxLT

	headSeen := false

	for {
		trxs, err := api.ListTransactions(context.Background(), accountAddr, num, lastTransactionLT, lastTransactionId)
		if err != nil {
			log.Fatal(err)
		}

		for i, tx := range trxs {
			// yalnızca ilk defa lastTransactionLT içermelidir
			if !headSeen {
				headSeen = true
			} else if i == 0 {
				continue
			}

			if tx.IO.In == nil || tx.IO.In.Msg.SenderAddr().IsAddrNone() {
				// harici mesaj atlanmalıdır
				continue
			}

      if tx.IO.Out != nil {
				// gider mesajı yok - bu gelen Toncoin'dir
				continue
			}

			// işlem işle
			log.Printf("transaction hash %s içerisinde bulundu", base64.StdEncoding.EncodeToString(tx.Hash))
		}

		if len(trxs) == 0 || (headSeen && len(trxs) == 1) {
			break
		}

		lastTransactionId = trxs[0].Hash
		lastTransactionLT = trxs[0].LT
	}
}
```






- **yungwine/pytoniq:**


Yatırımları kontrol etme

```python
import asyncio

from pytoniq_core import Transaction

from pytoniq import LiteClient, Address

MY_ADDRESS = Address("kf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM_BP")


async def main():
    client = LiteClient.from_mainnet_config(ls_i=0, trust_level=2)

    await client.connect()

    last_block = await client.get_trusted_last_mc_block()

    _account, shard_account = await client.raw_get_account_state(MY_ADDRESS, last_block)
    assert shard_account

    last_trans_lt, last_trans_hash = (
        shard_account.last_trans_lt,
        shard_account.last_trans_hash,
    )

    while True:
        print(f"Waiting for{last_block=}")

        transactions = await client.get_transactions(
            MY_ADDRESS, 1024, last_trans_lt, last_trans_hash
        )
        toncoin_deposits = [tx for tx in transactions if filter_toncoin_deposit(tx)]
        print(f"Got {len(transactions)=} with {len(toncoin_deposits)=}")

        for deposit_tx in toncoin_deposits:
            # Toncoin yatırma işlemini işle
            print(deposit_tx.cell.hash.hex())

        last_trans_lt = transactions[0].lt
        last_trans_hash = transactions[0].cell.hash


def filter_toncoin_deposit(tx: Transaction):
    if tx.out_msgs:
        return False

    if tx.in_msg:
        return False

    return True


if __name__ == "__main__":
    asyncio.run(main())
```






### Toncoin Çekme (Toncoin Gönder)




- **toncenter:**
  - [Cüzdandan Toncoin'leri toplu olarak çekme](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [Cüzdandan Toncoin çekme](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [Cüzdandan Toncoin çekme](https://github.com/ton-community/ton#usage)





- **xssnick/tonutils-go:**
  - [Cüzdandan Toncoin çekme](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)





- **yungwine/pytoniq:**

```python
import asyncio

from pytoniq_core import Address
from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


MY_MNEMONICS = "bir iki üç ..."
DESTINATION_WALLET = Address("Hedef cüzdan adresi")


async def main():
    provider = LiteBalancer.from_mainnet_config()
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider, MY_MNEMONICS)

    await wallet.transfer(DESTINATION_WALLET, 5)
    
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```





### Sözleşmenin İşlemlerini Alma




- **ton-community/ton:**
  - [getTransaction metodu ile istemci](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)





- **xssnick/tonutils-go:**
  - [İşlemleri alma](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)





- **yungwine/pytoniq:**
  - [İşlemleri alma](https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)





## SDK'lar

Çeşitli programlama dilleri (JS, Python, Golang vb.) için tam SDK listesi `burada` bulunmaktadır.