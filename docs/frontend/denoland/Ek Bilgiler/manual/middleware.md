---
title: "Ters Proxy Araç Yazılımı"
description: Bu hızlı başlangıç, başka bir sunucuya ters proxy yapan bir ara yazılım parçasının nasıl dağıtılacağını açıklamaktadır. Adım adım talimatlar ve örneklerle, hızlı bir şekilde uygulamanızı dağıtabilirsiniz.
keywords: [ters proxy, Deno, ara yazılım, dağıtım, örnek kod, HTTP sunucu]
---

Bu hızlı başlangıç, başka bir sunucuya (bu durumda example.com) ters proxy yapan küçük bir ara yazılım parçasının nasıl dağıtılacağını kapsayacaktır. Yaygın ara yazılım işlevleri için ek örnekler görmek için `örnek galerisi`'ne bakın.

## **Adım 1:** Deno Deploy üzerinde yeni bir oyun alanı projesi oluşturun

https://dash.deno.com/projects adresine gidin ve "Yeni Oyun Alanı" butonuna tıklayın.

## **Adım 2:** Oyun alanı üzerinden ara yazılım kodunu dağıtın

Sonraki sayfada, aşağıdaki kodu kopyalayıp editöre yapıştırın. Bu, gelen tüm istekleri https://example.com adresine yönlendiren bir HTTP sunucusudur.

```ts
async function reqHandler(req: Request) {
  const reqPath = new URL(req.url).pathname;
  return await fetch("https://example.com" + reqPath, { headers: req.headers });
}

Deno.serve(reqHandler);
```

:::tip
**Kaydet ve Dağıt butonuna tıklayın.** Bu, ara yazılımınızın Deno üzerinde başarılı bir şekilde dağıtılmasını sağlar.
:::

Bunu benzeri bir şey görmelisiniz:

![image](../../../images/cikti/denoland/deploy/docs-images/proxy_to_example.png)