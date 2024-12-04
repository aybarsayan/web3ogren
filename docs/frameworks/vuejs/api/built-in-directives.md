---
title: Yerleşik Yönergeler
seoTitle: Yerleşik Yönergeler - Vue.js
sidebar_position: 1
description: Bu belge, Vue.jsin temel yönergelerini kapsamaktadır. v-text, v-html, v-show gibi direktiflerin kullanımı hakkında bilgi sağlar.
tags: 
  - Vue.js
  - direktifler
  - JavaScript
keywords: 
  - Vue
  - v-text
  - v-html
  - v-show
  - v-if
---
## v-text {#v-text}

Elementin metin içeriğini güncelleyiniz.

- **Beklentiler:** `string`

- **Ayrıntılar**

  `v-text`, elemanın [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) özelliğini ayarlayarak çalışır. Bu nedenle elemanın içindeki mevcut içeriği geçersiz kılacaktır. Eğer `textContent`'ın bir bölümünü güncellemeniz gerekiyorsa, bunun yerine `mustache interpolasyonları` kullanmalısınız.

- **Örnek**

  ```vue-html
  <span v-text="msg"></span>
  <!-- aynı -->
  <span>{{msg}}</span>
  ```

- **Ayrıca bakınız:** [Şablon Söz Dizimi - Metin İçi](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)