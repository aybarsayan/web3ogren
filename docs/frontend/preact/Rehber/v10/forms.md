---
description: "Preact ile formlar oluşturmanın temellerini keşfedin. Kontrollü ve kontrolsüz bileşenler arasında nasıl seçim yapacağınızı öğrenin."
keywords: [Preact, formlar, kontrollü bileşenler, kontrolsüz bileşenler, kullanıcı girişi, React, JavaScript]
---

# Formlar

Preact'teki formlar, HTML'deki gibi çalışır. Bir kontrol oluşturursunuz ve ona bir olay dinleyici eklersiniz.

Ana fark, çoğu durumda `value`'nun DOM düğümü tarafından değil, Preact tarafından kontrol edilmesidir.

---



---

## Kontrollü ve Kontrolsüz Bileşenler

Form kontrolleri hakkında konuşurken sıkça "Kontrollü Bileşen" ve "Kontrolsüz Bileşen" kelimeleriyle karşılaşırsınız. Tanım, veri akışının nasıl yönetildiğini ifade eder.

:::info
DOM, iki yönlü bir veri akışına sahiptir, çünkü her form kontrolü kullanıcı girişini kendisi yönetecektir.
:::

Basit bir metin girişi, bir kullanıcı içine yazdığında daima değerini güncelleyecektir. Buna karşılık, Preact gibi bir framework genellikle tek yönlü bir veri akışına sahiptir; bileşen, değeri kendisi yönetmez, bunun yerine bileşen ağacında daha yukarıda başka bir şey yönetir.

Genel olarak, mümkünse _Kontrolsüz_ Bileşenler kullanmaya çalışmalısınız; DOM, ``'nin durumunu yönetme yeteneğine sahiptir:

```jsx
// Kontrolsüz, çünkü Preact değeri ayarlamaz
<input onInput={myEventHandler} />;
```

Ancak, giriş değerini daha sıkı bir şekilde kontrol etmeniz gereken durumlar olabilir; bu durumda _Kontrollü_ Bileşenler kullanılabilir.

Preact'te kontrollü bileşenler kullanmak için, DOM durumu ile VDOM/Preact'in durumu arasındaki doğal boşluğu kapatmak için `refs` kullanmanız gerekecektir. Giriş alanındaki karakter sayısını sınırlamak için nasıl bir kontrollü bileşen kullanabileceğinize dair bir örnek:

```jsx
// --repl
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
// --repl-before
const Input = () => {
  const [value, setValue] = useState('')
  const inputRef = useRef()

  const onInput = (e) => {
    if (e.currentTarget.value.length <= 3) {
      setValue(e.currentTarget.value)
    } else {
      const start = inputRef.current.selectionStart
      const end = inputRef.current.selectionEnd
      const diffLength = Math.abs(e.currentTarget.value.length - value.length)
      inputRef.current.value = value
      // Seçimi geri yükle
      inputRef.current.setSelectionRange(start - diffLength, end - diffLength)
    }
  }

  return (
	<>
	  <label>Bu giriş 3 karakterle sınırlıdır: </label>
	  <input ref={inputRef} value={value} onInput={onInput} />
	</>
  );
}
// --repl-after
render(<Input />, document.getElementById("app"));
```

> Preact'teki kontrollü bileşenler hakkında daha fazla bilgi için [Kontrollü Girdiler](https://www.jovidecroock.com/blog/controlled-inputs) yazısını inceleyin.

## Basit Bir Form Oluşturma

Todo öğelerini göndermek için basit bir form oluşturalım. Bunun için bir `` elementi oluşturuyor ve form gönderildiğinde çağrılan bir olay işleyici bağlıyoruz. Metin giriş alanı için benzer bir şey yapıyoruz, ancak değeri sınıfımızda kendimiz sakladığımızı unutmayın. Tahmin ettiniz, burada _kontrollü_ bir giriş kullanıyoruz. Bu örnekte çok yararlı, çünkü girişin değerini başka bir elementte göstermemiz gerekiyor.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Bir todo gönderildi");
    e.preventDefault();
  }

  onInput = e => {
    this.setState({ value: e.currentTarget.value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>Bu değeri yazdınız: {value}</p>
        <button type="submit">Gönder</button>
      </form>
    );
  }
}
// --repl-after
render(<TodoForm />, document.getElementById("app"));
```

## Seçim Girişi

Bir `` elementi biraz daha karmaşıktır, ancak diğer form kontrollerine benzer şekilde çalışır:

```jsx
// --repl
import { render, Component } from "preact";

// --repl-before
class MySelect extends Component {
  state = { value: '' };

  onChange = e => {
    this.setState({ value: e.currentTarget.value });
  }

  onSubmit = e => {
    alert("Gönderildi " + this.state.value);
    e.preventDefault();
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onChange={this.onChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button type="submit">Gönder</button>
      </form>
    );
  }
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

## Onay Kutuları ve Radyo Düğmeleri

Onay kutuları ve radyo düğmeleri (``), kontrollü formlar oluştururken başlangıçta karışıklığa neden olabilir. Bunun nedeni, kontrolsüz bir ortamda tarayıcının bir onay kutusunu veya radyo düğmesini "açma" veya "kapama" yeteneğini genellikle sağlıyor olmamızdır; bu, bir değişim olayı dinleyip yeni değere tepki veririz. Ancak, bu teknik, UI'nın her zaman durum ve prop değişikliklerine yanıt olarak otomatik olarak güncellendiği bir dünyaya geçiş yapmakta zorlanır.

> **Adım Adım Açıklama:** Bir onay kutusundaki "değişim" olayını dinlediğimizi varsayalım, bu olay kullanıcı tarafından onay kutusu işaretlendiğinde veya kaldırıldığında tetiklenir. Değişim olay işleyicimizde, onay kutusundan alınan yeni değere `state`'de bir değer ayarlıyoruz. Bunu gerçekleştirmek, bileşenimizin yeniden render edilmesini tetikler; bu, onay kutusunun değerini `state`'den alınan değerle yeniden atamasına yol açar. Bu gereksizdir, çünkü zaten DOM'dan bir değer istedik ama ardından istediğimiz değerle tekrar render etmesini söyledik.

:::warning
Bu nedenle, `input` olayı dinlemek yerine `click` olayını dinlemeliyiz.
:::

Bu, kullanıcı onay kutusuna _veya ilişkili bir ``_'e her tıkladığında tetiklenir. Onay kutuları sadece Boolean `true` ve `false` arasında geçiş yapar, bu nedenle onay kutusuna veya etikete tıkladığımızda, `state`'de bulunan değeri tersine çeviririz; bu, yeniden render etmeyi tetikler ve onay kutusunun görüntülenen değerini istediğimiz değere ayarlamış oluruz.

### Onay Kutusu Örneği

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class MyForm extends Component {
  toggle = e => {
      let checked = !this.state.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onClick={this.toggle}
        />
        bu kutuyu işaretle
      </label>
    );
  }
}
// --repl-after
render(<MyForm />, document.getElementById("app"));