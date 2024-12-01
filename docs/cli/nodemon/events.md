---
title: Etkinlikler
description: Bu belge, nodemon ile çocuk işlemine dayalı etkinliklerin nasıl yönetileceğini açıklamaktadır. Ayrıca, kullanılabilecek komutlar ve durumlar hakkında bilgi verir.
keywords: [nodemon, çocuk işlemi, olaylar, komutlar, yönetim, yapılandırma]
---

# Etkinlikler

nodemon, çocuk işlemine dayalı etkinlikler yayımlayacaktır.

## Komutlar

- yeniden başlat
- yapılandırma:güncelle
- çık

## Durumlar

- başla - çocuk işlem başlamış
- çökme - çocuk işlem çökmesi durumunda (nodemon çıkışı yayımlamayacak)
- çıkış - çocuk işlem temiz bir şekilde çıkmış (yani çökme yok)
- yeniden başlat([ yeniden başlatmayı tetikleyen dosyalar dizisi ]) - çocuk işlem yeniden başlatılmış
- yapılandırma:güncelle - nodemon'un yapılandırması değiştirilmiştir

:::info
Bu komut ve durumları kullanarak nodemon ile çocuk işlemlerinizi etkili bir şekilde yönetebilirsiniz.
:::

## Mesajlar

- log({ tür, mesaj (düz metin kaydı), renk (renk kodlu günlük) }) - nodemon'dan kayıt (çocuk işlemden değil)
- stdout - çocuk işlemden stdout akışı
- stderr - çocuk işlemden stderr akışı
- okunabilir - stdout ve stderr akışları hazır ([örnek](https://github.com/remy/nodemon#pipe-output-to-somewhere-else))

Eğer çocuk işlemin normal stdout ve stderr'ini bastırmak istiyorsanız, akışı manuel olarak stdout/stderr nodemon olayları ile işlemek için, nodemon'a `stdout: false` seçeneğini geçin.

:::tip
Normal akışların bastırılmasını sağlamak için yukarıdaki yöntemi dikkate alınız.
:::

## nodemon olaylarını kullanma

Eğer nodemon gerekli ise, nodemon nesnesinde olaylar bağlanabilir ve yayımlanabilir:

```js
var nodemon = require('nodemon');

nodemon({ script: 'app.js' }).on('start', function () {
  console.log('nodemon başladı');
}).on('crash', function () {
  console.log('script bir sebepten dolayı çöktü');
});

// yeniden başlatmayı zorla
nodemon.emit('restart');

// çıkmayı zorla
nodemon.emit('quit');
```

## nodemon'u çocuk işlem olarak kullanma

Eğer nodemon bir yaratılan işlem ise, o zaman çocuk (nodemon) mesaj
etkinliklerini yayımlayacak ve bu etkinlik argümanı etkinlik türünü içerecektir, ve etkinlikleri yayımlamak yerine, komutu `gönder`irsiniz:

```js
// örnek olarak `spawn` kullanılıyor, `fork` gibi diğer fonksiyonlar da kullanılabilir
// https://nodejs.org/api/child_process.html
const { spawn } = require('child_process');

function spawnNodemon() {
  const cp = spawn('nodemon', ['path/to/file.js', '--watch', 'path/to/watch'], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  });

  return cp;
}

var app = spawnNodemon();

app.on('message', function (event) {
  if (event.type === 'start') {
    console.log('nodemon başladı');
  } else if (event.type === 'crash') {
    console.log('script bir sebepten dolayı çöktü');
  }
});

// yeniden başlatmayı zorla
app.send('restart');

// çıkmayı zorla
app.send('quit');
```

:::note
Çocuk hala `exit` türünde bir `message` olayı yayımlayacak olsa da, çocuk üzerindeki gerçek `exit` olayını dinlemek daha mantıklıdır.
:::

```js
app.on('exit', function () {
  console.log('nodemon kapandı');
});
```