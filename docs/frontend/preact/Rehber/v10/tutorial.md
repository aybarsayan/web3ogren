---
name: Hızlı Eğitim
description: 'İlk Preact uygulamanızı yazın. Bu kılavuz, basit bir tıklayan saat bileşeni oluşturmayı ve uygulamanızı etkileşimli hale getirmeyi anlatmaktadır.'
keywords: [Preact, bileşenler, etkileşimli uygulama, saat bileşeni, JSX]
---

# Eğitim

Bu kılavuz, basit bir "tıklayan saat" bileşeni oluşturmayı anlatır. Eğer Sanal DOM konusunda yeniyorsanız, `tam Preact eğitimi` deneyin.

> :information_desk_person: Bu kılavuz, `Başlarken` belgesini tamamladığınızı ve araçlarınızı başarılı bir şekilde kurduğunuzu varsayıyor. Eğer değilse, `Vite` ile başlayın.

---



---

## Merhaba Dünya

Kutudan çıktığı gibi, herhangi bir Preact kod tabanında her zaman göreceğiniz iki fonksiyon `h()` ve `render()`'dır. `h()` fonksiyonu, JSX'i Preact'ın anlayacağı bir yapıya dönüştürmek için kullanılır. Ama JSX ile hiç ilgisi olmadan doğrudan da kullanılabilir:

```jsx
// JSX ile
const App = <h1>Merhaba Dünya!</h1>;

// ...JSX olmadan aynı
const App = h('h1', null, 'Merhaba Dünya');
```

> :note: Bu kendi başına hiçbir şey yapmaz ve Merhaba-Dünya uygulamamızı DOM'a enjekte etmenin bir yoluna ihtiyacımız vardır. Bu amaçla `render()` fonksiyonunu kullanırız.

```jsx
// --repl
import { render } from 'preact';

const App = <h1>Merhaba Dünya!</h1>;

// Uygulamamızı DOM'a enjekte et
render(App, document.getElementById('app'));
```

Tebrikler, ilk Preact uygulamanızı yaptınız!

---

## Etkileşimli Merhaba Dünya

Metin render etmek bir başlangıç, ama uygulamamızı biraz daha etkileşimli hale getirmek istiyoruz. Veriler değiştiğinde güncellenmesini istiyoruz. :star2:

Son hedefimiz, kullanıcının bir isim girebileceği ve formun gönderildiğinde bunu gösterebileceği bir uygulama oluşturmaktır. Bunun için gönderdiğimiz bilgileri saklayacak bir şeye ihtiyacımız var. İşte burada `Bileşenler` devreye giriyor.

Mevcut Uygulamamızı `Bileşenler` haline getirelim:

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Merhaba, dünya!</h1>;
  }
}

render(<App />, document.getElementById("app"));
```

Başlık kısmına yeni bir `Component` import ettik ve `App`'i bir sınıfa dönüştürdük. Bu başlı başına kullanışlı değildir ama bir sonraki adımımız için bir ön hazırlıktır. Durumu biraz daha heyecanlı hale getirmek için bir metin girişi ve bir gönderme butonu ekleyeceğiz.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Merhaba, dünya!</h1>
        <form>
          <input type="text" />
          <button type="submit">Güncelle</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

Şimdi konuşuyoruz! Gerçek bir uygulama gibi görünmeye başlıyor! Ama hala etkileşimli hale getirmemiz gerekiyor. "Merhaba dünya!"yı "Merhaba, [kullanıcı girişi]!" olarak değiştirmek isteyeceğiz, bu yüzden mevcut girdi değerini bilmemiz gerekiyor.

Bunu Bileşenimizin `state` adlı özel bir özelliğinde saklayacağız. Bu özelliğin özel olmasının nedeni, `setState` metodu aracılığıyla güncellendiğinde, Preact'in yalnızca durumu güncellemeyip aynı zamanda bu bileşen için bir render isteği de planlamasıdır. İstek işlendikten sonra, bileşenimiz güncellenmiş durumu ile tekrar render edilecektir.

Son olarak, yeni durumu girdiğimizde `value` ayarlayarak ve `input` olayına bir olay işleyici ekleyerek bağlamamız gerekiyor.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Durumumuzu başlat
  state = { value: '' }

  onInput = ev => {
    // Bu bir durum güncellemesi planlayacaktır. Güncellendiğinde bileşen
    // otomatik olarak kendini tekrar render edecektir.
    this.setState({ value: ev.currentTarget.value });
  }

  render() {
    return (
      <div>
        <h1>Merhaba, dünya!</h1>
        <form>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Güncelle</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

Bu noktada uygulamanın kullanıcı açısından çok fazla değişmemesi gerekir, ancak bir sonraki adımımızda tüm parçaları bir araya getireceğiz.

Girdi için yaptığımız gibi, ``'in `submit` olayına bir işleyici ekleyeceğiz. Fark, `state`'imizin farklı bir özelliğine `name` yazarak gerçekleştireceğimizdir. Ardından başlığımızı değiştireceğiz ve oraya `state.name` değerimizi yerleştireceğiz.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Başlangıç durumuna `name` ekliyoruz
  state = { value: '', name: 'dünya' }

  onInput = ev => {
    this.setState({ value: ev.currentTarget.value });
  }

  // En son giriş değerini güncelleyen bir gönderme işleyici ekleyin
  onSubmit = ev => {
    // Varsayılan tarayıcı davranışını engelleyin (yani buradan formu gönderme)
    ev.preventDefault();

    this.setState({ name: this.state.value });
  }

  render() {
    return (
      <div>
        <h1>Merhaba, {this.state.name}!</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">Güncelle</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

Boom! İşimizi bitirdik! Artık özel bir isim girebilir, "Güncelle"ye tıklayabilir ve yeni ismimiz başlığımızda görünecek.

---

## Bir Saat Bileşeni

İlk bileşenimizi yazdık, bu yüzden biraz daha pratik yapalım. Bu sefer bir saat yapalım.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

Tamam, bu kadar kolaydı! Sorun şu ki, zaman değişmiyor. Saati oluşturduğumuz an donmuş durumda.

> :warning: Bu nedenle, bileşen DOM'a eklendiğinde 1 saniyelik bir zamanlayıcı başlatmak ve kaldırıldığında durdurmak istiyoruz. Zamanlayıcıyı oluşturacağız ve `componentDidMount` içinde ona bir referans saklayacağız, zamanlayıcıyı ise `componentWillUnmount` içinde durduracağız. Her zamanlayıcı, bileşenin `state` nesnesini yeni zaman değeri ile güncelleyecektir. Bunu yapmak, bileşeni otomatik olarak tekrar render edecektir.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  state = { time: Date.now() };

  // Bileşenimiz her oluşturulduğunda çağrılır
  componentDidMount() {
    // her saniyede zamanı güncelle
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Bileşenimiz yok olmadan hemen önce çağrılır
  componentWillUnmount() {
    // render edilemeyecek durumda durdur
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

Ve yine yaptık! Artık [tıklayan bir saat](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/) var!