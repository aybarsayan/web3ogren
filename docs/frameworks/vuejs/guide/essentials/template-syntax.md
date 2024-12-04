---
title: Şablon Söz Dizimi
seoTitle: Vue Şablon Söz Dizimi
sidebar_position: 4
description: Vue, render edilen DOMu temel bileşen örneğinin verilerine açıklayıcı bir şekilde bağlamanıza izin veren HTML tabanlı bir şablon söz dizimi kullanmaktadır. Bu döküman, Vue şablonlarının yapısını ve verileri nasıl bağlayabileceğinizi açıklamaktadır.
tags: 
  - Vue
  - şablon söz dizimi
  - JavaScript
  - reaktiflik
  - bileşenler
keywords: 
  - Vue
  - template syntax
  - JavaScript
  - reactivity
  - components
---
## Şablon Söz Dizimi {#template-syntax}

Vue, render edilen DOM'u temel bileşen örneğinin verilerine açıklayıcı bir şekilde bağlamanıza izin veren HTML tabanlı bir şablon söz dizimi kullanır. Tüm Vue şablonları, standartlara uygun tarayıcılar ve HTML ayrıştırıcıları tarafından ayrıştırılabilen sözdizimsel olarak geçerli HTML'dir.

Arka planda, Vue şablonları yüksek verimlilikte optimize edilmiş JavaScript koduna derlenir. Reaktiflik sistemi ile birleştirildiğinde, Vue uygulama durumu değiştiğinde yeniden rendere edilmesi gereken bileşenlerin minimum sayısını akıllıca belirleyebilir ve minimum DOM manipülasyonunu uygulayabilir.

> Eğer sanal DOM kavramlarına aşina iseniz ve JavaScript'in hammadde gücünü tercih ediyorsanız, `şablonlar yerine doğrudan render işlevleri yazabilirsiniz`, isteğe bağlı JSX desteği ile. Ancak, şablonlar gibi derleme zamanı optimizasyonlarından yararlanmadığını unutmayın.

## Metin Entegrasyonu {#text-interpolation}

Veri bağlamanın en temel şekli, "Mustache" söz dizimi (çift süslü parantezler) kullanarak yapılan metin entegrasyonudur:

```vue-html
<span>Mesaj: {{ msg }}</span>
```

Mustache etiketi, `msg` özelliğinin değerine `ilişkili bileşen örneğinden` değiştirilir. `msg` özelliği her değiştiğinde güncellenir.

## Ham HTML {#raw-html}

Çift süslü parantezler, veriyi düz metin olarak yorumlar, HTML olarak değil. Gerçek HTML çıkışı almak için `v-html` yönergesini` kullanmanız gerekir:

```vue-html
<p>Metin entegrasyonu ile: {{ rawHtml }}</p>
<p>v-html yönergesi ile: <span v-html="rawHtml"></span></p>
```


  const rawHtml = 'Bu kırmızı olmalıdır.'



  Metin entegrasyonu ile: {{ rawHtml }}
  v-html yönergesi ile: 


Burada yeni bir şeyle karşılaşıyoruz. Gördüğünüz `v-html` nitelik **yönerge** olarak adlandırılır. Yönergeler, Vue tarafından sağlanan özel nitelikler olduklarını belirtmek için `v-` ile başlar ve tahmin edebileceğiniz gibi, render edilen DOM'a özel reaktif davranışlar uygular. Burada, "bu öğenin iç HTML'sini, mevcut aktif örnekteki `rawHtml` özelliği ile güncel tut" diyoruz.

:::warning Güvenlik Uyarısı
Web sitenizde rastgele HTML render etmek çok tehlikeli olabilir çünkü bu kolayca [XSS açıklarına](https://en.wikipedia.org/wiki/Cross-site_scripting) yol açabilir. `v-html`'i yalnızca güvenilir içerikte kullanın ve **asla** kullanıcı tarafından sağlanan içerikte kullanmayın.
:::

## Özellik Bağlamaları {#attribute-bindings}

Mustache'ler HTML nitelikleri içinde kullanılamaz. Bunun yerine, `v-bind` yönergesini` kullanın:

```vue-html
<div v-bind:id="dynamicId"></div>
```

`v-bind` yönergesi, Vue'ya öğenin `id` niteliğini bileşenin `dynamicId` özelliğiyle senkronize tutmasını talimatını verir. Bağlı değer `null` veya `undefined` ise, nitelik render edilen öğeden kaldırılır.

### Kısa Yol {#shorthand}

`v-bind` sıkça kullanıldığı için, ona özel bir kısayol söz dizimi vardır:

```vue-html
<div :id="dynamicId"></div>
```

Başında `:` olan nitelikler normal HTML'den biraz farklı görünebilir, ancak aslında nitelik adları için geçerli bir karakterdir ve tüm Vue destekli tarayıcılar bunu doğru bir şekilde ayrıştırabilir. Ayrıca, son render edilme işaretinde görünmezler. Kısa yol söz dizimi isteğe bağlıdır, ancak kullanımını öğrendikçe bunu takdir edeceksiniz.

> Kılavuzun geri kalanında, bu **en yaygın kullanım** olduğu için kod örneklerinde kısa yol söz dizimini kullanacağız.

### Aynı İsim Kısayolu {#same-name-shorthand}

- Sadece 3.4+ sürümlerinde desteklenmektedir.

Eğer nitelik, bağlanmış JavaScript değeriyle aynı ada sahipse, söz dizimi nitelik değerini atlamaya kadar daha da kısaltılabilir:

```vue-html
<!-- :id="id" ile aynı -->
<div :id></div>

<!-- bu da işe yarar -->
<div v-bind:id></div>
```

Bu, JavaScript'te nesneleri tanımlarken kullanılan özellik kısayolu söz dizimi ile benzerdir. Bu yalnızca Vue 3.4 ve üstü için mevcut olan bir özelliktir.

### Boolean Nitelikler {#boolean-attributes}

[Boolean nitelikler](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes), bir öğede varlıkları aracılığıyla doğru / yanlış değerlerini gösterebilen niteliklerdir. Örneğin, [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) en yaygın kullanılan boolean niteliklerinden biridir.

`v-bind` bu durumda biraz farklı çalışır:

```vue-html
<button :disabled="isButtonDisabled">Düğme</button>
```

`disabled` niteliği, `isButtonDisabled` 'ın [doğru bir değeri](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) varsa dahil edilecektir. Ayrıca değer boş bir dize ise, `` ile tutarlılığı koruyarak dahil edilecektir. Diğer [yanlış değerler](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) için nitelik kaldırılacaktır.

### Birden Fazla Özelliği Dinamik Bağlama {#dynamically-binding-multiple-attributes}

Bir JavaScript nesneniz varsa ve bu nesne birden fazla niteliği temsil ediyorsa şu şekilde görünebilir:



```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```




```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```



Bunları tek bir öğeye bağlamak için `v-bind`'i argüman olmadan kullanabilirsiniz:

```vue-html
<div v-bind="objectOfAttrs"></div>
```

## JavaScript İfadelerini Kullanma {#using-javascript-expressions}

Şu ana kadar şablonlarımızda yalnızca basit özellik anahtarlarına bağlandık. Ancak Vue, tüm veri bağlamaları içerisinde JavaScript ifadelerinin tam gücünü destekler:

```vue-html
{{ number + 1 }}

{{ ok ? 'EVET' : 'HAYIR' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

Bu ifadeler, mevcut bileşen örneğinin veri kapsamı içinde JavaScript olarak değerlendirilecektir.

Vue şablonlarında, JavaScript ifadeleri aşağıdaki konumlarda kullanılabilir:

- Metin entegrasyonları içinde (mustaches)
- Herhangi bir Vue yönergesinin nitelik değerinde (v- ile başlayan özel nitelikler)

### Sadece İfadeler {#expressions-only}

Her bir bağlama yalnızca **tek bir ifade** içerebilir. Bir ifade, bir değere değerlendirilmesi mümkün olan bir kod parçasıdır. Basit bir kontrol, `return` ifadesinden sonra kullanılıp kullanılamayacağını kontrol etmektir.

Bu nedenle, aşağıdakiler **çalışmayacaktır**:

```vue-html
<!-- bu bir ifade değil, bir ifadedir: -->
{{ var a = 1 }}

<!-- akış kontrolü de çalışmayacaktır, üçlü ifadeler kullanın -->
{{ if (ok) { return message } }}
```

### Fonksiyon Çağırma {#calling-functions}

Bir bileşen tarafından sunulan bir yöntemi bir bağlama ifadesi içinde çağırmak mümkündür:

```vue-html
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

:::tip
Bağlama ifadeleri içinde çağrılan fonksiyonlar her bileşen güncellendiğinde çağrılacaktır, bu nedenle veri değiştirmek veya asenkron işlemleri tetiklemek gibi yan etkileri **olmamalıdır**.
:::

### Kısıtlı Global Erişimi {#restricted-globals-access}

Şablon ifadeleri sandıktadır ve yalnızca [kısıtlı bir global listesine](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3) erişimi vardır. Bu liste, `Math` ve `Date` gibi yaygın olarak kullanılan yerleşik global değişkenleri açığa çıkarır.

Listede açıkça yer almayan global değişkenler, örneğin `window` üzerindeki kullanıcı tarafından eklenmiş özellikler erişilemez. Ancak, tüm Vue ifadeleri için ek global tanımlamak istiyorsanız, bunları `app.config.globalProperties` ekleyerek tanımlayabilirsiniz.

## Yönergeler {#directives}

Yönergeler, `v-` ön ekine sahip özel niteliklerdir. Vue, yukarıda tanıttığımız `v-html` ve `v-bind` dahil olmak üzere birçok `yerleşik yönergeyi` sağlar.

Yönerge nitelik değerlerinin, ifadelerin değiştiğinde DOM'ye reaktif olarak güncellemeler uygulamak için tek JavaScript ifadeleri içermesi beklenir ( `v-for`, `v-on` ve `v-slot`'un istisnası vardır; bunlar kendi bölümlerinde daha sonra tartışılacaktır). Örneğin `v-if` yörüngesini alalım:

```vue-html
<p v-if="seen">Şimdi beni görüyor musun</p>
```

Burada, `v-if` yönergesi, `seen` ifadesinin değerinin doğruluğuna dayalı olarak `` öğesini kaldıracak veya ekleyecektir.

### Argümanlar {#arguments}

Bazı yönergeler bir "argüman" alabilir, bu da yönerge adının sonrasında bir iki nokta üst üste ile belirtilir. Örneğin, `v-bind` yönergesi bir HTML niteliğini reaktif bir şekilde güncellemek için kullanılır:

```vue-html
<a v-bind:href="url"> ... </a>

<!-- kısayol -->
<a :href="url"> ... </a>
```

Burada, `href` argümandır, bu da `v-bind` yönergesine öğenin `href` niteliğini `url` ifadesinin değerine bağlamasını söyler. Kısayolda, argümandan önceki her şey (yani `v-bind:`) tek bir karakter olan `:` ile birleştirilir.

Başka bir örnek `v-on` yönergesidir, bu da DOM olaylarını dinler:

```vue-html
<a v-on:click="doSomething"> ... </a>

<!-- kısayol -->
<a @click="doSomething"> ... </a>
```

Burada, argüman dinlenecek olay adıdır: `click`. `v-on` için karşılık gelen bir kısayol, `@` karakteridir. Olay işleme hakkında daha fazla ayrıntıya daha sonra değineceğiz.

### Dinamik Argümanlar {#dynamic-arguments}

Bir yönerge argümanında bir JavaScript ifadesi kullanmak da mümkündür, bunu köşeli parantezlerle sararak yapabilirsiniz:

```vue-html
<!--
Argüman ifadesinde bazı kısıtlamalar vardır,
"Dinamik Argüman Değeri Kısıtlamaları" ve "Dinamik Argüman Sözdizimi Kısıtlamaları" bölümlerinde açıklandığı gibi.
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- kısayol -->
<a :[attributeName]="url"> ... </a>
```

Burada, `attributeName`, bir JavaScript ifadesi olarak dinamik olarak değerlendirilecektir ve değerlendirilen değeri argümanın son değeri olarak kullanılacaktır. Örneğin, bileşen örneğinizde `attributeName` adında bir veri özelliği varsa ve değeri `"href"` ise, bu bağlama `v-bind:href` ile eşdeğerdir.

Benzer şekilde, dinamik argümanları dinamik bir olay adına bir işleyici bağlamak için kullanabilirsiniz:

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- kısayol -->
<a @[eventName]="doSomething"> ... </a>
```

Bu örnekte, `eventName`'in değeri `"focus"` olduğunda, `v-on:[eventName]` `v-on:focus` ile eşdeğer olacaktır.

#### Dinamik Argüman Değeri Kısıtlamaları {#dynamic-argument-value-constraints}

Dinamik argümanların bir dize olarak değerlendirilmesi beklenirken, `null` istisnası vardır. Özel değer `null`, bağlamayı açıkça kaldırmak için kullanılabilir. Herhangi bir başka dize olmayan değer bir uyarıyı tetikleyecektir.

#### Dinamik Argüman Sözdizimi Kısıtlamaları {#dynamic-argument-syntax-constraints}

Dinamik argüman ifadelerinin bazı sözdizim kısıtlamaları vardır çünkü belirli karakterler, boşluklar ve alıntılar gibi, HTML nitelik adları içinde geçersizdir. Örneğin, aşağıdaki geçersiz olacaktır:

```vue-html
<!-- Bu bir derleyici uyarısı tetikleyecektir. -->
<a :['foo' + bar]="value"> ... </a>
```

Karmaşık bir dinamik argüman geçmesi gerekiyorsa, muhtemelen daha iyi bir yol, yakında ele alacağımız `hesaplanan bir özellik` kullanmaktır.

DOM içi şablonlar kullanırken (bir HTML dosyasına doğrudan yazılan şablonlar), büyük karakterlerle anahtar isimlendirmekten de kaçınmalısınız, çünkü tarayıcılar nitelik adlarını küçük harfe dönüştürecektir:

```vue-html
<a :[someAttr]="value"> ... </a>
```

Yukarıdaki, DOM içi şablonlarda `:[someattr]`'a dönüştürülecektir. Eğer bileşeninizde `someAttr` özelliği yerine `someattr` varsa, kodunuz çalışmayacaktır. Tek Dosya Bileşenleri içindeki şablonlar bu kısıtlamaya tabi değildir.

### Modifikatörler {#modifiers}

Modifikatörler, bir nokta ile belirtilen özel son eklerdir ve bir yönergenin özel bir şekilde bağlanması gerektiğini gösterir. Örneğin, `.prevent` modifikatörü, `v-on` yönergesine tetiklenen olay üzerinde `event.preventDefault()` çağrısını yapmasını söyler:

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

Diğer modifikatör örneklerini daha sonra göreceksiniz, `v-on` ve `v-model` için, bu özellikleri keşfetmeye başladığımızda.

Ve nihayet, işte tam yönerge sözdizimi görselleştirilmiş olarak:

![yönerge sözdizimi grafiği](../../../images/frameworks/vuejs/guide/essentials/images/directive.png)