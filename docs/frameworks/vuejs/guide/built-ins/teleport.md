---
title: Teleport
seoTitle: Vue.js Teleport - Rendering Components Outside the DOM Hierarchy
sidebar_position: 4
description:  is a built-in component that allows you to render a part of a components template outside of its DOM hierarchy. This article explores its usage, examples, and best practices.
tags: 
  - Vue.js
  - Teleport
  - Components
  - Modals
  - Frontend Development
keywords: 
  - teleport
  - vue
  - components
  - modals
  - frontend
---
## Teleport {#teleport}



`` bir bileşenin şablonunun bir kısmını, o bileşenin DOM hiyerarşisinin dışında var olan bir DOM düğümüne "teleport" etmemizi sağlayan yerleşik bir bileşendir.

## Temel Kullanım {#basic-usage}

Zaman zaman aşağıdaki senaryo ile karşılaşabiliriz: bir bileşenin şablonunun bir kısmı mantıken ona aittir, ancak görsel açıdan, DOM'da başka bir yerde, Vue uygulamasının dışında görüntülenmesi gerekir.

Bunun en yaygın örneği tam ekran modali oluşturmadır. İdeal olarak, modanın düğmesinin ve modanın kendisinin aynı bileşen içinde yaşamasını isteriz çünkü her ikisi de modanın açılma / kapanma durumu ile ilgilidir. Ancak bu, modanın düğme ile birlikte, uygulamanın DOM hiyerarşisinde derinlemesine yer alacağı anlamına gelir. Bu, CSS aracılığıyla modayı konumlandırırken bazı zorlu sorunlar yaratabilir.

Aşağıdaki HTML yapısını düşünün:

```vue-html
<div class="outer">
  <h3>Vue Teleport Örneği</h3>
  <div>
    <MyModal />
  </div>
</div>
```

Ve işte `` bileşeninin uygulanışı:



```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Modali Aç</button>

  <div v-if="open" class="modal">
    <p>Modaldan merhaba!</p>
    <button @click="open = false">Kapat</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```




```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Modali Aç</button>

  <div v-if="open" class="modal">
    <p>Modaldan merhaba!</p>
    <button @click="open = false">Kapat</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```



Bileşen, modalın açılmasını tetikleyen bir `` ve modalın içeriğini içerecek olan ve kendisini kapatma düğmesi bulunan `.modal` sınıfına sahip bir `` içerir.

Bu bileşeni başlangıç HTML yapısının içine kullandığımızda, bazı potansiyel sorunlar vardır:

- `position: fixed` yalnızca hiçbir ata elementi `transform`, `perspective` veya `filter` özelliği ayarlı değilse, öğeyi görünüm alanına göre yerleştirir. Örneğin, eğer ata `` elementini bir CSS dönüşümü ile animasyon yapmayı planlıyorsak, modal düzeni bozulacaktır!

- Modanın `z-index`'i içerdiği öğeler tarafından kısıtlanır. Eğer `` ile üst üste binen ve daha yüksek bir `z-index`'e sahip başka bir öğe varsa, bu modalımızın üzerine gelebilir.

`` bize, iç içe geçmiş DOM yapısını aşmak için temiz bir yol sağlar. ``'i `` kullanacak şekilde değiştirelim:

```vue-html{3,8}
<button @click="open = true">Modali Aç</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Modaldan merhaba!</p>
    <button @click="open = false">Kapat</button>
  </div>
</Teleport>
```

``'in `to` hedefi bir CSS seçici dizesi veya gerçek bir DOM düğümü bekler. Burada, Vue'ya bu şablon parçasını **`body`** etiketine **"teleport"** etmesini bildiriyoruz.

Aşağıdaki düğmeye tıklayabilir ve tarayıcınızın geliştirici araçları aracılığıyla `` etiketini inceleyebilirsiniz:


  Modali Aç
  
    
      
        Modaldan merhaba!
        Kapat
      
    
  



.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}


`` ile birlikte `` kullanarak animasyonlu modallar oluşturabilirsiniz - `Burada Örnek`.

:::tip
`` bileşeni monte edildiğinde `to` hedefinin zaten DOM'da olması gerekir. İdeal olarak, bu, tüm Vue uygulamasının dışındaki bir öğe olmalıdır. Eğer Vue tarafından oluşturulan başka bir öğeyi hedefliyorsanız, ``'den önce o öğenin monte edildiğinden emin olmalısınız.
:::

## Bileşenlerle Kullanım {#using-with-components}

`` yalnızca render edilen DOM yapısını değiştirir - bileşenlerin mantıksal hiyerarşisini etkilemez. Yani, eğer `` bir bileşeni içeriyorsa, o bileşen, ``'i içeren ana bileşenin mantıksal çocuğu olarak kalır. Prop geçişleri ve olay yayılımı aynı şekilde çalışmaya devam eder.

Bu, bir üst bileşenden enjeksiyonların beklenildiği gibi çalıştığı ve alt bileşenin Vue Devtools'da ana bileşenin altında yer aldığı anlamına gelir, gerçekte içerik nereye taşındıysa oraya yerleştirilmez.

## Teleport'u Devre Dışı Bırakma {#disabling-teleport}

Bazı durumlarda, ``'i koşullu olarak devre dışı bırakmak isteyebiliriz. Örneğin, bir bileşeni masaüstü için bir örtü olarak, ancak mobilde çevrimiçi render etmek isteyebiliriz. `` dinamik olarak geçiştirilmiş `disabled` propunu destekler:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

`isMobile` durumu medya sorgusu değişikliklerini algılayarak dinamik olarak güncellenebilir.

## Aynı Hedefte Birden Fazla Teleport {#multiple-teleports-on-the-same-target}

Yaygın bir kullanım durumu, aynı anda birden fazla örneğin etkin olabileceği yeniden kullanılabilir bir `` bileşenidir. Bu tür bir senaryoda, birden çok `` bileşeni içeriğini aynı hedef öğeye monte edebilir. Sıralama basit bir ekleme şeklinde olacaktır - sonrakiler, hedef öğedeki öncekilerin arkasında yer alacaktır.

Aşağıdaki kullanımı göz önünde bulunduralım:

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

Render edilen sonuç şu şekilde olacaktır:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## Ertelenmiş Teleport  {#deferred-teleport}

Vue 3.5 ve üstünde, bir Teleport'un hedefini uygulamanın diğer kısımları monte edilene kadar ertelemek için `defer` propunu kullanabiliriz. Bu, Teleport'un Vue tarafından render edilen bir kapsayıcı öğeyi hedef almasına izin verir, ancak bileşen ağacının daha ileriki bir bölümünde:

```vue-html
<Teleport defer to="#late-div">...</Teleport>

<!-- şablonun başka bir yerinde -->
<div id="late-div"></div>
```

Hedef öğenin Teleport ile aynı montaj / güncelleme tikinde render edilmesi gerektiğini unutmayın - yani, eğer `` yalnızca bir saniye sonra monte edilirse, Teleport hâlâ bir hata bildirir. Erteleme, `mounted` yaşam döngüsü kancasıyla benzer şekilde çalışır.