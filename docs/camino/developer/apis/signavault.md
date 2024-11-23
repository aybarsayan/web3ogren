---
description: "Bu API, çok imzalı işlemleri yöneten middleware olan Signavault ile etkileşimde bulunmak için istemcilere imkan tanır."
sidebar_position: 2
---

# Signavault API

### Format

Bu API, JSON yükleri veya URL sorgu parametreleri ile birlikte GET, PUT ve POST HTTP isteklerini kullanır ve JSON verisi döner.

### Versiyonlama

API versiyon 1 ile başlayarak, istek yollarına bir versiyon etiketi eklenecektir; örneğin `http://localhost:8080/v1/multisig`.

### Veri Türleri

Tam sayılar, dizeler ve booleans dışında, API boyunca kullanılan aşağıdaki veri türleri mevcuttur:

| Adı           | Açıklama                                                               | Örnekler                                                                   |
| :------------ | :--------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| `id`          | Bir CB58 kodlu nesne tanımlayıcısı, örneğin bir zincir, işlem veya varlık kimliği | `2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM`                        |
| `address`     | Bech-32 kodlu bir adres (X-Chain ve P-Chain'de kullanılır)            | `fuji1wycv8n7d2fg9aq6unp23pnj4q0arv03ysya8jw`                               |
| `timestamp`   | Bir Unix zaman damgası olarak bir dize                               | `1599696000`                                                              |
| `outputOwners`| `{threshold, locktime, addresses[]}` alanlarından oluşan bir nesne  | `{threshold: 1, locktime: 0, ["P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68"]}` |

## Mevcut Uç Noktalar

### Çok İmzalı İşlem Oluştur

Bu uç nokta, imza toplamak için yeni bir çok imzalı işlem oluşturur. İstemci, takma isim, unsignedTx ve imzayı sağlar. 
İmza yükü, unsigned işlemi içerir ve sahibinin özel anahtarı ile imzalanır. 
Açık anahtar, işlemin yaratıcısının bu takma isim için bir sahibi olduğunu doğrulamak için kullanılır. 
Yanıt, Node API'sinden elde edilen sahipler listesi ve takma isim eşiği ile aynı nesneyi dönecektir. 
Boş bir transactionId, bunun bekleyen bir işlem olduğunu gösterir.

**Parametreler**

| Adı                | Tür      | Açıklama                                                                                   | Varsayılan | Opsiyonel |
| :----------------- | :------- | :------------------------------------------------------------------------------------------ | :--------- | :-------- |
| `unsignedTx`       | `string` | İmzalanmamış bir işlem.                                                                    | Yok       | Hayır     |
| `alias`            | `id`     | İşlemi gerçekleştiren çok imzalı takma isim.                                               | Yok       | Hayır     |
| `signature`        | `string` | Sahibinin özel anahtarı ile imzalanmış imzasız işlem.                                      | Yok       | Hayır     |
| `outputOwners`     | `string` | `outputOwners` nesnesinin hex kodlu temsili                                                | Yok       | Hayır     |
| `metadata`         | `string` | Kayıt edilmek istenen bir düğümün imzası gibi bilgileri içerebilecek bir dize.            | Yok       | Evet      |
| `expiration`       | `int`    | Bir tamsayı olarak Unix zaman damgası                                                      | Yok       | Evet      |
| `parentTransaction`| `string` | İmzalanmamış işlemin ana işleminin hex temsili (henüz değerlendirilmemiş)                 | Yok       | Evet      |

**Sonuç Türleri**

| Adı            | Açıklama                                                   |
| :------------- | :---------------------------------------------------------- |
| `unsignedTx`   | Bekleyen imzalanmamış işlem                                 |
| `alias`        | Çok İmzalı Takma İsim                                      |
| `signature`    | Sahibinin özel anahtarı ile imzalanmış imzasız işlem.      |
| `outputOwners` | `outputOwners` nesnesinin hex kodlu temsili                 |
| `metadata`     | Metadata                                                  |

**Örnek Çağrı**

```sh
curl -X POST --data '{
  "unsignedTx": "00000000200400003039010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4a36162",
  "alias": "P-kopernikus1k4przmfu79ypp4u7y98glmdpzwk0u3sc7saazy",
  "signature": "83a657db18ff50438d418db9bde239a47bca2d910114aa0cc68ac736053c96c46b300f2c28d0ff6c8587ae916b66b5d575a731d8ecc37abee3c96bdc23dcd88b007c40d266",
  "outputOwners": "5b3e388c6da941fe35428251f2b6f3a8ba72f84b88b980126882ff11f083be85",
  "metadata": "602dac34ce89aec2ae19fa1a025ee6d8"
}' -H 'content-type:application/json;' http://localhost:8080/v1/multisig
```

**Örnek Yanıt**

```json
{
  "id": 25,
  "unsignedTx": "00000000200400003039010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4a36162",
  "alias": "P-kopernikus1k4przmfu79ypp4u7y98glmdpzwk0u3sc7saazy",
  "threshold": 2,
  "transactionId": "",
  "owners": [
    {
      "address": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68",
      "signature": "0x83a657db18ff50438d418db9bde239a47bca2d910114aa0cc68ac736053c96c46b300f2c28d0ff6c8587ae916b66b5d575a731d8ecc37abee3c96bdc23dcd88b007c40d266"
    },
    {
      "address": "P-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3",
      "signature": ""
    }
  ],
  "outputOwners": "5b3e388c6da941fe35428251f2b6f3a8ba72f84b88b980126882ff11f083be85",
  "metadata": "602dac34ce89aec2ae19fa1a025ee6d8"
}
```

### Çok İmzalı İşlemleri Al

Bu uç nokta, belirtilen takma isim ile bekleyen tüm işlemlerin bir dizisini dönecektir.

**Parametreler**

| Adı        | Tür       | Açıklama                                                                                                                                           | Varsayılan |
| :----------| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------| :---------- |
| `alias`    | `string`  | Çok imzalı takma isim                                                                                                                          |
| `signature`| `string`  | İmzalanması gereken yük, takma isim ve zaman damgasını içermelidir. Değerler bir dize olarak birleştirilir ve sahibinin özel anahtarı ile imzalanır. | Yok        |
| `timestamp`| `timestamp`| Unix epoch olarak bir dize                                                                                                                     | Yok        |

Örnek imza:

```text
signature = alias + timestamp
"P-kopernikus1k4przmfu79ypp4u7y98glmdpzwk0u3sc7saazy" + "1678877386" = "P-kopernikus1k4przmfu79ypp4u7y98glmdpzwk0u3sc7saazy1678877386"
```

**Sonuç Türleri**

| Adı            | Açıklama                                               |
| :--------------| :----------------------------------------------------- |
| `id`           | İşlemin Signavault'taki kimliği                        |
| `unsignedTx`   | Bekleyen imzalanmamış işlem                             |
| `alias`        | Çok İmzalı Takma İsim                                  |
| `threshold`    | Eşik                                                    |
| `transactionId`| İşlem Kimliği                                          |
| `owners`       | Adres ve imzadan oluşan sahipler dizisi               |
| `outputOwners` | `outputOwners` nesnesinin hex kodlu temsili            |
| `metadata`     | Metadata                                              |

**Örnek Çağrı**

```text
curl http://localhost:8080/v1/multisig/P-kopernikus1k4przmfu79ypp4u7y98glmdpzwk0u3sc7saazy?signature=0x0a37aad4c335126640cc45b90943bcd39d0a17e0f06679dfd02b31fc0b09317c35f6e0cd6f9851966f73eccfaca6558824145cfb52bfffb68e562344c3a7db3d0040efa909&timestamp=1678877386
```

**Örnek Yanıt**

```json
[
  {
    "id": 25,
    "unsignedTx": "00000000200400003039010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4a36162",
    "alias": "P-kopernikus1k4przmfu79ypp4u7y98glmdpzwk0u3sc7saazy",
    "threshold": 2,
    "transactionId": "",
    "owners": [
      {
        "address": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68",
        "signature": "0x83a657db18ff50438d418db9bde239a47bca2d910114aa0cc68ac736053c96c46b300f2c28d0ff6c8587ae916b66b5d575a731d8ecc37abee3c96bdc23dcd88b007c40d266"
      },
      {
        "address": "P-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3",
        "signature": ""
      }
    ],
    "outputOwners": "5b3e388c6da941fe35428251f2b6f3a8ba72f84b88b980126882ff11f083be85",
    "metadata": "602dac34ce89aec2ae19fa1a025ee6d8"
  }
]
```

### Çok İmzalı İşlemi İmzala

Bu uç nokta, `:id` ile tanımlanan mevcut bir çok imzalı işleme yeni bir imza ekleyecektir.

**Parametreler**

| Adı        | Tür      | Açıklama                                                                                           | Varsayılan |
| :----------| :------- | :-------------------------------------------------------------------------------------------------- | :--------- |
| `id`       | `id`     | İşlemin Signavault'taki kimliği                                                                     | Yok       |
| `signature` | `string` | İmza yükü, imzalanmamış işlemi ve sahibinin özel anahtarı ile imzalanmıştır.                     | Yok       |

**Sonuç Türleri**

| Adı            | Açıklama                                               |
| :--------------| :----------------------------------------------------- |
| `id`           | İşlemin Signavault'taki kimliği                        |
| `unsignedTx`   | Bekleyen imzalanmamış işlem                             |
| `alias`        | Çok İmzalı Takma İsim                                  |
| `threshold`    | Eşik                                                    |
| `transactionId`| İşlem Kimliği                                          |
| `owners`       | Adres ve imzadan oluşan sahipler dizisi               |
| `outputOwners` | `outputOwners` nesnesinin hex kodlu temsili            |
| `metadata`     | Metadata                                              |

**Örnek Çağrı**

```sh
curl -X PUT --data '{
    "signature": "0x26f7774da6795a209beec22d85c4d02f5b69a3058cb2ceac056b91ec0c63ed3a5fca5e0d82ce5dab3a2ab734a043d4073badd27cd13d1d81110cd213ada4d0e401491f1648"
}' -H 'content-type:application/json;' http://localhost:8080/v1/multisig/19
```

**Örnek Yanıt**

```json
{
  "id": 19,
  "unsignedTx": "0x00000000200400003039010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4a36162",
  "alias": "P-kopernikus1k4przmfu79ypp4u7y98glmdpzwk0u3sc7saazy",
  "threshold": 2,
  "transactionId": "",
  "owners": [
    {
      "address": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68",
      "signature": "0x83a657db18ff50438d418db9bde239a47bca2d910114aa0cc68ac736053c96c46b300f2c28d0ff6c8587ae916b66b5d575a731d8ecc37abee3c96bdc23dcd88b007c40d266"
    },
    {
      "address": "P-kopernikus1lnk637g0edwnqc2tn8tel39652fswa3x3cfu56",
      "signature": "0x26f7774da6795a209beec22d85c4d02f5b69a3058cb2ceac056b91ec0c63ed3a5fca5e0d82ce5dab3a2ab734a043d4073badd27cd13d1d81110cd213ada4d0e401491f1648"
    }
  ],
  "outputOwners": "5b3e388c6da941fe35428251f2b6f3a8ba72f84b88b980126882ff11f083be85",
  "metadata": "602dac34ce89aec2ae19fa1a025ee6d8"
}
```

### Çok İmzalı İşlemi Yayınla

Bu uç nokta, cüzdan ile node arasında bir proxy olarak kullanılır. Cüzdan, tam imzalı işlem baytlarını gönderir ve SignaVault bunu node'a iletir. İşlem başarıyla yürütülürse, SignaVault ayrıca oluşturulan txID ile ilgili veritabanı kaydını güncelleyecek ve cüzdanı da bilgilendirecektir. İşlem başarısız olursa, SignaVault hatayı cüzdana geri döndürecektir.

**Parametreler**

| Adı        | Tür      | Açıklama                                                                                           | Varsayılan |
| :----------| :------- | :-------------------------------------------------------------------------------------------------- | :--------- |
| `signedTx` | `tx`     | Hex kodlu olarak kodlanmış komple signedTx nesnesi.                                                | Yok       |
| `signature` | `string` | İmza yükü, imzalanmamış işlemi ve sahibinin özel anahtarı ile imzalanmıştır.                     | Yok       |

**Sonuç Türleri**

| Adı    | Açıklama                     |
| :------| :--------------------------- |
| `txID` | İşlem Kimliği               |

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "signedTx": "0x00000000200400003039010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4a36162",
    "signature": "0x26f7774da6795a209beec22d85c4d02f5b69a3058cb2ceac056b91ec0c63ed3a5fca5e0d82ce5dab3a2ab734a043d4073badd27cd13d1d81110cd213ada4d0e401491f1648"
}' -H 'content-type:application/json;' http://localhost:8080/v1/multisig/issue
```

**Örnek Yanıt**

```json
{
  "txID": "2wKRJ8XKh8h7g2BKaDPXGjBwDJ3fMCuXrdCaeUgqpisJMwAui8"
}