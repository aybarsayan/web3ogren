---
description: Bu belge, CLI komutlarınız için yeni seçenekler tanımlamanızı sağlayan farklı `Option` özelliklerini açıklar. Her bir özelliğin nasıl kullanılacağını ve anlamı hakkında bilgi verir.
keywords: [CLI, Option, özellikler, komut, yapılandırma]
---

# Seçenekler

Aşağıdaki işlevler, cli komutlarınız için yeni seçenekler tanımlamanıza olanak tanır. Her bir komutun içine düzenli genel sınıf özellikleri (özel sınıf özellikleri desteklenmez) ile kaydedilmelidir:

```ts
class MyCommand extends Command {
    flag = Option.Boolean(`--flag`);
}
```

## `Option.Array`

```ts
Option.Array(optionNames: string, default?: string[], opts?: {...})
```

| Seçenek | tür | Açıklama |
| --- | --- | --- |
| `arity` | `number` | Seçenek için argüman sayısı |
| `description` | `string`| Yardım mesajı için kısa açıklama |
| `hidden` | `boolean` | Seçeneği herhangi bir kullanım listesinden gizle |
| `required` | `boolean` | Seçeneğin en az bir kez bulunup bulunmadığı |

Komutun bir dizi string argüman kabul ettiğini belirtir. `arity` parametresi, her bir öğe için kaç değer kabul edilmesi gerektiğini tanımlar. Varsayılan bir değer sağlanmadığında, seçenek `undefined` olarak başlar.

```ts
class RunCommand extends Command {
    args = Option.Array(`--arg`);
    points = Option.Array(`--point`, {arity: 3});
    // ...
}
```

> **Örnek Çıktı:** Aşağıdaki komutlarda `args` ve `points` değerlerini görebilirsiniz:
>
> ```bash
> run --arg value1 --arg value2
> # => TestCommand {"args": ["value1", "value2"]}
>
> run --point x y z --point a b c
> # => TestCommand {"points": [["x", "y", "z"], ["a", "b", "c"]]}
> ```

---

## `Option.Boolean`

```ts
Option.Boolean(optionNames: string, default?: boolean, opts?: {...})
```

| Seçenek | tür | Açıklama |
| --- | --- | --- |
| `description` | `string`| Yardım mesajı için kısa açıklama |
| `hidden` | `boolean` | Seçeneği herhangi bir kullanım listesinden gizle |
| `required` | `boolean` | Seçeneğin en az bir kez bulunup bulunmadığı |

Komutun bir boolean bayrağı seçenek olarak kabul ettiğini belirtir. Varsayılan bir değer sağlanmadığında, seçenek `undefined` olarak başlar.

```ts
class TestCommand extends Command {
    flag = Option.Boolean(`--flag`);
    // ...
}
```

**Üretim Örneği:**

```bash
run --flag
# => TestCommand {"flag": true}
```

---

## `Option.Counter`

```ts
Option.Counter(optionNames: string, default?: number, opts?: {...})
```

| Seçenek | tür | Açıklama |
| --- | --- | --- |
| `description` | `string`| Yardım mesajı için kısa açıklama |
| `hidden` | `boolean` | Seçeneği herhangi bir kullanım listesinden gizle |
| `required` | `boolean` | Seçeneğin en az bir kez bulunup bulunmadığı |

**Dikkat:** Komutun bir boolean bayrağı seçenek olarak kabul ettiğini belirtir. Klasik boolean seçeneklerin aksine, her algılanan durum sayacı artıracaktır. Argüman reddedildiğinde (`--no-`), sayaç `0`'a sıfırlanacaktır. Varsayılan bir değer sağlanmadığında, seçenek `undefined` olarak başlar.

```ts
class TestCommand extends Command {
    verbose = Option.Counter(`-v,--verbose`);
    // ...
}
```

> **Örnek Çıktı:**
>
> ```bash
> run -v
> # => TestCommand {"verbose": 1}
>
> run -vv
> # => TestCommand {"verbose": 2}
>
> run --verbose -v --verbose -v
> # => TestCommand {"verbose": 4}
>
> run --verbose -v --verbose -v --no-verbose
> # => TestCommand {"verbose": 0}
> ```

---

## `Option.Proxy`

```ts
Option.Proxy(opts?: {...})
```

| Seçenek | tür | Açıklama |
| --- | --- | --- |
| `required` | `number` | Gerekli olan son argümanların sayısı |

> **Not:** Proxying her komut için yalnızca bir kez gerçekleşebilir. Bir kez tetiklendiğinde, bir komut "proxy modu"ndan çıkamaz, tüm kalan argümanlar bir listeye proxy yapılır.

```ts
class RunCommand extends Command {
    args = Option.Proxy();
    // ...
}
```

**Üretim Örneği:**

```bash
run
# => TestCommand {"values": []}

run value1 value2
# => TestCommand {"values": ["value1", "value2"]}
```

---

## `Option.Rest`

```ts
Option.Rest(opts?: {...})
```

| Seçenek | tür | Açıklama |
| --- | --- | --- |
| `required` | `number` | Gerekli olan son argümanların sayısı |

> **Not:** Rest argümanları kesinlikle konumsaldır. Rest argümanları arasında bulunan tüm seçenekler, `Command` örneğinin seçenekleri olarak tüketilecektir.

```ts
class RunCommand extends Command {
    values = Option.Rest();
    // ...
}
```

> **Üretim Örneği:**
>
> ```bash
> run
> # => TestCommand {"values": []}

> run value1 value2
> # => TestCommand {"values": ["value1", "value2"]}
> ```

---

## `Option.String` (seçenek)

```ts
Option.String(optionNames: string, default?: string, opts?: {...})
```

| Seçenek | tür | Açıklama |
| --- | --- | --- |
| `arity` | `number` | Seçenek için argüman sayısı |
| `description` | `string`| Yardım mesajı için kısa açıklama |
| `env` | `string` | Bir ortam değişkeninin adı |
| `hidden` | `boolean` | Seçeneği herhangi bir kullanım listesinden gizle |
| `tolerateBoolean` | `boolean` | Argüman sağlanmasa bile seçeneği kabul et |
| `required` | `boolean` | Seçeneğin en az bir kez bulunup bulunmadığı |

Komutun argüman alan bir seçenek kabul ettiğini belirtir (varsayılan olarak bir tane, ancak `arity` ile değiştirilebilir). Varsayılan bir değer sağlanmadığında, seçenek `undefined` olarak başlar.

```ts
class TestCommand extends Command {
    arg = Option.String(`-a,--arg`);
    // ...
}
```

Dikkat edin, varsayılan olarak, argüman kabul eden seçenekler cli'da bir argüman almak zorundadır.

```bash
run --arg value
run --arg=value
run -a value
run -a=value
# => TestCommand {"arg": "value"}
```