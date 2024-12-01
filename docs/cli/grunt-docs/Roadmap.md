---
title: Grunt 0.next
description: The Grunt 0.next release brings important updates including the removal of Node.JS 0.8 support, new logging capabilities, and the introduction of node-task modules for better task handling. These changes streamline task execution and enhance project workflows.
keywords: [Grunt, Node.JS, logging, node-task, task runner, configuration]
---

## Grunt 0.next

* Node.JS 0.8 desteği kaldırıldı
* Yeni logging ()
  * Olayları dinleyip konsola çıktı almaya yarayan bir logger. stderr/stdout ile ilgilenir veya Grunt'ın kendisi bunu gömülü olarak barındırır.
* node-task ()
  * Herhangi bir görev çalıştırıcısından bağımsız olarak gereksinim duyulabilen ve çalıştırılabilen npm modülleri olarak görevler. Uygun bir yapılandırma nesnesini çalıştırmak için manuel olarak inşa etmek isterseniz kullanılabilir. Birden fazla görev arasında veri boru hattı açabilir (coffeescript transpilation + uglify'yı tek adımda düşünün). Tüm görev çıktıları olay olarak yayınlanır.
  * Mevcut Gruntfile formatından node-task uyumlu modülleri çalıştırmak için geçerli bir forma ayarları işlemek amacıyla bir kütüphane (seçenekleri birleştirip, şablon genişletme, glob genişletme (madde #2'den lib kullanarak)). Yapılandırma çıktılarını kontrol etmek için kullanıcı tanımlı ara yazılımlar desteklenecektir.
  * node-task uyumlu modülleri çalıştırmak için madde #3'teki yapılandırma ayrıştırma kütüphanesini kullanan bir görev çalıştırıcı (programatik olarak veya cli üzerinden kullanılabilir). Paralel olarak çalıştırılabilecek görevleri derleyen "alias" görevlerini tanımlamayı destekler. Bakınız: 

---

## Grunt 0.5

### Güncelleme Sürümü

* Bağımlılıklar güncellendi
* `grunt.util.` altında dış kütüphaneler kaldırıldı
* Dizi glob'ları, olumsuzlama vb. ile başa çıkan bir glob genişletme kütüphanesi. Bakınız 

Güncellenmiş bilgiler için bakınız .

---

## Güncel Olmayan Bilgiler / Taslaklar

**0.5 Gruntfile Fikirleri**

```js
var grunt = require('grunt');

grunt.initConfig({
  // cli için varsayılanlar
  grunt: {
    dryRun: true,
    stack: true,
    verbose: true,
    // belirli bir görev için loglayıcılar tanımlamak ne olacak?
    // bu gruntfile'ınızda gerekli mi yoksa varsayılan olarak mı açık?
    logger: [require('grunt-logger')]
  },
  jshint: {
    // ...
  },
  concat: {
    // ...
  },
  min: {
    // ...
  }
});

grunt.registerTask(require('grunt-contrib-jshint'));
grunt.registerTask(require('grunt-contrib-concat'));
grunt.registerTask(require('grunt-contrib-uglify'), 'min'); // isteğe bağlı ikinci parametre yeniden adlandırır

// node-task uyumlu bir nesne yaratır ve üzerinde grunt.registerTask çalıştırır
grunt.registerTask('name','description', function (config) {
  //...
});

// paralel olarak çalıştırılacak bir görev seti yükleyin
grunt.registerTask('name', ['jshint', 'concat'], { parallel:true });

// bence cli bunun çağrılması gerekmeli ama burada bulunduruluyor çünkü buraya gitmesi gerektiğini düşündüğünüzü belirttiniz.
grunt.run();
```

***Lütfen aşağıdaki bölümü göz ardı edin. Dağınık bir çöp/tamamlanmamış bir çalışma ve herhangi bir yol haritası ile ilişkilendirilmemelidir.***

527 - görevlerin paralel olarak yürütülmesi  
545 - koşullu derleme (muhtemelen watch görevine ait)  
493 - cwd ile işleme  

* daha spesifik hata kodları  
  * Görev bulunamadı  
  * Görev başarısız  
  * Görev gereksinimi karşılanmadı  
  * Yapılandırma gereksinimi karşılanmadı  

---

## grunt-log
* stderr/stdout'a log yazdırır. [#586](https://github.com/gruntjs/grunt/issues/586) [#570](https://github.com/gruntjs/grunt/issues/570) [#120](https://github.com/gruntjs/grunt/issues/120)
* 

---

## grunt-file
* 

---

## grunt-util
* 