---
description: Deno için Jupyter Kernel, JavaScript ve TypeScript geliştirme ortamında etkileşimli defterler oluşturmanıza olanak tanır. Deno'nun Jupyter'deki entegrasyonu, zengin içerik çıktıları ve kullanıcı etkileşimi için çeşitli API'lerle donatılmıştır.
keywords: [Deno, Jupyter, JavaScript, TypeScript, kernel, etkileşimli defterler, zengin içerik]
---

Deno, JavaScript ve TypeScript yazmanıza olanak sağlayan yerleşik bir Jupyter kernel ile birlikte gelir; Web ve Deno API'lerini kullanın ve etkileşimli defterlerinizde doğrudan `npm` paketlerini içe aktarın.

:::warning 
`deno jupyter` her zaman `--allow-all` ile çalışır.  
Şu anda Jupyter kernelinde yürütülen tüm kod `--allow-all` bayrağı ile çalışmaktadır. Bu geçici bir sınırlamadır ve gelecekte ele alınacaktır.
:::

## Hızlı Başlangıç

`deno jupyter --unstable` komutunu çalıştırın ve talimatları izleyin.

Kernelin zorla yüklenmesi için `deno jupyter --unstable --install` komutunu çalıştırabilirsiniz. Deno, `jupyter` komutunun `PATH`'inizde mevcut olduğunu varsayar.

Yükleme işlemini tamamladıktan sonra, Deno kernel JupyterLab ve klasik defterde defter oluşturma diyalog kutusunda mevcut olacaktır:

![](../../../../images/cikti/denoland/runtime/reference/images/jupyter_notebook.png)

Deno Jupyter kernelini, Jupyter defterlerini destekleyen herhangi bir editörde kullanabilirsiniz.

### VS Code

- [VSCode Jupyter uzantısını](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) yükleyin.
- Komut Paletini (Ctrl+Shift+P) açarak bir defter dosyası açın veya oluşturun ve "Oluştur: Yeni Jupyter Defteri"ni seçin. Bu, ".ipynb" dosya uzantısına sahip bir dosya oluşturarak manüel olarak yapılabilir.
- Yeni veya mevcut bir defter üzerinde çalışırken, yeni bir Jupyter defteri oluşturun, "Jupyter kernel'leri"ni seçin ve ardından Deno'yu seçin.

![VS Code'da Deno'yu seçme](https://github.com/denoland/deno-docs/assets/836375/32f0ccc3-35f7-47e5-84f4-17c20a5b5732)

### JetBrains IDE'leri

Jupyter Defterleri kutudan çıkar çıkmaz mevcuttur.

## Zengin içerik çıktısı

`Deno.jupyter` ad alanları, defterlerinizde zengin içeriği görüntülemek için yardımcı fonksiyonlar sağlar [Jupyter'in desteklediği MIME türlerini](https://docs.jupyter.org/en/latest/reference/mimetype.html) kullanarak.

---

Zengin bir çıktı sağlamanın en kolay yolu, bir `[Symbol.for("Jupyter.display")]` yöntemi olan bir nesne döndürmektir.

Bu yöntem, bir MIME türünü görüntülenmesi gereken bir değere eşleyen bir sözlük döndürmelidir.

```ts
{
  [Symbol.for("Jupyter.display")]() {
    return {
      // Düz metin içeriği
      "text/plain": "Merhaba dünya!",
      // HTML çıktısı
      "text/html": "<h1>Merhaba dünya!</h1>",
    }
  }
}
```

> _Düz metin ve HTML çıktısı döndüren bir nesne örneği._  
> — Deno Jupyter Documentation

:::info
`Symbol.for("Jupyter.display")` yazmak yerine `Deno.jupyter.$display` kullanabilirsiniz.
:::

Bu, düzenli bir fonksiyondur, bu yüzden çıktıyı biçimlendirmek için istediğiniz herhangi bir kütüphaneyi kullanabilirsiniz - örneğin, renkli bir çıktı sağlamak için `@std/fmt/colors` kullanabilirsiniz:

```ts
import * as colors from "jsr:@std/fmt/colors";

{
  [Deno.jupyter.$display]() {
    return {
      "text/plain": colors.green("Merhaba dünya"),
    }
  }
}
```

MIME paketini doğrudan görüntülemek için de `Deno.jupyter.display` fonksiyonunu kullanabilirsiniz:

```js
await Deno.jupyter.display({
  "text/plain": "Merhaba, dünya!",
  "text/html": "<h1>Merhaba, dünya!</h1>",
  "text/markdown": "# Merhaba, dünya!",
}, { raw: true });
```

![](../../../../images/cikti/denoland/runtime/reference/images/jupyter-display.png)

Defter arayüzünüz, yeteneklerine dayanarak "en zengin" MIME türünü otomatik olarak seçecektir.

---

`Deno.jupyter`, yaygın medya türlerinin zengin çıktısı için birkaç yardımcı yöntem sunar.

`Deno.jupyter.html`, sağlanan dizeyi defterde HTML olarak render edecek bir etiketli şablondur.

```js
Deno.jupyter.html`<h1>Merhaba, dünya!</h1>
<h2>Deno kernelinden</h2>
<p>Lorem ipsum <i>dolor</i> <b>sit</b> <u>amet</u></p>`;
```

![](../../../../images/cikti/denoland/runtime/reference/images/jupyter-html.png)

`Deno.jupyter.md`, sağlanan dizeyi defterde bir Markdown belgesi olarak render edecek bir etiketli şablondur.

```js
Deno.jupyter
  .md`# Deno ile TypeScript'deki Defterler ![Deno logosu](https://github.com/denoland.png?size=32)

**Jupyter ile etkileşimli hesaplama _Deno'ya entegre edilmiştir_!**`;
```

![](../../../../images/cikti/denoland/runtime/reference/images/jupyter-md.png)

`Deno.jupyter.svg`, sağlanan dizeyi defterde bir SVG figürü olarak render edecek bir etiketli şablondur.

```js
Deno.jupyter.svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>`;
```

![](../../../../images/cikti/denoland/runtime/reference/images/jupyter-svg.png)

`Deno.jupyter.image`, bir JPG veya PNG resmi render edecek bir fonksiyondur. Bir dosya yolu veya zaten okunmuş baytları geçebilirsiniz:

```js
Deno.jupyter.image("./cat.jpg");

const data = Deno.readFileSync("./dog.png");
Deno.jupyter.image(data);
```

## prompt ve confirm API'leri

Defterinizde kullanıcı girişi beklemek için `prompt` ve `confirm` Web API'lerini kullanabilirsiniz.





confirm ve prompt API'leri örneği



## IO yayını yayınlama kanalı

`Deno.jupyter.broadcast`, hücre değerlendirildiğinde anlık güncellemeler sağlamak için IO yayınına mesajlar yayınlamanıza olanak tanır.

Hesaplamaya başlamadan önce bir mesaj yazdıran ve hesaplama tamamlandığında başka bir mesaj yazdıran bu örneği dikkate alın:

```js
await Deno.jupyter.broadcast("display_data", {
  data: { "text/html": "<b>İşleniyor...</b>" },
  metadata: {},
  transient: { display_id: "progress" },
});

// Pahalı bir hesaplama yaptığımızı varsayalım
await new Promise((resolve) => setTimeout(resolve, 1500));

await Deno.jupyter.broadcast("update_display_data", {
  data: { "text/html": "<b>Tamamlandı</b>" },
  metadata: {},
  transient: { display_id: "progress" },
});
```





Deno.jupyter.broadcast API örneği



## Örnekler

`@observablehq/plot` kullanarak bir grafik oluşturma örneği:

```ts
import { document, penguins } from "jsr:@ry/jupyter-helper";
import * as Plot from "npm:@observablehq/plot";

let p = await penguins();

Plot.plot({
  marks: [
    Plot.dot(p.toRecords(), {
      x: "culmen_depth_mm",
      y: "culmen_length_mm",
      fill: "species",
    }),
  ],
  document,
});
```

![](../../../../images/cikti/denoland/runtime/reference/images/jupyter-plot.png)

Daha gelişmiş veri analizi ve görselleştirme kütüphanelerini (Polars, Observable ve d3 gibi) kullanan örnekler için [https://github.com/rgbkrk/denotebooks](https://github.com/rgbkrk/denotebooks) adresine bakın.

## `jupyter console` entegrasyonu

`jupyter console` REPL'inde Deno Jupyter kernelini de kullanabilirsiniz. Bunu yapmak için, konsolunuzu `jupyter console --kernel deno` ile başlatmalısınız.

![](../../../../images/cikti/denoland/runtime/reference/images/jupyter-cli.gif)