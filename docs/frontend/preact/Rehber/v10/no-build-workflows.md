---
description: 'Webpack, Rollup ve Vite gibi yapı araçları son derece güçlü ve faydalıdır, ancak Preact, uygulamaları bunlar olmadan oluşturmayı tamamen destekler. Bu makalede, no-build iş akışları ve import haritaları ile uygulama geliştirme yöntemleri ele alınmaktadır.'
keywords: [Preact, no-build, iş akışları, import haritaları, web geliştirme, JavaScript, CDN]
---

# No-Build Workflows

Webpack, Rollup ve Vite gibi yapı araçları son derece güçlü ve faydalıdır, ancak Preact uygulamaları bunlar olmadan oluşturmayı tamamen destekler.

No-build iş akışları, **web uygulamalarını geliştirmek için yapı araçlarından feragat etme** ve bunun yerine tarayıcının modül yükleme ve yürütmeyi kolaylaştırmasını sağlama yoludur. Bu, Preact ile başlamanın harika bir yoludur ve tüm ölçeklerde oldukça iyi çalışmaya devam edebilir, ancak tamamen zorluklardan yoksun değildir.

---



---

## İthalat Haritaları

Bir [İthalat Haritası](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap), tarayıcıların modül belirleyicilerini nasıl çözeceğini kontrol etmenizi sağlayan daha yeni bir özelliktir; çoğunlukla `preact` gibi çıplak belirleyicileri `https://esm.sh/preact` gibi bir CDN URL'sine dönüştürmek için kullanılır. 

:::tip
Birçok kişi ithalat haritalarının sağlayabileceği estetiği tercih etse de, bağımlılıkların merkezileştirilmesinin **kolay sürümleme**, tekrarı azaltma veya kaldırma ve daha güçlü CDN özelliklerine daha iyi erişim gibi nesnel avantajları da vardır.
:::

Bu, ithalat haritalarına ihtiyacınız olduğu anlamına gelmez, ancak yapı araçlarından feragat etmeyi seçenler için en azından farkında olunması gereken harika bir seçenektir.

### Temel Kullanım

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) ithalat haritalarını nasıl kullanacağınıza dair çok miktarda bilgi sunmaktadır, ancak temel bir örnek şu şekildedir:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "preact": "https://esm.sh/preact@10.23.1",
          "htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>

    <script type="module">
      import { render } from 'preact';
      import { html } from 'htm/preact';

      export function App() {
        return html`
          <h1>Merhaba, Dünya!</h1>
        `;
      }

      render(html`<${App} />`, document.getElementById('app'));
    </script>
  </body>
</html>
```

Bir `` etiketi oluşturuyoruz ve `type="importmap"` niteliği ekliyoruz, ardından kullanmak istediğimiz modülleri JSON formatında bunun içine tanımlıyoruz. Daha sonra, bir `` etiketinde, bu modülleri çıplak belirleyiciler kullanarak ithal edebiliriz; bu, Node'da gördüğünüze benzer bir durumdur.

> **Not:** Yukarıdaki örnekte `?external=preact` kullanıyoruz çünkü https://esm.sh, istediğiniz modülü ve bağımlılıklarını sağlamak için **faydalı bir şekilde yardımcı** olacaktır -- `htm/preact` için bu, `preact`'in bir kopyasını sağlamak anlamına gelir. Ancak, Preact ve birçok diğer kütüphane, singleton olarak kullanılmalıdır (aynı anda yalnızca bir etkin örnek) ve bu bir sorun yaratır.
>
> `?external=preact` kullanarak, `esm.sh`'ye `preact`'in bir kopyasını sağlamamasını, bununla başa çıkabileceğimizi belirtiyoruz. Bu nedenle, tarayıcı importmap'ımızı kullanarak `preact`'i çözümleyecek, kodumuzun geri kalanıyla **aynı Preact örneğini** kullanacaktır.

### Tarifler ve Yaygın Desenler

Tam bir liste olmamakla birlikte, ithalat haritaları ile çalışırken yararlı bulabileceğiniz bazı yaygın desenler ve tarifler şunlardır. Görmek istediğiniz bir düzen varsa, [bize bildirin](https://github.com/preactjs/preact-www/issues/new)!

:::info
Bu örnekler için CDN olarak https://esm.sh kullanacağız -- bu, bazı diğerlerinden **biraz daha esnek ve güçlü** olan harika, ESM odaklı bir CDN'dir, ancak buna sınırlı değilsiniz. 
:::

Modüllerinizi nasıl sunarsanız sunun, bağımlılıklarla ilgili politikayı bildiğinizden emin olun: **`preact` ve diğer bazı kütüphanelerin tekrarı** (genellikle ince ve beklenmedik) sorunlara yol açacaktır. `esm.sh` için bunu `?external` sorgu parametresi ile çözüyoruz, ancak diğer CDNilere farklı çalışabilir.

#### Preact ile Kancalar, Sinyaller ve HTM

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "@preact/signals": "https://esm.sh/@preact/signals@1.3.0?external=preact",
      "htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
    }
  }
</script>
```

#### React'i Preact ile Takaslama

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "react": "https://esm.sh/preact@10.23.1/compat",
      "react/": "https://esm.sh/preact@10.23.1/compat/",
      "react-dom": "https://esm.sh/preact@10.23.1/compat",
      "@mui/material": "https://esm.sh/@mui/material@5.16.7?external=react,react-dom"
    }
  }
</script>