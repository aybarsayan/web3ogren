---
title: preact/preset-vite` ile Ön İşleme
date: 2024-08-06
authors:
  - Ryan Christian
description: preact/preset-vite ile ön işleme, kullanıcı deneyimini artırarak uygulamalarda hızlı bir şekilde HTML üretme sürecini optimize eder. Bu kılavuzda, ön işlemenin nasıl etkinleştirileceği ve uygulanacağına dair ayrıntılı bilgiler sunulmaktadır.
keywords: [ön işleme, Vite, Preact, SPA, eklenti]
---

# @preact/preset-vite` ile Ön İşleme

`@preact/preset-vite`'de ön işleme eklentimizin kullanılabilir hale gelmesinin üzerinden yarım yıl geçti. Şimdi bu konuyu, biraz tarihimize ve ekosistemimize değinerek konuşalım.

Topluluğumuzda bir süredir bulunanlar, ön işleme konusundaki tutkumuzu bilir; bu, Preact-CLI'de birinci sınıf bir özellikti, ardından WMR'ye geçti ve şimdi Vite preset'imizde. Doğru yapıldığında, bu, kullanıcı deneyimini büyük ölçüde geliştiren, standart bir SPA'ya acısız bir ekleme oluyor ve ön işleme eklentimiz tam olarak bunu kolaylaştırmayı amaçlıyor.

## Ön İşleme Nedir?

Bu yazının bağlamında "ön işleme", uygulamanızdan HTML üretme eylemini ifade eder; bu, sunucu tarafı render (SSR) kullanarak derleme zamanında gerçekleştirilir; bazen buna statik site üretimi (SSG) de denir.

:::info
SSR'nin avantajlarına burada derinlemesine girmeyeceğiz veya bunu kullanmanız gerektiğini savunmayacağız; ancak, genel olarak, başlangıçta kullanıcıya tam olarak doldurulmuş bir HTML belgesi göndermek, boş bir kabuk yerine, genellikle daha avantajlıdır.
:::

Kullanıcılar belgeye daha hızlı erişir ve sayfayı kullanmaya başlayabilir (sıklıkla, işlevselliği azaltılmış olarak) arka planda JS indirilirken.

## Bu Alanındaki Tarihimiz

Preact-CLI ilk kez 2017 yılının Mayıs ayında kamuya dağıtıldığında, yerleşik ön işleme araçlarımızda sürekli bir konu haline geldi; bunu 2020'de WMR'ye taşıdık ve Vite'ye geçince biz ve topluluk üyeleri bunun özlemini çektik.

Her iterasyon biraz farklı olsa da, hepsi aynı temel fikir etrafında inşa edildi: kullanıcılar, mevcut kod tabanlarında sınırlı değişikliklerle ön işleme adımını daha hızlı benimseyecek. Preact-CLI'de bu, kök bileşenin varsayılan bir dışa aktarımını sağlamak ve onu doldurmak için bazı JSON verileri sunmak anlamına geliyordu; WMR ve şimdi Vite'de, rotanın HTML'sini döndüren basit bir `prerender()` fonksiyonu dışa aktarmak anlamına geliyor. Ön işlemeci, uygulama içinde geziniyor ve JSON verilere önceden ihtiyacı ortadan kaldırıyor.

:::warning
Ölçekli SSR ile geniş kapsamlı çalışan herkes bilir ki, tamamen soyutlanamayacak bir karmaşıklık dağları vardır ve bunun aksini savunmayız.
:::

Ancak, neredeyse her SPA, ön işlemeyle daha iyi bir deneyim sunmaktadır; bu nedenle, mümkün olduğunca çok kullanıcının bu sürece dahil olmasını istiyoruz - giriş engelini azaltmanın topluluğumuzda çarpıcı bir şekilde başarılı olduğu göstermiştir ve tasarım felsefemizin anahtarı, mümkün olduğunca "drop-in" ulaşmak olmuştur.

## Mevcut Vite Ekosistemi

Vite preset'imiz için kendi ön işleme uygulamamızı oluştururken, mevcut Vite ekosistemine göz attık ama aradığımızı bulamadık. Ön işleme, mevcut uygulamanızla minimal modifikasyonla en yakın "drop-in" olmalı ve HTML üretmelidir; ancak mevcut çözümler, istediğimizden daha uzaktı ve iki ana kategoriye düştü:

1. **Çoklu Derlemeler**
   - Ayrı istemci/sunucu derlemeleri, genellikle ayrı giriş noktaları
   - Daha az izomorfik, uygulamanızda farklı ortamlar için farklı dallar
2. **Çerçeveler / Vite Sarmalayıcıları**
   - Artık Vite'yi doğrudan kullanmıyor, bir soyutlama var
   - Bir miktar bağlılık
   - Farklı Vite konfigürasyon seçenekleri, eklentileri vb. için destek matrisleri karmaşık olabilir ve pek net olmayabilir

:::note
Bu çözümler kesinlikle avantajları ve ekosistemde yerleri vardır, ancak hiçbiri tarihi tekliflerimiz göz önüne alındığında, ekosistemimiz için olduğu kadar iyi hissettiremiyordu.
:::

"En iyi durum senaryosu" DX genellikle daha karmaşık veya özel ihtiyaçlar için feda ediliyordu - bu tamamen geçerli bir takas.

Ancak, "drop-in" ön işleme için, mevcut seçeneklerden biraz farklı veya en azından kullanıcılarımıza biraz daha tanıdık bir şey sunabileceğimizi düşündük.

## `@preact/preset-vite` içindeki Uygulama

Yıllar sonra, WMR'nin ön işlemesinin sadeliği ve genişletilebilirliğine hâlâ dönülüyor ve bunun Vite preset'imizden eksik olduğunu düşündük. Kısa bir çalışma sonrası, işte bir eklenti ile ön işleme!

Başlamak için, bir "Merhaba Dünya" uygulamasının ön işlenme örneğini verelim.

> İpucu: Vite başlatıcımız (`$ npm create preact`), bununla birlikte yönlendirme, TypeScript gibi birkaç diğer tamamlayıcı seçenekle bunu sizin için ayarlayabilir. Ön işlemenizi denemekle ilgileniyorsanız, hızla uyum sağlamanın en hızlı yoludur.

Ön işleme özelliğini etkinleştirmek için, `@preact/preset-vite`'nin eklenti seçeneklerinde `prerender: { enabled: true }` ayarını yapın:

```diff
// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact({
+			prerender: { enabled: true }
		}),
	],
});
```

:::tip
...ardından, `prerender()` fonksiyonumuzu içeren script'e bir `prerender` niteliği ekleyin - bu, eklentiye nerede bulacağını bildirir. Bunu istediğiniz herhangi bir script'e ayarlayabilirsiniz; ancak buradaki örneklerimizde her zaman uygulama kökümüzde olacak.
:::

```diff
// index.html
-<script type="module" src="/src/index.jsx"></script>
+<script prerender type="module" src="/src/index.jsx"></script>
```

...son olarak, uygulama kökümüzde birkaç ayarlama yapın:

1. `render`'ı `hydrate` ile değiştirin
   * `preact-iso`'dan `hydrate`, mevcut belgede mevcut bir işaretleme bulup bulamamasına bağlı olarak uygulamayı render veya hydrate etmeye karar veren çok küçük bir yardımcıdır. Geliştirme modunda `render` kullanır, ancak üretim modunda, ön işlenmiş HTML ile `hydrate` kullanır.
   * Node'da SSR sırasında `document`'a, bir tarayıcı küresel değişkenine erişmeye çalışmadığımızdan emin olmak için bir pencere kontrolü eklememiz gerekiyor (`typeof window !== undefined`).

2. `prerender()` dışa aktarmamızı ekleyin
   * Bu, ön işlemenin gerçekleştiricisidir ve tamamen kullanıcı kontrolündedir. Uygulamanızın nasıl render edileceğini, kök bileşeninize hangi özelliklerin iletileceğini, HTML'de herhangi bir ayarlama yapmayı, istediğiniz herhangi bir son işlemi çalıştırmayı seçersiniz. Eklentinin tek ihtiyacı, HTML dizenizle birlikte bir `html` niteliği içeren bir nesne döndürmektir.
   * Buradaki örneklerimiz için `preact-iso`'dan `prerender` kullanacağız; bu, `preact-render-to-string`'den `renderToStringAsync` etrafında ince bir sarmalayıcıdır ve ana avantajı: otomatik olarak bulduğu ilişkili bağlantıları toplar ve dönderir. Bu durumda, ön işleme eklentisi bu bağlantıları "yürütmek" ve sayfaları keşfetmek için kullanabilir. Bunu daha sonra göstereceğiz.

```diff
// src/index.jsx
-import { render } from 'preact';
+import { hydrate, prerender as ssr } from 'preact-iso';

function App() {
    return <h1>Merhaba Dünya!</h1>
}

-render(<App />, document.getElementById('app'));
+if (typeof window !== 'undefined') {
+	hydrate(<App />, document.getElementById('app'));
+}

+export async function prerender(data) {
+    return await ssr(<App {...data} />)
+}
```

:::note
Bu kurulumla, ön işleme yapan bir uygulamanız olacak. Ancak, hiçbir uygulama bu kadar basit değildir, dolayısıyla birkaç daha karmaşık örneğe bakalım.
:::

### Tam API Örneği

```jsx
// src/index.jsx

// ...

export async function prerender(data) {
	const { html, links: discoveredLinks } = ssr(<App />);

	return {
		html,
		// Ön işlenmesi gereken ek bağlantıları isteğe bağlı olarak ekleyin
		// (şayet henüz işlenmemişse - bu bağlantılar temizlenecektir)
		links: new Set([...discoveredLinks, '/foo', '/bar']),
		// Ön işlenmiş HTML belgesinin `<head>` kısmına yapılandırma ve eklemeler yapın
		head: {
			// "lang" niteliğini ayarlar: `<html lang="en">`
			lang: 'tr',
			// Mevcut sayfa için başlığı ayarlar: `<title>Benim Harika Sayfam</title>`
			title: 'Benim Harika Sayfam',
			// `<head>` içine eklemek istediğiniz diğer elemanları ayarlar:
			//   <link rel="stylesheet" href="foo.css">
			//   <meta property="og:title" content="Sosyal medya başlığı">
			elements: new Set([
				{ type: 'link', props: { rel: 'stylesheet', href: 'foo.css' } },
				{ type: 'meta', props: { property: 'og:title', content: 'Sosyal medya başlığı' } }
			])
		}
	}
}
```

### İçerik Alımı İzomorfik Olarak Süspansiyon tabanlı Alım ile

```jsx
// src/use-fetch.js
import { useState } from "preact/hooks";

const cache = new Map();

async function load(url) {
	const res = await fetch(url);
	if (res.ok) return await res.text();
	throw new Error(`İçerik alınamadı ${url}!`);
}

// Basit süspansiyon tabanlı alım mekanizması ile önbellekleme
export function useFetch(url) {
	const [_, update] = useState({});

	let data = cache.get(url);
	if (!data) {
		data = load(url);
		cache.set(url, data);
		data.then(
			(res) => update((data.res = res)),
			(err) => update((data.err = err)),
		);
	}

	if (data.res) return data.res;
	if (data.err) throw data.err;
	throw data;
}
```

```jsx
// src/index.jsx
import { hydrate, prerender as ssr } from 'preact-iso';
import { useFetch } from './use-fetch.js';

function App() {
    return (
        <div>
            <Suspense fallback={<p>Yükleniyor...</p>}>
                <Article />
            </Suspense>
        </div>
    );
}

function Article() {
	const data = useFetch("/my-local-article.txt");
	return <p>{data}</p>;
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    return await ssr(<App {...data} />)
}
```

### `globalThis` kullanarak veri geçişi

```js
// src/title-util.js
import { useEffect } from 'preact/hooks';

/**
 * `document.title` veya `globalThis.title` ayarla
 * @param {string} title
 */
export function useTitle(title) {
	if (typeof window === 'undefined') {
		globalThis.title = createTitle(title);
	}
	useEffect(() => {
		if (title) {
			document.title = createTitle(title);
		}
	}, [title]);
}
```

```jsx
// src/index.jsx
import { LocationProvider, Router, hydrate, prerender as ssr } from 'preact-iso';

import { useTitle } from './title-util.js'

function App() {
    return (
        <LocationProvider>
            <main>
                <Home path="/" />
                <NotFound default />
            </main>
        </LocationProvider>
    );
}

function Home() {
    useTitle('Preact - Ana Sayfa');
    return <h1>Merhaba Dünya!</h1>;
}

function NotFound() {
    useTitle('Preact - 404');
    return <h1>Sayfa Bulunamadı</h1>;
}

if (typeof window !== 'undefined') {
    hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    const { html, links } = await ssr(<App {...data} />);

    return {
        html,
        links,
        head: {
            title: globalThis.title,
            elements: new Set([
                { type: 'meta', props: { property: 'og:title', content: globalThis.title } },
            ])
        }
    };
}
```

Daha az yaygın bir ihtiyaç olmasına rağmen, bu modeli kullanarak ön işleme verilerini uygulamanızın derinlerine iletmek de mümkündür; bu, bir global veri deposu/bağlamı atlama gereksinimini ortadan kaldırır.

```jsx
// src/some/deep/Component.jsx
function MyComponent({ myFetchData }) {
	const [myData, setMyData] = useState(myFetchData || 'bir yedek verisi');
	...
}
```

```js
let initialized = false;
export async function prerender(data) {
    const init = async () => {
        const res = await fetch(...);
        if (res.ok) globalThis.myFetchData = await res.json();

        initialized = true;
    }
    if (!initialized) await init();

    const { html, links } = await ssr(<App {...data} />);
    ...
}
```

---

"Bu her şey nasıl çalışıyor?" diye merak edenler için, üç basit adıma bölünebilir:

1. **Kurulum**
   Sizin dışa aktardığınız `prerender()` fonksiyonunun script'ini ek bir girdi olarak ayarlıyoruz ve Rollup'a giriş imzalarını korumasını söylüyoruz. Bu, bu fonksiyonu inşa sonrası erişim ve çağırma imkanı sağlar.
2. **Derleme**
   Vite'nin uygulamanızı normal olarak derlemesine izin veriyoruz: JSX derliyor, eklentileri çalıştırıyor, varlıkları optimize ediyor vb.
3. **Ön İşleme**
   `generateBundle` eklenti aşamasında, HTML üretmeye başlıyoruz. `/` ile başlayarak, uygulamanızın inşa edilmiş JS paketlerini Node içinde çalıştırmaya başlıyoruz, `prerender()` fonksiyonunu çağırıyoruz ve onu döndürdüğümüz HTML'i `index.html` belgesine ekliyoruz, nihayet sonucu belirtilen çıkış dizinine yazıyoruz. `prerender()` fonksiyonu tarafından döndürülen yeni bağlantılar bir sonraki işleme için sıralanır.

:::danger
Ön işlemeye, beslemek için URL'lerimiz kalmadığında tamamlanır.
:::

Bundan sonra, Vite derleme sürecine devam edecek ve başka eklentileriniz varsa onları da çalıştıracaktır. Ön işlenmiş uygulamanız hemen hazır olacak, ardından tekrar herhangi bir derleme veya script gerekmeyecek.

### Bazı Harika Özellikler

- **Dosya sistemi tabanlı `fetch()` uygulaması** (İzomorfik Alım örneğinde gösterildiği gibi)
   - Kılıçlarınızla gitmeden önce, lütfen bizi dinleyin! Ön işleme sırasında (ve yalnızca ön işleme sırasında) `fetch()`'i, dosyaları dosya sisteminden doğrudan okumaya izin verecek şekilde tamir ediyoruz. Bu, ön işleme sırasında statik dosyaları (metin, JSON, Markdown vb.) bir sunucu başlatmadan tüketmenizi sağlar. Aynı dosya yollarını ön işleme sırasında kullanabilirsiniz ve bunları tarayıcıda da kullanabilirsiniz.
   - Aslında, şu anki sayfanızı okuduğunuz sayfayı inşa etme şekli budur! `fetch('/content/blog/preact-prerender.json')`, bu sayfaya geçiş yaptığınızda tetiklenir ve yaklaşık olarak `new Response(await fs.readFile('/content/blog/preact-prerender.json'))` olarak ön işlemleme sırasında gerçekleşir. Dosyayı okuyoruz, bir ağ isteğine benzemesi için `Response` içinde sarıyoruz ve uygulamanıza iade ediyoruz - uygulamanız ön işleme sırasında ve istemcide aynı `fetch()` isteğini kullanabilir.
   - Bunu süspansiyon ve asenkron SSR uygulaması ile bir araya getirmek, gerçekten harika bir DX sağlar.
- **Bağlantıları Crawl Etme**
   - Kısmen kullanıcı tarafından sağlanan `prerender()` fonksiyonu dışa aktarmasıyla, kısmen de eklentiyle, sayfayı ön işleme sırasında (`preact-iso` bunu oldukça basit hale getirir) dönerken bir bağlantı kümesi döndürebilirsiniz; bu, eklentinin derleme sırasında sitenizi gezerken daha fazla sayfa bulmasını sağlayacaktır.
   - Ayrıca eklenti seçenekleri aracılığıyla bağlantıları manuel olarak sağlayabilir veya `preact-iso`'nun döndürdüğü bağlantılara bazıları ekleyebilirsiniz. Bu, `/404` gibi bağlantısı olmayan hata sayfaları için özellikle yararlıdır; ancak onu hala ön işleme almak isterseniz.

...ve muhtemelen en büyük avantajı:

- **Bunu yapılandırma dosyanızdaki bir boolean'u çevirerek açıp kapatabilirsiniz**
   - Biz sarmalayıcı olmadığımız ve desteklemek için kaynak kodunuzu değiştirmenize (birkaç pencere kontrolü dışındaki) gerek kalmadığı için, hiçbir bağlılık yoktur. Eğer terk etmeye karar verirseniz veya çıktınız üzerinde test yapmak isterseniz, yapmanız gereken tek şey bir boolean'ı çevirmek ve kadar tekrar Vite ile sıradan bir SPA'sınız'a geri dönmektir.
   - Birkaç kez belirttiğimiz gibi, ön işleme ne kadar "drop-in" olursa, o kadar iyidir ve bu, anında geri dönme yeteneğini de içerir. Ön işleme ve yeniden geri dönme sürecinin minimum çaba ile mümkün olması bizim için önemlidir.

## Son Notlar

Vite ekibi muhtemelen bu eklentinin üretilen istemci koduna küçük bir yamanın eklenmesine neden olduğunu belirtmek ister ve (Vite ekibi) tarayıcı paketlerini Node'da çalıştırmayı desteklemeyeceklerinin garantisi yoktur.

Söz konusu yamanın durumu şudur:

```diff
// src/node/plugins/importAnalysisBuild.ts
-if (__VITE_IS_MODERN__ && deps && deps.length > 0) {,
+if (__VITE_IS_MODERN__ && deps && deps.length > 0 && typeof window !== 'undefined') {,
	 const links = document.getElementsByTagName('link')
	 ...
```

`document.getElementsByTagName`'yi Node'da çalıştırmaya çalışmak, burada herhangi bir `document` bulunmadığı için hata verecektir. Bu nedenle, preload'a ek bir koşul ekliyoruz, böylece Node içindeki herhangi bir çabayı çalıştırmaz ve bu kadar. Bu, ön işleme sırasında herhangi bir amaca hizmet etmeyecek bu tek satırlık bölünme dışında sadece kısmi bir değişiklik.

Bu düzeydeki riski kabul etmekten çok mutluyuz ve uzun bir süredir, herhangi bir sorun yaşamadan yoğun bir şekilde kullanıyoruz; ancak bu, aracı amacından daha öte bir şekilde kullanmak ve açıklamak istediğimiz bir şey.

Herhangi bir Preact kullanıcısı olmayanlar için iyi haber: eklentimiz tamamen çerçeve bağımsızdır! Diğer çerçevelerde kullanmanızı kolaylaştırmak için, alternatif olarak [`vite-prerender-plugin`](https://npm.im/vite-prerender-plugin) olarak teklif edilmektedir. Aynı işlevsellik, `@preact/preset-vite` ile senkronize tutulur, ancak Preact preset eklentisinde bulunan diğer Preact spesifik araçları düşürmektedir.