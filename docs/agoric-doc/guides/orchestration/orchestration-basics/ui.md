---
title: DApp Kullanıcı Arayüzü
---

# DApp Kullanıcı Arayüzü

Bu bölümde, Orkestrasyon dApp'in kullanıcı arayüzünü oluşturan bileşenleri inceleyeceğiz.

## `Orchestration`

 bileşeni, Orkestrasyon dApp'in kullanıcı arayüzü için ana kontrol merkezi olarak hizmet eder. Kullanıcıların hesap oluşturmasını, bakiyelerini yönetmesini ve yatırımlar, çekimler, staking ve unstaking gibi çeşitli blok zinciri işlemlerini gerçekleştirmek için gereken durum ve etkileşimleri yönetir.

## `AccountList`

 bileşeni, kullanıcı hesaplarının ve bunlara ait bakiyelerin çeşitli yerel denetimlerde gösterilmesinden sorumludur. Hesap bilgilerini yapılandırılmış ve kullanıcı dostu bir formatta sunarak kullanıcıların Orkestrasyon Hesapları ile doğrudan etkileşimde bulunmalarına olanak tanır.

## `FetchBalances`

 bileşeni, kullanıcı hesaplarının farklı blok zincirlerinden bakiyelerini alır. Desteklenen zincirler (Osmosis ve Agoric için) üzerindeki adreslerden bakiye verilerini almak için yerel RPC uç noktaları ile etkileşimde bulunur.

## `ChainSelector`

 bileşeni, kullanıcıların etkileşimde bulunmak istedikleri Cosmos zincirini seçmelerine olanak tanıyan temel bir UI elemanı sağlar. Seçilen zincir, üst bileşen olan `Orchestration`'a geri iletilir ve daha sonraki etkileşimlerde kullanılır.

## `MakeAccount`

 bileşeni, Agoric blok zincirinde zincirler arası hesapları yönetmek için bir kullanıcı arayüzü sunar. Kullanıcılara seçilen zincirlerde (Osmosis veya Agoric gibi) yeni hesaplar oluşturma, bu hesapların bakiyelerini alma ve gösterme gibi işlemlerin yanı sıra, yatırımlar gerçekleştirme olanağı tanır. Bileşen, kullanıcı deneyimini geliştirmek için yükleme durumları ve bildirimler ekleyerek, Agoric cüzdanı ile etkileşime geçer.

## `MakeOffer`

 bileşeni, Agoric cüzdanı aracılığıyla bir teklif vermeyi kolaylaştıran asenkron bir `makeOffer` fonksiyonu tanımlar. Öncelikle bir `selectedChain` sağlanıp sağlanmadığını kontrol eder ve gerekli sözleşme örneğini (özellikle 'orca') ve sözleşme deposundan `BLD` markasını alır. Fonksiyon, `1000` birim `BLD` yatırımı vererek bir teklif oluşturur. Cüzdanın `makeOffer` yöntemini kullanarak teklifi başlatır ve 'hata', 'kabul edildi', 'iade edildi' ve 'tamamlandı' gibi çeşitli teklif durumlarını yönetmek için geri çağırmaları sağlar. Süreç boyunca yükleme durumunu günceller, pencereleri açıp kapatır, durum metinlerini ayarlar ve kullanıcıyı teklifin ilerleyişi ve sonucu hakkında bilgilendirmek için bildirimler ekler.