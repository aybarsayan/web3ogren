---
title: Durum
description: Bu belge, Preact kullanarak sınıf ve işlev bileşenlerinde durum yönetimini anlatmaktadır. Durum güncellemeleri ve bileşen yeniden render işlemleri hakkında bilgi verir.
keywords: [Preact, durum, state, bileşen, hooklar, işlev bileşenleri, sınıf bileşenleri]
---

# Durum

HTML öğeleri ve bileşenleri nasıl oluşturacağımızı ve her ikisine de JSX kullanarak nasıl props ve olay işleyicileri geçireceğimizi öğrendiğimize göre, Sanal DOM ağacını güncellemeyi öğrenmenin zamanı geldi.

Önceki bölümde belirttiğimiz gibi, hem işlevsel hem de sınıf bileşenleri **durum** (state) alabilir - bileşen tarafından saklanan veriler, Sanal DOM ağacını değiştirmek için kullanılır. Bir bileşen durumu güncellediğinde, Preact bu bileşeni güncellenmiş durum değerini kullanarak tekrar render eder. İşlevsel bileşenler için, bu Preact'ın işlevi yeniden çağırması anlamına gelirken, sınıf bileşenleri için yalnızca sınıfın `render()` yöntemini tekrar çağırır. Her birinin örneğine bakalım.

### Sınıf bileşenlerinde durum

Sınıf bileşenleri, bileşenin `render()` yöntemi çağrıldığında kullanabileceği verileri tutan bir nesne olan `state` özelliğine sahiptir. Bir bileşen, `this.setState()` çağrısını yaparak `state` özelliğini güncelleyebilir ve Preact'ten yeniden render edilmesini talep edebilir.

```jsx
class MyButton extends Component {
  state = { clicked: false }

  handleClick = () => {
    this.setState({ clicked: true })
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.clicked ? 'Tıklandı' : 'Henüz tıklanmadı'}
      </button>
    )
  }
}
```

> ℹ️ **Dikkat edilmesi gereken bir nokta**: Düğmeye tıkladığınızda `this.setState()` çağrılır, bu da Preact'ın sınıfın `render()` yöntemini tekrar çağırmasına neden olur. Artık `this.state.clicked` değeri `true` olduğu için, `render()` yöntemi "Tıklandı" metnini içeren bir Sanal DOM ağacı döndürür; bu da Preact'ın DOM'daki düğmenin metnini güncellemesine neden olur.

### Hook'lar kullanarak işlev bileşenlerinde durum

İşlev bileşenleri de duruma sahip olabilir! Sınıf bileşenlerinde olduğu gibi `this.state` özelliğine sahip olmasalar da, işlev bileşenleri içinde durumu saklayıp işlemeye yarayan, Preact ile birlikte gelen küçük bir ek modül vardır; buna "hook" denir.

Hook'lar, bir işlev bileşeninin içinden çağrılabilen özel fonksiyonlardır. Özel olmalarının nedeni, **render'lar arasında bilgileri hatırlamalarıdır**, biraz sınıflardaki özellikler ve yöntemler gibi. Örneğin, `useState` hook'u bir değeri ve o değeri güncellemek için çağrılabilecek bir "setter" fonksiyonu içeren bir dizi döndürür. Bir bileşen birden fazla kez çağrıldığında (yeniden render edildiğinde), yapılan her `useState()` çağrısı her seferinde tam olarak aynı diziyi döndürecektir.

> ℹ️ **_Hook'lar aslında nasıl çalışır?_**
>
> Arka planda, `setState` gibi hook fonksiyonları, Sanal DOM ağacındaki her bileşenle ilişkili bir dizi "slot"ta veri saklayarak çalışır. Bir hook fonksiyonu çağırmak bir slot kullanır ve bir iç "slot numarası" sayacını artırır, böylece bir sonraki çağrı bir sonraki slotu kullanır. Preact, her bileşeni çağırmadan önce bu sayacı sıfırlar, böylece bir bileşen birden fazla kez render edildiğinde her hook çağrısı aynı slotla ilişkilendirilir.
>
> ```js
> function User() {
>   const [name, setName] = useState("Bob")    // slot 0
>   const [age, setAge] = useState(42)         // slot 1
>   const [online, setOnline] = useState(true) // slot 2
> }
> ```
>
> Bu, çağrı yeri sıralaması olarak adlandırılır ve hook'ların her zaman bileşen içinde aynı sırayla çağrılması gerektiğinin ve koşullu veya döngüler içinde çağrılamayacağının nedenidir.

`useState` hook'unu kullanarak bir örneğe bakalım:

```jsx
import { useState } from 'preact/hooks'

const MyButton = () => {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
  }

  return (
    <button onClick={handleClick}>
      {clicked ? 'Tıklandı' : 'Henüz tıklanmadı'}
    </button>
  )
}
```

Düğmeye tıklamak, `setClicked(true)` çağrısını tetikler; bu, `useState()` çağrımız tarafından oluşturulan durum alanını günceller ve bu da Preact'ın bu bileşeni yeniden render etmesine neden olur. Bileşen ikinci kez render edildiğinde (çağrıldığında), `clicked` durum alanının değeri `true` olacak ve döndürülen Sanal DOM, "Tıklandı" metnini içerecek, böylece Preact'ın DOM'daki düğmenin metnini güncellemesine neden olacaktır.

---

## Deneyelim!

Önceki bölümde yazdığımız koddan başlayarak bir sayaç oluşturalım. Durumda bir `count` sayısını saklamamız ve bir düğmeye tıklandığında değerini `1` artırmamız gerekecek.

Önceki bölümde bir işlev bileşeni kullandığımız için hook'ları kullanmak en kolay yol olabilir, ancak dilediğiniz durum saklama yöntemini seçebilirsiniz.


  Çözüm
  
  🎉 Tebrikler!
  Durumu nasıl kullanacağınızı öğrendiniz!


```js:setup
useResult(function () {
  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (oe) oe.apply(this, arguments);

    if (e.currentTarget.localName !== 'button') return;
    var root = e.currentTarget.parentNode.parentNode;
    var text = root.innerText.match(/Count:\s*([\w.-]*)/i);
    if (!text) return;
    if (!text[1].match(/^-?\d+$/)) {
      return console.warn('İpucu: {count} değerini herhangi bir yerde render etmeyi unuttunuz gibi görünüyor.');
    }
    setTimeout(function() {
      var text2 = root.innerText.match(/Count:\s*([\w.-]*)/i);
      if (!text2) {
        return console.warn('İpucu: {count} değerini render etmeyi unuttunuz mu?');
      }
      if (text2[1] == text[1]) {
        return console.warn('İpucu: `count` değerini değiştirmek için "setter" fonksiyonunu çağırmayı unutmayın.');
      }
      if (!text2[1].match(/^-?\d+$/)) {
        return console.warn('İpucu: `count` değerinin sayı dışındaki bir değere ayarlandığı görünüyor.');
      }

      if (Number(text2[1]) === Number(text[1]) + 1) {
        solutionCtx.setSolved(true);
      }
    }, 10);
  }

  return function () {
    options.event = oe;
  };
}, []);
```

```jsx:repl-initial
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    // sayacı burada 1 artır
  }

  return (
    <div>
      <p class="count">Sayı:</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Bana tıkla</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const [count, setCount] = useState(0)

  const clicked = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <p class="count">Sayı: {count}</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Bana tıkla</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[lifecycle methods]: /guide/v10/components#lifecycle-methods