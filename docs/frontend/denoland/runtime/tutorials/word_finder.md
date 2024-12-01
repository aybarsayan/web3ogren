---
title: "Deno ile Bir Kelime Bulucu Uygulaması Geliştirme"
description: "Bu eğitim, Deno kullanarak basit bir Kelime Bulucu web uygulaması oluşturmayı adım adım anlatmaktadır. Desen girerek eşleşen kelimeleri bulmanıza yardımcı olacak bir arayüz geliştireceğiz."
keywords: [Deno, Kelime Bulucu, web uygulaması, JavaScript, arama fonksiyonu]
---

## Başlarken

Bu eğitimde, Deno kullanarak basit bir Kelime Bulucu web uygulaması oluşturacağız. Deno hakkında önceden bilgi sahibi olmanız gerekmiyor.

## Giriş

Kelime Bulucu uygulamamız, **kullanıcı tarafından sağlanan** bir desen dizesini alacak ve bu desene uyan tüm İngilizce kelimeleri döndürecektir. Desen, alfabetik karakterler ile birlikte `_` ve `?` içerebilir. `?`, desende mevcut olmayan herhangi bir harfi temsil edebilir. `_`, herhangi bir harfi temsil edebilir.

> Örneğin, `c?t` deseni "cat" ve "cut" ile eşleşir. `go?d` deseni ise "goad" ve "gold" (ama "good" ile değil) kelimeleri ile eşleşir.  
> — Kelime Bulucu Uygulaması Açıklaması

![Kelime bulucu arayüzü](../../../images/cikti/denoland/runtime/tutorials/images/word_finder.png)

---

## Görünümü Oluşturma

Aşağıdaki fonksiyon, yukarıda gösterilen basit UI'yi oluşturan HTML’yi render eder. HTML içeriğini özelleştirmek için bir desen ve kelime listesi belirtebilirsiniz. 

:::tip
Bir desen belirtilirse, bu arama metni kutusunda görünecektir. Kelime listesi belirtilirse, bir madde işaretli kelime listesi oluşturulacaktır.
:::

```jsx title="render.js"
export function renderHtml(pattern, words) {
  let searchResultsContent = "";
  if (words.length > 0) {
    let wordList = "";
    for (const word of words) {
      wordList += `<li>${word}</li>`;
    }
    searchResultsContent = `
        <p id="search-result-count" data-count="${words.length}">Bulunan kelimeler: ${words.length}</p>
        <ul id="search-result" name="search-results"> 
          ${wordList}
        </ul>
      `;
  }

  return `<html>
    <head>
        <title>Deno Kelime Bulucu</title>
        <meta name="version" content="1.0" />
    </head>
    <body>
        <h1>Deno Kelime Bulucu</h1>
  
        <form id="perform-search" name="perform-search" method="get" action="/api/search">
            <label for="search-text">Arama metni:</label>
            <input id="search-text" name="search-text" type="text" value="${pattern}" />
            <input type="submit" />
        </form>
  
        ${searchResultsContent}
  
        <h2>Talimatlar</h2>
  
        <p>
            Bilinmeyen karakterler için gerektiğinde _ ve ? kullanarak bir kelime girin. ? kullanmak, zaten kullanılan harflerin dışında harfleri dahil etmek anlamına gelir (bunu "Şanslı Çark" yer tutucusu olarak düşünebilirsiniz). _ kullanmak, mevcut olsun ya da olmasın herhangi bir karakteri içeren kelimeleri bulacaktır.
            <br />
            <br />
            Örneğin, d__d şunları döndürür:
            <ul>
                <li>dand</li>
                <li>daud</li>
                <li>dead</li>
                <li>deed</li>
                <li>dird</li>
                <li>dodd</li>
                <li>dowd</li>
                <li>duad</li>
                <li>dyad</li>
            </ul>
            <br />
            Ve go?d şunları döndürür:
            <ul>
                <li>goad</li>
                <li>gold</li>
            </ul>
        </p>
    </body>
  </html>
  `;
}
```

---

## Sözlüğü Arama

Ayrıca, sözlüğü tarayan ve belirtilen desene uyan tüm kelimeleri döndüren basit bir arama fonksiyonuna ihtiyacımız var. Aşağıdaki fonksiyon bir desen ile sözlük alır ve ardından eşleşen tüm kelimeleri döndürür.

```jsx title="search.js"
export function search(pattern, dictionary) {
  // Kelimede zaten mevcut olan karakterleri hariç tutan regex deseni oluştur
  let excludeRegex = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c != "?" && c != "_") {
      excludeRegex += "^" + c;
    }
  }
  excludeRegex = "[" + excludeRegex + "]";

  // Sadece soru işaretleri, kelimde zaten mevcut olmayan karakterlerle eşleşsin
  let searchPattern = pattern.replace(/\?/g, excludeRegex);

  // Alt çizgiler her şeyle eşleşsin
  searchPattern = "^" + searchPattern.replace(/\_/g, "[a-z]") + "$";

  // Desene uyan sözlükteki tüm kelimeleri bul
  let matches = [];
  for (let i = 0; i < dictionary.length; i++) {
    const word = dictionary[i];
    if (word.match(new RegExp(searchPattern))) {
      matches.push(word);
    }
  }

  return matches;
}
```

---

## Deno Sunucusu Çalıştırma

[Oak](https://deno.land/x/oak@v11.1.0), Deno'da kolayca bir sunucu kurmanızı sağlayan bir çerçevedir (JavaScript'in Express'ine benzer) ve uygulamamızı barındırmak için bunu kullanacağız. Sunucumuz, HTML şablonumuzu verilerle doldurmak için arama fonksiyonumuzu kullanacak ve ardından özelleştirilmiş HTML'yi izleyiciye geri döndürecektir.

:::info
Sözlük olarak `/usr/share/dict/words` dosyasını kullanabiliriz; bu dosya, çoğu Unix benzeri işletim sisteminde standart olarak bulunan bir dosyadır.
:::

```jsx title="server.js"
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { search } from "./search.js";
import { renderHtml } from "./render.js";

const dictionary = (await Deno.readTextFile("/usr/share/dict/words")).split(
  "\n",
);

const app = new Application();
const port = 8080;

const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.body = renderHtml("", []);
});

router.get("/api/search", async (ctx) => {
  const pattern = ctx.request.url.searchParams.get("search-text");
  ctx.response.body = renderHtml(pattern, search(pattern, dictionary));
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("http://localhost:" + port 'ta dinleniyor');
await app.listen({ port });
```

Sunucumuzu aşağıdaki komut ile başlatabiliriz. Deno varsayılan olarak güvenli olduğundan, dosya sistemine ve ağa erişim izni vermemiz gerektiğini unutmayın.

```bash
deno run --allow-read --allow-net server.js
```

Artık [http://localhost:8080](http://localhost:8080/) adresini ziyaret ederseniz, Kelime Bulucu uygulamasını görüntüleyebilmelisiniz.

---

## Örnek Kod

Tüm örnek kodu [burada](https://github.com/awelm/deno-word-finder) bulabilirsiniz.