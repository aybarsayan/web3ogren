---
title: "Dil Sunucusu Entegrasyonu"
description: "Deno CLI dil sunucusunun entegrasyonu hakkında bilgi sağlayan bu sayfa, kullanıcıların editörleri aracılığıyla Deno ile akıllı bir düzenleme deneyimi yaşamalarını sağlar. Ayarlar, komutlar, istekler ve bildirimler ile ilgili detaylı bilgiler içermektedir."
keywords: [Deno, dil sunucusu, LSP, entegrasyon, ayarlar, komutlar, bildirimler]
---

:::tip
Deno'nun LSP'sini çeşitli editörlerle nasıl kullanacağınıza dair bilgi arıyorsanız, `Ortamınızı ayarlama sayfasına` göz atın.
:::

Deno CLI, akıllı bir düzenleme deneyimi sağlayan ve Deno ile birlikte gelen diğer araçlara kolayca erişim imkanı sunan yerleşik bir dil sunucusu ile birlikte gelir. Çoğu kullanıcı için, dil sunucusu, `Visual Studio Code` veya `diğer editörler` gibi bir editör aracılığıyla kullanılacaktır.

Bu sayfa, dil sunucusuna entegrasyon oluşturanlar veya Deno için akıllı bir şekilde entegre olan bir paket kaydı sağlayanlar için tasarlanmıştır.

Deno Dil Sunucusu, özellikle kodun _Deno_ görünümünü sağlamak için tasarlanmış [Dil Sunucusu Protokolü](https://microsoft.github.io/language-server-protocol/) için bir sunucu uygulaması sunar. Komut satırına entegre edilmiştir ve `lsp` alt komutuyla başlatılabilir.

## Yapı

Dil sunucusu başlatıldığında, dil sunucusunun tüm durumunu tutan bir `LanguageServer` örneği oluşturulur. Ayrıca, istemcinin Dil Sunucusu RPC protokolü aracılığıyla çağırdığı tüm yöntemleri tanımlar.

## Ayarlar

Dil sunucusu, bir çalışma alanı için bir dizi ayarı destekler:

- `deno.enable`
- `deno.enablePaths`
- `deno.cache`
- `deno.certificateStores`
- `deno.config`
- `deno.importMap`
- `deno.internalDebug`
- `deno.codeLens.implementations`
- `deno.codeLens.references`
- `deno.codeLens.referencesAllFunctions`
- `deno.codeLens.test`
- `deno.suggest.completeFunctionCalls`
- `deno.suggest.names`
- `deno.suggest.paths`
- `deno.suggest.autoImports`
- `deno.suggest.imports.autoDiscover`
- `deno.suggest.imports.hosts`
- `deno.lint`
- `deno.tlsCertificate`
- `deno.unsafelyIgnoreCertificateErrors`
- `deno.unstable`

:::info
Ve dil sunucusu tarafından her kaynak bazında desteklenen ayarlar bulunmaktadır:
- `deno.enable`
- `deno.enablePaths`
- `deno.codeLens.test`
:::

Deno, bu ayarları dil sunucusu sürecinin çeşitli noktalarında analiz eder. Öncelikle, istemciden `initialize` isteği geldiğinde, `initializationOptions`'ın `deno` seçenekleri ad alanını temsil eden bir nesne olduğu varsayılacaktır. Örneğin, aşağıdaki değer, bu dil sunucusu örneği için kararsız API'lerle birlikte Deno'yu etkinleştirecektir.

```json
{
  "enable": true,
  "unstable": true
}
```

Dil sunucusu, istemcinin `workspaceConfiguration` yeteneğine sahip olup olmadığını değerlendirmek için `workspace/didChangeConfiguration` bildirimini aldığında, istemcinin bu yeteneği belirttiğini kontrol eder. Eğer bu yetenek varsa, çalışma alanı yapılandırması ile birlikte, şu anda dil sunucusu tarafından takip edilen tüm URI'lerin yapılandırmasını içerecek bir `workspace/configuration` isteği gönderilecektir.

Eğer istemcinin `workspaceConfiguration` yeteneği yoksa, dil sunucusu çalışma alanı ayarlarının tüm kaynaklara uygulandığını varsayacaktır.

## Komutlar

Dil sunucusunun istemciye iletebileceği birkaç komut vardır, istemcinin bunları uygulaması beklenir:

### .cache

`deno.cache`, bir modül içine alınan önbelleğe alınmamış bir modül belirleyici olduğunda bir çözümleme kodu eylemi olarak gönderilir. Çözülmüş belirleyiciyi önbelleğe alınması için bir dizeyi içeren bir argüman ile gönderilecektir.

### showReferences

`deno.showReferences`, referansların konumlarını göstermek için bazı kod lenslerinde komut olarak gönderilir. Argümanlar, komutun konusu olan belirleyiciyi, hedefin başlangıç konumunu ve gösterilecek referansların konumlarını içerir.

### test

`deno.test`, bazı test kodu lenslerinin bir parçası olarak gönderilir; istemcinin, testin bulunduğu belirleyici ve testin filtre edileceği adı esas alarak bir testi çalıştırması beklenmektedir.

## İstekler

LSP şu anda aşağıdaki özel istekleri desteklemektedir. Bir istemcinin Deno ile iyi bir entegrasyon sağlamak için bunları uygulaması gerekmektedir:

### /cache

`deno/cache`, Deno'ya bir modülü ve tüm bağımlılıklarını önbelleğe almaya teşvik eder. Eğer sadece bir `referrer` geçerse, o modül belirleyicisi için tüm bağımlılıklar yüklenecektir. Eğer `uris` içinde değerler varsa, sadece o `uris` önbelleğe alınacaktır.

:::note
Parametreler beklenmektedir:
```ts
interface CacheParams {
  referrer: TextDocumentIdentifier;
  uris: TextDocumentIdentifier[];
}
```
:::

### performance

`deno/performance`, Deno'nun içsel aletleri için zaman ortalamalarını döndürmek için istekte bulunur. Herhangi bir parametre beklemez.

### reloadImportRegistries

`deno/reloadImportRegistries`, herhangi bir önbelleğe alınmış yanıtı yeniden yükler. Herhangi bir parametre beklemez.

### virtualTextDocument

`deno/virtualTextDocument`, LSP’den sanal bir metin belgesi talep eder; bu, istemcide görüntülenebilen salt okunur bir belgedir. Bu, istemcilerin Deno önbelleğinde remote modüller ve Deno'ya entegre edilmiş TypeScript kütüphane dosyalarına erişmesini sağlar. Deno dil sunucusu, tüm iç dosyaları özel `deno:` şeması altında kodlayacaktır, bu nedenle istemcilerin `deno:` şeması için yapılan tüm talepleri `deno/virtualTextDocument` API'sine yönlendirmeleri gerekmektedir. 

Ayrıca, kullanıcılara LSP'nin durumu hakkında ayrıntıları sağlayan `deno:/status.md` özel URL'sini de destekler.

:::note
Parametreler beklenmektedir:
```ts
interface VirtualTextDocumentParams {
  textDocument: TextDocumentIdentifier;
}
```
:::

### task

`deno/task`, mevcut deno görevlerini döndürmek için bir istek yapar, bkz. `task_runner`. Herhangi bir parametre beklemez.

## Bildirimler

Şu anda sunucudan istemciye gönderilen bir özel bildirim vardır, `deno/registryState`. `deno.suggest.imports.autoDiscover` `true` olduğunda ve bir belgesine eklenen bir ithalatın kökeni `deno.suggest.imports.hosts` içinde açıkça ayarlanmadıysa, köken kontrol edilecektir ve durum bildirim istemciye gönderilecektir.

Bildirim alındığında, eğer `suggestion` parametresi `true` ise, istemci kullanıcıya kökeni etkinleştirme seçeneğini sunmalıdır ve bunu `deno.suggest.imports.hosts` yapılandırmasına eklemelidir. Eğer `suggestion` `false` ise istemci, dil sunucusunun önerilerin desteklenip desteklenmediğini tespit etmeye çalışmasını durdurmak için bunu yapılandırmaya `false` olarak eklemelidir.

:::danger
Bildirim için parametreler:
```ts
interface RegistryStatusNotificationParams {
  origin: string;
  suggestions: boolean;
}
```
:::

## Dil Kimlikleri

Dil sunucusu, aşağıdaki [metin belgesi dil ID'leri](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentItem) için tanılama ve biçimlendirme desteği sunar:

- `"javascript"`
- `"javascriptreact"`
- `"jsx"` _standart dışı, `javascriptreact` ile aynıdır_
- `"typescript"`
- `"typescriptreact"`
- `"tsx"` _standart dışı, `typescriptreact` ile aynıdır_

Dil sunucusu, yalnızca aşağıdaki dil kimlikleri için biçimlendirme desteği sunar:

- `"json"`
- `"jsonc"`
- `"markdown"`

## Test

Deno dil sunucusu, testleri etkinleştirmek için özel bir API seti destekler. Bunlar, [vscode'un Test API'si](https://code.visualstudio.com/api/extension-guides/testing) ile etkileşimde bulunmak için bilgi sağlamaya odaklanmıştır, ancak diğer dil sunucusu istemcileri tarafından benzer bir arayüz sağlamak için de kullanılabilir.

Hem istemci hem de sunucu, deneysel `testingApi` yeteneğini desteklemelidir:

```ts
interface ClientCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

```ts
interface ServerCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

Test API'sini destekleyen bir Deno sürümü, bu yeteneği destekleyen bir istemciyle karşılaştığında, test tespitini yönetmek için kod başlatır ve bunu etkinleştiren bildirimler sunmaya başlar.

Ayrıca, test API yetenekleri etkinleştirildiğinde, test kodu lenslerinin artık istemciye gönderilmeyeceği belirtilmelidir.

### Test ayarları

Dil sunucusunun davranışını değiştiren belirli ayarlar vardır:

- `deno.testing.args` - Testler çalıştırılırken argümanlar olarak sağlanacak bir dize dizisi. Bu, `deno test` alt komutu ile aynı şekilde çalışır.
- `deno.testing.enable` - Test sunucusunu etkinleştiren veya devre dışı bırakan bir bayrak.

### Test bildirimleri

Sunucu, belirli koşullar altında istemciye bildirimler gönderecektir.

#### deno/testModule

Bir test içeren bir modül sunucu tarafından keşfedildiğinde, `deno/testModule` bildirimi ile birlikte `TestModuleParams` yüküyle istemciye bildirimde bulunur.

Deno, şu şekilde yapılandırır:

- Bir modül _n_ test içerebilir.
- Bir test _n_ adım içerebilir.
- Bir adım _n_ adım içerebilir.

Deno, bir test modülünün statik analizini gerçekleştirirken, herhangi bir test ve test adımını tanımlamaya çalışır. Deno'da testlerin dinamik olarak tanımlanması nedeniyle, bunlar her zaman statik olarak tanımlanamaz ve yalnızca modül yürütüldüğünde tanımlanabilir. Bildirim, istemciyi güncellerken her iki durumu da ele almak için tasarlanmıştır. Statik olarak keşfedilen testler için bildirim `kind` `"replace"` olacaktı; yürütme sırasında testler veya adımlar keşfedildiğinde, bildirim `kind` `"insert"` olacaktır.

:::note
Bir test belgesi editörde düzenlenirken, istemciden `textDocument/didChange` bildirimleri alındığında, bu değişikliklerin statik analizi sunucu tarafında gerçekleştirilecektir ve eğer testler değiştiyse, istemcinin bir bildirim alması sağlanacaktır.

Bir istemci `"replace"` bildirimini aldığında, bir test modülü temsilini güvenle "değiştirebilir" ve `"insert"` aldığında, var olan temsilere eklemeye çalışmalıdır.

Test modülleri için `textDocument.uri`, herhangi bir temsil için benzersiz bir kimlik olarak kullanılmalıdır (bu, benzersiz modüle giden dize URL'si olarak). `TestData` öğeleri, benzersiz bir `id` dizesi içerir. Bu `id` dizesi, sunucunun bir testi takip ettiği tanımlayıcı bilgilere ait bir SHA-256 hash'idir.
:::

```ts
interface TestData {
  /** Bu test/adım için benzersiz kimlik. */
  id: string;

  /** Test/adım için görüntüleme etiketi. */
  label: string;

  /** Bu test/adımla ilişkili olabilecek test adımları. */
  steps?: TestData[];

  /** Teste uygulanan metin belgesinin aralığı. */
  range?: Range;
}

interface TestModuleParams {
  /** Testlerle ilişkili metin belgesi tanımlayıcısı. */
  textDocument: TextDocumentIdentifier;

  /** Tanımlanmış testlerin _yeni_ keşfedildiğine dair bir gösterge ve mevcut testlerin yerini almak için. */
  kind: "insert" | "replace";

  /** Test modülü için metin etiketi. */
  label: string;

  /** Bu test modülüne ait bir dizi test. */
  tests: TestData[];
}
```

#### deno/testModuleDelete

Sunucunun izlediği bir test modülü silindiğinde, sunucu `deno/testModuleDelete` bildirimini verecektir. Bildirimi aldığında istemci, test modülünün ve tüm çocuk testlerinin ve test adımlarının temsilini kaldırmalıdır.

```ts
interface TestModuleDeleteParams {
  /** Silinen metin belgesi tanımlayıcısı. */
  textDocument: TextDocumentIdentifier;
}
```

#### deno/testRunProgress

`deno/testRun` istemciden talep edildiğinde, sunucu bu test yürütmesinin ilerlemesini `deno/testRunProgress` bildirimi aracılığıyla destekleyecektir.

İstemci, bu mesajları işlemeli ve herhangi bir kullanıcı arayüzü temsilini güncellemelidir.

Durum değişikliği, `TestRunProgressParams` içindeki `.message.kind` özelliğinde temsil edilmektedir. Durumlar:

- `"enqueued"` - Bir test veya test adımı test için sıraya alınmıştır.
- `"skipped"` - Bir test veya test adımı atlanmıştır. Bu, Deno testinin `ignore` seçeneği `true` olarak ayarlandığında olur.
- `"started"` - Bir test veya test adımı başlamıştır.
- `"passed"` - Bir test veya test adımı geçmiştir.
- `"failed"` - Bir test veya test adımı başarısız olmuştur. Bu, testin kendisindeki bir hata yerine test koşulsundaki bir hatayı belirtmek için tasarlanmıştır; ancak Deno şu anda bu ayrımı desteklememektedir.
- `"errored"` - Test veya test adımı bir hata almıştır. Hakkında daha fazla bilgi `.message.messages` özelliğinde olacaktır.
- `"end"` - Test yürütmesi sona ermiştir.

```ts
interface TestIdentifier {
  /** Mesajın ilgili olduğu test modülü. */
  textDocument: TextDocumentIdentifier;

  /** Testin isteğe bağlı kimliği. Mevcut değilse, mesaj test modülündeki tüm testlere uygulanır. */
  id?: string;

  /** Adımın isteğe bağlı kimliği. Mevcut değilse, mesaj yalnızca teste uygulanır. */
  stepId?: string;
}

interface TestMessage {
  /** Mesajın içeriği. */
  message: MarkupContent;

  /** Beklenen çıktı için isteğe bağlı bir dize. */
  expectedOutput?: string;

  /** Gerçek çıktı için isteğe bağlı bir dize. */
  actualOutput?: string;

  /** Mesajla ilgili isteğe bağlı bir konum. */
  location?: Location;
}

interface TestEnqueuedStartedSkipped {
  /** Belirli bir test veya test adımıyla ilgili gerçekleşen durum değişikliği.
   *
   * - `"enqueued"` - test artık teste alınmak üzere sıraya alınmıştır
   * - `"started"` - test başlamıştır
   * - `"skipped"` - test atlanmıştır
   */
  type: "enqueued" | "started" | "skipped";

  /** Durum değişimi ile ilgili test veya test adımı. */
  test: TestIdentifier;
}

interface TestFailedErrored {
  /** Belirli bir test veya test adımıyla ilgili gerçekleşen durum değişikliği.
   *
   * - `"failed"` - Test doğru bir şekilde çalışmadı, test hatalı
   * - `"errored"` - Test hata aldı.
   */
  type: "failed" | "errored";

  /** Durum değişimi ile ilgili test veya test adımı. */
  test: TestIdentifier;

  /** Durum değişimi ile ilgili mesajlar. */
  messages: TestMessage[];

  /** İsteğe bağlı bir süre, başlangıçtan itibaren mevcut duruma kadar. */
  duration?: number;
}

interface TestPassed {
  /** Belirli bir test veya test adımıyla ilgili gerçekleşen durum değişikliği. */
  type: "passed";

  /** Durum değişimi ile ilgili test veya test adımı. */
  test: TestIdentifier;

  /** İsteğe bağlı bir süre, başlangıçtan itibaren mevcut duruma kadar. */
  duration?: number;
}

interface TestOutput {
  /** Test veya test adımı çıktı bilgisi vermiştir/işlem bilgisi vermiştir. */
  type: "output";

  /** Çıktının değeri. */
  value: string;

  /** Eğer varsa, ilgili test veya test adımı. */
  test?: TestIdentifier;

  /** Çıktı ile ilişkilendirilmiş isteğe bağlı bir konum. */
  location?: Location;
}

interface TestEnd {
  /** Test yürütmesi sona ermiştir. */
  type: "end";
}

type TestRunProgressMessage =
  | TestEnqueuedStartedSkipped
  | TestFailedErrored
  | TestPassed
  | TestOutput
  | TestEnd;

interface TestRunProgressParams {
  /** İlerleme mesajının uygulandığı test yürütme kimliği. */
  id: number;

  /** Mesaj */
  message: TestRunProgressMessage;
}
```

### Test istekleri

Sunucu, iki farklı istekle başa çıkar:

#### deno/testRun

Dil sunucusundan bir dizi testi gerçekleştirmesi istenildiğinde, istemci `deno/testRun` isteği gönderir; bu istek, istemciye gelecekteki yanıtlar için kullanılacak test yürütme kimliğini, test yürütmesinin türünü ve dahil veya hariç tutulacak herhangi bir test modülünü veya testini içerir.

Şu anda Deno, yalnızca `"run"` türündeki test yürütmesini desteklemektedir. Hem `"debug"` hem de `"coverage"`, gelecekte desteklenmesi planlanmaktadır.

Dahil edilen herhangi bir test modülü veya testi yoksa, keşfedilen tüm test modül ve testlerinin yürütülmesi gerektiği anlamına gelir. Bir test modülü dahil edilirse, ancak herhangi bir test kimliği verilmezse, o test modülü içindeki tüm testlerin dahil edilmesi gerektiği anlamına gelir. Tüm testler belirlendikten sonra, herhangi bir hariç tutulan test kaldırılır ve yanıt olarak `"enqueued"` haline gelen testlerin çözülmüş seti döndürülür.

Dinamik bir biçimde test adımlarını dahil etmek veya hariç tutmak bu API üzerinden mümkün değildir; çünkü test adımlarının nasıl tanımlandığı ve çalıştırıldığı dinamik bir şekilde gerçekleşir.

```ts
interface TestRunRequestParams {
  /** Gelecek mesajlar için kullanılacak test yürütme kimliği. */
  id: number;

  /** Çalıştırma türü. Şu anda Deno yalnızca `"run"`u destekler. */
  kind: "run" | "coverage" | "debug";

  /** Test yürütmesinden hariç tutulacak test modülleri veya testler. */
  exclude?: TestIdentifier[];

  /** Test yürütmesine dahil edilecek test modülleri veya testler. */
  include?: TestIdentifier[];
}

interface EnqueuedTestModule {
  /** Sıraya alınan test kimliklerinin ilişkili olduğu test modülü. */
  textDocument: TextDocumentIdentifier;

  /** Şu anda test için sıraya alınan test kimlikleri. */
  ids: string[];
}

interface TestRunResponseParams {
  /** Artık test için sıraya alınan test modülleri ve test ID'leri. */
  enqueued: EnqueuedTestModule[];
}
```

#### deno/testRunCancel

Eğer bir istemci mevcut bir test yürütmesini iptal etmek isterse, test kimliği ile birlikte bir `deno/testRunCancel` isteği gönderir. Yanıt geriye `true` dönerse test iptal edilmiştir; `false` dönerse iptal edilmediği anlamına gelir. Test iptal edilirken uygun test ilerleme bildirimleri hâlâ gönderilecektir.

```ts
interface TestRunCancelParams {
  /** İptal edilecek test kimliği. */
  id: number;
}