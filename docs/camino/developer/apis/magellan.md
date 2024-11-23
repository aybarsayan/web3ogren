---
description: "Bu API, istemcilerin Magellan ile etkileşimde bulunmasını sağlar, Camino dizinleyicisi."
sidebar_position: 2
---

# Magellan API

### Format

Bu API, URL sorgu parametreleri kullanarak GET HTTP istekleri yapar ve JSON verileri döndürür.

### Sürümler

API sürüm 2 ile birlikte, istek yolları bir sürüm etiketi ile öne çıkacaktır; örneğin `http://localhost:8080/v2`.

API'nin mevcut sürümü sürüm 2'dir.  belgesi, v1 API'sinin kullanımı ile ilgili bilgileri içerir.

### Veri Türleri

Tam sayılar, dizeler ve boolean değerlerin yanı sıra, API boyunca kullanılan aşağıdaki veri türleri bulunmaktadır:

| Ad         | Açıklama                                                                    | Örnekler                                                           |
| :--------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `id`       | Bir CB58 kodlu nesne tanımlayıcısı, örneğin bir zincir, işlem veya varlık ID | `2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM`                |
| `address`  | Bech-32 kodlu bir adres (X-Zinciri ve P-Zinciri üzerinde kullanılır)      | `fuji1wycv8n7d2fg9aq6unp23pnj4q0arv03ysya8jw`                       |
| `datetime` | Bir Unix zaman damgası olarak bir tamsayı veya RFC3339 formatında bir dize | `1599696000`, `2022-01-09T00:00:00Z`                                |
| `caddress` | Bir hex kodlu adres (C-Zinciri üzerinde kullanılır)                        | `0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7`                        |
| `chash`    | Bir hex kodlu hash                                                         | `0xe5b935988317e8552e769ad92b6a2fd01ac8f0f90d8ffa4377e50fcb8d970077` |

### Liste Parametreleri

Kaynakları listelemek için tüm uç noktalar aşağıdaki parametreleri kabul eder:

| Ad          | Tür        | Açıklama                                                   | Varsayılan | Maks  |
| :---------- | :--------  | :-------------------------------------------------------- | :--------- | :---- |
| `limit`     | `int`     | Dönüş yapılacak maksimum nesne sayısı                      | `5000`     | `5000`|
| `query`     | `string`  | Nesneleri filtrelemek için bir ID ön eki                  | Yok        | Yok   |
| `startTime` | `datetime`| Belirtilen zamandan itibaren oluşturulan nesneleri kısıtlar| `0`       | Şimdi |
| `endTime`   | `datetime`| Belirtilen zamandan önce oluşturulan nesneleri kısıtlar   | Şimdi      | Şimdi |

## Mevcut Uç Noktalar

### Genel Bakış

API'nin kökü, dizinlenen mevcut Camino ağının değişkenlerine genel bir bakış sağlar.

**Params**

Yok

**Örnek İstek**

```text
curl "http://localhost:8080/v2"
```

**Örnek Yanıt**

```json
{
  "network_id": 1,
  "chains": {
    "11111111111111111111111111111111LpoYY": {
      "chainID": "11111111111111111111111111111111LpoYY",
      "chainAlias": "p",
      "vm": "pvm",
      "avaxAssetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
      "networkID": 1
    },
    "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM": {
      "chainID": "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      "chainAlias": "x",
      "vm": "avm",
      "avaxAssetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
      "networkID": 1
    }
  }
}
```

### Arama

Bir adresi veya işlemi ID'sine göre bulma.

**Params**

| Ad      | Tür      | Açıklama                      | Varsayılan | Maks  |
| :------ | :------- | :-----------------------------| :------    | :---- |
| `query` | `string` | Nesneleri filtrelemek için bir ID ön eki | Yok  | Yok   |

:::info
cBlock ve cTransaction sonuç türleri için ön ek arama uygulanmamaktadır. 
Arama, varlığı doğrulamak veya belirsiz girdileri çözmek için hala kullanılabilir. 
Örneğin, blok hash ve işlem hash'i benzer görünebilir; arama, hash'in türünü belirlemeye yardımcı olabilir.
:::

**Sonuç Türleri**

| Ad             | Açıklama                      |
| :------------- | :---------------------------- |
| `transaction`  | `X/P-zinciri işlemi`         |
| `asset`        | `X-zinciri varlığı`          |
| `address`      | `X/P-zinciri adresi`         |
| `output`       | `X/P-zinciri UTXO`           |
| `cBlock`       | `C-zinciri bloğu`            |
| `cTransaction` | `C-zinciri işlemi`           |

**Örnek İstek**

```text
curl "http://localhost:8080/v2/search?query=2jEugPDFN89KXLEXtf5"
```

**Örnek Yanıt**

```json
{
  "count": 1,
  "results": [
    {
      "type": "transaction",
      "data": {
        "id": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX",
        "chainID": "11111111111111111111111111111111LpoYY",
        "type": "add_validator",
        "inputs": [
          {
            "output": {
              "id": "G2Jq9fj6atW1jvJDTXJKHSkMhRWdrsFuafPpR98DK3izZdfqT",
              "transactionID": "11111111111111111111111111111111LpoYY",
              "outputIndex": 14025,
              "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
              "outputType": 7,
              "amount": "2000000000000",
              "locktime": 0,
              "threshold": 1,
              "addresses": ["columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3"],
              "timestamp": "2022-01-09T00:00:00Z",
              "redeemingTransactionID": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX"
            },
            "credentials": [
              {
                "address": "columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3",
                "public_key": "AgSmTeCLGsNhKvSbRIi01jswlr2fV+C/tv3v86Ty4eDQ",
                "signature": "Ms5KquahoTfLGeIl5s6iP5r1fj15lm5MmrMahu8X7L0m5UTyRBRmcXnniURFaJP6X8dCL9f46t8zYawXscdgkQE="
              }
            ]
          }
        ],
        "outputs": [
          {
            "id": "U7M4jk3y7KGWPmSoeS4WhBX6qNHGtkDtQ5dSzYiaw4rmZ92yE",
            "transactionID": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX",
            "outputIndex": 0,
            "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
            "outputType": 7,
            "amount": "2000000000000",
            "locktime": 0,
            "threshold": 1,
            "addresses": ["columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3"],
            "timestamp": "2022-01-10T07:09:44Z",
            "redeemingTransactionID": ""
          }
        ],
        "memo": "AAAAAA==",
        "inputTotals": {
          "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": "2000000000000"
        },
        "outputTotals": {
          "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": "2000000000000"
        },
        "reusedAddressTotals": null,
        "timestamp": "2022-01-10T07:09:44Z",
        "txFee": 0,
        "genesis": false
      },
      "score": 0
    }
  ]
}
```

**Örnek İstek**

```text
curl "http://localhost:8080/v2/search?query=123"
curl "http://localhost:8080/v2/search?query=0x9f6bb7e15af9a07818c938679e9782c3afc0a0016968565c338d44f705fd0fd6"
```

**Örnek Yanıt**

```json
{
  "count": 1,
  "results": [
    {
      "type": "cBlock",
      "data": {
        "number": 123,
        "hash": "0x9f6bb7e15af9a07818c938679e9782c3afc0a0016968565c338d44f705fd0fd6"
      },
      "score": 0
    }
  ]
}
```

### Toplama

Bir zaman diliminde toplam işlem verilerini hesaplayın.

**Params**

| Ad            | Tür     | Açıklama                                                     | Varsayılan | Maks  |
| :------------ | :------ | :---------------------------------------------------------- | :--------- | :---- |
| `chainID`     | `id`    | Sonuçları filtrelemek için bir zincir ID'si. Birden fazla kez belirtilebilir.| Yok      | Yok   |
| `assetID`     | `id`    | Sonuçları filtrelemek için bir varlık ID'si.                | Yok        | Yok   |
| `intervalSize`| `string`| 'dakika', 'saat', 'gün', 'hafta', 'ay', 'yıl' değerleri    | Yok        | Yok   |

**Örnek İstek**

```text
curl "http://localhost:8080/v2/aggregates?startTime=2020-09-21T00:00:00Z&endTime=2020-10-21T00:00:00Z"
```

**Örnek Yanıt**

```json
{
  "startTime": "2020-09-21T00:00:00Z",
  "endTime": "2020-10-21T00:00:00Z",
  "aggregates": {
    "startTime": "2020-09-21T00:00:00Z",
    "endTime": "2020-10-21T00:00:00Z",
    "transactionVolume": "1652211194850792239",
    "transactionCount": 135966,
    "addressCount": 19567,
    "outputCount": 283221,
    "assetCount": 180
  }
}
```

### TxFee Aggregate

AVAX Toplam işlem ücreti verisi.

**Örnek İstek**

```text
curl "http://localhost:8080/v2/txfeeAggregates?startTime=2020-09-21T00:00:00Z&endTime=2020-10-21T00:00:00Z"
```

**Örnek Yanıt**

```json
{
  "aggregates": {
    "startTime": "2020-09-21T00:00:00Z",
    "endTime": "2020-10-21T00:00:00Z",
    "txfee": "134818000000"
  },
  "startTime": "2020-09-21T00:00:00Z",
  "endTime": "2020-10-21T00:00:00Z"
}
```

### Adres Zinciri

Bir adresin bulunduğu zincirlerle yanıt verir.

**Params**

| Ad        | Tür      | Açıklama                                                      | Varsayılan | Maks  |
| :-------- | :------- | :----------------------------------------------------------- | :--------- | :---- |
| `address` | `address`| Sonuçları filtrelemek için bir adres. Birden fazla kez belirtilebilir. | Yok      | Yok   |

**Örnek İstek**

```text
curl "http://localhost:8080/v2/addressChains?address=X-fujiABC"
```

**Örnek Yanıt**

```json
{
  "addressChains": {
    "columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3": [
      "11111111111111111111111111111111LpoYY"
    ],
    "avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u": [
      "11111111111111111111111111111111LpoYY",
      "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM"
    ]
  }
}
```

### İşlemleri Listele

Kabul edilen işlemleri bulun.

**Params**

| Ad        | Tür      | Açıklama                                                      | Varsayılan         | Maks  |
| :-------- | :------- | :----------------------------------------------------------- | :------------------ | :---- |
| `chainID` | `id`     | Sonuçları filtrelemek için bir zincir ID'si. Birden fazla kez belirtilebilir. | Yok                 | Yok   |
| `assetID` | `id`     | Sonuçları filtrelemek için bir varlık ID'si.                | Yok                  | Yok   |
| `address` | `address`| Sonuçları filtrelemek için bir adres. Birden fazla kez belirtilebilir. | Yok                  | Yok   |
| `sort`    | `string` | Sonuçları sıralamak için bir yöntem. `timestamp-asc` veya `timestamp-desc` olabilir. | `timestamp-asc`    | N/A  |

**Örnek İstek**

```bash
curl "http://localhost:8080/v2/transactions?chainID=11111111111111111111111111111111LpoYY"
```

**Örnek Yanıt**

```json
{
  "startTime": "0001-01-01T00:00:00Z",
  "endTime": "2020-11-16T04:18:07Z",
  "transactions": [
    {
      "id": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX",
      "chainID": "11111111111111111111111111111111LpoYY",
      "type": "add_validator",
      "inputs": [
        {
          "output": {
            "id": "G2Jq9fj6atW1jvJDTXJKHSkMhRWdrsFuafPpR98DK3izZdfqT",
            "transactionID": "11111111111111111111111111111111LpoYY",
            "outputIndex": 14025,
            "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
            "outputType": 7,
            "amount": "2000000000000",
            "locktime": 0,
            "threshold": 1,
            "addresses": ["columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3"],
            "timestamp": "2022-01-09T00:00:00Z",
            "redeemingTransactionID": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX"
          },
          "credentials": [
            {
              "address": "columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3",
              "public_key": "AgSmTeCLGsNhKvSbRIi01jswlr2fV+C/tv3v86Ty4eDQ",
              "signature": "Ms5KquahoTfLGeIl5s6iP5r1fj15lm5MmrMahu8X7L0m5UTyRBRmcXnniURFaJP6X8dCL9f46t8zYawXscdgkQE="
            }
          ]
        }
      ],
      "outputs": [
        {
          "id": "U7M4jk3y7KGWPmSoeS4WhBX6qNHGtkDtQ5dSzYiaw4rmZ92yE",
          "transactionID": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX",
          "outputIndex": 0,
          "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
          "outputType": 7,
          "amount": "2000000000000",
          "locktime": 0,
          "threshold": 1,
          "addresses": ["columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3"],
          "timestamp": "2022-01-10T07:09:44Z",
          "redeemingTransactionID": ""
        }
      ],
      "memo": "AAAAAA==",
      "inputTotals": {
        "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": "2000000000000"
      },
      "outputTotals": {
        "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": "2000000000000"
      },
      "reusedAddressTotals": null,
      "timestamp": "2022-01-10T07:09:44Z",
      "txFee": 0,
      "genesis": false
    }
  ]
}
```

### İşlemi Al

ID'sine göre tek bir işlemi bulma.

**Örnek İstek**

```text
curl "http://localhost:8080/v2/transactions/2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX"
```

**Örnek Yanıt**

```json
{
  "id": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX",
  "chainID": "11111111111111111111111111111111LpoYY",
  "type": "add_validator",
  "inputs": [
    {
      "output": {
        "id": "G2Jq9fj6atW1jvJDTXJKHSkMhRWdrsFuafPpR98DK3izZdfqT",
        "transactionID": "11111111111111111111111111111111LpoYY",
        "outputIndex": 14025,
        "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
        "outputType": 7,
        "amount": "2000000000000",
        "locktime": 0,
        "threshold": 1,
        "addresses": ["columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3"],
        "timestamp": "2022-01-09T00:00:00Z",
        "redeemingTransactionID": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX"
      },
      "credentials": [
        {
          "address": "columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3",
          "public_key": "AgSmTeCLGsNhKvSbRIi01jswlr2fV+C/tv3v86Ty4eDQ",
          "signature": "Ms5KquahoTfLGeIl5s6iP5r1fj15lm5MmrMahu8X7L0m5UTyRBRmcXnniURFaJP6X8dCL9f46t8zYawXscdgkQE="
        }
      ]
    }
  ],
  "outputs": [
    {
      "id": "U7M4jk3y7KGWPmSoeS4WhBX6qNHGtkDtQ5dSzYiaw4rmZ92yE",
      "transactionID": "2jEugPDFN89KXLEXtf5oKp5spsJawTht2zP4kKJjkQwwRsDdLX",
      "outputIndex": 0,
      "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
      "outputType": 7,
      "amount": "2000000000000",
      "locktime": 0,
      "threshold": 1,
      "addresses": ["columbus14q43wu6wp8fs745dt6y5s0a02vx57ypq4xc5s3"],
      "timestamp": "2022-01-10T07:09:44Z",
      "redeemingTransactionID": ""
    }
  ],
  "memo": "AAAAAA==",
  "inputTotals": {
    "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": "2000000000000"
  },
  "outputTotals": {
    "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": "2000000000000"
  },
  "reusedAddressTotals": null,
  "timestamp": "2022-01-10T07:09:44Z",
  "txFee": 0,
  "genesis": false
}
```

### Adresleri Listele

Kabul edilen işlemlerde referred edilen adresleri bulun.

**Params**

| Ad        | Tür      | Açıklama                                                  | Varsayılan | Maks  |
| :-------- | :------- | :------------------------------------------------------- | :--------- | :---- |
| `chainID` | `id`     | Sonuçları filtrelemek için bir zincir ID'si. Birden fazla kez belirtilebilir. | Yok  | Yok   |
| `address` | `address`| Sonuçları filtrelemek için bir adres. Birden fazla kez belirtilebilir. | Yok  | Yok   |

**Örnek İstek**

```text
curl "http://localhost:8080/v2/addresses?address=X-avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u"
```

**Örnek Yanıt**

```json
{
  "addresses": [
    {
      "address": "avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u",
      "publicKey": null,
      "assets": {
        "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": {
          "id": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
          "transactionCount": 2,
          "utxoCount": 17,
          "balance": "39561999999996",
          "totalReceived": "39561999999996",
          "totalSent": "0"
        }
      }
    }
  ]
}
```

### Tek Adresi Al

ID'sine göre tek bir adresi bulma.

**Örnek İstek**

```text
curl "http://localhost:8080/v2/addresses/avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u"
```

**Örnek Yanıt**

```json
{
  "address": "avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u",
  "publicKey": null,
  "assets": {
    "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP": {
      "id": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
      "transactionCount": 2,
      "utxoCount": 17,
      "balance": "39561999999996",
      "totalReceived": "39561999999996",
      "totalSent": "0"
    }
  }
}
```

### Varlıkları Listele

X-zinciri üzerinde oluşturulan varlıkları bulun.

**Örnek İstek**

```text
curl "http://localhost:8080/v2/assets"
```

**Örnek Yanıt**

```json
{
  "assets": [
    {
      "id": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
      "chainID": "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      "name": "Camino",
      "symbol": "CAM",
      "alias": "CAM",
      "currentSupply": "10000000000000",
      "timestamp": "2022-01-10T00:00:00Z",
      "denomination": 9,
      "variableCap": 0,
      "nft": 1
    }
  ]
}
```

### Tek Varlığı Al

ID'sine göre tek bir varlığı bulma.

**Örnek İstek**

```text
curl "http://localhost:8080/v2/assets/2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP"
```

**Örnek Yanıt**

```json
{
  "id": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
  "chainID": "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
  "name": "Camino",
  "symbol": "CAM",
  "alias": "CAM",
  "currentSupply": "100000000000",
  "timestamp": "2022-01-10T00:00:00Z",
  "denomination": 9,
  "variableCap": 0,
  "nft": 1
}
```

### Çıktıları Listele

Kabul edilen bir işlem tarafından oluşturulan çıktıları bulun.

**Params**

| Ad        | Tür      | Açıklama                                                                 | Varsayılan | Maks  |
| :-------- | :------- | :----------------------------------------------------------------------- | :--------- | :---- |
| `chainID` | `id`     | Sonuçları filtrelemek için bir zincir ID'si. Birden fazla kez belirtilebilir. | Yok       | Yok   |
| `address` | `address`| Sonuçları filtrelemek için bir adres. Birden fazla kez belirtilebilir.  | Yok       | Yok   |
| `spent`   | `bool`   | Eğer belirtilirse, sonuçlar harcama durumuna göre filtrelenecektir (doğru) veya harcanmamış (yanlış) olarak | Yok   | N/A  |

**Örnek İstek**

```text
curl "http://localhost:8080/v2/outputs?address=X-avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u&spent=false"
```

**Örnek Yanıt**

```json
{
  "outputs": [
    {
      "id": "114RMPhYM7do7cDX7KWSqFeLkbUXFrLKcqPL4GMdjTvemPzvc",
      "transactionID": "dhU8aMRrtMWvBWSh41aTxUbwArYootNUBcL3N3UJXVPL8H9ip",
      "outputIndex": 4,
      "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
      "outputType": 7,
      "amount": "2327176470588",
      "locktime": 0,
      "threshold": 1,
      "addresses": ["avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u"],
      "timestamp": "2022-01-09T00:00:00Z",
      "redeemingTransactionID": ""
    }
  ]
}
```

### Tek Çıktıyı Al

ID'sine göre tek bir çıktıyı bulma.

**Örnek İstek**

```text
curl "http://localhost:8080/v2/outputs/114RMPhYM7do7cDX7KWSqFeLkbUXFrLKcqPL4GMdjTvemPzvc"
```

**Örnek Yanıt**

```json
{
  "id": "114RMPhYM7do7cDX7KWSqFeLkbUXFrLKcqPL4GMdjTvemPzvc",
  "transactionID": "dhU8aMRrtMWvBWSh41aTxUbwArYootNUBcL3N3UJXVPL8H9ip",
  "outputIndex": 4,
  "assetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP",
  "outputType": 7,
  "amount": "2327176470588",
  "locktime": 0,
  "threshold": 1,
  "addresses": ["avax1y8cyrzn2kg4udccs5d625gkac7a99pe452cy5u"],
  "timestamp": "2022-01-09T00:00:00Z",
  "redeemingTransactionID": ""
}

---
title: C-Chain Blokları ve İşlemleri
---

### C-Chain Blokunu Al

Bir bloğu numarasına göre bulun.

**Parametreler**

| İsim | Tür      | Açıklama      | Varsayılan | Maks  |
| :--- | :------- | :------------ | :--------- | :---- |
| -    | `number` | blockHeight   | Latest     | None  |

**Örnek Çağrı**

```text
curl "http://localhost:8080/v2/ctxdata/64927"
```

**Örnek Yanıt**

```json
{
  "hash": "0xc52ba5ec8481518c448c26620b7e3859d913ad08b09eb022ea3c8be08e03a232",
  "header": {
    "parentHash": "0x181fd136fe5222779232a0d5d2e41e6783c33493eec634f147ee5c439621d4ef",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "miner": "0x0100000000000000000000000000000000000000",
    "stateRoot": "0xf9bd33dbfb7c9e416d9413b5dbecfae1257527db63de6d89acda4775a82a07b5",
    "transactionsRoot": "0x85915a8a01c3ca5d44b720d8b680560c6486195a7230412a883e5e48f45eb8cc",
    "receiptsRoot": "0x5aea15aff926ebc80724835977865734f7ce82e855d0a8ca0c16d31f593495bc",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000001000010000000000000000004000000000000000000000000000020000000000000000000000200000000000000000000008000000000000000000000000000000000000000000000000020000000000000000000800000020000000010000000010000000000000000000012000000000000000000000100000000008000000000000000000000000000000040000000000000000000000000000800010000000000000400000000002000000000000000000000000000000000000000000080000000020000000000000000000000000000000000000000000000080000000000000000000",
    "difficulty": "0x1",
    "number": "0xfd9f",
    "gasLimit": "0x7a1200",
    "gasUsed": "0x37930",
    "timestamp": "0x62972ec4",
    "extraData": "0x",
    "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "nonce": "0x0000000000000000",
    "extDataHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "baseFeePerGas": "0xba43b7400",
    "extDataGasUsed": "0x0",
    "blockGasCost": "0x0",
    "hash": "0xc52ba5ec8481518c448c26620b7e3859d913ad08b09eb022ea3c8be08e03a232"
  },
  "transactions": [
    {
      "type": 2,
      "block": "64927",
      "hash": "0xa8652e2af318b8f5874f4fe3ac8593430c9c802ed196184c081b4779b155c713",
      "createdAt": "2022-06-01T09:17:57Z",
      "nonce": 64348,
      "gasPrice": "102500000000",
      "maxFeePerGas": "102500000000",
      "maxPriorityFeePerGas": "2500000000",
      "gasLimit": 5000000,
      "value": "0",
      "input": "0x649120c20000000000000000000000000ef715db81323d3a88c42c5e19a7f6a4c5b5c6130000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000002b2a900000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000035697066733a2f2f516d55507a5a79313155687855446448793854503454653477786f6f7678717a565848687645756852637a545a470000000000000000000000",
      "fromAddr": "0x0ef715db81323d3a88c42c5e19a7f6a4c5b5c613",
      "toAddr": "0x60c677d61f8bf986911f75df1ee824d3199f6c15",
      "v": "0",
      "r": "746019894396887622778756402531639197930599696594141070070553186575068019889",
      "s": "85435664423701105804810201292151949459658150086516535748324303973864748460582",
      "receipt": {
        "root": null,
        "status": 1,
        "cumulativeGasUsed": 227632,
        "logsBloom": "0x00000000000000000000000000000000000000000000000000001000010000000000000000004000000000000000000000000000020000000000000000000000200000000000000000000008000000000000000000000000000000000000000000000000020000000000000000000800000020000000010000000010000000000000000000012000000000000000000000100000000008000000000000000000000000000000040000000000000000000000000000800010000000000000400000000002000000000000000000000000000000000000000000080000000020000000000000000000000000000000000000000000000080000000000000000000",
        "logs": [
          {
            "address": "0x60c677d61f8bf986911f75df1ee824d3199f6c15",
            "topics": [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x0000000000000000000000000000000000000000000000000000000000000000",
              "0x0000000000000000000000000ef715db81323d3a88c42c5e19a7f6a4c5b5c613",
              "0x000000000000000000000000000000000000000000000000000000000000051b"
            ],
            "data": "0x",
            "blockNumber": "0xfd9f",
            "transactionHash": "0xa8652e2af318b8f5874f4fe3ac8593430c9c802ed196184c081b4779b155c713",
            "transactionIndex": "0x0",
            "blockHash": "0xc52ba5ec8481518c448c26620b7e3859d913ad08b09eb022ea3c8be08e03a232",
            "logIndex": "0x0",
            "removed": false
          },
          {
            "address": "0x60c677d61f8bf986911f75df1ee824d3199f6c15",
            "topics": [
              "0x0904f4a3954ceeb5cebd9485aff873d11ad136ad3ccf08a1e77b36d2c24016f0",
              "0x000000000000000000000000000000000000000000000000000000000002b2a9",
              "0x0000000000000000000000000000000000000000000000000000000000000003"
            ],
            "data": "0x000000000000000000000000000000000000000000000000000000000000051b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000035697066733a2f2f516d55507a5a79313155687855446448793854503454653477786f6f7678717a565848687645756852637a545a470000000000000000000000",
            "blockNumber": "0xfd9f",
            "transactionHash": "0xa8652e2af318b8f5874f4fe3ac8593430c9c802ed196184c081b4779b155c713",
            "transactionIndex": "0x0",
            "blockHash": "0xc52ba5ec8481518c448c26620b7e3859d913ad08b09eb022ea3c8be08e03a232",
            "logIndex": "0x1",
            "removed": false
          }
        ],
        "type": 2,
        "transactionHash": "0xa8652e2af318b8f5874f4fe3ac8593430c9c802ed196184c081b4779b155c713",
        "contractAddress": "0x0000000000000000000000000000000000000000",
        "transactionIndex": 0,
        "gasUsed": 227632,
        "blockHash": "0xc52ba5ec8481518c448c26620b7e3859d913ad08b09eb022ea3c8be08e03a232",
        "blockNumber": 64927,
        "effectiveGasPrice": 52500000000
      }
    }
  ]
}
```

### Bloklar ve İşlemler Genel Görünümü

C-Chain üzerindeki en son blokların ve işlemlerin bilgilendirici listelerini alın.

**Parametreler**

| İsim            | Tür        | Açıklama              | Varsayılan | Maks   |
| :-------------- | :--------  | :-------------------- | :--------- | :----- |
| `limit`         | `number`   | blok limitini         | 0          | 10000  |
| `limit`         | `number`   | işlem limitini        | 0          | 10000  |
| `blockStart`    | `number`   | ilk blok              | 0          | None   |
| `blockEnd`      | `number`   | son blok              | 0          | None   |
| `transactionId` | `number`   | başlama / bitiş TxID  | 0          | None   |
| `address`       | `caddress` | adres (alıcı veya verici)| None    | None   |

`blockStart` ve `blockEnd` parametreleri değerlidir ve istenen sonuçları elde etmek için kullanılabilir; yani `blockStart` daha eski sonuçlar almak için veya `blockEnd` daha yeni sonuçlar almak için kullanılabilir. `address` birden fazla kez iletilebilir, ancak yalnızca işlem sonuçlarını etkiler.

Bir blok genellikle birden fazla İşlem içerdiğinden, belirli bir blok içinde başlayıcı transactionId belirtilebilir.

**Örnek Çağrı**

```text
curl "http://localhost:8080/v2/cblocks?limit=10&limit=10&startBlock=100&transactionId=1"
```

Bu çağrı, yükseklik 100'den başlayarak 10 blok ve yüksekliği 100 ve transactionId 1'den başlamak üzere 100 işlem sorgular. 100, 99,..., 91 ve ilgili 10 işlemi alacaksınız.

**Örnek Yanıt**
(Bağlantılı değil)

```json
{
  "blockCount": 6,
  "transactionCount": 4,
  "blocks": [
    {
      "hash": "0x5250dbfb39fa3d6b7ef8c7eb9ef2917396c0c3627a63cb55d15ccc1cb5b73347",
      "miner": "0x0100000000000000000000000000000000000000",
      "difficulty": "0x1",
      "number": "0x5",
      "gasLimit": "0x7a1200",
      "gasUsed": "0xe34a",
      "timestamp": "0x624dca9b",
      "baseFeePerGas": "0x5d21dba00",
      "extDataGasUsed": "0x0",
      "blockGasCost": "0x0",
      "evmTx": 1
    }
  ],
  "transactions": [
    {
      "type": "0x0",
      "block": "0x5",
      "index": "0x0",
      "hash": "0x2b04a8e89e89e1f79e675589b34e94f67bd53af4bb3bc3e123c66ded24726c0e",
      "nonce": "0x3",
      "gasPrice": "0x746a52880",
      "gas": "0xfa05",
      "value": "0x0",
      "from": "0x0e455a324ea5eed5b08d477c9ab7b18c6ab8715c",
      "to": "0xb364f7079f08443c17624f3155f726f630a1ce45",
      "timestamp": "0x624dca9b",
      "status": "0x1",
      "gasUsed": "0xe34a"
    },
    {
      "type": "0x2",
      "block": "0x4",
      "index": "0x0",
      "hash": "0x3af9fc482f216c1ca316f7c307c852a93391c326909b38fa7e9df1e9025d1563",
      "nonce": "0x2",
      "maxFeePerGas": "0xc393e6d00",
      "maxPriorityFeePerGas": "0x9502f900",
      "gas": "0xba48",
      "value": "0x0",
      "from": "0x0e455a324ea5eed5b08d477c9ab7b18c6ab8715c",
      "to": "0xb364f7079f08443c17624f3155f726f630a1ce45",
      "timestamp": "0x624d9c2e",
      "status": "0x1",
      "gasUsed": "0xba48"
    }
  ]
}
```

### C-Chain İşlemlerini Listele

Kabul edilen C-Chain işlemlerini bulun.

**Parametreler**

| İsim          | Tür        | Açıklama                     | Varsayılan | Maks  |
| :------------ | :--------  | :--------------------------- | :--------- | :---  |
| `toAddress`   | `caddress` | adres                        | None       | None  |
| `fromAddress` | `caddress` | adres                        | None       | None  |
| `address`     | `caddress` | adres (alıcı veya verici)    | None       | None  |
| `hash`        | `chash`    | işlem hash'i                 | None       | None  |
| `blockStart`  | `number`   | Dahil olan başlangıç blok numarası | None | N/A   |
| `blockEnd`    | `number`   | Hariç olan bitiş blok numarası | None  | N/A   |

**Örnek Çağrı**

```text
curl "http://localhost:8080/v2/ctransactions?toAddress=0x34ec164fd085ae43906eab6dffd1eae0a0855a2a&blockStart=797380&blockEnd=797381"
```

**Örnek Yanıt**

```json
{
  "Transactions": [
    {
      "type": 2,
      "block": "3",
      "hash": "0x0067ce3412147150da6080ca84c0fff7f80684214a41c931c647434081817087",
      "createdAt": "2022-04-30T08:49:44.512674Z",
      "nonce": 1,
      "gasPrice": "52500000000",
      "maxFeePerGas": "52500000000",
      "maxPriorityFeePerGas": "2500000000",
      "gasLimit": 51963,
      "value": "0",
      "input": "0x731133e90000000000000000000000000e455a324ea5eed5b08d477c9ab7b18c6ab8715c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000",
      "fromAddr": "0x0e455a324ea5eed5b08d477c9ab7b18c6ab8715c",
      "toAddr": "0xb364f7079f08443c17624f3155f726f630a1ce45",
      "v": "1",
      "r": "7848259674290569612178007903153068353576567577059024438939139798842134023075",
      "s": "32789367706775747617212356724916593721336985469384907264868581499177067597785",
      "receipt": {
        "type": "0x2",
        "root": "0x",
        "status": "0x1",
        "cumulativeGasUsed": "0xcafb",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000010002000000000000000000000000000000000000000000000000000000000000000000000000800020000000000000000000800000000000000000000000000000000000000100000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000008000000000000000020000000000000000000000000000000000000000000000000000000080000000000",
        "logs": [
          {
            "address": "0xb364f7079f08443c17624f3155f726f630a1ce45",
            "topics": [
              "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
              "0x0000000000000000000000000e455a324ea5eed5b08d477c9ab7b18c6ab8715c",
              "0x0000000000000000000000000000000000000000000000000000000000000000",
              "0x0000000000000000000000000e455a324ea5eed5b08d477c9ab7b18c6ab8715c"
            ],
            "data": "0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a",
            "blockNumber": "0x3",
            "transactionHash": "0x0067ce3412147150da6080ca84c0fff7f80684214a41c931c647434081817087",
            "transactionIndex": "0x0",
            "blockHash": "0x211284bb27f7a4868e2de120b4893f10ed676050ddb6c18ea6a53da11ae01184",
            "logIndex": "0x0",
            "removed": false
          }
        ],
        "transactionHash": "0x0067ce3412147150da6080ca84c0fff7f80684214a41c931c647434081817087",
        "contractAddress": "0x0000000000000000000000000000000000000000",
        "gasUsed": "0xcafb",
        "blockHash": "0x211284bb27f7a4868e2de120b4893f10ed676050ddb6c18ea6a53da11ae01184",
        "blockNumber": "0x3",
        "transactionIndex": "0x0"
      }
    }
  ],
  "startTime": "0001-01-01T00:00:00Z",
  "endTime": "2022-04-30T09:21:07Z"
}
```

### Eski API

API'nin 1. sürümü yalnızca X-chain'i desteklemek üzere oluşturulmuş ve bir versiyon ön eki (`/v1`) kullanmamıştır. Ana dizinde `/x` yolunda mevcuttur; bu, yalnızca X-chain için genel görünüm son noktasını temsil eder:

**Örnek Çağrı**

```text
curl "http://localhost:8080/x"
```

**Örnek Yanıt**

```json
{
  "networkID": 1,
  "vm": "avm",
  "chainAlias": "x",
  "chainID": "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
  "avaxAssetID": "2KGdt2HpFKpTH5CtGZjYt5XPWs6Pv9DLoRBhiFfntbezdRvZWP"
}
```

Eski API, 2. sürümle aynı uç noktaları ve parametreleri desteklemekte, ancak tüm uç noktaların chainID parametresi varsayılan olarak X-chain ID'sini almaktadır.