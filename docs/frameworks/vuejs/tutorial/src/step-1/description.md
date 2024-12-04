---
title: Başlarken
seoTitle: Vue Eğitimine Hoş Geldiniz
sidebar_position: 1
description: Bu eğitim, Vue ile çalışmanın temel bir deneyimini sunar ve başlangıç için gereken bilgileri kapsar. Temel HTML, CSS ve JavaScript bilgisi gerekmektedir.
tags: 
  - Vue
  - Eğitim
  - JavaScript
  - Frontend
keywords: 
  - Vue
  - Eğitim
  - JavaScript
  - Frontend
---
## Başlarken {#getting-started}

Vue eğitimine hoş geldiniz!

Bu eğitimin amacı, Vue ile çalışmanın neye benzediğine dair hızlı bir deneyim sunmaktır, doğrudan tarayıcıda. Tam kapsamlı olmak gibi bir amacı yoktur ve devam etmeden önce her şeyi anlamanız gerekmez. Bununla birlikte, bunu tamamladıktan sonra, her konuyu daha ayrıntılı olarak kapsayan Rehber'i okuduğunuzdan emin olun.

## Ön Koşullar {#prerequisites}

Eğitim, HTML, CSS ve JavaScript konusunda temel bir aşinalık varsayıyor. Eğer ön uç geliştirmeye tamamen yeniyseniz, ilk adım olarak doğrudan bir çerçeveye atlamak en iyi fikir olmayabilir - temelleri kavrayın, sonra geri dönün! Diğer çerçevelerle önceki deneyim yardımcı olur, ancak zorunlu değildir.

## Bu Eğitimi Nasıl Kullanılır {#how-to-use-this-tutorial}

Sağdaki  veya alttaki code'ları düzenleyebilir ve sonucu anında güncelleyebilirsiniz. Her adım, Vue'nun temel bir özelliğini tanıtacak ve demo'yu çalıştırmak için kodu tamamlamanız beklenecektir. Tıkandığınızda, size çalışan kodu gösteren "Göster!" butonu olacak. Buna çok fazla güvenmemeye çalışın - kendi başınıza bir şeyleri çözerek daha hızlı öğrenirsiniz.

Eğer Vue 2 veya diğer çerçevelerden gelen deneyimli bir geliştiriciyseniz, bu eğitimi en iyi şekilde kullanmak için ayarlamak üzere birkaç seçenek vardır. Eğer bir başlangıç iseniz, varsayılan ayarlarla devam etmeniz önerilir.


Eğitim Ayarları Hakkında Detaylar

- Vue, iki API stili sunar: Options API ve Composition API. Bu eğitim, her ikisiyle de çalışacak şekilde tasarlanmıştır - üstteki **API Tercihleri** anahtarlarını kullanarak tercih ettiğiniz stili seçebilirsiniz. API stilleri hakkında daha fazla bilgi edinin.

- Ayrıca SFC modu ve HTML modu arasında geçiş yapabilirsiniz. İlk olarak, en çok geliştiricilerin Vue ile bir derleme aşaması kullanırken kullandıkları Tek Dosya Bileşeni (SFC) formatında kod örnekleri gösterilecektir. HTML modu ise derleme aşamasız kullanımı göstermektedir.



:::tip
Kendi uygulamalarınızda derleme aşamasız HTML modu kullanmaya başlamak üzereyseniz, lütfen içe aktarımları şuna değiştirin:

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

scriptlerinizin içinde ya da derleme aracınızın `vue`'yu uygun şekilde çözmesini sağlamak için yapılandırın. [Vite](https://vitejs.dev/) için örnek yapılandırma:

```js
// vite.config.js
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

Daha fazla bilgi için ilgili `Tooling rehberindeki bölüme` bakın.
:::





Hazır mısınız? Başlamak için "İleri"ye tıklayın.