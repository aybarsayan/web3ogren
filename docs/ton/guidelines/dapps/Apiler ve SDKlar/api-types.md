# API Türleri

**Yüksek erişilebilirlikteki blok zinciri API'leri, TON üzerinde kullanışlı uygulamaların güvenli, pratik ve hızlı bir şekilde geliştirilmesinin temel unsurudur.**

- `TON HTTP API` — _indekslenmiş blok zinciri bilgileri_ ile çalışmaya olanak tanıyan bir API.
- `TON ADNL API` — ADNL protokolüne dayanan, TON ile iletişim kurmak için güvenli bir API.

## Toncenter API'leri

- [TON Index](https://toncenter.com/api/v3/) - TON Index, bir tam düğümden PostgreSQL veritabanına veri toplar ve indekslenmiş blok zinciri için pratik bir API sağlar.
- [toncenter/v2](https://toncenter.com/) - Bu API, hesaplar ve cüzdan bilgilerinin alınması, blok ve işlemlerin sorgulanması, blok zincirine mesaj göndermesi, akıllı sözleşmelerin get metotlarını çağırması ve daha fazlası için HTTP erişimi sağlıyor.

## Üçüncü Taraf API'leri

- [tonapi.io](https://docs.tonconsole.com/tonapi) - Hesaplar, işlemler, bloklar, NFT, Müzayedeler, Jettonlar, TON DNS, Abonelikler hakkında temel verileri sağlayan hızlı indekslenmiş bir API. Ayrıca işlem zincirleri hakkında açıklamalı veriler sunar.
- [TONX API](https://docs.tonxapi.com/) - Kesintisiz Dapp geliştirme için özel olarak tasarlanmış bir API, çeşitli araçlara ve verilere kolay erişim sağlar.
- [dton.io](https://dton.io/graphql/) - Hesaplar, işlemler ve bloklar hakkında veri sağlayabilen GraphQL API'si, ayrıca NFT, Müzayedeler, Jettonlar ve TON DNS'ye ilişkin uygulama spesifik veriler.
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) - CDN'de agresif önbellekleme yoluyla hız odaklı başka bir lite-api.
- [docs.nftscan.com](https://docs.nftscan.com/reference/ton/model/asset-model) - TON blok zinciri için NFT API'leri.
- [everspace.center](https://everspace.center/toncoin) - TON Blok Zinciri'ne erişim sağlamak için Basit RPC API.

## Ek API'ler

### Toncoin oran API'leri

* https://docs.tonconsole.com/tonapi/rest-api/rates
* https://coinmarketcap.com/api/documentation/v1/ 
* https://apiguide.coingecko.com/getting-started

### Adres Dönüştürme API'leri

:::info
Adresin yerel algoritma ile dönüştürülmesi tercih edilir. Buna dair daha fazla bilgi için belgelerin `Adresler` bölümünü okuyun.
:::

#### Kullanıcı Dostu Formdan Ham Forma


API Detayları

```
/api/v2/unpackAddress
```

```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/unpackAddress?address=EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB' \
-H 'accept: application/json'
```

Yanıt gövdesi:
```json
{
"ok": true,
"result": "0:29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563"
}
```


#### Kullanıcı Dostu Formdan Ham Forma


API Detayları

```
/api/v2/packAddress
```

```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/packAddress?address=0%3A29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563' \
-H 'accept: application/json'
```

Yanıt gövdesi:
```json
{
  "ok": true,
  "result": "EQApAj3rEnJJSxEjEHVKrH3QZgto/MQMOmk8l72azaXlY1zB"
}
```


## Ayrıntılı Bilgi

:::note
Aşağıdaki bağlantılar, API'ler hakkında daha fazla bilgi edinmenize yardımcı olacaktır:
:::

* `TON HTTP API`
* `SDK'lerin Listesi`
* `TON Cookbook`