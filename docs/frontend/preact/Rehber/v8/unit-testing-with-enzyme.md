---
name: Enzyme ile Birim Testi
description: 'Enzyme ile Preact uygulamalarını test etmek artık kolay. Bu kılavuz, Enzymei Preact ile nasıl kuracağınızı ve kullanacağınızı kapsamlı bir şekilde açıklamaktadır.'
keywords: [Enzyme, Preact, unit testing, testing framework, React testing]
---

# Enzyme ile Birim Testi

Airbnb'nin [Enzyme](https://airbnb.io/enzyme/) kütüphanesi, 
React bileşenleri için test yazmak amacıyla kullanılır. Farklı React ve 
React benzeri kütüphaneleri "adapter" kullanarak destekler. Preact için 
bir adapter mevcuttur ve Preact ekibi tarafından korunmaktadır.

:::info
Enzyme, [Karma](http://karma-runner.github.io/latest/index.html) gibi bir araç 
kullanarak normal veya başsız bir tarayıcıda çalışan testleri destekler veya 
Node içerisinde [jsdom](https://github.com/jsdom/jsdom) kullanarak tarayıcı API'lerinin 
sahte uygulaması olarak çalışan testler yazar.
:::

Enzyme'i kullanmak ve API referansı hakkında ayrıntılı bilgi için, 
[Enzyme belgelerine](https://airbnb.io/enzyme/) bakın. Bu kılavuzun geri kalan kısmı, 
Enzyme'i Preact ile nasıl kuracağınızı ve Enzyme ile Preact'in Enzyme ile 
React'tan nasıl farklılaştığını açıklamaktadır.

---



---

## Kurulum

Enzyme ve Preact adapterini kurmak için aşağıdaki komutu kullanın:

```sh
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## Yapılandırma

Test kurulum kodunuzda, Enzyme'in Preact adapterini kullanması için yapılandırmanız gerekecek:

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter });
```

Farklı test koşucularıyla Enzyme'i kullanma rehberi için, Enzyme belgelere 
ait [Kılavuzlar](https://airbnb.io/enzyme/docs/guides.html) bölümüne bakın.

## Örnek

Diyelim ki başlangıç değeri gösteren basit bir `Counter` bileşenimiz var, 
değeri güncellemek için bir buton içeriyor:

```js
import { Component, h } from 'preact';

export default class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: props.initialCount,
    };
  };

  render() {
    const increment = () => this.setState(({ count }) => ({
      count: count + 1,
    }));

    return (
      <div>
        Mevcut değer: {this.state.count}
        <button onClick={increment}>Artır</button>
      </div>
    );
  }
}
```

:::tip
Mocha veya Jest gibi bir test koşucusu kullanarak, beklenildiği gibi 
çalıştığını kontrol eden bir test yazabilirsiniz:
:::

```js
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
  it('başlangıç sayısını göstermelidir', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    expect(wrapper.text()).to.include('Mevcut değer: 5');
  });

  it('"Artır" butonuna tıklandığında artırılmalıdır', () => {
    const wrapper = mount(<Counter initialCount={5}/>);

    wrapper.find('button').simulate('click');

    expect(wrapper.text()).to.include('Mevcut değer: 6');
  });
});
```

Bu projenin çalışabilir bir sürümü ve diğer örnekler için, 
Preact adapterinin deposundaki [examples/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects) 
dizinine bakın.

---

## Enzyme nasıl çalışır

Enzyme, yapılandırıldığı adapter kütüphanesini kullanarak bir bileşeni 
ve onun çocuklarını render eder. Daha sonra adapter çıktıyı, standart 
bir iç temsile (bir "React Standart Ağacı") dönüştürür. Enzyme, 
bunu sorgulama ve güncellemeleri tetikleme yöntemlerine sahip bir nesne ile 
sarar. Sarıcı nesnesinin API'si, çıktının bölümlerini bulmak için 
CSS benzeri [seçiciler](https://airbnb.io/enzyme/docs/api/selector.html) kullanır.

## Tam, sığ ve string renderleme 

Enzyme'in üç renderleme "modu" vardır:

```js
import { mount, shallow, render } from 'enzyme';

// Tam bileşen ağacını renderleyin:
const wrapper = mount(<MyComponent prop="value"/>);

// Sadece `MyComponent`'in doğrudan çıktısını renderleyin (yani "mock" 
// çocuk bileşenlerini sadece yer tutucu olarak renderleyin):
const wrapper = shallow(<MyComponent prop="value"/>);

// Tam bileşen ağacını bir HTML dizesine renderleyin ve sonucu analiz edin:
const wrapper = render(<MyComponent prop="value"/>);
```

 - `mount` fonksiyonu bileşeni ve tüm alt bileşenlerini 
   tarayıcıda nasıl renderlenecekse o şekilde render eder.

 - `shallow` fonksiyonu yalnızca bileşen tarafından doğrudan üretilen DOM 
   düğümlerini render eder. Herhangi bir çocuk bileşen, yalnızca çocuklarını 
   üreten yer tutucular ile değiştirilir.

   Bu modun avantajı, çocuk bileşenlerin detaylarına bağlı olmadan bileşenler 
   için test yazabileceğinizdir.

   Preact adapter ile `shallow` renderleme modu, React ile 
   karşılaştırıldığında içeride farklı çalışmaktadır. Daha fazla bilgi için 
   aşağıya bakın.

 - `render` fonksiyonu (Preact'in `render` fonksiyonu ile karıştırılmamalıdır!) 
   bir bileşeni HTML dizesine render eder. Bu, sunucudaki renderleme çıktısını 
   test etmek için faydalıdır.

## Durum güncellemelerini tetikleme

Önceki örnekte, `.simulate('click')` bir butona tıklamak için kullanılmıştır.

:::warning
Enzyme, `simulate` çağrılarının bir bileşenin durumunu değiştirebileceğini 
bildiğinden, `simulate` döndüğünde herhangi bir durum güncellemelerini 
uygulayacaktır. 
:::

Ancak, bir olay Enzyme metod çağrısının dışındayken, örneğin doğrudan
bir olay işleyici çağırıldığında (örneğin butonun `onClick` prop'u), o 
zaman Enzyme değişiklikten haberdar olmayacaktır. Bu durumda, testinizin 
durum güncellemelerinin yürütülmesini tetiklemesi ve ardından Enzyme'in 
görünümünü yenilemesi gerekecektir.

Bir Enzyme sarıcısının `.update()` metodunu çağırmak, bekleyen 
durum güncellemelerini Preact bileşenlerine uygular ve Enzyme'in 
render edilmiş çıktısının görünümünü yeniler.

Örneğin, aşağıda butonun `onClick` prop'unu doğrudan çağırmak için 
değiştirilen bahşişi artırmak için farklı bir test versiyonu yer 
almaktadır:

```js
it('"Artır" butonuna tıklandığında artırılmalıdır', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    const onClick = wrapper.find('button').props().onClick;

    // Butonun tıklama işleyicisini çağır, ama bu sefer doğrudan, 
    // Enzyme API'si aracılığıyla değil
    onClick();

    // Enzyme'in çıktısının görünümünü yenile
    wrapper.update();

    expect(wrapper.text()).to.include('Mevcut değer: 6');
});
```

## React ile Enzyme arasındaki farklılıklar

Enzyme + React kullanarak yazılan testlerin, Enzyme + Preact ile 
çalışmasını kolaylaştırmak amacıyla genel niyet vardır. Bu, bir 
bileşeni Preact için yazılmışsa, React ile çalışmasını sağlamak veya 
tersini yapmak gerektiğinde, tüm testlerinizi yeniden yazma ihtiyacını 
ortadan kaldırır.

Ancak, bu adapter ile Enzyme'in React adapterleri arasında dikkate almanız 
gereken bazı davranış farklılıkları vardır:

- "shallow" renderleme modu içeride farklı çalışıyor. Yalnızca "bir seviye 
  derinliğinde" bir bileşeni renderlemekle tutarlı olmasına rağmen, 
  React'tan farklı olarak gerçek DOM düğümleri oluşturur. Tüm normal 
  yaşam döngüsü ipuçlarını da yürütür.
- `simulate` metodu gerçek DOM olaylarını yayınlarken, React 
  adapterlerinde `simulate` yalnızca `on` prop'unu çağırır.
- Preact'te, durum güncellemeleri (örneğin, `setState` çağrısından 
  sonra) bir araya getirilir ve asenkron olarak uygulanır. React'te durum 
  güncellemeleri bağlama bağlı olarak hemen veya bir arada uygulanabilir. 
  Test yazmayı kolaylaştırmak için, Preact adapter başlangıçta render edilen 
  durum güncellemelerini ve `setProps` veya adapter üzerindeki 
  `simulate` çağrıları ile tetiklenen güncellemeleri boşaltır. 
  Durum güncellemeleri diğer yollarla tetiklendiğinde, test kodunuz 
  bekleyen durum güncellemelerini boşaltmak için `.update()`'u 
  manuel olarak çağırmak zorunda kalabilir.

Daha fazla ayrıntı için, [Preact adapterinin README'sine](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react) bakın.