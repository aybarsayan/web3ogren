---
title: React Derleyicisi
seoTitle: React Compiler - Optimize Your React Applications
sidebar_position: 1
description: Bu sayfa, React Derleyicisine bir giriş yapacak ve bunu başarıyla nasıl deneyebileceğinizi gösterecektir. Ayrıca, derleyicinin nasıl kullanılacağı ve sağladığı avantajlar hakkında bilgi verecektir.
tags: 
  - react
  - derleyici
  - optimizasyon
  - eslintrc
keywords: 
  - React
  - Compiler
  - Optimization
  - ESLint
---
Bu sayfa, React Derleyicisi'ne bir giriş yapacak ve bunu başarıyla nasıl deneyebileceğinizi gösterecektir.



Bu belgeler hâlâ geliştirme aşamasındadır. Daha fazla belgeler, [React Derleyicisi Çalışma Grubu reposu](https://github.com/reactwg/react-compiler/discussions) içerisinde mevcuttur ve bu belgeler daha stabil hale geldiğinde aşağıya gönderilecektir.




* Derleyiciye başlamak
* Derleyiciyi ve ESLint eklentisini yüklemek
* Sorun giderme




React Derleyicisi, topluluktan erken geri bildirim almak için açık kaynak olarak geliştirdiğimiz yeni bir derleyicidir. Meta gibi şirketlerde üretimde kullanılmıştır, ancak derleyiciyi uygulamanız için üretime almak, kod tabanınızın sağlığına ve `React Kuralları` na ne kadar uyduğunuza bağlı olacaktır.

En son Beta sürümüne `@beta` etiketi ile ulaşabilirsiniz ve günlük deneysel sürümler `@experimental` ile bulunmaktadır.


> React Derleyicisi, topluluktan erken geri bildirim almak için açık kaynak olarak kurduğumuz yeni bir derleyicidir. Bu, React uygulamanızı otomatik olarak optimize eden yalnızca bir derleme zamanıdır. Düz JavaScript ile çalışır ve `React Kuralları` nı anlar, böylece bunu kullanmak için herhangi bir kodu yeniden yazmanıza gerek yoktur.
> — React Derleyicisi Hakkında

Derleyici ayrıca, derleyicinin analizini doğrudan editörünüzde gösteren bir `ESLint eklentisi` içerir. **Herkesi bugün linter kullanmaya şiddetle tavsiye ediyoruz.** Linter'in kurulu olmasını gerektirmediğinden, derleyiciyi denemeye hazır olmasanız bile onu kullanabilirsiniz.

Derleyici şu anda `beta` olarak yayınlanmıştır ve React 17+ uygulamaları ve kütüphanelerinde denemek için mevcuttur. Beta sürümünü yüklemek için:


npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta


Yarn kullanıyorsanız:

```
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
```


Hâlâ React 19 kullanmıyorsanız, lütfen `aşağıdaki bölüme` daha fazla talimat için bakın.

### Derleyici ne yapar? {/*what-does-the-compiler-do*/}

Uygulamaları optimize etmek için, React Derleyicisi otomatik olarak kodunuzu akıllıca hafızaya alır. Bugün `useMemo`, `useCallback` ve `React.memo` gibi API'lerle hafızalanmayı biliyor olabilirsiniz. Bu API'ler ile, uygulamanızın belirli kısımlarının girdileri değişmediği sürece yeniden hesaplanmasına gerek olmadığını React'a söyleyebilirsiniz, bu da güncellemelerdeki çalışma miktarını azaltır. Güçlü bir yöntem olmasına rağmen, hafızayı uygulamayı unutmamak veya yanlış bir şekilde uygulamak kolaydır. Bu, React'in anlamlı bir değişikliğin olmadığı UI'nin kısımlarını kontrol etmesine neden olarak verimli olmayan güncellemeler yaratabilir.

Derleyici, JavaScript ve React kurallarını anlama bilgilerini kullanarak, bileşenlerinizde ve kancalarınızda değerleri veya değer gruplarını otomatik olarak hafızaya alır. Eğer kuralların ihlal edildiğini tespit ederse, sadece o bileşenleri veya kancaları atlayacak ve diğer kodları güvenli bir şekilde derlemeye devam edecektir.


React Derleyicisi, React Kurallarının ihlal edildiğini statik olarak tespit edebilir ve sadece etkilenen bileşenler veya kancalar için optimizasyonu güvenli bir şekilde atlayabilir. Derleyicinin, kod tabanınızın %100'ünü optimize etmesi gerekmez.


Kod tabanınız zaten çok iyi hafızalanmışsa, derleyici ile büyük performans artışları görmeyi beklemeyebilirsiniz. Ancak, uygulamada doğru bağımlılıkları hafızalamak, elle yapmak için zorlayıcı olabilir.


#### React Derleyicisi ne tür hafızalama ekler? {/*what-kind-of-memoization-does-react-compiler-add*/}

React Derleyicisi'nin ilk sürümü, **güncelleme performansını iyileştirmeye** odaklanmıştır (mevcut bileşenleri yeniden render etme), bu yüzden bu iki kullanım durumuna vurgu yapar:

1. **Bileşenlerin ardışık yeniden render edilmesini atlamak**
    * `` bileşeni yeniden render edildiğinde, bileşen ağaçtaki birçok bileşeni yeniden render eder, oysaki sadece `` değişmiştir
1. **React dışındaki pahalı hesaplamaları atlamak**
    * Örneğin, bileşen veya kanca içindeki `expensivelyProcessAReallyLargeArrayOfObjects()` fonksiyonunu çağırmak

#### Yeniden renderları optimize etme {/*optimizing-re-renders*/}

React, UI'nizi mevcut durumlarının bir fonksiyonu olarak ifade etmenize olanak tanır (daha somut olarak: props, state ve context). Mevcut uygulamasında, bir bileşenin durumu değiştiğinde, React bu bileşeni _ve tüm çocuklarını_ yeniden render eder — eğer `useMemo()`, `useCallback()` veya `React.memo()` ile bazı el ile hafızalama uyguladıysanız. Örneğin, aşağıdaki örnekte, ``'in durumu değiştiğinde `` her zaman yeniden render olur:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} çevrimiçi</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_Bu örneği React Derleyicisi Oyun Alanında görün_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Derleyicisi, durum değiştiğinde yalnızca uygulamanın ilgili kısımlarının yeniden render edilmesini sağlamak için manuel hafızalamanın eşdeğeri olan işlemleri otomatik olarak uygular; bu, bazen "ince-grain reactivity" olarak adlandırılır. Yukarıdaki örnekte, React Derleyicisi `` bileşeninin döndürdüğü değerin, `friends` değişse bile yeniden kullanılabileceğini belirler ve bu JSX'i yeniden yaratmayı _ve_ sayım değiştikçe ``'ı yeniden render etmeyi de atlayabilir.

#### Pahalı hesaplamalar da hafızalanır {/*expensive-calculations-also-get-memoized*/}

Derleyici, render sırasında kullanılan pahalı hesaplamalar için de otomatik olarak hafızalama yapabilir:

```js
// **React Derleyicisi tarafından** hafızalanmayan, çünkü bu bir bileşen veya kanca değil
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// React Derleyicisi tarafından hafızalanan, çünkü bu bir bileşen
function TableContainer({ items }) {
  // Bu fonksiyon çağrısı hafızalanmış olur:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Bu örneği React Derleyicisi Oyun Alanında görün_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAaumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

Ancak, `expensivelyProcessAReallyLargeArrayOfObjects` gerçekten pahalı bir fonksiyonsa, React dışında kendi hafızalama uygulamanızı dikkate almak isteyebilirsiniz, çünkü:

- React Derleyicisi yalnızca React bileşenlerini ve kancalarını hafızalar, her fonksiyonu değil.
- React Derleyicisi'nin hafızalı işlemeleri birden fazla bileşen veya kanca arasında paylaşılmaz.

Dolayısıyla, `expensivelyProcessAReallyLargeArrayOfObjects` birçok farklı bileşende kullanılıyorsa, aynı kesin öğeler yönlendirilse bile, bu pahalı hesaplama tekrar tekrar çalıştırılacaktır. Kodu daha karmaşık hale getirmeden önce, bir şeyin gerçekten o kadar pahalı olup olmadığını görmek için [profil çıkarma](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) yapmayı öneriyoruz.


### Derleyiciyi denemeli miyim? {/*should-i-try-out-the-compiler*/}

Lütfen unutmayın ki derleyici hâlâ Beta aşamasındadır ve birçok geliştirilmesi gereken yönü vardır. Meta gibi şirketlerde üretimde kullanıldığı halde, derleyiciyi uygulamanız için üretime almak, kod tabanınızın sağlığına ve `React Kuralları` na ne kadar uyduğunuza bağlı olacaktır.

**Derleyiciyi şimdi kullanmaya acele etmenize gerek yok. Stabil bir sürüme ulaşmasını beklemekte sorun yok.** Ancak, uygulamanızda denemeler yaparak `geri bildirimde` bulunmanızı takdir ederiz, böylece derleyiciyi daha iyi hale getirebiliriz.

## Başlarken {/*getting-started*/}

Bu belgelerin yanı sıra, derleyici hakkında ek bilgi ve tartışmalar için [React Derleyicisi Çalışma Grubu](https://github.com/reactwg/react-compiler) ile kontrol etmenizi öneririz.

### eslint-plugin-react-compiler'ı yükleme {/*installing-eslint-plugin-react-compiler*/}

React Derleyicisi aynı zamanda bir ESLint eklentisini de çalıştırmaktadır. ESLint eklentisi, derleyiciden **bağımsız** olarak kullanılabilir, yani derleyiciyi kullanmıyorsanız bile ESLint eklentisini kullanabilirsiniz.


npm install -D eslint-plugin-react-compiler@beta


Ardından, onu ESLint yapılandırmanıza ekleyin:

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

Ya da, eski eslintrc yapılandırma formatında:

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
}
```

ESLint eklentisi, editörünüzde React kurallarının ihlallerini gösterecektir. Bunu yaptığında, derleyicinin o bileşeni veya kancayı optimize etmekten atladığı anlamına gelir. Bu tamamen kabul edilebilir ve derleyici diğer bileşenleri kod tabanınızda optimize etmeye devam edebilir.


**Tüm ESLint ihlallerini hemen düzeltmek zorunda değilsiniz.** Optimize edilen bileşenlerin ve kancaların miktarını artırmak için bunları kendi hızınızda ele alabilirsiniz, ancak derleyiciyi kullanmadan önce her şeyi düzeltmek zorunda değilsiniz.


### Derleyiciyi kod tabanınıza yayma {/*using-the-compiler-effectively*/}

#### Mevcut projeler {/*existing-projects*/}
Derleyici, `React Kuralları` na uyan işlevsel bileşenleri ve kancaları derlemek üzere tasarlanmıştır. Kural ihlali yapan kodları da atlamaktan (atlayarak) sorumludur. Ancak, JavaScript'in esnek doğası nedeniyle, derleyici her olası ihlali yakalayamaz ve yanlış negatifler ile derleme yapabilir: yani, derleyici, React Kurallarını ihlal eden bir bileşeni/kancayı yanlışlıkla derleyebilir ve bu tanımsız bir davranışa yol açabilir.

Bu nedenle, mevcut projelerde derleyiciyi başarılı bir şekilde benimsemek için öncelikle ürün kodunuzda küçük bir dizinde çalıştırmayı öneririz. Bunu, derleyiciyi yalnızca belirli dizinlerde çalıştıracak şekilde yapılandırarak yapabilirsiniz:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

Derleyiciyi yaymakta daha fazla güvenceye sahip olduğunuzda, kapsama alanını diğer dizinlere de genişletebilir ve yavaş yavaş uygulamanızın tamamına yayabilirsiniz.

#### Yeni projeler {/*new-projects*/}

Yeni bir projeye başlıyorsanız, derleyiciyi tüm kod tabanınızda etkinleştirebilir ve bu varsayılan davranıştır.

### React 17 veya 18 ile React Derleyicisinden yararlanma {/*using-react-compiler-with-react-17-or-18*/}

React Derleyicisi, React 19 RC ile en iyi şekilde çalışır. Güncellemeyi yaramazsanız, derlenmiş kodun 19 öncesi sürümlerde çalışması için `react-compiler-runtime` paketini yüklemeniz gerekecek. Ancak, minimum desteklenen sürüm 17'dir.


npm install react-compiler-runtime@beta


Ayrıca, derleyici yapılandırmanıza doğru `target` değeri eklemelisiniz. Burada `target`, hedeflediğiniz React'ın ana sürümüdür:

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### Derleyiciyi kütüphanelerde kullanma {/*using-the-compiler-on-libraries*/}

React Derleyicisi, kütüphaneleri derlemek için de kullanılabilir. Çünkü React Derleyicisi, kütüphanelerini kullanan uygulama yapılandırma pipelinelerinin üzerinde çalışmasına izin verilmediğinden, kütüphanenin orijinal kaynak kodu üzerinde çalışması gerekir. Bu nedenle, kütüphane bakımcılarının kütüphanelerini bağımsız olarak derleyip test etmeleri ve derlenmiş kodu npm'ye göndermeleri önerilir.

Kodunuz önceden derlendiği için, kütüphanenizin kullanıcıları, kütüphanenizden otomatik hafızalamadan yararlanmak için derleyiciyi etkin hale getirmek zorunda olmayacak. Eğer kütüphaneniz, henüz React 19 olmayan uygulamalara hedefliyorsa, minimum `target` belirlemeli ve `react-compiler-runtime`'ı doğrudan bağımlılık olarak eklemelisiniz`. Runtime paketi, uygulamanın sürümüne bağlı olarak API'lerin doğru uygulamasını kullanır ve gerekli olduğunda eksik API'leri polyfill eder.

Kütüphane kodu genellikle daha karmaşık desenler gerektirebilir ve kaçış çıkışlarının kullanımını gerektirebilir. Bu nedenle, derleyiciyi kütüphaneniz üzerinde kullanmanın çıkarabileceği herhangi bir sorunu tanımlamak için yeterli test yapmanızı öneriyoruz. Herhangi bir sorun tespit ederseniz, `'use no memo'` yönergesi` ile belirli bileşenleri veya kancaları atlamak her zaman mümkündür.

Uygulamalarda olduğu gibi, kütüphanenizde 100% bileşen veya kancayı tamamen derlemek gerekli değildir. Başlangıç ​​noktası olarak, kütüphanenizin en yüksek performans gereksinimlerini belirleyip bunların `React Kuralları` na uygun olup olmadığını kontrol etmek iyi bir fikir olabilir, bunu yapmak için `eslint-plugin-react-compiler`'ı kullanabilirsiniz.

## Kullanım {/*installation*/}

### Babel {/*usage-with-babel*/}


npm install babel-plugin-react-compiler@beta


Derleyici, yapılandırma pipelinenizde derleyiciyi çalıştırmak için kullanabileceğiniz bir Babel eklentisi içerir.

Yükledikten sonra, Babel yapılandırmanıza ekleyin. Lütfen, derleyicinin pipelin'de **ilk** olarak çalıştırılmasının kritik olduğunu unutmayın:

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // önce çalıştırılmalıdır!
      // ...
    ],
  };
};
```

`babel-plugin-react-compiler`, diğer Babel eklentilerinden önce çalışmalıdır çünkü derleyici, sağlıklı bir analiz için girdi kaynak bilgilerinin bulunmasına ihtiyaç duyar.

### Vite {/*usage-with-vite*/}

Vite kullanıyorsanız, bu eklentiyi vite-plugin-react'a ekleyebilirsiniz:

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

### Next.js {/*usage-with-nextjs*/}

Daha fazla bilgi için lütfen [Next.js belgelerine](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) başvurun.

### Remix {/*usage-with-remix*/}
`vite-plugin-babel`'ı kurun ve derleyicinin Babel eklentisini buna ekleyin:


npm install vite-plugin-babel


```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // TypeScript kullanıyorsanız
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Topluluk Webpack yükleyicisi [şu anda burada](https://github.com/SukkaW/react-compiler-webpack) mevcuttur.

### Expo {/*usage-with-expo*/}

Lütfen [Expo'nun belgelerine](https://docs.expo.dev/guides/react-compiler/) göz atın, Expo uygulamalarında React Derleyiciyi etkinleştirmek ve kullanmak için.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native, Metro aracılığıyla Babel kullanır, bu nedenle yükleme talimatları için `Babel ile Kullanım` bölümüne başvurun.

### Rspack {/*usage-with-rspack*/}

Lütfen [Rspack'ın belgelerine](https://rspack.dev/guide/tech/react#react-compiler) göz atın, Rspack uygulamalarında React Derleyiciyi etkinleştirmek ve kullanmak için.

### Rsbuild {/*usage-with-rsbuild*/}

Lütfen [Rsbuild'ın belgelerine](https://rsbuild.dev/guide/framework/react#react-compiler) başvurun, Rsbuild uygulamalarında React Derleyiciyi etkinleştirmek ve kullanmak için.

## Sorun Giderme {/*troubleshooting*/}

Sorunları bildirmek için, lütfen ilk olarak [React Derleyici Oyun Alanında](https://playground.react.dev/) minimum bir tekrar oluşturmayı oluşturun ve hata raporunuza ekleyin. Sorunları [facebook/react](https://github.com/facebook/react/issues) reposunda açabilirsiniz.

Ayrıca, React Derleyici Çalışma Grubu'nda bir üye olmak için başvurarak geri bildirimde bulunabilirsiniz. Lütfen katılım hakkında daha fazla detay için README'ya göz atın.

### Derleyici ne varsayıyor? {/*what-does-the-compiler-assume*/}

React Derleyicisi, kodunuzun:

1. Geçerli, anlamsal bir JavaScript olduğunu varsayar.
2. Nullable/isteğe bağlı değerlerin ve özelliklerin tanımlı olduğunu kontrol eder (örneğin, TypeScript kullanıyorsanız [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) açık bırakarak), yani `if (object.nullableProperty) { object.nullableProperty.foo }` veya optional-chaining `object.nullableProperty?.foo`.
3. [React Kuralları](https://react.dev/reference/rules) na uyduğunu varsayar.

React Derleyicisi, birçok React Kuralını statik olarak doğrulayabilir ve bir hata tespit ettiğinde derlemeyi güvenli bir şekilde atlar. Hataları görmek için [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler) yüklemeyi öneriyoruz.

### Bileşenlerimin optimize edildiğini nasıl anlarım? {/*how-do-i-know-my-components-have-been-optimized*/}

`React Devtools` (v5.0+) React Derleyicisi için yerleşik desteğe sahiptir ve optimize edilen bileşenlerin yanında "Memo ✨" rozetini gösterir.

### Derleme işlemi sonrası bir şey çalışmıyor {/*something-is-not-working-after-compilation*/}
Eğer eslint-plugin-react-compiler yüklüyse, derleyici editörünüzde React kurallarının ihlallerini gösterecektir. Bunu yaptığında, derleyicinin o bileşeni veya kancayı optimize etmekten atladığı anlamına gelir. Bu tamamen kabul edilebilir ve derleyici diğer bileşenleri kod tabanınızda optimize etmeye devam edebilir. **Tüm ESLint ihlallerini hemen düzeltmek zorunda değilsiniz.** Optimize edilen bileşenlerin ve kancaların miktarını artırmak için bunları kendi hızınızda ele alabilirsiniz.

JavaScript'in esnek ve dinamik doğası nedeniyle, tüm durumları kapsamlı bir şekilde tespit etmek ise mümkün değildir. Bu durumlarda hatalar ve tanımsız davranışlar, sonsuz döngüler gibi sorunlar ortaya çıkabilir.

Eğer uygulamanız derleme sonrası düzgün çalışmıyorsa ve herhangi bir ESLint hatası görmüyorsanız, derleyici kodunuzu yanlış derlemiş olabilir. Bunu doğrulamak için, ilgili olduğunu düşündüğünüz her hangi bir bileşeni veya kancayı `"use no memo"` yönergesi` ile atlayarak sorunun kaybolup kaybolmadığını kontrol edebilirsiniz.

```js {2}
function SuspiciousComponent() {
  "use no memo"; // bu bileşeni React Derleyicisi tarafından derlenmekten atlar
  // ...
}
```