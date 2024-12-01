---
description: Destek sayfası, Yeoman kullanarak sorunlarınıza çözüm bulmanıza yönelik rehberlik sunar. İlk adım olarak gerekli komutları ve belgeleri içerir.
keywords: [Yeoman, destek, sorun giderme, şablonlar, paket yönetimi]
title: Destek
---

## İlk adım

İlk adım her zaman `yo doctor` komutunu çalıştırmak olmalıdır. Bu komut, ortamınızı kontrol edecek ve çoğu kurulum/konfigürasyon hatasını bulacaktır.

---

## Destek Alma

Yeoman, etkileyici web uygulamaları oluşturmak için optimize edilmiş **şablonlama** ve iş akışı deneyimi sağlar. Geliştiriciler, projelerini **inşa etmek** için Yeoman'ı derleme araçlarıyla ve paket yönetimi için Bower'ı birlikte kullanırlar. 

:::tip
Tip: Aşağıdaki komutlar, Yeoman ile bir proje oluşturmanın temel adımlarını göstermektedir.
:::

Aşağıdaki üçlünün arasında tipik bir iş akışı aşağıdaki gibi görünebilir:

```sh
yo webapp
$ yo angular
$ bower install angular-directives
$ grunt
```

---

### İkili sorunlar

Yeoman ikilisinde sorunlar yaşıyorsanız, örneğin Yeoman'ı hiç çalıştıramıyorsanız, daha fazla yardım almak için [Yeoman hata izleyicisine](https://github.com/yeoman/yeoman/issues) bir hata bildirimi göndermelisiniz.

### Şablon sorunları

Bizim şablonlarımız (yukarıdaki angular gibi) topluluk destekli olup, varsayılan bazıları GitHub'da [Yeoman organizasyonunda](https://github.com/yeoman) bulunmaktadır. 

:::info
Bilgi: Bu şablonlar, belirli bir çerçevede topluluk tarafından geliştiriciler tarafından korunmaktadır. Popüler bazı oluşturucularımız için hata izleyicileri aşağıda bulunabilir:
:::

* [WebApp](https://github.com/yeoman/generator-webapp)
* [Gulp WebApp](https://github.com/yeoman/generator-gulp-webapp)
* [AngularJS](https://github.com/yeoman/generator-angular)
* [Backbone](https://github.com/yeoman/generator-backbone)
* [Chrome App](https://github.com/yeoman/generator-chromeapp)
* [Polymer](https://github.com/yeoman/generator-polymer)

### Derleme sorunları

Eğer derleme araçlarınızda sorunlar yaşıyorsanız, derleme aracınızın hata izleyicisinden bir sorun açmanız gerekecektir. Ancak dikkate almanız gereken bir nokta var;

> "Eğer belirli bir görev (örneğin CoffeeScript derlemesi) ile bir sorununuz varsa, bunun için resmi Grunt izleyicisi kullanılmamalıdır; bunun yerine [grunt-contrib](https://github.com/gruntjs/grunt-contrib) ile bir hata raporu göndermek daha mantıklı olacaktır." — Yeoman Destek

Yeoman iş akışında kullanılan bazı yaygın görevler için hata izleyicileri aşağıda bulunabilir:

* [coffee](https://github.com/gruntjs/grunt-contrib-coffee/)
* [compress](https://github.com/gruntjs/grunt-contrib-compress/)
* [handlebars](https://github.com/gruntjs/grunt-contrib-handlebars/)
* [requirejs](https://github.com/gruntjs/grunt-contrib-requirejs/)

---

### Paket yönetimi sorunları

Bower kullanarak bir paket yüklediyseniz, bir paketi güncellediyseniz veya paketleri yönetirken sorunlar yaşıyorsanız, [Bower hata izleyicisi](https://github.com/bower/bower) üzerinden hata raporu göndermelisiniz. 

:::warning
Dikkat: Yeoman iş akışı genellikle bağımlılıkların minifikasyonu/concat'ı için Grunt veya Gulp üzerinde güvenir, ancak göndereceğiniz bir sorunun Bower sorunu mu yoksa Yeoman sorunu mu olduğunu size bildireceğiz.
:::