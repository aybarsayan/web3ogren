---
title: "İkincil Diziler"
description: "Bu belge, anahtar-değer mağazalarında ikincil dizilerin nasıl kullanılacağını ve benzersiz ile benzersiz olmayan dizilerin aralarındaki farkları açıklamaktadır. Ayrıca, geliştirme sırasında dikkat edilmesi gereken en iyi uygulamaları sunmaktadır."
keywords: [ikincil diziler, anahtar-değer mağazaları, Deno KV, benzersiz diziler, benzersiz olmayan diziler]
---



Anahtar-değer mağazaları, Deno KV gibi, verileri anahtar-değer çiftlerinin koleksiyonları olarak organize eder; burada her benzersiz anahtar, tek bir değerle ilişkilendirilmiştir. Bu yapı, **anahtarları** temel alarak değerlerin kolayca alınmasını sağlar, ancak değerler temel alınarak sorgu yapılmasına izin vermez. Bu kısıtlamayı aşmak için, aynı değeri, o değerin (bir kısmını) içeren ek anahtarlar altında depolayan **ikincil diziler** oluşturabilirsiniz.

:::info
İkincil diziler kullanılırken birincil ve ikincil anahtarlar arasında tutarlılığı sağlamak çok önemlidir.
:::

Bir değer, ikincil anahtarı güncellemeksizin birincil anahtar üzerinde güncellenirse, ikincil anahtarı hedef alan bir sorgudan dönen veri yanlış olacaktır. Birincil ve ikincil anahtarların her zaman **aynı veriyi** temsil etmesini sağlamak için, veri eklerken, güncellerken veya silerken atomik işlemleri kullanın. Bu yaklaşım, değişim eylemlerinin bir bütün olarak tek bir birim olarak gerçekleştirilmesini sağlar; ya tamamen başarılı olur ya da tamamen başarısız olur. **Tutarsızlıkların** önlenmesini sağlar.

---

## Benzersiz diziler (bir-bir)

Benzersiz dizilerde dizideki her anahtar, tam olarak bir birincil anahtar ile ilişkilendirilmiştir. Örneğin, kullanıcı verilerini depolarken ve kullanıcıları hem benzersiz kimlikleri hem de e-posta adresleri ile ararken, kullanıcı verilerini iki ayrı anahtar altında depolayın: birincil anahtar (kullanıcı kimliği) için biri ve ikincil dizi (e-posta) için diğeri. Bu yapı, kullanıcıları ya kimlikleriyle ya da e-postalarıyla sorgulamayı sağlar. İkincil dizi, mağazadaki değerlerde benzersizlik kısıtlamaları da uygulayabilir. 

> Kullanıcı verileri durumunda, her e-posta adresinin yalnızca bir kullanıcı ile ilişkilendirilmesini sağlamak için diziyi kullanın — diğer bir deyişle e-postaların benzersiz olduğundan emin olun.

Bu örnek için benzersiz bir ikincil dizi uygulamak için şu adımları izleyin:

1. Veriyi temsil eden bir `User` arayüzü oluşturun:

   ```ts
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

2. Kullanıcı verilerini hem birincil hem de ikincil anahtarlarda depolayan bir `insertUser` fonksiyonu tanımlayın:

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byEmailKey = ["users_by_email", user.email];
     const res = await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .check({ key: byEmailKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byEmailKey, user)
       .commit();
     if (!res.ok) {
       throw new TypeError("Bu ID veya e-posta ile bir kullanıcı mevcut");
     }
   }
   ```

   > Bu fonksiyon, aynı ID veya e-posta ile kullanıcı olmadığını kontrol eden bir atomik işlemle eklemeyi gerçekleştirmektedir. Bu kısıtlamalardan biri ihlal edilirse, ekleme başarısız olur ve hiçbir veri değiştirilmez.

3. Bir kullanıcının ID'sine göre kullanıcıyı almak için bir `getUser` fonksiyonu tanımlayın:

   ```ts
   async function getUser(id: string): Promise<User | null> {
     const res = await kv.get<User>(["users", id]);
     return res.value;
   }
   ```

4. E-posta adresine göre bir kullanıcıyı almak için bir `getUserByEmail` fonksiyonu tanımlayın:

   ```ts
   async function getUserByEmail(email: string): Promise<User | null> {
     const res = await kv.get<User>(["users_by_email", email]);
     return res.value;
   }
   ```

   Bu fonksiyon, mağazayı ikincil anahtar kullanarak sorgular
   (`["users_by_email", email]`).

5. Kullanıcıları ID'lerine göre silmek için bir `deleteUser` fonksiyonu tanımlayın:

   ```ts
   async function deleteUser(id: string) {
     let res = { ok: false };
     while (!res.ok) {
       const getRes = await kv.get<User>(["users", id]);
       if (getRes.value === null) return;
       res = await kv.atomic()
         .check(getRes)
         .delete(["users", id])
         .delete(["users_by_email", getRes.value.email])
         .commit();
     }
   }
   ```

   > Bu fonksiyon öncelikle kullanıcıyı ID'si ile alarak kullanıcının e-posta adresini alma işlemi gerçekleştirir. Bu, ikincil dizinin oluşturulması için gerekli olan e-postayı almak için gereklidir. Ardından, kullanıcı veritabanındaki değişikliklerin olmamasını kontrol eden bir atomik işlem gerçekleştirir ve daha sonra kullanıcı değerine işaret eden birincil ve ikincil anahtarı siler. Eğer bu işlem başarısız olursa (kullanıcı sorgulama ve silme arasında değiştirilmişse), atomik işlem iptal edilir. Tüm prosedür, silme başarılı olana kadar tekrar edilir. Kontrol, alım ve silme arasındaki koşullara bağlı yarış durumlarını önlemek için gereklidir. 

---

## Benzersiz Olmayan Diziler (Birden Fazla)

Benzersiz olmayan diziler, bir anahtarın birden fazla birincil anahtarla ilişkilendirilebildiği ikincil dizilerdir; bu da ortak bir özellik temelinde birden fazla öğeyi sorgulamanıza olanak tanır. Örneğin, kullanıcıları favori renklerine göre sorgularken, bunu benzersiz olmayan ikincil dizi kullanarak uygulayın. Favori renk, birden fazla kullanıcının aynı favori renge sahip olabileceği için benzersiz olmayan bir niteliğe sahiptir.

:::tip
Bu örnek için benzersiz olmayan bir ikincil dizi uygulamak için şu adımları izleyin:
:::

1. `User` arayüzünü tanımlayın:

   ```ts
   interface User {
     id: string;
     name: string;
     favoriteColor: string;
   }
   ```

2. `insertUser` fonksiyonunu tanımlayın:

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byColorKey = [
       "users_by_favorite_color",
       user.favoriteColor,
       user.id,
     ];
     await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byColorKey, user)
       .commit();
   }
   ```

3. Kullanıcıları favori renklerine göre almak için bir fonksiyon tanımlayın:

   ```ts
   async function getUsersByFavoriteColor(color: string): Promise<User[]> {
     const iter = kv.list<User>({ prefix: ["users_by_favorite_color", color] });
     const users = [];
     for await (const { value } of iter) {
       users.push(value);
     }
     return users;
   }
   ```

Bu örnek, kullanıcıları favori renklerine göre sorgulayan bir benzersiz olmayan ikincil dizinin kullanımını göstermektedir, `users_by_favorite_color`. Birincil anahtar, kullanıcı `id` olarak kalır.

Benzersiz ve benzersiz olmayan dizilerin uygulanmasındaki temel fark, ikincil anahtarların yapısı ve organizasyonudur. Benzersiz dizilerde, her ikincil anahtar tam olarak bir birincil anahtar ile ilişkilendirilir, böylece dizinlenmiş niteliğin tüm kayıtlar arasında benzersiz olması sağlanır. Benzersiz olmayan diziler durumunda, tek bir ikincil anahtar birden fazla birincil anahtar ile ilişkilendirilebilir, çünkü dizinlenmiş özellik birden fazla kayıt arasında paylaşılabilir. Bunun başarıyla gerçekleşmesi için, benzersiz olmayan ikincil anahtarlar genellikle bir ek benzersiz tanımlayıcı (örneğin, birincil anahtar) ile yapılandırılır, böylece aynı özelliğe sahip birden fazla kayıt çakışmadan bir arada var olabilir.