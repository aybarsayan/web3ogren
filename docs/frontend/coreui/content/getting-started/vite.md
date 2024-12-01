---
description: Projenizde CoreUI'nun CSS ve JavaScript'ini Vite kullanarak dahil etme ve paketleme ile ilgili resmi rehber.
keywords: [CoreUI, Vite, JavaScript, CSS, Proje Kurulumu]
title: "CoreUI & Vite"
---

## Kurulum

CoreUI ile sıfırdan bir Vite projesi oluşturuyoruz, bu nedenle gerçekten başlamadan önce bazı ön koşullar ve ilk adımlar var. Bu kılavuzun, Node.js'in kurulu olmasını ve terminal bilgisine sahip olmanızı gerektirdiğini unutmayın.

:::tip
**Bir proje klasörü oluşturun ve npm'i kurun.** `my-project` klasörünü oluşturacağız ve npm'i `-y` argümanıyla başlatarak, tüm etkileşimli soruları sormamasını sağlayacağız.
:::

```sh
mkdir my-project && cd my-project
npm init -y
```

1. **Vite'i kurun.** Webpack kılavuzumuzdan farklı olarak, burada yalnızca tek bir yapı aracı bağımlılığı var. Bu bağımlılığın yalnızca geliştirme kullanımı için olduğunu belirtmek için `--save-dev` kullanıyoruz.

   ```sh
   npm i --save-dev vite
   ```

2. **CoreUI'yi kurun.** Şimdi CoreUI'yi kurabiliriz. Ayrıca, açılır menülerimiz, popover'larımız ve tooltip'lerimiz için konumlandırma açısından buna bağımlı olduğundan Popper'ı da kuracağız. Bu bileşenleri kullanmayı planlamıyorsanız, Popper'ı burada atlayabilirsiniz.

   ```sh
   npm i --save @coreui/coreui @popperjs/core
   ```

3. **Ek bağımlılığı kurun.** Vite ve CoreUI'ye ek olarak, CoreUI'nun CSS'ini düzgün bir şekilde içe aktarmak ve paketlemek için başka bir bağımlılığa (Sass) ihtiyacımız var.

   ```sh
   npm i --save-dev sass
   ```

Artık gerekli tüm bağımlılıklar kurulmuş ve ayarlanmış durumda, proje dosyalarını oluşturup CoreUI'yi içe aktarmaya başlayabiliriz.

---

## Proje yapısı

Artık `my-project` klasörünü oluşturmuş ve npm'i başlatmış durumdayız. Şimdi de proje yapısını tamamlamak için `src` klasörümüzü, stil dosyamızı ve JavaScript dosyamızı oluşturacağız. Aşağıdakileri `my-project`'ten çalıştırın veya aşağıda gösterilen klasör ve dosya yapısını manuel olarak oluşturun.

:::info
Bittiğinde, tam projeniz şu şekilde görünmelidir:
:::

```sh
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss vite.config.js
```

```text
my-project/
├── src/
│   ├── js/
│   │   └── main.js
│   └── scss/
│   |   └── styles.scss
|   └── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

Bu noktada her şey doğru yerinde, ancak Vite çalışmayacak çünkü henüz `vite.config.js` dosyamızı doldurmadık.

---

## Vite'i Yapılandırma

Bağımlılıklar kuruldu ve proje klasörümüz kod yazmaya hazır, şimdi Vite'i yapılandırabilir ve projemizi yerel olarak çalıştırabiliriz.

1. **Editörünüzde `vite.config.js` dosyasını açın.** Boş olduğundan, sunucumuzu başlatabilmemiz için biraz temel yapılandırma eklememiz gerekecek. Bu yapılandırmanın bu kısmı, Vite'e proje JavaScript'miz için nerede bakması gerektiğini ve geliştirme sunucusunun nasıl davranması gerektiğini (sıcak yeniden yükleme ile `src` klasöründen çekme) söyler.

   
   ```js
   import { resolve } from 'path'

   export default {
     root: resolve(__dirname, 'src'),
     server: {
       port: 8080
     }
   }
   ```

2. **Şimdi `src/index.html` dosyasını dolduruyoruz.** Bu, Vite'in tarayıcıda yükleyeceği HTML sayfasıdır ve daha sonraki adımlarda ekleyeceğimiz paketi CSS ve JS kullanır.

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>CoreUI w/ Vite</title>
     </head>
     <body>
       <div class="container py-4 px-3 mx-auto">
         <h1>Hello, CoreUI and Vite!</h1>
         <button class="btn btn-primary">Primary button</button>
       </div>
       <script type="module" src="./js/main.js"></script>
     </body>
   </html>
   ```

   CoreUI'nin CSS'inin Vite tarafından yüklendiğini görebilmemiz için burada `div class="container"` ve `` ile biraz CoreUI stili ekliyoruz.

3. **Artık Vite'i çalıştırmak için bir npm betiği oluşturmamız gerekiyor.** `package.json` dosyasını açın ve aşağıda gösterilen `start` betiğini ekleyin (test betiğinizin zaten var olması gerekir). Bu betiği, yerel Vite geliştirme sunucumuzu başlatmak için kullanacağız.

   ```json
   {
     // ...
     "scripts": {
       "start": "vite",
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     // ...
   }
   ```

4. **Ve nihayet, Vite'i başlatabiliriz.** Terminalinizde `my-project` klasöründen, yeni eklenen npm betiğini çalıştırın:

   ```sh
   npm start
   ```

Bu kılavuzun sonraki ve son bölümünde, CoreUI'nın tüm CSS ve JavaScript'ini içe aktaracağız.

---

## CoreUI'yi İçe Aktarın

1. **`vite.config.js` dosyanızda CoreUI'nin Sass içe aktarmasını ayarlayın.** Yapılandırma dosyanız artık tamamlanmış olmalı ve aşağıdaki kesitteki gibi görünmelidir. Buradaki tek yeni kısım, içe aktarımları olabildiğince basit tutmak için `node_modules` içindeki kaynak dosyalarımıza bir takma ad eklemek amacıyla kullandığımız `resolve` bölümüdür.

   
   ```js
   import { resolve } from 'path'

   export default {
     root: path.resolve(__dirname, 'src'),
     resolve: {
       alias: {
         '~coreui': resolve(__dirname, 'node_modules/@coreui/coreui'),
       }
     },
     server: {
       port: 8080,
       hot: true
     }
   }
   ```

2. **Şimdi, CoreUI'nin CSS'sini içe aktaralım.** Aşağıdakini `src/scss/styles.scss` dosyasına ekleyin ve CoreUI'nin tüm kaynak Sass'ını içe aktarın.

   ```scss
   // CoreUI'nin tüm CSS'sini içe aktar
   @import "~@coreui/coreui/scss/coreui";
   ```

   *İsterseniz stil dosyalarımızı tek tek de içe aktarabilirsiniz. Ayrıntılar için `Sass içe aktarma belgelerimizi` okuyun.*

3. **Sonra CSS'i yükleyip CoreUI'nin JavaScript'ini içe aktaralım.** Aşağıdakini `src/js/main.js` dosyasına ekleyin ve CSS'i yükleyin ve CoreUI'nin tüm JS'ini içe aktarın. Popper, CoreUI aracılığıyla otomatik olarak içe aktarılacaktır.

   
   ```js
   // Özel CSS'imizi içe aktar
   import '../scss/styles.scss'

   // CoreUI'nin tüm JS'ini içe aktar
   import * as coreui from '@coreui/coreui'
   ```

   Paket boyutlarını azaltmak için gerektiğinde JavaScript eklentilerini de tek tek içe aktarabilirsiniz:

   
   ```js
   import Alert from '@coreui/coreui/js/dist/alert';

   // veya, hangi eklentileri gerektiğini belirleyin:
   import { Tooltip, Toast, Popover } from '@coreui/coreui';
   ```

   *CoreUI'nin eklentilerini kullanma hakkında daha fazla bilgi için `JavaScript belgelerimizi` okuyun.*

4. **Ve işte buradasınız! 🎉** CoreUI'nin kaynak Sass ve JS'i tamamen yüklendi, yerel geliştirme sunucunuz artık böyle görünmelidir.

   Artık kullanmak istediğiniz CoreUI bileşenlerini eklemeye başlayabilirsiniz.