---
title: Başlarken
description: Bu proje, Node.js için CSV oluşturma, ayrıştırma, dönüştürme ve serileştirme işlemleri için kapsamlı bir çözüm sunmaktadır. Gelişmiş bir topluluk tarafından test edilmiştir ve güvenilir olarak kabul edilmektedir.
keywords: [Node.js, CSV, ayrıştırma, dönüştürme, serileştirme, javascript]
sort: 3
---

# Başlarken

## Giriş

Bu proje Node.js için **CSV** oluşturma, ayrıştırma, dönüştürme ve serileştirme sağlar. 

Yıllar içinde büyük bir topluluk tarafından test edilmiş ve kullanılmıştır; bu nedenle güvenilir kabul edilmelidir. **Gelişmiş bir CSV ayrıştırıcısından ve dizeleyicisinden bekleyeceğiniz her seçeneği sağlar.**

---

## Proje organizasyonu

`csv` paketi, 4 paketi açığa çıkaran bir şemsiye projedir:

*   `csv-generate`   
    CSV dizi ve Javascript nesneleri için esnek bir üretici.
*   `csv-parse`   
    CSV metnini dizilere veya nesnelere dönüştüren bir ayrıştırıcı.
*   `stream-transform`   
    Bir dönüşüm çerçevesi.
*   `csv-stringify`   
    Kayıtları bir CSV metnine dönüştüren bir dizeleyici.

:::info
Bu, `csv` paketini doğrudan kurabileceğiniz veya bağımlılıkları azaltmak için bunun alt projelerinden birini seçerek kurabileceğiniz anlamına gelir. Her paketin kodu [Node.js CSV monorepo](https://github.com/adaltas/node-csv) altında versiyonlanmıştır.
:::

---

## Kullanım

Kurulum komutu `npm install csv`'dir. [Yarn](https://yarnpkg.com/en/) kullanıyorsanız, `yarn add csv` komutunu çalıştırın.

Ana modüller, Node.js yerel [stream API](https://nodejs.org/api/stream.html) ile tamamen uyumludur. Kolaylık sağlamak amacıyla geri çağırma ve senkron API'ler gibi alternatif API'ler de mevcuttur.

:::tip
Ek kullanım ve örnekler için `örnek sayfasına` başvurabilirsiniz.
:::