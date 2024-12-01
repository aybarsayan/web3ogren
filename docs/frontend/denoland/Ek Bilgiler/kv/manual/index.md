---
description: Deno KV, Deno ortamında etkili anahtar-değer depolama sağlayan bir sistemdir. Bu kılavuzda, Deno KV'nin temel özellikleri ve kullanımı hakkında detaylar bulacaksınız.
keywords: [Deno KV, anahtar-değer veritabanı, Deno açık kaynak, veri yönetimi, veri depolama]
---

**Deno KV**, doğrudan Deno çalışma zamanına entegre edilmiş bir
[anahtar-değer veritabanı](https://tr.wikipedia.org/wiki/Anahtar%E2%80%93de%C4%9Fer_veritaban%C4%B1),
[`Deno.Kv` ad alanında](https://docs.deno.com/api/deno/~/Deno.Kv) mevcuttur. Birçok veri
depolama durumu için kullanılabilir, ancak hızlı okuma ve yazmadan fayda
sağlayan basit veri yapıları depolamada mükemmel performans gösterir. Deno KV,
Deno CLI ve `Deno Deploy` üzerinde kullanılabilir.

:::info
Deno KV'nin anahtar özelliklerini birlikte inceleyelim.
:::

## Bir veritabanını açma

Deno programınızda, bir KV veritabanasına
[`Deno.openKv()`](https://docs.deno.com/api/deno/~/Deno.openKv) kullanarak referans
alabilirsiniz. Veritabanınızı saklamak istediğiniz dosya sistemi yolunu isteğe
bağlı olarak geçebilirsiniz, aksi takdirde, scriptinizin mevcut çalışma dizinine
göre sizin için bir veritabanı oluşturulacaktır.

```ts
const kv = await Deno.openKv();
```

## Anahtar-değer çiftini oluşturma, güncelleme ve okuma

Deno KV'de veriler, JavaScript nesne literal'i veya bir
[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
gibi anahtar-değer çiftleri olarak saklanır. **Anahtarlar**, `string`,
`number`, `bigint` veya `boolean` gibi JavaScript türlerinin bir dizisi olarak
temsil edilir. **Değerler**, key-value çiftleri olarak herhangi bir JavaScript nesnesi
olabilir. Bu örnekte, bir kullanıcının UI tercihlerinin bir anahtar-değer
çiftini oluşturuyoruz ve bunu
[`kv.set()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.set) ile saklıyoruz.

```ts
const kv = await Deno.openKv();

const prefs = {
  username: "ada",
  theme: "dark",
  language: "en-US",
};

const result = await kv.set(["preferences", "ada"], prefs);
```

Bir anahtar-değer çifti ayarlandıktan sonra, veritabanından
[`kv.get()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get) ile okuyabilirsiniz:

```ts
const entry = await kv.get(["preferences", "ada"]);
console.log(entry.key);
console.log(entry.value);
console.log(entry.versionstamp);
```

:::tip
Hem `get` hem de `list` `işlemleri` aşağıdaki özelliklere sahip
[KvEntry](https://docs.deno.com/api/deno/~/Deno.KvEntry) nesnesini döner:
- `key` - değeri ayarlamak için kullandığınız dizi anahtarı
- `value` - bu anahtar için ayarladığınız JavaScript nesnesi
- `versionstamp` - bir anahtarın güncellenip güncellenmediğini belirlemek için
  kullanılan üretilmiş değer.
:::

`set` işlemi, belirli bir anahtar için zaten var olan nesneleri güncellemek için
de kullanılır. Bir anahtarın değeri güncellendiğinde, `versionstamp` yeni
üretim değeri ile değişecektir.

## Birden fazla anahtar-değer çiftini listeleme

Belirli bir sayıda anahtar için değerleri almak amacıyla
[`kv.getMany()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.getMany) kullanabilirsiniz.
Birden fazla anahtar argüman olarak geçin, ve her anahtar için bir değer dizisi
alacaksınız. **Değerlerin ve versionstamp'lerin `null` olabileceğini** unutmayın; eğer
verilen anahtar(lar) için değer yoksa.

```ts
const kv = await Deno.openKv();
const result = await kv.getMany([
  ["preferences", "ada"],
  ["preferences", "grace"],
]);
result[0].key; // ["preferences", "ada"]
result[0].value; // { ... }
result[0].versionstamp; // "00000000000000010000"
result[1].key; // ["preferences", "grace"]
result[1].value; // null
result[1].versionstamp; // null
```

:::note
Sıklıkla, belirli bir öneki paylaşan tüm anahtarların bir anahtar-değer çifti
listesi almak yararlı olabilir. 
:::

Bu tür bir işlem, 
[`kv.list()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.list) kullanılarak
mümkündür. Bu örnekte, `"preferences"` önekini paylaşan anahtar-değer çiftlerinin
bir listesini alıyoruz.

```ts
const kv = await Deno.openKv();
const entries = kv.list({ prefix: ["preferences"] });
for await (const entry of entries) {
  console.log(entry.key); // ["preferences", "ada"]
  console.log(entry.value); // { ... }
  console.log(entry.versionstamp); // "00000000000000010000"
}
```

Döndürülen anahtarlar, önceden gelen bileşenin ardından anahtarın bir sonraki
bileşenine göre alfabetik olarak sıralanır. Bu nedenle, şunlara sahip KV çiftleri:

- `["preferences", "ada"]`
- `["preferences", "bob"]`
- `["preferences", "cassie"]`

Bu sırayla `kv.list()` tarafından döndürülür.

Okuma işlemleri ya
`**güçlü veya nihai tutarlılık modunda**` gerçekleştirilebilir. Güçlü
tutarlılık modu, okuma işleminin en son yazılan değeri döndüreceğini garanti eder.
Nihai tutarlılık modu, eski bir değeri döndürebilir; ancak daha hızlıdır. Tersine,
yazma işlemleri her zaman güçlü tutarlılık modunda gerçekleştirilir.

## Anahtar-değer çiftlerini silme

Veritabanından bir anahtarı silmek için
[`kv.delete()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.delete) kullanabilirsiniz.
Verilen anahtar için değer bulunamazsa hiçbir işlem yapılmaz.

```ts
const kv = await Deno.openKv();
await kv.delete(["preferences", "alan"]);
```

## Atomik işlemler

Deno KV, bir veya birçok veri manipülasyon işlemini aynı anda koşullu olarak
belirlemenizi sağlayan `atomik işlemleri` gerçekleştirme yeteneğine
sahiptir. Aşağıdaki örnekte, daha önce oluşturulmadığı takdirde yeni bir
tercihler nesnesi oluşturuyoruz.

```ts
const kv = await Deno.openKv();

const key = ["preferences", "alan"];
const value = {
  username: "alan",
  theme: "light",
  language: "en-GB",
};

const res = await kv.atomic()
  .check({ key, versionstamp: null }) // `null` versionstamps 'değer yok' anlamına gelir
  .set(key, value)
  .commit();
if (res.ok) {
  console.log("Tercihler henüz yoktu. Eklendi!");
} else {
  console.error("Tercihler zaten mevcut.");
}
```

Deno KV'deki işlemler hakkında daha fazla bilgi edinin `buradan`.

## Sorgulamayı ikincil indekslerle geliştirme

`İkincil indeksler`, aynı veriyi birden fazla anahtar altında
saklar ve ihtiyaç duyduğunuz verilerin daha basit sorgularını sağlar. Diyelim ki,
kullanıcı tercihlerine hem kullanıcı adı HEM de e-posta adresiyle erişebilmemiz
gerekiyor. Bunu sağlamak için, tercihleri kaydetmek için iki indeks oluşturma
mantığını saran bir fonksiyon sağlayabilirsiniz.

```ts
const kv = await Deno.openKv();

async function savePreferences(prefs) {
  const key = ["preferences", prefs.username];

  // Birincil anahtarı ayarlayın
  const r = await kv.set(key, prefs);

  // İkincil anahtarın değerini birincil anahtar olarak ayarlayın
  await kv.set(["preferencesByEmail", prefs.email], key);

  return r;
}

async function getByUsername(username) {
  // Daha önce olduğu gibi kullanın...
  const r = await kv.get(["preferences", username]);
  return r;
}

async function getByEmail(email) {
  // Anahtarı e-posta ile arayın, ardından gerçek veri için ikinci bir arama
  const r1 = await kv.get(["preferencesByEmail", email]);
  const r2 = await kv.get(r1.value);
  return r2;
}
```

`İkincil indeksler hakkında manualde daha fazla bilgi edinin`.

## Deno KV'deki güncellemeleri izleme

Ayrıca `kv.watch()` ile Deno KV'den güncellemeleri dinleyebilirsiniz; bu, sağladığınız
anahtar veya anahtarların yeni bir değerini veya değerlerini yayar. Aşağıdaki sohbet
örneğinde, `["last_message_id", roomId]` anahtarı üzerinde güncellemeleri izliyoruz.
`messageId`'yi alıyoruz, ardından `seen` ve `messageId`'den tüm yeni mesajları almak
için `kv.list()` ile kullanıyoruz.

```ts
let seen = "";
for await (const [messageId] of kv.watch([["last_message_id", roomId]])) {
  const newMessages = await Array.fromAsync(kv.list({
    start: ["messages", roomId, seen, ""],
    end: ["messages", roomId, messageId, ""],
  }));
  await websocket.write(JSON.stringify(newMessages));
  seen = messageId;
}
```

`Deno KV izleme kullanımı hakkında daha fazla bilgi edinin`.

## Üretim kullanımı

Deno KV, `Deno Deploy` üzerindeki canlı uygulamalarda kullanılabilir.
Üretimde, Deno KV, Apple tarafından oluşturulan açık kaynaklı bir anahtar-değer
deposu olan [FoundationDB](https://www.foundationdb.org/) tarafından desteklenmektedir.

**KV kullanan Deno programlarınızı çalıştırmak için ek bir yapılandırma gerekli
değildir** - kodunuz gerektiğinde yeni bir Deploy veritabanı sizin için
sağlanacaktır. Deno Deploy'de Deno KV hakkında daha fazla bilgi edinin `buradan`.

## Test etme

Varsayılan olarak, [`Deno.openKv()`](https://docs.deno.com/api/deno/~/Deno.openKv),
çalıştığı yoldan kaynaklanan kalıcı bir depolama alanı oluşturur veya açar. Bu durum,
genellikle birden fazla kez ardışık olarak çalıştırıldığında aynı davranışı
göstermek için gerekli olan testler için istenmeyendir.

Deno KV kullanan kodu test etmek için, geçici bir Deno KV veri deposu
oluşturmak üzere özel `":memory:"` argümanını kullanabilirsiniz.

```ts
async function setDisplayName(
  kv: Deno.Kv,
  username: string,
  displayname: string,
) {
  await kv.set(["preferences", username, "displayname"], displayname);
}

async function getDisplayName(
  kv: Deno.Kv,
  username: string,
): Promise<string | null> {
  return (await kv.get(["preferences", username, "displayname"]))
    .value as string;
}

Deno.test("Preferences", async (t) => {
  const kv = await Deno.openKv(":memory:");

  await t.step("displayname ayarlanabilir", async () => {
    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, null);

    await setDisplayName(kv, "example", "Örnek Kullanıcı");

    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, "Örnek Kullanıcı");
  });
});
```

Bu, Deno KV'nin yerel geliştirme sırasında SQLite ile desteklenmiş olması nedeniyle
çalışır. Yerel bellek SQLite veritabanları gibi, birden fazla geçici Deno KV
depolarının bir arada var olabilmesi mümkündür ve birbirleriyle karışmazlar. Özel
veritabanı adresleme modları hakkında daha fazla bilgi için, [SQLite belgelerine
bakın](https://www.sqlite.org/inmemorydb.html).

## Sonraki adımlar

Bu noktada, Deno KV ile yüzeysel olarak etkileşimde bulunmaya başlıyorsunuz. Lütfen
`Deno KV anahtar alanı` ve `öğreticiler ve örnek uygulamalar
kapsamındaki` rehberimize göz atmayı unutmayın.