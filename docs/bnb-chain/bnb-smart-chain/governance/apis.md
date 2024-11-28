---
title: Yönetim API'leri - BSC Yönetimi
description: Bu kılavuz, BSC için yönetim API'lerinin işlevselliğini ayrıntılı bir şekilde ele almakta, öneri oluşturma, oy verme ve yönetim süreçlerini açıklamaktadır. Ayrıca, süreçlerin arka planda nasıl çalıştığına dair önemli bilgiler sunmaktadır.
keywords: [BSC, yönetim, API, öneri, oy verme, akıllı sözleşme, GovToken]
---

# BSC Yönetim API'leri

Bu kılavuz, öneri oluşturma, oy verme ve bunları uygulama gibi BSC için yönetim işlemlerine genel bir bakış sunmaktadır.

## Yönetim Sözleşmeleri

BSC yönetimi, BSC ekosisteminde merkeziyetsiz karar verme süreçlerini kolaylaştırarak iki ana akıllı sözleşme kullanmaktadır: `GovToken` yönetim token yönetimi için ve `Governor` öneri yönetimi ve oy verme için.

- `GovToken`: Yönetim tokenlarını yönetir, sahiplerin yönetim kararlarına katılmalarını sağlar. Stake edilen varlıklarla token bakiyelerini senkronize etmeyi ve oy verme haklarını devretmeyi destekler. (Adres: `0x0000000000000000000000000000000000002005`)

- `Governor`: Yönetim önerilerinin oluşturulmasını, oylamayı ve yürütülmesini yönetir. Ayrıca yalnızca uygun katılımcıların değişiklik önermesine ve oy vermesine izin verir. (Adres: `0x0000000000000000000000000000000000002004`)

## Öneri Oluşturma

:::tip
Bir öneri oluştururken dikkat edilmesi gereken en önemli noktalar; doğru adreslerin ve değerlerin belirlenmesidir.
:::

Bir öneri oluşturmak için `Governor`'ın `propose` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory
    description) public returns (uint256 proposalId)
```

- **`targets`**: Önerinin etkileşimde bulunacağı sözleşme adresleri.
- **`values`**: Her çağrı için BNB değerleri (wei cinsinden).
- **`calldatas`**: Kodlanmış fonksiyon çağrıları.
- **`description`**: Önerinin açıklaması.

## Oy Kullanma

Oy vermek için `Governor`'ın `castVote` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function castVote(uint256 proposalId, uint8 support, string memory reason) public returns (uint256)
```

- **`proposalId`**: Önerinin kimliği.
- **`support`**: Oy seçimi (örneğin, evet, hayır, çekimser).
- **`reason`**: (İsteğe bağlı) Oyunuzu vermenizin nedeni.

## Öneri Durumunu Kontrol Etme

Bir önerinin durumunu almak için `Governor`'ın `state` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function state(uint256 proposalId) public view returns (ProposalState)
```

- **`proposalId`**: Önerinin kimliği.

## Öneriyi Kuyruğa Alma

Öneriyi yürütme için planlamak üzere `Governor`'ın `queue` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function queue(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
public returns (uint256 proposalId)
```

- **`targets`**: Önerinin etkileşimde bulunacağı sözleşme adresleri.
- **`values`**: Her çağrı için Ether değerleri (wei cinsinden).
- **`calldatas`**: Kodlanmış fonksiyon çağrıları.
- **`descriptionHash`**: Önerinin açıklamasının hash'i.

## Öneriyi Yürütme

Zaman kilidi gecikmesinden sonra değişiklikleri uygulamak için `Governor`'ın `execute` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
public payable returns (uint256)
```

- **`targets`**: Önerinin etkileşimde bulunacağı sözleşme adresleri.
- **`values`**: Her çağrı için Ether değerleri (wei cinsinden).
- **`calldatas`**: Kodlanmış fonksiyon çağrıları.
- **`descriptionHash`**: Önerinin açıklamasının hash'i.

## Oy Delegasyonu

:::info
Oy verme gücünü devretmek, bireylerin yönetim süreçlerine etkilerinin korunmasına yardımcı olur.
:::

Oy verme gücünü birine devretmek için `GovToken`'ın `delegateVote` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

- **Delegatör adresi**: Oy verme gücünü başka bir adrese devreden delegatörün adresi.
- **Delegeli adresi**: Delegatörden oy verme gücünü alan ve onların adına yönetime katılan delegelinin adresi.

```solidity
function delegateVote(address delegator, address delegatee) external
```

- **`delegator`**: Oy verme gücünü başka bir adrese devreden delegatörün adresi.
- **`delegatee`**: Delegatörden oy verme gücünü alan delegelinin adresi.

## Sözleşme ABI

> Daha fazla bilgi için, `Governor`'ın tam arayüzleri için lütfen 
[ABI dosyasına](https://github.com/bnb-chain/bsc-genesis-contract/blob/bc-fusion/abi/Governor.abi) başvurun.  
> — BSC Yönetim Ekibi

> `GovToken`'ın tam arayüzleri için lütfen 
[ABI dosyasına](https://github.com/bnb-chain/bsc-genesis-contract/blob/bc-fusion/abi/govtoken.abi) başvurun.  
> — BSC Yönetim Ekibi