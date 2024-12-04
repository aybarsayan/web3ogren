---
title: React Sunucu Bileşenleri
seoTitle: React Server Components
sidebar_position: 1
description: Sunucu Bileşenleri, istemci uygulamanızdan veya SSR sunucusundan ayrı bir ortamda önceden render edilen yeni bir bileşen türüdür. Bu belge, Sunucu Bileşenleri hakkında önemli bilgileri sunmaktadır.
tags: 
  - Sunucu Bileşenleri
  - React
  - Frontend Development
  - Server-side Rendering
keywords: 
  - Sunucu Bileşenleri
  - React
  - Frontend Development
  - Server-side Rendering
---
Sunucu Bileşenleri, zamanında, paketlenmeden önce, istemci uygulamanızdan veya SSR sunucusundan ayrı bir ortamda önceden render edilen yeni bir Bileşen türüdür.



Bu ayrı ortam, React Sunucu Bileşenleri'ndeki "sunucu"dur. Sunucu Bileşenleri, CI sunucunuzda derleme zamanında bir kez çalıştırılabilir veya her istek için bir web sunucusu kullanılarak çalıştırılabilir.





#### Sunucu Bileşenleri için destek nasıl inşa edebilirim? {/*how-do-i-build-support-for-server-components*/}

React 19'daki React Sunucu Bileşenleri kararlı durumdadır ve büyük sürümler arasında kırılmayacaktır, ancak bir React Sunucu Bileşeni paketleyicisi veya framework'ü uygulamak için kullanılan alt API'ler, semver'ı takip etmez ve React 19.x içinde küçük sürümler arasında kırılabilir.

Sunucu Bileşenlerini bir paketleyici veya framework olarak desteklemek için, belirli bir React sürümüne sabitlemenizi veya Canary sürümünü kullanmanızı öneririz. Gelecekte React Sunucu Bileşenlerini uygulamak için kullanılan API'leri stabilize etmek üzere paketleyiciler ve framework'lerle çalışmaya devam edeceğiz.



### Sunucu Olmadan Sunucu Bileşenleri {/*server-components-without-a-server*/}
Sunucu bileşenleri, dosya sisteminden okumak veya statik içerik almak için derleme zamanında çalışabilir, bu nedenle bir web sunucusu gerekli değildir. Örneğin, bir içerik yönetim sisteminden statik verileri okumak isteyebilirsiniz.

Sunucu Bileşenleri olmadan, istemcide statik verileri bir Etki ile almak yaygındır:

```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOT: ilk sayfa render'ından *sonra* yükler.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Bu desen, kullanıcıların ek bir 75K (gzipped) kütüphaneleri indirmesi ve sayfa yüklendikten sonra verileri almak için ikinci bir isteği beklemesi gerektiği anlamına gelir, sadece sayfanın ömrü boyunca değişmeyecek statik içeriği render etmek için.

Sunucu Bileşenleri ile, bu bileşenleri derleme zamanında bir kez render edebilirsiniz:

```js
import marked from 'marked'; // Paketleyiciye dahil edilmemiş
import sanitizeHtml from 'sanitize-html'; // Paketleyiciye dahil edilmemiş

async function Page({page}) {
  // NOT: yüklenir *render* sırasında, uygulama inşa edilirken.
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Render edilen çıktı, ardından sunucu tarafı render edilerek (SSR) HTML'ye dönüştürülebilir ve bir CDN'ye yüklenebilir. Uygulama yüklendiğinde, istemci orijinal `Page` bileşenini veya markdown render etmek için gereken maliyetli kütüphaneleri görmeyecek. İstemci yalnızca render edilen çıktıyı görecektir:

```js
<div><!-- markdown için html --></div>
```

Bu, içeriğin ilk sayfa yüklemesi sırasında görünür olduğu ve paketlemenin statik içeriği render etmek için gerekli maliyetli kütüphaneleri içermediği anlamına gelir.



Yukarıdaki Sunucu Bileşeninin bir asenkron fonksiyon olduğunu fark edebilirsiniz:

```js
async function Page({page}) {
  //...
}
```

Asenkron Bileşenler, render sırasında `await` yapmanıza olanak tanıyan Sunucu Bileşenlerinin yeni bir özelliğidir.

Aşağıda `Asenkron bileşenler Sunucu Bileşenleri ile` konusuna göz atın.



### Bir Sunucu ile Sunucu Bileşenleri {/*server-components-with-a-server*/}
Sunucu Bileşenleri, bir sayfa isteği sırasında bir web sunucusunda da çalışabilir ve veri katmanınıza erişmenizi sağlar; bir API inşa etmek zorunda kalmadan. Paketlenmeden önce render edilirler ve Client Bileşenlerine veri ve JSX geçirebilirler.

Sunucu Bileşenleri olmadan, istemcide dinamik verileri bir Etki ile almak yaygındır:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOT: ilk render'dan *sonra* yükler.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);
  
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOT: Note render'larından *sonra* yüklenir.
  // Maliyetli bir istemci-sunucu su akışı oluşturur.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>Yazan: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Sunucu Bileşenleri ile, veriyi okuyabilir ve bileşende render edebilirsiniz:

```js
import db from './database';

async function Note({id}) {
  // NOT: render sırasında yüklenir.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOT: Note'dan *sonra* yüklenir,
  // ancak veri aynı yerdeyse hızlıdır.
  const author = await db.authors.get(id);
  return <span>Yazan: {author.name}</span>;
}
```

Paketleyici, veriyi, render edilen Sunucu Bileşenlerini ve dinamik Client Bileşenlerini bir pakette birleştirir. İsteğe bağlı olarak, bu paket daha sonra sunucu tarafı render edilerek (SSR) sayfanın başlangıç HTML'sini yaratabilir. Sayfa yüklendiğinde, tarayıcı orijinal `Note` ve `Author` bileşenlerini görmez; yalnızca render edilen çıktı istemciye gönderilir:

```js
<div>
  <span>Yazan: React Ekibi</span>
  <p>React 19...</p>
</div>
```

Sunucu Bileşenleri, bir sunucudan yeniden alınarak dinamik hale getirilebilir; burada veriye erişebilir ve yeniden render edebilirler. Bu yeni uygulama mimarisi, sunucu merkezli Çok Sayfalı Uygulamaların basit “istek/cevap” zihinsel modeli ile istemci merkezli Tek Sayfa Uygulamaları arasındaki kesintisiz etkileşimi birleştirerek, her iki dünyanın en iyisini sunar.

### Sunucu Bileşenlerine etkileşim ekleme {/*adding-interactivity-to-server-components*/}

Sunucu Bileşenleri, tarayıcıya gönderilmediğinden, `useState` gibi etkileşimli API'ları kullanamazlar. Sunucu Bileşenlerine etkileşim eklemek için, `"use client"` yönergesini kullanarak Client Bileşenleri ile birleştirebilirsiniz.



#### Sunucu Bileşenleri için bir yönerge yoktur. {/*there-is-no-directive-for-server-components*/}

Bir yaygın yanlış anlama, Sunucu Bileşenlerinin `"use server"` ile belirtildiğidir, ancak Sunucu Bileşenleri için bir yönerge yoktur. `"use server"` yönergesi, Sunucu Eylemleri için kullanılır.

Daha fazla bilgi için, `Yönergeler` belgelerine bakın.



Aşağıdaki örnekte, `Notes` Sunucu Bileşeni, durum kullanarak `expanded` durumunu geçiştiren bir `Expandable` Client Bileşenini içe aktarır:
```js
// Sunucu Bileşeni
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Bileşeni
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Değiştir
      </button>
      {expanded && children}
    </div>
  )
}
```

Bu, önce `Notes` 'u bir Sunucu Bileşeni olarak render ederek çalışır, ardından paketleyiciye Client Bileşeni `Expandable` için bir paket oluşturması talimatı verilir. Tarayıcıda, Client Bileşenleri, prop olarak iletilen Sunucu Bileşenlerinin çıktısını görecektir:

```js
<head>
  <!-- Client Bileşenleri için paket -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>bu birinci not</p>
    </Expandable>
    <Expandable key={2}>
      <p>bu ikinci not</p>
    </Expandable>
    <!--...-->
  </div> 
</body>
```

### Asenkron bileşenler Sunucu Bileşenleri ile {/*async-components-with-server-components*/}

Sunucu Bileşenleri, asenkron/await kullanarak Bileşenler yazmanın yeni bir yolunu sunar. Asenkron bir bileşende `await` yaptığınızda, React, render etmeye devam etmeden önce vaadin çözülmesini bekleyecek ve askıya alacaktır. Bu, akış desteği ile sunucu/istemci sınırları boyunca çalışır.

Sunucuda bir vaadi oluşturabilir ve istemcide bekleyebilirsiniz:

```js
// Sunucu Bileşeni
import db from './database';

async function Page({id}) {
  // Sunucu Bileşenini askıya alacak.
  const note = await db.notes.get(id);
  
  // NOT: beklenmiyor, burada başlayacak ve istemcide bekleyecek. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Yorumlar Yükleniyor...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Bileşeni
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOT: bu, sunucudan vaadi yeniden başlatır.
  // Veriler mevcut olana kadar askıya alacaktır.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

`note` içeriği, sayfanın render edilmesi için önemli bir veri olduğu için bunu sunucuda `await` yapıyoruz. Yorumlar aşağıda ve daha düşük öncelikli olduğundan, sunucuda vaadi başlatıyoruz ve istemcide `use` API'si ile bekliyoruz. Bu, istemcide askıya alınır, `note` içeriğinin render edilmesini engellemeksizin.