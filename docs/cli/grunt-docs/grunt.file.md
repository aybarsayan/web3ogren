---
title: Grunt  Dosya Özellikleri
description: This document provides a comprehensive guide to the Grunt file utility functions for reading, writing, and managing files in Node.js, including various encoding and globbing methods.
keywords: [Grunt, file utility, Node.js, encoding, globbing]
---

:::note
Tüm dosya yolları `Gruntfile` ile ilişkilidir. Mevcut çalışma dizini `grunt.file.setBase` veya `--base` komut satırı seçeneği ile değiştirilmedikçe.
:::

## Karakter kodlama

### grunt.file.defaultEncoding
Bu özelliği ayarlayarak tüm `grunt.file` yöntemleri tarafından kullanılan varsayılan kodlamayı değiştirebilirsiniz. Varsayılan değer `'utf8'`dir. Bu değeri değiştirmek zorundaysanız, bunu Gruntfile'ınızın içinde mümkün olan en erken tarihte yapmanız önerilir.

```js
grunt.file.defaultEncoding = 'utf8';
```

### grunt.file.preserveBOM
*0.4.2'de Eklendi*

`file.read` üzerinde Byte Order Mark (BOM) koruyup korumayacağını belirler.

```js
grunt.file.preserveBOM = false;
```

## Okuma ve yazma

### grunt.file.read
Bir dosyanın içeriğini okuyup döndürür. `options.encoding` `null` ise, bir [Buffer](https://nodejs.org/docs/latest/api/buffer.html) döndürür.

```js
grunt.file.read(filepath [, options])
```

`options` nesnesinin bu olası özellikleri vardır:

```js
var options = {
  // Eğer bir kodlama belirtilmemişse, varsayılan olarak grunt.file.defaultEncoding kullanılır.
  // null olarak belirtilirse, bir dize yerine bir dekode edilmemiş Buffer döndürülür.
  encoding: encodingName
};
```

### grunt.file.readJSON
Bir dosyanın içeriğini okur, verileri JSON olarak ayrıştırır ve sonucu döndürür. Desteklenen seçeneklerin bir listesini görmek için `grunt.file.read`'e bakın.

```js
grunt.file.readJSON(filepath [, options])
```

### grunt.file.readYAML
Bir dosyanın içeriğini okur, verileri YAML olarak ayrıştırır ve sonucu döndürür. Desteklenen seçeneklerin bir listesini görmek için `grunt.file.read`'e bakın.

```js
grunt.file.readYAML(filepath [, options])
```

### grunt.file.write
Belirtilen içeriği bir dosyaya yazar, gerekli olduğunda ara dizinleri oluşturur. Dizeler belirtilen karakter kodlaması kullanılarak kodlanacak, [Buffers](https://nodejs.org/docs/latest/api/buffer.html) belirtilen şekilde diske yazılacaktır.

> **Not:** `--no-write` komut satırı seçeneği belirtilirse, dosya gerçekte yazılmayacaktır.

```js
grunt.file.write(filepath, contents [, options])
```

`options` nesnesinin bu olası özellikleri vardır:

```js
var options = {
  // Eğer bir kodlama belirtilmemişse, varsayılan olarak grunt.file.defaultEncoding kullanılır.
  // Eğer `contents` bir Buffer ise, kodlama dikkate alınmaz.
  encoding: encodingName
};
```

### grunt.file.copy
Bir kaynak dosyayı bir hedef yolu kopyalar, gerektiğinde ara dizinleri oluşturur.

> **Not:** `--no-write` komut satırı seçeneği belirtilirse, dosya gerçekte yazılmayacaktır.

```js
grunt.file.copy(srcpath, destpath [, options])
```

`options` nesnesinin bu olası özellikleri vardır:

```js
var options = {
  // Eğer bir kodlama belirtilmemişse, varsayılan olarak grunt.file.defaultEncoding kullanılır.
  // null ise, `process` fonksiyonu bir Dize yerine bir Buffer alacaktır.
  encoding: encodingName,
  // Kaynak dosya içeriği, kaynak dosya yolu ve hedef dosya yolu
  // bu işlevin içine geçirilir, döndürdüğü değer
  // hedef dosyanın içeriği olarak kullanılacaktır. Eğer bu işlev `false` dönerse, dosya
  // kopyası iptal edilecektir.
  process: processFunction,
  // Bu isteğe bağlı globbing desenleri dosya yoluna
  // (dosya adı değil) göre grunt.file.isMatch kullanılarak eşleştirilecektir. Eğer belirtilen herhangi bir globbing
  // deseni eşleşirse, dosya `process` fonksiyonu aracılığıyla işlenmeyecektir.
  // Eğer `true` belirtilirse, işleme engellenecektir.
  noProcess: globbingPatterns
};
```

### grunt.file.delete
Belirtilen dosya yolunu siler. Dosyaları ve klasörleri özyinelemeli olarak siler.

> **Uyarı:** Geçerli çalışma dizinini veya geçerli çalışma dizininin dışındaki dosyaları `--force` komut satırı seçeneği belirtilmedikçe silmeyecek.  
> **Not:** `--no-write` komut satırı seçeneği belirtilirse, dosya yolu gerçekte silinmeyecektir.

```js
grunt.file.delete(filepath [, options])
```

`options` nesnesinin bir olası özelliği vardır:

```js
var options = {
  // Geçerli çalışma dizininin dışındaki dosyaların silinmesini etkinleştirir. Bu seçenek
  // `--force` komut satırı seçeneği ile geçersiz kılınabilir.
  force: true
};
```

---

## Dizinler

### grunt.file.mkdir
`mkdir -p` gibi çalışır. Ara dizinlerle birlikte bir dizin oluşturur. Eğer `mode` belirtilmemişse, varsayılan değeri `0777 & (~process.umask())`dir.

> **Not:** `--no-write` komut satırı seçeneği belirtilirse, dizinler gerçekte oluşturulmayacaktır.

```js
grunt.file.mkdir(dirpath [, mode])
```

### grunt.file.recurse
Bir dizine özyinelemeli olarak girer, her dosya için `callback` işlevini çalıştırır.

```js
grunt.file.recurse(rootdir, callback)
```

Geri çağırma işlevi şu argümanları alır:

```js
function callback(abspath, rootdir, subdir, filename) {
  // Geçerli dosyanın tam yolu, yalnızca
  // rootdir + subdir + filename argümanlarının birleştirilmesidir.
  abspath
  // Başlangıçta belirtilen kök dizin.
  rootdir
  // Geçerli dosyanın kök dizine göre dizini.
  subdir
  // Geçerli dosyanın, dizin parçaları olmadan, dosya adı.
  filename
}
```

## Globbing desenleri
Tüm kaynak dosya yollarını tek tek belirtmek genellikle pratik değildir, bu nedenle Grunt, yerleşik [node-glob](https://github.com/isaacs/node-glob) kitaplığı aracılığıyla dosya adı genişletmeyi (globbing olarak da bilinir) destekler.

Globbing desenleri örnekleri için [[Görevleri yapılandırma]] kılavuzunun "Globbing desenleri" bölümüne bakın.

### grunt.file.expand
Verilen globbing deseni ile eşleşen tüm dosya veya dizin yollarının benzersiz bir dizisini döndürür. Bu yöntem ya virgülle ayrılmış globbing desenleri ya da bir globbing desenleri dizisi alır. `!` ile başlayan desenler döndürülen diziden hariç tutulacaktır. Desenler sırayla işlenir, bu nedenle dahil etme ve hariç tutma sırası önemlidir.

```js
grunt.file.expand([options, ] patterns)
```

Dosya yolları `Gruntfile` ile ilişkilidir, mevcut çalışma dizini `grunt.file.setBase` veya `--base` komut satırı seçeneği ile değiştirilmedikçe.

`options` nesnesi tüm [minimatch kitaplığı](https://github.com/isaacs/minimatch) seçeneklerini ve birkaç diğerini destekler. Örneğin:

* `filter` Geçerli bir [fs.Stats yöntem adı](https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats) veya eşleşen `src` dosya yolunu alıp `true` veya `false` döndüren bir işlev.
* `nonull` Dosyalarla eşleşmemesi durumunda `src` desenlerini korur. Grunt'ın `--verbose` bayrağı ile birleştirildiğinde, bu seçenek dosya yolu sorunlarını debugging yapmaya yardımcı olabilir.
* `matchBase` Klasör noktası olmayan desenler yalnızca temel adı ile eşleşecektir. Örneğin, bu `*.js`'in `**/*.js` gibi çalışmasını sağlar.
* `cwd` Desenler bu yüke göre eşleştirilecektir ve döndürülen tüm dosya yolları da bu yüke göre olacaktır.

### grunt.file.expandMapping
Kaynak-hedef dosya eşleme nesnelerinin bir dizisini döndürür. Belirtilen bir desenle eşleşen her kaynak dosya için, bu dosya yolunu belirtilen `dest` ile birleştirir. Bu dosya yolu flat veya yeniden adlandırılabilir; bu seçeneklere bağlı olarak değişir. `patterns` ve `options` argümanlarının nasıl belirtilebileceği ile ilgili açıklama için `grunt.file.expand` yönteminin belgelerine bakın.

```js
grunt.file.expandMapping(patterns, dest [, options])
```

:::info
Bu yöntem programatik olarak çoklu bir görev için bir `files` dizisi oluşturmak için kullanılabileceği gibi, "Dosya nesnesini dinamik olarak oluşturma" bölümünde [[Görevleri yapılandırma]] kılavuzunda açıklanan deklaratif sözdizimi tercih edilir.
:::

`grunt.file.expand` yöntemi tarafından desteklenenlere ek olarak, `options` nesnesi ayrıca bu özellikleri de destekler:

```js
var options = {
  // Desenlerin eşleştirildiği dizin. Cwd olarak belirtilen herhangi bir dize
  // etkili bir şekilde tüm eşleşen yolların başından çıkarılır.
  cwd: String,
  // Tüm eşleşen src dosyalarından yol bileşenini çıkarır. Src dosya yolu
  // belirtilen dest ile hala birleştirilecektir.
  flatten: Boolean,
  // Hedef yolda (options.extDot ile belirtilen) ilk veya son "." dahil
  // her şeyi çıkartıp, ardından bu değeri ekleyin.
  ext: String,
  // *0.4.3'de Eklendi*
  // Periyodun hangi yerde, uzantıyı (extension) belirlediğini gösterir. Alabilir:
  // - 'first' (uzantı dosya adındaki ilk periyottan sonra başlar)
  // - 'last' (uzantı son periyottan sonra başlar)
  // Varsayılan: 'first'
  extDot: String,
  // Eğer belirtilirse, bu işlev son hedef dosya yolunu döndürmekten sorumlu olacaktır.
  // Varsayılan olarak, hedef ve eşleşenSrcYolunu bu şekilde birleştirir:
  rename: function(dest, matchedSrcPath, options) {
    return path.join(dest, matchedSrcPath);
  }
};
```

### grunt.file.match
Bir veya daha fazla globbing desenini bir veya daha fazla dosya yoluna eşleştirir. Belirtilen globbing desenlerinden herhangi birine uyan tüm dosya yollarının benzersiz bir dizisini döndürür. Hem `patterns` hem de `filepaths` argümanı tek bir dize veya dize dizisi olabilir. `!` ile başlayan desenlere uyan yollar döndürülen diziden hariç tutulacaktır. Desenler sırayla işlenir, bu nedenle dahil etme ve hariç tutma sırası önemlidir.

```js
grunt.file.match([options, ] patterns, filepaths)
```

`options` nesnesi tüm [minimatch kitaplığı](https://github.com/isaacs/minimatch) seçeneklerini destekler. Örneğin, `options.matchBase` true ise, klasör noktası içermeyen desenler yolların temel adıyla eşleşecektir; örneğin, desen `*.js` dosya yolu `path/to/file.js` ile eşleşecektir.

### grunt.file.isMatch
Bu yöntem `grunt.file.match` yönteminin aynı imzasına ve mantığına sahiptir, ancak herhangi bir dosya eşleşirse `true` döner, aksi takdirde `false` döner.

## Dosya türleri

### grunt.file.exists
Verilen yol mevcut mu? Bir boolean değeri döndürür.

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

```js
grunt.file.exists(path1 [, path2 [, ...]])
```

### grunt.file.isLink
Verilen yol bir sembolik bağlantı mı? Bir boolean değeri döndürür.

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

```js
grunt.file.isLink(path1 [, path2 [, ...]])
```

Yol mevcut değilse `false` döner.

### grunt.file.isDir
Verilen yol bir dizin mi? Bir boolean değeri döndürür.

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

```js
grunt.file.isDir(path1 [, path2 [, ...]])
```

Yol mevcut değilse `false` döner.

### grunt.file.isFile
Verilen yol bir dosya mı? Bir boolean değeri döndürür.

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

```js
grunt.file.isFile(path1 [, path2 [, ...]])
```

Yol mevcut değilse `false` döner.

## Yollar

### grunt.file.isPathAbsolute
Verilen dosya yolu mutlak mı? Bir boolean değeri döndürür.

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

```js
grunt.file.isPathAbsolute(path1 [, path2 [, ...]])
```

### grunt.file.arePathsEquivalent
Tüm belirtilen yollar aynı yola mı işaret ediyor? Bir boolean değeri döndürür.

```js
grunt.file.arePathsEquivalent(path1 [, path2 [, ...]])
```

### grunt.file.doesPathContain
Tüm alt yol(lar) belirtilen üst yolun içinde mi? Bir boolean değeri döndürür.

> **Not:** yolların gerçekte var olup olmadığını kontrol etmez.

```js
grunt.file.doesPathContain(ancestorPath, descendantPath1 [, descendantPath2 [, ...]])
```

### grunt.file.isPathCwd
Verilen dosya yolu geçerli çalışma dizini mi? Bir boolean değeri döndürür.

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

```js
grunt.file.isPathCwd(path1 [, path2 [, ...]])
```

### grunt.file.isPathInCwd
Verilen dosya yolu geçerli çalışma dizini içinde mi? Not: Geçerli çalışma dizinidir, CWD içinde değildir. Bir boolean değeri döndürür.

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

```js
grunt.file.isPathInCwd(path1 [, path2 [, ...]])
```

### grunt.file.setBase
Grunt'ın geçerli çalışma dizinini (CWD) değiştirir. Varsayılan olarak, tüm dosya yolları `Gruntfile` ile ilişkilidir. Bu, `--base` komut satırı seçeneği ile aynı şekilde çalışır.

```js
grunt.file.setBase(path1 [, path2 [, ...]])
```

Node.js [path.join](https://nodejs.org/docs/latest/api/path.html#path_path_join_path1_path2) yöntemine benzer şekilde, bu yöntem tüm argümanları birleştirerek sonuçta oluşan yolu normalize eder.

## Harici kitaplıklar
*Eski*

__Aşağıda listelenen tüm harici kitaplıklar artık eski olarak kabul edilmektedir.__

Lütfen proje bağımlılıklarınıza bu harici kitaplıkları yönetmek için __npm__ kullanın.

Örneğin, [Lo-Dash](https://www.npmjs.org/package/lodash) kullanmak istiyorsanız, önce `npm install lodash` ile kurun, ardından
`Gruntfile`'ınızda kullanın: `var _ = require('lodash');`

### grunt.file.glob
*Eski*

[glob](https://github.com/isaacs/node-glob) - Dosya globbing yardımcı programı.

### grunt.file.minimatch
*Eski*

[minimatch](https://github.com/isaacs/minimatch) - Dosya desen eşleştirme yardımcı programı.

### grunt.file.findup
*Eski*

[findup-sync](https://github.com/cowboy/node-findup-sync) - Eşleşen dosya desenlerini aramak için yukarı yönde arama yapın.