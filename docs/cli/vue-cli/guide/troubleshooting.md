---
description: Bu belge, yaygın Vue CLI sorunlarını ve çözümlerini ele almaktadır. Sorunları çözmek için adım adım yaklaşımı takip etmeniz önemlidir.
keywords: [Vue CLI, sorun giderme, npm, sembolik bağlantılar, yapılandırma, geliştirici notları]
---

# Sorun Giderme

Bu belge, bazı yaygın Vue CLI sorunlarını ve bunların nasıl çözüleceğini kapsamaktadır. Yeni bir sorun açmadan önce her zaman bu adımları takip etmelisiniz.

## `sudo` ile veya `root` olarak kurulum çalıştırma

Eğer `@vue/cli-service`'i `root` kullanıcısı olarak veya `sudo` ile yüklerseniz, paket `postinstall` betiklerini çalıştırırken sorunlar yaşayabilirsiniz.

> **Not:** Bu, npm'in bir güvenlik özelliğidir. İkincil senaryolarını engellemek için npm'in root ayrıcalıklarıyla çalıştırılmaktan kaçınmalısınız çünkü yükleme betikleri istemeden zararlı olabilir.

Ancak, bununla birlikte, bu hatayı aşmak için npm'in `--unsafe-perm` bayrağını ayarlayabilirsiniz. Bu, komutun önüne bir ortam değişkeni ekleyerek yapılabilir, yani:

```bash
npm_config_unsafe_perm=true vue create my-project
```

---

## `node_modules` içindeki Sembolik Bağlantılar

Eğer `npm link` veya `yarn link` ile kurulan bağımlılıklar varsa, ESLint (ve bazen Babel de) bu simli bağımlılıkları doğru bir şekilde çalışmayabilir. Bunun nedeni, [webpack'in varsayılan olarak sembolik bağlantıları gerçek konumlarına çözmesidir](https://webpack.js.org/configuration/resolve/#resolvesymlinks), bu da ESLint / Babel yapılandırma araması kırılmasına neden olur.

:::tip
Bu sorunu aşmanın bir yolu, webpack'te sembolik bağlantılar çözümlemesini manuel olarak devre dışı bırakmaktır.
:::

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  }
}
```

::: warning
`resolve.symlinks`'in devre dışı bırakılması, bağımlılıklarınız `cnpm` veya `pnpm` gibi sembolik bağlantılar kullanan üçüncü taraf npm istemcileri tarafından yüklendiyse, sıcak modül yeniden yüklemeyi bozabilir.
:::