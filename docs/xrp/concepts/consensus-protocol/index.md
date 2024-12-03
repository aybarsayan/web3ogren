---
title: Konsensüs Protokolü
seoTitle: XRP Ledger Konsensüs Protokolü
sidebar_position: 4
description: Konsensüs, XRP Ledger blok zincirinin yeni işlem bloklarını nasıl onayladığını açıklar. Bu, merkeziyetsiz sistemlerin nasıl çalıştığının temelini anlamanıza yardımcı olacaktır.
tags: 
  - Konsensüs
  - XRP Ledger
  - blok zinciri
  - merkeziyetsiz sistemler
  - dijital varlıklar
keywords: 
  - Konsensüs
  - XRP Ledger
  - blok zinciri
  - merkeziyetsiz sistemler
  - dijital varlıklar
---

# Konsensüs Protokolü

Bu konu, merkeziyetsiz XRP Ledger'in yeni işlemleri ve defter versiyonlarını nasıl onayladığını, bir blok zinciri oluşturarak açıklar.

**Konsensüs**, herhangi bir merkeziyetsiz ödeme sisteminin en önemli özelliğidir. Geleneksel merkezi ödeme sistemlerinde, bir yetkili yönetici ödemelerin nasıl ve ne zaman gerçekleşeceği konusunda nihai kararı verir. Merkeziyetsiz sistemler, tanımı gereği, bunu yapacak bir yöneticisi yoktur. Bunun yerine, XRP Ledger gibi merkeziyetsiz sistemler, tüm katılımcıların uyması gereken bir kural seti tanımlar ve böylece her katılımcı, her zaman birebir aynı olaylar dizisi üzerinde hemfikir olabilir. Bu kural setine _konsensüs protokolü_ diyoruz.

## Konsensüs Protokolü Özellikleri

XRP Ledger, daha önceki herhangi bir dijital varlığa benzemeyen bir konsensüs protokolü kullanmaktadır. XRP Ledger Konsensüs Protokolü olarak bilinen bu protokol aşağıdaki önemli özelliklere sahiptir:

- XRP Ledger'i kullanan herkes en son durumu ve hangi işlemlerin hangi sırayla gerçekleştiği konusunda hemfikir olabilir.
- Tüm geçerli işlemler, merkezi bir operatöre ihtiyaç olmadan ve tek bir hata noktasına sahip olmaksızın işlenir.
- Defter, bazı katılımcılar katıldığında, ayrıldığında veya uygunsuz davrandığında bile ilerleme kaydedebilir.
- Çok fazla katılımcı ulaşılamaz veya kötü davranıyorsa, ağ ilerleme kaydedemez, geçersiz işlemleri onaylama yerine.
- İşlemlerin onaylanması, çoğu diğer blok zinciri sistemlerinin aksine israf veya rekabetçi kaynak kullanımı gerektirmemektedir.

> **Anahtar Not:** Bu özellikler, öncelik sırasına göre aşağıdaki ilkeler olarak özetlenebilir: **Doğruluk, Anlaşma, İlerleme**.  
> — Konsensüs Protokolü Özellikleri Belirleme Kılavuzu

Bu protokol hâlâ gelişmektedir; bununla birlikte, sınırları ve olası hata durumları hakkında bilgimiz de. Protokolün kendisi üzerine akademik araştırmalar için lütfen `Konsensüs Araştırması` sayfasına bakın.

## Arka Plan

Konsensüs protokolleri, _çift harcama sorunu_ için bir çözüm sunmaktadır: aynı dijital paranın iki kez harcanmasını önlemek için zorluk. Bu sorunun en zor kısmı, işlemleri sıralamaktır: merkezi bir otorite olmadan, aynı zamanda gönderilen iki veya daha fazla birbirini dışlayan işlem hakkında hangi işlemin önce geldiğine dair anlaşmazlıkları çözmek zor olabilir. Çift harcama sorununu, XRP Ledger Konsensüs Protokolü'nün nasıl çözdüğünü ve ilgili pazarlıkları ve sınırlamaları detaylı analiz için `Konsensüs İlkeleri ve Kuralları` sayfasına bakın.

## Defter Tarihçesi

XRP Ledger, işlemleri "defter versiyonları" veya kısaca "defterler" olarak adlandırılan bloklarda işler. Her defter versiyonu üç parçadan oluşur:

- Defterde depolanan tüm bakiyelerin ve nesnelerin mevcut durumu.
- Bu deftere erişimi sağlamak için önceki deftere uygulanan işlemler seti.
- Mevcut defter versiyonu hakkında, içeriğini benzersiz bir şekilde tanımlayan bir [kriptografik hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function) gibi, defter dizini bilgileri ve bu defterin inşası için temel olarak kullanılan ana defter hakkında meta veriler.



Her defter versiyonu bir _defter dizini_ ile numaralandırılır ve bir önceki defter versiyonuna dayalı olarak oluşturulur; bu, _genesis ledger_ olarak adlandırılan bir başlangıç noktasına kadar gider, yani 1 numaralı defterdir.`¹` Bitcoin ve diğer blok zinciri teknolojileri gibi, bu durum tüm işlemlerin ve sonuçlarının kamuya açık bir tarihçesini oluşturur. Birçok blok zinciri teknolojisinin aksine, XRP Ledger'deki her yeni "blok", mevcut durumun tamamını içerdiğinden, şimdi olanları anlamak için tüm tarihçeyi toplamanıza gerek yoktur.`²`

XRP Ledger Konsensüs Protokolü'nün ana hedefi, bir sonraki defter versiyonuna eklemek için bir dizi işlem üzerinde hemfikir olmaktır; bunları iyi tanımlanmış bir sırayla uygulamak ve herkesin aynı sonuçları aldığını onaylamaktır. Bu başarıyla gerçekleştiğinde, bir defter versiyonu _doğrulanmış_ ve nihai olarak kabul edilir. Buradan, bir sonraki defter versiyonunu oluşturarak işlemler devam eder.

:::info
Bu sürecin etkinliği, ağın güçlü bir şekilde çalışmasını sağlar ve güvenilirlik sağlar.
:::

## Güvene Dayalı Doğrulama

XRP Ledger'in konsensüs mekanizmasının temel ilkesi, biraz güvenin uzun bir yol kat ettiğidir. Ağdaki her katılımcı, `konsensüse aktif olarak katılacak şekilde özel olarak yapılandırılmış sunucular` olan bir _doğrulayıcılar_ seti seçer; bu sunucular, protokole göre çoğu zaman dürüst davranmaları beklenen farklı taraflar tarafından işletilmektedir. Daha da önemlisi, seçilen doğrulayıcılar setinin, kuralları tam olarak aynı şekilde ihlal etmek için iş birliği yapma olasılığı düşük olmalıdır. Bu listeye _Benzersiz Düğüm Listesi_ veya UNL denir.

Ağ ilerledikçe, her sunucu, güvenilir doğrulayıcılarından gelen bilgileri dinler`³`; yeterince büyük bir yüzdesi, bir işlem setinin gerçekleşmesi gerektiği ve belirli bir defterin sonuç olduğu konusunda hemfikir olduğunda, sunucu bir konsensüs ilan eder. Eğer hemfikir olmazlarsa, doğrulayıcılar tekliflerini, güvenilir oldukları diğer doğrulayıcılarla daha yakından eşleşecek şekilde değiştirir, bu süreci birkaç tur boyunca tekrarlayarak bir konsensüs oluştururlar.



Güvenilir doğrulayıcıların küçük bir oranının her zaman düzgün çalışmaması sorun değildir. Güvenilir doğrulayıcıların %20'sinden azı hatalı olduğu sürece, konsensüs kesintisiz devam edebilir; geçersiz bir işlemi onaylamak ise güvenilir doğrulayıcıların %80'inin iş birliği yapmasını gerektirir. Güvenilir doğrulayıcıların %20'sinden fazla ama %80'inden azı hatalıysa, ağ ilerleme kaydedemez.

:::warning
Konsensüs sürecinde dikkat edilmesi gereken en önemli husus, doğrulayıcıların güvenilirliğidir.
:::

XRP Ledger Konsensüs Protokolü'nün çeşitli zorluklar, saldırılar ve hata durumlarına nasıl yanıt verdiğini keşfetmek için `Konsensüsün Saldırılara ve Hata Modlarına Karşı Korunması` sayfasını inceleyin.

----

## Dipnotlar

1.  XRP Ledger'in tarihinin başlarında yaşanan bir aksilik nedeniyle, [1 ile 32569 arasındaki defterler kayboldu](http://web.archive.org/web/20171211225452/https://forum.ripple.com/viewtopic.php?f=2&t=3613). (Bu kayıp, defter tarihinin yaklaşık ilk haftasını temsil eder.) Bu nedenle, 32570 numaralı defter herhangi bir yerde mevcut olan en eski defterdir. XRP Ledger'in durumu her defter versiyonunda kaydedildiği için, defter kayıp tarih olmadan devam edebilir. Yeni test ağları hâlâ 1 numaralı defter ile başlar.

2.  Bitcoin'de, mevcut durum bazen "UTXO'lar" (harcanmamış işlem çıktıları) seti olarak adlandırılır. XRP Ledger'in aksine, bir Bitcoin sunucusunun UTXO'ların tamamını bilmek ve yeni işlemleri işlemek için tüm işlem tarihini indirmesi gerekir. 2018 itibarıyla, yeni sunucuların böyle yapmasına gerek kalmadan en son UTXO'ları belirli aralıklarla özetlemek için Bitcoin'in konsensüs mekanizmasını değiştirmeye yönelik bazı öneriler olmuştur. Ethereum, XRP Ledger gibi her blokta mevcut durumun bir özeti (bir _durum kökü_ olarak adlandırılır) ile benzer bir yaklaşım kullanır, ancak Ethereum büyük miktarda durum verisi depoladığı için senkronizasyon daha uzun sürmektedir. 

3.  Bir sunucu, güvenilir doğrulayıcılarına doğrudan bağlı olmadan onlardan haber alabilir. XRP Ledger eşler arası ağı, sunucuların birbirlerini açık anahtarlarla tanımladığı ve başkalarının dijital olarak imzalanmış mesajlarını ilettiği bir _dedikodu protokolü_ kullanır.