---
title: "Webhook işlemlerini bir kuyruğa devretme"
description: Bu kılavuz, bir web uygulamasında asenkron görevlerin işlenmesi için webhook isteklerini kuyruğa devretme işlemini ele alır. Uygulamalarınızın hızlı ve duyarlı kalmasına yardımcı olmayı amaçlamaktadır.
keywords: [webhook, Deno, asenkron işlemler, kuyruk, yapılandırma, GitHub, veritabanı]
---

Bir web uygulamasında, bir istemcinin anında bir yanıt almasına gerek olmayan asenkron görevlerin işlenmesini bir kuyruğa devretmek genellikle arzu edilir. **Bunu yapmak**, web uygulamanızın hızlı ve duyarlı kalmasını sağlayabilir; aksi takdirde, uzun süren işlemlerin tamamlanmasını bekleyerek değerli kaynakları tüketebilir.

:::info
Bu tekniği uygulamak isteyebileceğiniz bir **durum**, [webhook'ları işlemek](https://en.wikipedia.org/wiki/Webhook) olabilir. Yanıt gereksinimi olmayan bir insan dışı istemciden webhook isteğini aldığınız anda, bu görevi daha verimli bir şekilde işlenebilmesi için **bir kuyruğa devredebilirsiniz.**
:::

Bu öğreticide, [bir GitHub deposu için webhook isteklerini işlerken](https://docs.github.com/en/webhooks/about-webhooks-for-repositories) bu tekniği nasıl uygulayacağınızı göstereceğiz.

## Oyun alanında deneme

✏️
[**GitHub deposu webhook işleyicisini uygulayan bu oyun alanını keşfedin**](https://dash.deno.com/playground/github-webhook-example).

Deno Deploy `oyun alanlarını` kullanarak, hem kuyrukları hem de Deno KV'yi kullanan kendi GitHub webhook işleyicinizi anında dağıtabilirsiniz. Bu kodun ne yaptığını birazdan ayrıntılı inceleyeceğiz.

---

## Bir depo için GitHub webhook'larını yapılandırma

Yeni bir webhook'u bir oyun alanında denemek için kontrol ettiğiniz bir GitHub deposu için yeni bir webhook yapılandırması oluşturun. Webhook yapılandırmasını deponuzun "Ayarlar" bölümünde bulabilirsiniz.

![configure a github webhook](../../../../images/cikti/denoland/deploy/kv/tutorials/images/github_webhook.png)

---

## Kod incelemesi

Webhook işleyici fonksiyonumuz **nispeten basittir** - yorumlar olmadan toplamda sadece 23 satır koddan oluşur. Bir Deno KV veritabanına bağlanır, gelen mesajları işlemek için bir kuyruk dinleyicisi ayarlar ve [`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) ile gelen webhook isteklerine yanıt veren basit bir sunucu kurar.

:::tip
Aşağıdaki yorumlarla birlikte okuyarak her adımda neler olduğunu görebilirsiniz.
:::

```ts title="server.ts"
// Bir Deno KV veritabanı örneği için bir referans alın. KV, Deno
// çalışma zamanında yerleşiktir ve hem yerel olarak hem de Deno Deploy üzerinde
// hiçbir yapılandırma olmadan kullanılabilir.
const kv = await Deno.openKv();

// Sunucumuzdan devredilen işleri handle edecek bir dinleyici kurun.
// Bu durumda, sadece gelen webhook yüklerini bir KV
// veritabanına, bir zaman damgası ile ekleyecek.
kv.listenQueue(async (message) => {
  await kv.set(["github", Date.now()], message);
});

// Bu, GitHub webhook'larından gelen POST isteklerini işleyecek basit bir HTTP sunucusudur.
Deno.serve(async (req: Request) => {
  if (req.method === "POST") {
    // GitHub, webhook isteklerini sunucunuza POST istekleri olarak gönderir. JSON'un
    // POST gövdesinde gönderilmesini yapılandırabilirsiniz, bu verileri daha sonra
    // istek nesnesinden ayrıştırabilirsiniz.
    const payload = await req.json();
    await kv.enqueue(payload);
    return new Response("", { status: 200 });
  } else {
    // Sunucu bir GET isteğini işliyorsa, bu da KV veritabanımızda
    // kaydedilen tüm webhook olaylarını listeleyecektir.
    const iter = kv.list<string>({ prefix: ["github"] });
    const github = [];
    for await (const res of iter) {
      github.push({
        timestamp: res.key[1],
        payload: res.value,
      });
    }
    return new Response(JSON.stringify(github, null, 2));
  }
});
```