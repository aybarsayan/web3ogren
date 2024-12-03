---
title: Fungible Tokenler
seoTitle: Fungible Tokenler - XRP Ledger
sidebar_position: 4
description: Trust hatları ve mantığı hakkında bilgi edinin. Bu içerik, XRP Ledger üzerinde fungible tokenlerle ilgili trust hatlarını ve işleyişini açıklamaktadır.
tags: 
  - fungible tokenler
  - trust hatları
  - XRP Ledger
  - token yönetimi
  - finansal işlemler
keywords: 
  - fungible tokens
  - trust lines
  - XRP Ledger
  - token yönetimi
  - finansal işlemler
---

# Fungible Tokenler

Herkes XRP Ledger üzerinde, resmi olmayan "IOU"lardan fiat destekli stabilcoinlere, tamamen dijital fungible ve yarı fungible tokenlere kadar fungible tokenler çıkarabilir.

Fungible tokenler değiştirilebilir ve birbirlerinden ayırt edilemez. **Bunlar, eşdeğer değere sahip diğer tokenler ile değiştirilebilir ve yerine geçilebilir.** Fungible tokenler oluşturmak için iki hesap arasında bir _trust line_ (güven hattı) kurar ve ardından bu hesaplar arasında ödemeler gönderirsiniz. 

:::tip
Çoğu kullanım durumu için ilk önce yapılandırmanız gereken bazı ayarlar vardır.
:::

## Trust Hatları

Trust hatları, fungible `tokenleri` barındırmak için XRP Ledger'daki yapılardır. Trust hatları, başkasının istemediği bir tokeni tutmasını sağlamanın imkansız olduğu kuralını uygular. **Bu önlem, XRP Ledger'ın diğer faydaları arasında `topluluk kredisi` kullanım durumunu sağlaması için gereklidir.**

Her "trust line" (güven hattı), aşağıdakilerden oluşan iki yönlü bir ilişkidir:

- Trust hattını bağlayan iki `hesabın` kimlik bilgileri.
- Bir hesabın perspektifinden pozitif, diğerinin perspektifinden negatif olan tek bir, paylaşılan bakiye.
    - Negatif bakiyesi olan hesap genellikle tokenlerin "çıkarıcısı" olarak kabul edilir. Ancak, `API'lerde` `issuer` ismi her iki tarafı da ifade edebilir.
- Çeşitli ayarlar ve meta veriler. _Her_ iki hesapta da kendi trust line ayarlarını kontrol etme yetkisi vardır.
    - En önemlisi, her iki taraf da 0 olarak varsayılan bir trust line limiti belirler. **Her hesabın bakiyesi (trust line üzerindeki perspektifine göre) bu hesabın limitinin üzerine çıkamaz,** `hesabın kendi eylemleri üzerinden` dışında.

Her trust line, belirli bir `para birimi koduna` özeldir. **İki hesap arasında farklı para birimi kodları için istediğiniz kadar trust line olabilir, ancak belirli bir para birimi kodunda yalnızca bir ortak trust line olabilir.**

Bir trust line üzerindeki bakiye, hangi tarafın perspektifine göre bakıldığına bağlı olarak negatif veya pozitiftir. Negatif bakiyeye sahip taraf "çıkarıcı" olarak adlandırılır ve bu tokenlerin nasıl davrandığını kontrol edebilir. Eğer tokenleri başka bir hesaba gönderirseniz ve bu hesap çıkarıcı değilse, bu tokenler çıkarıcı ile aynı para birimi kodunu kullanan diğer hesaplar aracılığıyla "dalgalanır". **Bu bazı durumlarda faydalıdır, ancak diğerlerinde beklenmedik ve istenmeyen davrana yol açabilir.** 

:::warning
Bu nedenle, trust hatlarındaki `No Ripple flag` kullanarak bu hatların dalgalanmasını engelleyebilirsiniz.
:::

## Oluşum

Herhangi bir hesap, başka bir hesabın token çıkarabilmesi için bir [TrustSet işlemi][] göndererek, sıfır olmayan bir limit ve kendi ayarlarıyla "güven" oluşturabilir. **Bu, sıfır bakiyeli bir hat yaratır ve diğer tarafın ayarlarını varsayılan olarak ayarlar.**

Trust hatları, `merkeziyetsiz borsa` gibi bazı işlemler tarafından dolaylı olarak yaratılabilir. **Bu durumda, trust hatı tamamen varsayılan ayarları kullanır.**

## Limiti Aşma

Bir trust line üzerindeki limitinizi aşan bir bakiye tutabileceğiniz üç durum vardır:

1. Daha fazla token elde ettiğinizde `ticaret` yaparak.
2. Pozitif bakiyeye sahip bir trust line'ın limitini düşürdüğünüzde.
3. Daha fazla token elde ettiğinizde, `Çek` bozdurarak. (_[CheckCashMakesTrustLine amendment][] gereklidir_)

## Trust Line Ayarları

Paylaşılan bakiyenin yanı sıra, her hesabın trust line üzerindeki ayarları aşağıdakileri içerir:

- **Limit**, 0 ile `maksimum token miktarı` arasında bir sayı. **Ödemeler ve diğer hesapların eylemleri, trust line'ın bakiyesinin (bu hesabın perspektifine göre) limiti aşmasına sebep olamaz.** Varsayılan `0`'dır.
- **Yetkili**: Başka bir yanın, bu hesabın çıkardığı tokenleri tutmasına izin vermek için `Yetkili Trust Hatları` ile kullanılan bir doğru/yanlış değeri. Varsayılan `false`'dır. `true` olarak ayarlandıktan sonra geri değiştirilemez.
- **No Ripple**: Bu trust line'da tokenlerin `dalgalanmasına` izin verip vermeyeceğini kontrol etmek için kullanılan bir doğru/yanlış değeri. **Varsayılan, hesabın "Varsayılan Dalga" ayarına bağlıdır; yeni hesaplar için "Varsayılan Dalga" kapalıdır,** bu da No Ripple için varsayılanın `true` olduğu anlamına gelir.
- **Dondurma**: Bu trust line üzerinde bir `bireysel dondurma` etkin olduğu anlamına gelen bir doğru/yanlış değeri. Varsayılan `false`'dır.
- **Giriş Kalitesi** ve **Çıkış Kalitesi** ayarları, hesabın bu trust line üzerindeki diğer hesap tarafından çıkarılan tokenlere yüz değerlerinden daha az (veya daha fazla) bir değer biçmesine izin verir. **Örneğin, bir stabilcoin çıkarıcısı, ledger dışındaki varlıklar için token çekiminde %3 ücret alıyorsa, bu ayarları kullanarak o tokenleri yüz değerinin %97'si olarak değerlendirebilirsiniz.** Varsayılan `0`, yüz değerini temsil eder.

## Rezervler ve Silinme

Bir trust line, defterin alanını işgal ettiği için, `bir trust line hesabınızın ayrılmış XRP miktarını artırır`. Trust line'daki her iki hesap, trust line için rezerv ücreti ödeyebilir; değerlendirilme durumu rezervü etkilemektedir: **eğer ayarların herhangi biri varsayılan değilse veya pozitif bir bakiye tutuyorsanız, bu bir kalem olarak sahibin rezervlerine sayılır.**

Genellikle, trust line'ı oluşturmanın sorumluluğu, reserve tutmakla ilgili yükümlülük oluşturmaz ve **çıkarıcı bu rezerv için sorumluluk taşımaz.** 

Her iki tarafın ayarları varsayılan durumda ve bakiye sıfır olduğunda, trust hatları otomatik olarak silinir. **Bu, bir trust line'ı silmeniz gerektiğinde:**

1. Varsayılan ayarlarınızı ayarlamak için bir [TrustSet işlemi][] göndermelisiniz.
2. Trust line üzerindeki herhangi bir pozitif bakiyenizi aktarın. Bunu, bir `ödemeyi` göndererek veya `merkeziyetsiz borsa`'da parayı satarak yapabilirsiniz.

Eğer bakiyeniz negatifse (çıkarıcıysanız) veya diğer tarafın ayarları varsayılan durumda değilse, trust line'ın tamamen silinmesini sağlayamazsınız, ancak yine de aynı adımları izleyerek sahibin rezervlerinde gösterilmemesine neden olabilirsiniz.

**Yetkili** ayarı bir kez etkinleştirildiğinde, geri kapatılamayacağı için trust line'ın varsayılan durumuna katılmaz.

### Ücretsiz Trust Hatları
[[Kaynak]](https://github.com/XRPLF/rippled/blob/72377e7bf25c4eaee5174186d2db3c6b4210946f/src/ripple/app/tx/impl/SetTrust.cpp#L148-L168)

Trust hatları XRP Ledger'ın güçlü bir özelliği olduğundan, bir hesabın ilk iki trust line'ını "ücretsiz" hale getiren özel bir özellik vardır.

Bir hesap yeni bir trust line oluşturduğunda, **eğer hesap yeni hat dahil olmak üzere en fazla 2 nesneye sahipse, hesaba sahiplik rezervi normal miktarının sıfır olarak değerlendirilir.** Bu, işlemin, hesabın defterde nesne bulundurma gereksinimini karşılamak için yeterince XRP bulundurmasa bile başarılı olmasını sağlar.

Bir hesap, defterde 3 veya daha fazla nesneye sahipse, tam sahiplik rezervi geçerlidir.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Merkeziyetsiz Borsa`
    - `Dalgalanma`
- **Referanslar:**
    - [account_lines metodu][] - Belirli bir hesaba bağlı olan trust hatlarını sorgulama.
    - [gateway_balances metodu][] - Bir çıkarıcının toplam çıkarılan bakiyesini sorgulama.
    - `RippleState nesnesi` - Ledgerın durum verisindeki trust hatları için veri formatı.
    - [TrustSet işlemi][] - Trust hatlarını oluşturmak veya değiştirmek için kullanılan işlem.

