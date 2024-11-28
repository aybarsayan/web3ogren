---
description: Bu belge, BNB Zinciri'nin token dolaşım modelini ve çapraz zincir likidite sorunlarını onarma yöntemlerini tanıtmaktadır. Ayrıca, tokenlerin BSC üzerinde yeterli likiditeyle nasıl yönetileceği hakkında bilgiler sunulmaktadır.
keywords: [çapraz zincir, likidite kontrolü, token yönetimi, BNB Zinciri, DAI token]
---

# Çapraz Zincir Likidite Kontrolü ve Onarımı

Token bağlama işleminin ardından, tokenler BC ve BSC arasında sorunsuz bir şekilde transfer edilebilir. Ancak, bazı uygunsuz işlemler sonunda çapraz zincir transfer hatalarına yol açabilir. Örneğin, bir zincirde mint işlemi gerçekleştirilip diğerinde gerçekleştirilmediğinde, iki zincirde farklı arzlar oluşabilir, bu da daha yüksek toplam arzı olan zincirden diğer zincire tüm varlıkların transfer edilmesini imkansız hale getirir.

:::info
Bu belge, BNB Zinciri'nin token dolaşım modelini ve çapraz zincir likidite sorunlarını nasıl onaracağımızı tanıtacaktır. BC Fusion öncesinde tüm token ihraççılarını likidite kontrollerini ve onarımlarını tamamlamaya davet ediyoruz, ancak bu makale BC Fusion sonrasında da geçerliliğini korumaktadır.
:::

## Dolaşım Modeli

![img](../../images/bnb-chain/assets/bcfusion/circulation.png)

Çapraz zincir iletişiminin yapısı yukarıdaki şemada gösterilmektedir. Çapraz zincir transferi, iki blok zinciri arasındaki ana iletişimdir. Temelde mantık şu şekildedir:

1. Transfer yapılan blok zinciri, kaynak sahibi adreslerinden belirli bir miktarı sistem kontrollü adreslere/kontratlara kilitleyecektir.
2. Transfer alınan blok zinciri, sistem kontrollü adreslerden/kontratlardan belirli bir miktarı serbest bırakacak ve hedef adreslere gönderecektir.

BNB Beacon Chain üzerindeki sistem kontrollü kasa, kod tarafından üretilen [bnb1v8vkkymvhe2sf7gd2092ujc6hweta38xadu2pj](https://explorer.bnbchain.org/address/bnb1v8vkkymvhe2sf7gd2092ujc6hweta38xadu2pj) olup, BNB Smart Chain üzerindeki kasa ise [Token Hub](https://bscscan.com/address/0x0000000000000000000000000000000000001004) adı verilen bir sistem akıllı sözleşmesidir. Bu iki adresteki fonlar, dolaşım arzının bir parçası olmayan kilitlenmiş olarak kabul edilmektedir.

---

## Likidite Kontrolü ve Onarımı

BC Fusion'un hedeflerinden biri, tüm tokenleri Beacon Chain'den BSC'ye transfer etmektir. Bu nedenle, BSC üzerinde yeterli likidite sağlamak zorundayız; bu, BSC'nin Tokenhub'ında kilitlenmiş toplam token miktarının Beacon Chain üzerindeki dolaşım arzından (Csupply) fazla olması anlamına gelir.

:::tip
DAI tokenini örnek olarak alalım:
:::

1. Beacon Chain gezgininde DAI'nin temel bilgilere ait sayfasını ziyaret ederek Beacon Chain üzerindeki dolaşım arzını (Csupply) ve BSC üzerindeki sözleşme adresini edin.
   ![img](../../images/bnb-chain/assets/bcfusion/dai-token.png)
2. BSC gezginini ziyaret ederek bu tokenin kilitli miktarını/likiditesini kontrol edin. URL şu şekildedir: https://bscscan.com/token/${BSC_contract_address}?a=0x0000000000000000000000000000000000001004. 
   ${BSC sözleşme adresini} adım 1'de elde ettiğiniz BSC sözleşme adresi ile değiştirin. Aşağıdaki gibi bakiyeyi göreceksiniz:
   ![img](../../images/bnb-chain/assets/bcfusion/dai-onbsc.png)

Bu nedenle, BSC'deki Tokenhub hala 1,999,973.28 - 1.755760127949865335 = 1,999,971.5242398721 DAI'ye ihtiyaç duymaktadır. Hassasiyet kaybından kaynaklanan sorunları önlemek için, hesaplanan değerden biraz daha fazla likidite eklemeyi öneriyoruz. Bu durumda, 1,999,972 DAI olması gerekir. Eğer BSC'deki kilitlenmiş token miktarı Beacon Chain üzerindeki dolaşım arzından (Csupply) fazla ise, bu yeterli likidite olduğu anlamına gelir ve başka bir işlem yapılmasına gerek yoktur.

Eğer bir likidite sıkıntısı varsa, tokenin ihraççısı eksik likiditeyi Tokenhub'a aktarmalıdır, örneğin, yukarıda bahsedilen DAI tokeni için 1,999,972 DAI. Bu tokenlerin kaynağı, ihraççının belirlemesine bağlıdır: bunlar mint edilebilir veya çeşitli hesaplardan toplanabilir.