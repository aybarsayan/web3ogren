---
description: CoreUI'nin CSS ve JavaScript'ini projenize Parcel kullanarak dahil etme ve paketleme için resmi kılavuz. Adım adım talimatlarla başlayın ve proje yapınızı oluşturun.
keywords: [CoreUI, Parcel, JavaScript, CSS, Webpack, Sass, Frontend]
---

# Parcel

## Kurulum

CoreUI ile sıfırdan bir Parcel projesi oluşturuyoruz, bu nedenle gerçekten başlamadan önce bazı ön koşullar ve adımlar var. Bu kılaviye Node.js'in kurulu olmasını ve terminale aşinalığınızı gerektirir.

1. **Bir proje klasörü oluşturun ve npm'i ayarlayın.** `my-project` klasörünü oluşturacağız ve etkileşimli soruları sormaması için `-y` argümanıyla npm'i başlatacağız.

   ```sh
   mkdir my-project && cd my-project
   npm init -y
   ```

2. **Parcel'i kurun.** Webpack kılavuzumuzdan farklı olarak, burada yalnızca tek bir derleme aracı bağımlılığı var. Parcel, dil dönüştürücülerini (Sass gibi) otomatik olarak algılayıp yükleyecektir. Bu bağımlılığın yalnızca geliştirme kullanımı için olduğunu belirtmek için `--save-dev` kullanıyoruz.

   ```sh
   npm i --save-dev parcel
   ```

3. **CoreUI'yi kurun.** Şimdi CoreUI'yi kurabiliriz. Ayrıca, açılır menülerimiz, popover'larımız ve tooltip'lerimiz pozisyonları için buna bağımlı olduğu için Popper'ı da kuracağız. Bu bileşenleri kullanmayı planlamıyorsanız, burada Popper'ı atlayabilirsiniz.

   ```sh
   npm i --save @coreui/coreui @popperjs/core
   ```

Gerekli tüm bağımlılıkları kurduğumuza göre, proje dosyalarını oluşturup CoreUI'yi dahil etmeye başlayabiliriz.

## Proje Yapısı

Zaten `my-project` klasörünü oluşturduk ve npm'i başlattık. Şimdi `src` klasörümüzü, stil dosyamızı ve JavaScript dosyamızı oluşturarak proje yapısını tamamlayacağız. Aşağıdakileri `my-project` içerisinden çalıştırın veya aşağıdaki klasör ve dosya yapısını manuel olarak oluşturun.

```sh
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss
```

Tamamlandığında, projeniz şu şekilde görünmelidir:

```text
my-project/
├── src/
│   ├── js/
│   │   └── main.js
│   ├── scss/
│   │   └── styles.scss
│   └── index.html
├── package-lock.json
└── package.json
```

Bu noktada her şey yerli yerinde, ancak Parcel'in sunucumuzu başlatmak için bir HTML sayfasına ve npm betiğine ihtiyacı var.

## Parcel'i Yapılandırın

Bağımlılıklar kuruldu ve proje klasörümüz kod yazmaya hazır durumda, artık Parcel'i yapılandırabilir ve projemizi yerel olarak çalıştırabiliriz. Parcel'in kendisi tasarım gereği yapılandırma dosyası gerektirmez, ancak sunucumuzu başlatmak için bir npm betiğine ve bir HTML dosyasına ihtiyacımız var.

1. **`src/index.html` dosyasını doldurun.** Parcel'in render etmesi için bir sayfaya ihtiyacı var, bu yüzden CSS ve JavaScript dosyalarımızı da içeren bazı temel HTML'yi ayarlamak için `index.html` sayfamızı kullanıyoruz.

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>CoreUI w/ Parcel</title>
       <link rel="stylesheet" href="scss/styles.scss">
       <script type="module" src="js/main.js"></script>
     </head>
     <body>
       <div class="container py-4 px-3 mx-auto">
         <h1>Merhaba, CoreUI ve Parcel!</h1>
         <button class="btn btn-primary">Ana buton</button>
       </div>
     </body>
   </html>
   ```

   CoreUI'nin CSS'inin Webpack aracılığıyla yüklendiğinde görebilmemiz için burada `div class="container"` ve `` ile biraz CoreUI stili ekliyoruz.

   :::info
   Parcel, Sass kullandığımızı otomatik olarak algılayacak ve bunu desteklemek için [Sass Parcel eklentisini](https://parceljs.org/languages/sass/) yükleyecektir. Ancak isterseniz, `npm i --save-dev @parcel/transformer-sass` komutunu manuel olarak da çalıştırabilirsiniz.
   :::

2. **Parcel npm betiklerini ekleyin.** `package.json` dosyasını açın ve aşağıdaki `start` betiğini `scripts` nesnesine ekleyin. Bu betiği, oluşturduğumuz HTML dosyasını `dist` dizinine derledikten sonra Parcel geliştirme sunucumuzu başlatmak için kullanacağız.

   ```json
   {
      // ...
      "scripts": {
        "start": "parcel serve src/index.html --public-url / --dist-dir dist",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      // ...
   }
   ```

3. **Son olarak, Parcel'i başlatabiliriz.** Terminaldeki `my-project` klasöründen, yeni eklenen npm betiğini çalıştırın:

   ```sh
   npm start
   ```

Bu kılavuzun bir sonraki ve son bölümünde, CoreUI'nin tüm CSS ve JavaScript'ini içe aktaracağız.

## CoreUI'yi İçe Aktarın

CoreUI'yi Parcel'e dahil etmek, `styles.scss` dosyamıza ve `main.js` dosyamıza iki içe aktarma gerektirir.

1. **CoreUI'nin CSS'ini içe aktarın.** CoreUI'nin tüm kaynak Sass'ını içe aktarmak için `src/scss/styles.scss` dosyasına aşağıdakileri ekleyin.

   ```scss
   // CoreUI'nin tüm CSS'ini içe aktar
   @import "~@coreui/coreui/scss/coreui";
   ```

   *İsterseniz stillerimizi de bireysel olarak içe aktarabilirsiniz. Ayrıntılar için [Sass içe aktarma belgelerimizi](https://coreui.io/docs/customize/sass#importing) okuyun.*

2. **CoreUI'nin JS'sini içe aktarın.** CoreUI'nin tüm JS'ini içe aktarmak için `src/js/main.js` dosyasına aşağıdakileri ekleyin. Popper, CoreUI aracılığıyla otomatik olarak içe aktarılacaktır.

   
   ```js
   // CoreUI'nin tüm JS'ini içe aktar
   import * as coreui from '@coreui/coreui'
   ```

   Gerekli JS eklentilerini bireysel olarak içe aktararak paket boyutlarını azaltabilirsiniz:

   
   ```js
   import Alert from '@coreui/coreui/js/dist/alert'

   // veya, hangi eklentileri ihtiyacınız olduğunu belirtebilirsiniz:
   import { Tooltip, Toast, Popover } from '@coreui/coreui'
   ```

   :::note
   CoreUI'nin eklentilerini kullanmakla ilgili daha fazla bilgi için [JavaScript belgelerimizi](https://coreui.io/docs/getting-started/javascript) okuyun.
   :::

3. **Ve işte tamam! 🎉** CoreUI'nin kaynak Sass ve JS'si tamamen yüklendikten sonra, yerel geliştirme sunucunuz şimdi şöyle görünmelidir.

   CoreUI bileşenlerini eklemeye başlayabilirsiniz.