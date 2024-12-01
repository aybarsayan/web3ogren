---
title: "TypeScript'te Veri Modelleme"
description: Bu kılavuz, TypeScript uygulamalarında Deno KV ile veri modelleme konusunda güçlü tipli nesnelerin nasıl oluşturulacağını ve bu nesnelerin nasıl depolanıp alınacağını ele alır. Ayrıca, uygulama logic'ini kapsüllemek için servis katmanları oluşturmanın yollarını keşfedeceğiz.
keywords: [TypeScript, Deno, veri modelleme, nesneler, arayüzler, DTO, servis katmanı]
---



TypeScript uygulamalarında, genellikle uygulamanızın üzerinde çalıştığı verileri tutacak kuvvetli tipli, iyi belgelenmiş nesneler oluşturmak istenir. [Arayüzler](https://www.typescriptlang.org/docs/handbook/2/objects.html) veya [sınıflar](https://www.typescriptlang.org/docs/handbook/2/classes.html) kullanarak, programınızdaki nesnelerin şekli ve davranışını tanımlayabilirsiniz.

:::info
Deno KV kullanıyorsanız, kuvvetli tipli nesneleri kalıcı hale getirmek ve geri almak için biraz ek çalışma gerekmektedir.
:::

Bu kılavuzda, Deno KV'ye giren ve çıkan kuvvetli tipli nesnelerle çalışmak için stratejileri ele alacağız.

## Arayüzler ve tip beyanları kullanma

Deno KV'de uygulama verilerini depolarken ve alırken, verilerinizin şekilini TypeScript arayüzlerini kullanarak tanımlamaya başlamak isteyebilirsiniz. Aşağıda, bir blog sistemi için bazı ana bileşenleri tanımlayan bir nesne modeli bulunmaktadır:

```ts title="model.ts"
export interface Author {
  username: string;
  fullName: string;
}

export interface Post {
  slug: string;
  title: string;
  body: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
}
```

Bu nesne modeli bir blog yazısını ve ilgili bir yazarı tanımlar.

> **Not:** Deno KV ile bu TypeScript arayüzlerini [veri transfer nesneleri (DTO'lar)](https://martinfowler.com/bliki/LocalDTO.html) gibi kullanabilirsiniz - aksi takdirde tipli olmayan nesnelerin etrafında kuvvetli tipli bir sarmalayıcı.

Herhangi bir ek çalışma olmadan, bu DTO'ların içeriklerini Deno KV'de saklayabilirsiniz.

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const a: Author = {
  username: "acdoyle",
  fullName: "Arthur Conan Doyle",
};

await kv.set(["authors", a.username], a);
```

Ancak, Deno KV'den bu aynı nesneyi alırken, varsayılan olarak onunla ilişkilendirilmiş tip bilgisi olmayacaktır. Ancak, anahtar için saklanan nesnenin şekilini biliyorsanız, [tip beyanı](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) kullanarak TypeScript derleyicisine bir nesnenin şekli hakkında bilgi verebilirsiniz.

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get(["authors", "acdoyle"]);
const ac = r.value as Author;

console.log(ac.fullName);
```

Ayrıca `get` için isteğe bağlı bir [tip parametresi](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get) belirtebilirsiniz:

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get<Author>(["authors", "acdoyle"]);

console.log(r.value.fullName);
```

Daha basit veri yapıları için bu teknik yeterli olabilir. Ancak, genellikle alan nesnelerinizi oluştururken veya erişirken bazı işleme mantığını uygulamak isteyeceksiniz ya da buna ihtiyacınız olacak. Bu gereksinim ortaya çıktığında, DTO'larınız üzerinde işlem yapabilen bir dizi saf fonksiyon geliştirebilirsiniz.

## İş mantığını bir servis katmanı ile kapsülleme

Uygulamanızın kalıcılık ihtiyaçları daha karmaşık hale geldiğinde - örneğin, verilerinizi farklı anahtarlarla sorgulamak için `ikincil dizinler` oluşturmanız gerektiğinde veya nesneler arasında ilişkileri sürdürmeniz gerektiğinde - DTO'larınızın üstünde veri geçişinin geçerli olmasını sağlamak için bir dizi fonksiyon oluşturmak isteyeceksiniz (ve yalnızca doğru bir şekilde tipli olmamakla birlikte).

Yukarıdaki iş nesnelerimizden, `Post` nesnesi, nesnenin bir örneğini kaydetmek ve almak için küçük bir kod katmanına ihtiyaç duyacak kadar karmaşık. Aşağıda, temel Deno KV API'lerini saran ve `Post` arayüzü için kuvvetli tipli nesne örnekleri döndüren iki fonksiyonun bir örneği bulunmaktadır.

:::tip
Dikkat edilmesi gereken bir nokta, bir `Author` nesnesi için bir tanımlayıcıyı saklamamız gerektiğidir, böylece daha sonra KV'den yazar bilgilerini alabiliriz.
:::

```ts
import { Author, Post } from "./model.ts";

const kv = await Deno.openKv();

interface RawPost extends Post {
  authorUsername: string;
}

export async function savePost(p: Post): Promise<Post> {
  const postData: RawPost = Object.assign({}, p, {
    authorUsername: p.author.username,
  });

  await kv.set(["posts", p.slug], postData);
  return p;
}

export async function getPost(slug: string): Promise<Post> {
  const postResponse = await kv.get(["posts", slug]);
  const rawPost = postResponse.value as RawPost;
  const authorResponse = await kv.get(["authors", rawPost.authorUsername]);

  const author = authorResponse.value as Author;
  const post = Object.assign({}, postResponse.value, {
    author,
  }) as Post;

  return post;
}
```

Bu ince katman, başka bir dizindeki verileri referans almak için kullanılan ek veri içerecek şekilde gerçek `Post` arayüzünü genişleten bir `RawPost` arayüzü kullanır. 

`savePost` ve `getPost` işlevleri, doğrudan Deno KV `get` veya `set` işlemlerinin yerini alır, böylece model nesnelerini uygun türler ve ilişkilerle düzgün bir şekilde serileştirip "nemlendirme" işlemi yapabiliriz.