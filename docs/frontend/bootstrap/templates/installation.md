---
layout: docs
title: Kurulum
description: npm betikleri kullanarak CoreUI Bootstrap Yönetici Paneli Şablonlarını nasıl kullanacağınızı öğrenin, şablonları oluşturun, kaynak kodunu derleyin, testleri çalıştırın ve daha fazlasını yapın. Bu içerik, geliştiricilerin şablonları kurma ve yönetme süreçlerine dair adım adım bir rehber sunmaktadır.
keywords: [CoreUI, Bootstrap, Yönetici Paneli, npm, Sass, Autoprefixer, Kurulum]
---

## Araçların kurulumu

CoreUI Bootstrap Yönetici Şablonları, [npm betikleri](https://docs.npmjs.com/misc/scripts/) kullanarak yapısal bir sistem kullanır. `package.json` çerçeve ile çalışmak için uygun yöntemler içerir; bunlar arasında kod derleme, testleri çalıştırma ve daha fazlası bulunmaktadır.

Yapı sistemimizi kullanmak ve yönetici şablonumuzu yerel olarak çalıştırmak için bir kaynak dosyası kopyasına ve Node'a ihtiyacınız olacak. Bu adımları takip edin ve başarıyla ilerleyebilirsiniz:

1. [Node.js'i indirin ve kurun](https://nodejs.org/en/download/), bu bağımlılıklarımızı yönetmek için kullanıyoruz.
2. `CoreUI Yönetici Şablonunu İndirin`.
3. Kök şablon dizinine gidin ve `npm install` komutunu çalıştırarak `package.json` içinde listelenen yerel bağımlılıklarımızı kurun.

:::tip
Yardımcı bir ipucu olarak, bu adımları uygularken git sürüm kontrol sistemini de kullanmak isteyebilirsiniz; bu, değişiklikleri takip etmenizi kolaylaştırır.
:::

Tamamlandığında, komut satırından sağlanan çeşitli komutları çalıştırabileceksiniz.

## npm betiklerini kullanma

`package.json`'ımız projeyi geliştirmek için çok sayıda görev içerir. Tüm npm betiklerini terminalinizde görmek için `npm run` komutunu çalıştırın. **Ana görevler şunlardır:**


| Görev | Açıklama |
| --- | --- |
| `npm start` | CSS ve JavaScript'i derler, belgeleri oluşturur ve yerel bir sunucu başlatır. |
| `npm run build` | Derlenmiş dosyalarla `dist/` dizinini oluşturur. [Sass](https://sass-lang.com/), [Autoprefixer](https://github.com/postcss/autoprefixer) ve [terser](https://github.com/terser/terser) kullanır. |
| `npm test` | `npm run dist` çalıştırıldıktan sonra yerel testleri çalıştırır |
## Sass

CoreUI, Sass kaynak dosyalarımızı CSS dosyalarına (derleme sürecimize dahil) dönüştürmek için [Dart Sass](https://sass-lang.com/dart-sass) kullanır ve kendi varlık pipeline'ınızı kullanıyorsanız bunu yapmanızı öneririz.

:::info
Dart Sass, 10'luk bir yuvarlama hassasiyeti kullanır ve verimlilik nedenleriyle bu değerin ayarlanmasına izin vermez. Ürettiğimiz CSS'nin minify edilmesi gibi daha ileri işleme sürecinde bu hassasiyeti düşürmüyoruz, ancak bunu yapmayı seçerseniz, tarayıcı yuvarlama sorunlarını önlemek için en az 6 hassasiyet korumanızı öneririz.
:::

## Autoprefixer

[Autoprefixer](https://github.com/postcss/autoprefixer)'ı (derleme sürecimize dahil) kullanarak derleme zamanında bazı CSS özelliklerine otomatik olarak vendor prefix'leri ekleriz. Bu, zaman ve kod tasarrufu sağlamakta, CSS'imizin ana kısımlarını tek bir kez yazmamıza izin vererek v3'te bulunan vendor karışımlarına olan ihtiyacı ortadan kaldırmaktadır.

> "Autoprefixer ile desteklenen tarayıcılar listesini GitHub depomuzda ayrı bir dosya içinde tutarız." — [GitHub sayfası](https://github.com)

Autoprefixer ile desteklenen tarayıcılar listesini GitHub depomuzda ayrı bir dosya içinde tutarız. `.browserslistrc` dosyasına bakın.

## Yerel şablon

Başlatmak için şu adımları izleyin:

1. Yukarıdaki `araçların kurulumu` bölümünü takip ederek tüm bağımlılıkları kurun.
2. Kök şablon dizininden komut satırında `npm run start` komutunu çalıştırın.
3. Tarayıcınızda `http://localhost:9001/` adresini açın, ve voilà.

## Sorun Giderme

:::warning
Bağımlılıkları kurarken sorunlarla karşılaşırsanız, tüm önceki bağımlılık sürümlerini (global ve yerel) kaldırın. Ardından, `npm install` komutunu yeniden çalıştırın.
:::

Bağımlılıkları kurarken sorunlarla karşılaşırsanız, tüm önceki bağımlılık sürümlerini (global ve yerel) kaldırın. Ardından, `npm install` komutunu yeniden çalıştırın.