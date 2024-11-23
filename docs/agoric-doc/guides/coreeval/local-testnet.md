---
title: Temel Değerlendirme Teklifleri ile Sözleşmeleri Yayınlama
---

# Temel Değerlendirme Teklifleri ile Sözleşmeleri Yayınlama

Bir sözleşmeyi dağıtmak için:

1. Hedef ağınız / zinciriniz için erişim ve yönetim normlarını kontrol edin.
   - `agoriclocal` tamamen sizin tarafınızdan işletilmektedir ve tam kontrol altındadır.
   - `devnet` gibi  paylaşılmış kaynaklardır.
   - _Ana ağda dağıtım, bu belgenin kapsamı dışındadır; 'e bakınız._
2. İşlem içeriğini oluşturun.
3. Web UI veya CLI araçlarını kullanarak işlemleri imzalayın ve yayınlayın.

## Yerel Agoric Blockchain’e Dağıtım

1.  emin olun:
   `yarn docker:logs` ile zincirinizin çalıştığını kontrol edin; eğer çalışmıyorsa, `yarn start:docker` ile başlatın.

2. `yarn start` kullanarak otomatik olarak:
   1. İşlem içeriğini oluşturun (sözleşme paketi, temel değerlendirme scripti).
   2. `install-bundle` işlemi için yeterli IST’ye sahip olduğunuzu kontrol edin.
   3. İşlemleri imzalayın ve yayınlayın (`install-bundle`, `submit-proposal`), ayrıca
   4. Gönderilen teklifte oy kullanın.

## Sözleşmeleri ve Temel Değerlendirme Scriptlerini Rollup Eklentileri ile Paketleme

Temel değerlendirme scriptleri, modül olarak yüklenmez; bu nedenle herhangi bir `import` veya `export` eklemesi sözdizim hatasıdır. **dapp-agoric-basics** içinde, bir temel değerlendirme scripti geliştirmek ve modül olarak izin vermek için  kullanıyoruz:

- `import { E } from '@endo/far'`
  Bir paket, bu eklemeyi paketleme sırasında kaldırır,
  çünkü temel değerlendirme kapsamı `@endo/far` dışa aktarımlarını içerir.
- `bundleID = ...` güncellenmiş/belleğe alınmış paket özetini kullanarak değiştirilir.
- `main`, scriptin tamamlanma değeri olarak eklenir.
- `permit` dışa aktarımı bir `.json` dosyasına yazılır.

Detaylar için  dosyasına bakın, burada `moduleToScript`, `configureBundleID` ve `emitPermit` rollup eklentilerini nasıl kullanacağınızı bulabilirsiniz.

Çalıştırmak şöyle görünür:

```console
dapp-agoric-basics/contract$ yarn build:deployer
yarn run v1.22.19
$ rollup -c rollup.config.mjs

./src/sell-concert-tickets.proposal.js → bundles/deploy-sell-concert-tickets.js...
bundles add: sell-concert-tickets from ./src/sell-concert-tickets.contract.js
bundles bundled 141 files in bundle-sell-concert-tickets.js at 2024-03-09T16:22:08.531Z
created bundles/deploy-sell-concert-tickets.js in 2.4s
...

dapp-agoric-basics/contract$ cd bundles
dapp-agoric-basics/contract/bundles$ ls deploy-sell* bundle-sell*
bundle-sell-concert-tickets.js          deploy-sell-concert-tickets-permit.json deploy-sell-concert-tickets.js
```

## Yeterince IST’niz Olduğundan Emin Olun

Bir sözleşmeyi kurmanın maliyeti zincir yönetimi tarafından belirlenir.  itibarıyla Kasım 2023, her kilobayt için 0.02 IST’dir.

Yerel bir zincirde, `yarn start` komutu `yarn docker:make mint100` adımını içerir; bu sayede 100 IST alabilirsiniz, bu genellikle yeterli olacaktır. _`mint100`, bir `validator` hesabından bazı ATOM göndererek ve bunları bir kasayı açmak için kullanarak çalışır._

## `scripts/deploy-contract.js` ile Agoriclocal'a Yükleme ve Gönderme

**dapp-agoric-basics** içinde,  sürecin büyük bir kısmını otomatikleştirir. `yarn start` otomatik olarak bunu çalıştırır. `--install src/sell-concert-tickets.contract.js` seçeneği, gerekirse paketi oluşturduktan sonra sözleşmeyi kurmasını belirtir (docker konteyneri içinde ):

```console
dapp-agoric-basics/contract$ yarn start
yarn run v1.22.19
$ yarn docker:make clean start-contract print-key
$ docker compose exec agd make -C /workspace/contract clean start-contract print-key
make: Entering directory '/workspace/contract'
yarn node ./scripts/deploy-contract.js --service . \
        --install src/sell-concert-tickets.contract.js \
        --eval ./src/sell-concert-tickets.proposal.js
yarn node v1.22.21
bundles add: sell-concert-tickets from src/sell-concert-tickets.contract.js
bundles bundled 141 files in bundle-sell-concert-tickets.js at 2024-03-09T16:49:54.859Z
installing sell-concert-tickets b1-8dd96
$$$ agd tx swingset install-bundle @bundles/bundle-sell-concert-tickets.json --gas auto --keyring-backend test --chain-id agoriclocal --from agoric1uddt8l5y2sfanzal42358az5dus563f2wk7ssm --broadcast-mode block --gas auto --gas-adjustment 1.4 --yes --output json
gas estimate: 53922087
{
  id: 'b1-8dd96',
  installTx: 'F18DF8CE296D29BD0283780C402D7C3D22345E13DD04D6B12CEE6AE5B4B9212B',
  height: '1594'
}
follow { delay: 2 } ...
{
  name: 'sell-concert-tickets',
  id: 'b1-8dd96',
  installHeight: '1594',
  installed: true
}
...
```

Bir yan ürün olarak, `bundles/bundle-sell-concert-tickets.json.installed` adlı bir dosya yazılır. Eğer `yarn start` komutunu tekrar çalıştırırsanız, `deploy-contract.js` `.installed` dosyasının güncel olup olmadığını kontrol etmek için `Makefile` kullanır ve yalnızca sözleşmeyi değiştirirseniz `agd tx swingset install-bundle` komutunu tekrarlar.

`--eval ./src/sell-concert-tickets.proposal.js` seçeneği, gerekirse scripti ve izinleri oluşturarak `swingset-core-eval` yönetim teklifini sunmasını belirtir:

```console
...
submit proposal sell-concert-tickets
[
  'bundles/deploy-sell-concert-tickets-permit.json',
  'bundles/deploy-sell-concert-tickets.js'
]
await tx [
  'bundles/deploy-sell-concert-tickets-permit.json',
  'bundles/deploy-sell-concert-tickets.js'
]
$$$ agd tx gov submit-proposal swingset-core-eval bundles/deploy-sell-concert-tickets-permit.json bundles/deploy-sell-concert-tickets.js --title sell-concert-tickets --description sell-concert-tickets --deposit 10000000ubld --keyring-backend test --chain-id agoriclocal --from agoric1jkfphfd8fd7vd7erdttne3k4c0rucu8l22ndhk --broadcast-mode block --gas auto --gas-adjustment 1.4 --yes --output json
gas estimate: 1443920
{
  txhash: '010C912FFC47AE59C33A36906DA5096C8EA8A64247699ABF958F58600E57C59E',
  code: 0,
  height: '1626',
  gas_used: '1028352'
}
...
```

`deploy-contract.js`, bir depozit ekleme ve teklifte oy verme işlemlerinin otomatikleştirilmesini sağlar; ayrıca tüm oylama işlemlerinin tamamlanmasını bekler:

```console
...
await voteLatestProposalAndWait [
  'bundles/deploy-sell-concert-tickets-permit.json',
  'bundles/deploy-sell-concert-tickets.js'
]
{ before: 'deposit', on: '13', delay: 1 } ...
$$$ agd tx gov deposit 13 50000000ubld --keyring-backend test --chain-id agoriclocal --from validator --broadcast-mode block --gas auto --gas-adjustment 1.4 --yes --output json
gas estimate: 418391
$$$ agd tx gov vote 13 yes --keyring-backend test --chain-id agoriclocal --from validator --broadcast-mode block --gas auto --gas-adjustment 1.4 --yes --output json
gas estimate: 105278
Waiting for proposal 13 to pass (status=PROPOSAL_STATUS_VOTING_PERIOD)
...
Waiting for proposal 13 to pass (status=PROPOSAL_STATUS_PASSED)
13 2024-03-09T16:50:36.973940196Z PROPOSAL_STATUS_PASSED
{ step: 'run', propsal: '13', delay: 1 } ...
{
  proposal_id: '13',
  content: {
    '@type': '/agoric.swingset.CoreEvalProposal',
    title: 'sell-concert-tickets',
    description: 'sell-concert-tickets',
    evals: [ [Object] ]
  },
  status: 'PROPOSAL_STATUS_PASSED',
  final_tally_result: { yes: '5000000000', abstain: '0', no: '0', no_with_veto: '0' },
  submit_time: '2024-03-09T16:50:26.973940196Z',
  deposit_end_time: '2024-03-11T16:50:26.973940196Z',
  total_deposit: [ { denom: 'ubld', amount: '60000000' } ],
  voting_start_time: '2024-03-09T16:50:26.973940196Z',
  voting_end_time: '2024-03-09T16:50:36.973940196Z'
}
```

Teklif geçtiğinde, `deploy-contract.js` yeniden gereksiz yere çalışmayı önlemek için bir `deploy-sell-concert-tickets.js.done` dosyası yazılmaktadır.

::: tip Yerel Temel Değerlendirme Teklifleri için Sorun Giderme

`yarn docker:logs` komutunu kullanarak temel değerlendirme scriptinin çalıştırılmasındaki hataları kontrol edin.

:::

## Test Ağlarına Dağıtım (devnet, emerynet, ...)

Test ağlarına erişim ve yönetim normları için 'e bakın. Özellikle:

- Topluluk geliştiricileri yerel bir zincirde test etmenin ötesine geçmek istiyorlarsa, uygulamalarını **devnet**'te denemeye davet edilir. https://devnet.agoric.net/ güncel zincir kimliği, RPC uç noktaları, yazılım sürümü, keşif aracı ve musluk gibi detayları sağlar.
- İster yeni başlıyor olun, ister detaylı bir sorunla boğuşuyor olun,  katılmaktan çekinmeyin.
- Topluluğa hangi sözleşmeyi dağıtmaya niyetli olduğunuzu bildirin  üzerinden.
-  isim hizmetinde her bir kayıt için uygun ve ayırt edici isimler seçin.
- Eşlerinizle 'da sohbet edin. `#get-roles` kanalına giderek `#dev` ve `#devnet` gibi kanallara erişim sağlamak için roller ekleyin.
- Sorun giderme için, ağ düğüm günlüğüne erişim önemlidir.  ile iletişime geçin veya .
- `emerynet`, üretime hazır yazılımın ana ağa geçmeden önceki kıdemlendirmesi için kullanılmaktadır.

 içerisinde, `agoriclocal` zincirinde kullanmak üzere önceden oluşturulmuş bir anahtar ve adres ile  kurulmuştur. **devnet** ve diğer zincirler için kendi hesabınız ve adresiniz olmalıdır. Bir anahtar ve adres oluşturmak için  veya  veya  komutunu kullanabilirsiniz.

 

- teklifinize oy vermek ve stake yapmak için BLD alabilirsiniz.
- Sözleşme depolama ve yürütme masraflarını ödemek için IST alabilirsiniz.

### **cosgov** Web UI ile Yükleme ve Gönderme

Cosmos Teklif Oluşturucu  işlemleri göndermek için rahat bir yoldur. Hem yerel zincire hem de **devnet** gibi diğer ağlara dağıtımı destekler.

`.json` formatında bir sözleşme paketi almanız gerekiyor:

```console
dapp-agoric-basics/contract$ yarn bundle-source --cache-json bundles/ src/sell-concert-tickets.contract.js sell-concert-tickets
bundles/ add: sell-concert-tickets from src/sell-concert-tickets.contract.js
bundles/ bundled 141 files in bundle-sell-concert-tickets.json at 2024-03-09T20:48:43.784Z
```



Ardından, izin ve temel değerlendirme scriptinizi **CoreEval Teklifi** sekmesine bırakın:



Gerekli depozito ve oylama sürelerini not edin.

## Temel Değerlendirme Teklifleri Üzerinde Oy Kullanma

Cosmos yönetiminde olduğu gibi, stakerlar teklifler üzerinde oy kullanır. Oylama dönemini başlatmak için bir depozito gereklidir. Depozito, teklif veto edilmediği sürece geri ödenir. Yönetim parametreleri, minimum depozito ve oylama süresi gibi, zincir yönetimi tarafından belirlenir. Geçerli değeri bulmak için bir keşif aracı kullanın veya `agd query gov params` komutunu çalıştırın. Tipik değerler şunlardır:

| zincir          | oylama süresi | depozito (min) |
| --------------- | -------------- | --------------- |
| `agoriclocal`   | 10 sec        | 1 BLD           |
| **devnet**      | 5 min         | 1 BLD           |
| **emerynet**    | 2 hrs         | 1 BLD           |
| **mainnet**     | 3 gün         | 5000 BLD        |

**devnet** üzerinde, teklifiniz üzerinde başka kişilerden de oy almanız en iyisidir, ancak topluluk gönderiniz iyi karşılanırsa, teklifinizi tek başınıza kabul etmek için yeterli BLD stake etmeniz makuldür.

**devnet**'te bir teklife oy vermek için,  içinde bulun ve oy vermek için Keplr kullanın. Alternatif olarak,  komutunu kullanın.