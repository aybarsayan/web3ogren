---
title: Kullanımdan Kaldırıldı
description: Bu içerik, kullanımdan kaldırılan özellikleri ve alternatif yaklaşımları açıklamaktadır. İçinde, bu özelliklerin neden kaldırıldığına dair bilgilerle birlikte, yeni yöntemler hakkında öneriler yer almaktadır.
keywords: [kullanımdan kaldırıldı, komut, seçenek, commander, program]
---

# Kullanımdan Kaldırıldı

Bu özellikler, kullanım dışı bırakıldı; bu, gelecekteki ana sürümlerde ortadan kaybolabilecekleri anlamına gelir. Şu anda geri uyumluluk için hala mevcuttur, ancak yeni kodda kullanılmamalıdır.

- `Kullanımdan Kaldırıldı`
    - `RegExp .option() parametresi`
    - `noHelp`
    - `.help() ve .outputHelp() için geri çağırma`
    - `.on('--help')`
    - `.on('command:*')`
    - `.command('*')`
    - `cmd.description(cmdDescription, argDescriptions)`
    - `InvalidOptionArgumentError`
    - `Tek karakterden uzun kısa seçenek bayrağı`
    - `'commander/esm.mjs' dosyasından içe aktarma`
    - `cmd._args`
    - `.addHelpCommand(string|boolean|undefined)`
  - `Kaldırıldı`
    - `Global Command nesnesinin varsayılan içe aktarımı`

---

### RegExp .option() parametresi

```js
program.option('-c,--coffee <type>', 'coffee', /short-white|long-black/);
```

**Commander v3'te README'den kaldırıldı.** 

Daha yeni işlevsellik, Option `.choices()` yöntemi veya özel bir seçenek işleme işlevi kullanmaktır.

:::tip
**Öneri:** Yeni projelerinizde bu özellikleri kullanmamak için yeni yöntemleri tercih edin.
:::

---

### noHelp

Bu, komutu yerleşik yardım listesinden gizlemek için `.command()`'a geçirilen bir seçenekte vardı:

```js
program.command('example', 'example command', { noHelp: true });
```

Seçenek, Commander v5.1'de `hidden` olarak yeniden adlandırıldı. **Commander v7'den itibaren kullanım dışı bırakıldı.**

---

### .help() ve .outputHelp() için geri çağırma

Bu rutinler, yerleşik yardım görüntülenmeden önce bir geri çağırma parametresi kullanarak işlenmesine izin veriyordu.

```js
program.outputHelp((text) => {
  return colors.red(text);
});
```

Yeni yaklaşım, yerleşik yardım metnine doğrudan erişmektir ve bunu `.helpInformation()` ile yapabilirsiniz.

:::info
**Not:** Bu yeni yöntem, daha iyi bir esneklik sağlar.
:::

```js
console.error(colors.red(program.helpInformation()));
```

Commander v7'den itibaren kullanım dışı bırakıldı.

---

### .on('--help')

Bu, yerleşik yardımdan sonra özel yardım eklemenin yoluydu. 

```js
program.on('--help', function() {
  console.log('')
  console.log('Örnekler:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
});
```

Yerine geçecek olan yöntem `.addHelpText()`'dir:

```js
program.addHelpText('after', `
Örnekler:
  $ custom-help --help
  $ custom-help -h`
);
```

Commander v7'den itibaren kullanım dışı bırakıldı.

---

### .on('command:*')

Bilinmeyen bir alt komut için bir hata eklemek gibi bir kullanım vardı. Artık hata, varsayılan yerleşik davranıştır.

:::warning
Bu durumda, bilinmeyen bir alt komut için verilen komut dizisini doğru girmeyi unutmayın.
:::

---

### .command('*')

Bu, programa bir varsayılan komut eklemek için kullanıldı.

```js
program
  .command('*')
  .action(() => console.log('Varsayılan olarak dosyaları listeleyin...'));
```

**Commander v5'te README'den kaldırıldı.**

---

### cmd.description(cmdDescription, argDescriptions)

Bu, yardım için komut argümanı açıklamaları eklemek için kullanıldı.

```js
program
  .command('price <book>')
  .description('kitabın fiyatını göster', {
    book: 'kitap için ISBN numarası'
  });
```

**Yeni yaklaşım,** `.argument()` yöntemini kullanmaktır:

```js
program
  .command('price')
  .description('kitabın fiyatını göster')
  .argument('<book>', 'kitap için ISBN numarası');
```

Commander v8'den itibaren kullanım dışı bırakıldı.

---

### InvalidOptionArgumentError

Bu, özel seçenek işlemesinden bir hata fırlatmak için kullanıldı.

```js
function myParseInt(value, dummyPrevious) {
  // parseInt bir dize ve bir radix alır
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidOptionArgumentError('Bir sayı değil.');
  }
  return parsedValue;
}
```

Yerine geçecek olan `InvalidArgumentError`'dır.

:::note
`InvalidArgumentError`, artık özel komut-argüman işlemesi için de kullanılabilir.
:::

---

### Tek karakterden uzun kısa seçenek bayrağı

Kısa seçenek bayrakları, `-ws` gibi, hiçbir zaman desteklenmedi, ancak eski README bunu açıkça belirtmedi. 

README, Commander v3'te güncellendi. Commander v9'dan itibaren kullanım dışı bırakıldı.

---

### 'commander/esm.mjs' dosyasından içe aktarma

Adlandırılmış içe aktarma desteği için ilk olarak açık bir giriş dosyası gerektiriyordu.

```js
import { Command } from 'commander/esm.mjs';
```

Artık bu gerekmez, doğrudan modülden içe aktarabilirsiniz.

```js
import { Command } from 'commander';
```

README, Commander v9'da güncellendi.

---

### cmd._args

Bu her zaman özeldi, ancak daha önce komut `Argument` dizisine erişmenin tek yolu buydu.

```js
const registeredArguments = program._args;
```

Kayıtlı komut argümanları şimdi `.registeredArguments` aracılığıyla erişilebilir.

```js
const registeredArguments = program.registeredArguments;
```

Commander v11'den itibaren kullanım dışı bırakıldı.

---

### .addHelpCommand(string|boolean|undefined)

Başlangıçta çeşitli parametrelerle kullanılıyordu; ancak "ekle" adını taşımasına rağmen bir Command nesnesi geçirerek kullanılmıyordu.

```js
program.addHelpCommand('assist  [command]');
program.addHelpCommand('assist', 'yardım göster');
program.addHelpCommand(false);
```

Yeni kodda yardım komutunu `.helpCommand()` ile yapılandırabilirsiniz.

---

## Kaldırıldı

### Global Command nesnesinin varsayılan içe aktarımı

Varsayılan içe aktarma, global Command nesnesiydi.

```js
const program = require('commander');
```

Global Command nesnesi, Commander v5'te `program` olarak aktarılmaktadır veya Command nesnesini içe aktarabilirsiniz.

```js
const { program } = require('commander');
// veya
const { Command } = require('commander');
const program = new Command();
```

- Commander v5'te README'den kaldırıldı.
- Commander v7'den itibaren kullanım dışı bırakıldı.
- Commander v8'de TypeScript bildirimlerinden kaldırıldı.
- Commander v12'de CommonJS'den kaldırıldı. **Kullanımdan kaldırıldı ve gitti!**