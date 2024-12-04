---
title: Test Etme
seoTitle: Vue Uygulamaları için Test Etme Rehberi
sidebar_position: 1
description: Bu rehber, Vue uygulamalarınız için test stratejileri sunarak otomatik testlerin önemini ve farklı test türlerini anlamanıza yardımcı olur. Testlerinizi erkenden yazmaya başlamanın avantajlarını keşfedin.
tags: 
  - Vue
  - Test
  - Yazılım Geliştirme
  - Birim Testi
  - E2E Testi
keywords: 
  - otomatik testler
  - Vue 3
  - birim testleri
  - uçtan uca test
  - composables
---
## Test Etme {#testing}

## Neden Test? {#why-test}

Otomatik testler, regresyonları önleyerek ve uygulamanızı test edilebilir fonksiyonlara, modüllere, sınıflara ve bileşenlere ayırmanızı teşvik ederek karmaşık Vue uygulamalarını hızlı ve güvenilir bir şekilde inşa etmenize yardımcı olur. Her uygulamada olduğu gibi, yeni Vue uygulamanız birçok farklı şekilde bozulabilir ve bu sorunları yakalayıp düzeltmenin önemli olduğunu bilmek iyi bir şeydir.

:::tip
Testlerinizi mümkün olduğunca erken yazmaya başlayın.
:::

Bu kılavuzda, temel terimleri ele alacağız ve Vue 3 uygulamanız için hangi araçları seçeceğiniz konusunda önerilerimizi sunacağız.

Bir Vue'ya özel bölümde composable'ları kapsayan bir bölüm bulunmaktadır. Daha fazla ayrıntı için aşağıdaki `Composable'ların Test Edilmesi` kısmına bakın.

## Ne Zaman Test? {#when-to-test}

Erken test etmeye başlayın! Testleri mümkün olduğunca erken yazmaya başlamanızı öneririz. Uygulamanıza test eklemek için ne kadar çok beklerseniz, uygulamanız o kadar çok bağımlılığa sahip olur ve başlamak o kadar zorlaşır.

## Test Türleri {#testing-types}

Vue uygulamanızın test stratejisini tasarlarken aşağıdaki test türlerinden yararlanmalısınız:

- **Birim**: Belirli bir fonksiyonun, sınıfın veya composable'ın girdilerinin beklenen çıktıyı veya yan etkileri ürettiğini kontrol eder.
- **B bileşen**: Bileşeninizin yüklenip, render edildiğini, etkileşim kurulabildiğini ve beklendiği gibi davrandığını kontrol eder. Bu testler, birim testlerinden daha fazla kod içe aktarır, daha karmaşık olup çalıştırılması daha fazla zaman alır.
- **Uçtan Uca**: Birden fazla sayfayı kapsayan özellikleri kontrol eder ve üretim yapısı olan Vue uygulamanıza gerçek ağ istekleri yapar. Bu testler genellikle bir veritabanı veya başka bir arka uç sunucusu kurmayı gerektirir.

Her test türü, uygulamanızın test stratejisinde bir rol oynar ve her biri farklı türde sorunlara karşı sizi korur.

## Genel Bakış {#overview}

Bu bölümde, bu test türlerinin her birinin ne olduğunu, Vue uygulamalarına nasıl uygulanabileceğini ve bazı genel önerilerde bulunacağız.

## Birim Testi {#unit-testing}

Birim testleri, küçük, izole bir kod parçasının beklentilere uygun çalıştığını doğrulamak için yazılır. Bir birim testi genellikle tek bir fonksiyonu, sınıfı, composable'ı veya modülü kapsar. Birim testleri mantıksal doğruluğa odaklanır ve yalnızca uygulamanın genel işlevselliğinin küçük bir kısmıyla ilgilenirler. Uygulamanızın ortamının büyük kısımlarını (örn. başlangıç durumu, karmaşık sınıflar, üçüncü parti modüller ve ağ istekleri) taklit edebilirler.

Genel olarak, birim testleri bir fonksiyonun iş mantığı ve mantıksal doğruluğuyla ilgili sorunları yakalar.

Örneğin bu `increment` fonksiyonunu ele alalım:

```js
// helpers.js
export function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

> Bu nedenle, birim test yazacağız. 

Çünkü bu, oldukça kendine yeterlidir, increment fonksiyonunu çağırmak ve beklediği sonucu döndürdüğünü doğrulamak kolay olacaktır.

Bu ifadelerden herhangi biri başarısız olursa, sorunun `increment` fonksiyonu içinde barındırıldığı açıktır.

```js{4-16}
// helpers.spec.js
import { increment } from './helpers'

describe('increment', () => {
  test('mevcut sayıyı 1 artırır', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('mevcut sayıyı üst sınırdan fazla artırmaz', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('varsayılan üst sınır değeri 10\'dur', () => {
    expect(increment(10)).toBe(10)
  })
})
```

Daha önce de belirtildiği gibi, birim testi genellikle UI render etme, ağ istekleri veya diğer çevresel kaygıları içermeyen, kendine yeterli iş mantığı, bileşenler, sınıflar, modüller veya fonksiyonlar için uygulanır.

Bu genellikle Vue ile alakasız düz JavaScript / TypeScript modülleridir. Genel olarak, Vue uygulamalarında iş mantığı için birim testleri yazmak, diğer çerçeveleri kullanan uygulamalardan önemli ölçüde farklılık göstermez.

Vue'ya özgü özellikleri birim testleri için test edebileceğiniz iki durum vardır:

1. Composables
2. Bileşenler

### Composables {#composables}

Vue uygulamalarına özgü olan bir fonksiyon kategorisi `Composables` dır ve testler sırasında özel bir işleme gerektirebilir. Daha fazla ayrıntı için aşağıdaki `Composable'ların Test Edilmesi` kısmına bakın.

### Bileşenlerin Birim Testi {#unit-testing-components}

Bir bileşen iki şekilde test edilebilir:

1. Beyaz kutu: Birim Testi
   - "Beyaz kutu testleri" bileşenin uygulama ayrıntılarını ve bağımlılıklarını biliyor. Test edilen bileşenin **izole** edilmesine odaklanırlar. Bu testler genellikle bileşeninizin çocuklarından bir kısmını taklit etmekle ilgilenir ve eklenti durumu ve bağımlılıkları (örn. Pinia) ayarlamak gerekir.

2. Siyah kutu: Bileşen Testi
   - "Siyah kutu testleri" bileşenin uygulama ayrıntılarını bilmezler. Bu testler, bileşeninizin ve tüm sistemin entegrasyonunu test etmek için gereksiz şekilde taklit eder. Genellikle tüm çocuk bileşenlerini render ederler ve daha çok bir "entegrasyon testi" olarak kabul edilir. Aşağıdaki `Bileşen Testi önerileri` kısmına bakın.

### Öneri {#recommendation}

- [Vitest](https://vitest.dev/) 

  `create-vue` tarafından oluşturulan resmi kurulum [Vite](https://vitejs.dev/) üzerine inşa edildiğinden, aynı yapılandırmayı ve dönüşüm hattını Vite'den doğrudan kullanılabilen bir birim test çerçevesi kullanmanızı öneririz. [Vitest](https://vitest.dev/), bu amaç için özel olarak tasarlanmış bir birim test çerçevesidir ve Vue / Vite ekip üyeleri tarafından oluşturulup bakıma alınmaktadır. Vite tabanlı projelerle en az çaba ile entegre olur ve son derece hızlıdır.

### Diğer Seçenekler {#other-options}

- [Jest](https://jestjs.io/) popüler bir birim test çerçevesidir. Ancak, mevcut bir Jest test paketinizi Vite tabanlı bir projeye taşımak gerektiğinde Jest'i önermekteyiz, çünkü Vitest daha sorunsuz bir entegrasyon ve daha iyi performans sunmaktadır.

## Bileşen Testi {#component-testing}

Vue uygulamalarında bileşenler, UI'nın ana yapı taşlarıdır. Bu nedenle, uygulamanızın davranışını doğrulama açısından bileşenler doğal bir izolasyon birimi olarak kabul edilir. Granülarite açısından, bileşen testi birim testinin üzerinde bir yerde durur ve entegrasyon testinin bir türü olarak kabul edilebilir. Vue uygulamanızın büyük bir kısmı bir bileşen testi tarafından kapsanmalıdır ve her Vue bileşeninin kendi spesifikasyon dosyasına sahip olmasını öneriyoruz.

Bileşen testleri, bileşeninizin props, olaylar, sağladığı slotlar, stiller, sınıflar, yaşam döngüsü kancaları ve daha fazlasıyla ilgili sorunları yakalamalıdır.

Bileşen testleri, çocuk bileşenlerini taklit etmemeli, bunun yerine bileşeniniz ve çocukları arasındaki etkileşimleri bir kullanıcı gibi etkileşimde bulunarak test etmelidir. Örneğin, bir bileşen testi bir öğeye kullanıcı gibi tıklamalıdır; programatik olarak bileşenle etkileşimde bulunmak yerine.

Bileşen testleri, bileşenin genel arayüzüne odaklanmalı, iç uygulama ayrıntılarına değil. Çoğu bileşen için, genel arayüz yalnızca: yayınlanan olaylar, props ve slotlar ile sınırlıdır. Test yaparken, **bir bileşenin ne yaptığını test edin, nasıl yaptığını değil**.

**YAPIN**

- **Görsel** mantık için: girilen props ve slotlara dayalı doğru render çıktısını doğrulayın.
- **Davranışsal** mantık için: kullanıcı giriş olaylarına yanıt olarak doğru render güncellemelerini veya yayımlanan olayları doğrulayın.

Aşağıdaki örnekte, "increment" etiketiyle tanımlanmış ve tıklanabilir bir DOM öğesi içeren bir Stepper bileşenini gösteriyoruz. Bir artırmanın `2` aşamasını geçmesini engelleyen `max` adlı bir prop geçiriyoruz, bu nedenle butona 3 kez tıklarsak UI hala `2` demelidir.

Stepper'ın uygulamasını hiçbir şey bilmemekteyiz, tek bildiğimiz "girdi" `max` prop'udur ve "çıkış", DOM'un kullanıcı tarafından görülecek olan durumudur.


  

```js
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

  
  

```js
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

mount(Stepper, {
  props: {
    max: 1
  }
})

cy.get(valueSelector)
  .should('be.visible')
  .and('contain.text', '0')
  .get(buttonSelector)
  .click()
  .get(valueSelector)
  .should('contain.text', '1')
```

  
  

```js
const { getByText } = render(Stepper, {
  props: {
    max: 1
  }
})

getByText('0') // "0" ifadesinin bileşende bulunduğuna dair örtülü doğrulama

const button = getByRole('button', { name: /increment/i })

// Artırma butonumuza bir tıklama olayı gönderin.
await fireEvent.click(button)

getByText('1')

await fireEvent.click(button)
```

  


**YAPMAYIN**

- Bir bileşen örneğinin özel durumunu doğrulamayın veya bileşenin özel yöntemlerini test etmeyin. 

> Bileşenin nihai görevi doğru DOM çıktısını render etmektir, bu nedenle DOM çıktısına odaklanan testler, aynı seviyede doğruluk garantisi sağlar (belki daha fazlası) ve değişikliğe karşı daha sağlam ve dayanıklıdır.

Yalnızca snapshot testlerine güvenmeyin. HTML dizelerini doğrulamak, doğruluğu açıklamaz. Testleri kasıtlı olarak yazın.

Bir yöntemin tam olarak test edilmesi gerekiyorsa, onu bağımsız bir yardımcı fonksiyona çıkarabilir ve ona adanmış bir birim testi yazabilirsiniz. Temiz bir şekilde çıkarılamıyorsa, bileşenin parçası, entegrasyon veya uçtan uca testi olarak test edilebilir.

### Öneri {#recommendation-1}

- [Vitest](https://vitest.dev/) bileşenler veya başsız olarak render edilen composables için (örn. VueUse'deki [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) fonksiyonu). Bileşenler ve DOM, [`@vue/test-utils`](https://github.com/vuejs/test-utils) kullanılarak test edilebilir.

- [Cypress Bileşen Testi](https://on.cypress.io/component), beklenen davranışının düzgün stil render etmesine veya yerel DOM olaylarını tetiklemesine bağımlı olan bileşenler için. [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro) aracılığıyla Testing Library ile birlikte kullanılabilir.

Vitest ve tarayıcı tabanlı çalıştırıcılar arasındaki ana fark hız ve yürütme bağlamıdır. Kısacası, tarayıcı tabanlı çalıştırıcılar, Cypress gibi, node tabanlı çalıştırıcıların (Vitest gibi) yakalayamayacağı sorunları yakalayabilir (örn. stil sorunları, gerçek yerel DOM olayları, çerezler, yerel depolama ve ağ hataları), ancak tarayıcı tabanlı çalıştırıcılar _Vitest'ten çok daha yavaş_ çünkü bir tarayıcı açar, stil sayfalarınızı derler ve daha fazlasını yapar. Cypress, bileşen testini destekleyen bir tarayıcı tabanlı çalıştırıcıdır. Lütfen Vitest'in karşılaştırma sayfasını ([İşte](https://vitest.dev/guide/comparisons.html#cypress)) okuyun en son bilgileri almak için.

### Montaj Kütüphaneleri {#mounting-libraries}

Bileşen testi genellikle test edilen bileşeni izole bir şekilde monte etmeyi, simüle edilmiş kullanıcı giriş olaylarını tetiklemeyi ve render edilmiş DOM çıktısı üzerinde doğrulamayı içerir. Bu görevleri daha basit hale getiren özel yardımcı kütüphaneler vardır.

- [`@vue/test-utils`](https://github.com/vuejs/test-utils), kullanıcılara Vue'ya özgü API'lere erişim sağlamak için yazılmış resmi düşük seviyeli bileşen test kütüphanesidir. Ayrıca, `@testing-library/vue` üzerine kurulu olan daha düşük seviyeli kütüphanedir.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library), uygulama ayrıntılarına dayanmadan bileşenleri test etmeye odaklanmış bir Vue test kütüphanesidir. Rehber ilkesi, testlerin yazılımın kullanıldığı şekilde daha çok benzemesi durumunda, daha fazla güven sağlamasıdır.

Uygulamalardaki bileşenleri test etmek için `@vue/test-utils` kullanmanızı öneriyoruz. `@testing-library/vue`, Expect ekranı ile aynı anda birden fazla bilet bekleyen bileşeni test etme sorunları yaşadığından dikkatle kullanılmalıdır.

### Diğer Seçenekler {#other-options-1}

- [Nightwatch](https://nightwatchjs.org/) Vue Bileşen Testi desteğine sahip bir E2E test çalıştırıcısıdır. ([Örnek Proje](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue), standartlaştırılmış otomasyona dayanan çapraz tarayıcı bileşen testi için bir test otomasyon çerçevesidir. Testing Library ile birlikte de kullanılabilir.

## E2E Testi {#e2e-testing}

Birim testlerin geliştiricilere bir dereceye kadar güven sağlasa da, üretimde dağıtılan bir uygulamanın toplam kapsama sağlama yeteneği sınırlıdır. Sonuç olarak, uçtan uca (E2E) testler, uygulamanızın en önemli yönü olan kullanıcıların uygulamanızı gerçekten kullanırken neler olduğunu kapsar.

Uçtan uca testler, üretim yapısı olan Vue uygulamanız üzerinde ağ istekleri yapan çok sayfalı uygulama davranışlarına odaklanır. Genellikle bir veritabanı veya başka bir arka uç ayarlamayı gerektirir ve hatta canlı bir sahne ortamında çalıştırılabilir.

Uçtan uca testler, yönlendirme, durum yönetimi kitaplığınız, üst düzey bileşenler (örn. bir Uygulama veya Düzen), genel varlıklar veya herhangi bir istek işleme gibi sorunları yakalayacaktır. Daha önce belirtildiği gibi, kritik sorunları yakalayabilirler; bunlar birim testi veya bileşen testleriyle yakalanması imkansız olabilir.

Uçtan uca testler, Vue uygulamanızın herhangi bir kodunu içe aktarmadan tamamen uygulamanızı gerçek bir tarayıcıda tüm sayfalar arasında gezinerek test eder.

Uçtan uca testler, uygulamanızdaki birçok katmanı doğrular. Yerel olarak inşa edilen uygulamanızı veya canlı bir Staging ortamını hedefleyebilirler. Staging ortamında test yapmak, yalnızca ön uç kodunuzu ve statik sunucunuzu değil, tüm ilişkili arka uç hizmetlerini ve altyapısını da kapsar.

> Testleriniz yazılımınızın nasıl kullanıldığına benzer hale geldikçe, size o kadar güvence verebilir. - [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Testing Library'nin Yazarı

Kullanıcı eylemlerinin uygulamanız üzerindeki etkilerini test ederek, E2E testler genellikle bir uygulamanın düzgün çalışıp çalışmadığına dair yüksek güven sağlamak için çok önemlidir.

### E2E Test Çözümü Seçimi {#choosing-an-e2e-testing-solution}

Uçtan uca (E2E) web testleri, güvenilmez (savak) testler ve geliştirme süreçlerini yavaşlatma gibi kötü bir üne sahip olmasına rağmen, modern E2E araçları daha güvenilir, etkileşimde bulunulan ve faydalı testler yapmak için ileri adımlar attı. Bir E2E test çerçevesi seçerken, uygulamanız için bir test çerçevesi seçerken göz önünde bulundurulması gereken hususlar hakkında bazı rehberlik sağlayan bölümler vardır.

#### Çapraz Tarayıcı Testi {#cross-browser-testing}

Uçtan uca (E2E) testlerin bilinen başlıca avantajlarından biri, uygulamanızı birden fazla tarayıcıda test etme yeteneğidir. %100 çapraz tarayıcı kapsama sahip olmak cazip görünse de, çapraz tarayıcı testinin takımın kaynakları üzerinde azalan getirileri olduğunu belirtmek önemlidir, çünkü bunları sürekli olarak çalıştırmak için ek zaman ve makine gücü gerektirir. Sonuç olarak, uygulamanızın ihtiyaç duyduğu toplam çapraz tarayıcı testlerini seçerken bu takası göz önünde bulundurmak önemlidir.

#### Daha Hızlı Geri Bildirim Döngüleri {#faster-feedback-loops}

Uçtan uca (E2E) testlerin ve geliştirmenin başlıca sorunlarından biri, tüm paketin uzun sürmesidir. Genellikle bu, yalnızca sürekli entegrasyon ve dağıtım (CI/CD) hatlarında yapılmaktadır. Modern E2E test çerçeveleri, CI/CD hatlarının önceden olduğundan çok daha hızlı çalışmasını sağlayan paralelleştirme gibi özellikler ekleyerek bunu çözmeye yardımcı olmuştur. Ayrıca, yerel olarak geliştirme yaparken, üzerinizde çalıştığınız sayfa için tek bir testi seçerek çalıştırma yeteneği, aynı zamanda testlerin sıcak yeniden yüklenmesini sağlamak, bir geliştiricinin iş akışını ve verimliliğini artırabilir.

#### Birinci Sınıf Hata Ayıklama Deneyimi {#first-class-debugging-experience}

Geliştiriciler geleneksel olarak bir terminal penceresinde günlükleri tarayarak testlerin neden yanlış gittiğini belirlemeye çalışıyorlardı; modern uçtan uca (E2E) test çerçeveleri, geliştiricilerin zaten aşina oldukları araçları kullanmalarını sağlıyor, örneğin tarayıcı geliştirici araçları.

#### Başsız Modda Görünürlük {#visibility-in-headless-mode}

Uçtan uca (E2E) testler sürekli entegrasyon/dağıtım hatlarında çalıştırıldığında, genellikle görünmez tarayıcılarla (yani, kullanıcı için gözüken bir tarayıcı açılmadan) yürütülür. Modern E2E test çerçevelerinin önemli bir özelliği, hata ayıklama sırasında testin nasıl gerçekleştiğine dair bazı bilgiler sağlayabilen uygulamanın anlık görüntülerini ve/veya videolarını görme yeteneğidir. Tarihsel olarak, bu entegrasyonları sürdürmek zahmetli olmuştur.

### Öneri {#recommendation-2}

- [Playwright](https://playwright.dev/) Chromium, WebKit ve Firefox'u destekleyen harika bir E2E test çözümüdür. Windows, Linux ve macOS üzerinde, yerel veya CI'da, başsız veya başlı olarak çalışabilirsiniz ve Android için Google Chrome ve Mobil Safari için yerel mobil emülasyon desteği vardır. Bilgilendirici bir kullanıcı arayüzü, mükemmel hata ayıklama, yerleşik doğrulamalar, paralelleştirme, izler sunar ve savak testleri ortadan kaldıracak şekilde tasarlanmıştır. [Bileşen Testi](https://playwright.dev/docs/test-components) desteği mevcuttur, ancak deneysel olarak işaretlenmiştir. Playwright açık kaynaklıdır ve Microsoft tarafından bakımı yapılmaktadır.

- [Cypress](https://www.cypress.io/) bilgilendirici bir grafik arayüze, mükemmel hata ayıklama, yerleşik doğrulamalar, kukla, savak direnci ve anlık görüntülere sahiptir. Yukarıda belirtilen bileşen testleri için sağlam destek sağlar, [Component Testing](https://docs.cypress.io/guides/component-testing/introduction) sağlamaktadır. Cypress, Chromium tabanlı tarayıcıları, Firefox ve Electron'u destekler. WebKit desteği mevcuttur, ancak deneysel olarak işaretlenmiştir. Cypress MIT lisanslıdır, ancak paralelleştirme gibi bazı özellikler için Cypress Cloud abonesi olmanın gerekliliği vardır.


  
    ![](../../../images/frameworks/vuejs/public/images/lambdatest.svg)
    
      Test Sponsoru
      Lambdatest, tüm büyük tarayıcılar ve gerçek cihazlar arasında E2E, erişilebilirlik ve görsel regresyon testleri yapma için bulut tabanlı bir platformdur. AI destekli test üretimi ile!
    
  


### Diğer Seçenekler {#other-options-2}

- [Nightwatch](https://nightwatchjs.org/) [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) temelli bir E2E test çözümüdür. Bu, en geniş tarayıcı destek aralığını sağlamaktadır, yerel mobil testleri de içerir. Selenium temelli çözümler, Playwright veya Cypress'a göre daha yavaş olacaktır.

- [WebdriverIO](https://webdriver.io/) Web ve mobil test için WebDriver protokolüne dayanan bir test otomasyon çerçevesidir.

## Tarifler {#recipes}