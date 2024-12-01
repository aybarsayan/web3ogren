---
title: Grunt 1.0 Güncellemesi
description: Bu kılavuz, projelerinizi Grunt 0.4.x'den Grunt 1.0'a güncellemenize yardımcı olmak için tasarlanmıştır. Eklenti geliştirme ve eş bağımlılıklar hakkında önemli bilgiler içerir. 
keywords: [Grunt, eklentiler, güncelleme, eş bağımlılıklar, npm]
---



Eski sürümler, 1.5 ve öncesi artık desteklenmemektedir. Daha fazla bilgi edinmek ve ek destek seçeneklerini görmek için `buraya` göz atın.

Bu kılavuz, projelerinizi ve Grunt 0.4.x'den Grunt 1.0'a güncellemenize yardımcı olmak için buradadır.

**Grunt 1.0.0'nın Node.js v0.8'i artık desteklemediğini unutmayın.**

## Grunt Kullanan Projeler için

### Eş Bağımlılıklar

Grunt 1.0 ile bir proje kurduğunuzda `peerDependencies` hataları alabilirsiniz. 
:::tip
Bu nedenle, favori eklentilerinize pull request göndermenizi ve onların package.json dosyalarının peerDependencies bölümünü güncellemelerini rica ediyoruz.
:::

Eklenti güncellemeleri ile ilgili detaylar aşağıda bulunmaktadır.

## Eklentiler ve Eklenti Geliştiricileri için

Eş Bağımlılıklar

Eğer package.json dosyanızda peerDependencies bölümünde grunt bulunan bir Grunt eklentiniz varsa, 
"grunt": ">=0.4.0" etiketi eklemenizi öneririz. Aksi halde, grunt@1.0.0 yayımlandığında, npm@2 kullanıcıları
eklentinizi kurmaya çalıştığında sert bir hata alacak ve npm@3 kullanıcıları uyarı alacaktır.

:::warning
Unutmayın, npm@3 itibarıyla eş bağımlılıklar kullanıcılar için artık yüklenmiyor. 
:::

Grunt eklentisi kullanıcılarının, herhangi bir Grunt eklentisi yüklemesi ile birlikte 
npm install grunt --save-dev komutunu girmesi beklenmektedir.

Eklentinizi `"grunt": ">=0.4.0"` ile güncelleyip bunu npm'de yayınlamanızı rica ediyoruz.

### 1.0.0'da Yapılan Değişiklikler

- Asenkron geri çağrımın birden fazla kez çağrılmasını önleyin. Pull #1464.
- Telif hakkını jQuery Foundation'a güncelleyin ve gereksiz başlıkları kaldırın. Fixes #1478.
- Glob'u 7.0.x'e güncelleyin. Fixes #1467.
- Tekrarlayan BOM strip kodunu kaldırma. Pull #1482.
- En son cli ~1.2.0 sürümüne güncellendi.
- Kurulum sırasında bir grunt bin oluşturulduğundan emin olun.

### Grunt 1.0 RC1'deki Değişiklikler:

Bazı API'lerin değiştiğini ve bu değişikliklerin büyük bir sürüm güncellemesi gerektirdiğini unutmayın:

- `coffee-script` `~1.10.0` sürümüne yükseltildi, bu durum dil ile eklentiler ve Gruntfile'lar kullanılırken kırılma değişikliklerine neden olabilir.
- `nopt` `~3.0.6` sürümüne yükseltildi, bu birçok sorunu çözmüştür, bunlar arasında birden fazla argümanı geçirme ve sayıları seçenek olarak işleme konuları bulunmaktadır. 
  > Daha önce `--foo bar` komutunun `foo` seçeneğine `'bar'` değerini geçtiğini unutmayın. Artık 
  `foo` seçeneğini `true` olarak ayarlayacak ve `bar` görevini çalıştıracaktır.
  
- `glob` `~6.0.4` sürümüne ve `minimatch` `~3.0.0` sürümüne güncellendi. Sonuçlar artık varsayılan olarak `grunt.file.expandMapping()` ile sıralanmaktadır. Sonuçların sıralanmasını istemiyorsanız `nosort: true` seçeneğini geçin.
- `lodash` `~4.3.0` sürümüne yükseltildi. Birçok değişiklik olmuştur. Grunt'u doğrudan etkileyenlerden bazıları, 
  * `grunt.util._.template()` derleme fonksiyonu döndürmesi 
  * `grunt.util._.flatten` artık derinlemesine düzleştirmemesi.
  
  :::note
  `grunt.util._` kullanım dışıdır ve `npm install lodash` ve `var _ = require('lodash')` ile `lodash` kullanmanızı şiddetle tavsiye ederiz. Değişikliklerin tam listesi için lütfen lodash değişiklik günlüklerine bakın: 
  :::
  
- `iconv-lite` `~0.4.13` sürümüne yükseltildi ve varsayılan olarak BOM'u süzüyor.
- `js-yaml` `~3.5.2` sürümüne yükseltildi ve bu da `grunt.file.readYAML`’yi etkileyebilir. 
  Lütfen `npm install js-yaml` yapmanızı ve olası gelecekteki kullanım dışılar için doğrudan `var YAML = require('js-yaml')` kullanmanızı öneririz.
  
- [grunt.file.write()](https://gruntjs.com/api/grunt.file#grunt.file.write) için bir dosya `mode` seçeneği geçilebilir.
- `Hata olmadan tamamlandı.` ifadesi, `Tamam.` olarak değiştirildi; bu, `hata` kelimesi üzerinde yanlışlıkla hata vermemek için yapılmıştır.