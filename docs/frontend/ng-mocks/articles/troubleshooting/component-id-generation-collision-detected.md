---
title: 'Bileşen ID oluşum çakışmasını nasıl düzeltebilirim'
description: Bu belgede, Angular 16'dan itibaren bileşenler için tutarlı ID'ler oluşturma sürecinde ortaya çıkabilecek çakışmalar ve bunları nasıl düzeltebileceğiniz hakkında bilgi verilmektedir. Çeşitli yöntemler kullanılarak bu çakışmaların nasıl önlenebileceği ele alınmaktadır.
keywords: [Angular, bileşen ID, çakışma çözümü, Component, host özelliği]
---

Angular 16'dan itibaren, framework [bileşenler için tutarlı ID'ler oluşturmayı](https://github.com/angular/angular/commit/0e5f9ba6f427a79a0b741c1780cd2ff72cc3100a#diff-4374dd238deae3e4714315fc97bb9983092ada87475d8e0b8d28e191571941deR668) deniyor. Ancak, süsleyici ve bileşen sınıfı aynı görünüyorsa bir çakışma meydana gelebilir.

Örneğin, aşağıdaki kod 2 farklı sınıf içeriyor ve bu, benzerlikleri nedeniyle bir **çakışmaya** neden olacaktır. Bir bileşeni bir mock ve boş bir şablon ile değiştirmek istediğimizde bu kolayca tekrar üretilebilir:

```ts
@Component({
  selector: 'target',
  template: 'complex-template',
})
class TargetComponent {}

@Component({
  selector: 'target',
  template: 'empty-template',
})
class MockTargetComponent {}
```

:::warning Hata fırlatır
Bileşen ID oluşum çakışması tespit edildi. 'Target1Component' ve 'MockTarget1Component' bileşenleri ile 'target' seçici için aynı bileşen ID'si oluşturuldu. Bunu düzeltmek için, bu bileşenlerden birinin seçicisini değiştirebilir veya farklı bir ID zorlamak için ekstra bir host niteliği ekleyebilirsiniz.
:::

## Önerilen düzeltme

Hatanın önerdiği gibi, çakışmayı düzeltmek için **eşsiz bir host niteliği ekleyebiliriz**. Bunun için, `@Component` süsleyicisinin `host` özelliğini eşsiz bir değer ile kullanmalıyız. Örneğin, sınıfın adını kullanabiliriz:

```ts
@Component({
  selector: 'target',
  template: 'complex-template',
  host: {'collision-id': 'Target1Component'},
})
export class Target1Component {}

@Component({
  selector: 'target',
  template: 'empty-template',
  host: {'collision-id': 'MockTarget1Component'},
})
export class MockTarget1Component {}
```

:::note Rastgele sayı üreticileri kullanmayın
Bileşen ID'sinin fikri, herhangi bir koşulda aynı bileşeni temsil etmektir: ithalatlarındaki konumuna veya diğer faktörlere rağmen. Bu nedenle, Bileşen ID'si tahmin edilebilir olmalıdır. Lütfen, `Math.random()` gibi rastgele sayı üreticileri kullanmayın.
:::

### Alternatif düzeltme

`host` yaklaşımını beğenmiyorsanız, **Bileşen ID çakışmasını önlemek için eşsiz bir ada sahip bir stub yöntemi ekleyebilirsiniz**. Örneğin, mock sınıfında `avoidCollisionMockTarget1` ekleyebiliriz:

```ts
@Component({
  selector: 'target',
  template: 'complex-template',
})
export class Target1Component {}

@Component({
  selector: 'target',
  template: 'empty-template',
})
export class MockTarget1Component {
  public avoidCollisionMockTarget1() {}
}
```

Ve bu, Bileşen ID çakışmasını düzeltecektir.