---
title: "API sunucusu ve Firestore (Firebase)"
description: Bu içerik, Firestore kullanarak bir API oluşturmak için adım adım rehber sunmaktadır. Firebase ile birlikte kullanılacak yöntemler, uygulama yazımı ve yayınlama süreçleri detaylandırılmaktadır.
keywords: [API, Firestore, Firebase, Deno, Uygulama Yayınlama, Web Geliştirme, Türlerin Yönetimi]
---

Firebase, mobil ve web uygulamaları oluşturmak için Google tarafından geliştirilmiş bir platformdur. Firestore kullanarak verileri platformda kalıcı hale getirebilirsiniz. Bu eğiticide, bilgi eklemek ve almak için uç noktaları olan küçük bir API oluşturmak için nasıl kullanabileceğimize bir göz atalım.

- `Genel Bakış`
- `Kavramlar`
- `Firebase Kurulumu`
- `Uygulamayı Yazma`
- `Uygulamayı Yayınlama`

## Genel Bakış

Tek bir uç noktaya sahip bir API oluşturacağız; bu uç nokta `GET` ve `POST` isteklerini kabul edecek ve bir JSON yükü bilgisi döndürecektir:

```sh
# Uç noktaya alt yol olmadan bir GET isteği, mağazadaki tüm şarkıların
# detaylarını döndürmelidir:
GET /songs
# yanıt
[
  {
    title: "Şarkı Başlığı",
    artist: "Birisi",
    album: "Birşey",
    released: "1970",
    genres: "country rap",
  }
]

# Başlığa dayalı olarak şarkının detaylarını döndürmek için uç noktaya
# başlık ile birlikte bir GET isteği göndermelisiniz.
GET /songs/Şarkı%20Başlığı # '%20' == boşluk
# yanıt
{
  title: "Şarkı Başlığı"
  artist: "Birisi"
  album: "Birşey",
  released: "1970",
  genres: "country rap",
}

# Uç noktaya bir POST isteği, şarkı detaylarını eklemelidir.
POST /songs
# post istek gövdesi
{
  title: "Yeni Bir Başlık"
  artist: "Yeni Birisi"
  album: "Yeni Birşey",
  released: "2020",
  genres: "country rap",
}
```

:::tip
Bu eğitimde şunları yapacağız:
- Bir [Firebase Projesi](https://console.firebase.google.com/) oluşturup kuruyoruz.
- Uygulamamızı oluşturmak için bir metin düzenleyici kullanıyoruz.
- Uygulamamızı "barındırmak" için bir [gist](https://gist.github.com/) oluşturuyoruz.
- Uygulamamızı [Deno Deploy](https://dash.deno.com/) üzerinde yayınlıyoruz.
- Uygulamamızı [cURL](https://curl.se/) kullanarak test ediyoruz.
:::

## Kavramlar

Eğitimin geri kalanında belirli bir yaklaşımı anlamaya yardımcı olan birkaç kavram vardır ve uygulamanın genişletilmesine yardımcı olabilir. İsterseniz `Firebase Kurulumu` bölümüne geçebilirsiniz.

### Yayınlama tarayıcı benzeri

Yayınlama bulutta çalışmasına rağmen, sağladığı API'lerin çoğu, web standartlarına dayanmaktadır. Yani Firebase kullanırken, Firebase API'leri sunucu çalıştırma zamanları için tasarlanmış olanlardan daha fazla web ile uyumludur. Bu, bu eğitimde Firebase web kütüphanelerini kullanacağımız anlamına geliyor.

### Firebase XHR kullanıyor

Firebase, Closure'ın [WebChannel](https://google.github.io/closure-library/api/goog.net.WebChannel.html) etrafında bir sarmalayıcı kullanıyor ve WebChannel başlangıçta [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) etrafında oluşturulmuştur. WebChannel, daha modern `fetch()` API'sini desteklese de, güncel Firebase sürümleri, WebChannel'ı `fetch()` desteğiyle bir araya getirmiyor ve bunun yerine `XMLHttpRequest` kullanıyorlar.

Yayınlama tarayıcı benzeri olmasına rağmen, `XMLHttpRequest`'i desteklemiyor. `XMLHttpRequest`, birkaç sınırlaması ve Yayınlama'da uygulanması zor olabilecek özellikleri olan "eski" bir tarayıcı API'sidir; bu da Yayınlama'nın bu API'yi uygulama olasılığının düşük olduğu anlamına gelir.

:::warning
Bu nedenle, bu eğitimde Firebase/WebChannel'ın sunucu ile iletişim kurmasını sağlamak için `XMLHttpRequest` özellik setinin yeterli bir _polyfill_ kullanacağız.
:::

### Firebase kimlik doğrulaması

Firebase, kimlik doğrulama ile ilgili oldukça [birçok seçenek](https://firebase.google.com/docs/auth) sunmaktadır. Bu eğitimde e-posta ve şifre ile kimlik doğrulaması kullanacağız.

Bir kullanıcı oturum açtığında, Firebase bu kimlik doğrulamayı kalıcı hale getirebilir. Firebase'in web kütüphanelerini kullandığımızdan, kimlik doğrulamayı kalıcı hale getirmek, bir kullanıcının bir sayfadan uzaklaşmasına ve geri döndüğünde yeniden oturum açmasına gerek kalmaması anlamına gelir. Firebase kimlik doğrulamayı yerel depolama, oturum depolama veya hiçbiri olarak kalıcı hale getirmeye olanak tanır.

Yayınlama bağlamında ise, biraz farklıdır. Yayınlama, "aktif" kalacak şekilde, bazı isteklerde istenç içi durumun talep talebi arasında mevcut olacağı anlamına gelir; ancak çeşitli koşullar altında yeni bir dağıtım başlatılabilir veya kapatılabilir. Mevcut durumda, Yayınlama dışındaki hiçbir kalıcılığı sunmamaktadır. Ayrıca şu anda Firebase tarafından kimlik doğrulama bilgilerini depolamak için kullanılan global `localStorage` veya `sessionStorage` sunmamaktadır.

Yeniden kimlik doğrulama gereksinimini azaltmanın yanı sıra, birden çok kullanıcıyı tek bir dağıtım ile destekleyebilmemizi sağlamak için, Firebase'e bir `localStorage` arayüzü sağlamamıza ve bilgileri istemcide bir çerez olarak saklayabilmemizi sağlayacak bir polyfill kullanacağız.

## Firebase Kurulumu

[Firebase](https://firebase.google.com/) zengin özelliklere sahip bir platformdur. Firebase yönetiminin tüm ayrıntıları bu eğitimin kapsamı dışındadır. Bu eğitim için gerekli olanları kapsayacağız.

1. [Firebase konsolu](https://console.firebase.google.com/) altında yeni bir proje oluşturun.
2. Projenize bir web uygulaması ekleyin. Kurulum sihirbazında sağlanan `firebaseConfig` bilgilerini not alın. Aşağıdakine benzer bir şey olmalıdır. Bunu daha sonra kullanacağız:

   ```js title="firebase.js"
   var firebaseConfig = {
     apiKey: "APIKEY",
     authDomain: "example-12345.firebaseapp.com",
     projectId: "example-12345",
     storageBucket: "example-12345.appspot.com",
     messagingSenderId: "1234567890",
     appId: "APPID",
   };
   ```

3. Yönetim konsolundaki `Kimlik Doğrulama` altında `E-posta/Şifre` oturum açma yöntemini etkinleştirin.
4. `Kimlik Doğrulama` ve ardından `Kullanıcılar` bölümünde bir kullanıcı ve şifre eklemeniz gerekecek, üzerinde kullandığınız değerleri not edin.
5. Projenize `Firestore Veritabanı` ekleyin. Konsol, bunu _üretim modu_ veya _test modu_ olarak ayarlamanıza izin verecektir. Bunu nasıl yapılandıracağınız size kalmış; ama _üretim modu_ daha fazla güvenlik kuralı kurmanızı gerektirecektir.
6. Veritabanına `şarkılar` adlı bir koleksiyon ekleyin. Bu, en az bir belge eklemenizi gerektirecektir. Belgeyi _Otomatik ID_ ile ayarlayın.

:::note
Google hesabınızın durumuna bağlı olarak başka kurulum ve yönetim adımları gerçekleşmesi gerekebilir.
:::

## Uygulamayı Yazma

Uygulamamızı en sevdiğimiz editörde bir JavaScript dosyası olarak oluşturmak istiyoruz.

İlk olarak, Firebase'in Yayınlama altında çalışması için gerekli olan `XMLHttpRequest` polyfill'ini ve Firebase kimlik doğrulamasının oturum açan kullanıcıları kalıcı hale getirmesi için `localStorage` için bir polyfill'i içe aktaracağız:

```js title="firebase.js"
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
```

> ℹ️ Bu eğitimin yazıldığı sırada mevcut paketlerin güncel sürümlerini kullanıyoruz. Güncel sürümlerin kontrol edilmesi isteğe bağlıdır.

Yayınlama, birçok web standart API'sine sahip olduğundan, Firebase'in web kütüphanelerini dağıtım altında kullanmak en iyisidir. Mevcut durumda, Firebase için v9 hala beta aşamasındadır, bu nedenle bu eğitimde v8'i kullanacağız:

```js title="firebase.js"
import firebase from "https://esm.sh/firebase@8.7.0/app";
import "https://esm.sh/firebase@8.7.0/auth";
import "https://esm.sh/firebase@8.7.0/firestore";
```

Ayrıca [oak](https://deno.land/x/oak) kütüphanesini API'ler oluşturmak için middleware framework olarak kullanacağız; bu da `localStorage` değerlerini alıp istemci çerezleri olarak ayarlayacak middleware içerecek:

```js title="firebase.js"
import {
  Application,
  Router,
  Status,
} from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { virtualStorage } from "https://deno.land/x/virtualstorage@0.1.0/middleware.ts";
```

Artık Firebase uygulamamızı ayarlamamız gerekiyor. Bu yapılandırmayı daha sonra ayarlayacağımız `FIREBASE_CONFIG` anahtarı altında ortam değişkenlerinden alacağız ve kullanacağımız Firebase parçalarına referanslar alacağız:

```js title="firebase.js"
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

Ayrıca, uygulamanın her istekte oturum açmış kullanıcıları işleyebilmesi için bir yapılandırma yapacağız. Bu dağıtımda daha önce oturum açmış olan kullanıcıların bir haritasını oluşturacağız. Bu eğitimde yalnızca bir oturum açmış kullanıcıya sahip olacağız, ancak kod, istemcilerin bireysel olarak oturum açmasına olanak tanımak için kolayca uyarlanabilir:

```js title="firebase.js"
const users = new Map();
```

Şimdi middleware yönlendirmemizi oluşturup `/songs` için `GET` ve `POST` destekleyen üç farklı middleware işleyici oluşturmalıyız ve `/songs/{title}` üzerinde belirli bir şarkının `GET` isteği yapılacak:

```js title="firebase.js"
const router = new Router();

// Koleksiyondaki herhangi bir şarkıyı döndürür
router.get("/songs", async (ctx) => {
  const querySnapshot = await db.collection("songs").get();
  ctx.response.body = querySnapshot.docs.map((doc) => doc.data());
  ctx.response.type = "json";
});

// Başlığa uyan ilk belgeyi döndürür
router.get("/songs/:title", async (ctx) => {
  const { title } = ctx.params;
  const querySnapshot = await db.collection("songs").where("title", "==", title)
    .get();
  const song = querySnapshot.docs.map((doc) => doc.data())[0];
  if (!song) {
    ctx.response.status = 404;
    ctx.response.body = `Başlığı "${ctx.params.title}" olan şarkı bulunamadı.`;
    ctx.response.type = "text";
  } else {
    ctx.response.body = querySnapshot.docs.map((doc) => doc.data())[0];
    ctx.response.type = "json";
  }
});

function isSong(value) {
  return typeof value === "object" && value !== null && "title" in value;
}

// Aynı başlığa sahip şarkıları kaldırır ve yeni şarkıyı ekler
router.post("/songs", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.throw(Status.BadRequest, "JSON belgesi olmalıdır");
  }
  const song = await body.value;
  if (!isSong(song)) {
    ctx.throw(Status.BadRequest, "Yük doğru şekilde oluşturulmamış");
  }
  const querySnapshot = await db
    .collection("songs")
    .where("title", "==", song.title)
    .get();
  await Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete()));
  const songsRef = db.collection("songs");
  await songsRef.add(song);
  ctx.response.status = Status.NoContent;
});
```

Tamam, neredeyse bitirdik. Sadece middleware uygulamamızı oluşturmamız ve içe aktardığımız `localStorage` middleware'ini eklememiz gerekiyor:

```js title="firebase.js"
const app = new Application();
app.use(virtualStorage());
```

Ardından kullanıcıyı kimlik doğrulamak için middleware eklememiz gerekecek. Bu eğitimde, sadece ortam değişkenlerinden kullanıcı adı ve şifreyi alacağız, ancak bu durum, oturum açmamışlarsa bir kullanıcıyı bir oturum açma sayfasına yönlendirmek için kolayca uyarlanabilir:

```js title="firebase.js"
app.use(async (ctx, next) => {
  const signedInUid = ctx.cookies.get("LOGGED_IN_UID");
  const signedInUser = signedInUid != null ? users.get(signedInUid) : undefined;
  if (!signedInUid || !signedInUser || !auth.currentUser) {
    const creds = await auth.signInWithEmailAndPassword(
      Deno.env.get("FIREBASE_USERNAME"),
      Deno.env.get("FIREBASE_PASSWORD"),
    );
    const { user } = creds;
    if (user) {
      users.set(user.uid, user);
      ctx.cookies.set("LOGGED_IN_UID", user.uid);
    } else if (signedInUser && signedInUid.uid !== auth.currentUser?.uid) {
      await auth.updateCurrentUser(signedInUser);
    }
  }
  return next();
});
```

Şimdi, yönlendirmemizi middleware uygulamasına ekleyelim ve uygulamayı 8000 numaralı portta dinleyecek şekilde ayarlayalım:

```js title="firebase.js"
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
```

Artık API'lerimizi servis edebilecek bir uygulamamız var.

## Uygulamayı Yayınlama

Artık her şey yerinde, yeni uygulamanızı yayınlayalım!

1. Tarayıcınızda [Deno Deploy](https://dash.deno.com/new_project) adresine gidin ve GitHub hesabınızı bağlayın.
2. Yeni uygulamanızı içeren deposu seçin.
3. Projenize bir isim verebilir veya Deno'nun sizin için bir tane oluşturmasına izin verebilirsiniz.
4. Giriş Noktası açılır menüsünde `firebase.js`'i seçin.
5. **Proje Yayınla** butonuna tıklayın.

Uygulamanızın çalışabilmesi için ortam değişkenlerini yapılandırmamız gerekecek.

Projenizin başarı sayfasında veya proje gösterge panelinizde, **Çevresel değişkenler ekle** butonuna tıklayın. Ortam Değişkenleri altında **+ Değişken Ekle** seçeneğine tıklayın. Aşağıdaki değişkenleri oluşturun:

1. `FIREBASE_USERNAME` - Yukarıda eklenen Firebase kullanıcısı (e-posta adresi)
2. `FIREBASE_PASSWORD` - Yukarıda eklenen Firebase kullanıcı şifresi
3. `FIREBASE_CONFIG` - Firebase uygulamasının JSON dizesi biçimindeki yapılandırması

Yapılandırma, uygulama tarafından okunabilir olması için geçerli bir JSON dizesi olmalıdır. Ayarlama sırasında verilen kod kesiti şu şekilde görünüyorsa:

```js
var firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "example-12345.firebaseapp.com",
  projectId: "example-12345",
  storageBucket: "example-12345.appspot.com",
  messagingSenderId: "1234567890",
  appId: "APPID",
};
```

Dize değerini bu şekilde ayarlamalısınız (boşluklar ve yeni satırlar gerekmez):

```json
{
  "apiKey": "APIKEY",
  "authDomain": "example-12345.firebaseapp.com",
  "projectId": "example-12345",
  "storageBucket": "example-12345.appspot.com",
  "messagingSenderId": "1234567890",
  "appId": "APPID"
}
```

Değişkenleri kaydetmek için tıklayın.

:::info
Artık API'mizi test edelim.
:::

Yeni bir şarkı oluşturabiliriz:

```sh
curl --request POST \
  --header "Content-Type: application/json" \
  --data '{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}' \
  --dump-header \
  - https://<project_name>.deno.dev/songs
```

Ve koleksiyonumuzdaki tüm şarkıları alabiliriz:

```sh
curl https://<project_name>.deno.dev/songs
```

Ve oluşturduğumuz bir başlık hakkında belirli bilgileri alabiliriz:

```sh
curl https://<project_name>.deno.dev/songs/Old%20Town%20Road
```