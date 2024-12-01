---
description: tinyhttp ile uygulama geliştirmeye hızlı bir başlangıç yapın. Bu rehber, temel bilgileri ve kurulum adımlarını içerir.
keywords: [tinyhttp, web framework, TypeScript, Express benzeri, middleware, kurulumsüreci, örnekler]
---

# Başlarken

## Giriş

_**tinyhttp**_, TypeScript ile yazılmış modern bir Express benzeri web framework'üdür. Minimal ve tedarik zincirini azaltmak için minimum bağımlılık kullanır. Ayrıca, tinyhttp yerel ESM (`import` / `export`) desteği, asenkron middleware işleyici desteği ve kutudan çıkar çıkmaz doğru türleri sunar.

## Express ile Farklar

tinyhttp, mümkün olduğunca Express'e yakın olmaya çalışsa da, bu iki framework arasında bazı önemli farklılıklar bulunmaktadır:

- **tinyhttp, aynı ayarları içermez**. Tüm `App` ayarları yapıcıda başlatılır. Bunların bir listesini `burada` görebilirsiniz.
- **tinyhttp, önceki bir middleware hata geçirdiğinde `err` nesnesini middleware'e koymaz**. Bunun yerine, bir `genel hata işleyici` kullanır.
- **tinyhttp, bir statik sunucu ve bir body parser içermez**. Framework'ü küçük tutmak için, [`milliparsec`](https://github.com/tinyhttp/milliparsec) ve [`sirv`](https://github.com/lukeed/sirv) gibi harici middleware'ler kullanmalısınız.

:::info
Maksimum uyumluluğun devam ettiğini unutmayın, bu nedenle bazı noktalar değişebilir.
:::

## Kurulum

tinyhttp, Node.js 14.21.3 veya daha yenisini veya [Bun](https://bun.sh) destekler.

:::tip
Çalışan bir uygulamayı hızlıca [tinyhttp CLI](https://github.com/tinyhttp/cli) ile ayarlayabilirsiniz:
:::

::: code-group

```bash [node]
# tinyhttp CLI'yi yükleyin
pnpm i -g @tinyhttp/cli

# Yeni bir proje oluşturun
tinyhttp new basic my-app

# Proje dizinine gidin
cd my-app

# Uygulamanızı çalıştırın
node index.js
```

```bash [bun]
# tinyhttp CLI'yi yükleyin
bun i -g @tinyhttp/cli

# Yeni bir proje oluşturun
tinyhttp new basic my-app

# Proje dizinine gidin
cd my-app

# Uygulamanızı çalıştırın
bun app.js
```

:::

## Merhaba Dünya

İşte tinyhttp uygulamasına dair çok temel bir örnek:

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.use((req, res) => void res.send('Merhaba dünya!'))

app.listen(3000, () => console.log('http://localhost:3000 adresinde başlatıldı'))
```

:::note
Daha fazla örnek için tinyhttp reposundaki [örnekler klasörüne](https://github.com/tinyhttp/tinyhttp/blob/master/examples) göz atabilirsiniz.
:::