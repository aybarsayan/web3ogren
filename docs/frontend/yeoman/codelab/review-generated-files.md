---
description: Bu bölümde, Yeoman tarafından oluşturulan uygulamanın dosya yapısını gözden geçiriyoruz. Yapıyı anlamak, geliştirme sürecinde önemli bir adımdır.
keywords: [Yeoman, uygulama yapısı, React, Redux, dosya düzeni]
---

# Oluşturulan Dosyaları İncele

`mytodo` dizininizi açın ve gerçekten neyin oluşturulduğuna bir göz atın. Görünümü şu şekilde olacak:

![](../../images/cikti/yeoman/assets/img/codelab/04_tree_view.png)

*mytodo* içinde şunlar var:

`src`: web uygulamamız için bir ana dizin

- `app`: **React + Redux** kodumuz
- `index.html`: temel html dosyası
- `index.js`: **TodoMVC** uygulamamız için giriş noktası

`conf`: üçüncü taraf araçlar (Browsersync, Webpack, Gulp, Karma) için yapılandırma dosyalarımızın bulunduğu bir ana dizin

- `gulp_tasks` ve `gulpfile.js`: derleyici görevlerimiz
- `.babelrc`, `package.json` ve `node_modules`: gerekli yapılandırma ve bağımlılıklar
- `.gitattributes` ve `.gitignore`: git için yapılandırma

---

:::tip
**İlk commit'i oluşturun**: Oluşturma ve kurulumdan sonra, zaten başlatmış bir git deposuna sahip olmalısınız. Mevcut durumu kaydetmek için aşağıdaki komutları kullanabilirsiniz.
:::

```sh
git add --all && git commit -m "İlk commit"
```

---


 Genel bakışa dön
  veya
  Sonraki adıma geç 
