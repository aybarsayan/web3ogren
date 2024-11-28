---
title: Staking
description: Bu kılavuz, validator'leri oluşturma, validator bilgilerini düzenleme ve delegasyon işlemlerini gerçekleştirme gibi staking'in temel operasyonlarına genel bir bakış sağlar. Staking ile ilgili detaylar ve uygulamalar hakkında bilgi edinmek için lütfen içerikleri takip edin.
keywords: [staking, validator, delegasyon, BSC, akıllı sözleşme]
---

# Staking

Bu kılavuz, validator'leri oluşturma, validator bilgilerini düzenleme ve delegasyon işlemlerini gerçekleştirme gibi staking'in temel operasyonlarına genel bir bakış sağlar. Staking'in genel tanıtımı için lütfen `Staking Mekanizması` kısmına bakın.

## Sözleşme

BSC staking, validator yönetimi ve delegasyon yönetimi için esas olarak `StakeHub` akıllı sözleşmesini kullanır.

- `StakeHub`: Validator oluşturma, kullanıcı delegasyonlarını yönetme ve validator cezaları için yaptırımlar uygular.  
  (Adres: `0x0000000000000000000000000000000000002002`)

---

## Validator Oluşturma

Bir validator oluşturmak için, aşağıdaki parametrelerle `createValidator` fonksiyonunu kullanın:

```solidity
  function createValidator(
    address consensusAddress,
    bytes calldata voteAddress,
    bytes calldata blsProof,
    Commission calldata commission,
    Description calldata description
) external payable
```

- `consensusAddress`: Validator'un konsensüs adresi.
- `voteAddress`: Validator'un oy adresi.
- `blsProof`: Oy adresinin kanıtı olarak BLS imzası.
- `commission`: Komisyon yapısı, oran, maksimum oran ve maksimum değişim oranı dahil.
- `description`: Validator'un açıklaması, moniker, kimlik, web sitesi ve detaylar dahil.

:::note
**Not**: Bir validator oluşturmak, 1 BNB kilitlemeyi gerektirir ve işlem, bu kilitleme miktarını ve herhangi bir self-delegasyonu karşılamak için yeterli BNB miktarı ile gönderilmelidir; toplam 2001 BNB.
:::

---

## Validator Bilgilerini Düzenleme

### Konsensüs Adresini Düzenleme

Bir validator'un konsensüs adresini değiştirmek için, aşağıdaki parametrelerle `editConsensusAddress` fonksiyonunu kullanın:

```solidity
function editConsensusAddress(address newConsensusAddress) external
```

- `newConsensusAddress`: Validator'un yeni konsensüs adresi.

### Komisyon Oranını Düzenleme

Bir validator'un komisyon oranını güncellemek için, aşağıdaki parametrelerle `editCommissionRate` fonksiyonunu kullanın:

```solidity
function editCommissionRate(uint64 newCommissionRate) external
```

- `newCommissionRate`: Yeni komisyon yapısı, oran, maksimum oran ve maksimum değişim oranı dahil.

### Açıklamayı Düzenleme

Bir validator'un açıklamasını güncellemek için, aşağıdaki parametrelerle `editDescription` fonksiyonunu kullanın:

```solidity
function editDescription(Description memory newDescription) external
```

- `newDescription`: Validator'un yeni açıklaması, moniker, kimlik, web sitesi ve detaylar dahil.

### Oy Adresini Düzenleme

Bir validator'un oy adresini değiştirmek için, aşağıdaki parametrelerle `editVoteAddress` fonksiyonunu kullanın:

```solidity
function editVoteAddress(bytes calldata newVoteAddress, bytes calldata blsProof) external
```

- `newVoteAddress`: Validator'un yeni oy adresi.
- `blsProof`: Oy adresinin kanıtı olarak BLS imzası.

---

## Delegasyon İşlemleri

### Delegasyon

Bir validator'a BNB delegasyonu yapmak için, aşağıdaki parametrelerle `delegate` fonksiyonunu çağırın:

```solidity
function delegate(address operatorAddress, bool delegateVotePower) external payable
```

- `operatorAddress`: Validator'un operatör adresi.
- `delegateVotePower`: Delegatörün kendi oy gücünü yönetim için validator'a devretmek isteyip istemediğini belirtmek için kullanılacak bayrak.

### Delegasyonu İptal Etme

Bir validator'dan BNB delegasyonunu iptal etmek için, aşağıdaki parametrelerle `undelegate` fonksiyonunu kullanın:

```solidity
function undelegate(address operatorAddress, uint256 shares) external
```

- `operatorAddress`: Validator'un operatör adresi.
- `shares`: Validator'dan iptal edilecek hisse miktarı.

### Yeniden Delegasyon

Bir validator'dan diğerine BNB'yi yeniden delegasyon yapmak için, aşağıdaki parametrelerle `redelegate` fonksiyonunu kullanın:

```solidity
function redelegate(address srcValidator, address dstValidator, uint256 shares, bool delegateVotePower) external
```

- `srcValidator`: Yeniden delegasyon yapılacak kaynak validator'un operatör adresi.
- `dstValidator`: Yeniden delegasyon yapılacak hedef validator'un operatör adresi.
- `delegateVotePower`: Delegatörün kendi oy gücünü hedef validator'a devretmek isteyip istemediğini belirtmek için kullanılacak bayrak.

---

## Talep

Unbonding süresinin ardından geri alınmamış BNB'yi talep etmek için, tek istek için `claim` fonksiyonunu veya birden fazla istek için `claimBatch` fonksiyonunu kullanın:

```solidity
function claim(address operatorAddress, uint256 requestNumber) external
```

- `operatorAddress`: Validator'un operatör adresi.
- `requestNumber`: Talep edilecek unbonding isteği sayısı. `0`, tüm unbonding isteklerinden talep etmek anlamına gelir.

```solidity
function claimBatch(address[] calldata operatorAddresses, uint256[] calldata requestNumbers) external
```

- `operatorAddress`: Validator'ların operatör adresleri.
- `requestNumber`: Validator'lardan talep edilmesi gereken unbonding isteklerinin sayıları.

---

## SSS

### Her bir validator'ün kredi sözleşmesinin işlevleri/arayüzleri nelerdir?

Her bir validator için, oluşturulduğunda otomatik olarak dağıtılan bir kredi sözleşmesi vardır. Ayrıca, sözleşme herhangi bir validator operatörü tarafından yükseltilip değiştirilemez.

Kredi sözleşmesi bir BEP20 sözleşmesidir ve ABI şu ile aynıdır: [Stake Credit sözleşmesi](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/abi/stakecredit.abi).

Delegasyonları sorgulamak için işlevler sağlar, bunlar arasında:

* `balanceOf(address)`: Bir delegatörün kredi bakiyesini alır.
* `getPooledBNB(address)`: Bir delegatörün havuzdaki BNB miktarını alır.
* `getPooledBNBByShares(uint256)`: Belirli bir hissenin havuzdaki BNB miktarını alır.
* `getSharesByPooledBNB(uint256)`: Belirli bir havuzdaki BNB için hisseleri alır.
* `pendingUnbondingRequests(address)`: Bir delegatör için unbonding isteklerinin sayısını alır.
* `unbondRequest(address, uint256)`: Bir delegatör için unbond isteğinin detaylarını alır.
* `claimableUnbondRequest(address)`: Bir delegatör için talep edilebilir unbonding isteklerinin sayısını alır.
* `lockedBNBs(address, uint256)`: Bir delegatörün unbond kuyruğundaki kilitli BNB'leri alır.

### Bir delegatör için hisselerin/BNB miktarının nasıl alınacağını belirlemek?

Her bir belirli validator için, delegatörün hisselerini almak için validator'ün kredi sözleşmesinin `balanceOf` fonksiyonunu çağırın. Hisseler yerine BNB miktarını almak için `getPooledBNB` fonksiyonunu kullanabilirsiniz.

Tüm validator'lerin hisselerini almak için, her validator için `balanceOf` fonksiyonunu çağırın ve sonuçları toplayın. 

---

### Belirli bir hissenin BNB miktarının nasıl hesaplanacağını belirlemek?

Kredi sözleşmesi, belirli bir hissenin BNB miktarını hesaplamak için `getPooledBNBByShares` fonksiyonunu sağlar.

Tersine hesaplama için `getSharesByPooledBNB` fonksiyonunu kullanarak belirli bir BNB miktarı için hisseleri hesaplayın.

---

### Bir validator'un APR/APY'sinin nasıl hesaplanacağı?

Her bir validator'ün kendine ait APR/APY'si olduğunu lütfen unutmayın ve staking sistemi ödülleri otomatik olarak bileştirir.

Ödül, her gün UTC zamanı ile 00:00:00'da her bir validator'ün BNB havuzuna dağıtılır. Bir validator'un APR/APY'sini hesaplamak için, toplam havuzdaki BNB miktarı ile aynı gün için ilgili ödül miktarı gereklidir.

`StakeHub` sözleşmesi, bunun amacıyla `getValidatorTotalPooledBNBRecord(address,uint256)(uint256)` ve `getValidatorRewardRecord(address,uint256)(uint256)` fonksiyonlarını sağlar.

Aşağıdaki kodlar, belirli bir günde APY'yi nasıl hesaplayacağınızı gösterir:

```go
// örnek kod, üretimde kullanmayın

// stakehub, StakeHub sözleşmesinin örneğidir
stakeHub, _ := contracts.NewStakeHub(ethcommon.HexToAddress("0x0000000000000000000000000000000000002002"), client.GetEthClient())

// bir günde kaç blok olduğunu alın
interval, _ := stakeHub.BREATHEBLOCKINTERVAL(nil)

// belirli bir bloğun blok zamanını alın
header, _ := p.client.GetBlockHeader(blockHeight)

// aşağıdaki fonksiyonları çağırmak için indeks parametresini hesaplayın
index := int64(header.Time) / interval.Int64()

// belirli bir validator ve indeks için toplam havuzdaki BNB miktarını ve ilgili ödül miktarını alın
totalPooledBNB, _ := stakeHub.GetValidatorTotalPooledBNBRecord(nil, validatorOperatorAddress, index)
reward, _ := stakeHub.GetValidatorRewardRecord(nil, validatorOperatorAddress, index)

// APY'yi hesaplayın
rate, _ := big.NewFloat(0).Quo(big.NewFloat(0).SetInt(reward), big.NewFloat(0).SetInt(totalPooledBNB)).Float64()
apy := math.Pow(1+rate, 365) - 1.0
```

### Bir delegatörün unbonding delegasyonlarını ve talep edilebilecek unbonding taleplerini nasıl alabilirim?

Kredi sözleşmesi, bir delegatör için unbonding delegasyonu sayısını almak için `pendingUnbondRequest` fonksiyonunu sağlar. Unbond isteğinin detaylarını gözden geçirmek için `unbondRequest` fonksiyonunu, hangi unbond isteğinin döndürüleceğini tanımlamak için bir `index` parametresi ile çağırın.

Talep edilebilecek unbonding taleplerini almak için, talep edilebilir olanların sayısını almak için `claimableUnbondRequest` fonksiyonunu çağırın.

Unbonding talepleri için kilitlenmiş BNB'leri almak üzere `lockedBNBs` fonksiyonunu kullanın. Bu fonksiyon, delegatörün unbond kuyruğundaki ilk `number` unbonding isteğinin kilitlenmiş BNB toplamını tanımlamak için `number` parametresine sahiptir. Tüm kilitli BNB'leri almak için `number`'ı `0` olarak ayarlayın.

### Bir delegatörün ödülünü nasıl alabilirim?

Sözleşme, bir delegatörün başlangıç delegasyon miktarını saklamaz. Bir delegatörün biriktirdiği ödülü almak için şu adımlar izlenebilir: 1) başlangıç delegasyon miktarını sisteminizde takip edin, 2) validator'un kredi sözleşmesinin `getPooledBNB` fonksiyonunu çağırın, 3) matematiksel hesaplama yapın.

### Bir validator'un toplam staking adresini nasıl alabilirim?

Sözleşme, bir validator'un toplam staking adresini almak için bir işlev sağlamaz. Bunun için `Delegated`, `Redelegated`, `Undelegated` olaylarını indekslemek üzere bir dış hizmet gerekir. Örneğin, [stakeHub sözleşmesi](https://bscscan.com/address/0x0000000000000000000000000000000000002002) üzerinde önce `Delegated`, `Redelegated`, `Undelegated` olaylarını arayan bir indeksleyici inşa etmeyi düşünebilirsiniz. Daha sonra olayları gereksinimlerinize göre sıralayın.

### Tüm validator'lerin bilgilerini nasıl alabilirim?

`StakeHub` sözleşmesi, tüm validator'lerin bilgilerini almak için `getValidators` fonksiyonunu sağlar; bu bilgiler `operator` adresleri ve `kredi sözleşmesi` adreslerini içerir.

Belirli bir validator hakkında daha fazla bilgi almak için aşağıdaki fonksiyonlara bakabilirsiniz:

* `getValidatorConsensusAddress`
* `getValidatorCreditContract`
* `getValidatorVoteAddress`
* `getValidatorBasicInfo`
* `getValidatorDescription`
* `getValidatorCommission`

---

## Sözleşme ABI

`StakeHub`'ün tam arayüzleri için lütfen [ABI dosyasına](https://github.com/bnb-chain/bsc-genesis-contract/blob/bc-fusion/abi/stakehub.abi) bakın.