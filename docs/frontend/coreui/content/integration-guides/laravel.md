---
description: Laravel projenizde CoreUI’nin CSS ve JavaScript'ini nasıl ekleyeceğiniz ve paketleyeceğinize dair resmi rehber.
keywords: [CoreUI, Laravel, CSS, JavaScript, projeniz]
---

## Kurulum 

1. **Yeni bir Laravel projesi oluşturun.** Yeni bir Laravel projesi oluşturarak başlayın.

   ```sh
   composer create-project laravel/laravel example-app
   ```

   kurulumdan sonra projeye gidin.

   ```sh
   cd example-app
   ```

2. **CoreUI’yi yükleyin.** Artık CoreUI’yi yükleyebiliriz. Dropdown, popover ve tooltip'lerimizin konumlandırması için Popper'ı da yükleyeceğiz. Bu bileşenleri kullanmayı planlamıyorsanız, Popper'ı burada atlayabilirsiniz.

   ```sh
   npm i --save @coreui/coreui @popperjs/core
   ```

   **PRO kullanıcıları için**

   ```sh
   npm i --save @coreui/coreui-pro @popperjs/core
   ```

:::tip
Gereksiz bağımlılıklar yüklemekten kaçınmak için yalnızca gerekli bileşenleri yüklediğinizden emin olun.
:::

3. **Ek bağımlılık yükleyin.** CoreUI'ya ek olarak, CoreUI’nin CSS'ini düzgün bir şekilde içe aktarmak ve paketlemek için başka bir bağımlılık (Sass) gerekiyor.

   ```sh
   npm i --save-dev sass
   ```

Gerekli tüm bağımlılıkları yükleyip kurduktan sonra, proje dosyalarını oluşturmak ve CoreUI'yi içe aktarmak için çalışmalara başlayabiliriz.

---

## Proje yapısı

Zaten `example-app` klasörünü oluşturduk ve tüm bağımlılıkları yükledik. Şimdi `app.scss` dosyamızı da oluşturacağız. Aşağıdaki komutları `example-app` içinden çalıştırın veya aşağıda gösterilen klasör ve dosya yapısını manuel olarak oluşturun.

```sh
mkdir resources/sass
touch resources/sass/app.scss
```

Ayrıca `app.css` dosyasını kaldırabilirsiniz çünkü ona ihtiyacımız yok.

```sh
rm resources/css/app.css
rmdir resources/css
```

> **Tamamlandığında, projeniz şöyle görünmelidir:**
> 
> ```text
> example-app/
> ├── app/
> ├── bootstrap/
> ├── config/
> ├── database/
> ├── node_modules/
> ├── public/
> ├── resources/
> │   ├── js/
> │   │   ├── app.js
> │   │   └── bootstrap.js
> │   ├── sass/
> │   │   └── app.scss
> │   └── views/
> │       └── welcome.blade.php
> ├── routes/
> ├── storage/
> ├── tests/
> ├── vendor/
> ├── ...
> ├── composer.json
> ├── composer.lock
> ├── package-lock.json
> ├── package.json
> ├── ...
> └── vite.config.js
> ```
> — Laravel Belgeleri

---

## Vite'i Yapılandırma

Bağımlılıklar yüklendi ve proje klasörümüz kodlamaya başlamak için hazır, şimdi Vite'i yapılandırabiliriz.

1. **`vite.config.js` dosyasını editörünüzde açın.** Boş olmadığından, `app.scss` dosyamız ile çalışmak için bazı değişiklikler yapmamız gerekiyor.

   ```diff
   import { defineConfig } from 'vite';
   import laravel from 'laravel-vite-plugin';

   export default defineConfig({
      plugins: [
         laravel({
   -        input: ['resources/css/app.scss', 'resources/js/app.js'],
   +        input: ['resources/sass/app.scss', 'resources/js/app.js'],
            refresh: true,
         }),
      ],
   });
   ```

2. **Sonraki adımda, `resources/views/welcome.blade.php` dosyasını değiştiriyoruz.** Blade dosyamıza SCSS ve JavaScript dosyalarımızı eklememiz gerekiyor.

   ```diff
   <!DOCTYPE html>
   <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
      <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1">

         <title>Laravel</title>

         <!-- Fontlar -->
         <link rel="preconnect" href="https://fonts.bunny.net">
         <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
   +
   +     <!-- Scriptler -->
   +     @vite(['resources/sass/app.scss', 'resources/js/app.js'])

         <!-- Stil -->
   ```

:::info
Vite, Laravel uygulamalarında modern bir geliştirme aracı olarak kullanılır ve CSS ile JavaScript dosyalarını yönetir.
:::

---

## CoreUI'yi İçe Aktarma

1. **Şimdi, CoreUI’nin CSS'ini içe alalım.** CoreUI’nin kaynak Sass’ını içe aktarmak için `resources/sass/app.scss` dosyasına aşağıdakileri ekleyin.

   ```scss
   // CoreUI'nin CSS'inin tamamını içe aktar
   @import "@coreui/coreui/scss/coreui"
   ```

   **PRO kullanıcıları için**

   ```scss
   // CoreUI PRO'nun CSS'inin tamamını içe aktar
   @import "@coreui/coreui-pro/scss/coreui"
   ```

   *İsterseniz stillerimizi bireysel olarak da içe aktarabilirsiniz. Ayrıntılar için `Sass içe aktarma belgelerimizi okuyun`.*

2. **Sonraki adımda CoreUI’nin JavaScript'ini içe aktarıyoruz.** CoreUI’nin JS'inin tamamını içe aktarmak için `resources/js/bootstrap.js` dosyasına aşağıdakileri ekleyin. Popper, CoreUI aracılığıyla otomatik olarak içe aktarılacaktır.
   
   ```js
   // CoreUI'nin JS'inin tamamını içe aktar
   import * as coreui from '@coreui/coreui'

   window.coreui = coreui
   ```

   **PRO kullanıcıları için**
   
   ```js
   // CoreUI PRO'nun JS'inin tamamını içe aktar
   import * as coreui from '@coreui/coreui-pro'

   window.coreui = coreui
   ```

   Ayrıca, paket boyutlarını aşağıda tutmak için gerektiğinde JavaScript eklentilerini bireysel olarak içe aktarabilirsiniz:
   
   ```js
   import { Tooltip, Toast, Popover } from '@coreui/coreui'
   ```

   *CoreUI’nin eklentilerini kullanma hakkında daha fazla bilgi için `JavaScript belgelerimizi okuyun`.*

---

## Laravel Uygulamasını Oluşturma ve Çalıştırma

1. **Artık CSS ve JS dosyalarını oluşturmalıyız.** Terminalde `example-app` klasöründen aşağıdaki komutu çalıştırın.

   ```sh
   npm run build
   ```

2. **Ve nihayet, Laravel Uygulamamızı başlatabiliriz.** Terminalde `example-app` klasöründen şu komutu çalıştırın:

   ```sh
   php artisan serve	
   ```

3. **Ve işte tamam!** 🎉 CoreUI’nin kaynak Sass ve JS dosyaları tamamen yüklendiğinde, yerel geliştirme sunucunuz artık şöyle görünmelidir.

   Artık kullanmak istediğiniz herhangi bir CoreUI bileşenini eklemeye başlayabilirsiniz.