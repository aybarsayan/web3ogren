---
description: CoreUI'nin CSS ve JavaScript'ini projenize Webpack kullanarak nasıl dahil edeceğinize dair resmi kılavuz. Bu kılavuz, gerekli adımlar ve yapılandırmalar hakkında bilgi vermektedir.
keywords: [CoreUI, Webpack, JavaScript, CSS, kurulum, kılavuz, frontend]
---

# Wabpack

## Kurulum

CoreUI ile sıfırdan bir Webpack projesi oluşturuyoruz, bu nedenle gerçekten başlamadan önce bazı ön koşullar ve adımlar var. Bu kılavuz, Node.js'in yüklü olmasını ve terminal ile bir miktar aşinalığı gerektirir.

:::tip
Bir proje klasörü oluşturun ve npm'i kurun.
:::

1. **Bir proje klasörü oluşturun ve npm'i kurun.** `my-project` klasörünü oluşturacak ve npm'i etkileşimli soruları sormaması için `-y` argümanıyla başlatacağız.

   ```sh
   mkdir my-project && cd my-project
   npm init -y
   ```

2. **Webpack'i kurun.** Bir sonraki adımda, Webpack'in çekirdek bileşeni için `webpack`, terminalden Webpack komutlarını çalıştırabilmemiz için `webpack-cli` ve yerel bir geliştirme sunucusu çalıştırabilmemiz için `webpack-dev-server`'ı kurmamız gerekiyor. Bu bağımlılıkların yalnızca geliştirme kullanımı için olduğunu belirtmek için `--save-dev` kullanıyoruz.

   ```sh
   npm i --save-dev webpack webpack-cli webpack-dev-server
   ```

3. **CoreUI'yi kurun.** Şimdi CoreUI'yi kurabiliriz. Aşağı açılır menülerimiz, popover'larımız ve tooltips'lerimiz için konumlandırma gerektirdiğinden Popper'ı da kuracağız. Bu bileşenleri kullanmayı planlamıyorsanız, buradan Popper'ı atlayabilirsiniz.

   ```sh
   npm i --save @coreui/coreui @popperjs/core
   ```

4. **Ek bağımlılıkları kurun.** Webpack ve CoreUI'ye ek olarak, CoreUI'nin CSS'ini ve JS'ini Webpack ile uygun bir şekilde içe aktarmak ve paketlemek için birkaç bağımlılığa daha ihtiyacımız var. Bunlar Sass, bazı yükleyiciler ve Autoprefixer'ı içerir.

   ```sh
   npm i --save-dev autoprefixer css-loader postcss-loader sass sass-loader style-loader
   ```

Tüm gerekli bağımlılıkları kurduğumuzda, proje dosyalarını oluşturup CoreUI'yi içe aktarmaya başlayabiliriz.

## Proje yapısı

Artık `my-project` klasörünü oluşturduk ve npm'i başlattık. Şimdi projenin yapısını tamamlamak için `src` ve `dist` klasörlerini de oluşturacağız. Aşağıdaki komutu `my-project` dizininden çalıştırın veya gösterilen klasör ve dosya yapısını manuel olarak oluşturun.

```sh
mkdir {dist,src,src/js,src/scss}
touch dist/index.html src/js/main.js src/scss/styles.scss webpack.config.js
```

Tamamladığınızda, projeniz şu şekilde görünmelidir:

```text
my-project/
├── dist/
│   └── index.html
├── src/
│   ├── js/
│   │   └── main.js
│   └── scss/
│       └── styles.scss
├── package-lock.json
├── package.json
└── webpack.config.js
```

Bu noktada her şey doğru yerde, ancak `webpack.config.js` dosyamızı henüz doldurmadığımız için Webpack çalışmayacak.

## Webpack'i yapılandırın

Bağımlılıklar kurulu ve proje klasörümüz kod yazmaya hazır, artık Webpack'i yapılandırabilir ve projemizi yerel olarak çalıştırabiliriz.

1. **`webpack.config.js` dosyasını düzenleyicinizde açın.** Boş olduğu için, sunucumuzu başlatabilmemiz için bazı temel yapılandırmalar eklememiz gerekecek. Bu yapılandırma, Webpack'e projemizin JavaScript'ini nerede bulacağını, derlenmiş kodun nereye çıkacağını (`dist`) ve geliştirme sunucusunun nasıl davranması gerektiğini (sıcak yeniden yükleme ile `dist` klasöründen çekerek) söyler.

   ```js
   const path = require('path')

   module.exports = {
     entry: './src/js/main.js',
     output: {
       filename: 'main.js',
       path: path.resolve(__dirname, 'dist')
     },
     devServer: {
       static: path.resolve(__dirname, 'dist'),
       port: 8080,
       hot: true
     }
   }
   ```

2. **Sonrasında `dist/index.html` dosyamızı dolduruyoruz.** Bu, Webpack'in daha sonraki adımlarda ekleyeceğimiz paketlenmiş CSS ve JS'i kullanmak için tarayıcıda yükleyeceği HTML sayfasıdır. Bunu yapmadan önce bir şeyleri render etmek için bir şeyler vermemiz ve önceki adımda belirtilen `output` JS'i dahil etmemiz gerekiyor.

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>CoreUI w/ Webpack</title>
     </head>
     <body>
       <div class="container py-4 px-3 mx-auto">
         <h1>Merhaba, CoreUI ve Webpack!</h1>
         <button class="btn btn-primary">Ana buton</button>
       </div>
       <script src="./main.js"></script>
     </body>
   </html>
   ```

   Webpack'in CoreUI'nın CSS'ini yüklediğini görebilmemiz için burada `div class="container"` ve `` ile biraz CoreUI stilini dahil ediyoruz.

3. **Artık Webpack'i çalıştırmak için bir npm komutuna ihtiyacımız var.** `package.json` dosyasını açın ve aşağıda gösterilen `start` komutunu ekleyin (zaten bir test komutunuz olmalı). Bu komutu, yerel Webpack geliştirme sunucumuzu başlatmak için kullanacağız.

   ```json
   {
     // ...
     "scripts": {
       "start": "webpack serve --mode development",
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     // ...
   }
   ```

4. **Son olarak, Webpack'i başlatabiliriz.** Terminalde `my-project` klasöründen yeni eklediğimiz npm komutunu çalıştırın:

   ```sh
   npm start
   ```

Bu kılavuzun bir sonraki ve son bölümünde, Webpack yükleyicilerini ayarlayacağız ve CoreUI'nın CSS'ini ve JavaScript'ini içe aktaracağız.

## CoreUI'yı içe aktarın

CoreUI'yı Webpack'e dahil etmek, ilk bölümde kurduğumuz yükleyicileri gerektirir. Bunları npm ile kurduk, ancak şimdi Webpack'in bunları kullanacak şekilde yapılandırılması gerekiyor.

1. **`webpack.config.js`'da yükleyicileri ayarlayın.** Yapılandırma dosyanız artık tamamlanmış olmalı ve aşağıdaki kod parçasına uygun olmalıdır. Buradaki tek yeni kısım `module` bölümüdür.

   ```js
   const path = require('path')

   module.exports = {
     entry: './src/js/main.js',
     output: {
       filename: 'main.js',
       path: path.resolve(__dirname, 'dist')
     },
     devServer: {
       static: path.resolve(__dirname, 'dist'),
       port: 8080,
       hot: true
     },
     module: {
       rules: [
         {
           test: /\.(scss)$/,
           use: [
             {
               loader: 'style-loader'
             },
             {
               loader: 'css-loader'
             },
             {
               loader: 'postcss-loader',
               options: {
                 postcssOptions: {
                   plugins: [
                     require('autoprefixer')
                   ]
                 }
               }
             },
             {
               loader: 'sass-loader'
             }
           ]
         }
       ]
     }
   }
   ```

   İşte neden bu yükleyicilere ihtiyacımız olduğuna dair bir özet. `style-loader`, CSS'i HTML sayfasının `` bölümünde bir `` etiketine enjekte eder. `css-loader` `@import` ve `url()` kullanımını kolaylaştırır. `postcss-loader` Autoprefixer için gereklidir ve `sass-loader` Sass kullanmamıza olanak tanır.

2. **Artık CoreUI'nın CSS'ini içe aktaralım.** `src/scss/styles.scss` dosyasına CoreUI'nın tüm kaynak Sass'ını içe aktarmak için aşağıdakini ekleyin.

   ```scss
   // CoreUI'nın tüm CSS'ini içe aktar
   @import "~@coreui/coreui/scss/coreui";
   ```

   *Ayrıca, isterseniz stil dosyalarımızı tek tek içe aktarabilirsiniz. Detaylar için `Sass içe aktarma belgelerimizi` okuyun.*

3. **Sonrasında CSS'i yükleyelim ve CoreUI'nın JavaScript'ini içe aktaralım.** `src/js/main.js` dosyasına CSS'i yüklemek ve CoreUI'nın tüm JS'ini içe almak için aşağıdakini ekleyin. Popper, CoreUI aracılığıyla otomatik olarak içe aktarılacak.

   
   ```js
   // Özel CSS'imizi içe aktar
   import '../scss/styles.scss'

   // CoreUI'nın tüm JS'ini içe aktar
   import * as coreui from '@coreui/coreui'
   ```

   Ayrıca gerekir ise JavaScript eklentilerini tek tek içe aktarabilirsiniz:

   
   ```js
   import Alert from '@coreui/coreui/js/dist/alert'

   // veya, hangi eklentilere ihtiyacınız olduğunu belirtin:
   import { Tooltip, Toast, Popover } from '@coreui/coreui'
   ```

   *CoreUI'nın eklentilerini nasıl kullanacağınız hakkında daha fazla bilgi için `JavaScript belgelerimizi` okuyun.*

4. **Ve işte bu kadar! 🎉** CoreUI'nın kaynak Sass'ı ve JS'i tamamen yüklendiğinden, yerel geliştirme sunucunuz artık şu şekilde görünmelidir.

   Artık kullanmak istediğiniz CoreUI bileşenlerini eklemeye başlayabilirsiniz.

## Üretim optimizasyonları

Kurulumunuza bağlı olarak, projeyi üretimde çalıştırmak için faydalı olabilecek ek güvenlik ve hız optimizasyonları uygulamak isteyebilirsiniz.

### CSS'i çıkarma

Yukarıda yapılandırdığımız `style-loader`, CSS'i pakete dahil eder, böylece `dist/index.html` içinde bir CSS dosyasını manuel olarak yüklemeye gerek kalmaz. Ancak, bu yaklaşım sıkı bir İçerik Güvenliği Politikası ile çalışmayabilir ve büyük paket boyutu nedeniyle uygulamanızda bir darboğaz haline gelebilir.

:::info
CSS'i `dist/index.html` dosyasından doğrudan yükleyebilmek için `mini-css-extract-loader` Webpack eklentisini kullanarak ayırın.
:::

Öncelikle, eklentiyi kurun:

```sh
npm install --save-dev mini-css-extract-plugin
```

Sonra, eklentiyi Webpack yapılandırmasında başlatın ve kullanın:

```diff
--- a/webpack/webpack.config.js
+++ b/webpack/webpack.config.js
+const miniCssExtractPlugin = require('mini-css-extract-plugin')
 const path = require('path')

 module.exports = {
   mode: 'development',
   entry: './src/js/main.js',
+  plugins: [new miniCssExtractPlugin()],
   output: {
     filename: "main.js",
     path: path.resolve(__dirname, "dist"),
@@ -18,8 +20,8 @@ module.exports = {
         test: /\.(scss)$/,
         use: [
           {
-            // CSS'i bir `<style>` etiketi ile DOM'a ekler
-            loader: 'style-loader'
+            // CSS'i dahil eden her JS dosyası için CSS'i ayırır
+            loader: miniCssExtractPlugin.loader
           },
           {
```

`npm run build` komutunu tekrar çalıştırdıktan sonra, `dist/main.css` adlı yeni bir dosya oluşacaktır; bu dosya `src/js/main.js` tarafından içe aktarılan tüm CSS'i içerecektir. Artık tarayıcınızda `dist/index.html`'i görüntülediğinizde stil eksik olacaktır, çünkü artık `dist/main.css`'de bulunmaktadır. Üretim CSS'i `dist/index.html` dosyasına aşağıdaki gibi ekleyebilirsiniz:

```diff
--- a/webpack/dist/index.html
+++ b/webpack/dist/index.html
@@ -3,6 +3,7 @@
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
+    <link rel="stylesheet" href="./main.css">
     <title>CoreUI w/ Webpack</title>
   </head>
   <body>
```

### SVG dosyalarını çıkarma

CoreUI'nın CSS'i, çevrimiçi `data:` URI'leri aracılığıyla birçok SVG dosyasına atıfta bulunur. Projeniz için `data:` URI'leri için bir İçerik Güvenliği Politikası tanımlarsanız, bu SVG dosyaları yüklenmeyecektir. Bu problemi aşmak için, Webpack'in varlık modülleri özelliğini kullanarak çevrimiçi SVG dosyalarını çıkarabilirsiniz.

:::warning
Inline SVG dosyalarını çıkarmak için Webpack'i belirli bir şekilde yapılandırmanız gerekecek.
:::

Webpack'i şu şekilde yapılandırın:

```diff
--- a/webpack/webpack.config.js
+++ b/webpack/webpack.config.js
@@ -16,6 +16,14 @@ module.exports = {
   },
   module: {
     rules: [
+      {
+        mimetype: 'image/svg+xml',
+        scheme: 'data',
+        type: 'asset/resource',
+        generator: {
+          filename: 'icons/[hash].svg'
+        }
+      },
       {
         test: /\.(scss)$/,
         use: [
```

`npm run build` komutunu tekrar çalıştırdıktan sonra, SVG dosyalarını `dist/icons` klasörüne çıkaracak ve CSS'den düzgün bir şekilde referans verecektir.