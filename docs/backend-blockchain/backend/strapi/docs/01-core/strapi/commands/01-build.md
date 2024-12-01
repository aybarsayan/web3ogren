---
title: Yapı
description: build komutu, Strapi yönetici panelini sunulmaya hazır bir SPA olarak derlemek için kullanılır. Bu doküman, `build` komutunun kullanımı, seçenekleri ve yapı sürecine dair önemli bilgileri içermektedir.
keywords: [Strapi, build, yönetici paneli, yapı süreci, CLI]
---

`build` komutu, strapi yönetici panelini strapi sunucusu tarafından sunulmaya hazır bir SPA olarak derlemek için kullanılır.

## Kullanım

```bash
strapi build
```

### Seçenekler

```bash
Strapi yönetici uygulamasını oluştur

Seçenekler:
  -d, --debug        Ayrıntılı günlüklerle hata ayıklama modu etkinleştir (varsayılan: false)
  --minify           Çıktıyı küçült (varsayılan: true)
  --no-optimization  [eski]: bunun yerine küçültmeyi kullan
  --silent           Hiçbir şey yazma (varsayılan: false)
  --sourcemap        Kaynak haritaları üret (varsayılan: false)
  --stats            Derleme istatistiklerini konsola yazdır (varsayılan: false)
  -h, --help         Komut için yardım göster
```

## Nasıl çalışır

:::info
Yönetici paneli için yapı süreci, paketçi agnostik olacak şekilde tasarlanmıştır, bu, yeni paketçilerin ekosistemde mevcut hale gelmesiyle deney yapmayı ve geçiş yapmayı kolaylaştırır.
:::

Bu, yöneticinin paneli oluşturmak için gereken tüm bilgileri içeren bir `BuildContext` kullanımıyla sağlanır – daha fazla bilgi gerekirse bu bağlam ayarlanabilir.

### Bağımlılıklar

Yapı komutunu çalıştırmanın ilk adımı, gerekli bağımlılıkların proje kökünde kurulu olup olmadığını kontrol etmektir. Bu, aşağıdakiler için daha iyi bir DX sağlar:

- yanlış kurulu proje
- monorepo'lar
- belirli paketler için yanlış/uyumsuz paket sürümleri, örneğin `styled-components` veya `react`.

Açıkça kontrol ettiğimiz paketlerin listesi şunlardır:

- `react`
- `react-dom`
- `styled-components`
- `react-router-dom`

> **Önemli Not:** Bunun nedeni, bu paketlerin yalnızca bir kopyasının kurulu olup kullanılabileceğidir; bunu başaramamak, hatalara yol açabilir. Ayrıca, bu paketlerin uyumsuz bir sürümünün istenmeyen yan etkiler yaratabileceği anlamına gelir; örneğin, `react@19` aniden yayınlanırsa ancak bunu yönetici paneliyle test etmemişsek sorun yaşanabilir.  
— Dikkat edildiğinde sorun yaşanmaz.

Bu bağımlılıkları kurmaları için kullanıcıyı teşvik etmek amacıyla bir istem çalıştırıyoruz – ancak bu işlev henüz oluşturulmamıştır.

### BuildContext

Yapı bağlamı, yöneticinin nasıl oluşturulduğunun kalbidir, yukarıda belirtildiği gibi agnostik olup, webpack, vite veya parcel kullanmamızdan bağımsızdır. Herhangi bir paketçiyi hazırlamak için kullanılabilecek bir veri nesnesidir. Yapısı şöyledir:

```ts
interface BuildContext {
  /**
   * Strapi örneği tarafından tanımlanan uygulama dizinine mutlak yol
   */
  appDir: string;
  /**
   * Kullanıcı bir iç içe geçmiş halkasal yolda projeyi dağıtıyorsa, tüm varlık yollarının buna göre yeniden yazılması için bu yolu kullanırız
   */
  basePath: string;
  /**
   * Kullanıcının app.js dosyasında tanımladığı özelleştirmeler
   */
  customisations?: AppFile;
  /**
   * Geçerli çalışma dizini
   */
  cwd: string;
  /**
   * dist dizinine mutlak yol
   */
  distPath: string;
  /**
   * dist dizinine göreli yol
   */
  distDir: string;
  /**
   * Giriş dosyasına mutlak yol
   */
  entry: string;
  /**
   * JS paketinde yer alacak ortamsal değişkenler
   */
  env: Record<string, string>;
  logger: CLIContext['logger'];
  /**
   * Yapı seçenekleri
   */
  options: Pick<BuildOptions, 'minify' | 'sourcemaps' | 'stats'> & Pick<DevelopOptions, 'open'>;
  /**
   * JS paketinde yer alacak eklentiler
   * iç. dahili eklentiler, üçüncü parti eklentiler ve yerel eklentiler
   */
  plugins: Array<{
    path: string;
    name: string;
    importName: string;
  }>;
  /**
   * Çalışma zamanına mutlak yol
   */
  runtimeDir: string;
  /**
   * Strapi örneği
   */
  strapi: Strapi;
  /**
   * Kullanıcının çalışma alanından yüklenen veya varsayılana geri dönen browserslist hedefi
   */
  target: string[];
  tsconfig?: CLIContext['tsconfig'];
}
```

### Statik Dosyalar

Sonraki adım, strapi projesinin kök dizininde bir `runtime` klasörü oluşturmaktır; genel bir isim olarak `.strapi` kullanılır ve yapı özel olarak `client` adlı bir alt klasörü kullanır. Bu, ihtiyaç duydukça genişleme yapmamız için daha fazla alan bırakır. Bunun için yalnızca iki dosya oluşturuyoruz: `@strapi/admin` paketinden statik olarak işlenmiş bir React Bileşeni olan `index.html` (DefaultDocument) ve `renderAdmin` fonksiyonunu çağıran ve bir montaj noktası ve eklenti nesnesi sağlayan bir `entry.js` dosyası.

### Paketleme

Şu anda hem `webpack` hem de `vite` paketleyicilerini destekliyoruz; bunlar arasında varsayılan olarak `vite` bulunmaktadır. Global bir `strapi.config` dosyası olmadığı için kendi paketleyicinizi geçirebileceğiniz önceden var olan bir API'ye sahip değiliz. Gelecekte bir ihtiyaç oluşursa bunu yapmak isteyebiliriz. Her paketleyici bir yapı fonksiyonu ve bir geliştirme fonksiyonu sağlar. Bir servis fonksiyonuna ihtiyacımız yoktur çünkü bunlar yukarıda açıklanan statik dosyalar adımında belirlenen aynı `index.html` çıktısını vermesi beklenmektedir.

## Node Kullanımı

```ts
import { build, BuildOptions } from '@strapi/admin/_internal';

const args: BuildOptions = {
  // ...
};

await build(args);
```

### Seçenekler

```ts
interface BuildOptions extends CLIContext {
  /**
   * Komutun çalıştırıldığı dizin
   */
  cwd: string;
  /**
   * Kullanılacak günlükleyici.
   */
  logger: Logger;
  /**
   * Çıktıyı küçült
   *
   * @varsayılan true
   */
  minify?: boolean;
  /**
   * Kaynak haritaları üret – yönetici paneli UI'sindeki hataları ayıklamak için yararlıdır.
   */
  sourcemaps?: boolean;
  /**
   * Yapı için istatistikleri yazdır
   */
  stats?: boolean;
  /**
   * Yapı için kullanılacak tsconfig. Tanımsızsa, bu bir TS projesi değildir.
   */
  tsconfig?: TsConfig;
}

interface Logger {
  warnings: number;
  errors: number;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
  spinner: (text: string) => Pick<ora.Ora, 'succeed' | 'fail' | 'start' | 'text'>;
}

interface TsConfig {
  config: ts.ParsedCommandLine;
  path: string;
}