---
title: Yönetim
description: Bu kılavuz, yönetimin temel operasyonlarına genel bir bakış sunarak öneri oluşturma, oy verme ve önerileri yürütme süreçlerini detaylandırmaktadır. BSC ekosistemindeki merkeziyetsiz karar verme sürecini anlamak için önemli bilgiler sunulmaktadır.
keywords: [yönetim, BSC, öneri oluşturma, oy verme, merkeziyetsiz karar verme, akıllı sözleşmeler, GovToken]
---

# Yönetim

Bu kılavuz, öneri oluşturma, oy verme ve önerileri yürütme dahil olmak üzere yönetimin temel operasyonlarına genel bir bakış sunar. Yönetimin genel tanıtımı için lütfen `Yönetim Mekanizması` sayfasına bakın.

## Sözleşme

BSC yönetimi, **BSC ekosisteminde merkeziyetsiz karar verme sürecini** kolaylaştırır ve bunu iki temel akıllı sözleşme ile gerçekleştirir: `GovToken` yönetim tokenlerinin yönetimi için ve `Governor` öneri yönetimi ve oylama için.

- `GovToken`: Yönetim tokenlerini yönetir ve sahiplerinin yönetim kararlarına katılmasını sağlar. Stake edilmiş varlıklarla token bakiyelerinin senkronizasyonunu ve oy verme haklarının devredilmesini destekler. 
  > **Adres:** `0x0000000000000000000000000000000000002005`

- `Governor`: Yönetim önerilerinin oluşturulması, oylanması ve yürütülmesini yönetir. Ayrıca yalnızca uygun katılımcıların değişiklik önermesini ve oy vermesini sağlar. 
  > **Adres:** `0x0000000000000000000000000000000000002004`

## Öneri Oluşturma

Bir öneri oluşturmak için `Governor`'ın `propose` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory
    description) public returns (uint256 proposalId)
```

- `targets`: Önerinin etkileşime geçeceği sözleşme adresleri.
- `values`: Her çağrı için BNB değerleri (wei cinsinden).
- `calldatas`: Kodlanmış fonksiyon çağrıları.
- `description`: Önerinin açıklaması.

## Oy Verme

:::tip
Oylama sürecinde, oy vermeden önce önerinin tüm detaylarını dikkatlice okumanız önemlidir.
:::

Bir oy vermek için `Governor`'ın `castVote` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function castVote(uint256 proposalId, uint8 support, string memory reason) public returns (uint256)
```

- `proposalId`: Önerinin ID'si.
- `support`: Oy tercihi (örneğin, lehte, aleyhte, çekimser).
- `reason`: (Opsiyonel) Oyunuzun nedeni.

## Öneri Durumunu Kontrol Etme

Bir önerinin durumunu almak için `Governor`'ın `state` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function state(uint256 proposalId) public view returns (ProposalState)
```

- `proposalId`: Önerinin ID'si.

## Öneriyi Kuyruğa Alma

Öneriyi yürütme için zamanlaması için `Governor`'ın `queue` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function queue(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
public returns (uint256 proposalId)
```

- `targets`: Önerinin etkileşime geçeceği sözleşme adresleri.
- `values`: Her çağrı için Ether değerleri (wei cinsinden).
- `calldatas`: Kodlanmış fonksiyon çağrıları.
- `descriptionHash`: Önerinin açıklamasının hash'i.

## Öneriyi Yürütme

Zaman kilidi gecikmesinden sonra değişiklikleri uygulamak için `Governor`'ın `execute` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

```solidity
function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
public payable returns (uint256)
```

- `targets`: Önerinin etkileşime geçeceği sözleşme adresleri.
- `values`: Her çağrı için Ether değerleri (wei cinsinden).
- `calldatas`: Kodlanmış fonksiyon çağrıları.
- `descriptionHash`: Önerinin açıklamasının hash'i.

## Oy Delege Etme

Oylama gücünü birine devretmek için `GovToken`'ın `delegateVote` fonksiyonunu aşağıdaki parametrelerle çağırmanız gerekir:

- **Delegatör adresi**: Oylama gücünü başka bir adrese devreden delegatörün adresi.
- **Delegeli adresi**: Delegatöründen oylama gücünü alan ve onun adına yönetime katılan delegeli.

```solidity
function delegateVote(address delegator, address delegatee) external
```

- `delegator`: Oylama gücünü başka bir adrese devreden delegatörün adresi.
- `delegatee`: Delegatöründen oylama gücünü alan delegeli.

## Sözleşme ABI

:::info
`Governor`'ın tam arayüzleri için lütfen [ABI dosyasına](https://github.com/bnb-chain/bsc-genesis-contract/blob/bc-fusion/abi/Governor.abi) bakın.
:::

:::info
`GovToken`'ın tam arayüzleri için lütfen [ABI dosyasına](https://github.com/bnb-chain/bsc-genesis-contract/blob/bc-fusion/abi/govtoken.abi) bakın.
:::