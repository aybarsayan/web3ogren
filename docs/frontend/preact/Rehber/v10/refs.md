---
description: 'Referanslar, Preact tarafından işlenen ham DOM düğimlerine erişmek için kullanılabilir. Bu makalede, Preactte nasıl referans alabileceğinizi ve bunların kullanım senaryolarını keşfedeceksiniz.'
keywords: [Preact, refs, DOM, createRef, callback refs, component, measurement]
---

# Referanslar

Her zaman Preact tarafından render edilen DOM-Elementine veya bileşenine doğrudan bir referansa ihtiyacınız olan senaryolar olacaktır. Refs, bunu gerçekleştirmenizi sağlar.

:::tip
Tipik bir kullanım durumu, bir DOM düğümünün gerçek boyutunu ölçmektir. 
:::

`ref` aracılığıyla bileşen örneğine referansı almak mümkün olsa da, bunu genellikle tavsiye etmiyoruz. Bu, bir ebeveyn ile bir çocuk arasında sıkı bir bağlılık yaratır ve bileşen modelinin bileşen doğasını bozar. Çoğu durumda, bir sınıf bileşeninin yöntemini doğrudan çağırmaya çalışmak yerine, geri çağrıyı bir prop olarak geçmek daha doğaldır.

---



---

## createRef

`createRef` fonksiyonu, yalnızca bir özelliğe sahip düz bir nesne döndürecektir: `current`. `render` metodu çağrıldıkça, Preact DOM düğümünü veya bileşeni `current`'e atayacaktır.

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class Foo extends Component {
  ref = createRef();

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLDivElement]
  }
  
  render() {
    return <div ref={this.ref}>foo</div>
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

## Callback Refs

Bir öğeye referansı almanın diğer bir yolu, bir fonksiyon geri çağrısı geçmektir. Yazması biraz daha fazla zaman alır, ancak `createRef` ile benzer bir şekilde çalışır.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Foo extends Component {
  ref = null;
  setRef = (dom) => this.ref = dom;

  componentDidMount() {
    console.log(this.ref);
    // Logs: [HTMLDivElement]
  }
  
  render() {
    return <div ref={this.setRef}>foo</div>
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

> Eğer ref geri çağrısı iç içe bir fonksiyon olarak tanımlanmışsa, iki kez çağrılacaktır. İlk olarak `null` ile ve ardından gerçek referans ile. Bu yaygın bir hatadır ve `createRef` API'si, kullanıcının `ref.current`'in tanımlı olup olmadığını kontrol etmesini zorunlu kılarak bu durumu biraz daha kolay hale getirir.

## Hepsini Bir Araya Getirmek

Diyelim ki bir DOM düğümüne referans almak ve genişliğini ve yüksekliğini ölçmek için bir senaryoya ihtiyacımız var. Yer tutucu değerleri gerçek ölçülenlerle değiştirmemiz gereken basit bir bileşenimiz var.

```jsx
class Foo extends Component {
  // Burada DOM düğümünden gerçek genişliği kullanmak istiyoruz
  state = {
    width: 0,
    height: 0,
  };

  render(_, { width, height }) {
    return <div>Width: {width}, Height: {height}</div>;
  }
}
```

:::info
Ölçüm, `render` metodu çağrıldıktan ve bileşen DOM'a yerleştirildikten sonra anlam kazanır. Öncesinde DOM düğümü mevcut olmayacak ve onun ölçümünü almaya çalışmanın çok fazla anlamı olmayacaktır.
:::

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Foo extends Component {
  state = {
    width: 0,
    height: 0,
  };

  ref = createRef();

  componentDidMount() {
    // Güvenlik için: Bir ref sağlandığını kontrol edin
    if (this.ref.current) {
      const dimensions = this.ref.current.getBoundingClientRect();
      this.setState({
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  render(_, { width, height }) {
    return (
      <div ref={this.ref}>
        Width: {width}, Height: {height}
      </div>
    );
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

Hepsi bu kadar! Artık bileşen her zaman yerleştirildiğinde genişlik ve yüksekliği gösterecektir.