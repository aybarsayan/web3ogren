---
description: Bu belge, Yeoman ile kullanıcı etkileşimini açıklamakta ve kullanıcı geri bildirimlerinin nasıl alınacağını, argümanların ve seçeneklerin nasıl kullanılacağını detaylandırmaktadır.
keywords: [Yeoman, kullanıcı etkileşimi, argümanlar, seçenekler, Inquirer.js]
---

# Kullanıcı Eklentileri

Üreticiniz, son kullanıcı ile oldukça fazla etkileşimde bulunacaktır. Varsayılan olarak Yeoman, bir terminalde çalışır, ancak farklı araçların sağlayabileceği **özel kullanıcı arayüzlerini** de destekler. Örneğin, bir Yeoman üreticisinin, bir düzenleyici veya bağımsız bir uygulama gibi grafiksel bir araç içinde çalıştırılmasını engelleyen bir durum yoktur.

:::note
Bu esnekliği sağlamak için Yeoman, bir dizi kullanıcı arayüzü bileşeni soyutlaması sunar. Son kullanıcı ile etkileşimde bulunurken yalnızca bu soyutlamaları kullanmak sizin sorumluluğunuzdur.
:::

Başka yolları kullanmak, üreticinizin farklı Yeoman araçlarında doğru çalışmasını muhtemelen engelleyecektir.

Bir örnek olarak, içerik çıktılamak için asla `console.log()` veya `process.stdout.write()` kullanmamanız önemlidir. Bunları kullanmak, terminal kullanmayan kullanıcıların çıktısını gizler. Bunun yerine, her zaman `this`'in geçerli üretici bağlamının olduğu UI genel `this.log()` yöntemine güvenin.

## Kullanıcı Etkileşimleri

### İstekler

İstekler, bir üreticinin bir kullanıcı ile etkileşimde bulunma biçimidir. İstemci modülü, [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) tarafından sağlanır ve mevcut istemci seçeneklerinin bir listesi için [API'sine](https://github.com/SBoudrias/Inquirer.js) başvurmalısınız.

`prompt` yöntemi asenkron bir yapıdadır ve bir promise döner. Bir sonraki işlemi çalıştırmadan önce tamamlanmasını beklemek için görevden bu promise'yi döndürmeniz gerekecektir. (**asenkron görev hakkında daha fazla bilgi edinin** [/authoring/running-context.html]).

```js
module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Projenizin adı",
        default: this.appname // Varsayılan olarak mevcut klasör adı
      },
      {
        type: "confirm",
        name: "cool",
        message: "Cool özelliğini etkinleştirmek ister misiniz?"
      }
    ]);

    this.log("uygulama adı", answers.name);
    this.log("cool özellik", answers.cool);
  }
};
```

Burada, **kullanıcıdan geri bildirim almak** için `prompting` kuyruk` kullandığımızı belirtmek gerekir.

#### Kullanıcı yanıtlarını sonraki aşamada kullanma

Sonraki aşamada **kullanıcının yanıtlarını** kullanmak oldukça yaygın bir senaryodur, örneğin `writing` kuyruk` içinde. Bunu `this` bağlamına ekleyerek kolayca gerçekleştirebilirsiniz:

```js
module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "cool",
        message: "Cool özelliğini etkinleştirmek ister misiniz?"
      }
    ]);
  }

  writing() {
    this.log("cool özellik", this.answers.cool); // kullanıcı yanıtı `cool` kullanıldı
  }
};
```

#### Kullanıcı tercihlerini hatırlama

Bir kullanıcı, üreticinizi çalıştırdıklarında belirli sorulara her seferinde aynı yanıtı verebilir. Bu sorular için, muhtemelen kullanıcının daha önce verdiği yanıtı hatırlamak ve bu yanıtı yeni varsayılan olarak kullanmak istersiniz.

Yeoman, Inquirer.js API'sini her soru nesnesine `store` özelliği ekleyerek geliştirir. Bu özellik, kullanıcının sağladığı yanıtın gelecekte varsayılan yanıt olarak kullanılmasını sağlar. Bu, aşağıdaki gibi yapılabilir:

```js
this.prompt({
  type: "input",
  name: "username",
  message: "GitHub kullanıcı adınız nedir?",
  store: true
});
```

:::tip
Varsayılan bir değer sağlamak, kullanıcının boş yanıt olarak dönmesini engelleyecektir.
:::

Eğer yalnızca verileri saklamak istiyorsanız ve doğrudan isteme bağlı olmayacaksa, `Yeoman depolama belgelerine` göz atmayı unutmayın.

### Argümanlar

Argümanlar doğrudan komut satırından geçirilir:

```
yo webapp my-project
```

Bu örnekte, `my-project` ilk argüman olacaktır.

Sisteme bir argüman beklediğimizi bildirmek için `this.argument()` yöntemini kullanırız. Bu yöntem, bir `name` (String) ve isteğe bağlı bir seçenekler hash'ini kabul eder.

`name` argümanı, şu şekilde kullanılabilir: `this.options[name]`.

Seçenekler hash'i, birden fazla anahtar-değer çiftini kabul eder:

- `desc` Argümanın açıklaması
- `required` Gerekli olup olmadığına dair Boolean
- `type` String, Number, Array (aynı zamanda ham dize değerini alan ve ayrıştıran özel bir işlev de olabilir)
- `default` Bu argüman için varsayılan değer

Bu yöntem, `constructor` yönteminin içinde çağrılmalıdır. Aksi takdirde, Yeoman, bir kullanıcı üreticinizi `help` seçeneği ile çağırdığında ilgili yardım bilgilerini çıktılayamayacaktır: örneğin, `yo webapp --help`.

İşte bir örnek:

```js
module.exports = class extends Generator {
  // not: argümanlar ve seçenekler constructor'da tanımlanmalıdır.
  constructor(args, opts) {
    super(args, opts);

    // Bu, `appname`'i zorunlu bir argüman yapar.
    this.argument("appname", { type: String, required: true });

    // Daha sonra ona erişebilirsiniz; örneğin:
    this.log(this.options.appname);
  }
};
```

`Array` türünde bir argüman, üreticiye geçen tüm kalan argümanları içerecektir.

### Seçenekler

Seçenekler, argümanlara oldukça benzer, ancak komut satırı _bayrakları_ olarak yazılır.

```
yo webapp --coffee
```

Sisteme bir seçenek beklediğimizi bildirmek için `this.option()` yöntemini kullanırız. Bu yöntem, bir `name` (String) ve isteğe bağlı bir seçenekler hash'ini kabul eder.

`name` değeri, karşılık gelen `this.options[name]` anahtarında seçeneği almak için kullanılacaktır.

Seçenekler hash'i (ikinci argüman) birden fazla anahtar-değer çiftini kabul eder:

- `desc` Seçeneğin açıklaması
- `alias` Seçenek için kısa ad
- `type` Boolean, String veya Number (aynı zamanda ham dize değerini alan ve ayrıştıran özel bir işlev de olabilir)
- `default` Varsayılan değer
- `hide` Yardım sayfasından gizleyip gizlemeyeceğine dair Boolean

İşte bir örnek:

```js
module.exports = class extends Generator {
  // not: argümanlar ve seçenekler constructor'da tanımlanmalıdır.
  constructor(args, opts) {
    super(args, opts);

    // Bu yöntem, `--coffee` bayrağı desteği ekler
    this.option("coffee");

    // Daha sonra ona erişebilirsiniz; örneğin:
    this.scriptSuffix = this.options.coffee ? ".coffee" : ".js";
  }
};
```

## Bilgi Çıktısı

Bilgi çıkışı, `this.log` modülü tarafından işlenir.

Kullanacağınız ana yöntem yalnızca `this.log` (örneğin, `this.log('Hey! Harika üreticime hoş geldiniz')`) olacaktır. Bir dize alır ve kullanıcıya çıktılar; temel olarak, bir terminal oturumunda kullanıldığında `console.log()` benzeri davranır. Bunu şu şekilde kullanabilirsiniz:

```js
module.exports = class extends Generator {
  myAction() {
    this.log("Bir şeyler yanlış gitti!");
  }
};
```

:::info
[API belgelerinde](https://yeoman.github.io/environment/TerminalAdapter.html) bulabileceğiniz başka yardımcı yöntemler de vardır.
:::