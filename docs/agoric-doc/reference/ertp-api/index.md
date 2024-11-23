---
title: ERTP API
---

# ERTP API

ERTP API, aşağıdaki nesneleri destekler:

| Nesne              | Açıklama                                                                 |
| -------------------| ------------------------------------------------------------------------ |
|  | Kendi türünde dijital varlıkların sahibi olan yetkili.                   |
|      | Yeni dijital varlıklar üretebilir.                                       |
|    | İlgili **Issuer** ve **Mint**'in varlık türünü tanımlar.                |
|    | Dijital varlıkları saklar.                                               |
| | Taşınmakta olan dijital varlıkları tutar.                               |

ETRP API, aşağıdaki kütüphaneyi kullanır:

| Nesne                         | Açıklama                                                                                                                         |
| ------------------------------| ------------------------------------------------------------------------------------------------------------------------------- |
|   | **AmountMath** nesnesinin, ****'ları manipüle etmek ve analiz etmek için kullanılabilecek birkaç metodu vardır. |

ERTP API, aşağıdaki veri türlerini tanıtır ve kullanır:

| Veri Türü                                   | Açıklama                                                                                                                                                     |
| --------------------------------------------| ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|           | Dijital varlıkların nasıl tanımlandığını açıklar ve varlıkların sayısı ile ****'ını belirtir. **Amounts** hem fungible hem de non-fungible varlıkları tanımlayabilir. |
| | Dijital varlıkların özelliklerini ve ****'ını belirtir.                                                                                    |
| | Bir şeyin ne kadar olduğunu tanımlar.                                                                                                                    |
|     | Bir **Amount**'ın fungible mı yoksa non-fungible mı olduğunu belirtir.                                                                                   |
| | Bir **Brand**'in **Amounts**'larını nasıl görüntüleneceğini belirtir.                                                                                     |