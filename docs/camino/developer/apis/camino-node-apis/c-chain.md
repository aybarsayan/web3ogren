---
description: Camino Go API'leri ve C-Chain ile etkileşim kurmayı öğrenmek hakkında daha fazla bilgi mevcuttur.
sidebar_position: 3
---

# Sözleşme Zinciri (C-Chain) API

:::note NOT

Ethereum'un kendi `networkID` ve `chainID` kavramları vardır. Bu kavramların Camino'nun `networkID` ve `chainID` görüşüyle hiçbir ilişkisi yoktur ve yalnızca C-Chain'e içkindir. Mainnet'te C-Chain için bu değerler `1000` ve `500` olarak kullanılmaktadır. Columbus Testnet'te ise bu değerler `1001` ve `501`'dir.

`networkID` ve `chainID` bilgilerinin yanı sıra `net_version` ve `eth_chainId` yöntemleri kullanılarak da elde edilebilir.

:::

## Ethereum API'leri

### Ethereum API Uç Noktaları

#### JSON-RPC Uç Noktaları

C-Chain ile JSON-RPC uç noktası üzerinden etkileşim kurmak için:

```
/ext/bc/C/rpc
```

EVM'nin diğer örnekleri ile JSON-RPC uç noktası üzerinden etkileşim kurmak için:

```
/ext/bc/blockchainID/rpc
```

burada `blockchainID`, EVM'yi çalıştıran blockchain'in kimliğidir.

#### WebSocket Uç Noktaları

:::info
Açık API düğümünde, yalnızca C-Chain'in HTTP API'sinde mevcut olmayan API yöntemleri için C-Chain websocket API çağrılarını destekler.
:::

C-Chain ile websocket uç noktası üzerinden etkileşim kurmak için:

```
/ext/bc/C/ws
```

Örneğin, C-Chain'in Ethereum API'leri ile websocket üzerinden localhost'ta etkileşim kurmak için :

```
ws://127.0.0.1:9650/ext/bc/C/ws
```

Not: localhost üzerinde `ws://` kullanın. Kamu API'si veya şifreleme destekleyen başka bir host kullanıyorsanız `wss://` kullanın.

EVM'nin diğer örnekleri ile websocket uç noktası üzerinden etkileşim kurmak için:

```
/ext/bc/blockchainID/ws
```

burada `blockchainID`, EVM'yi çalıştıran blockchain'in kimliğidir.

### Yöntemler

#### Standart Ethereum API'leri

Camino, Geth'in API'si ile aynı API arayüzünü sunar, ancak yalnızca aşağıdaki hizmetleri destekler:

- `web3_`
- `net_`
- `eth_`
- `personal_`
- `txpool_`
- `debug_` (not: bu, kamu API düğümünde kapalıdır.)

Bu hizmetlerle etkileşim kurarken Geth ile olduğundan tam olarak aynı şekilde etkileşimde bulunabilirsiniz. Bu API'nin tam açıklaması için  ve  sayfalarına bakabilirsiniz.

:::info

Not: Kamu API düğümünde toplu istekler için maksimum öğe sayısı 40'tır. Daha büyük bir toplu boyutu desteklemek için çalışıyoruz.

:::

#### eth_getAssetBalance

Standart Ethereum API'lere ek olarak, Camino, C-Chain'deki birinci sınıf Camino Yerel Token'larının bakiyesini almak için `eth_getAssetBalance`'i sunar (CAM hariç; CAM, `eth_getBalance` ile alınmalıdır).

**İmza**

```sh
eth_getAssetBalance({
    address: string,
    blk: BlkNrOrHash,
    assetID: string,
}) -> {balance: int}
```

- `address`: Varlık sahibinin adresi
- `blk`: Bakiyenin alınacağı blok numarası veya hash
- `assetID`: Bakiyesi istenen varlığın kimliği

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "eth_getAssetBalance",
    "params": [
        "0x8723e5773847A4Eb5FeEDabD9320802c5c812F46",
        "latest",
        "3RvKBAmQnfYionFXMfW5P8TDZgZiogKbHjM8cjpu16LKAgF5T"
    ],
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/rpc
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1388"
}
```

### eth_baseFee

Bir sonraki blok için temel ücreti alın.

**İmza**

```sh
eth_baseFee() -> {}
```

`result`, bir sonraki blok için temel ücretin hex değeridir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"eth_baseFee",
    "params" :[]
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/rpc
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x34630b8a00"
}
```

### eth_maxPriorityFeePerGas

Bir blokta yer almak için gereken öncelik ücretini alın.

**İmza**

```sh
eth_maxPriorityFeePerGas() -> {}
```

`result`, bir blokta yer almak için gereken öncelik ücretinin hex değeridir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"eth_maxPriorityFeePerGas",
    "params" :[]
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/rpc
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x2540be400"
}
```

## Camino'ya Özgü API'ler

### Uç Noktalar

C-Chain'deki `avax` ile ilgili RPC çağrıları ile etkileşim kurmak için:

```
/ext/bc/C/avax
```

EVM avax uç noktaları ile etkileşim kurmak için:

```
/ext/bc/blockchainID/avax
```

### avax.getAtomicTx

Bir işlemi ID'si ile alın. Opsiyonel bir kodlama parametresi, döndürülen işlemin formatını belirtmek için kullanılabilir. `cb58` veya `hex` olabilir. Varsayılan değer `cb58`dir.

**İmza**

```go
avax.getAtomicTx({
    txID: string,
    encoding: string, //opsiyonel
}) -> {
    tx: string,
    encoding: string,
    blockHeight: string
}
```

**İstek**

- `txID`: İşlem kimliği. cb58 formatında olmalıdır.
- `encoding`: Kullanılacak kodlama formatı. `cb58` veya `hex` olabilir. Varsayılan değer `cb58`dir.

**Yanıt**

- `tx`: `encoding`'e kodlanmış işlem.
- `encoding`: Yapılan kodlama.
- `blockHeight`: İşlemin dahil edildiği bloğun yüksekliği.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avax.getAtomicTx",
    "params" :{
        "txID":"2GD5SRYJQr2kw5jE73trBFiAgVQyrCaeg223TaTyJFYXf2kPty",
        "encoding": "cb58"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tx": "111111115k3oJsP1JGxvsZPFh1WXzSYNVDtvgvZ4qDWtAs5ccogA1RtT3Me5x8xgkj7cyxaNGEHuMv5U34qo94fnvHweLeSRf31ggt3MoD7MHSDw6LbiXeaJa3uwBDHzd6tPxw17478X13Ff7DkHtbWYYx2WTcJYk4nVP2swCHjBE3uQjmu6RdhtgZCxvnD6YVpEsXqvam6cDzpf5BLaosYCSt5p8SmLU2ppaSb6DPA4EW4679ygUxiDNP3SFagjUvzSrfBJRFCzsan4ZJqH8haYqpJL42TUN4q3eFKvscZfp2v2WWEEwJYmJP4Nc1P7wndeMxPFEm3vjkBaVUZ5k25TpYtghq6Kx897dVNaMSsTAoudwqTR1cCUGiR3bLfi82MgnvuApsYqtRfaD9deSHc8UA1ohPehkj9eaY",
    "encoding": "cb58",
    "blockHeight": "1"
  },
  "id": 1
}
```

### avax.export

Bir varlığı C-Chain'den X-Chain'e dışa aktarın. Bu yöntemi çağırdıktan sonra, transferi tamamlamak için X-Chain'deki  yöntemini çağırmalısınız.

**İmza**

```go
avax.export({
    to: string,
    amount: int,
    assetID: string,
    baseFee: int,
    username: string,
    password:string,
}) -> {txID: string}
```

- `to`: Varlığın gönderileceği X-Chain adresi.
- `amount`: Gönderilecek varlık miktarı.
- `assetID`: Varlığın kimliği. CAM'ı dışa aktarmak için `assetID` olarak `"CAM"` kullanın.
- `baseFee`: İşlem oluşturulurken kullanılacak temel ücret. Belirtilmezse, önerilen bir ücret kullanılacaktır.
- `username`: İşlemin yapılacağı adresi kontrol eden kullanıcı.
- `password`: `username`'in parolası.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avax.export",
    "params" :{
        "to":"X-columbus1q9c6ltuxpsqz7ul8j0h0d0ha439qt70sr3x2m0",
        "amount": 500,
        "assetID": "2nzgmhZLuVq8jc7NNu2eahkKwoJcbFWXWJCxHBVWAJEZkhquoK",
        "username":"myUsername",
        "password":"myPassword"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "2W5JuFENitZKTpJsy9igBpTcEeBKxBHHGAUkgsSUnkjVVGQ9i8"
  },
  "id": 1
}
```

### avax.exportKey

Verilen bir adresi kontrol eden özel anahtarı alır. Dönülen özel anahtar, `avax.importKey` yöntemi ile bir kullanıcıya eklenebilir.

**İmza**

```go
avax.exportKey({
    username: string,
    password:string,
    address:string
}) -> {privateKey: string}
```

**İstek**

- `username` 'in `address` üzerinde kontrolü olmalıdır.
- `address`: Karşılık gelen özel anahtarın alınmak istendiği adresdir. Hex formatında olmalıdır.

**Yanıt**

- `privateKey`: `address`'i kontrol eden özel anahtarın CB58 kodlamalı string temsili. `PrivateKey-` ön eki vardır ve `avax.importKey` ile bir anahtarı içeri aktarmak için kullanılabilir.
- `privateKeyHex`: `address`'i kontrol eden özel anahtarın hex formatındaki string temsili. Metamask'a bir hesap içeri aktarmak için kullanılabilir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avax.exportKey",
    "params" :{
        "username" :"myUsername",
        "password":"myPassword",
        "address": "0xc876DF0F099b3eb32cBB78820d39F5813f73E18C"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

**Örnek Yanıt**

```json
{
    "jsonrpc": "2.0",
    "result": {
        "privateKey": "PrivateKey-2o2uPgTSf3aR5nW6yLHjBEAiatAFKEhApvYzsjvAJKRXVWCYkE",
        "privateKeyHex": "0xec381fb8d32168be4cf7f8d4ce9d8ca892d77ba574264f3665ad5edb89710157"
    },
    "id": 1
}
```

### avax.getUTXOs

Verilen bir adresi referans alan UTXO'ları alır.

**İmza**

```sh
avax.getUTXOs(
    {
        addresses: string,
        limit: int, //opsiyonel
        startIndex: { //opsiyonel
            address: string,
            utxo: string
        },
        sourceChain: string,
        encoding: string, //opsiyonel
    },
) ->
{
    numFetched: int,
    utxos: []string,
    endIndex: {
        address: string,
        utxo: string
    }
}
```

- `utxos`: Her bir UTXO'nun `addresses` içinde en az bir adresi referans aldığı bir liste.
- En fazla `limit` kadar UTXO döndürülür. Eğer `limit` belirtilmezse veya 1024'ten büyükse, 1024 olarak ayarlanır.
- Bu yöntem, sayfalama destekler. `endIndex`, döndürülen son UTXO'yu belirtir. Bir sonraki UTXO setini almak için, `endIndex` değerini bir sonraki çağrıda `startIndex` olarak kullanın.
- Eğer `startIndex` belirtilmezse, `limit` kadar tüm UTXO'lar alınır.
- Sayfalama kullanılırken, UTXO'ların birden fazla çağrı arasında benzersiz olması garanti edilmez. Yani, bir UTXO ilk çağrının sonucunda görünürken, ikinci çağrıda tekrar görünebilir.
- Sayfalama kullanıldığında, birden fazla çağrı arasında tutarlılık garanti edilmez. Yani, `addresses` için UTXO seti, çağrılar arasında değişmiş olabilir.
- `encoding`, döndürülen UTXO'ların formatını ayarlar. `cb58` veya `hex` olabilir. Varsayılan değer `cb58`dir.

#### **Örnek**

Diyelim ki `C-columbus1yzt57wd8me6xmy3t42lz8m5lg6yruy79m6whsf` adresini referans alan tüm UTXO'ları istiyoruz.

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avax.getUTXOs",
    "params" :{
        "addresses":["C-columbus1yzt57wd8me6xmy3t42lz8m5lg6yruy79m6whsf"],
        "sourceChain": "X",
        "startIndex": {
            "address": "C-columbus1yzt57wd8me6xmy3t42lz8m5lg6yruy79m6whsf",
            "utxo": "22RXW7SWjBrrxu2vzDkd8uza7fuEmNpgbj58CxBob9UbP37HSB"
        },
        "encoding": "cb58"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

Bu yanıtı alırsınız:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "numFetched": "3",
    "utxos": [
      "11QEQTor9xZ1TyCyq8aFVShdP7YjM1ug9KuPUuMpgvQVz5qjEzo244NbJomjciNUPqUr1cD455dXhVrVNopnMXTQrTFY5kqrEVAQ3Ng9AnapQrYVEYiWc32F5CQuD3N5sB1EhQmMdJr5pis1QLjMmRQmut7Maafwup1vEU",
      "11Eo6c9iUz3ERtmHbdUb3nzzMaqFffFQStshEsSTiFQP5xqfmeaeCFHCBajmoJUdQRHtkChGAmPucDfuCyBAEyGmmv2w8b7dX5sATxV7HxHZE4eak14GMGVEr7v3ij1B8mE82cymTJJz1X3PpRk2pTaxwEnLWfh1aAiTFC",
      "118mpEHsia5sYYvKUx4j56mA7i1yvmLNyynm7LcmehcJJwMVY65smT4kGQgyc9DULwuaLTrUcsqbQutCdajoJXBdPVqvHMkYBTYQKs7WSmTXH8v7iUVqZfphMnS7VxVjGU1zykeTnbuAoZt4cFMUJzd8JaZk5eC82zmLmT"
    ],
    "endIndex": {
      "address": "C-columbus1yzt57wd8me6xmy3t42lz8m5lg6yruy79m6whsf",
      "utxo": "27q6nsuvtyT4mvXVnQQAXw1YKoTxCow5Qm91GZ678TU1SvUiC2"
    },
    "encoding": "cb58"
  },
  "id": 1
}
```

### avax.import

X-Chain'den C-Chain'e CAM dışındaki bir varlığın aktarımını tamamlayın. Bu yöntem çağrılmadan önce, transferi başlatmak için X-Chain'in  yöntemini `CAM` assetID'si ile çağırmalısınız.

**İmza**

```go
avax.import({
    to: string,
    sourceChain: string,
    baseFee: int, // opsiyonel
    username: string,
    password:string,
}) -> {txID: string}
```

**İstek**

- `to`: Varlığın gönderileceği adres. Bu, C-Chain'deki `export` çağrısındaki `to` argümanı ile aynı olmalıdır.
- `sourceChain`: Varlığın dışa aktarıldığı zincirin kimliği veya takma adı. X-Chain'den fonları içe aktarmak için `"X"` kullanın.
- `baseFee`: İşlem oluşturulurken kullanılacak temel ücret. Eğer belirtilmezse, önerilen bir ücret kullanılacaktır.
- `username`: İşlemin yapılacağı adresi kontrol eden kullanıcı.
- `password`: `username`'in parolası.

**Yanıt**

- `txID`: Tamamlanmış ImportTx'nin ID'sidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avax.import",
    "params" :{
        "to":"0x4b879aff6b3d24352Ac1985c1F45BA4c3493A398",
        "sourceChain":"X",
        "username":"myUsername",
        "password":"myPassword"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "6bJq9dbqhiQvoshT3uSUbg9oB24n7Ei6MLnxvrdmao78oHR9t"
  },
  "id": 1
}
```

### avax.importKey

Bir adres üzerinde kontrol sağlamak için özel anahtarı sağlayarak kullanıcıya adres yardımcı olun.

**İmza**

```go
avax.importKey({
    username: string,
    password:string,
    privateKey:string
}) -> {address: string}
```

**İstek**

- `privateKey`: `username`'in özel anahtarlar setine eklenmelidir.

**Yanıt**

- `address`: `username` artık özel anahtarla kontrol edilen adres. Hex formatında olacaktır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avax.importKey",
    "params" :{
        "username" :"myUsername",
        "password":"myPassword",
        "privateKey":"PrivateKey-2o2uPgTSf3aR5nW6yLHjBEAiatAFKEhApvYzsjvAJKRXVWCYkE"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "address": "0xc876DF0F099b3eb32cBB78820d39F5813f73E18C"
  },
  "id": 1
}
```

### avax.issueTx

Ağ üzerinde imzalı bir işlemi gönderin. `encoding`, imzalı işlemin formatını belirtir. `cb58` veya `hex` olabilir. Varsayılan değer `cb58`dir.

**İmza**

```sh
avax.issueTx({
    tx: string,
    encoding: string, //opsiyonel
}) -> {
    txID: string
}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     : 1,
    "method" :"avax.issueTx",
    "params" :{
        "tx":"6sTENqXfk3gahxkJbEPsmX9eJTEFZRSRw83cRJqoHWBiaeAhVbz9QV4i6SLd6Dek4eLsojeR8FbT3arFtsGz9ycpHFaWHLX69edJPEmj2tPApsEqsFd7wDVp7fFxkG6HmySR",
        "encoding": "cb58"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "txID": "NUPLwbt2hsYxpQg4H2o451hmTWQ4JZx2zMzM4SinwtHgAdX1JLPHXvWSXEnpecStLj"
  }
}
```

### avax.getAtomicTxStatus

Ağa gönderilen bir atomik işlemin durumunu alın.

**İmza**

```sh
avax.getAtomicTxStatus({txID: string}) -> {
  status: string,
  blockHeight: string // kabul edildiğinde döndürülen
}
```

`status` şu değerlerden biridir:

- `Accepted`: İşlem her düğüm tarafından kabul edilecek (veya kabul edilecektir). `blockHeight` özelliğine kontrol edin.
- `Processing`: İşlem bu düğüm tarafından oylama aşamasındadır.
- `Dropped`: İşlem, bu düğüm tarafından geçersiz olduğu düşünüldüğü için bırakıldı.
- `Unknown`: İşlem bu düğüm tarafından henüz görülmedi.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avax.getAtomicTxStatus",
    "params" :{
        "txID":"2QouvFWUbjuySRxeX5xMbNCuAaKWfbk5FeEa2JmoF85RKLk2dD"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/avax
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "status": "Accepted",
    "blockHeight": "1"
  }
}
```

## Yönetici API'si

Bu API hata ayıklama amacıyla kullanılabilir. Yönetici API'si varsayılan olarak kapalıdır. Yönetici API'si etkinleştirilmiş bir düğüm çalıştırmak için,  `--coreth-admin-api-enabled:true` olarak kullanın.

### Uç Nokta

```text
/ext/bc/C/admin
```

### Yöntemler

#### admin.setLogLevel

C-Chain'in log seviyesini ayarlar.

**İmza**

```text
admin.setLogLevel({level:string}) -> {success:bool}
```

- `level`: Belirtilen log seviyesidir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.setLogLevel",
    "params": {
        "level":"info"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

#### admin.startCPUProfiler

CPU profilini başlatır.

**İmza**

```text
admin.startCPUProfiler() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.startCPUProfiler",
    "params": {}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

#### admin.stopCPUProfiler

CPU profilini durdurur ve yazar.

**İmza**

```text
admin.stopCPUProfiler() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.stopCPUProfiler",
    "params": {}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

#### admin.memoryProfile

Bellek profilini çalıştırır ve yazar.

**İmza**

```text
admin.memoryProfile() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.memoryProfile",
    "params": {}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}
```

#### admin.lockProfile

Mutex profilini çalıştırır ve `coreth_performance_c` dizinine yazar.

**İmza**

```text
admin.lockProfile() -> {success:bool}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.lockProfile",
    "params": {}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/admin
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "success": true
  }
}