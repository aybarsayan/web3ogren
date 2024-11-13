---
sidebar_position: 10
---

# Bilgi API'si

Bu API, düğüm hakkında temel bilgilere erişim sağlamak için kullanılabilir.

## Format

Bu API, `json 2.0` RPC formatını kullanır. JSON RPC çağrıları yapma hakkında daha fazla bilgi için  bakabilirsiniz.

## Endpoint

```text
/ext/info
```

## API Yöntemleri

### info&#46;getBlockchainID

Bir blockchain'in takma adını verildiğinde, ID'sini alır. (Daha fazla bilgi için  kısmına bakabilirsiniz.)

**İmza**

```sh
info.getBlockchainID({alias:string}) -> {blockchainID:string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getBlockchainID",
    "params": {
        "alias":"X"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockchainID": "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM"
  }
}
```

### info&#46;getNetworkID

Bu düğümün katıldığı ağın ID'sini alır.

**İmza**

```sh
info.getNetworkID() -> {networkID:int}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getNetworkID"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "networkID": "2"
  }
}
```

### info&#46;getNetworkName

Bu düğümün katıldığı ağın adını alır.

**İmza**

```sh
info.getNetworkName() -> {networkName:string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getNetworkName"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "networkName": "local"
  }
}
```

### info&#46;getNodeID

Bu düğümün ID'sini alır.

**İmza**

```sh
info.getNodeID() -> {nodeID: string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getNodeID"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "nodeID": "NodeID-5mb46qkSBj81k9g9e4VFjGGSbaaSLFRzD"
  },
  "id": 1
}
```

### info&#46;getNodeIP

Bu düğümün IP'sini alır.

**İmza**

```text
info.getNodeIP() -> {ip: string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getNodeIP"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "ip": "192.168.1.1:9651"
  },
  "id": 1
}
```

### info&#46;getNodeVersion

Bu düğümün sürümünü alır.

**İmza**

```sh
info.getNodeVersion() -> {
    version: string,
    databaseVersion: string,
    gitCommit: string,
    vmVersions: map[string]string,
}
```

Burada:

- `version` bu düğümün sürümüdür
- `databaseVersion` bu düğümün kullandığı veritabanının sürümüdür
- `gitCommit` bu düğümün inşa edildiği Git commit'tir
- `vmVersions` her biri bir VM'in adı ve bu düğümün çalıştırdığı VM sürümü olan bir anahtar/değer çiftleridir

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getNodeVersion"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "version": "camino/1.4.10",
    "databaseVersion": "v1.4.5",
    "gitCommit": "a3930fe3fa115c018e71eb1e97ca8cec34db67f1",
    "vmVersions": {
      "avm": "v1.4.10",
      "evm": "v0.5.5-rc.1",
      "platform": "v1.4.10"
    }
  },
  "id": 1
}
```

### info&#46;getVMs

Bu düğümde yüklü olan sanal makineleri alır.

**İmza**

```
info.getVMs() -> {
    vms: map[string][]string
}
```

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getVMs",
    "params" :{}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "vms": {
      "jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq": ["avm"],
      "mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6": ["evm"],
      "qd2U4HDWUvMrVUeTcCHp6xH3Qpnn1XbU5MDdnBoiifFqvgXwT": ["nftfx"],
      "rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWmSy4kxnT": ["platform"],
      "rXJsCSEYXg2TehWxCEEGj6JU2PWKTkd6cBdNLjoe2SpsKD9cy": ["propertyfx"],
      "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ": ["secp256k1fx"]
    }
  },
  "id": 1
}
```

### info&#46;isBootstrapped

Verilen zincirin bootstrap işleminin tamamlanıp tamamlanmadığını kontrol eder.

**İmza**

```sh
info.isBootstrapped({chain: string}) -> {isBootstrapped: bool}
```

`chain`, bir zincirin ID'si veya takma adı olacaktır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.isBootstrapped",
    "params": {
        "chain":"X"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "isBootstrapped": true
  },
  "id": 1
}
```

### info&#46;peers

Eş bağlantılarının bir tanımını alır.

**İmza**

```sh
info.peers({
    nodeIDs: string[] // isteğe bağlı
}) ->
{
    numPeers: int,
    peers:[]{
        ip: string,
        publicIP: string,
        nodeID: string,
        version: string,
        lastSent: string,
        lastReceived: string,
        benched: string[],
        observedUptime: int,
    }
}
```

- `nodeIDs`, hangi nodeID'lerin tanımlarının döndürüleceğini belirtmek için isteğe bağlı bir parametredir. Bu parametre boş bırakılırsa, tüm aktif bağlantılar için tanımlar döndürülecektir. Eğer düğüm belirtilen nodeID'ye bağlı değilse, yanıtında çıkarılacaktır.
- `ip`, eşin uzaktaki IP'sidir.
- `publicIP`, eşin genel IP'sidir.
- `nodeID`, eşin ön ekli Node ID'sidir.
- `version`, eşin hangi sürümü kullandığını gösterir.
- `lastSent`, eşe en son gönderilen mesajın zaman damgasıdır.
- `lastReceived`, eşten en son alınan mesajın zaman damgasıdır.
- `benched`, eşin değerlendirildiği zincir ID'lerini gösterir.
- `observedUptime`, eş tarafından gözlemlenen bu düğümün çalışma süresidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.peers",
    "params": {
        "nodeIDs": []
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "numPeers": 3,
    "peers": [
      {
        "ip": "206.189.137.87:9651",
        "publicIP": "206.189.137.87:9651",
        "nodeID": "NodeID-8PYXX47kqLDe2wD4oPbvRRchcnSzMA4J4",
        "version": "camino/0.5.0",
        "lastSent": "2020-06-01T15:23:02Z",
        "lastReceived": "2020-06-01T15:22:57Z",
        "benched": [],
        "observedUptime": "99"
      },
      {
        "ip": "158.255.67.151:9651",
        "publicIP": "158.255.67.151:9651",
        "nodeID": "NodeID-C14fr1n8EYNKyDfYixJ3rxSAVqTY3a8BP",
        "version": "camino/0.5.0",
        "lastSent": "2020-06-01T15:23:02Z",
        "lastReceived": "2020-06-01T15:22:34Z",
        "benched": [],
        "observedUptime": "75"
      },
      {
        "ip": "83.42.13.44:9651",
        "publicIP": "83.42.13.44:9651",
        "nodeID": "NodeID-LPbcSMGJ4yocxYxvS2kBJ6umWeeFbctYZ",
        "version": "camino/0.5.0",
        "lastSent": "2020-06-01T15:23:02Z",
        "lastReceived": "2020-06-01T15:22:55Z",
        "benched": [],
        "observedUptime": "95"
      }
    ]
  }
}
```

### info&#46;getTxFee

Ağın ücretlerini alır.

**İmza**

```sh
info.getTxFee() ->
{
    creationTxFee: uint64,
    txFee: uint64
}
```

- `creationTxFee`, ağda varlık oluşturma ücreti.
- `txFee`, ağda işlem yapma ücreti.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getTxFee"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "creationTxFee": "10000000",
    "txFee": "1000000"
  }
}
```

### info&#46;uptime

Ağın, bu düğüm için gözlemlenen çalışma süresini döndürür.

**İmza**

```sh
info.uptime() ->
{
    rewardingStakePercentage: float64,
    weightedAveragePercentage: float64
}
```

- `rewardingStakePercentage`, bu düğümün çalışma süresi gereksinimlerinin üzerinde olduğunu düşünen stake yüzdesidir.
- `weightedAveragePercentage`, bu düğüm için gözlemlenen tüm çalışma sürelerinin stake ağırlıklı ortalamasıdır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.uptime"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "rewardingStakePercentage": "100.0000",
    "weightedAveragePercentage": "99.0000"
  }
}