---
title: Dağıtım
description: Vue uygulamalarını dağıtmak için gerekli kılavuzları sunmaktadır. Hem yerel önizleme yöntemlerini hem de farklı barındırma platformları için talimatları içermektedir.
keywords: [Vue, dağıtım, SEO, barındırma, statik dosyalar, PWA, CORS]
---

# Dağıtım

## Genel Kılavuzlar

:::info
Vue CLI'yi, dağıtımının bir parçası olarak statik varlıkları yöneten bir arka uç çerçevesi ile birlikte kullanıyorsanız, yapmanız gereken tek şey Vue CLI'nin oluşturulan dosyaları doğru konumda oluşturduğundan emin olmaktır ve ardından arka uç çerçevenizin dağıtım talimatlarını takip etmektir.
:::

Eğer ön uç uygulamanızı arka uçtan ayrı geliştiriyorsanız - yani arka ucunuz ön uçunuza konuşması için bir API sunuyorsa, o zaman ön uç yalnızca tamamen statik bir uygulama olarak kabul edilir. Oluşturulan içeriği `dist` dizinine herhangi bir statik dosya sunucusuna dağıtabilirsiniz, ancak doğru `publicPath` değerini ayarladığınızdan emin olun.

### Yerelde Önizleme

`dist` dizini bir HTTP sunucusuyla servis edilmek üzere tasarlanmıştır (eğer `publicPath`'ı göreli bir değer olarak yapılandırmadıysanız), dolayısıyla `file://` protokolü üzerinden doğrudan `dist/index.html` dosyasını açarsanız çalışmaz. 

:::tip
Üretim yapınızı yerel olarak önizlemenin en kolay yolu, örneğin [serve](https://github.com/zeit/serve) kullanarak bir Node.js statik dosya sunucusu kullanmaktır:
:::

```bash
npm install -g serve
# -s bayrağı, Tek Sayfa Uygulaması (SPA) modunda servis edilmesini sağlar
# aşağıdaki yönlendirme sorunu ile başa çıkar
serve -s dist
```

### `history.pushState` ile Yönlendirme

:::warning
`history` modunda Vue Router kullanıyorsanız, basit bir statik dosya sunucusu başarısız olacaktır.
:::

Örneğin, eğer Vue Router'ı `/todos/42` rotası ile kullandıysanız, geliştirme sunucusu `localhost:3000/todos/42` isteğine doğru yanıt vermek üzere yapılandırılmıştır, ancak üretim yapısını sunan basit bir statik sunucu 404 hatası verecektir.

Bunu düzeltmek için, statik bir dosyayı eşleşmeyen her isteği `index.html`'ye geri dönecek şekilde üretim sunucunuzu yapılandırmanız gerekecektir. Vue Router belgeleri, yaygın sunucu yapılandırmaları için [yapılandırma talimatları sağlar](https://router.vuejs.org/guide/essentials/history-mode.html).

### CORS

Statik ön uç sunucunuz, arka uç API'nızdan farklı bir alan adına dağıtılmışsa, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) yapılandırmasını doğru bir şekilde yapmanız gerekecektir.

### PWA

Eğer PWA eklentisini kullanıyorsanız, uygulamanızın [Servis Çalışanı](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) doğru bir şekilde kaydedilebilmesi için HTTPS üzerinden servis edilmesi gerekir.

---

## Platform Kılavuzları

### GitHub Pages

#### Güncellemeleri Manuel Olarak Göndermek

1. `vue.config.js` dosyasında doğru `publicPath` değerini ayarlayın.

    Eğer `https://.github.io/` adresine veya özel bir domaine dağıtıyorsanız, `publicPath`'ı atlayabilirsiniz çünkü varsayılan değeri `"/"`'dir.

    Eğer `https://.github.io//` adresine dağıtıyorsanız (yani, deposu `https://github.com//` adresinde ise), `publicPath`'ı `"//"` olarak ayarlayın. Örneğin, eğer depo adınız "my-project" ise, `vue.config.js` şu şekilde görünmelidir:

    ``` js
    // depo kökünüzde yer alacak vue.config.js dosyası

    module.exports = {
      publicPath: process.env.NODE_ENV === 'production'
        ? '/my-project/'
        : '/'
    }
    ```

2. Projeniz içinde aşağıdaki içeriği (vurgulanan satırlar uygun şekilde yorumdan çıkarılmalıdır) içeren `deploy.sh` dosyasını oluşturun ve çalıştırarak dağıtım yapın:

    ```bash{13,20,23}
    #!/usr/bin/env sh

    # hatalarda çıkış yap
    set -e

    # oluşturma
    npm run build

    # oluşturma çıktısı dizinine git
    cd dist

    # eğer özel bir domaine dağıtıyorsanız
    # echo 'www.example.com' > CNAME

    git init
    git add -A
    git commit -m 'dağıtım'

    # eğer https://<KULLANICI_ADI>.github.io adresine dağıtıyorsanız
    # git push -f git@github.com:<KULLANICI_ADI>/<KULLANICI_ADI>.github.io.git main

    # eğer https://<KULLANICI_ADI>.github.io/<REPO> adresine dağıtıyorsanız
    # git push -f git@github.com:<KULLANICI_ADI>/<REPO>.git main:gh-pages

    cd -
    ```

#### Otomatik Güncellemeler İçin Travis CI Kullanma

1. Yukarıda açıklandığı gibi `vue.config.js` dosyasında doğru `publicPath` değerini ayarlayın.

2. Travis CLI istemcisini kurun: `gem install travis && travis --login`

3. GitHub için [erişim belirteci](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) oluşturun ve depo izinlerine sahip olun.

4. Travis işine deponuza erişim izni verin: `travis env set GITHUB_TOKEN xxx` (burada `xxx`, 3. adımda aldığınız kişisel erişim belirtecidir).

5. Projenizin kök dizininde bir `.travis.yml` dosyası oluşturun.

    ```yaml
    language: node_js
    node_js:
      - "node"

    cache: npm

    script: npm run build

    deploy:
      provider: pages
      skip_cleanup: true
      github_token: $GITHUB_TOKEN
      local_dir: dist
      on:
        branch: main
    ```

6. İlk derlemeyi tetiklemek için `.travis.yml` dosyasını deponuza gönderin.

### GitLab Pages

[GitLab Pages belgeleri](https://docs.gitlab.com/ee/user/project/pages/) tarafından açıklandığı gibi, her şey deponuzun kök dizininde yer alacak bir `.gitlab-ci.yml` dosyasıyla gerçekleşir. Bu çalışma örneği size başlangıç noktası sağlayacaktır:

```yaml
# depo kökünüzde yer alacak .gitlab-ci.yml dosyası

pages: # görevin adı sayfalar olmalıdır
  image: node:latest
  stage: deploy
  script:
    - npm ci
    - npm run build
    - mv public public-vue # GitLab Pages, public klasöründe çalışır
    - mv dist public # npm run build'in çıktısı olan dist klasörünü yeniden adlandır
    # isteğe bağlı olarak gzip desteğini aşağıdaki satır ile etkinleştirebilirsiniz:
    - find public -type f -regex '.*\.\(htm\|html\|txt\|text\|js\|css\)$' -exec gzip -f -k {} \;
  artifacts:
    paths:
      - public # artifact yolu GitLab Pages'ın bunu alabilmesi için /public olmalıdır
  only:
    - master
```

Genellikle, statik web siteniz `https://kullaniciAdiniz.gitlab.io/projeAdiniz` adresinde barındırılacaktır, bu nedenle başlangıç `vue.config.js` dosyasını oluşturmak isteyebilirsiniz ve [BASE_URL](https://github.com/vuejs/vue-cli/tree/dev/docs/config#baseurl) değerini proje adınıza göre güncelleyebilirsiniz ([`CI_PROJECT_NAME` ortam değişkeni](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) bu değeri içerir):

```javascript
// depo kökünüzde yer alacak vue.config.js dosyası

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/' + process.env.CI_PROJECT_NAME + '/'
    : '/'
}
```

Proje web sitenizin nerede barındırılacağı hakkında daha fazla bilgi için [GitLab Pages alan adları](https://docs.gitlab.com/ee/user/project/pages/getting_started_part_one.html#gitlab-pages-domain) belgelerini okumanızı tavsiye ederim. Ayrıca, [özel bir alan adı kullanma](https://docs.gitlab.com/ee/user/project/pages/getting_started_part_three.html#adding-your-custom-domain-to-gitlab-pages) seçeneğiniz olduğunu unutmayın.

Deponuza itmeden önce hem `.gitlab-ci.yml` hem de `vue.config.js` dosyalarını taahhüt edin. Başarılı olduğunda bir GitLab CI pipeline'ı tetiklenecek: başarılı olursa, projenizin `Ayarlar > Sayfalar` kısmına gidip web siteniz bağlantısını görecek ve tıklayacaksınız.

### Netlify

1. Netlify'de, aşağıdaki ayarlarla GitHub'dan yeni bir proje oluşturun:

    - **Oluşturma Komutu:** `npm run build` veya `yarn build`
    - **Yayın dizini:** `dist`

2. Dağıtım düğmesine basın!

Ayrıca [vue-cli-plugin-netlify-lambda](https://github.com/netlify/vue-cli-plugin-netlify-lambda) ile göz atın.

#### Vue Router'da tarih modunu kullanma

:::tip
Vue Router'da `history mode` kullanarak doğrudan hit almanız için tüm trafiği `/index.html` dosyasına yönlendirmeniz gerekir.
:::

> Daha fazla bilgi için [Netlify yönlendirme belgelerine](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps) göz atın.

##### Önerilen yöntem

Depo kökünüzde aşağıdaki içeriği barındıran bir `netlify.toml` dosyası oluşturun:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

##### Alternatif yöntem

`/public` altında `_redirects` adında bir dosya oluşturun ve aşağıdaki içeriği ekleyin:

```
# Tek sayfa uygulaması için Netlify ayarları
/*    /index.html   200
```

Eğer [@vue/cli-plugin-pwa](https://cli.vuejs.org/core-plugins/pwa.html#vue-cli-plugin-pwa) kullanıyorsanız, `_redirects` dosyasının servis çalışanı tarafından önbelleğe alınmadığından emin olun. Bunu yapmak için, `vue.config.js`'inize aşağıdakileri ekleyin:
```javascript
// depo kökünüzde yer alacak vue.config.js dosyası

module.exports = {
  pwa: {
      workboxOptions: {
        exclude: [/_redirects/]
      }
    }
}
```
Göz atın [workboxOptions](https://cli.vuejs.org/core-plugins/pwa.html#configuration) ve [exclude](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest#InjectManifest) hakkında daha fazla bilgi için.

### Render

[Render](https://render.com), [ücretsiz statik site barındırma](https://render.com/docs/static-sites) hizmeti sunar; tam yönetilen SSL, global CDN ve GitHub'dan sürekli otomatik dağıtımlar ile.

1. Render'da yeni bir Statik Site oluşturun ve Render'ın GitHub uygulamasına Vue deponuza erişme izni verin.

2. Oluşturma sırasında aşağıdaki değerleri kullanın:

    - **Oluşturma Komutu:** `npm run build` veya `yarn build`
    - **Yayın dizini:** `dist`

Hepsi bu kadar! Uygulamanız, oluşturma tamamlandığında Render URL'nizde canlı olacaktır.

Vue Router'da tarih modunu kullanarak doğrudan hit almanız için, `Yönlendirmeler/Yeniden Yönlendirmeler` sekmesinde aşağıdaki yeniden yazma kuralını ekleyin.

  - **Kaynak:** `/*`
  - **Hedef:** `/index.html`
  - **Durum** `Yeniden yaz`

Yeniden yönlendirmeleri, yeniden yazmaları ve Render'da [özel alan adlarını](https://render.com/docs/custom-domains) ayarlama hakkında daha fazla bilgi edinin.

### Amazon S3

[vue-cli-plugin-s3-deploy](https://github.com/multiplegeorges/vue-cli-plugin-s3-deploy) kılavuzuna bakın.

### Firebase

Yeni bir Firebase projesi oluşturun [Firebase konsolunuzda](https://console.firebase.google.com). Projenizi nasıl kuracağınızla ilgili bu [belgeye](https://firebase.google.com/docs/web/setup) başvurun.

Global olarak [firebase-tools](https://github.com/firebase/firebase-tools) kurduğunuzdan emin olun:

```bash
npm install -g firebase-tools
```

Projenizin kök dizininden `firebase`'i aşağıdaki komutla başlatın:

```bash
firebase init
```

Firebase, projenizi nasıl yapılandıracağınız hakkında bazı sorular soracaktır.

- Projeniz için hangi Firebase CLI özelliklerini yapılandırmak istersiniz? `hosting` seçeneğini seçtiğinizden emin olun.
- Projeniz için varsayılan Firebase projesini seçin.
- `public` dizininizi `dist` (veya oluşturma çıktınızın bulunduğu dizin) olarak ayarlayın; bu, Firebase Hosting'e yüklenecektir.

```javascript
// firebase.json

{
  "hosting": {
    "public": "dist"
  }
}
```

- Projenizi tek sayfa uygulaması olarak yapılandırmak için `evet` seçin. Bu, `dist` klasörünüze bir `index.html` oluşturacak ve `hosting` bilginizi yapılandıracaktır.

```javascript
// firebase.json

{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

Projenizi derlemek için `npm run build` komutunu çalıştırın.

Projenizi Firebase Hosting'e dağıtmak için aşağıdaki komutu çalıştırın:

```bash
firebase deploy --only hosting
```

Projenizde kullanmak istediğiniz diğer Firebase CLI özelliklerini dağıtmak isterseniz, `--only` seçeneğini kullanmadan `firebase deploy` komutunu çalıştırın.

Artık projenize `https://.firebaseapp.com` veya `https://.web.app` adreslerinden erişebilirsiniz.

Daha fazla detay için [Firebase Belgesine](https://firebase.google.com/docs/hosting/deploying) başvurun.

### Vercel

[Vercel](https://vercel.com/home), geliştiricilerin anında dağıtım yapıp, otomatik olarak ölçeklendirdiği ve gözetim gerektirmeyen Jamstack web siteleri ve web servislerini barındırmasına imkan tanıyan bir bulut platformudur. Güvenli SSL, varlık sıkıştırma ve önbellek geçersiz kılma gibi özellikler sunar.

#### Adım 1: Vercel'e Vue projenizi dağıtma

Vue projenizi [Vercel for Git Entegrasyonu](https://vercel.com/docs/git-integrations) ile dağıtmak için, bir Git deposuna itildiğinden emin olun.

Projeyi Vercel'e [İçe Aktarma Akışı](https://vercel.com/import/git) kullanarak içe aktarın. İçe aktarım sırasında, tüm ilgili [seçenekler](https://vercel.com/docs/build-step#build-&-development-settings) sizin için önceden yapılandırılmış şekilde bulunacak ve gerektiği gibi değiştirebileceksiniz.

Projeniz içe aktarıldıktan sonra, tüm sonraki dallara itilen değişiklikler [Önizleme Dağıtımları](https://vercel.com/docs/platform/deployments#preview) oluştururken, [Üretim Dalında](https://vercel.com/docs/git-integrations#production-branch) (genellikle "master" veya "main") yapılan tüm değişiklikler [Üretim Dağıtımı](https://vercel.com/docs/platform/deployments#production) oluşturacaktır.

Dağıtım yapıldıktan sonra, uygulamanızı canlı olarak görmek için bir URL alacaksınız, örneğin: https://vue-example-tawny.vercel.app/.

#### Adım 2 (isteğe bağlı): Özel Alan Adı Kullanma

Vercel dağıtımınızla bir Özel Alan Adı kullanmak istiyorsanız, Vercel [hesap Alan Adı ayarları](https://vercel.com/dashboard/domains) üzerinden alan adınızı **Ekle** veya **Taşı** işlemi yapabilirsiniz.

Alan adınızı projenize eklemek için, Vercel Panosundan projenize gidin. Projenizi seçtikten sonra "Ayarlar" sekmesine tıklayın, ardından **Alan Adları** menü öğesini seçin. Projenizin **Alan Adı** sayfasından, projenize eklemek istediğiniz alan adını girin.

Alan adınız eklendikten sonra, yapılandırmak için farklı yöntemlerle karşılaşacaksınız.

#### Yeni bir Vue projesi dağıtma

Aşağıdaki Dağıtım Düğmesi ile size bir Git deposu kurulu yeni bir Vue projesi dağıtabilirsiniz:

[![Vercel ile Dağıt](https://vercel.com/button)](https://vercel.com/import/git?s=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmaster%2Fexamples%2Fvue)

## Referanslar:

- [Örnek Kaynak](https://github.com/vercel/vercel/tree/master/examples/vue)
- [Resmi Vercel Kılavuzu](https://vercel.com/guides/deploying-vuejs-to-vercel)
- [Vercel Dağıtım Belgeleri](https://vercel.com/docs)
- [Vercel Özel Alan Adı Belgeleri](https://vercel.com/docs/custom-domains)

### Stdlib

> TODO | Katkıya açık.

### Heroku

1. [Heroku CLI'yi kurun](https://devcenter.heroku.com/articles/heroku-cli)

2. Bir `static.json` dosyası oluşturun:
```json
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
```

3. `static.json` dosyasını git'e ekleyin
```bash
git add static.json
git commit -m "statik yapılandırmayı ekle"
```

4. Heroku'ya dağıtım yapın
```bash
heroku login
heroku create
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static
git push heroku main
```

Daha fazla bilgi için: [Heroku'da SPAs ile başlamaya dair](https://gist.github.com/hone/24b06869b4c1eca701f9)

### Surge

[Surge](http://surge.sh/) ile dağıtmak oldukça basittir.

Öncelikle, projenizi `npm run build` komutunu çalıştırarak oluşturmanız gerekir. Eğer Surge’nin komut satırı aracını yüklemediyseniz, komutu çalıştırarak yükleyebilirsiniz:

```bash
npm install --global surge
```

Ardından, projenizin `dist/` klasörüne gidin ve `surge` komutunu çalıştırın ve ekran talimatlarını takip edin. İlk kez Surge kullanıyorsanız, e-posta ve şifre oluşturmanız istenecektir. Proje klasörüne onay verin ve tercih ettiğiniz alan adını yazın ve projenizin yayımlandığını izleyin.

```
            proje: /Users/user/Documents/myawesomeproject/dist/
         alan adı: myawesomeproject.surge.sh
         yükleme: [====================] 100% eta: 0.0s (31 dosya, 494256 bayt)
            CDN: [====================] 100%
             IP: **.**.***.***

   Başarılı! - myawesomeproject.surge.sh adresine yayımlandı.
```

Projenizin Surge tarafından başarıyla yayımlandığını, `myawesomeproject.surge.sh` adresini ziyaret ederek doğrulayın, işte! Özel alan adları gibi kurulum detayları için [Surge yardım sayfasına](https://surge.sh/help/) göz atabilirsiniz.

### Bitbucket Cloud

1. [Bitbucket belgesinde](https://confluence.atlassian.com/bitbucket/publishing-a-website-on-bitbucket-cloud-221449776.html) açıklandığı gibi, tam olarak `.bitbucket.io` adıyla bir depo oluşturmanız gerekir.

2. Ana deponun bir alt klasörüne yayımlamak mümkündür; örneğin, birden fazla web sitesine sahip olmak istiyorsanız. Bu durumda, `vue.config.js` dosyasında doğru `publicPath` değerini ayarlayın.

    Eğer `https://.bitbucket.io/` adresine dağıtıyorsanız, `publicPath`'ı atlayabilirsiniz çünkü varsayılan değeri `"/"`'dir.

    Eğer `https://.bitbucket.io//` adresine dağıtıyorsanız, `publicPath`'ı `"//"` olarak ayarlayın. Bu durumda deponun dizin yapısı, URL yapısını yansıtmalıdır; örneğin, deponun `/` dizinine sahip olması gerekir.

3. Projeniz içinde aşağıdaki içeriği barındıran bir `deploy.sh` dosyası oluşturun ve çalıştırarak dağıtım yapın:

    ```bash{13,20,23}
    #!/usr/bin/env sh

    # hatalarda çıkış yap
    set -e

    # oluşturma
    npm run build

    # oluşturma çıktısı dizinine git
    cd dist

    git init
    git add -A
    git commit -m 'dağıtım'

    git push -f git@bitbucket.org:<KULLANICI_ADI>/<KULLANICI_ADI>.bitbucket.io.git master

    cd -
    ```

### Docker (Nginx)

Uygulamanızı bir docker konteyneri içinde nginx kullanarak dağıtın.

1. [docker](https://www.docker.com/get-started) kurun.

2. Projenizin kök dizininde bir `Dockerfile` dosyası oluşturun.

    ```docker
    FROM node:latest as build-stage
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY ./ .
    RUN npm run build

    FROM nginx as production-stage
    RUN mkdir /app
    COPY --from=build-stage /app/dist /app
    COPY nginx.conf /etc/nginx/nginx.conf
    ```

3. Projenizin kök dizininde bir `.dockerignore` dosyası oluşturun.

    `.dockerignore` dosyasının ayarlanması, `node_modules` ve yapı aşamasında alınan herhangi bir aracı yapı nesnesinin görüntüye kopyalanmasını engeller; bu, derleme sırasında sorunlar yaratabilir.

    ```
    **/node_modules
    **/dist
    ```

4. Projenizin kök dizininde bir `nginx.conf` dosyası oluşturun.

    `Nginx`, docker konteynerinizde çalışacak bir HTTP(s) sunucusudur. İçeriği nasıl sunacağına/hangi portları dinleyeceğine vb. karar vermek için bir yapılandırma dosyası kullanır. Tüm olası yapılandırma seçenekleri için [nginx yapılandırma belgelerine](https://www.nginx.com/resources/wiki/start/topics/examples/full/) göz atın.

    Aşağıda, Vue projenizi `80` portunda sunan basit bir `nginx` yapılandırması verilmiştir. `page not found` / `404` hataları için ana `index.html` sunulmaktadır; bu, `pushState()` tabanlı yönlendirmeyi kullanmamıza olanak tanır.

    ```nginx
    user  nginx;
    worker_processes  1;
    error_log  /var/log/nginx/error.log warn;
    pid        /var/run/nginx.pid;
    events {
      worker_connections  1024;
    }
    http {
      include       /etc/nginx/mime.types;
      default_type  application/octet-stream;
      log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';
      access_log  /var/log/nginx/access.log  main;
      sendfile        on;
      keepalive_timeout  65;
      server {
        listen       80;
        server_name  localhost;
        location / {
          root   /app;
          index  index.html;
          try_files $uri $uri/ /index.html;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
          root   /usr/share/nginx/html;
        }
      }
    }
    ```

5. Docker görüntünüzü oluşturun.

    ```bash
    docker build . -t my-app
    # Docker daemon'a yükleme durumu  884.7kB
    # ...
    # Başarıyla 4b00e5ee82ae görüntüsü oluşturuldu
    # Başarıyla my-app:latest etiketiyle oluşturuldu
    ```

6. Docker görüntünüzü çalıştırın.

    Bu yapı, resmi `nginx` görüntüsü üzerine kurulmuştur; dolayısıyla günlük yönlendirmesi zaten ayarlanmış ve kendini daemonize etme işlemi kapatılmıştır. Nginx'i bir docker konteynerinde çalıştırmayı iyileştirmek için bazı diğer varsayılan ayarlar yapılmıştır. Daha fazla bilgi için [nginx docker reposuna](https://hub.docker.com/_/nginx) göz atın.

    ```bash
    docker run -d -p 8080:80 my-app
    curl localhost:8080
    # <!DOCTYPE html><html lang=en>...</html>
    ```