---
title: Yönetim
seoTitle: Connect Projesi Yönetimi
sidebar_position: 10
description: Sadelik, güvenilirlik ve birlikte çalışabilirlik değerlerini temel alan Connect projesinin yönetimi ve davranış kuralları hakkında bilgi.
tags: 
  - Connect
  - Yönetim
  - Açık Kaynak
  - Topluluk
keywords: 
  - Connect
  - Yönetim
  - Açık Kaynak
  - Topluluk
---
Sadelik, güvenilirlik ve birlikte çalışabilirlik, Connect RPC kütüphanelerinin temel değerleridir. Bu değerlerin Connect projesinin yönetimini de karakterize etmesini isteriz:

- Basit, açık karar alma,
- Güvenilir, satıcıdan bağımsız yönetim, ve
- Topluluk katkılarına açıklık.

Bu amaçlarla, bu belge [Connect projesinin][project] kendini nasıl yönettiğine dair kuralları ortaya koymaktadır.

## Davranış kuralları

Connect topluluğu, CNCF [davranış kuralları][cncf-coc] ve [değerler beyanı][cncf-charter] ile hareket eder. Birbirimizle ve diğer topluluklarla açık, meraklı ve iş birliği içinde olmayı amaçlıyoruz.

## Karar alma

Connect bir açık kaynak projesidir, bu nedenle kararları açık bir ortamda alırız. Connect'in yönetimi, protokolleri ve API'leri [GitHub][project] üzerinde tanımlanmıştır, bu nedenle karar almak kaynak kodunu değiştirmeyi gerektirir. Bu nedenle, tüm kararlar aynı dört adımı izler:

1. İsteğe bağlı olarak, bir konu veya tartışma oluşturun. Bunu herkes yapabilir.
2. Bir çekme isteği açın. Bunu herkes yapabilir.
3. Çekme isteğini tartışın. Bunu herkes yapabilir.
4. Çekme isteğini birleştirin veya reddedin. Bunu yalnızca sürücüler yapabilir.

Her depo, mevcut sürücüleri `MAINTAINERS.md` dosyasında listeler. (Sürücü ekleme ve çıkarma süreci aşağıda ayrıntılı olarak açıklanmıştır.)

Kararları ilgili topluluk üyeleri arasında çözmeyi tercih ediyoruz ve Connect'in değerlerini ve davranış kurallarını göz önünde bulunduruyoruz. İlgili topluluk üyeleri bir uzlaşmaya varamazsa, mevcut sürücüler arasında oy çağrısı yapılabilir:

- Oylar GitHub çekme isteği incelemeleri olarak uygulanır.
- Devam eden bir oylama içeren çekme istekleri `vote` etiketi taşımalı ve en az iki hafta açık kalmalıdır, aksi takdirde daha önce bir karar alınırsa kapatılabilir.
- Her sürücü bir oy kullanabilir; onay için basit bir çoğunluk gereklidir.
- Birden fazla deyi etkileyen herhangi bir karar, aşağıda açıklanan bir RFC'de tartışılmalıdır.

## Proje genelinde kararlar

Birden fazla deyi etkileyen kararları almak için Connect, RFC'leri kullanır: [web sitesi ve yönetim deposuna][governance-repo] bir kamu tasarım belgesi ekleyen çekme istekleri. Bir RFC açma mekanizmaları [katkı rehberinde][governance-contrib] belgelenmiştir.

RFC'ler için karar alma süreci, diğer çekme istekleri için olduğu gibi aynı — tartışma, ardından sürücüler arasında uzlaşma veya resmi bir oylama. Ancak, yönetim deposundaki sürücü listesi özel olarak yönetilir: Connect uygulamalarının tüm sürücülerini içerir, ancak ek projelerin sürücülerini içermez. Bu politika, her dil ekosisteminin ihtiyaçlarını dikkate alırken oylama sürecini hafif tutar ve projeyi genişletme konusundaki engelleri minimize eder.

### Uygulamalar ve ek projeler

RFC'lere oy verebilecek Connect uygulamalarının yetkili listesi, [yönetim deposunun `MAINTAINERS.md` dosyası][rfc-maintainers]'dır. Bu nedenle, uygulama listesini değiştirmek için bir çekme isteği açılmalıdır ve bu isteğin mevcut yönetim deposu sürücüleri tarafından onaylanması ve birleştirilmesi gerekmektedir.

Uygulamalar, Connect projesinin temelini oluşturur. Genellikle yaygın olarak kullanılan bir HTTP kütüphanesinin üzerine inşa edilmiştir ve Connect RPC [protokolünü][protocol] uygular. Uygulamalar yalnızca istemci olabilir, örneğin [Swift uygulaması][connect-swift] gibi veya hem sunucu hem de istemcileri destekleyebilir, örneğin [Go uygulaması][connect-go] gibi. Her Connect uygulamasının sürücüleri, RFC sürecinde kendi dil topluluklarının çıkarımlarını temsil eder.

Ek projeler uygulamaların üzerine inşa edilerek isteğe bağlı özellikler veya kolaylıklar sağlar. Örnekler arasında interceptors, Envoy filtreleri ve çalışma zamanı Protobuf betimleyicisine erişim sayılabilir. Ek projelerin sürücüleri, bireysel depolarında çekme istekleri üzerinde oy kullanabilir, ancak Connect RFC'lerinde oy kullanamazlar (bir uygulamanın da sürücüsü değillerse).

## Sürücü olma

Sürücüler (veya CNCF terimiyle "committers"), bir Connect projesinin uzun vadeli başarısına adanmış katkıcılardır. Çekme istekleri açmanın yanı sıra, sürücüler:

- Çekme isteklerini, konuları ve tartışmaları önceliklendirebilir, etiketler ve gözden geçirenler atayabilir.
- Sürekli entegrasyon testlerini çalıştırabilir ve çekme isteklerini birleştirebilir.
- Proje resmi bir karar vermesi gerektiğinde oy kullanabilir.

Sürücü olabilmek için katkıcıların:

- Diğer sürücülerle karşılaştırılabilir bir süre boyunca, kaynak koduna katkıda bulunması, çekme isteklerine yorum yapması, konulara cevap vermesi ve kullanıcı sorularını yanıtlaması gerekir (en az 3 ay).
- Dikkate değer bir bölümünü Connect'e ayırması,
- Koruma altına almak istedikleri projeyi derinlemesine anlamalarını göstermeleri gerekir.
- GitHub hesaplarında iki faktörlü kimlik doğrulama etkinleştirilmiş olmalıdır.

Her zaman olduğu gibi, bir sürücüyü ekleme kararı, bir çekme isteği açmakla alınır — bu durumda, `MAINTAINERS.md` dosyasına. Mevcut proje sürücüleri, çekme isteği üzerinde uzlaşmaya varırlar veya oy kullanırlar. Projenin aktif sürücüleri yoksa, [yönetim deposu][governance-repo] sürücüleri çekme isteğini onaylamak için oy kullanabilir. Genellikle, potansiyel sürücüler bir çekme isteği açmadan önce mevcut sürücülerle adaylıklarını tartışırlar.

## Sürücü statüsünü kaybetme

Sürücüler, bir veya daha fazla deponun `MAINTAINERS.md` dosyasını değiştirmek için bir çekme isteği açarak istifa edebilirler. İsterlerse, kendilerini eski sürücü olarak listelemeye devam edebilirler.

Bir sürücü üç ay boyunca katkıda bulunmadıysa, başka bir sürücü onları sürücü listesinden çıkarmak için bir çekme isteği açabilir. Önceden bildirim yapılması gerekmez, ancak çekme isteği, mevcut olmayan sürücüyü etiketlemeli, iki hafta açık kalmalı ve projenin sürücülerinin çoğunluğu tarafından onaylanmalıdır.

Bir deponun aktif sürücüsü yoksa, devamsız sürücüler, [yönetim deposu][governance-repo] sürücülerinin çoğunluğu tarafından onaylanan bir çekme isteği ile çıkarılabilir.

## Yeni depolar ekleme

CNCF [davranış kuralları][cncf-coc] ve [tüzüğe][cncf-charter] uygun olduğu sürece, depolar yukarıda belirtilen RFC sürecini takip ederek Connect GitHub organizasyonuna eklenebilir. Yeni Connect uygulamaları için RFC'ler, sürücülerinin Connect'in [yönetim deposunun][governance-repo] sürücüleri olacağı durumlarda, çekme isteğinde yönetim deposunun `MAINTAINERS.md` dosyasına bir ekleme içermelidir.

## Değişiklikler

Connect'in yönetiminde herhangi bir değişiklik, yukarıdaki oylama sürecinden geçmelidir: ya bu belgeye bir çekme isteği olarak, ya da bir RFC olarak.

> **Not:** Tüm süreçler, Connect projesinin değerlerine uygun olarak, topluluk üyeleri arasında açık bir iletişim sağlamak için tasarlanmıştır.