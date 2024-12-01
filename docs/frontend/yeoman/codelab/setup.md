---
description: Bu bölümde, geliştirme ortamınızı ayarlamak için gerekli adımlar açıklanmaktadır. Yeoman ve gerekli bağımlılıkları yüklemenin yanı sıra, sürüm kontrol aracı olan Git'in nasıl yükleneceği üzerine bilgiler sağlanmaktadır.
keywords: [Yeoman, Node.js, npm, Git, geliştirme ortamı, yükleme, hata çözümü]
title: 'Adım 1: Geliştirme ortamınızı ayarlayın'
---

# Kurulum

  ![](../../images/cikti/yeoman/assets/img/yeoman-004.png)


Yeoman ile olan etkileşimlerinizin çoğu komut satırı üzerinden olacaktır. Mac kullanıyorsanız Terminal uygulamasında, Linux'ta shell'inizde veya Windows'ta [`cmder`](http://cmder.net/) *(tercihen)* / PowerShell / `cmd.exe` üzerinde komutları çalıştırın.

## Ön koşulları yükleyin

Fountain Webapp Generator'ı yüklemeden önce aşağıdakilere ihtiyacınız olacak:

* **Node.js 6 veya daha yüksek**
* **npm 3 veya daha yüksek** (Node ile birlikte gelir)
* **Git**

Node ve npm'nin yüklü olup olmadığını kontrol etmek için şu komutu yazabilirsiniz:

```sh
node --version && npm --version
```

:::tip
Node'u güncellemeniz veya yüklemeniz gerekiyorsa, en kolay yol platformunuza uygun bir yükleyici kullanmaktır. Windows için *.msi* veya Mac için *.pkg* dosyasını [NodeJS web sitesinden](https://nodejs.org/) indirin.
:::

[npm](https://www.npmjs.com/) paket yöneticisi Node ile birlikte gelir, ancak onu güncellemeniz gerekebilir. Bazı Node sürümleri oldukça eski npm sürümleri ile birlikte gelir. npm'yi bu komutla güncelleyebilirsiniz:

```sh
npm install --global npm@latest
```

Git'in yüklü olup olmadığını kontrol etmek için şu komutu yazabilirsiniz:

```sh
git --version
```

Eğer Git yoksa, yükleyicileri [git web sitesinden](https://git-scm.com/) edinebilirsiniz.

## Yeoman araç setini yükleyin

Node'u yükledikten sonra, Yeoman araç setini yükleyin:

```sh
npm install --global yo
```



  Hatalar mı?

  Özellik veya erişim hataları, örneğin EPERM veya EACCESS ile karşılaşırsanız, geçici çözüm olarak sudo kullanmayın. Daha sağlam bir çözüm için bu kılavuzu inceleyebilirsiniz.



## Yüklemeyi onaylayın

Her şeyin beklenildiği gibi yüklü olup olmadığını kontrol etmek için `--version` bayrağı ile yaygın olarak kullanılan Yeoman komutlarından biri olan `yo` komutunu çalıştırmak iyi bir fikirdir:

```sh
yo --version
```

Bu kodlabın uyumlu olduğu CLI araçlarının sürümleri

Teknoloji hızla değişiyor! Bu eğitim yo 1.8.4 ile test edilmiştir. Daha yeni bir sürümde sorun yaşıyorsanız, bize bildirmekten çekinmeyin. Lütfen takip sistemimizde bir sorun açın.

