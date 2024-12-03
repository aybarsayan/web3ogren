---
title: Transfer Ücretleri
seoTitle: Transfer Ücretleri - Token İhraççıları ve Maliyeti
sidebar_position: 4
description: Token ihraççıları, tokenlerinin transferi için bir ücret talep edebilir. Transfer ücretleri, gönderici ve alıcı arasında bir ödeme yapılırken hesaplanan bir maliyettir.
tags: 
  - transfer ücretleri
  - token
  - XRP
  - maliyet
  - hesap
  - ihraççı
  - kullanıcı
keywords: 
  - transfer ücretleri
  - token
  - XRP
  - maliyet
  - hesap
  - ihraççı
  - kullanıcı
---

# Transfer Ücretleri

`Token` ihraççıları, kullanıcıların bu tokenleri birbirleri arasında transfer ettiği durumlarda uygulanan bir _transfer ücreti_ talep edebilir. Transferin göndereni, transfer ücreti üzerinden ekstra bir yüzde kesintisi yapılırken, transferin alıcısına belirtilen miktar kredi olarak eklenir. Fark, transfer ücretidir.

:::info
Standart tokenlerde, transfer ücreti olarak ödenen tokenler **yakılır** ve XRP Genel Defteri'nde daha fazla takip edilmez.
:::

Token, dış varlıklarla destekleniyorsa, bu durum, ihraççının XRP Genel Defteri'ndeki yükümlülüklerini karşılamak için tutması gereken varlık miktarını azaltır. **Transfer ücretleri**, dış varlıklarla desteklenmeyen tokenler için genellikle uygun değildir.

Fungible olmayan tokenler de transfer ücretine sahip olabilir, ancak bunlar farklı çalışır. Detaylar için 
Fungible Olmayan Tokenler
`Fungible Olmayan Tokenler` sayfasına bakınız.


Transfer ücreti, ihraç edilen hesaba _doğrudan_ gönderme veya alma durumunda uygulanmaz, ancak bir `işletme adresi` üzerinden başka bir kullanıcıya transfer yapılırken uygulanır.

**XRP** hiçbir zaman transfer ücreti almaz, çünkü hiç ihraççısı yoktur.

## Örnek

Bu örnekte, ACME Bank, XRP Genel Defteri üzerinde bir EUR stabilcoin ihraç etmektedir. ACME Bank, transfer ücretini %1 olarak belirleyebilir. *Bir ödemenin alıcısının 2 EUR.ACME alabilmesi için, gönderenin 2.02 EUR.ACME göndermesi gerekir.* İşlemden sonra ACME'nin XRP Genel Defteri'ndeki bekleyen yükümlülükleri 0.02€ azalmış olur, bu da ACME'nin EUR stabilcoinini destekleyen banka hesabında o miktarı tutması gerekmediği anlamına gelir.

Aşağıdaki diyagram, Alice'den Charlie'ye %1 transfer ücreti ile 2 EUR.ACME ödeme işlemini göstermektedir:


Muhasebe terimleriyle, Alice'in, ACME'nin ve Charlie'nin bilanço durumu şöyle değişebilir:


## Transfer Ücretleri Ödeme Yollarında

İki taraf arasında herhangi bir transfer gerçekleştirildiğinde transfer ücreti uygulanır (doğrudan ihraç edilen hesaba gişelerde geçerli değildir). Daha karmaşık işlemlerde bu birden fazla kez gerçekleşebilir. Transfer ücretleri, en son noktadan başlayarak geri doğru uygulandığından, nihayetinde bir ödemenin göndereninin tüm ücretleri karşılayacak kadar göndermesi gerekir. Örneğin:


Bu senaryoda, Salazar (gönderen) ACME tarafından ihraç edilmiş EUR tutmaktadır ve Rosa'ya (alıcı) WayGate tarafından ihraç edilmiş 100 USD teslim etmek istemektedir. FXMaker, emir defterinde en iyi teklifi veren bir tüccardır ve her 0.9 EUR.ACME için 1 USD.WayGate oranındadır. *Transfer ücretleri olmasaydı, Salazar 100 USD göndermek için 90 EUR gönderebilir.* Ancak, ACME %1 transfer ücreti alırken, WayGate %0.2 transfer ücreti alır. Bu şunları ifade eder:

* FXMaker, Rosa'nın 100 USD.WayGate alabilmesi için **100.20 USD.WayGate** göndermelidir.
* FXMaker'ın mevcut isteği, **100.20 USD.WayGate** göndermek için 90.18 EUR.ACME'dir.
* FXMaker'ın **90.18 EUR.ACME** alabilmesi için, Salazar'ın **91.0818 EUR.ACME** göndermesi gerekir.

# Teknik Detaylar

Transfer ücreti, ihraççının hesabındaki bir ayar ile kontrol edilir. Transfer ücreti %0'dan az olamaz veya %100'den fazla olamaz ve en yakın 0.0000001% olarak aşağıya yuvarlanır. Transfer ücreti, aynı hesap tarafından ihraç edilen tüm tokenler için geçerlidir. Farklı tokenler için farklı transfer ücretleri istiyorsanız, **birden fazla ihraç adresi** kullanın.

Transfer ücreti, alıcının aynı tokenin 1 milyar birimini alabilmesi için göndermesi gereken miktarı temsil eden bir integer olarak `TransferRate` alanında belirtilir. `TransferRate` değeri `1005000000` olan bir transfer ücreti, %0.5 transfer ücreti ile eşdeğerdir. Varsayılan olarak, `TransferRate` ücreti olmayan bir duruma ayarlanmıştır. `TransferRate` değeri, `1000000000`'den ("%0" ücreti) az veya `2000000000`'den fazla ("%100" ücreti) olamaz. **`0`** değeri ise, hiçbir ücretin olmadığı özel bir durumdur ve `1000000000`'e eşdeğerdir.

:::tip
Bir token ihraççısı, tüm tokenleri için `TransferRate`'i değiştirmek amacıyla bir [AccountSet işlemi][] gönderebilir.
:::

Herkes, [account_info yöntemi][] ile bir hesabın `TransferRate` değerini kontrol edebilir. `TransferRate` değeri atlanırsa, bu, ücret olmadığı anlamına gelir.

:::warning
Defterde, mevcut maksimumdan daha büyük bir transfer ücreti olan hesaplar bulunabilir. `fix1201 değişikliği`, 2017-11-14'te etkinleştirildiğinde, maksimum transfer ücretini %100 (yani `TransferRate` değeri `2000000000`) olarak %329'dan aşağıya düşürdü. Önceden belirlenen transfer ücretleri devam eden oranlarıyla uygulanmaya devam etmektedir.
:::

## Client Kütüphanesi Desteği

Bazı `istemci kütüphaneleri`, `TransferRate` işlevlerini alma ve ayarlama için kolaylık sağlıyor.

**JavaScript:** Yüzde transfer ücretini bir dize olarak alıp karşılık gelen `TransferRate` değerine dönüştürmek için `xrpl.percentToTransferRate()` kullanın.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Ücretler (Açıklama)`
    - `İşlem Maliyeti`
    - `Yollar`
- **Referanslar:**
    - [account_lines yöntemi][]
    - [account_info yöntemi][]
    - [AccountSet işlemi][]
    - `AccountRoot Bayrakları`

