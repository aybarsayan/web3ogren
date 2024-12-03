---
title: Deposit Yetkilendirmesi
seoTitle: Deposit Yetkilendirmesi - XRP Ledger Güvenlik ve Ödemeler
sidebar_position: 4
description: DepositAuth ayarı, hesapların belirli göndericilerden gelen ödemeleri kontrol altına almasına olanak tanır. Bu sayede hesaplar yalnızca onaylı kaynaklardan değer alabilir.
tags: 
  - DepositAuth
  - XRP Ledger
  - güvenlik
  - ödemeler
  - önceden yetkilendirme
keywords: 
  - DepositAuth
  - XRP Ledger
  - güvenlik
  - ödemeler
  - önceden yetkilendirme
---

## Deposit Yetkilendirmesi

_(Eklenmiştir [DepositAuth değişikliği][].)_

Deposit Yetkilendirmesi, XRP Ledger'daki isteğe bağlı bir `hesap` ayarıdır. Etkinleştirildiğinde, Deposit Yetkilendirmesi, yabancılardan gelen tüm transferleri engeller, buna XRP ve `jetonlar` dahil. **Deposit Yetkilendirmesi olan bir hesap, yalnızca iki şekilde değer alabilir:**

- `Önceden yetkilendirilmiş` hesaplardan.
- Fonları almak için bir işlem göndererek. Örneğin, Deposit Yetkilendirmesi olan bir hesap, bir yabancı tarafından başlatılan bir `Escrow` işlemini tamamlayabilir.

Varsayılan olarak, yeni hesaplarda DepositAuth devre dışıdır ve herhangi bir kişiden XRP alabilir.

---

## Arka Plan

Finansal hizmetler düzenlemeleri ve lisansları, bir işletmenin veya varlığın aldığı tüm işlemlerin göndericisini bilmesini gerektirebilir. Bu, XRP Ledger gibi merkeziyetsiz bir sistemde bir zorluk teşkil etmektedir; burada katılımcılar, serbestçe oluşturulabilen takma adlarla tanımlanır ve varsayılan davranış, herhangi bir adresin herhangi bir başkasına ödeme yapabilmesidir.

Deposit Yetkilendirme bayrağı, XRP Ledger kullananların, merkeziyetsiz defterin **temel doğasını** değiştirmeden böyle düzenlemelere uymaları için bir seçenek sunar. Deposit Yetkilendirmesi etkinleştirildiğinde, bir hesap yalnızca açıkça onayladığı fonları alabilir. Deposit Yetkilendirmesi kullanan bir hesabın sahibi, fonların göndericisini tanımlamak için gerekli özeni gösterebilir _işlemi göndermeden önce_.

:::info
Deposit Yetkilendirmesi etkin olduğunda, aşağıdaki kaynaklardan para alabilirsiniz: `Çekler`, `Escrow` ve `Ödeme Kanalları`. Bu işlemlerin "iki adımlı" modelinde, önce kaynak, fonların gönderilmesini yetkilendirmek için bir işlem gönderir, ardından hedef, bu fonların alınmasını yetkilendirmek için bir işlem gönderir.
:::

Deposit Yetkilendirmesi etkin olduğunda [Ödeme işlemlerinden][] para almak için, bu Ödemelerin göndericilerini `önceden yetkilendirmelisiniz`. _(Eklenmiştir [DepositPreauth değişikliği][].)_

---

## Önerilen Kullanım

Deposit Yetkilendirmesi'nin tam etkisini elde etmek için Ripple, ayrıca aşağıdakileri yapmayı önerir:

- Her zaman minimum `rezerv gereksinimi` ile daha yüksek bir XRP bakiyesi bulundurun.
- Varsayılan Ripple bayrağını varsayılan (devre dışı) durumu koruyun. Herhangi bir güven hattında `rippling` etkinleştirmeyin. [TrustSet işlemleri][] gönderirken, her zaman `tfSetNoRipple` bayrağını kullanın.
- `Teklifler` koymayın. **Hangi eşleşen tekliflerin böyle bir ticareti gerçekleştirmek için kullanılacağını önceden bilmek mümkün değildir.**

---

## Kesin Anlamlar

Deposit Yetkilendirmesi etkin olan bir hesap:

- **Ödeme işlemleri** için hedef olamaz, **şu istisnalar hariç**:
    - Eğer hedef, Ödemenin göndericisini `önceden yetkilendirmişse`. _(Eklenmiştir [DepositPreauth değişikliği][])_
    - Eğer hesabın XRP bakiyesi, minimum hesap `rezerv gereksinimi` ile eşit veya altında ise, XRP ödemesinin hedefi olabilir ve `Miktar` değeri minimum hesap rezervinden (şu anda 10 XRP) eşit veya daha azdır. **Bu, bir hesabın "takılıp kalmasını" önlemek içindir**, yani işlemler göndermekte zorlanırken XRP almaktan da kaçınamaz. Hesabın sahibi rezervi, bu durum için önemli değildir.

- **Sadece şu durumlarda** [PaymentChannelClaim işlemlerinden][] XRP alabilir:
    - PaymentChannelClaim işleminin göndericisi, ödemenin kanalıdır.
    - PaymentChannelClaim işleminin hedefi, PaymentChannelClaim işleminin göndericisini `önceden yetkilendirmiştir`. _(Eklenmiştir [DepositPreauth değişikliği][])_

- **Sadece şu durumlarda** [EscrowFinish işlemlerinden][] XRP alabilir:
    - EscrowFinish işleminin göndericisi, escrow'nun hedefidir.
    - EscrowFinish işleminin hedefi, EscrowFinish işleminin göndericisini `önceden yetkilendirmiştir`. _(Eklenmiştir [DepositPreauth değişikliği][])_

- [CheckCash][] işlemi göndererek XRP veya jeton alabilir. _(Eklenmiştir [Çekler değişikliği][].)_

- [Teklif oluşturma işlemleri][] göndererek XRP veya jeton alabilir.
    - Eğer hesap, hemen tam olarak işlenmeyen bir OfferCreate işlemi gönderirse, daha sonra diğer hesapların [Ödeme][] ve [Teklif Oluşturma][] işlemleri tarafından tüketilmekte olan sıralanmış XRP veya jetonları alabilir.

- Hesap, `No Ripple bayrağı` etkin olmadan herhangi bir güven hattı oluşturduysa veya Varsayılan Ripple bayrağını etkinleştirip herhangi bir para birimi ihraç ettiyse, hesap o güven hatlarının tokenlerini [Ödeme işlemleri][] sonucunda alabilir. Hedefi olamaz.

- Genel olarak, XRP Ledger'daki bir hesap **şu tüm koşullar sağlandığı sürece** XRP Ledger'da herhangi bir non-XRP para birimini almaz. **(Bu kural, DepositAuth bayrağına özgü değildir.)**
    - Hesap, sıfırdan büyük bir limit ile hiçbir güven hattı oluşturmadı.
    - Hesap, diğerleri tarafından oluşturulan güven hatlarında jeton ihraç etmedi.
    - Hesap, hiçbir teklif koymadı.

---

Aşağıdaki tablo, DepositAuth etkin ya da devre dışı olduğunda hangi işlem türlerinin para yatırabileceğini özetlemektedir:

partial file="/docs/_snippets/depositauth-semantics-table.md" /%}

---

## Deposit Yetkilendirmesini Etkinleştirme veya Devre Dışı Bırakma

Bir hesap, `SetFlag` alanı `asfDepositAuth` değeri (9) olarak ayarlanmış bir [AccountSet işlemi][] göndererek deposit yetkilendirmesini etkinleştirebilir. Hesap, `ClearFlag` alanı `asfDepositAuth` değeri (9) olarak ayarlanmış bir [AccountSet işlemi][] göndererek deposit yetkilendirmesini devre dışı bırakabilir. AccountSet bayrakları hakkında daha fazla bilgi için `AccountSet bayraklarına` bakın.

---

## Bir Hesabın DepositAuth'unun Etkin Olup Olmadığını Kontrol Etme

Bir hesabın Deposit Yetkilendirmesi'nin etkin olup olmadığını görmek için, hesabı bulmak üzere [account_info yöntemi][] kullanın. `Flags` alanının ( `result.account_data` nesnesinde) değerini, bir AccountRoot kayıt nesnesi için tanımlanan `bitwise bayraklarla` karşılaştırın.

Eğer `Flags` değerinin `lsfDepositAuth` bayrak değeri (`0x01000000`) ile bitwise-AND işlemi sonucu sıfır dışı ise, o zaman hesap DepositAuth etkin. Eğer sonuç sıfırsa, o zaman hesap DepositAuth devre dışı.

---

## Ön Yetkilendirme

_(Eklenmiştir [DepositPreauth değişikliği][].)_

DepositAuth etkin olan hesaplar belirli göndericileri _önceden yetkilendirebilir_ ve böylece bu göndericilerden gelen ödemelerin, DepositAuth etkin olduğunda bile başarılı olmasına izin verebilir. Bu, belirli göndericilerin fon göndermesine olanak tanır, alıcının her işlem üzerinde ayrı ayrı harekete geçmesine gerek kalmadan. Ön yetkilendirme, DepositAuth'u kullanmak için gerekli değildir, ancak bazı operasyonları daha kolay hale getirebilir.

Ön yetkilendirme, para biriminden bağımsızdır. **Belirli paralar için hesapları önceden yetkilendiremezsiniz.**

Belirli bir göndericiyi önceden yetkilendirmek için, `Authorize` alanında önceden yetkilendirilecek diğer hesabın adresi ile [DepositPreauth işlemi][] gönderin. Ön yetkilendirmeyi iptal etmek için, başka bir hesabın adresini `Unauthorize` alanına sağlayın. Her zamanki gibi `Account` alanında kendi adresinizi belirtin. DepositAuth'unuz etkin olmasa bile, hesapları önceden yetkilendirebilir veya yetkilendirmeyi iptal edebilirsiniz; diğer hesaplar için belirlediğiniz ön yetkilendirme durumu kaydedilir, ancak DepositAuth'u etkinleştirmedikçe geçerli olmaz. **Bir hesap kendini önceden yetkilendiremez.** Ön yetkilendirmeler tek yönlüdür ve karşıt yönde gelen ödemeler üzerinde hiçbir etkisi yoktur.

Başka bir hesabı önceden yetkilendirmek, değerlendirme işlemi için ledger'a bir `DepositPreauth nesnesi` ekler ve bu, yetkilendirme sağlayan hesabın `sahip rezervini` artırır. Hesap, bu ön yetkilendirmeyi iptal ettiğinde, bu nesne kaldırılır ve sahip rezervi azalır.

DepositPreauth işlemi işlendiğinde, yetkilendirilmiş hesap, DepositAuth etkin olsa bile aşağıdaki işlem türlerinden herhangi biriyle hesabınıza fon gönderebilir:

- [Ödeme][]
- [EscrowFinish][]
- [PaymentChannelClaim][]

Ön yetkilendirme, DepositAuth etkin olan bir hesaba para göndermenin diğer yolları üzerinde hiçbir etkisi yoktur. **Kesin kurallar için `Kesin Anlamlar` bölümüne bakın.**

---

### Yetkilendirme Kontrolü

Bir hesabın başka bir hesaba para yatırmak üzere yetkilendirilip yetkilendirilmediğini görmek için, [deposit_authorized yöntemi][] kullanabilirsiniz. Bu yöntem iki şeyi kontrol eder:

- Hedef hesabın Deposit Yetkilendirmesi gerektirip gerektirmediği. (Eğer yetkilendirmeye ihtiyaç duymuyorsa, o zaman tüm kaynak hesaplar yetkilendirilmiş kabul edilir.)
- Kaynak hesabının, hedefe para göndermek üzere önceden yetkilendirilip yetkilendirilmediği.

---

## Ayrıca Bakınız

- [DepositPreauth işlemi][] referansı.
- `DepositPreauth ledger nesne tipi`.
- `rippled` API'sinin` [deposit_authorized yöntemi][].
- `Yetkili Güven Hatları` özelliği (`RequireAuth` bayrağını), **hangi karşı tarafların bir hesap tarafından ihraç edilen non-XRP para birimlerini tutabileceğini sınırlar.**
- `DisallowXRP` bayrağı, bir hesabın XRP almaması gerektiğini belirtir. Bu, Deposit Yetkilendirmesi'nden daha yumuşak bir koruma sağlar ve XRP Ledger tarafından uygulanmaz. (İstemci uygulamaları bu bayrağı dikkate almalı veya en azından bunu bildirerek uyarıda bulunmalıdır.)
- `RequireDest` bayrağı, bir hesabın yalnızca gönderen işlemin bir `Hedef Etiket` belirlemesi durumunda para miktarlarını alabileceğini belirtir. Bu, kullanıcıların bir ödemenin amacını belirtmeyi unutmalarını önler, ancak kimliği belirsiz göndericilerden korunmazlar; bu göndericiler keyfi hedef etiketleri belirleyebilirler.
- `Kısmi Ödemeler`, hesapların, `transfer ücretlerini` ve döviz kurlarını, teslim edilen tutardan düşmek suretiyle istenmeyen ödemeleri geri iade etmesine olanak tanır.

[DepositPreauth değişikliği]: /resources/known-amendments.md#depositpreauth

