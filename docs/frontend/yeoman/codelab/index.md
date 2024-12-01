---
description: Bu codelab'de, Yeoman ve FountainJS kullanarak sıfırdan bir web uygulaması oluşturmayı öğreneceksiniz. Adım adım yaklaşımımız sayesinde, uygulama geliştirme sürecini kolayca takip edebileceksiniz.
keywords: [Yeoman, web uygulaması, codelab, TodoMVC, FountainJS, JavaScript, uygulama geliştirme]
---

# Hadi Başlayalım!

Yazar: Mehdy Dara

Allo! Allo! Bu 25 dakikalık codelab'de, `Yeoman` ve FountainJS yardımıyla sıfırdan tam işlevsel bir web uygulaması oluşturacaksınız. Örnek uygulama [React](https://facebook.github.io/react/), [Angular2](https://angular.io/) veya [Angular1](https://angularjs.org/) ile yazılacak.

![Yeoman](../../images/cikti/yeoman/assets/img/yeoman-008.png)

:::tip
React veya Angular hakkında bilginiz yok mu? Sorun değil, size adım adım yol göstereceğiz. Ancak, bazı önceki JavaScript deneyiminiz olduğunu varsayıyoruz.
:::

## Bu örnek uygulamayı Yeoman ile oluşturun

Bugün oluşturacağınız örnek web uygulaması [TodoMVC](http://todomvc.com/) uygulamasının bir implementasyonu olacaktır. Todo ekleyebilecek, Todo silebilecek, Todo filtreleyebilecek ve birlikte Todo'ları çevrimdışı kaydetme özelliğini ekleyeceğiz.

![Tamamlanmış TodoMVC uygulaması](../../images/cikti/yeoman/assets/img/codelab/00_Finished_TodoMVC_app.png)

Bu codelab'de neler var?

Yukarıdaki TodoMVC uygulamasını sıfırdan inşa edeceğiz. Her adım bir öncekine bağlıdır, bu nedenle her adımı birer birer geçin.

- **Adım 1:** `Geliştirme ortamınızı ayarlayın `
- **Adım 2:** `Bir Yeoman generator'ü kurun `
- **Adım 3:** `Uygulamanızı oluşturmak için bir generator kullanın `
- **Adım 4:** `Yeoman tarafından oluşturulan uygulama dizin yapısını gözden geçirin `
- **Adım 5:** `Uygulamanızı tarayıcıda önizleyin `
- **Adım 6:** `Karma ve Jasmine ile testi gerçekleştirin `
- **Adım 7:** `Todo'ları yerel depolama ile kalıcı hale getirin `
- **Adım 8:** `Üretim için hazırlanın `
- Beğendiniz mi? `Yeoman daha fazlasını yapabilir `

:::info
Bu codelab'i tamamlamak yaklaşık 25 dakika sürecektir. Sonunda, şık bir TodoMVC uygulamanız olacak ve bilgisayarınız gelecekte daha harika web uygulamaları oluşturmak için hazır hale gelecek.
:::