---
title: "Deno & Visual Studio Code"
description: Bu sayfa, Deno uygulamalarını Visual Studio Code ve resmi vscode_deno uzantısı kullanarak geliştirmeyi kapsamaktadır. Kullanıcıların uzantıyı kurma, Deno'yu etkinleştirme ve hata ayıklama gibi konularda bilgilenmelerine yardımcı olur.
keywords: [Deno, Visual Studio Code, vscode_deno, geliştirme, uzantı]
oldUrl:
- /runtime/manual/vscode_deno/
- /runtime/manual/references/vscode_deno/
- /runtime/manual/references/vscode_deno/testing_api/
---

Bu sayfa, Deno uygulamalarını
[Visual Studio Code](https://code.visualstudio.com/) ve resmi
[vscode_deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
uzantısı kullanarak geliştirmeyi kapsamaktadır.

## Kurulum

Deno VS Code uzantısı, Deno CLI ile doğrudan entegre olur ve
`language server protocol` kullanır. Bu, kodunuz hakkında aldığınız bilgilerin, Deno CLI ile çalıştırdığınızda nasıl işleyeceği ile uyumlu olmasını sağlar.

Deno uzantısı, VS Code'daki diğer uzantılar gibi yüklenir. VS Code'un uzantılar sekmesinde `Deno` olarak arama yapın ve **yükle** butonuna tıklayın veya
`burası` uzantı sayfasını açar
ve yükleme seçeneğini seçebilirsiniz.

Uzantıyı ilk kez yüklediğinizde, uzantıya hoş geldiniz diyen bir açılış sayfası almanız gerekir. (Eğer onu kaçırdıysanız veya tekrar görmek istiyorsanız, ⌘ ⇧ P tuşlarına basarak komut paletini açın ve **Deno: Hoş Geldiniz** komutunu çalıştırın.)

## Deno'yu VS Code çalışma alanında etkinleştirme

:::tip
VS Code'da çalışabileceğiniz her projenin bir Deno projesi olmadığını biliyoruz. Varsayılan olarak, VS Code, TypeScript veya JavaScript dosyalarını düzenlerken kullanılan yerleşik bir TypeScript/JavaScript dil servisi ile gelir.
:::

Deno API'leri için destek almak ve Deno CLI'nin modülleri çözme yeteneğine sahip olmak için, çalışma alanında Deno'yu etkinleştirmeniz gerekir. Bunu yapmanın en doğrudan yolu, VS Code
[komut paleti](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)'nden **Deno: Çalışma Alanı Yapılandırmasını Başlat** seçeneğini kullanmaktır.

![screenshot of the command palette with Deno: Initialize Workspace Configuration](../../../images/cikti/denoland/runtime/reference/images/command_palette.png)

Bu komut, çalışma alanı yapılandırmasına `"deno.enable": true` ekleyecektir (çalışma alanı kökü `.vscode/settings.json`). Komut tamamlandığında, Deno çalışma alanının başlatıldığını bildiren bir bildirim alacaksınız.

![screenshot of the notification 'Deno workspace initialized'](../../../images/cikti/denoland/runtime/reference/images/vscode_workspace_initialized.png)

Bu ayarlar (ve diğer ayarlar) VS Code
[ayarlar](https://code.visualstudio.com/docs/getstarted/userinterface#_settings)
paneli aracılığıyla mevcuttur. Panelde ayar **Deno: Etkinleştir** olarak görünmektedir.

:::note
VS Code'un kullanıcı ve çalışma alanı ayarları vardır. Muhtemelen Deno'yu **kullanıcı** ayarlarında etkinleştirmek istemezsiniz, bunun yerine **çalışma alanı** ayarlarında ayarlayın, yoksa varsayılan olarak her çalışma alanı Deno etkinleştirilmiş olacaktır.
:::

### Çalışma alanı klasörü ayarları

Bunlar, bir çalışma alanı klasöründe ayarlanabilecek ayarlardır. Diğer ayarlar şu anda yalnızca çalışma alanına uygulanır:

- `deno.enable` - Deno Dil Sunucusunun etkin olup olmadığını kontrol eder. Etkin olduğunda, uzantı yerleşik VS Code JavaScript ve TypeScript dil hizmetlerini devre dışı bırakır ve bunun yerine Deno dil sunucusunu kullanır. _boolean, varsayılan `false`_
- `deno.enablePaths` - Deno Dil Sunucusunun yalnızca çalışma alanı klasörünün belirli yollarında etkin olup olmadığını kontrol eder. Varsayılan olarak boş bir listeyle başlar.
- `deno.codeLens.test` - Test kod lensinin etkin olup olmadığını kontrol eder. _boolean, varsayılan `true`_
- `deno.codeLens.testArgs` - Bir test kod lensi etkinleştirildiğinde `deno test` komutuna geçirilecek argümanların listesi. _string array, varsayılan `["--allow-all"]`_

Bir proje etkinleştirildiğinde, uzantı doğrudan kurulu Deno CLI'dan bilgi alır. Uzantı ayrıca yerleşik TypeScript/JavaScript uzantısını devre dışı bırakır.

## VS Code çalışma alanında Deno'yu kısmen etkinleştirme

Bir çalışma alanında (veya çalışma alanı klasöründe), Deno'yu etkinleştirmek için alt yollar etkinleştirilebilirken, bu yolların dışındaki kod etkinleştirilmeyecek ve VS Code yerleşik JavaScript/TypeScript dil sunucusu kullanılacaktır. **Deno: Etkinleştir Yollar** ayarını kullanın (veya manuel düzenleme yapıyorsanız `deno.enablePaths`).

Örneğin, aşağıdaki gibi bir projeniz varsa:

```console
project
├── worker
└── front_end
```

Sadece `worker` yolunu (ve alt yollarını) Deno etkinleştirilmiş olarak ayarlamak istiyorsanız, yapılandırmadaki **Deno: Etkinleştir Yollar** listesine `./worker` eklemek isteyeceksiniz.

## Karmaşık Deno projeleri

Bu özellik ile, bazı çalışma alanı klasörlerinin Deno etkinleştirildiği ve bazılarının olmadğı karma bir Deno projesine sahip olabilirsiniz. Bu, bir ön uç bileşenine sahip olabilecek bir proje oluştururken faydalıdır; burada o ön uç kodu için farklı bir yapılandırma istiyorsunuz.

Bunu desteklemek için, yeni bir çalışma alanı oluşturur (veya mevcut bir çalışma alanına bir klasör eklersiniz) ve ayarlarda klasörlerden birinin `deno.enable` ayarını `true` ve diğerinin `false` olarak ayarını yaparsınız. Çalışma alanı yapılandırmasını kaydettiğinizde, Deno dil sunucusunun yalnızca etkinleştirilen klasörlerin üzerinde tanılama uyguladığını ve diğer klasörün TypeScript ve JavaScript dosyaları için tanılama sağlamak üzere VS Code'un yerleşik TypeScript derleyicisini kullandığını fark edeceksiniz.

## Linter

`deno lint` kullanıldığında tanılama sağlayan motor, uzantı aracılığıyla da kullanılabilir. Ayarlar panelinde **Deno: Lint** ayarını etkinleştirerek (veya ayarları JSON biçiminde düzenliyorsanız `deno.lint`), editör kodunuzda lint "uyarılarını" göstermeye başlayacaktır. Deno linter'ı kullanmak için daha fazla bilgi için
`Linter` bölümüne bakın.

## Bir yapılandırma dosyası kullanma

Deno projesi için bir yapılandırma dosyası gerekmemektedir, ancak belirli senaryolar için faydalı olabilir. Komut satırında `--config` seçeneğini belirttiğinizde uygulanan ayarların aynı şekilde uygulanmasını istiyorsanız, **Deno: Config** seçeneğini kullanabilirsiniz (veya manuel düzenleme yapıyorsanız `deno.config`).

Deno uzantısı ayrıca yapılandırma dosyasını bulmak için çalışma alanı kökünde `deno.jsonc` veya `deno.json` dosyasını otomatik olarak tanılar ve uygular. Manuel olarak bir **Deno: Config** seçeneği belirtmek, bu otomatik davranışı geçersiz kılacaktır.

## Biçimlendirme

Deno CLI, `deno fmt` ile erişilebilen
`kendi biçimlendiricisi` ile birlikte gelir, ancak VS Code tarafından kullanılacak şekilde yapılandırılabilir. **Editor: Default formatter** ayarı için açılır listede `Deno` olmalıdır (veya ayarları manuel düzenliyorsanız, bu
`"editor.defaultFormatter": "denoland.vscode-deno"` olacaktır).

## Deno CLI için bir yol ayarlama

Uzantı, Deno CLI yürütülebilir dosyasını ev sahibi bilgisayarın `PATH`'inde arar, ancak bazen bu istenmeyen olabilir ve **Deno: Path** ayarını ayarlayarak (veya manuel düzenleme yapıyorsanız `deno.path`) Deno yürütülebilir dosyasına işaret edebilirsiniz. Verilen yol göreceli ise, çalışma alanının köküne göre çözülecektir.

## İthalat önerileri

Bir modülü içe aktarmaya çalışırken, uzantı içe aktarmayı tamamlamak için öneriler sunacaktır. Yerel göreceli dosyalar önerilere dahil edilecektir ve ayrıca önbelleğe alınmış uzak dosyalar da dahil edilecektir.

Uzantı, bir uzak
kayıt/web sitesi modüllerin otomatik tamamlama desteğini sağlar ve bu durum, istemcinin modülleri keşfetmesine olanak tanıyan metadata sağlayabilir. Varsayılan olarak, uzantı, önerilere destek verip vermediğini kontrol etmek için hostları/orijinleri kontrol eder, eğer veriyorsa, uzantı bunu etkinleştirmek isteyip istemediğinizi soracaktır. Bu davranış, Ayarlar altında **Deno > Suggest > Imports: Auto Discover** kutusunun işaretini kaldırarak değiştirilebilir. (veya manuel düzenleme yapıyorsanız, `deno.suggest.imports.autoDiscover`).

Bireysel hostlar/orijinler, uygun `settings.json` dosyasındaki **Deno > Suggest > Imports: Hosts** ayarını düzenleyerek etkinleştirilebilir veya devre dışı bırakılabilir - `deno.suggest.imports.hosts`.

## Uzak modülleri önbelleğe alma

Deno uzak modülleri destekler ve uzak modülleri alır ve bunları yerel olarak bir önbelleğe kaydeder. `deno run`, `deno test`, `deno info` veya `deno install` komutunu komut satırında çalıştırdığınızda, Deno CLI, herhangi bir uzak modülü ve bağımlılıklarını almak için çalışır ve önbelleği doldurur.

Editörde kod geliştirirken, modül önbellekte değilse, eksik uzak modüller için `Uncached or missing remote URL: "https://deno.land/example/mod.ts"` gibi bir tanılama mesajı alırsınız. Deno, modülü otomatik olarak önbelleğe almayı denemeyecektir, yalnızca bir kayıt otomatik tamamlama önerisinden (yukarıya bakın) geliyorsa.

Komut satırında bir komut çalıştırmanın yanı sıra, uzantı, editörde bağımlılıkları önbelleğe almak için yollar sağlar. Eksik bir bağımlılık, Deno'nun bağımlılığı önbelleğe almak için çaba göstermesi gereken bir _hızlı düzeltme_ ile birlikte gelir. Düzeltmelere CTRL . veya ⌘ . tuşlarına basarak ulaşabilir, ya spesifikasyonda veya spesifikasyonun üzerine gelerek **Quick Fix...** seçeneğini seçebilirsiniz.

Ayrıca, şu anda editörde aktif olan modülün bağımlılıklarını önbelleğe almaya çalışacak olan **Deno: Cache Dependencies** komutu da vardır.

## Kod lensleri

Dil sunucusu, kod içinde daha fazla içgörü elde etmenizi sağlayan birkaç kod lensini desteklemektedir. Çoğu varsayılan olarak devre dışıdır, ancak kolayca etkinleştirilebilir:

### Deno > Kod Lensi: Uygulamalar

`deno.codeLens.implementations` - Bir öğenin kod içinde başka bir yerdeki tüm uygulamalarını listeleyen bir lens sağlar.

### Deno > Kod Lensi: Referanslar

`deno.codeLens.references` - Bir öğeye kod içinde başka bir yerdeki tüm referansları listeleyen bir lens sağlar.

### Deno > Kod Lensi: Tüm Fonksiyonların Referansları

`deno.codeLens.referencesAllFunctions` - Kod içindeki tüm fonksiyonlara ait tüm referansları listeleyen bir lens sağlar. Tüm fonksiyonlar yukarıda bahsedilen _Referanslar_ ayarından hariçtir.

### Test kod lensi

Deno CLI, `Deno.test` altında mevcut olan `yerleşik bir test API'si` içerir. Uzantı ve dil sunucusu, editörden bir testi çalıştırma yeteneğini sağlayan varsayılan olarak etkinleştirilmiş bir kod lensi içermektedir.

Bir test sağlayan bir kod bloğunuz olduğunda:

```ts
import { assert } from "jsr:@std/assert@1";

Deno.test({
  name: "bir test durumu",
  fn() {
    let someCondition = true;
    assert(someCondition);
  },
});
```

Testin hemen üstünde bir kod lensi göreceksiniz:

```console
▶ Testi Çalıştır
```

Kodu lensine tıkladığınızda, uzantı Deno CLI'yi çalıştırarak testi çalıştıracak ve çıktıyı gösterecektir. Diğer ayarlarınıza bağlı olarak, uzantı testinizi aynı ayarlarla çalıştırmaya çalışacaktır. `deno test` yaparken sağlanan argümanları ayarlamak istiyorsanız, `deno.codeLens.testArgs` ayarını belirleyerek bunu yapabilirsiniz.

Uzantı, aynı modülde `Deno.test` fonksiyonunu yok ettiğinizde veya bir değişkene atadığınızda da bunu takip etmeye çalışacaktır. Böylece şu şekilde bir şey yapabilir ve yine de kod lensinin çalışmasını sağlayabilirsiniz:

```ts
const { test: denoTest } = Deno;

denoTest({
  name: "örnek test",
  fn() {},
});
```

Bu özelliği devre dışı bırakmak isterseniz, **Deno > CodeLens: Test** ayarını (yani `deno.codeLens.test`) devre dışı bırakabilirsiniz.

Testleri Test Gezgini görünümünden, kod lensi dekorasyonlarından veya komut paletinden çalıştırabilirsiniz. Ayrıca Test Gezgini görünümündeki filtre fonksiyonunu kullanarak belirli testleri bir test çalıştırmasından hariç tutabilirsiniz.

Bir test başarısız olduğunda, hata mesajı, hata yığını da dahil olmak üzere, VS Code'da test sonuçlarını incelerken mevcut olacaktır.

### Test Yapılandırması

Varsayılan olarak, testler, komut satırında `deno test --allow-all` kullanıyormuşsunuz gibi benzer bir şekilde yürütülmektedir. Bu varsayılan argümanlar, kullanıcı veya çalışma alanı ayarlarınızda **Deno > Testing: Args** seçeneğini ayarlayarak değiştirilebilir (veya manuel olarak ayar yapıyorsanız `deno.testing.args`). Buraya `deno test` alt komutuyla kullanacağınız bireysel argümanları ekleyin.

Sahip olduğunuz diğer ayarlara bağlı olarak, bu seçenekler, **Deno > Testing: Args** ayarında açıkça belirtilmediği sürece otomatik olarak testleri çalıştırırken kullanılan "komut satırına" birleştirilecektir.

## Hata ayıklayıcıyı kullanma

Uzantı, yerleşik VS Code hata ayıklayıcısıyla entegrasyon sağlar. `Run and Debug` paneline giderek, `create a launch.json file` seçeneğine tıklayarak ve mevcut hata ayıklayıcı seçeneklerinden `Deno` seçeneğini seçerek bir yapılandırma oluşturabilirsiniz.

## Görevler

Uzantı dil sunucusu ile doğrudan iletişim kurarken, bazen Deno komutlarını CLI üzerinden çalıştırmayı tercih edebilirsiniz. Çalışma alanınızın kökünde bir `deno.json` dosyası oluşturup `tasks` alanında` görevler tanımlayabilirsiniz.

## Geliştirme konteyneri kullanma

VS Code ile bir
[geliştirme konteyneri](https://code.visualstudio.com/docs/remote/containers) kullanmak, yerel sisteminizde Deno CLI'yi yükleme konusunda endişelenmeden izole bir geliştirme ortamına sahip olmanın harika bir yoludur. Deno geliştirme konteynerlerini destekler ve Deno uzantısı onlarla çalışır.

Geliştirici konteyner desteği eklemek istediğiniz mevcut bir Deno projeniz varsa, komut paletinde **Remote-Containers: Add Development Container Configuration Files...** seçeneğini uygulayın, **Show All Definitions...** seçeneğini seçin ve ardından `Deno` tanımını arayın. Bu, konteynerde Deno CLI'nin en son sürümünü kuracak olan bir temel `.devcontainer` yapılandırması kuracak.

Eklendikten sonra, VS Code, projeyi bir geliştirme konteynerinde açmak isteyip istemediğinizi soracaktır. Seçtiğinizde, VS Code geliştirme konteynerini oluşturacak ve çalışma alanını geliştirme konteyneri ile yeniden açacaktır; bu, Deno CLI ve `vscode_deno` uzantısının yüklü olduğu bir konteyner olacaktır.

## Sorun Giderme

Aşağıdaki bölümler, uzantıyı kullanırken karşılaşabileceğiniz zorlukları kapsamakta ve muhtemel nedenleri belirtmektedir.

### Hatalar/tanılama

:::warning
`Bir ithalat yolu '.ts' uzantısıyla bitemez.` veya `Deno adını bulamıyorum.`
:::

Bu genellikle Deno'nun bir Deno projesinde etkin olmadığı bir durumdur. Tanılama kaynağına bakarsanız, muhtemelen bir `ts(2691)` göreceksiniz. `ts`, bunun VS Code'daki yerleşik TypeScript/JavaScript motorundan geldiğini gösterir. Yapılandırmanızın düzgün ayarlandığından ve **Deno: Enable** ayarının - `deno.enable` olarak doğru olduğundan emin olmak isteyeceksiniz.

Ayrıca, komut paletinden **Deno: Language Server Status** kullanarak Deno dil sunucusunun, mevcut etkin yapılandırmanızı nasıl düşündüğünü kontrol edebilirsiniz. Bu, Deno dil sunucusuna VS Code tarafından rapor edilen bir belgeyi "Çalışma Alanı Yapılandırması" adlı bir bölümle gösterecektir. Bu, VS Code'un dil sunucusuna rapor ettiği yapılandırmayı gösterecektir.

Ayrıca, **TypeScript › Tsserver › Experimental: Enable Project Diagnostics** altında bulunan `enableProjectDiagnostics` adlı VS Code yapılandırmasının **devre dışı** olduğunu kontrol edin. Bu ayar, TypeScript dil sunucusunun arka planda çalışarak projeyi bir seferde kontrol etmesine olanak tanır ve Deno, bu davranışı devre dışı bırakamaz, dolayısıyla diğer ayarlar doğru ayarlansa bile hatalar görünmeye devam eder.

Eğer orada `"enable"` değeri `true` olarak ayarlanmışsa ve hata mesajı hala devam ediyorsa, VS Code'u yeniden başlatmayı deneyebilirsiniz. Zira, yerleşik TypeScript tanılama motorunun dosyalar için "susturulmasını" sağlayan uzantının kısmı doğru çalışmıyor olabilir. Eğer sorun bir yeniden başlatmadan sonra hala devam ediyorsa, beklemediğimiz bir hatayla karşılaşmış olabilirsiniz ve sorunları araştırmak ve bir hata raporu oluşturmak için https://github.com/denoland/vscode_deno adresini ziyaret etmek bir sonraki adım olacaktır.