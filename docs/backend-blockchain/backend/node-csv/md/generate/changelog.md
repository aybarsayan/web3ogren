---
title: Değişiklik günlüğü
description: Node.js csv-generate paketinin kapsamlı değişiklik günlükleri. Bu değişiklik günlüğü, projenin sürümlerindeki güncellemeleri, hata düzeltmelerini ve yeni özellikleri içermektedir.
keywords: [csv, generate, değişiklik, geçmiş, özellik, değişiklikler, sürüm]
sort: 6
---

# Değişiklik Günlüğü

Bu projeye yapılan tüm önemli değişiklikler bu dosyada belgelenmiştir. Commit yönergeleri için [Conventional Commits](https://conventionalcommits.org) bağlantısına bakın.

## [4.3.0](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.8...csv-generate@4.3.0) (2023-10-05)

### Özellikler

- **csv-generate:** async okuma arasında nefes al ([b1da5a1](https://github.com/adaltas/node-csv/commit/b1da5a13cf4dbbf0dd62f2e28e5dee8767ad0151))
- **csv-generate:** highWaterMark'ı varsayılan olarak ayarla ([8e758cf](https://github.com/adaltas/node-csv/commit/8e758cf79ab8b089e9a6a80a1f06be524a208f35))

:::info
**Not:** Bu sürümde, async okuma sırasında performansı artıran yeni değişiklikler yapılmıştır.
:::

## [4.2.8](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.7...csv-generate@4.2.8) (2023-08-25)

### Hata Düzeltmeleri

- **csv-demo-ts-cjs-node16:** son typescript sürümünden sonra modül tanımını güncelle ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))

## [4.2.7](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.6...csv-generate@4.2.7) (2023-08-24)

### Hata Düzeltmeleri

- commonjs türleri, değişiklikleri doğrulamak için tsc çalıştır ve lint gerçekleştir ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))

:::warning
**Dikkat:** TypeScript ile yapılan her güncellemeye dikkat edilmelidir çünkü uyum sorunları ortaya çıkabilir.
:::

## [4.2.6](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.5...csv-generate@4.2.6) (2023-05-04)

**Not:** Sadece csv-generate paketi için sürüm artışı.

## [4.2.5](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.4...csv-generate@4.2.5) (2023-04-30)

**Not:** Sadece csv-generate paketi için sürüm artışı.

## [4.2.4](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.2...csv-generate@4.2.4) (2023-04-16)

**Not:** Sadece csv-generate paketi için sürüm artışı.

## [4.2.3](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.2...csv-generate@4.2.3) (2023-04-16)

**Not:** Sadece csv-generate paketi için sürüm artışı.

## [4.2.2](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.1...csv-generate@4.2.2) (2023-02-08)

### Hata Düzeltmeleri

- cjs'de ts node16 çözümünü destekle ([#354](https://github.com/adaltas/node-csv/issues/354)) ([fa09d03](https://github.com/adaltas/node-csv/commit/fa09d03aaf0008b2790656871ca6b2c4be12d14c))

## [4.2.1](https://github.com/adaltas/node-csv/compare/csv-generate@4.2.0...csv-generate@4.2.1) (2022-11-08)

### Hata Düzeltmeleri

- TypeScript moduleResolution node16'yı destekle ([#368](https://github.com/adaltas/node-csv/issues/368)) ([f4d7c97](https://github.com/adaltas/node-csv/commit/f4d7c97f39fb73e9d248eee21e61e7dc48015c78))

## [4.2.0](https://github.com/adaltas/node-csv/compare/csv-generate@4.1.0...csv-generate@4.2.0) (2022-07-10)

### Özellikler

- ts modülü Node16 ve type declaration'ı exports alanına ekle ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))

## [4.1.0](https://github.com/adaltas/node-csv/compare/csv-generate@4.0.4...csv-generate@4.1.0) (2022-05-24)

### Özellikler

- wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

### Hata Düzeltmeleri

- **csv-generate:** geçersiz değer hatasını yakala ([f031542](https://github.com/adaltas/node-csv/commit/f0315423ba576551f2bd08f3e1c3bc85e9003926))

## [4.0.4](https://github.com/adaltas/node-csv/compare/csv-generate@4.0.3...csv-generate@4.0.4) (2021-12-29)

### Hata Düzeltmeleri

- package.json'daki exports'ı webpack ile düzelt ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
- **csv-demo-webpack-ts:** polyfill'i kaldır ([47a99bd](https://github.com/adaltas/node-csv/commit/47a99bd944d1d943e6374227dbc4e20aaa2c8c7f))
- **csv-demo-webpack-ts:** export yollarını sadeleştir ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
- package.json dosyalarındaki esm exports ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), [#308](https://github.com/adaltas/node-csv/issues/308) kapandı.

## [4.0.3](https://github.com/adaltas/node-csv/compare/csv-generate@4.0.2...csv-generate@4.0.3) (2021-11-19)

### Hata Düzeltmeleri

- tarayıcı esm modüllerini açığa çıkar ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))

## [4.0.2](https://github.com/adaltas/node-csv/compare/csv-generate@4.0.1...csv-generate@4.0.2) (2021-11-18)

### Hata Düzeltmeleri

- cjs'de polyfill ekleme ([#303](https://github.com/adaltas/node-csv/issues/303)) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))

## [4.0.1](https://github.com/adaltas/node-csv/compare/csv-generate@4.0.0...csv-generate@4.0.1) (2021-11-15)

### Hata Düzeltmeleri

- yayınlanmış örnekleri kaldır ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))

# [4.0.0](https://github.com/adaltas/node-csv/compare/csv-generate@3.4.3...csv-generate@4.0.0) (2021-11-15)

### Hata Düzeltmeleri

- **csv-generate:** uyku ile sona erdikten sonra kayıt emilmesi ([6632e63](https://github.com/adaltas/node-csv/commit/6632e63a7aff7d33f47aae91347a39649d5248c6))
- **csv-generate:** stream.push EOF'dan sonra ([97a3f58](https://github.com/adaltas/node-csv/commit/97a3f58dd73b6452b32cc39511b3ec145fe23c00))
- orijinal lib esm modüllerini dışa aktar ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
- dist'deki esm dosyalarına başvur ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))

### Özellikler

- node 14 desteği için geri taşındı ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
- node 8 için geriye dönük destek ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
- **csv-generate:** stream.ReadableOptions ile seçenekleri genişlet ([ef84fb2](https://github.com/adaltas/node-csv/commit/ef84fb2f980b5d39e2df2b61d012769119f31001))
- esm geçişi ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
- ts türlerini senkronize olarak dışa aktar ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
- ts türlerini typesVersions ile değiştir ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))

## [3.4.2](https://github.com/adaltas/node-csv-generate/compare/csv-generate@3.4.1...csv-generate@3.4.2) (2021-08-27)

**Not:** Sadece csv-generate paketi için sürüm artışı.

## 3.4.1 (2021-08-27)

**Not:** Sadece csv-generate paketi için sürüm artışı.

## Sürüm 3.4.0

- chore: browserify entegrasyonu

## Sürüm 3.3.0

- paket: en son bağımlılıklar
- paket: paket beyanında mocha

## Sürüm 3.2.4

- paket: katkıda bulunmak
- paket: davranış kuralları
- travis: node.js 8'i kaldır ve 12'yi ekle
- src: küçük kod sadeleştirmesi
- paket: dosya yolunu güncelle

## Sürüm 3.2.3

- paket: dosyalardan nokta eğik çizgiyi kaldır

## Sürüm 3.2.2

- ts: beyan dosyalarını lib/es5 klasörüne yerleştir

## Sürüm 3.2.1

- ts: typings'deki seçenekleri isteğe bağlı olarak tanımla
- paket: npm yok saymasını dosya alanı ile değiştir
- proje: package.json'daki lisansı düzelt
- babel: .babelrc dosyasını git'e dahil et

## Sürüm 3.2.0

- ts: yeni TypeScript tanım dosyaları

## Sürüm 3.1.0

- süre: başlangıç zamanını düzelt
- paket: MIT lisansı (önceki BSD idi)
- uyku: yeni seçenek

## Sürüm 3.0.0

Yıkıcı değişiklik:

- geri çağırma: şifreleme yoksa tamponlar oluştur

Yeni özellikler ve hata düzeltmeleri:

- seçenekler: yılan durumu ve küçük harf durumundaki anahtarları kabul et
- eof: yeni seçenek
- row_delimiter: yeni seçenek
- travis: Node.js 11'e karşı test et

## Sürüm 2.2.2

- readme: web sitesi URL'lerini düzelt

## Sürüm 2.2.1

- readme: proje web sitesine bağlantıları düzelt

## Sürüm 2.2.0

- paket: csv.js.org'a geç
- paket: babel 7 dahil en son bağımlılıkları güncelle
- seçenekler: yeni süre seçeneği
- örnekler: yeni api senkronizasyon betikleri
- örnekler: yeni objectmode betikleri
- readme: api belgesini kaldır
- travis: Node.js 10'u destekle
- örnekler: sözdizimini güncelle
- paket: yok sayma dosyalarını iyileştir

## Sürüm 2.1.0

- senkron: senkron kullanımı kolaylaştıran yeni modül

## Sürüm 2.0.2

- paket: babel'i dev bağımlılıklarına taşı

## Sürüm 2.0.1

- paket: es5 geri uyumluluğu
- paket: yarn kilit dosyasını yok say

## 2.0.0

Bu ana sürüm, modern JavaScript sözdizimini (ES6 veya ES2015 ve sonrası) üreten CoffeeScript 2 kullanır ve Node.js sürümleri ile uyumluluğu bozar. Bununla birlikte, API açısından kararlıdır.

- paket: CoffeeScript 2'yi kullan.

## v1.1.2

- tests: kapsam referanslarını kaldır

## v1.1.0

- test: mocha tarafından ele alınması gereken gereklilik
- paket: coffeescript 2 ve semver tilde kullan
- seçenekler: sütun türlerini doğrula, #4'ü düzelt