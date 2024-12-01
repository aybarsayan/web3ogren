---
description: Eklenti API, @vue/cli-service ile entegre çalışmak için gerekli olan işlevleri ve kullanımları içerir. Bu API, eklentilerle yönetim ve yapılandırma işlemlerini kolaylaştırır.
keywords: [Eklenti API, vue, cli-service, sürüm kontrol, webpack, geliştirme sunucusu]
---

# Eklenti API

## sürüm

:::tip
Eklentiyi yükleyen `@vue/cli-service` sürümünü belirten sürüm dizesi.
:::

## assertVersion

- **Argümanlar**
  - `{integer | string} range` - `@vue/cli-service` tarafından karşılanması gereken bir semver aralığı

- **Kullanım**
  
  api.version genel olarak kullanışlı olsa da, bazen sürümünüzü sadece ilan etmek güzel olabilir.  
  Bu API, bunu yapmanın **basit bir yolunu** sunar.

  Sağlanan sürüm karşılandığında hiçbir şey olmaz. Aksi takdirde bir hata fırlatılır.

  :::note
  Çoğu durumda, [package.json'daki `peerDependencies` alanını](https://docs.npmjs.com/files/package.json#peerdependencies) kullanmanız önerilir.
  :::

## getCwd

- **Kullanım**:  
  Mevcut çalışma dizinini döndürür

## resolve

- **Argümanlar**
  - `{string} path` - proje kökünden itibaren göreceli yol

- **Döner**
  - `{string}` - çözümlenmiş mutlak yol

- **Kullanım**:  
  Mevcut proje için bir yolu çözümleyin

## hasPlugin

- **Argümanlar**
  - `{string} id` - eklenti kimliği, (@vue/|vue-|@scope/vue)-cli-plugin- ön ekini atlayabilir

- **Döner**
  - `{boolean}`

- **Kullanım**:  
  Projenin verilen kimliğe sahip bir eklentisi olup olmadığını kontrol edin

## registerCommand

- **Argümanlar**
  - `{string} name`
  - `{object} [opts]`
  ```js
  {
    description: string,
    usage: string,
    options: { [string]: string }
  }
  ```
  - `{function} fn`
  ```js
  (args: { [string]: string }, rawArgs: string[]) => ?Promise
  ```

- **Kullanım**:  
  `vue-cli-service [name]` olarak kullanılabilir hale gelecek bir komut kaydedin.

## chainWebpack

- **Argümanlar**
  - `{function} fn`

- **Kullanım**:  
  Zincirlenebilir bir webpack yapılandırması alacak bir işlev kaydedin.  
  Bu işlev tembel bir işlevdir ve `resolveWebpackConfig` çağrılmadıkça çağrılmayacaktır.

## configureWebpack

- **Argümanlar**
  - `{object | function} fn`

- **Kullanım**:  
  Yapılandırmaya birleştirilecek bir **webpack yapılandırma nesnesini** **VEYA** ham webpack yapılandırmasını alacak bir işlev kaydedin.  
  İşlev, yapılandırmayı doğrudan değiştirebilir veya webpack yapılandırmasına birleştirilecek bir nesne döndürebilir.

## configureDevServer

- **Argümanlar**
  - `{object | function} fn`

- **Kullanım**:  
  Bir geliştirici sunucu yapılandırma işlevi kaydedin.  
  Express `app` örneğini geliştirme sunucusuna alır.

## resolveWebpackConfig

- **Argümanlar**
  - `{ChainableWebpackConfig} [chainableConfig]`
- **Döner**
  - `{object}` - ham webpack yapılandırması

- **Kullanım**:  
  Webpack'e geçirilecek nihai ham webpack yapılandırmasını çözümleyin.

## resolveChainableWebpackConfig

- **Döner**
  - `{ChainableWebpackConfig}`

- **Kullanım**:  
  Nihai ham webpack yapılandırmasını oluştururken daha fazla ayarlama yapılabilen ara zincirlenebilir bir webpack yapılandırma örneğini çözümleyin.  
  Farklı dallar oluşturmak için bunu birden fazla kez çağırabilirsiniz.

  :::info
  [https://github.com/mozilla-neutrino/webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) adresine bakın.
  :::

## genCacheConfig

- **Argümanlar**
  - `id`
  - `partialIdentifier`
  - `configFiles`
- **Döner**
  - `{object}`
  ```js
  {
    cacheDirectory: string,
    cacheIdentifier: string }
  ```

- **Kullanım**:  
  Bir dizi değişkenden bir önbellek tanımlayıcı oluşturun.