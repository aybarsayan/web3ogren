---
title: "WebSocket ile Chat Uygulaması"
description: WebSocket'lar ile gerçek zamanlı bir sohbet uygulaması oluşturmanın adımlarını öğreneceksiniz. Deno ve WebSocket API kullanarak, istemci ve sunucu arasında iki yönlü iletişimi gerçekleştireceksiniz.
keywords: [WebSocket, sohbet uygulaması, Deno, gerçek zamanlı, API]
---

WebSocket'lar, gerçek zamanlı uygulamalar oluşturmak için güçlü bir araçtır. Sürekli sorgulamaya gerek kalmadan müşteri ve sunucu arasında iki yönlü iletişim sağlar. WebSocket'lar için sık kullanılan bir senaryo, sohbet uygulamalarıdır.

:::tip
Bu eğitimde Deno ve yerleşik `WebSocket API` kullanarak basit bir sohbet uygulaması oluşturacağız. 
:::

Sohbet uygulaması, birden fazla sohbet istemcisinin aynı arka uca bağlanmasına ve grup mesajları göndermesine olanak tanır. Bir istemci bir kullanıcı adı girdiğinde, çevrimiçi diğer istemcilere mesaj göndermeye başlayabilir. Her istemci ayrıca mevcut etkin kullanıcıların listesini görüntüler.

[bitmiş sohbet uygulamasını GitHub'da](https://github.com/denoland/tutorial-with-websockets) görebilirsiniz.

![Chat app UI](../../../images/cikti/denoland/runtime/tutorials/images/websockets.gif)

## Yeni bir proje başlatma

Öncelikle, projeniz için yeni bir dizin oluşturun ve bu dizine geçin.

```sh
deno init chat-app
cd deno-chat-app
```

## Arka Ucu Oluşturma

WebSocket bağlantılarını ve tüm bağlı istemcilere mesajları yayınlayacak arka uç sunucusunu oluşturarak başlayacağız. Sunucumuzu kurmak için [`oak`](https://jsr.io/@oak/oak) ara yazılım çerçevesini kullanacağız; istemciler sunucuya bağlanabilir, mesaj gönderebilir ve bağlı diğer kullanıcılar hakkında güncellemeler alabilir. Ayrıca, sunucu, sohbet istemcisini oluşturan statik HTML, CSS ve JavaScript dosyalarını da sunacaktır.

### Bağımlılıkları İçe Aktarma

Öncelikle gerekli bağımlılıkları içe aktarmamız gerekecek. `deno add` komutunu kullanarak Oak'ı projenize ekleyin:

```sh
deno add jsr:@oak/oak
```

### Sunucuyu Kurma

`main.ts` dosyanıza aşağıdaki kodu ekleyin:

```ts title="main.ts"
import { Application, Context, Router } from "@oak/oak";
import ChatServer from "./ChatServer.ts";

const app = new Application();
const port = 8080;
const router = new Router();
const server = new ChatServer();

router.get("/start_web_socket", (ctx: Context) => server.handleConnection(ctx));

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
  await context.send({
    root: Deno.cwd(),
    index: "public/index.html",
  });
});

console.log("Listening at http://localhost:" + port);
await app.listen({ port });
```

:::info
Sonra, `main.ts` dosyanızla aynı dizinde `ChatServer.ts` adlı yeni bir dosya oluşturun. Bu dosyada WebSocket bağlantılarını yönetme mantığını ekleyeceğiz.
:::

```ts title="ChatServer.ts"
import { Context } from "@oak/oak";

type WebSocketWithUsername = WebSocket & { username: string };
type AppEvent = { event: string; [key: string]: any };

export default class ChatServer {
  private connectedClients = new Map<string, WebSocketWithUsername>();

  public async handleConnection(ctx: Context) {
    const socket = await ctx.upgrade() as WebSocketWithUsername;
    const username = ctx.request.url.searchParams.get("username");

    if (this.connectedClients.has(username)) {
      socket.close(1008, `Kullanıcı adı ${username} zaten alınmış`);
      return;
    }

    socket.username = username;
    socket.onopen = this.broadcastUsernames.bind(this);
    socket.onclose = () => {
      this.clientDisconnected(socket.username);
    };
    socket.onmessage = (m) => {
      this.send(socket.username, m);
    };
    this.connectedClients.set(username, socket);

    console.log(`Yeni istemci bağlandı: ${username}`);
  }

  private send(username: string, message: any) {
    const data = JSON.parse(message.data);
    if (data.event !== "send-message") {
      return;
    }

    this.broadcast({
      event: "send-message",
      username: username,
      message: data.message,
    });
  }

  private clientDisconnected(username: string) {
    this.connectedClients.delete(username);
    this.broadcastUsernames();

    console.log(`İstemci ${username} bağlantıyı kesti`);
  }

  private broadcastUsernames() {
    const usernames = [...this.connectedClients.keys()];
    this.broadcast({ event: "update-users", usernames });

    console.log("Kullanıcı adı listesi gönderildi:", JSON.stringify(usernames));
  }

  private broadcast(message: AppEvent) {
    const messageString = JSON.stringify(message);
    for (const client of this.connectedClients.values()) {
      client.send(messageString);
    }
  }
}
```

Bu kod, yeni bir WebSocket bağlantısı kurulduğunda çağrılan `handleConnection` yöntemini kurar. Oak çerçevesinden bir Context nesnesi alır ve bunu bir WebSocket bağlantısına yükseltir. Kullanıcı adını URL sorgu parametrelerinden çıkarır. Eğer kullanıcı adı zaten alınmışsa (yani, `connectedClients` içinde varsa), uygun bir mesajla soketi kapatır. Aksi takdirde, soketin üzerine kullanıcı adı özelliğini ayarlar, olay işleyicileri atar ve soketi `connectedClients`'a ekler.

> **Anahtar Not**: Soket açıldığında, bağlı kullanıcı adlarının listesini tüm istemcilere gönderen `broadcastUsernames` yöntemini tetikler. Soket kapandığında, bağlantıdan kesilen istemcinin listesinden kaldırılması için `clientDisconnected` yöntemini çağırır.

Soket, `send-message` türünde bir mesaj alındığında, mesajı gönderen kişinin kullanıcı adını da dahil ederek tüm bağlı istemcilere yayınlar.

## Ön Ucu Oluşturma

Metin girişi ve gönder butonu gösteren basit bir UI oluşturacağız ve gönderilen mesajları, sohbet içindeki kullanıcılar listesinin yanında göstereceğiz.

### HTML

Yeni proje dizininizde bir `public` klasörü oluşturun ve içine bir `index.html` dosyası ekleyin, ardından aşağıdaki kodu ekleyin:

```html title="index.html"
<!DOCTYPE html>
<html>
  <head>
    <title>Deno Sohbet Uygulaması</title>
    <link rel="stylesheet" href="/public/style.css" />
    <script defer type="module" src="/public/app.js"></script>
  </head>

  <body>
    <header>
      <h1>🦕 Deno Sohbet Uygulaması</h1>
    </header>
    <aside>
      <h2>Çevrimiçi Kullanıcılar</h2>
      <ul id="users"></ul>
    </aside>
    <main>
      <div id="conversation"></div>
      <form id="form">
        <input
          type="text"
          id="data"
          placeholder="mesaj gönder"
          autocomplete="off"
        />
        <button type="submit" id="send">Gönder ᯓ✉︎</button>
      </form>
    </main>
    <template id="user">
      <li></li>
    </template>
    <template id="message">
      <div>
        <span></span>
        <p></p>
      </div>
    </template>
  </body>
</html>
```

### CSS

Sohbet uygulamanızı biçimlendirmek isterseniz, `public` klasöründe bir `style.css` dosyası oluşturun ve bu [önceden yapılmış CSS](https://raw.githubusercontent.com/denoland/tutorial-with-websockets/refs/heads/main/public/style.css) ekleyin.

### JavaScript

`app.js` adlı bir dosyada istemci tarafı JavaScript'i ayarlayacağız, bunu kurduğumuz HTML'de bağladığımızı göreceksiniz. `public` klasöründe bir `app.js` dosyası oluşturun ve aşağıdaki kodu ekleyin:

```js title="app.js"
const myUsername = prompt("Lütfen adınızı girin") || "Anonim";
const url = new URL(`./start_web_socket?username=${myUsername}`, location.href);
url.protocol = url.protocol.replace("http", "ws");
const socket = new WebSocket(url);

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.event) {
    case "update-users":
      updateUserList(data.usernames);
      break;

    case "send-message":
      addMessage(data.username, data.message);
      break;
  }
};

function updateUserList(usernames) {
  const userList = document.getElementById("users");
  userList.replaceChildren();

  for (const username of usernames) {
    const listItem = document.createElement("li");
    listItem.textContent = username;
    userList.appendChild(listItem);
  }
}

function addMessage(username, message) {
  const template = document.getElementById("message");
  const clone = template.content.cloneNode(true);

  clone.querySelector("span").textContent = username;
  clone.querySelector("p").textContent = message;
  document.getElementById("conversation").prepend(clone);
}

const inputElement = document.getElementById("data");
inputElement.focus();

const form = document.getElementById("form");

form.onsubmit = (e) => {
  e.preventDefault();
  const message = inputElement.value;
  inputElement.value = "";
  socket.send(JSON.stringify({ event: "send-message", message }));
};
```

:::warning
Bu kod, kullanıcıdan bir kullanıcı adı ister, ardından kullanıcı adı bir sorgu parametresi olarak sunucuya WebSocket bağlantısı oluşturur. Sunucudan gelen mesajları dinleyerek bağlı kullanıcıların listesini güncelleyebilir veya sohbet penceresine yeni bir mesaj ekleyebilir.
:::

Ayrıca, kullanıcı formu gönderdiğinde (enter tuşuna basarak veya gönder butonuna tıklayarak), sunucuya mesaj gönderir. Yeni mesajları sohbet penceresinde göstermek için [HTML şablon](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) kullanıyoruz.

## Sunucuyu Çalıştırma

Sunucuyu çalıştırmak için Deno'ya gerekli izinleri vermemiz gerekecek. `deno.json` dosyanızda `dev` görevini güncelleyerek okuma ve ağ erişimine izin verin:

```diff title="deno.json"
-"dev": "deno run --watch main.ts"
+"dev": "deno run --allow-net --allow-read --watch main.ts"
```

Artık [http://localhost:8080](http://localhost:8080/) adresini ziyaret ederseniz bir sohbet oturumu başlatabilirsiniz. Kendinizle sohbet etmek için 2 paralel sekme açabilirsiniz.

![Chat app UI](../../../images/cikti/denoland/runtime/tutorials/images/websockets.gif)

🦕 Artık Deno ile WebSocket'leri kullanarak her türlü gerçek zamanlı uygulamalar oluşturmak için hazırsınız! WebSocket'ler, gerçek zamanlı gösterge panoları, oyunlar, işbirlikçi düzenleme araçları ve daha fazlasını oluşturmak için kullanılabilir! 

:::note
Sohbet uygulamanızı genişletmek için, belki de gönderici tarafından gönderilmiş olan mesajları farklı şekilde biçimlendirmek için mesajalara veri eklemeyi düşünebilirsiniz. 
:::

Ne yapıyorsanız yapın, Deno size WebSocket ile yardımcı olacaktır!