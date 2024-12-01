---
description: Scrollspy, Bootstrap navigasyon veya liste grubu bileşenlerinin kaydırma konumuna dayanarak otomatik olarak güncellenmesini sağlar. Bu özellik, hangi bağlantının görünümde aktif olduğunu gösterir.
keywords: [Scrollspy, Bootstrap, navigasyon, liste grubu, aktif sınıf]
---

## Nasıl çalışır

Scrollspy doğru şekilde çalışmak için birkaç gereksinime sahiptir:

- Bootstrap `nav bileşeni` veya `liste grubu` üzerinde kullanılmalıdır.
- Scrollspy'nin çalışması için gözlemlediğiniz elementte, genellikle `` üzerinde `position: relative;` olmalıdır.
- Anchor (``) etiketleri gereklidir ve bir `id` ile ilgili bir elemente işaret etmelidir.

Başarıyla uygulandığında, nav veya liste grubunuz, ilgili hedeflerine dayanarak `.active` sınıfını bir öğeden diğerine güncelleyerek hareket eder.

:::tip
**Kaydırılabilir konteynerler ve klavye erişimi:** Bir kaydırılabilir konteyner oluşturuyorsanız (diğerleri dışında ``), bir `height` ayarı yapmayı ve `overflow-y: scroll;` uygulamayı unutmayın—aynı zamanda klavye erişimi sağlamak için `tabindex="0"` eklemeyi unutmayın.
:::

## Navbar'da örnek

Navbar'ın altındaki alanı kaydırın ve aktif sınıfın değiştiğini izleyin. Açılır menü öğeleri de vurgulanacaktır.


  
    Navbar
    
      
        Birinci
      
      
        İkinci
      
      
        Açılır Menü
        
          Üçüncü
          Dördüncü
          
          Beşinci
        
      
    
  
  
    Birinci başlık
    Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
    İkinci başlık
    Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
    Üçüncü başlık
    Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
    Dördüncü başlık
    Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
    Beşinci başlık
    Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
  


> **Not:** Navbar'daki öğelerin kaydırma esnasında aktif hale geldiğini gözlemlemeniz önemlidir. — Kısa bir gözlem

```html
<nav id="navbar-example2" class="navbar navbar-light  bg-body-tertiary px-3">
  <a class="navbar-brand" href="#">Navbar</a>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <a class="nav-link" href="#scrollspyHeading1">Birinci</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#scrollspyHeading2">İkinci</a>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" data-coreui-toggle="dropdown" href="#" role="button" aria-expanded="false">Açılır Menü</a>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#scrollspyHeading3">Üçüncü</a></li>
        <li><a class="dropdown-item" href="#scrollspyHeading4">Dördüncü</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#scrollspyHeading5">Beşinci</a></li>
      </ul>
    </li>
  </ul>
</nav>
<div data-coreui-spy="scroll" data-coreui-target="#navbar-example2" data-coreui-offset="0" class="scrollspy-example" tabindex="0">
  <h4 id="scrollspyHeading1">Birinci başlık</h4>
  <p>...</p>
  <h4 id="scrollspyHeading2">İkinci başlık</h4>
  <p>...</p>
  <h4 id="scrollspyHeading3">Üçüncü başlık</h4>
  <p>...</p>
  <h4 id="scrollspyHeading4">Dördüncü başlık</h4>
  <p>...</p>
  <h4 id="scrollspyHeading5">Beşinci başlık</h4>
  <p>...</p>
</div>
```

## İç içe nav ile örnek

Scrollspy, iç içe geçmiş `.nav` ile de çalışır. Eğer iç içe geçmiş bir `.nav` `.active` ise, ebeveynleri de `.active` olacaktır. Navbar'ın yanındaki alanı kaydırın ve aktif sınıfın değiştiğini gözlemleyin.


  
    
      
        Navbar
        
          Öğe 1
          
            Öğe 1-1
            Öğe 1-2
          
          Öğe 2
          Öğe 3
          
            Öğe 3-1
            Öğe 3-2
          
        
      
    
    
      
        Öğe 1
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 1-1
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 1-2
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 2
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 3
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 3-1
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 3-2
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
      
    
  


```html
<nav id="navbar-example3" class="navbar navbar-light  bg-body-tertiary flex-column align-items-stretch p-3">
  <a class="navbar-brand" href="#">Navbar</a>
  <nav class="nav nav-pills flex-column">
    <a class="nav-link" href="#item-1">Öğe 1</a>
    <nav class="nav nav-pills flex-column">
      <a class="nav-link ms-3 my-1" href="#item-1-1">Öğe 1-1</a>
      <a class="nav-link ms-3 my-1" href="#item-1-2">Öğe 1-2</a>
    </nav>
    <a class="nav-link" href="#item-2">Öğe 2</a>
    <a class="nav-link" href="#item-3">Öğe 3</a>
    <nav class="nav nav-pills flex-column">
      <a class="nav-link ms-3 my-1" href="#item-3-1">Öğe 3-1</a>
      <a class="nav-link ms-3 my-1" href="#item-3-2">Öğe 3-2</a>
    </nav>
  </nav>
</nav>

<div data-coreui-spy="scroll" data-coreui-target="#navbar-example3" data-coreui-offset="0" tabindex="0">
  <h4 id="item-1">Öğe 1</h4>
  <p>...</p>
  <h5 id="item-1-1">Öğe 1-1</h5>
  <p>...</p>
  <h5 id="item-1-2">Öğe 1-2</h5>
  <p>...</p>
  <h4 id="item-2">Öğe 2</h4>
  <p>...</p>
  <h4 id="item-3">Öğe 3</h4>
  <p>...</p>
  <h5 id="item-3-1">Öğe 3-1</h5>
  <p>...</p>
  <h5 id="item-3-2">Öğe 3-2</h5>
  <p>...</p>
</div>
```

## Liste grubu ile örnek

Scrollspy, `.list-group` ile de çalışır. Liste grubunun yanındaki alanı kaydırın ve aktif sınıfın değiştiğini gözlemleyin.


  
    
      
        Öğe 1
        Öğe 2
        Öğe 3
        Öğe 4
      
    
    
      
        Öğe 1
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 2
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 3
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
        Öğe 4
        Bu, scrollspy sayfası için bazı yer tutucu içeriklerdir. Sayfayı aşağı kaydırdığınızda, uygun navigasyon bağlantısı vurgulanır. Bileşen örneği boyunca tekrarlanmaktadır. Kaydırma ve vurgulamayı vurgulamak için burada daha fazla örnek metin eklemeye devam ediyoruz.
      
    
  


```html
<div id="list-example" class="list-group">
  <a class="list-group-item list-group-item-action" href="#list-item-1">Öğe 1</a>
  <a class="list-group-item list-group-item-action" href="#list-item-2">Öğe 2</a>
  <a class="list-group-item list-group-item-action" href="#list-item-3">Öğe 3</a>
  <a class="list-group-item list-group-item-action" href="#list-item-4">Öğe 4</a>
</div>
<div data-coreui-spy="scroll" data-coreui-target="#list-example" data-coreui-offset="0" class="scrollspy-example" tabindex="0">
  <h4 id="list-item-1">Öğe 1</h4>
  <p>...</p>
  <h4 id="list-item-2">Öğe 2</h4>
  <p>...</p>
  <h4 id="list-item-3">Öğe 3</h4>
  <p>...</p>
  <h4 id="list-item-4">Öğe 4</h4>
  <p>...</p>
</div>
```

## Kullanım

:::info
**Bootstrap Uyumluluğu:** Aşağıda, scrollspy'nin temel uygulamasını bulabilirsiniz.
:::

### Veri özellikleri ile

Üst çubuk navigasyonunuza scrollspy davranışını kolayca eklemek için, gözlemlemek istediğiniz elemana `data-coreui-spy="scroll"` ekleyin (genellikle bu `` olacaktır). Ardından herhangi bir Bootstrap `.nav` bileşeninin ebeveyn elementinin ID'sini veya sınıfını `data-coreui-target` özelliği ile ekleyin.

```css
body {
  position: relative;
}
```

```html
<body data-coreui-spy="scroll" data-coreui-target="#navbar-example">
  ...
  <div id="navbar-example">
    <ul class="nav nav-tabs" role="tablist">
      ...
    </ul>
  </div>
  ...
</body>
```

### JavaScript ile

CSS'inizde `position: relative;` ekledikten sonra, JavaScript ile scrollspy'yi çağırın:

```js
const scrollSpy = new coreui.ScrollSpy(document.body, {
  target: '#navbar-example'
})
```

### Seçenekler




| İsim  | Tür   | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `rootMargin` | string | `0px 0px -25%` | Kaydırma konumunu hesaplamak için Intersection Observer [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) geçerli birimler. |
| `smoothScroll` | boolean | `false` | Kullanıcı scrollspy gözlemlerine atıfta bulunan bir bağlantıya tıkladığında düzgün kaydırma sağlar. |
| `target` | string, DOM elementi | `null`  | Scrollspy eklentisinin uygulanacağı elementi belirtir. |
:::warning
**Kaldırılan Seçenekler:** v5.1.3'e kadar `offset` & `method` seçeneklerini kullanıyorduk, bu seçenekler artık kaldırıldı ve `rootMargin` ile değiştirildi. 
Geriye dönük uyumluluğu sağlamak için, verilen bir `offset` değerini `rootMargin` olarak işlemeye devam edeceğiz, ancak bu özellik **v6**'da kaldırılacaktır.
:::

### Metotlar


| Metot | Açıklama |
| --- | --- |
| `dispose` | Bir öğenin scrollspy'sini yok eder. (DOM elemanında depolanan verileri kaldırır) |
| `getInstance` | Bir DOM elementi ile ilişkili scrollspy örneğini almak için *Statik* metod |
| `getOrCreateInstance` | Bir DOM elementi ile ilişkili scrollspy örneğini almak veya henüz başlatılmadıysa yeni bir tane oluşturmak için *Statik* metod. |
| `refresh` | DOM'a eleman eklerken veya çıkarırken, yenileme metodunu çağırmanız gerekir. |
Bir yenileme metodunu kullanan bir örnek:

```js
const dataSpyList = document.querySelectorAll('[data-coreui-spy="scroll"]')
dataSpyList.forEach(dataSpyEl => {
  coreui.ScrollSpy.getInstance(dataSpyEl).refresh()
})
```

### Olaylar


| Olay | Açıklama |
| --- | --- |
| `activate.coreui.scrollspy` | Bu olay, scrollspy tarafından bir sinkron aktivasyonu gerçekleştiğinde kaydırma elementi üzerinde tetiklenir. |
```js
const firstScrollSpyEl = document.querySelector('[data-coreui-spy="scroll"]')
firstScrollSpyEl.addEventListener('activate.coreui.scrollspy', () => {
  // bir şey yap...
})
```