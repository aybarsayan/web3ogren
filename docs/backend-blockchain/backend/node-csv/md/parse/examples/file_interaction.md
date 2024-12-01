---
title: Dosya sistemi etkileşimi
description: Bu sayfa, UTF-8 CSV dosyalarını okuma ve yazma işlemleri için iki tarif sunmaktadır. Ayrıca, Node.js'in 'fs' modülünün işleyişine ve alternatif kodlama yöntemlerine dair bilgiler içermektedir.
keywords: ['csv', 'ayrıştırma', 'parsers', 'örnek', 'tarif', 'dosya', 'fs', 'oku', 'yaz', 'utf8', 'utf-8', 'bom']
---

# Dosya sistemi etkileşimi

Bu sayfa, nasıl yapılacağını göstermek için 2 tarif sağlamaktadır.

- Bir byte sıralama işareti (BOM) olan UTF-8 dosyasını okumak ve yazmak için `sync` API'sinin kullanılması
- Alternatif bir kodlamayı okumak için `sync` API'sinin kullanılması

:::tip
Node.js'in yerel Dosya Sistemi modülü olan `fs`, bir dosyanın içeriğini okumak için kullanılır. Ayrıştırıcı herhangi bir dosya erişim yöntemi sağlamaz; bu, onun sorumluluğu değildir.
:::

Öncelikle doğru API'yi seçmelisiniz. Bu paket, aynı ayrıştırma algoritması tarafından desteklenen ve aynı seçenekleri destekleyen birden fazla API sunmaktadır. Hangi API'yi seçeceğiniz, bu sayfanın kapsamını kapsamaktadır ve `API bölümü` içinde belgelenmiştir.

## `sync` API'sinin Kullanımı

En kolay yol, `sync API` kullanmaktır. Dosyayı okuyup içeriğini alırsınız. Ardından, bu içeriği ayrıştırıcıya enjekte eder ve sonucu bir kayıtlar dizisi olarak alırsınız. Kayıtlar konsola yazdırılabilir ve her kayıt için bir JSON dosyasına yazılabilir. `bom` seçeneği` veriler kaynağında mevcutsa BOM'u tespit edip kaldırır. 

> Son kod örneği:
> 
> `embed:packages/csv-parse/samples/recipe.file.js`
> 
> — [node-csv GitHub](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/recipe.file.js)

Alternatif olarak, bir `okunabilir dosya akışını` ayrıştırıcı dönüştürme akışına ileterek `Stream API` kullanabilirsiniz. Bu, kendisi de yazılabilir bir akışa yönlendirilmiştir.

## Alternatif kodlama

Ayrıştırıcı, dosya kodlamasıyla müdahale etmeden uyumlu olmalıdır. `fs.readFile`'i çağırırken kodlama özelliğini ikinci argüman olarak geçerek dosya kodlamasını belirtebilirsiniz. İkinci argüman bir dizeyse, bu kaynak dosyanın kodlamasını belirtir.

:::info
Alternatif olarak, ayrıştırıcıyı `encoding` seçeneği ile başlatabilir ve [byte yazmayı](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/recipe.file.utf16le.js) tercih edebilirsiniz.
:::

> Aşağıdaki kod yazıldığı sırada, Node.js'in desteklenen kodlamalar listesi 'utf8', 'ucs2', 'utf16le', 'latin1', 'ascii', 'base64', 'hex' içermektedir.
> 
> `embed:packages/csv-parse/samples/recipe.file.utf16le.js`
> 
> — [node-csv GitHub](https://github.com/adaltas/node-csv/blob/master/packages/csv-parse/samples/recipe.file.utf16le.js)