---
title: Yollar
seoTitle: XRP Ledger Yolları ve İşleyişi
sidebar_position: 4
description: Token ödemeleri, bağlı kullanıcılar ve emir defterleri yollarından geçmelidir. Bu içerik, XRP Ledgerdeki yol kavramlarını ve işleyişlerini kapsamlı bir şekilde açıklıyor.
tags: 
  - XRP Ledger
  - token ödemeleri
  - yollar
  - çapraz para
  - otomatik piyasa yapıcılar
keywords: 
  - XRP Ledger
  - token ödemeleri
  - yollar
  - çapraz para
  - yukarı akış
  - otomatik piyasa yapıcılar
---

## Yollar

XRP Ledger'da yollar, `token'lerin` bir ödeme parçası olarak ara adımlar aracılığıyla akmasını tanımlar. Yollar, XRP Ledger'daki emir defterleri ve `otomatik piyasa yapıcılar (AMM)` aracılığıyla gönderen ile alıcıyı bağlayarak `çapraz para ödemelerini` mümkün kılar. Yollar ayrıca karşıt borçların karmaşık bir şekilde tasfiye edilmesini de sağlar.

XRP Ledger'da tek bir Ödeme işlemi birden fazla yolu kullanabilir; bu, istenilen miktarı sağlamak için farklı kaynaklardan likidite toplar. Dolayısıyla, bir işlem bir _yol seti_ içerir; bu, alınabilecek muhtemel yolların bir koleksiyonudur. Bir yol setindeki tüm yollar aynı para birimi ile başlamalı ve aynı para birimi ile de bitmelidir.

> **Not:** XRP doğrudan herhangi bir adrese gönderilebildiği için, bir `XRP'den-XRP'ye işlem` herhangi bir yolu kullanmaz.  
— XRP Ledger Teknik Dokümantasyonu

## Yol Adımları

Bir yol, göndereni ödemenin alıcısına bağlayan adımlardan oluşur. Her adım ya şunlardan biridir:

* Aynı para birimi ile başka bir adreste rippling yapmak.
* Bir emir defteri veya AMM kullanarak token veya XRP ticareti yapmak.

:::info  
`Rippling`, aynı para birimi kodunu kullanarak eşdeğer token'ların değişimini ifade eder. Tipik durumda, bir verici aracılığıyla rippling, bir tarafa yapılan token'ların miktarını azaltmak ve diğer tarafa eşit bir miktarda token artırmak anlamına gelir. Yol adımı, hangi hesaptan rippling yapılacağını belirtir.  
:::

`Token ticareti ve muhtemelen XRP`, bir emir defterine veya AMM'ye gitmeyi ve gönderilen miktar için varlıklar arasındaki en iyi döviz kuru bulunmayı içerir. Yol adımı hangi para birimine değişim yapacağını belirtir, ancak emir defterindeki Tekliflerin durumunu kaydetmez.

Her iki tür adımda, her bir ara adres yaklaşık eşit değeri kazanır ve kaybeder: ya bir bakiye güven hattından aynı para birimindeki başka bir güven hattına geçer ya da daha önce yerleştirilen bir sipariş doğrultusunda para birimlerini değiştirir. Bazı durumlarda, kazanılan ve kaybedilen miktarlar tam olarak aynı olmayabilir; bu, `transfer ücretleri`, AMM ücretleri, güven hattı kalite ayarları veya yuvarlama nedeniyle olabilir.


---

## Teknik Detaylar

## Yol Bulma

`rippled` API'si yol bulma için kullanılabilir iki yöntem içerir. [ripple_path_find method][] muhtemel yol setlerinin bir kerelik görüntülenmesini sağlar. [path_find method][] (yalnızca WebSocket) ise bir defter kapandığında veya sunucuda daha iyi bir yol bulunduğunda takip yanıtları ile aramayı genişletir.

> "Herhangi bir işlem için yolların otomatik olarak doldurulmasını sağlamak, işlem sırasında katılımların işletilmesini kolaylaştırır."  
— XRP Ledger Teknik Dokümantasyonu

`rippled`'in, imzaladığınızda yolları otomatik olarak doldurmasını sağlayabilirsiniz; bu, `imza yöntemine` veya `submit` komutuna (imza ve gönderim modu)` bir `build_path` alanı ekleyerek yapılır. Ancak, sürprizlerden kaçınmak için yolları ayrı olarak bulmayı ve sonuçları onaylamayı öneririz.

:::warning  
`rippled`, mümkün olan en ucuz yolları aramak üzere tasarlanmıştır, ancak her zaman en iyi yolu bulamayabilir. Güvenilir olmayan `rippled` örnekleri bu davranışı kar elde etmek için değiştirilmiş olabilir. Bir yol boyunca bir ödemenin gerçekleştirilmesi için gereken gerçek maliyet, gönderim ile işlem gerçekleştirme arasında değişebilir.  
:::

Yolları bulmak, her birkaç saniyede bir yeni defterlerin doğrulanmasıyla az çok değişen son derece zorlu bir problemdir; bu nedenle `rippled`, kesin en iyi yolu bulmak için tasarlanmamıştır. Yine de, birkaç muhtemel yol bulabilir ve belirli bir miktarın teslimatının maliyetini tahmin edebilirsiniz.

## Dolaylı Adımlar

Geleneksel olarak, bir yolun birkaç adımı `Ödeme işleminin alanları` ile ima edilir: özellikle `Account` (gönderen), `Destination` (alıcı), `Amount` (teslim edilecek para birimi ve miktar) ve `SendMax` (belirtilmişse gönderilecek para birimi ve miktarı). İma edilen adımlar şunlardır:

* Bir yolun ilk adımının, işlem `Account` alanı tarafından tanımlandığı üzere işlem göndereni olduğu siempre varsayılır.
* Eğer işlem `SendMax` alanı içeriyorsa ve bu alanın `issuer`'ı işlem göndereninden farklıysa, o verici ikinci adım olarak varsayılır.

    * Eğer `SendMax`'ın `issuer`'ı gönderim adresiyse, yol gönderim adresinde başlar ve verilen para birimi kodu için o adresin tüm güven hatlarını kullanabilir. Detaylar için `SendMax` ve `Amount` için özel değerler` kısmına bakabilirsiniz.

* Eğer işlem `Amount` alanı, işlem `Destination`'ı ile aynı olmayan bir `issuer` içeriyorsa, o verici yolun sondan bir önceki adımı olarak varsayılır.
* Son olarak, bir yolun son adımı her zaman işlemin alıcısıdır; bu, işlem `Destination` alanı tarafından tanımlanır.

---

## Varsayılan Yollar

Açıkça belirlenmiş yolların yanı sıra, bir işlem _varsayılan yol_ boyunca da yürütülebilir. Varsayılan yol, işlemin `ima edilen adımları` arasında bağlanmanın en basit yoludur.

Varsayılan yol aşağıdakilerden biri olabilir:

* Eğer işlem yalnızca bir token kullanıyorsa (verucisi önemsizdir), varsayılan yol ödemenin ilgili adresler üzerinden rippling ile geçeceğini varsayar. Bu yol yalnızca bu adresler güven hatları ile bağlıysa çalışır.

    * `SendMax` atlanırsa veya `SendMax`'ın `issuer`'ı gönderici ise, varsayılan yolun çalışabilmesi için gönderim `Account`'ından `Destination`'ın `Amount`'ının vericisine bir güven hattı gereklidir.

    * Eğer `SendMax` ve `Amount` farklı `issuer` değerlerine sahipse ve hiçbiri gönderen veya alıcı değilse, varsayılan yol muhtemelen kullanışlı değildir çünkü iki verici arasında bir güven hattında ripple gerektirecektir. Ripple (şirket) genellikle vericilerin birbirine doğrudan güven duymasını engeller.

* Çapraz para işlemleri için varsayılan yol, kaynak para birimi ( `SendMax` alanında belirtildiği gibi) ile hedef para birimi ( `Amount` alanında belirtildiği gibi) arasındaki emir defteri veya AMM'yi kullanır.

Aşağıdaki diyagram, tüm olası varsayılan yolları sıralar:


Varsayılan yolu devre dışı bırakmak için `tfNoDirectRipple` bayrağını` kullanabilirsiniz. Bu durumda, işlem yalnızca işlemin içine açıkça dahil edilmiş yolları kullanarak yürütülebilir. Tüccarlar, bu seçeneği arbitraj fırsatlarını değerlendirmek için kullanabilirler.

## Yol Spesifikasyonları

Bir yol seti, bir dizi şeklindedir. Yol setinin her bir üyesi, ayrı bir _yolu_ temsil eden başka bir dizidir. Bir yolun her bir üyesi, adımı tanımlayan bir nesnedir. Bir adımın şu alanları vardır:

| Alan      | Değer                  | Açıklama                            |
|:-----------|:-----------------------|:---------------------------------------|
| `account`  | String - Adres         | _(İsteğe bağlı)_ Eğer mevcutsa, bu yol adımı belirtilen adreste rippling yaptığını temsil eder. Bu adım `currency` veya `issuer` alanlarını tanımlıyorsa verilmemelidir. |
| `currency` | String - Para Birimi   | _(İsteğe bağlı)_ Eğer mevcutsa, bu yol adımı bir emir defteri veya AMM aracılığıyla para birimleri değiştirir. Belirtilen para birimi yeni para birimini gösterir. Eğer bu adım `account` alanını belirtirse verilmemelidir. |
| `issuer`   | String - Adres         | _(İsteğe bağlı)_ Eğer mevcutsa, bu yol adımı para birimlerini değiştirdiğini ve bu adresin yeni para biriminin vericisini tanımladığını gösterir. Bir adımda `currency` yoksa, yoldaki bir önceki adım vericiyi tanımlar. `currency` sağlanmamışsa ve `issuer`i belirtirse, aynı isimli farklı vericiler arasında bir emir defteri veya AMM kullanan bir yol adımını belirtir. `currency` XRP olduğunda verilmemelidir.  |
| `type`     | Integer                | **KULLANIMDIŞI** _(İsteğe bağlı)_ Hangi diğer alanların mevcut olduğunu gösteren bir belirteç. |
| `type_hex` | String                 | **KULLANIMDIŞI**: _(İsteğe bağlı)_ `type` alanının onaltılık gösterimi. |

Özetle, geçerli alan kombinasyonları aşağıdaki gibidir; isteğe bağlı olarak `type`, `type_hex` veya ikisi de olabilir:

- Sadece `account`
- Sadece `currency`
- `currency` ve `issuer` yalnızca `currency` XRP değilse
- Sadece `issuer`

Bir yol adımında `account`, `currency` ve `issuer` alanlarının herhangi bir başka kullanımı geçersizdir.

Yol setinin ikili serileştirilmesi için kullanılan `type` alanı, aslında tek bir tam sayı üzerinde bit düzeyinde işlemler aracılığıyla yapılandırılır. Bitler aşağıdaki gibi tanımlanmıştır:

| Değer (Onaltılık) | Değer (Ondalık) | Açıklama |
|-------------------|-----------------|----------|
| `0x01`            | 1               | Bir adres değişimi (rippling): `account` alanı mevcuttur. |
| `0x10`            | 16              | Para birimi değişikliği: `currency` alanı mevcuttur. |
| `0x20`            | 32              | Verici değişikliği: `issuer` alanı mevcuttur. |

## Ayrıca Bakınız

- **Kavramlar:**
    - `Çapraz Para Ödemeleri`
    - `Merkeziyetsiz Borsa`
    - `Kısmi Ödemeler`
- **Referanslar:**
    - [Ödeme işlemi][]
    - [path_find method][] (WebSocket yalnızca)
    - [ripple_path_find method][]

