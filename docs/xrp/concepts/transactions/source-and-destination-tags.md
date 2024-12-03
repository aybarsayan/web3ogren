---
title: Kaynak ve Hedef Etiketler
seoTitle: XRP Ledgerda Kaynak ve Hedef Etiketleri Anlamak
sidebar_position: 4
description: XRP Ledgerda kaynak ve hedef etiketlerinin önemi, nasıl kullanıldığı ve maliyet tasarrufu yöntemleri hakkında bilgi verilmektedir. Bu etiketler, ödemeleri daha etkin bir şekilde yönetmenin yollarını sunar.
tags: 
  - XRP Ledger
  - hedef etiketleri
  - kaynak etiketleri
  - ödemeler
  - hesaplar
keywords: 
  - XRP Ledger
  - kaynak etiketleri
  - hedef etiketleri
  - ödemeler
  - hesaplar
---

## Kaynak ve Hedef Etiketler

_Kaynak etiketleri_ ve _hedef etiketleri_, XRP Ledger `ödemeleri` için çok amaçlı adreslerden gelen ve giden ödemelerin belirli amaçlarını gösterebilen bir özelliktir. Kaynak ve hedef etiketlerin doğrudan defterde bir işlevi yoktur; kaynak ve hedef etiketler yalnızca, defter dışı sistemlerin bir ödemeyi nasıl işlemesi gerektiği hakkında bilgi sağlar. İşlemlerde, hem kaynak hem de hedef etiketler 32 bit işaretsiz tamsayılar olarak biçimlendirilir.

Hedef etiketler, **bir ödemenin yararlanıcısını veya hedefini gösterir**. Örneğin, bir `borsa` veya `stablecoin ihraççısı` adresine yapılan bir ödeme, o iş yerinin kendi sistemlerinde ödemenin miktarını hangi müşterinin alacağını belirtmek için bir hedef etiketi kullanabilir. Bir tüccara yapılan bir ödeme, ödemenin hangi öğeyi veya sepeti satın aldığını belirtebilir.

Kaynak etiketler, **bir ödemenin kaynağını veya kökenini gösterir**. En yaygın olarak, bir Kaynak Etiketi, ödemenin alıcısının geri ödeme veya "geri dönen" ödemenin nereye göndereceğini bilmesi için dahildir. Gelen bir ödemeyi iade ederken, gelen ödemenin kaynak etiketini, çıkan (iade) ödemenin hedef etiketi olarak kullanmalısınız.

Müşterilere XRP Ledger adresinizden başka bir arayüz kullanarak işlem gönderip alma yeteneği verme uygulaması, _barındırılan hesaplar_ sağlamaktır. Barındırılan hesaplar genellikle her müşteri için kaynak ve hedef etiketler kullanır.

:::tip İpucu
Bir [X-adresi](https://xrpaddress.info/), klasik bir adres ile bir etiketi tek bir adreste birleştirir ve her ikisini de kodlar. Eğer müşterilere bir depozito adresi gösteriyorsanız, müşterilerinizin iki parçayı takip etmesi yerine bir X-adresi kullanması daha kolay olabilir. (Bir X-adresindeki etiket göndermede bir kaynak etiketi olarak, alırken ise bir hedef etiketi olarak işlev görür.)
:::

## Gerekçesi

Diğer dağıtık defterlerde, her müşteri için farklı depozito adresleri kullanmak yaygındır. XRP Ledger'da, **bir adresin ödemeleri almak için finanse edilmiş**, kalıcı bir `hesap` olması gerekir. Bu yaklaşımı XRP Ledger'da kullanmak, ağdaki tüm sunucuların kaynaklarını israf şekilde tüketir ve her adres için `rezerv` miktarının süresiz olarak ayrılması gerektiğinden maliyetlidir.

Kaynak ve hedef etiketler, depozitoları ve ödemeleri bireysel müşterilere daha hafif bir şekilde eşleştirmek için bir yol sağlar.

---

## Kullanım Durumları

Bir iş, kaynak ve hedef etiketleri birkaç amaç için kullanmak isteyebilir:

- Müşteri hesaplarına doğrudan eşleştirmeler.
- İade ödemelerini, onları tetikleyen çıkan ödemelerle eşleştirme.
- Süresi dolacak olan tekliflere ödeme eşleştirme.
- Müşterilerin belirli depozitolar için üretebileceği geçici etiketler sağlama.

Gizliliği korurken çakışmayı önlemek için, işletme toplam mevcut etiket aralığını her amaç için bölümlere ayırabilir, ardından aralık içerisinde öngörülemez bir sırada etiketler atayabilir. Örneğin, [SHA-256](https://en.wikipedia.org/wiki/SHA-2) gibi bir kriptografik hash işlevi kullanın ve ardından çıktıyı ilgili bölümün boyutuna eşlemek için [modulo işlecini](https://en.wikipedia.org/wiki/Modulo_operation) kullanın. Güvende olmak için, yeni bir etiketi kullanmadan önce eski etiketlerle çakışmaları kontrol edin.

**Sayısal sırada etiket atamak**, müşterilere daha az gizlilik sağlar. Tüm XRP Ledger işlemleri kamuya açık olduğundan, bu şekilde etiket atamak, hangi etiketlerin çeşitli kullanıcıların adresleriyle ilişkili olduğunu tahmin etmeyi veya etiketlere dayanarak kullanıcı hesapları hakkında bilgi edinmeyi mümkün kılabilir.

---

## Etiket Gerektirme

Birden fazla müşteri hesabı için ödemeleri alabilecek bir XRP Ledger adresi için, bir ödeme _hedef etiketi olmadan_ almak bir sorun olabilir: "hangi müşteriye kredi verileceği hemen belli olmayabilir, bu da göndericiyle bir tartışma ve manuel müdahale gerektirebilir." Bu gibi durumları azaltmak için `RequireDest` ayarını etkinleştirebilirsiniz. Bu şekilde, kullanıcı ödeme sırasında bir hedef etiketini eklemeyi unutursa, XRP Ledger, ne yapacağınızı bilmediğiniz parayı size vermek yerine ödemeyi reddeder. Kullanıcı daha sonra, etiket olarak ne yapması gerektiğini kullanarak ödemeyi tekrar gönderebilir.

---

## Ayrıca Bakınız

- `Hedef Etiketleri Gerektir`
- `Ödeme Türleri`

