---
title: "Kuyrukların Kullanımı"
description: Deno çalışma zamanında kuyruk API'sinin nasıl kullanılacağını ve mesajları asenkron olarak nasıl işleyeceğinizi öğrenin. Kuyruklar, görev yükleme ve iş planlama gibi uygulamalarda oldukça faydalıdır.
keywords: [Deno, kuyruk API, asenkron işleme, mesaj sırası, KV atomik işlemler]
---



Deno çalışma zamanı, daha büyük yüklerin asenkron işlenmesini destekleyen bir kuyruk API'si içerir ve kuyruklanan mesajların en az bir kez teslimatı garantisi sunar. Kuyruklar, bir web uygulamasında görevleri yüklemek veya gelecekte bir zamanda iş birimlerini planlamak için kullanılabilir.

:::info
Kuyruklarla kullanacağınız temel API'ler, `Deno.Kv` ad alanındaki
[`enqueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.enqueue) ve
[`listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) olur.
:::

## Bir mesaj kuyruğa eklemek

İşlenmek üzere bir mesajı kuyruğa eklemek için,
[`Deno.Kv`](https://docs.deno.com/api/deno/~/Deno.Kv) örneği üzerinde `enqueue`
yöntemini kullanın. Aşağıdaki örnekte, bir bildirimin teslimatı için kuyruğa
eklenmesi görünmektedir.

```ts title="queue_example.ts"
// Mesaj nesnenizin şeklini tanımlayın (isteğe bağlı)
interface Notification {
  forUser: string;
  body: string;
}

// Bir KV örneğine başvurun
const kv = await Deno.openKv();

// Bir bildirim nesnesi oluşturun
const message: Notification = {
  forUser: "alovelace",
  body: "Size yeni bir e-posta var!",
};

// Mesajı hemen teslimat için kuyruğa ekleyin
await kv.enqueue(message);
```

:::tip
Mesajı daha sonra teslim etmek için milisaniye cinsinden bir `delay` seçeneği belirtebilirsiniz.
:::

```ts
// Mesajı 3 gün içinde teslim almak üzere kuyruğa ekleyin
const delay = 1000 * 60 * 60 * 24 * 3;
await kv.enqueue(message, { delay });
```

Ayrıca, mesajınız herhangi bir nedenle teslim edilmezse, mesaj değerinizi saklamak için Deno KV'de bir anahtar belirtebilirsiniz.

```ts
// Başarısız bir mesajın gönderileceği anahtarı yapılandırın
const backupKey = ["failed_notifications", "alovelace", Date.now()];
await kv.enqueue(message, { keysIfUndelivered: [backupKey] });

// ... felaket meydana geldi ...

// Gönderilmeyen mesajı alın
const r = await kv.get<Notification>(backupKey);
// Bu gönderilmeyen mesajdır:
console.log("Gönderilmeyen bildirim bulundu:", r.value?.forUser);
```

## Mesajları dinlemek

Bir [`Deno.Kv`](https://docs.deno.com/api/deno/~/Deno.Kv) örneği üzerinde
`listenQueue` yöntemiyle kuyruğunuza eklenen öğeleri işlemek için bir JavaScript
fonksiyonu yapılandırabilirsiniz.

```ts title="listen_example.ts"
// Kuyrukta beklediğimiz mesajın nesne şeklini tanımlayın
interface Notification {
  forUser: string;
  body: string;
}

// Gelen mesajın türünü kontrol etmek için bir tür koruyucu oluşturun
function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.forUser !== undefined &&
      typeof (o as Notification).forUser === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}

// Bir KV veritabanına başvurun
const kv = await Deno.openKv();

// Değerleri dinlemek için bir işleyici fonksiyonu kaydedin - bu örnek
// bir bildirimin nasıl gönderileceğini gösterir
kv.listenQueue((msg: unknown) => {
  // Tür koruyucusunu kullanın - böylece TypeScript derleyicisi msg'nin
  // bir Bildirim olduğunu bilir
  if (isNotification(msg)) {
    console.log("Kullanıcıya bildirim gönderiliyor:", msg.forUser);
    // ... bildirimi gerçekten göndermek için bir şey yapın!
  } else {
    // Mesaj bilinen bir tipe ait değilse, bir hata olabilir
    console.error("Bilinmeyen mesaj alındı:", msg);
  }
});
```

## KV atomik işlemleri ile kuyruk API'si

Kuyruk API'sini
`KV atomik işlemleri` ile birleştirerek,
mesajları atomik olarak kuyruğa ekleyebilir ve aynı işlemi anahtarları
değiştirebilirsiniz.

```ts title="kv_transaction_example.ts"
const kv = await Deno.openKv();

kv.listenQueue(async (msg: unknown) => {
  const nonce = await kv.get(["nonces", msg.nonce]);
  if (nonce.value === null) {
    // Bu mesaj zaten işlendi
    return;
  }

  const change = msg.change;
  const bob = await kv.get(["balance", "bob"]);
  const liz = await kv.get(["balance", "liz"]);

  const success = await kv.atomic()
    // Bu mesajın henüz işlenmediğinden emin olun
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .sum(["processed_count"], 1n)
    .check(bob, liz) // bakiyeler değişmedi
    .set(["balance", "bob"], bob.value - change)
    .set(["balance", "liz"], liz.value + change)
    .commit();
});

// Anahtarları değiştirin ve aynı KV işleminde mesajları kuyruğa ekleyin!
const nonce = crypto.randomUUID();
await kv
  .atomic()
  .check({ key: ["nonces", nonce], versionstamp: null })
  .enqueue({ nonce: nonce, change: 10 })
  .set(["nonces", nonce], true)
  .sum(["enqueued_count"], 1n)
  .commit();
```

## Kuyruk davranışı

### Mesaj teslim garantileri

Çalışma zamanı, en az bir kez teslimatı garanti eder. Bu, kuyruklanan
mesajların çoğu için
[`listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue)
işleyicisinin her mesaj için bir kez çağrılacağı anlamına gelir. Bazı hata
senaryolarında, teslimatı sağlamak için aynı mesaj için işleyici birden fazla
kez çağrılabilir. Uygulamalarınızı tasarlarken, tekrar eden mesajların
doğru bir şekilde işlenmesini sağlamak önemlidir.

Kuyrukları
[KV atomik işlemleri](https://docs.deno.com/deploy/kv/manual/transactions)
primitifleri ile birleştirerek kuyruk işleyicisi KV güncellemelerinin her
mesaj için tam olarak bir kez yapılmasını sağlayabilirsiniz. Bkz.
`Kuyruk API'si ile KV atomik işlemleri`.

### Otomatik yeniden denemeler

[`listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue)
işleyicisi, kuyruklu mesajlar hazır olduğunda işlemek üzere çağrılır. Eğer
işleyiciniz bir istisna fırlatırsa, çalışma zamanı işleyiciyi tekrar çağırmayı
otomatik olarak dener. İşleyici başarılı oluncaya veya maksimum yeniden deneme
denemelerine ulaşılıncaya kadar yeniden çağrılacaktır. Mesaj, [`listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) işleyicisinin
başarılı bir şekilde tamamlanması durumunda başarılı bir şekilde işlenmiş
sayılır. İşleyici sürekli olarak yeniden denemelerde başarısız olursa,
mesaj düşer.

### Mesaj teslim sırası

Çalışma zamanı, mesajları en iyi şekilde sıralı olarak teslim etmeye çalışır.
Ancak, kesin bir sıra garantisi yoktur. Zaman zaman, maksimum verimliliği
sağlamak için mesajlar sıradan çıkmış olarak teslim edilebilir.

## Deno Deploy'da Kuyruklar

Deno Deploy, yüksek erişilebilirlik ve verimlilik için tasarlanmış
kuyruk API'sinin global, sunucusuz, dağıtılmış uygulamasını sunar. Bunu,
büyük yüklerle başa çıkabilecek uygulamalar oluşturmak için kullanabilirsiniz.

### Zamanında izolasyon başlatma

Deno Deploy'de kuyruklar kullanıldığında, mesaj işlenmek üzere
[`listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue)
işleyicisi çağrıldığında, izolasyon otomatik olarak talep üzerine başlatılır.
[`listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue)
işleyicisini tanımlamak, Deno Deploy uygulamanızda kuyruk işlemanı
etkinleştirmek için tek gereksinimdir, ek bir yapılandırmaya gerek yoktur.

### Kuyruk boyutu limiti

Teslim edilmemiş kuyruk mesajlarının maksimum sayısı 100,000 ile sınırlıdır.
[`enqueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.enqueue) yöntemi,
kuyruk dolu olduğunda bir hata ile başarısız olur.

### Fiyatlandırma detayları ve limitler

- [`enqueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.enqueue), diğer
  [`Deno.Kv`](https://docs.deno.com/api/deno/~/Deno.Kv) yazma işlemleri
  gibi değerlendirilir. Kuyruğa eklenen mesajlar KV depolama ve yazma
  birimlerini tüketir.
- [`listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) aracılığıyla
  teslim edilen mesajlar istek ve KV yazma birimlerini tüketir.
- Daha fazla bilgi için [Fiyatlandırma detayları](https://deno.com/deploy/pricing) sayfasına bakın.

## Kullanım Senaryoları

Kuyruklar birçok farklı senaryoda yararlı olabilir, ancak web uygulamaları
inşa ederken sıkça görebileceğiniz birkaç kullanım durumu vardır.

### Asenkron süreçleri yükleme

Bazen bir istemci tarafından başlatılan bir görev (örneğin bildirim gönderme veya API
isteği gibi), istemcilerin yanıt döndürülmeden önce bu görevin tamamlanmasını beklemelerini
istemeyecek kadar uzun sürebilir. Diğer zamanlarda, istemcilerin bir yanıt
almaları gerekmez; örneğin bir istemcinin uygulamanıza bir
[webhook isteği](https://en.wikipedia.org/wiki/Webhook) gönderdiği durumlarda,
altındaki görevin tamamlanmasını beklemek gerekmez.

Bu durumlarda, web uygulamanızı yanıtlı tutmak ve istemcilere anında geri bildirim
göndermek için işlemleri bir kuyruğa yükleyebilirsiniz. Bu kullanım
durumunu aksiyon halinde görmek için `webhook işleme örneğimize`
göz atın.

### Gelecek için iş planlama

Kuyrukların (ve bu gibi kuyruk API'lerinin) bir diğer yararlı uygulaması, gelecekte
uygun bir zamanda iş yapmak üzere planlamaktır. Belki yeni bir müşteriye sipariş verdikten bir
gün sonra bir tatmin anketi göndermek istersiniz. Bir kuyruk mesajının
24 saat içinde teslim edilmesi için planlayabilir ve bu zamanda bildirimi
göndermek için bir dinleyici kurabilirsiniz.

:::note
Gelecekte bir bildirimin gönderilmesini planlama örneğine göz atmak için
`bildirim örneğimize` göz atın.
:::