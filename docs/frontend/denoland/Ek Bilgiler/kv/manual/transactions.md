---
title: "İşlemler"
description: "Deno KV depolamasında iyimser eşzamanlılık kontrolü işlemleri ile ilgili detaylı bilgi ve örnek uygulamalar. Bu yöntem, paylaşılan kaynakların eşzamanlı erişimini yönetmek için sürüm damgaları kullanmaktadır."
keywords: [Deno, KV, işlemler, eşzamanlılık, OCC]
---



Deno KV depolaması, PostgreSQL veya MySQL gibi birçok SQL sistemi ile **etkileşimli işlemler** yerine _iyimser eşzamanlılık kontrolü işlemleri_ kullanır. Bu yaklaşım, belirli bir anahtar için bir değerin mevcut sürümünü temsil eden sürüm damgalarını kullanarak, kilitler olmaksızın paylaşılan kaynaklara eşzamanlı erişimi yönetir. 

:::info
Bir okuma işlemi gerçekleştiğinde, sistem, değerin yanı sıra ilgili anahtar için bir sürüm damgası döndürür.
:::

Bir işlemi gerçekleştirmek için, birden fazla değişiklik eylemi (set veya delete gibi) içerebilen atomik bir işlemi gerçekleştirmek gerekir. Bu eylemlerin yanı sıra, işlem başarısını sağlamak için anahtar+sürüm damgası çiftleri bir koşul olarak sağlanır. **İyimser eşzamanlılık kontrolü işlemi**, belirtilen sürüm damgaları, veritabanındaki ilgili anahtarlar için değerlerin mevcut sürümüyle eşleşirse yalnızca işlenir. Bu işlem modeli, Deno KV deposunda eşzamanlı etkileşimlere izin verirken veri tutarlılığını ve bütünlüğünü sağlar.

> **Önemli Not:** İyimser OCC işlemleri, atomik işlemde belirtilen sürüm kısıtlamalarının ihlal edilmesi nedeniyle işleme alınırken başarısız olabilir.  
> — Deno KV Belgeleri

Bu, bir aracının okumadan işleme alımına kadar işlemin içinde kullanılan bir anahtarı güncellediğinde gerçekleşir. Bu durumda, işlemi gerçekleştiren aracının işlemi yeniden denemesi gerekir.

:::tip
Bir uygulama geliştirirken, işlemler sırasında sürüm damgalarının doğru bir şekilde yönetilmesini sağlamak, veri tutarlılığını korumak için kritiktir.
:::

Deno KV ile OCC işlemlerinin nasıl kullanılacağını göstermek için, bir hesap defteri için `transferFunds(from: string, to: string, amount: number)` işlevinin nasıl uygulanacağını gösteren bir örnek bulunmaktadır. Hesap defteri, her bir hesap için bakiyeyi anahtar-değer deposunda saklar. Anahtarlar, `"account"` ön eki ile başlar ve ardından hesap tanımlayıcısı gelir: `["account", "alice"]`. Her bir anahtar için saklanan değer, hesap bakiyesini temsil eden bir sayıdır.

## İşlev Uygulaması

İşte bu `transferFunds` işlevinin adım adım uygulanması:

```ts
async function transferFunds(sender: string, receiver: string, amount: number) {
  if (amount <= 0) throw new Error("Miktar pozitif olmalıdır");

  // Gönderen ve alıcı hesapları için KV anahtarlarını oluşturun.
  const senderKey = ["account", sender];
  const receiverKey = ["account", receiver];

  // İşlem başarılı olana kadar tekrar deneyin.
  let res = { ok: false };
  while (!res.ok) {
    // Her iki hesabın mevcut bakiyesini okuyun.
    const [senderRes, receiverRes] = await kv.getMany([senderKey, receiverKey]);
    if (senderRes.value === null) {
      throw new Error(`Hesap ${sender} bulunamadı`);
    }
    if (receiverRes.value === null) {
      throw new Error(`Hesap ${receiver} bulunamadı`);
    }

    const senderBalance = senderRes.value;
    const receiverBalance = receiverRes.value;

    // Gönderenin transferi tamamlamak için yeterli bakiyeye sahip olduğundan emin olun.
    if (senderBalance < amount) {
      throw new Error(
        `${sender} hesabından ${amount} transfer etmek için yetersiz bakiye.`,
      );
    }

    // Transferi gerçekleştirin.
    const newSenderBalance = senderBalance - amount;
    const newReceiverBalance = receiverBalance + amount;

    // İşlemi işlemeye çalışın. `res`, işlem başarısız olursa `ok: false` döndürür
    // (yani, bir anahtar için sürüm damgası değiştiğinde)
    res = await kv.atomic()
      .check(senderRes) // Gönderenin bakiyesinin değişmediğinden emin olun.
      .check(receiverRes) // Alıcının bakiyesinin değişmediğinden emin olun.
      .set(senderKey, newSenderBalance) // Gönderenin bakiyesini güncelleyin.
      .set(receiverKey, newReceiverBalance) // Alıcının bakiyesini güncelleyin.
      .commit();
  }
}
```

Bu örnekte, `transferFunds` işlevi, her iki hesabın bakiyelerini ve sürüm damgalarını okur, transferden sonra yeni bakiyeleri hesaplar ve A hesabında yeterli fonun olup olmadığını kontrol eder. Ardından atomik bir işlem gerçekleştirir, yeni bakiyeleri sürüm damgası kısıtlamalarıyla ayarlar. İşlem başarılı olursa döngü sona erer. Eğer sürüm kısıtlamaları ihlal edilirse, işlem başarısız olur ve döngü işlemi başarılı olana kadar tekrar eder.

## Sınırlar

2 KiB maks anahtar boyutu ve 64 KiB maks değer boyutuna ek olarak, Deno KV işlem API'si ile ilgili bazı sınırlamalar vardır:

- **`kv.getMany()` için Maks anahtarlar**: 10
- **`kv.list()` için Maks toplu boyut**: 1000
- **Bir atomik işlemde Maks kontroller**: 100
- **Bir atomik işlemde Maks değişiklikler**: 1000
- **Bir atomik işlemin Maks toplam boyutu**: 800 KiB. Bu, kontroller ve değişikliklerdeki tüm anahtarlar ve değerleri içerir ve kodlama aşırı yükü de bu sınıra dahil edilir.
- **Anahtarların Maks toplam boyutu**: 90 KiB. Bu, kontroller ve değişikliklerdeki tüm anahtarları içerir ve kodlama aşırı yükü de bu sınıra dahil edilir.
- **`kv.watch()` için Maks izlenen anahtarlar**: 10