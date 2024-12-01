---
name: Dış DOM Değişiklikleri
description: Dış DOM değişiklikleri, Preact ve React gibi kütüphanelerde üçüncü taraf kütüphanelerle çalışırken önemli bir konudur. Bu belgede, bu durumların nasıl ele alınacağına dair teknik detaylar ve örnekler bulunmaktadır.
keywords: [Preact, React, DOM değişiklikleri, bileşen, yeniden render]
---

# Dış DOM Değişiklikleri

## Genel Bakış

Bazen, DOM'u serbestçe değiştirebileceği, içinde durumu sürdürebileceği veya hiç bileşen sınırları olmayan üçüncü taraf kütüphaneleri ile çalışmak gerekebilir. Bu tür çalışan birçok harika UI toolkitleri veya yeniden kullanılabilir öğe bulunmaktadır. Preact'te (ve benzer şekilde React'te), bu tür kütüphanelerle çalışmak, Bir Bileşen içinde gerçekleştirilen herhangi bir dış DOM değişikliğini _geri almak_ için Sanal DOM render/dif algoritmasına bilgi vermenizi gerektirir.

:::info
Dış DOM değişiklikleri yapmadan önce bileşenin doğru şekilde işlenmesi için dikkat edilmesi gereken bazı noktalar vardır.
:::

## Teknik

Bu, bileşeninizde `shouldComponentUpdate()` metodunu tanımlayıp `false` döndürmek kadar basit olabilir:

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... veya kısaca:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

> Bu yaşam döngüsü kancası yerleştirildiğinde ve Preact'e değişiklikler VDOM ağacında yukarıya çıktığında Bileşeni yeniden render etmemesini söylediğinizde, Bileşeniniz artık Montajdan çıkarılana kadar statik olarak işlenebilecek bir kök DOM öğesine sahiptir.  
> — Preact Belgelendirmesi

Herhangi bir bileşende olduğu gibi, bu referans basit bir şekilde `this.base` olarak adlandırılır ve `render()`'dan dönen kök JSX Elemanına karşılık gelir.

---

## Örnek İnceleme

İşte bir Bileşen için yeniden render etmeyi "kapatan" bir örnek. `render()` yine de Bileşeni oluşturmak ve monte etmek için çağrılır, böylece başlangıçtaki DOM yapısını oluşturur.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // diff ile yeniden render etmeyin:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // ihtiyacınız olursa gelen props ile burada bir şey yapabilirsiniz
  }

  componentDidMount() {
    // şimdi monte edildi, DOM'u serbestçe değiştirebilir:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // bileşen DOM'dan çıkarılmak üzere, herhangi bir temizlik yapın.
  }

  render() {
    return <div class="example" />;
  }
}
```

:::tip
Bileşeninizi yeniden render etmekten kaçınmak için `shouldComponentUpdate` yöntemini dikkatlice kullanın.
:::

## Demonstrasyon

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Bu demo'yu Webpackbin'de görüntüle**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)

---

## Gerçek Dünya Örnekleri

Alternatif olarak, bu tekniği [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) içinde eylemde görebilirsiniz - bu, DOM'da bir tutunma noktası olarak bir bileşen kullanır, ancak ardından güncellemeleri devre dışı bırakır ve [tags-input](https://github.com/developit/tags-input) burada devralır. Daha karmaşık bir örnek olarak [preact-richtextarea](https://github.com/developit/preact-richtextarea) verilebilir, bu teknikle düzenlenebilir bir `` içinde yeniden render etmeyi önler.