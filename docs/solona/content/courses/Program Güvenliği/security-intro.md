---
title: Program Güvenliği Kursuna Yaklaşım
objectives:
  - Program Güvenliği Kursuna nasıl yaklaşılacağını anlamak
description:
  "Onchain programlarınız için güvenlik konusuna akıllıca yaklaşmayı öğrenin,
  ister Anchor, ister Native Rust ile geliştirin."
---

## Genel Bakış

Bu kurs, Solana geliştirme sürecine özgü yaygın güvenlik açıklarının bir dizi tanıtımını amaçlamaktadır. Bu kursu Coral’ın
[Sealevel Attacks](https://github.com/coral-xyz/sealevel-attacks) deposuna yoğun bir şekilde modelledik.

Program güvenliği, Mainnet'e program dağıtan herkesin en azından temel bir
güvenlik anlayışına sahip olmasını sağlamak için
`Anchor` ve
`Native Rust` geliştirme
kurslarımızda ele alınmaktadır. Bu kurslar, bazı yaygın
Solana açıklarından kaçınmanıza yardımcı olmalıdır.

:::tip
Bu kurs, program güvenliğini öğrenmenin mükemmel bir yoludur!
:::

Bu kurs, bu kursların üstüne iki ana hedef ile inşa edilmiştir:

1. Solana programlama modeline dair farkındalığınızı artırmak ve güvenlik
   açıklarını kapatmak için odaklanmanız gereken alanları vurgulamak.
2. Programlarınızı güvenli tutmanıza yardımcı olmak için Anchor tarafından sağlanan
   araçlarla tanıştırmak ve kendi başlarına benzer teknikleri nasıl uygulayacaklarını
   göstermek için native Rust kullanıcılarını bilgilendirmek.

> Bu kursun ilk birkaç dersi, `Anchor kursu` veya
> `Program Güvenliği dersi`
> `Native Kurs` içindeki konulara benzer konuları işlemektedir.
> — Eğitmen

:::info
İlerledikçe yeni tür saldırılarla karşılaşacaksınız. Hepsini keşfetmenizi
teşvik ediyoruz.
:::


Diğer Bilgiler

Her bir güvenlik açığı "basit" gibi görünse de, tartışacak çok şey var. Bu dersler, tartışılan güvenlik risklerini anlamanızı
sağlamak için daha az anlatım ve daha fazla kod içermektedir.
  


Her zamanki gibi, geri bildirimlerinizi bekliyoruz. Kursu incelerken bol şans!

---