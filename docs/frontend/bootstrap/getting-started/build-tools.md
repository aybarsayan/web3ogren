---
layout: docs
title: Araçlar
description: Dokümantasyonumuzu oluşturmak, kaynak kodunu derlemek, testleri çalıştırmak ve daha fazlası için Bootstrap için CoreUI'yi kullanmayı öğrenin. Bu rehber, CoreUI ile ilgili araçları ayarlamak ve kullanmak için gerekli adımları kapsamaktadır.
keywords: [CoreUI, Bootstrap, npm, Sass, Autoprefixer, RTLCSS, yerel dokümantasyon]
---

## Araçların Ayarlanması

Bootstrap için CoreUI, [npm betikleri](https://docs.npmjs.com/misc/scripts/) kullanır. Bizim `package.json` dosyamız, çerçeveyle çalışmak için kod derleme, test çalıştırma ve daha fazlasını içeren kullanışlı yöntemler içerir.

:::info
Dokümantasyonumuzu yerel olarak kullanmak ve derleme sistemimizi çalıştırmak için, CoreUI'nin kaynak dosyalarına ve Node'a ihtiyacınız olacak.
:::

Bu adımları izleyin ve hazır olmalısınız:

1. [Node.js'i indirip kurun](https://nodejs.org/en/download/), bağımlılıklarımızı yönetmek için bunu kullanıyoruz.
2. Ya `CoreUI kaynaklarını indirin` ya da `CoreUI deposunu forkladığınızdan` emin olun.
3. Kök `/coreui` dizinine gidin ve `package.json` dosyamızda listelenen yerel bağımlılıklarımızı yüklemek için `npm install` komutunu çalıştırın.

Tamamlandığında, komut satırından sağlanan çeşitli komutları çalıştırabileceksiniz.

## npm Betiklerinin Kullanımı

Bizim `package.json` dosyamız, projeyi geliştirmek için birçok görev içerir. Tüm npm betiklerini görmek için terminalde `npm run` komutunu çalıştırın. **Ana görevler şunlardır:**


| Görev | Açıklama |
| --- | --- |
| `npm start` | CSS ve JavaScript'i derler, dokümantasyonu oluşturur ve yerel bir sunucu başlatır. |
| `npm run dist` | Derlenmiş dosyalarla `dist/` dizinini oluşturur. [Sass](https://sass-lang.com/), [Autoprefixer](https://github.com/postcss/autoprefixer) ve [terser](https://github.com/terser/terser) kullanır. |
| `npm test` | `npm run dist` komutunu çalıştırdıktan sonra testleri yerel olarak çalıştırır. |
| `npm run docs-serve` | Dokümantasyonu yerel olarak oluşturur ve çalıştırır. |
## Sass

Bootstrap, Sass kaynak dosyalarımızı CSS dosyalarına dönüştürmek için [Dart Sass](https://sass-lang.com/dart-sass) kullanır (derleme sürecimizle birlikte dahil edilmiştir) ve kendi varlık boru hatlarınızı kullanıyorsanız aynı şeyi yapmanızı öneririz. Önceden Bootstrap v4 için Node Sass kullandık, ancak LibSass ve bunun üzerinde inşa edilmiş paketler, Node Sass dahil, artık [desteklenmiyor](https://sass-lang.com/blog/libsass-is-deprecated).

:::warning
Dart Sass, 10'luk bir yuvarlama hassasiyeti kullanır ve verimlilik nedenleriyle bu değerin ayarlanmasına izin vermez. 
:::

Oluşturduğumuz CSS'nin daha fazla işlenmesi sırasında bu hassasiyeti düşürmüyoruz, örneğin minifikasyon sırasında, ancak bunu yapmayı seçerseniz en az 6 hassasiyeti korumanızı öneriyoruz, böylece tarayıcı yuvarlama sorunları yaşamazsınız.

## Autoprefixer

Bootstrap için CoreUI, derleme sırasında bazı CSS özelliklerine otomatik olarak vendor ön ekleri eklemek için [Autoprefixer](https://github.com/postcss/autoprefixer) kullanır (derleme sürecimizle birlikte dahil edilmiştir). 

> Bu, önemli kısımları yalnızca bir kez yazarak zaman ve kod tasarrufu sağlar ve v3'te bulunan vendor karışımlarına olan ihtiyacı ortadan kaldırır.  
> — CoreUI Takımı

Autoprefixer ile desteklenen tarayıcı listesini GitHub deposunda ayrı bir dosyada tutuyoruz. Ayrıntılar için `.browserslistrc` dosyasına bakın.

## RTLCSS

Bootstrap için CoreUI, derlenmiş CSS'yi işlemek ve bunları RTL'ye dönüştürmek için [RTLCSS](https://rtlcss.com/) kullanır. Bu, temelde yatay yön bilgisi olan özelliklerin (örn. `padding-left`) zıtlarıyla değiştirilmesini sağlar. CSS'imizin yalnızca bir kez yazılmasını ve RTLCSS [kontrol](https://rtlcss.com/learn/usage-guide/control-directives/) ve [değer](https://rtlcss.com/learn/usage-guide/value-directives/) direktiflerini kullanarak küçük ayarlamalar yapmamıza olanak tanır.

## Yerel Dokümantasyon

Dokümantasyonumuzu yerel olarak çalıştırmak için, [hugo-bin](https://www.npmjs.com/package/hugo-bin) npm paketini kullanarak Hugo'yu kurmanız gerekir. Hugo, temel ekler, Markdown tabanlı dosyalar, şablonlar ve daha fazlasını sağlayan son derece hızlı ve oldukça genişletilebilir bir statik site oluşturucusudur. İşte nasıl başlayacağınız:

1. Tüm bağımlılıkları yüklemek için yukarıdaki `araçların ayarlanması` adımını izleyin.
2. Kök `/coreui` dizininden, komut satırında `npm run docs-serve` komutunu çalıştırın.
3. Tarayıcınızda `http://localhost:9001/` adresini açın ve voila.

:::note
Hugo'yu kullanmayı daha fazla öğrenmek için [belgelere](https://gohugo.io/documentation/) göz atın.
:::

## Sorun Giderme

Bağımlılıkları yüklemede sorun yaşarsanız, tüm önceki bağımlılık sürümlerini (küresel ve yerel) kaldırın. Sonra, `npm install` komutunu tekrar çalıştırın.