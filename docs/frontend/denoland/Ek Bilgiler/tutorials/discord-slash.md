---
title: "Discord Slash Komutu"
description: Discord'un Slash Komutları özelliğini kullanarak, Deno Deploy üzerinde nasıl hızlı bir şekilde bir "Merhaba Dünya" Slash Komutu oluşturabileceğiniz hakkında bilgi edinin. Bu rehberde adım adım yönergelerle, uygulamanızı Discord sunucunuza nasıl yükleyeceğinizi de öğrenebilirsiniz.
keywords: [Discord, Slash Komutları, Deno Deploy, Geliştirici Portalı, API, Bot]
---

Discord'un yeni bir özelliği olan **Slash Komutları** bulunmaktadır. Bu komutlar, bazı eylemleri gerçekleştirmek için `/` ardından bir komut adı yazarak çalıştırmanıza olanak tanır. Örneğin, bazı kedi gif'leri almak için ` /giphy cats` (yerleşik bir komut) yazabilirsiniz.

:::info
Discord Slash Komutları, birisi komut verdiğinde bir URL'ye istek göndererek çalışır. Slash Komutlarının çalışması için uygulamanızın her zaman açık olması gerekmiyor, bu nedenle Deno Deploy bu tür komutlar oluşturmak için mükemmel bir çözümdür.
:::

Bu yazıda, Deno Deploy kullanarak bir "Merhaba Dünya" Slash Komutu nasıl oluşturabileceğimizi göreceğiz.

## **Adım 1:** Discord Geliştirici Portalında bir uygulama oluşturun

1. [https://discord.com/developers/applications](https://discord.com/developers/applications) adresine gidin (gerekirse Discord hesabınızla giriş yapın).
2. Profil resminizin sol tarafında bulunan **Yeni Uygulama** düğmesine tıklayın.
3. Uygulamanızın adını verin ve **Oluştur** düğmesine tıklayın.
4. **Bot** bölümüne gidin, **Bot Ekle**'ye tıklayın ve ardından **Evet, yap!** ile onaylayın.

Bu kadar. Slash Komutumuzu barındıracak yeni bir uygulama oluşturuldu. Geliştirmemiz boyunca bu uygulama sayfasından bilgiye ihtiyaç duyacağımız için sekmeyi kapatmayın.

## **Adım 2:** Discord uygulamanızla Slash komutunu kaydedin

Biraz kod yazmadan önce, uygulamamızda bir Slash Komutu kaydetmek için bir Discord uç noktasına istek yapmamız gerekiyor.

`BOT_TOKEN` kısmını **Bot** bölümündeki token ile ve `CLIENT_ID` kısmını sayfanın **Genel Bilgiler** bölümündeki ID ile doldurun ve terminalinizde bu komutu çalıştırın.

```sh
BOT_TOKEN='replace_me_with_bot_token'
CLIENT_ID='replace_me_with_client_id'
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"hello","description":"Bir kişiyi selamla","options":[{"name":"name","description":"Kişinin adı","type":3,"required":true}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/commands"
```

:::tip
Bu, bir `hello` adında bir Slash Komutu kaydedecek ve bu komut bir string türünde `name` adında bir parametre alacaktır.
:::

## **Adım 3:** Deno Deploy'de hello world Slash Komutunu oluşturun ve dağıtın

Sonraki adım, Discord'a birisi slash komutunu gönderdiğinde yanıt vermek için bir sunucu oluşturmaktır.

1. https://dash.deno.com/new adresine gidin ve **Oyun Alanı** kartının altında **Oyna** butonuna tıklayın.
2. Bir sonraki sayfada, editörde üst menüdeki **Ayarlar** simgesine tıklayın. Açılan modalda **+ Değişken Ekle** seçeneğini seçin.
3. `DISCORD_PUBLIC_KEY` olarak ANAHTAR'ı girin. Değer, Discord uygulama sayfasındaki **Genel Bilgiler** bölümünde bulunan açık anahtar olmalıdır.
4. Aşağıdaki kodu editöre kopyalayıp yapıştırın:

   ```ts
   // Sift, bir portta dinleyici başlatma gibi detayları soyutlayan küçük bir yönlendirme kütüphanesidir
   // ve belirli bir yol için bir işlev çağıran basit bir fonksiyon (serve) sağlar.
   import {
     json,
     serve,
     validateRequest,
   } from "https://deno.land/x/sift@0.6.0/mod.ts";
   // TweetNaCl, Discord'tan gelen istekleri doğrulamak için kullandığımız bir kriptografi kütüphanesidir.
   import nacl from "https://esm.sh/tweetnacl@v1.0.3?dts";

   // Tüm "/" uç noktasına gelen istekler için home() işleyicisini bazı işlemler yapmak istiyoruz.
   serve({
     "/": home,
   });

   // Discord Slash Komutunun ana mantığı bu işlevde tanımlanmıştır.
   async function home(request: Request) {
     // validateRequest(), bir isteğin POST yöntemi olduğunu ve aşağıdaki başlıklara sahip olduğunu garanti eder.
     const { error } = await validateRequest(request, {
       POST: {
         headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
       },
     });
     if (error) {
       return json({ error: error.message }, { status: error.status });
     }

     // verifySignature(), isteğin Discord'tan gelip gelmediğini doğrular.
     // İsteğin imzası geçerli değilse, 401 döneriz ve bu önemlidir çünkü Discord, doğrulama testimizi denemek için geçersiz istekler gönderir.
     const { valid, body } = await verifySignature(request);
     if (!valid) {
       return json(
         { error: "Geçersiz istek" },
         {
           status: 401,
         },
       );
     }

     const { type = 0, data = { options: [] } } = JSON.parse(body);
     // Discord, uygulamamızı test etmek için Ping etkileşimleri gerçekleştirir.
     // Bir istekte tip 1, bir Ping etkileşimini ifade eder.
     if (type === 1) {
       return json({
         type: 1, // Bir yanıt olarak tip 1, Pong etkileşim yanıt tipi.
       });
     }

     // İsteklerde tip 2 bir ApplicationCommand etkileşimidir.
     // Bu, bir kullanıcının bir komut verdiğini ifade eder.
     if (type === 2) {
       const { value } = data.options.find((option) => option.name === "name");
       return json({
         // Tip 4, kullanıcının girdiği değeri üstte tutarak aşağıdaki mesajla yanıt verir.
         type: 4,
         data: {
           content: `Merhaba, ${value}!`,
         },
       });
     }

     // Geçerli bir Discord isteği burada ulaşmamalıdır, bu nedenle kötü bir istek hatası döneriz.
     return json({ error: "kötü istek" }, { status: 400 });
   }

   /** İsteğin Discord'tan gelip gelmediğini doğrulama. */
   async function verifySignature(
     request: Request,
   ): Promise<{ valid: boolean; body: string }> {
     const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
     // Discord, her istekte bu başlıkları gönderir.
     const signature = request.headers.get("X-Signature-Ed25519")!;
     const timestamp = request.headers.get("X-Signature-Timestamp")!;
     const body = await request.text();
     const valid = nacl.sign.detached.verify(
       new TextEncoder().encode(timestamp + body),
       hexToUint8Array(signature),
       hexToUint8Array(PUBLIC_KEY),
     );

     return { valid, body };
   }

   /** Onaltılık bir dizeyi Uint8Array'e çevirir. */
   function hexToUint8Array(hex: string) {
     return new Uint8Array(
       hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)),
     );
   }
   ```

5. Sunucuyu dağıtmak için **Kaydet ve Dağıt** butonuna tıklayın.
6. Dosya dağıtıldıktan sonra proje URL'sini not edin. Bu, editörün sağ üst köşesinde yer alacak ve `.deno.dev` ile sona erecektir.

## **Adım 4:** Discord uygulamasını URL'miz ile etkileşim uç noktası URL'si olarak yapılandırın

1. Discord Geliştirici Portalında uygulamanız (Greeter) sayfasına geri dönün.
2. **ETKİLEŞİM UÇ NOKTASI URL'Sİ** alanını yukarıdaki Deno Deploy proje URL'si ile doldurun ve **Değişiklikleri Kaydet** butonuna tıklayın.

Uygulama artık hazır. Yükleme aşamasına geçelim.

## **Adım 5:** Slash Komutu'nu Discord sunucunuza yükleyin

`hello` Slash Komutu'nu kullanmak için, Greeter uygulamamızı Discord sunucumuza yüklememiz gerekiyor. İşte adımlar:

1. Discord Geliştirici Portalında Discord uygulama sayfasının **OAuth2** bölümüne gidin.
2. `applications.commands` kapsamını seçin ve aşağıdaki **Kopyala** butonuna tıklayın.
3. Şimdi URL'yi tarayıcınıza yapıştırın ve ziyaret edin. Sunucunuzu seçin ve **Yetkilendir** butonuna tıklayın.

Discord'u açın, `/hello Deno Deploy` yazın ve **Enter** tuşuna basın. Çıkış aşağıdaki gibi bir şey olacaktır.

![Merhaba, Deno Deploy!](../../../images/cikti/denoland/deploy/docs-images/discord-slash-command.png)

Eğitimi tamamladığınız için tebrikler! Hadi harika Discord Slash Komutları oluşturun! Ve bunları **deploy** kanalında [Deno Discord sunucusu](https://discord.gg/deno) ile paylaşmayı unutmayın.