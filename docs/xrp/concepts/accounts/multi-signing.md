---
title: Çoklu İmza
seoTitle: Çoklu İmza ve Güvenli İşlem Yetkilendirme
sidebar_position: 4
description: Çoklu imzalama, XRP Defterinde işlemleri daha güvenli bir şekilde yetkilendirmek için kullanılan bir yöntemdir. Bu yöntem, kullanıcıların adresleri üzerindeki kontrolü artırarak güvenlik seviyesini yükseltir.
tags: 
  - Çoklu İmza
  - XRP
  - Güvenlik
  - Akıllı Sözleşmeler
  - İşlemleri Yetkilendirme
keywords: 
  - Çoklu İmza
  - XRP
  - Güvenlik
  - Akıllı Sözleşmeler
  - İşlemleri Yetkilendirme
---

## Çoklu İmza

XRP Defteri'nde çoklu imzalama, birden fazla gizli anahtarın kombinasyonunu kullanarak XRP Defteri'nde `işlemleri yetkilendirme` yöntemidir. Adresiniz için çoklu imzalamayı, `anahtar çiftini` ve `normal anahtar çiftini` içeren her türlü yetkilendirme yönteminin kombinasyonunu etkinleştirebilirsiniz. (Tek gereklilik, _en az bir_ yöntem etkin olmalıdır.)

Çoklu imzalamanın avantajları şunlardır:

- Farklı cihazlardan anahtarlar talep edebilirsiniz, böylece kötü niyetli bir aktör, sizin adınıza işlemler göndermek için birden fazla makineyi ele geçirmek zorunda kalır.
- Bir adresin mülkiyetini, her birinin o adresten işlem göndermek için gereken birkaç anahtardan yalnızca birine sahip olduğu birden fazla kişi arasında paylaşabilirsiniz.
- İşlemleri göndermek için gücü, normalde imza atamayacak veya mevcut olmadığınız zamanlarda adresinizi kontrol edebilecek bir grup insana devredebilirsiniz.

## İmza Listeleri

:::tip
Çoklu imzalama işlemini gerçekleştirmeden önce, hangi adreslerin sizin adınıza imza atabileceğine dair bir liste oluşturmalısınız. 
:::

[SignerListSet işlemi][], adresinizden işlemleri yetkilendirebilecek bir _imza listesi_ tanımlar. Bir imza listesine 1 ile 32 adres dahil edebilirsiniz. Liste kendi adresinizi içermemeli ve tekrar eden girdiler olmamalıdır. Liste içindeki _İmza Ağırlığı_ ve _Kvorum_ ayarlarını kullanarak gereken imza sayısını ve kombinasyonlarını kontrol edebilirsiniz.

_(Güncellendi [ExpandedSignerList değişikliği][] tarafından.)_

### İmza Ağırlığı

Listede her bir imzacıya bir ağırlık atarsınız. Ağırlık, imzacıların listede diğer imzacılara göre yetkisini temsil eder. Değer ne kadar yüksekse, yetki de o kadar fazladır. Bireysel ağırlık değerleri 216-1'den fazla olamaz.

### Kvorum

Bir listenin kvorum değeri, bir işlemi yetkilendirmek için gereken minimum ağırlık toplamıdır. Kvorum 0'dan büyük, ancak imza listesindeki ağırlık değerlerinin toplamına eşit veya daha az olmalıdır; yani, verilen imza ağırlıklarıyla bir kvorum elde etmek mümkün olmalıdır.

### Cüzdan Tanımlayıcı

Listeye her imzacının girdisine 256 bitten fazla rastgele veri ekleyebilirsiniz. Bu veri, ağ tarafından gerekli veya kullanılmaz, ancak akıllı sözleşmeler veya diğer uygulamalar, imzacılar hakkında başka verileri tanımlamak veya onaylamak için kullanılabilir.

_(Eklendi [ExpandedSignerList değişikliği][] tarafından.)_

### İmza Ağırlığı ve Kvorum Kullanan Örnekler

:::note
Ağırlıklar ve kvorum, hesaba sahip olan sorumlu katılımcılara atanan göreceli güven ve otoriteye dayalı olarak her işlem için uygun bir denetleme seviyesi ayarlamanızı sağlar.
:::

Bir paylaşılan hesap kullanım durumu için, 1 kvorum ile bir liste oluşturabilirsiniz; ardından tüm katılımcılara 1 ağırlık verebilirsiniz. Onlardan herhangi birinin tek onayı, bir işlemi onaylamak için gereken tüm şeydir.

Bir paylaşılan hesap için:

- **Kvorum**: 3
- **Ağırlık**: 1

Bu durumda, tüm katılımcılar her işlemi onaylamak ve kabul etmek zorundadır.

Başka bir hesap da 3 kvoruma sahip olabilir. CEO'nuzu 3 ağırlık ile, 3 Başkan Yardımcısını 2'şer ağırlık ile ve 3 Yöneticiye 1'er ağırlık atarsınız. Bu hesap için bir işlemi onaylamak, tüm 3 Yönetici (toplam ağırlık 3), 1 Başkan Yardımcısı ve 1 Yönetici (toplam ağırlık 3), 2 Başkan Yardımcısı (toplam ağırlık 4) veya CEO (toplam ağırlık 3) onayını gerektirir. 

Yukarıdaki her üç kullanım durumunda, normal anahtarı yapılandırmadan anahtarı devre dışı bırakırsınız; böylece çoklu imzalama, `işlemleri yetkilendirme` yönünün tek yolu olur.

Bazen bir "yedek plan" olarak çoklu imza listesi oluşturma senaryosu olabilir. Hesap sahibi normalde işlemleri için normal anahtar kullanır (çoklu imza anahtarı değil). Güvenlik için, sahibi 3 arkadaşından oluşan, her birinin ağırlığı 1, kvorumu 3 olan bir imza listesi ekler. Hesap sahibi özel anahtarını kaybederse, arkadaşlarından çoklu imzalatma talep edebilir.

## Çoklu İmzalı İşlemleri Göndermek

Başarıyla çoklu imzalı bir işlemi göndermek için, aşağıdakilerin tümünü yapmalısınız:

* İşlemi gönderen adres (``Account`` alanında belirtilmiştir), `defterde bir `SignerList` nesnesine` sahip olmalıdır. Bunu nasıl yapacağınız için `Çoklu İmzalamayı Ayarlama` kısmına bakın.
* İşlem, boş bir dize olarak `SigningPubKey` alanını içermelidir.
* İşlem, bir dizi imza içeren bir `Signers` alanı` içermelidir.
* `Signers` dizisinde bulunan imzalar, `SignerList`'te tanımlanan imzacıları eşleştirmelidir.
* Sağlanan imzalar için, o imzacılara ait toplam ağırlık, `SignerList` için kvorumla eşit veya daha büyük olmalıdır.
* `işlem maliyeti` (`Fee` alanında belirtilmiştir) en az (N+1) katı normal işlem maliyeti olmalıdır; burada N, sağlanan imza sayısını temsil eder.
* İmza toplamadan önce işlemin tüm alanları tanımlanmış olmalıdır. Herhangi bir alanı `otomatik dolduramazsınız`.
* İkili biçimde sunulursa, `Signers` dizisi imza adreslerinin sayısal değerine göre sıralanmalı, en düşük değer önce gelmelidir. (JSON olarak gönderildiğinde, [submit_multisigned method][] bunu otomatik olarak halleder.)

## Ayrıca Bakın

- **Kaynaklar:**
    - `Çoklu İmzalamayı Ayarlama`
    - `Çoklu İmzalı İşlem Gönder`
- **Kavramlar:**
    - `Şifreleme Anahtarları`
    - `Çoklu imzalı işlemler için Özel İşlem Maliyeti`
- **Referanslar:**
    - [SignerListSet işlemi][]
    - `SignerList nesnesi`
    - [sign_for method][]
    - [submit_multisigned method][]

