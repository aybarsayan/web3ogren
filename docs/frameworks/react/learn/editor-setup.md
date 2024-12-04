---
title: Editör Ayarları
seoTitle: Editör Ayarlarını Geliştirme
sidebar_position: 4
description: Doğru yapılandırılmış bir editör, kodu daha okunabilir hale getirir ve yazma hızını artırır. Bu guıde, popüler editörleri ve önerilen özellikleri keşfetmenize yardımcı olacaktır.
tags: 
  - editör
  - kodlama
  - yazılım geliştirme
  - VS Code
keywords: 
  - editör
  - linting
  - formatlama
  - Prettier
---
Doğru yapılandırılmış bir editör, kodu daha okunabilir hale getirebilir ve yazma hızını artırabilir. Hatta kodu yazarken hataları yakalamanıza yardımcı olabilir! Eğer bu, bir editör ayarladığınız ilk kez ise veya mevcut editörünüzü iyileştirmek istiyorsanız, birkaç önerimiz var.





* En popüler editörlerin neler olduğu
* Kodunuzu otomatik olarak nasıl formatlayacağınız



## Editörünüz {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) günümüzde en popüler editörlerden biridir. Geniş bir uzantı pazarı vardır ve GitHub gibi popüler hizmetlerle iyi entegrasyon sağlar. Aşağıda listelenen çoğu özellik, VS Code'a uzantılar olarak da eklenebilir, bu da onu son derece yapılandırılabilir hale getirir!

React topluluğunda kullanılan diğer popüler metin editörleri şunlardır:

* [WebStorm](https://www.jetbrains.com/webstorm/) JavaScript için özel olarak tasarlanmış bir entegre geliştirme ortamıdır.
* [Sublime Text](https://www.sublimetext.com/) JSX ve TypeScript desteğine ve yerleşik [sözdizim vurgulama](https://stackoverflow.com/a/70960574/458193) ile otomatik tamamlama özelliğine sahiptir.
* [Vim](https://www.vim.org/) her türlü metin oluşturmayı ve değiştirmeyi çok verimli hale getirmek için yapılmış yüksek yapılandırılabilir bir metin editörüdür. Çoğu UNIX sistemlerinde "vi" olarak, Apple OS X ile birlikte de mevcuttur.

## Önerilen metin editörü özellikleri {/*recommended-text-editor-features*/}

Bazı editörler bu özelliklerle birlikte gelirken, diğerleri uzantı eklemeyi gerektirebilir. Seçtiğiniz editörün hangi desteği sağladığını kontrol edin!

### Linting {/*linting*/}

:::info
Kod linters, kodunuzu yazarken sorunları bulmanıza yardımcı olur ve sorunları erkenden düzeltirsiniz.
:::

[ESLint](https://eslint.org/) JavaScript için popüler, açık kaynak bir linters'dır. 

* [React için önerilen yapılandırmayla ESLint'i yükleyin](https://www.npmjs.com/package/eslint-config-react-app) (mutlaka [Node'un yüklü olduğundan emin olun!](https://nodejs.org/en/download/current/))
* [Resmi uzantıyla VSCode'da ESLint'i entegre edin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Projeniz için tüm [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) kurallarını etkinleştirdiğinizden emin olun.** Bu kurallar, en ciddi hataları erkenden yakalamak için esastır. Önerilen [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) preset'i zaten bunları içerir.

### Formatlama {/*formatting*/}

Kodunuzu başka bir katkıda bulunanla paylaşırken girmek istemediğiniz son şey [sekmeler ile boşluklar](https://www.google.com/search?q=tabs+vs+spaces) hakkında bir tartışmadır! Neyse ki, [Prettier](https://prettier.io/) kodunuzu önceden tanımlanmış, yapılandırılabilir kurallara uyacak şekilde yeniden formatlayarak temizler. Prettier'ı çalıştırdığınızda, tüm sekmeleriniz boşluklara dönüştürülecek ve girintiniz, alıntılarınız vb. yapılandırmaya uygun olarak değiştirilecektir. İdeal bir yapılandırmada, Prettier dosyanızı kaydettiğinizde çalışacak ve bu düzenlemeleri hızlı bir şekilde yapacaktır.

[Prettier uzantısını VSCode'da](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) yüklemek için şu adımları izleyebilirsiniz:

1. VS Code'u başlatın
2. Hızlı Açma'yı kullanın (Ctrl/Cmd+P tuşlarına basın)
3. `ext install esbenp.prettier-vscode` yazın
4. Enter tuşuna basın

#### Kaydettiğinizde formatlama {/*formatting-on-save*/}

İdeal olarak, her kayıtta kodunuzu formatlamalısınız. VS Code'da bunun için ayarlar vardır!

1. VS Code'da `CTRL/CMD + SHIFT + P` tuşlarına basın.
2. "settings" yazın
3. Enter tuşuna basın
4. Arama çubuğuna "format on save" yazın
5. "format on save" seçeneğinin işaretli olduğundan emin olun!

> Eğer ESLint preset'inizde formatlama kuralları varsa, bunlar Prettier ile çelişebilir. ESLint preset'inizdeki tüm formatlama kurallarını devre dışı bırakmanızı öneririz. Böylece ESLint yalnızca mantıksal hataları yakalamak için kullanılacaktır. Bir çekme isteği birleştirilmeden önce dosyaların formatlanmasını sağlamak istiyorsanız, sürekli entegrasyon için [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) komutunu kullanın.