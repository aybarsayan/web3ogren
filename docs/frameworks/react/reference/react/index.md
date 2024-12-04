---
title: React Referans Genel Bakış
seoTitle: React Reference Overview
sidebar_position: 1
description: Bu bölüm, React ile çalışma için ayrıntılı referans belgeleri sunmaktadır. Reacta giriş için, lütfen Öğren bölümüne göz atın.
tags: 
  - React
  - Kancalar
  - Bileşenler
  - API'ler
  - Frontend Geliştirme
keywords: 
  - React
  - Kancalar
  - Bileşenler
  - API'ler
  - Frontend Geliştirme
---
Bu bölüm, React ile çalışma için ayrıntılı referans belgeleri sunmaktadır. React'a giriş için, lütfen `Öğren` bölümüne göz atın.



React referans belgeleri işlevsel alt bölümlere ayrılmıştır:

## React {/*react*/}

Programatik React özellikleri:

* `Kancalar` - Bileşenlerinizden farklı React özelliklerini kullanın.
* `Bileşenler` - JSX'inizde kullanabileceğiniz yerleşik bileşenler.
* `API'ler` - Bileşenleri tanımlamak için yararlı olan API'ler.
* `Yönergeler` - React Server Bileşenleri ile uyumlu paketleyicilere talimatlar sağlar.

## React DOM {/*react-dom*/}

React-dom, yalnızca web uygulamaları için desteklenen özellikleri içerir (tarayıcı DOM ortamında çalışan). Bu bölüm aşağıdaki alt başlıklara ayrılmıştır:

* `Kancalar` - Tarayıcı DOM ortamında çalışan web uygulamaları için kancalar.
* `Bileşenler` - React, tarayıcıda yerleşik olan tüm HTML ve SVG bileşenlerini destekler.
* `API'ler` - `react-dom` paketi yalnızca web uygulamalarında desteklenen yöntemleri içerir.
* `İstemci API'leri` - `react-dom/client` API'leri, React bileşenlerini istemcide (tarayıcıda) oluşturmanıza olanak tanır.
* `Sunucu API'leri` - `react-dom/server` API'leri, React bileşenlerini sunucuda HTML olarak oluşturmanıza olanak tanır.

## React Kuralları {/*rules-of-react*/}

React'in, kalitesi yüksek uygulamalar üreten ve kolayca anlaşılabilen desenleri ifade etmek için kuralları vardır:

* `Bileşenler ve Kancalar saf olmalıdır` – Saflık, kodunuzu anlamayı, hata ayıklamayı kolaylaştırır ve React'ın bileşenlerinizi ve kancalarınızı otomatik olarak doğru bir şekilde optimize etmesine olanak tanır.
* `React, Bileşenleri ve Kancaları çağırır` – React, kullanıcı deneyimini optimize etmek için gerekli olduğunda bileşenleri ve kancaları oluşturma sorumluluğuna sahiptir.
* `Kanca Kuralları` – Kancalar, JavaScript fonksiyonları kullanılarak tanımlanır, ancak çağrılabileceği yerler üzerinde kısıtlamalarla özel bir tür yeniden kullanılabilir UI mantığını temsil eder.

## Eski API'ler {/*legacy-apis*/}

* `Eski API'ler` - `react` paketinden dışa aktarılmıştır, ancak yeni yazılan kodda kullanılması önerilmemektedir.