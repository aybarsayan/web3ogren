---
description: This documentation provides an overview of the `Cli` class, detailing its methods and options for command line interface creation.
keywords: [Cli, command line, options, methods, Typescript]
---

# CLI

## `new Cli`

```ts
new Cli(opts: {...})
```

| Seçenek | tür | Açıklama |
| --- | --- | --- |
| `binaryLabel` | `string` | Yardım mesajında gösterilen araç adı |
| `binaryName` | `string` | Kullanım satırında gösterilen ikili ad |
| `binaryVersion` | `string` | `--version` parametresinde gösterilen araç sürümü |
| `enableCapture` | `boolean` | Ayarlandığında, stdout/stderr'yi komut akışlarına yönlendirir |
| `enableColors` | `boolean` | Hata mesajları için otomatik renk algılamasını göz ardı eder |

---

## `Cli#process`

```ts
cli.process(input: string[])
```

Verilen argümanları kısmen doldurulmuş bir komut örneğine dönüştürür. 

:::warning
`execute` metodunu çağırmayın, çünkü bazı alanların komut gerçekten çalıştırılmadan önce ayarlanması gerekir. 
:::

Bunun yerine, gerçekten çalıştırmak istiyorsanız, bunu `Cli#run` metoduna iletin.

---

## `Cli#run`

```ts
cli.run(input: Command, context: Context)
cli.run(input: string[], context: Context)
```

Verilen argümanı hemen çalıştırılacak ve döndürülecek bir komuta dönüştürür. 

:::tip
Çalıştırma sırasında bir hata olursa, `Cli#run` bunu yakalayacak ve çıkış kodunu 1 olarak döndürecektir.
:::

---

## `Cli#runExit`

```ts
cli.runExit(input: string[], context?: Context)
```

`Cli#run` metoduyla aynı şeydir, ancak komutun sonucunu yakalar ve `process.exitCode` değerini uygun şekilde ayarlar. 

:::note
`process.exit` doğrudan çağrılmayacağından, olay döngüsü boş değilse süreç hayatta kalabilir.
:::