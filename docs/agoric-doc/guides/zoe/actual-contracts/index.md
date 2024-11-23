---
title: Dağıtılan Zoe Sözleşmeleri
---

# Dağıtılan Zoe Sözleşmeleri

 ana ağ-1B sürümünde, zincir aşağıdaki Zoe sözleşmelerini otomatik olarak dağıtacak şekilde yapılandırılmıştır.  genel bir tanım sunmaktadır.

| Sözleşme            | Açıklama                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| centralSupply       | Cosmos x/bank modülünden bildirilen arz doğrultusunda vbank IST cüzdan bakiyesini başlatmak için kullanılır.                                                         |
| mintHolder          | BLD için mintleri ve ATOM, USDC ve USDT gibi zincirler arası varlıkları tutmak için kullanılır.                                                                         |
| committee           | Inter Protocol parametrelerini yöneten Ekonomik Komiteyi temsil eder.                                                                                                 |
| binaryVoteCounter   | Bir komitenin oylama yaptığı her soru için bir kez oluşturulur.                                                                                                       |
| econCommitteeCharter| Ekonomik komiteye hangi soruların sunulabileceğini kontrol eder.                                                                                                      |
| contractGovernor    | Her yönetilen sözleşme, yöneticisini başlatarak başlatılır.                                                                                                          |
|         | Parity Stability Module (PSM), onaylı dış stabil tokenler karşılığında Inter Stable Tokens (IST) verimli bir şekilde mintlemek ve yakmak için destek sağlar.        |
| vaultFactory        | Kullanıcıların ATOM gibi teminatlarla desteklenen IST mintlemesine olanak tanır; teminattaki değer belirlenen bir eşik değerinin altına düştüğünde, vaultları açık artırmacıya devreder. |
| auctioneer          | Likide edilmiş vaultlardan teminat açık artırması yapar.                                                                                                             |
| fluxAggregator      | Bir , oracle operatörlerinden fiyatları toplar.                                                                                    |
| scaledPriceAuthority| Oracle operatörlerinden idealize edilmiş "oracle ATOM" fiyatları açısından işlem yapılabilir varlıklar için fiyat sağlar.                                           |
| feeDistributor      | Inter Protocol sözleşmelerinden ücret toplar ve bunları rezerv ve/veya stake edenlere dağıtır.                                                                        |
| assetReserve        | IST'yi desteklemek için rezervde varlık bulundurur.                                                                                                                  |
| walletFactory       | Kullanıcılar adına Zoe tekliflerini yürütür.                                                                                                                         |

## Dağıtılan Vat Hizmetleri

Diğer hizmetler, sözleşme olmayan vatlarda çalışmaktadır.

| vat               | hizmetler                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------- |
| bootstrap         | İlk vat. Ayrıca  çalıştırır.                    |
| vatAdmin          | Vatları oluşturur,  ve sonlandırır.                |
| agoricNames       | `agoricNames`                              |
| bank              | Cosmos denomsunu ERTP Markaları/İhracatçıları/Mintler ile bağlar.                          |
| board             | `board`                                    |
| bridge            | chainStorage vb.                                                                            |
| priceAuthority    |  kaydeder ve fiyat teklifi taleplerini yönlendirir.  |
| provisioning      | `namesByAddress`                          |
| timer             | `chainTimerService`                                                                         |
| zoe               | Zoe Servisi                                                                                 |