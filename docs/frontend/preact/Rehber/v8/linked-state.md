---
description: Bu belge, Preact'te bağlantılı durumların nasıl kullanılacağını ve optimize edileceğini açıklamaktadır. Kod örnekleri ve açıklamalar ile birlikte, olayları yönetmek için en iyi uygulamaları içermektedir.
keywords: [Preact, linkState, durum yönetimi, React, optimizasyon, bileşenler, etkinlikler]
---

# Bağlantılı Durum

Preact'in React'ten biraz daha ileri gittiği bir alan, durum değişikliklerini optimize etmektir. ES2015 React kodunda yaygın bir desen, olaylara yanıt olarak durumu güncellemek için `render()` metodunda ok (Arrow) fonksiyonları kullanmaktır. Her render işleminde bir kapsama alanında fonksiyonlar oluşturmak verimsizdir ve çöp toplayıcısını gerekli olandan daha fazla iş yapmaya zorlar.

---



---

## Daha Güzel Manuel Yol

Bir çözüm, ES7 sınıf özelliklerini kullanarak bağlı bileşen yöntemlerini tanımlamaktır ([sınıf örnek alanları](https://github.com/jeffmo/es-class-fields-and-static-properties)):

```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```

Bu, çok daha iyi çalışma süresi performansı sağlar, ancak durumu UI'ya bağlamak için hala gereksiz bir sürü kod vardır.

> Başka bir çözüm, ES7 dekoratörlerini kullanarak bileşen yöntemlerini _belirleyici bir şekilde_ bağlamaktır; örneğin, [decko'nun](https://github.com/developit/decko) `@bind`:

## Bağlantılı Durum Kurtarıcı

Neyse ki, preact'in [`linkState`](https://github.com/developit/linkstate) modülü şeklinde bir çözüm vardır.

> Preact'in önceki sürümlerinde `linkState()` fonksiyonu yerleşik olarak bulunuyordu; ancak bu, ayrı bir modüle taşındı. Eski davranışı geri yüklemek istiyorsanız, [bu sayfaya](https://github.com/developit/linkstate#usage) bakın.

`linkState(this, 'text')` çağrısı, bir Etkinlik ile geçirildiğinde, bileşeninizin durumundaki adlandırılmış özelliği güncellemek için ilişkili değeri kullanan bir işlemci fonksiyonu döndürür. Aynı `component` ve `name` ile birden fazla `linkState(component, name)` çağrısı önbelleğe alınır, bu nedenle temelde hiçbir performans cezası yoktur.

---

İşte **Bağlantılı Durum** kullanılarak yeniden yazılmış bir önceki örnek:

```js
import linkState from 'linkstate';

class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={linkState(this, 'text')} />;
	}
}
```

Bu kısadır, anlaşılması kolaydır ve etkilidir. Herhangi bir giriş türünden durumu bağlamayı yönetir. Daha özel bağlamalar için yeni durum değerine nokta ile belirtilmiş bir anahtar yolu açıkça sağlamak üzere isteğe bağlı bir üçüncü argüman `'path'` kullanılabilir (örneğin, bir üçüncü taraf bileşenin değerine bağlama).

## Özel Olay Yolları

Varsayılan olarak, `linkState()` bir etkinlikten uygun değeri otomatik olarak çıkarmaya çalışır. Örneğin, bir `` öğesi, giriş türüne bağlı olarak verilen durumu `event.target.value` veya `event.target.checked` olarak ayarlayacaktır. Özel olay işleyicileri için, `linkState()` tarafından üretilen işleyiciye skaler değerler geçirildiğinde, skalar değer doğrudan kullanılacaktır. Çoğu zaman, bu davranış istenebilir.

:::note
Ancak, istenmeyen durumlar da olabilir - özel olaylar ve gruplandırılmış radyo düğmeleri bunlara iki örnek. Bu durumlarda, `linkState()`'e bir üçüncü argüman geçirerek bir değer bulmak için olay içindeki nokta ile belirtilmiş anahtar yolunu belirtebilirsiniz.
:::

Bu özelliği anlamak için, `linkState()`'in arka planda nasıl çalıştığını incelemek faydalı olabilir. Aşağıda, bir Olay nesnesinden bir değeri duruma sürdüren elle oluşturulmuş bir olay işleyicisi gösterilmektedir. Bu, `linkState()` versiyonu ile işlevsel olarak eşdeğer olup, `linkState()`'in değerli kılan önbellekleme optimizasyonunu içermez.

```js
// bu işleyici linkState'den döndü:
handler = linkState(this, 'thing', 'foo.bar');

// ...işlevsel olarak eşdeğerdir:
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```

### İllüstrasyon: Gruplandırılmış Radyo Düğmeleri

Aşağıdaki kod beklenildiği gibi çalışmaz. Kullanıcı "hayır"ı tıkladığında, `noChecked` `true` olur ancak `yesChecked` `true` kalır, çünkü diğer radyo düğmesinde `onChange` tetiklenmez:

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={linkState(this, 'yes')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={linkState(this, 'no')}
        />
      </div>
    );
  }
}
```

`linkState`'in üçüncü argümanı burada yardımcı olur. Size bağlı değeri kullanmak için olay nesnesi üzerinde bir yol sağlamanıza olanak tanır. Önceki örneği yeniden değerlendirerek, `linkState`'e yeni durum değerini `event.target` üzerindeki `value` özelliğinden almasını açıkça söyleyelim:

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'yes'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'no'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
      </div>
    );
  }
}
```

Artık örnek istenildiği gibi çalışıyor!