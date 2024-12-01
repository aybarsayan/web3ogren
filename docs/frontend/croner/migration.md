---
title: "Migration"
description: Bu belge, Croner kütüphanesinin sürümler arası geçiş süreçlerini detaylandırmaktadır. Özellikle yeni sürümlerdeki önemli değişiklikler ve güncellemeler üzerine bilgi vermektedir. 
keywords: [Croner, API, yükseltme, sürüm, Node.js]
nav_order: 4
---

# Migration

---


## Croner'ı Yükseltme

Bu bölüm, önceki sürümlerden Croner'a yükseltme hakkında bilgi vermektedir. Croner, Semantic Versioning (SemVer) standardını takip eder. **Büyük güncellemelerin** yıkıcı değişiklikler yaratabileceğini unutmayın.

### 4.x'den 5.x'e Yükseltme

Sürüm `4.x`'den `5.x`'e geçiş yaptığınızda, en önemli değişiklik ayın günü ve haftanın günü kombinasyonunun yapılma şeklidir. Bu konuyla ilgili daha fazla bilgiyi #53 numaralı soruda bulabilirsiniz.... Yeni mod `legacyMode` olarak adlandırılır ve seçenekleri kullanarak devre dışı bırakılabilir.

### 5.x'den 6.x'e Yükseltme

Sürüm `5.x`'den `6.x`'e geçiş yapmak için, CommonJS ve UMD yapıları dağıtım (dist) klasöründe ayrılmıştır. Birkaç metot adı da daha açıklayıcı hale gelmesi için değiştirilmiştir:

*   `next()` -> `nextRun()`
*   `enumerate()` -> `nextRuns()`
*   `current()` -> `currentRun()`
*   `previous()` -> `previousRun()`
*   `running()` -> `isRunning()`
*   `busy()` -> `isBusy()`

### 6.x'den 7.x'e Yükseltme

Sürüm `7.x`, önemli değişiklikler sunar, bunlar arasında nth haftanın gününü belirleyen `#` tanımlayıcısının getirilmesi bulunmaktadır. Ayrıca, `L`'nin haftanın günü alanındaki işleyiş biçiminde bir modifikasyon vardır. Sürüm `6.x`'de `L`'nin konumlandırılması esneklik içermekteydi: hem `LSUN` hem de `SUNL` ifadesi ayın son pazarını belirtmek için geçerliydi. Ancak sürüm `7.x`'den itibaren `L`, nth haftanın günü belirleyici `#` ile birlikte kullanılmalıdır, şöyle: `SUN#L`.

### 7.x'den 8.x'e Yükseltme

Sürüm `8.x`, Croner API'sinde önemli değişiklikler sunmaz. Ancak, önemli bir değişiklik olarak `18.0`'dan önceki Node.js sürümleri için destek sona ermiştir. **`8.x`'e geçmeden önce ortamınızın Node.js `18.0` veya daha yüksek bir sürümü çalıştırdığından emin olmak kritik öneme sahiptir.** Eğer Node  {
    console.log('Bu iş her gün saat 12:00\'de çalışacak.');
});

job.start();
```

### Adım 3: Testlerinizi Güncelleyin

Eğer kodunuz için testleriniz varsa, bunları Cron yerine Croner'ı kullanacak şekilde güncellemeniz gerekecek. Geçişten sonra işlerin halen beklenildiği gibi çalıştığını test ettiğinizden emin olun.

## node-cron'dan Geçiş

node-cron paketinden Croner'a geçiş yapmak için işte nasıl yapılacağı:

### Croner paketini yükleyin:

Önce, projenizde croner paketini yükleyin:

```bash
npm install croner
```

### İçe aktarma ifadesini güncelleyin:

Sonra, cron için içe aktarma ifadesini croner ile güncelleyin. Okuduğunuz satırı değiştirin:

```ts
const cron = require('node-cron');
```

şu şekilde:

```ts
const cron = require('croner');
```

### Cron işinizi güncelleyin:

Bir cron işinin nasıl taşınacağına dair bir örnek:

```ts
// node-cron
cron.schedule('0 * 14 * * *', () => {
    console.log('Her dakika bir görevi çalıştırıyor');
}, { timezone: "Europe/Oslo" });

// croner
Cron('0 * 14 * * *', { timezone: "Europe/Oslo" }, () => {
    console.log('Her dakika bir görevi çalıştırıyor');
});
```

Bu adımları takip ederek **`node-cron`'dan `croner`'a geçiş yapmanızda sorun yaşamamanız gerekir.**