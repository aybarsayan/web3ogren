---
sidebar_position: 2
---

# Platform Chain (P-Chain) API

Bu API, Camino'nun doğrulayıcı setini sürdüren ve blok zinciri oluşturan P-Chain ile etkileşimde bulunmanızı sağlar.

## Uç Nokta

```
/ext/P
```

## Format

Bu API, `json 2.0` RPC formatını kullanır.

## Yöntemler

### platform&#46;addDelegator

Bir delegatörü Ana Ağa ekleyin.

Bir delegatör, CAM stake eder ve kendi adına doğrulama yapacak bir doğrulayıcı (delegat) belirler. Delegat, kendisine tahsis edilen stake ile doğru orantılı olarak diğer doğrulayıcılar tarafından örnekleme olasılığını artırır (ağırlık).

Delegat, delegatörün doğrulama ödülünden (varsa) bir yüzde alır. Stake delegasyonu yapan bir işlem için herhangi bir ücret yoktur.

Delegasyon süresi, delegatın Ana Ağı doğruladığı sürenin bir alt kümesi olmalıdır.

Bir düğümü delegatör olarak eklemek için işlemi gerçekleştirdiğinizde, parametrelerin değiştirilmesi mümkün değildir. **Stake’i erken kaldıramaz veya stake miktarını, düğüm kimliğini ya da ödül adresini değiştiremezsiniz.** Doğru değerlerin kullanıldığından emin olun.

**İmza**

```sh
platform.addDelegator(
    {
        nodeID: string,
        startTime: int,
        endTime: int,
        stakeAmount: int,
        rewardAddress: string,
        from: []string, //opsiyonel
        changeAddr: string, //opsiyonel
        username: string,
        password: string
    }
) ->
{
    txID: string,
    changeAddr: string
}
```

- `nodeID`, delegasyona gidecek düğümün kimliğidir.
- `startTime`, delegatörün delegasyona başladığı Unix zamanıdır.
- `endTime`, delegatörün delegasyonu durdurduğu Unix zamanıdır (ve stake edilmiş CAM geri döner).
- `stakeAmount`, delegatörün stake ettiği nCAM miktarıdır.
- `rewardAddress`, doğrulayıcı ödülünün gideceği adrestir, eğer varsa.
- `from`, bu işlem için kullanmak istediğiniz adreslerdir. İstenirse, ihtiyaç duyulması halinde herhangi bir adresinizi kullanır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adrestir. İstenirse, değişiklik kullanıcının kontrol ettiği adreslerden birine gönderilir.
- `username`, işlem ücretini ödeyen kullanıcıdır.
- `password`, `username`'in parolasıdır.
- `txID`, işlem kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.addDelegator",
    "params": {
        "nodeID":"NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "rewardAddress":"P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy",
        "startTime":1594102400,
        "endTime":1604102400,
        "stakeAmount":100000,
        "from": ["P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
        "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "6pB3MtHUNogeHapZqMUBmx6N38ii3LzytVDrXuMovwKQFTZLs",
    "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u"
  },
  "id": 1
}
```

### platform&#46;addValidator

Ana Ağa bir doğrulayıcı ekleyin. Bunu yapmak için CAM stake etmeniz gerekmektedir. Düğüm, yeterince doğru ve yanıt verici olduğu sürece, stake süresi sona erdiğinde bir ödül alırsınız. Doğrulayıcıların, uzlaşma sırasında diğer doğrulayıcılar tarafından örnekleme olasılığı, stake edilen CAM miktarına orantılıdır.

Doğrulayıcı delegatlerden bir ücret alır; önceden belirtilen yüzdeliği alır. Minimum delegasyon ücreti %2'dir. Bir doğrulayıcı ekleyen bir işlem için herhangi bir ücret yoktur.

Doğrulama süresi en az 2 hafta, en fazla 1 yıl olmalıdır.

Doğrulayıcılara belirlenmiş bir maksimum toplam ağırlık yükümlülüğü vardır. Bu, hiçbir doğrulayıcının kendisine daha fazla CAM stake edilemeyeceği anlamına gelir. Bu değer başlangıçta `min(5 * stake edilen miktar, 3M CAM)` olarak ayarlanacaktır. Bir doğrulayıcı üzerindeki toplam değer 3 milyon CAM'dır.

Bir düğümü doğrulayıcı olarak eklemek için işlemi gerçekleştirdiğinizde, parametrelerin değiştirilmesi mümkün değildir. **Stake’i erken kaldıramaz veya stake miktarını, düğüm kimliğini ya da ödül adresini değiştiremezsiniz.** Doğru değerlerin kullanıldığından emin olun. Eğer emin değilseniz, yardım almak için  ulaşabilirsiniz.

**İmza**

```sh
platform.addValidator(
    {
        nodeID: string,
        startTime: int,
        endTime: int,
        stakeAmount: int,
        rewardAddress: string,
        delegationFeeRate: float,
        from: []string, //opsiyonel
        changeAddr: string, //opsiyonel
        username: string,
        password: string
    }
) ->
{
    txID: string,
    changeAddr: string
}
```

- `nodeID`, eklenen doğrulayıcının düğüm kimliğidir.
- `startTime`, doğrulayıcının Ana Ağı doğrulamaya başladığı Unix zamanıdır.
- `endTime`, doğrulayıcının Ana Ağı doğrulamayı durdurduğu Unix zamanıdır (ve stake edilmiş CAM geri döner).
- `stakeAmount`, doğrulayıcının stake ettiği nCAM miktarıdır.
- `rewardAddress`, doğrulayıcı ödülünün gideceği adrestir, eğer varsa.
- `delegationFeeRate`, diğerlerinin kendisine stake delegasyonu yaparken bu doğrulayıcının alacağı yüzde ücrettir. 4 ondalık basamağa kadar izin verilir; ek ondalık basamaklar göz ardı edilir. 0 ile 100 arasında olmalıdır. Örneğin, `delegationFeeRate` `1.2345` ise ve biri bu doğrulayıcıya delegasyonda bulunursa, delegasyon süresi sona erdiğinde ödülün %1.2345'i doğrulayıcıya ve kalanı delegatöre gider.
- `from`, bu işlem için kullanmak istediğiniz adreslerdir. İstenirse, ihtiyaç duyulması halinde herhangi bir adresinizi kullanır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adrestir. İstenirse, değişiklik kullanıcının kontrol ettiği adreslerden birine gönderilir.
- `username`, işlem ücretini ödeyen kullanıcıdır.
- `password`, `username`'in parolasıdır.
- `txID`, işlem kimliğidir.

:::info Stake Miktarı Sabittir
Lütfen Camino’da doğrulayıcılar için sabit `stakeAmount` olduğunu unutmayın.
**testnet**: `2000000000000` nCAM (2000 CAM)
**mainnet**: `100000000000000` nCAM (100k CAM)
:::

:::caution DÜĞÜMÜNÜZÜ KAYIT ETTİRMENİZ GEREKİYOR
`platform.addValidator` yöntemi, düğümünüzü cüzdan adresinizle kaydettirmediyseniz başarısız olacaktır. Lütfen  konusunu inceleyin.
:::

**Örnek Çağrı**

Bu örnekte, Unix zamanlarını 10 dakika ve 2 gün sonrasını hesaplamak için `date` komutunu kullanıyoruz. (Not: Eğer bir Mac'te iseniz, `$(date`'i `$(gdate` ile değiştirin. Eğer `gdate` yüklü değilse, `brew install coreutils` komutunu çalıştırın.)

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.addValidator",
    "params": {
        "nodeID":"NodeID-ARCLrphAHZ28xZEBfUL7SVAmzkTZNe1LK",
        "rewardAddress":"P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy",
        "from": ["P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
        "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "startTime":'$(date --date="10 minutes" +%s)',
        "endTime":'$(date --date="2 days" +%s)',
        "stakeAmount":1000000,
        "delegationFeeRate":10,
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "6pb3mthunogehapzqmubmx6n38ii3lzytvdrxumovwkqftzls",
    "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u"
  },
  "id": 1
}
```

### platform&#46;addSubnetValidator

Bir subnet'e, Ana Ağ dışında bir doğrulayıcı ekleyin. Doğrulayıcı, bu subnet'i doğruladığı süre boyunca Ana Ağı doğrulamalıdır.

**İmza**

```sh
platform.addSubnetValidator(
    {
        nodeID: string,
        subnetID: string,
        startTime: int,
        endTime: int,
        weight: int,
        from: []string, //opsiyonel
        changeAddr: string, //opsiyonel
        username: string,
        password: string
    }
) ->
{
    txID: string,
    changeAddr: string,
}
```

- `nodeID`, doğrulayıcının düğüm kimliğidir.
- `subnetID`, doğrulamanın yapılacağı subnet'tir.
- `startTime`, doğrulayıcının subnet'i doğrulamaya başladığı Unix zamanıdır.
- `endTime`, doğrulayıcının subnet'i doğrulamayı durdurduğu Unix zamanıdır.
- `weight`, örnekleme için kullanılan doğrulayıcının ağırlığıdır.
- `from`, bu işlem için kullanmak istediğiniz adreslerdir. İstenirse, ihtiyaç duyulması halinde herhangi bir adresinizi kullanır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adrestir. İstenirse, değişiklik kullanıcının kontrol ettiği adreslerden birine gönderilir.
- `username`, işlem ücretini ödeyen kullanıcıdır.
- `password`, `username`'in parolasıdır.
- `txID`, işlem kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.addSubnetvalidator",
    "params": {
        "nodeID":"NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL",
        "subnetID":"zbfoww1ffkpvrfywpj1cvqrfnyesepdfc61hmu2n9jnghduel",
        "startTime":1583524047,
        "endTime":1604102399,
        "weight":1,
        "from": ["P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
        "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "txID": "2exafyvRNSE5ehwjhafBVt6CTntot7DFjsZNcZ54GSxBbVLcCm",
    "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u"
  }
}
```

### platform&#46;createAddress

Verilen kullanıcı tarafından kontrol edilen yeni bir adres oluşturun.

**İmza**

```sh
platform.createAddress({
    username: string,
    password: string
}) -> {address: string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.createAddress",
    "params": {
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "address": "P-columbus12lqey27sfujqq6mc5a3jr5av56cjsu8hg2d3hx"
  },
  "id": 1
}
```

### platform&#46;createBlockchain

Yeni bir blok zinciri oluşturun. Şu anda yalnızca AVM ve Zaman Damgası VM'in yeni örneklerinin oluşturulmasını desteklemektedir.

**İmza**

```sh
platform.createBlockchain(
    {
        subnetID: string,
        vmID: string,
        name: string,
        genesisData: string,
        encoding: string, //opsiyonel
        from: []string, //opsiyonel
        changeAddr: string, //opsiyonel
        username: string,
        password: string
    }
) ->
{
    txID: string,
    changeAddr: string
}
```

- `subnetID`, yeni blok zincirini doğrulayan subnet'in kimliğidir. Subnet mevcut olmalı ve Ana Ağ olmamalıdır.
- `vmID`, blok zincirinin çalıştığı Sanal Makinenin kimliğidir. Aynı zamanda Sanal Makinenin bir takma adı da olabilir.
- `name`, yeni blok zinciri için insan tarafından okunabilir bir isimdir. Kesinlikle özgün değildir.
- `genesisData`, yeni blok zincirinin Genesis durumunun byte temsilidir; `encoding` parametresinde belirtilen formatta kodlanmıştır.
- `encoding`, `genesisData` için kullanılacak formatı tanımlar. "cb58" veya "hex" olabilir. Varsayılan olarak "cb58"dir. Sanal Makinelerin, `genesisData` oluşturmak için kullanılabilen statik bir API yöntemi bulunmalıdır.
- `from`, bu işlem için kullanmak istediğiniz adreslerdir. İstenirse, ihtiyaç duyulması halinde herhangi bir adresinizi kullanır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adrestir. İstenirse, değişiklik kullanıcının kontrol ettiği adreslerden birine gönderilir.
- `username`, işlem ücretini ödeyen kullanıcıdır. Bu kullanıcının subnet'in kontrol anahtarlarından yeterli sayıda olması gerekir.
- `password`, `username`'in parolasıdır.
- `txID`, işlem kimliğidir.

**Örnek Çağrı**

Bu örnekte, Zaman Damgası Sanal Makinesinin yeni bir örneğini oluşturuyoruz. `genesisData`, `timestamp.buildGenesis` çağrısından gelmiştir.

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.createBlockchain",
    "params" : {
        "vmID":"timestamp",
        "subnetID":"2bRCr6B4MiEfSjidDwxDpdCyviwnfUVqB2HGwhm947w9YYqb7r",
        "name":"Yeni zaman damgam",
        "genesisData": "45oj4CqFViNHUtBxJ55TZfqCAMFwMRMj2XkHVqUYjJYoTaEM",
        "encoding": "cb58",
        "from": ["P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
        "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "2TBnyFmST7TirNm6Y6z4863zusRVpWi5Cj1sKS9bXTUmu8GfeU",
    "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u"
  },
  "id": 1
}
```

### platform&#46;createSubnet

Yeni bir subnet oluşturun.

Subnet'in kimliği, bu işlemin kimliği ile aynıdır.

**İmza**

```sh
platform.createSubnet(
    {
        controlKeys: []string,
        threshold: int,
        from: []string, //opsiyonel
        changeAddr: string, //opsiyonel
        username: string,
        password: string
    }
) ->
{
    txID: string,
    changeAddr: string
}
```

- Bu subnet'e bir doğrulayıcı eklemek için, `threshold` imzası, `controlKeys`'deki adreslerden alınmalıdır.
- `from`, bu işlem için kullanmak istediğiniz adreslerdir. İstenirse, ihtiyaç duyulması halinde herhangi bir adresinizi kullanır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adrestir. İstenirse, değişiklik kullanıcının kontrol ettiği adreslerden birine gönderilir.
- `username`, işlem ücretini ödeyen kullanıcıdır.
- `password`, `username`'in parolasıdır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.createSubnet",
    "params": {
        "controlKeys":[
            "P-columbus13xqjvp8r2entvw5m29jxxjhmp3hh6lz8laep9m",
            "P-columbus165mp4efnel8rkdeqe5ztggspmw4v40j7pfjlhu"
        ],
        "threshold":2,
        "from": ["P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
        "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "hJfC5xGhtjhCGBh1JWn3vZ51KJP696TZrsbadPHNbQG2Ve5yd"
  },
  "id": 1
}
```

### platform&#46;exportAVAX

P-Chain üzerindeki bir adresten X-Chain üzerindeki bir adrese CAM gönderin. Bu işlemi gerçekleştirdikten sonra, transferi tamamlamak için X-Chain’in  yöntemini `CAM` assetID'si ile çağırmalısınız.

**İmza**

```sh
platform.exportAVAX(
    {
        amount: int,
        from: []string, //opsiyonel
        to: string,
        changeAddr: string, //opsiyonel
        username: string,
        password: string
    }
) ->
{
    txID: string,
    changeAddr: string
}
```

- `amount`, gönderilecek nCAM miktarıdır.
- `to`, CAM’ın gönderileceği X-Chain üzerindeki adrestir.
- `from`, bu işlem için kullanmak istediğiniz adreslerdir. İstenirse, ihtiyaç duyulması halinde herhangi bir adresinizi kullanır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adrestir. İstenirse, değişiklik kullanıcının kontrol ettiği adreslerden birine gönderilir.
- `username`, CAM’ı gönderen ve işlem ücretini ödeyen kullanıcıdır.
- `password`, `username`'in parolasıdır.
- `txID`, bu işlemin kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.exportAVAX",
    "params": {
        "to":"X-columbus1yv8cwj9kq3527feemtmh5gkvezna5xys08mxet",
        "amount":1,
        "from": ["P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
        "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "2Kz69TNBSeABuaVjKa6ZJCTLobbe5xo9c5eU8QwdUSvPo2dBk3",
    "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u"
  },
  "id": 1
}
```

### platform&#46;exportKey

Belirli bir adresi kontrol eden özel anahtarı alın.  
Dönen özel anahtar,  ile bir kullanıcıya eklenebilir.

**İmza**

```sh
platform.exportKey({
    username: string,
    password: string,
    address: string
}) -> {privateKey: string}
```

- `username`, `address`'e sahip olan kullanıcıdır.
- `password`, `username`'in parolasıdır.
- `privateKey`, `address`'i kontrol eden özel anahtarın string temsilidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"platform.exportKey",
    "params" :{
        "username" :"myUsername",
        "password": "myPassword",
        "address": "P-columbus1zwp96clwehpwm57r9ftzdm7rnuslrunj68ua3r"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "privateKey": "PrivateKey-Lf49kAJw3CbaL783vmbeAJvhscJqC7vi5yBYLxw2XfbzNS5RS"
  }
}
```

### platform&#46;getAddressStates

Bir adrese uygulanan durum bit maskesini alın.

**İmza**

```sh
platform.getAddressStates({
    address: string,
}) -> string
```

- `address`, durumunu almak istediğiniz adrestir.

**Olası `state` değerleri**

```sh
    AddressStateRoleAdmin    = uint8(0)
    AddressStateRoleKyc      = uint8(1)

    AddressStateKycVerified    = uint8(32)
    AddressStateKycExpired     = uint8(33)

    AddressStateConsortium      = uint8(38)
    AddressStateNodeDeferred    = uint8(39)
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
  "jsonrpc":"2.0",
  "id"     : 1,
  "method" :"platform.getAddressStates",
  "params" :{
      "address":"P-columbus1m8wnvtqvthsxxlrrsu3f43kf9wgch5tyfx4nmf"
  }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": "12345",
  "id": 1
}

### platform.getAllDepositOffers

Belirtilen Unix `timestamp` için tüm depozit tekliflerini alın. Metod, yalnızca belirtilen `timestamp`'te aktif olan depozit tekliflerini döndürmektedir.

**İmza**

```sh
platform.getAllDepositOffers({
    timestamp: int
}) ->
{
    depositOffers: []{
        ID: string,
        InterestRateNominator: int,
        Start: int,
        End: int,
        MinAmount: int,
        MinDuration: int,
        MaxDuration: int,
        UnlockPeriodDuration: int,
        NoRewardsPeriodDuration: int,
        Memo: string,
        Flags: int,
    }
}
```

- `ID`, depozit teklifinin kimliğidir.
- `InterestRateNominator`, faiz oranının nominatörüdür.
- `Start`, bu teklifin geçerli olmaya başladığı Unix zamanıdır.
- `End`, bu teklifin geçerli olmayı bıraktığı Unix zamanıdır.
- `MinAmount`, yatırılabilecek en düşük CAM miktarını göstermektedir.
- `MinDuration`, depozit için en düşük süreyi saniye cinsinden belirtmektedir.
- `MaxDuration`, depozit için en yüksek süreyi saniye cinsinden belirtmektedir.
- `UnlockPeriodDuration`, kaldırma süresinin süresidir (saniye cinsinden).
- `NoRewardsPeriodDuration`, ödülsüz sürenin süresidir (saniye cinsinden).
- `Memo`, depozit teklifinin açıklamasının base64 kodlu halidir.
- `Flags`, depozit teklifinin durumunu tanımlayan bir parametredir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getAllDepositOffers",
    "params": {
      "timestamp": 1696303193
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "depositOffers": [
      {
        "ID": "2GcJSMiaRACwrKDYV8Sa17AoFce8k4WHHXFyZL5eFH2CtZBAKy",
        "InterestRateNominator": 210000,
        "Start": 1676374487,
        "End": 1739450087,
        "MinAmount": 1,
        "MinDuration": 86400,
        "MaxDuration": 31536000,
        "UnlockPeriodDuration": 43200,
        "NoRewardsPeriodDuration": 43200,
        "Memo": "MHg2NDY1NzA2ZjczNjk3NDRmNjY2NjY1NzIyMDc0NjU3Mzc0MjMzMjIwMmQyMDcwNjk2MzZiNjE2MjZjNjUyMDYxNjY3NDY1NzIyMDZlNjU3NDc3NmY3MjZiMjA2MzcyNjU2MTc0Njk2ZjZlMjA2MTZlNjQyMDZlNmY3NDIwNjk2ZTIwNjc2NTZlNjU3MzY5NzMyMDYxNzMyMDY0NzU3MjYxNzQ2OTZmNmUyMDY5NzMyMDZlNmY3NDIwNjM2ODZmNmY3MzYxNjI2YzY1MjA3MDY1NzIyMDYxNmM2YzZmNjM2MTc0Njk2ZjZlMjEyOGZiMzE0ZQ==",
        "Flags": 0
      },
      {
        "ID": "2t8eBizuEpdGfXbuQxw57PHmtBpmkZeLtzDJ3q5tmju6HhDDaG",
        "InterestRateNominator": 110000,
        "Start": 1676374487,
        "End": 1739450087,
        "MinAmount": 1,
        "MinDuration": 60,
        "MaxDuration": 31536000,
        "UnlockPeriodDuration": 0,
        "NoRewardsPeriodDuration": 0,
        "Memo": "MHg2NDY1NzA2ZjczNjk3NDRmNjY2NjY1NzIyMDc0NjU3Mzc0MjMzMTIwMmQyMDcwNjk2MzZiNjE2MjZjNjUyMDYxNjY3NDY1NzIyMDZlNjU3NDc3NmY3MjZiMjA2MzcyNjU2MTc0Njk2ZjZlMjA2MTZlNjQyMDZlNmY3NDIwNjk2ZTIwNjc2NTZlNjU3MzY5NzMyMDYxNzMyMDY0NzU3MjYxNzQ2OTZmNmUyMDY5NzMyMDZlNmY3NDIwNjM2ODZmNmY3MzYxNjI2YzY1MjA3MDY1NzIyMDYxNmM2YzZmNjM2MTc0Njk2ZjZlMjEyOGZiMzE0ZQ==",
        "Flags": 0
      }
    ]
  },
  "id": 1
}
```

### platform.getBalance

Verilen adresler tarafından kontrol edilen CAM bakiyesini alın.

**İmza**

```sh
platform.getBalance({
    addresses: string[]
}) -> {
    balances: {id: string},
    unlockedOutputs: {id: string},
    bondedOutputs: {id: string},
    depositedOutputs: {id: string},
    bondedDepositedOutputs: {id: string},
    utxoIDs: []{
        txID: string,
        outputIndex: int
    }
}
```

- `addresses`, bakiyesini almak istediğiniz adreslerin listesidir.
- `balances`, toplam bakiyeyi, nCAM cinsinden gösterir. Yanıt, `{ assetID: balance }` şeklinde bir haritadır. Daha fazla bilgi için  bölümüne bakın.
- `unlockedOutputs`, açık bakiyeyi, nCAM cinsinden belirtmektedir.
- `bondedOutputs`, bağlanmış bakiyeyi, nCAM cinsinden belirtmektedir.
- `depositedOutputs`, yatırılan bakiyeyi, nCAM cinsinden belirtmektedir.
- `bondedDepositedOutputs`, bağlı ve yatırılan bakiyeyi, nCAM cinsinden belirtmektedir.
- `utxoIDs`, `address`'ı referans alan UTXO'ların kimlikleridir.

:::info DEPOZİTLER VE BAĞLAR

Depozitler ve bağlar hakkında daha fazla bilgi almak için  sayfasını ziyaret edin.

:::

**Örnek Çağrı**

```sh
curl -X POST --data '{
  "jsonrpc":"2.0",
  "id": 1,
  "method": "platform.getBalance",
  "params": {
      "addresses":["P-columbus1m8wnvtqvthsxxlrrsu3f43kf9wgch5tyfx4nmf"]
  }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "balances": {
      "2qD5UA8E5a3rCyVGrxWHp4pwP14d8WicgCfM9KzdyWQ6AyK3w8": "104901417112028"
    },
    "unlockedOutputs": {
      "2qD5UA8E5a3rCyVGrxWHp4pwP14d8WicgCfM9KzdyWQ6AyK3w8": "4901417112028"
    },
    "bondedOutputs": {},
    "depositedOutputs": {},
    "bondedDepositedOutputs": {
      "2qD5UA8E5a3rCyVGrxWHp4pwP14d8WicgCfM9KzdyWQ6AyK3w8": "100000000000000"
    },
    "utxoIDs": [
      {
        "txID": "22cFMeT6vJKEw4CADLGMFeHMyogn7TSE44ZtZjGNFi7W6m2GyV",
        "outputIndex": 0
      },
      {
        "txID": "k91svvCsKQHQbuezUqiWtBT3PkGwtinrM4biuAv5CbfT7BjUG",
        "outputIndex": 0
      }
    ]
  },
  "id": 1
}
```

### platform.getBlock

Bir bloğu kimliğine göre alın.

**İmza**

```sh
platform.getBlock({
    blockID: string,
    encoding: string // opsiyonel
}) -> {
    block: string,
    encoding: string
}
```

**Talep**

- `blockID`, bloğun kimliğidir. cb58 formatında olmalıdır.
- `encoding`, kullanılacak kodlama formatıdır. `cb58`, `hex` veya `json` olabilir. Varsayılan `cb58`dir.

**Yanıt**

- `block`, işlem `encoding`e kodlanmış halidir.
- `encoding`, kullanılan `encoding`dir.

#### CB58 Örneği

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getBlock",
    "params": {
        "blockID": "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
        "encoding": "cb58"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "block": "11111BwoDGdFYQfsbfJ35VKjMP6z5dtggBJqFay7KN33GdqpU8ZFAvaSVegwfADYFipsCpTft27TA8h99krBjsMvFZ5TgFYrQCNN2DkyXQSVuGadYh8UhZ6Ptp3HwVYvXWHaDwjt3mEs9fkoS5JiTDfrrp3w6ws2LTksv3LGtb66iWjWgnHU46WgY2wVqnwrit2x7mYGTgJpXeziLCY66Hnnu1jAy5hYhK2Ek37XhvBcd1UeTcPAFsEtFdLr8Ku19K2dYYNvvuz7YnJjuqxUjtNoC61UcKrtTyJCqRuyA85NRFD7ZYVKwSd13CevyZWuBiBWZkukUpLhJwTcWnFnzbntKDCMdip4kAtQueDkjYnrXu2AWS3SXiJTSmZm55iwn4iE9sqBs6Rj1CnrakGi7sCcXg1UyYu5scmb5RVDKDtZPNLr5Vb6oTWaM4egHfwgT98koZ28rSw8otJfv4q1BH9vrS4N7pUJxh9grnksG9TQDtjBjD9tmhxC8iSLYTwGNxitAqjZd7SGE9",
    "encoding": "cb58"
  },
  "id": 1
}
```

#### Hex Örneği

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getBlock",
    "params": {
        "blockID": "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
        "encoding": "hex"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "block": "0x00000000000309473dc99a0851a29174d84e522da8ccb1a56ac23f7b0ba79f80acce34cf576900000000000f4241000000010000001200000001000000000000000000000000000000000000000000000000000000000000000000000000000000011c4c57e1bcb3c567f9f03caa75563502d1a21393173c06d9d79ea247b20e24800000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000338e0465f0000000100000000000000000427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd6520000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000338d1041f0000000000000000000000010000000195a4467dd8f939554ea4e6501c08294386938cbf000000010000000900000001c79711c4b48dcde205b63603efef7c61773a0eb47efb503fcebe40d21962b7c25ebd734057400a12cce9cf99aceec8462923d5d91fffe1cb908372281ed738580119286dde",
    "encoding": "hex"
  },
  "id": 1
}
```

#### JSON Örneği

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getBlock",
    "params": {
        "blockID": "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
        "encoding": "json"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "block": {
      "parentID": "5615di9ytxujackzaXNrVuWQy5y8Yrt8chPCscMr5Ku9YxJ1S",
      "height": 1000001,
      "txs": [
        {
          "unsignedTx": {
            "inputs": {
              "networkID": 1,
              "blockchainID": "11111111111111111111111111111111LpoYY",
              "outputs": [],
              "inputs": [
                {
                  "txID": "DTqiagiMFdqbNQ62V2Gt1GddTVLkKUk2caGr4pyza9hTtsfta",
                  "outputIndex": 0,
                  "assetID": "o8seyjX6WupqJ1CE8CeaozK13kqVgc4DFvdvc4crfacLFBauW",
                  "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
                  "input": {
                    "amount": 13839124063,
                    "signatureIndices": [0]
                  }
                }
              ],
              "memo": "0x"
            },
            "destinationChain": "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5",
            "exportedOutputs": [
              {
                "assetID": "o8seyjX6WupqJ1CE8CeaozK13kqVgc4DFvdvc4crfacLFBauW",
                "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
                "output": {
                  "addresses": [
                    "P-columbus1jkjyvlwclyu42n4yuegpczpfgwrf8r9lyj0d3c"
                  ],
                  "amount": 13838124063,
                  "locktime": 0,
                  "threshold": 1
                }
              }
            ]
          },
          "credentials": [
            {
              "signatures": [
                "0xc79711c4b48dcde205b63603efef7c61773a0eb47efb503fcebe40d21962b7c25ebd734057400a12cce9cf99aceec8462923d5d91fffe1cb908372281ed7385801"
              ]
            }
          ]
        }
      ]
    },
    "encoding": "json"
  },
  "id": 1
}
```

### platform.getBlockchains

Mevcut olan tüm blok zincirlerini alın (P-Chain hariç).

**İmza**

```sh
platform.getBlockchains() ->
{
    blockchains: []{
        id: string,
        name: string,
        subnetID: string,
        vmID: string
    }
}
```

- `blockchains`, Camino ağında mevcut olan tüm blok zincirleridir.
- `name`, bu blok zincirinin insan tarafından okunabilir adıdır.
- `id`, blok zincirinin kimliğidir.
- `subnetID`, bu blok zincirini doğrulayan alt ağın kimliğidir.
- `vmID`, bu blok zincirinin çalıştığı Sanal Makine kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getBlockchains",
    "params": {},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockchains": [
      {
        "id": "28Pp3JZJBABUmFQcC9ZXPjuDS6WVX8LeQP9y3DvpCXGiNiTQFV",
        "name": "X-Chain",
        "subnetID": "11111111111111111111111111111111LpoYY",
        "vmID": "jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq"
      },
      {
        "id": "fnVV12Px5y6FGM5Ua8moqmTPCQT2im18SZEW2xgMDGurimFZg",
        "name": "C-Chain",
        "subnetID": "11111111111111111111111111111111LpoYY",
        "vmID": "mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6"
      },
      {
        "id": "2SMYrx4Dj6QqCEA3WjnUTYEFSnpqVTwyV3GPNgQqQZbBbFgoJX",
        "name": "Timestamp VM",
        "subnetID": "11111111111111111111111111111111LpoYY",
        "vmID": "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH"
      }
    ]
  },
  "id": 1
}
```

### platform.getBlockchainStatus

Bir blok zincirinin durumunu alın.

**İmza**

```sh
platform.getBlockchainStatus(
    {
        blockchainID: string
    }
) -> {status: string}
```

`status` aşağıdaki değerlerden biri olabilir:

- `Validating`: Blok zinciri bu düğüm tarafından doğrulanmaktadır.
- `Created`: Blok zinciri mevcut ancak bu düğüm tarafından doğrulanmamaktadır.
- `Preferred`: Blok zincirinin oluşturulması önerilmiştir ve muhtemelen oluşturulacaktır, ancak işlem henüz kabul edilmemiştir.
- `Syncing`: Bu düğüm, bu blok zincirinde doğrulamayan bir düğüm olarak katılmaktadır.
- `Unknown`: Blok zinciri ya önerilmemiştir ya da oluşturulması önerisi tercih edilmemektedir. Öneri tekrar gönderilebilir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getBlockchainStatus",
    "params": {
        "blockchainID": "fnVV12Px5y6FGM5Ua8moqmTPCQT2im18SZEW2xgMDGurimFZg"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "Created"
  },
  "id": 1
}
```

### platform.getConfiguration

platformVM yapılandırmasını döndürür.

**İmza**

```sh
platform.getConfiguration() -> {
    networkID: int,
    assetID: string,
    assetSymbol: string,
    hrp: string,
    blockchains: [
      {
        id: string,
        name: string,
        subnetID: string,
        vmID: string
      },
      ...
    ],
    minStakeDuration: int,
    maxStakeDuration: int,
    minValidatorStake: int,
    maxValidatorStake: int,
    minDelegationFee: int,
    minDelegatorStake: int,
    minConsumptionRate: int,
    maxConsumptionRate: int,
    supplyCap: int,
    codecVersion: int,
    verifyNodeSignature: bool,
    lockModeBondDeposit: bool
}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id": 1,
    "method": "platform.getConfiguration"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "networkID": "1002",
    "assetID": "iTV3Gh5EY2aUqt6JyhKkHSH4thSsUUhGC8GhxwDrTxgmREpr1",
    "assetSymbol": "CAM",
    "hrp": "kopernikus",
    "blockchains": [
      {
        "id": "2emXuWNR9Gn9Hbe5k3iwyBax8sQhGHv2BJwhDJwMrvXYAotBeL",
        "name": "C-Chain",
        "subnetID": "11111111111111111111111111111111LpoYY",
        "vmID": "mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6"
      },
      {
        "id": "2o3ApqF7hQCjBofo8hD8i8GLHhAkMv96Hu7kjd5NqsScraoZ1x",
        "name": "X-Chain",
        "subnetID": "11111111111111111111111111111111LpoYY",
        "vmID": "jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq"
      }
    ],
    "minStakeDuration": "86400000000000",
    "maxStakeDuration": "31536000000000000",
    "minValidatorStake": "2000000000000",
    "maxValidatorStake": "2000000000000",
    "minDelegationFee": "0",
    "minDelegatorStake": "0",
    "minConsumptionRate": "0",
    "maxConsumptionRate": "0",
    "supplyCap": "1000000000000000000",
    "codecVersion": "0",
    "verifyNodeSignature": true,
    "lockModeBondDeposit": true
  },
  "id": 1
}
```

### platform.getCurrentSupply

Mevcut CAM miktarı için bir üst sınır döndürür. Bu, yanma işlemlerini (işlem ücretleri dahil) dikkate almadığı için bir üst sınırdır.

**İmza**

```sh
platform.getCurrentSupply() -> {supply: int}
```

- `supply`, mevcut olan CAM miktarı için bir üst sınırdır; nCAM cinsindendir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getCurrentSupply",
    "params": {},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "supply": "365865167637779183"
  },
  "id": 1
}
```

Bu örnekteki yanıt, CAM'ın arzının en fazla 365.865 milyon olduğunu belirtmektedir.

### platform.getCurrentValidators

Verilen Alt Ağın mevcut doğrulayıcılarını listeleyin.

Üst seviye `delegators` alanı v1.0.1 itibarıyla kullanımdan kaldırıldı ve v1.0.6'da kaldırıldı. Bunun yerine, her `validators` elemanı artık o doğrulayıcı için delegatörler listesini içermektedir.

**İmza**

```sh
platform.getCurrentValidators({
    subnetID: string, //isteğe bağlı
    nodeIDs: string[], //isteğe bağlı
}) -> {
    validators: []{
        txID: string,
        startTime: string,
        endTime: string,
        stakeAmount: string, //isteğe bağlı
        nodeID: string,
        weight: string, //isteğe bağlı
        rewardOwner: {
            locktime: string,
            threshold: string,
            addresses: string[]
        },
        potentialReward: string,
        delegationFee: string,
        uptime: string,
        connected: bool,
        delegators: []{
            txID: string,
            startTime: string,
            endTime: string,
            stakeAmount: string, //isteğe bağlı
            nodeID: string,
            rewardOwner: {
                locktime: string,
                threshold: string,
                addresses: string[]
            },
            potentialReward: string,
        }
    }
}
```

- `subnetID`, mevcut doğrulayıcıların döndürüleceği alt ağdır. Atlandığında, Ana Ağın mevcut doğrulayıcıları döndürülür.
- `nodeIDs`, istenen mevcut doğrulayıcıların nodeID'lerinin bir listesidir. Atlandığında, tüm mevcut doğrulayıcılar döndürülür. Belirtilen bir nodeID mevcut doğrulayıcılar setinde yoksa, cevapta yer almaz.
- `validators`:
  - `txID`, doğrulayıcı işlemidir.
  - `startTime`, doğrulayıcının Alt Ağı doğrulamaya başladığı Unix zamanıdır.
  - `endTime`, doğrulayıcının Alt Ağı doğrulamayı durdurduğu Unix zamanıdır.
  - `stakeAmount`, bu doğrulayıcının stake ettiği nCAM miktarıdır. `subnetID` Ana Ağ değilse atlanır.
  - `nodeID`, doğrulayıcının node ID'sidir.
  - `weight`, doğrulayıcıları örneklerken doğrulayıcının ağırlığıdır. `subnetID` Ana Ağ değilse atlanır.
  - `rewardOwner`, `locktime`, `threshold` ve `addresses` dizisini içeren bir `OutputOwners` çıktısıdır.
  - `potentialReward`, stake ederek kazanılan potansiyel ödüldür.
  - `delegationFeeRate`, diğerlerinin stake'lerini kendisine devretmesi durumunda bu doğrulayıcının talep ettiği yüzdelik ücrettir.
  - `uptime`, sorgulanan node'un peeri çevrimiçi olarak raporladığı zamanın yüzdesidir.
  - `connected`, node'un ağa bağlı olup olmadığını belirtir.
  - `delegators`, bu doğrulayıcıya delegatörler listesi:
    - `txID`, delegatör işlemidir.
    - `startTime`, delegatörün başladığı Unix zamanıdır.
    - `endTime`, delegatörün durdurduğu Unix zamanıdır.
    - `stakeAmount`, bu delegatörün stake ettiği nCAM miktarıdır. `subnetID` Ana Ağ değilse atlanır.
    - `nodeID`, doğrulayıcı node'un node ID'sidir.
    - `rewardOwner`, `locktime`, `threshold` ve `addresses` dizisini içeren bir `OutputOwners` çıktısıdır.
    - `potentialReward`, stake ederek kazanılan potansiyel ödüldür.
- `delegators`: (**v1.0.1 itibariyle kullanım dışı. Yöntem belgelerinin üst kısmındaki notu inceleyin.**)

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getCurrentValidators",
    "params": {},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "validators": [
      {
        "txID": "2NNkpYTGfTFLSGXJcHtVv6drwVU2cczhmjK2uhvwDyxwsjzZMm",
        "startTime": "1600368632",
        "endTime": "1602960455",
        "stakeAmount": "2000000000000",
        "nodeID": "NodeID-5mb46qkSBj81k9g9e4VFjGGSbaaSLFRzD",
        "rewardOwner": {
          "locktime": "0",
          "threshold": "1",
          "addresses": ["P-columbus18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"]
        },
        "potentialReward": "117431493426",
        "delegationFee": "10.0000",
        "uptime": "0.0000",
        "connected": false,
        "delegators": [
          {
            "txID": "Bbai8nzGVcyn2VmeYcbS74zfjJLjDacGNVuzuvAQkHn1uWfoV",
            "startTime": "1600368523",
            "endTime": "1602960342",
            "stakeAmount": "25000000000",
            "nodeID": "NodeID-5mb46qkSBj81k9g9e4VFjGGSbaaSLFRzD",
            "rewardOwner": {
              "locktime": "0",
              "threshold": "1",
              "addresses": ["P-columbus18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"]
            },
            "potentialReward": "11743144774"
          }
        ]
      }
    ]
  },
  "id": 1
}
```

### platform.getHeight

Son kabul edilen bloğun yüksekliğini döndürür.

**İmza**

```sh
platform.getHeight() ->
{
    height: int,
}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getHeight",
    "params": {},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "height": "56"
  },
  "id": 1
}
```

### platform.getMaxStakeAmount

Belirli bir zaman diliminde adlandırılan düğüm için en fazla nCAM stake miktarını döndürür.

**İmza**

```sh
platform.getMaxStakeAmount(
    {
        subnetID: string,
        nodeID: string,
        startTime: int,
        endTime: int
    }
) ->
{
    amount: uint64
}
```

- `subnetID`, alt ağı temsil eden bir Buffer veya cb58 dizesidir.
- `nodeID`, verilen süre boyunca stake miktarının gerekildiği düğümün ID'sini temsil eden bir dizedir.
- `startTime`, düğümün stake miktarının gerekli olduğu süre için başlangıç zamanını belirten büyük bir sayıdır.
- `endTime`, düğümün stake miktarının gerekli olduğu süre için bitiş zamanını belirten büyük bir sayıdır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getMaxStakeAmount",
    "params": {
        "subnetID":"11111111111111111111111111111111LpoYY",
        "nodeID":"NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL",
        "startTime": 1644240334,
        "endTime": 1644240634
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "amount": "2000000000000000"
  },
  "id": 1
}
```

### platform.getMinStake

Ana Ağı doğrulamak için gereken minimum CAM miktarını ve delege edilebilecek minimum CAM miktarını alır.

**İmza**

```sh
platform.getMinStake() ->
{
    minValidatorStake : uint64,
    minDelegatorStake : uint64
}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"platform.getMinStake"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "minValidatorStake": "2000000000000",
    "minDelegatorStake": "25000000000"
  },
  "id": 1
}
```

### platform.getPendingValidators

Belirtilen Alt Ağın bekleyen doğrulayıcı setindeki doğrulayıcıları listeleyin. Her doğrulayıcı şu anda Alt Ağı doğrulamıyor ancak gelecekte doğrulayacaktır.

**İmza**

```sh
platform.getPendingValidators({
    subnetID: string, //isteğe bağlı
    nodeIDs: string[], //isteğe bağlı
}) -> {
    validators: []{
        txID: string,
        startTime: string,
        endTime: string,
        stakeAmount: string, //isteğe bağlı
        nodeID: string,
        delegationFee: string,
        connected: bool,
        weight: string, //isteğe bağlı
    },
    delegators: []{
        txID: string,
        startTime: string,
        endTime: string,
        stakeAmount: string,
        nodeID: string
    }
}
```

- `subnetID`, mevcut doğrulayıcıların döndürüleceği alt ağdır. Atlandığında, Ana Ağın mevcut doğrulayıcıları döndürülür.
- `nodeIDs`, istenen bekleyen doğrulayıcıların nodeID'lerinin bir listesidir. Atlandığında, tüm bekleyen doğrulayıcılar döndürülür. Belirtilen bir nodeID bekleyen doğrulayıcılar setinde yoksa, cevapta yer almaz.
- `validators`:
  - `txID`, doğrulayıcı işlemidir.
  - `startTime`, doğrulayıcının Alt Ağı doğrulamaya başladığı Unix zamanıdır.
  - `endTime`, doğrulayıcının Alt Ağı doğrulamayı durdurduğu Unix zamanıdır.
  - `stakeAmount`, bu doğrulayıcının stake ettiği nCAM miktarıdır. `subnetID` Ana Ağ değilse atlanır.
  - `nodeID`, doğrulayıcının node ID'sidir.
  - `connected`, eğer node bağlıysa.
  - `weight`, doğrulayıcının ağırlığıdır. `subnetID` Ana Ağ değilse atlanır.
- `delegators`:
  - `txID`, delegatör işlemidir.
  - `startTime`, delegatörün başladığı Unix zamanıdır.
  - `endTime`, delegatörün durdurduğu Unix zamanıdır.
  - `stakeAmount`, bu delegatörün stake ettiği nCAM miktarıdır. `subnetID` Ana Ağ değilse atlanır.
  - `nodeID`, doğrulayıcı node'un node ID'sidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getPendingValidators",
    "params": {},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "validators": [
      {
        "txID": "2NNkpYTGfTFLSGXJcHtVv6drwVU2cczhmjK2uhvwDyxwsjzZMm",
        "startTime": "1600368632",
        "endTime": "1602960455",
        "stakeAmount": "200000000000",
        "nodeID": "NodeID-5mb46qkSBj81k9g9e4VFjGGSbaaSLFRzD",
        "delegationFee": "10.0000",
        "connected": false
      }
    ],
    "delegators": [
      {
        "txID": "Bbai8nzGVcyn2VmeYcbS74zfjJLjDacGNVuzuvAQkHn1uWfoV",
        "startTime": "1600368523",
        "endTime": "1602960342",
        "stakeAmount": "20000000000",
        "nodeID": "NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL"
      }
    ]
  },
  "id": 1
}
```

### platform.getRewardUTXOs

Belirtilen işlemin stake veya delegasyon döneminin sona ermesinin ardından ödüllendirilen UTXO'ları döndürür.

**İmza**

```sh
platform.getRewardUTXOs({
    txID: string,
    encoding: string //isteğe bağlı
}) -> {
    numFetched: integer,
    utxos: []string,
    encoding: string
}
```

- `txID`, staking veya delegasyon işleminin kimliğidir.
- `numFetched`, döndürülen UTXO sayısını belirtir.
- `utxos`, kodlanmış ödül UTXO'larının dizisidir.
- `encoding`, döndürülen UTXO'lar için formatı belirtir. "cb58" veya "hex" olabilir ve varsayılan olarak "cb58"dır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getRewardUTXOs",
    "params": {
        "txID": "2nmH8LithVbdjaXsxVQCQfXtzN9hBbmebrsaEYnLM9T32Uy2Y5"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "numFetched": "2",
    "utxos": [
      "11Zf8cc55Qy1rVgy3t87MJVCSEu539whRSwpdbrtHS6oh5Hnwv1gz8G3BtLJ73MPspLkD83cygZufT4TPYZCmuxW5cRdPrVMbZAHfb6uyGM1jNGBhBiQAgQ6V1yceYf825g27TT6WU4bTdbniWdECDWdGdi84hdiqSJH2y",
      "11Zf8cc55Qy1rVgy3t87MJVCSEu539whRSwpdbrtHS6oh5Hnwv1NjNhqZnievVs2kBD9qTrayBYRs81emGTtmnu2wzqpLstbAPJDdVjf3kjwGWywNCdjV6TPGojVR5vHpJhBVRtHTQXR9VP9MBdHXge8zEBsQJAoZhTbr2"
    ],
    "encoding": "cb58"
  },
  "id": 1
}
```

### platform.getStakingAssetID

Bir alt ağın staking varlığı için bir assetID'si alır. Şu anda yalnızca Ana Ağın staking assetID'sini döndürmektedir.

**İmza**

```sh
platform.getStakingAssetID({
    subnetID: string //isteğe bağlı
}) -> {
    assetID: string
}
```

- `subnetID`, varlık kimliğinin talep edildiği alt ağı belirtir.
- `assetID`, bir alt ağın staking varlığı için assetID'dir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getStakingAssetID",
    "params": {
        "subnetID": "11111111111111111111111111111111LpoYY"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "assetID": "o8seyjX6WupqJ1CE8CeaozK13kqVgc4DFvdvc4crfacLFBauW"
  },
  "id": 1
}
```

### platform.getSubnets

Alt ağlar hakkında bilgi alır.

**İmza**

```sh
platform.getSubnets(
    {ids: []string}
) ->
{
    subnets: []{
        id: string,
        controlKeys: []string,
        threshold: string
    }
}
```

- `ids`, bilgi almak için alt ağların kimlikleridir. Atlandığında, tüm alt ağlar hakkında bilgi alır.
- `id`, Alt Ağın kimliğidir.
- `threshold`, `controlKeys` dizisindeki adreslerden doğrulayıcı eklemek için gereken imzalardır.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getSubnets",
    "params": {"ids":["hW8Ma7dLMA7o4xmJf3AXBbo17bXzE7xnThUd3ypM4VAWo1sNJ"]},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
    "jsonrpc": "2.0",
    "result": {
        "subnets": [
            {
                "id": "hW8Ma7dLMA7o4xmJf3AXBbo17bXzE7xnThUd3ypM4VAWo1sNJ",
                "controlKeys": [
                    "KNjXsaA1sZsaKCD1cd85YXauDuxshTes2",
                    "Aiz4eEt5xv9t4NCnAWaQJFNz5ABqLtJkR"
                ],
                "threshold": "2"
            }
        ]
    },
    "id": 1
}
```

### platform.getStake

Belirtilen adresler tarafından stake edilen nCAM miktarını alır. Döndürülen miktar stake ödüllerini içermez.

**İmza**

```sh
platform.getStake({addresses: []string}) -> {staked: int}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getStake",
    "params": {
        "addresses": [
            "P-everest1g3ea9z5kmkzwnxp8vr8rpjh6lqw4r0ufec460d",
            "P-everest12un03rm579fewele99c4v53qnmymwu46dv3s5v"
        ]
    },
    "id": 1
}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "staked": "5000000"
  },
  "id": 1
}
```

### platform.getTimestamp

Mevcut P-Chain zaman damgasını alır.

**İmza**

```sh
platform.getTimestamp() -> {time: string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getTimestamp",
    "params": {},
    "id": 1
}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "timestamp": "2021-09-07T00:00:00-04:00"
  },
  "id": 1
}
```

### platform.getTotalStake

Ana Ağda stake edilen toplam nCAM miktarını alır.

**İmza**

```sh
platform.getTotalStake() -> {stake: int}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getTotalStake",
    "params": {},
    "id": 1
}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "stake": "279825917679866811"
  },
  "id": 1
}
```

### platform.getTx

Bir işlemi kimliği ile getirir.

Dönüş işlemi için formatı belirtmek için isteğe bağlı `encoding` parametresi. "cb58", "hex" veya "json" olabilir. Varsayılan "cb58"dır.

**İmza**

```sh
platform.getTx({
    txID: string,
    encoding: string //isteğe bağlı
}) -> {
    tx: string,
    encoding: string,
}
```

**CB58 Örneği**

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getTx",
    "params": {
        "txID":"2Eug3Y6j1yD745y5bQ9bFCf5nvU2qT1eB53GSpD15EkGUfu8xh",
        "encoding": "cb58"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tx": "111117ukQs6mcsKobtCH2jrVemXbPL2SgZTxJ4Lg7zazMjo4Kyyo33YNwnwhUJToHRk7zmCFXbL6BieJWpLch9Aa8opKr7qJeWPjSWhriX9TQLBt5jxq9ijX9JB3dwNG7MtY5KXS6EWF3w3tHBL5GTfL36F2b1PJfcWQQoTgeQWoe8MJXM27LGjnkhTMEzuNpTyrEcranPgXwdy9nNVZiLGMyYpzXbnmV2JUkGZXap8Ye3faWBwNg1La4aCXFKZ7ADMSiQUgqWYDMGZkDEg3yXNifSsBiAvqeCTx8kKp4B5W1vsgf3Tko2XW6A3SrkNVFVmbqCNjPKPpKeoSPnAC5Wmrb9zTMSZqYG9F6E7myow4o7tubbeDU3FC6fSws5ytQAnFseKUUT94jBGFGDD9pAuXExFwdwgRRUUS228ai4AZMqEF7KW5J9FhFQCUxMyprLxdPEUrjw3jW",
    "encoding": "cb58"
  },
  "id": 1
}
```

**JSON Örneği**

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getTx",
    "params": {
        "txID":"2Eug3Y6j1yD745y5bQ9bFCf5nvU2qT1eB53GSpD15EkGUfu8xh",
        "encoding": "json"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tx": {
      "unsignedTx": {
        "inputs": {
          "networkID": 5,
          "blockchainID": "11111111111111111111111111111111LpoYY",
          "outputs": [],
          "inputs": [
            {
              "txID": "2QYG5yR6YW55ixmBvR4zXLCZKV9we9bmSWHHiGppF4Ko17bTPn",
              "outputIndex": 0,
              "assetID": "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
              "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
              "input": {
                "amount": 1998000000,
                "signatureIndices": [0]
              }
            }
          ],
          "memo": "0x"
        },
        "destinationChain": "yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp",
        "exportedOutputs": [
          {
            "assetID": "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
            "fxID": "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ",
            "output": {
              "addresses": [
                "P-columbus1yhem6kev6gkfsyse3m5z09e6qsuxujz0arpw8v"
              ],
              "amount": 1997000000,
              "locktime": 0,
              "threshold": 1
            }
          }
        ]
      },
      "credentials": [
        {
          "signatures": [
            "0xdbc03ebd7d06927baacf7aea85cdebd7e0b95cf5b57715a09981fd5a75dac2cb610636bf3657ba4ca47dad4beed2e7f0ec692e7f12f1bbc9f3c34fc5c18ae35d01"
          ]
        }
      ]
    },
    "encoding": "json"
  },
  "id": 1
}
```

### platform.getTxStatus

Bir işlemin durumunu kimliği ile alır. Eğer işlem atıldıysa, yanıt bir `reason` alanı içerecek ve işlemin neden atıldığını daha fazla bilgilendirecektir.

**İmza**

```sh
platform.getTxStatus({
    txID: string
}) -> {status: string}
```

`status`, aşağıdakilerden biri olabilir:

- `Committed`: İşlem her nodo tarafından kabul edilecek (veya kabul edildi) ise.
- `Processing`: İşlem bu nodo tarafından oylanmakta.
- `Dropped`: İşlem ağın hiçbir nodu tarafından kabul edilmeyecek, nedenini öğrenmek için `reason` alanını kontrol edin.
- `Unknown`: İşlem bu nodo tarafından görülmedi.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getTxStatus",
    "params": {
        "txID":"TAG9Ns1sa723mZy1GSoGqWipK6Mvpaj7CAswVJGM6MkVJDF9Q"
   },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "Committed"
  },
  "id": 1
}

### platform.getUTXOs

Verilen adres kümesine referans veren UTXO'ları alır.

**Imza**

```sh
platform.getUTXOs(
    {
        addresses: []string,
        limit: int, //isteğe bağlı
        startIndex: { //isteğe bağlı
            address: string,
            utxo: string
        },
        sourceChain: string, //isteğe bağlı
        encoding: string, //isteğe bağlı
    },
) ->
{
    numFetched: int,
    utxos: []string,
    endIndex: {
        address: string,
        utxo: string
    },
    encoding: string,
}
```

- `utxos`, her bir UTXO'nun `addresses` içinde en az bir adrese referans verdiği bir UTXO listesidir.
- En fazla `limit` kadar UTXO döner. Eğer `limit` verilmezse veya 1024'ten büyükse, 1024 olarak ayarlanır.
- Bu yöntem sayfalama destekler. `endIndex`, dönen son UTXO'yu belirtir. Bir sonraki UTXO kümesini almak için, `endIndex` değerini bir sonraki çağrıda `startIndex` olarak kullanın.
- `startIndex` verilmezse, `limit` kadar tüm UTXO'lar alınır.

- Sayfalama kullanırken (yani `startIndex` sağlandığında), UTXO'ların birden fazla çağrı arasında benzersiz olacağı garanti edilmez. Yani, bir UTXO ilk çağrının sonucunda görünürken, ikinci çağrıda yine görünebilir.
- Sayfalama kullanırken, tutarlılık birden fazla çağrı arasında garanti edilmez. Yani, adreslerin UTXO seti çağrılar arasında değişebilir.
- `encoding`, dönen UTXO'lar için formatı belirtir. "cb58" veya "hex" olarak ayarlanabilir ve varsayılan olarak "cb58"dır.

#### **Örnek**

Diyelim ki `P-columbus1s994jad0rtwvlfpkpyg2yau9nxt60qqfv023qx` ve `P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr` adreslerinden en az birine referans veren tüm UTXO'ları almak istiyoruz.

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"platform.getUTXOs",
    "params" :{
        "addresses":["P-columbus1s994jad0rtwvlfpkpyg2yau9nxt60qqfv023qx", "P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr"],
        "limit":5,
        "encoding": "cb58"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

Bu, aşağıdaki yanıtı verir:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "numFetched": "5",
    "utxos": [
      "11PQ1sNw9tcXjVki7261souJnr1TPFrdVCu5JGZC7Shedq3a7xvnTXkBQ162qMYxoerMdwzCM2iM1wEQPwTxZbtkPASf2tWvddnsxPEYndVSxLv8PDFMwBGp6UoL35gd9MQW3UitpfmFsLnAUCSAZHWCgqft2iHKnKRQRz",
      "11RCDVNLzFT8KmriEJN7W1in6vB2cPteTZHnwaQF6kt8B2UANfUkcroi8b8ZSEXJE74LzX1mmBvtU34K6VZPNAVxzF6KfEA8RbYT7xhraioTsHqxVr2DJhZHpR3wGWdjUnRrqSSeeKGE76HTiQQ8WXoABesvs8GkhVpXMK",
      "11GxS4Kj2od4bocNWMQiQhcBEHsC3ZgBP6edTgYbGY7iiXgRVjPKQGkhX5zj4NC62ZdYR3sZAgp6nUc75RJKwcvBKm4MGjHvje7GvegYFCt4RmwRbFDDvbeMYusEnfVwvpYwQycXQdPFMe12z4SP4jXjnueernYbRtC4qL",
      "11S1AL9rxocRf2NVzQkZ6bfaWxgCYch7Bp2mgzBT6f5ru3XEMiVZM6F8DufeaVvJZnvnHWtZqocoSRZPHT5GM6qqCmdbXuuqb44oqdSMRvLphzhircmMnUbNz4TjBxcChtks3ZiVFhdkCb7kBNLbBEmtuHcDxM7MkgPjHw",
      "11Cn3i2T9SMArCmamYUBt5xhNEsrdRCYKQsANw3EqBkeThbQgAKxVJomfc2DE4ViYcPtz4tcEfja38nY7kQV7gGb3Fq5gxvbLdb4yZatwCZE7u4mrEXT3bNZy46ByU8A3JnT91uJmfrhHPV1M3NUHYbt6Q3mJ3bFM1KQjE"
    ],
    "endIndex": {
      "address": "P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr",
      "utxo": "kbUThAUfmBXUmRgTpgD6r3nLj7rJUGho6xyht5nouNNypH45j"
    },
    "encoding": "cb58"
  },
  "id": 1
}
```

`numFetched` değeri `limit` ile aynı olduğu için, daha fazla UTXO olabileceğini anlarız. Yöntemi yeniden çağırarak, bu sefer `startIndex` ile elde edelim:

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "id"     :1,
    "method" :"platform.getUTXOs",
    "params" :{
        "addresses":["P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr"],
        "limit":5,
        "startIndex": {
            "address": "P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr",
            "utxo": "kbUThAUfmBXUmRgTpgD6r3nLj7rJUGho6xyht5nouNNypH45j"
        },
        "encoding": "cb58"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

Bu, aşağıdaki yanıtı verir:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "numFetched": "4",
    "utxos": [
      "115ZLnNqzCsyugMY5kbLnsyP2y4se4GJBbKHjyQnbPfRBitqLaxMizsaXbDMU61fHV2MDd7fGsDnkMzsTewULi94mcjk1bfvP7aHYUG2i3XELpV9guqsCtv7m3m3Kg4Ya1m6tAWqT7PhvAaW4D3fk8W1KnXu5JTWvYBqD2",
      "11QASUuhw9M1r52maTFUZ4fnuQby9inX77VYxePQoNavEyCPuHN5cCWPQnwf8fMrydFXVMPAcS4UJAcLjSFskNEmtVPDMY4UyHwh2MChBju6Y7V8yYf3JBmYt767NPsdS3EqgufYJMowpud8fNyH1to4pAdd6A9CYbD8KG",
      "11MHPUWT8CsdrtMWstYpFR3kobsvRrLB4W8tP9kDjhjgLkCJf9aaJQM832oPcvKBsRhCCxfKdWr2UWPztRCU9HEv4qXVwRhg9fknAXzY3a9rXXPk9HmArxMHLzGzRECkXpXb2dAeqaCsZ637MPMrJeWiovgeAG8c5dAw2q",
      "11K9kKhFg75JJQUFJEGiTmbdFm7r1Uw5zsyDLDY1uVc8zo42WNbgcpscNQhyNqNPKrgtavqtRppQNXSEHnBQxEEh5KbAEcb8SxVZjSCqhNxME8UTrconBkTETSA23SjUSk8AkbTRrLz5BAqB6jo9195xNmM3WLWt7mLJ24"
    ],
    "endIndex": {
      "address": "P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr",
      "utxo": "21jG2RfqyHUUgkTLe2tUp6ETGLriSDTW3th8JXFbPRNiSZ11jK"
    },
    "encoding": "cb58"
  },
  "id": 1
}
```

`numFetched` değeri `limit`'ten az olduğu için, UTXO'ları alma işleminin tamamlandığını ve bu yöntemi yeniden çağırmamıza gerek olmadığını anlarız.

Diyelim ki X Zincirinden P Zincirine aktarılmış UTXO'ları almak istiyoruz, bu durumda bir ImportTx oluşturmak için `GetUTXOs` çağrısında `sourceChain` argümanını kullanmamız gerekir:

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "id"     :1,
    "method" :"platform.getUTXOs",
    "params" :{
        "addresses":["P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr"],
        "sourceChain": "X",
        "encoding": "cb58"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

Bu, aşağıdaki yanıtı verir:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "numFetched": "1",
    "utxos": [
      "115P1k9aSVFBfi9siZZz135jkrBCdEMZMbZ82JaLLuML37cgVMvGwefFXr2EaH2FML6mZuCehMLDdXSVE5aBwc8ePn8WqtZgDv9W641JZoLQhWY8fmvitiBLrc3Zd1aJPDxPouUVXFmLEbmcUnQxfw1Hyz1jpPbWSioowb"
    ],
    "endIndex": {
      "address": "P-columbus1fquvrjkj7ma5srtayfvx7kncu7um3ym73ztydr",
      "utxo": "S5UKgWoVpoGFyxfisebmmRf8WqC7ZwcmYwS7XaDVZqoaFcCwK"
    },
    "encoding": "cb58"
  },
  "id": 1
}
```

### platform.getValidatorsAt

Belirli bir P-Zincir yüksekliğinde bir alt ağın veya Ana Ağın doğrulayıcılarını ve ağırlıklarını alır.

**Imza**

```sh
platform.getValidatorsAt(
    {
        height: int,
        subnetID: string, // isteğe bağlı
    }
)
```

- `height`, doğrulayıcı kümesinin alınacağı P-Zincir yüksekliğidir.
- `subnetID`, doğrulayıcı kümesinin alınacağı alt ağın ID'sidir. Verilmezse, Ana Ağın doğrulayıcı kümesi alınır.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getValidatorsAt",
    "params": {
        "height":1
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "validators": {
      "NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL": 2000000000000000,
      "NodeID-5ZUdznHckQcqucAnNf3vzXnPF97tfRtfn": 2000000000000000,
      "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ": 2000000000000000,
      "NodeID-PM2LqrGsxudhZSP49upMonevbQvnvAciv": 2000000000000000,
      "NodeID-EoYFkbokZEukfWrUovo74YkTFnAMaqTG7": 2000000000000000
    }
  },
  "id": 1
}
```

### platform.importAVAX

X-Zincirinden P-Zincirine CAM transferini tamamlayın.

Bu yöntem çağrılmadan önce, X-Zincirinin  yöntemini `CAM` varlık kimliği ile çağırarak transferi başlatmalısınız.

**Imza**

```sh
platform.importAVAX(
    {
        from: []string, //isteğe bağlı
        to: string,
        changeAddr: string, //isteğe bağlı
        username: string,
        password: string
    }
) ->
{
    tx: string,
    changeAddr: string
}
```

- `to`, CAM'in ithal edileceği adresin kimliğidir. Bu, X-Zincirinin `export` çağrısındaki `to` argümanı ile aynı olmalıdır.
- `from`, bu işlem için kullanmak istediğiniz adreslerdir. Verilmezse, ihtiyaç duyuldukça kullanıcıya ait herhangi bir adres kullanılır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adresdir. Verilmezse, değişiklik kullanıcı tarafından kontrol edilen adreslerden birine gönderilir.
- `username`, `from` ve değişim adreslerini kontrol eden kullanıcıdır.
- `password`, `username`'in şifresidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.importAVAX",
    "params": {
        "to": "P-columbus1apzq2zt0uaaatum3wdz83u4z7dv4st7l5m5n2a",
        "from": ["P-columbus1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
        "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "username": "myUsername",
        "password": "myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "P63NjowXaQJXt5cmspqdoD3VcuQdXUPM5eoZE2Vcg63aVEx8R",
    "changeAddr": "P-columbus103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u"
  },
  "id": 1
}
```

### platform.importKey

Bir adrese kontrol verme amacıyla, o adresi kontrol eden özel anahtarı sağlayın.

**Imza**

```sh
platform.importKey({
    username: string,
    password: string,
    privateKey: string
}) -> {address: string}
```

- `privateKey`, `username`'in özel anahtarlar setine eklenir. `address`, `username`in artık özel anahtarla kontrol ettiği adrestir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"platform.importKey",
    "params" :{
        "username": "myUsername",
        "password": "myPassword",
        "privateKey": "PrivateKey-2w4XiXxPfQK4TypYqnohRL8DRNTz9cGiGmwQ1zmgEqD9c9KWLq"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "address": "P-columbus19hwpvkx2p5q99w87dlpfhqpt3czyh8ywasfaym"
  }
}
```

### platform.issueTx

Platform Zincirine bir işlem talep edin.

**Imza**

```sh
platform.issueTx({
    tx: string,
    encoding: string, //isteğe bağlı
}) -> {txID: string}
```

- `tx`, bir işlemin byte temsildir.
- `encoding`, işlem byte'ları için encoding formatını belirtir. "cb58" veya "hex" olarak ayarlanabilir. Varsayılan değer "cb58"dir.
- `txID`, işlemin kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.issueTx",
    "params": {
        "tx":"111Bit5JNASbJyTLrd2kWkYRoc96swEWoWdmEhuGAFK3rCAyTnTzomuFwgx1SCUdUE71KbtXPnqj93KGr3CeftpPN37kVyqBaAQ5xaDjr7wVBTUYi9iV7kYJnHF61yovViJF74mJJy7WWQKeRMDRTiPuii5gsd11gtNahCCsKbm9seJtk2h1wAPZn9M1eL84CGVPnLUiLP",
        "encoding": "cb58"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "G3BuH6ytQ2averrLxJJugjWZHTRubzCrUZEXoheG5JMqL5ccY"
  },
  "id": 1
}
```

### platform.listAddresses

Verilen kullanıcı tarafından kontrol edilen adresleri listeleyin.

**Imza**

```sh
platform.listAddresses({
    username: string,
    password: string
}) -> {addresses: []string}
```

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.listAddresses",
    "params": {
        "username":"myUsername",
        "password":"myPassword"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "addresses": ["P-columbus1ffksh2m592yjzwfp2xmdxe3z4ushln9s09z5p0"]
  },
  "id": 1
}
```

### platform.registerNode

Bir düğümü konsorsiyum üyesi adresi ile kaydedin. Böylece diğer yöntemlerde kullanılabilir. (ör: )

**Imza**

```sh
platform.registerNode(
    {
        oldNodeID: string,
        newNodeID: string,
        consortiumMemberAddress: string,
        username: string,
        password: string
    }
) ->
{
    txID: string,
    changeAddr: string
}
```

- `oldNodeID`, `oldNodeID`'den `newNodeID`'ye değiştirilecek olan düğüm kimliğidir. Eğer yoksa, aynı düğüm kimliği yeni olarak sağlanabilir.
- `newNodeID`, adres ile kaydedilecek olan düğüm kimliğidir.
- `consortiumMemberAddress`, konsorsiyum üyesinin adresidir.
- `username`, `camino-node`'un anahtar deposundaki kullanıcı adıdır.
- `password`, anahtar deposundaki kullanıcının şifesidir.

:::info YALNIZCA BİR DÜĞÜM HER KONSORSİYUM ÜYESİ İÇİN
Lütfen unutmayın ki bir Konsorsiyum Üyesi (adres), **sadece bir** `NodeID` ile kaydedilebilir.
:::

:::caution ÖZEL ANAHTARLARINIZI EKLEMEK ZORUNDASINIZ
Lütfen, API düğümünüzün anahtar deposuna `consortiumMemberAddress` ve `newNodeID`'nin **özel anahtarlarını** içeri aktarmanız gerektiğini unutmayın. Bunun için  bakınız.
:::

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.registerNode",
    "params": {
        "oldNodeID": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "newNodeID": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "consortiumMemberAddress": "P-kopernikus18jma8ppw3nhx5r4ap8clazz0dps7rv5uuvjh68",
        "username": "username",
        "password": "passw0rd"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "krj1ix5PEeHmd2C7son7uTDGMTr4DGFfCdzMdCbZfUstT3Fk2",
    "changeAddr": "P-kopernikus1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv3qzan"
  },
  "id": 1
}
```

### platform.sampleValidators

Belirtilen Alt Ağdan örnek doğrulayıcıları alın.

**Imza**

```sh
platform.sampleValidators(
    {
        size: int,
        subnetID: string, //isteğe bağlı
    }
) ->
{
    validators: []string
}
```

- `size`, örnek alınacak doğrulayıcı sayısını belirtir.
- `subnetID`, örnek alınacak Alt Ağa karşılık gelir. Verilmezse, varsayılan olarak Ana Ağdır.
- `validators` öğelerinin her biri, bir doğrulayıcının kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"platform.sampleValidators",
    "params" :{
        "size":2
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "validators": [
      "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
      "NodeID-PM2LqrGsxudhZSP49upMonevbQvnvAciv"
    ]
  }
}
```

### platform.setAddressState

Bir Adres Durumu İşlemine sahiptir ve bir adrese durum atar.

**Imza**

```sh
platform.setAddressStateTx({
    from: []string, //isteğe bağlı
    changeAddr: string, //isteğe bağlı
    username: string,
    password: string,
    address: string,
    state: int,
    remove: bool,
}) -> {
    txID: string
}
```

- `from`, bu işlem için kullanmak istediğiniz adreslerdir. Verilmezse, ihtiyaç duyuldukça kullanıcıya ait herhangi bir adres kullanılır.
- `changeAddr`, herhangi bir değişikliğin gönderileceği adresdir. Verilmezse, UTXO'nun sahibi değişmez.
- `username`, `from` imzalama anahtarlarının alındığı anahtar deposu kullanıcısıdır.
- `password`, `username`'in şifresidir.
- `address`, durumunu değiştireceğiniz adrestir.
- `state`, ayarlanacak veya kaldırılacak olan durumdur (bkz. remove).
- `remove`, durumun ayarlanıp ayarlanmayacağını belirtir.

**`state` için olası değerler**

```sh
    AddressStateRoleAdmin    = uint8(0)
    AddressStateRoleKyc      = uint8(1)

    AddressStateKycVerified    = uint8(32)
    AddressStateKycExpired     = uint8(33)

    AddressStateConsortium      = uint8(38)
    AddressStateNodeDeferred    = uint8(39)
```

:::info
Yalnızca `AddressStateRoleAdmin` durumundaki imzacılar yeni rolleri verme/geri alma iznine sahiptir.  
Yalnızca `AddressStateRoleKyc` durumundaki imzacılar KYC durumu bayraklarını değiştirme iznine sahiptir.  
Yalnızca `AddressStateRoleValidator` durumundaki imzacılar Doğrulayıcı durumu bayraklarını değiştirme iznine sahiptir.
:::

**Örnek Çağrı**

```sh
curl -X POST --data '{
  "jsonrpc":"2.0",
  "id"     : 1,
  "method" :"platform.setAddressState",
  "params" :{
      "from":["P-columbus1m8wnvtqvthsxxlrrsu3f43kf9wgch5tyfx4nmf"],
      "username":"myUsername",
      "password":"myPassword",
      "address":"P-columbus1m8wnvtqvthsxxlrrsu3f43kf9wgch5tyfx4nmf",
      "state": 1,
      "remove": false
  }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "txID": "2Kz69TNBSeABuaVjKa6ZJCTLobbe5xo9c5eU8QwdUSvPo2dBk3"
  },
  "id": 1
}
```

### platform.validatedBy

Verilen bir blok zincirini doğrulayan alt ağı alır.

**Imza**

```sh
platform.validatedBy(
    {
        blockchainID: string
    }
) -> {subnetID: string}
```

- `blockchainID`, blok zincirinin kimliğidir.
- `subnetID`, blok zincirini doğrulayan alt ağın kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.validatedBy",
    "params": {
        "blockchainID": "KDYHHKjM4yTJTT8H8qPs5KXzE6gQH5TZrmP1qVr1P6qECj3XN"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "subnetID": "2bRCr6B4MiEfSjidDwxDpdCyviwnfUVqB2HGwhm947w9YYqb7r"
  },
  "id": 1
}
```

### platform.validates

Bir Alt Ağın doğruladığı blok zincirlerinin kimliklerini alır.

**Imza**

```sh
platform.validates(
    {
        subnetID: string
    }
) -> {blockchainIDs: []string}
```

- `subnetID`, alt ağın kimliğidir.
- `blockchainIDs` öğelerinin her biri, Alt Ağın doğruladığı bir blok zincirinin kimliğidir.

**Örnek Çağrı**

```sh
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.validates",
    "params": {
        "subnetID":"2bRCr6B4MiEfSjidDwxDpdCyviwnfUVqB2HGwhm947w9YYqb7r"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockchainIDs": [
      "KDYHHKjM4yTJTT8H8qPs5KXzE6gQH5TZrmP1qVr1P6qECj3XN",
      "2TtHFqEAAJ6b33dromYMqfgavGPF3iCpdG3hwNMiart2aB5QHi"
    ]
  },
  "id": 1
}