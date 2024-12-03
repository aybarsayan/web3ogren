---
title: Hesap Türleri
seoTitle: XRP Defteri Hesap Türleri
sidebar_position: 4
description: XRP Defterinde otomatik işlem gerçekleştiren işletmelerin adres yönetimi ve güvenlik dikkate alarak nasıl işlem yapmaları gerektiğini açıklamaktadır. Bu içerik, fonların yaşam döngüsü, ihraç adresleri, operasyonel adresler ve bekleme adresleri hakkında önemli bilgiler sunmaktadır.
tags: 
  - XRP Defteri
  - adres yönetimi
  - token yönetimi
  - işlem güvenliği
keywords: 
  - XRP Defteri
  - ihraç adresi
  - operasyonel adres
  - bekleme adresi
  - token yönetimi
---

# Hesap Türleri

partial file="/docs/_snippets/issuing-and-operational-addresses-intro.md" /%}

## Fonlar Yaşam Döngüsü

Bir token ihraççısı bu rollerin ayrımını takip ettiğinde, fonlar belirli yönlere doğru akma eğilimindedir; aşağıdaki diyagramda olduğu gibi:


:::info
İhraç adresi, bekleme adreslerine ödeme göndererek tokenler oluşturur. Bu tokenler, ihraç adresi açısından negatif bir değere sahiptir, çünkü genellikle yükümlülükleri temsil eder.
:::

Aynı tokenler, bekleme adresi açısından olumlu bir değere sahiptir.

Bekleme adresleri, gerçek insanlar tarafından işletilmektedir, bu nedenle bu tokenleri operasyonel adreslere gönderirler. Bu adım, ihraç adresinin bu noktadan sonra mümkün olduğunca az kullanılmasını sağlar; bekleme için en azından bazı tokenlerin mevcut olmasını sağlamaktadır.

---

Operasyonel adresler, otomatik sistemler tarafından işletilmektedir ve likidite sağlayıcıları, ortaklar ve diğer müşteriler gibi diğer karşı taraflara ödemeler gönderirler. Bu karşı taraflar birbirleri arasında fonları özgürce gönderebilirler.

Her zamanki gibi, token ödemeleri ihraççının güven hattı boyunca "dalgalanmalıdır".

Sonunda, biri tokenleri ihraççının adresine geri gönderir. Bu, o tokenleri yok eder ve ihraççının XRP Defteri'ndeki yükümlülüklerini azaltır. Eğer token bir stablecoin ise, bu, tokenleri karşılık gelen defter dışı varlıklar için itfa etmenin ilk adımıdır.

## İhraç Adresi

İhraç adresi bir kasa gibidir. Ortaklar, müşteriler ve operasyonel adresler ihraç adresine güven hatları kurar, ancak bu adres mümkün olduğunca az işlem gönderir. Periyodik olarak, bir insan operatörü, bekleme veya operasyonel adreslerin bakiyelerini doldurmak için ihraç adresinden bir işlem oluşturur ve imzalar. İdeal olarak, bu işlemleri imzalamak için kullanılan özel anahtarın, internet bağlantılı hiçbir bilgisayardan erişilebilir olmaması gerekir.

> Bir kasa gibi olmamasına rağmen, ihraç adresi müşterilerden ve ortaklardan doğrudan ödemeler alabilir. 
> — XRP Güvenlik Kılavuzu

### İhraç Adresi Kompromosyonu

Eğer kötü niyetli bir aktör bir kurumun ihraç adresinin arkasındaki özel anahtarı öğrenirse, o aktör yeni tokenler oluşturabilir ve bunları kullanıcılara gönderebilir veya merkeziyetsiz borsa üzerinde ticaret yapabilir. Bu, bir stablecoin ihraççısını iflas ettirebilir. Mali kurum için, meşru bir şekilde elde edilen tokenleri ayırt etmek ve adil bir şekilde itfa etmek zor hale gelebilir. Eğer mali kurum ihraç adresinin kontrolünü kaybederse, kurum yeni bir ihraç adresi oluşturmalı ve eski ihraç adresine güven hatları olan tüm kullanıcılar yeni adresle güven hatları oluşturmalıdır.

### Birden Fazla İhraç Adresi

Bir mali kurum, tek bir ihraç adresinden XRP Defteri'nde birden fazla türde token ihraç edebilir. Ancak, bir adres üzerinden ihraç edilen (fungible) tokenler için eşit şekilde geçerli olan bazı ayarlar bulunmaktadır; bunlar arasında `transfer ücretleri` için yüzdelik ve `küresel dondurma` durumu yer almaktadır. Eğer mali kurum her tür token için ayarları farklı şekilde yönetme esnekliğini istiyorsa, kurum birden fazla ihraç adresi oluşturmalıdır.

---

## Operasyonel Adresler

Operasyonel adres, bir kasa makinesi gibidir. Kurum adına müşterilere ve ortaklara token transfer ederek ödemeler yapar. İşlemleri otomatik olarak imzalamak için, bir operasyonel adresin özel anahtarı, internet bağlantılı bir sunucuda saklanmalıdır. (Özel anahtar şifreli olarak saklanabilir, ancak sunucu onu işlemleri imzalamak için çözmelidir.) Müşteriler ve ortaklar, operasyonel adrese güven hatları oluşturmaz ve oluşturmamalıdır.

Her operasyonel adresin sınırlı bir bakiyesi vardır. Bir operasyonel adresin bakiyesi düşük olduğunda, mali kurum onu, ihraç adresinden veya bekleme adresinden bir ödeme göndererek doldurur.

### Operasyonel Adres Kompromosyonu

Eğer kötü niyetli bir aktör, bir operasyonel adresin arkasındaki özel anahtarı öğrenirse, mali kurum yalnızca o operasyonel adresin sahip olduğu kadar kaybeder. Kurum, müşterilerden ve ortaklardan hiçbir işlem yapmadan yeni bir operasyonel adrese geçebilir.

---

## Bekleme Adresleri

Bir kurumun risk ve rahatlığı dengelemek için alabileceği başka bir isteğe bağlı adım, ihraç adresi ile operasyonel adresler arasında "bekleme adresleri" kullanmaktır. Kurum, her zaman çevrimiçi sunuculara erişimi olmayan, ancak farklı güvenilir kullanıcılara emanet edilen ek XRP Defteri adresleri finansman sağlayabilir.

Bir operasyonel adres, fonları (ya tokenleri ya da XRP'yi) düşük seviyede çalışıyorsa, bir güvenilir kullanıcı, bekleme adresini kullanarak operasyonel adresin bakiyesini doldurabilir. Bekleme adresleri düşük durumda olduğunda, kurum bir bekleme adresine daha fazla fon göndermek için ihraç adresini kullanabilir ve bekleme adresleri gerekli olduğunda bu fonları aralarında dağıtabilir. Bu, ihraç adresinin güvenliğini artırır, daha az toplam işlem yapmasını sağlar ve otomatik sistemlerin kontrolünde çok fazla paranın kalmamasını sağlar.

:::tip
Operasyonel adreslerle olduğu gibi, bir bekleme adresinin, ihraç adresiyle bir muhasebe ilişkisi olmalıdır, müşterilerle veya ortaklarla değil. Operasyonel adreslere uygulanan tüm önlemler, bekleme adreslerine de uygulanmalıdır.
:::

### Bekleme Adresi Kompromosyonu

Eğer bir bekleme adresi tehlikeye atılırsa, sonuçlar, bir operasyonel adresin tehlikeye atılmasına benzer. Kötü niyetli bir aktör, bekleme adresinin sahip olduğu tüm bakiyeleri çalabilir ve mali kurum, müşterilerden ve ortaklardan hiçbir işlem yapmadan yeni bir bekleme adresine geçebilir.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Hesaplar`
    - `Kriptografik Anahtarlar`
- **Eğitimler:**
    - `Bir Standart Anahtar Çifti Atama`
    - `Bir Standart Anahtar Çiftini Değiştirme veya Kaldırma`
- **Referanslar:**
    - [account_info yöntemi][]
    - [SetRegularKey işlemi][]
    - `AccountRoot nesnesi`

