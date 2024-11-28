---
description: TimeLock yönetimi, kullanıcıların varlıklarını belirli bir süre boyunca kilitleyerek güvenli bir şekilde saklamalarına olanak tanır. Bu doküman, TimeLock'ların nasıl oluşturulacağını ve yönetileceğini ayrıntılı bir şekilde açıklar.
keywords: [TimeLock, varlık yönetimi, BSC, BEP9, blok zinciri, timelock API, sunset hardfork]
---

# TimeLock Yönetimi

Bir **timelock**, kullanıcıların varlıklarını belirli bir süre boyunca kilitlemelerine olanak tanıyan bir özelliktir. Bu özellik [BEP9](https://github.com/bnb-chain/BEPs/blob/master/BEPs/BEP9.md) dokümanında tanıtılmıştır. BC birleşimi için, [ikinci sunset hardfork](https://github.com/bnb-chain/bEPs/pull/333) sırasında, tüm timelocklar kullanıcıların hesaplarına iade edilecektir. Kullanıcılar, iadeleri aldıktan sonra bu varlıkları BSC'ye aktarmak için proaktif olarak harekete geçmelidir.

## TimeLocks Sorgulama

Zaten mevcut olan timelockları sorgulamak için bir time lock API'si sağlanmaktadır. Genellikle, kullanıcılar ilgili timelockları sorgulamak için bir "from" adresi verebilirler, örneğin:

[https://dex.bnbchain.org/api/v1/timelocks/bnb1rmet5j5pwc3xvhd82rwdjkvewzgmreh6we72sf](https://dex.bnbchain.org/api/v1/timelocks/bnb1rmet5j5pwc3xvhd82rwdjkvewzgmreh6we72sf)

![img](../../images/bnb-chain/assets/bcfusion/user-timelock1.png)

Yanıt, timelock'un kimliği, timelock varlığı ve kilidin açılma zamanı gibi pek çok yararlı bilgiyi içerecektir.

:::tip
Timelock'ların durumunu düzenli olarak kontrol etmek, kullanıcıların varlıklarını güvenli bir şekilde yönetmelerine yardımcı olur.
:::

## TimeLocks Yönetimi

Timelock oluşturulduktan sonra, sahipler varlıklarına erişemezler, kilidin açılma zamanı geçene kadar. [İkinci sunset hardfork](https://github.com/bnb-chain/bEPs/pull/333) sırasında, tüm mevcut timelocklar otomatik olarak yaratıcıların hesaplarına iade edilecektir. 

> **Önemli Not:** İade, blok zincirinde kaç timelock'un hala mevcut olduğuna bağlı olarak birçok Beacon Chain bloğu içinde gerçekleştirilecektir.  
> — Zamanlama ve durum takibi yapmak önemlidir.

İade işleminden sonra, kullanıcılar varlıklarını hesaplarında bulabilmelidir. Daha sonra kullanıcılar, varlıkları diğer BEP2/BEP8 tokenleri gibi yönetebilirler. 

:::info
Bunu BNB Akıllı Zinciri'ne nasıl aktaracağınız için lütfen `bu eğitime` başvurun.
:::