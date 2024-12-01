---
title: "React uygulamasını Vite ile dağıtma"
description: Bu eğitim, Deno Deploy üzerinde Vite Deno ve React uygulamasının nasıl dağıtılacağını kapsamaktadır. Adım adım bir yapılandırma ile uygulamanızı hızlıca dağıtarak Deno ortamında nasıl çalıştığını öğrenin.
keywords: [Deno Deploy, Vite, React, dağıtım, uygulama geliştirme]
---

Bu eğitim, Deno Deploy üzerinde Vite Deno ve React uygulamasının nasıl dağıtılacağını kapsamaktadır.

## Adım 1: Bir Vite uygulaması oluşturun

Hızla bir Deno ve React uygulaması oluşturmak için [Vite](https://vitejs.dev/) kullanacağız:

```sh
deno run --allow-read --allow-write --allow-env npm:create-vite-extra@latest
```

Projemize `vite-project` adını vereceğiz. Proje yapılandırmasında `deno-react` seçeneğini seçtiğinizden emin olun.

Ardından, yeni oluşturulan proje klasörüne `cd` yapın.

## Adım 2: Depoyu yerel olarak çalıştırın

Yeni projenizi yerel olarak görmek ve düzenlemek için şunu çalıştırabilirsiniz:

```sh
deno run dev
```

## Adım 3: Projenizi Deno Deploy ile dağıtın

Artık her şey hazır, şimdi yeni projenizi dağıtalım!

1. Tarayıcınızda [Deno Deploy](https://dash.deno.com/new_project) adresine gidin ve
   GitHub hesabınızı bağlayın.
2. Yeni Vite projenizi içeren depoyu seçin.
3. Projenize bir isim verebilir veya Deno'nun sizin için oluşturmasına izin verebilirsiniz.
4. **Framework Preset** açılır menüsünden **Vite** seçin. Bu, **Entrypoint** form alanını dolduracaktır.
5. **Install step** alanını boş bırakın.
6. **Build step** alanını `deno task build` olarak ayarlayın.
7. **Root directory** alanını `dist` olarak ayarlayın.
8. **Deploy Project** düğmesine tıklayın.

> NB. Ayarlanan giriş noktası `jsr:@std/http@1.0.0-rc.5/file-server` olacaktır.  
> Bunun Vite reposunda mevcut bir dosya olmadığını unutmayın. Bunun yerine, bu bir dış programdır. Çalıştırıldığında, bu program mevcut deponuzdaki tüm statik varlık dosyalarını (`vite-project/dist`) Deno Deploy'a yükler. Daha sonra dağıtım URL'sine gittiğinizde, yerel dizini sunar.

### `deployctl`

Alternatif olarak, `deployctl` kullanarak doğrudan `vite-project`'i Deno Deploy'a dağıtabilirsiniz.

```console
cd /dist
deployctl deploy --project=<project-name> jsr:@std/http@1.0.0-rc.5/file-server
```