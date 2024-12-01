---
title: Komut satırı arayüzü
description: Deno komut satırı arayüzü (CLI) ile scriptlerinizi çalıştırma, bağımlılık yönetimi ve kod derleme işlemlerine dair ayrıntılı bilgiler. Bu sayfa, Deno CLI'nin kullanımına dair örnekler ve açıklamalar içerir.
keywords: [Deno, CLI, komut satırı, script çalıştırma, bağımlılık yönetimi, bayraklar, TypeScript]
oldUrl:
 - /manual/getting_started/command_line_interface
 - /runtime/manual/getting_started/command_line_interface/
 - /runtime/fundamentals/command_line_interface/
 - /runtime/manual/tools/
---

Deno, bir komut satırı programıdır. Deno komut satırı arayüzü (CLI), scriptleri çalıştırmak, bağımlılıkları yönetmek ve hatta kodunuzu bağımsız çalıştırılabilir dosyalara derlemek için kullanılabilir. Şu ana kadar verilen örneklerle bazı basit komutlarla tanışmış olabilirsiniz. Bu sayfa, Deno CLI hakkında daha ayrıntılı bir genel bakış sağlayacaktır.

:::info
Deno CLI, (`run`, `init` ve `test` gibi) çeşitli alt komutlara sahiptir. Bu alt komutlar, Deno çalışma zamanı ortamında farklı görevleri yerine getirmek için kullanılır. Her alt komutun, davranışını özelleştirmek için kullanılabilecek kendi bayrakları ve seçenekleri (örneğin `--version`) vardır.
:::

Tüm mevcut komutları ve bayrakları görüntülemek için terminalinizde `deno help` alt komutunu çalıştırabilir veya `-h` veya `--help` bayraklarını kullanabilirsiniz.

Tüm alt komutlar ve bayraklar hakkında daha fazla belgeleme için `CLI referans kılavuzuna` göz atın. Aşağıda, birkaç komutun nasıl kullanılacağını ve yapılandırılacağını biraz daha ayrıntılı olarak inceleyeceğiz.

## Bir örnek alt komut - `deno run`

Yerel bir TypeScript veya JavaScript dosyasını, geçerli çalışma dizinine göre yolunu belirterek çalıştırabilirsiniz:

```shell
deno run main.ts
```

> Deno, URL'lerden doğrudan script çalıştırmayı destekler. Bu, kodu ilk önce indirmeden hızlı bir şekilde test etmek veya çalıştırmak için özellikle yararlıdır.  
> — Deno Dokümantasyonu

```shell
deno run https://docs.deno.com/examples/hello-world.ts
```

Bir scripti standart girdi üzerinden geçirmek suretiyle de çalıştırabilirsiniz. Bu, diğer komut satırı araçlarıyla entegre olma veya dinamik olarak script oluşturma için faydalıdır:

```shell
cat main.ts | deno run -
```

## Script argümanlarını geçirme

Script argümanları, komut satırından scriptinizi çalıştırdığınızda geçirebileceğiniz ek parametrelerdir. Bu argümanlar, çalışma zamanı sırasında sağlanan girdi temelinde programınızın davranışını özelleştirmek için kullanılabilir. Argümanlar, script adından **sonra** geçilmelidir.

Bunu test etmek için, geçirdiğimiz argümanları günlüğe kaydedecek bir script oluşturabiliriz:

```ts title="main.ts"
console.log(Deno.args);
```

O scripti çalıştırdığımızda ve ona bazı argümanlar geçirdiğimizde, bunları konsola günlüğe kaydedecektir:

```shell
$ deno run main.ts arg1 arg2 arg3
[ "arg1", "arg2", "arg3" ]
```

## Argüman ve bayrak sıralaması

_Script adından sonra geçen her şey bir script argümanı olarak geçilecektir ve Deno çalışma zamanı bayrağı olarak tüketilmeyecektir._ Bu, aşağıdaki tehlikeye yol açar:

```shell
# İyi. net_client.ts dosyasına ağ izni veriyoruz.
deno run --allow-net net_client.ts

# Kötü! --allow-net Deno.args'a geçti, bir ağ izni hatası fırlatır.
deno run net_client.ts --allow-net
```

## Yaygın bayraklar

Bazı bayraklar birden fazla ilişkili alt komutla birlikte kullanılabilir. Aşağıda bunları tartışıyoruz.

### İzleme modu

Yerleşik dosya izleyicisini etkinleştirmek için `deno run`, `deno test`, `deno compile` ve `deno fmt` komutlarına `--watch` bayrağını verebilirsiniz. İzleyici, kaynak dosyalarda değişiklikler tespit edildiğinde uygulamanızın otomatik olarak yeniden yüklenmesini sağlamaktadır. Bu, geliştirme sırasında faydalıdır, çünkü değişikliklerinizin etkilerini hemen görmenizi sağlar, uygulamayı manuel olarak yeniden başlatmanıza gerek kalmaz.

İzlenen dosyalar, kullanılan alt komuta bağlıdır:

- `deno run`, `deno test` ve `deno compile` için giriş noktası ve giriş noktasının statik olarak içe aktardığı tüm yerel dosyalar izlenecektir.
- `deno fmt` için, komut satırı argümanları (veya belirli dosyalar/dizinler geçilmediyse çalışma dizini) olarak belirtilen tüm yerel dosyalar ve dizinler izlenecektir.

```shell
deno run --watch main.ts
deno test --watch
deno fmt --watch
```

Gözlemlenmekten hariç tutulacak yollar veya desenler sağlamak için `--watch-exclude` bayrağını verebilirsiniz. Sözdizimi `--watch-exclude=path1,path2` şeklindedir. Örneğin:

```shell
deno run --watch --watch-exclude=file1.ts,file2.ts main.ts
```

Bu, file1.ts ve file2.ts'nin izlenmesini hariç tutacaktır.

Bir deseni hariç tutmak için, kabuğunuzun globun genişletmesini engellemek için tırnak içine almaya dikkat edin:

```shell
deno run --watch --watch-exclude='*.js' main.ts
```

### Sıcak Modül Değiştirme modu

Deno'yu çalıştırmak için `--watch-hmr` bayrağını kullanarak sıcak modül değiştirme modunu etkinleştirebilirsiniz. Programı yeniden başlatmak yerine, çalışma zamanı programı yerinde güncellemeye çalışacaktır. Yerinde güncelleme başarısız olursa, program yine de yeniden başlatılacaktır.

```sh
deno run --watch-hmr main.ts
```

Bir sıcak modül değişikliği tetiklendiğinde, çalışma zamanı `detay` nesnesinde `path` özelliği içeren bir `CustomEvent` türünde `hmr` olayını yönlendirecektir. Bu olayı dinleyebilir ve bir modül güncellendiğinde yapmanız gereken ek mantığı yerine getirebilirsiniz (örn. bir WebSocket bağlantısı üzerinden bir tarayıcıya bildirmek).

```ts
addEventListener("hmr", (e) => {
  console.log("HMR tetiklendi", e.detail.path);
});
```

### Bütünlük bayrakları (kilit dosyaları)

Önbelleğe kaynakları indirme yeteneğini etkileyen komutlar: `deno install`, `deno run`, `deno test`, `deno doc` ve `deno compile`.

```sh
--lock <DOSYA>    Belirtilen kilit dosyasını kontrol et
--frozen[=<BOOLEAN>] Kilit dosyası güncel değilse hata verir
```

Bunlar hakkında daha fazla bilgi edinin `burada`.

### Önbellek ve derleme bayrakları

Önbelleği doldurabilen komutları etkiler: `deno install`, `deno run`, `deno test`, `deno doc` ve `deno compile`. Yukarıdaki bayrakların yanı sıra, bu bayraklar modül çözümlemesi, derleme yapılandırması vb. üzerinde etkisi vardır.

```sh
--config <DOSYA>               Yapılandırma dosyasını yükle
--import-map <DOSYA>           İçe aktarma haritası dosyasını yükle
--no-remote                   Uzaktan modülleri çözme
--reload=<CACHE_BLOCKLIST>    Kaynak kodu önbelleğini yenile (TypeScript'i yeniden derle)
--unstable                    Kararsız API'leri etkinleştir
```

### Çalışma zamanı bayrakları

Kullanıcı kodunu çalıştıran komutları etkiler: `deno run` ve `deno test`. Bunlar, yukarıdakilerin yanı sıra, aşağıdakileri içerir.

### Tür kontrolü bayrakları

Kodunuzu (çalıştırmadan) tip kontrolünden geçirmek için şu komutu kullanabilirsiniz:

```shell
> deno check main.ts
```

Kodunuzu çalıştırmadan önce tip kontrolü yapmak için `deno run` komutuna `--check` argümanını kullanabilirsiniz:

```shell
> deno run --check main.ts
```

Bu bayrak, `deno run`, `deno eval`, `deno repl` üzerinde etkilidir. Aşağıdaki tablo, çeşitli alt komutların tip kontrolü davranışını açıklar. Burada "Yerel", yalnızca yerel koddan gelen hataların tip hatalarına neden olacağı anlamına gelir, https URL'lerinden içe aktarılan modüller (uzaktan) rapor edilmeyen tip hataları bulundurabilir. (Tüm modüller için tip kontrolünü açmak için `--check=all` kullanın.)

| Alt Komut      | Tür kontrolü modu |
| -------------- | ------------------ |
| `deno bench`   | 📁 Yerel           |
| `deno check`   | 📁 Yerel           |
| `deno compile` | 📁 Yerel           |
| `deno eval`    | ❌ Hiçbiri         |
| `deno repl`    | ❌ Hiçbiri         |
| `deno run`     | ❌ Hiçbiri         |
| `deno test`    | 📁 Yerel           |

### İzin bayrakları

Bunlar `burada` listelenmiştir.

### Diğer çalışma zamanı bayrakları

Çalışma ortamını etkileyen daha fazla bayrak.

```sh
--cached-only                Uzaktan bağımlılıkların zaten önbellekte olmasını gerektirir
--inspect=<HOST:PORT>        ana makine:port üzerinde denetleyiciyi etkinleştir ...
--inspect-brk=<HOST:PORT>    ana makine:port üzerinde denetleyiciyi etkinleştir ve ...
--inspect-wait=<HOST:PORT>   ana makine:port üzerinde denetleyiciyi etkinleştir ve bekle ...
--location <HREF>            Bazı web API'leri tarafından kullanılan 'globalThis.location' değeri
--prompt                     Gerekli izin verilmediyse istemeyi varsayılan olarak kullan
--seed <NUMBER>              Math.random() için tohum
--v8-flags=<v8-flags>        V8 komut satırı seçeneklerini ayarlayın. Yardım için: ...
```