---
title: Seçenek Kancaları
description: Preact, diffin sürecinin çeşitli aşamalarına geri çağırmalar eklemenizi sağlayan birkaç seçenek kancası içerir. Bu kancalar, Preact'ın özellik setini genişletmek ya da özel test araçları oluşturmak için kullanılır.
keywords: [Preact, seçenek kancaları, render süreci, API, VNode]
---

# Seçenek Kancaları

Preact'in render edilme sürecini değiştirebilen eklentiler için geri çağırmalar.

Preact, "Seçenek Kancaları" olarak adlandırılan render sürecinin her aşamasını gözlemlemek veya değiştirmek için kullanılabilecek birçok farklı geri çağırmayı destekler (bu, `kancalar` ile karıştırılmamalıdır). Bunlar, Preact'ın kendisinin özellik setini genişletmek veya özel test araçları oluşturmak için sıklıkla kullanılır. `preact/hooks`, `preact/compat` gibi tüm eklentilerimiz ve geliştirme araçları uzantımız bu geri çağırmalar üzerine inşa edilmiştir.

:::note
Bu API, Preact'ı genişletmek isteyen araç veya kütüphane yazarları için esasen tasarlanmıştır.
:::

---



---

## Sürümleme ve Destek

Seçenek Kancaları Preact'ta uygulanır ve bu nedenle anlamsal olarak sürümlenir. Ancak, aynı iptal politikasına sahip değildir, bu da ana sürümlerin API'yi genişletilmiş bir duyuru süresi olmaksızın değiştirebileceği anlamına gelir. Bu, Options Hooks aracılığıyla maruz bırakılan dahili API yapılarına, `VNode` nesneleri gibi, de geçerlidir.

## Seçenek Kancalarını Ayarlama

Seçenek Kancalarını Preact'ta dışa aktarılan `options` nesnesini değiştirerek ayarlayabilirsiniz.

Bir kanca tanımlarken, önceden tanımlanmış aynı ada sahip bir kancayı aradığınızdan emin olun. Bunu yapmadan, çağrı zinciri kırılacak ve daha önce yüklenmiş kancaya bağımlı kod bozulacaktır; bu da `preact/hooks` veya Geliştirme Araçları'nın çalışmayı durdurmasına neden olur. Ayrıca, orijinal kancaya aynı argümanları da ilettiğinizden emin olun - bunları değiştirmek için özel bir nedeniniz yoksa.

```js
import { options } from 'preact';

// Önceki kancayı sakla
const oldHook = options.vnode;

// Kendi seçenek kancamızı ayarlama
options.vnode = vnode => {
  console.log("Hey ben bir vnode'um", vnode);

  // Daha önce tanımlanmış bir kanca varsa çağır
  if (oldHook) {
    oldHook(vnode);
  }
}
```

:::warning
`options.event` hariç mevcut kancaların hiçbiri dönüş değerlerine sahip değildir, bu nedenle orijinal kancadan dönüş değerlerini işlemek gerekli değildir.
:::

## Mevcut Seçenek Kancaları

#### `options.vnode`

**İmza:** `(vnode: VNode) => void`

En yaygın Seçenek Kancası, `vnode` bir VNode nesnesi oluşturulduğunda çağrılır. VNode'lar, Preact'ın Sanal DOM öğelerinin temsilidir ve genellikle "JSX Öğeleri" olarak düşünülür.

#### `options.unmount`

**İmza:** `(vnode: VNode) => void`

Bir vnode, DOM temsilinin hala bağlı olduğu zaman hemen öncesinde çağrılır.

#### `options.diffed`

**İmza:** `(vnode: VNode) => void`

Bir vnode render edildikten hemen sonra çağrılır; DOM temsili yapılandırıldığında veya doğru duruma dönüştürüldüğünde.

#### `options.event`

**İmza:** `(event: Event) => any`

Bir DOM olayı, ilişkili Sanal DOM dinleyicisi tarafından işlenmeden hemen önce çağrılır. `options.event` ayarlandığında, olay dinleyici argümanı olarak olay, `options.event` dönüş değeri ile değiştirilir.

#### `options.requestAnimationFrame`

**İmza:** `(callback: () => void) => void`

`preact/hooks` içindeki etkileri ve etki tabanlı işlevselliği planlamak için kontrol sağlar.

#### `options.debounceRendering`

**İmza:** `(callback: () => void) => void`

Küresel bileşen render kuyruğundaki güncellemelerin işlenmesini toplamak için kullanılan bir zamanlama "ertelenmesi" fonksiyonu.

Varsayılan olarak Preact, sıfır süreli bir `setTimeout` kullanır.

#### `options.useDebugValue`

**İmza:** `(value: string | number) => void`

`preact/hooks` içindeki `useDebugValue` kancası çağrıldığında çağrılır.