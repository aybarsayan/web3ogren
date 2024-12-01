---
description: Bu belge, Yeoman uygulamanızın dağıtım yöntemlerini ele alır ve Gulp, Grunt, Git subtree gibi araçlarla dağıtım yapmanın yollarını açıklar.
keywords: [Yeoman, dağıtım, Gulp, Grunt, Git subtree, uygulama dağıtımı, web geliştirme]
title: Yeoman Sitesinin Dağıtımı
---

# Geliştirme

`gulp build` görevini çalıştırmak, uygulamanızın `dist` dizininde optimize edilmiş bir versiyonunu oluşturur. Bu kodu üretime sürmek için birden fazla yol vardır.

## Gulp-gh-pages

[the `gulp-gh-pages` Gulp eklentisini](https://www.npmjs.com/package/gulp-gh-pages) kullanarak, uygulamanızın `gulp deploy` gibi belirli bir görevle dağıtım yapmasına izin verebilirsiniz. Çeşitli seçenekler alır:

* Git kaynağı, varsayılan olarak `origin`dır.
* İtmek için dal, varsayılan olarak `gh-pages`dir.
* Commit mesajı.
* Daldan kaynağa otomatik olarak itileceğini belirtmek için bir seçenek.

Daha fazla bilgi için her zaman [readme'sini](https://github.com/shinnn/gulp-gh-pages#readme) kontrol edebilirsiniz.

---

## Grunt-build-control görevi

[Grunt build control](https://github.com/robwierzbowski/grunt-build-control), Yeoman uygulamalarını dağıtmak için özel olarak geliştirilmiştir. Bir grunt görevi ile oluşturulmuş kodu otomatik olarak sürümlemenize ve dağıtmanıza yardımcı olur. Yapılandırma seçenekleri şunları içerir:

- Bağlanılacak dalın adı (örneğin, prod, gh-pages)
- İtmek için uzak (örneğin, bir Heroku örneği, bir GitHub uzak bağlantısı veya yerel kaynak kodu deposu)
- Dal ve kodun oluşturulduğu commit dahil otomatik commit mesajları
- Kaynak deposunun temiz olduğundan emin olmak için güvenlik kontrolleri, böylece oluşturulan kod her zaman bir kaynak kodu commit'i ile ilişkili olur

:::tip
**İpuçları:** Build control, her commit öncesinde fetch işlemi yapar ve genel olarak birden fazla katılımcı bağımsız olarak dağıtım yaparken kodu iyi bir şekilde sürümlemektedir.
:::

Hiçbir kullanıcı zorla itme yapmadığı sürece tam revizyon tarihini korur. Projenin [GitHub sayfasında](https://github.com/robwierzbowski/grunt-build-control) tam dokümantasyon mevcuttur.

---

## Git subtree komutu

Kaynağı ve oluşturulmuş kodu aynı dalda tutabilir ve sadece `dist` dizinini [`git subtree`](https://github.com/apenwarr/git-subtree) komutu ile dağıtabilirsiniz.

1. `dist` dizinini `.gitignore` dosyasından kaldırın. Yeoman projeleri varsayılan olarak bunu göz ardı eder.
2. `dist` dizinini havuzunuza ekleyin:

    ```
    git add dist && git commit -m "İlk dist subtree commit"
    ```

3. Alt ağacı farklı bir dala dağıtın. `--prefix` ile `dist` dizininize göreli bir yol belirtin:

    ```
    git subtree push --prefix dist origin gh-pages
    ```

4. Normal şekilde geliştirin, tüm havuzunuzu varsayılan (master) dalınıza commit edin.
5. `dist` dizinini dağıtmak için, kök dizinden `subtree push` komutunu çalıştırın:

    ```
    git subtree push --prefix dist origin gh-pages
    ```

---

## Git-directory-deploy scripti

[Git directory deploy](https://github.com/X1011/git-directory-deploy), grunt build control ile benzer prensipler üzerinde çalışan daha az otomatik bir skripttir.

---

## Daha Fazla Okuma

- [Git Subtree belgeleri](https://github.com/git/git/blob/master/contrib/subtree/git-subtree.txt)
- [GitHub Sayfaları belgeleri](https://help.github.com/articles/user-organization-and-project-pages/)
- [generator-heroku ile bir Heroku proc dosyası oluşturma](https://github.com/passy/generator-heroku)