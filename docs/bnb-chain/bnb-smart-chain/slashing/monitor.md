---
title: İzleme - BSC Slash
description: Bu sayfa, BSC validatörlerinin nasıl izlendiğini ve potansiyel slashing durumları hakkında bilgi sağlar. Hapis cezasından kurtulma süreci ve en iyi izleme yöntemleri hakkında önemli notlar içerir.
keywords: [BSC, validatör izleme, slashing, hapis cezası, BNB Staking]
---

# BSC Slash İzleyicisi

## Slash İzleme

Genel olarak, kötü niyetle BSC node kodunu değiştirmeden veya yanlışlıkla validatörü çalıştırmadan, **validatörler** genellikle çift imza slash veya kötü niyetli oy slash'ı yaşamazlar.

:::note
**Dikkat**: Validatörlerin, node'un geçici olarak kullanılamaması nedeniyle potansiyel slash'ları sürekli izlemeleri gerekir, çünkü bu slash olaylarına yol açabilir.
:::

En iyi uygulama olarak, BSC tarayıcısındaki slash sözleşmesinin olay günlüğünü izlemeye devam etmek önerilir [BSC Scan Slash Sözleşmesi](https://bscscan.com/address/0x0000000000000000000000000000000000001001#events).

Yukarıdaki sözleşmede validatörünüzün slash göstergesini kontrol edebilirsiniz. **30'un üzerindeki değerlere dikkat edin.** **50'yi aşarsa**, validatör slashed olur. **150'yi aşarsa**, validatör hapsedilir.

---

## Hapis Cezasından Kurtarma

Bir validatör **hapiste** kaldığında, hapis cezasından kurtulabilmek için belirli bir süre beklemesi gerekmektedir. Bekleme süresi dolduktan sonra, validatör BNB Staking dApp'ine erişebilir ve `unjail` butonuna tıklayarak unjail işlemini başlatabilir.

![](../../images/bnb-chain/bnb-smart-chain/img/slashing/slash01.png){:style="width:800px"}

:::tip
**Hızlı İpucu**: Validatörlerin hapis cezasına düşmemek için, sürekli olarak slash göstergelerini izlemeleri en iyi uygulamadır.
:::

**BNB Staking dApp:**

- **Testnet**: [https://testnet-staking.bnbchain.org/en/bnb-staking](https://testnet-staking.bnbchain.org/en/bnb-staking)
- **Mainnet**: [https://www.bnbchain.org/en/bnb-staking](https://www.bnbchain.org/en/bnb-staking)