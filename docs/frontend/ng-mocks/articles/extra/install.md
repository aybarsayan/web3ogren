---
title: ng-mocks nasıl kuruluru
description: ng-mocks için kurulum talimatları. Bu kılavuzda ng-mocks kütüphanesinin Angular projelerine nasıl entegre edileceği ve özel ayarların nasıl yapılacağı detaylı bir şekilde açıklanmaktadır.
keywords: [ng-mocks, Angular, test, mock, yapılandırma]
---

**Herhangi bir** Angular 5+ **projesinde** `ng-mocks`'ın **en son sürümünü** kullanabilirsiniz. Bunu basitçe bir geliştirme bağımlılığı olarak kurun.

```bash npm2yarn
npm install ng-mocks --save-dev
```

## Varsayılan özelleştirmeler

Tüm testler için küresel olarak yapılandırmanız gereken birkaç şey vardır:

- Varsayılan mock'ların farklı stratejiler (soyut sınıflar) için nasıl görüneceği.
- Tüm mock yöntemlerine otomatik olarak spy ekleme.

:::tip
Mock beyanları içinde tüm yöntemler, alıcılar ve ayarlayıcılar için `oto spy` yapılandırmak yararlı olabilir.
:::

`oto spy` dışında, mock davranışını `MockInstance` aracılığıyla özelleştirmek isteyebiliriz. 

Aşağıdaki kodu `src/test.ts` veya jest durumunda `src/setup-jest.ts` / `src/test-setup.ts` dosyasına ekleyin ve ilgili blokları yorumlayın / yorumdan çıkarın:

```ts title="src/test.ts"
import { ngMocks } from 'ng-mocks'; // eslint-disable-line import/order

// oto spy
ngMocks.autoSpy('jasmine');
// jest durumunda
// ngMocks.autoSpy('jest');

// Eğer @angular/router ve Angular 14+ kullanıyorsanız.
// TitleStrategy için DefaultTitleStrategy'nin bir mock'unu ayarlamak isteyebilirsiniz.
// A14 düzeltmesi: DefaultTitleStrategy'yi TitleStrategy için varsayılan mock olarak ayarlamak
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router'; // eslint-disable-line import/order
import { MockService } from 'ng-mocks'; // eslint-disable-line import/order
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

// Genellikle, *ngIf ve CommonModule'dan diğer beyanların mock'lenmesi beklenmez.
// Aşağıdaki kod bunları korur.
import { CommonModule } from '@angular/common'; // eslint-disable-line import/order
import { ApplicationModule } from '@angular/core'; // eslint-disable-line import/order
import { BrowserModule } from '@angular/platform-browser'; // eslint-disable-line import/order
ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);

// jasmine ve jest <27 için otomatik geri yükleme
// declare const jasmine: any;
import { MockInstance } from 'ng-mocks'; // eslint-disable-line import/order
jasmine.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});
```

## Angular 15+’te `src/test.ts`'yi geri yükleme

Eğer Angular 15+ kullanıyorsanız, `src/test.ts` dosyasını bulamayabilirsiniz. Ancak, bu dosya testleriniz için küresel yapılandırma sağlamak için gereklidir.

:::info
Lütfen `src/test.ts`'yi geri yüklemek için bu [stackoverflow yanıtını](https://stackoverflow.com/a/75323651/13112018) kullanın.
:::

## Angular 15+’te `src/setup-jest.ts`'yi geri yükleme

Eğer Angular 15+ ve `@angular-builders/jest` kullanıyorsanız, `src/setup-jest.ts` dosyasını bulamayabilirsiniz. Bu dosya yoktur çünkü `@angular-builders/jest` kendi paketinde varsayılan yapılandırma sağlar.

Daha sonra, `angular.json`'u açın ve `"builder": "@angular-builders/jest:run"` kısmındaki `test` bölümüne aşağıdaki seçeneği ekleyin:

```json
"test": {
  "builder": "@angular-builders/jest:run",
  "options": {
    "setupFilesAfterEnv": "./src/setup-jest.ts" // <-- bu düzeltme
  }
},
```

Kar elde ettiniz, şimdi `ng-mocks` için varsayılanları yapılandırmak üzere `setup-jest.ts`'yi genişletebilirsiniz.