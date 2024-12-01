---
title: Grunt'ı nasıl kurabilirim?
description: Bu belge, Grunt'ın kurulumu ile ilgili temel ve gelişmiş bilgileri içermektedir. Geliştirme fazındaki özelliklerin kullanımı, Windows uyumluluğu ve asenkron görevler gibi konuları ele alır.
keywords: [Grunt, kurulum, Windows, asenkron, görev paylaşımı]
---

## Grunt'ı nasıl kurabilirim?
Genel kurulum talimatları için lütfen [[Başlarken]] kılavuzuna bakın. Eğer bunu okuduktan sonra daha spesifik bilgilere ihtiyacınız olursa, kapsamlı [[Grunt'ı Kurma]] kılavuzuna göz atın.

## Geliştirme aşamasındaki 'X' özelliğini ne zaman kullanabilirim?
Yayınlanmış ve yayına girmemiş geliştirme sürümlerinin her ikisinin de kurulumu [[Grunt'ı Kurma]] kılavuzunda ele alınmıştır.

## Grunt Windows'ta çalışıyor mu?
Grunt, Windows'ta gayet iyi çalışır; çünkü [Node.js](https://nodejs.org/) ve [npm](https://www.npmjs.com/) Windows'ta da sorunsuz çalışmaktadır. Genellikle problemli kısım [Cygwin](http://www.cygwin.com/)'dir, çünkü eski bir Node.js sürümünü paketler.

:::info
Bu sorunu önlemenin en iyi yolu, `git` ikili dosyasını kurmak için [msysGit yükleyicisini](http://msysgit.github.com/) ve `node` ile `npm` ikili dosyalarını kurmak için [Node.js yükleyicisini](https://nodejs.org/#download) kullanmaktır. Cygwin yerine yerleşik [Windows komut istemcisini](http://www.cs.princeton.edu/courses/archive/spr05/cos126/cmd-prompt.html) veya [PowerShell](http://support.microsoft.com/kb/968929)'ı kullanmanız önerilir.
:::

## Neden asenkron görevim tamamlanmıyor?
Bu muhtemelen `this.async` yöntemini çağırmayı unuttuğunuzdan kaynaklanıyor. Grunt, asenkron görev olduğunuzu belirtmek için bu yöntemi çağırdığınızda, asenkron bir kodlama tarzını kullanır. Grunt, senkron bir kodlama tarzı kullanır ve görev gövdesinde `this.async()` çağrılmasıyla asenkron hale getirilebilir.

> `done()` fonksiyonuna `false` geçirmenin, görevin başarısız olduğunu Grunt'a bildirdiğini unutmayın.  
> — Grunt Belgeleri

Örneğin:

```js
grunt.registerTask('asyncme', 'Asenkron görevim.', function() {
  var done = this.async();
  doSomethingAsync(done);
});
```

## Shell sekme otomatik tamamlamasını nasıl etkinleştirebilirim?
Grunt için bash sekme otomatik tamamlamasını etkinleştirmek için `~/.bashrc` dosyanıza aşağıdaki satırı ekleyin:

```shell
eval "$(grunt --completion=bash)"
```

:::tip
Bu, Grunt'ın `npm install -g grunt` komutuyla küresel olarak kurulduğunu varsayar. Şu anda desteklenen tek shell bash’tır.
:::

## Birden fazla görev arasında parametreleri nasıl paylaşabilirim?
Her bir görev kendi parametrelerini kabul edebilse de, birden fazla görev arasında parametreleri paylaşmanın birkaç yolu vardır.

### "Dinamik" takma ad görevleri
**Bu, birden fazla görev arasında parametre paylaşmanın tercih edilen yöntemidir.**

`Alias görevler` basit olmak zorundadır, ancak bir normal görev `grunt.task.run` kullanarak, aslında "dinamik" bir takma ad gibi işlev görmesini sağlar. Bu örnekte, komut satırında `grunt build:001` komutu çalıştırıldığında, `foo:001`, `bar:001` ve `baz:001` görevlerinin çalıştırılması sağlanır.

```js
grunt.registerTask('build', 'Tüm inşa görevlerimi çalıştır.', function(n) {
  if (n == null) {
    grunt.warn('İnşa numarası belirtilmelidir, örneğin build:001.');
  }
  grunt.task.run('foo:' + n, 'bar:' + n, 'baz:' + n);
});
```

### -- seçenekler

Bir parametreyi birden fazla görev arasında paylaşmanın başka bir yolu `grunt.option` kullanmaktır. Bu örnekte, komut satırında `grunt deploy --target=staging` çalıştırıldığında, `grunt.option('target')` `"staging"` döndürür.

```js
grunt.registerTask('upload', 'Belirtilen hedefe kod yükle.', function() {
  var target = grunt.option('target');
  // burada hedef ile faydalı bir şey yap
});
grunt.registerTask('deploy', ['validate', 'upload']);
```

> _Boolean seçenekler yalnızca bir anahtar kullanılarak değer olmadan belirtilebilir. Örneğin, komut satırında `grunt deploy --staging` çalıştırıldığında, `grunt.option('staging')` `true` döndürür._
> — Grunt Belgeleri

### Global ve yapılandırmalar

Diğer durumlarda, yapılandırma veya global değerleri ayarlamanın bir yolunu göz önünde bulundurmak isteyebilirsiniz. Bu durumlarda, argümanlarını bir global veya yapılandırma değeri olarak ayarlayan bir görev kaydedin.

Bu örnekte, komut satırında `grunt set_global:name:peter set_config:target:staging deploy` çalıştırıldığında, `global.name` `"peter"` ve `grunt.config('target')` `"staging"` döndürür. Muhtemelen, `deploy` görevi bu değerleri kullanacaktır.

```js
grunt.registerTask('set_global', 'Global bir değişken ayarla.', function(name, val) {
  global[name] = val;
});

grunt.registerTask('set_config', 'Bir yapılandırma özelliğini ayarla.', function(name, val) {
  grunt.config.set(name, val);
});
```

## Hata oluştuğunda bir yığın izini nasıl alabilirim?

Yığın izlerini görmek için `--stack` seçeneğini kullanın. Örneğin `grunt task --stack`

## "Maksimum çağrı yığını boyutu aşıldı" hatasını neden alıyorum?

Muhtemelen, normal görevlerinizden birinin adıyla aynı adda bir takma ad görevi oluşturmuşsunuzdur. Örneğin: `grunt.registerTask('uglify', ['uglify:my_target']);` yerine `grunt.registerTask('myUglify', ['uglify:my_target']);` olmalıdır.

## İstenmeyen eklentileri nasıl kaldırabilir veya kaldırabilirim?

En az iki yol vardır. Bir yol, `npm uninstall [GRUNT_PLUGIN] --save-dev` komutunu kullanmaktır. Bu, eklentiyi `package.json` dosyanızdan ve `node_modules` içinden kaldırır. Ayrıca, istemediğiniz bağımlılıkları `package.json` dosyanızdan manuel olarak kaldırabilir ve ardından `npm prune` komutunu çalıştırabilirsiniz.

## Hata "npm hatasıyla kurulum başarısız: Uyumluluk sürümü bulunamadı"

En son kararlı [NPM ve Node.JS](https://nodejs.org/) sürümüne sahip olduğunuzu kontrol edin.

---

## grunt 0.3 Soruları

## Windows'ta Grunt 0.3 ile çalıştırmaya çalıştığımda neden JS editörüm açılıyor?
Eğer `Gruntfile` ile aynı dizindeyseniz, Windows, grunt yazdığınızda _o dosyayı_ çalıştırmaya çalışır. Bu yüzden `grunt.cmd` yazmanız gerekir.

Alternatif olarak, Grunt makrosu oluşturmak için `DOSKEY` komutunu kullanmayı deneyebilirsiniz; [bu talimatları](https://gist.github.com/vladikoff/38307908088d58af206b) takip edebilirsiniz. Bu, `grunt` yerine `grunt.cmd` kullanmanıza olanak tanır.

Kullanacağınız `DOSKEY` komutu şu olacaktır:

```
DOSKEY grunt=grunt.cmd $*
```