---
title: "Temel Bilgiler"
parent: "Kullanım"
nav_order: 1
description: "Bu belge, Cron işlerinin nasıl planlandığını ve durumunun nasıl kontrol edileceğini açıklamaktadır. Ayrıca, iş kontrol fonksiyonları ve özellikleri hakkında bilgiler de içermektedir."
keywords: [Cron, planlama, fonksiyonlar, kontrol, job]
---

# Temel kullanım

---

Croner, üç argüman alan `new Cron()` fonksiyonunu kullanır:

```ts
const job = new Cron(
    /* Desen */
    "* * * * * *",
    /* Seçenekler (isteğe bağlı) */
    { maxRuns: 1 },
    /* Fonksiyon (isteğe bağlı) */
    () => {}
);
```

Eğer yapıcıda fonksiyon atlanırsa, daha sonra planlanabilir:

```ts
job.schedule(job, /* isteğe bağlı */ context) => {});
```

İş, bir sonraki eşleşen zamanda çalışacak şekilde planlanacaktır, aksi takdirde `{ paused: true }` seçeneğini sağlarsanız. `Cron(...)` yapıcısı, daha sonra `job` olarak anılacak bir Cron örneği döndürecektir; bu örneğin birkaç yöntemi ve özelliği vardır.

{% include multiplex.html %}

## Durum

İşin durumunu aşağıdaki yöntemlerle kontrol edin:

```ts
job.nextRun( /*isteğe bağlı*/ startFromDate );    // Bir sonraki çalışmayı temsil eden bir Date nesnesi alın.
job.nextRuns(10, /*isteğe bağlı*/ startFromDate ); // Bir dizi Date alarak, sonraki n çalışmayı içeren.
job.msToNext( /*isteğe bağlı*/ startFromDate ); // Bir sonraki yürütmeye kadar kalan milisaniyeleri alın.
job.currentRun();         // Mevcut (veya son) çalışmanın başlatıldığı zamanı gösteren bir Date nesnesi alın.
job.previousRun( );         // Önceki işin ne zaman başlatıldığını gösteren bir Date nesnesi alın.

job.isRunning();     // İşin planlanıp planlanmadığını ve duraklatılmadığını veya iptal edilip edilmediğini belirtir (doğru ya da yanlış).
job.isStopped();     // İşin `stop()` ile kalıcı olarak durdurulup durdurulmadığını belirtir (doğru ya da yanlış).
job.isBusy();         // İşin şu anda çalışıyor olup olmadığını belirtir (doğru ya da yanlış).

job.getPattern();     // Orijinal desen dizisini döner
```

:::info
Bu yöntemler, işin durumunu ve çalıştırma zamanlamalarını kontrol etmek için oldukça faydalıdır.
:::

## Kontrol Fonksiyonları

İşi aşağıdaki yöntemlerle kontrol edin:

```ts
job.trigger();     // Anında bir tetiklemesi zorla
job.pause();       // Tetiklemeyi duraklat
job.resume();      // Tetiklemeyi devam ettir
job.stop();        // İşi tamamen durdur. Bundan sonra devam ettirmek mümkün değildir.
                   // Ayrıca, bu, adlandırılmış işleri dışa aktarılan `scheduledJobs` dizisinden de kaldırır.
```

:::tip
İşinizi durdurmak isteyebilirsiniz ancak dikkatli olun, bir kez durdurulduğunda devam ettirilemez.
:::

## Özellikler

```ts
job.name             // İsteğe bağlı iş adı, eğer bir ad seçeneklere geçirilmişse doldurulur
```