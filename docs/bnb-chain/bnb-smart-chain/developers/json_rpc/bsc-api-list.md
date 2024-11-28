---
title: Bsc API List- BSC Geliştir
description: Bu belge, BSC ile ilgili nihai ve ekonomik nihai API'leri detaylandırmaktadır. Kullanıcıların blok zinciri bilgilerini daha etkili bir biçimde yönetmeleri için gereken araçlar sunulmaktadır.
keywords: [BSC, API, blok zinciri, ekonomik nihai, nihai blok]
---

## Nihai API
Nihai, blok zinciri güvenliğinin kritik bir yönüdür; bir blok onaylandığında, geri alınamaz veya değiştirelemez. Bu, kullanıcıların bloktaki bilgileri gecikmeden kullanabilme güvenini sağlar.

### Olası Nihai ve Ekonomik Nihai

Olası nihai olmayan blok zincirinde, bir blok zincirde ne kadar derin gömülmüşse, geri alınma olasılığı o kadar düşüktür. Belirli bir bloğu takip eden daha fazla blok varsa, o bloğu içeren zincirin daha uzun olma olasılığı da artar. **Genellikle, BSC kullanıcıları bir bloğu mühürlemek için en az 11 veya 15 farklı doğrulayıcıyı beklemelidir. Eğer doğrulayıcılara ardışık birden fazla blok üretme izni verilirse, olası nihai sağlamak için gereken blok sayısı yaklaşık 11\*n veya 15\*n'dir; burada "n" üretilen ardışık blok sayısını ifade eder.**

:::tip
Nihai blokları hızlı bir şekilde tespit etmek için doğrulayıcı sayısını doğru bir şekilde ayarlamak önemlidir.
:::

Ekonomik nihai, bir bloğun geri alınmasıyla ilişkili yüksek maliyeti ifade eder. Slashing mekanizması kullanan proof-of-stake sistemlerinde (örneğin, Casper FFG, Tendermint veya BSC Hızlı Nihai), eğer doğrulayıcılar oylama kurallarını ihlal ederse, paylarının bir kısmı veya tamamı kaybedilebilir. Bu ekonomik ceza, nihaiyi baltalamayı son derece pahalı hale getirir. Genel olarak, blok n, blok n+2 tarafından ekonomik nihaiye ulaşır; yani BSC Hızlı Nihai, onay süresini çoğu durumda iki bloğa indirir. Bu, kullanıcı deneyimini iyileştirerek işlem onayını daha hızlı ve daha güvenilir hale getirir.

### Ekonomik Nihai API

### `eth_getHeaderByNumber` Ethereum istemcisinde olduğu gibi.
**Parametreler**

**BlockNumber** QUANTITY|TAG

- HEX Dizesi - bir tam sayı blok numarası
- Dize "earliest" - en erken/ilk blok için
- Dize "latest" - en son madenlenmiş blok için
- Dize "safe" - en son haklı baş blok için
- Dize "**finalized**" - en son nihai blok için

### `eth_getBlockByNumber` Ethereum istemcisinde olduğu gibi.
**Parametreler**

**BlockNumber** QUANTITY|TAG

- HEX Dizesi - bir tam sayı blok numarası
- Dize "earliest" - en erken/ilk blok için
- Dize "latest" - en son madenlenmiş blok için
- Dize "safe" - en son haklı baş blok için
- Dize "**finalized**" - en son nihai blok için
  
**Full_transaction_flag** Boolean

- Eğer doğruysa, tam işlem nesnelerini döner; eğer yanlışsa, yalnızca işlemlerin hash'lerini döner.

### eth_newFinalizedHeaderFilter
İşte en son nihai blokları izlemenize yardımcı olabilecek iki API:
1. Nihai baş filtre oluşturun:
```
curl -X POST "http://localhost:8545" -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_newFinalizedHeaderFilter","params":[],"id":1}'
```
Bu, 5 dakika içinde sona erecek bir rpc.ID dönecektir, ardından başka bir tane alabilirsiniz:
```
{"jsonrpc":"2.0","id":1,"result":"0xcbdc7c21459e2cfbf72e2028f15a98c"}
```
2. Yukarıdaki rpc.ID'yi kullanarak en son nihai blokları alın. rpc.ID sona erene kadar birçok kez çağırabilirsiniz:
```
curl -X POST "http://localhost:8545" -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getFilterChanges","params":["0xcbdc7c21459e2cfbf72e2028f15a98c"],"id":1}'
```
Bu, blok hash'lerini dönecektir:
```
{"jsonrpc":"2.0","id":1,"result":["0x4b52061726b9f15905217699fd5dab8ff9bb704b3b16d27c34541cb15752a91f","0x2b984b80b25f0dddc92ba11290a3d250fc8a3ec6a09bd485c21dbbb8155d2f90"]}
```

### Birleşik Olası Nihai ve Ekonomik Nihai API

Bu yöntemler, blok nihaiyetini basit bir API kullanarak yönetmenizi sağlar.

### eth_getFinalizedHeader
* `verifiedValidatorNum` aralığında olmalıdır [1, len(currentValidators)].
* Bu işlev, `verifiedValidatorNum` doğrulayıcıları tarafından onaylanan en yüksek blok yüksekliği olarak `probabilisticFinalizedHeight`'i hesaplar ve ardından `max(fastFinalizedHeight, probabilisticFinalizedHeight)` yüksekliğine eşit bir blok başlığını döner.
* Dönen blok başlığının yüksekliği monotonik olarak artış gösterecektir.
Örneğin:
```
curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getFinalizedHeader","params":[15],"id":1}'
```

### eth_getFinalizedBlock
* `verifiedValidatorNum` aralığında olmalıdır [1, len(currentValidators)].
* Bu işlev, `verifiedValidatorNum` doğrulayıcıları tarafından onaylanan en yüksek blok yüksekliği olarak `probabilisticFinalizedHeight`'i hesaplar ve ardından `max(fastFinalizedHeight, probabilisticFinalizedHeight)` yüksekliğine eşit bir blok başlığını döner.
* Eğer `fullTx` doğruysa, blok tüm işlemleri içerir; aksi halde yalnızca işlem hash'leri içerilir.
* Dönen bloğun yüksekliği, monotonik olarak artış gösterecek şekilde garanti edilir.
Örneğin:
```
curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getFinalizedBlock","params":[11, false],"id":1}'

curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getFinalizedBlock","params":[15, true],"id":1}'
```

## Blob API

### eth_getBlobSidecarByTxHash
**Parametreler**

**Hash** Dize (GEREKLİ)

- HEX Dizesi - işlemin hash'i

**full_blob_flag** Boolean (OPSİYONEL)

- Varsayılan doğru. Eğer doğruysa, tam blob bilgisi döner; eğer yanlışsa yalnızca ilk 32 byte döner.

```
curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getBlobSidecarByTxHash","params":["0x377d3615d2e76f4dcc0c9a1674d2f5487cba7644192e7a4a5af9fe5f08b60a63"],"id":1}'

curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getBlobSidecarByTxHash","params":["0x377d3615d2e76f4dcc0c9a1674d2f5487cba7644192e7a4a5af9fe5f08b60a63", false],"id":1}'
```

### eth_getBlobSidecars
**Parametreler**

**BlockNumber** QUANTITY|TAG

- HEX Dizesi - bir tam sayı blok numarası
- HEX Dizesi - bloğun hash'i
- Dize "earliest" - en erken/ilk blok için
- Dize "latest" - en son madenlenmiş blok için
- Dize "safe" - en son haklı baş blok için
- Dize "finalized" - en son nihai blok için

**full_blob_flag** Boolean (OPSİYONEL)

- Varsayılan doğru. Eğer doğruysa, tam blob bilgisi döner; eğer yanlışsa yalnızca ilk 32 byte döner.

```
curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getBlobSidecars","params":["latest"],"id":1}'

curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getBlobSidecarByTxHash","params":["0xc5043f", false],"id":1}'
```


## Diğerleri

### eth_health

* Bir düğümün RPC işlevinin çalışıp çalışmadığını tespit etmek için bir sağlık kontrol noktasında. Doğru dönerse, çalışır; yanlışsa sağlıklı değil.

```
curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_health","params":[],"id":1}'
```

### eth_getTransactionsByBlockNumber

* Verilen blok numarası için tüm işlemleri al.

**Parametreler**

**BlockNumber** QUANTITY|TAG

- HEX Dizesi - bir tam sayı blok numarası
- Dize "earliest" - en erken/ilk blok için
- Dize "latest" - en son madenlenmiş blok için
- Dize "safe" - en son haklı baş blok için
- Dize "finalized" - en son nihai blok için

```
curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getTransactionsByBlockNumber","params":["0x539492"],"id":1}'
```


### eth_getTransactionDataAndReceipt

* Verilen işlem hash'i için orijinal işlem verilerini ve işlem makbuzunu al.

**Parametreler**

**Hash** Dize (GEREKLİ)

- HEX Dizesi - işlemin hash'i

```
curl -X POST "http://localhost:8545/" -H "Content-Type: application/json"  --data '{"jsonrpc":"2.0","method":"eth_getTransactionDataAndReceipt","params":["0x516a2ab1506b020e7f49d0d0ddbc471065624d1a603087262cebf4ca114ff588"],"id":1}'
```