---
date: 2024-04-25T00:00:00Z
difficulty: beginner
title: İşlemleri otomatik onaylama
seoTitle: Solana'da işlemleri nasıl otomatik onaylarsınız
description:
  İşlemleri otomatik onaylayarak dApp'ler ve oyunlar, daha akıcı bir
  kullanıcı deneyimi oluşturabilir. Bu, özellikle zincir üzerindeki oyunlar
  için ilginçtir.
tags:
  - oyunlar
  - cüzdanlar
  - işlemler
  - unity
keywords:
  - eğitim
  - otomatik onayla
  - işlemler
  - blok zinciri geliştiricisi
  - blok zinciri eğitimi
  - web3 geliştiricisi
---

İşlemleri otomatik onaylamak, kullanıcının her işlemi manuel olarak onaylaması
gerekmediği anlamına gelir. Bu, özellikle akıcı bir oyun deneyimi sağlamak
isteyen zincir üzerindeki oyunlar için kullanışlıdır. Bunu sağlamanın bazı
yolları şunlardır:

## Cüzdan Otomatik Onay

:::tip
Bazı popüler Solana cüzdan uygulamaları, içinde **"otomatik onay"** işlemi
fonksiyonu barındırmaktadır.
:::

Bazıları bunu yanıcı cüzdanlarla gerçekleştirir. Bu oldukça pratik bir çözümdür, ancak oyuncularınızı bu cüzdanlardan birini kullanmakla sınırlayabilir. 

:::warning
Oyuncular bu özelliği etkinleştirmeye de karşı çıkabilir, çünkü bu bir güvenlik riski olarak görülebilir.
:::

- [Solflare otomatik onay](https://twitter.com/solflare_wallet/status/1625950688709644324)
- [Phantom otomatik onay](https://phantom.app/learn/blog/auto-confirm)

## Yerel Anahtar Çifti

İşlem otomatik onaylama için başka bir yol, oyun/dApp'inizde bir anahtar çifti
oluşturmak ve oyuncunun bu cüzdana biraz SOL transfer etmesine izin vermek ve
sonrasında işlem ücretlerini ödemek için kullanmaktır. Bunun tek sorunu,
bu cüzdanın güvenliğini sağlamanız gerektiğidir ve kullanıcılar tarayıcı
önbelleklerini temizlerse anahtarlar kaybolabilir.

:::note
İşte yerel anahtar çiftlerini kullanarak işlem otomatik onaylamayı nasıl
uygulayacağınıza dair bazı örnek kaynak kodları:
:::

- [Örnek Kaynak Kodu](https://github.com/solana-developers/solana-game-examples/blob/main/seven-seas/unity/Assets/SolPlay/Scripts/Services/WalletHolderService.cs)
- [Örnek Oyun Yedi Denizler](https://solplay.de/sevenseas/)

## Sunucu Arka Ucu

Oyun veya dApp'iniz için bir sunucu arka ucu kullanarak, arka uç
sistemini, `Solana ücretlerini` kendiniz ödemenizi
sağlayacak şekilde yapılandırabilirsiniz. Bu arka uç, kullanıcı adına işlem
oluşturup imzalamanıza olanak tanır, güvenli arka uç anahtar çiftinizi
`ücret ödeyici` olarak işaretler ve uygulamanızın bununla bir API
son noktasından etkileşimde bulunmasını sağlar.

:::info
Bunu başarmak için, istemci uygulamanız (yani oyun veya dApp) arka uç
sunucunuza parametreler gönderecektir.
:::

Arka uç sunucusu bu isteği doğrulayacak ve kullanıcının gerekli verileri ile bir işlem oluşturacaktır. Arka uç, bu işlemi imzalayıp Solana blok zincirine gönderecek, işlemin
başarılı olduğunu doğrulayacak ve istemciye bir onay mesajı
gönderecektir.

:::tip
Bu sunucu arka ucu yöntemi, kolay ve pratik bir çözümdür; ancak kullanıcının
kimliğini doğrulama ve güvenliğini sağlama işini üstlenmeniz gerekir.
:::

Bu, uygulamanızın altyapısına ve mimarisine karmaşıklık katabilir.

## Oturum Anahtarları

Oturum Anahtarları, Solana programlarınızda katmanlı erişim için ince
ayar yapılmış program/kapsam ile geçici (kısa ömürlü) anahtar çiftleridir.
Kullanıcıların, geçici bir anahtar çifti kullanarak yerel olarak işlem
imzalayarak uygulamalarla etkileşimde bulunmalarını sağlar. Geçici anahtar
çifti, belirli bir süre boyunca erişim sağlayan bir oauth belirteci
gibi çalışır.

:::note
Oturum anahtarları, gerçekten harika bir kullanıcı deneyimi sunar, ancak
onları zincir üzerindeki programda uygulamak için biraz ekstra çalışma
gerekir.
:::

`session-keys` crate'ini [Magic Block](https://www.magicblock.gg/)
tarafından bakılarak [resmi belgelerine](https://docs.magicblock.gg/Onboarding/Session%20Keys/integrating-sessions-in-your-program) göz atabilirsiniz.

## Gölge İmzacı

Gölge imzacı, işlemleri imzalamanıza olanak tanıyan
[Honeycomb Protokolü](https://twitter.com/honeycomb_prtcl) içindeki bir
özelliktir.

:::info
- [Gölge İmzacı nasıl çalışır](https://twitter.com/honeycomb_prtcl/status/1777807635795919038)
- [Belgeler](https://docs.honeycombprotocol.com/services/)
:::
