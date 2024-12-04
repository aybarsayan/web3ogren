---
title: React Geliştirici Araçları
seoTitle: React Developer Tools Overview
sidebar_position: 4
description: React Geliştirici Araçları, bileşenleri incelemek, özellikleri düzenlemek ve performans sorunlarını tanımlamak için kullanılan önemli bir araçtır. Bu kılavuz, tarayıcı eklentisinin ve mobil uygulama desteğinin nasıl kurulacağını açıklar.
tags: 
  - React
  - Geliştirici Araçları
  - Hata Ayıklama
  - React Native
keywords: 
  - React
  - Developer Tools
  - Debugging
  - React Native
---
React Geliştirici Araçları'nı kullanarak React `bileşenlerini` inceleyebilir, `özellikleri` ve `durumu` düzenleyebilir ve performans sorunlarını tanımlayabilirsiniz.





* React Geliştirici Araçları'nın nasıl yükleneceği



## Tarayıcı eklentisi {/*browser-extension*/}

:::info
React ile oluşturulmuş web sitelerini hata ayıklamanın en kolay yolu, React Geliştirici Araçları tarayıcı eklentisini yüklemektir. Bu, birkaç popüler tarayıcı için mevcuttur:
:::

* [**Chrome** için Kurulum](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox** için Kurulum](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge** için Kurulum](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Artık, **React ile oluşturulmuş** bir web sitesini ziyaret ettiğinizde, _Bileşenler_ ve _Profil Aracı_ panellerini göreceksiniz.

![](../../images/frameworks/react/public/images/docs/react-devtools-extension.png)

### Safari ve diğer tarayıcılar {/*safari-and-other-browsers*/}
Diğer tarayıcılar için (örneğin, Safari), [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm paketini yükleyin:
```bash
## Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Daha sonra terminalden geliştirici araçlarını açın:
```bash
react-devtools
```

Sonra, web sitenizin `` bölümünün başına aşağıdaki `` etiketini ekleyerek web sitenizi bağlayın:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Artık web sitenizi tarayıcıda yeniden yükleyin ve geliştirici araçlarında görüntüleyin.

![](../../images/frameworks/react/public/images/docs/react-devtools-standalone.png)

## Mobil (React Native) {/*mobile-react-native*/}
React Geliştirici Araçları, [React Native](https://reactnative.dev/) ile oluşturulmuş uygulamaları incelemek için de kullanılabilir.

:::tip
React Geliştirici Araçları'nı kullanmanın en kolay yolu, onu genel olarak yüklemektir:
:::
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Daha sonra terminalden geliştirici araçlarını açın.
```bash
react-devtools
```

Bu, çalışan herhangi bir yerel React Native uygulamasıyla bağlanmalıdır.

> Geliştirici araçları birkaç saniye sonra bağlanmazsa, uygulamayı yeniden yüklemeyi deneyin.  
> — Geliştirici Notu

[React Native'de hata ayıklama hakkında daha fazla bilgi edinin.](https://reactnative.dev/docs/debugging)