---
title: Çevrimiçi Silme
seoTitle: Çevrimiçi Silme Özelliği ve Kullanımı
sidebar_position: 4
description: Çevrimiçi silme, rippled sunucusunun eski sistem verilerini temizlemesine olanak tanır. Bu süreç, disk alanının etkin yönetimini sağlar.
tags: 
  - çevrimiçi silme
  - rippled
  - veri saklama
  - defter geçmişi
  - yapılandırma
keywords: 
  - çevrimiçi silme
  - veri saklama
  - defter geçmişi
  - rippled
  - yapılandırma
---
# Çevrimiçi Silme
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/misc/SHAMapStoreImp.cpp "Source")

Çevrimiçi silme özelliği, `rippled` sunucusunun eski defter sürümlerinin yerel kopyasını silmesine olanak tanır; böylece diskin kullanımı zamanla hızla büyümez. Varsayılan yapılandırma dosyası, çevrimiçi silmeyi otomatik olarak çalışacak şekilde ayarlar, ancak çevrimiçi silme, yalnızca bir talep geldiğinde çalışacak şekilde de yapılandırılabilir.

Sunucu her zaman defterin _mevcut_ durumu ile birlikte tüm bakiyeleri ve ayarları saklar. Silinen veriler, saklanan geçmişten daha eski olan eski işlemleri ve defter durumunun sürümlerini içerir.

Varsayılan yapılandırma dosyası, `rippled` sunucusunun en son 2000 defter sürümünü saklamasını ve daha eski verileri otomatik olarak silmesini ayarlar.

:::tip
Çevrimiçi silme olsa bile, aynı zaman diliminde saklanan defter verileri için gereken disk alanı zamanla artar, çünkü bireysel defter sürümlerinin boyutu zamanla büyüme eğilimindedir. Bu büyüme, eski defterleri silmeden gerçekleşen veri birikimi ile karşılaştırıldığında çok yavaştır. Disk alanı ihtiyaçları hakkında daha fazla bilgi için `Kapasite Planlaması` sayfasına bakın.
:::

---

## Arka Plan

`rippled` sunucusu, _defter deposunda_ `defter geçmişini` saklar. Bu veriler zamanla birikir.

Defter deposunda, defter verileri "de-duplicate" edilir. Diğer bir deyişle, sürümden sürüme değişmeyen veriler yalnızca bir kez saklanır. Defter deposundaki kayıtlar, hangi defter sürümü(leri) içerdiklerini göstermez; çevrimiçi silmenin bir kısmı, hangi kayıtların yalnızca eski defter sürümleri tarafından kullanıldığını belirlemektir. Bu işlem zaman alıcıdır ve disk I/O ve uygulama önbelleğini etkiler, bu nedenle sunucu her yeni defteri kapattığında eski verileri silemez.

## Çevrimiçi Silme Davranışı

Çevrimiçi silme ayarları, `rippled` sunucusunun defter deposunda aynı anda ne kadar defter sürümünü tutması gerektiğini yapılandırır. Ancak, belirtilen sayı bir kılavuzdur, katı bir kural değildir:

- Sunucu, yapılandırılmış defter sürümü sayısından daha yakın olan verileri asla silmez, ancak yeterince uzun süre çalışmamışsa veya herhangi bir zaman diliminde ağ ile senkronizasyonu kaybetmişse, tutulan sürüm sayısı bu sayıdan daha az olabilir. (Sunucu en azından bazı geçmiş verileri geri doldurmaya çalışır; detaylar için `geçmişi alma` sayfasına bakın.)
- Sunucu, çevrimiçi silmenin otomatik olarak çalışacak şekilde ayarlanması durumunda, yapılandırılmış defter sürümü sayısının biraz daha fazlasını saklayabilir. (Her çalıştığında, saklanan defter sürümü sayısını yaklaşık olarak yapılandırılmış sayıya indirir.)

    Eğer çevrimiçi silme sunucu meşgulken gecikirse, defter sürümleri birikmeye devam edebilir. Normalde çalıştığında, çevrimiçi silme, sunucu yapılandırılmış defter sürümü sayısının iki katına ulaştığında başlar, ancak daha fazla defter sürümü birikene kadar tamamlanmayabilir.

- Tavsiye edilen silme etkinleştirildiğinde, sunucu elde ettiği ve oluşturduğu tüm defter sürümlerini saklar; yönetici [can_delete method][] çağrısını yapana kadar.

    Sunucunun sakladığı veri miktarı, [can_delete][can_delete method] yöntemini ne sıklıkla çağırdığınıza ve `online_delete` ayarının ne kadar zaman aralığını gösterdiğine bağlıdır:

    - Eğer `can_delete` çağrınızı `online_delete` aralığından _daha sık_ yaparsanız, sunucu **`online_delete` sayısının iki katı kadar** defter sürümünü saklar. (Silme işlemi sonrasında bu, yaklaşık `online_delete` değerine indirilir.)

        Örneğin, `can_delete` çağrısını günde bir kez ve `online_delete` değeri 50.000 olarak ayarlanırsa, sunucu tipik olarak silme işleminden önce 100.000 defter sürümüne kadar saklar. Silme işleminden sonra sunucu en az 50.000 defter sürümünü (yaklaşık iki gün) saklar. Bu yapılandırmada, her yaklaşık `can_delete` çağrısı, sunucunun silinecek yeterli defter sürümü olmadığı için değişiklik sağlamaz.

    - Eğer `can_delete` çağrınızı `online_delete` aralığından _daha az sıklıkla_ yaparsanız, sunucu en fazla, `can_delete` çağrıları arasındaki zaman aralığını yaklaşık olarak **iki katı kadar** kapsayan defter sürümlerini saklar. (Silme işleminden sonra bu, yaklaşık bir aralık kadar veri olarak indirilir.)

        Örneğin, `can_delete` çağrısını günde bir kez ve `online_delete` değeri 2000 olarak ayarlanırsa, sunucu tipik olarak silme işleminden önce iki gün değerindeki tam defter sürümlüğünü saklar. Silme işleminden sonra sunucu yaklaşık bir gün değerinde (yaklaşık 25.000 defter sürümünü) saklar, ancak asla 2000 defter sürümünden daha azını saklamaz.

Çevrimiçi silme etkinleştirildiğinde ve otomatik çalıştığında (yani tavsiye edilen silme devre dışı bırakıldığında), sunucunun sakladığı toplam defter verisi, sunucunun saklaması için yapılandırıldığı defter sürümü sayısına eşit kalmalıdır ve maksimum değeri yaklaşık iki katıdır.

Çevrimiçi silme çalıştığında, diskteki SQLite veritabanı dosyalarının boyutunu azaltmaz; yalnızca bu dosyalardaki alanı yeni veriler için yeniden kullanılabilir hale getirir. Çevrimiçi silme, defter deposunu içeren RocksDB veya NuDB veritabanı dosyalarının boyutunu azaltır.

Sunucu, silme işlemini ne kadar geri alabileceğini belirlerken yalnızca doğrulanan defter sürümlerini sayar. Sunucunun yeni defter sürümlerini doğrulayamaması durumunda (ya yerel ağ bağlantısındaki bir kesinti nedeniyle ya da global XRP Ledger ağının bir konsensüs sağlamakta zorlanması durumunda), `rippled` defterleri kapatmaya devam eder, böylece ağ yeniden sağlandığında hızlı bir şekilde geri kazanabilir. Bu durumda, sunucu, birçok kapalı ancak henüz doğrulanmamış defter sürümünü biriktirebilir. Bu doğrulanmamış defterler, sunucunun çevrimiçi silme işlemi gerçekleştirmeden önce sakladığı _doğrulanan_ defter sürümlerini etkilemez.

### Çevrimiçi Silmeyi Kesmek

Çevrimiçi silme otomatik olarak `sunucu durumu` `full` seviyesinin altına düştüğünde durur. Bu durumda, sunucu `SHAMapStore::WRN` öneki ile bir günlük mesajı kaydeder. Sunucu, tam olarak senkronize olduktan sonra bir sonraki doğrulanan defter sürümünden sonra çevrimiçi silmeyi başlatmaya çalışır.

Eğer sunucuyu durdurursanız ya da çevrimiçi silme işlemi çalışırken çöküş olursa, sunucu yeniden başlatıldığında çevrimiçi silme süreci tekrar başlar ve sunucu tam olarak senkronize olduğunda devam eder.

Çevrimiçi silmeyi geçici olarak devre dışı bırakmak için, [can_delete method][] yöntemini `never` argümanıyla kullanabilirsiniz. Bu değişiklik, çevrimiçi silmeyi tekrar etkinleştirmek için [can_delete][can_delete method] yöntemini çağırana kadar kalıcıdır. Çevrimiçi silmenin ne zaman gerçekleşeceğini kontrol etme hakkında daha fazla bilgi için `Tavsiye Edilen Silme` sayfasına bakın.

## Yapılandırma

Aşağıdaki ayarlar, çevrimiçi silme ile ilgilidir:

- **`online_delete`** - Saklanacak doğrulanan defter sürümü sayısını belirtin. Sunucu belirli aralıklarla bu sayıdan daha eski olan defter sürümlerini siler. Belirtilmediği takdirde, hiçbir defter silinmez.

    Varsayılan yapılandırma dosyası bu değer için 2000 olarak ayarlıdır. Bu değer 256'dan az olamaz, çünkü `Ücret Oylaması` ve `Değişiklik Süreci` gibi bazı olaylar yalnızca her 256 defterde bir güncellenir.

    :::warning
    Eğer `rippled` sunucusunu `online_delete` kapalı olarak çalıştırırsanız, daha sonra `online_delete`'yi etkinleştirip sunucuyu yeniden başlatırsanız, sunucu `online_delete` devre dışı iken zaten indirilen mevcut defter geçmişini göz ardı eder ancak silmez. Disk alanını tasarruf etmek için, `online_delete` ayarını değiştirdikten sonra sunucuyu yeniden başlatmadan önce mevcut geçmişinizi silin.
    :::

- **`[ledger_history]`** - Geri doldurması gereken doğrulanan defter sayısını belirtin. `online_delete` değerine eşit veya daha az olmalıdır. Sunucu, böyle bir sayı ile doğrulanan bu kadar çok defter sürümüne sahip değilse, mümkün olduğunda komşulardan bu verileri almaya çalışır.

    Bu ayar için varsayılan değer 256 defterdir.

    Aşağıdaki diyagram, `online_delete` ve `ledger_history` ayarları arasındaki ilişkiyi göstermektedir:



- **`advisory_delete`** - Etkinleştirildiğinde, çevrimiçi silme otomatik olarak planlanmaz. Bunun yerine, bir yönetici çevrimiçi silmeyi elle başlatmak zorundadır. Devre dışı bırakılmış için `0` veya etkinleştirilmiş için `1` değerini kullanın.

    Bu ayar varsayılan olarak devre dışıdır.

- **`[fetch_depth]`** - Komşulara sunulacak defter sürümü sayısını belirtin. Sunucu, belirtilen defter sürümü sayısından daha eski tarihli verilere yönelik komşulardan gelen getirme taleplerini kabul etmez. Komşulara mevcut verileri sunmak için `full` değerini belirtin.

    `fetch_depth` için varsayılan değer `full`'dır (tüm mevcut verileri sunmak).

    `fetch_depth` ayarı, her ikisi de belirtilmişse, `online_delete` değerinden daha yüksek olamaz. Eğer `fetch_depth` daha yüksek ayarlanmışsa, sunucu bunu `online_delete` ile eşit olarak kabul eder.

    Aşağıdaki diyagram, `fetch_depth`'in nasıl çalıştığını göstermektedir:


Farklı geçmiş miktarlarını saklamak için gerekli olan disk alanı tahminleri için `Kapasite Planlaması` sayfasına bakın.

### Tavsiye Edilen Silme

Varsayılan yapılandırma dosyası, çevrimiçi silmeyi otomatik ve dönemsel olarak gerçekleştirmek üzere planlar. Eğer yapılandırma dosyası bir `online_delete` aralığı belirlemiyorsa, çevrimiçi silme gerçekleşmez. Eğer yapılandırma dosyası `advisory_delete` ayarını etkinleştiriyorsa, çevrimiçi silme yalnızca bir yönetici bunu [can_delete method][] ile tetiklediğinde gerçekleşir.

Zaman damgasına dayalı olarak çevrimiçi silmeyi tetiklemek için, çevrimiçi silmeyi bir görevle planlayabilirsiniz. Eğer sunucunuz yoğun kullanılıyorsa, çevrimiçi silmeden kaynaklanan ek yük, sunucunuzun geride kalmasına ve geçici olarak konsensüs ağından senkronizasyonunu kaybetmesine neden olabilir. Bu durumda, çevrimiçi silmeyi tavsiye edilen silme ile kullanabilir ve yalnızca yoğun olmayan saatlerde gerçekleşecek şekilde planlayabilirsiniz.

Tavsiye edilen silmeyi başka nedenlerle de kullanabilirsiniz. Örneğin, bir veri yedeğinin ayrı bir sunucuya alındığını manuel olarak doğrulamak isteyebilirsiniz, veri silinmeden önce. Alternatif olarak, bu verilerin silinmesinden önce başka bir işlemin işlem verilerini işleme sürecinin tamamlandığını manuel olarak onaylayabilirsiniz.

`can_delete` API yöntemi, genel olarak veya belirli bir defter sürümüne kadar otomatik silmeyi etkinleştirebilir veya devre dışı bırakabilir, eğer `advisory_delete` yapılandırma dosyasında etkinleştirilmişse. Bu ayar değişiklikleri, `rippled` sunucusunu yeniden başlatsanız bile kalıcıdır; ancak `advisory_delete` ayarını yapılandırma dosyasında devre dışı bırakırsanız yeniden başlatmadan önce bu kalıcılığı kaybedersiniz.

## Nasıl Çalışır

Çevrimiçi silme işlemi, iki veritabanası oluşturularak çalışır: belirli bir zamanda, "eski" veritabanı yalnızca okunabilir durumda olur ve "mevcut" veritabanı ise yazılabilir durumdadır. `rippled` sunucusu her iki veritabanından nesneleri okuyabilir; bu nedenle mevcut defter sürümleri her iki veritabanında da nesneleri içerebilir. Eğer bir nesne, defter sürümünden defter sürümüne değişmiyorsa, o nesnenin yalnızca bir kopyası veritabanında tutulur; böylece sunucu o nesnenin gereksiz tekrarını saklamaz. Yeni bir defter sürümü bir nesneyi değiştirdiğinde, sunucu değiştirilen nesneyi "yeni" veritabanında saklar; önceki sürümdeki nesne (hala önceki defter sürümleri tarafından kullanılan) "eski" veritabanında kalır.

Çevrimiçi silme zamanı geldiğinde, sunucu ilk olarak saklanacak en eski defter sürümünü gözden geçirir ve o defter sürümündeki tüm nesneleri yalnızca okunabilir "eski" veritabanından "mevcut" veritabanına kopyalar. Bu, "mevcut" veritabanının şimdi seçilen defter sürümünde kullanılan ve daha yeni sürümlerde kullanılacak tüm nesneleri içerdiğini garanti eder. Ardından sunucu "eski" veritabanını siler ve mevcut olan "mevcut" veritabanını "eski" ve yalnızca okunabilir olur. Sunucu, bu noktadan itibaren daha yeni değişiklikleri içerecek yeni bir "mevcut" veritabanı başlatır.



## Ayrıca Bakınız

- **Kavramlar:**
    - `Defterler`
    - `Konsensus`
- **Kılavuzlar:**
    - `Kapasite Planlaması`
    - `rippled` Yapılandırması`
        - `Çevrimiçi Silmeyi Yapılandır`
        - `Tavsiye Edilen Silmeyi Yapılandır`
        - `Tarih Parçalama Yapılandırması`
        - `Tam Tarih Yapılandırması`
- **Referanslar:**
    - [ledger method][]
    - [server_info method][]
    - [ledger_request method][]
    - [can_delete method][]
    - [ledger_cleaner method][]

