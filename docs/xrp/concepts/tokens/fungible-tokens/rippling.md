---
title: Rippling
seoTitle: XRP Ledger Rippling İşleyiş ve Önem
sidebar_position: 4
description: Rippling, XRP Ledgerda birden fazla taraf arasında otomatik fon aktarım sürecini tanımlar. Bu sistem, token sahiplerinin doğrudan birbirlerine fon transferi yapmalarını sağlar.
tags: 
  - Rippling
  - XRP Ledger
  - güven hatları
  - No Ripple
  - Default Ripple
  - tokenlar
  - ödemeler
keywords: 
  - Rippling
  - XRP Ledger
  - güven hatları
  - No Ripple
  - Default Ripple
  - tokenlar
  - ödemeler
---
# Rippling

XRP Ledger'da **rippling**, aynı token için `güven hatları` olan birden fazla bağlı taraf arasında atomik net hesaplaşma sürecini tanımlar. **Rippling**, token sahiplerine, herhangi bir émir katılımı olmadan birbirlerine doğrudan fon aktarımında bulunmalarını sağladığı için hayati öneme sahiptir. Bir anlamda, rippling, iki farklı émirden gelen ancak aynı para birimi koduna sahip iki token için sınırsız ve 1:1 döviz kuru ile bir pasif, iki yönlü `takas emri` gibidir.

Rippling sadece bir ödemenin `yollarında` gerçekleşir. `Doğrudan XRP'den XRP'ye ödemeler` rippling içermemektedir.

:::warning
Emir vermeyen hesaplar için rippling istenmeyen bir durum olabilir, çünkü bu, diğer kullanıcıların aynı para birimi koduna sahip ancak farklı émirlerden gelen tokenlar arasında yükümlülükleri kaydırmasına izin verir. `No Ripple Flag`, diğerlerinin hesabınıza güven hatları açması durumunda varsayılan olarak rippling'i devre dışı bırakır, aksi takdirde `Default Ripple flag` kullanarak varsayılan rippling'i etkinleştirebilirsiniz.
:::

## Rippling Örneği

"Rippling", birden fazla güven hattının bir ödeme yapmak için ayarlandığı durumlarda gerçekleşir. Örneğin, Alice'in Charlie'ye para borcu varsa ve Alice'in Bob'a da para borcu varsa, XRP Ledger'da bu durumu güven hatları aracılığıyla şu şekilde temsil edebilirsiniz:



Eğer Bob Charlie'ye 3 $ ödemek isterse, "Alice, bana olan borcunun 3 $’ını al ve bunu Charlie'ye öde." diyebilir. Alice, Bob'tan Charlie'ye olan borcunun bir kısmını aktarır. En sonunda güven hatları şöyle çalışır:



İki adresin birbirine ödeme yaptığı ve arasında güven hatlarının dengelerini ayarladığı bu sürece "rippling" diyoruz. Bu, XRP Ledger'ın faydalı ve önemli bir özelliğidir. Rippling, adreslerin aynı para birimi kodunu kullanan güven hatları ile bağlantılı olduğunda gerçekleşir. Emir veren aynı olmak zorunda değildir: aslında, daha büyük zincirler her zaman değişen emirler içerir.

## No Ripple Flag

Emir vermeyen hesaplar, özellikle farklı ücret ve politikaları olan farklı emirlerden bakiye bulunduran likidite sağlayıcıları, genellikle bakiyelerinin rippling yapmasını istemezler.

**No Ripple** bayrağı, bir güven hattındaki bir ayardır. İki güven hattı da aynı adres tarafından No Ripple etkinleştirildiğinde, üçüncü taraflardan gelen ödemeler, o güven hatlarında o adresten rippling yapamaz. Bu, likidite sağlayıcılarını aynı para birimi kodunu kullanan farklı emirler arasında beklenmedik bir şekilde bakiyelerin kaymasının önlenmesini sağlar.

:::info
Bir hesap, tek bir güven hattında No Ripple'ı devre dışı bırakabilir, bu da o güven hattının dahil olduğu herhangi bir çift üzerinden rippling'e izin verebilir. Hesap ayrıca `Default Ripple flag` aracılığıyla varsayılan olarak rippling'i etkinleştirebilir.
:::

Örneğin, Emily'nin iki farklı finansal kuruluştan çıkan parası olduğunu hayal edin, şu şekilde:



Artık Charlie, Emily'nin adresi üzerinden Daniel'e ödeme yapabilir. Örneğin, eğer Charlie Daniel'e 10 $ öderse:


Bu durumu bilmeyen Emily'yi şaşırtabilir, daha da kötüsü, eğer Kurum A, parasını çekmek için Emily'den daha yüksek ücretler talep ediyorsa, bu Emily'ye para kaybına neden olabilir. **No Ripple** bayrağı, bu durumu önlemek için mevcuttur. Eğer Emily bu durumu her iki güven hattında da ayarlarsa, o güven hatları aracılığıyla ödemelerin onun adresinden rippling yapması mümkün değildir.

Örneğin:



Artık Charlie'nin, Emily'nin adresinden rippling yaparak Daniel'e ödeme yapması mümkün değildir.

### Özellikler

No Ripple bayrağı, belirli yolları geçersiz kılar, böylece bunların ödemeler yapmak için kullanılamaz. Bir yol, yalnızca o adreste No Ripple etkinleştirildiğinde bir adres düğümüne girdiğinde **ve** çıktığında geçersiz kabul edilir.



## Default Ripple Flag

**Default Ripple** bayrağı, tüm _gelen_ güven hatları üzerinde varsayılan olarak rippling'i etkinleştiren bir hesap ayarıdır. Emir verenler, müşterilerinin birbirine token gönderebilmesi için bu bayrağı etkinleştirmelidir.

Hesabınızın Default Ripple ayarı, sizin oluşturduğunuz güven hatlarını etkilemez; yalnızca başkalarının sizinle açtığı güven hatlarını etkiler. Hesabınızın Default Ripple ayarını değiştirirseniz, değişiklikten önce yaratılan güven hatları mevcut No Ripple ayarlarını korur. Güven hattının No Ripple ayarını, adresinizin yeni varsayılanını yansıtacak şekilde değiştirmek için bir [TrustSet transaction][] kullanabilirsiniz.

## No Ripple Kullanımı

### No Ripple'ı Etkinleştirme / Devre Dışı Bırakma

No Ripple bayrağı, yalnızca güven hattında adresin pozitif veya sıfır bakiyesi olduğunda etkinleştirilebilir. Bu, özelliğin, güven hattı bakiyesinin temsil ettiği yükümlülüğü ihlal etmesini önlemek içindir. (Elbette, adresi terk ederek iptal edebilirsiniz.)

No Ripple bayrağını etkinleştirmek için, `tfSetNoRipple` bayrağı ile bir [TrustSet transaction][] gönderin. No Ripple bayrağını devre dışı bırakmak (yani, rippling'e izin vermek) için `tfClearNoRipple` bayrağını kullanabilirsiniz.

### No Ripple Durumunu Kontrol Etme

Karşılıklı olarak birbirine güvenen iki hesap durumunda, No Ripple bayrağı her hesap için ayrı olarak takip edilir.

`HTTP / WebSocket API'leri` veya tercih ettiğiniz `istemci kütüphanesini` kullanarak, [account_lines method][] ile güven hatlarını kontrol edin. Her güven hatında, `no_ripple` alanı mevcut adresin o güven hattında No Ripple bayrağını etkinleştirip etkinleştirmediğini gösterir ve `no_ripple_peer` alanı, karşı tarafın No Ripple bayrağını etkinleştirip etkinleştirmediğini gösterir.

## Ayrıca Bakınız

- **Kavramlar:**
    - `Yollar`
- **Eğitimler:**
    - `Stablecoin Émiri`
- **Referanslar:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - `AccountRoot Flags`
    - `RippleState (güven hattı) Bayrakları`

