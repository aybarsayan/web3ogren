---
title: 'Node.js de Önbellekleme için Keyv Kullanımı Adım Adım Kılavuz'
description: Node.js ile önbellekleme yapmanın adımlarını keşfedin. Keyv ve Redis kullanarak önbellekleme servisi oluşturma sürecini detaylı bir şekilde öğrenin.
keywords: [Node.js, Keyv, önbellekleme, Redis, JavaScript]
---

# Node.js'de Önbellekleme için Keyv Kullanımı: Adım Adım Kılavuz

## 1. Projeyi Kurma
Yeni bir Node.js projesine başlamak için önce projeniz için yeni bir dizin oluşturmanız ve ardından o dizinde yeni bir Node.js projesini başlatmanız gerekir.

```bash
mkdir keyv-cache-demo
cd keyv-cache-demo
npm init -y
```
`npm init -y` komutu, proje dizininizde varsayılan ayarlarla yeni bir `package.json` dosyası oluşturacaktır.

## 2. Keyv ve Bağımlılıklarını Yükleme
Bu adımda, projeniz için Keyv ve bir Keyv depolama adaptörü yükleyeceksiniz. Bu örnek için, depolama arka ucu olarak Redis'i kullanacağız.

```bash
npm install cacheable @keyv/redis --save
```
Keyv, Redis, MongoDB, PostgreSQL gibi çeşitli depolama adaptörlerini destekler. Proje gereksinimlerinize en uygun olanı seçmekten çekinmeyin.

:::tip
Keyv kullanırken farklı depolama çözümleri arasında seçim yaparken, projenizin ihtiyaçlarını göz önünde bulundurmayı unutmayın.
:::

## 3. Önbellekleme Servisi Örneği Oluşturma
Bu adımda, Keyv kullanarak basit bir önbellekleme servisi oluşturacağız.

Proje dizininizde `cacheService.js` adında yeni bir dosya oluşturun ve bu dosyaya aşağıdaki kodu ekleyin.

```javascript
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

// Redis'i depolama arka ucu olarak kullanarak Keyv'i başlat
const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({ secondary, ttl: '4h' }); // varsayılan yaşam süresi 4 saat olarak ayarlandı

// Kullanım
async function fetchData() {
  const key = 'myData';
  let data = await cache.get(key);
  if (!data) {
    data = await getMyData(); // Verilerinizi getiren fonksiyon
    await cache.set(key, data, 10000); // 10 saniye için önbelleğe al
  }
  return data;
}
```
:::info
Bu kod parçası, veri önbelleklemenin temel prensiplerini uygulamanıza yardımcı olacaktır.
:::

> **Önemli Not:** Keyv ve Redis ile çalışırken, bağlantı bilgilerinizin güvenliğini sağlamayı unutmayın.
> — Öğrenci


Kodun Açıklaması
Bu örnek, Redis'i kullanarak önbellek verilerini nasıl yönetebileceğinizi göstermektedir. 


---

Daha fazla bilgi ve derinlemesine öğrenme için proje belgelerini kontrol edin.