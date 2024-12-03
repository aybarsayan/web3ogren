---
title: NFT Müzayedesi Düzenleme
seoTitle: NFT Müzayedesi Düzenleme Yöntemleri ve Avantajları
sidebar_position: 4
description: NFTleri sizin adınıza mintlemek için başka bir hesap atayabilirsiniz. Bu içerik, NFT müzayedesi düzenleme yöntemlerini ve her birinin avantajlarını ve dezavantajlarını detaylı bir şekilde ele almaktadır.
tags: 
  - NFT
  - müzayede
  - XRPL
  - NFToken
  - aracılı satış
  - blok zinciri
keywords: 
  - NFT
  - müzayede
  - XRPL
  - NFToken
  - aracılı satış
  - blok zinciri
---

## NFT Müzayedesi Düzenleme

Müzayede düzenlemenin birçok yolu vardır, her birinin avantajları ve dezavantajları bulunur.

## Müzayedeyi XRPL Dışında Yapın, Satın Alma İşlemine XRPL Üzerinden Devam Edin

Bu akış en basit olanıdır. ***`NFTokenOffer`*** nesnelerinin her zaman yaratıcısı tarafından iptal edilebileceğini unutmayın; dolayısıyla bağlayıcı bir teklif uygulamak mümkün değildir.

1. Tekliflerinizi özel bir veritabanında saklayın.
2. Kazanan tekliften bir pay alırsınız.
3. Alıcıya/satıcılara satın alma işlemini tamamlamak için XRPL işlemini gönderin.

## Müzayedeyi Aracılı Modda, Satış Fiyatı ile Yapın

Müzayedeyi aracılı modda, bir satış fiyatı ile düzenleyin.


1. Satıcı NFT'yi oluşturur, ardından ***`NFTokenCreateOffer`*** kullanarak müzayede satış fiyatını belirler ve aracıyı alıcı olarak belirler.
2. Teklif sahipleri ***`NFTokenCreateOffer`*** kullanarak teklif verir, aracıyı alıcı olarak belirler.
3. Aracı, kazanan teklifi seçer, ***`NFTokenAcceptOffer`*** kullanarak satışı tamamlar ve aracı ücretini toplar. Ardından aracı, kaybeden teklifleri ***`NFTokenCancelOffer`*** kullanarak iptal eder.

:::tip
Tüm müzayede işlemlerinin XRPL üzerinde gerçekleşmesi, aracı ücretinizin de dahil olduğu anlamına gelir.
:::

**Avantajlar:**

- **Tüm müzayede XRPL üzerinde gerçekleşir**, aracı ücretiniz de dahil.
- Satıcı, satış fiyatını zincir üzerinde temsil eder.
- Bu, alım tarafı açısından bağlayıcı bir teklife _yakın_ dır.

**Dezavantajlar:**

- *Satıcı ile aracı arasında, aracının daha önce anlaşılmış bir orandan fazlasını almayacağına dair sözel bir güven olmalıdır.* Eğer satış fiyatı 1 XRP ise ve kazanan teklif 1000 XRP ise, aracının 999 XRP'yi kar olarak almasını engelleyecek zincir üzerinde bir mekanizma yoktur; bu durumda satıcı yalnızca satış fiyatındaki karı alır.

Bu dezavantajın önemli bir giderici faktörü, **bu davranış olursa**, brokerlerin pazar paylarının tamamını kaybedecek olmalarıdır; bu nedenle satıcılar bunu anlamalıdır.

## Müzayedeyi Aracılı Modda, Satış Fiyatı Olmadan Yapın.

Bu, üç akışın en karmaşık olanıdır.



1. Satıcı, ***`NFTokenMint`*** kullanarak bir NFT oluşturur.
2. Teklif sahipleri, aracıyı alıcı olarak belirleyerek ***`NFTokenCreateOffer`*** kullanarak teklif verir.
3. Aracı, kazanan teklifi seçer, alınacak ücret miktarını düşer ve ardından satıcıdan bu miktar için satış teklifi imzalamasını ***`NFTokenCreateOffer`*** aracılığıyla talep eder.
4. Satıcı, belirtilen teklifi imzalar, aracıyı alıcı olarak belirler.
5. Aracı, ***`NFTokenAcceptOffer`*** kullanarak satışı tamamlar ve aracı ücretini alır.
6. Aracı, kalan teklifleri ***`NFTokenCancelOffer`*** kullanarak iptal eder.

:::info
Bu akış, katılımcılar arasında kesinlikle hiçbir güven gerektirmediğinden, herkesin blockchain'de beklediği seçenek olur.
:::

**Avantajlar:**

- **Satıcılar, aracının kendilerinden aldığı ücreti tam olarak bilirler** ve buna zincir üzerinde razı gelirler.

**Dezavantajlar:**

- Müzayede tamamlandıktan sonra, satış, satıcının son teklif miktarına ve aracı ücretine razı olmasına bağlıdır. Bu, satıcıların tamamlanmış bir müzayededen geri çekilebileceği veya dikkatlerinin dağılması veya bir bildirimi görmemeleri durumunda uzlaşmayı geciktirebileceği anlamına gelir.
- Müzayede tamamlandıktan sonra, bir satıcı kazanan teklifi reddedebilir, bunun yerine başkasına satabilir.