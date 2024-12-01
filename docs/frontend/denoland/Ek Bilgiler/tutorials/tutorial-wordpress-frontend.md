---
title: "WordPress'i Başsız CMS Olarak Kullanma"
description: WordPress, başsız bir biçimde kullanıldığında özelleştirilebilir bir ön yüz sunar. Bu eğitimde, Deno üzerine inşa edilmiş Fresh framework'ü ile nasıl bir ön yüz oluşturacağınızı öğrenin.
keywords: [WordPress, başsız CMS, Fresh framework, web geliştirme, Deno]
oldUrl:
  - /deploy/docs/tutorial-wordpress-frontend/
---

WordPress, dünyadaki en popüler CMS'dir, ancak "başsız" bir biçimde, yani özelleştirilmiş bir ön yüz ile kullanması zordur.

:::info
Bu eğitimde, Deno üzerine inşa edilmiş modern bir web çerçevesi olan Fresh'i kullanarak başsız WordPress için bir ön yüz oluşturmayı gösteriyoruz.
:::

## Adım 1: Fresh WordPress temasını klonlayın

Fresh, bir blog ve bir mağaza için olmak üzere iki kullanıma hazır tema sunmaktadır.

### Blog

```bash
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/blog
deno task docker
```

### Mağaza

```bash
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/corporate
deno task docker
```

**Not:** Blog ve Mağaza temalarının WordPress sunucusu için farklı kurulumlardan yararlandığını unutmayın. `deno task docker` komutunu doğru dizinde çalıştırdığınızdan emin olun.

## Adım 2: Aynı dizinde başka bir terminal açın ve çalıştırın:

```sh
deno task start
```

## Adım 3: [http://localhost:8000/](http://localhost:8000/) adresini ziyaret edin

Site içeriğini [http://localhost/wp-admin](http://localhost/wp-admin) adresindeki WordPress kontrol panelinden yönetebilirsiniz (kullanıcı adı: `user`, şifre: `password`).

## WordPress barındırma seçenekleri

In the internet, WordPress'i barındırmak için birçok seçenek bulunmaktadır. Birçok bulut sağlayıcısı
[özel](https://aws.amazon.com/getting-started/hands-on/launch-a-wordpress-website/)
[rehber](https://cloud.google.com/wordpress)
[ve](https://learn.microsoft.com/en-us/azure/app-service/quickstart-wordpress)
[şablonlar](https://console.cloud.google.com/marketplace/product/click-to-deploy-images/wordpress)
WordPress için ayrılmıştır. Ayrıca WordPress için [Bluehost](https://www.bluehost.com/),
[DreamHost](https://www.dreamhost.com/),
[SiteGround](https://www.siteground.com/) gibi özel barındırma hizmetleri de bulunmaktadır. Bu seçeneklerden ihtiyaçlarınıza en uygun olanını seçebilirsiniz.

:::tip
WordPress instance'larınızı ölçeklendirme hakkında internette birçok kaynak bulunmaktadır. Kullanıcı yorumlarını ve hizmet sağlama sürelerini kontrol etmeyi unutmayın.
:::