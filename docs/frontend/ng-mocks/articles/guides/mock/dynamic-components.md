---
title: Dinamik Bir Bileşeni Nasıl Taklit Edilir
description: Angular dinamik bileşeninin taklit edilmesi ile ilgili bir kılavuz. Bu içerikte, dinamik bileşenlerin nasıl oluşturulacağı ve unit testlerde taklit edilmesi üzerine bilgiler sunulmaktadır. 
keywords: [Angular, dinamik bileşen, taklit, ng-mocks, ViewContainerRef, MockBuilder]
sidebar_label: Dinamik Bileşenler
---

Angular, bileşenleri dinamik olarak nasıl oluşturacağını tanıttı.  
Artık `ViewContainerRef.createComponent(DynamicComponent)` ile gerçekleştirilmesi mümkündür,  
dinamik bileşenleri oluşturan bileşenler genellikle şöyle görünür:

```ts
@Component({
  standalone: true,
  selector: 'main',
  template: '',
})
export class MainComponent implements OnInit {
  // Görünüm konteynerini yönetmek için ViewContainerRef gereklidir
  constructor(public readonly containerRef: ViewContainerRef) {}

  async ngOnInit() {
    // DynamicComponent'ı yükleme 
    const { DynamicComponent } = await import('./dynamic.component');
    
    // DynamicComponent'ı render etme
    this.containerRef.createComponent(DynamicComponent);
  }
}
```

Unit testlerde, geliştiricilerin `DynamicComponent`'ı taklit etmesi gerekebilir,  
bu da testlerin hafifletilmesine yardımcı olur.  
Amaçları, `MainComponent`'ın belirli şartlar altında `DynamicComponent`'ı oluşturduğunu doğrulamak  
ve `DynamicComponent`'ın arka planda ne yaptığını bastırmaktır. 

Bu, `ng-mocks` ve `MockBuilder` yardımıyla sağlanabilir,  
basitçe `DynamicComponent`'ı taklit bağımlılığı olarak geçirin:

```ts
beforeEach(() => MockBuilder(MainComponent, DynamicComponent));
```

Bu durumda, `ng-mocks` `DynamicComponent`'ı taklit edecek ve onun stub'ını render edecektir.

:::tip
`ng-mocks`, `ViewContainerRef.createComponent()` çağrısını, `import()` değil, engeller.
:::


## Dinamik Bileşenleri Taklit Etme Örneği

```ts
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { isMockOf, MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { DynamicComponent } from './dynamic.component';

@Component({
  standalone: true,
  selector: 'main',
  template: '',
})
class MainComponent implements OnInit {
  // Görünüm konteynerini yönetmek için ViewContainerRef gereklidir
  constructor(public readonly containerRef: ViewContainerRef) {}

  async ngOnInit() {
    // DynamicComponent'ı yükleme 
    const { DynamicComponent } = await import('./dynamic.component');
    
    // DynamicComponent'ı render etme
    this.containerRef.createComponent(DynamicComponent);
  }
}

describe('suite', () => {
  beforeEach(() => MockBuilder(MainComponent, DynamicComponent));

  it('lazy bileşeni bir taklit olarak yükler', async () => {
    // MainComponent'i yükleme ve başlatılmasını bekleme
    const fixture = MockRender(MainComponent);
    await fixture.whenStable();
    
    // DynamicComponent'ın render edildiğini doğrulama
    const el = ngMocks.find(DynamicComponent, undefined);
    expect(el).toBeDefined();
  });
});
```