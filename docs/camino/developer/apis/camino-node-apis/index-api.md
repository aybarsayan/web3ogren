---
sidebar_position: 9
---

# Index API

Camino-Node, bir dizinleyici ile çalışacak şekilde yapılandırılabilir. Yani, X-Chain, P-Chain ve C-Chain üzerinde kabul ettiği her bir konteyneri (bir blok, nokta veya işlem) kaydeder (dizine ekler). CaminoNode'ı dizinleme etkin hale getirilmiş olarak çalıştırmak için, komut satırı bayrağını  true olarak ayarlayın. **Camino-Node sadece `--index-enabled` true olarak ayarlandığında kabul edilen konteynerleri dizine ekleyecektir.** Düğümünüzün tam bir dizine sahip olmasını sağlamak için, yeni bir veritabanıyla ve `--index-enabled` true olarak ayarlanmış bir düğüm çalıştırın. Düğüm, başlatma sırasında ağ tarihindeki her blok, nokta ve işlemi kabul edecek ve dizininizin tamamını sağlayacaktır. Dizinleme etkin haldeyken düğümünüzü kapatmakta herhangi bir sakınca yoktur. Eğer dizinleme hala etkin olarak yeniden başlatılırsa, çevrimdışı olduğu süre içinde kabul edilen tüm konteynerleri kabul edecektir. Dizinleyici, kabul edilen bir bloğu, noktayı veya işlemi dizine eklemekte asla başarısız olmamalıdır.

Dizine eklenen konteynerler (yani, kabul edilen bloklar, noktalar ve işlemler), düğümün o konteyneri kabul ettiği zamanla damgalanır. Eğer konteyner başlatma sırasında dizine eklenmişse, diğer düğümler bu konteyneri çok daha önce kabul etmiş olabilir. Başlatma sırasında dizine eklenen her konteyner, düğümün başlatıldığı zamanla damgalanır, ağ tarafından ilk kabul edildiği zamanla değil.

DAG'lar (X-Chain dahil) için, düğümler birbiriyle noktaları ve işlemleri farklı bir sırayla kabul edebilir.

Eğer `--index-enabled` true'dan false'a değiştirilirse, Camino-Node başlamayacaktır çünkü bu, daha önce tam bir dizine sahip olan bir durumu eksik hale getirecek, kullanıcı açıkça `--index-allow-incomplete` kullanmadıkça. Bu, daha önce etkin olarak çalıştırdıktan sonra yanlışlıkla dizinleme devre dışı bırakma durumunda kalmanızı önler, bu durumda eksik bir dizin ile sonuçlanır.

Bu belge, Camino-Node'un Index API'sinden veri sorgulama yöntemini göstermektedir. Index API, yalnızca `--index-enabled` ile çalışırken kullanılabilir.

## Format

Bu API, `json 2.0` RPC formatını kullanmaktadır. JSON RPC çağrıları yapmak hakkında daha fazla bilgi için  bakın.

## Endpointler

Her bir zincirin bir veya daha fazla dizini vardır. Örneğin, C-Chain bloğunun kabul edilip edilmediğini görmek için, C-Chain blok dizinine bir API çağrısı gönderin. X-Chain noktasının kabul edilip edilmediğini kontrol etmek için ise, X-Chain nokta dizinine bir API çağrısı gönderin.

### X-Chain İşlemleri

```text
/ext/index/X/tx
```

### X-Chain Noktaları

```text
/ext/index/X/vtx
```

### P-Chain Blokları

```text
/ext/index/P/block
```

### C-Chain Blokları

```text
/ext/index/C/block
```

## P/C Bloklarının Seri Hale Getirilmesi

Genel olarak blok konteynerleri,  için ikili temsilde dizin depolamasında saklanmaktadır.  
block.Block() baytları daha sonra P-Chain için platformVM.Block'a veya C-Chain için caminoethvm'deki types.Block'a ayrıştırılabilir.  
Uygulama, Magellan akış dizinleyicilerinde bulunabilir.

:::info
C-Chain üzerindeki 0 dizinli konteyner, bir önerici Bloğa sarılmamıştır. Konteyneri doğrudan types.Block yapısına RLP olarak ayrıştırabilirsiniz.
:::

## API Yöntemleri

### index.getLastAccepted

En son kabul edilen konteyneri alır.

**İmza**

```sh
index.getLastAccepted({
  encoding:string
}) -> {
  id: string,
  bytes: string,
  timestamp: string,
  encoding: string,
  index: string
}
```

Burada:

- `id`, konteynerin kimliğidir
- `bytes`, konteynerin bayt temsilidir
- `timestamp`, bu düğümün konteyneri kabul ettiği zaman
- `index`, bu dizin içinde bu konteynerden önce kabul edilen konteynerlerin sayısıdır
- `encoding`, `"cb58"` veya `"hex"` olur

**Örnek Çağrı**

```sh
curl --location --request POST 'localhost:9650/ext/index/X/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "index.getLastAccepted",
    "params": {
        "encoding":"cb58"
    },
    "id": 1
}'
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "id": "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
    "bytes": "111115HRzXVDSeonLBcv6QdJkQFjPzPEobMWy7PyGuoheggsMCx73MVXZo2hJMEXXvR5gFFasTRJH36aVkLiWHtTTFcghyFTqjaHnBhdXTRiLaYcro3jpseqLAFVn3ngnAB47nebQiBBKmg3nFWKzQUDxMuE6uDGXgnGouDSaEKZxfKreoLHYNUxH56rgi5c8gKFYSDi8AWBgy26siwAWj6V8EgFnPVgm9pmKCfXio6BP7Bua4vrupoX8jRGqdrdkN12dqGAibJ78Rf44SSUXhEvJtPxAzjEGfiTyAm5BWFqPdheKN72HyrBBtwC6y7wG6suHngZ1PMBh93Ubkbt8jjjGoEgs5NjpasJpE8YA9ZMLTPeNZ6ELFxV99zA46wvkjAwYHGzegBXvzGU5pGPbg28iW3iKhLoYAnReysY4x3fBhjPBsags37Z9P3SqioVifVX4wwzxYqbV72u1AWZ4JNmsnhVDP196Gu99QTzmySGTVGP5ABNdZrngTRfmGTFCRbt9CHsgNbhgetkxbsEG7tySi3gFxMzGuJ2Npk2gnSr68LgtYdSHf48Ns",
    "timestamp": "2021-04-02T15:34:00.262979-07:00",
    "encoding": "cb58",
    "index": "0"
  }
}
```

### index.getContainerByIndex

Dizine göre konteyner alır. İlk kabul edilen konteyner 0 dizinindedir, ikinci konteyner 1 dizinindedir, vb.

**İmza**

```sh
index.getContainerByIndex({
  index: uint64,
  encoding: string
}) -> {
  id: string,
  bytes: string,
  timestamp: string,
  encoding: string,
  index: string
}
```

- `id`, konteynerin kimliğidir
- `bytes`, konteynerin bayt temsilidir
- `timestamp`, bu düğümün konteyneri kabul ettiği zaman
- `index`, bu dizin içinde bu konteynerden önce kabul edilen konteynerlerin sayısıdır
- `encoding`, `"cb58"` veya `"hex"` olur

**Örnek Çağrı**

```sh
curl --location --request POST 'localhost:9650/ext/index/X/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "index.getContainerByIndex",
    "params": {
        "index":0,
        "encoding":"cb58"
    },
    "id": 1
}'
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "id": "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
    "bytes": "111115HRzXVDSeonLBcv6QdJkQFjPzPEobMWy7PyGuoheggsMCx73MVXZo2hJMEXXvR5gFFasTRJH36aVkLiWHtTTFcghyFTqjaHnBhdXTRiLaYcro3jpseqLAFVn3ngnAB47nebQiBBKmg3nFWKzQUDxMuE6uDGXgnGouDSaEKZxfKreoLHYNUxH56rgi5c8gKFYSDi8AWBgy26siwAWj6V8EgFnPVgm9pmKCfXio6BP7Bua4vrupoX8jRGqdrdkN12dqGAibJ78Rf44SSUXhEvJtPxAzjEGfiTyAm5BWFqPdheKN72HyrBBtwC6y7wG6suHngZ1PMBh93Ubkbt8jjjGoEgs5NjpasJpE8YA9ZMLTPeNZ6ELFxV99zA46wvkjAwYHGzegBXvzGU5pGPbg28iW3iKhLoYAnReysY4x3fBhjPBsags37Z9P3SqioVifVX4wwzxYqbV72u1AWZ4JNmsnhVDP196Gu99QTzmySGTVGP5ABNdZrngTRfmGTFCRbt9CHsgNbhgetkxbsEG7tySi3gFxMzGuJ2Npk2gnSr68LgtYdSHf48Ns",
    "timestamp": "2021-04-02T15:34:00.262979-07:00",
    "encoding": "cb58",
    "index": "0"
  }
}
```

### index.getContainerByID

ID ile konteyner alır.

**İmza**

```sh
index.getContainerByID({
  containerID: string,
  encoding: string
}) -> {
  id: string,
  bytes: string,
  timestamp: string,
  encoding: string,
  index: string
}
```

- `id`, konteynerin kimliğidir
- `bytes`, konteynerin bayt temsilidir
- `timestamp`, bu düğümün konteyneri kabul ettiği zaman
- `index`, bu dizin içinde bu konteynerden önce kabul edilen konteynerlerin sayısıdır
- `encoding`, `"cb58"` veya `"hex"` olur

**Örnek Çağrı**

```sh
curl --location --request POST 'localhost:9650/ext/index/X/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "index.getContainerByID",
    "params": {
        "containerID": "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        "encoding":"hex"
    },
    "id": 1
}'
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "id": "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
    "bytes": "111115HRzXVDSeonLBcv6QdJkQFjPzPEobMWy7PyGuoheggsMCx73MVXZo2hJMEXXvR5gFFasTRJH36aVkLiWHtTTFcghyFTqjaHnBhdXTRiLaYcro3jpseqLAFVn3ngnAB47nebQiBBKmg3nFWKzQUDxMuE6uDGXgnGouDSaEKZxfKreoLHYNUxH56rgi5c8gKFYSDi8AWBgy26siwAWj6V8EgFnPVgm9pmKCfXio6BP7Bua4vrupoX8jRGqdrdkN12dqGAibJ78Rf44SSUXhEvJtPxAzjEGfiTyAm5BWFqPdheKN72HyrBBtwC6y7wG6suHngZ1PMBh93Ubkbt8jjjGoEgs5NjpasJpE8YA9ZMLTPeNZ6ELFxV99zA46wvkjAwYHGzegBXvzGU5pGPbg28iW3iKhLoYAnReysY4x3fBhjPBsags37Z9P3SqioVifVX4wwzxYqbV72u1AWZ4JNmsnhVDP196Gu99QTzmySGTVGP5ABNdZrngTRfmGTFCRbt9CHsgNbhgetkxbsEG7tySi3gFxMzGuJ2Npk2gnSr68LgtYdSHf48Ns",
    "timestamp": "2021-04-02T15:34:00.262979-07:00",
    "encoding": "hex",
    "index": "0"
  }
}
```

### index.getContainerRange

Dizindeki indeksler \[`startIndex`, `startIndex+1`, ... , `startIndex` + `numToFetch` - 1\] arasında konteyner döndürür. `numToFetch` `[0,1024]` aralığında olmalıdır.

**İmza**

```sh
index.getContainerRange({
  startIndex: uint64,
  numToFetch: uint64,
  encoding: string
}) -> []{
  id: string,
  bytes: string,
  timestamp: string,
  encoding: string,
  index: string
}
```

- `id`, konteynerin kimliğidir
- `bytes`, konteynerin bayt temsilidir
- `timestamp`, bu düğümün konteyneri kabul ettiği zaman
- `index`, bu dizin içinde bu konteynerden önce kabul edilen konteynerlerin sayısıdır
- `encoding`, `"cb58"` veya `"hex"` olur

**Örnek Çağrı**

```sh
curl --location --request POST 'localhost:9650/ext/index/X/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "index.getContainerRange",
    "params": {
        "startIndex":0,
        "numToFetch":100,
        "encoding":"cb58"
    },
    "id": 1
}'
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "id": "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      "bytes": "111115HRzXVDSeonLBcv6QdJkQFjPzPEobMWy7PyGuoheggsMCx73MVXZo2hJMEXXvR5gFFasTRJH36aVkLiWHtTTFcghyFTqjaHnBhdXTRiLaYcro3jpseqLAFVn3ngnAB47nebQiBBKmg3nFWKzQUDxMuE6uDGXgnGouDSaEKZxfKreoLHYNUxH56rgi5c8gKFYSDi8AWBgy26siwAWj6V8EgFnPVgm9pmKCfXio6BP7Bua4vrupoX8jRGqdrdkN12dqGAibJ78Rf44SSUXhEvJtPxAzjEGfiTyAm5BWFqPdheKN72HyrBBtwC6y7wG6suHngZ1PMBh93Ubkbt8jjjGoEgs5NjpasJpE8YA9ZMLTPeNZ6ELFxV99zA46wvkjAwYHGzegBXvzGU5pGPbg28iW3iKhLoYAnReysY4x3fBhjPBsags37Z9P3SqioVifVX4wwzxYqbV72u1AWZ4JNmsnhVDP196Gu99QTzmySGTVGP5ABNdZrngTRfmGTFCRbt9CHsgNbhgetkxbsEG7tySi3gFxMzGuJ2Npk2gnSr68LgtYdSHf48Ns",
      "timestamp": "2021-04-02T15:34:00.262979-07:00",
      "encoding": "cb58",
      "index": "0"
    }
  ]
}
```

### index.getIndex

Konteynerin indeksini alır.

**İmza**

```sh
index.getIndex({
  containerID: string,
  encoding: string
}) -> {
  index: string
}
```

Burada `encoding`, `"cb58"` veya `"hex"` olmalıdır.

**Örnek Çağrı**

```sh
curl --location --request POST 'localhost:9650/ext/index/X/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "index.getIndex",
    "params": {
        "containerID":"6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        "encoding":"cb58"
    },
    "id": 1
}'
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "index": "0"
  },
  "id": 1
}
```

### index.isAccepted

Konteynerin bu dizinde olup olmadığını kontrol eder.

**İmza**

```sh
index.isAccepted({
  containerID: string,
  encoding: string
}) -> {
  isAccepted: bool
}
```

**Örnek Çağrı**

```sh
curl --location --request POST 'localhost:9650/ext/index/X/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "index.isAccepted",
    "params": {
        "containerID":"6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        "encoding":"cb58"
    },
    "id": 1
}'
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "isAccepted": true
  },
  "id": 1
}
```

## Örnek: X-Chain İşlemlerini Döngü ile İşlem

X-Chain üzerinde kabul edilen tüm işlemlerin ID'sini almak için Index API'yi kullanabilirsiniz, ardından X-Chain API metodunu `avm.getTx` kullanarak işlemin insan tarafından okunabilir bir temsilini elde edebilirsiniz. 

X-Chain üzerindeki bir işlemi dizinine göre almak için Index API yöntemi olan  metodunu kullanabilirsiniz.

Örneğin, X-Chain'de kabul edilen ikinci işlemi (dikkat edin: `"index":1`) almak için:

```sh
curl --location --request POST 'https://indexer-test.camino.network/ext/index/X/tx' \
--header 'Content-Type: application/json' \
--data-raw '{
   "jsonrpc": "2.0",
   "method": "index.getContainerByIndex",
   "params": {
       "encoding":"hex",
       "index":1
   },
   "id": 1
}'
```

Bu, X-Chain tarihindeki ikinci işlemin ID'sini döndürür. Üçüncü işlemi almak için `"index":2` kullanın ve bu şekilde devam edin.

Yukarıdaki API çağrısı aşağıdaki yanıtı verir:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "ZGYTSU8w3zUP6VFseGC798vA2Vnxnfj6fz1QPfA9N93bhjJvo",
    "bytes": "0x00000000000000000001ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000221e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000129f6afc0000000000000000000000001000000017416792e228a765c65e2d76d28ab5a16d18c342f21e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000222afa575c00000000000000000000000010000000187d6a6dd3cd7740c8b13a410bea39b01fa83bb3e000000016f375c785edb28d52edb59b54035c96c198e9d80f5f5f5eee070592fe9465b8d0000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000500000223d9ab67c0000000010000000000000000000000010000000900000001beb83d3d29f1247efb4a3a1141ab5c966f46f946f9c943b9bc19f858bd416d10060c23d5d9c7db3a0da23446b97cd9cf9f8e61df98e1b1692d764c84a686f5f801a8da6e40",
    "timestamp": "2021-11-04T00:42:55.01643414Z",
    "encoding": "hex",
    "index": "1"
  },
  "id": 1
}
```

Bu işlemin ID'si `ZGYTSU8w3zUP6VFseGC798vA2Vnxnfj6fz1QPfA9N93bhjJvo`'dir.

Bu işlemi ID'sine göre almak için `avm.getTx` API metodunu kullanın:

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avm.getTx",
    "params" :{
        "txID":"ZGYTSU8w3zUP6VFseGC798vA2Vnxnfj6fz1QPfA9N93bhjJvo",
        "encoding": "json"
    }
}' -H 'content-type:application/json;' https://api.camino.network/ext/bc/X
```

Yanıt:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tx": {
      "unsignedTx": {
        "networkID": 1,
        "blockchainID": "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
        "outputs": [
          {
            "assetID": "o8seyjX6WupqJ1CE8CeaozK13kqVgc4DFvdvc4crfacLFBauW",
            "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
            "output": {
              "addresses": [
                "X-columbus1wst8jt3z3fm9ce0z6akj3266zmgccdp03hjlaj"
              ],
              "amount": 4999000000,
              "locktime": 0,
              "threshold": 1
            }
          },
          {
            "assetID": "o8seyjX6WupqJ1CE8CeaozK13kqVgc4DFvdvc4crfacLFBauW",
            "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
            "output": {
              "addresses": [
                "X-columbus1slt2dhfu6a6qezcn5sgtagumq8ag8we75f84sw"
              ],
              "amount": 2347999000000,
              "locktime": 0,
              "threshold": 1
            }
          }
        ],
        "inputs": [
          {
            "txID": "qysTYUMCWdsR3MctzyfXiSvoSf6evbeFGRLLzA4j2BjNXTknh",
            "outputIndex": 0,
            "assetID": "o8seyjX6WupqJ1CE8CeaozK13kqVgc4DFvdvc4crfacLFBauW",
            "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
            "input": {
              "amount": 2352999000000,
              "signatureIndices": [0]
            }
          }
        ],
        "memo": "0x"
      },
      "credentials": [
        {
          "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
          "credential": {
            "signatures": [
              "0xbeb83d3d29f1247efb4a3a1141ab5c966f46f946f9c943b9bc19f858bd416d10060c23d5d9c7db3a0da23446b97cd9cf9f8e61df98e1b1692d764c84a686f5f801"
            ]
          }
        }
      ]
    },
    "encoding": "json"
  },
  "id": 1
}