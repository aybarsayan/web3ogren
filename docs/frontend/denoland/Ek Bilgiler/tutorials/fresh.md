---
title: "Temel Fresh Sitesi"
description: Bu eğitim, Deno Deploy üzerinde bir Fresh uygulamasının nasıl dağıtılacağını kapsamaktadır. Fresh, Deno için geliştirilmiş bir web çerçevesidir ve Node için Express'e benzer.
keywords: [Fresh, Deno, Deno Deploy, web framework, GitHub, deployment]
---

Bu eğitim, Deno Deploy üzerinde bir Fresh uygulamasının nasıl dağıtılacağını kapsayacaktır.

Fresh, Deno için geliştirilmiş bir web çerçevesidir ve Node için Express'e benzer.

## **Adım 1:** Fresh uygulaması oluşturun

```sh
deno run -A -r https://fresh.deno.dev fresh-site
```

Bu uygulamayı yerel olarak çalıştırmak için:

```sh
deno task start
```

Uygulamayı değiştirmek için `routes/index.js` dosyasını düzenleyebilirsiniz.

## **Adım 2:** Yeni bir Github deposu oluşturun ve yerel Fresh uygulamanızı bağlayın.

1. Yeni bir Github deposu oluşturun ve git depo uzak URL'sini kaydedin.
2. Yerel `fresh-site` klasörünüzden, git'i başlatın ve yeni uzak depoya itme yapın:

   ```sh
   git init
   git add .
   git commit -m "İlk yükleme"
   git remote add origin <remote-url>
   git push origin main
   ```

:::info
`git commit -m "İlk yükleme"` komutu, değişikliklerinizi yerel depoya kaydetmek için kullanılır. Bu mesajı, yapılan değişiklikleri özetleyecek şekilde özelleştirebilirsiniz.
:::

## **Adım 3:** Deno Deploy'e dağıtım yapın

1. Şu adrese gidin:
   [https://dash.deno.com/new_project](https://dash.deno.com/new_project).
2. GitHub hesabınıza bağlanın ve deponuzu seçin.
3. Formdaki değerleri doldurun:
   - Projenize bir isim verin
   - "Framework Preset" seçeneklerinden `Fresh`'i seçin
   - Üretim dalını `main` olarak ayarlayın
   - Giriş noktası dosyası olarak `main.ts` seçin
4. Deno Deploy'u başlatmak için "Proje Dağıt" butonuna tıklayın.
5. Dağıtım tamamlandığında, yeni projenizi proje panonuzda sağlanan URL üzerinden görüntüleyebilirsiniz.

:::tip 
Deno Deploy ile çalışırken, projelerinizi düzenli aralıklarla güncellemeyi unutmayın. Ayrıca, her dağıtım sonrası projenizi test ederek olası hataları önceden tespit edebilirsiniz.
:::