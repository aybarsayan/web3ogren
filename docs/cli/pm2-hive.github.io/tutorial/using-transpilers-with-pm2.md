---
description: PM2 kullanarak Babel, CoffeeScript, TypeScript gibi transpilatörlerin nasıl kullanılacağını açıklamaktadır. Bu kılavuz, geliştirme ve üretim ortamlarında etkili bir şekilde nasıl çalıştırılacağını detaylandırır.
keywords: [PM2, transpilers, Babel, CoffeeScript, TypeScript]
---
# PM2 ile transpilatörlerin kullanımı

## Üretim Yolu

Kod tabanınızı paylaşmak, paketlemek veya dağıtmak istiyorsanız, genellikle saf eski Javascript (VanillaJS) kullanmak daha iyidir. Bu, kodunuzun ön işleme sürümüne sahip olacağınız ve ardından bir Javascript giriş noktasını çalıştıracağınız anlamına gelir.

Örneğin, olağan bir dizin yapısı şu şekilde görünecek:

```
├── src
├── dist
└── package.json
```

Burada `src` es6, CoffeeScript veya herhangi bir şey içerirken `dist` transpilasyon yapılmış Javascript'tir. Bu, PM2 ile kolayca ayarlanabilir çünkü yapılandırma olmadan Javascript'i başlatacaktır.

:::tip
**İpucu:** Geliştirme sırasında, kaynak kodunuzu `dist` dizininde transpilasyon yapmak için bir yapı sistemi kullanmak, dağıtım aşamasında işlerinizi kolaylaştıracaktır.
:::

Ancak, kod yazarken, bu ayarlamayı daha zor hale getirebilir. İzlemek ve yeniden başlatmak istediğinizi varsayalım. İzlemek, transpilasyon yapmak ve yeniden başlatmak zorunda kalacaksınız. PM2 bir yapım sistemi ya da görev çalıştırıcısı değildir, bu nedenle ikinci yolu tercih etmenizi öneririz.

---

## Geliştirme Yolu

Bu, bir üretim iş akışında iyi çalışabilir, ancak bunu önermeyiz. Kodu paketlemek daha güvenlidir, bu işlem script başlatma sürecini yavaşlatır ve küme modu mevcut olmayabilir.

### Çalıştırma Yorumlayıcısı

PM2 ile transpilatörleri kullanmanın en kolay yolu çalıştırma yorumlayıcısını (`exec_interpreter`) geçersiz kılmaktır. Eğer bu değiştirilirse, kodunuz **sadece** `fork_mode`’da çalışacaktır ([fork modları arasındaki farklar için burayı kontrol edin](http://stackoverflow.com/a/36177256/1145578)).

Bunu yapmak için, CLI üzerinden `--interpreter` seçeneğini veya json yapılandırması üzerinden `exec_interpreter` seçeneğini belirtin.

#### Coffee-script

```
#- npm install -g coffee-script
#- pm2 start --interpreter coffee index.coffee
```

Dosya değişikliklerinde yeniden başlatan bir daemonize edilmiş CoffeeScript için sadece `--watch` ekleyin.

#### Babel

```
#- npm install -g babel-cli
#- pm2 start --interpreter babel-node index.es6
```

:::warning
Unutmayın, bu komutların yalnızca `fork_mode`’da çalışacağını. PM2 kümesi çalıştırmak istiyorsanız, aşağıdaki alternatife bakın.
:::

### Require Kancası

Bu benim en sevdiğim seçenek. Transpilatörü kod içinde kaydederek standart Javascript olarak çalışacaktır. Bunun çoğu, aslında, node içlerinde `require`'ı değiştirir veya `module`'ü ayarlayarak gerekli script'in yorumlanmadan önce transpilasyonu yapılır (örnek [babel](https://github.com/babel/babel/blob/93e5c0e64b1a14f3b138a01c55082225084f47b4/packages/babel-register/src/node.js#L104) veya [coffee](https://github.com/jashkenas/coffeescript/blob/master/lib/coffee-script/register.js#L16)).

*Bu çözüme daha çok bir hack olarak düşünülebilir. Script başlangıcını yavaşlatacağını aklınızda bulundurun.*

> **Not:** Bunu çalışır hale getirmek için, transpilasyon yapılmamış kaynağı dahil etmeden önce require kancasını çağıracak basit bir Javascript giriş noktası hazırlayın.

#### Coffee-script

```
# server.js
require('coffee/register');
require('./server.coffee');
```

#### Babel

```
require('babel-register');
require('./server.es6');
```

Daha fazla seçenek için [babeljs belgesine](https://babeljs.io/docs/usage/require/) göz atın.

Sonra, tek yapmanız gereken script'i `pm2 start server.js` ile başlatmaktır. Bu, `node` yorumlayıcısını kullanacağı için küme modu beklendiği gibi çalışacaktır.