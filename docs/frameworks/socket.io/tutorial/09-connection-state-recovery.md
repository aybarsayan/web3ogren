---
title: Bağlantı durumu geri yükleme
seoTitle: Bağlantı Durumu Geri Yükleme - Özellikler ve Uygulama
sidebar_position: 6
description: Bu sayfa, bağlantı durumu geri yükleme özelliğinin nasıl çalıştığını ve nasıl uygulandığını açıklamaktadır. Özellikle istemci ve sunucu arasındaki bağlantı kesintilerini nasıl yöneteceğinizi öğrenin.
tags: 
  - bağlantı durumu
  - geri yükleme
  - socket.io
  - web geliştirme
keywords: 
  - bağlantı durumu
  - geri yükleme
  - socket.io
  - web geliştirme
---




Öncelikle, bağlantı kesintilerini, bağlantının kesilmediğini varsayarak halledelim: bu özellik "Bağlantı durumu geri yükleme" olarak adlandırılır.

Bu özellik, sunucu tarafından gönderilen tüm olayları **geçici olarak** saklayacak ve bir istemci yeniden bağlandığında durumunu geri yüklemeye çalışacaktır:

- odalarını geri yüklemek
- kaçırılan olayları göndermek

Sunucu tarafında etkinleştirilmelidir:

```js title="index.js"
const io = new Server(server, {
  // highlight-start
  connectionStateRecovery: {}
  // highlight-end
});
```

Bunu uygulamada görelim:



Yukarıdaki videoda gösterildiği gibi, "gerçek zamanlı" mesaj, bağlantı yeniden kurulduğunda eninde sonunda iletilir.

:::note
"Bağlantıyı Kes" butonu gösterim amacıyla eklenmiştir.
:::


    Kod


  

```html
<form id="form" action="">
  <input id="input" autocomplete="off" /><button>Gönder</button>
  // highlight-start
  <button id="toggle-btn">Bağlantıyı Kes</button>
  // highlight-end
</form>

<script>
  // highlight-start
  const toggleButton = document.getElementById('toggle-btn');

  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (socket.connected) {
      toggleButton.innerText = 'Bağlan';
      socket.disconnect();
    } else {
      toggleButton.innerText = 'Bağlantıyı Kes';
      socket.connect();
    }
  });
  // highlight-end
</script>
```

  
  

```html
<form id="form" action="">
  <input id="input" autocomplete="off" /><button>Gönder</button>
  // highlight-start
  <button id="toggle-btn">Bağlantıyı Kes</button>
  // highlight-end
</form>

<script>
  // highlight-start
  var toggleButton = document.getElementById('toggle-btn');

  toggleButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (socket.connected) {
      toggleButton.innerText = 'Bağlan';
      socket.disconnect();
    } else {
      toggleButton.innerText = 'Bağlantıyı Kes';
      socket.connect();
    }
  });
  // highlight-end
</script>
```

  



:::

Harika! Şimdi, sorabilirsiniz:

> Ama bu harika bir özellik, neden varsayılan olarak etkin değil?

Bunun birkaç nedeni var:

- her zaman çalışmıyor, örneğin sunucu aniden çökederse veya yeniden başlatılırsa, istemci durumu kaydedilmeyebilir
- bu özelliği etkinleştirmek, büyütme işlemleri sırasında her zaman mümkün olmayabilir

:::tip
Yine de, bu gerçekten harika bir özellik çünkü geçici bir bağlantı kesilmesinden sonra istemcinin durumunu senkronize etmenize gerek kalmıyor (örneğin, kullanıcı WiFi'den 4G'ye geçerse).
:::

Bir sonraki adımda daha genel bir çözümü keşfedeceğiz.

:::info

  

Bu örneği doğrudan tarayıcınızda çalıştırabilirsiniz:

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/cjs/step6?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/cjs/step6?file=index.js)

  
  

Bu örneği doğrudan tarayıcınızda çalıştırabilirsiniz:

- [CodeSandbox](https://codesandbox.io/p/sandbox/github/socketio/chat-example/tree/esm/step6?file=index.js)
- [StackBlitz](https://stackblitz.com/github/socketio/chat-example/tree/esm/step6?file=index.js)

  

:::