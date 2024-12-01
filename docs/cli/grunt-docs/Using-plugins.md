---
title: Grunt Eklentileri
description: Grunt eklentileri, belirli derleme adımlarını uygulayan görevleri tanımlar ve çoklu projelerde yeniden kullanılabilir. Bu rehber, Grunt eklentilerinin nasıl yükleneceği, görevlerin nasıl çalıştırılacağı ve yapılandırılacağı hakkında önemli bilgiler sağlar.
keywords: [Grunt, eklenti, npm, görev, yapılandırma, node_modules, devDependency]
---

Grunt eklentileri, belirli derleme adımlarını uygulayan görevleri tanımlar ve çoklu projelerde yeniden kullanılabilir. Örnekler, _"grunt-contrib-uglify"_ eklentisini kullanacaktır. Mevcut eklentilerin listesi için [Grunt web sitesini](https://gruntjs.com/) kontrol edin.

## Grunt eklentisi yükleme

Mevcut bir Grunt eklentisini kullanmanın ilk adımı onu yüklemektir. Grunt eklentileri, node modülleri olarak paketlenmiştir ve [npm](http://npmjs.org) kullanılarak şu şekilde yüklenebilir:

```bash
npm install --save-dev grunt-contrib-uglify
```

:::tip
Bu işlem, Grunt eklentisi _"grunt-contrib-uglify"_'yı yerel olarak `node_modules` klasörüne yükleyecektir (bkz. [npm klasörleri](https://docs.npmjs.com/files/folders)). 
:::

Eklentiler, birden fazla projeyle çalışırken sürüm çakışmalarını önlemek için yerel olarak yüklenmelidir. `--save-dev` seçeneğinin belirtilmesi, bu Grunt eklentisini otomatik olarak `package.json` dosyasındaki _"devDependency"_ bölümüne ekler. Bu dosya, bir projenin tüm node bağımlılıklarını listeler. **Grunt eklentisini buraya eklemek**, projede çalışan diğer geliştiricilerin bu gerekli bağımlılıkları yerel olarak yüklemek için sadece `npm install` komutunu çalıştırmasını sağlar.

## Eklenti görevlerini yükleme

Eklenti yüklendikten sonra, Grunt'a bunu bildirme ve tanımlı tüm görevleri yüklemesine izin verme zamanı geldi. Bunu yapmak için, `Gruntfile.js` dosyanıza aşağıdaki satırı ekleyin:

```javascript
grunt.loadNpmTasks('grunt-contrib-uglify')
```

Bu satır, diğer `grunt.registerTask()` çağrılarının yapıldığı üst düzey işlev kapsamına eklenmelidir (initConfig bölümüne değil).

### Monorepos

v1.2.0'dan itibaren, Grunt, Node.js ve NPM’ye görünür olan herhangi bir konumda bulunan eklentilerini yükleyecektir; doğrudan bu eklentilere dev bağımlılığı olan paketlerin node_modules klasörüne değil.

## Eklenti görevlerini çalıştırma

Eklenti görevleri, komut satırında belirtilerek diğer Grunt görevleri gibi çalıştırılabilir:

```bash
grunt uglify
```

Ya da bu görevi çağıran yeni bir görev takma adı kaydederek ve o görevi çalıştırarak:

```javascript
grunt.registerTask("dist", ["uglify"])
```

## Eklentileri yapılandırma

Eklenti yapılandırması, belirli eklentiye bağlıdır, bu nedenle daha fazla bilgi için eklentinin belgelerini kontrol edin. Genel olarak yapılandırma, Gruntfile'daki `initConfig` bölümünde bulunur.

:::note
**TODO**: Yapılandırma Hedefleri/seçenekleri (Görevleri Yapılandırma `Configuring tasks` ile birleştirilebilir mi?) 
:::