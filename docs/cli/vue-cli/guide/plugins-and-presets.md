---
description: Eklentiler ve ön ayarlar, Vue CLI ile projelerinizi özelleştirmenize yardımcı olur. Bu içerikte, eklentilerin nasıl yükleneceği, proje yerel eklentileri ve ön ayarların nasıl kullanılacağı hakkında bilgi bulacaksınız.
keywords: [Vue CLI, eklenti, ön ayar, proje geliştirme, yapılandırma]
---

# Eklentiler ve Ön Ayarlar

## Eklentiler

Vue CLI, eklenti tabanlı bir mimari kullanır. Yeni oluşturulan bir projenin `package.json` dosyasını incelediğinizde, `@vue/cli-plugin-` ile başlayan bağımlılıklar bulacaksınız. **Eklentiler**, dahili webpack yapılandırmasını değiştirebilir ve `vue-cli-service`'e komutlar enjekte edebilir. Proje oluşturma süreci sırasında listelenen çoğu özellik **eklentiler** olarak uygulanmıştır.

Eklenti tabanlı mimari, Vue CLI'yi esnek ve genişletilebilir hale getirir. Bir eklenti geliştirmekle ilgileniyorsanız, `Eklenti Geliştirme Kılavuzu` 'na göz atabilirsiniz.

::: tip
Eklentileri `vue ui` komutuyla GUI kullanarak yükleyebilir ve yönetebilirsiniz.
:::

### Mevcut Bir Projede Eklentileri Yüklemek

Her CLI eklentisi bir jeneratör (dosyaları oluşturan) ve bir çalışma zamanı eklentisi (temel webpack yapılandırmasını ayarlayan ve komutlar enjekte eden) ile birlikte gelir. `vue create` kullanarak yeni bir proje oluşturduğunuzda, özellik seçiminize göre bazı eklentiler sizin için önceden yüklenmiş olacaktır. Zaten oluşturulmuş bir projeye eklenti yüklemek istiyorsanız, bunu `vue add` komutuyla yapabilirsiniz:

```bash
vue add eslint
```

::: tip
`vue add`, Vue CLI eklentilerini yüklemek ve çalıştırmak için özel olarak tasarlanmıştır. Normal npm paketleri için bir alternatif olarak düşünülmemelidir. Normal npm paketleri için, yine de tercih ettiğiniz paket yöneticisini kullanmalısınız.
:::

::: warning
`vue add` komutunu çalıştırmadan önce projenizin mevcut durumunu kaydetmeniz önerilir, çünkü bu komut eklentinin dosya jeneratörünü çağıracak ve mevcut dosyalarınızda değişiklikler yapabilir.
:::

Komut `@vue/eslint`'i tam paket adı olan `@vue/cli-plugin-eslint` olarak çözümler, npm'den yükler ve jeneratörünü çalıştırır.

```bash
# bunlar önceki kullanım ile eşdeğerdir
vue add cli-plugin-eslint
```

`@vue` öneki olmadan kullanılan komut, başka bir paket çözümler. Örneğin, 3. parti eklenti `vue-cli-plugin-apollo`'yu yüklemek için:

```bash
# vue-cli-plugin-apollo'yu yükler ve çalıştırır
vue add apollo
```

Ayrıca belirli bir kapsam altındaki 3. parti eklentileri de kullanabilirsiniz. Örneğin, bir eklenti `@foo/vue-cli-plugin-bar` adını taşıyorsa, bunu şu şekilde ekleyebilirsiniz:

```bash
vue add @foo/bar
```

Yukarıda verilen eklentilere jeneratör seçenekleri geçebilirsiniz (bu, istemleri atlar):

```bash
vue add eslint --config airbnb --lintOn save
```

Eğer bir eklenti zaten yüklenmişse, yüklemeyi atlayabilir ve yalnızca jeneratörünü `vue invoke` komutuyla çalıştırabilirsiniz. Komut, `vue add` ile aynı argümanları alır.

::: tip
Herhangi bir nedenle eklentileriniz farklı bir `package.json` dosyasında listelenmişse, projenizin `package.json` dosyasında `vuePlugins.resolveFrom` seçeneğini, diğer `package.json` dosyasını içeren klasörün yoluyla ayarlayabilirsiniz.

Örneğin, bir `.config/package.json` dosyanız varsa:

```json
{
  "vuePlugins": {
    "resolveFrom": ".config"
  }
}
```
:::

### Proje Yerel Eklentisi

Eğer proje içinde eklenti API'sine erişiminiz gerekiyorsa ve bunun için tam bir eklenti oluşturmak istemiyorsanız, `package.json` dosyanızda `vuePlugins.service` seçeneğini kullanabilirsiniz:

```json
{
  "vuePlugins": {
    "service": ["my-commands.js"]
  }
}
```

Her dosya, eklenti API'sini ilk argüman olarak alan bir fonksiyon dışa aktarmalıdır. Eklenti API'si hakkında daha fazla bilgi için `Eklenti Geliştirme Kılavuzu` 'na göz atın.

Ayrıca `vuePlugins.ui` seçeneği ile UI eklentisi gibi davranacak dosyalar da ekleyebilirsiniz:

```json
{
  "vuePlugins": {
    "ui": ["my-ui.js"]
  }
}
```

Daha fazla bilgi için `UI Eklenti API'si` 'ni okuyun.

## Ön Ayarlar

Bir Vue CLI ön ayarı, yeni bir proje oluşturmak için önceden tanımlanmış seçenekleri ve eklentileri içeren bir JSON nesnesidir, böylece kullanıcı bunları seçmek için istemleri geçmek zorunda kalmaz.

`vue create` sırasında kaydedilen ön ayarlar, kullanıcı ana dizininde bir yapılandırma dosyasında (`~/.vuerc`) saklanır. Bu dosyayı doğrudan düzenleyerek kaydedilen ön ayarları değiştirebilir / ekleyebilir / silebilirsiniz.

> Örnek bir ön ayar:
> 
> ``` json
> {
>   "useConfigFiles": true,
>   "cssPreprocessor": "sass",
>   "plugins": {
>     "@vue/cli-plugin-babel": {},
>     "@vue/cli-plugin-eslint": {
>       "config": "airbnb",
>       "lintOn": ["save", "commit"]
>     },
>     "@vue/cli-plugin-router": {},
>     "@vue/cli-plugin-vuex": {}
>   }
> }
> ```
> — Vue CLI İçerik Takımı

Ön ayar verileri, eklenti jeneratörleri tarafından karşılık gelen proje dosyalarını oluşturmak için kullanılır. Yukarıdaki alanlara ek olarak, entegre araçlar için ek yapılandırmalar da ekleyebilirsiniz:

``` json
{
  "useConfigFiles": true,
  "plugins": {...},
  "configs": {
    "vue": {...},
    "postcss": {...},
    "eslintConfig": {...},
    "jest": {...}
  }
}
```

Bu ek yapılandırmalar, `useConfigFiles` değerine bağlı olarak `package.json` veya karşılık gelen yapılandırma dosyalarına birleştirilecektir. Örneğin, `"useConfigFiles": true` ile `configs.vue` değerinin `vue.config.js` içine birleştirilecektir.

### Ön Ayar Eklenti Sürüm Yönetimi

Kullanılan eklentilerin sürümlerini açıkça belirtebilirsiniz:

``` json
{
  "plugins": {
    "@vue/cli-plugin-eslint": {
      "version": "^3.0.0",
      // ... bu eklenti için diğer seçenekler
    }
  }
}
```

Bu, resmi eklentiler için zorunlu değildir - atlandığında, CLI otomatik olarak kayıtlı en son sürümü kullanacaktır. Ancak, **bir ön ayarda listelenen herhangi bir 3. parti eklenti için açık bir sürüm aralığı sağlamak önerilir**.

### Eklenti İstemlerine İzin Verme

Her eklenti, proje oluşturma sürecinde kendi istemlerini enjekte edebilir، ancak bir ön ayar kullanıyorsanız bu istemler atlanır çünkü Vue CLI, tüm eklenti seçeneklerinin zaten ön ayarda bildirildiğini varsayar.

Bazı durumlarda, ön ayarın yalnızca istenen eklentileri bildirmesini isteyebilirken, kullanıcının eklentiler tarafından enjekte edilen istemlerden geçmesine izin vererek esneklik sağlamak isteyebilirsiniz.

Böyle senaryolar için, bir eklentinin seçeneklerine `"prompts": true` belirterek istemlerinin enjekte edilmesine izin verebilirsiniz:

``` json
{
  "plugins": {
    "@vue/cli-plugin-eslint": {
      // kullanıcıların kendi ESLint yapılandırmalarını seçmesine izin verin
      "prompts": true
    }
  }
}
```

### Uzak Ön Ayarlar

Bir ön ayarı diğer geliştiricilerle paylaşmak için onu bir git deposunda yayınlayabilirsiniz. Repo aşağıdaki dosyaları içerebilir:

- `preset.json`: ön ayar verilerini içeren ana dosya (zorunlu).
- `generator.js`: projede dosyaları enjekte veya değiştirebilen bir `Jeneratör`.
- `prompts.js`: jeneratör için seçenekleri toplayabilen bir `istek dosyası`.

Repo yayınlandıktan sonra, bir projeyi oluştururken uzak ön ayarı kullanmak için `--preset` seçeneğini kullanabilirsiniz:

```bash
# GitHub reposundan ön ayarı kullan
vue create --preset username/repo my-project
```

GitLab ve BitBucket da desteklenmektedir. Özel reposlardan çekim yapıyorsanız `--clone` seçeneğini kullandığınızdan emin olun:

```bash
vue create --preset gitlab:username/repo --clone my-project
vue create --preset bitbucket:username/repo --clone my-project

# kendi barındırılan reposlar
vue create --preset gitlab:my-gitlab-server.com:group/projectname --clone my-project
vue create --preset direct:ssh://git@my-gitlab-server.com/group/projectname.git --clone my-project
```

### Yerel Dosya Sistemi Ön Ayarı

Uzak bir ön ayar geliştirirken, ön ayarı bir uzak repo üzerine sık sık itmek zorunda kalmak sıkıcı olabilir. İş akışını basitleştirmek için, yerel ön ayarlarla doğrudan çalışabilirsiniz. Vue CLI, `--preset` seçeneğinin değeri bir göreli veya mutlak dosya yolu olduğunda veya `.json` ile bittiğinde yerel ön ayarları yükleyecektir:

```bash
# ./my-preset, preset.json dosyasını içeren bir dizin olmalıdır
vue create --preset ./my-preset my-project

# veya cwd'deki bir json dosyasını doğrudan kullanın:
vue create --preset my-preset.json my-project