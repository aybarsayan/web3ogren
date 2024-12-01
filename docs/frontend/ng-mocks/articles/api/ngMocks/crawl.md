---
title: ngMocks.crawl
description: ngMocks.crawl hakkında ng-mocks kütüphanesinden belgeler. Bu işlev, `DebugNode` veya `DebugElement` üzerinde dolaşarak özel bir geri çağırma işlevi ile kullanılmaktadır. Özellikle `ng-container` ve `ng-template` yapıları için uygun bir araçtır.
keywords: [ngMocks, DebugNode, DebugElement, Angular, ng-container, callback, metin düğümleri]
---

`ngMocks.crawl`, geçirilen `DebugNode` veya `DebugElement` üzerinde dolaşan özel bir işlevdir, `ng-container` ve `ng-template` yapılarını gözetir ve her bir öğe üzerinde bir geri çağırma işlevi çağırır.

:::info
`ngMocks.crawl`, istenen öğeleri ve örnekleri fixture'lar içinde arayan işlevler tarafından dahili olarak kullanılmaktadır. Bunu kullanmaktansa, bunlardan birini kullanmak daha iyidir.
:::

`ngMocks.crawl`, `ng-mocks` ile kapsanmayan bazı sıradışı seçiciler oluşturmak için bir araç sağlamak amacıyla paylaşılan API'de bulunmaktadır.

İşlev, ilk parametre olarak bir `DebugNode` veya `DebugElement` alır, ve ikinci parametre olarak bir geri çağırma alır. Eğer geri çağırma `true` dönerse, o zaman `ngMocks.crawl` durur. Geri çağırma 2 parametre alır, birincisi mevcut `node` ve ikincisi var ise onun `parent`'ıdır.

`#text` düğümlerini dahil etmeniz gerektiği durumlar için özel bir 3. parametre vardır. Varsayılan olarak atlanırlar, çünkü farklı angular sürümleri aynı şablon için farklı sayıda metin düğümü üretmektedir.

```ts
ngMocks.crawl(debugElement, callback, textNodes);
```

ya da `ngMocks.find` tarafından desteklenen seçicilerle basitçe.

```ts
ngMocks.crawl('div.root', callback, textNodes);
```

## Örnek: ilk div

Basit bir örnek, nasıl bir div öğesi bulabileceğimizi gösterir. `fixture`'ın kök öğeye işaret ettiğini varsayalım.

```html
<section>
  <div>hello</div>
</section>
```

Daha sonra geri çağırmada `nodeName`'i kontrol edebiliriz.

```ts
// ilk div'i arar
ngMocks.crawl(
  fixture.debugElement,
  node => {
    if (node.nativeNode.nodeName === 'DIV') {
      // bir şey yap ve yürümeyi durdur
      return true;
    }
  },
);
```

## Örnek: ng-container'ın doğrudan çocukları

İlk `ng-container`'ın tüm çocuk öğelerini almak istediğimizi varsayalım, ve `fixture` kök öğeye işaret ediyor.

```html
<ng-container>
  <div>1</div>
  <div>2</div>
</ng-container>
<ng-container>
  <div>3</div>
  <div>4</div>
</ng-container>
```

Daha sonra geri çağırmada `ng-container`'ı bulabiliriz ve ardından çocuklarını.

```ts
// ilk ng-container'ı bulalım
let ngContainer: any;
ngMocks.crawl(
  fixture.debugElement,
  (node, parent) => {
    // ng-container ilk öğe
    // fixture'ımızda
    if (parent === fixture.debugElement) {
        ngContainer = node;
        
        return true;
    }
  },
);

// div'lerini bulalım
const divs = [];
ngMocks.crawl(
  ngContainer,
  (node, parent) => {
    // aynı hikaye
    if (parent === ngContainer) {
      divs.push(node);
      // tüm div'leri almak için dönüş yok
    }
  },
);