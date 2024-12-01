---
title: "Basit HTTP sunucusu"
description: Bu eğiticide, gelen tüm HTTP isteklerine 'Merhaba, dünya!' yanıtı veren bir HTTP sunucusu inşa edeceksiniz. Deno Deploy ile dağıtım süreci de açıklanmaktadır.
keywords: [HTTP, Deno, sunucu, dağıtım, Merhaba Dünya]
---

Bu eğiticide, gelen tüm HTTP isteklerine `Merhaba, dünya!` yanıtı veren ve `200 OK` HTTP durumunu döndüren bir HTTP sunucusu inşa edelim. Bu script'i dağıtmak ve düzenlemek için Deno Deploy oyun alanını kullanacağız.

## Adım 1: HTTP sunucu script'ini yazın

Deno'da [`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) kullanarak tek bir satır kod ile basit bir HTTP sunucusu yazılabilir:

```js title="Tek satırlık HTTP sunucusu"
Deno.serve(() => new Response("Merhaba, dünya!"));
```

> **Not:** Bu tür bir sunucu başlangıç için faydalıdır, ancak `Deno.serve` daha gelişmiş kullanımları da destekleyebilir ([API referansı dökümanları](https://docs.deno.com/api/deno/~/Deno.serve)). Aşağıda diğer API özelliklerinden yararlanan daha karmaşık bir sunucu örneği bulunmaktadır.

```ts title="Daha karmaşık Merhaba Dünya sunucusu"
Deno.serve({
  onListen: ({ port }) => {
    console.log("Deno sunucusu dinliyor *:", port);
  },
}, (req: Request, conn: Deno.ServeHandlerInfo) => {
  // Gelen istekle ilgili bilgileri al
  const method = req.method;
  const ip = conn.remoteAddr.hostname;
  console.log(`${ip} sadece bir HTTP ${method} isteği yaptı.`);

  // Web standartlarına uygun bir Response nesnesi döndür
  return new Response("Merhaba, dünya!");
});
```

---

## Adım 2: Script'i Deno Deploy'a dağıtın

1. [Deno kontrol panelinizi](https://dash.deno.com/account/overview) ziyaret ederek yeni bir oyun alanı projesi oluşturun ve **Yeni Oyun Alanı** butonuna tıklayın.
2. Bir sonraki ekranda, yukarıdaki kodu (kısa veya uzun örnek) ekranın sol tarafındaki editöre kopyalayın.
3. Ekranın üst araç çubuğunun sağ tarafında bulunan **Kaydet & Dağıt** butonuna basın (veya Ctrl+S tuşlarına basın).

---

Sonucu, oyun alanı editörünün sağ tarafında, önizleme panelinde görüntüleyebilirsiniz.

Script'i değiştirdiğinizde (örneğin `Merhaba, Dünya!` -> `Merhaba, Galaksi!`) ve ardından yeniden dağıttığınızda, önizleme otomatik olarak güncellenecektir. Önizleme panelinin üst kısmında görünen URL, dağıtılan sayfaya herhangi bir yerden erişmek için kullanılabilir.

:::tip
Oyun alanı editöründe bile, script'ler dünya genelindeki tüm ağımız üzerinden dağıtılmaktadır. Bu, kullanıcılarınızın konumuna bakılmaksızın hızlı ve güvenilir bir performans garanti eder.
:::