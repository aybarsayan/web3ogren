---
title: Generator API
description: This document provides an overview of the Generator API, detailing various methods and properties related to the Vue CLI. Understanding these APIs is essential for effective project configuration and management.
keywords: [Generator API, Vue CLI, project configuration, methods, properties, API usage]
---

# Generator API

## cliVersion

Type: `string`

**global** `@vue/cli` sürümünü çağıran sürüm dizesi.


## assertCliVersion

- **Arguments**
  - `{integer | string} range` - `@vue/cli`'nin karşılaması gereken bir semver aralığı

- **Usage**

  api.version genel olarak yararlı olabilir, ancak bazen sürümünüzü sadece belirtmek hoş olabilir.  
  Bu API, bunu yapmanın basit bir yolunu sunar.

  > Sağlanan sürüm karşılandığı takdirde hiçbir şey olmaz. Aksi takdirde, bir hata atılacaktır.  
  — Generator API Documentation

## cliServiceVersion

Type: `string`

**proje yerel** `@vue/cli-service` sürümünü çağıran sürüm dizesi.


## assertCliServiceVersion

- **Arguments**
  - `{integer | string} range` - `@vue/cli-service`'nin karşılaması gereken bir semver aralığı

- **Usage**

  Bu API, gerekli proje yerel `@vue/cli-service` sürümünü belirtmek için basit bir yol sunar.

  > Sağlanan sürüm karşılandığı takdirde hiçbir şey olmaz. Aksi takdirde, bir hata atılacaktır.  
  — Generator API Documentation

  :::note
  Çoğu durumda, [package.json'daki `peerDependencies` alanını](https://docs.npmjs.com/files/package.json#peerdependencies) kullanmanız önerilir.
  :::

## resolve

- **Arguments**
  - `{string} ..._paths` - Göreli yolların veya yol parçalarının bir dizisi

- **Returns**
  - `{string}`- mevcut proje köküne dayanarak hesaplanan mutlak yol

- **Usage**:  
  Mevcut proje için bir yolu çözümle.

## hasPlugin

- **Arguments**
  - `{string} id` - eklenti kimliği, (@vue/|vue-|@scope/vue)-cli-plugin- önekini atlayabilir
  - `{string} version` - semver sürüm aralığı, isteğe bağlı

- **Returns**
  - `{boolean}`

- **Usage**:  
  Projenin belirli bir kimliğe sahip bir eklentiye sahip olup olmadığını kontrol edin. Eğer bir sürüm aralığı verilirse, eklenti sürümü buna uymalıdır.

## addConfigTransform

- **Arguments**
  - `{string} key` - package.json'daki yapılandırma anahtarı
  - `{object} options` - seçenekler
    - `{object} options.file` - mevcut dosyayı aramak için kullanılan dosya tanımlayıcı. Her anahtar bir dosya türüdür (olası değerler: ['js', 'json', 'yaml', 'lines']). Değer bir dosya adları listesidir.  
      Örnek:
      ```js
      {
        js: ['.eslintrc.js'],
        json: ['.eslintrc.json', '.eslintrc']
      }
      ```
      Varsayılan olarak, ilk dosya adı yapılandırma dosyasını oluşturmak için kullanılacaktır.

- **Returns**
  - `{boolean}`

- **Usage**:  
  Yapılandırma dosyalarının nasıl çıkarılacağını yapılandırın.

## extendPackage

- **Arguments**
  - `{object | () => object} fields` - birleştirilecek alanlar

- **Usage**:  
  Projenin `package.json` dosyasını genişletin. İç içe alanlar derinlemesine birleştirilir, `{ merge: false }` geçilmedikçe. Ayrıca eklentiler arasındaki bağımlılık çakışmalarını çözümleyecektir. Araç yapılandırma alanları, dosyalar diske yazılmadan önce bağımsız dosyalara çıkarılabilir.

## render

- **Arguments**
  - `{string | object | FileMiddleware} source` - aşağıdakilerden biri olabilir
    - bir dizine göreli yol;
    - `{ sourceTemplate: targetFile }` eşlemelerinin nesne karması;
    - özel bir dosya ara katman işlevi
  - `{object} [additionalData]` - şablonlara erişilebilen ek veri
  - `{object} [ejsOptions]` - ejs için seçenekler

- **Usage**:  
  Şablon dosyalarını sanal dosya ağacı nesnesine render edin.

## postProcessFiles

- **Arguments**
  - `{FileMiddleware} cb` - dosya ara katmanı

- **Usage**:  
  Tüm normal dosya ara katmanları uygulandıktan sonra uygulanacak bir dosya ara katmanı ekleyin.

## onCreateComplete

- **Arguments**
  - `{function} cb`

- **Usage**:  
  Dosyalar diske yazıldığında çağrılacak bir geri çağırmayı ekleyin.

## exitLog

- **Arguments**
  - `{} msg` - üretim tamamlandıktan sonra yazdırılacak dize veya değer;
  - `{('log'|'info'|'done'|'warn'|'error')} [type='log']` - mesajın türü.

- **Usage**:  
  Üretim tamamlandığında (diğer standart mesajlardan sonra) yazdırılacak bir mesaj ekleyin.

## genJSConfig

- **Arguments**
  - `{any} value`

- **Usage**:  
  JSON'dan JS yapılandırma dosyası oluşturmak için kullanışlı bir yöntem.

## makeJSOnlyValue

- **Arguments**
  - `{any} str` - String biçiminde JS ifadesi

- **Usage**:  
  Bir dize ifadesini .js yapılandırma dosyaları için çalıştırılabilir JS'ye dönüştürür.

## injectImports

- **Arguments**
  - `{string} file` - importları ekleyecek hedef dosya
  - `{string | [string]} imports` - import dizisi/dizesi

- **Usage**:  
  Bir dosyaya import ifadeleri ekleyin.

## injectRootOptions

- **Arguments**
  - `{string} file` - seçenekleri ekleyecek hedef dosya
  - `{string | [string]} options` - seçenek dizisi/dizesi

- **Usage**:  
  Kök Vue örneğine (yeni Vue ile tespit edilir) seçenekler ekleyin.

## entryFile

- **Returns**
  - `{('src/main.ts'|'src/main.js')}`

- **Usage**:  
  Typescript'i hesaba katarak giriş dosyasını alın.

## invoking

- **Returns**
  - `{boolean}`

- **Usage**:  
  Eklentinin çağrılıp çağrılmadığını kontrol edin.