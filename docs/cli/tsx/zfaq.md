---
title: Sıkça Sorulan Sorular
description: Bu sayfa, __tsx__ ile ilgili sıkça sorulan soruları yanıtlamaktadır. Kullanıcıların karşılaştığı sorunlar ve çözümler hakkında bilgiler sunulmaktadır.
keywords: [tsx, TypeScript, Node.js, hata raporu, geliştirme, ürün kullanımı]
---


# Sıkça Sorulan Sorular

## __tsx__'de ______ nasıl yapabilirim?

__tsx__ ile ilgili soruların yanıtlarını aramak zor olabilir. Ancak, __tsx__ aslında `node` için bir takma ad olduğundan ve TypeScript davranışına uyduğundan, __tsx__'de bir şeyler nasıl yapılacağını sormak en iyi yaklaşım olmayabilir.

Bunun yerine, bu soruları düşünün:
- _"Node.js'de ______ nasıl yapabilirim?"_
- _"TypeScript'te ______ nasıl yapabilirim?"_

:::tip
Sorunuz özellikle __tsx__ ile ilgiliyse, belgelendirme içindeki arama özelliğini kullanabilir veya `soru sorabilirsiniz`.
:::

## __tsx__'de bir hata buldum. Ne yapmalıyım?

Eğer hatanın __tsx__'da olduğunu doğruladıysanız, lütfen __tsx__ GitHub deposunda bir sorun bildirin. Hatanın minimal bir tekrarını içermeyi unutmayın.


	Hata raporu oluştur ↗


## __tsx__'yi kim kullanıyor?

__tsx__, [Node.js](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript#running-typescript-code-with-tsx) ve [TypeScript](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html#im-using-tsx) tarafından TypeScript kodunu çalıştırmak için popüler bir araç olarak kabul edilmektedir. 

Npm indirme istatistikleri ile geniş bir kabul gördüğü gösterilmektedir.

### Şirketler






















### Projeler

















Daha fazla __tsx__ kullanım örneğini bulmak için, [GitHub'da arama yapın](https://github.com/search?q=path%3Apackage.json+%22%5C%22tsx%5C%22%3A+%5C%22%22&type=code).

## __tsx__ ile [`ts-node`](https://github.com/TypeStrong/ts-node) arasındaki fark nedir?

`tsx` ve `ts-node`, TypeScript'i Node.js'de çalıştırmak için iki araçtır ve her biri kullanıcı tercihlerini karşılamak için farklı yaklaşımlar sunar.

### **Kurulum**

- **tsx**: Kurulum gerektirmeden kullanılabilir (örneğin, `npx tsx ./script.ts`) ve herhangi bir bağımlılığı olmadan tek bir ikili dosya olarak gelir.
- **ts-node**: TypeScript veya SWC'nin bağımlılık olarak kurulmasını gerektirir.

### **Yapılandırma**

- **tsx**: Hiçbir `tsconfig.json` dosyası gerekmeden kutudan çıktığı gibi çalışır, bu da başlangıç seviyesindekiler için kolaydır.
- **ts-node**: Başlangıçta bazı ayar ve yapılandırma gerektirebilir.

### **Varsayılanlar**

- **tsx**: Dosya içe aktarımlarına ve Node.js sürümüne dayanan makul varsayılanlar kullanır, bu da bazı `tsconfig.json` ayarlarının gereksinimini azaltır.
- **ts-node**: TypeScript'in varsayılan ayarlarına dayanır, bu da ayarlama gerektirebilir.

### **Modül Desteği**

- **tsx**: CommonJS ve ESM modülleri arasında otomatik olarak uyum sağlar, ESM modülleri için `require()` desteği sunar.
- **ts-node**: Modül desteği sağlar ama bazı senaryolar için yapılandırma gerektirebilir.

### **Sözdizimi ve Özellikler**

- **tsx**: Node.js sürümüne bağlı olarak yeni JS & TS sözdizimi ve özelliklerini destekler ve `tsconfig.json` yolları desteği içerir.
- **ts-node**: TypeScript derleyicisini kullanır ve bazı özellikler için ek ayarlar gerektirebilir.

### **Hız**

- **tsx**: Hızlı derleme için [esbuild](https://esbuild.github.io/faq/#:~:text=typescript%20benchmark) kullanır ve tür kontrolü yapmaz.
- **ts-node**: Varsayılan olarak TypeScript derleyicisini kullanır, daha hızlı performans için SWC derleyicisini kullanma seçeneği vardır.

### **Gözlemci**

Bir DX avantajı olarak, __tsx__ hızlı bir şekilde yineleme yapmanıza yardımcı olmak için `Gözlemci modu` ile birlikte gelir!

Daha detaylı teknik bir karşılaştırma için, `tsx`, `ts-node` ve diğer çalışma zamanları arasında yapılan bu [kapsamlı karşılaştırmaya](https://github.com/privatenumber/ts-runtime-comparison) bakabilirsiniz.

## __tsx__ üretimde kullanılabilir mi/yoksa kullanılmalı mı?

__tsx__'yi üretimde kullanmanın gerekip gerekmediği, belirli ihtiyaçlarınıza ve risk toleransınıza bağlıdır. Kararınızı vermenize yardımcı olacak birkaç nokta:

- __tsx__ aslında bir Node.js geliştirmesidir, bu yüzden genel olarak benzer bir istikrar düzeyi bekleyebilirsiniz.
- __tsx__, TypeScript ve ESM'yi dönüştürmek için [esbuild](https://esbuild.github.io) kullanır. Esbuild birçok üretime uygun araçta benimsenmiştir, ancak teknik olarak henüz kararlı bir sürüme ulaşmamıştır.

Kararınızı yönlendirecek bazı sorular:

- __tsx__'yi üretimde kullanmanın faydaları ve maliyetleri nelerdir? Performans iyileştirmeleri var mı?
- __tsx__, kodunuzu beklediğiniz gibi çalıştırıyor mu? Geliştirme ve üretim ortamları arasında farklılık var mı?
- Bu açık kaynak projeye ve onun bakımcılarına güvenebilir misiniz? Projeyi desteklemek için [destekleme](https://github.com/sponsors/privatenumber/sponsorships?tier_id=416984) konusunu düşünün.

Sonuç olarak, bu kararın kesin olarak verilmesi gerekecek ve bu, belirli üretim gereksinimleriniz ve potansiyel riskler konusundaki rahatlık seviyenize dayalı olacaktır.

---

## Soru sor

__tsx__, [sponsorlar](https://github.com/sponsors/privatenumber/sponsorships?tier_id=416984) için [Tartışmalar](https://github.com/pvtnbr/tsx/discussions) aracılığıyla destek sunmaktadır. Eğer bir sponsorsanız, orada daha fazla soru sormaktan çekinmeyin!


.bug-report {
	@apply
		text-sm
		text-white
		hover:text-white
		bg-blue-500
		hover:bg-blue-600
		;
}

.logos {
	@apply
		flex
		flex-wrap
		gap-x-4
		gap-y-6
		justify-around
		my-4
		py-6
		px-4
		dark:bg-zinc-800;

	& :deep(img) {
		@apply h-10;
	}
}
