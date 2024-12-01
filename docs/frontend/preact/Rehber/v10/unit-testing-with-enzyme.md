---
name: Enzyme ile Birim Testi
description: 'Enzyme ile Preact uygulamalarını test etmek kolaydır. Bu kılavuz, Enzymein kurulumunu, konfigürasyonunu ve kullanımı ile ilgili örnekler sunarak Preact ile test yazımını kolaylaştırmaktadır.'
keywords: [Enzyme, Preact, test, birim testi, React benzeri, test yazımı]
---

# Enzyme ile Birim Testi

Airbnb'nin [Enzyme](https://airbnb.io/enzyme/) kütüphanesi, React bileşenleri için test yazmak amacıyla kullanılır. **Farklı React sürümleri ve React benzeri kütüphaneler için "adaptörler" kullanarak destek sunar.** Preact için, Preact ekibi tarafından sürdürülen bir adaptör mevcuttur.

Enzyme, bir normal veya başsız tarayıcıda [Karma](http://karma-runner.github.io/latest/index.html) gibi bir araç kullanarak çalışan testleri veya [jsdom](https://github.com/jsdom/jsdom) kullanarak Node.js üzerinde çalışan testleri destekler.

:::info
Enzyme kullanımı hakkında detaylı bir giriş ve API referansı için lütfen [Enzyme belgeleri](https://airbnb.io/enzyme/) sayfasına bakın. Bu kılavuzun geri kalanı Enzyme'in Preact ile nasıl ayarlanacağına ve Enzyme'in Preact ile React arasındaki farklılıklara değinmektedir.
:::

---



---

## Kurulum

Enzyme ve Preact adaptörünü aşağıdaki komutla kurun:

```sh
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## Konfigürasyon

Test kurulumunuzda, Enzyme'i Preact adaptörünü kullanacak şekilde yapılandırmanız gerekecektir:

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() });
```

:::tip
Farklı test çalışanları ile Enzyme kullanımı hakkında rehberlik için, Enzyme belgelerinin [Kılavuzlar](https://airbnb.io/enzyme/docs/guides.html) bölümüne bakın.
:::

## Örnek

**Basit bir `Counter` bileşenimiz olduğunu varsayalım; bu bileşen, bir başlangıç değeri gösterir ve değeri güncellemek için bir düğmeye sahiptir:**

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(count + 1);

  return (
    <div>
      Mevcut değer: {count}
      <button onClick={increment}>Artır</button>
    </div>
  );
}
```

Mocha veya Jest gibi bir test koşucusu kullanarak, çalıştığını kontrol etmek için bir test yazabilirsiniz:

```jsx
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
  it('başlangıç sayısını göstermelidir', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    expect(wrapper.text()).to.include('Mevcut değer: 5');
  });

  it('"Artır" düğmesine tıklandığında artmalıdır', () => {
    const wrapper = mount(<Counter initialCount={5}/>);

    wrapper.find('button').simulate('click');

    expect(wrapper.text()).to.include('Mevcut değer: 6');
  });
});
```

> Bu projenin çalışır sürümünü ve diğer örnekleri görmek için, Preact adaptörünün deposundaki [örnekler/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects) dizinine bakın.
> — Enzyme Dokümantasyonu

## Enzyme'in Çalışma Şekli

Enzyme, yapılandırıldığı adaptör kütüphanesini kullanarak bir bileşeni ve onun alt bileşenlerini render eder. Adaptör daha sonra çıktıyı standartlaştırılmış bir iç temsil haline (bir "React Standart Ağaç") dönüştürür. Enzyme, çıktıyı sorgulamak ve güncellemeleri tetiklemek için bir nesne ile sarar. Sarıcı nesnesinin API'si, çıktının kısımlarını bulmak için CSS benzeri [seçicileri](https://airbnb.io/enzyme/docs/api/selector.html) kullanır.

## Tam, sığ ve string render

Enzyme'ın üç render "modu" vardır:

```jsx
import { mount, shallow, render } from 'enzyme';

// Tam bileşen ağacını render et:
const wrapper = mount(<MyComponent prop="value"/>);

// Sadece `MyComponent`'in doğrudan çıktısını render et (yani, yalnızca yer tutucu olarak render edilmesi gereken "mock" alt bileşenler):
const wrapper = shallow(<MyComponent prop="value"/>);

// Tam bileşen ağacını bir HTML dizesine render et ve sonucu ayrıştır:
const wrapper = render(<MyComponent prop="value"/>);
```

- `mount` fonksiyonu, bileşeni ve tüm alt bileşenlerini tarayıcıda render edileceği gibi render eder.

- `shallow` fonksiyonu, yalnızca bileşenin doğrudan ürettiği DOM düğümlerini render eder. **Herhangi bir alt bileşen, yalnızca çocuklarını döndürerek yer tutucularla değiştirilir.** Bu modun avantajı, alt bileşenlerin detaylarına bağlı olmadan ve tüm bağımlılıklarını oluşturmadan bileşenler için test yazabilmenizdir.

:::note
`shallow` render modunun, Preact adaptörü ile React arasında içsel olarak farklı çalışır. Detaylar için Aşağıdaki Farklar bölümüne bakın.
:::

- `render` fonksiyonu (Preact'in `render` fonksiyonu ile karıştırılmamalıdır!) bir bileşeni bir HTML dizesine render eder. **Bu, sunucuda render işleminin çıktısını test etmek veya bir bileşeni herhangi bir etkisini tetiklemeden render etmek için faydalıdır.**

## `act` ile state güncellemelerini ve etkileri tetikleme

Önceki örnekte, bir düğmeye tıklamak için `.simulate('click')` kullanıldı.

Enzyme, `simulate` çağrılarının muhtemelen bir bileşenin durumunu değiştireceğini veya etkileri tetikleyeceğini bildiğinden, `simulate` döndüğünde herhangi bir durum güncellemesini veya etkiyi anında uygular. Enzyme, başlangıçta `mount` veya `shallow` kullanarak bileşen render edildiğinde ve bir bileşen `setProps` kullanarak güncellendiğinde aynı şeyi yapar.

> Ancak, bir olay bir Enzyme yöntem çağrısının dışında meydana gelirse, örneğin bir olay işleyicisini doğrudan çağırmak (örneğin, düğmenin `onClick` özelliği gibi), Enzyme bu değişikliği bilmeyecektir. Bu durumda, testinizin durum güncellemelerini ve etkilerini tetiklemesi ve ardından Enzyme'a çıktının görünümünü yenilemesini istemesi gerekecektir.
> — Enzyme Dokümantasyonu

- Durum güncellemelerini ve etkilerini senkronize olarak yürütmek için, güncellemeleri tetikleyen kodu saran `preact/test-utils`'dan `act` fonksiyonunu kullanın.
- Enzyme'ın render edilmiş çıktısının görünümünü güncellemek için, sarıcının `.update()` metodunu kullanın.

Örneğin, sayacı artırmak için değiştirilen farklı bir test versiyonu aşağıdadır; düğmenin `onClick` özelliğine doğrudan erişim sağlar:

```js
import { act } from 'preact/test-utils';
```

```jsx
it('"Artır" düğmesine tıklandığında artmalıdır', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    const onClick = wrapper.find('button').props().onClick;

    act(() => {
      // Düğmenin tıklama işleyicisini doğrudan çağırın, bu sefer Enzyme API'si yerine
      onClick();
    });
    // Enzyme'ın çıktı görünümünü yenileyin
    wrapper.update();

    expect(wrapper.text()).to.include('Mevcut değer: 6');
});
```

## Enzyme'in React ile Farkları

Genel niyet, Enzyme + React kullanarak yazılan testlerin Enzyme + Preact ile veya bunun tersinin kolayca çalışabilmesidir. **Bu, Preact için başlangıçta yazılmış bir bileşeni React ile çalışacak şekilde değiştirmek zorunda kalmadan testlerinizi yeniden yazma gerekliliğini ortadan kaldırır.**

Ancak, bu adaptör ile Enzyme'in React adaptörleri arasında bazı davranış farklılıkları vardır:

- "Shallow" render modu içsel olarak farklı şekilde çalışır. Sadece bileşeni "bir seviye derinlikte" render etmekle tutarlıdır, ancak React'tan farklı olarak, gerçek DOM düğümleri oluşturur. **Ayrıca tüm normal yaşam döngüsü kancalarını ve etkileri çalıştırır.**
- `simulate` metodu gerçek DOM olaylarını yayar, oysa React adaptörlerinde `simulate`, `on` propunu yalnızca çağırır.
- Preact'te, durum güncellemeleri (örneğin, `setState` çağrısından sonra) bir araya getirilir ve asenkron olarak uygulanır. React'te durum güncellemeleri, bağlama bağlı olarak hemen veya biriktirilmiş olarak uygulanabilir. 

:::warning
Test yazmayı kolaylaştırmak için, Preact adaptörü, ilk render'lar sonrasında ve bir adaptör üzerindeki `setProps` veya `simulate` çağrılarıyla tetiklenen güncellemelerden sonra durum güncellemelerini ve etkilerini boşaltır. Durum güncellemeleri veya etkileri diğer yollarla tetiklendiğinde, test kodunuzun etkilerin ve durum güncellemelerinin boşaltılmasını manuel olarak tetiklemesi gerekebilir; bunu `preact/test-utils` paketinden `act` kullanarak yapabilirsiniz.
:::

Daha fazla detay için, [Preact adaptörünün README](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react) sayfasına bakın.