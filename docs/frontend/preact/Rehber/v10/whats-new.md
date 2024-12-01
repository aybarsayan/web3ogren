---
description: 'Preact X, önemli yeni özellikler ve değişiklikler içermektedir. Daha küçük, hızlı ve özellik dolu bir kütüphane olarak Preact X, geliştirilmiş uyumluluk iyileştirmeleri ile dikkat çekiyor.'
keywords: [Preact, Preact X, özellikler, uyumluluk, geliştirme, Hooks, context]
---

# Preact X'de Neler Yeni

Preact X, Preact 8.x'ten büyük bir sıçrama. Kodumuzun her bir parçasını yeniden düşündük ve süreçte birçok büyük özellik ekledik. Aynı zamanda, daha fazla üçüncü taraf kütüphanesini desteklemek için uyumluluk iyileştirmeleri de yapıldı.

:::info
Kısacası, Preact X, her zaman Preact'ten istediğimiz şey: Küçük, hızlı ve özelliklerle dolu bir kütüphane. 
:::

Ve boyut konusuna değinecek olursak, tüm yeni özelliklerin ve geliştirilmiş render'ın `8.x` ile aynı boyut alanına sığacağını duyduğunuzda mutlu olacaksınız!

---



---

## Fragmentler

`Fragmentler`, Preact X'in önemli bir yeni özelliği ve Preact'ın mimarisini yeniden düşünmenin ana motivasyonlarından biri. **Bunlar**, ekstra bir sarmalayıcı DOM elementi olmaksızın, ebeveynleriyle birlikte satır içi olarak çocuk elementlerini render eden özel bir bileşen türüdür. Bunun yanı sıra, `render` fonksiyonundan birden fazla düğüm döndürmenizi sağlar.

`Fragment belgeleri →`

```jsx
// --repl
function Foo() {
  return (
    <>
      <div>A</div>
      <div>B</div>
    </>
  )
}
```

## componentDidCatch

Hepimiz uygulamalarımızda hataların olmamasını dile getiriyoruz, ama bazen olur. `componentDidCatch` ile, artık `render` gibi yaşam döngüsü yöntemleri içinde oluşan hataları yakalamak ve ele almak mümkün. Bu, kullanıcı dostu hata mesajları görüntülemek veya bir şeyler ters gittiğinde dış hizmete bir log girişi yazmak için kullanılabilir.

`Yaşam döngüsü belgeleri →`

```jsx
// --repl
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Bir şeyler kötü gitti</p>;
    }
    return props.children;
  }
}
```

## Hooks

`Hooks`, bileşenler arasında mantığı paylaşmayı daha kolay hale getiren yeni bir yöntemdir. **Mevcut sınıf tabanlı bileşen API'sine alternatif olarak temsil edilir.** Preact'te `preact/hooks` aracılığıyla içe aktarılabilen bir eklenti içinde bulunurlar.

`Hooks Belgeleri →`

```jsx
// --repl
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Sayıcı: {value}
      <button onClick={increment}>Arttır</button>
    </div>
  );
}
```

## createContext

`createContext` API'si, `getChildContext()` için gerçek bir halef olmuştur. **`getChildContext`,** bir değeri asla değiştirmeyeceğinizden kesinlikle emin olduğunuzda iyidir, ancak bir sağlayıcı ile tüketici arasındaki bir bileşen `shouldComponentUpdate` ile `false` döndürdüğünde bir güncellemeyi engellediğinde parçalanır. Yeni bağlam API'si ile bu sorun artık geçmişte kaldı. **Ağaçta derin güncellemeler sağlamak için gerçek bir yayın/abone çözümüdür.**

`createContext Belgeleri →`

```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => <div>Aktif tema: {theme}</div>}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
```

## CSS Özel Değişkenleri

Bazen küçük şeyler büyük bir fark yaratır. **Son zamanlardaki CSS gelişmeleri ile** [CSS değişkenlerini](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) stil vermek için kullanabilirsiniz:

```jsx
function Foo(props) {
  return <div style={{ '--theme-color': 'blue' }}>{props.children}</div>;
}
```

## Uyumluluk Artık Temel İçinde

Yeni özellikler ekleme ve Preact'i ileriye taşıma konusunda her zaman istekli olsak da, `preact-compat` paketinin o kadar çok ilgi görmedi. Şimdiye kadar ayrı bir depoda yaşamıştı, bu da büyük değişiklikleri Preact ve uyumluluk katmanı arasında koordine etmeyi zorlaştırıyordu. **Uyumluluğu Preact ile aynı pakete taşıyarak,** React ekosisteminden kütüphaneleri kullanmak için ekstra bir şey yüklemeniz gerekmiyor.

Uyumluluk katmanı artık `preact/compat` olarak adlandırılıyor ve `forwardRef`, `memo` gibi birçok yeni trick öğrendi ve sayısız uyumluluk iyileştirmesi yaptı.

```js
// Preact 8.x
import React from "preact-compat";

// Preact X
import React from "preact/compat";
```

## Birçok Uyumluluk Düzeltmesi

Listelemesi çok fazla ama React ekosisteminden kütüphanelerle uyumluluk alanında büyük ilerleme kaydettik. Özellikle test sürecimizde, tamamen destek garanti edebilmek için birkaç popüler paketi dahil etmeye dikkat ettik.

:::warning
Eğer Preact 8 ile iyi çalışmayan bir kütüphane ile karşılaştıysanız, onu X ile tekrar denemelisiniz. Her şeyin beklendiği gibi çalışması olasılığı oldukça yüksek ;)
:::