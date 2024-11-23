# agd ile Sorgular ve İşlemler Yapmak

`agd`, Cosmos SDK'deki `simd`'ye veya Cosmos hub'daki `gaiad`'ya benzer şekilde çalışan Agoric Cosmos Uygulamasıdır. Çoğu `simd`  ve  `agd` içinde benzer şekilde çalışır.

::: tip Dapps Geliştirmek için agd

Bu bölüm, akıllı sözleşmeler ve dapps geliştirme ve dağıtımına yönelik komutlara odaklanmaktadır. Ayrıca bakınız:

- 
- 
- 

:::

::: tip agd Kurulumu

Seçenekler:

-  docker konteynerini kullanarak: `agd status` çalıştırmak için `yarn docker:bash` ardından `agd status` yazın; veya `docker-compose exec agd agd status` komutunu kullanın.
-  yükleyin.

:::

Eğer `agd`'yi argüman olmadan çağırırsak, mevcut komutların bir listesini ekrana yazar:

```
Available Commands:

  help                Help about any command
  keys                Manage your application's keys
  query               Querying subcommands
  status              Query remote node for status
  tx                  Transactions subcommands
  version             Print the application binary version information

Flags:
  -h, --help                help for agd
      --home string         directory for config and data (default $HOME)
```

## Sorgu Komutları

Çoğu durumda, `agd query ...` bir modül adı ile takip edilir, örneğin `bank`. Bir istisna `agd status` komutudur:

## agd status

Uzak düğümü sorgulayarak durumunu kontrol etme

Örnek:

```console
$ agd status
{"NodeInfo":{"protocol_version":{"p2p":"8","block":"11" ... }}}
```

::: tip jq ile Formatlama

Güzel yazılı JSON için ya da belirli kısımları seçmek için çıktıyı  üzerinden iletebilirsiniz.

```console
$ agd status | jq .ValidatorInfo
```

```json
{
  "Address": "B4167E20C19D9B30ACD93865B854555D3823B31C",
  "PubKey": {
    "type": "tendermint/PubKeyEd25519",
    "value": "F9rO2FZ5sliRSRUVYnwWYVS0Ptf8Ll1dIOb6SQkgmTA="
  },
  "VotingPower": "5000"
}
```

:::

Sorgu varsayılan olarak `tcp://localhost:26657` adresindeki bir yerel düğüme gider. Başka bir düğüm kullanmak için:

```console
$ agd status --node https://devnet.rpc.agoric.net:443
{"NodeInfo":{"protocol_version":{"p2p":"8","block":"11" ... }}}
```

::: tip Port Gereklidir

Genellikle, `https` URL'lerinde `:443` portu varsayılan olarak bırakılabilir. Ancak burada bırakılmamalıdır. Aksi takdirde şunu alırız:

```
Hata: gönderme başarısız: Post "https://devnet.rpc.agoric.net": dial tcp: address devnet.rpc.agoric.net: missing port in address
```

:::

## agd query bank balances

Adresle hesap bakiyelerini sorgulama

Örnek:

```
$ addr=agoric14pfrxg63jn6ha0cp6wxkm4nlvswtscrh2pymwm
$ agd query bank balances $addr
balances:
- amount: "331000000"
  denom: ubld
- amount: "4854000000"
  denom: uist
```

**JSON çıktısı** almak için YAML yerine:

```console
$ agd query bank balances $addr -o json
{"balances":[{"denom":"ubld","amount":"331000000"},{"denom":"uist","amount":"4854000000"}],...}
```

## agd query gov proposals

Seçenekli filtreleri karşılayan tüm sayfalı teklifler için sorgulama.

Örnek:

```
$ agd query gov proposals --output json | \
  jq -c '.proposals[] | [.proposal_id,.voting_end_time,.status]'
["1","2023-11-14T17:32:16.665791640Z","PROPOSAL_STATUS_PASSED"]
["2","2023-11-14T17:40:16.450879296Z","PROPOSAL_STATUS_PASSED"]
["3","2023-11-14T17:44:37.432643476Z","PROPOSAL_STATUS_PASSED"]
```

## agd query vstorage keys

VStorage'daki belirtilen yoldaki verileri sorgulama.

Örnek:

```
$ agd query vstorage keys 'published.vaultFactory.managers.manager0.vaults'
children:
- vault0
```

## İşlem Komutları

İşlem yapmak için bir **hesap** oluşturulması ve imza için özel bir anahtar gereklidir.  konteynerinde `--keyring-backend=test` ile kullanılabilecek bir dizi anahtar bulunmaktadır. Bunları görüntülemek için `agd keys list --keyring-backend=test` komutunu kullanın.

Gerçek müzayedeye tabi varlıkları kontrol eden hesaplar için,  gibi bir  kullanmak daha basittir. _Ayrıca bir donanım cüzdanı (örneğin, Ledger) düşünün._

## agd keys add

Yeni bir özel anahtar türetin ve diske şifreleyin.

Kullanım:

```
  agd keys add  [flags]
```

`-i` ile çalıştırıldığında, kullanıcıdan BIP44 yolu, BIP39 anahtarı ve şifre istemi açar. `--recover` bayrağı, bir anahtarı tohum şifresinden kurtarmak için kullanılabilir.

- Ledger cosmos uygulamasıyla uyumlu olmak için varsayılan 564 yerine `--ledger --coin-type 118` kullanın.
- Test için imza istemlerini önlemek için varsayılan işletim sistemi anahtar yönetimini kullanmak yerine `--keyring-backend=test` kullanın. Bu anahtarları `$HOME/.agoric`'ten farklı bir dizinde saklamak için `--home=DIR` kullanın.

## agd tx bank send

Bir hesaptan diğerine fon göndermek.

```
$ src=agoric14pfrxg63jn6ha0cp6wxkm4nlvswtscrh2pymwm
$ dest=agoric1a3zu5aqw255q0tuxzy9aftvgheekw2wedz3xwq
$ amt=12000000ubld
$ agd tx bank send $src $dest $amt \
  --keyring-backend=test --chain-id=agoriclocal \
		--gas=auto --gas-adjustment=1.2 \
		--yes -b block
```

Her zamanki gibi, bayrakların belgeleri için `agd tx bank send --help` komutunu kullanın, örneğin `--yes`, `-b` vb.

## agd tx swingset provision-one

Zoe akıllı sözleşmeleri ile etkileşimde bulunmak için akıllı bir cüzdan sağlama.

Kullanım:

```sh
agd tx swingset provision-one   [[,...]] [flags]
```

Örnek:

```sh
KEY_NAME=user1
NICKNAME=my-wallet
KEYRING_BACKEND="--keyring-backend=test"
ADDRESS=$(agd keys show $KEY_NAME $KEYRING_BACKEND | grep address | awk '{print $3}')

agd tx swingset provision-one $NICKNAME $ADDRESS SMART_WALLET --from $KEY_NAME $KEYRING_BACKEND --chain-id agoriclocal -y -b block
```

Daha fazla bilgi için  içindeki `MsgProvision`'a bakın.

## agd tx swingset install-bundle

```
agd tx swingset install-bundle --compress "@bundle1.json" \
  --from user1 --keyring-backend=test --gas=auto \
  --chain-id=agoriclocal -bblock --yes -o json
```

Ayrıca  web arayüzüne de bakın, özellikle depolama ücretlerini anlamak için.

## agd tx gov submit-proposal swingset-core-eval

Kullanım:

```sh
  agd tx gov submit-proposal swingset-core-eval [[permit.json] [code.js]]... [flags]
```

Örnek:

```
$ SCRIPT=start-game1.js
$ PERMIT=start-game1-permit.json
agd tx gov submit-proposal swingset-core-eval "$PERMIT" "$SCRIPT" \
  --title="Oyun Yeri Sözleşmesini Başlat" --description="Evet $SCRIPT" \
  --deposit=10000000ubld --gas=auto --gas-adjustment=1.2 \
  --from user1 --chain-id agoriclocal --keyring-backend=test \
  --yes -b block
```

 web arayüzü, bunun için güzel bir arayüz sağlar.

## agd tx gov vote

Aktif bir teklif için oy gönderin. Teklif kimliğini  çalıştırarak bulabilirsiniz.

Kullanım:

```
  agd tx gov vote [proposal-id] [option] [flags]
```

Örnek:

```sh
PROPOSAL=13
agd tx gov vote $PROPOSAL yes \
  --keyring-backend test --chain-id agoriclocal --from validator \
  --gas auto --gas-adjustment 1.4 \
  --broadcast-mode block --output json --yes
```