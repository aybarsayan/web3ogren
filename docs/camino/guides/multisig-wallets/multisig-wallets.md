---
sidebar_position: 5
title: Multisig Cüzdanlar & Takma Adlar
description: Multisig cüzdan nedir ve multisig takma adı nedir?
---

# Multisig Cüzdan Nedir?

Multisig cüzdan, çoklu imza cüzdanı olarak da bilinen, bir işlemi yetkilendirmek için farklı taraflardan birden fazla imza gerektiren dijital cüzdan türüdür. Başka bir deyişle, işlemin gerçekleştirilmesi için genellikle birden fazla kişinin onayını gerektirir.

Camino Ağı'nda, bir multisig cüzdan özellikle güvenlik ve risk yönetimi açısından faydalıdır. Bir işlemi yetkilendirmek için birden fazla tarafın onayını gerektirerek, tek bir başarısızlık noktasının veya tek bir tarafın yetkisiz işlemler yapma riskini azaltır.

Örneğin, bir grup birey ortak bir yatırım için fonlarını bir araya toplamak istesin. Cüzdanın kontrolünü tek bir kişiye vermek yerine, belirli bir sayıda imza sahibinin (örneğin, 2'den 3'e, 3'ten 5'e vb.) herhangi bir işlemi onaylaması gereken bir multisig cüzdan oluşturabilirler. 

Multisig cüzdan üyeleri, diğerlerinden onay almadan multisig takma adı için işlemleri imzalama yetkisine sahiptir. Ancak, bir işlemi gerçekleştirmek için imza eşiği karşılanmalıdır.

Kısacası, bir multisig cüzdan, çok sayıda tarafın işlemleri yetkilendirmesini gerektiren güvenli bir kripto para yönetim yoludur. Camino Ağı'nda risk yönetimi ve artan güvenlik için özellikle faydalıdır.

## Multisig Takma Ad Nedir?

Camino Ağı'nda, multisig takma adı veya kontrol grubu, bir multisig cüzdanı yönetmek için birden fazla adresin tek bir tanımlayıcı altında gruplandığı bir tekniktir. Bu tanımlayıcıya takma ad denir ve özel anahtarları olmayan bir normal adrestir. Takma ad, multisig cüzdanını ortaklaşa yönetmekle sorumlu kontrol grubunu temsil eder.

Takma ad kullanımı, kontrol grubunun sahip değiştirme yeteneğine sahip tek bir adrese sahip olmasını sağlar ve geleneksel bir cüzdanla benzer uygulamaların kesintisiz kullanımını mümkün kılar.

Takma adlar, üyeleri ve bir eşiği olan bir multisig cüzdan tanımlar.

:::caution AĞA ÖZEL MULTISIG TAKMA ADLAR

Multisig takma adların kendi ağlarına özel olduğunu unutmayın. Bu, ana ağda oluşturulan bir takma adın doğrudan test ağında kullanılamayacağı anlamına gelir ve bunun tersidir. Farklı bir ağda bir multisig takma adı kullanmak istiyorsanız, o ağda ayrı bir multisig oluşturmanız gerekecektir.

:::

## Multisig Cüzdanlarda Eşik Nedir?

Bir multisig cüzdanında, eşik, bir işlemi yetkilendirmek için gereken minimum imza sahibi sayısını ifade eder. Bir multisig cüzdanı oluştururken, eşik bir parametre olarak tanımlanır ve bununla birlikte imza sahiplerinin (adreslerin) kamu anahtarları listesi gelir.

Örneğin, eşiği 2 olan bir multisig cüzdanı ve 3 imza sahibinden oluşan bir kontrol grubunuz varsa, cüzdandan herhangi bir işlem için 3 imza sahibinden en az 2'sinin imzası gerekecektir. Eşik artırılırsa, 3 imza sahibinin de herhangi bir işlemi imzalaması gerekecektir.

Eşik parametresi, multisig cüzdanında tutulan fonlar üzerinde ek bir güvenlik ve kontrol katmanı sağlar. Minimum bir imza sahibinin bir işlemi yetkilendirmesini gerektirerek, yetkisiz erişim veya dolandırıcılık riskini azaltır, çünkü tek bir imza sahibinin grubun geri kalanından onay almadan bir işlemi gerçekleştirmesi daha zor hale gelir.

Diğer yandan, eşiğin çok yüksek ayarlanması, işlemleri gerçekleştirme sürecinde aksaklıklar veya gecikmelere yol açabilir. Bu nedenle, multisig cüzdanınız için uygun eşiği belirlerken güvenlik ile kullanım kolaylığı arasında bir denge bulmak önemlidir.

Kısacası, multisig cüzdanlarındaki eşik, bir işlemi yetkilendirmek için gereken minimum imza sahibi sayısını ifade eder. Fonlar üzerinde ek bir güvenlik ve kontrol katmanı sağlar, aynı zamanda cüzdanın kullanımını kolaylaştıran bir denge belirler.

## Tek Eşli Multisig Cüzdanlar

Tek eşli multisig cüzdanlar, bir işlemi imzalamak ve yürütmek için sadece bir imza gerektiren multisig cüzdan türüdür. Bu, bir işlemin grubun herhangi bir imza sahibi tarafından yetkilendirilebileceği anlamına gelir ve bu da kullanımını ve yönetimini daha kolay hale getirir.

Tek eşli multisig cüzdanlar, bir grup insanın veya kuruluşun birlikte fonları yönetmesi gerektiği durumlarda sıklıkla kullanılır, ancak fonların kontrolünde tek bir kişinin yetkisi ile ilişkili risklerden kaçınmak isterler. Örneğin, küçük bir işletme masraflarını ve ödemelerini yönetmek için bir tek eşli multisig cüzdan kullanabilir; burada her yetkili çalışan işlemleri yürütmek için bir cüzdana sahip olabilir.

Avantajlar:

- Kullanım kolaylığı: Tek eşli olduğundan, gruptaki herhangi bir imza sahibi işlemleri imzalayıp yürütme yetkisine sahiptir. Bu, kullanımı daha uygun ve daha kolay hale getirir.
- Esneklik: Tek eşli multisig cüzdanlar esnektir ve belirli ihtiyaçlara ve kullanım durumlarına yönelik özelleştirilebilir; örneğin, imza sahiplerinin sayısını ayarlama veya eşik gereksinimlerini değiştirme gibi.

Dezavantajlar:

- Daha yüksek eşik cüzdanlara göre azaltılmış güvenlik: Tek eşli multisig cüzdanlar, yalnızca bir imza gerektirdiğinden daha yüksek eşik gereksinimleri olan cüzdanlardan daha az güvenlik sunar.

Kısacası, tek eşli multisig cüzdanlar, bir grup insan veya kuruluş arasında fons yönetimi için uygun ve esnek bir seçenek sunarken, multisig cüzdanların ek güvenlik avantajlarına da sahiptir. Ancak, daha yüksek eşik multisig cüzdanlar kadar güvenlik sağlamayabilir ve belirli bir kullanım durumu ve gereksinimlere göre avantajları ve dezavantajları dikkate almak önemlidir.

## Camino Cüzdan ile Multisig Cüzdan Yönetimi

Anahtar ifadenizle cüzdanınıza giriş yaptıktan sonra, Anahtarları Yönet bölümüne gidin. Eğer cüzdanınız bir multisig cüzdanının üyesiyse, cüzdanı içe aktarma diyaloğu açılacaktır. Aynı diyaloğa cüzdan değiştirici düğmesinden de erişebilirsiniz. Şekil 1 ve 2, bu diyalogların örneklerini göstermektedir.



Şekil 1: Cüzdanları İçe Aktarma Diyaloğu




Şekil 2: Cüzdan Değiştirici Diyaloğu


İçe aktar butonuna tıkladıktan sonra, multisig cüzdanlarınız ve bunların ilişkilendirilmiş adresleri, Şekil 3'te gösterildiği gibi görünecektir.

:::note

Bu örneğin üç multisig cüzdan içerdiği önemli bir nokta; multisig cüzdanına üye olan çoğu kullanıcının tipik olarak yalnızca bir adet multisig cüzdanı olacaktır.

:::



Şekil 3: İçi Aktarılan Multisig Cüzdanlar


İlgili cüzdanı etkinleştirmek için yıldız simgesine tıklayabilirsiniz. Bu, fonlarını görmenizi ve aktarmanızı, ayrıca işlemleri imzalamanızı ve gerçekleştirmenizi sağlar.

Multisig sahipleri butonuna tıklayarak, cüzdanın diğer üyelerini ve eşiği görüntüleyebilirsiniz, Şekil 4'te gösterildiği gibi.



Şekil 4: Cüzdan Sahipleri & Eşik


Bu panelde, "ilişkilendirilmiş cüzdanlar", Camino Cüzdan'a içe aktarılan ve işlemleri imzalamak ve yürütmek için kullanılabilen adresleri ifade eder. "ilişkilendirilmemiş cüzdanlar", Camino Cüzdan'a içe aktarılmamış multisig cüzdanın diğer üyeleridir. Bu cüzdanların sahipleri, multisig işlemleri imzalamak için Camino Cüzdan'a giriş yapmalıdır.

## Arka Planda Nasıl Çalışır?

### Signavault Hizmeti

Daha önce bahsedildiği gibi, multisig işlemlerinin başarılı bir şekilde yürütülmesi, her işlemin eşik tarafından tanımlanan minimum sayıda cüzdan tarafından imzalanmasını gerektirir. Bu, imzasız bir işlem oluşturulmasını ve imzaların toplanmasını içerir. Bu süreci kullanıcılar için basitleştirmek amacıyla Camino Cüzdan, Signavault adında bir hizmet kullanır.

Bir kullanıcı bir multisig işlemi başlattığında, cüzdan işlem oluşturur ve bunu Signavault hizmetine iletir. Bu, multisig grubundaki diğer üyelerin, imzalarını gerektiren bekleyen işlemleri kontrol etmek için Signavault hizmetini sorgulamasını sağlar. Eğer böyle işlemler varsa, imzalayabilirler ve imzaları Signavault içinde saklayabilirler. Nihayetinde, eşik gereksinimi karşılandığında grup üyelerinden herhangi biri işlemi yürütme yetkisine sahip olur.