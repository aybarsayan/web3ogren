---
sidebarDepth: 0
description: Vue CLI, Vue.js geliştirme için kapsamlı bir sistem sunarak hızlı proje oluşturma ve yönetim imkanı sağlar. Bu içerik, Vue CLI bileşenlerini ve eklentilerini ayrıntılı bir şekilde incelemektedir.
keywords: [Vue CLI, Vue.js, geliştirme, proje yönetimi, eklentiler]
---

# Genel Bakış

Vue CLI, hızlı Vue.js geliştirme için tam bir sistem sunmaktadır:

- `@vue/cli` aracılığıyla etkileşimli proje iskeletleri oluşturma.
- Aşağıda belirtilen bir çalışma zaman bağımlılığı (`@vue/cli-service`):
  - Güncellenebilir;
  - Mantıklı varsayılanlarla webpack üzerine inşa edilmiştir;
  - Proje için yapılandırılabilir konfigürasyon dosyası ile;
  - Eklentiler aracılığıyla genişletilebilir.
- Ön uç ekosistemindeki en iyi araçları entegre eden resmi eklentilerden zengin bir koleksiyon.
- Vue.js projelerini oluşturmak ve yönetmek için tam bir grafik kullanıcı arayüzü.

Vue CLI, Vue ekosistemi için standart araçların temelini oluşturmayı hedeflemektedir. **Farklı yapı araçlarının mantıklı varsayılanlarla düzgün bir şekilde çalışmasını** sağlar, böylece uygulamanızı yazmaya odaklanabilir ve konfigürasyonlarla günlerce boğuşmak zorunda kalmazsınız. Aynı zamanda, her aracın konfigürasyonunu değiştirme esnekliğini sunar, böylece dışa aktarma (eject) yapma gereksinimi doğmaz.

---

## Sistemin Bileşenleri

Vue CLI'nin birkaç hareketli parçası vardır - [kaynak kodu](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue)'na baktığınızda, ayrı ayrı yayınlanan birçok paketi içeren bir monorepo bulacaksınız.

### CLI

CLI (`@vue/cli`), global olarak kurulan bir npm paketidir ve terminalinizde `vue` komutunu sağlar. `vue create` aracılığıyla hızlı bir şekilde yeni bir proje yaratma yeteneği sunar. Ayrıca `vue ui` aracılığıyla bir grafik kullanıcı arayüzü kullanarak projelerinizi yönetebilirsiniz. **Bu kılavuzun sonraki bölümlerinde neler yapabileceğine bakalım.**

### CLI Servisi

CLI Servisi (`@vue/cli-service`), bir geliştirme bağımlılığıdır. `@vue/cli` tarafından oluşturulan her projeye yerel olarak kurulan bir npm paketidir.

:::info
CLI Servisi, [webpack](http://webpack.js.org/) ve [webpack-dev-server](https://github.com/webpack/webpack-dev-server) üzerine inşa edilmiştir.
:::

İçerdiği bileşenler şunlardır:

- Diğer CLI Eklentilerini yükleyen temel servis;
- Çoğu uygulama için optimize edilmiş dahili webpack yapılandırması;
- `serve`, `build` ve `inspect` temel komutları ile projedeki `vue-cli-service` ikili dosyası.

> **Not:** [create-react-app](https://github.com/facebookincubator/create-react-app) ile tanıdık iseniz, `@vue/cli-service` kabaca `react-scripts`'in karşılığıdır, ancak özellik seti farklıdır.  
> — Vue CLI Dokümantasyonu

`CLI Servisi` bölümü, detaylı kullanımını kapsamaktadır.

### CLI Eklentileri

CLI Eklentileri, Vue CLI projelerinize isteğe bağlı özellikler sağlayan npm paketleridir; örneğin Babel/TypeScript dönüştürme, ESLint entegrasyonu, birim testleri ve uçtan uca testler. 

Bir Vue CLI eklentisini kolayca tanıyabilirsiniz; çünkü isimleri genellikle `@vue/cli-plugin-` (yerleşik eklentiler için) veya `vue-cli-plugin-` (topluluk eklentileri için) ile başlar.

Projelerinizdeki `vue-cli-service` ikili dosyasını çalıştırdığınızda, projenizin `package.json` dosyasında listelenen tüm CLI Eklentilerini otomatik olarak çözümler ve yükler.

:::tip
Eklentiler, proje oluşturma sürecinin bir parçası olarak dahil edilebilir veya projeye sonradan eklenebilir.
:::

Ayrıca yeniden kullanılabilir ön ayar gruplarına da ayrılabilirler. `Eklentiler ve Ön Ayarlar` bölümünde bunları daha ayrıntılı olarak tartışacağız.