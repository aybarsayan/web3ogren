---
title: BSC Stake dApps Rehberi - BSC Stake
description: Bu rehber, BSC Stake dApps ile validatör oluşturma, bilgilerini düzenleme ve delegasyon gibi temel işlemleri kapsamaktadır. Geliştiricilerin stake ile ilgili dApps oluşturabilmesi için gerekli bilgiler sunulmaktadır.
keywords: [BSC, Stake, dApps, validatör, delegasyon, akıllı sözleşme, staking]
---

# BSC Stake dApps Rehberi

Bu rehber, validatör oluşturma, bilgilerini düzenleme ve delegasyon gibi temel stake işlemlerini kapsar. Geliştiriciler, stake ile ilgili dApps oluşturmak için bu arayüzleri kullanabilir.

## StakeHub Sözleşmesi

BSC stake işlemleri, validatör ve delegasyon yönetimi için esasen `StakeHub` akıllı sözleşmelerini kullanır.

- `StakeHub`: Validatör oluşturma, kullanıcı delegasyonlarını yönetme ve validatör kesintisine ceza uygulama işlevlerini yerine getirir. `StakeHub` arayüzlerinin tam listesi için lütfen [ABI dosyasına](https://github.com/bnb-chain/bsc-genesis-contract/blob/bc-fusion/abi/stakehub.abi) bakın. (Adres `0x0000000000000000000000000000000000002002`)

## Validatör Oluşturma

Bir validatör oluşturmak için, aşağıdaki parametrelerle `createValidator` fonksiyonunu kullanın:

```solidity
  function createValidator(
    address consensusAddress,
    bytes calldata voteAddress,
    bytes calldata blsProof,
    Commission calldata commission,
    Description calldata description
) external payable
```

- `consensusAddress`: Validatörün uzlaşma adresi.
- `voteAddress`: Validatörün oylama adresi.
- `blsProof`: Oylama adresinin kanıtı olarak BLS imzası.
- `commission`: Oran, maxRate ve maxChangeRate dahil olmak üzere komisyon yapısı.
- `description`: Validatörün moniker, kimlik, web sitesi ve detaylarını içeren tanımı.

> **Not**: Bir validatör oluşturmak için 1 BNB bloke edilmesi gerekmektedir ve işlem, bu bloke miktarını ve herhangi bir kendine delegasyonu karşılamak için yeterli BNB miktarı ile gönderilmelidir. Toplamda 2001 BNB.

## Validatörü Düzenleme

### Uzlaşma Adresini Düzenleme

Bir validatörün uzlaşma adresini değiştirmek için, aşağıdaki parametrelerle `editConsensusAddress` fonksiyonunu kullanın:

```solidity
function editConsensusAddress(address newConsensusAddress) external
```

- `newConsensusAddress`: Validatörün yeni uzlaşma adresi.

### Komisyon Oranını Düzenleme

Bir validatörün komisyon oranını güncellemek için, aşağıdaki parametrelerle `editCommissionRate` fonksiyonunu kullanın:

```solidity
function editCommissionRate(uint64 newCommissionRate) external
```

- `newCommissionRate`: Oran, maxRate ve maxChangeRate dahil yeni komisyon yapısı.

### Açıklamayı Düzenleme

Bir validatörün açıklamasını güncellemek için, aşağıdaki parametrelerle `editDescription` fonksiyonunu kullanın:

```solidity
function editDescription(Description memory newDescription) external
```

- `newDescription`: Validatörün moniker, kimlik, web sitesi ve detaylarını içeren yeni açıklaması.

### Oylama Adresini Düzenleme

Bir validatörün oylama adresini değiştirmek için, aşağıdaki parametrelerle `editVoteAddress` fonksiyonunu kullanın:

```solidity
function editVoteAddress(bytes calldata newVoteAddress, bytes calldata blsProof) external
```

- `newVoteAddress`: Validatörün yeni oylama adresi.
- `blsProof`: Oylama adresinin kanıtı olarak BLS imzası.

## Delegasyon İşlemleri

### Delegasyon Yapma

Bir validatöre BNB delegasyonu yapmak için, aşağıdaki parametrelerle `delegate` fonksiyonunu çağırın:

```solidity
function delegate(address operatorAddress, bool delegateVotePower) external payable
```

- `operatorAddress`: Validatörün operatör adresi.
- `delegateVotePower`: Delegatörün oylama gücünü validatöre devretmek isteyip istemediğini belirtmek için bayrak.

:::tip 
**İpucu**: Delegasyon yapmadan önce, validatörün performansını ve güvenilirliğini kontrol etmeyi unutmayın.
:::

### Delegasyonu İptal Etme

Bir validatörden BNB delegasyonunu iptal etmek için, aşağıdaki parametrelerle `undelegate` fonksiyonunu kullanın:

```solidity
function undelegate(address operatorAddress, uint256 shares) external
```

- `operatorAddress`: Validatörün operatör adresi.
- `shares`: Validatörden iptal edilecek hisselerin miktarı.

### Yeniden Delegasyon

Bir validatörden diğerine BNB yeniden delegasyonu yapmak için, aşağıdaki parametrelerle `redelegate` fonksiyonunu kullanın:

```solidity
function redelegate(address srcValidator, address dstValidator, uint256 shares, bool delegateVotePower) external
```

- `srcValidator`: Yeniden delegasyon yapılacak kaynak validatörün operatör adresi.
- `dstValidator`: Yeniden delegasyon yapılacak varış validatörünün operatör adresi.
- `delegateVotePower`: Delegatörün oylama gücünü varış validatörüne devretmek isteyip istemediğini belirtmek için bayrak.

## Talep Etme

Boşta kalan BNB'yi talep etmek için, tek bir talep için `claim` fonksiyonunu veya birden fazla talep için `claimBatch` fonksiyonunu kullanın:

```solidity
function claim(address operatorAddress, uint256 requestNumber) external
```

- `operatorAddress`: Validatörün operatör adresi.
- `requestNumber`: Talep edilen boşta kalma taleplerinin sayısı. `0`, tüm boşta kalan taleplerden talep anlamına gelir.

```solidity
function claimBatch(address[] calldata operatorAddresses, uint256[] calldata requestNumbers) external
```

- `operatorAddress`: Validatörlerin operatör adresleri.
- `requestNumber`: Validatörlerden talep edilen boşta kalma taleplerinin sayısı.

## Hassasiyet Kaybı

Kredi tokenleri ile BNB arasındaki dönüşüm sürecinde, kaçınılmaz olarak tam sayı bölümü kullanılır; bu da hassasiyet kaybına yol açabilir. Bu, somut sorunlara yol açabilir. Örneğin, 1 BNB delegasyonu yapan bir kullanıcı hemen geri çekilmek isterse; yukarıda bahsedilen hassasiyet kaybı nedeniyle yalnızca 0.99..99 BNB talep edebilecektir ki bu, aslında 1'den bir küçük kesir (1e-18) çıkarılmasıdır.

:::warning 
**Dikkat**: Hassasiyet kaybı, önemli finansal kayıplara yol açabilir. Kullanıcıların dikkatli olması önemlidir.
:::

Lido ve Rocket Pool gibi staking havuzlarında, kullanıcılar benzer sorunlarla karşılaşabilir. Bununla birlikte, bu sorunlar düşünceli ürün tasarımı ile etkili bir şekilde ele alınabilir. Örneğin, kullanıcılara bilgi gösterirken yalnızca sekiz ondalık basamağı koruyarak yukarı yuvarlamak bir çözüm olabilir. Veya kullanıcılara delegasyonu iptal etmek yerine, kredi tokenlerini BNB ile takas etmeleri, kesin dönüşüm sonuçları açıkça gösterilebilir.

## SSS

### Validatörün kredi sözleşmesi nedir?

Her validatör için, oluşturulduklarında otomatik olarak dağıtılacak bir kredi sözleşmesi vardır. Bu arada, sözleşme herhangi bir validatör operatörü tarafından yükseltilemez veya değiştirilemez.

Kredi sözleşmesi, bir BEP20 sözleşmesidir ve ABI, [Stake Credit sözleşmesi](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/stakecredit.abi) ile aynıdır.

Delegasyon sorgulama işlevleri sağlar, bunlar arasında:

* `balanceOf(address)`: Bir delegatörün kredi bakiyesini alır.
* `getPooledBNB(address)`: Bir delegatörün havuzda tuttuğu BNB miktarını alır.
* `getPooledBNBByShares(uint256)`: Belirli bir hisse miktarı için havuzda tuttuğu BNB miktarını alır.
* `getSharesByPooledBNB(uint256)`: Belirli bir havuzda tutulmuş BNB miktarı için hisseleri alır.
* `pendingUnbondingRequests(address)`: Bir delegatör için boşaltma taleplerinin sayısını alır.
* `unbondRequest(address, uint256)`: Bir delegatör için boşaltma talebinin detaylarını alır.
* `claimableUnbondRequest(address)`: Bir delegatör için talep edilebilecek boşaltma taleplerinin sayısını alır.
* `lockedBNBs(address, uint256)`: Bir delegatörün boşaltma kuyruğu için kilitlenmiş BNB'lerini alır.

### Bir delegatör için hisseleri/BNB'yi nasıl alırım?

Herhangi bir spesifik validatör için, delegatörün hisselerini almak için validatörün kredi sözleşmesinin `balanceOf` fonksiyonunu çağırın. Hisseler yerine BNB miktarını almak için `getPooledBNB` fonksiyonu kullanılabilir.

Tüm validatörlerin hisselerini almak için, her validatör için `balanceOf` fonksiyonunu çağırıp sonuçları toplayarak yapabilirsiniz. Tüm validatörlerin bilgilerini almak için aşağıdakilere başvurabilirsiniz ve çoklu çağrı sözleşmesi kullanarak verimliliği artırabilirsiniz.

### Belirli bir hisse miktarı için BNB miktarını nasıl hesaplarım?

Kredi sözleşmesi, belirli bir hisse miktarı için BNB miktarını hesaplamak için `getPooledBNBByShares` fonksiyonunu sağlar.

Tersi durumu yapmak için, belirli bir BNB miktarı için hisseleri hesaplamak için `getSharesByPooledBNB` fonksiyonunu kullanın.

### Bir validatörün APR/APY'sini nasıl hesaplarım?

Her validatörün kendi APR/APY'si olacağını belirtmek gerekir ve staking sistemi, ödülleri otomatik olarak bileşen haline getirir.

Ödül, her gün UTC saat diliminde 00:00:00'da her validatörün BNB havuzuna dağıtılır. Bir validatörün APR/APY'sini hesaplamak için toplam havuzda tutulmuş BNB miktarı ve aynı gün için ödül miktarı gereklidir.

`StakeHub` sözleşmesi, bu amaç için `getValidatorTotalPooledBNBRecord(address,uint256)(uint256)` ve `getValidatorRewardRecord(address,uint256)(uint256)` fonksiyonlarını sağlar.

Aşağıdaki kod, belirli bir günde APY'yi nasıl hesaplayacağını gösterir:

```go
// örnek kod, üretim ortamında kullanmayın

// stakehub, StakeHub sözleşmesinin örneğidir
stakeHub, _ := contracts.NewStakeHub(ethcommon.HexToAddress("0x0000000000000000000000000000000000002002"), client.GetEthClient())

// bir günde ne kadar blok olduğunu alın
interval, _ := stakeHub.BREATHEBLOCKINTERVAL(nil)

// verilen bir bloğun zamanını alın
header, _ := p.client.GetBlockHeader(blockHeight)

// aşağıdaki fonksiyonları çağırmak için indeks parametresini hesaplayın
index := int64(header.Time) / interval.Int64()

// belirtilen validatör ve indeks için toplam havuzda tutulmuş BNB miktarını ve karşılık gelen ödül miktarını alın
totalPooledBNB, _ := stakeHub.GetValidatorTotalPooledBNBRecord(nil, validatorOperatorAddress, index)
reward, _ := stakeHub.GetValidatorRewardRecord(nil, validatorOperatorAddress, index)

// APY'yi hesaplayın
rate, _ := big.NewFloat(0).Quo(big.NewFloat(0).SetInt(reward), big.NewFloat(0).SetInt(totalPooledBNB)).Float64()
apy := math.Pow(1+rate, 365) - 1.0
```

### Bir delegatörün boşaltma delegasyonlarını ve talep edilebilecek boşaltma taleplerini nasıl alırım?

Kredi sözleşmesi, bir delegatör için boşaltma delegasyonlarının sayısını almak için `pendingUnbondRequest` fonksiyonunu sağlar. 
Bir boşaltma talebinin detaylarını gözden geçirmek için, hangi boşaltma talebinin döndürüleceğini tanımlamak için `index` parametresi ile `unbondRequest` fonksiyonunu çağırın. 

Talep edilebilecek boşaltma taleplerini almak için, talep edilebileceklerinin sayısını almak için `claimableUnbondRequest` fonksiyonunu çağırın.

Boşaltma talepleri için kilitlenmiş BNB'leri almak için `lockedBNBs` fonksiyonunu kullanın. Bu, delegatörün boşaltma kuyruğundaki ilk `number` boşaltma taleplerinin kilitlenmiş BNB toplamını tanımlamak için `number` parametresine sahiptir. `0` değerini ayarlayarak tüm kilitlenmiş BNB'leri alabilirsiniz.

### Bir delegatörün ödülünü nasıl alırım?

Sözleşmeler, bir delegatörün başlangıç delegasyon miktarını kaydetmiyor. Toplanan ödülü almak için aşağıdaki adımları izleyebilirsiniz: 

1. Sisteminizde başlangıç delegasyon miktarını takip edin, 
2. Bir validatörün kredi sözleşmesinin `getPooledBNB` fonksiyonunu çağırın, 
3. Matematiksel hesaplamaları yapın. Örneğin [bu kod deposuna](https://github.com/bnb-chain/staking-reward-example) bakabilirsiniz.

### Bir validatörün toplam staking adresini nasıl alırım?

Sözleşme, bir validatörün toplam staking adresini alacak bir fonksiyon sunmamaktadır. Bunun için `Delegated`, `Redelegated`, `Undelegated` olaylarını indekslemek için bir dış hizmete ihtiyaç vardır.

### Tüm validatörlerin bilgilerini nasıl alırım?

`StakeHub` sözleşmesi, tüm validatörlerin bilgilerini almak için `getValidators` fonksiyonunu sağlar; bu bilgiler, `operator` adresleri ve `kredi sözleşmesi` adreslerini içerir.

Belirli bir validatörün daha fazla bilgilerini almak için, lütfen aşağıdaki fonksiyonlara başvurun:

* `getValidatorConsensusAddress`
* `getValidatorCreditContract`
* `getValidatorVoteAddress`
* `getValidatorBasicInfo`
* `getValidatorDescription`
* `getValidatorCommission`