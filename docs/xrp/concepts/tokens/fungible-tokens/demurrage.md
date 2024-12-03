---
title: Demurrage
seoTitle: Demurrage Currency Feature in XRP Ledger
sidebar_position: 4
description: Bu sayfada demurrageın ne olduğu, XRP Ledgerdaki işlevselliği ve hesaplama yöntemleri hakkında bilgi verilmektedir.
tags: 
  - demurrage
  - XRP Ledger
  - finansal uygulama
  - para birimi kodu
  - teknik terimler
keywords: 
  - demurrage
  - XRP Ledger
  - finansal uygulama
  - para birimi kodu
---
  
# Demurrage

:::dangerDemurrage, desteklenmeyen bir özelliktir. Bu sayfa, eski XRP Ledger yazılımlarının tarihsel davranışını tanımlamaktadır.:::

> Demurrage, tutulan varlıklar üzerinde negatif bir faiz oranıdır ve bu, bu varlıkları tutmanın maliyetini temsil eder.  
> — Wikipedia

[Demurrage](http://en.wikipedia.org/wiki/Demurrage_%28currency%29) kullanarak, bir token üzerindeki demurrage'ı temsil etmek için, demurrage oranını belirten özel bir `para birimi kodu` kullanarak takibini yapabilirsiniz. Bu, etkili olarak her bir farklı demurrage miktarı için token'ın ayrı sürümlerini oluşturur. İstemci uygulamaları, demurraging para birimi kodunu yıllık yüzde oranı ile birlikte para birimi kodu olarak temsil ederek bunu destekleyebilir. Örneğin: "XAU (-0.5%pa)".

## Demurraging Token Miktarlarını Temsil Etmek

Tüm XRP Ledger miktarlarını sürekli güncellemeyi yerine, bu yaklaşım, faiz getiren veya demurraging token'larını iki tür miktara ayırır: 

- **"Defter değerleri"**: Para biriminin belirli bir noktadaki değerini temsil eder; **1 Ocak 2000 gece yarısı "Ripple Epoch"udur**.
- **"Gösterim değerleri"**: Ripple Epoch'tan o zamana kadar sürekli faiz veya demurrage hesaplandıktan sonra belirli bir zamanda (genellikle mevcut zaman) gösterilen miktarı temsil eder.

admonition type="success" name="İpucuDemurrage'ı, etkilenen tüm varlıkların değerinin zamanla azaldığı enflasyona benzer şekilde düşünebilirsiniz, ancak defter her zaman 2000 yılı değerlerinde miktarları tutar. Bu, gerçek dünyadaki enflasyonu göstermez; demurrage, sabit bir oranda hipotetik bir enflasyona daha yakındır.:::

Bu nedenle, istemci yazılımı iki dönüşümü uygulamalıdır:

1. Belirli bir zamanda gösterim değerlerini alıp bunları kaydedilmesi gereken defter değerlerine dönüştürmek.
2. Defter değerlerini alıp bunları belirli bir zamanda gösterim değerine dönüştürmek.

---

### Demurrage Hesaplama

Demurrage hesaplamak için tam formül şöyledir:

```
D = A × ( e ^ (t ÷ τ) )
```

- **D**: Demurrage sonrası miktar
- **A**: Global defterde kaydedilen demurrage öncesi miktar
- **e**: Euler sayısıdır
- **t**: Ripple Epoch'tan (1 Ocak 2000 UTC, 00:00) itibaren geçen saniye sayısıdır
- **τ**: Saniyedeki e-katlama zamanıdır. Bu değer, `istenilen faiz oranından hesaplanır`. 

Gösterim miktarları ile defter miktarları arasında geçiş yapmak için aşağıdaki adımları takip edebilirsiniz:

1. `( e ^ (t ÷ τ) )` değerini hesaplayın. Bu sayıyı "demurrage katsayısı" olarak adlandırıyoruz. "Demurrage katsayısı" her zaman belirli bir zamana, örneğin mevcut zamana göre ilişkilidir.
2. Bunu dönüştürmek için miktara uygulayın:
   - Defter değerlerini gösterim değerlerine dönüştürmek için demurrage katsayısı ile çarpın.
   - Gösterim değerlerini defter değerlerine dönüştürmek için demurrage katsayısına bölün.
3. Gerekirse, istenen hassasiyete göre sonuç değerini ayarlayın. Defter değerleri, XRP Ledger'ın `token formatına` göre 15 ondalık basamak hassasiyeti ile sınırlıdır.

---

## Faiz Getiren Para Birimi Kodu Formatı

`Standart para birimi kodu formatını` kullanmak yerine, pozitif faize veya negatif faize (demurrage) sahip token'lar aşağıdaki formatta 160-bit para birimi kodu kullanır:


1. İlk 8 bit `0x01` olmalıdır.
2. Sonraki 24 bit, 3 ASCII karakterini temsil eder. Bunun bir ISO 4217 kodu olması beklenir. Standart formatın ASCII karakterleri ile aynı karakterleri destekler.
3. Sonraki 24 bit tamamen `0` olmalıdır.
4. Sonraki 64 bit, para biriminin faiz oranıdır, "[e-katlama zamanı](http://en.wikipedia.org/wiki/E-folding)" olarak IEEE 754 çift formatında temsil edilir.
5. Son 24 bit ayrılmıştır ve tamamen `0` olmalıdır.

### E-Katlama Zamanını Hesaplama

Defter miktarları ile gösterim miktarları arasında geçiş yapmak veya faiz getiren/demurraging bir para birimi için bir para birimi kodu hesaplamak için, faiz oranını "e-katlama zamanı" olarak almanız gerekir. E-katlama zamanı, bir miktarın _e_ (Euler sayısı) çarpanıyla artması için geçen süredir. Geleneksel olarak, e-katlama zamanı formüllerde **τ** harfi ile yazılır.

Verilen bir yıllık yüzde faiz oranı için e-katlama zamanını hesaplamak için:

1. Faiz oranını %100'e ekleyin; böylece yıllık faiz uygulandığında başlangıç miktarının ne kadarının kaldığını gösteren yüzdeyi elde edin. Demurrage için negatif bir faiz oranı kullanın. Örneğin, %0.5 demurrage, -%0.5 faiz oranı ile sonuçlanacak ve **%99.5** kalır.
2. Yüzdeyi ondalık olarak temsil edin. Örneğin, %99.5 **0.995** olur.
3. O sayının doğal logaritmasını alın. Örneğin, **ln(0.995) = -0.005012541823544286**. (Bu sayı, başlangıç faiz oranı pozitifse pozitif, negatifse negatiftir.)
4. Bir yıldaki saniye sayısını (31536000) alın ve bir önceki adımdaki doğal logaritma sonucuyla bölün. Örneğin, **31536000 ÷ -0.005012541823544286 = -6291418827.045599**. Bu sonuç, saniye cinsinden e-katlama zamanıdır.

:::info Geleneksel olarak, XRP Ledger'in faiz/demurrage kuralları, artık yıl veya ek saniyeler için düzeltilmeyen sabit bir yıl içindeki saniye sayısını (31536000) kullanmaktadır.:::

---

## İstemci Desteği

Faiz getiren ve demurraging token'ları desteklemek için, istemci uygulamaları birkaç özelliği uygulamalıdır:

- Defter veya işlem verilerinden elde edilen bir demurraging token miktarını gösterirken, istemcinin defter değerinden gösterim değerine dönüştürmesi gerekir. (Demurrage ile, gösterim değerleri defter değerlerinden daha küçüktür.)

- Demurraging token için giriş alırken, istemcinin miktarları gösterim formatından defter formatına dönüştürmesi gerekir. (Demurrage ile, defter değerleri kullanıcı giriş miktarından daha büyüktür.) İstemci, ödemeler, teklifleri ve diğer işlem türleri oluştururken defter değerini kullanmalıdır.

- İstemciler, faiz veya demurrage olan token'lar ile olmayanlar arasında ayırım yapmalı ve farklı faiz veya demurrage oranlarına sahip token'lar arasında ayırım yapmalıdır. İstemciler, `Faiz Getiren Para Birimi Kodu Formatını` "XAU (-0.5% pa)" gibi bir gösterim formatına ayrıştırabilmelidir.

---

### ripple-lib Desteği

Demurrage, ripple-lib sürümleri **0.7.37** ile **0.12.9** arasında desteklenmiştir. Demurrage, çoğu modern kütüphanede ***desteklenmemektedir***.

Aşağıdaki kod örnekleri, karşılık gelen ripple-lib sürümlerini defter değerleri ile gösterim değerleri arasında dönüştürmek için nasıl kullanacağınızı göstermektedir. Ayrıca [Ripple Demurrage Hesaplayıcısını](https://ripple.github.io/ripple-demurrage-tool/) de görebilirsiniz.

Gösterim değerinden defter değerine dönüştürmek için `Amount.from_human()` kullanın:

```js
// Demurraging para biriminin gösterim miktarı için bir Amount nesnesi oluşturun
// ve mevcut tarihi temsil eden bir reference_date geçirin
// (bu durumda, 2017-11-04T00:07:50Z'de 0.5% yıllık demurrage ile 10 XAU defter değeri.)
var demAmount = ripple.Amount.from_human('10 0158415500000000C1F76FF6ECB0BAC600000000',
                                  {reference_date:563069270});

// Vericiyi ayarlayın
demAmount.set_issuer("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");

// Defter miktarı için JSON formatını alın
console.log(demAmount.to_json());

// { "value": "10.93625123082769",
//   "currency": "0158415500000000C1F76FF6ECB0BAC600000000",
//   "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" }
```

Defter değerinden gösterim değerine dönüştürmek için:

```js
// Defter değeri ile bir Amount nesnesi oluşturun,
ledgerAmount = ripple.Amount.from_json({
  "currency": "015841551A748AD2C1F76FF6ECB0CCCD00000000",
  "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "value": "10.93625123082769"})

// Mevcut zamana kadar faizi uygulayarak gösterim miktarını elde edin
var displayAmount = demAmount.applyInterest(new Date());

console.log(displayAmount.to_json());

// { "value": "9.999998874657716",
//   "currency": "0158415500000000C1F76FF6ECB0BAC600000000",
//   "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" }
```