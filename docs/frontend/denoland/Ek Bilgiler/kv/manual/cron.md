---
title: "Cron görevlerini zamanlama"
description: "Bu belge, Deno ortamında cron görevlerinin nasıl oluşturulacağı ve yönetileceği üzerine bilgi vermektedir. JavaScript ve TypeScript kullanarak belirli zaman dilimlerinde çalışacak görevlerin nasıl yapılandırılacağını öğrenin."
keywords: [Deno, cron, görev zamanlama, JavaScript, TypeScript, arka plan görevleri, dağıtım]
---



[`Deno.cron`](https://docs.deno.com/api/deno/~/Deno.cron) arayüzü, ayarlanabilir bir zaman diliminde çalışacak JavaScript veya TypeScript kodunu yapılandırmanıza olanak tanır. İşte aşağıda, **her dakika** çalışacak bir JavaScript kod bloğunu yapılandırıyoruz.

```ts
Deno.cron("Bir mesaj kaydet", "* * * * *", () => {
  console.log("Bu her dakika bir kez yazdırılacak.");
});
```

JavaScript nesnelerini kullanarak cron zamanlamasını tanımlamak da mümkündür. Aşağıdaki örnekte, **her saat başı** çalışacak bir JavaScript kod bloğunu yapılandırıyoruz.

```ts
Deno.cron("Bir mesaj kaydet", { hour: { every: 1 } }, () => {
  console.log("Bu her saat bir kez yazdırılacak.");
});
```

`Deno.cron` üç argüman alır:

- **Cron görevi için insan tarafından okunabilir bir ad**
- **Cron işinin çalışacağı zamanlamayı tanımlayan bir cron zamanlama dizesi veya JavaScript nesnesi**
- **Verilen zamanlama dahilinde çalışacak bir işlev**

Eğer cron sözdizimine yeniyseniz, :::tip **buna benzer** [buna benzer](https://www.npmjs.com/package/cron-time-generator) birçok üçüncü taraf modülünüz var, böylece cron zamanlama dizelerini oluşturmanıza yardımcı olurlar.

---

## Başarısız çalışmaları yeniden deneme

Başarısız cron çağrıları varsayılan bir yeniden deneme politikası ile otomatik olarak tekrar denenir. Özel bir yeniden deneme politikası belirtmek istiyorsanız, işlev çağrısını yeniden denemeden önce beklemek için bir dizi bekleme süresi (milisaniye olarak) belirtmek üzere `backoffSchedule` özelliğini kullanabilirsiniz. Aşağıdaki örnekte, başarısız geri çağırmaları bir kez 1 saniye, 5 saniye ve ardından 10 saniye olmak üzere üç kez yeniden denemeyi deneyeceğiz.

```ts
Deno.cron("Yeniden deneme örneği", "* * * * *", () => {
  throw new Error("Deno.cron bunu üç kez yeniden deneyecek, ancak sonuç alamayacak!");
}, {
  backoffSchedule: [1000, 5000, 10000],
});
```

---

## Tasarım ve sınırlamalar

`Deno.cron` kullanırken dikkate almanız gereken bazı tasarım detayları ve sınırlamalar aşağıda verilmiştir.

### Görevler üst düzey modül kapsamına tanımlanmalıdır

[`Deno.cron`](https://docs.deno.com/api/deno/~/Deno.cron) arayüzü, önceden tanımlanmış zamanlamalara dayanan cron görevlerinin statik tanımını destekleyecek şekilde tasarlanmıştır. Tüm `Deno.cron` görevleri bir modülün üst düzeyinde tanımlanmalıdır. Herhangi bir iç içe `Deno.cron` tanımı (örneğin, [`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) işleyici içinde) bir hata almanıza ya da yok sayılmanıza neden olacaktır.

:::warning
Eğer Deno programı çalıştırmanız sırasında dinamik olarak görevleri zamanlamak istiyorsanız, `Deno Kuyrukları` API'lerini kullanabilirsiniz.
:::

### Zaman dilimi

`Deno.cron` zamanlamaları **UTC zaman dilimi** kullanılarak belirtilir. Bu, yaz saati uygulaması yapan zaman dilimindeki sorunları önlemeye yardımcı olur.

### Kesişen yürütmeler

Cron görevlerinizin bir sonraki planlanan çağrısı, önceki çağrısı ile çakışabilir. Bu gerçekleşirse, `Deno.cron` kesişen yürütmeleri önlemek için bir sonraki planlanan çağrıyı atlayacaktır.

:::
:::note
`Deno.cron` 0 tabanlı haftanın günü sayısal temsilini kullanmaz. Bunun yerine, Pazar'dan Cumartesi'ye kadar olan günleri temsil etmek için **1-7** (veya PAZ-CUM) kullanır. Bu, 0-6 temsili kullanan diğer cron motorlarıyla karşılaştırıldığında farklı olabilir.
:::

---

## Deno Deploy'da kullanım

[ Deno Deploy](https://www.deno.com/deploy) ile arka plan görevlerinizi bulutta V8 izolasyonlarında çalıştırabilirsiniz. Bunu yaparken, akılda tutulması gereken birkaç husus vardır.

### Deno CLI ile farklılıklar

Diğer Deno çalışma zamanı yapı taşları (kuyruklar ve Deno KV gibi) gibi, `Deno.cron` uygulaması **Deno Deploy'de** biraz farklı çalışır.

#### Cron varsayılan olarak nasıl çalışır

Deno çalışma zamanındaki `Deno.cron` uygulaması yürütme durumunu bellekte tutar. Eğer birden fazla Deno programı çalıştırırsanız ve bunlar `Deno.cron` kullanıyorsa, her programın kendi bağımsız cron görevleri kümesi olacaktır.

#### Deno Deploy'de cron nasıl çalışır

Deno Deploy, yüksek erişilebilirlik ve ölçek için tasarlanmış bir `Deno.cron` sunucusuz uygulamasını sağlar. Deno Deploy, dağıtım sırasında `Deno.cron` tanımlarınızı otomatik olarak çıkarır ve bunları talep üzerine izolasyonlar kullanarak yürütür. En son üretim dağıtımınız, yürütülmek üzere planlanan aktif cron görevleri kümesini tanımlar. Cron görevlerini eklemek, çıkarmak veya değiştirmek için, kodunuzu basitçe değiştirin ve yeni bir üretim dağıtımı oluşturun.

Deno Deploy, cron görevlerinizin **her planlanan zaman aralığında en az bir kez** yürütülmesini garanti eder. Bu, genellikle cron işleyicinizin her planlanan zamanda bir kez çağrılacağı anlamına gelir. Bazı hata senaryolarında işleyici, aynı planlı zaman için birden fazla kez çağrılabilir.

### Cron kontrol paneli

Üretim dağıtımı yaptığınızda ve bu dağıtımda bir cron görevi bulunduğunda, projeleriniz altında `Cron` sekmesinde tüm cron görevlerinizin bir listesini [Dağıtım kontrol paneli](https://dash.deno.com/projects) üzerinden görüntüleyebilirsiniz.

![Deno kontrol panelinde cron görevlerinin listesi](../../../../images/cikti/denoland/deploy/kv/manual/images/cron-tasks.png)

### Fiyatlandırma

`Deno.cron` çağrıları, dağıtımlarınıza yapılan gelen HTTP istekleri ile aynı tarifeye tabidir. Fiyatlandırma hakkında daha fazla bilgi edinin [burada](https://deno.com/deploy/pricing).

### Dağıtım özel sınırlamalar

- `Deno.cron`, yalnızca üretim dağıtımları için kullanılabilir (önizleme dağıtımları için değil)
- `Deno.cron` işleyicinizin kesin çağrı zamanı, planlanan zamandan bir dakikaya kadar değişebilir.

---

## Cron yapılandırma örnekleri

İşte size birkaç yaygın cron yapılandırması, kullanım kolaylığınız için sağlanmıştır.

```ts title="Dakikada bir kez çalıştır"
Deno.cron("Dakikada bir kez çalıştır", "* * * * *", () => {
  console.log("Merhaba, cron!");
});
```

```ts title="Her on beş dakikada bir çalıştır"
Deno.cron("Her on beş dakikada bir çalıştır", "*/15 * * * *", () => {
  console.log("Merhaba, cron!");
});
```

```ts title="Her saat başı çalıştır"
Deno.cron("Her saat başı çalıştır", "0 * * * *", () => {
  console.log("Merhaba, cron!");
});
```

```ts title="Her üç saatte bir çalıştır"
Deno.cron("Her üç saatte bir çalıştır", "0 */3 * * *", () => {
  console.log("Merhaba, cron!");
});
```

```ts title="Her gün saat 1'de çalıştır"
Deno.cron("Her gün saat 1'de çalıştır", "0 1 * * *", () => {
  console.log("Merhaba, cron!");
});
```

```ts title="Her Çarşamba gece yarısı çalıştır"
Deno.cron("Her Çarşamba gece yarısı çalıştır", "0 0 * * WED", () => {
  console.log("Merhaba, cron!");
});
```

```ts title="Ayın ilk günü gece yarısı çalıştır"
Deno.cron("Ayın ilk günü gece yarısı çalıştır", "0 0 1 * *", () => {
  console.log("Merhaba, cron!");
});
```