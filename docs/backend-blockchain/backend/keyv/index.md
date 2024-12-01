---
title: 'Başlangıç Kılavuzu'
description: Keyv, birden fazla arka planda anahtar-değer depolama için tutarlı bir arayüz sağlar. Bu kılavuz, Keyv'i nasıl kuracağınızı ve kullanacağınızı adım adım açıklamaktadır.
keywords: [Keyv, anahtar-değer depolama, önbellek, Node.js, sıkıştırma, Redis, MongoDB]
---

# Başlangıç Kılavuzu

Keyv, birden fazla arka planda anahtar-değer depolama için tutarlı bir arayüz sağlar. TTL tabanlı süresi dolma desteği ile bir önbellek veya kalıcı bir anahtar-değer deposu olarak kullanılabilir. Aşağıdaki adımları izleyerek başlamanızı sağlayın.

## 1. Bir Proje Klasörü Oluşturun
Projeniz için bir dizin oluşturun.

```sh
mkdir keyv
cd keyv
```
Artık projenizin dizinindesiniz.

---

## 2. Keyv'i Kurun

```sh
npm install --save keyv
```
Varsayılan olarak, her şey bellek içinde depolanır; opsiyonel olarak bir depolama adaptörü de kurabilirsiniz; aşağıdakilerden birini seçin:

```sh
npm install --save @keyv/redis
npm install --save @keyv/valkey
npm install --save @keyv/memcache
npm install --save @keyv/mongo
npm install --save @keyv/sqlite
npm install --save @keyv/postgres
npm install --save @keyv/mysql
npm install --save @keyv/etcd
```

> **Not**: Üçüncü taraf depolama adaptörlerini de kullanabilirsiniz.

Aşağıdakiler, Keyv ile uyumlu üçüncü taraf depolama adaptörleridir:
- [quick-lru](https://github.com/sindresorhus/quick-lru) - Basit "En Son Kullanılan" (LRU) önbellek
- [keyv-file](https://github.com/zaaack/keyv-file) - Keyv için dosya sistemi depolama adaptörü
- [keyv-dynamodb](https://www.npmjs.com/package/keyv-dynamodb) - Keyv için DynamoDB depolama adaptörü
- [keyv-lru](https://www.npmjs.com/package/keyv-lru) - Keyv için LRU depolama adaptörü
- [keyv-null](https://www.npmjs.com/package/keyv-null) - Keyv için Null depolama adaptörü
- [keyv-firestore](https://github.com/goto-bus-stop/keyv-firestore) – Keyv için Firebase Cloud Firestore adaptörü
- [keyv-mssql](https://github.com/pmorgan3/keyv-mssql) - Keyv için Microsoft Sql Server adaptörü
- [keyv-azuretable](https://github.com/howlowck/keyv-azuretable) - Keyv için Azure Table Storage/API adaptörü
- [keyv-arango](https://github.com/TimMikeladze/keyv-arango) - Keyv için ArangoDB depolama adaptörü
- [keyv-momento](https://github.com/momentohq/node-keyv-adaptor/) - Keyv için Momento depolama adaptörü
- [@resolid/keyv-sqlite](https://github.com/huijiewei/keyv-sqlite) - Keyv için yeni bir SQLite depolama adaptörü

---

## 3. Yeni bir Keyv Örneği Oluşturun

Bağlantı dizesini geçirin, eğer uygunsa. Keyv, doğru depolama adaptörünü otomatik olarak yükleyecektir.

```js
// sqlite depolama adaptörünü kullanan örnek Keyv örneği
const keyv = new Keyv('sqlite://path/to/database.sqlite');
```

`Keyv` Parametreleri

| Parametre | Tür | Zorunlu | Açıklama |
|------------|-------------|-------------|-------------|
| uri        | String      | Hayır       | Bağlantı dizesi URI'si. Seçenekler nesnesine options.uri olarak birleştirilir. Varsayılan değer: undefined |
| options    | Object      | Hayır       | Seçenekler nesnesi depolama adaptörüne de geçilir. Kullanılabilir seçeneklerin listesi için aşağıdaki tabloya bakın. |

`options` Parametreleri

| Parametre    | Tür      | Zorunlu | Açıklama |
|--------------|----------|---------|----------|
| namespace    | String   | Hayır   | Geçerli örnek için ad alanı. Varsayılan: 'keyv' |
| ttl          | Number   | Hayır   | Bu varsayılan TTL'dir, .set() üzerinde bir TTL belirterek geçersiz kılınabilir. Varsayılan: undefined |
| compression  | @keyv/compress\-\ | Hayır | Kullanılacak sıkıştırma paketi. Daha fazla ayrıntı için Sıkıştırma bölümüne bakın. Varsayılan: undefined. |
| serialize     | Function | Hayır   | Özel bir serileştirme fonksiyonu. Varsayılan: JSONB.stringify |
| deserialize   | Function | Hayır   | Özel bir serileştirme sonrası işleme fonksiyonu. Varsayılan: JSONB.parse |
| store        | Depolama adaptörü örneği | Hayır | Keyv tarafından kullanılacak depolama adaptörü örneği. Varsayılan: new Map() |
| adapter      | String   | Hayır   | Kullanılacak bir adaptör belirtin. örn. 'redis' veya 'mongodb'. Varsayılan: undefined |

### Örnek - Bağlantı URI'si ile Bir Keyv Örneği Oluşturun
Aşağıdaki örnek, bir `mongodb` bağlantı URI'si ile nasıl bir Keyv örneği oluşturacağınızı gösterir.

```js
const Keyv = require('keyv');

const keyv = new Keyv('mongodb://user:pass@localhost:27017/dbname');

// DB bağlantı hatalarını yönet
keyv.on('error', err => console.log('Bağlantı Hatası', err));
```

> **Not**: Bu adımda, bağlantı hatalarını yönetmek önemlidir.

### Örnek - Üçüncü Taraf Depolama Adaptörü Kullanarak Keyv Örneği Oluşturun

[`quick-lru`](https://github.com/sindresorhus/quick-lru) Map API'sini uygulayan bir üçüncü taraf modüldür.

```js
const Keyv = require('keyv');
const QuickLRU = require('quick-lru');

const lru = new QuickLRU({ maxSize: 1000 });
const keyv = new Keyv({ store: lru });

// DB bağlantı hatalarını yönet
keyv.on('error', err => console.log('Bağlantı Hatası', err));
```

---

## 4. Bazı Anahtar Değer Çiftleri Oluşturun

Yöntem: `set(key, value, [ttl])` - Belirtilen anahtar için bir değer ayarlayın.

| Parametre | Tür    | Zorunlu | Açıklama |
|-----------|--------|---------|----------|
| key       | String | Evet    | Değeri bulmak için kullanılan benzersiz tanımlayıcı. Anahtarlar varsayılan olarak kalıcıdır. |
| value     | Herhangi bir | Evet | Anahtar ile ilişkili veri değeri |
| ttl       | Number | Hayır   | Süre dolma zamanı milisaniye cinsinden |

Aşağıdaki örnek kod, `set` yöntemini kullanarak nasıl bir anahtar-değer çifti oluşturacağınızı gösterir.

```js
const keyv = new Keyv('redis://user:pass@localhost:6379');

// 1000 milisaniye içinde süresi dolacak bir anahtar değer çifti ayarlama
await keyv.set('foo', '1 saniye içinde süresi dolacak', 1000); // true

// Süresi dolmayan bir anahtar değer çifti ayarlama
await keyv.set('bar', 'asla süresi dolmaz'); // true
```

Yöntem: `delete(key)` - Bir girişi siler.

| Parametre | Tür    | Zorunlu | Açıklama |
|-----------|--------|---------|----------|
| key       | String | Evet    | Değeri bulmak için kullanılan benzersiz tanımlayıcı. Anahtar mevcutsa `true`, mevcut değilse `false` döner. |

Bir anahtar değer çiftini silmek için aşağıdaki gibi `delete(key)` yöntemini kullanın:

```js
// 'foo' anahtarı için anahtar değer çiftini sil
await keyv.delete('foo'); // true
```

---

## 5. İleri Düzey - Anahtar Çakışmalarını Önlemek İçin Ad Alanları Kullanın

Anahtar çakışmalarını önlemek ve aynı veritabanını kullanırken yalnızca belirli bir ad alanını temizlemenize olanak tanımak için Keyv örneğinizi adlandırın.

Aşağıdaki örnek kod, 'users' ve 'cache' adında iki ad alanı oluşturur ve her iki ad alanında 'foo' anahtarı kullanarak bir anahtar değer çifti oluşturur, aynı zamanda belirtilen ad alanındaki tüm değerleri silmenin nasıl olduğunu gösterir.

```js
const users = new Keyv('redis://user:pass@localhost:6379', { namespace: 'users' });
const cache = new Keyv('redis://user:pass@localhost:6379', { namespace: 'cache' });

// Her iki ad alanında 'foo' anahtarını kullanarak bir anahtar-değer çifti ayarlama
await users.set('foo', 'users'); // true döner
await cache.set('foo', 'cache'); // true döner

// Bir Değeri Alma
await users.get('foo'); // 'users' döner
await cache.get('foo'); // 'cache' döner

// Belirtilen ad alanındaki tüm değerleri sil
await users.clear();
```

---

## 6. İleri Düzey - Sıkıştırmayı Etkinleştirin

Keyv, hem `gzip` hem de `brotli` yöntemleriyle sıkıştırmayı destekler. Sıkıştırmayı etkinleştirmek için, sıkıştırma paketini kurmanız gerekir:

```sh
npm install --save keyv @keyv/compress-gzip
```

### Örnek - Gzip Sıkıştırmasını Etkinleştirin
Sıkıştırmayı etkinleştirmek için, yapıcıya `compression` seçeneğini geçin.

```js
const KeyvGzip = require('@keyv/compress-gzip');
const Keyv = require('keyv');

const keyvGzip = new KeyvGzip();
const keyv = new Keyv({ compression: KeyvGzip });
```

Ayrıca, sıkıştırma seçeneğine özel bir sıkıştırma fonksiyonu da geçebilirsiniz. Özel sıkıştırma fonksiyonları, resmi sıkıştırma adaptörünün kalıbını takip etmelidir (daha fazla bilgi için aşağıya bakın).

### Kendi Sıkıştırma Adaptörünüzü Mi Oluşturmak İstiyorsunuz?

Harika! Keyv, kolayca genişletilebilecek şekilde tasarlanmıştır. Bu arayüze dayanan resmi sıkıştırma adaptörleri kalıbını takip ederek kendi sıkıştırma adaptörünüzü oluşturabilirsiniz:

```js
interface CompressionAdapter {
	async compress(value: any, options?: any);
	async decompress(value: any, options?: any);
	async serialize(value: any);
	async deserialize(value: any);
}
```

#### Özel Sıkıştırma Adaptörünüzü Test Edin
Arayüze ek olarak, `@keyv/test-suite` kullanarak sıkıştırma test paketimizle test edebilirsiniz:

```js
const {keyvCompresstionTests} = require('@keyv/test-suite');
const KeyvGzip = require('@keyv/compress-gzip');

keyvCompresstionTests(test, new KeyvGzip());
```

---

## 7. İleri Düzey - Modülünüzü Keyv ile Genişletin

Keyv, diğer modüllere önbellek desteği eklemek için kolayca entegre edilebilir.
- Ön bellek varsayılan olarak bellek içinde çalışır ve kullanıcılar ayrıca bir Keyv depolama adaptörü kurup bir bağlantı dizesi veya Map API'sini uygulayan başka bir depolama geçirebilir.
- Modülünüz için `.clear()` çağrısını güvenli bir şekilde yapabilmek için bir ad alanı da ayarlamalısınız.

> **Not**: Önerilen kalıp, modülünüzün seçeneklerinde Keyv'e sıra dışı uygulama verilerini temizlemeden geçecek bir önbellek seçeneği sunmaktır.

### Örnek - Bir Modüle Önbellek Desteği Ekleyin

1. Kullanacağınız depolama adaptörünü kurun, bu örnekte `keyv-redis`
```sh
npm install --save keyv-redis
```
2. Önbelleği bir Keyv örneği tarafından kontrol edilen Modülü tanımlayın
```js
class AwesomeModule {
	constructor(opts) {
		this.cache = new Keyv({
			uri: typeof opts.cache === 'string' && opts.cache,
			store: typeof opts.cache !== 'string' && opts.cache,
			namespace: 'awesome-module'  
		});
	}
}
```

3. Önbellek desteği ile Modülün Bir Örneğini Oluşturun
```js
const AwesomeModule = require('awesome-module');
const awesomeModule = new AwesomeModule({ cache: 'redis://localhost' });