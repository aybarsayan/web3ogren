---
title: Akış borusu
description: CSV Ayrıştır - Node.js akış borusu API'sinden nasıl yararlanılacağını öğrenin. Bu belgede, `pipe` işlevinin nasıl kullanılacağını ve verilerin nasıl akış borusuna bağlanacağını keşfedeceksiniz.
keywords: [csv, ayrıştır, ayrıştırıcı, örnek, tarif, akış, senkron, boru, oku, yaz]
---

# Birden fazla akışı bağlamak için boru kullanma

[Akış API'sinin](https://nodejs.org/api/stream.html) bir parçası olan [`pipe` işlevi](https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options), birden fazla akışı bağlamak için kullanılan değerli bir araçtır. Bu işlev, bir `stream.Readable` kaynağını bir `stream.Writable` hedefine bağlamak için tasarlanmıştır.

> "Pipe işlevi, akışları yönetmek ve verileri yönlendirmek için önemli bir bileşendir."  
> — Node.js Belgeleri

[Pipe örneği](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/recipe.pipe.js) bir dosyayı okur, içeriğini ayrıştırır, dönüştürür ve sonucu standart çıktıya yazdırır.

:::tip 
Her zaman akışların birbirine bağlanmasının işlemlerinizi daha verimli hale getireceğini unutmayın.
:::

Bu örnek, `node samples/recipe.pipe.js` komutuyla mevcuttur.


Yardımcı Bilgiler

Aşağıdaki kaynaklar, akış borusu kullanan projelerinizde size kolaylık sağlayabilir:

- Node.js Akış API'si resmi belgeleri
- CSV Ayrıştırma kütüphanesi dökümantasyonu



`embed:packages/csv-parse/samples/recipe.pipe.js`