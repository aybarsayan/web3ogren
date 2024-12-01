---
title: "Basit API sunucusu"
description: Deno ile basit ve hafif bir API sunucusu oluşturma ve dağıtma işlemlerini öğrenin. Bu eğitim, yerel bir bağlantı kısaltıcı hizmeti uygulamanıza yardımcı olacaktır.
keywords: [Deno, API, sunucu, dağıtım, bağlantı kısaltıcı]
---

Deno, basit ve hafif API sunucuları oluşturmak için harika bir araçtır. Bu eğitimde, Deno Deploy kullanarak nasıl bir tane oluşturup dağıtacağınızı öğrenin.

## Yerel bir API sunucusu oluşturun

Terminalinizde, `server.ts` adında bir dosya oluşturun.

```shell
touch server.ts
```

Basit bir bağlantı kısaltıcı hizmeti uygulayacağız, bunu
`Deno KV veritabanı` ile yapacağız.

```ts title="server.ts"
const kv = await Deno.openKv();

Deno.serve(async (request: Request) => {
  // Kısa bağlantılar oluştur
  if (request.method == "POST") {
    const body = await request.text();
    const { slug, url } = JSON.parse(body);
    const result = await kv.set(["links", slug], url);
    return new Response(JSON.stringify(result));
  }

  // Kısa bağlantıları yönlendir
  const slug = request.url.split("/").pop() || "";
  const url = (await kv.get(["links", slug])).value as string;
  if (url) {
    return Response.redirect(url, 301);
  } else {
    const m = !slug ? "Lütfen bir slug sağlayın." : `Slug "${slug}" bulunamadı`;
    return new Response(m, { status: 404 });
  }
});
```

:::tip
Bu sunucuyu makinenizde şu komutla çalıştırabilirsiniz:
:::

```shell
deno run -A --unstable-kv server.ts
```

Bu sunucu, HTTP `GET` ve `POST` istelerine yanıt verecektir. `POST` işleyici, istek gövdesinde `slug` ve `url` özelliklerine sahip bir JSON belgesi almayı bekler. **`slug`**, kısa URL bileşenidir ve **`url`** ise yönlendirmek istediğiniz tam URL'dir.

:::info
Bu API uç noktasını cURL ile kullanmanın bir örneği:
:::

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/runtime/manual","slug":"denodocs"}' \
  http://localhost:8000/
```

Yanıt olarak sunucu, `set` işleminin sonucunu temsil eden KV verileri ile JSON gönderir:

```json
{ "ok": true, "versionstamp": "00000000000000060000" }
```

Sunucumuza yapılan bir `GET` isteği, bir URL slug'ını yol parametresi olarak alacak ve sağlanan URL'ye yönlendirecektir. Bu URL'yi tarayıcıda ziyaret edebilir veya bunu görmek için başka bir cURL isteği yapabilirsiniz!

```shell
curl -v http://localhost:8000/denodocs
```

Artık bir API sunucumuz olduğuna göre, bunu daha sonra Deno Deploy ile bağlayacağımız bir GitHub deposuna yükleyelim.

---

## Uygulamanız için bir GitHub deposu oluşturun

[GitHub](https://github.com) hesabınıza giriş yapın ve
[yeni bir depo oluşturun](https://docs.github.com/en/get-started/quickstart/create-a-repo).
Şimdilik bir README veya başka dosyalar eklemeyi atlayabilirsiniz - boş bir depo işimizi görecektir.

API sunucunuzu oluşturduğunuz klasörde, bu komutları sırayla kullanarak yerel bir git deposu başlatın. `your_username` ve `your_repo_name` değerlerini uygun değerlerle değiştirmeyi unutmayın.

```sh
echo "# My Deno Link Shortener" >> README.md
git init
git add .
git commit -m "ilk taahhüt"
git branch -M main
git remote add origin https://github.com/your_username/your_repo_name.git
git push -u origin main
```

Artık `server.ts` dosyanızla birlikte bir GitHub deponuz olmalı, bu da
[bu örnek depo](https://github.com/kwhinnery/simple_api_server) gibi görünebilir. Artık bu uygulamayı Deno Deploy üzerinde içe aktarabilir ve çalıştırabilirsiniz.

---

## Projenizi içe aktarın ve dağıtın

Sonraki adım, [Deno Deploy](https://dash.deno.com) için bir hesap oluşturmak ve
[yeni bir proje oluşturmak](https://dash.deno.com/new_project). GitHub hesabınızı bağlayın ve az önce oluşturduğumuz depoyu seçin.

![Deno Deploy proje seçimi](../../../images/cikti/denoland/deploy/tutorials/images/simple_api_deploy.png)

Yapılandırmanın şöyle görünmesi gerekir:

![Deno Deploy yapılandırması](../../../images/cikti/denoland/deploy/tutorials/images/simple_api_deploy_settings.png)

"Proje Dağıt" düğmesine tıklayın. Dağıtıldıktan sonra, bağlantı kısaltıcı hizmetiniz Deno Deploy üzerinde canlı olacaktır!

![Deno Deploy kontrol paneli](../../../images/cikti/denoland/deploy/tutorials/images/simple_api_dashboard.png)

---

## Yeni bağlantı kısaltıcınızı test edin

Ek bir yapılandırma olmadan (Deno KV Deploy üzerinde çalışır), uygulamanız yerel makinenizde çalıştığı gibi çalışmalıdır.

Daha önce yaptığınız gibi `POST` işleyicisi ile yeni bağlantılar ekleyebilirsiniz. `localhost` URL'sini Deno Deploy üzerindeki canlı üretim URL'niz ile değiştirin:

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/runtime/","slug":"denodocs"}' \
  https://your-deno-project-url-here.deno.dev/
```

Benzer şekilde, tarayıcıda kısaltılmış URL'lerinizi ziyaret edebilir veya bir cURL komutuyla gelen yönlendirmeyi görebilirsiniz:

```shell
curl -v https://your-deno-project-url-here.deno.dev/denodocs
```

:::note
Bu projeyi beğendiyseniz, bir sonraki adım olarak [Fresh](https://fresh.deno.dev) gibi daha yüksek seviyeli bir web çerçevesine göz atabilir veya `Deno KV hakkında daha fazla bilgi edinebilirsiniz`. Basit API sunucunuzu dağıttığınız için harika bir iş çıkardınız!
:::