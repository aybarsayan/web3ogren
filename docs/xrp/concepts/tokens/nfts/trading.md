---
title: NFT Ticareti
seoTitle: NFT Ticareti Rehberi
sidebar_position: 4
description: NFTlerin doğrudan veya aracılı olarak ticareti. Bu içerikte, NFTlerin nasıl satın alınacağı, satılacağı ve teklifler oluşturulacağı detaylı bir şekilde açıklanmaktadır.
tags: 
  - NFT
  - ticaret
  - alım satım
  - satış teklifleri
  - aracılı satış
keywords: 
  - NFT
  - ticaret
  - alım satım
  - satış teklifleri
  - aracılı satış
---

# NFT Ticareti

XRP Genel Defteri üzerinde NFT'leri hesaplar arasında transfer edebilirsiniz. Bir NFT'yi satın almak veya satmak için teklif verebilir veya sahip olduğunuz bir NFT'yi satın almak için diğer hesaplardan gelen teklifleri kabul edebilirsiniz. Hatta bir NFT'yi 0 fiyat belirleyerek hediye edebilirsiniz. Tüm teklifler, [NFTokenCreateOffer transaction][] kullanılarak oluşturulmaktadır.

:::info
Eklenmiştir [NonFungibleTokensV1_1 amendment][] ile.
:::

## Rezerv Gereksinimleri

Her `NFTokenOffer` nesnesi, hesabınızın sahiplik rezervini artırmasını gerektirir; bu da şu anda her `NFTokenSellOffer` için 2 XRP ve her `NFTokenBuyOffer` için 2 XRP'dir. Bu, hesapların tamamlamayı amaçlamadıkları tekliflerle defteri spam yapmalarını önlemek içindir.

`NFT Rezerv Gereksinimleri` sayfasına bakınız.

---

## Satış Teklifleri

### Bir Satış Teklifi Oluşturun

Bir NFT'nin sahibi olarak, `tfSellToken` bayrağı ile bir [NFTokenCreateOffer transaction][] kullanarak bir satış teklifi oluşturabilirsiniz. `NFTokenID` ve ödemede kabul etmek istediğiniz `Amount` değerini sağlarsınız. Ayrıca, teklifin geçerli olmayacağı bir `Expiration` tarihi belirtebilir ve NFT'yi satın alabilecek tek hesap olan bir `Destination` hesabı belirtebilirsiniz.

### Bir Satış Teklifini Kabul Etme

Satışa sunulan bir NFT'yi satın almak için `NFTokenAcceptOffer` transaction'ını kullanabilirsiniz. Sahip hesap bilgilerini sağlamakla birlikte, kabul etmek istediğiniz `NFTokenOffer` nesnesinin `NFTokenOfferID`'sini belirtirsiniz.

---

## Alım Teklifleri

### Bir Alım Teklifi Oluşturun

Herhangi bir hesap bir NFT'yi satın almak için teklif verebilir. `tfSellToken` bayrağını *kullanmayarak* bir alım teklifi oluşturabilirsiniz. `Owner` hesabını, `NFTokenID`'yi ve teklifinizin `Amount`'sını sağlamalısınız.

### Bir Alım Teklifini Kabul Etme

Bir NFT'yi transfer etmek için `NFTokenAcceptOffer` transaction'ını kullanın. İşlemi tamamlamak için `NFTokenOfferID`'yi ve sahip hesabını belirtin.

---

## Ticaret Modları

Bir NFT ticareti yaparken, alıcı ve satıcı arasında *doğrudan* bir işlem veya bir üçüncü taraf hesabın bir satış ve alım teklifini eşleştirdiği *aracılı* bir işlem arasında seçim yapabilirsiniz.

> Doğrudan ticaret yapıldığında, satıcı transfer üzerinde kontrol sahibidir. — NFT Ticareti Notları

Aracılı modda, satıcı bir üçüncü taraf hesabının NFT'nin satışını aracılık etmesine izin verir. Aracı hesap, transfer için anlaşılan bir oran üzerinden bir aracı ücreti toplar. Bu, aracı ve satıcıya alıcının fonlarından ödeme yapılarak tek bir işlem olarak gerçekleşir ve aracıdan ön ödeme talep edilmez.

---

### Aracılı Modu Ne Zaman Kullanmalısınız

Bir NFT yaratıcısı doğru alıcıları bulmak için zaman ve sabır harcıyorsa, yaratıcı satıştan elde edilen tüm geliri alır. Bu, az sayıda NFT'yi değişken fiyatlarla satan bir yaratıcı için uygundur.

Öte yandan, yaratıcılar yaratma sürecine zaman ayırabilecekleri durumda, yarattıkları eserleri satmak için zaman harcamak istemeyebilirler. Her bir satışı yönetmek yerine, satış işi bir üçüncü taraf aracı hesabına devredilebilir.

#### Aracı Kullanmanın Avantajları

* Aracı, NFT'nin satış fiyatını artırmak için çalışan bir temsilci olarak hareket edebilir.
* Aracı, bir niş pazar, fiyat aralığı veya diğer kriterlere göre NFT'leri organize eden bir küratör olarak hareket edebilir.
* Aracı, uygulama katmanında ihale sürecini yönetmek için Opensea.io'ya benzer bir pazar yeri olarak hareket edebilir.

---

### Aracılı Satış İş Akışları

En basit iş akışında, bir yaratıcı yeni bir NFT'yi basar. Yaratıcı, minimum kabul edilebilir satış fiyatını girerek bir satış teklifi başlatır ve aracıyı hedef olarak ayarlar. Potansiyel alıcılar NFT için teklifler verirler ve teklifi aracıya yönlendirirler. Aracı, kazanan teklifi seçer ve işlemi tamamlayarak bir aracı ücreti alır. En iyi uygulama olarak, aracı daha sonra NFT için kalan herhangi bir alım teklifini iptal eder.



Başka bir olası iş akışı, yaratıcının satış üzerinde daha fazla kontrol sahibi olmasını sağlar. Bu iş akışında, yaratıcı yeni bir NFT'yi basar. Teklif verenler, aracıyı hedef olarak belirleyerek teklifler oluştururlar. Aracı, kazanan teklifi seçer, aracı ücretini çıkarır ve `NFTokenCreateOffer` kullanarak yaratıcının teklifi onaylamasını talep eder. Yaratıcı, talep edilen teklifi onaylayarak aracıyı hedef olarak ayarlar. Aracı, `NFTokenAcceptOffer` kullanarak satışı tamamlar ve aracı ücretini saklar. Aracı, `NFTokenCancelOffer` kullanarak NFT için kalan tüm teklifleri iptal eder.



Aynı iş akışları, bir sahibi başka bir hesap tarafından yaratılan bir NFT'yi yeniden sattığında da kullanılabilir.

