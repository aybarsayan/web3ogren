---
description: Bu kılavuz, Preact bileşenlerini nasıl genişleteceğinizi ve ES2015 sınıf kalıtımını kullanarak nasıl daha fazla işlevsellik ekleyeceğinizi açıklamaktadır. 
keywords: [Preact, bileşen genişletme, ES2015, sınıf kalıtımı, mixin, JavaScript]
---

# Bileşeni Genişletme

Bazı projelerin, **bileşeni ek işlevsellik ile genişletmek** isteyebileceği mümkündür. 

JavaScript'te kalıtımın değeri hakkında çeşitli görüşler vardır, ancak tüm bileşenlerinizin miras alacağı kendi "ana sınıfınızı" oluşturmak isterseniz, Preact bu konuda size yardımcı olur.

:::info
Belki de Flux benzeri bir mimaride **depolara/düşürücülere otomatik bağlantı** yapmak istiyorsunuz. Belki de `React.createClass()` gibi hissettirmek için özellik tabanlı karışımlar eklemek istersiniz _(not: [`@bind` dekoratörü](https://github.com/developit/decko#bind) tercih edilir)_.
:::

Her halükarda, Preact'in `Component` sınıfını genişletmek için sadece ES2015 sınıf kalıtımını kullanın:

```js
class BoundComponent extends Component {
    // örnek: bağlı yöntemleri al
    binds() {
        let list = this.bind || [],
            binds = this._binds;
        if (!binds) {
            binds = this._binds = {};
            for (let i=list.length; i--; ) {
                binds[list[i]] = this[list[i]].bind(this);
            }
        }
        return binds;
    }
}
```

## Kullanım Örneği:

```js
class Link extends BoundComponent {
    bind = ['click'];
    click() {
        open(this.props.href);
    }
    render({ children }) {
        let { click } = this.binds();
        return <span onClick={ click }>{ children }</span>;
    }
}

render(
    <Link href="http://example.com">Bana Tıklayın</Link>,
    document.body
);
```

Olasılıklar sonsuzdur. İşte **basit karışımları destekleyen genişletilmiş bir `Component` sınıfı**:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Dipnot:** Kalıtımın sizi **kırılgan ebeveyn-çocuk ilişkilerine** kilitleyebileceğini belirtmek gerekir. Genellikle, kalıtım ile yeterince çözülebilecek bir programlama görevi ile karşılaştığınızda, böyle bir ilişki oluşturmayı önleyecek daha işlevsel bir yol vardır. — önemli bir düşünce