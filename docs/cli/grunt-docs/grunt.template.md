---
description: Bu belge, Grunt şablon işlevlerini ve kullanım örneklerini içermektedir. Kullanıcılar, şablonları nasıl işlemeleri gerektiği konusunda bilgi edinecek ve örnekler ile uygulamaları anlayacaklardır.
keywords: [Grunt, template, Lo-Dash, şablon işleme, dateformat]
---



# Grunt Şablonları

Template dizelerini, sağlanan şablon işlevlerini kullanarak manuel olarak işleyebilirsiniz. Ayrıca, `config.get` yöntemi (birçok görev tarafından kullanılan) otomatik olarak `Gruntfile` içindeki yapılandırma verileri olarak belirtilen `` stilindeki şablon dizelerini genişletir.

### grunt.template.process
Bir [Lo-Dash şablon](http://lodash.com/docs/#template) dizisini işleyin. `template` argümanı, daha fazla işlenecek şablon kalmayana kadar özyinelemeli olarak işlenir.

Varsayılan veri nesnesi tüm yapılandırma nesnesidir, ancak `options.data` ayarlandığında, o nesne kullanılacaktır. Varsayılan şablon ayırıcıları `` şeklindedir, ancak `options.delimiters` özel bir ayırıcı adını ayarlamak için kullanıldığında (`grunt.template.addDelimiters` ile ayarlanmalıdır), bu şablon ayırıcıları kullanılacaktır.

```js
grunt.template.process(template [, options])
```

:::tip
Şablonlar içinde, `grunt` nesnesi açığa çıkar, böylece `` gibi şeyler yapabilirsiniz.
:::

_Veri nesnesi `grunt` özelliğine sahipse, şablonlarda `grunt` API'sine erişilemeyeceğini unutmayın._

Bu örnekte, `baz` özelliği, daha fazla `` şablonu işlenene kadar özyinelemeli olarak işlenir.

```js
var obj = {
  foo: 'c',
  bar: 'b<%= foo %>d',
  baz: 'a<%= bar %>e'
};
grunt.template.process('<%= baz %>', {data: obj}) // 'abcde'
```

### grunt.template.setDelimiters
`grunt.util._.template`'in manuel olarak çağrılması gerektiğinde, [Lo-Dash şablon](http://lodash.com/docs/#template) ayırıcılarını önceden tanımlanmış bir diziye ayarlayın. Varsayılan olarak `` yapılandırma ayırıcıları dahildir.

:::info
Bu yöntemi kullanmanıza gerek kalmayacak çünkü bu yöntemi dahili olarak kullanan `grunt.template.process` kullanacaksınız.
:::

```js
grunt.template.setDelimiters(name)
```

### grunt.template.addDelimiters
Adlandırılmış bir [Lo-Dash şablon](http://lodash.com/docs/#template) ayırıcı seti ekleyin. Bu yöntemi kullanmanıza gerek kalmayacak çünkü yerleşik ayırıcılar yeterli olmalıdır, ancak her zaman `{% %}` veya `[% %]` tarzı ayırıcılar ekleyebilirsiniz.

`name` argümanı benzersiz olmalıdır, çünkü bu, `grunt.template.setDelimiters` ile ayırıcılara erişim sağladığımız isimdir ve `grunt.template.process` için bir seçenek olarak kullanılır.

```js
grunt.template.addDelimiters(name, opener, closer)
```

Bu örnekte, yukarıda bahsedilen `{% %}` stilini kullanmamız durumunda şu şekilde kullanırız:

```js
grunt.template.addDelimiters('myDelimiters', '{%', '%}')
```

## Yardımcılar

### grunt.template.date
[dateformat kütüphanesini](https://github.com/felixge/node-dateformat) kullanarak bir tarihi biçimlendirin.

```js
grunt.template.date(date, format)
```

Bu örnekte, belirli bir tarih ay/gün/yıl şeklinde biçimlendirilmiştir.

```js
grunt.template.date(847602000000, 'yyyy-mm-dd') // '1996-11-10'
```

### grunt.template.today
[dateformat kütüphanesini](https://github.com/felixge/node-dateformat) kullanarak bugünün tarihini biçimlendirin.

```js
grunt.template.today(format)
```

Bu örnekte, bugünün tarihi 4 haneli bir yıl olarak biçimlendirilmiştir.

```js
grunt.template.today('yyyy') // '2020' gibi bir yıl döner
```