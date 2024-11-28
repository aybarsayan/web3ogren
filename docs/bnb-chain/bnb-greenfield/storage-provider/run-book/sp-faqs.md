---
title: SP SSSS - BNB Greenfield SP
description: Depolama Sağlayıcısı hakkında sıkça sorulan sorular listesi. Bu belgede, BNB Greenfield Depolama Sağlayıcısı gereksinimleri, ödül alma yöntemleri ve kapasite limitleri hakkında bilgi bulabilirsiniz.
keywords: [BNB Greenfield Depolama Sağlayıcısı, BNB Greenfield Depolama Sağlayıcısı Gereksinimleri, SP Ödülleri, Depolama Fiyat Güncellemeleri, Güvenilir SP]
---

### Greenfield Depolama Sağlayıcısı için gereksinimler nelerdir?

Depolama Sağlayıcıları (SP) aşağıdaki gereksinimleri karşılamalıdır:

* **Teminat:**
	* Her SP adayı **500 BNB** teminat yatırmalıdır.
	* SP, Ana SP olarak depolanan verilerin depolama ücretlerinin %200'ü oranında daha fazla veri depolamak için ek fonlar yatırmalıdır; bu, 0.023 * 1024 * 2 = $47.104/TB değerindedir.

* `Donanım gereksinimleri`

---

### SP ödüllerini nasıl alır?

SP, `Settlement Transaction` gönderildikten sonra ödüllerini `funding address` adresinde alacaktır.

---

### Depolama fiyatını ve okuma fiyatını ne zaman güncellemeli?

Her SP, on-chain işlemler aracılığıyla kendi önerilen depolama fiyatını ve okuma fiyatını belirleyebilir. Komut göndermeyi `buradan` okuyabilirsiniz.

:::info
Bazı [kısıtlamalar](https://github.com/bnb-chain/greenfield/blob/master/docs/modules/billing-and-payment.md#storage-fee-price-and-adjustment):
* **Ne zaman güncellenir:** Global oranlar, varsayılan olarak her ayın ilk bloğunda (UTC zamanı) hesaplanıp güncellenir.
* **Ne zaman güncellenmez:** Varsayılan olarak, SP'ler mevcut ayın son iki gününde fiyatlarını güncelleyemez.
:::

---

### SP'nin sağlamak istediği alan ile ne kadar BNB yatırması gerekiyor?

SP, kullanıcı verilerini depolamak için ek fonlar yatırmalıdır. Formula şu şekildedir: `storage_staking_price * stored_size` ve fiyat şu anda **160000 wei/byte**'dır; bu bilgiyi [bu API'den](https://greenfield-chain.bnbchain.org/openapi#/Query/VirtualGroupParams) alabilirsiniz.

---

### Depolama Sağlayıcısı kapasitesinin limiti nedir?

Her VGF, sınırlı sayıda kovaya hizmet eder. 

> Depolama boyutu belirli bir eşiği aşarsa, sistem daha fazla kova hizmet etmesine izin vermez. — VGF sınırları

* VGF sayısında bir sınırlama yoktur, ancak her VGF'nin maksimum boyutu **64T**'dir.

---

### Güvenilir bir SP nasıl olunmalıdır?

1. SP'nizin bu [standart testi](https://github.com/bnb-chain/greenfield-sp-standard-test) geçtiğinden emin olun.
2. Altyapınız çalışmıyorsa, SP'nizi `maintenance mode` olarak geri döndürün. Ardından, ikincil SP'lerden kaybolan verileri yedekleyin.