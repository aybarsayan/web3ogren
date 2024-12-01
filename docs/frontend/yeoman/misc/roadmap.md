---
description: Bu belge, bir web uygulaması geliştirme sürecindeki genel hedefler ve yol haritası hedefleri hakkında bilgi vermektedir. Projeye dair detaylar, geliştirici verimliliğini artırmak ve kullanıcı ihtiyaçlarına uygun esneklik sağlamak için belirlenmiştir. 
keywords: [web uygulaması, geliştirici verimliliği, yol haritası, paket yönetimi, kullanıcı deneyimi]
title: Hedefler ve Yol Haritası
---

## Genel proje hedefleri

* bir web uygulaması geliştirmede ***geliştirici verimliliğini*** ve mutluluğunu artırmak
* ön uç geliştiricilere en iyi sınıf teklifleri toplamak
* geliştiricilerin uygulama karmaşıklığını yönetmelerine yardımcı olmak
* güçlü varsayılanlar sağlamak, ancak kullanıcıların özel proje ihtiyaçları için ***esnek kalacak şekilde*** genişletilebilir olmak

---

## Yol haritası hedefleri

:::info
Bu bölümde, projenin gelecekteki hedefleri hakkında detaylı bilgilere ulaşabilirsiniz.
:::

* WebStorm, Brackets, Sublime gibi araçlar için ***birinci sınıf kancalar*** sağlamak
* Traceur için **ES6'da** yazma desteği
* mobil web uygulamaları için daha iyi destek
  * forked view layer, Adobe Inspect/Shadow tarzında uzak hata ayıklama (bkz. [#167](https://github.com/yeoman/yeoman/issues/167)) veya [Uzak Önizleme](http://www.youtube.com/watch?v=7NvzRfyhd5Q&feature=youtu.be), iOS 6 için DevTools UI
* browserstack/browserling bulut tarayıcıları aracılığıyla tüm masaüstü/mobil için ***Adobe Shadow*** benzeri takip davranışı
* bellek sızıntısı desenlerini tespit etme (Esprima aracılığıyla?)
* iterasyon sırasında arka uçlarla (Express, PHP) entegrasyon
* daha iyi birim testi yürütme
  * sadece etkilenen testleri çalıştırmak, tüm tarayıcılarda test etmek, bulut tarayıcılarında test etmek
  * casper.js tarzında UI testi
  * tüm tarayıcılar için eş zamanlı olarak test etmek için ***[thrill](https://github.com/turn/thrill)*** ile entegrasyon
* istemci tarafı depolama, çevrimdışı ve senkronizasyon sorunlarını çözmek
  * zengin senkronizasyon (hem gerçek zamanlı hem de çevrimdışı işbirliği)
  * `pushState` dahil sunucu
* paket yönetimi aracılığıyla web bileşenleri
* paket yönetimi aracılığıyla ***kod yeniden kullanımı devrimi*** :) (js ekosistemindeki parçalanmayı düzeltmek)
* UI bileşenleri (Kendo, ClosureLib, Bootstrap, web bileşenleri?)
* Kimlik Doğrulama (Google Connect) ve Ödeme (Stripe veya Google Payment)

:::tip
Geliştiriciler, yukarıdaki hedeflere ulaşmak için ekip içi işbirliğini artırmalı ve sürekli geri bildirim almalıdır.
:::

__taslak__