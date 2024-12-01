---
title: "Dağıtım Hızlı Başlangıç"
description: Deno Deploy ile sunucusuz JavaScript uygulamalarınızı hızlı ve kolay bir şekilde dağıtın. Bu kılavuz, Deno ve deployctl kurulumundan başlayarak ilk uygulamanızı dağıtma sürecini kapsar.
keywords: [Deno Deploy, JavaScript, TypeScript, deployctl, sunucusuz uygulamalar]
---

Deno Deploy, sunucusuz JavaScript uygulamaları için global olarak dağıtılmış bir platformdur. JavaScript, TypeScript ve WebAssembly kodunuz, kullanıcılarınıza coğrafi olarak yakın yönetilen sunucularda çalıştırılır, böylece düşük gecikme süresi ve daha hızlı yanıt süreleri sağlanır. Dağıtım uygulamaları, sanal makineler yerine hızlı, hafif [V8 izolasyonları](https://deno.com/blog/anatomy-isolate-cloud) üzerinde çalışır ve `Deno çalışma zamanı` tarafından desteklenir.

:::tip
İlk uygulamanızı dağıtmak sadece birkaç dakikanızı alacaktır.
:::

## Deno ve `deployctl` Kurulumu

Henüz kurmadıysanız, aşağıdaki komutlardan birini kullanarak `Deno çalışma zamanını` kurabilirsiniz:




```sh
curl -fsSL https://deno.land/install.sh | sh
```




```powershell
irm https://deno.land/install.ps1 | iex
```




```sh
curl -fsSL https://deno.land/install.sh | sh
```




Deno kurulduktan sonra, `deployctl` aracını kurun:

```sh
deno install -A jsr:@deno/deployctl --global
```

`deployctl`'in doğru şekilde kurulduğunu aşağıdaki komutu çalıştırarak doğrulayabilirsiniz:

```console
deployctl --help
```

Artık bir Deno scriptini komut satırından dağıtmaya hazırsınız!

## Deno Programı Yazın ve Test Edin

İlk olarak, proje için bir dizin oluşturun ve içinde `main.ts` adında bir dosya oluşturun. İçine aşağıdaki "Merhaba Dünya" web sunucusunu yerleştirin:

```ts title="main.ts"
Deno.serve(() => new Response("Hello, world!"));
```

Aşağıdaki komutu çalıştırarak çalıştığını test edebilirsiniz:

```sh
deno run --allow-net main.ts
```

Sunucunuz [localhost:8000](http://localhost:8000) adresinde görüntülenebilir. Şimdi bu kodu Deno Deploy ile kenarda çalıştıralım!

## Projenizi Dağıtın

Yeni oluşturduğunuz `main.ts` dosyasının dizininden aşağıdaki komutu çalıştırın:

```sh
deployctl deploy
```

:::info
Deno Deploy'e kaydolmak ve/veya `deployctl` için bir erişim tokenı sağlamak için GitHub'da Deno Deploy'i yetkilendirmeniz istenecektir. 
:::

Birkaç saniye sonra, Merhaba Dünya sunucunuz Deno Deploy altyapısında dünya çapında dağıtılacak ve beklenen tüm trafiği karşılamaya hazır olacaktır.

## Sonraki Adımlar

İlk dağıtımınızı yaptıktan sonra, Deno Deploy üzerinde hangi tür uygulamaları çalıştırabileceğinizi öğrenmek için `öğrenin`, `deployctl ile neler yapabileceğinizi kontrol edin` veya Deno Deploy'a kodunuzu dağıtmak için başka hangi seçenekleriniz olduğunu öğrenmek için okumaya devam edin. Deno Deploy ile neler yapacağınızı görmek için çok heyecanlıyız!

### Mevcut Projenizi Dağıtın

Bir projeyi içe aktarın ve Deno Deploy ile kenarda çalıştırın.

1. [Deno Deploy kontrol panelinden](https://dash.deno.com) "Yeni Proje" butonuna tıklayın.

2. GitHub hesabınıza bağlanın ve dağıtmak istediğiniz repository'yi seçin.

3. Mevcut uygulamanızı dağıtmak için ekranda görünen talimatları takip edin.

   Projenizin bir yapı adımına ihtiyacı varsa, Proje Konfigürasyonu formunu kullanarak projenizi dağıtmak için bir GitHub eylemi oluşturun. Projenize bir isim verin ve opsiyonel çerçeve öngörülerinden birini seçin. Eğer bir çerçeve kullanmıyorsanız, formu kullanarak yapı ayarlarınızı yapılandırabilirsiniz.

4. Yapı seçeneklerinizin doğru olduğundan emin olun ve yeni GitHub eyleminizi başlatmak ve projenizi dağıtmak için "Projeyi Dağıt" butonuna tıklayın.

Bir kaç saniye içinde, projeniz dünya çapında yaklaşık 12 veri merkezi arasında dağıtılacak ve büyük miktarda trafiği karşılamaya hazır olacaktır.

Dağıtımınız başarılı olduysa, başarı sayfasında sağlanan URL'den yeni dağıtımınızı ziyaret edebilir veya kontrol panelinizde yönetebilirsiniz.

### Bir Oyun Alanıyla Başlayın

:::note
Bir `oyun alanı`, anında JavaScript veya TypeScript kodu yazmanıza ve çalıştırmanıza olanak tanıyan tarayıcı tabanlı bir editördür. Bu, Deno ve Deno Deploy'u denemek için harika bir seçimdir!
:::

[Deno Deploy kontrol panelinden](https://dash.deno.com), bir oyun alanı oluşturmak için "Yeni Oyun Alanı" butonuna tıklayın. Deno Deploy'u denemek için deneyebileceğiniz çeşitli önceden oluşturulmuş eğitimlerimiz de var. Bunları "Öğrenme Oyun Alanı"na tıklayarak veya şu adresleri ziyaret ederek deneyebilirsiniz:\
[Basit HTTP sunucusu oyun alanı](https://dash.deno.com/tutorial/tutorial-http)\
[Deno KV veritabanı oyun alanı](https://dash.deno.com/tutorial/tutorial-http-kv)\
[RESTful API sunucusu oyun alanı](https://dash.deno.com/tutorial/tutorial-restful)\
[WebSockets ile Gerçek Zamanlı uygulama oyun alanı](https://dash.deno.com/tutorial/tutorial-websocket)\
[Deno.cron ile Tekrarlayan görevler oyun alanı](https://dash.deno.com/tutorial/tutorial-cron)