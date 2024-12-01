---
title: "Örnekler"
parent: "Kullanım"
nav_order: 3
description: "Bu sayfa, Cron işlemleri için örnek kodlar sunarak nasıl kullanılacağını açıklamaktadır. Her bölümde farklı işlevleri ve parametreleri gösteren örnekler bulunmaktadır."
keywords: [Cron, JavaScript, zamanlayıcı, programlama, örnekler]
---

# Örnekler

---



{% include multiplex.html %}

### Tarihleri Bulma

:::tip
Aşağıdaki kod, belirli zaman dilimlerinde tarihleri bulmanın yollarını göstermektedir.
:::

```ts
// Gelecek ayı bul
const nextMonth = new Cron("@monthly").nextRun(),
	nextSunday = new Cron("@weekly").nextRun(),
	nextSat29feb = new Cron("0 0 0 29 2 6", { legacyMode: false }).nextRun(),
	nextSunLastOfMonth = new Cron("0 0 0 L * 7", { legacyMode: false }).nextRun(),
    nextLastSundayOfMonth = new Cron("0 0 0 * * L7").nextRun();

console.log("Gelecek ayın ilk günü: " +  nextMonth.toLocaleDateString());
console.log("Gelecek pazar: " +  nextSunday.toLocaleDateString());
console.log("Gelecek cumartesi, 29 Şubat: " +  nextSat29feb.toLocaleDateString());  // 2048-02-29
console.log("Gelecek ayın pazar ile bitişi: " +  nextSunLastOfMonth.toLocaleDateString());
console.log("Gelecek ayın son pazar günü: " +  nextLastSundayOfMonth.toLocaleDateString());
```

### İş Kontrolleri

:::info
Cron işleri için durdurma ve devam ettirmenin nasıl yapıldığını öğrenin.
:::

```ts
const job = new Cron('* * * * * *', (self) => {
	console.log('Bu her saniyede çalışacak. 10. saniyede duracak. 15. saniyede devam edecek. 20. saniyede duracak.');
	console.log('Mevcut saniye: ', new Date().getSeconds());
	console.log('Önceki çalışma: ' + self.previousRun());
	console.log('Gelecek çalışma: ' + self.nextRun());
});

new Cron('10 * * * * *', {maxRuns: 1}, () => job.pause());
new Cron('15 * * * * *', {maxRuns: 1}, () => job.resume());
new Cron('20 * * * * *', {maxRuns: 1}, () => job.stop());
```

### Seçenekler

```ts
import { Cron } from "./dist/croner.js";

const job = new Cron(
	'* * * * *', 
	{
		startAt: "2023-11-01T00:00:00", 
		stopAt: "2023-12-01T00:00:00",
		timezone: "Europe/Stockholm"
	},
	function() {
		console.log('Bu her dakika çalışacak, 2023-11-01 den 2023-12-01 00:00:00 e kadar');
	}
);

console.log('İlk kez ne zaman çalışacak', job.nextRun().toLocaleString());
```

### Aralık

:::warning
Zaman dilimlerini ayarlarken dikkatli olun; yanlış ayarlamalar beklenmeyen sonuçlar verebilir.
:::

```ts
// Özel bir aralıkta, cron ifadesi ile birlikte tetikleme
new Cron('* * 7-16 * * MON-FRI', { interval: 90 }, function () {
	console.log('Bu her 90. saniyede, pazartesiden cumaya 7-16 saatleri arasında tetiklenecektir.');
});
```

### Bağlam Geçirme

```ts
const data = {
	what: "şeyler"
};

new Cron('* * * * * *', { context: data }, (_self, context) => {
	console.log('Bu şeyleri yazdıracak: ' + context.what);
});

new Cron('*/5 * * * * *', { context: data }, (self, context) => {
	console.log('Bundan sonra, diğer şeyler yazdırılacaktır');
	context.what = "diğer şeyler";
	self.stop();
});
```

### Belirli bir tarih/saatte tetikleme

:::note
ISO 8601 formatındaki zaman dizeleri kullanılarak spesifik tarih ve saatte tetikleme yapılabilir.
:::

```ts
// Bir javascript tarihi veya bir ISO 8601 yerel zaman dizesi geçilebilir, bir fonksiyonu bir kez tetiklemek için.
// ISO 8601 zaman dizesinin hangi zaman diliminde olduğunu belirtmek için zaman dilimi seçeneği ile belirtin.
let job = new Cron("2025-01-01T23:00:00",{timezone: "Europe/Stockholm"},() => {
	console.log('Bu 2025-01-01 23:00:00 tarihinde, Avrupa/Stockholm zaman diliminde çalışacak');
});

if (job.nextRun() === null) {
	// İş bir nedenle tetiklenmeyecek
} else {
	console.log("İş şurada tetiklenecek: " + job.nextRun());
}
```

### Zaman dilimi

```ts
let job = new Cron("0 0 14 * * *", { timezone: "Europe/Stockholm" }, () => {
	console.log('Bu her gün 14:00’de Avrupa/Stockholm zaman diliminde çalışacak');
});

if (job.nextRun() === null) {
	// İş bir nedenle tetiklenmeyecek
} else {
	console.log("İş şurada tetiklenecek: " + job.nextRun());
}
```

### İşleri İsimlendirme

Eğer işi `{ name: '...' }` seçeneğini kullanarak bir isim ile sağlarsanız, işin bir referansı dışa aktarılan `scheduledJobs` dizisinde saklanacaktır. 

Eğer bir iş `.stop()` kullanılarak durdurulursa, `scheduledJobs` dizisinden kaldırılacaktır.

```ts
// import { Cron, scheduledJobs } ...

// Kapsamlı iş
(() => {

	// İş için bir isim belirttiğimizde, `scheduledJobs` içinde bir referans tutulacaktır
	const job = new Cron("* * * * * *", { name: "Job1" }, function () {
		console.log("Bu her saniyede çalışacak");
	});

	job.pause();
	console.log("İş durduruldu");

})();

// Başka bir kapsam, 5 saniye gecikti
setTimeout(() => {

	// İşimizi bul
	// - scheduledJobs ayrı olarak { Cron, scheduledJobs } şeklinde içe aktarılabilir
	//   veya Cron.scheduledJobs üzerinden erişilebilir
	const job = scheduledJobs.find(j => j.name === "Job1");

	// Devam ettir
	if (job) {
		if(job.resume()) {
			// Bu gerçekleşecek
			console.log("İş başarıyla devam ettirildi");
		} else {
			console.log("İş bulundu, ancak yeniden başlatılamadı. Bu asla olmamalıdır, çünkü isimli işler `.stop()` kullanıldığında _kaldırılır_.");
		}
	} else {
		console.error("İş bulunamadı");
	}

}, 5000);
```

### Tamamlandığında hareket et

```ts
// Her 5. saniyede bir kez tetiklenen bir işi başlat, en fazla 3 kez çalışsın
const job = new Cron("0/5 * * * * *", { maxRuns: 3 }, (job) => {
    
    // İş yap
    console.log('İş Çalışıyor');

    // Bu son yürütme mi?
    if (!job.nextRun()) {
        console.log('Son yürütme');
    }

});
 
// Hiçbir yürütmenin olmayacağını mı? 
// Bu, maxRuns'ı 0'a ayarladığınızda veya 
// imkansız bir cron ifadesi oluşturduğunuzda tetiklenecektir.
if (!job.nextRun() && !job.previousRun()) {
    console.log('Hiç yürütme planlanmadı');
}
```

### Hata işleme

```ts
// Bir hata işleyici hazırlayın
const errorHandler = (e) => {
	console.error(e);
};

// Her saniyede bir işi başlat
const job = new Cron("* * * * * *", { catch: errorHandler }, (job) => {
	console.log('Bu yazdıracak!');
	throw new Error("Bu hata işleyici tarafından yakalanacak ve yazdırılacak");
	console.log('Bu yazdırılmayacak, ancak iş tetiklenmeye devam edecek');
});
```

### Aşırı çalışma koruması

```ts
// Demo bloklama fonksiyonu
const blockForAWhile = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// (Opsiyonel) Bloklu bir çağrıda tetiklenecek geri çağırma
const protectCallback = (job) => console.log(`Tarih ${new Date().toISOString()} çağrısı, ${job.currentRun().toISOString()} tarihinden başlatılan çağrı tarafından engellendi`);

// protect: aşırı çalışma korumasını etkinleştirmek için ya true ya da bir geri çağırma fonksiyonu olarak ayarlanabilir
new Cron("* * * * * *", { protect: protectCallback }, async (job) => {
    console.log(`${job.currentRun().toISOString()} tarihinde başlatılan çağrı başladı`);
    await blockForAWhile(4000);
    console.log(`${job.currentRun().toISOString()} tarihinde başlatılan çağrı sona erdi ${new Date().toISOString()}`);
});

/* Çıktı
${job.currentRun().toISOString()} tarihinde başlatılan çağrı başladı
${job.currentRun().toISOString()} tarihinde başlatılan çağrı tarafından engellendi
...
${job.currentRun().toISOString()} tarihinde başlatılan çağrı sona erdi
*/