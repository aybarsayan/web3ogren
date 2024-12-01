---
title: Log API
description: Grunt's logging methods provide a consistent way to output messages during task execution. Learn how to utilize verbose logging, error handling, and helpful utilities for better task management.
keywords: [Grunt, log API, verbose logging, error handling, task management]
---

Konsola çıktısı mesajlarını görüntüleyin.

Daha fazla bilgi için [log lib kaynak](https://github.com/gruntjs/grunt-legacy-log/blob/master/index.js) sayfasına bakın.

## Log API'si
Grunt çıktısı tutarlı görünmeli ve belki de güzel olmalıdır. Bu nedenle birçok günlükleme yöntemi ve birkaç faydalı desen bulunmaktadır. Gerçekten bir şeyleri günlüğe kaydeden tüm yöntemler zincirleme kullanılabilir.

:::note
_Not: `grunt.verbose` altında mevcut olan tüm yöntemler `grunt.log` yöntemleriyle aynı şekilde çalışır, ancak yalnızca `--verbose` komut satırı seçeneği belirtildiyse günlüğe kaydedilir._
:::

### grunt.log.write / grunt.verbose.write
Belirtilen `msg` dizesini, sonuna yeni bir satır eklemeden günlüğe kaydedin.

```js
grunt.log.write(msg)
```

### grunt.log.writeln / grunt.verbose.writeln
Belirtilen `msg` dizesini, sonuna yeni bir satır ekleyerek günlüğe kaydedin.

```js
grunt.log.writeln([msg])
```

### grunt.log.error / grunt.verbose.error
Eğer `msg` dizesi belirtilmemişse, kırmızı renkte `ERROR` yazar, aksi halde `>> msg` yazar ve sonuna yeni bir satır ekler.

```js
grunt.log.error([msg])
```

### grunt.log.errorlns / grunt.verbose.errorlns
> `grunt.log.error` ile bir hata günlüğü kaydedin ve metni `grunt.log.wraptext` ile 80 sütuna kıvrın.
> — Grunt Documentation

```js
grunt.log.errorlns(msg)
```

### grunt.log.ok / grunt.verbose.ok
Eğer `msg` dizesi belirtilmemişse, yeşil renkte `OK` yazar, aksi halde `>> msg` yazar ve sonuna yeni bir satır ekler.

```js
grunt.log.ok([msg])
```

### grunt.log.oklns / grunt.verbose.oklns
`grunt.log.ok` ile bir ok mesajını günlüğe kaydedin ve metni `grunt.log.wraptext` ile 80 sütuna kıvrın.

```js
grunt.log.oklns(msg)
```

### grunt.log.subhead / grunt.verbose.subhead
Belirtilen `msg` dizesini **kalın** olarak, sonuna yeni bir satır ekleyerek günlüğe kaydedin.

```js
grunt.log.subhead(msg)
```

### grunt.log.writeflags / grunt.verbose.writeflags
`obj` özelliklerinin bir listesini günlüğe kaydedin (bayrakları hata ayıklamak için iyi).

```js
grunt.log.writeflags(obj, prefix)
```

### grunt.log.debug / grunt.verbose.debug
Sadece `--debug` komut satırı seçeneği belirtilmişse, hata ayıklama mesajını günlüğe kaydeder.

```js
grunt.log.debug(msg)
```

## Ayrıntılı ve Ayrıntısız
`grunt.verbose` altında mevcut olan tüm günlükleme yöntemleri, `grunt.log` karşılıklarıyla aynı şekilde çalışır, ancak yalnızca `--verbose` komut satırı seçeneği belirtildiyse günlüğe kaydeder. Ayrıca, hem `grunt.log.notverbose` hem de `grunt.log.verbose.or` altında mevcut bir "notverbose" karşılığı vardır. Aslında, `.or` özelliği hem `verbose` hem de `notverbose` üzerinde kullanılabilir ve böylece ikisi arasında etkin bir şekilde geçiş yapılabilir.

### grunt.verbose / grunt.log.verbose
Bu nesne, yalnızca `--verbose` komut satırı seçeneği belirtilmişse günlüğe kaydeden `grunt.log`'ın tüm yöntemlerini içerir.

```js
grunt.verbose
```

### grunt.verbose.or / grunt.log.notverbose
Bu nesne, yalnızca `--verbose` komut satırı seçeneği _belirtilmemişse_ günlüğe kaydeden `grunt.log`'ın tüm yöntemlerini içerir.

```js
grunt.verbose.or
```

## Yardımcı Yöntemler
Bu yöntemler aslında günlüğe kaydetmez, yalnızca diğer yöntemlerde kullanılabilecek dizeleri döndürür.

### grunt.log.wordlist
Bir `arr` dizisi öğelerinin virgülle ayrılmış bir listesini döndürür.

```js
grunt.log.wordlist(arr [, options])
```

`options` nesnesinin olası özellikleri ve varsayılan değerleri şunlardır:

```js
var options = {
  // Ayırıcı dizesi (renklendirilebilir).
  separator: ', ',
  // Dizi öğesi rengi (renklendirmemek için false belirtin).
  color: 'cyan',
};
```

### grunt.log.uncolor
Bir dize üzerindeki tüm renk bilgilerini kaldırır ve `.length` test etmek veya belki de bir dosyaya günlüğe kaydetmek için uygun hale getirir.

```js
grunt.log.uncolor(str)
```

### grunt.log.wraptext
`text` dizesini `width` karakter genişliğine `\n` ile sarın, kelimelerin ortadan bölünmemesini sağlayın, kesinlikle gerekli olmadıkça.

```js
grunt.log.wraptext(width, text)
```

### grunt.log.table
`widths` karakter genişliğinde `texts` dizisindeki dizeleri sütunlar halinde sarın. Sütunlarda çıktı oluşturmak için `grunt.log.wraptext` yönteminin bir sarıcıdır.

```js
grunt.log.table(widths, texts)
```

## Bir Örnek

Ortak bir desen, yalnızca `--verbose` modunda veya bir hata meydana geldiğinde günlüğe kaydetmektir, şöyle:

```js
grunt.registerTask('something', 'İlginç bir şey yap.', function(arg) {
  var msg = 'Bir şey yapılıyor...';
  grunt.verbose.write(msg);
  try {
    doSomethingThatThrowsAnExceptionOnError(arg);
    // Başarılı!
    grunt.verbose.ok();
  } catch(e) {
    // Bir şey yanlış gitti.
    grunt.verbose.or.write(msg).error().error(e.message);
    grunt.fail.warn('Bir şey yanlış gitti.');
  }
});
```

Yukarıdaki kodun açıklaması:

1. `grunt.verbose.write(msg);` mesajı günlüğe kaydeder (yeni bir satır yok), ancak yalnızca `--verbose` modunda.
2. `grunt.verbose.ok();` yeşil renkte OK yazar, yeni bir satır ekler.
3. `grunt.verbose.or.write(msg).error().error(e.message);` birkaç şey yapar:
  1. `grunt.verbose.or.write(msg)` mesajı günlüğe kaydeder (yeni bir satır yok) eğer `--verbose` modunda değilse ve `notverbose` nesnesini döner.
  2. `.error()` kırmızı renkte ERROR yazar, yeni bir satır ekler ve `notverbose` nesnesini döner.
  3. `.error(e.message);` gerçek hata mesajını günlüğe yazar (ve `notverbose` nesnesini döner).
4. `grunt.fail.warn('Bir şey yanlış gitti.');` parlak sarı renkte bir uyarı yazar, `--force` belirtilmediyse Grunt'ı çıkış kodu 1 ile kapatır.

Daha fazla örnek için [grunt-contrib-* görevleri kaynak koduna](https://github.com/gruntjs) göz atın.