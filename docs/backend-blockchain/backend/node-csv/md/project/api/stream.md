---
title: Akış
description: CSV - Node.js akış boru API'sini CSV ile nasıl kullanacağınızı öğrenin. Bu kılavuz, veri akışını yönetmek için Node.js akış API'sinin nasıl kullanılacağına dair temel bilgileri sunmaktadır.
keywords: [csv, akış, boru, asenkron, api, örnek]
sort: 3.1
---

# Node.js akış API'si

Node.js akış API'si, **ölçeklenebilir** ve veri akışı üzerinde en yüksek kontrolü sunar.

## Boru API'sini kullanma

Node.js içindeki borular, [akış API'si](https://nodejs.org/api/stream.html) tarafından sağlanan yerel bir işlevdir. Bir sürecin çıktısı, burada bir akış okuyucu, bir sonraki sürecin girişi olarak, burada bir akış yazıcı, yönlendirilir.

:::note
Borular, akış verilerini yönlendirmek için güçlü bir yöntemdir ve performans açısından oldukça etkilidir.
:::

[boru örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv/samples/pipe.js) oldukça okunabilirken aynı zamanda ölçeklenebilir:

`embed:packages/csv/samples/pipe.js` 

## Yerel akış işlevlerini kullanma

Yerel akış işlevleri, **esneklik** sağlar ancak daha ayrıntılı ve yazması daha zor olma maliyeti vardır. 

:::warning
Akışları yönetirken hata yönetimine dikkat edin; akışlar asenkron çalıştığı için hata ayıklama zorluğu yaratabilir.
:::

Veriler, `stream.read` işlevi ile `readable` olayında tüketilir. Ardından `stream.write` işlevini çağırarak yazılır. 

:::tip
Bir akış oluştururken ve kullanırken, her zaman olay dinleyicileri ekleyerek akışın durumunu yönetin.
:::

[akış örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv/samples/stream.js), her paketi nasıl başlatacağınızı ve nasıl bağlayacağınızı gösterir.

`embed:packages/csv/samples/stream.js`