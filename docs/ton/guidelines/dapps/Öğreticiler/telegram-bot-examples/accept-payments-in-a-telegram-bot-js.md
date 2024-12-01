---
description: Eğitimin sonunda, ürününüz için ödemeleri doğrudan TON'da kabul edebilen güzel bir bot yazacaksınız.
---

# Mantı Satışları için Bot

Bu makalede, TON'da ödeme kabul etmek için basit bir Telegram botu oluşturacağız.

## 🦄 Nasıl görünüyor

Eğitimin sonunda, ürününüz için ödemeleri doğrudan TON'da kabul edebilen güzel bir bot yazacaksınız.

Bot bu şekilde görünecek:

![bot önizleme](../../../../../images/ton/static/img/tutorials/js-bot-preview.jpg)

## 📖 Ne öğreneceksiniz
Şunları nasıl yapacağınızı öğreneceksiniz:
- NodeJS'de grammY kullanarak bir Telegram botu oluşturmak
- Kamu TON Center API ile çalışmak

> Neden grammY kullanıyoruz?  
> Çünkü grammY, JS/TS/Deno üzerinde Telegram botlarının konforlu ve hızlı bir şekilde geliştirilmesi için modern, genç, yüksek seviyeli bir çerçevedir; ayrıca, grammY'nin mükemmel [belgeleri](https://grammy.dev) ve her zaman size yardımcı olabilecek aktif bir topluluğu vardır.

## ✍️ Başlamak için neye ihtiyacınız var
Eğer henüz yüklemediyseniz [NodeJS](https://nodejs.org/en/download/) yükleyin.

Ayrıca bu kütüphanelere ihtiyacınız var:
- grammy
- ton
- dotenv

Terminalde tek bir komut ile bunları yükleyebilirsiniz.
```bash
npm install ton dotenv grammy @grammyjs/conversations
```

## 🚀 Hadi başlayalım!
Projemizin yapısı şöyle görünecek:
```
src
    ├── bot
        ├── start.js
        ├── payment.js
    ├── services 
        ├── ton.js
    ├── app.js
.env
```
* `bot/start.js` & `bot/payment.js` - Telegram botu için işleyicileri içeren dosyalar
* `src/ton.js` - TON ile ilgili iş mantığını içeren dosya
* `app.js` - Botu başlatmak ve başlatmak için dosya

---

Hadi kod yazmaya başlayalım!

## Yapılandırma
`.env` ile başlayalım. İçinde sadece birkaç parametre ayarlamamız gerekiyor.

**.env**
```
BOT_TOKEN=
TONCENTER_TOKEN=
NETWORK=
OWNER_WALLET= 
```

İlk dört satırda değerleri doldurmanız gerekiyor:
- `BOT_TOKEN`, [bir bot oluşturduktan](https://t.me/BotFather) sonra alabileceğiniz Telegram Bot token’ınızdır.
- `OWNER_WALLET`, tüm ödemeleri alacak projenizin cüzdan adresidir. Sadece yeni bir TON cüzdanı oluşturabilir ve adresini kopyalayabilirsiniz.
- `API_KEY`, TON Center'dan alacağınız API anahtarıdır; bunu [@tonapibot](https://t.me/tonapibot) veya [@tontestnetapibot](https://t.me/tontestnetapibot) üzerinden ana ağ ve test ağı için alabilirsiniz.
- `NETWORK`, botunuzun hangi ağda çalışacağıdır - test ağı veya ana ağ

Yapılandırma dosyası için bu kadar, şimdi ilerleyebiliriz!

## TON Center API
`src/services/ton.py` dosyasında, bir işlemin varlığını doğrulamak ve hızlı bir geçiş için ödeme uygulamasına bağlantılar oluşturmak için fonksiyonlar tanımlayacağız.

### En son cüzdan işlemlerini alma

Görevimiz, belirli bir cüzdandan gerekli işlemin mevcut olup olmadığını kontrol etmektir.

Bunu şu şekilde çözeceğiz:
1. Cüzdanımıza alınan son işlemleri alacağız. Neden bizim? Bu durumda, kullanıcının cüzdan adresi hakkında endişelenmemize gerek yok, cüzdanının kendisi olup olmadığını doğrulamamıza gerek yok, bu cüzdanı herhangi bir yerde saklamamıza gerek yok.
2. Sadece gelen işlemlere bakıp sıralayacağız 
3. Tüm işlemleri geçeceğiz ve her seferinde yorum ve miktarın elimizdeki verilerle eşleşip eşleşmediğini kontrol edeceğiz  
4. Sorunumuza çözüm bulduğumuzda 🎉

#### En son işlemleri alma

Eğer TON Center API'sini kullanıyorsak, [belgelerine](https://toncenter.com/api/v2/) başvurabilir ve sorunumuzu ideal şekilde çözen bir yöntem bulabiliriz - [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get)

İşlemleri almak için tek bir parametre yeterlidir - ödemeleri kabul etmek için cüzdan adresi, ancak işlemlerin sayısını 100 ile sınırlamak için limit parametresini de kullanacağız.

Şimdi `EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N` adresi için (bu arada, bu TON Vakfı adresidir) bir test isteği yapmayı deneyelim.
```bash
curl -X 'GET' \
  'https://toncenter.com/api/v2/getTransactions?address=EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N&limit=100' \
  -H 'accept: application/json'
```
Harika, şimdi elimizde ["result"] içinde bir işlem listesi var, şimdi bir işlemi daha yakından inceleyelim.

```json
{
      "@type": "raw.transaction",
      "utime": 1667148685,
      "data": "*veri burada*",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32450206000003",
        "hash": "rBHOq/T3SoqWta8IXL8THxYqTi2tOkBB8+9NK0uKWok="
      },
      "fee": "106508",
      "storage_fee": "6508",
      "other_fee": "100000",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG",
        "destination": "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
        "value": "1000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32450206000002",
        "body_hash": "Fl+2CzHNgilBE4RKhfysLU8VL8ZxYWciCRDva2E19QQ=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "aGVsbG8g8J+Riw=="
        },
        "message": "merhaba 👋"
      },
      "out_msgs": []
    }
```

Bu json dosyasından bizim için faydalı olacak bazı bilgileri anlayabiliriz:

- Bu bir gelen işlem, çünkü "out_msgs" alanı boştur
- Ayrıca, işlemin yorumunu, gönderenini ve işlem miktarını alabiliriz.

Artık bir işlem kontrol edici oluşturmaya hazırız.

### TON ile çalışma

Gerekli TON kütüphanesini dahil ederek başlayalım.
```js
import { HttpApi, fromNano, toNano } from "ton";
```

Şimdi, kullanıcının gerekli işlemi gönderip göndermediğini nasıl kontrol edeceğimizi düşünelim.

Her şey oldukça basit. Sadece cüzdanımıza gelen işlemleri sıralayabiliriz, ve sonra son 100 işlemi geçebiliriz, ve eğer aynı yorum ve miktara sahip bir işlem bulunursa, gerekli işlme bulmuşuz demektir!

Http istemcisini başlatmakla başlayalım, TON ile rahat bir çalışma için.
```js
export async function verifyTransactionExistance(toWallet, amount, comment) {
  const endpoint =
    process.env.NETWORK === "mainnet"
      ? "https://toncenter.com/api/v2/jsonRPC"
      : "https://testnet.toncenter.com/api/v2/jsonRPC";
  const httpClient = new HttpApi(
    endpoint,
    {},
    { apiKey: process.env.TONCENTER_TOKEN }
  );
```
Burada, yapılandırmada hangi ağın seçildiğine bağlı olarak uç nokta URL'sini basitçe üretiyoruz. Ve daha sonra http istemcisini başlatıyoruz.

Artık sahibin cüzdanından son 100 işlemi alabiliriz.
```js
const transactions = await httpClient.getTransactions(toWallet, {
    limit: 100,
  });
```

Ve sadece gelen işlemleri filtreleyebiliriz (eğer işlemin out_msgs'ı boşsa, onu bırakırız)
```js
let incomingTransactions = transactions.filter(
    (tx) => Object.keys(tx.out_msgs).length === 0
  );
```

Artık tüm işlemler üzerinde geçebiliriz, ve eğer yorum ve işlem değeri eşleşirse, true döndürüyoruz.
```js
for (let i = 0; i < incomingTransactions.length; i++) {
    let tx = incomingTransactions[i];
    // Eğer içinde yorum yoksa işlemi atlayın
    if (!tx.in_msg.msg_data.text) {
      continue;
    }

    // İşlem değerini nano'dan dönüştür
    let txValue = fromNano(tx.in_msg.value);
    // İşlem yorumunu al
    let txComment = tx.in_msg.message;

    if (txComment === comment && txValue === value.toString()) {
      return true;
    }
  }

  return false;
```
Not edin ki, değer varsayılan olarak nanotons'tur, bu nedenle 1 milyara bölmemiz gerekiyor veya sadece TON kütüphanesinden `fromNano` yöntemini kullanabiliriz.  
Ve "verifyTransactionExistance" fonksiyonu için bu kadar!

Artık ödeme uygulamasına hızlı bir geçiş sağlamak için bağlantı oluşturma fonksiyonu oluşturabiliriz.
```js
export function generatePaymentLink(toWallet, amount, comment, app) {
  if (app === "tonhub") {
    return `https://tonhub.com/transfer/${toWallet}?amount=${toNano(
      amount
    )}&text=${comment}`;
  }
  return `https://app.tonkeeper.com/transfer/${toWallet}?amount=${toNano(
    amount
  )}&text=${comment}`;
}
```
Tek yapmamız gereken, işlem parametrelerini URL'ye yerleştirmektir. Değerin nano'ya dönüştüğünü unutmadan.

## Telegram botu

### Başlatma

`app.js` dosyasını açın ve ihtiyacımız olan tüm işleyicileri ve modülleri içe aktarın.
```js
import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import {
  startPaymentProcess,
  checkTransaction,
} from "./bot/handlers/payment.js";
import handleStart from "./bot/handlers/start.js";
```

Dotenv modülünü çalıştırarak .env dosyasında ayarladığımız ortam değişkenleri ile rahat bir çalışma yapalım.
```js
dotenv.config();
```

Daha sonra projeyi çalıştıracak bir fonksiyon oluşturuyoruz. Botumuzun herhangi bir hata oluştuğunda durmaması için bu kodu ekliyoruz.
```js
async function runApp() {
  console.log("Uygulama başlatılıyor...");

  // Tüm hataların işleyici, botun durmaması için
  process.on("uncaughtException", function (exception) {
    console.log(exception);
  });
```

Şimdi botu ve gerekli eklentileri başlatıyoruz.
```js
  // Botu başlat
  const bot = new Bot(process.env.BOT_TOKEN);

  // Oturumumuzun başlangıç verilerini ayarlayın
  bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
  // Konuşma eklentisini yükleyin
  bot.use(conversations());

  bot.use(createConversation(startPaymentProcess));
```
Burada, eğitimin başında yaptığımız yapılandırmadan `BOT_TOKEN` kullanıyoruz.  

Botu başlattık ama hala boş. Kullanıcı ile etkileşim kurmak için bazı işlevler eklemeliyiz.
```js
  // Tüm işleyicileri kayıt et
  bot.command("start", handleStart);
  bot.callbackQuery("buy", async (ctx) => {
    await ctx.conversation.enter("startPaymentProcess");
  });
  bot.callbackQuery("check_transaction", checkTransaction);
```
/start komutuna cevap olarak handleStart fonksiyonu çalıştırılacak. Kullanıcı "buy" değerine sahip bir butona tıklarsa, daha önce kaydettiğimiz “konuşmamıza” başlayacağız. Ve "check_transaction" geri çağrısına sahip butona tıkladığımızda checkTransaction fonksiyonu çalıştırılacaktır.

Ve yalnızca botumuzu başlatmak ve başarılı bir başlangıç kaydı çıkartmak kaldı.
```js
  // Botu başlat
  await bot.init();
  bot.start();
  console.info(`Bot @${bot.botInfo.username} çalışıyor`);
```

### Mesaj işleyicileri

#### /start Komutu

/start komut işleyicisi ile başlayalım. Bu fonksiyon, kullanıcı botu ilk kez başlattığında, yeniden başlattığında çağrılacaktır.

```js
import { InlineKeyboard } from "grammy";

export default async function handleStart(ctx) {
  const menu = new InlineKeyboard()
    .text("Mantı satın al🥟", "buy")
    .row()
    .url("Botun çalışma detaylarını açıklayan makale", "docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js");

  await ctx.reply(
    `Merhaba yabancı!  
Dünyanın en iyi Mantı Dükkanına hoş geldiniz <tg-spoiler>ve aynı zamanda TON'da ödemeleri kabul etmenin bir örneğine</tg-spoiler>`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```

Burada önce `grammy` modülünden InlineKeyboard'u içe aktarıyoruz. Ardından, kullanıcıya mantı satın alma teklifi ile birlikte işleyicide bir inline tuş takımı oluşturuyoruz ve bu makaleye bağlantı ekliyoruz (biraz özyineleme burada 😁).  
.row() ise bir sonraki butonu yeni bir satıra aktarır.  
Ardından, oluşturulan anahtar kelimeyle birlikte bir hoş geldin mesajı gönderiyoruz (önemli, mesajımda süslemek için html biçimlendirmesi kullanıyorum).  
Hoş geldin mesajı istediğiniz herhangi bir şey olabilir.

---

#### Ödeme süreci

Her zamanki gibi dosyamıza gerekli içe aktarmalar ile başlayacağız.

```js
import { InlineKeyboard } from "grammy";

import {
  generatePaymentLink,
  verifyTransactionExistance,
} from "../../services/ton.js";
```

Daha sonra, "startPaymentProcess" işleyicisini oluşturacağız; bu, bir butona basıldığında çalıştırmak için `app.js` dosyasında zaten kaydedildi.

Telegram’da inline butona tıkladığınızda dönen bir saat belirir, bu saati kaldırmak için geri dönüş yapıyoruz.
```js
  await ctx.answerCallbackQuery();
```

Ardından, kullanıcıya mantı fotoğrafını göndermemiz, kaç adet mantı satın almak istediğini sormamız gerekiyor. Ve bu sayının girilmesini bekliyoruz.
```js
  await ctx.replyWithPhoto(
    "https://telegra.ph/file/bad2fd69547432e16356f.jpg",
    {
      caption:
        "Satın almak istediğiniz mantı porsiyon sayısını gönderin\nNot: 1 porsiyonun mevcut fiyatı: 3 TON",
    }
  );

  // Kullanıcının sayı girmesini bekleyin
  const count = await conversation.form.number();
```

Şimdi siparişin toplam tutarını hesaplıyoruz ve işlemi yorumlamak için kullanacağımız rastgele bir dize oluşturuyoruz, ardından mantı postfixini ekliyoruz.
```js
  // Toplam maliyeti hesaplayın: porsiyon sayısını 1 porsiyon fiyatıyla çarpın
  const amount = count * 3;
  // Rastgele yorum oluşturun
  const comment = Math.random().toString(36).substring(2, 8) + "mantı";
```

Elde edilen veriyi oturuma kaydediyoruz ki, bu veriyi sonraki işleyicide alabilelim.
```js
  conversation.session.amount = amount;
  conversation.session.comment = comment;
```

Hızlı ödeme için bağlantılar üretiyoruz ve bir inline klavye oluşturuyoruz.
```js
const tonhubPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonhub"
  );
  const tonkeeperPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonkeeper"
  );

  const menu = new InlineKeyboard()
    .url("TonHub'da ödemek için tıklayın", tonhubPaymentLink)
    .row()
    .url("Tonkeeper'da ödemek için tıklayın", tonkeeperPaymentLink)
    .row()
    .text(`Ben ${amount} TON gönderdim`, "check_transaction");
```

Ve aşağıdaki tuşlarla birlikte kullanıcıya rastgele oluşturulmuş bir yorumla, cüzdan adresimize belirli bir miktar göndererek yeni bir işlem gerçekleştirmesini istiyoruz.
```js
  await ctx.reply(
    `
Tamam, tek yapmanız gereken ${amount} TON'u ${process.env.OWNER_WALLET} cüzdanına ${comment} yorumu ile aktarmak.

<i>UYARI: Şu anda ${process.env.NETWORK} üzerinde çalışıyorum</i>

Not: Hızlı bir geçiş yapmak için aşağıdaki butonlara tıklayarak işleminizi onaylayabilirsiniz.`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```

Son olarak, işlemin varlığını kontrol etmek için bir işleyici oluşturmamız gerekiyor.
```js
export async function checkTransaction(ctx) {
  await ctx.answerCallbackQuery({
    text: "Biraz bekleyin, işleminizin varlığını kontrol etmem gerekiyor",
  });

  if (
    await verifyTransactionExistance(
      process.env.OWNER_WALLET,
      ctx.session.amount,
      ctx.session.comment
    )
  ) {
    const menu = new InlineKeyboard().text("Daha fazla mantı al🥟", "buy");

    await ctx.reply("Çok teşekkür ederim. Afiyet olsun!", {
      reply_markup: menu,
    });

    // Oturum verilerini sıfırlayın
    ctx.session.amount = 0;
    ctx.session.comment = "";
  } else {
    await ctx.reply("İşleminizi almadım, bir süre bekleyin");
  }
}
```
Burada yaptığımız tek şey, işlemi kontrol etmek ve mevcutsa kullanıcıya bildirmek, ardından oturum verilerini sıfırlamaktır.

## Botu başlatma

Başlamak için bu komutu kullanın:
```bash
npm run app
```

Eğer botunuz düzgün çalışmıyorsa, kodunuzu [bu repodaki](https://github.com/coalus/DumplingShopBot) kod ile karşılaştırın. Eğer bu da işe yaramazsa, lütfen bana telegram üzerinden yazın. Telegram hesabımı aşağıda bulabilirsiniz.

## Kaynaklar

- TON için [ton-footsteps/58](https://github.com/ton-society/ton-footsteps/issues/58) bağlamında yapıldı
- Coalus tarafından ([Telegram @coalus](https://t.me/coalus), [Coalus GitHub'da](https://github.com/coalus))
- [Bot Kodları](https://github.com/coalus/DumplingShopBot)