---
description: Bu içerikte, `runExit` ve `run` fonksiyonlarının kullanımı ve işleyişi açıklanmaktadır. Küçük CLI'lar oluştururken gereksiz kod miktarını azaltan bu fonksiyonlar hakkında bilgiler bulacaksınız.
keywords: [runExit, run, CLI, komut, JavaScript, TypeScript, yardımcı fonksiyonlar]
---
# Yardımcı Fonksiyonlar

## `runExit` / `run`

```ts
run(opts?: {...}, commands: Command | Command[], argv?: string[], context?: Context)
runExit(opts?: {...}, commands: Command | Command[], argv?: string[], context?: Context)
```

:::tip
Bu fonksiyonlar, küçük CLIs oluştururken yazmanız gereken gereksiz kod miktarını azaltarak `Cli` sınıfını basit yardımcılar arkasında soyutlar.
:::

Komutlar (ve `context` için özel anahtarlar belirtmediyseniz) dışındaki tüm parametreler isteğe bağlıdır ve mevcut ortamdan makul değerlere varsayılan olarak ayarlanır.

> `run` çağrısı, kendi başınıza işlemeniz gereken çıkış kodu ile bir 'promise' döndürürken, `runExit` işlem çıkış kodunu kendisi ayarlayacaktır.  
> — Belirli bir kullanım durumu veya tercih durumuna bağlı olarak birini seçmek önemlidir.

--- 

### Kullanım Örnekleri


Örnek Kod

```ts
await run({
  // seçenekler buraya
}, 
[
  // komutlar burada
]);
```


Bununla birlikte, `runExit` kullanırken, çıkış kodunu kendiniz yönetmek zorunda kalmazsınız:

```ts
runExit({
  // seçenekler buraya
}, 
[
  // komutlar burada
]);
```

:::info
Her iki fonksiyon da CLI deneyiminizi geliştirmenize yardımcı olacak şekilde tasarlanmıştır.
::: 

:::warning
Çıkış kodunu doğru yönettiğinizden emin olun; aksi takdirde, CLI'nizin beklenmedik davranışlar sergilemesine neden olabilir.
:::