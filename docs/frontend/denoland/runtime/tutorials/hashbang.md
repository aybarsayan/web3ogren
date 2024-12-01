---
title: "Çalıştırılabilir betikler"
description: Deno betiklerini çalıştırılabilir hale getirmek için gerekli adımları öğrenin. Bu kılavuz, betiklerin nasıl oluşturulacağı ve çalıştırılacağı konusunda pratik örnekler sunmaktadır.
keywords: [Deno, betikler, çalıştırılabilir, hashbang, komut satırı]
---

Deno betiklerini çalıştırılabilir hale getirmek, dosya manipülasyonu, veri işleme veya komut satırından çalıştırmak istediğiniz tekrarlayan görevler gibi küçük araçlar veya yardımcı programlar oluştururken işe yarayabilir. Çalıştırılabilir betikler, tüm bir projeyi kurmadan geçici çözümler oluşturmanıza olanak tanır.

## Örnek bir betik oluşturma

Bir betiği çalıştırılabilir hale getirmek için, betiğin başına bir hashbang ile başlayın (bazı durumlarda shebang olarak da adlandırılır). Bu, işletim sisteminize bir betiği nasıl çalıştıracağınızı söyleyen bir karakter dizisidir (#!). Ardından, betiği çalıştırmak için kullanılacak yorumlayıcının yolu gelir.

:::note
Windows’ta hashbang kullanmak için Windows Alt Sistemi'ni (WSL) yüklemeniz veya [Git Bash](https://git-scm.com/downloads) gibi Unix benzeri bir kabuk kullanmanız gerekecektir.
:::

`Deno.env` API'sini kullanarak Deno kurulum yolunu yazdıran basit bir betik oluşturacağız.

Aşağıdaki içeriğe sahip `hashbang.ts` adında bir dosya oluşturun:

```ts title="hashbang.ts"
#!/usr/bin/env -S deno run --allow-env
const path = Deno.env.get("DENO_INSTALL");

console.log("Deno Kurulum Yolu:", path);
```

Bu betik, sistemin deno çalışma zamanını kullanarak betiği çalıştırmasını söyler. -S bayrağı, komutu argümanlara böler ve izleyen argümanın (`deno run --allow-env`) env komutuna geçirilmesi gerektiğini belirtir.

Betiği, `Deno.env.get()` ile `DENO_INSTALL` adındaki ortam değişkenine karşılık gelen değeri alır ve bunu `path` adında bir değişkene atar. 

> "Son olarak, bu yolu `console.log()` kullanarak konsola yazdırır." — 

### Betiği çalıştırma

Betiği çalıştırmak için, betiğe yürütme izinleri vermeniz gerekebilir, bunu `chmod` komutu ile `+x` bayrağını (çalıştırma için) kullanarak yapabilirsiniz:

```sh
chmod +x hashbang.ts
```

Betiği komut satırında doğrudan aşağıdaki şekilde çalıştırabilirsiniz:

```sh
./hashbang.ts
```

## Uzantısız dosyalarda hashbang kullanma

Kısalık açısından, betiğinizin dosya adındaki uzantıyı atlamak isteyebilirsiniz. Bu durumda, betik içinde `--ext` bayrağını kullanarak bir tanımlamalısınız, ardından betiği sadece dosya adıyla çalıştırabilirsiniz:

```shell title="my_script"
$ cat my_script
#!/usr/bin/env -S deno run --allow-env --ext=js
console.log("Merhaba!");
$ ./my_script
Merhaba!
```

🦕 Artık Deno betiklerini doğrudan komut satırından çalıştırabilirsiniz! Betik dosyanız için yürütme iznini (`chmod +x`) ayarlamayı unutmayın ve basit yardımcı programlardan karmaşık araçlara kadar her şeyi inşa etmek için hazırsınız. 

:::tip
`Deno örneklerine` göz atarak neler betikleyebileceğiniz hakkında ilham alın.
:::