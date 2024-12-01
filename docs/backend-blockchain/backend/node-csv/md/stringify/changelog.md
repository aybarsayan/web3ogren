---
title: Değişiklik günlüğü
description: Node.js csv-stringify paketinin tam değişiklik günlüğü. Bu belge, tüm sürüm geçmişini ve yapılan değişiklikleri ayrıntılı olarak sunmaktadır.
keywords: [csv, oluştur, değişiklik günlükleri, tarihçe, özellik, değişiklikler, sürüm]
sort: 6
---

# Değişiklik Günlüğü

Bu projeye ait tüm önemli değişiklikler bu dosyada belgeye alınacaktır.  
Taahhüt kılavuzları için [Conventional Commits](https://conventionalcommits.org) sayfasına bakınız.

## [6.4.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.2...csv-stringify@6.4.3) (2023-10-05)

:::note
Sadece csv-stringify paketi için sürüm yükseltilmiştir.
:::

## [6.4.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.1...csv-stringify@6.4.2) (2023-08-25)

### Hata Düzeltmeleri

* **csv-demo-ts-cjs-node16:** en son typescript'ten sonra modül tanımını yükselt ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))

## [6.4.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.0...csv-stringify@6.4.1) (2023-08-24)

### Hata Düzeltmeleri

* commonjs türleri, değişiklikleri doğrulamak için tsc ve lint çalıştır ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))

## [6.4.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.4...csv-stringify@6.4.0) (2023-05-09)

### Özellikler

* formüle kaçış için unicode karakterler ekle ([#387](https://github.com/adaltas/node-csv/issues/387)) ([1fc177c](https://github.com/adaltas/node-csv/commit/1fc177c605e8a88e403539806890695a6ba72dec))

---

## [6.3.4](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.3...csv-stringify@6.3.4) (2023-05-04)

:::note
Sadece csv-stringify paketi için sürüm yükseltilmiştir.
:::

## [6.3.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.2...csv-stringify@6.3.3) (2023-04-30)

:::note
Sadece csv-stringify paketi için sürüm yükseltilmiştir.
:::

## [6.3.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.0...csv-stringify@6.3.2) (2023-04-16)

### Hata Düzeltmeleri

* büyük akış parçaları ile yakalanmamış hatalar (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

## [6.3.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.0...csv-stringify@6.3.1) (2023-04-16)

### Hata Düzeltmeleri

* büyük akış parçaları ile yakalanmamış hatalar (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

---

## [6.3.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.4...csv-stringify@6.3.0) (2023-03-03)

### Özellikler

* **csv-stringify:** enjeksiyon saldırılarına karşı korunmak için escape_formulas ekle ([#380](https://github.com/adaltas/node-csv/issues/380)) ([47ac4bd](https://github.com/adaltas/node-csv/commit/47ac4bd7f5838e28daf889528fd6427ad0934076))

---

## [6.2.4](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.3...csv-stringify@6.2.4) (2023-02-08)

### Hata Düzeltmeleri

* cjs'de ts node16 çözümünü destekle ([#354](https://github.com/adaltas/node-csv/issues/354)) ([fa09d03](https://github.com/adaltas/node-csv/commit/fa09d03aaf0008b2790656871ca6b2c4be12d14c))

## [6.2.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.2...csv-stringify@6.2.3) (2022-11-30)

### Hata Düzeltmeleri

* **csv-stringify:** quoted_match yapılandırma seçeneğini dizileri kabul edecek şekilde güncelle ([#371](https://github.com/adaltas/node-csv/issues/371)) ([42c468b](https://github.com/adaltas/node-csv/commit/42c468b188d9f0370d0f7ccf2b20c8f477b751d8))

## [6.2.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.1...csv-stringify@6.2.2) (2022-11-22)

### Hata Düzeltmeleri

* **csv-stringify:** bigint cast seçeneği için eksik tip tanımını ekle ([#369](https://github.com/adaltas/node-csv/issues/369)) ([764e748](https://github.com/adaltas/node-csv/commit/764e7486971835189364ea7a0103798e5c07fb2b))

## [6.2.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.0...csv-stringify@6.2.1) (2022-11-08)

### Hata Düzeltmeleri

* TypeScript moduleResolution node16 desteği ([#368](https://github.com/adaltas/node-csv/issues/368)) ([f4d7c97](https://github.com/adaltas/node-csv/commit/f4d7c97f39fb73e9d248eee21e61e7dc48015c78))

## [6.2.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.3...csv-stringify@6.2.0) (2022-07-10)

### Özellikler

* ts modülü Node16 ve type declaration'ı exports alanına ekle ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))

### [6.1.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.2...csv-stringify@6.1.3) (2022-06-16)

### Hata Düzeltmeleri

* **csv-stringify:** boş dize deseni ile quote_match boş dizeleri al ([#345](https://github.com/adaltas/node-csv/issues/345)) ([1c22d2e](https://github.com/adaltas/node-csv/commit/1c22d2e07f66dd747150b5a7499b5ebd5bc0f25)), kapanır [#344](https://github.com/adaltas/node-csv/issues/344)

### [6.1.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.1...csv-stringify@6.1.2) (2022-06-14)

### Hata Düzeltmeleri

* **csv-stringify:** senkron modda kayıt olmaması durumunda hata çıkar ([5c8ef2e](https://github.com/adaltas/node-csv/commit/5c8ef2e25618b122982e01c22bcfa3f8ed5db8aa))

### [6.1.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.0...csv-stringify@6.1.1) (2022-06-14)

### Hata Düzeltmeleri

* **csv-stringify:** senkron modda kayıt olmaması durumunda bom ve başlık ([#343](https://github.com/adaltas/node-csv/issues/343)) ([bff158f](https://github.com/adaltas/node-csv/commit/bff158fbc9001b2cf7177ecd0f16dc97edac55f2))

## [6.1.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.5...csv-stringify@6.1.0) (2022-05-24)

### Özellikler

* wg akış api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

### Hata Düzeltmeleri

* **csv-stringify:** TS türlerini güncelle, nesne dönmesi için cast'lere izin ver ([#339](https://github.com/adaltas/node-csv/issues/339)) ([60efa78](https://github.com/adaltas/node-csv/commit/60efa7862ed43bd2fd19d1f027a1809e9df6a67e))

## [6.0.5](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.4...csv-stringify@6.0.5) (2021-12-29)

### Hata Düzeltmeleri

* webpack ile package.json'daki dışa aktarımları düzelt ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))  
* **csv-demo-webpack-ts:** polyfill'i kaldır ([47a99bd](https://github.com/adaltas/node-csv/commit/47a99bd944d1d943e6374227dbc4e20aaa2c8c7f))  
* **csv-demo-webpack-ts:** dışa aktarımları basitleştir ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))  
* package.json dosyalarında esm dışa aktarımları ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), kapatır [#308](https://github.com/adaltas/node-csv/issues/308)

## [6.0.4](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.3...csv-stringify@6.0.4) (2021-11-19)

### Hata Düzeltmeleri

* **csv-stringify:** senkron api ile hatayı yakalar, fix [#296](https://github.com/adaltas/node-csv/issues/296) ([e157f40](https://github.com/adaltas/node-csv/commit/e157f407eeffe5bcfb179cb20476169037bfb4f1))  
* **csv-stringify:** flush'ta node 12 uyumluluğu ([9145b75](https://github.com/adaltas/node-csv/commit/9145b75012ec71a0b4152036af2275bf28c460e0))

## [6.0.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.2...csv-stringify@6.0.3) (2021-11-19)

### Hata Düzeltmeleri

* tarayıcı esm modüllerini açığa çıkar ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))

## [6.0.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.1...csv-stringify@6.0.2) (2021-11-18)

### Hata Düzeltmeleri

* cjs'de polyfill ekleme [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))

## [6.0.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.0...csv-stringify@6.0.1) (2021-11-15)

### Hata Düzeltmeleri

* yayım için örnekleri kaldır ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))

# [6.0.0](https://github.com/adaltas/node-csv/compare/csv-stringify@5.6.5...csv-stringify@6.0.0) (2021-11-15)

### Hata Düzeltmeleri

* **csv-stringify:** off yerine removeListener kullan ([2c2623f](https://github.com/adaltas/node-csv/commit/2c2623f01a4985c5d248e1557a32a70350e825f6))  
* orijinal kütüphane esm modüllerini dışa aktar ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))  
* setImmediate tanımlı değilse setTimeout'a geri dön ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))  
* dist içinde esm dosyalarına atıfta bulunun ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))

### Özellikler

* node 14 desteğini geri al ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))  
* node 8 için geriye dönük destek ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))  
* **csv-stringify:** akışı.Options ile ts genişlet ([#301](https://github.com/adaltas/node-csv/issues/301)) ([cc30d66](https://github.com/adaltas/node-csv/commit/cc30d66e0f07686d2c42670ead10246ebcf37a67))  
* esm geçişi ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))  
* ts türlerini senkronize olarak dışa aktar ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))  
* ts türlerini typesVersions ile değiştir ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))

## [5.6.4](https://github.com/adaltas/node-csv-stringify/compare/csv-stringify@5.6.3...csv-stringify@5.6.4) (2021-08-27)

:::note
Sadece csv-stringify paketi için sürüm yükseltilmiştir.
:::

## 5.6.3 (2021-08-27)

:::note
Sadece csv-stringify paketi için sürüm yükseltilmiştir.
:::

## Sürüm 5.6.2

* build: yapı komutlarını yeniden adlandır

## Sürüm 5.6.1

* fix: senkron bellek sızıntısı  
* refactor: kullanılmayan değerleri kaldır  
* fix: browserify dev bağımlılığını ekle

## Sürüm 5.6.0

* build: tarayıcıyla uyumlu paketler kullan, fix #122

## Sürüm 5.5.3

* ts: geri çağırma argümanı basitleştirilmesi

## Sürüm 5.5.2

* paket: en son bağımlılıklar  
* test: node 14'te null yazma hatasını düzelt  
* ts: sıkı modu etkinleştir  
* paket: mocha paket tanımında

## Sürüm 5.5.1

### Hata

* bom: senkron modda çalış

## Sürüm 5.5.0

### Özellik:

* cast: BigInt desteği

## Sürüm 5.4.3

### Hata:

* utils: isSymbol'de yanlış tanımlanmış değişken

## Sürüm 5.4.2

### Hata:

* quoted_match: tüm türler üzerinde uygulanır, yalnızca dizelerde değil  
* cast: yerel seçenekleri doğrula ve normalize et

### Proje yönetimi:

* örnekler: alıntılı örnekler ekle

## Sürüm 5.4.1

* bom: ts tanımını düzelt

## Sürüm 5.4.0

* src: javascript'te require'ı tamamla  
* bom: yeni seçenek

## Sürüm 5.3.6

* cast: ilk kayıttaki başlık bağlamı özelliğini düzelt

## Sürüm 5.3.5

* akış: üst sınıf kurucusuna seçenekleri geçirme, fix #104

## Sürüm 5.3.4

* src: koşulları güçlendir  
* test: her örneğin geçerli olduğundan emin ol  
* paket: katkı sağlama  
* paket: davranış kuralları  
* quoted_match: ts türleri string veya RegExp

## Sürüm 5.3.3

* sütunlar: noktalı alanlara hâlâ erişim sağlanabilir, fix #98

## Sürüm 5.3.2

* sütunlar: tanımsız nesnelerde almak, fix #97

## Sürüm 5.3.1

* paket: en son bağımlılıklar  
* paket: npm ignore'u file alanı ile değiştir  
* proje: package.json'daki lisansı düzelt  
* paket: pretest komutunu basitleştir

## Sürüm 5.3.0

Yeni özellik:
* quote: boolean değeri olabilir  
* ayırıcı: tampon kabul edilir ve doğrulama zorlanır  
* ayırıcı: değer boşsa devre dışı bırakılır  
* cast: değer bir nesne ise seçenekleri üzerine yazar

Hata:
* record_delimiter: doğrulamayı zorla

### Proje yönetimi:

* paket: en son bağımlılıklar  
* ts: tür testleri

## Sürüm 5.2.0

Hata:
* escape: doğrulamayı zorla

### Proje yönetimi:

* babel: .babelrc'yi git'e ekle  
* ts: RowDelimiter'ı RecordDelimiter olarak yeniden adlandır  
* ts: camel case'i snake case'e dönüştür

## Sürüm 5.1.2

Hata:
* write: değiştirilemez girdi parçaları

## Sürüm 5.1.1

Hata:
* ts: casting bağlamı için eksik türü ekle

## Sürüm 5.1.0

Hata:
* header: sütun tanımını garanti et

Yeni özellikler:
* cast: işlevlere bağlam geç

Küçük geliştirmeler:
* write: yazılan kayıtları doğrula  
* src: akış sınıfını genişlet

### Proje yönetimi:

* paket: en son geliştirici bağımlılıkları

## Sürüm 5.0.0

Kırıcı değişiklikler:
* `cast`: `formatters` idi  
* `record_delimiter`: `row_delimiter` idi  
* seçenekler: örnek seçenekler snake case biçiminde saklandı  
* nodejs: 7 sürümünü desteklemeyi bırak, './lib/es5' kullan

Yeni özellikler:
* `quoted_match`: yeni seçenek  
* seçenekler: snake case ve camel case kabul edilir

Küçük geliştirmeler:
* akış: tüm seçenekleri dönüşüm akışına geçirme  
* akış: writableObjectMode kullan

### Proje yönetimi:

* paket: lisansı MIT olarak güncelle  
* travis: Node.js 11 ile test et  
* örnekler: bazı betikleri geliştirin

## Sürüm 4.3.1

* readme: proje web sitesine olan bağlantıları düzelt

## Sürüm 4.3.0

* paket: csv.js.org'a taşı

## Sürüm 4.2.0

* `formatters`: yeni dize formatlayıcı  
* akış: çok daha iyi bir dönüşüm vatandaşı ol  
* paket: babel 7'ye güncelle

## Sürüm 4.1.0

* `columns`: sütun tanım nesneleri ile dizi desteği  
* travis: Node.js 10 desteği  
* örnekler: yeni formatlayıcılar betiği  
* örnekler: sözdizimini güncelle  
* paket: dikkate alınmayacak dosyaları iyileştir

## Sürüm 4.0.1

* typescript: formatlardaki en son değişikliği yansıt

## Sürüm 4.0.0

Geriye dönük uyumsuzluklar:
* `formatters`: bool'u boolean olarak yeniden adlandır

Yeni özellikler:
* `formatters`: sayıyı işleyin

Temizlik:
* src: `typeof` çağrısını önbelleğe al  
* paket: en son bağımlılıklar

## Sürüm 3.1.1

* typescript: senkron API bir dize döndürmeli

## Sürüm 3.1.0

* typescript: typings ekle

## Sürüm 3.0.0

* `rowDelimiter` kontrolü için satır kırılma kontrolünü değiştir

## Sürüm 2.1.0

* paket: boş alıntı değerine izin ver  
* paket: `rowDelimiter` için ascii seçeneği ekle

## Sürüm 2.0.4

* paket: babel'i geliştirme bağımlılıklarına taşı

## Sürüm 2.0.3

* paket: es5 geriye dönük uyumluluğu  
* paket: yarn lock dosyasını yok say

## Sürüm 2.0.2

* paket: testleri versiyondan önce çalıştırmaya başlayın

## Sürüm 2.0.1

* paket: yeni sürüm iş akışı  
* formatlayıcılar: dönen değeri doğrula

## 2.0.0

Bu ana sürüm, modern bir JavaScript sözdizimi (ES6 veya ES2015 ve sonrası) üreten CoffeeScript 2'yi kullanır ve Node.js sürüm 7.6'dan daha düşük olan sürümlerle ve tarayıcılarla uyumluluğu bozar. Ancak, API açısından kararlıdır.

* paket: CoffeeScript 2 kullanın

## v1.1.0

* test: mocha tarafından ele alınacak olmalıdır  
* paket: CoffeeScript 2 ve semver tilde kullanımı