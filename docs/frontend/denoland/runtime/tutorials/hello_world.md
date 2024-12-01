---
title: "Hello World"
description: Deno, JavaScript ve TypeScript için güvenli bir çalışma zamanı sağlar. Bu içerik, Deno ile basit bir "Hello World" örneği oluşturmayı ve bir Deno projesi başlatmayı öğretir.
keywords: [Deno, JavaScript, TypeScript, çalışma zamanı, kod çalıştırma, proje yapısı]
---

Deno, JavaScript ve TypeScript için güvenli bir çalışma zamanıdır.

Bir çalışma zamanı, kodunuzun çalıştığı ortamdır. Programlarınızın çalışması için gerekli altyapıyı sağlar; bellek yönetimi, I/O işlemleri ve çevresel kaynaklarla etkileşim gibi şeyleri yönetir. Çalışma zamanı, yüksek seviyeli kodunuzu (JavaScript veya TypeScript) bilgisayarın anlayabileceği makine talimatlarına çevirme sorumluluğuna sahiptir.

:::info
JavaScript’i bir web tarayıcısında (Chrome, Firefox veya Edge gibi) çalıştırdığınızda, bir tarayıcı çalışma zamanını kullanıyorsunuz.
:::

Tarayıcı çalışma zamanları, tarayıcı ile sıkı bir şekilde ilişkilidir. Belge Nesne Modeli (DOM) ile manipülasyon, olayları yönetme, ağ istekleri yapma ve daha fazlası için API'ler sağlar. Bu çalışma zamanları, izole edilmiş durumdadır; tarayıcının güvenlik model içinde çalışırlar. Tarayıcı dışındaki kaynaklara, dosya sistemi veya ortam değişkenleri gibi, erişemezler.

Kodunuzu Deno ile çalıştırdığınızda, JavaScript veya TypeScript kodunuzu doğrudan bilgisayarınızda, tarayıcı bağlamı dışında çalıştırmış olursunuz. Bu nedenle, Deno programları dosya sistemi, ortam değişkenleri ve ağ soketleri gibi ana bilgisayardaki kaynaklara erişebilir.

Deno, JavaScript ve TypeScript kodunu çalıştırmak için sorunsuz bir deneyim sunar. **İster JavaScript'in dinamik doğasını tercih edin, ister TypeScript'in tür güvenliğinden yararlanın, Deno sizin için uygun bir çözüm sunmaktadır.**

---

## Bir script çalıştırma

Bu eğiticide, Deno kullanarak hem JavaScript hem de TypeScript'te basit bir "Hello World" örneği oluşturacağız.

:::tip
Bir kelimenin ilk harfini büyük yapan bir `capitalize` işlevi tanımlayacağız.
:::

Ardından, büyük harfle yazılmış isim ile bir selam mesajı döndüren bir `hello` işlevi tanımlayacağız. Son olarak, `hello` işlevini farklı isimlerle çağırıp çıktıyı konsola yazdıracağız.

### JavaScript

Öncelikle, `hello-world.js` adında bir dosya oluşturun ve aşağıdaki kodu ekleyin:

```js title="hello-world.js"
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name) {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));
```

Scripti `deno run` komutunu kullanarak çalıştırın:

```sh
$ deno run hello-world.js
Hello John
Hello Sarah
Hello Kai
```

### TypeScript

Bu TypeScript örneği, yukarıdaki JavaScript örneğiyle tamamen aynıdır; yalnızca ek tür bilgilerini içeriyor.

`hello-world.ts` adında bir dosya oluşturun ve aşağıdaki kodu ekleyin:

```ts title="hello-world.ts"
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name: string): string {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));
```

TypeScript scriptini `deno run` komutunu kullanarak çalıştırın:

```sh
$ deno run hello-world.ts
Hello John
Hello Sarah
Hello Kai
```

---

## Bir proje başlatma

Gördüğünüz üzere, `deno run` ile scriptleri doğrudan çalıştırmak mümkünken, daha büyük projeler için bir proje yapısı oluşturmanız önerilir. Bu şekilde kodunuzu organize edebilir, bağımlılıkları yönetebilir, script görevleri tanımlayabilir ve testleri daha kolay çalıştırabilirsiniz.

Aşağıdaki komutu çalıştırarak yeni bir proje başlatın:

```sh
deno init my_project
```

`my_project`, projenizin adıdır. `Proje yapısı hakkında daha fazla bilgi edinebilirsiniz`.

### Projenizi çalıştırın

Proje dizinine gidin:

```sh
cd my_project
```

Ardından, `deno task` komutunu kullanarak projeyi doğrudan çalıştırabilirsiniz:

```sh
deno task dev
```

Yeni projenizdeki `deno.json` dosyasına bir göz atın. **"tasks" alanında bir `dev` görevi görmelisiniz.**

```json title="deno.json"
"tasks": {
  "dev": "deno run --watch main.ts"
},
```

`dev` görevi, projeyi geliştirme modunda çalıştıran yaygın bir görevdir. Gördüğünüz gibi, değişiklik yapıldığında script otomatik olarak yeniden yüklemek için `--watch` bayrağıyla `main.ts` dosyasını çalıştırır. Bunu görmek için `main.ts` dosyasını açıp bir değişiklik yapabilirsiniz.

### Testleri çalıştırın

Proje dizininde şunu çalıştırın:

```sh
deno test
```

Bu, projedeki tüm testleri çalıştırır. `Deno'da test etme hakkında daha fazla bilgi edinebilirsiniz` ve testleri biraz daha ayrıntılı olarak bir sonraki eğitimde ele alacağız. **Şu anda, `main.ts` içindeki `add` işlevini test eden bir test dosyanız var:** `main_test.ts`.

### Projenizi genişletme

`main.ts` dosyası, uygulamanız için giriş noktasıdır. Burada ana program mantığınızı yazacaksınız. Projenizi geliştirirken varsayılan toplama programını kaldırıp kendinize ait kodunuzla değiştireceksiniz. Örneğin, bir web sunucusu oluşturuyorsanız, bu noktada yönlendirmelerinizi ayarlayıp istekleri işleyebilirsiniz.

:::note
Başlangıç dosyalarının ötesinde, kodunuzu organize etmek için muhtemelen ek modüller (dosyalar) oluşturacaksınız. İlgili işlevselliği ayrı dosyalara gruplandırmayı düşünün.
:::

Deno'nun `ES modüllerini desteklediğini` unutmayın, böylece kodunuzu yapılandırmak için import ve export ifadelerini kullanabilirsiniz.

---

**Bir deno projesi için örnek dizin yapısı:**

```sh
my_project/
├── deno.json
├── main.ts
├── main_test.ts
├── routes/
│   ├── home.ts
│   ├── about.ts
├── services/
│   ├── user.ts
│   ├── post.ts
└── utils/
    ├── logger.ts
    ├── logger_test.ts
    ├── validator_test.ts
    └── validator.ts
```

Bu tür bir yapı, projenizi temiz tutar ve dosyaları bulmayı ve yönetmeyi kolaylaştırır.

🦕 **Tebrikler!** Artık hem JS hem de TS'de basit bir script oluşturma ve bunu `deno run` komutuyla Deno'da çalıştırma, ayrıca `deno init` ile tamamen yeni bir proje oluşturma hakkında bilgi sahibisiniz. Deno'nun basitliği teşvik ettiğini ve karmaşık yapı araçlarından kaçındığını unutmayın. Projenizi modüler, test edilebilir ve düzenli tutun. Projeniz geliştikçe, yapıyı ihtiyaçlarınıza göre adapte edin. Ve en önemlisi, Deno'nun yeteneklerini keşfederken eğlenin!