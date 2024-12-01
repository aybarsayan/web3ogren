---
title: Shell betikleri
description: Bu içerikte TypeScript ile shell betiği yazmanın yolları, projet ve global betikler üzerine bilgiler yer almaktadır. Kullanım örnekleri ve dikkat edilmesi gereken noktalar bulunmaktadır.
keywords: [TypeScript, shell betiği, tsx, paket yöneticisi, yürütülebilir dosya]
---

# Shell betikleri

TypeScript ile bir shell betiği yazarken _tsx_ öğesini [hashbang](https://bash.cyberciti.biz/guide/Shebang) olarak belirtebilirsiniz. Hashbang, kabuğa betiği nasıl çalıştıracağını bildirir ve onu yürütülebilir hale getirir.

### Proje betikleri

Eğer proje içinde `tsx` yüklüyse, paket yöneticinizi kullanarak _tsx_ öğesini referans alın:

::: code-group
```ts [npm]
#!/usr/bin/env -S npx tsx

console.log('argv:', process.argv.slice(2))
```

```ts [pnpm]
#!/usr/bin/env -S pnpm tsx

console.log('argv:', process.argv.slice(2))
```

```ts [yarn]
#!/usr/bin/env -S yarn tsx

console.log('argv:', process.argv.slice(2))
```
:::

Dosyayı yürütülebilir hale getirin:

```sh
chmod +x ./file.ts
```

Artık `./file.ts` dosyasını doğrudan çalıştırabilirsiniz:

```sh
./file.ts hello world
# Çıktı: argv: [ 'hello', 'world' ]
```

### Global betikler

Eğer `tsx` global olarak yüklüyse, hashbang'te `tsx` öğesini doğrudan referans alabilirsiniz:

_file.ts_:

```ts
#!/usr/bin/env tsx

console.log('argv:', process.argv.slice(2))
```

Dosyayı yürütülebilir hale getirmek için `chmod` yapmayı unutmayın!

:::tip
Doğru bir şekilde komut dosyası yazmak, proje geliştirme sürecini oldukça önemli hale getirir.
:::

:::warning
Global olarak yüklü `tsx` kullanıyorsanız, yol ayarlarınızı kontrol etmeyi unutmayın!
:::