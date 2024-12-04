---
title: Yönlendirme
seoTitle: Yönlendirme - Vue.js
sidebar_position: 4
description: Bu bölümde, istemci tarafı ve sunucu tarafı yönlendirme hakkında bilgi verilmektedir. Ayrıca basit bir yönlendirme uygulaması yapılmaktadır.
tags: 
  - yönlendirme
  - Vue.js
  - SPA
  - Tarih API
  - hashchange
keywords: 
  - yönlendirme
  - Vue.js
  - SPA
  - Tarih API
  - hashchange
---
## Yönlendirme {#routing}

### İstemci Tarafı vs. Sunucu Tarafı Yönlendirme {#client-side-vs-server-side-routing}

Sunucu tarafında yönlendirme, sunucunun kullanıcının ziyaret ettiği URL yoluna göre bir yanıt gönderdiği anlamına gelir. Geleneksel bir sunucu tarafından render edilen web uygulamasında bir bağlantıya tıkladığımızda, tarayıcı sunucudan bir HTML yanıtı alır ve yeni HTML ile tüm sayfayı yeniden yükler.

Ancak bir [Tek Sayfa Uygulaması](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPA) durumunda, istemci tarafındaki JavaScript, gezinmeyi yakalayabilir, dinamik olarak yeni verileri alabilir ve mevcut sayfayı tam sayfa yeniden yüklemeleri olmadan güncelleyebilir. Bu genellikle, kullanıcıların uzun bir süre boyunca birçok etkileşimde bulunması beklenirken, daha gerçek "uygulama" benzeri kullanım durumlarında daha hızlı bir kullanıcı deneyimi ile sonuçlanır.

> Bu tür SPAlarda, "yönlendirme" tarayıcıda, istemci tarafında gerçekleştirilir. 
> — Vue.js Belgeleri

Bir istemci tarafı yönlendiricisi, [Tarih API](https://developer.mozilla.org/en-US/docs/Web/API/History) veya [`hashchange` olayı](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) gibi tarayıcı API'lerini kullanarak uygulamanın render edilmiş görünümünü yönetmekten sorumludur.

### Resmi Yönlendirici {#official-router}

:::info
Vue, SPAlar oluşturmak için iyi bir şekilde uyum sağlamaktadır. 
:::


  
    Vue School'da Ücretsiz Video Kursunu İzleyin
  


Çoğu SPA için, resmi olarak desteklenen [Vue Router kitaplığını](https://github.com/vuejs/router) kullanmanız önerilir. Daha fazla bilgi için Vue Router'ın [belgelerine](https://router.vuejs.org/) bakın.

### Sıfırdan Basit Yönlendirme {#simple-routing-from-scratch}

Sadece çok basit bir yönlendirmeye ihtiyacınız varsa ve tam özellikli bir yönlendirici kitaplığı kullanmak istemiyorsanız, bunu `Dinamik Bileşenler` ile yapabilir ve mevcut bileşen durumunu tarayıcıdaki [`hashchange` olaylarını](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) dinleyerek veya [Tarih API](https://developer.mozilla.org/en-US/docs/Web/API/History) kullanarak güncelleyebilirsiniz.

İşte yalın bir örnek:



```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Ana Sayfa</a> |
  <a href="#/about">Hakkında</a> |
  <a href="#/non-existent-path">Kırık Bağlantı</a>
  <component :is="currentView" />
</template>
```

[Oynamak için buraya tıklayın](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)





```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Ana Sayfa</a> |
  <a href="#/about">Hakkında</a> |
  <a href="#/non-existent-path">Kırık Bağlantı</a>
  <component :is="currentView" />
</template>
```

[Oynamak için buraya tıklayın](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)