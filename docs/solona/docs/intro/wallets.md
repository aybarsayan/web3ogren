---
sidebarLabel: Cüzdanlar
title: Solana Cüzdan Rehberi
sidebarSortOrder: 3
---

Bu belge, Solana kullanıcılarının SOL tokenlerini Solana blok zincirinde gönderebilmesi, alabilmesi ve etkileşimde bulunabilmesi için mevcut farklı cüzdan seçeneklerini tanımlamaktadır.

## Cüzdan Nedir?

Bir kripto cüzdan, bir dizi anahtarı depolayan bir cihaz veya uygulamadır ve kripto paraları göndermek, almak ve sahipliği takip etmek için kullanılabilir. Cüzdanlar birçok biçimde olabilir. Bir cüzdan, bilgisayar dosya sisteminizde bir dizin veya dosya, bir parça kağıt veya _donanım cüzdanı_ olarak adlandırılan özel bir cihaz olabilir. Ayrıca cüzdanları oluşturmak ve yönetmek için kullanıcı dostu yollar sunan çeşitli akıllı telefon uygulamaları ve bilgisayar programları da mevcuttur.

### Anahtar Çifti

Bir `_anahtar çifti_`, güvenli bir şekilde üretilmiş 
`_gizli anahtar_` ve onun kriptografik olarak türetilmiş 
`_açık anahtarı_`dır. Bir gizli anahtar ve ona karşılık gelen açık anahtar birlikte _anahtar çifti_ olarak bilinir. Bir cüzdan, bir veya daha fazla anahtar çiftinin bir koleksiyonunu içerir ve onlarla etkileşimde bulunmanın bazı yollarını sağlar.

### Açık Anahtar

`_Açık anahtar_` (genellikle _pubkey_ olarak kısaltılır) cüzdanın _alma adresi_ veya kısaca _adresidir_. Cüzdan adresi **serbestçe paylaşılabilir ve görüntülenebilir**. Başka bir taraf, bir miktar kripto parayı bir cüzdana gönderecekse, cüzdanın alma adresini bilmesi gerekir. Bir blok zincirinin uygulamasına bağlı olarak, adres ayrıca cüzdanla ilgili belirli bilgileri görüntülemek için de kullanılabilir, örneğin bakiyeyi görüntülemek, ancak cüzdan hakkında hiçbir şeyi değiştirme veya herhangi bir tokeni çekme yeteneğine sahip değildir.

### Gizli Anahtar

:::warning
`_Gizli anahtar_` (aynı zamanda _özel anahtar_ olarak da adlandırılır), kripto paraları başka bir adrese göndermek veya cüzdan üzerinde herhangi bir değişiklik yapmak için herhangi bir işlemi dijital olarak imzalamak için gereklidir. **Gizli anahtar asla paylaşılmamalıdır.**
:::

Eğer birisi bir cüzdanın gizli anahtarına erişim kazanırsa, içerdiği tüm tokenleri çekebilir. Eğer bir cüzdanın gizli anahtarı kaybolursa, o cüzdanın adresine gönderilen herhangi bir token **kalıcı olarak kaybolur**.

## Güvenlik

Farklı cüzdan çözümleri, anahtar çifti güvenliği, anahtar çifti ile etkileşim kurma ve tokenleri kullanmak/harcamak için işlemleri imzalama konusunda farklı yaklaşımlar sunar. Bazıları diğerlerinden daha kullanışlıdır. Bazıları gizli anahtarları daha güvenli bir şekilde depolar ve yedekler. Solana, güvenlik ve kullanım kolaylığı arasında doğru dengeyi seçebilmeniz için birden fazla cüzdan türünü destekler.

> **Eğer Solana blok zincirinde SOL tokenleri almak istiyorsanız, önce bir cüzdan oluşturmanız gerekecektir.**  
> — Solana Cüzdan Rehberi

## Desteklenen Cüzdanlar

Birçok tarayıcı ve mobil uygulama cüzdanı Solana’yı desteklemektedir. Sizin için uygun olabilecek bazı seçenekleri [Solana Cüzdanlar](https://solana.com/wallets) sayfasında bulabilirsiniz.


Gelişmiş Kullanıcılar İçin İpuçları

Gelişmiş kullanıcılar veya geliştiriciler için, 
[komut satırı cüzdanları](https://docs.solanalabs.com/cli/wallets) daha uygun olabilir; çünkü Solana blok zincirindeki yeni özellikler her zaman önce komut satırında desteklenir, daha sonra üçüncü parti çözümlere entegre edilir.

