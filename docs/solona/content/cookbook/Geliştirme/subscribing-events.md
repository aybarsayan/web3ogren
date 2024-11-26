---
title: Etkinliklere Abone Olma
sidebarSortOrder: 4
description: Solana ağında etkinliklere nasıl abone olacağınızı öğrenin.
---

Web soketleri, belirli olayları dinleyebileceğiniz bir pub/sub arayüzü sağlar. Sık güncellemeler almak için tipik bir HTTP uç noktasına belli aralıklarla istek göndermek yerine, bu güncellemeleri yalnızca gerçekleştiği zaman alabilirsiniz.

:::info
Web soketleri, yüksek verimlilik ve gerçek zamanlı veri aktarımı sağlar.
:::

Solana'nın web3
[`Connection`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html)
arka planda bir web soketi uç noktası oluşturur ve yeni bir `Connection` örneği oluşturduğunuzda bir web soketi istemcisini kaydeder (kaynak kodunu
[buradan](https://github.com/solana-labs/solana-web3.js/blob/45923ca00e4cc1ed079d8e55ecbee83e5b4dc174/src/connection.ts#L2100) görebilirsiniz).

`Connection` sınıfı, olay yayımcıları gibi `on` ile başlayan pub/sub yöntemlerini açığa çıkarır. Bu dinleyici yöntemlerini çağırdığınızda, o `Connection` örneğinin web soketi istemcisine yeni bir abonelik kaydeder. 

:::tip
Bu dinleyici yöntemleri, uygulamanızın kullanıcı deneyimini geliştirir.
:::

Aşağıda kullandığımız örnek pub/sub yöntemi
[`onAccountChange`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#onAccountChange) şeklindedir. Geri çağırma, güncellenmiş durum verilerini argümanlar aracılığıyla sağlayacaktır (örneğin,
[`AccountChangeCallback`](https://solana-labs.github.io/solana-web3.js/v1.x/types/AccountChangeCallback.html) olarak görebilirsiniz).

:::warning
Geri çağırma işlevini her zaman doğru şekilde tanımlamanız önemlidir; aksi takdirde beklenmedik davranışlar ortaya çıkabilir.
:::

```typescript filename="subscribe-to-events.ts"
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";

(async () => {
  // Devnet'e yeni bağlantı kurun - devnet'e bağlı web soketi istemcisi burada da kaydedilecek
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Dinlemek için bir test cüzdanı oluşturun
  const wallet = Keypair.generate();

  // Cüzdanı dinlemek için bir geri çağırma kaydedin (ws aboneliği)
  connection.onAccountChange(
    wallet.publicKey,
    (updatedAccountInfo, context) =>
      console.log("Güncellenmiş hesap bilgileri: ", updatedAccountInfo),
    "confirmed",
  );
})();
```

:::note
Bu örnek, cüzdanınızı izlemek ve güncellemeleri almak için basit bir yaklaşımdır.
:::


Ek Bilgi

Web soketleri, performans açısından daha verimli bir yöntem sunar ve veri aktarımını hızlandırır. Bu özellik, özellikle yoğun etkileşimlere sahip uygulamalar için büyük bir avantaj sağlar.

