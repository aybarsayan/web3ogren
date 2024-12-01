---
title: "Gelecek bir tarih için bir bildirim planlama"
description: Bu doküman, Deno ortamında gelecekteki bildirimlerin nasıl planlanacağını açıklamaktadır. Örnek bir uygulama üzerinden Courier API kullanarak bildirimlerin yönetimi hakkında bilgi verilmektedir.
keywords: [Deno, bildirim, Courier API, örnek uygulama, planlama]
---

`kuyruklar` için yaygın bir kullanım durumu, bir işin **gelecekte** bir noktada tamamlanması için planlanmasıdır. Bunun nasıl çalıştığını göstermek için, aşağıda tanımlanan bir örnek uygulama sağladık; bu uygulama [Courier API](https://www.courier.com/) aracılığıyla gönderilen bildirim mesajlarını planlamaktadır. Uygulama, Deno'nun sıfır yapılandırma ile mevcut KV ve kuyruk API uygulamalarını kullanarak [Deno Deploy](https://www.deno.com/deploy) üzerinde çalışmaktadır.

## Örneği indirin ve yapılandırın

⬇️
[**Tam örnek uygulamasını buradan indirin veya klonlayın**](https://github.com/kwhinnery/deno_courier_example).

:::tip
Bu örnek uygulamayı çalıştırmak ve dağıtmak için GitHub deposundaki [`README` dosyasındaki](https://github.com/kwhinnery/deno_courier_example) talimatları kullanabilirsiniz.
:::

Yukarıdaki örnek uygulamayı çalıştırmak için ayrıca [Courier'a kaydolmanız](https://app.courier.com/signup) gerekmektedir. Elbette uygulamada göreceğiniz teknikler, [Amazon SNS](https://aws.amazon.com/sns/) ve [Twilio](https://www.twilio.com) gibi herhangi bir bildirim servisine de kolayca uygulanabilir, ancak **Courier**, test etmek için kişisel bir GMail hesabıyla kullanabileceğiniz kullanımı kolay bir bildirim API'si sağlar (yapabileceği diğer harika şeylerin yanı sıra).

---

## Temel işlevsellik

Projeyi kurduktan ve çalıştırdıktan sonra, zamanlama mekanizmalarını uygulayan kodun birkaç önemli bölümüne dikkat etmek isteriz.

### KV'ye bağlanma ve uygulama başlatıldığında bir dinleyici ekleme

Örnek uygulamanın işlevselliğinin çoğu, en üst düzey dizindeki [server.tsx](https://github.com/kwhinnery/deno_courier_example/blob/main/server.tsx) dosyasında yer almaktadır. Deno uygulama süreci başladığında, Deno KV örneğine bağlantı kurar ve kuyruktan alınan mesajları işlemek için bir olay işleyici bağlar.

```ts title="server.tsx"
// Bir Deno KV veritabanı referansı oluşturun
const kv = await Deno.openKv();

// Kuyruktan alınan mesajları işleyecek bir dinleyici oluşturun
kv.listenQueue(async (message) => {
  /* ... dinleyici burada uygulaması ... */
});
```

### Bir bildirim oluşturma ve planlama

Bu demo uygulamasındaki form aracılığıyla yeni bir sipariş gönderildikten sonra, bir bildirim e-postası gönderilmeden önce **beş saniyelik bir gecikme** ile `enqueue` fonksiyonu çağrılır.

```ts title="server.tsx"
app.post("/order", async (c) => {
  const { email, order } = await c.req.parseBody();
  const n: Notification = {
    email: email as string,
    body: `Sipariş alındı: "${order as string}"`,
  };

  // Gelecekte bir zaman seçin - şimdilik, sadece 5 saniye bekleyin
  const delay = 1000 * 5;

  // Mesajı işlenmek üzere sıraya alın!
  kv.enqueue(n, { delay });

  // Başarı mesajıyla ana sayfaya yönlendirin!
  setCookie(c, "flash_message", "Sipariş oluşturuldu!");
  return c.redirect("/");
});
```

### TypeScript'te bildirim veri türünü tanımlama

Sıklıkla, veriyi kuyruğa itme veya kuyruktan çıkarırken güçlü bir şekilde tiplenmiş nesnelerle çalışmak istenir. Kuyruk mesajları başlangıçta [`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown) TypeScript türünde olmasına rağmen, derleyiciye beklediğimiz verinin yapısını belirtmek için [tip korumalarını](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) kullanabiliriz.

:::note
İşte sistemimizdeki bir bildirimin özelliklerini tanımlamak için kullandığımız [bildirim modülünün](https://github.com/kwhinnery/deno_courier_example/blob/main/notification.ts) kaynak kodu.
:::

```ts title="notification.ts"
// Bir bildirim nesnesinin yapısı
export default interface Notification {
  email: string;
  body: string;
}

// Bir bildirim nesnesi için tip koruması
export function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.email !== undefined &&
      typeof (o as Notification).email === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}
```

`server.tsx` dosyasında, doğru mesaj türlerine yanıt verdiğimizden emin olmak için dışa aktarılan tip korumasını kullanıyoruz.

```ts title="server.tsx"
kv.listenQueue(async (message) => {
  // Yanlış türde bir mesaj varsa erken çıkmak için tip korumasını kullanın
  if (!isNotification(message)) return;

  // TypeScript'in artık bir Notification arayüzü olduğunu bildiği mesajdan ilgili verileri alın
  const { email, body } = message;

  // Courier ile bir e-posta bildirimi oluşturun
  // ...
});
```

### Courier API isteği gönderme

Planlandığı gibi bir e-posta göndermek için Courier REST API'sini kullanıyoruz. Courier REST API hakkında daha fazla bilgi için [referans belgelerine](https://www.courier.com/docs/reference/send/message/) göz atabilirsiniz.

```ts title="server.tsx"
const response = await fetch("https://api.courier.com/send", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${COURIER_API_TOKEN}`,
  },
  body: JSON.stringify({
    message: {
      to: { email },
      content: {
        title: "Deno ile yeni sipariş verildi!",
        body: "bildirim içeriği burada yer alacak",
      },
    },
  }),
});
```