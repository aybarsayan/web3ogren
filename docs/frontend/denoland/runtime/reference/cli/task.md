---
title: "`deno task`"
description: "`deno task`, bir kod tabanı için özel komutları tanımlamak ve çalıştırmak için çok platformlu bir yol sağlar. Komutları belirlemek ve yürütmek için Deno yapılandırma dosyasını kullanabilirsiniz."
keywords: [Deno, task, komut, çok platformlu, yapılandırma, ortam değişkenleri, bağımlılıklar]
oldUrl:
 - /runtime/tools/task_runner/
 - /runtime/manual/tools/task_runner/
 - /runtime/reference/cli/task_runner/
command: task
---

## Açıklama

`deno task`, bir kod tabanı için özel komutları tanımlamak ve çalıştırmak için çok platformlu bir yol sağlar.

Başlamak için, komutlarınızı kod tabanınızın
`Deno yapılandırma dosyasında` `"tasks"` anahtarı altında tanımlayın.

:::tip
Başlangıçta kullanılan yapılandırma ile komutlarınızı etkili bir şekilde yönetin.
:::

Örneğin:

```jsonc
{
  "tasks": {
    "data": "deno task collect && deno task analyze",
    "collect": "deno run --allow-read=. --allow-write=. scripts/collect.js",
    "analyze": {
      "description": "Analiz betiğini çalıştır",
      "command": "deno run --allow-read=. scripts/analyze.js"
    }
  }
}
```

## Geçerli çalışma dizinini belirtme

Varsayılan olarak, `deno task`, Deno yapılandırma dosyasının dizinini (ör. _deno.json_) geçerli çalışma dizini olarak kullanır. Bu, görevlerin göreli yolları kullanmasını ve deno görevini nerede çalıştırırsanız çalışmaya devam etmesini sağlar. Bazı senaryolarda, bu istenmeyebilir ve bu davranış `INIT_CWD` ortam değişkeni ile geçersiz kılınabilir.

:::info
`INIT_CWD`, görev çalıştırıldığında dizininin tam yolu ile ayarlanacak, eğer daha önce ayarlanmamışsa.
:::

Bu, `npm run` ile aynı davranışla uyumludur.

Örneğin, aşağıdaki görev, görev kullanıcı tarafından çalıştırılan dizinde geçerli çalışma dizinini değiştirecek ve ardından artık o dizinde olan geçerli çalışma dizinini çıktılayacaktır (unutmayın, bu Windows'da da çalışır çünkü `deno task` çok platformludur).

```json
{
  "tasks": {
    "my_task": "cd $INIT_CWD && pwd"
  }
}
```

## `deno task`'in çalıştırıldığı dizini alma

Görevler, geçerli çalışma dizini olarak Deno yapılandırma dosyasının dizinini kullanarak çalıştırıldığı için, 
`deno task`'in hangi dizinden çalıştırıldığını bilmek faydalı olabilir. Bu, `deno task`'ten başlatılan bir görev veya betikte `INIT_CWD` ortam değişkenini kullanarak mümkündür (aynı şekilde çalışır `npm run`, ama çok platformlu bir şekilde).

:::note
Bu bilgiyi kullanarak geliştirme süreçlerinizi optimize edebilirsiniz.
:::

Örneğin, bu dizini bir betiğe sağlamak için bir görevde şu şekilde yapabilirsiniz (dizinin boşluk içerme ihtimaline karşı, tek bir argüman olarak kalması için çift tırnak içinde çevrelenmiştir):

```json
{
  "tasks": {
    "start": "deno run main.ts \"$INIT_CWD\""
  }
}
```

## Görev bağımlılıkları

Bir göreve bağımlılıkları belirtebilirsiniz:

```json title="deno.json"
{
  "tasks": {
    "build": "deno run -RW build.ts",
    "generate": "deno run -RW generate.ts",
    "serve": {
      "command": "deno run -RN server.ts",
      "dependencies": ["build", "generate"]
    }
  }
}
```

Yukarıdaki örnekte, `deno task serve` çalıştırıldığında, önce `build` ve
`generate` görevlerini paralel olarak çalıştıracak ve her ikisi de başarıyla tamamlandığında `serve` görevi çalıştırılacaktır:

```bash
$ deno task serve
Görev build deno run -RW build.ts
Görev generate deno run -RW generate.ts
Veri üretiliyor...
Yapı başlatılıyor...
Yapı tamamlandı
Veri üretildi
Görev serve deno run -RN server.ts
http://localhost:8000/ adresinde dinleniyor...
```

Bağımlılık görevleri paraleldir ve varsayılan paralel limitiniz, makinenizdeki çekirdek sayısına eşittir. Bu limiti değiştirmek için `DENO_JOBS` ortam değişkenini kullanabilirsiniz.

Bağımlılıklar takip edilir ve birden fazla görev aynı görevi gerektiriyorsa, o görev yalnızca bir kez çalıştırılır:

```jsonc title="deno.json"
{
  //   a
  //  / \
  // b   c
  //  \ /
  //   d
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b", "c"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["d"]
    },
    "c": {
      "command": "deno run c.js",
      "dependencies": ["d"]
    },
    "d": "deno run d.js"
  }
}
```

```bash
$ deno task a
Görev d deno run d.js
d çalıştırılıyor
Görev c deno run c.js
c çalıştırılıyor
Görev b deno run b.js
b çalıştırılıyor
Görev a deno run a.js
a çalıştırılıyor
```

Eğer bağımlılıklar arasında bir döngü keşfedilirse, bir hata dönecektir:

```jsonc title="deno.json"
{
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["a"]
    }
  }
}
```

```bash
$ deno task a
Görev döngüsü tespit edildi: a -> b -> a
```

## Çalışma alanı desteği

`deno task`, çoklu üye dizinlerinden görevleri paralel olarak çalıştırmak için çalışma alanlarında kullanılabilir. Tüm çalışma alanı üyelerinden `dev` görevlerini çalıştırmak için `--recursive` bayrağını kullanın:

```jsonc title="deno.json"
{
  "workspace": [
    "client",
    "server"
  ]
}
```

```jsonc title="client/deno.json"
{
  "tasks": {
    "dev": "deno run -RN build.ts"
  }
}
```

```jsonc title="server/deno.json"
{
  "tasks": {
    "dev": "deno run -RN server.ts"
  }
}
```

```bash
$ deno task --recursive dev
Görev dev deno run -RN build.ts
Görev dev deno run -RN server.ts
Projeyi paketliyoruz...
http://localhost:8000/ adresinde dinleniyor...
Proje paketlendi
```

Çalıştırılacak görevler, çalışma alanı üyelerine göre filtrelenebilir:

```bash
$ deno task --filter "client/*" dev
Görev dev deno run -RN build.ts
Projeyi paketliyoruz...
Proje paketlendi
```

## Söz Dizimi

`deno task`, tanımlanan görevleri çalıştırmak için sh/bash'ın bir alt kümesi olan çok platformlu bir shell kullanır.

### Boolean listeleri

Boolean listeleri, ilk komutun çıkış koduna dayalı olarak ek komutlar çalıştırmak için bir yol sağlar. Komutları `&&` ve `||` operatörleri ile ayırır.

:::note
Boolean listelerinde kullanılan operatörlerin doğru şekilde sıralanması, komutların doğru çıktılar almasını sağlar.
:::

`&&` operatörü, bir komutu çalıştırma ve eğer _başarılıysa_ (çıkış kodu `0` ise) bir sonraki komutu çalıştırma yolunu sağlar:

```sh
deno run --allow-read=. --allow-write=. collect.ts && deno run --allow-read=. analyze.ts
```

`||` operatörü bunun tersidir. Bir komutu çalıştırma ve yalnızca _başarısızsa_ (sıfırdan farklı bir çıkış kodu varsa) bir sonraki komutu çalıştırma yolunu sağlar:

```sh
deno run --allow-read=. --allow-write=. collect.ts || deno run play_sad_music.ts
```

### Sıralı listeler

Sıralı listeler, boolean listelerine benzer, ancak listedeki bir önceki komutun başarılı olup olmadığına bakılmaksızın çalıştırılır. Komutlar bir nokta ve virgül (`;`) ile ayrılır.

```sh
deno run output_data.ts ; deno run --allow-net server.ts
```

### Asenkron komutlar

Asenkron komutlar, bir komutun asenkron olarak çalıştırılmasını sağlamak için bir yol sunar. Bu, birden fazla işlemi başlatırken faydalı olabilir. Bir komutu asenkron hale getirmek için, sonuna `&` ekleyin. Örneğin aşağıdaki, `sleep 1 && deno run --allow-net client.ts` ve `deno run --allow-net server.ts`'yi aynı anda çalıştırır:

```sh
sleep 1 && deno run --allow-net client.ts & deno run --allow-net server.ts
```

Çoğu shell'de olduğu gibi, ilk asenkron komut başarısız olursa diğer tüm komutlar hemen başarısız olacaktır. Yukarıdaki örnekte, bu, eğer client komutu başarısız olursa, server komutunun da başarısız olacağı ve çıkacağı anlamına gelir. Bu davranıştan vazgeçmek için bir komutun sonuna `|| true` ekleyebilirsiniz, bu da `0` çıkış kodunu zorlayacaktır. Örneğin:

```sh
deno run --allow-net client.ts || true & deno run --allow-net server.ts || true
```

### Ortam değişkenleri

Ortam değişkenleri aşağıdaki gibi tanımlanır:

```sh
export VAR_NAME=value
```

Bir görevin içinde birini shell değişkeni yerine kullanmanın ve sonra Deno
işleminin ortamının bir parçası olarak dışa aktarılmasının bir örneği (not: JSON yapılandırma dosyasında çift tırnakların ters eğik çizgilerle kaçırılması gerekir):

```sh
export VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

Aşağıdaki çıktıyı verecektir:

```console
hello
Deno: hello
```

#### Bir komut için ortam değişkenlerini ayarlama

Bir komuttan önce ortam değişken(leri) belirtmek için şu şekilde sıralayın:

```console
VAR=hello VAR2=bye deno run main.ts
```

Bu, bu ortam değişkenlerini sadece sonraki komut için kullanacaktır.

### Shell değişkenleri

Shell değişkenleri, ortam değişkenlerine benzer, ancak oluşturulan komutlara dışa aktarılmazlar. Aşağıdaki sözdizimi ile tanımlanırlar:

```sh
VAR_NAME=value
```

Eğer bir shell değişkeni, ortam değişkeni yerine önceki "Ortam değişkenleri" kısmında gösterilen benzer bir örnekte kullanılırsa:

```sh
VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

Aşağıdaki çıktıyı alırız:

```console
hello
Deno: undefined
```

Shell değişkenleri, bir değeri yeniden kullanmak istediğimizde faydalıdır, ancak bu değerin herhangi bir oluşturulan işlemlerde kullanılmasını istemeyiz.

### Çıkış durumu değişkeni

Önceki çalıştırılan komutun çıkış kodu `$?` değişkeninde mevcuttur.

```sh
# 10 döndürür
deno eval 'Deno.exit(10)' || echo $?
```

### Boru hatları

Boru hatları, bir komutun çıktılarını başka bir komuta yönlendirmek için bir yol sağlar.

Aşağıdaki komut, stdout çıktısını "Hello" olarak alır ve onu oluşturulan Deno işleminin stdin'ine yönlendirir:

```sh
echo Hello | deno run main.ts
```

stdout ve stderr yönlendirmek için, bunun yerine `|&` kullanın:

```sh
deno eval 'console.log(1); console.error(2);' |& deno run main.ts
```

### Komut ikamesi

`$(command)` sözdizimi, bir komutun çıktısını başka yürütülen komutlarda kullanma yolu sağlar.

Örneğin, en son git revizyonunu almanın çıktısını başka bir komuta sağlamak için şunu yapabilirsiniz:

```sh
deno run main.ts $(git rev-parse HEAD)
```

Bir shell değişkeni kullanarak başka bir örnek:

```sh
REV=$(git rev-parse HEAD) && deno run main.ts $REV && echo $REV
```

### Çıkış kodunu olumsuzlama

Çıkış kodunu olumsuzlamak için, bir komuttan önce bir ünlem işareti ve bir boşluk ekleyin:

```sh
# çıkış kodunu 1'den 0'a değiştir
! deno eval 'Deno.exit(1);'
```

### Yönlendirmeler

Yönlendirmeler stdout ve/veya stderr çıktısını bir dosyaya yönlendirmek için bir yol sağlar.

Örneğin, aşağıdaki komut, `deno run main.ts`'nin _stdout_'unu dosya sisteminde bulunan `file.txt` adlı bir dosyaya yönlendirir:

```sh
deno run main.ts > file.txt
```

Bunun yerine _stderr_'yi yönlendirmek için, `2>` kullanın:

```sh
deno run main.ts 2> file.txt
```

Her ikisini de aynı anda yönlendirmek için, `&>` kullanın:

```sh
deno run main.ts &> file.txt
```

Bir dosyayı üst üste yazmak yerine eklemek için, birden fazla sağ açılı parantez kullanın:

```sh
deno run main.ts >> file.txt
```

Bir komutun stdout, stderr veya her ikisini de bastırmak, `/dev/null`'a yönlendirerek mümkündür. Bu, Windows dahil çok platformlu bir şekilde çalışır.

```sh
# stdout'ı bastır
deno run main.ts > /dev/null
# stderr'yi bastır
deno run main.ts 2> /dev/null
# hem stdout'ı hem de stderr'yi bastır
deno run main.ts &> /dev/null
```

Ya da stdout'u stderr'e ve vice-versa yönlendirmek:

```sh
# stdout'u stderr'e yönlendir
deno run main.ts >&2
# stderr'yi stdout'a yönlendir
deno run main.ts 2>&1
```

Girdi yönlendirmeleri de desteklenir:

```sh
# file.txt'i gzip'in stdin'ine yönlendir
gzip < file.txt
```

Birden fazla yönlendirme yönlendirmesinin şu anda desteklenmediğini unutmayın.

### Çok platformlu shebang

Deno 1.42'den itibaren, `deno task`, `#!/usr/bin/env -S` ile başlayan betikleri tüm platformlarda aynı şekilde çalıştıracaktır.

Örneğin:

```ts title="script.ts"
#!/usr/bin/env -S deno run
console.log("Merhaba!");
```

```json title="deno.json"
{
  "tasks": {
    "hi": "./script.ts"
  }
}
```

Ardından bir Windows makinesinde:

```sh
> pwd
C:\Users\david\dev\my_project
> deno task hi
Merhaba!
```

### Glob genişletmesi

Glob genişletmesi Deno 1.34 ve üzeri sürümlerde desteklenmektedir. Bu, dosyaları eşleştirmek için globların belirtilmesini sağlar.

```console
# mevcut ve alt dizinlerdeki .ts dosyalarını eşleştirin
echo **/*.ts
# mevcut dizindeki .ts dosyalarını eşleştirin
echo *.ts
# "data" ile başlayıp, tek bir rakam içeren ve sonra .csv ile biten dosyaları eşleştirin
echo data[0-9].csv
```

Desteklenen glob karakterleri `*`, `?` ve `[`/`]`.

## Yerleşik komutlar

`deno task`, Windows, Mac ve Linux'da kutudan çıktığı gibi çalışan birkaç yerleşik komut ile birlikte gelir.

- [`cp`](https://man7.org/linux/man-pages/man1/cp.1.html) - Dosyaları kopyalar.
- [`mv`](https://man7.org/linux/man-pages/man1/mv.1.html) - Dosyaları taşır.
- [`rm`](https://man7.org/linux/man-pages/man1/rm.1.html) - Dosyaları veya dizinleri kaldırır.
  - Ör. `rm -rf [DOSYA]...` - Genellikle dosyaları veya dizinleri özyinelemeli olarak silmek için kullanılır.
- [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) - Dizinler oluşturur.
  - Ör. `mkdir -p DİREKTORY...` - Bir dizin ve tüm üst dizinlerini oluşturmak için genellikle kullanılır ve mevcutsa hata vermez.
- [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) - Geçerli/çalışma dizininin adını yazdırır.
- [`sleep`](https://man7.org/linux/man-pages/man1/sleep.1.html) - Belirtilen süre kadar gecikme yapar.
  - Ör. `sleep 1` bir saniye beklemek için, `sleep 0.5` yarım saniye beklemek için veya `sleep 1m` bir dakika beklemek için.
- [`echo`](https://man7.org/linux/man-pages/man1/echo.1.html) - Bir metin satırını görüntüler.
- [`cat`](https://man7.org/linux/man-pages/man1/cat.1.html) - Dosyaları birleştirir ve stdout'da çıktısını verir. Argüman verilmediğinde stdin okur ve çıktı verir.
- [`exit`](https://man7.org/linux/man-pages/man1/exit.1p.html) - Shell'in çıkmasını sağlar.
- [`head`](https://man7.org/linux/man-pages/man1/head.1.html) - Bir dosyanın ilk kısmını çıktı verir.
- [`unset`](https://man7.org/linux/man-pages/man1/unset.1p.html) - Ortam değişkenlerini kaldırır.
- [`xargs`](https://man7.org/linux/man-pages/man1/xargs.1p.html) - stdin'den argümanlar oluşturur ve bir komutu çalıştırır.

Eğer bir komutta yararlı bir bayrak eksik olduğunu düşünüyorsanız veya kutudan çıkmadan desteklenmesi gereken ek komutlar için herhangi bir öneriniz varsa, [bir sorun açın](https://github.com/denoland/deno_task_shell/issues) [deno_task_shell](https://github.com/denoland/deno_task_shell/) reposunda.

Bu komutlardan herhangi birini Mac veya Linux'ta çok platformlu bir şekilde çalıştırmak istemeniz durumunda, bunu `sh` üzerinden çalıştırarak yapabilirsiniz: `sh -c ` (ör. `sh -c cp kaynak hedef`).

## package.json desteği

`deno task`, bir package.json dosyasında `"scripts"` girişlerinden okuma yapmak için geri dönmektedir. Deno'nun herhangi bir npm yaşam döngüsü olayını desteklemediğini veya saygı göstermediğini unutmayın, `preinstall` veya `postinstall` gibi - hangi betik girişlerini çalıştırmak istediğinizi açıkça çalıştırmalısınız (ör.
`deno install --entrypoint main.ts && deno task postinstall`).