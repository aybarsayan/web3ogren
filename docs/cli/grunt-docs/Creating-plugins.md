---
description: Bu içerik, Grunt eklentileri ile ilgili hazırlık ve uygulama adımlarını içermektedir. Ayrıca hata ayıklama ve görev dosyalarının yönetimi hakkında önemli bilgiler sunar.
keywords: [Grunt, eklenti, npm, hata ayıklama, görev yönetimi, gruntfile, geliştirme]
---

# Grunt Pluginleri

1. [grunt-init](https://github.com/gruntjs/grunt-init) paketini `npm install -g grunt-init` ile yükleyin.

2. Gruntplugin şablonunu `git clone git://github.com/gruntjs/grunt-init-gruntplugin.git ~/.grunt-init/gruntplugin` ile yükleyin (`%USERPROFILE%\.grunt-init\gruntplugin` Windows'ta).

3. Boş bir dizinde `grunt-init gruntplugin` komutunu çalıştırın.

4. Geliştirme ortamını hazırlamak için `npm install` komutunu çalıştırın.

5. Eklentinizi yazın.

6. Grunt eklentisini npm'ye yayınlamak için `npm publish` komutunu çalıştırın!

---

## Notlar

### Görevinizi Adlandırma

:::warning
"grunt-contrib" adı Grunt ekibi tarafından bakım yapılan görevler için ayrılmıştır, lütfen görevinizi bu isimlendirme şemasından kaçınarak uygun bir şekilde adlandırın.
:::

### Hata Ayıklama
Grunt, hata yığın izlerini varsayılan olarak gizler, ancak `--stack` seçeneği ile daha kolay görev hata ayıklama için etkinleştirilebilir. Grunt'ın her zaman hatalarda yığın izlerini günlüğe kaydetmesini istiyorsanız, kabuğunuzda bir takma ad oluşturun. Örn, bash'de `alias grunt='grunt --stack'` yapabilirsiniz.

### Görev Dosyalarını Saklama

:::tip
Sadece veri dosyalarını projenin kökünde bulunan .grunt/[npm-module-name]/ dizininde saklayın ve gerektiğinde arkanızı temizleyin. Bu, geçici dosyalar için bir çözüm değildir, bu durumda işletim sistemi düzeyi geçici dizinlerinden yararlanan yaygın npm modüllerinden birini (örneğin [temporary](https://www.npmjs.org/package/temporary), [tmp](https://www.npmjs.org/package/tmp)) kullanın.
:::

### Geçerli Çalışma Dizinini Değiştirmekten Kaçının: `process.cwd()`
Varsayılan olarak, geçerli çalışma dizini gruntfile'ı içeren dizin olarak ayarlanır. Kullanıcı bunu `grunt.file.setBase()` kullanarak kendi gruntfile'ında değiştirebilir, ancak eklentiler bunu değiştirmeye dikkat etmelidir.

> `path.resolve('foo')` ifadesi, 'foo' dosya yolunun `Gruntfile`'a göre mutlak yolunu almak için kullanılabilir.  
> — Grunt belgeleri

### Görevinizi Oluşturma

:::info
Ayrıca [kendi görevlerinizi oluşturma](https://gruntjs.com/creating-tasks) hakkında bilgi almak veya [API](https://gruntjs.com/api) referansına göz atmak isteyebilirsiniz.
:::