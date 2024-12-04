---
title: Bundler ile İstemci Kullanımı
seoTitle: İstemci Kütüphanesi için Paketleme Araçları Kullanımı
sidebar_position: 5
description: Bu doküman, client kütüphanesini farklı paketleme araçlarıyla nasıl birleştirebileceğinizi açıklamaktadır. Webpack 5 ve Rollup.js ile istemci kullanımı üzerine bilgi vermektedir.
tags: 
  - istemci kütüphanesi
  - Webpack
  - Rollup
  - Node.js
  - JavaScript
keywords: 
  - istemci
  - Webpack
  - Rollup.js
  - Node.js
  - paketleme
---
İstemci kütüphanesini farklı paketleme araçlarıyla birleştirmek için yapılandırma aşağıda bulabilirsiniz:

- `Webpack 5`
  - `Tarayıcı`
  - `Node.js`
- `Rollup.js`
  - `Tarayıcı`
  - `Node.js`

## Webpack 5

Dokümantasyon: [Webpack Resmi Dokümantasyonu](https://webpack.js.org/concepts/)

:::info
Webpack, JavaScript uygulamalarını yönetmek için yaygın bir module bundler'dır. Kullanımı ile ilgili daha fazla bilgi için resmi dokümantasyonu ziyaret edin.
:::

### Tarayıcı

Kurulum:

```
npm i -D socket.io-client webpack webpack-cli babel-loader @babel/core @babel/preset-env \
    @babel/plugin-transform-object-assign webpack-remove-debug
```

`webpack.config.js`

```js
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  mode: "production",
  node: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // eski tarayıcılarla uyumluluğu sağla
            plugins: ["@babel/plugin-transform-object-assign"], // IE 11 ile uyumluluğu sağla
          },
        },
      },
      {
        test: /\.js$/,
        loader: "webpack-remove-debug", // "debug" paketini kaldır
      },
    ],
  },
};
```

Referans olarak, [`webpack-bundle-analyzer`](https://www.npmjs.com/package/webpack-bundle-analyzer) paketinin çıktısı:

![webpack-bundle-analyzer paketinin çıktısı](../../../images/frameworks/socket.io/static/images/bundle-analyzer-output.png)

### Node.js

Bir Node.js ortamında (sunucu-sunucu bağlantısı) istemciyi kullanmak için yapılandırma aşağıda verilmiştir:

Kurulum:

```
npm i -D socket.io-client webpack webpack-cli
```

`webpack.config.js`

```js
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  mode: "production",
  target: "node",
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
};
```

:::warning
`target: "node"` ayarı olmadan, muhtemelen aşağıdaki hatayla karşılaşacaksınız:

```
ReferenceError: document is not defined
```
:::

## Rollup.js

Dokümantasyon: [Rollup Resmi Dokümantasyonu](https://rollupjs.org/guide/en/)

:::info
Rollup, özellikle JavaScript modüllerini optimize etmek için kullanılan bir module bundler'dır. Hem tarayıcılar hem de Node.js ortamları için uygun bir yapı sunar.
:::

### Tarayıcı

Kurulum:

```
npm i -D socket.io-client rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-commonjs \
  @rollup/plugin-babel rollup-plugin-uglify babel @babel/core @babel/preset-env
```

`rollup.config.js`

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "index.js",
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    babel({
      include: ["**.js", "node_modules/**"],
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
    uglify(),
  ],
};
```

### Node.js

Kurulum:

```
npm i -D socket.io-client rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-uglify
```

`rollup.config.js`

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "index.js",
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    uglify(),
  ],
};
```

:::note
Rollup ile oluşturulan bundle, genellikle daha küçük boyutlarda olur ve modüllerin کوچuk yapısını korur.
:::