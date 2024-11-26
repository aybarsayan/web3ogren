---
title: Solana'yı Değişiminize Ekleyin
---

Bu kılavuz, Solana'nın yerel tokenı SOL'u kripto para birimi değişiminize nasıl ekleyeceğinizi açıklar.

## Düğüm Kurulumu

En az iki düğümü yüksek kaliteli bilgisayarlarda veya bulut instance'larında kurmanızı, yeni sürümlere zamanında geçmenizi ve bir izleme aracı ile hizmet operasyonlarınızı takip etmenizi şiddetle öneriyoruz.

:::tip
**Öneri:** Bu kurulum, aşağıdakileri sağlar:
- veri almak ve para çekme işlemlerini göndermek için Solana ana ağ-beta kümesine kendi kendine yönetilen bir geçit
- ne kadar tarihsel blok verisinin saklandığını tam kontrol
- bir düğüm arızalansa bile hizmet kullanılabilirliğinizi sürdürme
:::

Solana düğümleri, hızlı bloklarımızı ve yüksek TPS'yi işlemek için nispeten yüksek hesaplama gücü gerektirir. Özel gereksinimler için lütfen [donanım önerilerine](https://docs.solanalabs.com/operations/requirements) bakın.

Bir API düğümü çalıştırmak için:

1. `Solana komut satırı araç takımlarını yükleyin`
2. Aşağıdaki parametrelerle doğrulayıcıyı başlatın:

```shell
solana-validator \
  --ledger <LEDGER_PATH> \
  --identity <VALIDATOR_IDENTITY_KEYPAIR> \
  --entrypoint <CLUSTER_ENTRYPOINT> \
  --expected-genesis-hash <EXPECTED_GENESIS_HASH> \
  --rpc-port 8899 \
  --no-voting \
  --enable-rpc-transaction-history \
  --limit-ledger-size \
  --known-validator <VALIDATOR_ADDRESS> \
  --only-known-rpc
```

`--ledger` kısmını istediğiniz defter depolama konumu için, `--rpc-port` kısmını ise açmak istediğiniz port için özelleştirin.

`--entrypoint` ve `--expected-genesis-hash` parametreleri, katılmakta olduğunuz kümeye özgüdür.
[Mainnet Beta için güncel parametreler](https://docs.solanalabs.com/clusters/available#example-solana-validator-command-line-2)

`--limit-ledger-size` parametresi, düğümünüzün diskinde saklayacağı ne kadar defter `shred` bulunduracağını belirtmenizi sağlar. Bu parametreyi dahil etmezseniz, doğrulayıcı tüm defteri saklar ve disk alanı kalmayana kadar işlemeye devam eder. Varsayılan değer, defter disk kullanımını 500GB altında tutmaya çalışır. İstenirse `--limit-ledger-size` argumentine bir argüman ekleyerek daha az veya daha fazla disk kullanımı talep edilebilir. Varsayılan limit değeri için `solana-validator --help` komutunu kontrol edin. Özel bir limit değeri seçimi ile ilgili daha fazla bilgi [burada mevcuttur](https://github.com/solana-labs/solana/blob/583cec922b6107e0f85c7e14cb5e642bc7dfb340/core/src/ledger_cleanup_service.rs#L15-L26).

Bir veya daha fazla `--known-validator` parametresi belirtilmesi, kötü niyetli bir anlık görüntüden başlatılmanızı engelleyebilir.
[Bilinen doğrulayıcılarla başlatmanın değerine dair daha fazlası](https://docs.solanalabs.com/operations/guides/validator-start#known-validators)

Düşünmek için isteğe bağlı parametreler:

- `--private-rpc`, RPC portunuzun diğer düğümler tarafından kullanılmak üzere yayımlanmasını engeller.
- `--rpc-bind-address`, RPC portunu bağlamak için farklı bir IP adresi belirtmenizi sağlar.

### Otomatik Yeniden Başlatmalar ve İzleme

Her bir düğümünüzü çıkışta otomatik olarak yeniden başlatacak şekilde yapılandırmanızı öneririz, böylece mümkün olduğunca az veri kaybı yaşanır. Solana yazılımını bir systemd hizmeti olarak çalıştırmak harika bir seçenektir.

:::info
İzleme için [`solana-watchtower`](https://github.com/solana-labs/solana/blob/master/watchtower/README.md) sağlıyoruz. Bu izleyici, doğrulayıcınızı izleyebilir ve `solana-validator` sürecinin sağlıksız olduğunu tespit edebilir. Doğrudan Slack, Telegram, Discord veya Twilio üzerinden sizi bilgilendirecek şekilde yapılandırılabilir. Ayrıntılar için `solana-watchtower --help` komutunu çalıştırın.
:::

```shell
solana-watchtower --validator-identity <YOUR VALIDATOR IDENTITY>
```

> Solana Watchtower için en iyi uygulamalar hakkında daha fazla bilgi bulabilirsiniz
> [burada](https://docs.solanalabs.com/operations/best-practices/monitoring#solana-watchtower).

#### Yeni Yazılım Sürüm Duyuruları

Yeni yazılımları sık sık (haftada yaklaşık 1 sürüm) yayımlıyoruz. Bazen daha yeni sürümler uyumsuz protokol değişiklikleri içerir, bu nedenle blok işlemlerinde hata yaşamamak için zamanında yazılım güncellemeleri gereklidir.

Her türlü sürüm için resmi duyurularımız (normal ve güvenlik) `#mb-announcement` adında bir [discord](https://solana.com/discord) kanalında iletilir (`mb`, `mainnet-beta` için bir kısaltmadır).

Stake edilmiş doğrulayıcılar gibi, her değişim işletilen doğrulayıcıların normal bir sürüm duyurusundan sonraki iş günü veya iki içinde en erken convenience içinde güncellenmesini bekliyoruz. Güvenlikle ilgili sürümler için daha acil önlemler alınması gerekebilir.

### Defter Sürekliliği

Varsayılan olarak, her bir düğümünüz, bilinen bir doğrulayıcı tarafından sağlanan bir anlık görüntüden başlatılacaktır. Bu anlık görüntü, zincirin mevcut durumunu yansıtır, ancak tam tarihsel defteri içermez. Eğer düğümlerinizden biri çıkış yapar ve yeni bir anlık görüntüden başlatılırsa, o düğümde defterde bir boşluk olabilir. Bu sorunları önlemek için, `solana-validator` komutunuza tarihsel defter verilerini almak için `--no-snapshot-fetch` parametresini ekleyin.

Başlangıçta `--no-snapshot-fetch` parametresini geçmeyin çünkü bir düğümün genesis bloktan tamamen başlatılması mümkün değildir. Bunun yerine önce bir anlık görüntüden başlatın ve ardından yeniden başlatmalar için `--no-snapshot-fetch` parametresini ekleyin.

:::warning
Ağda bulunan diğer düğümlerden alınabilecek tarihsel defter miktarının herhangi bir zamanda sınırlı olduğunu belirtmek önemlidir. Eğer doğrulayıcılarınız önemli bir kesinti yaşarsa, ağa tekrar yetişemeyebilirler ve bilinen bir doğrulayıcıdan yeni bir anlık görüntü indirmek zorunda kalacaklardır. Bu durumda doğrulayıcılarınız, doldurulamayacak bir tarihsel defter verisi boşluğuna sahip olacaktır.
:::

### Doğrulayıcı Portunu Kısıtlamak

Doğrulayıcı, diğer Solana doğrulayıcılarından gelen inbound trafiğin sağlanabilmesi için çeşitli UDP ve TCP portlarının açık olmasını gerektirir. Bu en verimli çalışma modudur ve kesinlikle önerilmektedir, ancak doğrulayıcıyı yalnızca bir başka Solana doğrulayıcısından gelen inbound trafiği gerektirecek şekilde sınırlamak mümkündür.

Öncelikle `--restricted-repair-only-mode` argümanını ekleyin. Bu, doğrulayıcının kısıtlı bir modda çalışmasına neden olacak ve diğer doğrulayıcılardan gelen itmeleri almayacak, bunun yerine diğer doğrulayıcılardan blokları sürekli olarak talep etmek zorunda kalacaktır.

Doğrulayıcı, yalnızca _Gossip_ ve _ServeR_ ("serve repair") portlarını kullanarak diğer doğrulayıcılara UDP paketleri iletecek ve yalnızca _Gossip_ ve _Repair_ portlarında UDP paketleri alacaktır.

_Gossip_ portu iki yönlüdür ve doğrulayıcınızın kümeyle iletişimde kalmasına olanak tanır. Doğrulayıcınız, onarım talepleri için ağıdan yeni bloklar almak üzere _ServeR_ üzerinden iletimde bulunur, çünkü Turbine artık devre dışıdır. Doğrulayıcınız daha sonra diğer doğrulayıcılardan _Repair_ portunda onarım yanıtları alacaktır.

Doğrulayıcıyı yalnızca bir veya daha fazla doğrulayıcıdan blok talep edecek şekilde daha da kısıtlamak için, o doğrulayıcının kimlik pubkey'ini belirleyin ve her PUBKEY için `--gossip-pull-validator PUBKEY --repair-validator PUBKEY` argümanlarını ekleyin. Bu, eklediğiniz her doğrulayıcı üzerinde doğrulayıcınızın bir kaynak tüketimi olmasına neden olacaktır, bu nedenle bunu yalnızca hedef doğrulayıcıyla danışarak dikkatli bir şekilde yapın.

Doğrulayıcınız artık yalnızca açıkça belirtilmiş doğrulayıcılarla iletişim kurmalı ve yalnızca _Gossip_, _Repair_ ve _ServeR_ portlarında işlem yapmalıdır.

## Para Yatırma Hesaplarını Ayarlama

Solana hesaplarının herhangi bir zincir üzeri başlatma gereksinimi yoktur; bir miktar SOL içerdiğinde, var olurlar. Değişiminiz için bir para yatırma hesabı kurmak üzere, herhangi bir cüzdan aracımızı kullanarak bir Solana anahtar çiftini oluşturun
[önermekteyiz](https://docs.solanalabs.com/cli/wallets).

Her bir kullanıcınız için benzersiz bir para yatırma hesabı kullanmanızı öneririz.

Solana hesapları, SOL içinde 2 yıl değerinde `kira` bulundurarak kira muaf olacak şekilde yapılmalıdır. Para yatırma hesaplarınız için en az kira muaf bakiyeyi bulmak için,
`getMinimumBalanceForRentExemption` uç noktasını` sorgulayın:

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getMinimumBalanceForRentExemption",
  "params": [0]
}'
```

##### Sonuç

```json
{ "jsonrpc": "2.0", "result": 890880, "id": 1 }
```

### Çevrimdışı Hesaplar

Bir veya daha fazla toplama hesabının anahtarlarını çevrimdışı tutmayı düşünebilirseniz, daha fazla güvenlik sağlamak için. Eğer öyleyse, SOL'u sıcak hesaplara taşımak için [çevrimdışı yöntemlerimizi](https://docs.solanalabs.com/cli/examples/offline-signing) kullanmanız gerekecektir.

## Para Yatırma İşlemlerini Dinleme

Bir kullanıcı SOL'u değişiminize yatırmak istediğinde, onları uygun para yatırma adresine bir transfer göndermeye yönlendirin.

### Sürümleme İşlemleri Geçişi

Ana ağ Beta ağı sürüm işlemeleri işlemeye başladığında, değişimlerin **DEĞİŞİKLİK YAPMASI GEREKİYOR**. Hiçbir değişiklik yapılmazsa, para yatırma tespitleri düzgün çalışmayacaktır çünkü bir sürüm işlemi veya sürüm işlemleri içeren bir bloğun getirilmesi bir hata döndürecektir.

- `{"maxSupportedTransactionVersion": 0}`

  `maxSupportedTransactionVersion` parametresi, para yatırma tespitinin kesintiye uğramaması için `getBlock` ve `getTransaction` isteklerine eklenmelidir. En son işlem sürümü `0`'dır ve maksimum desteklenen işlem sürümü değeri olarak belirtilmelidir.

:::note
Sürüm işlemleri, kullanıcıların zincir üzerindeki adres arama tablolarından yüklenen başka bir hesap anahtarları setini kullanarak işlemler oluşturmalarına izin verdiğini anlamak önemlidir.
:::

- `{"encoding": "jsonParsed"}`

  Bloklar ve işlemler alırken, artık `"jsonParsed"` kodlamasını kullanmanız önerilmektedir çünkü bu kodlama, mesajdaki `"accountKeys"` listesinde tüm işlem hesap anahtarlarını (arama tablolarından gelenleri de dahil) içerir. Bu, `preBalances` / `postBalances` ve `preTokenBalances` / `postTokenBalances` içinde ayrıntılı olarak belirtilen bakiye değişimlerini çözümlemeyi basitleştirir.

  Bunun yerine `"json"` kodlaması kullanılırsa, `preBalances` / `postBalances` ve `preTokenBalances` / `postTokenBalances` içindeki girdiler `"accountKeys"` listesinde **YOK** olan hesap anahtarlarına atıfta bulunabilir ve işlem meta verilerindeki `"loadedAddresses"` girdileri kullanılarak çözülmesi gerekebilir.

### Blokları İzleme

Değişiminizdeki tüm para yatırma hesaplarını takip etmek için, her onaylı bloğu sorgulayın ve ilginç adresleri kontrol edin, Solana API düğümünüzün JSON-RPC hizmetini kullanarak.

- Hangi blokların mevcut olduğunu belirlemek için, önceki işlemiş olduğunuz son bloğu başlangıç slot parametresi olarak geçirerek bir `getBlocks` isteği gönderin:

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getBlocks",
  "params": [160017005, 160017015]
}'
```

##### Sonuç

```json
{
  "jsonrpc": "2.0",
  "result": [
    160017005, 160017006, 160017007, 160017012, 160017013, 160017014, 160017015
  ],
  "id": 1
}
```

Her slot bir blok üretmediğinden, tamsayı dizisinde boşluklar olabilir.

- Her blok için, içeriğini almak amacıyla bir `getBlock` isteği gönderin:

### Blok Alım İpuçları

- `{"rewards": false}`

Varsayılan olarak, alınan bloklar her blok üzerindeki doğrulayıcı ücretleri ve çağ dönemleri üzerindeki staking ödülleri hakkında bilgiler döndürmektedir. Eğer bu bilgilere ihtiyacınız yoksa, "rewards" parametresi ile bunu devre dışı bırakın.

- `{"transactionDetails": "accounts"}`

Varsayılan olarak, alınan bloklar çok fazla işlem bilgisi ve hesap bakiyelerini takip etmek için gerekli olmayan meta veriler döndürmektedir. "transactionDetails" parametresini ayarlayarak blok alımını hızlandırın.

```shell
curl https://api.devnet.solana.com -X POST -H 'Content-Type: application/json' -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getBlock",
  "params": [
    166974442,
    {
      "encoding": "jsonParsed",
      "maxSupportedTransactionVersion": 0,
      "transactionDetails": "accounts",
      "rewards": false
    }
  ]
}'
```

##### Sonuç

```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockHeight": 157201607,
    "blockTime": 1665070281,
    "blockhash": "HKhao674uvFc4wMK1Cm3UyuuGbKExdgPFjXQ5xtvsG3o",
    "parentSlot": 166974441,
    "previousBlockhash": "98CNLU4rsYa2HDUyp7PubU4DhwYJJhSX9v6pvE7SWsAo",
    "transactions": [
      ... (omit)
      {
        "meta": {
          "err": null,
          "fee": 5000,
          "postBalances": [
            1110663066,
            1,
            1040000000
          ],
          "postTokenBalances": [],
          "preBalances": [
            1120668066,
            1,
            1030000000
          ],
          "preTokenBalances": [],
          "status": {
            "Ok": null
          }
        },
        "transaction": {
          "accountKeys": [
            {
              "pubkey": "9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde",
              "signer": true,
              "source": "transaction",
              "writable": true
            },
            {
              "pubkey": "11111111111111111111111111111111",
              "signer": false,
              "source": "transaction",
              "writable": false
            },
            {
              "pubkey": "G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o",
              "signer": false,
              "source": "lookupTable",
              "writable": true
            }
          ],
          "signatures": [
            "2CxNRsyRT7y88GBwvAB3hRg8wijMSZh3VNYXAdUesGSyvbRJbRR2q9G1KSEpQENmXHmmMLHiXumw4dp8CvzQMjrM"
          ]
        },
        "version": 0
      },
      ... (omit)
    ]
  },
  "id": 1
}
```

`preBalances` ve `postBalances` alanları, her bir hesapta bakiye değişimini takip etmenizi sağlar, tüm işlemi çözümlemeye gerek kalmadan. Bu listede her bir hesabın başlangıç ve bitiş bakiyeleri bulunmaktadır ve `lamportlar` ile indekslenmiştir. Örneğin, ilgilendiğiniz para yatırma adresi `G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o` ise, bu işlem 1040000000 - 1030000000 = 10,000,000 lamport = 0.01 SOL transferini temsil eder.

İşlem türü veya diğer ayrıntılar hakkında daha fazla bilgiye ihtiyacınız varsa, RPC'den blok isteğinde bulunabilir ve onu ya [Rust SDK](https://github.com/solana-labs/solana) ya da [Javascript SDK](https://github.com/solana-labs/solana-web3.js) kullanarak çözümleyebilirsiniz.

### Adres Geçmişi

Ayrıca belirli bir adresin işlem geçmişini sorgulayabilirsiniz. Bu, genel olarak tüm para yatırma adreslerinizi bütün slotlar üzerinde takip etmek için geçerli bir yöntem değildir, ancak belirli bir zaman diliminde birkaç hesabı incelemek için faydalı olabilir.

- API düğümüne bir `getSignaturesForAddress` isteği gönderin:

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getSignaturesForAddress",
  "params": [
    "3M2b3tLji7rvscqrLAHMukYxDK2nB96Q9hwfV6QkdzBN",
    {
      "limit": 3
    }
  ]
}'
```

##### Sonuç

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "blockTime": 1662064640,
      "confirmationStatus": "finalized",
      "err": null,
      "memo": null,
      "signature": "3EDRvnD5TbbMS2mCusop6oyHLD8CgnjncaYQd5RXpgnjYUXRCYwiNPmXb6ZG5KdTK4zAaygEhfdLoP7TDzwKBVQp",
      "slot": 148697216
    },
    {
      "blockTime": 1662064434,
      "confirmationStatus": "finalized",
      "err": null,
      "memo": null,
      "signature": "4rPQ5wthgSP1kLdLqcRgQnkYkPAZqjv5vm59LijrQDSKuL2HLmZHoHjdSLDXXWFwWdaKXUuryRBGwEvSxn3TQckY",
      "slot": 148696843
    },
    {
      "blockTime": 1662064341,
      "confirmationStatus": "finalized",
      "err": null,
      "memo": null,
      "signature": "36Q383JMiqiobuPV9qBqy41xjMsVnQBm9rdZSdpbrLTGhSQDTGZJnocM4TQTVfUGfV2vEX9ZB3sex6wUBUWzjEvs",
      "slot": 148696677
    }
  ],
  "id": 1
}
```

- Her imza için, işlem ayrıntılarını almak amacıyla bir `getTransaction` isteği gönderin:

```shell
curl https://api.devnet.solana.com -X POST -H 'Content-Type: application/json' -d '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"getTransaction",
  "params":[
    "2CxNRsyRT7y88GBwvAB3hRg8wijMSZh3VNYXAdUesGSyvbRJbRR2q9G1KSEpQENmXHmmMLHiXumw4dp8CvzQMjrM",
    {
      "encoding":"jsonParsed",
      "maxSupportedTransactionVersion":0
    }
  ]
}'
```

##### Sonuç

```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockTime": 1665070281,
    "meta": {
      "err": null,
      "fee": 5000,
      "innerInstructions": [],
      "logMessages": [
        "Program 11111111111111111111111111111111 invoke [1]",
        "Program 11111111111111111111111111111111 success"
      ],
      "postBalances": [1110663066, 1, 1040000000],
      "postTokenBalances": [],
      "preBalances": [1120668066, 1, 1030000000],
      "preTokenBalances": [],
      "rewards": [],
      "status": {
        "Ok": null
      }
    },
    "slot": 166974442,
    "transaction": {
      "message": {
        "accountKeys": [
          {
            "pubkey": "9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde",
            "signer": true,
            "source": "transaction",
            "writable": true
          },
          {
            "pubkey": "11111111111111111111111111111111",
            "signer": false,
            "source": "transaction",
            "writable": false
          },
          {
            "pubkey": "G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o",
            "signer": false,
            "source": "lookupTable",
            "writable": true
          }
        ],
        "addressTableLookups": [
          {
            "accountKey": "4syr5pBaboZy4cZyF6sys82uGD7jEvoAP2ZMaoich4fZ",
            "readonlyIndexes": [],
            "writableIndexes": [3]
          }
        ],
        "instructions": [
          {
            "parsed": {
              "info": {
                "destination": "G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o",
                "lamports": 10000000,
                "source": "9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde"
              },
              "type": "transfer"
            },
            "program": "system",
            "programId": "11111111111111111111111111111111"
          }
        ],
        "recentBlockhash": "BhhivDNgoy4L5tLtHb1s3TP19uUXqKiy4FfUR34d93eT"
      },
      "signatures": [
        "2CxNRsyRT7y88GBwvAB3hRg8wijMSZh3VNYXAdUesGSyvbRJbRR2q9G1KSEpQENmXHmmMLHiXumw4dp8CvzQMjrM"
      ]
    },
    "version": 0
  },
  "id": 1
}
```

## Para Çekme İşlemleri

Bir kullanıcının SOL'u çekme talebini karşılamak için, bir Solana transfer işlemi oluşturmanız ve bunu API düğümüne yönlendirmek üzere iletmeniz gerekmektedir.

### Senkron

Senkron bir transfer yaparak Solana kümesine göndermek, transferin başarılı ve küme tarafından onaylanmasını kolayca sağlamanızı sağlar.

Solana'nın komut satırı aracı, transfer işlemlerini oluşturmak, göndermek ve onaylamak için basit bir komut olan `solana transfer` sunar. Bu yöntem varsayılan olarak, işlem küme tarafından onaylanana kadar stderr'de ilerlemeyi bekleyecek ve takip edecektir. Eğer işlem başarısız olursa, işlem hatalarını rapor edecektir.

```shell
solana transfer <USER_ADDRESS> <AMOUNT> --allow-unfunded-recipient --keypair <KEYPAIR> --url http://localhost:8899
```

:::danger
**Önemli:** [Solana Javascript SDK](https://github.com/solana-labs/solana-web3.js), JS ekosistemi için benzer bir yaklaşım sunar. Bir transfer işlemi oluşturmak için `SystemProgram`'ı kullanın ve `sendAndConfirmTransaction` yöntemini kullanarak gönderin.
:::


### Asenkron

Daha fazla esneklik için, para çekme işlemlerini asenkron olarak gönderebilirsiniz. Bu durumlarda, işlemin başarılı olduğunu ve küme tarafından tamamlandığını doğrulamak sizin sorumluluğunuzdadır.

:::note
Her işlem, canlılığını belirtmek için bir `yakın blok hash'ine` sahiptir. Bu blok hash'i süresi dolmadan, onaylanmamış veya küme tarafından tamamlanmamış görünen bir para çekme transferini yeniden denemek **kritik** öneme sahiptir. Aksi takdirde, çift harcama riskiyle karşı karşıya kalırsınız. Daha fazla bilgi için `blok hash süresi dolma` bölümüne bakın.
:::

Öncelikle, `getFees` uç noktasını veya CLI komutunu kullanarak yakın bir blok hash'i alın:

```shell
solana fees --url http://localhost:8899
```

Komut satırı aracında, `--no-wait` argümanını geçerek bir transferi asenkron olarak gönderebilir ve `--blockhash` argümanıyla yakın blok hash'inizi ekleyebilirsiniz:

```shell
solana transfer <KULLANICI_ADRESİ> <MİKTAR> --no-wait --allow-unfunded-recipient --blockhash <YAKIN_BLOK_HASHİ> --keypair <ANAHTAR_PAFTA> --url http://localhost:8899
```

Ayrıca, işlemi manuel olarak oluşturabilir, imzalayabilir ve serileştirebilir ve bunu JSON-RPC `sendTransaction` uç noktasını kullanarak kümeye gönderebilirsiniz.

---

#### İşlem Onayları ve Kesinlik

Bir grup işlemin durumunu, `getSignatureStatuses` JSON-RPC uç noktasını kullanarak alın. `confirmations` alanı, işlemin işlendiği tarihten itibaren ne kadar `onaylı blok` geçtiğini bildirir. Eğer `confirmations: null` ise, işlem `tamamlanmış` demektir.

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"getSignatureStatuses",
  "params":[
    [
      "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW",
      "5j7s6NiJS3JAkvgkoc18WVAsiSaci2pxB2A6ueCJP4tprA2TFg9wSyTLeYouxPBJEMzJinENTkpA52YStRW5Dia7"
    ]
  ]
}'
```

##### Sonuç

```json
{
  "jsonrpc": "2.0",
  "result": {
    "context": {
      "slot": 82
    },
    "value": [
      {
        "slot": 72,
        "confirmations": 10,
        "err": null,
        "status": {
          "Ok": null
        }
      },
      {
        "slot": 48,
        "confirmations": null,
        "err": null,
        "status": {
          "Ok": null
        }
      }
    ]
  },
  "id": 1
}
```

---

#### Blok Hash Süresi Dolma

Belirli bir blok hash'inin hala geçerli olup olmadığını, blok hash'ini bir parametre olarak içeren `getFeeCalculatorForBlockhash` isteği göndererek kontrol edebilirsiniz. Eğer yanıt değeri `null` ise, blok hash'i süresi dolmuş demektir ve o blok hash'ini kullanan para çekme işlemi asla başarılı olmamalıdır.

---

### Kullanıcı Tarafından Sağlanan Hesap Adreslerinin Para Çekme için Doğrulanması

Para çekme işlemleri geri alınamaz olduğundan, kullanıcı tarafından sağlanan hesap adresinin doğrulanması, kullanıcı fonlarının yanlışlıkla kaybını önlemek için para çekme işlemi onaylanmadan önce iyi bir uygulama olabilir.

#### Temel Doğrulama

Solana adresleri, bitcoin base58 alfabesi ile kodlanmış 32 baytlık bir dizi olup, aşağıdaki düzenli ifadeye uyan bir ASCII metin dizesi oluşturur:

```text
[1-9A-HJ-NP-Za-km-z]{32,44}
```

Bu kontrol, kendi başına yetersizdir çünkü Solana adresleri kontrol edilemez, bu nedenle yazım hataları tespit edilemez. Kullanıcının girdiği dizeyi daha fazla doğrulamak için, dize çözülebilir ve elde edilen bayt dizisinin uzunluğunun 32 olduğu doğrulanabilir. Ancak, bir karakterin eksik olması, ters karakterler ve büyük/küçük harf dikkate alınmadan gibi tür yazım hataları nedeniyle 32 bayta dekode olabilen bazı adresler vardır.

#### İleri Düzey Doğrulama

Yukarıda bahsedilen yazım hatalarına karşı duyarlılıklar nedeniyle, bir aday para çekme adresinin bakiyesi sorgulanmalı ve eğer sıfırdan farklı bir bakiye keşfedilirse, kullanıcıdan onay alması istenmelidir.

#### Geçerli ed25519 pubkey kontrolü

Solana'daki normal bir hesabın adresi, 256 bit ed25519 genel anahtarının Base58 ile kodlanmış bir dizesidir. Tüm bit desenleri ed25519 eğrisi için geçerli genel anahtarlar değildir, bu nedenle kullanıcı tarafından sağlanan hesap adreslerinin en azından geçerli ed25519 genel anahtarları olduğundan emin olmak mümkündür.

---

#### Java

Kullanıcı tarafından sağlanan bir adresin geçerli bir ed25519 genel anahtarı olarak doğrulanmasına dair bir Java örneği:

Aşağıdaki kod örneği, Maven kullanıyorsunuz varsayılarak hazırlanmıştır.

`pom.xml`:

```xml
<repositories>
  ...
  <repository>
    <id>spring</id>
    <url>https://repo.spring.io/libs-release/</url>
  </repository>
</repositories>

...

<dependencies>
  ...
  <dependency>
      <groupId>io.github.novacrypto</groupId>
      <artifactId>Base58</artifactId>
      <version>0.1.3</version>
  </dependency>
  <dependency>
      <groupId>cafe.cryptography</groupId>
      <artifactId>curve25519-elisabeth</artifactId>
      <version>0.1.0</version>
  </dependency>
<dependencies>
```

```java
import io.github.novacrypto.base58.Base58;
import cafe.cryptography.curve25519.CompressedEdwardsY;

public class PubkeyValidator
{
    public static boolean verifyPubkey(String userProvidedPubkey)
    {
        try {
            return _verifyPubkeyInternal(userProvidedPubkey);
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean _verifyPubkeyInternal(String maybePubkey) throws Exception
    {
        byte[] bytes = Base58.base58Decode(maybePubkey);
        return !(new CompressedEdwardsY(bytes)).decompress().isSmallOrder();
    }
}
```

---

## Minimum Para Yatırma ve Çekme Miktarları

Her SOL yatırma ve çekme işlemi, ilgili hesap için minimum kiradan muaf bakiyeden büyük veya eşit olmalıdır (veri tutmayan basit bir SOL hesabı), bu da şu anda: 0.000890880 SOL

Benzer şekilde, her depo hesap en az bu bakiyeyi içermelidir.

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getMinimumBalanceForRentExemption",
  "params": [0]
}'
```

##### Sonuç

```json
{ "jsonrpc": "2.0", "result": 890880, "id": 1 }
```

---

## Öncelik Ücretleri ve Hesaplama Birimleri

Yüksek talep dönemlerinde, bir işlemin, doğrulayıcıların bu tür işlemleri bloklarına dahil etmek için daha yüksek ekonomik değere sahip diğer işlemleri seçmesi nedeniyle süresi dolabilir. Solana'daki geçerli işlemler, Öncelik Ücretleri düzgün bir şekilde uygulanmazsa gecikebilir veya düşürülebilir.

`Öncelik Ücretleri`, blokların içine işlem dahil edilmesini sağlamak ve bu tür durumlarda teslimatın sağlanmasına yardımcı olmak için `temel İşlem Ücretleri` üzerine eklenebilecek ek ücretlerdir.

Bu öncelik ücretleri, ödenecek istenen öncelik ücretini ayarlayan özel bir Hesaplama bütçesi talimatı eklenerek işleme eklenir.

:::warning
Bu talimatları uygulamama, ağ kesintilerine ve düşen işlemlere yol açabilir. Solana’yı destekleyen her borsa, kesintileri önlemek için öncelik ücretlerini kullanmaları şiddetle önerilir.
:::

### Öncelik Ücreti Nedir?

Öncelik Ücretleri, ağ üzerindeki bloklara dahil edilmesi ekonomik olarak çekici hale getirmek için işlemlere eklenen mikro-lamportlara göre fiyatlandırılır (örneğin, küçük SOL miktarları).

### Öncelik Ücreti ne kadar olmalı?

Öncelik ücretinizi ayarlama yöntemi, son dönem öncelik ücretlerini sorgulamayı içermeli ve bu ağ için çekici olabilecek bir ücret belirlemelidir. `getRecentPrioritizationFees` RPC yöntemi kullanarak, bir işlemin son bir blokta yer alması için gereken öncelik ücretlerini sorgulayabilirsiniz.

Bu öncelik ücretlerini ayarlama stratejisi, kullanım durumunuza bağlı olarak değişecektir. Bunun “kapsayıcı” bir yolu yoktur. Öncelik Ücretlerinizi ayarlamak için bir strateji, işlem başarı oranınızı hesaplamak ve ardından son işlem ücretleri API'sine karşı öncelik ücretinizi artırmak ve buna göre ayarlamak olabilir. Öncelik Ücretlerinin fiyatlandırması, ağdaki etkinlik ve diğer katılımcılar tarafından verilen teklifler doğrultusunda dinamik olacaktır; sadece geçmişte bilinebilir.

:::tip
`getRecentPrioritizationFees` API çağrısını kullanmanın bir zorluğu, yalnızca her blok için en düşük ücreti dönebilmesidir. Bu genellikle sıfır olacaktır, bu da gerekli olan öncelik ücretini kaçırmak için tam olarak faydalı bir tahmin değildir.
:::

`getRecentPrioritizationFees` API'si hesapların genel anahtarlarını parametre olarak alır ve ardından bu hesaplar için minimum öncelik ücretlerinin en yükseğini döndürür. Hiçbir hesap belirtilmezse, API blok için en düşük ücreti döndürür; bu genellikle sıfırdır (blok dolu olmadıkça).

Borsalar ve uygulamalar, bir işlemin kilidinin yazılacağı hesaplarla birlikte RPC uç noktasını sorgulamalıdır. RPC uç noktası, `max(account_1_min_fee, account_2_min_fee, ... account_n_min_fee)` döndürecektir; bu da kullanıcıya bu işlem için öncelik ücretini ayarlamak üzere bir temel noktası olacaktır.

Öncelik Ücretlerini ayarlamak için farklı yaklaşımlar bulunmaktadır ve en iyi ücreti uygulamak için bazı [üçüncü taraf API'ler](https://docs.helius.dev/solana-rpc-nodes/alpha-priority-fee-api) mevcuttur. Ağın dinamik yapısı nedeniyle, öncelik ücretlerinizi fiyatlandırmanın "mükemmel" bir yolu olmayacaktır; bu nedenle bir yol seçmeden önce dikkatli bir analiz yapılmalıdır.

---

### Öncelik Ücretlerinin Uygulanması

Bir işlemin üzerine öncelik ücretlerini eklemek, belirli bir işlemde iki Hesaplama bütçesi talimatını önceden eklemeyi içerir:

- bir tanesi hesaplama birimi fiyatını ayarlamak için,
- diğeri hesaplama birimi sınırını ayarlamak için

> Burada, öncelik ücretlerini nasıl kullanacağınıza dair daha detaylı bir geliştirici
> `kılavuzunu bulabilirsiniz`
> bu öncelik ücretlerini uygulama hakkında daha fazla bilgi içerir.

Bir `setComputeUnitPrice` talimatı oluşturarak Temel İşlem Ücreti (5.000 Lamport) üzerinde bir Öncelik Ücreti ekleyin.

```typescript
// import { ComputeBudgetProgram } from "@solana/web3.js"
ComputeBudgetProgram.setComputeUnitPrice({ microLamports: number });
```

Mikro-lamport cinsinden sağlanan değer, Hesaplama Birimi (CU) bütçesi ile çarpılacak ve Öncelik Ücreti Lamport cinsinden hesaplanacaktır. Örneğin, CU bütçeniz 1M CU ise ve `1 microLamport/CU` eklerseniz, Öncelik Ücreti 1 lamport (1M * 0.000001) olacaktır. Toplam ücret daha sonra 5001 lamport olacaktır.

İşlemin yeni bir hesaplama birimi bütçesini ayarlamak için bir `setComputeUnitLimit` talimatı oluşturun:

```typescript
// import { ComputeBudgetProgram } from "@solana/web3.js"
ComputeBudgetProgram.setComputeUnitLimit({ units: number });
```

Sağlanan `units` değeri, Solana çalışma zamanının varsayılan hesaplama bütçesi değerini değiştirecektir.

:::warning
İşlemlerin maksimum verimliliği sağlamak ve toplam ücretleri en aza indirmek için yürütme için gereken minimum hesaplama birimi (CU) miktarını talep etmeleri gerekir.
:::

Bir işlem tarafından tüketilen CU'yu, işlemi farklı bir Solana kümesine, örneğin devnet’e göndererek alabilirsiniz. Örneğin, bir [basit token transferi](https://explorer.solana.com/tx/5scDyuiiEbLxjLUww3APE9X7i8LE3H63unzonUwMG7s2htpoAGG17sgRsNAhR1zVs6NQAnZeRVemVbkAct5myi17) 300 CU alır.

```typescript
// import { ... } from "@solana/web3.js"

const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  // not: bu değeri, işlemin gerçek tükettiği en düşük CU olarak ayarlayın
  units: 300,
});

const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1,
});

const transaction = new Transaction()
  .add(modifyComputeUnits)
  .add(addPriorityFee)
  .add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount,
      lamports: 10000000,
    }),
  );
```

### Öncelik Ücretleri ve Dayanıklı Noncler

Eğer yapılandırmanız Dayanıklı Noncler İşlemleri kullanıyorsa, başarılı işlemleri sağlamak için Öncelik Ücretlerini Dayanıklı İşlem Noncler ile birleştirerek düzgün bir şekilde uygulamak önemlidir. Bunu yapmamışsanız, niyet edilen Dayanıklı Noncler işlemleri bu şekilde algılanmayacaktır.

Eğer Dayanıklı İşlem Noncler kullanıyorsanız, `AdvanceNonceAccount` talimatı, öncelik ücretlerini belirlemek için hesaplama bütçesi talimatları kullanılsa bile, talimatlar listesinde MUTLAKA İLK belirtilmelidir.

Belirli bir kod örneği bulabilirsiniz `dayanıklı noncler ve öncelik ücretlerini birlikte kullanma` bu geliştirici kılavuzunda.

---

## SPL Token Standardını Destekleme

[SPL Token](https://spl.solana.com/token), Solana blok zincirinde sarılmış/sentetik token yaratma ve değiştirme standardıdır.

SPL Token çalışma akışı, yerel SOL token'larınınkinin benzeri olsa da, bu bölümde tartışılacak birkaç farklılığı vardır.

### Token Mint'leri

Her _tip_ SPL Token, bir _mint_ hesabı oluşturarak tanımlanır. Bu hesap, arz, ondalık sayısı ve mint üzerinde kontrol sahibi olan çeşitli yetkililer gibi token özelliklerini tanımlayan meta verileri depolar. Her SPL Token hesabı, ilişkili mint'ine atıfta bulunur ve yalnızca o tür SPL Token'ları ile etkileşimde bulunabilir.

### `spl-token` CLI Aracını Yükleme

SPL Token hesapları, `spl-token` komut satırı aracı kullanılarak sorgulanır ve değiştirilir. Bu bölümde sağlanan örnekler, yerel sistemde yüklü olmasını gerektirir.

`spl-token`, Rust [crates.io](https://crates.io/crates/spl-token) üzerinden Rust `cargo` komut satırı aracıyla dağıtılmaktadır. `cargo`nun en son sürümünü, platformunuza uygun bir tek satırlık komutla [rustup.rs](https://rustup.rs) üzerinden yükleyebilirsiniz. `cargo` yüklendikten sonra, `spl-token`'u aşağıdaki komutla elde edebilirsiniz:

```shell
cargo install spl-token-cli
```

Yüklenen sürümü doğrulamak için şu şekilde kontrol edebilirsiniz:

```shell
spl-token --version
```

Bu, bir şeyle sonuçlanmalıdır:

```text
spl-token-cli 2.0.1
```

### Hesap Oluşturma

SPL Token hesaplarının, yerel Sistem Programı hesaplarının sağlamadığı ek gereksinimleri vardır:

1. SPL Token hesaplarının, token'ların yatırılabilmesi için oluşturulması gerekir. Token hesapları, ya `spl-token create-account` komutuyla açıkça ya da `spl-token transfer --fund-recipient ...` komutuyla dolaylı olarak oluşturulabilir.
2. SPL Token hesapları, varlıklarını başka bir hesapta biriktirmemek için yaratıldıkları süreçte `kira muafiyeti` altında kalmalıdır; bu nedenle, hesap oluşturma sırasında küçük bir miktar yerel SOL token yatırılması gerekmektedir. SPL Token hesapları için bu miktar 0.00203928 SOL (2,039,280 lamport) olmaktadır.

#### Komut Satırı

Aşağıdaki özelliklere sahip bir SPL Token hesabı oluşturmak için:

1. Verilen mint ile ilişkilendirilmeli
2. Finansman hesabının anahtar çiftine sahip olmalı

```shell
spl-token create-account <TOKEN_MINT_ADDRESS>
```

#### Örnek

```shell
spl-token create-account AkUFCWTXb3w9nY2n6SFJvBV6VwvFUCe4KBMCcgLsa2ir
```

Şuna benzer bir çıktı vererek:

```
Hesap oluşturuluyor 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
İmza: 4JsqZEPra2eDTHtHpB4FMWSfk3UgcCVmkKkP7zESZeMrKmFFkDkNd91pKP3vPVVZZPiu5XxyJwS73Vi5WsZL88D7
```

Ya da belirli bir anahtar çifti ile bir SPL Token hesabı oluşturabilirsiniz:

```shell
solana-keygen new -o token-account.json

spl-token create-account AkUFCWTXb3w9nY2n6SFJvBV6VwvFUCe4KBMCcgLsa2ir token-account.json
```

Şuna benzer bir çıktı verir:

```shell
Hesap oluşturuluyor 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
İmza: 4JsqZEPra2eDTHtHpB4FMWSfk3UgcCVmkKkP7zESZeMrKmFFkDkNd91pKP3vPVVZZPiu5XxyJwS73Vi5WsZL88D7
```

---

### Bir Hesabın Bakiye Kontrolü

#### Komut Satırı

```shell
spl-token balance <TOKEN_ACCOUNT_ADDRESS>
```

#### Örnek

```shell
solana balance 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
```

Şuna benzer bir çıktı verir:

```
0
```

### Token Transferleri

Transferin kaynak hesabı, değeri içeren gerçek token hesabıdır.

Ancak, alıcı adresi normal bir cüzdan hesabı olabilir. Verilen mint için ilişkili bir token hesabı bu cüzdanda henüz yoksa, transfer `--fund-recipient` argümanı sağlandığı takdirde bunu oluşturur.

#### Komut Satırı

```shell
spl-token transfer <GÖNDEREN_HESAP_ADRESİ> <MİKTAR> <ALICI_CÜZDAN_ADRESİ> --fund-recipient
```

#### Örnek

```shell
spl-token transfer 6B199xxzw3PkAm25hGJpjj3Wj3WNYNHzDAnt1tEqg5BN 1
```

Şuna benzer bir çıktı verir:

```shell
6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
1 token transfer edildi
  Gönderen: 6B199xxzw3PkAm25hGJpjj3Wj3WNYNHzDAnt1tEqg5BN
  Alıcı: 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
İmza: 3R6tsog17QM8KfzbcbdP4aoMfwgo6hBggJDVy7dZPVmH2xbCWjEj31JKD53NzMrf25ChFjY7Uv2dfCDq4mGFFyAj
```

---

### Yatırım

Her `(cüzdan, mint)` çiftinin onchain üzerinde ayrı bir hesaba ihtiyacı vardır. Bu nedenle, bu hesaplar için adreslerin, yalnızca ATA adreslerinden yapılan yatırımların kabul edileceği şekilde SOL depo cüzdanlarından türetilmesi önerilir.

Para yatırma işlemleri için izleme, yukarıda açıklanan `blok sorgulama` yöntemine göre yapılmalıdır. Her yeni blok, kullanıcı token-hesabından türetilen adresleri referans alan başarılı işlemler için taranmalıdır. İşlemin meta verilerinden `preTokenBalance` ve `postTokenBalance` alanları, etkilenmiş hesabın token mint'ini ve sahip (ana cüzdan adresi) belirlemek için kullanılmalıdır.

Bir alıcı hesabı işlem sırasında oluşturulursa, mevcut bir hesap durumu olmadığından `preTokenBalance` girdisi olmayacaktır. Bu durumda, başlangıç bakiyesi sıfır kabul edilebilir.

### Para Çekme

Kullanıcının sağladığı para çekme adresi, SOL cüzdanına ait olmalıdır.

Bir para çekme `transferi` gerçekleştirmeden önce, borsa bu adresi `yukarıda açıklandığı gibi` kontrol etmelidir. Ayrıca, bu adresin Sistem Programı tarafından sahip olunması ve hesap verisi olmaması gerekir. Eğer adresin SOL bakiyesi yoksa, işlem yapılmadan önce kullanıcı onayı alınmalıdır. Tüm diğer para çekme adresleri reddedilmelidir.

Para çekme adresinden, belirli bir mint için [İlişkili Token Hesabı](https://spl.solana.com/associated-token-account) (ATA) türetilir ve bu hesaba bir [TransferChecked](https://github.com/solana-labs/solana-program-library/blob/fc0d6a2db79bd6499f04b9be7ead0c400283845e/token/program/src/instruction.rs#L268) talimatıyla transfer gerçekleştirilir. ATA adresinin henüz mevcut olmaması durumunda, borsa bu hesabı kullanıcı adına finanse etmelidir. SPL Token hesapları için, para çekme hesabını finanse etmek 0.00203928 SOL (2,039,280 lamport) gerektirecektir.

Para çekme için şablon `spl-token transfer` komutu:

```shell
spl-token transfer --fund-recipient <borsa token hesabı> <para çekme miktarı> <para çekme adresi>
```

### Diğer Hususlar

#### Dondurma Yetkisi

Düzenleyici uyumluluk nedenleriyle, SPL Token çıkaran bir kuruluş, mint ile ilişkilendirilen tüm hesaplar üzerinde "Dondurma Yetkisi" tutmayı isteğe bağlı olarak seçebilir. Bu, varlıkları istedikleri zaman dondurma [yetkisi](https://spl.solana.com/token#freezing-accounts) sağlar ve dondurulmuş bir hesap kullanılmaz hale gelir. Eğer bu özellik kullanılıyorsa, dondurma yetkilisinin genel anahtarı, SPL Token'ın mint hesabında kaydedilir.

### SPL Token-2022 (Token-Extensions) Standartı için Temel Destek

[SPL Token-2022](https://spl.solana.com/token-2022), Solana blok zincirinde sarılmış/sentetik token oluşturma ve takas için en yeni standarttır.

> "Token Uzantıları" olarak da bilinen bu standart, token yaratıcıları ve hesap sahipleri tarafından isteğe bağlı olarak etkinleştirilebilecek birçok yeni özellik içermektedir. — SPL Token-2022 Standardı

Bu özellikler arasında gizli transferler, transfer ücretleri, mint kapama, meta veriler, kalıcı delegeler, değişmez mülkiyet ve daha fazlası bulunmaktadır. Daha fazla bilgi için lütfen [uzantı kılavuzuna](https://spl.solana.com/token-2022/extensions) bakın.

Eğer borsa SPL Token'i destekliyorsa, SPL Token-2022'yi desteklemek için çok fazla çalışma gerekmemektedir:

- CLI aracı, 3.0.0 sürümünden itibaren her iki programla sorunsuz çalışmaktadır.
- `preTokenBalances` ve `postTokenBalances`, SPL Token-2022 bakiyelerini içermektedir.
- RPC, SPL Token-2022 hesaplarını indeksler, ancak bunlar `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` program kimliği ile ayrı olarak sorgulanmalıdır.

---

İlişkili Token Hesabı aynı şekilde çalışmakta ve yeni hesap için gereken SOL mevduat tutarını doğru bir şekilde hesaplamaktadır.

:::warning
Ancak uzantılar nedeniyle, hesaplar 165 bayttan büyük olabileceğinden, fonlamak için 0.00203928 SOL'dan daha fazlasına ihtiyaç duyabilirler.
:::

Örneğin, İlişkili Token Hesabı programı her zaman "değişmez sahip" uzantısını içerir. Bu nedenle hesapların minimum 170 bayt alması gerekir ve bu da 0.00207408 SOL gerektirir.

### Uzantıya Özgü Dikkatler

Önceki bölüm, SPL Token-2022 için en temel desteği özetlemektedir. Uzantılar tokenların davranışını değiştirdiğinden, borsaların tokenları nasıl yönettiklerini değiştirmeleri gerekebilir.

Bir mint veya token hesabındaki tüm uzantıları görmek mümkündür:

```shell
spl-token display <hesap adresi>
```

---

#### Transfer Ücreti

Bir token, transfer ücretine sahip olacak şekilde yapılandırılabilir; burada transfer edilen tokenlardan bir kısmı, gelecekteki toplamalar için varış yerinde tutulur.

:::note
Eğer borsanız bu tokenları transfer ediyorsa, tutulmuş miktar nedeniyle hepsinin varış yerine ulaşmayabileceğine dikkat edin.
:::

Beklenen ücreti bir transfer sırasında belirlemek mümkündür, böylece herhangi bir sürprizi önleyebilirsiniz:

```shell
spl-token transfer --expected-fee <ücret tutarı> --fund-recipient <borsa token hesabı> <çekim tutarı> <çekim adresi>
```

#### Mint Kapama Yetkisi

Bu uzantıyla, bir token yaratıcısı, token arzı sıfır olduğunda bir mint'i kapatabilir.

> "Bir mint kapatıldığında, hala mevcut olan boş token hesapları olabilir ve bunlar geçerli bir mint ile artık ilişkilendirilmeyecektir." — Mint Kapatma Yetkisi

Bu token hesaplarını kapatmak tamamen güvenlidir:

```shell
spl-token close --address <hesap adresi>
```

#### Gizli Transfer

Mintler gizli transferler için yapılandırılabilir. Böylece token miktarları şifrelenir, ancak hesap sahipleri hala halktır.

Borsalar, kullanıcı miktarlarını gizlemek için token hesaplarını gizli transferler göndermek ve almak üzere yapılandırabilir. Token hesaplarında gizli transferlerin etkinleştirilmesi zorunlu değildir, bu nedenle borsalar kullanıcıların tokenları açık bir şekilde göndermesini zorunlu kılabilir.

Gizli transferleri etkinleştirmek için, hesap bunun için yapılandırılmalıdır:

```shell
spl-token configure-confidential-transfer-account --address <hesap adresi>
```

Ve transfer etmek için:

```shell
spl-token transfer --confidential <borsa token hesabı> <çekim tutarı> <çekim adresi>
```

Gizli bir transfer sırasında, `preTokenBalance` ve `postTokenBalance` alanları değişiklik göstermez. Mevduat hesaplarını boşaltmak için, token'ları çekmek üzere yeni bakiyeyi şifre çözmeniz gerekir:

```shell
spl-token apply-pending-balance --address <hesap adresi>
spl-token withdraw-confidential-tokens --address <hesap adresi> <miktar ya da ALL>
```

#### Varsayılan Hesap Durumu

Mintler, varsayılan bir hesap durumu ile yapılandırılabilir, böylece tüm yeni token hesapları varsayılan olarak dondurulur. Bu, token yaratıcıları, kullanıcıların hesabı çözmesi için ayrı bir süreçten geçmelerini talep edebilir.

#### Taşınamaz

Bazı tokenlar taşınamaz, ancak yine de yakılabilir ve hesap kapatılabilir.

#### Kalıcı Temsilci

Token yaratıcıları, tüm tokenları için kalıcı bir temsilci belirleyebilir. Kalıcı temsilci, herhangi bir hesap üzerinden token transferi veya yakma işleminde bulunabilir ve bu da fonların çalınmasına neden olabilir.

:::danger
Bu, bazı yargı alanlarında stablecoinler için yasal bir gerekliliktir veya token geri alma planları için kullanılabilir.
:::

Bu tokenların, borsanızın bilgisi olmadan transfer edilebileceği konusunda dikkatli olun.

#### Transfer Kancası

Tokenlar, transferler sırasında çağrılması gereken ek bir program ile yapılandırılabilir. Böylece transferin doğrulanması veya başka herhangi bir mantığın uygulanması sağlanır.

Solana çalışma zamanı, tüm hesapların bir programa açıkça geçirilmesini gerektirdiğinden, ve transfer kancaları ek hesaplar gerektirdiğinden, borsa bu tokenlar için transfer talimatlarını farklı bir şekilde oluşturmak zorundadır.

CLI ve `createTransferCheckedWithTransferHookInstruction` gibi talimat oluşturan araçlar, ek hesapları otomatik olarak ekler, ancak ek hesaplar da açıkça belirtilebilir:

```shell
spl-token transfer --transfer-hook-account <pubkey:role> --transfer-hook-account <pubkey:role> ...
```

#### Transferde Gerekli Memo

Kullanıcılar, token hesaplarını transfer sırasında bir memo gerektirecek şekilde yapılandırabilir.

Borsalar, tokenları kullanıcılarına geri transfer etmeden önce bir memo talimatı eklemek zorunda kalabilir veya kullanıcıların borsaya gönderim yapmadan önce bir memo talimatı eklemesini talep edebilir:

```shell
spl-token transfer --with-memo <memo metni> <borsa token hesabı> <çekim tutarı> <çekim adresi>
```

---

## Entegrasyonu Test Etmek

Prodüksiyona geçmeden önce, Solana devnet ve testnet [küme]'lerinde (clusters) tam iş akışınızı test ettiğinizden emin olun. Devnet en açık ve esnek olanıdır ve ilk geliştirme için idealdir, testnet ise daha gerçekçi küme yapılandırması sunar. 

Hem devnet hem de testnet, bir musluk desteği sunar; üzerine `solana airdrop 1` yazarak bazı devnet veya testnet SOL alabilirsiniz.