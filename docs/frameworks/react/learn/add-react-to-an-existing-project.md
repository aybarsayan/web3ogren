---
title: Mevcut Bir Projeye React Eklemek
seoTitle: Reactı Mevcut Projeye Nasıl Ekleyebilirsiniz?
sidebar_position: 1
description: Reactı mevcut projenize entegre etmek için birçok yol vardır. Bu kılavuz, Reactı mevcut web uygulamalarınıza ve sayfalarınıza eklemenin kapsamlı yol haritasını sunmaktadır.
tags: 
  - React
  - mevcut projeler
  - web geliştirme
  - JavaScript
keywords: 
  - React
  - mevcut projeler
  - web uygulamaları
  - JavaScript
---
Mevcut projenize biraz etkileşim eklemek istiyorsanız, onu React ile yeniden yazmanıza gerek yok. React'ı mevcut yığınınıza ekleyin ve etkileşimli React bileşenlerini her yerde renderlayın.





**Yerel gelişme için [Node.js](https://nodejs.org/en/) yüklemeniz gerekiyor.** React'ı çevrimiçi olarak veya basit bir HTML sayfasıyla `deneyebilirsiniz`, ancak gerçekte kullanmak istediğiniz çoğu JavaScript aracı Node.js'e ihtiyaç duyar.



## Mevcut web sitenizin bir alt yolu için React Kullanımı {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Diyelim ki `example.com` adresinde başka bir sunucu teknolojisi (Rails gibi) kullanılarak yapılmış bir web uygulamanız var ve `example.com/some-app/` ile başlayan tüm yolları tamamen React ile uygulamak istiyorsunuz.

Kurulumu şöyle öneriyoruz:

1. **Uygulamanızın React kısmını** [React tabanlı çerçevelerden](https://learn/start-a-new-react-project) biri ile inşa edin.
2. **Çerçevenizin yapılandırmasında `/some-app`'ı *temel yol* olarak belirtin** (işte nasıl: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Sunucunuzu veya bir proxy'yi yapılandırın** böylece `/some-app/` altında tüm istekler React uygulamanız tarafından işlenir.

:::note
Bu, uygulamanızın React kısmının bu çerçevelere yerleştirilmiş [en iyi uygulamalardan faydalanmasını](https://learn/start-a-new-react-project#can-i-use-react-without-a-framework) sağlar.
:::

Birçok React tabanlı çerçeve, sunucu avantajlarından yararlanmanıza olanak tanıyan tam yığın çözümleri sunar. Ancak JavaScript'i sunucuda çalıştırmak istemiyorsanız veya bunu yapamayacaksanız, HTML/CSS/JS dışa aktarmasını (`next export` çıktısı için [Next.js](https://nextjs.org/docs/advanced-features/static-html-export), Gatsby için varsayılan) `/some-app/` altında sunmayı tercih edebilirsiniz.

## Mevcut sayfanızın bir kısmında React Kullanımı {/*using-react-for-a-part-of-your-existing-page*/}

Diyelim ki başka bir teknoloji (Rails gibi bir sunucu veya Backbone gibi bir istemci) kullanılarak yapılmış mevcut bir sayfanız var ve o sayfada etkileşimli React bileşenlerini bir yerde renderlamak istiyorsunuz. Bu, React'ı entegre etmenin yaygın bir yoludur--aslında, Meta'da yıllarca çoğu React kullanımı böyle görünüyordu!

Bunu iki adımda yapabilirsiniz:

1. **Bilinçli bir JavaScript ortamı oluşturun** böylece [JSX sözdizimini](https://learn/writing-markup-with-jsx) kullanabilirsiniz, kodunuzu [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) sözdizimi ile modüllere ayırın ve React dahil paketleri [npm](https://www.npmjs.com/) paket kayıt defterinden kullanın.
2. **React bileşenlerinizi sayfada görmek istediğiniz yerde renderlayın.**

Kesin yaklaşım mevcut sayfa kurulumunuza bağlıdır, bu yüzden bazı detayları gözden geçirelim.

### Adım 1: Modüler bir JavaScript ortamı oluşturun {/*step-1-set-up-a-modular-javascript-environment*/}

Modüler bir JavaScript ortamı, React bileşenlerinizi ayrı dosyalar halinde yazmanıza olanak tanır, böylece tüm kodunuzu tek bir dosyada yazmak zorunda kalmazsınız. Ayrıca, diğer geliştiriciler tarafından yayınlanan harika paketleri [npm](https://www.npmjs.com/) kayıt defterinden kullanmanızı sağlar--React'ı da içerir! Bunu nasıl yapacağınız mevcut kurulumunuza bağlıdır:

* **Uygulamanız halihazırda `import` ifadeleri kullanan dosyalara ayrılmışsa,** zaten sahip olduğunuz kurulumu kullanmayı deneyin. JS kodunuzda `` yazmanın bir sözdizimi hatasına neden olup olmadığını kontrol edin. Eğer bir sözdizimi hatasına neden oluyorsa, JavaScript kodunuzu [Babel ile dönüştürmeniz](https://babeljs.io/setup) ve JSX'i kullanmak için [Babel React preset'ini](https://babeljs.io/docs/babel-preset-react) etkinleştirmeniz gerekebilir.

* **Uygulamanızın JavaScript modüllerini derlemek için mevcut bir kurulum yoksa,** [Vite](https://vitejs.dev/) ile bunu ayarlayın. Vite topluluğu [çok sayıda backend çerçevesi için entegrasyonlar](https://github.com/vitejs/awesome-vite#integrations-with-backends) sunmaktadır, Rails, Django ve Laravel dahil. Eğer backend çerçeveniz listede yoksa, [bu kılavuzu takip edin](https://vitejs.dev/guide/backend-integration.html) ve Vite derlemelerini backend'inizle manuel olarak entegre edin.

Kurulumunuzun çalışıp çalışmadığını kontrol etmek için proje klasörünüzde bu komutu çalıştırın:


npm install react react-dom


Ardından, ana JavaScript dosyanızın (belki `index.js` veya `main.js` adını taşıyabilir) en üstüne bu kod satırlarını ekleyin:



```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>Uygulamam</title></head>
  <body>
    <!-- Mevcut sayfa içeriğiniz (bu örnekte, değiştirilir) -->
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Mevcut HTML içeriğini temizle
document.body.innerHTML = '<div id="app"></div>';

// Bunun yerine React bileşeninizi renderlayın
const root = createRoot(document.getElementById('app'));
root.render(<h1>Merhaba, dünya!</h1>);
```



Sayfanızın tüm içeriği "Merhaba, dünya!" ile değiştirildiyse, her şey çalıştı demektir! Devam edin.



Mevcut bir projeye modüler bir JavaScript ortamı entegre etmek başta göz korkutucu gelebilir, ancak buna değer! Takıldığınızda, [topluluk kaynaklarımızı](https://community) veya [Vite Sohbeti](https://chat.vitejs.dev/) deneyin.



### Adım 2: React bileşenlerini sayfanın herhangi bir yerinde renderlayın {/*step-2-render-react-components-anywhere-on-the-page*/}

Önceki adımda, ana dosyanızın en üstüne bu kodu koydunuz:

```js
import { createRoot } from 'react-dom/client';

// Mevcut HTML içeriğini temizle
document.body.innerHTML = '<div id="app"></div>';

// Bunun yerine React bileşeninizi renderlayın
const root = createRoot(document.getElementById('app'));
root.render(<h1>Merhaba, dünya!</h1>);
```

Elbette, mevcut HTML içeriğini gerçekten temizlemek istemiyorsunuz!

Bu kodu silin.

Bunun yerine, muhtemelen React bileşenlerinizi HTML'nizde belirli yerlerde renderlamak istiyorsunuz. HTML sayfanızı (veya bunu üreten sunucu şablonlarını) açın ve herhangi bir etikete benzersiz bir [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) niteliği ekleyin, örneğin:

```html
<!-- ... html'nizde bir yerde ... -->
<nav id="navigation"></nav>
<!-- ... daha fazla html ... -->
```

Bu, [document.getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) ile o HTML öğesini bulmanıza ve kendi React bileşeninizi içinde renderlayabilmeniz için `createRoot` ile geçmenize olanak tanır:



```html index.html
<!DOCTYPE html>
<html>
  <head><title>Uygulamam</title></head>
  <body>
    <p>Bu paragraf HTML'nin bir parçasıdır.</p>
    <nav id="navigation"></nav>
    <p>Bu paragraf da HTML'nin bir parçasıdır.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Gerçekten bir navigasyon çubuğu uygulamak
  return <h1>React'ten Merhaba!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```



`index.html`'den orijinal HTML içeriğinin nasıl korunduğuna dikkat edin; ancak, kendi `NavigationBar` React bileşeniniz artık HTML'deki `` etiketinin içinde görünüyor. Mevcut bir HTML sayfasının içinde React bileşenlerini renderlamak hakkında daha fazla bilgi edinmek için [`createRoot` kullanım belgelerine](https://reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) göz atın.

React'ı mevcut bir projeye dahil ettiğinizde, genellikle küçük etkileşimli bileşenlerle (butonlar gibi) başlamanız ve sonra yavaş yavaş "yukarıya" doğru ilerlemeniz yaygındır; bu şekilde sonuç olarak tüm sayfanızı React ile inşa etmiş olursunuz. Eğer bu noktaya ulaşırsanız, [bir React çerçevesine](https://learn/start-a-new-react-project) geçmenizi öneririz, böylece React'tan en iyi şekilde faydalanabilirsiniz.

## Mevcut bir yerel mobil uygulamada React Native Kullanımı {/*using-react-native-in-an-existing-native-mobile-app*/}

:::tip
[React Native](https://reactnative.dev/) mevcut yerel uygulamalara kademeli olarak entegre edilebilir. Android (Java veya Kotlin) veya iOS (Objective-C veya Swift) için mevcut bir yerel uygulamanız varsa, [bu kılavuzu takip edin](https://reactnative.dev/docs/integration-with-existing-apps) ve buna bir React Native ekranı ekleyin.
:::