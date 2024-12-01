---
title: CLI Kurulumu
description: Bu bölüm, Grunt CLI kurulumunu ve başlangıçta kullanılan komutların açıklamalarını sunar. Grunt CLI ile çalışma seçeneklerini doğru bir şekilde anlamak, projelerinizin verimliliğini artıracaktır.
keywords: [Grunt, CLI, kurulum, komut, npm, yapılandırma, hata ayıklama]
---

# Grunt CLI Kullanımı

## CLI Kurulumu

`sudo npm install -g grunt-cli` komutunu çalıştırın (Windows kullanıcıları "sudo " kısmını atlayabilir ve komutu yönetici ayrıcalıklarıyla çalıştırmaları gerekebilir).

:::info
`grunt` komut satırı arayüzü bir dizi seçenekle birlikte gelir. Bu seçenekleri göstermek için terminalinizden `grunt -h` komutunu kullanın.
:::

### --help, -h

Yardım metnini görüntüle.

### --base, -b

Alternatif bir temel yol belirtin. Varsayılan olarak, tüm dosya yolları `Gruntfile`'a göredir.

`grunt.file.setBase(...)` alternatifidir.

### --no-color

Renkli çıktıyı devre dışı bırak.

### --gruntfile

Alternatif bir `Gruntfile` belirtin.

Varsayılan olarak, grunt, mevcut veya üst dizinlerde en yakın `Gruntfile.js` veya `Gruntfile.[ext]` dosyasını arar.

### --debug, -d

Bunu destekleyen görevler için hata ayıklama modunu etkinleştir.

### --stack

Uyarı veya kritik bir hata ile çıkarken bir yığın izini yazdır.

### --force, -f

Uyarıların üstesinden gelmek için bir yol.

> Bir öneri mi istersiniz? Bu seçeneği kullanmayın, kodunuzu düzeltin.  
> — Grunt Belgeleri

### --tasks

Görev ve "ekstra" dosyaları taramak için ek dizin yolları.

`grunt.loadTasks(...)` alternatifidir.

### --npm

Görev ve "ekstra" dosyaları taramak için npm ile yüklenen grunt eklentileri.

`grunt.loadNpmTasks(...)` alternatifidir.

### --no-write

Dosya yazmayı devre dışı bırak (kuru çalıştırma).

### --verbose, -v

Ayrıntılı mod. Çok daha fazla bilgi çıktısı.

### --version, -V

Grunt sürümünü yazdır. Daha fazla bilgi için --verbose ile birleştirin.

### --completion

Kabuk otomatik tamamlama kurallarını çıktı olarak ver. Daha fazla bilgi için grunt-cli belgelerine bakın.

### --preload

Grunt'un varsayılan olarak desteklemediği bir dilde Gruntfile yazıyorsanız, öncelikle gerektireceğiniz bir dil yorumlayıcı belirtilir.

### --require (Grunt 1.3.0 ve altı)

Grunt'un varsayılan olarak desteklemediği bir dilde Gruntfile yazıyorsanız, öncelikle gerektireceğiniz bir dil yorumlayıcı belirtilir.