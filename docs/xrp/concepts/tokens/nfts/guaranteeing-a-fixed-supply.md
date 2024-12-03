---
title: NFTlerin Sabit Arzını Garantileme
seoTitle: Garantili NFT Mintleme Yöntemi
sidebar_position: 4
description: Yeni bir hesap kullanarak sabit sayıda NFT mintlemek için adım adım yönergeleri takip edin ve ardından hesabı karanlık delik haline getirerek güvenliğinizi artırın.
tags: 
  - NFT
  - sabit arz
  - mintleme
  - ihraççı
  - cüzdan
  - yetkilendirme
keywords: 
  - NFT
  - sabit arz
  - mintleme
  - ihraççı
  - cüzdan
  - yetkilendirme
---

# NFT'lerin Sabit Arzını Garantileme

Bazı projeler için, bir ihraç hesabından mintlenen NFT sayısının belirli bir sayıyı aşmadığını garanti etmek isteyebilirsiniz.

Sabit bir NFT sayısını garantilemek için:

1. **Yeni bir hesap oluşturun** ve fonlayın, *İhraççı*. Bu hesap, koleksiyon içindeki tokenlerin ihraççısıdır. `Hesap Oluşturma` bölümüne bakın.
2. `AccountSet` kullanarak operasyonel cüzdanınızı **ihraç için yetkili bir mintleyici** olarak atayın. `Başka Bir Hesabı NFT'lerinizi Mintlemek İçin Yetkilendirme` bölümüne bakın.
3. Tokenleri mintlemek için operasyonel hesabınızı `NFTokenMint` kullanarak kullanın. Operasyonel cüzdan, İhraççı için mintlenen tüm tokenleri tutar. `Toplu Mintleme` bölümüne bakın.
4. `AccountSet` kullanarak operasyonel cüzdanınızı **İhraççı için yetkili mintleyici** olarak kaldırın.
5. **İhraççı hesabını "karanlık delik" haline getirin**. `Anahtar Çifti Yönetimini Devre Dışı Bırakma` bölümüne bakın.

---

Bu noktada, ihraç hesabı olarak ihraççının adresiyle yeni tokenlerin mintlenmesi imkansızdır.

:::tip
Hesabınızı "karanlık delik" haline getirmek, güvenliğinizi artırmak için önemli bir adımdır. Bu işlemi gerçekleştirmeden önce tüm tokenlerinizi doğru bir şekilde mintlediğinizden emin olun.
:::

:::warning
Hesabı "karanlık delik" haline getirdiğinizde, NFT'lerin gelecekteki satışları için kimse, siz de dahil, transfer ücretleri almaz.
:::