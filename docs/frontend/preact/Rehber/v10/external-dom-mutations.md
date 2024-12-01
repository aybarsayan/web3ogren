---
name: Dış DOM Mutasyonları
description: 'Preacti jQuery ile entegre etme ve doğrudan DOM’u değiştiren diğer JavaScript parçacıkları ile çalışma. Bu kılavuz, dış DOM mutasyonlarını nasıl yöneteceğinizi ve bileşenlerinizde etkililiği artırmayı gösterir.'
keywords: [Preact, DOM, bileşen yönetimi, JavaScript, dış mutasyonlar]
---

# Dış DOM Mutasyonları

Bazen, DOM'u özgürce değiştirmeyi, içinde durumu korumayı bekleyen veya hiç bileşen sınırı olmayan üçüncü taraf kütüphaneleri ile çalışmak gerekebilir. Bu şekilde çalışan birçok harika UI araç seti veya yeniden kullanılabilir öğe bulunmaktadır.

Preact (ve benzer şekilde React) ile bu tür kütüphanelerle çalışmak, belirli bir Bileşen içinde gerçekleştirilen dış DOM mutasyonlarını _geri almaması_ için Sanal DOM render/diff algoritmasına bilgi vermenizi gerektirir.

---



---

## Teknik

Bu, bileşeninizde `shouldComponentUpdate()` yöntemini tanımlamak ve `false` döndürmesini sağlamak kadar basit olabilir:

```jsx
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... veya kısaca:

```jsx
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

:::tip
Bu yaşam döngüsü kancası uygun bir şekilde ayarlandığında ve Preact’a değişiklikler meydana geldiğinde Bileşeni yeniden render etmemesi talimatı verildiğinde, Bileşeniniz artık, Bileşen kaldırılana kadar sabit olarak muamele görecek bir referansa sahiptir.
:::

Herhangi bir bileşen gibi bu referansa basitçe `this.base` denir ve `render()` işlevinden dönen kök JSX Elemanına karşılık gelir.

---

## Örnek Geçiş

Bileşen için yeniden render etmeyi "kapama" örneği burada. `render()` işlevinin hala Bileşeni oluşturma ve monte etme sürecinin bir parçası olarak çağrıldığını unutmayın, başlangıçtaki DOM yapısını oluşturmak için.

```jsx
class Example extends Component {
  shouldComponentUpdate() {
    // diffe göre yeniden oluşturma:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // burayı kullanarak gelen özelliklerle bir şey yapabilirsiniz.
  }

  componentDidMount() {
    // şimdi monte edildi, DOM'u özgürce değiştirebiliriz:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // bileşen DOM'dan çıkarılmak üzere, herhangi bir temizleme işlemi yapın.
  }

  render() {
    return <div class="example" />;
  }
}
```

:::info
Unutulmamalıdır ki, bileşeninizin davranışlarını kontrol etmek için, gizli bileşen referansı vasıtasıyla DOM üzerinde değişiklikler yapabilirsiniz.
:::

## Demonstrasyon

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Bu demo'yu Webpackbin'de görüntüleyin**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)

---

## Gerçek Dünya Örnekleri

Alternatif olarak, bu tekniği [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) içinde eylemde görebilirsiniz - DOM’da bir tutacak olarak bir bileşen kullanır, ancak güncellemeleri devre dışı bırakır ve [tags-input](https://github.com/developit/tags-input) ‘in devralmasına izin verir. Daha karmaşık bir örnek [preact-richtextarea](https://github.com/developit/preact-richtextarea) olur, bu teknikle düzenlenebilir bir ``’in yeniden render edilmesini önler.