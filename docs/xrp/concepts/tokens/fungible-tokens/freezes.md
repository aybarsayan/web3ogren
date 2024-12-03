---
title: Tokenların Dondurulması
seoTitle: Tokenların Dondurulması - XRP Ledger
sidebar_position: 4
description: İhraççılar, uyum amaçları için ihraç ettikleri tokenları dondurabilirler. Bu içerik, tokenların dondurulması ile ilgili çeşitli ayarları ve uygulamalarını detaylandırmaktadır.
tags: 
  - token
  - dondurma
  - XRP Ledger
  - güven hattı
  - finansal kurum
  - düzenleyici gereklilikler
keywords: 
  - token
  - dondurma
  - XRP Ledger
  - güven hattı
  - finansal kurum
  - düzenleyici gereklilikler
---

## Tokenların Dondurulması

İhraççılar, XRP Ledger'da ihraç ettikleri tokenları dondurabilirler. **Bu, XRP için geçerli değildir,** çünkü XRP, XRP Ledger'ın yerel varlığıdır, ihraç edilmiş bir token değildir.

Belirli durumlarda, düzenleyici gereklilikleri karşılamak veya şüpheli faaliyetleri araştırırken bir borsa veya kapının token bakiyelerini dondurmak isteyebilir.

:::tip
Hiç kimse XRP'yi XRP Ledger'da donduramaz. Ancak, tasarruf sağlayan borsalar, her zaman kendi takdirlerine bağlı olarak yönettikleri fonları dondurabilirler. Daha fazla bilgi için `Dondurma ile İlgili Yaygın Yanlış Anlamalar`'a bakın.
:::

Dondurmalarla ilgili üç ayar vardır:

- **Bireysel Dondurma** - Bir karşı tarafı dondur.
- **Küresel Dondurma** - Tüm karşı tarafları dondur.
- **Dondurma Yok** - Bireysel karşı tarafları dondurma ve küresel dondurmayı sona erdirme yeteneğinden kalıcı olarak feragat et.

Tüm dondurma ayarları, dondurulacak bakiyelerin pozitif veya negatif olup olmadığına bakılmaksızın uygulanabilir. Hem token ihraççısı hem de para sahibi bir güven hattını dondurabilir; ancak, bir para sahibi dondurma işlemi yaptığında etki minimaldir.

## Bireysel Dondurma

**Bireysel Dondurma** özelliği, bir `güven hattı` üzerinde bir ayardır. Bir ihraççı, Bireysel Dondurma ayarını etkinleştirdiğinde, bu güven hattındaki tokenlar için aşağıdaki kurallar geçerlidir:

- Dondurulmuş güven hattındaki iki taraf arasında doğrudan ödemeler gerçekleştirilebilir.
- O güven hattının karşı tarafı, dondurulmuş güven hattındaki bakiyesini yalnızca ihraççıya doğrudan ödemeler yaparak azaltamaz. Karşı taraf, yalnızca dondurulmuş paraları doğrudan ihraççıya gönderebilir.
- Karşı taraf, dondurulmuş güven hattında başkalarından ödemeler almaya devam edebilir.
- Karşı tarafın dondurulmuş güven hattındaki tokenları satma teklifleri `fonlama yapılmamış` olarak kabul edilir.

> **Hatırlatma:** Güven hatları XRP'yi tutmaz. XRP dondurulamaz.

Bir finansal kurum, şüpheli faaliyet gösteren veya finansal kurumun kullanım koşullarını ihlal eden bir karşı taraf ile bağlantılı güven hattını dondurabilir. Finansal kurum, ayrıca XRP Ledger'a bağlı olan diğer sistemlerde de karşı tarafı dondurmalıdır. (Aksi takdirde, bir adres hala finansal kurum aracılığıyla istenmeyen faaliyetlerde bulunabilir.)

Bir finansal kuruma olan güven hattını donduran bir adres, diğer kullanıcılar arasındaki işlemler üzerinde etkisi yoktur. Ancak, diğer adreslerin, `işletimsel adresler` dahil olmak üzere, o finansal kurumun tokenlarını bireysel adrese göndermelerini engeller. Bu tür bir bireysel dondurma tekliflere etki etmez.

Bireysel Dondurma, yalnızca tek bir güven hattına uygulanır. Belirli bir karşı taraf ile birden fazla tokenı dondurmak için, adresin her bir ayrı para kodu için güven hatlarında Bireysel Dondurma'yı etkinleştirmesi gerekir.

Bir adres, `Dondurma Yok` ayarını etkinleştirmişse Bireysel Dondurma ayarını etkinleştiremez.

## Küresel Dondurma

**Küresel Dondurma** özelliği, bir hesap üzerindeki bir ayardır. Bir hesap, yalnızca kendi üzerinde küresel dondurma özelliğini etkinleştirebilir. Bir ihraççı, Küresel Dondurma özelliğini etkinleştirdiğinde, ihraç ettiği tüm tokenlar için aşağıdaki kurallar geçerli olur:

- Dondurulmuş ihraççının tüm karşı tarafları, dondurulmuş hesaba olan güven hatlarındaki bakiyelerini yalnızca ihraççıya doğrudan ödemeler yaparak azaltabilir. (Bu, ihraççının kendi `işletimsel adresleri` üzerinde de etkilidir.)
- Dondurulmuş ihraççının karşı tarafları, ihraç adresine doğrudan ödeme yapabilir ve alabilir.
- Dondurulmuş adres tarafından ihraç edilen tokenları satma teklifleri `fonlama yapılmamış` olarak kabul edilir.

> **Hatırlatma:** adresler XRP ihraç edemez. Küresel dondurmalar XRP'ye uygulanmaz.

Bir ihraççının `şifreli anahtarı` tehlikeye girerse, bir finansal kurumun `ihraç hesabında` Küresel Dondurma'yı etkinleştirmek faydalı olabilir; çünkü böyle bir adresin kontrolünü yeniden kazanmaktan sonra fon akışını durdurur, böylece saldırganlar daha fazla para almakta zorlanır veya en azından ne olduğunu izlemeyi kolaylaştırır. XRP Ledger'da Küresel Dondurma'yı uygulamanın yanı sıra, ihraççı dış sistemlerinde de aktiviteleri askıya almalıdır.

Finansal kurum, yeni bir `ihraç adresine` geçmek niyetindeyse veya finansal kurumun iş yapmayı bırakmayı amaçlıyorsa Küresel Dondurma'yı etkinleştirmek de faydalı olabilir. Bu, fonları belirli bir noktada kilitler, böylece kullanıcılar bunları başka para birimleri için takas edemezler.

Küresel Dondurma, adres tarafından ihraç edilen ve tutulan _tüm_ tokenlara uygulanır. Sadece bir para kodu için Küresel Dondurma'yı etkinleştiremezsiniz. Bazı tokenları dondurma yeteneğine sahip olmak ve diğerlerini dondurmamak istiyorsanız, her token için farklı adresler kullanmalısınız.

Bir adres her zaman Küresel Dondurma ayarını etkinleştirebilir. Ancak, adres `Dondurma Yok` ayarını etkinleştirmişse, Küresel Dondurma'yı asla _devre dışı_ bırakamaz.

## Dondurma Yok

**Dondurma Yok** özelliği, bir adres üzerinde bulunan ve tokenları keyfi olarak dondurma yeteneğinden kalıcı olarak feragat eden bir ayardır. Bir ihraççı, tokenlarını karşı tarafların kendi aralarında işlem yapmalarına müdahale edemeyeceği şekilde "daha fiziksel para gibi" hale getirmek için bu özelliği kullanabilir.

> **Hatırlatma:** XRP zaten dondurulamaz. Dondurma Yok özelliği yalnızca XRP Ledger'da ihraç edilen diğer tokenlar için geçerlidir.

Dondurma Yok ayarının iki etkisi vardır:

- İhraççı, artık herhangi bir karşı tarafa olan güven hatlarında Bireysel Dondurma'yı etkinleştiremez.
- İhraççı, Küresel Dondurma'yı hala uygulayabilir, ancak Küresel Dondurma'yı _devre dışı_ bırakamaz.

XRP Ledger, bir ihraççıyı ihraç ettiği fonların temsil ettiği yükümlülüklere uymaya zorlayamaz, bu nedenle Dondurma Yok bir stablecoin ihraççısının yükümlülüklerini yerine getirmemesini engellemez. Ancak, Dondurma Yok, bir ihraççının belirli kullanıcılar aleyhine Küresel Dondurma özelliğini haksız bir şekilde kullanmadığını garanti eder.

Dondurma Yok ayarı, bir adrese yönelik ihraç edilen ve bu adresten ihraç edilen tüm tokenlara uygulanır. Eğer bazı tokenları dondurma ama diğerlerini dondurmama yeteneğine sahip olmak istiyorsanız, her biri için farklı adresler kullanmalısınız.

Dondurma Yok ayarını yalnızca adresinizin ana anahtar sırrı tarafından imzalanmış bir işlemle etkinleştirebilirsiniz. Dondurma Yok'u etkinleştirmek için `Normal Anahtar` veya `çok imzalı işlem` kullanamazsınız.

## Ayrıca Bakınız

- [Dondurma Kod Örnekleri](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/freeze)
- **Kavramlar:**
    - `Güven Hatları ve İhraç`
- **Eğitimler:**
    - `Dondurma Yok'u Etkinleştir`
    - `Küresel Dondurma'yı Uygula`
    - `Bir Güven Hattını Dondur`
- **Referanslar:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - `AccountRoot Flags`
    - `RippleState (güven hattı) Flags`

