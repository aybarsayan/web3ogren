---
title: Güvenlik
seoTitle: Vue Güvenlik Rehberi
sidebar_position: 1
description: Bu içerik, Vue uygulamalarında güvenlik açıklarını bildirme ve önleme konularında önemli bilgiler sunmaktadır. Ayrıca güvenlik en iyi uygulamaları ve potansiyel tehlikeleri ele alır.
tags: 
  - güvenlik
  - Vue
  - JavaScript
  - geliştirme
keywords: 
  - güvenlik açıkları
  - güvenlik kuralları
  - Vue.js
  - kullanıcı güvenliği
---
## Güvenlik {#security}

## Güvenlik Açıklarını Bildirme {#reporting-vulnerabilities}

Bir güvenlik açığı raporlandığında, hemen öncelikli konumuz haline gelir; bir tam zamanlı katkıda bulunucu her şeyi bırakıp buna çalışmaya başlar. Bir güvenlik açığını bildirmek için lütfen `security@vuejs.org` adresine e-posta gönderin.

Yeni güvenlik açıklarının keşfi nadir olsa da, uygulamanızın mümkün olduğunca güvenli kalmasını sağlamak için her zaman Vue ve resmi yardımcı kütüphanelerinin en son sürümlerini kullanmanızı öneririz.

## Kural No.1: Güvenilmeyen Şablonlar Kullanmamaya Dikkat Edin {#rule-no-1-never-use-non-trusted-templates}

:::warning
Vue kullanırken en temel güvenlik kuralı **güvenilmeyen içeriği bileşen şablonunuz olarak asla kullanmamaktır**. Bunu yapmak, uygulamanızda rastgele JavaScript'in çalışmasına izin vermekle eşdeğerdir ve daha da kötüsü, kod sunucu tarafında işlenirken sunucu ihlallerine yol açabilir.
:::

Böyle bir kullanımın bir örneği:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // ASLA BUNU YAPMAYIN
}).mount('#app')
```

Vue şablonları JavaScript'e derlenir ve şablonlar içindeki ifadeler, işleme sürecinin bir parçası olarak çalıştırılır. İfadeler belirli bir işleme bağlamında değerlendiriliyor olsa da, potansiyel küresel yürütme ortamlarının karmaşıklığı nedeniyle, bir çerçevenin (framework) sizi potansiyel kötü niyetli kod yürütmesinden tamamen koruması pratik değildir. Bu tür problemleri baştan savmak için en basit yol, Vue şablonlarınızın içeriğinin her zaman güvenilir ve tamamen sizin tarafınızdan kontrol edilen olmasını sağlamaktır.

## Vue'nun Sizi Korumak İçin Yaptıkları {#what-vue-does-to-protect-you}

### HTML içeriği {#html-content}

Şablonlar veya render fonksiyonları kullanırken, içerik otomatik olarak kaçırılır. Yani bu şablonda:

```vue-html
<h1>{{ userProvidedString }}</h1>
```

eğer `userProvidedString` içeriği:

```js
'<script>alert("hi")</script>'
```

şeklindeyse, şu HTML'e kaçırılacaktır:

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

böylece script enjeksiyonu engellenmiş olur. Bu kaçırma, `textContent` gibi yerel tarayıcı API'leri kullanılarak yapılır, bu nedenle bir güvenlik açığı yalnızca tarayıcının kendisi güvenli değilse mevcut olabilir.

### Özellik bağlamaları {#attribute-bindings}

Benzer şekilde, dinamik özellik bağlamaları da otomatik olarak kaçırılır. Yani bu şablonda:

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

eğer `userProvidedString` içeriği:

```js
'" onclick="alert(\'hi\')'
```

şeklindeyse, şu HTML'e kaçırılacaktır:

```vue-html
&quot; onclick=&quot;alert('hi')
```

böylece `title` niteliğinin kapatılması yeni, rastgele HTML enjeksiyonu yapmayı engeller. Bu kaçırma, `setAttribute` gibi yerel tarayıcı API'leri kullanılarak yapılır, bu nedenle bir güvenlik açığı yalnızca tarayıcının kendisi güvenli değilse mevcut olabilir.

## Potansiyel Tehlikeler {#potential-dangers}

Herhangi bir web uygulamasında, denetlenmemiş, kullanıcı tarafından sağlanan içeriğin HTML, CSS veya JavaScript olarak çalıştırılmasına izin vermek potansiyel olarak tehlikelidir; bu nedenle mümkün olduğunca kaçınılmalıdır. Ancak bazı zamanlarda belirli bir risk kabul edilebilir olabilir.

:::info
Örneğin, CodePen ve JSFiddle gibi hizmetler, kullanıcı tarafından sağlanan içeriğin çalıştırılmasına izin verir, ancak bu, beklenen bir bağlamda ve belirli ölçüde iframe'ler içerisinde sandbox'a alınmış durumdadır. 
:::

Eğer önemli bir özellik, doğası gereği bir güvenlik açığı gerektiriyorsa, bu durumda ekibinizin, sorunun önemini, güvenlik açığının sağladığı en kötü senaryolarla karşılaştırarak değerlendirmesi gerekir.

### HTML Enjeksiyonu {#html-injection}

Daha önce öğrendiğiniz gibi, Vue otomatik olarak HTML içeriğini kaçırır, böylece uygulamanıza kazara çalıştırılabilir HTML enjeksiyonu yapmanızı engeller. Ancak, **HTML'nin güvenli olduğunu bildiğiniz durumlarda**, açıkça HTML içeriği render edebilirsiniz:

- Bir şablon kullanarak:

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- Bir render fonksiyonu kullanarak:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- JSX ile render fonksiyonu kullanarak:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning
Kullanıcı tarafından sağlanan HTML asla %100 güvenli olarak kabul edilemez; yalnızca sandbox'lanmış bir iframe içinde veya yalnızca bu HTML'i yazan kullanıcının maruz kalabileceği bir uygulama parçasında olduğunda güvenli sayılabilir. Ayrıca, kullanıcıların kendi Vue şablonlarını yazmalarına izin vermek benzer tehlikeler taşır.
:::

### URL Enjeksiyonu {#url-injection}

Şu URL'de:

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

Eğer URL "sanitize" edilmemişse ve `javascript:` kullanılarak JavaScript çalıştırılmasına izin veriyorsa potansiyel bir güvenlik sorunu var. Bununla ilgili yardımcı olabilecek [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) gibi kütüphaneler mevcuttur, ancak unutmayın: eğer frontend'de URL temizliği yapıyorsanız, zaten bir güvenlik sorununuz var. 

**Kullanıcı tarafından sağlanan URL'ler her zaman backend'iniz tarafından temizlenmelidir; bu sayede bir veritabanına kaydedilmeden önce sorun önlenir.** O zaman problem, API'nize bağlanan _her_ istemci için önlenir; bu, yerel mobil uygulamaları da içerir. Ayrıca, temizlenmiş URL'lerle bile Vue, bunların güvenli hedeflere yönlendirdiğinden emin olamaz.

### Stil Enjeksiyonu {#style-injection}

Bu örneğe bakalım:

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

`sanitizedUrl`'un temizlendiğini varsayalım, böylece gerçek bir URL olduğu ve JavaScript olmadığı kesin. Ancak `userProvidedStyles` içinde kötü niyetli kullanıcılar hala "click jack" yapmak için CSS sağlama olanağına sahip olabilir; örneğin, bağlantıyı "Giriş Yap" butonunun üzerine saydam bir kutu stili uygulayarak gizleyebilir. Eğer `https://user-controlled-website.com/` adresi, uygulamanızın giriş sayfasına benzemek üzere tasarlanmışsa, kullanıcıların gerçek giriş bilgilerini yakalayabilirler.

Kullanıcı tarafından sağlanan içeriğin bir `` öğesi için izin verilmesi, sayfanın tamamen nasıl stilleneceği üzerinde o kullanıcıya tam kontrol vermekle daha büyük bir güvenlik açığı yaratır. Bu nedenle Vue, şablonlar içinde stil etiketlerinin render edilmesini engeller; örneğin:

```vue-html
<style>{{ userProvidedStyles }}</style>
```

Kullanıcılarınızı tıklama hırsızlığına karşı tam olarak korumak için, CSS üzerinde tam kontrol sağlamalarını yalnızca sandbox'lanmış bir iframe içinde sağlamakta öneriyoruz. Alternatif olarak, bir stil bağlaması aracılığıyla kullanıcı kontrolü sağlarken, bunun `nesne sözdizimini` kullanmasını ve kullanıcılara yalnızca kontrol etmekte güvenli olan belirli özellikler için değerler sağlamalarına izin vermeyi öneriyoruz; bu şekilde:

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### JavaScript Enjeksiyonu {#javascript-injection}

Vue ile bir `` öğesi render etmeyi asla önermiyoruz; çünkü şablonlar ve render fonksiyonları yan etkiler taşımamalıdır. Ancak, zamanlama sırasında JavaScript olarak değerlendirilecek dizeleri dahili olarak eklemenin başka yolları da vardır.

Her HTML öğesinin, JavaScript dizelerini kabul eden `onclick`, `onfocus` ve `onmouseenter` gibi değerlerle öznitelikleri vardır. Kullanıcı tarafından sağlanan JavaScript'in bu olay özniteliklerinden herhangi birine bağlanması potansiyel bir güvenlik riski olduğundan, bunun yapılmaktan kaçınılması gerekir.

:::warning
Kullanıcı tarafından sağlanan JavaScript asla %100 güvenli olarak kabul edilemez; yalnızca sandbox'lanmış bir iframe içinde veya yalnızca bu JavaScript'i yazan kullanıcının maruz kalabileceği bir uygulama parçasında olduğunda güvenli sayılabilir.
:::

Bazen Vue şablonlarında cross-site scripting (XSS) yapmak için nasıl mümkün olduğunu bildiren güvenlik açığı raporları alıyoruz. Genel olarak, bu tür durumları gerçek bir güvenlik açığı olarak değerlendirmiyoruz çünkü XSS'i mümkün kılan iki senaryodan geliştiricileri korumanın pratik bir yolu yoktur:

1. Geliştirici, Vue'ya kullanıcı tarafından sağlanan, denetlenmemiş içeriği Vue şablonları olarak render etmesini açıkça talep etmektedir. Bu durumda içsel olarak güvensizdir ve Vue'nun kaynağını bilmesi mümkün değildir.

2. Geliştirici, Vue'yu sunucu tarafından işlenmiş ve kullanıcı tarafından sağlanan içeriğe sahip bir HTML sayfasına tamamen monte etmektedir. Bu, #1 ile temelde aynı problemdir, ancak bazen geliştiriciler bunun farkında olmadan bunu yapabilir. Bu, saldırganın düz HTML olarak güvenli ancak Vue şablonu olarak güvensiz olan HTML sağlaması durumunda potansiyel güvenlik açığına yol açabilir. 

En iyi uygulama, **Vue'yu sunucu tarafından işlenmiş ve kullanıcı tarafından sağlanan içerik içerebilecek düğümlere monte etmemektir.**

## En İyi Uygulamalar {#best-practices}

Genel kural, denetlenmemiş, kullanıcı tarafından sağlanan içeriğin çalıştırılmasına izin verirseniz (ister HTML, JavaScript veya hatta CSS olarak), kendinizi saldırılara açık hale getirebilirsiniz. Bu tavsiye, Vue, başka bir çerçeve veya çerçeve kullanmadan bile geçerlidir.

:::note
`Potansiyel Tehlikeler` için yukarıda belirtilen önerilerin ötesinde, bu kaynaklarla tanışmanızı öneririz:
:::

- [HTML5 Güvenlik Başvuru Kılavuzu](https://html5sec.org/)
- [OWASP'in Cross Site Scripting (XSS) Önleme Başvuru Kılavuzu](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Daha sonra öğrendiklerinizi, bağımlılıklarınızın kaynak kodunu potansiyel olarak tehlikeli desenler açısından incelemek için de kullanın; bunların herhangi birinin üçüncü taraf bileşenleri içermesi veya DOM'a render edilenleri etkilemesi durumunda.

## Backend Koordinasyonu {#backend-coordination}

HTTP güvenlik açıkları, örneğin cross-site request forgery (CSRF/XSRF) ve cross-site script inclusion (XSSI) gibi, esasen backend üzerinde ele alınmaktadır; bu nedenle Vue'nun endişesini oluşturmazlar. Ancak, backend ekibinizle iletişim kurarak API'leriyle en iyi etkileşimi sağlamak için, örneğin form gönderimleriyle CSRF tokenları iletmek iyi bir fikir olabilir.

## Sunucu Tarafı Renderi (SSR) {#server-side-rendering-ssr}

SSR kullanırken bazı ek güvenlik endişeleri vardır; bu nedenle `SSR belgelerimizde` belirtilen en iyi uygulamalara dikkat edin ve güvenlik açıklarından kaçının.