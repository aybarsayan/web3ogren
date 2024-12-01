---
title: "Firebase'e Bağlanma"
description: Firebase, mobil ve web uygulamaları oluşturmak için Google tarafından geliştirilen bir platformdur. Bu eğitim, Deno Deploy üzerinde dağıtılan bir uygulamadan Firebase'e nasıl bağlanılacağını adım adım açıklamaktadır.
keywords: [Firebase, Deno Deploy, web uygulamaları, kimlik doğrulama, NoSQL, Firestore]
---

Firebase, mobil ve web uygulamaları oluşturmak için Google tarafından geliştirilen bir platformdur. Özellikleri arasında giriş için kimlik doğrulama öğeleri ve veri saklayabileceğiniz bir NoSQL veri deposu olan Firestore bulunmaktadır.

Bu eğitim, Deno Deploy üzerinde dağıtılan bir uygulamadan Firebase'e **nasıl bağlanılacağını** ele almaktadır.

Firebase üzerinde örnek bir uygulama oluşturan daha kapsamlı bir eğitimi `buradan` bulabilirsiniz.

## Firebase'den kimlik bilgilerini alın

> Bu eğitim, Firebase'de zaten bir proje oluşturduğunuzu ve projenize bir web uygulaması eklediğinizi varsayar.

1. Firebase'deki projenize gidin ve **Proje Ayarları**'na tıklayın.
2. Uygulama adınızı içeren bir kartı görene kadar aşağıya kaydırın ve bir `firebaseConfig` nesnesini içeren bir kod örneği görünmelidir. Aşağıdaki gibi görünmesi gerekir. Bunu elinizin altında bulundurun. Daha sonra kullanacağız:

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

---

## Deno Deploy'de bir Proje Oluşturun

1. [https://dash.deno.com/new](https://dash.deno.com/new) adresine gidin (zaten girmediyseniz GitHub ile oturum açın) ve **Komut satırından dağıt** altında **+ Boş Proje**'ye tıklayın.
2. Şimdi proje sayfasında mevcut olan **Ayarlar** butonuna tıklayın.
3. **Çevre Değişkenleri** bölümüne gidin ve aşağıdakileri ekleyin:

   
    FIREBASE_USERNAME
    Yukarıda eklenen Firebase kullanıcısı (e-posta adresi).
    FIREBASE_PASSWORD
    Yukarıda eklenen Firebase kullanıcı parolası.
    FIREBASE_CONFIG
    Firebase uygulamasının JSON dizesi olarak yapılandırması.
   

> :::tip
> Yapılandırmanın, uygulama tarafından okunabilir olması için geçerli bir JSON dizgisi olması gerekir.
> :::

Yapılandırmanın, uygulama tarafından okunabilir olması için geçerli bir JSON dizgisi olması gerekir. Ayarlama sırasında verilen kod örneği şu şekilde görünüyorsa:

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

Dizginin değerini şu şekilde ayarlamanız gerekecektir (boşlukların ve yeni satırların gerekli olmadığını not ederek):

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

---

## Firebase'e Bağlanan Kodu Yazın

İlk olarak, Firebase'in Deploy altında çalışması için ihtiyaç duyduğu `XMLHttpRequest` polyfill'ini ve Firebase kimlik doğrulamasının oturum açan kullanıcıları sürdürebilmesi için `localStorage` için bir polyfill'i ithal edeceğiz:

```js
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
```

> ℹ️ Bu eğitimin yazıldığı dönemde, paketlerin mevcut sürümlerini kullanıyoruz. Güncel sürümlerin durumu kontrol edilmelidir.

Deploy, birçok web standart API'sine sahip olduğundan, deploy altında Firebase için web kütüphanelerini kullanmak en iyisidir. Şu anda v9 hala beta aşamasındadır, bu nedenle v8 kullanacağız:

```js
import firebase from "https://esm.sh/firebase@9.17.0/app";
import "https://esm.sh/firebase@9.17.0/auth";
import "https://esm.sh/firebase@9.17.0/firestore";
```

Artık Firebase uygulamamızı ayarlamamız gerekiyor. Daha önce ayarladığımız çevre değişkenlerinden yapılandırmayı alacağız ve kullanacağımız Firebase bölümlerine referans alacağız:

```js
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

Tamam, hemen hemen işimizi bitirdik. Şimdi middleware uygulamamızı oluşturup ithal ettiğimiz `localStorage` middleware'ini eklememiz gerekiyor:

```js
const app = new Application();
app.use(virtualStorage());
```

Ve ardından kullanıcıyı kimlik doğrulamak için middleware eklememiz gerekiyor. Bu eğitimde, kullanıcı adını ve parolasını ayarlayacağımız çevre değişkenlerinden alıyoruz, ancak bu, kullanıcı oturum açmadıysa kullanıcıyı bir oturum açma sayfasına yönlendirmek için kolayca uyarlanabilir:

```js
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

---

## Uygulamayı Deno Deploy'a Dağıtın

Uygulamanızı yazmayı tamamladıktan sonra, Deno Deploy üzerinde dağıtabilirsiniz.

Bunu yapmak için, proje sayfanıza geri dönün `https://dash.deno.com/projects/`.

Dağıtmak için birkaç seçenek görmelisiniz:

- `Github entegrasyonu`
- `deployctl`
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

> :::warning
> Bir yapı adı eklemek istemiyorsanız, Github entegrasyonunu seçmenizi öneririz.
> :::

Deno Deploy üzerinde dağıtım yapmak için farklı yollar ve farklı yapılandırma seçenekleri hakkında daha fazla bilgi için `buradan` okuyun.