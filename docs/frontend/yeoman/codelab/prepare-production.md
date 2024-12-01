---
description: Bu bölümde, uygulamanızı üretime hazır hale getirmek için gerekli adımları öğreneceksiniz. Optimize edilmiş dosyalar ile sunumunuzu etkili bir şekilde gerçekleştirin.
keywords: [üretim, todo uygulaması, dosya optimizasyonu, npm komutları, web sunucusu]
---

# Üretime Hazırla

Dünyaya güzel todo uygulamanızı göstermek için hazır mısınız? Bunu gönderilebilecek bir üretim sürümüne dönüştürmeyi deneyelim.


  ![](../../images/cikti/yeoman/assets/img/yeoman-009.png)


## Üretim için dosyaları optimize et

Uygulamamızın bir üretim sürümünü oluşturmak için şunları yapmak isteyeceğiz:

* **Kodumuzu kontrol etmek**,
* **Ağ isteklerini azaltmak için script ve stillerimizi birleştirmek ve sıkıştırmak**,
* **Kullandığımız herhangi bir ön işlemcinin çıktısını derlemek** ve
* **Genel olarak uygulamamızı gerçekten hafif hale getirmek**.

:::tip
Bu adımlar, uygulamanızın performansını önemli ölçüde artırabilir.
:::

Off! Harika bir şekilde tüm bunları sadece çalıştırarak başarabiliriz:

```sh
npm run build
```

Artık `mytodo` projenizin kökünde bir `dist` klasöründe hafif, üretime hazır uygulamanız mevcut. Bu dosyaları sunucunuza FTP veya başka bir dağıtım hizmeti kullanarak koyabilirsiniz.

## Üretim için hazır uygulamayı oluşturun ve önizleyin

Yerel olarak üretim uygulamanızı önizlemek ister misiniz? Bu sadece başka bir basit npm komutu:

```sh
npm run serve:dist
```

Projenizi oluşturacak ve yerel bir web sunucusu başlatacaktır. **Hazır olun!**

![](../../images/cikti/yeoman/assets/img/codelab/08_serve_dist.png)


 Genel bakışa dön
  veya
  Tamamladınız! Devam edin 
